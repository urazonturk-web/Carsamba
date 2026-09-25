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

// See the EXPERIMENTAL GAMEPLAY TRIAL block below CONFIG for what these do.
// Both default OFF; flip either back to false to fully revert to baseline.
export const EXPERIMENTAL_PHYSICS = false;
export const EXPERIMENTAL_COURSE = true;

export const CONFIG = REFERENCE_TRIAL ? {
  ...PREVIOUS_CONFIG,
  gravity: 2500,
  minJumpVX: 80,
  maxJumpVX: 620,
  maxJumpVY: 1700,
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
  // --- EXPERIMENTAL GAMEPLAY TRIAL override (default OFF above) -----------
  // EXPERIMENTAL_PHYSICS: raises horizontalChargePlateau above 1 (baseline
  //   is 1, i.e. disabled). With plateau > 1, lateralCharge =
  //   min(1, effectiveCharge/plateau) is UNIFORMLY smaller than
  //   effectiveCharge across the WHOLE 0-1 charge range, INCLUDING c=1 (full
  //   charge) -- this is not only a mid-range timing-window change. At
  //   plateau=1.15, full-charge horizontal speed drops from 620 to ~539
  //   units (-13%), so MAXIMUM horizontal range is reduced and every charge's
  //   launch angle is steeper than today's near-constant ~70 degrees (vy is
  //   untouched, vx is not, so the vy/vx ratio -- hence angle -- now varies
  //   and tilts upward at every charge, not just short taps). Different
  //   mechanism from every previously rejected candidate (not the global
  //   chargeResponseCurve exponent on BOTH vx/vy, not a piecewise curve
  //   above a boundary, not maxChargeDuration), but it is a real range/angle
  //   tradeoff, not a free win.
  //   Simulated (real jump.ts/landing.ts/reference-course.ts, actual spawn
  //   position, full-course collisions -- ai_review_evidence/sim_candidate.cjs):
  //     plateau 1.0 (today):  first jump 374-404ms (30ms); kule6->8 226-282ms (56ms); kule6->9 378-417ms (39ms)
  //     plateau 1.15 (trial): first jump 386-421ms (35ms); kule6->8 245-304ms (59ms); kule6->9 406-448ms (42ms)
  //   These three sampled fixed-course windows get slightly WIDER, but that
  //   does NOT establish improvement everywhere -- only these three specific,
  //   center-spawned transitions were checked this way; see
  //   ai_review_evidence/sim_sequential.cjs for a fuller, non-centered,
  //   multi-width/seed check. This does NOT by itself fix the user's
  //   recorded 379ms overshoot against the FIXED reference course (that
  //   exact gap stays a miss at every plateau up to 1.5; only an unplayable
  //   plateau near 2.0, which also breaks the first jump entirely, would
  //   land it) -- see AI_REVIEW.md for why that specific miss is left as an
  //   acknowledged, unaddressed gap on the fixed reference course.
  //
  //   reachReserve is intentionally NOT overridden here: checked against the
  //   generator's own gapEarly/gapLate/heightVar* ranges, the physics reach
  //   ceiling never binds (gapLate.max does), so raising reachReserve would
  //   be a config change with no measurable effect on real generated
  //   courses -- see AI_REVIEW.md. Left at the baseline value to avoid a
  //   misleading no-op override.
  horizontalChargePlateau: EXPERIMENTAL_PHYSICS ? 1.15 : 1,
  // --- EXPERIMENTAL GAMEPLAY TRIAL override (default OFF above) -----------
  // EXPERIMENTAL_COURSE geometry tightening, 2026-09-16: after playtesting
  // EXPERIMENTAL_COURSE with UNCHANGED physics, the user reported flights
  // feeling too broad/floaty after the apex. This is a PLAYTEST HYPOTHESIS,
  // NOT a demonstrated fix for that feel and NOT a Spring Ninja equivalence
  // claim -- corrected per a second Codex review round (see AI_REVIEW.md for
  // the full evidence and both review rounds):
  //  - Physics is UNCHANGED and cannot be changed by this override: for
  //    identical initial position/velocity, the free-flight trajectory is
  //    mathematically identical regardless of these ranges (verified
  //    directly -- ai_review_evidence/sim_geometry_paired.cjs section 0).
  //    Geometry can only change WHEN/whether a given press first contacts a
  //    platform, not how steeply a given press's own arc descends.
  //  - Tracked a Spring Ninja reference flight's horizontal speed across the
  //    apex via a fixed-tower landmark (it also locks the character's own
  //    screen-x): ~700-715 native px/s both before and after the apex, no
  //    clear deceleration within ~15% measurement precision -- so no
  //    descent drag was added.
  //  - Scope correction: gapLate.max/heightVarLate are the t=1 ENDPOINT of
  //    generateProceduralPlatform's `lerp(early, late, t)`, where
  //    t = min(1, id/difficultyRamp). This ramp already blends toward the
  //    endpoint from the first non-warm-up tower (t=0.25 by id=10, t=0.50 by
  //    id=20 at difficultyRamp=40) -- this is NOT a "late towers only"
  //    change, it reshapes the whole ramp's upper bound. gapEarly/
  //    heightVarEarly/heightVarWarmup are still untouched.
  //  - Paired, FIXED-press comparison (short/medium/long: 150/250/350ms), 5
  //    seeds, same seed/press replayed on baseline vs candidate geometry with
  //    real carried-forward landing positions (not a per-config successful-
  //    input search): 14 of 15 (seed, press) combinations gave IDENTICAL
  //    survival outcomes. ONE combination diverged (seed 88, 350ms: baseline
  //    survived to hop 4 / 8 towers advanced, candidate died at hop 2 / 4
  //    towers) -- tightening geometry can, in at least this sampled case,
  //    make a previously-safe long press die EARLIER, most likely by
  //    shortening a multi-tower skip that used to clear a hazard tower.
  //    Disclosed, not hidden; not further tuned in response (see
  //    AI_REVIEW.md OPEN_ISSUES).
  //  - 2-tower / 3-tower skip windows, reported separately (not one merged
  //    "hasSkipOption"): baseline 99%/56% of sampled hops had a 2-/3-tower
  //    option; candidate 100%/71% -- both went up, not down, in aggregate.
  //  - Net effect on a REALISTIC "nearest-reachable" charge per hop (a
  //    separate, aggregate measure, not the paired-press check above): avg
  //    flight 809->782ms (-3%), MAX 1017->929ms (-9%), avg distance
  //    303->282 world units (-7%), max 417->397 (-5%). Modest, and -- per
  //    the divergence above -- not free of any regression risk.
  //  - Rollback: set EXPERIMENTAL_COURSE=false (removes this override
  //    entirely, back to the fixed reference course), or restore
  //    gapLate.max to 380 and heightVarLate to 300 below to keep
  //    EXPERIMENTAL_COURSE on with the original (untightened) ranges.
  gapLate: EXPERIMENTAL_COURSE ? { min: PREVIOUS_CONFIG.gapLate.min, max: 260 } : PREVIOUS_CONFIG.gapLate,
  heightVarLate: EXPERIMENTAL_COURSE ? 180 : PREVIOUS_CONFIG.heightVarLate,
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
