# MERAK2 · Tur 1 · Teknik editör

Önceki "Yol C" (yalnız sahne kaplaması) bu kez geri çekildi: oyuncu aynı şeyi yapıyordu. Bu tur, çekirdeğe dokunan ama
tek kişinin yapabileceği yolları açıkça değerlendiriyor. Önce motorun izin verdiği şeyler, sonra fikirler, sonra 1 numaram.

## A. Motorun gerçeği: ışınlanma bu kodda düşündüğümüzden ucuz
1. **Işınlanma motorda zaten var, adı `initWorld`.** `app/index.tsx:1835-1907` ilk kuleyi kurar, px/py'yi ona koyar,
   ileriye kule üretir, `camX/camXR`'yi anında oturtur ve `camYR`'yi yeniden belirler (1906: "dikey düzlem yalnız
   başlangıçta değişir"). Bu bloğu `teleportTo(ilkYüzey, tür)` adlı bir worklet'e ayırırsak gerçek ışınlanma elde ederiz:
   skor, `lastLandedId` (initWorld'de 1889'da sıfırlanıyor, teleportta atlanır) ve hava durumu SIFIRLANMADAN yalnız dünya değişir. Perde/flaş tek karelik
   kesmeyi örter.
2. **İniş testi yüzey türünden bağımsız.** `landing.ts:7-31` yalnız `{x,width,topY}` listesi ister. Kurukafa bunu zaten
   kullanıyor: `scaledPlatforms` (`kurukafa.ts:108`) etkin listeyi üretir, döngü onu test eder (`index.tsx:3056-3057`).
   Hareketli hedef = aynı desen: `movedPlatforms(list, t)` saf fonksiyonu → `findFootLanding`. Yeni çarpışma kodu yok.
3. **Hareketli yüzeyin listeyi her kare yeniden yazması YASAK.** REVIZYON-060 (`index.tsx:736-748`) liste değişiminin
   uçuşta donma yaptığını ölçtü. Çözüm: kulede yalnız `kind`, `amp`, `faz` alanları; konum = `x + amp·sin(ω·saat + faz)`.
   Tek bir `seaT` SharedValue'su hem döngüde hem slot çiziminde (`slotPlatform`, 742) okunur. Liste sabit kalır.
4. **Kamera Y bilerek sabit.** `camYR` yaşam boyu sabit (REVIZYON-059 notu, `index.tsx:3323-3327`), ölüm testi ona bağlı
   (`index.tsx:3214`). Dikey bir parkur bunu kırar; ama Y takipçisi (`render-camera.ts:111 stepRenderAxis`,
   `smoothTimeYFlight/maxAccelY`) hâlâ kodda ve ölçülmüş. Yalnız mini-bölümde açılabilir.
5. **Kamera X yalnız ileri gider** (`index.tsx:3283`, `Math.max`). Fizik dünyası +x'te kalır; "ters yön" görüntüde
   yapılır: dünya kabına `scaleX:-1` verilir. Fizik, iniş ve kamera değişmez.
6. **Durak, köprü ve hayalet id'ye bağlı.** `stops.ts:82 isStopTower`, `stops.ts:43 bridgeAt`, yarış kaydı `EV_LAND`
   (landedId + oran). Mini-bölüm id'leri normal sayaçtan devam ederse skor kendiliğinden çalışır (`index.tsx:3126`
   `p.id > lastLandedId`). Kural: mini-bölüm iki durak arasına sığmalı (kurukafa da durak kulesinden kaçıyor,
   `kurukafa.ts:46`). Yerleşim `skullHash` gibi ayrı bir karma ile seçilmeli (`kurukafa.ts:33`); `rngState` akışına
   dokunmazsa aynı tohumu oynayan iki kişi aynı ışınlanmayı görür (meydan okuma ve hayalet bozulmaz).
7. **Gizli bir tuzak.** İniş anında `p = list[contact.index]` ÖLÇEKSİZ listeden okunuyor (`index.tsx:3059`); topY (3069)
   ve "tam isabet" ofseti (3123) oradan hesaplanıyor. Kurukafada merkez sabit olduğu için sorun yok. Hareketli yüzeyde
   `p` etkin listeden (`landList`) okunmalı, yoksa amca kayar ve ortaya inişler yanlış sayılır. Tek satır, ama şart.
8. **Erişilebilirlik garantisi statik.** `procedural-course.ts:124-131`, tam şarjla menzili hesaplayıp boşluğu sınırlar
   (`reachReserve 0,06`, `config.ts:65`). Hareketli hedefte genlik bu payın İÇİNDE kalmalı: `amp ≤ boşluk payı/2` olursa
   en kötü fazda bile tam şarj yetişir. Çevrimdışı benzetimle kanıtlanır (physics-evidence yöntemi).

## B. Fikirler (kontrol hep aynı: basılı tut, bırak, yay, iniş)

**1. Deniz Seferi: vapur, şamandıra, martı (CESUR, çekirdeğe dokunur: iniş listesi, üretim, slot çizimi)**
Yaşanan: Havadaki "dalga" nesnesine değince ekran beyaz köpükle kapanır; açılınca amca bir vapurun kıçında durur. Önde
yavaşça sağa-sola giden ikinci vapur, aralarda inip kalkan şamandıra, en sonda süzülen bir martı. 6-8 zıplamada kıyıya
dönülür; dönüş noktası kaçtığın yerden 10 kule ileride. Farklı his: hedef artık bekleyen bir şey değil, ZAMANLAMA ister.
Merak: "denize düştüm mü? Hayır, vapura bindim!" anı paylaşılır. Teknik: A1 + A2 + A3 + A7 + A8. Martı en zoru: inince
seni taşır (ayakta dururken px'e platformun dx'i eklenir). Kalkışta martının hızını zıplamaya eklemek daha gerçekçi olur
ama kontrol hissini değiştirir; ilk sürümde EKLEMEYİZ. Maliyet: 4-6 gün, Kıvılcım 3 çağrı (vapur, şamandıra, martı).
Risk: hareketli yüzeyde "haksız düştüm" hissi. Genlik ve hız düşük başlamalı.

**2. Karşı Yaka: ayna parkur (CESUR GÖRÜNÜR, çekirdeğe dokunmaz)**
Işınlanınca amca Avrupa yakasında ve ekran aynalanmış: sağdan sola zıplıyor, Boğaz bu kez öbür tarafta. Parmak aynı,
göz alıştığı yönün tersine bakıyor; beyin "yeni yer" diyor. Teknik: A5, dünya kabına `scaleX:-1`, metin katmanı dışarıda.
Fizik, iniş ve kamera aynı. Maliyet: 1-2 gün, yeni görsel gerekmez (aynalanmış arka plan yeter). Risk: tabelalar ve
yazılı nesneler ters görünür, onları aynanın dışında çizmek gerekir. Tek başına zayıf; 1 veya 3'e eklenince güçlü.

**3. Kule Tırmanışı: dikey mini-bölüm (CESUR, çekirdeğe dokunur: kamera Y, ölüm testi, üretim sınırları)**
Bir ışık halkası amcayı yüksek bir taş kulenin dibine atar. Yüzeyler balkon ve çıkıntılar, hep yukarı. Kamera ilk kez
yukarı kayar; tepede bütün Boğaz görünür, sonra paraşüt gibi şemsiyeyle kıyıya süzülür (şemsiye zaten var,
`semsiye.ts`). Teknik: `platformMinTopY/MaxTopY` (`config.ts:77-78`) yalnız bu bölümde gevşer; `camYR` bölüm boyunca
`stepRenderAxis` ile izlenir; ölüm testi (`index.tsx:3214`) zaten camYR'ye göre çalışır. Üretimde tırmanış menzili
`jumpVelocity(1)` ile sınırlanmalı. Maliyet: 5-7 gün, Kıvılcım 2 çağrı. Risk: REVIZYON-044…059 boyunca dikey kamera
sarsıntısıyla aylarca uğraşıldı. Yalnız mini-bölümde açılsa bile yeniden ölçüm gerekir.

**4. Salıncaklı Bayır: sarkaç hedefler (orta cüret, çekirdeğe dokunur: iniş listesi)**
Mahalle bayırında ağaçlara asılı salıncaklar sallanıyor, tepe noktasında inmek gerekiyor. A3 deseniyle x ve topY ikisi
birden zamana bağlı. Dikkat: topY oynarsa süpürmeli iniş testinde yüzey o karede ayağı "geçebilir". Genlik kare başına
birkaç birimi geçmemeli ya da test iki karenin topY'siyle yapılmalı. Maliyet: 3-4 gün. Risk: sarkaç, ölüm testiyle
çakışan bir "kandırma" gibi hissettirebilir.

**5. Sarnıç: tavanlı mini-bölüm (orta cüret, çekirdeğe dokunur: yeni tavan çarpışması)**
Yer altında, sütunların üstünde zıplıyorsun ama tavan alçak: fazla basarsan kafa çarpar, amca dik düşer. Fener (`fener.ts`)
burada doğal. Kural değişiyor, kontrol değişmiyor: "az bas" öğretir. Teknik: uçuşta `py - PH < tavanY` testi, `vy`
sıfırlanır. Maliyet: 3 gün. Risk: oyuncuya "neden öldüm" anlatmak, ipucu sistemi (`ipucu.ts`) gerekir.

**6. Kısayol Kapısı: risk-ödül ışınlanması (cüretsiz ama çekirdek puanına dokunur)**
Yükseğe asılmış bir kapı: değersen bir sonraki durağa ışınlanırsın (+15 kule), değemezsen normal devam. Teknik: A1 + id
atlatma. Atlanan id'ler `towersCrossed` olarak skora eklenir (`index.tsx:3127`). Risk: hayalet yarışında haksız avantaj
olur; aynı tohum aynı kapıyı verdiği için adil kalır, ama rekor tablosu tartışılır.

**7. Gece Martısı Sırtı (CESUR, en çok paylaşılır, en riskli)**
Bir martıya inince martı 3 saniye seni sırtında taşır, deniz üstünden kıyıyı göstererek uçar; bu sırada bas-bırak yine
çalışır ve martıdan kuleye atlarsın. Kontrol aynı, ama ilk kez HAVADAN kalkış var. Teknik: duran yüzey hareket eder
(px += dx), kalkış hızı yere göre aynı kalır. Kamera X yalnız ileri gittiği için sorun yok. Maliyet: 1'in alt parçası.

## C. Etki tablosu (özet)
| Fikir | Fizik sabitleri | İniş testi | Üretim | Kamera | Puan/durak | Görsel |
|---|---|---|---|---|---|---|
| 1 Deniz | aynı | etkin liste + A7 | yeni tür, genlik sınırı | aynı | id devam, durak arası | 3 |
| 2 Ayna | aynı | aynı | aynı | görüntüde ayna | aynı | 0 |
| 3 Tırmanış | aynı | aynı | Y sınırı gevşer | Y takip açılır | id devam | 2 |
| 4 Salıncak | aynı | x ve topY zamana bağlı | yeni tür | aynı | aynı | 1-2 |
| 5 Sarnıç | aynı | + tavan | yeni tür | aynı | aynı | 1-2 |
| 6 Kapı | aynı | aynı | id atlatma | anında oturma | +15 skor | 1 |

## D. 1 numaram: Deniz Seferi (fikir 1, martı sonra)
Neden: hem gerçek ışınlanma (başka yüzey, başka hedef davranışı) hem de en az yeni çekirdek. Fizik formülleri
(`jump.ts`) ve kamera aynı kalıyor. Değişen tek şey "neyin üstüne indiğin" ve zamanlama. Kurukafanın kanıtlanmış
deseni (etkin liste, ayrı karma, durak dışı yerleşim) aynen tekrar kullanılıyor.

**En küçük deneme (2 gün, görsel 0):**
1. `procedural-course.ts`'e dokunmadan yeni `src/game/deniz.ts`: `seaSurface(p, t)` saf fonksiyonu (x sinüsü,
   `amp ≤ pay/2`) ve `movedPlatforms(list, t)`.
2. `index.tsx`: `DENIZ_ON` bayrağı, `seaT` saati, 3056-3059'da `p`'yi etkin listeden okumak, ayakta dururken
   `px += dx`. Işınlanma yok; `TEST_START_TOWER` gibi bir geliştirici kancasıyla doğrudan deniz bölümünde başlanır.
3. Vapurlar düz renkli dikdörtgen (yer tutucu). Telefonda 20 deneme: "haksız düştüm" sayılır.
4. Çevrimdışı kanıt: en kötü fazda tam şarjın yetiştiğini ve iniş testinin kenarı kaçırmadığını gösteren sim betiği.
Geçerse: `teleportTo` ayrımı (A1), dalga nesnesi (kurukafa yerleşimi), Kıvılcım ile 3 görsel, dönüşte +10 kule.
Kullanıcı onayı gereken çekirdek noktalar: iniş listesi (A7), üretimde yeni tür, skorda kule atlatma.
