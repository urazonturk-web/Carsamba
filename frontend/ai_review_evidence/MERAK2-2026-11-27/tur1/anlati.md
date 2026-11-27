# MERAK2 · Tur 1 · Anlatı ve Dünya editörü

## Teşhis (bir cümle)
Merakı geçmişte aramayalım. Merak iki yerden doğar: **amcanın kendisinden** (huysuz, uykulu, bordo eşofmanlı, her şeye söylenen ama yine de zıplayan adam) ve **İstanbul'un şu anki kaosundan** (martı simit kapar, gemi düdük çalar, köprüde trafik kilitlenir). Işınlanma "ekran karardı, yeni duvar kâğıdı geldi" olmasın. Şehir amcayı **kapıp bir yere atsın**, o da orada söylene söylene zıplamaya devam etsin. Oyuncunun arkadaşına söyleyeceği cümle hep aynı kalıpta olmalı: "Bak, martı amcayı kaptı!"

Ortak ilke: ışınlanmanın sebebi her zaman **İstanbul'da yaşayan bir şey** olsun (martı, olta, gemi, lodos). Büyü, portal, eski zaman yok. Amca her seferinde tek satırla tepki versin. Mizahı bu satırlar taşır.

---

## Fikir 1 · Simit Martısı → Dev Gemi (CÜRETKÂR)
**Yaşanan:** Havada, kurukafanın durduğu yükseklikte bir simit süzülüyor. Amca simidi kapıyor, o anda bir martı dalıp simidi kapmak istiyor. Amca bırakmıyor ve martı onu simitle birlikte havaya kaldırıyor (2–3 sn, bacaklar sallanıyor; "Bırak simidimi!"). Martı amcayı Boğaz'dan geçen dev bir konteyner gemisinin üstüne bırakıyor. Kuleler kırmızı, mavi, yeşil konteyner yığınlarına dönüşüyor. Gemi ilerliyor, dümen köşkünün tepesi en yüksek zıplama oluyor. Pruvaya varınca gemi düdük çalıyor ve yandan geçen şehir hattı vapurunun üst güvertesine son bir zıplama yapılıyor. Vapur iskeleye yanaşıyor, amca karaya inip kaldığı yerden devam ediyor.
**Neden farklı:** Her şey değişiyor: zemin (çatı yerine çelik kutu), ses (korna, dalga), ölçek (gemi ekrandan büyük). Oyuncu "kara oyunu"ndan "deniz oyunu"na geçiyor.
**Merak/paylaşma:** "Simidi alırsam ne olur?" sorusu bir kez yanıtlanınca bu kez "acaba hep gemi mi?" merakı başlıyor (bkz. Fikir 6: martının bıraktığı yer değişir). Ekran görüntüsü kendini anlatıyor: amca konteynerin üstünde, arkasında Boğaz.
**Kontrol:** Aynı. Basılı tut, bırak, yay, iniş. Konteynerler kule gibi dikdörtgen iniş yüzeyleri.
**Çekirdek:** İlk sürümde **hayır**: sabit dizilim, kuleler yalnız yeniden giydiriliyor, gemi hareketi arka planda paralaks. Gemi gerçekten ilerlesin, hedefler kaysın dersek **evet** (kule üretimi ve kamera). Bunu sonra ayrıca onaylatırız.
**Maliyet:** Orta. Kıvılcım ile 4 konteyner rengi, gemi gövdesi, dümen köşkü, "martı amcayı taşıyor" pozu (yaklaşık 4 çağrı). Kod: bölüm bayrağı ve yüzey kaplaması.
**Risk:** Taşınma animasyonu kontrolsüz 3 saniye; uzun gelirse sıkar. Dokunuşla geçilebilmeli.

## Fikir 2 · Martı Sürüsü Sırtında (CÜRETKÂR)
**Yaşanan:** Lodos günü bir martı sürüsü sahil boyunca alçaktan uçuyor. Bir bölüm boyunca kule yok, **martıların sırtına** iniliyor. Konduğun martı ağırlıktan biraz alçalıp "kaak" diyor. Sürü yavaş bir dalga hâlinde inip kalkıyor. Amca: "Bunlar beni simitçi sandı."
**Neden farklı:** Hedefler canlı ve hareketli. Zamanlama "ne kadar uzak?" sorusundan "ne zaman?" sorusuna dönüyor.
**Merak:** İstanbullu herkesin martıyla bir kavgası var. Martıya binmek o kavganın tatlı intikamı.
**Kontrol:** Aynı. İniş yüzeyi küçük ve hareketli.
**Çekirdek:** **Evet**: hareketli iniş yüzeyi (kule üretimi ve çarpışma). Hareket çok yavaş tutulursa küçük kalır.
**Maliyet:** Orta-yüksek: martı sırt sprite'ı, inişte çökme animasyonu.
**Risk:** Haksız düşüş hissi. Martı tam iniş anında kayarsa oyuncu kendini kandırılmış hisseder.

## Fikir 3 · Köprü Trafiği Tavanları
**Yaşanan:** Mevcut köprü bölümlerinde kuleler yerine **sıkışmış trafiğin tavanları** var: dolmuş, belediye otobüsü, kamyon kasası, bir taksi. Korna sesleri, camdan biri "Abi in aşağı!" diye bağırıyor. Trafik ara ara birkaç metre kıpırdıyor. En uzun zıplama köprü ayağının tepesinden yapılıyor.
**Neden farklı:** Köprü artık "kulenin rengi değişti" değil, gerçekten köprü üstünde olmak.
**Merak:** Herkesin yaşadığı köprü trafiğinin üstünden zıplamak, çok tanıdık bir dilek.
**Kontrol:** Aynı.
**Çekirdek:** Sabit trafikte **hayır**, yalnız yüzey kaplaması. "Kıpırdama" **evet** olur.
**Maliyet:** Düşük-orta. Köprü bölümü zaten var (`bridgeAt`), yalnız kaplama ve 4 araç sprite'ı gerekiyor.
**Risk:** Az. Çekirdeğe dokunmadan yapılabilecek en ucuz "gerçek yer değişimi" bu.

## Fikir 4 · Balıkçının Oltası: Karşı Yakaya Fırlatma (CÜRETKÂR)
**Yaşanan:** Bebek–Arnavutköy kıyısında balıkçılar sıra sıra oltalarını sallıyor. Amca bir misinaya takılıyor, balıkçı "Lüfer bu, büyük!" diye asılıyor ve amca Boğaz'ın üstünden karşı yakaya fırlıyor. Kamera dönüyor, amca birkaç kule boyunca **ters yönde** zıplayarak oltadan kurtulmaya çalışıyor. Sonra misina kopuyor ve normal yöne dönülüyor.
**Neden farklı:** Yön değişimi bütün oyunun alışkanlığını bir anda kırıyor.
**Merak:** "Balık sandılar beni!" Bu anı bir kez görmek yetiyor, anlatılıyor.
**Kontrol:** Basılı tut-bırak aynı, yalnız ekran yönü değişiyor.
**Çekirdek:** **Evet**: kamera yönü ve üretim yönü. Bu en pahalı fikir.
**Maliyet:** Yüksek.
**Risk:** Ters yön yön duygusunu bozabilir ve kafa karıştırabilir.

## Fikir 5 · Amcanın Uykusu: "Şekerleme" Bölümü
**Yaşanan:** Çay bahçesi durağında amca, oyuncunun çay ısmarladığı anda sandalyede uyuklamaya başlıyor (horlama baloncuğu). Bir sonraki zıplamada amca **rüyasında** zıplıyor: kuleler yerine dev çay bardakları, şeker küpleri, tavla pulları, simit tablası. Uyandırma çanı (çaycının kaşığı) çalınca gerçek sahile dönülüyor. Amca: "Ben uyumadım, gözümü dinlendirdim."
**Neden farklı:** Amcanın karakterini, yani uykuyu, bir mekanik kapısına çeviriyor. Ölçek oyunu yapıyor: dev bardak, küçük amca.
**Merak:** "Amca uyuyunca nereye gidiyor?" sorusu tekrar tekrar sorulur, her rüya başka nesnelerden kurulabilir.
**Kontrol:** Aynı.
**Çekirdek:** Hayır (yüzey kaplaması).
**Maliyet:** Orta: 4–5 nesne sprite'ı.
**Risk:** Yasaklı "yalnız görünüm değişimi"ne en yakın fikir bu. Bunu kurtaran şey, nesnelerin farklı biçimli iniş yüzeyleri olması: yuvarlak bardak ağzı, ince tavla pulu.

## Fikir 6 · "Martı Nereye Bırakacak?" Rulet Katmanı
Fikir 1'in tekrar oynanabilirliği için gerekli. Martının bıraktığı yer her seferinde değişsin: konteyner gemisi, Adalar vapurunun güvertesi, Kız Kulesi'nin çatısı, köprü kulesinin tepesi, balıkçı teknelerinin üstü. Günün haritası günün bırakma noktasını göstersin: "Bugün martı Adalar'a bırakıyor." Sosyal tarafı burada: "Senin martın seni nereye bıraktı?"
**Çekirdek:** Hayır (Fikir 1'in altyapısını kullanıyor). **Maliyet:** Yer başına 2–3 Kıvılcım çağrısı.

## Fikir 7 · Huysuz Amca Ses Katmanı (her fikre destek)
Amca her ışınlanmada ve her tuhaf yüzeyde tek satır söylensin (balon, sesli değil):
- Gemide: "Ben bu yaşta konteynere mi binecektim?"
- Martıdan inince: "Simidimi de götürdü, bari bilet kessin."
- Trafikte: "Yürüyerek daha hızlı giderdim, zıplayarak hiç değilse."
- Rüyadan uyanınca: "Ben uyumadım, gözümü dinlendirdim."
Kurallar: Arapça ünlem yok, dini motif yok. Huysuzluk sevimli kalsın, kimseye hakaret etmesin. Yeni satırlar `copy.ts` içinde TASLAK havuzunda, kullanıcı onayıyla açılsın (`QUIP_ON` gibi bir bayrakla).

---

## 1 numaram: Fikir 1 (Simit Martısı → Dev Gemi) ve Fikir 6'nın değişen bırakma noktası, sonra
**Neden:** "Şuna bak" testini ilk saniyede geçiyor (martı amcayı kaldırıyor). Işınlanmanın sebebi gerçek İstanbul (martı simit kapar, herkes bilir). Varılan yer de gerçekten başka bir parkur: çelik kutular ve vapura son zıplama. Ayrıca sonradan bir "bırakma yeri koleksiyonu"na açılıyor. Fikir 3 (trafik tavanları) en ucuz yan ürün olarak hemen arkasından gelebilir.

**En küçük deneme (çekirdeğe dokunmadan):**
1. Tek simit, tek yer: örneğin 2. duraktan sonra havada sabit bir simit (kurukafa konumlandırmasını kullanarak).
2. Simit alınınca 1,5 sn'lik basit bir tween: amca ile martı sprite'ı yukarı ve sağa uçuyor, ekran kayıyor. Dokunuşla atlanabiliyor.
3. Sonraki 8 kule yalnız **kaplama** değiştiriyor: konteyner rengi, arka planda gemi gövdesi paralaksı ve dalga. 8. kule "vapur üst güvertesi". Ardından normal kulelere dönülüyor.
4. Amcanın tek satırı: "Ben bu yaşta konteynere mi binecektim?"
5. Kıvılcım: 4 çağrı (konteyner seti, gemi gövdesi, vapur güvertesi, martı taşıma pozu), her biri onaylı.
6. Ölçüm: TestFlight'taki 3–4 arkadaşa yalnız şunu soracağız: "Simidi aldıktan sonra ne oldu, birine anlattın mı?" Anlatan çıkarsa Fikir 6'ya geçeriz (yeni bırakma yerleri, gemi hareketi için çekirdek onayı).
