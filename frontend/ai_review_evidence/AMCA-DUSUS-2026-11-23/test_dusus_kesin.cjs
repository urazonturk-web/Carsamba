// AMCA-DUSUS kabul 2: "düşüş kesin" kuralı gerçek config/jump/landing/procedural-course/kurukafa/character-pose koduyla.
// Yöntem: physics-evidence şablonu (ts.transpileModule + vm). Simülasyon sonucu; cihaz doğrulaması değildir.
const fs = require("fs"), vm = require("vm");
const root = "/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend";
const ts = require(root + "/node_modules/typescript");
function load(p, imp = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(root + p, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText,
    { exports, require: (id) => imp[id] ?? 0, Math });
  return exports;
}
const cfgMod = load("/src/game/config.ts");
const jumpMod = load("/src/game/jump.ts", { "./config": cfgMod });
const procMod = load("/src/game/procedural-course.ts", { "./config": cfgMod, "./jump": jumpMod });
const landMod = load("/src/game/landing.ts", { "./config": cfgMod });
const kkMod = load("/src/game/kurukafa.ts", { "./config": cfgMod });
const poseMod = load("/src/game/character-pose.ts", { "./config": cfgMod });
const CONFIG = cfgMod.CONFIG, PH = CONFIG.playerHeight, BODY_WIDTH = CONFIG.playerWidth * 2.16 * 0.8;
const W = 402, H = 874, s = CONFIG.cameraZoom;
const goDrop = ((1 - CONFIG.cameraPlayerAnchorY) * H + 60) / s; // oyun sonu: (py - camYR)*s > H+60, camYR = baseY - anchor*H/s
function genCourse(seed, n) {
  const rand = procMod.makeRand(seed);
  const list = [{ id: 0, x: 0, topY: 0, width: CONFIG.widthWide.max, cat: 0 }];
  for (let i = 1; i < n; i++) list.push(procMod.generateProceduralPlatform(list[i - 1], i, rand, W));
  return list;
}
let flights = 0, missed = 0, falsePos = 0, notReached = 0; const lead = [];
for (const seed of [3, 17, 42, 88, 205, 301, 512, 909, 1234, 4321, 7, 99, 555, 808, 1001, 2024, 31, 64, 128, 256]) {
  const course = genCourse(seed, 45);
  for (let k = 2; k < 35; k += 3) for (const effK of [1, 0.6, 1.4]) for (let ci = 0; ci < 200; ci += 5) {
    const c = 0.05 + (0.95 * ci) / 199;
    const raw = course.slice(Math.max(0, k - 2), k + 9); // oyundaki görünür liste yaklaşımı (iniş ve kural aynı listeyi kullanır)
    const list = effK === 1 ? raw : kkMod.scaledPlatforms(raw, effK);
    const from = course[k], baseY = from.topY;
    let x = from.x + from.width / 2 - CONFIG.playerWidth / 2, y = from.topY - PH / 2;
    const v = jumpMod.jumpVelocity(c, W); let vx = v.vx, vy = v.vy;
    const dt = 1 / 60; let t = 0, trig = -1, landed = false, over = false;
    flights++;
    while (t < 6) {
      const prevX = x, prevBottom = y + PH / 2;
      const f = jumpMod.advanceFlight(x, y, vx, vy, dt, W); x = f.x; y = f.y; vy = f.vy; t += dt;
      const nb = y + PH / 2;
      if (vy > 0 && landMod.findFootLanding(list, prevX, x, prevBottom, nb, BODY_WIDTH)) { landed = true; break; }
      if (trig < 0 && poseMod.dususKesin(vy, nb, list)) trig = t;
      if (y - baseY > goDrop) { over = true; break; }
    }
    if (landed) { if (trig >= 0) falsePos++; continue; }
    missed++;
    if (trig < 0 || !over) { notReached++; continue; }
    lead.push(t - trig);
  }
}
lead.sort((a, b) => a - b);
const q = (p) => (lead[Math.floor(p * (lead.length - 1))] * 1000).toFixed(0);
const ok220 = lead.filter((d) => d >= 0.22).length / lead.length;
console.log(`uçuş ${flights}, ıskalanan ${missed}, iniş olup kural önceden tetiklenen (yanlış pozitif) ${falsePos}, ıskalanıp tetiklenmeyen ${notReached}`);
console.log(`tetik→oyun sonu ms: min ${q(0)}, %10 ${q(0.1)}, medyan ${q(0.5)}, %90 ${q(0.9)}, max ${q(1)}; ≥220 ms oranı ${(ok220 * 100).toFixed(1)}%`);
const pass = falsePos === 0 && notReached === 0 && ok220 >= 0.9;
console.log(pass ? "RESULT: PASS" : "RESULT: FAIL"); process.exit(pass ? 0 : 1);
