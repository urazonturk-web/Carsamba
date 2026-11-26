# YARATICI-OLAY-2026-11-26 — Mekanik editörü: tek fiilin yeni anlamları

Rol: zıplamanın kendisini (basılı tut → çömel/kızar/gaz biriktir → bırak → yay çizip in) duraklarda yeni anlamlara sokmak. Kalıp yasak: "bir şey gelir, dokunup kovarsın". Kod okundu (jump.ts, landing.ts, stops.ts, kurukafa.ts, yaris.ts, app/index.tsx'te OVERCHARGE / FART_TRIAL / SPLAT); hiçbir dosya değiştirilmedi.

**İlke:** Downwell'de silah botun içindedir, zıplamak ateş etmektir. Alto'da iniş yeri hızı belirler. Tiny Wings'te bırakmak hız kazanmaktır. Bizde de **yeni bir düğme ya da hedef değil, zaten yaptığın hareketin başka bir şey de yapması** gerekiyor. Elimizdeki dört "ses":
**(a) şarj süresi** (0–0,45 sn + 0,5 sn "son an" penceresi), **(b) gaz** (şarjla büyüyen iz), **(c) iniş kalitesi** (kenar/sallanma ↔ tam isabet), **(d) atlanan kule sayısı** (1 ya da 2+). Fizik formülü ve kamera hiçbir fikirde değişmiyor; değişen yalnız bu dört sesin *ne anlama geldiği*.

---

## 1. Kızaran yüz fener — Rumeli Feneri / gece sisi
**Kanca:** Sisli gecede tek ışık amcanın kızaran suratıdır; oyuncu ne kadar uzun basarsa o kadar ileriyi görür, ama o kadar uzağa da fırlar.
- **Oynanış:** Durak sonrası 5 kule karanlık sise gömülür (yalnız pencere ışıkları gibi silik noktalar). Basılı tutunca amcanın yüzü kızarır ve çevresine kırmızımsı ışık halkası yayılır; halkanın yarıçapı şarjla büyür. Kısa bas: yalnız yakın çatı görünür. Uzun bas: uzaktakiler de görünür ama artık güç yüksek. Oyuncu "bakmak" için şarj edip **bırakmadan önce hafifçe geri çekemez** (fizik aynı), yani bilgi ile güç arasında gerçek bir takas var.
- **Neden yaratıcı:** Şarj ilk kez ikinci bir anlam taşıyor: **güç = görüş**. Limbo/Inside'ın ışık oyunu, ama tek fiilin içinde. Klişe değil.
- **Amca bağı:** "Kızarmış" yüzü (zaten çizilmiş ChargePoses) mizahi bir fener olur. Lafı: "Gözüm görmüyor, yüzüm görüyor."
- **İlk oyunda:** Sis iner, amca çömelir, ışık açılır; ilk 1 sn'de anlaşılır. İlk iki kule genişlerden seçilir.
- **Tekrarda:** Sis yoğunluğu gerçek havaya bağlanır (istanbul.ts'te "sis" türü var); gerçek sisli günde her durakta görülebilir.
- **Kural:** Yok (yalnız görünürlük). Zorluk artar; ilk sürümde yalnız geniş/orta kuleler.
- **Görsel:** Kodla (karartma maskesi + radyal ışık). Kıvılcım 0. **Boy: S–M.**

## 2. Akıntı Burnu kayığı — gaz yakıt olur (Arnavutköy)
**Kanca:** Aşağıda akıntıya karşı kürek çeken balıkçı kayığı amcanın gazıyla ilerler; oyuncu her zıplamada hem çatıya inmeye hem kayığa yeterince gaz vermeye çalışır.
- **Oynanış:** Arnavutköy'den sonraki 6 kule boyunca altta Akıntı Burnu'nda bir kayık (gerçek gelenek: kayıklar burnu halatla çekilerek dönerdi). Her kalkışın gazı aşağı süzülür, kayığın yelkenini/kıçını iter; gaz miktarı = şarj. Kayık 6 kulenin sonunda burnu dönerse balıkçı amcaya hamsi fırlatır (görsel ödül). "Tam kıvam" (son an penceresi) en büyük gazdır, "dayanamadı" kayığı fazla iter, balıkçı suya düşer (komik).
- **Neden yaratıcı:** Gaz şimdiye dek yalnız *sonuç* (iz, ses); burada **kaynak**. Kısa güvenli zıplamalar kayığı bırakır; uzun zıplamalar riskli. Oyuncu kendi kendine "2 kule atlayayım, gaz bol olur" stratejisi kurar.
- **Amca bağı:** Utanç verici özelliği mahalleye hizmet olur. Balıkçı: "Ağabey, bir daha fasulye ye öyle gel!"
- **İlk oyunda:** Kayık belirir, ilk gaz bulutu kayığa çarpınca kayık hızlanır ve küçük bir "fırr" sesi; ok/ölçü gerekmez.
- **Tekrarda:** Lodos günü akıntı güçlü (gerçek rüzgâr verisi), kayık daha çok gaz ister.
- **Kural:** Yok (ödül görsel). İsteğe bağlı [KURAL]: başarıda +3 puan.
- **Görsel:** Kayık + balıkçı 2 poz (Kıvılcım 1 çağrı, sayfa), gaz bulutu mevcut. **Boy: M.**

## 3. Köprü sazı — atış yüksekliği nota olur (Boğaziçi Köprüsü)
**Kanca:** Köprünün askı halatları saz teli gibidir; amcanın yayı hangi halatı keserse o nota çalar ve oyuncu farkında olmadan türkü çalar.
- **Oynanış:** Köprü kulelerinde (bridgeAt) arka planda çapraz askı halatları. Uçuş yayının halat çizgisini kestiği an o halat titreşir ve bir nota çalar. Yüksek atış = üst halatlar = ince ses; alçak atış = kalın ses. Ekranın üstünde 5 notalık kısa bir motif yazılı değil, **teyze ıslıkla önceden çalar**; oyuncu aynı yükseklikteki atışlarla tekrar ederse köprünün ışıkları renk renk yanar (Boğaziçi Köprüsü'nün gerçek renkli LED aydınlatması).
- **Neden yaratıcı:** Şarj süresi **perde** olur. Rhythm Heaven / Sound Shapes'teki "hareket müzik yapar" ama burada müzik bir *sonuç*, zorlama değil: yanlış nota da güzel sesler (pentatonik), kimse cezalanmaz. Klişe değil.
- **Amca bağı:** Kahvehanede saz çalan amca; inince "Gençken düğünlerde çalardım."
- **İlk oyunda:** İlk halat kesilince ses + halat titreşimi; ikincide oyuncu ilişkiyi kurar. Motif yalnız 3 nota.
- **Tekrarda:** Her köprü ayrı motif (FSM, Yavuz Sultan Selim); motifler ezberlenip "köprüyü çalmak" koleksiyonu.
- **Kural:** Yok. **Görsel:** Halatlar kodla (çizgi + titreşim), ses 5–7 kısa nota. Kıvılcım 0. **Boy: M.**

## 4. Doğru dam — inilecek yer değişir (Kuzguncuk)
**Kanca:** Torun topu damlara kaçırmıştır, teyze "Kırmızı damda!" diye bağırır; oyuncu sıradaki çatıya değil, **topun olduğu çatıya** inmek için bir kuleyi atlamayı seçer.
- **Oynanış:** Durak sonrası 3 kez: önündeki iki kuleden birinin üstünde top. Top yakındaysa normal zıpla; uzaktaysa 2 kule atlamalı uzun atış. Topa inince amca topu ayağıyla aşağı, torunun kucağına yollar. Yanlış çatıya inmek ceza değil, top bir sonraki çatıya sekiyor ("Bıraktın gitti!").
- **Neden yaratıcı:** Şimdiye dek hedef hep "bir sonraki kule"; burada **hedefi oyun seçer**, var olan çoklu-kule ödülünü (scoreMultiTowerBonus) bir hikâyeye bağlar. Desert Golfing'in "tek hedef, tek atış" netliği.
- **Amca bağı:** Mahalle dedesi; "Ben senin yaşındayken top damdan inmezdi, dam bize inerdi."
- **İlk oyunda:** Top büyük ve parlak, iki kule de geniş; teyzenin balonlu cümlesi okutmaya gerek bırakmaz.
- **Tekrarda:** Top bazen kedi olur (mevcut kedi çizimi), bazen çamaşır mandalı; 3 kule ötesi "efsane atış".
- **Kural:** [KURAL] kule üretimi: top senaryosunda iki kulenin de güvenli olması (geniş) gerekir. Puan aynı.
- **Görsel:** Top kodla; torun 1 poz (Kıvılcım 1). **Boy: S.**

## 5. Çay tepsisi — iniş kalitesi yük olur (Harem → Üsküdar)
**Kanca:** Harem'deki çaycı amcanın eline beş bardaklı tepsi tutuşturur; oyuncu Üsküdar'daki kahveye kadar çay dökmeden inmeye çalışır.
- **Oynanış:** Tepsi 15 kule boyunca amcanın elinde. Kenar inişi (sallanma) bir bardağı devirir; tam isabet bardağı geri doldurmaz ama "şıkırtı" sesiyle güven verir; büyük şarj bardakları uçuşta havalandırır (yalnız görsel, inince yerine oturur ya da oturmaz). Üsküdar'da kaç bardak kaldıysa o kadar amca kahvede el kaldırır.
- **Neden yaratıcı:** Puanı zaten etkileyen iniş kalitesi **elle tutulur bir sonuca** dönüşür; 15 kule boyunca hikâye taşınır. "Death Stranding" yük dengesi, ama yeni düğme yok. Orta derecede klişe (taşıma görevi), ama tek fiile çok temiz oturuyor.
- **Amca bağı:** Çay, mahalle ve "çay ısmarla" (CayKart) temasıyla doğrudan bağ; satış ekranına baskı yapmadan sıcak bir köprü.
- **İlk oyunda:** Tepsi elde belirir, ilk kenar inişinde bardak döner: anında anlaşılır.
- **Tekrarda:** Tepsi yerine simit sepeti (Kanlıca'da yoğurt kâsesi, kar günü sahlep).
- **Kural:** Yok. İsteğe bağlı [KURAL]: kalan bardak sayısı kadar puan.
- **Görsel:** Tepsili amca pozları: şarj + uçuş + iniş setinin tepsi üst katmanı (ayrı katman çizilirse pozları yeniden çizmeye gerek yok). Kıvılcım 1–2. **Boy: M.**

## 6. Halay başı — zıplamaların kopyalanır (Ortaköy gecesi)
**Kanca:** Ortaköy'de damda düğün vardır; amca halay başı olur, oyuncunun her zıplamasını arkasından bir mahalleli aynen tekrarlar ve çizgi uzar.
- **Oynanış:** Durak sonrası her inişte arkadaki kuleye bir dansçı katılır ve amcanın **bir önceki zıplamasını aynı şarjla** tekrarlar (yaris.ts'teki hayalet kayıt biçimi hazır: kule + oran). Kenara inersen arkandaki dansçı da sallanır; tam isabet yaparsan bütün dizi mendil sallar. Dansçılar düşmez, yalnız sendeler (amca düşmez kuralı onlara da).
- **Neden yaratıcı:** Oyuncu kendi zıplama geçmişini **canlı bir kuyruk** olarak görür (Snake + Lemmings + hayalet). Kendi ritmini fark etmeyi öğretir. Klişe değil.
- **Amca bağı:** Düğünlerin vazgeçilmez halay başı amca; pijamalı gece düğünü ayrıca komik.
- **İlk oyunda:** Davul-zurna başlar, ilk dansçı belirir, amcanın son hareketini yapar: 1 zıplamada anlaşılır.
- **Tekrarda:** Kuyruk 8'e çıkınca davul hızlanır; hızlı (kısa bekleyişli) oynayana zurna çalar.
- **Kural:** Yok. **Görsel:** 3 mahalleli siluet + mendil (Kıvılcım 1, renk değişimiyle çoğaltılır). **Boy: M.**

## 7. Vapur güvertesi — iniş yeri yüzer (Üsküdar iskelesi) — yarı vahşi kart
**Kanca:** İskele durağından sonra iki "kule" vapurun üst güvertesidir; vapur Boğaz'da yavaşça ilerlediği için oyuncu yalnız uzaklığı değil **zamanı** da bekler.
- **Oynanış:** Vapur sabit hızda sağa kayar (yalnız platformun x'i zamana bağlı). Basılı tutarken vapur yaklaşıyor/uzaklaşıyor: erken bırakırsan gerisine, geç bırakırsan önüne. Güvertedeyken vapur amcayı taşır, sonra ileriki iskeleye zıplanır. Martılar güvertede simit bekler (sahne dekoru, dokunma yok).
- **Neden yaratıcı:** Frogger'ın kütüğü; oyunda ilk kez **hareketli iniş yüzeyi**. "Ne kadar basayım" sorusuna "ne zaman bırakayım" eklenir; şarj penceresi ile vapur temposu çakışır.
- **Amca bağı:** "Vapura yetiştin" duraklarının (stops.ts) gerçek hâli; amca yıllardır vapura koşarak yetişen adam.
- **İlk oyunda:** Vapur düdük çalar, yanaşırken güverte geniş; ilk deneme neredeyse sabit.
- **Tekrarda:** Sisli günde vapur yavaş, lodosta dalgalı (görsel sallantı, platform yüksekliği sabit).
- **Kural:** [KURAL] kule üretimi + çarpışma girdisi: landing.ts formülü aynı kalır ama platform.x her karede güncellenir. Fizik yasağına dokunmaz, ama "çarpışma değişmez" sınırına yakın; teknik editörün onayı ister.
- **Görsel:** Vapur yandan, güverte üstü düz (mevcut uzak vapur yetmez). Kıvılcım 1–2. **Boy: L.**

## 8. Hisar topu — patlamak doğru cevaptır (Rumeli Hisarı) — VAHŞİ KART
**Kanca:** Rumeli Hisarı'nda bir kez, normalde ceza olan "dayanamadı" patlaması tek çözümdür: amca bir top güllesi gibi surdan surun üstüne fırlatılır.
- **Oynanış:** Durak kulesinden sonra en uzak erişilebilir boşluk (tam güç ile varılan) gelir; burcun üstünde eski bir top durur. Oyuncu "son an" penceresini bilerek **kaçırırsa**, patlama o durakta "TOP ATEŞİ!" olur: kahverengi leke yerine barut dumanı, sur üstünde sancak sallanır. Tam kıvam bırakmak da yeter ama ödülü "top ateşi" kadar şatafatlı değil.
- **Neden yaratıcı:** Oyuncuya şimdiye kadar "yapma" denen şey bir yerde **istenen** şey olur; Baba Is You'nun "kural tersine döner" anı, ama tek fiille. İlk duyuşta "patlamayı ödüllendirmek mi?" dedirtir; ama tam olarak bu yüzden akılda kalır.
- **Amca bağı:** "Ben de bu surları dört ayda yaptım sanki." Lekelenme yok, bıyık islenir.
- **İlk oyunda:** Topun yanındaki asker silueti amcaya göz kırpar, burç üstüne "Bekle…" levhası. İlk seferde çoğu oyuncu normal bırakır, ikinci seferde dener: keşif hissi.
- **Tekrarda:** Bir kez keşfedilince sırrın paylaşılması (ShareCard satırı: "Rumeli Hisarı'ndan top gibi atıldım").
- **Kural:** [KURAL] kule üretimi (tam erişim boşluğu) + patlama sonucunun o durakta farklı yazılması (puan aynı ya da +2). Fizik aynı: patlama zaten jumpVelocity(1).
- **Görsel:** Top + barut dumanı kodla; isli bıyıklı amca 1 poz (Kıvılcım 1). **Boy: S.**

## 9. Kayıp terlik — ölüm yeri kalıcıdır — VAHŞİ KART
**Kanca:** Amca düştüğü yerde terliğini kaybeder; sonraki koşuda o kulenin üstünde bir çamaşır ipinde terliği asılıdır ve oyuncu "kendi mezarına" geri döner.
- **Oynanış:** Düşüşte kule kimliği kaydedilir (tohumdan bağımsız: kule numarası). Sonraki koşuda o numaralı kuleye iki komşu çatı arasına gerilmiş ipte terlik asılı; yay oradan geçerse amca uçarken terliği kapar (Kurukafa'nın toplama testi hazır). Terliği alırsan amca çift terlikli; almazsan teki çıplak ayak (görsel, her inişte "ayh!" sesi). Birden çok düşüş = ipte birikmiş terlik sırası.
- **Neden yaratıcı:** Desert Golfing'in kalıcılığı + Dark Souls'un kan lekesi: **başarısızlık haritaya yazılır** ve bir sonraki koşunun hedefi olur. "Düşünce baştan" kuralı zalimliğini kaybeder, intikam hissi kazanır. Kullanıcının "tekrara düşmesin" isteğine doğrudan cevap: her koşu bir öncekinin izini taşır.
- **Amca bağı:** Terlik amcanın kimliği. Teyzeden: "Terliğin bizim ipte, gel al!"
- **İlk oyunda:** İlk ölümden sonraki ilk koşuda ilgili kuleden 2 kule önce teyze bağırır; tek cümle yeter.
- **Tekrarda:** Arkadaşın (yarış hayaleti) terliği de asılı olabilir: asenkron sosyal iz.
- **Kural:** Yok (toplama Kurukafa gibi; etkisi görsel). İsteğe bağlı [KURAL]: 5 terlik toplayan "terlik dükkânı" rozeti.
- **Görsel:** İp + terlik kodla ya da terlik tek görsel (Kıvılcım 1); çıplak ayak katmanı 1. **Boy: S–M.**

## 10. Karşı yakadaki kuzen — tek dokunuş, iki amca — VAHŞİ KART
**Kanca:** Köprü üstünde karşı yakada amcanın kuzeni aynı anda zıplar; oyuncunun tek basışı **iki amcayı birden** fırlatır ve ikisinin kuleleri biraz farklıdır.
- **Oynanış:** Köprü kulelerinde uzak planda (arka katman, küçük, paralaks) ikinci amca kendi kulelerinde. Aynı şarj ikisine birden gider. Kuzenin kuleleri ile seninkiler arasında küçük farklar var: bazen ikisi de aynı şarjla tutar, bazen "kimi kurtaracağım" seçimi. Kuzen düşerse suya "cup" eder, köprünün öbür ucunda ıslak bekler (oyun bitmez). İkisi de inerse köprü ortasında el sıkışırlar.
- **Neden yaratıcı:** Duet / Dual! / Brothers'ın "bir girdi, iki beden" fikri; tek tuşlu oyunda gerçekten yeni bir karar katmanı. İlk duyuşta "kafa karıştırır" denir; ama kuzenin sonucu cezasız olduğu için yalnız merak ve gülümseme getirir.
- **Amca bağı:** Anadolu-Avrupa yakası rekabeti; "Bizim yaka daha güzel" atışması.
- **İlk oyunda:** Kuzen el sallar, ilk ortak zıplamada iki gaz izi aynı anda; kuzen geniş kulelerde başlar.
- **Tekrarda:** Kuzenin kuleleri tohumdan türetilir, her köprüde farklı uyum derecesi.
- **Kural:** [KURAL] ikinci kule dizisi üretimi (yalnız arka katman, puanı etkilemez). Ana fizik/kamera aynı; ikinci amca aynı jumpVelocity ile ama kendi uzayında.
- **Görsel:** Mevcut amca pozları küçük ve renk farkıyla (ör. lacivert eşofman); Kıvılcım 0–1. **Boy: L.**

---

## Elenenler (dürüstçe)
- **Şemsiye paraşüt / lodos itişi:** yayı değiştirmek fizik yasağına girer; yalnız görsel olunca anlamsız.
- **Çamaşır ipinde sekme:** çarpışma değişikliği.
- **Ritimde bırak (davul vuruşu):** One Finger Death Punch'tan kopya; üstelik şarj süresi zaten mesafeyi belirliyor, ikinci kısıt haksız olur. Halay (6) bu ritim isteğini cezasız biçimde karşılıyor.

## Kendi en iyi 3'üm
1. **Kızaran yüz fener (1):** Şarjın ikinci anlamı (güç = görüş) en temiz "tek fiili yeniden anlamlandırma"; sıfır yeni çizim, kural değişmiyor, gerçek sisli havaya bağlanıyor. S–M.
2. **Kayıp terlik (9, vahşi):** Oyunun en sert kuralını (düşünce baştan) duygusal bir kancaya çeviriyor, her koşuyu öncekine bağlıyor, Kurukafa'nın toplama koduyla küçük iş. Kullanıcının "tekrara düşmesin" isteğine en doğrudan cevap.
3. **Akıntı Burnu kayığı (2):** Gaz ilk kez kaynak oluyor; oyuncuya "uzun zıpla ama düşme" stratejisi veriyor, amcanın en komik özelliğini kahramanlığa çeviriyor.
Yedek: **Hisar topu (8)** — en kısa iş (S), en güçlü "aaa!" anı; [KURAL] onayı gelirse ilk sırada olabilir.

**Toplam Kıvılcım (hepsi yapılırsa):** ~10–13 çağrı. En iyi 3 için: 0 + 1 + 1 = **2 çağrı** (her biri ayrı onay).

## İlham kaynakları
Downwell (Moppin, 2015: zıplama = ateş), Alto's Adventure (iniş açısı = hız), Tiny Wings (bırakma = kazanç), Desert Golfing (kalıcı, tek atış), Dark Souls (ölüm lekesi), Baba Is You (kural tersine döner), Duet / Dual! (bir girdi iki beden), Frogger (hareketli zemin), Limbo / Inside (ışıkla bilgi), Rhythm Heaven ve Sound Shapes (hareket müzik olur). İstanbul gerçekleri: Arnavutköy Akıntı Burnu'nda kayıkların halatla çekilmesi, Boğaziçi Köprüsü'nün renkli LED aydınlatması, Rumeli Hisarı topları ve "dört ayda" yapılış hikâyesi, Ortaköy düğünleri, Boğaz sisinde vapur düdükleri, damlar arası çamaşır ipleri.
