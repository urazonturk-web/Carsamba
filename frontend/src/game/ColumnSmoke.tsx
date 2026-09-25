import { useCallback, useEffect, useRef } from "react";
import { AppState, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";

import { PHASE } from "./config";

// GORSEL-004: atmosphere-only smoke on select columns, visible only while the
// character stands on that column. R1 (director review) supersedes an
// earlier draft: that draft rendered ONE opaque layer BEFORE the character
// (P1: character always fully occluded the smoke instead of appearing
// wrapped in it) and pooled 14 platform slots x 4 puffs = 56
// useAnimatedStyle instances that all kept recomputing every single frame
// off a never-stopped clock, even with every one of them invisible (P2).
// This version fixes both: a single fixed anchor (not pool-indexed) plus an
// explicit back/front split, and a clock that is actually stopped (via
// Reanimated's own FrameCallback.setActive) whenever nothing could be
// visible.

// GORSEL-004A (2026-09-18): which columns are eligible for smoke is no
// longer decided here. It's now the platform's own `visualType` field
// (src/game/procedural-course.ts), set once at generation time and carried
// with the platform data -- this component only reads whether the platform
// currently stood on is a "chimney" (via the `standingPlatformIsChimney`
// SharedValue below), it no longer re-derives eligibility from a bare id.
// The old `isSmokyPlatform(id)` hash that used to live here was deleted;
// its formula moved to `classifyPlatformVisualType` in procedural-course.ts,
// unchanged, now producing "chimney"/"normal" instead of true/false.

// First-draft puff layout. Back puffs are the bulk of the cloud, meant to sit
// mostly around/behind the column. Front puffs are a deliberately smaller,
// lighter subset re-rendered AFTER the character layers (P1 fix) so the
// character reads as standing IN the cloud -- offset to stay clear of the
// face and the landing/contact edge. Purely cosmetic constants; change
// freely without touching any visibility/lifecycle logic below.
const BACK_PUFFS = [
  { dx: -14, dy: -6, r: 22 },
  { dx: 10, dy: -14, r: 18 },
  { dx: -4, dy: -22, r: 16 },
  { dx: 16, dy: -2, r: 20 },
] as const;
const BACK_OPACITY = 0.42;
// R1.1 (director's second, code-level check): dy here is relative to
// smokeAnchorY, which is set to the platform's topY -- the character's FEET
// sit at topY, and the visual sprite extends UPWARD from there (py.value =
// p.topY - PH/2 at rest), so a positive dy pushes a puff DOWN into/below the
// platform surface, nowhere near the character. The original +10/+12 values
// did exactly that. Corrected to a small NEGATIVE dy so both front puffs sit
// just above topY, around the character's lower legs/feet -- still well
// below the face and clearly above the landing/contact edge, not below it.
const FRONT_PUFFS = [
  { dx: -15, dy: -10, r: 16 },
  { dx: 13, dy: -6, r: 14 },
] as const;
const FRONT_OPACITY = 0.22;

type SmokeInputs = {
  standingPlatformIsChimney: SharedValue<boolean>;
  phase: SharedValue<number>;
  running: SharedValue<number>;
};

/**
 * Owns the ONE shared animation clock for the smoke effect and its on/off
 * lifecycle (P2 fix). Call this once (in app/index.tsx, alongside the other
 * top-level hooks), then pass the returned `elapsed` value down to
 * `ColumnSmokeBack` / `ColumnSmokeFront`.
 *
 * The underlying `useFrameCallback` is started with `autostart=false` and is
 * only switched on via Reanimated's own `FrameCallback.setActive`, driven by
 * two independent gates ANDed together:
 *   1. `running === 1 && (phase === IDLE || phase === CHARGING) &&
 *      standingPlatformIsChimney` -- the same condition that gates
 *      visibility, watched on the UI thread via `useAnimatedReaction` and
 *      bridged to JS with `runOnJS` only on actual 0->1/1->0 transitions
 *      (not every frame).
 *   2. `AppState` is `"active"` -- paused whenever the app is backgrounded,
 *      via the standard React Native `AppState` listener.
 * Either gate closing stops the frame callback outright, so no per-frame
 * work happens at all while smoke could not possibly be visible -- this is
 * a code-level guarantee, not a measured FPS number; an on-device
 * comparison is still pending (see kontrol-sonucu.md). Visibility itself is
 * driven directly on the UI thread (see `useSmokeAnchorStyle` below), not by
 * this JS-side active/inactive state, so a stop/start transition in this
 * clock can never desync from what is actually shown.
 *
 * Pausing/resuming never introduces a time jump: the clamp on each frame's
 * delta below (`Math.min(..., 50)`) already bounds a single frame's
 * contribution regardless of how long the callback was inactive, so
 * reactivating after any pause (including app coming back to foreground)
 * cannot produce a sudden jump or a burst of "catch-up" motion.
 */
export function useColumnSmokeClock({ standingPlatformIsChimney, phase, running }: SmokeInputs): SharedValue<number> {
  const elapsed = useSharedValue(0);
  const wantsActiveRef = useRef(false);
  const appForegroundRef = useRef(AppState.currentState === "active");

  const frameHandle = useFrameCallback(frame => {
    elapsed.value += Math.min(frame.timeSincePreviousFrame ?? 0, 50) / 1000;
  }, false);

  const applyActive = useCallback(
    (wantsActive: boolean) => {
      wantsActiveRef.current = wantsActive;
      frameHandle.setActive(wantsActive && appForegroundRef.current);
    },
    [frameHandle],
  );

  useEffect(() => {
    const sub = AppState.addEventListener("change", nextState => {
      appForegroundRef.current = nextState === "active";
      frameHandle.setActive(wantsActiveRef.current && appForegroundRef.current);
    });
    return () => sub.remove();
  }, [frameHandle]);

  useAnimatedReaction(
    () => {
      "worklet";
      return running.value === 1 &&
        (phase.value === PHASE.IDLE || phase.value === PHASE.CHARGING) &&
        standingPlatformIsChimney.value
        ? 1
        : 0;
    },
    (cur, prev) => {
      if (prev === null || cur !== prev) runOnJS(applyActive)(cur === 1);
    },
  );

  return elapsed;
}

function useSmokeAnchorStyle(
  standingPlatformIsChimney: SharedValue<boolean>,
  smokeAnchorX: SharedValue<number>,
  smokeAnchorY: SharedValue<number>,
  phase: SharedValue<number>,
  running: SharedValue<number>,
) {
  // Anchored to a fixed world-space point captured once at landing (see
  // entegrasyon-notu.md) -- NOT re-derived from the platform pool every
  // frame, so pool-slot recycling as the camera scrolls can never desync the
  // smoke from the column it belongs to. The moment phase leaves
  // IDLE/CHARGING (e.g. AIRBORNE on takeoff), opacity goes directly to 0 on
  // the very next UI-thread evaluation -- no withTiming fade -- matching the
  // "closes in the same frame" acceptance criterion.
  return useAnimatedStyle(() => {
    const active =
      running.value === 1 &&
      (phase.value === PHASE.IDLE || phase.value === PHASE.CHARGING) &&
      standingPlatformIsChimney.value;
    return {
      opacity: active ? 1 : 0,
      transform: [{ translateX: smokeAnchorX.value }, { translateY: smokeAnchorY.value }],
    };
  });
}

function Puffs({
  puffs,
  opacity,
  elapsed,
}: {
  puffs: readonly { dx: number; dy: number; r: number }[];
  opacity: number;
  elapsed: SharedValue<number>;
}) {
  return (
    <>
      {puffs.map((puff, i) => (
        <SmokePuff key={i} offset={puff} opacity={opacity} phaseIndex={i} elapsed={elapsed} />
      ))}
    </>
  );
}

function SmokePuff({
  offset,
  opacity,
  phaseIndex,
  elapsed,
}: {
  offset: { dx: number; dy: number; r: number };
  opacity: number;
  phaseIndex: number;
  elapsed: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => {
    const wobble = Math.sin(elapsed.value * 1.6 + phaseIndex * 1.9) * 3;
    const breathe = 0.85 + 0.15 * Math.sin(elapsed.value * 1.1 + phaseIndex);
    return {
      transform: [
        { translateX: offset.dx + wobble },
        { translateY: offset.dy },
        { scale: breathe },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: offset.r * 2,
          height: offset.r * 2,
          borderRadius: offset.r,
          left: -offset.r,
          top: -offset.r,
          backgroundColor: `rgba(60,64,66,${opacity})`,
        },
        style,
      ]}
    />
  );
}

type SmokeLayerProps = SmokeInputs & {
  smokeAnchorX: SharedValue<number>;
  smokeAnchorY: SharedValue<number>;
  elapsed: SharedValue<number>;
};

/**
 * Mount BEFORE the character layers -- the bulk of the cloud, sitting
 * behind/around the column.
 */
export function ColumnSmokeBack({ standingPlatformIsChimney, smokeAnchorX, smokeAnchorY, phase, running, elapsed }: SmokeLayerProps) {
  const anchorStyle = useSmokeAnchorStyle(standingPlatformIsChimney, smokeAnchorX, smokeAnchorY, phase, running);
  return (
    <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ position: "absolute", top: 0, left: 0 }}>
      <Animated.View style={[{ position: "absolute", width: 1, height: 1 }, anchorStyle]}>
        <Puffs puffs={BACK_PUFFS} opacity={BACK_OPACITY} elapsed={elapsed} />
      </Animated.View>
    </View>
  );
}

/**
 * Mount AFTER the character layers (P1 fix) -- a smaller, lower-opacity
 * slice of the same cloud so the character visually reads as wrapped in
 * smoke rather than fully occluding it. Offsets are chosen to stay clear of
 * the face and of the column's landing/contact edge; does not intercept
 * touches (`pointerEvents="none"`) and does not change touch-layer order.
 */
export function ColumnSmokeFront({ standingPlatformIsChimney, smokeAnchorX, smokeAnchorY, phase, running, elapsed }: SmokeLayerProps) {
  const anchorStyle = useSmokeAnchorStyle(standingPlatformIsChimney, smokeAnchorX, smokeAnchorY, phase, running);
  return (
    <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ position: "absolute", top: 0, left: 0 }}>
      <Animated.View style={[{ position: "absolute", width: 1, height: 1 }, anchorStyle]}>
        <Puffs puffs={FRONT_PUFFS} opacity={FRONT_OPACITY} elapsed={elapsed} />
      </Animated.View>
    </View>
  );
}

// TEMP DEBUG (GORSEL-004 iPhone diagnosis, 2026-09-18) -- delete once the
// root cause is found. Proves this module's components actually mount and
// draw SOMETHING on the real device, independent of the world-camera
// transform, the `active` gate, or `isSmokyPlatform` -- a plain, always-on,
// screen-fixed marker with no dependency on any game state at all. If this
// never appears on a real device, the bug is at the mount/render layer
// (build, import, or a swallowed render error) rather than in the
// active/anchor logic above. Mount it OUTSIDE the world-transformed
// container (see entegrasyon-notu.md) so camera position can't hide it.
export function ColumnSmokeMountProbe() {
  useEffect(() => {
    console.log("[smoke-debug] ColumnSmokeMountProbe mounted");
  }, []);
  return (
    <View
      pointerEvents="none"
      style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, borderRadius: 7, backgroundColor: "#ff00ff" }}
    />
  );
}
