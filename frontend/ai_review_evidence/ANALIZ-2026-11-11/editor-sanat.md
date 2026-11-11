# Sanat yönetmeni değerlendirmesi — 2026-11-11

Kaynak: `kontakt.jpg`, `kare-3/15/27.jpg` (32 sn telefon kaydı), `GORSEL-SARTNAME-2026-11.md`, GAME_STUDIO GORSEL-DEG-001 / GORSEL-018, `assets/characters/`.
Not: Karakter varlıklarında kırmızı **yelek değil, beyaz şeritli bordo eşofman** var; değerlendirme buna göre.

## 1. Puanlar (1–10)

| Başlık | Puan | Kısa gerekçe |
|---|---|---|
| Genel | 5 | Arka plan resmi güzel ama oyun "kartpostalın önünde gezen küçük bir çıkartma" gibi duruyor. |
| Kimlik / özgünlük | 7 | Galata, köprü, vapur, kilim, çamaşır ipi: İstanbul hemen okunuyor. Bu, oyunun en güçlü kozu. |
| Karakter | 4 | Çizim (bıyık, eşofman, uykulu göz) çok iyi; ekranda ~ekran yüksekliğinin %5'i, yüz ifadesi görünmüyor. |
| Okunurluk | 5 | Kuleler artık ayrışıyor (G018), ama karakter denizin mavisinde kayboluyor; "+4" ve "Hold to charge" okunmuyor. |
| Hareket / canlılık | 3 | İnişte toz, sıkışma, ekran sarsıntısı, ses-görsel vurgu yok; çoklu kule atlaması ödüllendirilmiyor. |
| Arayüz | 3 | Gri, sistem fontlu, İngilizce "Game Over / Play Again", hata ayıklama satırları ve "G018 KONTUR" etiketi görünüyor. |

## 2. En büyük 5 görsel eksik (önem sırasıyla)

1. **Karakter çok küçük ve ifadesiz** — kare-3, kare-9, kare-21: bıyıklı adam denizin ortasında 25–30 px'lik bir leke. Mağaza görüntüsünde oyunun yüzü olan karikatür kafa hiç görünmüyor. Şarj sırasında pozun değiştiği bu boyutta fark edilmiyor.
2. **"Juice" yok: iniş, şarj, çoklu atlama sessiz** — kare-15: 4 kule birden geçilmiş, ödül yalnız köprünün üstünde neredeyse görünmeyen yeşil "+4". Toz bulutu, kiremit sıçraması, martı kaçışı, kısa ekran sarsıntısı yok.
3. **Oyun sonu kartı oyunun kimliğini taşımıyor** — kare-27: soluk gri kutu, İngilizce başlık, hata ayıklama metni (R068 ...). Espri satırı ("Havada emindin, yerde şaşkındın") en küçük ve italik — en paylaşılabilir öğe en zayıf yerde.
4. **Değer/kompozisyon: ekranın ortası boş, her şey aynı parlaklıkta** — kontakt: üst yarı gökyüzü + Boğaz, alt üçte bir kuleler; oyunun geçtiği bant (karakter + hedef tepe) ekranın en sıkıcı alanında. Ayrıca kayıtta tüm ekran karartılmış/gri bir örtü altında görünüyor; renkler mağaza için fazla sönük.
5. **Hata ayıklama artıkları ve okunmaz yönlendirme** — tüm karelerde "G018 KONTUR" etiketi; kare-9'da kulelerin üstündeki "Hold to charge" seçilmiyor; skor sayısı küçük ve çerçevesiz, bulutların üstünde kayboluyor (kare-15).

## 3. Üç yaratıcı görsel fikir (Çarşamba/İstanbul'a özgü)

1. **Çatı komşuları:** kule tepelerinde ara sıra pencereden kafa uzatan teyze ("Oğlum düşeceksin!" balonu), çatıda uyuyan sokak kedisi, iniş anında havalanan martı sürüsü. Çatı silueti değişmez; bunlar üstüne eklenen küçük sprite'lar. Mağaza görselinin "hikâyesi" olur.
2. **Simit / çay ödülü yerine "Çarşamba pazarı" çoklu atlaması:** 3+ kule tek zıplamada geçilince karakterin arkasından bir anlık nazar boncuğu/kilim deseninde iz ve büyük, kalın, sıcak renkli "+4 TAKLA!" yazısı; sayıya göre artan esprili Türkçe ünlem (Maşallah! / Oha! / Efsane!).
3. **Gün akışı = ilerleme:** skor arttıkça arka plan sabah → ikindi → gün batımı (Galata pembe-turuncu) → ezan saatinde lambaları yanan gece. Rekor anında vapur düdüğü + gökyüzünde martı. Tek bir ekran görüntüsünde "gün batımında Galata önünde bıyıklı adam havada" mağaza afişi olur.

## 4. Önerilen 3 revizyon

| # | Ne | Neden | Maliyet |
|---|---|---|---|
| 1 | Karakteri ~1,5–1,8× büyüt (yalnız çizim ölçeği, çarpışma kutusu aynı); ince açık dış kontur/hale ekle; şarjda kafa ifadesi abartılsın (göz açılır, bıyık titrer). | Oyunun en özgün varlığı karakter; şu an görünmüyor. Mağaza ve ilk 3 sn'nin kancası o. | Kod: düşük (ölçek + gölge/hale). İfade değişimi için 2–3 kafa pozu: küçük görsel üretimi. |
| 2 | İniş/şarj juice paketi: inişte squash-stretch + kiremit tozu parçacığı, 80 ms sarsıntı; çoklu atlamada büyük, konturlu, sıcak renkli "+N" ve Türkçe ünlem; skoru konturlu kalın fontla büyüt. | Hissedilen ödül yok; video/ekran görüntüsünde "an" yakalanamıyor. | Çoğu kod (orta). 1 toz sprite seti + 1 başlık fontu (küçük üretim). |
| 3 | Oyun sonu kartını yeniden tasarla: Türkçe, kilim kenarlı/çini desenli kart, karikatür kafa (absurd-head) espriyle konuşma balonunda, büyük skor, "Bir daha!" düğmesi; tüm hata ayıklama metinleri ve "G018" etiketi yayın yapısından kaldırılsın. | Espri satırı paylaşılabilir içerik; şu an gizli. Kart, ekran görüntüsü alınan tek durağan ekran. | Kod: orta. Görsel: 1 kart çerçevesi/desen (küçük üretim). |

Öncelik: 1 → 2 → 3. Üçü de fizik, kamera ve çatı siluetine dokunmaz.
