// Evidence for the 2026-09-16 (round 2) course-variety fix, addressing the
// user's "predictable rise/fall sequence" report on 11-51-03 and Codex's
// review of the round-1 script. Uses real exported helpers throughout.
// All numbers below come from THIS script -- run it to reproduce them.
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
const PH = CONFIG.playerHeight;
const BODY_WIDTH = CONFIG.playerWidth * 2.16 * 0.8;

function genCourse(seed, n, screenWidth) {
  const rand = procMod.makeRand(seed);
  const list = [{ id: 0, x: 0, topY: 0, width: CONFIG.widthWide.max, cat: 0 }];
  for (let i = 1; i < n; i++) list.push(procMod.generateProceduralPlatform(list[i - 1], i, rand, screenWidth));
  return list;
}
function simulateReal(platforms, startX, startY, vx, vy0, screenWidth, dt = 1 / 240, maxT = 4) {
  let x = startX, y = startY, vy = vy0, t = 0;
  while (t < maxT) {
    const prevX = x, prevBottom = y + PH / 2;
    const flight = jumpMod.advanceFlight(x, y, vx, vy, dt, screenWidth);
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

const SEEDS = [3, 17, 42, 88, 205, 301, 512, 909];
const WIDTHS = [320, 393, 440];

// ---------------------------------------------------------------------------
// 1) REAL topY deltas and gap distances (not class labels) across early/mid/
// late course segments, for one concrete seed+width -- exactly what Codex
// asked for instead of only counting labels.
// ---------------------------------------------------------------------------
console.log("=== 1) Real tower-to-tower deltas, one seed, early/mid/late segments ===");
{
  const course = genCourse(42, 45, 440);
  const seg = (lo, hi) => course.slice(lo, hi).map((p, k) => {
    const prev = course[lo + k - 1] || course[lo - 1];
    return { id: p.id, gap: Math.round(p.x - (prev.x + prev.width)), deltaY: Math.round(p.topY - prev.topY) };
  });
  console.log("early (id 4-11):", seg(4, 12));
  console.log("mid   (id 20-27):", seg(20, 28));
  console.log("late  (id 38-45):", seg(38, 45));
}

// ---------------------------------------------------------------------------
// 2) Progressive difficulty check: realized class PROPORTIONS from ACTUAL
// (reclassified) deltas/gaps, split into early/mid/late bands, across all
// seeds/widths -- confirms the ramp shifts as intended and never fully
// excludes the easy class late.
// ---------------------------------------------------------------------------
console.log("\n=== 2) Realized (actual, not intended) class proportions by course band ===");
function bandStats(lo, hi) {
  const gapCounts = { short: 0, medium: 0, long: 0 };
  const heightCounts = { level: 0, rise: 0, drop: 0 };
  let n = 0, maxGapStreak = 0, maxHeightStreak = 0;
  for (const W of WIDTHS) for (const seed of SEEDS) {
    const course = genCourse(seed, hi + 2, W);
    for (let i = lo; i < hi; i++) {
      const p = course[i];
      if (!p.gapClass) continue;
      n++;
      gapCounts[p.gapClass]++; heightCounts[p.heightClass]++;
      maxGapStreak = Math.max(maxGapStreak, p.gapStreak || 0);
      maxHeightStreak = Math.max(maxHeightStreak, p.heightStreak || 0);
    }
  }
  const pct = (c) => Object.fromEntries(Object.entries(c).map(([k, v]) => [k, Math.round((100 * v) / n) + "%"]));
  return { n, gap: pct(gapCounts), height: pct(heightCounts), maxGapStreak, maxHeightStreak };
}
console.log("early (id 4-10):", bandStats(4, 10));
console.log("mid   (id 18-26):", bandStats(18, 26));
console.log("late  (id 34-44):", bandStats(34, 44));

// ---------------------------------------------------------------------------
// 3) Height streak distribution: confirm the un-capped height class DOES
// occasionally run 3+ in a row now (fixing "forced alternation"), without
// being unbounded/runaway.
// ---------------------------------------------------------------------------
console.log("\n=== 3) Height streak length distribution (uncapped) ===");
{
  const streakHist = {};
  for (const W of WIDTHS) for (const seed of SEEDS) {
    const course = genCourse(seed, 45, W);
    for (let i = 4; i < course.length; i++) {
      const s = course[i].heightStreak || 0;
      streakHist[s] = (streakHist[s] || 0) + 1;
    }
  }
  console.log(streakHist);
}

// ---------------------------------------------------------------------------
// 4) Exact 2-tower / 3-tower opportunity counts (id+2 / id+3 specifically,
// per Codex's correction -- not "nearest+1/+2").
// ---------------------------------------------------------------------------
console.log("\n=== 4) Exact id+2 / id+3 tower-skip opportunities (not nearest-relative) ===");
{
  let hopsChecked = 0, noForwardHit = 0, exactTwo = 0, exactThree = 0;
  for (const W of WIDTHS) for (const seed of SEEDS) {
    const course = genCourse(seed, 30, W);
    for (let i = 4; i < 26; i++) {
      hopsChecked++;
      const prev = course[i];
      const startX = prev.x + prev.width * 0.5, startY = prev.topY - PH / 2;
      const hits = new Set();
      for (let ms = 0; ms <= 450; ms += 5) {
        const v = jumpMod.jumpVelocity(ms / 450, W);
        const r = simulateReal(course.slice(i), startX, startY, v.vx, v.vy, W);
        if (r && r.landedIndex > 0) hits.add(i + r.landedIndex);
      }
      if (!hits.size) { noForwardHit++; continue; }
      if (hits.has(i + 2)) exactTwo++;
      if (hits.has(i + 3)) exactThree++;
    }
  }
  console.log({ hopsChecked, noForwardHit, exactTwoTowerPct: Math.round((100 * exactTwo) / hopsChecked) + "%", exactThreeTowerPct: Math.round((100 * exactThree) / hopsChecked) + "%" });
}

// ---------------------------------------------------------------------------
// 5) Adaptive-player sequential survival (SAVED this time, not ad hoc): each
// hop picks its own nearest-reachable mid-window charge, real carried-
// forward contact.x, ALL platforms, labeled as a successful-window test
// (distinct from a fixed-input comparison).
// ---------------------------------------------------------------------------
console.log("\n=== 5) Adaptive-player sequential survival, 20 hops, all widths/seeds (successful-window test) ===");
{
  const HOPS = 20;
  const results = [];
  for (const W of WIDTHS) for (const seed of SEEDS) {
    const course = genCourse(seed, HOPS + 10, W);
    let idx = 0, x = course[0].x + course[0].width * 0.5, y = course[0].topY - PH / 2;
    let hop = 0;
    for (; hop < HOPS; hop++) {
      const hits = [];
      for (let ms = 0; ms <= 450; ms += 5) {
        const v = jumpMod.jumpVelocity(ms / 450, W);
        const r = simulateReal(course.slice(idx), x, y, v.vx, v.vy, W);
        if (r && r.landedIndex > 0) hits.push({ ms, landed: idx + r.landedIndex });
      }
      if (!hits.length) break;
      const nearest = Math.min(...hits.map((h) => h.landed));
      const win = hits.filter((h) => h.landed === nearest);
      const midMs = win[Math.floor(win.length / 2)].ms;
      const v = jumpMod.jumpVelocity(midMs / 450, W);
      const r = simulateReal(course.slice(idx), x, y, v.vx, v.vy, W);
      if (!r) break;
      idx += r.landedIndex; x = r.x; y = course[idx].topY - PH / 2;
    }
    results.push({ W, seed, survivedHops: hop });
  }
  const allReached = results.every((r) => r.survivedHops === HOPS);
  console.log({ n: results.length, allReached20Hops: allReached, min: Math.min(...results.map((r) => r.survivedHops)), failures: results.filter((r) => r.survivedHops < HOPS) });
}

// ---------------------------------------------------------------------------
// 6) Fixed-input sequential check, reported SEPARATELY from #5 (per the
// standing instruction not to conflate successful-window search with a
// fixed-input comparison). A changed layout need not accept every formerly
// successful press -- this just confirms no crash/invalid state.
// ---------------------------------------------------------------------------
console.log("\n=== 6) Fixed-press (150/250/350ms) sequential replay, reported separately from #5 ===");
{
  const DURATIONS = [150, 250, 350];
  const HOPS = 12;
  for (const ms of DURATIONS) {
    const results = [];
    for (const W of WIDTHS) for (const seed of SEEDS) {
      const course = genCourse(seed, HOPS + 5, W);
      let idx = 0, x = course[0].x + course[0].width * 0.5, y = course[0].topY - PH / 2;
      const v = jumpMod.jumpVelocity(ms / 450, W);
      let hop = 0;
      for (; hop < HOPS; hop++) {
        const r = simulateReal(course, x, y, v.vx, v.vy, W);
        if (!r || r.landedIndex <= idx) break;
        idx = r.landedIndex; x = r.x; y = course[idx].topY - PH / 2;
      }
      results.push(hop);
    }
    console.log({ pressMs: ms, n: results.length, avgSurvivedHops: Math.round((10 * results.reduce((a, b) => a + b, 0)) / results.length) / 10, min: Math.min(...results), max: Math.max(...results) });
  }
}
