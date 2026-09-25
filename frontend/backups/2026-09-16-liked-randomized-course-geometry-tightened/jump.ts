import { CONFIG, REFERENCE_TRIAL } from "./config";

export function physicsScale(screenWidth = 440) {
  "worklet";
  return REFERENCE_TRIAL ? screenWidth / 440 : 1;
}

export function flightGravity(screenWidth = 440) {
  "worklet";
  return CONFIG.gravity * physicsScale(screenWidth);
}

export function jumpVelocity(charge: number, screenWidth = 440) {
  "worklet";
  const c = Math.max(0, Math.min(1, charge));
  const scale = physicsScale(screenWidth);
  // Both branches read the SAME reshaped charge value. Reshaping charge itself
  // (instead of only vy) keeps vy/vx -- hence launch angle -- exactly as it
  // was at every hold duration; only vx and vy alone would tilt the angle
  // away from the reference's near-constant ~70 degrees. See CLAUDE_VIDEO_RESULT.md.
  const effectiveCharge = Math.pow(c, CONFIG.chargeResponseCurve);
  const lateralCharge = Math.min(1, effectiveCharge / CONFIG.horizontalChargePlateau);
  const verticalCharge = effectiveCharge;
  return {
    vx: (CONFIG.minJumpVX + lateralCharge * (CONFIG.maxJumpVX - CONFIG.minJumpVX)) * scale,
    vy: -(CONFIG.minJumpVY + verticalCharge * (CONFIG.maxJumpVY - CONFIG.minJumpVY)) * scale,
  };
}

export function advanceFlight(x: number, y: number, vx: number, vy: number, dt: number, screenWidth = 440) {
  "worklet";
  const gravity = flightGravity(screenWidth);
  return { x: x + vx * dt, y: y + vy * dt + 0.5 * gravity * dt * dt, vy: vy + gravity * dt };
}
