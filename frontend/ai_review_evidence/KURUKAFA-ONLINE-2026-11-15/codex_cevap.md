İncelemeyi yalnızca okuyarak yaptım; dosya değiştirmedim.

### 1. İlk durağa kadar kolaylık

**Önerinin yönüne katılıyorum.** İlk 14 kulede biraz daha geniş kule ve daha az yükseklik farkı, “her yerde biraz daha zor” denemesinden ayrışır ve zorluk artışını ilk durağa bağlar. Ancak taslaktaki sayılar mevcut kodla bire bir örtüşmüyor:

- `[config.ts](/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend/src/game/config.ts:62)` boşluk üst sınırını 340 olarak tanımlıyor; ama ilk 3 kulede `warmupGapMax: 260` geçerli. `[procedural-course.ts](/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend/src/game/procedural-course.ts:56)` `warmupTowers` değerine göre bu özel kolu seçiyor. Dolayısıyla 1–14 için 300 üst sınırı hedefleniyorsa, yalnız `gapEarly` değiştirmek ilk üç kuleyi değiştirmez; 4–14 aralığı etkilenir.
- `heightVarEarly: 220` şu an `[procedural-course.ts:70-76]` içinde durak zorluğu `t` ile geç 300’e doğru artıyor. İlk durağa kadar sabit 160’a çekilmesi, mevcut artış eğrisini de değiştirir. “15’ten sonra eğri aynen” hedefi için erken bölüm değerini ayrı koşullamak gerekir.
- Dar kule eşiği `noNarrowBeforeId: 6`; fakat ilk üç kule zaten geniş/orta kategorilerden geliyor. Taslaktaki “şu an 6’dan sonra %5” ifadesi, eşik sınırının hangi kuleye uygulandığı açısından `[procedural-course.ts:81-90]` ile kontrol edilmeli.

Özellikle 15. kule `breath` durağı olduğundan geniş ve kısa aralıklı bir nefes kulesi olarak zorunlu geliyor (`procedural-course.ts:59-66, 92-96`). Böylece 15 öncesi kolaylık ile durak sonrası basamak artışı aynı mekanizmada korunabilir. Daha güvenli yaklaşım, mevcut durak eğrisini değiştirmeden `id < FIRST_STOP` için ayrı erken değerler tanımlamak ve bunu seed’li harita örnekleriyle kontrol etmektir.

### 2. Kurukafa güçlendirmesi

**Fikir oynanışa uygun; taslaktaki ayrı RNG kararı doğru.** Platform RNG’sinden bağımsız bir akış, güçlendirmenin çıkışlarının kule dizisini ve ortak günlük haritayı değiştirmesini önler. Günlük mod şu an kapalı (`daily.ts:5-8`), ama seed tabanlı üretim zemini mevcut.

**%10 fark hissedilir olabilir:** 86 birimlik çatıda ±8,6 birim anlamlı bir değişimdir; ancak 54 birimlik oyuncu genişliği ve ayak tabanı çakışma testi yanında “adil hata payı” gibi algılanabilir. Görsel ve iniş yüzeyi aynı ölçeklenmezse oyuncu yanıltılır. `[landing.ts](/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend/src/game/landing.ts:3-25)` inişi `x/width` ile sınarken, çatı çizimi `app/index.tsx:2865-2993` civarında platform genişliğini temel alıyor. **Platform nesnesini üretimde kalıcı değiştirmek yerine**, etkin kule genişliği çarpanını iniş testine ve çizime ortak, geçici bir değer olarak vermek daha emniyetli. Böylece üretim haritası, kategori ve sonraki kule mesafeleri değişmez.

15 saniye yerine **5 zıplama** daha anlaşılır ve oyuncu kontrolünde olur: durakta beklerken süre tutmaz, ayrıca kısa veya uzun uçuşlardan dolayı etkisi rastgele sönmez. Zaman tabanlı sürüm seçilirse saniyeyi yalnız gerçek uçuşta ilerletmek ve durakta/ölümde/reset’te durumu açıkça ele almak gerekir. Toplama kontrolü de yalnız uçuş anlarında çalışmalı; `[app/index.tsx](/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend/app/index.tsx:1437-1463)` UI-thread worklet’inde fizik ve iniş çözülüyor. Geri sayım rozeti için React state’ini her karede güncellemek yerine seyrek olay veya shared value ile çizim düşünülmeli.

Çatı genişlemesi **mevcut silüet kuralını etkileyebilir**: kullanıcının sabit tuttuğu çatı formu/görsel silüet değişmemeli. Görünür çatı kenarı büyütülmeden iniş toleransı artırılırsa görsel-hakikat tutarsız olur; görünür genişleme ise kabul gerektirir. Bu nedenle ilk sürümde kule genişliğini değiştirmek yerine kurukafayı geçici puan/şans etkisine dönüştürmek, ya da bu görsel değişimi önce ayrı bir onay örneği olarak sunmak daha güvenli.

### 3. İki kişi online

**Aşamalı yaklaşım mantıklı; fakat “aynı seed + günlük harita” tek başına A adımını tamamlamaz.** Günlük harita özelliği kapalı ve skorlar cihazda tutuluyor (`daily.ts:3-8`). Game Center modülü şu an kimlik doğrulama, skor gönderme ve tablo gösterme sağlıyor; çevrimiçi günlük tablo için ayrıca leaderboard yapılandırması ve günlük skor ayrımı gerekir (`ByzantionGameCenterModule.swift:33-85`, `modules/byzantion-gamecenter/src/index.ts:4-45`).

B adımında GameKit gerçek zamanlı maç altyapısı sağlayabilir; yine de **çatışmasız eşzamanlı simülasyon kendiliğinden gelmez**. Seed, sürüm ve başlangıç anı eşleşmeli; bağlantı kopması, geç katılma, yeniden eşitleme ve rakip durumunun doğrulanması tasarlanmalı. Reanimated worklet ağ erişimi için uygun yer değil: ağ olayları JS/native tarafında işlenip küçük, seyrek durum güncellemeleri shared value’lara aktarılmalı. Mevcut Swift modülü yalnız skor API’si içeriyor; maç daveti ve veri alışverişi için yeni native API/Event’ler gerekir. Gecikme, rakibin hayalet konumunu gecikmeli gösterebilir; rakip hamlesi yerel çarpışma veya kule üretimini belirlemiyorsa oyunun kendi zıplamasını bozmaz. Sunucusuz GameKit iPhone oyuncuları için uygun bir sonraki aşama olabilir; Android eşleşmesi sağlamaz.

**Önerdiğim sıra:** Önce ilk 14 kuleyi kolaylaştıran ayrı erken oyun ayarını mevcut durak eğrisini bozmadan tanımlayıp 15. kule geçişini doğrulamak; sonra kurukafayı bağımsız RNG ve 5 zıplamalık sayaçla prototiplemek, silüet onayı olmadan çatı görünümünü değiştirmemek; çevrimiçi tarafta önce eşzamansız Game Center skor/meydan okuma akışını netleştirmek, talep sürerse GKMatch hayalet yarışını ayrı native ağ katmanı olarak ele almak. 