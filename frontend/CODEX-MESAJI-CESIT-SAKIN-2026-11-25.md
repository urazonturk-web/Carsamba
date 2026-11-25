Kıvılcım için — CESIT-SAKIN-2026-11-25: pencerede yeni kadınlar ve yeni kediler, yaz/sonbahar hâli (Byzantion)

Kullanıcı onayı: "Evet, 10 çizim" (2026-11-25). Bu iş TAM 10 görsel üretim çağrısı; fazlası gerekirse önce sor.
Kullanıcının sözü: "hep aynı kadın ve hep aynı kedi görseli olması çeşitlilik olsun. boyut daha iyi".

Genel kurallar:
- Tuval boyutu, karakterin tuvaldeki yeri ve ölçeği ŞABLONLA AYNI. Oyun bu görselleri aynı kutuya çiziyor.
- Aynı çizim üslubu: kalın kontur, sıcak renkler, mevcut teyze ve kedilerle aynı el.
- Şeffaf PNG. Arka plan, yazı ya da zemin gölgesi yok.
- Arapça ünlem ve dini motif yok. Halı/kilim YOK: halı silken teyze zaten var.
- Yeni kadınlar birbirine ve mevcut teyzeye benzemesin: yaş, saç, kıyafet rengi ve eşya farklı olsun.
Çıktı klasörü: ~/Documents/Codex/2026-09-09/referenced-chatgpt-conversation-this-is-an/shared/CESIT-SAKIN-preview/

## A) Pencerede yeni kadınlar: 3 kadın × 2 poz = 6 çizim
Şablon: frontend/assets/environment/mahalle/cumba-teyze-hali.png ve cumba-teyze-bakis.png (600×780).
Kadın cumba penceresinden belinden yukarısı görünecek şekilde eğilir. Pervaz çizgisi y = 414; bunun altına yalnız
elindeki eşya sarkabilir. Gövde şablondaki teyzeyle aynı ölçekte ve aynı yerde (baş y ≈ 50–200, omuzlar y ≈ 230).
Poz 1 "durma": işini yapıyor. Poz 2 "bakış": aynı kadın, işini bırakmadan başını çevirip şaşkın/gülümseyerek bakıyor (bakis şablonundaki gibi).
1–2. Genç kadın (25–30 yaş), at kuyruğu koyu saç, çiçekli yazlık bluz; elindeki küçük bakır güğümle pervazdaki
     sardunya saksısını suluyor. Çıktı: cumba-sulayan.png, cumba-sulayan-bakis.png
3–4. Yaşlı nine (70+), topuz beyaz saç, gözlük, mor yelek; elinde şiş ve yumak, pervazdan sarkan yarım örgü atkı.
     Çıktı: cumba-orgu.png, cumba-orgu-bakis.png
5–6. Orta yaşlı kadın (45–50), kısa kıvırcık kızıl saç, mavi ev elbisesi; iki eliyle beyaz dantel kenarlı sofra
     bezini pencereden silkeliyor (ekmek kırıntıları uçuşuyor). Çıktı: cumba-sofra.png, cumba-sofra-bakis.png

## B) Yeni kediler: 4 çizim
Şablon: frontend/assets/environment/mahalle/kedi-uyuyan.png (360×255). Kedi cumba penceresinde/saçak köşesinde durur.
Gövde alt çizgisi (ayak/karın) y ≈ 193, şablondaki gibi; kedi tuvali yatayda şablondaki kadar doldursun.
7. Siyah-beyaz (smokin) kedi, yan yatmış uyuyor, patisi yüzünde. Çıktı: kedi-smokin.png (360×255)
8. Bembeyaz tüylü kedi, top gibi kıvrılmış, bir gözü yarı açık. Çıktı: kedi-beyaz.png (360×255)
9. Üç renkli (beyaz-turuncu-siyah) kedi, ekmek somunu gibi oturmuş, gözler kapalı. Çıktı: kedi-uc-renk.png (360×255)
10. Kahverengi tekir, dik oturmuş, kuyruğu ayaklarına sarılı, meraklı bakıyor. Çıktı: kedi-tekir-oturan.png (360×255;
    dik durduğu için ayak çizgisi tuvalin altına yakın, y ≈ 250 olabilir; bunu teslimde belirt).

## Teslim
- 10 PNG + onizleme.png (her yeni görsel şablonunun yanında, ızgara).
- Her biri için kontrol: tuval boyutu doğru mu, pervaz/ayak çizgisi şablonla aynı pikselde mi; değilse düzelt.
- Bitince tek satır: hangisi hazır, hangisinde sorun var. Oyun koduna dokunma; kullanıcı kabul etmeden oyuna girmez.
