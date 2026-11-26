# GECIS-VIDEO-2026-11-26 — Teknik / oyun hissi editörü

Yalnız rapor; oyun koduna ve görsellere dokunulmadı. Kanıt şeritleri bu klasörde (60 fps, `eq=gamma=1.4`, amca çevresi kırpılmış, her kare 16,7 ms):
`teknik-kalkis-7.12-60fps.jpg`, `teknik-suzulme-7.40-60fps.jpg`, `teknik-dalis-7.95-60fps.jpg`, `teknik-inis-8.38-60fps.jpg`.

## 1) Videoda sert anlar (7,0–8,5 sn uzun atış; 60 fps'te doğrulandı)

| An | Zaman | Kare | Ne oluyor (kod nedeni) |
|---|---|---|---|
| Kalkış: şarj pozu → fırlama | ≈7,187 sn | kalkis şeridi 4. kare | Çömelmiş şarj pozundan 41° eğik, boylu fırlamaya tek karede. Gövde ekseni 3° → 41° (ölçüm: PNG ana ekseni). Üstüne `ucusEsne` (+%12 boy) ve `kolGecis` darbesi (×0,5 yön = +4,5°) biner. |
| Fırlama → süzülme | ≈7,483 sn | suzulme şeridi 5. kare | Baş yerinde (pivot yüzden eşlenmiş), ama kol/bacak tamamen değişiyor. Aynı karede `ARA_KARE_EGIM` çarpanı 0,35 → 1'e sıçradığı için yörünge eğimi de ~+4° tek karede atlıyor (`charOpStyle`). Ardından +9° darbe + %10 esneme 3–4 kare görünüyor. |
| Süzülme → dalış | ≈8,117 sn | dalis şeridi 10. kare | Silüet yatık "koşan" pozdan top hâline; baş ~30 video px aşağı iniyor. Aynı karede: çarpan 1 → 0,35 (~2,5° atlama), `SUZUL_DALGA` sinüsü kesiliyor (bu atışta süzülme 0,63 sn = 1,14 döngü → ~2,7° dönme ve ~%2,3 boy atlaması). Yani resim değişimine iki küçük dönüşüm sıçraması daha ekleniyor. |
| Dalış → duruş (EN SERT) | ≈8,447 sn | inis şeridi 4. kare | Temas karesinde dalış silüetinin en alt pikseli çatının belirgin üstünde; bir sonraki karede dimdik charge-000 ayakları çatıda. Neden: dalış pivotY 1315 > kutu boyu 1204 → çizimin altı ile fiziksel ayak noktası arasında ~190 sprite px boşluk; temas anında amca aşağı "ışınlanıyor". Ara çömelme yok; yalnız `landPulse` tüm resmi %14 basıyor (4–5 kare). |
| Düşüş | 61,0–62,9 sn | ziplama-61.jpg 3.–5. satır | Dalış ekrandan çıkana kadar kalıyor; çırpınma kareleri hiç görünmüyor. Neden: `dususKesin` ayağın listedeki EN ALÇAK kule tepesinin de altına inmesini bekliyor; o an amca zaten ekran dışında. |

Not: `kolDurumu` eşikleri r = vy/vy0'a bağlı, r uçuşta tekdüze artıyor → videoda ileri-geri titreme (flicker) YOK. Sertlik titremeden değil, tek karede silüet + dönüşüm sıçramasından.

## 2) Öneriler

Maliyet: "kod" = tahmini iş saati; "çizim" = yeni Kıvılcım görseli (her biri ayrı onay). Performans: kare başına mevcut 17 poz katmanının stil worklet'leri zaten her karede (px/py değiştiği için) çalışıyor; birkaç ek sayı okuması ölçülemeyecek kadar küçük. Asıl maliyet aynı anda çizilen gövde sayısı (hale açık: gövde başına 5 resim).

### Ö1 — İnişe çömelme karesi (mevcut charge-037/025/012) — **1 numara**
- **Ne:** Temas anında `inisCok` adlı yeni SharedValue = 0,375 (sert inişte 0,5, kısa hopta 0,25), sonra `withTiming(0, 160 ms, Easing.out)`. `poseCharge` (app/index.tsx ~3312): `phase === IDLE && inisCok > 0` iken `Math.max(charge.value, inisCok.value)` döndür. Poz nicemlemesi (`poseOpacity`) 037 → 025 → 012 → 000'ı ~40 ms arayla sırayla gösterir; bu kareler zaten baş/ayak pikselleri ortak, "sürekli hareket" olarak tasarlanmış.
- Tetik: iniş temas bloğu (`landPulse.value = withSequence(...)`, ~3058) ile aynı yer; `sert` değeri hazır.
- Engeller: (a) `kolDurumu` kenara inişte hemen 1 (denge) döndürüyor → `inisCok > 0` iken 0 döndürsün (kenar dengesi 160 ms sonra başlar); (b) tepki pozu (`tepki.value = k`, ~2058) iniş anında bütün şarj pozlarını gizliyor → tepkiyi `withDelay(140, …)` ile çömelmeden sonra başlat (tepkiP de aynı gecikme).
- **Neden yumuşatır:** top hâlinden dimdik duruşa giden 1 karelik sıçrama, "dizler bükük → doğrulma" zincirine döner; göz ayağın yükü aldığını görür. `landPulse` ezmesi bunun üstünde kalabilir (ya da 0,14 → 0,08'e indirilir, yoksa çift ezme olur).
- **Maliyet:** kod ~1,5 sa; çizim 0; performans 0 (her an tek gövde). **Risk:** düşük. Hemen yeniden şarj edilirse `charge.value` zaten büyüyeceği için `max` doğal geçer.

### Ö2 — Dalışta pivotu r'ye bağlı kaydır (inişteki "ışınlanma")
- **Ne:** Dalış (k6) pivotu yüze göre seçili; bu yüzden çizimin altı ayaktan ~190 sprite px yukarıda. `ReactionLayer` (ChargePoses.tsx) k === 6 için `translateY`'ye `+ dalisKay * scale` ekle; `dalisKay = clamp((r − 0,4)/0,6, 0, 1) × ~170`. Girişte (r = 0,4) 0 → baş süzülmeyle aynı yerde; r ≈ 1'de (kalkış yüksekliği, tipik temas) dizler ayak çizgisinde. r'yi ReactionLayer'da hesaplamak için `vy` ve `ucusV0` prop olarak geçmeli (R062 kuralı: her worklet kendi okusun).
- **Neden:** temas karesindeki ~13 pt'lik aşağı sıçrama kaybolur; Ö1 ile birlikte dalış → çömelme neredeyse aynı yükseklikte olur.
- **Maliyet:** kod ~1 sa; performans 0. **Risk:** dalış boyunca amca yörüngeye göre biraz aşağı "sarkar" (yaklaşık 4–5 px/kare); 170 değeri cihazda göz kararı ayarlanmalı.

### Ö3 — Dönüşüm sıçramalarını sıfırla (ucuz, hemen)
- **ARA_KARE_EGIM çarpanı:** `charOpStyle`'daki `ucusKol.value >= 3 ? 0,35 : 1` anlık. Yerine frame callback'te (~2865, `ucusAci` yanına) `araKareSV += (hedef − araKareSV)·min(1, dt·15)`; `charOpStyle` bunu okur.
- **Süzülme dalgası:** `dalga`'yı bir zarfla çarp: `suzZarf += ((kd===2?1:0) − suzZarf)·min(1, dt·10)` (~100 ms). Dalga girişte zaten 0'dan başlıyor; çıkışta kesilmek yerine söner.
- **Maliyet:** kod ~0,5 sa; performans 0. **Risk:** yok. Tek başına süzülme→dalışta ~3° + %2 sıçramayı kaldırır.

### Ö4 — Gövde açısı telafisi (çizimler arası eğim farkını dönmeyle köprüle)
- **Ne:** `hareket.ts`'e poz başına çizim gövde açısı tablosu: `GOVDE_ACI = [0: 3, 1: 3, 2: ?, 3: 41, 4: ?]` (charge/denge ≈ 3°, fırlama ≈ 41° — PNG ana ekseninden ölçtüm; süzülme ve dalış kol/bacak açık olduğu için ana eksen güvenilmez, baş merkezi → kalça merkezi elle ölçülmeli). Poz değişiminde (frame callback, `kd !== kolOnceki.value` bloğu ~2876): `telafi = GOVDE_ACI[eski] − GOVDE_ACI[yeni]` (±25° ile sınırla), sonra `telafi *= exp(−dt·12)` (~85 ms zaman sabiti, ~200 ms'de biter). Bugünkü sabit 9° × `kolYon` darbesinin YERİNE geçer (darbe bilinmeyen yönde dönüyor; telafi ise yeni pozu eski gövde ekseniyle başlatıp kendi eksenine döndürür).
- **Önemli — pivot:** `charOpStyle` tüm dönmeyi AYAK noktası etrafında yapıyor. Uçuş pozlarında yüz, ayak noktasının ~838 sprite px üstünde → 20° dönme başı ~290 sprite px savurur (bu da bugünkü 9° darbenin ve %10 esnemenin başı oynatmasının nedeni). Telafi ve geçiş esnemesi uçuşta YÜZ noktası etrafında yapılmalı: dönüşüm dizisine ayrı bir üçlü ekle `translate(fx+77s, fy−838s) · rotate(telafi) · scale(gecisEsne) · translate(geri)`. Mevcut yörünge eğimi ayakta kalabilir (inişte 0'a dönüyor, iniş yeri kaymaz).
- **Neden:** silüetin en çok göze batan kısmı gövde açısı; baş ve gövde ekseni sürekli kalınca yalnız kol/bacak değişir — bu, animasyonda "smear" etkisine en yakın ucuz çözüm.
- **Maliyet:** kod ~2–3 sa (açı ölçümü dahil); performans 0 (aynı View'a 3 dönüşüm girdisi). **Risk:** orta: dalış "top" pozu için açı tanımı yoruma açık; yanlış işaretli telafi geçişi kötüleştirir — her geçiş 60 fps kayıtla kontrol edilmeli.

### Ö5 — Kısa çapraz geçiş (80–110 ms), hayalet görüntüsüz
- **Ne:** Yalnız uçuş içi geçişlerde (kalkış şarj→fırlama, fırlama→süzülme, süzülme→dalış). Yeni SharedValue'lar `kolEski` (önceki durum) ve `gecisT` (0→1, 90 ms; frame callback'te `gecisT += dt/0,09`). **Tek katman yarı saydam kuralı:** iki gövdeden hangisi z-sırasında üstteyse yalnız o soluyor; alttaki geçiş boyunca tam opak kalıyor:
  - yeni üstteyse: yeni 0→1, eski 1 (sonra kesilir);
  - eski üstteyse: eski 1→0, yeni baştan 1.
  Z-sırası sabit (PoseLayer'lar < k4 süzülme < k5 fırlama < k6 dalış), yani hangisinin üstte olduğu kod sabitidir. Böylece arka plan gövdenin içinden hiç görünmez, "iki yarı saydam amca" oluşmaz; hayalet yalnız eski silüetin yeninin dışına taşan kısmında ve ≤ 90 ms. Kural şöyle güncellenir: "iki gövde aynı anda en çok 90 ms, yalnız biri yarı saydam, yalnız uçuşta; yerde ve inişte asla".
  - Uygulama yeri: `ReactionLayer` opaklığı (`on ? 1 : 0` → yukarıdaki kural); `PoseLayer`'da `hideAll` içindeki `kolAcik`, kalkış geçişi süresince eski şarj pozunu gizlememeli. Her iki stile `kolEski`, `gecisT` prop'u.
  - Ö4 ile birlikte: eski pozun da aynı yüz-pivot telafisini alması gerekmez (zaten ≤ 90 ms).
- **Hale sorunu:** üstteki katman yarı saydamken kendi 4 hale kopyası alttaki gövdenin üstünde soluk beyaz kontur olarak görünür. iOS'ta UIView grup opaklığı (varsayılan açık) Animated.View'ı tek parça soldurursa bu olmaz ama o katman için ekran dışı (offscreen) çizim pası doğurur. Cihazda doğrulanmalı.
- **Maliyet:** kod ~3–4 sa; performans: geçiş başına ~5–6 karede gövde sayısı 1 → 2 (hale ile 5 → 10 resim) + muhtemelen 1 offscreen pas; uzun atışta 3 geçiş ≈ 0,3 sn/atış. Kare kaybı zaten %19–22 olduğundan ölçmeden açılmamalı (`pHitchBig` sayacıyla önce/sonra). **Risk:** orta-yüksek (performans + eski kural). Bu yüzden Ö1–Ö4'ten SONRA, yalnız hâlâ sert bulunursa ve bayrakla (`GECIS_KARISIM_ON`).

### Ö6 — En kısa tutma süresi / histerezis
- **Ne:** `kolDurumu` saf fonksiyon kalsın; frame callback'te (~2875) `kd !== kolOnceki` ise ve önceki duruma geçeli < 110 ms olduysa değişimi ertele (`kolSure` SharedValue). `ucusKol` derived değeri de aynı tutulmuş durumu okumalı (şu an `kolDurumu`'nu ayrıca çağırıyor → çizim ve darbe iki ayrı kaynaktan; tek kaynakta birleştir: frame callback `kolOnceki`'yi yazar, `ucusKol` onu okur).
- **Neden:** normal yörüngede titreme yok, ama kısa (c ≈ 0,4) uzun atışta fırlama penceresi çok kısalabiliyor ve kenar/iniş anında 0↔1 hızlı gidip gelebilir; tutma süresi bunu güvenceye alır. Histerezis bandı (±0,05 r) gereksiz, r tekdüze.
- **Maliyet:** kod ~1 sa; performans 0. **Risk:** düşük; ama iniş/düşüş anında tutma uygulanmamalı (`phase` değişince anında geç).

### Ö7 — Düşüşte dalış ekrandan çıkana kadar kalmasın
- **Ne:** `kolDurumu`'ya: uzun atışta `r ≥ 1,3` (kalkış yüksekliğinin ~%70 jump-boyu altına inmiş) ise dalış yerine 1 (kollar açık denge = "eyvah") döndür. Daha doğru seçenek: `dususKesin` yerine "önümdeki ilk kulenin tepesinin altındayım ve o kulenin x aralığını henüz geçmedim" kontrolü (yalnız okuma, çizim tarafı) → mevcut çırpınma kareleri (FALL_POSES) ekranda görünür hâle gelir.
- **Neden:** oyuncu başarısızlığı amcanın beden diliyle görür; "top hâlinde suya inen amca" tuhaf duruyor.
- **Maliyet:** basit eşik ~0,5 sa; ileri kontrol ~2 sa (kule listesi okuma, worklet). Performans 0. **Risk:** basit eşikte, daha alçak bir kuleye isabetli inişte son anda denge pozu görülür (zararsız, Ö1 çömelmesi yine çalışır).

### Yeni çizim (isteğe bağlı, ayrı onay)
- **0 zorunlu.** İsteğe bağlı **1**: "dalıştan açılma" (dizler göğüsten inmeye başlamış, ayaklar aşağı uzanmış) — dalışın son ~%30'unda (r ≳ 0,8) gösterilir; Ö2'nin pivot kaydırmasını gereksiz kılar ve inişi gerçek anticipation ile bağlar. Ancak Ö1+Ö2 denenmeden istenmemeli.

## 3) 1 numaralı önerim
**Ö1 + Ö3 birlikte (≈2 sa, sıfır performans maliyeti, yeni çizim yok):** inişe mevcut charge-037/025/012 kareleriyle 160 ms'lik çömelme zinciri ekle (tepkiyi 140 ms geciktir) ve aynı turda ARA_KARE çarpanı ile süzülme dalgasını yumuşat. En sert an (dalış → duruş) hemen düzelir, havadaki geçişlerdeki görünmez ek sıçramalar kalkar. Ardından Ö2 ve Ö4; çapraz geçiş (Ö5) en son, bayraklı ve ölçümlü.
