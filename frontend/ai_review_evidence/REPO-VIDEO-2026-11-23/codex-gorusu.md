## Dürüst değerlendirme

“Videocular sahtekâr ya da ben dürüst değilim” ikilemi doğru değil. Videodaki araçların çoğu gerçek; bazıları işe yarayabilir. Ama “kredinin yarısı dosyaları okumaya gidiyor”, “100 ajan tek komutla”, “hızın ikiye katlanıyor” gibi laflar genel ve kanıtlanmış sonuçlar değil. Tanıtım videoları başarı örneklerini öne çıkarıyor; sizin projenizde aynı sonucu vereceklerini göstermiyor.

Önceki repo değerlendirmelerimizde de bir eksiği kabul etmeliyim: “işinize uymuyor” demek, aracın gerçek bir faydasının olup olmadığını ve küçük bir denemeyle ölçülüp ölçülemeyeceğini açıklamaya yetmiyor. Bu kez ikisini ayrı değerlendiriyorum. Kaynaklarda bulamadığım bir aracı gerçekmiş gibi göstermiyorum; görünmeyen beşinci eklentiyi ise değerlendiremiyorum.

## Araçlar ve sizin işinize uyumu

| Araç | Gerçeklik ve iddia | Size faydası | Çakışma ve risk |
|---|---|---|---|
| **Ponytail** | [GitHub deposu mevcut](https://github.com/DietrichGebert/ponytail). Ajana önce mevcut ve daha basit çözümü aramasını söyleyen bir skill. Gereksiz kodu azaltabilir; sabit bir token tasarrufu vaat etmez. | **Orta** | Projeye özel kurallarınıza ek bir talimat katmanı olur. Kolayca geri alınabilir; yine de üçüncü taraf skill talimatlarını gözden geçirmek gerekir. |
| **Graphify** | [Graphify Claude eklentisi mevcut](https://github.com/iangregsondev/claude-graphify-plugin). Kod ilişkilerini haritalamayı ve bu haritayla sorular yanıtlamayı hedefliyor. Her işi haritadan çözüp dosya okumayı ortadan kaldırdığı iddiası fazla kesin; harita güncelliği ve görev türü önemli. | **Orta** | Büyük ve bağlantılı kod tabanında fayda görebilir; küçük/hedefli değişiklikte harita üretme maliyeti ekler. Harita oluşturma ayarına göre ayrıca model kullanımı olabilir. |
| **Agent Skills** | Videodaki bu ad tek bir repo ya da belirli bir skill değil; planla-yaz-test et-yayınla iş akışını tarif ediyor. Sizde zaten özel skill’ler, editör incelemesi ve test disiplini var. | **Düşük** | Büyük ölçüde mevcut iş akışıyla çakışıyor. “Yayınla” aşamasının otomatikleşmesi sizin onay kapılarınızı aşmamalı. |
| **Claudex Loop** | [Claude–Codex plan inceleme reposu mevcut](https://github.com/promptadvisers/claudex). Planı başka bir modelle eleştirmek faydalı olabilir; iki modelin onayı doğru planı veya hatasız kodu garanti etmez. | **Düşük–Orta** | Codex’i zaten ikinci görüş için kullanıyorsunuz; ek otomasyonun getirisi sınırlı. Daha fazla model çağrısı ve maliyet oluşturabilir. |
| **FFmpeg, yt-dlp, Whisper, HyperFrames, GSAP** | FFmpeg, yt-dlp ve yerel Whisper zaten ortamınızda. HyperFrames ve GSAP video üretiminde kullanılabilir; ancak HyperFrames’in Claude’dan HTML sahnesi alması kendi başına iyi video sonucu garantilemez. | **Düşük** *(mevcut olanlar için)*; yeni video akışı varsa **Orta** | Kurulu araçları yeniden eklemek gereksiz. Bulut transkripsiyon veya yeni bir skill eklenirse veri, API ücreti ve bakım maliyeti doğabilir. |
| **CLI-Anything** | [GitHub deposu mevcut](https://github.com/HKUDS/CLI-Anything). Masaüstü uygulamaları için ajanların kullanabileceği komut satırı arayüzleri üretiyor; depodaki uygulama sayısı yıldız sayısıyla aynı şey değil. “MCP gerekmiyor” kısmı teknik olarak mümkün, ama her uygulamanın her işlevini güvenilir biçimde yönetmek anlamına gelmiyor. | **Düşük** | Sizde bilgisayar kontrolü, simülatör ve Codex araçları zaten var. Yeni kurulan komut arayüzleri uygulama üzerinde işlem yapabilir; kapsamını ve güvenliğini kontrol etmek gerekir. |
| **Ultracode** | Birden fazla “ultracode” projesi var. Bulduğum [lillyadev/ultracode deposu](https://github.com/lillyadev/ultracode) arşivlenmiş. Ayrıca Claude Code’daki **ultracode** adını kullanan yerleşik bir özellik de var; bunlar videoda aynı şeymiş gibi anlatılmış olabilir. “100 ajan” sabit sonuç değil. | **Düşük** | Sizde çoklu ajan akışı zaten mevcut. Daha büyük ajan ekibi daha iyi sonuç garantilemez; kullanım ve inceleme maliyetini büyütebilir. |
| **Wi-Fi dedektifi** | Videoda depo, araç veya yöntem belirtilmediği için hangi şeyin kastedildiğini doğrulayamıyorum. Hız testinin kablosuz kanal sorununu tek başına bulacağı iddiası da güvenilir bir teşhis vaadi değil. | **Yok** *(bu haliyle)* | Ölçüm ile ağ ayarını değiştiren öneriyi ayırmak gerekir. Video, uygulanacak güvenli ve tekrarlanabilir bir prosedür sunmuyor. |
| **skills.sh’deki 13 skill** | Liste birbiriyle aynı işi yapan 13 araç değil; tarayıcı, tasarım, SEO, fiyatlandırma ve video gibi farklı alanlardan toplama. İndirme/kurulum sayısı kalite veya tasarruf kanıtı değildir. | **Düşük** *(paket olarak)* | Birkaç skill sizin işinize denk gelebilir; hepsini kurmak talimat karmaşası ve bakım yükü getirir. Her skill ajanın yetkisiyle çalışabileceği için kaynağı ve içeriği incelenmeli. |
| **OmniRoute** | [Repo mevcut](https://github.com/diegosouzapw/OmniRoute); yerel bir geçit üzerinden model ve sağlayıcı yönlendirmeyi hedefliyor. Model seçimi ve maliyet takibi sağlayabilir; ücretsiz kullanım veya otomatik tasarruf sağlamaz. | **Düşük–Orta** | Claude/Codex kullanımınızın mevcut düzenine ek kurulum ve sağlayıcı yapılandırması getirir. Anahtarların ve istemlerin geçtiği ek bir katman olur; maliyet, gizlilik ve hata ayıklama açısından dikkat ister. Videoda kalan dört eklentinin adları görünmüyor. |

Genel güvenlik notu: Bir skill yalnızca “metin” gibi görünse bile ajana ne yapacağını söyler; eklenti veya CLI ise kod çalıştırabilir. Kurmadan önce kaynağı, kurulum adımlarını, istediği izinleri ve ağ erişimini incelemek gerekir.

## İlk deneme için önerim

En fazla üç aracı, kurulum yapmadan önce kontrollü bir görev karşılaştırmasıyla ele alırdım:

1. **Ponytail:** Byzantion’da küçük ve sınırları belirli bir kod değişikliği. Skill açık/kapalı koşullarda aynı görevi karşılaştırın. Süreyi, kullanılan token/istek miktarını, eklenen-silinen satırları ve mevcut kodu yeniden kullanıp kullanmadığını kaydedin. **Bırakma ölçütü:** üç benzer görevde kalite korunurken ölçülebilir süre veya token kazancı görülmemesi.
2. **Graphify:** Büyükçe bir modülde “bu davranış nerede tanımlanıyor ve hangi dosyalar etkilenir?” gibi bir inceleme görevi. Harita kullanımı ve normal aramayla doğru dosyaları bulma süresini, açılan dosya sayısını ve yanlış yönlendirmeleri karşılaştırın. **Bırakma ölçütü:** harita güncel değilse veya en az üç görevde dosya inceleme yükünü düşürmüyorsa.
3. **Claudex Loop:** Yalnızca orta/büyük, yazma izni verilmeyen bir plan incelemesi. Ek maliyeti ve süreyi; sizin mevcut ikinci görüş akışınızla bulunan yeni, uygulanabilir sorun sayısını karşılaştırın. **Bırakma ölçütü:** mevcut editörlerin bulmadığı somut bir sorunu düzenli biçimde bulmaması ya da ek model maliyetinin faydayı aşması.

Bu, araçları hemen kurma önerisi değil; önce yarar iddialarını sizin işinizde ölçme önerisi. Küçük deneme bile güvenilir sonuç vermiyorsa kurmaya gerek yok.

## Şimdilik önermediklerim

- **13 skill’i birden kurmayın:** birbirinden farklı işler için tasarlanmışlar; toplu kurulum sizin iş akışınıza dair kanıt sağlamaz.
- **Ultracode’u “100 ajan” hedefiyle kullanmayın:** ajan sayısı kalite ölçüsü değil; mevcut çoklu ajan düzeniniz varken ek masrafı ölçmeden açmak verimsiz olabilir.
- **CLI-Anything’i şu an genel çözüm diye kurmayın:** mevcut bilgisayar kontrolünüz ve simülatör araçlarınız var; belirli bir uygulamada tekrar eden, somut bir darboğaz çıkarsa o uygulamayı ayrıca değerlendirin.
- **OmniRoute’u ücretsiz kredi veya garantili tasarruf için kurmayın:** videodaki iddia bunu kanıtlamıyor; sağlayıcı yapılandırması ve ek güven sınırı getiriyor.
- **Wi-Fi videosundaki promptla ağ ayarlarını otomatik değiştirmeyin:** videoda doğrulanabilir kaynak ve güvenilir teşhis yöntemi yok.

Kaynaklar: [Graphify eklentisi](https://github.com/iangregsondev/claude-graphify-plugin), [Claudex](https://github.com/promptadvisers/claudex), [CLI-Anything](https://github.com/HKUDS/CLI-Anything), [Ultracode deposu](https://github.com/lillyadev/ultracode), [OmniRoute](https://github.com/diegosouzapw/OmniRoute).