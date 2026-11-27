// MARTI KAPTI gri kutu — deniz bölümünün ulaşılabilirlik kanıtı (physics-evidence yöntemi).
// GERÇEK kod: config.ts, jump.ts (advanceFlight, jumpVelocity), landing.ts (findFootLanding), stops.ts, deniz.ts
// ts.transpileModule + vm ile yüklenir; fizik formülü elle yazılmaz.
// Soru: bölümdeki her ardışık yüzey çifti için, kayığın HER fazında (24 faz) ve kalkış yüzeyinin üç ayak
// konumunda (sol kenar / orta / sağ kenar), en az bir basış süresi (c = 0..1, 600 adım) hedefe indiriyor mu?
// Not: bu "ulaşılabilirlik araması"dır (bir basışın varlığı), sabit basış tekrarı değil.
const fs = require("fs"), vm = require("vm");
const root = "/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend";
const ts = require(root + "/node_modules/typescript");
function load(p, imp = {}) {
  const exportsObj = {};
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync(root + p, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText,
    { exports: exportsObj, require: (id) => imp[id], Math }
  );
  return exportsObj;
}
const cfg = load("/src/game/config.ts");
const jump = load("/src/game/jump.ts", { "./config": cfg });
const land = load("/src/game/landing.ts", { "./config": cfg });
const stops = load("/src/game/stops.ts", {});
const deniz = load("/src/game/deniz.ts", { "./config": cfg, "./jump": jump, "./stops": stops });
const CONFIG = cfg.CONFIG;
const PH = CONFIG.playerHeight;
const BODY = 0; // findFootLanding'e app/index.tsx ile aynı genişlik verilir:
const W = 440;
// app/index.tsx: findFootLanding(landList, prevX, px, prevBottom, newBottom, CHARACTER_WIDTH * 0.8)
const CHARACTER_WIDTH = CONFIG.playerWidth * 2.16;
const FOOT_W = CHARACTER_WIDTH * 0.8;

function ucus(a, b, t0, ayak, c) {
  // a'dan (t0 anında, ayak = a üstündeki oran) c basışıyla zıpla; b'ye iner mi?
  const ax = deniz.denizX(a, t0);
  let x = ax + a.width * ayak, y = a.topY - PH / 2;
  const v = jump.jumpVelocity(c, W);
  let vy = v.vy, t = t0;
  const dt = 1 / 240;
  for (let k = 0; k < 240 * 4; k++) {
    const prevX = x, prevBottom = y + PH / 2;
    const f = jump.advanceFlight(x, y, v.vx, vy, dt, W);
    x = f.x; y = f.y; vy = f.vy; t += dt;
    if (vy > 0) {
      const liste = deniz.hareketliListe([a, b], t);
      const hit = land.findFootLanding(liste, prevX, x, prevBottom, y + PH / 2, FOOT_W);
      if (hit) return hit.index === 1;
    }
    if (y > 2000) return false;
  }
  return false;
}

let cift = 0, hata = 0, enZor = 1, ornek = null;
const SEEDS = Number(process.argv[2] || 300);
for (let s = 0; s < SEEDS; s++) {
  const seed = (s * 2654435761) >>> 0;
  const prevTop = -200 + (s % 9) * 50;
  const prev = { id: 6, x: 0, topY: prevTop, width: 80 };
  const seg = deniz.denizBolumu(prev, 7, seed, W);
  const zincir = [prev, ...seg];
  for (let i = 0; i + 1 < zincir.length; i++) {
    const a = zincir[i], b = zincir[i + 1];
    cift++;
    let iyiFaz = 0;
    const FAZ = 24;
    for (let f = 0; f < FAZ; f++) {
      const t0 = (f / FAZ) * (2 * Math.PI / deniz.KAYIK_W) * 1.2;
      let hepsi = true;
      for (const ayak of [0.05, 0.5, 0.95]) {
        let ok = false;
        for (let k = 1; k <= 600 && !ok; k++) ok = ucus(a, b, t0, ayak, k / 600);
        if (!ok) { hepsi = false; if (!ornek) ornek = { seed, i, a: { ...a }, b: { ...b }, t0, ayak }; }
      }
      if (hepsi) iyiFaz++;
    }
    const oran = iyiFaz / FAZ;
    if (oran < 1) hata++;
    enZor = Math.min(enZor, oran);
  }
}
console.log(`MARTI deniz bölümü: ${SEEDS} tohum, ${cift} yüzey çifti (önceki kule→konteyner … kayık→iskele).`);
console.log(`Her fazda ve üç ayak konumunda en az bir basışla ulaşılamayan çift: ${hata}`);
console.log(`En kötü çiftte ulaşılabilir faz oranı: ${(enZor * 100).toFixed(1)}%`);
if (ornek) console.log("İlk sorunlu örnek:", JSON.stringify(ornek));
