// GORSEL-017 / OYUN_AKISI-004 (2026-09-23, user-authorized): replaces the
// separately-drawn rooftop-chimney sprite system (GORSEL-014/015/016) with a
// FIXED, hand-measured sequence of landing spots baked directly into 4
// approved panel paintings (panel-01..04 of 8; 05-08 kept for the next,
// not-yet-authorized chapter -- "önce iPhone kabulü olmadan 100 atlayış
// sistemi kurma"). Every visible chimney is part of its own painted house/
// roof mass in the source art itself -- there is no separate floating
// column asset anymore, so this file only has to describe WHERE the
// (invisible) collision box for each painted chimney's flat cream cap sits,
// not how to draw it.
//
// Measurement method: each panel PNG (941x1671) was grid-cropped and
// visually read (see AI_REVIEW.md GORSEL-017 section for the crop
// coordinates) to find the pixel bounding box of each chimney's flat cream
// "tabla" top surface. Panels are laid out left-to-right in world space,
// edge to edge, at PANEL_WORLD_SCALE world units per source pixel.
//
// Requirement ("Her paneldeki krem taş tabla, tek standart collision/iniş
// genişliği olarak eşlenecek"): every platform uses ONE standard collision
// width (STANDARD_TABLA_WIDTH), centered on the painted cap's own measured
// center -- not each cap's own (slightly varying, 80-160px) painted width.
// This width was chosen jointly with the character's new visual scale (see
// GLOBAL_VISUAL_SCALE in character-pose.ts) so the physical foot span lands
// at ~55-65% of it (a locked, evidence-based joint calibration, not two
// independent guesses).
// 0.82, not the initially-tried 0.6: a panel rendered at cameraZoom(0.62) *
// scale must COVER the 390x844 viewport (the panel IS the whole scene now,
// no separate cover-fit far layer behind it) -- solving
// 1671*scale*0.62 >= 844 gives scale >= 0.8147; 0.82 clears it with a small
// margin. (0.6 was tried first and measured live via DOM rects at exactly
// the predicted 350x622 screen px -- correct arithmetic, just too small a
// panel, leaving an uncovered border around the game area.)
export const PANEL_WORLD_SCALE = 0.82; // world units per source pixel
export const PANEL_SOURCE_W = 941;
export const PANEL_SOURCE_H = 1671;
export const PANEL_WORLD_WIDTH = PANEL_SOURCE_W * PANEL_WORLD_SCALE;
export const PANEL_WORLD_HEIGHT = PANEL_SOURCE_H * PANEL_WORLD_SCALE;
// GORSEL-017 HOTFIX-01: each panel is rendered this many world units WIDER
// than its own PANEL_WORLD_WIDTH step so consecutive panels overlap by a
// hairline instead of leaving a sub-pixel rounding gap between them (see
// the render-site comment in app/index.tsx for the real-device symptom this
// fixes -- a thin vertical seam line at every panel boundary).
export const PANEL_SEAM_OVERLAP = 2;
// Reachability re-verified at this scale (all 10 transitions in this
// sequence need charge in [0.08, 0.884], comfortably below the c=1 ceiling)
// -- see AI_REVIEW.md GORSEL-017 section for the full per-transition table.
export const STANDARD_TABLA_WIDTH = 64;

// The camera's anchor formula (locked, unchanged -- cameraPlayerAnchorY
// 0.67) reveals a LOT more view above the standing platform than below it.
// For a chimney sitting near the very top of its own panel (P1-A, ~38% down
// the 1671px source) or very near the bottom (P1-C, ~83%), that reveal can
// extend past the panel image's own top/bottom edge -- there simply isn't
// enough painted content above/below those specific chimneys at ANY single
// scale that ALSO keeps every jump reachable (a bigger scale that fixes the
// headroom blows up the panel-to-panel horizontal gaps past what the
// unchanged jump physics can cover -- verified, not assumed, see
// AI_REVIEW.md).
//
// GORSEL-017 HOTFIX-01 (2026-09-23): the FIRST attempt at this filled the
// reveal with a flat average-color rectangle (one solid RGB sampled from
// each panel's own edge rows). On a real iPhone that read as a visible
// "seam" / colour-banding line right at the panel's edge -- a flat, evenly
// lit rectangle butting against a textured, gradiented painting is never
// going to match exactly, no matter how carefully the average is sampled.
// Fixed by sampling the panel's own last 24 ROWS of real pixels (not an
// average) into small edge-strip PNGs (see EDGE_SOURCES below) and
// stretching those vertically to fill the reveal -- the seam is now
// mathematically zero-error by construction (the first pixel of the strip
// IS the panel's own last real row), and the stretch reads as a soft
// continuation of the same sky/roof texture instead of a hard color band.
export const PANEL_FILL_STRIP_HEIGHT = 700; // world units, comfortably past the worst-case reveal
export const PANEL_EDGE_SOURCE_H = 24; // source rows captured into each edge strip

export const PANEL_TOP_EDGE_SOURCES = [
  require("@/assets/environment/gorsel-017/edges/panel-01-top-edge.png"),
  require("@/assets/environment/gorsel-017/edges/panel-02-top-edge.png"),
  require("@/assets/environment/gorsel-017/edges/panel-03-top-edge.png"),
  require("@/assets/environment/gorsel-017/edges/panel-04-top-edge.png"),
] as const;
export const PANEL_BOTTOM_EDGE_SOURCES = [
  require("@/assets/environment/gorsel-017/edges/panel-01-bottom-edge.png"),
  require("@/assets/environment/gorsel-017/edges/panel-02-bottom-edge.png"),
  require("@/assets/environment/gorsel-017/edges/panel-03-bottom-edge.png"),
  require("@/assets/environment/gorsel-017/edges/panel-04-bottom-edge.png"),
] as const;

export const PANEL_SOURCES = [
  require("@/assets/environment/gorsel-017/panel-01.png"),
  require("@/assets/environment/gorsel-017/panel-02.png"),
  require("@/assets/environment/gorsel-017/panel-03.png"),
  require("@/assets/environment/gorsel-017/panel-04.png"),
] as const;

// GORSEL-017 HOTFIX-01 (2026-09-23): re-measured from scratch after a real
// iPhone screenshot showed the character standing off-center / partly off
// the cap. The FIRST measurement pass (x0/x1/yTop bounding-box corners,
// eyeballed off a 20-50px grid) conflated the cap's angled 3D TOP face with
// its shaded FRONT face in several cases -- e.g. P1-C's old center (162.5)
// vs the re-measured front-face center (179) and old topY (1445, the
// bottom of the cap's front lip) vs the true front-top edge (1393), a 52px
// miss. The fix: for each chimney, (1) find the exact pixel row where the
// lit top face's brightness drops into the shaded front face (a hard
// outline stroke in this art style, confirmed via direct RGB sampling, not
// eyeballing) -- that row is `topYPx`; (2) read the cream run's left/right
// bounds at that exact row -- its midpoint is `centerXPx`. This measures
// the FRONT-CENTER of the flat top surface, i.e. where a standing
// character's feet actually read as touching the cap in the art, not the
// geometric center of the whole angled-box silhouette. Full before/after
// numbers and the re-derived reachability/visibility table are in
// AI_REVIEW.md's HOTFIX-01 section.
type ChimneyMeasurement = { id: string; panelIndex: number; centerXPx: number; topYPx: number };

const MEASURED: ChimneyMeasurement[] = [
  { id: "P1-C", panelIndex: 0, centerXPx: 179, topYPx: 1393 },
  { id: "P1-B", panelIndex: 0, centerXPx: 375, topYPx: 1075 },
  { id: "P1-A", panelIndex: 0, centerXPx: 856.5, topYPx: 640 },
  // P1's third chimney (panel-02's "C", x0=100,yTop=1410 in the old
  // measurement) stays deliberately EXCLUDED from this sequence: jumping to
  // it directly from P1-A would have dropped the target ~470+ world units
  // below the current stance (camera anchor math puts that past the bottom
  // of a 390x844 screen) -- exactly the "target off-screen" regression this
  // task explicitly forbids reintroducing. See AI_REVIEW.md for the full
  // per-transition visibility table.
  { id: "P2-A", panelIndex: 1, centerXPx: 685, topYPx: 848 },
  { id: "P2-B", panelIndex: 1, centerXPx: 845, topYPx: 1175 },
  { id: "P3-B", panelIndex: 2, centerXPx: 365, topYPx: 833 },
  { id: "P3-C", panelIndex: 2, centerXPx: 665, topYPx: 1150 },
  { id: "P3-A", panelIndex: 2, centerXPx: 860, topYPx: 648 },
  { id: "P4-A", panelIndex: 3, centerXPx: 115, topYPx: 755 },
  { id: "P4-C", panelIndex: 3, centerXPx: 360, topYPx: 1150 },
  { id: "P4-B", panelIndex: 3, centerXPx: 852.5, topYPx: 720 },
];

export type PanelPlatform = {
  id: number;
  x: number;
  topY: number;
  width: number;
  cat: number;
  visualType: "normal";
  panelIndex: number;
};

// Built once at module load (pure arithmetic on the constant table above) --
// not per-frame, not seeded/random. This IS the whole course for this
// delivery: no procedural generation, no infinite loop past the last entry.
// A +2px (source-pixel) margin sinks the physical landing line a hair into
// the surface (same convention as the old rootedTopY capTopPx), small now
// that centerXPx/topYPx are themselves measured at the true front-top edge
// instead of a coarse bounding box.
export const FIXED_PANEL_PLATFORMS: PanelPlatform[] = MEASURED.map((m, i) => {
  const centerX = m.panelIndex * PANEL_WORLD_WIDTH + m.centerXPx * PANEL_WORLD_SCALE;
  const topY = (m.topYPx + 2) * PANEL_WORLD_SCALE;
  return {
    id: i,
    x: centerX - STANDARD_TABLA_WIDTH / 2,
    topY,
    width: STANDARD_TABLA_WIDTH,
    cat: 1,
    visualType: "normal",
    panelIndex: m.panelIndex,
  };
});
