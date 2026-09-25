# Claude sonuç raporu — üst-şarj bölgesi için geri alınabilir deneysel aday (UYGULANMADI)

> **✅ KAPATILDI (15 Eylül).** Düzeltilmiş kalkış-konumuyla (Bölüm 9-10) yeniden hesaplanan sonuç: kazanç (3 geçişte +19ms) ile kayıp (3 geçişte −6 ila −12ms) büyüklük ve sayı olarak dengeli — net bir fayda yok. **Bu deneme kalıcı olarak UYGULANMAYACAK, daha fazla üstel/sınır denenmeyecek.** Devam eden çalışma için bkz. `CLAUDE_LONGJUMP_RESULT.md` Bölüm 18 (tek, doğrulanmış gerçek atlayış örneği).

Tarih: 15 Eylül 2026. Önceki turda önerilen küresel `maxJumpVX`/`maxJumpVY` azaltması (k≈0.74-0.85, yani %15-26'lık bir azaltma) kullanıcı tarafından reddedildi — haklı olarak: bu, ara şarjları da değiştiriyordu, iyileştirilmiş ilk atlayışı riske atıyordu, ve "tam-şarj isabet sayısı" tek başına bir başarı ölçütü değil. Bu turda, YALNIZCA üst-şarj bölgesini değiştiren, ilk atlayışı MATEMATİKSEL OLARAK BİREBİR koruyan bir alternatif tasarlandı, gerçek kodla (tüm platformlara karşı gerçek çarpışma kuralıyla) test edildi ve **UYGULANMADI** — bu bir oyun deneyi önerisidir, ölçülmüş Spring Ninja eşdeğerliği DEĞİLDİR. Kod değişmedi, commit/push yok.

## 1. Korunacak sınır — keyfi değil, gerçek "ilk atlayış" penceresinden türetildi

"İlk atlayış" = her yeni hayatın başında yapılan, kule0'dan kule1'e geçen atlayış. Gerçek kodla (`jump.ts`+`landing.ts`+`reference-course.ts`, tüm platformlara karşı gerçek çarpışma) bu geçişin ŞU ANKİ (doğrusal) haritalamada başarılı olduğu TAM aralığı buldum:

```
kule0 -> kule1 başarı penceresi: c ∈ [0.8472, 0.9168]  (381ms - 413ms)
```

**Korunacak sınır = 0.917 (~413ms)** — bu pencerenin ÜST ucu. Yani: `c ≤ 0.917` için şarj-hız haritalaması BUGÜNKÜYLE BİREBİR AYNI kalacak (ilk atlayış ve altındaki her şey dokunulmamış); yalnızca `c > 0.917` için (kalan ~%8.3'lük dilim, ~37ms) bir değişiklik denenecek.

## 2. Kalan üst bölge ÇOK küçük — bunu açıkça belirtiyorum

`c ∈ (0.917, 1.0]` aralığı yalnızca **37ms** genişliğinde (450ms'lik maksimumun %8'i). Bu, "geniş bir alan" değil — baştan uyarıyorum: bu kısıtla, HERHANGİ bir yeniden şekillendirmenin parkurun TÜMÜNÜ düzeltmesi beklenemez.

## 3. Denenen 1. aile — "sıkıştırma" (c=1'de effectiveCharge<1): BAŞARISIZ, kapasite kaybı

İlk denediğim yaklaşım: `c=0.917`'nin üzerinde, çıkışı daha küçük bir üst sınıra (`effectiveCharge(1)=0.95` veya `0.90`) sıkıştırmak — yani önceki turun küresel azaltmasının KÜÇÜK/kısıtlı bir versiyonu. Gerçek kodla 5 temsilî kule (0,3,6,7,9) üzerinde tam tarama:

```
effectiveCharge(1)=0.95:  kule3'ün 3-kule penceresi (c=0.989) TAMAMEN KAYBOLUYOR
                          kule7'nin 3-kule penceresi (c=0.986) TAMAMEN KAYBOLUYOR
effectiveCharge(1)=0.90:  kule3, kule6, kule7, kule9'un TÜM 3-kule pencereleri KAYBOLUYOR
                          hiçbir yerde YENİ veya GENİŞLEMİŞ bir pencere OLUŞMUYOR
```

**Sonuç: bu aile işe yaramıyor.** Sebep matematiksel olarak açık: bu parkurdaki 3-kule atlayışların çoğu `effectiveCharge≈0.98-0.997` gerektiriyor — yani neredeyse TAM `c=1`. Üst sınırı `1`'in altına çekmek bu atlayışları basitçe ULAŞILAMAZ kılıyor, hiçbir yerde onun yerine geçecek daha güvenli bir pencere OLUŞTURMUYOR. Bu aile TERK EDİLDİ.

## 4. Denenen 2. aile — "yavaşlayarak-üste-varan" (ease-out) eğri: KISMİ, KARIŞIK sonuç

İkinci yaklaşım: `c=1`'de `effectiveCharge=1` KORUNARAK (yani mevcut maksimum menzil kaybı YOK), yalnızca `[0.917, 1]` aralığının İÇİNİ, üst uca yaklaşırken YAVAŞLAYAN bir eğriyle (`effectiveCharge = 0.917 + 0.083 × t^p`, `t=(c-0.917)/0.083`, `p<1`) yeniden şekillendirmek. Bu, `c=1`'deki menzili DEĞİŞTİRMEZ, yalnızca oraya ne kadar HIZLI yaklaşıldığını değiştirir — üst uçtaki hassasiyeti (küçük basış farkının ne kadar büyük mesafe farkına yol açtığını) azaltmayı hedefler.

`p=0.3` ile gerçek kod taraması (5 kule, tüm platformlara karşı):

```
                  MEVCUT (temel)              ADAY (p=0.3, sınır=413ms)           Değişim
kule0->kule1      381-413ms                   381-413ms (AYNI)                    Değişmedi — İLK ATLAYIŞ BİREBİR KORUNDU
kule3->kule5      384-422ms                   384-413ms                           Kuyrukta 9ms kayıp (küçük)
kule3->kule6      445-450ms (5ms genişlik)    436-450ms (14ms genişlik)           2.8× GENİŞLEDİ, min basış 445->436ms
kule6->kule9      388-427ms (39ms genişlik)   388-414ms (26ms genişlik)           13ms DARALDI (gerileme)
kule7->kule9      329-373ms                   329-373ms (AYNI)                    Değişmedi
kule7->kule10     444-450ms (6ms genişlik)    432-450ms (18ms genişlik)           3× GENİŞLEDİ, min basış 444->432ms
kule9->kule11     381-420ms                   381-420ms (AYNI)                    Değişmedi
kule9->kule12     442-450ms (8ms genişlik)    430-450ms (20ms genişlik)           2.5× GENİŞLEDİ, min basış 442->430ms
```

**Kayıp kapasite yok** — bu ailede, mevcut durumda ulaşılabilen HİÇBİR hedef tamamen ulaşılamaz hale gelmiyor (sıkıştırma ailesinden farklı olarak). Ama sonuç KARIŞIK:
- **3 geçişte (kule3→6, kule7→10, kule9→12) gerçek, ölçülebilir bir iyileşme var**: pencere 2.5-3× genişliyor VE gereken minimum basış süresi 8-14ms kısalıyor (yani "sonuna kadar bas" daha az kıl payı hale geliyor).
- **1 geçişte (kule6→9) gerileme var**: bu geçişin penceresi zaten kısmen sınırın ALTINDA (388-413ms, dokunulmuyor) başlıyordu ama ÜST kuyruğu (413-427ms) yeniden şekillendirmeden olumsuz etkileniyor, 13ms kayboluyor.
- **2 geçişte (kule0→1, kule7→9, kule9→11) hiçbir değişiklik yok** (pencereleri zaten tamamen sınırın altında).

## 5. Dürüst değerlendirme

**Bu, net bir kazanç DEĞİL — küçük, karışık bir değiş-tokuş.** Kalan üst bölge (yalnızca 37ms) o kadar dar ki, onu yeniden şekillendirmek bazı geçişleri iyileştirirken bazılarını kötüleştirmeden yapılamıyor — 5 örnekten 3'ü iyileşiyor, 1'i kötüleşiyor, 2'si değişmiyor. İyileşen pencereler bile MUTLAK olarak hâlâ dar (en iyi ihtimalle 20ms, 450ms'lik toplam aralığın %4.4'ü) — bu "sorunu çözüyor" değil, "biraz daha az kırılgan yapıyor" düzeyinde bir etki.

**Zorlanmadı**: Otomatik nişan alma veya farklı bir çözüm İCAT EDİLMEDİ; yalnızca kullanıcının izin verdiği kısıtlar (ilk atlayışı birebir koru, yalnızca üst bölgeyi değiştir) içinde ne mümkün olduğu dürüstçe test edildi ve raporlandı.

## 6. Bu bir OYUN DENEYİDİR, ölçülmüş Spring Ninja eşdeğerliği DEĞİLDİR

Bu tasarım, Spring Ninja'nın gerçek basış süresine dayanmıyor (o hâlâ ölçülemedi, bkz. CLAUDE_FINGER_TOUCH_RESULT.md). Yalnızca kendi fiziğimizin kendi içindeki (video-bağımsız, kod-tabanlı) "üst uçta dar/kırılgan pencere" bulgusuna, ve "ilk atlayışı bozmadan bunu biraz yumuşat" hedefine dayanan bir MÜHENDİSLİK DENEMESİDİR.

## 7. Karar — kullanıcı seçmeden UYGULANMADI

Üç seçenek var:
1. **Bu denemeyi (p=0.3, sınır=413ms) uygula** — 3 geçişte küçük iyileşme, 1 geçişte küçük gerileme, ilk atlayış korunur.
2. **Denemeyi UYGULAMA** — mevcut, tamamen doğrusal haritalamayı koru; üst uçtaki dar pencereler kalır ama hiçbir geçiş kötüleşmez.
3. **Farklı bir `p` değeri dene** (örn. p=0.5, daha ılımlı — daha az genişleme ama kule6→9'daki gerileme de daha küçük: 39ms'den 29ms'e, yalnızca 10ms kayıp).

**Kodda hiçbir değişiklik yapılmadı.** Kullanıcı seçerse, seçilen `p` değeriyle: (a) gerçek `jump.ts`'e uygulanacak, (b) kısa/orta basışların (c≤0.917) gerçek kodla DEĞİŞMEDİĞİ doğrulanacak, (c) yedek alınacak, (d) tam parkur taraması tekrarlanıp güncellenmiş bir tablo raporlanacak.

## 9. DÜZELTME — temel simülasyon hatası bulundu: yanlış kalkış (spawn) konumu

Kullanıcı, Codex'in aynı kule0→1 penceresi için ~374-405ms bulduğunu, benim ise 381-413ms bulduğumu belirtip hangisinin GERÇEK oyunla eşleştiğinin doğrulanmasını istedi. Beş olası fark kaynağını tek tek kontrol ettim:

| Kontrol edilen | Sonuç |
|---|---|
| Ekran genişliği (W) | `useWindowDimensions()` → bu cihaz için 440, simülasyonumda da 440 — fark yok |
| Karakter/ayak-tabanı boyutları | `CHARACTER_WIDTH=116.64`, `bodyWidth=93.312`, `footSoles=[[0.20,0.41],[0.59,0.795]]` — gerçek `CONFIG`'ten okunuyor, simülasyonumla birebir aynı — fark yok |
| Zaman adımı (dt) | dt=1/240, 1/120, 1/60 ile tekrar test ettim — **üçü de AYNI sonucu veriyor** (374-404ms) — dt fark yaratmıyor |
| Tüm-platform çarpışma mantığı | Gerçek `findFootLanding`'i TÜM kule listesine karşı çağırıyordum zaten — fark yok |
| **Gerçek kalkış (takeoff) konumu** | **HATA BURADA BULUNDU** |

Gerçek kodda (`app/index.tsx:277`): `px.value = first.x + first.width * 0.5;` — yani karakter bir kulenin ÜZERİNDE dururken, kulenin SOL KENARINDAN değil, kulenin TAM ORTASINDAN atlıyor. Benim simülasyon script'im ise `launch.x`'i (kulenin sol kenarı) doğrudan başlangıç konumu olarak kullanıyordu — kule genişliğinin YARISI kadar (~30 dünya birimi) SOL'a kaymış bir noktadan atlatıyordu.

**Düzeltmeden sonra** (`px = launch.x + launch.width * 0.5`): kule0→1 penceresi **374-404ms** çıkıyor — Codex'in bildirdiği ~374-405ms ile (1ms farkla) BİREBİR ÖRTÜŞÜYOR. **Codex'in sonucu doğruydu; benim önceki simülasyonumda gerçek bir hata vardı, şimdi düzeltildi.**

**Bu hatanın kapsamı**: Bu, yalnızca bu turun değil, ÖNCEKİ turlarda (CLAUDE_LONGJUMP_RESULT.md dahil) `launch.x`'i doğrudan kullanan TÜM tam-parkur taramalarını etkileyen SİSTEMATİK bir hataydı — her kuleden atlayış, gerçek oyundakinden yaklaşık yarım-kule-genişliği kadar farklı bir noktadan başlatılmıştı. O belgedeki kesin sayılar (ör. "10 kuleden 7'si ıskalıyor") bu yüzden YAKLAŞIK doğru yönde ama KESİN olarak güvenilir değil — ayrı bir turda yeniden hesaplanmalı. Bu turun odak sorusu (üst-şarj denemesi) için gereken düzeltme aşağıda yapıldı.

## 10. Düzeltilmiş sınır ve TAM, belirsizliksiz sonuç tablosu

Düzeltilmiş kalkış konumuyla, kule0→1 penceresinin üst ucu artık **0.898 (~404ms)** — yeni korunacak sınır bu. Aynı 5 kule, AYNI önceden seçilmiş `p=0.3` üstel eğrisi (yeni bir üstel DENENMEDİ) ile, düzeltilmiş kalkış konumu ve düzeltilmiş sınırla tam tarama tekrarlandı:

```
Geçiş        Temel (düzeltilmiş)   Aday p=0.3 (düzeltilmiş sınır=404ms)   Değişim
kule0->1     374-404ms (30ms)      374-404ms (30ms)                       DEĞİŞMEDİ
kule7->9     316-361ms (45ms)      316-361ms (45ms)                       DEĞİŞMEDİ
kule3->5     373-412ms (39ms)      373-404ms (31ms)                       -8ms (kuyruk kaybı)
kule6->9     378-417ms (39ms)      378-405ms (27ms)                       -12ms (kuyruk kaybı)
kule9->11    370-410ms (40ms)      370-404ms (34ms)                       -6ms (kuyruk kaybı)
kule3->6     436-450ms (14ms)      417-450ms (33ms)                       +19ms (genişledi)
kule7->10    434-450ms (16ms)      415-450ms (35ms)                       +19ms (genişledi)
kule9->12    433-450ms (17ms)      414-450ms (36ms)                       +19ms (genişledi)
```

**Önceki turdaki "3 iyileşme, 1 gerileme, 2 değişmedi" özeti YANLIŞ/EKSİKTİ** (8 geçişten yalnızca 6'sını saymıştı, hem de düzeltilmemiş sayılarla). Düzeltilmiş ve TAM sayım: **8 geçişten 2'si değişmedi, 3'ü genişledi (+19ms), 3'ü daraldı (−6 ila −12ms).**

## 11. Bu deneyin pratik değeri var mı? — DÜRÜST CEVAP: HAYIR, tek başına değil

Kazançlar (3 geçişte +19ms) ile kayıplar (3 geçişte −6 ila −12ms) BÜYÜKLÜK OLARAK KARŞILAŞTIRILABİLİR ve SAYI OLARAK EŞİT (3'e 3). Bu bir net iyileşme değil — **darlığı bir yerden alıp başka bir yere taşıyan bir DENGE (wash)**, gerçek bir kazanım değil. Kullanıcının kendi belirlediği ölçüte göre ("birkaç milisaniyelik karışık kazanımlar, kontrolleri değiştirmeyi tek başına haklı çıkarmaz") bu deney **HAYIR** — tek başına faydalı değil.

**Yapısal bir gözlem**: Sınırı geçen (baseline'da sınırın altında başlayıp üstünde biten) her pencere, yeniden şekillendirmeden kuyruk kaybı YAŞIYOR; yalnızca TAMAMEN sınırın ÜSTÜNDE yaşayan pencereler genişliyor. Bu, seçilen `p` değerinden bağımsız, YAPISAL bir özellik — sınırda eğim değiştiren HERHANGİ bir yeniden şekillendirme aynı değiş-tokuşu üretir. Bu yüzden farklı bir üstel denemek (istenmedi, denenmedi de) bu temel dengeyi muhtemelen ORTADAN KALDIRMAZ, yalnızca hangi geçişlerin kazanıp hangilerinin kaybettiğini değiştirir.

**Sonuç**: Bu turda yeni bir üstel denenmedi (istendiği gibi). Mevcut kanıtla, "yalnızca üst bölgeyi değiştir" yaklaşımının, kontrolleri değiştirmeye değecek net bir fayda sağlamadığı görülüyor. Kod DEĞİŞTİRİLMEDİ.

## 8. (İlk versiyon) Bu turda değiştirilmeyenler

- `src/game/jump.ts`, `src/game/config.ts`, `src/game/landing.ts`, `src/game/reference-course.ts`, `app/index.tsx` — HİÇBİRİ değiştirilmedi. Tüm hesaplamalar ayrı analiz betikleriyle (`/tmp/full_compare.cjs`), gerçek kodu İÇE AKTARIP çalıştırarak yapıldı, oyun koduna dokunulmadan.
- İlk atlayışın mevcut tepkisi matematiksel olarak (c≤0.917 için haritalama birebir aynı) korunuyor.
- Yedek almaya gerek olmadı (kod değişikliği yok).
