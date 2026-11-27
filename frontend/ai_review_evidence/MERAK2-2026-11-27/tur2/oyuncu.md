# MERAK2 / Tur 2 — Oyuncu deneyimi ve paylaşım editörü

## 1. Birleşik tasarım: "MARTI KAPTI" (martının bıraktığı yer)
Tek cümleyle: Havadaki simidi kapan amcayı bir martı kapıp götürür ve onu Boğaz'da gerçekten başka bir parkura bırakır. Amca orada aynı parmak hareketiyle, söylene söylene zıplamaya devam eder. Her seferinde martının nereye bırakacağı merak konusudur.

### Oyuncu an an ne yaşar
- **İlk koşu, ~15–25. sn (4. kule civarı, yalnız ilk oturumda garantili).** Bu an, tek kez açıp bırakan testçinin hiç görmediği andır. Kurukafanın durduğu yükseklikte havada bir **simit** süzülür (anlati-1). Amca simide değer, aynı anda bir martı dalar. Amca simidi bırakmaz, martı da onu simitle birlikte havaya kaldırır. Amcanın bacakları sallanır, balonda "Bırak simidimi!" yazar. Geçiş 1,5 sn sürer, dokunuşla atlanabilir (anlati-1 riski).
  Işınlanmanın İstanbul'da yaşayan bir sebebi vardır. Portal yoktur, perde yoktur (anlati ilkesi).
- **Varış: Dev Gemi.** Martı amcayı Boğaz'dan geçen dev bir konteyner gemisinin üstüne bırakır. Kıyı gerçekten kaybolur, ekranda yalnız su, gövde ve ters yöne kayan uzak kıyı vardır (oyuncu-1 ve anlati-1).
  Zıplanan yerler kırmızı, mavi ve turuncu konteyner yığınlarıdır. Hepsi kuleden geniş ve basıktır, dümen köşkü en yüksek atlayıştır. Amca tek satırla söylenir: "Ben bu yaşta konteynere mi binecektim?" (anlati-7)
- **8 iniş (~25 sn) sonra pruva.** Gemi düdük çalar, martı geri gelir ve amcayı ayrıldığı yerden bir sonraki kıyı kulesine bırakır.
  Kule sayacı kaldığı yerden devam eder. Bölüm iki durak arasına sığar (teknik-A6).
- **Dönüşte bir "an kartı" çıkar.** Kartta amca konteynerin üstündedir, altında "Kadıköy → bir martı → bir gemi" yazar. Hemen yanında **"Martının bıraktığı yerler 1/5"** albümü durur, öteki dört kare silüet ve "?" olarak görünür (oyuncu ve anlati-6).
- **Sonraki koşular.** Simit koşu başına en fazla 1 kez ve rastgele çıkar (~25–40 kulede bir). Kurukafa sürerken çıkmaz.
  Martının bıraktığı yer **değişir** (anlati-6 ruleti): Gemi, **Sarnıç** (oyun-1), **Köprü trafiği tavanları** (anlati-3), **Balıkçı kayıkları** (oyun-2) ve en sonda **Martı sürüsünün sırtı** (anlati-2). Günün haritası günün bırakma yerini gösterebilir: "Bugün martı Sarnıç'a bırakıyor."
- **Özel bölümde düşersen:** Ceza olmaz. "Şıp" sesi gelir, ıslak amca kıyıda belirir, koşu sürer ama kart verilmez. Böylece oyuncu cesur zıplar. Ana parkurun "düşersen baştan" kuralı ise korunur.

### Neden farklı hisseder
Her yerin zemini de, elden istediği de farklıdır. Gemide ölçek şoku yaşanır: geniş ve basık kutular, rahat ve keyifli bir ritim. Sarnıçta alçak tavan vardır, "az bas" diye öğretir. Bu el hissini gerçekten değiştiren tek fikir. Kayıklar zamanlama ister. Martı sırtı komik ve oynaktır. Yani bu bir kaplama değişimi değil, her yer ayrı bir küçük oyundur.

### Merak ve paylaşma nereden gelir
1. Martının amcayı kaptığı an, ilk saniyede "şuna bak" dedirtir.
2. Albümdeki "?" kareleri "senin martın seni nereye bıraktı?" sorusunu doğurur. Bu, sosyal bir sorudur.
3. An kartı bir olay anlatır, manzara anlatmaz.
4. Aynı tohum aynı simidi verir, yani meydan okumada iki arkadaş aynı yere gider (teknik-A6).

### Kontrol nasıl aynı kalır
Basılı tut, bırak, yay ve iniş hiçbir yerde değişmez. Konteyner, sütun ve araç tavanı da kule gibi `{x,width,topY}` yüzeyleridir (teknik-A2). Taşınma anında kontrol yalnız 1,5 sn elden alınır ve dokunuşla geçilebilir.

### Çekirdeğe nerede dokunur (kullanıcı onayı gereken yerler)
- **Işınlanma:** `initWorld` bloğu `teleportTo(yüzey, tür)` olarak ayrılır (teknik-A1). Skor ve hava durumu sıfırlanmaz. Bu yapısal bir dokunuş, fizik değişmez.
- **Üretim:** Her yer için bir profil (genişlik, yükseklik ve boşluk aralığı) gerekir. Simit yerleşimi ayrı bir karma ile seçilir ve `rngState` akışına dokunmaz (teknik-A6).
- **Puan:** Gemide ×2 puan olsun mu, olmasın mı? Hayalet ve rekor adaleti açısından bunu kullanıcı seçmeli. Benim önerim ilk sürümde ×2 OLMASIN.
- **Sonraki aşamalar:** Sarnıç yeni bir tavan kuralı getirir (oyun-1). Kayıklar ve martı sürüsü hareketli yüzey ister, bu da A3 deseni ve A7 düzeltmesi (`p` etkin listeden okunur) demektir. **Bu ikisi ilk sürüme girmez.**

### En küçük deneme (1 TestFlight sürümü)
1. Yalnız Gemi. Simit yalnız ilk koşuda 4. kuleden sonra, ardından ~%5 olasılıkla çıkar. Hareketli yüzey yok, tavan yok, ×2 yok.
2. `teleportTo` ile kıyıdan gerçek kopuş. Gemi profili 8 yığından oluşur, arka planda gövde ve ters kayan kıyı paralaksı vardır.
3. Martının taşıması basit bir tween olur: amca ve martı sprite'ı birlikte uçar, dokunuşla atlanır. Amca bir satır söyler, dönüşte kart çıkar ve kartta "1/?" yazar. Albüm henüz yok.
4. Kıvılcım'dan 4 görsel gerekir: konteyner seti, gövde ve pruva, martı taşıma pozu, simit. Her çağrı ayrı onayla yapılır.
5. Ölçüm (6 arkadaş): Kendiliğinden "martı" ya da "gemi" diye anlatan oldu mu? Kart paylaşıldı mı? Tek kez açan arkadaş ikinci kez açtı mı? "Başka yere de bırakıyor mu?" diye soran oldu mu? Bu son soru gelirse ikinci yer olarak Sarnıç eklenir ve albüm açılır.

## 2. Oy (kendi fikirlerim hariç)
- anlati — Simit Martısı → Dev Gemi — **3** — Işınlanmaya şehirden bir sebep ve gülünç bir an veriyor. Benim gemimde eksik olan "şuna bak" saniyesi buydu.
- oyun — Sarnıç — **2** — Aynı parmak hareketine farklı bir el hissi ("az bas") veren tek fikir bu, yasak yönden en uzak olanı da.
- oyun — Boğaz'ın dibi (düşüş kapı olur) — **1** — Ölmeyi beklerken başka yerde uyanmak en büyük şaşkınlık. Rekor kuralına dokunduğu için şimdilik sonraya kalsın.

## 3. Veto / uyarı
**Hareketli hedefi ilk deneyime koymak.** kivilcim-1, arda-3, ada-3, oyun-2 ve teknik-1'de hareketli hedef var. Oyuncunun ışınlanmayı ilk gördüğü anda hedef kayarsa düşer. Düşen oyuncu "harika bir yere gittim" demez, "haksız düştüm" der. Merak anı hayal kırıklığına döner.
Üstüne REVIZYON-060 donma riski ve A7 kayma hatası gelir. İlk ışınlanma **sabit ve cömert** yüzeylerde olmalı, hareket ancak 3. ya da 4. bırakma yerinde gelmeli.
