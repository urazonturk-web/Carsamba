# Animasyon editörü — zıplama poz geçişleri (GECIS-VIDEO-2026-11-26)

Yöntem: videodan 60 fps'te tüm kareler çıkarıldı (`-fps_mode passthrough`, `eq=gamma=1.4`), amca kırmızı eşofman maskesiyle takip edilip yakın planda dizildi. 1 kare = 16,7 ms. Kayıt düzenli 60 fps (kare arası 16,7 ms); oyunun takıldığı anlar kayıtta **aynı karenin tekrarı** olarak görünüyor.
Kanıt: `editor-animasyon-kareler.jpg` (5 satır × 6 ardışık kare, her satır bir geçiş; satır sırası aşağıdaki tabloyla aynı).

## 1) Sert anlar (kare kare)

Atış A = 7,20–8,45 sn (başarılı uzun atış), atış B = 61,13–62,45 sn (uzun atış + düşüş).

| # | An | Video | Poz ekranda | Geçiş | Kare satırı |
|---|----|-------|-------------|-------|-------------|
| 1 | Kalkış: şarj çömelmesi → fırlama | 7,20 sn | şarj pozu (çömelmiş) → fırlama | 1 kare; aynı karede ağırlık merkezi ~36 px (440 px ölçekte) yukarı | satır 1 |
| 2 | Fırlama → süzülme | 7,48 sn / 61,38 sn | fırlama **17 kare ≈ 280 ms** (A), 15 kare ≈ 250 ms (B) | 1 kare; gövde ekseni ~45° yukarı diyagonelden yatay serilmeye | satır 2 |
| 3 | Süzülme → dalış | 8,12 sn / 62,00 sn | süzülme **38 kare ≈ 630 ms** (A), 37 kare ≈ 620 ms (B) | 1 kare; uzanmış gövdeden top gibi toplanmaya, baş yönü de değişiyor | satır 3 |
| 4 | **Dalış → iniş (duruş)** | **8,45 sn** | dalış **20 kare ≈ 330 ms** (son karesi takılma yüzünden 2 kare = 33 ms) | 1 kare; top pozdan dimdik duruşa, **ilk iniş karesi tam boy**, çökme 1 kare SONRA geliyor (8,47–8,52 sn) | satır 4 |
| 5 | Dalış → düşüş paniği | 62,45 sn | dalış 27 kare ≈ 450 ms | 1 kare; poz + eğim aynı karede 0'a atlıyor | satır 5 |

Koddan ölçülen ek kopukluklar (görüntüyle uyumlu):
- **Dönme sıçraması.** `charOpStyle` içinde `araKare` fırlama/dalışta 0,35, süzülme/duruşta 1 — basamak gibi değişiyor; üstüne geçiş darbesi hep **aynı yöne** (+9°, `kolYon=1`) biniyor. Tam şarjlı atışta kabaca: fırlama→süzülme ≈ +13° tek karede, süzülme→dalış ≈ +11° (±3,5° dalgalanma) tek karede. Yani darbe kopukluğu gizlemiyor, **büyütüyor**: yeni poz ilk karesinde en uç açıyla beliriyor.
- **İnişte çökme sırası ters.** `landPulse` 0'dan başlayıp 45 ms'de en derine iniyor; temas karesinde duruş pozu tam boy çiziliyor, en derin çökme ~3. karede. Animasyonda ilk temas karesi en çökük kare olmalı. Kayıtta 8,45 sn karesi "dikilip sonra çöküyor" diye okunuyor.
- Geçiş darbesi sönümü 9/sn → zaman sabiti ~110 ms; ease-out yok, ilk karede tam genlik (ani başlıyor, yavaş bitiyor).
- Takılma: atış A'nın 93 karesinde 7 tekrar kare (≈ %7,5); B'de çok daha fazla. Tekrar kare tam geçişin önüne denk gelirse (8,43 sn) eski poz 2 kare durup sonra kesiliyor ve sertlik artıyor.
- Kısa atış (şarj → denge → şarj) bu videoda net yakalanamadı; görülen atışların hepsi uzun. Ayrı ölçülmedi.

**En sert an: #4 dalış → iniş (8,45 sn).** Silüet en çok bu geçişte değişiyor (yuvarlak/yatay → ince/dikey, boy ~%25 uzuyor). Arada çömelme ya da yaylanma yok. Üstelik çökme bir kare geç geliyor. Kullanıcının gözü tam bu anda karakterde, çünkü puan ve iniş burada.
Sıralama: #4 > #3 > #2 > #5 > #1. Kalkış (#1) aslında doğru: şarjdaki çömelme hazırlık hareketi (anticipation) işini görüyor, hızlı açılma da kural gereği.

## 2) Öneriler

**Ö1 — İnişte yaylanma, mevcut şarj çizimleriyle (çömel → doğrul).** *(1 numara)*
- **Ne:** Temas anında görsel bir `inisCok` değeri `sert`e göre 0,375–0,625 arasında başlar. 2 kare (33 ms) tutulur, sonra 150–180 ms içinde `Easing.out(quad)` ile 0'a iner. `poseCharge = max(charge, inisCok)`. `poseOpacity` zaten basamaklı olduğundan ekranda sırayla charge-050 → 037 → 025 → 012 → 000 görünür: **4 hazır ara kare**. `landPulse` da ilk karede doğrudan `sert` değerinden başlar (45 ms'lik yükseliş kalkar). Çömelme pozunun kendisi de basık olduğu için genlik ~0,6× olmalı.
- **Neden yumuşatır:** Top gibi toplanmış dalış ile dimdik duruşun arasına dizleri bükük bir köprü girer (squash & stretch / yaylanma). Doğrulma ease-out olur, en derin kare de temas karesine gelir.
- **Maliyet:** ~1–1,5 saat kod, **0 yeni çizim**. Her an tek gövde görünür (opaklık hâlâ 0/1), ek katman ve ek çizim maliyeti yok.
- **Risk:** Tepki pozu (k>0) şu an temas karesinde çiziliyor. Çömelmeyle çakışmaması için tepki ~150 ms geciktirilmeli (`withDelay`). Oyuncu bu sürede yeniden basarsa `max(charge, …)` şarjı devralır, sorun yok. Fizik, kamera ve iniş noktası etkilenmez (yalnız poz seçimi ve ölçek).

**Ö2 — Dönme sürekliliği (açı sıçramasını kaldır).**
- **Ne:** (a) `araKare` basamağı, `ucusAci` gibi `EGIM_HIZ` ile izlenen bir değere dönüşsün (0,35 ↔ 1 arası ~55 ms'de kaysın). (b) Darbe yönü sabit +9° olmasın. Her uçuş pozuna bir "çizim ekseni" tanımlansın (tahmin: fırlama ≈ −40°, süzülme ≈ −10°, dalış ≈ +25°; çizim editörü ölçsün). Geçişte yeni poz, eski pozun ekseninden başlasın: ofset = (eski − yeni) × 0,5–0,6. Bu ofset ~120 ms'de ease-out ile sönsün.
- **Neden yumuşatır:** Yeni silüet eski silüetin açısında belirip kendi açısına "döner". Göz ekseni sürekli izler, poz değişimi bir dönüş gibi okunur. Şimdiki durum bunun tersi: açı kopukluğu darbe yüzünden büyüyor.
- **Maliyet:** ~2 saat (eksen ölçümü dahil), 0 çizim. **Risk:** İşaret yanlış olursa daha kötü görünür. Her geçiş için ara kare videosuyla doğrulanmalı.

**Ö3 — Geçiş öncesi ön-darbe (swap'ı en büyük deformasyon anına gizle).**
- **Ne:** `r` eşiğe 0,06 kala (fırlama→süzülme −0,55; süzülme→dalış 0,4), yani yaklaşık 2–3 kare önce, eski poz yeni poza doğru esnemeye/dönmeye başlar (ease-in). Resim değişimi en uç deformasyon karesinde olur, sonra ease-out ile çözülür. Darbe tek taraflı değil, geçişin iki yanına yayılır.
- **Neden yumuşatır:** Klasik "smear/anticipation" hilesi: göz deformasyonu görür, kesmeyi değil. **Maliyet:** ~1,5 saat, 0 çizim. **Risk:** Düşük. `vy` deterministik olduğu için eşik önceden bilinir.

**Ö4 — Dalış → düşüş açısını yumuşat.** `dusus>0 ? 0` yerine açı `EGIM_HIZ` ile 0'a kaysın. ~15 dk, 0 çizim. Panik pozu komik bir kesme olarak kalabilir; yalnız açı sıçraması gider.

**Ö5 — Poz tutma süreleri.** Fırlama ~270 ms, süzülme ~620 ms, dalış ~330 ms. Dalıştan hemen sonra iniş geldiği için iki büyük değişim 330 ms içine sıkışıyor. Dalış eşiği r 0,4 → 0,3 olursa dalış ~40–60 ms uzar ve inişten önce göz pozu "okur". ~10 dk. Risk: süzülme kısalır, ama 560 ms yine yeterli.

**Ö6 — Kalkışa 1 uzanma karesi (isteğe bağlı, test et).** Çömelme ile fırlama arasında charge-000 1–2 kare (≤33 ms) gösterilir: itiş ve uzanma. ~20 dk. Risk: "önce dikildi, sonra uçtu" gibi okunabilir. Kalkış zaten en az sert geçiş, düşük öncelik.

**Çapraz geçiş (crossfade): önermiyorum.** 516×1103'lük iki katman 4–6 kare boyunca yarı saydam çizilir. Bu hem "iki gövde aynı anda görünmesin" kuralını bozar (hayalet görüntü) hem de %19–22 kare kaybının üstüne aşırı çizim (overdraw) ekler. Ö1–Ö3 aynı yumuşaklığı tek gövdeyle, opaklığı 0/1 bırakarak verir.

**Yeni çizim (isteğe bağlı, her biri ayrı onay):** en çok 2.
1. *İniş çömelmesi + takip hareketi (follow-through):* dizler bükük, kollar dengede öne-aşağıda, ceket ve saç geride yukarıda. charge-050'nin yerine yalnız inişte kullanılır; ceketin gecikmesi inişi daha da yumuşatır.
2. *Süzülme→dalış toplanma ara pozu:* bacaklar toplanırken kollar hâlâ açık.
Önce Ö1'i çizimsiz deneyin; ancak yetmezse 1. çizim istensin.

## 3) 1 numaralı öneri
**Ö1: inişte mevcut şarj pozlarıyla çömel → doğrul yaylanması ve ilk temas karesinde tam çökme.** En sert anı (8,45 sn, dalış → dimdik duruş) doğrudan çözüyor. Hazır 4 ara kare kullanıyor, yeni çizim gerektirmiyor, tek gövde kuralını ve performansı korumak için ek katman eklemiyor. Kod maliyeti ~1–1,5 saat. Hemen arkasından Ö2(a) (`araKare` basamağını kaydırmak, ~20 dk) birlikte yapılmalı.
