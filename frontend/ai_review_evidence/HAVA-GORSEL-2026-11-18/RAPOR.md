# Byzantion — Hava Görselleri ve Genel Görsel Puan Raporu (2026-11-18)

Kullanıcı: "pus hava görüntüsünü ve diğer hava görsellerini diğer editörlerle değerlendirin; oyun görsel açıdan kaç puan eder, her editör nedenleriyle değerlendirsin."
Danışılan: Codex (`codex-gorusu.md`) ve ikinci bir Claude editörü (sanat yönetmeni rolünde; özeti aşağıda). Brif: `brief.md`.
Görüntüler: simülatörde gündüze sabitlenmiş "hava galerisi" ile çekildi (`01`–`10`, toplu: `hepsi.jpg`). Kod değişmedi (galeri geçiciydi, kapatıldı).

## Puanlar

| Editör | Genel görsel puan | Kısa gerekçe |
|---|---|---|
| **Codex** | **7,5 / 10** | İstanbul teması güçlü ve özgün, basit zıplama oyunlarının üstünde; en büyük eksik katmanlar arası tutarlılık (ressamsı arka plan + keskin kuleler + karikatür amca → yer yer "kolaj"), hava kaplamaları bu farkı büyütüyor, menü kartı oyun sahnesinden daha basit. |
| **Claude editörü** | **6,5 / 10** | Arka plan, kuleler, amca ve kartpostal menü güçlü ve kimlikli; Stick Hero/Stack'in açık ara üstünde. Ama Alto's Odyssey / Crossy Road cilasının altında: stil kopukluğu (amcanın altında gölge yok, "yapıştırılmış" duruyor), yalnız 3 cephe deseni tekrar ediyor, skor fontu sıradan, hava efektleri "ekran filtresi" seviyesinde. |

Ortalama ≈ **7 / 10**. İkisi de aynı yere işaret ediyor: tema ve çizimler güçlü; cila eksik olan **katmanların birbirine oturması ve hava efektlerinin derinliği**.

## 1. Sis / pus — iki editör aynı görüşte: fazla beyaz, yanlış yerde yoğun

- Şu an bir beyaz perde gibi; Claude editörüne göre en beyaz bant deniz ortasında (~%70), uzak siluet daha az örtülü → "parlama" gibi okunuyor. Gerçek sis uzaklıkla artar.
- **Gökyüzü sisle çelişiyor:** üstte masmavi gök ve güneşli krem bulutlar net duruyor (Claude).
- Okunurluk iyi: kuleler, iniş yüzeyi, amca net (ikisi de).

**Öneriler (birleşik):**
- Saf beyaz yerine serin mavi-gri ton (Codex `#C8DDE0`, Claude `#DDE4E8`).
- Uzaklığa göre kademeli opaklık: uzak siluet en yoğun, deniz azalarak, mahalle çatıları çok hafif, kuleler/amca hiç. (Codex daha hafif ister: genel %10–15, siluet %20–25; Claude daha belirgin: gök %45–55, siluet %60–70, yakın deniz %25–30.)
- Gök ve denizin doygunluğu düşürülsün, güneşli bulutlar griye çekilsin.
- 2–3 sis bandı farklı hızda yavaşça kaysın (paralaks).
- İsteğe bağlı: vapur ışıkları hafif parlasın + uzaktan vapur düdüğü sesi.

## 2. Diğer havalar

| Hava | İyi | Sorun | Düzeltme |
|---|---|---|---|
| Yağmur | Kasket + mont hemen anlatıyor (ikisi de beğendi) | Damlalar eşit, düz, opak çubuk; skorun önünden geçiyor; gök güneşli; ıslak çatı belli değil | 3 derinlikte yarı saydam eğik damla, çatıda sıçrama, kiremitte ıslak parlama, gri gök, skor alanı maskesi |
| Kar | **En iyi varyant** (ikisi de) — karlı arka plan, çatılar ikna edici | Buz sarkıtları testere dişi gibi aynı; taneler tek boy, bazıları büyük/parlak; gök masmavi | Sarkıtlarda rastgele boy/aralık, 3 boy tane + salınım, gök soğuk griye |
| Lodos | Sıcak ton atmosferik | Rüzgâr çizgileri cetvelle çizilmiş gibi uzun, düz, opak; skorun üstünden geçiyor | Kısa, konik uçlu, yarı saydam (0.2–0.35), hafif kavisli, dalgalar hâlinde |
| Poyraz | Lodostan ayrışıyor | Mavi filtre evleri de düz boyuyor ("Instagram filtresi"); sıcak renkli yapraklar tuhaf | Ton yalnız gök/deniz/uzak katmana; denize köpük; poyrazda yaprak yok |
| Kapalı / Açık | — | **Neredeyse ayırt edilemiyor** (ikisi de) | Kapalıda gri-mavi gök, koyu bulut şeritleri, parlaklık/doygunluk düşük |
| Açık (ilkbahar/yaz) | Temel görüntü güzel | Turuncu yapraklar uçuşuyor (yazın yanlış) | Yaprak yalnız sonbaharda |
| Kış (karsız) | Bere + atkı mevsimi anlatıyor, soğuk ton iyi | Açık havadan farkı az | Soğuk gök, çıplak ağaç, ağız buharı |
| Gece | Ay ve kart gece hissi veriyor | Yalnız karartma katmanı; düz disk ay, yıldız yok, pencere ışığı yok | Pencere/vapur ışıkları, denizde ay yansıması |
| Uçuşan yapraklar | Tema için doğru | Hap/konfeti gibi | 2–3 gerçek yaprak şekli, dönme, salınım, daha seyrek |

**Ortak kök sorun (Claude editörü):** Gökyüzü ve bulutlar arka plan resmine gömülü ve hep güneşli; bu yüzden hiçbir hava gökyüzünü gerçekten değiştiremiyor. Ayırt edilebilirliği en çok düşüren tek etken bu. Codex de kapalı–açık ve iki lodosun birbirine çok yakın olduğunu söylüyor.

## 3. Puanı 1–2 yükseltecek işler (iki editörün birleşimi)

| # | İş | Efor | Yol |
|---|---|---|---|
| 1 | **Hava efektleri cilası:** sis yeniden (renk, kademeli opaklık, kayan bantlar), yarı saydam/konik rüzgâr çizgileri, 3 katmanlı yağmur/kar, gerçek yaprak şekilleri, sıçramalar, **skor alanında efekt maskesi** | Küçük–orta | Çoğu kod; yaprak/sis dokusu için küçük görseller |
| 2 | **Gökyüzünü ayrı katmana almak**, her havaya kendi göğü ve bulutu (açık, kapalı, sis, yağmur, kar, gece) | Orta–büyük | Yeni görsel (5–6 gök/bulut seti, Kıvılcım, onaylı) + kod geçişleri |
| 3 | **Amcayı sahneye oturtmak ve arayüzü markalaştırmak:** temas gölgesi, havaya göre hafif renk tonu, kartpostal dilinde skor fontu, ses düğmesi ve ipucu kutusu aynı dilde; 2–3 yeni kule cephesi | Küçük–orta (cephe: yeni görsel) | Gölge/ton/font kod; cephe Kıvılcım |

**Benim notum:** Claude editörünün "menüde PAYLASIM KARTPOSTALI yazısında Ş eksik" gözlemi bir yazım hatası değil; bu, her deneme sürümünü telefonda doğrulamak için koyduğumuz geçici sürüm etiketi. App Store sürümünde kaldırılacak.

**Önerilen ilk adım:** 1. madde (kodla, yeni görsel gerektirmez) — sisten başlayarak; ardından 2. madde için Kıvılcım'dan gök seti (ayrı onay).
