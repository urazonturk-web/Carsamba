# MERAK-2026-11-27 — Oyun tasarımı editörü (mekanik + merak döngüleri)

Okunanlar: brief.md, src/game/kurukafa.ts, stops.ts, procedural-course.ts, app/index.tsx kurukafa bölümü
(1688-1700, 1809-1810, 2989-3003, 3040-3060, 3178-3181), geçmiş raporlar (YARATICI-FIKIR-11-17, FIKIR-GELIR-11-18,
FIKIR-PUAN-11-20). Tekrar etmediklerim: hava, pil=şarj, kedi defteri, balkon seyircisi, düşüş repertuarı, günlük seri.

## Ana ilke: "Kule verisi aynı, deri değişir"
Bir kule koddaki karşılığıyla `{id, x, topY, width, cat}` demek. Zıplama, iniş, kamera ve puan yalnızca bu beş sayıyı okur.
Kurukafa zaten şunu gösterdi: ayrı bir karma (`skullHash`) kullanılınca RNG akışı hiç bozulmuyor. Aşağıdaki
her fikir aynı kurala bağlı. Yeni şey ya **(a)** `sceneAt(seed, id)` gibi saf bir işlevle hangi kulenin hangi
derisiyle (sprite takımı + arka plan) çizileceğini seçiyor, ya **(b)** kurukafa gibi yayın tepesinde duran, ayrı
karmayla yerleşen bir nesne oluyor, ya da **(c)** oturum dışında (menü, sonuç kartı, defter) yaşıyor.
`generateProceduralPlatform` ile `makeNextPlatform` çağrılarına dokunulmuyor, dünya x'i hiçbir zaman sıçramıyor.
Tek gerçek teknik risk şu: yeni derideki "görünen üst kenar" fizikteki `topY`/`width` ile çakışmazsa oyuncu fiziğin
bozulduğunu sanır. Çözüm: her yeni kule derisi ROOFTOP_ASSET_GEOMETRY'deki kapak oranlarına (capTopPx, capWidthPx)
göre çizilir ve mevcut alfa ölçüm betiğiyle doğrulanır.

---

## 1. IŞINLANMA — "Vapur jetonu / Aktarma" (derin tasarım)

**Nesne:** eski, delikli, sarı vapur jetonu. Kurukafanın kardeşi, ama farkı hemen anlaşılsın: parlıyor ve
etrafında küçük bir su halkası dönüyor. Kurukafa "kural değişiyor" demek, jeton "yer değişiyor" demek.

**Nerede çıkar:** `jetonAfter(seed, id)` fonksiyonu, kurukafa koduyla birebir aynı yapıda ama ayrı tuzla (`seed ^ 0x…`).
Kurallar: id ≥ 20 (oyuncu ilk turda önce kurukafayı tanısın), durak kulesine ve durak öncesi kuleye denk gelmez,
`id+1 … id+N+1` aralığında durak kulesi olmaz (aktarma durak sayacını hiç kesmez), aynı boşlukta kurukafa
olmaz, kurukafa etkisi sürerken de çıkmaz. Sıklık yaklaşık iki durakta bir. Kurukafadan nadir olmalı ki olay sayılsın.

**Alma anı:** uçuşa hiç dokunmaz, yörünge aynı kalır. Jeton cebe girer, rozet "⛴ Aktarma…" yazar. Işınlanma
uçuşun ortasında değil, **bir sonraki başarılı inişte** olur, çünkü iniş anı oyunun tek sakin anı.
Düşerse ışınlanma olmaz ve sonuç kartında şu satır çıkar: *"Cebinde jeton vardı: Yerebatan'a gidiyordun."*
Bu satır kendi başına "bir dahaki sefere" kancası (aşağıda 7. fikir).

**Geçiş (ne kadar sürer):** iniş toz efekti biter bitmez ekranı sağdan sola bir **vapur buharı / martı sürüsü
perdesi** süpürür. Örtme 180 ms, açılma 220 ms, toplam 400 ms. Perde ekranı tam kapladığı karede şunlar değişir: uzak arka plan,
arka mahalle şeridi, ses ortamı, amcanın durduğu kule dahil sonraki N kulenin derisi. Amca, kamera ve kule
koordinatları aynı yerde kalır. Perde açıldığında amca aynı duruşta ama başka bir yerde duruyor olur. Şarja basmak
engellenmez, çünkü şarj yalnız çömelme pozu üretir. Dokunma o an zaten nadirdir, ilk denemede ölçeriz.

**Ne kadar kalır:** N = 6 kule (v1'de sabit, sonra 5–8 arası rastgele). Sahnede tepe tabelası
"YEREBATAN · 6" yazar ve her inişte bir azalır (kurukafa sayacının kodu yeniden kullanılır).

**Nasıl döner:** N. inişten sonra aynı perde tersten geçer: *"Boğaz'a döndün · Kuzguncuk'a 4 kule kaldı."*
Durak tabelası, köprü ilerlemesi ve gökyüzü adımı hiç durmadan id'ye göre sürdüğü için dönüş doğal oluyor.
Gerçekte hiçbir yere gidilmedi, yalnız boya değişti.

**Oyuncu nasıl anlar:** (1) jeton farklı görünüyor, (2) cebe girince rozet, (3) perdeyle birlikte büyük
kartpostal yazısı ("YEREBATAN SARNICI"), (4) farklı ses (damla, yankı), (5) dönüş tabelası. Öğretici metin
gerekmez, oyuncu ilk seferde "bu ne?" der, ikinci seferde arar.

**Tohum ve kule dizisi:** `sceneAt(seed, id)` saf bir işlev ve tek girdisi "hangi jeton hangi id'de alındı" bilgisi
(`jetonTaken`, kurukafadaki `skullTaken` gibi). Kule dizisi jetonla da jetonsuz da bayt bayt aynı. Meydan/yarış
hayaletinde kule verisi değişmez, iki oyuncu aynı jetonu aynı yerde görür. Günün haritasında herkesin hedefi
aynıdır. Hedef şöyle seçilir: `destination = skullHash(seed ^ TUZ, id) → sahne listesi`. **Kanıt testi:**
çevrim dışı bir betik aynı tohumla 300 kuleyi jetonlu ve jetonsuz üretir, `{x, topY, width, cat}` eşitliğini
doğrular (physics-evidence yöntemi).

**Varış yerleri (hepsi "kule = dikey yapı" ile birebir örtüşüyor, dini motif yok):**
- **Yerebatan Sarnıcı**: kule = sütun, boşluk = karanlık su. Fener mevcut, ses ortamı: damla. *En güçlü "orası neresi?"*
- **Demirli vapurlar (Kadıköy iskelesi)**: kule = yan yana duran vapurların baca/kaptan köşkü, boşluk = su.
- **Galata Kulesi çevresi**: Karaköy çatıları, Galata Kulesi önde ve büyük. Aktarmanın son kulesi kulenin balkonu, kartpostal damgası da orada.
- **Kız Kulesi kayalıkları**: kule = deniz kayası (organik, çizmesi kolay). Durak 2'yle çakışır, sonraya kalsın.
- **Köprü halatları**: kule = askı halatlarının bağlandığı kirişler, alt tarafta trafik ışıkları akar. Gece çok güzel.

**Maliyet:** kod 2,5–3 gün (jeton yerleşimi kurukafadan kopya, sahne tablosu, perde, HUD, ses, kanıt betiği).
Görsel olarak her varış yeri için 1 uzak arka plan ve 3 kule derisi (uzun/orta/kısa), toplam 4. Jeton ikonu bir kez, 1 tane.
v1 için toplam 5 Kıvılcım çağrısı.
**En büyük risk:** deri kenarının fizikle çakışmaması (bkz. ana ilke). İkinci risk bellek: her sahne yeni dokular demek,
bu yüzden sahne girmeden 2 kule önce önden yüklenir, çıktıktan sonra serbest bırakılır.

---

## 2. Gizli yol: "Ara sokak" (beceri kapısı)
**Oyuncu:** durağa varmadan son 3 kuleye üst üste tam ortadan inerse durak tabelası bu sefer farklı çıkar:
*"Kestirme: Kuzguncuk ara sokağı"*. Sonraki 5 kule cumbalı, çamaşırlı, dar bir sokak derisine geçer.
**Merak:** tetikleyici hiçbir yerde yazmıyor ve kulaktan kulağa yayılıyor ("ortaya 3 kere in, bak ne oluyor").
**Çekirdek:** tam iniş zaten ölçülüyor (landing.ts). Kural katmanı yalnız derinin seçimini değiştirir, kule ve puan aynı kalır.
**Maliyet:** 1 gün kod, sokak başına 3–4 görsel. **Risk:** kimse bulamaz. Çözüm: 20. koşudan sonra teyze balonu ipucu verir.

## 3. Nadir olay takvimi (koşu başına %2–3)
**Oyuncu:** gece Boğaz'da bir yunus sürüsü atlar, sisli bir sabah ışıkları yanan eski bir buharlı vapur
geçer, dolunayda deniz yakamozla yanar. Her biri koşu başına küçük bir olasılıkla gelir, ilk görülüşte kartpostal damgası verir.
**Merak:** "Ben hayalet vapuru gördüm" gibi paylaşılabilir anekdotlar üretir. **Çekirdek:** yalnız arka plan, AmbientEvents.tsx'in üstüne biner.
**Maliyet:** olay başına 0,5 gün ve 1–2 görsel. **Risk:** çok nadir olursa kimse fark etmez. Defterdeki "?" yuvaları bunu çözer (4).

## 4. Koleksiyon: "Amcanın cep defteri"
**Oyuncu:** menüde bir defter açılır. İçinde aktarma varış yerleri, gizli yollar ve nadir olaylar için yuvalar var.
Görülmemiş yuvada yalnız silüet ve tek ipucu satırı durur: *"Suyun altında sütunlar…"*
**Merak:** boş yuva, oyunun en ucuz merak motoru. **Çekirdek:** oturum dışında yaşar, koda dokunmaz. Mevcut kartpostal koleksiyonunun yanına gelir.
**Maliyet:** 1,5 gün, silüetler mevcut görsellerden üretilebilir. **Risk:** liste kısa kalırsa çabuk biter. Her yeni sahne buraya bir yuva ekler.

## 5. Oturumlar arası sır: "Yırtık fotoğraf" (cüretkâr)
**Oyuncu:** her 5. durakta amcanın cebinden eski bir fotoğrafın bir parçası düşer. 7 parça birleşince fotoğraf
tamamlanır: genç amca, Rumeli Feneri'nde biriyle. Fotoğraf amcanın neden kuzeye zıpladığını açıklar.
Hikâye, oyunun "neden?" sorusuna verdiği cevap olur.
**Merak:** "sonraki parçada ne var?" Uzun soluklu, geri getiren bir kanca. **Çekirdek:** durak olayına bağlı, oyun içinde yalnız tek bir balon gösterir.
**Maliyet:** 1 gün kod, 1 fotoğraf görseli (parçalara kodla bölünür). **Risk:** anlatı editörüyle çakışabilir, ortak karar gerekir.

## 6. Ters Boğaz: "Su altı" aktarması (cüretkâr)
**Oyuncu:** çok nadir bir siyah jeton. Perde açılınca amca su altında. Kuleler batık gemi direkleri, arkada
ışık huzmeleri ve baloncuklar var, sesler boğuk. Fizik **aynı**, ağırlık hissini yalnız görsel sallanma ve ses veriyor.
**Merak:** "su altına nasıl gittin?!" Paylaşım kartında da en çarpıcı kare bu olur. **Çekirdek:** 1'deki altyapıyla aynı, yalnız deri ve ses değişir.
**Maliyet:** altyapı kurulduktan sonra 0,5 gün ve 4 görsel. **Risk:** oyuncu yerçekiminin de değişmesini bekler, değişmeyince "sahte" hisseder.
Bunu bilerek tasarlamak gerek: amca dalgıç gözlüğü takar, şaka buradan gelir.

## 7. "Bir dahaki sefere" sonuç kartı
**Oyuncu:** düşünce kartta tek satır çıkar: *"2 kule sonra bir jeton vardı"*, *"Bu haritada Galata'ya bir kapı var"*.
**Merak:** tohum belirlenimci olduğu için bunu kesin olarak biliyoruz. "Bir daha" düğmesine basma isteği burada doğar.
**Çekirdek:** kartta okuma yapar, oyuna dokunmaz. **Maliyet:** 0,5 gün, görsel yok. **Risk:** her seferinde gösterilirse bıktırır, en fazla 3 koşuda bir gösterilir.

## 8. Haftanın sırrı (cüretkâr, toplumsal)
**Oyuncu:** her hafta günün haritalarından birinde tek bir **altın jeton** var. Nerede olduğu yazmıyor.
Bulan kişi o haftanın damgasını alır ve paylaşım kartında "Bu haftanın sırrını buldum" yazar.
**Merak:** oyuncular birbirine "salı haritasında 37. kuleye bak" diye yazar. Oyun dışında konuşulan bir şey olur.
**Çekirdek:** daily.ts tohumu ve 1'deki jeton kodu, başka bir şey değil. **Maliyet:** 1 gün, 1 görsel.
**Risk:** sır bir saatte internete düşer. Zararı yok, zaten amaç paylaşılması.

## 9. Zaman aktarması: "1890" (cüretkâr)
**Oyuncu:** sepya bir jeton ve perde. Mevcut sahne eski kartpostal tonuna, film tanesine ve köşe kararmasına bürünür.
Arkada atlı tramvay geçer, amcanın başında fes var. 6 kule sonra renkler geri gelir.
**Merak:** "aynı yer, başka zaman". Yeni bir yer çizmeden en büyük şaşkınlığı yaratan fikir bu.
**Çekirdek:** yalnız renk. Projede Skia yok ve RN'de renk matrisi zor. Bu yüzden sepya dokular **betikle önceden üretilir**
(Kıvılcım gerekmez) ya da yarı saydam sıcak bir örtü kullanılır. **Maliyet:** 1–1,5 gün, 1–2 yeni görsel (tramvay).
**Risk:** dokular iki katına çıkar, bellek artar. Yalnız ön plan ve uzak arka plan sepyaya çevrilir.

## 10. Simge yapı durakları: "Kulenin tepesi"
**Oyuncu:** aktarmanın son kulesi simge yapının kendisi. Galata Kulesi'nin balkonu ya da köprü ayağının tepesi.
Oraya inince kamera değişmez, yalnız rüzgâr sesi gelir ve kartpostal anı başlar.
**Çekirdek:** yalnız o tek kulenin derisi değişir (genişlik aynı). **Maliyet:** 0,5 gün ve yapı başına 1 görsel. **Risk:** düşük.

---

## Bilerek dışarıda bıraktıklarım
- Uçuşta konum değiştiren portal (amcayı başka bir kuleye atar): kule dizisini, puanı ve kamerayı bozar. **Hayır.**
- Varış yerinde fiziği değiştirmek (ay yerçekimi, su altında yavaşlık): çekirdeği bozar, ayrı onay ister.
- Varış yerinde kuleleri farklı üretmek: tohum adaletini (meydan, günün haritası) bozar.
- Cami, minare, kubbe, dini mekân: brief gereği dışarıda.

## Benim 1 numaram: Vapur jetonu → Aktarma, ilk varış yeri Yerebatan Sarnıcı
**Neden:** kullanıcının istediği ışınlanmayı tam karşılıyor ve çekirdeğe sıfır dokunuyor. Kule verisi aynı kalıyor,
yalnız deri değişiyor. "Sütun = kule" eşleşmesi sahnelerin en doğalı, kavramsal zorlama yok. Karanlık uzak arka plan
ucuz, mevcut fener yeniden kullanılıyor, damla ve yankı sesiyle fark iki saniyede hissediliyor. Altyapı bir kez kurulunca
her yeni sahne yalnız 4 görsel tutuyor. 4, 6, 8, 9 ve 10. fikirler de bu altyapının üstüne biniyor.
Yani bu tek fikir değil, bir platform.

**İlk sürüm için en küçük deneme ("Deneme 0", 1 gün, Kıvılcım çağrısı yok):**
1. `jeton.ts`: `jetonAfter` ve `sceneAt`. Kurukafa dosyasının kopyası, ayrı tuz, id ≥ 20, durak koruması.
   Deneme bayrağı açıkken ilk jeton tohumdan bağımsız olarak 22. kulede çıkar.
2. Jeton için geçici görsel: kurukafa PNG'si, `tintColor` ile sarıya boyanmış.
3. Perde için düz beyazımsı bir buhar dikdörtgeni, 400 ms.
4. "Sarnıç" derisi için görsel yok: mevcut kuleler koyu laciverde boyanır (tint), gökyüzü siyaha yakın,
   uzak arka plan gizlenir, fener açılır, hava efekti kapanır, banner "YEREBATAN SARNICI · 6" olur, damla sesi eklenir.
5. 6 iniş sonra ters perde ve "Boğaz'a döndün" yazısı.
6. Kanıt betiği: aynı tohumla 300 kule, jetonlu ve jetonsuz `{x, topY, width, cat}` birebir eşit.

TestFlight'ta tek soru sorulur: *"Siyah bölüm geldiğinde ne hissettin?"* Cevap "vay, neredeyim?" ise 5 Kıvılcım
çağrısıyla gerçek sarnıç görselleri yapılır (sütun derileri ROOFTOP kapak oranlarına göre çizilir). Cevap "ekran karardı" ise
sahneyi değil perdeyi ve tabelayı düzeltiriz.
