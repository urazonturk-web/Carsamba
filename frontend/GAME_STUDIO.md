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
