# Claude video kanıtı sonuç raporu — uçuş şekli (açı) doğrulaması

Tarih: 14 Eylül 2026. Bu rapor CLAUDE_RESULT.md'nin (şarj penceresi düzeltmesi) ÜZERİNE gelir ve o düzeltmenin bir yan etkisini video kanıtıyla düzeltir. Commit/push yapılmadı.

## Ne yapıldı, kısaca

Üç Spring Ninja referans videosundan (11-12-55, 11-37-54, 17-48-03) toplam **4 gerçek uçuş** kare kare (native ~60fps) ölçüldü — piksel renk analiziyle (Python/PIL/numpy), göz kararıyla değil. Bulgu: **fırlatma açısı basış gücünden bağımsız olarak sabit (~68-70°)**. Önceki CLAUDE_RESULT.md'deki düzeltme (`verticalChargeCurve: 0.65`, yalnızca dikey hıza uygulanmıştı) bu sabitliği bozuyordu — canlı kodda kontrol ettim, hafif dokunuşlarda açı 70°'den 77°'ye kadar dikleşiyordu. Bunu geri alıp, AYNI eğriyi hem yatay hem dikey hıza (ortak "efektif şarj" üzerinden) uygulayan bir düzeltmeyle değiştirdim: açı artık her şarj seviyesinde ~69.96-69.99° (referansla uyumlu), pencere genişlemesi ise daha mütevazı (~43ms, önceki ~44ms'ye yakın ama artık açıyı bozmadan).

## Yöntem

- FFmpeg (proje içi `work/video/deps/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1`) ile videoların HDR (yuv420p10le/bt2020) karelerini `zscale+tonemap=hable` ile normal renklere çevirdim — düz çıkarım soluk/gri çıkıyor (HANDOFF'ta belirtilen sorun), tonemap düzeltiyor.
- Karakter ve kolon renklerini örnekleyip eşik belirledim (karakter: RGB toplamı <200 olan koyu pikseller; kolon kapağı: yeşil G>195; kolon gövdesi: tema bazlı — 11-12-55'te bej/kahve, 11-37-54/17-48-03'te gri kaya, ikincisi için ayrı eşik gerekti ve zaman kalmadığı için yalnızca dikey (yerçekimi) ölçümü yapıldı, yatay hız ölçülmedi).
- Her karede karakterin piksel ağırlık merkezi (centroid) ve kolonun sol/sağ kenarı hesaplandı; zaman içinde **parabol fit** (dikey, `numpy.polyfit` derece 2) ve **doğrusal fit** (yatay, kolon kayması) uygulandı.
- **Önemli doğrulama**: kamera uçuş sırasında karaktere yatayda tam kilitli (ekran x'i tüm uçuş boyunca ±0.5px içinde sabit) — tıpkı bizim oyunumuzdaki `cameraSmoothingX: 1` yorumundaki "lock the player horizontally" tasarımı gibi. Bu yüzden yatay hız karakterin KENDİ ekran hareketinden değil, sabit dünya nesnesi olan hedef kolonun kayma hızından ölçüldü (talimatta istenen yöntem).
- Fit kalitesi çok yüksek: RMS artık (residual) 0.18-0.78 piksel arası — pürüzsüz, gerçek bir parabol/doğru ile örtüşüyor, ölçüm gürültüsü düşük.

## Kanıt (yüksek güven): fırlatma açısı sabit

| Uçuş | Video | Basış tahmini* | vy0 (kırpma ölçeği) | vx (kırpma ölçeği) | g (kırpma ölçeği) | **Açı** | RMS |
|---|---|---|---|---|---|---|---|
| 1 (id0→id1, ilk kolon) | 11-12-55, ~30.36s | ~0.56s | 1367.9 | 507.8 | 2333.3 | **69.6°** | 0.31px |
| 2 (id1→id2) | 11-12-55, ~31.93s | ~0.25s | 860.9 | 347.5 | 2175.4 | **68.0°** | 0.78px |
| 3 (id2→id3) | 11-12-55, ~33.57s | ~0.30s | 921.1 | 347.3 | 2334.4 | **69.35°** | 0.42px |
| 4 (11-37-54, ~19.77s) | 11-37-54 | — | 822.2 | *ölçülmedi (renk teması farklı)* | 2333.7 | — | 0.18px |
| 5 (17-48-03, ~11.05s) | 17-48-03 | — | 1178.0 | *ölçülmedi* | 2324.1 | — | 0.30px |

*Basış tahmini = görünür sıkışma başlangıcından kalkışa kadar geçen süre; bkz. aşağıdaki "basış süresi belirsizliği" bölümü — bu KESİN parmak temas süresi değildir.

**Sonuç**: vy0, 860.9'dan 1367.9'a (%59 fark) değişse de açı yalnızca 68.0°–69.6° arasında kalıyor (<2° fark). Bu, **vx ve vy'nin şarjla BİRLİKTE, ORANTILI arttığının** güçlü kanıtıdır — tam olarak bizim `horizontalChargePlateau: 1` (yatay/dikey aynı şarj oranını paylaşıyor) tasarımının varsaydığı davranış.

**Ek doğrulama — yerçekimi sabiti**: 3 farklı video oturumunda (farklı günler, farklı harita temaları), 4 uçuşta ölçülen yerçekimi 2175-2334 aralığında (kırpma ölçeği), ortalama ~2292. Bu şaşırtıcı derecede tutarlı — aynı fiziksel sabiti farklı kayıtlarda buluyoruz, yöntemin güvenilir olduğunun kanıtı.

## Beklenmedik iyi haber: bizim yerçekimi sabiti zaten doğru ölçekte

Referans video ölçümünü Codex'in `reference-course.ts` ölçek birimine (330px kaynak genişliği) çevirdim: `g_330 = g_ölçülen(native) / 4`. Ortalama 4 uçuş: **g_330 ≈ 1146-1165** (jump1 tek başına: 1165).

Bizim `CONFIG.gravity=2500` ve `physicsScale(W)=W/440` formülünü, referans ölçeğine denk gelen W=330×0.62=204.6 için hesapladım: `flightGravity(204.6) = 2500×(204.6/440) = 1163.6`.

**1163.6 (bizim formül) vs 1165 (bağımsız video ölçümü) — %0.1 fark.** Bu, Codex'in önceki `gravity: 2500` "deneme" değerinin (HANDOFF'ta "kesin tersine mühendislik sonucu değil" diye işaretlenmişti) aslında zaman ölçeğinde neredeyse tam isabetli olduğunu gösteriyor. **Yerçekimi/zaman kalibrasyonunda değişiklik yapmadım — buna gerek yok.**

## Kanıt (düşük-orta güven, belirsizlik yüksek): basış süresi ve sıkışma

Yay sıkışması ilk bakışta (küçük thumbnail'lerde) SABİT görünüyordu — bu YANLIŞ bir izlenimdi. Piksel takibiyle tekrar baktığımda: karakterin y-merkezi, kalkıştan önce **yavaş, düzgün, monoton biçimde** artıyor (örn. jump1: 623.6'dan 656.5'e, 0.55s boyunca, ~33px kırpma-ölçeğinde ≈ karakterin boyunun ~%25'i kadar bir sıkışma). Bu gerçek ama İNCE bir sıkışma animasyonu — kaba örnekleme veya küçük contact-sheet'lerle gözden kaçıyor.

**Belirsizlik**: Parmağın EKRANA DOKUNDUĞU an görünmüyor; ben yalnızca "durgun duruştan sıkışmaya geçiş" pikselini görebiliyorum, ki bu (a) gerçek dokunuş anından bir miktar gecikmeli olabilir (animasyon başlangıç eşiği), (b) iniş sonrası "toparlanma" hareketiyle (landing recoil) karışabilir — jump2/3'te bunu ayırt etmeye çalıştım (iniş sarsıntısı önce Y'yi ARTIRIYOR sonra dinlenme pozuna "geri" AZALTIYOR, sıkışma ise DURGUN bir taban çizgisinden sürekli artıyor — bu ayrımı kullandım ama kesin değil). Bu nedenle basış süresi tahminlerini (~0.56s, ~0.25s, ~0.30s) **gerçek parmak süresi olarak sunmuyorum**, yalnızca "görece" karşılaştırma için.

Bu üç (gürültülü) noktadan çıkan zayıf bir eğilim: basış süresi arttıkça güç (vy0) ORANLI'dan daha AZ artıyor gibi görünüyor (0.56s → vy 1367.9, 0.30s → 921.1: süre 1.87 kat ama güç yalnızca 1.48 kat). Bu, hafif iç-bükey (concave/azalan-getiri) bir eğriye işaret edebilir — ama yalnızca 3 gürültülü noktadan kesin bir üs (0.65? 0.7? 0.8?) çıkaramam. **Bunu "kanıtlanmış" diye sunmuyorum; yalnızca yön göstergesi.**

## Neden önceki düzeltmeyi geri aldım

CLAUDE_RESULT.md'deki düzeltme (`verticalChargeCurve: 0.65`) yalnızca dikey hıza uygulanmıştı; yatay hız aynı kalıyordu. Gerçek proje koduyla kontrol ettim (düzeltme aktifken):

```
c=0.05: açı ≈ 77°   (referans: ~69°  — 8° sapma)
c=0.5:  açı ≈ 73°   (referans: ~69°  — 4° sapma)
c=1.0:  açı ≈ 70°   (referans: ~69-70° — uyumlu)
```

Yani düzeltme tam şarjda doğruydu ama **hafif dokunuşları gereğinden fazla dikleştiriyordu** — referans videoda görmediğimiz bir davranış. Kullanıcının "aynı basış alışkanlığının benzer uçuş üretmesi" isteği tam olarak bunu yakalıyor: pencereyi genişletirken uçuş ŞEKLİNİ bozmuşum.

## Uygulanan yeni düzeltme

`src/game/jump.ts`: artık TEK bir `effectiveCharge = charge^chargeResponseCurve` hesaplanıyor ve hem yatay hem dikey hıza AYNI değer besleniyor (önceden ayrı ayrıydı). Matematiksel olarak: iki hız da AYNI ortak değişkenin fonksiyonu olduğu için, aralarındaki oran (dolayısıyla açı) şarj eğrisinin şekli ne olursa olsun korunur — bunu hem elle (69.96-69.99° her c için) hem gerçek kodla doğruladım.

`src/game/config.ts`: `verticalChargeCurve` alanı `chargeResponseCurve` olarak yeniden adlandırıldı (artık ikisini de etkilediği için). Eski moda (`PREVIOUS_CONFIG`, REFERENCE_TRIAL=false) değeri **1** (değişiklik yok, eski davranış birebir korunuyor — o mod zaten kasıtlı olarak farklı bir tasarım kullanıyor: `horizontalChargePlateau: 0.22`, yatay hız erken sabitleniyor, açı zaten değişken; buna dokunmadım). Aktif referans modunda değer **0.7** (0.65'ten daha muhafazakar — kanıt daha zayıf olduğu için).

## Önce/sonra (gerçek proje koduyla ölçüldü)

| | Açı aralığı (c=0.05→1.0) | İlk kolon penceresi (W393) | 47 çiftin en dar noktası (id44→45) |
|---|---|---|---|
| Orijinal (lineer, hiç düzeltme yok) | 69.96-70.0° (sabit) | 375-406ms (32ms) | 19.9ms |
| Önceki düzeltme (vy'ye özel 0.65) | **70°→77° arası, sabit DEĞİL** | 350-393ms (44ms) | 46.7ms |
| **Yeni düzeltme (ortak 0.7)** | **69.96-69.99° (sabit)** | 346-389ms (43ms) | 22ms |

Yeni düzeltme, açıyı referansla uyumlu tutarken pencereyi hâlâ genişletiyor (32→43ms ilk kolonda) ama 47-kolon geneli için kazanım daha küçük (19.9→22ms, önceki 46.7ms'nin çok altında). **Bu bir ödünleşim**: açı sadakati ile pencere genişliği arasında, kanıtla desteklenen bir sınırın ötesine geçemedim — daha fazla pencere genişletmek (denedim: paylaşılan eğriyi 0.5'e kadar düşürmek, veya tüm hız eğrisini büyütüp küçültmek) ya açıyı bozuyor ya da video kanıtı olmayan keyfi bir varsayım gerektiriyor.

## Testler

- `work/first-window-fixed.cjs` (gerçek proje kodu): W393/402/440 için pencereler yukarıdaki tabloda.
- Açı kontrolü: gerçek `jumpVelocity()` fonksiyonu c=0.05...1.0 için çalıştırıldı, sonuç 69.96-69.99° (yukarıda).
- 47 kolon çiftinin tamamı gerçek `jumpVelocity`+`findFootLanding` ile tarandı: min pencere 22ms (id44→45), ortalama 66.1ms, **0 ulaşılamaz kolon**.
- `node work/check-measurement-sept14.cjs` — PASS.
- `node work/check-foot-landing.cjs` — PASS (12/12).
- `node work/validate.cjs` — Babel iOS/worklet PASS; TypeScript'te yalnızca önceden var olan `theme.ts` 3 hatası (2345/2322/7053), yeni hata yok; lint aynı taban çizgisi (`import/no-unresolved` 3, `immutability` 21).
- `chargeResponseCurve`/`verticalChargeCurve` için kod tabanında başka referans kalmadığı `grep` ile doğrulandı (temiz yeniden adlandırma).

## Değişmeyenler

Kolon dizisi (`reference-course.ts`), genişlikleri, ayak teması (`landing.ts`), karakter görseli, puanlama, kamera — hiçbiri değiştirilmedi. Değişen yalnızca `src/game/config.ts` (bir alan yeniden adlandı + değeri değişti) ve `src/game/jump.ts` (aynı eğrinin artık iki dala da uygulanması).

## Yedekleme

Önceki (açıyı bozan ama pencereyi daha çok genişleten) 0.65 sürümü `backups/2026-09-14-vy-curve-0.65-vy-only/` içinde duruyor (`config.ts`, `jump.ts`, o zamanki `CLAUDE_RESULT.md`). Geri dönmek istenirse bu dosyalar `src/game/` içine kopyalanabilir — ama bu, ölçülen ~69° açıyı bozacağı bilinerek yapılmalı.

## Cihaz testi ve genel sınırlamalar

- **Hiçbir şey telefonda test edilmedi.** Bütün sayılar video ölçümü + kod-seviyesi simülasyon.
- 17-48-03 videosunda yalnızca yerçekimi ölçüldü (renk teması farklı olduğu — gri kaya kolonlar — için yatay hız/açı ölçme zamanı kalmadı). Bu video için açı doğrulanmadı, sadece yerçekimi çapraz kontrolü yapıldı.
- Kendi oyunumuzun videosu (10-12-17) bu turda yeniden piksel-piksel ölçülmedi; CLAUDE_RESULT.md'deki önceki ms/% okumaları ve bu turun kod-seviyesi doğrulaması (gerçek `jumpVelocity` fonksiyonu) kullanıldı. Kendi oyunumuzdaki GERÇEK render edilmiş açıyı (ör. kısa bir basıştan sonra ekranda karakterin gerçekten ~70° mi fırlıyor) video ile ayrıca doğrulamadım — yalnızca formülü doğruladım.
- Basış süresi tahminleri (0.56/0.25/0.30s) yukarıda açıklandığı gibi belirsiz; bunlara dayanan "eğri şekli hafif iç-bükey" gözlemi zayıf kanıttır, `chargeResponseCurve=0.7` seçimini kısmen destekler ama kesin olarak türetmez.
- Referans oyunun kendi başarı penceresinin GERÇEKTE ne kadar geniş olduğunu hiçbir zaman ölçmedim (yalnızca BAŞARILI bir koşunun videosu var — deneyimli bir oyuncunun tam isabetleri). Yani "bizim pencere referanstan dar" iddiası hâlâ yalnızca KULLANICININ KENDİ OYUNUMUZDAKİ deneyimine dayanıyor, referans oyunun zorluk seviyesine değil.
