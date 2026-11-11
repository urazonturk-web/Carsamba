# Sanat yönetmeni: osuruk izi (kontrail) değerlendirmesi, 2026-11-11

Kaynak: `ANALIZ-2026-11-11/kontakt.jpg`, `kare-15.jpg`, `assets/characters/main-side-profile.png`, önceki `editor-sanat.md`, `app/index.tsx` (DUST_PUFFS / dustStyle).

## 1. Görsel dil
- **Renk:** Yeşil "zehir" olmasın; iğrenç ve "hastalık" gibi okunur, boyalı İstanbul paletine de yabancı kalır. **Krem/bej pamuk bulut + çok hafif sarımsı-haki gölge** (ör. gövde `rgba(240,228,200)`, gölge `rgba(200,190,140)`) kullanılmalı. Mevcut iniş tozu paleti (krem `236,220,194`) bununla aynı aileden, bu yüzden iz ile toz bir bütün olur. Mizahı renk değil biçim taşısın.
- **Biçim:** Uçak kontraili gibi ince çift çizgi bu boyda okunmaz ve "osuruk" demez. Tek sürekli şerit de maske ya da path gerektirir. **Aralıklı pofuduk bulutlar** olmalı: kalçadan çıkan, giderek büyüyüp sönen 2–3 loblu küçük bulutçuklar, arada boşluk. Böylece kesik çizgi gibi bir yörünge izi oluşur.
- **Opaklık/sönme:** Doğduğunda %80, ~600–700 ms içinde 0'a insin; ölçek 0,5'ten 1,3'e çıksın. İz kısa kalsın: ekranda aynı anda yaklaşık bir yay boyu görünsün.
- **Kesilme:** İnişte yeni bulut doğmasın, kalanlar normal sönsün. **Son bulut "pof" diye dağılsın** (120 ms'de 1,6× ölçek + opaklık 0). Ses ile iniş tozu aynı karede biter ve gag'in noktası olur.

## 2. Okunurluk riskleri
- **Karakter:** Bulutlar sırttan değil kalça hizasından, hareket yönünün tersine çıkmalı. İlk bulut karakterden en az yarım gövde geride doğmalı ki 1,4× büyüyen yüzü örtmesin.
- **Hedef kule:** İz geride kaldığı için hedefi örtmez. Yine de inişten ~150 ms önce yeni bulut üretimi dursun, aksi halde son bulut iniş tozuyla çakışır.
- **Skor:** Yay tepesi skora yaklaşırsa bulut opaklığı üst %20'lik bantta yarıya insin. Alternatif olarak skorun konturu bu sorunu zaten çözer (önceki rapor, öneri 2).
- **Gökyüzü/deniz:** Krem bulut, mavi deniz ve gök önünde iyi ayrışır. Asıl risk, beyaz bulutlar ve vapur dalgaları önünde kaybolmasıdır (kare-15). Bunun için her buluta koyu kontur değil, **alt kenarda yumuşak haki gölge** konmalı (sprite içinde).
- **Çoklu atlama:** Sabit havuz ve kısa ömür sayesinde iz uzunluğu süreyle sınırlı kalır, ekranı kirletmez.

## 3. Teknik / performans
- **Sabit havuz: 6 bulut** (her ~90 ms'de bir; ömür ~650 ms). Halka tampon olarak döner, yeni bileşen mount edilmez.
- Yalnız `transform` (translate/scale/rotate) ve `opacity` değişsin. `borderRadius + overflow:hidden` **yok**, dinamik yol (path) yok, bulanıklık (blur) yok.
- **Kodla daire kümesi yerine hazır sprite** önerilir: tek `Animated.Image` = bir view. Kodla çizim (bulut başına 3 daire) 18 view eder.
- **Yeni görsel üretimi: 2 adet** şeffaf PNG, ~128 px, boyalı dokulu ve hafif konturlu: `fart-puff-a`, `fart-puff-b` (farklı lob dizilimi; dönme ve ayna ile çeşitlenir). İsteğe bağlı 3.: `fart-pop` dağılma karesi. Kolon dumanı efektinin hatası (sürekli emitter, çok öğe) tekrarlanmamalı.

## 4. Net öneri ve seçenekler
**Önerim: B.** Komik ama zararsız, paletle uyumlu ve en ucuzu.

- **A, "Pamuk kontrail":** Tek renk krem, küçük ve sık (8 bulut), çok soluk (%50). Zarif, mağazaya güvenli ama espri zayıf kalır.
- **B, "Pofuduk kesik iz" (önerilen):** Krem gövde, haki alt gölge, 6 bulut, aralıklı. Büyüyerek sönerler. İnişte son bulut "pof" ile dağılır. Ses ile görsel arasında birebir eşleşme vardır.
- **C, "Kalkış patlaması + kuyruk":** Zıplama anında büyük tek bulut (karikatür "PRRT" yazısı olmadan), ardından 3 küçük bulutçuk. En komik okunan seçenek bu, ama kalkıştaki büyük bulut kulenin çatısını bir an örter. Ayrıca yazılı onomatope Türkçe/İngilizce yerelleştirme ister.

Kural: Yeşil renk, sinek ve "koku dalgası" çizgileri kullanılmasın. Bunlar oyunu iğrenç tarafa iter, mağaza yaş derecesini de etkileyebilir.
