# MERAK-2026-11-27 — Anlatı ve Dünya editörü

Okuduklarım: brief.md, HIKAYE4 editör görüşleri, src/game/stops.ts, src/game/copy.ts, YARATICI-FIKIR ve FIKIR-PUAN raporları.
Ton olarak amcanın sesini korudum: kuru, kendinden emin, biraz mahcup ("Havada emindin, yerde şaşkındın."). Vaaz yok, ünlem yok.

## Ortak kural: "parantez sahne"
Işınlanma oyunun fiziğine dokunmaz, yalnızca bir **parantez** açar. Oyuncu nesneye havada değer. Bir sonraki inişte sis ya da ışık geçişi olur, bu sırada şarj girişi açık kalır. N kule boyunca (6 ile 10 arası) yalnız şunlar değişir: kule kaplaması, arka plan, renk ve ses. Kule dizisi, kule kimliği, puan ve durak sayımı aynen sürer. Parantez kapanınca amca bıraktığı yerden devam eder. Kurukafada olduğu gibi ayrı bir karma kullanılır. Hiçbir sahne kamerayı ters çevirmez, yerçekimi yönünü değiştirmez, kule boyunu değiştirmez.

---

## 1. Kayıp Sefer jetonu (kılıf: eski vapur bileti) ★ çerçeve fikir
- **Oyuncu gözünden:** Havada, yayın tepesinde pirinç bir vapur jetonu döner. Değince düdük sesi gelir, sis çöker ve tabelada "KAYIP SEFER · Hareket: bilinmiyor" yazar. Amca başka bir Boğaz'da zıplamaya devam eder. Jetonun arkasındaki damga gidilen yeri söyler.
- **Neden merak:** Jeton bir "bilet". Oyuncu "başka nerelere bilet var?" diye sorar. Her damga yeni bir yer, toplanmamış damga da bir soru işareti.
- **Zıplamayı bozmaz:** Kurukafa ile aynı yer ve aynı kurala oturur (yay tepesi, ayrı karma). Etkisi yalnız görsel parantezdir.
- **Maliyet:** Metin S (tabela + 6-8 damga adı) · Görsel S (1 jeton) · Kod M (parantez altyapısı bir kez yazılır, sonra bütün sahneler bunu kullanır).
- **Risk:** Jeton kurukafayla karışabilir. İkisi aynı koşuda çıkmamalı. Gerçek İDO/Şehir Hatları logosu ve bilet tasarımı kopyalanmamalı.

## 2. Sarnıçta sütun sütun (cüretkâr)
- **Ne olur:** Sis dağıldığında amca yer altındadır. Kuleler artık loş, sudan yükselen mermer sütunlardır. Damlalar düşer, ayak sesi yankılanır. Bir sütunun dibinde ters duran taş bir baş görünür. Amca kaşını kaldırır, oyuncu ekran görüntüsü alır.
- **Neden merak:** "Orası neresi?" sorusunun en güçlü cevabı. İstanbullu orayı tanır, yabancı oyuncu ise "bu gerçek mi?" diye arar. Sütun ile kule birebir örtüştüğü için fikir kendini anlatır.
- **Zıplamayı bozmaz:** Sütun yalnızca kule kaplaması, iniş yüzeyi aynı genişlikte. Su kulelerin arasındaki boşluktur, düşüş yine düşüştür.
- **Maliyet:** Metin S · Görsel M (sütun kaplaması, karanlık arka plan, ters baş: 3 Kıvılcım çağrısı) · Kod S (parantez hazırsa).
- **Risk:** Ters baş mitolojiden gelir, dini değildir. Yine de korku tonuna kaymamalı, sevimli kalmalı. Bazilika/kilise kelimesi ve hiçbir kubbe kullanılmamalı.

## 3. Alt Akıntı: Boğaz ters akıyor (cüretkâr)
- **Ne olur:** Gerçek bilgi: Boğaz'da üstteki su güneye, alttaki su kuzeye akar. "Alt akıntı" damgalı jeton amcayı bu akıntıya bırakır. Güzergâh 8 kule boyunca tersine sayar ("Bebek'e 3 kule… Arnavutköy'e…"), vapurlar ters yönde süzülür, martılar geri geri uçar. Parantez bitince rozet çıkar: "Akıntıya karşı 8 kule".
- **Neden merak:** Gerçek bir doğa olayı, büyülü gibi duruyor. Oyuncu "doğru mu bu?" diye arar ve öğrenip paylaşır.
- **Zıplamayı bozmaz:** Yalnız arka planın kayma yönü, durak tabelası ve vapur yönü değişir. Amca yine sağa zıplar, kamera aynı kalır.
- **Maliyet:** Metin S · Görsel yok (mevcut katmanlar ters akar) · Kod S-M (stops.ts'e ters sayım metni, paralaks yönü).
- **Risk:** Arka plan ters akarken amca ileri gidince bazı oyuncuların başı dönebilir. Telefonda denenmeli, gerekirse yalnız vapur ve martılar ters gitmeli.

## 4. Eski Boğaz: sepya sefer (zamanda kayma)
- **Ne olur:** Sis dağılınca renkler sepyaya döner. Arka planda bacalı eski bir vapur, yalı iskelesinde şapkalı bir adam, kayıklar görünür. Ses kısılır, uzaktan gramofon cızırtısı gelir. Kartpostal o anın karesiyle "Eski sefer" damgası taşır.
- **Neden merak:** Aynı yerin başka bir zamanı. Oyuncu "bu sahneyi ben mi buldum?" duygusunu yaşar ve dedesine gösterir.
- **Zıplamayı bozmaz:** Renk filtresi ve 1-2 arka plan nesnesi, kuleler aynı.
- **Maliyet:** Metin S · Görsel S (yalnız filtreyle bile olur, eski vapur silueti 1 çağrı) · Kod S. En ucuz parantez bu.
- **Risk:** Yıl yazılırsa 6-7 Eylül 1955 ya da 1980 çağrışımı doğabilir. Yıl yazılmamalı, "eski sefer" yeter. Gerçek vapur adı da konmamalı (bazı adlar futbol kulübü adıyla aynı).

## 5. Kız Kulesi'nin feneri
- **Ne olur:** Üsküdar · Kız Kulesi durağında, gün batımından sonra kuleden bir ışık huzmesi döner. Huzme amcanın üstünden geçerken amca iniş yaparsa ışık onu "taşır": tek bir zıplamalık ışık köprüsünden sonra karşı yakada iner (köprüden önce yaka değiştirmiş olur).
- **Neden merak:** Gerçek bir yerde, gerçek bir ışık, zamanlama sırrı. Oyuncular birbirine "Kız Kulesi'nde ışığa yakalan" diye ipucu verir.
- **Zıplamayı bozmaz:** Fizik aynı kalır. Işık köprüsü sadece görüntüdür, bir sonraki kule normal kuledir. Durak ve yaka metni değişir.
- **Maliyet:** Metin S · Görsel S (huzme kodla çizilebilir) · Kod M (yaka metni stops.ts köprü mantığıyla çakışmamalı).
- **Risk:** Kız Kulesi efsanesindeki "sepetteki yılan ve ölen prenses" anlatılmamalı. Hikâye fenerci ve ışık üzerinden kurulmalı. Köprü/yaka anlatısının tutarlılığı bozulabilir.

## 6. Batık gemi direkleri (cüretkâr, gerçek kazıdan)
- **Ne olur:** Yenikapı kazısında bulunan eski liman ve batık gemiler gerçektir. Jeton amcayı yeşil, sessiz bir deniz dibine indirir. Kuleler yosunlu gemi direkleri ve amforadır. Amcanın bıyığından baloncuklar çıkar, kafasına bir balık takılır.
- **Neden merak:** Çok az kişinin bildiği gerçek bir hikâye: metro kazarken bin yıllık bir liman çıktı. "Bunu bir oyunda öğrendim" etkisi yapar.
- **Zıplamayı bozmaz:** Yerçekimi ve hız aynı kalır, "su altı" yalnızca renk ve baloncuktan ibarettir. Yavaşlatma kesinlikle yapılmamalı.
- **Maliyet:** Metin S · Görsel M-L (direk kaplaması, deniz dibi, balık) · Kod S.
- **Risk:** Su altında zıplamak mantık dışı bulunabilir. Çerçeve "rüya" olarak kurulursa sorun olmaz. Gerçek bilgiye tek satırla değinilmeli, ders tonuna girilmemeli.

## 7. Adalar sabahı
- **Ne olur:** Sis dağılınca martılar, köşk çatıları ve bisikletler görünür. Uzaktan çan değil vapur düdüğü gelir. Kuleler ahşap köşk kuleleridir. Teyze balonu: "Son vapuru kaçırma, sonra burada kalırsın."
- **Neden merak:** Güzergâhın dışında bir yer, "oraya nasıl gittim?" sorusu. Gece seferinde adaya düşmek ayrıca romantik bir an.
- **Zıplamayı bozmaz:** Yalnız kaplama ve arka plan değişir.
- **Maliyet:** Metin S · Görsel M (köşk kaplaması, ada arka planı) · Kod S.
- **Risk:** Rum ve Ermeni mirası klişeyle ya da karikatürle anlatılmamalı. Fayton ve at tartışması (yasak) hiç açılmamalı. Kilise silueti kullanılmamalı.

## 8. Haydarpaşa'da durmuş saat
- **Ne olur:** Kadıköy'ün hemen ardında gar kuleleri kule olur. Saat hep aynı dakikayı gösterir. Her parantezde akrep bir dakika ilerler. Saat tam olduğunda (oturumlar arasında ilerler) bir "son tren" düdüğü duyulur ve oyuncuya özel bir jeton verilir.
- **Neden merak:** Saat oturumlar arasında ilerleyen bir sayaçtır. Oyuncu "saat dolunca ne olacak?" diye geri döner.
- **Zıplamayı bozmaz:** Yalnızca kaplama ve kalıcı bir sayaç ekler.
- **Maliyet:** Metin S · Görsel M (gar kuleleri) · Kod S (AsyncStorage sayacı).
- **Risk:** Haydarpaşa'nın kapanması, yangın ve kentsel dönüşüm tartışmaları siyasidir. Gar yalnızca güzel bir bina olarak gösterilmeli, "kapandı/açılacak" gibi bir yorum yapılmamalı.

## 9. Kayıp Eşya Bürosu (oturumlar arası taşıyıcı)
- **Ne olur:** Her parantezde amcanın cebinden bir şey düşer: terlik, gözlük, anahtarlık, gazete. Sonraki oturumlarda o eşya normal dünyada başka birinde görünür: terliği balkondaki çocuk giymiştir, gözlük bir kedinin burnundadır. Menüdeki Büro sekmesinde eşyalar ve "nerede görüldü" notu birikir.
- **Neden merak:** Dünyalar arasında iz kalır. "Sarnıçta düşürdüğüm gözlük nasıl Bebek'e geldi?" sorusu doğar.
- **Maliyet:** Metin M (eşya başına 2 satır) · Görsel M (eşya başına 1 küçük ikon, mevcut balkon/kedi görsellerine yerleştirme) · Kod M.
- **Risk:** Tespih ve benzeri dini çağrışımlı eşyalar listeye alınmamalı. Koleksiyon yükü çok fazla gelirse önce 4 eşya ile denenmeli.

---

## Sır yapısı: "R.'nin kartpostalları"
Her yeni parantez sonunda amcanın cebinde bir kartpostal belirir. Ön yüzde o sahnenin karesi var, arka yüzde el yazısıyla tek satır ve imza: **"R."**
- 1. kart (Eski Boğaz): "Bordo yakışmış. Bende de vardı bir tane." — R.
- 2. kart (Sarnıç): "Burada da düştüm ben. Sütunları sayma, şaşırırsın." — R.
- 3. kart (Alt Akıntı): "Akıntıya karşı gitmeyi kimden öğrendin acaba?" — R.
- 4. kart (Fener): "Feneri gören bir daha kaybolmaz derlerdi. Yalanmış, ben kayboldum." — R.
- Ara ipuçları: eski sahnede şapkalı adamın bıyığı amcanınkiyle aynı; Kayıp Eşya Bürosu'nda bir eşyanın sahibi "R." olarak görünüyor; kartpostallardaki el yazısı amcanın oyun sonu tabelasındaki el yazısıyla aynı.
- **Açılım (8 kart ya da Karadeniz'e varış):** R. amcanın kendisidir: gençliğinde "Rıza" diye çağrılan, aynı bordo eşofmanla Boğaz'ı zıplayarak geçmeye çalışmış hâli. Kayıp seferler, geçmişteki kendisinin bıraktığı izler. Son kart amcanın elinden çıkar ve bir sonraki oyuncuya gider: "Ben buraya kadar geldim. Gerisi senin." Bu kartın paylaşılabilen bir karesi de olur.
- Neden bu yapı: duygusal ama hüzne boğmayan bir final, mevcut kartpostal paylaşımına doğrudan bağlanıyor ve metin bütçesi ~12 satır. Amcanın adı şimdiye kadar konmadı. "Rıza" önerisi kullanıcının onayına bağlıdır, gerekirse yalnızca "R." kalır.

## Bilerek dışarıda bırakılanlar
Ayasofya ve bütün kubbe/minare siluetleri (dini motif). Fetih anlatısı, Rumeli Hisarı'nda kuşatma (siyasi ve tarihsel taraf tutma). Kız Kulesi'nin yılan efsanesi (ölüm). 1955 ve 1980 gibi yıllar. Vapur adları (kulüp çağrışımı). Kurgusal "kayıp şehir" yerine Yenikapı gibi gerçek bir kazı (uydurma tarih iddiası olmasın diye).

---

## Benim 1 numaram
**Kayıp Sefer jetonu + Eski Boğaz parantezi + R.'nin ilk kartpostalı.** Jeton bütün diğer fikirlerin kapısı. Altyapı bir kez yazılır, sonra Sarnıç, Alt Akıntı ve Batık Direkler birer kaplama ve damga olarak eklenir. Sepya sahne neredeyse görselsiz yapılabildiği için ilk deneme ucuz. R. kartı da gizemi bir sonraki oturuma taşır. Fizik, kule dizisi ve puan kuralı hiç değişmez.

## İlk sürüm için en küçük deneme
1. Kurukafanın yerleşim kodunu yeniden kullanan tek bir jeton. Aynı koşuda kurukafa çıkmaz, koşu başına en fazla 1 jeton, ilk kez 6. kuleden sonra.
2. Değince: mevcut sis katmanı 0,4 sn yoğunlaşır, "KAYIP SEFER" tabelası çıkar, 8 kule boyunca sepya renk filtresi uygulanır, ses kısılır. Yeni görsel yok, ya da en fazla jeton ikonu için 1 Kıvılcım çağrısı.
3. Parantez kapanınca sis geri gelir ve renkler normale döner. Sonuç kartında tek bir arka yüz satırı ve "R." imzası çıkar (yalnızca 1. kart).
4. Ölçüm: TestFlight'ta "jetonu gördün mü, ne sandın, tekrar aradın mı?" sorusu sorulur ve jeton yakalama sayısı kaydedilir. Merak tutarsa ikinci adım Sarnıç kaplamasıdır.
