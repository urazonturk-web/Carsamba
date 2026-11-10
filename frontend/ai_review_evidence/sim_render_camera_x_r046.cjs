// REVIZYON-046: X-axis render camera analysis using REAL jump.ts physics and
// the REAL physics camX formula (reproduced here only to drive the render
// camera's `base`, unchanged by this task). Measures the player's on-SCREEN
// x fraction over a full-charge flight, before (R045 X: no lead, single
// smoothTime/maxSpeed/maxAccel for all phases) and after (R046: continuous
// vx-proportional lead added to the corridor's forward reach, plus a
// flight-only higher speed/accel ceiling so the render camera can actually
// reach that lead in time -- IDLE/CHARGING/landed X behaviour is completely
// unchanged, verified below by an explicit normal-jump comparison).
// Run: node ai_review_evidence/sim_render_camera_x_r046.cjs
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
const { stepRenderAxis, corridorTarget, smoothRenderTarget, xFlightBlend } = RC;
const AFTER = RC.RENDER_CAM;

const Z = CONFIG.cameraZoom, W = 390, H = 844, s = Z;
const FRAME_XL = 0.14, FRAME_XR = 0.88;
const xLoW = FRAME_XL * W / s, xHiW = FRAME_XR * W / s;

// A real flight (charge fixed) landing at a real, reachable gap for that
// charge -- same ballistic-reach idea procedural-course.ts itself uses
// (safeMax from the discriminant), not a hand-picked distance.
function realFlight(charge, dyFraction, dt) {
  const v = jumpVelocity(charge, W);
  const g = flightGravity(W);
  // Choose a landing height delta as a fraction of the max upward reach so
  // big/small charges each get a representative, physically-reachable dy.
  const apexRise = (v.vy * v.vy) / (2 * g);
  const dy = -apexRise * dyFraction; // negative = rise
  let x = 0, y = 0, vx = v.vx, vy = v.vy;
  const path = [];
  for (let i = 0; i < 600; i++) {
    const r = advanceFlight(x, y, vx, vy, dt, W);
    x = r.x; y = r.y; vy = r.vy;
    path.push({ x, y, vx });
    if (vy > 0 && y >= dy) break;
  }
  return { path, targetTopY: path[path.length - 1].y, targetX: path[path.length - 1].x };
}

// `useLead`: R046's continuous vx-proportional forward reach + flight-only
// X speed/accel ceiling. Everything else (physics camX formula, corridor
// logic, monotonic-forward guard, targetSmoothTime) is IDENTICAL to R045.
function run(dt, charge, dyFraction, useLead) {
  const flight = realFlight(charge, dyFraction, dt);
  const from = { id: 0, x: 0, topY: 0, width: 64 };
  // REVIZYON-046 finding: on a big multi-tower-skip jump, the "first platform
  // ahead of standing" the real code's corridor search finds is the NEAREST
  // platform in the course, NOT where the player actually lands (they fly
  // OVER several intermediate platforms). Model that gap realistically
  // (~180u, a typical single-hop distance) instead of cheating by placing
  // the visible "next platform" exactly at the real landing spot.
  const nearestNext = { id: 1, x: from.x + from.width + 180, topY: 0, width: 64 };
  const to = { id: 99, x: flight.targetX - 32, topY: flight.targetTopY, width: 64 };

  let px = from.x + from.width * 0.5, py = from.topY, vx = 0, standing = 0;
  let camX = px - CONFIG.cameraDeadZoneRight * W / s;
  let camXR = camX, camVXR = 0, camXRTarget = camX;
  const log = []; let t = 0;

  const frameStep = (phase) => {
    const deadZoneX = px - CONFIG.cameraDeadZoneRight * W / s;
    camX += (Math.max(camX, deadZoneX) - camX) * CONFIG.cameraSmoothingX;

    let tX = camX;
    if (phase !== "DEAD") {
      let xMin = px - 30, xMax = px + 30;
      // "first platform ahead of standing" (identical to app/index.tsx) --
      // uses the NEAREST platform (nearestNext), same as the real course
      // array would give the corridor search, NOT the true landing spot.
      if (phase === "AIR" || phase === "IDLE") { xMin = Math.min(xMin, nearestNext.x); xMax = Math.max(xMax, nearestNext.x + nearestNext.width); }
      let t = 0;
      if (useLead) {
        t = xFlightBlend(vx);
        xMax = Math.max(xMax, px + t * AFTER.xLeadMax);
      }
      tX = corridorTarget(camX, xMin, xMax, xLoW, xHiW);
    }
    if (tX < camXRTarget) tX = camXRTarget; // monotonic forward-only, unchanged
    camXRTarget = smoothRenderTarget(camXRTarget, tX, dt, AFTER.targetSmoothTime);
    const t2 = useLead ? xFlightBlend(vx) : 0;
    const smoothTime = AFTER.smoothTime + (AFTER.smoothTimeXFlight - AFTER.smoothTime) * t2;
    const maxSpeed = AFTER.maxSpeed + (AFTER.maxSpeedXFlight - AFTER.maxSpeed) * t2;
    const maxAccel = AFTER.maxAccel + (AFTER.maxAccelXFlight - AFTER.maxAccel) * t2;
    const rx = stepRenderAxis(camXR, camVXR, camXRTarget, dt, smoothTime, maxSpeed, maxAccel);
    if (rx[0] < camXR) { camVXR = Math.max(0, rx[1]); } else { camXR = rx[0]; camVXR = rx[1]; }

    const screenFrac = (px - camXR) * Z / W;
    log.push({ t, screenFrac, camXR, phase });
    t += dt;
  };

  for (let k = 0; k < Math.round(0.3 / dt); k++) frameStep("IDLE");
  for (const pt of flight.path) { px = pt.x; py = pt.y; vx = pt.vx; frameStep("AIR"); }
  px = to.x + to.width * 0.5; py = to.topY; vx = 0; standing = 1;
  for (let k = 0; k < Math.round(1.0 / dt); k++) frameStep("IDLE");

  return { log, flightDuration: flight.path.length * dt };
}

function analyze(res, label) {
  const { log, flightDuration } = res;
  const airFrames = log.filter((l) => l.phase === "AIR" && l.t >= 0.15); // skip first ~150ms per spec
  let maxAbove75 = 0, curAbove75 = 0, dt0 = log.length > 1 ? log[1].t - log[0].t : 0.0167;
  let backward = 0;
  for (let i = 1; i < log.length; i++) {
    if (log[i].camXR < log[i - 1].camXR - 1e-9) backward++;
    if (log[i].screenFrac > 0.75) { curAbove75 += dt0; maxAbove75 = Math.max(maxAbove75, curAbove75); } else curAbove75 = 0;
  }
  const inBand = airFrames.filter((l) => l.screenFrac >= 0.35 && l.screenFrac <= 0.65).length;
  const apex = log.reduce((a, b) => (b.phase === "AIR" && (!a || b.t < a.t + 0.001) ? a : a), null);
  // apex = frame with min screenFrac-independent vy sign change; simpler: pick middle of AIR frames
  const airOnly = log.filter((l) => l.phase === "AIR");
  const apexFrame = airOnly[Math.floor(airOnly.length / 2)];
  console.log(`${label}: flight=${flightDuration.toFixed(2)}s frames-in-35-65%-band(after 150ms)=${inBand}/${airFrames.length} maxTimeAbove75%=${maxAbove75.toFixed(2)}s apex-mid-screenFrac=${(apexFrame.screenFrac * 100).toFixed(0)}% camXbackward=${backward}`);
  return { inBand, total: airFrames.length, maxAbove75, apexFrac: apexFrame.screenFrac };
}

console.log("== REVIZYON-046 X-axis render camera: full-charge flight, R045 (no lead) vs R046 (vx lead) ==\n");
for (const dt of [16.67 / 1000]) {
  for (const dyFrac of [0.9, 0.5, 0, -0.3, -0.6]) {
    console.log(`-- dt=${(dt * 1000).toFixed(2)}ms, dyFraction=${dyFrac} --`);
    analyze(run(dt, 1.0, dyFrac, false), "full-charge R045");
    analyze(run(dt, 1.0, dyFrac, true), "full-charge R046");
  }
}
console.log("\n-- normal/short jumps: R046 must reproduce R045 almost exactly (vx is small, lead ~0) --");
for (const [label, charge] of [["short (0.35)", 0.35], ["normal (0.5)", 0.5], ["mid (0.65)", 0.65], ["mid-high (0.75)", 0.75], ["mid-high (0.85)", 0.85], ["mid-high (0.92)", 0.92]]) {
  const dt = 16.67 / 1000;
  const b = analyze(run(dt, charge, 0.5, false), `${label} R045`);
  const a = analyze(run(dt, charge, 0.5, true), `${label} R046`);
}
