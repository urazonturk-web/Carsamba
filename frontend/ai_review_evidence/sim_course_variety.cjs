// Evidence for the 2026-09-16 mixed gap/height course-variety change
// (categorical short/medium/long gaps, rise/drop/level heights, anti-streak
// caps, on top of the already-liked gapLate.max=260/heightVarLate=180
// geometry). Uses the real exported generator/physics/landing helpers.
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
// 1) Class proportions, streaks, and "impossible sampled transitions"
// (a class whose own minimum couldn't be honored once the real physics
// reachability clamp was applied -- i.e. the actual gap fell outside the
// nominal class range because reachableGap cut below gMin).
// ---------------------------------------------------------------------------
console.log("=== 1) Gap/height class proportions, streaks, and clamp-below-minimum events ===");
{
  const gapCounts = { short: 0, medium: 0, long: 0 };
  const heightCounts = { level: 0, rise: 0, drop: 0 };
  let maxGapStreak = 0, maxHeightStreak = 0;
  let clampedBelowGapMin = 0, total = 0;
  const jointCounts = {}; // gapClass -> heightClass -> count
  for (const screenWidth of WIDTHS) {
    for (const seed of SEEDS) {
      const course = genCourse(seed, 40, screenWidth);
      for (let i = 4; i < course.length; i++) { // skip warm-up (id<=3)
        const p = course[i], prev = course[i - 1];
        total++;
        if (p.gapClass) gapCounts[p.gapClass]++;
        if (p.heightClass) heightCounts[p.heightClass]++;
        if (p.gapStreak) maxGapStreak = Math.max(maxGapStreak, p.gapStreak);
        if (p.heightStreak) maxHeightStreak = Math.max(maxHeightStreak, p.heightStreak);
        if (p.gapClass && p.heightClass) {
          jointCounts[p.gapClass] = jointCounts[p.gapClass] || { level: 0, rise: 0, drop: 0 };
          jointCounts[p.gapClass][p.heightClass]++;
        }
        // Was the ACTUAL realized gap below the nominal class minimum
        // (meaning reachability clamped it, per Codex's earlier point that
        // clamping is legitimate and expected, but worth counting)?
        const actualGap = p.x - (prev.x + prev.width);
        const nominalMin = p.gapClass === "short" ? CONFIG.gapEarly.min : p.gapClass === "medium" ? 150 : p.gapClass === "long" ? 220 : null;
        if (nominalMin !== null && actualGap < nominalMin - 0.5) clampedBelowGapMin++;
      }
    }
  }
  console.log({ totalSampled: total, gapProportions: pct(gapCounts, total), heightProportions: pct(heightCounts, total), maxGapStreakObserved: maxGapStreak, maxHeightStreakObserved: maxHeightStreak, clampedBelowGapMinCount: clampedBelowGapMin, clampedBelowGapMinPct: Math.round((100 * clampedBelowGapMin) / total) + "%" });
  console.log("Joint gapClass x heightClass counts (checking long gaps aren't systematically paired with the hardest rise/drop):");
  for (const g of ["short", "medium", "long"]) {
    const row = jointCounts[g] || { level: 0, rise: 0, drop: 0 };
    const rowTotal = row.level + row.rise + row.drop;
    console.log({ gapClass: g, n: rowTotal, heightSplit: pct(row, rowTotal) });
  }
}
function pct(counts, total) {
  const out = {};
  for (const k in counts) out[k] = Math.round((100 * counts[k]) / total) + "%";
  return out;
}

// ---------------------------------------------------------------------------
// 2) Successful-window reachability (which charges reach ANY forward
// platform at all -- confirms no dead ends), reported separately from any
// fixed-input claim.
// ---------------------------------------------------------------------------
console.log("\n=== 2) Successful-window reachability: does at least one charge reach forward from every hop? ===");
{
  let hopsChecked = 0, hopsWithNoForwardHit = 0;
  let twoTowerCount = 0, threeTowerCount = 0;
  for (const screenWidth of WIDTHS) {
    for (const seed of SEEDS) {
      const course = genCourse(seed, 30, screenWidth);
      for (let i = 4; i < 26; i++) {
        hopsChecked++;
        const prev = course[i];
        const startX = prev.x + prev.width * 0.5, startY = prev.topY - PH / 2;
        const hits = [];
        for (let ms = 0; ms <= 450; ms += 5) {
          const v = jumpMod.jumpVelocity(ms / 450, screenWidth);
          const r = simulateReal(course.slice(i), startX, startY, v.vx, v.vy, screenWidth);
          if (r && r.landedIndex > 0) hits.push(i + r.landedIndex);
        }
        if (!hits.length) { hopsWithNoForwardHit++; continue; }
        const nearest = Math.min(...hits);
        if (hits.includes(nearest + 1)) twoTowerCount++;
        if (hits.includes(nearest + 2)) threeTowerCount++;
      }
    }
  }
  console.log({ hopsChecked, hopsWithNoForwardHit, pctTwoTowerOption: Math.round((100 * twoTowerCount) / hopsChecked) + "%", pctThreeTowerOption: Math.round((100 * threeTowerCount) / hopsChecked) + "%" });
}

// ---------------------------------------------------------------------------
// 3) Fixed-input sequential replay (short/medium/long PRESS durations, real
// carried-forward positions, all platforms) -- reported separately from the
// reachability-window check above, per the standing instruction not to
// conflate the two. This is a health check on the NEW generator alone (no
// "baseline" to diff against here, since this replaces the single-range
// generator directly), confirming ordinary fixed presses behave sanely
// (survive a reasonable number of hops, no crashes/NaNs/stuck states).
// ---------------------------------------------------------------------------
console.log("\n=== 3) Fixed-press sequential survival (150/250/350ms), all widths/seeds, real carried-forward positions ===");
{
  const DURATIONS = [150, 250, 350];
  const HOPS = 12;
  const results = [];
  for (const screenWidth of WIDTHS) {
    for (const seed of SEEDS) {
      for (const ms of DURATIONS) {
        const course = genCourse(seed, HOPS + 5, screenWidth);
        let idx = 0, x = course[0].x + course[0].width * 0.5, y = course[0].topY - PH / 2;
        const v = jumpMod.jumpVelocity(ms / 450, screenWidth);
        let hop = 0;
        for (; hop < HOPS; hop++) {
          const r = simulateReal(course, x, y, v.vx, v.vy, screenWidth);
          if (!r || r.landedIndex <= idx) break;
          idx = r.landedIndex; x = r.x; y = course[idx].topY - PH / 2;
        }
        results.push({ screenWidth, seed, ms, survivedHops: hop });
      }
    }
  }
  const avgSurvived = (arr) => Math.round((10 * arr.reduce((a, r) => a + r.survivedHops, 0)) / arr.length) / 10;
  for (const ms of DURATIONS) {
    const subset = results.filter((r) => r.ms === ms);
    console.log({ pressMs: ms, n: subset.length, avgSurvivedHops: avgSurvived(subset), minSurvivedHops: Math.min(...subset.map((r) => r.survivedHops)), maxSurvivedHops: Math.max(...subset.map((r) => r.survivedHops)) });
  }
}
