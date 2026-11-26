// GORSEL-008 R12 (accepted; nine poses, supersedes R11 five): charge-driven character pose (VISUAL ONLY).
// Nine measured keyframes at charge 0/12.5/25/.../100 %. All five PNGs share ONE
// pixel scale (no per-pose resizing) and feet_span is NOT constant (heel lift
// narrows it), so every pose is placed by the stable foot anchor from
// charge-r11-olcu-pivot.json = midpoint of the two toe tips, which stay
// planted: identical world point in every pose. anchorY = lowest opaque row+1.
// The single scale is derived from the R11 IDLE bottom-band feet span (271 px)
// so the idle keeps the physical sole span used before (not a global-scale
// change).
// GORSEL-016 / OYUN_AKISI-003 (2026-09-23): recalibrated to match a REAL
// measured Spring Ninja idle proportion instead of a felt trim. Measured
// from the long Spring Ninja reference recording (~/Downloads/
// ScreenRecording_09-12-2026 17-48-03_1.MP4, 1320x2868, the "uzun video"):
// two independent idle frames (t=34.5s, t=35.0s), pixel-thresholded
// head-top-to-spring-base (the reference game's own foot-contact point)
// against the play-area height (status bar to home-indicator, 2346px of the
// 2868px frame) gave 158px and 170px -> ratio 0.0674 and 0.0725, averaged to
// a target foot-to-head-top screen ratio of ~0.070 (7%).
//
// GORSEL-017 / OYUN_AKISI-004 (2026-09-23, user-authorized): re-tuned again,
// this time against TWO joint targets from the new panel-based course
// (panel-course.ts): (1) idle height ~10-12% of the playable screen height
// (H), (2) the sprite's own physical foot span ~55-65% of
// STANDARD_TABLA_WIDTH (64 world units, the single standardized landing
// width every panel's painted chimney cap now collides against). Both are
// satisfied by the SAME scale, not independently guessed:
//   heightRatio(0.11) -> scale = 0.11*H / (cameraZoom*SPRITE_SCALE*1103)
//                      = 0.11*844 / (0.62*0.2049*1103) ~= 0.6625
//   footSpanRatio at that scale = (55.52*0.6625) / 64 = 36.79/64 ~= 57.5%
// -- inside the 55-65% target, so 0.11 (mid-range of "10-12%") was used
// directly rather than needing a compromise between the two asks. Height
// ratio verified live: 0.6625 -> ~11.0% of a 390x844 screen (see AI_REVIEW.md
// GORSEL-017 section for the DOM-measured on-device numbers).
// The world anchor point itself is still NOT moved by this (ChargePoses
// applies scale around pose.pivotX/Y, see ChargePoses.tsx) -- physical foot
// pivot, collision box (PW/PH), footSoles, jump/landing math and procedural
// reachability are all untouched; this is a render-only multiplier.
// REVIZYON-058: these 11% figures describe the former cameraZoom=0.62.
// With the same sprite scale at cameraZoom=0.40, visible idle height is
// about 0.11 * 0.40 / 0.62 = 7.1% of H, near the measured Spring Ninja 7%.
export const GLOBAL_VISUAL_SCALE = 0.6625;

export const POSE_FEET_SPAN_PX = 271;
// Idle's bottom-band feet centre (pivotX 224) stays on the physical sole
// centre as before; the shared world anchor sits this many sprite px to its
// right (idle stable anchor 308 - 224).
export const ANCHOR_SHIFT_PX = 308 - 224;

// FAZ2-IFADE (2026-11-12, kullanıcı: "Evet, bağla ve kur"): şarj arttıkça yüz
// ifadesi değişir. %50/%62 gergin, %75/%87 ıkınma, %100 patlamak üzere.
// Yalnız baş bölgesi (üst 502 px) değişti; tuval, pivot ve gövde aynı.
// false = eski R12 yüzleri.
export const FAZ2_IFADE = true;

export const CHARGE_POSES = [
  { source: require("@/assets/characters/charge-000-r12.png"), w: 516, h: 1103, pivotX: 308, pivotY: 1103 },
  { source: require("@/assets/characters/charge-012-r12.png"), w: 516, h: 1080, pivotX: 311, pivotY: 1080 },
  { source: require("@/assets/characters/charge-025-r12.png"), w: 516, h: 1056, pivotX: 310, pivotY: 1056 },
  { source: require("@/assets/characters/charge-037-r12.png"), w: 516, h: 1031, pivotX: 309, pivotY: 1031 },
  { source: (FAZ2_IFADE ? require("@/assets/characters/charge-050-r12-ifade.png") : require("@/assets/characters/charge-050-r12.png")), w: 516, h: 1005, pivotX: 306, pivotY: 1005 },
  { source: (FAZ2_IFADE ? require("@/assets/characters/charge-062-r12-ifade.png") : require("@/assets/characters/charge-062-r12.png")), w: 516, h: 979, pivotX: 302, pivotY: 979 },
  { source: (FAZ2_IFADE ? require("@/assets/characters/charge-075-r12-ifade.png") : require("@/assets/characters/charge-075-r12.png")), w: 516, h: 951, pivotX: 298, pivotY: 951 },
  { source: (FAZ2_IFADE ? require("@/assets/characters/charge-087-r12-ifade.png") : require("@/assets/characters/charge-087-r12.png")), w: 516, h: 922, pivotX: 293, pivotY: 922 },
  { source: (FAZ2_IFADE ? require("@/assets/characters/charge-100-r12-ifade.png") : require("@/assets/characters/charge-100-r12.png")), w: 516, h: 892, pivotX: 288, pivotY: 892 },
] as const;

/**
 * R12: nine keyframes 12.5 % apart. Exactly ONE pose is visible at any charge
 * (nearest keyframe): a hard switch, so two full-body silhouettes are never
 * drawn at once (no ghosting). Adjacent poses share head pixels 1:1, the same
 * shoe pixels and the same toe anchor, so a switch only moves body parts by a
 * few px; 12.5 % of charge lasts ~3.4 frames at 60 Hz, so the crouch reads as
 * continuous motion.
 */
export function poseOpacity(i: number, c: number) {
  "worklet";
  const idx = Math.round(Math.min(1, Math.max(0, c)) * (CHARGE_POSES.length - 1));
  return idx === i ? 1 : 0;
}

// BEDEN DİLİ (2026-11-23, Kıvılcım, kullanıcı "Kabul, bağla"): inişten sonra kısa tepki pozları.
// Ölçek charge-000 ile aynı; pivotX = ölçülen ayak ortası + 86 (charge-000: 222 → 308 sabit çapa), pivotY = ayak tabanı.
// Dizi sırası tepki kodu 1..3: 1 silkele (kusursuz), 2 denge (kıl payı), 3 oh be (3+ kule).
export const REACTION_POSES = [
  { source: require("@/assets/characters/beden/amca-silkele.png"), w: 516, h: 1103, pivotX: 306, pivotY: 1103 },
  { source: require("@/assets/characters/beden/amca-denge.png"), w: 1100, h: 1103, pivotX: 629, pivotY: 1103 },
  { source: require("@/assets/characters/beden/amca-ohbe.png"), w: 1100, h: 1103, pivotX: 636, pivotY: 1103 },
  // UCUS-POZ (2026-11-26, kullanıcı kabul: "Yes, add it"): Kıvılcım "ağır çekim süzülme" (k = 4, yalnız uçuşta).
  // Kıvılcım 1300×1210 çizip 1100×1103'e küçülttü → referanstan ~%13 küçük; kutu ×1,15 büyütülür.
  // Pivot: ağırlık merkezi (551,519)×1,15 + denge pozundaki merkez→ayak farkı (75,595) — gövde, duruş pozuyla aynı yerde.
  { source: require("@/assets/characters/beden/amca-ucus-suzulme.png"), w: 1265, h: 1268, pivotX: 708, pivotY: 1192 },
  // UCUS-ARA-KARE (2026-11-26, kullanıcı kabul: "Yes, add both"): Kıvılcım fırlama (k = 5) ve dalış (k = 6), yalnız uçuşta.
  // Ölçek: yüz alanı charge-000 ile aynı çıktı (1,02 / 1,01); süzülme ×1,15 kaldığı için ikisi ×0,96 (baş sıçraması ~%4'e iner).
  // Pivot: yüz ağırlık merkezi süzülmedeki yerine (pivotun 77 px sağı, 838 px üstü) oturur — kareler arası baş yerinde kalır.
  { source: require("@/assets/characters/beden/amca-ucus-firlama.png"), w: 1149, h: 1261, pivotX: 809, pivotY: 1174 },
  { source: require("@/assets/characters/beden/amca-ucus-dalis.png"), w: 1204, h: 1204, pivotX: 633, pivotY: 1315 },
] as const;

/** Tepki pozu şu an görünür mü? Yalnız yerde (PHASE.IDLE) ve hiçbir kıyafet/efekt katmanı görünmüyorken.
 *  İnişten sonraki çömelme toparlanmasını (poseCharge'ın sıfıra inişi) BEKLEMEZ: tepki iniş anında başlar,
 *  o sırada bütün şarj pozları gizlenir; yeni şarj (PHASE.CHARGING) ya da havalanma tepkiyi anında bitirir.
 *  (Son kontrol bulgusu: eskiden poseCharge ≤ 0,001 beklendiği için 900 ms'lik poz ~0,5 sn görünüyordu.) */
// Tepki pozunun ayak noktası sabit kalsın diye ölçek telafisi (RN ölçeği görünüm merkezine göre uygular).
// SX/SY birleşik ölçek (landPulse × yerleşme). sx=sy=1 iken dy eski extraY = h·scale·(1−sq)/2 ile aynı.
export function reactionPivotFix(pivotX: number, pivotY: number, w: number, h: number, scale: number, SX: number, SY: number) {
  "worklet";
  return { dx: -(pivotX - w / 2) * scale * (SX - 1), dy: -(pivotY - h / 2) * scale * (SY - 1) };
}
// DÜŞÜŞ (2026-11-23, plan AMCA-DUSUS): düşüş kesinleşince iki karelik "eyvah" çırpınması. 1100×1103, ölçek charge-000 ile
// aynı; pivot baş hizasından ölçüldü (charge-000 baş ağırlık merkezi pivotun 45 px solunda, tepe y=1; burada baş x≈544, tepe y≈6).
export const FALL_POSES = [
  { source: require("@/assets/characters/beden/amca-dusus-1.png"), w: 1100, h: 1103, pivotX: 590, pivotY: 1108 },
  { source: require("@/assets/characters/beden/amca-dusus-2.png"), w: 1100, h: 1103, pivotX: 590, pivotY: 1108 },
] as const;
// Yağmurluklu hâli (2026-11-23, kullanıcı kabulü "Kabul, bağla"): aynı poz/tuval/pivot, yağmurluk + kasket.
export const FALL_POSES_YAGMUR = [
  require("@/assets/characters/beden/amca-dusus-1-yagmur.png"),
  require("@/assets/characters/beden/amca-dusus-2-yagmur.png"),
] as const;
// Kış hâli (bere + atkı; kullanıcı kabulü "Kabul, bağla"): tuval 1100×1203, poz 100 px aşağıda (ponpon kesilmesin) →
// aynı kutuda üstten -100 px kaydırılarak çizilir; eşdeğer pivot (590, 1208).
export const FALL_POSES_KIS = [
  require("@/assets/characters/beden/amca-dusus-1-kis.png"),
  require("@/assets/characters/beden/amca-dusus-2-kis.png"),
] as const;
export const FALL_KIS_H = 1203;
export const FALL_KIS_TOP = -100;
// Şemsiyeli hâli (Kıvılcım; amca yağmurluk karelerine göre ölçek 1,11/1,06 ile hizalandı): tuval 1100×1603, poz 500 px aşağıda.
export const FALL_POSES_SEMSIYE = [
  require("@/assets/characters/beden/amca-dusus-1-semsiye.png"),
  require("@/assets/characters/beden/amca-dusus-2-semsiye.png"),
] as const;
export const FALL_SEMSIYE_H = 1603;
export const FALL_SEMSIYE_TOP = -500;
// Pijama (gece külahı + terlik) ve özel gün aksesuarlarının düşüş karelerindeki kutuları (1100×1103 tuval pikseli; rot derece,
// kutu merkezine göre). Kıvılcım AMCA-DUSUS-DIGER, kullanıcı kabulü "Kabul, bağla" (2026-11-23).
export type FallBox = { x: number; y: number; w: number; h: number; rot: number };
export const FALL_BOXES: Record<string, FallBox>[] = [
  { "gece-kulahi": { x: 250, y: -60, w: 530, h: 454, rot: -7 }, "terlik-sol": { x: 185, y: 805, w: 230, h: 113, rot: 28 }, "terlik-sag": { x: 785, y: 780, w: 230, h: 113, rot: -32 }, "yilbasi": { x: 270, y: -118, w: 560, h: 301, rot: -6 }, "cadilar": { x: 265, y: -182, w: 560, h: 361, rot: -7 }, "paskalya": { x: 385, y: -170, w: 360, h: 324, rot: -7 }, "bahar": { x: 282, y: -10, w: 540, h: 202, rot: -6 }, "23nisan": { x: 270, y: -105, w: 560, h: 281, rot: -6 }, "sevgili-gozluk": { x: 495, y: 160, w: 300, h: 105, rot: 3 } },
  { "gece-kulahi": { x: 255, y: -60, w: 530, h: 454, rot: -7 }, "terlik-sol": { x: 255, y: 855, w: 230, h: 113, rot: 30 }, "terlik-sag": { x: 760, y: 610, w: 230, h: 113, rot: -55 }, "yilbasi": { x: 275, y: -118, w: 560, h: 301, rot: -6 }, "cadilar": { x: 270, y: -182, w: 560, h: 361, rot: -7 }, "paskalya": { x: 390, y: -170, w: 360, h: 324, rot: -7 }, "bahar": { x: 287, y: -10, w: 540, h: 202, rot: -6 }, "23nisan": { x: 275, y: -105, w: 560, h: 281, rot: -6 }, "sevgili-gozluk": { x: 500, y: 160, w: 300, h: 105, rot: 3 } },
];
export const DUSUS_KARE_MS = 110;
// Artık hiçbir kıyafet düşüşü engellemez (her biri için kare ya da bindirme var); giysi parametresi geriye uyum için 0 verilir.
export function fallVisible(d: number, giysi: number) {
  "worklet";
  return d > 0 && giysi <= 0.01;
}
// Düşüş kesin mi: yukarıdan aşağı inerken ayak çizgisi, inişte kullanılan listenin TÜM platform yüzeylerinin altındaysa
// (findFootLanding yalnız bir topY'yi yukarıdan geçerken iniş bulur) artık hiçbir yere inilemez.
export function dususKesin(vy: number, feetY: number, list: readonly { topY: number }[]) {
  "worklet";
  if (vy <= 0 || list.length === 0) return false;
  let maxTop = -1e12;
  for (let i = 0; i < list.length; i++) if (list[i].topY > maxTop) maxTop = list[i].topY;
  return feetY > maxTop;
}
export function reactionVisible(t: number, phase: number, outfit: number) {
  "worklet";
  return t > 0 && phase === 0 && outfit <= 0.01;
}
