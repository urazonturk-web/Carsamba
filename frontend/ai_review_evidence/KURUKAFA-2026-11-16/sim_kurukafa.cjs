// KURUKAFA simülasyonu (gerçek kod: config/jump/landing/stops/procedural-course/kurukafa).
const fs = require("fs"), vm = require("vm");
const root = "/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend";
const ts = require(root + "/node_modules/typescript");
const cur = (p) => fs.readFileSync(root + p, "utf8");
function load(src, imp = {}) { const e = {}; vm.runInNewContext(ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: e, require: (id) => imp[id], Math }); return e; }
const cfg = load(cur("/src/game/config.ts")), jump = load(cur("/src/game/jump.ts"), { "./config": cfg }), stops = load(cur("/src/game/stops.ts"));
const proc = load(cur("/src/game/procedural-course.ts"), { "./config": cfg, "./jump": jump, "./stops": stops }), land = load(cur("/src/game/landing.ts"), { "./config": cfg });
const kk = load(cur("/src/game/kurukafa.ts"), { "./jump": jump, "./stops": stops });
const C = cfg.CONFIG, PH = C.playerHeight, BW = C.playerWidth * 2.16 * 0.8, W = 402;
// app/index.tsx ile aynı türetme: SPRITE_SCALE = sole span / POSE_FEET_SPAN_PX(271); ölçek × 0.6625 × 1.4
const SOLE_L = C.footSoles[0][0], SOLE_R = C.footSoles[1][1], SPRITE = ((SOLE_R - SOLE_L) * BW) / 271, CS = SPRITE * 0.6625 * 1.4;
const CHAR_H = 1103 * CS, BODY_HW = (516 * CS * 0.6) / 2, SOLE_C = ((SOLE_L + SOLE_R) / 2 - 0.5) * BW;
const ONLY_SKULL = process.env.ONLY_SKULL === "1";
function gen(seed, n) { const r = proc.makeRand(seed); const l = [{ id: 0, x: 0, topY: 0, width: C.startTowerWidth, cat: 0 }]; for (let i = 1; i < n; i++) { const p = proc.generateProceduralPlatform(l[i - 1], i, r, W); if (kk.skullAfter(seed, l[i - 1].id)) p.skull = kk.skullPoint(l[i - 1], p, PH / 2, W, kk.skullLift(seed, l[i - 1].id)); l.push(p); } return l; }
function fly(plats, x, y, ms, skull) { const v = jump.jumpVelocity(ms / 450, W); let vx = v.vx, vy = v.vy, hit = false; const dt = 1 / 240;
  for (let t = 0; t < 4; t += dt) { const px = x, pb = y + PH / 2; const f = jump.advanceFlight(x, y, vx, vy, dt, W); x = f.x; y = f.y; vy = f.vy;
    if (skull) { const feet = y + PH / 2, cx = x + SOLE_C; if (kk.skullTouches(skull.x, skull.y, kk.SKULL_SIZE * kk.SKULL_HIT_R, cx - BODY_HW, feet - CHAR_H, cx + BODY_HW, feet)) hit = true; }
    if (vy > 0) { const c = land.findFootLanding(plats, px, x, pb, y + PH / 2, BW); if (c) return { li: c.index, x: c.x, hit }; } if (y > 6000) return { li: -1, hit }; }
  return { li: -1, hit }; }
let skulls = 0, towers = 0, collectable = 0, safeCollect = 0, winSum = 0; const SEEDS = Number(process.env.SEEDS || 120);
const firstIds = [];
for (let seed = 1; seed <= SEEDS; seed++) {
  const c = gen(seed, 200); towers += 200;
  for (let i = 1; i < c.length - 3; i++) {
    const q = c[i]; if (!q.skull) continue; skulls++; if (firstIds.length < 2000) firstIds.push(q.id);
    const prev = c[i - 1]; const sx = prev.x + prev.width / 2, sy = prev.topY - PH / 2;
    let any = false, safe = false, win = 0;
    for (let ms = 0; ms <= 450; ms += 2) { const r = fly(c.slice(i - 1), sx, sy, ms, q.skull); if (r.hit) { any = true; win += 2; if (r.li > 0) safe = true; } }
    if (any) collectable++; if (safe) safeCollect++; winSum += win;
  }
}
const gaps=[];{let last=-1;for(const id of firstIds){}}
console.log(`${SEEDS} tohum × 200 kule: kurukafa ${skulls} (her ${(towers / skulls).toFixed(1)} kulede bir), en erken kule ${Math.min(...firstIds)}`);
console.log(`CHAR_H ${CHAR_H.toFixed(0)} BODY_HW ${BODY_HW.toFixed(0)} hitR ${(kk.SKULL_SIZE*kk.SKULL_HIT_R).toFixed(0)}`);
console.log(`ortadan atlayınca alınabilen: %${(100 * collectable / skulls).toFixed(1)}; alıp bir kuleye inilebilen: %${(100 * safeCollect / skulls).toFixed(1)}; ort. alma penceresi ${(winSum / skulls).toFixed(0)} ms basış`);
// Etki altında ulaşılabilirlik
if (!ONLY_SKULL) for (const k of [0.7, 1.3]) {
  let unr = 0, hops = 0, minW = 1e9, wsum = 0;
  for (let seed = 1; seed <= 12; seed++) {
    const c0 = gen(seed, 110); const c = kk.scaledPlatforms(c0, k); let idx = 15, x = c[15].x + c[15].width / 2;
    while (idx < 100) { const y = c[idx].topY - PH / 2, hit = [];
      for (let ms = 0; ms <= 450; ms++) { const r = fly(c.slice(idx), x, y, ms, null); if (r.li === 1) hit.push({ ms, x: r.x }); }
      hops++; if (!hit.length) { unr++; break; } const w = hit[hit.length - 1].ms - hit[0].ms + 1; minW = Math.min(minW, w); wsum += w; x = hit[hit.length >> 1].x; idx++; }
  }
  console.log(`genişlik ×${k}: 15-100. kule, ${hops} zıplama, ulaşılamayan ${unr}, ort. pencere ${(wsum / hops).toFixed(1)} ms, en dar ${minW} ms`);
}
