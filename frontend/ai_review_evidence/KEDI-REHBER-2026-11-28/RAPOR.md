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

## Pozlar oyuna bağlandı (kullanıcı: "Evet, bağla")
- assets/environment/mahalle/tekir-{bekleme,hazir,kalkis,havada,inis}.png: poz sayfasından kesildi (aynı ölçek), takip noktaları alfa taramasıyla (yerde basan patiler, havada gövde ortası). TEKIR_S = 110/359 (bekleme ≈ 110 birim).
- Sıçrayış rehberHop 0→1 (1000 ms): hazırlanma (0–0,18) → kalkış (–0,30) → havada (–0,78) → iniş (–0,90) → oturma. Bekleme pozunda nefes (scaleY %2,5, 1,3 sn).
- İzlenmeyince geri bakma: oturan poz 700 ms sola (amcaya) aynalanır, sonra sıçrar. Kıvılcım'ın 2. pozu (geri bakma) başı geri çevrilmediği için kullanılmadı (kanıt klasöründe tekir-geribak.png).
- Katman: kuleler önünde, karakter arkasında (önceki gibi). Pencere finali hâlâ gri kutu (sarı dikdörtgen).
- Kanıt: sim-kedi-poz.mp4, poz-kareler.jpg (simülatör, otomatik pilot). Telefon: BUILD_TAG "PESIMDEKI KEDI 5 POZ", paket strings = 1, devicectl yükleme başarılı. Telefonda elle oynanmadı.

## Final penceresi (kullanıcı: "sarı pencere o şekilde mi kalacak?" → "Evet, çizdir")
- Kıvılcım 1 çağrı (codex-PENCERE.log): kedi-pencere.png 1024×1536 RGBA (gerçek alfa, %32 şeffaf). Yeşil ahşap cumba, içi sıcak ışıklı, dantel perde, sağda mama kabını bırakan el; pervaz üst yüzeyi ≈ y 975 px (%63,5). İç içe yola kaydetti, oradan alındı.
- Önizleme: pencere-onizleme.jpg (kedi pervazda). Oyuna BAĞLANMADI; kullanıcı kabulü bekleniyor.

## Final penceresi bağlandı (kullanıcı: "Evet, bağla")
- assets/environment/mahalle/kedi-pencere.png (Kıvılcım 1024×1536 → 512×768). Dünya ölçüsü 180×270; görselin üstü kule tepesinin 20 birim altında, kule ortasında. Pervaz üstü %63,5 (975/1536, göz ve önizlemeyle), kedi yeri genişliğin %24,5'i.
- Final: rehberFinal 0→1 (900 ms) — kedi çatıdan pervaza yay çizerek iner (havada pozu), %55 ölçeğe küçülür, pervazda oturma pozuna geçer; pencere belirerek gelir. Sarı dikdörtgen kaldırıldı.
- Hata ve düzeltme: ilk derlemede kedi finalde kayboldu. Sebep: worklet kediDurum(), sonradan tanımlanan PENCERE_* sabitlerini tanımsız yakalıyordu (AI_REVIEW'daki classifyGap sıra hatasıyla aynı sınıf). Sabitler fonksiyonun önüne taşındı; ikinci kayıtta kedi pervazda (final2.jpg, final-yakin.jpg).
- Kanıt: sim-kedi-final.mp4 (simülatör, otomatik pilot). Telefon: BUILD_TAG "PESIMDEKI KEDI + PENCERE", paket strings = 1, "App installed". Telefonda elle oynanmadı.
- Risk: pencere, kulenin kendi cephe çizimlerinin (cumba/kilim) üstüne biniyor; dar kulelerde pencere kuleden geniş görünebilir; kedi finalde küçük (≈60 birim).
