# PLAN — Kargalarda döngü hissini kırmak + amca tepki pozuna küçük canlılık (2026-11-23)

## İstek (video 13:56)
"kargaların hareketleri çok tek düze olmuş loopa düşüyor gibi onu düzeltelim. amcanın hareketleri fena değil ama daha iyi olabilir."

## Teşhis (kod)
1. Duran kargalar: `kargaDurus(t, seed)` sabit dönemli (3–9 sn) bir pencere → her karga aynı aralıkla başını çevirir; göz bunu döngü olarak algılar. Yalnız 2 durum (tünemiş/bakış).
2. Kaçış zinciri: kaçan karga çoğunlukla 2–5 kule ileri konar; amca oraya varınca yine kaçar → aynı karga sürekli önden kaçıp konuyor (kovalamaca döngüsü). Yeni gelenler de aynı aralığa konuyor.

## Yaklaşım (yalnız görsel; fizik/kamera/çarpışma/kule değişmez)
### A) Duran kargalar — düzensiz, çok durumlu bekleme (kule ve havuz kargaları)
`kargaBekle(t, seed)` (karga.ts, worklet) zamanı 750 ms'lik dilimlere böler; her dilimin durumu `hash(seed, dilim)` ile **bağımsız** seçilir (periyot yok, önceki dilime bakılmaz; ara sıra aynı durumun üst üste gelmesi doğal kabul edilir): %65 tünemiş, %20 bakış (baş dönüşü), %15 yem (karga-yem pozu: eğilip saksı/pervaz yoklar). Sekme **yok** (kTick 250 ms ile yumuşak çizilemez, sıçrama gibi görünürdü). Gövde yönü: amcaya dönük (mevcut kural), bakışta aynalanmaz.
Kule kargası katmanı: mevcut tünemiş + bakış'a **yem** katmanı eklenir (kule başına 2 ek görünüm; eşleyici yine yalnız kTick/kGone/kAmcaX/houseGeom değişince koşar). Havuz: 8 slot × 3 → 8 × 4 (yem eklenir).
### B) Kaçış zincirini kırmak (havuz girdisine `kac` sayacı)
- Havuz girdisine kaç kez kaçtığı (`kac`) yazılır; ilk kaçış 1.
- Yeniden kaçan (kac ≥ 1) karga için hedef dağılımı: %35 gider (ekran dışı), %35 geri (2–4 kule geride), %30 ileri ama **uzak** (6–9 kule) — böylece amca hemen yetişemez. kac ≥ 2 ise %70 gider, %30 geri.
- İlk kaçış (kule kargası) dağılımı: %55 ileri 2–5, %20 ileri 6–9, %15 geri, %10 gider.
- Yeni gelen olasılığı %15 → %10 ve en az 8 sn arayla (JS saati).
- Yedek sırası ve "gider yalnız seçimle ya da kapasiteyle" kuralı, tünek çakışmasız seçim ve uçan slotu kullanmama kuralları aynen kalır.
### C) Amca tepki pozuna küçük canlılık
Tepki pozu görünür olduğu ilk 180 ms'te küçük "yerleşme": sy = 0,94→1,0, sx = 1,04→1,0 (çömelmeden çıkış hissi); `tepki` başladığı an JS'ten `tepkiP` SharedValue'su 0→1 withTiming(180). **Ayak tabanı sabit:** React Native ölçeği görünümün merkezine göre uygular; ayak noktası (pivotX, pivotY) merkezden (pivotX − w/2, pivotY − h/2) uzakta olduğundan ölçek onu (pivotX − w/2)·scale·(sx−1) ve (pivotY − h/2)·scale·(sy−1) kadar kaydırır. Telafi **tek formüldür**: ReactionLayer'da birleşik ölçek SX = sx, SY = sq·sy (sq = mevcut landPulse sıkışması) kullanılır ve kayma yalnız bir kez, translateX −= (pivotX − w/2)·scale·(SX−1), translateY −= (pivotY − h/2)·scale·(SY−1) olarak çıkarılır; ReactionLayer'da ayrı extraY eklenmez (pivotY = h olduğundan bu formül sx=sy=1 iken eski extraY = h·scale·(1−sq)/2 ile birebir aynıdır). Şarj pozlarının (PoseLayer) mevcut extraY yolu değişmez. Her üç poz için ayak noktasının ekran koordinatının sx/sy değişirken sabit kaldığı node'da formülle doğrulanır (test_tepki_pivot.cjs: 3 poz × 5 yerleşme adımı × 3 landPulse değeri (sq 1, 0,92, 0,85) eşzamanlı; sapma < 0,01 birim; sx=sy=1 iken eski extraY ile eşitlik). Görünürlük kuralı değişmez. Yeni görsel yok.

## Kabul ölçütleri
1. tsc (yeni hata yok), `test_worklet_order_regression.cjs` PASS.
2. Node testi (`test_karga_bekle.cjs`, gerçek karga.ts): 10 000 dilimde durum oranları hedefin ±3 puanında; 4 sn+ sabit periyot yok (otokorelasyon tepe < 0,15); iki farklı tohumda aynı anda aynı özel durum oranı, bağımsızlık beklentisinin (0,20²+0,15²≈%6,3) ±2 puanında.
3. Kaçış dağılımı için JS fonksiyonu ayrı (`kargaHedefTuru(kac, r)`), node testinde oranlar ±3 puan.
4. Simülatör (KARGA_TEST): duran kargalarda yem ve bakış farklı zamanlarda gözlenir; ekran görüntüsü.
5. Telefonda kullanıcı videosu.

## Yetki
Kullanıcı isteği; commit+push onaysız. Claudex Loop.
