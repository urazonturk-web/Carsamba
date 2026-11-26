// RIG: parçalı amca (yalnız çizim). Pozu ve görünürlüğü app/index.tsx kare döngüsü verir; burada yalnız
// ileri kinematikle her parçanın yeri hesaplanır. Uzak kol/bacak aynı parçanın koyulaştırılmış kopyası.
import React from "react";
import { Image } from "react-native";
import Animated, { useAnimatedStyle, useDerivedValue, SharedValue } from "react-native-reanimated";
import { RIG_PARCA, EK, RIG_K, RIG_LS, rigFK } from "./rig";

type Props = {
  px: SharedValue<number>;
  py: SharedValue<number>;
  scale: number;
  feetCenterOffset: number;
  feetHalf: number;
  gor: { value: number }; // 0/1
  poz: { value: number[] };
};
/** Kalçanın ayak noktasına göre yatay kayması (poz pikseli; charge-000 taban ortası pivotun 86 px solunda). */
export const RIG_DX = -100;
/** Kalça yüksekliği: ayakta bacak boyu (poz pikseli). */
const BACAK = (266 - 34 + 299 - 28) * RIG_LS * RIG_K;

type ParcaAd = keyof typeof RIG_PARCA;
// fk sırası: 0 uzakKolÜst, 1 uzakÖnKol, 2 uzakUyluk, 3 uzakBaldır, 4 etek, 5 gövde, 6 yakınUyluk, 7 yakınBaldır, 8 baş, 9 yakınKolÜst, 10 yakınÖnKol
const KATMAN: { ad: ParcaAd; fk: number; pv: readonly [number, number]; uzv: boolean; koyu: boolean; kosul?: number }[] = [
  { ad: "ustKol", fk: 0, pv: EK.ustKolUst, uzv: true, koyu: true },
  { ad: "onKolEl", fk: 1, pv: EK.onKolUst, uzv: true, koyu: true },
  { ad: "uyluk", fk: 2, pv: EK.uylukUst, uzv: true, koyu: true },
  { ad: "baldir", fk: 3, pv: EK.baldirUst, uzv: true, koyu: true },
  { ad: "etek", fk: 4, pv: EK.etekUst, uzv: false, koyu: false, kosul: 1 },
  { ad: "govde", fk: 5, pv: EK.govdeKalca, uzv: false, koyu: false },
  { ad: "uyluk", fk: 6, pv: EK.uylukUst, uzv: true, koyu: false },
  { ad: "baldir", fk: 7, pv: EK.baldirUst, uzv: true, koyu: false },
  { ad: "bas", fk: 8, pv: EK.basBoyun, uzv: false, koyu: false, kosul: 2 },
  { ad: "basSaskin", fk: 8, pv: EK.basSBoyun, uzv: false, koyu: false, kosul: 3 },
  { ad: "ustKol", fk: 9, pv: EK.ustKolUst, uzv: true, koyu: false },
  { ad: "onKolEl", fk: 10, pv: EK.onKolUst, uzv: true, koyu: false, kosul: 4 },
  { ad: "onKolYumruk", fk: 10, pv: EK.yumrukUst, uzv: true, koyu: false, kosul: 5 },
];

function Parca({ k, fk, gor, poz, px, py, scale, feetCenterOffset, feetHalf }: Props & { k: (typeof KATMAN)[number]; fk: { value: { x: number; y: number; a: number }[] } }) {
  const P = RIG_PARCA[k.ad];
  const s = scale * RIG_K * (k.uzv ? RIG_LS : 1);
  const W = P.w * s, H = P.h * s;
  const pvx = k.pv[0] * s, pvy = k.pv[1] * s;
  const style = useAnimatedStyle(() => {
    const f = fk.value[k.fk];
    const p = poz.value;
    let op = gor.value;
    if (k.kosul === 1) op *= p[13];
    else if (k.kosul === 2) op *= p[11] > 0.5 ? 0 : 1;
    else if (k.kosul === 3) op *= p[11] > 0.5 ? 1 : 0;
    else if (k.kosul === 4) op *= p[12] > 0.5 ? 0 : 1;
    else if (k.kosul === 5) op *= p[12] > 0.5 ? 1 : 0;
    const X = px.value + feetCenterOffset + (RIG_DX + f.x) * scale;
    const Y = py.value + feetHalf - BACAK * scale + f.y * scale;
    return {
      opacity: op,
      transform: [
        { translateX: X - W / 2 }, { translateY: Y - H / 2 },
        { rotate: `${f.a}deg` },
        { translateX: W / 2 - pvx }, { translateY: H / 2 - pvy },
      ],
    };
  });
  return (
    <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, width: W, height: H }, style]}>
      <Image source={P.src} fadeDuration={0} resizeMode="stretch" style={{ width: "100%", height: "100%" }} />
      {k.koyu ? (
        <Image source={P.src} fadeDuration={0} resizeMode="stretch" tintColor="#1a0608"
          style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", opacity: 0.3 }} />
      ) : null}
    </Animated.View>
  );
}

export function RigAmca(props: Props) {
  const fk = useDerivedValue(() => rigFK(props.poz.value));
  return <>{KATMAN.map((k, i) => <Parca key={i} k={k} fk={fk} {...props} />)}</>;
}
