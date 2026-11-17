// GERÇEK İSTANBUL HAVASI (2026-11-17): yalnız görünüş. Fizik, kamera, çatı silueti değişmez.
// SkyWeather: dünyanın ARKASINDA (renk tonu, sis, rüzgâr çizgileri, ay, yakamoz) -> kuleleri asla örtmez.
// PrecipLayer: dünyanın ÖNÜNDE ince yağmur/kar (düşük opaklık). Her katman tek bir animasyonlu dönüşüm.
import { LinearGradient } from "expo-linear-gradient";
import { memo, useEffect } from "react";
import { View } from "react-native";
import Animated, { Easing, cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming, type SharedValue } from "react-native-reanimated";
import type { IstWeather, Season } from "./istanbul";

const hash = (i: number, n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;

const RAIN = Array.from({ length: 150 }, (_, i) => ({ x: hash(i, 1) * 120 - 10, y: hash(i, 2), len: 18 + hash(i, 3) * 18, o: 0.35 + hash(i, 4) * 0.35 }));
const SNOW = Array.from({ length: 46 }, (_, i) => ({ x: hash(i, 5) * 110 - 5, y: hash(i, 6), r: 3 + Math.round(hash(i, 7) * 3), o: 0.55 + hash(i, 8) * 0.4 }));
// Mevsim parçacıkları: sonbaharda sarı/turuncu yaprak, ilkbaharda erguvan yaprağı (seyrek, küçük).
const FLAKE = Array.from({ length: 10 }, (_, i) => ({ x: hash(i, 21) * 100, y: hash(i, 22), r: Math.round(hash(i, 23) * 180), s: 0.8 + hash(i, 24) * 0.6, c: i % 3 }));
const LEAF_COLORS = ["#d98b2b", "#c4581e", "#e2b33a"];
const PETAL_COLORS = ["#ee9cc4", "#e07fb0", "#f8c7dd"];
const GUST = Array.from({ length: 22 }, (_, i) => ({ x: hash(i, 9), y: 4 + hash(i, 10) * 58, w: 50 + hash(i, 11) * 90, o: 0.35 + hash(i, 12) * 0.4 }));
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

const TINT: Record<string, string> = {
  bulutlu: "rgba(105,116,132,0.24)", yagmur: "rgba(55,66,90,0.34)", kar: "rgba(200,214,232,0.20)", sis: "rgba(225,230,236,0.18)",
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
  const fogStyle = useAnimatedStyle(() => ({ opacity: 0.78 + 0.18 * Math.sin(breathe.value * Math.PI * 2) }));
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
      {kind !== "acik" && <View style={{ position: "absolute", left: 0, top: 0, width: W, height: H, backgroundColor: TINT[kind] }} />}
      {wind && <View style={{ position: "absolute", left: 0, top: 0, width: W, height: H, backgroundColor: TINT[wind] }} />}
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
        <Animated.View style={[{ position: "absolute", left: 0, top: H * 0.12, width: W, height: H * 0.5 }, fogStyle]}>
          <LinearGradient colors={["rgba(236,239,243,0)", "rgba(236,239,243,0.86)", "rgba(236,239,243,0.9)", "rgba(236,239,243,0)"]}
            locations={[0, 0.35, 0.7, 1]} style={{ flex: 1 }} />
        </Animated.View>
      )}
      {wind && (
        <Animated.View style={[{ position: "absolute", left: 0, top: 0, width: 2 * W, height: H }, gustStyle]}>
          {[0, 1].map((k) => GUST.map((g, i) => (
            <View key={`${k}-${i}`} style={{ position: "absolute", left: (g.x + k) * W, top: `${g.y}%`, width: g.w, height: 2.5, borderRadius: 1.5, backgroundColor: "#fffaf0", opacity: g.o }} />
          )))}
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
  const drift = !rain && !snow && kind !== "sis" && (season === "sonbahar" || season === "ilkbahar");
  const t = useLoop(rain ? 650 : 11000, active && (rain || snow));
  const t2 = useLoop(drift ? 15000 : 17000, active && (snow || drift));
  const windDir = weather?.wind === "poyraz" ? -1 : 1;
  const driftStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: t2.value * H }, { translateX: windDir * (t2.value * 60) + Math.sin(t2.value * Math.PI * 4) * 18 }],
  }));
  const slant = weather?.wind === "poyraz" ? -1 : 1;
  const sheet = useAnimatedStyle(() => ({ transform: [{ translateY: t.value * H }] }));
  const sheet2 = useAnimatedStyle(() => ({ transform: [{ translateY: t2.value * H }, { translateX: Math.sin(t2.value * Math.PI * 2) * 12 }] }));
  if (drift) {
    const cols = season === "sonbahar" ? LEAF_COLORS : PETAL_COLORS;
    const pieces = (half: number) => FLAKE.map((f, i) => (
      <View key={`${half}-${i}`} style={{ position: "absolute", left: `${f.x}%`, top: (f.y + half) * H, width: 10 * f.s, height: 6 * f.s, borderRadius: 5,
        backgroundColor: cols[f.c], opacity: 0.85, transform: [{ rotate: `${f.r}deg` }] }} />
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
  const rainDrops = weather?.light ? RAIN.filter((_, i) => i % 3 === 0) : RAIN; // hafif yağmurda üçte bir
  const drops = (half: number) => rain
    ? rainDrops.map((d, i) => <View key={`${half}-${i}`} style={{ position: "absolute", left: `${d.x}%`, top: (d.y + half) * H, width: 2, height: d.len, borderRadius: 1, backgroundColor: "#e8f0ff", opacity: d.o }} />)
    : SNOW.map((d, i) => <View key={`${half}-${i}`} style={{ position: "absolute", left: `${d.x}%`, top: (d.y + half) * H, width: d.r, height: d.r, borderRadius: d.r / 2, backgroundColor: "#ffffff", opacity: d.o }} />);
  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 0, top: 0, width: W, height: H, overflow: "hidden", zIndex: 30 }}>
      <View style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: rain ? [{ rotate: `${slant * (weather?.wind ? 16 : 9)}deg` }, { scale: 1.25 }] : [] }}>
        <Animated.View style={[{ position: "absolute", left: 0, top: -H, width: W, height: 2 * H }, sheet]}>
          {drops(0)}
          {drops(1)}
        </Animated.View>
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
