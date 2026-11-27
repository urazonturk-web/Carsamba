# MERAK-2026-11-27 — Teknik editör görüşü: ışınlanma ve "sahne değiştiren" mekanikler

Kod değiştirilmedi. Referanslar `frontend/` köküne göredir (`app/index.tsx` = index).

## 0. Kod tabanında bilinmesi gereken 8 gerçek
1. **Kule dizisi tek RNG akışıdır**: `rand()` `rngState`'ten sırayla çeker (index:1791-1796), `generateProceduralPlatform` her kule için sabit sayıda çağrı yapar (procedural-course.ts:70-121). Kuleler yalnız ileriye, `camX`'e göre üretilir (index:3235-3245). Aynı tohum = aynı dizi; dizi `id` ile zorlaşır (`stopDifficulty(id)`, stops.ts:88).
2. **Kurukafa deseni hazır şablon**: yerleşim ayrı karma (`skullHash`, kurukafa.ts:33) ile, RNG'ye dokunmadan; kule nesnesine `out.skull` olarak iliştiriliyor (index:1810); toplama uçuşta gövde dikdörtgeni testiyle (index:3041-3052); etki iniş sayısıyla geri sayılıyor (index:3178-3182). Yeni her "havada nesne" bu borudan geçebilir: tür alanı + ayrı karma tuzu.
3. **Etki yalnız iniş testine giriyor**: `scaledPlatforms` (kurukafa.ts:108) `findFootLanding`'e farklı liste verir (index:3055-3056); formül aynı. Yani "kural katmanı" = iniş testine/ekrana verilen liste; fizik fonksiyonları (jump.ts, landing.ts) hiç değişmeden.
4. **Kamera**: `camXR` monoton (`Math.max`, index:3283) → ileri sıçrayan oyuncuda kamera anında keser (yumuşatma yok); geri gidemez. `camYR` yalnız başlangıçta kurulur ("tek değişebildiği an", index:1905-1906); düşüş tespiti de `camYR`'ye bağlı (index:3213). Kule `topY` zaten [platformMinTopY, platformMaxTopY] bandında (procedural-course.ts:79-80), yani başka bir dizi de aynı dikey çerçeveye oturur.
5. **Puan ve duraklar kule kimliğinden**: `towersCrossed = p.id - lastLandedId` (index:3128); durak bandı, köprü şeridi, gökyüzü adımı `stopsPassed(landedId - towersCrossed)` ile `stopsPassed(landedId)` farkından (index:1934-1977). Kimlik atlarsa puan + durak + pijama (index:3144) + fener (fener.ts `FENER_BAS/SON`) hep birlikte tetiklenir.
6. **Hazır "sahne geçişi" aracı var**: pijama kapı anı — `doorLock` dokunmayı kilitler, `charOp` amcayı söndürüp yakar, `withDelay` zinciri (index:3144-3160, 2644). Bagaj molası `running.value = 0` ile oyunu durduruyor (index:1985-1990). Işınlanma perdesi bunların aynısı olur.
7. **Arka plan değişimi hazır**: `BG_VARIANTS` (index:472-480) beş Kıvılcım master'ı; `CachedImage transition={700}` ile çapraz geçiş (index:3708-3716); cephe atlası hava/mevsime göre seçiliyor (index:226, 1602). Sahne değişimi = bu seçiciye bir "sahne" girdisi.
8. **Bellek gerçeği**: arka plan master 941×1672 (~6,3 MB çözülmüş) + alt 941×748 (~2,8 MB); **cephe atlası 8400×1340 ≈ 45 MB çözülmüş**. Yeni sahne için arka plan ucuz, yeni cephe atlası pahalı (iki atlası aynı anda tutmak iPhone'da risk).

## 1. Işınlanma için üç uygulama yolu

### Yol A — Aynı dizide ileri atlama (gerçek ışınlanma)
Nesne havada alınır; bir sonraki inişte perde kapanır (≈600 ms, `doorLock`), amca `n+k`. kuleye konur, perde açılır.
- Yapılacak: `n+k`'ye kadar `makeNextPlatform` döngüsü (aynı sırayla RNG tüketir → dizi aynı, sadece aradakiler atlanır); `px/py/baseY/standingPlatformId` ayarı; `camX/camXR` ileri anlık (monoton olduğu için doğal); arka kuleleri temizleme zaten var (index:3248-3256).
- Dokunduğu yerler: fizik formülü HAYIR, fizik DURUMU evet (konum yazılıyor); kamera evet (anlık kesme); **puan evet** (k kule birden sayılır — kural gerekir: 0 mı, 1 mi, k mı); tohum hayır (aynı akış); **durak evet** (atlanan durak bandı, kartpostal, pijama, sis, köprü şeridi tek inişte çakışır); yarış/hayalet evet (`EV_LAND` kaydı kimlik atlar, yaris.ts).
- Büyüklük: ~120-180 satır index.tsx + atlama kuralları; kartpostal/durak istisnaları ek iş.
- Performans: k büyükse tek karede çok kule + ev görünümü (PlatformHouseView) yeniden bağlanır → bir kare takılması; perde arkasında gizlenir. Bellek değişmez.
- Test: çevrimdışı betik (physics-evidence): `makeRand(seed)` + `generateProceduralPlatform` ile atlamalı ve atlamasız dizinin aynı kimlikte bayt-eş olduğunu göster; durak/puan muhasebesini sim et; simülatörde zorlanmış deneme bayrağı (FENER_TEST benzeri).
- Hüküm: "kule üretimi değişmez" sınırını harfiyen korur ama puan + durak + kamera üçlüsüne dokunur → **ayrı onay gerekir**.

### Yol B — Ayrı "bonus sahne" dizisi (farklı tohum)
Amca başka bir dünyaya (ör. çatı yerine Haydarpaşa rıhtımı) geçer, orada 5-8 kule zıplar, sonra kaldığı kuleye döner.
- Yapılacak: ana dünyanın tüm durumunu sakla (platforms, rngState, idCounter, lastLandedId, px/py/baseY, camX/camXR, effectK/Left), ikinci `rngState2 = hash(runSeed, n)` ile aynı `generateProceduralPlatform`'u çağır, kimlik ad alanı ayrı (ör. 100000+ ama zorluk için `stopDifficulty` sahte id ister), bonusta düşüş = oyun sonu değil "geri dön" kuralı (index:3211-3216 dalı), dönüşte durumu geri yükle.
- Dokunduğu yerler: fizik formülü hayır; kamera evet (geri dönüşte `camXR` GERİ gitmeli → monotonluğu kırar, ya da bonus dünyası x ekseninde ileride kurulur); puan evet (bonus inişi sayılır mı); tohum evet (ikinci akış — ana akış kaydedilip geri yüklenirse ana dizi bozulmaz); durak hayır (bonus kimlikleri durak sayılmamalı, `isStopTower` 100000+'da da tetiklenir! — ayrı bayrak şart).
- Büyüklük: ~300-450 satır; 6214 satırlık kare döngüsüne en çok dokunan yol. Yeni sahne görseli (arka plan + yeni cephe/zemin) 2-4 Kıvılcım çağrısı.
- Performans: yeni cephe atlası +45 MB (iki atlas yan yana tutulursa bellek uyarısı/çökme riski); dünya değişiminde tüm ev görünümleri yeniden bağlanır.
- Test: ana dizinin bonus öncesi/sonrası bayt-eş olduğunu gösteren betik (rngState geri yüklemesi), düşüş-dönüş kenar durumları, yarışta kapatma.
- Hüküm: en "vay" etkili ama en riskli; ilk sürüm için önermem.

### Yol C — Aynı dizi, sahne kaplaması (görsel ışınlanma)
Nesne havada alınır; sonraki inişte beyaz/martı perdesi, perde açılınca **dünya başka yerdedir**: arka plan, gökyüzü tonu, (isteğe bağlı) çatı kiremidi rengi farklı; N iniş sonra perdeyle geri. Amca ve kuleler dünyada hiç kıpırdamaz.
- Yapılacak: kurukafa borusuna `kind: "kapi"` (ayrı tuz, `skullHash(seed ^ YENİ_TUZ, id)`), `sahne` SharedValue + iniş sayacı (index:3178 deseni), perde = `doorLock` + tam ekran opaklık katmanı, arka plan seçicisine (index:1603) sahne önceliği.
- Dokunduğu yerler: fizik HAYIR, kamera HAYIR, puan HAYIR, tohum HAYIR (ayrı karma), durak HAYIR (sahne sürerken durak bandı isteğe bağlı bastırılır — yalnız görüntü).
- Büyüklük: ~80-130 satır (yeni dosya `src/game/kapi.ts` + index'te 4-5 küçük bağlantı). Görsel: ilk sürüm **sıfır yeni görsel** (mevcut kar/sonbahar master'ları "başka zaman"); ikinci sürüm 1-2 Kıvılcım arka planı (~9 MB/sahne).
- Performans: arka plan değişimi React state ile olursa 6000 satırlık bileşen yeniden çizilir (bugün `roofWx` de böyle, kabul edilebilir); daha temizi iki katmanı önceden bağlayıp opaklığı SharedValue ile değiştirmek (+9 MB, re-render yok). Cephe atlası değiştirilecekse `Image.prefetch` ile perdeden ÖNCE ısıt, yoksa perde açıldığında boş cephe görünür.
- Test: (a) özellik açık/kapalı aynı tohumla kule dizisi bayt-eş (betik: `skullAfter` + yeni `kapiAfter` RNG'ye dokunmuyor); (b) simülatörde deneme bayrağıyla 2. kulede kapı; (c) FRAME_DIAG/PERF_PROBE ile perde anında kare süresi; (d) Xcode bellek göstergesi.

## 2. Ekip sınırlarını bozmayan en güvenli yol
**Yol C.** Kurukafanın kanıtlanmış toplama boru hattını yeniden kullanır, pijama kapısının perdesini yeniden kullanır, `BG_VARIANTS` geçişini yeniden kullanır. Fizik, çarpışma, kamera, kule üretimi, puan, durak — hiçbiri değişmez; zıplama hissi bayt-bayt aynı. "Işınlanma" hissini veren şey konum değil **bağlamın** kopmasıdır: perde + farklı ufuk + farklı ses (vapur düdüğü yerine tramvay zili) oyuncuya "başka yerdeyim" dedirtir.
Sonraki adım istenirse Yol A'nın "inişte, perde arkasında, puan = 1 kule, durak atlanamaz (k durak sınırını geçmeyecek şekilde kısaltılır)" sürümü ayrı onayla eklenebilir; C'nin perde altyapısı A'ya aynen hizmet eder.

## 3. Diğer cüretkâr fikirler — fizibilite
| Fikir | Katman | Not |
|---|---|---|
| Vapur güvertesi (durakta) | Görsel | Durak kulesi zaten hep geniş (`breath`, procedural-course.ts:60,102-106) → durak kulesini vapur/iskele kaplamasıyla çiz; yüzey aynı. |
| Hareket eden vapur yüzeyi | **Çekirdek** | İniş testi sabit `p.x` varsayıyor (landing.ts:24); hareketli platform = fizik/üretim değişimi. |
| Köprü üstü | Görsel | `bridgeAt(id)` (stops.ts:43) köprü kulelerini zaten biliyor → kuleleri köprü ayağı/halat olarak çiz. Kesintisiz köprü tablası = çekirdek. |
| Gece/sis kapıları | Görsel + kural | Fener emsali: kimlik aralığıyla (`fenerAktif`) yalnız çizim. "Kapıdan geçersen gece" = Yol C'nin aynısı. |
| Zaman kayması (geçmiş İstanbul) | Görsel | Yol C + 1-2 sepya arka plan. Gökyüzü `skyStep` (index:1534) zaten animasyonlu. |
| Uçuşta ağır çekim | **Çekirdek-yakın** | `advanceFlight` kesin kinematik (jump.ts:30-33): dt'yi küçültmek iniş NOKTASINI değiştirmez, yalnız süreyi uzatır — ama şarj, kamera süzgeçleri, düşüş eşiği dt'ye bağlı; ayrı onay ve ölçüm ister. |
| Oturumlar arası sırlar | Kural/kayıt | `storage` + kartpostal emsali (POSTCARDS_KEY). Tohumdan türeyen sırlar ayrı karma ile; çekirdeğe dokunmaz. |
| Gerçek ayrı dünya (Yol B) | **Çekirdek** | Kare döngüsü, kamera monotonluğu, düşüş kuralı. |

Kural: **iniş testine giden listeyi veya x/y durumunu değiştiren her şey çekirdektir; yalnız çizilen katmanı, sesi, HUD'u ve kayıt deposunu değiştiren her şey değildir.**

## 4. Benim önerilerim (ucuz, etkisi büyük)
1. **Mevsim kum saati (sıfır yeni görsel)**: havada kum saati → perde → dünya anında kara gömülür (ya da sonbahara döner), 5 iniş sonra geri. Mevcut 4 Kıvılcım master'ı + 4 cephe atlası + kar tozu (index:4079) + kedi titremesi hazır; yalnız `roofWx/season` için "geçici üstünlük". ~40-60 satır. Risk: cephe atlası çözme takılması → `Image.prefetch` ile önceden ısıt.
2. **Dünkü amca (kendi hayaletin)**: yarış modu zaten iniş olaylarını kaydedip hayalet oynatıyor (index:1930 `pushEvent`, yaris.ts). Son en iyi koşunu cihazda sakla, sonraki koşuda yarı saydam "dünkü sen" önünden zıplasın. Fizik yok, aynı tohum gerekmez (hayalet kendi kulesinde değil, ilerleme şeridinde de gösterilebilir). ~80-120 satır.
3. **Tohum kartpostalı / gizli harita**: paylaşım kartına tohumu kısa kod olarak bas ("Bebek-7Q2"); kodu giren arkadaş aynı diziyi oynar (`initWorld(seed)` kancası hazır, index:1819; meydan okuma zaten tohumla çalışıyor index:2552). Ayrı karma ile her tohumun içinde 1 "altın kule" sırrı. ~50-80 satır, sıfır görsel (altın ton = renk filtresi).
4. **Ayna Boğaz**: kapıdan geçince arka plan `scaleX: -1` ile ters akar, gökyüzü gece moruna kayar (`interpolateColor`, index:3532) — "ters dünya" hissi tek satırlık dönüşüm + renk; görsel maliyeti sıfır. Kule/yüzey aynı.

## 5. Riskler ve kontroller (hangi yol seçilirse)
- Yarış/meydan okuma modunda yeni olay ya tohumdan belirlenmeli (adil) ya da kapalı olmalı (`raceRef.current` kontrolü, emsal index:1948).
- Kurukafa ile çakışma: aynı boşlukta iki nesne olmasın (`SKULL_MIN_GAP` mantığı, kurukafa.ts:50-55); etki sürerken yeni nesne yok (index:2991).
- Yeniden başlatma: yeni SharedValue'lar `restart` sıfırlamasına eklenmeli (index:2332-2339 emsali), yoksa sahne bir sonraki koşuya sızar.
- Teslim kanıtı: kule dizisinin özellik açık/kapalı bayt-eş olduğunu gösteren betik + simülatör videosu; TESLIM_HAZIR satırı kanıt sayılmaz.
