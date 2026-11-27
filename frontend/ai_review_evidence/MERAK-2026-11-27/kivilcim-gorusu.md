# MERAK-2026-11-27 — Editör değerlendirme raporu

Depodaki `jump.ts`, `landing.ts` ve `procedural-course.ts` mevcut sınırı netleştiriyor: zıplama, iniş, kule dizisi ve kamera aynı kalmalı. Bu yüzden öneriler, **oyuncuyu başka bir yerdeymiş gibi hissettiren sahne ve kural katmanları** üzerine kurulu. İki bağımsız editör de ışınlanma fikrini güçlü buldu; ortak şartları, geçişin zıplama matematiğini ve iniş okunurluğunu etkilememesi.

**Maliyet notu:** Kod ve yeni görsel ihtiyacını ayrı belirttim. Görsel üretimi bu raporun kapsamına dahil değil.

## Fikirler

### 1. Başka İstanbul’a açılan kapı — cüretkâr

Yeni bir nesneye değince görüntü bir an dalgalanıyor. Amca aynı zıplamayı tamamlıyor; inişten sonra tanıdık Boğaz’ın yerinde, kıyısı benzer ama silueti imkânsız başka bir İstanbul görüyorsun.

**Merak:** “Nereye geldim, bu şehir nerede?” sorusu doğurur; kısa bir ekran görüntüsü bile arkadaşlara anlatılacak bir an yaratabilir.

**Zıplama:** Amcanın uçuşu, kulelerin konumu, kamera ve puan aynı kalır. Yalnız arka plan ve cephe görünümü geçici olarak değişir; “ışınlanma” sahne geçişiyle hissettirilir.

**Maliyet:** Kod orta; ilk denemede mevcut varlıklarla görsel düşük, kalıcı sürümde 1–2 yeni fon veya siluet orta.

**En büyük risk:** Yeni yer ayrı bir parkur gibi görünürse, oyuncu iniş düzeninin değişmesini bekleyebilir.

### 2. Boğaz’ın su altındaki yüzü — cüretkâr

Nesneyi topladığında gökyüzü su rengine döner, çatılar suyun altındaymış gibi görünür. Amca aynı çatılara zıplamayı sürdürürken, aşağıdaki yansımada farklı bir kıyı çizgisi belirir.

**Merak:** Bu, gerçek bir yer değişiminden çok “Boğaz’ın altında başka bir şehir mi var?” hissi verir.

**Zıplama:** Su efekti ve yansıma yalnız arka plan katmanında kalır. Kule kenarları ve amcanın iniş alanı net görünür.

**Maliyet:** Kod orta; ilk denemede yeni görsel düşük, devamlı içerikte 1–2 fon varyantı orta.

**En büyük risk:** Yansıma veya parıltı kule kenarlarını örterse iniş takibi zorlaşır.

### 3. Haritada olmayan kıyı — cüretkâr

Uzakta, mevcut haritada bulunmayan küçük bir mahalle görünür. Ona yaklaştığını sanırken kaybolur; başka bir koşuda kıyının farklı bir noktasında yeniden belirir.

**Merak:** Oyuncuya peşine düşüp yerini bulma ve başkasına gösterme isteği verebilir.

**Zıplama:** Mahalle yalnızca uzak fon çizimidir. Kule üretimi, konumlar ve kamera değişmez.

**Maliyet:** Kod orta; bir yeni siluet ve birkaç konumlandırma varyantı için görsel düşük-orta.

**En büyük risk:** Seyrek işaretler olmadan bir tasarım tercihi yerine çizim hatası sanılabilir.

### 4. Yanlış gökyüzü

Bir nesneyi aldıktan sonra gündüz göğünde yıldızlar görünür; deniz ve çatılar gündüz ışığında kalır. Birkaç sıçrama boyunca yıldızlar gökyüzünde aynı yerde durur, sonra görünüm kendiliğinden normale döner.

**Merak:** “Gökyüzü başka bir zamandan mı sızdı?” sorusunu cevaplamadan bırakır.

**Zıplama:** Gökyüzü ayrı dekor katmanıdır. Kuleler, kamera ve sıçrama aynı kalır.

**Maliyet:** Kod düşük-orta; mevcut gece/gökyüzü varlıkları kullanılabilirse görsel düşük.

**En büyük risk:** Etki mevcut gece-gündüz değişimiyle karıştırılabilir; oyuncunun fark edeceği kadar belirgin, ama dikkat dağıtmayacak kadar sınırlı olmalı.

### 5. Gölge önce iniyor

Bir zıplamada amcanın gölgesi ondan önce sonraki çatıda belirir. Amca normal şekilde inişini yapar; gölge ayaklarının altına geri döner.

**Merak:** Gölgenin geleceği görüp görmediğini düşündürür; açıklama vermeden sonraki karşılaşmalara ipucu bırakabilir.

**Zıplama:** Gölge dekoratif kalır; hedef, çarpışma veya iniş yardımı olarak kullanılmaz.

**Maliyet:** Kod küçük-orta; yeni görsel gerekmeyebilir.

**En büyük risk:** Gölge, oyuncu tarafından iniş işareti sanılırsa kontrol algısını değiştirir.

### 6. Ters İstanbul — cüretkâr

Bir nesneyi aldıktan sonra şehir birkaç saniyeliğine ters görünür: deniz yukarı, gökyüzü aşağı akar. Amca ve çatılar normal yönlerinde kalır; ardından sahne yerine oturur.

**Merak:** Oyuncu, gözünün gördüğü şeye güvenemediği kısa bir an yaşar.

**Zıplama:** Terslik yalnız arka plan katmanında uygulanır. Kontroller, karakter, kuleler ve kamera matematiği değişmez.

**Maliyet:** Kod orta; mevcut arka plan katmanları kullanılabilirse görsel düşük.

**En büyük risk:** Hızlı veya uzun bir dönüş rahatsız edebilir. Yazılar ve iniş yüzeyleri ters çevrilmemeli.

### 7. Vapurun penceresindeki ikinci amca

Uzakta geçen bir vapurun tek penceresinde amcanın silueti görünür. Birkaç kule sonra vapur yeniden geçer; bu kez pencerede siluet yoktur, sadece bırakılmış bir eşya vardır.

**Merak:** “O muydu, başka biri mi; vapur nereye gidiyor?” sorularını küçük ipuçlarıyla büyütür.

**Zıplama:** Olay uzak arka planda kalır; oynanabilir alana girmez.

**Maliyet:** Kod orta; uzak ölçekte bir siluet için görsel düşük.

**En büyük risk:** Oyuncu olayı kaçırabilir. Daha sık veya büyük gösterilirse de sıçrama odağını çalar.

### 8. Çatılardaki imkânsız adres

Bazı çatıların yanındaki küçük levhalarda kule numarası ileri gitmek yerine geriye sayar. Son levhada amcanın bulunduğu yerin adı görünür; bir sonraki karşılaşmada aynı levha “Daha gelmedin” der.

**Merak:** Şehir oyuncunun rotasını önceden biliyor gibi hissettirir; kısa metin, açıklamadan çok soru bırakır.

**Zıplama:** Levhalar cephe dekorudur, kule üstüne veya iniş alanına taşmaz.

**Maliyet:** Kod düşük-orta; tabela varlıkları gerekiyorsa görsel düşük.

**En büyük risk:** Küçük ekranda metin okunmazsa gizem çalışmaz; gerçek adres izlenimi de vermemeli.

## Editörlerin ortak değerlendirmesi

İki editör de **“başka bir İstanbul’a geçişi”** en güçlü yön olarak seçti. Bir görüş, aynı sıçramayla su altı Boğaz’ına geçişi; diğeri ise bilet gibi farklı bir nesnenin açtığı alternatif şehir manzarasını önerdi. Ortak tasarım ilkesi şu: oyuncu gerçekten “başka yere geldiğini” hissetsin, fakat bu his kule dizisinin veya sıçrama kontrolünün değişmesine bağlı olmasın.

Gölge ve ters şehir gibi fikirler daha ucuz prototiplenebilir; ancak merak uyandırma gücü ve paylaşılabilir tek kare potansiyeli bakımından ışınlanma fikrinin gerisinde kalıyor.

## Benim 1 numaram ve ilk deneme

**1 numaram: Başka İstanbul’a açılan kapı.** Kullanıcının ışınlanma fikrini ciddiye alıyor ve “orası neresi?” sorusunu doğrudan kuruyor. Ayrıca sahne değişimiyle sınırlanırsa kurukafanın mevcut iniş alanı etkisini tekrar etmez ve zıplamanın çekirdeğine dokunmaz.

**En küçük ilk sürüm:** Kurukafadan ayrı, seyrek görünen tek bir nesne seç. Toplandığında 3–5 saniye boyunca sadece fon rengini ve kıyı siluetini değiştir; tek bir belirgin anomali ekle, örneğin uzakta iki Kız Kulesi görünmesi. Kuleler, fizik, kamera ve puan aynı kalsın. Yeni görsel üretimine geçmeden önce mevcut sahne varlıklarıyla kaba bir ekran denemesinde şu iki şeyi değerlendir: Oyuncu bunun başka bir yer olduğunu anlıyor mu ve sonraki inişini hâlâ rahat okuyabiliyor mu?