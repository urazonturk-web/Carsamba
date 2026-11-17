// ŞEMSİYE (2026-11-17, kullanıcı: "Evet, prototip yap"; ai_review_evidence/SEMSIYE-2026-11-17/RAPOR.md).
// Yağmur yağarken ve lodos/poyraz yokken amcada şemsiye. Kodla çizilmiş PROTOTİP (görsel yok):
// algı testi geçerse Kıvılcım görselleriyle değişecek (ayrı onay).
// Şarj/kalkış/yükseliş: kapalı, sırtta (sapın kıvrık ucu sol omuz üstünde).
// Düşüşün ilk karesi (vy > 0): "pat" diye açılır. Hafif yağmurda düşüşün ikinci yarısında açılır.
// Düşüş hızlandıkça kumaş yukarı kalkar, yarı ters döner ("işe yaramıyor": süzülme algısı olmasın).
// İnişte kısa sallanma, ~0,3 sn sonra kapanır. Karda şemsiye yok. Fizik/çarpışma değişmez.

export const SEMSIYE_ON = false as boolean; // 2026-11-17 kullanıcı: "şemsiye iptal, şapka takıp mont giyinsin"

export type UmbrellaWx = { kind: string; wind: string | null; light?: boolean } | null | undefined;
// 0 = yok, 1 = yağmur, 2 = hafif yağmur (geç açılır)
export const SEMSIYE_TEST = false as boolean; // GEÇİCİ: simülatör denemesi için her havada şemsiye
export function umbrellaMode(w: UmbrellaWx): 0 | 1 | 2 {
  if (SEMSIYE_ON && SEMSIYE_TEST) return 1;
  if (!SEMSIYE_ON || !w || w.kind !== "yagmur" || w.wind) return 0;
  return w.light ? 2 : 1;
}

// Poz tuvali pikseli (516 px genişlik). Baş 9 pozda aynı yerde: üstü y≈0, baş neredeyse tuval genişliğinde (kulak/saç dahil).
// Açık kubbe: başın (ve bere/gece külahının) üstünde; sap başın arkasında kaybolur.
export const UMB_OPEN = { cx: 270, bottom: -110, w: 680, h: 270, shaftBottom: 200 };
// Kapalı: sırtta çapraz; üst ucu (kıvrık sap) sol omuz üstünde, alt ucu gövdenin arkasında.
export const UMB_CLOSED = { cx: 80, cy: 470, len: 854, w: 40, rot: -16 };
export const UMB_FABRIC = "#24304f"; // lacivert (kırmızı eşofmanla karışmaz)
export const UMB_FABRIC_LIGHT = "#3d4d78";
export const UMB_LINE = "#3a2414"; // amcanın koyu kahve konturu
export const UMB_WOOD = "#8a5a2b";
