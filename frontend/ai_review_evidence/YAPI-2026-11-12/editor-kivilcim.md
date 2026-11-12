# YAPI-2026-11-12 — Kıvılcım'ın bağımsız koordinatör görüşü

**Kaynak:** `ai_review_evidence/YAPI-2026-11-12/brief.md` ve mevcut oyun durumu. Diğer editör raporları okunmadı. Aşağıdakiler ürün hipotezidir; oyuncu testiyle doğrulanmalıdır.

## 1. Yapı kararı: duraklı sonsuz koşu

**Melez öneriyorum:** Temel oyun kesintisiz ve sonsuz kalsın; yaklaşık **her 10–15 kolonda bir durak** kısa yolculuk kilometre taşı olsun. İlk prototipte 12 kolon seçip telefon testinde ayarlayın. Durak bir bölüm sonu veya yükleme ekranı olmasın: semt adı, kısa vapur düdüğü ve küçük “Durak 1/2/3” işareti en fazla ~1 saniye belirip oyun aksın. Rekor yanında “en uzak durak” yerel olarak saklansın. Durağa varış **otomatik kayıt noktası veya can hakkı vermesin**; düşen oyuncu aynı kurallarla baştan başlar. Böylece rekor karşılaştırması adil kalır ve varışın değeri olur. Uzun yolculuk yorarsa sonradan ayrı **antrenman başlangıcı** açılabilir; oradan alınan skor ana rekorla karışmaz. Etap seçimi ve her durakta durup menü açılması şu aşamada gereksiz karmaşıklık.

## 2. Zorluk eğrisi

Fizik değişmeden yalnız **erişilebilir platform geometrisinin dağılımı** kademeli değişsin: ilk durakta geniş/orta kule ve az yükseklik farkı; sonraki duraklarda dar kule oranı ve güvenli ama daha uzun aralıklar azar azar artsın. Çoklu kule atlama fırsatı tamamen kaybolmasın; amcanın gaz iziyle “büyük atlayış” mizahı oradan geliyor. Her üretilen aralık mevcut tam/kısa şarj erişim sınırlarına karşı otomatik test edilmeli; “zor” ile “imkânsız” ayrılmalı. Zorluk artışı **her durakta tek parametreyle** yapılsın ki telefon videosunda nedeni anlaşılabilsin. Gün tonu/arka plan değişimi görsel ilerleme sinyalidir, fiziksel zorluk değildir. Hareketli çatı, rüzgâr, kaygan yüzey veya şarj/fizik değişimi şimdilik eklenmesin; mevcut hassas ritmi ve performans ölçümünü bozar.

## 3. En fazla altı özellik fikri

| Fikir | Oyuncunun tekrar oynama nedeni | Boyut / yeni görsel | Risk |
|---|---|---|---|
| **Durak ve en uzak durak kaydı** | “Bir sonraki semte varayım” şeklinde skor dışı kısa hedef. | Küçük–orta / **0 çağrı**, metin ve mevcut arayüz. | Semt adlarının çok sık çıkıp oyunu bölmesi. |
| **Durakta gün ışığı bir adım değişsin** | Aynı çatı oyunu yolculuk gibi hissettirir; sonraki durak görüntüsü merak edilir. | Orta / ilk prototip **0 çağrı** (hafif renk ayarı); nihai katmanlar ayrıca onaylı üretim ister. | Hedef çatı kontrastını ve FPS'i düşürmesi. |
| **Son varış: iskele/vapur anı** | İlk 3–4 durağı tamamlamak için somut bir sahne/başarı; sonra sonsuz koşu devam eder. | Orta / ilk maket mevcut vapurla **0 çağrı**, özgün varlık istenirse ayrı onay. | Vapurun gerçek platform gibi okunması veya fizik değiştirme baskısı. |
| **Günlük aynı rota** (`initWorld(seed)`) | Herkes aynı çatı dizisini tekrar deneyebilir; hesap/sunucu olmadan “bugün nereye kadar?” hedefi. | Küçük–orta / **0 çağrı**. | Tarih/saat ve sürüm değişiminde rotanın tutarsızlaşması; rekor ayrı tutulmalı. |
| **Çatı üstünde seyrek İstanbul ayrıntısı** (kedi, saksı, çamaşır) | Her turda küçük keşif; İstanbul kimliği güçlenir. | Orta / mevcut varlıklarla **0 çağrı** deneme; yenisi için ayrı onay. | İniş yüzeyini örtmesi, performans. |
| **Büyük atlayış hatırası** | 2+ kule geçişlerinde gaz izi ve mevcut +N anı kısa “bu turdaki en uzun sıçrayış” kaydına dönüşür. | Küçük / **0 çağrı**. | Sayı/emoji kalabalığı; ekstra puan kuralı eklenmemeli. |

## 4. İlk iki deneme

**Önce durak + en uzak durak kaydı:** Oyunun neden tekrar açılacağını en düşük maliyetle sınar. **İkinci olarak durakta hafif gün ışığı ilerlemesi:** oyuncunun gerçekten yol aldığını, yeni sanat üretmeden görünür kılar. İkisini ayrı bayraklarla ve aynı telefon koşusunda kapalı/açık karşılaştırın; hedef okunurluğu ve takılma değişmesin. Beğenilirse iskele ve günlük rota sonraki karar olur.

## 5. Şimdilik yapmayın

**Zorunlu bölümler, can/enerji sistemi ve kayıt noktasından ana rekor** eklemeyin: tek dokunuşlu hızlı yeniden deneme döngüsünü ağırlaştırır, skorları kıyaslanamaz yapar. **Hareketli engel/rüzgâr ve çevrimiçi kupa** da ertelensin: fizik/performans ve sunucu-hesap gereksinimi açar. Önce durakların gerçekten oynama isteği yaratıp yaratmadığını telefonda gözleyin.

Bu raporla kod/görsel üretilmedi, kredi harcanmadı. Kullanıcının kabul etmediği yeni görsel oyuna bağlanmamalı.
