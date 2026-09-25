# Claude sonuç raporu — harici (parmak görünür) kayıt analizi: YETERSİZ kanıt, fizik DEĞİŞTİRİLMEDİ

Tarih: 15 Eylül 2026 (iki tur). İlk turda iki harici kayıt (`20260915_093626.mp4`, `20260915_093945.mp4`), ikinci turda yeni açıdan iki kayıt daha (`20260915_103526.mp4`, `20260915_103353.mp4`) incelendi. **Sonuç (her iki turda da): bu kayıtlar, parmağın ekrana değme/kalkma anını güvenilir şekilde ölçmek için YETERLİ görsel netlikte DEĞİL** — ama ikinci turda NEDEN yetersiz olduğu çok daha net anlaşıldı (Bölüm 8-11). Bu, olumsuz ama bilgilendirici bir sonuç — belirsiz parmak hareketlerini kesin dokunma anı olarak SUNMUYORUM. Fizik/config'e hiçbir dokunuş yapılmadı, ilk atlayışın tepkisi korundu. Kod değişmediği için yeni bir yedek gerekmedi (mevcut yedekler, `backups/`, olduğu gibi duruyor). Commit/push yok.

## 1. Hangi kayıt hangi oyun — kesinleştirildi

- **`20260915_093626.mp4`** (2:24, 1920x1080@~58.85fps, 180° ters çekilmiş): **Spring Ninja** — ama daha önce incelediğimiz İstanbul-çatı temalı sürüm DEĞİL, aynı oyunun **çöl/dağ temalı** bir seviyesi/skini. Karakter tasarımı (sırtında kılıç, aynı sıçrama mekaniği), "+N" skor-bonus mekaniği ve genel arayüz (REWARD dairesi, kanat/tüy simgeli güç-up düğmeleri) önceki Spring Ninja kayıtlarıyla birebir eşleşiyor — yalnızca görsel tema farklı. BEST=92.
- **`20260915_093945.mp4`** (2:05, aynı çözünürlük/fps): **BİZİM KENDİ OYUNUMUZ** (Carsamba, İstanbul-çatı teması) — ekranda kendi hata-ayıklama yazımız ("Son basış: X ms · Güç: %Y · Görsel: %Z · İlk kare: Wms") doğrudan görünüyor, BEST=14 (bizim oyunumuzun kalıcı en-iyi skoru).

**Önemli not**: Talep, Spring Ninja'da kısa/orta/uzun basışların parmak-teması ile ölçülmesiydi; ikinci kayıt (093945) Spring Ninja değil, kendi oyunumuz. Bu, görevi tam karşılamıyor ama BEKLENMEDİK ŞEKİLDE FAYDALI oldu: kendi oyunumuzun kaydında, ekrandaki "Son basış" yazısı zaten GERÇEK (native zaman damgası tabanlı) basış süresini gösteriyor — yani bu kayıt, parmak-tabanlı ölçüm yöntemimi DOĞRULAMAK için bir zemin (ground truth) sağladı. Sonuç aşağıda: bu doğrulama denemesi de netlik sorunu yüzünden başarısız oldu.

## 2. Kendi oyunumuzun kaydından (093945) çıkarılan gerçek basış değerleri

Ekrandaki metni OCR ile tüm video boyunca (5fps örnekleme, sonra kesinleşen olaylar için native 58.85fps) tarayarak 33 ayrı basış olayı tespit edildi, geniş bir aralıkta: 38ms (%8) ile 721ms (%100, doygun) arası. Bu, kısa/orta/uzun ayrımı için iyi bir dağılım.

## 3. Parmak-teması doğrulama denemesi — NEDEN başarısız oldu

**Kısa basış (38ms) örneği**: Video kare aralığı ~17ms (58.85fps). 38ms'lik bir basış, teorik olarak yalnızca 2-3 kareye sığıyor. Parmağın ekranda göründüğü karelerde (t≈5.27-5.44s) parmak ZATEN görünür durumda, ama hangi TAM karede değdiği ve hangi TAM karede kalktığı ayırt edilemiyor — çünkü **basışın kendisi kare aralığıyla aynı büyüklük mertebesinde**. Bu, kameranın kalitesinden bağımsız, temel bir çözünürlük sınırı: 17ms'lik bir kare aralığıyla 38ms'lik bir olayı ±%50'den daha iyi bir belirsizlikle ölçmek mümkün değil.

**Orta basış (363ms) örneği**: Ekrandaki metnin TAM olarak ne zaman "346ms"den "363ms"e değiştiğini native çözünürlükte (58.85fps) OCR ile kesin olarak buldum: **t≈100.13-100.17s** (bırakış anı, ±1 kare/~17ms belirsizlikle). Ancak buna karşılık gelen DOKUNMA (basış başlangıcı) anını bulmaya çalıştığımda ciddi bir sorunla karşılaştım: **parmak, bu pencerenin öncesinde (bir önceki "Play Again" dokunuşundan itibaren) ekranın alt kenarına sürekli yakın/değmiş halde duruyor, ve "havada duruyor" ile "camda duruyor" arasında görsel olarak AYIRT EDİLEBİLİR bir geçiş YOK.** Yakınlaştırılmış, kare kare karşılaştırdığım görüntülerde parmağın konumu ~1 saniyelik bir pencere boyunca neredeyse değişmeden kalıyor — bu, gerçek bir "dokunma anı" sinyali değil, kameranın açısı/netliği bu düzeyde bir ayrımı desteklemiyor.

**Sonuç**: Bu belirsiz parmak konumunu bir "dokunma anı" gibi SUNMUYORUM. Dürüst durum: yalnızca BIRAKIŞ anı (t≈100.15s) kesin biliniyor; DOKUNMA anı yalnızca çok geniş bir pencerede (~t=99.0-100.15s, yani ~1.15 saniyelik bir belirsizlik) sınırlandırılabiliyor — bu, 363ms'lik bildirilen süreyi ne doğrulamaya ne çürütmeye yeterli.

## 4. Neden bu kayıtlar yetersiz — kök neden

Her iki kayıt da telefonu tutan elin BAŞPARMAĞI (veya işaret parmağı) ekranın hemen altına/kenarına çok yakın bir açıdan, makro-yakın çekilmiş. Bu açıda: (a) parmak çoğu zaman zaten kadrajda ve ekrana yakın duruyor, dokunma ANINDA belirgin bir "yaklaşma hareketi" göstermiyor; (b) parmak ile cam arasında, dokunmadığı zaman bile, ışık/gölge farkı oluşturacak net bir boşluk görünmüyor; (c) bulanıklık (hafif odak/hareket bulanıklığı) ince zamanlı geçişleri gizliyor. Bu, KAYITLARIN KALİTESİZ olduğu anlamına gelmiyor — amaçları için (oyunun ekranını göstermek) gayet iyiler — yalnızca kare-düzeyinde dokunma/kalkış ölçümü için gereken görsel sinyali sağlamıyorlar.

## 5. Karar — fizik DEĞİŞTİRİLMEDİ, belirsiz ölçümle ayarlama yapılmadı

Talimat gereği: belirsiz parmak hareketlerini kesin dokunma anı olarak kullanıp bir şarj eğrisi/fizik değişikliği yapmadım. `src/game/jump.ts`, `config.ts`, `landing.ts`, `app/index.tsx` — hiçbiri değiştirilmedi. İlk atlayışın (kısa basış) mevcut, iyileştirilmiş tepkisi korundu.

## 6. İstenen SPESİFİK eksik kanıt

Mevcut iki kayıt yerine, şu özelliklere sahip YENİ bir kayıt gerekiyor (yalnızca bu değişikliklerle):
- **Kamera açısı**: Parmağın ekrana değmediği anlarda, parmak ucu ile cam arasında GÖRÜLEBİLİR bir boşluk/gölge oluşacak şekilde biraz daha YANDAN (dik-üstten değil) çekilmiş bir açı — böylece "değiyor" ile "değmiyor" kareler arasında net bir görsel fark oluşsun.
- **Alternatif (daha güvenilir)**: Parmak yerine ince bir kalem ucu/stylus ile dokunmak — daha küçük temas alanı, ekranla arasındaki boşluk çok daha net görünür.
- **Basışlar arası boşluk**: Her basıştan sonra en az 1 saniye bekleyip elini/parmağını ekrandan belirgin şekilde UZAKLAŞTIRMAK (yalnızca hafifçe kaldırmak değil) — böylece "dokunma" ile "dokunmama" durumları arasında kameranın yakalayabileceği net bir fark olsun.
- **Kısa basışlar için**: Video karesi başına düşen süre (bu kayıtlarda ~17ms) basış süresinden belirgin şekilde KISA olmalı — bu yalnızca ~150ms'nin altındaki basışlar için ciddi bir sorun; 60fps'in üstünde (ör. iPhone'un 240fps ağır çekim modu) çekim, kısa basışları da güvenilir kılar.
- Spring Ninja'da: kısa/orta/uzun en az 2'şer örnek, aralarında yeterli boşlukla.

Bu koşullar sağlanırsa, aynı OCR+kare-analizi yöntemini (bu turda geliştirdiğim) doğrudan uygulayıp güvenilir, açık belirsizlik aralıklı bir basış-süresi ölçümü üretebilirim.

## 8. İKİNCİ TUR — yeni açıdan kayıtlar: daha net görüntü, ama AYNI temel sorun farklı bir sebeple

Yeni kayıtlar (`103526.mp4` = Spring Ninja, çöl temalı; `103353.mp4` = yine bizim kendi oyunumuz — Spring Ninja DEĞİL, önceki turdaki gibi) gerçekten daha iyi bir açıdan çekilmiş: telefon yandan/altan tutuluyor, parmağın telefon kenarına göre konumu çok daha net görülüyor, ışık da daha iyi. Yavaş çekim (slow-motion) kullanılmamış — her iki video da standart ~59fps, kayıt/oynatma hızı uyuşmazlığı yok (metadata kontrol edildi: 58.84-58.95 fps, container'da hızlandırma/yavaşlatma izi yok).

**Bu turda İYİLEŞEN şey**: `103353.mp4`'te telefon eğik tutulduğu için görüntü çapraz duruyordu; doğru açıyı (+56°) bulup görüntüyü düzelttikten sonra ekrandaki hata-ayıklama yazısı ÇOK net okunur hale geldi. Bu sayede, orta uzunlukta bir basış (279ms) için **BIRAKIŞ (release) anını native çözünürlükte (58.85fps), doğrudan ekran yazısının "226ms"den "279ms"e değiştiği kareyi bularak, ±1 kare (~±17ms) belirsizlikle KESİN olarak buldum**: t≈59.57-59.59s.

**Bu turda AYNI KALAN sorun — ama nedeni netleşti**: Bu kesin bırakış anının ÖNCESİNDE (dokunma/touch-down anını aramak için) ve SONRASINDA (parmağın kalkışını doğrulamak için) 0.4-0.5 saniyelik pencerelerde kare kare inceleme yaptım. **Parmağın telefon kenarına göre konumu bu pencerelerin TAMAMINDA görsel olarak değişmiyor** — ne dokunma anına yaklaşırken bir "inme" hareketi, ne de bırakıştan sonra bir "kalkma" hareketi tespit edilebiliyor. Bu, önceki turdaki gibi kameranın açısından/netliğinden kaynaklanmıyor — aynı videoda, oyuncu "Play Again" düğmesine bastığında parmağın AÇIKÇA VE NET şekilde ekrandan uzaklaştığını, sonra farklı bir noktaya yerleştiğini GÖREBİLİYORUM (Bölüm 9'daki örnek). Yani kamera BÜYÜK hareketleri yakalayabiliyor — **sorun, oyun içi şarj-basışları sırasında parmağın hareketinin bu büyük UI-dokunuşlarından çok daha KÜÇÜK olması ve bu küçük hareketin bu çözünürlükte/büyütmede görsel olarak ayırt edilememesi.**

## 9. Somut, açıklamalı örnek — neyin görünmediğini gösteriyor

Örnek: `103353.mp4`, t≈59.05-59.57s (279ms'lik basış, skor 5'e çıkan başarılı bir atlayış).

- **Bırakış (release)**: t≈59.57s, ±1 kare (~17ms) — ekran yazısı "226ms"den "279ms"e değiştiği anda KESİN olarak belirlendi (native OCR, kare kare).
- **Dokunma (touch-down) — belirlenemedi**: Beklenen konum t≈59.29s (59.57−0.279) civarında olmalıydı. Bu noktanın çevresindeki 27 ardışık karede (t=59.05-59.50, ~0.45 saniye) parmağın telefon kenarına göre konumu PİKSEL DÜZEYİNDE FARK EDİLMEYECEK kadar sabit duruyor — ne bir yaklaşma hareketi ne parmak ucunun camla temas ettiğine dair bir gölge/renk değişimi var.
- **Kalkış sonrası kontrol**: Aynı şekilde, bırakıştan (t=59.57) SONRAKİ 0.5 saniyede de (t=59.40-59.90) parmağın konumu görsel olarak değişmiyor — yalnızca ekrandaki karakterin yukarı çıkıp uzaklaştığı görülüyor (uçuş gerçekleşiyor), parmak sabit kalıyor.
- **Karşılaştırma (kontrol örneği)**: AYNI videoda, "Game Over" ekranındaki "Play Again" düğmesine basılıp bırakıldığı anda parmak NET şekilde ekrandan ayrılıyor, farklı bir konuma yerleşiyor (Bölüm 8) — bu, kameranın gerçek bir kalkış hareketini yakalayabildiğini kanıtlıyor.

**Sonuç**: Gizlenen/obscured olan şey, kameranın açısı ya da netliği değil — **oyun içi şarj dokunuşları sırasında parmağın yaptığı hareketin genliği, bu kameranın/büyütmenin ayırt edebileceği eşiğin ALTINDA**. Oyuncu, muhtemelen parmağını art arda basışlar arasında ekrandan HİÇ ya da çok az (1mm'nin altında) kaldırıyor — bu da fiziksel olarak beklenir bir oynama stili (hızlı, art arda basışlar için parmağı tamamen kaldırıp indirmek yerine hafifçe bastırıp bırakmak daha hızlıdır).

## 10. Takeoff/iniş zamanlaması (ekstra doğrulama, dokunma dışı)

Dokunma anı belirlenemese de, karakterin uçuşu (kalkış/iniş) ekranda net görünüyor. Bu turda ayrıca doğrulandı: bırakıştan (t≈59.57) hemen sonra karakter simgesi yukarı hareket etmeye başlıyor (kalkış), bu da önceki turlarda kurduğumuz "bırakış → fırlatma" zaman modeliyle TUTARLI (ek bir gecikme/tutarsızlık gözlenmedi).

## 11. Güncellenmiş sonuç ve tavsiye

İki farklı kamera açısı, iki farklı gün, dört farklı kayıt denendi — hepsinde AYNI temel engelle karşılaşıldı: oyun-içi şarj dokunuşlarının parmak hareketi bu tür harici kayıtlarla görsel olarak çözülemeyecek kadar küçük. Bu, kamera açısı sorunundan çok, **oynama stiliyle (parmağı ekrandan neredeyse hiç kaldırmadan art arda basma) ilgili yapısal bir sınırlama**.

**Güncellenmiş tavsiye**: Bir sonraki kayıtta kamera açısını DEĞİL, DOKUNMA ŞEKLİNİ değiştirmek gerekiyor — her basıştan sonra parmağı, "Play Again" düğmesine basıp bırakırken yaptığınız gibi, ekrandan AÇIKÇA VE GÖRÜNÜR ŞEKİLDE (en az 1-2 cm) kaldırıp tekrar indirerek basmanız gerekiyor (doğal, hızlı oyun oynama tarzının dışında, bilinçli/abartılı bir hareketle). Bu, mevcut kameranın zaten kanıtlanmış şekilde algılayabildiği bir hareket büyüklüğü (Bölüm 9'daki "Play Again" örneği). Bu şekilde çekilmiş kısa/orta/uzun birkaç basış, dokunma/kalkış anlarını güvenilir şekilde ölçmemi sağlayacaktır.

## 13. DÜZELTME — "etiket değişim karesi = bırakış anı" varsayımı YANLIŞTI; TAKEOFF çok daha iyi bir işaret

Kullanıcı kritik bir metodolojik hatayı işaret etti: ekrandaki "Son basış: 279 ms" yazısının GÖRÜNMEYE BAŞLADIĞI kare, fiziksel bırakış anı DEĞİL — işlenmiş SONUCUN EKRANA YANSITILDIĞI andır. Bu ikisi arasında gerçek bir boru hattı (pipeline) var:

```
[GERÇEK OLAY]              [İŞLEME GECİKMESİ]                          [EKRAN SUNUMU]
Fiziksel parmak kalkışı -> onPressOut (JS thread'e native   -> runOnUI (UI thread'e   -> worklet:        -> runOnJS(reportJump)  -> React
(native dokunma zamanı,     dokunma olayı iletimi -           worklet'i planlama)         phase=AIRBORNE,     (UI->JS thread'e        setLastJump
GERÇEK, doğru değer)        küçük ama sıfır değil)                                        vx/vy hesapla       geri dönüş)             + yeniden render
                                                                                           (SENKRON, aynı                              + native metin
                                                                                            karede görünür)                            güncellemesi
                                                                                              |                                          |
                                                                                          KALKIŞ GÖRÜNÜR                          ETİKET GÖRÜNÜR
                                                                                          (hızlı yol)                             (yavaş yol, JS
                                                                                                                                   round-trip + render)
```

**Kritik fark**: `phase.value = AIRBORNE` ve `vx.value`/`vy.value` ataması, `onPressOut` içindeki worklet'te SENKRON olarak, UI thread üzerinde yapılıyor — bir sonraki `useFrameCallback` karesi bunu HEMEN kullanıp karakteri hareket ettiriyor, JS thread'e geri dönmeye GEREK YOK. Ama ekrandaki "Son basış: Xms" YAZISI, `runOnJS(reportJump)` ile JS thread'e geri dönüp, React state güncellemesi (`setLastJump`) ve tam bir React yeniden-render turu geçirdikten SONRA native görünüme yansıyor — bu EK, daha yavaş bir yol.

**Sonuç: KALKIŞIN (takeoff — karakterin kuleden görünür şekilde ayrılması), etiket-metninin görünmeye başlamasından ÇOK DAHA GÜVENİLİR, DÜŞÜK GECİKMELİ bir bırakış-anı işareti olması gerekir.**

### 13.1 Bunu gerçek görüntüyle doğruladım

279ms'lik örneği (Bölüm 9) yeniden inceledim — bu sefer parmağa değil, KARAKTERE bakarak:

```
kare (t)         karakterin durumu
t=59.502         hâlâ kulenin üzerinde, tam boy (ayaklar görünür), DURGUN
t=59.519         ayaklar artık kule başlığının üzerinde değil, kalkmış — İLK HAREKET KARESİ
t=59.536         belirgin şekilde daha yukarıda, uçuşta
...
t≈59.57-59.59    ekran yazısı "279 ms" olarak GÜNCELLENİYOR (önceki turda "bırakış" sandığım an)
```

**Kalkış (gerçek bırakışın en güvenilir vekili) ≈ t=59.51 (±~1 kare, ~17ms)** — etiketin göründüğü andan (t≈59.58) **~60-70ms ÖNCE**. Bu, tam olarak beklenen "runOnJS + React render" gecikmesi büyüklüğünde (60Hz'de 2-4 render karesi ≈ 33-67ms) — yani rastgele bir ölçüm hatası değil, gerçek ve tutarlı bir boru hattı gecikmesi.

**Önceki turdaki "bırakış t≈59.57-59.59, ±1 kare" iddiası bu yüzden YANLIŞTI** — gerçek belirsizlik ±17ms değil, gösterge etiketinin işleme-gecikmesi kadar (bu örnekte ~60-70ms) daha büyüktü. Düzeltilmiş, güvenilir bırakış işareti: **kalkış anı, t≈59.51, ±~1-2 kare (~17-33ms, dokunma olayının JS thread'e iletim gecikmesi payıyla)**.

### 13.2 Bu, dokunma (touch-down) sorununu ÇÖZMÜYOR

Kalkış anını düzeltmek, hâlâ Bölüm 8-9'da belgelenen temel sorunu ortadan kaldırmıyor: **dokunma anı (touch-down) parmağın hareketinde hâlâ görünmüyor.** Düzeltilmiş bırakış anına (t≈59.51) göre beklenen dokunma anı artık t≈59.51−0.279=59.23s (önceki yanlış tahminden, 59.29'dan, biraz farklı ama YİNE aynı ~0.45 saniyelik incelediğim pencerenin içinde) — ve o pencerede parmağın konumunda hiçbir görünür değişiklik YOKTU. Yani: **kalkış-düzeltmesi bırakış tarafını güçlendirdi, ama dokunma tarafı hâlâ ölçülemez durumda.**

## 14. Mevcut görüntünün GERÇEKTEN kanıtladığı şeyler

1. **Oyun kimlikleri kesin**: `093626`/`103526` = Spring Ninja (iki farklı tema); `093945`/`103353` = bizim kendi oyunumuz.
2. **Kalkış (takeoff), bırakış için güvenilir bir vekildir** — JS-thread/React-render gecikmesinden ETKİLENMEZ, senkron UI-thread hesabına dayanır. Kendi oyunumuzda, ekran yazısının GÖRÜNME anından ~60-70ms daha erken ve daha doğru bir bırakış işaretidir.
3. **Ekrandaki "Son basış: Xms" SAYISININ KENDİSİ hâlâ doğru** (native zaman damgasından hesaplanıyor, bu daha önceki turlarda kod incelemesiyle doğrulanmıştı) — yalnızca bu sayının EKRANDA NE ZAMAN GÖRÜNÜR HALE GELDİĞİ bırakışla aynı an DEĞİL, ~60-70ms gecikmeli.
4. **Dokunma (touch-down) anı, denenen 4 kayıtın hiçbirinde, hiçbir açıdan görsel olarak tespit edilemedi** — bu, kalkış-düzeltmesinden bağımsız, ayrı ve hâlâ çözülmemiş bir sorun.
5. **Spring Ninja kayıtlarında (093626/103526) hiç ekran yazısı yok** — bu videolarda YALNIZCA kalkış ve iniş (görsel, kule geometrisiyle karşılaştırılabilir) güvenilir, basış süresi hiçbir şekilde ölçülemez.

## 15. Hangi kısa/orta/uzun basış karşılaştırmaları HÂLÂ kullanılabilir

- **Basış SÜRESİ karşılaştırması (kısa/orta/uzun basışın gerçek dokunma-kalkış aralığı)**: KULLANILAMAZ — hiçbir kayıtta dokunma anı yok, bu yüzden video kanıtından basış süresi TÜRETİLEMEZ (ne bizim oyunumuz ne Spring Ninja için).
- **Uçuş karşılaştırması (kalkıştan inişe: apeks zamanı, toplam uçuş süresi, iniş konumu)**: KULLANILABİLİR ve zaten daha önceki turda (CLAUDE_LONGJUMP_RESULT.md, kule6→8 örneği) bu şekilde kullanıldı — kalkış zaten oradaki analizde de (o zaman farklı bir video için) görsel/geometrik olarak belirlenmişti, etiket-metnine dayanmıyordu. **O analiz bu düzeltmeden ETKİLENMİYOR** çünkü zaten dokunma anına dayanmıyordu.
- **Bizim oyunumuz için YENİ bir iç-tutarlılık kontrolü mümkün**: Artık kalkışı güvenilir şekilde bulabildiğimiz için, ekranda gösterilen "Güç: %X" değeriyle GERÇEK EKRANDAKİ uçuşun (apeks/menzil) örtüşüp örtüşmediğini doğrudan bu videodan kontrol edebilirim — ama bu Spring Ninja karşılaştırması değil, sadece kendi oyunumuzun kendi içinde tutarlı olup olmadığının bir kontrolü (muhtemelen zaten tutarlıdır, çünkü fizik motoru zaten kod incelemesiyle doğrulanmıştı).

## 16. Kalan belirsizlik, küçük/geri alınabilir bir denemeyi engelliyor mu?

**Kısmen — ama tamamen değil.** Engellenen şey: "Spring Ninja'da gerçek basış süresi X ms, bizimki Y ms, aradaki farkı kapatacak şekilde fiziği ayarla" türünde, ÖLÇÜLMÜŞ EŞDEĞERLİĞE dayanan bir ayarlama — bu hâlâ mümkün değil, çünkü dokunma anı hiçbir kayıtta yok.

**Engellenmeyen şey**: İki tur önce (CLAUDE_LONGJUMP_RESULT.md), video kanıtından TAMAMEN BAĞIMSIZ, doğrudan gerçek kod (`jump.ts`+`landing.ts`+`reference-course.ts`) üzerinde tam şarj taramasıyla kurulan bulgu hâlâ geçerli ve bu turun bulgularından ETKİLENMİYOR: **belirli kule geçişlerinde, şarjın üst diliminde (özellikle 3-kule atlayışlar için ~%87-99 arası) çok dar, hataya açık "güvenli iniş pencereleri" var; bu pencereler dışına küçük bir sapma tam ıskalamaya yol açıyor.** Bu, Spring Ninja'nın gerçek basış süresini bilmeye gerek DUYMADAN, yalnızca bizim KENDİ fiziğimizin kendi KENDİYLE (tüm platformlara karşı gerçek çarpışma kuralıyla) tutarlılığından çıkan bir bulgu.

## 17. Öneri — HİPOTEZ-GÜDÜMLÜ bir deneme (UYGULANMADI, yalnızca öneri)

Kesin referans zamanlaması hâlâ mevcut olmadığı için, bunu "ölçülmüş Spring Ninja eşdeğerliği" olarak SUNMUYORUM. Bu sadece, ŞİMDİYE KADAR toplanan (video-bağımsız, kod-tabanlı) kanıta dayanan bir HİPOTEZ:

**Hipotez**: Üst şarj aralığındaki (~%85-100) dar/kırılgan iniş pencereleri, `maxJumpVX`/`maxJumpVY` değerlerini KÜÇÜK bir miktar azaltarak (yalnızca üst uca etki eden, ama Bölüm I.1'de gösterildiği gibi ara şarjları da bir miktar etkileyen bir "k" çarpanıyla) daha SIK (her zaman değil) güvenli hale getirilebilir. İki tur önceki tam-parkur taramasından somut kanıt: `k=0.74` ile 23 geçişten isabet sayısı 5'ten 9'a çıkıyor (parkurun TAMAMI güvenli hale gelmiyor, ama isabet oranı neredeyse ikiye katlanıyor).

**Bunun açıkça İTİRAF EDİLMESİ gereken sınırları**:
- Bu, ÖLÇÜLMÜŞ bir Spring Ninja hedefine dayanmıyor — yalnızca "daha az sık ıskalama" hedefleyen bir mühendislik denemesi.
- Parkurun HER geçişini düzeltmiyor (k=0.74'te bile 14/23 hâlâ ıskalıyor).
- ORTA şarjı da bir miktar etkiler (Bölüm I.1) — yalnızca "üst uca dokunur" değil — ama kısa basışlar (düşük c) neredeyse hiç etkilenmez (min değerler sabit kalıyor, formül `min+c×(max-min)` olduğu için c küçükken fark ihmal edilebilir düzeyde).
- **İlk atlayışın (kısa basış) mevcut, iyileştirilmiş tepkisini BOZMAMASI gerekir** — bu deneme uygulanırsa, önce kısa basışların (c<0.3 civarı) tepkisinin değişmediği gerçek kodla ayrıca doğrulanmalı.

**Bu deneme UYGULANMADI.** Kullanıcı seçerse (ve yalnızca seçerse), bir sonraki adım: `maxJumpVX`/`maxJumpVY`'yi k≈0.74-0.85 aralığında bir değere düşürüp, (a) kısa basış tepkisinin gerçek kodla değişmediğini doğrulamak, (b) tam parkur taramasını tekrarlayıp yeni isabet oranını raporlamak, (c) yedek alıp küçük, geri alınabilir bir commit-öncesi değişiklik olarak sunmak.

## 12. Bu turda değiştirilmeyenler

- `src/game/jump.ts`, `src/game/config.ts`, `src/game/landing.ts`, `src/game/reference-course.ts`, `app/index.tsx` — HİÇBİRİ değiştirilmedi.
- İlk atlayışın mevcut tepkisi korundu.
- Yedek almaya gerek olmadı (kod değişikliği yok, mevcut yedekler dokunulmadan duruyor).

## 7. (İlk tur) Bu turda değiştirilmeyenler

- `src/game/jump.ts`, `src/game/config.ts`, `src/game/landing.ts`, `src/game/reference-course.ts`, `app/index.tsx` — HİÇBİRİ değiştirilmedi.
- İlk atlayışın (kısa basış) mevcut tepkisi korundu.
- Yedek almaya gerek olmadı (kod değişikliği yok).
