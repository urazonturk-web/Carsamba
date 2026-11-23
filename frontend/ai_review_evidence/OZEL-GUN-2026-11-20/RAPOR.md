# Amcanın sesi, lakap damgası ve özel gün/komşu/kedi örnek görselleri (2026-11-20)

Kullanıcı: "Evet, 1 ve 2'den başla, görselleri de iste"

## 1. Amcanın sesi (oyunda, telefona kuruldu: "HANIM + IC SES + LAKAP")
Kod: `src/game/amcaSesi.ts` (metinler + kurallar), `app/index.tsx` (bağlantı). Bayraklar: `HANIM_ON`, `ICSES_ON`, `LAKAP_ON` — beğenilmeyen tek tek kapanır.

**Hanım arıyor** — oyun sonundan 1,5 sn sonra üstten telefon bildirimi gibi kayar, 5 sn durur, dokununca kapanır. Her oyun sonunda gelmez: rekorda her zaman; özel durumda %60; diğerlerinde %30; art arda iki oyun sonunda gelmez. Yarış ve meydan okumada kapalı.

| Durum | Mesaj |
|---|---|
| Rekor (5+ kule) | "{N} kule! Komşular seni konuşuyor. Gururlandım ama gel yemeğe." / "Rekor mu kırmışsın? Bak sen… Ekmeği yine unuttun ama." |
| Gece 00–05 | "Saat {SS:DD} oldu, çatıda ne arıyorsun? Gel yat artık." / "Komşular uyuyor, sen hâlâ zıplıyorsun. Gel yat." |
| Sabah 06–10 | "Ekmek almaya çıktın, {N} kule mi zıpladın?! Kahvaltı soğudu." |
| Akşam 18–21 | "Yemek hazır. "Son bir zıplayış" deyip geliyorsun ya, biliyorum." |
| Yağmur | "Yağmurda çatıya mı çıkılır! Montunu ilikle bari." |
| Kar | "Karda kayarsın, in aşağı! Salep yaptım." |
| Sis | "Bu siste nereye zıplıyorsun? Önünü görmüyorsun ki." |
| Lodos | "Lodos var, uçup gitme. Akşama dolma var." |
| Poyraz | "Poyraz esiyor, atkını takmadan çıkma." |
| Patladıysa | "Ne bu koku?! Eve girmeden üstünü değiştir." |
| 0–2 kule | "Daha kapıdan çıkmadan düştün mü? Dizine buz koy, geliyorum." |
| Durağa vardıysa | "{Üsküdar'a} kadar gitmişsin! Dönerken simit al." |
| Genel | "Ekmek nerde? {N} kule mi zıpladın?!" / "Çay demlendi, soğutma." / "Annen aradı, seni sordu. Ne diyeyim?" / "Kapıcı seni çatıda görmüş. Rezil olduk!" |

**İç ses** — amcanın başının üstünde 2,4 sn düşünce balonu. Seyrek: en az 8 inişte bir ve yarı şansla; yarışta kapalı.

| Ne zaman | Balon |
|---|---|
| Kenara kıl payı iniş | "Kıl payı…" / "Ayakkabının yarısı dışarıda!" / "Bu çatı biraz yamuk sanki." / "Kalbim ağzıma geldi." |
| 3+ kule birden | "Uçtum mu ben?" / "Gençliğim geri geldi!" / "Bunu Hanım görseydi…" |
| Üst üste 3 tam orta | "Tam ortası, bak sen bana!" / "Usta işi." / "Göz değmesin." |
| Rekora 1 puan kala | "Rekor şurada…" / "Bir kule daha, bir kule daha…" |
| Başta 9 sn zıplamazsan | "Ee, zıplamayacak mıyız?" / "Çay soğuyor ama…" / "Dizlerim tutulacak." |

## 2. Lakap damgası
Oyun sonu kartında "🏷️ Lakabın: …" satırı; paylaşım kartında fotoğrafın köşesinde kırmızı "LAKAP" damgası; paylaşım mesajına da eklenir ("Lakabım: Üsküdar'da aceleci.").
Biçim: **{son durak}'da/de {sıfat}** — Kadıköy'de (durağa varamadıysan) … Rumeli Feneri'nde, sonrası "Gece seferinde".
Sıfat sırası: 0 puan → "kapıda kalan" · patladıysa → "gazı kaçan" · rekor (10+) → "rekortmen" · 4+ durak → "seyyah" · çok tam orta → "nişancı" · çok kule atlama → "aceleci" · kenar inişleri → "cambaz" · ortaya inişler → "temkinli" · diğer → "keyifli".

Simülatör (iPhone 17) kanıtı: `sim-hanim-lakap.png`, `sim-ic-ses.png`, `sim-paylasim-lakap.png`. Telefonda henüz görülmedi.

## 3. Kıvılcım örnek görselleri (onay bekliyor, oyuna bağlanmadı)
`ozel-yilbasi-sapka.png`, `ozel-cadilar-sapka.png`, `komsu-teyze-hali.png`, `kedi-uyuyan.png` (şeffaf PNG, Kıvılcım çıktısı, kopya). Şapkaların amcaya bindirilmiş önizlemesi: `sapka-onizleme.jpg` (yerleşim benim; yılbaşı x -30 y -150 genişlik 560, cadı x -30 y -215 genişlik 560, 516 px tuvalde).
Değerlendirmem: dört görsel de amcanın çizgi diliyle tutarlı (kalın kahverengi kontur, düz renk). Teyzenin pencere çerçevesi g018 cephelerindeki yeşil panjurlarla uyumlu. Kedi turuncu tekir, kuyruğu sarkıyor — çatı kenarına oturur.

## 4. Tur 2 — kabul edilen 4 görselin oyuna bağlanması (kullanıcı: "Kabul, devam et")
- **Özel günler** (`src/game/ozelGun.ts`): İstanbul tarihine göre menüde manşet (alt başlığın yerine), amcanın başında özel başlık, Hanım'ın o güne özel mesajları. Takvim: yılbaşı 24 Ara–1 Oca (Noel şapkası), 29 Ekim Cumhuriyet Bayramı, Cadılar Bayramı 30–31 Eki (cadı şapkası), 14 Şubat, Paskalya (Batı takvimi, 2026–2030 tablosu, −2/+1 gün), 23 Nisan, Hıdrellez 5–6 May. Şeker/Kurban Bayramı tarihleri doğrulanmadığı için eklenmedi. Başlık varken bere ve yağmur kasketi gizlenir; pijamada başlık kaybolur.
  - **Önizleme (geçici):** menüde BYZANTION yazısına dokununca özel günler sırayla görünür ("(önizleme)" etiketiyle); App Store öncesi `OZEL_GUN_TEST_TAP = false`.
- **Teyze ve kedi** (`src/game/mahalle.ts`): kulelerin ~%11'inde pencereden halı silkeleyen teyze, ~%11'inde çatının alt kısmında uyuyan kedi (ilk 3 kule boş, art arda aynısı yok). İniş yüzeyine girmezler (teyze cephede, kedi çatı tepesinin altında). Amca o kuleye inince teyze konuşur: ortaya → "Aferin oğlum!/Bravo, tam ortası!/Çok yaşa!", kenara → "Aaa! Düşeceksin!/Dikkat et, kenar!/Yüreğim ağzıma geldi!", diğer → "Oğlum in oradan!/Halıyı silkeliyorum, toz olma!/Annene söyleyeceğim!"; kedi "Miyav!/Mırr…". Kedi ilk kez görülünce adıyla (Tombili, Paşa, Duman…) deftere yazılır: "🐈 Tombili ile tanıştın! Kedi defteri: N" (cihazda saklanır). Defter ekranı ikinci kedi görselleriyle birlikte gelecek.
- Yerleşim yalnız transform ile (düzen özelliği değişmez, R066 kuralı).
- Simülatör: `sim-yilbasi-sapka.png`, `sim-yilbasi-hanim.png`, `sim-teyze-kedi.png` (test ayarıyla her kulede), `sim-teyze-tepki.png`.

## 5. Tur 2 Kıvılcım görselleri (8) — KABUL BEKLİYOR, oyuna bağlanmadı
`tur2/`: paskalya tavşan kulağı, bahar çiçek tacı, 23 Nisan kâğıt şapka, kalpli gözlük, bağıran komşu amca, alkışlayan çocuk, gerinen kedi, gri uyuyan kedi. Toplu görünüm `tur2/sekiz-gorsel.jpg`, başlıkların amcada önizlemesi `tur2/baslik-onizleme.jpg`.
Değerlendirmem: hepsi aynı çizgi dilinde. Gözlük önden çizilmiş; yandan bakan amcada biraz yapay duruyor (yan profil sürümü istenebilir).

## 6. Tur 2 görselleri bağlandı (kullanıcı: "Kabul, bağla")
- Başlıklar: Paskalya → tavşan kulağı, Hıdrellez → çiçek tacı, 23 Nisan → kâğıt şapka, 14 Şubat → kalpli gözlük (gözlük bere/kasketle birlikte takılır). 29 Ekim'de yalnız manşet.
- Pencereler: kulelerin ~%13'ünde pencere sakini — teyze (%40), bağıran komşu amca (%30), alkışlayan çocuk (%30); her birinin inişe göre kendi lafları (amca: "Aferin be!/Düşeceksin be!/Kiremitleri kırma!", çocuk: "Yaşasın! Bir daha!/Aaa!/Amca, bir daha zıpla!").
- Kediler: ~%11 kulede; adın sırasına göre turuncu tekir ya da gri kedi. Turuncu kedinin kulesine inince kedi uyanıp gerinir (gerinen görsel). Menüde "Kediler N/12" → kedi defteri (tanışılanlar resmiyle, diğerleri "???").
- Simülatör: `tur2/sim-komsular-gri-kedi.png`, `tur2/sim-kedi-defteri.png`, `tur2/sim-sevgili-gozluk.png`, `tur2/sim-paskalya.png`. Gerinen kedi ve çocuk/komşu amca lafları simülatörde inişle görülmedi (iniş tutturmak zor); telefonda bakılmalı.
