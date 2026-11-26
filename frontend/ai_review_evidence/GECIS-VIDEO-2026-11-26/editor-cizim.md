# GECIS-VIDEO-2026-11-26 — Çizim / Sanat editörü

Yöntem: altı görsel oyundaki ölçek ve pivotlarıyla (character-pose.ts REACTION_POSES / charge-000 çapası) aynı ayak noktasına oturtuldu; ardışık pozlar üst üste bindirildi (mavi/turuncu soğan kabuğu) ve silüet örtüşmesi (IoU), kaplanan alan, renk ortalaması, kontur kalınlığı ölçüldü. Video 60 fps karelerle (gamma 1,4) kontrol edildi. Yeni çizim üretilmedi, koda dokunulmadı.

## 1) Videoda sert anlar (ziplama-7 penceresi, 60 fps)

| An | Zaman | Ne oluyor | Ölçüm |
|---|---|---|---|
| Duruş → fırlama | ~7,20 sn (tek kare) | dik duruştan ~40° yatık, kolları geride, ceketi pelerin gibi açık gövdeye | IoU 0,33 (charge-000), şarj-025'ten 0,30, en düşük örtüşme |
| Fırlama → süzülme | ~7,50 sn | kollar arkadan iki yana açılıyor, bacak makas | IoU 0,43; en yumuşak geçiş bu |
| Süzülme → dalış | ~8,12 sn | uçak pozundan top pozuna; yüz uykulu → dişleri sıkılı öfkeli; saç kabarıyor | IoU 0,50 ama ifade/saç sıçraması çok göze batıyor |
| Dalış → iniş | ~8,45 sn | dizler göğüste top + yukarı uçuşan ceket → dimdik, ceketi kapalı duruş | IoU 0,33; **kaplanan alan ~2,2 kat küçülüyor** (dalış ~640 bin px, duruş ~286 bin px) — en sert an |
| Düşüş (ziplama-61) | 61–63 sn | dalış pozu ekrandan çıkana kadar kalıyor | çizim değil akış sorunu; ayrıca "düşüş" çizimi zaten var (amca-dusus-1/2) |

## 2) Pozlar arasındaki farklar — hangisi "sert" hissini yaratıyor

Sıralı, en etkiliden en aza:

1. **Silüet hacmi ve ceket.** Yerdeki pozlarda ceket kapalı, eşofman alanı silüetin %18'i. Uçuş pozlarında ceket açık, pelerin gibi dalgalanıyor: %28 (fırlama), %36 (süzülme), %35 (dalış). Kalkışta pelerin bir anda beliriyor, inişte bir anda yok oluyor. Küçük ekranda göz en çok bu bordo kütlenin aniden büyüyüp küçülmesini görüyor.
2. **Gövde açısı.** Duruş dik (~90°), fırlama ~40° öne/yukarı yatık, süzülme ~30° yatık, dalış top. Duruş ile fırlama, dalış ile duruş arasında açı ve bacak durumunu taşıyan bir ara poz yok.
3. **Yüz ifadesi ve saç.** Duruş: uykulu göz. Fırlama: fal taşı gibi açık göz, saç geriye savrulmuş. Süzülme: yine uykulu. Dalış: kaşlar çatık, dişler sıkılı, saç diken diken. Duruş yine uykulu. İfade 4 karede 4 kez değişiyor (açık → uykulu → öfkeli → uykulu); en çok dalış "başka bir adam" gibi okunuyor.
4. **Renk ve ışık.** Uçuş pozlarının eşofmanı yerdekilerden ~%12 daha açık ve kırmızı (ortalama RGB 139/35/40, yerde 124/35/34). Ten de daha açık (240–245, yerde 230). Pozlar değiştikçe hafif bir parlayıp sönme oluyor; küçük ama biriken bir etki.
5. **Baş boyu ve kontur.** Sorun değil. Baş, önceki kalibrasyonla ~%4 içinde eşitlenmiş. Kontur oyundaki ölçekte hepsinde ~7–8 px (fırlama 6,8; ötekiler 7,4–7,7).

## 3) Öneriler

### A. Çizim gerektirmeyenler (önce bunlar)
- **İniş çömelmesi mevcut şarj kareleriyle.** Dalıştan sonra 2–3 kare (~50 ms) charge-025 / charge-037 (dizler kırık), sonra duruş. Yeni çizim yok. Kod yaklaşık 1–2 saat. Dalış ile duruş arasındaki boy ve hacim düşüşünü ikiye böler. Risk: ayak çapası farklı, pivot hizası kontrol edilmeli. (Kod tarafı ayrıca oyun editörünün işi; burada yalnız çizim açısından uygun olduğunu söylüyorum.)
- **Renk eşitleme.** Üç uçuş PNG'sinin eşofman/ten tonu yerdeki pozlara çekilir (seviye/ton ayarı, yeni çizim değil). Yaklaşık 0,5 saat. Risk düşük, ama görsel dosyayı değiştirir, ayrı onay ister.

### B. Yeni ara çizimler (en az sayı: 2 gerekli + 1 isteğe bağlı; her biri ayrı onay)

Ortak üslup bloğu (her istemin sonuna aynen eklenir):
> Same character as reference (charge-000-r12): comic-book caricature, middle-aged man with big nose, thick black moustache, curly black hair, maroon tracksuit with white side stripes, white sneakers. Side profile facing right. Same line weight, same flat cel shading, same colours as the standing pose (tracksuit RGB ~124/35/34). Head size identical to the reference. Transparent background, no effects, no motion lines, no dust, no shadow, no text.

**B1 — "İnişe uzanma" (dalış → iniş). 1 numara.**
Neden: en sert an bu. Top pozdan ayaklar yere uzanırken dizler hâlâ kırık; ceket kapanmaya başlar; ifade öfkeliden nötre döner. Hacim dalış ile duruş arasında kalır. Ardından A'daki çömelme gelince iniş üç adıma bölünür.
Maliyet: 1 çizim, kod ~1 saat (dalışın son kısmına, r ≥ ~0,8 ya da yere yakınken). Risk: pivot yeniden ölçülmeli (ayak tabanı = çapa).
> Prompt: "Landing reach pose: the man is falling and about to land, body almost upright, tilted slightly forward. Legs extending downward toward the ground, knees still bent about 45 degrees, feet together and flat, ready to touch down. Arms spread out low to the sides for balance, palms down. Tracksuit jacket zipped closed, only the hem lifting slightly from the air. Hair a little lifted but not wild. Expression: focused, mouth closed, eyebrows neutral (not angry). [style block]"

**B2 — "Kalkış itişi" (duruş/şarj → fırlama).**
Neden: örtüşmesi en düşük geçiş (0,30). Ayak hâlâ yerden iterken gövde ~65° öne/yukarı yatık, kollar geriye savruluyor. Ceket ancak açılmaya başlıyor, böylece pelerin bir anda belirmiyor.
Maliyet: 1 çizim, kod ~1 saat (kalkıştan sonraki ilk ~60–80 ms ya da r ≤ −0,9). Risk: kısa göründüğü için yatırımın etkisi B1'den az.
> Prompt: "Take-off push pose: the man is launching upward and forward. Body leaning forward about 25 degrees from vertical, rear leg straight and still pushing off with the toes, front knee lifted. Both arms swinging back behind the hips. Tracksuit jacket zipped, starting to flap open at the bottom only. Hair starting to blow back. Expression: eyes wide open, determined, same face as the launch pose. [style block]"

**B3 (isteğe bağlı) — "Toplanma" (süzülme → dalış).**
Neden: silüet örtüşmesi zaten 0,50. Asıl sert olan, öfkeli yüz ve kabaran saç. Bunun daha ucuz çözümü dalışın yüzünü/saçını yumuşatıp yeniden çizdirmek (yine 1 çizim). İkisinden biri seçilmeli, ikisi birden değil.
> Prompt (ara poz): "Tuck-in pose: transition from gliding to diving. Arms coming in from the spread position toward the chest, elbows bent. Knees rising toward the belly but not fully tucked. Body tilted forward about 30 degrees. Jacket open and fluttering behind, smaller than a cape. Expression: mildly surprised, eyebrows raised, mouth closed. Hair blown back, not spiky. [style block]"
> Prompt (dalışı düzeltme seçeneği): "Redraw the cannonball dive pose with the same body and limbs, but expression calm-surprised instead of angry (no clenched teeth, no frown), hair blown back softly instead of standing up, jacket fluttering less. [style block]"

### Çapraz geçiş hakkında (çizim gözüyle)
Bu görsellerde çapraz geçiş işe yaramaz: silüet örtüşmesi 0,30–0,50; iki yarı saydam gövde açıkça "hayalet" görünür. Ara çizim + tek kare değişimi hem daha ucuz (tek katman) hem de "iki gövde aynı anda görünmesin" kuralına uyar.

## 4) 1 numaralı önerim
**B1 "inişe uzanma" çizimi + mevcut charge-025/037 ile 2–3 karelik iniş çömelmesi.** En sert an (8,45 sn, hacim 2,2× düşüş, top → dimdik) tek yeni çizimle üç adıma bölünür. İkinci sırada B2, sonra renk eşitleme.
