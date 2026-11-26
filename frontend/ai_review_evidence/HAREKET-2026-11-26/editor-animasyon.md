# Editör görüşü: 2D karakter animasyonu (HAREKET-2026-11-26)

Bakılanlar: brief, kareler/ (8 uçuş karesi, duruş, 3 tepki, düşüş-1), `ChargePoses.tsx` (PoseLayer transform'u), `character-pose.ts`, `app/index.tsx` (landPulse 35+75+80 ms, tepki 180 ms yerleşme + 900/1100 ms tutma).

## Teşhis
- Uçuş karelerinde amca bir **"çıkartma" gibi kayıyor**: dik, kolları yanda, gözler yarı kapalı (duruş pozu). Kalkışta anticipation (çömelme) var ama **release yok**; çömelmeden dik duruşa tek karede geçiyor, havada hiçbir arc/follow-through yok. "Direk gibi" hissinin asıl sebebi bu.
- İyi haber: kıyafet katmanları (pijama, mont, yağmurluk, şapka, şemsiye) PoseLayer'ın **içindeki çocuklar**. Yani üst görünüme verilen rotate/scale **her kıyafete kendiliğinden uyar**. Paket A kıyafet engeline takılmaz; tepki pozlarındaki "kıyafetliyken çizme" sorunu burada yok.

## A) Mevcut görsellerle uçuş (yalnız transform; px/py, çarpışma kutusu ve footSoles aynı)
Dönme pivotu: **gövde ortası** (yaklaşık pivotY − 0.45·h). Ayak pivotu kullanılmasın; kafa büyük yay çizer, mide bulandırır. `rotate` translate'lerden sonra, scale'den önce uygulanmalı.
1. **Kalkış (0–90 ms): stretch.** scaleY 1.00→1.16→1.00, scaleX 1.00→0.90→1.00 (hacim korunur). Tepe noktası 40 ms'de, ease-out. Aynı anda öne eğilme 0→+8°. Şarj %75 üstündeyse stretch 1.20 / 0.88.
2. **Yükseliş: hıza bağlı eğilme.** `tilt = clamp(-vy/|vy0| · 12°, -10°, +12°)` → yükselirken öne +10–12°, inişte geriye −6–8°. Gövde yolu izlediği için yay okunur hale gelir. Ek olarak hıza bağlı uzama: `scaleY = 1 + 0.06·|vy|/|vy0|` (scaleX bunun tersi).
3. **Tepe noktası (|vy| küçük, ~120–160 ms): "hang time".** Eğilme 0°'ye yaklaşır, scale 1.0, ±1.5° hafif sallanma (sin, 6 Hz). Burada **charge-012 veya 025 pozuna geçmek** (hafif dizler bükülü) "bacakları toplama" etkisi verir; yeni çizim istemez, şarj pozları zaten kıyafetli çiziliyor.
4. **İniş öncesi (tahmini temas −120 ms): hazırlık.** Gövde −6°'den 0°'ye döner (ayak düzgün değsin), charge-025/037'ye geçer (dizler iner = iniş anticipation'ı). Temas anında açı **mutlaka 0° ±2°** olsun; yoksa iniş noktası kaymış gibi okunur.
5. **Şarja göre farklılık:** kısa atış (şarj <%35): eğilme ×0.5, stretch yok, tepe pozu yok, yani "küçük hop". Uzun atış (>%75): eğilme ×1.0, tepe noktasında **gaz itişiyle +4° öne "tekme"** ve 1 kez hafif scale nabzı (1.04). **Tam ters takla (360°) önermiyorum**; ancak en uzun atışın %10'unda, 3+ kule aşınca ve 450 ms'de tek tur olabilir. Bu durumda iniş öncesi 150 ms içinde 0°'ye gelmeli.
6. **Secondary motion:** gaz izinin çıkış noktası gövde açısıyla birlikte dönsün (kalça arkası); aksi halde iz amcadan kopuk görünür.

## A) Mevcut görsellerle iniş
- **landPulse'u iniş hızına bağla:** şu an her inişte sabit 0.14 sıkışma. `pulse = 0.7 + 0.6·(|vy|/vyMax)` olsun: kısa hop 0.10, uzun düşüş 0.20 sıkışma; süre 35/75/80 → 50/90/110 ms.
- **Kıl payı kenar:** denge pozu var. Onun yerine (ya da kıyafetliyken) **duruş pozunu kenarın tersine ±7° sallamak**: 3 salınım, 600 ms, sönümlü (7°→4°→1.5°), pivot ayak. Ön/arka kenar yönü farklı olsun (ön kenarda öne devrilip geri gelir). **Bu, kıyafetliyken de tepki verir.**
- **Mevcut 3 tepki pozundan dönüşümlerle çeşitlilik:** her poz ×{yatay ayna değil, çünkü yön sağa sabit} × {±4° eğim, 0.96–1.04 scale "boing", 2 tutma süresi 600/1000 ms} × {giriş: pop-in 180 ms veya 2 kare "zıpla-otur" −6 px} ile göze 3'ten ~8–10 ayırt edilebilir varyant çıkar. Silkele pozu tepe tarafına 2 kez ±3° "omuz silkme" (2×120 ms) ile canlanır; oh be pozu nefes alma (scaleY 1.00↔1.03, 2 döngü 700 ms).
- **Tekrar yorgunluğu:** çoğu iniş sessiz kalsın, ama **sıradan inişte de mikro tepki** (pulse + 1 kez 2° geri sallanma) olsun. Tam poz tepkisi inişlerin **en fazla ~%25–30'unda**, aynı tepki art arda 2 kez çıkmasın.
- **Seri (3 ardışık iyi iniş):** silkele + charge-100 yüzü değil; duruş pozuna kısa "göğüs kabartma" (scaleX 1.06, 250 ms). Rekor geçince 1 kez oh be + kamera dokunulmadan toz ×2.

## B) Yeni poz gerekenler (en az PNG, en çok fark)
Sıra etkiye göre. Her biri 1 gövde + kıyafet sürümleri (pijama, mont, yağmurluk; şapka/şemsiye bindirme ile çözülebilir) yani **~4 PNG/poz**:
1. **Havada "yıldız/tekme" uçuş pozu** (kollar geride, bacaklar toplu, yüz rüzgârda gerilmiş): tüm yükseliş ve tepeyi taşır. Tek başına "dümdüz" şikâyetini %70 çözer. **En yüksek öncelik.**
2. **İniş öncesi pozu** (kollar öne/yana açılmış, dizler hafif bükük, gözler aşağıda, yere bakıyor): temas anticipation'ı. Düşüş-1 pozuyla karışmasın diye ağız kapalı, ifade sakin olmalı.
3. (İsteğe bağlı) **Kıl payı ön kenar "kollar çark"** pozu: denge pozunun kıyafetli eksikliğini kapatmak yerine önce mevcut 3 pozun kıyafet sürümleri (3×3 = 9 PNG) daha ucuz bir kazanç olabilir; karar kullanıcının.
→ Asgari paket: **2 poz × 4 sürüm = 8 PNG.** Tüm uçuşu ve inişi ciddi değiştirir.

## Kaçınılacaklar
- Temas anında 0°'den farklı açı, iniş noktasıyla oynayan translate, ayak pivotlu büyük dönme.
- >15° eğilme veya uçuş boyunca sürekli dönme: kafa büyük olduğu için baş dönmesi yaratır; zamanlama okunurluğu bozulur.
- Şarj sırasında ve kalkıştan önceki ilk 30 ms'de transform (oyuncunun bırakma geri bildirimiyle çakışır).
- İki gövdenin aynı anda görünmesi (çapraz solma yok, sert geçiş kuralı korunmalı); tepki pozları da dahil.
- Düşüş pozlarını iniş tepkisinde kullanmak: "öldüm" gibi okunur.
