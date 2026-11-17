Sen Byzantion oyun projesinde (frontend/) ikinci görüş veren editörsün. KOD DEĞİŞTİRME. Türkçe, en fazla ~550 kelime.

Bağlam: src/game/stops.ts (12 durak, her 15 kulede bir; skyStepForStops: 1-4 sabah, 5-8 öğle, 9-10 ikindi, 11 gün batımı, 12+ gece; gece yıldızları skyStep>3; Boğaziçi Köprüsü 61-74, Ortaköy 75). Karakter: bordo eşofmanlı bıyıklı amca; src/game/character-pose.ts içinde 9 şarj pozu (charge-000…100-r12.png, 516 px genişlik, alfa PNG) + 5'inde "ifade" varyantı; app/index.tsx'te tek sprite olarak (px,py) fiziğine göre çiziliyor, ayrıca patlama/leke/sinek efektleri var. Kurallar: zıplama fiziği, kamera, çatı silüeti değişmez; yeni görsel kullanıcı kabulü olmadan oyuna bağlanmaz; görsel üretimi (Kıvılcım atölyesi, ücretli görüntü üretimi) ve harcama kullanıcı onayıyla.

Kullanıcı istekleri:
1) Gün batımı daha erken gelsin.
2) Gece olunca amca pijamasını giysin: gecenin başladığı ilk zıplamada, kondugu kulenin çatısında bir kapı belirsin, amca girip pijamalarla çıksın.

Claude'un taslağı:
- Gökyüzü: sabah 0-2. durak, öğle 3, ikindi 3-4 arası, gün batımı 4. durak (Beylerbeyi) + Boğaziçi Köprüsü üstü, GECE 5. durak Ortaköy (75. kule; eskiden de gece 75'te başlıyordu). Pijama anı Ortaköy'de. Final Rumeli Feneri'nde istenirse şafak.
- Kapı anı: Ortaköy durak kulesi zaten geniş "nefes" kulesi. Varışta çatıda küçük çatı kapısı (ya da çatı penceresi) belirir (0.2 sn), amca kapıya doğru küçülüp girer (0.4 sn), kapı kapanır/sallanır, "pijama" amca çıkar (0.4 sn), kapı kaybolur. Toplam ~1.2 sn; bu sürede dokunma yok sayılır (tek istisna: "durakta oyun durmaz" ilkesi burada bilerek esnetiliyor). Fizik/kule/kamera değişmez; yalnız çizim katmanı.
- Pijama görseli seçenekleri: (A) Ucuz: yalnız gece külahı (ponponlu takke) + terlik; her poz için baş/ayak çapası alfa taramasıyla ölçülür, tek küçük PNG. (B) Orta: aynı 9 pozun eşofmanı pijamaya (mavi-beyaz çizgili) dönüştürülmüş varyantları — Kıvılcım ile 9 (+5 ifade = 14) görüntü; siluet uyumu IoU ile kontrol (FAZ2-İFADE'de yapıldığı gibi). (C) B + kapı/geçiş için ek pozlar (esneme vb.).
- Yeni görseller: kapı sprite'ı + pijama. Kabul olmadan bağlanmaz. Öneri: önce kapı anını mevcut amcayla ve geçici bir kapıyla değil, onaylanmış görseller gelince bağlamak; mantığı ve zamanlamayı şimdiden hazırlamak serbest.

Sorular: Gece zamanlaması ve pijama anının yeri (Ortaköy) mantıklı mı? Kapı animasyonunun en sorunsuz yolu (worklet/fizik döngüsüyle çakışma, dokunma kilidi, kamera)? Kodda dikkat edilecek yerler (dosya:satır). A/B/C hangisi; B'de 14 pozun tutarlılığı (şarj sırasında kare kare titreme) riski. Leke/patlama efektleri pijamada nasıl? Sonunda tek paragraf öneri.
