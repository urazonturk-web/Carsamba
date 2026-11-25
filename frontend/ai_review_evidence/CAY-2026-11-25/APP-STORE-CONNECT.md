# "Amcaya çay ısmarla" — App Store Connect'te senin yapacakların (2026-11-25)

Bunlar hesap işlemleri; Claude Code yapmaz (sözleşme, banka, vergi, fiyat onayı). Sırayla:

## 1. Sözleşme, banka, vergi (bir kez)
1. App Store Connect → **İş (Business)** → **Ücretli Uygulamalar (Paid Apps)** sözleşmesini kabul et.
2. Aynı sayfada **banka hesabı** ve **vergi formlarını** doldur (Türkiye'den bireysel geliştirici: W-8BEN formu çıkar). Durum "Etkin" olana kadar ürünler satışa çıkmaz; onay birkaç gün sürebilir.
3. **Küçük İşletme Programı (App Store Small Business Program)** başvurusu: developer.apple.com/app-store/small-business-program — kabul edilirse Apple payı %30 yerine %15.
4. Vergi sorusu için bir mali müşavire danış (bu gelirin Türkiye'de nasıl beyan edileceği).

## 2. Üç ürünü oluştur
App Store Connect → Uygulamalar → Byzantion → **Para Kazanma → Uygulama İçi Satın Alımlar → +**
Tür: **Tüketilmeyen (Non-Consumable)** — üçü de. Ürün kimlikleri **harfi harfine** şöyle olmalı (kod bunları arıyor):

| Referans adı | Ürün kimliği (Product ID) | Görünen ad (TR) | Açıklama (TR) | Önerilen fiyat |
|---|---|---|---|---|
| Cay 1 | `com.urazonturk.carsamba.cay` | Bir çay | Amcaya bir çay ısmarla | en alt kademe (≈0,99 $) |
| Cay 2 demlik | `com.urazonturk.carsamba.demlik` | Bir demlik | Amcaya bir demlik çay ısmarla | ≈2,99 $ |
| Cay 3 semaver | `com.urazonturk.carsamba.semaver` | Semaver | Amcaya bir semaver çay ısmarla | ≈6,99 $ |

İngilizce yerelleştirme: "A glass of tea" / "A pot of tea" / "A samovar" — "Buy Amca a tea".
Fiyat: Türkiye'yi **temel mağaza** seçip TL fiyatı elle koymak öneriliyor (Apple Türkiye fiyatlarını yeniden ayarlıyor; TL rakamlarını App Store Connect'teki güncel kademeden seç).

Her ürüne: **İnceleme ekran görüntüsü** (çay kartının ekran görüntüsü — Claude Code hazırlar) ve kısa inceleme notu: "Destek/bahşiş amaçlı; karşılığında menüde rozet. Oyunu kolaylaştırmaz."

## 3. Sürümle birlikte gönder
Her türün ilk ürünü **yeni uygulama sürümüyle** incelemeye gider: sürüm sayfasında "Uygulama İçi Satın Alımlar" bölümünden üç ürünü seç, sürümle birlikte gönder.

## 4. Mağaza metni
Açıklamaya ilk günden: "Ücretsiz, reklamsız. Satılan her şey yalnız görünüş ya da geliştiriciye çay; oyunu kolaylaştırmaz."

## 5. Deneme (para harcamadan)
- Simülatörde: Xcode'da **frontend-cay-deneme** şeması (ios/Byzantion-Cay.storekit dosyasını kullanır) — gerçek para yok.
- Telefonda gerçek akış: App Store Connect → Kullanıcılar ve Erişim → **Sandbox test hesabı**; TestFlight sürümünde satın almalar da ücretsizdir.
