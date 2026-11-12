# YAPI-2026-11-12 — Oyun tasarımı editörü görüşü

Bakılan kod: `src/game/config.ts`, `src/game/procedural-course.ts`. Bugün zorluk 40 kulede doğrusal olarak artıyor ve tavana ulaşıyor (`difficultyRamp: 40`), ilk 3 kule ısınma, ilk 6 kulede dar kule yok. Yani oyun 40. kuleden sonra yeni bir şey söylemiyor. Durak yapısı tam bu boşluğu doldurur.

## 1. Yapı kararı: melez, "duraklı sonsuz sefer"
- **Ana mod sonsuz kalsın, içine duraklar yerleştirilsin.** Tek dokunuşlu bu türün gücü 30–60 saniyelik turlar ve "bir daha" refleksi. Seçilebilir bölüm ekranı bu refleksi bir menüyle böler, üstelik el yapımı bölümler sürekli içerik üretimi ister. Tohumla üretilen harita bunu ücretsiz verir.
- **Durak sıklığı:** ilk durak **10. kulede** olsun (ilk turda oyuncuya bir "vardım" anı yaşatmak için), sonra **her 15 kulede** bir: 10 → 25 → 40 → 55 → 70 → **90 = iskele**. Altı durak bir "sefer" eder. Vapura yetişince oyun bitmez, "Gece seferi" başlar: zorluk tavanda, gökyüzü gece, duraklar adsız sayaç olarak devam eder ("Gece 1, 2…").
- **Durağa varınca (oyun durmaz, en fazla 1 saniye):** durak kulesi her zaman **geniş ve önceki kuleyle aşağı yukarı aynı yükseklikte** olur (nefes molası). Üstte semt adı belirir, kısa bir düdük ya da "tıng" çalar, gökyüzü tonu bir adım ilerler, durağa ayrıca **+5 puan** eklenir. Durak sonrası ilk 2 kule yeni zorluğun hafif hali olur, ardından yeni kademe tam devreye girer.
- **Düşünce:** ana modda **her zaman baştan** başlanır. Rekorun anlamı ve gerilim bu kurala bağlı. Sonuç kartında "En uzak durak: Eminönü" ve bir sonraki durağa kaç kule kaldığı ("Fatih'e 4 kule kaldı") yazsın. Tekrar oynatan şey bu "az kaldı" hissi.
- **Ayar ölçütü:** sen ve 2–3 kişi 10'ar tur oynayın. Turların ~%50–60'ı ilk durağa varmıyorsa ilk durak 8. kuleye çekilsin.

## 2. Zorluk eğrisi (doğrusal artış yerine kademeli artış)
Bugünkü `t = id/40` hesabı **durak kademesine bağlansın**: her durakta zorluk bir basamak çıksın, iki durak arasında sabit kalsın. Oyuncu "yeni semtte işler değişti"yi hisseder, ayrıca eğri 40 yerine ~90 kuleye yayılır.

**Fizik, kamera ve silueti değiştirmeden yapılabilenler (yalnız üretim kuralı):**
| Kademe | Aralık | Dar kule oranı | Yükseklik farkı | Desen |
|---|---|---|---|---|
| D0 (0–10) | kısa/orta | yok | ısınma | düz |
| D1–D2 | orta | düşük | erken | "merdiven" (3 kule art arda yükselen) |
| D3–D4 | orta/uzun | orta | geç | "dar-dar-geniş", çoklu atlamaya davet eden **yakın kısa kule kümeleri** |
| D5+ | geç değerler | yüksek | geç | desenler karışık, nefes kulesi yalnız durakta |

- Desenler (merdiven, iniş, küme) mevcut erişilebilirlik formülünün içinde kalır, yani her kule yine ulaşılabilir olur. Çoklu kule kümeleri hem zorluk hem ödül fırsatı yaratır, oyunun en sevilen anı olan "+N"i daha sık getirir.
- **Fizik ya da kural değişikliği gerektirenler (şimdilik ertelensin):** rüzgâr (zıplama yörüngesini değiştirir, yasak), hareketli platform (vapur, çamaşır ipi), çöken çatı (iniş mantığına zaman sınırı ekler). Bunlar ancak duraklı yapı oturduktan sonra ve ayrı bir onayla denensin.

## 3. Özellik fikirleri (6)
| # | Ne | Oyuncuya kattığı | Boyut | Görsel? | Risk |
|---|---|---|---|---|---|
| 1 | **Duraklı sefer** (yukarıdaki yapı: semt adı, gökyüzü tonu, iskele, gece seferi) | Hedef ve ilerleme. "Eminönü'ne varamadım" diye bir daha oynar | Orta | Hayır (yazı ve ton kodla) | Gökyüzü tonu için arka plana üst katman gerekir. Opak renk katmanı ucuzdur, maske kullanılmasın |
| 2 | **Rekor çatısı**: önceki rekorun bittiği kulede küçük bir işaret (kodla çizilmiş bayrakçık ya da "REKOR" levhası) | Rekora yaklaştıkça gerilim artar, geçince anında tatmin gelir | Küçük | Hayır | Yok denecek kadar az. Tohum her turda değiştiği için işaret kule sayısına bağlanır |
| 3 | **Tam isabet serisi**: merkeze art arda inişte ×2/×3 çarpanı. Seri sürdükçe **gaz bulutu büyür ve sesi kalınlaşır** | Ustalık katmanı ve gaz mizahının ödüle dönüşmesi | Küçük | Hayır (mevcut bulut büyütülür) | Puan kuralını değiştirir, durak testiyle aynı anda açılmasın |
| 4 | **Günün güzergâhı**: `initWorld(gün tohumu)` ile herkese aynı harita, günlük ayrı rekor (yalnız cihazda) | Her gün bir geri dönüş nedeni, ileride paylaşım için hazır zemin | Küçük–orta | Hayır | Sunucu yok, karşılaştırma da yok. Ana moddan ayrı bir düğme ister (ilk menü) |
| 5 | **Üç küçük görev** ("bir zıplamada 3 kule", "5 tam isabet", "Karaköy'e var"), cihazda tutulur, her gün yenilenir | Kısa vadeli hedefler, oyunun farklı yanlarını öğretir | Orta | Hayır | Fazlası oyunu iş listesine çevirir, en fazla 3 görev |
| 6 | **Kartpostal albümü / eşofman renkleri**: ilk kez varılan her semt için bir kartpostal ya da eşofman rengi açılır | Toplama ve uzun vadeli bağ, İstanbul kimliği | Büyük | **Evet** (semt başına görsel, onay ve kredi gerekir) | Maliyet yüksek, 1–5 tutarsa yapılsın |

## 4. Sıra: önce 1 ve 2
- **1. Duraklı sefer:** kullanıcının asıl sorusunun cevabı ve diğer fikirlerin (görev, albüm, günlük harita) taşıyıcısı. Görsel gerektirmez, önceki turun "yolculuk" önerisiyle aynı yönde.
- **2. Rekor çatısı:** yarım günlük iş. Duraklarla birlikte "hedef var mı?" sorusunu iki ölçekte (yakın hedef rekor, uzak hedef durak) aynı anda sınar.
- Tam isabet serisi (3) üçüncü sırada kalsın. Puan kuralını değiştirdiği için ilk denemenin sonucunu bulandırır.

## 5. Yapılmaması gerekenler
1. **Ana modda kayıt noktası, yani düşünce duraktan devam etmek.** Rekor anlamsızlaşır ve tur başına gerilim çöker. İstenirse ileride ayrı bir "duraktan başla" pratik modu olarak gelir, rekora sayılmaz.
2. **Duraklarda oyunu durduran ekranlar, ödül seçimi, para birimi, mağaza ya da enerji sistemi.** Tek dokunuşun akışını bozar, ödeme veya hesap altyapısı ister ve şu anki kısıtlarla çelişir.
