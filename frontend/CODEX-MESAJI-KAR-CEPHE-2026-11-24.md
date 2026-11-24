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
