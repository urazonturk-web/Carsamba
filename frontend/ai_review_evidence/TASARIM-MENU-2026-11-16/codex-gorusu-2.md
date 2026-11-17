## Somut teşhis

Bu üç ekran temiz ve okunaklı; sıkıcı hissettiren şey **düzensiz değil, fazla tekdüze olmaları**:

- **Tek bir görsel ritim var:** Krem zemin, kiremit rengi kalın çerçeve, yuvarlak köşeli büyük düğmeler ve benzer kalın yazılar her yerde tekrarlanıyor. Menüdeki “Oyna”, oyun sonundaki “Bir daha” ve yarış sonundaki eylemler aynı ağırlıkta görünüyor.
- **Kartlar dünyadan kopuk:** Arka plan İstanbul’u güçlü biçimde anlatıyor ama öndeki geniş, boş ve düz paneller bu resmin üzerine sonradan konmuş genel mobil oyun kartları gibi duruyor. Menüde amca çatıda; panel ise onunla ya da çatılarla ilişki kurmuyor.
- **Oyun anı hissi az:** 12 rekoru, “0” skoru ve “0 kule” sonucu statik metin olarak sunuluyor. Rekor, zıplama, yarış ya da varış anına ait görsel bir vurgu yok.
- **Ekranlar arasında kişilik farkı az:** Menü, tek kişilik oyun sonu ve hayalet yarışının sonucu aynı arayüz dilinde. Oysa yarış ekranı rakip hayaleti, süreyi veya meydan okuma duygusunu gösterebilir.
- **Renk sıcak, ama vurgu tek yerde toplanmış:** Kiremit rengiyle krem iyi bir temel; fakat bu renk büyük alanlarda tekrarlandığı için vurgu olmaktan çıkıyor. Arka planın deniz mavisi ve çatıların farklı renkleri arayüzde pek yankılanmıyor.

## Üç tasarım yönü

**1. “İstanbul’da bir durak” — önerim**

- **Menü:** Büyük paneli durak/kartpostal hissi veren daha küçük bir bilgi alanına çevirin. “Rekor 12”yi durak tabelası gibi, “Oyna”yı tek belirgin eylem olarak gösterin. Amca çatıda küçük bir selam animasyonu yapabilir.
- **Oyun sonu:** Skor önce sayarak yükselsin; yeni rekor varsa ekrana kısa süreli “YENİ REKOR” damgası gelsin. Amca çatı kenarında nefeslenebilir veya sevinçle el sallayabilir.
- **Yarış sonu:** Sonucu iki sade skor kartıyla verin: “Sen” ve arkadaşın/hayalet. Kazananın yanında küçük bir martı ya da bayrak vurgusu kullanın.
- **Öğeler ve uygulama:** Durak tabelası, kartpostal kenarı, martı ve amcanın mevcut görselleri. Metin, renk ve basit animasyonlar kodla olabilir; yeni amca pozu ya da özgün görsel gerekirse önce onay gerekir.

**2. “Çatı üstünde oyun”**

- **Menü:** Paneli çatı saçakları veya kiremit şeridiyle görsel olarak zemine bağlayın. Bölümleri birbirinden ayırmak için küçük çini motifleri kullanın.
- **Oyun sonu:** Skor alanında mevcut kule çizgisine/çatı ritmine gönderme yapın; sonucu bir “atlayış günlüğü” gibi sunun.
- **Yarış sonu:** Yarış sonucu, iki amcanın karşılıklı durduğu sade bir skor düellosu gibi düzenlenebilir.
- **Öğeler ve uygulama:** Kiremit, çini, bayrak ve mevcut amca. CSS/React Native çizimleriyle küçük süslemeler ve geçişler yapılabilir; yeni karakter pozu için görsel gerekir.

**3. “Boğaz kartpostalı”**

- **Menü:** Her açılışta görseli değiştirmeden, seçili durağı küçük bir kartpostal etiketiyle tanıtın.
- **Oyun sonu:** Son durak adı ve skor kartpostal başlığı gibi yer alsın.
- **Yarış sonu:** Sonuç “Arkadaşına gönder” eylemiyle eşleşen bir davet kartı görünümü kazansın.
- **Öğeler ve uygulama:** Mevcut manzara ve kartpostal fikriyle kod ağırlıklı ilerler; gerçek posta pulu/illüstrasyon seti istenirse yeni görsel gerekir.

## Önerim ve ilk adım

**“İstanbul’da bir durak” yönünü seçerdim.** Oyunun gezi ve meydan okuma duygusunu arayüze taşırken ekranları kalabalıklaştırmıyor. En küçük etkili adım: **oyun sonu skorunu sayarak artırıp yeni rekoru kısa bir damgayla kutlamak.** Bu değişiklik arayüze hareket ve ödül hissi katar; yeni görsel gerektirmez.

Canlılığı sade kalırken eklemek için her ekranda yalnızca **bir ana vurgu ve bir küçük hareket** yeterli: menüde amcanın selamı, oyun sonunda skor sayacı, yarış sonunda kazanan işareti. Fizik, kamera, çatı silueti, ses ve dokunma akışı aynı kalır; yeni görseller de kullanıcı onayına kadar oyuna bağlanmaz.