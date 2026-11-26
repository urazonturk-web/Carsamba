# Editör görüşü: oyuncu deneyimi / game feel (HAREKET-2026-11-26)

## Ne gördüm
- Uçuş karelerinde (ucus_21–23) amca dik ve kaskatı duruyor. Gaz izi hareketi taşıyor ama gövde "kesilip yapıştırılmış" gibi. Kullanıcının "direk gibi" demesi yerinde.
- `onLanding` tek inişte birden çok şeyi aynı anda tetikleyebiliyor: iç ses balonu, teyze/kedi balonu, karga, durak bandı, "Tam isabet!", +puan, beden pozu ve iki ayrı haptik (durak inişi kusursuzsa hem Medium/Success hem Light). Asıl tehlike tepkilerin az olması değil, **aynı anda üst üste binmesi**.

## 1. Uçuş (A: yalnız transform, yeni PNG yok)
- **Kalkış (ilk ~120 ms):** dikey esneme (scaleY 1.08, scaleX 0.93), ardından 1.0'a yaylanma. Şarj çömelmesinin doğal karşılığı bu.
- **Yükseliş:** gövde hız yönüne eğilsin, açı `atan(vy/vx)` ile hesaplanıp **±12°** ile sınırlansın. Pivot **taban ortası** olsun, böylece ayaklar gerçek yörüngede kalır.
- **Tepe:** 80–100 ms hafif "asılı kalma" ezilmesi (scaleY 0.97). Gaz puflarının her birine 1–2°'lik küçük bir öne itme titremesi eklenebilir: "osurukla itiliyor" esprisi sözsüz anlatılmış olur.
- **İniş öncesi:** çatıya son ~150 ms kala açı 0'a dönsün, yani amca **dik insin**. Oyuncu iniş noktasını ayakların altından okuyor, eğik gövde kenarı yanlış gösterir.
- **Şarja göre fark:** tam şarjda eğilme ve esneme %30 daha fazla olsun, kısa atışta neredeyse hiç olmasın. Ters takla veya tam dönüş **yok**: ayak noktası kayar, tekrarlanınca mide bulandırır.

## 2. İniş: hangi durum ayrı tepki hak ediyor
Kural şu: tepkinin **çıkıp çıkmayacağı rastgele olmamalı**, çünkü oyuncu tepkiyi sonucun bilgisi olarak okur. Rastgelelik yalnız aynı durumun **varyantında** kullanılsın. İnişlerin kabaca %70'i sessiz kalsın: yalnız ezilme, toz ve ses.
| Durum | Tepki | Paket |
|---|---|---|
| Sıradan iniş / tek kule kısa atış | sessiz | – |
| Kıl payı **ön** kenar (≥0.88) | denge pozu + **öne** sallanma (rotasyon ±6° ×2) | A |
| Kıl payı **arka** kenar (≤0.12) | aynı poz, **arkaya** sallanma, ilk salınım daha büyük | A |
| Kusursuz | **seriyle artan** tepki: 1. seferde yalnız sesin perdesi, 2. seferde silkele, 3 ve sonrasında silkele + ses bir perde yukarı | A |
| 3+ kule | oh be (koşu başına ilk 2 seferde; sonra yalnız ses) | A |
| Rekoru ilk geçiş | koşuda bir kez: oh be + rekor sesi + Success haptiği | A |
| Teyze/kedi/kargalı çatı | **amca poz yapmaz**, sahneyi komşu konuşur. "Tek sözcü" kuralı | A |
| Durak/kartpostal | bant yeterli, amcanın pozu bastırılır | A |
| Kurukafa etkisi altında | ek tepki yok (sahne zaten kalabalık) | – |
- **Aynı poz art arda 3 inişte bir defadan fazla çıkmasın.** Tek istisna, seri tırmanırken çıkan kusursuz tepkisi.
- **Kıyafet varken tepki tamamen kayboluyor.** Kışın oyun "ölü" hissettirir. Poz çizilmese de sallanma ve silkeleme **transformla** (rotasyon titremesi) uygulanabilir.
- Tepki 0.9–1.1 sn sürüyor. Oyuncu ritmi hızlıysa **dokunuş tepkiyi anında kesmeli** ve şarj pozuna geçilmeli. Kodda bunun gerçekten olduğu telefonda doğrulanmalı.

## 3. Ses ve haptik eşleşmesi
- Haptik, tepki pozunun belirdiği anda (+180 ms) değil, **temas karesinde** atılsın. Bir inişte **en fazla bir haptik** olsun. Öncelik: rekor/iskele (Success) > 3+ kule (Medium) > kusursuz (Light) > kıl payı (salınım ritminde iki Light tık).
- Sıradan inişte haptik olmasın. Her inişte titreşim birkaç dakikada körleşir.
- Kalkışta bırakma anında tek Light haptik ve "pırt" sesi. Esneme de aynı karede başlamalı, yani girdi hemen cevap vermeli.

## 4. Mizah tonu (eşofmanlı İstanbul amcası)
- Bu amca kahraman değil, emekli. Komedi **efor ve rahatlama** üzerine kurulu: gergin kalkış, havada şaşkın yüz, inişte "ohh". Arapça ünlem yok, yazıyı az kullan, beden dili konuşsun.

## 5. İkinci paket (B: yeni PNG ister)
- **Uçuş-yükseliş** pozu (kollar geride, yanaklar şişik) ve **iniş-hazırlık** pozu (bacaklar öne, kollar açık): 2 poz × (çıplak + pijama + kış + yağmurluk + şemsiye) = **10 PNG**. Şapka ayrı katmansa ek çizim gerekmez. Etkisi en yüksek B işi bu.
- **"Ah belim"** (3+ kule sonrası bel tutma) ve **"bıyık sıvazlama"** (kusursuz seri 3+): 2 poz × 5 sürüm = 10 PNG. Bunlar hem komik hem okunaklı, ama uçuş pozlarından sonra gelmeli.
- İlk paket risksiz ve hızlı: eğilme, esneme, sallanma, tek sözcü, haptik birleştirme, seri artışı. B için her Kıvılcım çağrısı ayrı onay ister.

## 6. Kaçınılacaklar
- Tam takla ya da 360° dönüş. Temas anında eğik gövde. Pivotu merkezde döndürme (ayaklar kayar).
- Her inişte ekran sarsıntısı. Sonuçla çelişen poz (kusursuzda denge pozu gibi).
- Aynı inişte iki balon ya da iki haptik. Bir sonraki dokunuşu geciktiren tepki.

## Tür örnekleri
- **Stick Hero:** kırmızı noktaya (merkez) basınca +1 alırsın. Ödül görünür ama küçük, kaçırmak oyunu bitirmez ([Instructables](https://www.instructables.com/How-To-Play-The-Game-Stick-Hero)). Klonlarda oyuncular, göstergesi olmayan "perfect" mekaniğinin kafa karıştırdığını yazıyor ([itch.io](https://itch.io/post/16822740)). Kusursuzun her zaman aynı, net bir işareti olmalı.
- **Spring Ninja (Ketchapp):** tek dokunuşla yay kurma. Ustalaşması zor ama tekrar oynatıyor ([PocketGamer](https://www.pocketgamer.com/spring-ninja/review/)). Oyuncu ölümleri çoğunlukla merkez dışı inişe bağlıyor ([Kiz10](https://kiz10.com/spring-ninja), gayriresmî kaynak). Kenar inişini ayrıca göstermek bu yüzden değerli.
- **Squash & stretch / juice:** kalkışta esneme, inişte ezilme. Fiziği değiştirmeden zıplamayı güçlü hissettirir ([Amazon GameMaker](https://developer.amazon.com/docs/gamemaker/juicing-your-movements.html), [12 principles for game animation](https://www.gamedeveloper.com/game-platforms/12-principles-for-game-animation)). Hitbox ile çizimin ayrışmaması için aşırı deformasyon birkaç kareyle sınırlı tutulmalı. Ses tekrar etmemeli ([Wikipedia: Game feel](https://en.wikipedia.org/wiki/Game_feel), Jonasson & Purho, "Juice it or lose it").
