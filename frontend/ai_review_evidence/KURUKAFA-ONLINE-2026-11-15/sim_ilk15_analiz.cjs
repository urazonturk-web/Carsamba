// 1-14. kule zıplama başına zorluk analizi (gerçek kod, mevcut çalışma kopyası).
// Ulaşılabilirlik araması: 1 ms adımla 0-450 ms basışlar.
const fs = require("fs"), vm = require("vm");
const root = "/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend";
const ts = require(root + "/node_modules/typescript");
const cur = (p) => fs.readFileSync(root + p, "utf8");
function load(src, imp = {}) { const e = {}; vm.runInNewContext(ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: e, require: (id) => imp[id], Math }); return e; }
const cfg = load(cur("/src/game/config.ts")), jump = load(cur("/src/game/jump.ts"), { "./config": cfg }), stops = load(cur("/src/game/stops.ts"));
const proc = load(cur("/src/game/procedural-course.ts"), { "./config": cfg, "./jump": jump, "./stops": stops }), land = load(cur("/src/game/landing.ts"), { "./config": cfg });
const C = cfg.CONFIG, PH = C.playerHeight, BW = C.playerWidth * 2.16 * 0.8;
function gen(seed, n, W) { const r = proc.makeRand(seed); const l = [{ id: 0, x: 0, topY: 0, width: C.startTowerWidth, cat: 0 }]; for (let i = 1; i < n; i++) l.push(proc.generateProceduralPlatform(l[i - 1], i, r, W)); return l; }
function sim(plats, x, y, vx, vy, W, dt = 1 / 240) { for (let t = 0; t < 4; t += dt) { const px = x, pb = y + PH / 2; const f = jump.advanceFlight(x, y, vx, vy, dt, W); x = f.x; y = f.y; vy = f.vy; if (vy > 0) { const c = land.findFootLanding(plats, px, x, pb, y + PH / 2, BW); if (c) return { li: c.index, x: c.x }; } if (y > 6000) return null; } return null; }
const rows = [];
const W = 402; // kullanıcının iPhone'u (mantıksal genişlik)
for (let seed = 1; seed <= 200; seed++) {
  const c = gen(seed, 22, W); let idx = 0, x = c[0].x + c[0].width / 2, prevMid = null;
  while (idx < 14) {
    const y = c[idx].topY - PH / 2, res = [];
    for (let ms = 0; ms <= 450; ms++) { const v = jump.jumpVelocity(ms / 450, W); res.push(sim(c.slice(idx), x, y, v.vx, v.vy, W)); }
    const hit = res.map((r, ms) => (r && r.li === 1 ? ms : -1)).filter((m) => m >= 0);
    if (!hit.length) { rows.push({ seed, id: idx + 1, fail: true }); break; }
    const lo = hit[0], hi = hit[hit.length - 1], mid = Math.round((lo + hi) / 2);
    // güvenli bölge: hedefin hemen sağında/solunda ölüm mü var, başka kule mi?
    const shortDeath = lo > 0 && res[lo - 1] === null, longDeath = hi < 450 && res[hi + 1] === null;
    const t = c[idx + 1], p = c[idx];
    rows.push({ seed, id: t.id, win: hi - lo + 1, mid, dMid: prevMid === null ? 0 : Math.abs(mid - prevMid),
      gap: Math.round(t.x - p.x - p.width), dy: Math.round(t.topY - p.topY), w: Math.round(t.width), cat: t.cat,
      standOff: Math.round(p.x + p.width - x), shortDeath, longDeath });
    prevMid = mid; x = res[mid].x; idx++;
  }
}
const ok = rows.filter((r) => !r.fail);
const q = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(p * (s.length - 1))]; };
console.log(`W=${W}, 200 tohum, ${ok.length} zıplama, başarısız ${rows.length - ok.length}`);
console.log("pencere ms   p10/p50/p90:", q(ok.map(r => r.win), .1), q(ok.map(r => r.win), .5), q(ok.map(r => r.win), .9));
console.log("gereken basış ms p10/p50/p90:", q(ok.map(r => r.mid), .1), q(ok.map(r => r.mid), .5), q(ok.map(r => r.mid), .9));
console.log("ardışık zıplamada basış farkı ms p50/p90/max:", q(ok.map(r => r.dMid), .5), q(ok.map(r => r.dMid), .9), Math.max(...ok.map(r => r.dMid)));
console.log("iki yanda da ölüm (kısa VE uzun basış düşürür): %" + (100 * ok.filter(r => r.shortDeath && r.longDeath).length / ok.length).toFixed(0));
// Hangi özellik dar pencereyle ilişkili?
const hard = ok.filter((r) => r.win < q(ok.map(r => r.win), .2)), easy = ok.filter((r) => r.win > q(ok.map(r => r.win), .8));
const avg = (a, k) => (a.reduce((s, r) => s + r[k], 0) / a.length).toFixed(0);
console.log("\nEn zor %20 vs en kolay %20 (pencereye göre):");
for (const k of ["win", "w", "gap", "dy", "mid", "standOff"]) console.log(`  ${k.padEnd(9)} zor ${avg(hard, k).padStart(5)} | kolay ${avg(easy, k).padStart(5)}`);
// dy kovaları
console.log("\nYükseklik farkına göre ort. pencere (dy<0 = hedef daha yüksek):");
for (const [a, b] of [[-200, -100], [-100, -30], [-30, 30], [30, 100], [100, 200]]) { const s = ok.filter(r => r.dy >= a && r.dy < b); console.log(`  dy ${a}..${b}: n=${s.length}, pencere ${avg(s, "win")} ms`); }
console.log("\nTepe genişliğine göre:");
for (const [a, b] of [[50, 62], [62, 70], [70, 80], [80, 97]]) { const s = ok.filter(r => r.w >= a && r.w < b); console.log(`  genişlik ${a}-${b}: n=${s.length}, pencere ${avg(s, "win")} ms`); }
console.log("\nBasış farkı (bir önceki zıplamaya göre) kovaları:");
for (const [a, b] of [[0, 30], [30, 80], [80, 150], [150, 450]]) { const s = ok.filter(r => r.dMid >= a && r.dMid < b); console.log(`  ${a}-${b} ms: %${(100 * s.length / ok.length).toFixed(0)}`); }
