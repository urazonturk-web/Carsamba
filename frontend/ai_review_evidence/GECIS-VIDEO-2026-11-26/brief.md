# GECIS-VIDEO-2026-11-26 — Zıplama poz geçişleri "sert" (kullanıcı videosu 19:57)

Kullanıcı: "videoyu tüm editörler incelesin, zıplarken hareketlerin geçişleri bana biraz sert geldi, daha yumuşak geçişler olabilir; değerlendirip rapor sunun." Bu tur YALNIZ RAPOR: oyun koduna, görsellere dokunma; yeni görsel üretme.

## Kaynaklar
- Video: /Users/bekirurazonturk/Downloads/ScreenRecording_11-26-2026 19-57-42_1.MP4 (1320×2868, 60 fps, 137 sn; telefon, sürüm "FIRLAMA + DALIS"). ffmpeg ile istediğin anı çıkarabilirsin (görüntü koyu; `eq=gamma=1.4` iyi geliyor).
- Hazır kareler: genel-1fps.jpg (tüm video), ziplama-7.jpg (7.0–9.4 sn, 20 kare/sn, başarılı uzun atış), ziplama-61.jpg (61.0–63.4 sn, uzun atış + düşüş).
- Kod: src/game/hareket.ts (kolDurumu, GECIS_*, SUZUL_*), src/game/ChargePoses.tsx (PoseLayer, ReactionLayer: pozlar opaklık 0/1 ile anında değişir), src/game/character-pose.ts (REACTION_POSES k4 süzülme, k5 fırlama, k6 dalış), app/index.tsx (kolGecis darbesi ~satır 2875; charOpStyle ~satır 3410).
- Görseller: assets/characters/beden/amca-ucus-{firlama,suzulme,dalis}.png, charge-*.png, amca-denge.png.

## Şu anki akış (uzun atış, bırakılan şarj ≥ 0,4; r = vy/vy0)
duruş/şarj pozu → (kalkış) fırlama [r ≤ −0,55] → süzülme [−0,55 < r < 0,4] → dalış [r ≥ 0,4] → (temas) iniş tepkisi/duruş. Her değişimde tek karede resim değişir; üstüne 9°'lik dönme + %10 esneme darbesi (sönüm 9/sn) biner. Kısa atışta: şarj pozu → kollar açık denge → şarj pozu.

## İlk gözlem (ana oturum, ziplama-7.jpg)
1. Kalkış: duruştan fırlamaya 1 karede.
2. Fırlama → süzülme ve süzülme → dalış: silüet 1 karede değişiyor (gövde açısı, kol/bacak tamamen farklı).
3. Dalış → iniş: dizleri göğsünde top gibi pozdan dimdik duruşa 1 karede; arada çömelme/yaylanma yok. Muhtemelen en sert an.
4. Düşüşte (ziplama-61) dalış pozu ekrandan çıkana kadar kalıyor.

## Kurallar
Zıplama fiziği, kamera, çarpışma, puan değişmez (yalnız çizim). Yeni Kıvılcım çizimi önerebilirsin ama her çizim ayrı onay ister; sayısını ve gerekçesini yaz. Performans: takılma zaten %19–22 kare kaybı; iki katmanı üst üste çizen (çapraz geçiş) çözümlerin maliyetini düşün. Daha önce "iki gövde aynı anda görünmesin" kuralı vardı (hayalet görüntü); çapraz geçiş önerirsen bunu nasıl çözdüğünü söyle. Arapça ünlem/dini motif yok.

## Çıktı
Bu klasöre kendi dosyan (editor-<rol>.md): 1) videoda gördüğün sert anlar (zaman damgası, kanıt kare), 2) öneriler: her biri için ne, neden yumuşatır, maliyet (kod saat / yeni çizim sayısı), risk, 3) senin 1 numaralı önerin. Türkçe, kısa ve somut.
