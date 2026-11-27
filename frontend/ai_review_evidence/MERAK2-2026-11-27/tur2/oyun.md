# MERAK2 · Tur 2 · Oyun tasarımı editörü: birleştirme

## 1. Birleşik tasarım: "MARTI NEREYE BIRAKTI?"
Ana fikir şu: İstanbul'da yaşayan bir şey (martı) amcayı kapıp gerçekten başka bir parkura bırakıyor. Her
bırakma yeri elde **bir şeyi** değiştiriyor: zamanlama, ölçek ya da ölçü. Kontrol hep aynı: basılı tut, bırak, yay, iniş.

**Tetik: simit ve martı** (anlatı, Fikir 1). Kurukafanın yerleşim kuralıyla havada bir simit duruyor. Amca simide
değdiği anda bir martı dalıp amcayı simitle birlikte kaldırıyor ("Bırak simidimi!"). Taşıma 1,5 sn sürüyor ve
dokunuşla geçilebiliyor (anlatının riski). Işınlanmanın sebebi büyü değil, herkesin tanıdığı martı. Bunu bir arkadaşa
anlatmak tek cümle: "Martı amcayı kaptı!"

**İlk koşuda garantili** (oyuncu, Fikir 7). Yeni oyuncunun ilk koşusunda simit 4. kulede çıkıyor ve olay yaklaşık
20. saniyede yaşanıyor. Sonra koşu başına en fazla bir kez, rastgele çıkıyor. Kurukafa sürerken simit çıkmıyor. Yerleşim ayrı
bir karmayla seçiliyor ve bölüm iki durak arasına sığıyor (teknik, A6): meydan okuma ve hayalet bozulmuyor.

**Bırakma yeri 1: DENİZ** (anlatı'nın Dev Gemi'si, teknik'in Deniz Seferi, Arda'nın şamandıraları ve Kıvılcım'ın dalgalanan tahtaları birlikte).
- An an: Martı amcayı Boğaz'dan geçen dev bir konteyner gemisinin üstüne bırakıyor. İlk 4 iniş sabit ve
  geniş konteyner yığınları üstünde, yükseklik farkları ise büyük (ölçek şoku, oyuncu'nun ilkesi). En yüksek nokta dümen köşkü.
  Pruvada gemi düdük çalıyor. Sonraki 4 iniş geminin yanındaki **inip kalkan balıkçı kayıkları ve
  şamandıralar** üstünde. Burada bırakma anını dalgaya göre seçmek gerekiyor (benim Fikir 2'm ve teknik B1). Son kayık
  kıyıya yanaşıyor ve ana parkura dönülüyor.
- Neden farklı: Gemi kısmı ölçeği, kayık kısmı eli değiştiriyor. "Ne kadar" sorusuna "ne zaman" sorusu ekleniyor.
  Böylece "Kayıp Sefer"deki yalnız kaplama tuzağına düşülmüyor: kayıklar zorunlu.

**Bırakma yeri 2: SARNIÇ** (benim Fikir 1'im, Ada'nın su yolu atmosferi). Martı amcayı bir çatı kapağından aşağı
düşürüyor ve amca sütun başlıklarına iniyor. Alçak tavan var: tam basarsan kafa çarpıyor. Kısa ve ölçülü zıplamak
gerekiyor. Işık huzmesinden çıkılıyor. Bu yer ikinci sürüme kalıyor.

**Bırakma yeri 3 ve sonrası (açık uç):** Köprü trafiği tavanları (anlatı, Fikir 3) ucuz bir yer. Ayna "karşı yaka" (teknik
B2) bir yere eklenerek güçlenebilir. Her yeni yer yeni bir el kuralı getirmek zorunda, yoksa listeye girmiyor.

**Ödül ve merak** (oyuncu'nun 3 katmanı ve anlatı'nın ruleti):
- Bölüm içinde düşmek cezasız: "şıp" sesiyle ıslak saçla ana parkurda beliriyorsun ve yalnız bölüm bonusunu kaybediyorsun.
  Oyuncu cesur zıplıyor (oyuncu ilkesi).
- Bölüm içindeki inişler x2 sayılıyor. Kule sayacı kaldığın id'den devam ediyor (teknik A6).
- **"Martı seni nereye bıraktı?" albümü:** görülmemiş yerler silüet ve "?" olarak duruyor. Dönüşte bir an kartı çıkıyor
  (ShareCard): "Kadıköy → bir gemi → Arnavutköy".
- Her bırakmada amca tek satır söyleniyor (anlatı, Fikir 7, TASLAK havuzunda): "Ben bu yaşta konteynere mi binecektim?"

**Kontrol nasıl aynı kalıyor:** `jump.ts`, şarj süresi ve yay değişmiyor. Kayıkların üstünde dururken amca onlarla birlikte
kımıldıyor, ama kalkış hızına kayığın hızı EKLENMİYOR (teknik B1).

**Çekirdeğe dokunduğu yerler** (her biri ayrı kullanıcı onayı ister):
- (a) `initWorld` bloğundan `teleportTo` çıkarılması: skor ve hava sıfırlanmadan dünyanın değişmesi (teknik A1).
- (b) Üretimde "gemi" profili: geniş yüzeyler, büyük yükseklik farkı.
- (c) Hareketli yüzey: liste sabit kalıyor, konum `x/topY + amp·sin(seaT + faz)` (teknik A3). İnişte `p` etkin listeden
  okunmalı (teknik A7, yoksa amca kayar). `amp ≤ boşluk payı/2` olmalı ve en kötü fazda erişim çevrimdışı kanıtlanmalı (A8).
- (d) Bölüm içinde oyun sonu yerine kıyıya dönüş.
- (e) x2 puan.
- (f) Sarnıç tavanı (yalnız 2. sürümde).

**En küçük deneme (1 TestFlight, görsel 0, yaklaşık 3 gün):**
1. `MARTI_TEST` bayrağı açılıyor. 4. kulede simit (kurukafa görseli, sarı tonlu) çıkıyor. Değince 300 ms beyaz perde
   iniyor, `teleportTo` çalışıyor. Martı animasyonu yok.
2. 4 düz renkli "konteyner" (gemi profili) ve ardından 4 sinüsle inip kalkan "kayık" kullanılıyor. Hepsi yer tutucu dikdörtgen.
   Sonra ana parkura dönülüyor. Bölümde düşmek cezasız.
3. physics-evidence ile en kötü fazda erişim ve A7 düzeltmesinin kanıtı hazırlanıyor.
4. Arkadaşlara tek soru soruluyor: "Simitten sonra ne oldu, kayıkta eller farklı mıydı?" Evet derlerse Kıvılcım çağrıları (gemi, kayık, martı
   taşıma pozu) her biri ayrı onayla yapılıyor, sonra albüm ve Sarnıç geliyor.

## 2. Oy (kendi fikirlerim hariç)
- anlati, Simit Martısı → Dev Gemi, **3 puan**: Işınlanmanın sebebini İstanbul'un kendisine bağlıyor ve "şuna bak" testini ilk saniyede geçiyor.
- teknik, Deniz Seferi (hareketli vapur ve şamandıra), **2 puan**: Eli gerçekten değiştiren en ucuz yolu motor kanıtıyla, tuzağıyla (A7) birlikte gösteriyor.
- oyuncu, İlk 30 Saniye Kancası (garantili ilk ışınlanma ve cezasız düşme), **1 puan**: Bir kez açıp bırakan testçiye cevap veren tek fikir.

## 3. Veto/uyarı: en büyük tek tehlike
**Dev Gemi'nin sabit konteynerlerle tek başına yapılması** (anlatı'nın ve oyuncu'nun en küçük denemesi). Sabit
yüzeylerde yalnız kaplama ve arka plan değişiyor. Bu, kullanıcının reddettiği "aynı kuleler, başka görünüş"ün ta kendisi:
konteyner, renk değiştirilmiş bir kule. Gemi ancak elde bir kural değiştiğinde (kayıklarda zamanlama ya da büyük yükseklik
farkı) kabul edilebilir. İlk denemede hareketli kısım olmazsa, deneme yanlış soruya cevap verir.
