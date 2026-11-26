# HAREKET-2026-11-26 — Teknik editör (React Native + Reanimated) değerlendirmesi

Hiçbir kod dosyası değiştirilmedi. Satır numaraları 26 Kas `main` (f6f34d8) içindir.

## 1. Uçuşta eğilme/dönme/esneme: nereye, nasıl (yalnız görsel)
- **Hazır kaynak var, kullanılmıyor:** `headTilt`/`headVelocity` (app/index.tsx:1391, sönümlü yay 2760-2768, ±12°). Kalkışta `-65 - c*55` ile (2644), inişte `45 + |vy|*0.06` ile (2889) itiliyor, ama hiçbir stil okumuyor. Fizik dışında, her karede zaten hesaplanıyor. Sıfır ek maliyetle "kalkış silkinmesi + iniş sallanması" verir.
- **Yörünge eğimi:** `vx` uçuşta sabit (advanceFlight yalnız `vy`'yi değiştiriyor, src/game/jump.ts:30-34), `vy` artıyor. Açıyı şöyle türet: `θ = clamp(atan2(vy, vx)·k, -14°, +14°) · min(1, vx/vxRef)`. Aynı kulede kısa sekmede vx küçük kalır, bu çarpan dik dönmeyi önler. Kalkış ve yükselişte geriye yaslanır, tepede düzleşir, düşüşte öne eğilir.
- **Yer: tek sarmalayıcı.** Bunu PoseLayer'ın içine değil, `<ChargePoses>`'ı saran `Animated.View`'e koy (app/index.tsx:3893, şu an yalnız `charOpStyle` var). Yeni ve ayrı bir sarmalayıcı açmak daha temiz olur. Tek mapper ve tek stil yeter. Bütün şarj, tepki ve düşüş pozları, 4 hale kopyası ve kıyafetler (alt görünüm oldukları için) kendiliğinden döner. Her katmana rotate eklemek ~14 katman × ayrı updater demek: gereksiz.
- **Pivot = ayak noktası:** dünya koordinatında `(px + SOLE_CENTER_OFFSET + ANCHOR_SHIFT_PX*SPRITE_SCALE, py + PH/2)`, yani ChargePoses'a verilen `feetCenterOffset`/`feetHalf` ile aynı nokta. Sarmalayıcı (0,0)'da ve 0×0 olduğu için şu sıra gerekir: `translateX(pivX), translateY(pivY), rotate(θ), translateX(-pivX), translateY(-pivY)`. Bu durumda `transformOrigin` gerekmez. Ayak noktası dönmeyle hiç kaymaz. İniş anında θ sıfır olmasa bile ayaklar çatı çizgisinde kalır, landPulse'ın ayak pivotu (ChargePoses.tsx:92-96) bozulmaz.
- **Gövde merkezli takla isteniyorsa** pivot `feetY - FART_CHAR_H*0.45` olmalı ve dönüş yalnız yükseliş/tepe evresinde bitmeli. `vy > 0`'dan sonra θ ayak pivotlu eğilmeye geri dönmeli. Aksi hâlde inişte ayak çizgisi görsel olarak çatıdan kopar.
- **İnişte sıfırlama:** temas karesinde (2879 civarı) `phase` IDLE'a geçer. Stil `phase !== AIRBORNE` iken θ'yı 80-120 ms'de 0'a çeksin (ayrı bir `tiltSV` ile `withTiming`, ya da yay). Pivot ayakta olduğu için bu geçiş kaymaz.
- **Esneme (stretch):** yükselişte `scaleY 1+0.06·(-vy/|vy0|)`, `scaleX` bunun tersi. Pivot yine ayak olmalı ki gövde yukarı uzasın. Düşüşte esneme yapma: ayakla temas okunurluğu öncelikli.
- **Fizik/kamera/çarpışma:** sarmalayıcı yalnız okur (px, py, vx, vy, phase). Kamera (`camXR/camYR`), `findFootLanding`, `dususKesin` ve gaz izi (`FART_FEET_DX`) dönmeyen değerlerle çalışmaya devam eder. Tek uyumsuzluk Kurukafa temas kutusu (2858-2860, dönmeyen dikdörtgen). ±14°'de baş en fazla ~%25 gövde genişliği kayar, bu kabul edilebilir.

## 2. Kıyafet katmanları
- Pijama (külah ve terlik), kış (bere, atkı, kar, burun, buhar), yağmur gövdesi ve kasketi, şemsiye ve özel gün şapkası PoseLayer'ın **çocukları** (ChargePoses.tsx:159-259). Sarmalayıcı dönmesine hepsi birebir uyar, kutu hizaları bozulmaz.
- Şemsiyenin kendi `rotate(pulse*7°)`'si (146) ve kumaş scaleY'si (151) üst dönmeye eklenir, çakışmaz. Düşüşte şemsiye açılırken öne eğilme ±10° ile sınırlansın, yoksa kubbe "rüzgârda devriliyor" gibi okunur.
- `offsetX/offsetY` (pijama kapı yürüyüşü) PoseLayer içinde. Yürüyüş yerde (IDLE) olduğu için θ=0'dır, çatışma yoktur.
- Buhar (`breath`) ve kar dökülmesi (`shed`, 2616-2621) dünya koordinatlı ayrı katmanlarda kalır, dönmez. Sorun değil.

## 3. Yeni tepki türlerinin maliyeti
- **Şu an monte olan:** 9 şarj pozu × (1 + 4 hale) = 45 Image, 3 tepki × 5 = 15 Image, 2 düşüş × (5 + yağmur/kış/şemsiye kareleri + bindirmeler) = ~20 Image. Hepsi sürekli monte, opaklıkla açılıp kapanıyor. PoseLayer başına ~16 `useAnimatedStyle` var, toplamda 150+ mapper.
- **Çözülmüş bitmap:** 516×1103 RGBA ≈ 2,3 MB, 1100×1103 ≈ 4,9 MB. Hale kopyaları aynı `source`'u `tintColor` ile çiziyor; iOS'ta büyük olasılıkla aynı bitmap paylaşılıyor (ölçülmeli). Asıl maliyet her kopyanın ayrı çizim katmanı olması.
- **Yeni gövde pozu (B paketi):** 1 PNG (1100 genişlik ≈ 4,9 MB), +5 Image (hale), +2 mapper. Kıyafetli görünmesi için düşüşteki örnek gibi 3 PNG daha gerekir (yağmur, kış, şemsiye) ve pijama ile 6 özel gün şapkası için kutu ölçümü (`FALL_BOXES` gibi, character-pose.ts:129-132). Yani **poz başına ~4 PNG + 9 kutu**. Bunu yapmayan tepki bugünkü gibi kıyafette hiç görünmez (`reactionVisible`, character-pose.ts:148-151).
- **A paketi, dönüşüm tabanlı tepkiler (ucuz ve kıyafetle uyumlu):** Mevcut PoseLayer'a, ya da sarmalayıcıya, ayak pivotlu küçük dönüşümler:
  - ön kenar kıl payı → öne +8° sendeleme, yay ile geri;
  - arka kenar → geriye −8° ve kısa geri kayma (`offsetX` benzeri ayrı SV);
  - tek kule / kısa sekme → yalnız landPulse;
  - seri ya da rekor → 1-2 kare 18 px'lik küçük zıplama (translateY);
  - Kurukafa altında → scaleX/scaleY "jöle" sallanması.
  Hepsi kıyafetle çalışır, çünkü gövde değişmez.
- **Mevcut pozla tepki:** `poseCharge` (app/index.tsx:3166) `useDerivedValue` ile `charge`'dan türüyor. Uzun düşüşten sonra yumuşak diz kırma için buna inişten sonra kısa bir `tepkiCharge` eklenebilir (örneğin 0,25 → 0, 200 ms). Sonuç charge-025/037 pozu olur, `poseOpacity` tek-poz garantisini korur, kıyafet kutuları zaten her poz için var. Yeni PNG gerekmez.

## 4. Riskler
- **Worklet ve bildirim sırası:** yeni `useAnimatedStyle`/`useDerivedValue`, okuduğu SV'lerden (`headTilt` 1391, `vx/vy` 1360-1361, `phase`) ve kullandığı `const` worklet yardımcılarından **sonra** tanımlanmalı. Yoksa TDZ hatası alınır ya da kapanış bayat kalır. R062 kuralı (ChargePoses.tsx:125) geçerli: her SV kendi updater'ında doğrudan okunmalı. `atan2`/`clamp` yardımcıları `"worklet"` işaretli olmalı.
- **60 fps:** tek sarmalayıcıda rotate, Core Animation katman dönüşümüdür ve ucuzdur. Sarmalayıcıya `overflow: hidden`, gölge ya da opaklık<1 animasyonu ekleme: offscreen geçiş açar (REVIZYON-072 notu, ChargePoses.tsx:5-9). Şemsiye kubbesindeki mevcut `overflow:"hidden"` (288) dönen ebeveyn altında maske maliyetini artırabilir. Mevcut `PERF_PROBE` sayaçlarıyla (`pAirHitch`, 2728-2733) şemsiyeli yağmurda ölçülmeli.
- **İki gövde kuralı:** dönüşüm tabanlı her şey aynı gövdeyi taşır, kural korunur. Yeni poz eklenirse hem `PoseLayer.hideAll`'a (106) hem `ReactionLayer.on`'a (333) eklenmeli. Düşüş karesi (`fallVisible`) her zaman öncelikli kalmalı. Uçuş eğimi düşüşte (`dusus > 0`) ya kapatılmalı ya da ±5° çırpınma sallanmasına inmeli, çünkü düşüş karelerinin pivotu baş hizasında (character-pose.ts:100-104), ayak pivotlu dönme onları yanlış yerden çevirir.
- **Tepki ile yeni pozun yarışı:** tepki `withDelay(900/1100)` ile kapanıyor (1992). Yeni bir şarj `phase` üzerinden tepkiyi anında gizliyor, ama dönüşüm tepkileri ayrı SV ile yapılırsa `onPressIn`'de `cancelAnimation` ile sıfırlanmalı. Aksi hâlde eğik başlayan şarj, zamanlamayı şaşırtır.
- **Hayalet yarış:** `ghostBodyStyle` ayrı çiziliyor. Rakip düz, oyuncu eğik görünür; isteniyorsa aynı formül ona da uygulanmalı.
