# Claudex Loop denemesi (2026-11-23)

## Kurulum
- Kaynak: https://github.com/chaseai-yt/claudex-loop @ 53cddc42 (yalnız skills/claudex-loop klasörü + LICENSE)
- Yer: frontend/.claude/skills/claudex-loop/ (yalnız bu projede; genel ayarlara dokunulmadı)
- Güvenlik okuması: Codex plan incelemesi read-only sandbox; derleme aşaması workspace-write; betikte ağ/silme yok; commit/push/yayın yapmıyor, mevcut onay kurallarına uyuyor.
- Codex CLI: /Applications/ChatGPT.app/.../codex (runner'a --cli ile verilir; `roles` denemesi çalıştı, model çağrısı yapılmadı).
- Yeni bir oturumda skill listesine girer; tetik: "claudex this plan" / "claudex-loop".

## Ölçüm planı
Karşılaştırma tabanı (son özellikler, elle Codex danışarak): kargalar 4 tur (görünmeme, alt kat, hayalet uçuş, uçuş katmanı), kurukafa 1 tur, kedi yeri 2 tur — kullanıcı videosundan dönen düzeltme turu sayısı.
Deneme: sıradaki 3 orta/büyük özellik Claudex Loop ile (plan → Codex incelemesi → kod → Codex son kontrol).
Ölçülenler (her özellik için): 1) kullanıcının videoda bulduğu düzeltme turu sayısı, 2) Codex'in planda bulduğu ve gerçekten değiştirdiğimiz sorun sayısı, 3) toplam süre, 4) Codex çağrı sayısı.
Devam ölçütü: düzeltme turları belirgin azalırsa (ör. ortalama 3 → 1–2) kalır.
Vazgeçme ölçütü: 3 özellikte tur sayısı azalmaz ya da süre/maliyet belirgin artarsa skill silinir (klasörü kaldırmak yeterli).

## Özellik 1 — Oyun sonu ekranı (2026-11-23)
- Plan incelemesi: 5 tur (sınır). Codex 4 bulgu (hepsi medium, hepsi gerçek): HUD çip birleşimleri, küçük ekranda kart taşması, uzun toast metni, %40 hedefinin zorlanmaması. 3'ü tam, 1'i kısmen kabul; 5. turda APPROVED. Tur başına ~40 sn, ~186K girdi token (çoğu önbellek), ~1,5K çıktı.
- Son kontrol (taze Codex): REVISE — 1 bulgu, ama bu işe ait değil (önceden yapılmış menü stili; Codex tüm commit edilmemiş farkı inceledi). Reddedildi, gerekçe kayıtlı.
- Kodlama sırasında kendi denemem 1 sorun daha buldu (yeni rekor damgası küçük kartta yazının üstüne biniyor) → küçük damga + toast payı.
- Sonuç ölçüsü: kart %52,6 → %38,4; toast hiçbir çip ve kartla çakışmıyor (simülatör). Kullanıcı videosundaki düzeltme turu sayısı: **bekleniyor** (asıl ölçüt).
- Gözlem: Codex plan aşamasında, önceki elle danışmalarımızın yakalamadığı türden kenar durumları (uzun metin, küçük ekran) sistematik yakaladı. Maliyet: ~4 dk ek bekleme. Zayıf yan: son kontrol kirli çalışma ağacında kapsam dışı farka takıldı → bundan sonra her özellikten önce commit (kullanıcı onayıyla) ya da ayrı dal önerilir.

## Özellik 1 sonucu
- Kullanıcı videosu (11:43): oyun sonu kartıyla ilgili düzeltme istenmedi → **0 düzeltme turu** (taban: kargalar 4, kedi yeri 2).

## Özellik 2 — Karga hareket çeşitliliği (2026-11-23)
- Plan incelemesi: 5 tur, 6 bulgu (tünek çakışması, bekleyen poz, iki kez gövde aynalama, paylaşılan Math.random, plan içi çelişki); 5. turda APPROVED.
- Son kontrol 1: 2 gerçek kod hatası (uçan slotun kesilmesi, hedef yokken fazla "gider") → düzeltildi.
- Son kontrol 2: 1 bulgu (JS'ten UI animasyon değeri okumaya güvenmek) → uçuş bitişi JS saatinde tutuldu. İnceleme bütçesi doldu; bu son düzeltme bağımsız incelenmedi (tsc + worklet testi PASS).
- Simülatör: farklı anlarda/yönlerde kalkış görüldü; sayısal yay ölçümü yapılmadı.
- Kullanıcı videosu 12:14: metin yorum yok; videoda sorun görülmedi (denetim ai_review_evidence/VIDEO-2026-11-23c/RAPOR.md). Kullanıcı: "Beğendim" → **0 düzeltme turu**.
- Gözlem: kod incelemesi gerçek hatalar yakaladı (özellik 1'de yalnız kapsam dışı bulgu vardı). Plan turları bazen ifade tutarlılığına takılıyor (KARGA-06), ama ucuz.

## Ara sonuç (2/3 özellik)
- Düzeltme turu: oyun sonu 0, karga çeşitliliği 0 (taban: kargalar 4, kedi yeri 2).
- Maliyet: özellik başına ~5 plan turu (~40 sn/tur) + 1–2 son kontrol (~1–3 dk). Toplam ek bekleme ~6–10 dk/özellik.
- Codex gerçek bulgu: özellik 1'de 4 (plan), özellik 2'de 6 (plan) + 3 (kod). Kapsam dışı/hatalı bulgu: 1 (kirli çalışma ağacı).
- Öneri: 3. özellikten önce bekleyen işleri commit'lemek (kullanıcı onayıyla) son kontrolü temizler.
