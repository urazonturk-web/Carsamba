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

export type GapClass = "short" | "medium" | "long";
export type HeightClass = "level" | "rise" | "drop";

export type Platform = {
  id: number; x: number; topY: number; width: number; cat: number;
  // Bookkeeping only (generation-time, not used by rendering/collision):
  // lets the NEXT call see what class of gap/height this platform used, so
  // it can avoid a long streak of the same class. Undefined for the
  // reference course, the initial spawn platform, and warm-up platforms
  // (which don't use the class system) -- a streak check against undefined
  // never matches, so no special-casing is needed at those boundaries.
  gapClass?: GapClass; gapStreak?: number;
  heightClass?: HeightClass; heightStreak?: number;
};

// Weighted pick among named classes, with optional exclusion (used to force
// a different class once a streak cap is hit). Not a claim of measured
// Spring Ninja proportions -- an implementation judgment call, tunable here.
function pickClass<T extends string>(weights: Record<T, number>, rand: () => number, exclude?: T): T {
  "worklet";
  const keys = Object.keys(weights) as T[];
  let total = 0;
  for (const k of keys) if (k !== exclude) total += weights[k];
  let r = rand() * total;
  for (const k of keys) {
    if (k === exclude) continue;
    if (r < weights[k]) return k;
    r -= weights[k];
  }
  // fall through only on float rounding at the very end of the range
  for (const k of keys) if (k !== exclude) return k;
  return keys[0];
}

// Weights now PROGRESS with difficulty (t = min(1, id/difficultyRamp)):
// early towers strongly favor the easy class (short gap / level height) so
// the opening ramp stays gentle; late towers shift toward medium/long gaps
// and rise/drop, but the easy class never reaches zero weight, so occasional
// easy transitions keep appearing even late, per the user's explicit ask.
function gapWeightsAt(t: number): Record<GapClass, number> {
  "worklet";
  return { short: lerp(0.55, 0.15, t), medium: lerp(0.35, 0.45, t), long: lerp(0.10, 0.40, t) };
}
function heightWeightsAt(t: number): Record<HeightClass, number> {
  "worklet";
  return { level: lerp(0.55, 0.30, t), rise: lerp(0.225, 0.35, t), drop: lerp(0.225, 0.35, t) };
}
// Gap keeps a loose anti-streak cap (unrelated to the user's complaint, which
// was specifically about height/elevation feeling like a forced sequence).
const MAX_SAME_GAP_CLASS_STREAK = 2;
// Height streak is NOT capped anymore: a hard "never 3 in a row" rule is what
// made the elevation pattern feel mechanical/predictable in the 11-51-03
// recording (a real random walk naturally produces occasional longer runs of
// rises or drops, and forcibly preventing that reads as more artificial, not
// less). heightStreak is still tracked and reported for evidence, just no
// longer used to force a different class.

// Define worklet helpers before their caller: Metro captures them at module initialization.
function classifyGap(gap: number): GapClass {
  "worklet";
  if (gap < 150) return "short";
  if (gap < 220) return "medium";
  return "long";
}
function classifyHeight(delta: number): HeightClass {
  "worklet";
  if (delta < -40) return "rise";
  if (delta > 40) return "drop";
  return "level";
}

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

  // --- gap class (mixed short/medium/long rhythm, non-warmup only) --------
  // Ranges are an implementation choice guided by current geometry (medium
  // sits where the single-range generator used to spend most of its time;
  // long tops out well below the pre-2026-09-16 380 max the user disliked;
  // short reuses the existing forgiving gapEarly.min floor), not a measured
  // Spring Ninja value.
  let intendedGapClass: GapClass | undefined;
  let gMin: number, gMax: number;
  if (warm) {
    gMin = CONFIG.gapEarly.min;
    gMax = CONFIG.warmupGapMax;
  } else {
    const gapWeights = gapWeightsAt(t);
    intendedGapClass = pickClass(gapWeights, rand);
    if (prev.gapClass === intendedGapClass && (prev.gapStreak ?? 0) >= MAX_SAME_GAP_CLASS_STREAK) {
      intendedGapClass = pickClass(gapWeights, rand, intendedGapClass);
    }
    if (intendedGapClass === "short") { gMin = CONFIG.gapEarly.min; gMax = 150; }
    else if (intendedGapClass === "medium") { gMin = 150; gMax = 220; }
    else { gMin = 220; gMax = lerp(240, 300, t); }
  }
  const gapSample = rand();

  // --- height class (mixed rise/drop/near-level, non-warmup only) ---------
  // Magnitudes stay within the already-playtested heightVarLate=180 comfort
  // ceiling (not the earlier, disliked 300) -- this widens the MIX of
  // directions, not the extremes.
  let minDelta: number, maxDelta: number;
  if (warm) {
    minDelta = Math.max(-CONFIG.heightVarWarmup, CONFIG.platformMinTopY - prev.topY);
    maxDelta = Math.min(CONFIG.heightVarWarmup, CONFIG.platformMaxTopY - prev.topY);
  } else {
    const heightWeights = heightWeightsAt(t);
    const intendedHeightClass = pickClass(heightWeights, rand);
    const swing = lerp(100, 150, t); // rise/drop max magnitude, mild late growth
    const rawMin = intendedHeightClass === "rise" ? -swing : intendedHeightClass === "drop" ? 40 : -40;
    const rawMax = intendedHeightClass === "rise" ? -40 : intendedHeightClass === "drop" ? swing : 40;
    minDelta = Math.max(rawMin, CONFIG.platformMinTopY - prev.topY);
    maxDelta = Math.min(rawMax, CONFIG.platformMaxTopY - prev.topY);
    if (minDelta > maxDelta) {
      // Degenerate case near the world Y bounds: the class-restricted
      // interval doesn't fit (e.g. "rise" requested near platformMinTopY,
      // where there is no more room to climb). Fall back to the full
      // world-bounded range for this one platform. The ACTUAL class is
      // reclassified from the sampled delta below regardless, so this
      // fallback can never mislabel a boundary platform (fixes the earlier
      // bug where the fallback kept the pre-fallback intended label).
      const hv = lerp(CONFIG.heightVarEarly, CONFIG.heightVarLate, t);
      minDelta = Math.max(-hv, CONFIG.platformMinTopY - prev.topY);
      maxDelta = Math.min(hv, CONFIG.platformMaxTopY - prev.topY);
    }
  }
  // Sample within the world bounds instead of clamping: clamping stacks
  // consecutive tower tops at exactly the same upper/lower limit.
  const topY = prev.topY + minDelta + rand() * (maxDelta - minDelta);
  // Reclassify from the ACTUAL sampled delta (not the pre-sample intent) so
  // streak bookkeeping/reporting always matches real elevation, even when
  // the world-bound fallback above changed the sampled interval.
  const delta = topY - prev.topY;
  const heightClass: HeightClass | undefined = warm ? undefined : classifyHeight(delta);
  const heightStreak = heightClass && heightClass === prev.heightClass ? (prev.heightStreak ?? 0) + 1 : heightClass ? 1 : 0;
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
  // Reclassify from the ACTUAL realized gap (the reachability clamp above
  // can pull it below the intended class's own minimum on a hard height),
  // same reasoning as the height reclassification above.
  const gapClass: GapClass | undefined = warm ? undefined : classifyGap(gap);
  const gapStreak = gapClass && gapClass === prev.gapClass ? (prev.gapStreak ?? 0) + 1 : gapClass ? 1 : 0;
  return { id, x: prev.x + prev.width + gap, topY, width, cat, gapClass, gapStreak, heightClass, heightStreak };
}
