# Byzantion — Hava görselleri ve genel görsel puan değerlendirmesi (brif)

Oyun: Expo/React Native iPhone oyunu. Bıyıklı, kırmızı eşofmanlı İstanbullu amca, basılı tut-bırak ile İstanbul kuleleri/çatıları arasında zıplar. Arka plan: Boğaz, tarihi yarımada silueti, vapurlar, mahalle çatıları (karikatür/resimli çizim). Gerçek İstanbul saati ve havası oyuna yansıyor (Apple WeatherKit).

Ekran görüntüleri (simülatör, iPhone 17, gündüz sabitlendi; hepsi aynı klasörde):
- 01-gercek-lodos-sonbahar.png — bugünün gerçek havası (lodos, sonbahar tonu, rüzgâr çizgileri)
- 02-sis-pus.png — sis/pus: uzak siluet ve deniz beyazla örtülüyor, yakın kuleler net
- 03-poyraz.png — poyraz: soğuk mavi ton, rüzgâr çizgileri
- 04-kapali-bulutlu.png — kapalı
- 05-acik-yaz-ilkbahar.png — açık hava (ilkbahar/yaz; ayrı mevsim varyantı yok)
- 06-kis-karsiz.png — kış (karsız): soluk/soğuk ton, amcada bere + atkı
- 07-yagmur.png — yağmur: çizgi damlalar, amcada kasket + mont, ıslak çatı
- 08-lodos.png — lodos (deneme): sıcak turuncu ton, rüzgâr çizgileri, uçuşan yapraklar
- 09-kar.png — kar: kar taneleri, karlı çatılar, buz sarkıtları, karlı arka plan varyantı
- 10-gece-menu-lodos.png — gece, menü kartı açık, ay
- hepsi.jpg — hepsi yan yana

Kural (değişmez): zıplama fiziği, kamera, çatı silueti, çarpışma; hava efektleri iniş yüzeyini kapatmamalı.

İstenen (Türkçe, başlıklı, en fazla ~700 kelime):
1. **Sis/pus** görüntüsünü ayrıntılı değerlendir: inandırıcı mı, fazla mı beyaz/az mı, okunurluk, ne değişmeli (somut öneri: opaklık, renk, katman, hareket).
2. Diğer her hava için 1-2 cümle: iyi olan, kötü olan, somut düzeltme. Özellikle havalar birbirinden yeterince ayırt ediliyor mu (kapalı/açık/lodos/poyraz)? Rüzgâr çizgileri ve uçuşan yapraklar nasıl?
3. **Oyunun genel görsel kalitesine 10 üzerinden puan ver** ve nedenlerini yaz: güçlü yönler, zayıf yönler (karakter, arka plan, kuleler, arayüz/kartlar, tutarlılık, renk, okunurluk). App Store'daki benzer gündelik oyunlarla kıyasla.
4. Puanı 1-2 puan yükseltecek en etkili 3 görsel iş (efor: küçük/orta/büyük; kodla mı yeni görsel mi).
Kod değiştirme; yalnız görüş yaz.
