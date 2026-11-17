// YAĞMUR KIYAFETİ (2026-11-17, kullanıcı: "şemsiye iptal, şapka takıp mont giyinsin" -> "Evet, gönder"
// -> "Evet, 7 pozu iste" -> "Evet, bağla"; ai_review_evidence/YAGMUR-KIYAFET-2026-11-17/).
// İstanbul'da yağmur yağarken (rüzgâr fark etmez) amca kasket + zeytin yeşili mont giyer.
// Mont: Kıvılcım'ın 9 poz çizimi; scripts/yagmur-mont-birlestir.py özgün pozun üstüne yalnız montu bindirdi,
// yüz/çene/yumruk/eşofman altı/ayakkabı piksel olarak özgün -> tuval, pivot, iniş değişmez.
// Kıyafet koşu başında belirlenir, koşu ortasında değişmez. Gece külahı kasketi gizler.

export const YAGMUR_ON = true as boolean;

// CHARGE_POSES sırasıyla (000, 012, 025, 037, 050, 062, 075, 087, 100); tuval boyutları özgün pozla aynı.
export const RAIN_POSE_SOURCES = [
  require("@/assets/characters/yagmur/charge-000-yagmur.png"),
  require("@/assets/characters/yagmur/charge-012-yagmur.png"),
  require("@/assets/characters/yagmur/charge-025-yagmur.png"),
  require("@/assets/characters/yagmur/charge-037-yagmur.png"),
  require("@/assets/characters/yagmur/charge-050-yagmur.png"),
  require("@/assets/characters/yagmur/charge-062-yagmur.png"),
  require("@/assets/characters/yagmur/charge-075-yagmur.png"),
  require("@/assets/characters/yagmur/charge-087-yagmur.png"),
  require("@/assets/characters/yagmur/charge-100-yagmur.png"),
];

export const RAIN_CAP_SOURCE = require("@/assets/characters/yagmur/yagmur-kasket.png");
// Poz tuvali pikselinde (516 px genişlik). Baş 9 pozda aynı yerde -> tek kutu.
export const RAIN_CAP_BOX = { x: -22, y: -103, w: 564, h: 338 };
