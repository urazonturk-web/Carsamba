// HAYALET YARIŞ (2026-11-16)
// Kullanıcı: "aynı haritada birbirlerinin zıplamalarını görerek oynayacakları 3 dakikalık bir oyun;
// yanan tekrar baştan başlıyor; en sonunda kim ne kadar puan yapmış ve en uzağa gitmişse".
// Karar: önce asenkron hayalet yarış. Kazanan = tek koşuda en uzak kule; eşitlikte en iyi koşu puanı.
// Rakibin zıplamaları kule kimliği + kule üstündeki oranla kaydedilir (ekran genişliği farkı yüzünden
// mutlak x gönderilmez; bkz. ai_review_evidence/ONLINE-YARIS-2026-11-16/RAPOR.md).

export const YARIS_ON = true;
export const RACE_MS = 120_000; // kullanıcı: "3 dakika çok uzun" -> 2 dk
export const RESPAWN_MS = 700;

// Olay türleri
export const EV_LAUNCH = 0;
export const EV_LAND = 1;
export const EV_FALL = 2;
export const EV_RESPAWN = 3;

/** Düz dizi: [t, tür, kule, oran*1000] tekrarları. t = yarış başından ms. */
export type RaceLog = number[];

export type RaceSummary = { far: number; best: number; runs: number };
export type RaceData = RaceSummary & { v: 1; log: RaceLog };

export function pushEvent(log: RaceLog, t: number, kind: number, tower = 0, ratio = 0) {
  log.push(Math.max(0, Math.round(t)), kind, tower | 0, Math.round(Math.max(-1, Math.min(2, ratio)) * 1000));
}

export function encodeRace(d: RaceSummary, log: RaceLog): string {
  const data: RaceData = { v: 1, far: d.far, best: d.best, runs: d.runs, log };
  return JSON.stringify(data);
}

export function decodeRace(raw?: string | null): RaceData | null {
  if (!raw) return null;
  try {
    const d = JSON.parse(raw);
    if (!d || d.v !== 1 || !Array.isArray(d.log)) return null;
    return { v: 1, far: d.far | 0, best: d.best | 0, runs: d.runs | 0, log: d.log.map((n: any) => +n || 0) };
  } catch {
    return null;
  }
}

/** 1 = a kazandı, -1 = b kazandı, 0 = berabere. */
export function compareRace(a: RaceSummary, b: RaceSummary): number {
  if (a.far !== b.far) return a.far > b.far ? 1 : -1;
  if (a.best !== b.best) return a.best > b.best ? 1 : -1;
  return 0;
}

export function clockText(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
