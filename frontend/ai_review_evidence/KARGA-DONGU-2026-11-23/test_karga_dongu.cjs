// KARGA-DONGU kabul 2,3 ve C: gerçek karga.ts / character-pose.ts kodu (ts.transpileModule + vm).
const ts = require("typescript"), fs = require("fs"), vm = require("vm"), path = require("path");
const root = path.join(__dirname, "../..");
function load(f) {
  const out = ts.transpileModule(fs.readFileSync(path.join(root, f), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 } }).outputText;
  const m = { exports: {} };
  vm.runInNewContext(out, { module: m, exports: m.exports, require: () => 0, Math, console });
  return m.exports;
}
let ok = true; const chk = (c, msg) => { console.log((c ? "OK   " : "FAIL ") + msg); if (!c) ok = false; };
const K = load("src/game/karga.ts");
// 2) oranlar
const N = 10000, seedA = 0.3141, seedB = 0.7777, M = K.KARGA_DILIM_MS;
const a = [], b = [];
for (let i = 0; i < N; i++) { a.push(K.kargaBekle(i * M + 10, seedA)); b.push(K.kargaBekle(i * M + 10, seedB)); }
const frac = (arr, v) => arr.filter((x) => x === v).length / arr.length;
[[0, 0.65], [1, 0.2], [2, 0.15]].forEach(([v, p]) => { const f = frac(a, v); chk(Math.abs(f - p) < 0.03, `durum ${v} oranı ${(f * 100).toFixed(1)}% (hedef ${p * 100}%)`); });
// 250 ms tick içinde dilim sabit
// Dilim sınırı tohuma göre kayık; 250 ms tick ile örneklenince her 750 ms'lik pencerede en çok bir değişim olmalı.
let st = true; for (let i = 0; i < 4000; i++) { const t0 = i * M; let ch = 0, prev = K.kargaBekle(t0, seedA); for (let k = 1; k <= 3; k++) { const v = K.kargaBekle(t0 + k * 250 - 1, seedA); if (v !== prev) ch++; prev = v; } if (ch > 1) st = false; }
chk(st, "750 ms içinde en çok bir durum değişimi (titreme yok)");
// periyot yok: özel durum göstergesinin otokorelasyonu, gecikme 1..40 dilim (30 sn)
const ind = a.map((x) => (x > 0 ? 1 : 0)), mu = ind.reduce((s, x) => s + x, 0) / N;
let peak = 0, peakL = 0;
for (let L = 1; L <= 40; L++) { let c = 0, v = 0; for (let i = 0; i + L < N; i++) c += (ind[i] - mu) * (ind[i + L] - mu); for (let i = 0; i < N; i++) v += (ind[i] - mu) ** 2; const r = c / v; if (Math.abs(r) > peak) { peak = Math.abs(r); peakL = L; } }
chk(peak < 0.15, `otokorelasyon tepe ${peak.toFixed(3)} (gecikme ${peakL})`);
// tohumlar arası bağımsızlık
let same = 0; for (let i = 0; i < N; i++) if (a[i] > 0 && a[i] === b[i]) same++;
chk(Math.abs(same / N - 0.0625) < 0.02, `iki tohumda aynı anda aynı özel durum ${(same / N * 100).toFixed(1)}% (beklenti 6,3%)`);
// eski kargaDurus ile karşılaştırma (bilgi): aynı gecikme otokorelasyonu
// 3) hedef dağılımı
const R = K.kargaRngYap(42);
const exp = { 0: { ileri: 0.55, uzak: 0.2, geri: 0.15, gider: 0.1 }, 1: { gider: 0.35, geri: 0.35, uzak: 0.3 }, 2: { gider: 0.7, geri: 0.3 }, 5: { gider: 0.7, geri: 0.3 } };
for (const kac of Object.keys(exp)) {
  const c = {}; for (let i = 0; i < N; i++) { const t = K.kargaHedefTuru(+kac, R()); c[t] = (c[t] || 0) + 1; }
  for (const [t, p] of Object.entries(exp[kac])) chk(Math.abs((c[t] || 0) / N - p) < 0.03, `kac=${kac} ${t} ${(((c[t] || 0) / N) * 100).toFixed(1)}% (hedef ${p * 100}%)`);
  chk(Object.keys(c).every((t) => t in exp[kac]), `kac=${kac} beklenmeyen tür yok`);
}
// C) pivot telafisi
const P = load("src/game/character-pose.ts");
const scale = 0.18; let maxErr = 0, maxOld = 0;
for (const pose of P.REACTION_POSES) for (const sq of [1, 0.92, 0.86]) for (let s = 0; s <= 4; s++) {
  const tp = s / 4, bulge = 1 + ((1 - sq) / 0.14) * 0.08;
  const SX = bulge * (1.04 - 0.04 * tp), SY = sq * (0.94 + 0.06 * tp);
  const f = P.reactionPivotFix(pose.pivotX, pose.pivotY, pose.w, pose.h, scale, SX, SY);
  const W = pose.w * scale, H = pose.h * scale, tx = -pose.pivotX * scale + f.dx, ty = -pose.pivotY * scale + f.dy;
  // RN: görünüm merkezine göre ölçek; ayak noktasının ekran konumu (0 olmalı)
  const fx = tx + W / 2 + (pose.pivotX * scale - W / 2) * SX, fy = ty + H / 2 + (pose.pivotY * scale - H / 2) * SY;
  maxErr = Math.max(maxErr, Math.abs(fx), Math.abs(fy));
  if (tp === 1 && SX === bulge && Math.abs(SY - sq) < 1e-12) maxOld = Math.max(maxOld, Math.abs(f.dy - (H * (1 - sq)) / 2));
}
chk(maxErr < 0.01, `ayak noktası sapması en çok ${maxErr.toExponential(2)} birim (3 poz × 5 adım × 3 sıkışma)`);
chk(maxOld < 1e-9, `sx=sy=1 iken eski extraY ile eşit (fark ${maxOld.toExponential(2)})`);
console.log(ok ? "RESULT: PASS" : "RESULT: FAIL"); process.exit(ok ? 0 : 1);
