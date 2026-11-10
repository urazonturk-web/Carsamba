// REVIZYON-045: before (R044) / after (R045) comparison of the render camera
// (src/game/render-camera.ts) using the REAL exported functions, plus REAL
// jump.ts physics (jumpVelocity/advanceFlight/flightGravity) to drive flights
// of many sizes -- same technique as sim_render_camera_r044.cjs.
//
// FINDING (why R044's fix wasn't enough): instrumenting WHERE the R044 peak
// Y acceleration for a full-charge jump actually occurs showed it happens
// AFTER touchdown (in the IDLE/stand phase), not during AIRBORNE -- R044's
// flight-phase corridor barely needed to move (locked composition + wide
// safe window), so the ENTIRE large height correction landed on the
// post-touchdown filter at once. Changing the flight-phase time constant
// therefore does nothing to that peak (confirmed empirically below, and
// documented as a rejected candidate in render-camera.ts's own comment).
//
// FIX: while DESCENDING (vy > 0), the render camera continuously (no snap)
// eases its flight target toward the REAL, already-known landing composition
// (RENDER_CAM.preLandTau), so a long fall (big jump) closes most of the gap
// BEFORE touchdown, leaving only a small residual for the stand-phase filter.
//
// "R044" constants below are exactly as src/game/render-camera.ts read
// immediately before this task's edit (recorded at the start of this task).
// Run: node ai_review_evidence/sim_render_camera_r045.cjs
const fs = require("fs"), vm = require("vm");
const root = __dirname + "/..";
const ts = require(root + "/node_modules/typescript");

function loadTs(relPath, fakeRequires) {
  const exp = {};
  const code = ts.transpileModule(fs.readFileSync(root + relPath, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const sandbox = { exports: exp, require: (name) => fakeRequires[name], module: { exports: exp } };
  vm.runInNewContext(code, sandbox);
  return sandbox.module.exports;
}

const CONFIG_MOD = loadTs("/src/game/config.ts", {});
const { CONFIG } = CONFIG_MOD;
const JUMP_MOD = loadTs("/src/game/jump.ts", { "./config": CONFIG_MOD });
const { jumpVelocity, advanceFlight, flightGravity } = JUMP_MOD;
const RC = loadTs("/src/game/render-camera.ts", {});
const { stepRenderAxis, corridorTarget, smoothRenderTarget } = RC;
const AFTER = RC.RENDER_CAM;

const Z = CONFIG.cameraZoom, W = 390, H = 844, s = Z;
const FRAME_LO = 0.12, FRAME_HI = 0.90, FRAME_XL = 0.14, FRAME_XR = 0.88;
const loW = FRAME_LO * H / s, hiW = FRAME_HI * H / s, xLoW = FRAME_XL * W / s, xHiW = FRAME_XR * W / s;

function realFlight(charge, dy, dt) {
  const from = { x: 0, topY: 0, width: 64 };
  const v = jumpVelocity(charge, W);
  const g = flightGravity(W);
  let x = from.x + from.width * 0.5, y = from.topY, vx = v.vx, vy = v.vy;
  const path = [];
  const capY = from.topY + dy;
  for (let i = 0; i < 600; i++) {
    const r = advanceFlight(x, y, vx, vy, dt, W);
    x = r.x; y = r.y; vy = r.vy;
    path.push({ x, y });
    if (vy > 0 && y >= capY) break;
  }
  return { path, targetTopY: path[path.length - 1].y, targetX: path[path.length - 1].x };
}

// `usePreLand` toggles ONLY the R045 pre-landing blend -- everything else
// (smoothTimeYFlight, maxSpeedY/maxAccelY, targetSmoothTimeY, X path) is
// identical between R044 and R045; both actually ARE the current file's
// values (R045 did not change any of these).
function run(dt, charge, dy, usePreLand) {
  const flight = realFlight(charge, dy, dt);
  const from = { id: 0, x: 0, topY: 0, width: 64 };
  const to = { id: 1, x: flight.targetX - 32, topY: flight.targetTopY, width: 64 };

  let px = from.x + from.width * 0.5, py = from.topY, standing = 0;
  let camX = px - CONFIG.cameraDeadZoneRight * W / s, camY = py - CONFIG.cameraPlayerAnchorY * H / s, vY = 0;
  let camXR = camX, camYR = camY, vXR = 0, vYR = 0, tXmax = camX, tYSoft = camY;
  let flightLockY = camY, flightTargetY = to.topY, preLandBlend = 0, vy = 0;
  const log = []; let t = 0;

  const stepX = (p, v, tgt) => stepRenderAxis(p, v, tgt, dt, AFTER.smoothTime, AFTER.maxSpeed, AFTER.maxAccel);
  const stepY = (p, v, tgt, smoothTime) => stepRenderAxis(p, v, tgt, dt, smoothTime, AFTER.maxSpeedY, AFTER.maxAccelY);

  const frameStep = (phase) => {
    const tY = (standing === 0 ? from.topY : to.topY) - CONFIG.cameraPlayerAnchorY * H / s;
    const om = 2 / CONFIG.cameraSmoothTimeY, xx = om * dt, dec = 1 / (1 + xx + 0.48 * xx * xx + 0.235 * xx * xx * xx);
    const ch = camY - tY, tmp = (vY + om * ch) * dt;
    vY = (vY - om * tmp) * dec;
    let outY = tY + (ch + tmp) * dec;
    if ((camY - tY > 0) !== (outY - tY > 0) && camY !== tY) { outY = tY; vY = 0; }
    camY = outY;
    const deadZoneX = px - CONFIG.cameraDeadZoneRight * W / s;
    camX += (Math.max(camX, deadZoneX) - camX) * CONFIG.cameraSmoothingX;

    let tX = camX;
    if (phase !== "DEAD") {
      const xMin = px - 30, xMax = standing === 0 ? to.x + to.width : px + 30;
      tX = corridorTarget(camX, xMin, xMax, xLoW, xHiW);
    }
    if (tX < tXmax) tX = tXmax;
    tXmax = smoothRenderTarget(tXmax, tX, dt, AFTER.targetSmoothTime);
    const rx = stepX(camXR, vXR, tXmax);
    if (rx[0] < camXR) { vXR = Math.max(0, rx[1]); } else { camXR = rx[0]; vXR = rx[1]; }

    let tY2 = tY, ySmoothTime = AFTER.smoothTimeYStand;
    if (phase === "AIR") {
      const fMin = Math.min(py, flightTargetY), fMax = Math.max(py, flightTargetY);
      tY2 = corridorTarget(flightLockY, fMin, fMax, loW, hiW);
      ySmoothTime = AFTER.smoothTimeYFlight;
      if (usePreLand) {
        if (vy > 0) {
          preLandBlend = smoothRenderTarget(preLandBlend, 1, dt, AFTER.preLandTau);
          const standTY = flightTargetY - CONFIG.cameraPlayerAnchorY * H / s;
          tY2 = tY2 + (standTY - tY2) * preLandBlend;
        } else {
          preLandBlend = 0;
        }
      }
    } else {
      flightLockY = camYR;
      preLandBlend = 0;
    }
    tYSoft = smoothRenderTarget(tYSoft, tY2, dt, AFTER.targetSmoothTimeY);
    const ry = stepY(camYR, vYR, tYSoft, ySmoothTime);
    camYR = ry[0]; vYR = ry[1];

    log.push({ t, camXR, camYR, phase });
    t += dt;
  };

  for (let k = 0; k < Math.round(0.5 / dt); k++) frameStep("IDLE");
  flightLockY = camYR; flightTargetY = to.topY;
  { let prevY = py; for (const pt of flight.path) { vy = pt.y - prevY; prevY = pt.y; px = pt.x; py = pt.y; frameStep("AIR"); } }
  px = to.x + to.width * 0.5; py = to.topY; standing = 1;
  const preLandCamYR = camYR;
  const targetTY = to.topY - CONFIG.cameraPlayerAnchorY * H / s;
  let settleT = -1;
  for (let k = 0; k < Math.round(3.0 / dt); k++) {
    frameStep("IDLE");
    if (settleT < 0 && Math.abs(camYR - targetTY) < 0.02 * Math.max(1, Math.abs(preLandCamYR - targetTY))) settleT = log[log.length - 1].t - (flight.path.length * dt + 0.5);
  }

  let maxDY = 0, maxAY = 0, maxDX = 0, backX = 0, revY = 0;
  const ySamples = [];
  for (let i = 2; i < log.length; i++) {
    const dx = log[i].camXR - log[i - 1].camXR, dy2 = log[i].camYR - log[i - 1].camYR;
    const dyp = log[i - 1].camYR - log[i - 2].camYR;
    maxDX = Math.max(maxDX, Math.abs(dx) / dt);
    maxDY = Math.max(maxDY, Math.abs(dy2) / dt);
    ySamples.push(Math.abs(dy2) / dt);
    maxAY = Math.max(maxAY, Math.abs(dy2 - dyp) / dt / dt);
    if (dx < -1e-9) backX++;
    if (Math.abs(dy2) > 0.15 && Math.abs(dyp) > 0.15 && Math.sign(dy2) !== Math.sign(dyp)) revY++;
  }
  return {
    landingStep: Math.abs(preLandCamYR - targetTY), settleT,
    peakYSpeed: maxDY, peakYSpeedPx: maxDY * Z, peakYAccel: maxAY,
    peakXSpeed: maxDX, xBackward: backX, yReversals: revY, ySamples,
  };
}

console.log("== REVIZYON-045 render camera: R044 (no pre-land blend) vs R045 (pre-land blend), same current constants otherwise ==\n");
for (const dtms of [16.67, 33.3]) {
  const dt = dtms / 1000;
  for (const [label, charge, dy] of [
    ["small jump (charge=0.35, rise=-25u)", 0.35, -25],
    ["normal jump (charge=0.50, rise=-40u)", 0.5, -40],
    ["mid jump (charge=0.65, rise=-90u)", 0.65, -90],
    ["mid-high jump (charge=0.80, rise=-140u)", 0.8, -140],
    ["full-charge jump (charge=1.00, rise=-200u)", 1.0, -200],
    ["full-charge DROP (charge=1.00, drop=+180u)", 1.0, 180],
  ]) {
    const b = run(dt, charge, dy, false);
    const a = run(dt, charge, dy, true);
    console.log(`-- ${label}, dt=${dtms}ms --`);
    console.log(`  R044: landing-step=${b.landingStep.toFixed(0)}u settle2%=${b.settleT.toFixed(2)}s peakYSpeed=${b.peakYSpeed.toFixed(0)}u/s(${b.peakYSpeedPx.toFixed(0)}px/s) peakYAccel=${b.peakYAccel.toFixed(0)}u/s2 peakXSpeed=${b.peakXSpeed.toFixed(0)}u/s Xbackward=${b.xBackward} Yreversals=${b.yReversals}`);
    console.log(`  R045: landing-step=${a.landingStep.toFixed(0)}u settle2%=${a.settleT.toFixed(2)}s peakYSpeed=${a.peakYSpeed.toFixed(0)}u/s(${a.peakYSpeedPx.toFixed(0)}px/s) peakYAccel=${a.peakYAccel.toFixed(0)}u/s2 peakXSpeed=${a.peakXSpeed.toFixed(0)}u/s Xbackward=${a.xBackward} Yreversals=${a.yReversals}`);
  }
}

// p90/p99/max vertical render-camera speed proxy over MANY jumps of mixed
// sizes (mirrors the percentile comparison from the 09-29 13:27 iPhone review).
function percentile(arr, p) { const s2 = [...arr].sort((a, b) => a - b); return s2[Math.min(s2.length - 1, Math.floor(s2.length * p))]; }
console.log("\n== p90/p99/max vertical render-camera speed over 60 mixed-size jumps (dt=16.67ms) ==");
const dt = 16.67 / 1000;
for (const [label, usePreLand] of [["R044", false], ["R045", true]]) {
  let all = [];
  let seed = 998877; const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  for (let i = 0; i < 60; i++) {
    const charge = 0.30 + rnd() * 0.70;
    const dy = (rnd() < 0.5 ? -1 : 1) * (15 + rnd() * 195);
    const r = run(dt, charge, dy, usePreLand);
    all = all.concat(r.ySamples);
  }
  console.log(`${label}: p90=${percentile(all, 0.90).toFixed(1)}u/s(${(percentile(all, 0.90) * Z).toFixed(1)}px/s) p99=${percentile(all, 0.99).toFixed(1)}u/s(${(percentile(all, 0.99) * Z).toFixed(1)}px/s) max=${Math.max(...all).toFixed(1)}u/s(${(Math.max(...all) * Z).toFixed(1)}px/s)`);
}
