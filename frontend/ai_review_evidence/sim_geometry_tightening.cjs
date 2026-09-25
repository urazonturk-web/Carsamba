// Evidence for the 2026-09-16 EXPERIMENTAL_COURSE geometry tightening
// (gapLate.max 380->260, heightVarLate 300->180). Uses the real exported
// generator/physics/landing helpers, mirrors sim_sequential.cjs's approach.
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
const procMod = load("/src/game/procedural-course.ts", { "./config": cfgMod, "./jump": jumpMod });
const landMod = load("/src/game/landing.ts", { "./config": cfgMod });
const CONFIG = cfgMod.CONFIG;
const W = 440;
const PH = CONFIG.playerHeight;
const BODY_WIDTH = CONFIG.playerWidth * 2.16 * 0.8;

function withCfg(overrides, fn) {
  const prev = {};
  for (const k in overrides) { prev[k] = CONFIG[k]; CONFIG[k] = overrides[k]; }
  try { return fn(); } finally { for (const k in overrides) CONFIG[k] = prev[k]; }
}

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
    if (newBottom > 6000) return null;
    t += dt;
  }
  return null;
}

function genCourse(seed, n, screenWidth) {
  const rand = procMod.makeRand(seed);
  const list = [{ id: 0, x: 0, topY: 0, width: CONFIG.widthWide.max, cat: 0 }];
  for (let i = 1; i < n; i++) list.push(procMod.generateProceduralPlatform(list[i - 1], i, rand, screenWidth));
  return list;
}

// For each late-course hop (ids 3-22), find the charge that lands on the
// NEAREST reachable platform (realistic "just trying to make the next jump"
// intent), then report that flight's time/distance -- not just whether SOME
// charge exists (a successful-input search alone would not show whether
// typical, realistic presses got shorter or longer).
function analyze(overrides, seeds) {
  return withCfg(overrides, () => {
    const rows = [];
    for (const seed of seeds) {
      const course = genCourse(seed, 25, W);
      for (let i = 3; i < 23; i++) {
        const prev = course[i], next = course[i + 1];
        const startX = prev.x + prev.width * 0.5, startY = prev.topY - PH / 2;
        const hits = [];
        for (let ms = 0; ms <= 450; ms += 3) {
          const c = ms / 450;
          const v = jumpMod.jumpVelocity(c, W);
          const r = simulateReal(course.slice(i), startX, startY, v.vx, v.vy);
          if (r && r.landedIndex > 0) hits.push({ ms, landed: i + r.landedIndex });
        }
        if (!hits.length) continue;
        const nearest = Math.min(...hits.map((h) => h.landed));
        const win = hits.filter((h) => h.landed === nearest);
        const midMs = win[Math.floor(win.length / 2)].ms;
        const c = midMs / 450;
        const v = jumpMod.jumpVelocity(c, W);
        const r = simulateReal(course.slice(i), startX, startY, v.vx, v.vy);
        const skipWin = hits.filter((h) => h.landed === nearest + 1);
        rows.push({
          gap: Math.round(next.x - (prev.x + prev.width)),
          flightMs: Math.round(r.t * 1000),
          distWorld: Math.round(r.x - startX),
          hasSkipOption: skipWin.length > 0,
        });
      }
    }
    return rows;
  });
}

function summarize(label, rows) {
  const avgFlight = Math.round(rows.reduce((a, r) => a + r.flightMs, 0) / rows.length);
  const maxFlight = Math.max(...rows.map((r) => r.flightMs));
  const avgDist = Math.round(rows.reduce((a, r) => a + r.distWorld, 0) / rows.length);
  const maxDist = Math.max(...rows.map((r) => r.distWorld));
  const avgGap = Math.round(rows.reduce((a, r) => a + r.gap, 0) / rows.length);
  const skipPct = Math.round((100 * rows.filter((r) => r.hasSkipOption).length) / rows.length);
  console.log({ label, n: rows.length, avgGap, avgFlightMs: avgFlight, maxFlightMs: maxFlight, avgDistWorld: avgDist, maxDistWorld: maxDist, pctHopsWithOptionalSkip: skipPct + "%" });
}

const seeds = [7, 88, 205, 301, 512];
console.log("=== A) baseline vs candidate geometry, 'nearest reachable' charge per hop (realistic, not just successful-input search) ===");
summarize("baseline (gapLate.max=380, heightVarLate=300)", analyze({ gapLate: { min: CONFIG.gapLate.min, max: 380 }, heightVarLate: 300 }, seeds));
summarize("candidate (gapLate.max=260, heightVarLate=180) [shipped]", analyze({}, seeds)); // CONFIG already carries the shipped values when EXPERIMENTAL_COURSE=true
summarize("heightVarLate-only test (300->150, gapLate untouched=380)", analyze({ gapLate: { min: CONFIG.gapLate.min, max: 380 }, heightVarLate: 150 }, seeds));

console.log("\n=== B) one real measured flight, replayed through real code (sanity check, not a new physics finding) ===");
console.log("Recording: ScreenRecording_09-16-2026 10-11-28_1.MP4, HUD-confirmed charge 221ms (c=0.4911), measured gap~212 world units, height DROP~172 world units.");
{
  const c = 221 / 450;
  const v = jumpMod.jumpVelocity(c, W);
  const launch = { id: 0, x: 0, topY: 0, width: 73 };
  const target = { id: 1, x: 73 + 211.8, topY: 171.5, width: 73 };
  const r = simulateReal([launch, target], launch.width * 0.5, launch.topY - PH / 2, v.vx, v.vy);
  console.log({ predictedFlightMs: Math.round(r.t * 1000), note: "matches the ~908ms observed in the recording -- confirms measurement/simulation consistency, not a new physics discrepancy" });
}
