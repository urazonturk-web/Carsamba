// Centralized game-facing copy/flavor text. Kept here (not inlined in JSX)
// so a future localization pass has one place to look, per the dialogue
// workshop's integration package (dialog-mizah/entegrasyon-teslimi-2026-09-18.md,
// Paket 2 / D6-2). No i18n system exists yet -- this is plain string exports,
// not a translation table.

// Shown once per Game Over on the result screen. Single fixed line for now;
// no rotation/pool with the backup candidate (D6-4) yet -- see the
// integration package's technical question 5.
export const GAME_OVER_LINE = "Havada emindin, yerde şaşkındın.";
