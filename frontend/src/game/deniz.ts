// MARTI KAPTI — gri kutu denemesi (2026-11-27, kullanıcı "Evet, dene"; rapor ai_review_evidence/MERAK2-2026-11-27/RAPOR.md).
// Havada simit → martı amcayı kapar → listenin ilerisine eklenen deniz bölümüne bırakır:
// 4 konteyner (dev gemi, durağan) → 2 yana sallanan kayık → iskele → kuleler kaldığı yerden sürer.
// Zıplama fiziği (jump.ts), kamera, ana kule üreticisi (procedural-course.ts) DEĞİŞMEZ; bu dosya ayrı üretir.
// Gri kutu: görsel yok (düz renkli kutular + mevcut martı görseli). MARTI_ON false → bugünkü oyun.
import { CONFIG } from "./config";
import { flightGravity, jumpVelocity } from "./jump";
import { isStopTower } from "./stops";

export const MARTI_ON = true as boolean;
/** Gri kutu: her koşuda bu kuleden sonraki boşlukta simit (gerçek sürümde ilk koşu garantili, sonra seyrek). */
export const MARTI_TETIK_ID = 1;
/** Simit, prev→next yayının tepesinin bu kadar üstünde (dünya birimi; alçak = kolay). */
export const SIMIT_LIFT = 60;
export const SIMIT_SIZE = 70;
export const SIMIT_HIT_R = 0.5;
/** Martının taşıma süresi (ms) ve yay yüksekliği (dünya birimi). */
export const TASIMA_MS = 1500;
export const TASIMA_YAY = 260;
/** Taşınma fazı (config.ts PHASE'e eklenmedi; yalnız bu özellik kullanır). */
export const PHASE_CARRIED = 4;

export const KONTEYNER_N = 4;
export const KAYIK_N = 2;
/** Kayığın yana sallanma genliği (dünya birimi; ekranda ×0,4) ve açısal hızı (rad/sn). */
export const KAYIK_AMP = 45;
export const KAYIK_W = 2.2;
/** Erişim payı: tam şarj menzilinin bu oranı kadar boşluk bırakılır (ana üreticideki 0,06'dan cömert). */
const PAY = 0.12;
/** Bölümün kapladığı id sayısı (konteynerler + kayıklar + iskele). */
export const BOLUM_N = KONTEYNER_N + KAYIK_N + 1;

export type DenizP = {
  id: number; x: number; topY: number; width: number; cat: number; visualType: "normal";
  deniz: 1 | 2 | 3; // 1 konteyner, 2 kayık, 3 iskele
  amp: number; w: number; ph: number;
  renk: number;
};

function h01(a: number, b: number) {
  "worklet";
  let h = Math.imul((a ^ 0x2545f491) | 0, 0x9e3779b1) ^ Math.imul(b + 0x7f4a7c15, 0x85ebca77);
  h ^= h >>> 15;
  h = Math.imul(h, 0x2c1b3c6d);
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
}

/** prev'in SOL kenarından hedefin ortasına tam şarjla ulaşılabilen en büyük boşluk (ana üreticiyle aynı tanım, PAY ile). */
function erisimBosluk(prev: { width: number; topY: number }, topY: number, width: number, screenW: number) {
  "worklet";
  const full = jumpVelocity(1, screenW);
  const g = flightGravity(screenW);
  const disc = full.vy * full.vy + 2 * g * (topY - prev.topY);
  const t = (-full.vy + Math.sqrt(Math.max(0, disc))) / g;
  return full.vx * t * (1 - PAY) - prev.width - width / 2;
}

/** Bölüm bir durak kulesine denk gelmesin (durak bandı/kartpostal kaybolmasın). */
export function bolumSigar(ilkId: number) {
  "worklet";
  for (let id = ilkId; id <= ilkId + BOLUM_N; id++) if (isStopTower(id)) return false;
  return true;
}

/** prev'den sonra deniz bölümünü üretir (tohum + id karması; ana RNG akışına dokunmaz). */
export function denizBolumu(prev: { id: number; x: number; topY: number; width: number }, ilkId: number, seed: number, screenW: number): DenizP[] {
  "worklet";
  const out: DenizP[] = [];
  let cur: any = prev;
  let curAmp = 0;
  // Gemi güvertesi: konteyner tepeleri prev'e yakın bir bantta, istif yüksekliği değişken.
  const guverte = Math.min(CONFIG.platformMaxTopY - 40, Math.max(CONFIG.platformMinTopY + 160, prev.topY + 20));
  for (let k = 0; k < BOLUM_N; k++) {
    const id = ilkId + k;
    const r1 = h01(seed, id * 3 + 1), r2 = h01(seed, id * 3 + 2), r3 = h01(seed, id * 3 + 3);
    let tur: 1 | 2 | 3;
    let width: number, topY: number, amp = 0, gapHedef: number;
    if (k < KONTEYNER_N) {
      tur = 1;
      width = CONFIG.widthWide.min + r1 * (CONFIG.widthWide.max - CONFIG.widthWide.min) + 20; // konteyner geniş
      topY = guverte - Math.floor(r2 * 3) * 55; // 1-3 kat istif
      gapHedef = k === 0 ? 170 + r3 * 60 : 90 + r3 * 70; // konteynerler arası kısa
    } else if (k < KONTEYNER_N + KAYIK_N) {
      tur = 2;
      width = CONFIG.widthMedium.min + r1 * (CONFIG.widthMedium.max - CONFIG.widthMedium.min);
      topY = Math.min(CONFIG.platformMaxTopY, guverte + 170); // deniz seviyesi: gemiden aşağı
      amp = KAYIK_AMP;
      gapHedef = 150 + r3 * 60;
    } else {
      tur = 3;
      width = CONFIG.widthWide.max + 30; // iskele: geniş, durağan
      topY = Math.min(CONFIG.platformMaxTopY, guverte + 120);
      gapHedef = 150 + r3 * 50;
    }
    const enCok = erisimBosluk(cur, topY, width, screenW) - curAmp - amp;
    const enAz = curAmp + amp + 24; // sallanırken üst üste binmesin
    const gap = Math.max(enAz, Math.min(gapHedef, enCok));
    const p: DenizP = { id, x: cur.x + cur.width + gap, topY, width, cat: 0, visualType: "normal", deniz: tur, amp, w: KAYIK_W * (0.85 + r2 * 0.3), ph: r1 * Math.PI * 2, renk: Math.floor(r3 * 4) };
    out.push(p);
    cur = p;
    curAmp = amp;
  }
  return out;
}

/** Hareketli yüzeyin o anki x'i. */
export function denizX(q: any, t: number) {
  "worklet";
  return q.amp ? q.x + q.amp * Math.sin(q.w * t + q.ph) : q.x;
}

/** İniş/düşüş testleri için etkin liste (hareketli yüzey yoksa aynı dizi döner). */
export function hareketliListe(list: any[], t: number) {
  "worklet";
  let var_ = false;
  for (let i = 0; i < list.length; i++) if (list[i].amp) { var_ = true; break; }
  if (!var_) return list;
  const out: any[] = [];
  for (let i = 0; i < list.length; i++) {
    const q = list[i];
    out.push(q.amp ? { ...q, x: denizX(q, t) } : q);
  }
  return out;
}
