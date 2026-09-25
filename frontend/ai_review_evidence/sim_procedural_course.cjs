// Validates course variety and baseline/candidate comparability, using the
// REAL exported procedural-course.ts module (no hand-duplicated generator).
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
const CONFIG = cfgMod.CONFIG;
const W = 440;

function withPlateau(plateau, fn) {
  const prev = CONFIG.horizontalChargePlateau;
  CONFIG.horizontalChargePlateau = plateau;
  try { return fn(); } finally { CONFIG.horizontalChargePlateau = prev; }
}

function genCourse(seed, n, screenWidth = W) {
  const rand = procMod.makeRand(seed);
  const list = [{ id: 0, x: 0, topY: 0, width: CONFIG.widthWide.max, cat: 0 }];
  for (let i = 1; i < n; i++) list.push(procMod.generateProceduralPlatform(list[i - 1], i, rand, screenWidth));
  return list;
}

console.log("=== A) three different seeds, baseline physics, first 8 gaps ===");
for (const seed of [1, 2, 3]) {
  const course = genCourse(seed, 9);
  const gaps = [];
  for (let i = 1; i < course.length; i++) gaps.push(Math.round(course[i].x - (course[i - 1].x + course[i - 1].width)));
  console.log({ seed, gaps });
}

console.log("\n=== B) seed=42, baseline vs candidate plateau, first 6 towers ===");
for (const plateau of [1, 1.15]) {
  const course = withPlateau(plateau, () => genCourse(42, 7));
  console.log({ plateau }, course.map((p) => ({ x: Math.round(p.x), topY: Math.round(p.topY), w: Math.round(p.width), cat: p.cat })));
}

console.log("\n=== D) seed=42, baseline vs candidate, towers 15-20 (later/harder section) ===");
for (const plateau of [1, 1.15]) {
  const course = withPlateau(plateau, () => genCourse(42, 21));
  const gaps = [];
  for (let i = 15; i <= 20; i++) gaps.push(Math.round(course[i].x - (course[i - 1].x + course[i - 1].width)));
  console.log({ plateau, "gaps[15..20]": gaps });
}
