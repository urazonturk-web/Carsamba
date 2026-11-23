// Gerçek src/game/mahalleSes.ts karar motorunu çalıştırır (ts.transpileModule + vm, sahte ./sfx).
const fs = require("fs"), path = require("path"), vm = require("vm"), ts = require("typescript");
const src = fs.readFileSync(path.join(__dirname, "../../src/game/mahalleSes.ts"), "utf8");
const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const calls = [];
const mod = { exports: {} };
vm.runInNewContext(js, { module: mod, exports: mod.exports, require: (n) => (n === "./sfx" ? { playSfx: (s) => calls.push(s) } : require(n)), setTimeout: (f) => f(), Date, Math });
const { mahalleSesMotoru } = mod.exports;
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
let ok = true;
// 1) Soğuma ve tek ses: 1000 iniş, 0,6–2,5 sn arayla
{
  const m = mahalleSesMotoru(rng(1)); const r = rng(2); let t = 0, last = -1e9, minGap = 1e9, n = 0;
  for (let i = 0; i < 1000; i++) {
    t += 600 + r() * 1900;
    const o = { tur: "inis", perfect: r() < 0.4 ? 1 : 0, ratio: r(), towersCrossed: r() < 0.1 ? 3 : 1 };
    const k = m(o, t);
    if (k) { const at = t + k.gecikmeMs; minGap = Math.min(minGap, at - last); last = at; n++; }
  }
  console.log("1) çalınan:", n, "ardışık iki mahalle sesi arası en az (ms):", Math.round(minGap));
  if (minGap < 1500) { ok = false; console.log("   HATA: genel aralık < 1500 ms"); }
}
// 2) Kusursuz inişlerde oran (soğuma dolu olsun diye 5 sn arayla, yalnız ortaya iniş)
{
  const m = mahalleSesMotoru(rng(3)); let t = 0, n = 0; const N = 2000;
  for (let i = 0; i < N; i++) { t += 5000; if (m({ tur: "inis", perfect: 1, ratio: 0.5, towersCrossed: 1 }, t)) n++; }
  const p = n / N; console.log("2) kusursuz iniş oranı:", (p * 100).toFixed(1) + "%");
  if (Math.abs(p - 0.45) > 0.05) { ok = false; console.log("   HATA: %45±5 dışında"); }
}
// 3) Öncelik: 3 kule + kenar + kusursuz aynı anda → yalnız hooyt adayı (ya hooyt ya hiç)
{
  const m = mahalleSesMotoru(rng(4)); let t = 0, bad = 0;
  for (let i = 0; i < 500; i++) { t += 20000; const k = m({ tur: "inis", perfect: 1, ratio: 0.05, towersCrossed: 4 }, t); if (k && k.ses !== "m_hooyt") bad++; }
  console.log("3) öncelik ihlali:", bad); if (bad) ok = false;
}
// 4) Kenar eşiği sınırları
{
  const m = mahalleSesMotoru(() => 0); let t = 0;
  const a = m({ tur: "inis", perfect: 0, ratio: 0.12, towersCrossed: 1 }, (t += 20000));
  const b = m({ tur: "inis", perfect: 0, ratio: 0.88, towersCrossed: 1 }, (t += 20000));
  console.log("4) ratio 0.12 →", a && a.ses, "| 0.88 →", b && b.ses); if (!a || !b) ok = false;
}
// 5) Rekor oyun sonunda panjur yok
{
  const m = mahalleSesMotoru(() => 0);
  const k = m({ tur: "oyunSonu", rekor: true }, 1e6); console.log("5) rekor oyun sonu:", k); if (k) ok = false;
}
// 6) Ödül sesi üst üste en çok 2 kez aynı
{
  const m = mahalleSesMotoru(() => 0.1); let t = 0; const seq = [];
  for (let i = 0; i < 10; i++) { t += 5000; const k = m({ tur: "inis", perfect: 1, ratio: 0.5, towersCrossed: 1 }, t); if (k) seq.push(k.ses); }
  let maxRun = 1, run = 1; for (let i = 1; i < seq.length; i++) { run = seq[i] === seq[i - 1] ? run + 1 : 1; maxRun = Math.max(maxRun, run); }
  console.log("6) en uzun aynı ses dizisi:", maxRun, seq.join(",")); if (maxRun > 2) ok = false;
}
console.log(ok ? "SONUÇ: PASS" : "SONUÇ: FAIL");
process.exit(ok ? 0 : 1);
