// ============================================================================
// CENTRALIZED GAMEPLAY CONFIGURATION
// ----------------------------------------------------------------------------
// Every value that affects how the game FEELS lives here. Tune these after
// playtesting — do not scatter magic numbers through the engine.
//
// Units:
//   distance  -> logical pixels (matches on-screen pixels at camera zoom 1)
//   time      -> seconds
//   velocity  -> pixels / second
//   accel     -> pixels / second^2
//
// Coordinate system used by the engine:
//   +x  = right   (the player always launches to the right)
//   +y  = DOWN    (screen-like). Gravity is POSITIVE. A jump gives NEGATIVE vy.
// ============================================================================

export const CONFIG = {
  // --- Physics -------------------------------------------------------------
  gravity: 2600, // px/s^2 downward pull. Higher = snappier / less floaty.

  // Jump force is interpolated between MIN (tap) and MAX (full charge).
  // Both horizontal and vertical scale together so a longer hold sends the
  // blob higher AND farther, keeping the mapping intuitive.
  minJumpVX: 300, // horizontal launch speed at 0% charge
  maxJumpVX: 560, // horizontal launch speed at 100% charge
  minJumpVY: 760, // upward launch speed at 0% charge (applied as negative)
  maxJumpVY: 1360, // upward launch speed at 100% charge

  // How long the player must hold to reach full charge.
  maxChargeDuration: 1.7, // seconds (spec: ~1.5–2s). Holding longer does nothing.

  // --- Player collision ----------------------------------------------------
  playerWidth: 46, // collision + base render width
  playerHeight: 46, // collision + base render height

  // --- Platform generation -------------------------------------------------
  minPlatformDistance: 150, // min edge-to-edge gap between platforms
  maxPlatformDistance: 260, // max edge-to-edge gap (kept visible + reachable)
  minPlatformWidth: 72,
  maxPlatformWidth: 110,
  platformHeightVariation: 78, // max +/- change in platform top height vs previous
  platformThickness: 26, // visual thickness of a platform below its top surface

  // Bounds for platform top height relative to the starting level (world y).
  platformMinTopY: -260, // highest a platform can sit (remember +y is down)
  platformMaxTopY: 260, // lowest a platform can sit

  // --- Landing fairness ----------------------------------------------------
  landingForgiveness: 12, // px of extra horizontal grace beyond platform edges
  landingTopTolerance: 16, // px vertical grace when snapping onto a platform top
  perfectTolerance: 22, // px from platform center that still counts as PERFECT

  // --- Scoring -------------------------------------------------------------
  scorePerLanding: 1,
  scorePerfectBonus: 2,

  // --- Camera --------------------------------------------------------------
  // A gentle zoom-out frames more of the route ahead without shrinking the
  // character too much. The player is kept in the left ~30% so the right side
  // of the portrait screen always reveals the upcoming platforms.
  cameraZoom: 0.62, // world -> screen scale. Lower = see more route, smaller art.
  cameraPlayerAnchorX: 0.3, // player screen position: left 30%
  cameraPlayerAnchorY: 0.5, // vertical resting anchor for the standing level
  cameraSmoothingX: 0.14, // horizontal follow lerp per frame (0..1). Lower = smoother.
  cameraSmoothingY: 0.07, // vertical follow lerp (only tracks landing levels, not arcs)
  cameraFallSmoothing: 0.1, // vertical follow while falling to Game Over

  // --- Generation / cleanup window ----------------------------------------
  spawnAhead: 500, // keep platforms generated this far past the visible right edge
  removeBehind: 200, // remove platforms this far behind the visible left edge

  // --- Feel / juice --------------------------------------------------------
  chargeSquashY: 0.32, // how much the blob compresses vertically at full charge
  chargeStretchX: 0.24, // how much it widens at full charge
  maxChargeShake: 2.4, // px jitter amplitude once near max charge
  airStretchY: 0.16, // vertical stretch while airborne
  landPulseDuration: 0.26, // seconds for the landing compression to recover
} as const;

// ============================================================================
// DEBUG MODE
// Flip to false for production. When true, an on-screen overlay shows live
// physics telemetry (charge %, velocities, platform distance/width, landing
// offset, FPS).
// ============================================================================
export const DEBUG_MODE = true;

// Phase enum shared between the JS side and the UI-thread worklet loop.
export const PHASE = {
  IDLE: 0, // standing on a platform, ready to charge
  CHARGING: 1, // finger down, building power
  AIRBORNE: 2, // mid-jump, gravity only, no steering
  DEAD: 3, // fell — camera follows down, Game Over shown
} as const;
