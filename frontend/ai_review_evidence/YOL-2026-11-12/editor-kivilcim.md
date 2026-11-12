# YOL-2026-11-12 — Kıvılcım'ın bağımsız koordinatör görüşü

**Dayanak:** `ai_review_evidence/YOL-2026-11-12/brief.md` ve `GAME_STUDIO.md` güncel Faz 2 kayıtları. Diğer editörlerin `YOL-2026-11-12/editor-*.md` dosyaları okunmadı. Kullanıcının telefonda kabul ettiği yüz ifadeleri, ses/gaz, cepheler ve iniş hissi mevcut temel olarak korunur; fizik, kamera ve çatı silueti sabittir.

## 1. En büyük eksik

1. **Skorun ötesinde kısa vadeli bir hedef yok.** İlk birkaç atlayış eğlenceli olabilir, ancak oyuncu “bu turda nereye varacağım?” sorusuna cevap bulamıyor. Faz 3'ün değeri yeni efekt değil, Çarşamba'ya özgü bir **ilerleme nedeni** vermesi.
2. **Kabul edilmiş sürüm henüz güvenilir ürün tabanı olarak kapanmadı.** Son Faz 2 parçası commit edilmemiş; ses kapatma/ayar yok, beta yok. Her zıplamada gaz sesi kullanıcı kararı olsa da kalabalık ortamda veya uzun oturumda aç/kapa ihtiyacı gerçek. Bu borçla yeni özellik üstüne özellik eklemek hata ayıklamayı zorlaştırır.

## 2. Sıralı üç adım

| Sıra | Ne | Neden şimdi / kabul ölçütü | Boyut ve onay/maliyet | Ana risk |
|---|---|---|---|---|
| **1 — Kabul edilen Faz 2'yi kapat** | Release telefonda kısa tekrar testi; ses/efekt aç-kapa ayarı ve ilk oyun ipucunu gözden geçir; yanlışlıkla giren iCloud dosyalarını ayır; yalnız ilgili değişiklikleri temiz commit'e hazırla. | Son kabul edilen davranışın bir geri dönüş noktası ve sessiz oynama yolu olsun. Telefon testinde 2–3 dk ritim, ses kapatma ve takılma kontrolü. | **Küçük–orta**, 0 görsel çağrısı/harcama. Temiz yerel düzenleme rutin iş; **push/merge/beta** için ayrı kullanıcı onayı. | Temizleme sırasında kabul edilmiş gaz/ifade davranışının değişmesi. |
| **2 — Tek bir Faz 3 kancasını prototiple** | “**Vapura yetiş**”: mevcut Boğaz dünyasında örneğin 10–15 çatı sonra ulaşılan, tur içi görünür tek hedef ve varışta kısa başarı anı. İlk denemede mevcut varlıklar ve metin kullanılsın; fizik/kamera değişmesin. | Hedefin oyuncuyu bir el daha oynatıp oynatmadığını, yeni büyük görsel üretiminden önce ölçer. Başarı: oyuncu ilk 10 sn'de hedefi söyler; düştüğünde yeniden deneme nedeni tarif eder. | **Orta**, ilk prototip 0 üretim çağrısı. Kanca/varış kuralı için kullanıcı tasarım kararı; oyuna bağlamadan önce telefon önizlemesi. | Hedefin tekrar eden skor görevine dönüşmesi veya oynanış üstüne okunmaz UI yükü bindirmesi. |
| **3 — Manzarayı gerçek yolculuğa çevir** | Ayrı onayla gök+silüet, saydam deniz ve soluk mahalle şeridini üret; aynalı Galata/köprü tekrarını kaldır. Ardından Faz 3 prototipiyle beraber cihazda dikiş, okunurluk ve kare ritmini ölç. | R077'de “daha iyi” denilen kayma hissini korurken şehirde ilerleme vaadini görsel olarak destekler. | **Orta–büyük**, **3 görsel üretim çağrısı** ve tutarı önceden bilinmeyen kredi tüketimi; üretim, entegrasyon ve beta ayrı onay kapıları. | Dikişsiz katman/şeffaf kıyı üretiminde tekrar iş; yüksek çözünürlükten performans düşüşü. |

## 3. Şimdilik yapma / ertele

**Çarşamba Kupası, arkadaş hesabı, sunucu ve push** ertelensin: tek kişilik “neden oynayayım?” cevabı henüz sınanmadı; hesap ve operasyon yükü çok büyür. **Merkeze iniş puanı** 0'da kalsın; mevcut risk/ödül dengesine yeni puan kuralı eklemek Faz 3 kanca testini bulanıklaştırır. Yeni mizah cümlesi üretmeyin: kullanıcı sonuç esprilerini açıkça reddetti. Mağaza adı, iki dil ve TestFlight/beta kararı, temel oyun döngüsü ve ses ayarı doğrulandıktan sonra gelsin. Yayın öncesinde gaz mizahı için içerik/yaş derecelendirmesi ve imza profilinin yenilenmesi ayrı kontrol kapısıdır.

## 4. Kullanıcıya en fazla iki karar

1. **Faz 3'ün ilk deneme hedefi “vapura yetiş” olsun mu?** Evetse ilk tur için 10–15 çatı gibi kısa, gözle görülen bir varış eşiğiyle prototip hazırlanabilir; sayı telefon testinde ayarlanır.
2. **Arka plan için 3 görsel çağrısını şimdi mi onaylıyorsunuz, yoksa önce sıfır üretim maliyetli kanca prototipinin telefon sonucunu mu görelim?** Önerim: önce prototip sonucu.

Bu rapor yalnız yol önerisidir; kod/görsel üretilmedi, kredi harcanmadı, commit/push/yayın yapılmadı.
