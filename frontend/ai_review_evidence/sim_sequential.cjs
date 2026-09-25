// Sequential, non-centered, multi-width/seed validation (per Codex review).
// Unlike sim_candidate.cjs's TEST 2/3 (which use an approximate centered
// spawn on a non-first tower), this script carries the REAL contact.x
// forward from one landing to the next, exactly like app/index.tsx's
// AIRBORNE branch, and checks against the FULL generated platform list each
// time (never a slice), so a jump can legitimately skip ahead or fall.
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
const procMod = load("/src/game/procedural-course.ts", { "./config": cfgMod, "./jump": jumpMod });
const CONFIG = cfgMod.CONFIG;
const PH = CONFIG.playerHeight;
const CHARACTER_WIDTH = CONFIG.playerWidth * 2.16;
const BODY_WIDTH = CHARACTER_WIDTH * 0.8;

function withPlateau(plateau, fn) {
  const prev = CONFIG.horizontalChargePlateau;
  CONFIG.horizontalChargePlateau = plateau;
  try { return fn(); } finally { CONFIG.horizontalChargePlateau = prev; }
}

function genCourse(seed, n, screenWidth) {
  const rand = procMod.makeRand(seed);
  const list = [{ id: 0, x: 0, topY: 0, width: CONFIG.widthWide.max, cat: 0 }];
  for (let i = 1; i < n; i++) list.push(procMod.generateProceduralPlatform(list[i - 1], i, rand, screenWidth));
  return list;
}

// Real per-frame loop -- the actual exported advanceFlight/findFootLanding,
// checked against the FULL platform list (never a slice).
function simulateReal(allPlatforms, startX, startY, vx, vy0, screenWidth, dt = 1 / 240, maxT = 4) {
  let x = startX, y = startY, vy = vy0, t = 0;
  while (t < maxT) {
    const prevX = x, prevBottom = y + PH / 2;
    const flight = jumpMod.advanceFlight(x, y, vx, vy, dt, screenWidth);
    x = flight.x; y = flight.y; vy = flight.vy;
    const newBottom = y + PH / 2;
    if (vy > 0) {
      const contact = landMod.findFootLanding(allPlatforms, prevX, x, prevBottom, newBottom, BODY_WIDTH);
      if (contact) return { landedIndex: contact.index, x: contact.x, t };
    }
    if (newBottom > 6000) return null;
    t += dt;
  }
  return null;
}

// For the current position, find the ms-window that lands on the NEAREST
// reachable platform index (i.e. "trying to just make the next jump", the
// realistic default player intent), then return low/mid/high ms within it.
function nearestWindow(allPlatforms, fromIdx, startX, startY, screenWidth) {
  const hits = [];
  for (let ms = 0; ms <= 450; ms += 2) {
    const c = ms / 450;
    const v = jumpMod.jumpVelocity(c, screenWidth);
    const r = simulateReal(allPlatforms, startX, startY, v.vx, v.vy, screenWidth);
    if (r && r.landedIndex > fromIdx) hits.push({ ms, landed: r.landedIndex });
  }
  if (!hits.length) return null;
  const nearest = Math.min(...hits.map((h) => h.landed));
  const window = hits.filter((h) => h.landed === nearest).map((h) => h.ms);
  return { landed: nearest, lowMs: window[0], midMs: window[Math.floor(window.length / 2)], highMs: window[window.length - 1] };
}

function runSequential(seed, screenWidth, style, plateau, hops = 10) {
  return withPlateau(plateau, () => {
    const course = genCourse(seed, hops + 5, screenWidth);
    let idx = 0;
    let x = course[0].x + course[0].width * 0.5; // ONLY the true first tower is centered, matching the real game
    let y = course[0].topY - PH / 2;
    const offsets = [];
    for (let hop = 0; hop < hops; hop++) {
      const w = nearestWindow(course, idx, x, y, screenWidth);
      if (!w) return { survivedHops: hop, died: true, offsets };
      const ms = style === "low" ? w.lowMs : style === "high" ? w.highMs : w.midMs;
      const c = ms / 450;
      const v = jumpMod.jumpVelocity(c, screenWidth);
      const r = simulateReal(course, x, y, v.vx, v.vy, screenWidth);
      if (!r) return { survivedHops: hop, died: true, offsets };
      const landedPlatform = course[r.landedIndex];
      const offsetFromCenter = Math.round(r.x - (landedPlatform.x + landedPlatform.width / 2));
      offsets.push(offsetFromCenter); // negative=left of center, positive=right
      idx = r.landedIndex;
      x = r.x;
      y = landedPlatform.topY - PH / 2;
    }
    return { survivedHops: hops, died: false, offsets };
  });
}

console.log("=== Sequential, non-centered, full-platform-list runs (10 hops each) ===");
let anyFailure = false;
for (const screenWidth of [320, 393, 440]) {
  for (const seed of [1, 42, 123]) {
    for (const style of ["low", "mid", "high"]) {
      for (const plateau of [1, 1.15]) {
        const res = runSequential(seed, screenWidth, style, plateau);
        const label = { screenWidth, seed, style, plateau, survivedHops: res.survivedHops, died: res.died, offsets: res.offsets };
        console.log(JSON.stringify(label));
        if (res.died) anyFailure = true;
      }
    }
  }
}
console.log("\n=== SUMMARY ===");
console.log(anyFailure
  ? "FAIL: at least one (width, seed, style, plateau) combination died before 10 hops -- see entries with died:true above."
  : "PASS: all 54 (width x seed x style x plateau) combinations survived 10 sequential hops using real, full-platform-list collisions and non-centered carried-forward landing positions.");
