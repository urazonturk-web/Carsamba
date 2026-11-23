# PLAN — Mahalle sesle konuşur (Byzantion, 2026-11-23)

## İstek
Editör önerisi (YARATICI-SES-2026-11-21, iki editörün ortak 1. fikri): yazı balonu yerine inişe bağlı, ekran dışından gelen kısa mahalle sesleri. Kullanıcı kaynak kararı: "Kodla + yerel TTS" (indirme yok).

## Sesler (yeni dosyalar `frontend/assets/sounds/mahalle/`, 44,1 kHz mono WAV, her biri ≤ 1,2 sn, ≤ 120 KB)
| Ad | Nasıl | Karakter |
|---|---|---|
| `islik.wav` | Kodla sentez (numpy): iki notalı "fiyuuu" ıslığı, hafif vibrato | Uzaktan, takdir |
| `alkis.wav` | Kodla sentez: tek kişinin 4–5 el çırpışı (filtreli gürültü patlamaları, düzensiz aralık) | Uzaktan, tek kişi |
| `panjur.wav` | Kodla sentez: ahşap panjurun sertçe kapanması (alçak "tok" + kısa tıkırtı) | Düşüş/oyun sonu |
| `karga1.wav`, `karga2.wav` | Kodla sentez: kısa sert "gaak" (gürültüyle modüle edilmiş 550–900 Hz, iki biçimli) | Karga kalkışı |
| `iiih.wav` | Yerel Chatterbox (TR) ile 3 farklı tohum/ses "Iıııh!" üretilip üst üste karıştırılır | Kıl payı inişte toplu tepki |
| `hooyt.wav` | Yerel Chatterbox (TR) "Hööyt!" tek erkek sesi | Büyük çoklu zıplamada uzaktan seslenme |
Hepsine "uzaktan" işlemi: alçak geçiren süzgeç (~3–4 kHz), kısa yankı (oda/sokak), −18…−22 dBFS ortalama; oyun sesleriyle (land/multi/record/fall) yarışmaz.
Arapça/dinî ünlem yok (kullanıcı kuralı); kelime yalnız "ıııh", "hööyt".
Chatterbox çıkışı doğal değilse (dinleme yok, ben spektrogram/süre/kırpılma kontrolü yaparım), o ses kod sentezine (insan sesi olmadan) düşer veya kapalı tutulur; kullanıcı telefonda değerlendirir.

## Tetikleyiciler (yalnız JS, olay anında; kare başına iş yok)
`src/game/mahalleSes.ts`: `mahalleSes(olay, bağlam)` — soğuma süreleri ve olasılıklar burada; rastgelelik ayrı üreteçten (karga üreteci gibi mulberry32; Math.random değil).
- **Kusursuz/ortaya iniş** (`perfect > 0`): %45 olasılık, ıslık ya da alkış (sırayla değil, rastgele; aynısı üst üste en çok 2 kez), ortak soğuma 4 sn.
- **Kıl payı iniş** (iniş oranı kenara ≤ 0,12; `ratio <= 0.12 || ratio >= 0.88`): %70 olasılık `iiih`, soğuma 6 sn.
- **Büyük çoklu zıplama** (`towersCrossed >= 3`): %50 `hooyt`, soğuma 10 sn. (Mevcut `multi` sesi aynen kalır; hooyt 350 ms gecikmeyle.)
- **Düşüş/oyun sonu**: oyun sonu bir kez `panjur` (mevcut `fall`/`record` sesinden 450 ms sonra), yeni rekorda çalmaz (rekor anı bozulmasın).
- **Karga kalkışı**: bir kaçış olayında en az bir karga kalkıyorsa %60 olasılıkla `karga1`/`karga2`, ilk kalkışın gecikmesine göre zamanlanır, soğuma 3 sn.
- **İniş başına tek karar, öncelik sırası:** `mahalleSes("inis", {perfect, ratio, towersCrossed})` tek bir aday seçer: 1) büyük çoklu zıplama (≥3 kule) → hooyt, 2) kıl payı → iiih, 3) kusursuz → ıslık/alkış. Yalnız seçilen adayın olasılığı ve soğuması uygulanır; aday çalmazsa (olasılık/soğuma) alt sıradaki aday denenmez. Böylece bir inişte en çok bir mahalle sesi çalar.
- Aynı anda en fazla bir mahalle sesi: yeni olay, öncekinin soğuması dolmadan gelirse çalmaz (oyunun kendi sesleri etkilenmez).
- Ses kapalıysa (`setSfxMuted(true)`) hiçbiri çalmaz (mevcut `playSfx` kuralı). Yarış/meydan okuma modunda da çalar (yalnız görsel/işitsel, sonuç etkisi yok).

## Kod değişikliği
- `src/game/sfx.ts`: SOURCES/VOLUME'a 7 yeni ad (ses düzeyi 0,25–0,4); POOL=2 aynı.
- `src/game/mahalleSes.ts` (yeni): olay → ses kararı, soğumalar, üreteç; bayrak `MAHALLE_SES_ON = true`.
- `app/index.tsx`: `onLanding` (perfect, ratio, towersCrossed), oyun sonu (gameOver akışı), karga kaçışı (`kargaKacirRef` içinde ilk uçuşun gecikmesi) noktalarına tek satırlık çağrılar.
- Değişmez: fizik, kamera, çarpışma, kule/iniş, puan, mevcut sesler ve düzeyleri.

## Kabul ölçütleri
1. 7 WAV dosyası var, her biri ≤ 1,2 sn, ≤ 120 KB, kırpılma yok (tepe < −1 dBFS), ortalama −18…−22 dBFS (betikle ölçülür, rapora yazılır).
2. `npx tsc --noEmit -p .` (app/src/modules satırlarında yeni hata yok); `node ai_review_evidence/test_worklet_order_regression.cjs` PASS.
3. Birim testi (node, gerçek `mahalleSes.ts` mantığı): soğumalar ve olasılıklar — 1000 sahte iniş dizisinde ardışık iki mahalle sesi arası < soğuma olmaz; kusursuz inişlerde oran %45±5; ses kapalıyken 0 çağrı.
4. Telefonda kullanıcı videosu (ses açık) — asıl ölçüt.

## Yetki
Kullanıcı: "Kodla + yerel TTS". Kod ve yerel ses üretimi yetkili; indirme yok. Commit+push onaysız (kullanıcı talimatı 2026-11-23). Claudex Loop pilotu 3. özellik.

## Uygulama notları (inceleme için)
- Çalışma ağacı bu işten önce commit edildi (3309c34); fark yalnız bu iş.
- Ses ölçümleri (betik, 44,1 kHz mono): islik 0,75 sn/64 KB/−21,0 ort./−11,1 tepe; alkis 1,10/94/−21,5/−2,2 (tanh ile hafif sıkıştırıldı); panjur 0,80/68/−18,6/−2,9; karga1 0,72/62/−20,0/−9,9; karga2 0,42/36/−20,0/−8,8; iiih 1,15/99/−19,7/−4,9; hooyt 0,79/68/−20,8/−7,7. Spektrogram: spektrogram.png.
- TTS doğrulama sınırı: sesler dinlenemedi; Whisper "Hıhıyt!", "i-i" benzeri döktü (anlamsız nidalarda güvenilmez). Kullanıcı telefonda dinleyip karar verecek; beğenmezse ilgili ses `MAHALLE_SES_ON` ya da tek tek kapatılır.
- Karar motoru testi: `test_mahalle_ses.cjs` PASS (genel aralık ≥1500 ms, kusursuz oranı %45,4, öncelik ihlali 0, eşik 0,12/0,88 tetikler, rekorda panjur yok, aynı ödül sesi en çok 2 kez üst üste).
- Üretim betikleri: `uretim/` (synth.py, tts.py, tts_post.py).
