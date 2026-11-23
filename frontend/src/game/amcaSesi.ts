// AMCANIN SESİ + LAKAP DAMGASI (2026-11-20, kullanıcı: "Evet, 1 ve 2'den başla";
// ai_review_evidence/FIKIR-PUAN-2026-11-20/RAPOR.md).
// 1) "Hanım arıyor": oyun sonunda telefon bildirimi gibi kayan kısa mesaj (saate, havaya, skora göre).
// 2) İç ses: oyun sırasında seyrek düşünce balonu (kıl payı iniş, uzun uçuş, seri).
// 3) Lakap: koşunun tarzından "Üsküdar'da aceleci" gibi damga (oyun sonu + paylaşım kartı).
// Metinler TASLAK: kullanıcı telefonda görüp onaylayacak; beğenilmezse bayrakla kapanır.
// Fizik/kamera/çarpışma değişmez; yalnız görüntü ve metin.

import type { WeatherKind, WindKind } from "./istanbul";
import { START_NAME, STOP_NAMES, FINAL_STOP } from "./stops";

export const HANIM_ON = false as boolean; // 2026-11-21 kullanıcı: "diyalogları hiç beğenmedim" -> yazılı mesajlar kapalı
export const ICSES_ON = false as boolean; // 2026-11-21 aynı karar: iç ses balonu kapalı
export const LAKAP_ON = true as boolean;

function pick<T>(a: readonly T[]): T {
  return a[Math.floor(Math.random() * a.length)];
}

// Duraklarda bulunma hâli (ünlü uyumu elle; STOP_NAMES ile aynı sıra).
const STOP_LOCATIVE = [
  "Harem'de", "Üsküdar'da", "Kuzguncuk'ta", "Beylerbeyi'nde",
  "Ortaköy'de", "Arnavutköy'de", "Bebek'te", "Rumeli Hisarı'nda",
  "Kanlıca'da", "Beykoz'da", "Anadolu Kavağı'nda", "Rumeli Feneri'nde",
] as const;
const STOP_DATIVE_SHORT = [
  "Harem'e", "Üsküdar'a", "Kuzguncuk'a", "Beylerbeyi'ne",
  "Ortaköy'e", "Arnavutköy'e", "Bebek'e", "Rumeli Hisarı'na",
  "Kanlıca'ya", "Beykoz'a", "Anadolu Kavağı'na", "Rumeli Feneri'ne",
] as const;
const START_LOCATIVE = "Kadıköy'de";
if (STOP_LOCATIVE.length !== STOP_NAMES.length || START_NAME !== "Kadıköy") {
  // Durak listesi değişirse burası da güncellenmeli (yalnız geliştirmede görünür).
  console.warn("[amcaSesi] durak listesi değişmiş: STOP_LOCATIVE güncellenmeli");
}

function placeLocative(stops: number) {
  if (stops <= 0) return START_LOCATIVE;
  if (stops <= STOP_LOCATIVE.length) return STOP_LOCATIVE[stops - 1];
  return "Gece seferinde";
}

// ---------- Koşu istatistiği (lakap ve iç ses için) ----------
export type RunStats = {
  landings: number;
  center: number; // ortaya yakın iniş
  edge: number; // kenara kıl payı iniş
  multi: number; // birden fazla kule atlanan zıplayış
  maxMulti: number;
  perfect: number;
  perfectStreak: number;
  exploded: boolean;
  sinceBubble: number; // son iç sesten beri iniş sayısı
};
export const newRunStats = (): RunStats => ({
  landings: 0, center: 0, edge: 0, multi: 0, maxMulti: 0, perfect: 0, perfectStreak: 0, exploded: false, sinceBubble: 4,
});

const EDGE = 0.12; // oran 0..1; 0.5 = tam orta
const CENTER = 0.12;

export function noteLanding(s: RunStats, ratio: number, towers: number, perfect: boolean) {
  s.landings += 1;
  s.sinceBubble += 1;
  if (Math.abs(ratio - 0.5) <= CENTER) s.center += 1;
  if (ratio <= EDGE || ratio >= 1 - EDGE) s.edge += 1;
  if (towers > 1) s.multi += 1;
  s.maxMulti = Math.max(s.maxMulti, towers);
  if (perfect) { s.perfect += 1; s.perfectStreak += 1; } else s.perfectStreak = 0;
}

// ---------- İç ses ----------
// DİYALOG v2 (2026-11-20, kullanıcı: "diyaloglar güzel olmamış onlar üzerine çalışılsın"; Codex + Claude
// editörü önerilerinden birleştirildi: ai_review_evidence/VIDEO-2026-11-20/DIYALOG-v2.md).
// İç ses: yaşlı bedenle övünç arasında; dizler, bıyık, gençlik. Arapça/dinî ünlem yok.
const IC_EDGE = ["Topuk havada, gurur yerinde.", "Az daha Boğaz'a dalıyordum.", "Bu çatıyı kim yaptıysa…"];
const IC_FLY = ["Bu bacaklar 1974 model!", "Martılar bile bakakaldı.", "Dizlerim bunu ödetecek."];
const IC_STREAK = ["Cetvelle çizdim sanki.", "Terzi gibi, tam ölçü.", "Üç kere üst üste, not alın!"];
const IC_NEAR_RECORD = ["Rekor bir kiremit ötede.", "Sakin ol bıyık, sakin.", "Bir tane daha, sonra çay."];
const IC_IDLE = ["Kuşlar konacak üstüme.", "Vapur gitti, ben duruyorum.", "Bekledikçe diz kilitleniyor."];

let lastBubbleAt = 0;
/** İnişten sonra iç ses (çoğu inişte null). Seyrek: en az 8 inişte bir, yarı şans. */
export function icSesAfterLanding(s: RunStats, ratio: number, towers: number, score: number, best: number): string | null {
  // 2026-11-20 video: oyuncu sık öldüğü için her koşunun başında balon çıkıyordu -> koşu başına
  // en az 4 iniş + uygulama genelinde en az 25 sn ara.
  if (!ICSES_ON || s.sinceBubble < 8 || Date.now() - lastBubbleAt < 25000) return null;
  let line: string | null = null;
  if (ratio <= 0.07 || ratio >= 0.93) line = pick(IC_EDGE);
  else if (towers >= 3) line = pick(IC_FLY);
  else if (s.perfectStreak === 3) line = pick(IC_STREAK);
  else if (best >= 8 && score === best - 1) line = pick(IC_NEAR_RECORD);
  if (!line || Math.random() > 0.55) return null;
  s.sinceBubble = 0;
  lastBubbleAt = Date.now();
  return line;
}
export function icSesIdle(): string | null {
  return ICSES_ON ? pick(IC_IDLE) : null;
}

// ---------- Hanım arıyor ----------
export type HanimCtx = {
  score: number;
  newRecord: boolean;
  stops: number;
  hour: number; // İstanbul saati 0-23
  minute: number;
  weather: WeatherKind | null;
  wind: WindKind;
  exploded: boolean;
  eventLines?: string[]; // özel günün mesajları (ozelGun.ts); varsa çoğunlukla bunlardan biri
};

let lastHanim = "";
let hanimSkip = false; // art arda iki oyun sonunda gelmesin

/** Oyun sonu mesajı ya da null (her oyun sonunda gelmez). */
export function hanimMessage(c: HanimCtx): string | null {
  if (!HANIM_ON) return null;
  if (hanimSkip && !c.newRecord) { hanimSkip = false; return null; }
  const s = c.score;
  const hh = `${String(c.hour).padStart(2, "0")}:${String(c.minute).padStart(2, "0")}`;
  const special: string[] = [];
  const ev = (c.eventLines ?? []).map((m) => m.replace("{N}", String(s)));
  if (ev.length > 0 && Math.random() < 0.7) {
    const pool = ev.filter((m) => m !== lastHanim);
    const msg = pick(pool.length ? pool : ev);
    lastHanim = msg; hanimSkip = true;
    return msg;
  }
  // Hanım: pratik bir sevgi dili; her lafı bir ev işiyle iğneler.
  const at = (k: number) => STOP_DATIVE_SHORT[k - 1];
  if (c.newRecord && s >= 5) special.push(`${s} kule, rekor! Kuaförde anlatacağım, şimdi gel yemeğe.`, `Rekor mu? Fotoğraf çek, yoksa kimse inanmaz.`, `Rekor tamam; ekmek işi hâlâ sende.`);
  if (c.hour >= 0 && c.hour < 5) special.push(`Saat ${hh}. Kapıyı kilitledim, anahtar paspasın altında.`, `Çatıda tıkırtı var diye bekçiyi çağırıyorlardı. Sendin!`, `Mahalle uyudu. Senin terlik kapıda.`);
  if (c.hour >= 6 && c.hour < 10) special.push(`Ekmek almaya çıktın, ${s} kule zıpladın. Fırın taşındı mı?`, `Fırın açık, kahvaltı hazır. Dönüşte ekmek al.`);
  if (c.hour >= 18 && c.hour < 21) special.push(`Yemek hazır. "Son bir zıplayış" diyeceksen hiç başlama.`, `Dizi başladı, kumanda sende kaldı. Ya gel ya kumandayı at.`);
  if (c.weather === "yagmur") special.push(`Islak eşofmanı balkona as, salona değil. Anlaştık mı?`, `Yağmurda kiremit tutmaz. Montu kap, aşağı in.`);
  if (c.weather === "kar") special.push(`Karda zıplanmaz, kayılır. Salep ocakta, in aşağı.`, `Kardan adam yapacaksın sandım, sen kule saymışsın.`);
  if (c.weather === "sis") special.push(`Ben seni balkondan göremiyorum, kule seni nasıl görsün?`, `Galata görünmüyor. Yolunu bulunca eve gel.`);
  if (c.wind === "lodos") special.push(`Lodos var, çamaşırları topladım. Seni de toplayayım mı?`, `Lodos seni karşıya uçurmadan gel. Dolma ocakta.`);
  if (c.wind === "poyraz") special.push(`Atkını kapıya astım. Görmedin tabii.`, `Poyrazda bıyığın donar. Gel, çorba sıcak.`);
  if (c.exploded) special.push(`Komşu "gaz kaçağı var" diye aradı. Sendin değil mi?`, `Koku senden önce eve geldi!`);
  if (s <= 2) special.push(`Merdiveni inmeden döndün mü? Terliklerin daha sıcak.`, `Daha kapının önündesin. Gelirken çöpü de at bari.`);
  if (c.stops >= 1 && c.stops <= FINAL_STOP) special.push(`${at(c.stops)} kadar gitmişsin! Dönüşte vapura bin, dizlerin var.`, `Madem ${at(c.stops)} vardın, oradan simit al. Bizimki bayat.`);
  const general = [
    `Annen aradı. "Çatıda" dedim, "yine mi" dedi.`,
    `Kapıcı seni çatıda görmüş. Aidatı bize yazacakmış.`,
    `Çay ikinci kez demlendi. Eve gel.`,
    `Ekmek nerede? ${s} kuleyi gördüm.`,
  ];
  const chance = c.newRecord ? 1 : special.length > 0 ? 0.6 : 0.3;
  if (Math.random() > chance) return null;
  const pool = (special.length > 0 && Math.random() < 0.75 ? special : general).filter((m) => m !== lastHanim);
  const msg = pick(pool.length ? pool : general);
  lastHanim = msg;
  hanimSkip = true;
  return msg;
}

// ---------- Lakap damgası ----------
const LAKAP: Record<string, string[]> = {
  kapida: ["paspasta kalan", "terliği ısınmayan"],
  gaz: ["fokurdayan", "tüpü sızdıran"],
  rekor: ["efsane bıyık", "mahallenin manşeti"],
  seyyah: ["durak atlayan", "vapur kıskandıran"],
  nisanci: ["cetvel ayaklı", "terzi ölçülü"],
  aceleci: ["freni tutmayan", "çayı beklemeyen"],
  cambaz: ["çatı kedisi", "ip cambazı"],
  temkinli: ["kiremit sayan", "üç kere ölçen"],
  keyifli: ["ıslık çalan", "eşofmanı ütülü"],
};
let lastLakap = "";
export function lakap(s: RunStats, score: number, stops: number, newRecord: boolean): string | null {
  if (!LAKAP_ON) return null;
  const where = placeLocative(stops);
  let k: string;
  if (score === 0) k = s.exploded ? "gaz" : "kapida";
  else if (s.exploded) k = "gaz";
  else if (newRecord && score >= 10) k = "rekor";
  else if (stops >= 4) k = "seyyah";
  else if (s.landings >= 5 && s.perfect >= Math.max(4, s.landings * 0.4)) k = "nisanci";
  else if (s.maxMulti >= 4 || s.multi >= 3) k = "aceleci";
  else if (s.landings >= 5 && s.edge >= s.landings * 0.3) k = "cambaz";
  else if (s.landings >= 5 && s.center >= s.landings * 0.6) k = "temkinli";
  else k = "keyifli";
  const opts = LAKAP[k].filter((x) => x !== lastLakap); // aynı lakap üst üste gelmesin (video: 3 kez aynısı)
  const sifat = pick(opts.length ? opts : LAKAP[k]);
  lastLakap = sifat;
  return `${where} ${sifat}`;
}
