// GORSEL-008 R11 (accepted): charge-driven character pose (VISUAL ONLY).
// Five measured keyframes at charge 0/25/50/75/100 %. All five PNGs share ONE
// pixel scale (no per-pose resizing) and feet_span is NOT constant (heel lift
// narrows it), so every pose is placed by the stable foot anchor from
// charge-r11-olcu-pivot.json = midpoint of the two toe tips, which stay
// planted: identical world point in every pose. anchorY = lowest opaque row+1.
// The single scale is derived from the R11 IDLE bottom-band feet span (271 px)
// so the idle keeps the physical sole span used before (not a global-scale
// change).

export const POSE_FEET_SPAN_PX = 271;
// Idle's bottom-band feet centre (pivotX 224) stays on the physical sole
// centre as before; the shared world anchor sits this many sprite px to its
// right (idle stable anchor 308 - 224).
export const ANCHOR_SHIFT_PX = 308 - 224;

export const CHARGE_POSES = [
  { source: require("@/assets/characters/charge-000-idle-r11.png"), w: 516, h: 1103, pivotX: 308, pivotY: 1103 },
  { source: require("@/assets/characters/charge-025-r11.png"), w: 516, h: 1056, pivotX: 310, pivotY: 1056 },
  { source: require("@/assets/characters/charge-050-r11.png"), w: 516, h: 1005, pivotX: 306, pivotY: 1005 },
  { source: require("@/assets/characters/charge-075-r11.png"), w: 516, h: 951, pivotX: 298, pivotY: 951 },
  { source: require("@/assets/characters/charge-100-r11.png"), w: 516, h: 892, pivotX: 288, pivotY: 892 },
] as const;

const SEGMENTS = CHARGE_POSES.length - 1;

/**
 * Opacity of pose `i` for charge c (0..1). Layer 0 (idle) is the base. Inside
 * segment k the lower pose k stays opaque for the first half of the blend,
 * then fades out while pose k+1 fades in over it, so the taller silhouette
 * never pops away and the mid-blend never dips below ~87% coverage.
 */
export function poseOpacity(i: number, c: number) {
  "worklet";
  const x = Math.min(1, Math.max(0, c)) * SEGMENTS;
  const k = Math.min(SEGMENTS - 1, Math.floor(x));
  const t = x - k;
  if (i === k + 1) return t;
  if (i === k) return t < 0.5 ? 1 : 2 * (1 - t);
  return 0;
}
