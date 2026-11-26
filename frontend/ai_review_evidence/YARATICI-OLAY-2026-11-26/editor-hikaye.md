# editor-hikaye — Karakterler, süregelen şakalar, küçük hikâyeler

Rol: mahalle anlatısı ve mizah. Bakış açım şu: önceki turdaki olayların sorunu yalnız "dokun-kov" kalıbı değildi. Olaylar **tek seferlik** kalıyordu, bir dakika sonra hiçbiri hatırlanmıyordu. Yeşilçam'da ve mahalle dizilerinde mizahı taşıyan şey tekrar eden insanlardır: aynı komşu, aynı rakip, aynı dedikodu, her seferinde biraz daha büyür. Bu yüzden aşağıdaki fikirlerin çoğu **duraklar arasında süren** bir ilişkiye ya da hikâyeye dayanıyor. Hepsi de oyunun tek fiiliyle oynanıyor: basılı tut, bırak, nereye ve nasıl indiğin. Yeni dokunma hedefi yok, kovalacak bir şey yok. Kod okundu (stops.ts, mahalle.ts, copy.ts), hiçbir dosya değiştirilmedi. Not: kullanıcı konuşma balonlarını kapattı (MAHALLE_SPEECH_ON=false). Bu yüzden hikâyeler yazıyla değil **jest, nesne ve tabelayla** anlatılıyor.

---

### 1. Rekor Cevdet: rekorun bir amca olarak geri gelir
**Kanca:** Kendi rekor koşun eşofmanı başka renk olan rakip bir amca olarak arka kulelerde zıplar ve oyuncu onu geçmeye çalışır.
- **Oynanış:** Önceki en iyi koşunun iniş kayıtları "hayalet" olarak oynatılır (Mario Kart'taki zaman denemesi hayaleti gibi). Cevdet her kuleye senin rekor koşunda indiğin anda iner, yarı saydam ve bir kat geride çizilir. Önündeysen sana dönüp bakar, kaşlarını çatar. Onu geçtiğin kulede kasketini yere vurur. Rekor koşunda düştüğün yere gelince patlar ve dumanın içinde kaybolur. Bu, "buradan sonrası yeni rekor" demenin yazısız yolu.
- **Neden yaratıcı:** Hayalet yarışı klişe bir mekanik. Onu bir **karaktere** dönüştürmek ise değil: rakip, oyuncunun geçmişteki kendisi. Dürüst olmak gerekirse buradaki yenilik mekanikte değil, anlatımda.
- **Amcayla bağı:** Her mahallede bir "ben senden iyi yaparım" amcası vardır (kahvehanedeki tavla rakibi).
- **İlk oyunda:** Hiç görünmez, çünkü henüz rekor yok. İlk düşüşten sonraki koşuda belirir ve ne olduğu kendiliğinden anlaşılır.
- **Tekrarda:** Rekor her kırıldığında Cevdet daha "hazırlıklı" gelir: önce eşofmanla, sonra kafa bandıyla, en sonunda spor ayakkabıyla (terliksiz!).
- **Kural:** Yok. Fizik ve puan aynı, Cevdet çarpışmaya katılmaz. Ancak koşu kaydı (kule kimliği + iniş zamanı) saklanmalı.
- **Görsel:** Amca pozlarının renk değiştirilmiş hâli (kodla tonlama, 0 çağrı). İsterseniz kalıcı Cevdet yüzü: 1 Kıvılcım çağrısı. **Boy: M**

### 2. Tek terlik: kıl payı inişin bir bedeli olur
**Kanca:** Kenara kıl payı inen amcanın terliği o çatıda kalır ve oyuncu yolun geri kalanını tek terlikle, mahallenin "terlik postasını" bekleyerek geçer.
- **Oynanış:** Sallanarak inişte terlik %30 olasılıkla düşer ve çatıda kalır, kamera ilerledikçe geride kaybolur. Amca tek ayağı yalın sürdürür: inişte o ayağını kaldırıp "of" der gibi yüzünü buruşturur. Sonraki durakta cumbadaki teyze terliği iple sepette sarkıtır ve amca durak çatısına **tam isabet** inerse terliğini alır. İnemezse terlik bir sonraki durağa kalır. İki terlik de giderse amca çorapla devam eder, çorabın biri delik.
- **Neden yaratıcı:** Başarısızlık ceza olmaktan çıkıp hikâyeye dönüşüyor. Durak inişine de bir amaç kazandırıyor. Klişe değil.
- **Amcayla bağı:** Terlik amcanın kimliğinin parçası. Ünlü "terlik fırlatan anne" şakasını tersine çeviriyor.
- **İlk oyunda:** İlk kıl payı inişte terliğin düşmesi büyük ve yavaş çizilir. Yalın ayak hemen fark edilir.
- **Tekrarda:** Terliği geri getirenler değişir: teyze, sepet, bir sonraki kedi (ağzında taşır), gece pijama durağında da komşu çocuk.
- **Kural:** Yok, terlik yalnız görüntü. İsteğe bağlı [KURAL]: yalın ayakken kenar toleransı biraz daha dar ("ayağı acıyor").
- **Görsel:** Yalın ayak ve çorap hâli için pozlarda ayak bölgesine yama (kodla maske denenebilir). Kalıcısı 2 Kıvılcım çağrısı (tek terlik, çorap). Terlik nesnesi 1 çağrı. **Boy: M**

### 3. Düğün konvoyu: davul vuruşunda bırak, gelin çiçeğini kap
**Kanca:** Kuzguncuk'ta aşağıdaki sahil yolundan kornalı bir düğün konvoyu geçer ve oyuncu zıplamalarını davulun vuruşuna denk getirdikçe amca halay başına dönüşür.
- **Oynanış:** Konvoy yaklaşık 6 kule boyunca altta akar ve davul "güm" diye vurur (yaklaşık 1,2 sn aralıkla, ekranda tokmak ve hafif titreşim). Bırakma anı vuruşa denk gelirse gaz izi renkli kurdeleye dönüşür ve konvoydan korna çalınır. Üç denk gelişten sonra gelin arabasının penceresinden gelin çiçeği atılır, yayın üstünde Kurukafa gibi asılı kalır. Amca uçuşta ona değerse çiçeği yakalar.
- **Süregelen şaka:** Çiçeği kaptıysan sonraki iki durakta bütün cumbalardaki teyzeler birbirine dönüp fısıldar (mevcut "bakış" pozları), biri elindeki örgüyü bırakır. Rumeli Feneri'nde, final durağında, amcanın yakasında hâlâ o çiçek vardır.
- **Neden yaratıcı:** Tek kontrolün üstüne **ritim** katmanı ekliyor, ama yeni bir fiil gerektirmiyor. Bırakmanın zamanlaması şarjı da etkilediği için gerçek bir ikilem var: vuruşa mı uyacaksın, doğru mesafeye mi? Klişe değil.
- **Amcayla bağı:** Her düğünde ilk halaya kalkan amca odur.
- **İlk oyunda:** Davul sesi ve tokmak görüntüsü ilk vuruşta kendini anlatır. Denk gelmezse de hiçbir şey kaybedilmez.
- **Tekrarda:** Konvoyun durağı ve davulun temposu değişir. Bazen sünnet konvoyu gelir (at üstünde çocuk), bazen asker uğurlaması.
- **Kural:** Yok (vuruşa uymak serbest). [KURAL] seçeneği: vuruşta bırakılan zıplama +1 puan.
- **Görsel:** Konvoy (3 araba, süslü gelin arabası) 1–2 çağrı, gelin çiçeği 1 çağrı. Kurdele gaz izi kodla. **Boy: M**

### 4. Yaka Derbisi: köprü geçişi bir maça dönüşür
**Kanca:** Köprüden geçerken iki yakanın cumbaları birbirine bayrak sallar ve oyuncunun her inişi "maçta" bir pozisyona dönüşür.
- **Oynanış:** Köprü üstündeki kulelerde (bridgeAt) skorbord belirir: ANADOLU 0 – 0 AVRUPA. Tam isabet senin yakana gol yazar (cumbalardan "gooool", havaya atılan kasketler). Kıl payı iniş "direkten döndü" sayılır (direk sesi). Fazla bekleyip patlarsan rakip yaka gol atar ve maç biter. Varış durağında amca ya kupa kaldırır ya da başını önüne eğip kaşkolünü çıkarır.
- **Neden yaratıcı:** Puan kuralına hiç dokunmadan, var olan iniş kalitesini **anlam** değiştirerek yeniden çerçeveliyor. Gerçek kulüp adı ve logosu kullanılmıyor, maç yakalar arasında. İnişe "gol" demek basit bir fikir, ama bu oyunun Boğaz coğrafyasına çok iyi oturuyor.
- **Amcayla bağı:** Eşofmanlı amcanın en ciddi olduğu konu futboldur.
- **İlk oyunda:** Skorbord ve ilk gol sevinci yeterince açık.
- **Tekrarda:** Üç köprü üç maç demek: lig, kupa, final. Köprü geçtikçe tribün kalabalıklaşır.
- **Kural:** Yok.
- **Görsel:** Skorbord ve bayraklar kodla, kaşkollü amca 1 çağrı. **Boy: S–M**

### 5. Vapurdaki Nermin Hanım: gaz bir utanca dönüşür
**Kanca:** Her Boğaz kesitinde geçen vapurun güvertesinde amcanın gençlik aşkı Nermin Hanım el sallar ve oyuncu onun önünde gaz bulutu bırakmamaya çalışır.
- **Oynanış:** Vapur yanında seyrederken uzun şarj = büyük gaz bulutu demek, bulut da rüzgârla vapura doğru süzülür. Nermin Hanım burnunu kapatır ve dönüp gider. Kısa şarjla yapılan "kibar" zıplamalarda gaz hafif kalır, Nermin Hanım gülümser ve mendil sallar. Bu da gerçek bir ikilem: uzak kuleye büyük atlayış mı, yoksa itibar mı?
- **Süregelen hikâye (12 durakta):** Duraklarda vapur hep oradadır. Her kibar geçişte ilişki bir basamak ilerler: el sallama → mendil → çay bardağı kaldırma → Kanlıca'da güverteden yoğurt uzatma. Kötü geçişte bir basamak geriler. Final durağında Rumeli Feneri iskelesinde ya bekleyen Nermin Hanım vardır ya da boş bank.
- **Neden yaratıcı:** Amcanın en komik özelliğini (gaz) bir **karar baskısına** çeviriyor. Bunun için yeni bir kontrol gerekmiyor. Bence en özgün fikir bu.
- **Amcayla bağı:** Emekli amcanın gizli romantizmi, Yeşilçam'daki "geç kalmış aşk" klişesinin sevimli hâli.
- **İlk oyunda:** İlk büyük gaz bulutunda burnunu kapatan kadın, bir saniyede anlaşılır.
- **Tekrarda:** İlişki basamağı koşudan koşuya **kalıcı** olabilir: Nermin Hanım seni hatırlar.
- **Kural:** Yok.
- **Görsel:** Vapur mevcut. Güvertedeki Nermin Hanım'ın 3 jesti (sallama, burun kapama, yoğurt): 2–3 çağrı. **Boy: M**

### 6. Teyzenin tenceresi: teslimat görevi
**Kanca:** Harem'deki cumbadan teyze amcanın eline bir tencere dolma tutuşturur, "Kanlıca'daki kardeşime" der gibi Boğaz'ı işaret eder, oyuncu da tencereyi 8 durak boyunca dökmeden taşır.
- **Oynanış:** Amca tencereyle zıplar. Tam isabet inişte tencere sağlam kalır, kıl payı inişte bir dolma uçar ve kedilerden biri kapar. Geçilen her kulede kalan dolma sayısı tencerenin üstünde dolma ikonlarıyla görünür. Kanlıca'ya varınca kardeş teyze kaç dolma geldiğine bakar: 10 dolmada sarılır, 2 dolmada boş tencereyi amcanın kafasına geçirir (amca bir durak boyunca kafasında tencereyle zıplar).
- **Neden yaratıcı:** Paperboy ya da Crazy Taxi'nin teslimat yapısını mahalle komşuluğuna taşıyor. "Kırılgan yük" bilinen bir kalıp. Ama 12 duraklık güzergâh ve kediler onu bu oyuna özgü kılıyor.
- **Amcayla bağı:** Komşuya hayır diyemeyen amca.
- **İlk oyunda:** Tencere ve dolma sayısı açıkça görünüyor. Dolma uçunca sebebi anlaşılır.
- **Tekrarda:** Yük ve alıcı değişir: kavanoz turşu (Beykoz'a), kafeste muhabbet kuşu, düğün baklavası.
- **Kural:** Yok. [KURAL] seçeneği: teslim edilen dolma başına bonus puan.
- **Görsel:** Tencereli kol pozu 1 çağrı, kafada tencere 1 çağrı, dolma kodla. **Boy: M**

### 7. Canlı yayın: haber ekibi peşine takılır
**Kanca:** Beylerbeyi'nde merdiveniyle bir kameraman ve mikrofonlu bir muhabir "Boğaz'da uçan adam" haberi için amcanın peşine takılır ve oyuncu yayın sürdükçe seriyi bozmamaya çalışır.
- **Oynanış:** Ekranın köşesinde kırmızı "CANLI" ışığı yanar. Her iniş yayına girer: tam isabette muhabir arkadan alkışlar, kıl payı inişte kamera titrer. Seri ne kadar sürerse ekip o kadar perişan olur: muhabirin saçı dağılır, kameraman merdiveni sürükler. Beş tam isabetlik seri "yayından" bir kare kazandırır. Bu kare sonuç kartpostalına ayrıca basılır.
- **Neden yaratıcı:** Seri sayacını bir anlatıya giydiriyor. Yayın kesilince muhabir yorgunluktan yere oturur. Dürüst olmak gerekirse orta derecede klişe ("haber ekibi" Gırgır'ın klasik malzemesi).
- **Amcayla bağı:** Kameraya el sallamadan duramayan amca: inişte poz verir.
- **İlk oyunda:** "CANLI" ışığı ve ekibin varlığı yeter, metin gerekmez.
- **Tekrarda:** Kanallar değişir (sabah programı, hava durumu sunucusu yağmurda şemsiyesiyle).
- **Kural:** Yok.
- **Görsel:** Muhabir ve kameraman 2 poz: 2 çağrı. **Boy: M**

### 8. Elektrik kesintisi: mahalle mumla yol gösterir
**Kanca:** Ortaköy'de gece çöker çökmez semtin elektriği kesilir ve oyuncu, cumbalarda yanan mumların ve kendi parlayan gaz izinin ışığında zıplar.
- **Oynanış:** Bir durak boyunca kuleler koyulaşır ve yalnız silüetleri görünür. Pencerede mum yakan teyzeler hangi çatıların sağlam olduğunu aydınlatır. Amcanın gaz izi gecede hafifçe fosforlu parlar ve geçtiği yerde bir sonraki çatının kenarını bir an aydınlatır. Durak sonunda ışıklar geri gelir ve mahalleden toplu bir "oh" yükselir (bütün pencereler aynı anda yanar).
- **Neden yaratıcı:** Planlı kesinti İstanbul'da çok tanıdık bir gerçek. Mahallenin amcaya **yardım ettiği** bir an oluyor, olaylar hep ona karşı değil. Görüş zorluğu biraz klişe ama gazın ışık olması bu oyuna özgü.
- **Amcayla bağı:** Pijamalı amca, elinde fener, karanlıkta.
- **İlk oyunda:** Karanlık ve mumlar kendiliğinden anlatıyor.
- **Tekrarda:** Kesinti başka bir gece durağında olabilir. Bazen yalnız yarım mahalle karanlık kalır.
- **Kural:** Fizik aynı. Ama görünürlük fiilen zorluğu artırıyor, bu yüzden kısa tutulmalı ve ilk koşuda yaşanmamalı.
- **Görsel:** Kodla karartma ve maske, mum ışığı kodla, mum tutan teyze 1 çağrı. **Boy: S–M**

### 9. VAHŞİ KART: Mahalle battaniyesi, düşünce bitmez [KURAL]
**Kanca:** Amca düştüğünde, koşu boyunca etkilediği komşular aşağıda bir halıyı itfaiye filesi gibi gerer ve onu bir kez geri fırlatır.
- **Oynanış:** Cumbalı kulelere yapılan her tam isabet "mahalle itibarı" kazandırır (cumbadaki teyze başını sallar, ekranın köşesinde küçük bir halı simgesi dolar). Doluysa ilk düşüşte dört teyze ve bir kedi halıyı gerer, amca sekip bir önceki kuleye geri konar, halı da boşalır. Doymamışsa halı yarım gerilir ve amca halıyla birlikte düşer (komik, ama oyun biter).
- **Neden "bu olmaz" denir:** "Düşünce baştan" kuralını delip bir ikinci şans tanıyor. **Neden işe yarar:** Komşulara yapılan tam isabetlere oyunsal bir değer kazandırıyor. Sakin sistemi süs olmaktan çıkıp oynanışın merkezine geçiyor. Hikâyesi de sıcak: "Mahalle sahip çıkar."
- **Görsel:** Halı geren teyzeler 1–2 çağrı (mevcut halı silken teyzenin devamı). **Boy: M–L**

### 10. VAHŞİ KART: "Bu adam nereye gidiyor?", koşulara yayılan gizem
**Kanca:** Amcanın neden Kadıköy'den Karadeniz'e zıpladığı hiç söylenmez ve oyuncu her yeni uzak durakta bir ipucu açarak koşudan koşuya hikâyeyi çözer.
- **Oynanış:** İlk kez ulaşılan her durakta çatıda bir nesne bulunur: boş bir kedi tasması (Harem), "KAYIP: Pamuk" ilanı (Üsküdar), duvarda bir fotoğraf, bir mama izi… Amca nesneye iner, bir an bakar, cebine koyar. Ana hikâye kayıp kedisi Pamuk'un izini sürmesi. Final durağı Rumeli Feneri'nde Pamuk deniz fenerinin tepesinde yavrularıyla oturur. Bu, oyunun büyük finali.
- **Neden "bu olmaz" denir:** Sonsuz koşu oyununa bir dizi gibi anlatı ekliyor. **Neden işe yarar:** Hades'teki gibi, her ölüm hikâyeyi bir adım ilerletir. "Bir durak daha" isteğini puan değil merak besler. Mevcut kedi defteri sistemiyle de doğal biçimde birleşir. Hiçbir oynanış kuralı değişmiyor, ilerleme yalnız kayıt.
- **Görsel:** 12 ipucu nesnesi (çoğu kodla ya da küçük, 4–6 çağrı) ve final sahnesi 1–2 çağrı. **Boy: L**

---

## En iyi 3'üm
1. **Nermin Hanım (5).** Amcanın gazını "tutsam mı, salsam mı" ikilemine çeviriyor. Yeni bir kontrol yok, kural değişmiyor, 12 durağa yayılan bir aşk hikâyesi de var. Oyunun kendi mizahından doğuyor, başka bir oyundan alınmadı.
2. **Tek terlik (2).** Kıl payı inişin şimdi yalnız bir sallanmadan ibaret sonucu, karakterli ve süren bir şakaya dönüşüyor. Duraktaki inişe de kendi amacını veriyor. Küçük bir iş, ama büyük bir kimlik kazandırıyor.
3. **"Bu adam nereye gidiyor?" (10).** Uzun vadede oyunu tutacak olan bu. Kedi defteri ve durak altyapısı zaten var. Yalnız görsel ve kayıt işi, puan kuralına dokunmuyor.

(Düğün konvoyu (3) ritim katmanı yüzünden çok yakın bir dördüncü. Mahalle battaniyesi (9) kullanıcı "düşünce baştan" kuralını gevşetmeye açıksa birinci olur.)

## İlham ve kaynaklar
- Mario Kart zaman denemesi hayaleti (fikir 1). Hades'te ölümün hikâyeyi ilerletmesi, https://en.wikipedia.org/wiki/Hades_(video_game) (fikir 10). Paperboy ve Crazy Taxi'nin teslimat yapısı, https://en.wikipedia.org/wiki/Paperboy_(video_game) (fikir 6). Rhythm Heaven'ın tek tuşla ritim mantığı (fikir 3).
- Yeşilçam'da geç kalmış aşk ve mahalle dayanışması ("Bizim Aile", "Hababam Sınıfı" tipleri), Gırgır ve Uykusuz'un "muhabir ve sokak röportajı" karikatürleri (fikir 5, 7, 9).
- İstanbul gerçekleri: kornalı düğün konvoyları ve davul-zurna. Planlı elektrik kesintileri. Kanlıca yoğurdu, https://en.wikipedia.org/wiki/Kanl%C4%B1ca. Vapurda çay ve güverteden el sallama. Rumeli Feneri'nin güzergâhın sonu olması (stops.ts FINAL_STOP).

**Kıvılcım çağrı özeti (her biri ayrı onay):** Önerdiğim ilk 3 fikir için en az 2 (Nermin jestleri) + 1 (tek terlik) + 0 (gizem prototipi kodla) = **3 çağrı** ile prototip çıkar. Fikirlerin hepsi için toplam ≈ 20–25 çağrı.
