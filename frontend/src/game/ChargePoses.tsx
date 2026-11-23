import { Image as CachedImage } from "expo-image";
import { NoClipImage as Image } from "./NoClipImage";
import { View } from "react-native";

// REVIZYON-072: same switch as LIVE_RN_IMAGE in app/index.tsx (kept in step by
// hand). expo-image's always-clipping ImageView makes Fabric mask each pose
// image -> one offscreen pass per pose layer per frame. React Native's Image
// draws the same source with resizeMode "stretch" (== contentFit "fill").
const LIVE_RN_IMAGE = true as boolean;
import Animated, { useAnimatedStyle, type SharedValue } from "react-native-reanimated";

import { CHARGE_POSES, poseOpacity, REACTION_POSES, reactionVisible, reactionPivotFix, FALL_POSES, FALL_POSES_YAGMUR, fallVisible } from "./character-pose";
import { HAT_BOX, HAT_SOURCE, SLIPPER_BOXES, SLIPPER_SOURCE } from "./pijama";
import { RAIN_POSE_SOURCES, RAIN_CAP_SOURCE, RAIN_CAP_BOX } from "./yagmur";
import { UMB_OPEN, UMB_CLOSED, UMB_FABRIC, UMB_FABRIC_LIGHT, UMB_LINE, UMB_WOOD } from "./semsiye";
import { WINTER_HAT_BOX, WINTER_HAT_SOURCE, WINTER_SCARF_BOX, WINTER_SCARF_SOURCE, SNOW_A, SNOW_B, SNOW_C, SNOW_D, NOSE_RED, BREATH, type SnowBlob } from "./kis";

type Props = {
  px: SharedValue<number>;
  py: SharedValue<number>;
  poseCharge: SharedValue<number>;
  scale: number; // world units per sprite pixel
  feetCenterOffset: number; // physical sole-span centre relative to px
  feetHalf: number; // py + feetHalf = physical feet line
  // GORSEL-017 (2026-09-23): visual-only landing squash driver. 0 = normal,
  // 1 = max compression, negative = a slight upward/backward overshoot
  // during recovery. Purely cosmetic -- see the withSequence trigger in
  // app/index.tsx's landing-contact block for why this cannot affect
  // physics (py/vx/vy and the resolved landing point are already committed
  // before this value is even set).
  landPulse?: SharedValue<number>;
  // FAZ2 (2026-11-11): thin warm-white halo so the character reads against
  // the sea and the busy facades. Four tinted silhouette copies offset by
  // HALO_PX inside the pose's own animated view: no extra mapper, no shadow
  // (shadows force an offscreen pass on iOS), invisible with the pose.
  halo?: boolean;
  // PATLAMA EŞİĞİ (2026-11-12): tam şarj penceresinde 0..1 ilerleme (-1 = yok).
  // Amca titrer ve hafifçe şişer; yalnız transform.
  strain?: SharedValue<number>;
  // PATLAMA (2026-11-12): 1 = amca bu tur lekeli (kahverengi lekeler, yalnız opaklık).
  dirty?: SharedValue<number>;
  // PİJAMA ANI (2026-11-16): 1 = gece külahı + terlik görünür (yalnız opaklık).
  pajama?: SharedValue<number>;
  // KIŞ (2026-11-17): 1 = bere + atkı. Gece külahı (pajama) bereyi gizler, atkı kalır.
  winter?: SharedValue<number>;
  // KARLI AMCA (2026-11-17): snow 0..1 birikmiş kar, nose 0..1 soğuktan kızarma, breath 0..1 buhar puf ilerlemesi.
  snow?: SharedValue<number>;
  nose?: SharedValue<number>;
  breath?: SharedValue<number>;
  // YAĞMUR KIYAFETİ (2026-11-17): 1 = kasket + mont (montlu poz görseli özgün pozun üstüne biner).
  rain?: SharedValue<number>;
  // 2026-11-20 düzeltme: rain her zaman verilir (stil ilk çizimden itibaren aynı değeri izlesin);
  // görseller yalnız rainLayers true olunca bağlanır. Önce rain sonradan verilince kıyafet hiç görünmüyordu.
  rainLayers?: boolean;
  // ÖZEL GÜN (2026-11-20): o güne özel başlık (yılbaşı/cadı şapkası); varsa bere ve yağmur kasketi gizlenir.
  eventHat?: { source: any; box: { x: number; y: number; w: number; h: number }; keepCaps?: boolean } | null;
  // ŞEMSİYE (2026-11-17): umbrella 1 = yağmurda şemsiye var; umbOpen 0..1 açılma; umbFlip 0..1 kumaşın ters dönmesi.
  umbrella?: SharedValue<number>;
  umbOpen?: SharedValue<number>;
  umbFlip?: SharedValue<number>;
  // PİJAMA ANI: kapıya yürüme için yalnız görüntü kayması (fizik px/py değişmez).
  offsetX?: SharedValue<number>;
  offsetY?: SharedValue<number>;
  // BEDEN DİLİ (2026-11-23): tepki 0 yok, 1 silkele, 2 denge, 3 oh be; phase = PHASE (0 yerde).
  tepki?: SharedValue<number>;
  tepkiP?: SharedValue<number>; // yerleşme ilerlemesi 0→1 (180 ms)
  dusus?: SharedValue<number>; // DÜŞÜŞ: 0 yok, 1/2 çırpınma karesi
  phase?: SharedValue<number>;
  onLoad?: () => void;
  onLoadStart?: () => void;
  onError?: () => void;
};

const HALO_PX = 9; // sprite pixels
const HALO_COLOR = "rgba(255,248,230,0.8)";
const HALO_OFFSETS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const DIRT_SPOTS = [
  { x: 0.52, y: 0.58, d: 0.30 }, { x: 0.40, y: 0.72, d: 0.22 }, { x: 0.60, y: 0.82, d: 0.24 },
  { x: 0.45, y: 0.90, d: 0.18 }, { x: 0.66, y: 0.30, d: 0.16 }, { x: 0.34, y: 0.47, d: 0.20 },
  { x: 0.56, y: 0.20, d: 0.14 },
];
const DIRT_COLORS = ["rgba(150,104,48,0.92)", "rgba(126,86,40,0.92)", "rgba(171,124,62,0.9)"];

function PoseLayer({ i, px, py, poseCharge, scale, feetCenterOffset, feetHalf, landPulse, halo, strain, dirty, pajama, winter, snow, nose, breath, rain, rainLayers, eventHat, umbrella, umbOpen, umbFlip, offsetX, offsetY, tepki, phase, dusus, ...cb }: Props & { i: number }) {
  const pose = CHARGE_POSES[i];
  const style = useAnimatedStyle(() => {
    // Squash toward the FOOT line (feetHalf), not the sprite's own center,
    // so the compression reads as "sinking into the landing surface"
    // instead of shifting the character's screen position. sq<1 = shorter/
    // wider (compression); sq>1 = a touch taller (the brief recovery
    // overshoot) -- see the comment on `landPulse` above.
    const pulse = landPulse ? landPulse.value : 0;
    const sq = 1 - pulse * 0.14;
    const bulge = 1 + pulse * 0.08;
    const height = pose.h * scale;
    const extraY = (height * (1 - sq)) / 2;
    const k = strain ? strain.value : -1;
    const jitter = k >= 0 ? Math.sin(k * 95) * (1.5 + 5 * k) : 0;
    const swell = k >= 0 ? 1 + 0.035 * k + 0.015 * Math.sin(k * 40) : 1;
    // BEDEN DİLİ: tepki pozu görünürken şarj/idle pozları çizilmez (aynı anda iki gövde yok).
    const tk = tepki ? tepki.value : 0;
    const ph = phase ? phase.value : 0;
    const outfit = Math.max(rain ? rain.value : 0, winter ? winter.value : 0, pajama ? pajama.value : 0, dirty ? dirty.value : 0,
      umbrella ? umbrella.value : 0, snow ? snow.value : 0, eventHat ? 1 : 0);
    const giysi = Math.max(winter ? winter.value : 0, pajama ? pajama.value : 0, umbrella ? umbrella.value : 0, eventHat ? 1 : 0);
    const hideAll = reactionVisible(tk, ph, outfit) || fallVisible(dusus ? dusus.value : 0, giysi); // tepki/düşüş varken şarj/idle pozu çizilmez
    return {
      opacity: hideAll ? 0 : poseOpacity(i, poseCharge.value),
      transform: [
        { translateX: px.value + feetCenterOffset - pose.pivotX * scale + jitter + (offsetX ? offsetX.value : 0) },
        { translateY: py.value + feetHalf - pose.pivotY * scale + extraY + (offsetY ? offsetY.value : 0) },
        { scaleY: sq },
        { scaleX: bulge * swell },
      ],
    };
  });
  const dirtStyle = useAnimatedStyle(() => ({ opacity: dirty ? dirty.value : 0 }));
  const pajamaStyle = useAnimatedStyle(() => ({ opacity: pajama ? pajama.value : 0 }));
  const scarfStyle = useAnimatedStyle(() => ({ opacity: winter ? winter.value : 0 }));
  const eventHatStyle = useAnimatedStyle(() => ({ opacity: 1 - (pajama ? pajama.value : 0) }));
  const winterHatStyle = useAnimatedStyle(() => ({ opacity: winter ? winter.value * (1 - (pajama ? pajama.value : 0)) * (1 - (rain ? rain.value : 0)) : 0 }));
  const rainBodyStyle = useAnimatedStyle(() => ({ opacity: rain ? rain.value : 0 }));
  const rainCapStyle = useAnimatedStyle(() => ({ opacity: rain ? rain.value * (1 - (pajama ? pajama.value : 0)) : 0 }));
  const slip = SLIPPER_BOXES[i];
  // R062 kuralı: SharedValue her güncelleyicinin kendi kapanışında okunmalı (iç içe worklet'e saklanırsa abone olunmaz).
  const snowA = useAnimatedStyle(() => ({ opacity: Math.max(0, Math.min(1, ((snow ? snow.value : 0) - 0.1) * 5)) }));
  const snowB = useAnimatedStyle(() => ({ opacity: Math.max(0, Math.min(1, ((snow ? snow.value : 0) - 0.45) * 5)) }));
  const snowC = useAnimatedStyle(() => ({ opacity: Math.max(0, Math.min(1, ((snow ? snow.value : 0) - 0.7) * 5)) }));
  const snowD = useAnimatedStyle(() => ({ opacity: Math.max(0, Math.min(1, ((snow ? snow.value : 0) - 0.92) * 5)) }));
  const noseStyle = useAnimatedStyle(() => ({ opacity: (nose ? nose.value : 0) * 0.32 }));
  const breathStyle = useAnimatedStyle(() => {
    const b = breath ? breath.value : 0;
    return { opacity: b > 0 && b < 1 ? (b < 0.2 ? b * 5 : (1 - b) / 0.8) * 0.85 : 0,
      transform: [{ translateX: b * 46 * scale }, { translateY: -b * 22 * scale }, { scale: 0.6 + b * 0.9 }] };
  });
  // ŞEMSİYE: her güncelleyici SharedValue'ları kendi içinde okur (R062).
  const umbClosedStyle = useAnimatedStyle(() => {
    const on = umbrella ? umbrella.value : 0;
    const o = umbOpen ? umbOpen.value : 0;
    return { opacity: on * Math.max(0, 1 - o * 3) };
  });
  const umbOpenStyle = useAnimatedStyle(() => {
    const on = umbrella ? umbrella.value : 0;
    const o = umbOpen ? umbOpen.value : 0;
    const pulse = landPulse ? landPulse.value : 0;
    return { opacity: on * Math.min(1, o * 4), transform: [{ rotate: `${pulse * 7}deg` }] };
  });
  const umbCanopyStyle = useAnimatedStyle(() => {
    const o = umbOpen ? umbOpen.value : 0;
    const f = umbFlip ? umbFlip.value : 0;
    return { transform: [{ scaleX: 0.18 + 0.82 * o }, { scaleY: (0.35 + 0.65 * Math.min(1, o)) * (1 - 1.35 * f) }] };
  });
  return (
    <Animated.View
      testID={`charge-pose-${i}`}
      pointerEvents="none"
      style={[{ position: "absolute", left: 0, top: 0, width: pose.w * scale, height: pose.h * scale }, style]}
    >
      {umbrella ? <Umbrella scale={scale} closedStyle={umbClosedStyle} openStyle={umbOpenStyle} canopyStyle={umbCanopyStyle} /> : null}
      {halo && LIVE_RN_IMAGE
        ? HALO_OFFSETS.map(([dx, dy], k) => (
            <Image
              key={`h${k}`}
              source={pose.source}
              resizeMode="stretch"
              fadeDuration={0}
              tintColor={HALO_COLOR}
              style={{ position: "absolute", left: dx * HALO_PX * scale, top: dy * HALO_PX * scale, width: "100%", height: "100%" }}
            />
          ))
        : null}
      {LIVE_RN_IMAGE ? (
        <Image
          source={pose.source}
          resizeMode="stretch"
          fadeDuration={0}
          style={{ width: "100%", height: "100%" }}
          onLoadStart={cb.onLoadStart}
          onLoad={cb.onLoad}
          onError={cb.onError}
        />
      ) : (
        <CachedImage
          cachePolicy="memory-disk"
          priority="high"
          transition={0}
          source={pose.source}
          style={{ width: "100%", height: "100%" }}
          contentFit="fill"
          onLoadStart={cb.onLoadStart}
          onLoad={cb.onLoad}
          onError={cb.onError}
        />
      )}
      {rain && rainLayers ? (
        <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }, rainBodyStyle]}>
          <Image source={RAIN_POSE_SOURCES[i]} resizeMode="stretch" fadeDuration={0} style={{ width: "100%", height: "100%" }} />
        </Animated.View>
      ) : null}
      {dirty ? (
        <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }, dirtStyle]}>
          {DIRT_SPOTS.map((d, k) => (
            <View key={k} style={{ position: "absolute", left: `${(d.x - d.d / 2) * 100}%`, top: `${(d.y - d.d / 3) * 100}%`, width: `${d.d * 100}%`, aspectRatio: 1.25, borderRadius: 999, borderWidth: 1, borderColor: "rgba(60,36,16,0.7)", backgroundColor: DIRT_COLORS[k % 3] }} />
          ))}
        </Animated.View>
      ) : null}
      {winter ? (
        <>
          <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }, scarfStyle]}>
            <Image source={WINTER_SCARF_SOURCE} resizeMode="stretch" fadeDuration={0}
              style={{ position: "absolute", left: WINTER_SCARF_BOX.x * scale, top: WINTER_SCARF_BOX.y * scale, width: WINTER_SCARF_BOX.w * scale, height: WINTER_SCARF_BOX.h * scale }} />
          </Animated.View>
          {!(eventHat && !eventHat.keepCaps) && <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }, winterHatStyle]}>
            <Image source={WINTER_HAT_SOURCE} resizeMode="stretch" fadeDuration={0}
              style={{ position: "absolute", left: WINTER_HAT_BOX.x * scale, top: WINTER_HAT_BOX.y * scale, width: WINTER_HAT_BOX.w * scale, height: WINTER_HAT_BOX.h * scale }} />
          </Animated.View>}
        </>
      ) : null}
      {rain && rainLayers && !(eventHat && !eventHat.keepCaps) ? (
        <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }, rainCapStyle]}>
          <Image source={RAIN_CAP_SOURCE} resizeMode="stretch" fadeDuration={0}
            style={{ position: "absolute", left: RAIN_CAP_BOX.x * scale, top: RAIN_CAP_BOX.y * scale, width: RAIN_CAP_BOX.w * scale, height: RAIN_CAP_BOX.h * scale }} />
        </Animated.View>
      ) : null}
      {eventHat ? (
        <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }, eventHatStyle]}>
          <Image source={eventHat.source} resizeMode="stretch" fadeDuration={0}
            style={{ position: "absolute", left: eventHat.box.x * scale, top: eventHat.box.y * scale, width: eventHat.box.w * scale, height: eventHat.box.h * scale }} />
        </Animated.View>
      ) : null}
      {nose && i < 4 ? (
        <Animated.View pointerEvents="none" style={[{ position: "absolute", left: NOSE_RED.x * scale, top: NOSE_RED.y * scale, width: NOSE_RED.d * scale, height: NOSE_RED.d * 0.8 * scale,
          borderRadius: NOSE_RED.d * scale, backgroundColor: "rgb(232,60,60)" }, noseStyle]} />
      ) : null}
      {snow ? (
        <>
          {([[SNOW_A, snowA], [SNOW_B, snowB], [SNOW_C, snowC], [SNOW_D, snowD]] as const).map(([blobs, st], k) => (
            <Animated.View key={`s${k}`} pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }, st]}>
              {(blobs as SnowBlob[]).map((b, j) => <SnowLump key={j} b={b} scale={scale} />)}
            </Animated.View>
          ))}
        </>
      ) : null}
      {breath ? (
        <Animated.View pointerEvents="none" style={[{ position: "absolute", left: BREATH.x * scale, top: BREATH.y * scale, width: 70 * scale, height: 50 * scale }, breathStyle]}>
          <View style={{ position: "absolute", left: 0, top: 10 * scale, width: 38 * scale, height: 30 * scale, borderRadius: 20 * scale, backgroundColor: "rgba(250,252,255,0.9)" }} />
          <View style={{ position: "absolute", left: 24 * scale, top: 0, width: 44 * scale, height: 36 * scale, borderRadius: 22 * scale, backgroundColor: "rgba(250,252,255,0.8)" }} />
        </Animated.View>
      ) : null}
      {pajama ? (
        <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }, pajamaStyle]}>
          {slip.map((b, k) => (
            <Image key={`t${k}`} source={SLIPPER_SOURCE} resizeMode="stretch" fadeDuration={0}
              style={{ position: "absolute", left: b.x * scale, top: b.y * scale, width: b.w * scale, height: b.h * scale }} />
          ))}
          <Image source={HAT_SOURCE} resizeMode="stretch" fadeDuration={0}
            style={{ position: "absolute", left: HAT_BOX.x * scale, top: HAT_BOX.y * scale, width: HAT_BOX.w * scale, height: HAT_BOX.h * scale }} />
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

// ŞEMSİYE prototipi (kodla çizim, amcanın ARKASINDA): kapalı hâl sırtta çapraz, açık kubbe başın üstünde.
// Kubbe kabı 2*h yüksekliğinde, kubbe üst yarıda: scaleY kabın ortasına (= kubbe alt kenarı) göre işler,
// eksi değerde kumaş yukarı doğru ters döner.
function Umbrella({ scale, closedStyle, openStyle, canopyStyle }: { scale: number; closedStyle: any; openStyle: any; canopyStyle: any }) {
  const O = UMB_OPEN, C = UMB_CLOSED, s = scale;
  const lw = Math.max(1, 9 * s);
  const r = O.w / 2;
  return (
    <>
      <Animated.View pointerEvents="none" style={[{ position: "absolute", left: (C.cx - C.w) * s, top: (C.cy - C.len / 2) * s, width: C.w * 2 * s, height: C.len * s,
        transform: [{ rotate: `${C.rot}deg` }] }, closedStyle]}>
        {/* kıvrık sap (üstte) */}
        <View style={{ position: "absolute", left: -C.w * 0.2 * s, top: 0, width: C.w * 1.4 * s, height: C.w * 1.4 * s, borderRadius: C.w * s,
          borderWidth: 12 * s, borderColor: UMB_WOOD, borderBottomColor: "transparent", borderLeftColor: "transparent", transform: [{ rotate: "-45deg" }] }} />
        <View style={{ position: "absolute", left: (C.w - 6) * s, top: C.w * 0.6 * s, width: 12 * s, height: C.len * 0.3 * s, backgroundColor: UMB_WOOD, borderRadius: 6 * s }} />
        {/* sarılı kumaş */}
        <View style={{ position: "absolute", left: C.w * 0.45 * s, top: C.len * 0.3 * s, width: C.w * 1.1 * s, height: C.len * 0.62 * s,
          borderRadius: C.w * 0.55 * s, borderBottomLeftRadius: C.w * 0.2 * s, borderBottomRightRadius: C.w * 0.2 * s, backgroundColor: UMB_FABRIC, borderWidth: lw, borderColor: UMB_LINE }} />
      </Animated.View>
      <Animated.View pointerEvents="none" style={[{ position: "absolute", left: (O.cx - r) * s, top: (O.bottom - O.h - 40) * s, width: O.w * s, height: (O.shaftBottom - O.bottom + O.h + 40) * s }, openStyle]}>
        {/* sap: kubbenin tepesinden başın arkasına */}
        <View style={{ position: "absolute", left: (r - 6) * s, top: 0, width: 12 * s, height: (O.shaftBottom - O.bottom + O.h + 40) * s, backgroundColor: UMB_WOOD, borderRadius: 6 * s,
          borderWidth: Math.max(0.5, 3 * s), borderColor: UMB_LINE }} />
        <Animated.View style={[{ position: "absolute", left: 0, top: 40 * s, width: O.w * s, height: O.h * 2 * s }, canopyStyle]}>
          <View style={{ position: "absolute", left: 0, top: 0, width: O.w * s, height: O.h * s, overflow: "hidden" }}>
            <View style={{ position: "absolute", left: 0, top: 0, width: O.w * s, height: O.h * 2 * s, borderRadius: r * s, backgroundColor: UMB_FABRIC, borderWidth: lw, borderColor: UMB_LINE }} />
            <View style={{ position: "absolute", left: (r - O.w * 0.17) * s, top: 0, width: O.w * 0.34 * s, height: O.h * 2 * s, borderRadius: O.w * 0.17 * s,
              backgroundColor: UMB_FABRIC_LIGHT, borderWidth: Math.max(0.5, 5 * s), borderColor: UMB_LINE }} />
          </View>
          {/* alt kenar + uç tıkaçları */}
          <View style={{ position: "absolute", left: 0, top: (O.h - 5) * s, width: O.w * s, height: lw, backgroundColor: UMB_LINE }} />
          {[0, 0.17, 0.5, 0.83, 1].map((t, k) => (
            <View key={k} style={{ position: "absolute", left: (t * O.w - 9) * s, top: (O.h - 9) * s, width: 18 * s, height: 18 * s, borderRadius: 9 * s, backgroundColor: UMB_LINE }} />
          ))}
          <View style={{ position: "absolute", left: (r - 7) * s, top: -30 * s, width: 14 * s, height: 36 * s, borderRadius: 7 * s, backgroundColor: UMB_LINE }} />
        </Animated.View>
      </Animated.View>
    </>
  );
}

// Kar yığını: yüzeye biraz gömülü üç daire (ortadaki büyük); ince gri-mavi kontur karlı çatıda da seçilsin diye.
function SnowLump({ b, scale }: { b: SnowBlob; scale: number }) {
  const parts = [
    { dx: -0.3, d: 0.46 }, { dx: 0.3, d: 0.42 }, { dx: 0, d: 0.62 },
  ];
  return (
    <>
      {parts.map((q, k) => {
        const d = b.w * q.d;
        const left = (b.cx + q.dx * b.w - d / 2) * scale;
        const top = (b.by - d * 0.78) * scale; // dairenin alt %22'si yüzeyin altında kalır
        return <View key={k} style={{ position: "absolute", left, top, width: d * scale, height: d * scale, borderRadius: (d * scale) / 2,
          backgroundColor: "rgba(255,255,255,0.98)", borderWidth: Math.max(0.5, 2 * scale), borderColor: "rgba(120,145,180,0.55)" }} />;
      })}
    </>
  );
}

// BEDEN DİLİ: tepki pozu katmanı (k = 1..3). PoseLayer ile aynı dönüşüm ve hale; kıyafet katmanı yok
// (kıyafet görünürken reactionVisible false olur, tepki hiç çizilmez).
function ReactionLayer({ k, px, py, poseCharge, scale, feetCenterOffset, feetHalf, landPulse, halo, dirty, pajama, winter, snow, rain, eventHat, umbrella, offsetX, offsetY, tepki, tepkiP, phase, dusus }: Props & { k: number }) {
  const pose = REACTION_POSES[k - 1];
  const style = useAnimatedStyle(() => {
    const tk = tepki ? tepki.value : 0;
    const ph = phase ? phase.value : 0;
    const outfit = Math.max(rain ? rain.value : 0, winter ? winter.value : 0, pajama ? pajama.value : 0, dirty ? dirty.value : 0,
      umbrella ? umbrella.value : 0, snow ? snow.value : 0, eventHat ? 1 : 0);
    const giysi = Math.max(winter ? winter.value : 0, pajama ? pajama.value : 0, umbrella ? umbrella.value : 0, eventHat ? 1 : 0);
    const on = tk === k && reactionVisible(tk, ph, outfit) && !fallVisible(dusus ? dusus.value : 0, giysi);
    const pulse = landPulse ? landPulse.value : 0;
    const sq = 1 - pulse * 0.14;
    const bulge = 1 + pulse * 0.08;
    // Yerleşme (plan KARGA-DONGU C): ilk 180 ms sy 0,94→1, sx 1,04→1; ayak noktası tek formülle sabit.
    const tp = tepkiP ? tepkiP.value : 1;
    const SX = bulge * (1.04 - 0.04 * tp);
    const SY = sq * (0.94 + 0.06 * tp);
    const fix = reactionPivotFix(pose.pivotX, pose.pivotY, pose.w, pose.h, scale, SX, SY);
    return {
      opacity: on ? 1 : 0,
      transform: [
        { translateX: px.value + feetCenterOffset - pose.pivotX * scale + fix.dx + (offsetX ? offsetX.value : 0) },
        { translateY: py.value + feetHalf - pose.pivotY * scale + fix.dy + (offsetY ? offsetY.value : 0) },
        { scaleY: SY },
        { scaleX: SX },
      ],
    };
  });
  return (
    <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, width: pose.w * scale, height: pose.h * scale }, style]}>
      {halo && LIVE_RN_IMAGE
        ? HALO_OFFSETS.map(([dx, dy], j) => (
            <Image key={`h${j}`} source={pose.source} resizeMode="stretch" fadeDuration={0} tintColor={HALO_COLOR}
              style={{ position: "absolute", left: dx * HALO_PX * scale, top: dy * HALO_PX * scale, width: "100%", height: "100%" }} />
          ))
        : null}
      <Image source={pose.source} resizeMode="stretch" fadeDuration={0} style={{ width: "100%", height: "100%" }} />
    </Animated.View>
  );
}

// DÜŞÜŞ katmanı: düşüş kesinleşince iki kare sırayla (ölçek yok; pivot baş hizası).
function FallLayer({ k, px, py, scale, feetCenterOffset, feetHalf, halo, pajama, winter, rain, eventHat, umbrella, offsetX, offsetY, dusus }: Props & { k: number }) {
  const pose = FALL_POSES[k - 1];
  const style = useAnimatedStyle(() => {
    const d = dusus ? dusus.value : 0;
    const giysi = Math.max(winter ? winter.value : 0, pajama ? pajama.value : 0, umbrella ? umbrella.value : 0, eventHat ? 1 : 0);
    return {
      opacity: d === k && fallVisible(d, giysi) ? 1 : 0,
      transform: [
        { translateX: px.value + feetCenterOffset - pose.pivotX * scale + (offsetX ? offsetX.value : 0) },
        { translateY: py.value + feetHalf - pose.pivotY * scale + (offsetY ? offsetY.value : 0) },
      ],
    };
  });
  // Yağmurda yağmurluklu kare (kıyafet geçişiyle aynı oranda karışır).
  const plainStyle = useAnimatedStyle(() => ({ opacity: 1 - (rain ? rain.value : 0) }));
  const rainStyle = useAnimatedStyle(() => ({ opacity: rain ? rain.value : 0 }));
  return (
    <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, width: pose.w * scale, height: pose.h * scale }, style]}>
      {halo && LIVE_RN_IMAGE
        ? HALO_OFFSETS.map(([dx, dy], j) => (
            <Image key={`h${j}`} source={pose.source} resizeMode="stretch" fadeDuration={0} tintColor={HALO_COLOR}
              style={{ position: "absolute", left: dx * HALO_PX * scale, top: dy * HALO_PX * scale, width: "100%", height: "100%" }} />
          ))
        : null}
      <Animated.Image source={pose.source} resizeMode="stretch" fadeDuration={0} style={[{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }, plainStyle]} />
      {rain ? <Animated.Image source={FALL_POSES_YAGMUR[k - 1]} resizeMode="stretch" fadeDuration={0} style={[{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }, rainStyle]} /> : null}
    </Animated.View>
  );
}

export function ChargePoses(props: Props) {
  return (
    <>
      {CHARGE_POSES.map((_, i) => (
        <PoseLayer key={i} i={i} {...props} />
      ))}
      {props.tepki ? REACTION_POSES.map((_, j) => <ReactionLayer key={`t${j}`} k={j + 1} {...props} />) : null}
      {props.dusus ? FALL_POSES.map((_, j) => <FallLayer key={`d${j}`} k={j + 1} {...props} />) : null}
    </>
  );
}
