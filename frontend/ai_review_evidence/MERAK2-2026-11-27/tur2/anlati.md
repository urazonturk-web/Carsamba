# MERAK2 · Tur 2 · Anlatı ve Dünya editörü

## 1. Birleşik tasarım: "MARTI KAPTI!"
Tek cümle: Havadaki simidi kapan amcayı bir martı simitle birlikte kaldırıyor ve İstanbul'un o gün nerede kaosu varsa oraya bırakıyor. Amca orada söylene söylene, bambaşka bir zeminde zıplamaya devam ediyor.

Kimden ne aldım:
- **Tetik ve sebep:** anlatı (simit ve martı). Işınlanmanın sebebi büyü değil, her İstanbullunun tanıdığı martı kavgası.
- **İlk yer, Dev Gemi:** oyuncu (Dev Gemi, konteyner yığınları, ölçek şoku) ve anlatı (pruvada son zıplamayla vapura geçiş).
- **İlk 30 saniye kancası:** oyuncu. İlk koşuda garantili, sonra seyrek.
- **Zıplamanın içindeyken yer değişmesi:** oyuncu. Perde yok, amca yeni yerde iniş yayının ortasında beliriyor.
- **Işınlanma motoru:** teknik (`initWorld`, `teleportTo` olarak ayrılıyor). Skor ve kule kimliği devam ediyor. Ayrı karma kullanıldığı için meydan okuma ve hayalet bozulmuyor.
- **"Gördüğün yerler" albümü ve paylaşılan "an kartı":** oyuncu. Kartpostal değil, olay anlatıyor.
- **İkinci yer, Sarnıç:** oyun. Martı bu kez bir sarnıç kapağına bırakıyor, tavanlı ve kısa basışlı bir parkur başlıyor. El hissini gerçekten değiştiren tek fikir bu.
- **Daha sonraki yerler:** köprü trafiği tavanları (anlatı) ve vapur ile şamandıra zamanlaması (teknik, oyun). Hareketli yüzeyler bu aşamada giriyor.
- **Ses ve karakter:** anlatı. Her yerde amcanın tek satırlık huysuz tepkisi.

### Oyuncu an an ne yaşıyor
1. **İlk koşu, 3–5. kule (yaklaşık 20. saniye):** Havada bir simit dönüyor. Amca simidi kapıyor, bir martı çığlıkla dalıyor ve amca simidi bırakmıyor. Martı ikisini birden kaldırıyor (1,5 sn, dokunarak geçilebilir). Balon: "Bırak simidimi!"
2. **Bırakılış:** Martı amcayı Boğaz'dan geçen bir konteyner gemisinin üstüne bırakıyor. Amca zıplamanın ortasında, kırmızı bir konteynerin üstüne iniyor. Gövde ve su çizgisi görünüyor, kıyı arkada ters yöne kayıyor. Balon: "Ben bu yaşta konteynere mi binecektim?"
3. **Gemide 8 iniş:** Kutuların yükseklikleri farklı, dümen köşkü en yüksek nokta. Suya düşmek ölüm değil: amca "şıp" diye düşüp ıslak saçla ana parkurda beliriyor (ödülün yarısı kalıyor). Bu kısım kullanıcı onayı ister, bkz. Çekirdek.
4. **Dönüş:** Pruvada gemi düdük çalıyor ve son zıplama yandan geçen vapurun üst güvertesine yapılıyor. Vapur kıyıya yanaşıyor, amca ayrıldığı kulenin birkaç kule ilerisine iniyor.
5. **Kart ve albüm:** "Kadıköy → bir gemi → Kuzguncuk" yazan an kartı çıkıyor. Albümde "1/5" yazıyor, öteki dört kare silüet ve "?" olarak duruyor.
6. **Sonraki koşular:** Simit seyrek çıkıyor (koşu başına en fazla 1 kez, iki durak arasında). Martının bıraktığı yer günün tohumundan seçiliyor, günün haritası bir ipucu veriyor: "Bugün martılar Adalar tarafında."

### Neden farklı hissettiriyor
Değişen şey arka plan değil, **zemin**, **ölçek** ve (Sarnıç'ta) **elin ritmi**. Oyuncu çatı oyunundan bir anda gemi oyununa, oradan yer altı oyununa geçiyor ve her birinin kendi sesi, kendi tehlikesi var.

### Merak ve paylaşma nereden geliyor
- Görüntü tek başına anlaşılıyor: "Martı amcayı kaptı!"
- Yarı görünür bir boşluk var: albümdeki "?" kareleri "Senin martın seni nereye bıraktı?" sorusunu doğuruyor.
- Yer günün tohumundan geldiği için aynı gün aynı yeri gören arkadaşlar bunu konuşabiliyor.
- Amcanın tek satırları ekran görüntüsünün altyazısı oluyor.

### Kontrol nasıl aynı kalıyor
Basılı tut, bırak, yay, iniş hiç değişmiyor. Fizik formülleri (`jump.ts`) de aynı. Gemi yüzeyleri ilk sürümde sabit duruyor. Sarnıç'ta yalnız tavan ekleniyor, kuvvet değişmiyor.

### Çekirdeğe nerede dokunuyor (kullanıcı onayı gereken yerler)
- (a) `teleportTo`: dünya değişiyor, skor ve kule kimliği devam ediyor. Bölüm iki durak arasına sığmalı.
- (b) Kule üretiminde "gemi profili": kaplama ile genişlik ve yükseklik aralığı.
- (c) Cezasız düşüş: "düşersen baştan" kuralının bu bölümlerdeki istisnası. Kimliği etkilediği için ayrıca onaylanmalı.
- (d) Sonraki aşamalarda: Sarnıç tavanı, hareketli yüzeyler (teknik A3/A7/A8: `landList` düzeltmesi ve `amp ≤ pay/2` kuralı).

### En küçük deneme (1 TestFlight sürümü, `MARTI_TEST` bayrağıyla)
1. Tek yer (gemi), tek tetik: simit ilk koşuda 4. kulede, sonra %5 olasılıkla.
2. Martı ile amcanın 1,5 sn'lik taşınma tween'i, sonra `teleportTo` ile gemi profilinde 8 sabit kutu ve son kule olarak vapur güvertesi.
3. Cezasız düşüşü ilk denemede açmıyoruz. Önce düşünce normal sonuç kartı gelsin; onay gelirse açarız.
4. Kıvılcım ile 4 çağrı, her biri onaylı: konteyner seti, gövde ve su çizgisi, vapur güvertesi, martı taşıma pozu.
5. Amcanın 2 satırı TASLAK havuzunda (`copy.ts`).
6. Ölçüm (6 arkadaş): Kendiliğinden "martı" ya da "gemi" diyen oldu mu? "Bir daha nasıl çıkar?" diye soran oldu mu? Tek kez açan arkadaş tekrar açtı mı? "Arka plan değişti" denirse gövde görünmüyor demektir; önce görseli güçlendiririz.
7. Geçerse sırasıyla: albüm, Sarnıç (ikinci yer), köprü trafiği ve hareketli vapurlar.

## 2. Oylar (kendi fikirlerim hariç)
- oyuncu — Dev Gemi + İlk 30 Saniye Kancası — **3** — Ölçek şokunu, ilk koşuda garantili tetiği ve albüm merakını tek pakette veriyor ve tek kez açıp bırakan oyuncuyu doğrudan hedefliyor.
- oyun — Sarnıç (tavanlı yer altı) — **2** — Aynı kontrolle elin ritmini (kısa, ölçülü basış) gerçekten değiştiren tek fikir ve dönüşte bir durak ilerletmesiyle gerçek bir ödülü var.
- teknik — Deniz Seferi (vapur, şamandıra, `teleportTo`) — **1** — Işınlanmanın bu motorda ucuz olduğunu kodla gösterdi; hareketli hedefin güvenli yolunu (`amp ≤ pay/2`, `landList`) da tarif etti.

## 3. Veto / uyarı: tek en büyük tehlike
**Gerçek İstanbul'dan kopup fantastik dekora kaymak.** Görünmez mahalle, dev saat kadranı, hayalî su tünelleri, kendi kendini kuran köprü gibi fikirler oyunun en güçlü kozunu, yani herkesin tanıdığı bugünkü İstanbul'u bırakıyor. Bunların sonu "güzel bir masal sahnesi", yani yine bir kaplama olur, ve kullanıcının reddettiği yöne geri döneriz. Kural önerim: her ışınlanma yerinin bir İstanbullunun "evet, bunu gördüm" diyeceği gerçek bir şey olması (gemi, vapur, köprü trafiği, sarnıç, balıkçı kayığı). Gerçeküstü olan yalnız **oraya nasıl gidildiği** olsun, yani martı.
İkinci uyarı: Hareketli yüzeyleri ilk denemeye koymayalım. Haksız düşüş, merak testini daha başlamadan bozar.
