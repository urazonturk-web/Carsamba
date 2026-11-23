# AMCA-DUSUS — düşüş kesinleşince "eyvah" çırpınması (2026-11-23)

## Dosya
`assets/characters/beden/amca-dusus-1.png`, `amca-dusus-2.png` (Kıvılcım, AMCA-DUSUS-preview; kullanıcı kabulü "Kabul, bağla").

## Ölçü/pivot
1100×1103, ölçek charge-000-r12 ile aynı. Pivot (590, 1108): baş hizası ölçümüyle (alfa taraması, ilk 160 satır ağırlık merkezi) charge-000'a göre hizalandı.

## Katman
`ChargePoses.tsx` → `FallLayer` (2 kare). Görünürken şarj/idle ve tepki pozları gizli. Giysi (yağmur, kış, pijama, şemsiye, özel şapka) açıkken çizilmez; kir ve kar engellemez (o sırada leke/kar katmanı görünmez).

## Kural
`dususKesin(vy, ayak, landList)` (character-pose.ts): iniş yolunda vy>0 ve ayak, inişin kullandığı listedeki tüm platform tepelerinin altında → düşüş kesin. Kare 110 ms'de bir değişir. Yeni zıplama ve yeniden başlatmada sıfırlanır. Fizik/kamera/çarpışma/oyun sonu eşiği değişmedi.

## Kanıt
- Simülasyon (`test_dusus_kesin.cjs`, gerçek config/jump/landing/procedural-course/kurukafa): 26 400 uçuş, 13 274 ıskalama, yanlış pozitif 0, tetiklenmeyen ıskalama 0; tetik→oyun sonu medyan 417 ms (%10: 267 ms), ≥220 ms oranı %95,7. PASS.
- tsc yeni hata yok; worklet sıra testi PASS.
- Simülatör (iPhone 17, aşırı şarjlı/kirli + kurukafa açık ıskalama): `sim-dusus-kareler.png` — kare 369'dan itibaren iki çırpınma karesi sırayla görünüyor.
- Telefon: Release kuruldu, paket etiketi "DUSUS EYVAH" doğrulandı. Cihazda his doğrulanmadı (kullanıcı videosu bekleniyor).

## Risk
- Giysili düşüşte eski görünüm sürer (uyumlu görsel ayrı iş).
- Kir/kar katmanı düşüşte görünmez.
- Düşen pozda baş, ayakta duruşa göre biraz daha büyük görünebilir (3/4 açı); telefonda değerlendirilecek.

## Plan incelemesi
Claudex Loop 3 tur (REVISE, REVISE, APPROVED) — PLAN-REVIEW-LOG.md.

## Ek — yağmurluklu düşüş (2026-11-23 akşam)
Kullanıcı (18:44 videosu sonrası): yağmurda da çırpınsın → Kıvılcım 2 görsel (amca-dusus-1/2-yagmur, kabul "Kabul, bağla").
- Dosya: `assets/characters/beden/amca-dusus-1-yagmur.png`, `amca-dusus-2-yagmur.png`; aynı 1100×1103 tuval ve pivot (590, 1108); silüet örtüşmesi eşofmanlı karelerle %89–90 (fark kasket).
- Katman: FallLayer içinde eşofmanlı kare opaklığı 1−yağmur, yağmurluklu kare opaklığı yağmur (kıyafet geçişiyle aynı oranda).
- Kural: yağmur artık düşüşü engellemiyor; kış, pijama, şemsiye ve özel gün şapkası hâlâ engelliyor (şemsiye rüzgârsız yağmurda açılır).
- Kanıt: simülatörde gerçek yağmurlu havada (rüzgârlı, şemsiyesiz) kasıtlı ıskalama → `sim-yagmurda-dusus.png`: yağmurluk ve kasketle iki çırpınma karesi. tsc temiz, worklet sıra testi ve düşüş simülasyonu PASS. Telefonda doğrulanmadı.

## Ek — kışta düşüş (2026-11-23 akşam)
Kıvılcım, kullanıcının sohbette verdiği "diğer hava durumları içinde gerekli düzenlemeler yapılsın" talimatıyla mevcut bere/atkı kaynaklarından 2 kare hazırladı (yeni görsel çağrısı yok); kullanıcı kabulü "Kabul, bağla".
- Dosya: `amca-dusus-1-kis.png`, `amca-dusus-2-kis.png`, 1100×1203 (poz 100 px aşağıda, ponpon kesilmesin). Aynı kutuda üstten −100 px kaydırılarak çizilir (eşdeğer pivot 590, 1208). Hiza: 100 px kaydırılınca eşofmanlı karelerle silüet örtüşmesi %96,4.
- Katman/öncelik: eşofman (1−yağmur)(1−kış), yağmurluk = yağmur, kış = kış·(1−yağmur) — oyundaki gibi yağmur kışın önüne geçer.
- Kural: kış artık düşüşü engellemiyor; pijama, şemsiye ve özel gün şapkası hâlâ engelliyor.
- Kanıt: simülatörde test havası "Karlı, Kış" ile kasıtlı ıskalama → `sim-kista-dusus.png` (bere + atkıyla iki çırpınma karesi). tsc temiz; worklet sıra testi ve düşüş simülasyonu PASS. Telefonda doğrulanmadı.

## Ek — şemsiye, pijama, özel gün (2026-11-23 gece)
Kıvılcım AMCA-DUSUS-DIGER (kullanıcı "Evet, iste" → "Kabul, bağla"):
- Şemsiye: 2 yeni görsel. Kıvılcım'ın çıktısında amca ~%10 küçük ve 110–130 px aşağıdaydı; Claude yağmurluk karelerine göre yeniden ölçekledi (1,11 / 1,06) ve taşıdı (yüz rengi ağırlık merkezi + silüet IoU araması; IoU 0,85 / 0,72), tuval 1100×1603, poz 500 px aşağıda. **Not:** `SEMSIYE_ON = false` (2026-11-17 kullanıcı: şemsiye iptal) — bu kareler şu an oyunda hiç görünmez; şemsiye yeniden açılırsa devreye girer.
- Pijama ve 6 özel gün aksesuarı: yeni görsel yok; `FALL_BOXES` (character-pose.ts) ile düşüş karelerine bindirme (kutu + dönüş). `ozelGun.ts` aksesuarlarına `dusus` anahtarı eklendi. Önizleme: `onizleme-aksesuar.png`.
- Kıyafet önceliği: şemsiye > yağmur > kış > eşofman; pijamada eşofman + gece külahı + terlik; başlığı değiştiren özel gün şapkasında bere/şemsiye kareleri kapanır, yağmurluk kalır (normal pozdaki gibi) ve şapka bindirilir. Ağırlıkların toplamı her köşe durumda 1 (python denetimi).
- Artık hiçbir kıyafet düşüşü engellemiyor.
- Kanıt: simülatörde yılbaşı testi + yağmurda kasıtlı ıskalama → `sim-yilbasi-dusus.png` (şapka düşüş karelerine oturuyor). Bu denemede yağmurluk düşüşte eşofmana dönüyordu; düzeltildi (yağmurluk şapkalı günde de kalır), düzeltme simülatörde yeniden görüntülenmedi. Pijama düşüşü simülatörde denenmedi (yalnız önizleme). tsc temiz, worklet sıra testi PASS. Telefona kuruldu, cihazda doğrulanmadı.
