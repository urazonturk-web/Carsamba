## Öneri

**Önce asenkron “hayalet yarış”**, sonra ihtiyaç doğrulanırsa gerçek zamanlı eşleşme. İlk sürümde **3 dakikada ulaşılan en uzak kule** kazandırsın; aynı kulede skor eşitliği bozsun. Böylece “düşünce baştan başlama” kuralı korunur, ama oyuncuların birkaç denemeden toplam puan biriktirip rakibini geçmesi önlenir. Toplam puan ve en iyi tek koşu, ilk sürümde ayrı yarışma ölçütleri olmasın.

## Tasarım artıları ve riskler

Üç dakikalık tur, arkadaşların aynı anda çevrimiçi olmasını gerektirmeden kısa ve davet edilebilir bir rekabet yaratır. Her düşüşte baştan başlamak da mevcut koşu yapısına uyuyor: bugün duraklar kayıt noktası değil ve `onGameOver` koşuyu bitiriyor ([stops.ts](/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend/src/game/stops.ts:1), [app/index.tsx](/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend/app/index.tsx:1241)).

Başlıca tasarım riski, “3 dakika” ile “düşünce yeniden başla” birleşince oyuncunun koşular arasında menü veya sonuç ekranında harcadığı zamanın rekabete adil biçimde dahil edilmemesi. Yarış saatini **oynanış açıkken** çalıştırın; düşüş sonrası kısa yeniden başlama süresi sabit ve kısa olsun. En uzak kule, birkaç saniyelik tek başarılı koşunun bütün oturumu belirlemesi riskini taşır; sonuç ekranında en iyi koşu skoru da gösterilebilir, ama kazanan ölçütü değişmesin.

## Teknik sıra ve hayalet verisi

Mevcut Game Center köprüsü sıra tabanlı maç ve `seed + skor` taşıyor; gerçek zamanlı `GKMatch` veri akışı yok ([GameCenter modülü](/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend/modules/byzantion-gamecenter/ios/ByzantionGameCenterModule.swift:13), [TypeScript arayüzü](/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend/modules/byzantion-gamecenter/src/index.ts:8)). Birkaç TestFlight oyuncusunda gerçek zamanlı eşleşme bekletme ve eşleşme bulamama riski yüksek. Ayrıca mevcut meydan okuma, iki tarafın aynı tohumu daha sonra oynamasına zaten temel sağlıyor ([meydan.ts](/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend/src/game/meydan.ts:1)).

Hayalet için rakibin fiziğini cihazınızda yeniden çalıştırmayın. Her sıçramada şu olayları kaydedin: **kalkış ve iniş kule kimliği, sıçrama başlangıç zamanı, kalkış şarj oranı, inişin kule üstündeki normalize konumu ve sonuç (indi/düştü)**. Parkur aynı seed ile üretilebilir ([procedural-course.ts](/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend/src/game/procedural-course.ts:34)); olay kaydı, farklı ekran genişliklerinde `physicsScale` farkının hayaletin animasyonunu ve iniş konumunu değiştirmesini önler ([jump.ts](/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend/src/game/jump.ts:3)). Kamera oyuncuyu izlesin; hayalet görünür alandaysa yarı saydam çizilsin, değilse HUD’da **rakip kule/ilerleme çubuğu** gösterilsin. Zıplama anında kule ve şarj göstergesini de kullanın.

## Özel anlar, MVP ve efor

Durak afişi ve kartpostal şu an sırasıyla yaklaşık **1,4–2,6 sn** ve **1,6 sn** gösteriliyor; kapı/pijama animasyonu dokunmayı yaklaşık **1,54 sn** kilitliyor ([app/index.tsx](/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend/app/index.tsx:1154), [pijama.ts](/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend/src/game/pijama.ts:37)). Yarışta bunları durdurucu sahne yapmayın: afiş/kartpostalı küçük, kısa HUD bildirimi olarak tutun; pijama değişimini otomatik ve yarış saatini durdurmadan oynatın. Süsleme rakibin hareketini veya sonucu kapatmamalı.

**En küçük MVP:** iki arkadaş aynı seed ve kurallarla yarışır; üç dakikalık yerel sayaç; her koşuda baştan başlama; en uzak kule sonucu; tamamlanan oturumun kısa hayalet kaydı; basit sonuç karşılaştırması. Game Center turn-based ile kayıt/sonuç paylaşımı bu yaklaşıma yakın; ama **üç dakika sonunda oyuncu oyunu kapatırsa** verinin ne zaman gönderildiği ve rakibin ne zaman oynadığı ürün akışında çözülmeli.

Kabaca: kayıt formatı ve oyun içi hayalet/ilerleme HUD’u **küçük-orta**; tur zamanlayıcısı, sonuçlar ve kayıt alışverişiyle MVP **orta**; eşleşme, kopma/geri bağlanma, gecikme telafisi ve farklı cihazlarda canlı çizim ise **büyük** iş. İlk uygulama öncesi mevcut tur tabanlı Game Center akışının oturum kaydı taşıyıp taşıyamadığı doğrulanmalı.

