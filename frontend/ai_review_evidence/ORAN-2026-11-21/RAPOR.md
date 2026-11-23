# Pencere komşuları — oran nasıl düzelir? (2026-11-21)

Kullanıcı: "binadan çıkan kadınların olması aslında hoşuma gitti ama orantısal olarak da ayarlamak lazım… baştan pencere oranına dönersek zor mu olur, diğer editörlerle değerlendirin"
Danışılan: Codex (`codex-gorusu.md`), Claude editörü (`claude-editor-gorusu.md`). Brif ve ölçümler: `brif.md`, `olcum-kare.png`. Kod değişmedi.

## Ölçüm (iPhone 17)
Amca ~260 px boy, başı ~90 px · kule ~255 px genişlik, kat ~250 px · cephedeki pencere camı ~110 px · teyzenin başı ~30 px (telefon kaydında ~10 px'lik leke). Görselin ~%35'i panjur/halı boşluğu, ayrıca kulenin yarısı genişliğinde çiziliyor.

## Seçenekler — iki editörün değerlendirmesi
| Seçenek | Zorluk | Codex | Claude | Sonuç |
|---|---|---|---|---|
| a) Pencereler aynı, komşu amca ölçeğinde, pencereden taşar | Kod kolay, 1 görsel | **Önerir** (e ile) | Riskli: aynı kulede iki ölçek yan yana ("oyuncak evde dev") | İlk deneme olabilir |
| **b) Cepheyi büyütmek ("baştan pencere oranı")** | 12 cephenin hepsi yeniden çizim + kod | Gereğinden kapsamlı | En pahalı, en az kazanç; sık İstanbul dokusu kaybolur, şehir boş görünür | **İkisi de hayır** |
| **c) Komşulu kulede çatının hemen altında büyük cumba/balkon** | Kod az, 3 görsel (ilk dalga) | Sonra değerlendirilebilir | **Önerir** — cumba dili cephelerde zaten var; büyük ölçeğe mimari gerekçe; risk düşük | **Güçlü aday** |
| d) Amcayı küçültmek (1,4 → 1,15) | Tek sayı ama her yeri etkiler | Algı değişir | Kabul edilen görünüm bozulur, açığı kapatmaz | Hayır |
| e) Komşu pencere önünde eğilmiş, dirsekler pervazda; komşu ve pencere ayrı katman | Kod düşük–orta | **Önerir** (a ile) | (c) ile birlikte yöntem olarak | Her iki planda kullanılır |

**Cevap: "baştan pencere oranına dönmek" (bütün cepheleri büyütmek) zor ve gereksiz** — 12 cephe yeniden çizilir, kazanç az, şehrin sık dokusu bozulur. Oran sorunu yalnız komşulu kulelerde çözülebilir.

## Önerim — (c) + katmanlı komşu
- Komşulu kulede, oluğun hemen altında **büyük yeşil ahşap cumba** (~kule genişliğinin %85'i, ~bir kat). İniş çizgisinin altında kalır; çatı silueti ve oynanış değişmez.
- Komşu **ayrı katman**: belden yukarı cumbadan dışarı, dirsekler pervazda, başı ~65–75 px (amcanın %75–85'i).
- Yazılı balon yok; **jest + kelimesiz ses**: normalde halı silker · amca gelince başını kaldırıp bakar · kıl payı inişte halıyı "pat pat" silker, toz bulutu · ses "cık cık", "ıhh!". Kule başına en fazla bir tepki.
- **Görsel isteği (Kıvılcım, onayınla):** ilk dalga 3 görsel — boş cumba, teyze (halı silkerken), teyze (bakarken/tepki). Beğenilirse komşu amca ve çocuk için +2'şer (toplam 7).
- **Kod:** yarım gün civarı (kutu ölçüleri, iki katman, poz geçişi); 3 cihaz boyunda ekran görüntüsüyle doğrulama.
- Bu arada mevcut küçük komşular ve yazılı balonlar kapatılabilir.

## Kıvılcım çıktısı (kullanıcı: "Evet, iste" — 3 görsel)
`cumba/cumba-bos.png`, `cumba/teyze-hali.png`, `cumba/teyze-bakis.png` (aynı 1000×1100 tuval, ayrı katman, şeffaf) + Kıvılcım önizlemeleri `cumba/onizleme-*.png`.
- Çizgi dili amcayla ve cephelerle tutarlı; cumba yeşil ahşap, panjurlu, konsollu. İki poz (halı silkeleme / "vay sen misin" bakışı) aynı yerde hizalı.
- **Ölçek:** Kıvılcım teyzeyi cumbanın içinde istenenden küçük çizdi. Cumba kule genişliğine oturtulunca teyzenin başı amcanınkinin ~%55'i (eskisi ~%33).
- Katmanlar ayrı olduğu için teyze kodda bağımsız büyütülebiliyor: **1,4 kat** (pervaz noktasından) büyütünce başı amcanınkinin ~%80'i oluyor ve cumbadan taşıyor — editörlerin hedeflediği oran. Karşılaştırma: `cumba/oran-karsilastirma.jpg` (solda 1,0, sağda 1,4). Önizleme eski ekran görüntüsü üstüne yapıldı; üstteki "Oğlum in oradan!" balonu o eski görüntüden.
- Oyuna bağlanmadı; kullanıcı kabulü bekleniyor.

## Oyuna bağlandı (kullanıcı: "1,4 kat, bağla")
- `src/game/mahalle.ts`: cumba + teyze ayrı katman (`cumba-bos.png`, `cumba-teyze-hali.png`, `cumba-teyze-bakis.png`; teyze 1,4 kat pervaz noktasından büyütülüp basıldı), `cumbaBox` (kule genişliğinin 1,14 katı, üst kenarı oluğun hemen altında → iniş çizgisinin altında). `app/index.tsx` PlatformHouseView: üç katman, yalnız transform.
- Amca teyzenin kulesine inince teyze "vay sen misin" pozuna geçer (yazı yok); koşu yeniden başlayınca normale döner.
- Kullanıcının "diyalogları hiç beğenmedim" kararıyla yazılı her şey kapatıldı: iç ses (`ICSES_ON`), Hanım bildirimi (`HANIM_ON`), komşu ve kedi balonları (`MAHALLE_SPEECH_ON`). Kodları duruyor. Eski küçük komşu amca ve çocuk görselleri de kapalı (`ESKI_KOMSULAR_ON`); cumbalı sürümleri çizilince açılır. Kediler, kedi defteri, özel günler, lakap duruyor.
- Simülatör (test ayarıyla her kulede): `cumba/sim-oyunda.png`. Cumba iOS'ta kule genişliğinde kırpılıyor (kuleden taşan kenarlar görünmüyor); görüntü düzgün. Bakış pozuna geçiş simülatörde inişle görülmedi.
