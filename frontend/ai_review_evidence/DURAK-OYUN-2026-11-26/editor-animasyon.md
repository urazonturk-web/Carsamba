# Editör: 2D karakter animasyonu ve sinematik hareket dili — DURAK-OYUN-2026-11-26, madde (1)

Okunanlar: brief.md, ../AMAC-2026-11-26 (RAPOR.md, editor-animasyon.md, kareler/ucus_18.6.jpg), ../HAREKET-2026-11-26/kareler, `hareket.ts`, `character-pose.ts`, `ChargePoses.tsx`, `app/index.tsx` (kare döngüsü, iniş kararı). Kod değiştirilmedi.

## 1) Hareket dilini amcaya çevirmek
- **Ağır çekim atlayış** = silüet havada *uzun süre okunur*: gövde çaprazlanır, bir bacak toplanır biri uzanır, kollar açılır, kumaş/saç geride dalgalanır, yüz sakin. Amcada: eşofman ceketinin etekleri, bıyık uçları ve dağınık saç "rüzgârda". Yüz sakin değil, **ciddiyet taklidi yapan amca** (gözler kısık, dudak büzük): mizah buradan çıkar.
- **Süper kahraman inişi** = alçalırken dizler göğse, bir yumruk geride; temasta tek diz ve tek yumruk zemine (üç nokta), baş eğik, sonra yavaşça kalkış. Amcada **kapanış şakası**: kalkarken elini beline götürür ("belim!"). Kahramanlık 0,4 sn, amcalık hemen ardından.
- Ekrandaki boyutu unutmayın: uçuşta amca ~70 pt boyunda (ucus_18.6.jpg). İnce ayrıntı (parmak, kırışık) görünmez; **silüet** kazanır. Her pozun siyah gölge testi (tamamen siyaha boyanınca okunuyor mu?) Kıvılcım çıktısı kabulünün ilk ölçütü olmalı.

## 2) Poz dizisi (5 poz + 1 isteğe bağlı)
| # | Poz | Evre (r = vy/vy0) | Koşul |
|---|---|---|---|
| S1 | **Fırlama** | r < −0,3 (ilk ~0,2 sn) | Bütün atışlar (c ≥ 0,2) |
| S2 | **Süzülme (ağır çekim)** | −0,3 ≤ r ≤ 0,45 | Bütün atışlar; uzun atışta efektlerle birlikte |
| S3 | **Dalış (iniş hazırlığı)** | r > 0,45 | Uzun atış (c ≥ ~0,55, ayarlanır); kısa atışta mevcut charge-025 kalır |
| S4 | **Süper iniş** | temas anı, 300–450 ms | Temastan **sonra** karar: kusursuz ya da ≥2 kule + uzun atış |
| S5 | **Belim!** | S4'ün ardından ~400 ms | S4 gösterildiyse her zaman (mizah dengesi) |
| S6 (isteğe bağlı) | **Patlama uçuşu** | patlama turunda S2 yerine | Patlama; lekeler bu pozda yeniden ölçülmeli |

- **Önemli kural (nişan yardımı):** S3/S4'ün iniş sonucuna bakarak *uçuşta* seçilmesi yasak; `app/index.tsx:229` notu "şarjdan tahmin edilen parıltı" nişan yardımı diye kaldırılmış. Uçuşta seçim yalnız oyuncunun zaten bildiği **şarj (c)** ile; sonuç (kusursuz/kule sayısı) yalnız `onLanding` temasında kullanılır. Kenar sallanması (kıl payı) S4'ten önceliklidir.
- Kısa hop (c < 0,2): S1 → charge-025; S2 atlanır (Paket A'daki gibi). Düşüş kesinleşince (`dusus`) uçuş pozları anında kapanır.
- Her kare en az 90 ms ekranda, eşiklerde 0,05 histerezis; S1 kendi uzamasını taşıdığı için `ESNE_BOY` 0,12 → ~0,05.

## 3) Tuval / pivot kuralları (Kıvılcım + ölçüm)
- Tuval **1100 × 1103**, piksel ölçeği charge-000-r12 ile aynı (baş ~500 px yüksekliğinde). Kol/saç taşarsa 1100 × 1203 ve `TOP = −100` (FALL_POSES_KIS kalıbı). 516 genişlik yetmez.
- **Havadaki pozlar (S1, S2, S3, S6):** FALL_POSES gibi baş hizalı pivot: baş ağırlık merkezi pivotX'in 45 px solunda, baş tepesi ≈ pivotY − 1102. Şarj → S1 → S2 → S3 boyunca baş yerinde kalır, gövde değişir.
- **Yerdeki pozlar (S4, S5):** pivotX = ayak tabanı açıklığının ortası + 86 (charge-000: 222 → 308), pivotY = en alt opak satır + 1. S4'te **diz, yumruk ve ayak tabanı aynı satıra** değmeli (çatı çizgisi); ±4 px.
- Görselde **efekt yok**: gaz bulutu, hız çizgisi, toz, gölge, zemin çizilmez. Hepsi kodla ayrı katman (kıyafet, gece, yağmurla uyumlu kalsın diye).

## 4) Kıvılcım istem taslakları (İngilizce, her biri tek başına verilebilir)
Her çağrıya referans olarak `charge-000-r12.png` ve `amca-denge.png` eklenmeli. Ortak blok (her istemin başına):

> *Style block:* "Same character and same art style as the attached reference images: comic-book caricature, thick black ink outlines, soft cel shading. A middle-aged Istanbul neighbourhood uncle: oversized head (about 45% of body height, head ~500 px tall), big bulbous nose, thick black walrus moustache, messy curly black hair, stubble, heavy-lidded eyes. Maroon tracksuit with two white stripes along sleeves and legs, zip-up jacket, white sneakers. Strict side profile facing RIGHT. Transparent background, PNG, canvas 1100 x 1103 px, character at the exact same pixel scale as the reference, nothing cropped. No ground, no shadow, no smoke, no motion lines, no text, no effects of any kind."

- **S1 Launch:** "…The uncle has just shot upward like a rocket. Whole body stretched in one straight diagonal line, leaning about 15° forward. Both arms swept straight back and down along the body like a ski jumper, palms open facing up, fingers spread; the far arm is visible a shade darker behind the near arm. Both legs straight and together, pointing down-back, toes pointed. Face: eyes wide open, eyebrows high, cheeks still puffed, lips tightly pressed. Moustache tips and hair blown flat backwards by wind; jacket hem flapping back."
- **S2 Slow-motion glide:** "…Frozen mid-air in a dramatic slow-motion leap, but played with deadpan comedy. Torso tilted about 20° forward. Near arm extended forward and slightly up, palm down, fingers together like a blade; far arm stretched back and up behind the body, clearly visible. Legs in a wide scissor: front knee raised to hip height and bent 90°, back leg extended far behind with the sole of the sneaker visible. Face: calm, serious, half-closed 'cool' eyes, lips pursed, chin up. Jacket open at the hem and billowing backwards in soft waves; trouser legs rippling; moustache tips and hair streaming backwards. The silhouette must read clearly as a wide X shape when filled black."
- **S3 Dive:** "…Plunging down toward a rooftop in a heroic landing approach. Body tilted about 15° forward-down. Both knees pulled up tight toward the chest, sneakers under the hips, soles facing down. Near arm cocked back with a clenched fist raised behind the shoulder; far arm reaching forward-down, fingers spread, as if about to touch the ground. Face: fierce determined glare looking down-forward, eyebrows knitted, teeth clenched under the moustache. Hair and jacket hem blown straight up by the fall; moustache tips flipped upward."
- **S4 Super landing:** "…Just slammed onto the ground in a powerful three-point landing. Deep crouch: front foot flat on the ground, back knee touching the ground, near fist planted on the ground in front of the knees, far arm stretched back and up behind the body, open hand. Head bowed low, eyes looking up from under the eyebrows, serious. The sneaker sole, the knee and the fist all rest on the SAME horizontal line at the very bottom of the canvas. Jacket hem and hair still settling downward; moustache bouncing."
- **S5 'My back!':** "…Rising from a heroic crouch and immediately regretting it. Half-standing, hips bent, torso leaning forward about 25°. Near hand pressed flat on the lower back, far hand on the knee. Face: eyes squeezed shut, mouth stretched in a grimace of mild back pain, one eyebrow raised; comedic and warm, not suffering. Both sneakers flat on the ground, same baseline as the reference standing pose."
- (S6 Explosion flight, isteğe bağlı) "…Blasted into the air out of control: body tumbling backwards about 20°, arms and legs flung out in four directions, jacket puffed up like a balloon, hair standing on end, moustache frazzled, eyes wide in comic shock, cheeks blackened with soot."

## 5) Kodla sinematik efektler — kural uyumu
| Efekt | Uygulama | Kural |
|---|---|---|
| **Gerçek ağır çekim** (dt × 0,4, tepede 250 ms) | Kare döngüsünde `dt` ölçeği | **Fiziğe dokunur**: uçuş süresi değişir, değişken dt yörüngeyi az da olsa kaydırır. Önermiyorum; istenirse ayrı fizik onayı. |
| **Görsel ağır çekim** | Uzun atışta S2 en az 250 ms tutulur + gölge izi + vinyet; inişte S4 tepkisi yavaş başlar, hızlanarak S5'e geçer (hız rampası) | Uyumlu: yalnız çizim zamanlaması |
| **İniş donması** (60–80 ms) | Temastan sonra yalnız amca + toz katmanı durur | Uyumlu, ancak şarj girişi donmamalı (kontrol gecikmesi olmasın) |
| **Toz şok halkası** | İnilen çatı hizasında iki yana açılan bej toz (mevcut gaz pufları renklendirilerek ya da 1 yeni toz görseli), 3–4 kiremit parçası seker | Uyumlu, dünya koordinatında; çarpışma topY değişmez |
| **Çatlak** | Çatıya 600 ms'de solan "kiremit kırığı" (1 görsel) | Uyumlu; kalıcı olmasın (kuleler yeniden kullanılıyor) |
| **Ekran sarsıntısı** | — | **Kamera değişmez → yok.** Yerine: yalnız inilen çatının **görseli** 3–4 px aşağı-yukarı (çizim ofseti) + mevcut titreşim |
| **Hız çizgileri** | Amcanın arkasında 3–4 ince çizgi, hıza bağlı opaklık, yalnız c ≥ 0,55 | Uyumlu |
| **Gölge izi** | Son 2 konumda pozun yarı saydam kopyası, halo yok | Uyumlu; performans riski (takılma zaten %19–22) → 2 kopya sınırı, ölçerek |
| **Vinyet** | Tam ekran tek PNG kenar karartma, 300 ms, %25 | Uyumlu (UI katmanı, kamera değil) |
| Renk soldurma | — | RN'de pahalı (ekran dışı çizim); önerilmez |

## 6) Kıyafet sürümleri ve görsel sayısı
| Kıyafet | S1–S5 için | Yeni görsel |
|---|---|---|
| Normal | 5 poz | **5** (+S6 = 6) |
| Yağmur (mont + kasket) | Tam gövde bindirme | **5** |
| Kış / pijama / 6 özel gün şapkası | Kutu ölçümü (FALL_BOXES kalıbı) | 0 |
| Şemsiye | Uçuşta eski pozlara düşülür (uzun atış efekti kapalı) | 0 |
| Efekt | Toz, kiremit kırığı, vinyet | 2–3 |

**Toplam: 12–14 görsel** (5 + 5 yağmur + 2–3 efekt; S6 ile +1–2). Her Kıvılcım çağrısı ayrı onay.

## 7) Önce denenecek: **S2 Süzülme + S4 Süper iniş** (2 çağrı)
- S2, oyuncunun en uzun gördüğü kare ve "kazık" şikâyetinin doğrudan cevabı; S4 yeni dilin imzası. İkisi birlikte bir uzun atışı baştan sona "sinematik" gösterir (S1/S3 yerine geçici olarak mevcut charge-000/025 kalır).
- Kabul ölçütü: siyah silüet testi, baş pivotu (S2) ve taban/diz/yumruk aynı satır (S4) ±4 px, telefonda ~70 pt boyda okunurluk.
- Kod tarafında ilk deneme yalnız görsel: S2 + S4 + toz halkası + çatı görseli sekmesi. Gerçek ağır çekim yok.
