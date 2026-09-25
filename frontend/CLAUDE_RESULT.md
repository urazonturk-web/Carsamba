# Claude sonuç raporu — ilk kolon şarj/güç eşlemesi

Tarih: 14 Eylül 2026. Commit/push yapılmadı. Değişen dosyalar: `src/game/config.ts` (düzenlendi), `src/game/jump.ts` (düzenlendi). Kolon dizisi/genişliği (`reference-course.ts`), ayak teması (`landing.ts`), karakter görseli, puanlama dokunulmadı.

## Teşhis: kanıt ve varsayım ayrımı

**Kanıt (bağımsız ölçtüm, kod HEAD'den değil çalışan config'ten):**

- `src/game/jump.ts` içinde asıl fizik gücü **native event timestamp'ten** hesaplanıyor (`onPressOut` → `heldSeconds = (endedAt - touchStartedAt)/1000`). Ekrandaki "Son basış" göstergesi ve Metro'daki `[jump-measurement]` logu bu native değeri gösteriyor — kullanıcının yeni video kanıtındaki ms değerleri gerçek fizik girdisiyle aynı temelde, tahmini değil.
- Görsel sıkışma (`charge.value`, satır ~456 `index.tsx`) frame `dt` ile ayrı ilerliyor. **Bunu kontrol ettim: fiziksel sıçrama gücü bu görsel değerden değil, sadece native timestamp farkından hesaplanıyor.** Yani kare düşmesi/hitch olsa bile görsel gösterge yanılabilir ama gerçek zıplama gücü etkilenmez. Bu, ilk kolonun kaçırılmasının nedeni DEĞİL; ayrı, düşük öncelikli bir görsel-doğruluk sorunu olarak kalıyor (düzeltmedim, kapsam dışı bıraktım).
- Kolon0→kolon1 (referans dizisindeki ilk gerçek atlayış) için, projenin **gerçek** `jumpVelocity`/`flightGravity`/`findFootLanding` fonksiyonlarını (TypeScript'i canlı transpile ederek) çalıştıran `work/first-window-fixed.cjs` ile ölçtüm:
  - **Düzeltmeden önce** (mevcut/committed davranış, `verticalChargeCurve` yokmuş gibi = lineer): W393/402 → başarılı basış **375–406 ms** (32 ms pencere, 450 ms üzerinden ~%7). W440 → **376–405 ms** (30 ms). Bu, Codex'in HANDOFF.md'de daha önce bildirdiği sayılarla birebir örtüşüyor — bağımsız doğrulama.
  - Kullanıcının yeni videosundaki 6 ilk deneme (371/421/421/354/413/404 ms) bu pencereyle karşılaştırıldığında: sadece 404 ms pencerenin içinde (kıl payı, üst sınıra 2 ms kala), 413 ms pencerenin 7 ms dışında (üst sınırı aşan, yani **aşırı** şarj yüzünden ıskalıyor). Bu, sadece "kullanıcı alışkanlığı" değil, gerçekten dar ve tam şarja yakın yerde aşım riski olan bir pencere olduğunu doğruluyor.
  - Tam şarj (450 ms, %100) bile bu kolonu **ıskalıyor** (pencere 405–406 ms'de bitiyor) — yani yeni bir oyuncunun alışkanlıkla yaptığı "tam bas" hamlesi ilk kolonda garanti başarısız.
- Sorunun kaynağı: `CONFIG.horizontalChargePlateau = 1` (referans denemesinde), yani yatay hız da şarjın %100'üne kadar dikey hızla birlikte lineer artıyor. Bu ikisi birlikte arttığı için, şarjın son ~%10-15'lik diliminde hem menzil hem uçuş süresi aynı anda büyüyor ve iniş konumu şarja karşı çok dik (px/ms) değişiyor → dar pencere. Bunu, aynı geometriyi sabit tutup sadece `vx`/`vy` eğrisinin şeklini değiştirerek (üs/plato denemeleri) sayısal olarak doğruladım — kolon genişliği/mesafesi hiç değişmedi.

**Test ettiğim ama işe yaramayan / reddettiğim yollar (kanıtla):**

- `horizontalChargePlateau`'yu erkene çekmek (yatay hızı erken sabitlemek, eski PREVIOUS_CONFIG mantığı: 0.22–0.9 arası denendi): pencere **daralıyor** (32 ms → ~26–28 ms), çünkü aşımı yatay hız değil, dikey hızın (dolayısıyla uçuş süresinin) şarjla birlikte büyümesi belirliyor.
- Dikey hıza "plato" (belirli şarjdan sonra sabitleme) eklemek: işe yaramadı, çünkü yatay hız platodan önce zaten büyümeye devam ediyor ve aşım plato noktasına varmadan oluşuyor.
- `maxChargeDuration`'ı uzatmak (0.45→0.5s, referans sıkışma tahminine yakın): pencereyi orantılı olarak biraz genişletir ama gerekli şarj YÜZDESİ aynı kaldığından (pencere hep %83–90 civarında), kullanıcının "tam bas" hissi yine aşım bölgesine denk geliyor — yapısal sorunu çözmüyor, sadece ms cinsinden yeniden ölçekliyor. Uygulamadım.
- Kolonu yaklaştırma veya gizli temas payı ekleme: **yapılmadı**, kullanıcı talimatına uygun.

## Uygulanan düzeltme

`jumpVelocity()` içinde dikey hız artık `charge` yerine `charge^verticalChargeCurve` kullanıyor (`src/game/jump.ts:18,21`). Yeni config alanı `verticalChargeCurve`:
- `PREVIOUS_CONFIG` (eski mod): **1** — matematiksel olarak birebir eski lineer davranış, hiçbir fark yok.
- `REFERENCE_TRIAL` (aktif mod): **0.65** — içbükey (concave) eğri. %0 ve %100 şarjda hız aynı (min/max korunuyor, tam şarj apeksi değişmiyor); yalnızca aradaki şarj oranlarında dikey hız biraz daha erken büyüyor, bu da "yaklaşık doğru ama biraz eksik/fazla" basışlara daha fazla tolerans tanıyor.

Bu **tek parametreli, tersine çevrilebilir** bir değişiklik: `verticalChargeCurve: 1` yapmak eski davranışı aynen geri getirir. Kolon dizisi, genişlikleri, karakter, ayak teması, puanlama dokunulmadı.

## Önce/sonra sayılar (gerçek proje kodu ile, `work/first-window-fixed.cjs`)

| Ekran | Önce (lineer) | Sonra (curve 0.65) |
|---|---|---|
| W393 | 375–406 ms (32 ms) | 350–393 ms (44 ms) |
| W402 | 375–406 ms (32 ms) | 350–393 ms (44 ms) |
| W440 | 376–405 ms (30 ms) | 351–392 ms (42 ms) |

**Önemli uyarı:** pencere sadece genişlemiyor, aynı zamanda ~20-25 ms erkene kayıyor (fizik nedeniyle kaçınılmaz — bkz. aşağıdaki belirsizlikler). Yani kullanıcının videosundaki spesifik "404 ms başarılı" anı yeni eğride **tekrar başarılı olacağının garantisi yok**; ölçümüm 404 ms'yi de pencerenin az dışında (yeni üst sınır ~393 ms) gösteriyor. Kazanım, belirli bir ms değerini korumak değil, **pencerenin mutlak genişliğinin ~%40 artması**.

**47 ölçülü kolon çiftinin tamamında** (id0→id1 … id46→id47, aynı script mantığıyla genişletilmiş kendi analiz script'im, W393):
- Önce: en dar pencere **19.9 ms** (id44→id45 — bu, daha önce hiç raporlanmamış, ilk kolondan bile daha sıkı bir nokta), ortalama 61.5 ms.
- Sonra: en dar pencere **44.3 ms**, ortalama 66.2 ms.
- 47 çiftten 7'sinde pencere biraz daralıyor (en fazla 91.5→85.0 ms) ama hiçbiri 66 ms'nin altına inmiyor ve hiçbiri ulaşılamaz hale gelmiyor.

Bu, sorunun sadece "ilk kolon" değil, **şarj eğrisinin genel yapısından kaynaklanan** bir örüntü olduğunu gösteriyor; düzeltme tüm erken oyunu iyileştiriyor.

## Testler

- `work/first-window-fixed.cjs` — gerçek proje kodu (canlı transpile), W393/402/440, yukarıdaki tablo. Hem düzeltmeli hem düzeltmesiz (geçici olarak `verticalChargeCurve: 1` yapıp geri aldım) çalıştırıldı.
- Kendi yazdığım analiz script'i (`/private/tmp/.../scratchpad/*.js`, proje dışı, kalıcı değil) ile: kapalı-form analitik çözüm + 30/60/120 Hz kare-adımlı simülasyon (gerçek oyun döngüsü formülüyle) çapraz kontrol edildi, ikisi de aynı pencereyi veriyor (kare hızından bağımsız, integratör tam olduğu için beklenen sonuç).
- `node work/check-measurement-sept14.cjs` — PASS (native basış süresi/şarj eşlemesi, iptal, 400 kolon genişliği testi).
- `node work/check-foot-landing.cjs` — PASS (12 temas senaryosu).
- `node work/validate.cjs` — Babel iOS/worklet PASS. TypeScript: yalnızca önceden var olan `src/theme.ts` 3 hatası (2345/2322/7053) sürüyor, yeni hata yok. Lint: `import/no-unresolved` 3, `react-hooks/immutability` 21 — HANDOFF.md'deki temel çizgiyle aynı, artış yok.
- `Math.pow` worklet içinde: dosyada zaten `Math.exp`, `Math.sin`, `Math.sqrt` kullanılıyor (Reanimated worklet runtime'ı destekliyor); Babel derlemesi de bunu doğruladı.

## Cihaz testi sınırları

- **Hiçbir değişiklik telefonda test edilmedi.** Bütün sayılar simülasyon/analitik hesap; gerçek dokunma gecikmesi, RN köprü gecikmesi, cihazın gerçek `event.nativeEvent.timestamp` çözünürlüğü bu hesaba dahil değil.
- Kullanıcının cihazının mantıksal ekran genişliği (`W`) bilinmiyor; 393/402/440 varsayımsal örnekler. Gerçek W'ye göre pencere birkaç ms kayabilir (tabloda görüldüğü gibi fark küçük, ~1-2 ms).
- 6 basışlık örneklem çok küçük; "404 ms başarılı" tek bir gözlem, ölçüm/ekran-okuma yuvarlaması içerebilir (kullanıcı da bunu belirtti). Yeni eğriyi bu 6 örneğe göre "optimize etmeye" çalışmadım — bunun yerine tüm 47 kolon çiftinde genel iyileşmeyi hedefledim, çünkü küçük örneklemi hedeflemek aşırı uydurma (overfitting) olurdu.
- Görsel şarj göstergesi (`visualCharge`/kare-tabanlı `charge.value`) ile native ölçüm arasındaki ayrışma incelendi ama düzeltilmedi — kanıt bunun gerçek fiziği etkilemediğini gösteriyor, sadece göstergenin kare düşmesinde biraz yanlış görünebileceğini gösteriyor. Ayrı, düşük öncelikli bir iş olarak bırakıyorum.

## Geri dönüş yolu

Tek satır: `src/game/config.ts` içinde `REFERENCE_TRIAL` bloğundaki `verticalChargeCurve: 0.65,` satırını silmek (veya `1` yapmak) eski lineer davranışı birebir geri getirir. `PREVIOUS_CONFIG` (REFERENCE_TRIAL=false) hiç etkilenmedi.

## Codex'ten bağımsız görüşüm

- Codex'in "ilk kolon dar pencere" teşhisini doğruladım ve **aynı harness'le** teyit ettim (375–406/376–405 ms — birebir eşleşiyor). Bu iyi bir işaret: iki bağımsız analiz aynı sayıya varıyor.
- Ek olarak, bunun **sadece ilk kolona özgü olmadığını**, referans dizisinin ortasında (id44) daha da dar bir nokta olduğunu buldum — bu daha önce hiçbir handoff notunda geçmiyor. Kullanıcı sadece ilk kolonu şikayet etti çünkü oyunun başında olduğu için en sık karşılaşılan engel; ama kök neden oraya özel değil.
- Codex'in "tam şarjın referansla aynı olduğu henüz gösterilmedi" uyarısına katılıyorum; bu düzeltme referans videosundan tam şarj süresini/eğrisini tersine mühendislikle çıkarmıyor, sadece **mevcut (deneme) eğrinin kendi iç tutarsızlığını** (dar/aşıma açık pencere) azaltıyor. Yani "artık referansla birebir aynı" demiyorum — "artık daha az kırılgan" diyorum.
- Görüş ayrılığı yok; Codex'in bıraktığı "maxChargeDuration .38 denendi, pencereyi daralttı" notunu ben de bağımsız doğruladım (kendi taramamda .45'in altına inmek pencereyi küçültüyor, yukarı çıkarmak orantılı büyütüyor ama yapısal sorunu çözmüyor — yukarıda açıkladım).

## Belirsizlikler (ölçülmedi, iddia edilmiyor)

- Bu eğrinin "doğru" üssü (0.65) keyfi seçildi — 47 kolonun tamamında minimum pencereyi büyütecek şekilde tarandı, ama Spring Ninja'nın gerçek eğrisinden türetilmedi (öyle bir veri yok). Daha düşük (0.5-0.6) daha da geniş pencere verir ama düşük şarjda (kısa dokunuş) orantısız güç artışı büyür; daha temkinli kalmak için 0.65 seçildi.
- Kullanıcının "kısa dokunuş kısa kalmalı" isteğine etkisi analitik olarak küçük görünüyor (en düşük gerekli şarj hâlâ ~%75+ kalıyor tüm kolonlarda) ama cihazda gerçek his testi yapılmadı.
- Native touch event teslim gecikmesi/örnekleme sıklığı (bazı Android/iOS sürümlerinde farklı olabilir) bu hesaba dahil değil.
