// PERMANENT regression test for the worklet-declaration-order crash that hit
// app startup: a "worklet" function (generateProceduralPlatform) referenced
// another worklet helper (lerp) that was declared AFTER it in
// src/game/procedural-course.ts. The Reanimated/worklets Babel
// plugin turns every top-level worklet function into a `const NAME = (IIFE
// factory)(...)` -- unlike a plain `function` declaration, a `const` is NOT
// hoisted, so at real module-load time the earlier-declared worklet's
// closure-building code tried to read `lerp` before its own const binding had
// run, leaving it undefined in
// generateProceduralPlatform's `__closure` -- an app-startup crash the first
// time either helper was actually called, not a build-time error (transform
// succeeds either way; only executing the transformed module and inspecting
// its closure reveals the bug).
//
// This test runs the file through the REAL Metro/Expo iOS transform
// (babel-preset-expo with an explicit iOS/Metro/Hermes `caller`, matching
// what Metro actually passes -- not a plain tsc/ts-node strip, which cannot
// reproduce this class of bug), then directly inspects
// `generateProceduralPlatform.__closure.lerp` for both the current source
// (must be a function) and
// a reconstructed pre-fix ordering (must fail, and specifically with the
// expected "missing helper" symptom -- any other error is reported as a
// broken/inconclusive test, not treated as a pass).
//
// Run with: node test_worklet_order_regression.cjs
// Exit code 0 = both checks passed as expected; 1 = regression test itself
// is broken, inconclusive, or the current source has regressed.
const fs = require("fs"), path = require("path"), os = require("os"), vm = require("vm");
const babel = require("@babel/core");
const ts = require("typescript");

const root = "/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend";

// All scratch files live under the OS temp directory in their own
// process-unique subfolder, removed in a `finally` so nothing is left behind
// even if the transform or execution throws partway through.
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "worklet-order-test-"));

function loadTs(p, imp = {}) {
  const exportsObj = {};
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync(root + p, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText,
    { exports: exportsObj, require: (id) => imp[id] }
  );
  return exportsObj;
}
// config.ts/jump.ts are plain (non-worklet-processed) here, matching this
// project's other test scripts -- only procedural-course.ts, the file that
// actually crashed, needs the REAL worklet transform for this specific test.
const cfgMod = loadTs("/src/game/config.ts");
const jumpMod = loadTs("/src/game/jump.ts", { "./config": cfgMod });

// Explicit iOS/Metro/Hermes caller, matching what Metro actually passes to
// babel-preset-expo when bundling this app for a real iOS device/simulator
// (see node_modules/babel-preset-expo/build/common.js: bundler/platform/
// engine/isDev are all read via api.caller(...)).
const IOS_METRO_CALLER = {
  name: "metro",
  bundler: "metro",
  platform: "ios",
  engine: "hermes",
  isDev: true,
  isServer: false,
};

function transformAndInspect(tsSource, label) {
  const tmpFile = path.join(tmpDir, `worklet_order_${label}.ts`);
  fs.writeFileSync(tmpFile, tsSource);
  let code;
  try {
    const out = babel.transformFileSync(tmpFile, {
      babelrc: false,
      configFile: false,
      presets: ["babel-preset-expo"],
      caller: IOS_METRO_CALLER,
    });
    code = out.code;
  } catch (e) {
    return { stage: "transform", error: e };
  }
  try {
    const sandboxExports = {};
    const sandboxModule = { exports: sandboxExports };
    vm.runInNewContext(code, {
      module: sandboxModule,
      exports: sandboxExports,
      require: (id) => {
        if (id === "./config") return cfgMod;
        if (id === "./jump") return jumpMod;
        throw new Error("unexpected require: " + id);
      },
      global: { Error, __DEV__: true },
      Math, Object,
    });
    const fn = sandboxExports.generateProceduralPlatform;
    if (typeof fn !== "function") {
      return { stage: "inspect", error: new Error("generateProceduralPlatform was not exported as a function") };
    }
    const closure = fn.__closure;
    if (!closure || typeof closure !== "object") {
      return { stage: "inspect", error: new Error("generateProceduralPlatform.__closure is missing -- not a worklet-transformed function") };
    }
    const lerpIsFn = typeof closure.lerp === "function";
    if (!lerpIsFn) {
      return {
        stage: "inspect",
        error: new Error(
          `generateProceduralPlatform.__closure captured lerp as ${typeof closure.lerp} (must be "function")`
        ),
        expectedMissingHelperSymptom: true,
      };
    }
    // Also exercise the actual call, as a second, independent confirmation
    // that the captured functions genuinely work (not just typeof-correct).
    const prev = { id: 0, x: 0, topY: 0, width: cfgMod.CONFIG.widthWide.max, cat: 0 };
    const result = fn(prev, 10, () => 0.5, 440);
    if (typeof result.x !== "number" || Number.isNaN(result.x)) {
      return { stage: "call", error: new Error("generateProceduralPlatform returned an invalid platform: " + JSON.stringify(result)) };
    }
    return { ok: true, closure, result };
  } catch (e) {
    return { stage: "execute", error: e };
  } finally {
    fs.unlinkSync(tmpFile);
  }
}

let currentResult, brokenResult;
try {
  // --- 1) Current source (as shipped) -- must PASS, with lerp confirmed as
  // an actual function in the closure. --------------------------------------
  const currentSource = fs.readFileSync(root + "/src/game/procedural-course.ts", "utf8");
  currentResult = transformAndInspect(currentSource, "current");

  // --- 2) Reconstructed BROKEN ordering (lerp moved after its
  // caller, exactly the pre-fix layout) -- must fail with the SPECIFIC
  // "missing helper" symptom, not just any error. ---------------------------
  const lerpBlockPattern = /export function lerp\(a: number, b: number, t: number\) \{[\s\S]*?\n\}\n/;
  if (!lerpBlockPattern.test(currentSource)) {
    console.error("FAIL (test setup): could not locate the lerp block in procedural-course.ts to reconstruct the broken ordering -- the source structure changed; update this test's pattern.");
    process.exitCode = 1;
  } else {
    const lerpBlockText = currentSource.match(lerpBlockPattern)[0];
    const brokenSource = currentSource.replace(lerpBlockPattern, "") + "\n" + lerpBlockText;
    brokenResult = transformAndInspect(brokenSource, "broken");
  }
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

// --- Verdict ---------------------------------------------------------------
console.log("=== Worklet declaration-order regression test (real babel-preset-expo, iOS/Metro/Hermes caller) ===");
console.log("temp dir (removed):", tmpDir);

if (currentResult.ok) {
  console.log(`Current source: PASS -- __closure.lerp is a function, call succeeded.`);
} else {
  console.log(`Current source: FAIL at ${currentResult.stage}: ${currentResult.error.message}`);
}

let brokenVerdict;
if (!brokenResult) {
  brokenVerdict = "inconclusive (setup failed, see above)";
} else if (brokenResult.ok) {
  brokenVerdict = "UNEXPECTEDLY PASSED -- this test does not discriminate the known bug!";
} else if (brokenResult.expectedMissingHelperSymptom) {
  brokenVerdict = `correctly failed with the EXPECTED symptom: ${brokenResult.error.message}`;
} else {
  // Some other compile/runtime error -- do NOT count this as the test
  // successfully detecting the known regression.
  brokenVerdict = `failed, but NOT with the expected symptom (stage=${brokenResult.stage}): ${brokenResult.error.message} -- inconclusive, not accepted as proof this test catches the known bug`;
}
console.log("Reconstructed broken ordering:", brokenVerdict);

const brokenCorrectlyDetected = !!(brokenResult && !brokenResult.ok && brokenResult.expectedMissingHelperSymptom);

if (currentResult.ok && brokenCorrectlyDetected) {
  console.log("\nRESULT: PASS -- current ordering works (closure functions verified), and this test correctly catches the pre-fix ordering via the exact expected symptom.");
  process.exit(0);
} else if (!currentResult.ok) {
  console.log("\nRESULT: FAIL -- the CURRENT shipped source is broken (regressed). Do not ship.");
  process.exit(1);
} else {
  console.log("\nRESULT: FAIL -- the broken-ordering reconstruction did not fail with the expected missing-helper symptom, so this test cannot be trusted to catch the original bug.");
  process.exit(1);
}
