# Sanat yönetmeni: Yapı ve yeni özellikler (12 Kasım 2026)

Kaynak: brief, YOL-2026-11-12 (editor-sanat, rapor), ANALIZ-2026-11-11 kontakt. Bakış açım: görsel ilerleme, İstanbul kimliği, karakter/mizah dili, görsel üretim maliyeti, iOS performansı.

## 1. Yapı kararı: melez, yani tek sonsuz koşu içinde görsel duraklar
- **Seçilebilir bölüm yapmayın.** Her bölüm ayrı bir arka plan, kule seti ve menü ekranı demek. Bu da 5 ile 10 arasında görsel çağrısı ve üslup kayması riski getirir. Tek dokunuşlu oyunun "bir tur daha" ritmini de bozar.
- **Öneri:** Koşu sonsuz kalsın. Her 15 kulede bir **durak** gelsin ve durak, oyuncuya görsel bir ödül olarak dönsün. Gökyüzü bir saat ileri gider (sabah, öğle, ikindi, gün batımı, gece). Ekranın üstünde 1,5 sn semt adı kartı belirir: "Karaköy", ardından "Galata", "Eminönü"… Bu iş yalnız yazıyla ve kodla yapılır, arka plan değişmez. Durak kulesinin çatısında küçük bir **durak tabelası** (İETT/vapur iskelesi tabelası gibi) olur. Amca o kuleye inince 0,6 sn "oh be" pozu verir: mevcut %0 ifadesi, küçük bir esneme ve normalden büyük bir gaz bulutu. Bunlar yeni çizim değil, var olan parçaların ölçeği ve zamanlamasıdır.
- **Kayıt noktası olmasın.** Düşünce baştan başlansın. Kayıt noktası, gün batımına varmayı sıradanlaştırır ve paylaşılacak anı öldürür. Sonuç kartında "En uzak durak: Eminönü · gün batımı" yazsın, ilerleme hissi buradan gelsin.
- **Durakta hız ve zorluk birden artmasın.** Görsel değişim zaten "yeni bölüm" hissini veriyor. Zorluk aşağıdaki eğriyle yavaşça artmalı.

## 2. Zorluk eğrisi (fizik değişmeden)
| Durak | Fizik değişmeden ayarlanabilenler | Görsel karşılığı |
|---|---|---|
| 1 (0–15) | Geniş çatı, kısa aralık, az yükseklik farkı | Sabah, sakin |
| 2 (15–30) | Aralık biraz açılır, dar cepheler daha sık gelir | Öğle, vapur trafiği artar (arka plan animasyonu) |
| 3 (30–45) | Yükseklik farkı artar, iki dar kule arka arkaya gelebilir | İkindi, sıcak ton |
| 4+ | Hepsinin karışımı, nadiren "kuyu" (çok alçak kule) | Gün batımı, sonra gece pencere ışıkları |

- Kule genişliği ve aralığı yalnız **üretici parametresi**. Fiziği ve kamerayı değiştirmez. Mevcut 12 cepheyle yapılır, yeni görsel gerektirmez.
- **Rüzgâr ve hareketli kule, fizik değişikliğidir.** Bu turda yapılmamalı. Rüzgâr ancak tamamen görsel kalabilir: çamaşır ipleri ve bayraklar sallanır, mekaniğe etkisi olmaz.

## 3. Özellik fikirleri (en fazla 6)
| # | Ne | Oyuncuya katkısı | Boyut | Görsel üretimi | Risk |
|---|---|---|---|---|---|
| 1 | **Gün akışı + semt kartı** (duraklar, yukarıdaki yapı) | Görünür ilerleme, "gün batımına kadar gideyim" hedefi, paylaşılacak an | Küçük–orta | Yok (kodla renk katmanı; varyant görseli sonra) | Renk katmanı kuleleri bulandırmamalı, yalnız arka plana uygulanmalı, maske kullanılmamalı |
| 2 | **Günün haritası** (`initWorld(seed)`, tarihten tohum) | Herkes aynı haritayı oynar, "bugün kaç yaptın" sohbeti | Küçük | Yok, yalnız başlıkta "Bugün: 12 Kasım" | Sunucusuz kalmalı (yerel tarih) |
| 3 | **Eşofman/aksesuar dolabı**: durak ilk kez geçilince açılır (fes, kasket, simit tutan el; eşofman renkleri takım çağrıştırmayan nötr tonlar: lacivert, yeşil, gri) | Uzun vadeli hedef, karakter sahiplenme | Orta | Renk değişimi kodla (tint) yapılabilir. Fes ve kasket 2–3 küçük görsel çağrısı ister, ayrı onay gerekir. | Takım renkleri tartışma çıkarır. Karakter çizimi bozulmamalı, aksesuar birebir bindirilmeli. |
| 4 | **İstanbul anlık olayları** (sadece görsel): arkadan martı geçer, vapur düdük çalar, köprüde trafik. Rekora yaklaşınca simitçi tablası belirir. | Ekran canlı kalır, sürpriz duygusu | Küçük | Yok (mevcut martı ve vapur parçaları) | Aynı anda tek olay olmalı, yoksa kalabalık ve performans sorunu |
| 5 | **Sonuç kartı fotoğrafı**: düştüğün durağın gökyüzü + amcanın %100 ifadesi + "En uzak durak" bilgisi, tek dokunuşla paylaşılır | Paylaşım ve organik büyüme | Orta | Yok (oyun içi kompozisyon) | Paylaşım menüsü yerel olmalı, hesap gerekmemeli |
| 6 | **Son durak "vapura yetiş"** (40–45 kule): son kule iskele olur, vapur kalkar, düdük çalar, amca vapura el sallar (kutlama sahnesi, fizik değil) | Somut bir "bitirdim" anı; sonra sonsuz devam eder | Orta | 1 iskele cephesi çağrısı, ayrı onay | Hareketli iniş yüzeyi olmamalı; vapur yalnız arka plan öğesi |

## 4. Sıra: ilk denenecek 2 fikir
1. **Gün akışı + semt kartı (#1).** En büyük eksik olan görsel ilerlemeyi kredi harcamadan çözer, durak yapısının iskeletini kurar. Diğer fikirlerin hepsi bunun üzerine oturur.
2. **Günün haritası (#2).** Kod tarafı hazır, görsel maliyeti sıfır. #1 ile birleşince "bugün Eminönü'ne vardım" gibi paylaşılabilir ve karşılaştırılabilir bir cümle doğar.
(Dolap ve vapur sahnesi, gün akışı telefonda beğenildikten sonra görsel onayıyla gelir.)

## 5. Yapılmaması gerekenler
- **Semt başına yeni arka plan veya kule seti üretilmemeli.** 3–5 çağrı ister, üslup kayar, bellek yükü artar. Semt kimliği bu aşamada yazı kartı ve gökyüzü saatiyle verilmeli.
- **Mizah katmanı büyütülmemeli.** Yeni espri metni, yeni gaz türü veya kaba ses eklenmemeli. Duraktaki büyük gaz bulutu var olan efektin ölçeği olarak kalmalı, yeni bir öğe olmamalı.
