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

/**
 * Uçuş/kenar kol durumu: 0 normal poz, 1 kollar açık denge, 2 süzülme (uzun atışın tepesi).
 * Hem çizim (ucusKol) hem geçiş yumuşatması aynı kuralı kullanır.
 */
export function kolDurumu(airborne: boolean, idle: boolean, dususVar: boolean, vy: number, vy0: number, birakilan: number, kenar: number) {
  "worklet";
  if (dususVar) return 0;
  if (airborne) {
    const r = vy / Math.max(1, vy0);
    if (birakilan >= 0.4 && r > -0.55 && r < 0.4) return 2;
    return r > -0.6 ? 1 : 0;
  }
  return idle && kenar !== 0 ? 1 : 0;
}
/** Poz değişiminde kısa "geçiş darbesi" sönüm hızı (1/sn) ve büyüklükleri: tek kare atlamayı gizler. */
export const GECIS_SONUM = 9;
export const GECIS_DONME = 9; // derece
export const GECIS_ESNE = 0.1;
/** Süzülürken canlılık: hafif dalgalanma (derece) ve nefes (ölçek), frekans Hz. */
export const SUZUL_DALGA = 3.5;
export const SUZUL_NEFES = 0.03;
export const SUZUL_HZ = 1.8;
