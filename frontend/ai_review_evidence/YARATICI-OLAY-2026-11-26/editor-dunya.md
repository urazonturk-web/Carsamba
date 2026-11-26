# Editör: Dünya ve sistem tasarımı — YARATICI-OLAY-2026-11-26

**Bakış açım:** tek seferlik "olay" yok. Oyuncunun yaptığı her şey dünyaya bir **iz** bırakır. İz, gerçek İstanbul'un kurallarıyla (rüzgâr, akıntı, saat, mevsim, vapur) yer değiştirir ve sonraki duraklarda ya da sonraki koşuda geri gelir. Martı örneğinden ruhunu aldım (sahnenin içinde, oyundan çıkmadan), biçimini almadım: hiçbir fikirde "bir şey gelir, dokunup kovarsın" yok. Bunların çoğunda dokunma da yok, çünkü oyuncunun tek fiili **zıplamak** ve dünya bu fiile cevap veriyor.

**Koddaki dayanaklar (yeni sistem kurmadan bağlanılabilir):** `istanbul.ts` (gerçek gün doğumu/batımı, ay evresi, hava türü + lodos/poyraz, sıcaklık), `WeatherLayer.tsx` (rüzgâr yönü, mevsim), `stops.ts` (12 durak, 3 köprü, gece durağı), `mahalle.ts` (adlı kediler, `KEDI_DEFTER_KEY` kalıcı defter, pencere karakterlerinin huyları), `postcards.ts` (kalıcı kayıt), `daily.ts` (günlük tohum, şimdilik kapalı), `karga.ts` (tüneyen/havalanan karga havuzu). Fizik, kamera ve çarpışmaya hiçbir fikir dokunmuyor.

---

## Sistem haritası (fikirler birbirini besliyor)
```
gerçek rüzgâr ──► gaz bulutu sürüklenir (1) ──► öndeki/arkadaki komşular tepki verir ──► söylenti (4)
gerçek akıntı + rüzgâr ──► düşen eşya sürüklenir (2) ──► sonraki koşuda başka durakta çıkar
gerçek saat ──► uyuyan mahalle, ışıklar (3) ──► söylenti (4);  son vapur (5)
gerçek takvim ──► göç sürüsü, lüfer, erguvan (6)
gerçek sis ──► fener ritmi (7)
senin inişlerin ──► kiremit, ışık, söylenti ──► dönüş seferinde hepsi orada (9)
```

---

## 1. Gaz bulutu rüzgârla sürüklenir
- **Kanca:** Amcanın bıraktığı gaz izi havada kalıcı bir bulut olur, **o günkü gerçek rüzgârla** sürüklenir. Oyuncu da sonraki kulelerde komşuların burnunu tuttuğunu, pencereleri kapattığını, kedilerin hapşırdığını görür.
- **Nasıl oynanır:** Oyuncu hiçbir ek şey yapmaz, zıplar. Uzun şarj daha büyük bulut bırakır. Lodosta (kuzeye) bulut **amcanın önüne** gider ve bir sonraki çatıdaki teyze, amca daha gelmeden mandalla burnunu kıstırmıştır. Poyrazda (güneye) bulut **geriye** gider ve az önce geçtiği kuledeki komşu amca arkasından "Be adam!" diye bağırır. Rüzgâr yoksa bulut yerinde yavaşça büyür, iki üç kule sonra solar.
- **Neden yaratıcı:** Oyunun kendi mekaniği (gaz) bir dünya nesnesine dönüşüyor. Aynı koşu lodoslu günde başka, poyrazlı günde başka. Klişe değil, bunu yapan bir oyun bilmiyorum. Fikir *Breath of the Wild*'daki rüzgârın ateşi ve dumanı taşımasından geliyor.
- **Amcayla bağı:** Utanmaz emekli mizahının tam kendisi. Dünyayı kirletiyor, dünya da ona söyleniyor.
- **İlk oyunda nasıl anlaşılır:** İlk uzun şarjda bulut bir an parlar ve küçük bir ok rüzgâr yönünü gösterir. İlk tepki, bir sonraki kuledeki komşunun burnunu tutması olur.
- **Tekrar oynayınca:** Her gün rüzgâr farklı olduğu için tepkiler de farklı. Oyuncu "bugün lodos var, önümdeki mahalle beni bekliyor" diye düşünmeye başlar.
- **Kural etkisi:** Yok.
- **Görsel:** Bulut kodla çizilir (mevcut gaz izinin yarı saydam hâli). Burnu tutan teyze, mevcut teyze görseline kodla bir mandal ekleyerek yapılabilir. Daha iyisi için 1 Kıvılcım pozu ("burnunu tutan teyze"). **0–1 görsel.**
- **Büyüklük:** S–M.

## 2. "Boğaz geri getirir" (akıntı postası)
- **Kanca:** Amca patlayıp Boğaz'a düşünce terliği ve kasketi suya düşer. **Boğaz'ın gerçek yüzey akıntısı** onları güneye taşır, oyuncu da sonraki koşuda Kadıköy iskelesinde bir çocuğun terliği ona uzattığını görür.
- **Nasıl oynanır:** Eşyanın nereye varacağını, düştüğü durak, o günün rüzgârı ve geçen süre belirler. Normalde yüzey akıntısı Karadeniz'den Marmara'ya, yani güneye akar ve eşya *daha önceki* bir durakta çıkar. Kuvvetli lodos yüzeyi tersine çevirebilir. O gün eşya *ilerideki* bir durakta karaya vurur ve oyuncu ona zıplayarak ulaşır (kuleye inince amca giyer). Eşyalar bir "kayıp eşya" defterine yazılır, kedi defteri gibi.
- **Neden yaratıcı:** Ölüm cezası bir hikâyeye ve koşular arası bir bağa dönüşür. Boğaz'ın iki katlı akıntısı İstanbullunun bildiği ama hiçbir oyunun kullanmadığı bir gerçek. Fikir *Spelunky* ve *Dark Souls*'taki "ölünce bıraktığın şey dünyada kalır" kalıbından geliyor.
- **Amcayla bağı:** "Terliğim nerede?" Terliksiz amca gülünç bir hedef olur. Bir sonraki koşuda tek terlikle, aksak yürüyen bir amca.
- **İlk oyunda nasıl anlaşılır:** İlk düşüşte sonuç kartında tek satır çıkar: "Terliğin akıntıya kapıldı… güneye gidiyor." Sonraki koşunun başında iskelede terlik görünür.
- **Tekrar oynayınca:** Farklı durak, farklı rüzgâr ve farklı eşyayla her seferinde başka bir yerde karaya vurur. Nadiren eşya bir martının ağzında ya da bir balıkçının oltasında çıkar.
- **Kural etkisi:** Görsel hâli kuralsız. Eşyayı geri almanın ödül vermesi istenirse [KURAL].
- **Görsel:** Yüzen terlik ve kasket kodla çizilebilir. Tek terlikli amca için mevcut pozlar uygun olmayabilir. Terliği uzatan çocuk için 1 görsel. **1–2 görsel.**
- **Büyüklük:** M.

## 3. "Uyandırmadan Karadeniz'e" (gece mahallesi, gerçek saat)
- **Kanca:** Gerçek saat geceyse (oyunda saat zaten hesaplanıyor) mahalle uyur. Amcanın her kenara, gürültülü inişi bir pencerenin ışığını yakar. Oyuncu da arkasında yanan ışıklardan oluşan bir "suçluluk izi" bırakır.
- **Nasıl oynanır:** Tam isabet sessizdir. Kenara iniş, kiremit takırtısı, bir ışık yanar. Patlama, bütün sokağın ışığı yanar ve köpekler havlar. Işıklar o koşu boyunca yanık kalır. Sonraki kulelerdeki komşular uykulu ve pijamalı çıkar, lafları da sertleşir ("Saat kaç biliyor musun?"). Gündüz bu sistem tersine döner: mahalle uyanık, kalabalık, çatılarda çamaşır ve çay var, ve iyi inişler alkış olarak öne doğru yayılır.
- **Neden yaratıcı:** Oyuncunun ustalığı ekranda bir "karanlık" olarak okunur. Puan değil, sessizlik. *Animal Crossing*'in gerçek saat bağı ve *Hitman*'in gürültü sistemi buluşuyor. "Gece oynamak başka" hissi oluşur.
- **Amcayla bağı:** Gece yarısı pijamayla çatıdan çatıya geçen, kimseyi uyandırmamaya çalışan amca. Kendiliğinden komik bir durum.
- **İlk oyunda nasıl anlaşılır:** İlk kenar inişinde tek pencere yanar ve teyze esner. Gece seferinin başında tek satır: "Mahalle uyuyor, sessiz ol."
- **Tekrar oynayınca:** Gerçek saate göre değişir. Saat 03'te sokak tamamen karanlıktır, 23'te yarısı uyanıktır. Hedef "hiç ışık yakmadan Ortaköy'den Bebek'e" gibi kendiliğinden doğar.
- **Kural etkisi:** Yok. "Sessiz durak" için bir rozet/kartpostal istenirse o da kuralsız.
- **Görsel:** Pencere ışığı kodla (mevcut cumba/pencere üstüne sarı dikdörtgen). Uykulu ve pijamalı teyze için 1 görsel. **0–1 görsel.**
- **Büyüklük:** M.

## 4. Söylenti amcadan hızlı gider (mahalle hafızası)
- **Kanca:** Bir duraktaki inişin haberi pencereden pencereye seslenerek **amcanın önünde** gider. Oyuncu, Kuzguncuk'ta kırdığı kiremidi Bebek'teki komşudan duyar.
- **Nasıl oynanır:** Her inişin sonucu (tam isabet, kenar, kıl payı) koşu içinde bir "söylenti" olarak kaydedilir. Sonraki pencerelerden gelen lafların bir kısmı bu söylentiden seçilir ("Harem'de üç tane tam ortaya basmışsın, duyduk!"). Görsel olarak ileriki pencerelerde baş baş uzanıp kısa bir laf zinciri oluşur. Koşular arasında da her pencere karakterinin (teyze, komşu amca, çocuk) bir yakınlık değeri tutulur. Çatısına çok tam isabet yaptığın teyze bir gün kenara bir çay bardağı koyar. Çok kiremit kırdığın komşu amca çatıya "Kiremit 20 lira" yazısı asar.
- **Neden yaratıcı:** *Hades*'te karakterlerin önceki koşuları hatırlaması gibi, ama bir mahalle ölçeğinde. Laflar mevcut huy sistemine (`pencereLafi`) bağlandığı için yazı dili tutarlı kalır. Klişe riski düşük, ama metin üretimi emek ister.
- **Amcayla bağı:** Mahalle dedikodusu İstanbul amcasının doğal ortamı. Amca hem kahraman hem dedikodu konusu.
- **İlk oyunda nasıl anlaşılır:** İkinci durakta ilk söylenti lafı çıkar ve önceki durağın adını taşır. Bu tek başına yeterli.
- **Tekrar oynayınca:** İlişkiler büyür ve yeni laflar, çatıda küçük eşyalar açılır.
- **Kural etkisi:** Yok.
- **Görsel:** İlk aşama yalnız metin ve mevcut pencereler. Sonra çatıdaki çay bardağı ve kiremit tabelası için 2 görsel. **0 → 2 görsel.**
- **Büyüklük:** M (metin) / L (ilişki sistemi).

## 5. Son vapur (vapur, tempo belirleyen rakip olur)
- **Kanca:** Koşu başlayınca Kadıköy'den bir vapur kalkar ve Boğaz'da sabit hızla kuzeye gider. Oyuncu vapurla yarışır, gerçek saat geceyse de "son vapuru kaçırdın" yalnızlığını yaşar.
- **Nasıl oynanır:** Vapur arka planda ilerler. Bir durağa ondan önce varırsan iskelede vapurun yolcuları sana el sallar. Geç kalırsan vapur düdük çalar ve güverteden "Amca yetişemedin!" diye gülerler. Hız, gerçek saate bağlıdır: iş saati vapurları kalabalık ve yavaştır, akşamları hızlıdır. Gerçek saat gece yarısından sonraysa vapur yoktur, iskele boştur ve tabelada "Sefer yok" yazar. Amca o gece ışıklı ve yalnız bir Boğaz'da gider (#3 ile birleşir). Lodosta vapur sallanır, sisli günde hiç kalkmaz.
- **Neden yaratıcı:** *Mini Motorways*'in şehir ritmi ve hayalet rakip aynı yerde. Rakip bir hayalet araba değil, şehrin kendi taşıtı. İstanbullu için "vapura yetişmek" bir duygu.
- **Amcayla bağı:** Amcanın hayatı boyunca kaçırdığı vapurlar. Bugün koşarak yetişiyor.
- **İlk oyunda nasıl anlaşılır:** Başta vapur düdüğü ve tek satır: "Vapur kalktı, yetiş bakalım!" Vapur zaten ekranda.
- **Tekrar oynayınca:** Gerçek saat ve havaya göre vapur değişir. Oyuncu kendine "vapuru Bebek'e kadar geçmek" gibi bir hedef koyar.
- **Kural etkisi:** Yok. Vapuru geçmenin puan vermesi istenirse [KURAL].
- **Görsel:** Vapur mevcut, kalabalık güverte kodla, "Sefer yok" tabelası 1 görsel ya da yazı. **0–1 görsel.**
- **Büyüklük:** M. Not: Gerçek vapur tarifesi kullanılmaz (önceki raporda da eleniyordu). Bu, gerçek saate göre davranan *temsili* bir tarife.

## 6. Göç ve mevsim takvimi (gerçek doğa takvimi)
- **Kanca:** Takvim eylül-ekim ya da mart-nisanı gösterdiğinde Boğaz'ın üstünde leylek ve yırtıcı kuş sürüleri **termallerde döner**. Oyuncu bir sürünün içinden geçerse kuşlar amcaya iki üç kule eşlik eder.
- **Nasıl oynanır:** Sürü belli kulelerin üstünde dönen bir halka olarak görünür. Amcanın yayı halkadan geçerse kuşlar aynı yöne süzülür ve amcanın yanında uçar (yalnız görsel, fizik değişmez). Aynı takvim mantığıyla sonbaharda Rumeli Hisarı ve Arnavutköy'de lüfer oltaları, kışın hamsi ve kestane dumanı, nisanda erguvanlı yamaçlar gelir. Her mevsimin kendine özgü bir "eşlikçisi" olur.
- **Neden yaratıcı:** Boğaz gerçekten Avrupa'nın en büyük göç geçitlerinden biri. Her sonbahar on binlerce leylek ve yırtıcı kuş Büyük Çamlıca üstünde termallerle yükseliyor. Bunu bilen az. *Pokémon GO*'nun "gerçek dünya bu hafta ne yapıyor" fikri, ama konum istemeden.
- **Amcayla bağı:** Emekli amcanın kuşlara karışması şiirsel bir an. Mizahı yanında: bir leylek amcanın kasketine konar.
- **İlk oyunda nasıl anlaşılır:** Sürü görülünce tek satır: "Leylekler güneye gidiyor." Eşlik ilk denemede kendiliğinden olur.
- **Tekrar oynayınca:** Mevsime göre değişir. Ocak ayında oynayan biri hiç göç görmez, eylülde gelince şaşırır.
- **Kural etkisi:** Yok. Termalin atışı uzatması fizik değişikliği olduğu için önerilmiyor.
- **Görsel:** Leylek (süzülme) 1, yırtıcı kuş silüeti kodla, lüfer oltası kodla. **1–2 görsel.**
- **Büyüklük:** M.

## 7. Sisli günde fener ritmi
- **Kanca:** İstanbul'da gerçekten sis varsa uzak kuleler silinir. Kız Kulesi'nin, Rumeli Feneri'nin ve ara iskele fenerlerinin ışığı belli aralıklarla Boğaz'ı tarar, oyuncu da ışık geçerken zıplamaya alışır.
- **Nasıl oynanır:** Sis zaten görsel olarak var ("sis bandı"). Buna dönen bir fener ışığı eklenir. Işık her iki üç saniyede bir hedef kuleyi aydınlatır, arada sis düdüğü çalar. Kuleler yerinden oynamaz, yalnız görünürlük dalgalanır. Oyuncu şarjı ışığın ritmine göre ayarlamayı kendiliğinden öğrenir.
- **Neden yaratıcı:** Gerçek hava, oyuna bir ritim katmanı ekliyor. Mesele dokunma değil, zamanlama. Boğaz'da sisli günlerde gemi trafiği durur ve sis düdükleri gerçekten öter.
- **Amcayla bağı:** Amca gözlerini kısar ("Gözlüğümü evde unuttum"). Fener ışığı ona düşünce yüzü parlar.
- **İlk oyunda nasıl anlaşılır:** Sis olduğu gün kendiliğinden belli olur. İlk satır: "Sis var, fenere bak."
- **Tekrar oynayınca:** Sis nadir ve gerçek, bu yüzden "sisli gün" bir olaya dönüşür.
- **Kural etkisi:** [KURAL — hafif] Fizik aynı, ama görünürlük zorluğu artırır. Kullanıcı onaylamazsa yakın kule her zaman net kalır, yalnız uzaklar ritimle görünür.
- **Görsel:** Işık konisi kodla. **0 görsel.**
- **Büyüklük:** S–M.

## 8. VAHŞİ KART — "Akıntı seni geri taşır" [KURAL]
- **Kanca:** Düşünce baştan başlamazsın. **Akıntı amcayı güneye sürükler** ve oyuncu, o günün gerçek akıntısı ve rüzgârının belirlediği bir durakta karaya çıkar.
- **Nasıl oynanır:** Düştüğün yerden sürüklenme miktarı o günün havasına göre değişir. Normal günde 2 durak geri gidersin. Poyrazda akıntı güçlenir ve 3–4 durak geri gidersin. Kuvvetli lodosta akıntı zayıflar ve yalnız 1 durak geri gidersin. Akıntının en hızlı olduğu Arnavutköy Akıntıburnu'nda düşmek en pahalısıdır. Skor yine sıfırlanır, yalnız *konum* korunur. Ya da ikisi de ayrı bir modda korunur.
- **Neden "bu olmaz" denir:** Oyunun "düşünce baştan" kuralını bozuyor. **Neden işe yarayabilir:** Bugün oyuncular 4. duraktan ilerisini nadiren görüyor (Bebek'i, Kanlıca'yı ve Rumeli Feneri'ni kimse görmüyor, oysa kartpostalları oralarda). Bu kural, gerçek dünyayı bir zorluk ayarına çeviriyor: "Bugün lodos var, bugün Karadeniz'e çıkma günü." Herkesin aynı gün konuşacağı bir şey olur.
- **Amcayla bağı:** Islak, söylenerek iskeleye tırmanan amca: "Bu Boğaz beni hep geri atar."
- **Kural etkisi:** [KURAL] Düşme cezası değişir. Liderlik tablosu için "baştan" modu ayrı tutulmalı.
- **Görsel:** Islak amca için 1, iskeleye tırmanma için 1. **2 görsel.**
- **Büyüklük:** M.

## 9. VAHŞİ KART — Dönüş seferi: aynı Boğaz, senin izlerinle [KURAL]
- **Kanca:** Rumeli Feneri'nden sonra "Gece seferi N" yerine amca **geri döner**: Karadeniz'den Kadıköy'e, şafağa doğru. Oyuncu da gidişte bıraktığı her şeyi orada bulur.
- **Nasıl oynanır:** Dünya aynı ama ters yönde. Gidişte kırdığın kiremitler çatlak durur, yaktığın ışıklar yanıktır (#3), gaz bulutunun kalıntısı bir mahallede asılı kalmıştır (#1), söylenti artık senden önce oradadır (#4). Kuleler gidişteki çatlak kenarlarıyla geri gelir, yani kenara indiğin çatıda kenar biraz eğiktir (görsel). Dönüşün sonunda gece biter, Kadıköy'de güneş doğar. Bu, oyunun gerçek finalidir.
- **Neden "bu olmaz" denir:** Kule üretimini ve kamerayı çevirmek gerekiyor gibi görünüyor. **Neden işe yarayabilir:** Kamera aynı yönde (sağa) akmaya devam eder, yalnız arka plan ve durak adları ters sırayla gelir. Fizik değişmez. Oyuncu kendi koşusunu bir dünya olarak görür. *Spelunky*'nin bir koşu içindeki kalıcılığı ve *Outer Wilds*'ın "aynı yer, yeni anlam" fikri.
- **Amcayla bağı:** "Eve dönüş." Pijamalı amcanın sabaha karşı çayına yetişmesi. Final duygusu hazır.
- **Kural etkisi:** [KURAL] Durak dizisi ve final değişir. Kule üretimi tohumdan aynı kalabilir.
- **Görsel:** Çatlak kiremit kodla. Şafakta Kadıköy final kartpostalı 1. **1 görsel.**
- **Büyüklük:** L.

## 10. VAHŞİ KART — Bugünün Boğazı: herkesin izleri
- **Kanca:** O gün oynayan bütün oyuncuların düştüğü yerler, suda küçük yüzen terlikler olarak görünür. Oyuncu da "Bugün Kız Kulesi'nde 312 amca suya düştü" diye kendini kalabalığın içinde bulur.
- **Nasıl oynanır:** Hiç dokunma yok. Suda yoğun terlik kümeleri o günün "zor kulesini" gösterir. Günlük tohum (`daily.ts`, kapalı) açılırsa herkes aynı haritayı oynar ve izler anlam kazanır. Akşamüstü Kız Kulesi önünde terlik adası oluşur.
- **Neden "bu olmaz" denir:** Sunucu gerekiyor, oysa oyunda şimdilik sunucu yok. **Neden işe yarayabilir:** *Dark Souls*'un kan lekeleri ve *Death Stranding*'in eşzamansız izleri tek oyunculu oyunu bir şehre çeviriyor. Paylaşılabilir bir an doğar.
- **Kural etkisi:** [KURAL] Günlük tohumun açılması gerekiyor. Gizlilik için yalnız durak ve kule numarası, kimlik yok.
- **Görsel:** Yüzen terlik #2 ile ortak. **0 ek görsel.**
- **Büyüklük:** L (sunucu, ya da Game Center/iCloud ile bir ara çözüm araştırılmalı).

---

## Kıvılcım görsel toplamı
Asgari yol (1 + 2 + 3 + 5, kodla en çok şey): **2–3 çağrı**. Bütün fikirler: **en çok ~11 çağrı** (her biri ayrı onay).

## Benim en iyi 3'üm
1. **#1 Gaz bulutu rüzgârla sürüklenir.** Oyunun tek mekaniğini bir dünya sistemine çeviriyor, gerçek havayı ilk kez *oynanır* kılıyor, kural değişikliği yok, neredeyse çizimsiz. "Bugün lodos var, önümdeki teyze burnunu tuttu" anı paylaşılır.
2. **#2 Boğaz geri getirir.** Düşüşü bir hikâyeye ve koşular arası bir bağa çeviriyor. Boğaz'ın gerçek akıntısını kullanıyor. #8'e (vahşi kart) doğal bir ilk adım: önce eşya sürüklenir, onaylanırsa amca da sürüklenir.
3. **#3 Uyandırmadan Karadeniz'e.** Gerçek saati bir oyun hedefine çeviriyor. Ustalık "sessizlik" olarak okunur. #4 (söylenti) ve #9 (dönüş seferi) bunun üstüne kurulur.

Bu üçü birlikte şu döngüyü kuruyor: **hava → senin izin → dünyanın tepkisi → sonraki durak/koşu.** Martı gibi tek seferlik olayları da bu döngünün içine koymak mümkün. Örneğin rüzgâr gaz bulutunu martıların üstüne sürüklerse martılar dağılır.

## Kaynaklar ve ilham
- Boğaz'ın iki katlı akıntısı (yüzeyde güneye, dipte kuzeye; ölçülen en yüksek yüzey hızı ~2,3 m/sn ≈ 4,5 knot): [Oceanography — The Bosporus Strait](https://tos.org/oceanography/article/the-bosporus-strait-a-special-place-in-the-history-ofoceanography), [İTÜ — Flow through the Bosphorus](https://research.itu.edu.tr/en/publications/flow-through-the-bosphorus/), [EGU21-369](https://meetingorganizer.copernicus.org/EGU21/EGU21-369.html).
- Boğaz göç geçidi (her bahar ve sonbahar 20 binden fazla leylek ve yırtıcı kuş, Büyük Çamlıca sayımları): [BirdLife — Bosphorus IBA](https://datazone.birdlife.org/site/factsheet/bosphorus-iba-türkiye), [İstanbul Üniv. — leylek sonbahar göçü](https://avesis.istanbul.edu.tr/yayin/53bdb74f-3d64-4cd8-ae9d-5cfb49b68da5/autumn-migration-of-the-white-stork-ciconia-ciconia-and-the-black-stork-c-nigra-over-the-bosphorus-aves-ciconiidae).
- Oyunlar: *Breath of the Wild* (rüzgârın ateşi ve dumanı taşıması), *Spelunky* ve *Dark Souls* (ölünce bırakılan izler), *Hades* (koşular arası ilişki), *Animal Crossing* (gerçek saat), *Pokémon GO* (gerçek dünya takvimi), *Mini Motorways* (şehir ritmi), *Death Stranding* (eşzamansız izler), *Outer Wilds* (aynı yer, yeni anlam), *Hitman* (gürültü sistemi).
- İstanbul gerçekleri: lodosta akıntının yüzeyde tersine dönmesi, lodosta vapur iptalleri, sisli günlerde Boğaz trafiğinin durması ve sis düdükleri, sonbaharda lüfer, kışın hamsi, nisanda erguvan.
- Dini öğe yok, Arapça ünlem yok. Oyun kodu değiştirilmedi.
