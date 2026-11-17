Sen Byzantion oyun projesinde (frontend/) ikinci görüş veren editörsün. KOD DEĞİŞTİRME. Türkçe, en fazla ~550 kelime.

Bağlam: src/game/postcards.ts — 12 durak (Harem, Üsküdar·Kız Kulesi, Kuzguncuk, Beylerbeyi, Ortaköy, Arnavutköy, Bebek, Rumeli Hisarı, Kanlıca, Beykoz, Anadolu Kavağı, Rumeli Feneri; Boğaziçi, FSM, Yavuz Sultan Selim köprüleriyle). Bir durağa ilk kez varınca kartpostal açılıyor (albüm, cihazda kayıt). Şu an görseller semte özel değil: eski arka plandan kırpılmış 5 çatı resmi döngüyle kullanılıyor. Karakter: bordo eşofmanlı bıyıklı amca, 9 şarj pozu (assets/characters/charge-*-r12.png, alfa PNG); gece pijama katmanı (gece külahı + terlik). Görsel üretimi Kıvılcım atölyesinde (ücretli görüntü üretimi, her çağrı kullanıcı onaylı; daha önce kahraman tutarlılığı için mevcut pozu referans verip "yalnız şu değişsin" yöntemi kullanıldı, FAZ2-İFADE'de siluet IoU 0,94-0,97 tuttu). Kurallar: yeni görsel kullanıcı kabulü olmadan oyuna girmez; gerçek kişi/marka taklidi yok.

Kullanıcı isteği: "Kartpostallar vardığımız durakta, mesela Galata'ya vardıysak bizim karakterimizin oradaki bir fotoğrafı gibi bir şey olsun."

Claude'un seçenek taslağı:
A) Tam çizim: her durak için Kıvılcım'dan amcalı kartpostal illüstrasyonu (12 çağrı + düzeltmeler). Risk: 12 resimde amcanın yüz/kıyafet tutarlılığı, maliyet.
B) Birleşik: Kıvılcım yalnız 12 semt manzarasını (amcasız, kartpostal çerçeveli, ön planda boş yer) üretir; amca mevcut pozlardan biri (ya da "selfie/poz veren" tek yeni poz) kodla ön plana yerleştirilir, gece duraklarında pijamalı. Karakter %100 tutarlı; manzara + karakter ışık/üslup uyumu riski.
C) Oyun içi anlık fotoğraf: durağa varınca o anki oyun ekranından (react-native-view-shot vb.) kare alınır, kartpostal çerçevesi + semt adı + tarih damgası eklenir. Ücretsiz, her koşuda farklı, ama arka plan semte özel değil (genel çatılar).
D) B + C karışımı: albümde B'nin kalıcı semt kartpostalı, üstüne o koşudan küçük bir "polaroid" anı.

Sorular: Hangi seçenek? Kahraman tutarlılığı için en güvenli üretim yolu? Maliyet/çağrı tahmini (sayıyla). Telif/landmark sorunu (Kız Kulesi, Ortaköy Camii gibi yapıları çizmek). Teknik: kodda nereye dokunulur (dosya:satır), view-shot gibi yeni native modül gerekir mi (Expo prebuild/EAS)? Sonunda tek paragraf öneri ve sıra.
