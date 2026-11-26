# Byzantion — Oynanabilirliği nasıl artırırız? (brif, 2026-11-26)

Kullanıcının sorusu: "oyunun oynanılabilitesini arttırmak için neler yapılabilir diğer editörlerle bir değerlendirme yapın ve bana rapor sunun; bunu yaparken en çok oynanan bu tarz oyunların içeriğini de kontrol edin".

## Oyun (bağlam)
Byzantion: Expo/React Native iPhone oyunu (Android sonra). Tek dokunuşlu "basılı tut-bırak-zıpla": bıyıklı, kırmızı eşofmanlı İstanbullu bir amca, İstanbul çatılarındaki kuleler arasında zıplar (tür olarak WeChat "Jump Jump / 跳一跳", Stick Hero, Mr Jump, Doodle Jump ailesine yakın). Karikatür çizgi, Türkçe arayüz; hedef Türk oyuncu + yurt dışı. TestFlight'ta (birkaç arkadaş), App Store'da değil. Geliştirici tek kişi (kod: Claude Code; görseller bir görsel üretim aracından, her görsel ayrı onayla).

Kod: `/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend` (ana ekran `app/index.tsx`, oyun dosyaları `src/game/`). Okuyabilirsin; DEĞİŞTİRME.

Şu an oyunda olanlar:
- Basılı tut → şarj, bırak → zıpla. Kule başına +4/+6 puan, seri ateşi, aşırı basınca amca patlar. Fizik/kule üretimi/çarpışma/kamera SABİT (değiştirmek ayrı kullanıcı onayı ister).
- Güzergâh: 15 kulede bir durak/semt (12 durak: Kadıköy → … → Rumeli Feneri), 3 köprü geçişi; her durakta açılan **kartpostal albümü (12)**; gece durağında pijama anı.
- **Kedi defteri (12 adlı kedi)**: cumba pencerelerinde 6 görünümde kediler; yanına inince "X ile tanıştın".
- **Cumba sakinleri**: 4 kadın (yaz + kış/yağmur hâli), her koşuda rastgele dağılım; kargalar konup kalkar.
- **Gerçek İstanbul**: saat/gün batımı/ay evresi, gerçek hava (yağmur/kar/sis/lodos/poyraz), mevsim (yapraklar, kış cepheleri, mevsime göre İstanbul siluet arka planı); amcanın kışlık/yağmurluk kıyafeti.
- **Özel günler**: menü manşeti + amcanın başına o güne özel başlık.
- **Kurukafa**: havada değerse 5 zıplama kuleler %20 büyür/küçülür. **Osuruk gazı**: her zıplamada ses + bulut izi.
- **Sosyal**: Game Center rekor tablosu, "Meydan oku · 2 dakika" yarış modu, hayalet yarış, günün haritası / harita kodu, paylaşım kartpostalı, oyun sonu lakap.
- **Destek**: "Amcaya çay ısmarla" (3 kalıcı ürün, yalnız rozet; oyunu kolaylaştırmaz). Reklam yok.

Önceki fikir raporlarında (tekrar önerme, gerekirse "zaten önerildi" de): balkon seyircileri (yapıldı: cumba sakinleri), çatı kedileri + kedi defteri (yapıldı), kişisel kartpostal/lakap (yapıldı), iniş seri ödülü + titreşim + toz, düşüş repertuarı (vapura/çamaşır ipine düşmek), "Hanım arıyor" oyun sonu bildirimi, bıyık barometresi, kayıp terlik, muhtarlık ilan panosu, sahur davulcusu, semte göre ses, saate göre gölgeler, kıyafet/gaz paketi satışları.

Kurallar: Arapça ünlem (maşallah, helal, nazar vb.) önerme. Kazanmak-için-öde önerme. Yeni görsel gerektiren her öneride kaç görsel gerektiğini yaz.

## İstenen
"Oynanabilirlik" = ilk dakikada anlaşılırlık, el hissi (iniş tatmini), zorluk eğrisi, bir oturumu uzatan şey, ertesi gün geri getiren şey, çeşitlilik/sürpriz, erişilebilirlik.
Rapor biçimi kendi dosyanda verilir; kesin olmayan rakamları "tahmin" diye işaretle.
