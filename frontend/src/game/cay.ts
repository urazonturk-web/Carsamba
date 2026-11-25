// AMCAYA ÇAY ISMARLA (2026-11-25; SATIS-ZAMAN raporu "ara yol", kullanıcı: "Ara yol (çayla çık)" -> "Evet, 2 çizimle").
// Çıkışta tek satış: üç kademeli destek. Kalıcı (tüketilmeyen) ürünler: telefon değişince "geri yükle" ile rozet döner.
// Yalnız görünüş/destek; oyunu kolaylaştırmaz (puan, can, fizik yok). Ödeme Apple'ın kendi sayfasında.
// Ürün kimlikleri App Store Connect'te AYNEN oluşturulmalı (bkz. ai_review_evidence/CAY-2026-11-25/APP-STORE-CONNECT.md).

export const CAY_ON = true as boolean;

export type CayUrun = { id: string; ad: string; aciklama: string; ikon: string; gorsel: number; kademe: 1 | 2 | 3 };
export const CAY_URUNLER: readonly CayUrun[] = [
  { id: "byzantion.cay", ad: "Bir çay", aciklama: "İnce belli bardakta tavşan kanı", ikon: "cup.and.saucer.fill", gorsel: require("@/assets/cay/rozet-cay.png"), kademe: 1 },
  { id: "byzantion.demlik", ad: "Bir demlik", aciklama: "Bütün mahalleye yeter", ikon: "mug.fill", gorsel: require("@/assets/cay/rozet-demlik.png"), kademe: 2 },
  { id: "byzantion.semaver", ad: "Semaver", aciklama: "Amca bütün gün keyifli", ikon: "flame.fill", gorsel: require("@/assets/cay/rozet-semaver.png"), kademe: 3 },
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

// Kıvılcım çizimleri (CAY-2026-11-25, kullanıcı: "Kabul, bağla"): rozetler 192 px kare, çaylı amca 419×600.
export const CAY_TESEKKUR = require("@/assets/cay/cay-tesekkur.png");
export const CAY_TESEKKUR_ASPECT = 600 / 419;
export const CAY_ROZET_MENU = require("@/assets/cay/rozet-cay.png");
