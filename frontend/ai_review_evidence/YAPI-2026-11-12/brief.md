# YAPI-2026-11-12 — Oyunun yapısı ve yeni özellikler

Kullanıcının sorusu (özet): "10–15 kolondan sonra durak olabilir. Sonrasında oyun etap etap mı olmalı, bölüm geçme gibi mi, yoksa sonsuz bir oyun mu? Bu oyuna ne katabiliriz, nasıl özellikler kazandırabiliriz?"

## Oyunun bugünkü hali (telefonda, kullanıcı kabul etti)
- Tek dokunuş: basılı tut = şarj, bırak = zıpla. Sonsuz, rastgele dizilen İstanbul çatıları (12 farklı cephe), sabit kamera kuralları; düşünce oyun biter. Çoklu kule atlamada büyük "+N" ve emoji.
- Karakter: bordo eşofmanlı, bıyıklı amca (1,4×, ince hale). Şarjda yüz ifadesi gergin → ıkınma → "patlamak üzere".
- Her zıplamada gerçek osuruk sesi ve uçak izi gibi gaz bulutu (kullanıcı kararı "her zıplamada kalsın"). Sesler: şarj, iniş "tak", çoklu "tıng", düşüş, rekorda vapur düdüğü. Toz + esneme. Sağ üstte ses aç/kapa.
- Arka plan: Boğaz, Galata, köprü, vapurlar; tek sabit kartpostal (kayar). Gün/saat değişmiyor.
- Tek kalıcı veri: rekor. Merkeze iniş puanı 0 (deneme ayarı). Ana menü, ayarlar ekranı, ilerleme, görev yok.
- Kod notu: `initWorld(seed)` sabit tohumla aynı haritayı üretebiliyor (günlük harita için hazır).

## Kararlar / kısıtlar
- Oyunun adı "Çarşamba" OLMAYACAK; yeni ad henüz belirsiz (öneri listesi: Hop Amca vb.). Raporda ad kullanma, "oyun" de.
- Atlama fiziği, kamera, çatı silueti değişmez. iOS performansı hassas (kırpma maskesi/gölge pahalı).
- Yeni espri satırı istenmiyor (kullanıcı reddetti); kaba ifade yok. Gaz şakası kalıcı.
- Yeni görsel/kredi, para, hesap, yayın: her biri ayrı kullanıcı onayı. Ücretli Apple hesabı şimdilik yok; sunucu/hesap gerektiren işler ertelenmiş durumda.
- Önceki tur (YOL-2026-11-12/rapor.html): önerilen "yolculuk" denemesi = her 15 kulede bir durak, ekranda semt adı, gökyüzü sabahtan akşama bir adım ilerler, son durak iskele/vapura yetiş, sonuç kartında "En uzak durak".

## İstenen (kendi uzmanlık açından, en fazla ~1,5 sayfa, Türkçe, somut)
1. **Yapı kararı:** Sonsuz mu, etap/bölüm mü, yoksa melez mi (ör. sonsuz koşu içinde duraklar; ya da seçilebilir bölümler + sonsuz mod)? Önerdiğin yapıyı ve nedenini yaz. Durağa varınca ne olur (kayıt noktası? ödül? kısa kutlama? hız/zorluk artışı?), düşünce nereden başlanır?
2. **Zorluk eğrisi:** Duraklar arasında ne değişsin (kule aralığı/genişliği, yükseklik farkı, hareketli öğe, rüzgâr vb.)? Fizik değişmeden yapılabilenleri ayır.
3. **Özellik fikirleri:** En fazla 6 fikir, her biri için: ne, oyuncuya kattığı (neden tekrar oynar), boyut (küçük/orta/büyük), görsel üretimi gerekir mi, risk. İstanbul kimliği ve amca/gaz mizahıyla bağ kur.
4. **Sıra:** Bu fikirlerden ilk denenecek 2'si ve neden.
5. **Yapılmaması gereken** 1–2 şey.
