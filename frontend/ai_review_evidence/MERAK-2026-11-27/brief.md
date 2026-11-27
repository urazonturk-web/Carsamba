# MERAK-2026-11-27 — "Zıplamayı bozmadan farklı hissettirecek, merak uyandıracak bir şey" (brief)

## Kullanıcının isteği (aynen)
"oyunumuza bir hikaye kattık sahil şeridi boyunca zıplayarak giden bir amcamız var. zıplama mekaniğini bozmadan farklı hissettirecek bir şeyler yapmalıyız. mesela havada aldığı kuru kafa gibi başka bir nesne alınca bir yere ışınlanabilir farklı bir yerde zıplamaya devam edebilir gibi insanlara merak uyandıracak bir şey bulmalıyız. bu konuyu … editörlerle beraber değerlendirip bana bir rapor sunun. sınırlarınızı zorlayın"

## Oyun (Byzantion, iPhone, Expo/React Native + Reanimated)
- Tek dokunuş: basılı tut (şarj) → bırak → amca (bordo eşofmanlı, bıyıklı, büyük kafalı karikatür İstanbul amcası) kuleden kuleye zıplar. Kule = eski İstanbul evleri/çatılar; arka planda Boğaz, vapurlar.
- Güzergâh: Kadıköy'den başlayıp Boğaz boyunca kuzeye; her 15 kulede bir durak (Harem, Üsküdar·Kız Kulesi, Kuzguncuk, Beylerbeyi, Ortaköy, Arnavutköy, Bebek, Rumeli Hisarı, Kanlıca, Beykoz, Anadolu Kavağı, Rumeli Feneri); üç köprüde yaka değişir; son: "Karadeniz'e ulaştın!", sonrası "Gece seferi N". Düşünce baştan. (src/game/stops.ts)
- Mevcut özel nesne: KURUKAFA (src/game/kurukafa.ts) — 4. kuleden sonra rastgele, iki kule arası zıplama yayının tepesinde havada durur; değince 50/50 kulelerin iniş yüzeyi 3–8 iniş boyunca %10–30 büyür/küçülür. Kule dizisi değişmez (ayrı karma).
- Diğer var olanlar: gerçek İstanbul havası (yağmur, kar, lodos, sis), gece/gündüz, şemsiye (yağmurda düşerken açılır), pijama/gece külahı, kış kıyafeti, kargalar/kediler/martılar, teyze/komşu diyalog balonları, "çay ısmarla" ve kartpostal paylaşımı, günün haritası (daily.ts), meydan/yarış (meydan.ts, yaris.ts), fener (sisli bölümde yüz ışığı), gaz (osuruk) deneme.
- Geçmiş fikir raporları (tekrar etmemek için oku): ai_review_evidence/YARATICI-FIKIR-2026-11-17/RAPOR.md, FIKIR-PUAN-2026-11-20/RAPOR.md, FIKIR-GELIR-2026-11-18/RAPOR.md, HIKAYE4-2026-11-12/.

## Değişmez çekirdek (aşılırsa ayrı onay gerekir)
- Zıplama fiziği (config.ts, jump.ts, landing.ts), şarj → zıplama → iniş matematiği, çarpışma/footSoles, kamera, prosedürel kule üretimi (procedural-course.ts), puan kuralı. "Zıplama mekaniğini bozmadan" = bunlar aynı kalır; yeni şeyler bunların ÜSTÜNE oturmalı (görsel bağlam, sahne, kural katmanı, nesne).
- İçerik: Arapça ünlem (maşallah, helal, nazar vb.) yok, dini motif yok. Film/marka/karakter adı yok. Başka bir oyunun birebir kopyası yok.
- Yeni görseller Kıvılcım (görsel üretici) ile, her çağrı ayrı onayla; tek kişilik küçük ekip — maliyeti gerçekçi düşün.

## İstenen
"Sınırlarınızı zorlayın": güvenli küçük fikirler değil, oyuncuyu "bu ne? orası neresi?" dedirtecek, merak ve paylaşma isteği uyandıracak fikirler. Işınlanma fikrini ciddiye al ama ona hapsolma. Her fikir için: ne olur (oyuncu gözünden 2–3 cümle), neden merak uyandırır, zıplamayı nasıl bozmaz, kabaca maliyet (kod/görsel), en büyük risk. Sonunda kendi 1 numaran ve neden.
