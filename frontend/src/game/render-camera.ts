// REVIZYON-036: render-only camera helpers (camXR / camYR). Pure functions so the
// live UI-thread frame loop (app/index.tsx) and the offline step-response script
// (ai_review_evidence/sim_render_camera.cjs) run the exact same math. Nothing
// here reads or writes camX/camY, physics, collision or course data.

// Render camera tuning. smoothTime ~ critically damped time constant; the visual
// settle to ~2% of a step is ~2.6x this (measured in sim_render_camera.cjs).
export const RENDER_CAM = {
  smoothTime: 0.30, // REVIZYON-043: slower horizontal framing on takeoff/landing (X -- UNCHANGED by R044)
  // REVIZYON-037: dedicated Y time constant used OUTSIDE flight (IDLE/CHARGING/
  // DEAD), chasing the SAME raw target the physics camera chases (not camY.value
  // itself, which is already smoothed -- chasing a smoothed value would cascade
  // two critically damped filters). REVIZYON-044: lengthened 0.44 -> 0.60 so the
  // vertical difference remaining right after a landing is absorbed over a
  // longer, calmer transition (user report: "iniş sonrası uzun, belirgin dikey
  // yerleşme gözü yoruyor" -- the fix is a SLOWER settle, not a snap). Measured
  // in ai_review_evidence/sim_render_camera_r044.cjs.
  smoothTimeYStand: 0.60,
  // REVIZYON-038: one continuous follower during flight. REVIZYON-044: 0.50 ->
  // 0.58, paired with maxAccelY/maxSpeedY below so a full-charge apex cannot
  // command a sharper vertical move than a normal jump -- measured separately
  // for both in ai_review_evidence/sim_render_camera_r044.cjs.
  smoothTimeYFlight: 0.58,
  maxSpeed: 400, // world units / s -- X ONLY (x zoom 0.62 ~ 248 px/s), unchanged by R044
  maxAccel: 1100, // X ONLY, unchanged by R044
  // REVIZYON-044: the vertical axis gets its OWN, lower speed/accel ceiling
  // (previously shared RENDER_CAM.maxSpeed/maxAccel with X). This is what
  // actually bounds "havadayken/tam şarjda dikey hedef değişimi" and the
  // post-landing settle to a continuous, jerk-limited motion instead of a
  // fast correction -- X (yatay takip) keeps its own unchanged limits above.
  maxSpeedY: 250, // world units / s (x zoom 0.62 ~ 155 px/s)
  maxAccelY: 620, // world units / s^2 -- softer than X's 1100 on purpose
  targetSmoothTime: 0.18, // X target ramp -- unchanged by R044
  // REVIZYON-044: Y gets a longer target ramp than X, so a phase change
  // (charge -> airborne -> landed) never hands stepRenderAxis a stepped
  // target; combined with maxAccelY this is the "hedefi bir anda
  // değiştirme" fix for both normal and full-charge jumps.
  targetSmoothTimeY: 0.24,
  secondTargetSlack: 1.15, // once included, the 2nd target stays until span > fit * slack
  // REVIZYON-045: measurement showed the R044 peak Y speed/accel for a big
  // jump happens AFTER touchdown, not during flight (the whole large height
  // correction was deferred to the post-landing stand-phase filter -- see
  // ai_review_evidence/sim_render_camera_r045.cjs). Fix: while DESCENDING
  // (vy > 0, past the apex), the render camera continuously eases its
  // flight target toward the ACTUAL upcoming landing composition (see
  // preLandBlend usage in app/index.tsx) instead of waiting for touchdown to
  // make the whole correction at once. A long fall (full charge / big drop)
  // has more descending TIME, so this blend gets much closer to 1 before
  // landing actually happens -- shrinking the residual the post-landing
  // filter has to absorb, which continuously and automatically scales the
  // effect with jump size (measured: peak accel 66 u/s2 for a small jump up
  // to 381 u/s2 for an extreme one, vs a flat ~558 u/s2 for any big jump
  // under R044). A short/normal jump's fall is too brief for the blend to
  // move far, so its feel is effectively unchanged. An earlier candidate
  // that ALSO grew smoothTimeYFlight itself for big jumps was tried and
  // REJECTED: it let the flight-phase follower lag further behind before
  // landing, handing preLandBlend an even BIGGER residual to close and
  // making the peak WORSE (620, hitting maxAccelY) -- see the sweep in
  // ai_review_evidence/sim_render_camera_r045.cjs's history. smoothTimeYFlight
  // itself is therefore UNCHANGED from R044 (0.58, used for every jump size).
  preLandTau: 0.9,
  // REVIZYON-046: X ONLY, and ONLY while AIRBORNE (see xLeadGain/xLeadMax
  // usage in app/index.tsx). IDLE/CHARGING/landed X keeps `smoothTime`/
  // `maxSpeed`/`maxAccel` above UNCHANGED -- this is a strictly additive,
  // continuous forward reach for long/high-charge flights, tuned/measured in
  // ai_review_evidence/sim_render_camera_x_r046.cjs.
  // REVIZYON-046: the lead/faster-follower blend is a CONTINUOUS function of
  // the player's own REAL horizontal launch speed (vx.value -- physically
  // known the instant a jump launches, not a platform/aim guess), ramping
  // from 0 at xLeadVxLo to 1 at xLeadVxHi via smoothstep (xFlightBlend
  // below). vx for charge<=0.65 stays under xLeadVxLo, so short/normal/mid
  // presses get EXACTLY the R045 numbers (verified: 0 behavioural diff in
  // ai_review_evidence/sim_render_camera_x_r046.cjs); only charge roughly
  // >0.7-0.75 and up starts blending in, reaching full effect near full
  // charge -- this is "eşikli sert dal" avoided in favour of a smooth ramp.
  xLeadVxLo: 400, // world units/s (~charge 0.68) -- below this, lead/caps are the R045 base values, unchanged
  xLeadVxHi: 520, // world units/s (~charge 0.96) -- at/above this, full lead/caps below apply
  xLeadMax: 520, // world-unit cap on the extra forward look-ahead at full blend
  smoothTimeXFlight: 0.20, // X time constant at full blend (base smoothTime unchanged at t=0)
  maxSpeedXFlight: 900, // world units/s at full blend (base maxSpeed unchanged at t=0)
  maxAccelXFlight: 3400, // world units/s^2 at full blend (base maxAccel unchanged at t=0)
} as const;

function clamp01(t: number) {
  "worklet";
  return Math.max(0, Math.min(1, t));
}
function smooth01(t: number) {
  "worklet";
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
}
// 0 for |vx| <= xLeadVxLo (short/normal/mid presses -- R045 X behaviour,
// byte-for-byte), ramping smoothly to 1 at/above xLeadVxHi (near/at full
// charge). Continuous in vx, so there is no discrete "high charge" branch.
export function xFlightBlend(vx: number): number {
  "worklet";
  return smooth01((Math.abs(vx) - RENDER_CAM.xLeadVxLo) / (RENDER_CAM.xLeadVxHi - RENDER_CAM.xLeadVxLo));
}

export function smoothRenderTarget(current: number, desired: number, dt: number, timeConstant: number): number {
  "worklet";
  const alpha = dt / (Math.max(0.001, timeConstant) + dt);
  return current + (desired - current) * alpha;
}

// Critically damped follower with a velocity + acceleration limit. Position and
// velocity are both continuous across frames (velocity changes by at most
// maxAccel * dt), so a target step can never produce a sudden speed change.
// Returns [pos, vel].
export function stepRenderAxis(
  pos: number,
  vel: number,
  target: number,
  dt: number,
  smoothTime: number,
  maxSpeed: number,
  maxAccel: number,
): number[] {
  "worklet";
  const omega = 2 / smoothTime;
  const x = omega * dt;
  const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = pos - target;
  const temp = (vel + omega * change) * dt;
  let vNew = (vel - omega * temp) * decay;
  let pNew = target + (change + temp) * decay;
  // Acceleration then speed limit (position integrates the limited velocity
  // whenever a limit is active; otherwise the exact spring solution is kept).
  const dvMax = maxAccel * dt;
  let limited = false;
  if (vNew - vel > dvMax) { vNew = vel + dvMax; limited = true; }
  else if (vNew - vel < -dvMax) { vNew = vel - dvMax; limited = true; }
  if (vNew > maxSpeed) { vNew = maxSpeed; limited = true; }
  else if (vNew < -maxSpeed) { vNew = -maxSpeed; limited = true; }
  if (limited) {
    pNew = pos + 0.5 * (vel + vNew) * dt;
    // never fly past the target because of the limited (hence slower) braking
    if ((pos - target > 0) !== (pNew - target > 0) && pos !== target) { pNew = target; vNew = 0; }
  }
  return [pNew, vNew];
}

// Camera position closest to `base` that keeps [fMin, fMax] (world coords) inside
// the [loW, hiW] window (world-sized screen fractions). If the span cannot fit,
// the centre-out compromise is returned. Continuous in all inputs.
export function corridorTarget(base: number, fMin: number, fMax: number, loW: number, hiW: number): number {
  "worklet";
  const lo = fMax - hiW; // camera must be >= lo so the far edge stays inside
  const hi = fMin - loW; // camera must be <= hi so the near edge stays inside
  return lo <= hi ? Math.min(hi, Math.max(lo, base)) : (lo + hi) / 2;
}

// Hysteresis for adding the 2nd target to the framed span: enter only when it
// fits, leave only when it clearly stops fitting.
export function includeSecondTarget(span: number, fit: number, wasIncluded: boolean): boolean {
  "worklet";
  return wasIncluded ? span <= fit * RENDER_CAM.secondTargetSlack : span <= fit;
}
