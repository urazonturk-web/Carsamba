# MERAK2 / Tur 1 — Oyuncu deneyimi ve paylaşım editörü

Ölçütlerim: (1) Telefonu arkadaşına uzatıp "şuna bak" der mi? (2) İlk 30 saniyede bir şey olur mu?
Bağlam: 6 testçi, 1 ile 122 arası oturum. Biri oyunu 1 kez açıp bıraktı. Ona ilk 30 saniyede hiçbir şey olmadı.
Yani şu anki kurukafa, durak ve hava olayları oyunu *uzun oynayana* ödül veriyor. İlk turda "ne oldu şimdi?" dedirten bir an yok.

## Türden aldığım dersler (kopya değil, ilke)
- Şaşırtan an kontrolü değiştirmez, **zemini** değiştirir. Aynı parmak hareketiyle bambaşka bir şeyin üstüne inmek beyinde "bunu da mı yapabiliyorum?" hissi yaratır.
- En çok paylaşılan anlar **ölçek değişimidir**: küçük karakter, kocaman bir şey (gemi, köprü). Ekran görüntüsünde bile anlaşılır.
- Gizli yer, **yarı görünür** olunca merak uyandırır. Hiç görünmüyorsa kimse aramaz, hep görünüyorsa sıradanlaşır. "?" ile işaretli boş bir albüm sayfası en ucuz merak motorudur.
- Özel bölüm **kısa** tutulur (20–30 sn). Uzarsa yeni normal olur, ana parkur sıkıcı gelmeye başlar.
- Özel bölümde düşmek **cezasız ya da az cezalı** olmalı. Oyuncu ödülü kaybetmekten korkarsa cesur zıplamaz, şaşırmaz da.

## Işınlanmanın oyuncu gözüyle kurgusu (bütün fikirlerin ortak iskeleti)
- **Tetik:** havada kurukafanın "kardeşi" duruyor. Yalnızca boyutu değil, rengi ve sesi de farklı: denize düşmüş bir **pusula** ya da **martı tüyü** (dini/Arapça çağrışım taşımaz). Amca değince ekran 0,3 sn beyaza çalar, bir martı çığlığı duyulur ve amca başka bir yerde, havada, iniş yayının tam ortasında belirir. Perde yok, yükleme yok. Oyuncu zıplamanın **içindeyken** yer değişiyor. Asıl şok bu.
- **Sıklık:** ilk oturumda **garantili tek seferlik**, 3. ile 5. kule arasında (yaklaşık 15–25. saniye). Bu, 30 saniye ölçütünün cevabı. Sonra koşu başına en fazla 1 kez, ~25–40 kulede bir ve rastgele. Kurukafa kuralı burada da geçerli: biri sürerken öteki çıkmaz.
- **Süre:** 6–10 iniş (~20–30 sn). Sonra "dönüş" anı gelir: geminin düdüğü, martıların dağılması gibi. Amca tekrar havada belirir ve ayrıldığı kulenin bir sonrakine iner.
- **Düşersen:** ölmezsin. Suya "şıp" diye düşersin, amca ıslak saçla ana parkurda belirir (pijama/şemsiye gibi ufak bir görsel iz). Toplanan ödülün yarısı kalır. Cesaret ödüllenir, ceza kırıcı olmaz.
- **Ödül (3 katman):**
  1. Anlık: özel bölümdeki her iniş ×2 puan sayılır, sayaç sarı yanar.
  2. Kalıcı: **"Gördüğün yerler" albümü**. Mekân başına bir kare var, görülmemişler silüet ve "?" olarak durur. Albüm, telefonu uzatmanın bahanesi olur: "bak, 5'te 2, sen hangisini buldun?"
  3. Paylaşım: dönüşte otomatik bir "an kartı" çıkar (mevcut ShareCard altyapısıyla). Kartta amca geminin konteynerinin üstünde, altında "Kadıköy → bir gemi → Arnavutköy" yazar. Kartpostal paylaşımının tersine bu kart *olay* anlatır, manzara anlatmaz.

## Fikirler

### 1. Dev Gemi (cüretkâr) — Boğaz'dan geçen konteyner gemisi
- **Yaşanan:** Amca pusulaya değiyor, bir anda bir gemideki dev konteyner yığınının üstüne düşüyor. Yığınlar kırmızı, mavi, turuncu, farklı yükseklikte. Arka planda kıyı yavaşça *ters yöne* kayıyor (gemi kuzeye gidiyor). 8 iniş sonra pruvaya varılıyor, gemi düdük çalıyor, amca kıyıya geri zıplıyor.
- **Neden farklı:** Zemin artık ev çatısı değil. Ölçek birden büyüyor (tek bir konteyner bir ev boyunda). Üstelik bir şeyin *üstünde gidiyorsun*.
- **Neden paylaşılır:** "Gemiye zıpladım" cümlesi tek başına yetiyor. Boğaz'daki gemiyi İstanbullu herkes tanır.
- **Kontrol:** Tamamen aynı. Konteyner yığını, kuleyle aynı mantıkta bir iniş yüzeyi. Oyuncuya göre durağanlar. Hareket eden yalnızca arka plan.
- **Çekirdek:** Hafif dokunuyor. Kule üretimine "kaplama + genişlik aralığı" profili eklenecek, fizik ve kamera değişmiyor. Puana ×2 eklenecek.
- **Maliyet:** Düşük-orta. 4 konteyner yüzü, gemi gövdesi ve pruvası, deniz ve kıyı arka planı için 4–6 Kıvılcım çağrısı. 1–2 gün kod.
- **Risk:** Görsel yarım kalırsa "kule boyamışlar" hissi verir. Gövde ve su çizgisi mutlaka görünmeli.

### 2. Martı Sürüsü (cüretkâr) — kuşların sırtında
- **Yaşanan:** Amca havada beliriyor, altında V düzeninde uçan martılar var. Her martı bir iniş noktası, hafifçe aşağı yukarı süzülüyorlar. Amca martıdan martıya zıplıyor, martı her inişte "kaak" deyip biraz alçalıyor. Son martı amcayı bir çatıya bırakıyor.
- **Neden farklı:** Hareketli hedef var. Zamanlama hissi değişiyor ama parmak hareketi aynı kalıyor.
- **Neden paylaşılır:** Komik ve absürt. Mevcut martı karakteri tanıdık, şimdi binek oluyor.
- **Kontrol:** Aynı. Ancak hedef dikeyde hareket ettiği için iniş anı hesaplanmalı.
- **Çekirdek:** **EVET.** İniş algılama (landing.ts) hareketli yüzey istiyor. Hedef küçük olacağı için iniş toleransı da değişmeli.
- **Maliyet:** Orta-yüksek. Martı sırtı animasyonu ve iniş tepkisi gerekiyor.
- **Risk:** Küçük ve oynak hedef ilk denemede düşürür, "hile" gibi gelebilir. Mutlaka cezasız olmalı.

### 3. Köprü Gecesi (cüretkâr) — asma köprünün halat kuleleri ve ışıklı kemeri
- **Yaşanan:** Gündüz koşarken birden gece oluyor. Amca köprünün dev kulesinin tepesinde, aşağıda araç ışıkları akıyor. Ana halat boyunca dizili ışık direklerinden zıplayarak köprünün öbür yakasına geçiyor. Kıtalar arası geçiş anında ekrana kısa bir yazı düşüyor.
- **Neden farklı:** Yükseklik hissi (aşağısı çok uzak) ve ani gündüz-gece geçişi.
- **Neden paylaşılır:** Köprü İstanbul'un en tanınan silüeti. "Köprünün üstünden yürüdüm" demek kolay.
- **Kontrol:** Aynı. Direkler kuleyle aynı türden yüzeyler.
- **Çekirdek:** Hayır, yalnızca üretim profili ve kaplama değişiyor. Kamera aynı kalıyor, arka plan değişiyor.
- **Maliyet:** Orta. Köprü kulesi, halat ve gece arka planı için 4–5 çağrı. Gece altyapısı zaten var.
- **Risk:** Duraklarda zaten üç köprü var. Fark yaratmazsa "zaten gördüm" denir. Bunu önlemek için *köprünün üstünde* olunmalı, köprü uzakta durmamalı.

### 4. Adalar Kaçamağı — çam tepeleri ve köşk çatıları, yavaş ritim
- **Yaşanan:** Amca birden Adalar'da, ağustos öğleden sonrası, ağustos böceği sesi. Zıpladığı yerler kırmızı kiremitli köşk çatıları ve geniş çam tepeleri. Yüzeyler daha geniş, aralar uzun. Bir bisikletli geçiyor, deniz pırıl pırıl.
- **Neden farklı:** Tempo ve ses değişiyor. Gerilim düşüyor, tatil hissi geliyor. Oyunun "nefes" bölümü.
- **Neden paylaşılır:** Orta düzeyde. Güzel ama şok etkisi düşük.
- **Kontrol / Çekirdek:** Aynı / Hayır, yalnızca üretim profili (geniş yüzey, uzun ara).
- **Maliyet:** Düşük-orta.
- **Risk:** Yasak yöne (aynı kuleler, farklı arka plan) en çok yaklaşan fikir bu. Ancak çam tepesi ve köşk zemini gerçekten farklı olursa geçer.

### 5. Tek Zıplama (cüretkâr) — Kız Kulesi'ne uzun atlama
- **Yaşanan:** Işınlanma oyuncuyu kıyıdaki son bir kayaya bırakıyor. Önünde denizin ortasında tek bir hedef var: küçük adacıktaki kule. Ekranda "Tek hak" yazıyor. Basılı tutarken kamera geri çekiliyor, bırakınca ağır çekim. İnersen büyük ödül ve özel kart, inemezsen şıp.
- **Neden farklı:** Bütün gerilim tek bir hamlede toplanıyor. 8 sn'lik bir film gibi.
- **Neden paylaşılır:** Çok yüksek. Ağır çekim iniş, *video* paylaşımının ta kendisi. "Bir de sen dene" diye arkadaşa uzatılır.
- **Kontrol:** Aynı. Basılı tutma süresi uzun olabilir.
- **Çekirdek:** **EVET.** Kamera (geri çekilme, ağır çekim) ve gerekirse azami şarj/mesafe değişiyor.
- **Maliyet:** Orta.
- **Risk:** Mesafe ana fizikle ulaşılamaz olursa şarj sınırını aşmak gerekir. Bu, kullanıcı onayı gerektirir.

### 6. Çamaşır İpleri — mahalle arası, lodoslu gün
- **Yaşanan:** Lodos esiyor, amca eski bir sokağın üstünde, balkonlar arası gerili çamaşır iplerinde. Çarşaf ve kazakların üstüne iniyor, ipler esniyor. Teyze balkondan "ayakkabınla basma!" diye bağırıyor.
- **Neden farklı:** Zemin yumuşak ve esnek, mahalle sesi ön planda. Mevcut teyze balonlarıyla bağ kuruyor.
- **Neden paylaşılır:** Kültürel mizah. Türk oyuncu teyzenin cümlesini paylaşır.
- **Kontrol:** Aynı. Esneme yalnızca görsel bir tepki.
- **Çekirdek:** Hayır, iniş sonrası bir görsel animasyon eklemek yeterli.
- **Maliyet:** Orta.
- **Risk:** Lodos zaten bir hava olayı olarak var, karışabilir.

### 7. İlk 30 Saniye Kancası (fikirlerin taşıyıcısı, tek başına da değerli)
- Yeni oyuncunun ilk koşusunda 4. kulede pusula **garantili** çıkar ve amca Dev Gemi'ye ışınlanır. Dönüşte albüm ilk kez açılır, "1/5" yazar ve öteki kareler silüet olarak görünür.
- Çekirdek: hayır, kurukafadaki gibi yalnızca bir tetik kuralı.
- Risk: Her koşuda olursa sıradanlaşır. Garanti yalnızca ilk oturuma ait.

## Sıralama (paylaşma × ilk-30-sn × maliyet)
1. Dev Gemi ve İlk-30-sn kancası birlikte
2. Tek Zıplama (en çok video üreten, ama çekirdeğe dokunuyor)
3. Köprü Gecesi
4. Martı Sürüsü (en komik, en pahalı ve riskli)
5. Çamaşır İpleri
6. Adalar

## 1 numaram: "Dev Gemi" ve ilk koşuda garantili ışınlanma
Neden: Ölçek şoku, İstanbul'a özgü, ekran görüntüsünden tek bakışta anlaşılır. Üstelik fizik ve kameraya dokunmadan "gerçekten başka bir yer" hissini veren tek fikir bu. Konteyner yığınları kule mantığıyla aynı, yalnızca dünya değişiyor. İlk açılışta 20. saniye civarında olduğu için tek kez açıp bırakan oyuncuyu da yakalar.

### En küçük deneme (1 TestFlight sürümü)
- Kapsam: tek mekân (gemi), tek tetik (pusula, 4. kule, yalnızca ilk koşuda, sonra ~%5 olasılık), 8 iniş, cezasız düşme, ×2 puan, dönüşte basit bir paylaşım kartı. Albüm yok, yerine kartta "1/?" yazar.
- Görsel: 4–5 Kıvılcım çağrısı (konteyner yüzleri, gövde ve pruva, deniz ve kıyı arka planı). Her çağrı ayrı onayla yapılır.
- Kod: Kule üretimine bir "gemi profili" (kaplama + genişlik ve yükseklik aralığı), ters kayan kıyı arka planı, tetik ve dönüş. Fizik, kamera ve iniş kodu değişmez.
- Ölçüm (6 arkadaşla): (a) Kendiliğinden "gemi" diye bahseden oldu mu? (b) Biri ekran görüntüsü ya da kart paylaştı mı? (c) Tek kez açan arkadaş yeni sürümü ikinci kez açtı mı? (d) "Bir daha nasıl çıkar?" diye soran oldu mu? Bu sorunun gelmesi merak tuttu demektir, albüme geçilir.
- Başarısızlık işareti: "Arka plan değişti" denirse gövde ve su görünmüyor demektir. Görsel güçlendirilir, fikir ancak ondan sonra elenir.
