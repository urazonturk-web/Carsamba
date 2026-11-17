// KARTPOSTAL ALBÜMÜ (2026-11-12, kullanıcı seçimi; YAPI-2026-11-12 fikirleri).
// Bir durağa İLK kez varınca o semtin kartpostalı açılır. Görseller yeni üretim
// değil: mevcut Boğaz arka planından kırpılıp kartpostal çerçevesine alındı
// (assets/postcards/). Kayıt yalnız cihazda.

export const POSTCARDS_ON = true as boolean;
// GÜZERGÂH 2026-11-16: duraklar değişti (12 durak, Kadıköy → Rumeli Feneri). Kayıt
// durak NUMARASI tuttuğu için eski albüm yeni yerleri yanlış açardı -> yeni anahtar
// (albüm sıfırlanır). Görseller v2'de semte özel (aşağı bakınız); kayıt aynı kaldı.
export const POSTCARDS_KEY = "carsamba.postcards.v2";

// 2026-11-16 KARTPOSTAL v2 (kullanıcı: "her durak için kartpostal", "Evet, bağla"): her durakta
// farklı etkinlikte bizim amca; manzaralar ve amca pozları Kıvılcım (25 onaylı çağrı), birleşim
// Claude Code (ai_review_evidence/KARTPOSTAL-2026-11-16/). Durak adı, alt başlık ve arka not kodla.
export const POSTCARDS = [
  { stop: 1, name: "Harem", sub: "Haydarpaşa", note: "Sabah sporu yaptım: bir esneme, iki gerinme.", source: require("@/assets/postcards/v2/kart-01.jpg") },
  { stop: 2, name: "Üsküdar", sub: "Kız Kulesi", note: "Simidi martıyla paylaştık. Yani o yedi, ben izledim.", source: require("@/assets/postcards/v2/kart-02.jpg") },
  { stop: 3, name: "Kuzguncuk", sub: "Ahşap evler", note: "Kuzguncuk'un kedileri beni evlat edindi.", source: require("@/assets/postcards/v2/kart-03.jpg") },
  { stop: 4, name: "Beylerbeyi", sub: "Boğaziçi Köprüsü", note: "Çayım demli, güneş batıyor, amcanız mutlu.", source: require("@/assets/postcards/v2/kart-04.jpg") },
  { stop: 5, name: "Ortaköy", sub: "Boğaziçi Köprüsü", note: "Köprüyü geçtim, pijamayı giydim. Mesai bitti!", source: require("@/assets/postcards/v2/kart-05.jpg") },
  { stop: 6, name: "Arnavutköy", sub: "Yalılar", note: "Çilekler mis gibi. Yalılar uyuyor, ben de az kaldı.", source: require("@/assets/postcards/v2/kart-06.jpg") },
  { stop: 7, name: "Bebek", sub: "Bebek koyu", note: "Salep içtim… Bebek gibi uyuyacağım.", source: require("@/assets/postcards/v2/kart-07.jpg") },
  { stop: 8, name: "Rumeli Hisarı", sub: "FSM Köprüsü", note: "Avımız bereketli: bir balık. Adını Hüsnü koydum.", source: require("@/assets/postcards/v2/kart-08.jpg") },
  { stop: 9, name: "Kanlıca", sub: "Kanlıca iskelesi", note: "Kanlıca yoğurdu yedim, bıyığım karla kaplandı.", source: require("@/assets/postcards/v2/kart-09.jpg") },
  { stop: 10, name: "Beykoz", sub: "Taş çeşme", note: "Beykoz suyu içtim, uykum bile tazelendi.", source: require("@/assets/postcards/v2/kart-10.jpg") },
  { stop: 11, name: "Anadolu Kavağı", sub: "Yoros Kalesi", note: "Balık ekmek nefis, ömrüme ömür kattı.", source: require("@/assets/postcards/v2/kart-11.jpg") },
  { stop: 12, name: "Rumeli Feneri", sub: "Karadeniz", note: "Boğaz bitti, amca bitti. İyi geceler, sevgilerle.", source: require("@/assets/postcards/v2/kart-12.jpg") },
] as const;

export function parseUnlocked(raw: string | null | undefined): number[] {
  if (!raw) return [];
  try {
    const a = JSON.parse(raw);
    return Array.isArray(a) ? a.filter((n) => typeof n === "number") : [];
  } catch {
    return [];
  }
}
