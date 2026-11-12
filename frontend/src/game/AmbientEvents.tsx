// İSTANBUL ANLIK OLAYLARI (2026-11-12, kullanıcı seçimi). Yalnız görsel/ses:
// fiziğe, kameraya ve puana dokunmaz. Martı görseli yeni üretim değil, Boğaz arka
// planındaki martı gökyüzünden ayrıldı (assets/environment/ambient/marti.png).
// Performans: olay yokken hiçbir şey çizilmez; olay sırasında 3-5 görüntü,
// yalnız transform (gölge, maske yok). Zamanlayıcılar JS tarafında, kare başına iş yok.
import { memo, useEffect, useRef, useState } from "react";
import { Image, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming, type SharedValue } from "react-native-reanimated";

export const AMBIENT_ON = true as boolean;

const GULL = require("@/assets/environment/ambient/marti.png");
const GULL_W = 222;
const GULL_H = 103;
const FLIGHT_MS = 7500;

type Flock = { key: number; dir: 1 | -1; y: number; birds: { dx: number; dy: number; s: number; ph: number }[] };

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

const Gull = memo(function Gull({ t, W, f, b }: { t: SharedValue<number>; W: number; f: Flock; b: Flock["birds"][number] }) {
  const w = 34 * b.s;
  const h = (w * GULL_H) / GULL_W;
  const st = useAnimatedStyle(() => {
    const k = t.value;
    const span = W + 260;
    const x = f.dir === 1 ? -130 + k * span + b.dx : W + 130 - k * span - b.dx;
    const flap = 0.72 + 0.28 * Math.abs(Math.sin(k * 38 + b.ph));
    return {
      opacity: k <= 0 || k >= 1 ? 0 : 1,
      transform: [
        { translateX: x },
        { translateY: f.y + b.dy + Math.sin(k * 6 + b.ph) * 6 },
        { scaleX: f.dir === 1 ? 1 : -1 },
        { scaleY: flap },
      ],
    };
  });
  return (
    <Animated.View style={[{ position: "absolute", left: 0, top: 0, width: w, height: h }, st]}>
      <Image source={GULL} style={{ width: "100%", height: "100%" }} resizeMode="stretch" fadeDuration={0} />
    </Animated.View>
  );
});

function FlockView({ f, W, onDone }: { f: Flock; W: number; onDone: () => void }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withTiming(1, { duration: FLIGHT_MS, easing: Easing.linear });
    const id = setTimeout(onDone, FLIGHT_MS + 100);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {f.birds.map((b, i) => (
        <Gull key={i} t={t} W={W} f={f} b={b} />
      ))}
    </>
  );
}

/** Oyun sürerken arada bir martı sürüsü geçirir; uzak vapur düdüğünü onHorn ile ister. */
export function AmbientEvents({ W, H, active, onHorn }: { W: number; H: number; active: boolean; onHorn?: () => void }) {
  const [flock, setFlock] = useState<Flock | null>(null);
  const keyRef = useRef(0);
  useEffect(() => {
    if (!AMBIENT_ON || !active) return;
    let gullTimer: ReturnType<typeof setTimeout>;
    let hornTimer: ReturnType<typeof setTimeout>;
    const nextGulls = (first: boolean) => {
      gullTimer = setTimeout(() => {
        const n = Math.round(rand(3, 5));
        keyRef.current += 1;
        setFlock({
          key: keyRef.current,
          dir: Math.random() < 0.5 ? 1 : -1,
          y: H * rand(0.1, 0.24),
          birds: Array.from({ length: n }, (_, i) => ({ dx: -i * rand(34, 52), dy: (i % 2 ? 1 : -1) * i * rand(6, 12), s: rand(0.75, 1.1), ph: rand(0, 6) })),
        });
        nextGulls(false);
      }, first ? rand(6000, 12000) : rand(18000, 32000));
    };
    const nextHorn = () => {
      hornTimer = setTimeout(() => {
        onHorn?.();
        nextHorn();
      }, rand(40000, 70000));
    };
    nextGulls(true);
    nextHorn();
    return () => {
      clearTimeout(gullTimer);
      clearTimeout(hornTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, W, H]);
  if (!AMBIENT_ON || !flock) return null;
  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }}>
      <FlockView key={flock.key} f={flock} W={W} onDone={() => setFlock(null)} />
    </View>
  );
}
