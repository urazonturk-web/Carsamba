# Kedi hikâyesi yeniden — editör raporu (2026-11-28)
Brief: brief.md, soru.md. Cevaplar: Arda.md, Ada.md, Kivilcim.md (Codex), oyun.md, oyuncu.md, teknik.md (Claude).

## Oylar
| Editör | Tercih |
|---|---|
| Arda (oyun tasarımı) | Kullanıcının fikri: tek seferlik pati kurtarışı |
| Ada (anlatı) | Kullanıcının fikri, koşuda bir kez |
| Kıvılcım (görsel) | Kullanıcının fikri, yakın kolondan patiyle çekiş |
| Oyun | PATİ BORCU (kurtarış + hakkı geri kazanma) |
| Oyuncu | Kullanıcının fikri + UYKUCU KEDİ |
| Teknik | ARKA KULE ÇAĞRISI (~1 gün) |
6 editörün 6'sı da çekirdek olarak kurtarışı tutuyor; ayrıştıkları yer hakkın nasıl görüneceği ve nasıl geri geleceği.

## Ortak öneri: "TUTTUM!"
1. Kedi rehber olmaktan çıkar, amcanın bir kule GERİSİNDEN gelir; kulenin arka ucunda oturur, amcanın üstüne binmez. Boyu amcanın ~1/3'ü.
2. Amca ıskalayıp düşüşü kesinleşince (oyundaki `dusus = 1` anı) yarım saniye yavaşlar; kedi kenardan uzanıp yakasını/paçasını ısırır, amcayı kendi kulesine çeker. Ekranda tek kelime: "Tuttum!".
3. Koşu başına 1 hak. Hak durumu yazısız, kedinin hâlinden okunur: uyanık ve kuyruğu dik = hazır; kurtarıştan sonra bir çatıda kıvrılıp uyur = hak yok (UYKUCU KEDİ).
4. Hak geri dönüşü (PATİ BORCU): bir süre sonra kedi uyanıp 2-3 kule ÖNE geçer; amca onun kulesine inerse "teşekkür" sayılır, hak geri gelir. Mevcut izleme kodu burada yeniden kullanılır.
5. İsteğe bağlı tatlı an (KUCAK SICAK): kurtarıştan sonra kedi 3 iniş amcanın omzunda taşınır.

Neden: zıplama kontrolü değişmez (amca havada tekrar zıplayamaz; "kedinin kolonuna zıplama" pratikte kedinin çekişi olarak okunur). Ölüm yerine bir kez rahatlama, sonra hakkı geri kazanmak için yeni bir karar.

## Tuzaklar (editörlerin ortak uyarısı)
- Sınırsız/sık kurtarış rekorun değerini öldürür → koşuda 1, geri kazanma emekle.
- "Bu sefer neden tutmadı?" belirsizliği → hak her an kedinin pozundan görünmeli.
- Fizikle havada yakalama → yapılmaz; kurtarış yalnız düşüş eşiğinde, mevcut Marmara "Şıp" kurtarışı kalıbıyla (teknik).

## Teknik (gerçek koddan)
- app/index.tsx "fall -> game over" bloğundaki Marmara Şıp kurtarışı amcayı başka kuleye koyup onGameOver'ı çağırmıyor; kedi kurtarışı aynı kalıpla buraya bağlanır. Fizik/kamera/findFootLanding değişmez.
- Açık karar: Şıp ile kedi aynı düşüşte çakışırsa hangisi önce?
- Oran: TEKIR_S ~yarıya; havada pozu aynı gövde ölçeğinde yeniden çizilmeli; aynı kulede kedi arka uca (0,68 → ~0,15).
- Tahmini iş: ~1 gün kod + yeni pozlar (uzanma/ısırma, uyuma, omuzda).

## Sonraki adım (onay gerekir)
Kural gereği yeni fikir önce Kıvılcım ile 5 karelik şerit olarak çizilir; ardından eksik pozlar (uzanıp tutma, uyuma) ve oranı düzeltilmiş tüm poz sayfası.

## Şerit (2026-11-28, kullanıcı onayı "Evet, çizdir", 1 Kıvılcım çağrısı)
serit/serit-tuttum.png (1536×1024), komut serit/prompt.md. 5 kare: peşinden gelen kedi → kısa ıska → "Tuttum!" yakadan yakalama → okşama, kedi yoruluyor → kedi bacada uyuyor, amca "Sen dinlen, ben dikkatli olurum." Denetim: amca/kedi referanslara sadık, Türkçe balonlar doğru, din motifi yok. Oran 1., 2., 4., 5. karelerde amcanın dizi-beli arası; 3. karede kurtarış anı için kedi abartılı büyük. Oyuna bağlanmadı.

## Poz sayfası 3 (2026-11-28, onay "Evet, pozları çizdir", 1 Kıvılcım çağrısı)
poz3/kedi-pozlar3.png (1536×1024, gerçek alfa: min 0). Bağlı bileşen ile 8 poza kesildi: poz3/tekir3-{hazir,hazirlanma,kalkis,havada,inis,uzanma,tutma,uyuma}.png.
Ölçüm (alfa>40 piksel alanı): havada/oturuş oranı eski sayfada 0,78, yenide 0,89 → gövde ölçeği tutarlı, zıplarken küçülme büyük ölçüde giderildi. Hücre sınırları taştığı için ızgara değil bileşen kesimi kullanıldı.
Oran önizlemesi poz3/oran-onizleme.jpg: oturan kedi amca boyunun %36'sı ölçeğinde. Oyuna bağlanmadı, kullanıcı kabulü bekleniyor.

## Oyuna bağlandı: "Tuttum!" v1 (2026-11-28, kullanıcı "Evet, bağla")
Kod: src/game/rehber.ts (KEDI_UYKU_N=5, iskaSarj yalnız kanıt pilotu), app/index.tsx (kediHak/kediUyku/kediTut, onLanding kedi bloğu, düşüş bloğunda kurtarış, kediDurum yeniden, 8 yeni poz). BUILD_TAG "KEDI TUTTUM v1".
Akış: kedi amcanın indiği kulenin arka ucuna (%16) sıçrar. Düşüş kesinleşince (dususKesin, dusus=1) hakkı varsa ve amcanın zıpladığı kuledeyse amcayı o kuleye koyar (Şıp yerleştirmesiyle aynı satırlar; amca kulenin %25'inde), kedi ön kenarda uzanma (0,45 sn) + tutma (1,05 sn) pozunda amcanın ÖNÜNDE çizilir, sonra ön kenarda uyur. 5 iniş sonra uyanır, rehberHedef ile öne geçer; onun kulesine inersen hak geri gelir ve yeniden peşinden gelir. Deniz bölümünde kedi kurtarmaz (Şıp önce). Eski pencere/kartpostal finali akıştan çıktı (kod duruyor, tetiklenmiyor).
Ölçek: TEKIR_S = 81/345 → oturan kedi ≈ amca boyunun %40'ı (video 15-43'te ~%67).
Simülatör kanıtı (otomatik pilot, Release): sim-tuttum.mp4; sim/kurtaris-yakin3.jpg (kurtarış anı, 6 kare/sn), sim/kurtaris-yakin.jpg ve kurtaris-yakin2.jpg (ilk iki deneme: kedi amcanın bacaklarının arkasında kalıyordu → amca %25'e, kurtarış pozları amcanın önüne alındı), sim/sheet3.jpg (uyanış 7. puanda, hak geri 11. puanda), sim/tam3.jpg (tam akış).
Riskler: çok dar kulede kedi ile amca yine kısmen üst üste; kurtarışta amca anında kuleye konur (çekilme animasyonu yok); telefonda elle oynanmadı; Kurukafa daraltmasında dar kulede görünüm denenmedi.
