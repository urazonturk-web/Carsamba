// PEŞİMDEKİ KEDİ gri kutu — rehber hedefinin adilliği (physics-evidence yöntemi).
// GERÇEK kod: config.ts, jump.ts, landing.ts, procedural-course.ts, rehber.ts (ts.transpileModule + vm). Formül elle yazılmaz.
// Soru 1 (ulaşılabilirlik araması, basış penceresi): her kuleden, üç ayak konumunda, bir sonraki kuleye (N+1) ve
//   iki ileriye (N+2) inen şarj aralığının genişliği ne? Kedi N+2'ye ne sıklıkla gider (pencere >= REHBER_PENCERE_MIN)?
// Soru 2: kedinin seçtiği her hedefe en az bir basış iniyor mu (seçilen hedef pencere > 0)?
const fs = require("fs"), vm = require("vm");
const root = "/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend";
const ts = require(root + "/node_modules/typescript");
function load(p, imp = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(root + p, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports, require: (id) => imp[id], Math });
  return exports;
}
const cfg = load("/src/game/config.ts");
const jump = load("/src/game/jump.ts", { "./config": cfg });
const land = load("/src/game/landing.ts", { "./config": cfg });
const stops = load("/src/game/stops.ts", {});
const proc = load("/src/game/procedural-course.ts", { "./config": cfg, "./jump": jump, "./stops": stops });
const reh = load("/src/game/rehber.ts", { "./config": cfg, "./jump": jump, "./landing": land });
const CONFIG = cfg.CONFIG;
const FOOT_W = CONFIG.playerWidth * 2.16 * 0.8; // app/index.tsx: CHARACTER_WIDTH * 0.8
function course(seed, n, W) {
  const rand = proc.makeRand(seed);
  const l = [{ id: 0, x: 0, topY: 0, width: CONFIG.widthWide.max, cat: 0 }];
  for (let i = 1; i < n; i++) l.push(proc.generateProceduralPlatform(l[i - 1], i, rand, W));
  return l;
}
const q = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(p * (s.length - 1))]; };
for (const W of [393, 440]) {
  const w1 = [], w2 = [];
  let iki = 0, n = 0, secilenSifir = 0;
  for (let seed = 1; seed <= 40; seed++) {
    const L = course(seed * 7919, 45, W);
    for (let i = 1; i + 2 < L.length; i++) for (const r of [0.2, 0.5, 0.8]) {
      const sx = L[i].x + L[i].width * r;
      const a = reh.inisPenceresi(L, i, sx, i + 1, W, FOOT_W);
      const b = reh.inisPenceresi(L, i, sx, i + 2, W, FOOT_W);
      w1.push(a); w2.push(b); n++;
      const h = reh.rehberHedef(L, i, sx, W, FOOT_W);
      if (h === i + 2) iki++;
      const sec = h === i + 2 ? b : a;
      if (sec <= 0) secilenSifir++;
    }
  }
  console.log(`W=${W}: ${n} durum (40 tohum × 43 kule × 3 ayak konumu)`);
  console.log(`  N+1 penceresi: medyan ${(q(w1, .5) * 100).toFixed(1)}%  alt %10 ${(q(w1, .1) * 100).toFixed(1)}%`);
  console.log(`  N+2 penceresi: medyan ${(q(w2, .5) * 100).toFixed(1)}%  üst %10 ${(q(w2, .9) * 100).toFixed(1)}%  sıfır olan ${(w2.filter((x) => x === 0).length / n * 100).toFixed(1)}%`);
  console.log(`  Kedi iki ileri gider (pencere >= ${reh.REHBER_PENCERE_MIN * 100}%): ${(iki / n * 100).toFixed(1)}%`);
  console.log(`  Seçilen hedefe hiçbir basışın inmediği durum: ${secilenSifir}`);
}
