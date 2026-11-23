// ÖZEL GÜNLER (2026-11-20, kullanıcı: "halloween yılbaşı paskalya zamanı vb gibi önemli günlerde de
// etkinliğimiz ona göre şekillensin" -> "Evet, 1 ve 2'den başla, görselleri de iste" -> "Kabul, devam et").
// İstanbul tarihine göre: menüde manşet, amcanın başında o güne özel başlık (görseli kabul edilmişse),
// Hanım'ın o güne özel mesajları. Fizik/kamera/çarpışma değişmez.
// Kural (kullanıcı 2026-11-20): Arapça/dinî ünlemler (maşallah, helal, nazar…) kullanılmaz.
// Dinî bayramlar (Şeker/Kurban) tarihleri doğrulanmadan eklenmedi.

export const OZEL_GUN_ON = true as boolean;
// GEÇİCİ (App Store öncesi kapanacak): menüde BYZANTION başlığına dokununca özel günler sırayla önizlenir.
export const OZEL_GUN_TEST_TAP = true as boolean;

export type HatBox = { x: number; y: number; w: number; h: number }; // 516 px poz tuvalinde
export type EventHat = { source: any; box: HatBox; keepCaps?: boolean }; // keepCaps: gözlük gibi; bere/kasket kalır

export type OzelGun = {
  id: string;
  title: string; // menü manşeti
  hat?: EventHat;
  hanim: string[]; // Hanım'ın o güne özel mesajları ({N} = skor)
};

const HAT_YILBASI: EventHat = { source: require("@/assets/characters/ozel/ozel-yilbasi-sapka.png"), box: { x: -30, y: -150, w: 560, h: 301 } };
const HAT_CADI: EventHat = { source: require("@/assets/characters/ozel/ozel-cadilar-sapka.png"), box: { x: -30, y: -215, w: 560, h: 361 } };
// Tur 2 (kullanıcı 2026-11-20: "Kabul, bağla")
const HAT_PASKALYA: EventHat = { source: require("@/assets/characters/ozel/ozel-paskalya-kulak.png"), box: { x: 80, y: -195, w: 360, h: 324 } };
const HAT_BAHAR: EventHat = { source: require("@/assets/characters/ozel/ozel-bahar-tac.png"), box: { x: -20, y: -25, w: 540, h: 202 } };
const HAT_23NISAN: EventHat = { source: require("@/assets/characters/ozel/ozel-23nisan-sapka.png"), box: { x: -20, y: -110, w: 560, h: 281 } };
const GOZLUK_SEVGILI: EventHat = { source: require("@/assets/characters/ozel/ozel-sevgili-gozluk.png"), box: { x: 250, y: 165, w: 300, h: 105 }, keepCaps: true };

export const OZEL_GUNLER: Record<string, OzelGun> = {
  yilbasi: { id: "yilbasi", title: "🎄 Yeni yılın kutlu olsun!", hat: HAT_YILBASI,
    hanim: ["Hindi fırında kızardı, sen çatıda kızarıyorsun. Misafirler kapıda!", "{N} kule zıplayacağına bir çeyrek bilet alsaydın.", "Misafirler geldi. Çatıda geri sayım olmaz."] },
  cadilar: { id: "cadilar", title: "🎃 Cadılar Bayramı geldi!", hat: HAT_CADI,
    hanim: ["Şeker isteyen çocuklar seni çatıda görüp kaçtı.", "Kostüme gerek yok, o eşofmanla herkesi korkutuyorsun."] },
  cumhuriyet: { id: "cumhuriyet", title: "🇹🇷 Cumhuriyet Bayramı kutlu olsun!",
    hanim: ["Bayrağı balkona astım. İn de fener alayına yetişelim.", "Fişekler atılacak. Çatıda durma, aşağıdan izleyelim."] },
  sevgililer: { id: "sevgililer", title: "❤️ Sevgililer Günün kutlu olsun!", hat: GOZLUK_SEVGILI,
    hanim: ["Bugün ne gün biliyor musun? Ben biliyorum, çiçekçi de biliyor.", "Çiçek almadan gelme; çatı buketi sayılmaz."] },
  paskalya: { id: "paskalya", title: "🥚 Paskalya: boyalı yumurta zamanı!", hat: HAT_PASKALYA,
    hanim: ["Komşu boyalı yumurta getirdi. En sağlamı bende, gel tokuşturalım.", "Yumurtalardan birine bıyık çizdim. Kimi andırıyor acaba?"] },
  cocuk: { id: "cocuk", title: "🎈 23 Nisan Çocuk Bayramı kutlu olsun!", hat: HAT_23NISAN,
    hanim: ["Torunun gösterisi başladı, ön sıraya yer tuttum. Çatıda kalma!", "Çocuk bayramı diye sen de çocuk mu oldun? {N} kule!"] },
  hidrellez: { id: "hidrellez", title: "🌸 Hıdrellez: dileğini gül dalına as!", hat: HAT_BAHAR,
    hanim: ["Gül dalına dilek astım. Seninkini de yazdım: 'Çatıdan insin.'", "Ateşin üstünden atlayacağız. Madem bu kadar zıplıyorsun, gel!"] },
};

// Batı Paskalyası (Pazar) tarihleri; liste yetmezse etkinlik sessizce atlanır.
const PASKALYA: Record<number, [number, number]> = { 2026: [4, 5], 2027: [3, 28], 2028: [4, 16], 2029: [4, 1], 2030: [4, 21] };

/** İstanbul tarihine (UTC+3) göre bugünün özel günü ya da null. */
export function todaysEvent(now = Date.now()): OzelGun | null {
  if (!OZEL_GUN_ON) return null;
  const t = new Date(now + 3 * 3600 * 1000);
  const m = t.getUTCMonth() + 1, d = t.getUTCDate(), y = t.getUTCFullYear();
  if ((m === 12 && d >= 24) || (m === 1 && d === 1)) return OZEL_GUNLER.yilbasi;
  if (m === 10 && d === 29) return OZEL_GUNLER.cumhuriyet;
  if (m === 10 && (d === 30 || d === 31)) return OZEL_GUNLER.cadilar;
  if (m === 2 && d === 14) return OZEL_GUNLER.sevgililer;
  if (m === 4 && d === 23) return OZEL_GUNLER.cocuk;
  if (m === 5 && (d === 5 || d === 6)) return OZEL_GUNLER.hidrellez;
  const p = PASKALYA[y];
  if (p) {
    const easter = Date.UTC(y, p[0] - 1, p[1]);
    const today = Date.UTC(y, m - 1, d);
    const diff = Math.round((today - easter) / 86400000);
    if (diff >= -2 && diff <= 1) return OZEL_GUNLER.paskalya;
  }
  return null;
}

/** Önizleme sırası (test dokunuşu): -1 = gerçek tarih. */
export const OZEL_GUN_TEST_ORDER = ["yilbasi", "cadilar", "cumhuriyet", "sevgililer", "paskalya", "cocuk", "hidrellez"] as const;
