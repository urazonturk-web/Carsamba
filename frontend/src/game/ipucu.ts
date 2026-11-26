// OYNANIS-2026-11-26 ilk paket (kullanıcı: "İlk paketi yap"): düşüşün türüne göre oyun sonu ipucu.
// Yalnız ilk IPUCU_MAX oyun sonunda (cihazda sayılır); fizik/çarpışma okunur, değiştirilmez.
export const IPUCU_ON = true as boolean;
export const IPUCU_MAX = 5;
export const IPUCU_KEY = "carsamba.ipucu.v2";
export type IpucuTur = "kisa" | "uzun" | "patladi";
// Metin: "evlat" seti (IPUCU-METIN-2026-11-26; diyalog editörü favorisi, kullanıcı: "\"Evlat\" seti").
// Her durumda iki satır sırayla çıkar; ilk satır favori.
export const IPUCU_METIN: Record<IpucuTur, readonly string[]> = {
  kisa: ["Az bastın evlat! Biraz daha tut.", "Bu dizlere güven evlat, daha uzun bas."],
  uzun: ["Fren de var evlat, biraz erken bırak.", "Fazla bastın, kuleyi aştım. Biraz erken bırak."],
  patladi: ["Bırak artık evlat, eşofman dayanmıyor!", "Çok bekletme evlat, gaz birikiyor!"],
};
/** Hızlı yeniden başlama: kart açıldıktan bu kadar sonra boş yere dokunmak "Bir daha" sayılır. */
export const HIZLI_TEKRAR_MS = 400;
