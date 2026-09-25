# Claude sonuç raporu — basış-zıplama tepkisi kök neden incelemesi (v3 — kule genişliği tutarsızlığı çözüldü)

Tarih: 14 Eylül 2026. v2'de "kule genişliği %15-20 farklı" diye raporladığım bulgu, bu turda **yanlış ölçüm yöntemi** olduğu tespit edilerek düzeltildi ve **geri çekildi**. Commit/push yapılmadı, cihaz testi yapılmadı. Bu turda **hiçbir kod/parametre değişikliği yapılmadı** — yalnızca ölçüm ve doğrulama.

## Codex'in bu turki talebi ve nasıl karşılandığı

1. **Zaman damgalı, sınırları gösteren işaretlenmiş kareler kaydet** → Yapıldı, `backups/2026-09-14-tower-width-measurement-evidence/` içinde 5 PNG (aşağıda listeleniyor).
2. **Kule kapağının TAMAMINI (iç renk + kenarlık + gölge) ayırt et, renk-eşiği kenar pikselleri atlıyor olabilir** → Doğrulandı: eski yöntemim GERÇEKTEN kenarlık piksellerini atlıyormuş. Yeni yöntem: her satırda arka plandan (yerel referans noktasıyla) SAPMA tespiti, kenarlık dahil.
3. **Birkaç karede tekrarla, kare-genişliğine normalize ederek raporla; çözünürlük eşleşmesi görüş açısı eşleşmesini kanıtlamaz** → 3 bağımsız referans kule + 2 bizim oyun kulesi ölçüldü, ikisi de 1320px kare genişliğine normalize edildi.
4. **Yatay hızı, aynı karede sabit bir kuleye göre (characterX - towerX) ölç, kamera çevirisini iptal et** → Yapıldı: bizim oyunumuzda kule1'in 3 farklı zaman noktasındaki kayması ölçülerek vx doğrudan elde edildi (arka plan binası KULLANILMADI, doğrudan kule sınırı takip edildi).

## SONUÇ (özet)

**Kule genişliği tutarsızlığı ÇÖZÜLDÜ — gerçek bir kalibrasyon farkı YOK.** v2'deki "%15-20 fark" bulgusu, referans videoyu ÖLÇERKEN kullandığım katı renk eşiğinin (yalnızca "saf" iç dolgu rengini arayan) kenarlık/geçiş piksellerini dışarıda bırakmasından kaynaklanıyordu. Kenarlık dahil doğru ölçümle: **referans ~114px, bizim oyun ~110-115px — %1-3 fark, ölçüm gürültüsü içinde.** `reference-course.ts`'e DOKUNMADIM (dokunmaya gerek yok).

**Yeni ve önemli**: Bizim oyunumuzda yatay hız (vx) bu kez GERÇEKTEN, doğrudan (kuleye göre) ölçüldü: **1050 native px/s** — CONFIG'ten hesaplanan değerle (**1050.7**) **%0.07 fark** ile neredeyse birebir örtüşüyor. Bu, hem geometri hem hız kalibrasyonunun DOĞRU olduğuna dair en güçlü kanıt bu ana kadar.

**Kök neden hâlâ AÇIK** (Codex'in önceki talimatına uygun): geometri ve hız artık iyi doğrulandı, ama şarj eğrisinin (basış süresi → güç) referansla birebir aynı olduğu HÂLÂ kanıtlanmadı (parmak teması görünmüyor, bu fiziksel bir sınır).

---

## 1. Kule genişliği — düzeltilmiş ölçüm (Codex madde 1-3)

### 1.1 Yöntem düzeltmesi

**Eski (v2, hatalı) yöntem**: `(R>185)&(R<225)&(G>155)&(G<190)&(B>90)&(B<135)` gibi katı bir renk aralığı, yalnızca kapağın "saf" iç rengini yakalıyordu; kenarlık/gölge/geçiş pikselleri (anti-aliasing) dışarıda kalıyordu.

**Yeni yöntem**: Her satırda, arka planın YEREL bir referans noktasından (pencerenin hemen dışından alınan piksel) ne kadar SAPTIĞI ölçülüyor (`|piksel - yerel_arkaplan| toplamı > 15`). Bu, kenarlık dahil TÜM kuleyi (iç renk + kenarlık + geçiş pikselleri) yakalıyor. Aynı satırda birden fazla y-değeri denenerek tutarlılık kontrol edildi.

### 1.2 Ölçülen genişlikler (3 bağımsız referans kule + 2 bizim oyun kulesi)

| Kaynak | Zaman | Kule | Native px genişlik | Kare genişliğine oranı |
|---|---|---|---|---|
| Referans (11-12-55) | t=30.35s | kule1 (7 satır, y=1636-1680) | **114** (tam tutarlı) | 0.0864 |
| Referans (11-12-55) | t=30.35s | kule2 (6 satır, y=1200-1250) | **114** (tam tutarlı) | 0.0864 |
| Referans (11-12-55) | t=35.60s | 3. bağımsız kule (yeni zaman, farklı kule) | **114** | 0.0864 |
| Bizim oyun (10-12-17) | t=16.00s | kule1 (piksel-piksel kenarlık taraması) | **110** | 0.0833 |
| Bizim oyun (10-12-17) | t=16.00s | kule2 (6 satır, y=1190-1210) | **114-116** | 0.0864 |

**Fark**: referans ortalama 114, bizim oyun ortalama ~112.5 → **%1.3 fark** (kare-genişliğine normalize edilmiş oranlarda: 0.0864 vs 0.0852, **%1.4 fark**). Bu, video sıkıştırma/anti-aliasing'in kendi başına yaratabileceği belirsizlikten (±2-3px, yani ±%2-3) küçük — **istatistiksel olarak anlamlı bir kalibrasyon farkı YOK**.

**v2'deki hatalı bulgunun düzeltilmesi**: v2'de referans kule genişliğini (eski yöntemle) 95-97px olarak rapor etmiştim; asıl değer 114px. Hata büyüklüğü: (114-96)/114 ≈ **%16** — tam olarak v2'de "bulduğum" farkın büyüklüğüne denk düşüyor. Yani v2'nin "kule genişliği tutarsızlığı" bulgusu **tamamen ölçüm yöntemi hatasıydı**, gerçek bir geometri sorunu değildi.

### 1.3 İşaretlenmiş kanıt dosyaları (kalıcı, `backups/2026-09-14-tower-width-measurement-evidence/`)

- `ref_t30.35_annotated_v1_strict.png` — ESKİ (hatalı, dar) ölçümün görsel karşılaştırması.
- `ref_t30.35_annotated_corrected.png` — Referans, t=30.35s, kule1 (kırmızı çizgiler, 356-469) ve kule2 (yeşil çizgiler, 1176-1289) — her ikisi de 114px, sınırlar kenarlık dahil tam kule kapağının üzerinde.
- `ref_t35.60_tower_corrected.png` — Referans, t=35.60s, 3. bağımsız kule (128-241 native px) — çapraz doğrulama.
- `ours_t16.00_annotated.png` — Bizim oyun, t=16.00s (10-12-17.MP4, 404ms/%90 basış), her iki kule işaretli.
- `ours_drift_sequence.png` — Bizim oyunda kule1'in sol kenarının 3 farklı zamanda (16.00/16.10/16.20) kaydığını gösteren dikey karşılaştırma (vx ölçümünün görsel kanıtı, Bölüm 2).

## 2. Yatay hız — kule-göreli ölçüm (Codex madde 4)

**Yöntem**: Arka plan binası KULLANILMADI (kamera/parallax davranışı doğrulanamadığı için). Bunun yerine, bizim oyunumuzda kule1'in kendi kenarlığının (aynı ayırt edici koyu kahverengi renk, `R:85-130,G:65-110,B:45-95`) SOL kenarının piksel konumu, üç farklı zaman noktasında (aynı y-şeridinde, y=1925 native) hassas piksel taramasıyla bulundu:

| Zaman | Kule1 sol kenar (native px) | Önceki noktadan fark |
|---|---|---|
| t=16.00s | 310-312 | — |
| t=16.10s | 204-207 | -105px / 0.10s |
| t=16.20s | 100-102 | -104px / 0.10s |

İki ardışık aralık neredeyse BİREBİR aynı hızı veriyor (-105 ve -104 px/0.1s) — bu, karakterin sabit hızla uçtuğunu ve ölçümün gürültüsüz olduğunu doğruluyor. Kule genişliği de üç karede sabit kalıyor (108-110px), yani bu gerçekten AYNI kulenin kayması, farklı bir nesneye geçiş değil.

**Sonuç**: t=16.00→16.20 (0.20s) arası toplam kayma = 210px → **vx = 1050 native px/s** (kameraya göre kulenin kayma hızı = karakterin dünya-uzayındaki yatay hızına eşit, kamera karaktere kilitli olduğu için — bu, referans oyunda da doğrulanmış aynı mekanizma).

**CONFIG'ten hesaplanan** (c=0.898, W=440, doğrusal `chargeResponseCurve=1`): vx = (80+0.898×540)×1 dünya-birimi/s × 1.86 (dünya→native çevirim) = **1050.7 native px/s**.

**Ölçülen / hesaplanan = 1050 / 1050.7 = %99.93 — %0.07 fark.** Bu, bu projede şimdiye kadar yapılan EN hassas doğrudan-ölçüm/hesaplama karşılaştırması ve fizik motorunun yatay hızı da doğru uyguladığını çok güçlü şekilde doğruluyor.

**Açı**: ölçülen vx (1050) + önceki turda ölçülen vy0 (2805.5, dikkatli fit) → açı = **69.48°**. CONFIG'ten hesaplanan açı = 69.96°. Referans videodan ölçülen açı (önceki turlar) = ~69.6°. Üçü de birbirine çok yakın (68-70° bandında).

## 3. Yükseklik farkı ve boşluk — düzeltilmiş sayılarla

Aynı kenarlık-dahil yöntemle yeniden hesaplandı:

| | Referans | Bizim oyun | Fark |
|---|---|---|---|
| Boşluk (kule1 sağ kenar → kule2 sol kenar) | 1176-469 = **707px** | 1124-420 = **704px** | %0.4 |
| Kule genişliği | 114px | 110-115px | %1-3 |

Boşluk ölçümü de artık ÇOK yakın (%0.4 fark) — v2'deki daha kaba ölçümle bulduğum "%1-3" sonucuyla tutarlı, bu turda daha da netleşti.

## 4. Sonuç: somut bir kalibrasyon uyuşmazlığı YOK

Codex'in istediği "somut bir kalibrasyon uyuşmazlığı tanımla, doğrulanırsa en küçük geri alınabilir düzeltmeyi uygula, yoksa kalan belirsizliği tanımla" talimatına göre: **doğrulanmış bir uyuşmazlık YOK**. Kule genişliği (%1-3), boşluk (%0.4) ve yatay hız (%0.07) hepsi ölçüm gürültüsü sınırları içinde eşleşiyor. **Bu yüzden hiçbir parametre değiştirilmedi.**

## 5. Kalan belirsizlik (kök neden hâlâ açık)

1. **Şarj eğrisinin gerçek şekli**: hâlâ ölçülemiyor. Geometri ve hız artık iyi doğrulandığına göre, kalan olası fark KAYNAĞI ya (a) referans oyunun basış-süresi→güç eşlemesinin bizimkinden (doğrusal) farklı bir şekle sahip olması, ya da (b) iniş toleransının/kabul mantığının farklı olması (Bölüm 6, v2'den — ayak-kule görsel boşluğu, kesin ölçülemedi) olabilir. İkisi de bu turda ek kanıt üretilmedi.
2. **Dikey hız (vy) için aynı hassasiyette kule-göreli ölçüm yapılmadı** — vy zaten (önceki turlarda) parabol-fit ile ölçülmüştü ve CONFIG'le %2.6 fark gösteriyordu (kabul edilebilir), ama BU turun "characterX-towerX" yöntemiyle çapraz doğrulanmadı. Küçük bir ek doğrulama olurdu, bu turda zaman kısıtı nedeniyle yapılmadı.
3. **Referans oyunun KENDİ başarı penceresinin genişliği** hâlâ ölçülmedi (yalnızca başarılı bir koşunun videosu var).

## 6. Değişen dosyalar

**Hiçbiri.** Bu tur yalnızca ölçüm/doğrulama; kod, config, tsconfig — hiçbiri değişmedi. Önceki turların değişiklikleri (`app/index.tsx` satır 267, `tsconfig.json` exclude bloğu) aynen duruyor.

## 7. Testler

Kod değişmediği için test paketi yeniden çalıştırılmadı (bir önceki turda PASS almıştı, değişmeyen kod için sonuç aynı kalır).

## 8. Yedekleme

`backups/2026-09-14-tower-width-measurement-evidence/` — 5 işaretlenmiş kanıt PNG'si (yukarıda listelendi). Önceki yedekler (`backups/2026-09-14-before-takeoff-position-fix/`) aynen duruyor. Geri dönüş gereken bir kod değişikliği yok.
