# Brif — Kullanıcının videosundaki Claude Code eklenti/skill/repo önerileri: dürüst değerlendirme

## Kullanıcının mesajı (aynen)
"şimdi sana göndereceğim bir video var ve bizim işlerimizi kolaylaştıracağını düşündüğüm skiller ve repoların olduğu bir video. bana gerçekten dürüst olmanı bekliyorum. çünkü bana yardımcı olmak için varsın ve bu yüzden para ödüyorsam şayet sende bana maksimum derecede verimli olabilmen için dürüst ve daha akıllı olman gerekiyor. hiç bir repoyu beğenmediniz bu zaman kadar ama insanlar bu repo lar veya skiller ile ilgili videolar çekiyorlar. ya onlar sahtekarlar yalandan izlenim oranım artsın diye yapıyorlar ya da sen bana karşı dürüst değilsin. bunu bir düşün ve bu mesajımı diğer bütün editörlerle de paylaş codex de dahil olmak üzere sonra videoyu inceleyin ve bana bir rapor sunun"

## Kullanıcı ve çalışma düzeni (bağlam)
- Tek kişi; Expo/React Native ile iPhone oyunu (Byzantion) yapıyor; ayrıca kitap/çizim projeleri, film/ses oturumları var.
- Ana ajan: Claude Code (masaüstü uygulaması). Görsel üretim: ChatGPT/Codex uygulamasında "Kıvılcım" adlı koordinatör. "Editörler" = Codex CLI (`codex exec`) + Claude alt ajanları; plan/rapor/ikinci görüş için zaten düzenli kullanılıyor.
- Ortamda zaten olanlar: ffmpeg, whisper-cli (yerel model), yerleşik tarayıcı (Claude Browser), bilgisayar kontrolü (computer-use), iOS simülatör aracı, Workflow aracı ("ultracode" ile çoklu ajan), skill sistemi, projeye özel skill'ler (carsamba-studio, physics-evidence).
- Kullanıcının dertleri: token/kredi maliyeti, tekrar eden hatalar, oyun kalitesi, Claude'un dosyaları tekrar tekrar okuması.

## Videodaki 7 Instagram reel'i ve iddiaları (ses dökümü + kareler)
1. **1steditionking — "Claude Code için 4 ücretsiz eklenti"**: (a) **Ponytail** — Claude'u hazır çözüm aramaya zorlar, "kod kısalır, kredi cepte" (ekranda "Ponytail 5 … -53% -41% … 98%" grafiği, "Ponytail'in kendi testi"); (b) **Graphify** — projenin haritasını çıkarır, Claude her şeyi okumak yerine doğru dosyaya gider, "kredinin yarısı orada gidiyor"; (c) **Agent Skills** — plan → yaz → test → yayınla disiplini (etiketler: Spec, Plan, Build, Test, Review, Simplify, Ship); (d) **Claudex Loop** — Claude plan yazar, Codex açıkları arar, ikisi onaylamadan kod yazılmaz (Codex kurulu olmalı).
2. **anilcodez — "Claude ile video yapmak için 5 ücretsiz araç"**: FFmpeg, yt-dlp, Whisper, HyperFrames (Claude HTML'den video sahnesi), GSAP (animasyon).
3. **ramazantamak.yt — CLI-Anything**: "MCP olmadan her programı kontrol" (Blender, GIMP, FreeCAD, draw.io, Godot), "18 uygulamada test, GitHub'da 48.000+ yıldız".
4. **ramazantamak.yt — "ultracode"**: Claude Code'da tek komutla 100 alt ajan.
5. **dorukyalcinsoy — Wi-Fi dedektifi**: tek prompt ile Claude hız testi yapıp arka plan tüketicilerini/kanal çakışmasını bulur, "hız 2x".
6. **(hesap adı görünmüyor) — "Claude skill'siz mi? 13 temel skill" (skills.sh)**: Grill Me (1,0M kurulum), Caveman (635K, kısa konuşur → az token), Agent Browser (1,6M), Find Skills (4,4M), Anti-UI Slop (1,4K), Web Design Guidelines (878K), Canvas Design (135K), SEO Audit (259K), AI SEO (168K), Video Lens (1,5K), Video Use (6,2K), Content Strategy (181K), Pricing (94K).
7. **CeyhunMedia — "Claude Code için 5 eklenti"**: ilki **OmniRoute** (github.com/diegosouzapw/OmniRoute, API sağlayıcılarına bağlanır / model yönlendirme); görselde Model Routing, Memory, Token Optimizasyonu; diğer dördü videoda görünmüyor.

## Görev (Türkçe, en fazla ~900 kelime, dürüst ve somut)
1. Kullanıcının sorusuna doğrudan cevap: "Ya videocular sahtekâr ya da siz dürüst değilsiniz" ikilemi doğru mu? Gerçek durum ne (araçlar gerçek mi, iddialar abartılı mı, biz neden önceden beğenmedik/beğenmeliydik)? Kendi önceki tutumunu da eleştir.
2. Her öğe için: gerçek mi (repo var mı, ne yapıyor — doğrulayabildiğin kadarıyla; doğrulayamadığını açıkça söyle), iddia ne kadar doğru, BU kullanıcıya faydası (Yüksek/Orta/Düşük/Yok), zaten sahip olduğu şeyle çakışıyor mu, risk (güvenlik: üçüncü taraf skill/eklenti = ajanın yetkisiyle çalışan kod/talimat; maliyet; bakım).
3. "Hemen deneyelim" listesi (en fazla 3–4 öğe), her biri için ölçülebilir deneme planı (ör. aynı görev öncesi/sonrası token, süre, hata sayısı) ve vazgeçme ölçütü.
4. Kesinlikle önerilmeyenler ve neden.
