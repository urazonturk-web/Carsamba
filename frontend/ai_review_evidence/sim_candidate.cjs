// Simulation for the horizontalChargePlateau candidate, using the REAL
// exported game functions (no hand-duplicated physics/collision math).
// Node.js, run with: node sim_candidate.cjs
const fs = require("fs"), vm = require("vm");
const root = "/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend";
const ts = require(root + "/node_modules/typescript");
function load(p, imp = {}) {
  const exports = {};
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync(root + p, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText,
    { exports, require: (id) => imp[id] }
  );
  return exports;
}
const cfgMod = load("/src/game/config.ts");
const jumpMod = load("/src/game/jump.ts", { "./config": cfgMod });
const landMod = load("/src/game/landing.ts", { "./config": cfgMod });
const course = load("/src/game/reference-course.ts");

const CONFIG = cfgMod.CONFIG; // the SAME object jump.ts/landing.ts read from -- mutate in place to test candidates
const BASELINE_PLATEAU = CONFIG.horizontalChargePlateau; // 1, as shipped
const W = 440, ZOOM = 0.62;
const PH = CONFIG.playerHeight;
const CHARACTER_WIDTH = CONFIG.playerWidth * 2.16;
const BODY_WIDTH = CHARACTER_WIDTH * 0.8;

function withPlateau(plateau, fn) {
  const prev = CONFIG.horizontalChargePlateau;
  CONFIG.horizontalChargePlateau = plateau;
  try { return fn(); } finally { CONFIG.horizontalChargePlateau = prev; }
}

// Real per-frame loop, mirrors app/index.tsx's AIRBORNE branch: uses the
// actual exported jumpMod.advanceFlight and landMod.findFootLanding.
function simulateReal(platforms, startX, startY, vx, vy0, dt = 1 / 240, maxT = 4) {
  let x = startX, y = startY, vy = vy0, t = 0;
  while (t < maxT) {
    const prevX = x, prevBottom = y + PH / 2;
    const flight = jumpMod.advanceFlight(x, y, vx, vy, dt, W);
    x = flight.x; y = flight.y; vy = flight.vy;
    const newBottom = y + PH / 2;
    if (vy > 0) {
      const contact = landMod.findFootLanding(platforms, prevX, x, prevBottom, newBottom, BODY_WIDTH);
      if (contact) return { landedIndex: contact.index, x: contact.x, t };
    }
    if (newBottom > 4000) return null; // fell well past any platform
    t += dt;
  }
  return null;
}

function sweepWindow(platforms, startX, startY, targetIndex, plateau, msLo = 0, msHi = 450, step = 1) {
  return withPlateau(plateau, () => {
    const hits = [];
    for (let ms = msLo; ms <= msHi; ms += step) {
      const c = ms / 450;
      const v = jumpMod.jumpVelocity(c, W);
      const r = simulateReal(platforms, startX, startY, v.vx, v.vy);
      if (r && r.landedIndex === targetIndex) hits.push(ms);
    }
    if (!hits.length) return null;
    return { minMs: hits[0], maxMs: hits[hits.length - 1], widthMs: hits[hits.length - 1] - hits[0], count: hits.length };
  });
}

// ---------------------------------------------------------------------------
// TEST 1: first jump (kule0 -> kule1), baseline vs candidate. Center-spawn
// here is CORRECT (not an approximation): app/index.tsx's initWorld spawns
// ONLY the very first tower of a life centered -- this is the one real case
// where a centered start matches the actual game exactly.
// ---------------------------------------------------------------------------
console.log("=== TEST 1: first jump kule0->kule1 (center spawn is the REAL rule here) ===");
const p0 = course.referencePlatform(0, W, ZOOM), p1 = course.referencePlatform(1, W, ZOOM);
const platformsFirst = [p0, p1, course.referencePlatform(2, W, ZOOM), course.referencePlatform(3, W, ZOOM)];
const startX1 = p0.x + p0.width * 0.5, startY1 = p0.topY - PH / 2;
for (const plateau of [BASELINE_PLATEAU, 1.15]) {
  console.log({ plateau, window: sweepWindow(platformsFirst, startX1, startY1, 1, plateau) });
}

// ---------------------------------------------------------------------------
// TEST 2: multi-tower skips from kule6. NOTE: kule6 is NOT the first tower of
// a life, so a centered spawn here is an APPROXIMATION (matches the
// convention already used for these numbers in CLAUDE_LONGJUMP_RESULT.md),
// not a claim about the exact real contact.x that reached kule6. See
// sim_sequential.cjs for non-centered, carried-forward contact positions.
// ---------------------------------------------------------------------------
console.log("\n=== TEST 2: kule6 -> kule8 (2-skip) and kule6 -> kule9 (3-skip) [APPROXIMATE: centered spawn] ===");
const platformsFrom6 = [6, 7, 8, 9, 10].map((i) => course.referencePlatform(i, W, ZOOM));
const p6 = platformsFrom6[0];
const startX6 = p6.x + p6.width * 0.5, startY6 = p6.topY - PH / 2;
for (const plateau of [BASELINE_PLATEAU, 1.15]) {
  const w8 = sweepWindow(platformsFrom6, startX6, startY6, 2, plateau);
  const w9 = sweepWindow(platformsFrom6, startX6, startY6, 3, plateau);
  console.log({ plateau, kule8: w8, kule9: w9 });
}

// ---------------------------------------------------------------------------
// TEST 3: reconstructed real overshoot (score4 -> next tower), from this
// session's own fresh native-pixel measurement (ai_review_evidence/frames/
// B_gap_measure.png): native gap=451px, native height-gain=160px, scale=1.86
// (cameraZoom 0.62 * devicePixelRatio 3). world gap=242.5, world height=-86.0.
// CAVEAT (per Codex review): the launch tower itself was reached by an
// earlier jump in the recording whose exact non-centered contact.x on that
// tower was not independently re-measured this round -- centering the start
// here is an APPROXIMATION of the real takeoff position, not a measurement.
// ---------------------------------------------------------------------------
console.log("\n=== TEST 3: reconstructed real overshoot (score4 -> next tower) [APPROXIMATE: centered launch] ===");
const TW = 28 * W / (330 * ZOOM); // reference tower width at W=440
const launchP = { id: 0, x: 0, topY: 0, width: TW, cat: 1 };
const nextP = { id: 1, x: TW + 242.5, topY: -86.0, width: TW, cat: 1 };
const platformsOvershoot = [launchP, nextP];
const startX3 = launchP.x + launchP.width * 0.5, startY3 = launchP.topY - PH / 2;
for (const plateau of [BASELINE_PLATEAU, 1.15]) {
  const rActual = withPlateau(plateau, () => {
    const vActual = jumpMod.jumpVelocity(379 / 450, W);
    return simulateReal(platformsOvershoot, startX3, startY3, vActual.vx, vActual.vy);
  });
  const w = sweepWindow(platformsOvershoot, startX3, startY3, 1, plateau, 0, 450, 1);
  console.log({ plateau, actual379ms: rActual ? "LANDS on next tower" : "MISSES (falls through)", safeWindowForNextTower: w });
}
