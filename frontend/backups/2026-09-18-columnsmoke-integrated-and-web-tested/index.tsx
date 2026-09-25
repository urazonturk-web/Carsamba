import { Image as CachedImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type GestureResponderEvent,
  Image,
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
  withTiming,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AmbientBirds } from "../src/game/AmbientBirds";
import { ColumnSmokeBack, ColumnSmokeFront, useColumnSmokeClock } from "../src/game/ColumnSmoke";
import { jumpVelocity, advanceFlight } from "../src/game/jump";
import { findFootLanding } from "../src/game/landing";
import { referencePlatform, referenceTowerWidth } from "../src/game/reference-course";
import { generateProceduralPlatform, mulberry32Step } from "../src/game/procedural-course";
import { CONFIG, DEBUG_MODE, EXPERIMENTAL_COURSE, PHASE, REFERENCE_TRIAL } from "@/src/game/config";
import { makeStyles, useTheme } from "@/src/theme";
import { storage } from "@/src/utils/storage";

// Small shared texture travels with the JS bundle, avoiding a separate Metro image request.
const BRICK_SOURCE = require("@/assets/environment/brick-inline.json");

// Preserve historical scores separately because the scoring rules changed.
const BEST_SCORE_KEY = REFERENCE_TRIAL ? "jumpcharge.bestScore.reference.v1" : "jumpcharge.bestScore";
// EXPERIMENTAL_COURSE (see src/game/config.ts) swaps the fixed, measured
// REFERENCE_COURSE for the procedural generator below, independent of
// REFERENCE_TRIAL's physics constants. Only this one flag decides which
// tower source is used -- everywhere else in this file keep using
// REFERENCE_TRIAL for physics/scoring exactly as before.
const USE_REFERENCE_COURSE = REFERENCE_TRIAL && !EXPERIMENTAL_COURSE;
const PW = CONFIG.playerWidth;
const PH = CONFIG.playerHeight;
// Render size is independent of the existing collision dimensions.
const CHARACTER_WIDTH = PW * 2.16;
const CHARACTER_HEIGHT = PH * 2.16;
const POOL = 14; // fixed pool of platform views (only ~5 are visible at once)
const POOL_IDX = Array.from({ length: POOL }, (_, i) => i);

// tiny helper to avoid repeating absolute-fill spread
function absoluteFill() {
  return { position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0 };
}

export default function Game() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles();
  const { width: W, height: H } = useWindowDimensions();

  // --- JS-side reactive state (events only, never per-frame) ---------------
  const [score, setScore] = useState(0);
  const [lastJump, setLastJump] = useState<{ ms: number; percent: number; visualPercent: number; pressToFirstFrameMs: number } | null>(null);
  const reportJump = useCallback((ms: number, power: number, launchVX: number, launchVY: number, width: number, fromId: number, lastVisualCharge: number, pressToFirstFrameMs: number) => {
    setLastJump({ ms: Math.round(ms), percent: Math.round(power * 100), visualPercent: Math.round(lastVisualCharge * 100), pressToFirstFrameMs: Math.round(pressToFirstFrameMs) });
    // TEMPORARY diagnostic fields (visualCharge, pressToFirstFrameMs) added
    // per CLAUDE_CHARGE_TIMING_RESULT.md to compare what the player saw
    // against the launch-determining native-timestamp charge on a real
    // device. Safe to remove once the mismatch question is settled.
    console.info("[jump-measurement]", JSON.stringify({ heldMs: ms, charge: power, visualCharge: lastVisualCharge, pressToFirstFrameMs, vx: launchVX, vy: launchVY, screenWidth: width, fromPlatformId: fromId }));
  }, []);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameReady, setGameReady] = useState(false);
  const [loadedArt, setLoadedArt] = useState<Record<string, boolean>>({});
  const [artError, setArtError] = useState(false);
  // Temporary device measurement: JS-observed native image events, not separate network/decode timings.
  const [artOrigin] = useState(() => performance.now());
  const [artTimings, setArtTimings] = useState({ starts: {} as Record<string, number>, ends: {} as Record<string, number> });
  const artClock = useRef({ origin: artOrigin, starts: {} as Record<string, number>, ends: {} as Record<string, number> });
  const [showArtTiming, setShowArtTiming] = useState(true);
  const markArtStarted = useCallback((name: string) => {
    const clock = artClock.current;
    if (clock.starts[name] === undefined) clock.starts[name] = performance.now() - clock.origin;
  }, []);
  const markArtLoaded = useCallback((name: string) => {
    const clock = artClock.current;
    if (clock.ends[name] === undefined) {
      clock.ends[name] = performance.now() - clock.origin;
      setArtTimings({ starts: { ...clock.starts }, ends: { ...clock.ends } });
      console.info("[art-load]", name, JSON.stringify({ startMs: clock.starts[name], readyMs: clock.ends[name] }));
    }
    setLoadedArt(previous => previous[name] ? previous : { ...previous, [name]: true });
  }, []);
  const failArt = useCallback(() => setArtError(true), []);
  const artReady = loadedArt.background && loadedArt.body && loadedArt.head && loadedArt.bricks;

  const [perfectVisible, setPerfectVisible] = useState(false);
  const [landingLabel, setLandingLabel] = useState("PERFECT!");
  const [debug, setDebug] = useState({
    charge: 0, vx: 0, vy: 0, dist: 0, width: 0, offset: 0, fps: 0,
  });
  const scoreRef = useRef(0);
  const bestRef = useRef(0);
  const perfectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Shared (UI-thread) game state ---------------------------------------
  const px = useSharedValue(0);
  const py = useSharedValue(0);
  const vx = useSharedValue(0);
  const vy = useSharedValue(0);
  const phase = useSharedValue<number>(PHASE.IDLE);
  const charge = useSharedValue(0);
  const touchStartedAt = useSharedValue(0);
  // Diagnostic only (not read by the charge formula below): records the
  // display-link timestamp of the first frame tick seen while CHARGING, so
  // onPressOut can report how long press-processing took to reach the frame
  // loop. See CLAUDE_CHARGE_TIMING_RESULT.md.
  const firstChargeFrameSeen = useSharedValue(0);
  const firstChargeFrameTs = useSharedValue(0);
  const releasedCharge = useSharedValue(0); // visual compression held during flight
  const visualCharge = useSharedValue(0);
  const jacketOpen = useSharedValue(0);
  const jacketPopped = useSharedValue(0);
  const puffAge = useSharedValue(1);
  const headTilt = useSharedValue(0);
  const headVelocity = useSharedValue(0);
  const camX = useSharedValue(0);
  const camY = useSharedValue(0);
  const baseY = useSharedValue(0);
  const landPulse = useSharedValue(0);
  const platforms = useSharedValue<any[]>([]);
  const idCounter = useSharedValue(1);
  const lastLandedId = useSharedValue(0);
  // Visual-only, unrelated to score: which platform the character is
  // currently standing on, and the world-space point the column-smoke
  // effect anchors to. Distinct from lastLandedId, which only advances on a
  // NEW high-score platform and must not be repurposed for this (see
  // GORSEL-004 task notes).
  const standingPlatformId = useSharedValue(0);
  const smokeAnchorX = useSharedValue(0);
  const smokeAnchorY = useSharedValue(0);
  const lastOffset = useSharedValue(0);
  const fps = useSharedValue(60);
  const dbgAcc = useSharedValue(0);
  const running = useSharedValue(0); // 1 while a round is active

  // Seeded procedural generation. A fresh random seed is drawn each run so
  // every restart produces a different map; supplying a fixed seed reproduces
  // the exact same tower sequence (foundation for future shared-seed modes).
  const rngState = useSharedValue(1);
  const runSeed = useSharedValue(1);

  // Perfect-landing particle burst
  const burst = useSharedValue(0);
  const burstX = useSharedValue(0);
  const burstY = useSharedValue(0);

  // ------------------------------------------------------------------------
  // Load persisted best score once.
  // ------------------------------------------------------------------------
  useEffect(() => {
    let alive = true;
    (async () => {
      const saved = await storage.getItem<number>(BEST_SCORE_KEY, 0);
      if (alive && typeof saved === "number") {
        bestRef.current = saved;
        setBest(saved);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // ------------------------------------------------------------------------
  // Seeded RNG (mulberry32) + tower generator. Both are worklet-safe and used
  // by UI-thread initialisation and spawning, consuming one continuous seeded
  // stream so a given seed always reproduces the same tower sequence.
  // ------------------------------------------------------------------------
  const rand = () => {
    "worklet";
    const r = mulberry32Step(rngState.value);
    rngState.value = r.nextState;
    return r.value;
  };

  // Procedural math itself lives in src/game/procedural-course.ts (a single
  // source of truth also imported by offline test scripts, avoiding a
  // hand-duplicated copy that could silently drift from the live game).
  const makeNextPlatform = (prev: any, id: number) => {
    "worklet";
    const measured = USE_REFERENCE_COURSE ? referencePlatform(id, W, CONFIG.cameraZoom) : null;
    if (measured) return measured;
    const generated = generateProceduralPlatform(prev, id, rand, W);
    const width = USE_REFERENCE_COURSE ? referenceTowerWidth(W, CONFIG.cameraZoom) : generated.width;
    return { ...generated, width };
  };

  // ------------------------------------------------------------------------
  // (Re)initialise the world. A fresh seed is drawn unless one is supplied
  // (deterministic-seed hook for future shared-map modes). Snaps the camera
  // into place so restart is instant with no slide.
  // ------------------------------------------------------------------------
  const initWorld = useCallback((seed?: number) => {
    const seedVal =
      (seed !== undefined
        ? seed
        : (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0) >>> 0;
    // Native SharedValue writes from JS are asynchronous. Build and publish
    // the entire round on the UI thread before rendering or advancing it.
    runOnUI((seedVal: number) => {
      "worklet";
      running.value = 0;
      const s = CONFIG.cameraZoom;
      const viewW = W / s;
      runSeed.value = seedVal;
      rngState.value = seedVal;

      const first = (USE_REFERENCE_COURSE ? referencePlatform(0, W, CONFIG.cameraZoom) : null)
        ?? { id: 0, x: 0, topY: 0, width: CONFIG.widthWide.max, cat: 0 };
      const list: any[] = [first];

      // Reference video: character's rest stance sits ~0.53-0.58 of the way
      // across the first tower's width (measured from two frame features,
      // 11-12-55 reference), not 0.42. Centering here (0.5) is a conservative
      // read of that range. See CLAUDE_TAKEOFF_RESULT.md.
      px.value = first.x + first.width * 0.5;
      py.value = first.topY - PH / 2;
      vx.value = 0;
      vy.value = 0;
      charge.value = 0;
      releasedCharge.value = 0;
      visualCharge.value = 0;
      jacketOpen.value = 0;
      jacketPopped.value = 0;
      puffAge.value = 1;
      headTilt.value = 0;
      headVelocity.value = 0;
      landPulse.value = 0;
      baseY.value = first.topY;
      phase.value = PHASE.IDLE;

      // Pre-generate the whole visible route + buffer so the next towers already
      // exist and are on-screen before the first jump.
      while (
        list[list.length - 1].x + list[list.length - 1].width <
        px.value + viewW + CONFIG.spawnAhead
      ) {
        list.push(makeNextPlatform(list[list.length - 1], list.length));
      }
      // Guarantee the starting tower + at least the next TWO upcoming towers,
      // regardless of viewport size, so a run never starts under-populated.
      while (list.length < 3) {
        list.push(makeNextPlatform(list[list.length - 1], list.length));
      }
      idCounter.value = list.length;
      lastLandedId.value = 0;
      standingPlatformId.value = first.id;
      smokeAnchorX.value = px.value;
      smokeAnchorY.value = first.topY;
      platforms.value = list;

      // Snap camera to the adaptive framing target (no initial slide).
      let ni = -1;
      for (let i = 0; i < list.length; i++) {
        if (list[i].x > px.value) {
          ni = i;
          break;
        }
      }
      const nx = ni >= 0 ? list[ni] : null;
      const nx1 = ni >= 0 && ni + 1 < list.length ? list[ni + 1] : null;
      const targetRight = nx1
        ? nx1.x + nx1.width
        : nx
          ? nx.x + nx.width
          : px.value;
      const camReveal = targetRight - (CONFIG.cameraRevealRight * W) / s;
      const camRest = px.value - (CONFIG.cameraAnchorMax * W) / s;
      const camFwd = px.value - (CONFIG.cameraAnchorMin * W) / s;
      let cx = camReveal;
      if (cx < camRest) cx = camRest;
      if (cx > camFwd) cx = camFwd;
      camX.value = cx;
      camY.value = baseY.value - (CONFIG.cameraPlayerAnchorY * H) / s;
      running.value = 1;
      runOnJS(setGameReady)(true);
    })(seedVal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [W, H]);

  // Initialise only once real screen dimensions are known, so the starting
  // tower + camera are computed correctly. gameReady gates the first playable
  // frame — no partially initialised state is ever rendered or interactive.
  useEffect(() => {
    if (W > 0 && H > 0 && !gameReady) {
      initWorld();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [W, H, gameReady]);

  // ------------------------------------------------------------------------
  // JS callbacks triggered from the worklet (rare, event-based).
  // ------------------------------------------------------------------------
  const onLanding = useCallback((perfect: number, towersCrossed: number) => {
    const gained =
      towersCrossed * CONFIG.scorePerLanding +
      (towersCrossed > 1 ? towersCrossed * CONFIG.scoreMultiTowerBonus : 0) +
      (perfect ? CONFIG.scorePerfectBonus : 0);
    scoreRef.current += gained;
    setScore(scoreRef.current);
    if (perfect && Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    if (REFERENCE_TRIAL ? towersCrossed > 1 : perfect) {
      setLandingLabel(REFERENCE_TRIAL ? `+${gained}` : "PERFECT!");
      setPerfectVisible(true);
      if (perfectTimer.current) clearTimeout(perfectTimer.current);
      perfectTimer.current = setTimeout(() => setPerfectVisible(false), 750);
    }
  }, []);

  const onGameOver = useCallback(() => {
    setGameOver(true);
    if (scoreRef.current > bestRef.current) {
      bestRef.current = scoreRef.current;
      setBest(scoreRef.current);
      storage.setItem(BEST_SCORE_KEY, scoreRef.current);
    }
  }, []);

  const pushDebug = useCallback((d: typeof debug) => setDebug(d), []);

  const restart = useCallback(() => {
    scoreRef.current = 0;
    setScore(0);
    setLastJump(null);
    setGameOver(false);
    setPerfectVisible(false);
    initWorld();
  }, [initWorld]);

  // ------------------------------------------------------------------------
  // Raw responder events avoid Pressability's 130ms minimum press duration.
  // Use native event timestamps so JS/UI queue delays do not add jump power.
  // ------------------------------------------------------------------------
  const onPressIn = useCallback((event: GestureResponderEvent) => {
    const timestamp = event.nativeEvent.timestamp;
    runOnUI((startedAt: number) => {
      "worklet";
      if (running.value !== 1 || phase.value !== PHASE.IDLE) return;
      touchStartedAt.value = startedAt;
      charge.value = 0;
      firstChargeFrameSeen.value = 0;
      jacketOpen.value = withSpring(0, { damping: 19, stiffness: 220, mass: 0.7 });
      jacketPopped.value = 0;
      puffAge.value = 1;
      phase.value = PHASE.CHARGING;
    })(timestamp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPressOut = useCallback((event: GestureResponderEvent) => {
    const timestamp = event.nativeEvent.timestamp;
    runOnUI((endedAt: number) => {
      "worklet";
      if (running.value !== 1 || phase.value !== PHASE.CHARGING) return;
      const heldSeconds = Math.max(0, endedAt - touchStartedAt.value) / 1000;
      const c = Math.min(1, heldSeconds / CONFIG.maxChargeDuration);
      const launch = jumpVelocity(c, W);
      // Diagnostic snapshot (see CLAUDE_CHARGE_TIMING_RESULT.md): charge.value
      // BEFORE it is reset below is what the player was actually looking at
      // this instant; pressToFirstFrameMs is how long press-processing took
      // to reach the frame loop's first CHARGING tick.
      const lastVisualCharge = charge.value;
      const pressToFirstFrameMs = firstChargeFrameSeen.value === 1 ? firstChargeFrameTs.value - touchStartedAt.value : -1;
      if (__DEV__) runOnJS(reportJump)(heldSeconds * 1000, c, launch.vx, launch.vy, W, lastLandedId.value, lastVisualCharge, pressToFirstFrameMs);
      vx.value = launch.vx;
      vy.value = launch.vy;
      headVelocity.value = -65 - c * 55;
      releasedCharge.value = c;
      phase.value = PHASE.AIRBORNE;
      charge.value = 0;
    })(timestamp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [W, reportJump]);

  const cancelCharge = useCallback(() => {
    runOnUI(() => {
      "worklet";
      if (phase.value !== PHASE.CHARGING) return;
      phase.value = PHASE.IDLE;
      charge.value = 0;
      releasedCharge.value = 0;
      visualCharge.value = 0;
      jacketOpen.value = withSpring(0, { damping: 19, stiffness: 220, mass: 0.7 });
      jacketPopped.value = 0;
      puffAge.value = 1;
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------------------------------------
  // THE GAME LOOP — runs on the UI thread every frame (~60fps).
  // ------------------------------------------------------------------------
  useFrameCallback((frame) => {
    "worklet";
    if (running.value !== 1) return;

    let dt = (frame.timeSincePreviousFrame ?? 16.7) / 1000;
    if (dt > 1 / 30) dt = 1 / 30; // clamp big hitches so physics stays stable
    if (dt <= 0) return;

    // Visual damped spring, integrated in small steps; never feeds game physics.
    let angle = headTilt.value;
    let angularVelocity = headVelocity.value;
    for (let step = 0; step < 4; step++) {
      const h = dt / 4;
      angularVelocity += (-100 * angle - 8 * angularVelocity) * h;
      angle += angularVelocity * h;
    }
    headTilt.value = Math.max(-12, Math.min(12, angle));
    headVelocity.value = angularVelocity;

    fps.value = fps.value * 0.9 + (1 / dt) * 0.1;
    const list = platforms.value;

    // --- charge ---
    // Recomputed fresh from timestamps every frame instead of accumulating a
    // per-frame delta. This removes drift AND the charge-start boundary
    // question entirely: there is no "which side of press-down does this
    // interval belong to" ambiguity when there is no interval being
    // accumulated in the first place, only a direct elapsed-time readout.
    //
    // frame.timestamp (Reanimated, from CADisplayLink.targetTimestamp * 1000
    // -- see node_modules/react-native-reanimated/apple/reanimated/apple/
    // native/PlatformDepMethodsHolderImpl.mm) and touchStartedAt.value (from
    // event.nativeEvent.timestamp, i.e. UITouch.timestamp * 1000 -- see
    // node_modules/react-native/React/Base/RCTTouchHandler.m) are VERIFIED
    // to share the same clock on iOS: both are CACurrentMediaTime-based
    // seconds converted to ms with the same *1000. Subtracting them directly
    // is therefore safe. (Android uses a different native path and has not
    // been verified the same way.) See CLAUDE_CHARGE_TIMING_RESULT.md.
    if (phase.value === PHASE.CHARGING) {
      if (firstChargeFrameSeen.value === 0) {
        firstChargeFrameSeen.value = 1;
        firstChargeFrameTs.value = frame.timestamp; // diagnostic only, see onPressOut
      }
      const heldMs = frame.timestamp - touchStartedAt.value;
      charge.value = Math.min(1, Math.max(0, heldMs / 1000 / CONFIG.maxChargeDuration));
    }

    if (puffAge.value < 1) puffAge.value = Math.min(1, puffAge.value + dt);
    if (phase.value === PHASE.CHARGING && charge.value >= 1 && jacketPopped.value === 0) {
      jacketPopped.value = 1;
      puffAge.value = 0;
      jacketOpen.value = withSpring(1, { damping: 15, stiffness: 240, mass: 0.7 });
    }

    // --- airborne physics ---
    if (phase.value === PHASE.AIRBORNE) {
      const prevX = px.value;
      const prevBottom = py.value + PH / 2;
      const flight = advanceFlight(px.value, py.value, vx.value, vy.value, dt, W);
      px.value = flight.x;
      py.value = flight.y;
      vy.value = flight.vy;
      const newBottom = py.value + PH / 2;

      if (vy.value > 0) {
        const contact = findFootLanding(list, prevX, px.value, prevBottom, newBottom, CHARACTER_WIDTH * 0.8);
        if (contact) {
          const p = list[contact.index];
          const cx = contact.x;
          px.value = cx;
          // fair landing
          py.value = p.topY - PH / 2;
          vx.value = 0;
          headVelocity.value = Math.min(150, 45 + Math.abs(vy.value) * 0.06);
          vy.value = 0;
          baseY.value = p.topY;
          // Visual-only, unconditional on every successful landing (unlike
          // the score-only lastLandedId gate a few lines below). Anchored to
          // the actual resolved landing x (cx), not the platform's center,
          // so the cloud tracks an off-center landing and wraps the
          // character where they actually stand.
          standingPlatformId.value = p.id;
          smokeAnchorX.value = cx;
          smokeAnchorY.value = p.topY;
          jacketOpen.value = withSpring(0, { damping: 19, stiffness: 220, mass: 0.7 });
          releasedCharge.value = 0;
          phase.value = PHASE.IDLE;
          landPulse.value = withSequence(
            withTiming(1, { duration: 55 }),
            withTiming(0, { duration: CONFIG.landPulseDuration * 1000 }),
          );
          const offset = cx - (p.x + p.width / 2);
          lastOffset.value = offset;
          const perfect = Math.abs(offset) <= CONFIG.perfectTolerance ? 1 : 0;
          // Score only the first time we reach a new (higher id) platform.
          if (p.id > lastLandedId.value) {
            const towersCrossed = p.id - lastLandedId.value;
            lastLandedId.value = p.id;
            if (perfect) {
              burstX.value = cx;
              burstY.value = p.topY;
              burst.value = 0;
              burst.value = withTiming(1, { duration: 620 });
            }
            runOnJS(onLanding)(perfect, towersCrossed);
          }
        }
      }

      // --- fall -> game over ---
      if ((py.value - camY.value) * CONFIG.cameraZoom > H + 60) {
        phase.value = PHASE.DEAD;
        running.value = 0;
        runOnJS(onGameOver)();
      }
    }

    // Charge remains immediate; only recovery after landing is softened.
    if (phase.value === PHASE.CHARGING) visualCharge.value = charge.value;
    else if (phase.value === PHASE.AIRBORNE || phase.value === PHASE.DEAD) visualCharge.value = releasedCharge.value;
    else visualCharge.value *= Math.exp(-18 * dt);

    // --- procedural spawn ahead + cleanup behind (reassign, never mutate) ---
    const s = CONFIG.cameraZoom;
    const viewW = W / s;
    let working = list;
    let changed = false;
    let last = working[working.length - 1];
    if (last && last.x + last.width < camX.value + viewW + CONFIG.spawnAhead) {
      const add: any[] = [];
      let cur = last;
      while (cur.x + cur.width < camX.value + viewW + CONFIG.spawnAhead) {
        const n = makeNextPlatform(cur, idCounter.value);
        idCounter.value += 1;
        add.push(n);
        cur = n;
      }
      working = working.concat(add);
      changed = true;
    }
    let startIdx = 0;
    while (
      startIdx < working.length - 2 &&
      working[startIdx].x + working[startIdx].width < camX.value - CONFIG.removeBehind
    ) {
      startIdx += 1;
    }
    if (startIdx > 0) {
      working = working.slice(startIdx);
      changed = true;
    }
    if (changed) platforms.value = working;

    // --- camera: adaptive look-ahead framing (current + next + next+1) ---
    const plist = platforms.value;
    let ni = -1;
    for (let i = 0; i < plist.length; i++) {
      if (plist[i].x > px.value) {
        ni = i;
        break;
      }
    }
    const nx = ni >= 0 ? plist[ni] : null;
    const nx1 = ni >= 0 && ni + 1 < plist.length ? plist[ni + 1] : null;
    const targetRight = nx1
      ? nx1.x + nx1.width
      : nx
        ? nx.x + nx.width
        : px.value;
    // Frame so the NEXT+1 tower's right edge sits near cameraRevealRight, but
    // never pull the player tighter than anchorMax nor push past anchorMin.
    // The NEXT tower (closer) is therefore always visible.
    const camReveal = targetRight - (CONFIG.cameraRevealRight * W) / s;
    const camRest = px.value - (CONFIG.cameraAnchorMax * W) / s;
    const camFwd = px.value - (CONFIG.cameraAnchorMin * W) / s;
    let ctx = camReveal;
    if (ctx < camRest) ctx = camRest;
    if (ctx > camFwd) ctx = camFwd;
    camX.value += (ctx - camX.value) * CONFIG.cameraSmoothingX;

    // Keep one vertical world reference for the whole round. Landing on a
    // taller/shorter tower must not pan the entire route up/down.
    let focusY = 0;
    if (phase.value === PHASE.DEAD) focusY = py.value;
    const tY = focusY - (CONFIG.cameraPlayerAnchorY * H) / s;
    const smoothY =
      phase.value === PHASE.DEAD
        ? CONFIG.cameraFallSmoothing
        : CONFIG.cameraSmoothingY;
    camY.value += (tY - camY.value) * smoothY;

    // --- debug telemetry (throttled to ~10hz) ---
    if (DEBUG_MODE) {
      dbgAcc.value += dt;
      if (dbgAcc.value >= 0.1) {
        dbgAcc.value = 0;
        let dist = 0;
        let pw = 0;
        for (let i = 0; i < list.length; i++) {
          if (list[i].x > px.value) {
            dist = list[i].x - px.value;
            pw = list[i].width;
            break;
          }
        }
        runOnJS(pushDebug)({
          charge: Math.round(charge.value * 100),
          vx: Math.round(vx.value),
          vy: Math.round(vy.value),
          dist: Math.round(dist),
          width: Math.round(pw),
          offset: Math.round(lastOffset.value),
          fps: Math.round(fps.value),
        });
      }
    }
  }, true);

  // ------------------------------------------------------------------------
  // Blob animated style — charge squash, air stretch, landing pulse, shake.
  // ------------------------------------------------------------------------
  const bodyStyle = useAnimatedStyle(() => {
    const c = visualCharge.value;
    const sy = (1 - 0.28 * c) * (1 - 0.22 * landPulse.value);
    return {
      transform: [
        { translateX: px.value - CHARACTER_WIDTH * 0.4 },
        { translateY: py.value + PH / 2 - CHARACTER_HEIGHT * 0.8 },
        { scaleX: (1 + 0.35 * c) * (1 + 0.26 * landPulse.value) },
        { scaleY: sy },
        { skewX: `${headTilt.value * 0.25}deg` },
      ],
    };
  });

  const feetStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: px.value - CHARACTER_WIDTH * 0.4 },
      { translateY: py.value + PH / 2 - CHARACTER_HEIGHT * 0.8 },
      { scaleY: (1 - 0.28 * visualCharge.value) * (1 - 0.22 * landPulse.value) },
    ],
  }));

  const jacketLeftStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -10 * jacketOpen.value }, { rotate: `${-14 * jacketOpen.value}deg` }],
  }));
  const jacketRightStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: 10 * jacketOpen.value }, { rotate: `${14 * jacketOpen.value}deg` }],
  }));
  const bellyStyle = useAnimatedStyle(() => ({
    opacity: Math.max(0, Math.min(1, jacketOpen.value)),
    transform: [{ scale: 0.85 + 0.15 * jacketOpen.value + (puffAge.value < 0.45 ? Math.sin(puffAge.value / 0.45 * Math.PI) * 0.08 : 0) }],
  }));
  const puffStyle = useAnimatedStyle(() => ({
    opacity: puffAge.value < 0.48 ? Math.sin(Math.PI * Math.min(1, puffAge.value / 0.48)) * 0.85 : 0,
    transform: [{ scale: 0.35 + (1 - Math.pow(1 - Math.min(1, puffAge.value / 0.48), 3)) * 1.2 }],
  }));

  const blobStyle = useAnimatedStyle(() => {
    const c = visualCharge.value;
    const sy = (1 - 0.28 * c) * (1 - 0.22 * landPulse.value);
    return {
      transform: [
        { translateX: px.value - CHARACTER_WIDTH / 2 },
        { translateY: py.value + PH / 2 - CHARACTER_HEIGHT * 0.8 * sy - CHARACTER_HEIGHT + 10 },
        { rotate: `${headTilt.value}deg` },
      ],
    };
  });

  const burstStyle = useAnimatedStyle(() => {
    const b = burst.value;
    return {
      opacity: b > 0 && b < 1 ? 1 - b : 0,
      transform: [
        { translateX: burstX.value },
        { translateY: burstY.value },
        { scale: 0.6 + b * 1.6 },
      ],
    };
  });

  // Single shared clock for the column-smoke effect (see GORSEL-004); the
  // hook itself stops the underlying frame callback whenever nothing could
  // be visible (wrong column, airborne/dead, round not running, or app
  // backgrounded) instead of ticking unconditionally every frame.
  const smokeElapsed = useColumnSmokeClock({ standingPlatformId, phase, running });

  // World camera: maps world coords -> screen as (world - cam) * zoom, with a
  // top-left transform origin (see styles.world). This keeps the player in the
  // left band while the zoom reveals the upcoming route on the right.
  const worldStyle = useAnimatedStyle(() => {
    const s = CONFIG.cameraZoom;
    return {
      transform: [
        { translateX: -camX.value * s },
        { translateY: -camY.value * s },
        { scale: s },
      ],
    };
  });

  return (
    <View style={styles.root} testID="game-root">
      <StatusBar style="dark" />
      <LinearGradient
        colors={[colors.gameSky, colors.gameSkyFar]}
        style={styles.fill}
      />

      <CachedImage cachePolicy="memory-disk" priority="high" transition={0}
        source={require("@/assets/environment/neighborhood-mobile.jpg")}
        onLoadStart={() => markArtStarted("background")}
        onLoad={() => markArtLoaded("background")}
        onError={failArt}
       
        style={[styles.fill, { width: W, height: H }]}
        contentFit="cover"
      />
      <View style={styles.backgroundWash} pointerEvents="none" />
      <AmbientBirds width={W} height={H} />

      {gameReady && (
        <>
          {/* Scaled world container — everything in world coords lives here */}
          <Animated.View style={[styles.world, worldStyle]}>
        {/* Platforms (fixed pool, positioned by the worklet) */}
        {POOL_IDX.map((i) => (
          <PlatformView
            key={i}
            index={i}
            platforms={platforms}
            styles={styles}
            onArtLoad={markArtLoaded}
            onArtStart={markArtStarted}
            onArtError={failArt}
          />
        ))}

        {/* Atmosphere-only smoke on select columns, back layer (behind the
            character); visible only while standing on that column, see
            GORSEL-004. Front counterpart is mounted after the character
            layers below so the character reads as wrapped in the cloud. */}
        <ColumnSmokeBack
          standingPlatformId={standingPlatformId}
          smokeAnchorX={smokeAnchorX}
          smokeAnchorY={smokeAnchorY}
          phase={phase}
          running={running}
          elapsed={smokeElapsed}
        />

        {/* Perfect-landing particle burst */}
        <Animated.View style={[styles.burst, burstStyle]}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const ang = (Math.PI * 2 * i) / 6;
            return (
              <View
                key={i}
                style={[
                  styles.burstDot,
                  { left: Math.cos(ang) * 20, top: Math.sin(ang) * 20 },
                ]}
              />
            );
          })}
        </Animated.View>

        {/* Elastic body and independent head; both are visual-only. */}
        <Animated.View testID="elastic-body" style={[styles.body, bodyStyle]}>
          <Animated.View testID="undershirt-belly" style={[styles.belly, bellyStyle]}>
            <View style={styles.bellyFold} />
          </Animated.View>
          <Animated.View style={[styles.jacketHalf, styles.jacketLeft, jacketLeftStyle]}>
            <CachedImage cachePolicy="memory-disk" priority="high" transition={0} onLoadStart={() => markArtStarted("body")} onLoad={() => markArtLoaded("body")} onError={failArt} source={require("../assets/characters/tracksuit-body-mobile.png")} style={styles.jacketImage} contentFit="fill" />
          </Animated.View>
          <Animated.View style={[styles.jacketHalf, styles.jacketRight, jacketRightStyle]}>
            <CachedImage cachePolicy="memory-disk" priority="high" transition={0} onLoadStart={() => markArtStarted("body")} onLoad={() => markArtLoaded("body")} onError={failArt} source={require("../assets/characters/tracksuit-body-mobile.png")} style={[styles.jacketImage, styles.jacketRightImage]} contentFit="fill" />
          </Animated.View>
          <Animated.View testID="jacket-puff" style={[styles.puff, puffStyle]}>
            {[0, 1, 2, 3, 4].map((i) => <View key={i} style={[styles.puffCloud, { left: i * 11, top: i % 2 * 9 }]} />)}
          </Animated.View>
        </Animated.View>
        <Animated.View testID="player-feet" style={[styles.body, feetStyle]}>
          <View style={styles.pantsClip}>
            <CachedImage cachePolicy="memory-disk" priority="high" transition={0} onLoadStart={() => markArtStarted("body")} onLoad={() => markArtLoaded("body")} onError={failArt} source={require("../assets/characters/tracksuit-body-mobile.png")} style={[styles.jacketImage, styles.pantsImage]} contentFit="fill" />
          </View>
        </Animated.View>
        <Animated.View style={[styles.blob, blobStyle]}>
          <CachedImage cachePolicy="memory-disk" priority="high" transition={0}
            testID="comic-character"
            onLoadStart={() => markArtStarted("head")}
            onLoad={() => markArtLoaded("head")}
            onError={failArt}
            source={require("../assets/characters/absurd-head-mobile.png")}
            style={styles.characterImage}
            contentFit="contain"

          />
        </Animated.View>

        {/* Front counterpart of the column smoke, rendered AFTER every
            character layer above so the character reads as wrapped in the
            cloud instead of fully occluding it (R1 director fix, P1). Lower
            opacity, offset low/to the sides -- does not cover the face or
            the column's landing edge, and does not intercept touches. */}
        <ColumnSmokeFront
          standingPlatformId={standingPlatformId}
          smokeAnchorX={smokeAnchorX}
          smokeAnchorY={smokeAnchorY}
          phase={phase}
          running={running}
          elapsed={smokeElapsed}
        />
      </Animated.View>

      {/* Full-screen touch layer */}
      <View
        testID="charge-surface"
        style={styles.touch}
        onStartShouldSetResponder={() => !gameOver}
        onResponderGrant={onPressIn}
        onResponderRelease={onPressOut}
        onResponderTerminate={cancelCharge}
      />

      {/* Score HUD */}
      {!gameOver && <View style={[styles.hud, { top: insets.top + 24 }]}>
        <Text style={styles.scoreText} testID="score-value">
          {score}
        </Text>
        <Text style={styles.bestText} testID="best-value">
          BEST {best}
        </Text>
      </View>}

      {__DEV__ && lastJump && (
        <View pointerEvents="none" style={{ position: "absolute", top: insets.top + 116, alignSelf: "center", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.85)" }}>
          <Text style={{ color: "#26383b", fontSize: 12 }}>Son basış: {lastJump.ms} ms · Güç: %{lastJump.percent} · Görsel: %{lastJump.visualPercent} · İlk kare: {lastJump.pressToFirstFrameMs}ms</Text>
        </View>
      )}

      {/* Hint (only before first jump) */}
      {score === 0 && !gameOver && (
        <View style={styles.hint}>
          <Text style={styles.hintText}>Hold to charge · Release to jump</Text>
        </View>
      )}

      {/* PERFECT! popup */}
      {perfectVisible && (
        <View style={styles.perfectWrap}>
          <PerfectPop key={`${score}-${landingLabel}`} styles={styles} label={landingLabel} />
        </View>
      )}

      {/* Debug overlay */}
      {DEBUG_MODE && (
        <View
          style={[styles.debug, { top: insets.top + 60 }]}
         
          testID="debug-overlay"
        >
          <Text style={styles.debugText}>charge {debug.charge}%</Text>
          <Text style={styles.debugText}>vx {debug.vx}</Text>
          <Text style={styles.debugText}>vy {debug.vy}</Text>
          <Text style={styles.debugText}>next dist {debug.dist}</Text>
          <Text style={styles.debugText}>next width {debug.width}</Text>
          <Text style={styles.debugText}>land offset {debug.offset}</Text>
          <Text style={styles.debugText}>fps {debug.fps}</Text>
        </View>
      )}

      {/* Game Over */}
      {gameOver && (
        <View style={styles.overlay} testID="game-over-overlay">
          <View style={styles.card}>
            <Text style={styles.gameOverTitle}>Game Over</Text>
            <Text style={styles.statLabel}>SCORE</Text>
            <Text style={styles.statValue} testID="final-score">
              {score}
            </Text>
            <Text style={styles.finalBest} testID="final-best">
              BEST {best}
            </Text>
            <Pressable
              testID="play-again-button"
              style={({ pressed }) => [
                styles.playBtn,
                pressed && styles.playBtnPressed,
              ]}
              onPress={restart}
            >
              <Text style={styles.playBtnText}>Play Again</Text>
            </Pressable>
          </View>
        </View>
      )}
        </>
      )}
      {__DEV__ && showArtTiming && (
        <View style={styles.artTiming}>
          <Text style={styles.artLoadingText}>Görsel yükleme ölçümü</Text>
          <Text style={styles.artTimingText}>Başlangıç → hazır / yükleme olayı süresi</Text>
          {([["background", "Manzara"], ["bricks", "Tuğla"], ["head", "Kafa"], ["body", "Vücut"]] as const).map(([id, label]) => {
            const clock = artTimings;
            const end = clock.ends[id];
            const start = clock.starts[id];
            return <Text key={id} style={styles.artTimingText}>{label}: {end === undefined ? "Yükleme bildirimi bekleniyor" : `${Math.round(end)} ms`} / {start === undefined || end === undefined ? "—" : `${Math.round(end - start)} ms`}</Text>;
          })}
          <Text style={styles.artTimingText}>{artReady ? `Tüm görseller hazır: ${Math.round(Math.max(...Object.values(artTimings.ends)))} ms` : "Ölçüm sürüyor; oyuna giriş engellenmiyor."}</Text>
          {artError && <Text style={styles.artTimingText}>Bir görsel yükleme hatası bildirildi.</Text>}
          <Text style={styles.artTimingText}>Süreler eşzamanlıdır, toplanmaz. Expo açılışı dahil değildir.</Text>
          <Pressable accessibilityRole="button" onPress={() => setShowArtTiming(false)}><Text style={styles.artLoadingText}>Kapat</Text></Pressable>
        </View>
      )}

    </View>
  );
}

// ---------------------------------------------------------------------------
// A single pooled platform view. Reads its slot from the shared array every
// time the shared platform array changes.
// ---------------------------------------------------------------------------
function PlatformView({ index, platforms, styles, onArtLoad, onArtStart, onArtError }: any) {
  const style = useAnimatedStyle(() => {
    const p = platforms.value[index];
    if (!p) {
      return {
        opacity: 0,
        transform: [{ translateX: -99999 }, { translateY: -99999 }],
      };
    }
    return {
      opacity: 1,
      width: p.width,
      transform: [{ translateX: p.x }, { translateY: p.topY }],
    };
  });
  const centerStyle = useAnimatedStyle(() => {
    const p = platforms.value[index];
    return {
      opacity: p ? 0.55 : 0,
      left: (p ? p.width : 0) / 2 - CONFIG.perfectTolerance,
    };
  });
  return (
    <Animated.View style={[styles.tower, style]}>
      {/* One native tiled image per tower, rather than 17 separate image views. */}
      <View style={styles.towerBrick}>
        <Image
          source={BRICK_SOURCE}
          onLoadStart={index === 0 ? () => onArtStart("bricks") : undefined}
          onLoad={index === 0 ? () => onArtLoad("bricks") : undefined}
          onError={index === 0 ? onArtError : undefined}
          fadeDuration={0}
          style={styles.brickImage}
          resizeMode="repeat"
        />
      </View>
      <View style={styles.towerShade} />
      <View style={styles.capShadow} />
      <View style={styles.towerCap} />
      <View style={styles.capHighlight} />
      <Animated.View style={[styles.towerCenter, centerStyle]} />
    </Animated.View>
  );
}

// PERFECT! pop with a quick scale-in.
function PerfectPop({ styles, label }: any) {
  const s = useSharedValue(0);
  useEffect(() => {
    s.value = withTiming(1, { duration: 180 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const st = useAnimatedStyle(() => ({
    opacity: s.value,
    transform: [{ scale: 0.6 + s.value * 0.4 }],
  }));
  return (
    <Animated.View style={st} testID="perfect-label">
      <Text style={styles.perfectText}>{label}</Text>
    </Animated.View>
  );
}

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: colors.gameSky, overflow: "hidden" },
  artTiming: { position: "absolute", top: "25%", left: 16, right: 16, padding: 12, borderRadius: 12, backgroundColor: colors.gameSky },
  artTimingText: { color: colors.hudText, fontSize: 14, marginBottom: 8 },
  artLoadingText: { color: colors.hudText, fontSize: 18, padding: 12 },
  fill: absoluteFill(),
  touch: absoluteFill(),
  world: {
    ...absoluteFill(),
    transformOrigin: "0% 0%",
    pointerEvents: "none",
  },

  backgroundWash: {
    ...absoluteFill(),
    backgroundColor: colors.gameSky,
    opacity: 0.26,
  },
  brickImage: { width: "100%", height: "100%" },
  capShadow: { position: "absolute", top: CONFIG.capHeight, left: 0, right: 0, height: 4, backgroundColor: colors.platformShade, opacity: 0.5 },
  capHighlight: { position: "absolute", top: 2, left: 3, right: 3, height: 2, backgroundColor: colors.platformCenter },
  towerBrick: {
    position: "absolute",
    left: 3,
    right: 3,
    top: CONFIG.capHeight,
    bottom: 0,
  },

  tower: {
    position: "absolute",
    left: 0,
    top: 0,
    height: CONFIG.columnHeight,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: colors.platform,
    overflow: "hidden",
    pointerEvents: "none",
  },
  towerShade: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: "14%",
    backgroundColor: colors.platformShade,
    opacity: 0.28,
  },
  towerCap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: CONFIG.capHeight,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: colors.platformTop,
    borderWidth: 1.5,
    borderColor: colors.platformShade,
  },
  towerCenter: {
    position: "absolute",
    top: CONFIG.capHeight + 3,
    width: CONFIG.perfectTolerance * 2,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.platformCenter,
  },

  body: {
    position: "absolute", left: 0, top: 0,
    width: CHARACTER_WIDTH * 0.8, height: CHARACTER_HEIGHT * 0.8,
    transformOrigin: "50% 100%",
    pointerEvents: "none",
  },
  jacketImage: { position: "absolute", left: 0, width: CHARACTER_WIDTH * 0.8, top: -CHARACTER_HEIGHT * 0.8 * 17 / 1259, height: CHARACTER_HEIGHT * 0.8 * 1322 / 1259 },
  pantsClip: { position: "absolute", left: 0, right: 0, top: "65%", bottom: 0, overflow: "hidden" },
  pantsImage: { top: -CHARACTER_HEIGHT * 0.8 * (17 / 1259 + 0.65) },
  jacketHalf: { position: "absolute", top: 0, width: "50%", height: "70%", overflow: "hidden" },
  jacketLeft: { left: 0, transformOrigin: "0% 15%" },
  jacketRight: { right: 0, transformOrigin: "100% 15%" },
  jacketRightImage: { left: -CHARACTER_WIDTH * 0.4 },
  belly: { position: "absolute", left: "20%", top: "17%", width: "60%", height: "53%", borderRadius: 28, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.onSurface },
  bellyFold: { position: "absolute", left: "25%", right: "25%", bottom: "18%", height: 6, borderBottomWidth: 2, borderColor: colors.muted, borderRadius: 8 },
  puff: { position: "absolute", left: "15%", top: "31%", width: 65, height: 35, pointerEvents: "none" },
  puffCloud: { position: "absolute", width: 24, height: 24, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.muted },
  blob: {
    position: "absolute",
    left: 0,
    top: 0,
    width: CHARACTER_WIDTH,
    height: CHARACTER_HEIGHT,
    transformOrigin: "50% 100%",
    pointerEvents: "none",
  },
  characterImage: { width: "100%", height: "100%" },

  burst: { position: "absolute", left: 0, top: 0, width: 1, height: 1, pointerEvents: "none" },
  burstDot: {
    position: "absolute",
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.perfect,
  },

  hud: { position: "absolute", left: 0, right: 0, alignItems: "center", pointerEvents: "none" },
  scoreText: {
    fontSize: 56,
    fontWeight: "800",
    color: colors.hudText,
    letterSpacing: -1,
  },
  bestText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.muted,
    letterSpacing: 1,
    marginTop: -4,
  },

  hint: {
    position: "absolute",
    bottom: 70,
    left: 0,
    right: 0,
    alignItems: "center",
    pointerEvents: "none",
  },
  hintText: { fontSize: 14, fontWeight: "600", color: colors.muted },

  perfectWrap: {
    position: "absolute",
    top: "26%",
    left: 0,
    right: 0,
    alignItems: "center",
    pointerEvents: "none",
  },
  perfectText: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.perfect,
    letterSpacing: 1,
  },

  debug: {
    position: "absolute",
    right: 14,
    backgroundColor: "rgba(32,70,83,0.82)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 132,
    pointerEvents: "none",
  },
  debugText: {
    color: "#EAF6F4",
    fontSize: 12,
    fontVariant: ["tabular-nums"],
    lineHeight: 18,
  },

  overlay: {
    ...absoluteFill(),
    backgroundColor: "rgba(20,48,58,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "84%",
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: "center",
    ...Platform.select({
      web: { boxShadow: "0px 12px 24px rgba(0,0,0,0.15)" },
      default: {
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
        elevation: 8,
      },
    }),
  },
  gameOverTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.onSurface,
    marginBottom: 20,
  },
  finalBest: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.muted,
    marginTop: 4,
    marginBottom: 24,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.muted,
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 56,
    fontWeight: "800",
    color: colors.onSurface,
    marginTop: 2,
  },
  playBtn: {
    width: "100%",
    backgroundColor: colors.brandPrimary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  playBtnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  playBtnText: {
    color: colors.onBrandPrimary,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
}));
