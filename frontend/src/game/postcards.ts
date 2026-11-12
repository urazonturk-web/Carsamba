// KARTPOSTAL ALBÜMÜ (2026-11-12, kullanıcı seçimi; YAPI-2026-11-12 fikirleri).
// Bir durağa İLK kez varınca o semtin kartpostalı açılır. Görseller yeni üretim
// değil: mevcut Boğaz arka planından kırpılıp kartpostal çerçevesine alındı
// (assets/postcards/). Kayıt yalnız cihazda.

export const POSTCARDS_ON = true as boolean;
export const POSTCARDS_KEY = "carsamba.postcards.v1";

export const POSTCARDS = [
  { stop: 1, name: "Karaköy", source: require("@/assets/postcards/kartpostal-karakoy.jpg") },
  { stop: 2, name: "Galata", source: require("@/assets/postcards/kartpostal-galata.jpg") },
  { stop: 3, name: "Sirkeci", source: require("@/assets/postcards/kartpostal-sirkeci.jpg") },
  { stop: 4, name: "Eminönü İskelesi", source: require("@/assets/postcards/kartpostal-eminonu.jpg") },
  { stop: 5, name: "Gece seferi", source: require("@/assets/postcards/kartpostal-gece.jpg") },
] as const;

export function parseUnlocked(raw: string | null | undefined): number[] {
  if (!raw) return [];
  try {
    const a = JSON.parse(raw);
    return Array.isArray(a) ? a.filter((n) => typeof n === "number") : [];
  } catch {
    return [];
  }
}
