// GERÇEK İSTANBUL HAVASI (2026-11-17): yalnız görünüş. Fizik, kamera, çatı silueti değişmez.
// SkyWeather: dünyanın ARKASINDA (renk tonu, sis, rüzgâr çizgileri, ay, yakamoz) -> kuleleri asla örtmez.
// PrecipLayer: dünyanın ÖNÜNDE ince yağmur/kar (düşük opaklık). Her katman tek bir animasyonlu dönüşüm.
import { LinearGradient } from "expo-linear-gradient";
import { memo, useEffect } from "react";
import { View } from "react-native";
import Animated, { Easing, cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming, type SharedValue } from "react-native-reanimated";
import type { IstWeather, Season } from "./istanbul";

const hash = (i: number, n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;

// YAĞMUR v2 (2026-11-18, HAVA-GORSEL raporu: "eşit, düz, opak çubuklar"): 3 derinlik — uzak ince/kısa/soluk/yavaş,
// orta, yakın kalın/uzun/hızlı ama seyrek; hepsi yarı saydam.
const RAIN_FAR = Array.from({ length: 80 }, (_, i) => ({ x: hash(i, 1) * 120 - 10, y: hash(i, 2), len: 9 + hash(i, 3) * 8, o: 0.2 + hash(i, 4) * 0.12, w: 1 }));
const RAIN_MID = Array.from({ length: 56 }, (_, i) => ({ x: hash(i, 41) * 120 - 10, y: hash(i, 42), len: 16 + hash(i, 43) * 12, o: 0.3 + hash(i, 44) * 0.14, w: 1.5 }));
const RAIN_NEAR = Array.from({ length: 18 }, (_, i) => ({ x: hash(i, 51) * 120 - 10, y: hash(i, 52), len: 30 + hash(i, 53) * 16, o: 0.36 + hash(i, 54) * 0.16, w: 2.2 }));
const SNOW = Array.from({ length: 46 }, (_, i) => ({ x: hash(i, 5) * 110 - 5, y: hash(i, 6), r: 3 + Math.round(hash(i, 7) * 3), o: 0.55 + hash(i, 8) * 0.4 }));
// Mevsim parçacıkları: sonbaharda sarı/turuncu yaprak, ilkbaharda erguvan yaprağı (seyrek, küçük).
const FLAKE = Array.from({ length: 10 }, (_, i) => ({ x: hash(i, 21) * 100, y: hash(i, 22), r: Math.round(hash(i, 23) * 180), s: 0.8 + hash(i, 24) * 0.6, c: i % 3 }));
const LEAF_COLORS = ["#d98b2b", "#c4581e", "#e2b33a"];
const PETAL_COLORS = ["#ee9cc4", "#e07fb0", "#f8c7dd"];
// RÜZGÂR v2 (2026-11-18): kısa, iki ucu sivri (yarı saydam degrade), hafif eğik; 3 dalga hâlinde gelip gider;
// skor bandından (ekranın %6–21'i) geçmez.
const GUST = Array.from({ length: 24 }, (_, i) => {
  const r = hash(i, 10);
  const y = r < 0.12 ? 2 + r * 30 : 22 + (r - 0.12) / 0.88 * 42;
  return { x: hash(i, 9), y, w: 40 + hash(i, 11) * 50, o: 0.62 + hash(i, 12) * 0.25, rot: (hash(i, 17) - 0.5) * 6, g: i % 3 };
});
// Yakamoz: aşağı indikçe genişleyen, dağınık kısa parıltılar (3 grup, ayrı ayrı yanıp söner).
const GLINT = Array.from({ length: 34 }, (_, i) => {
  const k = hash(i, 13);
  return { y: 36 + k * 27, w: 5 + hash(i, 14) * (10 + k * 26), dx: (hash(i, 15) - 0.5) * (16 + k * 70), o: 0.45 + hash(i, 16) * 0.5, g: i % 3 };
});

function useLoop(duration: number, on: boolean) {
  const t = useSharedValue(0);
  useEffect(() => {
    if (!on) { cancelAnimation(t); t.value = 0; return; }
    t.value = 0;
    t.value = withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(t);
  }, [duration, on, t]);
  return t;
}

// SİS v2 (2026-11-18, HAVA-GORSEL raporu: "fazla beyaz, yanlış yerde yoğun, gök güneşli kalıyor"):
// serin mavi-gri (beyaz değil), uzaklıkla artan kademeli örtü (gök/siluet en yoğun, deniz azalarak,
// mahalle çok hafif, kuleler/amca hiç: bu katman dünyanın arkasında), üstünde yavaş kayan 2 sis bandı.
const FOG_RGB = "212,222,228";
const FOG_WASH = [0.46, 0.5, 0.56, 0.44, 0.27, 0.13, 0.08] as const; // gök üstü -> siluet -> uzak deniz -> yakın deniz -> mahalle -> alt
const FOG_WASH_AT = [0, 0.16, 0.27, 0.38, 0.55, 0.7, 1] as const;
// Sis bandı: üst üste binen yumuşak elipsler (bulanıklık yok; düşük opaklıklı katmanlar yumuşak kenar verir).
const FOG_PUFF = Array.from({ length: 9 }, (_, i) => ({ x: i / 9 + (hash(i, 31) - 0.5) * 0.06, w: 0.32 + hash(i, 32) * 0.22, h: 0.55 + hash(i, 33) * 0.45, dy: (hash(i, 34) - 0.5) * 0.4 }));

// KAR-FILTRE (2026-11-25, kullanıcı: "kar filtresini biraz hafiflet"): karlı master artık kendisi kapalı-gri çizim
// (MEVSIM-SILUET); 0.20 beyaz örtü üstüne binince siluet denizle karışıyordu -> 0.07.
const TINT: Record<string, string> = {
  bulutlu: "rgba(105,116,132,0.24)", yagmur: "rgba(55,66,90,0.34)", kar: "rgba(200,214,232,0.07)", sis: "rgba(0,0,0,0)",
  lodos: "rgba(255,140,50,0.24)", poyraz: "rgba(80,132,222,0.24)",
};

/** Dünyanın arkası: hava tonu, sis bandı, rüzgâr çizgileri, ay ve dolunay yakamozu. `night` 0..1 (yıldızlarla aynı). */
export const SkyWeather = memo(function SkyWeather(props: {
  W: number; H: number; weather: IstWeather | null; night: SharedValue<number>;
  moon: { illum: number; waxing: boolean; full: boolean } | null; active: boolean; season?: Season;
}) {
  const { W, H, weather, night, moon, active, season } = props;
  const kind = weather?.kind ?? "acik";
  const wind = weather?.wind ?? null;
  const gust = useLoop(wind === "lodos" ? 2600 : 3200, active && wind != null);
  const breathe = useLoop(7000, active && (kind === "sis" || !!moon?.full));
  const nightStyle = useAnimatedStyle(() => ({ opacity: night.value }));
  const dayStyle = useAnimatedStyle(() => ({ opacity: 1 - night.value }));
  const dry = kind === "acik" || kind === "bulutlu";
  const gustStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: wind === "poyraz" ? -gust.value * W : (gust.value - 1) * W }],
  }));
  const wave0 = useAnimatedStyle(() => ({ opacity: 0.25 + 0.75 * Math.max(0, Math.sin(gust.value * Math.PI * 2)) }));
  const wave1 = useAnimatedStyle(() => ({ opacity: 0.25 + 0.75 * Math.max(0, Math.sin(gust.value * Math.PI * 2 + 2.1)) }));
  const wave2 = useAnimatedStyle(() => ({ opacity: 0.25 + 0.75 * Math.max(0, Math.sin(gust.value * Math.PI * 2 + 4.2)) }));
  const fogA = useLoop(46000, active && kind === "sis");
  const fogB = useLoop(29000, active && kind === "sis");
  const fogBandA = useAnimatedStyle(() => ({ transform: [{ translateX: -fogA.value * W }], opacity: 0.85 + 0.15 * Math.sin(breathe.value * Math.PI * 2) }));
  const fogBandB = useAnimatedStyle(() => ({ transform: [{ translateX: (fogB.value - 1) * W }], opacity: 0.8 + 0.2 * Math.sin(breathe.value * Math.PI * 2 + 1.7) }));
  const glint0 = useAnimatedStyle(() => ({ opacity: 0.5 + 0.5 * Math.sin(breathe.value * Math.PI * 10) }));
  const glint1 = useAnimatedStyle(() => ({ opacity: 0.5 + 0.5 * Math.sin(breathe.value * Math.PI * 10 + 2.1) }));
  const glint2 = useAnimatedStyle(() => ({ opacity: 0.5 + 0.5 * Math.sin(breathe.value * Math.PI * 10 + 4.2) }));
  const D = 46;
  // Ay: aydınlık disk + kaydırılmış gölge disk (büyürken aydınlık taraf sağda).
  const shadowX = moon ? (moon.waxing ? -1 : 1) * 2 * D * moon.illum : 0;
  const moonX = W * 0.76;
  const moonY = H * 0.085;
  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 0, top: 0, width: W, height: H }}>
      {kind !== "acik" && kind !== "yagmur" && <View style={{ position: "absolute", left: 0, top: 0, width: W, height: H, backgroundColor: TINT[kind] }} />}
      {/* Yağmur: gök griye, aşağı doğru hafifler (mahalle ve çatılar boğulmasın). */}
      {kind === "yagmur" && (
        <LinearGradient pointerEvents="none" colors={["rgba(62,72,90,0.5)", "rgba(62,72,90,0.36)", "rgba(55,66,90,0.24)", "rgba(55,66,90,0.16)"]}
          locations={[0, 0.3, 0.6, 1]} style={{ position: "absolute", left: 0, top: 0, width: W, height: H }} />
      )}
      {/* Rüzgâr tonu yalnız gök/deniz/uzak katmanda; mahalleye inerken söner ("evleri düz boyamasın"). */}
      {wind && (
        <LinearGradient pointerEvents="none" colors={[TINT[wind], TINT[wind], "rgba(0,0,0,0)"]} locations={[0, 0.45, 0.72]}
          style={{ position: "absolute", left: 0, top: 0, width: W, height: H }} />
      )}
      {/* MEVSİM: yazın açık günde güneş parıltısı, kışın açık günde serin ton (gece söner). */}
      {season === "yaz" && kind === "acik" && (
        <Animated.View style={[{ position: "absolute", left: 0, top: 0, width: W, height: H }, dayStyle]}>
          <LinearGradient colors={["rgba(255,236,170,0.6)", "rgba(255,214,140,0.2)", "rgba(255,214,140,0)"]} locations={[0, 0.35, 0.7]}
            start={{ x: 1, y: 0 }} end={{ x: 0.2, y: 0.6 }} style={{ flex: 1 }} />
          {/* köşede yumuşak yaz güneşi: dış hale + iç disk */}
          <View style={{ position: "absolute", left: W - 150, top: -120, width: 300, height: 300, borderRadius: 150, backgroundColor: "rgba(255,232,160,0.22)" }} />
          <View style={{ position: "absolute", left: W - 95, top: -65, width: 190, height: 190, borderRadius: 95, backgroundColor: "rgba(255,240,190,0.38)" }} />
          <View style={{ position: "absolute", left: W - 55, top: -25, width: 110, height: 110, borderRadius: 55, backgroundColor: "rgba(255,250,225,0.85)" }} />
        </Animated.View>
      )}
      {season === "kis" && dry && <View style={{ position: "absolute", left: 0, top: 0, width: W, height: H, backgroundColor: "rgba(200,220,245,0.12)" }} />}
      {kind === "sis" && (
        <>
          <LinearGradient pointerEvents="none" colors={FOG_WASH.map((a) => `rgba(${FOG_RGB},${a})`) as any} locations={FOG_WASH_AT as any}
            style={{ position: "absolute", left: 0, top: 0, width: W, height: H }} />
          {([[fogBandA, 0.27, 0.11, 0.34], [fogBandB, 0.43, 0.09, 0.26]] as const).map(([st, cy, bh, op], k) => (
            <Animated.View key={k} style={[{ position: "absolute", left: 0, top: H * (cy - bh / 2), width: 2 * W, height: H * bh }, st]}>
              {[0, 1].map((rep) => FOG_PUFF.map((f, i) => (
                [1, 0.72, 0.46].map((sc, j) => {
                  const w = f.w * W * (1 + (1 - sc)), h = H * bh * f.h * (1 + (1 - sc));
                  return <View key={`${rep}-${i}-${j}`} style={{ position: "absolute", left: (rep + f.x) * W - w / 2, top: H * bh * (0.5 + f.dy * 0.5) - h / 2, width: w, height: h,
                    borderRadius: h / 2, backgroundColor: `rgba(${FOG_RGB},${(op * 0.34).toFixed(3)})` }} />;
                })
              )))}
            </Animated.View>
          ))}
        </>
      )}
      {wind && (
        <Animated.View style={[{ position: "absolute", left: 0, top: 0, width: 2 * W, height: H }, gustStyle]}>
          {[wave0, wave1, wave2].map((ws, gi) => (
            <Animated.View key={gi} style={[{ position: "absolute", left: 0, top: 0, width: 2 * W, height: H }, ws]}>
              {[0, 1].map((k) => GUST.filter((g) => g.g === gi).map((g, i) => (
                <LinearGradient key={`${k}-${i}`} colors={["rgba(255,250,240,0)", `rgba(255,250,240,${g.o})`, "rgba(255,250,240,0)"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
                  style={{ position: "absolute", left: (g.x + k) * W, top: `${g.y}%`, width: g.w, height: 3, borderRadius: 1.5, transform: [{ rotate: `${g.rot}deg` }] }} />
              )))}
            </Animated.View>
          ))}
        </Animated.View>
      )}
      {moon && kind !== "sis" && (
        <Animated.View style={[{ position: "absolute", left: 0, top: 0, width: W, height: H }, nightStyle]}>
          <View style={{ position: "absolute", left: moonX - D, top: moonY - D, width: D * 3, height: D * 3, borderRadius: D * 1.5, backgroundColor: "rgba(255,246,214,0.07)" }} />
          <View style={{ position: "absolute", left: moonX - D / 2, top: moonY - D / 2, width: D, height: D, borderRadius: D / 2, overflow: "hidden", backgroundColor: "#fff3cf" }}>
            <View style={{ position: "absolute", left: shadowX, top: 0, width: D, height: D, borderRadius: D / 2, backgroundColor: "#28305a" }} />
          </View>
          {moon.full && (
            <>
              {[glint0, glint1, glint2].map((st, gi) => (
                <Animated.View key={gi} style={[{ position: "absolute", left: 0, top: 0, width: W, height: H }, st]}>
                  {GLINT.filter((g) => g.g === gi).map((g, i) => (
                    <View key={i} style={{ position: "absolute", left: moonX - g.w / 2 + g.dx, top: `${g.y}%`, width: g.w, height: 2, borderRadius: 1,
                      backgroundColor: "#f6f3ff", opacity: g.o }} />
                  ))}
                </Animated.View>
              ))}
            </>
          )}
        </Animated.View>
      )}
    </View>
  );
});

/** Dünyanın önü: ince yağmur ya da kar. */
export const PrecipLayer = memo(function PrecipLayer(props: { W: number; H: number; weather: IstWeather | null; active: boolean; season?: Season }) {
  const { W, H, weather, active, season } = props;
  const kind = weather?.kind;
  const rain = kind === "yagmur";
  const snow = kind === "kar";
  // Yağış yokken sonbahar yaprağı / ilkbahar çiçek yaprağı.
  const drift = !rain && !snow && kind !== "sis" && weather?.wind !== "poyraz" && (season === "sonbahar" || season === "ilkbahar");
  const t = useLoop(rain ? 650 : 11000, active && (rain || snow));
  const t2 = useLoop(drift ? 15000 : 17000, active && (snow || drift));
  const windDir = weather?.wind === "poyraz" ? -1 : 1;
  const driftStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: t2.value * H }, { translateX: windDir * (t2.value * 60) + Math.sin(t2.value * Math.PI * 4) * 18 }],
  }));
  const slant = weather?.wind === "poyraz" ? -1 : 1;
  const sheet = useAnimatedStyle(() => ({ transform: [{ translateY: t.value * H }] }));
  const tFar = useLoop(1000, active && rain);
  const tNear = useLoop(430, active && rain);
  const sheetFar = useAnimatedStyle(() => ({ transform: [{ translateY: tFar.value * H }] }));
  const sheetNear = useAnimatedStyle(() => ({ transform: [{ translateY: tNear.value * H }] }));
  const sheet2 = useAnimatedStyle(() => ({ transform: [{ translateY: t2.value * H }, { translateX: Math.sin(t2.value * Math.PI * 2) * 12 }] }));
  if (drift) {
    const cols = season === "sonbahar" ? LEAF_COLORS : PETAL_COLORS;
    const pieces = (half: number) => FLAKE.map((f, i) => (
      <View key={`${half}-${i}`} style={{ position: "absolute", left: `${f.x}%`, top: (f.y + half) * H, width: 11 * f.s, height: 7 * f.s,
        borderTopLeftRadius: 9 * f.s, borderBottomRightRadius: 9 * f.s, borderTopRightRadius: 1.5, borderBottomLeftRadius: 1.5,
        backgroundColor: cols[f.c], opacity: 0.8, transform: [{ rotate: `${f.r}deg` }] }} />
    ));
    return (
      <View pointerEvents="none" style={{ position: "absolute", left: 0, top: 0, width: W, height: H, overflow: "hidden", zIndex: 30 }}>
        <Animated.View style={[{ position: "absolute", left: 0, top: -H, width: W, height: 2 * H }, driftStyle]}>
          {pieces(0)}
          {pieces(1)}
        </Animated.View>
      </View>
    );
  }
  if (!rain && !snow) return null;
  const lite = (a: { x: number }[]) => (weather?.light ? a.filter((_, i) => i % 3 === 0) : a); // hafif yağmurda üçte bir
  const rainSet = (set: typeof RAIN_FAR, half: number) => lite(set).map((d: any, i: number) => (
    <View key={`${half}-${i}`} style={{ position: "absolute", left: `${d.x}%`, top: (d.y + half) * H, width: d.w, height: d.len, borderRadius: d.w, backgroundColor: "#e8f0ff", opacity: d.o }} />
  ));
  const drops = (half: number) => rain
    ? rainSet(RAIN_MID, half)
    : SNOW.map((d, i) => <View key={`${half}-${i}`} style={{ position: "absolute", left: `${d.x}%`, top: (d.y + half) * H, width: d.r, height: d.r, borderRadius: d.r / 2, backgroundColor: "#ffffff", opacity: d.o }} />);
  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 0, top: 0, width: W, height: H, overflow: "hidden", zIndex: 30 }}>
      <View style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: rain ? [{ rotate: `${slant * (weather?.wind ? 16 : 9)}deg` }, { scale: 1.25 }] : [] }}>
        <Animated.View style={[{ position: "absolute", left: 0, top: -H, width: W, height: 2 * H }, sheet]}>
          {drops(0)}
          {drops(1)}
        </Animated.View>
        {rain && (
          <>
            <Animated.View style={[{ position: "absolute", left: 0, top: -H, width: W, height: 2 * H }, sheetFar]}>
              {rainSet(RAIN_FAR, 0)}
              {rainSet(RAIN_FAR, 1)}
            </Animated.View>
            <Animated.View style={[{ position: "absolute", left: 0, top: -H, width: W, height: 2 * H }, sheetNear]}>
              {rainSet(RAIN_NEAR, 0)}
              {rainSet(RAIN_NEAR, 1)}
            </Animated.View>
          </>
        )}
        {snow && (
          <Animated.View style={[{ position: "absolute", left: 0, top: -H, width: W, height: 2 * H }, sheet2]}>
            {drops(0)}
            {drops(1)}
          </Animated.View>
        )}
      </View>
    </View>
  );
});
