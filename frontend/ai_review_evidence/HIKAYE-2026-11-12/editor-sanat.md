# Sanat yönetmeni + mizah/ton editörü — HIKAYE-2026-11-12

Bakılanlar: brief, `assets/postcards/*.jpg` (5 kart), `DURAK-2026-11-12` kareleri. Yaklaşımım: hikâyeyi **kelimeyle değil, aynı görsel şeklin farklı yerlerde tekrar etmesiyle** anlatmak.

## 1. Hikâye özü (gizli gerçek)

**Ana öneri — "Amca vapurun kayıp düdüğü."** Amca, İstanbul'un son buharlı vapurunun eski kazancısı (ateşçisi). Buharlı vapur emekliye ayrıldığında içindeki buhar amcada kaldı. Bu yüzden ikisi aslında aynı ses ve aynı duman. Her gece son sefer, düdük çalmadan iskeleden kalkamıyor. Amca da bu yüzden çatılardan iskeleye yetişmeye çalışıyor.
**"Aaa!" anı:** Oyuncu bunca zamandır "osuruk" diye güldüğü sesin, vapurun düdüğüyle **aynı ses** olduğunu duyar. Uçak izi gibi gördüğü bulutun da vapur bacasının dumanıyla **aynı şekil** olduğunu görür. Şaka böylece silinmez, hikâyenin anahtarı olur. Gaz bir kusur değil, bir görev.

**Alternatif — "Bilet martıda."** Bir martı amcanın son kalan vapur jetonunu kapmış. Amca martı sürüsünün peşinde çatıdan çatıya atlıyor. Jeton iskelede gagadan düşer. Bu daha hafif bir alternatif ama gaza anlam katmıyor, o yüzden ikinci sırada.

## 2. Açılma planı (ilk turda neredeyse hiçbir şey anlaşılmaz)
| An | Oyuncu ne görür | Ne anlar |
|---|---|---|
| İlk tur (0–15) | Sadece komedi: yüz, ıkınma, ses, bulut. Ufukta küçük bir vapur, bacası **dumansız**. | Hiçbir şey. Bu kasıtlı. |
| Karaköy kartı | Kartpostalın arkasında pul ve damga var: bir **baca + üç halka buhar** amblemi. Damgada aynı gün yazıyor, yıllar farklı. | "Bu damga neyin?" |
| Galata / Sirkeci | Kartların köşesinde vapur her seferinde biraz daha yakın görünüyor. Sirkeci kartının arkasında silik bir mürettebat fotoğrafı köşesi, bir bıyık seçiliyor. | "Amca bu vapurla ilgili." |
| Patlama eşiği | "Tam kıvam"da gaz bulutu bir anlığına **vapur dumanı rengine** (sıcak gri-beyaz) döner ve uzaktaki vapur kısa bir "tıs" ile cevap verir. | Ses eşleşmesini ilk kez hisseder. |
| Eminönü (60) | Mevcut çift düdük, amcanın son zıplama sesiyle **aynı perdede** çalar. | Şüphe kesinleşmeye başlar. |
| Gece seferi | Gece kartpostalındaki vapurun (bkz. `kartpostal-gece.jpg`) bacası boş. Amca 75'e ulaşırsa 6. kart açılır: genç amca, bordo kazancı tulumuyla baca dibinde. | **"Aaa!"** |
| Tekrar oynadıkça | Rekor bayrağı vapur flamasına (bordo şerit) dönüşür. Her yeni rekor albüme bir damga yılı ekler. | Hikâye toplanan bir arşive dönüşür. |

**Merakı canlı tutan şey:** Oyunda hep görünen ama hiç açıklanmayan bir nesne var, o da dumansız baca. Oyuncu onu her turda ufukta görür. Soru sormadan soru sorduran tek görsel bu.

## 3. Oyunda nasıl anlatılır (mevcut parçalar ağır işi yapar)
- **Görsel kafiye (en önemli karar):** Gaz bulutu ile vapur dumanı **tek sprite** olacak; yalnızca renk tonu ve boyutu değişir. Bordo eşofman, vapurun baca şeridiyle aynı renk olacak. Bunlar kod ve renk işi, yeni üretim gerektirmez.
- **Ses kafiyesi:** Zıplama sesinin son notası ile düdük aynı perdeye getirilir. Bu, mevcut seslerin perdesini kaydırmakla yapılır (pitch-shift), yeni ses üretilmez.
- **Kartpostalın arkası:** Asıl hikâye taşıyıcı burası. Yazı yok, yalnızca pul, damga, yıl ve tek kelime. Arkaların tamamında toplam ≤ 12 kelime (ör. sadece "Bekliyoruz." ve "Geldin."). Esprili satır yok.
- **Martı:** Ritim ve "ipucu taşıyıcı" görevi görür. Albüm doluyken bir martı ağzında bilet taşıyabilir. Bu mevcut sprite'ın üstüne küçük bir ek.
- **Yeni görsel ihtiyacı (kredi onayına):** toplam **4 görsel**
  1. Kartpostal arka yüzü şablonu (kâğıt dokusu, pul çerçevesi, baca amblemli damga). Tek görsel, yıllar kodla basılır.
  2. 6. kart, "Kazancı" kartı: genç amca baca dibinde, sepya ton, mevcut kart üslubunda.
  3. Vapur bacası yakın plan katmanı (gece finalinde 1,5 sn'lik kısa an; amcanın dumanı bacadan çıkar).
  4. Damga/amblem ikonu (baca + 3 buhar halkası). Uygulama simgesine ve isim logosuna da temel olur.
- **Ses:** 0 yeni üretim, yalnızca perde ayarı.
- **iOS performansı:** Sinematik ya da video yok. Final; statik katman, 300 ms crossfade ve 1 parçacık patlamasıyla yapılır. Kartlar ≤ 250 KB JPG, durak öncesinde ön yüklenir. Kart arka yüzü tek şablon + `Text` katmanı ile çizilir; her kart için ayrı görsel gerekmez.

## 4. İsim önerileri
1. **Son Vapur / Last Ferry**: Hedefi ve gece seferini tek kelimede verir, gizemi bozmaz. İki dilde de çalışır.
2. **Düdük**: Hem şakayı hem sırrı taşır, kısa ve ikon dostu. *Favorim.*
3. **Kazancı**: Hikâyenin gizli unvanı. İlk başta anlamsız gelir, sonunda "aaa" dedirtir.
4. **Pufpuf**: Buhar ve gaz için tek ses. Çocuk dostu, App Store'da akılda kalır.
5. **Buhar Amca / Steam Uncle**: Karakter odaklıdır, mizahı kaba olmadan söyler.
6. **İskele**: Sakin ve şiirseldir. Gece/kartpostal estetiğine uyar ama komediyi saklar.
7. **Toot!**: Uluslararası sürüm için. Hem korna hem gaz anlamında oynak bir kelime.

## 5. Yapılmaması gerekenler
- **Gazı açıklayan ya da gaz üzerine kelime oyunu yapan metin yazmayın.** Bağlantıyı oyuncu sesin ve şeklin eşleşmesinden kendisi kurmalı. Gaz bulutunu da yeşil/kahverengi yapıp "iğrenç" tarafa çekmeyin; bulut buhar beyazında kalsın.
- **İlk turda hikâyeyi anlatan bir giriş sahnesi ya da metin ekranı koymayın.** Oyuncuların çoğu 15. kuleyi göremiyor. Sır ilk 15 kuleye sığdırılırsa merak ölür, sonraya bırakılırsa ödül olur.
