import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CONFIG, DEBUG_MODE, PHASE } from "@/src/game/config";
import { makeStyles, useTheme } from "@/src/theme";
import { storage } from "@/src/utils/storage";

const BEST_SCORE_KEY = "jumpcharge.bestScore";
const PW = CONFIG.playerWidth;
const PH = CONFIG.playerHeight;
const POOL = 14; // fixed pool of platform views (only ~5 are visible at once)
const POOL_IDX = Array.from({ length: POOL }, (_, i) => i);

// tiny helper to avoid repeating absolute-fill spread
function absoluteFill() {
  return { position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0 };
}

function lerp(a: number, b: number, t: number) {
  "worklet";
  return a + (b - a) * t;
}

export default function Game() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles();
  const { width: W, height: H } = useWindowDimensions();

  // --- JS-side reactive state (events only, never per-frame) ---------------
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [perfectVisible, setPerfectVisible] = useState(false);
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
  const camX = useSharedValue(0);
  const camY = useSharedValue(0);
  const baseY = useSharedValue(0);
  const landPulse = useSharedValue(0);
  const platforms = useSharedValue<any[]>([]);
  const idCounter = useSharedValue(1);
  const lastLandedId = useSharedValue(0);
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
  // by the JS init and the UI-thread spawner, consuming one continuous seeded
  // stream so a given seed always reproduces the same tower sequence.
  // ------------------------------------------------------------------------
  const rand = () => {
    "worklet";
    let t = (rngState.value + 0x6d2b79f5) | 0;
    rngState.value = t;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const makeNextPlatform = (prev: any, id: number) => {
    "worklet";
    const t = Math.min(1, id / CONFIG.difficultyRamp); // 0 early -> 1 late
    // gap distance (grows with difficulty)
    const gMin = lerp(CONFIG.gapEarly.min, CONFIG.gapLate.min, t);
    const gMax = lerp(CONFIG.gapEarly.max, CONFIG.gapLate.max, t);
    const gap = gMin + rand() * (gMax - gMin);
    // height difference (grows with difficulty, always < max jump apex)
    const hv = lerp(CONFIG.heightVarEarly, CONFIG.heightVarLate, t);
    let topY = prev.topY + (rand() * 2 - 1) * hv;
    if (topY < CONFIG.platformMinTopY) topY = CONFIG.platformMinTopY;
    if (topY > CONFIG.platformMaxTopY) topY = CONFIG.platformMaxTopY;
    // width category: early favours WIDE/MEDIUM, late adds more NARROW
    let wWide = lerp(0.55, 0.2, t);
    const wMed = 0.4;
    let wNar = lerp(0.05, 0.42, t);
    if (id <= CONFIG.noNarrowBeforeId) wNar = 0; // forgiving start
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
    return { id, x: prev.x + prev.width + gap, topY, width, cat };
  };

  // ------------------------------------------------------------------------
  // (Re)initialise the world. A fresh seed is drawn unless one is supplied
  // (deterministic-seed hook for future shared-map modes). Snaps the camera
  // into place so restart is instant with no slide.
  // ------------------------------------------------------------------------
  const initWorld = useCallback((seed?: number) => {
    const s = CONFIG.cameraZoom;
    const viewW = W / s;
    const seedVal =
      (seed !== undefined
        ? seed
        : (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0) >>> 0;
    runSeed.value = seedVal;
    rngState.value = seedVal;

    const first = { id: 0, x: 0, topY: 0, width: 160, cat: 0 };
    const list: any[] = [first];

    px.value = first.x + first.width * 0.42;
    py.value = first.topY - PH / 2;
    vx.value = 0;
    vy.value = 0;
    charge.value = 0;
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
    idCounter.value = list.length;
    lastLandedId.value = 0;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [W, H]);

  useEffect(() => {
    initWorld();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------------------------------------
  // JS callbacks triggered from the worklet (rare, event-based).
  // ------------------------------------------------------------------------
  const onLanding = useCallback((perfect: number) => {
    const gained =
      CONFIG.scorePerLanding + (perfect ? CONFIG.scorePerfectBonus : 0);
    scoreRef.current += gained;
    setScore(scoreRef.current);
    if (perfect) {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
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
    setGameOver(false);
    setPerfectVisible(false);
    initWorld();
  }, [initWorld]);

  // ------------------------------------------------------------------------
  // Touch input — Pressable gives immediate touch-down / touch-up with
  // minimal latency. Only IDLE can start charging; release launches.
  // ------------------------------------------------------------------------
  const onPressIn = useCallback(() => {
    if (running.value !== 1) return;
    if (phase.value === PHASE.IDLE) {
      charge.value = 0;
      phase.value = PHASE.CHARGING;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPressOut = useCallback(() => {
    if (phase.value === PHASE.CHARGING) {
      const c = Math.min(1, Math.max(0, charge.value));
      vx.value = CONFIG.minJumpVX + c * (CONFIG.maxJumpVX - CONFIG.minJumpVX);
      vy.value = -(CONFIG.minJumpVY + c * (CONFIG.maxJumpVY - CONFIG.minJumpVY));
      phase.value = PHASE.AIRBORNE;
      charge.value = 0;
    }
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

    fps.value = fps.value * 0.9 + (1 / dt) * 0.1;
    const list = platforms.value;

    // --- charge ---
    if (phase.value === PHASE.CHARGING) {
      charge.value = Math.min(1, charge.value + dt / CONFIG.maxChargeDuration);
    }

    // --- airborne physics ---
    if (phase.value === PHASE.AIRBORNE) {
      const prevBottom = py.value + PH / 2;
      vy.value += CONFIG.gravity * dt;
      px.value += vx.value * dt;
      py.value += vy.value * dt;
      const newBottom = py.value + PH / 2;

      if (vy.value > 0) {
        for (let i = 0; i < list.length; i++) {
          const p = list[i];
          const cx = px.value;
          if (
            cx >= p.x - CONFIG.landingForgiveness &&
            cx <= p.x + p.width + CONFIG.landingForgiveness &&
            newBottom >= p.topY &&
            prevBottom <= p.topY + CONFIG.landingTopTolerance
          ) {
            // fair landing
            py.value = p.topY - PH / 2;
            vx.value = 0;
            vy.value = 0;
            baseY.value = p.topY;
            phase.value = PHASE.IDLE;
            landPulse.value = 1;
            landPulse.value = withTiming(0, {
              duration: CONFIG.landPulseDuration * 1000,
            });
            const offset = cx - (p.x + p.width / 2);
            lastOffset.value = offset;
            const perfect = Math.abs(offset) <= CONFIG.perfectTolerance ? 1 : 0;
            // Score only the first time we reach a new (higher id) platform.
            if (p.id > lastLandedId.value) {
              lastLandedId.value = p.id;
              if (perfect) {
                burstX.value = cx;
                burstY.value = p.topY;
                burst.value = 0;
                burst.value = withTiming(1, { duration: 620 });
              }
              runOnJS(onLanding)(perfect);
            }
            break;
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

    // Vertical: rest on the standing level; in flight blend toward the intended
    // landing tower so it stays revealed; follow the player down on death.
    let focusY = baseY.value;
    if (phase.value === PHASE.AIRBORNE && nx) focusY = (nx.topY + py.value) / 2;
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
  const blobStyle = useAnimatedStyle(() => {
    let sx = 1;
    let sy = 1;
    let shake = 0;
    if (phase.value === PHASE.CHARGING) {
      const c = charge.value;
      sy = 1 - CONFIG.chargeSquashY * c;
      sx = 1 + CONFIG.chargeStretchX * c;
      if (c > 0.9) {
        shake =
          Math.sin(Date.now() * 0.9) *
          CONFIG.maxChargeShake *
          ((c - 0.9) / 0.1);
      }
    } else if (phase.value === PHASE.AIRBORNE) {
      const s = Math.max(-1, Math.min(1, -vy.value / 1400));
      sy = 1 + CONFIG.airStretchY * Math.abs(s);
      sx = 1 - CONFIG.airStretchY * Math.abs(s) * 0.7;
    }
    const lp = landPulse.value;
    sy = sy * (1 - 0.3 * lp);
    sx = sx * (1 + 0.26 * lp);

    const screenLeft = px.value - PW / 2;
    const screenTop = py.value - PH / 2;
    const feetComp = ((1 - sy) * PH) / 2; // keep feet planted while squashing

    return {
      transform: [
        { translateX: screenLeft + shake },
        { translateY: screenTop + feetComp },
        { scaleX: sx },
        { scaleY: sy },
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

  // Parallax hill layers (decorative, follow camera at a fraction of speed)
  const hillFarStyle = useAnimatedStyle(() => {
    const p = 340;
    const off = -((((camX.value * 0.15) % p) + p) % p);
    return { transform: [{ translateX: off }] };
  });
  const hillNearStyle = useAnimatedStyle(() => {
    const p = 260;
    const off = -((((camX.value * 0.32) % p) + p) % p);
    return { transform: [{ translateX: off }] };
  });

  return (
    <View style={styles.root} testID="game-root">
      <StatusBar style="dark" />
      <LinearGradient
        colors={[colors.gameSky, colors.gameSkyFar]}
        style={styles.fill}
      />

      {/* Parallax background */}
      <Animated.View
        style={[styles.hillLayer, hillFarStyle]}
       
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <View key={`f${i}`} style={[styles.hillFar, { left: i * 340 }]} />
        ))}
      </Animated.View>
      <Animated.View
        style={[styles.hillLayer, hillNearStyle]}
       
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <View key={`n${i}`} style={[styles.hillNear, { left: i * 260 }]} />
        ))}
      </Animated.View>

      {/* Scaled world container — everything in world coords lives here */}
      <Animated.View style={[styles.world, worldStyle]}>
        {/* Platforms (fixed pool, positioned by the worklet) */}
        {POOL_IDX.map((i) => (
          <PlatformView
            key={i}
            index={i}
            platforms={platforms}
            styles={styles}
          />
        ))}

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

        {/* Blob */}
        <Animated.View style={[styles.blob, blobStyle]}>
          <View style={styles.blobHighlight} />
        </Animated.View>
      </Animated.View>

      {/* Full-screen touch layer */}
      <Pressable
        testID="charge-surface"
        style={styles.touch}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={gameOver}
      />

      {/* Score HUD */}
      <View style={[styles.hud, { top: insets.top + 10 }]}>
        <Text style={styles.scoreText} testID="score-value">
          {score}
        </Text>
        <Text style={styles.bestText} testID="best-value">
          BEST {best}
        </Text>
      </View>

      {/* Hint (only before first jump) */}
      {score === 0 && !gameOver && (
        <View style={styles.hint}>
          <Text style={styles.hintText}>Hold to charge · Release to jump</Text>
        </View>
      )}

      {/* PERFECT! popup */}
      {perfectVisible && (
        <View style={styles.perfectWrap}>
          <PerfectPop styles={styles} />
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
            <View style={styles.statRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>SCORE</Text>
                <Text style={styles.statValue} testID="final-score">
                  {score}
                </Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>BEST</Text>
                <Text style={styles.statValue} testID="final-best">
                  {best}
                </Text>
              </View>
            </View>
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
    </View>
  );
}

// ---------------------------------------------------------------------------
// A single pooled platform view. Reads its slot from the shared array every
// frame (camX changes each frame, re-evaluating this style).
// ---------------------------------------------------------------------------
function PlatformView({ index, platforms, styles }: any) {
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
      <View style={styles.towerShade} />
      <View style={styles.towerCap} />
      <Animated.View style={[styles.towerCenter, centerStyle]} />
    </Animated.View>
  );
}

// PERFECT! pop with a quick scale-in.
function PerfectPop({ styles }: any) {
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
      <Text style={styles.perfectText}>PERFECT!</Text>
    </Animated.View>
  );
}

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: colors.gameSky, overflow: "hidden" },
  fill: absoluteFill(),
  touch: absoluteFill(),
  world: {
    ...absoluteFill(),
    transformOrigin: "0% 0%",
    pointerEvents: "none",
  },

  hillLayer: { position: "absolute", left: 0, bottom: 0, height: 260, width: 340, pointerEvents: "none" },
  hillFar: {
    position: "absolute",
    bottom: -60,
    width: 300,
    height: 220,
    borderRadius: 150,
    backgroundColor: colors.hillFar,
  },
  hillNear: {
    position: "absolute",
    bottom: -80,
    width: 240,
    height: 200,
    borderRadius: 130,
    backgroundColor: colors.hillNear,
  },

  tower: {
    position: "absolute",
    left: 0,
    top: 0,
    height: CONFIG.columnHeight,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: colors.platform,
    overflow: "hidden",
    pointerEvents: "none",
  },
  towerShade: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: "32%",
    backgroundColor: colors.platformShade,
    opacity: 0.55,
  },
  towerCap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: CONFIG.capHeight,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: colors.platformTop,
  },
  towerCenter: {
    position: "absolute",
    top: CONFIG.capHeight + 3,
    width: CONFIG.perfectTolerance * 2,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.platformCenter,
  },

  blob: {
    position: "absolute",
    left: 0,
    top: 0,
    width: PW,
    height: PH,
    borderRadius: PW * 0.42,
    backgroundColor: colors.blob,
    borderBottomWidth: 3,
    borderBottomColor: colors.blobShade,
    pointerEvents: "none",
  },
  blobHighlight: {
    position: "absolute",
    top: PH * 0.2,
    left: PW * 0.22,
    width: PW * 0.24,
    height: PH * 0.18,
    borderRadius: PW * 0.12,
    backgroundColor: colors.blobFace,
    opacity: 0.85,
  },

  burst: { position: "absolute", left: 0, top: 0, width: 1, height: 1, pointerEvents: "none" },
  burstDot: {
    position: "absolute",
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.perfect,
  },

  hud: { position: "absolute", left: 20, alignItems: "flex-start", pointerEvents: "none" },
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
    width: "78%",
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
  statRow: { flexDirection: "row", gap: 16, marginBottom: 24 },
  statBox: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.surfaceTertiary,
    borderRadius: 16,
    paddingVertical: 14,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.muted,
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 30,
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
