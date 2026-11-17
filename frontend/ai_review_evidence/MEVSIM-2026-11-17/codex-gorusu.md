## Mevsim kıyafeti ve hava izleri

Önerim, mevsim görünümünü gerçek hava verisiyle birlikte belirlemek; tek bir serin ya da sıcak gün karakteri mevsim dışı bir kıyafete sokmasın. Takvim temel mevsimi seçsin, WeatherKit sıcaklığı ve yağışı görünümü hafifçe ayarlasın. Örneğin kışın ılık bir günde mont açık durabilir; yazın serin ve yağmurlu bir günde ince bir yağmurluk eklenebilir. Hava verisi alınamazsa takvim mevsimi kullanılır.

### Kıyafetler

- **Yaz:** Atlet ve uzun paçalı don; bu fikir karakterin sevimli, biraz da tuhaf havasına uyuyor. İnce ter damlaları veya alnını silme ifadesi eklenebilir. Güneş gözlüğü gibi yüzü kapatacak ayrıntılardan kaçınmak iyi olur.
- **Kış:** Büyük, kabarık bir mont; atkı ve kulakları açıkta bırakan bir bere ya da gece külahıyla uyumlu bir başlık. Kırmızı burun gibi küçük bir ayrıntı komik durabilir. Montun alt ucu ve atkısı ayaklara ya da çatı kenarına taşmamalı.
- **İlkbahar:** İnce ceket veya hırka; istenirse yakada küçük bir erguvan rozeti. Görünüm kıştan belirgin biçimde hafif, yazdan biraz daha kapalı olur.
- **Sonbahar:** Hafif yağmurluk veya yelek üstüne ince kazak. Bir iki sarı yaprak kıyafete takılmış gibi çizilebilir; yağmur varsa şemsiye yerine zıplamayı ve silueti kapatmayan kapüşon tercih edilmeli.

Gece durağında pijama, mevsim kıyafetinin yerini alsın. Yaz gecesinde kısa kollu pijama; serin mevsimlerde uzun kollu pijama ve terlik kullanılabilir. Gece külahı korunabilir. Bu biçimde karakter gece durağında da mevsime uygun görünür ama gündüz kıyafetiyle üst üste binmez.

### Üretim yolu ve efor

En güvenli ve ucuz ilk yol, her pozun tamamını baştan çizmek yerine **gövde üstüne kıyafet katmanları** kullanmak: örneğin mont, atkı ve başlık ayrı görseller; atlet ve don için de ayrı bir yaz görünümü. Böylece mevcut pozların yüzü, pozu ve ayak/pivot noktası korunur. Katmanlar her pozda aynı koordinat ve ölçekte kalmalı; ayakların çevresindeki alan ile sprite sınır kutusu değişmemeli.

Yine de her pozda katmanların doğru görünmesi gerekir. 0–100 arası her şarj karesi ve varsa ifade sürümleri hesaba katılmalı; farklı pozlarda kol, gövde ve kıyafet örtüşmeleri değişebilir. Bu nedenle katman yaklaşımında da poz başına hizalama ve görsel kontrol işi çıkar. Mevcut poz sayısı netleşmeden kesin toplam vermek yanıltıcı olur: toplam, **kıyafet varyantı × kullanılacak poz ve ifade görseli** kadardır. Tamamen ayrı sprite seti ise bu toplamı her kıyafet için yeniden çizim ve tutarlılık kontrolüne dönüştürür.

En ucuz güvenli deneme, önce tek bir temsili şarj pozu ve bir iniş/atlama pozunda yaz görünümünü katman olarak hazırlamak; ölçek, pivot ve ifade okunurluğunu kontrol etmektir. Sonuç iyi olursa kalan pozlara yayılır. Katmanlar mevcut pozlara temiz oturmazsa, seçili mevsim için yeni poz seti çizmek değerlendirilebilir. Yeni görsel üretimi veya Kıvılcım kullanımı ayrıca onay gerektirir; kodla renk, hava efekti ve parçacık katmanları yapılabilir.

### Arka plan ve kolonlarda hava izleri

- **Kar:** Çatılara ince örtü ve saçaklara küçük buz sarkıtları eklenebilir. Kolonun üst iniş yüzeyi açık ve kontrastlı bırakılmalı; kar birikintisi yalnız kenarlarda durmalı. Basit kar parçacıkları kodla yapılabilir; doğal görünen çatı karı ve buz ayrıntıları için yeni görsel ya da atlas çizimi gerekir.
- **Yağmur:** Kolon cephelerinde koyulaşma, kiremitte hafif parlaklık ve saçak altından damlalar kullanılabilir. Yağmur çizgileri kodla üretilebilir; mevcut kolonların tonunu değiştirmek de mümkün. Su birikintisini iniş alanına koymamak, parlaklığı sınırlı tutmak gerekir. El çizimi su izleri daha doğal görünmesi için görsel çalışma isteyebilir.
- **Rüzgâr:** Kodla yönlü çizgiler, hafif yaprak parçacıkları ve arka planda hareket hissi verilebilir. Çamaşır ve bayrak gibi ayrıntılar mevcut görselde yoksa çizim veya atlas güncellemesi gerekir; hareketleri ayrıca kodlanabilir.
- **Sonbahar:** Uçuşan sarı yapraklar kodla parçacık olarak eklenebilir. Çatı ve arka plan için sabit yaprak kümeleri yeni görsel katman ister.
- **İlkbahar:** Erguvan ve lale renkleri arka planda veya çatı aralarında kullanılabilir. Bunlar mevcut atlaslarda yoksa görsel ekleme gerekir.
- **Yaz:** Güneş parıltısı, sıcak renk tonu ve hafif ışık katmanı kodla yapılabilir. Belirgin İstanbul bitki örtüsü ya da yeni dekorlar görsel ister.

Her hava efektinde çatı kenarı ile iniş yüzeyinin sınırı net kalmalı. Kolonların üstüne yoğun parçacık, kar tepesi veya ayna gibi parlak yansıma bindirilmemeli; iniş kontrolünün görsel ipucu her koşulda görünür olmalı.

### Önerilen ilk üç adım

1. **Mevsim karar kuralını belirleyin:** Takvim temel olsun; gerçek sıcaklık ve yağış yalnız görünümü uyarlasın. Bu, günlük hava değişirken kıyafetin sürekli değişmesini önler.
2. **Tek bir kıyafet örneğini katman olarak deneyin:** Yaz görünümünü birkaç temsili pozda uygulayıp pivotu, sınır kutusunu ve ayak hizasını kontrol edin. Bu, bütün pozları üretmeden yöntemin güvenli olup olmadığını gösterir.
3. **Kodla yapılabilen hava izlerini küçük bir örnekte deneyin:** Önce kolon üstü açık kalacak şekilde yağmur parlaklığı ve kenar karı; ardından arka plan parçacıkları ekleyin. Sabit, çizilmiş mevsim dekorlarını ancak hangi bölgelerde gerektiği görüldükten sonra planlayın.

Bu sıra önce oyun hissini ve iniş okunurluğunu korur; sonra poz seti ya da yeni görsel gerektiren işin kapsamını somutlaştırır.