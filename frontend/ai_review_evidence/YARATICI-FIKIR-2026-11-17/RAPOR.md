# Byzantion — Yaratıcı Fikirler Raporu (2026-11-17)

Kullanıcı: "hava o gün İstanbul'da nasıl ise bizim oyunda da gerçek zamanlı olsun … yaratıcı fikirler istiyorum, diğer editörlerle".
Danışılan: Codex (`codex-gorusu.md`) ve ikinci bir Claude editörü (aşağıda özetlendi). Brif: `brief.md`.

## 1. Gerçek zamanlı İstanbul havası — ortak karar: EVET, yalnız görünüş

İki editör de aynı yerde birleşti: hava **dekor ve atmosfer** olsun, zıplamayı/kamerayı/çatıları değiştirmesin.

| Hava | Oyunda nasıl görünür |
|---|---|
| Yağmur | ince çapraz çizgiler, çatılarda ıslak parlama |
| Lodos | ılık turuncu ton, bulutlar hızlı akar, çamaşırlar uçuşur, amcanın bıyığı titrer, Boğaz köpüklü |
| Poyraz | soğuk mavi ton, bulutlar ters yönde akar |
| Sis | uzak siluet (köprü, karşı yaka) silinir, yakın kuleler hep net; arada sis düdüğü |
| Kar | yavaş taneler, çatı kenarlarında beyaz şerit |
| Gün batımı / gece | gerçek doğuş-batış saatine göre (gece zaten var, saate bağlanır) |

**Oyuncu nasıl fark eder:** menü kartpostalında damga — "17 Kasım · Lodos · 14°" — ve ilk koşuda tek satır: "Bugün İstanbul'da lodos var, çamaşırları topla!"

**Riskler ve çözümler**
- Okunurluk: efekt yalnız arka katmanlara; sıradaki kule asla örtülmez.
- Kasımın gri havası sıkıcı olmasın: gri gün "çay günü" sıcaklığında çizilir.
- Çevrimdışı: son veri telefonda saklanır; yoksa / 6 saatten eskiyse "açık hava + gerçek saat".
- Pil/FPS: parçacık sayısına sınır.
- Rüzgârın zıplamayı etkilemesi: yalnız ayrı, isteğe bağlı bir "Lodos Modu" olabilir; Günün Haritası ve hayalet yarışta ASLA (aynı harita farklı oyun olur, sıralama bozulur).

**Veri kaynağı (önemli):** Claude editörünün uyarısı doğru — Open-Meteo'nun ücretsiz katmanı ticari olmayan kullanım içindir. App Store oyunu için daha uygun seçenek **Apple WeatherKit**: Apple geliştirici hesabına dahil (ayda 500 bin çağrıya kadar ücretsiz), ticari kullanıma açık, konum izni istemez (sabit İstanbul koordinatı). Gereken: Apple Developer hesabında WeatherKit yetkisini açmak (hesap işlemi — kullanıcı onayı gerekir) ve ekranda küçük "Apple Hava Durumu" atfı.

## 2. Yaratıcı fikirler (iki editörden, birleştirilmiş)

| # | Fikir | His | Yapım | Efor |
|---|---|---|---|---|
| 1 | **Günün İstanbul'u** — gerçek saate göre şafak → gün → gün batımı → gece | Şehirle aynı anda yaşıyor | Kod | Orta |
| 2 | **Ay evresi ve yakamoz** — gece ayın şekli gerçek; dolunayda Boğaz'da gümüş ışık yolu + "Yakamoz" kartpostalı | Gece oynamak için sebep | Kod (internetsiz hesap) | Küçük |
| 3 | **Pil = amcanın şarjı** — telefonun pili %15 altındaysa amca esner: "Senin şarjın da bitiyor, benim de"; şarjdaysa yanında çay | "Oyun beni görüyor" şaşkınlığı, paylaşılır | Kod (izin istemez) | Küçük |
| 4 | **Lodosta vapurlar iptal** — rüzgâr eşiğinde vapurlar kaybolur, iskelede "Seferler iptal" | İstanbullunun tanıdık anı | Kod + 1 tabela görseli | Küçük |
| 5 | **Kar tatili** — İstanbul'da gerçekten kar varsa menüde "Okullar tatil!" manşeti, kardan adam, özel kartpostal | Herkesin aynı gün konuştuğu olay | Kod + 2-3 görsel | Orta |
| 6 | **Gece yarısı amcası** — saat 02:00-05:00 arası amca pijamalı/uykulu: "Bu saatte ne işin var evladım?"; sabah ilk koşuda simit-çay kartı | Oyuncunun gününe dokunur | Kod (pijama görseli zaten var) | Küçük |
| 7 | **İstanbul takvimi** — nisanda erguvan/lâle, sonbaharda Galata'da lüfer oltaları, kışın kestane dumanı, Hıdrellez'de dilek ağacı kartpostalı | Oyun yaşıyor, geri dönmeye değer | Kod + mevsim başına 1 görsel | Orta |
| 8 | **Martı vergisi** — martı amcanın simidini kapar, amca yumruk sallar; ertesi gün kartpostalda martı simitle görünür | Günler arası süren küçük hikâye | Kod + 1 görsel | Küçük |
| 9 | **Teyzenin sepeti** — balkondan iple sepet sarkar, amca simit kapar; kaçırırsan "Ayıp ettin!" | Mahalle sıcaklığı | 1-2 görsel + kod | Orta |
| 10 | **Amcanın çay molası** — uzun seride amca bir çatıda çayını üfler, dokununca devam | Karaktere nefes | Kod + yeni poz görseli | Orta |

**Bilerek dışarıda bırakılanlar:** maç günleri (takım kavgası), ezan/sahur davulu (dini hassasiyet), gerçek vapur saatleri (güvenilir ücretsiz kaynak yok, gömülü tarife eskir).

## 3. Önerilen sıra (iki editörün ortak sıralaması)

1. **Gerçek saat + gün doğumu/batımı + ay evresi (yakamoz dahil).** İnternet gerektirmez, risksiz; hava katmanının altyapısı da budur. Tamamen kodla.
2. **Gerçek hava katmanı (yağmur, sis, lodos, sonra kar) + "Bugün İstanbul'da lodos var" damgası.** Asıl istek. Lodosta vapur iptali aynı veriyle neredeyse bedava gelir. WeatherKit için hesap onayı gerekir; onay gelene kadar kod hazırlanıp sahte veriyle simülatörde denenebilir.
3. **Pil = amcanın şarjı.** En ucuz, en şaşırtıcı fikir; oyunun "şarj" mekaniğiyle kelime oyunu. Görsel gerektirmez.

Değişmeyenler: fizik, kamera, çatı silueti; yeni görseller kullanıcı onayı olmadan oyuna bağlanmaz.
