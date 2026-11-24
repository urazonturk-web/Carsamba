Kıvılcım için — MEVSIM-CEPHE-2026-11-24: kar yağmayan kış ve sonbahar cepheleri (Byzantion)

Kullanıcı onayı: "Evet, başlat" (2026-11-24) — ikinci aşama, 24 görsel üretim çağrısı (12 kış + 12 sonbahar). Fazlası gerekirse önce sor.
Kullanıcının sözü: "bu mevsim değişikliklerinde mevsimine uygun olsun her taraf".

Yöntem KAR-CEPHE ve MEVSIM-MAHALLE'deki gibi (kaymasız oturdu): her hücre için atlasın x = c×350 … c×350+350 bandı; hücre 1–11'de y = 0 … 1035, hücre 0'da y = 0 … 1340. Kaynak: frontend/assets/environment/district/house/g018/facade-atlas-g018.jpg.
Mimari, pencere, panjur, kilim, cumba, lamba, duvar sıvası ve renkleri AYNI YERDE ve aynı; yalnız bitkiler (ve kışta çamaşır) değişir. Duvara ıslaklık/leke/genel renk değişimi EKLEME (yalnız bitki ve çamaşır bölgesi değişsin). Kırpma/birleştirme yapma; beyaz kenar payı bırakma; ham çıktı yeterli, hizalamayı Claude yapar.

## A) Kış, kar yok — 12 çizim: kis-hucre-00.png … kis-hucre-11.png
- Sarmaşıklar yapraksız, çıplak kahverengi dallar; saksılarda kurumuş, kahverengi saplar; açmış çiçek ve yeşil yaprak YOK.
- KAR YOK (pervaz, saksı, ip üstünde kar olmayacak); soğuk ama kuru bir kış günü.
- Çamaşırlı hücrelerde (2, 5, 8, 11) çamaşır yok, ip boş (mandal kalabilir).
- Örnek: shared/KAR-CEPHE-preview/hucre-XX-kis.png bitkileri doğru, ama karsız hâli isteniyor.

## B) Sonbahar — 12 çizim: sonbahar-hucre-00.png … sonbahar-hucre-11.png
- Sarmaşık yaprakları sarı, turuncu, kızıl; seyrelmiş, birkaç yaprak pervaza/saksıya düşmüş.
- Saksılarda solmaya yüz tutmuş çiçekler ya da krizantem (sarı/bordo), yaz sardunyaları değil.
- Çamaşırlar kalabilir (sonbaharda asılır).

## Teslim
shared/MEVSIM-CEPHE-preview/ altına 24 PNG + onizleme.png (4 örnek hücre: şimdiki / kış / sonbahar).
Bitince tek satır: hangi hücreler hazır, hangisinde sorun (yeşil yaprak, açmış yaz çiçeği, kar, duvar lekesi) kaldı.
Oyun koduna dokunma; kullanıcı kabul etmeden oyuna girmez.
