# PLAN — Oyun sonu ekranının toparlanması (Byzantion, 2026-11-23)

## Hedef
1. Oyun sonu kartpostalı küçülsün; arkadaki mahalle/kuleler görünür kalsın, okunurluk ve dokunma kolaylığı bozulmasın.
2. "🐈 X ile tanıştın!" gibi bildirimler (toast) skorun, oyun sonu kartının ya da menü kartının üstüne binmesin.

## Kapsam ve dosyalar
- Yalnız `frontend/app/index.tsx`: oyun sonu JSX'i (`{gameOver && FAZ1_UI && (` bloğu, `testID="game-over-overlay"`), toast JSX'i (`{toast && (` bloğu, `styles.toastWrap`), StyleSheet.
- `pcWrap`, `pcCard`, `pcInner`, `pcScore`, `pcIconCircle` vb. stiller **menü kartı ve yarış sonucu kartıyla paylaşılıyor** (index.tsx'te `MENU_ON && menuOpen` ve ikinci `pcWrap` bloğu). Bu yüzden mevcut stiller değiştirilmez; oyun sonuna özel ek stiller (`go*` önekli ya da `pc*Go`) eklenir ve yalnız oyun sonu bloğunda kullanılır.
- Değişmeyecekler: fizik, kamera, çarpışma, çatı, kule, iniş, skor/rekor mantığı, düğmelerin işlevleri ve testID'leri, paylaşım kartı (ShareCard.tsx), menü kartı.

## Yaklaşım
### A) Kartı küçültme
- Ölçüm (iPhone 17, 402×874 pt; mevcut ekran görüntüsü): kart ekran yüksekliğinin ~%53'ü, genişliğin ~%86'sı.
- Hedef: kart yüksekliği ≤ ekranın %40'ı (iPhone 17) ve iPhone SE 3 (375×667 pt) ekranına kesilmeden sığması; genişlik ~%76, en fazla 330 pt.
- Araçlar: skor yazısı 76 → ~54 pt (CountUp aynı), iç boşluklar (pcInner padding/margin) küçülür, selam satırı 20 → 17 pt, ikon daireleri 54 → 44 pt (dokunma alanı hitSlop ile ≥ 44 pt kalır), "Bir daha" düğmesi tam genişlik ama dikey dolgu biraz azalır, çıkartma (amca kafası) 84 → 70 pt ve pul 54×64 → 46×54 pt orantılı.
- Kart dikeyde ortada değil, ekranın üst-orta kısmında dursun (overlay `justifyContent: "flex-start"` + `paddingTop: insets.top + ~70`), alt yarıda kuleler ve amcanın düştüğü yer görünsün. Karartma (overlay arka planı) 0.35 → ~0.22.
- Lakap/durak satırları `numberOfLines={1} adjustsFontSizeToFit` olarak kalır.
- **Yükseklik sınırı ve taşma:** Kartın kullanılabilir yüksekliği `maxH = H − cardTop − insets.bottom − 72` (72 pt alttaki toast şeridi için ayrılır: 8 pt boşluk + en fazla 2 satırlık toast ≈ 15 pt yazı × 2 × 1,3 satır aralığı + 16 pt dolgu ≈ 55 pt, artı pay; `cardTop = insets.top + 70`). Kart sarmalayıcısına `maxHeight: min(maxH, 0.60 × H)` verilir (seyrek koşullu içerikte bile kart ekranın %60'ını geçmez); kartın gövdesi (`pcInner` içeriği) bir `ScrollView` içine alınır (`bounces={false}`, içerik sığıyorsa kaydırma görünmez, `showsVerticalScrollIndicator` yalnız taşmada). Böylece gelen meydan okuma + arkadaş sonucu + şaka balonu + lakap/durak birlikte gelse de "Bir daha" ve ikon düğmeleri kaydırarak her zaman erişilebilir, kart ekran dışına taşmaz. Çıkartma ve pul `ScrollView` dışında, kart çerçevesine bağlı kalır.
- Yeni rekor damgası (Postmark) konumu küçülen karta göre kontrol edilir; kartın dışına taşmamalı.

### B) Bildirim çakışması
- Oyun sırasında toast, HUD'ın (skor, REKOR ve o an görünen tüm çipler: meydan okuma, kurukafa, günlük harita; satır kayması dahil) **ölçülen** alt kenarının 8 pt altına iner. HUD `View`'üne `onLayout` eklenir; `hudBottom = layout.y + layout.height` state'e yazılır (aynı ebeveyn içinde, toast ile aynı koordinat sistemi). Toast `top = max(insets.top + 64, hudBottom + 8)`; HUD henüz ölçülmediyse yedek `insets.top + 150`. Çip eklenip kalkınca onLayout yeniden çalışır, toast kendiliğinden kayar. Sabit tahmini değer kullanılmaz.
- Oyun sonu kartı açıkken toast, kartın **ölçülen** alt kenarının 8 pt altına konur: kart sarmalayıcısına `onLayout` → `goCardBottom` (y + height); toast `top = goCardBottom + 8`. Oyun sonundaki toast `numberOfLines={2}` + `ellipsizeMode="tail"` ile en fazla 2 satır gösterir (uzun Game Center / hata metinleri kısalır); kartın `maxHeight` sınırı bu azami yüksekliğe göre 72 pt bırakır, bu yüzden toast ekranın içinde kalır ve kartla kesişmez. Oyun sırasındaki toast en fazla 3 satır (`numberOfLines={3}`). Ölçüm yoksa yedek `bottom: insets.bottom + 24`.
- Menü açıkken toast aynı kuralla menü kartının altına değil, ekranın altına (`bottom: insets.bottom + 24`) alınır; menü kartı değiştirilmediği için bu yalnız konum kuralıdır (menü kartının alt kenarı ekranın altından en az 64 pt yukarıda olduğu iPhone 17 ve SE ekran görüntüsüyle doğrulanır; değilse menüde de kart alt kenarı ölçülerek aynı kural uygulanır).
- Kedi tanışma toast'ı 900 ms gecikmeyle geliyor; oyun sonu o sırada açılırsa toast alta düşer (yukarıdaki kural). Toast metni ve süresi (2,6 sn) değişmez.

## Kabul ölçütleri
1. iPhone 17 simülatöründe **olağan içerikte** (skor + rekor satırı + durak/lakap satırları + "Bir daha" + 3 ikon + Ana menü; meydan okuma/arkadaş sonucu/şaka balonu yok) kartın dış çerçevesi ekran yüksekliğinin ≤ %40'ı (PIL ile ölçülür; ölçüm dosyası rapora eklenir). Bu hedefi sağlayan somut boyutlar: genişlik min(%76, 330 pt), skor 54 pt, selam 17 pt, ikon 44 pt, pcInner dikey dolgu 10/8 pt, düğme dikey dolgu ~10 pt; ölçüm %40'ı aşarsa önce dolgular, sonra skor 48 pt'ye indirilir. Seyrek koşullu içerikte kart en fazla %60, fazlası kaydırılır; menü kartı piksel olarak eskisiyle aynı (önce/sonra ekran görüntüsü).
2. iPhone SE 3 (ya da en küçük mevcut simülatör) üzerinde kart ve tüm düğmeler kesilmeden görünür.
3. Oyun sırasında toast, HUD'ın hiçbir öğesiyle çakışmaz; en kötü durum (kurukafa çipi + meydan okuma çipi + günlük harita çipi aynı anda, geçici test bayrağıyla) dahil ekran görüntüsünde dikdörtgenler kesişmez.
4. Oyun sonu açıkken toast kartla çakışmaz ve ekranın içinde kalır; en kötü durum (tüm koşullu içerik aynı anda, geçici test bayrağıyla) iPhone SE boyutunda dahil; çok uzun (ör. 200 karakter) örnek toast metniyle de. Bu durumda kart kaydırılabilir, düğmeler kaydırarak erişilebilir.
5. "Bir daha", Paylaş, Meydan oku, Sıralama, Ana menü dokunuşları çalışır.
6. `npx tsc --noEmit -p .` (app/src/modules satırlarında yeni hata yok) ve `node ai_review_evidence/test_worklet_order_regression.cjs` PASS.

## Doğrulama komutları
- `cd frontend && npx tsc --noEmit -p . | grep -E "^(app|src|modules)/" | grep -v src/theme.ts` → boş.
- `node ai_review_evidence/test_worklet_order_regression.cjs` → PASS.
- Simülatör derleme: `xcodebuild -workspace ios/frontend.xcworkspace -scheme frontend -configuration Release -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' -derivedDataPath ~/Library/Developer/Xcode/DerivedData/carsamba-sim -jobs 4 build`; iPhone 17 ve küçük ekranlı simülatörde oyun sonu + menü ekran görüntüsü; ölçüm için python/PIL ile kart sınırı.
- Toast çakışmasını görmek için geçici test bayrağı (teslimde kapalı): oyun başlar başlamaz örnek toast ve oyun sonunda örnek toast.

## Riskler
- Paylaşılan stiller yanlışlıkla değişirse menü kartı bozulur → yalnız yeni stil anahtarları.
- Küçük ekranda Lakap/durak satırları sığmayabilir → adjustsFontSizeToFit zaten var; kontrol edilecek.
- Toast'ın altta durması Game Center meydan okuma bildirimlerini de etkiler (o da altta görünür) — bilinçli tercih.
- Kullanıcı tasarımı görsel olarak kabul edecek; telefonda video bekleniyor.

## Yetki
Kullanıcı: "Oyun sonu ekranıyla başla" (Claudex Loop denemesinin ilk özelliği). Kod değişikliği yetkili; commit/push yetkisi yok.

## Uygulama sırasında sapmalar (onaydan sonra, inceleme için)
- Alt pay 72 → **86 pt** ve yeni rekorda toast `goCardBottom + 22`: yeni rekor damgası (Postmark) küçük sürüme (`small`, mevcut `pcPostmarkSm`) alındı; bu damga kartın sağ alt köşesinden ~18 pt taşar, toast'la çakışmasın diye. Neden: iPhone 17e denemesinde büyük damga durak/lakap yazılarının üstüne biniyordu.
- Ölçümle %40 hedefini tutturmak için plandaki sıra izlendi: dolgular küçültüldü, skor **48 pt**, ayrıca durak/lakap/rekor/etiket satır aralıkları için oyun sonuna özel `goSm*` stilleri eklendi (`goSmLabel`, `goSmBest`, `goSmLine`, `goSmHand`, `goSmLakap`, `goSmLink`, `goSmIconRow`, `goSmIcon`). Mevcut `goIcon`/`goIconRow` adları başka yerde kullanıldığı için yeni adlar seçildi.
- Geçici deneme bayrağı `OYUN_SONU_TEST` kodda kaldı ama **false** (oyun başında/sonunda örnek toast, HUD'da zorlanmış çipler); teslimde kapalı.
- iPhone SE simülatörü yüklü değil; en küçük mevcut ekran **iPhone 17e** ile denendi (kart sığdı, toast kartın altında).

## İnceleme kapsamı notu
Çalışma ağacında bu işten önce de commit edilmemiş başka değişiklikler var (kargalar, kurukafa, mahalle vb.); bunlar bu planın kapsamı dışı. Bu işin tam farkı: `frontend/ai_review_evidence/OYUN-SONU-2026-11-23/delta.patch` (yalnız `frontend/app/index.tsx`). Lütfen bu yamayı esas alın.

## Ölçüm sonuçları (simülatör)
- iPhone 17: kart yüksekliği %52,6 → **%38,4** (PIL; `once-oyunsonu.png`, `sonra-oyunsonu.png`).
- Menü kartı bölgesinde fark %0,7 (yalnız uçuşan yaprak animasyonu).
- Oyun içi toast tüm çiplerin altında (`sonra-oyun-toast.png`); oyun sonunda 200 karakterlik toast 2 satır + "…", kartın altında (`seq-oyunsonu3.jpg`, `seq-17e.jpg`).
