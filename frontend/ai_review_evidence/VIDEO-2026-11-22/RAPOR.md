# Video 2026-11-22 15:54 — kedi yeri + pencere boyu

## Önceki isteklerin denetimi (video)
- Sıralama kitlenmesi: Sıralama Apple Games katmanında açıldı, oyuna dönüldü; "Bir daha" çalıştı → düzeldi (gözlem, 0:06–0:09 ve oyun sonu kartı).
- Teyze cumbada amca ölçeğinde: tutarlı.
- Yazılı balon yok: doğru.

## Kullanıcı: "kedinin çatıdaki yeri bir tuhaf"
Gözlem: kedi oluğun üstünde ama gövdesi çatı kiremitlerinin önünde, eğimde yatıyor gibi (c16.jpg / kedi4.jpg).
Düzeltme: kedili kulede de teyzeninkiyle aynı cumba; kedi cumbanın pervazında (cumba-bos.png pervaz çizgisi y≈418/660) uyuyor.
- Yeni dosya `assets/environment/mahalle/cumba-kedi.png`: cumba-bos.png ile birebir, yalnız penceredeki saydam boşluk koyu iç renkle doldurulmuş (arkadaki cephe görünmesin). Yeni çizim değil.
- `kediBox` artık `cumbaBox`'a bağlı: kedi genişliği = cumba × 0,5; cumba kuleye sığmazsa kedi de yok.
- Kedi uyanma/defter mantığı aynı.

## Kullanıcı: "diğer pencereler teyzenin cumbasıyla aynı ya da biraz küçük"
`PENCERE_BUYUK = 1.4`: cephe atlası 1,4 kat büyütülerek çiziliyor (yalnız görsel; kule, çatı, iniş çizgisi, çarpışma değişmez). Normal pencere artık cumbadan biraz küçük. Kaynak 350 px hücre ≈ 1,5 kat büyütülüyor; simülatörde netlik kabul edilebilir.
Kanıt: sim-pencere14.png, sim-pencere14-kedi-cumba.png (MAHALLE_TEST açıkken; teslimde kapalı).

## Doğrulanmadı
- Telefonda görünüm (kurulum yapıldı, video bekleniyor).
- Dar kulelerde kenardaki panjur/balkon kırpılması.
