# Sanat yönetmeni ve mizah editörü: Oyunu benzerlerinden ne ayıracak? (12 Kasım 2026)

Bakış açım karakter, görsel kimlik, İstanbul hissi, klip üretimi, görsel maliyet ve iOS performansı. Dayandığım kaynaklar: brief, DURAK-2026-11-12 kareleri, FAZ2-IFADE karşılaştırması ve YAPI-2026-11-12 notum.

## 1. Dürüst teşhis
**Bizi ayıranlar:**
- **Karakter.** Jump Jump'ta bir satranç piyonu, Stick Hero'da bir çöp adam zıplıyor. Bizde yüzü olan biri var: bıyık, bordo eşofman ve gergin, ıkınan, patlamak üzere olan bir yüz. Türdeki rakiplerin hiçbirinde yüz yok.
- **Gaz şakası.** Akılda kalıyor ve "osuran amca" diye tek cümleyle anlatılıyor.
- **İstanbul kartpostalı.** Boğaz, Galata, vapurlar ve renkli cepheler kalitesiyle öne çıkıyor.

**Bizi ayırmayanlar:**
- **Mekanik birebir Jump Jump.** Basılı tutuyorsun, bırakıyorsun, çatıya iniyorsun.
- **Kimlik kabukta kalıyor.** Amcayı piyonla, İstanbul'u düz renkle değiştirsek oyunun nasıl oynandığı hiç değişmez. Gaz da bir süs: her zıplamada aynı şekilde çıkıyor, oyuncunun kararına hiç girmiyor.
- **Duraklar ve kartpostallar çoğu oyuncuya ulaşmıyor.** Turların çoğu 15. kuleden önce bitiyor. Yani "ayırt edici" katmanın büyük kısmını oyuncuların çoğu hiç görmüyor.

**Sonuç:** Karakter çizimi hazır, ama oyun onu kullanmıyor. Çözüm yeni içerik eklemek değil, karakteri mekaniğin içine sokmak.

## 2. İmza özellik
**Ana fikir, "Tutamazsan kaçırırsın":** Şarj göstergesi yalnızca amcanın yüzü olur. Fazla tutarsan amca dayanamaz, gaz kendiliğinden kaçar.
- **Oyuncu ne yapar:** Ekranda çubuk ya da yüzde yok. Gücü yüzden okur: gergin, ıkınma, kızarma, patlamak üzere. Yüz %100'e varınca kısa bir **"son an" penceresi** açılır (yaklaşık 0,4 sn). Yüz titrer, burun kızarır, ter damlası düşer.
  - Bu pencerede bırakırsa **"Tam kıvam" +2** alır ve gaz bulutu büyük çıkar.
  - Pencere biterse amca **kaçırır**: zıplama zorla en yüksek güçle tetiklenir, gaz kocaman ve kontrolsüz çıkar, ses bir oktav yüksek olur.
- **Neden tekrar oynar:** Her zıplama küçük bir cesaret testine döner: güvenli bırakmak ya da sınırı zorlamak. Kaçırma anı da kendi başına komik: düşüş ceza gibi değil, "amca dayanamadı" diye bir şaka olarak yaşanır. Bu, sürekli klip üreten bir an.
- **Neden başkası yapamaz:** Şarj ile ıkınma birebir aynı eylem. Piyonun yüzü yok, çöp adamın gazı yok. Fikir tek cümleyle anlatılıyor: *"Amcayı ıkındır, ama fazla değil."*
- **Boyut ve maliyet:** Küçük. Yeni görsel gerekmiyor; mevcut %100 kafası, kodla titreme, kırmızı tint ve gaz ölçeği yetiyor. Kredi yok.
- **Fiziğe dokunur mu:** Atlama fiziği aynı kalıyor, değişen girdi zamanlaması. Kaçırma, mevcut en yüksek güçle zorunlu bir bırakma. Güce rastgele sapma eklenirse bu fizik değişikliği sayılır ve önermiyorum.
- **Risk:** İlk 15 kuleyi zorlaştırıp erken düşüşü artırabilir. Bu yüzden pencere ilk durağa kadar cömert tutulmalı (0,6 sn), sonra daralmalı. Bir de "tam kıvam" en yüksek güce yakın olduğu için kısa aralıklarda işe yaramaz. Bu, kasıtlı bir risk-ödül dengesi.

**Yedek 1, "Mahalle duyar":** Gaz dünyayı etkiler. İnilen kulenin bir penceresinin kepengi çarpar, saksıdaki çiçek solar, çatıdaki martılar havalanır, balkondaki çamaşır uçuşur. Kaçırmada üç kule birden tepki verir. Yazı yok, sadece görsel tepki var.
- **Ayırıcı yanı:** İstanbul canlı bir mahalleye dönüşür, klip anları çoğalır.
- **Maliyet:** Martı ve kepeng kodla yapılır. Pencereden bakan "teyze" kafası 1–2 görsel çağrısı ister, ayrı onay gerekir.
- **Fiziğe dokunmaz.**
- **Risk:** Aynı anda tek tepki olmalı ve kuleler bulanıklaşmamalı. Bindirme kırpma maskesiz, tek sprite olmalı.

**Yedek 2, "Anı kartpostalı":** Turun en iyi zıplaması (en uzak çoklu atlama ya da kaçırma) sonuç ekranında, yavaşlatılmış 2 saniyelik tekrar olarak gösterilir, kenarda amcanın yüzü büyür.
- **Ayırıcı yanı:** Paylaşılan şey skor değil, amcanın yüzü olur.
- **Maliyet:** Orta. Son 120 karenin durumu kaydedilip yeniden çizilir, video kodlaması yapılmaz.
- **Fiziğe dokunmaz.**
- **Risk:** Bellek ve iOS performansı. Kayıt yalnızca konum ve ifade indeksi olmalı, ekran görüntüsü tutulmamalı.

## 3. En ucuz prototip (1–2 gün, telefonda)
1. **1. gün:** Yalnızca kod. %100'de bir zamanlayıcı kurulur. Son an penceresinde yüz titrer (±2 piksel), kafaya kırmızı tint gelir, ter damlası emoji olarak düşer. Pencere bitince zorunlu bırakma tetiklenir; gaz ölçeği ×2,5 olur, mevcut osuruk sesi `playbackRate 1,3` ile çalınır. "Tam kıvam" mevcut "+N" sistemiyle "+2 💨" olarak gösterilir. Yeni görsel, ses ya da UI yok.
2. **2. gün:** Telefonda 3 kişiye 10'ar tur oynatılır. Ölçülecekler:
   - Kaçırma oranı (hedef %10–20)
   - Tam kıvam oranı
   - İlk 15 kuleye varış eskisinden düştü mü?
   - Oyuncular kaçırmada güldü mü, sinirlendi mi? Bu, video kaydından izlenir.
3. Pencere süresi bir ayar değişkeni olur, iki değer (0,4 ve 0,6 sn) karşılaştırılır.

## 4. Yapılmaması gerekenler
- **Güç çubuğu ya da yüzde göstergesi eklenmemeli.** Fikrin özü yüzü okumak; çubuk konursa amca yine süse döner.
- **Kostüm, yeni semt arka planı ya da yeni gaz türü gibi içerik eklenmemeli.** İmza mekanik telefonda tutmadan bunlar yapılmamalı. Oyuncuların çoğu zaten 15. kuleyi görmüyor, içerik eklemek ayırt ediciliği artırmaz, yalnız görsel maliyeti ve üslup kayması riskini artırır.

## 5. Kullanıcıya sorulacak kararlar
1. **Kaçırma cezası nasıl olsun?** (a) En yüksek güçle zorunlu zıplama: fizik aynı kalır, önerim bu. (b) Amca yerinde kalır, gaz kaçar, 1 puan düşer. Bu daha yumuşak ama daha az komik.
2. Ana fikir tutarsa, "Mahalle duyar" için pencereden bakan teyze kafasına **1–2 görsel çağrısı** onaylanır mı?
