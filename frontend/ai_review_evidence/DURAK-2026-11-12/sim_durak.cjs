// DURAK SEFERİ: kademeli zorluk + nefes kulesi istatistiği (gerçek modüllerle).
const fs = require("fs"), vm = require("vm");
const root = "/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend";
const ts = require(root + "/node_modules/typescript");
function load(p, imp = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(root + p, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText,
    { exports, require: (id) => imp[id], Math });
  return exports;
}
const cfgMod = load("/src/game/config.ts");
const jumpMod = load("/src/game/jump.ts", { "./config": cfgMod });
const stops = load("/src/game/stops.ts");
const proc = load("/src/game/procedural-course.ts", { "./config": cfgMod, "./jump": jumpMod, "./stops": stops });
const C = cfgMod.CONFIG, W = 440;
const bands = [[1,9],[10,24],[25,39],[40,54],[55,120]];
const agg = bands.map(() => ({ n: 0, gap: 0, nar: 0, dh: 0, maxGap: 0 }));
const breath = { n: 0, wide: 0, dh: 0, gap: 0 };
let neg = 0;
for (let seed = 1; seed <= 3000; seed++) {
  const rand = proc.makeRand(seed);
  let prev = { id: 0, x: 0, topY: 0, width: C.widthWide.max, cat: 0 };
  for (let id = 1; id <= 120; id++) {
    const p = proc.generateProceduralPlatform(prev, id, rand, W);
    const gap = p.x - (prev.x + prev.width), dh = Math.abs(p.topY - prev.topY);
    if (gap < 0) neg++;
    const b = bands.findIndex(([a, z]) => id >= a && id <= z);
    const g = agg[b]; g.n++; g.gap += gap; g.nar += p.cat === 2; g.dh += dh; g.maxGap = Math.max(g.maxGap, gap);
    if (stops.isStopTower(id)) { breath.n++; breath.wide += p.cat === 0; breath.dh += dh; breath.gap += gap; }
    prev = p;
  }
}
console.log("kule bandı | ort. aralık | en büyük aralık | dar kule % | ort. yükseklik farkı");
bands.forEach(([a, z], i) => { const g = agg[i]; console.log(`${a}-${z} | ${(g.gap/g.n).toFixed(0)} | ${g.maxGap.toFixed(0)} | ${(100*g.nar/g.n).toFixed(1)} | ${(g.dh/g.n).toFixed(0)}`); });
console.log(`nefes kulesi: ${breath.n}, geniş %${(100*breath.wide/breath.n).toFixed(1)}, ort. aralık ${(breath.gap/breath.n).toFixed(0)}, ort. yük. farkı ${(breath.dh/breath.n).toFixed(0)}; negatif aralık: ${neg}`);
console.log("durak kuleleri:", [1,2,3,4,5,6].map(stops.stopTowerId).join(","), "| stopsPassed(9,10,24,25,55,70):", [9,10,24,25,55,70].map(stops.stopsPassed).join(","));
console.log("satırlar:", [0,9,12,30,54,60].map(stops.nextStopLine).join(" | "));
