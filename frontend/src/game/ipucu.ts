// OYNANIS-2026-11-26 ilk paket (kullanıcı: "İlk paketi yap"): düşüşün türüne göre oyun sonu ipucu.
// Yalnız ilk IPUCU_MAX oyun sonunda (cihazda sayılır); fizik/çarpışma okunur, değiştirilmez.
export const IPUCU_ON = true as boolean;
export const IPUCU_MAX = 5;
export const IPUCU_KEY = "carsamba.ipucu.v1";
export type IpucuTur = "kisa" | "uzun" | "patladi";
export const IPUCU_METIN: Record<IpucuTur, string> = {
  kisa: "Kısa kaldın. Bir dahakine biraz daha uzun bas.",
  uzun: "Amca uçtu gitti! Bir dahakine biraz erken bırak.",
  patladi: "Fazla bastın, amca dayanamadı. Kıvamında bırak.",
};
/** Hızlı yeniden başlama: kart açıldıktan bu kadar sonra boş yere dokunmak "Bir daha" sayılır. */
export const HIZLI_TEKRAR_MS = 400;
