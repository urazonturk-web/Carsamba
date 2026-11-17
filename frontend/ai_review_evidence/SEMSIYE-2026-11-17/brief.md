# Byzantion — Şemsiye fikri değerlendirmesi (brif)

Oyun: Expo/React Native iPhone oyunu. Amca (kırmızı eşofmanlı, bıyıklı yaşlı İstanbullu, karikatür çizgi dili) basılı tutarak şarj eder, bırakınca İstanbul çatıları/kolonları arasında zıplar. Zıplama fiziği, kamera, çatı silüeti ve çarpışma DEĞİŞMEZ; her şey yalnız görüntü.

Mevcut sistem:
- Gerçek İstanbul havası (WeatherKit/Open-Meteo): kind = acik/bulutlu/yagmur/kar/sis, wind = lodos/poyraz/null, light (hafif yağmur).
- Yağmurda: yağmur damlaları katmanı, ıslak kiremit, menüde "şemsiyeni unutma!" cümlesi zaten var.
- Amca 9 şarj pozu (516 px tuval, başın olduğu 0–475. satırlar tüm pozlarda aynı); bere/atkı/gece külahı ayrı katman olarak tüm pozlara biniyor. Uçuşta vy>0 = düşüş evresi kodda biliniyor (iniş tespiti buna bakıyor).
- Kar yağarken amcada biriken kar, kalkışta silkelenme, burun kızarması, buhar var.

Kullanıcının isteği: "Lodos ve poyraz olmayan yağmurlu havada elinde şemsiye olsun, düşüşe geçerken açılsın."

İstenen değerlendirme (Türkçe, kısa başlıklarla):
1. Bu fikir oyun hissi ve mizah açısından nasıl? Şemsiye ne zaman kapalı/açık durmalı (şarj, kalkış, tepe noktası, düşüş, iniş)? Açılınca "yavaş süzülüyor" algısı fizik değişti sanılmasına yol açar mı, nasıl önlenir?
2. Şemsiyeyi tutan el/kol sorunu: gövde ve kollar 9 pozda farklı. Şemsiye nasıl çizilmeli (ayrı katman, sapın ele oturması, el görünmeden başın üstünde gibi)? Kaç görsel gerekir (kapalı şemsiye, açık şemsiye, belki ters dönmüş şemsiye)?
3. İniş okunurluğu: açık şemsiye kuleleri/iniş yüzeyini veya amcanın ayaklarını kapatır mı? Boyut ve konum sınırları.
4. Yaratıcı ekler: hafif yağmurda farklılık, şemsiyeden damla dökülmesi, inişte şemsiyenin sallanması, patlama ile etkileşim, pijama/gece külahı ile çakışma, kışın karda şemsiye (gerekirse), rüzgârlı günde neden olmadığına dair küçük bir şaka (ör. lodosta şemsiye ters dönmüş halde koltuk altında?).
5. Önerilen ilk adım ve efor (kod / görsel çağrısı sayısı).
Kod değiştirme; yalnız görüş yaz.
