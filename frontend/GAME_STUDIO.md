# GÜNCEL DURUM — 2026-11-07 (sürüm notu S-2026-11-07; önceki dosya: `backups/GAME_STUDIO-2026-11-07-oncesi.md`)

> Tek bakış. Aşağıdaki tarihsel kayıtlar değişmedi; bu blok yalnız üstte durum özetidir. Koordinasyon: Claude Code "Çarşamba yöneticisi" = üretim/uygulama; Codex "Kıvılcım — Çarşamba Oyun Koordinatörü" = editoryal/teşhis ve bağımsız denetim. Kullanıcı = yön, para, hesap, yayın kararları.

**Aşama:** iPhone'da Expo Go ile oynanan Expo/React Native prototipi. **Kabul edilmiş ve dokunulmaz:** atlama fiziği, kamera akışı, dar (üçgen tepeli) çatı silueti.
**Kod durumu:** `app/index.tsx` etiketi `R068-DIAG` — `FRAME_DIAG=true`, `HOUSE_ROOF_MASK_DIAG=false`, `HOUSE_GRAD_FIXED=true`, `PERF_PROBE=false`, `HOUSE_AB_FROZEN=false`, `USE_FIXED_PANEL_COURSE=false`. Son commit 25 Eylül (`792174d`); R055–R069 değişiklikleri commit edilmemiş çalışma ağacında. R070 kod teslimi **yok**.

**Ana sorun — iPhone takılması (AÇIK):**
- R069-B (çatı maskesi kapalı, 14 Eki) olumsuz; 16 Eki geri alındı. Maske hipotezi desteklenmedi.
- 20 Eki Instruments: 98,5 sn'de 9 hitch, toplam 641,73 ms, en uzun 266,69 ms. Temsilî olay (~63. sn): yüzey 127,48 ms geç kuyruğa giriyor; render 6,5 ms / GPU 7,4 ms bunu açıklamıyor → gecikme **uygulama güncellemesi → yüzey teslimi** arasında. Oyun kodu / React Native / Expo Go / sistem ayrımı yapılamadı. Kanıt: `~/Documents/Codex/2026-09-09/referenced-chatgpt-conversation-this-is-an/shared/CARSAMBA_R070_PERFORMANCE_DIAG_BRIEF.md` + aynı dizindeki `CARSAMBA_R070_*.xml`.
- Orijinal `Carsamba-20Ekim.trace` artık yok (Downloads'ta bulunamadı). Bu Mac'te tam Xcode yok; `xctrace` bu ortamda çalışmıyor.
- Kural: kör optimizasyon yok; tek değişkenli deney, önce/sonra ölçüm, olumsuzsa geri al.

| İş | Sahip | Durum | Sıradaki adım |
|---|---|---|---|
| R070-A: aynı kod, Expo Go **geliştirme modu** (8082) vs **`--no-dev --minify`** (8083) karşılaştırması | Claude Code (hazırlık) → kullanıcı (iPhone denemesi) → Kıvılcım (bağımsız değerlendirme) | HAZIR, cihaz sonucu bekleniyor | `scripts/start-expo-prod-test.sh` ile 8083 QR → ≥2 dk oyun + ekran kaydı + his |
| R070-B: fark yoksa Expo Go vs ayrı iOS development build | Kullanıcı kararı (Apple hesabı/imzalama) | BEKLİYOR (R070-A sonucuna bağlı) | Hesap/imzalama koşulları kullanıcıya sunulacak; hiçbir hesap işlemi başlatılmadı |
| Diyalog entegrasyonu (`dialog-mizah/entegrasyon-teslimi-2026-09-18.md`: bildirim + sonuç ekranı satırı) | Claude Code (uygulama), teknik kararlar kullanıcı/Kıvılcım | AÇIK — 7 teknik soru yanıtsız, koda girmedi | Takılma işinden sonra; önce 7 soru (özellikle 5: tek satır mı rotasyon mu) |
| 4 kullanılmayan `assets/environment/kolon-*` dosyası | Kullanıcı kararı | AÇIK | Tut/arşivle kararı; kod bunlara atıf yapmıyor |
| Commit (R055–R069 + bu not) | Kullanıcı onayı | BEKLİYOR | Commit/push/deploy yalnız ayrı açık onayla |

**Sıradaki tek adım:** R070-A cihaz denemesi (aşağıdaki "REVIZYON-070-A" bölümüne ve kullanıcıya verilen adım listesine bakın). Fark net değilse sonuç "belirsiz" yazılır; yeni kod değişikliği yapılmaz.

---

TESLIM_HAZIR: GORSEL-008 R11 entegrasyonu — src/game/character-pose.ts + assets/characters/*-r11.png, rapor AI_REVIEW.md 2026-09-21i; iPhone cihaz kabulü bekliyor
TESLIM_HAZIR: ANTIGRAVITY GORSEL-008 R12 QA — AI_REVIEW.md; R12 iPhone değerlendirmesi bekliyor
TESLIM_HAZIR: GORSEL-008 R12 entegrasyonu — src/game/character-pose.ts + assets/characters/*-r12.png, rapor AI_REVIEW.md 2026-09-21j; %8 küçük iPhone kabul testi bekliyor
TESLIM_HAZIR: Carsamba Studio Skill — .claude/skills/carsamba-studio/SKILL.md; çalışma düzeni standardize edildi.
TESLIM_HAZIR: GORSEL-011 ChatGPT İstanbul arka planı ve kolon entegrasyonu — src/game/column-variant.ts + assets/environment/{istanbul-background-v1,column-wide-v1,column-tall-v1,column-medium-v1}.png, rapor AI_REVIEW.md 2026-09-22a; iPhone görsel kabulü bekliyor.
TESLIM_HAZIR: GORSEL-011 iPhone test reddi düzeltmesi — app/index.tsx (eski brick/tower/cap her normal platformda gizlendi, çatı ayağı + tile dolgu eklendi, debug paneli otomatik açılmıyor), rapor AI_REVIEW.md 2026-09-22b; iPhone görsel kabulü ve gerçek açılış süresi ölçümü bekliyor.
TESLIM_HAZIR: GORSEL-011B çatı adası tasarımı — app/index.tsx (roof-island sprite katmanları + assets/environment/roof-island-{wide,tall,medium}-v1.png; tile/roofStub/düz-renk kaldırıldı), rapor AI_REVIEW.md 2026-09-22c; iPhone görsel kabulü bekliyor.
TESLIM_HAZIR: GORSEL-012 tek parça mahalle arka planı — app/index.tsx (master-neighborhood-v1.png arka plan; GORSEL-011/011B ve GORSEL-004A per-platform baca katmanları kaldırıldı, platformlar sade kapaklı-kolon görünümüne döndü), rapor AI_REVIEW.md 2026-09-22d; iPhone görsel kabulü bekliyor. Not: chimney-top.png'nin de kaldırılması bir yorum kararıdır, geri alınabilir (bkz. rapor).
TESLIM_HAZIR: GORSEL-012 cihaz reddi düzeltmesi — app/index.tsx (A: gökyüzü/çatı iki-kutu kırpma, B: uzun kahverengi platform gövdesi kaldırıldı - yalnız kısa kapak kaldı, C: poseOverride donmasına karşı otomatik sıfırlama + dev düğmeleri taşındı), rapor AI_REVIEW.md 2026-09-22e; iPhone cihaz kabulü hâlâ gerekli.
TESLIM_HAZIR: GORSEL-013 dikey ana kaynak kompozisyon düzeltmesi — app/index.tsx (master-portrait-istanbul-v1.png tek parça arka plan, iki-bantlı çözüm kaldırıldı; dinamik platform kapağı tamamen saydam), rapor AI_REVIEW.md 2026-09-22f; iPhone cihaz kabulü hâlâ gerekli.

## GORSEL-014 / OYUN_AKISI-001 — yeni zorluk bantları (sayısal), 2026-09-22

Kök neden bulgusu: `CONFIG.gapLate.max`/`CONFIG.heightVarLate` önceden `procedural-course.ts`'in gerçek gap/height üretim formülünden TAMAMEN KOPUKTU (yalnız nadir bir dünya-sınırı fallback dalında kullanılıyordu) — gerçek üst sınır kodda sabit 300 (gap, "uzun" sınıf) ve 150 (yükseklik rise/drop) olarak yazılıydı. Bu turda iki sabit `CONFIG.gapLate.max`/`CONFIG.heightVarLate`'e BAĞLANDI (artık gerçekten kontrol ediyorlar) ve değerleri yükseltildi.

| Parametre | Eski (aktif, kopuk) | Yeni (aktif) | Daha önce reddedilen | Kaynak |
|---|---|---|---|---|
| Gap "uzun" sınıf üst sınırı (t=1, geç oyun) | 300 (sabit, config'den bağımsız) | **340** (`CONFIG.gapLate.max`) | 380 (2026-09-16'da "floaty" diye reddedildi) | `procedural-course.ts` `gMax = lerp(240, CONFIG.gapLate.max, t)` |
| Gap "uzun" sınıf alt sınırı | 220 | 220 (değişmedi) | — | aynı satır |
| Yükseklik rise/drop azami büyüklüğü (t=1) | 150 (sabit, config'den bağımsız) | **220** (`CONFIG.heightVarLate`) | 300 (aynı 2026-09-16 reddi) | `procedural-course.ts` `swing = lerp(100, CONFIG.heightVarLate, t)` |
| Yükseklik rise/drop minimum büyüklüğü | 100 | 100 (değişmedi) | — | aynı satır |

Güvenlik: her iki değer de mevcut, DEĞİŞMEYEN erişilebilirlik kelepçesi (`safeMax = min(gMax, reachableGap)`, gerçek `jumpVelocity`/`flightGravity` ile hesaplanır) tarafından hâlâ sınırlanıyor — yeni tavan yalnız "daha büyük TEKLİF edilebilir" demek, "garanti aşılır" değil. Node ile gerçek kod çalıştırılarak doğrulandı (60 platformluk simülasyon): geç-oyun (id>40) gap aralığı 114.3–339.9 (tavan fiilen ulaşılıyor), yükseklik farkı aralığı -216.8..+139.5.

İlk iniş hâlâ öğrenilebilir: `warmupTowers=3` ve `noNarrowBeforeId=6` dokunulmadı — ilk 3 kule hâlâ yalnız geniş/orta genişlikte, kısa boşluklu (`gapEarly.min`–`warmupGapMax`=110–260), dar (cat=2/short) varyant 6. platforma kadar hiç çıkmıyor.

Kamera: `cameraAnchorMin` 0.31→**0.35**, `cameraAnchorMax` 0.31→**0.42** (oyuncu artık x=%35–%42 bandında, önceden ikisi eşitti/sabitti). `cameraSmoothingX` 1(anlık)→**0.18** (yumuşak takip).

Web önizlemede (390×844) 8 gerçek başarılı iniş boyunca doğrulandı — bkz. AI_REVIEW.md 2026-09-22g.

TESLIM_HAZIR: GORSEL-014 / OYUN_AKISI-001 Spring Ninja dönüşümü — app/index.tsx + src/game/config.ts + src/game/procedural-course.ts (kamera x=%35-42 bandı + yumuşak takip, arka plan parallax, gerçek çatı-baca platform sanatı, gap/height zorluk tavanları yükseltildi — bkz. tablo yukarıda), rapor AI_REVIEW.md 2026-09-22g; iPhone cihaz kabulü hâlâ gerekli.

## OYUN_AKISI-002 / GORSEL-015 — ortak zemine köklenme, kamera dead-zone, sayısal tablolar — 2026-09-22

### Asset kapak Y ↔ fizik Y eşlemesi
Fiziksel platform Y'si artık BAĞIMSIZ örneklenmiyor; seçilen asset (cat: 0=uzun,1=orta,2=kısa) ve genişliğinden TÜRETİLİYOR. Her asset kendi TABANIYLA ortak `ROOFTOP_GROUND_Y=150` (dünya birimi) üzerinde duruyor; kapağı bu tabandan `(h-capTopPx)*scale` kadar yukarıda, `scale=width/capWidthPx`.

| cat | varyant | h (px) | capWidthPx | genişlik aralığı | topY min | topY max |
|---|---|---|---|---|---|---|
| 0 | uzun | 756 | 223 | 76-96 (widthWide) | -174.0 | -112.3 |
| 1 | orta | 556 | 225 | 56-68 (widthMedium) | -16.6 | 12.1 |
| 2 | kısa | 408 | 224 | 38-46 (widthNarrow) | 70.0 | 80.6 |

(60 platformluk gerçek-kod simülasyonundan ölçüldü; `outputs/gorsel-014-rooftop-platforms/rooftop-measured.json` ile aynı ölçüm tablosu, artık `procedural-course.ts`'de `ROOFTOP_ASSET_GEOMETRY` olarak TEK kaynak.) Web DOM'da (390×844) kapak-üst ekran Y'si ile fiziksel `towerCap` referansı arasındaki fark 7 örnekte ≤0.43px (alt-piksel yuvarlama).

### Erişilebilirlik tablosu (tam şarj, en kötü durum genişlik kombinasyonu, gerçek `jump.ts` ile hesaplandı)
| Geçiş | En kötü reachableGap (world birim) |
|---|---|
| uzun→uzun | 644.7 |
| uzun→orta | 712.2 |
| uzun→kısa | 749.0 |
| orta→uzun | 618.5 |
| orta→orta | 690.6 |
| orta→kısa | 729.4 |
| kısa→uzun | 604.9 |
| kısa→orta | 682.7 |
| kısa→kısa | 723.6 |

Tüm 9 geçiş pozitif ve gerçek gap tavanının (340, geç oyun) çok üzerinde — hiçbir geçiş fiziksel olarak imkânsız değil.

### Kamera — dead-zone eşiği/yumuşatma
`cameraDeadZoneRight=0.64`: oyuncu ekranın solundaki her yerde SERBEST (kamera tepki vermiyor); yalnız oyuncunun ekran kesri 0.64'ü aşacağı an kamera `deadZoneX = px - 0.64*W/s` hedefine `cameraSmoothingX=0.18` ile yumuşak yaklaşıyor. `cameraStartFraction=0.42` yalnız oyun başlangıcı/yeniden başlatma anındaki TEK SEFERLİK kare için kullanılıyor. Eski `cameraAnchorMin/Max/cameraRevealRight` (NEXT/NEXT+1 kule bakışı, her karede platform havuzunu tarıyordu, kimlik değişiminde ani hedef sıçraması riski taşıyordu) tamamen kaldırıldı.

### Performans ölçümü (web, 390×844, 36 zıplama denemesi — 22 başarılı iniş)
`frame p50/p95`: 16.7ms / 17.4-18.2ms aralığında kaldı (60Hz bütçesi ~16.7ms). `dropped` (>25ms kare) sayacı 2'de sabit kaldı (yalnız ilk sayfa yüklemesinden, 36 zıplama boyunca YENİ düşme eklenmedi). Bu web/masaüstü ölçümüdür, gerçek iPhone performansını temsil etmez — panel `DEBUG_MODE` altında, varsayılan KAPALI.

**Gerçek iPhone testi yapılmadı.** Bu satırlar yalnız web önizleme ölçümleridir.

TESLIM_HAZIR: OYUN_AKISI-002 / GORSEL-015 ortak zemine köklenme + dead-zone kamera — app/index.tsx + src/game/config.ts + src/game/procedural-course.ts (platform Y artık asset kapak seviyesinden türetiliyor, kamera dead-zone modeli, 2 katmanlı gerçek paralaks, debug-only p50/p95/dropped sayaçları — tüm tablolar/ölçümler yukarıda), rapor AI_REVIEW.md 2026-09-22h. Web görsel kanıt + ölçümler mevcut (22/36 başarılı iniş, kapak hizası ≤0.43px, erişilebilirlik tablosu 9/9 pozitif, perf p95≤18.2ms). Gerçek iPhone testi YAPILMADI — kullanıcı kabulü bu satırda iddia edilmiyor, cihaz onayı bekliyor.

## OYUN_AKISI-002 düzeltme turu — "BG_OVERSCAN is not defined" incelemesi — 2026-09-22

Kod tabanında düzeltilecek gerçek bir hata YOKTU. `BG_OVERSCAN` hiçbir kaynak dosyada yok (OYUN_AKISI-002 sırasında `BG_FAR_OVERSCAN` olarak yeniden adlandırılmış, geçiş tamamlanmış ve final teslimde zaten doğrulanmıştı). Kullanıcının gördüğü hata, bu chat oturumunun paylaşılan tarayıcı sekmelerinden birinin ESKİ/ARA bir koddan kalan önbelleklenmiş konsol kaydıydı. 7 sekmenin tamamı yeniden yüklendi, ekran görüntüsüyle hatasız çalıştığı doğrulandı; bundle içeriği fetch ile bağımsız olarak kontrol edildi (güncel semboller var, eski semboller yok). Kısa bir test uçuşunda iki arka plan katmanı (uzak %6, yakın %32 oranında, ayarlanan değerlerle birebir) doğru çalıştığı ölçüldü. `tsc`/`expo export --platform ios` tekrar çalıştırıldı, ikisi de başarılı. Kapsam SHA-256: bu turda hiçbir dosya değişmedi.

TESLIM_HAZIR: OYUN_AKISI-002 hata incelemesi (BG_OVERSCAN) — kod değişmedi, 7/7 sekme hatasız doğrulandı (ekran görüntüsü + bağımsız bundle fetch), iki arka plan katmanı ölçülen oranlarla (0.06/0.32) doğru çalışıyor, rapor AI_REVIEW.md 2026-09-22i. GORSEL-015'in fizik/kamera/asset/tasarımı bu turda değişmedi. Gerçek iPhone testi hâlâ yapılmadı.

## GORSEL-015 iPhone reddi — GÖRÜNÜR ROTA + GERÇEK ÇATI TABANI düzeltmesi — 2026-09-22

Önceki "GORSEL-015 tamam" sonucu bu kararla GEÇERSİZ sayılıyor. Kullanıcının ekran kanıtıyla bildirdiği iki somut regresyon (hedef görünmüyor / baca tabanları havada) birlikte kök nedenine inilip düzeltildi:

1. **GÖRÜNÜR ROTA:** Kamera-Y'nin kare döngüsündeki takip hedefi (`focusY`) yanlışlıkla sabit `0`'a kilitliydi, o an durulan platformun gerçek yüksekliğini (`baseY.value`) hiç okumuyordu — `baseY.value`'ya düzeltildi. Ayrıca başlangıç platformu ve ondan sonraki ilk iki üretilen kule artık "uzun" (cat 0) olamıyor, yalnız orta boy (kullanıcının "uzun varyantı başlangıçta kullanma" talimatı).
2. **GERÇEK ÇATI TABANI:** Eski arka plan "near" katmanı ekran-uzayında sabitliydi, kamera Y'siyle hiç hareket etmiyordu — bu yüzden baca tabanları bazen banda gömülü bazen boşlukta kalıyordu. Yerine, platformlarla AYNI kamera dönüşümünü paylaşan, dünya-uzayında `ROOFTOP_GROUND_Y`'yi (her assetin tabanının cebirsel olarak TAM oturduğu ortak dünya-Y) kapsayan opak bir "ground band" eklendi — örtüşme artık tesadüfi değil, matematiksel garanti.

Doğrulama: web 390×844'te başlangıç ekranı + 4 ardışık başarılı iniş (kısa→orta→orta→**uzun**) ekran görüntüleriyle kanıtlandı; uzun platforma inişte bile karakter ekranın üst kenarına itilmiyor (eski regresyonun tam tersi davranış gözlendi). `tsc`/eslint (26 hata, sabit baseline) /`expo export --platform ios` temiz. Tam detay ve ekran görüntüsü kanıtları: AI_REVIEW.md 2026-09-22j.

**Gerçek iPhone testi bu turda YAPILMADI, kullanıcı talimatı gereği TESLIM_HAZIR eklenmiyor.** Cihaz kabulü bekleniyor.

## GORSEL-016 / OYUN_AKISI-003 — yeni Bosphorus arka planı + Spring Ninja karakter kalibrasyonu — 2026-09-23

Yeni onaylı gündüz arka planı (`bosphorus-rooftop-day-master-v1.png`) devreye alındı, eski `istanbul-parallax-portrait-v1.png` bu turda kullanılmadı. Karakter, Spring Ninja'nın UZUN referans videosundan (`ScreenRecording_09-12-2026 17-48-03_1.MP4`, 1320×2868) gerçekten ölçülerek küçültüldü: iki idle karede ayak(yay tabanı)-baş oranı ~%7.0 ölçüldü, `GLOBAL_VISUAL_SCALE` 0.92→0.42'ye indirildi (yalnız render, foot pivot/collision dokunulmadı). Duman sistemi bu turda dokunulmadı (GORSEL-017'de tamamen kaldırıldı, aşağı bakın). Detay ve ölçüm tablosu: AI_REVIEW.md GORSEL-016 bölümü (not: bu bölüm GORSEL-017 talebiyle kesintiye uğradığı için AI_REVIEW.md'ye ayrı yazılmadı, ölçümler bu satırda ve kod yorumlarında (character-pose.ts) kayıtlı).

**Gerçek iPhone testi YAPILMADI. Kullanıcı talimatıyla bu adım GORSEL-017 tarafından hemen takip edildi, TESLIM_HAZIR eklenmedi.**

## GORSEL-017 / OYUN_AKISI-004 — panel tabanlı İstanbul çatı sahnesi (panel-01..04) — 2026-09-23

Önceki ayrı-render edilen kolon/pillar sistemi (rooftop-{short,medium,long}-v1.png + prosedürel kule üretimi) bu teslimde TAMAMEN devre dışı (kod silinmedi, `USE_FIXED_PANEL_COURSE` bayrağıyla kapatıldı). Yerine, kullanıcı onaylı 8 panelden panel-01..04 kullanılarak SABİT, tekrar etmeyen 11 platformluk bir rota kuruldu (`src/game/panel-course.ts`) — her platform, panellerin kendi boyalı krem baca kapaklarından biri; ayrı çizilen/havada duran asset yok. panel-05..08 kopyalandı (`assets/environment/gorsel-017/`) ama hiçbir kodda `require()` edilmiyor — sonraki bölüm için hazır, bu turun kapsamı dışında.

**Ölçüm yöntemi:** her panelin 941×1671 pikselini grid-crop'layıp gözle okuyarak 3'er bacanın krem tabla piksel sınırları çıkarıldı (AI_REVIEW.md'de tam tablo). Tüm tablalar TEK standart collision genişliğine (`STANDARD_TABLA_WIDTH=64` dünya birimi) eşlendi — görsel genişlik pikselden değil, karakterin yeni ayak açıklığıyla (%55-65 hedefi) BİRLİKTE seçildi.

**Karakter:** `GLOBAL_VISUAL_SCALE=0.6625` — canlı DOM ölçümüyle doğrulandı: idle boy = ekranın **%11.0**'i (hedef %10-12 ✓), ayak açıklığı/tabla oranı hesapla **%57.5** (hedef %55-65 ✓). Fiziksel foot pivot, collision, jump/landing formülleri, footSoles, kamera formülü, procedural reachability formülü DOKUNULMADI.

**Rota seçimi ve görünürlük:** panel-01'in 3. bacası (P2'nin ilk bacasına 475 birimlik bir düşüşle bağlanacaktı) kapsam dışı bırakıldı — kamera-anchor matematiğiyle hesaplanan hedef ekran-Y'si 844'ü aşıyordu (ekran dışı hedef regresyonu). Kalan 11 geçişin TÜMÜ için hedef ekran-Y'si [309,779] aralığında (390×844 içinde, güvenli marj) VE gerekli şarj [0.08,0.884] aralığında (c=1 tavanının altında, güvenli marj) — hem görünürlük hem erişilebilirlik matematiksel olarak doğrulandı, canlı testte de 10/10 ardışık başarılı iniş elde edildi.

**Bilinen sınırlama (şeffafça belirtiliyor):** kilitli kamera-anchor formülü + kilitli jump fiziği + panel resimlerinin SINIRLI (sonsuz olmayan) dikey kapsamı birlikte, HER ölçek değerinde sıfır-boşluk garantisi vermiyor (matematiksel olarak kanıtlandı — bkz. AI_REVIEW.md). Panellerin kendi ortalama gökyüzü/çatı tonundan örneklenen iki düz-renk güvenlik şeridi (üstte/altta, her panelin dünya-uzay konumunda) eklendi; canlı testte yalnız başlangıç bacasında (P1-C, panelin alt kısmına yakın) altta ince bir kahverengi şerit görülüyor — kırmızı/bozuk bir fallback değil, panelin kendi ortalama çatı rengiyle örtüşen bir dolgu.

**Duman:** `ColumnSmokeBack/Front`, `ColumnSmokeMountProbe`, `useColumnSmokeClock` çağrıları ve her zaman görünen "[smoke-debug]" paneli tamamen kaldırıldı (kod dosyası silinmedi, sadece render/tetikleme yok).

**İniş sıkışması:** `landPulse` artık `ChargePoses`'a bağlı — 35ms sıkışma + 75ms hafif yukarı toparlanma + 80ms yerleşme (toplam 190ms), yalnız görsel `scaleY/scaleX`, fiziksel py/vx/vy'ye dokunmuyor.

**Doğrulama:** `tsc` temiz (yalnız önceden var olan theme.ts hataları), `eslint` 24 hata (baseline'dan DÜŞÜK — duman kaldırma bazı worklet-mutasyon uyarılarını da götürdü), `expo export --platform ios` başarılı. Web 390×844'te başlangıç + düşük (P3-C) + orta (P2-A) + yüksek (P1-A) iniş ekran görüntüleri alındı, tam 10 ardışık başarılı iniş bir turda kanıtlandı.

**iPhone'da kullanıcının bakması gereken üç nokta:**
1. Panel geçiş dikişleri (panel-01→02→03→04 arası dikey bir çizgi/hafif ton farkı) gerçek cihazda ne kadar göze batıyor.
2. P1-C'nin (başlangıç bacası) altındaki ince kahverengi güvenlik şeridi gerçek cihazda "kırık" mı yoksa "kabul edilebilir" mi okunuyor.
3. Karakterin yeni küçük boyu ve iniş sıkışma animasyonu gerçek dokunmatik/60Hz hissi ile birlikte nasıl hissettiriyor (web synthetic-press testinde ölçülemeyen bir şey).

**Gerçek iPhone testi bu turda YAPILMADI. Kullanıcı talimatı gereği TESLIM_HAZIR eklenmedi.** Commit/push/deploy/PR yapılmadı; ilgisiz hiçbir değişiklik sahiplenilmedi/silinmedi.

## GORSEL-017 HOTFIX-01 — çizim-iniş hizası + debug temizliği — 2026-09-23

Kullanıcının gerçek iPhone ekran kanıtındaki üç somut hata düzeltildi. Fizik/jump/footSoles/collision/kamera/R12 dokunulmadı -- yalnız çizim-hizalama verisi ve debug-görünürlük kapıları değişti.

1. **Karakter tabla merkezinde durmuyordu:** 11 bacanın piksel ölçümleri (panel-course.ts) baştan, gerçek RGB piksel geçişleriyle (gözle ızgara okuma değil) yeniden yapıldı -- eski ölçüm bacanın açılı 3D üst yüzü ile gölgeli ön yüzünü karıştırıyordu. En büyük düzeltme ~29 ekran-px (P3-B). Spawn'da (fizik varyansı yok) yeni hizalama 3.2 ekran-px içinde (hedef ±2px'e çok yakın). İniş-sonrası hizalama doğal atış hassasiyetine göre değişir (mevcut collision toleransı dahilinde, bu hotfix'in dokunmadığı bir alan).
2. **İnce dikey sınır/dolgu çizgileri:** panel dışı dolgu artık düz renk değil, panelin kendi gerçek kenar piksellerinden örneklenmiş, dikişsiz bir görsel; panel-panel arası alt-piksel yuvarlama boşluğu 2 birimlik örtüşmeyle kapatıldı.
3. **Debug overlay'ler DEBUG_MODE kapalıyken görünüyordu:** charge-yüzde kutuları, "Son basış" telemetrisi ve art-timing paneli `__DEV__` yerine artık `DEBUG_MODE && __DEV__`'e bağlı -- `__DEV__` her dev-client/Expo-Go derlemesinde (gerçek iPhone dahil) daima `true` olduğu için bunlar cihazda hep görünüyordu.

Doğrulama: `tsc` temiz, `eslint` 24 hata (baseline, regresyon yok), `expo export --platform ios` başarılı, web 390×844'te `DEBUG_MODE=false` iken 4 temiz ekran görüntüsü (başlangıç + düşük/orta/yüksek iniş, debug overlay yok). Tam 11-nokta piksel-fark tablosu ve yöntem: AI_REVIEW.md HOTFIX-01 bölümü.

**Gerçek iPhone testi bu turda YAPILMADI. Kullanıcı talimatı gereği TESLIM_HAZIR eklenmedi.** Commit/push/deploy/PR yapılmadı.

## GORSEL-017 ROLLBACK-01 — panel entegrasyonu varsayılan akıştan çıkarıldı (acil kurtarma) — 2026-09-23

Kullanıcının HOTFIX-01 sonrası çektiği yeni bir gerçek iPhone videosu, panel entegrasyonunun (GORSEL-017 ve HOTFIX-01) cihazda hâlâ bozuk olduğunu kanıtladı: başlangıçta uzun gri yükleme alanı, alt bölgede dikey renkli ezilme şeritleri, okunur hedef olmadan dekor içine düşme, 0 skorla hızlı game over — GORSEL-017 öncesi durumdan DAHA kötü. Bu, hotfix ile yamanacak bir durum değil; **panel entegrasyonu tamamen varsayılan akıştan çıkarıldı.**

**Ne yapıldı:** `app/index.tsx`'teki tek bayrak, `USE_FIXED_PANEL_COURSE`, `true`'dan `false`'a çevrildi. Bu, oyunu GORSEL-017'den ÖNCEKİ son çalışan duruma (GORSEL-016: yeni Bosphorus arka planı + küçültülmüş Spring-Ninja karakteri + prosedürel/reference course + eski rooftop-chimney render sistemi) geri döndürüyor. Ayrıca GORSEL-017'de eklenen iniş-sıkışma (landing squash) animasyonu da devre dışı bırakıldı (`ChargePoses`'a `landPulse` artık geçirilmiyor) — "önce temel oyun güvenilir olsun" talimatı gereği.

**Ne SİLİNMEDİ:** panel-01..08 görselleri, `src/game/panel-course.ts`, `assets/environment/gorsel-017/edges/` kenar-şeridi görselleri, app/index.tsx'teki panel render/collision dallanması — hepsi kodda DURUYOR, sadece `USE_FIXED_PANEL_COURSE=false` olduğu için hiçbiri çalışmıyor. Görsel/collision mimarisi gerçek cihazda yeniden tasarlanıp kanıtlanana kadar bu bayrak `true` yapılmamalı.

**Fizik/charge/collision/footSoles/procedural-course/kamera/R12'ye YENİ bir değişiklik yapılmadı** — yalnız GORSEL-017'nin kendi eklediği iki şey (panel entegrasyonu ve landing squash) geri alındı.

Doğrulama (web 390×844, `DEBUG_MODE=false`): başlangıç ekranı temiz (gri yükleme yok, dikey şerit yok), 3 ardışık başarılı atlayış, bir game-over ve "Play Again" ile restart — hepsi eski prosedürel akışta sorunsuz. `tsc` temiz, `eslint` 24 hata (baseline, regresyon yok), `expo export --platform ios` başarılı.

**Değişen dosyalar:** `app/index.tsx` (`USE_FIXED_PANEL_COURSE = false`, `landPulse` prop kaldırıldı — ikisi de tek satırlık, cerrahi değişiklik).

**iPhone'da kullanıcının bakması gereken iki nokta:**
1. Başlangıç ekranının artık gri yükleme alanı veya dikey renk şeridi GÖSTERMEDİĞİ, doğrudan eski Bosphorus arka planı + çatı sahnesiyle açıldığı.
2. Birkaç atlayışın normal şekilde çalıştığı (hedefin okunur olduğu, dekor içine düşme olmadığı) ve bir game-over sonrası "Play Again"in oyunu düzgün yeniden başlattığı.

**Gerçek iPhone testi bu turda YAPILMADI. Kullanıcı talimatı gereği TESLIM_HAZIR eklenmedi ve kabul iddiasında bulunulmuyor.** Commit/push/deploy/PR yapılmadı; `git reset`/`checkout .`/stash temizliği yapılmadı, önceki görevlerin alakasız değişiklikleri geri alınmadı.

## ACIL KURTARMA-02 — çelişki: ROLLBACK-01 bayrağı yeterli değildi, gerçek kök neden bulundu — 2026-09-23

**Çelişki:** ROLLBACK-01, `USE_FIXED_PANEL_COURSE=false` yaparak "son çalışan GORSEL-016 durumuna dönüldüğünü" iddia etmişti. Kullanıcının YENİ bir gerçek iPhone kaydı bunun YANLIŞ olduğunu kanıtladı: ilk ~20 saniye ekranın büyük kısmını kaplayan düz kahverengi boş alan, çatıların yalnızca ekranın altında dar bir şeritte belirmesi, hedefin geç/düzensiz görünmesi. **Sebep:** ROLLBACK-01 yalnızca panel bayrağını kontrol etti, aktif render ağacını satır satır incelemedi. `USE_FIXED_PANEL_COURSE=false` olduğunda AÇILAN GORSEL-015/016 kodu (ground-band + near-image tiles) kendisi bozuktu — bu bug GORSEL-017'den ÖNCE, GORSEL-016 arka planı değiştirildiğinde girmiş ve hiç tam ekran görüntüsüyle doğrulanmamıştı (o doğrulama GORSEL-017 talebiyle kesintiye uğramıştı). Yani rollback'in döndüğü "son çalışan durum" aslında hiç doğrulanmamış, baştan bozuk bir durumdu.

**Gerçek kök neden (render ağacı okunarak bulundu, tahmin edilmedi):** `groundBandStyle` (düz terracotta degrade dikdörtgen) dünya-Y=-650'de başlıyor, bu da başlangıç platformunun yüksekliğinde ekranın yalnızca ~%19 aşağısına denk geliyor — ekranın geri kalan ~%81'i ya bu düz renk ya da onu KISMEN örten near-image tile'ları (bandın 3800 birimlik yüksekliğinin yalnızca 229 birimini kaplıyorlar). Dünya-container'ın çocukları (ground band dahil) ekran-uzayındaki TEK arka plan katmanının (bgFarStyle, İstanbul silüetini içeren) ÜSTÜNE çiziliyor — yani silüet oradaydı, sadece kahverengi bant onu görsel olarak KAPATIYORDU. Ayrıca aynı arka plan görseli (MASTER_NEIGHBORHOOD_SOURCE) 9 KEZ (1 far + 8 near-tile) aynı anda render ediliyordu ("çoklu arka plan kopyası").

**Düzeltme:** `app/index.tsx`'te ground-band + near-image tile render bloğu `{false && (...)}` ile kapatıldı (silinmedi). Artık varsayılan akışta TEK arka plan katmanı var: `bgFarStyle` (tüm sahneyi tek, cover-fit bir görüntü olarak gösteren, kamera-Y'den bağımsız, sabit konumlu katman) — silüet/deniz her zaman ekranın üst-orta kısmında, çatılar alt bölgede doğal olarak.

**Bilinen, bu turun kapsamı dışında tavizi:** rooftop-chimney sprite'ları artık ayrı bir "ortak zemin" dokusuna gömülü değil (o zemin GORSEL-015'te tam bu amaçla eklenmişti) — bacalar artık kendi asset'lerindeki çatı dokusuyla deniz üzerinde duruyor gibi görünebilir. Bu, "önce kurtarma, yeni tasarım yok" önceliği gereği kabul edilen, şeffafça belirtilen bir taviz; collision/kamera/fizik davranışını DEĞİŞTİRMİYOR.

Doğrulama: web 390×844, `DEBUG_MODE=false`, TAZE bir sekmede (paylaşılan sekmenin konsol arabelleği eski "React is not defined" kalıntısı gösteriyordu — GERÇEK değil, bu oturumun daha önce belgelenen önbellek artefaktı): temiz başlangıç (silüet görünür, kahverengi boşluk yok), 3 ardışık başarılı iniş, bir game-over ve "Play Again" restart — hepsi temiz. `tsc` temiz, `eslint` 24 hata (baseline), `expo export --platform ios` başarılı.

**Değişen dosya:** yalnız `app/index.tsx` (ground-band/near-tile render koşulu `{false && (...)}`'a çevrildi; kod satırları silinmedi).

**iPhone'da kullanıcının bakması gereken iki nokta:**
1. Başlangıç ekranında İstanbul/Bosphorus silüetinin (Galata Kulesi, camiler) SÜREKLİ görünür olduğu, altında geniş düz kahverengi bir alan OLMADIĞI.
2. Baca/çatı platformlarının artık suyun üzerinde biraz "asılı" görünebileceği (bu turun bilinçli, bildirilen tavizi) ama hedefin her zaman okunur ve atlanabilir olduğu.

**Gerçek iPhone testi bu turda YAPILMADI, kullanıcı doğrulaması olmadan kabul iddiası yapılmıyor.** TESLIM_HAZIR eklenmedi. Commit/push/deploy yapılmadı; yeni görsel/oyun tasarımı denemesi yapılmadı.

## GORSEL-016 KONTROLLÜ GÖRSEL SABİTLEME — bacalar çatı/ev kütlesine bağlandı — 2026-09-23

ACIL KURTARMA-02'nin bıraktığı tek görsel eksik (bacaların deniz üzerinde küçük kopuk çatı parçaları gibi durması) düzeltildi. Her aktif collision bacanın ARKASINA, aynı x konumunda, `pointerEvents="none"` tek bir dikdörtgen "ev gövdesi" eklendi (`PlatformView` içinde, yeni `houseSupportStyle`) — baca kendi asset'inin bittiği yerden (`p.topY + (asset.h-asset.capTopPx)*scale`, rooftop sprite'ının zaten kullandığı AYNI ölçek formülü) başlayıp aşağı doğru 700 dünya birimi uzanıyor, böylece her kamera durumunda ekranın altına taşıyor ve yeni bir dikiş göstermiyor. Renk: `colors.platform`→`colors.platformShade` degrade (bacaların kendi terracotta tonu, yeni asset yok).

**Neden yeniden büyük bir "ground band" değil:** ACIL KURTARMA-02'nin düzelttiği bug tam olarak buydu (tek, ekranın çoğunu kaplayan düz bant). Bu sefer destek PER-PLATFORM (yalnız `p.width*1.7` genişliğinde, platformun kendisiyle birlikte havuzdan geri dönüştürülüyor) — asla tam ekran genişliğinde tek bir şerit olmuyor, İstanbul silüeti/deniz her zaman üst-orta bölgede açık kalıyor.

**Dokunulmayan:** charge, fizik, collision, footSoles, procedural course, kamera, jump matematiği, platform x/y/width değerleri, R12 assetleri. Destek objesi hiçbir yerde collision/kamera/hedef ölçümü için okunmuyor -- yalnız `platforms.value[index]`'in zaten var olan x/topY/width/cat alanlarını okuyup çiziyor.

Doğrulama: web 390×844, `DEBUG_MODE=false` (kısa bir süre Game Over'ı güvenilir tetiklemek için `true` yapılıp geri döndürüldü, `grep` ile doğrulandı). Başlangıç + score 1 + score 3 ekran görüntülerinde silüet sürekli görünür, sıradaki hedef okunur, her baca altı kendi ev gövdesine bağlı. 3 ardışık başarılı iniş + game-over + "Play Again" restart temiz. `tsc` temiz, `eslint` 24 hata (baseline), `expo export --platform ios` başarılı.

**Değişen dosya:** yalnız `app/index.tsx` (`PlatformView` içine `houseSupportStyle` + `styles.houseSupport` + `HOUSE_SUPPORT_HEIGHT` sabiti eklendi; `PlatformView`'a `useTheme()` çağrısı eklendi).

**Gerçek iPhone testi bu turda YAPILMADI, kullanıcı doğrulaması olmadan kabul iddiası yapılmıyor.** TESLIM_HAZIR eklenmedi. Commit/push/deploy yapılmadı.

## RED — GORSEL-016 KONTROLLU GORSEL SABITLEME REDDEDILDI, geri alindi — 2026-09-23

Bir onceki teslim (yukaridaki "GORSEL-016 KONTROLLU GORSEL SABITLEME" bolumu) kullanicinin bagimsiz 390x844 browser denetiminde REDDEDILDI: `houseSupportStyle`'in urettigi sekil ev/cati gibi degil, her bacanin altinda duz kahverengi genis bir dikdortgen olarak gorundu. Kullanici yeni bir gorsel deneme ISTEMEDI, yalniz geri alma istedi.

**Yapilan:** `houseSupportStyle`, `HOUSE_SUPPORT_HEIGHT` sabiti, ona bagli `Animated.View`/`LinearGradient` JSX'i, `styles.houseSupport` ve `PlatformView`'a eklenen `useTheme()` cagrisi TAMAMEN kaldirildi. `app/index.tsx` simdi tam olarak ACIL KURTARMA-02 sonrasindaki (bu teslimden onceki) haline dondu: tek Bosphorus arka plan katmani (`bgFarStyle`), surekli gorunur siluet, yalniz mevcut `rooftop-{long,medium,short}-v1.png` baca/cati sprite'lari -- per-platform duz destek veya kahverengi alan yok.

**Dokunulmayan (bu turda da):** charge, fizik, collision, footSoles, procedural course, kamera, jump matematigi, platform koordinatlari, R12 assetleri. GORSEL-017 panel/edge-strip/ground-band/tekrar-arka-plan kodu hala kapali (silinmedi, yalniz render edilmiyor) -- bu turda da geri getirilmedi.

Dogrulama: web 390x844, TAZE sekmede, `DEBUG_MODE=false` -- baslangic ekran goruntusu ACIL KURTARMA-02'nin kabul edilen gorunumuyle birebir esleşiyor (siluet ust-ortada, bacalar kendi sprite'lariyla, kahverengi dikdortgen yok). `tsc` temiz, `eslint` 24 hata (baseline), `expo export --platform ios` basarili.

**Degisen dosya:** yalniz `app/index.tsx` (onceki turun ekledigi kod kaldirildi, net satir sayisi onceki teslimden ONCEKI haline dondu).

**Gercek iPhone testi bu turda YAPILMADI, kullanici dogrulamasi olmadan kabul iddiasi yapilmiyor.** TESLIM_HAZIR eklenmedi. Commit/push/deploy yapilmadi.

## Gorsel prova: cephe assetiyle ev govdesi (yalniz 1. ve 2. platform) - 2026-09-24

ACIL KURTARMA-02 oynanisi kilitli. Kullanicinin verdigi seffaf cephe PNG'si `assets/environment/facade/facade-v1.png` yoluna kopyalandi ve YALNIZ `p.id <= 1` (baslangic + ilk sonraki hedef) platformlarinin mevcut rooftop sprite'inin ALTINA cizildi (sprite'in arkasinda, pointerEvents none). Gradient/dikdortgen/CSS destek yok. Fizik, collision, footSoles, procedural uretim, platform koordinatlari, kamera, jump/charge, R12, arka plan katmanlari, GORSEL-017 ve duman DEGISMEDI.
Hizalama: cephe kornis genisligi = sprite'in opak taban genisligi; merkezler ayni x; kornis ust kenari sprite'in son opak satirinin ~0.3px (1.5 sprite-px) ustune biniyor, sprite'in ARKASINDA kalir (yukari tasma/ortme yok). DOM olcumu (390x844, DEBUG kapali): 1. platform cephe merkezi 249.3 = sprite taban merkezi 249.3; kornis ust 668.2 vs sprite opak alt 668.35.
Dogrulama: tsc temiz (yalniz onceden var olan theme.ts), eslint 24 (baseline), iOS export basarili, baslangic ekrani iki platformda cephe gorunuyor. Gercek iPhone testi YAPILMADI, kabul iddiasi yok. Commit/push/deploy yok.

## GORSEL-018 duzeltme: cephe her gorunen platformun altinda - 2026-09-24

Red nedeni: cephe yalniz p.id<=1 ve pool index<2 ile sinirliydi. Kapi kaldirildi; `facade-v1.png` artik her platformun mevcut rooftop sprite'inin arkasinda, sprite'in opak taban genisligi/merkezine gore olceklenerek cizilir (yuksek/uzun bacada sprite'in kendi olcegiyle daha uzun, dar/kisa olanda daha kisa; medium ~200-238 px, long ~278 px, ekranin yarisindan az). Gradient/CSS dikdortgen/yeni zemin yok; oynanis, fizik, collision, footSoles, procedural x-y, kamera, jump/charge, R12, arka plan, GORSEL-017, duman degismedi.
Dogrulama (390x844, DEBUG kapali, DOM): olculen 7 platform (medium x6, long x1): yatay merkez farki <=0.6 px, korniş ust kenari sprite'in son opak satirinin 0.23-0.32 px ustunde (sprite arkasinda gizli). Short varyanti bu oturumda uretilmedi (ilk 6 platformda cikmiyor), ayni formul kullaniliyor. tsc yalniz onceden var olan theme.ts, eslint 24 (baseline), iOS export basarili. iPhone kabulu yok. Commit/push/deploy yok.

## GORSEL-018 tum-cephe entegrasyonu RED, geri alindi - 2026-09-24

Cephe render'i tamamen kaldirildi (`app/index.tsx`: facade sabitleri, `facadeStyle`, platform basina facade Image ve kosullari). Oyun ACIL KURTARMA-02 gorunumune dondu. `assets/environment/facade/facade-v1.png` SILINMEDI, taslak icin duruyor. Fizik/collision/footSoles/procedural x-y/kamera/jump-charge/R12/arka plan degismedi; yeni oyun entegrasyonu yapilmadi.
Onay icin proje disi STATIK taslak (kod degil): `~/Documents/Codex/carsamba-taslak/taslak-390x844.png` (+@2x). Ust: Bosphorus silueti; alt dortte bir: birbirine bagli alcak cati/ev dokusu; bacalar (mevcut rooftop sprite'lari) cati dokusunun icinden yukseliyor, ayri ev kulesi yok; karakter ilk bacada. tsc yalniz onceden var olan theme.ts, iOS export basarili. iPhone kabulu yok. Commit/push/deploy yok.

## GORSEL-020 RooftopDistrict (uygulama) - 2026-09-24

ACIL KURTARMA-02 uzerine tek, dekoratif, dunya-uzayinda RooftopDistrict katmani: `assets/environment/district/rooftop-district-v1.png` (1024x311 RGBA, GORSEL-019 referansinin alt cati bandindan, ayna-tekrarli => dikissiz). `app/index.tsx`: DISTRICT_* sabitleri, districtStyle0/1 (camX'e gore floor tile), world container'da platform sprite'lari USTUNDE / karakter ALTINDA 2 Animated.View. Kamera donusumuyle 1:1 (parallax yok); tile'lar camX'e gore yeniden konumlanir => sinirsiz (100+ atlayis). Cati cizgisi dunya Y=92 (en yuksek inis kapagi ~80.6'nin altinda: inis yuzeyi hicbir zaman ortulmez); bacanin kendi kiremit/tugla tabani district icinde gizlenir, govde+kapak catidan cikar. Gradient/CSS/yeni zemin/cephe yok. Fizik/collision/footSoles/procedural/kamera/jump-charge/R12/arka plan/GORSEL-017/duman degismedi.
Kanit: `~/Documents/Codex/carsamba-gorsel020/baseline-yanyana.png` (once) ve `district-yanyana.png` (sonra; baslangic, skor 4 orta, skor 9 uzun-baca-goren 390x844, ayni teknik/Playwright+Chrome). Gorsel denetim: gorunen tum baca govdeleri catidan cikiyor; su ustunde asili ada/kule yok. Bilinen: district icinde referanstan kalan kisa baca kutukleri oyun bacasi gibi okunabilir; ayna simetrisi hafif tekrar (kediler); sadece alt bant, uzun bacalar catiyi fazla asar (govde cati ustunde uzun). FPS (Chrome headless, 300 kare): p50/p95 16.7ms, dusen kare 0, district ac/kapali ayni. tsc yalniz onceden var theme.ts, eslint 24, iOS export basarili. iPhone kabulu yok.

## GORSEL-020 duzeltme (2 kusur) - 2026-09-24

(1) rooftop-district-v1 yeniden uretildi: referans x440-853, y1592-1844 kirpimi (dekor baca, kedi, hali, tekrarli motif yok; yalniz kiremit cati, ev cephesi, pencere/camasir), ayna-cift 826x252. (2) Alt gerilmis serit kaldirildi: asset dogal oraninda render (esnetme yok), DISTRICT_SCALE 1.9 ile 252px = 479 dunya birimi (kisa bacada bile ekran altini kapsar). RooftopDistrict world-Y (92), 1:1 kamera, tile mantigi ayni; tile1'e 1.5 birim ust uste binme (ayna kenarlari ayni => gorunmez) ile alt-piksel kil cizgisi kapatildi. Fizik/collision/prosedural/kamera/jump-charge/R12 degismedi.
Kanit: `~/Documents/Codex/carsamba-gorsel020/district-yenilenmis-yanyana.png` (baslangic, skor 4, skor 9), `seam-flight-montaj.png` (ucus sirasinda 6 kare; tile araligi 24 olcumde -1.0..-0.9 px = ust uste binme, bosluk yok). FPS 300 kare p50/p95 16.7ms, dusen 0 (district ac/kapali ayni). tsc yalniz theme.ts, eslint 24, iOS export basarili. Not: cati bandi ust kenari duz kesim; cepheler/camasir ayna simetrisiyle tekrar edebilir. iPhone kabulu yok. Commit/push/deploy yok.

## KAMERA-021 (2026-09-24) — yatay kamera takibi
- Degisiklik: src/game/config.ts `cameraDeadZoneRight` 0.64 -> 0.30, `cameraStartFraction` 0.42 -> 0.30. Fizik/sarj/collision/footSoles/procedural/dikey kamera dokunulmadi.
- Ayni seed, 390x844, 9 ardisik inis. Baseline: karakter x ~%64.9, gorunen sonraki platform 0,0,1,0,0,1,0,0. Sonra: karakter x %30.9 (sol-orta bant), gorunen sonraki platform 2,2,3,2,2,2,2,1,2. camX monoton (1414.7 -> 3508.5, geriye gitmiyor).
- Kanit: ~/Documents/Codex/carsamba-kamera021/ (baseline/after montaj-7inis.png, *-rows.json).
- FPS p50 16.7ms, dropped 0 (Playwright/Chrome). tsc: theme.ts disinda yeni hata yok. iOS export basarili. DEBUG_MODE=false.
- Not: 7. inisteki tek "1" uzun bosluk; gercek iPhone kabulu iddia edilmiyor. Commit/push yok.

## REVIZYON-022 (2026-09-24) — asset-hazir kapisi, kamera Y sonumleme, iniş toleransı, yükseklik seviyeleri
1. Asset-hazir: `assetsReady = gameReady && background && district && character` (hata olursa serbest). Hazir olana dek opak `asset-ready-cover` ve dokunma katmani kapali (`onStartShouldSetResponder`). RooftopDistrict ilk Image'ina onLoad eklendi. Yerel: kapak 0.6 s civari, sonra ilk oyun karesi.
2. Kamera Y: hedef (`baseY` tabanli tY) AYNI; takip `cameraSmoothTimeY=0.16 s` kritik sonumlu (smooth-damp), overshoot yok (66 birimlik adimda max asim ~0). Eski exp 0.08: %90 icin 28 kare, yeni 19 kare; ilk 3 karede daha yumusak baslangic. DEAD fazi eski lerp.
3. Iniş toleransı: `footSoles` degismedi; `findFootLanding` artik iki tabanin toplam genisliginin >= `landingMinSoleOverlap` (0.55) kadari kapakta ise kabul. Kapak 64 -> merkezden ~±22 dunya birimi (≈±14 px ekran) icinde iniyor; tek taban (~0.5) yetmez. Testler (390x844): merkez iniş; ±14 icerde iniş; ±24 ve ±32 (sol/sag kenar) DUSTU.
4. Kolon kapak genisligi sabit 64 (`FIXED_CAP_WIDTH`). 10 kademe yukseklik (`HEIGHT_LEVELS` -104..58), ziyaret edilmemis seviyeye oncelikli yurume, ardisik en az 2 seviye (~40 birim) fark; sprite en yakin dogal boyda secilir ve dikey gerilir (yukseklik = ROOFTOP_GROUND_Y - topY + capTop*scale). Gap tavani ilk 20 kulede 190->300, "long"'dan sonra long yok. 500 seed x 20 iniş: min 9, ort 9.996 farkli seviye, ayni yukseklik tekrari 0, ulasilamaz 0, maks sarj 0.69.
- Dokunulmayanlar: jump/charge, R12, RooftopDistrict gorunum/world-Y, yatay kamera (KAMERA-021).
- Kanit: ~/Documents/Codex/carsamba-revizyon022/ (montaj-ilk-frame, montaj-kamera-alcak-yuksek/yuksek-alcak, montaj-kenar, live20.json, edge.json). Ayni seed 20 iniş canli 20/20 iniş (DOM geri beslemeli). FPS p50 16.7 ms, dropped 0. tsc temiz (theme.ts haric), iOS export OK, DEBUG_MODE=false. eslint: eskiden beri var olan react-hooks "cannot be modified" (shared value yazimi) sinifi; yeni camVY yazimlari ayni sinifta.
- Gercek iPhone kabulu iddia edilmiyor. Commit/push/deploy yok.

## REVIZYON-023 (2026-09-24)
1. Erisim: 021->022 gap-tavani daraltmasinin yarisi geri verildi (`GAP_RESTORE.fraction=0.5` procedural-course.ts; 022=0, 021=1). Sabit kapak 64 ve 10 kademe korundu. Ilk 20 inis (ayni seed) 022 vs 023 tablosu: ~/Documents/Codex/carsamba-revizyon023/tablo-022-vs-023.md. DURUST NOT: tavan cogu inista baglayici degil; 500 seed ort. gap 173.3 -> 176.3, ilk 20 seed'de sadece 6 inis degisti (gap +2..+19). "Belirgin daha atlanabilir" hedefi bu ayarla karsilanmiyor; talep yonu (gap mi, hold ihtiyaci mi) netlestirilmeli. Ayrica ard arda >=220 gap 2 -> 28/10000.
2. Acilis: modul yuklenirken Asset.loadAsync + expo-image prefetch (master, district, 3 sprite, 9 poz). Hazir kapisi artik 9 pozun TAMAMI + uc sprite + district + arka plan; onceden ilk poz yetiyordu (pop-in kaynagi). Kapak: bulanik statik Bogaz + bagli cati (StartCover, canli baslangic kamerasiyla ayni yerlesim), taban rengi soluk #EAF1F5 yerine #4f9ec4 (root, splash, html). HUD/ipucu hazir olana dek gizli; kapak 220 ms fade. Yapay timeout yok.
- Yerel olcum: kapak ~0.7-0.9 s; ilk canli karede siluet+deniz+cati+karakter birlikte. Web'de bundle oncesi beyaz kare dev sunucu kabugu; iPhone'da splash rengi degisti ama yerel yeniden native build gerekir. iPhone yukleme suresi olculmedi.
- Kanit: serit-normal.png (zaman damgali), serit-cpu4x.png, live20.json (20/20 inis + ilk 5 acc), FPS 16.7 ms/0 drop, iOS export OK. iPhone kabulu yok; commit/push/deploy yok.

## REVIZYON-024 (2026-09-24) — 023 reddedildi, iki duzeltme
1. 023 gap degisikligi TAMAMEN geri alindi (GAP_RESTORE silindi). 022 course duzeni birebir: 20 inis icin gap/mesafe/hold 022 tablosuyla ayni (sim dogrulamasi: identical=True). Yalniz cizilen+collision kapak 64 -> 68 (`FIXED_CAP_WIDTH`), ayni merkez etrafinda simetrik; uretim matematigi `LAYOUT_CAP_WIDTH=64` ile ayni. Not: 021'in erken kapak ortalamasi ~71 (022: 64); farkin yarisi ~3.5 -> 68 (=021 baslangic kulesi). Bu kural mutlak olarak kucuk (+%6) bir genislemedir; daha belirgin istenirse `FIXED_CAP_WIDTH` tek sabit. Karakter, footSoles, %55 esik, gap, fizik degismedi. Tablo: ~/Documents/Codex/carsamba-revizyon023/tablo-022-vs-024.md. Canli 20/20 inis; ilk 5 inis montaji montaj-ilk5-inis-024.png (karakter kapak ustunde, merkez hatasi 1-4 birim).
2. Native splash: app.json expo-splash-screen -> assets/images/splash-bosphorus-blur.png (oyun ici StartCover ile ayni yerlesimde bulanik Bogaz+cati, 1170x2532), resizeMode cover, backgroundColor #4f9ec4. ETKISI ANCAK yeni iOS native build / dev client ile gorulur; Expo web ve mevcut build'de degismez. Web seridi (serit-024-web.png) iPhone kaniti DEGILDIR; bundle oncesi beyaz kare web dev kabugudur. Onizleme: splash-onizleme.png.
- FPS 16.7/0 drop, iOS export OK. iPhone kabulu yok; commit/push/deploy yok.

## REVIZYON-025 (2026-09-24)
Kapak daraltmasi tamamen geri alindi: `FIXED_CAP_WIDTH` 68 -> 71 (021 atolye degeri; 022 64). Cizilen sprite ve collision ayni sabitten, ayni merkez etrafinda; uretim duzeni `LAYOUT_CAP_WIDTH=64` ile 022'yle birebir (gap/mesafe/topY/hold ayni, sim dogrulandi), 023 gap buyutmesi yok. Ilk 5 hedef: mesafe 205/233/214/251/178, gorunen gap 134/162/143/180/107 (022: 141/169/150/187/114). Tablo: ~/Documents/Codex/carsamba-revizyon023/tablo-022-024-025.md, montaj: montaj-ilk5-inis-025.png. Canli 20/20 inis, merkez hatasi 0.7-3.2. Not: gorunen gap kapak genisledikce 7 birim azalir (mesafe ayni). iOS export OK, FPS 16.7/0 drop. iPhone kabulu yok; commit/push/deploy yok.

## REVIZYON-025 DENETIM (2026-09-24) — kod DEGISMEDI
- Commit gecmisi: HEAD 7b8bd6b (2026-09-16) rooftop sprite oncesi duz kolon donemi (widthWide 76-96, Medium 56-68, Narrow 38-46); cati/baca sprite'lari, KURTARMA-02, KAMERA-021 vb. commit'lenmemis calisma agacinda. "022 oncesi calisir surum" icin kaynak snapshot'i YOK; yalniz kod metni (bu oturum), docs ve ~/Documents/Codex/carsamba-kamera021/baseline-*.png var.
- Bulgu: eski kapak genisligi TEK SABIT DEGILDI; kategoriye gore rastgele: uzun 76-96, orta 56-68, kisa 48-58, baslangic kulesi 68. "~71" ilk 20 kulenin agirlikli ORTALAMASI (hesap), hic uygulanmis bir sabit degil. Ayni seed'te 022 oncesi ilk 5 kapak: 63.8/61.0/80.8/58.5/67.8; merkezler 264.5/555.2/861.2/1044.9/1324.6; mesafeler 230/291/306/184/280 (022: 205/233/214/251/178). Yani 022 oncesi ile simdi arasindaki asil fark kapak genisligi degil kurs duzeni (022 gap/yukseklik).
- Kapak gorunen genisligi = collision genisligi = width*0.62 px (sprite olcegi width/capWidthPx, sprite toplam 102.9 px @71). Simdi 44.0 px; 022 oncesi baslangic 42.2 px. Montaj: audit-eski-vs-simdi.png; tablo audit-ilk5-tablo.md.
- Kural geregi (kesin eski deger yok): hicbir deger degistirilmedi. Eksik veri: (1) kullanicinin begendigi videodaki surumun kimligi/tarihi, (2) o surumun commit/snapshot'i, (3) sabit mi kategori-rastgele mi istendigi. Kategori-rastgele genislik geri gelirse 022 merkezleri/gap'leri korunamaz (reach clamp genislige bagli) -- karar gerekir.

## REVIZYON-026 (2026-09-24) — kolon uretimi pre-022'ye geri donus
- `src/game/procedural-course.ts`: 022 ureteci (10 kademeli HEIGHT_LEVELS, mask yurumesi, LAYOUT/FIXED_CAP_WIDTH 64/68/71, gap tavani 190->300, long-sonrasi-215, gap streak 1) tamamen kaldirildi. Geri gelenler: kategori mantigi (warm 0.62/0.38, id<=2 orta, sonra lerp agirliklari, noNarrowBeforeId), CONFIG.widthWide 76-96 / Medium 56-68 / Narrow 48-58 ile rand() genislik, rootedTopY yukseklik (cat+genislikten turetilir), gap sinif araliklari + MAX_SAME_GAP_CLASS_STREAK=2, eski donus alanlari. `app/index.tsx`: baslangic kulesi x:0, genislik widthMedium.max(68), topY rootedTopY(1,68); StartCover ayni degerlerle; splash PNG bu baslangic yerlesimiyle yeniden uretildi.
- KAYNAK: HEAD 7b8bd6b jeneratoru rootedTopY/chimney oncesi duz kolon donemidir (calisan sprite surumu degil). Begenilen calisan surum = commit'lenmemis pre-022 calisma agaci; bu oturumdaki kod metninden yeniden kuruldu (referans: ~/Documents/Codex/carsamba-revizyon023/procedural-course-pre022-referans.ts; 022 yedegi: procedural-course-022-yedek.ts). Dogrulama: gercek dosya vs referans, 300 seed x 40 kule, 0 fark; ayni seed ilk 5: merkez 264.5/555.2/861.2/1044.9/1324.6, kapak 63.8/61/80.8/58.5/67.8, mesafe 230/291/306/184/280 (kamera021 baseline ile ayni kurs). Canli 20/20 inis (DOM geri beslemeli), olculen mesafeler tabloyla uyumlu. Tablo: tablo-026-ilk20.md; montaj montaj-ilk5-eski-vs-026.png (ust: gercek eski baseline, kamera 0.64; alt: teslim, kamera 0.30 - yalniz kamera farki).
- Korunanlar: RooftopDistrict, R12, jump/charge, footSoles, %55 esik, KAMERA-021, dikey sonumleme, preload/splash/cover.
- FPS: bu makinede bos sayfada bile rAF 33.3 ms (host 30 fps sinirli, yuk 5.5); uygulama olcumu 33.3 = bos sayfayla ayni, uygulamaya ozgu dusus yok ama 60 fps kaniti bu turda alinamadi. iOS export OK. iPhone kabulu yok; commit/push/deploy yok.

## REVIZYON-027 (2026-09-24) — kurs uretimi 7b8bd6b'ye GERCEK geri donus (026 gecersiz)
- `src/game/procedural-course.ts`: ilk satirlardan `generateProceduralPlatform` sonuna kadar dosya `git show 7b8bd6b:frontend/src/game/procedural-course.ts` ile BAYT BAYT AYNI (diff bos). Altina "REVIZYON-027" basligiyla yalniz render destegi eklendi: ROOFTOP_ASSET_GEOMETRY, ROOFTOP_GROUND_Y, PlatformVisualType/classifyPlatformVisualType (rand okumaz; uretimi etkilemez). rootedTopY, HEIGHT_LEVELS, gap tavani/streak, 022-026 mantigi yok.
- `src/game/config.ts`: 7b8bd6b'nin EFEKTIF kurs degerleri geri: widthNarrow 38-46 (GORSEL-016'nin 48-58'i kalkti), EXPERIMENTAL gapLate.max 260 (340 idi), heightVarLate 180 (220 idi). Diger kurs anahtarlari zaten HEAD ile aynidir. Fizik/footSoles/%55 esik/kamera degismedi. Risk: narrow (38-46) kapak %55 tabana esiginde dar (merkez toleransi kucuk).
- `app/index.tsx` (yalniz render+baslangic): baslangic kulesi HEAD'deki gibi {x:0,topY:0,width:widthWide.max(96),cat:0}; makeNextPlatform yalniz visualType ekler; baca sprite yuksekligi artik fiziksel topY'den turer (kapak=topY, dogal olcek; govde RooftopDistrict cizgisine kadar en fazla 2.2x uzar); RooftopDistrict cizgisi dunya-Y sabit yerine ekranda sabit satir (camY'yi dikey izler, yatayda 1:1), artik platform sprite'larinin ARKASINDA (rastgele topY +-320 alcak kapaklari gizlemesin diye); StartCover/splash buna gore.
- Dogrulama: gercek uretici vs 7b8bd6b, 500 seed x 60 kule: 0 fark. Ilk 20 tablo: ~/Documents/Codex/carsamba-revizyon027/tablo-ilk20-7b8bd6b.md. Canli 20/20 inis; ilk 5 montaj montaj-ilk5-inis.png; karakter gorunen kapaga basiyor. Baslangicta yalniz ilk hedef ekranda; 2. ve 3. hedef kendi inislerinden once gorunuyor (yatay kamera 021 dokunulmadi). Yedek: carsamba-revizyon027/yedek/.
- FPS: host rAF 30 fps siniri (bos sayfa da 33.3) -> 60 fps kaniti yok. iOS export OK. iPhone kabulu yok; commit/push/deploy yok.
- FPS duzeltme: host yuku dusunce yeniden olcum p50 16.7 ms / 0 drop (idle+jump).

## ACIL iPHONE RESTART HATASI (2026-09-24)
- Degisen tek dosya/bolum: `app/index.tsx` -> `districtStripTop` (REVIZYON-027'de eklenmisti): duz ok fonksiyonundan `function ... { "worklet"; }`'a. Baska hicbir kurs/kamera/fizik/gorsel girdisi degismedi.
- Kanit: babel-preset-expo + react-native-worklets 0.10.1 ile derlenen gercek `app/index.tsx` ciktisinda tum worklet `__closure` listesi cikarildi; UI-thread'de cagrilan tek non-worklet JS fonksiyonu `districtStripTop`'ti (districtStyle0/1 useAnimatedStyle'lari camX/camY her degistiginde UI thread'de cagiriyordu). Native'de bu "Tried to synchronously call a non-worklet function" hatasidir; web tek thread oldugu icin Playwright'ta gorunmez (maskelenme). Fix sonrasi ayni derleme `districtStripTop.__workletHash` uretiyor. Diger yakalanan fonksiyonlar (poseOpacity, findFootLanding, jumpVelocity, advanceFlight, generateProceduralPlatform, classifyPlatformVisualType, mulberry32Step) zaten worklet; runOnJS ile cagrilanlar (onGameOver, onLanding, setGameReady, setCoverMounted) yasal.
- DURUST SINIR: hata gercek cihazda/simulatorde yeniden uretilemedi (Xcode lisansi kabul edilmemis -> simctl calismiyor; Metro cihaz logu yok). "Restart'ta Expo Go'ya dusme"nin bu hatadan kaynaklandigi kod kanitli en guclu aday; cihazda dogrulanmadi. Web'de Game Over->Play Again x6 hatasiz (console'da yalniz eski pointerEvents uyarisi).

## iPHONE REVIZYON-028 (2026-09-24) — render koordinat sistemi + genislik referansi denetimi
- KOK NEDEN (dikey ayrisma): REVIZYON-027'de RooftopDistrict cizgisi ekranda sabit bir satira (camY'yi izleyen `districtStripTop`) baglanmisti; platform sprite'lari ise dunya katmaninda (worldStyle) kaydi -> kamera hareket edince cati bandi ekranda durur, kapaklar kayar. Ayrica sprite govde yuksekligi `camY.value`'ya bagliydi (her karede uzuyor/kisaliyor). Olcum (390x844, 8 inis, ~1060 kare): 027'de district top sabit 627.5 px, (sprite top - district top) kareden kareye 6.23 px kayiyor; 028'de district 487-622 px arasinda kamerayla birlikte hareket ediyor, goreli kayma 0.00 px. Yerlesik karakter tabani - kapak ust farki tum dinlenme karelerinde 0.5-0.8 px (sabit).
- DEGISEN: yalniz `app/index.tsx` render: `DISTRICT_TOP_Y=92` dunya-Y (districtStyle0/1 translateY sabit dunya degeri), `DISTRICT_ROOT_Y=132` sabit dunya-Y (baca govdesi yuksekligi artik kamera terimi icermez), `districtStripTop`/`groundOffset`/PlatformView `camY` proplari kaldirildi, StartCover ayni dunya degerlerinden, splash PNG yeniden uretildi. District platformlarin ARKASINDA kalir (rastgele topY +-320'de alcak kapaklar gorunsun). Kurs/fizik/collision/%55/kamera/R12/asset dokunulmadi.
- GENISLIK REFERANSI (somut): `backups/2026-09-16-liked-randomized-course-geometry-tightened/` (README: "kullanicinin oynayip begendigi durum") ile `git show 7b8bd6b` procedural-course.ts, config.ts, landing.ts BAYT BAYT AYNI. Bu snapshot ve 09-14/09-22 snapshot'larinda widthWide 76-96, Medium 56-68, Narrow 38-46, footSoles, playerWidth, CHARACTER_WIDTH*0.8 ayni; su anki calisma agaciyla tek fark landing.ts: eski = herhangi bir taban kapakla ortusurse inis, simdi = taban toplaminin >= %55'i (REVIZYON-022). 027 zaten bu snapshot'in uretecini+genislik degerlerini geri getirdi; yani "eski genislik" sayilari kanitli olarak AYNI, daralma hissi %55 esiginden geliyor (yasak listesinde, degistirilmedi). 027'nin yanlis kaynagi degil eksik kaynagiydi: begenilen durum SADECE uretec degil, landing.ts idi. Hicbir genislik/collision sayisi degistirilmedi. Karar gerekirse: landingMinSoleOverlap (config.ts) 0.55 -> eski davranis icin ~0.0x.
- Kanit: ~/Documents/Codex/carsamba-revizyon028/ (montaj-alcak-yuksek-alcak.png, al-w027.json vs al-w028.json). iOS export OK, FPS 16.7/0. iPhone'da dogrulanmadi; commit/push/deploy yok.

## ESKI INIS HISSI GERI DONUS (2026-09-24)
- `src/game/landing.ts` = `backups/2026-09-16-liked-randomized-course-geometry-tightened/landing.ts` = `git show 7b8bd6b:frontend/src/game/landing.ts` (uc kaynak birebir; diff bos). Kural: iki taban araligindan (`CONFIG.footSoles`) HERHANGI biri kapakla gercek (right >= p.x && left <= p.x+width) ortusurse inis kabul. `%55` (REVIZYON-022) kalkti; `config.ts`'ten yalniz `landingMinSoleOverlap` satiri silindi (baska hicbir anahtar). Kapak/collision genisligi, kurs, fizik, kamera, R12, district, restart worklet duzeltmesi degismedi.
- Once/sonra kenar tablosu (gercek findFootLanding, kapak 65.47): ~/Documents/Codex/carsamba-inis-eski/tablo-kenar-inis.md. Canli 390x844: %55 iken +-36/44/52 hepsi DUSTU; eski kuralla hepsi INDI; merkez iki durumda iner. Hareket montaji montaj-hareket-5inis.png (8/8 inis). Scope SHA-256 karsilastirmasi: yalniz landing.ts ve config.ts degisti.
- Iniş alani artik cok genis: ofset 60'ta (%0.7 ortusme) bile kabul; bu eski snapshot'in gercek kuralidir. iPhone'da dogrulanmadi; commit/push/deploy yok.

## REVIZYON-030 (2026-09-25) — render/asset/kamera kompozisyonu
- Deniz-cati tek sahne: bg dikeyde dunyaya kilitli, district ustu feather + bg'nin boyali catilarina karisim; kolonlar soguk/desature district'e karsi sicak, ek yumusak kontur; dikey kamera yalniz render duzeyinde ekstra yumusatildi. Fizik/jump/charge/collision/footSoles/course/landing/kamera hedefi/restart worklet degismedi. Detay ve olcum: AI_REVIEW.md REVIZYON-030.
TESLIM_HAZIR: REVIZYON-030 — deniz/cati gecisi + kolon okunurlugu + render kamera yumusatma, ~/Documents/Codex/carsamba-revizyon030/hareket/montaj-hareket.png; iPhone/Android dogrulamasi bekliyor, commit/push/deploy yok.

## REVIZYON-030A (2026-09-25) — restart render kamera guvenligi
- initWorld worklet'inde camY atandigi yerde camYR=camY, camVYR=0, camYSeen=camY, camYRReady=1 eklendi. Baska hicbir sey (hedef, anchor, fizik, jump, landing, course, asset) degismedi. Detay: AI_REVIEW.md REVIZYON-030A.
TESLIM_HAZIR: REVIZYON-030A — restart'ta render kamera (camYR) camY ile ayni anda snap; iOS export OK, DEBUG_MODE=false; commit/push/deploy yok.

## REVIZYON-031 (2026-09-25) — TESLIM_HAZIR
- Degisen dosya: yalniz `app/index.tsx` (asset eklenmedi/degismedi). (1) Deniz/cati: district ustunde dunyaya kilitli soguk ufuk pusu (LinearGradient, yalniz camX izler). (2) Baca/kolon: kok noktasina (DISTRICT_ROOT_Y) temas golgesi. (3) Kapak okunurlugu: yalniz inis kapagina ince/hafif (3px, dusuk opaklik) ust-acik/alt-koyu kenar (topY/p.width'ten okur, yazmaz). (4) Kamera: `RENDER_CAM_SMOOTH_Y` 0.14 -> 0.05 (yalniz render camYR).
- Dokunulmadi: jump, charge, landing/footSoles, skor, collision, kamera hedef/anchor, kurs, RNG sirasi, visualType, smoke debug, restart.
- Test: tsc / expo export (ios, web) bu oturumda onay gerektigi icin CALISTIRILMADI; kod incelemesi yapildi. Risk: boxShadow/LinearGradient native'de web'den farkli gorunebilir; 0.05 ile kamera daha sert hissedebilir; kapak seridi cok belirginse opacity dusurulur.
- iPhone testi: 5+ inis oyna; kapak her arka planda (gok/deniz/cati) seciliyor mu, bacalar catiya oturuyor mu, deniz-cati gecisi tek sahne mi, karakter ve sonraki hedef ayni koridorda mi kontrol et.
- Code review duzeltmesi: (a) eski tam kolon boxShadow konturu (contourStyle) kaldirildi; yalniz cati-duzlemi temas golgesi kaldi. (b) Ufuk pusu camX telafisinden arindirildi; dunya icinde sabit X — deniz/district ile ayni koordinat sistemi.
- Mobil guvenlik duzeltmesi (son): tek dev pus View'i (left -2000, width 30000) kaldirildi; yerine districtStyle0/districtStyle1 ile eslesen iki normal genislikte (DISTRICT_TILE_W x 90) tekrarlayan pus karosu kondu. Ayni translateX/translateY (dunya koordinati), ayni dikey yerlesim (DISTRICT_TOP_Y-34) ve ayni gradient; dev native gradient yuzeyi yok. Yalniz `app/index.tsx` pus bolumu degisti.
- Dogrulama (onceki tur, dev pus ile): tsc yalniz onceden var olan theme.ts hatalarini veriyor; iOS Expo export geciyor. Karolu pus icin tsc/export bu oturumda CALISTIRILMADI. iPhone testi kullanicida.
TESLIM_HAZIR: REVIZYON-031 — kolon konturu kaldirildi, ufuk pusu dunyaya sabit; commit/push yok.

## REVIZYON-032 (2026-09-25) — baca/cati temasi + render koridor kadrajlama
- Degisen dosya: yalniz `app/index.tsx` (asset degismedi; rooftop-district-v2*.png onceden untracked).
- (A) Render-only baca sacak (eave) kirpmasi + cati-temas islemi: baca sprite'i cati duzlemine yerel olarak birlesir. Collision platformlari tasinmadi/boyutlanmadi; R031 parlak kapak kenari korundu.
- (B) Render-only koridor kadrajlama ofseti: CHARGING/AIRBORNE'da oyuncu + sonraki 1-2 erisilebilir kapak okunur koridorda kalir; camY'ye yazilmaz, fizik kamerasi degismez; restart'ta camYR snap'i korunur; idle/inista asiri duzeltme yok.
- Degismeyenler (invariants): jump, charge, landing/footSoles, collision, skor, kamera hedef/anchor/config, olum esigi, restart, procedural geometri, RNG sirasi, visualType, smoke.
- Test: iOS Expo export GECTI (dist). tsc: yalniz onceden var olan `src/theme.ts` hatalari (116,126) kaliyor. Cihaz dogrulamasi BEKLIYOR.
- Risk: sacak kirpmasi sprite'a ozgu; farkli cat/yukseklikte kucuk dikis gorunebilir. Koridor ofseti cok yuksek ziplamada kamerayi beklenenden erken oynatabilir.
- iPhone kabul adimi: 10+ inis oyna, en az 3 tanesini tam sarjli yuksek ziplama yap; bacalar catiya oturuyor mu ve karakter ile sonraki kapaklar ayni ekranda okunuyor mu kontrol et.
TESLIM_HAZIR: REVIZYON-032 — render-only baca sacak kirpmasi + cati-temas islemi ve render-only koridor kadrajlama; iOS export gecti, theme.ts hatalari onceden var, cihaz kabulu bekliyor; commit/push/deploy yok.

## REVIZYON-033 (2026-09-26) — haze inceltme + koridor hedef gorunurlugu
- Karar/kapsam: R032 iPhone review'u sonrasi yalniz render/gorsel. Haze daha ince, dusuk opakliklı, iki katmanli; koridor ilk hedefi oncelikli tutuyor, ikinciyi sigarsa ekliyor.
- Degisen dosya: `app/index.tsx`. Asset yok. Fizik/camY/skor/olum/procedural/RNG/R032 snap ve baca kirpmasi degismedi.
- Test: iOS export gecti; tsc yalniz onceden var olan `src/theme.ts` hatalari. Cihaz kabulu bekliyor.
- Risk: haze opakligi/koridor hissi cihazda ince ayar isteyebilir.
- iPhone kabul adimi: 10+ inis, 3+ yuksek ziplama; birlesim yumusak mi, hedef kapaklar erken gorunuyor mu bak.
TESLIM_HAZIR: REVIZYON-033 — render-only haze inceltme + koridor hedef gorunurlugu (app/index.tsx, AI_REVIEW.md); iOS export gecti, theme.ts hatalari onceden var, cihaz kabulu bekliyor; commit/push yok.

## REVIZYON-034 (2026-09-26) — karar/kapsam
- Kapsam yalniz render: yatay render kadraj koridoru (camXR), hafif arka plan canlandirma (wash 0.26->0.14 + ince gradyan), baca tabani cati-paleti tinti, eave golgesinin yumusatilmasi. Kahverengi lekeler smoke degil (smoke kapali), eave golgesiydi. Fizik/kamera hedefleri/course/RNG degismedi. Detay ve kanit: AI_REVIEW.md.
TESLIM_HAZIR: REVIZYON-034 — render-only yatay kadraj + arka plan/baca uyumu + leke duzeltmesi (app/index.tsx, AI_REVIEW.md); cihaz kabulu bekliyor; commit/push yok.

## REVIZYON-035 (2026-09-26) — kamera sertligi + kolon gorunurlugu + HUD
- Kok neden: R034 camXOff/R033 camFrameOff hedefleri phase degisince hizla 0'a donuyor (tau 0.07/0.12s) ve taban kamera henuz yetismediginden render kamerasi geri tepiyordu; hizli karelerde kolonlar bu yuzden silik gorunuyor. baseTint alt %32'de kolon govdesini cati rengine eritiyordu.
- Degisen dosya: yalniz `app/index.tsx`. (1) Y/X offset asimetrik dt-tabanli: giris hizli (Y 0.1s, X 0.14s), birakma yavas (Y 0.35s, X 0.6s). (2) camXR ratchet: bir hayatta render X geri gitmez; start/restart'ta mevcut snap (camXR = camX) korunur, camX'ten 400+ geride kalirsa da snap. (3) baseTint: yukseklik %32 -> %20, alfa 0.2 -> 0.07; kontur/koyu golge eklenmedi. (4) HUD: score/best rengi hudText, hafif beyaz textShadow.
- Sahne/haze/R034 arka plan canlandirma degismedi. Ilk hedef onceligi degismedi.
- Invariants: fizik, jump, charge, collision, landing/footSoles, skor, olum esigi, camX/camY hedef+config, procedural geometri, RNG, platform verisi, restart, smoke dokunulmadi.
- Test: iOS Expo export GECTI; git diff --check temiz; tsc yalniz eski `src/theme.ts` hatalari (116, 126).
- Risk: X ratchet nedeniyle nadiren oyuncu sol kenara yakin kalabilir (kamera sola gitmez); yavas birakma yuksek ziplama sonrasi kadraji biraz "asili" tutabilir. Tint/textShadow degerleri goz karari.
- iPhone kabul adimi: 10+ inis, 3+ tam sarjli yuksek ziplama; kamera phase degisiminde geri tepiyor mu, kolonlar hizli karelerde okunuyor mu, bacalar cephe/deniz/gokte ayirt ediliyor mu, score/best gokte okunuyor mu; restart'ta kamera aninda oturuyor mu.
TESLIM_HAZIR: REVIZYON-035 — render-only kamera yumusatma (asimetrik easing + X ratchet), kolon tint azaltma, HUD okunurlugu; export gecti, cihaz kabulu bekliyor; commit/push yok.

## REVIZYON-036 (2026-09-26) — karar/kapsam
- Kapsam yalniz render: (1) R034/R035 kamera yama zinciri kaldirildi, camXR/camYR icin tek dt-tabanli kritik sonumlu takipci (hiz/ivme sinirli, koridor yalniz hedefi belirler, X icin 400'luk snap yok). (2) Yuksek/dar kolonlarda eave ile cati arasindaki gercek bosluk, sprite ailesinin kendi dokusundan konnektor ile kapatildi; yakin platformlarda cizilmez. (3) Kahverengi flu bant kaynagi (havada yuzen eave golgesi) konnektorle giderildi; ColumnSmoke kapali kalir. (4) R035 HUD, R033/R034 arka plan korundu.
- Degismeyenler: fizik, jump, charge, collision, landing/footSoles, skor, olum esigi, camX/camY hedefleri/config, procedural geometri/RNG, platform verisi, restart. Yeni asset yok. Kanit ve olcumler AI_REVIEW.md'de.
- Bekleyen: iPhone kabul testi (Android dogrulanmadi).
TESLIM_HAZIR: REVIZYON-036 — render-only tek kamera takipcisi + cati-baca konnektoru (app/index.tsx, src/game/render-camera.ts, AI_REVIEW.md); cihaz kabulu bekliyor; commit/push yok.

## REVIZYON-037 (2026-09-28) — iPhone R036 reddi sonrasi sade render
- R036 konnektor sistemi ve serbest `baseShadow`/`baseTint` katmanlari kaldirildi; videodaki kahverengi hayalet dikdortgenleri uretebilecek bu ek render katmanlari artik yok.
- Baca sprite'lari dogal en-boy oranina dondu; 2.2x dikey germe kaldirildi. Her platform ayni kuralla bagimsiz bir kucuk cati adasi olarak ciziliyor.
- Kamera: X yalniz oyuncu + ilk hedefi izleyen monoton, hiz/ivme sinirli takipci. Y, kalkista kompozisyonu kilitliyor; ucusta yalniz gercek kadraj ihlalinde yavas duzeltme yapiyor; iniste ham yeni platform hedefine tek kritik-sonumlu gecis yapiyor.
- Degismeyenler: jump/charge, collision/landing, skor, olum esigi, camX/camY oyun kamerasi hedefleri, procedural geometri/RNG, platform verisi ve restart davranisi.
- Deterministik R037 simulasyonu (60/30 FPS): X geri kare 0, Y yon degisimi 0, ucus ici Y drift 0px, oyuncu genis guvenli alan disi 0; gercek inis adimlari %2 toleransa 0.62-0.63s'de oturuyor.
- Test: iOS Expo export GECTI; worklet declaration-order regresyon testi PASS; `git diff --check` temiz. `tsc` yalniz onceden var olan `src/theme.ts` 116/126 hatalarini veriyor.
- Cihaz kabulu bekliyor; commit/push/deploy yok.
TESLIM_HAZIR: REVIZYON-037 — R036 hayalet konnektor/overlay katmanlari kaldirildi, dogal baca adalari + ucus-kilitli yumusak render kamera hazir; iPhone testi bekliyor.

## REVIZYON-038 (2026-09-28) — R037 iPhone reddi
- Yeni cihaz kaydi R037'nin iki varsayimini curuttu: kahverengi dikdortgenler devam etti ve sabit Y kompozisyonu uzun dususlerde oyuncuyu ekran altina tasidi.
- Baca renderi platform basina uc gizli/gorunur native image agacindan tek image agacina indirildi (42 -> 14). Havuz slotu cat degistirirken iOS'un eski kirpilmis yuzeyi tutmasina yol acan kategori gecisi kaldirildi. Tum platformlar ayni orta cati-adasi siluetini kullanir.
- Ucus Y kamerasi artik sabit degil: oyuncu + ilk hedef koridorunu tek, hiz/ivme sinirli ve `smoothTimeYFlight=0.30` olan takipciyle yumusak izler. Ikinci hedef, offset zinciri ve ani snap eklenmedi.
- Fizik, jump/charge, collision/landing, skor, course/RNG ve oyun kamerasi camX/camY degismedi.
- iOS export ve worklet regresyon testi gecti; tsc yalniz eski theme.ts hatalari.
TESLIM_HAZIR: REVIZYON-038 — tek baca render katmani + uzun dususu yumusak izleyen kamera; iPhone kabul testi bekliyor, commit/push/deploy yok.

## REVIZYON-038A (2026-09-28) — acilis blokaji
- R038 uc baca render agacini teke indirdi, ancak `assetsReady` kaldirilan `rooftop1` ve `rooftop2` onLoad sinyallerini beklemeye devam ediyordu. Bu nedenle cover hic kapanmiyor ve responder dokunma kabul etmiyordu.
- `assetsReady` yalniz gercekte render edilen `rooftop` sinyalini bekleyecek sekilde duzeltildi. iOS export ve worklet testi gecti; fizik degismedi.
TESLIM_HAZIR: REVIZYON-038A — iPhone acilis kapisi duzeltildi; cihaz yeniden yukleme testi bekliyor.

## REVIZYON-039 (2026-09-28) — kolonlari dunya cati hattina baglama
- R038A iPhone videosunda atlama/kamera iyi; tek kalan baskin sorun cati adalarinin yuksek topY degerlerinde havada durmasi.
- Her platforma, kendi gutter altindan `DISTRICT_ROOT_Y` dunya cati hattina uzanan tek opak duvar destegi eklendi. Destek baca sprite'inin arkasinda kardes View; nested image, alpha/gradient, kategori havuzu veya yeni asset yok.
- Fizik/collision/topY/genislik/course/RNG/kamera degismedi. iOS export ve worklet testi gecti; tsc yalniz eski theme.ts hatalari.
TESLIM_HAZIR: REVIZYON-039 — opak tek-parca cati destegi; iPhone gorsel kabul testi bekliyor, commit/push/deploy yok.

## REVIZYON-040 (2026-09-28) — tek desenli kolon govdesi + daha yumusak kamera
- Kanit: `ScreenRecording_09-28-2026 13-13-50_1.MP4`. R039 yuksek platformlari zemine bagladi ancak duz bej destek, boyali baca/catiyla ayni nesne gibi gorunmedi; orta/alcak platformlarda destek ya cok kisa ya da yoktu. Ek bulgu: destek genisligi platformlar arasinda ince cubuk/genis blok gibi tutarsiz algilaniyordu.
- Yeni asset: `assets/environment/chimney-masonry-support-v1.png`; mevcut baca/cati resminin sicak, elde boyanmis siva-tugla dilinden uretilen opak ve dikey tekrar edilebilir duvar dokusu.
- Tum platform destekleri ayni kuralda: baca gutter altindan baslar, en az 26 world-unit gorunen boyun birakir, yuksek platformlarda `DISTRICT_ROOT_Y+44` seviyesine uzanir; genislik baca govdesine yaklasacak sekilde `max(20, p.width*0.84)`. Destek tek sibling View icinde `resizeMode=repeat` dokudur; alfa gradyani/nested connector/kategori gecisi yok.
- Kamera yalniz render katmaninda yumusatildi: X smooth 0.20s, stand Y 0.32s, flight Y 0.38s; hiz 520 ve ivme 2600 ile sinirli. Simulasyonda geri X=0, Y yon degisimi=0, ucus-guvenli-alan ihlali=0; gercek inis adimlari %2 toleransa ~0.95-0.97s'de oturuyor.
- Degismeyenler: jump/charge, collision/landing, score, olum, course/geometri/RNG, platform topY/width, camX/camY oyun kamerasi ve restart.
- Test: iOS Expo export PASS (yeni asset pakette), worklet regression PASS, render-camera simulasyonu PASS, diff-check temiz. `tsc` yalniz onceden var olan `src/theme.ts` 116/126 hatalarini veriyor.
TESLIM_HAZIR: REVIZYON-040 — ayni desenli opak platform govdesi + belirgin yumusatilmis render kamera; iPhone kabul testi bekliyor, commit/push/deploy yok.

## REVIZYON-041 (2026-09-28) — kolonlari arka plan catisina gomme + ilk-kare doku + kamera v2
- Kullanici kabulu: kahverengi hayalet yuzey duzeldi ve atlama hissi basarili; bunlar sabit tutuldu. Red: ayri cati-adasi sprite'i nedeniyle oynanabilir kolonlar arka plan catisindan kopuk, support texture gec aciliyor, kamera halen sert.
- Gorsel mimari: per-platform `rooftop-medium-v1` cati adasi tamamen render agacindan kaldirildi. Her oynanabilir yuzey artik yalniz ince cap-rim + tek desenli duvar govdesi. Govde district'ten ONCE cizilir ve alt ucu district resmi tarafindan ortulur; boylece yuksek/orta/alcak kolonlar ayni arka plan cati dokusunun icinden cikiyormus gibi birlesir. Collision/topY/width degismedi.
- Asset gecikmesi: support texture PRELOAD_MODULES ve `assetsReady` kapisina eklendi; `fadeDuration=0`. Texture 1024x1535/2.7MB'dan ekranda yeterli 256x384/206KB'ye indirildi. Oyun dokunun `onLoad` sinyali gelmeden dokunma kabul etmez.
- Kamera: ilk deneme (0.28/0.44/0.48s, accel 1300) sentetik test penceresinde buyuk inisleri tamamlayamadi ve REDDEDILDI. Nihai ayar X 0.24s, stand-Y 0.36s, flight-Y 0.43s, maxSpeed 470, maxAccel 1800. 60/30 FPS simulasyonu: X geri=0, Y yon degisimi=0, ucus guvenli alan ihlali=0, buyuk inis yerlesmesi ~1.07-1.10s.
- Degismeyenler: jump/charge, landing/collision, score, death, procedural course/RNG, oyun kamerasi camX/camY ve kahverengi hayalet duzeltmesindeki tek-yuzey ilkesi.
- Test: iOS Expo export PASS (48 asset; eski 3 rooftop asset artik bundle'da yok), worklet regression PASS, diff-check temiz. TSC yalniz eski `src/theme.ts` 116/126 hatalari.
TESLIM_HAZIR: REVIZYON-041 — cati adasi kaldirildi, shaft district arkasina gomuldu, doku ilk-kare kapisinda ve kamera ikinci testte kabul edildi; iPhone testi bekliyor, commit/push/deploy yok.

## REVIZYON-042 (2026-09-28) — bitmap kolonu kaldirma + tam-sarj kamera hedefi
- Kanit: `ScreenRecording_09-28-2026 14-19-35_1.MP4` (96.46s, 1320x2868, ~59.9fps). R041 cati adasini kaldirdi ve ghost duzeltmesini korudu; ancak sari/kahverengi kolon malzemesi arka plan cephesinden farkli kaldi, yeni pool slotlarinda bitmap sonradan acildi ve tam sarj apeksinde kamera hedefi normal atlayistan daha buyuk adim yapti.
- Kolon: ayrik bitmap texture tamamen kaldirildi. Govde artik aninda cizilen, district cephe paletindeki LinearGradient + iki seyrek tugla izi; yeni asset/decode/onLoad yok. Alt kisim district'in arkasinda kalmaya devam eder, ayri cati adasi geri getirilmedi.
- Kamera: X/Y ham koridor hedefleri 0.08s target ramp'tan geciyor; fizik kamerasi degil yalniz render hedefi. AIRBORNE koridoru %12-%90'a genisletildi; tam sarj apeksi normal basistan daha buyuk kamera emri uretmiyor, uzun dusus guvenligi korunuyor.
- Ilk hedef-ramp adayi 0.18s buyuk inisleri 1.2s test penceresinde tamamlayamadi ve REDDEDILDI. Nihai 0.08s: 60/30 FPS'te X geri=0, Y yon degisimi=0, guvenli-alan ihlali=0, peak Y accel ~1298/1238 u/s2, inis settle ~1.17s.
- Atlama/charge/collision/landing/score/course/RNG/camX-camY ve ghost duzeltmesi degismedi.
- Test: iOS export PASS (47 asset, support bitmap artik bundle'da yok), worklet regression PASS, camera sim PASS, diff-check temiz; tsc yalniz eski theme.ts 116/126.
TESLIM_HAZIR: REVIZYON-042 — senkron cephe-paleti kolon + yumusatilmis tam-sarj kamera hedefi; iPhone kabul testi bekliyor, commit/push/deploy yok.

## REVIZYON-043 (2026-09-29) — mimari baca/bina silueti + konfor kamerasi
- Kanit: `ScreenRecording_09-29-2026 10-40-00_1.MP4` (50.91s, 1320x2868, ~59.9fps). R042'de bitmap gecikmesi/ghost yok ve jump korunuyor; fakat support district arkasinda oldugu icin alcaklar kayboluyor, uzunlar tek genislikli acik renk cubuk gibi gorunuyor. Video phase-correlation en sert dikey arka plan kaymalarini inis/phase cevresinde gosterdi.
- Mimari duzeltme: support katmani district'in ONUNE alindi; hicbir alcak platform saklanamaz. Her govde: gercek collision genisliginde siva shaft, alt %42'de genisleyen cephe kaidesi, district kiremit paletinde +24u genis baca-dibi/roof collar ve gercek landing topY'de ayni renkte 8u baca kapagi. Yalniz 115u+ uzun govdelerde kucuk mavi-yesil cephe acikligi var; boylece uzunlar direk degil dar bina/baca kulesi okur. Tum parcalar senkron View/Gradient; asset gecikmesi yok.
- Kamera: konfor onceligiyle X/standY/flightY 0.30/0.44/0.50s, maxSpeed 400, maxAccel 1100, target ramp 0.18s. Ucus koridoru %12-%90 korunur; tam sarj normal sarjdan buyuk apex kamera komutu uretmez.
- Gercek render QA: Expo web 390x844 acilip iki tur gorsel kontrol edildi. Ilk turda alt collar baglantisi ve gorunurluk PASS, yuksek govde hala direk gibi -> reddedildi; ikinci turda top cap + lower pedestal + uzun-govde penceresi sonrasi tum pool platformlari gorunur ve catiyla alt/ust malzeme baglantili.
- Sim 60/30 FPS: X backward=0, Y reversal=0, airborne unsafe=0; peak Y accel 629/608 u/s2; settle 1.58/1.60s. Atlama/charge/collision/landing/score/course/RNG/camX-camY degismedi.
- Test: iOS ve web export PASS, worklet regression PASS, camera sim PASS, diff-check temiz; tsc yalniz eski theme.ts 116/126.
TESLIM_HAZIR: REVIZYON-043 — mimari platform govdesi ve belirgin yumusak kamera; iPhone kabul testi bekliyor, commit/push/deploy yok.

## REVIZYON-044 (2026-09-29) — onaylı mimari görsel sistemi + kamera yumuşatma
- Karar: 29 Eylül 11:39 videosundaki 6 sorun (yapıştırılmış çubuk kolonlar, düz kiremit rafı, kısa/orta kolonların cepheyle kaybolması, uzun kolonlardaki mavi pencereler, aynı cap/collar tekrarı, sert dikey kamera) için onaylanmış revizyon uygulandı.
- Kod kapsamı yalnız `app/index.tsx` (PlatformSupportView + stilleri, silh* yardımcı fonksiyonları) ve `src/game/render-camera.ts` (Y eksenine özel yumuşatma sabitleri). Kanıt: scope SHA-256 karşılaştırması bu ikisi dışında hiçbir dosyayı değiştirmedi.
- Kilitli alanlara (jump/charge, landing/footSoles, skor/restart/kamera HEDEF mantığı, procedural course, karakter animasyonu) dokunulmadı.
- Detaylı kök neden, ölçüm ve kanıt: AI_REVIEW.md REVIZYON-044.
- Kanıt klasörü: ~/Documents/Codex/carsamba-revizyon044/ (once-sonra-kolon.png, kisa-orta-uzun-siluet.png, montaj-v2_seedA.png, montaj-v2_seedB.png, scan1-grid.png).
TESLIM_HAZIR: REVIZYON-044 — onaylı mimari platform gövdesi (kısa/orta/uzun siluet, raf/pencere kaldırıldı) + Y-ekseni özel yumuşatılmış render kamerası; iPhone görsel kabul testi bekliyor, commit/push/deploy yok.

## REVIZYON-045 (2026-09-29) — İstanbul mimari uyumu + tam şarj kamera tepe sınırı
- Kanıt/karar: 29 Eylül 13:27 iPhone kaydı + arka plan dikey hareket proxy ölçümü (p90 38.7→31.3, p99 48.0→42.3, max 49.6→47.9 px/s) R044'ün iyileştirdiğini ama iki sorunun kaldığını gösterdi: (1) kolonlar koyu endüstriyel kahverengi + tekrarlayan dikey yiv nedeniyle boru/anten gibi duruyor, dar-uzun kolonlar saç teli gibi inceliyor; (2) tam şarj/büyük yükseklik farkındaki en sert kamera tepesi hâlâ göz yoruyor.
- Kod kapsamı yalnız `app/index.tsx` (PlatformSupportView paleti/oranları) ve `src/game/render-camera.ts` (Y ekseni iniş-öncesi harmanlama). Kilitli alanlara (jump/charge, landing/footSoles, score/restart, procedural course/RNG, karakter, kamera X ekseni/hedef mantığı, normal zıplama hissi) dokunulmadı; scope SHA-256 karşılaştırması bunu doğruladı.
- Detaylı kök neden, ölçüm ve kanıt: AI_REVIEW.md REVIZYON-045.
- Kanıt klasörü: ~/Documents/Codex/carsamba-revizyon045/ (once-sonra-kolon-r045.png, kisa-orta-uzun-dar-genis.png, sonra/montaj-final_seedA.png, sonra/montaj-final_seedB.png, sonra/scan2-grid ekran görüntüleri).
TESLIM_HAZIR: REVIZYON-045 — kolon paleti İstanbul cephesine uyumlu + dar-uzun kolonlar için minimum gövde genişliği + id-tabanlı yiv çeşitliliği, tam şarj/büyük iniş kamera tepesi iniş-öncesi harmanlama ile düşürüldü (ayrıntı AI_REVIEW.md); iPhone görsel kabul testi bekliyor, commit/push/deploy yok.

## REVIZYON-046 (2026-09-29) — tam şarj yatay kadraj + kolon/çatı gerçek mimari birleşim
- Kaynak: kullanıcının ScreenRecording_09-29-2026 14-15-45_1.MP4 kaydı (59.47 sn, 1320×2868, ~59.88 fps) doğrudan Python/OpenCV ile karelere ayrılıp incelendi (video araçları yoktu, opencv-python-headless kuruldu).
- R045'ten TAMAMLANAN: koyu kahverengi palet sıcak ocre/terracotta tona geçti; dar-uzun kolonların hairline'lığı azaldı; id-tabanlı yüzey çeşitliliği eklendi; dikey kamera sarsıntısı azalmış görünüyor.
- R045'te EKSİK KALAN (videodan doğrulandı, ~22.30 sn karesi): tam şarj/çoklu-kule atlayışında karakter ekranın ~90%'ına dayanıyor, apex'te ileride HİÇBİR platform görünmüyor; kök neden bulundu: kamera koridoru "duran kuleden sonraki İLK platform"u hedefliyor, ama çoklu-kule atlayışında gerçek iniş noktası çok daha ileride -- koridor asla o kadar ileri bakmıyor. Kolonlar: palet ısındı ama taban hâlâ ayrı bir kama/pill şekli olarak çatının önüne yerleştirilmiş duruyordu.
- Kod kapsamı yalnız `app/index.tsx` (X kamera bloğu + PlatformSupportView) ve `src/game/render-camera.ts` (xFlightBlend/xLead* sabitleri). Kilitli alanlara (jump/charge, landing/footSoles, score/restart, procedural course/RNG, karakter, dünya koordinatları/zorluk) dokunulmadı; scope SHA-256 karşılaştırması R045 taban hash'leriyle birebir eşleşti.
- Detaylı kök neden, ölçüm ve kanıt: AI_REVIEW.md REVIZYON-046.
- Kanıt klasörü: ~/Documents/Codex/carsamba-revizyon046/ (video-frames/, apex-video-vs-render.png, x-r045-full.json, x-r046-full.json, sonra/scan-grid.png, once-sonra kolon görselleri).
TESLIM_HAZIR: REVIZYON-046 — tam şarj kadrajı vx-tabanlı sürekli lead ile düzeltildi (gerçek render: max ekran-x %105→%74, 75% üstü süre 29-45 kare→0), kolon tabanı ayrı kama yerine çatıya gömülen occlusion/collar birleşimine dönüştü; iPhone görsel kabul testi bekliyor, commit/push/deploy yok. Kullanıcının Spring Ninja referans videosu geldiğinde kamera akış/parallax oranları ayrıca kalibre edilecek (bu turda "Spring Ninja ile birebir" iddiası yok).

## REVIZYON-047 (2026-09-30) — kolonların çatıya mimari birleşimi
- Kaynak: kullanıcının ScreenRecording_09-30-2026 10-40-51_1.MP4 kaydı (95.1 sn, 1320×2868, ~57.8 fps) doğrudan Python/OpenCV ile incelendi.
- Doğrulanan: R046 yatay kamera düzeltmesi ÇALIŞIYOR -- 21.8-23.2 sn çoklu kule atlayışında karakter sağ kenardan çıkmıyor. Bu turda X kamerasına/xFlightBlend'e dokunulmadı.
- Açık sorun (video karelerinde doğrulandı, 31.2-34.0/47.6-51.0/88.8-91.2 sn): uzun kolonlar düz, tek renkli, çatıdan bağımsız bej boru gibi; kısa kolonlar çatı üstüne bırakılmış kutu gibi; R046'nın yüzey lekesi/korniş detayları gerçek telefon ölçeğinde (muhtemelen düşük kontrastlı ekran koşulunda) neredeyse görünmüyordu.
- Uygulanan: yalnız `app/index.tsx` `PlatformSupportView` -- korniş çizgileri kalınlaştırıldı/koyulaştırıldı, R046'nın soluk "leke" yerine kenarlıklı bir "tamir izi" şeridi, taban-çatı geçiş gradyanı çok daha koyu/erken başlıyor, metal geçiş bileziği kalınlaştırılıp kenarlıklandı, görsel kutu çatı hattının birkaç birim altına gömülüyor (`ROOF_PLANT_DEPTH`, yalnız görsel -- collision/topY/width dokunulmadı).
- Dikey kamera "pompalama" şikayeti (47.8-50.3 sn) videodan faz-korelasyonla ölçüldü: bu pencerede arka plan/skyline dikey hareketi ölçüm gürültüsü seviyesinde (<0.5px), net bir "hızlan-sonra-dur" artefaktı YOK -- fayda kanıtlanamadığı için Y render kamerası (src/game/render-camera.ts) bu turda DEĞİŞMEDİ (dosya R046 ile bayt bayt aynı).
- Kilitli alanlara (jump/charge, landing/footSoles, score/restart, procedural course/RNG, karakter, dünya koordinatları/zorluk, X kamera/xFlightBlend) dokunulmadı; scope SHA-256 karşılaştırması R046 taban hash'iyle doğrulandı (yalnız app/index.tsx değişti, render-camera.ts aynı).
- Detaylı ölçüm ve kanıt: AI_REVIEW.md REVIZYON-047.
- Kanıt klasörü: ~/Documents/Codex/carsamba-revizyon047/ (video-frames/, once-sonra-uzun-kolon.png, once-sonra-kisa-kolon.png, sonra-grid.png, sonra-grid-seedB.png, x-r047-full.json).
TESLIM_HAZIR: REVIZYON-047 — kolon/çatı birleşimi güçlü kontrastlı korniş+tamir izi+koyu taban gradyanı+kenarlıklı metal bilezik ile yeniden kuruldu, R046'nın X kamera kazanımı ve yatay kadraj bozulmadı, Y kamerası ölçümle gerekçesiz bulunduğu için değiştirilmedi; iPhone görsel kabul testi bekliyor, commit/push/deploy yok.

## REVIZYON-048 (2026-10-01) — çatı ve oynanabilir kolonları tek yapı haline getirme
- Kaynak: kullanıcının onayladığı `REVIZYON_048_TASK.md` + ScreenRecording_10-01-2026 10-35-42_1.MP4 (95.1 sn benzeri, 1320×2868) 18/34/62. saniyeleri doğrudan incelendi -- R047 gerçek cihazda reddedilmişti: kolonlar denizin üstünde asılı/çatıdan kopuk.
- KÖK NEDEN (ölçülerek bulundu, varsayılmadı): `DISTRICT_ROOT_Y` sabiti (`DISTRICT_TOP_Y+40`=132) `rooftop-district-v2.png` asset'i için hiç yeniden ölçülmemiş eski bir değerdi. Asset'in gerçek kiremit/saçak (eave) çizgisi piksel piksel ölçüldü (6 farklı x kolonunda tutarlı): kaynak y≈71-81 (orta 78) → dünya Y = 92+78×1.9 = 240, yani 132 DEĞİL. ~108 dünya biriminin (zoom 0.62'de ~67 ekran px) sistematik hatası her kolonun gerçek çatı çizgisinin ~67px YUKARISINDA bitmesine, yani videoda görülen "boru suyun üstünde asılı" görüntüsüne doğrudan sebep oluyordu.
- DÜZELTME 1 (koordinat): `DISTRICT_ROOT_Y = DISTRICT_TOP_Y + 148` (240) -- ölçülen gerçek saçak çizgisiyle eşleşiyor.
- DÜZELTME 2 (mimari, yalnız gölge/kontrastla yetinmedi): her platformun kendi `p.x/p.width/p.id`'sinden türeyen, kolonun GERÇEKTEN üstüne oturduğu küçük bir "bina" eklendi -- kemerli/yuvarlak köşeli bir kiremit çatı başlığı (DISTRICT_ROOT_Y'ye -- yani artık doğru saçak çizgisine -- oturuyor) ve altında id-hash'ten pencereli bir cephe duvarı (520 birim aşağı uzanıyor, kamera her zaman altını görür). Büyük tekrarlanan district görseli arkada aynen kalıyor; kolonun ÇEVRESİNDEKİ, oyuncunun asıl baktığı birleşim artık yalnızca platformun kendi verisinden geliyor, tekrarlayan resmin hangi karesi arkada olursa olsun hizası bozulmuyor.
- Kilitli alanlara (jump/charge, landing/footSoles, score/restart, procedural course/RNG, karakter, R046/R047 X/Y kamera davranışı) dokunulmadı; scope SHA-256 karşılaştırması bunu doğruladı (yalnız `app/index.tsx`, `render-camera.ts` R047 ile bayt bayt aynı).
- Detaylı ölçüm, önce/sonra kanıtı: AI_REVIEW.md REVIZYON-048.
- Kanıt klasörü: ~/Documents/Codex/carsamba-revizyon048/ (video-frames/, once-sonra-ucgen.png, prova2-grid.png, sonra-grid-seedB.png, x-r048-full.json).
TESLIM_HAZIR: REVIZYON-048 — DISTRICT_ROOT_Y ölçülerek düzeltildi (132→240) ve her platforma p.x/width/id'den türeyen kendi çatı-başlığı+cepheli "bina" eklendi; kolon artık çatıya gömülü/bağlı, suyun üstünde asılı değil; iPhone görsel kabul testi bekliyor, commit/push/deploy yok.

> [GEÇERSİZ/PROVISIONAL — 2026-10-01] Codex görsel incelemesi bu TESLIM_HAZIR'ı reddetti: eklenen 520 birimlik opak bej cephe blokları boyalı pencere/balkon/çamaşır detaylarını örtüyor, turuncu yuvarlak çatı başlıkları ayrı yapıştırılmış şekil gibi duruyor -- "tek yapı" hissi yerine görsel bütünlüğü BOZUYOR. Yukarıdaki satır düzeltme tamamlanana kadar geçersiz sayılmalı. Devamı için aşağıdaki REVIZYON-048 (yeniden çalışma) bölümüne bak.

## REVIZYON-048 — yeniden çalışma (2026-10-01, Codex reddi sonrası)
- Codex görsel incelemesi haklıydı: eklenen 520 birimlik opak bej `buildingFacade` ve turuncu `buildingRoof` district görselinin pencere/balkon/çamaşır ipi detaylarını geniş düz dikdörtgenlerle örtüyordu, çatı başlığı ayrı yapıştırılmış bir şekil gibi duruyordu. Bu, "tek yapı" hissi yerine görsel bütünlüğü BOZUYORDU.
- Karar: `buildingRoofStyle`/`buildingFacadeStyle`/`buildingWindowStyle` ve bunların JSX/stil tanımları TAMAMEN GERİ ALINDI. Yalnız ölçülmüş `DISTRICT_ROOT_Y` düzeltmesi (132→240, bkz. yukarıdaki REVIZYON-048 girişi) KORUNDU -- bu tek sabit zaten (R047'nin mevcut dar şaft+koyu taban+bilezik tasarımıyla birlikte) kolonun çatı/cepheye ulaşmasını sağlıyor, hiçbir pencere/balkon örtülmeden.
- Aynı seed'de (1700001200000) yeni önce/sonra kanıtı: `~/Documents/Codex/carsamba-revizyon048/once-sonra-duzeltme.png` -- tüm pencere/panjur/çamaşır ipi detayları korunuyor, kolon tabanı artık çatı/cepheye kadar uzanıyor, boşlukta asılı kalmıyor.
- Bu, R048'in hedeflediği "modüler bina" mimarisinin TAM karşılığı DEĞİL -- yalnızca ölçülmüş koordinat düzeltmesi + R047'nin mevcut dar şaft tasarımı. Görsel bütünlüğü koruyan, ölçülerek doğrulanmış, GERÇEKTEN iyileşen tek geçerli aday budur; daha iddialı bir "tek yapı" tasarımı bu turda BAŞARILAMADI ve tekrar denenmedi (zaman/risk nedeniyle, kullanıcının "başaramazsan geri al" talimatı izlendi).
- Testler yeniden çalıştırıldı: tsc temiz, worklet regresyonu+güvenliği PASS, FPS p50 16.7ms/0 drop (2 tekrar), Play Again 5/5, `git diff --check` temiz, iOS export PASS, `DEBUG_MODE=false`. Scope SHA-256: yalnız `app/index.tsx` değişti (yalnız `DISTRICT_ROOT_Y` sabiti), `render-camera.ts` R047 ile bayt bayt aynı.
TESLIM_HAZIR: REVIZYON-048 (düzeltilmiş) — opak "bina" eklentisi tamamen geri alındı; tek geçerli/doğrulanmış değişiklik ölçülmüş `DISTRICT_ROOT_Y` düzeltmesi (132→240), pencere/balkon/çamaşır detayları korunuyor, kolon artık çatıya ulaşıyor; "tek yapı" mimarisi bu turda tam başarılamadı, iddia edilmiyor; iPhone görsel kabul testi bekliyor, commit/push/deploy yok.

## REVIZYON-049 (2026-10-01) — kolonu çatının doğal parçası gibi gösterme (A/B taslak sonrası)
- Kaynak: `REVIZYON_049_HAZIRLIK.md` + ScreenRecording_10-01-2026 12-10-59_1.MP4, 10/18/34. saniyeler doğrudan incelendi. R048'in düzeltmesi (yalnız `DISTRICT_ROOT_Y`) pencereleri kurtarmıştı ama kolonlar hâlâ: 10sn kısa platform çatının önüne asılmış kutu, 18sn uzun kolon pencere/balkon önünden geçen ayrı dikme, 34sn hem uzun hem kısa kolonun altında sert yatay koyu bitiş + ince metal taban olarak görünüyordu.
- Mimari neden (prep doc'ta da belirtilen): sabit tekrarlayan district resmi ile prosedürel p.x/topY kolonları ayrı üretiliyor; çatı sırtı/saçak konumu platform konumuna göre türemiyor.
- ÖNCE, koda dokunmadan A/B görsel taslak: `~/Documents/Codex/carsamba-revizyon049/ab-mockup-karsilastirma.png` -- aynı kırpma üzerinde (A) dar yerel yama (örtüşen 3 blob, "balon kümesi" gibi okunuyor, ikna edici değil) ve (B) modüler kiremit kümesi (district'in kendi kiremit renginde/şeklinde 3 küçük yuvarlak "fıçı kiremit", gerçek komşu kiremitlerle aynı aile) karşılaştırıldı. B açıkça daha ikna ediciydi.
- B uygulandı: `PlatformSupportView`'daki düz metal "flashing collar" kaldırıldı, yerine SADECE şaftın kendi (zaten hesaplanan) genişliğinden türeyen 3 kiremit-kubbe View'i (`supportTile`/A/B/C) eklendi -- yeni asset yok, RNG yok, mount/unmount kategorisi yok (hep monte, yalnız boyut/konum sürekli değişiyor).
- Uygulama sırasında KENDİ render kontrolümde 2 hata yakalayıp düzelttim (teslim etmeden önce): (1) ilk deneme kiremit boyutunu doğrudan şaft genişliğiyle orantılı yaptı, geniş platformlarda kiremitler gerçek çatı bandından (ölçülen ~30-57 dünya birimi) çok daha büyük çıktı ve pencere/panjur sırasına kadar uzandı -- mutlak birimde kelepçelendi (20-32 birim). (2) `DISTRICT_ROOT_Y` R048'de doğru ölçülmüşken, eski `+26`/`ROOF_PLANT_DEPTH(7)` tamponları (toplam 33 birim) hâlâ duruyordu -- bunlar YANLIŞ sabit (132) zamanından kalma telafi tamponlarıydı; doğru sabitle (240) birlikte kiremitleri saçak çizgisinin 33 birim ALTINA, pencere/korniş bandına itiyorlardı. Tampon `+4`'e, `ROOF_PLANT_DEPTH` 7'den 2'ye düşürüldü.
- Aynı seed/kırpma önce(R048-fixed)/sonra(R049) kanıtı: `once-sonra-r049.png`; yakın plan: `impl3-zoom17.png`, `impl3-zoom02.png`, `impl3-low3.png` -- kiremit kümesi artık saçak/gutter çizgisinde, pencere/balkon/çamaşır detayları hâlâ tam görünür.
- AÇIK KALAN, raporlanan sınır: çok yüksek zıplamalarda (uçuş ortası, henüz inmemiş), şaftın UZUN ORTA bölümü hâlâ pencere/balkon bandını düz, kesintisiz bir dikdörtgen olarak kesiyor -- bu, yalnızca BAZ-ÇATI birleşimine odaklanan bu turun kapsamı dışında (prep doc da bunu "yalnız Y koordinatıyla çözülemez" diye ayrı işaretlemişti); düzeltilmedi, iddia edilmiyor.
- Kilitli alanlar (jump/charge/collision/score/kamera/procedural/RNG) dokunulmadı; scope SHA-256 karşılaştırması R048-fixed taban hash'iyle birebir eşleşti (yalnız `app/index.tsx`, `render-camera.ts` aynı).
- Testler: tsc temiz, worklet regresyonu+güvenliği PASS, FPS p50 16.7ms (3 tekrarda, ara sıra tekil host blip), Play Again 5/5, `git diff --check` temiz, iOS export PASS, `DEBUG_MODE=false`.
TESLIM_HAZIR: REVIZYON-049 — A/B görsel taslak sonrası modüler kiremit kümesi (B) uygulandı, düz metal bilezik kaldırıldı, pencere/balkon/çamaşır korunuyor, kolon tabanı artık saçak çizgisinde; uçuş-ortası uzun şaftın pencere bandını kesmesi AÇIK KALAN, ayrı bir sorun olarak raporlanıyor (bu turun kapsamı değildi); iPhone görsel kabul testi bekliyor, commit/push/deploy yok.

## REVIZYON-050 (2026-10-01) — iniş kamerası "donma+sıçrama" iddiası: ölçüm turu, KOD DEĞİŞİKLİĞİ YOK
- Kaynak: ScreenRecording_10-01-2026 12-33-43_1.MP4 (R049'un son düzeltmesinden ÖNCE çekilmiş; bu kaydın çatı/kolon görseli bu nedenle R049 için kanıt sayılmıyor). Codex iddiası: ~39.55 sn ve ~84.02 sn civarında 1-2 neredeyse donuk kare, ardından 24-29px kamera "yakalama" sıçraması.
- Hipotez (görevde açıkça ispatlanmamış olarak işaretlenmişti): inişte `vx.value=0` olması, `xFlightBlend`'i aynı karede 0'a düşürüp X kamerasında ani bir sıçramaya yol açıyor olabilir; ayrıca uçuş/iniş takip parametrelerinin (900→400, 0.20→0.30) bu konuda payı olabilir.
- Yöntem: video native çözünürlükte kare kare çıkarıldı (`~/Documents/Codex/carsamba-revizyon050/video-frames/`, her iki zaman penceresi için 120'şer kare); karakter/HUD/martı riskinden uzak sabit bir şerit (`gray[200:650,0:1320]`) üzerinde `cv2.phaseCorrelate` ile kare-kare arka plan hareketi ölçüldü; bayt-birebir kopya kare kontrolü yapıldı; gerçek `src/game/render-camera.ts` kodu `ts.transpileModule`+`vm` ile yüklenip inişin olduğu kare dizisi (vx sıfırlanması + xFlightBlend düşüşü dahil) simüle edildi.
- BULGU 1 (X hipotezi DOĞRULANMADI): her iki zaman penceresinde de ölçülen X ekseni kümülatif kayması ihmal edilebilir düzeyde (~0.38px toplam, 39.55sn penceresi). Gerçek kodla en kötü senaryo simülasyonu (tam şarjlı uçuş → iniş anında vx sıfırlanması) bile kamera POZİSYONUNDA süreksizlik üretmiyor -- yalnızca HIZDA ani bir düşüş var (611→400, ardından düzgün -1100 birim/sn² ivmeyle yavaşlama), ama pozisyon karede ~5.5-6.5 birim düzgün artmaya devam ediyor; "donup sonra sıçrama" paterni simülasyonda da YOK. Tek yönlü ileri-kelepçe (`if (tX < camXRTarget.value) tX = camXRTarget.value;`) zaten geriye sıçramayı engelliyor.
- BULGU 2 (39.55sn, Y ekseni): gerçek, düzgün (süreksizlik yok) ~21.6px kümülatif Y kayması yaklaşık 1 saniyede ölçüldü. Bu, R044/045/047'den beri VAR OLAN, kasıtlı uzun iniş-yerleşme tasarımının (`smoothTimeYStand`/`maxSpeedY`/`maxAccelY`/`targetSmoothTimeY`, ~35 dünya birimlik bir iniş adımı için settle≈2.1sn, tepe hız≈21px/sn, tek tümsekli düzgün ivme eğrisi, faz geçişinde kink yok) gerçek kod simülasyonuyla birebir eşleşiyor -- yeni/farklı bir hata değil.
- BULGU 3 (84.02sn): bu pencerede ölçülen kümülatif Y kayması yalnızca ≈1.7px -- iddia edilen 24-29px büyüklükle UYUŞMUYOR. t=84.058'de düşük güvenirlikli (resp 0.71) tekil bir sıçrama, o karenin görüntüsünde karakterin sakin durduğu ve ölçüm şeridinde bir MARTI geçtiği görülerek açıklandı -- muhtemelen kuş geçişi kaynaklı ölçüm gürültüsü, gerçek bir kamera olayı değil.
- BULGU 4 (genel): her iki 2 saniyelik pencerede de, iniş anlarıyla sınırlı olmayan, YAYGIN bir "sıfıra yakın korelasyon" kare paterni bulundu -- içeriğin efektif ~30fps güncelleme ritmine sahip olmasıyla tutarlı (her 60fps karede bir öncekiyle neredeyse aynı arka plan). Bu, VAR OLAN düzgün ~1sn'lik kamera yumuşatmasının "önce donuyor sonra yakalıyor" gibi ALGILANMASINA, oyun-kamerası kodunda bir kusur olmasa bile, kayıt/çerçeve hızı tarafından katkıda bulunabilir.
- SONUÇ: Görevin kendi talimatı gereği ("Etki doğrulanmazsa keyfi parametre değiştirme, dürüstçe raporla") -- X hipotezi ölçümle REDDEDİLDİ, 39.55sn'deki Y hareketi VAR OLAN kasıtlı tasarımla eşleşiyor (yeni hata değil), 84.02sn'deki iddia edilen büyüklük ölçümle DOĞRULANMADI (muhtemelen gürültü). Bu nedenle `src/game/render-camera.ts` ve `app/index.tsx` kamera bloklarında HİÇBİR KOD DEĞİŞİKLİĞİ YAPILMADI. Scope SHA-256 karşılaştırması bunu doğruluyor: tur başı/sonu hash'leri birebir aynı.
- Açık risk: bu video R049'un son çatı/kolon düzeltmesinden ÖNCE çekildiği için, R049 sonucu bu kayıtla doğrulanmış sayılmaz (ayrı konu). Eğer kullanıcı/Codex YENİ bir (R049 sonrası) kayıtta aynı "donma+sıçrama" hissini yine bildirirse, bu artık bir ölçülebilir hata değil, bir his/ürün kararı (ör. iniş yerleşme süresini kısaltma) olarak ele alınmalı -- ayrı bir revizyon gerektirir.
- Geri dönüş yolu: gerekmiyor -- kod zaten değişmedi; `~/Documents/Codex/carsamba-revizyon050/yedek/` R049-son durumuyla bayt bayt aynı.
- Canlı web kontrolü: `localhost:8081` üzerinde oyun açıldı, R049 kiremit kümesi çatı/saçak hizasında doğru göründü, görsel regresyon yok; manuel kısa test ek bir şey ortaya koymadı (asıl kanıt yukarıdaki video ölçümü ve gerçek-kod simülasyonu).
- Testler: tsc temiz, worklet regresyonu PASS, iOS export PASS, `DEBUG_MODE=false`, `git diff --check` temiz (zaten hiçbir dosya değişmedi).
TESLIM_HAZIR: REVIZYON-050 — iddia edilen iniş kamerası "donma+sıçrama" olayı native-çözünürlük video ölçümü ve gerçek-kod simülasyonuyla incelendi; X ekseni (`vx`/`xFlightBlend`) hipotezi REDDEDİLDİ (ölçülen dx ihmal edilebilir, en kötü senaryo simülasyonunda bile pozisyon süreksizliği yok); 39.55sn'deki Y hareketi VAR OLAN kasıtlı iniş-yerleşme tasarımıyla eşleşiyor; 84.02sn'deki iddia edilen büyüklük doğrulanamadı (muhtemelen martı kaynaklı ölçüm gürültüsü); etki doğrulanamadığı için KOD DEĞİŞİKLİĞİ YAPILMADI (görevin kendi talimatı gereği); iPhone görsel kabul testi bekliyor, commit/push/deploy yok.

## REVIZYON-051 (2026-10-02) — çatı/kolon bütünlüğü: bağımsız inceleme + görsel yön taslakları (KOD DEĞİŞMEDİ)
- Görev: önceki küçük eklemeleri çözüm saymadan mevcut durumu incele; alçak/orta/yüksek kolon için kolonun çatı+cepheyle tek yapı gibi okunduğu taslaklar hazırla; en az iki mimariyi karşılaştır; görsel yön seçilmeden uygulamaya geçme. Kod değişikliği yok (scope SHA-256 tur başı/sonu aynı).
- Neden başarısız (R043–R049): (1) Derinlik hatası — kolon ayağı saçak/oluk çizgisine (çatının ÖN kenarına) oturtulup her şeyin ÖNÜNE çiziliyor; gerçek bir baca/kule çatının eğiminden çıkar, ayağını öndeki kiremitler örter. Biz ayağı kiremitlerin üstüne yapıştırıyoruz → "çıkartma" okunuyor; bilezik/kiremit kümesi yalnız bu ekleme yerini süslüyor. (2) Malzeme/biçim — boyalı sahnede sıva, pencere, kat, gölge var; kolon özelliksiz degrade çubuk; 300px'lik çubuğun mimari karşılığı yok (boru okunuyor). (3) İki ayrı koordinat sistemi — tekrar eden district resmi kolon konumunu bilmiyor; kolon resmin rastgele bir yerine (kiremit, oluk, çatısız orta bölüm) düşüyor. (4) Gerçek üretim dağılımı (8 seed × 120 kolon, gerçek `procedural-course.ts`): kolonların ~%37'sinin tepesi district üst kenarının, ~%12'si saçağın altında; ayrıca district karosunun ~%23'ü (kaynak x≈318–506, balkonlu orta bölüm) çatısız — tek bir "ayak" kuralı hepsini karşılayamaz.
- Mimariler: M1 "arkaya al" (yalnız katman sırası) — orta/yüksekte ayak kusursuz ama tepesi çatı kenarının altındaki %37 kolon gizlenir → oynanış için kabul edilemez. M2 "önde bina + kendi kiremit eteği" — her yükseklikte çalışır ama birleşim yine yapıştırma okunuyor, etek boyalı kiremitleri kapatıyor (R048/R049'un büyük hali). M3 ÖNERİ "hibrit": gövde = boyalı sıva + kat kuşağı + dar pencere + taş taçlık (iniş yüzeyi düz/açık kalır); ayak = district'in AYNI resminden kolon genişliğinde yerel kırpma (gerçek kiremit pikselleri ayağı örter); yüksekliğe göre 4 sürekli durum: kule (eğimden çıkar) / çatı katı (saçağa yakınsa cephe sıvasının yukarı devamı, oluk iki yanda biter) / cumba (saçak altı veya çatısız bölümde korkuluk altı, taş konsollu) / çatısız bölümde korkuluk arkasından çıkış.
- M3'ün asset gereksinimi (Görsel atölye, ayrı onay): kolon gövde modülleri (taçlık, kat modülü, çatı katı, cumba) district üslubunda yeniden çizilmeli; district'in çatısız orta bölümüne net bir taş korkuluk üst hattı eklenmeli (taslakta prova edildi; pencere/balkon/çamaşır korunuyor).
- Taslaklar: `~/Documents/Codex/carsamba-revizyon051/` — `1-taslak-alcak-orta-yuksek.png`, `2-mimari-karsilastirma.png`, `3-tam-ekran-telefon.png`, `4-cesitlilik-seridi.png` (üretici: `mockup.py`, `sweep.py`, `boards.py`). Taslaklar gerçek R049 ekran görüntüsü + gerçek district asset'i üzerine PIL montajıdır; oyunda render edilmedi, iPhone'da görülmedi.
- Bekleyen karar: kullanıcı görsel yönü seçmeli (M3 öneriliyor). Seçilmeden uygulama yok.
TESLIM_HAZIR: REVIZYON-051 — çatı/kolon bütünlüğü için bağımsız inceleme, 3 mimari karşılaştırması ve alçak/orta/yüksek + çeşitlilik taslakları ~/Documents/Codex/carsamba-revizyon051/ içinde; kod değişmedi; kullanıcının görsel yön seçimi (M3 öneri) ve Görsel atölye asset onayı bekleniyor.

## REVIZYON-052 (2026-10-02) — tüm parkurda çatı–platform görsel sistemi: TASARIM teslimi (kod/asset değişmedi)
- Kaynak: `REVIZYON_052_TASK.md` + Codex tasarım notu `PLATFORM_VISUAL_SYSTEM.md`. Kullanıcı R051'in üç yükseklik taslağını yetersiz buldu; bu tur parametrik kural + gerçek veriyle sınır kapsaması. R051 nihai çözüm olarak sunulmuyor.
- Karar önerisi: her platform aynı veriden (`x, topY, width, id, visualType`) üretilen **tek ön-plan modülü**: boyanmaz iniş taşı `[x,x+w]×[topY,topY+7]` → modülün kendi kiremit saçağı (genişlik = w) → oluk + konsol → gövde `max(30, 0.74·w)`, kâgir sıva + köşe taşı, 150 birimlik dikey tekrar, kadraj altına kesintisiz. Arka mahalle aynı resim, %16 hava perspektifiyle geride; modül ona bağlanmaz. Pencere yok (platform genişliği district'in tek penceresinden dar; ölçek bozuyordu, ilk denemede düzeltildi).
- Spring Ninja'dan alınan ilke: kapak gövdeden geniş/farklı malzeme (ölçülen oran 0.85), gövde kesintisiz, okunurluk renk farkından (RGB 38.8 → eşik). Estetik kopyalanmadı.
- Neden eski yöntem bozuluyor (1600 gerçek platform): tepe %65.1 district üstünde, %24.5 kiremit bandında, %10.4 saçak altında; %21.9 çatısız bölümde; oturmuş karelerin %86.4'ünde ekleme yeri ekranda — tek boyalı hatta organik bağlanma geometrik olarak mümkün değil.
- A/B: R051-M3 hibrit tek karede mahalleye daha ait görünüyor ama platformların %45'i özel mod (korkuluk asset'i, çatı katı, cumba) istiyor → öneri tek kurallı modül. Bedel: görünen cephe detayının %12–24'ünü örtüyor (eski %0–8) — açık risk, kullanıcı kararı.
- 20 durum (ilk platform A/B, erken/geç, topY ±320/0, genişlik 38/96, 3× çıkış/iniş, yakın/uzak boşluk, 2–4 görünen, çatısız bölüm, karo dikişi, saçak altı, kısmi kenar, baca): kopuksuz gövde ESKİ 2/20 → YENİ 20/20; iniş yüzeyi her ikisinde 20/20; cephe örtme yeni en çok %24.4 (eşik 25; genel kural 0.78→0.74 ile düzeltildi, id yaması yok).
- Görsel atölye için modül listesi ve tekrar/uzatma kuralları: `~/Documents/Codex/carsamba-revizyon052/out/4-modul-asset-sartnamesi.png` ve rapor §4.
- Kanıt: `~/Documents/Codex/carsamba-revizyon052/` (`REVIZYON_052_RAPOR.md`, `out/0…7-*.png`, `out/cases.json`). Önizlemeler statik oturmuş kare; iPhone/Android görülmedi, uçuş/Game Over/Play Again render edilmedi.
- Bekleyen karar: kullanıcı görsel yönü seçmeli (öneri: tek kurallı ön-plan modülü; cephe örtme ödünleşimi kabul mü?). Kod entegrasyonu ancak bundan sonra.
TESLIM_HAZIR: REVIZYON-052 TASARIM — parametrik ön-plan modül kuralı, 20 durumlu gerçek-veri panosu, 2 seed + geç oyun tam ekran, etiketli sınır durumları, A/B (M3 vs öneri), modül/asset şartnamesi ~/Documents/Codex/carsamba-revizyon052/ içinde; kod/asset değişmedi; kullanıcının görsel yön seçimi bekleniyor.

## REVIZYON-053 TASARIM (2026-10-02) — çatı ile platform gerçekten tek yapı: iki sahne mimarisi (kod/asset değişmedi)
- Kaynak: `REVIZYON_053_TASK.md`. Kullanıcı R052'yi görsel olarak kabul etmedi (dar kuleler evlerin ÖNÜNDE ayrı duruyor). R052'nin 20/20 maskesi bu hatayı geçer saymaz.
- Aynı gerçek veriyle (R052'nin 20 durumu + seed A/B + geç oyun S2) iki yön karşılaştırıldı:
  - **D1 — parkurdan üretilen ön-plan mahalle (ÖNERİLEN):** her platform bir binanın teras çatısı. İniş taşı tam `x/topY/width`; altında oynanamaz ön kiremit eğimi (trapez), oluk ve cephe. Cephe genişliği komşu boşluklardan (en az 44 birim sokak kalır). Kat modülleri eski district bitmap'inden taşındı (kepenk, kemerli pencere, balkon, çamaşır, boru). Eski resim orta-plana itildi (0.45 ölçek, pus, parallax); aynı derinlikte rakip çatı çizgisi yok.
  - **D2 — parkura uyarlanan bitmap segmentleri (BAŞARISIZ):** dar platformda ev eziliyor; yüksekte ayna-tekrar bariz; eşit ölçekte ev karakterden küçük kalıyor. Yalnız geniş platformda kabul edilebilir. Görev ölçütüne göre başarısız sayıldı, D1'e dönüldü.
- Görsel değerlendirme (maskeye dayanmadan): 1x telefon ekranında D1'de karakter bir evin teras çatısında duruyor; teras, kiremit ve cephe aynı binaya ait okunuyor. R052'deki "önde direk" hissi yok. Su, silüet ve vapurlar daha çok görünüyor.
- Taşınan / kaybolan ayrıntılar: kepenkli/kemerli pencere, balkon, çamaşır, oluk ve boru taşındı. Sarmaşık ve özgün kompozisyon (ortadaki balkonlu cumba, uzun ip) ön planda kayboldu; yalnız orta-planda küçük hâlde duruyor.
- Açık konular:
  - modüller ham kırpma (hale, tekrar);
  - alçak kamerada orta-plan ayna-tekrarı kalabalık;
  - sokak ≈27 px, hedef seçilebilirliği cihazda görülmeli;
  - uçuş kamerası, Game Over/Play Again ve iPhone/Android doğrulanmadı;
  - kullanıcı henüz görselleri incelemedi.
- Gerekli iş (D1 seçilirse): Görsel atölyeden modüler set (kiremit eğim köşe/orta, oluk, en az 8 cephe kat modülü, boru, baca) ve ayna-tekrarsız orta-plan mahalle şeridi; sonra render entegrasyonu.
- Kanıt: `~/Documents/Codex/carsamba-revizyon053/REVIZYON_053_RAPOR.md` ve `out/` (`1a/1b` panolar, `2a/2b/2c` 1x tam ekran, `3` GIF + film şeridi, `4` sınır durumları, `5` ayrıntı A/B, `cases053.json`).
TASARIM_ACIK: REVIZYON-053 TASARIM — D1 (parkurdan üretilen ön-plan bina, teras çatı = iniş yüzeyi) önizlemede "tek bina" okumasına ulaştı; D2 (bitmap segmentleri) başarısız. Kullanıcının görsel incelemesi ve Görsel atölye modüler seti bekleniyor; kod/asset değişmedi, commit/push yok.

## REVIZYON-054 (2026-10-02) — ev ve oynanabilir kolon aynı mimari malzemeden (KOD UYGULANDI)
- Kaynak: `REVIZYON_054_TASK.md`. Kullanıcı: "aynı evdeki desenler neyse kolonlarda da o olmalı." R052/R053 reddedildi; bu tur kod revizyonu yetkilendirildi.
- Karar: her platform, district resminin KENDİ pikselleri ve KENDİ ölçeğiyle (1 kaynak px = 1.9 dünya birimi, gerilme yok) kurulan bir ev:
  - **Çatı:** district'in ana çatı kiremidi, tek parça ve kesintisiz; district'in kendi kalça eğimiyle (47/40) iki yandan kesilmiş trapez. Mahya = mevcut iniş kapağı (tam `p.x/p.topY/p.width`).
  - **Oluk:** district oluğu.
  - **Cephe:** district sıvasının ölçülen tonu/lekesiyle üretilmiş sıva + district'ten alınan gerçek kat dilimleri (kapalı kepenk + kırmızı örtü, taş kemerli pencere, açık kepenk + denizlik, balkon). Dilimlerdeki sıva pikselleri ortak sıvayla değiştirildi (dikdörtgen hale yok); ip izi temizlendi.
  - **Genişlik:** kalça payı komşu boşluklardan (en az 30 birim sokak); dikey kat fazı id hash'inden; cephe ekran altına iner.
  - **Arka sıra:** sabit district aynı malzeme, %90 ölçek, X parallax 0.85, %22 pus — aynı derinlikte ikinci çatı çizgisi yok; pencere/balkon/çamaşır/deniz/silüet korunuyor.
- Kaldırılan: R044–R049 `PlatformSupportView` (bej şaft, korniş/flüt, kiremit kümesi) ve `silh*` yardımcıları, `DISTRICT_ROOT_Y`, `ROOF_PLANT_DEPTH`.
- Görsel değerlendirme (kendi incelemem, maskeye dayanmadan): canlı oyunda ve 20 durumluk panoda çatı–kolon–cephe arka evlerle aynı kiremit, sıva, pencere ve ölçekte; R052'nin "önde direk" ve R053'ün "farklı malzemeli bina" okuması yok.
- Açık konular:
  - kırmızı örtülü kat sık tekrar ediyor (4 kat tipi);
  - çok yüksek platformda ev dar uzun apartman gibi okunuyor;
  - `chimney` tipinin ayrı görseli yok (eskisi gibi);
  - iPhone'da görülmedi.
- Değişen dosyalar: `app/index.tsx`; yeni `assets/environment/district/house/house-{roof-tiles,gutter,facade-column}.png`.
- Geri dönüş: `~/Documents/Codex/carsamba-revizyon054/yedek/app/index.tsx` geri kopyala, `assets/environment/district/house/` klasörünü kaldır.
- Kanıt: `~/Documents/Codex/carsamba-revizyon054/out/` (`live2/` canlı oyun A/B, `1a/1b` panolar, `2a/2b/2c` 1x tam ekran, `cases054.json`).
TESLIM_HAZIR: REVIZYON-054 — oynanabilir platformlar artık district evinin kendi kiremit/kalça/oluk/sıva/pencere malzemesiyle aynı ölçekte kurulan evler; arka mahalle aynı malzemeyle bir sıra geride; fizik/kamera/parkur kodu bayt bayt aynı; canlı web oyunu ve 5× Play Again doğrulandı. iPhone görsel kabulü kullanıcı kaydıyla bekleniyor; commit/push yok.

## POPUP-001 PLAN (2026-10-02) — Silgi Kaçışı ilk oynanabilir prova (uygulamadan önce)
- Kaynak: `POPUP_WORLD_FIRST_PLAYABLE_TASK.md`; yön 05 Silgi Kaçışı + 04 fiziksel pop-up evler. Konsept PNG'leri yalnız referans; oyuna konmayacak.
- Geri dönüş: `app/index.tsx` içinde tek geliştirici anahtarı `VISUAL_MODE: "popup" | "istanbul"`. "istanbul" R054 render ağacının aynısını çizer; R054 asset'leri silinmez. Ek yedek: `~/Documents/Codex/carsamba-popup001/yedek/` + mevcut snapshot (doğrulandı: arşivdeki `app/index.tsx` = tur başı dosya).
- Katmanlar (popup modu, hepsi pointerEvents none):
  1. Sayfa göğü: düz renk gradyan + yarım-ton nokta dokusu (tekrar eden küçük PNG), çizgi roman güneş/bulut PNG'leri yavaş parallax.
  2. Silgi hikâyesi: sol tarafta sayfanın silinip kurşun kalem eskizine döndüğü şerit + sallanan silgi ve kırıntılar — EKRAN-UZAYINDA ama dünya katmanının ARKASINDA; karakteri/platformu/boşluğu fiziksel olarak hiçbir boyutta örtemez. Sayaç/takip/ölüm yok.
  3. Arka sayfa çizimi: tepeler, servi, kırmızı çatılı küçük evler — tek tekrar eden karo, dünyaya Y-kilitli, X parallax.
  4. Ön plan pop-up ev (havuz slotu başına, hep monte): çatı = sol kalça + orta tekrar (tam `p.width`) + sağ kalça; karton duvar sütunu (pencere/kepenk/çiçeklik, dikey tekrar), sağ karton yan yüz, beyaz kesik kenar, kat izi, sayfaya düşen gölge, sayfa zeminine ayak/tab; sabit dünya `PAGE_FLOOR_Y`'de sayfa zemini.
  5. İniş kapağı (`PlatformView`), karakter, HUD, Game Over aynı.
- Asset'ler kodla üretilecek (PIL, çizgi roman: koyu kontur, düz renk, yarım-ton) ve `assets/popup/` altında ayrı katmanlar olarak durur; düşük çözünürlük, az yüzey.
- Dokunulmayacak: `src/game/*` (fizik, charge, landing, course, RNG, render-camera), kamera blokları, Play Again akışı.
- Test: TypeScript, worklet, iOS export, canlı web (sabit seed A/B: başlangıç, iniş dizisi, uzun sıçrayış, Game Over/Play Again), R054 ile aynı seed/viewport önce-sonra, src/game hash.

## POPUP-001 (2026-10-02) — Silgi Kaçışı ilk oynanabilir prova: TESLİM
- Uygulandı (plan yukarıda): `app/index.tsx` içinde geliştirici anahtarı `VISUAL_MODE` (şu an `"popup"`). `"istanbul"` yapılınca R054 render ağacı değişmeden çizilir; R054 asset'lerinin hiçbiri silinmedi. Anahtar bu turda iki yönde de canlı oyunda denendi.
- Sahne katmanları (popup):
  - çizgi roman gök, güneş ve bulut (yavaş parallax);
  - arka sayfa çizimi: tepeler, servi, küçük kırmızı çatılı evler (tekrar eden karo, dünyaya Y-kilitli, X parallax 0.5);
  - solda silinmiş sayfa şeridi (kurşun kalem eskiz + silgi kırıntıları) ve sallanan silgi. İkisi de dünya katmanının ARKASINDA, dokunmayı almıyor (pointerEvents none); karakteri, platformu veya boşluğu hiçbir cihazda örtemez. Sayaç, takip ve ölüm yok;
  - ön planda her platform bir karton pop-up ev: kendi kiremit çatısı (kalça | tam `p.width` | kalça), karton duvar (kepenk, çiçeklik, kemerli pencere), katlanmış sağ yan yüz, beyaz kesik kenar, sayfaya düşen gölge, kat izi, sayfa zeminine yapışık iki tab. İniş kenarı mevcut kapak (tam `p.x/topY/width`).
- Asset'ler kodla üretildi (`assets/popup/*.png`, 9 dosya, toplam ≈0.5 MB). Konsept PNG'leri oyuna konmadı.
- Değişmeyen: `src/` altındaki her dosya SHA-256 aynı. Ayrıca `app/index.tsx` içindeki parkur üretimi, `initWorld`, düşüş/Game Over, kamera, `worldStyle`, giriş ve `PlatformView` blokları yedekle metin olarak aynı. Aynı seed'de iki modda skorlar ve Game Over anları birebir aynı çıktı.
- Görsel değerlendirme:
  - çatı kenarı her karede seçiliyor; karton yan yüz, gölge ve tab'lar pop-up okumasını veriyor; karakter kimliği korunuyor;
  - zayıf yanlar: yüksek platformlar (topY −320) çok katlı dar karton kuleye dönüşüyor (fizik geometrisi sabit); renk dünyası konsept 05'ten sade; arka sayfa ve duvar varyasyonu az (tek duvar sütunu, tek tepe karosu).
- Kanıt: `~/Documents/Codex/carsamba-popup001/out/` — `1a/1b-once-sonra-seed*.png` (canlı, aynı seed R054/popup), `1c-popup-seed12345.png`, `popup/` ve `istanbul/` ham kareleri, `perf_playagain.json`.
- iPhone'da görülmedi.
TESLIM_HAZIR: POPUP-001 — Silgi Kaçışı pop-up ilk oynanabilir prova, `VISUAL_MODE` anahtarıyla R054'e anında dönüş; src/ değişmedi; canlı web + iOS export + 5× Play Again geçti; kullanıcının iPhone denemesi bekleniyor; commit/push yok.

## POPUP-002 (2026-10-03) — onaylı Pop-up arka planın oyuna uyarlanması
- Kapsam: yalnız Popup arka planı. Platform/çatı, fizik, kamera, parkur ve RNG değişmedi; `VISUAL_MODE` İstanbul anahtarı çalışıyor.
- Kaynak: onaylı `background-target.png` (850×1850).
- Denenen ve BIRAKILAN yol (A): gök ve manzara ayrı ayrı dikişsiz yatay karolara bölündü, ardından 4 karoluk "uzun şerit" yapıldı. Dikiş görünmüyordu ama:
  - köprü, kasaba ve yelkenli ~343 px ekran periyodunda yineleniyordu;
  - uzun şeritte de dağ silüeti ve orman dizisi 610 kaynak px'te tekrar ediyordu;
  - su ve kıyıda klon lekeleri, bazı evlerde silme izleri vardı.

  Kullanıcının iki QA notu da bu sonuçları doğruladı; A oyun asset'i olarak kabul edilmedi.
- Seçilen yol (B, kullanıcının önerisi):
  - onaylı resim TEK ekran-sabit mat olarak kullanılıyor: yatayda kaymaz ve döşenmez, ekran yüksekliğine oturur, yanlardan taşar;
  - kamerayla yalnız küçük, sınırlı bir dikey kayması var (en fazla 56 px);
  - resmin gömülü bulut ve kuşları temizlendi; hareket eden bulutlar aynı resimden kesilen 3 ayrı sprite, kuşlar mevcut `AmbientBirds`, güneş mevcut sprite;
  - sayfa zemini dünyaya bağlı ve kâğıt rengi (#f2d2a9); manzarayı önden örtüyor. Resmin kendi sayfa ve çiçek bandı kullanılmadı (tek sahiplik).
- Görsel değerlendirme: kalite onaylı resimle birebir; tekrar, klon izi veya çift kuş yok; aynı ekranda her bulut tek kopya. Ödünleşim: uzak manzara yatayda sabit kaldığı için derinlik hissi yalnız bulut ve kuş hareketinden geliyor.
- Açık risk: koyu HUD skor yazısı ("0 / BEST") koyu mavi gökte zor okunuyor. HUD bu turun kapsamı dışında; ayrı karar gerekiyor (açık renk veya gölgeli skor).
- Kanıt: `~/Documents/Codex/carsamba-popup002/out/`
  - `1-once-sonra-canli.png`;
  - `live2/` (canlı kareler);
  - `motion/popup2-A-vs-B-karsilastirma.png`, `motion/popup2-A-vs-B-hareket.gif`;
  - `motion/popup2-ardisik-12-ekran.png` (A'nın tekrar kanıtı).
- Değişen dosyalar: `app/index.tsx`; yeni `assets/popup/popup2-backdrop-full.jpg`, `popup2-cloud-{a,b,c}.png`. Eski `popup-back-hills.png` ve `popup-cloud-1.png` dosyada duruyor, artık kullanılmıyor.
- Geri dönüş: `~/Documents/Codex/carsamba-popup002/yedek/index.tsx`; İstanbul için `VISUAL_MODE = "istanbul"`.
TESLIM_HAZIR: POPUP-002 — onaylı Pop-up arka plan ekran-sabit tek mat + ayrı hareketli bulut/kuş + dünyaya bağlı sayfa zemini olarak entegre edildi; döşeme/tekrar yolu kalite gerekçesiyle bırakıldı; src/ ve oyun blokları değişmedi; iPhone'da görülmedi; HUD okunurluğu açık risk; commit/push yok.

### POPUP-002 kabul düzeltmesi (2026-10-03) — HUD/ipucu okunurluğu (yalnız Popup dalı)
- Sorun: yeni koyu mavi gökte koyu skor (#204653), `BEST` ve `Hold to charge` ipucu okunmuyordu; skor için ölçülen kontrast 2.0:1. Bu, yeni arka planın doğrudan regresyonuydu.
- Düzeltme (`app/index.tsx`, yalnız `POPUP` iken uygulanan ek stiller):
  - skor ve `BEST`: beyaz metin + sıkı koyu gölge; boyut ve konum aynı;
  - ipucu: beyaz metin, küçük yarı saydam koyu zemin üzerinde.
- İstanbul modu aynı stilleri kullanmaya devam ediyor; dünya, fizik, kamera, parkur ve platformlar değişmedi.
- Ölçülen kontrast: skor/BEST 5.0:1 (WCAG AA), ipucu 11.3:1.
- Kanıt: `~/Documents/Codex/carsamba-popup002/out/2-hud-once-sonra.png` (başlangıç / uçuş / Play Again, önce-sonra) ve `out/live3-hud/`.
TESLIM_HAZIR: POPUP-002 (HUD düzeltmesi) — Popup HUD ve ipucu koyu gökte okunur; tsc/iOS export geçti; iPhone kontrolü bekleniyor; commit/push yok.

## ISTANBUL-GERIDONUS-001 (2026-10-05) — kullanıcı kararı: İstanbul (R054) görünümü yeniden etkin
- Karar: son Pop-up oyun içi görünümü, onaylanan pop-up konseptinin kitaptan/sayfadan yükselen bütüncül dünyasını karşılamadı. Kaydedilmiş İstanbul (R054) görünümü yeniden açıldı.
- Değişiklik: yalnız `app/index.tsx` satır 157 → `const VISUAL_MODE = "istanbul" as "popup" | "istanbul";`. `as` yazımı, TypeScript'in sabit karşılaştırmayı daraltıp hata vermesini önlüyor; davranışa etkisi yok.
- Pop-up denemesi KORUNDU:
  - kod: `PopupHouseView`, popup katmanları, HUD stilleri;
  - asset'ler: `assets/popup/`;
  - belgeler: POPUP-001/002 kayıtları;
  - yedekler: `~/Documents/Codex/carsamba-popup00{1,2}/`, `~/Documents/Codex/carsamba-istanbul-geridonus-001/yedek/index-popup-active.tsx`.
  - Hiçbir şey silinmedi.
- Pop-up'ı yeniden açmak için aynı satırı `"popup" as "popup" | "istanbul"` yapmak yeterli.
- Fizik, kamera, parkur, karakter ve puanlama değişmedi.
- Kanıt: `~/Documents/Codex/carsamba-istanbul-geridonus-001/out/istanbul-geridonus-canli.png` (başlangıç, uçuş, Game Over, Play Again).
TESLIM_HAZIR: ISTANBUL-GERIDONUS-001 — İstanbul R054 görünümü tek satırlık anahtarla etkin; Pop-up korunuyor; tsc/iOS export/canlı web/Play Again geçti; commit/push yok.

## REVIZYON-055 (2026-10-05) — İstanbul: kamera önden bakış, düşüş kapsamı, katman birliği
- Kaynak: `REVIZYON-055-BRIEF.md` + iPhone kaydı `ScreenRecording_10-05-2026 13-56-18_1.MP4` (42,7 s, 59,8 fps). Kareler: `~/Documents/Codex/carsamba-revizyon055/video/w1..w5`.
- DOĞRULANAN BULGULAR (video + kod + ölçüm):
  1. 15,95–16,65 s uzun atlayışta iniş evi ~1 s boyunca kadrajda yok; 17,0 s'de sağ kenardan giriyor, 17,35 s'de iniş. Kodda render kamerası X ve Y'de yalnız "duran platformdan sonraki İLK platform"u hedefliyordu.
  2. Gerçek parkur fizik simülasyonu (8 seed × 120 kalkış × 5 şarj): sabit basışlı atlayışların %23,1'i ilk platformu aşıp daha ileriye iniyor. Kalkıştan iniş evinin sonuna kadarki mesafe tipik olarak 651 dünya birimi, ekran ise 629.
  3. 33,1–34,9 s: kalkış evi soldan çıkarken sağda yalnız alt şeritte çatılar kalıyor; karakter düşüp Game Over oluyor. Ev görünümleri havuzda her zaman monte; ölçümle komşu platformlar arası en büyük düşüş 203 dünya birimi, ekranın görünen alt payı 449. Yani ilerideki evler ekran dışında değil; kadrajın en altında, aynı malzemeli arka çatı bandına karışıyorlar.
  4. Play Again ve başlangıç doğru çalışıyor; yükleme veya unmount hatası kanıtı yok.
- HİPOTEZ (doğrulanmadı): videodaki evlerin alt %5–10'a inmesi, ardışık hızlı atlayışlarda Y kamerası henüz oturmadan yeni atlayış başlamasından kaynaklanıyor olabilir. Simülasyon her atlayışı oturmuş kadrajdan başlattığı için bu durumu üretmedi.
- UYGULANAN (yalnız `app/index.tsx`, yalnız render kamerası ve arka bant):
  1. **Kamera:** kalkışta, fiziğin kendi `advanceFlight` + `findFootLanding` adımları salt-okunur tekrarlanarak gerçek iniş evi bulunuyor (`predictLandingTarget`); ıskalamada yörüngenin en yakın geçtiği ev seçiliyor.
     - X koridoru bu evi R046 hız önden bakışıyla birlikte hedefliyor;
     - hızlı uçuş takibi, hedefin kadraj dışında kalan payına göre kesintisiz devreye giriyor;
     - Y uçuş hedefi aynı evin yüksekliği.
     - Hedef kalkışta sabitleniyor (uçuş ortasında değişip sıçrama yapmıyor); ileri-monoton kelepçe ve iniş/Game Over kameraları aynı.
  2. **Görsel birlik (tek kontrollü aday):** arka İstanbul çatı bandı ölçek 0,90 → 0,78, X parallax 0,85 → 0,80, pus %22 → %30. Aynı malzeme iki derinlikte artık farklı pencere boyunda okunuyor ("bir sokak geride"). Oynanabilir evler değişmedi.
- Değişmeyen: jump/charge/landing/score, procedural course/RNG, fizik kamerası (camX/camY), karakter. `VISUAL_MODE` anahtarı ve Pop-up yolu korunuyor.
- Kanıt (`~/Documents/Codex/carsamba-revizyon055/`):
  - `out/1-once-sonra-pano.png` (normal, uzun, ıskalama/düşüş, Game Over → Play Again; canlı web 390×844);
  - `out/3-arka-bant-once-sonra.png`;
  - `out/cmp*_*.png` (uçuş boyunca 5 kare + oturma);
  - `sim/*.json`;
  - `out/perf_playagain.json`.
- Sonuç ve açık konular:
  - uzun atlayışta hedef artık daha erken görünüyor (simülasyon: iniş öncesi tipik 0,58 → 0,72 s, en kötü %10'luk dilim 0,45 → 0,63 s);
  - canlı tam şarj örneklerinde fark küçük, çünkü R046 ileri bakışı zaten vardı; asıl kazanç orta-yüksek şarjda;
  - görsel birlik ölçülü bir iyileşme; "tek şehir" kabulü kullanıcı gözüne bağlı;
  - iPhone'da görülmedi.
- Geri dönüş: `~/Documents/Codex/carsamba-revizyon055/yedek/index.tsx` geri kopyalanır (R054 İstanbul hâli).
TESLIM_HAZIR: REVIZYON-055 — gerçek iniş tahminine dayalı render-kamera önden bakışı + arka bant derinlik adayı; fizik/parkur/puan değişmedi; tsc/worklet/iOS export/canlı web/5× Play Again geçti; iPhone kabulü bekliyor; commit/push yok.

## REVIZYON-056 (2026-10-06) — kamera hız nabzı + arka çatı bandı A/B
- Kaynak: `REVIZYON-056-BRIEF.md` + iPhone kaydı `ScreenRecording_10-06-2026 13-42-11_1.MP4` (53,6 s, 54,1 fps).
- DOĞRULANAN:
  1. Video (alt bölge faz-korelasyonu, 0,1 s pencereler): tek uçuş içinde yatay ekran hızı inip yeniden artıyor. 13,2–14,4 s: −320 → −362 → −274 → −328 → −219 … −149 → −236 → −285 pt/s.
  2. Gerçek kod simülasyonu (8 seed, şarj 0,75/0,9/1,0; ilk platformu aşan 1132 iniş): R055 X kamerası inişlerin **%68,2**'sinde uçuş içinde yeniden hızlanıyor. Neden: kare kare değişen koridor ve kadraj dışı payına bağlı hızlı takip harmanı. Hedef sınırları ve takip limitleri uçuş içinde sürekli değiştiği için kamera yavaşlayıp tekrar hızlanıyor.
- UYGULANAN:
  - **Kamera:** kalkışta tek bir yatay hareket planlanıyor. Başlangıç mevcut render hedefi, bitiş iniş evinde durunca kameranın isteyeceği kadraj; hareket beşinci dereceden yumuşak eğriyle (iki uçta hız ve ivme sıfır) tahmin edilen uçuş süresinin %62'sinde tamamlanıyor. Tek sınır: oyuncu ekranın sol %12'sinden dışarı itilmiyor. Uçuş sırasında ikinci bir yumuşatma filtresi yok.
  - Y kamerası, fizik kamerası ve parkur/zıplama/iniş/puan değişmedi.
- Kamera ölçümü (simülasyon, önce → sonra):

  | Ölçüt | R055 | R056 |
  |---|---|---|
  | Uçuşta yeniden hızlanma | %68,2 | %0 |
  | İniş sonrası dahil yeniden hızlanma | %68,2 | %0 |
  | Hedef görünürlüğü p10 | 0,617 s | 0,650 s |
  | Hedef görünürlüğü p50 | 0,717 s | 0,733 s |
  | Oyuncu en sol konumu | 0,179 | 0,179 |

  Normal şarjda (0,25–0,5) her iki sürümde de yeniden hızlanma %0 ve görünürlük aynı.
- **Arka çatı bandı A/B** (aynı seed/basış, canlı web 390×844):
  - Kapalıyken oynanabilir evler denize ve uzak İstanbul'a karşı belirgin.
  - Ancak kamera alçaldığında uzak resmin alt kenarı bitiyor ve evlerin altında düz mavi boşluk kalıyordu (kanıt: `out/off_low/`).
  - Çözüm: uzak resmin kendi boyalı çatı şeridi aşağıya aynalanıp pus ve bulanıklıkla düşük kontrastlı silüete çevrildi (`assets/environment/bosphorus-low-silhouette.jpg`). Oynanabilir cephe yeniden kullanılmadı.
  - Silüetle boşluk kalmadı (`out/off_sil/`), bu yüzden **band kapalı aday etkinleştirildi**: `SHOW_BACK_DISTRICT = false`.
- Değişen dosyalar: `app/index.tsx`; yeni `assets/environment/bosphorus-low-silhouette.jpg`.
- Geri dönüş:
  - R055 band görünümü: `SHOW_BACK_DISTRICT = true` (tek satır);
  - tüm tur: `~/Documents/Codex/carsamba-revizyon056/yedek/index.tsx` geri kopyalanır.
  - Pop-up anahtarı korunuyor.
- Açık: tepe yatay kamera hızı biraz daha yüksek (örnek tam şarjda 557'ye karşı 480 pt/s), ama tek tepe. Silüetin aynalı alt kısmı yansıma gibi okunabilir. Fotoğrafik deniz ile çizilmiş evlerin dil farkı bu turun kapsamı dışında. iPhone'da görülmedi.
- Kanıt (`~/Documents/Codex/carsamba-revizyon056/out/`):
  - `1-ab-arka-bant.png`;
  - `2-kamera-hiz-profili.png`;
  - `3-kamera-canli-once-sonra.png`;
  - `off_low/` ve `off_sil/` (silüetten önce/sonra);
  - `perf_playagain.json`;
  - ayrıca `../sim/xcam_profile*.{cjs,json,txt}`, `../video/flow.json`.
TESLIM_HAZIR: REVIZYON-056 — kalkışta planlanan tek yatay kamera hareketi uçuş içi yeniden hızlanmayı %68,2 → %0 indirdi (R055 erken hedef görünürlüğü korundu); arka çatı bandı kapalı + düşük kontrastlı uzak silüet aday olarak etkin; tsc/worklet/iOS export/canlı web/5× Play Again geçti; iPhone kabulü açık; commit/push yok.

## REVIZYON-057 (2026-10-06) — kamera geçişi: iniş sonrası sert durmanın giderilmesi
- Kaynak: `REVIZYON-057-BRIEF.md` + iPhone kaydı `ScreenRecording_10-06-2026 14-56-30_1.MP4` (88,9 s, 59,9 fps). Kullanıcı: "kamera geçişleri çok sert". R056 cihazda başarılı sayılmadı.
- Video ölçümü: oynanabilir ev bölgesinde (y 1500–2750) Lucas-Kanade köşe izleme; en büyük yer değiştiren yarı = oynanabilir evler (uzak katman ~0,06 kayıyor). Zamanlar 0,33 s'lik montajdan (±0,17 s).

  | Geçiş | Kalkış | Tepe | İniş / Game Over | İzleme |
  |---|---|---|---|---|
  | Normal | ≈30,6 s | — | ≈31,5 s | X hızı ≤47 pt/s, sorun yok; güvenilir |
  | Tam basış | ≈24,8 s | ≈25,3 s | ≈25,85 s | −45, −205, −399, −343, −294, **−90**, −25 pt/s; uçuş içinde sert yavaşlama; MAD p90 49 |
  | Uzun | ≈33,9 s | — | ≈35,0 s | −359 … −236 → **−69**; MAD p90 95 (bu pencere daha az güvenilir) |
  | Ölüm | ≈21,5 s | — | Game Over 23,0 s | 492 tepe, yumuşak sönüm; MAD p90 7 |

- Kök neden (gerçek kod simülasyonu: R055/R056 aynı seed/basış; 60, 30, 120 fps; 50/100/150 ms takılma): başarılı inişlerde en sert frenin (> 2000 pt/s²) 31 örneğinin
  - 24'ü inişten ~0,2 s sonra takipçinin hızı tek karede sıfırlaması (`stepRenderAxis` hedefi geçmeme kuralı),
  - 7'si iniş karesinde hız sınırı basamağı (örn. 305 → 248 pt/s).
  - İkisinin ortak nedeni: inişte takipçinin uçuş sınırlarından (hız 900, ivme 3400) duruş sınırlarına (400 / 1100) tek karede geçmesi.
- TEK DÜZELTME (`app/index.tsx`): planlı bir uçuş indikten sonra X takipçisinin hız/ivme/yumuşatma sınırları duruş değerlerine 0,5 s'de sürekli devrediliyor (`CAM_HANDOFF_S`). Hedef, önden bakış, plan, Y kamerası, fizik ve parkur aynı.
- Sonuç:
  - Simülasyonda (başarılı inişler): sert durma 60 / 30 / 120 fps'te %5 / 8,5 / 4,6 → %0. Durma freninin p95'i 3648 / 2206 / 6572 → 1260 / 1254 / 1262 pt/s². 150 ms takılmada ve inişe yakın 100 ms takılmada da sert durma %0.
  - Hedef görünürlüğü (p10 / p50 0,65 / 0,77 s), oyuncu güvenliği ve yeniden hızlanma (%0) R056 ile aynı.
  - Canlı web (aynı seed/basış, ekran akışı + ev izleme): R056'da 1000 ms basışta inişte ~70 → 0 pt/s tek adımda duruş; R057'de 0'a yumuşak sönüm (`out/1-canli-kamera-hiz-once-sonra.png`).
- Açık / çözülmeyen:
  - Uçuş ortasındaki "hızlı tepe → yavaşlama" şekli (R056 planı: 0,45 s'de ~530 pt/s, sonra ~350 pt/s sınır düzlüğü) değişmedi. Videoda 25,3 s'deki sert yavaşlama kısmen bundan kaynaklanıyor olabilir. Planı inişe kadar uzatmak denendi; ek fayda ölçülmedi, görünürlük düştü, uygulanmadı.
  - Ölüm geçişindeki ikinci hareket (simülasyonda ölümlerin ~%15'i) bu turda değiştirilmedi.
  - Gerçek iPhone hissi doğrulanmadı.
- Geri dönüş: `~/Documents/Codex/carsamba-revizyon057/yedek/index.tsx` geri kopyalanır (R056 hâli). Arka bant/silüet ve Pop-up anahtarları değişmedi.
TESLIM_HAZIR: REVIZYON-057 — inişte kamera takip sınırlarının sürekli devri ile iniş sonrası sert durma giderildi (simülasyonda sert durma %0, fren p95 ≈ 3× düştü; canlı web grafiğinde doğrulandı); hedef görünürlüğü ve oyuncu güvenliği korundu; uçuş içi tepe-yavaşlama şekli açık risk; iPhone kabulü bekliyor; commit/push yok.

## REVIZYON-058 — Spring Ninja yatay kamera ve uzak görüş (2026-10-08)
TESLIM_HAZIR — gerçek iPhone kabul testi bekleniyor. Spring Ninja 10-07 12-18-45 kaydının 26–50s bölümünde 0.5s aralıkla seçilen 47 oyun karesinde karakter merkezi aynı x=422px/1320px (%32.0) ölçüldü; 10-08 13-10-35 Carsamba kaydında uzun atlayışta karakter sağa kayıp kamera sonra yetişiyor. Render X artık her canlı karede karakteri %32 çıpasında tutuyor; tahmini iniş/şarj hızına bağlı X planı ve iniş sonrası handoff kaldırıldı. Görüş zoom'u 0.62→0.40: mevcut karakterin ekran yüksekliği hesabı %11→~%7.1; çatılar da aynı dünya ölçeğinde küçülür. Y render kamerası ve jump/charge/collision/score/RNG/course geometrisi değişmedi. iOS export ve worklet regresyonu PASS, git diff --check PASS; tsc yalnız önceden mevcut src/theme.ts 116/126 tip hatalarını bildiriyor. Önceki app/index.tsx ve config.ts kopyaları shared/backups/camera-spring-2026-10-08 altında. Commit/push yok. iPhone kabulü: kısa ve tam basışlarda karakterin x~%32'de kalmasını, ileriye görüşü, çatının okunurluğunu ve arka plan boşluğu olmamasını kontrol et.
## REVIZYON-059 (2026-10-08) — iki oyun kamera karşılaştırması / sabit dikey düzlem
Kaynak: `ScreenRecording_10-08-2026 15-32-18_1.MP4` (0–~90 sn Carsamba, ~97–162 sn Spring Ninja). Karşılaştırma görseli: `~/Documents/Codex/2026-09-09/referenced-chatgpt-conversation-this-is-an/shared/camera-r059-comparison.jpg`.

- R058'in yatay kadrajı videoda yön olarak doğru: oyuncu yaklaşık ekranın sol üçte birinde kalıyor. Yine de Spring Ninja'nın dinamik/ölçek eşdeğerliği tek kayıtla tam kanıtlanmış değil.
- Açık hata: Carsamba'nın uzak arka planındaki köşeler 14–21,5 sn örneklerinde 0,2 sn başına yaklaşık 5–26 native px dikey kayıyor; Spring Ninja'nın 110–117,5 sn'deki aynı tür sahne referansları çoğu oyuniçi örnekte ~0 px. Spring'in sahne geçişi/overlay kareleri ölçümden ayrı tutulmalı. Bu, R058'de korunmuş render-Y takipçisinin sonucuydu.
- Tek kod düzeltmesi: `app/index.tsx` içindeki görünen `camYR` her hayatın başında/yeniden başlatmada ayarlanıyor ve hayat boyunca sabit kalıyor. Önceki render-Y hedef/iniş tahmin yolu ile artık kullanılmayan iç Y takipçisi kaldırıldı. Dünya fiziği, atlayış, çarpışma, şarj, skor, kamera X, platform üretimi ve RNG korunuyor. Iskalama sonrası Game Over eşiği şimdi sabit **görünür** Y kadrajının altına göre çalışıyor; ölümün ekranda tutarlı anda görünmesi için bu bilinçli zamanlama farkı var.
- Kadraj güvenlik hesabı (440×956 logical örneği; zoom 0,40): izin verilen en yüksek/alçak kule tepelerinde ayak ekran yüksekliği sırasıyla %53,6 / %80,4; maksimum dikey fırlatma apeksinde en yüksek kule üzerindeki ayak %29,4. Bu, yalnız analitik sınır kontrolüdür; gerçek iPhone kabulü değildir.
- Testler: iOS `expo export` PASS (1588 modül), worklet sırası regresyonu PASS, `git diff --check` PASS. `tsc --noEmit` yalnız önceden bilinen `src/theme.ts:116,126` hatalarını veriyor. Önceki `index.tsx`/`config.ts` kopyaları `shared/backups/camera-fixed-y-2026-10-08/` altında.
- Açık: iPhone'da tam şarj, yüksek/alçak kule, ölüm ve Play Again görüntüsü kontrol edilmeli. Çatı/kolonun resim dili ve arka plan uyumu bu kamera düzeltmesiyle çözülmüyor. Commit/push yapılmadı.

## REVIZYON-060 (2026-10-12) — iPhone takılmaları: teşhis ve dar düzeltme
- Kaynak: `ScreenRecording_10-12-2026 11-24-50_1.MP4` (95,7 s, 4780 kare, değişken kare hızı). Zoom 0,40, sabit render-Y, %32 yatay çıpa ve atlama hissi korunuyor. Çatı/kolon sanatına dokunulmadı.
- Video ölçümü (kare PTS + boşluk boyunca dünya kayması):
  - 59 boşluk > 100 ms.
  - Durağan anlardaki boşluklar (11–13 s, 51,99 s, 85 s, 92 s …) değişken kare hızlı kaydın normal davranışı: ekran değişmediği için kaydedici kare yazmıyor. Bunlar takılma değil.
  - Hareketli boşluklarda (29,70 / 72,51 / 65,49 / 45,51 / 79,76 s; 150–317 ms) dünya yalnız ~12 px kaymış. Komşu hızla (~740 px/s) bu tam bir 60 fps karesi (17 ms) eder. Kaydedici kare atsaydı ~110–230 px kayma olurdu. Yani bu anlarda **görüntü gerçekten donmuş**. 36,15 ve 26,25 s'de kayma 0.
  - Hepsi uzun atlayışların alçalma bölümünde; iniş veya skor anında değil.
- Kök neden (kod + simülasyon + web vekil ölçümü; iPhone profili DEĞİL):
  - Havuz görünümleri platformu dizi indeksiyle okuyordu (`platforms.value[index]`). Arkada kalan platform listeden atılınca (`slice`) tüm indeksler kayıyor ve ortalama 4,74, temizlikte 8–9 slotun tamamı başka platforma geçiyordu. Her slot ~15 görünümün yerleşim özelliklerini (width/height/left/top) aynı karede değiştiriyordu.
  - Zoom 0,40 + %32 çıpada kalkış platformu, oyuncu ~572 dünya birimi ötesine geçince temizleniyor; bu da uzun atlayış alçalmasıyla birebir örtüşüyor.
  - Web'de ≥ 100 stil değişikliği olan karelerin %28–50'si > 33 ms, genel oran %0,9.
  - Ayrı değerlendirilenler:
    - kamera/arka plan yalnız transform güncelliyor;
    - asset çözümleme ön yüklemede ve havuzdaki Image'lar hep monte;
    - `dt` sınırı (1/30) donmayı üretmiyor, yalnız sonrasında dünyanın tek kare ilerlemesine yol açıyor;
    - iniş setState'i zamanlamayla uyuşmuyor.
- DÜZELTME (`app/index.tsx`, yalnız render): havuz slotu = `platform.id % POOL` (`slotPlatform`); ev komşuları kimlikle (`platformById`). Temizlik hiçbir slotu değiştirmiyor, yeni platform tek slot değiştiriyor. Liste en fazla 10 platform (simülasyon, havuz 14), çakışma yok.
- Önce → sonra (canlı Expo web, aynı seed/basış; web iPhone değildir):

  | Ölçüt | Seed A | Seed 31337 |
  |---|---|---|
  | Kare başına stil değişikliği p99 | 65 → 26 | 59 → 26 |
  | Uçuş içi ≥ 100 değişiklikli kare | 3 → 0 | 2 → 0 |
  | > 33 ms kare | 11 → 10 | 12 → 7 |
  | > 100 ms kare | 0 → 0 | 0 → 0 |
  | Kare süresi p50 / p95 | 16,7 / 16,8 ms | 16,7 / 16,8 ms |

  Kalan ≥ 100 değişiklikli kareler yalnız Game Over / Play Again sıfırlaması. Aynı seed'de önce/sonra ekran görüntüleri aynı; farklar ekran görüntüsü zamanlaması kaynaklı.
- Testler: `tsc` 0 hata, worklet PASS (`slotPlatform`/`platformById` worklet), iOS export PASS, `git diff --check` temiz, 5× Play Again 5/5, `DEBUG_MODE=false`, telemetri eklenmedi. Jump/charge/collision/score/procedural/RNG ve `src/` değişmedi.
- Geri dönüş: `~/Documents/Codex/carsamba-revizyon060/yedek/app/index.tsx` geri kopyalanır.
- Kalan risk:
  - **Gerçek iPhone'da doğrulanmadı;** kök neden iPhone UI-thread profili ile kanıtlanmadı.
  - Popup modunda ev çizim sırası (z) id sarmasında değişebilir; İstanbul'da evler arası sokak boşluğu olduğu için görünmez.
TESLIM_HAZIR: REVIZYON-060 — uçuş ortası görüntü donmaları (video: 150–317 ms, dünya yalnız 1 kare ilerliyor) platform temizliğinde tüm havuz slotlarının yeniden yerleşimine bağlandı; kimliğe göre slot eşlemesiyle temizlikte slot değişimi sıfırlandı; web vekil ölçümünde uçuş içi güncelleme patlamaları 0; iPhone doğrulaması bekliyor; commit/push yok.

## REVIZYON-061 (2026-10-12) — kısa/yarım basışta takılma ve "kule kaybolma"
- Kaynak: `ScreenRecording_10-12-2026 12-20-18_1.MP4` (75,89 s, 4549 kare). Kare aralığı tamamen düzenli: p50 = p95 = 16,67 ms, > 33 ms boşluk 0. R060'taki 150–317 ms donmaların aynısı bu kayıtta yok.
- Ölçülen (video, kare kare):
  1. **Kule kaybolması bulunamadı.** Her karede ön plan ev çatı profili, kamera kaymasıyla hizalanıp karşılaştırıldı. 0,5–75,8 s'de ≥ 14 sütunluk çatı sıçramalarının hepsi Game Over kartı veya Play Again sıfırlaması (7,7 / 13,7 / 14,2 / 21,1 / 24,9 / 28,8 / 35,6 / 56,6 s). Uçuş içinde hiçbir kule kaybolmuyor, yeniden oluşmuyor veya başka konuma geçmiyor (`video/ev_0_45.png`, `ev56.png`, `pop_*.png`).
  2. **Gerçek kare atlaması var.** Kayıt 60 fps düzenli, ama ön plan kare başına kayması (LK izleme) hareket sırasında 11,1 → 0 → 22,2 px deseni gösteriyor: 43 uçuşta hareketli karelerin %13'ünde görüntü güncellenmemiş, sonraki kare iki adım ilerlemiş. Kısa uçuşlarda (0,2–0,4 s) bu oran %27–46.
  3. **Kalkışta yetişme:** 43 kalkışın 23'ünde ilk hareketli kare 2–4 adım birden ilerliyor (≈ 17–50 ms kayıp).
  4. **R060'tan önce de vardı:** R060 girdi kaydında (11-24-50) aynı ölçümle oran %16,7. R060 bu kusuru getirmedi.
- Kök neden (kod okuma + Reanimated 4.5.1 kaynağı + web'de render sayımı; iPhone profili DEĞİL):
  - Her inişte `setScore`, geliştirme yapısında her bırakmada `setLastJump` ana bileşeni yeniden çiziyor; bu da memo'suz 14 havuz evini yeniden render ediyordu.
  - Web sayımı: bırakma başına 14, iniş/ölüm başına 14 ev render'ı (R059 yedeğinde de aynı).
  - Bu evlerin animasyonlu stilleri her render'da yeniden oluşan fonksiyonlara (`geom`, `colPos`) bağlı. Reanimated `useAnimatedStyle` bağımlılığı closure değerlerinden kurduğu için her render'da ev başına ~13 mapper durdurulup UI thread'de yeniden başlatılıyor.
  - Kalkış ve inişin birbirine yakın olduğu kısa atlayışlarda bu iş kısa uçuşun büyük kısmına denk geliyor; tam basışta uzun uçuşa yayılıyor. Bu, kullanıcı tarifiyle uyumlu.
- DÜZELTME (`app/index.tsx`, en dar): `PlatformHouseView`, `PopupHouseView`, `PlatformView` → `React.memo`. Props'ları SharedValue, memo'lu StyleSheet ve sabit `useCallback`'ler; görünüm, geometri ve davranış aynı. Fark 20 satır.
- Önce → sonra (canlı Expo web, aynı seed, kısa/orta basış 250–350 ms; web iPhone değildir):

  | Ölçüt | Önce | Sonra |
  |---|---|---|
  | Ev render'ı / bırakma | 14 | 0 |
  | Ev render'ı / iniş | 14 | 0 |
  | > 33 ms kare, seed A | 7 | 2 |
  | > 33 ms kare, seed 31337 | 4 | 0 |
  | İniş sonrası 150 ms'de yavaş kare | 5/9 | 0/8 |
  | > 100 ms kare (ilk 1 s hariç) | 0 | 0 |
  | Kare süresi p50 / p95 | 16,7 / 16,8 ms | 16,7 / 16,8 ms |

  - Kule sürekliliği: web screencast'te (1295 kare) çatı sıçraması yalnız Game Over/Play Again'de. Aynı seed'de önce/sonra kareler aynı platform ve evleri gösteriyor; farklar Playwright basış süresi sapmasından iniş noktasının değişmesi.
- Testler: `tsc` 0, worklet PASS, babel iOS OK, `expo export --platform ios` PASS, `git diff --check` temiz, 5× Play Again 5/5, `DEBUG_MODE=false`. Geçici render sayacı kaldırıldı. Zoom 0,40, %32 çıpa, sabit Y, zıplama/şarj/çarpışma/puan/parkur/RNG ve `src/` değişmedi.
- Geri dönüş: `~/Documents/Codex/carsamba-revizyon061/yedek/index.tsx` (R060 hâli) geri kopyalanır.
- Kalan risk:
  - **Gerçek iPhone'da doğrulanmadı;** kare atlamasının tamamının bu nedene bağlı olduğu iPhone profiliyle kanıtlanmadı.
  - Kalan atlamalar başka kaynaklı olabilir: GPU kompozisyon yükü veya ProMotion 120 Hz / kayıt 60 Hz örnekleme.
  - Ana bileşendeki az sayıdaki stil (`puCloudStyle`, `puLift` vb.) yeniden render'da hâlâ yeniden kuruluyor.
TESLIM_HAZIR: REVIZYON-061 — videoda kule kaybolması yok (ölçüldü); kısa basıştaki takılma her kalkış/inişteki 14 ev yeniden render'ı ve ~180 Reanimated mapper'ının UI thread'de yeniden kurulmasına bağlandı; havuz görünümleri memo'landı; web'de olay başına ev render'ı 14 → 0 ve iniş sonrası yavaş kare 5/9 → 0/8; iPhone doğrulaması bekliyor; commit/push yok.

## REVIZYON-062 (2026-10-12) — havada duran iniş çizgileri (kök neden bulundu) + kısa basış ritmi
- Kaynak: `REVIZYON-062_HAZIRLIK.md` + `ScreenRecording_10-12-2026 13-34-15_1.MP4` (51,9 s, kare aralığı düzenli). 11,6–12,2 s kareleri (`~/Documents/Codex/carsamba-revizyon062/video/s119.png`, `out/11_9_kanit.png`): karakter suyun üstünde ince cap çizgisinde duruyor, sağda iki çizgi daha var. Alttaki "evler" oynanabilir evler değil; uzak arka planın boyalı çatı silüeti. **Oynanabilir evler çizilmiyor ya da ilk konumlarında donmuş durumda.**
- KÖK NEDEN (kod + derleme çıktısıyla doğrulandı; cihazda debug konturu yapılamadı):
  - Reanimated 4.5.1 `mappers.ts` `extractInputs`, bir stil mapper'ının girdilerini yalnız updater'ın `__closure`'ındaki SharedValue / dizi / düz nesnelerden topluyor; iç içe worklet fonksiyonunun içine bakmıyor.
  - `PlatformHouseView`'in 13 animasyonlu stili `platforms`'u yalnız iç `geom()` / `colPos()` fonksiyonu üzerinden okuyordu. Gerçek babel-preset-expo iOS derlemesinde (`closure_check.cjs`) **R060 ve R061'de 13/13 updater'ın closure'ında hiçbir SharedValue yok**; bu stiller ilk çalışmadan sonra hiç güncellenmiyor.
  - `PlatformView` (cap) 3/3 ve `PopupHouseView` 10/10 updater `platforms`'a doğrudan abone; bu yüzden cap'ler hareket ediyor, evler etmiyor.
  - R060 ve öncesinde her kalkış/iniş render'ı mapper'ları yeniden başlattığı için evler o anlarda tazeleniyor ve hata büyük ölçüde gizleniyordu (R061'e girdi olan 12-20-18 kaydında havada çizgi yok).
  - R061'in `React.memo`'su bu yeniden başlatmayı kaldırınca evler ilk konumlarında kaldı. **Hata kodda R061'den önce de vardı; R061 onu görünür kıldı.**
  - Web'de yeniden üretilemedi (R061 web karelerinde evler hizalı); web Reanimated yolu cihazdan farklı davranıyor. Bu yüzden web görüntüsü bu hatanın kanıtı ya da çözümü sayılmadı.
- DÜZELTME (`app/index.tsx`, yalnız `PlatformHouseView`): `geom(list)` ve `colPos(k, list)` artık listeyi parametre olarak alıyor; her updater `platforms.value`'yu doğrudan geçiriyor. Derleme sonrası 13/13 updater `platforms`'a abone. Geometri formülleri aynı. Fark 39 satır (yorum dahil).
- Kısa/yarım basış ritmi (ayrı sonuç):
  - Yeni kayıtta kalkışta yetişme (ilk hareket karesi ≥ 2 adım) 2/18. Önceki kayıtta 23/43 idi; R061'in kalkış render'ını kaldırmasıyla uyumlu.
  - Uçuş içi yinelenen kare oranı %29, ama bu kayıtta oynanabilir evler çizilmediği için LK ölçümü farklı bir katmanı (cap, karakter, uzak silüet) izledi. Önceki %13–14 ile **karşılaştırılamaz**, regresyon kanıtı değil.
  - Cihaz UI/JS profili yok. Varsayımla ikinci optimizasyon eklenmedi.
- Testler: `tsc` 0, worklet PASS, `expo export --platform ios` PASS (1588 modül, çıkış 0), `git diff --check` temiz, 5× Play Again 5/5, kare süresi p50 16,7 ms. `src/` ve fizik/kamera/parkur/RNG bloklarına dokunulmadı.
- Geri dönüş: `~/Documents/Codex/carsamba-revizyon062/yedek/index.tsx` (R061). R060 dahil önceki sürümlerde evler yalnız render anlarında güncelleniyordu.
- Açık: iPhone doğrulaması yok; aynı koşullu cihaz A/B ve UI/JS profili hâlâ gerekli. Popup modunun ana bileşen stillerinde (`puLift` vb.) aynı iç içe fonksiyon kalıbı var; İstanbul modunda kullanılmıyor, dokunulmadı.
TESLIM_HAZIR: REVIZYON-062 — havada çizgi hatasının kök nedeni kanıtlandı (ev stillerinin mapper'ı platforms'a abone değildi; memo öncesi render'lar gizliyordu) ve 13/13 updater'ı doğrudan aboneye çeviren render düzeltmesi yapıldı; kısa basış ritmi ayrı ölçüldü, video karşılaştırması bu kayıtta geçersiz; iPhone kabulü bekliyor; commit/push yok.

## REVIZYON-063 (2026-10-13) — kısa/yarım basış görüntü ritmi: teşhis (kod DEĞİŞMEDİ)
- Kaynak: `ScreenRecording_10-13-2026 11-01-03_1.MP4` (61,1 s, 3545 kare; oyun ~21 s sonrası). Bu kayıtta değişken kare hızı var: 21 s sonrası 41 PTS boşluğu (33–183 ms).
- **Ev–cap hizası doğrulandı:** 26–27, 34–35, 57–58 s ve diğer örneklerde (`~/Documents/Codex/carsamba-revizyon063/video/hiza.png`) her iniş çizgisi kendi evinin çatısında; havada tek başına çizgi yok. R062'nin 13/13 SharedValue aboneliği derleme kontrolüyle yerinde.
- Ölçüm (19 uçuş, PTS ile; Game Over/bekleme hariç):
  - Her karede üç katman ayrı izlendi (`layers.py`): ön plan evler, arka mahalle, uzak silüet. Karakterin dikey konumu kırmızı eşofman maskesiyle ayrıca izlendi (`chary.py`).
  - Uçuş türü süreden: kısa < 0,45 s (9), yarım (4), tam > 0,85 s (6).

  | Tür | Uçuş | İç kare | Sabit kalan kare | PTS boşluğu |
  |---|---|---|---|---|
  | Kısa | 9 | 125 | 7 | 2 |
  | Yarım | 4 | 147 | 17 | 0 |
  | Tam | 6 | 397 | 50 | 15 |

- Kesin bulgular:
  1. **Oyun zamanı kaybı yok.** Karakterin uçuş parabolüne serbest uydurulan ivme, temiz uçuşlarda fiziğin beklenen değerinde (3000 px/s²): oyun/duvar zamanı 0,994 / 1,004 / 1,057 / 1,005; > 0,3 s uçuşların medyanı 1,004. Ev katmanının toplam kayması da ≈ 1,00. Oyun döngüsü 33 ms'den uzun donmuyor (dt sınırı 1/30 olduğu için uzun donma oyun zamanı kaybettirirdi).
  2. **Sabit kalan kareler tüm katmanlarda aynı anda ve birebir aynı:** ev, arka, uzak katman ve karakter birlikte duruyor (piksel farkı 0,00). Sonraki karede hepsi 2 adım birden ilerliyor. Yani oyun durumu hesaplanıyor, yalnız o kare ekrana/kayda düşmüyor.
  3. **Kalkışta 3 adımlık ilk kare** (19 uçuşun 8'i: kısa 4/9, yarım 3/4, tam 1/6). 3 adım, dt sınırının izin verdiği 2 adımı aşıyor. Bu, en az iki oyun karesinin hesaplanıp gösterilmediği anlamına geliyor (UI hesap donması değil, sunum/kayıt kaybı). Kısa ve yarım basışta daha sık; şikâyetle uyumlu.
  4. Codex'in 26,55–26,60 s adayı: bu aralıkta tüm katmanlar kare başına düzenli 12,4 px ilerliyor; donma yok. Gerçek sabit kareler 26,668–26,785 s'de, iniş öncesinde.
- Kanıtlanamayan:
  - Sunulmayan karelerin cihaz kompozisyonundan mı, ekran kaydedicisinin örneklemesinden mi kaynaklandığı videoyla ayırt edilemiyor.
  - Kalkış/iniş anındaki React commit'i (geliştirme yapısında `reportJump`/`setLastJump`, inişte `setScore`) ile ilişkisi bir **hipotez**.
  - Cihaz UI/JS profili yok, aynı cihazda A/B yapılamadı.
- Bu yüzden kural gereği **optimizasyon eklenmedi; `app/`, `src/`, `assets/` SHA-256 tur başıyla aynı.**
- Testler (kod aynı): `tsc` 0, worklet PASS, `expo export --platform ios` çıkış 0, 5× Play Again 5/5, web kare süresi p50 16,7 ms. `closure_check`: 13/13 + 10/10 + 3/3 abonelik.
- Geri dönüş: değişiklik yok (R062 yedeği `~/Documents/Codex/carsamba-revizyon062/yedek/`).
- iPhone'da tek sonraki adım: aynı oyunu geliştirme yerine üretim modunda (`npx expo start --no-dev --minify`, dev menüsü kapalı) aç, ekran kaydında 8–10 kısa/yarım basış yap. Kalkışta 3 adım sıçrama ve sabit kareler kaybolursa neden geliştirme yükü/React commit'idir ve dar bir düzeltme yapılır. Sürerse kayıt örneklemesi/kompozisyon tarafı Xcode Instruments (Core Animation FPS) ile ölçülmeli.
TESLIM_HAZIR: REVIZYON-063 (teşhis) — ev–cap hizası doğrulandı; kısa/yarım basış takılmasının oyun zamanı kaybı değil, hesaplanan karelerin gösterilmemesi olduğu ölçüldü (kalkışta 3 adım, sabit kare tüm katmanlarda eşzamanlı); kök neden cihaz verisi olmadan kanıtlanamadığı için kod değiştirilmedi; tek sonraki adım üretim modunda iPhone kaydı; commit/push yok.

## REVIZYON-064 (2026-10-13) — üretim modunda iniş sonu takılması: teşhis, kod DEĞİŞMEDİ — ENGEL
- Kaynak: `ScreenRecording_10-13-2026 12-03-22_1.MP4` (47,26 s, 2627 kare; oyun ~7 s'den sonra).
- **Üretim modu doğrulaması (kısmi):**
  - Videonun 0–7 s'si iPhone kamerasıyla Terminal'deki QR'ı tarıyor; pencere başlığı `npm exec expo start --lan --port 8082 --go --…`, adres `exp://192.168.1.132:8082`.
  - 8082'yi dinleyen süreç PID 6650, başlangıç 11:59:21, komut `expo start --lan --port 8082 --go --no-dev --minify`.
  - Manifest `launchAsset` URL'si `dev=false&minify=true`.
  - Metro istek logu okunamadı; kullanıcının Terminal penceresine bu oturumdan erişim yok. 8081'de ayrıca dev sunucusu da açık. Bu nedenle "bu kayıt üretim paketiyle oynandı" yüksek olasılıklı ama log ile kesinleşmedi.
- Ölçüm (R063 yöntemi; ev/arka/uzak katman LK + karakter y + PTS; `~/Documents/Codex/carsamba-revizyon064/video/`):

  | Tür | Uçuş | İç kare | Sabit kalan kare | Kısmi ilerleyen PTS boşluğu | Tam ilerleyen PTS boşluğu |
  |---|---|---|---|---|---|
  | Kısa | 4 | 31 | 1 | 1 | 0 |
  | Yarım | 4 | 167 | 17 | 0 | 0 |
  | Tam | 11 | 853 | 116 | 43 | 1 |

  1. **Takılma tam basış uçuşlarında yoğun.** 44 PTS boşluğunun 43'ü tam uçuşlarda; kısa/yarım uçuşlarda neredeyse yok.
  2. **Boşlukta oyun da ilerlemiyor.** 33–83 ms'lik PTS boşluklarının 43/44'ünde ev katmanı, arka plan ve karakter yalnız ~1 adım ilerliyor; beklenen 2–5 adım değil (örnek 21,968 s, 67 ms: `out/bosluk_21_97.png`). Kaydedici kare kaçırıp oyun devam etseydi sonraki kare daha büyük adım atardı. Bu yüzden boşluklar yalnız kayıt zamanlaması değil, **o anda ekran/oyun saati de ilerlemiyor**.
  3. Karakter parabolü PTS zamanıyla uydurulduğunda tam uçuşlarda oyun/duvar zamanı 0,91–0,98 çıkıyor; yarım uçuşlarda 0,99–1,00. Tam uçuşlarda ~%2–9 oyun zamanı kaybı ölçümle uyumlu.
  4. **"İniş sonu" yoğunlaşması ölçülmedi:** tam uçuşlarda boşluklar kalkıştan inişe eşit dağılıyor (5 dilimde 11 / 7 / 7 / 10 / 9), sabit kareler de (24 / 25 / 23 / 21 / 23).
  5. Ev–cap hizası korunuyor (havada çizgi yok).
- Hipotez (kanıtlanmadı): PTS boşlukları R062'den sonraki iki kayıtta (R063: 41, R064: 39) var. R062 öncesi iki kayıtta (12-20-18, 13-34-15) > 33 ms boşluk yok. R062'de ev stilleri `platforms`'a abone oldu (spawn/cleanup'ta 14 × 13 stil çalışıyor). Ancak boşluk sayısı (~4 / tam uçuş) platform listesi değişim sayısıyla (~2 / uçuş) uyuşmuyor; videolar eş koşullu değil (dev / no-dev, farklı oturum). **Neden olarak sunulmadı.** Web bu davranışı yeniden üretmiyor.
- Karar: kök neden doğrulanmadığı için **kod değiştirilmedi** (`app/`, `src/`, `assets/` SHA-256 tur başıyla aynı). Fizik, şarj, skor, parkur ve kamera korunuyor.
- **ENGEL:** iPhone UI/JS kare profili olmadan bu boşluğun nedeni (UI thread işi, kompozisyon, ReplayKit kaydının display link'i yavaşlatması) ayırt edilemiyor.
> [DÜZELTME — 2026-10-13, kullanıcı gözlemi] Kullanıcı takılmayı iPhone ekranında oynarken doğrudan görüyor; sorun ekran kaydına özgü DEĞİL. Aşağıdaki "ekran kaydı KAPALI tekrar oyna / ReplayKit kaynaklı mı" ayrımı gereksinimi kaldırıldı. Kayıt yalnız kare zamanı ve görsel örnek olarak kullanılıyor. Devam: REVIZYON-064 (devam) bölümü.
- Tek uygulanabilir sonraki cihaz adımı: iPhone'u Mac'e kabloyla bağla, Xcode → Open Developer Tool → Instruments → "Animation Hitches" şablonunu seç, hedef Expo Go. Aynı `--no-dev --minify` sunucusunda **ekran kaydı KAPALI** 60 s boyunca 10 tam basış yap ve trace'i kaydet. Hitch'ler tam uçuşlarda görünüyorsa ve "Commit/Render" aşamasındaysa UI iş yükü, görünmüyorsa ReplayKit kaydı kaynaklıdır. Trace ile R062 abonelik maliyeti doğrudan sınanabilir.
REVIZYON-064 ENGEL — ölçüm teslim edildi (tam uçuşlarda içerik + oyun saati birlikte duran 33–83 ms boşluklar, iniş sonuna özgü değil); üretim modu manifest/süreçle yüksek olasılıkla doğrulandı ama log ile kesinleşmedi; kök neden cihaz profili gerektiriyor; kod değişmedi; commit/push yok.

## REVIZYON-064 (devam, 2026-10-13) — kullanıcı gözlemi kabul; cihaz ölçüm aracı hazır — ENGEL (cihaz verisi bekleniyor)
- Kullanıcı takılmayı iPhone ekranında oynarken doğrudan görüyor; **sorun ekran kaydına özgü değil.** "Kayıt kapalı tekrar oyna" gereksinimi kaldırıldı. Video yalnız kare zamanı ve görsel örnek olarak kullanılıyor.
- Ek bulgu (gerçek parkur + fizik simülasyonu `~/Documents/Codex/carsamba-revizyon064/sim/list_events.cjs`): uçuş sırasında platform listesi (spawn/cleanup) değişim sayısı tam uçuşta ort. 2,78; yarımda 1,29; kısada 0,38. Web'de 600 ms basışlı 10 tam atlayışta 40 değişim (4/uçuş). iPhone kaydında tam uçuş başına PTS boşluğu ~3,9. Sayılar yakın, ama yarım uçuşlarda (1,3 değişim) boşluk görülmedi; **eşleşme nedensel kanıt değil.**
- Değişen kod (`app/index.tsx`, **yalnız teşhis; normal oyunda kapalı**):
  - `PERF_PROBE` (false): oyunun kendi UI-thread kare geri çağrısından kare aralıklarını sayar; JS-thread rAF boşluklarını ayrıca ölçer. Ekranın üstünde 3 satır gösterir:
    - toplam/uçuş içi > 25 ms ve > 40 ms kare, en büyük kare;
    - uçuştaki liste değişimi ve "liste değişiminin olduğu/sonraki karede takılma" sayısı;
    - JS thread > 25 ms.
  - `HOUSE_AB_FROZEN` (false): tek değişkenli A/B. Evler `platforms` yerine yalnız hayat başında bir kez yazılan bir SharedValue okur (R061 davranışı; evler bilerek yanlış görünür). R062 aboneliğinin maliyetini ayırmak içindir.
  - İkisi false iken davranış R062 ile aynı: kilitli bloklar (`makeNextPlatform`, airborne fizik) metin olarak aynı; `closure_check` 13/13 + 10/10 + 3/3; fark 77 satır (sayaçlar + overlay).
- Web doğrulaması (yalnız aracın çalıştığını gösterir; iPhone kanıtı değil): 8083 portunda ayrı sunucu, 10 × 600 ms.

  | Sürüm | Uçuş içi > 25 ms | Liste değişimi (uçuş) | Listeye yakın takılma |
  |---|---|---|---|
  | A (canlı evler) | 0 / 930 kare | 40 | 0 |
  | B (dondurulmuş evler) | 1 / 929 kare | 40 | 0 |

  Web bu takılmayı üretmiyor.
- Not: kullanıcının 8081 Metro sunucusu kaynak değişikliklerini almıyordu (servis edilen paket eski). Cihaz testinden önce 8082 sunucusu **yeniden başlatılmalı**.
- **Eksik ölçüm (ENGEL nedeni):** iPhone'da aynı oyunda A/B sayaç değerleri.
- **Cihaz adımları:**
  1. `app/index.tsx`'te `PERF_PROBE = true`, `HOUSE_AB_FROZEN = false` yap; 8082'yi kapatıp `npx expo start --lan --port 8082 --go --no-dev --minify` ile yeniden başlat; Expo Go'da aç.
  2. 10 tam basış (uzun bas) + 10 yarım basış; Game Over olursa Play Again. Üstteki 3 satırın fotoğrafını çek (A).
  3. `HOUSE_AB_FROZEN = true` yap, sunucuyu yeniden başlat, aynı 20 basışı yap, fotoğraf (B; evler bilerek kayık görünür).
  4. İkisini de `false`'a geri al.
- Yorum kuralı:
  - "uçuş > 25 ms" B'de belirgin düşerse neden R062 ev aboneliğinin liste değişimindeki iş yüküdür; dar düzeltme (yalnız değişen slotun güncellenmesi) yapılır.
  - Düşmezse ve "listeye yakın takılma" düşükse neden başka bir UI-thread işi; JS satırı yüksekse JS thread'dir. Bu durumda sonraki araç: Xcode Instruments → Time Profiler + Animation Hitches, hedef Expo Go, aynı 20 basış.
- Geri dönüş: `~/Documents/Codex/carsamba-revizyon064/yedek/index.tsx` (R062 hâli). Bayraklar false iken oyun davranışı değişmiyor.
- Testler: `tsc` 0, worklet PASS, `expo export --platform ios` çıkış 0, `git diff --check` temiz, 5× Play Again 5/5 (8083), kare süresi p50 16,7 ms.
REVIZYON-064 ENGEL (devam) — kullanıcı gözlemi kabul edildi (takılma gerçek); kök neden için cihazda tek değişkenli A/B sayacı (PERF_PROBE / HOUSE_AB_FROZEN, varsayılan kapalı) eklendi; eksik olan yalnız iPhone A/B sayaç değerleri; düzeltme bu veriye bağlı; commit/push yok.

### REVIZYON-064 — A koşulu hazır (2026-10-13)
- Değişen dosya: yalnız `app/index.tsx`, tek satır: `PERF_PROBE = true` (satır 167). `HOUSE_AB_FROZEN = false` (satır 168) değişmedi. Önceki hâlle fark yalnız bu satır (`diff` ile doğrulandı). Bu ayar yalnız ölçüm overlay'ini ve sayaçları açar; oyun mantığı, evler ve kamera aynı. `closure_check` 13/13 + 10/10 + 3/3; `DEBUG_MODE=false`.
- Kontroller: `tsc` 0, worklet PASS, babel iOS OK, `expo export --platform ios` çıkış 0 (1588 modül).
- Açılış kontrolü: web 8083'te overlay görünüyor, evler hizalı, sayfa hatası yok (`~/Documents/Codex/carsamba-revizyon064/out/A_acilis_web.png`). Bu yalnız açılış kontrolü; iPhone ölçümü değil.
- Sunucu durumu:
  - Kullanıcının 8082 oturumu (PID 6650, `--no-dev --minify`, 11:59'dan beri) hâlâ açık ve **güncel kodu sunuyor**. iOS üretim paketi indirildi: overlay metni var, `HOUSE_AB_FROZEN` dalı sabit-false olarak paketten atılmış. Yeniden başlatma gerekmiyor.
  - Manifest: `exp://192.168.1.132:8082`, `dev=false&minify=true`.
  - Benim başlattığım 8083 yalnız web/dev doğrulaması için ve bu oturuma bağlı; kullanıcının Terminal'inde kalıcı değil, telefonda kullanılmamalı.
- Kullanıcı adımı: Expo Go'yu tamamen kapatıp aynı 8082 QR'ı ile yeniden aç (üstte 3 satırlık sayaç görünmeli). Görünmezse tek komut, aynı Terminal penceresinde Ctrl+C sonrası: `npx expo start --lan --port 8082 --go --no-dev --minify`.
- B koşulu açılmadı (A sonucu bekleniyor). Hazır adımlar:
  - B için `HOUSE_AB_FROZEN = true`;
  - geri alma: `cp ~/Documents/Codex/carsamba-revizyon064/index-064-probe.tsx app/index.tsx` (iki bayrak false) ya da tam R062 hâli için `~/Documents/Codex/carsamba-revizyon064/yedek/index.tsx`.

### REVIZYON-064 — A sonucu (iPhone, 2026-10-13, `ScreenRecording_10-13-2026 12-57-13_1.MP4`, 154,6 s)
- Sayaç değerleri native üst banttan bağımsız okundu (`~/Documents/Codex/carsamba-revizyon064/videoA/ust_band.png`, 12–154 s'de 10 an). Codex okumasıyla 20/150 s aynı; 80 s'de doğru değerler UI 3712 / uçuş 2117 (Codex 3743 / 2136 okumuştu).
- Son değerler (154 s):

  | Sayaç | Değer |
  |---|---|
  | UI kare | 7433 |
  | UI > 25 ms | 171 (> 40 ms: 139), en büyük 158 ms |
  | Uçuş kare | 4507 |
  | Uçuş > 25 ms | 131 (%2,9) |
  | Uçuşta liste değişimi | 179 |
  | Listeye yakın takılma | 119 |
  | JS > 25 ms | 171 |

- Sayaç tanımları (koddan):
  - Değerler uygulama açılışından beri birikimli; Play Again sıfırlamıyor.
  - UI sayaçları yalnız oyun çalışırken artıyor (`running`); Game Over ekranı sayılmıyor.
  - "Listeye yakın takılma": > 25 ms'lik kare, son liste değişiminin olduğu kare ya da sonraki kare (`pFrames − pListFrame ≤ 1`). Uçuş dışındaki liste değişimleri de pencereyi açıyor, ama yalnız uçuştakiler "liste değişimi(uçuş)"a sayılıyor.
  - JS sayacı RN'de rAF da ana thread display link'ine bağlı olduğu için UI takılmalarını da içeriyor (171 = 171). **Bağımsız JS kanıtı değil.**
- Taban oran kontrolü:
  - Her değişim 2 kare pencere açıyor; uçuş karelerinin ~%7,9'u pencere içinde. Takılmalar bağımsız olsaydı ~13,6 "yakın" beklenirdi; gözlenen 119 (~8,8×).
  - Uçuştaki liste değişimlerinin %66'sı takılmayla sonuçlanıyor.
  - 20 s'lik pencerelerde oran sabit (ör. 40–60 s: 22 takılma / 31 değişim / 19 yakın).
- Sınırlar (nedensellik değil):
  - (1) Pencere, değişimin kendi karesini de içeriyor. Uzun kare sonrası kamera daha çok ilerleyip spawn eşiğini geçebilir; bu ters yönlü bir ilişki ihtimali ve A sayacı bu iki durumu ayırmıyor.
  - (2) Toplam (uçuş dışı dahil) liste değişimi sayılmadı; taban kaba.
  - Tek değişkenli B bu ilişkinin R062 ev aboneliğinden gelip gelmediğini ayıracak.
- Basış türü dağılımı (video, kamera hareket segmentinin süresine göre; ardışık hızlı atlayışlar birleşebilir, yaklaşık): 64 uçuş = 55 tam (> 0,85 s), 4 yarım, 5 kısa. A ağırlıkla tam basış içeriyor; kısa/yarım basış için A'nın istatistiği zayıf. B aynı karışımla (çoğu tam basış) alınmalı.

### REVIZYON-064 — B koşulu hazır
- Değişen dosya: yalnız `app/index.tsx` satır 168 `HOUSE_AB_FROZEN = true` (A ile fark tek satır; `PERF_PROBE = true` aynı). Sayaç tanımları A ile birebir aynı.
- **Uyarı:** B'de oynanabilir evler bilerek yanlış konumda/donuk (iniş çizgileri havada görünür). Bu bir ölçüm koşulu; oyun görseli değil.
- Kontroller: `tsc` 0, worklet PASS, `expo export --platform ios` çıkış 0 (1588 modül). Web 8083 açılışta `[AB: EVLER DONDURULMUS]` etiketi ve havada çizgiler görünüyor, hata yok (`out/B_acilis_web.png`).
- Sunucu: kullanıcının 8082 oturumu (PID 6650, `--no-dev --minify`) B paketini sunuyor (indirilen iOS paketinde "EVLER DONDURULMUS" metni var). Yeniden başlatma gerekmiyor.
- Kullanıcı adımı: Expo Go'yu tamamen kapatıp 8082 QR'ı ile yeniden aç; sayacın sonunda `[AB: EVLER DONDURULMUS]` yazısı görünmeli. A'dakine yakın sayıda tam ve yarım basışla ~150 s oyna ve kaydet.
- Geri alma (B sonrası, sayaç kapalı R062 davranışı): `cp ~/Documents/Codex/carsamba-revizyon064/index-064-probe.tsx app/index.tsx`. Kalıcı performans düzeltmesi B ölçümüne kadar yapılmayacak.

### REVIZYON-064 — B sonucu (iPhone, 2026-10-13, `ScreenRecording_10-13-2026 15-17-25_1.MP4`, 170,15 s)
- Sayaçlar native üst banttan bağımsız okundu (`~/Documents/Codex/carsamba-revizyon064/videoB/ust_band.png`). Codex'in 30/90/150/165 s okumaları doğru. Son okunabilir an (169,5 s): UI 8413 kare / > 25 ms 39 (> 40 ms 33) / max 167; uçuş 4762 kare / **> 25 ms 0** / uçuşta liste değişimi 219 / yakın takılma 0; JS > 25 ms 155. Etiket `[AB: EVLER DONDURULMUS]` tüm anlarda görünüyor.
- A ile karşılaştırma:

  | | A (evler aboneli) | B (evler donuk) |
  |---|---|---|
  | Süre | 154,6 s | 170,2 s |
  | Uçuş kare | 4507 | 4762 |
  | Uçuşta > 25 ms | 131 (%2,9) | 0 |
  | Uçuşta liste değişimi | 179 | 219 |
  | Listeye yakın takılma | 119 | 0 |
  | UI > 25 ms (tümü) | 171 | 39 |

- Sınırlar:
  - Sayaçlar birikimli ve iki oturumun süresi/sahnesi farklı; aynı tohumlu tekrar değil.
  - Uçuş karışımı farklı: A 64 segment (55 tam / 4 yarım / 5 kısa), B 49 segment (41 tam / 1 yarım / 7 kısa). İkisi de ağırlıkla tam basış; **yarım basış için iki ölçüm de zayıf.**
  - B, ev mapper'larını değil ev alt ağaçlarının yeniden düzenlenmesini (layout) de kaldırıyor; B, maliyetin "ev stillerinin liste değişiminde güncellenmesi"nde olduğunu gösteriyor, mapper hesabı ile native layout payını ayırmıyor.
  - Videodan çıkarılan "sıfır adım" kare oranı A %18 (708/3889), B %21 (785/3687): bu video ölçütü A/B'yi ayırmıyor; kanıt olarak uygulama içi sayaç kullanıldı.
  - B'de uçuş dışı UI > 25 ms 39 kaldı (Game Over/Play Again/kalkış çevresi); bu turda incelenmedi.
- Sonuç: B, R064 A'daki uçuş takılmalarının R062 ev aboneliğiyle (her liste değişiminde 14 evin tamamının yeniden stillenmesi) ilişkili olduğunu tek değişkenli olarak destekliyor.

### REVIZYON-064 — Dar düzeltme: liste değişiminde yalnız değişen evler (2026-10-13)
- Önce B görünümü kaldırıldı: `HOUSE_AB_FROZEN = false`, `PERF_PROBE = false` (ölçüm overlay'i nihai oyunda kapalı; teşhis kodu bayrak arkasında kaldı).
- Neden (Reanimated 4.5.1 kaynağından): her `platforms.value` değişiminde 14 evin 13 stil updater'ı yeniden çalışıyordu. `houseStyle` her seferinde yeni bir `transform` dizisi döndürdüğü için `shallowEqual` hiç geçmiyor; yani her spawn/cleanup'ta 14 evin kökü `updateProps` ile (width + transform) yeniden düzenleniyordu.
- Değişiklik (`app/index.tsx`, yalnız `PlatformHouseView` + `useAnimatedReaction` import'u):
  - Her evde tek bir `useAnimatedReaction` `platforms`'a abone; slotun geometrisini (id, x, topY, width, kalça payı r) hesaplıyor.
  - Değer gerçekten değiştiyse slot'a özel `houseGeom` SharedValue'ya ilkel kopya yazıyor; değişmediyse hiçbir şey yazmıyor.
  - 13 ev stili artık `platforms` yerine `houseGeom.value`'yu doğrudan okuyor (R062 kuralı korunuyor: SharedValue updater'ın kendi closure'unda).
  - Reaction stillerden önce tanımlı; mapper'ı aynı karede onlardan önce çalışıyor.
  - Cap (`PlatformView`), fizik, charge, çarpışma, parkur/RNG ve kamera değişmedi.
- Kontroller:
  - `closure_check_064`: ev stilleri 13/13 `houseGeom`, 0 `platforms`; reaction prepare `platforms` aboneli; `PlatformView` 3/3, `PopupHouseView` 10/10 değişmedi.
  - Aynı sahne hizası (web 8083, sabit tohum, 12 basış 250–1400 ms, Play Again dahil): her rAF karesinde her görünür cap'in altında aynı merkez/aynı üst Y'de ev var mı? Düzeltme: 2535 kare, 37602 cap gözlemi, **0 hizasız**, en büyük fark 0,005 px. Kontrol (B dosyası): 14074 hizasız — ölçüm hatayı yakalıyor (`align_web.py`).
  - Karşılaştırılabilir iş yükü (aynı tohum/girdi, geçici sayaçlı kopyalar): `houseStyle` updater çalışması R062 **784 → düzeltme 106 (−%86)**. DOM'a giden ev stil değişikliği her iki sürümde aynı (2023), yani görsel çıktı aynı. Web kare süresi p50/p95 16,7/16,8 ms (web takılmayı zaten üretmiyor; cihaz kanıtı değil).
  - `tsc`: `app/index.tsx` 0 hata (yalnız dokunulmamış `src/theme.ts` 116/126'daki eski 3 hata), worklet PASS, `expo export --platform ios` çıkış 0, `git diff --check` temiz, Play Again 5/5 (hata yok).
  - Kullanıcının 8082 sunucusu (PID 5253, `--no-dev --minify`) yeni kodu sunuyor; iOS paketinde B etiketi yok.
- Geri alma:
  - R062 davranışı (sayaç kapalı): `cp ~/Documents/Codex/carsamba-revizyon064/index-064-restored-before-fix.tsx app/index.tsx`.
  - Düzeltme kopyası: `index-064-fix.tsx`.
- **Kalan iPhone kabul sınırı:** Düzeltmenin cihazda takılmayı giderdiği henüz ölçülmedi. Web takılmayı üretmediği için web sonucu kabul değil. Kabul için: aynı 8082 oturumuyla, ağırlıkla tam ve mümkünse daha çok yarım basışla ~150 s oyun. Gerekirse `PERF_PROBE = true` ile (ev aboneliği düzeltilmiş hâliyle) aynı sayaç; hedef uçuşta > 25 ms ve "yakın takılma"nın B düzeyine (≈0) inmesi ve kullanıcının hissinin düzelmesi.

TESLIM_HAZIR: REVIZYON-064 — B (evler donuk) uçuşta > 25 ms 0/4762 ve yakın takılma 0 (A: 131 ve 119); B görünümü kaldırıldı, evler yalnız geometrisi değişen slotta yeniden stilleniyor (houseStyle çalışması 784→106, aynı sahne her karede 0 hizasız cap). Overlay kapalı; tsc(app)/worklet/iOS export/Play Again geçti. iPhone kabulü bekleniyor; commit/push/deploy yok.

## REVİZYON DENETİMİ — R062 / R063 / R064 (2026-10-13, kalıcı kural: `shared/CLAUDE_COORDINATION_PROTOCOL.md` "Her yeni oyun videosunda revizyon denetimi")
Kaynaklar:
- Kullanıcı istek metinleri (R062 hazırlık + görev, R063 görev, R064 görev/düzeltme/A/B mesajları).
- Bu dosyadaki ve `AI_REVIEW.md`'deki kayıtlar, `app/index.tsx` farkı, ölçüm klasörleri `~/Documents/Codex/carsamba-revizyon06{2,3,4}/`.

**Eski `TESLIM_HAZIR` satırları tamamlanma kanıtı sayılmadı. R062, R063 ve R064 satırları kodun/teşhisin teslimini gösteriyor; iPhone kabulünü değil.**

Durum anahtarı:
- ✅ yapıldı (kanıtı var)
- ◐ kısmen
- ✗ yapılmadı
- 📱 kod/web'de var, cihazda doğrulanmadı

### R062 — havada iniş çizgileri + kısa/yarım basış ritmi
| İstek | Durum | Kanıt / eksik nedeni |
|---|---|---|
| (a) Karakterin bastığı çizgi aynı id'li evin çatısında; havada tek çizgi yok | ✅ cihazda (R062 kodu için) | R063 videosu 26–27/34–35/57–58 s; R064 12-03-22 ve A videoları: havada çizgi yok. Kök neden derleme çıktısıyla kanıtlandı (13/13 abonelik). |
| 11,9 s çizgilerini id/slot/x/topY ile eşleştir, cihazda geçici debug konturu/id etiketi | ◐ | Derleme analizi + web ile yapıldı; cihazda kontur/etiket yapılmadı. Neden: kök neden kodla kesinleşti, cihaz aracı o turda yoktu. Artık gerek yok: hata cihazda görünmüyor. |
| R060 yedeğiyle karşılaştır; hata R061 öncesinde var mıydı | ✅ | Hata R060'ta da kodda vardı, render yeniden başlatmaları gizliyordu. |
| (b) Kısa/yarım basış ritmi ayrı ölçülsün, düzeltme varsa kanıtlansın | ◐ → R064'e taşındı | Ölçüldü; R062'de ritim düzeltmesi yapılmadı. R062'nin aboneliği sonradan uçuş takılmasının kaynağı çıktı (R064 A/B). |
| Aynı seed/koşulda R060–R061 cihaz A/B, UI/JS profili | ✗ (R064'te farklı biçimde ◐) | R062'de cihaz aracı yoktu. R064'te A/B sayacıyla yapıldı (R062 ev aboneliği vs donuk ev). R060/R061 sürümleri cihazda karşılaştırılmadı; artık gerekli değil. |
| Fizik/kamera/parkur korunacak; tsc/worklet/export/Play Again | ✅ | Kayıtlarda; bu turda da korunuyor. |

### R063 — kısa/yarım basış görüntü ritmi
| İstek | Durum | Kanıt / eksik nedeni |
|---|---|---|
| Ev–cap hizasını tüm ilgili karelerde bağımsız doğrula | ✅ cihaz videosu | `revizyon063/video/hiza.png` |
| PTS ile kısa/yarım/tam uçuşları ayır, katmanları ayrı izle | ✅ | `layers.py`, `chary.py`; 19 uçuş. |
| Kayıt tekrarı ile oyun donmasını ayır | ◐ | Oyun zamanı kaybı yok (ivme 1,00); sabit kareler tüm katmanlarda eşzamanlı. Kayıt mı kompozisyon mu, videoyla ayrılamadı. Kullanıcı sonradan takılmayı ekranda gördüğünü bildirdi (R064 düzeltmesi), yani kayıt artefaktı değil. |
| Gerçek iPhone UI/JS verisi veya cihaz A/B | ✗ (R063) → ✅ (R064 A/B) | R063'te araç yoktu; R064'te eklendi. |
| Kalkışta 3 adımlık ilk kare (R063 bulgusu, kısa/yarımda sık) | ◐ 📱 | Aynı yöntemle A videosunda 11/64 uçuş (yarım 3/4, tam 8/55, kısa 0/5), B'de 1/49 (kısa 1/7). Ev aboneliği bunu da açıklıyor gibi; ancak B'de yarım basış yalnız 1 olduğu için **yarım basış için kanıt yetersiz.** |
| Kök neden kanıtlanmadan optimizasyon ekleme | ✅ | R063'te kod değişmedi. |

### R064 — üretim modunda iniş sonu takılması
| İstek | Durum | Kanıt / eksik nedeni |
|---|---|---|
| Videonun `--no-dev --minify` sunucusundan geldiğini manifest/log ile doğrula | ◐ | Manifest `dev=false&minify=true`; süreç komut satırı doğrulandı. Metro istek logu okunamadı (kullanıcının Terminal'i). Şu an 8082 = PID 5253, `--no-dev --minify`. |
| Karakter, ev/cap ve arka planın birlikte durup durmadığını kare düzeyinde göster | ✅ | 12-03-22 analizi: tam uçuşta tüm katmanlar ve oyun saati birlikte duruyor. |
| "İniş sonu"na özgülük | ✗ (ölçüm aksini gösterdi) | Takılmalar uçuş boyunca eşit dağılıyor. Kullanıcı algısı "iniş sonu"; ölçüm bunu doğrulamadı. Açık bir çelişki değil: uçuş sonu en dikkat çeken an olabilir. |
| Kullanıcı gözlemini kabul et, kayıt-kapalı tekrar şartını kaldır | ✅ | Kayıtlar düzeltildi. |
| Cihazda risksiz sayaç + tek değişkenli A/B | ✅ cihaz | A: uçuş > 25 ms 131/4507, listeye yakın 119. B: 0/4762, 0. |
| Normal ev hizasını geri getir (B'yi bırakma) | ✅ kod + web 📱 | `HOUSE_AB_FROZEN = false`; web'de her karede 0 hizasız cap. Cihazda yeni kodla video yok. |
| Yalnız değişen slot/ilgili evleri güncelleyen dar düzeltme | ✅ kod + web 📱 | `houseGeom` + `useAnimatedReaction`. Aynı sahnede houseStyle çalışması 784→106, görsel çıktı aynı. **iPhone'da takılmanın gittiği ölçülmedi.** |
| Overlay nihai oyunda kapalı | ✅ | `PERF_PROBE = false`; 8082 iOS paketinde B etiketi yok. |
| iOS export, worklet, Play Again, aynı sahne hizası, karşılaştırılabilir performans | ✅ (web/derleme) | Cihaz performansı karşılaştırması yok (📱). |
| Fizik/charge/çarpışma/parkur/kamera sabit | ✅ | Değişiklik yalnız `PlatformHouseView` içinde. |

### Açık maddeler — somut nedenleri
1. **Düzeltmenin iPhone etkisi ölçülmedi.**
   - Neden: düzeltme bu turda yazıldı; henüz cihaz oturumu yok.
   - Web takılmayı hiç üretmediği için web yerine geçmez.
2. **Yarım basış örneklemi zayıf** (A: 4, B: 1 yarım uçuş).
   - Neden: kullanıcı ağırlıkla tam basış oynadı ve test talimatı yarım basış sayısı istemedi (benim talimat eksiğim).
3. **Uçuş dışı UI > 25 ms** (B'de 39/8413) incelenmedi.
   - Olası kaynaklar Game Over/Play Again/kalkış. Ayıracak ölçüm: aynı sayaçta faz bazlı (STANDING/CHARGING/DEAD) dağılım; şu an yalnız uçuş ayrılıyor.
4. Kayıt videosundaki "sıfır adım" oranı A ve B'de benzer (%18/%21).
   - Bu video ölçütü takılmayı ayırmıyor. Cihaz kabulünde sayaç birincil kanıt; video yalnız destek.
5. Üretim modu Metro logu ile kesinleşmedi.
   - Etki küçük: paket içeriği curl ile doğrulanabiliyor ve doğrulandı.

### Sonraki revizyona taşınan kabul ölçütleri (R065 için)
- **K1 — performans (iPhone, düzeltilmiş kod):**
  - Sayaçlı varyant hazır: `~/Documents/Codex/carsamba-revizyon064/index-064-fix-probe.tsx` (yalnız `PERF_PROBE = true`; closure kontrolü 13/13 `houseGeom`).
  - ≥ 120 s, en az 20 tam ve **en az 15 yarım/kısa** basış.
  - Kabul:
    - uçuşta > 25 ms ≤ %0,3 uçuş karesi (B düzeyi ≈ 0);
    - "listeye yakın takılma" ≤ 2;
    - kullanıcının hissi: tam ve yarım basışta takılma yok.
  - Sayaç açık olsa da kapalı oyunla aynı ev kodu kullanılır.
- **K2 — hiza (iPhone):** aynı oturumun videosunda havada tek çizgi yok; her iniş çizgisi kendi evinin çatısında; spawn anlarında evin 1 kare geride kalması görünmüyor.
- **K3 — kalkış sıçraması:** kısa/yarım basışta ilk hareket karesinde ≥ 2,5 adım oranı A'daki 11/64 seviyesinin belirgin altında (hedef ≤ 1/20). Ölçüm R063 `analyze.py` ile.
- **K4 — korunacaklar:** fizik/charge/çarpışma/skor/parkur/RNG, zoom 0,40 / %32 çıpa / sabit render Y, R062 ev–cap hizası, overlay kapalı nihai oyun.
- **K5 — K1 başarısızsa:** kalan takılma uçuşta mı, liste değişimine yakın mı; faz bazlı sayaç ekle. Liste dışıysa Instruments (Animation Hitches + Time Profiler, hedef Expo Go). Varsayımla ikinci optimizasyon yok.

Durum: R064 **kod teslim edildi; iPhone kabulü AÇIK** (K1–K3). Yukarıdaki R064 `TESLIM_HAZIR` satırı yalnız kod/test teslimini ifade eder.
TESLIM_HAZIR: REVİZYON DENETİMİ R062–R064 — istek bazlı tablo yazıldı; açık: düzeltmenin iPhone etkisi (K1), cihaz hizası (K2), yarım basış kalkış sıçraması (K3); ölçüm varyantı hazır, oyunda overlay kapalı; commit/push/deploy yok.

## REVIZYON-064 — C videosu denetimi ve Expo zinciri onarımı (2026-10-13, `ScreenRecording_10-13-2026 15-56-00_1.MP4`, 262,4 s)
**Revizyon denetimi (kalıcı kural):** Bu video R064 dar düzeltmesinin iPhone kabulü **DEĞİL**. K1–K3 hâlâ açık.
- Kanıt:
  - Native üst bant 20 s: UI 465 kare / uçuş 189 kare. Yani uygulama 15:56'da QR ile **yeni açılmış** (video başında Kamera QR okutuyor); eski oturum devam etmiyor.
  - Buna rağmen etiket `[AB: EVLER DONDURULMUS]` (20…260 s). 260 s: uçuş 8050 kare, > 25 ms 0, liste 355, yakın 0; UI > 25 ms 43/13507.
  - Bu, B koşulunun ikinci bağımsız tekrarı (R064 B ile tutarlı); düzeltmenin ölçümü değil.
- **Zincir teşhisi (neden eski B paketi geldi):**
  1. Kullanıcının 8082 sunucusu (PID 5253, 15:12'de B için başlatılmış) manifestte telefonun gerçekten yüklediği URL'yi veriyordu: `…entry.bundle?platform=ios&dev=false&…&transform.bytecode=1&…&unstable_transformProfile=hermes-stable`.
  2. Bu URL 16:05'te hâlâ B paketini döndürdü: "EVLER DONDURULMUS" var, md5 `ee2b0efa…`. Diskteki dosya 15:35:43'ten beri düzeltilmiş sürümdü. Dosya değişikliğinden sonra 4 deneme (32 s) boyunca paket değişmedi; Metro bu paket varyantını yenilemiyordu.
  3. **Benim hatam:** Önceki teslimde "8082 yeni kodu sunuyor" doğrulaması `transform.bytecode`/`unstable_transformProfile` parametresi olmayan başka bir URL ile yapıldı. O URL güncel kodu verdi; telefonun yüklediği URL ise kontrol edilmedi. Bundan sonra doğrulama **yalnız manifestin `launchAsset.url`'si** ile yapılacak.
  4. Ek risk: Mac'in LAN adresi 192.168.1.132 → 192.168.1.104 oldu; eski QR (`exp://192.168.1.132:8082`) artık erişilemez.
  5. Ek risk: Web testlerim sırasında 15:30–15:35 arasında `app/index.tsx` kısa süre B/sayaçlı kopyalarla değiştirildi ve aynı diski kullanan 8082 bunları da gördü. C oturumu 15:56'da açıldığı için bu pencereyle ilgili değil, ama ölçüm sırasında kullanıcı sunucusunun dosyasını değiştirmemek gerekir. Bundan sonra web A/B testleri ayrı bir kopya dizinde yapılacak.
- Onarım:
  - PID 5253 durduruldu.
  - Uygulamanın Terminal panelinde (`expo 8082 iOS` sekmesi) `npx expo start --lan --port 8082 --go --no-dev --minify --clear` başlatıldı (önbellek boş, yeniden derleme). QR / adres: `exp://192.168.1.104:8082`.
  - Manifest `hostUri 192.168.1.104:8082`; `launchAsset.url` aynı bytecode/hermes-stable varyantı.
  - O URL'den indirilen iOS paketi (6 075 031 B, md5 `8a30544a…`): `EVLER DONDURULMUS` 0, `R064: EV SLOT KAPISI` 1, sayaç metni ("liste degisimi") var, `houseGeom` worklet kodu var.
- **Geçici ölçüm durumu (K1 için):**
  - `app/index.tsx` = `PERF_PROBE = true`, `HOUSE_AB_FROZEN = false` (B kesin kapalı).
  - Sayaç satırının sonuna sürüm etiketi `[R064: EV SLOT KAPISI]` eklendi (yalnız overlay metni). Ev kodu nihai oyunla aynı.
  - Kopya: `~/Documents/Codex/carsamba-revizyon064/index-064-fix-probe.tsx`.
  - **K1 ölçümü bitince `PERF_PROBE = false` yapılacak** (nihai: `index-064-fix.tsx` + etiket satırı).
- Kontroller: `closure_check_064` 13/13 `houseGeom`, `app/index.tsx` tsc 0, worklet PASS, `git diff --check` temiz. Fizik/charge/çarpışma/parkur/kamera değişmedi.
- Kullanıcı adımı (K1–K3 tek test):
  1. iPhone'da Expo Go'yu uygulama değiştiriciden tamamen kapat.
  2. Kamerayla `expo 8082 iOS` sekmesindeki **yeni** QR'ı okut (ya da Expo Go'da `exp://192.168.1.104:8082`).
  3. Sayacın sonunda `[R064: EV SLOT KAPISI]` yazdığını ve ilk satırın küçük sayılardan başladığını gör. `EVLER DONDURULMUS` görürsen dur.
  4. Ekran kaydıyla ≥ 120 s oyna: en az 20 tam, en az 15 yarım/kısa basış.
  5. Kaydı gönder.
REVIZYON-064 C denetimi — ENGEL değil, ÖLÇÜM BEKLENİYOR: C videosu B'nin tekrarı, kabul değil; 8082 bayat bytecode paketi sunuyordu (benim doğrulamam yanlış URL'yi kontrol etmişti) ve IP değişti; sunucu --clear ile yeni IP'de yeniden açıldı, telefonun yükleyeceği paket düzeltme + sayaç + B kapalı olarak doğrulandı; K1–K3 açık; commit/push/deploy yok.

## REVIZYON-065 (2026-10-13) — R064 dar düzeltmesi iPhone'da BAŞARISIZ; neden araştırması ve ayrıştırıcı sayaç
Kaynak: `ScreenRecording_10-13-2026 16-58-32_1.MP4` (183,3 s, 10027 kare; PTS medyan 16,67 ms, > 25 ms PTS boşluğu 482). Doğru paket: tüm oyunda `[R064: EV SLOT KAPISI]`, B etiketi yok.

### Bağımsız doğrulama
- Üst bant (`~/Documents/Codex/carsamba-revizyon065/videoD/ust_band.png`): Codex okumaları 30/60/90/120/150/175 s'de birebir doğru.
- Son okunabilir an (182 s): UI 8394 kare / > 25 ms 212 (> 40 ms 175) / max 179; uçuş 4958 kare / **> 25 ms 164 (%3,31)** / uçuşta liste 220 / **yakın 142**; JS > 25 ms 209.

| | A (R062, 14 ev aboneli) | B (evler donuk) | D (R064 dar düzeltme) |
|---|---|---|---|
| Uçuş kare | 4507 | 4762 | 4958 |
| Uçuşta > 25 ms | 131 (%2,9) | 0 | 164 (%3,3) |
| Liste değişimi (uçuş) | 179 | 219 | 220 |
| Yakın takılma | 119 | 0 | 142 |
| Değişim başına yakın takılma | %66 | %0 | %65 |
| Uçuş türleri (video) | 55 tam / 4 yarım / 5 kısa | 41 / 1 / 7 | 56 / 9 / 14 |
| Kalkışta ilk kare ≥ 2,5 adım | 11/64 | 1/49 | **15/79** (kısa 4/14, yarım 3/9, tam 8/56) |

- K2 hiza: 14–182 s arasında 14 s aralıklı 13 karede (`videoD/hiza_montaj.png`) her iniş yüzeyi kendi evinin çatısında, havada çizgi yok. **Kare düzeyinde (spawn anı) doğrulanmadı.**

### Denetim — istek bazlı durum
| İstek | Durum | Kanıt / neden |
|---|---|---|
| R064 K1: uçuşta > 25 ms ≤ %0,3, yakın ≤ 2 | ✗ BAŞARISIZ | %3,31; yakın 142. Düzeltme değişim başına takılma oranını değiştirmedi (%66 → %65). |
| R064 K2: hiza (cihaz) | ◐ | 13 örnek karede hizalı; spawn anında kare düzeyinde doğrulanmadı. |
| R064 K3: kısa/yarım kalkış sıçraması ≤ 1/20 | ✗ | 7/23 kısa+yarım; toplam 15/79. B'de 1/49, yani kalkış sıçraması da ev güncellemesiyle ilişkili görünüyor. |
| K1 test koşulu (≥ 120 s, ≥ 20 tam, ≥ 15 yarım/kısa) | ✅ | 183 s; 56 tam, 23 yarım/kısa. |
| R064 düzeltmesi "yalnız değişen evler" (kod) | ✅ kod / ✗ etki | Kod istenen şeyi yapıyor (cihazda hiza bozulmadı), ama takılmayı gidermiyor. |
| Önceki R064 TESLIM_HAZIR | geçersiz (performans için) | Cihaz kanıtı olmadan verilmişti; bu kayıtla performans iddiası düşürüldü. |

### Neden etkisiz oldu — önceki varsayım ve test yöntemi açığı
- **Önceki varsayım (yanlış):** maliyet, liste değişiminde yeniden stillenen ev sayısıyla (14 × 13) orantılıdır; değişmeyen evleri susturmak takılmayı giderir.
- **Cihaz sonucu bunu çürütüyor:**
  - D'de değişim başına yalnız ~1,9 ev yazılıyor (web sayımı: 784 → 106 houseStyle çalışması), ama değişim başına takılma oranı A ile aynı (%65–66).
  - Maliyet, değişmeyen 12 evin (R062'de yalnız transform dizisi yeni olduğu için yeniden gönderilen, değerleri aynı stiller) güncellenmesinde değil. **Gerçekten değişen evin güncellenmesinde.** Bu, A ve D'de var, B'de yok.
- **Test yöntemi açıkları:**
  1. B tek değişkenliydi ama iki şeyi birlikte kaldırdı: değişmeyen evlerin boş güncellemesi ve değişen evin gerçek güncellemesi. Ben bunu "14 evin tamamı" diye yorumladım; B bu iki payı ayırmıyordu.
  2. Web'deki karşılaştırma ölçütü (mapper çalışma sayısı) JS iş miktarını ölçtü; native commit/düzen/mount maliyetini ölçmedi. Web takılmayı hiç üretmediği için web metriği düzeltmenin etkisini kanıtlayamazdı.
  3. Cihazda ölçmeden `TESLIM_HAZIR` yazdım.
- **Kod kanıtı (Reanimated 4.5.1):**
  - `staticFeatureFlags`: `IOS_SYNCHRONOUSLY_UPDATE_UI_PROPS: false`. Bu durumda her `updateProps` `performOperations → commitUpdates` yolundan gidiyor: shadow tree klonu, Yoga düzeni, mount. Bayrak Expo Go'nun derlenmiş native kodunda; Expo Go'da değiştirilemez.
  - Değişen bir evin güncellemesi düzen özellikleri içeriyor: kök width; facade top; 3 kolon left/top; çatı bandı width/height; kırpma left/top; kalça çizgisi left/height; oluk top/width.
  - Bu ev alt ağacı derin: 2200 pt yüksek `overflow: hidden` facade, 3 LinearGradient, 3 görsel, döndürülmüş kırpma maskeleri.
  - Görünme/kaybolmada evin genişliği 0 ↔ fw ve opaklığı 0 ↔ 1 arasında değişiyor.
  - B'de cap'ler de her değişimde width içeren güncelleme yapıyordu ve takılma yoktu. Yani "bir düzen commit'i olması" tek başına yetmiyor; maliyet ev alt ağacına özgü. **Hangi parçası olduğu henüz kanıtlanmadı.**
- Instruments: Xcode var ama lisans kabul edilmemiş (`xctrace` çalışmıyor; `sudo xcodebuild -license` kullanıcı işlemi). Ayrıca App Store Expo Go'su hata ayıklanabilir olmadığından Time Profiler'ın işleme bağlanması büyük olasılıkla mümkün değil. Bu yüzden uygulama içi ayrıştırıcı sayaç kullanıldı.

### Uygulanan ayrıştırıcı ölçüm (R065 sayacı; ev/oyun davranışı aynı)
- `PERF_PROBE` içinde yeni sayaçlar:
  - **faz**: > 25 ms takılmaları bekle / şarj / uçuş / ölü ayrımı;
  - **uçuştaki takılmanın önceki karedeki olayı**: ev-görün (slot boş → geometri), ev-kaybol, ev-kay/boy (geometri → geometri), ev yazmayan liste değişimi, olaysız;
  - her olay türünün uçuştaki sayısı (oran = takılma/olay).
- Ev etiketi reaction'ın `react` tarafında; mapper girdisi değil. `closure_check`: 13/13 stil `houseGeom`, prepare yalnız `platforms`.
- Gösterge etiketi `[R065: FAZ/EV OLAY SAYACI]`.
- Web 8083 (10 × 600 ms): uçuşta 40 liste değişimi → 25 ev-görün, 15 ev-kaybol, 20 ev-kay/boy olayı; ev yazmayan liste değişimi 0. Hiza: 2547 kare, 37778 cap, 0 hizasız.
- Kontroller: `app/index.tsx` tsc 0, worklet PASS, iOS export çıkış 0, `git diff --check` temiz.
- 8082 (`expo 8082 iOS` sekmesi, 192.168.1.104) manifest `launchAsset` paketi: `FAZ/EV OLAY` 1, `EV SLOT KAPISI` 0, `EVLER DONDURULMUS` 0.
- Fizik/charge/çarpışma/parkur/RNG/kamera değişmedi.
- Yedekler:
  - `~/Documents/Codex/carsamba-revizyon065/yedek/index-064-fix-probe.tsx` (önceki hâl);
  - `index-065-probe.tsx` (şimdiki);
  - nihai oyun için `PERF_PROBE = false`.
- Yeni tahmini optimizasyon yapılmadı.

### Yorum kuralı (bir sonraki iPhone kaydı için)
- Takılmalar **ev-görün ve ev-kaybol** olaylarında yüksek oranlı, ev-kay/boy olaylarında düşükse: maliyet görünürlük geçişinde (genişlik 0 ↔ fw, opaklık, alt ağacın ilk düzeni). Ekranda olmayan kaybolma da takılıyorsa maliyet çizim değil, commit/düzen tarafında.
- Üçü de benzer oranlıysa: maliyet herhangi bir düzen değişikliğinde ev alt ağacının yeniden düzenlenmesinde.
- "Olaysız" takılmalar baskınsa: ev dışı bir neden var; bu durumda faz satırına bakılır.

### Kullanıcı kararı gerekebilecek geniş seçenekler (uygulanmadı)
Sayaç sonucu ev alt ağacının düzen maliyetini doğrularsa:
1. **Expo Go içinde kal, evleri düzensiz güncelle:**
   - Ev alt ağaçları bir kez sabit boyutta kurulur; spawn/cleanup'ta yalnız transform/opacity (düzen dışı özellik) değişir. Örneğin genişlik sınıfları ve kırpma transform ile yapılır.
   - Orta ölçekli görsel yeniden yapılanma; R062 hizası yeniden doğrulanmalı.
2. **Geliştirme yapısına (expo-dev-client) geç:**
   - Instruments/Time Profiler ile gerçek profil alınabilir; Reanimated native bayrakları (`IOS_SYNCHRONOUSLY_UPDATE_UI_PROPS` vb.) denenebilir.
   - Apple geliştirici kurulumu ve Xcode lisansı gerekir; iş akışı değişir.
3. **Evleri tek bir çizim yüzeyinde (ör. Skia) çizmek:** en büyük değişiklik; ayrıca kanıt gerektirir.

### Sonraki kabul ölçütleri (taşınan)
- **K1:** Uçuşta > 25 ms ≤ %0,3 ve yakın takılma ≤ 2; ≥ 120 s, ≥ 20 tam + ≥ 15 yarım/kısa. Şimdilik açık; önce neden ayrımı yapılacak.
- **K1a (bu tur):** R065 sayacıyla iPhone kaydında üç olay türünün takılma/olay oranı ve faz dağılımı okunur. Neden sınıfı yukarıdaki kurala göre seçilir. Seçilen sınıf için **tek** düzeltme seçeneği kullanıcıya sunulur.
- **K2:** Spawn anında kare düzeyinde hiza: ilk görünen evin çatısı ilk karesinde cap ile aynı yerde.
- **K3:** Kısa+yarım kalkış sıçraması ≤ 1/20.
- **K4:** Fizik/charge/çarpışma/parkur/RNG/kamera ve R062 hizası korunur; nihai oyunda gösterge kapalı.
REVIZYON-065 ENGEL değil, ÖLÇÜM BEKLENİYOR — R064 dar düzeltmesi iPhone'da başarısız (uçuş %3,31, değişim başına takılma A ile aynı); neden: maliyet değişen evin native güncellemesinde, sayı ölçeğinde değil; ayrıştırıcı faz/ev-olay sayacı eklendi, telefona giden paket doğrulandı; K1–K3 açık; commit/push/deploy yok.

## REVIZYON-066 (2026-10-13) — R065 sayacı: maliyet "ev görünme" olayında; kök neden adayı expo-linear-gradient CPU yeniden çizimi; tek değişkenli dar deney
Kaynak: `ScreenRecording_10-13-2026 17-38-22_1.MP4` (182,5 s, 9890 kare). Etiket `[R065: FAZ/EV OLAY SAYACI]` doğru. Kullanıcı: titreme sürüyor.

### R065 isteklerinin denetimi
| İstek | Durum | Kanıt / neden |
|---|---|---|
| Önceki videoyu bağımsız analiz (basış türü, kalkış, hiza) | ✅ | R065 kaydı (D videosu). |
| Neden etkisiz — varsayım ve yöntem açığı | ✅ | R065 kaydı; bu tur sayaçla doğrulandı (maliyet değişen evde). |
| Ayrıştırıcı ölçüm (faz / ev olayı) | ✅ cihaz | Bu video. |
| Instruments | ✗ | Xcode lisansı kabul edilmemiş (`sudo xcodebuild -license`); App Store Expo Go'su Time Profiler'a muhtemelen kapalı. Değişmedi. |
| K1 (uçuş > 25 ms ≤ %0,3, yakın ≤ 2) | ✗ | 190/5117 = %3,7; yakın 155. Kod bilerek değişmemişti (yalnız sayaç). |
| K1a (olay türü oranları) | ✅ | Aşağıda. |
| K2 kare düzeyinde hiza | ◐ | 13 örnek karede hizalı (`videoE/hiza_montaj.png`); spawn anında kare düzeyi hâlâ yok. Spawn sağ kenarın 500 birim ötesinde ekran dışı olduğu için evin ilk karesi ekranda görülemez; ölçüt aşağıda yeniden tanımlandı. |
| K3 kısa/yarım kalkış sıçraması ≤ 1/20 | ✗ | kısa 4/10, yarım 12/21, tam 7/53. |
| Overlay nihai oyunda kapalı | ⏸ ölçüm sürüyor | `PERF_PROBE = true`, ölçüm turu. |

### Bağımsız sayım (üst bant `videoE/ust_band.png`)
| t | Uçuş kare | > 25 ms | Liste | Yakın | ev-görün | ev-kaybol | ev-kay/boy | olaysız |
|---|---|---|---|---|---|---|---|---|
| 20 s | 98 | 5 | 4 | 3 | 2/2 | 1/2 | 0/1 | 2 |
| 60 s | 1270 | 60 | 69 | 48 | 36/36 | 11/35 | 0/20 | 13 |
| 120 s | 3091 | 124 | 151 | 101 | 76/78 | 23/75 | 0/45 | 25 |
| 180 s | 5053 | 190 | 232 | 154 | 117/119 | 33/115 | 0/65 | 40 |
| 182,5 s | 5117 | 190 | 232 | 155 | 117/119 | 33/115 | 0/65 | 40 |

- Uçuş takılmalarının dökümü tutarlı: 117 + 33 + 0 + 0 + 40 = 190.
- Faz: bekle 44 / şarj 1 / uçuş 190 / ölü 0; toplam 235 = UI > 25 ms.

### Eşleştirme mantığının denetimi
- **Zaman yönü:**
  - Kare N'nin geri çağrısında spawn/cleanup `platforms`'u değiştirir (`pListFrame = N`).
  - Mapper'lar aynı karede, geri çağrılardan sonra çalışır; ev reaction'ı `pHouseFrame = N` yazar.
  - Takılma, kare N+1'in geri çağrısının **başında** `timeSincePreviousFrame` ile ölçülür. Bu, kare N'nin mapper/commit/mount işini içeren aralıktır; koşul `pFrames − pHouseFrame ≤ 1` pratikte yalnız "fark = 1" olur.
  - Olay, ölçülen uzun aralıktan **önce** oluyor.
- **Ters nedensellik:**
  - Uzun bir aralık (N−1→N) büyük dt ile kare N'de spawn'ı tetikleyebilir. Ama o takılma kare N'de ölçülür ve N−1'in olayına bakar, kendi sonucuna değil.
  - Uzun karenin olayı tetiklemesi bu yüzden eşleşmeyi şişiremez.
  - 117/119 (%98) "olaydan sonraki aralık uzun" demektir. Olaysız karelerde taban oran 40 / ~4880 ≈ %0,8.
- **Aynı karede çakışma (önemli sınır):**
  - Öncelik görün > kaybol > kay/boy. Spawn'da yeni ev görünür ve sol komşunun kalça payı (r) değişir; cleanup'ta ev kaybolur ve sağ komşu değişir.
  - Bu yüzden "kay/boy" olayları neredeyse hep görün/kaybol ile aynı karede; **"ev-kay/boy 0/65" boyutlanmanın ucuz olduğunu KANITLAMAZ.**
  - Kaybol karelerinde de bir komşu boyutlanıyor: %29 oran "kaybol + komşu boyutlanması"dır.
- Ortak neden ayrımı: spawn'ın kendisi (parkur üretimi, cap güncellemesi) B'de de vardı ve takılma 0'dı. Takılma ev görselinin güncellenmesine bağlı.
- Ekran dışı: spawn görünen sağ kenarın 500 dünya birimi ötesinde, cleanup sol kenarın 260 birim gerisinde. Görünme/kaybolma ekran dışında oluyor; maliyet ekrana piksel çizmek değil.

### Kök neden adayı (kod kanıtı)
- `expo-linear-gradient` 57.0.1 iOS (`ios/LinearGradientLayer.swift`):
  - `CAGradientLayer` değil; `needsDisplayOnBoundsChange = true`.
  - Her sınır (bounds) değişiminde `display()` → `UIGraphicsBeginImageContextWithOptions(bounds.size, …, 0.0)` ile gradyanı **ana thread'de CPU'da** ekran ölçeğinde (3×) bitmap'e çiziyor.
  - Boyut 0 ise çizimi atlıyor.
- Ev cephesindeki iki gradyan 2200 pt yüksek, genişlik evin %18 / %28'i. Örneğin fw ≈ 300 birimde (54 + 84) × 3 px × 6600 px ≈ 2,7 Mpx (~11 MB). Ebeveyn ölçeği (zoom 0,40) bitmap boyutunu küçültmüyor.
- Desen bu mekanizmayla birebir uyumlu:
  - **Görün %98:** Boş slot genişlik 0 → fw; iki dev gradyan sıfırdan çiziliyor, komşu da yeniden çiziliyor.
  - **Kaybol %29:** Giden evin gradyanları 0 boyuta iniyor (çizim yok); yalnız komşu yeniden çiziliyor.
  - **B %0:** Ev boyutları hiç değişmiyordu.
  - **R064 düzeltmesi etkisiz:** Değişen ev yine yeniden boyutlanıyordu.
- Uyarı: Expo Go native modülü derlenmiş hâliyle geliyor; node_modules sürümüyle aynı kod varsayıldı (SDK eşleşmesi).
- **Bu bir aday; cihaz deneyi kanıtlayacak.**

### Tek değişkenli dar deney (uygulandı, geri alınabilir)
- `HOUSE_GRAD_FIXED = true` (yeni bayrak; `false` = R065 düzeni).
- Üç cephe gradyanı (ışık, gölge, saçak) sabit 16 birimlik bir kutuda çiziliyor. Evin genişliği bu kutuya yalnız `scaleX` transform'u olarak geçiyor; düzen özelliği değil. Böylece gradyan layer'larının sınırı hiç değişmiyor ve yeniden çizim olmuyor.
- Yatay doğrusal gradyanın gerilmesi görüntüyü değiştirmez. Saçak dikey gradyan; yatay gerilmesi de aynı.
- Ev geometrisi, cap, fizik, charge, çarpışma, parkur/RNG, kamera değişmedi.
- R065 sayacı aynı (karşılaştırılabilir). Etiket `[R066: GRADYAN SABIT KUTU]`.
- Kontroller:
  - Web 8083 sabit tohum: her görünür evde gradyan kutuları eski yüzde düzeniyle aynı yer/boyutta, en büyük fark **0,004 px** (`grad_box_web.py`, 4 sahne × 7 ev).
  - Hiza 2456 kare / 36522 cap, 0 hizasız.
  - `closure_check` 16/16 stil `houseGeom`.
  - `app/index.tsx` tsc 0, worklet PASS, iOS export çıkış 0, Play Again 5/5 hata yok, `git diff --check` temiz.
- 8082 (`expo 8082 iOS` sekmesi, 192.168.1.104) manifest `launchAsset` paketi: `GRADYAN SABIT KUTU` 1, `EVLER DONDURULMUS` 0, sayaç var.
- Yedekler (`~/Documents/Codex/carsamba-revizyon066/`):
  - `yedek/index-065-probe.tsx` (önceki);
  - `index-066-gradfix-probe.tsx` (şimdiki).
  - Geri alma: `HOUSE_GRAD_FIXED = false`.

### iPhone test planı ve kabul ölçütleri
Aynı koşul: Expo Go'yu tamamen kapat, 8082 QR'ı, ≥ 150 s, ≥ 20 tam + ≥ 15 yarım/kısa basış, ekran kaydı.
- **K1 (performans):** uçuşta > 25 ms ≤ %0,3 uçuş karesi ve yakın takılma ≤ 2.
- **K1b (mekanizma):** ev-görün takılma oranı %98 → ≤ %5 ve ev-kaybol %29 → ≤ %5.
  - K1b geçer ama K1 geçmezse kalan neden "olaysız"/diğer sınıflarda aranır.
  - K1b geçmezse gradyan hipotezi çürür. Sonraki aday ev alt ağacının düzen commit'i olur; bunun için önceden yazılmış seçenekler aşağıda.
- **K2 (hiza):** Spawn ekran dışında olduğundan ölçüt: her yeni evin ekrana **girdiği** ilk karelerde çatı ve cap aynı konumda. Kayıtta yeni evin sağ kenardan girdiği en az 5 an kare kare incelenir. Ek ölçüt: gradyan ışık/gölge şeritleri evin kenarlarında, kaymasız.
- **K3:** kısa+yarım kalkış sıçraması ≤ 1/20 (R065: 16/31). Ölçüm `analyze.py`.
- **K4:** fizik/charge/çarpışma/parkur/RNG/kamera ve R062 hizası korunur; nihai oyunda `PERF_PROBE = false`.
- **Kullanıcı hissi:** titreme yok.

### Deney başarısız olursa geniş seçenekler (kullanıcı kararı; uygulanmadı)
1. **Ev alt ağacını sabit boyutlu kurmak** (Expo Go'da kalır): tüm ev parçaları bir kez sabit genişlikte; ev farkı scaleX/translate ile.
   - Bedel: çatı/kolon dokuları gerileceği için görünüm değişir.
   - Orta iş; hiza yeniden doğrulanır.
2. **Geliştirme yapısı (expo-dev-client):**
   - Instruments, Reanimated native bayrakları ve native modül sürüm kontrolü mümkün olur.
   - Bedel: Apple geliştirici hesabı ve Xcode lisansı; her native değişiklikte yeniden derleme; QR akışı değişir.
3. **Evleri tek bir çizim yüzeyinde (Skia) çizmek:**
   - Bedel: büyük yeniden yazım ve yeni bağımlılık; hiza ve görsel yeniden kabul.
REVIZYON-066 ENGEL değil, ÖLÇÜM BEKLENİYOR — R065 sayacı takılmayı ev-görün olayına bağladı (117/119, taban %0,8; zaman yönü doğru, çakışma sınırı kayıtlı); kök neden adayı expo-linear-gradient'in boyut değişiminde CPU bitmap yeniden çizimi; tek değişkenli HOUSE_GRAD_FIXED deneyi uygulandı (web görsel fark 0,004 px, hiza 0); K1/K1b/K2/K3 iPhone'da açık; commit/push/deploy yok.

## REVIZYON-066 — iPhone sonucu (2026-10-14, `ScreenRecording_10-14-2026 12-11-21_1.MP4`, 215,5 s, 12 503 kare)
Kod değişmedi. Etiket `[R066: GRADYAN SABIT KUTU]` tüm oyunda. Kanıt klasörü `~/Documents/Codex/carsamba-revizyon067/videoF/`.

### Bağımsız sayaç (üst bant `ust_band.png`)
| t | UI kare / > 25 ms | Uçuş kare / > 25 ms | Liste | Yakın | ev-görün | ev-kaybol | ev-kay/boy | olaysız | JS > 25 ms |
|---|---|---|---|---|---|---|---|---|---|
| 30 s | 1201 / 4 | 618 / 0 | 31 | 0 | 0/16 | 0/15 | 0/11 | 0 | 31 |
| 60 s | 2762 / 4 | 1569 / 0 | 79 | 0 | 0/41 | 0/38 | 0/23 | 0 | 76 |
| 120 s | 6168 / 4 | 3483 / 0 | 173 | 0 | 0/89 | 0/86 | 0/39 | 0 | 162 |
| 212 s | 11350 / 4 | 6598 / 0 | 289 | 0 | 0/151 | 0/142 | 0/74 | 0 | 287 |
| 215 s | 11508 / 4 | 6720 / 0 | 295 | 0 | 0/154 | 0/145 | 0/77 | 0 | 292 |

- UI > 25 ms toplam 4; hepsi "bekle" fazında, max 72 ms.
- R065 aynı ölçütle: uçuş 190/5117, ev-görün 117/119, ev-kaybol 33/115.

### İstek bazlı denetim
| Madde | Durum | Kanıt / sınır |
|---|---|---|
| K1 uçuş > 25 ms ≤ %0,3, yakın ≤ 2 | ✅ cihaz | 0/6720, yakın 0 (R065: %3,7 / 155). |
| K1b ev-görün/kaybol takılma ≤ %5 | ✅ cihaz | 0/154, 0/145 (R065: %98 / %29). Gradyan kök neden adayı cihazda doğrulandı: tek değişken `HOUSE_GRAD_FIXED`. |
| K2 yeni ev ekrana girişte çatı–cap hizası | ✅ örneklem / ◐ tam kapsam | Uzun uçuşlardan 14 an × 4 kare (`k2_a.png`, `k2_b.png`; 10,6–123,4 s): sağ kenardan giren her evde çatı ve gövde birlikte; havada tek cap çizgisi yok. Her giriş karesi incelenmedi. Video küçültmesinde 8 pt'lik cap ince; çatı üstüyle 1–2 px'lik fark bu ölçekte ayırt edilemez. |
| K3 kısa/yarım kalkış ≥ 2,5 adım ≤ 1/20 | ◐ ölçüt sınırında | Aşağıda; yöntem önceki videolardan farklı, doğrudan karşılaştırılamaz. |
| Kullanıcı hissi (titreme yok) | 📱 açık | Kullanıcı beyanı yok. Video sınırı aşağıda. |
| Nihai oyunda overlay kapalı | ⏸ | Ölçüm turu; `PERF_PROBE = true` duruyor. Kabul sonrası `false`. |
| Fizik/charge/çarpışma/parkur/RNG/kamera | ✅ | R066'da yalnız ev gradyan görünümleri değişti. |

### K3 yöntemi ve sonucu
- Tam çözünürlüklü LK'nin tüm videoda çalıştırılması kullanıcı isteğiyle durduruldu (9 dk, sonuç yok).
- Yerine:
  1. 1/6 ölçekte ev bandı `phaseCorrelate` ile hızlı segmentleme (`fast.py`, 141 s);
  2. süresi ≥ 0,2 s ve adımı ≥ 3 px olan 37 kısa/yarım aday;
  3. her adayın kalkışı çevresinde −3…+10 karede eski tam çözünürlük LK yöntemi (`k3.py`, `k3.json`).
- Sonuç:
  - 37 adaydan 22'sinde pencere içinde hareket bulundu; 2'sinde adım tahmini geçersiz (1–2 px). **Geçerli 20 kalkışta ilk kare ≥ 2,5 adım: 1/20** (206,29 s; 33 ms PTS boşluğuyla çakışıyor).
  - Önceki ölçümler: R065 16/31, R064 D 7/23 (kısa+yarım).
- Sınırlar:
  - 15 aday pencerede hareketsiz çıktı. Düşük çözünürlüklü segmentlemenin zamanlaması kaydı; seçim önyargılı olabilir.
  - Tam videonun bütün kalkışları sayılmadı.
  - **K3 ölçüt eşiğinde (1/20) ve kısmi örneklemli; tam kabul için açık.**
- **Ek bulgu (öznel akıcılık için önemli):**
  - Uçuş içinde ve kalkışta yaygın "0 adım + 2 adım" deseni var (ör. 12,4 → 0 → 24,8 px), PTS düzenli 16,7 ms.
  - Aynı dönemde uygulama UI sayacı uçuşta tek > 25 ms kare göstermiyor.
  - Olası nedenler (ayrılmadı):
    - ProMotion (120 Hz) ekranda 60 Hz güncellenen oyun ile 60 fps ekran kaydının faz vuruşu;
    - uygulama karesinin compositor'a geç teslimi (UI geri çağrısı zamanında ama sunum kaçmış).
  - Video bu ikisini ayıramaz; kayıt "yinelenen kare" gösterse bile bu ekranda görülen titreme kanıtı değildir. Kullanıcının gözle değerlendirmesi gerekir.
- JS sayacı: JS > 25 ms 292/12128 (%2,4) ve UI'dan bağımsız artıyor (R065'te UI ile birlikte artıyordu). Oyun hareketi UI thread'de olduğu için UI karesini etkilemiyor. Kaynak (ör. gösterge metninin 500 ms'lik React güncellemesi) incelenmedi; sayaç kapanınca yeniden ölçülmeli.

### Önceki revizyon açıklarının durumu
- R064 K1 (başarısız) ve R065 K1/K1b: kök neden expo-linear-gradient'in boyut değişiminde CPU bitmap yeniden çizimi. R066 ile kapandı.
- R064'teki "14 evin hepsi" varsayımı yanlıştı (R065 kaydı).
- R063/R064 kalkış sıçraması: R066'da hedefli örneklemde 1/20. B ve R066 düzeyleri birbirine yakın; ev gradyan çizimiyle ilişkili olduğu destekleniyor, ama yöntem farkı nedeniyle kesin değil.
- K2 spawn ilk karesi tanımı R066'da "ekrana giriş" olarak düzeltildi; örneklem düzeyinde geçti.

### Açık kabul ölçütleri (taşınan)
- **K3 tam:** Aynı tam çözünürlük yöntemiyle en az 30 kısa/yarım kalkışta ≥ 2,5 adım ≤ 1/20. Daha hızlı yol: kalkış anlarını uygulama sayacından almak (kod değişikliği; kullanıcı onayıyla).
- **His:** Kullanıcı ekranda (kayıt kapalıyken de olabilir) titreme görmüyor. Görüyorsa, 120 Hz / 60 Hz sunum farkını ayırmak için tek değişkenli bir deney önerilir (ör. kayıt açık/kapalı his karşılaştırması ya da display link hızı ölçümü). Fizik/kamera değişmez.
- **Kapanış:** Kabul sonrası `PERF_PROBE = false`. `HOUSE_GRAD_FIXED = true` kalır; `HOUSE_AB_FROZEN` ve teşhis kodunun temizliği ayrı ve onaylı bir adım.
TESLIM_HAZIR: REVIZYON-066 — iPhone'da K1 (uçuş > 25 ms 0/6720) ve K1b (ev-görün 0/154, ev-kaybol 0/145) geçti, K2 örneklemde geçti (14 giriş anı × 4 kare); K3 hedefli 20 kalkışta 1/20 (eşikte, kısmi örneklem) ve kullanıcı hissi açık; kod değişmedi; commit/push/deploy yok.

## REVIZYON-067 (2026-10-14) — kalan mikro-titreme: kullanıcı beyanı ve tek değişkenli A/B (gösterge açık / kapalı)
### R066 kabul denetiminin açıkları ve yeni beyan
- **Kullanıcı beyanı:** Gerçek oynayışta, ekran kaydı kapalıyken de zaman zaman küçük titremeler görülüyor. Bu, R066'daki "his açık" maddesini **başarısız** yapıyor.
- R066 sayacının ölçtüğü şey: UI geri çağrıları arasında > 25 ms aralık. Uçuşta 0/6720 olması 16,7 ms'nin altındaki/üstündeki küçük düzensizlikleri (ör. 20–25 ms kareler, sunumu kaçan kareler) **ölçmez.** Bu sonuç kalan mikro-titremeyi inkâr etmez.
- Açık maddeler:
  - K3 eşikte ve kısmi örneklem (1/20);
  - K2 tam kapsam değil;
  - kullanıcı hissi başarısız;
  - videoda düzenli PTS ile "0 + 2 adım" deseni (neden ayrılmadı);
  - JS > 25 ms 292 (gösterge kaynaklı olabilir; ölçülmedi).
- Korunan: `HOUSE_GRAD_FIXED = true` (R066 ağır takılma düzeltmesi), fizik/charge/çarpışma/parkur/RNG/kamera, R062 hizası.

### Deney (tek değişken)
- A = R066 paketi (`PERF_PROBE = true`): 5 satırlık gösterge, 500 ms `setTxt` React güncellemesi, JS rAF ölçüm döngüsü, UI-thread sayaçları ve ev olay etiketleri.
- B = aynı kod, `PERF_PROBE = false`.
  - Gösterge, `setTxt`, JS rAF döngüsü ve tüm UI-thread sayaçları kapalı.
  - Tek ekleme, paketi tanımak için bir kez çizilen sabit etiket `R067-B: SAYAC KAPALI` (hiç güncellenmez).
  - `HOUSE_GRAD_FIXED = true` aynı.
- Kare aralığı histogramı (8/16/24 ms) bu A/B'ye **eklenmedi**: ayrı bir ölçüm değişkeni olur ve B'nin "ölçüm yükü yok" koşulunu bozar. B sonucuna göre sonraki adım olarak planlanacak.
- Fark yalnız `app/index.tsx`: `PERF_PROBE` satırı, `BUILD_TAG` sabiti ve etiket görünümü (11 satır).
- Yedekler (`~/Documents/Codex/carsamba-revizyon067/`):
  - `yedek/index-066-A-overlay-on.tsx` (A);
  - `index-067-B-overlay-off.tsx` (B).
  - Geri alma: `PERF_PROBE = true`.
- Kontroller:
  - `app/index.tsx` tsc 0, worklet PASS, `closure_check` 16/16 `houseGeom`, iOS export çıkış 0, `git diff --check` temiz.
  - Web 8083: etiket görünüyor, gösterge yok; hiza 2458 kare / 36546 cap 0 hizasız; gradyan kutu farkı ≤ 0,004 px; Play Again 5/5 hata yok.
- Telefona giden paket (8082, PID 4929, `exp://192.168.1.105:8082`, manifest `launchAsset` bytecode/hermes-stable URL'si, md5 `7f269122…`):
  - `R067-B: SAYAC KAPALI` 1;
  - gösterge metinleri (`liste degisimi`, `ev-gorun`, `GRADYAN SABIT KUTU`) 0;
  - `EVLER DONDURULMUS` 0;
  - `houseLightFixed`/`houseShadeFixed` var, `houseGeom` var.
  - `/status` 200.

### Test ve kabul
- Kullanıcı adımı: Expo Go'yu tamamen kapat → 8082 QR (`expo 8082 iOS` sekmesi) → sol üstte yalnız `R067-B: SAYAC KAPALI` yazmalı (sayaç satırları yok). Kayıt kapalı 2–3 dk oyna; sonra ister kayıtla ≥ 120 s, ≥ 20 tam + ≥ 15 yarım/kısa basış.
- Kabul:
  - **His:** B'de küçük titreme A'ya göre belirgin azalmış ya da yok (kullanıcı beyanı).
  - **K3:** kısa/yarım kalkışta sıçrama ≤ 1/20.
  - **K2:** yeni evin girişinde çatı–cap hizası.
  - **K4:** fizik/kamera/parkur aynı.
- B'de sayaç olmadığı için takılma sayıları ölçülmez; B'nin kanıtı his + video.

### B işe yaramazsa — sonraki ölçüm planı (bugün kanıtlanmış neden DEĞİL)
1. **Kare aralığı histogramı** (ayrı değişken):
   - UI geri çağrısında `timeSincePreviousFrame` için ≤ 12 / 12–20 / 20–25 / > 25 ms kovaları ve ardışık uzun-kısa çiftleri.
   - Ekranda yeniden çizim yapmadan tutulur; yalnız Game Over ekranında bir kez gösterilir.
   - Amaç: 120 Hz display link'te 8,3 ms'lik aralıkların ve 60 Hz'te 16,7 / 33 ms dağılımının görülmesi.
2. **120 Hz / 60 Hz ayrımı:** Expo Go'da `CADisableMinimumFrameDurationOnPhone` ve ProMotion durumu histogramdan okunur.
   - Kare aralıkları 8,3 ms katlarında dağınıksa (8/16/25 karışık), oyun hızı ekran yenilemesiyle hizalanmıyor demektir.
   - Bu durumda bir sonraki deney: aynı fizik adımıyla yalnız sunum düzgünleştirmesi ya da sabit 60 Hz kilidi. Kullanıcı onayıyla.
3. **Geç compositor teslimi:** UI geri çağrısı zamanında olduğu hâlde ekrana geç düşen kareler uygulama içinden ölçülemez. Ancak Instruments "Animation Hitches" ile ayrılır: Xcode lisansı + bağlı iPhone; Expo Go App Store derlemesinde kısıtlı olabilir. Gerekirse expo-dev-client kararı (kullanıcı onayı).
REVIZYON-067 ENGEL değil, ÖLÇÜM BEKLENİYOR — kullanıcı kayıt kapalıyken de mikro-titreme görüyor (R066 his maddesi başarısız; UI > 25 ms 0 bunu dışlamaz); tek değişkenli B = gösterge/ölçüm kapalı (`R067-B: SAYAC KAPALI`) hazır ve telefona giden paket doğrulandı; HOUSE_GRAD_FIXED korunuyor; commit/push/deploy yok.

## REVIZYON-068 (2026-10-14) — R067-B sonucu ve Game Over'da gösterilen kare/sıçrama tanılaması
### Denetim
| Madde | Durum | Kanıt / sınır |
|---|---|---|
| R066 ağır takılma düzeltmesi (`HOUSE_GRAD_FIXED = true`) | ✅ korunuyor | Kodda ve 8082 paketinde `houseLightFixed`/`houseShadeFixed` var. |
| R067-B: gösterge kapalıyken his | ✗ (kullanıcı beyanı) | Gerçek oynayışta titreme sürüyor. Göstergenin (500 ms `setTxt`, JS rAF, UI sayaçları) kaldırılması titremeyi gidermedi. |
| R067-B paketinin telefonda açıldığı | ◐ | Sunucu tarafında doğru: 2026-10-14'te 8082 (PID 4929, `exp://192.168.1.105:8082`) manifest `launchAsset` paketi md5 `7f269122…`, `R067-B: SAYAC KAPALI` 1, gösterge metinleri 0. **Telefonda etiketin görüldüğü kullanıcıdan doğrulanmadı.** |
| R066 K2 / K3 | ◐ | Örneklem düzeyinde (K2 14 an × 4 kare; K3 hedefli 20 kalkışta 1/20). Tam kapsam yok. |
| Mikro-titreme nedeni | ✗ bilinmiyor | UI > 25 ms 0/6720 alt-eşik düzensizlikleri ölçmüyor. Video "0 + 2 adım" deseni neden olarak ayrılmadı. 120/60 Hz ve geç compositor teslimi **hipotez**. |

### R068 ölçüm yöntemi (kod; oyun davranışı aynı)
- `FRAME_DIAG = true` (yeni bayrak). `PERF_PROBE = false` (R067-B ile aynı). `HOUSE_GRAD_FIXED = true`. Etiket `BUILD_TAG = "R068-DIAG"`: bir kez çizilen sabit metin.
- Mevcut frame callback'in sonunda, `camXR` güncellemesinden sonra:
  1. **Uçuş kare aralığı kovaları** (`timeSincePreviousFrame`): ≤ 12 / 12–20 / 20–25 / > 25 ms.
  2. **"bekle + sıçra"**: render kamerasının ekran adımı, `|ΔcamXR| × zoom` px.
     - Bir önceki uçuş karesinde ortalamanın %35'inin altında, bu karede %160'ının üstündeyse sayılır. Ortalama: uçuş içi üstel hareketli ortalama (α = 0,1, kalkışta sıfırlanır).
     - İlk 6 örnek zaman damgasıyla saklanır: iki karenin aralığı (ms), iki kamera adımı, ortalama, karakterin ekran X adımı `|Δ(px − camXR)| × zoom` ve ekran Y adımı `|Δpy| × zoom`.
  3. **kısa → uzun çift**: ≤ 12 ms aralığı ≥ 20 ms aralığın izlediği uçuş kare çiftleri (120 Hz display link ile 60 Hz sunum karışması için).
- Sonuçlar uygulama açılışından beri birikimli; Play Again sıfırlamaz.
- UI thread yalnız SharedValue yazar. JS yalnız `onGameOver` anında bir kez okur, Game Over kartında küçük metin olarak gösterir ve `console.log("[R068-DIAG]", …)` yazar.
- **Ölçüm yükü:**
  - Uçuş karesi başına ~15 SharedValue okuma/yazma; örnek yakalandığında küçük bir dizi kopyası (en fazla 6 kez).
  - Sürekli JS render yok; Game Over başına bir `setState`.
  - Yük cihazda ölçülmedi; R066 sayacından (her karede ~10 SV + reaction etiketleri, 5 satırlık 500 ms render) daha düşük.
- **Ayrıştırma mantığı:**
  - Uygulama kendi adımlarında "bekle + sıçra" ya da kısa→uzun çift görüyorsa, düzensizlik uygulamanın kare döngüsünde (display link zamanlaması).
  - Uygulama adımları düzgün (12–20 ms, desen 0) ama ekranda/videoda yinelenen kare görülüyorsa, düzensizlik oyun döngüsünün dışında (sunum/compositor) aranır.
- Yakalayıcı sınırları:
  - Fizik adımı her karede dt ile ilerlediği için "aynı konum" ancak çok kısa bir kare aralığında olur. 8,3 ms'lik (120 Hz) bir kare adımı ortalamanın ~%50'si olur ve %35 eşiğine takılmaz; bunu kısa→uzun çift sayacı yakalar.
  - Desen yakalayıcısı web'de tetiklenerek doğrulanamadı: tarayıcı rAF'ı vsync'ten kısa kare üretmiyor.
- Değişen dosya yalnız `app/index.tsx` (R067-B'ye göre ~80 satır).
- Yedekler (`~/Documents/Codex/carsamba-revizyon068/`):
  - `yedek/index-067-B.tsx` (R067-B);
  - `index-068-diag.tsx` (şimdiki).
  - Geri alma: `FRAME_DIAG = false` (etiket R067-B'ye döner).

### Testler (web / derleme; iPhone doğrulaması değil)
- `app/index.tsx` tsc 0, worklet PASS, `closure_check` 16/16 `houseGeom`, iOS export çıkış 0, `git diff --check` temiz.
- Web 8083 sabit tohum, 30 basış (150–1500 ms: kısa/yarım/tam), 12 Game Over + Play Again:
  - her Game Over'da tanı metni görünüyor ve konsola yazılıyor, hata yok (`R068_gameover_web.png`);
  - örnek: "ucus 2414 kare: ≤ 12ms 0 | 12–20 2414 | 20–25 0 | > 25 0; bekle+sicra 0 | kisa->uzun cift 0".
- Yapay ana thread gecikmesi enjekte edilmiş web koşusu (kod değişmeden): 1171 uçuş karesinin 105'i > 25 ms kovasına düştü. Kovalar düzensiz karede çalışıyor.
- Ev giriş/çıkışı ve hiza: 2455 kare / 36442 cap, 0 hizasız. Gradyan kutuları R066 ile aynı (≤ 0,004 px). Play Again 5/5 (`perf.py`), hata yok.
- Telefona giden paket (8082 manifest `launchAsset`, md5 `d350652b…`): `R068-DIAG` var, `kisa->uzun cift` var; `R067-B` etiketi, eski gösterge metinleri ve `EVLER DONDURULMUS` yok; `houseLightFixed` var.

### Açık riskler
- R067-B'nin telefonda açıldığı kullanıcı tarafından teyit edilmedi. R068'de etiket `R068-DIAG` sol üstte görülmeli.
- Tanılama yalnız uygulamanın kendi kare döngüsünü görür. Geç compositor teslimi ya da ekran yenileme hızı uyuşmazlığı uygulama adımları düzgünken de olabilir; o durumda Instruments (Xcode lisansı + bağlı iPhone; Expo Go kısıtlı) ya da expo-dev-client gerekir (kullanıcı kararı).
- K2/K3 tam kapsam açık.

### Kabul / sonraki karar
- Tek cihaz testi: Game Over kartındaki R068 satırları birkaç tam/yarım/kısa basışlı oyundan sonra (≥ 2 dk) fotoğraflanır; kullanıcı aynı oturumda titremeyi görüp görmediğini belirtir.
- Yorum:
  - ≤ 12 ms kovası ve kısa→uzun çiftler yüksekse: oyun 120 Hz display link'te düzensiz aralıkla çalışıyor. Sonraki dar deney sunum hızını sabitlemek ya da adımı yumuşatmak olur (onaylı; fizik formülü değişmez).
  - Hepsi 12–20 ms ve desen 0 ise: uygulama döngüsü düzgün; neden sunum tarafında. Instruments/dev-client kararı.
  - 20–25 / > 25 kovaları doluysa: UI thread iş yükü; R065 tarzı olay eşleştirmesine dönülür.
- Kök neden kanıtlanmadan kamera/oyun davranışı değişmez.
REVIZYON-068 — ÖLÇÜM BEKLENİYOR: R067-B gösterge kapalıyken titreme sürdü (kullanıcı beyanı; telefonda etiket teyidi yok); R068-DIAG Game Over'da gösterilen düşük maliyetli kare aralığı/bekle+sıçra/kısa→uzun tanılaması eklendi, web ve paket doğrulandı, desen yakalayıcı web'de tetiklenemedi (sınır kayıtlı); fizik/kamera/parkur değişmedi; commit/push/deploy yok.

### REVIZYON-068 — R067-B kullanıcı teyidi (2026-10-14)
- Kullanıcı, titremeyi gördüğü sürümün sol üst etiketinin kesin olarak `R067-B: SAYAC KAPALI` olduğunu doğruladı.
- Sonuç:
  - R067-B cihaz deneyi gerçekten **başarısız**.
  - Ölçüm göstergesi/sayaç yükü (500 ms `setTxt`, JS rAF döngüsü, UI-thread sayaçları) mikro-titremenin nedeni **değil**.
  - Yukarıdaki denetimdeki "telefonda etiket teyidi yok" maddesi kapandı.
- Kalan adaylar (kanıtlanmadı): uygulama kare döngüsündeki aralık düzensizliği (120/60 Hz), geç sunum/compositor teslimi, UI thread'de 25 ms altı iş yükü.
- Tanı R068-DIAG ile sürüyor. Telefonda sol üst etiket `R068-DIAG` olmalı. Sonuç Game Over kartındaki R068 satırlarından okunacak.

## REVIZYON-069 hazırlığı (2026-10-14) — R068 cihaz sonucu: uygulama döngüsü düzenli, görüntüde dur–sıçra var (KOD DEĞİŞMEDİ)
Kaynak: `ScreenRecording_10-14-2026 14-33-04_1.MP4` (R068-DIAG). Kullanıcı titremeyi oynarken de hissediyor; kayıt artefaktı olarak ele alınmadı.

### R068 denetimi
| İstek | Durum | Kanıt / sınır |
|---|---|---|
| Paket/QR/BUILD_TAG teyidi | ✅ | 8082 manifest `launchAsset` md5 `d350652b…`, `R068-DIAG`; kullanıcı videosunda R068 sürümü. |
| Uçuş kare aralığı kovaları + bekle+sıçra + kısa→uzun, Game Over'da tek gösterim | ✅ cihaz | Kullanıcı okuması: ~52 s 1383 uçuş karesi, ~100 s 3004; hepsi 12–20 ms; ≤ 12 / 20–25 / > 25 = 0; bekle+sıçra 0; kısa→uzun 0. |
| Web/araç testleri | ✅ | R068 kaydı. |
| Mikro-titreme nedeni | ✗ bilinmiyor | Aşağıda. |
| **R068 tanılamasının kör noktası** | — | Kovalar ve desen yakalayıcı uygulamanın kendi kare döngüsünü ölçüyor. Bu döngünün zaman damgası vsync'e kuantize (aşağıda). Kare ekrana geç düşse de sonraki geri çağrı zamanında gelir. **Sonucun 0 olması sorun yok demek değildir.** R068 yorum kuralındaki "hepsi 12–20 ms ve desen 0 → neden döngü dışında (sunum)" dalı gerçekleşti. |

### Bağımsız video ölçümü (görüntü kanıtı)
- 23–50 s, tam çözünürlük LK (R063–R066 ev bandı yöntemi; `~/Documents/Codex/carsamba-revizyon069/videoG/win.py`, `holds.py`).
- Hareketli bölümde PTS ≈ 16,7 ms olan 876 iç karenin **74'ünde (%8,4)** ev katmanı bir karede **tam 0 px**, sonraki karede **tam 2 adım** (ör. 10,14 → 0,00 → 20,24 px; 7,98 → 0 → 15,99).
- Kullanıcının ROI ölçümü (151/1586) ile aynı yönde.
- Yorum: Sonraki karedeki adım tam 2,00 kat. Uygulama iki kareyi de hesaplamış, ama aradaki kare ekranda/kayıtta yer almamış. Oyun saati kaybı yok.
- Örnekler 23,4–24,6 s ve 26–28 s'de yoğun; kullanıcının gözle fark ettiği 23–24 s ile uyumlu.

### Kod ve resmî kaynak araştırması — UI geri çağrısı düzenliyken neden dur–sıçra olabilir
1. **Zaman damgası vsync'e bağlı:** `react-native-worklets/apple/worklets/apple/AnimationFrameQueue.mm` ve `react-native-reanimated/apple/.../PlatformDepMethodsHolderImpl.mm` kare zaman damgasını `CADisplayLink.targetTimestamp` (karenin gösterilmesi hedeflenen an) olarak veriyor.
   - `useFrameCallback`'in `timeSincePreviousFrame` değeri hedeflenen vsync'lerin farkı ve geri çağrı atlanmadıkça ~16,7 ms.
   - Fizik dt'si de bundan geliyor. Bu yüzden oyun durumu her karede düzgün ilerliyor; o kare zamanında sunulmazsa ekranda "aynı kare + sonra 2 adım" görülür.
   - Display link `preferredFramesPerSecond = 120` istiyor. Ölçülen aralıklar 60 Hz gösteriyor; Expo Go'nun iPhone'da 120 Hz anahtarını (`CADisableMinimumFrameDurationOnPhone`) açmadığı **varsayılıyor**, doğrulanmadı.
2. **Apple hitch modeli** (Tech Talk 10855 "Explore UI animation hitches and the render loop"; 10856 "Find and fix hitches in the commit phase"):
   - Hitch, karenin beklenenden geç ekrana gelmesidir.
   - **Commit hitch:** uygulama sürecinde commit son tarihi kaçırılır.
   - **Render hitch:** render server'da çizim kareye yetişmez.
   - İkisi de uygulamanın display-link geri çağrısını atlatmak zorunda değildir.
3. **Bu oyundaki commit yolu** (Reanimated 4.5.1):
   - `IOS_SYNCHRONOUSLY_UPDATE_UI_PROPS = false`; her kare `performOperations → commitUpdates` (shadow tree klonu + düzen + mount) ana thread'de.
   - Uçuşta her karede güncellenenler: dünya kabının transform'u (`worldStyle`), arka planın transform'u + sabit width/height (`bgFarStyle`), karakter stilleri.
   - `groundBandStyle` (`left` her kare) bağlı bir görünüm olmadan çalışıyor; katman `{false && …}` ile kapalı.
   - Uçuşta React commit'i yok: skor inişte, "PERFECT" kapanışı inişten 750 ms sonra.
   - Bu yüzden Reanimated'in "React commit sırasında commit'i bekletme" mekanizması (`shouldReanimatedSkipCommit`) %8'lik sık deseni açıklamaya yetmiyor; ancak dışlanmadı.
4. **Render tarafındaki aday:** Her evde iç içe iki döndürülmüş, `overflow: hidden` çatı kırpma kutusu var: `styles.houseRoofClipL` / `houseRoofClipR`, satır 2423/2425, 1200 × 1200 birim, ±hip açısı.
   - Ekranda ~7 ev → ~14 eksen dışı kırpma. Core Animation'ın döndürülmüş katmanda sınıra kırpmayı ekran dışı geçişle yapması render maliyetini artırabilir.
   - Bu bir **hipotez**: cihazda ölçülmedi, Apple belgesinden bu kurulum için doğrulanmadı.
5. **Piksel yuvarlama:** Dünya ve arka plan transform ile taşınıyor (Yoga düzen yuvarlaması transform'a uygulanmıyor); ev/cap konumları da transform. Yuvarlama 0/2 adım deseni üretmez; düşük olasılık.
6. **Farklı thread'lerde güncellenen katmanlar:** Uçuşta hareket eden katmanların hepsi aynı UI-thread mapper geçişinde güncelleniyor (dünya, arka plan, karakter). Desen ev bandında tek başına değil, ama bu kayıtta yalnız ev bandı ölçüldü. Katmanlar arası faz farkı **ölçülmedi**.

### Açık hipotezler (hiçbiri kanıtlanmadı)
- **H1 render hitch:** döndürülmüş kırpma maskeleri ve büyük yarı saydam katmanların GPU/render server maliyeti.
- **H2 commit hitch:** ana thread'de her kare Fabric commit + mount; geri çağrı süresi < 16,7 ms olsa bile CA commit'inin son tarihi kaçırması.
- **H3 60 Hz içerik / ProMotion ekran sunum fazı:** display link 60 Hz'de; ekranın değişken yenilemesiyle faz kayması.
- **H4 React commit bekletmesi:** uçuşta React commit'i olmadığından düşük olasılık.

### Önerilen sonraki tek değişkenli A/B (uygulanmadı; onay bekliyor)
- **Değişken:** yalnız çatı kırpma maskeleri. Yeni bayrak `HOUSE_ROOF_MASK_DIAG`.
  - `true` iken satır 2026 ve 2028'deki iki görünüm stiline `{ overflow: "visible" }` eklenir (`styles.houseRoofClipL/R` aynı kalır).
  - Görünüm, transform, layer sayısı, fizik, kamera, parkur, gradyan düzeltmesi aynı.
  - Etiket `R069-B: MASKE KAPALI` (`BUILD_TAG`); `FRAME_DIAG` açık kalır (kontrol olarak 12–20 ms beklenir).
- **Bilinçli görsel bozulma:** çatı yüzü dış band dikdörtgeniyle kırpılır (kalça üçgenlerinin köşeleri dolar). Yalnız ölçüm koşuludur, oyuna bırakılmaz.
- **A:** mevcut R068-DIAG. **B:** R069-B. Aynı iPhone, kayıt açık ve kapalı his.
- **Ölçütler:**
  1. Video dur–sıçra oranı (aynı `win.py`/`holds.py`, uçuş dolu ≥ 25 s pencere): A %8,4 tabanına göre B ≤ %3 ise H1 (maske render maliyeti) güçlü biçimde desteklenir. Değişmezse H1 zayıflar.
  2. Kullanıcı hissi: B'de titreme belirgin azaldı mı.
  3. R068 kovaları B'de de 12–20 ms (kontrol).
- **B olumluysa:** maskesiz ama aynı görünümde çatı (ör. önceden kesilmiş çatı yüzü görseli) için dar bir görsel düzeltme ayrıca önerilir; R062 hizası korunur.
- **B olumsuzsa:** commit/render ayrımı için Instruments "Animation Hitches" (Xcode lisansı `sudo xcodebuild -license` + kabloyla iPhone; Expo Go App Store derlemesinde izin sınırlı olabilir) ya da expo-dev-client kararı. H3 için 120 Hz anahtarı yalnız dev-client'te denenebilir.
- Kaynaklar:
  - Apple Tech Talk 10855 https://developer.apple.com/videos/play/tech-talks/10855
  - Apple Tech Talk 10856 https://developer.apple.com/videos/play/tech-talks/10856
  - Apple "Optimizing ProMotion refresh rates for iPhone 13 Pro and iPad Pro" https://developer.apple.com/documentation/quartzcore/optimizing_promotion_refresh_rates_for_iphone_13_pro_and_ipad_pro
REVIZYON-069 hazırlık — KOD DEĞİŞMEDİ: R068 sayaçları 12–20 ms / desen 0 iken video 23–50 s'de %8,4 tam 0 + 2 adım; sayaç targetTimestamp'e kuantize olduğu için sunum gecikmesini göremez; H1–H4 açık; önerilen tek değişkenli A/B: çatı kırpma maskeleri kapalı (R069-B), onay bekliyor; commit/push/deploy yok.

## REVIZYON-069 (2026-10-14) — tek değişkenli cihaz A/B: çatı kırpma maskeleri kapalı (R069-B)
> **UYARI — GEÇİCİ ÖLÇÜM SÜRÜMÜ, NİHAİ TASARIM DEĞİL:** R069-B'de çatı yüzleri yamuk değil dikdörtgen görünür (kalça köşeleri dolu). Bu yalnız maskelerin render maliyetini ölçmek içindir; oyunda bırakılmayacak.

### Denetim (başlangıç)
- R068 istek/teslim: R069 hazırlık kaydında denetlendi (sayaç/etiket/Game Over tek gösterim ✅; sayacın sunum gecikmesine kör noktası kayıtlı).
- Kod durumu doğrulandı: `app/index.tsx` tur başında `~/Documents/Codex/carsamba-revizyon068/index-068-diag.tsx` ile birebir aynı. Bayraklar: `PERF_PROBE = false`, `FRAME_DIAG = true`, `HOUSE_GRAD_FIXED = true`, `HOUSE_AB_FROZEN = false`.

### Değişiklik
- Değişen dosya: yalnız `app/index.tsx`.
- **Tek değişken:** yeni `HOUSE_ROOF_MASK_DIAG = true` ve `ROOF_MASK_OFF = { overflow: "visible" }`. Yalnız iki çatı kırpma görünümünün stil dizisine eklenir:
  - `<Animated.View style={[styles.houseRoofClipL, ROOF_MASK_OFF, clipLStyle]}>`
  - `<Animated.View style={[styles.houseRoofClipR, ROOF_MASK_OFF, clipRStyle]}>`
- `styles.houseRoofClipL/R` tanımları, döndürmeler, görünüm/katman sayısı, dış bant kırpması (`houseClip`), gradyan düzeltmesi, R068 ölçeri, fizik/charge/çarpışma/skor/parkur/RNG ve kamera aynı.
- Etiket: `BUILD_TAG = "R069-B: MASKE KAPALI (cati koseleri GECICI bozuk, olcum)"`.
- Fark: R068'e göre 9 satır.
- **Geri dönüş:** `HOUSE_ROOF_MASK_DIAG = false` (etiket R068-DIAG'a döner) ya da `cp ~/Documents/Codex/carsamba-revizyon069/yedek/index-068-diag.tsx app/index.tsx`. B kopyası `index-069-B.tsx`.

### Testler (web / derleme — iPhone doğrulaması değil)
- `app/index.tsx` tsc 0 (yalnız dokunulmamış `src/theme.ts` eski hataları), worklet PASS, `closure_check` 16/16 `houseGeom`, iOS export çıkış 0, `git diff --check` temiz.
- **Aynı sahne web A/B** (`mask_ab_web.py`, sabit tohum, 3 sahne, 2× piksel):
  - B dosyadaki R069-B. A aynı karede DOM'da yalnız 14 evin `houseRoofClipL/R` kutularına `overflow: hidden` geri verilerek elde edildi. Yapı kontrolü: 1200 px + `rotate`, 14/14 kutu.
  - Fark piksellerin %0,73–0,74'ü; yalnız kalça köşesi üçgenlerinde (`web_AB0..2.png`: sol A, orta B, sağ fark kırmızı). Kalan küçük farklar hareket eden martılar.
  - İlk koşuda betik, RN-web `<Image>` sarmalayıcısı yüzünden yanlış iki kutuyu kırptı (A'da çatılar kayboldu); yapı kontrolü eklenerek düzeltildi. Geçersiz ilk çıktının üzerine yazıldı.
- Geometrik hiza: 2468 kare / 36700 cap, 0 hizasız. Gradyan kutuları R066 ile aynı (≤ 0,004 px).
- Play Again 5/5, hata yok. R068 Game Over tanısı 12/12 Game Over'da görünüyor (web: uçuş 2414 kare, hepsi 12–20 ms).
- **Web sınırı:** Tarayıcı CSS kırpmasını farklı bir motorla çizer. Web, maske maliyetini ya da iPhone'daki dur–sıçrayı ölçemez; yalnız görsel kapsamı ve oyunun bozulmadığını gösterir.

### Telefona giden paket
- 8082 (PID 4929, `exp://192.168.1.105:8082`, `/status` 200), manifest `launchAsset` (bytecode/hermes-stable), md5 `ac1363fa…`:
  - `R069-B: MASKE KAPALI` 1;
  - R068 ölçer metni (`kisa->uzun cift`) 1;
  - `R067-B` / eski gösterge / `EVLER DONDURULMUS` 0;
  - `houseLightFixed` var.

### Ölçüt (A = R068-DIAG videosu `14-33-04`, 23–50 s %8,4)
- B videosunda aynı `win.py`/`holds.py` ile uçuş dolu ≥ 25 s pencerede dur–sıçra ≤ %3 ve kullanıcı titremenin belirgin azaldığını söylerse H1 (maske render maliyeti) güçlü destek alır.
- Değişmezse H1 zayıflar; sonraki adım Instruments Animation Hitches ya da dev-client kararı.
- R068 kovaları kontrol olarak yine 12–20 ms beklenir.
- Kullanıcı hissi bu kayıtta iddia edilmiyor.

### iPhone'da tek adım
Expo Go'yu tamamen kapat → `expo 8082 iOS` sekmesindeki QR → sol üstte `R069-B: MASKE KAPALI (cati koseleri GECICI bozuk, olcum)` görünmeli → ≥ 2 dk oyna (kısa/yarım/tam), ekran kaydı açık → his + Game Over R068 satırları + video.
REVIZYON-069 — ÖLÇÜM BEKLENİYOR: R069-B (yalnız iki çatı kırpma maskesi kapalı, geçici görsel bozulma) uygulandı; web aynı sahne A/B farkı yalnız kalça köşeleri (%0,74), hiza 0, Play Again 5/5, export 0; telefona giden paket R069-B; cihaz sonucu bekleniyor; commit/push/deploy yok.

## REVIZYON-069 kapanış / açık performans sorunu (2026-10-16)
- R069-B iPhone denemesi olumsuz: kullanıcı takılmanın devam ettiğini ve dikdörtgenleşen çatı tepelerinin kötü göründüğünü bildirdi. `HOUSE_ROOF_MASK_DIAG=false` ile önceki çatı biçimi geri alındı. 2026-10-16 videosunda `R068-DIAG` etiketi ve eski üçgen tepeler görüldü; oyun açılıyor/oynanıyor, fakat kullanıcı takılmayı hâlâ hissediyor.
- Önceki `ÖLÇÜM BEKLENİYOR` kaydı tarihsel kayıt olarak kalır; R069-B artık kabul adayı değildir. Tek çatı maskesi hipotezi desteklenmedi. Fizik/charge/kamera/procedural course değiştirilmedi.
- Sıradaki adım: sunum/commit/render gecikmesini iPhone'da yerel profiler ile ayır. Bu Mac'te yalnız Xcode Command Line Tools var; `xctrace` çalışmıyor. Tam Xcode kurulmadan Instruments sonucu iddia etme; yeni bir rastgele optimizasyonla sorunu kapatma.

## R070-A ortam engeli (2026-11-07, Claude Code yöneticisi — devam oturumu)
- Doğrulama: `app/index.tsx` bayrakları üstteki GÜNCEL DURUM bloğuyla aynı (`BUILD_TAG` → `R068-DIAG`). Üst blok "aşağıdaki REVIZYON-070-A bölümü"ne atıf yapıyor ama böyle bir bölüm yazılmamıştı; bu kayıt onun yerini tutar. Commit'lenmemiş `app/index.tsx`, `src/game/config.ts`, `character-pose.ts`, `launch.json`, `AI_REVIEW.md` ve izlenmeyen dosyalar olduğu gibi bırakıldı.
- 8083 süreci ayakta değildi. `scripts/start-expo-prod-test.sh` yeniden çalıştırıldı (LAN IP artık `192.168.1.209`; eski kayıtlardaki `.105` geçersiz) ama Expo "Starting project" adımında CPU %0'da 3+ dk takıldı; durduruldu.
- **Kök neden:** `~/Documents` iCloud Drive ile eşitleniyor ve `frontend/node_modules` içindeki 49.995 dosyanın 49.299'u buluta boşaltılmış (dataless yer tutucu; yerelde 139 MB). Watchman günlüğünde `Resource deadlock avoided`. `brctl download` + paralel okuma ile indirme dakikada ~35 dosya — pratik değil. `app/`, `src/`, `assets/`, `scripts/` tamamen yerelde.
- Önceki oturumun 8083 beklemesi de büyük olasılıkla bu nedenle; R070-A cihaz denemesi bu çözülmeden yapılamaz. Oyun kodu değişmedi.
- Önerilen çözüm (kullanıcı onayı bekliyor): boşaltılmış `node_modules` → `node_modules.icloud-eski` adına taşınır (silinmez), `npm ci` ile `package-lock.json`'dan aynı sürümler yeniden kurulur, sonra 8083 başlatılır. Kalıcı önlem (ayrı karar): depoyu iCloud dışına almak ya da `node_modules`'ü eşitleme dışı bırakmak.
- **Çözüm uygulandı (kullanıcı onayıyla, 2026-11-07 ~20:00):** boşaltılmış klasör `node_modules.icloud-eski` adıyla kenara taşındı (silinmedi; yalnız yerel `.git/info/exclude`'a eklendi), `npm ci` lockfile'dan 841 paketi 6 sn'de kurdu: 49.995 dosya, 0 dataless; Expo 57.0.19 / RN 0.86.3 / Reanimated 4.5.1 aynı. `package.json`/lockfile değişmedi.
- 8083 ayakta (`exp://192.168.1.209:8083`, `/status` running). Manifest `launchAsset`: `dev=false&minify=true`, hermes bytecode. Paket 6,09 MB, md5 `45436273…`: `R068-DIAG` var; `R069-B` ve `EVLER DONDURULMUS` 0.
- R070-A ÖLÇÜM BEKLENİYOR: iPhone'da Expo Go tamamen kapatılıp 8083 QR'ı okutulacak; ≥2 dk kısa/yarım/tam basış, ekran kaydı + his (8082 geliştirme moduna göre fark). Sonuç net değilse "belirsiz" yazılır; kod değişmez.
- **2026-11-08 cihaz sonucu — R070-A ENGELLENDİ:** iPhone'daki Expo Go App Store'dan SDK 58.0.0'a güncellenmiş; proje SDK 57 olduğu için "Project is incompatible with this version of Expo Go" ekranı. Eski Expo Go iOS'a kurulamıyor; bu yüzden 8082 geliştirme modu da artık açılmaz (A tabanı da kayboldu). SDK 58 = RN 0.88.1 / React 19.3.0 (SDK 57: RN 0.86.3 / React 19.2.3). Seçenekler: (1) projeyi SDK 58'e yükseltmek (bağımlılık değişikliği; oyun kodu aynı kalır ama RN sürümü ayrı bir değişken olur), (2) development build (Apple hesabı/imzalama + tam Xcode). Kullanıcı kararı bekleniyor; hiçbir yükseltme yapılmadı.
- **2026-11-08 karar — SDK 58'e yükseltildi (kullanıcı onayı):** oyun kodu değişmedi; ayrıntı ve testler `AI_REVIEW.md` "SDK-58 yükseltmesi". 8082 (geliştirme) ve 8083 (üretim) SDK 58 ile ayakta. Yeni taban: önce aynı kodun SDK 58'de takılıp takılmadığı, sonra 8082↔8083 farkı. SDK 57 ölçümleri artık doğrudan karşılaştırılamaz. Commit yok.
- **2026-11-08 video (SDK 58, 8082 geliştirme):** takılma sürüyor (video dur+sıçra %7,3; SDK 57 tabanı %8,4). 20 tur, ort. skor ≈ 7, 6 tur 0. Sıradaki: aynı ölçüm 8083 üretim modunda. Ayrıntı `AI_REVIEW.md`.
- **2026-11-08 R070-A SONUÇ:** üretim modu (8083) dur+sıçra %7,9 ≈ geliştirme (8082) %7,3 → mod farkı yok; takılma sürüyor. R070-B (development build: Apple hesabı/imzalama + tam Xcode) kullanıcı kararı bekliyor. Kod değişmedi, commit yok.
TESLIM_HAZIR: R070-A — geliştirme/üretim modu iPhone karşılaştırması tamamlandı (fark yok, %7,3 vs %7,9; kanıt AI_REVIEW.md "R070-A sonucu"); kullanıcı kararı bekliyor: R070-B development build.
- **2026-11-08 R070-B hazırlık:** `R070B-HAZIRLIK.md` yazıldı. Xcode 27.2 artık kurulu ve `xctrace` çalışıyor (önceki "tam Xcode yok" kaydı güncel değil); eksikler: CocoaPods, Xcode'da Apple ID (ücretsiz Personal Team yeterli), iPhone Geliştirici Modu, kişisel bundle ID. Plan: B0 yerel Release derleme (60 Hz) → B1 yalnız 120 Hz izni; her biri video + Instruments. Kullanıcı adımları ve onay bekleniyor; hiçbir hesap işlemi/kurulum yapılmadı.
- **2026-11-10 R070-B:** B0 Release derlemesi (`com.urazonturk.carsamba`, Personal Team) telefona kuruldu; kullanıcı profil güveni bekleniyor. B0 = yerel derleme + 120 Hz izni (Expo şablonu varsayılanı); B1 = aynı derleme 120 Hz kapalı. Kod değişmedi, commit yok. Ayrıntı `AI_REVIEW.md`.
- **2026-11-10 R070-B B0 SONUÇ:** yerel Release derleme (Expo Go yok, 60 Hz) dur+sıçra %8,7 ≈ Expo Go %7,3–7,9 → Expo Go neden değil. Sıradaki: Instruments Animation Hitches izi (yerel derleme, kullanıcı oynarken). Kod değişmedi, commit yok.
- **2026-11-10 Instruments sonucu:** sunumda yalnız ~%1,5–2 kare kaçırma, ama videoda %8,7 içerik takılması → güncellemeler bir kare geç uygulanıyor (Reanimated commit yolu en güçlü aday). Öneri B1: tek ayar `IOS_SYNCHRONOUSLY_UPDATE_UI_PROPS=true`, yerel derleme; kullanıcı onayı bekliyor.
- **2026-11-10 ölçüm yöntemi kararı:** kontrol testi, iOS ekran kaydının 60 Hz içerikte kendisinin "dur + çift adım" ürettiğini gösterdi (%0–56 patlamalı; 120 Hz içerikte %0). Video metriği takılma ölçüsü olarak bırakıldı; birincil metrik Instruments sunum aralıkları (B0 tabanı ≈ %2 geç kare, ~0,9/sn) + kullanıcı hissi. Sıradaki aday deneyler: (1) 120 Hz kare isteği, (2) offscreen pass azaltma (çatı kırpmaları). Kod değişmedi, commit yok.
- **2026-11-10 render deneyleri:** R071-A (yuvarlak köşe kırpmaları kaldırıldı, görüntü aynı) ve çatı maskeleri ölçüm amaçlı kapalı denendi. İkisi birlikte oyun sırasında render'ı ~10 → ~8,8 ms indirdi; ne geç kare oranı ne de takılma belirgin değişti. Çatı maskesi geri alındı (kabul edilmiş siluet aynı), R071-A açık. Kalan ~9 ms render'ın kaynağı bilinmiyor; sıradaki adım Xcode'da "Color Offscreen-Rendered / Blended Layers" ile görsel teşhis. Commit yok.
- **2026-11-10 render teşhisi:** Xcode "Color Offscreen-Rendered" ile oyunun tüm ekranının her karede ekran dışı çizildiği görüldü; bisect kaynağı görsel katmanlarına daralttı (arka plan, karakter, ev cepheleri). Fotoğraflar/Safari'de görseller normal → sorun bizim görsel katmanı kurulumumuza özgü. Ölçek ve expo-image tek başına neden değil. Sıradaki: yerel teşhis modülüyle katman özelliklerini tek tek denemek (kullanıcı kararı). Kod R071-A durumunda, commit yok. Ayrıntı `AI_REVIEW.md`.
- **2026-11-10 R075 — render kök nedeni çözüldü:** React Native, kırpan görsel kutularının içindeki her görsele maske takıyordu (95 katman, her karede ekran dışı çizim). Görseller kırpmasız (`NoClipImage`) çizilince render p90 11,3 → 6,7 ms, p99 14,4 → 8,1 ms, 120 Hz bütçesini aşan kare %41 → %1. Görüntü aynı (kullanıcı onayı). Kalan ~%2 geç kare uygulama güncellemelerinden (render değil). Kod R075 durumunda, commit kullanıcı onayı bekliyor.
TESLIM_HAZIR: R075 — görsel maskesi kaldırıldı, render maliyeti yarıya indi (Instruments: AI_REVIEW.md "R075 sonucu"); kullanıcı kararı bekliyor: his testi + commit; sonraki hedef uygulama güncelleme takılmaları / 120 Hz denemesi.
- **2026-11-10 R075 kullanıcı hissi:** "biraz akıcı" (Instruments render iyileşmesiyle tutarlı; kalan ~%2 geç kare uygulama güncellemelerinden).
- **2026-11-10 R076 kararı:** kullanıcı hissi "daha akıcı" (R075'e göre); Instruments'ta geç yüzey %2,14 → %0,62, commit yolu payı %44 → %16 (resmî hitch sayısı tek koşuda arttı, oynanış farkıyla belirsiz). R076 (R075 + `IOS_SYNCHRONOUSLY_UPDATE_UI_PROPS=true`) çalışma sürümü olarak tutuluyor. Commit kullanıcı onayı bekliyor.
- **2026-11-10 KAMERA-HIS-001 / R077:** kullanıcının "karakter yerinde zıplıyor, kolonlar hareket ediyor" şikâyeti ölçüldü (Spring Ninja'da da karakter x'i sabit; fark arka planın kaymasında: SN zemini kolonlarla 1:1, bulutlar ~yarı hız; bizde deniz/silüet ~%8 ve kenarda duruyordu). R077 deneme: arka plan aynalı karolarla sınırsız, %45 hızda kayıyor → kullanıcı: "daha iyi". Karar bekleyen: kalıcı döşenebilir katman görselleri (gök+silüet, deniz) üretimi. Commit yok.

## GORSEL-DEG-001 — kolon/ev yapıları bağımsız değerlendirme (2026-11-10)
Görseller: `side-session-notes/.../carsamba-kolon-degerlendirme/` (oyun ekranı, yakın plan, Spring Ninja karşılaştırması). Değerlendirenler birbirinin puanını görmeden yanıtladı.

| Başlık | Oyun yöneticisi | Kitap oturumu | Film yöneticisi |
|---|---|---|---|
| Arka planla üslup uyumu | 7 | 6 | 7 |
| İniş yerinin okunurluğu | 5 | 4 | 4 |
| İşçilik / detay | 5 | 6 | 5 |
| Çeşitlilik | 4 | 4 | 4 |
| **Genel** | **6** | **5** | **5** |

Üçünün ortak bulguları: (1) ön plan–arka plan ayrımı yok (kuleler arkadaki evlerle aynı ton/değer/netlik) → hedef kule kalabalıkta kayboluyor; (2) iniş noktası belirsiz (sivri tepe, arka plan çatılarıyla aynı kiremit tonu); (3) düz, gölgesiz, düşük çözünürlüklü ve tekrar eden cephe dokusu (dikiş/kesik izleri, kiremitte beyaz parlama çizgileri, alt uç belirsiz); (4) çeşitlilik yok.
Ortak öneriler (çatı silueti korunarak): koyu dış kontur + tek yön kenar gölgesi, arka plan evlerine atmosferik soluklaştırma; mahya vurgusu + daha doygun kiremit (+ şarj sırasında hedef tepe parıltısı); 3–4 sıva rengi ve cephe modülü, yüksek çözünürlüklü dikişsiz doku. Ek: "Hold to charge" yazısı kulelerin üstünde okunmuyor.
Karar bekleyen: önce kodla yapılabilecek hızlı deneme (kontur/gölge/arka plan soluklaştırma/mahya vurgusu) mı, yoksa Görsel atölyesinden yeni cephe varlıkları mı.
- **2026-11-10 GORSEL-018 şartnamesi:** `GORSEL-SARTNAME-2026-11.md` yazıldı — yüksek çözünürlüklü ve dikeyde dikişsiz cephe (4 sıva rengi × 3 modül, 350×1400 px), beyaz parlamasız ve daha doygun kiremit (1215×118) + mahya vurgusu, iki yatayda dikişsiz arka plan katmanı (A gök+silüet 3840×2000 ~0,15–0,2 hız; B deniz 3840×1500 ~0,45), daha soluk arka mahalle şeridi; kontur/gölge/parıltı kodda. Çatı silueti ve oynanış sabit. Üretim/harcama kararı kullanıcıda.
TESLIM_HAZIR: GORSEL-018 şartname — `frontend/GORSEL-SARTNAME-2026-11.md`; kullanıcı kararı bekliyor: görsel üretimini kim/nasıl yapacak.
- **2026-11-10 GORSEL-018 iletimi:** kullanıcı Codex'e iletilmesini istedi; doğrudan araç yok → yapıştırılacak metin `CODEX-MESAJI-GORSEL-018.md` hazırlandı.
- **2026-11-10 GORSEL-018 gönderildi:** kullanıcının isteğiyle mesaj computer use ile Codex "Kıvılcım — Çarşamba Oyun Koordinatörü" sohbetine yapıştırılıp gönderildi (16:55); Kıvılcım düşünmeye başladı. Yanıt/örnek görseller bekleniyor.
- **2026-11-10 17:07 GORSEL-018 onayı:** Kıvılcım tutarı önceden belirsiz kredi/kullanım için onay istedi; kullanıcı yalnız iki örnek görseli (krem sıva + yeşil panjurlu cephe, beyaz parlamasız kiremit) onayladı. Mesaj gönderildi: tüm sete geçmeden yeniden kullanıcı onayı beklenecek.
- **2026-11-10 GORSEL-018 deneme:** kullanıcı üslup yönünü onayladı; iki örnek (cephe + kiremit) dikişsiz hâle getirilip bayrakla (`GORSEL018_TRIAL`) telefona kuruldu; nihai kabul bekleniyor. Ayrıntı AI_REVIEW.md.
- **2026-11-10 GORSEL-018 deneme sonucu:** kullanıcı telefonda yeni cephe + kiremidi **beğendi** (üslup ve iki örnek kabul). Açık: kalan cephe varyantları (renk × modül), arka plan katmanları (A/B), kodla kontur/gölge, R077 ayna izinin kalıcı katmanlarla giderilmesi.
- **2026-11-10 17:41 GORSEL-018 tam set isteği** Kıvılcım'a gönderildi (kalan cephe renk×modül + A/B arka plan katmanları + arka mahalle). Kredi: Kıvılcım önce çağrı sayısını ve sırasını yazacak, kullanıcı onayı olmadan üretmeyecek. Commit 0d966ef (`visual/r077-g018` dalı).

- 2026-11-10 GORSEL-018: kullanıcı yalnız 11 cephe çağrısını onayladı (3 renk panjurlu + 4 renk balkonlu + 4 renk kilim/çamaşır ipli); onay Kıvılcım'a iletildi. Arka plan katmanları (3 çağrı) ayrı onay bekliyor.
- 2026-11-10 GORSEL-018 11 cephe teslim kontrolü: 11/11 geldi, 724×2172 RGB (oran 1:3, şartname 1:4; 350 genişliğe inince dönem 1050). Keskinlik eski kolondan 1,4–3,5× iyi; dikiş testi çoğunda temiz. Sorunlar: (1) kat ritmi tutmuyor (pencere 4 kat, krem/pembe balkon 5 kat, kilim düzensiz); (2) krem-balkon ve krem-kilim sıvası okra çok yakın; (3) gri-mavi-kilim diğer gri-mavilerden açık ve sol üstte ışık lekesi var, dikişte ton sıçraması. Kanıt: ai_review_evidence/GORSEL-018-11-cephe-kontakt.jpg. Oyuna bağlanmadı; kullanıcı kararı bekleniyor.
- 2026-11-10 GORSEL-018 12 cephe entegrasyonu (kullanıcı: "Düzeltip oyuna bağla"): krem-balkon/krem-kilim sıvası kabul edilen krem tonuna (253,202,128), gri-mavi-kilim diğer gri-mavilere (141,163,181) çekildi; ışık lekesi düşük frekans dengelemeyle yumuşatıldı; her cephe 30 satır sarmal geçişle dikişsizleştirildi, 350×1035 döşeme. 12 hücreli tek atlas (4200×1340 JPEG, 2,1 MB) `g018/facade-atlas-g018.jpg`. Kod: `FACADE_ATLAS` bayrağı; tohumlu varyant (houseHash tuz 4, önceki kuleyle aynı ham seçim engellenir), varyant başına dönem ve sakin duvar başlangıçları; 4. kolon eklendi (kısa dönem kapsaması). Etiket "G018 12 CEPHE + R077". tsc (index.tsx temiz) ve worklet testi PASS. Kat ritmi farkı (4/5 kat) kaynakta kaldı. İşleme betiği oturum scratchpad facades.py.
- 2026-11-11 G018 12 CEPHE telefon testi (ScreenRecording 11-11-2026 13-13-09, 104 sn): kullanıcı "öncesine göre çok daha iyi olmuş". Kareler: dört renk ve üç modül komşu kulelerde karışık dağılıyor, kopya kule hissi yok, oluk pencere kesmiyor. Kalan: kuleler hâlâ arka mahalleyle yakın tonda; kontur/gölge ve iniş parıltısı (şartname 5) sıradaki aday. Commit bekliyor.
- 2026-11-11 GORSEL-018 kontur + parıltı (kullanıcı seçimi): `KONTUR_PARILTI` bayrağı. Kule kenar konturu 1,8→3 birim, renk #3a281c→#2a1b12; sağ gölge geçişi 0,30→0,40 + sağ kenarda 7 birimlik koyu şerit (0,26). Şarj sırasında bir sonraki kulenin (standingPlatformId+1) tepesinde sıcak dikey parıltı: tek öğe, yalnız opaklık (0,35+0,55×şarj) ve transform değişir, kule başına ek eşleyici yok. Etiket "G018 KONTUR + PARILTI". tsc (index.tsx) temiz, worklet testi PASS. Telefon testi bekliyor.
- 2026-11-11 Hedef parıltısı kaldırıldı (kullanıcı: yalnız bir sonraki kulede yandığı için 2+ kule atlamada anlamsız; "Kaldır, kontur kalsın"). Ayrı bayrak `HEDEF_PARILTI=false`; kontur/gölge (`KONTUR_PARILTI`) açık. Şarja göre tahmini iniş parıltısı nişan yardımı olacağı için önerilmedi. Etiket "G018 KONTUR".
- 2026-11-11 ANALIZ-2026-11-11 (kullanıcı: görsel eksikler + "neden oynasınlar"): üç bağımsız editör (sanat, tasarım, pazar) raporu ai_review_evidence/ANALIZ-2026-11-11/editor-*.md; sentez rapor.html, yayın https://claude.ai/artifact/LW26jeGvpH6gD4jYPAtPgm. Ortak bulgular: karakter küçük (~%5), ses/juice yok, oyun sonu kartı İngilizce+debug, turlar arası birikim yok, kuleler Akdeniz havası. Öneri: Faz 1 (Türkçe kart, debug temizliği, büyük +N), Faz 2 (ses, juice, karakter 1,5×), Faz 3 imza kanca (önerilen: semt/gün yolculuğu + vapura atla). Kıvılcım'a aynı soru gönderildi (CODEX-MESAJI-ANALIZ-2026-11-11.md), yanıt shared/ANALIZ-2026-11-11-kivilcim.md bekleniyor. Kod değişmedi.
- 2026-11-11 FAZ1 (kullanıcı: "Faz 1'e başla"): `FAZ1_UI` bayrağı. HUD "BEST"→"REKOR"; ipucu koyu hap içinde "Basılı tut… bırak, zıpla!"; sürüm etiketi HUD'dan kaldırıldı, yalnız sonuç kartının altında soluk; R068 tanı metni kartta gösterilmiyor (sayaçlar çalışmaya devam ediyor). Yeni Türkçe sonuç kartı: kilim baklava şeridi, büyük skor, "YENİ REKOR!" rozeti ya da "Rekor N · X puan kaldı", konuşma balonunda bağlama göre espri (rekor / rekora 1–3 kala / skor ≤2 / diğer; art arda aynı satır yok), "Bir daha" düğmesi. Çoklu kule atlamada 60 pt "+N" ve ünlem (Oha! / Maşallah! / Efsane! / Mahalle ayakta!), 1 sn ekranda. Espri havuzu src/game/copy.ts: onaylı D6-2 + D6-4; TASLAK satırlar (dialog-mizah Ton A/B/C + 2 yeni rekor satırı + ünlemler) kullanıcı onayı bekliyor, `QUIP_DRAFTS=false` ile yalnız onaylılar. Etiket "FAZ1 TR ARAYUZ + G018 KONTUR". tsc (index.tsx, copy.ts) temiz, worklet testi PASS.
- 2026-11-11 FAZ1 telefon testi (ScreenRecording 14-12-13): kullanıcı "+N puan güzel olmuş"; "Oha" fazla kaba, kelime yerine emoji. Ünlemler emojiye çevrildi: 2 kule 👏, 3 🔥, 4 🤩, 5+ 🧿🔥 (40 pt, gölgesiz). Diğer FAZ1 öğeleri hakkında yorum yok.
- 2026-11-11 Kullanıcı: roket emojisi de olabilir / kendi emojimizi üretebiliriz; espriler "hepsi birbirinden kötü, yapmasak da olabilir". Emojiler: 2 👏, 3 🔥, 4 🚀, 5+ 🧿🚀. Espri balonu `QUIP_ON=false` ile gizlendi (havuz kodu duruyor); kart: skor + rekor/fark + "Bir daha". Kıvılcım'ın ANALIZ-2026-11-11 raporu geldi (shared/ANALIZ-2026-11-11-kivilcim.md): ek bulgu aynalı arka planda çift köprü (kare-15) → katman A/B önerisi (3 görsel çağrısı, ayrı onay); sonuç kartında "rekora N kaldı" önerisi FAZ1'de var.
- 2026-11-11 KARAR (kullanıcı): "Espri olmasın." Sonuç kartında espri satırı yok (`QUIP_ON=false` kalıcı). Havuz kodu src/game/copy.ts'de pasif duruyor; yeniden açılması ancak yeni, oyuna bağlı bir yazım turu ve kullanıcı seçimiyle. Diyalog entegrasyonu teknik soru 5 bu kararla kapandı.
- 2026-11-11 FAZ2 (kullanıcı: "başlayalım"): (a) `FAZ2_SQUASH` — GORSEL-017'deki görsel iniş esnemesi (ayak pivotlu, 190 ms) yeniden açıldı; (b) `FAZ2_DUST` — her yeni kuleye inişte 6 parçalı bej/kiremit toz bulutu (420 ms, tek öğe); (c) `CHAR_SIZE_TRIAL=1.4` — karakter aynı ayak pivotu etrafında 1,4× çiziliyor (fizik/çarpışma aynı); (d) ses: expo-audio ~58.0.11 eklendi (app.json eklentisi mikrofon/arka plan kapalı, pod install), 5 ses kodla sentezlendi (assets/sounds: charge, land, multi, record, fall; üçüncü taraf örnek yok, lisans/maliyet yok). Olaylar: şarj başı/bitişi, yeni kuleye iniş, çoklu atlama, düşüş ya da yeni rekor (vapur düdüğü). Sessiz anahtarına uyar, müzikle karışır. Sentez betiği oturum scratchpad sfx.py. Etiket "FAZ2 SES + TOZ+ESNEME, KARAKTER x1.4". tsc temiz, worklet testi PASS.
- 2026-11-11 FAZ2 telefon testi (ScreenRecording 14-39-15, 113 sn): kullanıcı "sesler makul, karakter boyutu iyi, toz ve esneme hissediliyor, takılma yok; sesler bazen gelmiyor". Ses izi şablon eşleştirmeyle çözüldü: 40 şarjın hepsi duyuluyor; 9 zıplamada iniş sesi yok — 6'sı aynı kuleye kısa sekme (skor değişmiyor, iniş sesi yalnız yeni kulede çalıyordu), 3 düşüşte (skor 4, 18, 28) düşüş sesi yok, 1 skorlu inişte "tak" yok. Neden: play() bekletilmeyen seekTo(0)'dan önce çağrılıyordu. Düzeltme: ses başına 2 oynatıcı (sırayla), play() seek bittikten sonra; "tak" artık her iniş temasında (UI iş parçacığından runOnJS). Karakter 1,4× kabul.
- 2026-11-11 OSURUK-2026-11-11 (kullanıcı fikri: zıplarken osuruk sesi + uçak izi gibi bulut, inişte kesilsin). Üç bağımsız editör (tasarım, sanat, pazar): koşullu evet — tekrar yorgunluğu, kamusal alan utancı, marka ("osuruk oyunu") ve yaş derecesi riski; öneri: varsayılan kapalı, açılabilir "Gaz Modu", şarja bağlı büyüklük, 5–6 ses havuzu, krem pofuduk bulut (B), iz yalnız geride ve kısa ömürlü, inişte kesilir. Benim önerim: önce kodla sentez ses + 6 bulutluk iz ile bayraklı deneme. Rapor: https://claude.ai/artifact/3Fx1nDWF6khwjEb9zUFTcq ; ayrıntı ai_review_evidence/OSURUK-2026-11-11/. Kıvılcım'a soruldu (CODEX-MESAJI-OSURUK-2026-11-11.md), yanıt bekleniyor. Kod değişmedi.
- 2026-11-11 GAZ DENEME (kullanıcı: "Evet, deneme yap"): `FART_TRIAL` bayrağı, her zıplamada açık (deneme). Ses: 5 kodla sentezlenmiş çizgi film osuruğu (assets/sounds/fart-s1/s2 kısa, m1/m2 orta, l1 uzun), bırakılan şarja göre grup seçilir, art arda aynısı çalmaz; inişte ve oyun sonunda susar. İz: 6 bulutluk sabit havuz (B "pofuduk kesik iz"), kalça hizasında gövdenin biraz gerisinden doğar, kalkışta 55 ms, sonra 105 ms aralıkla; 650 ms'de büyüyüp söner; boyu şarja bağlı (0,6–1,4); inişte tümü 140 ms'de "pof" (1,6×, sönme). Yalnız transform/opaklık; her bulut 4 sabit daire (kırpma maskesi yok). Saat yalnız bulut ekrandayken işler. Etiket "GAZ DENEME + FAZ2". tsc temiz, worklet testi PASS. Sentez betiği oturum scratchpad fart.py.
- 2026-11-11 GAZ DENEME telefon testi (ScreenRecording 14-56-54): kullanıcı "gaz görüntüsü osuruk gibi olmamış, ses osuruk sesi değil". Karelerde bulutlar karakterin yanında birkaç piksellik soluk noktalar (kutu 44 birim, krem, denizde kayboluyor). v2: bulut kutusu karakter boyunun %45'i, açık sarı-yeşil loblar + zeytin kenar ve gölge + açık vurgu (çizgi film gaz bulutu), ilk bulut 1,5× patlama, 800 ms ömür, daha opak. Ses v2: "kapak çırpma" modeli — saniyede 40–110 düzensiz darbe, her darbe 220–330 Hz sönümlü rezonans (telefon hoparlörünün verebildiği bant), nefes gürültüsü, kesik boşluklar ve "pfft" kuyruğu; enerji %58–64'ü 150–600 Hz. Önizleme ai_review_evidence/OSURUK-2026-11-11/osuruk-v2-dinle.wav. Etiket "GAZ DENEME v2 + FAZ2".
- 2026-11-11 GAZ v2 telefon testi (ScreenRecording 15-04-35): kullanıcı "gaz çıkışı güzel, ama kıçtan çıkmalı, biraz yukarıdan çıkıyor; ses istediğim ses değil". Karelerde en yeni bulut göğüs-omuz hizasında. v3: çıkış noktası boyun %42'si → %27'si, gövdeden geri kayma %16 → %11. Ses için sentez yerine gerçek kayıt seçenekleri kullanıcıya soruldu.
- 2026-11-11 GAZ v3: kullanıcı ses için "Ücretsiz lisanslı kayıt" seçti ve 6 dosyanın indirilmesini onayladı. Pixabay, aPebble "Fart 3–8" (Pixabay Content License: ücretsiz, ticari serbest, atıf gerekmez) yerleşik tarayıcıdan indirildi; boşluklar kırpıldı, tepe −1 dB, mono 22,05 kHz → assets/sounds/fart-s1/s2 (0,33/0,49 sn), m1/m2 (0,65/0,49), l1/l2 (0,87/0,86). Lisans notu assets/sounds/LICENSE-PIXABAY.md. Şarja göre grup: <0,35 kısa, <0,85 orta, üstü uzun. Kodla sentezlenen osuruklar kaldırıldı. Etiket "GAZ DENEME v3 GERCEK SES + FAZ2".
- 2026-11-11 GAZ v3 telefon testi (ScreenRecording 20-26-33): kullanıcı "daha iyi olmuş" (gerçek ses kayıtları + kalçadan çıkış). Açık karar: deneme her zıplamada açık; editörlerin önerisi varsayılan kapalı / açılabilir "Gaz Modu" ya da seyrek tetik (Kıvılcım). Commit bekliyor.
- 2026-11-11 KARAR (kullanıcı): "Her zıplamada kalsın." Gaz (ses + iz) her zıplamada açık; Gaz Modu kilidi/seyrek tetik yapılmayacak. Not: yayından önce App Store yaş derecelendirme anketinde "kaba mizah" beyanı gözden geçirilmeli (editör uyarısı).
TESLIM_HAZIR: GORSEL-018 12 cephe + kontur, FAZ1 Türkçe arayüz/sonuç kartı, FAZ2 ses/toz/esneme/karakter 1,4×, GAZ v3 (her zıplamada) — frontend/app/index.tsx, src/game/{sfx,copy}.ts, assets/sounds/, g018/facade-atlas-g018.jpg; telefonda kabul edildi, dal oyun/faz1-faz2-gaz commit; main birleştirme ve push kullanıcı onayı bekliyor.
- 2026-11-11 FAZ2 kalanları (kullanıcı: "faz 2'nin kalanlarını da yapalım"): (a) `FAZ2_HALO` — karakterin çevresinde ince sıcak-beyaz hale: aynı pozun 4 renklendirilmiş (tintColor) kopyası 9 sprite px kaydırmalı, pozun kendi animasyonlu görünümü içinde (ek eşleyici yok, gölge/offscreen yok); etiket "FAZ2 HALE + GAZ". (b) Şarjda yüz ifadesi: 3 ifade (gerginlik, ıkınma, "patlamak üzere") için Kıvılcım brief'i CODEX-MESAJI-FAZ2-IFADE-2026-11-11.md + baş referansları ai_review_evidence/FAZ2-IFADE-2026-11-11/; gönderim bilgisayar başka oturumda meşgul olduğu için bekliyor; üretim maliyeti kullanıcı onayına tabi.
- 2026-11-11 21:01 FAZ2-IFADE brief'i Kıvılcım'a gönderildi (computer use); maliyet bildirimi ve örnek ifade bekleniyor.

- 2026-11-12 11:01 FAZ2-IFADE: Kıvılcım 1+2 çağrı planı ve "kredi tutarı görünmüyor" notu verdi; kullanıcı "Evet, 1 çağrı" dedi, onay Kıvılcım'a iletildi (yalnız %50 örneği). Kullanıcı videosu 10-48-42: yüzde değişiklik yok — beklenen, ifade henüz üretilmedi.
- 2026-11-12 11:04 FAZ2-IFADE %50 örnek geldi (Kıvılcım, 1254² kaynak). Claude Code kontrolü: 516/1254 ölçek + (1,0) kaydırma ile siluet IoU 0,97; eski-yalnız 3088 px, yeni-yalnız 1929 px (169758 içinde, ince kontur farkları). Poza doğrudan bindirme temiz, boyun ekleminde iz yok. Kanıt: ai_review_evidence/FAZ2-IFADE-2026-11-11/karsilastirma-050.jpg. Oyuna bağlanmadı; kullanıcı kabulü bekleniyor.
- 2026-11-12 11:16 FAZ2-IFADE %75 ve %100 geldi (kullanıcı onayıyla 2 çağrı). Claude Code kontrolü: ölçek 0,41; siluet IoU 075=0,961 (087 pozunda da 0,961), 100=0,94 (şişen yanaklar bilerek taşıyor). Bindirme temiz; çene altında 502. satır sınırında çok ince bir ek izi var, bağlarken yumuşatılacak. Kanıt: karsilastirma-tum.jpg, zoom-075-100.jpg. Oyuna bağlanmadı; kullanıcı kabulü bekleniyor.
- 2026-11-12 11:35 FAZ2-IFADE bağlandı (kullanıcı: "Evet, bağla ve kur"): character-pose.ts FAZ2_IFADE=true; %50/%62 pozlarına 050, %75/%87 pozlarına 075, %100 pozuna 100 yüzü. Yeni dosyalar assets/characters/charge-{050,062,075,087,100}-r12-ifade.png (üst 502 px baş, alt 36 px yumuşak geçiş; tuval/pivot aynı). Fizik, kamera, çatı dokunulmadı. tsc: oyun dosyaları temiz (src/theme.ts eski hataları ayrı). Release BUILD SUCCEEDED, telefona kuruldu (seq 3976), etiket "FAZ2 IFADE + HALE + GAZ". Kullanıcı testi bekleniyor.
- 2026-11-12 11:38 Kullanıcı videosu 11-35-49 (yorumsuz): sonuç kartı etiketi "FAZ2 IFADE + HALE + GAZ" (doğru paket). 12 şarjın başı/sonu karşılaştırıldı: şarj sonunda ıkınma (kapalı göz, kızarık yanak) ve tam şarjda fal taşı göz + balon yanak görülüyor; kısa şarjlarda eski yüz kalıyor (beklenen). Kanıt: ai_review_evidence/FAZ2-IFADE-2026-11-11/video-1135-sarj-basi-sonu.jpg.
- 2026-11-12 FAZ2-IFADE kullanıcı kararı: "Kalsın". FAZ2_IFADE=true ve FAZ2_HALO=true kalıcı.
TESLIM_HAZIR: FAZ2 tamam — hale + şarj yüz ifadeleri (050/075/100) telefonda doğrulandı, kullanıcı kabul etti (2026-11-12).
- 2026-11-12 YOL-2026-11-12: "nasıl devam edelim" için 4 bağımsız görüş (tasarım, sanat, pazar, Kıvılcım) alındı; birleşik rapor ai_review_evidence/YOL-2026-11-12/rapor.html. Öneri: 1) Faz 2 kapanışı (ses aç/kapa, görünen ad Çarşamba, iCloud kopyaları, commit), 2) görselsiz "yolculuk" denemesi (15 kulede durak + semt adı + gün tonu + iskele hedefi), 3) TestFlight betası (ücretli Apple hesabı kararı). Kullanıcı kararı bekleniyor.
- 2026-11-12 11:49 Faz 2 kapanışı (kullanıcı: "Evet, başla"): sağ üstte kalıcı ses aç/kapa düğmesi (🔊/🔇, carsamba.sfxMuted.v1; kapalıyken tüm sesler durur). Kullanıcı kararı: ürün adı "Çarşamba" olmayacak, yeni ad belirsiz; görünen ad değiştirilmedi. iCloud kopyaları (kare-3 2.jpg, kontakt 2.jpg) silindi. Release BUILD SUCCEEDED, telefona kuruldu (seq 4024). Telefon testi bekleniyor.
- 2026-11-12 YAPI-2026-11-12: "etap mı sonsuz mu, hangi özellikler" için 4 görüş (tasarım, sanat, pazar, Kıvılcım) alındı; dördü de melez: sonsuz koşu + duraklar, kayıt noktası yok. Rapor: ai_review_evidence/YAPI-2026-11-12/rapor.html. Öneri: 1. deneme duraklı sefer (görselsiz), 2. günün haritası. Kullanıcı kararı bekleniyor (iskele durağı, durak bonusu, semt sırası).
- 2026-11-12 DURAK SEFERİ v1 (kullanıcı: "Evet, başla"; YAPI raporundaki önerilen ayarlar): src/game/stops.ts (DURAK_SEFER=true). Duraklar kule 10/25/40/55 (Karaköy, Galata, Sirkeci, Eminönü İskelesi = vapura yetiştin), sonra her 15 kulede "Gece seferi N". Durakta oyun durmaz: 1,4 sn semt tabelası + vapur düdüğü + gökyüzü tonu bir adım (sabah→gece, yalnız arka plan). Puan bonusu yok. Zorluk durak başına basamak (t=durak/4); durak kulesi geniş, alçak fark (≤70), orta aralık. Sonuç kartı: "En uzak durak" + "X'e N kule kaldı". En uzak kuleye REKOR bayrağı (carsamba.farthestTower.v1). Fizik/kamera/siluet aynı. Sim 3000 tohum (DURAK-2026-11-12/sim_sonuc.txt): dar kule %1,6→30,6 kademeli, nefes kulesi %100 geniş, negatif aralık 0. Worklet testi PASS (./stops eklendi). Release BUILD SUCCEEDED, telefona kuruldu (seq 4032), etiket "DURAK SEFERI v1". Telefon testi bekleniyor.
- 2026-11-12 DURAK SEFERİ v2: kullanıcı (video 12-23-01) "atlayış olarak değil, baştan 15. kolona vardığında durak yazsa daha tutarlı olur" -> FIRST_STOP=15; duraklar 15/30/45/60 (iskele), sonra her 15. Tabelada "N. kule" yazıyor. Not: skor çoklu atlama bonusu yüzünden kule sayısından büyük; duraklar kule sayısına bağlı. Sim ve worklet testi PASS. Release kuruldu, etiket "DURAK SEFERI v2 (15 KULE)".
- 2026-11-12 Kullanıcı videosu 12-28-59 (yorumsuz): etiket "DURAK SEFERI v2 (15 KULE)" doğru. 7 turun skorları 24, 0, 14, 10, 14, 20, 22+: hiçbir tur 15. kuleye (Karaköy) varmadı; kart "Henüz durağa varmadın · Karaköy'e 3 kule kaldı" doğru çalışıyor. Tabela, gök tonu ve bayrak bu kayıtta görülemedi (durak yok).
- 2026-11-12 Kullanıcı kararı: "Böyle kalsın" — ilk 15 kule kolaylaştırılmayacak; durak 15. kulede, zorluk aynı.
- 2026-11-12 GÜNÜN HARİTASI v1 (kullanıcı: "tamamdır devam edelim"; YAPI raporunun 2. denemesi): src/game/daily.ts (DAILY_MAP=true). Yerel tarihten FNV tohumu -> o gün herkes aynı çatılar. Sonuç kartında "📅 Günün haritası · 12 Kasım" / "🎲 Serbest oyun" düğmesi; günlük modda HUD "GÜNÜN REKORU" + tarih etiketi, rekor ve en uzak kule (REKOR bayrağı) güne özel (carsamba.daily.v1, JSON); gün değişince sıfırlanır. Serbest mod rekoru ayrı kalır. Test: aynı gün aynı harita, farklı gün farklı (sim_gunluk.cjs); worklet PASS; tsc temiz. Release kuruldu, etiket "DURAK v2 + GUNUN HARITASI v1". Not: Çizgi film yöneticisi oturumundan kule görünümü revizyon önerisi geldi; kullanıcı onayı bekleniyor.
- 2026-11-12 Düzeltme (Adel & Alpi kitap serisi oturumu): Çizgi film yöneticisinden gelen kolon revizyonu isteği geçersiz (kullanıcı mesajı yanlış oturuma yazmıştı). Hiçbir madde uygulanmadı.
- 2026-11-12 GÖRÜNÜM REV (kullanıcı: "Üçünü de yap"): GORUNUM_REV=true. (1) arka plan yıkaması 0,14->0,26 (biraz soluk), (2) roof-tiles-g018-canli.png (doygunluk x1,22, parlaklık x1,06, üst 5 satır mahya vurgusu; PIL ile, üretim yok) + merkez şeridi (beyaz çizgi, merkez puanı 0) gizli, (3) ekran altında %16 yumuşak koyu geçiş. Siluet, fizik, kamera aynı. Web önizleme önce/sonra: ai_review_evidence/GORUNUM-2026-11-12/once-sonra.jpg. Release kuruldu, etiket "GUNLUK + DURAK + GORUNUM REV". Telefon testi bekleniyor.
- 2026-11-12 GÜNÜN HARİTASI v2: kullanıcı (video 12-58-57) "serbest oyun / günün oyun sekmelerini kendin değiştiremiyorsun, oyunu başlatmak ya da bir daha oynamak zorunda kalıyorsun" -> tur başında (skor 0, ilk zıplamadan önce) skorun altında "🎲 Serbest | 📅 12 Kasım" sekmesi; dokununca harita hemen değişir. Sonuç kartındaki düğme de duruyor. Web önizlemede iki yön denendi. Release kuruldu, etiket "GUNLUK v2 SEKME + DURAK + GORUNUM".
- 2026-11-12 Kullanıcı kararı: "günlük mod işini pek beğenmedim, bu oyun tekrara düşmemeli" -> DAILY_MAP=false (sekme ve kart düğmesi yok; her tur yeni rastgele harita). Kod duruyor. Release kuruldu, etiket "DURAK + GORUNUM (GUNLUK KAPALI)".
- 2026-11-12 Kullanıcı videosu 13-09-46 (yorumsuz, 44 sn): mod sekmesi ve kart düğmesi yok (günlük kapalı sürüm doğru). 6 tur: 11, 8, 0, 0, 4, 6; hiçbiri 15. kuleye varmadı (en iyi: Karaköy'e 9 kule kaldı). 12-28 ve 13-09 kayıtlarında toplam 13 turun hiçbiri ilk durağa ulaşmadı; tabela/gök tonu/bayrak telefonda hâlâ görülmedi.
- 2026-11-12 Kullanıcı videosu 13-15-13: ilk kez duraklara varıldı (skor 66): "Karaköy · 15. kule", "Galata · 30. kule" tabelaları ve kart "En uzak durak: Galata · Sirkeci'ye 11 kule kaldı" doğru. Bulgular: gök tonu ölçümde çok zayıf (mavi ~%5 ısındı), REKOR bayrağı görülmedi (web testinde çiziliyor ama çok küçüktü), tabela alt satırı "+N" yazısıyla üst üste biniyordu. Düzeltme v3: ton katmanları güçlendirildi (0,20/0,30/0,36/gece 0,50), bayrak 54 px direk + 14 pt yazı, mahyanın ucunda; tabela alt satırı tabelanın içinde, tabela görünürken "+N" %34'e iniyor.
- 2026-11-12 Kullanıcı: "ses tuşu önce telefonun sesini, sonra kendi sesini açıp kısıyor". Neden: expo-audio her ses bitince iOS ses oturumunu kapatıyor (keepAudioSessionActive yoksa deactivateSession); oturum kapalıyken donanım tuşları zil sesini değiştirir. Düzeltme: oyuncular keepAudioSessionActive:true + açılışta setIsAudioActiveAsync(true). Sessiz anahtarına uyma aynı. Release kuruldu, etiket "DURAK v3 + SES OTURUMU + GORUNUM". Telefon testi bekleniyor.
- 2026-11-12 Kullanıcı videosu 13-21-50 (yorumsuz, 95 sn): ses tuşu düzeltmesi tutuyor — ses ayarında "Zil Sesi" göstergesi yok, yalnız medya ses çubuğu. Karaköy durağına iki turda varıldı (skor 36 ve 46+); Karaköy sonrası gök ölçümde ısındı (gök R 110->116, B 122->115; deniz açıldı), göz kararı fark ediliyor ama hafif. REKOR bayrağı bu kayıtta ekrana girmedi: bayrak şimdiye kadarki en uzak kulede (önceki kayıtta ~33. kule) ve bu turlar oraya yaklaşmadı. Kanıt: DURAK-2026-11-12/video-1321-ton.jpg.
- 2026-11-12 Kullanıcı: "Evet, commit et" — duraklı sefer v3, görünüm revizyonu, ses oturumu düzeltmesi, (kapalı) günün haritası kodu ve YAPI/DURAK/GORUNUM kanıtları commit edildi. Push yok.
- 2026-11-12 Kullanıcı: "push" — terminalde GitHub kimliği yok; GitHub Desktop "Push origin" ile gönderildi. origin/main = 79a0a88 (git ls-remote ile doğrulandı). Bu satır commit edilmedi.
- 2026-11-12 İSKELE ANI + GECE (kullanıcı: "geliştirmeye devam edelim"): 60. kule Eminönü İskelesi'nde altın tabela (2,6 sn), çift vapur düdüğü, kilim renklerinde 22 parça konfeti (~1,9 sn, yalnız transform/opaklık), başarı titreşimi; diğer duraklarda orta titreşim. İskeleden sonra gece tonunda gökte 18 yıldız (tek katman, opaklık). Web önizlemede geçici tetikleyiciyle denendi (tabela + konfeti + gece görüldü), tetikleyici kaldırıldı. Release kuruldu, etiket "ISKELE ANI + GECE YILDIZ + SES". Kullanıcıya Apple Developer kayıt adımları anlatıldı (iPhone'da Apple Developer uygulaması → Enroll, bireysel).
- 2026-11-12 KARTPOSTAL ALBÜMÜ v1 (kullanıcı seçimi): src/game/postcards.ts (POSTCARDS_ON=true). 5 kartpostal (Karaköy, Galata, Sirkeci, Eminönü İskelesi, Gece seferi) mevcut Boğaz arka planından PIL ile kırpıldı + krem çerçeve (assets/postcards/, yeni üretim yok). Bir durağa ilk kez varınca açılır (carsamba.postcards.v1); tabelada "· 📮 yeni kartpostal", sonuç kartında "📮 Yeni kartpostal: X" ve "📮 Kartpostallar n/5" düğmesi; albümde kilitliler "? · N. kule". Web önizlemede geçici tetikleyiciyle denendi, kaldırıldı. Release kuruldu, etiket "KARTPOSTAL ALBUMU v1". Not: önceki turlarda varılan duraklar geriye dönük açılmaz; albüm boş başlar.
- 2026-11-12 Kullanıcı videosu 14-40-46 (yorumsuz): albüm akışı telefonda çalışıyor. Karaköy (skor 34) tabelası "15. kule · 📮 yeni kartpostal", sonuç kartında yeni kartpostal satırı, albümde Karaköy açık (1/5), kilitliler "30/45/60/75. kule". Kanıt: DURAK-2026-11-12/video-1440-kartpostal.jpg.
- 2026-11-12 Kullanıcı: "Evet, ikisini de" — iskele anı + gece yıldızları ve kartpostal albümü commit + push.
- 2026-11-12 İSTANBUL ANLIK OLAYLARI v1 (kullanıcı seçimi): src/game/AmbientEvents.tsx (AMBIENT_ON=true). Oyun sürerken ilk 6-12 sn sonra, sonra her 18-32 sn'de bir 3-5 martılık sürü 7,5 sn'de ekranı geçer (gök bandı %10-24, kanat çırpma scaleY, yön rastgele; kuleler önde). Martı görseli Boğaz arka planındaki martıdan gök mavisi ayıklanarak çıkarıldı (assets/environment/ambient/marti.png, üretim yok). 40-70 sn'de bir uzaktan vapur düdüğü (record.wav, ses 0,14). Fizik/puan değişmedi. Web önizlemede sürü görüldü. Release kuruldu, etiket "ISTANBUL OLAYLARI v1 (MARTI)". Kedi/çamaşır olayı yapılmadı (temiz kesilmiş görsel yok).
- 2026-11-12 Kullanıcı videosu 15-04-00 (yorumsuz, 3 dk): martı sürüleri telefonda görülüyor (ör. skor 24, 33, 18-20 ve 26 karelerinde 3-5 martılık sürüler), arka plandaki çizili martılarla uyumlu; ufuk çizgisine yakın uçuyorlar. Karaköy iki kez tetiklendi. Kanıt: OLAY-2026-11-12/video-1504-gokyuzu.jpg.
- 2026-11-12 Kullanıcı: "Evet, ikisini de" — martı sürüsü ve uzak vapur düdüğü commit + push.
