// CORRECTED per Codex review of sim_geometry_tightening.cjs:
// - Uses a FIXED set of press durations (short/medium/long), the SAME on
//   baseline and candidate geometry, on PAIRED seeds -- no per-config
//   successful-input search, no re-centering between hops (real
//   carried-forward contact.x, like sim_sequential.cjs).
// - Explicitly verifies free-flight trajectories are identical for identical
//   inputs (physics untouched by this change).
// - Reports 2-tower and 3-tower skip windows SEPARATELY, not a single
//   "hasSkipOption" that only checked nearest+1.
// - States plainly that this is a playtest hypothesis, not a proof that the
//   candidate is "the fix" for the reported post-apex feel.
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

// ---------------------------------------------------------------------------
// 0) Physics-identity sanity check (Codex point #2): same inputs must give
// the same free-flight trajectory regardless of geometry config.
// ---------------------------------------------------------------------------
console.log("=== 0) Physics-identity check: same inputs, baseline vs candidate config ===");
{
  const v = jumpMod.jumpVelocity(280 / 450, W);
  const dummyPlatforms = [{ id: 0, x: 0, topY: 0, width: 60 }]; // no contact platform in range -> pure free flight
  const trackA = [], trackB = [];
  const runFree = (track) => {
    let x = 50, y = -PH / 2, vy = v.vy, t = 0;
    for (let i = 0; i < 100; i++) {
      const flight = jumpMod.advanceFlight(x, y, v.vx, vy, 1 / 240, W);
      x = flight.x; y = flight.y; vy = flight.vy; t += 1 / 240;
      track.push({ x, y });
    }
  };
  withCfg({ gapLate: { min: CONFIG.gapLate.min, max: 380 }, heightVarLate: 300 }, () => runFree(trackA));
  withCfg({ gapLate: { min: CONFIG.gapLate.min, max: 260 }, heightVarLate: 180 }, () => runFree(trackB));
  const identical = trackA.every((p, i) => p.x === trackB[i].x && p.y === trackB[i].y);
  console.log({ identicalFreeFlightTrajectory: identical, note: "confirms geometry config cannot change a given press's free-flight path -- it can only change WHEN/whether that path first hits a platform" });
}

// ---------------------------------------------------------------------------
// 1) Fixed-duration, paired-seed, sequential runs -- SAME presses replayed on
// baseline vs candidate geometry, real carried-forward contact.x throughout.
// ---------------------------------------------------------------------------
console.log("\n=== 1) Fixed short/medium/long presses, paired seeds, sequential (real carried-forward positions) ===");
const DURATIONS = { short: 150, medium: 250, long: 350 };
const SEEDS = [7, 88, 205, 301, 512];
const HOPS = 12;

function runFixed(seed, ms, geometryOverrides) {
  return withCfg(geometryOverrides, () => {
    const course = genCourse(seed, HOPS + 5, W);
    let idx = 0;
    let x = course[0].x + course[0].width * 0.5;
    let y = course[0].topY - PH / 2;
    const c = ms / 450;
    const v = jumpMod.jumpVelocity(c, W);
    let towersAdvanced = 0;
    for (let hop = 0; hop < HOPS; hop++) {
      const r = simulateReal(course, x, y, v.vx, v.vy);
      if (!r || r.landedIndex <= idx) return { diedAtHop: hop, towersAdvanced };
      towersAdvanced += r.landedIndex - idx;
      idx = r.landedIndex;
      x = r.x;
      y = course[idx].topY - PH / 2;
    }
    return { diedAtHop: null, towersAdvanced };
  });
}

const BASELINE_GEO = { gapLate: { min: CONFIG.gapLate.min, max: 380 }, heightVarLate: 300 };
const CANDIDATE_GEO = { gapLate: { min: CONFIG.gapLate.min, max: 260 }, heightVarLate: 180 };

let divergences = 0;
for (const [label, ms] of Object.entries(DURATIONS)) {
  for (const seed of SEEDS) {
    const b = runFixed(seed, ms, BASELINE_GEO);
    const c = runFixed(seed, ms, CANDIDATE_GEO);
    const diverged = b.diedAtHop !== c.diedAtHop;
    if (diverged) divergences++;
    console.log({ press: label, ms, seed, baseline: b, candidate: c, diverged });
  }
}
console.log(`\nTotal (press x seed) combinations: ${Object.keys(DURATIONS).length * SEEDS.length}, divergent survival outcomes: ${divergences}`);

// ---------------------------------------------------------------------------
// 2) 2-tower AND 3-tower skip windows, reported SEPARATELY, including the
// "no forward hit at all" case explicitly.
// ---------------------------------------------------------------------------
console.log("\n=== 2) 2-tower and 3-tower skip windows, separately, baseline vs candidate ===");
function skipWindows(geometryOverrides, seeds) {
  return withCfg(geometryOverrides, () => {
    const rows = [];
    for (const seed of seeds) {
      const course = genCourse(seed, 25, W);
      for (let i = 3; i < 20; i++) {
        const prev = course[i];
        const startX = prev.x + prev.width * 0.5, startY = prev.topY - PH / 2;
        const hits = [];
        for (let ms = 0; ms <= 450; ms += 3) {
          const v = jumpMod.jumpVelocity(ms / 450, W);
          const r = simulateReal(course.slice(i), startX, startY, v.vx, v.vy);
          if (r && r.landedIndex > 0) hits.push({ ms, landed: i + r.landedIndex });
        }
        if (!hits.length) { rows.push({ id: i, noForwardHit: true }); continue; }
        const nearest = Math.min(...hits.map((h) => h.landed));
        const twoSkip = hits.filter((h) => h.landed === nearest + 1);
        const threeSkip = hits.filter((h) => h.landed === nearest + 2);
        rows.push({
          id: i,
          noForwardHit: false,
          twoTowerWindowMs: twoSkip.length ? twoSkip[twoSkip.length - 1].ms - twoSkip[0].ms : 0,
          hasTwoTower: twoSkip.length > 0,
          threeTowerWindowMs: threeSkip.length ? threeSkip[threeSkip.length - 1].ms - threeSkip[0].ms : 0,
          hasThreeTower: threeSkip.length > 0,
        });
      }
    }
    return rows;
  });
}
for (const [label, geo] of [["baseline", BASELINE_GEO], ["candidate", CANDIDATE_GEO]]) {
  const rows = skipWindows(geo, SEEDS);
  const withHit = rows.filter((r) => !r.noForwardHit);
  const pctNoForwardHit = Math.round((100 * rows.filter((r) => r.noForwardHit).length) / rows.length);
  const pctTwo = Math.round((100 * withHit.filter((r) => r.hasTwoTower).length) / withHit.length);
  const pctThree = Math.round((100 * withHit.filter((r) => r.hasThreeTower).length) / withHit.length);
  console.log({ label, n: rows.length, pctNoForwardHit: pctNoForwardHit + "%", pctHopsWithTwoTowerOption: pctTwo + "%", pctHopsWithThreeTowerOption: pctThree + "%" });
}

// ---------------------------------------------------------------------------
// 3) Interpolation-scope correction (Codex point #4): heightVarLate/gapLate.max
// are the t=1 ENDPOINT of a ramp that starts blending from id > warmupTowers,
// not a value that only applies at "late" ids.
// ---------------------------------------------------------------------------
console.log("\n=== 3) Interpolation scope: t = min(1, id/difficultyRamp) at representative ids ===");
for (const id of [4, 10, 20, 40, 60]) {
  const t = Math.min(1, id / CONFIG.difficultyRamp);
  console.log({ id, t: t.toFixed(2), note: t < 1 ? "already blending toward the changed heightVarLate/gapLate.max endpoint" : "fully at the changed endpoint" });
}
