# MERAK2 · Tur 1 · Oyun tasarımı editörü

Teşhisim: "Kayıp Sefer" gözü değiştirdi, eli değiştirmedi. Oyuncu aynı genişlikteki aynı kulelere
aynı ritimle basıyordu. Bu kez her fikirde şu üçünden en az biri değişiyor: **neye indiğin**,
**bırakma anını neye göre seçtiğin**, **neyi kovaladığın**. Basılı tut, bırak, yay ve iniş hissi her fikirde aynı kalıyor.

Koddan dayanak: iniş testi düz bir yüzey listesine bakıyor (`findFootLanding`, `landing.ts`).
Kurukafa bu listeyi zaten her karede değiştiriyor (`scaledPlatforms`). Yani "yüzeyler kımıldasın,
başka bir şey olsun" fikri motorun mantığına aykırı değil. Havada alınan nesne (`skullTouches`) ve
tohumla sabit rastgelelik (`skullHash`) hazır, ışınlanma tetiği buradan çıkabilir.

---

## 1. SARNIÇ: kurukafanın kardeşi gerçekten aşağıya götürür (cüretkâr)
- **Yaşanan:** Havada paslı, kocaman bir **anahtar** dönüyor. Değince ses kesiliyor, amca bir sonraki
  çatıya indiği anda çatı kapağı açılıyor ve aşağı düşüyor. Ekran kararıp aydınlandığında yer altında, suyun
  içinden yükselen sütunların başlıklarındasın. Su damlıyor, sesler yankılanıyor, en önemlisi **tepede tavan var**:
  tam basarsan kafanı taşa vurup dik düşüyorsun. 10–12 sütun boyunca kısa, alçak ve hassas zıplıyorsun.
  Sonda yukarıdan bir ışık huzmesi iniyor. Ona girince **bir durak ileride** gün ışığına çıkıyorsun.
- **Neden farklı:** El hissi gerçekten değişiyor. Yukarıda "ne kadar uzun basarsam o kadar iyi" diye oynanıyor,
  aşağıda ise kısa ve ölçülü basmak gerekiyor. Aynı kontrolle bambaşka bir dikkat istiyor.
- **Merak/paylaşma:** "Anahtarı aldım, yerin altına düştüm!" Herkes bir kez görmek istiyor, anahtar da nadir çıkıyor.
  Kısa yol olduğu için gerçek bir ödülü var: sırf görüntü değil, sefer ilerliyor.
- **Kontrol:** Aynı. Kuvvet ve yay formülleri değişmiyor. Yalnız tavana çarpma kuralı ekleniyor.
- **Çekirdek:** EVET. (a) Tavan çarpışması yeni bir fizik kuralı (`advanceFlight` sonrası `vy` ters çevriliyor).
  (b) Bölüm boyunca kule üretimi ayrı parametrelerle çalışıyor: kısa aralık, az yükseklik farkı, dar/orta sütun.
  (c) Durak atlama ilerlemeyi ve puanı etkiliyor (kule kimliği +15 mi olacak, ayrı sayaç mı?).
  (d) Kamera, alçak tavan için dikey sabitleniyor.
- **Maliyet:** Orta. Kıvılcım'dan 3–4 görsel (sütun başlığı, sarnıç arka planı, su/yansıma, anahtar, ışık huzmesi).
  Kodda bölüm durumu, giriş/çıkış geçişi ve tavan kuralı gerekiyor: 3–4 gün.
- **En büyük risk:** Tavan olunca bazı aralıklar geçilemez hâle gelebilir. Sarnıç üretimi için ayrı bir
  erişilebilirlik kanıtı lazım (physics-evidence ile tavanlı uçuş süresi hesabı).

## 2. Balıkçı kayıkları: inip kalkan yüzeyler (cüretkâr)
- **Yaşanan:** Köprü ayağından sonra kuleler bitiyor ve sahile yanaşmış kayıklar, şamandıralar, mendirek taşları başlıyor.
  Hepsi dalgayla yavaşça inip kalkıyor, hafifçe yana kayıyor. Hedef kayık dalganın tepesine çıkarken bırakırsan
  yakın, çukura inerken bırakırsan uzak düşüyor. Islak bir "çlap" sesiyle iniyorsun, amca bir an sendeliyor.
- **Neden farklı:** Bırakma anı artık yalnız "ne kadar" sorusu değil, "ne zaman" sorusu da oluyor.
  Ritim oyunu gibi bir zamanlama katmanı ekleniyor.
- **Merak/paylaşma:** Aynı haritada iki arkadaş aynı dalga fazını görüyor (tohumla sabit), meydan okumada konuşulacak bir şey çıkıyor.
- **Kontrol:** Aynı. Üstünde dururken yüzeyle birlikte inip kalkıyorsun.
- **Çekirdek:** EVET. Yüzeylerin `topY`/`x` değerleri zamanla değişiyor. İniş testi o anki listeye bakmalı.
  Erişilebilirlik en kötü dalga fazına göre hesaplanmalı (`generateProceduralPlatform` sınırları). Ayakta dururken amca yüzeyi izlemeli.
- **Maliyet:** Orta. 3 yüzey görseli ve su şeridi gerekiyor. Kodda sinüs hareketi ve en kötü durum erişim kanıtı: 2–3 gün.
- **En büyük risk:** Haksızlık hissi ("tam bastım, kayık kaçtı"). Genlik küçük (±25–40 birim) ve yavaş (2–3 sn) tutulmalı.

## 3. Ters çatı: amca suyun yansımasında baş aşağı (cüretkâr)
- **Yaşanan:** Gece Boğaz kıyısında havada bir ay yansıması parlıyor. Değince kamera ters dönüyor ve amca
  denizdeki yansıma şehrinde, çatılar aşağı sarkarken baş aşağı zıplamaya devam ediyor. Yukarı çıkan kule
  aşağı iniyor gibi görünüyor ve beyin yeniden ayar yapmak zorunda kalıyor. 8 zıplama sonra dalga yansımayı bozuyor ve dünya düzeliyor.
- **Neden farklı:** Fizik aynı kalsa bile göz–el eşlemesi bozuluyor. Oyuncu ilk iki zıplamada gerçekten zorlanıyor, gülüyor.
- **Merak/paylaşma:** "Şuna bak, ters döndü!" Videoya en iyi giren an bu.
- **Kontrol:** Aynı. Yalnız çizim aynalanıyor.
- **Çekirdek:** Kamera EVET (dikey ayna dönüşümü, yazıların ve arayüzün ters dönmemesi). Fizik HAYIR.
- **Maliyet:** Düşük–orta. Kamera dönüşümü ve geçiş efekti 1–2 gün. Görsel neredeyse yok (yansıma tonu).
- **En büyük risk:** "Yine yalnız görünüş" diye okunabilir. Ama el hissini değiştiren bir görünüş, kaplama değil.
  Mide bulandırmasın diye dönüş yumuşak olmalı ve bölüm kısa kalmalı.

## 4. Karga simidimi kaptı: hedef değişiyor
- **Yaşanan:** Durakta çay–simit anında bir karga simidi kapıp önden uçuyor ve 2–4 kule ileriye konuyor.
  Oraya inmeden karga kalkıp tekrar kaçıyor. Kargaya havada değersen (kurukafa gibi) simit geri geliyor ve
  "oh be" anı oluyor. Kaçırırsan karga bir sonraki durakta simidi yiyor.
- **Neden farklı:** Bu sefer kuleyi değil bir canlıyı kovalıyorsun. Kısa ve kolay zıplamalar yerine bilerek uzun, riskli atışlar yapıyorsun.
- **Merak/paylaşma:** Komik, karakterli bir kovalamaca. Amcanın hikâyesine iyi oturuyor.
- **Kontrol:** Aynı.
- **Çekirdek:** HAYIR. Kurukafanın dokunma koduyla karga görselleri yeterli. Ödülü (simit = puan mı, kartpostal mı?) kullanıcı seçer.
- **Maliyet:** Düşük. Kargada uçuş karesi var, simitli bir kare eklenecek: 1 gün.
- **En büyük risk:** Küçük kalabilir ve "fark etmedim" denebilir. Sesle ve amcanın tepkisiyle iyi duyurulmalı.

## 5. Çamaşır ipi sokağı: esneyen yüzey
- **Yaşanan:** Dar bir sokakta iki çatı arasında çamaşır ipleri gerili. İpe inince ip aşağı esniyor ve seni
  hafifçe sektiriyor. Ama sekme bir sonraki zıplamaya eklenmiyor, yalnız iniş anını yumuşatıyor ve uzatıyor.
  Mandallı çarşaflar görüşü yer yer kapatıyor.
- **Neden farklı:** İlk kez sert taş yerine yumuşak, yaylı bir yüzeye iniyorsun ve bu elde hissediliyor.
- **Merak/paylaşma:** Orta. Mahalle dokusunu en iyi anlatan fikir.
- **Kontrol:** Aynı, ama iniş tepkisi farklı.
- **Çekirdek:** EVET. İnişten sonra kısa bir yaylanma süresi var, bu sırada şarja başlanabilsin mi? İniş tespiti ipin sarkmış çizgisine göre yapılmalı.
- **Maliyet:** Orta. İp ve çarşaf görseli gerekiyor, sarkma çizimi: 2 gün.
- **En büyük risk:** Sekme kontrolü ele geçirmiş gibi hissettirebilir. Bu yüzden yalnız çizimde kalmalı ve fiziğe eklenmemeli.

## 6. Lodos köprüsü: rüzgâr gerçekten itiyor
- **Yaşanan:** Gerçek İstanbul havasında lodos varsa, köprü üstündeki kulelerde bayraklar ve martılar rüzgârı gösteriyor.
  Uçuşta hafif bir yan itme oluyor: arkadan eserse uzağa, önden eserse kısaya düşüyorsun. Bugün lodos yoksa köprü sakin.
- **Neden farklı:** Aynı bırakma, hava durumuna göre farklı yere düşürüyor. "Bugün köprü zordu" diye konuşuluyor.
- **Merak/paylaşma:** Gerçek hava zaten var, ona oyun içi bir sonuç kazandırıyor.
- **Kontrol:** Aynı.
- **Çekirdek:** EVET. Uçuşta `vx` değişiyor ve erişilebilirlik payı (`reachReserve`) en kötü rüzgâra göre hesaplanmalı.
  Meydan okumada iki oyuncu farklı hava görebilir, eşitlik bozulur.
- **Maliyet:** Düşük–orta: 1–2 gün.
- **En büyük risk:** Haksızlık ve meydan okuma eşitsizliği. Çözüm: meydan okumada rüzgâr haritanın tohumundan gelsin.

## 7. Düşünce bitmiyor, bir kereliğine: Boğaz'ın dibi (cüretkâr, kurala dokunur)
- **Yaşanan:** Koşu başına bir kez, suya düşünce sonuç kartı gelmiyor. Amca suyun içinde kabarcıklar arasından
  süzülürken bir balıkçı ağı onu yakalayıp Sarnıç'a (fikir 1) ya da kıyıdaki bir kayığa bırakıyor. Oradan devam ediyorsun.
- **Neden farklı:** Düşüş ilk kez bir "kapı" oluyor. Oyuncu ölmeyi beklerken başka bir yerde uyanıyor.
- **Merak/paylaşma:** Çok yüksek. Bunu kimse beklemiyor, ilk kez gören mutlaka gösteriyor.
- **Kontrol:** Aynı.
- **Çekirdek:** EVET: oyun sonu akışı, skor, meydan okuma ve rekor kuralları ("ikinci can" sayılır mı?) değişiyor.
- **Maliyet:** Düşük, fikir 1 varsa. Yoksa orta.
- **En büyük risk:** Oyunun "düşersen baştan" kimliği yumuşar. Bu yüzden yalnız ilk düşüşte, ve yalnız ilk durağı geçtiysen olmalı.

---

## Benim 1 numaram: SARNIÇ (fikir 1), ilerisi için fikir 7 ile bağlanabilir
Neden: Kullanıcının cümlesine harfiyen uyuyor ("havada başka bir nesne alınca bir yere ışınlanıp farklı
bir yerde zıplamaya devam"). Işınlanma gerçekten başka bir parkura götürüyor ve o parkur elde başka
hissettiriyor (tavan, kısa ve hassas atış). Dönüşte de bir durak ilerletiyor, yani ödülü var. Kurukafanın
yerleşim ve dokunma altyapısını olduğu gibi kullanıyor. Yasak yönlerin hiçbirine girmiyor: jeton yok,
eski zaman kaplaması yok, aynı kuleler yok.

### En küçük deneme (yarım günlük test yapısı, `SARNIC_TEST = true`, teslimde false)
1. Anahtar görseli yok: kurukafa görseli mavi tonlu kullanılıyor. 6. kuleden sonra her zaman çıkıyor.
2. Değince, bir sonraki inişte ekran 300 ms siyaha geçiyor. Kule listesi temizlenip amca tek bir "giriş sütununa" konuyor.
3. Sarnıç üretimi aynı `generateProceduralPlatform` ile yapılıyor, yalnız `gapMax` 200, `hv` 60 ve ağırlıklar dar/orta olacak şekilde.
   Arka plan düz koyu yeşil-mavi, kulelerin rengi koyulaştırılmış. Görsel üretilmiyor.
4. Tavan sabit bir dünya y değerinde: kafa geçerse `vy = abs(vy) * 0.3` ve "tok" sesi.
5. 10 sütundan sonra ekran beyaza geçiyor ve oyun normal kulelerle, kule sayacı +15 olarak devam ediyor.
6. Kanıt: physics-evidence ile tavanlı bölümde her aralığın erişilebilir olduğu gösterilecek. Sonra simülatörde kayıt alınacak.
   Kullanıcıya tek soru sorulacak: "aşağıdaki el hissi farklı geldi mi?" Evet derse görseller Kıvılcım'a gidecek.
