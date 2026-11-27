// RIG (2026-11-26, kullanıcı: "Build the rig" → "Yes, draw parts"; plan ai_review_evidence/RIG-2026-11-26/PLAN.md).
// Amcanın uçuşu parçalı (iskelet) animasyon: baş, gövde, ceket eteği, kol, bacak eklemlerden döner; pozlar
// yalnız açı tablosudur ve her karede yumuşak karışır → ani resim değişimi yok, baş/yüz hep aynı.
// YALNIZ ÇİZİM: fizik, kamera, çarpışma, puan okumaz/yazmaz. RIG_ON false → bugünkü çizimli uçuş.
export const RIG_ON = false as boolean; // 27.11 telefon videosu: kâğıt kukla görünümü, kapatıldı

/** Parça sayfası pikselinden poz pikseline (charge-000 ile aynı baş boyu; yüz alanından ölçüldü). */
export const RIG_K = 1.437;
/** Kol/bacak parçaları baş ve gövdeye göre bu oranda (karikatür oranı: büyük baş). */
export const RIG_LS = 0.8;

export const RIG_PARCA = {
  bas: { src: require("@/assets/characters/rig/bas.png"), w: 400, h: 406 },
  basSaskin: { src: require("@/assets/characters/rig/bas-saskin.png"), w: 406, h: 407 },
  govde: { src: require("@/assets/characters/rig/govde.png"), w: 240, h: 369 },
  etek: { src: require("@/assets/characters/rig/etek.png"), w: 339, h: 243 },
  ustKol: { src: require("@/assets/characters/rig/ust-kol.png"), w: 120, h: 271 },
  onKolEl: { src: require("@/assets/characters/rig/on-kol-el.png"), w: 138, h: 278 },
  onKolYumruk: { src: require("@/assets/characters/rig/on-kol-yumruk.png"), w: 131, h: 260 },
  uyluk: { src: require("@/assets/characters/rig/uyluk.png"), w: 167, h: 300 },
  baldir: { src: require("@/assets/characters/rig/baldir.png"), w: 189, h: 299 },
} as const;

// Eklem noktaları (parça yerel pikseli; ai_review_evidence/RIG-2026-11-26/eklemler.json, alfa ağırlık merkezinden).
export const EK = {
  basBoyun: [168, 383], basSBoyun: [178, 384],
  govdeBoyun: [102, 34], govdeOmuz: [110, 74], govdeKalca: [120, 343], govdeEtek: [80, 313],
  etekUst: [288, 24],
  ustKolUst: [59, 30], ustKolAlt: [67, 239],
  onKolUst: [47, 26], yumrukUst: [45, 25],
  uylukUst: [81, 34], uylukAlt: [98, 266],
  baldirUst: [79, 28],
} as const;

/** Ayakta bacak boyu (kalça → taban), parça pikseli. Kalça ayak noktasının bu kadar üstünde durur. */
export const RIG_BACAK = (266 - 34 + 299 - 28) * RIG_LS;

/**
 * Poz: [gövde, baş, yakınKol1, yakınKol2, uzakKol1, uzakKol2, yakınBacak1, yakınBacak2, uzakBacak1, uzakBacak2, etek, şaşkın(0/1), yumruk(0/1)]
 * Açılar derece, ekranda saat yönü +, MUTLAK (ekrana göre; önizleme onizle.py ile aynı). Sarkan uzuv için − = öne.
 */
type Poz = readonly number[];
export const RIG_POZ: Record<string, Poz> = {
  durus: [0, 0, 5, -5, -5, -5, -3, 3, 3, 3, -999, 0, 0],
  itis: [20, -10, 50, 20, 45, 20, -45, 60, 25, 10, -999, 1, 0],
  firlama: [40, -25, 80, 10, 70, 10, 30, 5, 40, 5, 20, 1, 0],
  suzulme: [25, -15, -120, -10, 110, 20, -80, 90, 60, 20, 30, 0, 0],
  toplanma: [25, -10, -50, -60, 30, -40, -100, 120, -70, 110, 20, 1, 0],
  dalis: [20, 5, 60, -100, -60, -20, -110, 130, -100, 125, -30, 0, 1],
  uzanma: [8, 0, -40, -10, 40, 10, -35, 40, -20, 35, -10, 0, 0],
  cokme: [20, -5, -45, -15, -20, -20, -80, 110, -70, 105, -999, 0, 0],
};
// Uçuş zaman çizelgesi: r = vy / vy0 (kalkışta −1, tepede 0, kalkış yüksekliğinde +1).
const UCUS_R = [-1, -0.88, -0.72, -0.15, 0.22, 0.5, 0.92];
const UCUS_P = [RIG_POZ.durus, RIG_POZ.itis, RIG_POZ.firlama, RIG_POZ.suzulme, RIG_POZ.toplanma, RIG_POZ.dalis, RIG_POZ.uzanma];

function karis(a: Poz, b: Poz, t: number, out: number[]) {
  "worklet";
  const s = t * t * (3 - 2 * t); // yumuşak adım
  for (let i = 0; i < a.length; i++) {
    const x = a[i], y = b[i];
    if (i === 10) { // etek: −999 = gizli; görünürlüğü ayrı karışır (indeks 13 = etek opaklığı)
      const xa = x === -999 ? 0 : 1, ya = y === -999 ? 0 : 1;
      out[13] = xa + (ya - xa) * s;
      out[10] = (x === -999 ? y : x) + ((y === -999 ? x : y) - (x === -999 ? y : x)) * s;
      if (x === -999 && y === -999) out[10] = 0;
    } else out[i] = x + (y - x) * s;
  }
}

/** Uçuşta r'ye göre poz (14 değer: 13 poz alanı + etek opaklığı). */
export function rigUcus(r: number) {
  "worklet";
  const out = new Array(14).fill(0) as number[];
  if (r <= UCUS_R[0]) { karis(UCUS_P[0], UCUS_P[0], 0, out); return out; }
  for (let i = 0; i < UCUS_R.length - 1; i++) {
    if (r <= UCUS_R[i + 1]) { karis(UCUS_P[i], UCUS_P[i + 1], (r - UCUS_R[i]) / (UCUS_R[i + 1] - UCUS_R[i]), out); return out; }
  }
  karis(UCUS_P[UCUS_P.length - 1], UCUS_P[UCUS_P.length - 1], 0, out);
  return out;
}

/** İniş: w 1 → 0 iken çökme → duruş. */
export function rigInis(w: number) {
  "worklet";
  const out = new Array(14).fill(0) as number[];
  karis(RIG_POZ.durus, RIG_POZ.cokme, Math.max(0, Math.min(1, w)), out);
  return out;
}

/** Kalkış: itişe girerken duruştan (u 0 → 1). */
export function rigKalkis(u: number) {
  "worklet";
  const out = new Array(14).fill(0) as number[];
  karis(RIG_POZ.durus, RIG_POZ.itis, Math.max(0, Math.min(1, u)), out);
  return out;
}

/** Parça dünya dönüşümü: pivot noktası (X,Y) poz pikselinde (kalça = 0,0), toplam açı. */
export type Yer = { x: number; y: number; a: number };
function don(px: number, py: number, a: number) {
  "worklet";
  const r = (a * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
  return [px * c - py * s, px * s + py * c];
}

/**
 * İleri kinematik. Döner: her parça için pivotun kalçaya göre yeri (poz pikseli) ve açısı.
 * Sıra: 0 uzakKolÜst, 1 uzakÖnKol, 2 uzakUyluk, 3 uzakBaldır, 4 etek, 5 gövde, 6 yakınUyluk, 7 yakınBaldır, 8 baş, 9 yakınKolÜst, 10 yakınÖnKol
 */
export function rigFK(p: number[]) {
  "worklet";
  const K = RIG_K, L = RIG_K * RIG_LS;
  const g = p[0];
  // gövde pivotu kalça
  const omuz = don((EK.govdeOmuz[0] - EK.govdeKalca[0]) * K, (EK.govdeOmuz[1] - EK.govdeKalca[1]) * K, g);
  const boyun = don((EK.govdeBoyun[0] - EK.govdeKalca[0]) * K, (EK.govdeBoyun[1] - EK.govdeKalca[1]) * K, g);
  const etekN = don((EK.govdeEtek[0] - EK.govdeKalca[0]) * K, (EK.govdeEtek[1] - EK.govdeKalca[1]) * K, g);
  const kol = (a1: number, a2: number) => {
    "worklet";
    const d = don((EK.ustKolAlt[0] - EK.ustKolUst[0]) * L, (EK.ustKolAlt[1] - EK.ustKolUst[1]) * L, a1);
    return [{ x: omuz[0], y: omuz[1], a: a1 }, { x: omuz[0] + d[0], y: omuz[1] + d[1], a: a2 }];
  };
  const bacak = (a1: number, a2: number) => {
    "worklet";
    const d = don((EK.uylukAlt[0] - EK.uylukUst[0]) * L, (EK.uylukAlt[1] - EK.uylukUst[1]) * L, a1);
    return [{ x: 0, y: 0, a: a1 }, { x: d[0], y: d[1], a: a2 }];
  };
  const yk = kol(p[2], p[3]), uk = kol(p[4], p[5]);
  const yb = bacak(p[6], p[7]), ub = bacak(p[8], p[9]);
  return [
    uk[0], uk[1], ub[0], ub[1],
    { x: etekN[0], y: etekN[1], a: p[10] },
    { x: 0, y: 0, a: g },
    yb[0], yb[1],
    { x: boyun[0], y: boyun[1], a: p[1] },
    yk[0], yk[1],
  ];
}
