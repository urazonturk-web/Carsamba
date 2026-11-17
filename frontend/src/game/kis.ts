// KIŞ KIYAFETİ (2026-11-17, kullanıcı: "Evet, bere ve atkı" -> "Evet, bağla";
// ai_review_evidence/KIS-BASLIK-2026-11-17/, ai_review_evidence/MEVSIM-2026-11-17/RAPOR.md).
// Pozlar yeniden çizilmedi: bere ve atkı her şarj pozunun üstüne ayrı katman (gece külahı gibi).
// Görseller Kıvılcım'dan (kullanıcı onaylı 2 çağrı); yerleşim Claude Code ölçümü.
// Kışın (seasonFor: aralık–şubat ya da <= 7 °C) görünür; koşu başında belirlenir, koşu ortasında değişmez.
// Gece kapısında gece külahı bereyi değiştirir, atkı boyunda kalır. Fizik/çarpışma değişmez.

export const KIS_ON = true as boolean;

export const WINTER_HAT_SOURCE = require("@/assets/characters/kis/kis-bere.png");
export const WINTER_SCARF_SOURCE = require("@/assets/characters/kis/kis-atki.png");

// Poz tuvali pikselinde (516 px genişlik, sol üst 0,0). 9 pozun 0–475. satırları aynı -> tek kutu.
export const WINTER_HAT_BOX = { x: 15, y: -100, w: 500, h: 357 };
export const WINTER_SCARF_BOX = { x: -15, y: 395, w: 560, h: 299 };

// KARLI AMCA (2026-11-17, kullanıcı: "Evet, üçünü yap"; ai_review_evidence/KARLI-AMCA-2026-11-17/RAPOR.md).
// Kar yalnız gerçekten kar yağarken birikir (beklerken ~25 sn'de dolar, inişte +0,06), kalkışta silkelenir (x0,35).
// Kar topakları poz tuvali pikselinde; baş 9 pozda aynı yerde (0–475. satır). Kademe eşikleri: A 0,1 / B 0,45 / C 0,7 / D 0,92.
// Kar yığını: cx = yatay orta, by = oturduğu yüzey çizgisi, w = genişlik (poz tuvali pikseli).
export type SnowBlob = { cx: number; by: number; w: number };
export const SNOW_A: SnowBlob[] = [ // ponpon + bere tepesi
  { cx: 272, by: -62, w: 92 }, { cx: 178, by: 40, w: 78 }, { cx: 356, by: 40, w: 70 },
];
export const SNOW_B: SnowBlob[] = [ // kaş ve bıyık üstü
  { cx: 352, by: 158, w: 52 }, { cx: 412, by: 156, w: 44 },
  { cx: 330, by: 348, w: 54 }, { cx: 398, by: 338, w: 56 }, { cx: 456, by: 332, w: 46 },
];
export const SNOW_C: SnowBlob[] = [ // burun sırtı + atkının üst kenarı
  { cx: 470, by: 246, w: 58 },
  { cx: 224, by: 512, w: 70 }, { cx: 292, by: 506, w: 80 }, { cx: 358, by: 512, w: 62 },
];
export const SNOW_D: SnowBlob[] = [ // berede kabarık kar şapkası
  { cx: 266, by: 52, w: 196 }, { cx: 272, by: -44, w: 108 },
];
export const NOSE_RED = { x: 418, y: 246, d: 88 }; // burun topu (yalnız normal yüzlü pozlar; ifadeli yüzde burun zaten kırmızı)
export const BREATH = { x: 492, y: 372 }; // ağız önü
