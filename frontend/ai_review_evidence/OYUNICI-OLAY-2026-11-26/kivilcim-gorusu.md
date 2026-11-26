**Dosya oluşturulamadı:** çalışma alanı bu oturumda salt okunur. Oyun koduna ve proje dosyalarına dokunmadım. Aşağıdaki metin, `editor-kivilcim.md` olarak kaydedilmeye hazır görsel tasarım görüşüdür.

# Kıvılcım — Durak olaylarının görsel dili

Olaylar aynı Boğaz sahnesinin üstünde kısa birer mahalle aksiliği gibi görünmeli: amca, çatı, kuleler ve su kadrajda kalır. Görsel şaka amcanın tepkisinden çıksın; yeni sahne veya uzun açıklama gerektirmesin. Küçük ekranda okunaklı silüet ve 1–2 belirgin hareket, ince yüz ayrıntısından daha değerlidir.

| Durak / olay | Görsel şaka ve amcanın tepkisi | Yeni çizim ihtiyacı |
|---|---|---|
| **Kız Kulesi — martılar simide üşüşür** | Martılar yukarıdan ve yandan yaklaşır; amca simidi göğsüne saklayıp öbür eliyle telaşlı ama vakur biçimde kovalar. Kaçırılan simit martının gagasında kalır; amca boş eline bakar. | Önce kod silüetiyle denenebilir. Sonradan istenirse **2–3 martı pozu**: kanat açık, gagada simit, kaçış. |
| **Kuzguncuk — çamaşır ipi amcaya dolanır** | Cumbadaki teyze bakarken çarşaf uçar, amcanın bıyığına veya omzuna takılır. Amca havalı duruşunu korumaya çalışırken kumaş yüzünü örter. | Mevcut teyze ve çamaşır çevre öğeleri yeterliyse **0**; çarşaf için gerekirse **1** basit hareketli parça. |
| **Ortaköy — kumpir kapağı fırlar** | Ustanın tezgâhından zeytin veya mısır tanesi sekip amcanın bıyığına yapışır. Amca göz ucuyla bıyığına bakar, eliyle almaya çalışırken inişini bozmaz. | **0–1** küçük yiyecek çizimi; parçacıklar kodla da yapılabilir. |
| **Arnavutköy — vapur dalgası** | Vapur geçerken su sıçrar; amca saçını ve eşofmanını silker, sonra hiçbir şey olmamış gibi ciddi pozuna döner. | Vapur mevcut. Sıçrama **kodla**; yeni çizim **0**. |
| **Bebek — kedi çatıda yerini sahiplenir** | Kedi amcanın ineceği yere yayılır. Amca havada kediyi görüp ayaklarını toplar; kedi kıpırdamadan göz kırpar. | Mevcut kedi çizimleri yeterli; yeni poz **0**. |
| **Rumeli Hisarı — kargalar kalkışır** | Bir karga amcanın inişini izler, son anda diğerleriyle birlikte havalanır. Amca omuzlarını kulaklarına çekip gözlerini kısar; kargalar onu korkutmuş gibi değil, o kendini toparlamış gibi görünür. | `karga.ts` içindeki karga pozları ve uçuşu yeniden kullanılabilir; **0**. |
| **Köprü — rüzgâr eşofman paçasını savurur** | Amcanın ceketi ve paçaları rüzgârda geriye çekilir. Amca bıyığını bastırıp yönünü korur; köprünün ve suyun görünüşü değişmez. | Önce mevcut uçuş pozu ve kodla hareket. Özel kıyafet çizimi istenirse **1**; ilk prototip için gerekmez. |
| **Kanlıca — pudra şekeri bıyığa konar** | Yoğurt kasesinin üstündeki pudra şekeri bulutu amcanın bıyığına düşer. Amca bir kez hapşırır; bıyık beyazlar, sonra eliyle siler. | Parçacık kodla; ayrı hapşırma pozu istenirse **1**. |

**Görsel önceliğim:** Önce mevcut kargalar, kediler, vapurlar ve kod çizimi martı silüetleriyle prototip. Yeni çizime en çok ihtiyaç duyabilecek olay martıların simidi kapması; burada 2–3 okunaklı martı pozu yeterli olur. Herhangi bir Kıvılcım üretimi ayrı çağrı/onay gerektirir; kabul edilen çizimler onaydan önce oyuna bağlanmamalı.

Amcanın ortak tepki dili: olay anında kısa bir irkilme veya göz kayması, hemen ardından “ben zaten böyle yapacaktım” ciddiyeti. Düşme hissi veren pozlardan kaçınalım; şaka, güvenli iniş akışının dışında küçük bir yüz veya kol hareketiyle anlatılsın.