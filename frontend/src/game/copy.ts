// Centralized game-facing copy/flavor text. Kept here (not inlined in JSX)
// so a future localization pass has one place to look, per the dialogue
// workshop's integration package (dialog-mizah/entegrasyon-teslimi-2026-09-18.md,
// Paket 2 / D6-2). No i18n system exists yet -- this is plain string exports,
// not a translation table.

// D6-2: the approved result-screen line.
export const GAME_OVER_LINE = "Havada emindin, yerde şaşkındın.";

// FAZ1 (2026-11-11, ANALIZ-2026-11-11): result-screen line pool, picked by
// context and never the same line twice in a row (answers integration
// question 5: rotation). APPROVED = user-approved lines (D6-2 + backup D6-4).
// DRAFT lines come from dialog-mizah/taslak-uc-ton-karsilastirma.md (Ton A/B/C,
// still TASLAK) plus two new record lines; they need the user's approval and
// switch off with QUIP_DRAFTS=false (pool falls back to the approved lines).
export const QUIP_DRAFTS = true as boolean;
// 2026-11-11 user: every line read weak ("maybe we skip them"); the result
// card shows no quip until a better-briefed writing round is approved.
export const QUIP_ON = false as boolean;

export type QuipContext = "record" | "near" | "early" | "any";

const APPROVED = [GAME_OVER_LINE, "Skorun rahat bir nefes aldı."];

const DRAFT: Record<QuipContext, string[]> = {
  // new personal best
  record: [
    "Yeni rekor. Bunu bir süre herkese anlatacaksın.",
    "Rekor kırdın; bundan sonra senden \"bölgesel efsane\" diye bahsedilecek.",
  ],
  // 1-3 points short of the record (Ton A)
  near: [
    "\"Az kaldı\"nın tam olarak ne kadar az olduğunu tartışmaya açıksın.",
    "Düştün; ama inişteki açının doğru olduğuna içten içe eminsin.",
  ],
  // very short run (Ton B / C)
  early: [
    "Düştün. Zaten bekliyordun.",
    "Skor düşük, sen buna \"stratejik mola\" diyorsun.",
    "Skor düşük ama beklenti daha düşüktü, o yüzden fena sayılmaz.",
  ],
  // everything else (Ton B)
  any: ["Düştün ama bunu emeklilik olarak duyurmaya karar verdin."],
};

export function quipContext(score: number, prevBest: number): QuipContext {
  if (score > prevBest && score > 0) return "record";
  if (score <= 2) return "early";
  if (prevBest - score >= 1 && prevBest - score <= 3) return "near";
  return "any";
}

export function pickQuip(ctx: QuipContext, previous: string): string {
  const pool = [...(QUIP_DRAFTS ? DRAFT[ctx] : []), ...(ctx !== "record" || !QUIP_DRAFTS ? APPROVED : [])];
  const choices = pool.filter((l) => l !== previous);
  const list = choices.length > 0 ? choices : pool;
  return list[Math.floor(Math.random() * list.length)];
}

// FAZ1: emoji under the "+N" of a multi-tower jump. 2026-11-11 user: the word
// shouts ("Oha!") read too crude -- use emoji instead of words.
export function multiJumpShout(towers: number): string {
  if (towers >= 5) return "🧿🚀";
  if (towers === 4) return "🚀";
  if (towers === 3) return "🔥";
  return "👏";
}
