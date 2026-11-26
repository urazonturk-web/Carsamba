# GECIS-VIDEO-2026-11-26 — Ortak rapor: zıplama geçişleri neden sert, nasıl yumuşar

Kaynak: kullanıcı videosu 19:57 (telefon, "FIRLAMA + DALIS"). Üç editör (editor-animasyon.md, editor-teknik.md, editor-cizim.md) + Kıvılcım (kivilcim-gorusu.md, yalnız yazılı). Kod ve görseller değiştirilmedi.

## Ölçüm (60 fps, 7,2–8,45 sn uzun atış)
fırlama ~280 ms → süzülme ~630 ms → dalış ~330 ms → duruş. Her değişim TEK KAREDE.
Sert anlar: kalkış 7,19 sn · fırlama→süzülme 7,48 · süzülme→dalış 8,12 · **dalış→duruş 8,45 (en sert, dört görüş de aynı)**.

## Sertliği yaratan 5 neden
1. **İnişte ara adım yok:** top gibi dalış pozundan tek karede dimdik duruşa. Dalış çizimi ayak noktasının ~190 px üstünde durduğu için amca temas anında aşağı "ışınlanıyor"; çökme (landPulse) bir kare SONRA geliyor — sıra ters.
2. **Gizli açı sıçramaları (kod):** eğim çarpanı 0,35↔1 anında değişiyor, geçiş darbesi hep aynı yöne +9° biniyor → fırlama→süzülmede ~13°, süzülme→dalışta ~11° tek karelik açı atlaması. Darbe kopukluğu gizlemiyor, büyütüyor. Süzülme dalgası da birden kesiliyor.
3. **Silüet farkı (çizim):** pozlar arası örtüşme yalnız %30–50; gövde dikten ~40° yatığa tek karede geçiyor.
4. **Ceket:** yerde kapalı, uçuşta pelerin gibi açık → bordo kütle bir anda büyüyüp küçülüyor. Uçuş çizimlerinde eşofman ~%12 daha açık renk.
5. **Yüz ifadesi** 4 karede 4 kez değişiyor; dalışta yüz başka biri gibi okunuyor.
Ek: düşüşte dalış pozu ekrandan çıkana kadar kalıyor.

## Çapraz geçiş (iki pozu üst üste soldurmak)
Üç editör de **önermiyor**: örtüşme düşük olduğu için açık hayalet görüntü verir, performans maliyeti var (takılma zaten %19–22). En son, ölçerek denenebilir.

## Öneri — iki paket
**Paket 1 — çizimsiz, kodla (~3–4 saat), önce bu:**
- İnişte çömel→doğrul yaylanması: mevcut charge-037/025/012 kareleriyle ~160 ms, en derin çökme ilk temas karesinde; tepki pozu ~150 ms gecikir. (4 görüşün de 1 numarası.)
- Dalışta çizimi inişe doğru aşağı kaydırmak (ışınlanma biter).
- Açı sürekliliği: eğim çarpanı ve süzülme dalgası yumuşak geçsin; darbe yönü pozlar arası gerçek açı farkına göre, dönme yüz noktası etrafında (baş oynamasın).
- Her poz en az ~110 ms; dalış eşiği r 0,4 → 0,3 (dalış biraz daha uzun ve okunur).
- Düşüş kesinleşince dalış yerine çırpınma pozu.
Fizik, kamera, çarpışma, puan değişmez.

**Paket 2 — yeni çizim (her biri ayrı onay), Paket 1 telefonda görüldükten sonra:**
- B1 "inişe uzanma" (dalış→iniş, ayaklar aşağı açılır) — en değerlisi.
- B2 "kalkış itişi" (duruş→fırlama, gövde ~20° yatık).
- İsteğe bağlı: dalış yüzünü yumuşatan yeniden çizim, uçuş PNG'lerinde renk eşitleme.
İstem taslakları editor-cizim.md'de.
