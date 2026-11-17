# Kolay başlangıç, Kurukafa, iki kişilik online — rapor (2026-11-15)

Görüş alınan editörler: Claude Code (taslak + simülasyon), Codex (salt okunur ikinci görüş, `codex_cevap.md`). Antigravity ve Gemini'nin terminalden çağrılabilen aracı yok; onlara sorulmadı.
Ön adım: beğenilmeyen ZORLUK KADEMESİ 1 kapatıldı (`ZORLUK_KADEMESI = false`); kule dizisi git HEAD ile birebir aynı (simülasyon, 15 koşu × 100 kule).

## 1) İlk durağa kadar kolay, sonra durak durak zorlaşan oyun
- Şu an: zorluk zaten durak başına bir basamak artıyor (Karaköy, Galata, Sirkeci, İskele). 1-14. kule "en kolay basamak", ama 6. kuleden sonra %5 dar kule ve 220'lik yükseklik farkı var.
- Öneri (iki editör aynı fikirde): yalnız 1-14. kule için ayrı ayar. Dar kule yok, geniş kule ağırlığı 0.55 → 0.70, yükseklik farkı 220 → 160, boşluk üst sınırı 340 → 300. 15. kuleden sonraki eğri aynen kalır. Codex'in uyarısı: bunu genel `gapEarly`/`heightVarEarly` değerlerini değiştirerek değil, ayrı bir `id < 15` koşuluyla yapmak gerekir; yoksa sonraki duraklar da değişir. Doğru, öyle yapılacak.
- Simülasyon (gerçek kod, 30 koşu, 1-14. kule, `ZORLUK-2026-11-14/sim_ilk_durak_cikti.txt`): ortalama basış penceresi 72.0 → 75.5 ms, en dar pencere 37 → 50 ms, 40 ms altı zor zıplama %0.7 → %0, ulaşılamayan zıplama 0.
- Fizik, kamera, çatı silüeti değişmez.

## 2) Kurukafa güçlendirmesi
Kullanıcı fikri: havada, zıplama mesafesinde bir kurukafa; alınca varış kulelerinin tepesi 15 saniye %10 büyür ya da küçülür; kulede beklerken süre akmaz.
- Yerleşim: ilk duraktan önce çıkmaz, 8-12 kulede bir, iki kule arasındaki normal zıplama yayının üstünde. Ayrı rastgele sayı akışı kullanır, böylece kule dizisi bozulmaz (iki editör aynı fikirde).
- Toplama: uçarken karakter kurukafaya değerse alınır; zıplamanın yönü/hızı değişmez.
- %10 yeterli mi? Simülasyon (1-14. kule, bütün tepeler çarpanla): ×0.9 → pencere 72.0'dan 68.5 ms'ye (−%5); ×1.1 → 75.4 ms (+%5). Bu fark oyuncuya pek hissettirmez. ×0.8 → 65.0 ms, ×1.2 → 78.7 ms. Öneri: %20.
- Süre: uçuş ortalama ~0.8 sn olduğundan "yalnız uçuşta akan 15 sn" ≈ 18 zıplama; şarj süresi de sayılırsa ≈ 13 zıplama. Codex "5 zıplama" gibi sayaç öneriyor: oyuncu kontrolünde, ekranda kolay gösterilir. Öneri: ekranda "💀 5" gibi zıplama sayacı; süre istenirse saniye de yapılabilir.
- Görünüş: çatı resminin kendisini genişletmek çatı silüeti kuralına dokunur. Bunun yerine kule tepesinde yeni iniş alanını gösteren bir işaret (büyüyünce altın şerit uzar, küçülünce kenarlar kırmızı kararır). İniş testi ve bu işaret aynı çarpanı kullanır, kule verisi değişmez.
- Görsel: kurukafa çizimi ve tepe işareti yeni görsel; Amiga oyunundaki çizim kopyalanmaz, özgün çizilir. Kullanıcı kabulü olmadan oyuna bağlanmaz.

## 3) İki kişi aynı anda online
Yapılabilir. Üç yol:
- A) Meydan okuma (kolay, ~1 gün): arkadaşına "bu haritada beni geç" gönderirsin; ikiniz aynı kule dizisini oynarsınız, skorlar Game Center'da karşılaştırılır. Aynı anda oynamak gerekmez. Not: kullanıcı "günün haritası"nı tekrara düştüğü için kapatmıştı; burada harita her meydan okumada yenidir.
- B) Gerçek zamanlı yarış (orta-zor, birkaç gün): Game Center davetiyle iki iPhone eşleşir, sunucu gerekmez. Aynı haritada aynı anda başlarsınız, rakibin karakteri yarı saydam "hayalet" olarak görünür, skoru canlı akar. Codex'in uyarıları: Swift modülüne maç/davet/veri gönderme eklenmeli; ağ verisi oyun döngüsüne (Reanimated) seyrek ve küçük güncellemelerle aktarılmalı; bağlantı kopması ve aynı anda başlama tasarlanmalı. Rakip yalnız görüntü olduğu için kendi zıplaman hiç etkilenmez. Yalnız iPhone.
- C) Kendi sunucusu (Firebase/Supabase): Android'li arkadaşlarla da oynanır; ama aylık maliyet, hesap ve bakım ister. Şimdilik önerilmez.
- Öneri: önce A, ilgi görürse B.

## Önerilen sıra (iki editörün ortak görüşü)
1. Kolay ilk durak (küçük, hemen yapılabilir).
2. Kurukafa: önce görselsiz mantık + simülasyon, sonra kurukafa ve tepe işareti çizimleri kullanıcı onayına.
3. Online: A, sonra B.
