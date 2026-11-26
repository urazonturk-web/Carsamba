// HAREKET PAKET A (2026-11-26, kullanıcı: "Yes, build A"; rapor ai_review_evidence/HAREKET-2026-11-26/RAPOR.md).
// Amcanın uçuş ve iniş hareketleri — YALNIZ ÇİZİM. Fizik (px/py/vx/vy), kamera, çarpışma ve iniş
// tespiti bu değerleri hiç okumaz. Dönme/esneme ayak noktası etrafında yapılır: iniş yeri kaymaz.
export const HAREKET_ON = true as boolean;

/** Yörüngeye eğilme sınırları (derece). + = öne (gidiş yönüne), - = geriye. */
export const EGIM_ON_MAX = 12;
export const EGIM_GERI_MAX = 7;
/** Eğilmenin hedefe yaklaşma hızı (1/sn); ~55 ms zaman sabiti, inişte 0'a ~100 ms'de döner. */
export const EGIM_HIZ = 18;
/** Kalkış esnemesi: boy uzar, en incelir (hacim korunur). */
export const ESNE_BOY = 0.12;
export const ESNE_EN = 0.08;
/** Kıl payı kenar sallanması: tepe açısı (derece). */
export const SALLAN_DERECE = 7;
/** Kusursuz seri 3+: göğüs kabartma (yatay genişleme oranı). */
export const KABAR_ORAN = 0.06;
/** 3+ kule "oh be" pozu koşu başına en fazla bu kadar. */
export const OHBE_MAX = 2;

/**
 * Uçuşta hedef eğim. r = vy / vy0 (kalkışta -1, tepede 0, düşüşte +).
 * Yükselirken gidiş yönüne eğilir, tepede düzleşir, inerken ayaklarını öne verip hafif geriye yaslanır.
 * k = atışın büyüklüğü (şarj): kısa hopta neredeyse hiç eğilmez.
 */
export function ucusEgim(vy: number, vy0: number, c: number) {
  "worklet";
  const r = vy0 > 0 ? vy / vy0 : 0;
  const k = Math.max(0.2, Math.min(1, c / 0.5));
  const a = r < 0 ? EGIM_ON_MAX * Math.min(1, -r) : -EGIM_GERI_MAX * Math.min(1, r * 1.4);
  return a * k;
}

/**
 * Uçuşta gösterilecek şarj pozu (mevcut çizimler): tepe civarında dizler hafif toplanır (%12,5),
 * inişe yaklaşırken dizler bükülür (%25) — iniş hazırlığı. Kalkışın ilk anı dik (0).
 */
export function ucusPoz(vy: number, vy0: number) {
  "worklet";
  const r = vy0 > 0 ? vy / vy0 : 0;
  if (r > 0.45) return 0.25;
  if (r > -0.3) return 0.125;
  return 0;
}
