# KARGA-DONGU + amca yerleşme — 2026-11-23

İstek (video 13:56): kargalar tek düze / döngüye düşmüş gibi; amca hareketleri daha iyi olabilir.

## Yapılanlar
- `kargaBekle` (karga.ts): 750 ms dilimler, periyotsuz bağımsız durum: %65 tünemiş, %20 bakış, %15 yem. Kule ve havuz kargalarına yem pozu eklendi (havuz 8×4, kule 2×3 görünüm). Eski sabit dönemli `kargaDurus` artık kullanılmıyor.
- `kargaHedefTuru(kac, r)`: ilk kaçış %55 ileri 2–5 / %20 ileri 6–9 / %15 geri / %10 gider; yeniden kaçan %35 gider / %35 geri / %30 uzak; 2+ kez kaçan %70 gider / %30 geri. Yeni gelen %15 → %10, en az 8 sn arayla.
- Amca tepki pozu: ilk 180 ms yerleşme (sy 0,94→1, sx 1,04→1), ayak noktası `reactionPivotFix` ile tek formülde sabit (landPulse dahil).

## Kanıt
- Ölçüm/simülasyon: `test_karga_dongu.cjs` PASS (oranlar ±3 puan, otokorelasyon tepe 0,029, tohumlar arası %6,0 / beklenti %6,3, kaçış oranları, ayak sapması 1e-14, eski extraY ile eşitlik).
- tsc yeni hata yok; `test_worklet_order_regression.cjs` PASS.
- Simülatör (KARGA_TEST, iPhone 17): `sim-karga-16kare.png` — kargalar farklı anlarda yem/bakış/tünemiş; test kaçışı ve yeniden konma çalışıyor.
- Telefon: Release kuruldu, paket etiketi "KARGA DONGU + YERLESME" doğrulandı. Kullanıcı videosu bekleniyor (cihazda his doğrulanmadı).

## Plan incelemesi
Claudex Loop: 3 tur (REVISE, REVISE, APPROVED) — PLAN-REVIEW-LOG.md.

## Açık
- Düşüş "eyvah" pozu: yeni görsel gerekiyor (Kıvılcım onayı bekleniyor).
- Takılma: ölçüm 4 videoda sabit ~%12–15 donuk kare; son sürümlerle gelmedi. Ayrı profil işi önerilir.
