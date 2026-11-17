# GÖRSEL ŞARTNAMESİ — Pijama anı, seçenek A (PIJAMA-A, 2026-11-16)

**Amaç:** Gece başlarken (Ortaköy durağı, 75. kule) amca çatıda beliren bir kapıdan girip gece kıyafetiyle çıkar. Seçenek A'da amcanın pozları yeniden çizilmez; mevcut pozların üstüne **gece külahı** ve **ev terliği** eklenir.
**Dayanak:** `ai_review_evidence/PIJAMA-2026-11-16/RAPOR.md` (Claude Code + Codex). Kullanıcı kararı: "Evet, A ile".
**Üretim ve harcama kararı kullanıcıdadır.** Bu belge yalnız neyin, hangi ölçüde ve hangi kabul ölçütleriyle üretileceğini tarif eder. Teslim edilen görseller kullanıcı kabul etmeden oyuna bağlanmaz.

---

## 0. Değişmeyecekler

- **Amcanın 9 şarj pozu** (`assets/characters/charge-*-r12.png`, 5'inin "ifade" varyantı) değişmez. Yeni parçalar bunların üstüne ayrı katman olarak çizilir.
- **Çatı silüeti, kuleler, zıplama fiziği, kamera** değişmez. Kapı yalnız ~1 saniye görünen geçici bir katmandır, çatının kalıcı parçası değildir.
- **Üslup:** amcanın çizgi dili. Kalın koyu kahverengi dış kontur, düz boyalı renk alanları, hafif gölge, aynı ışık yönü (soldan üstten). Fotoğraf gerçekçiliği yok.

## 1. Ölçüm (gerçek pozlardan alfa taraması, 2026-11-16)

Pozlar 516 px genişlik, yükseklik 892–1103 px. Pivot alt kenarda (ayak).

| Poz | Ölçü | Baş tepesi y | Baş üstü (ilk 60 px) x aralığı | Ayak alt y | Ayak x aralığı |
|---|---|---|---|---|---|
| 000 | 516×1103 | 1 | 181–417 (orta 299) | 1101 | 88–358 |
| 012 | 516×1080 | 1 | 181–417 | 1078 | 91–361 |
| 025 | 516×1056 | 1 | 181–417 | 1054 | 90–360 |
| 037 | 516×1031 | 1 | 181–417 | 1029 | 89–360 |
| 050 | 516×1005 | 1 | 181–417 | 1003 | 87–357 |
| 062 | 516×979 | 1 | 181–417 | 977 | 83–353 |
| 075 | 516×951 | 1 | 181–417 | 949 | 79–350 |
| 087 | 516×922 | 1 | 181–417 | 920 | 75–345 |
| 100 | 516×892 | 1 | 181–417 | 890 | 80–341 |

**Sonuç:** baş her pozda aynı yerde (şarj sırasında yalnız gövde basılıyor). Bu yüzden **tek bir gece külahı** bütün pozlara oturur. Ayaklar pozdan poza en fazla ~16 px kayıyor. Terlik tek parça çizilip kodda poz başına kaydırılır.

## 2. Gece külahı

**Teslim:** `assets/characters/pijama/gece-kulahi.png`

| Özellik | Değer |
|---|---|
| Ölçü | **~420 × 360 px**, RGBA, şeffaf arka plan |
| Konum | Amcanın 516 px'lik tuvaline göre çizilir: alt kenarı saç çizgisine oturur (y ≈ 40–70), yatay ortası x ≈ 299 |
| Pivot | Alt orta (külahın saça oturan ağzının ortası) |

- Klasik uzun **gece külahı**: lacivert-beyaz çizgili (ya da bordo-krem; eşofmanla çakışmasın diye lacivert önerilir), ucu **geriye, sola** sarkar (amca sağa bakıyor), ucunda beyaz **ponpon**.
- Külah amcanın dağınık saçını kısmen örter; saçın yan tutamları ve kulağı açıkta kalır.
- Kontrol: 9 pozun her birine bindirildiğinde aynı yerde durmalı (baş sabit olduğu için tek görsel yeterli).
- İsteğe bağlı: `gece-kulahi-ifade.png` gerekmez; ifadeli pozlarda baş üstü aynı.
- **2026-11-16 güncelleme (kullanıcı: "külah havada duruyor gibi"):** teslim edilen örnek (`gece-kulahi-SOURCE.png`, 1354×1161) oyunda **530×454** boyutta, 516 px'lik tuvalde **x=−50, y=−75** konumunda kullanılacak (kullanıcı: "külah önde kalmış… tam tersi istikamete çekilsin"; önce x=20). Külah başın arkasına, tepeye oturuyor; alın ve ön saç açıkta. Kanıt: `ai_review_evidence/PIJAMA-2026-11-16/kulah-9-poz-v3.jpg`, `kulah-varyant*.jpg`.

## 3. Ev terliği

**Teslim:** `assets/characters/pijama/terlik.png`

| Özellik | Değer |
|---|---|
| Ölçü | **~320 × 110 px**, RGBA |
| Kapsadığı alan | Beyaz spor ayakkabıların tamamı: x 75–361 aralığı, alttan ~95 px yükseklik (ölçülen) |
| Pivot | Alt kenar ortası; tabanı pozun alt kenarıyla (ayak alt y) hizalı |

- Kahverengi ya da bordo **kareli/ekose ev terliği**, burnu kapalı, tabanı ince. İki tek ayrı ama tek dosyada (pozlardaki ayak düzenine göre: sol ayak geride, sağ ayak önde).
- Beyaz spor ayakkabıların **hiçbir beyaz kenarı** terliğin altından taşmamalı (kabul testi: 9 poza bindirme).
- Eşofman paçasının alt ucu terliğin üstünde görünür kalır.

## 4. Çatı kapısı (geçici, ~1 sn)

**Teslim:** `assets/environment/pijama/cati-kapisi-kapali.png`, `cati-kapisi-acik.png`

| Özellik | Değer |
|---|---|
| Ölçü | **~600 × 760 px** her biri, RGBA |
| Ekranda | Amcanın ayakta boyunun ~1,15 katı yüksekliğinde, genişliği geniş kule tepesinin (76–96 dünya birimi) ~%80'i |
| Pivot | Alt orta; kule tepesinin (iniş yüzeyi) ortasına oturur |
| Çizim sırası | Amcanın **arkasında** (amca kapının önünde durur, içeri girerken soluklaşıp kaybolur) |

- Küçük bir **çatı kulübesi**: kiremit kaplı minik çatısı olan, sıvalı, ahşap kapılı. Mevcut kule kiremit rengi ve sıva tonlarıyla uyumlu.
- `kapali`: ahşap kapı kapalı. `acik`: kapı içeri açılmış, içeride sıcak sarı **lamba ışığı** (gece arka planında okunur olmalı).
- Gece mavisi gökyüzüne karşı kenarlar seçilebilmeli (kalın kontur).

## 5. Akış (kodda yapılacak, görsel teslimden sonra)

1. Ortaköy durak kulesine iniş → kapı `kapali` belirir (0,2 sn), sonra `acik`.
2. Amca 0,4 sn içinde soluklaşıp kaybolur; kapı hafif sallanır.
3. Amca gece külahı ve terlikle çıkar (0,4 sn), kapı kaybolur. Toplam ~1–1,2 sn; yalnız bu sürede dokunma yok sayılır.
4. Patlamadan kalan leke/sinek varsa temizlenir ("temiz pijama").
5. Koşu boyunca külah ve terlik kalır; yeni koşuda amca eşofmanla başlar.

## 6. Kabul ölçütleri

- Külah 9 pozun hepsinde aynı yerde, titreme yok.
- Terlik 9 pozda beyaz ayakkabıyı tamamen örtüyor; ayakların iniş noktası değişmiyor (görsel katman, çarpışmayla ilgisi yok).
- Kapı gece gökyüzünde ve geniş kule tepesinde okunur; çatı silüetini kalıcı olarak değiştirmiyor.
- Hepsi amcanın çizgi diliyle aynı aileden görünüyor (bindirme önizlemesiyle kontrol).
- Telefonda (iPhone) gerçek oyunda kullanıcı kabulü.
