# RIG-2026-11-26 — Parçalı (iskelet) uçuş animasyonu

Kullanıcı: "Build the rig" (21:22 videosu sonrası; ayrı çizilmiş tam gövde kareleri tutarsız, "kart çevirme" etkisi).

## Fikir
Amca uçuşta tek resim değil, parçalardan kurulur: baş, gövde, ceket eteği, kol (üst kol + ön kol/el), bacak (uyluk + baldır/ayakkabı). Uzak kol/bacak aynı parçanın koyulaştırılmış kopyası. Parçalar eklem noktalarından (boyun, omuz, dirsek, kalça, diz) döner. Pozlar (duruş, itiş, fırlama, süzülme, toplanma, dalış, uzanma, çökme) yalnız açı tablosudur; aralarında her karede yumuşak geçiş (interpolasyon) yapılır → ani resim değişimi yok, baş/yüz hep aynı.

## Sınırlar
- Yalnız çizim: fizik, kamera, çarpışma, puan değişmez.
- Yerde (şarj, tepkiler) mevcut çizimler kalır. Kalkışta rig'in ilk pozu charge-000'ın birebir silüetine, inişte son pozu charge-025'e yakın kurulur; geçiş fark edilmesin.
- Kıyafet/kirli hâlde şimdilik eski pozlar (rig parçalarının kıyafet sürümü sonra).
- Mevcut 5 ara kare + fırlama/süzülme/dalış dosyaları silinmez; rig bayrakla (RIG_ON) açılır, kapatınca bugünkü hâle döner.

## Çizim (Kıvılcım, 1 çağrı) — parça sayfası
Tek tuval, şeffaf, parçalar arasında geniş boşluk, etiket yok. Parçalar düz (kollar/bacaklar dikey), eklem uçları yuvarlak ve üst üste binecek kadar taşkın.
1. Baş (nötr, sağa profil, boyun ucu dahil) 2. Baş (gözler açık, şaşkın) 3. Gövde (ceket fermuarlı, boyun dibinden kalçaya, kolsuz, omuz yuvarlak) 4. Ceket eteği parçası 5. Üst kol (kol, iki şerit) 6. Ön kol + açık el 7. Ön kol + yumruk 8. Uyluk 9. Baldır + ayakkabı (ayak sağa).

## Kod (onay sonrası, ~1–2 gün)
src/game/rig/ (parça tanımı: kaynak, eklem noktaları; poz tablosu; Reanimated iç içe dönüşüm). index.tsx: rig görünürken ChargePoses uçuş katmanlarını gizle. Simülatörde 60 kare/sn kayıtla doğrulama, sonra telefon.
