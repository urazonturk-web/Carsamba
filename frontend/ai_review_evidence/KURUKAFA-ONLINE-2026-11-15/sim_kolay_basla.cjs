// KOLAY İLK DURAK: git HEAD (eski) ile çalışma kopyası (yeni) karşılaştırması, gerçek kod.
// (b) "ilk durağa kadar kolay" taslağı: 1-14. kule basış penceresi (gerçek kod).
const fs = require("fs"), vm = require("vm"), { execSync } = require("child_process");
const root = "/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend";
const ts = require(root + "/node_modules/typescript");
const head = (p) => execSync(`git -C ${root} show HEAD:frontend${p}`, { encoding: "utf8" });
const cur = (p) => fs.readFileSync(root + p, "utf8");
function load(src, imp = {}) { const exports = {}; vm.runInNewContext(ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports, require: (id) => imp[id], Math }); return exports; }
function variant(read, patch) {
  const cfg = load(read("/src/game/config.ts"));
  const C = patch ? { ...cfg.CONFIG, ...patch } : cfg.CONFIG;
  const cfgM = { ...cfg, CONFIG: C };
  const jump = load(read("/src/game/jump.ts"), { "./config": cfgM });
  const stops = load(read("/src/game/stops.ts"));
  const proc = load(read("/src/game/procedural-course.ts"), { "./config": cfgM, "./jump": jump, "./stops": stops });
  const land = load(read("/src/game/landing.ts"), { "./config": cfgM });
  return { jump, proc, land, C };
}
function gen(V, seed, n, W) { const r = V.proc.makeRand(seed); const l = [{ id: 0, x: 0, topY: 0, width: V.C.startTowerWidth ?? V.C.widthWide.max, cat: 0 }]; for (let i = 1; i < n; i++) l.push(V.proc.generateProceduralPlatform(l[i - 1], i, r, W)); return l; }
const OLD = variant(head), NOW = variant(cur);
function sim(V, plats, x, y, vx, vy, W, dt = 1 / 240) {
  const PH = V.C.playerHeight, BW = V.C.playerWidth * 2.16 * 0.8;
  for (let t = 0; t < 4; t += dt) { const px = x, pb = y + PH / 2; const f = V.jump.advanceFlight(x, y, vx, vy, dt, W); x = f.x; y = f.y; vy = f.vy;
    if (vy > 0) { const c = V.land.findFootLanding(plats, px, x, pb, y + PH / 2, BW); if (c) return { li: c.index, x: c.x }; } if (y > 6000) return null; }
  return null;
}
function band(V, name, lo = 1, hi = 14) {
  let n = 0, win = 0, narrow = 0, minW = 1e9, unr = 0, u40 = 0;
  for (const W of [320, 393, 440]) for (const seed of [3, 17, 42, 88, 205, 301, 512, 909, 1234, 7777]) {
    const c = gen(V, seed, hi + 6, W); let idx = 0, x = c[0].x + c[0].width / 2;
    while (idx < hi) {
      const y = c[idx].topY - V.C.playerHeight / 2, hits = [];
      for (let ms = 0; ms <= 450; ms++) { const v = V.jump.jumpVelocity(ms / 450, W); const r = sim(V, c.slice(idx), x, y, v.vx, v.vy, W); if (r && r.li === 1) hits.push({ ms, x: r.x }); }
      if (!hits.length) { unr++; break; }
      if (c[idx + 1].id < lo) { x = hits[hits.length >> 1].x; idx++; continue; }
      const w = hits[hits.length - 1].ms - hits[0].ms + 1; n++; win += w; minW = Math.min(minW, w); if (w < 40) u40++; if (c[idx + 1].cat === 2) narrow++;
      x = hits[hits.length >> 1].x; idx++;
    }
  }
  console.log(`${name}: ${lo}-${hi}. kule, ${n} zıplama | ulaşılamayan ${unr} | ort. pencere ${(win / n).toFixed(1)} ms | en dar ${minW} ms | <40ms %${(100 * u40 / n).toFixed(1)} | dar kule %${Math.round(100 * narrow / n)}`);
}
band(OLD, "ESKİ (HEAD)");
band(NOW, "YENİ       ");
band(OLD, "ESKİ (HEAD)", 15, 45);
band(NOW, "YENİ       ", 15, 45);

