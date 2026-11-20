# Byzantion — Farklı iPhone/iPad boyutlarında ekran denetimi (2026-11-20)

Kullanıcı: "Evet, tüm cihazlarda dene ve tabloyu hazırla"
Yöntem: Release simülatör sürümü ("YAGMUR + RUZGAR v2", 5783741 kodu), Xcode 27.2 simülatörleri. Her cihazda menü → oyun → oyun sonu ekran görüntüsü; iPad'lerde ayrıca yatay ekran. Görüntüler bu klasörde, karşılaştırma sayfaları: `iphone-1-menu.jpg`, `iphone-2-oyun.jpg`, `iphone-3-oyunsonu.jpg`, `ipad-dikey.jpg`, `ipad-yatay.jpg`.
**Sınır:** simülatör ekran düzenini doğru gösterir; akıcılık, titreşim, ses ve ısınma için gerçek telefon gerekir. Kod değişmedi.

## Tablo

| Cihaz | Ekran (nokta) | Menü | Oyun | Oyun sonu | Sorun |
|---|---|---|---|---|---|
| iPhone 17e | 390×844 | ✅ | ✅ | ✅ | Yağmur kıyafeti çıkmadı (bkz. Hata 1) |
| iPhone 17 | 402×874 | ✅ | ✅ | ✅ | — |
| iPhone 18 Pro | 402×874 | ✅ | ✅ | ✅ | — |
| iPhone Air | 420×912 | ✅ | ✅ | ✅ | Yağmur kıyafeti çıkmadı (Hata 1) |
| iPhone 18 Pro Max | 440×956 | ✅ | ⚠️ | ✅ | Yağmur kıyafeti çıkmadı (Hata 1); açılış uyarısı skoru örtüyor (Sorun 3) |
| iPhone Duo — kapalı | 466×678 | ⚠️ | ⚠️ | ✅ | **Ses düğmesi kameranın altında, görünmüyor**; menü kartı amcayı örtüyor (Sorun 2) |
| iPhone Duo — açık | — | — | — | — | Denenmedi: simülatör katlı açılıyor, iç ekran kapalı (siyah) |
| iPad mini | 744×1133 | ✅ | ⚠️ | ✅ | Her şey küçük; **yatayda bozuk** (Sorun 4) |
| iPad (A16) | 820×1180 | ✅ | — | — | Yalnız menü denendi; mini ile aynı düzen |
| iPad Air 11 | 820×1180 | ✅ | — | — | Yalnız menü; yağmurda kıyafet yok (Hata 1) |
| iPad Pro 11 | 834×1210 | ✅ | — | — | Yalnız menü; yağmurda kıyafet yok (Hata 1) |
| iPad Air 13 | 1024×1366 | ⚠️ | — | — | Yalnız menü; Pro 13 gibi küçük ölçek |
| iPad Pro 13 | 1032×1376 | ⚠️ | ⚠️ | ✅ | Amca ve kart çok küçük, gökyüzü kırpılıyor; açılış uyarısı skoru örtüyor; **yatayda bozuk** (Sorun 4) |

✅ düzgün · ⚠️ oynanıyor ama görsel sorun var

## Bulgular (önem sırasıyla)

**Hata 1 — Yağmurda kasket + mont bazen hiç çıkmıyor (tüm iPhone'lar).**
Hava bilgisi uygulama açıldıktan *sonra* gelirse (önbellekte hava yokken — ilk açılış ya da uzun aradan sonra), o oturum boyunca amca eşofmanla kalıyor; "Bir daha" da düzeltmiyor. Uygulama kapatılıp açılınca (hava artık önbellekte) kıyafet geliyor. 17e, Air ve 18 Pro Max'te görüldü; 18 Pro Max'te kapat-aç ile doğrulandı. Muhtemel neden: `rain` özelliği ilk çizimde boş olunca kıyafet katmanının animasyon stili sonradan bağlanan değeri izlemiyor (`app/index.tsx` 1234-1244, `src/game/ChargePoses.tsx` 104-105). Küçük bir kod düzeltmesi.

**Sorun 4 — iPad yatay ekranda arka plan bozuluyor.**
Projede iPad açık ve yatay ekrana izin veriliyor (`UISupportedInterfaceOrientations~ipad` dört yön, `UIRequiresFullScreen = false`). Yatayda gökyüzü ve tarihi yarımada silüeti tamamen kayboluyor, ekranın çoğu deniz; ayrıca aynı anda çok daha fazla kule görünüyor (oyun kolaylaşıyor). Apple incelemesi iPad'de de deneyebilir. Seçenekler: (a) iPad'i kapat — yalnız iPhone; (b) iPad'i dikeye kilitle + `UIRequiresFullScreen = true`; (c) iPad'e özel düzen (büyük iş).

**Sorun 2 — iPhone Duo (katlanabilir, kapalı): ses düğmesi kayboluyor.**
Bu modelde kamera ve durum çubuğu ekranın sağ üstünde dikey bir sütun; ses düğmesi tam onun altında kalıyor. Menü kartı da amcayı örtüyor (ekran daha kare). Oyun ve oyun sonu düzgün.

**Sorun 3 — "Bugün İstanbul'da yağmur var, şemsiyeni unutma!" uyarısı skoru örtüyor.**
Oyun başında birkaç saniye skor ve REKOR yazısının üstünde duruyor (18 Pro Max, iPad Pro 13). Ayrıca şemsiye iptal edildiği hâlde metin şemsiyeden söz ediyor (amca artık mont giyiyor — metin "montunu giy" gibi olabilir).

**Sorun 5 — iPad'de ölçek küçük.**
Dikeyde düzen bozulmuyor ama amca, kart ve butonlar ekrana göre küçük; 13 inçte gökyüzü üstten kırpılıyor. Oynanabilir; mağaza görüntüsünde zayıf görünür.

**Küçük:** iPhone 17e'de oyun sonu kartındaki amca rozeti ekranın sol kenarına değiyor.

## Önerilen düzeltmeler
1. Hata 1 (yağmur kıyafeti) — küçük kod düzeltmesi, tüm oyuncuları etkiliyor.
2. iPad kararı (Sorun 4-5): en kolayı iPad'i kapatmak ya da dikeye kilitlemek.
3. Uyarı balonunu skorun altına almak + metni monta uyarlamak.
4. iPhone Duo: ses düğmesini güvenli alana göre yerleştirmek (kamera sütununu hesaba katmak).

## Düzeltme durumu
- **Hata 1 düzeltildi (2026-11-20):** `rain` değeri artık ilk çizimden verilir, görseller `rainLayers` ile bağlanır. iPhone 17e simülatöründe uygulama silinip sıfırdan kurularak doğrulandı: hava sonradan geldi, amca kasket + montla göründü (`duzeltme-17e-sifir-kurulum.png`). Telefona kuruldu, telefonda henüz görülmedi.
- **Sorun 4 çözüldü (2026-11-20, kullanıcı: "Dikeye kilitle"):** iPad yalnız dikey (`UISupportedInterfaceOrientations~ipad` = Portrait + PortraitUpsideDown) ve tam ekran (`UIRequiresFullScreen = true`). Kalıcı kaynak `app.json` (`ios.requireFullScreen`, `infoPlist`), kurulu proje `ios/frontend/Info.plist`. iPad mini simülatöründe cihaz yan çevrildi, oyun dik kaldı (`ipadmini-kilit-sonrasi-yatay.png`). iPad ölçeği (Sorun 5) değişmedi.
