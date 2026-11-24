# Hava/mevsim tutarlılık denetim listesi (2026-11-24)

Kullanıcı: "hala kar yağarken dışarıda halı asılmış bunun gibi tutarsızlıklar olmasın". Her teslimden önce bu tablo
simülatörde (kar ve yağmur testi + bugünkü mevsim) madde madde işaretlenir.

Hâller: YAZ (ilkbahar/yaz, kuru) · SONBAHAR (kuru) · KIŞ (kar yok) · YAĞMUR (yaz/sonbahar) · YAĞMUR+KIŞ · KAR

| Öğe | YAZ | SONBAHAR | KIŞ | YAĞMUR | YAĞMUR+KIŞ | KAR |
|---|---|---|---|---|---|---|
| Cephe bitkileri | yeşil, çiçekli | sarı-turuncu, krizantem | çıplak dal, kuru sap | yaz bitkisi (ıslak) | çıplak dal | çıplak dal + kar |
| Çamaşır | asılı | asılı | yok (boş ip) | yok | yok | yok (ipte kar) |
| Cephe kilimi | asılı (6 desen) | asılı (6 desen) | yok (sırık) | yok | yok | yok |
| Panjur rengi | yeşil/mavi/ceviz/bordo | aynı | aynı | aynı | aynı | aynı |
| Çatı | kiremit | kiremit | kiremit | ıslak kiremit | ıslak kiremit | kar örtüsü + saçak buzu |
| Cumba teyzesi | halı silker | halı silker | şal + çay | şal + çay | şal + çay | şal + çay |
| Kediler (kule) | uyuyan/gerinen | uyuyan/gerinen | üşüyen + titreme + nefes buharı | ıslak | ıslak | üşüyen + titreme + nefes |
| Arka plan çatısındaki kedi/kilim/çamaşır | var | var | yok | yok | yok | yok |
| Arka plan bitkileri | yeşil | sarı-turuncu | solgun | yeşil (temiz) | solgun | karlı |
| Amca kıyafeti | eşofman | eşofman | bere + atkı | yağmurluk + kasket | yağmurluk + kasket | bere + atkı |
| Düşüş pozu | normal | normal | kış | yağmur | yağmur | kış |

Bilinen boşluk: SONBAHAR+YAĞMUR'da cephe bitkileri yaz hâli (sonbahar çamaşırsız/kilimsiz atlası yok).
Eski pencere komşuları (amca, çocuk) ESKI_KOMSULAR_ON=false ile kapalı; serin hâlleri hazır.
