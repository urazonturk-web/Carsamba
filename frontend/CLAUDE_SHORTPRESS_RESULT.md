# Claude sonuç raporu — kısa basış aşırı zıplama düzeltmesi

Tarih: 14 Eylül 2026. Bu rapor CLAUDE_VIDEO_RESULT.md'nin ÜZERİNE gelir. Commit/push yapılmadı, cihaz testi yapılmadı.

## Kullanıcı geri bildirimi

Yeni kayıt (`ScreenRecording_09-14-2026 11-34-05_1.MP4`) sonrası: **kısa basışlar artık gereğinden fazla zıplıyor**; kontroller hâlâ Spring Ninja gibi hissettirmiyor. Öncelik açı benzerliği veya oyunu kolaylaştırmak değil, **alışılmış basış→zıplama tepkisini** yakalamak. Örnek verilen somut sayı: normalize şarj 0.20 iken hız hesaplamasına giren değer ~0.324 oluyordu (`0.2^0.7=0.324`) — bu, basılan sürenin yüzdesiyle doğrudan orantılı bir mesafe değil.

## 1) Mevcut sürüm korundu

`backups/2026-09-14-chargeResponseCurve-0.7-unified/` içine bir önceki (ortak eğri, `chargeResponseCurve: 0.7`) `config.ts`, `jump.ts` ve `CLAUDE_VIDEO_RESULT.md` kopyalandı. Bir önceki (yalnızca dikey, `verticalChargeCurve: 0.65`) sürüm zaten `backups/2026-09-14-vy-curve-0.65-vy-only/` içinde duruyordu. İkisi de geri yüklenebilir.

## 2) Devir notu ve kod incelendi

HANDOFF.md üst kısmı ve CLAUDE_VIDEO_RESULT.md okundu. `src/game/jump.ts`/`config.ts`'nin ÇALIŞAN hâli (dosyadan, varsayımdan değil) kontrol edildi: `effectiveCharge = charge^chargeResponseCurve` tek bir değer hesaplanıp hem `lateralCharge` hem `verticalCharge`'a besleniyordu; `chargeResponseCurve=0.7` idi.

## 3) Bu kayıttan basış süreleri ve sonuçları çıkarıldı

Ekrandaki "Son basış: X ms · Güç: %Y" satırı `tesseract` OCR ile (kurulum bu oturumda yapıldı, `brew install tesseract`) videonun tamamından (0-70sn, 2fps) otomatik okundu — göz kararı değil, metin tanıma. Örnek gerçek okumalar (kronolojik, tekrarlar hariç): 154/34, 396/88, 371/82, 187/42, 212/47, 404/90, 338/75, 379/84, 112/25, 288/64, 163/36, 312/69, 204/45, 246/55, 179/40, 237/53, 354/79, 229/51, 271/60, 313/69, 429/95, 263/58, 113/25...

**Doğrulama**: `%Y` ekranda gösterilen değer, `heldMs/450` (ham doğrusal şarj oranı), **uygulanan gerçek hıza karşılık gelen `effectiveCharge` değil**. Yani 112ms basışta ekran "%25" yazıyordu ama önceki (0.7) eğriyle fiziğe giren değer `0.25^0.7=0.379` (**%37.9**) idi — kullanıcının verdiği 0.20→0.324 örneğiyle aynı mekanizma. Bu, ekran etiketiyle gerçek davranış arasındaki farkı doğruluyor; ekran etiketini değiştirmedim (kapsam dışı), yalnızca fiziği düzelttim.

Bu videoda "kısa basışın çok ileri gitmesi" için TEK bir kareyle kesin, izole bir kanıt çıkaramadım (basışlar art arda hızlı geldiğinden 2fps örnekleme her sıçramayı ayrı ayrı yakalayamadı) — ama matematiksel analiz (aşağıda) ve kullanıcının doğrudan gözlemi zaten yeterli kanıt.

## 4) Referans videolarla kısa/orta/uzun basış karşılaştırması

CLAUDE_VIDEO_RESULT.md'deki 3 uçuşa (basış tahmini 0.25-0.56sn) ek olarak **11-12-55 videosunda 4 uçuş daha** (id3→4, id4→5, id5→6, id6→7) piksel takibiyle ölçüldü — toplam **7 uçuş**. Yay sıkışması (karakterin durgun tabandan yavaşça artan y-merkezi) yine kalkıştan önceki hold süresi TAHMİNİ için kullanıldı; **parmak temasının kesin zamanı görünmüyor, bu tahminlerin hepsi belirsizlik payı taşıyor** (bkz. CLAUDE_VIDEO_RESULT.md'deki aynı uyarı).

| Uçuş | Basış tahmini | vy0 (kırpma ölç.) |
|---|---|---|
| 2 (id1→2) | ~0.25s | 860.9 |
| 3 (id2→3) | ~0.30s | 921.1 |
| 6 (id5→6) | ~0.35s | 982.5 |
| 4 (id3→4) | ~0.375s | 1017.6 |
| 7 (id6→7) | ~0.375s | 820.0 |
| 5 (id4→5) | ~0.45s | 980.2 |
| 1 (id0→1) | ~0.56s | 1367.9 |

**Bulgu**: İlişki DÜZ (monoton) DEĞİL — 0.375sn'lik iki basış (jump4, jump7) 1017.6 ve 820.0 gibi çok farklı sonuç veriyor; 0.45sn'lik jump5 (980.2), 0.35sn'lik jump6'dan (982.5) daha AZ güç veriyor. Bu, CLAUDE_VIDEO_RESULT.md'deki "3 noktadan hafif iç-bükey eğilim" yorumumun **yeterli veriyle desteklenmediğini** gösteriyor — 7 noktayla bakınca gürültü/belirsizlik trendi bastırıyor. **Referans basış-güç eğrisinin tam şeklini videodan güvenilir çıkaramıyorum**; bunu artık iddia etmiyorum.

Kısa uç için (referans oyunda <0.2sn tutma) bu oturumda **temiz bir örnek bulamadım** — bu koşuda oyuncu ölçtüğüm 7 atlayışın hiçbirinde 0.25sn'nin altına inmedi. Bunu ölçülmedi diye açıkça belirtiyorum, tahmin üretmedim.

## 5) Bulgu vs varsayım ayrımı — neden `chargeResponseCurve` tamamen geri alındı

**Kanıtlanmış (matematiksel, videodan bağımsız)**: `effectiveCharge = c^p` biçimindeki HER eğri (p<1), c→0 yaklaşırken oransal olarak SINIRSIZ büyüyen bir "artı güç" verir (`c^p / c = c^(p-1) → ∞`). Bu, p=0.7 için de p=0.9 için de geçerli — **doğru p değerini bulma sorunu değil, bu eğri AİLESİNİN yapısal özelliği**. Kısa basışların "fazla güçlü" hissetmesi bu yüzden kaçınılmazdı.

**Denenip reddedilen alternatif — eşikli (piecewise) eğri**: `c<=T` için birebir doğrusal (sıfır değişiklik), yalnızca `c>T` için eğri uygulanan bir versiyon kodladım ve simüle ettim (T=0.7, p=0.6). Kısa/orta basışları MATEMATİKSEL OLARAK birebir korudu (test edildi: `c=0.1,0.25,0.5` için `effectiveCharge` tam olarak `c`'ye eşit çıktı) ve ilk kolon penceresini biraz genişletti (32ms→36ms). **Ama** 47 ölçülü kolon çiftinin tamamını taradığımda, bu eşikli eğri **9 başka kolonun penceresini daralttı** (bazıları neredeyse yarıya indi, ör. id13→14: 49.7ms→30.5ms, id17→18: 46.5ms→24.5ms) — hiçbiri ulaşılamaz olmadı ama referans videodan bu 9 kolonun ilk kolondan DAHA AZ önemli/daha az öncelikli olduğuna dair hiçbir kanıt yok. İlk kolonu iyileştirip bu 9'unu kötüleştirmeyi seçmek keyfi olurdu.

**Sonuç**: `chargeResponseCurve` şu anda **1** (tam doğrusal, hiç eğri yok). Bu:
- Kısa/orta basışları eğrinin icat edilmesinden ÖNCEKİ orijinal doğrusal tasarıma **birebir** (bit-bit aynı `vx`/`vy`) geri getiriyor — kullanıcının "0.20 → 0.324 oluyor" şikâyetini kökten çözüyor (`0.2^1=0.2`, gerçek kodla doğrulandı).
- Açının sabit (~70°) kalmasını otomatik koruyor (doğrusal eşleme zaten açıyı koruyordu — bu CLAUDE_VIDEO_RESULT.md'de zaten kanıtlanmıştı).
- Sıfır risk: hiçbir kolonun penceresi ne daralıyor ne genişliyor, çünkü hiçbir şey değişmiyor.
- İlk kolonun dar penceresi (375-406ms/450, ~32ms) **eskisi gibi duruyor — bu artık "çözülmüş" sayılmıyor.** Kullanıcının bu turdaki önceliği (tanıdık basış tepkisi) ile önceki turun önceliği (dar pencere) çatıştığında, kanıt tanıdık tepkiyi/güvenli tarafı destekliyor.

## 6) Doğrulama (kod-seviyesi, gerçek proje kodu ile)

```
c=0.05  vx=107.0(lin:107.0)  vy=294.0(lin:294.0)   açı=70.00°
c=0.25  vx=215.0(lin:215.0)  vy=590.0(lin:590.0)   açı=69.98°
c=0.60  vx=404.0(lin:404.0)  vy=1108.0(lin:1108.0) açı=69.97°
c=1.00  vx=620.0(lin:620.0)  vy=1700.0(lin:1700.0) açı=69.96°
```
Her `c` için `vx`/`vy` saf doğrusal formülle (`min + c*(max-min)`) **birebir aynı** — artık hiçbir sapma yok.

`work/first-window-fixed.cjs`: W393/402 → 375-406ms (32ms), W440 → 376-405ms (30ms) — **en baştaki (hiç düzeltme yapılmamış) ölçümle birebir aynı**, beklenen (tam geri alma).

## 7) Testler

- `node work/check-measurement-sept14.cjs` — PASS (9/9).
- `node work/check-foot-landing.cjs` — PASS (12/12).
- `node work/validate.cjs` — Babel iOS/worklet PASS; TypeScript yalnızca önceden var olan `theme.ts` 3 hatası; lint aynı taban çizgisi (`import/no-unresolved` 3, `immutability` 21) — yeni hata yok.
- `chargeResponseCurve` alanı için kod tabanında başka bozuk referans yok (`grep` ile kontrol edildi, yalnızca `config.ts` tanımı ve `jump.ts` kullanımı var).
- 47 ölçülü kolon çiftinin tamamı ve ilk kolon, hem "hiç değişiklik yok" (T=1,p=1 karşılaştırması) hem de eşikli/global alternatiflerle çapraz kontrol edildi (yukarıdaki tablo ve regresyon listesi).

## Değişmeyenler

Kolon dizisi/genişliği, ayak teması, karakter görseli, kamera, puanlama, ekrandaki "Güç: %" etiketinin hesap yöntemi (hâlâ ham doğrusal `heldMs/450` gösteriyor, `effectiveCharge` değil) — hiçbiri değiştirilmedi.

## Cihaz testi ve sınırlamalar

- **Hiçbir şey telefonda test edilmedi.**
- Bu videoda kısa basışın "ne kadar fazla" zıplattığını tek bir izole kareyle ölçüp raporlayamadım (art arda hızlı basışlar 2fps OCR taramasını aştı); kullanıcının doğrudan gözlemine ve bağımsız matematiksel analize dayanıyorum.
- Referans oyunda gerçek bir "kısa basış" (<0.25sn tahmini) örneği bu turda bulunamadı; bu boşluk açıkça belirtiliyor, doldurulmuş gibi sunulmuyor.
- Basış-güç eğrisinin TAM şeklini (doğrusal mı, hafif eğri mi) videodan güvenilir çıkaramadım — 7 nokta gürültülü/tutarsız. Bu belirsizlik, `chargeResponseCurve=1` kararının GEREKÇESİ (kanıt yokluğunda en güvenli seçenek), ama gelecekte daha temiz veri (ör. referans oyunun kendi native basış-süresi ölçümü, ki bu mümkün değil) bu kararı değiştirebilir.
- İlk kolonun dar penceresi hâlâ çözülmedi; bu bilinçli bir tercih (kullanıcının bu turdaki önceliğine göre), unutulmuş değil.
