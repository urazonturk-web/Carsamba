// DURAK SEFERİ (2026-11-12, kullanıcı: "Evet, başla"; YAPI-2026-11-12 raporu).
// Sonsuz koşunun içine duraklar: her 15 kulede bir (15, 30, 45, 60…).
// 4. durak iskele ("vapura yetiştin"); sonrası "Gece seferi N" olarak sürer.
// Kayıt noktası yok: düşünce baştan başlanır. Durak puan vermez (ilk deneme).
// Zorluk her durakta bir basamak artar (procedural-course.ts); fizik değişmez.
// Kule kimliği (platform id) üzerinden çalışır, skor üzerinden değil.

export const DURAK_SEFER = true as boolean;

// 2026-11-12 kullanıcı (video 12-23-01): "baştan 15. kolona vardığında durak yazsa daha
// tutarlı olur" -> ilk durak da 15. kulede; duraklar 15, 30, 45, 60 (iskele), 75…
export const FIRST_STOP = 15;
export const STOP_EVERY = 15;

// GÜZERGÂH 2026-11-16 (kullanıcı: "Evet, geçir"; ai_review_evidence/GUZERGAH-2026-11-16/RAPOR.md):
// Kadıköy'den Boğaz boyunca kuzeye, üç köprüyle Karadeniz'e. Önceki duraklar:
// Karaköy, Galata, Sirkeci, Eminönü İskelesi (PIER_STOP 4 = iskele + zorluk tavanı).
export const START_NAME = "Kadıköy";
export const STOP_NAMES = [
  "Harem", "Üsküdar · Kız Kulesi", "Kuzguncuk", "Beylerbeyi",
  "Ortaköy", "Arnavutköy", "Bebek", "Rumeli Hisarı",
  "Kanlıca", "Beykoz", "Anadolu Kavağı", "Rumeli Feneri",
] as const;
// Sonuç kartındaki "…'e N kule kaldı" için yönelme hâlleri (ünlü uyumu elle).
const STOP_DATIVE = [
  "Harem'e", "Üsküdar'a", "Kuzguncuk'a", "Beylerbeyi'ne",
  "Ortaköy'e", "Arnavutköy'e", "Bebek'e", "Rumeli Hisarı'na",
  "Kanlıca'ya", "Beykoz'a", "Anadolu Kavağı'na", "Rumeli Feneri'ne",
] as const;
/** Son durak (büyük final: "Karadeniz'e ulaştın!"); sonrası "Gece seferi N". */
export const FINAL_STOP = STOP_NAMES.length;
/** Zorluk tavanı: önceki gibi 4. durakta (isimlerden bağımsız; zorluk değişmez). */
export const DIFFICULTY_CAP_STOP = 4;

/** Köprüler: `foot` durağından sonraki kuleler köprü üstü sayılır, `to` durağında karşı yakadasın. */
export const BRIDGES = [
  { foot: 4, to: 5, name: "Boğaziçi Köprüsü", from: "Anadolu", side: "Avrupa", arrive: "Avrupa yakasına geçtin!" },
  { foot: 8, to: 9, name: "Fatih Sultan Mehmet Köprüsü", from: "Avrupa", side: "Anadolu", arrive: "Anadolu yakasına döndün!" },
  { foot: 11, to: 12, name: "Yavuz Sultan Selim Köprüsü", from: "Anadolu", side: "Avrupa", arrive: "Karadeniz'e ulaştın!" },
] as const;

/** Bu kule bir köprünün üstünde mi? (ayak ile varış durağı arasındaki kuleler) */
export function bridgeAt(towerId: number) {
  for (const b of BRIDGES) {
    const a = stopTowerId(b.foot), z = stopTowerId(b.to);
    if (towerId > a && towerId < z) return { bridge: b, progress: (towerId - a) / (z - a) };
  }
  return null;
}
export function bridgeFromFoot(k: number) {
  return BRIDGES.find((b) => b.foot === k) ?? null;
}
export function bridgeArrivingAt(k: number) {
  return BRIDGES.find((b) => b.to === k) ?? null;
}

/** Gecenin başladığı durak (skyStepForStops 4): pijama anı burada (Ortaköy). */
export const NIGHT_STOP = 5;

/** Gökyüzü adımı (0 sabah … 4 gece). 2026-11-16 kullanıcı: "gün batımını daha erkene alalım":
 *  0-1 sabah, 2 öğle, 3 ikindi, 4 (Beylerbeyi + Boğaziçi Köprüsü) gün batımı, 5 Ortaköy'den itibaren gece.
 *  (önceki: 1-4 sabah, 5-8 öğle, 9-10 ikindi, 11 gün batımı, 12+ gece) */
export function skyStepForStops(k: number) {
  if (k <= 1) return 0;
  if (k <= 4) return k - 1;
  return 4;
}

/** k. durağın (1'den başlar) kule kimliği. */
export function stopTowerId(k: number) {
  "worklet";
  return FIRST_STOP + (k - 1) * STOP_EVERY;
}

/** Bu kuleye kadar (dahil) geçilen durak sayısı. */
export function stopsPassed(id: number) {
  "worklet";
  if (id < FIRST_STOP) return 0;
  return 1 + Math.floor((id - FIRST_STOP) / STOP_EVERY);
}

export function isStopTower(id: number) {
  "worklet";
  return id >= FIRST_STOP && (id - FIRST_STOP) % STOP_EVERY === 0;
}

/** Zorluk basamağı 0..1: durak başına bir basamak, iskelede tavan. */
export function stopDifficulty(id: number) {
  "worklet";
  return Math.min(1, stopsPassed(id) / DIFFICULTY_CAP_STOP);
}

export function stopName(k: number) {
  if (k <= 0) return "";
  if (k <= STOP_NAMES.length) return STOP_NAMES[k - 1];
  return `Gece seferi ${k - FINAL_STOP}`;
}

/** Sonuç kartı için: "Galata'ya 4 kule kaldı" satırı. */
export function nextStopLine(lastTowerId: number) {
  const k = stopsPassed(lastTowerId) + 1;
  const left = stopTowerId(k) - lastTowerId;
  if (k <= STOP_DATIVE.length) return `${STOP_DATIVE[k - 1]} ${left} kule kaldı`;
  return `Sonraki gece durağına ${left} kule kaldı`;
}
