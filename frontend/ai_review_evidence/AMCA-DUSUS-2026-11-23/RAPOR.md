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
