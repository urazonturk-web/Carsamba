# PLAN-REVIEW-LOG — karga çeşitliliği
Roller: claude plan/kod, codex inceleme/son kontrol. Tur sınırı 5. Yetki: kod evet, commit hayır.

## Tur 1 — Codex: REVISE
KARGA-01 (tünek çakışması) ve KARGA-02 (bekleyen karganın pozu) — ikisi de kabul (dispositions-1.md).

## Tur 2 — Codex: REVISE
KARGA-03 (tüm sprite aynalama = gövde dönüşü): kabul, "öbür yana" durumu kaldırıldı (dispositions-2.md).

## Tur 3 — Codex: REVISE
KARGA-04 (bakışta gövde aynalama) kabul; KARGA-05 (paylaşılan Math.random) kabul — ayrı üreteç (dispositions-3.md).

## Tur 4 — Codex: REVISE
KARGA-06 (eski ifade çelişkisi) kabul (dispositions-4.md). Son tur 5/5.

## Tur 5 — Codex: APPROVED
Kodlama başlıyor (builder=claude).

## Son kontrol 1 — Codex inspect: REVISE
KARGA-01 (uçan slotun kesilmesi) kabul: uçmakta olan slot kullanılmaz, slot yoksa karga kalır. KARGA-02 (gider oranı) kabul: yedek sırası, gider yalnız %10 ya da kapasite. Plan güncellendi, delta.patch yenilendi. Son kontrol 2 (taze oturum).

## Son kontrol 2 — Codex inspect (taze): REVISE
KARGA-REV-01: uçan slotun yeniden kullanılabileceği iddiası. Kod her dalda p>=1 koşulu arıyordu, ama bu değer JS tarafında UI animasyonundan okunuyordu (bayat olabilir) → kabul: uçuş bitişi JS saatinde (pool.until = now+delay+dur+50) tutuluyor; slot seçimi ve yeniden kaçış buna bakıyor, JS tarafında kPs okunmuyor. İnceleme bütçesi (2) doldu: bu son düzeltme bağımsız incelenmedi; tsc + worklet testi PASS.
