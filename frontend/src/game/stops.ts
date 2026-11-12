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
export const PIER_STOP = 4; // kaçıncı durak iskele
export const STOP_NAMES = ["Karaköy", "Galata", "Sirkeci", "Eminönü İskelesi"] as const;
// Sonuç kartındaki "…'e N kule kaldı" için yönelme hâlleri (ünlü uyumu elle).
const STOP_DATIVE = ["Karaköy'e", "Galata'ya", "Sirkeci'ye", "Eminönü İskelesi'ne"] as const;

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
  return Math.min(1, stopsPassed(id) / PIER_STOP);
}

export function stopName(k: number) {
  if (k <= 0) return "";
  if (k <= STOP_NAMES.length) return STOP_NAMES[k - 1];
  return `Gece seferi ${k - PIER_STOP}`;
}

/** Sonuç kartı için: "Galata'ya 4 kule kaldı" satırı. */
export function nextStopLine(lastTowerId: number) {
  const k = stopsPassed(lastTowerId) + 1;
  const left = stopTowerId(k) - lastTowerId;
  if (k <= STOP_DATIVE.length) return `${STOP_DATIVE[k - 1]} ${left} kule kaldı`;
  return `Sonraki gece durağına ${left} kule kaldı`;
}
