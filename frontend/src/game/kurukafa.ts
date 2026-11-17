// KURUKAFA (2026-11-16, kullanıcı: "şimdi kurukafaya da başlayalım"; kararlar: %20,
// 5 zıplama, görsel Kıvılcım). İlk duraktan sonra arada bir, iki kule arasındaki
// normal zıplama yayının tepesinde havada bir kurukafa durur. Amca uçarken değerse
// 50/50: kulelerin iniş yüzeyi 5 zıplama boyunca %20 büyür ya da %20 küçülür.
// Kule dizisi değişmez: yerleşim ayrı bir karma (hash) ile, tohumun RNG akışına
// dokunmadan seçilir. Fizik formülleri aynı; yalnız iniş testinde etkin genişlik.
// Rapor: ai_review_evidence/KURUKAFA-ONLINE-2026-11-15/RAPOR.md

import { jumpVelocity, flightGravity } from "./jump";
import { isStopTower } from "./stops";

// Görsel: Kıvılcım (1 çağrı), kullanıcı kabulü 2026-11-16 ("Evet, kabul"; gece külahlı hâli).
export const KURUKAFA_ON = true as boolean;
export const SKULL_SOURCE = require("@/assets/environment/kurukafa/kurukafa.png");

// 2026-11-16 kullanıcı: "random olsun" -> çıkış yeri, yükseklik, etki oranı ve süre rastgele.
export const SKULL_SCALE_MIN = 0.1; // etki oranı %10..%30 arası rastgele (büyüme ya da küçülme)
export const SKULL_SCALE_MAX = 0.3;
export const SKULL_JUMPS_MIN = 3; // etki 3..8 iniş arası rastgele
export const SKULL_JUMPS_MAX = 8;
export const SKULL_MIN_ID = 16; // ilk duraktan (15) sonra
export const SKULL_CHANCE = 0.2; // her boşlukta olasılık; ardışık engeli ile ~12-13 kulede bir
export const SKULL_MIN_GAP = 4; // kullanıcı: "peş peşe de çıkmasın" -> iki kurukafa arası en az 4 kule
export const SKULL_LIFT_MIN = 180; // doğal yay tepesinin üstünde rastgele yükseklik: alçak = kolay,
export const SKULL_LIFT_MAX = 330; // yüksek = uzun basış ister
// Kullanıcı (video 12-42-57): "değince alması lazım" -> toplama, kurukafa dairesi ile
// amcanın çizilen gövdesi (dikdörtgen) değince olur; eskiden merkeze 34 birim gerekiyordu.
export const SKULL_HIT_R = 0.42; // kurukafa çizim boyunun bu oranı kadar yarıçap
export const SKULL_SIZE = 110; // çizim boyu (dünya birimi; kamera 0,4 ile ekranda ~44 nokta)

export function skullHash(seed: number, id: number) {
  "worklet";
  let h = Math.imul((seed ^ 0x9e3779b9) | 0, 0x85ebca6b) ^ Math.imul(id + 0x632be5ab, 0xc2b2ae35);
  h ^= h >>> 15;
  h = Math.imul(h, 0x2c1b3c6d);
  h ^= h >>> 12;
  h = Math.imul(h, 0x297a2d39);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

function baseSkull(seed: number, id: number) {
  "worklet";
  return id >= SKULL_MIN_ID && !isStopTower(id) && !isStopTower(id + 1) && skullHash(seed, id) < SKULL_CHANCE;
}

/** id kulesinden sonraki boşlukta kurukafa var mı? Rastgele, ama önceki SKULL_MIN_GAP boşlukta yoksa. */
export function skullAfter(seed: number, id: number) {
  "worklet";
  if (!baseSkull(seed, id)) return false;
  for (let j = id - SKULL_MIN_GAP; j < id; j++) if (baseSkull(seed, j)) return false;
  return true;
}

/** Kurukafa dairesi amcanın gövde dikdörtgenine değiyor mu? */
export function skullTouches(sx: number, sy: number, r: number, left: number, top: number, right: number, bottom: number) {
  "worklet";
  const cx = Math.max(left, Math.min(sx, right));
  const cy = Math.max(top, Math.min(sy, bottom));
  const dx = sx - cx;
  const dy = sy - cy;
  return dx * dx + dy * dy <= r * r;
}

/** Bu kurukafanın yay tepesinin ne kadar üstünde duracağı (rastgele, tohumla sabit). */
export function skullLift(seed: number, id: number) {
  "worklet";
  return SKULL_LIFT_MIN + skullHash(seed ^ 0x5bd1e995, id) * (SKULL_LIFT_MAX - SKULL_LIFT_MIN);
}

/** Alındığı an: çarpan (×0,7..0,9 ya da ×1,1..1,3) ve süre (3..8 iniş). Haritanın tohumu ve
 *  kurukafanın kulesinden türetilir: aynı haritayı oynayan iki kişi aynı etkiyi alır (meydan okuma). */
export function rollSkullEffect(seed: number, id: number) {
  "worklet";
  const mag = SKULL_SCALE_MIN + skullHash(seed ^ 0x27d4eb2f, id) * (SKULL_SCALE_MAX - SKULL_SCALE_MIN);
  const k = skullHash(seed ^ 0x165667b1, id) < 0.5 ? 1 + mag : 1 - mag;
  const jumps = SKULL_JUMPS_MIN + Math.floor(skullHash(seed ^ 0x3c6ef372, id) * (SKULL_JUMPS_MAX - SKULL_JUMPS_MIN + 1));
  return { k, jumps };
}

type P = { x: number; topY: number; width: number };

/** prev kulesinin ortasından next kulesinin ortasına inen zıplamanın yay tepesi (+lift). */
export function skullPoint(prev: P, next: P, halfH: number, screenWidth: number, lift: number) {
  "worklet";
  const g = flightGravity(screenWidth);
  const x0 = prev.x + prev.width / 2;
  const targetDx = next.x + next.width / 2 - x0;
  const dy = next.topY - prev.topY;
  let lo = 0;
  let hi = 1;
  for (let k = 0; k < 24; k++) {
    const c = (lo + hi) / 2;
    const v = jumpVelocity(c, screenWidth);
    const disc = v.vy * v.vy + 2 * g * dy;
    const t = (-v.vy + Math.sqrt(Math.max(0, disc))) / g;
    if (v.vx * t < targetDx) lo = c;
    else hi = c;
  }
  const v = jumpVelocity((lo + hi) / 2, screenWidth);
  const ta = -v.vy / g;
  return { x: x0 + v.vx * ta, y: prev.topY - halfH + v.vy * ta + 0.5 * g * ta * ta - lift };
}

/** Etkin iniş genişliği: kule ortası sabit, genişlik × k. */
export function scaledPlatforms<T extends P>(list: readonly T[], k: number): T[] {
  "worklet";
  const out: T[] = [];
  for (let i = 0; i < list.length; i++) {
    const p = list[i];
    out.push({ ...p, x: p.x + (p.width * (1 - k)) / 2, width: p.width * k });
  }
  return out;
}
