# MERAK-2026-11-27 — Oyuncu deneyimi ve paylaşım editörünün görüşü

Bakış: oyuncunun "bunu arkadaşıma göstermeliyim" ya da "ben de gördüm mü acaba" dediği an. Kod değişmedi.
Okunanlar: `brief.md`, `FIKIR-PUAN-2026-11-20/RAPOR.md`, `FIKIR-GELIR-2026-11-18/RAPOR.md`, `YARATICI-FIKIR-2026-11-17/RAPOR.md`, `src/game/kurukafa.ts`.

## 0. Önce veriden çıkan tek gerçek
TestFlight'ta oturum sayısı 1 ile 122 arasında. Biri oyunu **bir kez** açıp bırakmış. Yani:
- Merak kancası **ilk koşuda** atılmalı. 2. oturumda gelen bir sürpriz, bırakan kişiye hiç ulaşmaz.
- Ama sırrın kendisi ilk koşuda **verilmemeli**. Önce "o neydi?" dedirt, cevabı sonra ver. Türün iyi örneklerindeki ortak hile bu: ilk dakikada ulaşılamayan bir şeyi göstermek.
- 122 oturumluk oyuncu için asıl soru: "Daha görmediğim ne kaldı?" Ona görünür bir **boş yer** lazım (soru işaretli damga, boş kartpostal yuvası).

## 1. Işınlanma fikri — oyuncu gözüyle

**Ne olur:** Amca havadayken parlayan bir **eski vapur jetonu** yakalar. Ekran bir göz kırpımında beyazlar, vapur düdüğü çalar, amca **ayakta, bir çatının ortasında** belirir. Bambaşka bir yerdedir. Ekranın üstünde bir an "Burası neresi?" yazar, sonra yerin adı gelir.

**Benim kurallarım:**
1. **Işınlanma asla düşüşle bitmez.** Amca havada değil, bir kulenin ortasında, durur hâlde belirir. İlk zıplaması o koşunun en kolay aralığı olur. "Işınlandım, düştüm" yaşanırsa oyuncu jetonu bir daha bilerek kaçırır; fikir ölür.
2. **Ödüldür, ceza değil.** Kurukafa 50/50 iyi-kötü; jeton öyle olmamalı. Kurukafa "kumar", jeton "kapı". İkisi karışırsa oyuncu ikisini de sevmez.
3. **Puanı atlatmaz.** Kule sayısı aynen sürer (puan kuralı değişmez). Ödül yer, manzara ve damgadır, puan değil. Böylece rekor tablosu bozulmaz, "jetonla hile yaptı" denmez.
4. **Kısa sürer.** 8–12 kule sonra amca bir vapur düdüğüyle "geri döner" ve kaldığı Boğaz durağından devam eder. Uzun kalırsa yeni yer sıradanlaşır.

**Ne sıklıkta, ilk kez ne zaman:**
- **1. koşu, ~5. kule:** jeton gökyüzünde, ulaşılamayacak kadar yüksekte bir an parlar ve kaybolur. Amca başını kaldırır: "Bu da ne?" Yakalanamaz. Bu, tek oturumluk oyuncuya bile atılan kancadır.
- **İlk yakalanabilir jeton:** 2. ya da 3. koşuda, 8. kuleden sonra, alçak yayda (kolay). İlk ışınlanma "neredeyse garanti" olmalı; ilk deneyim başarı olsun.
- **Sonrası:** koşuların ~%20–25'inde bir jeton, koşu başına en fazla 1. Kurukafa etkisi sürerken çıkmaz (aynı kapı mantığı).
- **Nasıl anlatılır:** hiç anlatılmaz. Öğretici yok. Sadece bir yer adı, bir damga ve kartpostalda yeni bir yuva. Öğretmek merakı öldürür.

**Hayal kırıklığı riskleri:** (a) ışınlanınca düşmek — kural 1 ile kapanır; (b) "gittiğim yer bizim oyunun aynısı" — yeni yer gerçekten **farklı görünmeli** (aşağıda en ucuz yolu var); (c) jetonu yakalamaya çalışırken düşmek — jeton normal yayın tepesinde durmalı, kurukafadaki gibi; yüksekse uzun basış ister ama hiçbir zaman imkânsız olmamalı.

## 2. Fikirler (11 adet; ★ = cüretkâr)

**1. ★ Sepya kayması — "Byzantion'a ışınlan"** (jetonun gittiği yer)
- *Oyuncu:* Jetonu alınca dünya bir anda sepya fotoğrafa döner: aynı çatılar ama kahverengi tonda, gren, köşelerde eski fotoğraf lekesi. Ekranda "Kadıköy · 1926". Vapur bacası duman tüter, ses boğuklaşır. 10 kule sonra renkler geri gelir.
- *Neden merak:* "Orası neresi?" değil "**Ne zaman?**" sorusu; oyunun adıyla (Byzantion) doğrudan bağ. Sepya kare, ekran görüntüsü almaya en davetkâr görüntü.
- *Zıplamayı bozmaz:* Kuleler, fizik, kamera aynı; yalnız renk süzgeci + ses + 2–3 eski dekor (tramvay, kayık). Işınlanma "konum değil zaman" olduğu için kule üretimine hiç dokunmaz.
- *Maliyet:* Küçük-orta. Süzgeç kod; Kıvılcım'dan 1 jeton + 2–3 sepya dekor.
- *Risk:* Süzgeç Reanimated/Skia tarafında telefonda kare düşürebilir; ilk iş performans denemesi.

**2. ★ Kayıp İskele — durak listesinde olmayan durak**
- *Oyuncu:* Sis + gece + belli bir kule aralığında, çok nadir, bir durak tabelası çıkar: "Kayıp İskele". Güzergâhta yok, haritada yok. Bir kez görülür, ayrı kartpostalı olur.
- *Neden merak:* Gerçek söylenti mekaniği: "Sisli gecede bir iskele çıkıyormuş" — gören anlatır, görmeyen inanmaz, ekran görüntüsü kanıt olur.
- *Zıplamayı bozmaz:* Yalnız durak tabelası/arka plan; kule dizisi aynı.
- *Maliyet:* Küçük (stops.ts'e koşullu bir durak görünümü + 1 tabela/kartpostal görseli).
- *Risk:* Çok nadir olursa 6 test kişisinden kimse görmez; ilk sürümde koşulu gevşek tut, sonra sıkılaştır.

**3. ★ Yeşil eşofmanlı amca — öteki amca**
- *Oyuncu:* Çok nadiren uzak, arka plandaki çatılarda **başka bir amca** zıplar; aynı bıyık, yeşil eşofman. Yaklaştıkça yoktur. Bir kez kartpostala girer: köşede bulanık bir yeşil leke.
- *Neden merak:* "Sen yeşil amcayı gördün mü?" cümlesi tek başına söylentidir. Kimse açıklamaz, oyuncular kuram kurar.
- *Zıplamayı bozmaz:* Arka plan katmanı, çarpışma yok.
- *Maliyet:* Küçük; mevcut RigAmca'nın renk değiştirilmiş, küçültülmüş hâli. Yeni görsel gerekmeyebilir.
- *Risk:* Ürkütücü bulunabilir; mizahla dengele (bir kez el sallar).

**4. Damga albümü — soru işaretli boşluklar**
- *Oyuncu:* Kartpostal ekranında duraklar dışında 6–8 boş damga yuvası: "?". Nadir olay görülünce (jeton, Kayıp İskele, yunus, yeşil amca) yuva dolar. Paylaşım kartında dolu damgalar görünür.
- *Neden merak:* Arkadaşın kartında senin boş yuvan dolu; "Bu damga nereden?" sorusu paylaşımın kendisini merak kancasına çevirir.
- *Zıplamayı bozmaz:* Tamamen menü/kartpostal.
- *Maliyet:* Küçük (ShareCard + postcards.ts; damga başına küçük görsel).
- *Risk:* Boşluklar yapılmazsa vaat boş kalır; yalnız gerçekten var olan olaylara yuva aç.

**5. İlk 30 saniye: ulaşılamayan parıltı** (bkz. bölüm 1)
- *Oyuncu:* İlk koşuda gökte bir şey parlar, amca "Bu da ne?" der, kaybolur.
- *Neden merak:* Tek oturumluk oyuncuya bile "ikinci kez açma" sebebi.
- *Zıplamayı bozmaz:* Dokunulamayan dekor.
- *Maliyet:* Çok küçük (jeton görseli 1. fikirle ortak).
- *Risk:* Bir daha çıkmazsa ihanet gibi gelir; 2.–3. koşuda mutlaka yakalanabilir olsun.

**6. Saatli sır — "17:17'de oyna"**
- *Oyuncu:* Günün belli bir dakikasında (örn. 17:17) açılan koşuda jeton garanti çıkar; menüde hiçbir şey yazmaz.
- *Neden merak:* Oyuncular arası yayılan klasik söylenti biçimi; birinin bulup grupta yazması yeter.
- *Zıplamayı bozmaz:* Yalnız jeton çıkma olasılığı.
- *Maliyet:* Çok küçük (bir saat kontrolü).
- *Risk:* Kimse keşfetmezse boşa gider; ilk keşfi tetiklemek için bir teyze balonunda ipucu ("Beşi on yedi geçe vapur kaçmaz").

**7. Cepten çıkan harita parçası — oturumlar arası sır**
- *Oyuncu:* Bazı düşüşlerde amcanın cebinden yırtık bir harita parçası düşer ve saklanır. Her parça ayrı oturumda. 5 parça birleşince haritada bir çarpı: Kayıp İskele'nin "nasıl bulunacağı" yazar.
- *Neden merak:* Düşüşü kayıp olmaktan çıkarır; "bir parça daha" ile geri gelme sebebi.
- *Zıplamayı bozmaz:* Düşüş sonrası ekran.
- *Maliyet:* Küçük-orta (5 parça görseli tek bir haritadan kesilebilir: 1 Kıvılcım çağrısı).
- *Risk:* Günlük ödül avına dönerse sır hissi kaybolur; parça sıklığını düşük tut (oturum başına en fazla 1).

**8. Boğaz'da yunus — gerçek ama nadir**
- *Oyuncu:* Arka planda, vapurların yanında bir yunus sürüsü atlar (Boğaz'da gerçekten görülür). Koşuların ~%3'ünde.
- *Neden merak:* İstanbullu için tanıdık "bugün yunus gördüm" sevinci; paylaşılası, abartısız bir nadirlik.
- *Zıplamayı bozmaz:* Arka plan.
- *Maliyet:* Küçük (1 yunus görseli, basit yay hareketi).
- *Risk:* Fark edilmeyecek kadar küçük kalabilir; görüldüğünde amca bir an dönüp bakmalı.

**9. ★ Rüya dönüşü — düşüş bazen bitiş değil**
- *Oyuncu:* Çok nadir bir düşüşte ekran kararır, amca pijamasıyla yatakta uyanır: "Rüyaymış..." ve aynı kuleden **bir kez** devam eder.
- *Neden merak:* "Bana bir kere rüya çıktı, devam ettim!" anlatılır; düşüşü sürprize çevirir.
- *Zıplamayı bozmaz:* Fizik aynı; ama **devam etme kuralı** puan kuralına dokunur → ayrı onay gerekir.
- *Maliyet:* Küçük (pijama görseli var).
- *Risk:* İleride ödüllü reklamla "devam et" gelirse çakışır; ve rekor adaletini sorgulatır. Belki rüya koşusu rekora "☾" işaretiyle sayılır.

**10. Arkadaşın jetonu — kartpostalla bağ**
- *Oyuncu:* Işınlandığın koşunun paylaşım kartı sepya basılır ve altında bir kod (o koşunun tohumu) olur. Arkadaş kartı açınca aynı koşuyu oynar; jeton aynı yerdedir.
- *Neden merak:* "Benim gördüğümü sen de gör" — paylaşımı davete çevirir. Meydan okuma (meydan.ts) altyapısı zaten var.
- *Zıplamayı bozmaz:* Aynı tohumla aynı parkur; mevcut sistem.
- *Maliyet:* Küçük-orta (jetonun da tohuma bağlanması; kurukafa gibi ayrı karma).
- *Risk:* Sırrı ucuzlatabilir; yalnız ışınlanılan koşu paylaşılabilir olsun, Kayıp İskele değil.

**11. Gece seferi sonrası — Karadeniz'in ötesi**
- *Oyuncu:* Rumeli Feneri'ni ilk kez geçen oyuncu, "Gece seferi"nin ilk kulesinde ufukta bir kara çizgisi görür; hiçbir zaman ulaşılmaz ama her gece seferinde biraz yaklaşır.
- *Neden merak:* 122 oturumluk oyuncuya uzun hedef; "Sonunda ne var?" sorusu.
- *Zıplamayı bozmaz:* Arka plan.
- *Maliyet:* Küçük.
- *Risk:* Vaat ettiği yeri hiç yapamazsan hayal kırıklığı; önce 1. fikir oturmalı.

## 3. Bilerek reddettiklerim
- Işınlanmanın oyuncuyu **ileri bir durağa** atması: puanı/ilerlemeyi bozar, rekorları anlamsızlaştırır.
- Ayna dünya (yakalar yer değiştirir, yön ters döner): görsel olarak çekici ama kamera ve kontrol algısını bozar.
- Işınlanmanın rastgele kötü sonuç vermesi (kurukafa gibi): kurukafa zaten o rolü oynuyor.

## 4. Benim 1 numaram
**Sepya kayması: jetonla "Byzantion'a ışınlanma" + ilk koşuda ulaşılamayan parıltı + damga albümünde "?" yuvası.**
Neden: (1) Kullanıcının istediği ışınlanma hissini verir ama konum yerine **zaman** değiştiği için kule üretimine, fiziğe, puana dokunmaz; (2) oyunun adına anlam katar; (3) en ucuz "bambaşka görünen yer" budur, çünkü mevcut görselleri yeniden kullanır; (4) sepya kare paylaşım kartına doğal olarak dönüşür; (5) tek oturumluk oyuncuya da kanca atar.

## 5. İlk sürüm için en küçük deneme hâli
1. **Jeton:** Kıvılcım'dan 1 görsel (onaylı çağrı). Yerleşim kurukafayla aynı yöntem (ayrı karma, yay tepesi), kurukafa etkisi sürerken çıkmaz.
2. **Parıltı:** 1. koşu, ~5. kule, yakalanamaz yükseklikte 1 saniye; amca balonu "Bu da ne?".
3. **İlk yakalama:** 2. koşuda 8–14. kuleler arasında, alçak yayda garanti. Sonra koşuların ~%20'si.
4. **Işınlanma:** beyaz parlama + vapur düdüğü; amca bir sonraki kulenin ortasında durur hâlde (fizik aynı, yalnız görsel geçiş). 10 kule sepya süzgeç, "Kadıköy · 1926" yazısı (yaka/durağa göre yer adı). Yeni dekor yok; yalnız süzgeç.
5. **Dönüş:** 10 kule sonra renk geri gelir, devam.
6. **Damga:** Kartpostal ekranında tek "?" yuvası; ilk ışınlanmada sepya damgayla dolar. O koşunun paylaşım kartı sepya basılır.
7. **Ölçüm (6 test kişisi):** Kimseye söyleme. 1 hafta sonra sor: "Oyunda tuhaf bir şey gördün mü?" Kendiliğinden anlatan sayısı, ışınlanan koşu sayısı (yerel kayıt), sepya kart paylaşımı. 2 kişi kendiliğinden anlatırsa Kayıp İskele ve yeşil amca sıraya girer.

Önce kontrol edilmesi gereken tek teknik soru: sepya süzgecin iPhone'da 60 karede tutup tutmadığı.
