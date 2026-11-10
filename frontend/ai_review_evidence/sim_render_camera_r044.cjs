// REVIZYON-044: before/after comparison of the render camera (src/game/
// render-camera.ts) using the REAL exported functions, plus REAL jump.ts
// physics (jumpVelocity/advanceFlight/flightGravity) to drive a normal and a
// full-charge flight. Mirrors the actual app/index.tsx worklet code path:
//   - physics camY (unchanged by R044, reproduced here only to drive tY)
//   - render camXR (X path, UNCHANGED -- smoothTime/maxSpeed/maxAccel/
//     targetSmoothTime, reused verbatim to prove X did not move)
//   - render camYR (Y path -- this is what R044 changed: smoothTimeYStand/
//     smoothTimeYFlight lengthened, and Y gets its own maxSpeedY/maxAccelY
//     instead of sharing X's maxSpeed/maxAccel; Y target ramps through
//     targetSmoothTimeY instead of X's targetSmoothTime)
// "BEFORE" numbers use the R043 constants (recorded here from the file as it
// stood immediately before this task's edit, not re-derived/guessed).
// Run: node ai_review_evidence/sim_render_camera_r044.cjs
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
const RC_AFTER = loadTs("/src/game/render-camera.ts", {});
const { stepRenderAxis, corridorTarget, smoothRenderTarget } = RC_AFTER;
const AFTER = RC_AFTER.RENDER_CAM;

// R043 constants, exactly as they read in src/game/render-camera.ts before
// this task's edit (confirmed by reading the file at the start of this task).
const BEFORE = {
  smoothTime: 0.30, smoothTimeYStand: 0.44, smoothTimeYFlight: 0.50,
  maxSpeed: 400, maxAccel: 1100, targetSmoothTime: 0.18,
};

const Z = CONFIG.cameraZoom, W = 390, H = 844, s = Z;
const FRAME_LO = 0.12, FRAME_HI = 0.90, FRAME_XL = 0.14, FRAME_XR = 0.88;
const loW = FRAME_LO * H / s, hiW = FRAME_HI * H / s, xLoW = FRAME_XL * W / s, xHiW = FRAME_XR * W / s;

// Two real platforms and a REAL flight computed from jump.ts, for a given
// charge fraction and a given landing-height DELTA (world units, + = drop,
// - = rise). advanceFlight is stepped every dt like the live game; the path
// ends the frame it actually crosses the requested cap height with vy > 0
// (falling onto it), the same physical event findFootLanding reacts to --
// this is not a hand-written projectile formula.
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
    if (vy > 0 && y >= capY) break; // crossed the requested cap height, falling
  }
  return { path, targetTopY: path[path.length - 1].y, targetX: path[path.length - 1].x, reachedDy: dy };
}

function run(dt, RC, chargeLabel, charge, dy) {
  const flight = realFlight(charge, dy, dt);
  const from = { id: 0, x: 0, topY: 0, width: 64 };
  const to = { id: 1, x: flight.targetX - 32, topY: flight.targetTopY, width: 64 };

  let px = from.x + from.width * 0.5, py = from.topY, standing = 0;
  let camX = px - CONFIG.cameraDeadZoneRight * W / s, camY = py - CONFIG.cameraPlayerAnchorY * H / s, vY = 0;
  let camXR = camX, camYR = camY, vXR = 0, vYR = 0, tXmax = camX, tYSoft = camY;
  let flightLockY = camY, flightTargetY = to.topY;
  const log = []; let t = 0;

  const stepX = (p, v, tgt) => stepRenderAxis(p, v, tgt, dt, RC.smoothTime, RC.maxSpeed, RC.maxAccel);
  const stepY = (p, v, tgt, smoothTime) => stepRenderAxis(p, v, tgt, dt, smoothTime,
    RC.maxSpeedY !== undefined ? RC.maxSpeedY : RC.maxSpeed,
    RC.maxAccelY !== undefined ? RC.maxAccelY : RC.maxAccel);
  const yTargetTau = RC.targetSmoothTimeY !== undefined ? RC.targetSmoothTimeY : RC.targetSmoothTime;

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
    tXmax = smoothRenderTarget(tXmax, tX, dt, RC.targetSmoothTime);
    const rx = stepX(camXR, vXR, tXmax);
    if (rx[0] < camXR) { vXR = Math.max(0, rx[1]); } else { camXR = rx[0]; vXR = rx[1]; }

    let tY2 = tY, ySmoothTime = RC.smoothTimeYStand;
    if (phase === "AIR") {
      const fMin = Math.min(py, flightTargetY), fMax = Math.max(py, flightTargetY);
      tY2 = corridorTarget(flightLockY, fMin, fMax, loW, hiW);
      ySmoothTime = RC.smoothTimeYFlight;
    } else {
      flightLockY = camYR;
    }
    tYSoft = smoothRenderTarget(tYSoft, tY2, dt, yTargetTau);
    const ry = stepY(camYR, vYR, tYSoft, ySmoothTime);
    camYR = ry[0]; vYR = ry[1];

    log.push({ t, camXR, camYR, phase });
    t += dt;
  };

  // IDLE / CHARGING before takeoff
  for (let k = 0; k < Math.round(0.5 / dt); k++) frameStep("IDLE");
  flightLockY = camYR; flightTargetY = to.topY;
  // AIRBORNE: real jump.ts trajectory
  for (const pt of flight.path) { px = pt.x; py = pt.y; frameStep("AIR"); }
  px = to.x + to.width * 0.5; py = to.topY; standing = 1;
  const preLandCamYR = camYR;
  const targetTY = to.topY - CONFIG.cameraPlayerAnchorY * H / s;
  let settleT = -1;
  for (let k = 0; k < Math.round(3.0 / dt); k++) {
    frameStep("IDLE");
    if (settleT < 0 && Math.abs(camYR - targetTY) < 0.02 * Math.max(1, Math.abs(preLandCamYR - targetTY))) settleT = log[log.length - 1].t - (flight.path.length * dt + 0.5);
  }

  let maxDY = 0, maxAY = 0, maxDX = 0, backX = 0, revY = 0;
  for (let i = 2; i < log.length; i++) {
    const dx = log[i].camXR - log[i - 1].camXR, dy = log[i].camYR - log[i - 1].camYR;
    const dyp = log[i - 1].camYR - log[i - 2].camYR;
    maxDX = Math.max(maxDX, Math.abs(dx) / dt);
    maxDY = Math.max(maxDY, Math.abs(dy) / dt);
    maxAY = Math.max(maxAY, Math.abs(dy - dyp) / dt / dt);
    if (dx < -1e-9) backX++;
    if (Math.abs(dy) > 0.15 && Math.abs(dyp) > 0.15 && Math.sign(dy) !== Math.sign(dyp)) revY++;
  }
  return {
    label: chargeLabel, dtms: Math.round(dt * 10000) / 10, landingStep: Math.abs(preLandCamYR - targetTY),
    settleT, peakYSpeed: maxDY, peakYSpeedPx: maxDY * Z, peakYAccel: maxAY, peakXSpeed: maxDX, xBackward: backX, yReversals: revY,
  };
}

console.log("== REVIZYON-044 render camera: normal vs full-charge jump, before/after ==");
console.log("(camX/camY physics + jump.ts trajectory are REAL functions from the current tree; only RENDER_CAM Y constants differ between BEFORE/AFTER)\n");
for (const dtms of [16.67, 33.3]) {
  const dt = dtms / 1000;
  for (const [label, charge, dy] of [["normal jump (charge=0.50, rise=-40u)", 0.5, -40], ["full-charge jump (charge=1.00, rise=-200u)", 1.0, -200]]) {
    const b = run(dt, BEFORE, label, charge, dy);
    const a = run(dt, AFTER, label, charge, dy);
    console.log(`-- ${label}, dt=${dtms}ms --`);
    console.log(`  ONCE (R043): landing-step=${b.landingStep.toFixed(0)}u settle2%=${b.settleT.toFixed(2)}s peakYSpeed=${b.peakYSpeed.toFixed(0)}u/s(${b.peakYSpeedPx.toFixed(0)}px/s) peakYAccel=${b.peakYAccel.toFixed(0)}u/s2 peakXSpeed=${b.peakXSpeed.toFixed(0)}u/s Xbackward=${b.xBackward} Yreversals=${b.yReversals}`);
    console.log(`  SONRA (R044): landing-step=${a.landingStep.toFixed(0)}u settle2%=${a.settleT.toFixed(2)}s peakYSpeed=${a.peakYSpeed.toFixed(0)}u/s(${a.peakYSpeedPx.toFixed(0)}px/s) peakYAccel=${a.peakYAccel.toFixed(0)}u/s2 peakXSpeed=${a.peakXSpeed.toFixed(0)}u/s Xbackward=${a.xBackward} Yreversals=${a.yReversals}`);
  }
}
