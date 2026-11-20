# Byzantion — Yeni Fikirler ve Bugünkü Puan (2026-11-20)

Kullanıcı: "oyunumuza başka neler ekleyebiliriz? diğer editörlerden de yaratıcı fikirler bekliyorum ayrıca şu haliyle oyunu puanlasınlar"
Danışılan: Codex (`codex-gorusu.md`) ve ikinci bir Claude editörü (`claude-editor-gorusu.md`). Brif: `brief.md`; 6 ekran görüntüsü (yağmur, lodos, kar, gece menü, meydan okuma, paylaşım kartı). Eski raporlardaki fikirler tekrar edilmesin diye brife yazıldı. Kod değişmedi.

## 1. Puanlar

| Alan | Codex | Claude editörü |
|---|---|---|
| Görsel | 8,5 | 8 |
| Oynanış / his | 7 | 6,5 |
| Özgünlük / kimlik | 9 | 8,5 |
| Eğlence / mizah | 8 | 6,5 |
| Geri gelme isteği | 7 | 6 |
| Paylaşılabilirlik | 8,5 | 7,5 |
| App Store'a hazırlık | 6,5 | 5,5 |
| **Genel** | **8 / 10** | **7 / 10** |

İkisinin ortak görüşü: kimlik ve görsel türün (Stick Hero, Mr Jump, Doodle Jump) üstünde; zayıf halka **iniş anının tatmini** ve **uzun vadede geri getiren ikinci bir hedef**. Claude editörü: "Stick Hero'dan daha çok dünya, daha az tek dokunuş tatmini."

## 2. İki editörün de bulduğu fikirler (en güçlü sinyal)

| Fikir | Codex | Claude editörü |
|---|---|---|
| **Mahalle pencereleri / balkon seyircileri** — pencereden halı silkeleyen teyze, "Oğlum in oradan!" diyen komşu, alkışlayan çocuk; Claude: tepki inişe bağlı (ortaya inersen alkış, kenara "Aaa!") | En iyi 3 (1.) | Fikir 2 |
| **Çatı kedileri** — çatıda uyuyan kedi, amca inince gerinir; Claude: adlı kediler, "Kedi defteri" koleksiyonu | Fikir | En iyi 3 (2.) |
| **Kişisel kartpostal** — Codex: koşu tarzına göre lakap damgası ("Galata'da temkinli"); Claude: durak selfiesi, kart o koşunun karesinden | En iyi 3 (2.) | Fikir 7 |
| **Amcanın sesi** — Codex: tek satır iç ses balonu; Claude: "Hanım arıyor" oyun sonu bildirimi ("Ekmek nerde? 23 kule mi zıpladın?!") | En iyi 3 (3.) | Fikir 5 |

## 3. Tek editörden gelen öne çıkanlar

**Claude editörü:**
- **Maşallah serisi + nazar boncuğu** (en iyi 3'ün 1.'si) — kusursuz inişler art arda gelince "Maşallah!" → "Helal!" → "Vay be!"; 10'luk seride göğüste nazar boncuğu, seri bozulunca "çat" diye çatlar. İngilizce "PERFECT!" yazısının yerine geçer. Neredeyse tamamen kod, en ucuz.
- **Düşüş repertuarı** (en iyi 3'ün 3.'sü) — düşünce her seferinde başka son: vapur güvertesine düşüp götürülmek, çamaşır ipine takılmak, simit tablasına oturmak; görülen sonlar koleksiyon. Pahalı (her son görsel); 2-3 sonla başlanmalı, 1 saniyeyi geçmemeli.
- Bıyık barometresi (bıyık lodosta savrulur, poyrazda diken diken), kayıp terlik, hayalete laf bırak (hazır listeden), muhtarlık ilan panosu (sıralama), sahur davulcusu (gece 02-04).

**Codex:** Boğaz'ın ses haritası (semte göre ses), yanlış vapur anonsu, cepten çıkan eşyalar (vapur bileti, mandal), saate göre kule/minare gölgeleri, birleşik posta damgası.

## 4. Puanı artırmak için (iki editörün ortak listesi)
1. **İniş hissini cilalamak** — seri ödülü (Maşallah/nazar), titreşim, küçük toz bulutu, seriyle yükselen ses. Her iki editör de oynanış puanını buna bağlıyor. *(Not: fizik/kamera değişmez; yalnız efekt ve ses.)*
2. **Mağaza öncesi temizlik** — "PERFECT!" Türkçeleşsin, buton adları tutarlı olsun, gece ayına doku/hale, lodos çizgileri telefonda kontrol, yağmurda skor ile martı/efekt çakışması kontrol.
3. **İkinci koleksiyon + değişen paylaşım kartı** — kedi defteri veya düşüş sonları; 0 puanlık koşuda paylaşım yerine komik an.
4. **TestFlight'tan ölçüm** (Codex) — ilk dakikada kontrol anlaşılıyor mu, yeniden başlama isteği var mı.

## 5. Editör notlarına düzeltmeler (benim kontrolüm)
- Menüdeki "PAYLASIM KARTPOSTALI / MEYDAN OKUMA = 2 DK" yazıları sürüm etiketi (BUILD_TAG); App Store öncesi zaten kalkacak listede. "Ş" eksikliği de bu etiketten.
- "Kartpostal hep Galata": değil — kart fotoğrafı ulaşılan durağa göre değişiyor; ekran görüntüsünde test koşusu olduğu için Galata görünüyordu. 0-1 duraklı koşuda ise hep aynı damga görseli çıkıyor; bu eleştiri geçerli.
- "PERFECT!" İngilizce: doğru (`app/index.tsx:918, 1560`).
- Codex "mevcut kedi" diyor; oyunda kedi yok (yalnız kartpostal notunda geçiyor).
- Yağmurda "REKOR" ile çakışma: 07-yagmur-v2 görüntüsü skor katmanı öne alınmadan önce çekildi; telefonda kontrol edilmeli.

## 6. Önerim (sıra)
1. **Maşallah serisi + nazar boncuğu** ve "PERFECT!"in Türkçeleşmesi — küçük, yalnız kod (+1 küçük boncuk görseli), iki editörün de "iniş hissi" eleştirisine doğrudan cevap.
2. **Balkon seyircileri** — iki editörün ortak fikri; 3-4 pencere görseli (Kıvılcım onayı gerekir), tepki inişe bağlı.
3. **Çatı kedileri + kedi defteri** — kartpostallardan sonraki ikinci koleksiyon.
4. Sonra: düşüş repertuarı (2-3 sonla), Hanım arıyor, bıyık barometresi.
