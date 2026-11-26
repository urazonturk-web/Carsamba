# Byzantion — Oynanabilirliği nasıl artırırız? (2026-11-26)

Kullanıcı: "oyunun oynanılabilitesini arttırmak için neler yapılabilir diğer editörlerle bir değerlendirme yapın ve bana rapor sunun; bunu yaparken en çok oynanan bu tarz oyunların içeriğini de kontrol edin".
Danışılan (birbirini görmeden): Kıvılcım (`kivilcim-gorusu.md`), oyun tasarımı editörü (`editor-tasarim.md`), oyuncu deneyimi editörü (`editor-oyuncu.md`), pazar araştırması editörü (`editor-pazar.md`, kaynaklı). Brif: `brief.md`. Kod değişmedi.

## 1. Türün en çok oynananları bize ne söylüyor
- **WeChat Jump Jump** (bizim birebir atamız: basılı tut-bırak-zıpla): iki haftada ~100 milyon günlük oyuncu, 1. gün tutma %65. Gücü iki şeyde: **ortaya iniş serisi** (+2, +4, +6… kaçınca sıfırlanır) ve **bekleme sürprizleri** (bazı bloklarda 2 sn durunca müzik çalar, kapı açılır, ek puan). Bayramda tek telefonda aileyle sırayla oynama modu.
- **Stick Hero / Stack:** tam ortaya koyunca "PERFECT" + ek puan; seri ödülü.
- **Crossy Road** (250 milyon+): oynayarak kazanılan karakter koleksiyonu, görevler.
- **Alto:** seviye başına 3 hedef (toplam 180), skorsuz "Zen" modu.
- **Subway Surfers** (4 milyar+): birkaç haftada bir değişen şehir, görevler.
- **Mr Jump:** "çok zor, hep baştan" şikâyeti yüzünden kolay sürüm çıkarıldı.
- Ortak ders: ilk dakikada neredeyse hiç yazı yok, mekanik denerken öğreniliyor; ustalık için **görünür ikinci bir hedef** (ortayı tutturmak) var; rekor kırılamayan günde de **küçük görevler** oturumu anlamlı kılıyor.

## 2. Koddan tespitler (editörlerin bulgusu, benim kontrolüm)
- Ortaya iniş algılanıyor ama **puan vermiyor** (`scorePerfectBonus: 0`, `src/game/config.ts:198`), ortayı gösteren şerit gizli. Oyuncu bu ödülün varlığını bilmiyor.
- İniş yazısı hâlâ İngilizce **"PERFECT!"** (`app/index.tsx:1041, 1991`) — 20 Kasım'da da önerilmişti.
- Öğretim tek satır ("Basılı tut… bırak, zıpla!"), ilk 3 koşudan sonra kalkıyor (`app/index.tsx:4027`). Tam kıvam, ortaya iniş, çok kule anlatılmıyor.
- Zorluk her durakta artıp 60. kulede tavana varıyor, sonrası düz (`src/game/stops.ts:87-91`).
- İlk durak (ilk ödül) 15. kulede; ilk koşularda çoğu oyuncu oraya varamayabilir (tahmin).
- Ayarlar ekranı yok (yalnız ses düğmesi). Dil desteği yok.
- **Düzeltme:** Brifte "günün haritası var" yazdım; 12 Kasım'da senin kararınla kapalı ("tekrara düşmemeli", `DAILY_MAP=false`). Kıvılcım ve oyuncu editörünün "günlük haritaya hedef / ana kapı yap" önerileri bu karara ters; aşağıda günlük olmayan biçimine çevirdim.

## 3. Puanlar (oynanış/his · geri gelme isteği)
| Editör | Oynanış/his | Geri gelme |
|---|---|---|
| Kıvılcım | 7 | 7 |
| Oyun tasarımı | 6,5 | 7 |
| (20 Kasım: Kıvılcım 7 / 7, Claude editörü 6,5 / 6) | | |
Ortak gerekçe: dünya ve kimlik güçlü; zayıf olan **ustalığın görünür hedefi** ve **oturum içi kısa hedefler**.

## 4. Editörlerin ortak önerileri (en güçlü sinyal)

| # | Öneri | Kimden | Efor | Onay gerekir mi |
|---|---|---|---|---|
| 1 | **Hataya göre ipucu + kademeli öğretim**: düşünce "Amca uçtu gitti, biraz az bas" / "Kısa kaldın, biraz daha tut"; ilk kez yaşanan şeyde tek satır ("Tam ortaya! Mahalle alkışlar") | Tasarım, Oyuncu, Kıvılcım | Yalnız kod | Hayır |
| 2 | **Tam orta serisi** (Jump Jump'ın kalbi): ortaya inince puan, art arda orta inişte katlanır (+1, +2, +3…), kaçınca sıfırlanır; çatıda ortayı gösteren küçük işaret | Pazar, Tasarım, Kıvılcım | Kod + 1 görsel (orta işareti) | **Evet — puan kuralı değişir**, eski Game Center rekorlarıyla kıyas bozulur (yeni tablo gerekebilir) |
| 3 | **"Muhtarın üç işi" + rütbe**: ekranda her an 3 küçük iş ("üst üste 3 tam orta", "bir koşuda 2 kediyle tanış", "Galata'yı geç"); üçü bitince rütbe (Çırak → Kalfa → Usta → Mahalle Ağası). Günlük değil, bitince yenilenir | Pazar, Tasarım, Kıvılcım | Kod + 0–1 görsel | Hayır |
| 4 | **Oyun sonu kartında sonraki durak**: "Kuzguncuk'a 4 kule" çubuğu + sıradaki kartpostal bulanık görünür | Tasarım, Oyuncu, Kıvılcım | Yalnız kod | Hayır |
| 5 | **Daha hızlı yeniden başlama**: sonuç kartı açıldıktan kısa süre sonra boş yere dokunmak "Bir daha" sayılır | Tasarım, Kıvılcım | Yalnız kod | Hayır |
| 6 | **Ayarlar paneli**: titreşim, az hareket (sarsıntı/kar/yağmur yoğunluğu), büyük yazı, osuruk sesini ayrı kapatma, sol el | Dördü de | Yalnız kod | Hayır |
| 7 | **Tek telefonda sırayla oynama** ("Bayram sofrası": 2–4 isim, her koşudan sonra "Sıra Ayşe teyzede", sonunda kürsü kartı) | Pazar, Oyuncu | Yalnız kod | Hayır |
| 8 | **Ulaşılan duraktan alıştırma** (skor tabloya yazılmaz; geç semtleri görmeyi kolaylaştırır) | Pazar, Tasarım | Kod (+1 görsel) | **Evet — kule üretimine başlangıç noktası** |

## 5. Tek editörden gelen öne çıkanlar
- **Bekleme sürprizi çatıları** (Pazar): laterna (2 sn bekle, çalar), simitçi tablası (martılar iner), kahveci cumbası — 3 görsel. Paylaşılan "sır" etkisi.
- **Oynayarak kazanılan baş aksesuarları** (Pazar): rütbe/durak ödülü kasket, balıkçı şapkası, kaptan şapkası — satış değil ödül; ilk set 4 görsel.
- **Durak pulları** (Oyuncu): her durakta 3 pul, toplam 36 hedef — 1 görsel.
- **Baskısız bildirim** (Oyuncu): gerçek İstanbul havasına bağlı, izni geç isteyen, günde en fazla 1 ("Kadıköy'e kar yağıyor, amca çatıda"). Gurbetçi için en güçlü kanca.
- **"PERFECT!" Türkçeleşsin** ("Tam isabet!") ve **çatıya göre iniş sesi** (kiremit "tak", baca "tın") (Tasarım/Oyuncu).
- **Rekor gerilimi** (Tasarım): rekora 5 kule kala bayrak dalgalanır, geçince vapur düdüğü.
- **İngilizce** (Oyuncu): yabancı turist ilk 2 dakikada Türkçe yazılar yüzünden bırakabilir (tahmin); mağaza öncesi gerekli.
- **Son duraktan sonra "2. sefer"** (Oyuncu) ve **60. kuleden sonra semt karakteri dizileri** (Tasarım; kule üretimine dokunur, onay gerekir).

## 6. Önerim (sıra)
1. **Hemen, onaysız, yalnız kod:** hataya göre ipucu + kademeli öğretim (1), "PERFECT!" → Türkçe, oyun sonu kartında sonraki durak (4), hızlı yeniden başlama (5). Hepsi küçük; ilk dakikayı ve "bir daha" isteğini doğrudan etkiler.
2. **Senin kararınla: tam orta serisi** (2). Türün en kanıtlanmış el hissi döngüsü; tek bedeli rekorların sıfırlanması/yeni tablo.
3. **Muhtarın üç işi + rütbe** (3) — oturumu uzatan ve geri getiren ikinci hedef.
4. **Ayarlar paneli** (6) ve **sırayla oynama** (7).
5. Sonra: bekleme sürprizi çatıları (3 görsel, Kıvılcım onayıyla), baş aksesuarları, baskısız bildirim, İngilizce.
6. Onay isteyenler ayrı konuşulsun: alıştırma modu (8), 60. kule sonrası eğri.

Ölçüm (Kıvılcım + Oyuncu): TestFlight'ta yeni oyuncunun ilk 60 saniyesi, ilk oturumdaki tekrar sayısı, ertesi gün açılış. Testçi az olduğu için sonuçlar yön gösterir, kesin değildir.
Kaynaklar `editor-pazar.md` sonunda. Doğrulanmamış rakamlar orada işaretli.
