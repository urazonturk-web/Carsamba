# Byzantion — Yağmurda Şemsiye: Değerlendirme Raporu (2026-11-17)

Kullanıcı: "lodos ve poyraz olmamış yağmurlu havada ise elinde şemsiye olsun, düşüşe geçerken açılsın."
Danışılan: Codex (`codex-gorusu.md`) ve ikinci bir Claude editörü. Brif: `brief.md`. Hepsi yalnız görünüş; zıplama, kamera, çarpışma değişmez.

## 1. Genel görüş
İki editör de fikri beğendi: menüdeki "şemsiyeni unutma!" cümlesi oyunda görünür bir şakaya dönüşüyor. Koşul: **yağmur var + lodos/poyraz yok + kar yok**.

## 2. Ne zaman açık?
| An | Şemsiye |
|---|---|
| Şarj, kalkış, yükseliş, tepe | kapalı |
| Düşüşün ilk karesi (vy>0) | "pat" diye hızlı açılır (~120 ms) |
| Düşüş | açık |
| İniş | kısa sallanma, ~0,3 sn sonra kapanır |

**Asıl risk: "fizik yavaşladı" sanılması.** Açık şemsiye paraşüt gibi okunursa oyuncu süzüldüğünü sanar. Önlem (iki editör aynı): açılma yumuşak değil ani olsun, gövdede yavaşlama/salınım olmasın. Claude editörünün güzel önerisi: düşüş hızlandıkça kumaş yukarı kalkıp **yarı ters dönsün** — "şemsiye işe yaramıyor" mesajı hem daha komik hem fiziği savunuyor.

## 3. El sorunu ve çizim
Amcanın kolu 9 pozda farklı yerde (000'da kalçada, 100'de önde); şemsiyeyi ele oturtmak kırılgan. Çözüm (iki editör aynı yönde): **eli göstermemek.**
- Şemsiye, başla aynı sabit noktaya bağlı ayrı katman (baş 9 pozda aynı yerde → tek koordinat yeter).
- Claude editörü: katman **amcanın arkasına** çizilsin; sap ensenin arkasından çıkıp başın üstüne yükselsin, "elini arkada tutuyor" diye okunur. Kapalıyken sırtta baston gibi çapraz durur.
- Görsel sayısı: **Codex 2** (kapalı + açık), **Claude 3** (+ ters dönmüş). Ters dönmüş hem hızlı düşüş hem rüzgâr şakası için kullanılır.
- Renk: siyah ya da lacivert-beyaz ekose; kırmızı eşofmanla karışmasın, takım renk ikilileri yok.

## 4. İniş okunurluğu
- Kubbe yalnız başın üstünde; ayaklara, gövde yanlarına taşmaz. Genişlik ≈ başın 1,2–1,3 katı.
- Kuleler amcanın altında kaldığı için kubbe iniş yüzeyini kapatmaz. Kontrol edilecek tek yer: yüksek zıplamada kubbenin ekranın üstünden taşması.

## 5. Yaratıcı ekler
- **İnişte damla saçılması:** kubbe kenarından 4–6 damla (Claude önerdi, Codex "seyrek tut" dedi).
- **Hafif yağmur:** yalnız düşüşün ikinci yarısında açılsın — amca "açayım mı açmayayım mı" diye geç kalıyor.
- **Patlama:** şemsiye ters döner, lekeli kalır (Claude). Codex ilk sürümde patlama etkileşimi istemiyor.
- **Pijama:** gece külahı kubbenin altında kalır, ponpon kesilmemeli.
- **Kar:** şemsiye yok; kar birikmesi şakası korunur (iki editör aynı).
- **Lodos/poyraz şakası:** şemsiye açılmaz; amcanın sırtında ters dönmüş kırık şemsiye + menüde "Lodosta şemsiye mi açılır evladım!".

## 6. Önerilen sıra
1. **Kodla prototip (görsel yok, ~1 oturum):** basit çizilmiş kubbe, başın arkasında sabit konum, vy>0'da açılma, inişte kapanma. Telefonda "süzülüyor" algısı ve iniş netliği kontrol edilir. (Claude editörü: görsel üretiminden önce algı testi şart.)
2. **Görsel (Kıvılcım, ayrı onay):** kapalı + açık şemsiye (2 çağrı); istenirse ters dönmüş (3.).
3. Ekler: damla saçılması, hafif yağmur gecikmesi, lodos şakası.
