Kıvılcım için — TUTARLILIK-2026-11-24: karda/yağmurda kilim, arka plandaki kedi-kilim-çamaşır (Byzantion)

Kullanıcı onayı: "Evet, 16 çizim" (2026-11-24). Bu iş TAM 16 görsel üretim çağrısı; 17. (aşağıda C-5) kullanıcıya ayrıca sorulacak, YAPMA.
Kullanıcının sözü: "hala kar yağarken dışarıda halı asılmış bunun gibi tutarsızlıklar olmasın", "kediler ile ilgili işler yapılmamış".

Genel: önceki cephe işlerindeki yöntem (hücre bandı, kaymasız). Yalnız istenen nesneyi kaldır; geri kalan her piksel aynı kalsın; duvara leke/genel renk değişimi ekleme; beyaz kenar payı bırakma; kırpma/birleştirme yapma, ham çıktı yeter (hizalamayı Claude yapar).
Çıktı klasörü: ~/Documents/Codex/2026-09-09/referenced-chatgpt-conversation-this-is-an/shared/TUTARLILIK-preview/

## A) Arka plan — 2 çizim
1. frontend/assets/environment/bosphorus-rooftop-day-master-v1.png (941×1672): alttaki çatı manzarasında çatıya serili KİLİM ve üstünde uyuyan KEDİ ile ÇAMAŞIR İPLERİ/çamaşırlar kaldırılsın; yerlerinde kiremit, duvar, pencere tamamlansın. Gök, deniz, şehir, diğer her şey aynı. Çıktı: master-temiz.png (941×1672).
2. frontend/assets/environment/bosphorus-low-silhouette.jpg (941×748; üst yarısı aynalanmış bir kompozisyon): aynı şekilde iki kedi+kilim (sol üst ve sol alt) ve çamaşır ipleri (üst ve alt orta) kaldırılsın; geri kalan aynı. Çıktı: alt-temiz.png (941×748).

## B) Kilimsiz cepheler, kar ve yağmur — 10 çizim
Kaynak 12 hücrelik atlaslar: frontend/assets/environment/district/house/g018/facade-atlas-g018-kar.jpg ve facade-atlas-g018-yagmur.jpg. Kilimli hücreler: 0, 2, 5, 8, 11 (x = c×350 … +350; hücre 0'da y = 0 … 1340, diğerlerinde y = 0 … 1035).
- Kilim kaldırılsın; pirinç SIRIK yerinde kalsın (karda sırığın üstünde ince kar), kilimin arkasındaki duvar/pencere/pervaz tamamlansın. Başka hiçbir şey değişmesin (karlı atlasta kar, yağmurlu atlasta mevcut görünüm aynen).
- Çıktılar: kilimsiz-kar-hucre-00.png, -02, -05, -08, -11 ve kilimsiz-yagmur-hucre-00.png, -02, -05, -08, -11.

## C) Kilimsiz cepheler, kar yağmayan kış — 4 çizim
Kaynak: facade-atlas-g018-kis.jpg. Hücreler 0, 2, 5, 8 (aynı kurallar, karsız). Çıktılar: kilimsiz-kis-hucre-00.png, -02, -05, -08.
(C-5: hücre 11 — kullanıcı onayı bekleniyor, ÇİZME.)

## Teslim
16 PNG + onizleme.png. Bitince tek satır: hangi çıktı hazır, hangisinde kilim/kedi/çamaşır kaldı ya da başka bir şey değişti. Oyun koduna dokunma.
