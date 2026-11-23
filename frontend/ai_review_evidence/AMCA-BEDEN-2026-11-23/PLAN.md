# PLAN — Amcanın inişten sonraki beden dili (Byzantion, 2026-11-23)

## İstek
Editör önerisi (YARATICI-SES-2026-11-21): kişiliği yazı yerine bedenle anlatmak. Kullanıcı 3 Kıvılcım pozunu gördü: "Kabul, bağla".

## Varlıklar (yeni, `frontend/assets/characters/beden/`)
| Dosya | Tuval | Ölçülen ayak ortası (alt 40 satır, alfa>128) | pivotX |
|---|---|---|---|
| amca-silkele.png | 516×1103 | 220 | 306 |
| amca-denge.png | 1100×1103 | 543 | 629 |
| amca-ohbe.png | 1100×1103 | 550 | 636 |
Kalibrasyon: aynı yöntemle `charge-000-r12` ayak ortası 222, kodda pivotX 308 (sabit dünya çapası = ayak ortası + 86). Yeni pozlar aynı kuralla: pivotX = ölçülen ayak ortası + 86; pivotY = 1103 (ayak tabanı tuvalin altı). Ölçek charge-000 ile aynı (Kıvılcım "aynı taban, aynı baş boyu" önizlemesi; dort-poz-ayni-taban.png).

## Davranış (yalnız görsel)
- Tetik (`onLanding`, JS, iniş başına tek karar, öncelik sırası mahalle sesleriyle aynı): `towersCrossed >= 3` → oh be; değilse kenar `ratio <= 0.12 || ratio >= 0.88` → denge; değilse kusursuz (`perfect > 0`) → silkele; aksi hâlde tepki yok (çoğu inişte normal duruş — tekdüzelik olmasın diye her inişe tepki konmaz).
- Süre: 900 ms (oh be 1100 ms). Bitince normal duruşa (charge-000) döner.
- Erken bitiş: `ChargePoses`'a yeni prop `phase` (mevcut `phase` SharedValue'su, `PHASE` IDLE 0 / CHARGING 1 / AIRBORNE 2 / DEAD 3) verilir. Tepki pozu yalnız `phase === PHASE.IDLE` iken görünür (son kontrol bulgusu sonrası: inişten sonraki çömelme toparlanmasını, yani `poseCharge`'ın sıfıra inişini **beklemez**; tepki iniş anında başlar ve görünür olduğu sürece **bütün** şarj/idle pozları gizlenir). Şarja başlayınca (PHASE.CHARGING), havalanınca ya da düşünce aynı karede gizlenir ve şarj/idle pozları normal kurala döner.
- Sıfırlama: `restart` içinde `cancelAnimation(tepki); tepki.value = 0;` (bekleyen bitiş animasyonu da iptal olur). Yeni koşu başlangıcı (`restart` dışındaki başlatma yolu varsa) aynı sıfırlamayı çağırır. Yeni tepki eskisinin üstüne gelirse önce `cancelAnimation(tepki)` sonra yeni değer ve yeni `withDelay` bitişi.
- Kıyafet uyumu: yağmur montu, kış beresi/atkısı, pijama/terlik, özel gün şapkası, şemsiye, leke (dirty) ve kar katmanları yalnız şarj pozlarına çizili; bunlardan herhangi biri o an görünürken (değer > 0,01) tepki pozu **gösterilmez** (kıyafet bir anlığına kaybolmasın).
- Çizim: `ChargePoses.tsx` içine `ReactionLayer` (3 adet): mevcut `PoseLayer` ile aynı dönüşüm (px/py, feetCenterOffset, pivot, landPulse sıkışması, offsetX/Y, strain yok) ve aynı hale (halo) kopyaları. Görünür olduğu sürece bütün şarj/idle pozlarının opaklığı 0 (aynı anda iki gövde çizilmez).
- Durum: `tepki` SharedValue (0 yok, 1 silkele, 2 denge, 3 ohbe) + `tepkiSon` (bitiş zamanı, JS'ten `withDelay(süre, withTiming(0, {duration: 0}))` ile `tepki`yi sıfırlar). Her eşleyici kullandığı SharedValue'ları doğrudan okur (R062).
- Değişmez: fizik, kamera, çarpışma, iniş tespiti, puan; şarj pozlarının sırası/opaklık kuralı (yalnız idle'a "tepki varken 0" çarpanı).

## Kabul ölçütleri
1. tsc (app/src/modules satırlarında yeni hata yok) ve `test_worklet_order_regression.cjs` PASS.
2. Simülatörde (KARGA_TEST benzeri geçici `BEDEN_TEST` bayrağıyla her inişte sırayla 3 poz) üç pozun ekran görüntüsü: ayak tabanları çatı yüzeyinde, idle ile aynı yerde (ayak ortası x farkı ≤ 3 px, ölçülür), baş boyu idle ile aynı (±%3).
3. Şarja başlayınca, havalanınca ya da düşünce tepki pozu aynı karede kaybolur (ekran görüntüsü dizisi); yeniden başlatmada eski tepki görünmez.
4. Yağmur/kış/pijama/özel gün açıkken tepki pozu çıkmaz (kod incelemesi + bir simülatör denemesi: yağmur test düğmesi).
5. Telefonda kullanıcı videosu (asıl ölçüt; duyusal iş — kullanıcı onayı).

## Yetki
Kullanıcı: "Kabul, bağla". Commit+push onaysız. Görsel kullanıcı tarafından görülüp kabul edildi (duyusal iş kuralı karşılandı).

## Uygulama notları (inceleme için)
- Önceki iş commit'li (3580187); fark yalnız bu iş (+ yeni varlıklar `assets/characters/beden/`).
- Geçici `BEDEN_TEST` (her inişte sırayla 3 poz) teslimde false.
- Simülatör (iPhone 17, BEDEN_TEST): silkele ve denge inişte göründü, ayaklar çatı yüzeyinde, baş boyu/konum idle ile aynı (karsilastir-silkele-idle.png, seq-b.jpg, seq-c.jpg); ~0,4–0,8 sn sonra idle'a döndü. Oh be simülatörde yakalanamadı (zıplama duvara çarpıp düştü); aynı kod yolu ve geniş tuval (denge ile aynı) kullanılıyor.
- Sınır: kıyafetler açıkken tepki çıkmaması kodla sağlanıyor; simülatörde yağmur/kış denemesi yapılmadı.
