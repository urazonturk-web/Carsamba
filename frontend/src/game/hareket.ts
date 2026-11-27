// HAREKET PAKET A (2026-11-26, kullanıcı: "Yes, build A"; rapor ai_review_evidence/HAREKET-2026-11-26/RAPOR.md).
// Amcanın uçuş ve iniş hareketleri — YALNIZ ÇİZİM. Fizik (px/py/vx/vy), kamera, çarpışma ve iniş
// tespiti bu değerleri hiç okumaz. Dönme/esneme ayak noktası etrafında yapılır: iniş yeri kaymaz.
export const HAREKET_ON = true as boolean;
/** 5 çizilmiş ara kare (itiş, açılma, toplanma, uzanma, çökme). false = paket 1 (3 uçuş çizimi + şarj kareleriyle çömelme). */
export const ARA_KARE_ON = false as boolean;

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
 * Uçuş/kenar kol durumu: 0 normal poz, 1 kollar açık denge, 2 süzülme (uzun atışın tepesi),
 * 3 fırlama (uzun atışın kalkışı), 4 dalış (uzun atışın inişi), 5 itiş, 6 açılma, 7 toplanma, 8 uzanma,
 * 9 iniş çökmesi (yalnız yerde, kare döngüsü verir). UCUS-ARA-KARE (2026-11-26, "Yes, add both").
 * Hem çizim (ucusKol) hem geçiş yumuşatması aynı kuralı kullanır.
 */
export function kolDurumu(airborne: boolean, idle: boolean, dususVar: boolean, vy: number, vy0: number, birakilan: number, kenar: number) {
  "worklet";
  if (dususVar) return 0;
  if (airborne) {
    const r = vy / Math.max(1, vy0);
    // GECIS-ARA (20:48 videosu, "daha fazla kare çizilmesi lazım"; kullanıcı "Yes, add all 5"):
    // uzun atış 7 kare: itiş → fırlama → açılma → süzülme → toplanma → dalış → uzanma.
    // Kalkış yüksekliğinin çok altına inince (r ≥ 1,3: büyük olasılıkla düşüş) kollar açık "eyvah".
    // GERI-DONUS (27.11 videosu "inanılmaz derecede kötü"; kullanıcı "Evet, ikisi de"): ara kareler kapalı → paket 1.
    if (!ARA_KARE_ON) {
      if (birakilan >= 0.4) return r <= -0.55 ? 3 : r < 0.3 ? 2 : r < 1.3 ? 4 : 1;
      return r > -0.6 ? 1 : 0;
    }
    if (r >= 1.3) return 1;
    if (birakilan >= 0.4) {
      if (r <= -0.85) return 5;
      if (r <= -0.55) return 3;
      if (r <= -0.3) return 6;
      if (r < 0.15) return 2;
      if (r < 0.35) return 7;
      if (r < 0.75) return 4;
      return 8;
    }
    // Orta atış: itiş → kollar açık → uzanma.
    if (birakilan >= 0.2) return r <= -0.8 ? 5 : r >= 0.7 ? 8 : 1;
    return r > -0.6 ? 1 : 0;
  }
  return idle && kenar !== 0 ? 1 : 0;
}
/** Poz değişiminde kısa "geçiş darbesi" sönüm hızı (1/sn) ve büyüklükleri: tek kare atlamayı gizler. */
export const GECIS_SONUM = 9;
export const GECIS_DONME = 0; // derece — GECIS: sabit yönlü darbe açı sıçramasını büyütüyordu, yerine GOVDE_ACI telafisi
export const GECIS_ESNE = 0.04;
/** GECIS (19:57 videosu, "geçişler sert"; rapor ai_review_evidence/GECIS-VIDEO-2026-11-26/RAPOR.md, Paket 1).
 *  Çizimlerdeki gövde ekseni (derece, öne +): 0 şarj/duruş, 1 denge, 2 süzülme, 3 fırlama, 4 dalış.
 *  Poz değişiminde yeni çizim eski gövde açısıyla başlar, YÜZ noktası etrafında kendi açısına döner. */
export const GOVDE_ACI = [3, 3, 25, 41, 20, 20, 30, 25, 8, 15];
/** Durum → REACTION_POSES k (1 tabanlı). */
export const KOL_K = [0, 2, 4, 5, 6, 7, 8, 9, 10, 11];
export const TELAFI_MAX = 25;
export const TELAFI_SONUM = 12; // 1/sn (~85 ms zaman sabiti)
/** Uçuş pozlarında yüz noktası, pozun ayak/pivot noktasına göre (sprite px; süzülmede ölçüldü). */
export const YUZ_DX = 77;
export const YUZ_DY = 838;
/** Uçuşta bir poz en az bu kadar ekranda kalır (sn). */
export const POZ_EN_AZ = 0.11;
/** İniş çömelmesi: mevcut şarj kareleriyle (037→025→012→000) doğrulma; tutma ve sönüm süresi (ms). */
export const INIS_TUT = 35;
export const INIS_SURE = 170;
/** Dalışta çizimi uzanma karesinin baş yüksekliğine doğru kaydırma (sprite px, r 0,35→0,75 arasında 0→63). */
export const DALIS_KAY = ARA_KARE_ON ? 63 : 170;
/** Süzülürken canlılık: hafif dalgalanma (derece) ve nefes (ölçek), frekans Hz. */
export const SUZUL_DALGA = 3.5;
export const SUZUL_NEFES = 0.03;
export const SUZUL_HZ = 1.8;
/** Fırlama/dalış çizimleri eğimi zaten taşıyor: yörünge eğimi bu pozlarda bu oranla uygulanır. */
export const ARA_KARE_EGIM = 0.35;
