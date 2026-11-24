Kıvılcım için — KAR-CEPHE-2026-11-24: karlı günde kule cepheleri (Byzantion)

Kullanıcı onayı: "Evet, iste" (2026-11-24) — karlı cephe görseli istendi.
Kullanıcının sözleri: "karlı bölümde kolonlarımız üzerinde hiç kar yok ayrıca yazdan kalma gibi ama arka plan karlı ... balkonlardaki çiçekler vb şeylerde karlı olsun" ve "kışın çiçekler açmaz solar yaprak döker bu şekilde canlı olmaz".

## Durum
Kar yağan havada arka plan, çatılar (beyaz örtü, saçak buzu) ve amca (bere, atkı) karlı. Kule cepheleri ise yaz hâlinde: yeşil sarmaşık, açmış kırmızı/pembe sardunyalar, yemyeşil saksılar.
Cephe kaynağı: assets/environment/district/house/g018/facade-atlas-g018.jpg — 4200×1340, yatayda 12 hücre (her biri 350 px). Sıra: krem, açık pembe, aşı boyası, gri-mavi × (pencere, balkon, kilim/çamaşır/cumba).

## İstenen: 1 YENİ görsel — facade-atlas-g018-kar.jpg (görsel üretim çağrıları onaylı)
Aynı atlasın karlı kış günü hâli. Değişecekler:
- Sarmaşıklar yapraksız: yalnız çıplak, ince kahverengi dallar; dalların üstünde ince kar.
- Saksılarda çiçek yok: solmuş, kurumuş kahverengi saplar ya da boş saksı toprağı; saksıların ve balkon saksı kutularının üstünde kar yığını.
- Her yatay çıkıntıda kabarık kar: pencere pervazları, pencere üstü taş kemer ve lentolar, balkon tabanı ve korkuluk üstü, cumba çatısı ve cumba altı çıkıntıları, kilim/çamaşır sırıkları, duvar lambalarının üstü. Kar çıkıntının üstüne oturur; duvarın düz yüzeyine, camlara ve panjur yüzüne yapışmaz (panjur üst kenarında ince kar olabilir).
- Duvar sıvası, renkler, panjurlar, kilimler, çamaşırlar aynı kalır (hafif soğuk ışık serbest, renk değişimi yok). Kilim ve çamaşırlar kalabilir.

Değişmeyecekler (oyun koordinatları bunlara bağlı):
- Ölçü 4200×1340, 12 hücre × 350 px. Her pencere, panjur, pervaz, balkon, cumba, kilim, lamba aynı pikselde kalır (±2 px). Kargalar pervazlara konuyor; yer kayarsa havada dururlar.
- Dikey tekrar: hücre 0 1340 px'te kendini tekrar eder (üst ve alt kenar dikişsiz birleşir). Hücre 1–11'de satır y ile satır y+1035 aynıdır (ortalama fark < 4/255). Çıktıda da aynı kural tutmalı. En kolayı: her hücrenin 0–1035 bandını kışlaştırıp 1035–1340'ı 0–305'ten kopyalamak; hücre 0'da 1340'ın dikişini kontrol et.
- Hücreler arası sınır temiz kalsın (bir hücrenin karı komşu hücreye taşmasın).

Not: Claude kodla bir deneme yaptı (ai_review_evidence/KAR-CEPHE-2026-11-24/onizleme-once-sonra.jpg, karla.py). Kar yığma kısmı fena değildi ama çiçek ve yaprakları temiz silemedi. Kullanıcı bu yüzden çizim istedi; o görsele bakmak yerleştirme için fikir verebilir, kalite hedefi daha yüksek.

## Çıktılar
~/Documents/Codex/2026-09-09/referenced-chatgpt-conversation-this-is-an/shared/KAR-CEPHE-preview/
- facade-atlas-g018-kar.jpg (4200×1340, JPEG kalite ~90, mevcut dosyaya yakın boyut)
- onizleme-once-sonra.png: 4 örnek hücre (ör. 1, 4, 8, 11) üstte şimdiki, altta karlı
- hizalama.txt: her hücre için orijinal ile karlı arasında kenar haritası kayması (px) ve 1035 tekrar farkı ölçümü

Kurallar: yeni görsel yalnız bu atlas; fazlası gerekirse önce sor. Oyuna bağlama Claude Code'da; kullanıcı kabul etmeden oyuna girmez. Oyun kodunu değiştirme.

## Revizyon 1 (Claude inceledi, 2026-11-24 11:40) — RET
Teslim edilen aday, Claude'un kodla denemesiyle aynı yöntem: açmış kırmızı/pembe sardunyalar ve yapraklı sarmaşıklar duruyor. Kullanıcı tam olarak bunu reddetmişti ("kışın çiçekler açmaz solar yaprak döker bu şekilde canlı olmaz"). Onaylı iş ÇİZİM; görsel üretim çağrısı kullan.
Önerilen yol (geometri korunur):
1. Her hücre için bitki maskesi çıkar (saksı kutuları, sarmaşıklar, balkon çiçekleri; birkaç px genişlet). Pencere, panjur, kilim, cumba gövdesi maskenin DIŞINDA kalır.
2. Görsel modeliyle yalnız maskeli bölgeyi yeniden çiz (inpainting / düzenleme): yapraksız kahverengi çıplak sarmaşık dalları; saksılarda kurumuş, kahverengi saplar; üstlerinde kar. Canlı yeşil yaprak ve açmış çiçek SIFIR.
3. Maske dışını orijinal pikselden geri yapıştır (hizalama birebir kalır), sonra mevcut kar çıkıntılarını koru.
4. 1035 tekrarını yeniden kur (0–305 bandını 1035–1340'a kopyala); hücre 0'da dikişi kontrol et.
5. QA: her hücrede açmış çiçek ve yeşil yaprak kalmadığını yakın görüntüyle doğrula; kalırsa teslim etme, düzelt.
Aynı çıktı adları; önceki aday dosyalarının üzerine yaz.

## Revizyon 2 (2026-11-24) — 11 hücre çizimi, kullanıcı onaylı ("Evet, 11 çizim")
Claude, senin tek hücre çizimini (generated_images/.../exec-236cf0b1-...png, hücre 1) 350×1035'e küçültünce pencere sıralarının orijinalle KAYMASIZ örtüştüğünü ölçtü (kayma 0,0). Bitki/kar bölgelerini kendisi aktardı; sonuç kabul edildi (ai_review_evidence/KAR-CEPHE-2026-11-24/hucre1-once-sonra.jpg). Yani yöntem çalışıyor; yerleştirmeyi Claude yapacak.
Senden istenen: kalan 11 hücre için AYNI yöntem ve aynı istemle birer görsel düzenleme çağrısı (toplam 11, fazlası için sor):
- Hücre 2–11: atlasın x = c×350 … c×350+350, y = 0 … 1035 bandı.
- Hücre 0: y = 0 … 1340 (bu hücrenin tekrar boyu 1340).
- İstem hücre 1'dekiyle aynı: kış, yapraksız çıplak dallar, saksılarda kuru saplar, karlı; mimari, pencere, panjur, kilim, cumba, çamaşır aynı yerde.
- Bitki yoksa bile kilim/cumba/lamba üstlerine kar ekle.
- Kırpma, hizalama, birleştirme YAPMA. Ham çıktıyı kaydet:
  shared/KAR-CEPHE-preview/hucre-00-kis.png, hucre-02-kis.png … hucre-11-kis.png (hücre 1 için de mevcut çizimi hucre-01-kis.png olarak kopyala).
- Bitince tek satır: hangi hücreler hazır, hangisinde açmış çiçek ya da yeşil yaprak kaldı.
