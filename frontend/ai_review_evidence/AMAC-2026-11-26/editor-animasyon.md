# Editör: 2D karakter animasyonu — AMAC-2026-11-26 (A maddesi ağırlıklı)

## Teşhis: neden hâlâ "kazık"
- Uçuşta gösterilen pozlar yalnız şarj pozları (`ucusPoz`: 0 / %12,5 / %25). Üçünde de **yakın kol gövdeye yapışık, el kalçada, uzak kol hiç yok**; bacaklar paralel, ayaklar yerde duruyormuş gibi. Silüet yukarıdan aşağı tek dikey şerit (kareler/ucus_18.6.jpg: gaz izinin üstünde dik bir çubuk).
- Paket A'nın eğilmesi (≤12°) ve esnemesi bu şeridi yalnız döndürüyor/uzatıyor; şerit kırılmadıkça (kollar gövdeden ayrılmadıkça, bacaklar ayrışmadıkça) göz "kazık" okur. Çözüm transform değil, **silüeti açan yeni poz**.
- Not: düşüş pozları (amca-dusus-1/2) kolları açık ama **önden/¾ bakış ve korku yüzü**; uçuşta kullanılırsa her zıplamada profil→cephe atlaması olur ve düşüş sinyali değersizleşir. Kullanılmamalı.

## Önerilen 3 yeni poz (en az sayı / en çok fark)
Ortak: profil, sağa bakış (charge-000 ile aynı yüz/burun/bıyık çizimi, aynı piksel ölçeği: baş boyu charge-000'deki gibi ~500 px), bordo eşofman, iki beyaz şerit kolda ve bacakta, beyaz spor ayakkabı. **Uzak kol mutlaka görünsün** (bir ton koyu bordo, yakın kolun arkasında) — bugünkü "tek kollu" görüntünün asıl kaynağı bu.

**U1 — Fırlama (kalkış, r < −0,3, yaklaşık ilk 0,15–0,25 sn)**
- Gövde öne ~10° eğik, düz ve uzamış; kalça hafif geride.
- Kollar: ikisi de geriye-aşağı süpürülmüş, gövdeyle ~35–45° açı (kayakçı atlayışı), dirsekler hafif bükük, avuçlar açık ve yukarı bakar, parmaklar ayrık.
- Bacaklar: ikisi de gergin, aşağı-geriye uzanır, ayak uçları sivri (bale gibi), iki ayak arasında ~10 cm aralık (biri biraz geride).
- Yüz: gözler iri, kaşlar kalkık, ağız "o" şeklinde ya da sıkı dudak + yanaklar hâlâ hafif şişkin (şarj ifadesinin sönüşü). Bıyık uçları rüzgârdan **geriye-aşağı** yatık. Saç geriye savrulmuş.
- Ceket: fermuar profilde ön kenarda görünür, etek arkaya dalgalanır, kollar bileğe doğru büzülmüş.
- Gaz izi: kalçanın arkasından **sol-aşağıya** (≈210–225°) çıkar; mevcut gaz puflarının çıkış noktası kalça hizasında kalmalı.

**U2 — Kanat / tepe (−0,3 ≤ r ≤ 0,45; asıl "kollarını açsın" pozu)**
- Gövde dik-hafif öne (~5°), göğüs dışarı.
- Kollar: **iki yana açık**. Yakın kol öne-yukarı, yatayın ~30° üstünde, avuç aşağı, parmaklar açık; uzak kol arkaya-yukarı, yatayın ~20° üstünde, gövdenin arkasında görünür. Kollar arası açı ≥120° — silüetin en geniş noktası omuz hizasında olsun.
- Bacaklar: "havada adım": ön diz yukarıda ~90° bükük (uyluk yatay), arka bacak geriye uzanmış, diz hafif bükük, ayak tabanı arkaya görünür.
- Yüz: keyifli şaşkınlık — kaşlar yüksek, gözler açık, geniş gülümseme ya da "yuhuu" ağzı; bıyık uçları yukarı kalkık. Saç tepeye doğru kabarık (ağırlıksızlık).
- Ceket: etek hafif havalanır, fermuar düz çizgi, kol ağızları geriye çekili.
- Gaz izi: tepede incelir; yön sol-aşağı (≈200°), poz değişmez.

**U3 — İnişe hazırlık (r > 0,45; inişe ~0,2 sn kala ve kıl payı inişlerde)**
- Gövde ~5–8° **geriye** yaslı (mevcut `EGIM_GERI_MAX` ile toplamı 15°'yi geçmesin).
- Kollar: ikisi de **öne uzanmış**, yatayın ~20–30° altında, avuçlar aşağı ("yavaş, yavaş" / denge); uzak kol yakın kolun biraz üstünde-arkasında.
- Bacaklar: dizler ~110° bükük, ayaklar kalçanın **önünde**, ayak tabanları aşağı-ileri, iki ayak yan yana (iniş pozu %25 şarj ile ayak aralığı aynı olsun).
- Yüz: odaklı; gözler kısık ve aşağı-ileri (hedef çatıya) bakar, dil ağzın kenarından hafif dışarıda; bıyık uçları aşağı sarkık.
- Ceket: etek aşağı iner, fermuar hafif kıvrık (gövde bükülmüş).
- Gaz izi: yok ya da son küçük puf (düşüşte zaten sönüyor).

İsteğe bağlı 4. poz (sonra): **U2b** — U2'nin kolları ~25° aşağıda kopyası; uzun atışta tepede U2↔U2b 120 ms aralıkla 1–2 kez "kanat çırpma". İlk turda gerekmez.

## Tuval, pivot, ayak hizası kuralları (Kıvılcım + ölçüm için)
- **Tuval 1100 × 1103**, piksel ölçeği charge-000 ile **aynı** (yeniden boyutlandırma yok) — REACTION_POSES / FALL_POSES ile aynı düzen. Kol yukarı taşarsa 1100 × 1203 ve `TOP = −100` (FALL_POSES_KIS kalıbı). 516 genişlik kollar açıkken yetmez.
- **U3 (ayak yere iniyor):** pivotX = iki ayak ucunun ortası + 86 (charge-000: 222 → 308 kuralı), pivotY = ayakkabının en alt opak satırı + 1. İnişte U3 → charge-025 (%25) geçişinde ayak noktası ±4 px içinde kalmalı; kaymayı `poseCharge` geçiş karesinde ölçün.
- **U1/U2 (ayak havada):** ayak noktası anlamsız; FALL_POSES gibi **baş hizasıyla** pivotlayın: baş ağırlık merkezi pivotX'in 45 px solunda, baş tepesi ≈ pivotY − 1102 (charge-000 ile aynı). Böylece şarj → U1 → U2 → U3 boyunca baş yerinde kalır, yalnız gövde/kol/bacak değişir (göz sıçrama görmez).
- U1 zaten uzamış çizileceği için `ESNE_BOY` 0,12 → ~0,05 düşürülmeli (çift uzama olmasın). Dönme (`charOpStyle`) ayak noktası etrafında kalabilir; U1/U2'de baş pivotu kullanıldığı için dönme merkezi gövdeye yakın olur, bu daha doğal.
- Hepsi saydam arka plan, kontur kalınlığı ve gölge tonu charge-000 ile aynı; halo (`tintColor` kopyaları) yeni pozlarda kendiliğinden çalışır.

## Uçuşa bağlanma (yalnız çizim; fizik/kamera/çarpışma dokunulmaz)
- `ucusPoz` şarj değeri yerine bir `ucusKare` (0 yok, 1 U1, 2 U2, 3 U3) üretir; `FallLayer` kalıbında bir `FlightLayer` çizer, görünürken şarj pozları gizlenir (`hideAll` mantığı).
- Eşikler: r < −0,3 → U1; −0,3…0,45 → U2; > 0,45 → U3. Titreşmesin diye her kare en az 90 ms, eşiklerde 0,05 histerezis.
- Kısa hop (c < 0,2): U2 atlanır, U1 → U3. Düşüş kesinleşince (`dusus`) uçuş kareleri anında kapanır, düşüş kareleri devralır. İnişte U3 → charge-025 → landPulse → 0 (mevcut akış).
- Kenar sallanması / tepki pozları değişmez.

## Kıyafet sürümleri ve görsel sayısı
| Kıyafet | Gerekli | Yeni görsel |
|---|---|---|
| Normal | U1, U2, U3 | **3** |
| Yağmur (mont + kasket) | Montlu tam-gövde bindirme (RAIN_POSE_SOURCES kalıbı); kasket kutu ölçüsü | **3** |
| Kış (bere + atkı) | Yalnız kutu ölçümü (WINTER_HAT/SCARF_BOX poz başına) | 0 |
| Pijama (gece külahı + terlik) | Kutu ölçümü (külah + 2 terlik, FALL_BOXES gibi açılı) | 0 |
| Özel gün şapkaları (6) | Kutu ölçümü poz başına | 0 |
| Şemsiye | `SEMSIYE_ON = false` | 0 |
| Kar birikintisi, kızarık burun, nefes | Uçuşta gizlenir (en ucuzu) ya da ölçüm | 0 |

**Toplam: 6 görsel** (3 poz + 3 yağmur). U2b eklenirse 8. Kıvılcım çağrısı önerisi: önce yalnız U2 (en çok fark eden), kullanıcı kabul ederse U1+U3, sonra yağmur üçlüsü — her biri ayrı onay.

## Çizimsiz ara çözüm: kolu kesip döndürmek — mümkün ama önerilmez
Teknik olarak yapılır (charge-000/012/025'ten yakın kolu alfa maskesiyle ayrı PNG'ye kesip omuz noktası ~(235, 560) etrafında `rotate`). Riskler:
1. Kol **gövdenin önünde** çizili; kesince altında ceket deliği kalır, şerit ve gölgeyle elle doldurulmalı — bu zaten yeni çizim demek.
2. **Uzak kol yok**; tek kol kalkınca "kırık kukla" görünür, "kollarını açsın" etkisi çıkmaz.
3. Omuz ekleminde boşluk/üst üste binme; sabit ışık ve şerit yönü dönen kolda yanlış görünür, el yumruk ve aşağı dönük kalır.
4. Yağmur montu tam-gövde bindirme: kesilen kol montlu görselde de kesilmezse **çift kol** görünür (3 montlu görsel daha işlenmeli).
5. Hale kopyaları kol katmanı için ayrıca gerekir (+4 görüntü/kare; REVIZYON-072'deki performans maliyeti).
Sonuç: ±20° küçük bir kol sallanması için yarım günlük deneme olabilir, ama kullanıcının istediği silüeti vermez; emek, 3 pozun Kıvılcım'la çizilmesine yakın. Ucuz ve risksiz alternatif yok.

## B için kısa fikir (animasyon açısından)
**"Mahallenin emaneti":** her durak arasında bir çatıda o semte ait kayıp bir eşya (simit tablası, tavla pulu, kayıkçı küreği…) durur; üstüne inince amca eğilip alır (U3 + mevcut silkele pozu, yeni poz gerekmez), durağa varınca sahibine teslim edilir ve kartpostalın arka notu o eşyayla tamamlanır. 12 eşya görseli; kedi gibi mevcut çatıya konur, **kule üretimi ve puan kuralına dokunmaz**. Boyut M.
