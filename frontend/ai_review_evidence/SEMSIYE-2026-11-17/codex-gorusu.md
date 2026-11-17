## Genel değerlendirme

Fikir oyuna yakışıyor: yağmurlu havadaki “şemsiyeni unutma!” cümlesini oynanışta görünür bir şakaya dönüştürüyor. Bunu görsel tepki olarak tutup zıplama fiziğine dokunmamak doğru; yağmurun atmosfer katmanı olarak kalması da önceki yönle uyumlu. 【MEMORY.md:43-46】

## Ne zaman açık olsun?

- **Şarj ve kalkış:** Kapalı, amcanın yanında taşınıyor. Şarj pozlarında sabit kalır.
- **Yükseliş ve tepe:** Kapalı. Tepe noktasında açılması, düşüş anını daha az belirgin kılar.
- **Düşüş:** `vy > 0` olduğunda kısa ve net bir açılma animasyonu; inişe kadar açık.
- **İniş:** Temasta kısa bir sallanma, ardından kapalı duruma dönüş. Yeniden zıplamada kapalı kalır.

Açık şemsiyenin altında süzülme efekti, oyuncuya fiziğin yavaşladığını düşündürebilir. Bunu önlemek için karakterin düşüş hızı ve ekran içindeki hareketi aynen korunmalı; açılma kısa olmalı, şemsiye konumu karaktere kilitlenmeli ve ekstra havada kalma, salınım ya da düşüş animasyonu eklenmemeli.

## Çizim ve katman

Dokuz pozda kol ve gövde değiştiğinden, şemsiyeyi ele oturan bağımsız bir katman olarak çizmek zor ve kırılgan olur. İlk sürüm için sapı kavrayan el şartı aramayan, başın üstünde taşınan küçük kapalı şemsiye; düşüşte ise karakterin üstüne merkezlenmiş açık şemsiye daha güvenilir. Şemsiye katmanı her pozun üzerine aynı noktadan binebilir; baş/şemsiye çakışması özellikle bere, atkı ve gece külahıyla kontrol edilmeli.

İlk denemede **iki görsel yeterli**: kapalı ve açık. Ters dönmüş şemsiyeyi ilk pakete katmazdım; özgün form, boyut ve kompozisyon onaylandıktan sonra eklenebilir. Bu fikirde sapın ele oturmasından çok silüetin temiz ve okunur kalması önemli.

## İniş okunurluğu

Açık şemsiye geniş bir üst silüet oluşturacağından kule tepelerini ve iniş alanını kapatma riski var. Karakterin başına yakın, kompakt tutun; kubbe ayakların ya da gövdenin yanlarına taşmasın ve hedef yüzeyin önünde durmasın. Çizim aşamasında en dar kule aralığı ve iniş karesiyle birlikte kontrol etmek gerekir.

## Yaratıcı ekler

Hafif yağmurda (`light`) açılma yine çalışabilir; damla ve ıslak kiremit efektleriyle karışmaması için şemsiyeden damla dökülmesini şimdilik seyrek ya da hiç kullanmamak iyi olur. İnişte tek kısa sallanma yeterli. Patlama efektinin şemsiyeyi kapatması veya fırlatması ise görsel etkiyi fizik değişikliği gibi okutabilir; ilk sürümde patlama etkileşimi eklememek daha temiz.

Karda şemsiye gerekli değil; mevcut kar birikmesi ve silkelenme davranışıyla çakışmasın. Rüzgârda şemsiye göstermemek için menü metni gibi küçük bir şaka düşünülebilir: “Lodos var, şemsiyeyi açma!” Ters dönmüş şemsiyeyi görsel olarak göstermek, kapsamı genişletecek ayrı bir varyant olur.

## İlk adım ve efor

Önce **kapalı ve açık şemsiyenin iki sabit görselini** karakter üzerinde, farklı poz ve başlık katmanlarıyla denemek; özellikle en geniş şarj pozu ile iniş okunurluğunu kontrol etmek. Bu, kod yazmadan önce ölçek ve yerleşim kararını netleştirir. İlk görsel turu **2 görsel**, ardından durum geçişleri ve kısa açılma/iniş tepkisi için küçük bir kod işi olur. Kod değişikliği yapılmadı.

