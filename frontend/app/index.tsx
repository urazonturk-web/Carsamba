import { Image as CachedImage } from "expo-image";
import { Asset } from "expo-asset";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
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
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  withTiming,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AmbientBirds } from "../src/game/AmbientBirds";
import { ChargePoses } from "../src/game/ChargePoses";
import { CHARGE_POSES } from "../src/game/character-pose";
import { ANCHOR_SHIFT_PX, GLOBAL_VISUAL_SCALE, POSE_FEET_SPAN_PX } from "../src/game/character-pose";
import { GAME_OVER_LINE } from "../src/game/copy";
import { jumpVelocity, advanceFlight } from "../src/game/jump";
import { findFootLanding } from "../src/game/landing";
import { referencePlatform, referenceTowerWidth } from "../src/game/reference-course";
import { generateProceduralPlatform, mulberry32Step, classifyPlatformVisualType, ROOFTOP_ASSET_GEOMETRY, ROOFTOP_GROUND_Y, type PlatformVisualType } from "../src/game/procedural-course";
import { FIXED_PANEL_PLATFORMS, PANEL_SOURCES, PANEL_WORLD_WIDTH, PANEL_WORLD_HEIGHT, PANEL_FILL_STRIP_HEIGHT, PANEL_TOP_EDGE_SOURCES, PANEL_BOTTOM_EDGE_SOURCES, PANEL_SEAM_OVERLAP } from "../src/game/panel-course";
import { CONFIG, DEBUG_MODE, EXPERIMENTAL_COURSE, PHASE, REFERENCE_TRIAL } from "@/src/game/config";
import { makeStyles, useTheme } from "@/src/theme";
import { storage } from "@/src/utils/storage";

// Small shared texture travels with the JS bundle, avoiding a separate Metro image request.
const BRICK_SOURCE = require("@/assets/environment/brick-inline.json");

// GORSEL-014/OYUN_AKISI-001/002 (2026-09-22): real, artist-made rooftop-
// chimney pieces (magenta #FF00FF chroma-keyed to true alpha -- see
// outputs/gorsel-014-rooftop-platforms/rooftop-measured.json for the
// extraction method and per-asset numbers; edge_leak was 0 for all three,
// verified against a solid-colour test background, not just the source
// alpha channel). Each is a BOUNDED roof+chimney chunk (short/medium/long),
// not a long shaft -- no per-platform tiling/repeat, no procedural art, no
// separate "floating chimney" overlay disconnected from a roof base. Picked
// per platform from `p.cat` (0=wide,1=medium,2=narrow -- an EXISTING,
// already-generated field, not a new hash). Geometry (ROOFTOP_ASSET_GEOMETRY)
// now lives in procedural-course.ts, the SAME table `rootedTopY` uses to
// derive the platform's physical Y (see OYUN_AKISI-002 below) -- imported,
// not duplicated, so the visual cap and the physical landing surface can
// never drift apart.
const ROOFTOP_SOURCES = [
  require("@/assets/environment/rooftop-long-v1.png"),
  require("@/assets/environment/rooftop-medium-v1.png"),
  require("@/assets/environment/rooftop-short-v1.png"),
] as const;
const ROOFTOP_ASSET = ROOFTOP_ASSET_GEOMETRY;
// GORSEL-020 RooftopDistrict: ONE decorative, world-anchored, horizontally
// repeating (mirror-tiled, seamless) low-rooftop strip. Drawn in the world
// container (camera transform 1:1 with platforms, no parallax) AFTER the
// platform sprites, so each chimney's own roof/brick base is hidden inside
// the district and only the shaft + cap rise out of it. DISTRICT_TOP_Y is
// below every possible landing cap (rootedTopY max ~80.6) so no landing
// surface is ever covered. Never read by physics/collision/camera.
const DISTRICT_SOURCE = require("@/assets/environment/district/rooftop-district-v1.png");
const DISTRICT_IMG_W = 826;
const DISTRICT_IMG_H = 252;
const DISTRICT_SCALE = 1.9; // world units per source px
const DISTRICT_TILE_W = DISTRICT_IMG_W * DISTRICT_SCALE;
const DISTRICT_TILE_H = DISTRICT_IMG_H * DISTRICT_SCALE;
// REVIZYON-028: the roofline is a WORLD-space row (Y=92) again, exactly like the
// platforms: both live under the same worldStyle camera transform, so the
// visible cap/roof and the physical topY can never drift apart vertically.
// (REVIZYON-027 pinned it to a screen row that followed camY -> it stayed still
// while the platform layer slid.) It draws BEHIND the platform sprites so caps
// lower than the roofline (random topY up to +320) stay visible.
const DISTRICT_TOP_Y = 92;
// World Y the chimney bodies are rooted to (a constant, no camera term).
const DISTRICT_ROOT_Y = DISTRICT_TOP_Y + 40;

// GORSEL-016 / OYUN_AKISI-003 (2026-09-23, user-authorized): new approved
// master scene, replacing the GORSEL-014/015 istanbul-parallax-portrait-v1
// source entirely for this task ("eski arka planı bu turda kullanma"). Same
// pipeline shape as before (FAR = whole image cover-fit, slow parallax; a
// world-anchored near/ground layer below) but the source is now
// bosphorus-rooftop-day-master-v1.png (941x1672, same dimensions as the old
// master by coincidence, not by design) -- day scene, Bosphorus + Hagia
// Sophia/Galata skyline up top, a real painted foreground rooftop band
// (terracotta roofs, chimneys, a cat, laundry line) at the bottom, measured
// via row-average RGB: sea (blue, B>R) transitions to warm rooftop tones
// (R>B) starting row ~1298, fully warm by row ~1320.
const MASTER_NEIGHBORHOOD_SOURCE = require("@/assets/environment/bosphorus-rooftop-day-master-v1.png");
// REVIZYON-023: start decoding every first-scene bitmap at module load (before
// the component mounts) into expo-image's memory cache, so the live scene and
// the start cover mount from cache instead of decoding on first render.
const PRELOAD_MODULES: number[] = [
  MASTER_NEIGHBORHOOD_SOURCE, DISTRICT_SOURCE, ...ROOFTOP_SOURCES, ...CHARGE_POSES.map((p) => p.source),
];
(async () => {
  try {
    const assets = await Asset.loadAsync(PRELOAD_MODULES);
    const uris = assets.map((a) => a.localUri ?? a.uri).filter(Boolean) as string[];
    await CachedImage.prefetch(uris, { cachePolicy: "memory-disk" });
  } catch {}
})();

const BG_IMG_W = 941;
const BG_IMG_H = 1672;
const BG_FAR_OVERSCAN = 1.4;
const BG_FAR_PARALLAX_RATIO = 0.06;

// GORSEL-015 iPhone-reddi fix (2026-09-22), "GERÇEK ÇATI TABANI": every
// rooftop-chimney asset is rooted so its OWN rendered bottom edge sits at
// EXACTLY world Y = ROOFTOP_GROUND_Y (150), regardless of cat/width -- see
// rootedTopY's derivation in procedural-course.ts (topY = GROUND_Y -
// heightAboveGround, and the rendered image's bottom = topY +
// heightAboveGround = GROUND_Y, algebraically, for every asset). A ground
// band, placed as a CHILD of the world container (styles.world) so it rides
// the exact same camera transform as every platform, sized so its top edge
// sits comfortably above ROOFTOP_GROUND_Y (guaranteeing full overlap with
// every asset's base by construction, not by visual luck) and tall enough
// that even the highest camera pull-up (standing on a "long" tower) still
// keeps its top edge at or above 35% of screen height. This is a solid-color
// SAFETY layer (always covers the full camera range, unlike the single
// hero-art near image below, which is finite width) -- kept from GORSEL-015.
const ROOFTOP_BAND_TOP_Y = ROOFTOP_GROUND_Y - 800; // world Y, well above every asset's base
const ROOFTOP_BAND_BOTTOM_Y = ROOFTOP_GROUND_Y + 3000; // far below any visible frame
const ROOFTOP_BAND_MARGIN_X = 400; // world units of horizontal slack each side

// GORSEL-016, "Her baca kolonunu bu ana görselin ALT çatı bandına göm": the
// REAL painted rooftop crop of the new master, drawn on TOP of the solid
// safety band above, also world-anchored (child of styles.world, same
// transform as platforms) so it never drifts from camY. NEAR_IMG_CROP_TOP
// (1290) is the measured source row where the sea ends and the foreground
// roof band begins (a little before the R>B crossover at ~1298, so the soft
// blend edge is included rather than a hard seam). NEAR_IMG_ANCHOR_WORLD_Y
// is where that source row is placed in world space: ROOFTOP_GROUND_Y - 40,
// i.e. 40 world units (~25 screen px at cameraZoom 0.62) ABOVE the common
// ground line, so every chimney base (always exactly at world Y=150) sinks
// visibly INTO the rendered crop, comfortably past the "en az 2 görünür px"
// floor, without the seam sitting right at a chimney's own base line.
const NEAR_IMG_CROP_TOP = 1290;
const NEAR_IMG_WORLD_SCALE = 0.6; // world units per source px
const NEAR_IMG_ANCHOR_WORLD_Y = ROOFTOP_GROUND_Y - 40;
const NEAR_IMG_RENDERED_W = BG_IMG_W * NEAR_IMG_WORLD_SCALE;
const NEAR_IMG_RENDERED_H = (BG_IMG_H - NEAR_IMG_CROP_TOP) * NEAR_IMG_WORLD_SCALE;
const NEAR_IMG_START_X = -300; // world X of the first tile's left edge (a bit before the start tower)
const NEAR_IMG_TILE_COUNT = 8; // covers the "first screen + first 10 jumps" scope of this task

// GORSEL-012 (2026-09-22): the GORSEL-004A chimney-top.png overlay and the
// GORSEL-011/011B column/roof-island overlays are retired (see PlatformView
// below and AI_REVIEW.md for the reasoning) -- their asset files are left
// on disk, unbundled, per this project's "don't delete without approval"
// convention, but nothing in this file requires them any more.

// Preserve historical scores separately because the scoring rules changed.
const BEST_SCORE_KEY = REFERENCE_TRIAL ? "jumpcharge.bestScore.reference.v1" : "jumpcharge.bestScore";
// EXPERIMENTAL_COURSE (see src/game/config.ts) swaps the fixed, measured
// REFERENCE_COURSE for the procedural generator below, independent of
// REFERENCE_TRIAL's physics constants. Only this one flag decides which
// tower source is used -- everywhere else in this file keep using
// REFERENCE_TRIAL for physics/scoring exactly as before.
const USE_REFERENCE_COURSE = REFERENCE_TRIAL && !EXPERIMENTAL_COURSE;
// GORSEL-017 / OYUN_AKISI-004 (2026-09-23, user-authorized): this delivery
// replaces procedural generation with a FIXED, hand-measured sequence baked
// into 4 approved panel paintings (see src/game/panel-course.ts) -- "önce
// iPhone kabulü olmadan 100 atlayış sistemi kurma" explicitly asked NOT to
// build the infinite/procedural version yet. The old procedural/reference
// course code paths are left in place (not deleted) behind this flag so a
// future task can flip back or extend without re-deriving them.
//
// GORSEL-017 ROLLBACK-01 (2026-09-23, user-authorized emergency revert): a
// real iPhone video after HOTFIX-01 showed the panel integration itself
// still broken on-device (long gray loading area at start, vertical
// color-crush stripes, falling into decor with no readable target, instant
// 0-score game over) -- worse than the pre-GORSEL-017 baseline. Flipped
// back to false so the DEFAULT flow is the last known-good behavior (the
// procedural/reference course + old rooftop-chimney rendering, from before
// GORSEL-017). Nothing panel-related was deleted (assets, panel-course.ts,
// the render branches in this file, the edge-strip assets) -- only this one
// flag, so a future task can pick the panel work back up once the on-device
// visual/collision architecture is redesigned, without re-deriving any of
// it. Do NOT flip this back to true without new on-device evidence.
const USE_FIXED_PANEL_COURSE = false;
const PW = CONFIG.playerWidth;
const PH = CONFIG.playerHeight;
// Render size is independent of the existing collision dimensions.
const CHARACTER_WIDTH = PW * 2.16;

// GORSEL-006: temporary single-pose main character (approved side-profile
// sprite, 1024x1024 RGBA, facing right) replacing the old layered character
// render. VISUAL ONLY: the sprite is placed relative to the existing physics
// point (px, py) and never feeds back into physics. Sprite measurements
// (from the PNG's alpha > 128): both feet span x=244..492 (249px, center
// x=368) and the lowest opaque row is y=922 (its bottom edge = 923).
// Scale from the physics side, read-only: the sprite's feet are drawn exactly
// as wide as the sole span landing detection already uses (CONFIG.footSoles
// over CHARACTER_WIDTH*0.8), so the visible feet match what can land.
// Uniform scale only (no stretch): world units per sprite pixel.
const SOLE_BODY_WIDTH = CHARACTER_WIDTH * 0.8;
const SOLE_LEFT = CONFIG.footSoles[0][0];
const SOLE_RIGHT = CONFIG.footSoles[1][1];
const SOLE_CENTER_OFFSET = ((SOLE_LEFT + SOLE_RIGHT) / 2 - 0.5) * SOLE_BODY_WIDTH;
const SPRITE_SCALE = ((SOLE_RIGHT - SOLE_LEFT) * SOLE_BODY_WIDTH) / POSE_FEET_SPAN_PX;
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
  const [coverMounted, setCoverMounted] = useState(true);
  const coverOpacity = useSharedValue(1);
  const coverStyle = useAnimatedStyle(() => ({ opacity: coverOpacity.value }));
  const [gameReady, setGameReady] = useState(false);
  const [loadedArt, setLoadedArt] = useState<Record<string, boolean>>({});
  const [artError, setArtError] = useState(false);
  // Temporary device measurement: JS-observed native image events, not separate network/decode timings.
  const [artOrigin] = useState(() => performance.now());
  const [artTimings, setArtTimings] = useState({ starts: {} as Record<string, number>, ends: {} as Record<string, number> });
  const artClock = useRef({ origin: artOrigin, starts: {} as Record<string, number>, ends: {} as Record<string, number> });
  // 2026-09-22 (iPhone test rejection, item 4): was defaulting to visible,
  // so this dev-only debug box (already __DEV__-gated at render below) sat
  // on top of the charge area on every single launch, blocking the first
  // tap until "Kapat" was pressed -- that, not the asset loading itself,
  // was the "slow/dirty startup" the tester saw. It no longer auto-opens;
  // the underlying measurement still runs (markArtStarted/Loaded always
  // fire), it is just not shown unless something sets this true.
  const [showArtTiming, setShowArtTiming] = useState(false);
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
  const poseLoads = useRef(0); // all 9 R12 pose bitmaps must be decoded before the first live frame
  const failArt = useCallback(() => setArtError(true), []);
  const artReady = loadedArt.background && loadedArt.character && loadedArt.bricks;
  // REVIZYON-022 (2026-09-24): first playable frame waits for the three
  // visible layers (background, RooftopDistrict, character idle) so nothing
  // pops in late; an asset error releases the gate instead of soft-locking.
  const assetsReady = gameReady && ((loadedArt.background && loadedArt.district && loadedArt.character && loadedArt.rooftop && loadedArt.rooftop1 && loadedArt.rooftop2) || artError);

  useEffect(() => {
    if (assetsReady) coverOpacity.value = withTiming(0, { duration: 220 }, (done) => { if (done) runOnJS(setCoverMounted)(false); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetsReady]);

  const [perfectVisible, setPerfectVisible] = useState(false);
  const [landingLabel, setLandingLabel] = useState("PERFECT!");
  const [debug, setDebug] = useState({
    charge: 0, vx: 0, vy: 0, dist: 0, width: 0, offset: 0, fps: 0, p50: 0, p95: 0, dropped: 0,
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
  // __DEV__-only visual pose freeze (0/25/50/75/100 % screenshot QA), never
  // touches `charge` itself. Declared here (not next to poseCharge below)
  // so onPressIn/cancelCharge can force it back to "off" (-1) at the start
  // of every real charge -- see the 2026-09-22 device-rejection fix note at
  // those call sites: the on-screen dev buttons sit inside the tappable
  // play area and have no visual "armed" indicator, so an accidental tap
  // during normal play could freeze the pose on a crouch frame indefinitely
  // with no way for a player to know why. This guarantees any such freeze
  // cannot survive past the very next legitimate press.
  const poseOverride = useSharedValue(-1);
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
  const camVY = useSharedValue(0);
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
  // GORSEL-004A: whether the platform above is a "chimney" (visualType),
  // read directly from platform data at landing time -- this, not a bare id
  // hash, is what ColumnSmoke now gates on. standingPlatformId above is kept
  // only for the TEMP DEBUG panel display.
  const standingPlatformIsChimney = useSharedValue(false);
  const lastOffset = useSharedValue(0);
  const fps = useSharedValue(60);
  const dbgAcc = useSharedValue(0);
  // OYUN_AKISI-002 (2026-09-22, item C): real device-friendly frame-time
  // p50/p95 + a dropped-frame counter, __DEV__/DEBUG_MODE-only, default
  // OFF (DEBUG_MODE is false in production, see config.ts). A small fixed
  // ring buffer of the RAW (unclamped) per-frame duration -- the `dt` used
  // for physics below is clamped for stability, this is the true value, so
  // a real hitch still shows up here even though it never destabilises
  // gameplay. "Dropped" = a frame that took >25ms (>1.5x a 60Hz budget).
  const FRAME_HISTORY_LEN = 120;
  const frameTimes = useSharedValue<number[]>(new Array(120).fill(16.7));
  const frameTimeIdx = useSharedValue(0);
  const droppedFrames = useSharedValue(0);
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
    return { ...generated, width, visualType: classifyPlatformVisualType(id) };
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

      const first = USE_FIXED_PANEL_COURSE
        ? FIXED_PANEL_PLATFORMS[0]
        : (USE_REFERENCE_COURSE ? referencePlatform(0, W, CONFIG.cameraZoom) : null)
          // OYUN_AKISI-002 (2026-09-22): the starting tower is also rooted to
          // the shared rooftop ground (rootedTopY), not a hardcoded topY: 0 --
          // "Başlangıç platformu ortak çatı zeminine bağlansın."
          // GORSEL-015 iPhone-reddi fix (2026-09-22): was cat:0 (long/wide) --
          // "uzun varyantı başlangıçta kullanma". Switched to cat:1 (medium)
          // so the very first tower's cap sits at a moderate height instead of
          // the long asset's much taller one.
          ?? { id: 0, x: 0, topY: 0, width: CONFIG.widthWide.max, cat: 0, visualType: "normal" as PlatformVisualType };
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

      if (USE_FIXED_PANEL_COURSE) {
        // GORSEL-017: the entire course for this delivery IS this fixed
        // list -- no procedural spawn-ahead, no infinite generation.
        for (let i = 1; i < FIXED_PANEL_PLATFORMS.length; i++) list.push(FIXED_PANEL_PLATFORMS[i]);
      } else {
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
      }
      idCounter.value = list.length;
      lastLandedId.value = 0;
      standingPlatformId.value = first.id;
      standingPlatformIsChimney.value = first.visualType === "chimney";
      platforms.value = list;

      // OYUN_AKISI-002: snap camera to the START fraction (no initial
      // slide) -- distinct from cameraDeadZoneRight, which only governs the
      // ONGOING follow in the frame loop below.
      // GORSEL-017: clamped to >=0 in fixed-panel mode -- panel-01's own art
      // starts at world X=0, so a negative camX would reveal empty sky-only
      // space left of it (measured live: without the clamp this left an
      // 81px blank strip on a 390px screen before the panel began).
      const camXStart = px.value - (CONFIG.cameraStartFraction * W) / s;
      camX.value = USE_FIXED_PANEL_COURSE ? Math.max(0, camXStart) : camXStart;
      camY.value = baseY.value - (CONFIG.cameraPlayerAnchorY * H) / s;
      camVY.value = 0;
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
      // 2026-09-22 device-rejection fix (item C): unconditional, before the
      // early-return below -- guarantees ANY touch-down clears a stuck DEV
      // pose freeze (see the poseOverride declaration above), even one from
      // a no-op tap while not IDLE.
      poseOverride.value = -1;
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
      // Defense in depth alongside onPressIn above: also clear right at
      // launch, so the pose is guaranteed to track real charge/idle for the
      // jump that is about to play out, regardless of anything set earlier.
      poseOverride.value = -1;
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
      poseOverride.value = -1;
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

    if (DEBUG_MODE) {
      const rawMs = frame.timeSincePreviousFrame ?? 16.7;
      frameTimes.value[frameTimeIdx.value % FRAME_HISTORY_LEN] = rawMs;
      frameTimeIdx.value += 1;
      if (rawMs > 25) droppedFrames.value += 1;
    }

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
          standingPlatformIsChimney.value = p.visualType === "chimney";
          jacketOpen.value = withSpring(0, { damping: 19, stiffness: 220, mass: 0.7 });
          releasedCharge.value = 0;
          phase.value = PHASE.IDLE;
          // GORSEL-017 (2026-09-23): visual-only landing squash. landPulse
          // drives a cosmetic scaleY/scaleX on the character sprite ONLY
          // (see ChargePoses.tsx) -- py.value/vx/vy, the resolved landing
          // point (cx/p.topY above) and the next jump's distance are all
          // already fully committed by this point in the frame, so this
          // cannot feed back into physics. 1 = max compression, negative =
          // the "hafif yukarı toparlanma" (slight upward overshoot) before
          // settling back to 0. Total duration 35+75+80=190ms, inside the
          // requested 150-200ms window.
          landPulse.value = withSequence(
            withTiming(1, { duration: 35 }),
            withTiming(-0.2, { duration: 75 }),
            withTiming(0, { duration: 80 }),
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
    // GORSEL-017: fixed panel course has no procedural continuation -- the
    // list built in initWorld IS the whole course, so this spawn-ahead
    // block is skipped entirely (no infinite generation past panel-04).
    if (!USE_FIXED_PANEL_COURSE && last && last.x + last.width < camX.value + viewW + CONFIG.spawnAhead) {
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

    // --- camera: dead-zone follow (OYUN_AKISI-002, 2026-09-22) --------------
    // Player is free anywhere left of cameraDeadZoneRight -- camera target
    // simply STAYS at camX.value there (no reaction at all, a true
    // corridor). Only once the player's own screen fraction would exceed
    // that threshold does the target move forward, by exactly enough to
    // hold the player AT the threshold; camX then eases toward that target
    // every frame (never an instant jump, never platform-pool-dependent --
    // no per-frame scan of `platforms` here any more).
    const deadZoneX = px.value - (CONFIG.cameraDeadZoneRight * W) / s;
    const ctx = Math.max(camX.value, deadZoneX);
    camX.value += (ctx - camX.value) * CONFIG.cameraSmoothingX;

    // GORSEL-015 iPhone-reddi fix (2026-09-22): vertical follow target must
    // track the CURRENT standing platform (baseY, updated on every landing
    // a few lines above), not a fixed world-Y-zero. The old `let focusY = 0`
    // ignored baseY entirely, so camY drifted toward a platform-height-
    // independent reference every frame -- on a tall/long first chimney
    // (very negative topY) this pushed the character near the top of the
    // screen and left the next target below/off the visible area.
    let focusY = baseY.value;
    if (phase.value === PHASE.DEAD) focusY = py.value;
    const tY = focusY - (CONFIG.cameraPlayerAnchorY * H) / s;
    if (phase.value === PHASE.DEAD) {
      camY.value += (tY - camY.value) * CONFIG.cameraFallSmoothing;
      camVY.value = 0;
    } else {
      // REVIZYON-022: critically damped follow (same tY target as before) --
      // zero start velocity so low<->high chimney transitions ease in, no
      // overshoot (clamped below), settles in roughly the old ~0.2s.
      const omega = 2 / CONFIG.cameraSmoothTimeY;
      const x = omega * dt;
      const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
      const change = camY.value - tY;
      const temp = (camVY.value + omega * change) * dt;
      camVY.value = (camVY.value - omega * temp) * decay;
      let out = tY + (change + temp) * decay;
      if ((camY.value - tY > 0) !== (out - tY > 0) && camY.value !== tY) { out = tY; camVY.value = 0; }
      camY.value = out;
    }

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
        const sortedFrames = frameTimes.value.slice().sort((a, b) => a - b);
        const p50 = sortedFrames[Math.floor(sortedFrames.length * 0.5)];
        const p95 = sortedFrames[Math.floor(sortedFrames.length * 0.95)];
        runOnJS(pushDebug)({
          charge: Math.round(charge.value * 100),
          vx: Math.round(vx.value),
          vy: Math.round(vy.value),
          dist: Math.round(dist),
          width: Math.round(pw),
          offset: Math.round(lastOffset.value),
          fps: Math.round(fps.value),
          p50: Math.round(p50 * 10) / 10,
          p95: Math.round(p95 * 10) / 10,
          dropped: droppedFrames.value,
        });
      }
    }
  }, true);

  // ------------------------------------------------------------------------
  // GORSEL-006 sprite placement (visual only). The sprite's own feet-bottom
  // row is put on py + PH/2 -- the same physical feet line the old render and
  // landing detection use (py = topY - PH/2 at rest, so feet == topY) -- and
  // the feet's horizontal center on the physical sole-span center. Pure
  // translation, no scale/skew/rotate: proportions never change.
  // ------------------------------------------------------------------------
  // Pose driver: the RAW charge.value (decision 2026-09-21, no platform
  // compensation). poseOverride (declared above, near `charge`) >= 0 is a
  // __DEV__-only visual freeze; it never touches `charge`.
  const poseCharge = useDerivedValue(() => (poseOverride.value >= 0 ? poseOverride.value : charge.value));

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

  // GORSEL-016 (2026-09-23, user-authorized): column smoke fully disabled
  // this turn -- "Dumanı tamamen devre dışı bırak: render/emitter/debug
  // görünmesin." The clock hook (which drove the emitter), the always-on
  // TEMP DEBUG mount-probe/reaction, and the smoke-debug panel JSX below are
  // all removed so nothing renders, emits, or ticks. ColumnSmoke.tsx itself
  // is left in place (not deleted) so the effect can be re-enabled later
  // without re-deriving it from scratch.

  // OYUN_AKISI-002: FAR layer -- whole image, plain cover (+ overscan for
  // slide room), slow parallax. Same clamp-not-tile technique as before.
  const bgFarStyle = useAnimatedStyle(() => {
    const scale = Math.max(W / BG_IMG_W, H / BG_IMG_H) * BG_FAR_OVERSCAN;
    const renderedW = BG_IMG_W * scale;
    const renderedH = BG_IMG_H * scale;
    const maxShiftX = Math.max(0, (renderedW - W) / 2);
    const desired = -camX.value * CONFIG.cameraZoom * BG_FAR_PARALLAX_RATIO;
    const shiftX = Math.min(maxShiftX, Math.max(-maxShiftX, desired));
    return {
      width: renderedW,
      height: renderedH,
      transform: [
        { translateX: (W - renderedW) / 2 + shiftX },
        { translateY: (H - renderedH) / 2 },
      ],
    };
  });
  // GORSEL-015 iPhone-reddi fix (2026-09-22): replaces the old screen-space
  // "near" box (see ROOFTOP_BAND_* comment above for why that was the root
  // cause of floating chimney bases). This is a WORLD-space rect -- a child
  // of the world container, so it only needs left/width recomputed per
  // frame (to keep covering the viewport as camX moves); top/height are
  // fixed world constants and need no transform at all.
  const groundBandStyle = useAnimatedStyle(() => {
    const viewWWorld = W / CONFIG.cameraZoom;
    return {
      left: camX.value - ROOFTOP_BAND_MARGIN_X,
      width: viewWWorld + ROOFTOP_BAND_MARGIN_X * 2,
    };
  });

  // GORSEL-016 near-image tiles: this crop represents the SAME ground plane
  // the chimneys are rooted in (not a distant layer), so it gets NO parallax
  // -- a fixed world position, exactly like the platforms themselves. A
  // handful of side-by-side tiles (not animated, not shared-value-driven)
  // is enough to cover the "first screen + first 10 jumps" scope this task
  // is limited to (see GORSEL-016 note in AI_REVIEW.md); a repeat seam in a
  // rooftop texture reads as tiling, not as a broken layer, and the solid
  // groundBandStyle gradient behind it still guarantees full coverage
  // wherever a tile doesn't reach.

  // World camera: maps world coords -> screen as (world - cam) * zoom, with a
  // top-left transform origin (see styles.world). This keeps the player in the
  // left band while the zoom reveals the upcoming route on the right.
  const districtStyle0 = useAnimatedStyle(() => {
    const base = Math.floor(camX.value / DISTRICT_TILE_W);
    return { transform: [{ translateX: base * DISTRICT_TILE_W }, { translateY: DISTRICT_TOP_Y }] };
  });
  const districtStyle1 = useAnimatedStyle(() => {
    const base = Math.floor(camX.value / DISTRICT_TILE_W) + 1;
    // 1.5 world-unit overlap: hides the sub-pixel hairline (edge columns of mirrored tiles are identical)
    return { transform: [{ translateX: base * DISTRICT_TILE_W - 1.5 }, { translateY: DISTRICT_TOP_Y }] };
  });
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

      {/* OYUN_AKISI-002 (2026-09-22): FAR layer (whole image, slow parallax,
          sky + distant skyline) -- see bgFarStyle above. Retired for
          USE_FIXED_PANEL_COURSE: each of the 4 panel paintings already IS a
          full scene (sky/sea/skyline + foreground rooftops in one image), so
          there is no separate far/near split to draw -- see the panel
          rendering inside the world container below. */}
      {!USE_FIXED_PANEL_COURSE && (
        <Animated.View style={[{ position: "absolute", left: 0, top: 0 }, bgFarStyle]} pointerEvents="none">
          <CachedImage cachePolicy="memory-disk" priority="high" transition={0}
            source={MASTER_NEIGHBORHOOD_SOURCE}
            onLoadStart={() => markArtStarted("background")}
            onLoad={() => markArtLoaded("background")}
            onError={failArt}
            style={{ width: "100%", height: "100%" }}
            contentFit="fill"
          />
        </Animated.View>
      )}
      <View style={styles.backgroundWash} pointerEvents="none" />
      <AmbientBirds width={W} height={H} />

      {gameReady && (
        <>
          {/* Scaled world container — everything in world coords lives here */}
          <Animated.View style={[styles.world, worldStyle]}>
        {/* GORSEL-015/016 ground band + near-image tiles: DISABLED as of
            ACIL KURTARMA-02 (2026-09-23). Real iPhone evidence
            (ScreenRecording_09-23-2026 14-09-05) showed a huge flat brown
            dead zone covering most of the screen for the first ~20s, with
            the Istanbul/Bosphorus silhouette never appearing and roofs only
            visible in a thin strip near the bottom. Root cause (traced by
            reading the actual render tree, not guessed): the ground band's
            top edge (ROOFTOP_BAND_TOP_Y = ROOFTOP_GROUND_Y-800) sits at
            world Y=-650, which -- at the starting platform's baseY -- maps
            to only ~19% down the screen; everything below that is either
            solid brown (groundBandStyle) or the near-image tiles (which
            only cover a further 229 of the band's 3800 world-unit height,
            leaving most of the band exposed as flat color) painted OVER
            the single bgFarStyle skyline layer underneath (world-container
            children paint after/above the screen-space far layer). This
            band was tuned during GORSEL-015 against a different course/
            camera state and was never re-verified with a full screenshot
            pass after GORSEL-016 swapped in the new master image (that
            verification was interrupted by the GORSEL-017 request) -- so
            this bug predates GORSEL-017 and rolling back USE_FIXED_PANEL_
            COURSE alone could never have fixed it. Per this task's explicit
            "tek hafif arka plan katmanı" requirement, both layers are
            switched off entirely (not deleted -- kept for a future,
            properly-verified re-introduction) rather than re-tuned under
            time pressure; bgFarStyle below is now the ONLY background
            layer, and the rooftop-chimney sprites already carry their own
            base/roof texture in the asset art, so removing this band does
            not leave platforms looking undrawn. */}
        {false && (
          <>
            <Animated.View
              style={[
                { position: "absolute", top: ROOFTOP_BAND_TOP_Y, height: ROOFTOP_BAND_BOTTOM_Y - ROOFTOP_BAND_TOP_Y, overflow: "hidden" },
                groundBandStyle,
              ]}
              pointerEvents="none"
            >
              <LinearGradient
                colors={[colors.platform, colors.platformShade]}
                style={{ width: "100%", height: "100%" }}
              />
            </Animated.View>
            {Array.from({ length: NEAR_IMG_TILE_COUNT }).map((_, i) => (
              <View
                key={`near-tile-${i}`}
                style={{
                  position: "absolute",
                  left: NEAR_IMG_START_X + i * NEAR_IMG_RENDERED_W,
                  top: NEAR_IMG_ANCHOR_WORLD_Y,
                  width: NEAR_IMG_RENDERED_W,
                  height: NEAR_IMG_RENDERED_H,
                  overflow: "hidden",
                }}
                pointerEvents="none"
              >
                <CachedImage
                  cachePolicy="memory-disk"
                  priority="high"
                  transition={0}
                  source={MASTER_NEIGHBORHOOD_SOURCE}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: -NEAR_IMG_CROP_TOP * NEAR_IMG_WORLD_SCALE,
                    width: BG_IMG_W * NEAR_IMG_WORLD_SCALE,
                    height: BG_IMG_H * NEAR_IMG_WORLD_SCALE,
                  }}
                  contentFit="fill"
                />
              </View>
            ))}
          </>
        )}
        {/* GORSEL-017: the 4 approved panel paintings themselves, each one
            a full scene (sky/sea/skyline + its own painted rooftop/chimney
            foreground). Static in world space -- world X = panelIndex *
            PANEL_WORLD_WIDTH, laid out edge-to-edge, no parallax (this IS
            the world, same as the platforms standing in it, not a distant
            depth layer). Panel-course.ts's FIXED_PANEL_PLATFORMS were
            measured directly against these same images/scale, so every
            (invisible) collision box lines up with its own painted chimney
            cap by construction. */}
        {USE_FIXED_PANEL_COURSE && PANEL_SOURCES.map((src, i) => (
          <Fragment key={`panel-${i}`}>
            {/* GORSEL-017 HOTFIX-01: seamless edge-sampled fill above/below
                this panel, replacing the old flat-color strip (see the
                PANEL_FILL_STRIP_HEIGHT comment in panel-course.ts for why a
                fill exists at all). Each strip is the panel's own real last
                24 rows, stretched -- vertically FLIPPED so the row
                immediately adjacent to the true panel edge (the exact-match
                pixels) sits right at the seam, with the coarser, stretched
                rows extending outward where precision matters less. */}
            <View
              pointerEvents="none"
              style={{
                position: "absolute", left: 0, top: 0,
                width: PANEL_WORLD_WIDTH, height: PANEL_FILL_STRIP_HEIGHT,
                overflow: "hidden",
                transform: [{ translateX: i * PANEL_WORLD_WIDTH }, { translateY: -PANEL_FILL_STRIP_HEIGHT }],
              }}
            >
              <Image
                source={PANEL_TOP_EDGE_SOURCES[i]}
                style={{ width: "100%", height: "100%", transform: [{ scaleY: -1 }] }}
                resizeMode="stretch"
              />
            </View>
            <View
              pointerEvents="none"
              style={{
                position: "absolute", left: 0, top: 0,
                width: PANEL_WORLD_WIDTH, height: PANEL_FILL_STRIP_HEIGHT,
                overflow: "hidden",
                transform: [{ translateX: i * PANEL_WORLD_WIDTH }, { translateY: PANEL_WORLD_HEIGHT }],
              }}
            >
              <Image
                source={PANEL_BOTTOM_EDGE_SOURCES[i]}
                style={{ width: "100%", height: "100%", transform: [{ scaleY: -1 }] }}
                resizeMode="stretch"
              />
            </View>
            <View
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                // GORSEL-017 HOTFIX-01: rendered PANEL_SEAM_OVERLAP world
                // units WIDER than the panel's own step (PANEL_WORLD_WIDTH)
                // -- the user's real-device screenshot showed a thin
                // vertical line at every panel-to-panel boundary, which is
                // sub-pixel rounding (771.62 is not an integer device px at
                // any common scale) leaving the root background peeking
                // through for a hairline. Overlapping the NEXT panel's own
                // left edge by a couple world units (a fraction of a source
                // pixel once scaled back down) closes that gap; it only
                // ever covers the next panel's own leftmost sliver of sky,
                // never a chimney (none sit within a couple world units of
                // x=0 in any panel).
                width: PANEL_WORLD_WIDTH + PANEL_SEAM_OVERLAP,
                height: PANEL_WORLD_HEIGHT,
                // `transform`, not `left`, for the per-panel X offset: on
                // react-native-web, position:absolute children laid out with
                // `left`/`top` still expand an ancestor's scrollable content
                // box (unlike native RN), which was blowing the whole
                // 390x844 game root out to ~2258 world units wide and
                // squashing the actual viewport. `transform` is purely
                // visual and doesn't affect layout/scroll size, same reason
                // every other world-space element here (PlatformView, the
                // character) already positions itself this way.
                transform: [{ translateX: i * PANEL_WORLD_WIDTH }],
              }}
              pointerEvents="none"
            >
              <CachedImage
                cachePolicy="memory-disk"
                priority="high"
                transition={0}
                source={src}
                onLoadStart={i === 0 ? () => markArtStarted("background") : undefined}
                onLoad={i === 0 ? () => markArtLoaded("background") : undefined}
                onError={i === 0 ? failArt : undefined}
                style={{ width: "100%", height: "100%" }}
                contentFit="fill"
              />
            </View>
          </Fragment>
        ))}
        {/* GORSEL-020 RooftopDistrict (see DISTRICT_* consts): BEHIND the
            platform sprites (REVIZYON-027), under the character. */}
        {[districtStyle0, districtStyle1].map((st, k) => (
          <Animated.View key={`district-${k}`} pointerEvents="none"
            style={[{ position: "absolute", left: 0, top: 0, width: DISTRICT_TILE_W, height: DISTRICT_TILE_H }, st]}>
            <Image source={DISTRICT_SOURCE} style={{ width: "100%", height: "100%" }} resizeMode="stretch"
              onLoad={k === 0 ? () => markArtLoaded("district") : undefined} onError={k === 0 ? failArt : undefined} />
          </Animated.View>
        ))}

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

        {/* GORSEL-006: temporary single-pose character (same sprite for idle/
            charge/jump/fall/landing until the 5-pose set exists). Drawn after
            the platforms and the back smoke layer, before the front smoke
            layer -- same z-order slot the old layered character had. The old
            layered character (jacket halves, belly, puff, pants, head) is no
            longer part of the render tree. */}
        <ChargePoses
          px={px}
          py={py}
          poseCharge={poseCharge}
          scale={SPRITE_SCALE * GLOBAL_VISUAL_SCALE}
          feetCenterOffset={SOLE_CENTER_OFFSET + ANCHOR_SHIFT_PX * SPRITE_SCALE}
          feetHalf={PH / 2}
          // GORSEL-017 ROLLBACK-01 (2026-09-23): landing squash disabled --
          // "önce temel oyun güvenilir olsun". Not passing landPulse makes
          // ChargePoses treat pulse as 0 always (see its optional-prop
          // default), so this is a no-op rather than deleting the feature;
          // the withSequence trigger in the landing-contact block still
          // sets landPulse.value, it's just never read by anything now.
          onLoadStart={() => markArtStarted("character")}
          onLoad={() => { poseLoads.current += 1; if (poseLoads.current >= CHARGE_POSES.length) markArtLoaded("character"); }}
          onError={failArt}
        />

      </Animated.View>

      {/* REVIZYON-022: opaque asset-ready cover; blocks the first frame (and
          input, see charge-surface) until background/district/character loaded. */}
      {coverMounted && (
        <Animated.View testID="asset-ready-cover" pointerEvents={assetsReady ? "none" : "auto"} style={[{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, backgroundColor: "#4f9ec4", overflow: "hidden" }, coverStyle]}>
          <StartCover W={W} H={H} />
        </Animated.View>
      )}

      {/* Full-screen touch layer */}
      <View
        testID="charge-surface"
        style={styles.touch}
        onStartShouldSetResponder={() => !gameOver && assetsReady}
        onResponderGrant={onPressIn}
        onResponderRelease={onPressOut}
        onResponderTerminate={cancelCharge}
      />

      {/* Score HUD */}
      {!gameOver && assetsReady && <View style={[styles.hud, { top: insets.top + 24 }]}>
        <Text style={styles.scoreText} testID="score-value">
          {score}
        </Text>
        <Text style={styles.bestText} testID="best-value">
          BEST {best}
        </Text>
      </View>}

      {/* GORSEL-017 HOTFIX-01 (2026-09-23): was gated on __DEV__ alone, which
          is true in every dev-client/Expo-Go build (including on a real
          iPhone) -- so this telemetry line rendered on-device regardless of
          DEBUG_MODE. Now requires DEBUG_MODE too, matching every other
          debug surface in this file. */}
      {DEBUG_MODE && __DEV__ && lastJump && (
        <View pointerEvents="none" style={{ position: "absolute", top: insets.top + 116, alignSelf: "center", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.85)" }}>
          <Text style={{ color: "#26383b", fontSize: 12 }}>Son basış: {lastJump.ms} ms · Güç: %{lastJump.percent} · Görsel: %{lastJump.visualPercent} · İlk kare: {lastJump.pressToFirstFrameMs}ms</Text>
        </View>
      )}

      {/* Hint (only before first jump) */}
      {score === 0 && !gameOver && assetsReady && (
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
          <Text style={styles.debugText}>frame p50/p95 {debug.p50}/{debug.p95}ms</Text>
          <Text style={styles.debugText}>dropped {debug.dropped}</Text>
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
            <Text style={styles.gameOverLine} testID="game-over-line">
              {GAME_OVER_LINE}
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
      {DEBUG_MODE && __DEV__ && showArtTiming && (
        <View style={styles.artTiming}>
          <Text style={styles.artLoadingText}>Görsel yükleme ölçümü</Text>
          <Text style={styles.artTimingText}>Başlangıç → hazır / yükleme olayı süresi</Text>
          {([["background", "Manzara"], ["bricks", "Tuğla"], ["character", "Karakter"]] as const).map(([id, label]) => {
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
      {/* GORSEL-016: the old always-on smoke mount-probe/debug panel (magenta
          dot + "[smoke-debug]" text, previously rendered unconditionally
          under __DEV__ regardless of DEBUG_MODE) is removed along with the
          smoke effect itself. The pose dev-freeze buttons are unrelated to
          smoke and stay, but now also require DEBUG_MODE -- GORSEL-017
          HOTFIX-01 (2026-09-23): the user's real-iPhone screenshot showed
          these charge-percent boxes rendering in the top-right corner on
          device, because __DEV__ alone is true in any dev-client/Expo-Go
          build, DEBUG_MODE or not. */}
      {DEBUG_MODE && __DEV__ && (
        <View style={styles.poseDevRow}>
          {[0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1, -1].map(v => (
            <Pressable key={v} onPress={() => { poseOverride.value = v; }} style={styles.poseDevBtn}>
              <Text style={styles.artTimingText}>{v < 0 ? "OFF" : String(v * 100)}</Text>
            </Pressable>
          ))}
        </View>
      )}

    </View>
  );
}

// ---------------------------------------------------------------------------
// A single pooled platform view. Reads its slot from the shared array every
// time the shared platform array changes.
// ---------------------------------------------------------------------------
// REVIZYON-023: static, blurred preview of the very first frame (Bosphorus
// skyline + sea + connected rooftop district), laid out exactly like the live
// start camera, shown while the live layers finish loading. Same sources as
// the live scene (already preloaded/cached), no character, no input.
function StartCover({ W, H }: { W: number; H: number }) {
  const s = CONFIG.cameraZoom;
  const camX0 = CONFIG.widthWide.max / 2 - (CONFIG.cameraStartFraction * W) / s;
  const bgScale = Math.max(W / BG_IMG_W, H / BG_IMG_H) * BG_FAR_OVERSCAN;
  const bgW = BG_IMG_W * bgScale;
  const bgH = BG_IMG_H * bgScale;
  const maxShift = Math.max(0, (bgW - W) / 2);
  const shift = Math.min(maxShift, Math.max(-maxShift, -camX0 * s * BG_FAR_PARALLAX_RATIO));
  const base = Math.floor(camX0 / DISTRICT_TILE_W);
  const top = (DISTRICT_TOP_Y + (CONFIG.cameraPlayerAnchorY * H) / s) * s;
  return (
    <>
      <CachedImage source={MASTER_NEIGHBORHOOD_SOURCE} cachePolicy="memory-disk" priority="high" transition={0} blurRadius={6}
        contentFit="fill" style={{ position: "absolute", left: (W - bgW) / 2 + shift, top: (H - bgH) / 2, width: bgW, height: bgH }} />
      {[0, 1].map((k) => (
        <CachedImage key={k} source={DISTRICT_SOURCE} cachePolicy="memory-disk" priority="high" transition={0} blurRadius={4}
          contentFit="fill" style={{ position: "absolute", left: ((base + k) * DISTRICT_TILE_W - (k ? 1.5 : 0) - camX0) * s, top, width: DISTRICT_TILE_W * s, height: DISTRICT_TILE_H * s }} />
      ))}
    </>
  );
}

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
  // GORSEL-012 (2026-09-22): every per-platform decorative sprite (the
  // GORSEL-004A chimney-top.png overlay AND the GORSEL-011/011B column /
  // roof-island overlays) is retired here -- see AI_REVIEW.md for the
  // reasoning. `visualType` ("chimney"/"normal") is untouched in the data
  // (procedural-course.ts is not part of THAT change) even though both
  // render identically now.
  // GORSEL-014/OYUN_AKISI-001 (2026-09-22): a bounded rooftop-chimney piece
  // is now drawn per platform (see ROOFTOP_SOURCES/ROOFTOP_ASSET above),
  // picked by the platform's own `cat` (0/1/2 = wide/medium/narrow), scaled
  // by capWidthPx (its flat stone cap's own width) so `scale = p.width /
  // capWidthPx` and centred; cap top row (capTopPx) lands exactly on
  // p.topY, the SAME physical landing surface as before -- identical
  // alignment formula to every earlier per-platform overlay round.
  const rooftopStyle0 = useAnimatedStyle(() => {
    const p = platforms.value[index];
    if (!p || p.cat !== 0) return { opacity: 0, transform: [{ translateX: -99999 }, { translateY: -99999 }] };
    const asset = ROOFTOP_ASSET[0];
    const scale = p.width / asset.capWidthPx;
    const renderedWidth = asset.w * scale;
    return {
      opacity: 1,
      width: renderedWidth,
      height: Math.max(asset.h * scale, Math.min(asset.h * scale * 2.2, DISTRICT_ROOT_Y - (p.topY - asset.capTopPx * scale))),
      transform: [
        { translateX: p.x + (p.width - renderedWidth) / 2 },
        { translateY: p.topY - asset.capTopPx * scale },
      ],
    };
  });
  const rooftopStyle1 = useAnimatedStyle(() => {
    const p = platforms.value[index];
    if (!p || p.cat !== 1) return { opacity: 0, transform: [{ translateX: -99999 }, { translateY: -99999 }] };
    const asset = ROOFTOP_ASSET[1];
    const scale = p.width / asset.capWidthPx;
    const renderedWidth = asset.w * scale;
    return {
      opacity: 1,
      width: renderedWidth,
      height: Math.max(asset.h * scale, Math.min(asset.h * scale * 2.2, DISTRICT_ROOT_Y - (p.topY - asset.capTopPx * scale))),
      transform: [
        { translateX: p.x + (p.width - renderedWidth) / 2 },
        { translateY: p.topY - asset.capTopPx * scale },
      ],
    };
  });
  const rooftopStyle2 = useAnimatedStyle(() => {
    const p = platforms.value[index];
    if (!p || p.cat !== 2) return { opacity: 0, transform: [{ translateX: -99999 }, { translateY: -99999 }] };
    const asset = ROOFTOP_ASSET[2];
    const scale = p.width / asset.capWidthPx;
    const renderedWidth = asset.w * scale;
    return {
      opacity: 1,
      width: renderedWidth,
      height: Math.max(asset.h * scale, Math.min(asset.h * scale * 2.2, DISTRICT_ROOT_Y - (p.topY - asset.capTopPx * scale))),
      transform: [
        { translateX: p.x + (p.width - renderedWidth) / 2 },
        { translateY: p.topY - asset.capTopPx * scale },
      ],
    };
  });
  return (
    <>
      <Animated.View style={[styles.tower, style]}>
        {/* GORSEL-012: raster brick tile permanently hidden (see
            `towerBrick`'s own style, opacity 0) -- the flat colour accents
            below it (shade/cap/highlight) are NOT a repeating texture and
            stay visible on every platform, unconditionally, giving the
            simple capped-column look the background now sits behind. */}
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
      {/* GORSEL-014/OYUN_AKISI-001: the real rooftop-chimney piece, drawn as
          a SIBLING of `tower` (not a child) -- `tower` has overflow:"hidden"
          for its own rounded corners, and this art is taller than the cap,
          so as a child it would have been clipped, same reasoning as every
          earlier per-platform overlay in this file.
          GORSEL-017 (2026-09-23): retired for USE_FIXED_PANEL_COURSE -- every
          chimney is now painted directly into the panel background art
          itself (panel-course.ts), so drawing a separate sprite on top would
          be exactly the "ayrı render edilen ... kolon" the task explicitly
          forbids. Platform collision boxes stay fully invisible in this
          mode (only styles.towerCenter's perfect-zone hint stripe shows). */}
      {!USE_FIXED_PANEL_COURSE && (
        <>
          <Animated.View style={[styles.rooftopImage, rooftopStyle0]} pointerEvents="none">
            <Image source={ROOFTOP_SOURCES[0]} style={styles.rooftopImageFill} resizeMode="stretch"
              onLoadStart={index === 0 ? () => onArtStart("rooftop") : undefined}
              onLoad={index === 0 ? () => onArtLoad("rooftop") : undefined}
              onError={index === 0 ? onArtError : undefined}
            />
          </Animated.View>
          <Animated.View style={[styles.rooftopImage, rooftopStyle1]} pointerEvents="none">
            <Image source={ROOFTOP_SOURCES[1]} style={styles.rooftopImageFill} resizeMode="stretch"
              onLoad={index === 0 ? () => onArtLoad("rooftop1") : undefined} />
          </Animated.View>
          <Animated.View style={[styles.rooftopImage, rooftopStyle2]} pointerEvents="none">
            <Image source={ROOFTOP_SOURCES[2]} style={styles.rooftopImageFill} resizeMode="stretch"
              onLoad={index === 0 ? () => onArtLoad("rooftop2") : undefined} />
          </Animated.View>
        </>
      )}
    </>
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
  root: { flex: 1, backgroundColor: "#4f9ec4", overflow: "hidden" },
  artTiming: { position: "absolute", top: "25%", left: 16, right: 16, padding: 12, borderRadius: 12, backgroundColor: colors.gameSky },
  // TEMP DEBUG (GORSEL-004 iPhone diagnosis, 2026-09-18) -- delete alongside
  // the panel above once the root cause is found.
  // 2026-09-22 device-rejection fix (item C, defense in depth): moved from
  // bottom-left (inside natural one-handed thumb reach, where an accidental
  // tap while trying to charge a jump could silently freeze the pose -- see
  // the poseOverride reset in onPressIn/onPressOut/cancelCharge above for
  // the actual fix) to a small stack in the top-right corner, away from
  // where a real charge press lands.
  poseDevRow: { position: "absolute", right: 4, top: 46, flexDirection: "row", flexWrap: "wrap", width: 132, justifyContent: "flex-end", gap: 3 },
  poseDevBtn: { backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 5, paddingVertical: 4, borderRadius: 5 },
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
  // GORSEL-013 (2026-09-22, device rejection of the GORSEL-012 fix round):
  // the short cap sliver still read on-device as "a line, not a chimney" --
  // the user's own instruction for exactly this outcome is to make the
  // dynamic cap fully transparent rather than iterate on its look again.
  // Physics platforms move independently of the fixed painted scene and
  // cannot be pixel-registered to it, so no per-platform art is drawn here
  // any more: the player's landing surface is invisible, and the real
  // chimneys/rooftops the player appears to be jumping between are the
  // ones already painted into the background. towerCenter (perfect-landing
  // hint, a distinct functional affordance, not "a cap") is intentionally
  // NOT touched here -- it stays visible.
  capShadow: { position: "absolute", top: CONFIG.capHeight, left: 0, right: 0, height: 4, backgroundColor: colors.platformShade, opacity: 0 },
  capHighlight: { position: "absolute", top: 2, left: 3, right: 3, height: 2, backgroundColor: colors.platformCenter, opacity: 0 },
  // GORSEL-012 (2026-09-22): raster brick texture permanently hidden --
  // "tekrarlayan tuğla gövdeler" was explicitly rejected. Kept mounted
  // (still loaded, still tracked by markArtStarted/Loaded("bricks")) rather
  // than deleted, so this is a one-line, easily-reversible style change.
  towerBrick: {
    position: "absolute",
    left: 3,
    right: 3,
    top: CONFIG.capHeight,
    bottom: 0,
    opacity: 0,
  },

  // GORSEL-012 device-rejection fix (2026-09-22, item B): the container is
  // still CONFIG.columnHeight (1600) tall -- UNCHANGED, this is purely a
  // physics-irrelevant render box, collision/footSoles never read it -- but
  // its own flat fill is now transparent. Previously this WAS the "long
  // brown rectangle" the device video showed (colors.platform painted the
  // entire 1600px box solid): only towerCap/capShadow/capHighlight below
  // (already short, CONFIG.capHeight=12px + a few px) remain visible, so
  // what's on screen is a short clean cap at the real landing surface and
  // nothing else -- no long body, no thin column.
  tower: {
    position: "absolute",
    left: 0,
    top: 0,
    height: CONFIG.columnHeight,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: "transparent",
    overflow: "hidden",
    pointerEvents: "none",
  },
  // Tied to the now-invisible tall body -- would otherwise show as its own
  // thin full-height vertical sliver on the right edge. Hidden (opacity 0)
  // rather than deleted, so it is a one-line, easily-reversible change.
  towerShade: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: "14%",
    backgroundColor: colors.platformShade,
    opacity: 0,
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
    opacity: 0,
  },
  towerCenter: {
    position: "absolute",
    top: CONFIG.capHeight + 3,
    width: CONFIG.perfectTolerance * 2,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.platformCenter,
  },
  // GORSEL-014/OYUN_AKISI-001: sized/positioned per-platform by
  // rooftopStyle0/1/2 (width/height/transform); this is just the base.
  rooftopImage: { position: "absolute", left: 0, top: 0, pointerEvents: "none" },
  rooftopImageFill: { width: "100%", height: "100%" },

  // GORSEL-006 sprite box: square, same aspect as the 1024x1024 canvas, sized
  // from the physical sole span (SPRITE_SCALE) -- never from device pixels.

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
  gameOverLine: {
    fontSize: 13,
    fontStyle: "italic",
    color: colors.muted,
    marginTop: -16,
    marginBottom: 24,
    textAlign: "center",
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
