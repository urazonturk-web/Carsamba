// 1-14. kule için kolaylık varyantları (gerçek kod; EASY_START çalışma anında değiştirilir).
// "Tahmini başarı" bir VARSAYIMA dayanır: insan basış süresi hatası ~ normal, sapma = gereken sürenin %8'i
// (zamanlama literatüründeki ~%5-10 Weber oranı; bu oyunda ÖLÇÜLMEDİ). Sıralama için kullan, mutlak değer için değil.
const fs = require("fs"), vm = require("vm");
const root = "/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend";
const ts = require(root + "/node_modules/typescript");
const cur = (p) => fs.readFileSync(root + p, "utf8");
function load(src, imp = {}) { const e = {}; vm.runInNewContext(ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: e, require: (id) => imp[id], Math }); return e; }
const cfg = load(cur("/src/game/config.ts")), jump = load(cur("/src/game/jump.ts"), { "./config": cfg }), stops = load(cur("/src/game/stops.ts"));
const proc = load(cur("/src/game/procedural-course.ts"), { "./config": cfg, "./jump": jump, "./stops": stops }), land = load(cur("/src/game/landing.ts"), { "./config": cfg });
const C = cfg.CONFIG, PH = C.playerHeight, BW = C.playerWidth * 2.16 * 0.8, W = 402;
const BASE = { ...cfg.EASY_START };
function gen(seed, n) { const r = proc.makeRand(seed); const l = [{ id: 0, x: 0, topY: 0, width: C.startTowerWidth, cat: 0 }]; for (let i = 1; i < n; i++) l.push(proc.generateProceduralPlatform(l[i - 1], i, r, W)); return l; }
function sim(plats, x, y, vx, vy, dt = 1 / 240) { for (let t = 0; t < 4; t += dt) { const px = x, pb = y + PH / 2; const f = jump.advanceFlight(x, y, vx, vy, dt, W); x = f.x; y = f.y; vy = f.vy; if (vy > 0) { const c = land.findFootLanding(plats, px, x, pb, y + PH / 2, BW); if (c) return { li: c.index, x: c.x }; } if (y > 6000) return null; } return null; }
const erf = (x) => { const t = 1 / (1 + 0.3275911 * Math.abs(x)); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return x >= 0 ? y : -y; };
const Phi = (z) => 0.5 * (1 + erf(z / Math.SQRT2));
const q = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(p * (s.length - 1))]; };
function run(name, patch) {
  Object.assign(cfg.EASY_START, BASE, patch);
  const wins = [], rel = [], pHop = [], dMid = [], runP = [], tops = []; let fail = 0;
  for (let seed = 1; seed <= 100; seed++) {
    const c = gen(seed, 22); let idx = 0, x = c[0].x + c[0].width / 2, prev = null, pr = 1;
    while (idx < 14) {
      const y = c[idx].topY - PH / 2, hit = [];
      for (let ms = 0; ms <= 450; ms++) { const v = jump.jumpVelocity(ms / 450, W); const r = sim(c.slice(idx), x, y, v.vx, v.vy); if (r && r.li === 1) hit.push({ ms, x: r.x }); }
      if (!hit.length) { fail++; break; }
      const lo = hit[0].ms, hi = hit[hit.length - 1].ms, mid = (lo + hi) / 2, sd = 0.08 * mid;
      const p = Phi((hi + 0.5 - mid) / sd) - Phi((lo - 0.5 - mid) / sd);
      wins.push(hi - lo + 1); rel.push((hi - lo + 1) / mid); pHop.push(p); pr *= p; tops.push(c[idx + 1].topY);
      if (prev !== null) dMid.push(Math.abs(mid - prev)); prev = mid; x = hit[hit.length >> 1].x; idx++;
    }
    runP.push(pr);
  }
  const avg = (a) => a.reduce((s, v) => s + v, 0) / a.length;
  console.log(`${name.padEnd(34)} başarısız ${fail} | pencere p10/p50 ${q(wins, .1)}/${q(wins, .5)} ms | tahmini zıplama başarısı ort %${(100 * avg(pHop)).toFixed(0)}, en kötü %10'luk %${(100 * q(pHop, .1)).toFixed(0)} | 14 kuleyi düşmeden geçme %${(100 * avg(runP)).toFixed(0)} | basış farkı p90 ${Math.round(q(dMid, .9))} ms | ort. kule tepesi y ${Math.round(avg(tops))}`);
}
run("ŞU AN (kodda, A)", {});
run("A: yalnız geniş kule", { wideWeight: 1, mediumWeight: 0 });
// run("B: A + boşluk ≤ 220", { wideWeight: 1, mediumWeight: 0, gapMax: 220 });
// run("C: B + yükseklik ±100", { wideWeight: 1, mediumWeight: 0, gapMax: 220, heightVar: 100 });
// run("D: B + tırmanış ≤ 60 (iniş ≤160)", { wideWeight: 1, mediumWeight: 0, gapMax: 220, maxClimb: 60 });
// run("E: C + tırmanış ≤ 60", { wideWeight: 1, mediumWeight: 0, gapMax: 220, heightVar: 100, maxClimb: 60 });
