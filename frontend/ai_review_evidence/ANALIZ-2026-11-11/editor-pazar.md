# Editör / Pazar Analizi — 2026-11-11

Malzeme: kontakt.jpg, kare-3/15/27, dialog-mizah/ (iki dosya). Web araması yapılmadı.

## 1. Hedef oyuncu

- **"Sıra bekleyen" Türk, 18–35:** Vapurda, metrobüste, kuyrukta 30 saniyelik tur arar. Spring Ninja tarzı oyunları bilir, ama hiçbirinde kendini görmez. İndirme nedeni: "Bu bizim oyunumuz."
- **Gurbetçi / İstanbul sevdalısı:** Yurt dışında yaşayan Türk ya da İstanbul'u gezmiş yabancı. Boğaz, Galata ve vapur onlar için nostalji ya da kartpostal. Mağaza görseline tıklama nedeni: manzara.

## 2. İlk 3 saniye — dürüst izlenim

- **Arka plan güzel ama kartpostal gibi.** Kırmızı kiremit, yeşil panjur, saksı çiçekleri İstanbul'dan çok Lizbon ya da Liguria'yı andırıyor. İstanbul'u gösteren tek şey uzaktaki Galata, köprü ve vapur. Kuleler "herhangi bir Akdeniz kasabası." Kilim ve çamaşır ipi doğru detaylar, ama küçük kalıyor.
- **Karakter ekranın yaklaşık %4'ü.** Bıyık ve yelek, oyunun en özgün varlığı. Ama ekranda okunmuyor, ifadesi değişmiyor ve mağaza ekran görüntüsünde kayboluyor.
- **Nereye ineceğim belli değil.** Kule tepeleri ile arkadaki çatılar aynı renkte ve aynı dokuda. Oynanış alanı sahneden ayrışmıyor.
- **Arayüz jenerik.** Gri "Game Over" kartı ve "Play Again" düğmesi iOS'un varsayılan görünümünde. Sonuç kartında hâlâ debug satırı ("R068 ucus 911 kare…") ve "G018 KONTUR" etiketi duruyor. "+4" yazısı köprünün üstünde neredeyse görünmüyor.
- **Özet:** Görsel kalite ortalamanın üstünde, kimlik ise ortalamanın altında. Bu oyun "güzel bir zıplama oyunu" olarak görülüyor, "İstanbul oyunu" olarak değil.

## 3. Neden oynasınlar — 4 cevap

1. **Paylaşılabilir an: "Vapura atla."** Ara sıra Boğaz'dan geçen bir vapur, kuleler arasında hareketli bir platform olsun. Üstüne inmek bonus puan ve "Vapuru yakaladın!" yazısı getirsin. Kaçırınca da "Vapur kaçtı, simit kaldı." Herkesin yaşadığı bir an, 5 saniyelik klip olmaya çok uygun.
2. **Kimlik/nostalji: semt ilerlemesi.** Skor arttıkça semt değişsin: Balat (renkli evler) → Galata → Karaköy → Kadıköy → Boğaz yalıları. Mevcut arka plan zaten bu sırayla kayabilir. "Kadıköy'e kadar gittim" demek, "43 puan" demekten daha çok paylaşılır.
3. **Sosyal rekabet: Çarşamba ritüeli.** Haftalık tablo her çarşamba sıfırlansın ve "Çarşamba Kupası" adını alsın. Onaylı bildirim metni ("{arkadaş} tam şarjla rekorunu geçti.") burada çalışır. Geri dönme nedeni: haftalık bir randevu.
4. **Mizah: düşüş kartı.** Onaylı "Havada emindin, yerde şaşkındın." satırı iyi. Ama tek satır üçüncü turda eskir; 8–12 satırlık bir havuz gerekiyor. Ton C taslakları ("Düştün. Zaten bekliyordun.") paylaşılabilirliğe en uygun olanlar. Kart, skor + semt + espri satırıyla tek dokunuşta Instagram/WhatsApp hikâyesi olarak paylaşılsın. Görsel olarak da karakter bıyığını düzelterek ayağa kalksın.

## 4. Dil, isim, mağaza

- **"Çarşamba" adı** Türk kulağına gizemli ve komik geliyor: Çarşamba pazarı, "çarşamba karısı", haftanın ortası. Yabancı için okunmaz ve aranmaz. Öneri: mağaza adı **"Çarşamba: İstanbul Rooftop Jump"**. Ç harfi kimlik olarak kalsın, alt başlık aranabilirliği sağlasın.
- **Dil:** Cihaz diline göre iki dilli olsun. Türkçede arayüz tamamen Türkçe olmalı ("Tekrar", "Basılı tut, bırak"). Şu anki İngilizce düğme ile Türkçe espri karışımı yarım iş gibi duruyor. İngilizcede espri satırları çevrilmesin, uyarlansın. Ya da Türkçe satır küçük bir altyazıyla kalsın; bu da ayrı bir "otantik" çekicilik yaratır.
- **İlk ekran görüntüsü:** Karakteri büyük göster (yakın plan, havada, arkasında Galata), üstüne tek cümle yaz: "Tut. Bırak. Vapura atla."

## 5. Önerilen 3 revizyon

| # | Ne | Neden | Maliyet |
|---|---|---|---|
| 1 | Debug satırını ve "G018 KONTUR" etiketini kaldır. Sonuç kartını Türkçe ve markalı yap (çini/kilim çerçeve, büyük skor, espri havuzu, paylaş düğmesi). | Sonuç kartı en çok ekran görüntüsü alınan yer; şu an jenerik ve yarım görünüyor. | Küçük |
| 2 | Karakteri büyüt (~1.5x) ve iniş/düşüş/şarj pozları ekle. Kule tepelerini arka plandan ayır (kontrast şeridi ya da kontur). | Kimliğin taşıyıcısı karakter; okunurluk da hem mağaza görselini hem oynanışı iyileştirir. | Orta |
| 3 | Vapur platformu + semt ilerlemesi. | Oyunu Spring Ninja'dan ayıran, hem klip hem "nereye kadar gittin" sohbeti üreten özellik. | Büyük (vapur önce, semtler sonra yapılabilir) |

**Fark cümlesi:** Spring Ninja'nın soyut kulelerine karşı Çarşamba'nın vaadi şu olmalı: **"Her zıplayış bir İstanbul anı."** Zıplama hissi zaten iyi; eksik olan, o hissin bir yere ve bir hikâyeye bağlanması.
