# "Amcaya çay ısmarla" — App Store Connect'te senin yapacakların (2026-11-25)

Bunlar hesap işlemleri; Claude Code yapmaz (sözleşme, banka, vergi, fiyat onayı). Sırayla:

## 1. Sözleşme, banka, vergi (bir kez) — 2026-11-25 durum
**2026-11-26 kontrol:** Ücretli Uygulamalar Sözleşmesi "Active" (25 Kas 2026 - 12 Kas 2027), Garanti BBVA hesabı "Active" (TRY), W-8BEN ve yabancı statü beyanı "Active". Ürünler satışa hazır; sıradaki adım Sandbox deneme hesabı ve telefonda satın alma denemesi. AB DSA tacir beyanı hâlâ yapılmadı.

Tüzel kişi adresi Apple biçimiyle onaylandı (Kurupelit; site adı eklenemedi). Ücretli Uygulamalar Sözleşmesi kabul edildi → "Processing". Banka: Garanti BBVA Samsun OSB (0062 01163 055), TL, "Processing" (≤24 saat). Vergi: ABD anketi (mukim değil, ABD faaliyeti yok), W-8BEN (9. satır Türkiye, 10. satır boş) ve yabancı statü beyanı "Active". AB DSA tacir beyanı YAPILMADI (AB yayını öncesi gerekli). Küçük İşletme Programı başvurusu 2026-11-25 gönderildi (bağlı hesap yok; Apple e-postayla dönecek).

1. App Store Connect → **İş (Business)** → **Ücretli Uygulamalar (Paid Apps)** sözleşmesini kabul et.
2. Aynı sayfada **banka hesabı** ve **vergi formlarını** doldur (Türkiye'den bireysel geliştirici: W-8BEN formu çıkar). Durum "Etkin" olana kadar ürünler satışa çıkmaz; onay birkaç gün sürebilir.
3. **Küçük İşletme Programı (App Store Small Business Program)** başvurusu: developer.apple.com/app-store/small-business-program — kabul edilirse Apple payı %30 yerine %15.
4. Vergi sorusu için bir mali müşavire danış (bu gelirin Türkiye'de nasıl beyan edileceği).

## 2. Üç ürünü oluştur — YAPILDI (2026-11-25, Claude Code tarayıcıdan; kullanıcı: "carsamba geçmesin adında")
Durum: üçü de "Prepare for Submission"; temel ülke Türkiye; fiyatlar 29,99 / 79,99 / 199,99 TL (Apple'ın karşılığı ABD'de 0,99 / 0,99? / 3,99 $ — App Store Connect'teki listeye bak); 175 ülkede açık; Türkçe ad+açıklama girildi. Eksik: İngilizce yerelleştirme ve inceleme ekran görüntüsü (incelemeye göndermeden önce).
İlk denemede açılan `com.urazonturk.carsamba.cay` silindi (bu kimlik bir daha kullanılamaz).

App Store Connect → Uygulamalar → Byzantion → **Para Kazanma → Uygulama İçi Satın Alımlar → +**
Tür: **Tüketilmeyen (Non-Consumable)** — üçü de. Ürün kimlikleri **harfi harfine** şöyle olmalı (kod bunları arıyor):

| Referans adı | Ürün kimliği (Product ID) | Görünen ad (TR) | Açıklama (TR) | Önerilen fiyat |
|---|---|---|---|---|
| Cay 1 | `byzantion.cay` | Bir çay | Amcaya bir çay ısmarla | en alt kademe (≈0,99 $) |
| Cay 2 demlik | `byzantion.demlik` | Bir demlik | Amcaya bir demlik çay ısmarla | ≈2,99 $ |
| Cay 3 semaver | `byzantion.semaver` | Semaver | Amcaya bir semaver çay ısmarla | ≈6,99 $ |

İngilizce yerelleştirme: "A glass of tea" / "A pot of tea" / "A samovar" — "Buy Amca a tea".
Fiyat: Türkiye'yi **temel mağaza** seçip TL fiyatı elle koymak öneriliyor (Apple Türkiye fiyatlarını yeniden ayarlıyor; TL rakamlarını App Store Connect'teki güncel kademeden seç).

Her ürüne: **İnceleme ekran görüntüsü** (çay kartının ekran görüntüsü — Claude Code hazırlar) ve kısa inceleme notu: "Destek/bahşiş amaçlı; karşılığında menüde rozet. Oyunu kolaylaştırmaz."

## 3. Sürümle birlikte gönder
Her türün ilk ürünü **yeni uygulama sürümüyle** incelemeye gider: sürüm sayfasında "Uygulama İçi Satın Alımlar" bölümünden üç ürünü seç, sürümle birlikte gönder.

## 4. Mağaza metni
Açıklamaya ilk günden: "Ücretsiz, reklamsız. Satılan her şey yalnız görünüş ya da geliştiriciye çay; oyunu kolaylaştırmaz."

## 5. Deneme (para harcamadan)
- Simülatörde: Xcode'da **frontend-cay-deneme** şeması (ios/Byzantion-Cay.storekit dosyasını kullanır) — gerçek para yok.
- 2026-11-26: Sandbox deneme hesabı oluşturuldu (Byzantion Deneme, Türkiye, Hotmail adresinin +byzantion1 takma adı; şifreyi kullanıcı girdi). Telefondaki Release paketi (25 Kas 19:57) byzantion.cay/demlik/semaver kimliklerini içeriyor (strings ile doğrulandı).
- 2026-11-26 telefon denemesi (kullanıcı): Semaver sandbox hesabıyla satın alındı; teşekkür ekranı, menüde "Çayın için sağ ol" + semaver rozeti ve kartta "Ismarlandı ✓" görüldü (kullanıcı: "tamamdır hepsi geldi"). Geri yükleme ayrıca denenmedi.
- Telefonda gerçek akış: App Store Connect → Kullanıcılar ve Erişim → **Sandbox test hesabı**; TestFlight sürümünde satın almalar da ücretsizdir.
