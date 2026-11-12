// GÜNÜN HARİTASI: aynı gün = aynı harita, farklı gün = farklı harita (gerçek modüllerle).
const fs = require("fs"), vm = require("vm");
const root = "/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend";
const ts = require(root + "/node_modules/typescript");
function load(p, imp = {}) { const exports = {}; vm.runInNewContext(ts.transpileModule(fs.readFileSync(root + p, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, { exports, require: (id) => imp[id], Math, Date }); return exports; }
const cfg = load("/src/game/config.ts"), jump = load("/src/game/jump.ts", { "./config": cfg }), stops = load("/src/game/stops.ts");
const proc = load("/src/game/procedural-course.ts", { "./config": cfg, "./jump": jump, "./stops": stops });
const daily = load("/src/game/daily.ts");
function course(seed) { const r = proc.makeRand(seed); let p = { id: 0, x: 0, topY: 0, width: cfg.CONFIG.widthWide.max, cat: 0 }; const out = []; for (let i = 1; i <= 30; i++) { p = proc.generateProceduralPlatform(p, i, r, 440); out.push(`${p.x.toFixed(1)}/${p.topY.toFixed(1)}/${p.width.toFixed(1)}`); } return out.join(","); }
const k1 = "2026-11-12", k2 = "2026-11-13";
console.log("tohum", k1, daily.dailySeed(k1), "| tekrar", daily.dailySeed(k1), "|", k2, daily.dailySeed(k2));
console.log("aynı gün aynı harita:", course(daily.dailySeed(k1)) === course(daily.dailySeed(k1)));
console.log("farklı gün farklı harita:", course(daily.dailySeed(k1)) !== course(daily.dailySeed(k2)));
console.log("todayKey:", daily.todayKey(new Date(2026, 10, 12)), "| etiket:", daily.todayLabel(new Date(2026, 10, 12)));
