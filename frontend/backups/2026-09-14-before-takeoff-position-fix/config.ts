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

const PREVIOUS_CONFIG = {
  // --- Physics -------------------------------------------------------------
  gravity: 2300, // px/s^2 downward pull. Higher = snappier / less floaty.

  // Jump force is interpolated between MIN (tap) and MAX (full charge).
  // Vertical speed follows charge; horizontal speed reaches a plateau early.
  // Longer normal holds travel farther because the flight lasts longer.
  minJumpVX: 70, // horizontal launch speed at 0% charge
  maxJumpVX: 400, // horizontal launch speed at 100% charge
  minJumpVY: 220, // upward launch speed at 0% charge (applied as negative)
  horizontalChargePlateau: 0.22, // normal jumps share horizontal speed; tiny taps remain short
  maxJumpVY: 1450, // upward launch speed at 100% charge
  chargeResponseCurve: 1, // exponent reshaping the charge fraction before it drives BOTH vx and vy; 1 = linear (unchanged)

  // How long the player must hold to reach full charge. Tuned so ~50% charge
  // lands around 0.225s and 100% around 0.45s. Spring compression and launch
  // power use this same linear charge value.
  maxChargeDuration: 0.45, // seconds. Holding longer does nothing.

  // --- Player collision ----------------------------------------------------
  playerWidth: 54, // collision + base render width
  playerHeight: 54, // collision + base render height

  // --- Platform generation (towers) ---------------------------------------
  // Landing-surface widths come in three readable categories. The visible top
  // width IS the collision width — no hidden margins.
  widthWide: { min: 76, max: 96 }, // forgiving
  widthMedium: { min: 56, max: 68 }, // standard
  widthNarrow: { min: 38, max: 46 }, // precision / risk

  // Gaps + height variation interpolate from "early" to "late" over
  // difficultyRamp platforms (gradual difficulty envelope).
  gapEarly: { min: 110, max: 340 }, // short, forgiving early gaps
  gapLate: { min: 140, max: 380 }, // longer late gaps (still reachable)
  warmupGapMax: 260, // opening still varies, without the longest gaps
  reachReserve: 0.06, // leave travel reserve even from the previous tower left edge
  heightVarWarmup: 180, // visible climbs/drops even on the opening towers
  heightVarEarly: 220, // varied early height differences
  heightVarLate: 300, // larger late height differences (< max jump apex)
  difficultyRamp: 40, // platforms over which difficulty ramps 0 -> 1
  noNarrowBeforeId: 6, // never spawn NARROW towers before this platform id
  warmupTowers: 3, // first N towers are a gentle warm-up (wide/medium, short gaps)

  platformMinTopY: -320, // highest a tower top can sit (remember +y is down)
  platformMaxTopY: 320, // lowest a tower top can sit
  columnHeight: 1600, // tower body length downward (extends below screen)
  capHeight: 12, // landing-surface cap thickness

  // --- Landing fairness ----------------------------------------------------
  // Sole silhouettes in the tracksuit image, normalized across its width.
  footSoles: [[0.20, 0.41], [0.59, 0.795]],
  perfectTolerance: 22, // px from platform center that still counts as PERFECT

  // --- Scoring -------------------------------------------------------------
  scorePerLanding: 1, // base points per tower advanced
  scoreMultiTowerBonus: 1, // extra per tower when advancing 2+ in one jump
  scorePerfectBonus: 2,

  // --- Camera --------------------------------------------------------------
  // Moderate zoom keeps the character/towers big enough to read, while a
  // strong forward look-ahead reveals the upcoming route on the right.
  // The player floats between anchorMin (max forward reveal) and anchorMax
  // (resting) as needed to frame CURRENT + NEXT + NEXT+1 towers. The NEXT
  // tower always has absolute priority.
  cameraZoom: 0.62, // world -> screen scale. Kept moderate (not far out).
  cameraAnchorMin: 0.31, // most-forward player screen fraction (reveals more route)
  cameraAnchorMax: 0.31, // resting player screen fraction (left band)
  cameraRevealRight: 0.94, // put the NEXT+1 tower's right edge around here when framing
  cameraPlayerAnchorY: 0.67, // vertical resting anchor for the standing level
  cameraSmoothingX: 1, // lock the player horizontally; no follow lag during flight.
  cameraSmoothingY: 0.08, // vertical follow lerp
  cameraFallSmoothing: 0.1, // vertical follow while falling to Game Over

  // --- Generation / cleanup window ----------------------------------------
  spawnAhead: 500, // keep towers generated this far past the visible right edge
  removeBehind: 200, // remove towers this far behind the visible left edge

  // Visible spring: its lower end is the player collision/landing point.
  springHeight: 36, // relaxed height in world pixels
  springMinHeight: 6, // fully charged height
  springWidth: 28,

  // --- Feel / juice --------------------------------------------------------
  chargeSquashY: 0.12, // how much the blob compresses vertically at full charge
  chargeStretchX: 0.08, // how much it widens at full charge
  maxChargeShake: 2.8, // px jitter amplitude once near max charge
  airStretchY: 0.16, // vertical stretch while airborne
  landPulseDuration: 0.26, // seconds for the landing compression to recover
} as const;

// Reference trial is isolated: false restores the pre-trial physics and random course.
export const REFERENCE_TRIAL = true;
export const CONFIG = REFERENCE_TRIAL ? {
  ...PREVIOUS_CONFIG,
  gravity: 2500,
  minJumpVX: 80,
  maxJumpVX: 620,
  maxJumpVY: 1700,
  horizontalChargePlateau: 1,
  // chargeResponseCurve reshapes the charge fraction fed to BOTH vx and vy
  // identically, so it can never tilt the vy/vx ratio (launch angle stays
  // ~70 degrees, matching measured reference footage, at any exponent here).
  // It was tried at 0.7 to widen the narrow (~30ms/450ms) first-column
  // success window. Device testing on the LIVE game then showed light taps
  // launching noticeably farther than intended ("az basınca fazla zıplıyor").
  // Re-measuring 7 reference flights (holds ~0.25-0.56s, not just the
  // original 3) found the hold-time -> power relationship too noisy/
  // non-monotonic to support ANY specific exponent -- the earlier apparent
  // "mildly sublinear" trend did not hold up with more data. Separately, a
  // power curve c^p is mathematically guaranteed to blow up short-tap
  // sensitivity as c -> 0 for any p < 1, regardless of which p is chosen --
  // this is not a tuning mistake, it is inherent to that curve family. A
  // piecewise version (identity below a threshold, reshaped above it) was
  // also tried to protect short taps specifically; it removed the short-tap
  // distortion but then narrowed 9 OTHER measured columns' windows (some by
  // half) with no reference evidence to justify picking column 1 as the
  // one worth improving at their expense. Reverting to 1 (linear, i.e. no
  // reshaping) is the only option with zero risk of distorting short/medium
  // presses or any other column; the original narrow first-column window is
  // therefore back and NOT considered solved. See CLAUDE_VIDEO_RESULT.md and
  // CLAUDE_SHORTPRESS_RESULT.md.
  chargeResponseCurve: 1,
  scorePerfectBonus: 0, // reference: center placement does not add points
} as const : PREVIOUS_CONFIG;

// ============================================================================
// DEBUG MODE
// Flip to false for production. When true, an on-screen overlay shows live
// physics telemetry (charge %, velocities, platform distance/width, landing
// offset, FPS).
// ============================================================================
export const DEBUG_MODE = false;

// Phase enum shared between the JS side and the UI-thread worklet loop.
export const PHASE = {
  IDLE: 0, // standing on a platform, ready to charge
  CHARGING: 1, // finger down, building power
  AIRBORNE: 2, // mid-jump, gravity only, no steering
  DEAD: 3, // fell — camera follows down, Game Over shown
} as const;
