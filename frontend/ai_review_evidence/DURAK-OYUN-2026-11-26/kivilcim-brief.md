# DURAK-OYUN-2026-11-26 — (1) sinematik zıplama/iniş pozları, (2) durakta açılan "oyun içinde oyun"

## Kullanıcının sözleri (kelimesi kelimesine)
1. "1 nolu önerin için konuşuyorum yeniden çizimler yapılsın mesela matrix filmindeki atlama sahneleri gibi ya da hulkun atlaması gibi vb benzer işlerden yola çıkarak atlama ve iniş sahnelerimiz geliştirelim."
2. "2 nolu önerin beni hiç tatmin etmedi dümdüz bir zıplama oyunundan çıkarmak istiyorum mesela oyun içinde oyun açılsın gibi. belirli bir durağa vardıktan sonra mesela bir bulmaca açılsın önüne ya da bir harita vb şeyler olabilir. kartpostal falan filan bunlar boş işler"

→ Kullanıcı koleksiyon/kartpostal/toplama tarzı "meta" fikirleri İSTEMİYOR. İstediği: oyunun türünü genişleten, durakta açılan **gerçek oynanış** (mini oyun, bulmaca, harita ile ilgili bir şey).

## Bağlam
- Oyun: Byzantion, Expo/React Native iPhone. Eşofmanlı bıyıklı İstanbul amcası basılı tut-bırak ile gazla zıplayıp kule çatılarına iner. Kadıköy'den Rumeli Feneri'ne 12 durak (her 15 kulede bir: Harem, Üsküdar·Kız Kulesi, Kuzguncuk, Beylerbeyi, Ortaköy, Arnavutköy, Bebek, Rumeli Hisarı, Kanlıca, Beykoz, Anadolu Kavağı, Rumeli Feneri), 3 köprü. Düşünce baştan. Ton: sıcak mahalle mizahı, Arapça ünlem yok.
- Mevcut çizimler ve uçuş analizi: ../HAREKET-2026-11-26/ ve ../AMAC-2026-11-26/ (RAPOR.md + editör raporları + kareler/). Uçuşta amca dik, kollar yanda ("kazık"). Bugün eklenen Paket A: eğilme ±12°, kalkış esnemesi, hıza göre iniş çökmesi, kenar sallanması.
- Teknik: pozlar tek parça PNG; uçuşta poz seçimi kodla (`src/game/hareket.ts`, `ChargePoses.tsx`), dönme/ölçek ayak noktası etrafında; kıyafet katmanları (pijama/kış/yağmur/şemsiye/özel şapka) bindirme. Fizik, kamera, çarpışma DEĞİŞMEZ; yalnız görsel.
- Yeni görseller Kıvılcım (görsel üretici) ile; **her çağrı ayrı kullanıcı onayı**, kabul edilmeden oyuna bağlanmaz.

## Telif / özgünlük kuralı
Matrix, Hulk vb. yalnız **hareket dili ilhamı** (ağır çekim, süper kahraman inişi, yere çarpınca çatlak/toz şoku, havada yavaşlama, rüzgârda savrulan ceket). Film karakterlerinin görünüşü, kostümü, logosu, sahnesi KOPYALANMAZ; amcanın kendi kişiliğine uyarlanır (eşofman, terlik, kasket, bıyık, gaz). Prompt'larda film/karakter adı geçmemeli.

## (1) için istenen — animasyon/görsel editörü
- Sinematik hareket dilinden amcaya uyarlanmış **kalkış → uçuş → tepe → iniş** dizisi: hangi pozlar (en fazla 5-6), her biri için Kıvılcım'a verilebilecek ayrıntılı betimleme (kol/bacak açıları, gövde eğimi, yüz, bıyık, ceket, gaz), tuval/pivot kuralı (mevcut: 516 veya 1100 genişlik, 1103 yükseklik, ayak noktası), hangi uçuş evresinde ve hangi koşulda (uzun atış, çoklu kule, kusursuz iniş, patlama) gösterileceği.
- Pozla birlikte kodla eklenebilecek **sinematik efektler**: kısa ağır çekim anı (zaman ölçeği yalnız görsel mi yoksa fizik dt'si mi — fizik değişmez kuralını göz önünde tut, öneri fiziğe dokunuyorsa açıkça yaz), "süper iniş" çatı tozu/çatlak şok dalgası, ekran sarsıntısı (kamera değişmez kuralı!), hız çizgileri, gölge izi (afterimage), kamera dışı vinyet. Her birinin kural sınırına uyup uymadığını belirt.
- Kıyafet sürümlerini ve toplam görsel sayısını say; önce hangi 1-2 pozla denensin.

## (2) için istenen — oyun tasarımcıları
Durakta (ya da belirli duraklarda) açılan **oyun içinde oyun**. En az 8 somut fikir. Her biri için:
- Nasıl oynanır (dokunma/kaydırma/sürükleme; zıplama dışı kontrol serbest çünkü ayrı ekran), süresi (önerilen 20-60 sn), zorluk eğrisi.
- İstanbul/Boğaz/o semtle bağı (ör. Kız Kulesi'nde fener ışığıyla vapur yönlendirme, Rumeli Hisarı'nda surlar, Kanlıca'da yoğurt, Bebek'te kürek, köprüde trafik, vapur iskelesi, balık tutma, tavla, çay ocağı sıra, simit fırlatma, harita/yön bulma bulmacası, eski İstanbul haritası parçaları…).
- Ana oyuna dönüşte ne kazandırır (ör. bir sonraki bölüm için yardım: bir kez düşüşte kurtarma, durak başlangıcından devam hakkı — kayıt noktası şu an yok; bunlar kurala dokunur mu açıkça yaz), puan ilişkisi (puan kuralı değişikliği ayrı onay ister).
- Gerekli yeni görsel sayısı, uygulama büyüklüğü (S/M/L), riskler (akışı kesmesi, ilk oyunda sıkıcılık, tekrar edilebilirlik).
- Ayrıca **harita** fikri: ana oyunun üstüne bir Boğaz haritası katmanı (rota seçimi, dallanan güzergâh, gizli duraklar) olabilir mi?
- Benzer başarılı örnekler: "oyun içinde oyun" / mini oyunlu mobil oyunlar (WarioWare, Mario Party mini oyunları, Gardenscapes/Homescapes'in ana oyun + meta, Royal Match, Township, Subway Surfers etkinlikleri, Alto's Odyssey, "Monument Valley", "Florence", "Pokémon GO", "Hitman GO" vb.) — kaynak göster (web araması serbest).
- En iyi 3'ü seç; ilk yapılacak olanı gerekçelendir (en az görselle en büyük "tür değişimi" hissi).

Raporlar bu klasöre `editor-<rol>.md` olarak, Türkçe, ~1-1,5 sayfa, madde madde. Oyun kodunu DEĞİŞTİRMEYİN.


## Kıvılcım için not
Bu çağrıda görsel ÜRETMİYORSUN, dosya yazmıyorsun; yalnız metinle görüş ver. Rolün: görsel tasarım ve karakter dili. (1) Amcanın sinematik kalkış/uçuş/iniş pozlarını sen çizecek olsan nasıl çizerdin (her poz için kısa betimleme, film/karakter adı kullanmadan). (2) Durakta açılan mini oyun/bulmaca/harita fikirleri: görsel olarak en çekici ve İstanbul semtlerine özgü olanlar; her birinin kaç görsel istediği. Türkçe, ~1 sayfa.
