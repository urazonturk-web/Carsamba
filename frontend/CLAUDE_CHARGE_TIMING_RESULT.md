# Claude sonuç raporu — şarj zamanlaması: doğrulanmış saatle kalıcı düzeltme (v3)

Tarih: 14 Eylül 2026. Kullanıcının yeni cihaz videosu ("hâlâ göründüğünden fazla zıplıyor") üzerine: (1) saat uyumluluğunu GERÇEKTEN doğruladım (kaynak koddan), (2) v2'nin `chargeStartPending` geçici çözümünü, kendi sınır sorunu olduğu için TAMAMEN kaldırıp yerine doğrudan zaman-damgası tabanlı, sınır sorunu olmayan bir hesap koydum, (3) yeni videodan gerçek bir basış-bırakış döngüsünü piksel piksel ölçüp koddaki gerçek "Güç %" değeriyle karşılaştırdım. Commit/push yapılmadı, cihaz testi (benim tarafımdan) yapılamadı — bu ortamda iOS derleme araçları yok (aşağıda Bölüm F).

## Özet

**Saat uyumluluğu artık VARSAYIM değil, KAYNAK KODDAN DOĞRULANMIŞ bir gerçek.** Bu, v1/v2'de "riskli olur diye yapmadım" dediğim şeyi mümkün kıldı: artık `frame.timestamp` (Reanimated) ile `touchStartedAt.value` (native dokunma) DOĞRUDAN çıkarılabilir. Bunu yaptım — sonuç, v1'in (donma) ve v2'nin (sınır durumu) HER İKİ hatasını da kökünden çözen, DAHA BASİT bir kod.

**Yeni videodan gerçek bir ölçüm**: Bir basış-bırakış döngüsünü piksel piksel takip ettim; ilk denemede OCR'ın kaba (2fps) örneklemesi yüzünden YANLIŞ bir eşleştirme yaptım (%30'luk dev bir fark buldum), bunu FARK EDİP daha hassas zaman noktalarıyla DÜZELTTİM: gerçek fark yalnızca **~29ms (~%6-9 puan)** — bu, "bir kare gecikmesi" için beklenen, KÜÇÜK ve zaten bilinen kalıntı hatayla tutarlı, v1/v2'nin büyük (150ms/26 puanlık) donma senaryosu değil. Bu TEK örnekten "sorun tamamen görsel geri bildirimdir" SONUCUNU ÇIKARMIYORUM — Bölüm D'de bunu açıkça ayırıyorum.

## A. Saat uyumluluğu — kaynak koddan doğrulama (Codex/kullanıcı madde 2)

**iOS'ta, `frame.timestamp` ile `event.nativeEvent.timestamp` AYNI saati paylaşıyor — bunu iki ayrı native kaynak dosyasından doğruladım:**

1. `node_modules/react-native/React/Base/RCTTouchHandler.m:162`:
   ```objc
   reactTouch[@"timestamp"] = @(nativeTouch.timestamp * 1000); // in ms, for JS
   ```
   `nativeTouch` bir `UITouch`; Apple'ın kendi dokümantasyonuna göre `UITouch.timestamp`, **Mach mutlak zaman tabanını (`CACurrentMediaTime()`)** kullanıyor.

2. `node_modules/react-native-reanimated/apple/reanimated/apple/native/PlatformDepMethodsHolderImpl.mm:46-52`:
   ```objc
   auto targetTimestamp = displayLink.targetTimestamp;
   const double frameTimestamp = calculateTimestampWithSlowAnimations(targetTimestamp) * 1000;
   ```
   `displayLink` bir `CADisplayLink` (`READisplayLink.h`'de `typedef CADisplayLink READisplayLink` ile doğrulandı) — `CADisplayLink.targetTimestamp` da AYNI `CACurrentMediaTime()` zaman tabanını kullanır.

**Sonuç**: İkisi de AYNI monotonik saatten (`CACurrentMediaTime`), AYNI dönüşümle (saniye × 1000 = ms) geliyor. Bunları doğrudan çıkarmak GÜVENLİ. (Android için ayrı bir doğrulama yapılmadı — bkz Bölüm G.)

## B. Uygulanan düzeltme — v1 ve v2'nin YERİNE

**v1** (`rawDt` ile sıkıştırılmamış birikim) donmaya karşı düzeltiyordu ama sınır durumunda (basış aralığın SONUNDA başlarsa) aşırı-kredi veriyordu (kanıtlanmıştı: 150ms aralık + 10ms basış → %33.3 gösteriyordu).
**v2** (`chargeStartPending` bayrağı) sınır durumunu "ilk kareyi sıfırla" ile düzeltti ama BU SEFER TERSİ sorunu getirdi: kullanıcının/Codex'in bu turda işaret ettiği gibi, basış İŞLENDİKTEN SONRA ilk kare GECİKİRSE (ör. basış işleme kendisi 100ms sürerse), o gecikmiş ilk aralığın TAMAMI (ki bu sefer büyük ölçüde basıştan SONRAKİ gerçek süre olabilir) sıfırlanıyor — GÖRSEL AÇIK KREDİ EKSİĞİ oluşabiliyordu.

**v3 (bu tur)**: Artık ne birikim var ne de "ilk kareyi atla" mantığı. Şarj HER KAREDE SIFIRDAN, doğrudan iki zaman damgasının farkından hesaplanıyor:
```js
if (phase.value === PHASE.CHARGING) {
  const heldMs = frame.timestamp - touchStartedAt.value;
  charge.value = Math.min(1, Math.max(0, heldMs / 1000 / CONFIG.maxChargeDuration));
}
```
Bu, HER İKİ sınırı da (aralığın başı VE donma) aynı anda, sıfır özel-durum mantığı olmadan çözüyor — çünkü artık "hangi aralığın ne kadarı basışa ait" sorusu YOK, yalnızca "şu an basıştan beri ne kadar geçti" sorusu var, ve bu doğrudan, sürüklenmesiz okunuyor.

`app/index.tsx`'teki değişiklikler:
1. `chargeStartPending` paylaşılan değeri KALDIRILDI.
2. `rawDt` kaldırıldı; `dt` fizik/yay animasyonu için eski (sıkıştırılmış) haliyle korundu — **fizik parametrelerine dokunulmadı**.
3. Kare döngüsü, yukarıdaki doğrudan zaman-damgası formülünü kullanıyor.
4. **Tanı amaçlı, geçici** iki yeni alan eklendi (kullanıcının/Codex'in istediği ölçümleri cihazda görünür kılmak için): `firstChargeFrameSeen`/`firstChargeFrameTs` (basıştan ilk şarj karesine kadar geçen süreyi ölçmek için) ve `onPressOut`'ta bırakıştan HEMEN önceki `charge.value`'nun ("son görsel şarj") yakalanması. Bunlar `reportJump`'a eklendi ve ekrana yazdırılıyor: **"Son basış: X ms · Güç: %Y · Görsel: %Z · İlk kare: Wms"**.

## C. Testler — gerçek koddan, 6 senaryo (kullanıcı madde 1, 3)

`work/check-charge-timestamp.cjs` (v2'nin `check-charge-start-boundary.cjs`'inin yerini alıyor — o dosya artık geçerli değil, `backups/2026-09-14-before-timestamp-based-charge-fix/check-charge-start-boundary-v1.cjs` içinde saklandı). Önceki turlardaki gibi `app/index.tsx`'in GERÇEK AST'sinden fonksiyonları çıkarıp çalıştırıyor.

| Senaryo | Sonuç |
|---|---|
| 150ms'lik ekran-bağlantısı aralığı, basış son 10ms'de | **%2.2 kredi** (10ms/450ms) — ne %0 ne %33, DOĞRU değer |
| Sıradan bir karenin ORTASINDA başlayan basış (8ms) | **%1.8 kredi** (8ms/450ms) — doğru |
| Devam eden bir tutuşun İÇİNDE 150ms'lik donma | **tam, sürüklenmesiz telafi** (167ms toplam, tam yansıyor) |
| İptal + hemen ardından yeni tutuş | yeni tutuş, boşluğu miras almıyor, yalnızca 12ms gösteriyor |
| Tanı alanları (Görsel %, İlk kare ms) | simüle edilen kare dizisiyle birebir eşleşiyor |
| Fırlatma fiziği (0-600ms, 7 basış) | native zaman damgasından TAMAMEN bağımsız, değişmedi |

6/6 PASS. Test, ESKİ (v1 VE v2) koda karşı çalıştırıldığında kaynak metninde beklenen ifadeleri bulamayıp AÇIKÇA başarısız oluyor (ayırt edicilik doğrulandı).

## D. Cihaz kanıtı — yeni videodan gerçek bir ölçüm (kullanıcı madde: "doğrudan araştır")

Video: `ScreenRecording_09-14-2026 16-41-31_1.MP4` (77s, skor 0'dan 5+'a). Karakterin (ceket rengi) piksel ağırlık merkezini, önceki turlarda kullandığım YÖNTEMLE (renk-sapma tabanlı, göz kararı değil) takip ederek t≈61.9-62.2s arasındaki TEK bir temiz basış-bırakış döngüsünü buldum:

- **Görsel sıkışma başlangıcı** (düz taban çizgisinden ilk yükseliş): t=61.9004s.
- **Fırlatma anı** (ani Y düşüşü): t≈62.176-62.184s arası.
- **Görsel sıkışma süresi**: ~275-284ms.

**Önemli düzeltme — kendi hatamı buldum ve düzelttim**: İlk denemede bunu, 2fps'lik kaba OCR taramamdaki "396ms/%88" okumasıyla eşleştirip **%30'luk (120ms) dev bir fark** buldum. Bu şüpheli derecede büyük göründüğü için, TAM O ANIN çevresinde (62.15/62.20/62.25/62.30s) TEK TEK, hassas kareler çıkarıp metni yeniden okudum: gerçek değer **"304 ms · %68"** çıktı — bırakış t=62.20-62.25 arasında gerçekleşmiş, kaba tarama bunu atlayıp YANLIŞ bir sonraki okumayla eşleştirmişim.

**Düzeltilmiş sonuç**: Görsel sıkışma ~275-284ms gösteriyordu, gerçek (native) değer 304ms — **fark yalnızca ~20-29ms (~%6-9 puan)**. Bu, "bir kare gecikmesi" için beklenen, KÜÇÜK ve zaten bilinen kalıntı hatayla (60fps'te ~16.7ms, yeni düzeltmeyle de TAMAMEN ortadan kalkmıyor çünkü son kare güncellemesi ile gerçek bırakış anı arasında hâlâ ~1 kare boşluk var) tam tutarlı.

**Bu videoda BÜYÜK (v1'in 150ms/26-puanlık donma senaryosu gibi) bir uyuşmazlık örneği BULAMADIM** — ne bu videonun HANGİ kod sürümünü çalıştırdığını kesin bilebiliyorum (kullanıcı mesajı bunu belirtmiyor), ne de 77 saniyelik videonun TAMAMINI (~100'den fazla basış) tek tek bu hassasiyette tarayacak zamanım oldu. Bulduğum TEK temiz örnek küçük bir farkla tutarlı; bu, "büyük donma senaryosu bu oturumda hiç gerçekleşmedi" anlamına gelmez, yalnızca "bu ÖRNEKTE gerçekleşmedi" anlamına gelir.

## E. Hipotez 1 vs 2 — kanıtla ayrım (kullanıcının asıl sorusu)

**Kesin sonuca varamıyorum, ama kanıt şunu gösteriyor:**

- Bulduğum TEK temiz örnekte, görsel geri bildirim gerçek değere ÇOK yakın (%6-9 puan, kare-gecikmesi ölçeğinde) — bu, o örnek için Hipotez 1'i (BÜYÜK ölçekte) DESTEKLEMİYOR.
- Ama kod okumasıyla kanıtlanmış (v1/v2 raporları) GERÇEK bir donma-kaynaklı büyük uyuşmazlık İHTİMALİ var — bu videoda YAKALANMADI ama kodda VARDI ve şimdi düzeltildi.
- **Kullanıcının "hâlâ fazla zıplıyor" hissi, küçük (%6-9 puanlık) bir sürekli sapmadan mı, yoksa ARA SIRA olan büyük donma anlarından mı, yoksa TAMAMEN AYRI bir üçüncü sebepten (basış-hız kalibrasyonu, Hipotez 2) mi kaynaklandığını bu videodan KESİN AYIRAMADIM.**

**Bu ayrımı KESİNLEŞTİRMENİN yolu**: Yeni build'de artık ekranda **"Görsel: %Z"** alanı var. Eğer bundan sonraki testlerde Görsel% ile Güç% HER ZAMAN birbirine çok yakınsa (birkaç puan fark), Hipotez 1 KAPANMIŞ demektir — kalan "fazla zıplama" hissi Hipotez 2'ye (basış-hız kalibrasyonu) işaret eder ve bu, AYRI, fizik parametrelerine dokunan bir görev olmalı (bu turda böyle bir değişiklik YAPILMADI — "geri bildirim zamanlamasıyla fizik parametrelerini birlikte değiştirme" talimatına uyuldu).

## F. Neden ben cihazda test edemedim

Bu ortamda: `ios/` klasörü yok (managed Expo projesi, prebuild yapılmamış), CocoaPods (`pod`) kurulu değil, `xcodebuild` yalnızca Command Line Tools'a bağlı (tam Xcode değil) — gerçek bir iOS build/simülatör çalıştıramadım. Bu yüzden "her bırakışta ölç" talebini BEN üretemedim; bunun yerine (a) kodu doğrudan test ettim (Bölüm C), (b) kullanıcının KENDİ videosunu piksel-piksel analiz ettim (Bölüm D), (c) cihazda kolayca okunabilecek yeni alanlar ekledim (Bölüm B.4).

## G. Testler ve doğrulama

- `node work/check-charge-timestamp.cjs` — 6/6 PASS (gerçek kaynak koddan).
- `node work/check-measurement-sept14.cjs` — PASS (9/9).
- `node work/check-foot-landing.cjs` — PASS (12/12).
- `npx tsc --noEmit` (doğrudan) — yalnızca önceden var olan 3 `theme.ts` hatası.
- `node work/validate.cjs` — Babel/worklet PASS.
- **Android doğrulanmadı**: Bölüm A'daki saat-uyumluluğu kanıtı yalnızca iOS native kaynağına dayanıyor. Android'de Reanimated'in kare zaman damgası ile `MotionEvent` zaman damgasının aynı ölçekte olduğu AYRICA doğrulanmalı (muhtemelen benzer, `SystemClock.uptimeMillis`/`System.nanoTime` tabanlı, ama bu turda kaynak koddan teyit edilmedi).

## H. Kısa iPhone test prosedürü

1. Uygulamayı aç, `__DEV__` panelini izle — artık **"Görsel: %"** ve **"İlk kare: Xms"** alanları da görünüyor.
2. Birkaç normal basış yap; her seferinde **Görsel% ile Güç%'nin BİRBİRİNE ÇOK YAKIN** (birkaç puan fark) olduğunu doğrula — büyük bir fark (10+ puan) görülürse, hâlâ çözülmemiş bir donma senaryosu var demektir, lütfen o anın ekran kaydını gönderin.
3. Bilerek cihaza yük bindirirken (Bölüm E.2, önceki rapor) basış yap — düzeltme sonrası Görsel% ile Güç% HÂLÂ yakın kalmalı (önceki turlarda kalıcı sürüklenme/aşırı-kredi olabiliyordu).
4. Görsel% ile Güç% HER ZAMAN yakınsa ama "fazla zıplama" hissi DEVAM EDİYORSA, bu artık geri bildirim sorunu değil — ayrı bir fizik-kalibrasyon görevi gerekir.

## I. Yedekleme ve geri dönüş

- `backups/2026-09-14-before-timestamp-based-charge-fix/index.tsx` — bu turdan HEMEN önceki hal (v2, `chargeStartPending` ile).
- `backups/2026-09-14-before-timestamp-based-charge-fix/check-charge-start-boundary-v1.cjs` — v2'nin artık geçersiz test dosyası.
- `backups/2026-09-14-before-charge-start-boundary-fix/`, `backups/2026-09-14-before-charge-dt-clamp-fix/` — daha eski sürümler, hâlâ duruyor.
**Geri dönüş**: en güvenli yol `backups/2026-09-14-before-timestamp-based-charge-fix/index.tsx`'i `app/index.tsx` üzerine kopyalamak (v2'ye döner). v1'e (orijinal, sıkıştırılmış `dt`) dönmek için bir önceki yedek kullanılmalı.

## J. Kalan belirsizlikler

1. Hipotez 1 vs 2 ayrımı KESİNLEŞMEDİ (Bölüm E) — yeni Görsel%/Güç% alanlarıyla cihazda doğrudan gözlemlenmeli.
2. Büyük donma senaryosu bu videoda YAKALANAMADI (yalnızca küçük, beklenen ölçekte bir fark bulundu) — kodda düzeltildiği için artık önemi azaldı, ama cihazda hâlâ gözlenmedi.
3. Android saat uyumluluğu doğrulanmadı.
4. Referans oyunun kendi geri bildirim mekanizması hâlâ bilinmiyor.
