// MEYDAN OKUMA (2026-11-16, kullanıcı: "2 kişi oynayabilmek", seçim "İkisi de": önce meydan okuma).
// Bir koşunun harita tohumu + skoru kısa bir koda dönüşür; arkadaş kodu girince aynı
// haritayı oynar (kule dizisi, kurukafa yerleri ve etkileri tohumdan gelir) ve sonuç karşılaştırılır.
// Sunucu yok; kod mesajla paylaşılır. Not: kule dizisi telefon genişliğinden çok az etkilenebilir.

export const MEYDAN_ON = true as boolean;

export type Challenge = { seed: number; target: number; from: string; matchID?: string };

/** Tohum (32 bit) -> 7 karakter base36, büyük harf; skor ondalık. Örn. "1K9Z0QX-37". */
export function makeCode(seed: number, score: number) {
  return `${(seed >>> 0).toString(36).toUpperCase()}-${Math.max(0, Math.floor(score))}`;
}

/** Kullanıcının yazdığı kodu çöz; boşluk ve küçük harf serbest. Geçersizse null. */
export function parseCode(raw: string): { seed: number; target: number } | null {
  const t = raw.trim().toUpperCase().replace(/\s+/g, "").replace(/[–—_]/g, "-");
  const m = t.match(/([0-9A-Z]{1,7})-(\d{1,5})/);
  if (!m) return null;
  const seed = parseInt(m[1], 36);
  if (!Number.isFinite(seed) || seed < 0 || seed > 0xffffffff) return null;
  return { seed: seed >>> 0, target: parseInt(m[2], 10) };
}

export function shareText(code: string, score: number, name: string) {
  const who = name ? `${name} diyor ki: ` : "";
  return `${who}Byzantion'da beni geç! ${score} puan yaptım 💪\nMeydan okuma kodu: ${code}\nOyunu aç → oyun sonunda "🔑 Kod gir" → kodu yaz.`;
}
