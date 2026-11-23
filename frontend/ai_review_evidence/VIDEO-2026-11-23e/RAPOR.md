# VIDEO 14:39 — oyun başında havada kalan osuruk dumanı (2026-11-23)

Gözlem (video): 11. ve 50. saniyede yeni oyun başlarken solda önceki oyundan kalan yeşil duman bulutları duruyor.
Neden (kod): duman bulutları `fartPuffs` içinde dünya koordinatıyla tutulur; yaşları `fartNow` ile ilerler ve `fartNow` yalnız kare döngüsünde güncellenir. Amca uçarken düşüp oyun bitince (`running = 0`) döngü durur, bulutların yaşı donar; `restart` duman durumunu temizlemediği için yeni oyunda da `fartNow` son duman zamanından çok uzaklaştığı için hiç ilerlemez → bulutlar asılı kalır.
Düzeltme: `restart` içinde fartOn, fartPuffs, fartIdx, fartLastEmit, fartLaunchAt, fartCut, fartNow sıfırlanır ve ses durdurulur. Fizik/kamera değişmedi.
Kanıt: simülatörde uçarken düşüş → oyun sonu kartında donmuş bulutlar (`once-duman-donmus.png`); "Bir daha" sonrası temiz başlangıç (`sonra-bir-daha-temiz.png`). tsc yeni hata yok; worklet sıra testi PASS. Telefonda doğrulanmadı.
Ayrıca videoda (önceki istekler): düşüş "eyvah" pozu 44–45 ve 79. saniyelerde görünüyor; kargalar kulelerde duruyor. 1 sn'lik örneklemle karga hareketinin çeşitliliği değerlendirilemedi.
