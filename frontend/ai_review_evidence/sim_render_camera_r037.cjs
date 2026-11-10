// REVIZYON-037: deterministic simulation of the SIMPLIFIED render camera that
// app/index.tsx now runs (locked-Y-at-flight-start + slow violation
// correction, single-target monotonic X). Mirrors the actual worklet code
// path line-for-line (same stepRenderAxis/corridorTarget from
// src/game/render-camera.ts, same physics camX/camY formulas as the frame
// loop, same Y_VIOLATION_TAU=0.6s). Physics camX/camY/config values are NOT
// changed by R037 -- they are reproduced here only to drive the scenario.
// Run: node ai_review_evidence/sim_render_camera_r037.cjs
const fs = require("fs"), vm = require("vm");
const root = __dirname + "/..";
const ts = require(root + "/node_modules/typescript");
const exp = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(root + "/src/game/render-camera.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: exp });
const { stepRenderAxis, corridorTarget, smoothRenderTarget, RENDER_CAM: C } = exp;
const stepX = (p, v, t, dt) => stepRenderAxis(p, v, t, dt, C.smoothTime, C.maxSpeed, C.maxAccel);
const stepY = (p, v, t, dt, smoothTime) => stepRenderAxis(p, v, t, dt, smoothTime, C.maxSpeed, C.maxAccel);

// Physics camera constants (src/game/config.ts, UNCHANGED by R037).
const CFG = { cameraZoom: 0.62, cameraDeadZoneRight: 0.30, cameraSmoothingX: 0.18, cameraSmoothTimeY: 0.16, cameraPlayerAnchorY: 0.67 };
const Z = CFG.cameraZoom, W = 390, H = 844, s = Z;
const FRAME_LO = 0.12, FRAME_HI = 0.90, FRAME_XL = 0.14, FRAME_XR = 0.88;
const loW = FRAME_LO * H / s, hiW = FRAME_HI * H / s, xLoW = FRAME_XL * W / s, xHiW = FRAME_XR * W / s;

// Random course, same generator shape as the R036 sim for continuity.
function makeCourse(seed0, n) {
  const plats = []; let x = 0, y = 90, seed = seed0;
  const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  for (let i = 0; i < n; i++) { const w = 60 + rnd() * 30; plats.push({ id: i, x, topY: y, width: w }); x += w + 40 + rnd() * 90; y = Math.max(-300, Math.min(300, y + (rnd() - 0.5) * 260)); }
  return plats;
}

function run(dt, plats, extremeJump) {
  let px = plats[0].x + 30, py = plats[0].topY, standing = 0;
  let camX = px - CFG.cameraDeadZoneRight * W / s, camY = py - CFG.cameraPlayerAnchorY * H / s, vY = 0;
  let camXR = camX, camYR = camY, vXR = 0, vYR = 0, tXmax = camX, tYSoft = camY;
  let flightLockY = camY, flightTargetY = py;
  const log = []; let t = 0; let landingEventT = null;

  const frameStep = (phase, tt) => {
    // --- physics camera (unchanged formulas, reproduced from app/index.tsx) ---
    const tY = plats[standing].topY - CFG.cameraPlayerAnchorY * H / s;
    const om = 2 / CFG.cameraSmoothTimeY, xx = om * dt, dec = 1 / (1 + xx + 0.48 * xx * xx + 0.235 * xx * xx * xx);
    const ch = camY - tY, tmp = (vY + om * ch) * dt;
    vY = (vY - om * tmp) * dec;
    let outY = tY + (ch + tmp) * dec;
    if ((camY - tY > 0) !== (outY - tY > 0) && camY !== tY) { outY = tY; vY = 0; }
    camY = outY;
    const deadZoneX = px - CFG.cameraDeadZoneRight * W / s;
    const ctx = Math.max(camX, deadZoneX);
    camX += (ctx - camX) * CFG.cameraSmoothingX;

    // --- render X: single first-target corridor, monotonic, accel/speed limited ---
    let tX = camX;
    if (phase !== "DEAD") {
      let xMin = px - 30, xMax = px + 30;
      for (const wp of plats) { if (wp.id <= standing) continue; xMin = Math.min(xMin, wp.x); xMax = Math.max(xMax, wp.x + wp.width); break; }
      tX = corridorTarget(camX, xMin, xMax, xLoW, xHiW);
    }
    if (tX < tXmax) tX = tXmax;
    tXmax = smoothRenderTarget(tXmax, tX, dt, C.targetSmoothTime);
    const rx = stepX(camXR, vXR, tXmax, dt);
    if (rx[0] < camXR) { vXR = Math.max(0, rx[1]); } else { camXR = rx[0]; vXR = rx[1]; }

    // --- render Y: locked during AIRBORNE, slow violation correction only;
    // outside AIRBORNE chases the RAW target (tY), not the already-smoothed
    // camY, so the landing transition is a single critically damped step. ---
    let tY2 = tY;
    if (phase === "AIR") {
      const fMin = Math.min(py, flightTargetY), fMax = Math.max(py, flightTargetY);
      tY2 = corridorTarget(flightLockY, fMin, fMax, loW, hiW);
    } else {
      flightLockY = camYR;
    }
    tYSoft = smoothRenderTarget(tYSoft, tY2, dt, C.targetSmoothTime);
    const ry = stepY(camYR, vYR, tYSoft, dt, phase === "AIR" ? C.smoothTimeYFlight : C.smoothTimeYStand);
    camYR = ry[0]; vYR = ry[1];

    const sxp = (px - camXR) * Z / W, syp = (py - camYR) * Z / H;
    log.push({ t: tt, camXR, camYR, phase, sxp, syp, standing });
  };

  for (let n = 0; n < plats.length - 2; n++) {
    const to = plats[n + 1];
    // IDLE (standing/charging): 0.4-0.7s
    for (let k = 0; k < Math.round(0.55 / dt); k++) { frameStep("IDLE", t); t += dt; }
    // flight start (== onPressOut): lock composition, remember jump target
    flightLockY = camYR;
    flightTargetY = to.topY;
    const T = extremeJump && n === 3 ? 1.4 : 0.85; // one deliberately large hop to exercise violation-correction
    const x0 = px, x1 = to.x + to.width * 0.5, y0 = py, y1 = to.topY;
    const apex = Math.min(y0, y1) - (extremeJump && n === 3 ? 420 : 120);
    const N = Math.round(T / dt);
    for (let k = 1; k <= N; k++) {
      const u = k / N;
      px = x0 + (x1 - x0) * u;
      const base = y0 + (y1 - y0) * u;
      py = base - 4 * (base - apex) * u * (1 - u) * 0.9;
      frameStep("AIR", t); t += dt;
    }
    px = x1; py = y1; standing = n + 1;
    landingEventT = t;
    // settle measurement window after landing
    const preLandCamYR = camYR;
    let settleT = -1;
    const targetTY = plats[standing].topY - CFG.cameraPlayerAnchorY * H / s;
    for (let k = 0; k < Math.round(2.5 / dt); k++) {
      frameStep("IDLE", t); t += dt;
      if (settleT < 0 && Math.abs(camYR - targetTY) < 0.02 * Math.max(1, Math.abs(preLandCamYR - targetTY))) settleT = t - landingEventT;
    }
    log[log.length - 1].landingSettleT = settleT;
    log[log.length - 1].landingStep = Math.abs(preLandCamYR - targetTY);
  }
  return log;
}

console.log("== R037 scenario: 24 hops, one deliberately large/high jump (n=3) ==");
for (const dtms of [16.67, 33.3]) {
  const dt = dtms / 1000;
  const plats = makeCourse(12345, 26);
  const L = run(dt, plats, true);
  let maxDX = 0, maxDY = 0, maxAY = 0, maxAX = 0, backX = 0, revY = 0, outPlayer = 0, air = 0;
  let flightYDrift = 0, maxFlightYDrift = 0, inFlight = false, flightStartY = 0;
  for (let i = 2; i < L.length; i++) {
    const dx = L[i].camXR - L[i - 1].camXR, dy = L[i].camYR - L[i - 1].camYR;
    const dxp = L[i - 1].camXR - L[i - 2].camXR, dyp = L[i - 1].camYR - L[i - 2].camYR;
    maxDX = Math.max(maxDX, Math.abs(dx) / dt); maxDY = Math.max(maxDY, Math.abs(dy) / dt);
    maxAX = Math.max(maxAX, Math.abs(dx - dxp) / dt / dt); maxAY = Math.max(maxAY, Math.abs(dy - dyp) / dt / dt);
    if (dx < -1e-9) backX++;
    if (Math.abs(dy) > 0.3 && Math.abs(dyp) > 0.3 && Math.sign(dy) !== Math.sign(dyp)) revY++;
    const q = L[i];
    if (q.phase === "AIR") {
      air++;
      if (!inFlight) { inFlight = true; flightStartY = q.camYR; }
      maxFlightYDrift = Math.max(maxFlightYDrift, Math.abs(q.camYR - flightStartY));
      if (q.sxp < 0.05 || q.sxp > 0.97 || q.syp < 0.10 || q.syp > 0.92) outPlayer++;
    } else { inFlight = false; }
  }
  const settles = L.filter((q) => q.landingSettleT !== undefined).map((q) => q.landingSettleT);
  const steps = L.filter((q) => q.landingStep !== undefined).map((q) => q.landingStep);
  console.log(`dt=${dtms}ms frames=${L.length}: peakV X=${maxDX.toFixed(0)} Y=${maxDY.toFixed(0)} u/s; peakAccel X=${maxAX.toFixed(0)} Y=${maxAY.toFixed(0)} u/s2; X backward=${backX}; Y reversals=${revY}; airborne player outside wide safe area=${outPlayer}/${air}`);
  console.log(`  max |camYR - flightStartY| while AIRBORNE (composition drift during a single flight) = ${maxFlightYDrift.toFixed(1)} world units (${(maxFlightYDrift*Z).toFixed(1)} px)`);
  console.log(`  landing settle-to-2% times (s), one per hop: [${settles.map((v) => v.toFixed(2)).join(", ")}]`);
  console.log(`  landing steps (|camYR just-before-settle-window - new target|, world units): [${steps.map((v) => v.toFixed(0)).join(", ")}]`);
  const validSettles = settles.filter((v, i) => v >= 0 && steps[i] > 5); // ignore near-zero steps, settle "instantly"
  if (validSettles.length) console.log(`  settle range over hops with a real step (>5u): ${Math.min(...validSettles).toFixed(2)}s .. ${Math.max(...validSettles).toFixed(2)}s`);
}
