# Editör görüşü (oyuncu deneyimi) — ilk 5 dakika, ilk hafta, 1. ay

Kaynak: `brief.md`, `app/index.tsx` (yalnız okundu), `FIKIR-PUAN-2026-11-20/RAPOR.md`. Yüzdeler ve süreler **tahmin**dir.

Koddan gördüğüm üç şey:
- Öğretici tek satırlık bir yazıdan ibaret ("Basılı tut… bırak, zıpla!"). Bu yazı ilk 3 koşudan sonra kendiliğinden kayboluyor (`runsDone < 3`). `FAZ1_UI` kapalıysa yazı İngilizce çıkıyor.
- İniş yazısı hâlâ "PERFECT!" (`index.tsx:1041, 1991`).
- Ayarlar ekranı yok, yalnız ses düğmesi var. Bildirim, dil desteği, Dynamic Type ve "hareketi azalt" desteği de yok.

## 1. Dört oyuncu

**14 yaşında öğrenci.** İlk 5 dakikada hemen kapar, osuruk gazına güler, amcanın patlaması onun için ödül gibidir. İlk durak 15. kulede ve ilk 3–5 koşuda oraya varamayabilir (tahmin). Bırakma noktası şu: ilk 5 dakikada hiçbir şey açılmazsa "hep aynı". İlk hafta Meydan oku'yu sınıf arkadaşına atar. Okulda arkadaşı yanındayken tek telefonda sırayla oynamak ister, bu mod yok. 1. ayda kedi defterini ve kartpostalları bitirir ya da takılır. Sonra yeni bir şey göremezse bırakır.

**35 yaşında İstanbullu çalışan.** Oyunu vapurda ve metroda, sesi kapalı oynar. Gerçek hava ve semt adları onu en çok bağlayan şey ("bugün gerçekten lodos var"). Oturumu 3–4 dakika (tahmin). "Bir daha" demesinin sebebi bir sonraki durağa ne kadar kaldığını bilmek, ama oyun sonu kartı bunu söylemiyor. Ertesi gün geri gelmesi için bir sebep gerekiyor. Günün haritası var ama menüde bağırmıyor. Gelmediği gün oyun onu hatırlatmıyor.

**Gurbetçi.** İlk 5 dakikada nostalji vurur: Kadıköy, vapur, simit rengi. En güçlü bağ İstanbul'un gerçek havası ("Berlin'de yağmur, İstanbul'da güneş"). Oyun bunu bildirimle ona hiç taşımıyor. İlk haftada Türkiye'deki ailesiyle oynamak ister. Bunun için WhatsApp'a tek dokunuşla giden bir meydan okuma bağlantısı en değerli araç olur. Saat dilimi önemli: menüdeki saat ve gece İstanbul'a göre mi gösteriliyor, cihaza göre mi, net olmalı.

**Yabancı turist.** İlk 5 dakikada "Basılı tut" yazısını okuyamaz. "Kod gir", "Meydan oku", "Kartpostal" düğmelerini de anlamaz. Kontrolü dokunarak bulur ama amca patladığında nedenini anlamaz ve ilk 2 dakikada bırakır (tahmin, en riskli kişi bu). Gezdiği semti oyunda görmek onu çok sevindirir. Bunun anlaşılması için kartpostalın arkasında iki dilde tek bir cümle yeter.

**Ortak tablo:** El hissi ve dünya iyi. Zayıf yerler üç: ilk başarı geç geliyor, oyun sonu kartı bir sonraki hedefi göstermiyor, oyunun dışında geri çağıran hiçbir şey yok. 1. ayın sonunda 24 koleksiyon parçası bitiyor ve ardından yeni bir hedef yok.

## 2. Öncelikli öneriler

**1. İlk kartpostal ilk koşuda**
- Sorun: İlk başarı geç geliyor.
- Uygulama: Oyunun ilk açılışında Kadıköy kartpostalı kalkışta verilsin ("Kadıköy'den yola çıktın · 1/12"). 4. kulede de bir kez "Beşiktaş'a 11 kule" hatırlatması çıksın. Fizik ve kule dizilimi değişmez.
- Efor: Yalnız kod, 0 görsel.
- Ölçüm: Testçi geri bildiriminde "ne yapacağımı anladım" diyenler; ilk gündeki oturum sayısı.

**2. Hataya göre öğretici**
- Sorun: Amca patladığında ya da kule kısa kaldığında oyuncu nedenini anlamıyor.
- Uygulama: İlk 5 koşuda, düşüşün türüne göre tek satır yazılsın: "Fazla bastın, kısa bas", "Biraz daha tut". Aynı hata tekrar etmezse yazı çıkmaz. Öğretici yazı sayaçla değil, oyuncunun ilk 3 iyi inişinden sonra kalksın.
- Efor: Kod, 0 görsel.
- Ölçüm: İlk koşulardaki patlama oranı; ilk 10 dakikada uygulamayı bırakan testçiler.

**3. "PERFECT!" Türkçeleşsin**
- Not: Bu öneri 20 Kasım raporunda zaten vardı ve hâlâ uygulanmadı. İngilizcesi dil desteği gelince seçilir.
- Efor: Kod.
- Ölçüm: Yok, mağaza öncesi temizlik işi.

**4. Oyun sonu kartında "bir sonraki durak" çubuğu**
- Sorun: "Bir daha" demek için oyuncunun önünde somut bir hedef yok.
- Uygulama: Kartta "Ortaköy'e 4 kule kaldı" yazsın ve yanında 15 kulelik ince bir çubuk dursun. Rekora 1–3 puan kaldıysa "Rekora 2" yazsın.
- Efor: Kod, 0 görsel.
- Ölçüm: Oturum başına koşu sayısı (cihazdaki sayaç); "Bir daha"ya basma oranı.

**5. Durak pulları (her durakta 3 pul)**
- Sorun: 1. ayın sonunda koleksiyonlar bitiyor.
- Uygulama: Her durakta üç hedef olsun: o durağa vardın / seriyle vardın / o semtin kedisini buldun. 12 durakta toplam 36 hedef çıkar. Hedefler mevcut içerikten üretilir, kolaylık satılmaz.
- Efor: Kod ve 1 pul görseli. Üç hâl renk ve damga yazısıyla ayrılır.
- Ölçüm: 2. ve 4. haftada hâlâ oynayan testçi sayısı; albümün açılma sıklığı.

**6. Günün haritasını menünün ana kapısı yapmak + haftalık pul kartı**
- Sorun: Ertesi gün geri gelmek için bir sebep yok.
- Uygulama: Menüde "Bugünün haritası · rekorun yok" diye büyük bir satır olsun. Haftalık 7 kutulu bir kart, oynanan günü damgalasın. Kaçırılan gün cezalandırılmasın, kart bozulmasın: ödül "bu hafta 5 gün"ün kendisi olsun.
- Efor: Kod ve 1 kart görseli (menüdeki kartpostal dilinde).
- Ölçüm: D1 ve D7 geri dönüşü. TestFlight'ta testçi başına oturum günleri; ayrıca cihazda gün sayacı.

**7. Baskısız, havaya bağlı bildirim**
- Sorun: Oyun, oyuncunun dışında hiç var olmuyor. Gurbetçi ve çalışan için en güçlü kanca bu.
- Uygulama: expo-notifications ile yalnız yerel bildirim. İzin ilk günde istenmesin. Bir rekordan sonra "İstanbul'da kar yağınca haber vereyim mi?" diye sorulsun. Bildirim günde en fazla 1, haftada en fazla 3 olsun. Yalnız gerçekten olağandışı bir şey varsa gitsin: kar, lodos, dolunay ya da özel gün. Örnek: "İstanbul'da lodos var, amca şemsiyeyi aldı." Suçlayan dil kullanılmasın ("Seni özledik" gibi).
- Efor: Kod, 0 görsel.
- Ölçüm: İzni kabul edenlerin oranı; bildirim gelen günlerde açılış.

**8. Tek telefonda sırayla oynama**
- Sorun: Okulda, ailede, kahvede yan yana oynanamıyor.
- Uygulama: 2–4 oyuncu adını yazar. Herkes aynı günün haritasında birer can oynar, en sonda kısa bir puan tablosu çıkar. Mevcut harita tohumu kullanılır.
- Efor: Kod, 0 görsel.
- Ölçüm: Bu modun kaç kez açıldığı; testçilerin "kiminle oynadın" yanıtları.

**9. WhatsApp'a meydan okuma bağlantısı**
- Sorun: Harita kodu sürtünme yaratıyor.
- Uygulama: Paylaşım metninde kodun yanında, oyunu doğrudan o haritada açan bir bağlantı olsun. Uygulama yüklü değilse bağlantı TestFlight'a ya da mağazaya gitsin.
- Efor: Kod (deep link), 0 görsel.
- Ölçüm: Gelen meydan okumaların sayısı; yeni testçilerin nereden geldiği.

**10. Ayarlar paneli (erişilebilirlik)**
- Sorun: Sessiz, tek elle ve hareketsiz oynayan oyuncular için düzen yok.
- Uygulama:
  - Titreşim aç/kapa. Ses kapalıyken titreşim şarjın ritmini taşısın.
  - Hareketi azalt: kamera sarsıntısı, parçacık ve bulut izi kısılsın. iOS ayarı varsayılan alınsın.
  - Büyük yazı: menü ve kartlar Dynamic Type'a uysun.
  - Renk körlüğü: hedef parıltısı ve şarj göstergesi renge değil biçime ve parlaklığa dayansın, kırmızı-yeşil zıtlığı olmasın.
  - Solak ve tek el: ses ve çıkış düğmeleri sola ya da sağa alınabilsin; menüdeki ana düğmeler başparmağın uzandığı alt yarıda olsun.
  - Osuruk sesi ayrı kapatılabilsin. Metroda en çok utandıran ses bu.
- Efor: Kod, 1 dişli simgesi (SF Symbol, görsel gerekmez).
- Ölçüm: Hangi ayarın kaç testçide değiştirildiği; sessiz oynayanların oturum süresi.

**11. İngilizce (ve dil seçimi)**
- Sorun: Turist ve yurt dışında doğan ikinci kuşak oyunu anlamıyor.
- Uygulama: `copy.ts` zaten metinleri tek yerde toplamaya başlamış. Bu yapı TR/EN tabloya çevrilsin ve dil expo-localization ile otomatik seçilsin. "Amca", "çay", "cumba" gibi kelimeler İngilizcede de kalsın, kimliğin parçası bunlar. Kartpostalın arkasına iki dilde tek cümlelik bir semt bilgisi eklensin. Hanım arıyor ve lakap şakaları birebir çevrilmesin, İngilizce için ayrı kısa şakalar yazılsın.
- Efor: Orta. Kod ve metin işi; 0 görsel, ama İngilizce mağaza ekran görüntüleri ayrıca gerekir.
- Ölçüm: İngilizce cihazlı testçilerin ilk gün kalma süresi.

**12. Son duraktan sonra ne olacak?**
- Sorun: Rumeli Feneri'ne varan oyuncunun önünde yeni bir ufuk yok.
- Uygulama: Varınca kısa bir "Sefer tamam" anı gelsin, ardından "2. sefer" etiketiyle devam edilsin. 2. seferde semtler tersten ya da gece sırasıyla gelsin, kartpostalların üstüne "2. sefer" damgası basılsın. Fizik değişmez.
- Efor: Kod ve 1 damga görseli.
- Ölçüm: 180. kuleyi geçen testçi sayısı (az olacak, tahmin). Yine de ustalaşan oyuncuyu tutar.

## 3. Sıra önerim

Önce **1, 2, 4**: ilk 5 dakika, yalnız kod, birkaç günlük iş (tahmin). Ardından **6, 7**: ertesi gün geri dönüş. Sonra **10**: mağaza öncesi zorunlu sayılır. Ardından **8, 9, 5**; **11**'i App Store'a çıkmadan önce bitirmek gerekir.

Ölçüm notu: TestFlight testçi başına yükleme, oturum ve çökme gösteriyor, ama koşu sayısını göstermiyor. Uygulamaya yalnız cihazda tutulan, dışarı gönderilmeyen küçük bir sayaç eklenmeli: koşu sayısı, ilk duraka varış süresi, patlama oranı, oynanan gün sayısı. Testçiden de bu ekranın görüntüsü istenmeli. Bu ölçüm kişisel veri toplamadan yapılır.
