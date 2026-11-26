Bu çalışma alanı oturumda **salt okunur** olduğundan `editor-kivilcim.md` dosyasını yazma girişimi engellendi. İstenen raporu aşağıya bırakıyorum; oyun koduna dokunmadım ve görsel üretmedim.

# Kıvılcım — görsel tasarım ve karakter dili görüşü

## A) Amcanın uçuşu ve inişi

Mevcut karelerde gövde dik, kollar yanda ve yüz sakin kaldığı için eğim tek başına “uçuyor” hissi vermiyor. En az çizimle en görünür fark için **iki yeni ana poz** öneriyorum:

1. **Havada rüzgâr pozu:** Gövde uçuş yönünün tersine hafif yatık; kollar omuzdan açılıp geriye savrulmuş, dirsekler yumuşak; dizler geride/toplu, ayak uçları farklı açıda. Gözler kısık, yanaklar rüzgârla geriye çekilmiş; bıyık ve ceket eteği geriye akıyor. Kalkıştan hemen sonra ve yükseliş boyunca gösterilsin; tepeye yaklaşınca mevcut nötr veya çömelme pozuna yumuşak geçsin.
2. **İnişe hazırlanma:** Gövde dikleşmiş, kollar iki yana denge için açık (biri biraz önde), dizler belirgin bükülü ve ayaklar çatıyı arıyor. Gözler aşağıda, bıyık hafif yukarı kalkmış; ceket eteği hâlâ geride. Temastan yaklaşık 120–150 ms önce başlayıp inişin ilk ezilmesine bağlansın.

Pijamada külah ve terlik; kışta bere, atkı ve mont; yağmurda yağmurluk; şemsiyeli yağmurda bir elde açık şemsiye korunmalı. Şemsiyeli karede diğer kol açık kalsın. **Poz başına 4 temel PNG** gerekir: normal, pijama, kış, yağmur. Şemsiyeli yağmur da ayrı çizilecekse poz başına bir ek PNG gelir: **toplam 8–10 PNG**. Mevcut özel gün şapkaları bindirme olarak kullanılabiliyorsa ayrıca tam poz çizimi gerekmeyebilir; hizalama kontrolü gerekir. İlk adım yalnız havadaki rüzgâr pozu olursa **4–5 PNG** yeter.

Tek parça PNG’nin tamamı kodla ayaktan en fazla ±12° döndürülüp kalkışta kısa esnetilebilir. Bu, gövde çizgisini iyileştirir ama kolları açmaz. **Kolları bağımsız döndürmek için kolun ayrı şeffaf parça olması gerekir**; mevcut tek parça görselde kodla eklem yaratmak temiz sonuç vermez. Her görsel üretim çağrısı ayrıca onaylanmalı; üretilen görsel kabul edilmeden oyuna bağlanmamalı.

## B) Duraklara amaç ve ödül fikirleri

| Fikir | Tek dokunuşla işleyiş ve sonraki durak hedefi | Kartpostal/kedi bağı | Yeni görsel | Puan/kule üretimi | Efor |
|---|---|---|---:|---|---|
| **Sefer bileti damgaları** | Her durağa ilk varışta bilete semt damgası basılır; sonraki damga silik görünür. | Kartpostal açılışı bilete işlenir; durak kedisi varsa pati damgası eklenir. | 1 bilet şablonu; 12 damga kartpostallardan türetilebilir | Dokunmaz | S |
| **Semt hatırası** | Durak çatısında görülen semte özgü eşya inişle koleksiyona eklenir: Kanlıca yoğurt kasesi, Beykoz camı gibi. | Kartpostal arkası eşyanın kısa hikâyesini tamamlar; kediye bir anekdot bağlanabilir. | 12 eşya ikonu | Dokunmaz | M |
| **Muhtarın üç işi** | Her koşuda üç kısa görev: iki kediyle tanış, üç kez tam ortaya in, bir sıçrayışta iki kule geç. Biten iş bilette işaretlenir. | Görevlerden biri kedi karşılaşmasına yönlendirir; kartpostal yeni semt hedefi olur. | 0–1 bilet/işaret görseli | Mevcut puan ve üretime dokunmaz. Tam orta puan bonusu eklenirse ayrı onay gerekir. | M |
| **Eksik kartpostal notu** | Kartın arkasındaki kısa cümlenin kelimeleri farklı semtlerde otomatik toplanır; oyuncunun ek dokunuşu gerekmez. | Kedi notu bir kelimeyi tamamlayabilir. | 12 kart arkası düzeni; yeni çizim şart değil | Dokunmaz | M |
| **Boğaz selamları** | Bazı duraklarda teyze, kedi veya karga görünür; güvenli inişten sonra kısa selam sahnesi açılır. | Kedi defteri ve kartpostal aynı semt anısına bağlanır. | 0 yeni; mevcut görseller | Dokunmaz | S–M |
| **Tek dokunuşlu semt bilmecesi** | Durak bandında kısa bir soru görünür; iniş sonrası kartta bir seçim yapılır. Doğru cevap dekoratif hatıra açar. | Cevap kartpostal arkasında açıklanır; kediler ipucu karakteri olabilir. | 0–12 küçük ikon | Dokunmaz | M; akışı kesme riski |

**En iyi iki seçimim:**

1. **Sefer bileti damgaları:** Var olan 12 durak ve kartpostal ilerlemesini tek, anlaşılır koleksiyonda görünür kılar. Yeni mekanik veya dünya kuralı eklemeden “bir durak daha” hedefi verir.
2. **Muhtarın üç işi:** Her koşuda ulaşılabilir kısa hedef sunar; görevleri doğal inişlere ve mevcut kedi karşılaşmalarına bağlayarak tek dokunuş ritmini korur. Ödüller kozmetik veya ilerleme olmalı. Tam orta iniş için yeni puan verilmesi puan kuralını değiştirir ve ayrıca onay gerektirir. Kule dizisini değiştiren bir fikir önermiyorum.

## C) Türden alınabilecek amaç kalıpları

- **Alto’s Odyssey:** 180 küçük hedef, ana koşuyu tekrar oynatıyor; Zen modu hedef baskısı olmadan aynı hissi sunuyor. Byzantion’a uygun ders: ayrı kontrol gerektirmeyen kısa görevler. [Resmî basın kiti](https://altosodyssey.com/press/)
- **Subway Surfers:** Üçlü görev seti ve harf/kelime toplama, koşu içinde küçük hedefler yaratıyor. Burada HUD’ı dolduran harf avı yerine semt damgası veya otomatik görev sayacı daha uygun. [Missions](https://sybo.helpshift.com/hc/en/5-subway-surfers/faq/143-missions/), [Word Hunt](https://sybo.helpshift.com/hc/en/5-subway-surfers/faq/134-word-hunt/)
- **Crossy Road:** Oynayarak açılan karakter koleksiyonu skor dışı kalıcı ilerleme sağlıyor. Byzantion’da bunun karşılığı yeni oynanış karakterleri yerine semt hatıraları ve kartpostallar olabilir. [Oyun özeti](https://time.com/3602328/crossy-road/)
- **Jetpack Joyride:** Görevleri bitirip yenisini alma döngüsü kısa oturumlara hedef veriyor; görevler koşu içinde sayılabilir ve anlaşılır olmalı. [Görev sistemi özeti](https://en.wikipedia.org/wiki/Jetpack_Joyride)
- **Tiny Wings:** Tek düğmeli beceri döngüsüne görev ve yuva ilerlemesi ekliyor; amaç ana mekanikle aynı ritimde kalıyor. [App Store](https://apps.apple.com/us/app/tiny-wings/id417817520)
- **Monument Valley:** Bulmaca hedefi, ana mekaniğe uygun ve özel tasarlanmış seviyelerde çalışıyor. Byzantion’un kesintisiz atlayışına yeni bir bulmaca kontrolü eklemek yerine bilmeceyi durak kartına, yani iniş sonrasına koymak daha uygun. [Resmî SSS](https://monumentvalleygame.squarespace.com/faq)

Stick Hero ve Mini Metro’dan çıkarılabilecek genel ders, beceriyi net bir ölçüyle görünür kılmak ve bulmacayı ana döngü taşıyabildiğinde eklemek. Bu oyunda öncelik durak koleksiyonu ve kısa görevler; uçuş sırasında ek düğme ya da kule düzenine bağlı görev değil.