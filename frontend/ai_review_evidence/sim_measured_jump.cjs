// Evidence for the 39-42s / 338ms-press video review, per user request:
// simulate the REAL measured takeoff-tower/target-tower geometry (read from
// video pixels, see AI_REVIEW.md for the measurement method and native-px
// values) through the REAL jump.ts/landing.ts code, at the REAL charge (338ms
// -> c=heldMs/1000/maxChargeDuration), across a RANGE of plausible start-x
// offsets on the takeoff tower (since the exact px.value could not be pinned
// to sub-tower precision from video alone -- see AI_REVIEW.md OPEN_ISSUES).
const fs = require("fs"), vm = require("vm");
const root = "/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend";
const ts = require(root + "/node_modules/typescript");
function load(p, imp = {}) {
  const exportsObj = {};
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync(root + p, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText,
    { exports: exportsObj, require: (id) => imp[id] }
  );
  return exportsObj;
}
const cfgMod = load("/src/game/config.ts");
const jumpMod = load("/src/game/jump.ts", { "./config": cfgMod });
const landMod = load("/src/game/landing.ts", { "./config": cfgMod });
const CONFIG = cfgMod.CONFIG;
const PH = CONFIG.playerHeight;
const BODY_WIDTH = CONFIG.playerWidth * 2.16 * 0.8;
const W = 440; // measured device logical width (physicsScale = W/440 = 1)

// --- measured geometry (native px / 1.86, relative to Tower A left edge=0) --
const NATIVE_TO_WORLD = 1.86;
const towerA = { x: 0, width: (534 - 461) / NATIVE_TO_WORLD, topY: 0 };
const towerB = {
  x: towerA.x + towerA.width + (792 - 534) / NATIVE_TO_WORLD,
  width: (935 - 792) / NATIVE_TO_WORLD,
  topY: (1877 - 1945) / NATIVE_TO_WORLD,
};
const towerC = {
  x: towerB.x + towerB.width + (1167 - 935) / NATIVE_TO_WORLD,
  width: (1290 - 1167) / NATIVE_TO_WORLD,
  topY: (1960 - 1945) / NATIVE_TO_WORLD,
};
console.log("Measured geometry (world units, Tower A left edge = 0):");
console.log({ towerA, towerB, towerC });
console.log({ gapAB: towerB.x - (towerA.x + towerA.width), gapBC: towerC.x - (towerB.x + towerB.width) });

// --- real charge -> velocity, from the video's own HUD readout -------------
const heldMs = 338;
const c = Math.min(1, heldMs / 1000 / CONFIG.maxChargeDuration);
const launch = jumpMod.jumpVelocity(c, W);
console.log("\nCharge c =", c.toFixed(4), "(HUD showed Güç:", Math.round(c * 100) + "%, matches %75)");
console.log("Launch velocity:", launch);

function simulateReal(platforms, startX, startY, vx, vy0, dt = 1 / 240, maxT = 4) {
  let x = startX, y = startY, vy = vy0, t = 0;
  while (t < maxT) {
    const prevX = x, prevBottom = y + PH / 2;
    const flight = jumpMod.advanceFlight(x, y, vx, vy, dt, W);
    x = flight.x; y = flight.y; vy = flight.vy;
    const newBottom = y + PH / 2;
    if (vy > 0) {
      const contact = landMod.findFootLanding(platforms, prevX, x, prevBottom, newBottom, BODY_WIDTH);
      if (contact) return { landedOn: contact.index, x: contact.x, t };
    }
    if (newBottom > towerC.topY + 3000) return null;
    t += dt;
  }
  return null;
}

const platforms = [towerA, towerB, towerC];
console.log("\n=== Outcome across the full plausible start-x range on Tower A (left edge=0 .. right edge=" + towerA.width.toFixed(1) + ") ===");
for (let startX = 0; startX <= towerA.width; startX += 4) {
  const startY = towerA.topY - PH / 2;
  const r = simulateReal(platforms, startX, startY, launch.vx, launch.vy);
  console.log({ startX: Math.round(startX * 10) / 10, result: r ? `landed on ${["A", "B", "C"][r.landedOn]} at x=${r.x.toFixed(1)}` : "MISSED ALL 3 (fell past Tower C)" });
}
