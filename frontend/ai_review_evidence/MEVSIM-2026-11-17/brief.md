# Byzantion — mevsim kıyafeti ve havanın sahneye izi (2026-11-17)

Oyun: Expo/React Native iPhone oyunu. Bıyıklı "amca" İstanbul çatılarında kuleden kuleye zıplıyor (bas-tut-bırak). Karakter tek parça sprite pozlarıyla çiziliyor (assets/characters/charge-*-r12*.png: şarj pozları 0..100, bazılarının "ifade" sürümü; pijama seti assets/characters/pijama/ — gece durağında çatı kapısından geçip pijama+gece külahı+terlik). Kolonlar: el çizimi renkli cepheler + kiremit çatı (column-variant / G018 cephe atlası); arka plan: Boğaz+Galata siluet tek büyük görsel + mahalle çatıları. Zaten var: gerçek İstanbul havası (Apple WeatherKit) yalnız görünüş katmanı olarak — yağmur çizgileri, kar taneleri, sis bandı, lodos/poyraz ton + rüzgâr çizgileri, gerçek saat (gece), ay evresi+yakamoz; menüde "17 Kasım, Hafif yağmurlu, 15°".

Kullanıcının yeni isteği (aynen): "mevsimine göre de hareket ettirelim mesela yazın atlet uzun paçalı don ile kalsın, kışın büyük bir mont giysin, ilkbahar ve sonbaharda ... nasıl olmalı diye bir değerlendirme yapın; ayrıca yağış, kar, rüzgâr durumuna göre de arka plan ve kolonlar da mevsimin/havanın izlerini taşısın."

Kısıtlar:
- Zıplama fiziği, kamera, çatı silueti, çarpışma (footSoles) DEĞİŞMEZ. Kıyafetler sprite'ın ayak/pivot noktasını ve sınır kutusunu bozmamalı (iniş algısı aynı kalmalı).
- Yeni görsel üretimi (Kıvılcım) her çağrı için ayrı onay ister; kullanıcı kabulü olmadan oyuna bağlanmaz. Kod ile yapılabilenleri ayrıca belirtin.
- Kar/yağmur izi kolonların üst yüzeyinde iniş noktasını okunmaz yapmamalı; iniş yüzeyi net kalmalı.
- Mevcut pijama/gece kıyafeti ile mevsim kıyafeti çakışmasını çözün (gece durağında pijama nasıl olacak?).
- Hassas konulardan kaçının.

İstenen (Türkçe, sade, ~700 kelime):
1. Dört mevsim kıyafeti önerisi (yaz: atlet + uzun paçalı don — kullanıcının fikri; kış: büyük mont; ilkbahar/sonbahar için 1-2 seçenek), mevsimin nasıl belirleneceği (takvim mi, gerçek sıcaklık mı, ikisi mi), komik/sevimli ayrıntılar (ör. kışın atkı, burun kızarması; yazın terleme).
2. Üretim yolu ve efor: her poz için yeni sprite seti mi (kaç görsel?), yoksa gövde üstüne katman (mont/atkı/şapka) mı? Pozlar arası tutarlılık riski, en ucuz güvenli yol.
3. Arka plan ve kolonlarda hava/mevsim izi: kar (çatılarda kar örtüsü, saçaklarda buz sarkıtları, kar birikintisi), yağmur (ıslak parlak kiremit, su birikintisi, damlayan saçak), rüzgâr (çamaşır, bayrak, uçuşan yaprak), sonbahar (sarı yapraklar), ilkbahar (erguvan/lale), yaz (güneş parıltısı). Hangileri kodla (renk, katman, parçacık), hangileri görsel ister; iniş yüzeyinin okunurluğu.
4. Önerdiğiniz sıra: ilk yapılacak 3 adım ve nedeni.
