# OYUNICI-OLAY-2026-11-26 — Durakta, oyunun içinden çıkmadan yaşanan olaylar

## Kullanıcının sözleri (kelimesi kelimesine)
"bulmacadan vazgeçtim. mesela belirli bir durağa gelince martılar dayıya saldırsa biz de martılara tıklayarak onları uzaklaştırsak gibi fikirler üretin oyunun içinden ayrılmayalım başka ekrana geçmeyelim"

→ Ayrı ekranda açılan bulmaca (Harem Bagaj İstifi) kapatıldı; kullanıcı "oyunun bütünlüğünü bozuyor" dedi. İstenen: aynı sahnede, amca, kuleler, Boğaz görünürken yaşanan, kısa, dokunmalı **oyun içi olaylar**. Kartpostal/koleksiyon gibi meta işler istenmiyor.

## Oyun (kısa)
Byzantion: Expo/React Native iPhone oyunu. Eşofmanlı bıyıklı İstanbul amcası; ekrana basılı tut → çömelir, bırak → gaz izi bırakarak eğik atışla uçar, ileriki kule çatısına iner. Kadıköy'den Rumeli Feneri'ne 12 durak (her 15 kulede bir: Harem, Üsküdar·Kız Kulesi, Kuzguncuk, Beylerbeyi, Ortaköy, Arnavutköy, Bebek, Rumeli Hisarı, Kanlıca, Beykoz, Anadolu Kavağı, Rumeli Feneri), 3 köprü. Düşünce baştan. Ton: sıcak mahalle mizahı; Arapça ünlem yok.

Sahnede zaten olanlar (yeniden kullanılabilir): kule çatılarında kargalar (konar, kalkar, amcaya bakar, uçar; 4 poz çizimi var), cumbada teyzeler (amcaya bakar), pencereden laf atan komşular (konuşma balonu), kediler, uzakta martı silüetleri (kodla çizilmiş), vapurlar, Kurukafa (havada yakalanan bonus), hava durumu (yağmur/kar/şemsiye), gece pijama, durak bandı ve köprü şeridi. Bkz. kodda src/game/karga.ts, mahalle.ts, kurukafa.ts, AmbientBirds.tsx.

## En önemli tasarım sorunu: DOKUNMA ÇAKIŞMASI
Ana oyunun tek kontrolü "ekrana basılı tut / bırak". Bir olayda "martıya dokun" istenirse:
- Dokunuş zıplama şarjını başlatmamalı (yanlışlıkla atlayıp düşmek berbat hissettirir).
- Seçenekler: olay sırasında amca kule çatısında durur ve şarj geçici kapalı olur; ya da martıya (hedefe) dokunmak şarjı başlatmaz, boş yere dokunmak şarjı başlatır (dokunma hedefi ayrımı); ya da olay amca havadayken olur (havada dokunuş zaten bir şey yapmıyor); ya da farklı hareket (kaydırma). Her fikir için hangisini seçtiğinizi ve neden olduğunu yazın.

## Sınırlar
- Zıplama fiziği, kamera, çarpışma DEĞİŞMEZ. Puan kuralı, kule üretimi, "düşünce baştan" kuralı değişikliği ayrı kullanıcı onayı ister: dokunuyorsa açıkça işaretleyin.
- Yeni görsel (martı pozları vb.) Kıvılcım ile; her çağrı ayrı onay; kabulden önce oyuna bağlanmaz. Gerekli görsel sayısını yazın; mümkünse önce mevcut çizimlerle (kargalar, kod çizimi silüetler, emoji) prototip.
- Kısa olmalı (5–15 sn), oyunun ritmini bozmamalı, akışı durdurmamalı ya da çok kısa durdurmalı.

## İstenen
- En az 8 somut olay fikri, çoğu belirli bir durağa/semte bağlı (Kız Kulesi'nde martılar, Ortaköy'de..., köprüde..., Bebek'te..., Rumeli Hisarı'nda..., vb.). Her biri için: ne olur, oyuncu ne yapar (hareket), dokunma çakışması nasıl çözülür, başarı/başarısızlık sonucu (ödül ya da ceza oyunun içinde: ör. martı simidi kapar, amca sendeler ama düşmez; kazanırsa kısa güç: bir sonraki iniş "tam isabet" toleransı geniş… — kurala dokunuyorsa işaretle), süre, görsel ihtiyacı, büyüklük (S/M/L).
- Kullanıcının örneği (martı saldırısı) için ayrıntılı bir tasarım: hangi durakta, kaç martı, nereden gelir, nasıl kovulur, kaçırılırsa ne olur, ses/haptik.
- Türden örnekler (oyun içi mini olaylar, "quick time event", dokunarak kovma; Jetpack Joyride, Subway Surfers, Fruit Ninja, Angry Birds, Crossy Road, Alto vb.) — kaynak göster (web serbest).
- En iyi 3 ve ilk yapılacak olan; gerekçe.

Raporu bu klasöre `editor-<rol>.md` olarak yazın (Türkçe, ~1–1,5 sayfa). Oyun kodunu DEĞİŞTİRMEYİN.


## Kıvılcım için not
Bu çağrıda görsel ÜRETMİYORSUN, dosya yazmıyorsun; yalnız metinle görüş ver. Rolün: görsel tasarım ve karakter dili. Durak olayları için en görsel ve mizahi fikirler (martılar, kargalar, kediler, teyzeler, vapur, köprü vb.), her olayda amcanın tepkisi nasıl görünmeli, hangi yeni çizimler (kaç tane) gerekir. Türkçe, ~1 sayfa.
