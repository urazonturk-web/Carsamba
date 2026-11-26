# AMAC-2026-11-26 — Ortak rapor: kollar, takılma, oyunun amacı

Kaynak: kullanıcının 13:22 videosu; editörler editor-tasarim.md, editor-oyuncu.md, editor-animasyon.md; Kıvılcım kivilcim-gorusu.md (yalnız yazılı görüş, görsel üretilmedi). Oyun kodu değiştirilmedi.

## 1) "Kazık gibi atlıyor" — kollar
**Teşhis (dördü aynı):** uçuşta gösterilen bütün pozlar (duruş ve çömelme) kollar yanda, bacaklar bitişik, uzak kol hiç çizilmemiş tek parça çizimler. Paket A bu dik şeridi yalnız eğip esnetiyor; "eğik kazık" oluyor. Çözüm kodla değil, **kolları açan yeni çizimle**.

**Ortak öneri: 3 yeni uçuş pozu** (yandan, tuval/ölçek mevcut pozlarla aynı):
- **U1 Fırlama / kalkış:** kollar yukarı-geriye savrulmuş ("hoppa!"), bacaklar gergin, bıyık ve ceket etekleri geriye akıyor, ağız açık gülüyor.
- **U2 Süzülme / tepe:** kollar iki yana tam açık (martı gibi), bir bacak önde bir bacak geride, yüz keyifli. Oyuncunun en uzun gördüğü kare — **en önemlisi, ilk çizilecek**.
- **U3 İnişe hazırlık:** kollar öne-aşağı denge, dizler bükük, gözler çatıda (oyuncu editörü: bir el kasketi tutsun).
- Her pozda uzak kol da çizilmeli.

**Görsel sayısı:** editörler 6–12 arasında sayıyor. Kış/pijama/özel gün şapkası bindirme parça olduğu için kutu ölçümüyle çözülebiliyor; tam yeni çizim gereken: düz eşofman + yağmurluk (± şemsiye). Asgari: **3 poz + 3 yağmurlu = 6 görsel**; önce **yalnız U2 (1 Kıvılcım çağrısı)** ile denemek öneriliyor.

**Çizimsiz ara çözüm (hemen yapılabilir):** mevcut `amca-denge.png` (kollar iki yana açık) tepeden inişe kadar gösterilebilir. Sınırı: bu poz yalnız düz eşofmanla var; yağmur/kış/şemsiyede eski poz kalır.

**Önerilmeyen:** mevcut PNG'den kolu kesip ayrıca döndürmek (ceket deliği kalır, uzak kol yok, omuz boşluğu, yağmurlukta çift kol). Takla da yok.

## 2) Takılmalar (ölçüm)
- Bugünkü üç video kare kare ölçüldü (hareketli karelerde düşen/tekrarlanan kare oranı):
  - 11:51 (hareket paketi yok): %21,2
  - 12:56 (hareket paketi yok): %22,3
  - 13:22 (Hareket Paket A): %18,8
- Yani takılma **yeni paketle gelmedi**; eskiden beri var. Uçuş sırasında birkaç karede bir tek kare tekrarı (≈45–50 fps hissi). Ayrıca oyun sonu kartı açılırken ~200 ms, yeniden başlarken ~100 ms donma var.
- Geçmiş ölçümler (AI_REVIEW.md, 10 Kas Instruments izleri): iOS ekran kaydedicisinin kendisi de bu deseni üretebiliyor, video tek başına güvenilir ölçü değil. Gerçek kaynak olarak her karede çalışan çok sayıda animasyon stili (~150) ve çatı kırpmalarının ekran dışı çizim geçişleri bulunmuştu.
- **Sonraki adım:** telefon Mac'e bağlıyken kullanıcı ~90 sn oynarken Instruments "Animation Hitches" izi almak; hangi karede neyin pahalı olduğunu kesin gösterir. Ardından hedefli düzeltme.

## 3) Oyunun amacı — durak ödülleri
Ortak tespit (tasarım editörü): kayıt noktası yok, uzak duraklara çoğu oyuncu ulaşamıyor → amaç **her 15 kulelik bölümde tekrar alınabilen, beceriye bağlı, ekranda görünen** küçük hedefler olmalı; ödül mümkünse amcanın üstünde görünmeli. Hiçbir fikir puan kuralına ya da kule üretimine dokunmuyor (dokunanlar ayrıca işaretli).

**Öne çıkan fikirler**
| Fikir | Özet | Yeni görsel | Boy | Kim seçti |
|---|---|---|---|---|
| **Teyzenin siparişi (file)** | Hanım teyze liste verir: Üsküdar simit, Arnavutköy çilek, Bebek salep, Kanlıca yoğurt, Kavak balık ekmek… Her durakta o semtin şeyi amcanın **koluna asılı fileye** girer; uçarken file sallanır. Sonuç kartında file, teyzenin tepkisi; menüde "Sipariş defteri 0/12". | 12 küçük eşya + 1 file | M | Oyuncu (1.), tasarımın "Boğaz sofrası" ile aynı kalıp, Kıvılcım'ın "semt hatırası" |
| **Yapboz kartpostal** | Her kartpostal 4 parça: durağa var · o bölümde kediyle tanış · kurukafa yakala · durak kulesine tam ortaya in. Parçalar ayrı oyunlarda birikir. | **0** | S–M | Tasarım (1.), oyuncu |
| **Limon'un izi** | Amcanın muhabbet kuşu Limon kaçmış; her durakta komşu ipucu verir, Limon bir çatıda görünüp uçar; Rumeli Feneri'nde fenerin tepesinde bulunur. Oyunun tek cümlelik hikâyesi. | 1–2 | S–M | Oyuncu (2.) |
| **Emanet zinciri** | Durakta komşu bir şey emanet eder; sırtta bohça, sonraki durakta teslim, teşekkür. En güçlü "bir durak daha" kancası. | 1 (+12 isteğe bağlı) | S | Tasarım (ikinci tur), animasyon ("mahallenin emaneti") |
| **Sefer bileti damgaları** | Her durağa ilk varışta bilete semt damgası. | 1 | S | Kıvılcım (1.) |
| **Muhtarın üç işi** | Her oyunda 3 kısa görev (2 kediyle tanış, 2 kule birden geç…). Tam orta için puan verirse puan kuralı onayı gerekir. | 0–1 | M | Kıvılcım (2.), önceki rapor |
| Martı sürüsü | Her durakta martılara simit; peşindeki martı sayısı = geçilen durak. | 1 | S | Oyuncu (ucuz ek) |
| Günün kelimesi, vapura yetiş, Boğaz haritası, çaycı tepsisi* | Ayrıntı editör raporlarında. *Çaycı tepsisi kedi çıkma oranını değiştirirse onay ister. | | | |

**Benim önerim (birleştirme):**
1. **Önce Yapboz kartpostal** — sıfır yeni görsel, mevcut kartpostal albümü + kedi defteri + Kurukafa'yı tek amaçta birleştirir; erken duraklara da iş bırakır.
2. **Sonra Teyzenin siparişi (file)** — "her durağa varınca bir şey toplama" isteğinin en somut karşılığı; file amcanın kolunda durduğu için 1. maddedeki yeni kol pozlarıyla birlikte çizilmeli. Kıvılcım ~13 onaylı çağrı.
3. Hikâye katmanı olarak **Limon'un izi** ileride bunların üstüne eklenebilir.

## Türden dersler (kaynaklar editör raporlarında)
Jetpack Joyride (aynı anda 3 görev + rütbe), Alto's Odyssey (seviye başına 3 hedef; şansa bağlı hedefler eleştiriliyor), Crossy Road (oynayarak açılan gizli koleksiyon), Subway Surfers (günlük kelime avı, sezonluk toplama). Ortak ders: amaç ekranda görünmeli, beceriye bağlı olmalı, ödül karakterin üstünde durmalı.
