// AMCAYA ÇAY ISMARLA (2026-11-25; SATIS-ZAMAN raporu "ara yol", kullanıcı: "Ara yol (çayla çık)" -> "Evet, 2 çizimle").
// Çıkışta tek satış: üç kademeli destek. Kalıcı (tüketilmeyen) ürünler: telefon değişince "geri yükle" ile rozet döner.
// Yalnız görünüş/destek; oyunu kolaylaştırmaz (puan, can, fizik yok). Ödeme Apple'ın kendi sayfasında.
// Ürün kimlikleri App Store Connect'te AYNEN oluşturulmalı (bkz. ai_review_evidence/CAY-2026-11-25/APP-STORE-CONNECT.md).

export const CAY_ON = true as boolean;

export type CayUrun = { id: string; ad: string; aciklama: string; ikon: string; kademe: 1 | 2 | 3 };
export const CAY_URUNLER: readonly CayUrun[] = [
  { id: "com.urazonturk.carsamba.cay", ad: "Bir çay", aciklama: "İnce belli bardakta tavşan kanı", ikon: "cup.and.saucer.fill", kademe: 1 },
  { id: "com.urazonturk.carsamba.demlik", ad: "Bir demlik", aciklama: "Bütün mahalleye yeter", ikon: "mug.fill", kademe: 2 },
  { id: "com.urazonturk.carsamba.semaver", ad: "Semaver", aciklama: "Amca bütün gün keyifli", ikon: "flame.fill", kademe: 3 },
];
export const CAY_IDLER = CAY_URUNLER.map((u) => u.id);

/** Yerel önbellek (StoreKit cevabı gelene kadar rozet hemen görünsün); asıl kaynak Apple'ın kayıtları. */
export const CAY_KEY = "carsamba.cay.v1";
/** Oyun sonu önerisi: en az bu kadar oyun bitmeden hiç gösterilmez (editör kuralı: ilk 3 oyunda yok). */
export const CAY_ONERI_MIN_OYUN = 3;

/** Sahip olunan en yüksek kademe (0 = yok). */
export function cayKademe(owned: readonly string[]): 0 | 1 | 2 | 3 {
  let k: 0 | 1 | 2 | 3 = 0;
  for (const u of CAY_URUNLER) if (owned.includes(u.id) && u.kademe > k) k = u.kademe;
  return k;
}
