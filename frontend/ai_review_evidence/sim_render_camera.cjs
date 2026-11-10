// REVIZYON-036: deterministic step-response + scenario measurement of the render
// camera (src/game/render-camera.ts, the same code the frame loop runs).
// Run: node ai_review_evidence/sim_render_camera.cjs
const fs = require("fs"), vm = require("vm");
const root = __dirname + "/..";
const ts = require(root + "/node_modules/typescript");
const exp = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(root + "/src/game/render-camera.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: exp });
const { stepRenderAxis, corridorTarget, includeSecondTarget, RENDER_CAM: C } = exp;
const step = (p, v, t, dt) => stepRenderAxis(p, v, t, dt, C.smoothTime, C.maxSpeed, C.maxAccel);

// 1) step response for several step sizes at 60 and 30 fps
console.log("== step response (target step at t=0) ==");
for (const dtms of [16.67, 33.3]) {
  const dt = dtms / 1000;
  for (const size of [60, 150, 300]) {
    let p = 0, v = 0, t = 0, prevP = 0, prevV = 0, maxV = 0, maxA = 0, rev = 0, settle = -1, over = 0;
    for (let i = 0; i < 200; i++) {
      const r = step(p, v, size, dt); const a = Math.abs(r[1] - v) / dt;
      maxA = Math.max(maxA, a); maxV = Math.max(maxV, Math.abs(r[1]));
      if (r[0] - p < -1e-9) rev++;
      p = r[0]; v = r[1]; t += dt; over = Math.max(over, p - size);
      if (settle < 0 && Math.abs(size - p) < 0.02 * size) settle = t;
    }
    console.log(`dt=${dtms}ms step=${size}: settle2%=${settle.toFixed(2)}s peakV=${maxV.toFixed(0)}u/s(${(maxV*0.62).toFixed(0)}px/s) maxAccel=${maxA.toFixed(0)}u/s2 overshoot=${over.toFixed(2)} reversals=${rev}`);
  }
}

// 2) scenario: base camera + player jumping between platforms (uses the same
// corridor/hysteresis helpers as index.tsx). Zoom 0.62, screen 390x844.
const Z = 0.62, W = 390, H = 844, s = Z;
const plats = [];
let x = 0, y = 90;
let seed = 12345; const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
for (let i = 0; i < 26; i++) { const w = 60 + rnd() * 30; plats.push({ id: i, x, topY: y, width: w }); x += w + 40 + rnd() * 90; y = Math.max(-300, Math.min(300, y + (rnd() - 0.5) * 260)); }
const loW = 0.24 * H / s, hiW = 0.8 * H / s, xLoW = 0.14 * W / s, xHiW = 0.88 * W / s;
function run(dt) {
  let st = 0, px = plats[0].x + 30, py = plats[0].topY, standing = 0;
  let camX = px - 0.30 * W / s, camY = py - 0.67 * H / s, vY = 0;
  let camXR = camX, camYR = camY, vXR = 0, vYR = 0, tXmax = camX, secX = 0, secY = 0;
  const log = []; let t = 0;
  const frame = (phase, tt) => {
    // base camera (critically damped, same form as the game)
    const tY = plats[standing].topY - 0.67 * H / s;
    const om = 2 / 0.16, xx = om * dt, dec = 1 / (1 + xx + 0.48 * xx * xx + 0.235 * xx * xx * xx);
    const ch = camY - tY, tmp = (vY + om * ch) * dt; vY = (vY - om * tmp) * dec; camY = tY + (ch + tmp) * dec;
    const tXb = px - 0.30 * W / s; if (tXb > camX) camX += (tXb - camX) * (1 - Math.exp(-dt / 0.2));
    // corridor
    let xMin = px - 30, xMax = px + 30, yMin = py, yMax = py, seen = 0, first = null;
    for (const wp of plats) { if (wp.id <= standing) continue; seen++;
      if (seen === 1) { first = wp; xMin = Math.min(xMin, wp.x); xMax = Math.max(xMax, wp.x + wp.width); yMin = Math.min(yMin, wp.topY); yMax = Math.max(yMax, wp.topY); }
      else { const m2 = Math.min(xMin, wp.x), x2 = Math.max(xMax, wp.x + wp.width), ym2 = Math.min(yMin, wp.topY), yx2 = Math.max(yMax, wp.topY);
        const iX = includeSecondTarget(x2 - m2, xHiW - xLoW, secX === 1), iY = includeSecondTarget(yx2 - ym2, hiW - loW, secY === 1);
        secX = iX ? 1 : 0; secY = iY ? 1 : 0; if (iX) { xMin = m2; xMax = x2; } if (iY) { yMin = ym2; yMax = yx2; } break; } }
    let tX = corridorTarget(camX, xMin, xMax, xLoW, xHiW); const tYc = corridorTarget(camY, yMin, yMax, loW, hiW);
    if (tX < tXmax) tX = tXmax; tXmax = tX;
    const ry = step(camYR, vYR, tYc, dt); camYR = ry[0]; vYR = ry[1];
    const rx = step(camXR, vXR, tX, dt); if (rx[0] < camXR) vXR = Math.max(0, rx[1]); else { camXR = rx[0]; vXR = rx[1]; }
    const sxp = (px - camXR) * Z / W, syp = (py - camYR) * Z / H;
    const fx = first ? (first.x - camXR) * Z / W : null, fy = first ? (first.topY - camYR) * Z / H : null;
    log.push({ t: tt, camXR, camYR, phase, sxp, syp, fx, fy, fxe: first ? (first.x + first.width - camXR) * Z / W : null });
  };
  for (let n = 0; n < plats.length - 2; n++) {
    const from = plats[n], to = plats[n + 1];
    for (let k = 0; k < Math.round(0.5 / dt); k++) { frame("IDLE", t); t += dt; }
    // ballistic hop 0.85s
    const T = 0.85, x0 = px, x1 = to.x + to.width * 0.5, y0 = py, y1 = to.topY, apex = Math.min(y0, y1) - 120;
    const N = Math.round(T / dt);
    for (let k = 1; k <= N; k++) { const u = k / N; px = x0 + (x1 - x0) * u; const base = y0 + (y1 - y0) * u; py = base - 4 * (base - apex) * u * (1 - u) * 0.9; frame("AIR", t); t += dt; }
    px = x1; py = y1; standing = n + 1;
  }
  return log;
}
console.log("\n== scenario (25 hops, random course, 3 speeds of frame loop) ==");
for (const dtms of [16.67, 33.3]) {
  const dt = dtms / 1000, L = run(dt);
  let maxDX = 0, maxDY = 0, maxAY = 0, maxAX = 0, backX = 0, revY = 0, outFirst = 0, n = 0, outPlayer = 0, dirPrev = 0, maxJerkY = 0;
  for (let i = 2; i < L.length; i++) {
    const dx = L[i].camXR - L[i - 1].camXR, dy = L[i].camYR - L[i - 1].camYR, dxp = L[i - 1].camXR - L[i - 2].camXR, dyp = L[i - 1].camYR - L[i - 2].camYR;
    maxDX = Math.max(maxDX, Math.abs(dx) / dt); maxDY = Math.max(maxDY, Math.abs(dy) / dt);
    maxAX = Math.max(maxAX, Math.abs(dx - dxp) / dt / dt); maxAY = Math.max(maxAY, Math.abs(dy - dyp) / dt / dt);
    if (dx < -1e-9) backX++;
    // direction reversal beyond noise (> 0.3 u/frame both sides)
    if (Math.abs(dy) > 0.3 && Math.abs(dyp) > 0.3 && Math.sign(dy) !== Math.sign(dyp)) revY++;
    n++; const q = L[i];
    if (q.phase === "AIR") { if (q.sxp < 0.10 || q.sxp > 0.92 || q.syp < 0.18 || q.syp > 0.86) outPlayer++; if (q.fx !== null && (q.fxe < 0.02 || q.fx > 0.98 || q.fy < 0.12 || q.fy > 0.90)) outFirst++; }
  }
  const air = L.filter((q) => q.phase === "AIR").length;
  console.log(`dt=${dtms}ms frames=${L.length}: peak render speed X=${maxDX.toFixed(0)} Y=${maxDY.toFixed(0)} u/s (${(maxDX*Z).toFixed(0)}/${(maxDY*Z).toFixed(0)} px/s); peak accel X=${maxAX.toFixed(0)} Y=${maxAY.toFixed(0)} u/s2; X backward frames=${backX}; Y reversals=${revY}; airborne frames player outside safe area=${outPlayer}/${air}, first target outside=${outFirst}/${air}`);
}
