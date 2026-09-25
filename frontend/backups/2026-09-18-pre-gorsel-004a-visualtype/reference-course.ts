// Measured from 11-12-55, ~29.4–92.7s, the uninterrupted 61-point run.
// Camera translation removed. Units: pixels at 330px source width.
// Approximate cap boundaries (animation/rasterization), not original source data.
export const REFERENCE_COURSE = [
  {
    "x": 0.0,
    "topY": 0,
    "width": 28
  },
  {
    "x": 204.0,
    "topY": -184,
    "width": 28
  },
  {
    "x": 383.0,
    "topY": -146,
    "width": 28
  },
  {
    "x": 536.0,
    "topY": -74,
    "width": 28
  },
  {
    "x": 675.0,
    "topY": -113,
    "width": 28
  },
  {
    "x": 815.0,
    "topY": -151,
    "width": 28
  },
  {
    "x": 905.0,
    "topY": -146,
    "width": 28
  },
  {
    "x": 993.0,
    "topY": -108,
    "width": 28
  },
  {
    "x": 1081.0,
    "topY": -70,
    "width": 28
  },
  {
    "x": 1235.0,
    "topY": -108,
    "width": 28
  },
  {
    "x": 1388.0,
    "topY": -108,
    "width": 28
  },
  {
    "x": 1542.0,
    "topY": -108,
    "width": 28
  },
  {
    "x": 1644.0,
    "topY": -62,
    "width": 28
  },
  {
    "x": 1822.0,
    "topY": -100,
    "width": 28
  },
  {
    "x": 2028.0,
    "topY": -139,
    "width": 28
  },
  {
    "x": 2222.0,
    "topY": -24,
    "width": 28
  },
  {
    "x": 2415.0,
    "topY": -62,
    "width": 27
  },
  {
    "x": 2605.0,
    "topY": -24,
    "width": 28
  },
  {
    "x": 2797.0,
    "topY": -116,
    "width": 28
  },
  {
    "x": 2913.0,
    "topY": -77,
    "width": 28
  },
  {
    "x": 3027.0,
    "topY": -39,
    "width": 28
  },
  {
    "x": 3153.0,
    "topY": -70,
    "width": 28
  },
  {
    "x": 3241.0,
    "topY": -61,
    "width": 28
  },
  {
    "x": 3394.0,
    "topY": -31,
    "width": 28
  },
  {
    "x": 3522.0,
    "topY": -62,
    "width": 28
  },
  {
    "x": 3650.0,
    "topY": -100,
    "width": 28
  },
  {
    "x": 3776.0,
    "topY": -139,
    "width": 28
  },
  {
    "x": 3968.0,
    "topY": 7,
    "width": 28
  },
  {
    "x": 4160.0,
    "topY": 7,
    "width": 28
  },
  {
    "x": 4352.0,
    "topY": 7,
    "width": 28
  },
  {
    "x": 4455.0,
    "topY": -69,
    "width": 28
  },
  {
    "x": 4608.0,
    "topY": -45,
    "width": 27
  },
  {
    "x": 4709.0,
    "topY": -22,
    "width": 28
  },
  {
    "x": 4811.0,
    "topY": -106,
    "width": 28
  },
  {
    "x": 4913.0,
    "topY": -106,
    "width": 28
  },
  {
    "x": 5015.0,
    "topY": -106,
    "width": 28
  },
  {
    "x": 5182.0,
    "topY": -31,
    "width": 28
  },
  {
    "x": 5361.0,
    "topY": -108,
    "width": 28
  },
  {
    "x": 5554.0,
    "topY": -70,
    "width": 28
  },
  {
    "x": 5630.0,
    "topY": -39,
    "width": 28
  },
  {
    "x": 5783.0,
    "topY": -77,
    "width": 28
  },
  {
    "x": 5898.0,
    "topY": -116,
    "width": 28
  },
  {
    "x": 5988.0,
    "topY": -108,
    "width": 27
  },
  {
    "x": 6193.0,
    "topY": -146,
    "width": 28
  },
  {
    "x": 6336.0,
    "topY": 7,
    "width": 28
  },
  {
    "x": 6410.0,
    "topY": -85,
    "width": 28
  },
  {
    "x": 6590.0,
    "topY": -123,
    "width": 28
  },
  {
    "x": 6743.0,
    "topY": -85,
    "width": 28
  }
] as const;

export function referencePlatform(id: number, screenWidth: number, zoom: number) {
  "worklet";
  const cap = REFERENCE_COURSE[id];
  if (!cap) return null;
  const scale = screenWidth / (330 * zoom);
  return { id, x: cap.x * scale, topY: cap.topY * scale, width: cap.width * scale, cat: 1 };
}

// Most measured caps are 28px wide at 330px source width. Keep this width
// in the generated continuation too; measured 27px samples stay unchanged.
export function referenceTowerWidth(screenWidth: number, zoom: number) {
  "worklet";
  return 28 * screenWidth / (330 * zoom);
}
