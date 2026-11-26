// KIZARAN YÜZ FENER (2026-11-26, kullanıcı: "Yes, build it"; rapor ai_review_evidence/YARATICI-OLAY-2026-11-26/RAPOR.md).
// Harem'den sonra sis basar: kuleler kararır. Basılı tutunca amcanın kızaran yüzünden ışık yayılır,
// şarj arttıkça büyür. Uzağı görmek için uzun basmak gerekir ama uzun basmak uzağa fırlatır.
// YALNIZ ÇİZİM: fizik, kamera, çarpışma, puan, kule üretimi değişmez. Kuleler sisin altında da yerinde;
// bekleme (şarjsız) hâlinde bile yakın çevre açık, sonraki kule silik görünür (haksız düşüş olmasın).
export const FENER_ON = true as boolean;
/** GEÇİCİ deneme: ilk 6 kulede sis (simülatör). Teslimde false. */
export const FENER_TEST = false as boolean;
/** Sisli bölüm: bu kule kimlikleri arasında (Harem 15. kule; 17'ye inince başlar, 23'e inince dağılır). */
export const FENER_BAS = 17;
export const FENER_SON = 23;
/** Sis görselinin dünya birimi kenar uzunluğu (kamera 0,40 → ~3200 pt). Açık delik yarıçapı ≈ %3,5. */
export const FENER_BOY = 8000;
/** Işık ölçeği: şarjsız 0,45 (açık ~50 pt, sonraki kule silik), tam şarj 1,8 (açık ~200 pt, geçiş ~575 pt).
 *  Simülatör denemesi: 2,6'da ekranın tamamı aydınlanıyordu, ikilem kayboluyordu. */
export const FENER_MIN = 0.45;
export const FENER_MAX = 1.8;
export const FENER_KAYNAK = require("@/assets/environment/fener-sis.png");
export const FENER_MESAJ = "🌫️ Sis bastı! Basılı tut: amcanın yüzü kızarsın, yol aydınlansın.";

export function fenerAktif(id: number) {
  "worklet";
  return FENER_TEST ? id < 6 : id >= FENER_BAS && id < FENER_SON;
}
