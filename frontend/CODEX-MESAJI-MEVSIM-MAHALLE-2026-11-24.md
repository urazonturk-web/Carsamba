Kıvılcım için — MEVSIM-MAHALLE-2026-11-24: yağmur ve kar/kış hâlleri, çamaşır, teyze, komşular, kediler (Byzantion)

Kullanıcı onayı: "Evet, 19 çizim" (2026-11-24). Toplam 19 görsel üretim çağrısı; fazlası gerekirse önce sor.
Kullanıcının sözü: "kışın ve yağmurlu havalarda çamaşır asılması saçma olmuş ayrıca camdan çıkan teyzede yaz modunda bu mevsim değişikliklerinde mevsimine uygun olsun her taraf kedi de dahil olmak üzere. mesela kışın kedi üşür halde gözüksün".

Genel kurallar (hepsi için):
- Tuval boyutu ve karakterin tuvaldeki yeri/ölçeği ORİJİNALLE AYNI (oyun bu görselleri aynı kutuya çiziyor). Ayak/pencere pervazı/cumba alt kenarı aynı pikselde.
- Aynı çizim üslubu, aynı karakter kimliği (yüz, saç, bıyık, kedi deseni).
- Şeffaf PNG; arka plan, yazı, gölge zemini yok. Kar taneleri/yağmur damlası yalnız karakterin üstünde, tuvale dağılmış değil.
- Arapça ünlem ve dini motif yok.
Çıktı klasörü: ~/Documents/Codex/2026-09-09/referenced-chatgpt-conversation-this-is-an/shared/MEVSIM-MAHALLE-preview/

## A) Çamaşır — 8 çizim (cephe atlası hücreleri)
Atlas: frontend/assets/environment/district/house/g018/facade-atlas-g018.jpg (4200×1340, 12 hücre × 350 px). Çamaşırlı hücreler: 2, 5, 8, 11 (x = c×350 … +350). Her hücre için y = 0 … 1035 bandını kullan (KAR-CEPHE'de hücre 1'de yaptığın gibi; o yöntem kaymasız oturdu).
- Yağmur: orijinal atlasın bandı → çamaşır ipi BOŞ (mandal kalabilir), çamaşırların arkasındaki pencere/panjur/duvar tamamlanmış; geri kalan her şey aynı (yaz bitkileri dahil). Çıktı: camasir-yagmur-hucre-02.png, -05, -08, -11.
- Kar: frontend/assets/environment/district/house/g018/facade-atlas-g018-kar.jpg bandı → çamaşır ipi boş, ipin ve sırığın üstünde ince kar; geri kalan aynı. Çıktı: camasir-kar-hucre-02.png, -05, -08, -11.
Kırpma/birleştirme yapma; ham çıktı yeter, hizalamayı Claude yapar.

## B) Teyze — 3 çizim ("serin hava" hâli; hem yağmurda hem kışta kullanılacak)
Halı silkelemiyor (yağmurda/karda halı silkelenmez). Yün hırka + başında yün şal, iki eliyle buharı tüten ince belli çay bardağı tutuyor, pencereden dışarı bakıyor; hafif üşümüş ama güler yüzlü.
1. assets/environment/mahalle/cumba-teyze-hali.png (600×780) → cumba-teyze-serin.png (aynı tuval, aynı gövde yeri; halının yerini boş bırak).
2. assets/environment/mahalle/cumba-teyze-bakis.png (600×780) → cumba-teyze-serin-bakis.png (aynı hâl, başını çevirmiş bakan pozu, bakis görselindeki gibi).
3. assets/environment/mahalle/komsu-teyze-hali.png (440×615, pencere + panjurlar dahil) → komsu-teyze-serin.png (pencere/panjur birebir aynı, teyze serin hâlde, halı yok).

## C) Komşular — 2 çizim (yağmur ve kış ortak)
4. assets/environment/mahalle/komsu-amca-bagiran.png (440×461) → komsu-amca-serin.png: atlet yerine kalın örgü kazak, aynı bağıran poz, pencere aynı.
5. assets/environment/mahalle/komsu-cocuk-alkis.png (440×450) → komsu-cocuk-serin.png: ponponlu yün bere + atkı, aynı alkış pozu, penceredeki çiçek saksısı YOK, pencere aynı.

## D) Kediler — 6 çizim
Kediler kule çatısının yanına/pervaza konuyor; ayak/gövde alt çizgisi orijinalle aynı yükseklikte olmalı.
Kış (üşüyen): tüyler kabarmış, kuyruğunu üstüne sarmış, sıkıca büzülmüş, sırtında birkaç kar tanesi, hafif titreme çizgileri.
6. kedi-uyuyan.png (360×255, turuncu tekir) → kedi-uyuyan-kis.png
7. kedi-gri-uyuyan.png (360×229, gri tekir) → kedi-gri-uyuyan-kis.png
8. kedi-gerinen.png (360×255) → kedi-gerinen-kis.png: gerinmiyor; dört ayağı altında toplanmış "ekmek somunu" oturuşu, titriyor.
Yağmur (ıslak): tüyler ıslak ve yapışık, kulakları geriye yatık, huysuz; üstünde birkaç damla.
9. kedi-uyuyan-yagmur.png  10. kedi-gri-uyuyan-yagmur.png  11. kedi-gerinen-yagmur.png (gerinen yerine silkinen/ıslak oturan)

## Teslim
- Yukarıdaki 19 PNG + onizleme.png (her yeni görsel orijinalinin yanında, ızgara).
- Her karakter için kontrol: tuval boyutu aynı mı, alt kenar (pervaz/ayak) aynı pikselde mi; değilse düzelt.
- Oyun koduna dokunma; kullanıcı kabul etmeden oyuna girmez.
