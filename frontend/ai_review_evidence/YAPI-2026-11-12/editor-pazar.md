# Editör / Pazar ve Oyuncu Davranışı — YAPI-2026-11-12

Kaynak: brief, YOL-2026-11-12 pazar notu. Web araması yapılmadı. Tür örnekleri genel pazar bilgisine dayanıyor. Bunlar yapı örneği, kopyalanacak model değil.

## 1. Yapı kararı: melez (sonsuz koşu + kalıcı duraklar)

**Öneri:** Koşu sonsuz kalsın, düşünce her zaman 1. kuleden başlansın. 15 kulede bir gelen **durak**, ilerlemeyi kalıcı olarak işaretlesin ama kayıt noktası olmasın.

- **Neden sonsuz:** Tek dokunuşlu zıplama oyunlarının asıl motoru "bir daha" döngüsü. Tur 20–40 saniye sürüyor, düşünce 1 saniye içinde yeniden başlanıyor, karşılaştırılacak tek bir sayı var. Kayıt noktası koyarsak rekor anlamını yitirir ("12. duraktan başladım" diye skor paylaşılmaz). Tür başarılılarının çoğu bu yüzden sonsuz ilerler. Ancak elde tutmayı sağlayan, koşunun dışındaki kalıcı katman olur: koleksiyon, görev, açılan karakter.
- **Neden bölümlü değil:** Elle tasarlanmış bölümler bu oyunda içerik üretim yükü getirir (her bölüm ayrı test, ayrı görsel). Harita zaten rastgele üretiliyor ve fizik değişmiyor, dolayısıyla "bölüm"ün oyuncuya sunacağı yenilik az olur. Bölümlü top/kule oyunları ilerleme hissini iyi verir, ama orada bölüm 30 saniyelik kendi içinde biten bir bulmaca. Bizde öyle değil.
- **Durağa varınca (≈1,5 sn, kontrol elden alınmadan):** semt adı tabelası büyük ve okunaklı, kısa vapur düdüğü ya da "tıng" serisi, gökyüzü bir adım ilerler, sayaç "Durak 2/…" olur. Küçük bir ödül de verilsin: durakta +5 bonus ya da bir sonraki koleksiyon parçası (bkz. fikir 2). Durak, oyuncunun "bu tur iyi gidiyor" diye hissettiği ve klibin kesildiği an olmalı.
- **Durakta zorluk** bir kademe artar (bkz. 2. bölüm). Yavaşlama ya da mola ekranı olmasın, ritmi bozar.
- **Düşünce:** baştan başlanır. Sonuç kartında "En uzak durak: Karaköy" ve bir sonraki durağa kaç kule kaldığı yazsın ("Eminönü'ne 4 kule kaldı"). Bu "az kaldı" bilgisi, türde yeniden denemeyi en çok tetikleyen tek satırdır.
- **İsteğe bağlı (sonra):** açılmış bir duraktan başlayan "Antrenman" modu. Rekora ve günlük skora sayılmaz. Zor bölgede pratik yapmak isteyen azınlık için var, ana döngüye karışmamalı.

## 2. Zorluk eğrisi (fizik değişmeden)

Fizik ve kamera aynı kalıyor, değişen yalnızca **kule üretim parametreleri**:

| Durak | Fizik değiştirmeden | Not |
|---|---|---|
| 1 (0–15) | Geniş çatılar, kısa aralık, yükseklik farkı küçük | İlk 15 kule öğretici. Yeni oyuncuların büyük kısmı ilk turu burada kaybediyor. |
| 2–3 | Aralık dağılımı genişler, dar çatı oranı artar | |
| 4–5 | Yükseklik farkı artar (aşağı/yukarı atlama) | Siluet kuralı içinde kalmalı. |
| 6+ | Dar + uzak kombinasyonları, arka arkaya iki zor kule | Üst sınır sabit kalsın, sonsuz zorlaşmasın. |

- **Fiziğe dokunanlar (şimdilik yok):** rüzgâr, hareketli çatı, kayan yüzey. Bunlar şarj/zıplama hissini değiştirir ve iOS'ta ek test ister. İleride ancak ayrı bir "etkinlik" olarak denenebilir.
- **Kritik pazar notu:** ilk 2 durak *kolay* olmalı. İlk oturumda durak görmeyen oyuncu yapının varlığından haberdar olmaz.

## 3. Özellik fikirleri

| # | Ne | Neden tekrar oynar | Boyut | Görsel | Risk |
|---|---|---|---|---|---|
| 1 | **Semt yolculuğu + "az kaldı" sonuç kartı** (durak adı, gökyüzü adımı, en uzak durak) | Somut ve isimli bir hedef: "Bu sefer Eminönü'ne varacağım" | Orta | Tabela yazı ile çözülür. Gökyüzü tonları kodla yapılır. | Gökyüzü geçişi iOS'ta pahalıysa tek renk katmanı ile sınırla. |
| 2 | **Durak kartpostalı koleksiyonu**: her yeni durak bir kartpostal açar, menüde albüm olur | Kalıcı ilerleme. Tamamlama dürtüsü düşse bile geri getirir. | Küçük–orta | Mevcut arka plandan kırpılabilir. Yeni görsel ilk sürümde şart değil. | Albüm ekranı = ilk "menü". Kapsam taşmasın. |
| 3 | **Günlük çatı** (`initWorld(seed)` ile günün sabit haritası, günde sınırsız deneme, gün rekoru) | Her gün dönme nedeni. Arkadaşlarla aynı haritada karşılaştırma. | Küçük | Yok | Sunucu olmadan yalnız yerel olur. Karşılaştırma paylaşım metniyle yapılır. |
| 4 | **Paylaşım kartı**: "Amca Karaköy'e kadar uçtu — 47 kule, Günlük #12" + iOS paylaşım menüsü | Sosyal tetik. Günlük harita ile birlikte "sen kaçta kaldın?" döngüsü. | Küçük | Yok (metin + mevcut ekran) | Ekran görüntüsü yalnız sonuç kartında alınsın. |
| 5 | **Amca kıyafetleri** (durak/görevle açılır: kasket, atkı, terlik), gaz rengi/izi çeşitleri | Uzun vadeli hedef. Gaz izi rengi mizahı taşır ve kliplerde görünür. | Orta–büyük | Evet (her kıyafet ayrı) | Görsel kredi ve onay gerektirir. 1,4× karakterin okunurluğu bozulmasın. |
| 6 | **Küçük görevler** (3 adet, yerel): "Tek turda 3 kez +2 yap", "Galata'yı geç" | Kısa oturuma hedef ekler, farklı oynamaya iter | Orta | Yok | Görev listesi menü ve UI yükü getirir. 3'ten fazla olmasın. |

## 4. Sıra: ilk 2 deneme

1. **Semt yolculuğu + "az kaldı" sonuç kartı (fikir 1).** Önceki turun da önerisiydi, yapı kararının kendisini sınar ve görsel gerektirmez. Ölçü: aynı sürede tur sayısı artıyor mu, oyuncular 2. durağı görüyor mu?
2. **Günlük çatı + paylaşım kartı (fikir 3 + 4 birlikte).** İkisi de küçük, hesap ve sunucu istemez. Elde tutma (yarın dön) ve büyüme (arkadaşa at) aynı anda denenmiş olur. Beta (TestFlight) açıldığında ilk sorulacak soruya, yani "arkadaşına atar mısın?" sorusuna doğrudan veri üretir.

Kıyafet/koleksiyon (5, 2) bu ikisinin verisi gelene kadar beklesin. Oyuncu 2. durağa varamıyorsa ödül katmanının değeri yok.

## 5. Yapılmaması gerekenler

- **Kayıt noktasından devam ya da "can satın al / reklam izle devam et".** Rekoru ve paylaşılan skoru anlamsızlaştırır. Reklam/IAP ayrıca yaş derecesini ve gizlilik etiketini ağırlaştırır, bu aşamada kapsam dışı.
- **Elle tasarlanmış numaralı bölüm haritası (1–100 bölüm ekranı).** Üretim maliyeti yüksek, rastgele haritanın ve günlük tohumun avantajını boşa çıkarır. Oyuncuya da bu türde beklemediği bir "iş" hissi verir.
