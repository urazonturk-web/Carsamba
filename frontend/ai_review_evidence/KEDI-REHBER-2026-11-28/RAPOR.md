# PEŞİMDEKİ KEDİ — gri kutu (2026-11-28)
Kullanıcı: "peşimdeki kedi ile devam edelim" (anket: Kedi 17, Veresiye 15, Simit 10).

## Ne yapıldı
- `src/game/rehber.ts` (yeni): tekir kedi amcanın **iki kule ilerisinde** bekler. Kedinin kulesine tek zıplayışta (aradakini atlayarak) inmek = **izlemek**. Kolay yol bir sonraki kule; cezası yok.
- Adillik: kedi yalnız VAR OLAN kuleleri seçer; gerçek fizikle (jump.ts advanceFlight/jumpVelocity + landing.ts findFootLanding) o kuleye inen basış aralığı en az %5 (REHBER_PENCERE_MIN) değilse bir sonraki kulede bekler.
- 4 izleme (REHBER_N) → kedi cephedeki **ışıklı pencereye** iner, toast "Tekir seni ışıklı bir pencereye getirdi. 'Demek buraya...'". Her izlemede "Tekir'i izliyorsun n/4".
- app/index.tsx: kedi + pencere çizimi (kuleler önünde, karakter arkasında), onLanding tepkisi, koşu başı/menü "Oyna" yerleştirmesi. Kedi görseli mevcut `kedi-tekir-oturan.png` (yeni görsel yok).
- DEĞİŞMEDİ: fizik, kamera, kule üretimi, puan kuralı (iki kule atlayınca gelen +4 zaten var olan çoklu kule bonusu).
- REHBER_OTO: yalnız kanıt videosu için otomatik pilot; telefona giden sürümde false.

## Kanıt
- Simülasyon sonucu (sim_rehber.cjs, 40 tohum × 43 kule × 3 ayak konumu, gerçek kod): 
  - W=393: N+1 basış penceresi medyan %16,0; N+2 medyan %11,5; kedi iki ileri gider %97,2; seçilen hedefe hiç basışın inmediği durum 0.
  - W=440: N+1 medyan %15,0; N+2 medyan %11,0; iki ileri %99,7; seçilen hedefe inmeyen 0.
  - Okuma: kediyi izlemek normal zıplayıştan ~%30 daha dar pencere ister (gerçek ama adil risk).
- Simülatör videosu (sim-kedi.mp4, otomatik pilot): başlangıçta kedi görünür → 1 güvenli zıplayış (kedi ileri sıçrar) → 4 izleme (1/4…4/4, her biri +4) → pencere finali. kareler.jpg, final.jpg.
- Telefonda elle oynanmadı (cihaz onayı değil).

## Riskler
- Kurukafa "DAR kuleler" etkisi sürerken adillik denetimi daraltılmamış genişlikle yapılıyor; o sırada kedinin kulesi beklenenden zor olabilir.
- Final penceresi gri kutu (sarı dikdörtgen); cephedeki pencere/komşu çizimlerinin üstüne binebilir.
- Kedi "Sen nereye?" tepkisi yok (balon sistemi kapalı); izlemeyince yalnız ileri sıçrar.

## Kedi pozları (2026-11-28, kullanıcı: "kedinin vücudu hiç hareket etmiyor ... bunlar çizilmeli")
- Kıvılcım 1 çağrı (codex-POZ.log): kedi-pozlar.png 1536×1024, 3×2: bekleme, geri bakma, hazırlanma / kalkış, havada, iniş. Sağa bakan yan görünüş.
- Görselde dama arka plan "boyanmış" geldi (alfa yok); kenardan taşma doldurmayla temizlendi → kedi-pozlar-seffaf.png (piksellerin %77'si şeffaf). Önizleme: kedi-pozlar-onizleme.jpg.
- Not: 2. poz (geri bakma) başı tam geriye çevrik değil, öne-yukarı bakıyor.
- Oyuna BAĞLANMADI; kullanıcı kabulü bekleniyor.
