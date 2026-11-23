# Video 2026-11-21 23:02 — "oyun videonun sonunda kitlendi"

## Gözlem (video, 88 sn)
- 0–64 sn: üç koşu, oyun normal. Teyze cumbada amca ölçeğinde; kedi oluk üstünde okunaklı boyda, iniş yüzeyine girmiyor (kedi-yakin.jpg).
- ~65 sn: 12 puanla oyun sonu kartı.
- ~68–72 sn: Game Center bildirimleri "Şu adla giriş yapıldı" ve "Liderlik Tabloları · Başla: Rekor" → Sıralama açılmış.
- 72–88 sn: kart ekranda, tepkisiz; ana ekrana çıkıp dönmek de çözmüyor.
- Telefondan alınan çökme kayıtlarında uygulamaya ait çökme/takılma raporu yok → çökme değil, dokunuşlar engelleniyor.

## Teşhis (kanıta dayalı çıkarım, cihazda yeniden üretilmedi)
`showLeaderboard` iOS SDK 26'da kullanımdan kaldırılmış `GKGameCenterViewController`'ı sunuyordu (başlık dosyası: API_DEPRECATED "Replaced by GKAccessPoint", ios 26.0). Yeni iOS'ta bu pencere Apple'ın katmanını açıyor; sunulan boş pencere kapanmadan üstte kalıp dokunuşları yutuyor.

## Düzeltme
`modules/byzantion-gamecenter/ios/ByzantionGameCenterModule.swift`: iOS 18+ için `GKAccessPoint.shared.trigger(leaderboardID:playerScope:timeScope:)`; pencere sunulmaz. Eski iOS için eski yol duruyor.
BUILD_TAG: "SIRALAMA KILIT DUZELTME". tsc temiz, worklet sıra testi PASS.

## Doğrulanmadı
- Sıralama açılıp kapandıktan sonra "Bir daha"nın çalıştığı telefonda denenmedi (simülatörde Game Center hesabı yok).
