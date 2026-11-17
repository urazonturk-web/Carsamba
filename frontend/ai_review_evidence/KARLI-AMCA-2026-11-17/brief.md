# Byzantion — karlı amca: yaratıcı fikirler (2026-11-17)

Oyun: Expo/React Native iPhone oyunu; bıyıklı, kırmızı eşofmanlı "amca" İstanbul çatılarında kuleden kuleye zıplıyor (bas-tut-bırak şarj; şarjda gövde 9 pozda çöker, sonra fırlar, kuleye iner). Karakter şeffaf PNG pozlarla (516 px tuval; başın yeri 9 pozda piksel piksel aynı, 0–475. satırlar). Zaten var: gerçek İstanbul havası (yağmur/kar/sis/lodos), kar yağarken çatılarda kar örtüsü + saçakta buz sarkıtı, kışın amcada çam yeşili örgü bere + kareli atkı (ayrı katman), iniş tozu (FAZ2_DUST), aşırı şarjda "patlama" lekeleri ve sinekler, gece kapısında pijama/külah. Görseller: src/game/ChargePoses.tsx (poz katmanları: lekeler, pijama, kış), src/game/WeatherLayer.tsx, src/game/kis.ts.

Kullanıcının isteği (aynen): "beresinde, burnunda, bıyıklarında da, kıyafetlerinde de kar olabilir; atlarken karlar üzerinden düşer gibi; yaratıcı fikirler istiyorum."

Kısıtlar: zıplama fiziği, kamera, çatı silueti, çarpışma DEĞİŞMEZ (yalnız görünüş). Yeni görsel (Kıvılcım) her çağrı ayrı onay ister; kodla yapılabilenleri ayrıca belirtin. İniş yüzeyi ve amcanın silueti okunur kalmalı; performans (her karede 9 poz katmanı var) düşünülmeli.

İstenen (Türkçe, sade, ~600 kelime):
1. Amcanın üstünde kar birikmesi: nerede (bere, omuz, bıyık, burun, kaş), nasıl birikir (koşu boyunca zamanla mı, her inişte mi), nasıl görünür; kodla mı (beyaz lekeler/şekiller) görsel mi.
2. Zıplarken/inerken kar dökülmesi: fırlayışta silkelenme, inişte puf, havada arkasından savrulan taneler; zamanlama (şarj/kalkış/iniş anları).
3. Komik/sevimli ek fikirler (ör. burun kızarması, ağızdan buhar, hapşırık, bıyıkta buz sarkıtı, şarjda titreme, kartopu çarpması, çatıda ayak izi, kayma efekti — fizik değişmeden).
4. İlk yapılacak 3 fikir ve nedeni; efor (küçük/orta/büyük).
