// MAHALLE SAKİNLERİ (2026-11-20, kullanıcı: "Kabul, devam et"): kulelerde pencereden halı silkeleyen teyze
// ve çatı saçağında uyuyan kedi. Yalnız görüntü: iniş yüzeyine (kule üst çizgisi) girmez; teyze cephede,
// kedi saçak köşesinde (p.x'in solunda). Fizik/kamera/çarpışma değişmez.
// Amca o kuleye inince: teyze konuşur (inişe göre), kedi miyavlar; kedi ilk kez görülünce adıyla deftere yazılır.
// Kural: Arapça/dinî ünlem yok (kullanıcı 2026-11-20).

export const MAHALLE_ON = true as boolean;
// 2026-11-21 kullanıcı: "diyalogları hiç beğenmedim" -> komşu ve kedi konuşma balonları kapalı (yazı yerine jest).
export const MAHALLE_SPEECH_ON = false as boolean;

export const TEYZE_SOURCE = require("@/assets/environment/mahalle/komsu-teyze-hali.png");
export const TEYZE_ASPECT = 615 / 440;
export const KEDI_SOURCE = require("@/assets/environment/mahalle/kedi-uyuyan.png");
export const KEDI_ASPECT = 255 / 360;
export const KEDI_UYUYAN_FOOT = 193 / 255;
export const KEDI_DIK_FOOT = 0.99;
// Tur 2 (kullanıcı 2026-11-20: "Kabul, bağla"): bağıran komşu amca, alkışlayan çocuk, gerinen kedi, gri kedi.
export const AMCA_SOURCE = require("@/assets/environment/mahalle/komsu-amca-bagiran.png");
export const AMCA_ASPECT = 461 / 440;
export const COCUK_SOURCE = require("@/assets/environment/mahalle/komsu-cocuk-alkis.png");
export const COCUK_ASPECT = 450 / 440;
export const KEDI_GERINEN_SOURCE = require("@/assets/environment/mahalle/kedi-gerinen.png");
export const KEDI_GERINEN_ASPECT = 255 / 360;
export const KEDI_GRI_SOURCE = require("@/assets/environment/mahalle/kedi-gri-uyuyan.png");
export const KEDI_GRI_ASPECT = 229 / 360;
// CUMBA (2026-11-21, kullanıcı: "Evet, iste" -> "1,4 kat, bağla"; ai_review_evidence/ORAN-2026-11-21/RAPOR.md):
// teyze artık oluğun altındaki büyük yeşil cumbadan amca ölçeğinde eğilir. Cumba ve teyze ayrı katman;
// teyze görselleri pervaz noktasından 1,4 kat büyütülüp aynı genişlikte daha uzun tuvale basıldı.
export const CUMBA_SOURCE = require("@/assets/environment/mahalle/cumba-bos.png");
export const CUMBA_ASPECT = 1100 / 1000;
export const CUMBA_KEDI_SOURCE = require("@/assets/environment/mahalle/cumba-kedi.png"); // cumba-bos + koyu iç
export const CUMBA_TEYZE_SOURCE = require("@/assets/environment/mahalle/cumba-teyze-hali.png");
export const CUMBA_TEYZE_BAKIS_SOURCE = require("@/assets/environment/mahalle/cumba-teyze-bakis.png");
export const CUMBA_TEYZE_ASPECT = 1300 / 1000;
// MEVSIM-MAHALLE (2026-11-24, kullanıcı: "kışın ve yağmurlu havalarda çamaşır asılması saçma olmuş ... teyzede yaz
// modunda ... kışın kedi üşür halde gözüksün" -> "Kabul, bağla"). Yağmur/kar hâlleri; tuval ölçüleri orijinalle aynı.
// Teyze ve komşular "serin" hâli (hırka/kazak/bere) iki havada ortak; kediler kışın üşüyen, yağmurda ıslak.
export type MahalleHava = "kar" | "yagmur" | null;
const CUMBA_TEYZE_SERIN = require("@/assets/environment/mahalle/cumba-teyze-serin.png");
const CUMBA_TEYZE_SERIN_BAKIS = require("@/assets/environment/mahalle/cumba-teyze-serin-bakis.png");
const AMCA_SERIN = require("@/assets/environment/mahalle/komsu-amca-serin.png");
const COCUK_SERIN = require("@/assets/environment/mahalle/komsu-cocuk-serin.png");
const KEDI_KIS = require("@/assets/environment/mahalle/kedi-uyuyan-kis.png");
const KEDI_YAGMUR = require("@/assets/environment/mahalle/kedi-uyuyan-yagmur.png");
const KEDI_GRI_KIS = require("@/assets/environment/mahalle/kedi-gri-uyuyan-kis.png");
const KEDI_GRI_YAGMUR = require("@/assets/environment/mahalle/kedi-gri-uyuyan-yagmur.png");
const KEDI_GERINEN_KIS = require("@/assets/environment/mahalle/kedi-gerinen-kis.png");
const KEDI_GERINEN_YAGMUR = require("@/assets/environment/mahalle/kedi-gerinen-yagmur.png");
export function mahalleKaynak(hava: MahalleHava) {
  const serin = hava === "kar" || hava === "yagmur";
  const kis = hava === "kar", yag = hava === "yagmur";
  return {
    serin,
    teyze: serin ? CUMBA_TEYZE_SERIN : CUMBA_TEYZE_SOURCE,
    teyzeBakis: serin ? CUMBA_TEYZE_SERIN_BAKIS : CUMBA_TEYZE_BAKIS_SOURCE,
    amca: serin ? AMCA_SERIN : AMCA_SOURCE,
    cocuk: serin ? COCUK_SERIN : COCUK_SOURCE,
    kedi: kis ? KEDI_KIS : yag ? KEDI_YAGMUR : KEDI_SOURCE,
    kediGri: kis ? KEDI_GRI_KIS : yag ? KEDI_GRI_YAGMUR : KEDI_GRI_SOURCE,
    kediGerinen: kis ? KEDI_GERINEN_KIS : yag ? KEDI_GERINEN_YAGMUR : KEDI_GERINEN_SOURCE,
  };
}
// CESIT-SAKIN (2026-11-25, kullanıcı: "hep aynı kadın ve hep aynı kedi görseli olması çeşitlilik olsun" ->
// "Kabul, bağla"): cumbada 4 kadın (0 halı silken teyze, 1 çiçek sulayan, 2 örgü ören nine, 3 sofra bezi silken),
// kule kimliğinden sabit seçilir. Yeni kadınların serin (kış/yağmur) hâli yok: o havalarda hep şallı teyze (0).
// Tuvaller cumba-teyze ile aynı (600×780, pervaz y 414), aynı kutuya çizilir.
export const KADIN_SAYI = 4;
export const KADIN_KAYNAK = [
  [CUMBA_TEYZE_SOURCE, CUMBA_TEYZE_BAKIS_SOURCE],
  [require("@/assets/environment/mahalle/cumba-sulayan.png"), require("@/assets/environment/mahalle/cumba-sulayan-bakis.png")],
  [require("@/assets/environment/mahalle/cumba-orgu.png"), require("@/assets/environment/mahalle/cumba-orgu-bakis.png")],
  [require("@/assets/environment/mahalle/cumba-sofra.png"), require("@/assets/environment/mahalle/cumba-sofra-bakis.png")],
] as const;
// Kediler: görünüm = ad sırası % 6 -> 0 turuncu tekir, 1 gri tekir (eski tek/çift kuralı bu ikisinde korunur),
// 2 smokin, 3 beyaz, 4 üç renk, 5 oturan tekir. Yeni dördünün kış/yağmur hâli yok: soğukta 2,4 -> turuncu, 3,5 -> gri.
// foot = gövde alt çizgisinin tuval yüksekliğine oranı (alfa taraması, 2026-11-25); 360×255 tuval.
export const KEDI_YENI = [
  { src: require("@/assets/environment/mahalle/kedi-smokin.png"), foot: 190 / 255 },
  { src: require("@/assets/environment/mahalle/kedi-beyaz.png"), foot: 225 / 255 },
  { src: require("@/assets/environment/mahalle/kedi-uc-renk.png"), foot: 193 / 255 },
  { src: require("@/assets/environment/mahalle/kedi-tekir-oturan.png"), foot: 247 / 255 },
] as const;
export const KEDI_YENI_ASPECT = 255 / 360;
// Eski küçük pencere komşuları (komşu amca, çocuk) oran sorunu yüzünden kapalı; cumbalı sürümleri çizilince açılır.
export const ESKI_KOMSULAR_ON = false as boolean;
/** Görsellerin sabit kutu genişliği (dünya birimi); gerçek boyut transform scale ile verilir. */
export const MAHALLE_BOX = 100;

// Kule kimliğinden sabit 0..1 (houseHash ile aynı karıştırma, ayrı tuz).
function mhash(id: number, salt: number) {
  "worklet";
  const h = Math.imul((id * 31 + salt) ^ 0x27d4eb2d, 0x165667b1) >>> 0;
  return h / 4294967296;
}

/** 0 = boş, 1 = teyze, 2 = kedi, 3 = komşu amca, 4 = çocuk. İlk 3 kule boş; komşu kulelerde aynı tür
 *  (pencere ya da kedi) üst üste gelmez. */
// GEÇİCİ test: her kulede sırayla teyze/kedi (yalnız simülatör doğrulaması; false bırak).
export const MAHALLE_TEST = false as boolean;
export function sakin(id: number): number {
  "worklet";
  if (MAHALLE_TEST) return id < 1 ? 0 : id % 2 === 1 ? 1 : 2;
  if (!MAHALLE_ON || id < 3) return 0;
  const h = mhash(id, 71);
  const k = h < 0.13 ? 1 : h < 0.24 ? 2 : 0; // 1 = pencere, 2 = kedi
  if (k === 0) return 0;
  const hp = mhash(id - 1, 71);
  const prev = hp < 0.13 ? 1 : hp < 0.24 ? 2 : 0;
  if (prev === k) return 0;
  if (k === 2) return 2;
  if (!ESKI_KOMSULAR_ON) return 1;
  const w = mhash(id, 72);
  return w < 0.4 ? 1 : w < 0.7 ? 3 : 4;
}

export const KEDI_ADLARI = ["Tombili", "Paşa", "Duman", "Pamuk", "Zeytin", "Fıstık", "Boncuk", "Minnoş", "Tarçın", "Sarman", "Bıdık", "Limon"] as const;
export function kediNo(id: number) {
  "worklet";
  return Math.floor(mhash(id, 73) * KEDI_ADLARI.length) % KEDI_ADLARI.length;
}
export function kediAdi(id: number) {
  return KEDI_ADLARI[kediNo(id)];
}
/** Kedinin görünümü (0..5, bkz. KEDI_YENI); soguk = kış/yağmur hâli (yeni görünümler turuncu/gri olur). */
export function kediGorunumNo(n: number, soguk = false) {
  "worklet";
  const v = n % 6;
  if (!soguk || v < 2) return v;
  return v % 2 === 0 ? 0 : 1;
}
export function kediGorunum(id: number, soguk = false) {
  "worklet";
  return kediGorunumNo(kediNo(id), soguk);
}
export function kediGri(id: number, soguk = false) {
  "worklet";
  return kediGorunum(id, soguk) === 1;
}
export const kediGriNo = (n: number) => kediGorunumNo(n) === 1;
/** Cumbadaki kadın (0..3); serin havada hep 0 (şallı teyze). */
export function kadinNo(id: number, serin = false) {
  "worklet";
  if (serin) return 0;
  return Math.floor(mhash(id, 74) * KADIN_SAYI) % KADIN_SAYI;
}
export const KEDI_DEFTER_KEY = "carsamba.kediler.v1";

function pick<T>(a: readonly T[]): T {
  return a[Math.floor(Math.random() * a.length)];
}
// DİYALOG v2 (2026-11-20): her karakterin kendi huyu.
// Teyze: her şeyi ev işine ve kendi oğluna bağlar, sitemle sever.
const TEYZE_ORTA = ["Benim oğlan böyle konamaz.", "Ay, tam ortası! Gel çaya!", "Halıyı da böyle düz ser!"];
const TEYZE_KENAR = ["Kiremit benim, ödersin ha!", "Düşme, halıyı yeni yıkadım!", "Aman yavrum! Kenar, kenar!"];
const TEYZE_GENEL = ["Hanımın biliyor mu bunu?", "Toz kalkıyor, öteye zıpla!", "Çamaşıra dokunma ama!"];
// Komşu amca: hakem gibi not verir, kendi gençliğiyle kıyaslar, "be" der.
const AMCA_ORTA = ["Ben de gençken böyleydim be!", "On numara, beş yıldız!", "Vay bıyık, vay!"];
const AMCA_KENAR = ["Ayak parmağınla mı tutundun?", "Az daha bizim balkona!", "Topuğu kiremitten çek be!"];
const AMCA_GENEL = ["Tavla var, in de oynayalım!", "Bizde merdiven vardı be!", "Haberlere çıkacaksın be!"];
// Çocuk: harfiyen anlar, soru sorar, hayran kalır.
const COCUK_ORTA = ["Amca tam ortaya bastı!", "Amca, bunu nasıl yaptın?", "Çatıya nokta koydu!"];
const COCUK_KENAR = ["Ben gözümü kapattım!", "Ayakkabın kaçtı az kalsın!", "O kiremit sallanıyor!"];
const COCUK_GENEL = ["Amca bana da öğretir misin?", "Sen dedemden hızlısın!", "Vapurdan hızlı gittin!"];
/** Penceredekinin inişe göre lafı (kind 1 teyze, 3 komşu amca, 4 çocuk; ratio 0..1, 0.5 = orta). */
export function pencereLafi(kind: number, ratio: number) {
  const [orta, kenar, genel] = kind === 3 ? [AMCA_ORTA, AMCA_KENAR, AMCA_GENEL] : kind === 4 ? [COCUK_ORTA, COCUK_KENAR, COCUK_GENEL] : [TEYZE_ORTA, TEYZE_KENAR, TEYZE_GENEL];
  if (Math.abs(ratio - 0.5) <= 0.1) return pick(orta);
  if (ratio <= 0.12 || ratio >= 0.88) return pick(kenar);
  return pick(genel);
}
export const teyzeLafi = (ratio: number) => pencereLafi(1, ratio);
export function kediLafi() {
  return pick(["Mrr, bu çatı benim.", "Mrrr? Simit var mı?", "Miyav… yerim burası."]);
}

/** Teyze ve kedinin kule (ev) koordinatlarındaki yeri; g = { p: { width }, r, rise, fw }. */
export function teyzeBox(g: { p: { width: number }; r: number; rise: number; fw: number }, gutterH: number, aspect = TEYZE_ASPECT) {
  "worklet";
  const w = g.fw * 0.5;
  return { left: (g.fw - w) / 2, top: g.rise + gutterH + g.fw * 0.02, w, h: w * aspect };
}
/** Cumba: kule genişliğinin ~1,14 katı tuval (çıkma kuleden biraz taşar); görselin üst kenarı (tuvalin %16'sı)
 *  oluğun hemen altına oturur -> iniş çizgisinin (y = 0) altında kalır. Teyze katmanı aynı sol-üst köşeden. */
// 2026-11-21 video: boy kule genişliğine bağlıydı -> dar kulede küçük, geniş kulede dev teyze. Artık boy AMCAYA
// sabit (charH = amcanın çizim boyu): cumba tuvali amca boyunun 1,0 katı; cumbanın görünen gövdesi (%90) kuleye
// sığmıyorsa o kulede teyze hiç çıkmaz (w = 0) -> her yerde aynı ölçek.
export function cumbaBox(g: { p: { width: number }; r: number; rise: number; fw: number }, gutterH: number, charH: number) {
  "worklet";
  let w = charH * 1.0;
  if (w * 0.92 > g.fw) w = 0;
  const h = w * CUMBA_ASPECT;
  return { left: (g.fw - w) / 2, top: g.rise + gutterH - h * 0.161 + 2, w, h };
}
export function pencereAspect(kind: number) {
  "worklet";
  return kind === 3 ? AMCA_ASPECT : kind === 4 ? COCUK_ASPECT : TEYZE_ASPECT;
}
/** Kedi çatının alt kısmında, oluğun üstünde (sol saçağa yakın) yatar. İniş yüzeyi çatının en üst çizgisidir
 *  (ev koordinatında y = 0); kedinin üstü bunun altında kalır (en fazla çatı yüksekliğinin %85'i). */
// 2026-11-21 video: kediler hâlâ küçük ve kule/çatıya göre değişiyordu -> boy AMCAYA sabit (charH'nin %55'i).
// Kedi oluğun üstüne yatar; üstü iniş çizgisinin (y = 0) altında kalır, gerekirse cephenin üstüne sarkar.
// Kuleye sığmıyorsa (genişliğin %65'inden büyükse) o kulede kedi çıkmaz.
// KEDİ YERİ (2026-11-22, kullanıcı: "kedinin çatıdaki yeri bir tuhaf"): kedi artık çatı kiremitlerinin
// önünde değil; kedili kulede de teyzeninkiyle aynı cumba var, kedi cumbanın pervazında uyur.
// Pervaz üst çizgisi cumba-bos.png'de y≈418/660. Cumba kuleye sığmazsa kedi de yok (ölçek sabit).
export const CUMBA_PERVAZ_Y = 418 / 660;
// foot: görselde gövdenin oturduğu satır / yükseklik (uyuyan turuncu 193/255 — kuyruğu aşağı sarkar; gri ve gerinen ~1).
// Video 2026-11-22 20:29: kedi pervazın ~6 pt üstünde "havada" duruyordu; artık gövde pervaza oturur, biraz da gömülür.
export function kediBox(g: { p: { width: number }; r: number; rise: number; fw: number }, aspect = KEDI_ASPECT, charH = 0, gutterH = 0, foot = 1) {
  "worklet";
  const c = cumbaBox(g, gutterH, charH);
  if (c.w <= 0) return { left: 0, top: 0, w: 0, h: 0 };
  const w = c.w * 0.5;
  const h = w * aspect;
  const sill = c.top + c.w * CUMBA_ASPECT * CUMBA_PERVAZ_Y;
  return { left: (g.fw - w) / 2, top: sill - h * foot + w * 0.03, w, h };
}
