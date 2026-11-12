# Editör / Oyun Tasarımı — YOL-2026-11-12

Kodda doğrulanan: tek kalıcı veri `BEST` (`jumpcharge.bestScore.reference.v1`). `REFERENCE_TRIAL=true` ve `scorePerfectBonus: 0`. `initWorld(seed?)` sabit tohumu zaten kabul ediyor, yani aynı haritayı herkese oynatmak hazır. İpucu balonu Türkçe ("Basılı tut… bırak, zıpla!").

## 1. En büyük eksik
- **Beceri ekseni tek: mesafe.** Merkeze iniş puan getirmiyor (0). Bu yüzden şarjı ince ayarlamanın tek ödülü hayatta kalmak. Faz 1-2 hissi (ses, toz, ifade, gaz) çok güçlendirdi ama oyuncunun "daha iyi oynama" hedefi hâlâ yalnızca "daha uzağa gitmek".
- **Turlar arasında hiçbir şey birikmiyor.** Rekor dışında oyuncuyu ertesi gün geri çağıran bir şey yok. Bugünkü cila 2. oturumu kazandırır, D1 geri dönüşünü kazandırmaz.

## 2. Sonraki 3 adım (sıralı)
| # | Ne | Neden şimdi | Boyut | Onay / maliyet | Risk |
|---|---|---|---|---|---|
| 1 | **Merkez ritmi:** merkez iniş +1, ardışık merkez inişlerde çarpan ×2/×3 (en fazla ×3), ıska zinciri sıfırlar. Mevcut "tıng" sesine perde artışı ve küçük "Tam isabet ×2" yazısı eklenir. Yeni görsel yok. | Faz 2'nin ses ve geri bildirim altyapısı hazır. Yalnız skor kuralı ve popup değişiyor, fizik değişmiyor. Açık konu 3'ü kapatır. | Küçük | Görsel/kredi gerekmez. Yalnız kullanıcının telefonda "tamam" demesi gerekir. | Rekorlar karşılaştırılamaz hale gelir. Gerekirse yeni rekor anahtarı (`.v2`) açılır. Yakın kulelerde merkez fazla kolaysa skor şişer; ilk sürüm gözlemle ayarlanır. |
| 2 | **Semt yolculuğu (Faz 3 kancası, görselsiz sürüm):** her 15 kulede bir "Karaköy → Eminönü → Fatih (Çarşamba)…" semt geçişi. Ekranda semt adı bandı ve kısa ses olur, sonuç kartında "En uzak semt: Eminönü" yazar. Mevcut 12 cephe semtlere renk/sıra ile dağıtılır. | Rekor sayısını yerine somut bir hedefe çevirir ("Fatih'e ulaşamadım"). Ana menü olmadan ilerleme hissi verir. Kalıcı olarak en uzak semt saklanır. | Orta | İlk sürüm görsel üretmeden yapılır. Semte özel arka plan, Açık konu 2 (A/B, 3 çağrı) ile birleştirilir ve ayrı onaya gider. | Semt bandı oyun akışını bölmemeli. Yalnız üstte 1,2 sn görünür, dokunuşu engellemez. Performans: tek Text/Animated, gölge yok. |
| 3 | **Günün Çarşambası:** günün tarihinden üretilen sabit tohum, menüde "Günün haritası" ve ayrı günlük rekor. Ses kapatma düğmesi de aynı küçük ekrana konur. | `initWorld(seed)` hazır, sunucu gerekmez. Ertesi gün açma sebebi yaratır. Kupa ve sosyal kıyasın temelidir. | Orta | Sunucu/hesap gerekmez. Bildirim istenirse ayrı izin ve onay gerekir. | Aynı tohum ilk 3 kulede ölümcül çıkabilir. Warmup kuralı günlük haritada da geçerli olmalı. |

"Vapura atla" anı, 2. adımın içinde Eminönü geçişinin özel kulesi olarak sonra gelir (çarpışma/kamera özel durumu gerektirdiği için fizik riski taşır).

## 3. Yapılmaması / ertelenmesi gereken
- **Çarşamba Kupası, liderlik tablosu, hesap:** sunucu, gizlilik ve moderasyon yükü getirir. Önce 3. adımdaki yerel günlük harita "insanlar geri geliyor mu" sorusunu yanıtlamalı.
- **Kedi koleksiyonu ve kozmetik mağazası:** yeni görsel seti ve ekonomi tasarımı ister. Semt yolculuğu tek bir ilerleme ekseni kurmadan ikinci eksen açmak dağıtır.
- **Yeni şaka katmanları (laf balonu, espri satırı geri dönüşü):** kullanıcı esprileri reddetti. Gaz şakası tek mizah imzası olarak kalsın, üstüne eklenmesin.

## 4. Kullanıcıya sorulacak kararlar (en fazla 2)
1. **Merkez inişe puan verelim mi?** (Evet → 1. adım, rekor sıfırlanır/yeni rekor sayacı. Hayır → yalnız ses/ışık ödülü kalır.)
2. **İlerleme ekseni semt yolculuğu mu olsun?** (Evet → 2. adım görselsiz başlar, arka plan A/B sonra semte bağlanır. Hayır → önce Günün Çarşambası.)
