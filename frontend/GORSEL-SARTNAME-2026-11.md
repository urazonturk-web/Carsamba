# GÖRSEL ŞARTNAMESİ — Kolonlar ve arka plan katmanları (GORSEL-018, 2026-11-10)

**Amaç:** Oyuncunun indiği kuleleri (kolonları) arka plandan ayırmak, iniş noktasını okunur kılmak, tekrarı kırmak ve arka planı "dünya ilerliyor" hissi verecek şekilde kayan katmanlara bölmek.
**Dayanak:** GORSEL-DEG-001 (üç bağımsız değerlendirme: genel 6 / 5 / 5; en zayıf alanlar iniş okunurluğu 4–5 ve çeşitlilik 4) ve KAMERA-HIS-001 / R077 (arka plan kayınca kullanıcı: "daha iyi"). Ayrıntı: `GAME_STUDIO.md`, `AI_REVIEW.md`.
**Üretim ve harcama kararı kullanıcıdadır.** Bu belge yalnız neyin, hangi ölçüde ve hangi kabul ölçütleriyle üretileceğini tarif eder.

---

## 0. Değişmeyecekler (sabit kısıtlar)

- **Çatı silueti:** dar, üçgen (kalça) tepeli çatı kabul edildi. Eğim (40 px yatay / 47 px düşey), çatı yüksekliği ve tepe biçimi aynı kalır.
- **Kule genişlikleri ve yükseklikleri** oynanış verisinden gelir (dar / orta / geniş); görseller bu ölçülere **gerilerek** çizilir. Görsel, kule kutusunun dışına taşmaz.
- **Üslup:** mevcut İstanbul/Boğaz ana resmiyle (`bosphorus-rooftop-day-master-v1.png`) aynı boyalı illüstrasyon dili, aynı ışık yönü ve palet. Fotoğraf gerçekçiliği ya da başka bir çizim dili yok.
- **Karakter, fizik, kamera:** değişmez.

## 1. Ekran ölçüsü — neden yüksek çözünürlük gerekiyor

Hedef cihaz iPhone 16 Pro Max: 1320 × 2868 piksel (440 × 956 nokta, 3×). Oyun dünyası ekrana **1 dünya birimi = 1,2 cihaz pikseli** ölçeğiyle çiziliyor.

| Mevcut görsel | Kaynak | Ekranda | Büyütme |
|---|---|---|---|
| Cephe kolonu `house-facade-column.png` | 140 × 560 | ~319 × 1277 | **2,3×** (bulanıklığın nedeni) |
| Çatı kiremidi `house-roof-tiles.png` | 486 × 47 | ~1108 × 107 | 2,3× |
| Arka mahalle şeridi `rooftop-district-v2.png` | 826 × 252 | ~1883 × 575 | 2,3× |
| Uzak arka plan (tek resim) | 941 × 1672 | ~1921 × 3413 | 2,0× |

**Kural:** her yeni görsel ekranda en fazla **1,0×** büyütülecek çözünürlükte teslim edilir. Aşağıdaki ölçüler bu kurala göredir; daha büyük teslim serbesttir, oran korunmalıdır.

## 2. Kule cephesi (kolon gövdesi)

**Teslim:** `assets/environment/district/house/facade/`

| Dosya | Ölçü (px) | Not |
|---|---|---|
| `facade-{renk}-{modül}.png` | **350 × 1400** (oran 1:4, mevcutla aynı) | PNG, RGBA; kenarlar tam opak |

- **Dikeyde kesintisiz döşenebilir:** üst kenar alt kenara dikişsiz eklenir. Kabul testi: görsel yarı yüksekliği kadar kaydırılıp döşendiğinde dikiş, yatay kesik ya da ton farkı görünmez. Şu an ikinci kulede görünen yatay kesik olmamalı.
- **Kenar kontur ve gölge çizilmez.** Dış kontur ve gölge şeridi kodda eklenir (bkz. 5); görsel düz cephe olarak teslim edilir. Cephe içindeki ayrıntıların (pencere, panjur, balkon) kendi gölgeleri serbesttir.
- **Sıva renkleri (4):** krem (mevcut), açık pembe, okr / açık sarı, gri-mavi. Değerleri arka plan evlerinden **bir kademe daha doygun ve kontrastlı** olmalı; ön plan olduğu okunmalı.
- **Cephe modülleri (en az 3):**
  1. Pencere + yeşil panjur (mevcut düzen, yeniden çizim),
  2. Ferforje balkon + saksılar,
  3. Kilim / çamaşır ipi + cumba.
  Her renk × modül birleşimi ayrı dosya, en az **4 × 3 = 12** dosya.
- **Kat yükseklikleri** mevcut modülle aynı ritimde: kat başlangıçları 0 / 163 / 309 / 407 (560 birimlik dönemde, ölçek oranlı). Böylece kat çizgileri komşu kulelerle hizalanır.
- **Alt uç:** kuleler ekranın altına uzanır, görsel dikeyde döşendiği için ayrı bir taban parçası gerekmez. Alttaki yumuşak sis kodda yapılır.

## 3. Çatı (silueti sabit)

**Teslim:** `assets/environment/district/house/roof/`

| Dosya | Ölçü (px) | Not |
|---|---|---|
| `roof-tiles-v2.png` | **1215 × 118** (mevcut oran 486 × 47) | PNG; yatayda dönemli kiremit dokusu |
| `roof-ridge-highlight.png` | 1215 × 12 | Mahya hattı için ince açık vurgu şeridi, RGBA |
| `roof-finial-{alem,baca,kedi}.png` *(isteğe bağlı)* | ~120 × 160 | Tepe süsü, RGBA, alt orta pivot |

- Mevcut dokudaki **beyaz parlama çizgileri kaldırılır**; değerlendirmede hata gibi okundu.
- Kiremit tonu arka plandaki çatılardan **daha doygun ve bir kademe daha açık**; hedef kule tepesi kalabalıkta seçilebilmeli.
- Kiremit dokusu **yatayda dönemli** olmalı. Mevcut dönem 86 kaynak px, yeni çözünürlükte ~215 px; kod bu dönemle kaydırıyor.
- Tepe süsü (alem / baca / kedi) **iniş yüzeyine taşmaz**; karakterin ayağının bastığı yerin dışında ya da arkasında durur (GORSEL-009 kuralı: dekoratif öğeler iniş yolundan uzak).

## 4. Arka plan katmanları (yatayda kesintisiz kayan)

R077 denemesinde tek resim aynalanarak döşendi; Galata ve silüet aynalanıyor. Kalıcı çözüm iki ayrı, **yatayda dikişsiz** katman:

**Teslim:** `assets/environment/layers/`

| Katman | Dosya | Ölçü (px) | İçerik | Kayma hızı (dünyaya göre) |
|---|---|---|---|---|
| A — uzak | `layer-a-sky-skyline.png` | **3840 × 2000** | Gökyüzü + bulutlar + karşı kıyı silüeti (Galata, camiler, köprü) + kıyı şeridi | ~0,15–0,20 |
| B — orta | `layer-b-sea.png` | **3840 × 1500** | Boğaz suyu, kıyıdan arka mahalleye kadar; üst kenarı kıyı çizgisinde **saydam** (A'nın üstüne oturur) | ~0,45 |
| B+ — isteğe bağlı | `ferry-{1..3}.png` | ~600 × 250 | Ayrı vapur sprite'ları (sonra ayrı hızla hareket ettirilebilir) | — |

- **Yatayda kesintisiz:** sol kenar sağ kenara dikişsiz eklenir. Kabul testi: görsel yarı genişliği kadar kaydırılıp yan yana konduğunda dikiş görünmez.
- **Simgeler bir dönemde bir kez:** Galata Kulesi, belirgin camiler ve köprü her 3840 px'te en fazla bir kez görünür; ayna görüntüsü olmaz.
- **Ufuk ve kıyı yüksekliği** mevcut ana resimle aynı oranda kalır. Kod, deniz bitiş satırını ve dünya Y kilidini buna göre hizalıyor (mevcutta deniz sonu 1672 px yüksekliğin 1298. satırı).
- **Atmosferik perspektif:** A katmanı ön plandan daha açık ve mavi-gri tonlu, kontrastı düşük olur. Uzak olduğu okunmalı.
- **Arka mahalle şeridi** (`rooftop-district-v2`, kayma 0,8): aynı çözünürlük kuralıyla **1900 × 580** yeniden çizim; renkleri kulelerden **daha soluk ve hafif mavi-gri** (kuleler öne çıksın), yatayda kesintisiz.

## 5. Kodla yapılacaklar (görsel değil — bilgi için)

Bunlar görsel üretimi beklemez; görseller gelince birlikte ayarlanır:
- Kulelere 2–3 px koyu kahve dış kontur ve sağ yüzde koyu dikey gölge şeridi (ışık soldan, arka plandaki güneşle aynı yön).
- Şarj sırasında hedef kule tepesinde hafif parıltı.
- Cephe renk ve modüllerinin kulelere rastgele ama tohumlu (tekrarlanabilir) dağıtımı.
- Katman hızlarının (A / B / mahalle) ayarı; R077 bayrağının kalıcı katmanlarla değiştirilmesi.
- "Hold to charge / Release to jump" yazısına kontrast zemin.

## 6. Kabul ölçütleri (teslim kontrol listesi)

1. Ölçü ve çözünürlük bu belgedeki tablolarla aynı ya da daha büyük, oran korunmuş.
2. Dikiş testi: cephe dikeyde, katmanlar yatayda yarım dönem kaydırılıp döşendiğinde dikiş yok.
3. Beyaz parlama çizgisi, kesik, bulanık leke yok; 100 % büyütmede keskin.
4. Palet ve ışık yönü ana resimle uyumlu; ön plan (kuleler) arka plandan bir kademe daha doygun ve kontrastlı.
5. Dekoratif öğeler iniş yüzeyine girmiyor.
6. Telefonda (iPhone, 60 sn oyun) üç soru: hedef kule kalabalıkta seçiliyor mu, kuleler birbirinin kopyası gibi görünüyor mu, arka plan kayarken dikiş ya da ayna görünüyor mu.
7. Kullanıcı kabulü olmadan hiçbir yeni görsel oyuna bağlanmaz (proje kuralı); önce yan yana karşılaştırma görseli sunulur.

## 7. Öncelik sırası

1. **Cephe (2)** + **kiremit düzeltmesi (3)** — değerlendirmedeki en büyük üç kusurun ikisine doğrudan dokunur.
2. **Arka plan katmanları (4)** — R077 hissini kalıcı ve ayna izsiz yapar.
3. İsteğe bağlı: tepe süsleri, ayrı vapur sprite'ları.
