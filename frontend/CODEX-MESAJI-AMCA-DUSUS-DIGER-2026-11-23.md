Kıvılcım için — AMCA-DUSUS-DIGER-2026-11-23: düşüş "eyvah" karelerinin şemsiye, pijama ve özel gün hâlleri (Byzantion)

Kullanıcı onayı: "Evet, iste" (2026-11-23) — pijama, şemsiye ve özel gün şapkası için de düşüş kareleri.
Bağlam: düşüş kareleri (beden/amca-dusus-1/2.png, 1100×1103, pivot 590,1108) normal, yağmur ve kış hâlleriyle oyunda. Şu üç durumda amca hâlâ eski duruşla düşüyor.

## A) Şemsiye — 2 YENİ görsel (görsel üretim çağrısı onaylı)
Rüzgârsız yağmurda amca şemsiyeyle oynuyor (şemsiye oyunda kodla çiziliyor: kumaş lacivert #24304f, açık şerit #3d4d78, kontur koyu kahve #3a2414, ahşap sap #8a5a2b, kıvrık sap). Yağmurlu havada amca yağmurluk + kasket giyiyor (yagmur/charge-000-yagmur.png, yagmur/yagmur-kasket.png).
1. amca-dusus-1-semsiye.png — amca-dusus-1-yagmur ile AYNI poz/hiza (yağmurluk + kasket), bir eliyle sapı tutuyor, şemsiye rüzgârda TERS dönmüş (kumaş yukarı kıvrık), panik.
2. amca-dusus-2-semsiye.png — amca-dusus-2-yagmur ile aynı poz/hiza, şemsiye öbür açıda ters/çırpınıyor.
Tuval: şemsiye başın üstüne taşacağı için 1100×1403; amcanın pozu amca-dusus-{1,2}-yagmur ile birebir aynı ama 300 px AŞAĞIDA (eşdeğer pivot 590, 1408). Kesilme yok. Şeffaf PNG, yazı/damla/gölge yok.

## B) Pijama ve özel gün — YENİ GÖRSEL YOK, yalnız yerleşim kutuları
Oyunda bunlar gövdenin ÜSTÜNE ayrı PNG olarak çiziliyor; aynısını düşüş karelerine de uygulayacağız. Her biri için amca-dusus-1.png ve amca-dusus-2.png tuval koordinatında (1100×1103) kutu ver: { x, y, w, h, rot } (rot derece, kutu merkezine göre; başın eğimine uysun).
- Gece külahı: assets/characters/pijama/gece-kulahi.png (ayakta pozdaki kutu: HAT_BOX x −50, y −75, w 530, h 454; 516 px tuvalde).
- Terlik: assets/characters/pijama/terlik.png — iki ayakkabının üstüne birer kutu (sol, sağ).
- Özel gün aksesuarları (assets/characters/ozel/): ozel-yilbasi-sapka.png, ozel-cadilar-sapka.png, ozel-paskalya-kulak.png, ozel-bahar-tac.png, ozel-23nisan-sapka.png, ozel-sevgili-gozluk.png (gözlük gözlerin üstüne). Ayakta pozdaki kutular src/game/ozelGun.ts ve src/game/pijama.ts içinde.
Kutular tuval dışına taşabilir (negatif y gibi). Her aksesuar × 2 kare için kutuyu gerçek PNG'yi bindirip görerek doğrula.

Çıktılar (~/Documents/Codex/2026-09-09/referenced-chatgpt-conversation-this-is-an/shared/AMCA-DUSUS-DIGER-preview/):
- amca-dusus-1-semsiye.png, amca-dusus-2-semsiye.png
- dusus-kutulari.json: { "kare1": { "gece-kulahi": {x,y,w,h,rot}, "terlik-sol": …, "terlik-sag": …, "yilbasi": …, "cadilar": …, "paskalya": …, "bahar": …, "23nisan": …, "sevgili-gozluk": … }, "kare2": { … } }
- onizleme-semsiye.png (iki şemsiye karesi + yağmurluk kareleri yan yana)
- onizleme-aksesuar.png (her aksesuar iki kareye bindirilmiş, ızgara)

Kurallar: yeni görsel yalnız A'daki 2 tane; fazlası gerekirse önce sor. Oyuna bağlama Claude Code'da; kullanıcı kabul etmeden oyuna girmez. Amcanın kimliğini değiştirme.
