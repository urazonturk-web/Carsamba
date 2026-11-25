Kıvılcım için — CESIT-SAKIN-2-2026-11-25: yeni kadın ve kedilerin kış/yağmur hâlleri (Byzantion)

Kullanıcı onayı: "ikinci turu başlat" (2026-11-25; önceden önerilen 14 çizim). Bu iş TAM 14 görsel üretim çağrısı; fazlası gerekirse önce sor.
Önceki tur: CODEX-MESAJI-CESIT-SAKIN-2026-11-25.md (çıktıları oyunda: frontend/assets/environment/mahalle/).

Genel kurallar:
- Her çizim kaynağıyla AYNI tuval, AYNI karakter kimliği (yüz, saç, kedi deseni), aynı yer ve ölçek. Pervaz/ayak/gövde alt çizgisi aynı pikselde.
- Aynı üslup; şeffaf PNG; arka plan, yazı, zemin gölgesi yok. Kar tanesi/yağmur damlası yalnız karakterin üstünde.
- Arapça ünlem ve dini motif yok.
Çıktı klasörü: ~/Documents/Codex/2026-09-09/referenced-chatgpt-conversation-this-is-an/shared/CESIT-SAKIN-2-preview/

## A) Kadınların "serin" hâli — 6 çizim (hem kışta hem yağmurda kullanılır)
Serin havada pencereden iş yapılmaz: her kadın kalın giyinmiş, elinde buharı tüten ince belli çay bardağı ya da sıcak bir şeyle pencereden dışarı bakıyor; hafif üşümüş ama güler yüzlü. Eşya pervazın altına sarkmasın (pervaz y = 414).
Kaynaklar 600×780: frontend/assets/environment/mahalle/cumba-sulayan.png, -bakis; cumba-orgu.png, -bakis; cumba-sofra.png, -bakis.
1–2. Genç kadın: kalın hardal hırka + yün atkı, at kuyruğu aynı; iki eliyle çay bardağı. Poz 2 aynı kadın başını çevirip bakıyor.
     Çıktı: cumba-sulayan-serin.png, cumba-sulayan-serin-bakis.png
3–4. Nine: mor yeleğin üstüne kalın yün şal, gözlük aynı; elinde yarım örgü YERİNE dumanı tüten çay bardağı (örgü kucağında, pervaza sarkmıyor).
     Çıktı: cumba-orgu-serin.png, cumba-orgu-serin-bakis.png
5–6. Kızıl saçlı kadın: lacivert kalın hırka, sofra bezi YOK; elinde sıcak süt/salep fincanı.
     Çıktı: cumba-sofra-serin.png, cumba-sofra-serin-bakis.png

## B) Kedilerin kış ve yağmur hâlleri — 8 çizim (360×255)
Kaynaklar: kedi-smokin.png, kedi-beyaz.png, kedi-uc-renk.png, kedi-tekir-oturan.png.
Kış (üşüyen): tüyler kabarmış, kuyruğunu üstüne sarmış, sıkıca büzülmüş, sırtında birkaç kar tanesi, hafif titreme çizgileri.
Yağmur (ıslak): tüyler ıslak ve yapışık, kulaklar geriye yatık, huysuz; üstünde birkaç damla.
Gövde alt çizgisi kaynakla aynı (smokin y≈190, beyaz y≈225, üç renk y≈193, oturan tekir y≈247). Kuyruk pervazdan aşağı SARKMASIN.
7–8.   kedi-smokin-kis.png, kedi-smokin-yagmur.png
9–10.  kedi-beyaz-kis.png, kedi-beyaz-yagmur.png
11–12. kedi-uc-renk-kis.png, kedi-uc-renk-yagmur.png
13–14. kedi-tekir-oturan-kis.png, kedi-tekir-oturan-yagmur.png (oturuşu korunur; kışta kuyruğu ayaklarına sıkıca sarılı, büzülmüş)

## Teslim
- 14 PNG + onizleme.png (her yeni görsel kaynağının yanında, ızgara).
- Her biri için kontrol: tuval boyutu ve alt çizgi kaynakla aynı mı; değilse düzelt.
- Bitince tek satır: hangisi hazır, hangisinde sorun var. Oyun koduna dokunma; kullanıcı kabul etmeden oyuna girmez.
