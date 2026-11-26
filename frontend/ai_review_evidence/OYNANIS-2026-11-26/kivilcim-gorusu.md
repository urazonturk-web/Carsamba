**Not:** Çalışma alanı bu oturumda salt okunur; bu nedenle raporu dosyaya kaydedemiyorum. Aşağıdaki metin dosyaya aktarılmaya hazır. Kodu yalnızca okudum; fizik, kamera ve çarpışmayı değiştirecek önerileri özellikle ayırdım. “Diğer editörlerle” bağımsız değerlendirme yaptığımı söyleyemem; bu rapor editoryal ürün değerlendirmesidir.

# Byzantion — Oynanabilirliği artırma raporu
*26 Kasım 2026*

## Türde oynanışı taşıyan mekanikler

- **Stick Hero / Jump Jump:** Tek hareketle hemen başlama, basılı tutma süresini mesafeye dönüştürme ve dar hedefe inişin risk-ödül gerilimi. Kontrolün öğrenilmesi kolay; ustalaşması zaman alıyor. [Stick Hero](https://play.google.com/store/apps/details?id=com.ketchapp.stickhero)
- **Helix Jump:** Hareket hâlindeki tehlikeyi anında okunur kılan görsel kontrast, kısa denemeler ve başarısızlıktan hemen yeniden başlama. [Voodoo: Helix Jump](https://voodoo.io/games/helix-jump)
- **Crossy Road:** Basit çekirdek döngünün üstüne günlük meydan okuma, skor tablosu, çok sayıda karakter ve paylaşılabilir başarı koyuyor. [App Store: Crossy Road](https://apps.apple.com/us/app/crossy-road/id924373886)
- **Doodle Jump:** Yüksek skor peşinde koşmayı güçlendirme nesneleri, engeller ve dönemsel içerikle tazeliyor. [App Store: Doodle Jump](https://apps.apple.com/us/app/doodle-jump/id307727765)
- **Alto:** Akıcı hareket hissi, sakin sunum ve görsel çeşitliliği öne çıkarıyor. Byzantion için çıkarım: yeni içerik, ana dokunma-zıplama döngüsünün ritmini boğmamalı.

Bu örnekler Byzantion’a bire bir kopyalanacak reçeteler değil; kısa öğrenme süresi, belirgin geri bildirim ve oturumlar arasında geri dönüş sebebi için karşılaştırma noktalarıdır.

## Mevcut durum ve puan

Kodda şarj ve iniş geri bildirimi (sıkışma animasyonu, çatı tozu), seri/çok kule puanları, günlük harita, meydan okuma ve hayalet yarış altyapısı görünüyor. Duraklar, kartpostallar ve kedi defteri uzun vadeli koleksiyon hedefi sağlıyor. Dolayısıyla ana fırsat daha çok içerik eklemekten önce **ilk dakikayı anlaşılır kılmak**, inişin tatminini görünür/duyulur yapmak ve mevcut günlük/rekabet sistemlerini tekrar oynama nedenine dönüştürmek.

- **Oynanış / his: 7/10.** Basit tek parmaklı fikir, İstanbul atmosferi ve iniş efektleri güçlü temel. Gerçek cihazda yeni oyuncunun ilk 5–10 zıplamasını görmeden kontrolün ne kadar sezgisel ve inişin ne kadar tatmin edici olduğunu doğrulayamam.
- **Geri gelme isteği: 7/10.** Günlük harita, koleksiyon, rekor ve meydan okuma mevcut. Düzenli mini hedef/ödül döngüsünün oyuncuya ne zaman ve neden dönmesini söylediği daha belirgin olabilir.

## Öncelikli öneriler

Efor düzeyi tahminidir; görsel sayısı **yeni üretilecek görsel** adedidir. Kod eforu düşük: birkaç saat–1 gün; orta: 2–5 gün; yüksek: 1+ hafta tahmini. Mevcut sanat varlıklarının yeniden kullanılması varsayılmıştır.

| Öncelik ve öneri | Çözdüğü sorun, İstanbul’a özgü tasarım | Efor / yeni görsel | Fizik, kamera, çarpışma |
|---|---|---|---|
| **1. İlk koşuda 3 adımlı öğretici** | Ekran üstü kısa yönlendirme: “Basılı tut”, “Bırak”, “Daha uzun tut = daha uzağa”. İlk kulelerde güvenli, anlaşılır ritim kurar; “amca” diliyle kısa ve mizahi olabilir. | Düşük / 0 | Hayır |
| **2. İniş geri bildirimini ses ve ayarla tamamla** | Mevcut toz/sıkışmaya inişte kısa, katmanlı ses ve ayrı kapatılabilen titreşim ekle; isabetli inişe farklı, abartısız bir çatı sesi. Erişilebilirlik için sessiz/titreşimsiz seçenek. | Düşük / 0 | Hayır |
| **3. Günlük haritaya tek net hedef** | Her gün bir görev: ör. “Üç durakta seri yap” veya “kediyle tanış”. Sonuçta ilerleme ve tamamlandı göstergesi; mevcut harita ve albümle bağ kurar. | Orta / 0 (arayüz/metin) | Hayır |
| **4. Kısa yeniden başlama ve son koşu özeti** | Oyun sonrasında tek dokunuşla yeniden dene; özet “en iyi seri”, “en yakın kule”, “bugünkü hedef” gibi kişisel gelişimi gösterir. Ölüm anındaki hayal kırıklığını yeni denemeye çevirir. | Düşük / 0 | Hayır |
| **5. Görsel/işitsel erişilebilirlik ayarları** | Titreşim, ses, ekran sarsıntısı ve yüksek kontrast seçenekleri; hızlı şarj göstergesini renk dışında şekil/dolulukla da anlat. Karanlık/gece temalarında hedef okunurluğunu koru. | Orta / 0 | Hayır |
| **6. Durak başına küçük sürpriz olayı** | Mevcut semtlerde vapur düdüğü, martı geçişi ya da uzakta çay tepsisi gibi kısa arka plan anları; oyuncunun karar zamanlamasını örtmesin. Tekrara karşı semt kimliği verir. | Orta / 6–10 (olay başına tekil varlıklar; mevcut varlıkla yapılırsa 0) | Hayır |
| **7. Ustalık hedefleri ve kişisel rekor kırılımı** | “3 kusursuz iniş”, “iki kuleyi tek sıçrayışta geç” gibi isteğe bağlı hedefler; oyuncuya yalnızca toplam skor dışında gelişim ölçüsü verir. Puan/ödül dengesi sömürüsüz ve kozmetik/defter odaklı kalmalı. | Orta / 0 | Muhtemelen hayır; skor mantığı etkilenebilir |
| **8. Hayalet yarışını görünür kıl** | Rakibin hayaleti ve “şu an önde/geride” bilgisi, oyuncuya aynı haritada anlamlı rekabet verir. Ekranı kalabalıklaştırmadan okunmalı; ilk etapta arkadaş meydan okumasına odaklanabilir. | Orta / 0 yeni; mevcut hayalet görünümü yetersizse 1 | Hayır |
| **9. Kısa oturum seçeneği** | “2 dakika meydan oku” zaten var; menüde amacı ve bitiş koşulunu tek cümleyle açıkla. Üç turluk/tek duraklık hızlı mod, uzun koşuya vakti olmayanlara seçenek sunar. | Orta / 0 | Evet, mod kuralı/oturum akışı; çekirdek fizik değil |

**Risk notu:** 6. öneride yeni görseller, tek geliştirici için üretim/entegrasyon ve tutarlılık yükü yaratır. Önce mevcut arka planla prototiplenebilir. 9. öneri yeni mod olduğu için menü ve skor akışı ek yük getirir. Hiçbir öneri fizik, kamera veya çarpışma değişikliği gerektirmiyor; 7 ve 9’da skor/mod kuralları değişir ve ayrı tasarım kararı ister.

## İlk yapılacak 3 iş

1. İlk koşu öğreticisini mevcut oyun akışına ekle; oyuncunun basılı tutma ve bırakma davranışını ilk dakikada sınasın.
2. İniş sesi ve titreşimi cihazda değerlendir; ayrı ayar ekleyerek sessiz/titreşimsiz oyunu mümkün kıl.
3. Günlük haritaya tek anlaşılır hedef ve tamamlanma göstergesi bağla; mevcut sistemleri kullanarak geri dönüş sebebini görünür yap.

**Ölçüm önerisi:** TestFlight’taki yeni oyuncularla, ilk 60 saniyede öğreticisiz/öğreticili kontrol anlayışını; ilk oturumda tekrar deneme oranını; ertesi gün açılışını kaydedin. Katılımcı sayısı küçükse sonuçları yön gösterici kabul edin, kesin ürün metriği gibi sunmayın.