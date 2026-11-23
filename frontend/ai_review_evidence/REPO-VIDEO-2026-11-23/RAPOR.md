# Videodaki eklenti/skill/repo önerileri — dürüst rapor (2026-11-23)

Kaynaklar: videonun ses dökümü (ses.txt) ve kareleri; Codex görüşü (codex-gorusu.md); bağımsız Claude editörü (claude-editor-gorusu.md); GitHub API ile benim kontrolüm (sayılar 23 Kasım).

## Kısa cevap
İkilem yanlış kurulmuş. Videocular sahtekâr değil: adı geçen her araç gerçek ve çoğu çok popüler. Ama reel'lerdeki rakamlar ("kredinin yarısı", "%98", "hız 2x", "100 ajan") araç yazarlarının kendi ölçümü ya da reklam dili; bağımsız kanıtı neredeyse yok. Bizim payımıza düşen hata: önceki değerlendirmelerde "işinize uymuyor" deyip geçtik; doğrusu "gerçek ve popüler, sizin işinizde şöyle ölçelim" demekti. Bu raporda Codex bile ilk turda yanlış (1 yıldızlı) bir Graphify deposunu bulup aracı küçümsedi; GitHub API ile düzelttim.

## Doğrulama (GitHub API, benim kontrolüm)
| Araç | Depo | Yıldız | Son güncelleme |
|---|---|---|---|
| Ponytail | DietrichGebert/ponytail | ~197 bin | 22 Kas |
| Graphify | Graphify-Labs/graphify | ~152 bin | 23 Kas |
| Caveman | JuliusBrussee/caveman | ~122 bin | 23 Kas |
| Agent Skills | addyosmani/agent-skills | ~120 bin | 18 Kas |
| OmniRoute | cheaper-inference/OmniRoute (taşınmış) | ~90 bin | 23 Kas |
| HyperFrames | heygen-com/hyperframes | ~88 bin | 23 Kas |
| CLI-Anything | HKUDS/CLI-Anything | ~63 bin (reel 48 bin diyor) | 20 Kas |
| Agent Browser | vercel-labs/agent-browser | ~53 bin | 23 Kas |
| Grill Me | mattpocock/skills içinde | ~331 bin (depo) | 19 Kas |
| Claudex Loop | chaseai-yt/claudex-loop | ~3,6 bin | 14 Eki |
skills.sh kurulum sayıları ve kalan skill'ler: claude-editor-gorusu.md tablosu.

## Senin işine göre karar
**Denemeye değer (ölçerek):**
1. **Claudex Loop** — Zaten elle yaptığımız "Claude planlar, Codex açık arar" döngüsünü otomatikleştiriyor. En doğrudan fayda.
2. **Ponytail (lite)** — Hazır çözüm varken sıfırdan yazmayı azaltmayı hedefliyor. Bir hafta, aynı tür işlerde öncesi/sonrası.
3. **Caveman** — Kısa yanıtla çıktı token'ını düşürüyor; dış kaynağı olan tek iddia (editör bulgusu: Adobe Research makalesi, JetBrains yazısı; ben okumadım). Not: senin Türkçe ve ayrıntılı açıklama tercihinle çatışabilir; yalnız kod/iç işlerde.
4. **HyperFrames** — Sadece App Store tanıtım videosu zamanı gelince.
**Şimdilik gerek yok:** Graphify (oyun kodu 44 dosya / ~10 bin satır, harita getirisi küçük), Agent Skills (projeye özel skill'lerle çakışıyor), CLI-Anything (Expo oyunuyla ilgisi yok; Blender/Godot işi çıkarsa tekrar bakılır), Agent Browser (yerleşik tarayıcı var), "ultracode" (bu oturumda zaten var; 100 ajan = yüksek maliyet), video araçlarından ffmpeg/Whisper/yt-dlp (zaten kurulu).
**Önermiyorum:** OmniRoute (istekler üçüncü taraf ücretsiz sağlayıcılara gider; gizlilik ve kullanım şartı riski), 13 skill'i toptan kurmak (talimat karmaşası; her skill ajan yetkisiyle çalışır), Wi-Fi prompt'u (repo yok, ağ ayarı değiştirir).

## Asıl token kaybı nerede? (dürüst not)
Claude editörü kayıt dosyalarının büyüklüğünü buldu: AI_REVIEW.md 486 KB, GAME_STUDIO.md 347 KB (doğruladım). Ama ben bu dosyaları tümüyle okumuyorum, sonuna satır ekliyorum; asıl yük bence: tek parça ~5.000+ satırlık app/index.tsx'in parça parça tekrar okunması, çok sayıda ekran görüntüsü/video karesi ve uzun oturumlar. Bunu hiçbir eklenti tek başına çözmez; index.tsx'i bölmek ve kayıt dosyalarını arşivlemek ölçülebilir kazanç getirir.

## Deneme kuralı
Her araç: kurmadan önce depo içeriğini okurum, senin onayınla kurarım, aynı türden 3 işte öncesi/sonrası (süre, token, hata) ölçerim; kazanç yoksa kaldırırım.
