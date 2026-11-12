// GÜNÜN HARİTASI (2026-11-12, YAPI-2026-11-12 raporunun 2. denemesi).
// Telefonun yerel tarihinden sabit bir tohum: o gün herkes aynı çatıları oynar.
// Sunucu ve hesap yok; günlük rekor ve günlük en uzak kule yalnız cihazda.

// 2026-11-12 kullanıcı: "günlük mod işini pek beğenmedim, bu oyun tekrara düşmemeli" -> kapalı.
// Kod duruyor; açılırsa sekme ve kart düğmesi geri gelir.
export const DAILY_MAP = false as boolean;
export const DAILY_KEY = "carsamba.daily.v1";

export type DailyRecord = { date: string; best: number; farthest: number };

const AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

export function todayKey(d = new Date()) {
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function todayLabel(d = new Date()) {
  return `${d.getDate()} ${AYLAR[d.getMonth()]}`;
}

/** Tarih anahtarından 32-bit tohum (FNV-1a). Aynı gün = aynı harita. */
export function dailySeed(key = todayKey()) {
  let h = 0x811c9dc5;
  const s = `gunun-haritasi:${key}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}
