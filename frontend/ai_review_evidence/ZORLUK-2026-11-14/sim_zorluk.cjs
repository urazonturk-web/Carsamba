// ZORLUK KADEMESİ 1 (2026-11-14): eski (git HEAD) ve yeni kule dizilimini
// GERÇEK config.ts / jump.ts / landing.ts / procedural-course.ts / stops.ts
// kodunu çalıştırarak karşılaştırır. Fizik iki tarafta da aynı olmalı.
// Çalıştır: node ai_review_evidence/ZORLUK-2026-11-14/sim_zorluk.cjs
const fs = require("fs"), vm = require("vm"), { execSync } = require("child_process");
const root = "/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend";
const ts = require(root + "/node_modules/typescript");
const head = (p) => execSync(`git -C ${root} show HEAD:frontend${p}`, { encoding: "utf8" });
const cur = (p) => fs.readFileSync(root + p, "utf8");
function load(src, imp = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText,
    { exports, require: (id) => imp[id], Math, console });
  return exports;
}
function variant(read) {
  const cfg = load(read("/src/game/config.ts"));
  const jump = load(read("/src/game/jump.ts"), { "./config": cfg });
  const stops = load(read("/src/game/stops.ts"));
  const proc = load(read("/src/game/procedural-course.ts"), { "./config": cfg, "./jump": jump, "./stops": stops });
  const land = load(read("/src/game/landing.ts"), { "./config": cfg });
  return { cfg, jump, proc, land, C: cfg.CONFIG };
}
const OLD = variant(head), NEW = variant(cur);

// 0) Fizik aynı mı?
const PHYS = ["gravity", "minJumpVX", "maxJumpVX", "minJumpVY", "maxJumpVY", "maxChargeDuration", "horizontalChargePlateau", "chargeResponseCurve", "cameraZoom", "gapEarly", "gapLate", "warmupGapMax", "reachReserve", "playerWidth", "playerHeight"];
const diffs = PHYS.filter((k) => JSON.stringify(OLD.C[k]) !== JSON.stringify(NEW.C[k]));
console.log("=== 0) Fizik/kamera/boşluk sabitleri farkı:", diffs.length ? diffs : "YOK (aynı)");
for (const W of [320, 393, 440]) for (const c of [0, 0.3, 0.6, 1]) {
  const a = OLD.jump.jumpVelocity(c, W), b = NEW.jump.jumpVelocity(c, W);
  if (a.vx !== b.vx || a.vy !== b.vy) console.log("  jumpVelocity FARKLI", W, c, a, b);
}

function genCourse(V, seed, n, W) {
  const rand = V.proc.makeRand(seed);
  const list = [{ id: 0, x: 0, topY: 0, width: V.C.startTowerWidth ?? V.C.widthWide.max, cat: 0 }];
  for (let i = 1; i < n; i++) list.push(V.proc.generateProceduralPlatform(list[i - 1], i, rand, W));
  return list;
}
function sim(V, plats, x, y, vx, vy, W, dt = 1 / 240) {
  const PH = V.C.playerHeight, BW = V.C.playerWidth * 2.16 * 0.8;
  for (let t = 0; t < 4; t += dt) {
    const px = x, pb = y + PH / 2;
    const f = V.jump.advanceFlight(x, y, vx, vy, dt, W);
    x = f.x; y = f.y; vy = f.vy;
    if (vy > 0) { const c = V.land.findFootLanding(plats, px, x, pb, y + PH / 2, BW); if (c) return { li: c.index, x: c.x }; }
    if (y > 6000) return null;
  }
  return null;
}
const SEEDS = [3, 17, 42, 88, 205, 301, 512, 909, 1234, 7777];
const WIDTHS = [320, 393, 440];
const BANDS = [["1-14 (durak öncesi)", 1, 14], ["16-29 (Karaköy sonrası)", 16, 29], ["31-44", 31, 44], ["46-59", 46, 59], ["61-90 (iskele sonrası)", 61, 90]];
const HOPS = 90;

// 1) Uyarlanan oyuncu: her zıplamada bir SONRAKİ kuleye (i+1) inen basış
// penceresini 1ms adımla arar, ortasını basar, gerçek iniş x'ini taşır.
// Ulaşılabilirlik araması (başarılı pencere testi) -- sabit basış tekrarı DEĞİL.
function run(V, name) {
  const band = BANDS.map(() => ({ n: 0, win: 0, narrow: 0, width: 0, noNext: 0 }));
  let unreachable = 0, total = 0, minWin = 1e9, under25 = 0, under40 = 0, worst = null;
  for (const W of WIDTHS) for (const seed of SEEDS) {
    const course = genCourse(V, seed, HOPS + 15, W);
    let idx = 0, x = course[0].x + course[0].width / 2;
    while (idx < HOPS) {
      const y = course[idx].topY - V.C.playerHeight / 2;
      const hits = [];
      for (let ms = 0; ms <= 450; ms += 1) {
        const v = V.jump.jumpVelocity(ms / 450, W);
        const r = sim(V, course.slice(idx), x, y, v.vx, v.vy, W);
        if (r && r.li === 1) hits.push({ ms, x: r.x });
      }
      total++;
      const tgt = course[idx + 1];
      const b = BANDS.findIndex(([, lo, hi]) => tgt.id >= lo && tgt.id <= hi);
      if (!hits.length) { unreachable++; if (b >= 0) band[b].noNext++; break; }
      const win = hits[hits.length - 1].ms - hits[0].ms + 1;
      if (win < minWin) { minWin = win; worst = { W, seed, id: tgt.id, cat: tgt.cat, width: +tgt.width.toFixed(1), dy: Math.round(tgt.topY - course[idx].topY), gap: Math.round(tgt.x - course[idx].x - course[idx].width) }; }
      if (win < 25) under25++;
      if (win < 40) under40++;
      if (b >= 0) { const s = band[b]; s.n++; s.win += win; s.narrow += tgt.cat === 2 ? 1 : 0; s.width += tgt.width; }
      const mid = hits[Math.floor(hits.length / 2)];
      idx += 1; x = mid.x;
    }
  }
  console.log(`\n=== 1) ${name}: ${SEEDS.length * WIDTHS.length} koşu x ${HOPS} kule, uyarlanan oyuncu (başarılı pencere araması)`);
  console.log(`  bir sonraki kuleye hiç ulaşılamayan zıplama: ${unreachable} / ${total}; en dar pencere: ${minWin} ms`, worst);
  console.log(`  pencere < 25 ms: %${(100 * under25 / total).toFixed(1)} | < 40 ms: %${(100 * under40 / total).toFixed(1)} (tüm zıplamalar)`);
  for (let i = 0; i < BANDS.length; i++) {
    const s = band[i];
    console.log(`  ${BANDS[i][0].padEnd(24)} ort. basış penceresi ${(s.win / s.n).toFixed(1)} ms | dar kule %${Math.round(100 * s.narrow / s.n)} | ort. tepe genişliği ${(s.width / s.n).toFixed(1)}`);
  }
}
run(OLD, "ESKİ (HEAD)");
run(NEW, "YENİ (ZORLUK KADEMESİ 1)");
