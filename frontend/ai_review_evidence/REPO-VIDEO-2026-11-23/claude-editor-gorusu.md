# Claude editör görüşü — video önerileri (2026-11-23)

Doğrulama: GitHub API ve skills.sh araması üzerinden, 2026-11-23'te yapıldı. Hiçbir şey kurulmadı. Yıldız ve kurulum sayıları o günün anlık değerleri.

## Doğrulama tablosu

| Öğe | Var mı | Sahip | Yıldız / kurulum | Son güncelleme | Gerçekte ne yapıyor | İddia kanıtı |
|---|---|---|---|---|---|---|
| Ponytail | Evet | DietrichGebert/ponytail (MIT) | ~197 bin yıldız | 22.11.2026 | Bir skill prompt'u + Claude Code eklentisi (hook'lar, istem üstünde maliyet "band"ı, /ponytail-review, /ponytail-audit). Kod yazmadan önce "bu zaten var mı" diye soran bir merdiven uyguluyor | "-53% kod, -45% token, 98% test" sayıları **yalnızca yazarın kendi ölçümü** (39 görev, 5 tekrar). Bağımsız ölçüm bulamadım |
| Graphify | Evet | Graphify-Labs/graphify (Apache-2.0) | ~152 bin yıldız | 23.11.2026 | Kodu tree-sitter ile yerelde bir bilgi grafına çeviriyor; `/graphify` skill'i | README'nin kendi ölçümü erişim doğruluğu (recall@10). "Kredinin yarısı dosya okumaya gidiyor" iddiasının kaynağı yok; reel'in kendi uydurması |
| Agent Skills | Evet (büyük olasılıkla) | addyosmani/agent-skills (MIT) | ~120 bin yıldız | 18.11.2026 | 26 skill: /spec /plan /build /test /review /ship | Bir süreç disiplini, iddia edilen bir sayı yok. Reel'deki etiketler bu repoyla eşleşiyor |
| Claudex Loop | Evet | chaseai-yt/claudex-loop | ~3,6 bin yıldız | 14.10.2026 | Claude plan yazar, Codex itiraz eder (APPROVED/REVISE/BLOCKED), build sonrası karşı model inceler; PLAN.md ve PLAN-REVIEW-LOG.md yazar | Reel doğru anlatıyor. Kullanıcı bu döngüyü zaten elle yapıyor |
| HyperFrames | Evet | heygen-com/hyperframes (Apache-2.0) | ~88 bin yıldız; skills.sh'de ~1,6–1,7 milyon kurulum | 23.11.2026 | HTML/CSS/JS'den belirlenimci MP4 üretiyor; ajan skill'leri var | İddia doğru. Arkasında bir şirket var (HeyGen) |
| FFmpeg / yt-dlp / Whisper / GSAP | Evet (bilinen araçlar) | — | — | — | — | Doğru. ffmpeg ve whisper zaten kurulu |
| CLI-Anything | Evet | HKUDS/CLI-Anything (Apache-2.0, üniversite laboratuvarı) | ~63 bin yıldız (reel 48 bin diyor: eski sayı, iddianın altında kalıyor) | 20.11.2026 | Masaüstü programlarına (Blender, GIMP, FreeCAD, Godot…) ajanın kullanabileceği CLI sarmalayıcıları üretiyor; hazır CLI'lardan oluşan bir merkez; arXiv teknik raporu var | Büyük ölçüde doğru. "Her programı kontrol eder" abartılı: her uygulama için ayrı bir sarmalayıcı gerekiyor |
| ultracode | Brife göre evet (Workflow aracı) | Anthropic | — | — | Çoklu ajan iş akışı | "100 ajan" sayısını doğrulayamadım. Ajan sayısı arttıkça maliyet de katlanarak artar |
| Wi-Fi dedektifi | Repo yok | — | — | — | Tek bir prompt | "Hız 2 katına çıkıyor" kanıtsız. Bu oyunla bir ilgisi yok |
| OmniRoute | Evet (yeri değişti) | cheaper-inference/OmniRoute (diegosouzapw'dan taşınmış) | ~90 bin yıldız | 23.11.2026 | Yerelde çalışan bir yapay zekâ ağ geçidi: tek uç nokta, 394 sağlayıcı, ücretsiz katmanları birleştiriyor, Claude Code'u başka modellere yönlendirebiliyor | Gerçek, ama kodunu ve istemlerini üçüncü taraf ücretsiz sağlayıcılara gönderir. Kendi README'si bazı sağlayıcılar için "tos: avoid" uyarısı veriyor |
| Grill Me | Evet | mattpocock/skills | ~1,6 milyon kurulum | 19.11.2026 | Sen netleşene kadar sana soru soruyor | Sayılar doğru (reel 1,0 milyon diyor, düşük kalıyor) |
| Caveman | Evet | JuliusBrussee/caveman | ~642 bin kurulum, ~122 bin yıldız | 23.11.2026 | Kısa yanıt üslubu; ayrıca çıktı sıkıştırma ve otomatik model seçimi | **Dış kanıtı olan tek öğe:** Adobe Research'ün arXiv makalesi (2606.24083, "CAVEWOMAN") ve JetBrains blogu (sayfa var). Ama tasarruf çoğunlukla çıktı token'ında; Claude Code faturasında asıl ağırlık girdi/bağlamda |
| Agent Browser | Evet | vercel-labs/agent-browser | ~1,7 milyon kurulum | 23.11.2026 | Ajanlar için tarayıcı CLI'ı | Doğru, ama yerleşik tarayıcıyla çakışıyor |
| Find Skills | Evet | vercel-labs/skills | ~4,5 milyon (1. sırada) | 17.11.2026 | Skill arama ve kurma (`npx skills`) | Doğru. Kurulumu kolaylaştırdığı için risk de artıyor |
| Anti-UI Slop | Evet (birkaç kopya) | github/awesome-copilot ~1,7 bin; uizze ~1,35 bin | ~1,4–1,7 bin | — | Arayüz için "yapay zekâ görünümü" kontrol listesi | Küçük, kanıtsız |
| Web Design Guidelines | Evet | vercel-labs/agent-skills | ~895 bin | — | Web arayüzü kontrol listesi | Web için. Oyun için değil |
| Canvas Design | Evet | anthropics/skills | ~138 bin | — | Anthropic'in resmî skill'i | Gerçek |
| SEO Audit / AI SEO / Content Strategy / Pricing | Evet | coreyhaines31/marketingskills | 263 bin / 172 bin / 185 bin / 97 bin | 20.11.2026 | Pazarlama prompt'ları | "Google'da yukarı taşır" iddiası kanıtsız. Bir iPhone oyununun web sitesi yok |
| Video Lens | Evet | kar2phi/video-lens | ~1,8 bin kurulum, 136 yıldız | 20.11.2026 | YouTube altyazısını özetliyor | Küçük, tek kişilik proje |
| Video Use | Evet | browser-use/video-use | ~6,6 bin kurulum, ~31 bin yıldız | 08.10.2026 | Ajanla video kurgusu | Gerçek |

## Sorunun cevabı

İkilem yanlış kurulmuş. Videocular sahtekâr değil: 7 reel'de adı geçen **her şey gerçek** ve çoğu çok popüler. Yazdığım her şey için kurulum yolu var. Asıl sorun başka:

1. **Rakamlar araç yazarlarının kendi pazarlaması.** Ponytail'in "%98"i ve "-%45 token"ı, Graphify'ın tasarruf iması: hepsi yazarın kendi testleri. Bağımsız kanıtı olan tek iddia Caveman'inki (Adobe makalesi, JetBrains testi). Reel'ler bunun üstüne kendi abartısını ekliyor ("kredinin yarısı orada gidiyor", "hız 2x", "100 ajan").
2. **Yıldız sayısı kalite ölçütü değil.** 100–200 bin yıldızlı skill repo'ları bu dönemde olağan hâle geldi. Bu sayılar ilgiyi gösteriyor, senin projendeki faydayı göstermiyor.
3. **Bizim hatamız:** Önceki tutumumuz "hiçbirini beğenmemek"se, bu da yanlıştı. Doğrusu, bilinmeyen bir aracı "gereksiz" diye geçmek değil, ölçülebilir bir deneme önermekti. Gerçekten çakışanlar var (tarayıcı, ultracode, video araçları). Ama Claudex Loop ve Ponytail senin dertlerine doğrudan dokunuyor. Bunları denemeden reddetmek dürüst değil, tembellik olurdu.

**Somut bir bulgu (reel'lerden daha önemli):** `GAME_STUDIO.md` 347 KB, `AI_REVIEW.md` 486 KB. Bu, kabaca 200 bin+ token demek. Oyunun kodu ise yalnızca 44 dosya, ~10 bin satır. Token'ın büyük kısmı büyük olasılıkla bu iki kayıt dosyasının okunmasına gidiyor; kod okumaya değil. Graphify bunu çözmez. Bu dosyaları arşivlemek/bölmek (ör. son 30 gün ayrı dosyada kalsın, gerisi `arsiv/` altına) herhangi bir eklentiden daha çok tasarruf sağlar ve hiçbir risk taşımaz.

## Fayda ve risk özeti

- **Claudex Loop — Yüksek fayda.** Zaten yaptığın Claude-plan/Codex-inceleme döngüsünü kalıba sokuyor ve kayda geçiriyor. Çakışma: elle yaptığınla. Risk düşük (okunabilir prompt'lar ve bir Python adaptörü), ama iki modelin token'ı da harcanıyor.
- **Ponytail — Orta fayda.** Fazla kod yazma ve "her şeyi baştan yazma" gerçek bir dert. Risk: her oturumda çalışan hook'lar ve bir durum satırı ekliyor, yani sürekli bağlama giriyor. Ölçülmeli.
- **Caveman — Orta fayda.** Kanıtı en iyi olan öğe. Ama senin raporların Türkçe ve ayrıntılı olmalı; aşırı kısa üslup senin için anlaşılırlığı düşürebilir.
- **Graphify — Düşük fayda.** 44 dosyalık bir repoda grep zaten yetiyor. Repo büyürse tekrar bakılabilir.
- **Agent Skills (addyosmani) — Düşük/Orta.** İyi bir disiplin, ama carsamba-studio ve physics-evidence zaten aynı işi projeye özel olarak yapıyor.
- **CLI-Anything — Düşük (şimdilik).** Ciddi bir proje. Blender ya da Godot kullanırsan değerli olur; Expo oyunu için gereksiz.
- **HyperFrames — Orta (oyun içi değil, tanıtım videosu için).** App Store önizleme videosu ya da reel için gerçekten iyi bir aday.
- **Grill Me — Orta, ucuz.** Tek bir prompt; belirsiz görevlerde işe yarar.
- **Yok/Düşük:** Agent Browser (yerleşik tarayıcı var), ultracode reel'i (Workflow zaten var), Wi-Fi, SEO/AI SEO/Content/Pricing, Web Design Guidelines, Anti-UI Slop, Video Lens (yt-dlp ve whisper zaten var).

**Genel güvenlik notu:** Her skill/eklenti, ajanın yetkisiyle çalışan bir talimat ya da kod demek. Hook'lar her komutta çalışır. Kurmadan önce SKILL.md'yi ve hook dosyalarını okumak şart. Sürümü sabitlemek ve yalnızca orijinal repodan kurmak gerekiyor (Ponytail'in yazarı da kendisi uyarıyor: sahte kopyalar var).

## Hemen deneyelim (en fazla 4)

1. **Kayıt dosyası diyeti (eklentisiz, önce bu).** Ölçüm: aynı tür bir görevde oturum başına girdi token'ı, öncesi ve sonrası. Vazgeçme ölçütü: düşüş %20'nin altındaysa ya da ajan eski bir kararı bulamıyorsa geri al.
2. **Claudex Loop, proje kapsamında, tek bir özellik için.** Ölçüm: elle yapılan döngüyle karşılaştır; toplam token, süre, Codex'in yakaladığı gerçek hata sayısı, sonradan çıkan regresyonlar. Vazgeçme: 2 özellikte elle döngüden daha pahalıysa ve fazladan hata yakalamıyorsa.
3. **Ponytail, 1 hafta, `lite` seviyesinde.** Ölçüm: aynı 3 küçük görevde (ör. bir UI düzeltmesi, bir fizik ayarı, bir ses ekleme) diff satır sayısı, token, test geçişi. Vazgeçme: token düşüşü %15'in altındaysa ya da bir kez bile gerekli bir doğrulamayı kesmişse.
4. **HyperFrames, yalnızca bir tanıtım videosu için.** Ölçüm: 15 saniyelik bir App Store önizlemesi kaç saatte çıkıyor, Kıvılcım'la yapılana kıyasla. Vazgeçme: 2 denemede kullanılabilir bir çıktı yoksa.

## Önerilmeyenler

- **OmniRoute:** Kodun ve istemlerin, şartları değişken ücretsiz sağlayıcılara gider. Model kalitesi rastgele olur, hata ayıklamak zorlaşır. Abonelik şartlarıyla çatışma riski var. Senin derdin kalite; bu araç kaliteyi ucuzluğa satıyor.
- **"100 ajanlı ultracode":** Maliyet katlanarak artar. Senin görevlerin 2–4 ajanlık işler.
- **Find Skills ile toplu kurulum** ve **"13 skill'i kur, depoyu doldur"** yaklaşımı: Her skill'in açıklaması bağlama girer ve yanlış skill tetiklenme riski doğar. Az ve ölçülmüş olan daha iyidir.
- **Wi-Fi dedektifi:** Ağ ayarı değiştiren bir prompt'u körü körüne çalıştırmak, işle ilgisi olmayan bir risk.
