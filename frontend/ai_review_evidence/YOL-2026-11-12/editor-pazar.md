# Editör / Pazar ve Yayın — YOL-2026-11-12

Kaynak: brief, 11 Kasım pazar raporu, OSURUK raporu, `app.json`, `src/game/sfx.ts`. Web araması yapılmadı. Apple kuralları bilgime dayanıyor; emin olmadığım yerleri belirttim.

## 1. En büyük eksik

1. **Oyunu kendinden başka kimse oynayamıyor.** TestFlight yok, imza profili ~17 Kasım'da bitiyor. `app.json` içinde ad ve slug hâlâ `"frontend"`, yani telefonda simgenin altında "frontend" yazıyor. Dışarıdan tek bir oyuncu tepkisi alınmadı. "Sesler makul", "takılma yok" gibi kararların hepsi tek kişinin zevkine dayanıyor. Osuruk şakası, 1,4× karakter ve merkez puanının 0 olması, yabancı birinin elinde ilk kez sınanacak.
2. **Paylaşım anı ve geri dönme nedeni yok.** Sonuç kartında paylaş düğmesi yok, hedef ya da ilerleme de yok (yalnız skor ve rekor). Osuruk izi kısa video için iyi bir malzeme, ama oyun bu klibi üretmeye yardım etmiyor.

## 2. Sonraki 3 adım (sıralı)

| # | Ne | Neden şimdi | Boyut | Onay / maliyet | Risk |
|---|---|---|---|---|---|
| 1 | **Yayın kimliği ve kapalı beta.** Görünen adı "Çarşamba" yap, gerekirse bundle ID'yi kesinleştir. Faz 2'yi commit et (iCloud kopyalarını temizle). Apple Developer Program hesabıyla TestFlight'a dahili derleme yükle. Gerekirse 5–10 kişilik harici beta aç. | Profil 17 Kasım'da bitiyor, nasılsa yeniden derleme gerekecek. Faz 3'ün büyük işine girmeden önce gerçek oyuncu verisi lazım. | Küçük–orta | Ücretli geliştirici hesabı (yıllık 99 $, hesap yoksa). Push ve yükleme için ayrı ayrı onay. Harici beta için Apple beta incelemesi gerekir. | Harici incelemede yaş anketi ve gizlilik etiketi soruluyor (bkz. 3. adım). |
| 2 | **Beta için asgari "kabuk".** Ayarlarda tek bir ses düğmesi (sessiz düğmesine zaten uyuyor: `playsInSilentMode: false`). Sonuç kartında iOS paylaşım menüsüyle skoru paylaşma. Basit ilk oyun yönlendirmesi. Betacılara 3 soru: "Kaç tur oynadın? Gaz seni güldürdü mü, rahatsız etti mi? Arkadaşına atar mısın?" | Beta geri bildirimi bu üç şeye bağlı. Ses kapatılamazsa vapurda ilk silme nedeni bu olur. | Küçük | Kod işi. Yeni görsel gerekmiyor. | Paylaşım görseli için ekran görüntüsü alma (view-shot) iOS'ta performansı yemesin, yalnız sonuç kartında çalışsın. |
| 3 | **Mağaza dosyası taslağı (yayınlamadan).** Ad 30 karakter sınırına uymalı: **"Çarşamba: İstanbul Rooftop Jump" 31 karakter, sığmıyor.** Öneri: ad "Çarşamba: Rooftop Jump", alt başlık "İstanbul çatılarında zıpla" ya da "Tut. Bırak. Vapura atla." Yaş anketinde "Crude Humor: seyrek/hafif" diye dürüst beyan ver. Eski sistemde bu 9+ çıkarıyordu; yeni basamaklarda sonucu anket gösterecek, emin değilim. Gizlilik etiketi: veri toplanmıyorsa "Data Not Collected". Osuruk sesinin Pixabay lisans kaydını depoya koy. | Beta formunda da isteniyor. Adın şimdiden belli olması hem ikon/ekran görüntüsü işini hem paylaşım metnini netleştiriyor. | Küçük | Yalnız metin; gönderim ayrıca onaylanır. | Dördüncü madde olarak, gelecekte analitik ya da reklam SDK'sı eklenirse etiketin değişmesi gerekir. |

Bunlardan sonra Faz 3 sırası değişmez: vapura atla, sonra semt yolculuğu. Yalnız öncelik beta verisine göre ayarlanır (örneğin ortalama tur 20 saniyenin altındaysa önce hedef/ilerleme).

## 3. Yapılmaması / ertelenmesi gerekenler

- **Çarşamba Kupası, hesap, sunucu, reklam, uygulama içi satın alma:** Ertele. Sunucu ve hesap eklemek gizlilik beyanını ağırlaştırır. Hesap açılınca hesap silme zorunluluğu gelir, reklam SDK'sı da yaş derecesini ve izin metinlerini etkiler. Elde ölçülmüş tek bir oyuncu bile yokken gelir modeli konuşmak erken. Şimdilik ücretsiz ve reklamsız kalsın.
- **Arka plan A/B görsel çağrıları:** Beta sonrasına bırakılsın. Kredi harcıyor, oysa mağaza görselinin asıl yükünü karakter ve vapur anı taşıyacak.
- **Osuruk sesini ilk ekran görüntüsüne ya da ikona koyma.** Kullanıcı kararı gereği her zıplayışta kalabilir. Ama mağazanın vitrini Galata ve amca olsun. Gaz, sosyal klibin malzemesi olarak kalsın.

## 4. Kullanıcıya sorulacak kararlar (en fazla 2)

1. **Ücretli Apple Developer hesabı açılsın mı (ya da var mı), ve TestFlight betası 17 Kasım'dan önce başlasın mı?** (Önerim: evet, önce dahili, sonra 5–10 kişi.)
2. **Mağaza adı:** "Çarşamba: Rooftop Jump" ve alt başlıkta İstanbul olsun mu, yoksa adda İstanbul kalsın ve "Çarşamba: İstanbul Jump" mı olsun? (Önerim: birincisi.)
