# Byzantion — Pencere komşuları: oranı nasıl düzeltelim? (brif)

## Kullanıcının sözü (2026-11-21)
"Binadan çıkan kadınların olması aslında hoşuma gitti ama orantısal olarak da ayarlamak lazım tabi. O zaman baştan pencere oranına dönersek zor mu olur? Diğer editörlerle değerlendirin."
(Önceki mesajında: "camdan çıkan kadın bizim karaktere göre çok orantısız"; yazılı diyalogları beğenmedi.)

## Ölçümler (iPhone 17 ekran görüntüsü, 1206 px genişlik; `olcum-kare.png`)
- **Amca** (bıyıklı, kırmızı eşofmanlı ana karakter): boyu ~260 px, başı ~90 px genişliğinde. Karikatür olarak bilerek büyük çizilmiş (çizim ölçeği 1,4 kat; bu yalnız görüntü, çarpışma değil).
- **Kule (bina)**: genişliği ~255 px; bir kat ~250 px yüksekliğinde. Amca ≈ bir kat boyunda.
- **Cephedeki normal pencere**: panjurlarla ~200 px genişlik; cam ~110×110 px.
- **Komşu görseli** (teyze, pencereyle birlikte tek resim, `komsu-teyze-hali.png`): pencere çerçevesi ~140×190 px; içindeki teyzenin başı ~30 px. Yani teyze amcanın ~1/3'ü kadar; ayrıca pencere de cephedeki gerçek pencerelerden küçük.
- Kısacası: binalar ve pencereler amcaya göre küçük, teyze onlardan da küçük.

## Teknik çerçeve
- Kule genişliği, yüksekliği, çatı silueti ve iniş çizgisi oynanış (çarpışma) demek → DEĞİŞMEZ.
- Cephe görüntüsü (pencereler, kat dokusu) yalnız görsel: 12 cepheli bir atlas (`cephe-atlasi-kucuk.jpg`; kaynak 4200×1340, her cephe 350 px genişlik) ekranda ~1,7 kat büyütülerek çiziliyor. Atlası daha da büyütmek bulanıklaştırır; daha büyük pencereli cephe için yeni çizim gerekir.
- Amcanın çizim ölçeği (1,4) yalnız görüntü; küçültmek çarpışmayı değiştirmez ama kullanıcının kabul ettiği görünümü değiştirir.
- Komşu görselleri bir görsel üretim aracında, her biri ayrı onayla çizilir (amcanın çizgi dili).
- Komşu, iniş çizgisinin (çatı tepesi) altında kalmalı.

## Görev (Türkçe, en fazla ~800 kelime)
1. **"Baştan pencere oranına dönmek"** ne demek olabilir, seçenekleri çıkar ve her birinin zorluğunu (kod / yeni görsel / risk) değerlendir. En az şunları karşılaştır:
   a) Pencereler aynı kalır; komşu **amca ölçeğinde** yeniden çizilir (başı ~70–90 px; pencereye sığmayıp taşar, dirsekleri pervazda).
   b) **Cepheyi büyütmek:** pencereler amca boyuna yaklaşacak şekilde cephe dokusu büyür (her kulede daha az, daha büyük pencere); yeni cephe çizimi gerekir.
   c) Komşu için **özel büyük pencere/balkon** parçası: yalnız komşulu kulelerde, çatının hemen altında, amca ölçeğinde bir balkon ya da cumba; geri kalan cephe aynı.
   d) Amcanın çizim ölçeğini küçültmek (1,4 → örn. 1,15) + (a).
   e) Aklına gelen başka yol.
2. Hangisini önerirsin, neden? Görsel üretim isteği (kaç görsel) ve kod işi ne olur?
3. Komşu yazılı balon yerine nasıl tepki versin (jest/poz/ses)? Kısa öneri.
