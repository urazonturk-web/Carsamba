# Editör / Oyun Tasarımı Analizi — 2026-11-11

Kaynak: kontakt.jpg + kare-*.jpg (32 sn kayıt), config.ts (REFERENCE_TRIAL=true), procedural-course.ts, app/index.tsx (onLanding, Game Over kartı), dialog-mizah/. Fizik ve kamera dokunulmaz kabul edildi.

Kodda doğrulanan durum: ses kütüphanesi yok; yalnız `BEST` AsyncStorage'da. Görev, kozmetik, mod yok. `scorePerfectBonus: 0`. Popup sadece çoklu kule atlayışında `+N` gösteriyor. Merkez inişte yalnız hafif haptik ve parçacık var. Oyun sonu satırı tek ve sabit (`Havada emindin, yerde şaşkındın.`). İpucu İngilizce: "Hold to charge · Release to jump".

## 1. Çekirdek döngü

**Güçlü yanlar**
- Şarj-bırak hissi oturmuş, kullanıcı fiziği seviyor. Asıl sermaye bu.
- Çoklu kule atlama (`towersCrossed`) doğal bir risk/ödül kararı yaratıyor: "güvenli tek kule mi, açgözlü üçlü mü?"
- Arka plan (Galata, köprü, vapur, cumbalı cepheler) kimliği ilk karede veriyor.

**Zayıf yanlar**
- Çoklu atlamanın riski görünür, ödülü görünmez. `+4` popup'ı küçük ve sessiz geçiyor (kare 3'te zor seçiliyor).
- Perfect iniş puan getirmiyor; merkez şeridi neden var belli değil.
- Ses yok. Tek dokunuşlu oyunlarda ritim ve tatmini büyük ölçüde ses taşır.
- Ölüm kartı İngilizce ve diagnostik metin içeriyor. Espri satırı her turda aynı, üçüncü turda gürültüye dönüşüyor.
- Turlar arası hiçbir şey birikmiyor. "Bir el daha" yalnız BEST sayısına dayanıyor.

## 2. Neden oynasınlar? Dört kanca

**A. Çamaşır ipi kombosu.** Kuleler arasına gerili ipler çizilir (cephe sanatında zaten var). Tek zıplamada geçilen her ip havada "tıng" sesi çıkarır, ipteki çamaşırlar uçuşur. 3 ve üzeri ip bir "Mahalle Dedikodusu" yaratır: ekranda bir pencereden kısa bir laf çıkar ("Gördün mü Nermin, üç dam birden!"). Bu, çoklu atlamanın ödülünü görünür, işitilir ve paylaşılabilir yapar. Fizik değişmez, yalnız geri bildirim eklenir.

**B. Çarşamba pazarı ritmi.** Her 10 kulede bir "pazar tezgâhlı" çatı gelir. Burada merkeze konan iniş sayılır ve sesli tezgâh bağırışı duyulur ("Domates kilo yirmi!"). Peş peşe merkez inişler bağırışın perdesini ve fiyatı yükseltir. Perfect ritmi böylece puan çarpanı olarak geri döner: Perfect x2, x3. Bir hata zinciri bozar. Bu, merkez şeridine anlam kazandırır.

**C. Kedi mirası.** Çatılarda uyuyan sokak kedileri olur. Kedili kuleye merkez iniş yapınca kedi uyanıp karakteri takip eder ve arkasında bir kedi kuyruğu oluşur. Düşünce kediler dağılır, game over kartında "4 kedi seni izledi" yazar. Kedi sayısı ikinci bir skor ekseni olur. Turlar arasında toplanan kediler kalıcı bir "mahalle albümü" (koleksiyon) doldurur. Elde tutmanın çekirdeği budur.

**D. Vapur saati / günün ezanı.** Her gün tek bir "Günün Çarşambası" tohumu üretilir: herkes aynı kule dizisini oynar (procedural-course zaten tohumlu). Arka plandaki vapur bir zaman işaretçisi olur ve vapur iskeleye varmadan X kuleye ulaşmak günlük görevdir. Arkadaş bildirimi (`{arkadas} tam şarjla rekorunu geçti.`) bu günlük skora bağlanır. Herkes aynı haritayı oynadığı için sosyal kıyas adil olur.

## 3. İlk 10 saniye ve "bir el daha"

**İlk 10 saniye**
- İpucu Türkçeleşsin ve davranışa dönsün: ilk kulede bıyıklı karakterin üstünde basılı tutulan bir parmak animasyonu, şarj çubuğu dolarken "Tut... tut... bırak!" yazısı. Metin değil, gösterim.
- İlk üç kule (warmup) garanti başarı olsun. İlk düşüş en erken 4. kulede gelsin, oyuncu kaybetmeden önce bir kez "vay" desin.
- İlk çoklu atlama kasıtlı olarak kolay kurgulansın (warmup sonrası 2 yakın dar kule) ve büyük `+2` patlaması ile ödüllendirilsin. Böylece oyuncu riskin varlığını ilk tur öğrenir.

**"Bir el daha"**
- Ölümden Play Again'e en fazla 1 dokunuş ve 0,5 sn olsun. Kart tümüyle Türkçe olsun ("Bir Daha", "Rekor"), diagnostik satır kaldırılsın.
- Espri satırı havuza dönsün ve bağlama göre seçilsin: rekora 1–3 kala, ilk kulede ölüm, çoklu atlamada ölüm, yeni rekor. DIYALOG Ton A/C satırları hazır malzeme.
- "Rekora 3 kule kaldı" gibi yakın kaçış bilgisi Play Again düğmesinin hemen üstünde gösterilsin.
- Yeni rekorda havai fişek ve martı sürüsü çıksın, kart 0,4 sn gecikmeyle gelsin.

## 4. Önerilen revizyon sırası

| # | Ne | Neden | Doğrulama | Maliyet |
|---|---|---|---|---|
| 1 | Ses ve geri bildirim paketi: şarj tonu yükselen, iniş "tak", çoklu atlama "tıng-tıng", büyük `+N`. Türkçe, bağlamsal game over kartı. | En ucuz his kazancı, fiziğe dokunmaz. Mevcut döngüyü tatmin edici yapar. | Oturum başına tur sayısı. Ölüm→yeniden başlama süresi (<1,5 sn hedef). Test oyuncusu "sesli daha iyi" der mi (A/B). | Küçük |
| 2 | Pazar ritmi: Perfect çarpanı (kanca B) ve çamaşır ipi kombosu (kanca A). | Merkez şeridi ve çoklu atlama şu an anlamsız veya görünmez. Beceri tavanı açılır. | Ortalama skor varyansı artar mı. Perfect oranı turlar boyunca öğreniliyor mu. Çoklu atlama deneme oranı. | Orta |
| 3 | Günün Çarşambası tohumu ve kedi koleksiyonu (kanca C ve D), arkadaş bildirimine bağlı. | Turlar arası birikim ve ertesi gün geri dönme sebebi. | D1/D7 geri dönüş. Günlük haritaya katılım. Bildirim→açılış oranı. | Büyük |
