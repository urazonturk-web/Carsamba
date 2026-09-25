# Claude sonuç raporu — uzun (2-3 kuleli) atlayışlar: kanıt toplama (fizik DEĞİŞTİRİLMEDİ)

> **⚠️ 15 Eylül güncellemesi — bu belgedeki TÜM tam-parkur taramaları (Bölüm 2 ve Bölüm 3'teki kule-geçiş pencere tabloları) ARTIK GEÇERSİZ SAYILMALI (SUPERSEDED).** Simülasyon, karakterin her atlayışta kulenin SOL KENARINDAN (`launch.x`) başladığını varsayıyordu; gerçek kodda karakter kulenin ORTASINDAN (`first.x+first.width*0.5`) atlıyor — yaklaşık yarım-kule-genişliği (~30 birim) hata. Bu, BU belgedeki "10 kuleden 7'si ıskalıyor" gibi kesin sayıları YAKLAŞIK doğru yönde ama GÜVENİLMEZ kılıyor. **Bu sayılar hiçbir ayarlama kararını haklı çıkarmak için KULLANILMAMALI.** Ayrıntı ve düzeltme: CLAUDE_UPPERCHARGE_EXPERIMENT.md Bölüm 9, ve tek-atlayış doğrulaması için Bölüm 18 (bu belgenin sonunda).

Tarih: 14 Eylül 2026. Bu belge, önceki iki turun (ilk taslak + kullanıcının iki metodolojik düzeltmesi) üzerine, TEK, tutarlı bir rapor olarak yeniden yazıldı. Önceki taslaktaki bazı iddialar (aşağıda açıkça belirtildiği gibi) hatalıydı veya aşırı basitleştirmeydi; bunlar burada DÜZELTİLDİ, önceki halleriyle tekrarlanmadı. **Bu turda da hiçbir fizik/kod değişikliği yapılmadı.** Kullanıcıyla üzerinde anlaşılan tek şey, fiziğe dokunmadan önce kanıt toplamaktı — "bunun bir tasarım meselesi olduğu" konusunda bir mutabakat YOKTU, bu önceki taslakta yanlış yazılmıştı ve buradan çıkarıldı. Kullanıcıdan bir şarj-uyarısı arayüzü de istenmedi; böyle bir öneri de çıkarıldı. Commit/push yok, cihaz testi (benim tarafımdan) yapılamadı.

## Özet

1. **Cihaz videosu** (`17-48-32`): Aynı hayatta art arda 3 kez tam şarja (%100) kadar beklenmiş ve üçü de karakteri iki kule arasındaki boşluğa düşürüp öldürmüş (skor "0" olarak 3 atlayış boyunca sabit kaldı, doğrulandı).
2. **Düzeltilmiş simülasyon** (gerçek `advanceFlight` + gerçek `findFootLanding`, TÜM kulelere karşı, tek bir hedef değil): yalnızca `c=1.0`'ı test etmek yanıltıcıydı. Şarjın TAMAMINI (0-%100) tarayınca, her başlangıç kulesinde AYRI AYRI, artan şarjla birlikte 1-kule, 2-kule, 3-kule atlama pencereleri ortaya çıkıyor — 2 kule atlamak için gereken şarj kuleye göre %54-86 arasında değişiyor (yakın-maksimum DEĞİL); 3 kule atlamak için gereken şarj da kuleye göre **%87-99** arasında değişiyor (kendi tablomdaki kule6→9 örneği %87'de — "3 kule atlamak tutarlı şekilde ~%99 gerektirir" ifadesi YANLIŞTI, bu tabloyu kendim üretmiş olmama rağmen genellemede hataydı; düzeltildi).
3. **Referans Spring Ninja görüntüsü** (`reference-course.ts`'in kaynağı olan `11-12-55` videosu): Kesin olarak kule6→kule8 arası (2 kule atlayan) bir sıçrama tespit edildi ve indeksler İKİ bağımsız yükseklik-örüntüsü eşleşmesiyle doğrulandı. Bu TAM geometriden bizim simülasyonumuzda gereken şarj: **%54 (243ms)**. Referans videoda görünen sıkışma penceresi ~50-150ms (kesin dokunma süresi değil, aşağıda Bölüm 3'te detaylı) — yani bizim gereken basışımız (243ms) referanstaki görünür sıkışmadan (50-150ms) yine de belirgin şekilde uzun, ama önceki taslakta iddia edildiği gibi "maksimuma yakın" DEĞİL.
4. **Zamanlama tutarlılığı yeniden kontrol edildi ve bir ölçüm hatası bulundu**: Önceki turda "iniş ~0.92s" dediğim değer, GERÇEKTE karakterin kuleye çoktan konup YERLEŞMEKTE olduğu bir anı (t=40.0, skor güncellemesi) esas alıyordu — gerçek ilk temas çok daha erken (t≈39.64) gerçekleşmiş. Ayrı ayrı uydurulmuş çıkış/iniş parabolleri (Bölüm 3.3) bunu düzeltti: çıkış 0.436s, iniş 0.535s, toplam uçuş 0.971s. **Bu düzeltme, "referansın inişi bizden daha yavaş" iddiasının dayandığı kanıtı ORTADAN KALDIRIYOR** — önceki %41'lik fark bir ölçüm hatasıydı. Kalan belirsizliği Monte Carlo ile SAYISALLAŞTIRDIM (Bölüm 3.3): düzeltilmiş sayılarla beklenen yer değiştirme %90 güven aralığında [112,325]px çıkıyor; gerçek ölçülen fark (~299-304px) bu aralığın İÇİNDE ama üst ucuna yakın (~90. yüzdelik dilim) — istatistiksel olarak dışlanmıyor ama "neredeyse özdeş" de DEMİYORUM; nokta tahmini gerçek değerden ~1.15 standart sapma düşük kalıyor.
5. **Sonuç durumu**: Kod hâlâ değiştirilmedi, fizik/config'e dokunulmadı. Kanıtlar netleşti ama HÂLÂ TEK bir referans örneğine (kule6→8) dayanıyor. Basış-süresi karşılaştırması (243ms vs ~50-150ms) hâlâ bir VEKİL ölçüme dayanıyor — gerçek parmak dokunma/kaldırma anı DEĞİL. Bu yüzden bu veriyle YENİ bir şarj eğrisi/fizik değişikliği yapılmıyor; bir sonraki adım Bölüm 5'teki, parmağın ekrana dokunuşunu doğrudan gösteren harici kayıt önerisi.

---

## 1. Cihaz kanıtı — 3 art arda %100 şarjlı atlayış, üçü de ölümcül

`17-48-32` videosunda t≈35-44s arası: karakter yeni bir hayata başlıyor, art arda üç kez tam şarja kadar bekliyor (629ms, 654ms, 529ms — hepsi 450ms'lik maksimum şarj süresini aştığı için aynı %100 şarjı, dolayısıyla aynı fizik değerlerini üretiyor). Skor alanı kare kare yeniden okundu: **skor bu üç atlayış boyunca "0" kaldı, üçüncü atlayıştan hemen sonra "Game Over" ekranı çıktı.** Üçüncü atlayış (529ms) piksel piksel izlendi: karakterin ayakları, hedef kulenin üst yüzeyi ekrandaki sabit kamera-kilitli x-konumuna ulaşmadan önce zaten o yüksekliğin altına inmişti; karakter üç kuleyi de altlarından geçip düştü.

## 2. Düzeltilmiş simülasyon metodolojisi

Önceki taslakta iki hata vardı, ikisi de burada düzeltildi:

- **Hata 1**: "`maxJumpVX`/`maxJumpVY`'yi azaltmak yalnızca üst ucu etkiler, kısa/orta basışlara dokunmaz" — YANLIŞ. Formül `vx = min + c×(max-min)` olduğu için `max`'ı değiştirmek HER `c>0` için sonucu değiştirir.
- **Hata 2**: "Menzil şarjın karesiyle büyür" — bu yalnızca eşit iniş/kalkış yüksekliği ve sıfır minimum hız varsayımı altında geçerli bir yaklaşıklıktı; gerçek kulelerin yükseklik farkları düzensiz ve minimum hızlar (`minJumpVX=80`, `minJumpVY=220`) sıfır değil.
- **Hata 3 (bu turda düzeltildi)**: Yalnızca `c=1.0`'ı test edip "%100 şarj gerekiyor" sonucuna varmak yanıltıcıydı — şarjın TAMAMI taranmadan bu iddia kurulamaz.

Bu turda simülasyon üç şekilde sağlamlaştırıldı: (a) gerçek `advanceFlight` ile adım adım (1/240s) ilerletiliyor; (b) her adımda gerçek `findFootLanding` (asimetrik `footSoles`, `CHARACTER_WIDTH*0.8` gövde genişliği) parkurdaki TÜM kulelere karşı çalıştırılıyor, yalnızca "hedef" kuleye değil; (c) şarj 0'dan %100'e kadar 0.01 adımlarla TAM taranıyor.

**Sonuç — 5 farklı başlangıç kulesinden tam şarj taraması:**

```
kule0: c=0.00->kule0(0) | c=0.85(383ms)->kule1(skip1) | c=0.92+ -> IŞKALIYOR
kule3: c=0.55(248ms)->kule4(skip1) | c=0.86(387ms)->kule5(skip2) | c=0.99(446ms)->kule6(skip3)
kule6: c=0.32(144ms)->kule7(skip1) | c=0.54(243ms)->kule8(skip2) | c=0.87(392ms)->kule9(skip3)
kule7: c=0.32(144ms)->kule8(skip1) | c=0.73(329ms)->kule9(skip2) | c=0.99(446ms)->kule10(skip3)
kule9: c=0.54(243ms)->kule10(skip1)| c=0.85(383ms)->kule11(skip2)| c=0.99(446ms)->kule12(skip3)
```

(Her aralıkta belirtilmeyen şarj değerleri IŞKALIYOR — kuleler arasında dar ama gerçek "boş" pencereler var.)

**Düzeltilmiş sonuç**: 2 kule atlamak için gereken şarj kuleye göre **%54-86 (243-387ms)** arasında değişiyor — bu ORTA-YÜKSEK bir aralık, ama "neredeyse maksimum" DEĞİL. 3 kule atlamak için gereken şarj **%87-99 (392-446ms)** arasında değişiyor — yukarıdaki tabloda kule6→9 %87'de (392ms), diğer üçü ~%99'da (446ms). Önceki taslakta "yalnızca 3 kule atlamak tutarlı şekilde ~%99 gerektirir" yazmıştım — bu, kendi ürettiğim tabloda kule6→9'un %87 olduğunu gözden kaçırdığım için YANLIŞTI, düzeltildi. Genel olarak: 3-kule atlamak HÂLÂ üst şarj aralığında yoğunlaşıyor (hepsi %87'nin üzerinde) ama "tutarlı şekilde ~%99" tek bir sayıya indirgemek yanlış. Önceki taslaktaki "2-3 kule atlamak için maksimum şarj gerekiyor" ifadesi de bu yüzden GERİ ÇEKİLDİ — yalnızca `c=1.0` test edildiği için doğru kurulmamış bir sonuçtu.

## 3. Referans video — kalkış/iniş kulelerinin KESİN kimliği + basış süresinin yeniden incelenmesi

### 3.1 Kule indekslerinin kesinleştirilmesi

`reference-course.ts`'in kaynağı olan `ScreenRecording_09-13-2026 11-12-55_1.MP4` videosunda t≈38.7-40.0s'de bir 2-kule-atlama örneği bulundu (skor 8→12, "+4"). Kalkış ve iniş kulelerinin TAM `REFERENCE_COURSE` indekslerini belirlemek için, videodan doğrudan ölçülen kule başlıklarının GÖRECELİ yükseklik örüntüsünü (kamera yakınlaştırmasından bağımsız, kule genişliğine normalize edilmiş oranlar) `REFERENCE_COURSE`'daki ardışık `topY` farklarıyla eşleştirdim:

- **Kalkıştan hemen önce** (t=38.0), 4 kule net şekilde ölçüldü (piksel-tabanlı kule-başlığı algılama, göz kararı değil): göreli yükseklik farkları ölçülen kuleler arasında (+4.6, +38.7, +39.2 ham birim) — bu, `REFERENCE_COURSE`'da yalnızca kule **5→6→7→8** dizisinde (fark: +5, +38, +38) bulunan örüntüyle eşleşiyor. Karakter bu dörtlünün 2.'sinde, yani **kule6**'da duruyordu.
- **İnişten hemen sonra** (t=40.0), 3 kule ölçüldü: iki eşit-yükseklikte kule arasında bir kısa kule (karakterin durduğu). Bu, `REFERENCE_COURSE`'daki kule **7 (topY=-108), 8 (topY=-70), 9 (topY=-108)** dizisiyle (7 ve 9 eşit, 8 arada kısa) tam eşleşiyor; karakter kısa olan ortadaki kulede, yani **kule8**'de duruyordu.

İki bağımsız ölçüm (kalkıştan önce ve inişten sonra) aynı sonuca varıyor: **kalkış = kule6, iniş = kule8** (2 kule atlanıyor, +2 puan × 2 bonus = +4 — skorla tam tutarlı).

### 3.2 Basış (görünür sıkışma) süresinin yeniden incelenmesi — ÖNCEKİ İNİŞTEN itibaren

Önceki turda yalnızca kalkıştan hemen önceki ~0.5 saniyeyi inceleyip "~60-100ms'lik kısa bir sıkışma" bulmuştum. Bu turda, bunun sıkışmanın yalnızca SON kısmı olup olmadığını kontrol etmek için, BİR ÖNCEKİ İNİŞTEN (kule6'ya inişten, t≈37.78) kalkışa (t≈38.70) kadar olan TÜM ~0.92 saniyelik pencereyi, native (60fps) çözünürlükte, karakterin gövde/yay üst sınırının pikseldeki konumunu izleyerek yeniden taradım:

- **t=37.78 - t=38.65 (yaklaşık 870ms)**: Ölçülen üst sınır konumu TAMAMEN SABİT — hiçbir sıkışma, hiçbir hareket yok. Karakter bu süre boyunca kanıtlanabilir şekilde durgun/rahat halde.
- **t≈38.65 - t≈38.72 (~50-70ms)**: Küçük ama gerçek bir değişim (yay kısalması) ölçülüyor.
- **t≈38.70 - t≈38.75**: Fırlatma (hızlı yukarı hareket) başlıyor.

**Düzeltilmiş/güçlendirilmiş sonuç**: Önceki "~60-100ms" iddiası bu turda daha geniş bir pencerede yeniden test edildi ve DOĞRULANDI — bu, daha uzun bir sıkışmanın son kısmı DEĞİL; ondan önceki ~870ms kanıtlanabilir şekilde tamamen durgun. Ancak şu net ayrım yapılmalı: bu, GÖRÜNÜR sıkışmanın süresidir — parmağın ekrana değdiği GERÇEK an, sıkışma görsel olarak fark edilir hale gelmeden önce olabilir (örn. oyunun kendi iç eşiği/gecikmesi varsa). Elimde bunu ne doğrulayacak ne çürütecek kanıt yok; bu yüzden **"basış süresi kesin olarak 50-150ms'dir" DEMİYORUM** — diyebileceğim, "görünür sıkışma penceresi 50-150ms'dir ve bundan önce en az 870ms boyunca hiçbir sıkışma belirtisi yoktur."

### 3.3 İç-tutarlılık kontrolü — bir ölçüm hatası bulundu ve düzeltildi

Kullanıcı, önceki turda rapor edilen sayılarla (çıkış 0.38s, iniş 0.92s, önceden ölçülmüş referans-oyun native yerçekimi ~4666 px/s²) bir iç tutarsızlık olduğunu gösterdi: `0.5 × 4666 × (0.92² − 0.38²) ≈ 1638px` bekleniyor, ama kule6→8 arası gerçek yükseklik farkı yalnızca ~299-304 native px (76 ham birim × ~3.93-4.0 px/ham birim). **~5.4× fark** — bu, sabit yerçekimini ÇÜRÜTMÜYOR, sayılarımın aynı anda hem sabit yerçekimini hem gerçek geometriyi tarif edemeyeceğini gösteriyordu.

Bunu çözmek için üç şey yapıldı: (1) karakterin kırmızı şerit (kafa bandı) özelliği, dar bir x-penceresinde (sabit kamera-kilitli x etrafında), TÜM uçuş boyunca 60fps native çözünürlükte yeniden izlendi — önceki gibi "gövde/yay üst sınırı" gibi karışık bir özellik değil, tek, sürekli bir işaret; (2) çıkış ve iniş ayrı ayrı, bağımsız ikinci-derece (parabol) eğrilerle uydurulup (`numpy.polyfit`) kalıntılar (residual) raporlandı; (3) "iniş anı"nın gerçekte kuleye ÇOKTAN KONUP YERLEŞMİŞ bir an olup olmadığı kontrol edildi.

**Bulgu — (3) doğru çıktı**: Önceki "iniş t=40.00" değeri, aslında karakterin skorun güncellendiği (t=40.0) bir kareydi, GERÇEK ilk temas değil. Kare kare izlenen Y-eğrisi, t≈39.65-39.667'de düz, hızlanan bir düşüşten aniden sıçrayıp (temas darbesi) sonra birkaç salınımla (`t≈39.65→39.97`) yerleşiyor; t=40.0, karakterin çoktan ~0.35 saniyedir kulede DURMAKTA olduğu bir andı.

**Ayrı uydurulan parabol sonuçları:**

```
ÇIKIŞ (t=38.667-39.067, 25 örnek): y=A t²+B t+C
  A'dan yerçekimi = 4429.8 px/s²   kalıntı RMS=7.78px (max 13.84px) -- İYİ uyum
  uydurulan apeks zamanı = 39.103s (kalkıştan 0.436s sonra)

İNİŞ (t=39.067-39.650, ilk temas öncesi son temiz nokta): y=A t²+B t+C
  A'dan yerçekimi = 4647.0 px/s²   kalıntı RMS=7.07px (max 14.51px) -- İYİ uyum
  (bu değer, kullanıcının bahsettiği önceden-ölçülmüş ~4666 px/s²'ye çok yakın)

İniş parabolünün, karakterin nihai dinlenme Y'sine (1507.7, ölçülen) ulaştığı an -> gerçek ilk-temas ≈ t=39.638s
```

**Sonuç — düzeltilmiş zamanlama**: çıkış = **0.436s**, iniş (apeksten gerçek ilk temasa) = **0.535s**, TOPLAM uçuş = **0.971s** (önceki 1.30s DEĞİL — önceki sayı ~0.33s'lik "kulede zaten durma" süresini yanlışlıkla iniş süresine dahil ediyordu). **Önceki turda rapor edilen "referansın inişi bizden %41 daha yavaş" bulgusu, tam olarak yanlış iniş-anı seçiminden kaynaklanıyordu — düzeltilmiş ilk-temas anıyla bu kanıt ORTADAN KALKIYOR.** Referansın bizim fiziğimizden daha yavaş/farklı bir iniş fiziğine sahip olduğuna dair kanıt YOK.

**Belirsizliğin nicel olarak hesaplanması** (bir önceki turda "makul ölçüm belirsizliği içinde" demiştim ama bunu sayısallaştırmamıştım — kullanıcı haklı olarak bunu istedi): İki parabol uydurmasının kendi parametre kovaryanslarını (`numpy.polyfit(..., cov=True)`) ve dinlenme-Y'sinin kendi ölçülen dağılımını (16 örnek, ortalama 1510.1px, standart sapma 7.8px) kullanarak 200.000 denemelik bir Monte Carlo simülasyonu çalıştırdım (her denemede uydurma parametreleri ve dinlenme-Y kendi tahmini dağılımlarından rastgele örneklendi, apeks zamanı/temas zamanı/beklenen yer değiştirme yeniden hesaplandı):

```
apex_t:        39.104s ± 0.014s  (%90 aralık: [39.082, 39.128])
contact_t:     39.639s ± 0.003s  (%90 aralık: [39.634, 39.644])
çıkış süresi:  0.436s  ± 0.014s  (%90 aralık: [0.415, 0.461])
iniş süresi:   0.536s  ± 0.015s  (%90 aralık: [0.510, 0.558])
toplam uçuş:   0.972s  ± 0.003s  (%90 aralık: [0.967, 0.977])
beklenen yer değiştirme (g=4666 sabit): 225px ± 65px  (%90 aralık: [112, 325]px)
```

**Gerçek ölçülen yükseklik farkı (~299-304px), bu %90 aralığın ([112,325]px) İÇİNDE ama ÜST UCUNA yakın — dağılımın ~90. yüzdelik dilimine denk geliyor.** Yani istatistiksel olarak DIŞLANMIYOR (tamamen tutarsız değil) ama nokta-tahminiyle (225px) tam örtüşmüyor de — nokta tahmini gerçek değerden ~75px (yaklaşık 1.15 standart sapma) düşük kalıyor. Bunu "neredeyse tam örtüşüyor" diye sunmuyorum; dürüst özet şu: **düzeltme, önceki 5.4×'lük büyük tutarsızlığı ortadan kaldırdı ve kalan fark artık istatistiksel olarak anlamlı bir çelişki oluşturmuyor, ama mükemmel bir eşleşme de değil.** Kalan farkın olası kaynağı: ayrı uydurulmuş iki parabolün kesişim noktasındaki (apeks civarı) küçük süreksizlik, kare-örnekleme çözünürlüğü (16.7ms) ve dinlenme-Y'nin kendi doğal salınımı.

**Her iki segmentin de kendi içinde iyi bir sabit-yerçekimi uyumu vermesi** (ayrı ayrı 4430±258 ve 4647±92 px/s², birbirine ve önceden bilinen ~4666 değerine istatistiksel olarak tutarlı) **referans oyunun BAŞKA/daha yavaş bir iniş fiziğine sahip olduğuna dair kanıt sunmuyor** — kullanıcının uyardığı gibi, "farklı iniş fiziği" sonucuna atlamadan önce ölçüm hatası (burada: yanlış iniş-anı seçimi) arandı ve gerçekten bulundu.

Kamera doğrulaması da ayrıca yapıldı: uçuş boyunca sabit kalması gereken kule7/kule8'in ekran-Y'si (t=38.70'ten t=39.90'a) SABİT ölçüldü (1500 ve 1654, değişmedi) — kamera dikey hareket etmiyor, karakterin ekran-Y'si ek düzeltme gerekmeden dünya-Y'nin geçerli bir vekili.

### 3.4 Düzeltilmiş karşılaştırma — referans vs bizim simülasyonumuz (aynı kule6→8 geometrisi)

```
                  Referans (düzeltilmiş, %90 belirsizlik aralığıyla)   Bizim simülasyonumuz (c=0.54)
Çıkış (apeks)     0.436s [0.415, 0.461]                                 0.408s   <- aralığın hemen altında/sınırında
İniş (apeksten)   0.536s [0.510, 0.558]                                 0.542s   <- aralığın İÇİNDE
TOPLAM uçuş       0.972s [0.967, 0.977]                                 0.950s   <- aralığın DIŞINDA (biraz kısa)
```

Önceki taslaktaki "iniş fazımız referanstan %41 daha hızlı" iddiası **GERİ ÇEKİLDİ** (Bölüm 3.3) — bir ölçüm hatasıydı. Ama düzeltilmiş sayılarla da **"uçuş dinamikleri neredeyse özdeş" DEMİYORUM** — iniş süresi belirsizlik aralığının içinde örtüşüyor, ama toplam uçuş süresi (0.95s) referansın dar %90 aralığının (0.967-0.977s) biraz dışında kalıyor. Kısacası: **önceki büyük, yanlış "referans %41 daha yavaş" iddiası ortadan kalktı; yerine, küçük ve kesin olmayan bir kalan fark var, "neredeyse özdeş" değil.**

### 3.5 Basış süresi karşılaştırması — hâlâ yalnızca bir VEKİL, ölçülmüş bir dokunma süresi DEĞİL

Kule6→8 için bizim simülasyonumuzun gerektirdiği şarj: **c=0.54, yani 243ms.** Referansta ölçülen GÖRÜNÜR sıkışma penceresi: ~50-150ms. **Bunun altını tekrar çizmek gerekiyor: bu, ekrandaki yay animasyonunun ne zaman değiştiğinin ölçümüdür — parmağın ekrana DOKUNDUĞU ve ekrandan KALKTIĞI gerçek anların ölçümü DEĞİLDİR.** Oyunun kendi iç gecikmesi (dokunma→görsel tepki) veya animasyon eşiği gibi bilinmeyen faktörler, gerçek dokunma süresini bu görünür pencereden sistematik olarak farklı kılabilir — yönü veya büyüklüğü hakkında elimde kanıt yok. Bu yüzden **243ms ile 50-150ms arasındaki farkı bir "basış süresi farkı" olarak KESİNLEŞTİRMİYORUM** — yalnızca "mevcut vekil ölçüme göre, gereken şarjımız görünür sıkışma penceresinden uzun görünüyor" diyebilirim; bunun gerçek dokunma süresiyle karşılaştırıldığında da geçerli olup olmayacağı bilinmiyor.

## 4. Bu bulgunun sınırları

- Kesinleştirilmiş TEK bir referans örneği var (kule6→8). Başka bir "+N" olayı (~t=76-77, muhtemelen "+5") bu turda indeks düzeyinde kesinleştirilmedi.
- Referansın gerçek dokunma başlangıç anı bilinmiyor — yalnızca görünür sıkışmanın ~50-150ms'lik bir pencerede olduğu ve öncesindeki ~870ms'nin durgun olduğu biliniyor.
- Çıkış/iniş parabolleri BAĞIMSIZ (birbirine zorlanmadan) uydurulduğu için apeks anında küçük bir süreksizlik olabilir; bu, düzeltilmiş tutarlılık kontrolündeki (%90 aralığı [112,325]px, gerçek değer ~90. yüzdelik dilimde) kalan sapmayı açıklayabilir (Bölüm 3.3).
- **Basış süresi karşılaştırması (243ms vs ~50-150ms) hâlâ EKRANDAKİ GÖRSEL VEKİLE dayanıyor, gerçek parmak-dokunma/kaldırma ölçümüne değil** (Bölüm 3.5) — bu, mevcut kanıtın en zayıf halkası ve bir sonraki adımın (Bölüm 5) tam olarak neden gerekli olduğu.

## 5. Gereken sonraki kanıt — parmağın ekrana dokunuşunu/kalkışını DOĞRUDAN gösteren harici kayıt

Mevcut kayıtlar (`11-12-55`, `13-48-05`, `16-41-31`, `17-48-32`) yalnızca EKRAN kaydı — bunlarda basış süresi, ekrandaki yay-sıkışma animasyonundan DOLAYLI olarak (bir vekil üzerinden) çıkarsanıyor. Bu, gerçek dokunma süresini doğrudan ölçmüyor ve oyunun kendi iç gecikmesi/eşiği yüzünden sistematik olarak farklı olabilir.

**İstenen kayıt**: Telefonun EKRANI VE OYUNCUNUN PARMAĞI aynı anda görünecek şekilde, HARİCİ bir kamerayla (telefonu tutan elin/parmağın üstten veya yandan çekildiği, ekranın da net okunabildiği bir açı) çekilmiş bir Spring Ninja oturumu — tercihen 60fps (veya cihazın kaldırdığı en yüksek fps). İçermesi gerekenler:
- Birkaç KISA basış (tek kule ileri, hafif dokunuş),
- Birkaç ORTA basış,
- Birkaç UZUN/2-3 kule atlayan basış,
- Her basış arasında ~1-2 saniye duraklama (art arda acele etmeden, böylece her basış net şekilde ayrıştırılabilir).

Bu kayıtla yapılacaklar: (1) parmağın ekrana DEĞDİĞİ ve ekrandan KALKTIĞI kareler doğrudan (kare kare) tespit edilip, video kare hızının getirdiği ±1 kare (örn. 60fps'de ±16.7ms) belirsizlik payıyla basış süresi hesaplanacak; (2) bu doğrudan ölçülen basış süresi, aynı anda ekranda görünen şarj/sıçrama tepkisiyle eşleştirilecek; (3) bu, Bölüm 3.5'teki "50-150ms görsel vekil" tahminini gerçek bir ölçümle değiştirecek. **Bu kanıt elde edilene kadar, yalnızca 50-150ms'lik görsel tahmine dayanarak yeni bir şarj eğrisi veya fizik değişikliği önerilmeyecek/uygulanmayacak.**

## 6. Bu turda değiştirilmeyenler

- `src/game/jump.ts`, `src/game/config.ts`, `src/game/reference-course.ts`, `src/game/landing.ts`, `app/index.tsx` — HİÇBİRİ değiştirilmedi.
- Önceki turun düzeltmesi (zaman-damgası tabanlı şarj hesabı, kısa/orta basışların iyileştirilmiş tepkisi) DOKUNULMADAN duruyor.
- Herhangi bir UI/uyarı özelliği eklenmedi — bu hiçbir turda istenmedi.
- Yedek almaya gerek olmadı (kod değişikliği yok).

## 7. Testler

- `node work/check-charge-timestamp.cjs`, `check-measurement-sept14.cjs`, `check-foot-landing.cjs` — hepsi hâlâ PASS (koda dokunulmadı).
- Bu turdaki tüm sayısal sonuçlar gerçek `jump.ts` + `landing.ts` + `reference-course.ts` çalıştırılarak üretildi (ayrı bir simülasyon değil).

## 8. Durum

Kod DEĞİŞTİRİLMEDİ. Kanıt toplama konusunda anlaşmıştık — bir sonraki adım, kullanıcının Bölüm 5'teki yeni kayıt önerisini değerlendirmesi veya mevcut kanıtla (tek örnek, Bölüm 4'teki sınırlamalarla) ilerlemeye karar vermesidir.

---

## 18. YENİ TUR — üst-şarj denemesi KAPATILDI; TEK, doğrulanmış bir gerçek atlayış örneği (kule0, 629ms)

### 18.1 Üst-şarj denemesi — kapatıldı, uygulanmadı

`CLAUDE_UPPERCHARGE_EXPERIMENT.md`'de tasarlanan "yalnızca üst şarj bölgesini değiştiren" deneme (Bölüm 9-11'de düzeltilmiş kalkış konumuyla yeniden hesaplandı) **KAPATILDI**: kazanç (3 geçişte +19ms) ile kayıp (3 geçişte −6 ila −12ms) büyüklük ve sayı olarak dengeliydi — net bir fayda yoktu. **Bu deneme UYGULANMADI ve daha fazla üstel denenmedi.** Bu konu kapanmıştır.

### 18.2 ÖNEMLİ metodolojik düzeltme — yalnızca İLK atlayış "ortalanmış" kalkışa sahip

Kullanıcı kritik bir noktayı düzeltti: `first.x + first.width * 0.5` formülü yalnızca `initWorld()` içinde, yani bir hayatın EN BAŞINDAKİ (kule0'daki) kalkış için geçerli. Bundan SONRAKİ her atlayış, `px.value = cx` (yani `findFootLanding`'in bulduğu GERÇEK temas noktası `contact.x`) ile, yani BİR ÖNCEKİ inişin tam olarak NEREDE gerçekleştiğine bağlı bir noktadan başlıyor — bu, kuleyi ORTALAMAK ZORUNDA DEĞİL, `footSoles` toleransı içindeki HERHANGİ bir nokta olabilir. **Bu yüzden, "her atlayışı kule-merkezinden başlat" varsayımı yalnızca hayatın İLK atlayışı için doğrudur; sonraki atlayışlar için gerçek başlangıç konumu, o atlayışa özel olarak videodan (veya zincirleme simülasyonla) ayrıca doğrulanmalıdır.**

### 18.3 Bounded tek örnek — kule0'dan 629ms/%100, GERÇEK BAŞARISIZLIK, doğrulandı

Bu kısıtlamayı aşmak için, `17-48-32` videosundan, başlangıç konumu KESİN OLARAK BİLİNEN (çünkü hayatın İLK atlayışı) bir örnek seçtim:

**Bağlam** (kare kare doğrulandı): t≈34s'de bir önceki hayat "Game Over" ile bitiyor (skor 13, son basış 296ms/%66). t≈35s'de YENİ hayat başlıyor — karakter kule0'da duruyor, skor "0", ekranda soluk "basılı tut, bırak, zıpla" öğretici yazısı görünüyor (kanıtlanmış TAZE başlangıç). Bu hayatın İLK basışı: **"Son basış: 629 ms · Güç: %100"** (450ms'lik maksimumu aştığı için doygun).

**Gözlemlenen sonuç** (t=36.0-37.4 arası kare kare izlendi): Karakter yükselip kule1'in hizasından GEÇİYOR ama ona DEĞMİYOR (kuleye bitişik, aynı yükseklikte ama temas yok) — t=37.0'da zaten kule tepelerinin ALTINA inmiş, t=37.2'de üç kuleyi de altlarından geçmiş, t=37.4'te **Game Over** ekranı çıkıyor. **Bu atlayış kesin olarak BAŞARISIZ.**

**Simülasyon doğrulaması** (gerçek `jump.ts`+`landing.ts`+`reference-course.ts`, DÜZELTİLMİŞ kalkış konumuyla — `spawnX = tower0.x + tower0.width*0.5`, c=1.0):

```
Sonuç: landed=false (HİÇBİR kuleye değmiyor) — VİDEODAKİ GÖZLEMLE BİREBİR EŞLEŞİYOR ✓
kule1 hizasında geçiş: kule1'in sağ kenarını 207 dünya birimi AŞIYOR
kule2 hizasında geçiş: kule2'nin sol kenarından 72 dünya birimi KISA KALIYOR
  -> ikisinin arasındaki boşluğa düşüyor, tam gözlemlenen senaryo
```

**Simülasyon, kayıttaki sonucu doğru şekilde yeniden üretiyor.** Bu, hem kalkış-konumu düzeltmesinin (Bölüm 18.2) hem de temel fizik/çarpışma mantığının bu spesifik, gerçek örnek için doğrulandığı anlamına geliyor.

### 18.4 Eşleşen referans geçişi — KARŞILAŞTIRILAMADI, açıkça belirtiliyor

Bu geçiş (kule0→kule1, hayatın ilk atlayışı, uzun/doygun basış) için, Spring Ninja'nın KENDİ ilk atlayışını uzun basışla denediği bir görüntü YOK elimde. Elimdeki tek titizlikle doğrulanmış Spring Ninja örneği (kule6→kule8, ~243ms'lik ORTA basış, ÖNCEKİ bir tur) hem FARKLI bir kule çiftinde hem FARKLI bir basış aralığında — bunu buraya "eşleşen referans" olarak sunmak yanıltıcı olur. **Bu yüzden bu geçiş için şu an eşleşen bir referans karşılaştırması YAPMIYORUM** — bu, mevcut kanıtın bir sınırı olarak açıkça belirtiliyor, zorlanmadı.

### 18.5 Kapsam — bu turda BUNUNLA sınırlı kaldı

İstenildiği gibi, analiz bu TEK örnekle sınırlı tutuldu; daha geniş bir parkur taramasına GENİŞLETİLMEDİ. Önceki tam-parkur taramaları (Bölüm 2-3) hâlâ SUPERSEDED durumda ve bu tek-örnek doğrulaması onları otomatik olarak geçerli kılmıyor — yalnızca kule0→1 geçişi ve düzeltilmiş kalkış-konumu YÖNTEMİ için doğrulama sağlıyor.

### 18.6 Bu turda değiştirilmeyenler

- `src/game/jump.ts`, `src/game/config.ts`, `src/game/landing.ts`, `src/game/reference-course.ts`, `app/index.tsx` — HİÇBİRİ değiştirilmedi.
- Yeni bir üstel/fizik denemesi YAPILMADI.
- Yedek almaya gerek olmadı (kod değişikliği yok, mevcut yedekler duruyor).

---

## 20. YENİ TUR — `11-58-44` kaydı: iki oyun, üç temsilî atlayış, tek deney önerisi

Bu kayıt (3:50) HEM bizim oyunumuzu HEM Spring Ninja'yı içeriyor. Oyun-geçiş noktası: t≈126-130s civarı ("Ketchapp" (Spring Ninja'nın yayıncısı) yükleme ekranı t=130'da görüldü; bizim oyunumuzun son geçerli hata-ayıklama okuması t=125.8'de).

### 20.1 Üç temsilî atlayış — hepsi kule0'dan (ilk atlayış), gerçek kod ve yoğun kare kontrolüyle doğrulandı

**A) Rahat, başarılı ilk atlayış**: **371ms/%82** (t≈3.4-5.5). Karakter kule1'e temiz iniyor. Kurulmuş pencereyle (kule0→1: 374-404ms) neredeyse örtüşüyor (371, alt sınırın 3ms altında — ölçüm/yuvarlama payı içinde).

**B) Aşırı-gitme (ıskalama)**: **421ms/%94** (t≈37.6). İlk incelemede karakter "hayatta kalmış" gibi göründü (0.5s aralıklı örnekleme YANILTICIYDI) — daha yoğun (6fps) örneklemeyle **kısa süreli bir Game Over ekranının atlandığı** ortaya çıktı: karakter kuleyi ıskalayıp düşüyor, Game Over (skor 0), HEMEN ardından yeni hayat başlıyor. Gerçek kodla doğrulama: c=0.936, kule0'dan kule1-4'ün HİÇBİRİNE değmiyor — video ile birebir eşleşiyor. **(Metodolojik not: seyrek örnekleme kısa Game Over döngülerini KAÇIRABİLİYOR — bu, "hayatta kaldı" sonucuna varmadan önce yoğun örnekleme gerektiğinin somut bir kanıtı.)**

**C) Başarılı, kule0'dan kule1'e uzunca bir atlayış**: **387ms/%86** (t≈89.5-90.5, skor 0→1). Pencerenin (374-404ms) tam ortasına yakın, rahat bir başarı.

Bu üçü de AYNI geometriyi (kule0→kule1, Bölüm 18'de tam ölçülmüş) paylaşıyor — farklı takeoff pozisyonlu yeni bir geometri gerekmedi çünkü hepsi hayatın ilk atlayışı. Spring Ninja kısmında (t>130), hata-ayıklama yazısı OLMADIĞI için parmak hareketinden basış süresi ÇIKARILMADI (yalnızca görsel/geometrik gözlem yapıldı, kesin süre iddia edilmedi).

### 20.2 Örüntü — bu, bu kayıtta TEKRARLANAN bir sorun

Yalnızca bu ~2 dakikalık pencerede (t=0-126), kule0→1 geçişinde EN AZ 2 ayrı "aşırı-gitme" örneği bulundu (421ms ve muhtemelen 413ms de, tam doğrulanmadı) — bu, hayatın İLK atlayışında, en sık karşılaşılan noktada, tekrarlayan bir kayıp deseni. Bu, Bölüm 18-19'daki tekil örneklerin RASTGELE olmadığını, sistematik olduğunu gösteriyor.

### 20.3 GERİ ÇEKME — "sonuna kadar basmak güvenli hale gelir" iddiası YANLIŞTI, deneme KAPATILDI

Kullanıcı doğru bir hata yakaladı: `maxChargeDuration` değişse de değişmese de, TAM ŞARJDA (`c=1`) fırlatma hızı (`jumpVelocity(1, W)`) TAMAMEN AYNI — çünkü `c = min(1, heldSeconds/maxChargeDuration)` formülü, yeterince uzun basışlar için HER ZAMAN `c=1`'e doygunlaşıyor, süre parametresi ne olursa olsun. Yani **"sonuna kadar bas" davranışı (c=1'e doygunlaşmış herhangi bir uzun basış) fırlatma hızı açısından HİÇ değişmiyor** — önceki turda "500ms'ye kadar güvenli" dediğim ifade YANLIŞTI ve GERİ ÇEKİLİYOR. Pencerenin kendisi zaten `c=1`'İ HİÇBİR ZAMAN içermiyordu (0.898'de bitiyor, 1.0 değil) — bu, `maxChargeDuration` değişikliğinden ETKİLENMEYEN bir gerçek. **`maxChargeDuration` (450→500ms) denemesi bu turda KAPATILDI, UYGULANMADI.**

### 20.4 371ms başarısı ile 374-404ms temel pencere arasındaki uyuşmazlık — mutabakat girişimi

Önceki turda bu ~3ms'lik farkı "ölçüm/yuvarlama payı" diyerek geçiştirmiştim — kullanıcı haklı olarak daha sıkı bir doğrulama istedi. Beş ayrı kontrol yaptım:

1. **OCR/kayıt doğrulaması**: "371 ms · Güç:%82" yazısını YÜKSEK ÇÖZÜNÜRLÜKTE yeniden inceledim — yazı gerçekten "371" (OCR hatası değil, doğrudan göz doğrulaması).
2. **Görüntü alanı (viewport)**: Video native 1320x2868 — önceki tüm analizlerle AYNI cihaz/W=440.
3. **Gerçek kalkış konumu**: `app/index.tsx`'teki GÜNCEL kaynağı yeniden okudum — `px.value = first.x + first.width * 0.5`, `py.value = first.topY - PH/2`, `referencePlatform(0,...)` — hepsi kullandığım simülasyonla BİREBİR aynı.
4. **Çarpışma kurulumu**: Gerçek `findFootLanding`, gerçek `footSoles`/`bodyWidth` — değişiklik yok.
5. **Kare-zamanlaması (dt/faz) etkisi**: Gerçek oyun ayrık karelerle (~60Hz) ilerliyor, benim simülasyonum sürekli (dt=1/240) — bunun sınırı kaydırıp kaydırmadığını test ettim: dt=1/240,1/120,1/60,1/59.41,1/30 ve farklı kare-başlangıç fazlarıyla (0-16.7ms) c=0.8244 (371ms) HER KOMBİNASYONDA yine ISKALIYOR — **bu, farkı AÇIKLAMIYOR.**

**Sonuç: 5 kontrolden hiçbiri bu ~3ms'lik (c cinsinden ~0.0067) farkı açıklamadı — bu, ÇÖZÜLMEMİŞ, AÇIK bir tutarsızlık olarak kayda geçiyor.** Pratik sonucu: kule0→1 penceresinin sınırlarını (~1ms hassasiyetle biliniyor sanıyordum) artık yalnızca **~±3-5ms hassasiyetle güvenilir** kabul ediyorum — bu, ileride herhangi bir ayarlama önerisi değerlendirilirken hesaba katılmalı.

### 20.5 Spring Ninja bölümünde çoklu-kule başarısı arayışı — bulunamadı, dürüstçe belirtiliyor

Skor-dairesini (`t=135-225`) OCR ile taradım, birden fazla "skor 2+ arttı" adayı buldu — ama bunları TEK TEK görsel olarak doğrulayınca İKİSİ DE YANLIŞ ÇIKTI: biri (t≈220.75-224, "16→18") aslında ÜÇ ayrı +1 atlayış (16→17→18), tek bir 2-kule atlayışı DEĞİL; diğeri (t≈136.25-137.75, "1→6") OCR gürültüsüydü — gerçekte skor sırayla 1→2 artıyordu, asla "6" olmadı. **Bu turda, mevcut kayıtta gerçek bir çoklu-kule BAŞARISINI, kesin olarak doğrulayacak zamanda bulamadım.** Bunu zorlayıp yanlış bir örnek sunmak yerine, bunu AÇIK bir eksiklik olarak bildiriyorum.

### 20.6 Bu kaydın GERÇEKTEN kanıtladığı ve kanıtlamadığı şeyler

**Kanıtlanan**: (a) Kule0→1 geçişinde, aynı ~2 dakikalık pencerede en az 2 aşırı-gitme (421ms ve muhtemelen 413ms) VE en az 2 başarı (371ms, 387ms) var — bu geçiş tekrarlayan, gerçek bir risk taşıyor. (b) Seyrek örnekleme kısa Game Over döngülerini kaçırabiliyor (metodolojik ders). (c) Kurulan pencere (374-404ms) yaklaşık doğru ama ±3-5ms'lik AÇIK bir belirsizlik payı var (Bölüm 20.4).

**KANITLANMAYAN/bilinmeyen**: (a) Bu kayıtta doğrulanmış, gerçek bir çoklu-kule (2-3 kule) BAŞARI örneği YOK. (b) Spring Ninja bölümünde basış süreleri hiçbir şekilde ölçülmedi (hata-ayıklama yazısı yok, parmak hareketinden süre çıkarılmadı). (c) 371ms/374ms tutarsızlığının kök nedeni bilinmiyor.

**Bu turda kullanıcının uzun-atlayış sorununa odaklı kalındı; yalnızca ilk-kule ıskalamalarına dayanan YENİ bir küresel zamanlama/eğri değişikliği ÖNERİLMEDİ.** Kod DEĞİŞTİRİLMEDİ, commit/push yok.

### 20.3-ESKİ (GERİ ÇEKİLDİ — bkz. Bölüm 20.3 yukarıda) — ilk taslak, artık geçersiz

> Aşağıdaki alt bölüm önceki taslaktan olduğu gibi bırakıldı (kayıt amaçlı) ama **"sonuna kadar bas artık güvenli" cümlesi YANLIŞTI ve Bölüm 20.3'te geri çekildi.** Sayısal pencere hesapları (374-404→416-449ms) doğru, yalnızca "üst sınır güvenli hale gelir" yorumu hatalıydı — tam şarj (c=1) fırlatma hızı zaten hiç değişmiyordu.

Şarj-hıza eğrisini DEĞİL, yalnızca "tam şarj için gereken SÜREYİ" (450ms→500ms) değiştirmeyi test ettim. Bunun matematiksel özelliği: c-cinsinden pencere HİÇ değişmiyor (0.8311-0.8980, sabit) — yalnızca bu pencereye karşılık gelen MİLİSANİYE değerleri kayıyor:

```
maxChargeDuration=450ms (mevcut): pencere=374-404ms (30ms genişlik)
maxChargeDuration=500ms (aday):   pencere=416-449ms (33ms genişlik, +3ms/%10 daha geniş)
```

**Gerileme (değişmeden geçerli)**: Bu, TÜM basış sürelerini ~%11 daha uzun gerektirir hale getiriyor — kullanıcının ŞU AN işe yarayan alışkanlık basışı (385ms, c=0.856, güvenli) bu adayda ARTIK GÜVENSİZ (yeni c=0.77, pencerenin altında, ıskalıyor).

**Bu deneme KAPATILDI, uygulanmadı** (Bölüm 20.3).

## 19. YENİ TUR — kullanıcının BİZZAT işaret ettiği atlayış: `ScreenRecording_09-15-2026 11-36-25_1.MP4`

Kullanıcı önceki gönderdiği bu kayıtta, "son atlayışta düştüğü yerden önceki kuleye gelmesi lazımdı, fazla gitti" dedi. Bu, Bölüm 18'deki (kule0, kendi seçtiğim, kolay-yeniden-kurulabilir) örnekten FARKLI — kullanıcının kendi işaret ettiği GERÇEK örnek. Aşağıda bu spesifik atlayış yeniden kuruldu.

### 19.1 Bağlam ve gerçek basış değeri

Video 11.6 saniye, bizim oyunumuz (İstanbul teması). t≈1s'de taze bir hayat başlıyor (skor 0, kule0). Kare kare izlenerek zincir çözüldü:
- Skor 2'ye çıkaran basış: **271ms/%60** (t≈5).
- Skor 4'e çıkaran basış (yani kullanıcının bahsettiği atlayıştan HEMEN ÖNCEKİ, karakterin ÜZERİNDE durduğu kuleye inen basış): **229ms/%51** (t≈7.0, karakter bu kulede duruşta ayak-tozu efektiyle görülüyor).
- **KULLANICININ İŞARET ETTİĞİ, ÖLÜMCÜL atlayış: "Son basış: 379 ms · Güç: %84 · Görsel: %94"** (t≈7.8'de fırlıyor, t≈9.2'de "Game Over", skor hep 4 kaldı).

### 19.2 Kare kare doğrulanan uçuş

t=7.0-7.6: karakter kule üzerinde duruyor (skor4 kulesi). t=7.8: fırlıyor. t=8.0: apeks civarı, yüksekte. t=8.8: karakter bir sonraki kulenin hizasından GEÇİYOR ama ona DEĞMİYOR (bitişik, temas yok). t=9.1: tüm kule başlıklarının ALTINA düşmüş. t≈9.2: Game Over. **Kullanıcının tarif ettiği tam olay: karakter en yakın ulaşılabilir kuleyi ıskalayıp geçti, sonra boşluğa düştü.**

### 19.3 Gerçek konum ölçümü ve belirsizlik

Kalkış kulesi ve bir sonraki (kullanıcının "önceki/daha yakın kule" dediği) kulenin gerçek piksel konumları, kalkış anındaki karede (t=6.9, 100px'lik ızgara ile) doğrudan ölçüldü:

```
Kalkış kulesi (ekranda):      x=[260,390]px,  başlık-y≈1450px
Hedeflenmesi gereken kule:    x=[920,1030]px, başlık-y≈900px  (kalkıştan ~550px daha yüksek)
```

Ölçülmüş kule genişliğinden (~110-130px ≈ kod içi 60.2 dünya birimi) türetilen dönüşümle (~1.91 native-px/dünya-birimi):

```
Kenar-kenar boşluk:  ~278 dünya birimi
Yükseklik farkı:     ~288 dünya birimi (hedef kule daha yüksek)
```

**Belirsizlik**: Işgarayı gözle okumaktan gelen pay ±15-20px (~%10-15) olarak kabul edilip, boşluk VE yükseklik değerleri ayrı ayrı %85-%115 aralığında değiştirilerek 9 kombinasyon test edildi — **hepsinde sonuç AYNI kaldı (aşağıya bakınız)**, yani bulgu ölçüm hassasiyetine karşı sağlam.

### 19.4 Simülasyon doğrulaması — GERÇEK kodla, gerçek basışla

`jump.ts`+`landing.ts` ile, kalkış kulesinin TAM ORTASINDAN (bu, zincirdeki bir SONRAKİ atlayış olduğu için varsayılan bir konum — bkz. Bölüm 19.6 sınırlama), c=0.84 (gerçek kullanılan basış) ile:

```
Sonuç: ISKALIYOR (hiçbir kuleye değmiyor) — VİDEODAKİ GÖZLEMLE EŞLEŞİYOR ✓
Hedef kule hizasında geçiş: kulenin sağ kenarını 139 dünya birimi AŞIYOR
```

**Bu kule için güvenli iniş penceresi (tam şarj taraması)**: **c=0.70 ile c=0.78 arası (315ms-351ms)** — yalnızca 36ms genişliğinde. Kullanıcının gerçekte tuttuğu süre (379ms) bu pencerenin **28ms ÜZERİNDE** — yani "biraz fazla tutmuş, biraz erken bırakması gerekiyormuş" tam olarak kullanıcının sözlü tarifiyle örtüşüyor.

**Ölçüm belirsizliği duyarlılık testi**: Boşluk/yükseklik ±%15 değiştirildiğinde bile, c=0.84 HER KOMBİNASYONDA ıskalıyor (9/9) — bu, ana bulgunun ölçüm hatasından kaynaklanmadığını gösteriyor.

### 19.5 ÖNEMLİ — bu, Bölüm 18'in "yalnızca üst bölge" bulgusundan FARKLI bir sonuca işaret ediyor

Bu atlayışın güvenli penceresi (%70-78) hayatın ilk-atlayış penceresinin (kule0→1, %84.7-91.7) HEMEN ALTINDA/YAKININDA — ve KAPATILAN üst-şarj denemesi (Bölüm 18.1) yalnızca `c>0.898` bölgesini değiştiriyordu, `c=0.84`'e (bu atlayışın gerçek değeri) hiç DOKUNMUYORDU. **Yani önceki, kapatılmış deneme zaten bu spesifik, kullanıcının bizzat gördüğü sorunu ÇÖZEMEZDİ — bu turda bunu netleştirmiş olduk.**

### 19.6 Küçük, geri alınabilir bir OYUN DENEYİ önerisi (UYGULANMADI) — ödünleşim açıkça belirtiliyor

Bu örnek, dar/kırılgan iniş penceresi sorununun yalnızca "en üst şarj" bölgesine özgü olmadığını, orta-üst bölgede (%70-85) de var olduğunu gösteriyor. Bu bölge, tam olarak hayatın ilk atlayışının KENDİ başarı penceresiyle (%85-92) BİTİŞİK — bu, aşağıdaki ödünleşimi YAPISAL olarak kaçınılmaz kılıyor:

**Öneri (deneme, kanıtlanmış Spring Ninja eşdeğerliği DEĞİL)**: Şarj-hıza dönüşüm eğrisine, TÜM aralıkta (yalnızca üst uçta değil) çok HAFİF bir yavaşlatıcı büküm eklemek (örn. `chargeResponseCurve` benzeri, ama ~1.05-1.15 gibi ÇOK küçük bir üstel) — bu, yüksek şarjdaki mesafe artışını biraz yumuşatıp bu tür "biraz-fazla-tuttum" ıskalamalarını nadirleştirebilir.

**Ödünleşim (açıkça)**: Bu, ÖNCEKİ turlarda "kısa/orta basış tepkisini BİREBİR koru" talimatıyla ÇELİŞİYOR — çünkü bu atlayışın kendi güvenli penceresi (%70-78) ile ilk-atlayış penceresi (%85-92) O KADAR YAKIN ki, aralarına dokunmadan yalnızca birini düzeltmek MÜMKÜN DEĞİL (Bölüm 18.1'de zaten "yalnızca üst bölge" denemesi bunu kanıtladı — kazanç/kayıp dengeliydi). **Bu yüzden dürüstçe söylemem gereken: mevcut kanıtla, "ilk atlayışı birebir koru" VE "bu tür orta-üst şarj ıskalamalarını azalt" hedeflerinin İKİSİNİ BİRDEN, hiçbir yan etkisi olmayan bir değişiklikle karşılamak mümkün görünmüyor — biri diğerinin pahasına biraz iyileşir.**

**Bu deneme UYGULANMADI.** Kullanıcı isterse: (a) bu ödünleşimi kabul edip küçük bir üstel deneyebiliriz (gerçek kodla tam taranıp ilk-atlayış penceresindeki değişim raporlanır), (b) mevcut durumu koruyup bu tür ıskalamaları "beceri gerektiren, kabul edilebilir" olarak bırakabiliriz, (c) fizik dışı bir çözüm (görsel ipucu vb.) değerlendirebiliriz.

### 19.8 DÜZELTME — önerilen üstel (1.05-1.15) NİCELİKSEL OLARAK YETERSİZ, doğru büyüklük test edildi

Kullanıcı doğru hesapladı: `effectiveCharge = c^p` formülünde, `c=0.84` için `p=1.15` yalnızca `0.818` veriyor — bu hâlâ Bölüm 19.4'teki güvenli aralığın (0.70-0.78) ÜZERİNDE. Önerdiğim 1.05-1.15 aralığı bu örneği ÇÖZMEZDİ. Bunun yerine, gerçek kodla (tüm platformlara karşı gerçek `findFootLanding`, gerçek ayak-tabanı toleransı) hangi `p` değerinin GERÇEKTEN iniş sağladığını doğrudan test ettim — basit cebirsel tahmin yerine.

**Kullanıcının atlayışı (c=0.84, 379ms) — her adayda GERÇEK sonuç ve iniş payı (ayak-tabanı toleranslı, pozitif=güvenli temas, negatif=ıskalama mesafesi, dünya birimi):**

```
p=1.00 (mevcut):  ISKALIYOR   pay=-110.8
p=1.15 (önceki önerim): ISKALIYOR   pay=-82.0   <- kullanıcının hesapladığı gibi, hâlâ yetersiz
p=1.425:          ISKALIYOR   pay=-31.9
p=1.60:           İNİYOR (kıl payı) pay=-1.5    <- eşiğe çok yakın, güvenilir değil
p=1.80:           İNİYOR      pay=+31.7   <- rahat bir marj
p=2.00:           İNİYOR      pay=+27.4
```

**Bu örneği GERÇEKTEN düzeltmek için gereken üstel ~1.6-1.8 aralığında — önceki önerdiğim 1.05-1.15'in ÇOK ÜZERİNDE.**

### 19.9 TEK, somut taban-aday karşılaştırması — milisaniye cinsinden ödünleşim

`p=1.8`'i (rahat marjlı en küçük aday) somut karşılaştırma için seçtim:

```
                          TABAN (p=1.0, mevcut)     ADAY (p=1.8)
Kullanıcının atlayışı     ISKALIYOR (-110.8 birim)  İNİYOR (+31.7 birim)     <- düzeliyor
İlk atlayış (kule0->1)    374-404ms (30ms pencere)  406-424ms (18ms pencere) <- pencere %40 DARALIYOR
                                                                                VE minimum basış 32ms UZUYOR
```

**Bu, kullanıcının ALIŞTIĞI basışın (374-404ms arasındaki HERHANGİ bir değer, örn. 385ms — şu an kesinlikle çalışıyor) bu aday ile ARTIK ÇALIŞMAYACAĞI anlamına geliyor** (yeni pencere 406ms'den başlıyor) — oyuncunun basışını YAKLAŞIK 32ms UZATMASI gerekecek. **Bunu kullanıcının basışının "yanlış" olduğu şeklinde SUNMUYORUM — sorun oyuncunun basışında değil, tek bir eğri değişikliğinin hem bu ıskalamayı hem ilk atlayışı AYNI ANDA, yan etkisiz düzeltemeyecek kadar yakın konumlanmış olmalarında.**

**Çoklu-kule (uzun atlayış) menzili**: `p=1.8` ile kule3,6,7,9'un TÜMÜNDE her atlama-sayısı (1,2,3-kule) HÂLÂ ulaşılabilir — hiçbir pencere TAMAMEN kaybolmuyor, yalnızca daha uzun basış gerektiriyor (genel olarak +30-40ms) ve çoğu pencere biraz daha DAR.

### 19.10 Ölçüm belirsizliği hakkında netleştirme

Bölüm 19.3'teki ±%15 duyarlılık testi, YALNIZCA test edilen varsayımlar (ızgara-okuma kaynaklı boşluk/yükseklik hatası) içinde SAĞLAMLIK gösteriyor — ölçüm hatasının TAMAMEN dışlandığının KANITI DEĞİL. Kule genişliği/yükseklik dönüşüm katsayısı (~1.91 native-px/dünya-birimi), kamera açısı varsayımları, veya karakter sprite'ının tam ayak konumu gibi BAŞKA belirsizlik kaynakları ayrıca test edilmedi.

### 19.11 Sonuç — `p=1.8` KAPATILDI, UYGULANMADI

**Karar**: `p=1.8` (global üstel) adayı KAPATILDI — bu atlayışı düzeltmesine karşılık, iyileştirilmiş ilk atlayışta önemli bir gerilemeye (pencere %40 daralıyor, minimum basış 32ms uzuyor) yol açıyor; bu bedel kabul edilmedi. **Mevcut, oynanabilir sürüm (p=1.0, taban) korunuyor, kod DEĞİŞTİRİLMEDİ.**

Özet (kalıcı kayıt):

```
TABAN (p=1.0, mevcut, KORUNUYOR): kullanıcının atlayışı ISKALIYOR; ilk atlayış 374-404ms (30ms pencere).
REDDEDİLEN ADAY (p=1.8):          kullanıcının atlayışı İNİYOR (+31.7 birim); ilk atlayış 406-424ms (18ms, %40 dar, +32ms).
```

Bu, TEK bir ıskalamayı optimize etmeye dayanan global-üstel yaklaşımının reddi — kontrolleri iyileştirme hedefinin reddi değil. Bir sonraki deneme, birkaç temsilî atlayış birlikte değerlendirilerek ayrıca seçilecek. Bu konudaki üstel arayışı burada durduruldu, rapor genişletilmedi.

### 19.7 Bu turda değiştirilmeyenler

- `src/game/jump.ts`, `src/game/config.ts`, `src/game/landing.ts`, `app/index.tsx` — HİÇBİRİ değiştirilmedi.
- Hiçbir fizik denemesi UYGULANMADI, yalnızca ÖNERİLDİ.
- Yedek almaya gerek olmadı (kod değişikliği yok).
