// KARGALAR (2026-11-22, kullanıcı: "balkonların korkuluklarında, çamaşır iplerinde, çiçeklerin yanlarında
// hareket eden kargalar"). Görseller Kıvılcım KARGA-preview, kullanıcı kabulü "Kabul, bağla".
// Yalnız görsel: cephenin üstünde durur, çatıya / iniş yüzeyine / fiziğe dokunmaz.
export const KARGA_ON = true as boolean;
export const KARGA_TEST = false as boolean; // GEÇİCİ: her kulede 2 karga (simülatör denemesi); teslimde false

export const KARGA_TUNEMIS = require("@/assets/environment/mahalle/karga/karga-tunemis.png");
export const KARGA_BAKIS = require("@/assets/environment/mahalle/karga/karga-bakis.png");
export const KARGA_YEM = require("@/assets/environment/mahalle/karga/karga-yem.png");
export const KARGA_HAVALANMA = require("@/assets/environment/mahalle/karga/karga-havalanma.png");
// Ortak kare tuval; ayakların tutunduğu nokta tuvalde (0.5, 500/600).
export const KARGA_FOOT_X = 0.5;
export const KARGA_FOOT_Y = 500 / 600;
// Tuvalin dünya boyu = amca boyu × bu katsayı (karga ≈ bir saksı, amcanın başından biraz küçük).
export const KARGA_BOX_K = 0.62;
// Video 2026-11-22 21:42: 900'e kadar alt katlara konan kargalar ekranın altında kalıp görünmüyordu.
// Kulenin ekranda görünen üst kısmı ~450 hücre pikseli: kargalar yalnız üst katlarda.
export const KARGA_MAX_Y = 450;

// Tünek noktaları: cephe atlası hücre pikseli (hücre 350 px genişlik, x = hücre içi, y = tünek çizgisi),
// facade-atlas-g018.jpg üzerinde ızgarayla elle ölçüldü. Korkuluk üstü, halı sırığı, çamaşır ipi ucu,
// pencere pervazı (çiçeklerin yanı), cumba çatısı.
export const KARGA_TUNEK: number[][][] = [
  [[90, 188], [175, 700], [175, 960], [100, 1252]],
  [[175, 155], [175, 378], [175, 585], [175, 770], [175, 963], [175, 1190]],
  [[90, 198], [175, 340], [95, 688], [90, 1235]],
  [[175, 212], [175, 498], [175, 710], [175, 1250]],
  [[175, 147], [175, 362], [175, 570], [175, 780], [175, 972], [175, 1180]],
  [[150, 200], [175, 325], [175, 728], [262, 905]],
  [[100, 210], [175, 487], [175, 700], [100, 1250]],
  [[175, 168], [175, 447], [175, 695], [175, 950], [175, 1200]],
  [[85, 190], [175, 518], [175, 965], [85, 1218]],
  [[110, 215], [175, 488], [175, 710], [245, 985], [110, 1245]],
  [[170, 172], [170, 447], [170, 690], [170, 940], [170, 1205]],
  [[75, 155], [175, 310], [175, 748], [175, 998], [75, 1188]],
];

function kHash(id: number, salt: number) {
  "worklet";
  const h = Math.imul((id * 73 + salt * 19) ^ 0x5bd1e995, 0x27d4eb2d) >>> 0;
  return h / 4294967296;
}

// Kulede kaç karga (0-2); ilk 3 kule boş.
export function kargaSayisi(id: number) {
  "worklet";
  if (KARGA_TEST) return 2;
  // 2026-11-22 kullanıcı: "kargalar çok sonradan beliriyor, daha erken belirsin" -> 1. kuleden başlar,
  // 1-2. kulede en az bir karga; genel oran %30 boş, %50 bir, %20 iki.
  if (id < 1) return 0;
  const r = kHash(id, 1);
  if (id <= 2) return r < 0.7 ? 1 : 2;
  return r < 0.3 ? 0 : r < 0.8 ? 1 : 2;
}

// slot (0/1) için tünek: hücre pikseli {x, y} (y = cephe üst kenarından, hücre pikseli) ve yön; yoksa null.
// v = cephe varyantı, period/start = o varyantın dönem ve başlangıç (hücre pikseli).
// minY/maxY: görünür sayılan aralık (hücre pikseli).
export function kargaTunek(id: number, slot: number, v: number, period: number, start: number, minY: number, maxY: number) {
  "worklet";
  if (slot >= kargaSayisi(id)) return null;
  const list = KARGA_TUNEK[v];
  // Aday listesi: 3 dönem boyunca görünür aralıktaki tünekler.
  let n = 0;
  for (let k = 0; k < 3; k++) {
    for (let i = 0; i < list.length; i++) {
      const y = k * period - start + list[i][1];
      if (y >= minY && y <= maxY) n++;
    }
  }
  if (n === 0) return null;
  let pick = Math.floor(kHash(id, 2) * n) % n;
  if (slot === 1) {
    if (n < 2) return null;
    pick = (pick + 1 + Math.floor(kHash(id, 3) * (n - 1))) % n;
  }
  let j = 0;
  for (let k = 0; k < 3; k++) {
    for (let i = 0; i < list.length; i++) {
      const y = k * period - start + list[i][1];
      if (y >= minY && y <= maxY) {
        if (j === pick) return { x: list[i][0], y, flip: kHash(id, 4 + slot) < 0.5 ? 1 : -1, seed: kHash(id, 7 + slot) };
        j++;
      }
    }
  }
  return null;
}

// Duruş döngüsü: 0 tünemiş, 1 bakış, 2 yem. t = ms saat.
export function kargaPoz(t: number, seed: number) {
  "worklet";
  const period = 6000 + seed * 4000;
  const ph = ((t + seed * 9000) % period) / period;
  if (ph < 0.5) return 0;
  if (ph < 0.68) return 1;
  if (ph < 0.9) return 2;
  return 0;
}
// Duruş değişirken küçük sekme (dünya birimi, yukarı negatif).
export function kargaSekme(t: number, seed: number) {
  "worklet";
  const period = 6000 + seed * 4000;
  const ph = ((t + seed * 9000) % period) / period;
  let d = (ph - 0.5) * period;
  if (d < 0 || d >= 220) d = (ph - 0.68) * period;
  if (d < 0 || d >= 220) d = (ph - 0.9) * period;
  if (d < 0 || d >= 220) return 0;
  return -Math.sin((Math.PI * d) / 220) * 10;
}

// 2026-11-23 kullanıcı: "kargalar hayalet gibi olmasın, bir yerlerde dursun; ben civarında zıplarken havalansın,
// sonra başka bir yere konsun; uzaktakiler yalnızca bana doğru kafa çevirsin".
// Uçan / yeni yerine konan karga için: herhangi bir kulenin görünür tüneklerinden, tuz (salt) ile seçilen biri.
export function kargaTunekAny(id: number, salt: number, v: number, period: number, start: number, minY: number, maxY: number) {
  "worklet";
  const list = KARGA_TUNEK[v];
  let n = 0;
  for (let k = 0; k < 3; k++) for (let i = 0; i < list.length; i++) {
    const y = k * period - start + list[i][1];
    if (y >= minY && y <= maxY) n++;
  }
  if (n === 0) return null;
  const pick = Math.floor(kHash(id, 11 + salt) * n) % n;
  let j = 0;
  for (let k = 0; k < 3; k++) for (let i = 0; i < list.length; i++) {
    const y = k * period - start + list[i][1];
    if (y >= minY && y <= maxY) {
      if (j === pick) return { x: list[i][0], y, flip: 1, seed: kHash(id, 21 + salt) };
      j++;
    }
  }
  return null;
}
// Duran karga: çoğunlukla tünemiş, arada "bakış" (yalnız baş döner; gövde aynalanmaz). 0 tünemiş, 1 bakış.
// 2026-11-23 çeşitlilik: her karganın tohumundan dönem 3–9 sn, bakış penceresi %10–30, döngüdeki yeri farklı;
// kargaların dörtte biri seyrek bakar (%10).
export function kargaDurus(t: number, seed: number) {
  "worklet";
  const period = 3000 + seed * 6000;
  const s3 = seed * 3.1, s7 = seed * 7.3, s13 = seed * 13.7;
  const w = s3 - Math.floor(s3) < 0.25 ? 0.1 : 0.1 + (s7 - Math.floor(s7)) * 0.2;
  const ofs = s13 - Math.floor(s13);
  const q = (t + seed * 7000) / period;
  const ph = q - Math.floor(q);
  const dd = ph - ofs + 1;
  return dd - Math.floor(dd) < w ? 1 : 0;
}
// 2026-11-23 (video 13:56 "loopa düşüyor gibi", plan KARGA-DONGU): duran karga için periyotsuz bekleme.
// Zaman 750 ms'lik dilimlere bölünür; her dilimin durumu (tohum, dilim) özetiyle BAĞIMSIZ seçilir:
// %65 tünemiş (0), %20 bakış (1, yalnız baş döner), %15 yem (2, eğilip yoklar). Sabit dönem yok.
export const KARGA_DILIM_MS = 750;
export function kargaBekle(t: number, seed: number) {
  "worklet";
  const sl = Math.floor(t / KARGA_DILIM_MS + seed * 977);
  let h = Math.imul(sl ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(Math.floor(seed * 1e6) | 0, 0xc2b2ae35);
  h = Math.imul(h ^ (h >>> 16), 0x7feb352d);
  h = Math.imul(h ^ (h >>> 15), 0x846ca68b);
  const r = ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  return r < 0.65 ? 0 : r < 0.85 ? 1 : 2;
}
// Kaçış hedefi türü (kac: bu karganın daha önce kaç kez kaçtığı; r: 0..1). Zinciri kırar: yeniden kaçan
// karga amcanın hemen yetişeceği yere konmaz.
export function kargaHedefTuru(kac: number, r: number): "ileri" | "uzak" | "geri" | "gider" {
  if (kac <= 0) return r < 0.55 ? "ileri" : r < 0.75 ? "uzak" : r < 0.9 ? "geri" : "gider";
  if (kac === 1) return r < 0.35 ? "gider" : r < 0.7 ? "geri" : "uzak";
  return r < 0.7 ? "gider" : "geri";
}
// Ayrı karga üreteci (mulberry32): oyunun paylaşılan rastgele akışına dokunmaz.
export function kargaRngYap(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Uçuş konumu ve kanat çırpma (p: 0..1). e: havuz girdisi (x0,y0,x1,y1,arc,wob,wobN,dur). B: tuval boyu.
export function kargaUcus(e: any, p: number, B: number) {
  "worklet";
  const sp = Math.sin(Math.PI * p);
  const wob = Math.sin(2 * Math.PI * e.wobN * p) * e.wob * B * sp;
  let x = e.x0 + (e.x1 - e.x0) * p + wob * 0.6;
  let y = e.y0 + (e.y1 - e.y0) * p - sp * e.arc * B + wob * 0.4;
  if (p > 0.9) y -= Math.sin(((p - 0.9) / 0.1) * Math.PI) * 0.08 * B; // konarken küçük oturma sıçraması
  const flaps = (e.dur / 1000) * 7;
  const sy = 1 - 0.14 * (0.5 + 0.5 * Math.sin(2 * Math.PI * flaps * p));
  return { x, y, sy };
}
export const KARGA_HAVUZ = 8; // aynı anda uçan / yeni yerine konmuş karga sayısı
export const KARGA_UCUS_MS = 1500;
