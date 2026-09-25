import { CONFIG } from "./config";
import { jumpVelocity, flightGravity } from "./jump";

// Extracted from app/index.tsx (was inlined there) so this exact math has a
// single source of truth that both the live game and offline simulation/test
// scripts import directly, instead of a hand-copied duplicate risking silent
// drift. Behavior is unchanged from before the extraction.

export function lerp(a: number, b: number, t: number) {
  "worklet";
  return a + (b - a) * t;
}

// One mulberry32 step: given the current 32-bit state, returns the next
// state and a float in [0,1). Pure/side-effect-free so the live game (which
// stores state in a Reanimated SharedValue) and offline tests can share the
// exact same generator instead of two copies of the same algorithm.
export function mulberry32Step(state: number) {
  "worklet";
  let t = (state + 0x6d2b79f5) | 0;
  const nextState = t;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return { value, nextState };
}

// Convenience closure for non-worklet callers (offline tests/tools): wraps
// mulberry32Step behind a simple rand() with internal state. The live game
// does NOT use this -- it keeps state in rngState (a SharedValue) via
// mulberry32Step directly, since a worklet closure can't hold plain mutable
// state across UI-thread frame callbacks the way this closure does.
export function makeRand(seed: number) {
  let state = seed | 0;
  return function rand() {
    const r = mulberry32Step(state);
    state = r.nextState;
    return r.value;
  };
}

export type Platform = { id: number; x: number; topY: number; width: number; cat: number };

// Pure procedural generation math, previously inlined in app/index.tsx's
// makeNextPlatform. Independent of REFERENCE_TRIAL/EXPERIMENTAL_COURSE --
// callers decide whether to use this result or substitute a measured
// reference-course platform instead (see USE_REFERENCE_COURSE in app/index.tsx).
export function generateProceduralPlatform(
  prev: Platform,
  id: number,
  rand: () => number,
  screenWidth: number,
): Platform {
  "worklet";
  const warm = id <= CONFIG.warmupTowers; // gentle warm-up section
  const t = Math.min(1, id / CONFIG.difficultyRamp); // 0 early -> 1 late
  // gap distance (grows with difficulty; warm-up = short/medium only)
  const gMin = warm ? CONFIG.gapEarly.min : lerp(CONFIG.gapEarly.min, CONFIG.gapLate.min, t);
  const gMax = warm
    ? CONFIG.warmupGapMax
    : lerp(CONFIG.gapEarly.max, CONFIG.gapLate.max, t);
  const gapSample = rand();
  // Sample within the world bounds instead of clamping: clamping stacks
  // consecutive tower tops at exactly the same upper/lower limit.
  const hv = warm
    ? CONFIG.heightVarWarmup
    : lerp(CONFIG.heightVarEarly, CONFIG.heightVarLate, t);
  const minDelta = Math.max(-hv, CONFIG.platformMinTopY - prev.topY);
  const maxDelta = Math.min(hv, CONFIG.platformMaxTopY - prev.topY);
  const topY = prev.topY + minDelta + rand() * (maxDelta - minDelta);
  // width category: warm-up = WIDE/MEDIUM only; late adds more NARROW
  let wWide: number;
  let wMed: number;
  let wNar: number;
  if (warm) {
    wWide = 0.62;
    wMed = 0.38;
    wNar = 0;
  } else {
    wWide = lerp(0.55, 0.2, t);
    wMed = 0.4;
    wNar = lerp(0.05, 0.42, t);
    if (id <= CONFIG.noNarrowBeforeId) wNar = 0; // forgiving start
  }
  if (prev.cat === 2) wNar *= 0.25; // avoid consecutive narrow towers
  const sum = wWide + wMed + wNar;
  const r = rand() * sum;
  let cat: number;
  let wr: { min: number; max: number };
  if (r < wWide) {
    cat = 0;
    wr = CONFIG.widthWide;
  } else if (r < wWide + wMed) {
    cat = 1;
    wr = CONFIG.widthMedium;
  } else {
    cat = 2;
    wr = CONFIG.widthNarrow;
  }
  const width = wr.min + rand() * (wr.max - wr.min);
  // Couple horizontal spacing to the actual downward crossing of this height.
  // Reserve distance from the previous LEFT edge, not only its center.
  const full = jumpVelocity(1, screenWidth);
  const gravity = flightGravity(screenWidth);
  const discriminant = full.vy * full.vy + 2 * gravity * (topY - prev.topY);
  const flightTime = (-full.vy + Math.sqrt(Math.max(0, discriminant))) / gravity;
  const reachableGap = full.vx * flightTime * (1 - CONFIG.reachReserve) - prev.width - width / 2;
  const safeMax = Math.max(0, Math.min(gMax, reachableGap));
  const safeMin = Math.min(gMin, safeMax);
  const gap = safeMin + gapSample * (safeMax - safeMin);
  return { id, x: prev.x + prev.width + gap, topY, width, cat };
}

// ---------------------------------------------------------------------------
// REVIZYON-027: everything ABOVE this line is byte-identical to commit 7b8bd6b
// (frontend/src/game/procedural-course.ts). Everything below is render-only
// support kept from the working tree: it never feeds generateProceduralPlatform.
// ---------------------------------------------------------------------------

// Rooftop sprite geometry (measured from the real alpha-keyed PNGs): used ONLY
// by app/index.tsx to size/place the chimney art from a platform's physical
// topY/width. cat 0=wide->long, 1=medium, 2=narrow->short.
export const ROOFTOP_ASSET_GEOMETRY = [
  { w: 533, h: 756, capTopPx: 3, capWidthPx: 223 }, // long
  { w: 526, h: 556, capTopPx: 3, capWidthPx: 225 }, // medium
  { w: 517, h: 408, capTopPx: 3, capWidthPx: 224 }, // short
] as const;
export const ROOFTOP_GROUND_Y = 150;

export type PlatformVisualType = "normal" | "chimney";
// Purely visual (smoke anchor); decided from the platform id, never reads rand.
export function classifyPlatformVisualType(id: number): PlatformVisualType {
  "worklet";
  if (id <= 0) return "normal";
  const hash = Math.imul(id ^ 0x45d9f3b, 0x45d9f3b) >>> 0;
  return hash % 7 === 0 ? "chimney" : "normal";
}
