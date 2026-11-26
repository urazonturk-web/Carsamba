# OYUNICI-OLAY — Editör (oyun tasarımı) — 2026-11-26

Yalnızca okudum: `app/index.tsx`'teki `onPressIn` / `onPressOut` / `cancelCharge`, `charge-surface`, `doorLock`, iniş bloğu; `karga.ts`, `mahalle.ts`, `kurukafa.ts`, `stops.ts`, `AmbientBirds.tsx`. Hiçbir dosyayı değiştirmedim.

## 1. Dokunma çakışması: koddaki akış ve önerdiğim çözüm
**Şu anki akış.** Ekranın tamamını kaplayan tek bir `View testID="charge-surface"` var. Dokunuşları bu `View` alıyor: `onResponderGrant` → `onPressIn`, `onResponderRelease` → `onPressOut`, `onResponderTerminate` → `cancelCharge`. `onPressIn` UI iş parçacığındaki worklet'te önce `poseOverride` değerini sıfırlıyor. Ardından `phase !== IDLE` ya da `doorLock === 1` ise hiçbir şey yapmadan çıkıyor; değilse `phase = CHARGING` yapıyor. `onPressOut` yalnızca `phase === CHARGING` ise `doLaunch` çağırıyor. Bundan iki sonuç çıkıyor:
- Amca havadayken (AIRBORNE) yapılan dokunuş zaten hiçbir şey yapmıyor.
- Basışta CHARGING'e geçilmezse, parmak kalkınca fırlatma da olmuyor. Yani dokunuşu yutmak için tek bir `return` yeterli.

**Öneri: tek dokunma katmanı + worklet içinde isabet testi.** Hedefleri ayrı bir `Pressable` olarak çizmeyi önermiyorum. Dokunuşu yine `charge-surface` alsın; ayrımı worklet'in içinde yapalım:
1. `onPressIn`, zaman damgasına ek olarak `event.nativeEvent.pageX/pageY` değerini de worklet'e geçirir.
2. Worklet'te `poseOverride` satırından hemen sonra, IDLE kontrolünden **önce** şu satır gelir: `if (olayAktif.value === 1 && olayVur(x, y)) return;`. `olayVur`, ekran koordinatında tutulan hedeflerin (martı, kedi…) paylaşılan değerlerine bakar. Vurursa hedefi kovar, haptik ve sesi `runOnJS` ile çalar ve `true` döner. Dönüş erken olduğu için CHARGING başlamaz; `onPressOut` da hiçbir şey yapmaz. Ek bir kilide gerek kalmaz.
3. **Ölü bölge:** isabet yarıçapı en az 32 pt (64 pt çap; Apple'ın önerdiği 44×44 pt sınırının üstü). Bunun 1,4 katı içine düşen ıska dokunuşlar da yutulur. Böylece "martıya basayım derken atladım" hissi oluşmaz. Ekranın geri kalanına dokunmak normal şarjı başlatır.
4. Testin IDLE kontrolünden önce olması sayesinde aynı kod amca havadayken de çalışır (havada kovma).

**Neden `Pressable` değil.** RN'nin dokunma (responder) sisteminde en üstteki görünüm kazanır; bu yüzden `Pressable` aslında çalışırdı. Ancak martılar Reanimated ile UI iş parçacığında hareket ediyor. Dokunma testinin her karede o anki konumu kullanacağına güvenemem (Fabric gölge ağacı senkronu; kesin değil, bir risk olarak not ediyorum). Ayrıca `Pressable`'ın en az 130 ms basış süresi var; koddaki yorum, `charge-surface`'ın bu gecikmeden kaçmak için ham responder kullandığını söylüyor. Worklet içi test, kare döngüsüyle aynı konumu okuyor; hem kesin hem gecikmesiz.

**Kilit ne zaman.** `doorLock` deseni (pijama anı) yalnızca ≤1,5 sn'lik sinematik anlarda kullanılsın. Diğer olaylarda şarj kapanmaz; oyuncu olaydan atlayarak çıkabilir ("kaçtın" sonucu, ceza yok). Bu sayede akış hiç durmaz. Uçuş yaklaşık 1–1,3 sn sürüyor (vy ≤ 1450, g = 2300). Bu yüzden "yalnızca havada" olaylar tek hedefli olmalı.

## 2. Ayrıntılı tasarım: Kız Kulesi martı baskını (kullanıcının örneği)
- **Yer:** 2. durak Üsküdar · Kız Kulesi (30. kule). Tetik, durak kulesine ilk iniş. Anadolu Kavağı'nda (11. durak) 5 martılı zor sürümü gelir.
- **Kurulum:** İnişte amcanın elinde bir simit belirir (kodla çizilir: kahverengi halka ve susam noktaları). Kurukafa'dan esinli bir kısa "kıı-kıı" sesi çalar.
- **Martılar:** 3 martı. Boğaz/Kız Kulesi tarafından (sağdan) 0 / 0,8 / 1,6 sn arayla gelirler. Her biri yaklaşık 1,6 sn'lik bir eğriyle simide dalar; dalışın son 0,4 sn'sinde kanatlarını açar (dokunma ipucu).
- **Kovma:** Martıya dokun → martı takla atıp uçar, havada tüy kalır. `impactLight` haptiği ve bir kanat pırpırı sesi çalar.
- **Kaçırılırsa:** Martı simitten bir ısırık alır; simit üç dilimden birini kaybeder. Amca görsel olarak sendeler: yalnızca IDLE'da, `landPulse` gibi çizime özel bir hareket; fiziğe dokunmaz. Haptik `notificationWarning`. Üç ısırıkta simit biter, amca boş eline bakar. Ceza yalnızca görsel; düşme yok.
- **Başarılı olursa (3/3):** Amca simidi ısırır, son lokmayı Boğaz'a fırlatır, bir martı onu havada yakalar. Bu, vapurdan martıya simit atma geleneğine gönderme. Cumbadaki çocuk alkışlar (mevcut görsel). Haptik `notificationSuccess`.
- **Toplam süre:** ≤ 5 sn. Oyuncu bu sırada atlarsa olay biter ve martılar Boğaz'a döner.
- **Görsel ihtiyacı:** Prototip mevcut çizimlerle yapılır: `AmbientBirds` silüetinin 3 kat büyütülmüş hâli ve kodla çizilmiş simit. Asıl görseller Kıvılcım'la: martının 3 pozu (süzülme, dalış, kaçış) ve amcanın simitli pozu = 4 görsel, 2 çağrı, her çağrı ayrı onay.
- **Büyüklük:** M.

## 3. Olay fikirleri (≥8)
| # | Durak / yer | Ne olur → oyuncu ne yapar | Çakışma çözümü | Sonuç (oyun içinde) | Süre | Görsel | Boy |
|---|---|---|---|---|---|---|---|
| 1 | Üsküdar · Kız Kulesi | Martı baskını (yukarıdaki §2) | Hedef ayrımı + ölü bölge | Simit kurtulur / ısırılır | 5 sn | Prototip mevcut; 4 yeni | M |
| 2 | Harem | İskele simitçisi bir simit fırlatır; simit amcanın uçuş yayında asılı kalır, uçarken değerse amca yakalar | Dokunma yok; Kurukafa gibi temas | Amca simit yer / simit denize düşer, martı kapar | 1 uçuş | Kod çizimi simit | S |
| 3 | Kuzguncuk | Çatıdaki kedi amcanın terliğine sinsice yürür → kediye dokun | Hedef ayrımı | Kedi kaçar / amca bir sonraki durağa kadar tek terlik | 4 sn | Mevcut kedi; tek terlik pozu 1 yeni | S–M |
| 4 | Boğaziçi Köprüsü (4→5) | Lodos kasketi uçurur; kasket amcanın önünde süzülür → havadayken kaskete dokun | Yalnız havada; havada dokunuş zaten boş | Kasket geri gelir / kasketsiz yolculuk (görsel) | 1–2 uçuş | Kasket 1 yeni | M |
| 5 | Ortaköy (gece) | Balonlar bir çocuğun elinden kaçıp yükselir → balona dokun, balon çocuğa geri süzülür | Hedef ayrımı; pijama kapısı bitince başlar (`doorLock` sonrası) | Çocuk alkışlar / balon gökte kaybolur | 5 sn | Balonlar kodla çizilir | S |
| 6 | Arnavutköy (Akıntıburnu) | Balıkçının oltası amcanın eşofmanına takılır → ipin üstünden **kaydır**, ip kesilir | Kaydırma başında isabet testi dokunuşu yutar, sonra `onResponderMove` ile çizgi izlenir | Kurtulur / amca bir an çekilir (yalnız görsel, fizik yok) | 3 sn | İp kodla; balık 1 yeni | M |
| 7 | Bebek | Kargalar çatıda ceviz kırar, amcanın kafasına ceviz düşürür → kargalara dokun | Hedef ayrımı | Karga havalanır / "tok" sesi, amca kafasını ovar | 5 sn | **Mevcut 4 karga pozu**; ceviz kodla | S |
| 8 | Rumeli Hisarı | Burçtan eski bir gülle yuvarlanır → zıplayarak kaç (ana kontrol) | Çakışma yok; olay ana hareketin kendisi | Gülle denize düşer / amca kaçamazsa sendeler, düşmez | 3 sn | Gülle kodla | S |
| 9 | Kanlıca | Yoğurt kâsesine sinek sürüsü gelir → sineklere dokun | Hedef ayrımı (sinekler büyük isabet alanıyla) | Pudra şekerli yoğurt / sinekler amcayı bir durak izler | 5 sn | **Mevcut sinek** (`fliesStyle`) | S |
| 10 | Anadolu Kavağı | 5 martılı sürüm; martılar midye tava kâğıdını hedefler | §2 ile aynı | §2 ile aynı | 6 sn | §2 görselleri | S (üstüne) |

**[KURAL] işareti:** Başarı ödülünü "bir sonraki iniş tam isabet toleransı geniş" ya da puan olarak tanımlamak puan/iniş kuralına dokunur ve ayrı kullanıcı onayı ister. Önerim, varsayılan ödülün yalnızca görsel ve mizahi olması (simit, alkış, kasket). Zıplama fiziği, kamera, çarpışma, kule üretimi ve "düşünce baştan" kuralı hiçbir fikirde değişmiyor. Gülle ve olta yalnızca çizim seviyesinde sendeleme yapıyor.

## 4. Türden örnekler (kaynaklı)
- **Crossy Road:** Oyuncu fazla beklerse kartal gelip turu bitiriyor. Gemi temalı dünyada kartal yerine martı geliyor. Benden çıkan ders: tehdit, ana hareketi teşvik etmeli; ama bizde turu bitirmemeli. ([Wikipedia](https://www.wikipedia.org/wiki/Crossy_Road), [TV Tropes](https://www.tvtropes.org/pmwiki/pmwiki.php/VideoGame/CrossyRoad))
- **QTE'ler:** Yeni oyunlarda QTE oynanışın içine gömülü ve başarısızlık oyunu bitirmiyor. Zorluk tepki penceresinin uzunluğuyla ayarlanabiliyor. Dokunmaya dayalı QTE, sembol göstermekten daha sezgisel bulunuyor. ([Wikipedia: QTE](https://en.wikipedia.com/wiki/QTE), [Game Developer: Fixing QTE](https://gamedeveloper.com/design/fixing-qte))
- **Jetpack Joyride:** Tek dokunuşlu kontrol araca göre yeni anlam kazanıyor; Mr. Cuddles'da dokunmak ateş püskürtüp alçalmak demek. Tek kontrolün bağlama göre anlam değiştirmesi örneği. ([Giant Bomb](https://giantbomb.com/wiki/Games/Jetpack_Joyride))
- **Fruit Ninja:** "Dokunulmaması gereken nesne" (bomba) ve modlara göre değişen ceza (turu bitirme ya da puan cezası). Bizdeki karşılığı ölü bölge ve yumuşak ceza. ([Windows Central inceleme](https://windowscentral.com/fruit-ninja-wp8-windows-8-review))
- **İstanbul gerçeği:** Martılar vapurları izliyor, simidi havada yakalıyor; yolcular bunu bir gösteri gibi izliyor. ([SBS Food](https://www.sbs.com.au/food/article/simit-a-commuters-best-friend/s59bpqn3e), [Daily Sabah](https://www.dailysabah.com/feature/2014/06/06/ferryboats-friends-of-the-seagulls/amp))
- **Teknik:** RN responder sisteminde en derindeki/en üstteki görünüm kazanır; capture aşaması bunu ezebilir ([RN docs](https://reactnative.dev/docs/gesture-responder-system)). Hedef boyutu için 44×44 pt ([Apple tips](https://developer.apple.com/design/tips)).

## 5. En iyi 3 ve ilk yapılacak
1. **Kız Kulesi martı baskını (ilk yapılacak):** Kullanıcının kendi örneği. Ayrıca "worklet içi isabet testi + ölü bölge" altyapısını kuruyor; diğer dokunmalı olayların hepsi bu altyapıyı kullanacak. Yeni görsel gerekmeden kod silüetleriyle prototip yapılabilir; martı görselleri ancak kabulden sonra bağlanır.
2. **Bebek kargaları:** Mevcut 4 karga pozuyla neredeyse hiç yeni görsel gerektirmiyor (S). Altyapı hazır olunca birkaç saatlik iş.
3. **Kanlıca sinekleri / Harem simidi:** İkisi de mevcut görsellerle çalışıyor. Simit olayı hiç dokunma gerektirmediği için çakışma riski sıfır; martı olayından önceki durakta simidi tanıtarak hikâye bağı kuruyor.

Uygulama sırası önerim: prototip (Kız Kulesi, kod silüetleri) → simülatörde "martıya basınca atlama olmuyor" kanıtı (isabet ve ıska dokunuşlarında `phase` değerinin IDLE kalması) → Kıvılcım martı pozları, ayrı onayla.
