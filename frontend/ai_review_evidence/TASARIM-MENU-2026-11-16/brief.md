Sen bir mobil oyun arayüz tasarımcısısın. KOD DEĞİŞTİRME; yalnız oku, ekran görüntülerine bak, değerlendir. Türkçe, en fazla ~700 kelime.

Oyun: Byzantion — Expo/React Native iPhone oyunu. Bıyıklı, eşofmanlı bir amca İstanbul çatılarında kuleden kuleye zıplıyor. Sanat: sıcak, el çizimi İstanbul (Boğaz, vapurlar, kiremit çatılar, kilim desenleri). Arayüz kodu: app/index.tsx (stiller dosyanın sonunda: trCard, trPlayBtn, modeBtn, goIcon*, goInfoPill, menuTitle, sfxBtn). Ekli görüntüler:
1-menu.png: yeni açılış menüsü (BYZANTION yazısı, Oyna, 2 dk yarış, Kod gir / Sıralama / Kartpostal).
2-oyun-sonu.png: oyun bitince çıkan kart (skor, rekor, durak bilgisi, Bir daha, 5 ikon: Meydan oku/Kod gir/2 dk yarış/Sıralama/Kartpostal, harita kodu + kopyala, sürüm etiketi).
3-yaris-sonu.png: 2 dk hayalet yarış sonucu kartı.
4-ses-dugmesi.png: sağ üstteki ses düğmesi ("🔊 Ses açık" / kırmızı "🔇 Ses kapalı"). Kullanıcı: "o simgeyi değiştirelim" — 🔊 emojisi beğenilmedi.

Kullanıcı istekleri: menü ve oyun sonu ekranının tasarımını iyileştirmek; ses simgesini değiştirmek. Daha önce "oyun sonu ekranı çok karışık" dedi ve sadeleştirildi.

Değerlendir:
1. Menü: ilk izlenim, hiyerarşi, oyunun kimliğini (İstanbul, amca, kilim) ne kadar yansıtıyor? Somut öneriler (amcanın menüde görünmesi, başlık tipografisi, düğme sırası/sayısı, arka planın kullanımı).
2. Oyun sonu kartı: hâlâ karışık mı? Ne kalmalı, ne gitmeli/taşınmalı (ör. harita kodu, sürüm etiketi, 5 ikon)? Öncelik sırası.
3. Yarış sonu kartı: okunabilirlik, kazanma/kaybetme duygusu.
4. Ses simgesi: emoji yerine ne? (Kod ile çizilen hoparlör, vapur düdüğü/çan gibi temaya uygun simge, yalnız yazı...) Artı/eksi.
5. Yeni görsel (logo, simge) gerekiyorsa hangisi gerçekten değer; yeni görsel olmadan kodla yapılabilecek en iyi iyileştirmeler.
Önerileri "hemen yapılabilir (kodla)" ve "görsel üretimi gerekir" diye ayır; her birine kısa gerekçe yaz.
