// GORSEL-008 R12 (accepted; nine poses, supersedes R11 five): charge-driven character pose (VISUAL ONLY).
// Nine measured keyframes at charge 0/12.5/25/.../100 %. All five PNGs share ONE
// pixel scale (no per-pose resizing) and feet_span is NOT constant (heel lift
// narrows it), so every pose is placed by the stable foot anchor from
// charge-r11-olcu-pivot.json = midpoint of the two toe tips, which stay
// planted: identical world point in every pose. anchorY = lowest opaque row+1.
// The single scale is derived from the R11 IDLE bottom-band feet span (271 px)
// so the idle keeps the physical sole span used before (not a global-scale
// change).
// GORSEL-016 / OYUN_AKISI-003 (2026-09-23): recalibrated to match a REAL
// measured Spring Ninja idle proportion instead of a felt trim. Measured
// from the long Spring Ninja reference recording (~/Downloads/
// ScreenRecording_09-12-2026 17-48-03_1.MP4, 1320x2868, the "uzun video"):
// two independent idle frames (t=34.5s, t=35.0s), pixel-thresholded
// head-top-to-spring-base (the reference game's own foot-contact point)
// against the play-area height (status bar to home-indicator, 2346px of the
// 2868px frame) gave 158px and 170px -> ratio 0.0674 and 0.0725, averaged to
// a target foot-to-head-top screen ratio of ~0.070 (7%).
//
// GORSEL-017 / OYUN_AKISI-004 (2026-09-23, user-authorized): re-tuned again,
// this time against TWO joint targets from the new panel-based course
// (panel-course.ts): (1) idle height ~10-12% of the playable screen height
// (H), (2) the sprite's own physical foot span ~55-65% of
// STANDARD_TABLA_WIDTH (64 world units, the single standardized landing
// width every panel's painted chimney cap now collides against). Both are
// satisfied by the SAME scale, not independently guessed:
//   heightRatio(0.11) -> scale = 0.11*H / (cameraZoom*SPRITE_SCALE*1103)
//                      = 0.11*844 / (0.62*0.2049*1103) ~= 0.6625
//   footSpanRatio at that scale = (55.52*0.6625) / 64 = 36.79/64 ~= 57.5%
// -- inside the 55-65% target, so 0.11 (mid-range of "10-12%") was used
// directly rather than needing a compromise between the two asks. Height
// ratio verified live: 0.6625 -> ~11.0% of a 390x844 screen (see AI_REVIEW.md
// GORSEL-017 section for the DOM-measured on-device numbers).
// The world anchor point itself is still NOT moved by this (ChargePoses
// applies scale around pose.pivotX/Y, see ChargePoses.tsx) -- physical foot
// pivot, collision box (PW/PH), footSoles, jump/landing math and procedural
// reachability are all untouched; this is a render-only multiplier.
export const GLOBAL_VISUAL_SCALE = 0.6625;

export const POSE_FEET_SPAN_PX = 271;
// Idle's bottom-band feet centre (pivotX 224) stays on the physical sole
// centre as before; the shared world anchor sits this many sprite px to its
// right (idle stable anchor 308 - 224).
export const ANCHOR_SHIFT_PX = 308 - 224;

export const CHARGE_POSES = [
  { source: require("@/assets/characters/charge-000-r12.png"), w: 516, h: 1103, pivotX: 308, pivotY: 1103 },
  { source: require("@/assets/characters/charge-012-r12.png"), w: 516, h: 1080, pivotX: 311, pivotY: 1080 },
  { source: require("@/assets/characters/charge-025-r12.png"), w: 516, h: 1056, pivotX: 310, pivotY: 1056 },
  { source: require("@/assets/characters/charge-037-r12.png"), w: 516, h: 1031, pivotX: 309, pivotY: 1031 },
  { source: require("@/assets/characters/charge-050-r12.png"), w: 516, h: 1005, pivotX: 306, pivotY: 1005 },
  { source: require("@/assets/characters/charge-062-r12.png"), w: 516, h: 979, pivotX: 302, pivotY: 979 },
  { source: require("@/assets/characters/charge-075-r12.png"), w: 516, h: 951, pivotX: 298, pivotY: 951 },
  { source: require("@/assets/characters/charge-087-r12.png"), w: 516, h: 922, pivotX: 293, pivotY: 922 },
  { source: require("@/assets/characters/charge-100-r12.png"), w: 516, h: 892, pivotX: 288, pivotY: 892 },
] as const;

/**
 * R12: nine keyframes 12.5 % apart. Exactly ONE pose is visible at any charge
 * (nearest keyframe): a hard switch, so two full-body silhouettes are never
 * drawn at once (no ghosting). Adjacent poses share head pixels 1:1, the same
 * shoe pixels and the same toe anchor, so a switch only moves body parts by a
 * few px; 12.5 % of charge lasts ~3.4 frames at 60 Hz, so the crouch reads as
 * continuous motion.
 */
export function poseOpacity(i: number, c: number) {
  "worklet";
  const idx = Math.round(Math.min(1, Math.max(0, c)) * (CHARGE_POSES.length - 1));
  return idx === i ? 1 : 0;
}
