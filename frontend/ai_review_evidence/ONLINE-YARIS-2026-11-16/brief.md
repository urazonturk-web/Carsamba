Sen bir oyun tasarımı/mimari danışmanısın. KOD DEĞİŞTİRME, yalnız oku ve değerlendir. Cevabı Türkçe, en fazla ~600 kelime yaz.

Proje: Byzantion — Expo/React Native iPhone oyunu (bu klasör). Tek dokunuşlu şarj-zıpla oyunu: amca kuleden kuleye zıplar, düşerse oyun biter. Harita tohumdan (seed) deterministik üretiliyor (src/game/procedural-course.ts makeRand; app/index.tsx seedRef ~1037). Fizik ekran genişliğine bağlı (src/game/jump.ts physicsScale(screenWidth)). Oyunda durak afişleri, köprü şeridi, iskele/pijama kapı anı, kartpostal, kurukafa güç-artırımı (tohumdan deterministik, src/game/kurukafa.ts), aşırı basışta patlama var. Game Center yerel Expo modülü: modules/byzantion-gamecenter (Swift) — leaderboard, turn-based meydan okuma (seed+skor gönderiliyor, arkadaş listesinden doğrudan). Arkadaşların TestFlight'ta; kullanıcı sayısı çok az (birkaç arkadaş).

Kullanıcının fikri (online mod): "Aynı haritada birbirlerinin zıplamalarını görerek oynayacakları 3 dakikalık bir oyun. Yanan tekrar baştan başlıyor. En sonunda kim ne kadar puan yapmış ve en uzağa gitmişse hesaplanıyor."

Değerlendir:
1. Fikrin oyun tasarımı olarak artıları/riskleri (3 dk, düşünce baştan başlama, kazanan ölçütü: en iyi tek koşu mu, toplam puan mı, en uzak kule mi — öneri ver).
2. Teknik yol: GKMatch gerçek zamanlı (eşzamanlı çevrimiçi gerekir, az oyuncuda eşleşme zorluğu) vs. asenkron "hayalet yarış" (rakibin 3 dk'lık zıplama kaydı turn-based ile gönderilir, sonra oynanır). Hangi sırayla yapılmalı?
3. Rakibi göstermek: kamera sende; rakip yarı saydam "hayalet amca", farklı ekran genişlikleri yüzünden fizik yeniden hesaplanmamalı — ne gönderilmeli (kalkış kulesi, iniş kulesi + iniş oranı, zaman damgası, düşüş)? Ekran dışındayken nasıl gösterilir (ilerleme çubuğu vb.)?
4. Mevcut uzun anlar (pijama kapısı, kartpostal, durak afişi) 3 dk'lık yarışta ne olmalı?
5. Somut riskler ve en küçük ilk sürüm (MVP) önerisi; kabaca iş büyüklüğü.
Dosya yolu vererek somut ol.
