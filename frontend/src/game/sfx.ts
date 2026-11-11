// FAZ2 (2026-11-11): game sound effects. All five sounds are synthesized
// in-house (no third-party samples, no licence cost). Players are created once
// and reused; playing restarts from 0. Respects the phone's silent switch and
// mixes with the user's own music. Calls are JS-thread only, at discrete events
// (press, release, landing, game over) -- nothing per frame.
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from "expo-audio";

export const SFX_ON = true as boolean;

const SOURCES = {
  charge: require("@/assets/sounds/charge.wav"),
  land: require("@/assets/sounds/land.wav"),
  multi: require("@/assets/sounds/multi.wav"),
  record: require("@/assets/sounds/record.wav"),
  fall: require("@/assets/sounds/fall.wav"),
  // GAZ trial (2026-11-11): fart variants, short / medium / long. Since v3
  // these are real recordings: "Fart 3-8" by aPebble, Pixabay Content
  // License (free, commercial use, no attribution; see assets/sounds/LICENSE-PIXABAY.md),
  // trimmed and normalized. The first in-house synthesis was rejected by the user.
  fart_s1: require("@/assets/sounds/fart-s1.wav"),
  fart_s2: require("@/assets/sounds/fart-s2.wav"),
  fart_m1: require("@/assets/sounds/fart-m1.wav"),
  fart_m2: require("@/assets/sounds/fart-m2.wav"),
  fart_l1: require("@/assets/sounds/fart-l1.wav"),
  fart_l2: require("@/assets/sounds/fart-l2.wav"),
} as const;

export type SfxName = keyof typeof SOURCES;

const VOLUME: Record<SfxName, number> = {
  charge: 0.35, land: 0.7, multi: 0.6, record: 0.55, fall: 0.45,
  fart_s1: 0.55, fart_s2: 0.55, fart_m1: 0.55, fart_m2: 0.55, fart_l1: 0.6, fart_l2: 0.6,
};
const FARTS: SfxName[] = ["fart_s1", "fart_s2", "fart_m1", "fart_m2", "fart_l1", "fart_l2"];

// 2026-11-11 phone test (ScreenRecording 14-39-15): ~1 in 4 landing/fall
// sounds were silent. play() was called before the un-awaited seekTo(0) had
// finished, so a player that had already reached its end could stay silent.
// Now: two players per sound (round robin, so a re-trigger never fights a
// still-playing copy) and play() only after the seek resolves.
const POOL = 2;
let players: Partial<Record<SfxName, AudioPlayer[]>> | null = null;
const turn: Partial<Record<SfxName, number>> = {};

export function initSfx() {
  if (!SFX_ON || players) return;
  setAudioModeAsync({ playsInSilentMode: false, interruptionMode: "mixWithOthers" }).catch(() => {});
  players = {};
  for (const k of Object.keys(SOURCES) as SfxName[]) {
    const list: AudioPlayer[] = [];
    for (let i = 0; i < (k === "charge" ? 1 : POOL); i++) {
      try {
        const p = createAudioPlayer(SOURCES[k]);
        p.volume = VOLUME[k];
        list.push(p);
      } catch {
        // a missing player only means silence for that event
      }
    }
    players[k] = list;
  }
}

export function playSfx(name: SfxName) {
  const list = players?.[name];
  if (!list || list.length === 0) return;
  const i = (turn[name] ?? 0) % list.length;
  turn[name] = i + 1;
  const p = list[i];
  try {
    if (p.playing) p.pause();
    p.seekTo(0)
      .then(() => p.play())
      .catch(() => {
        try {
          p.play();
        } catch {}
      });
  } catch {}
}

export function stopSfx(name: SfxName) {
  for (const p of players?.[name] ?? []) {
    try {
      p.pause();
    } catch {}
  }
}

// GAZ trial: size follows the released charge (short tap = small "pıt", full
// charge = the long one); never the same variant twice in a row.
let lastFart: SfxName | null = null;
export function playFart(charge: number) {
  const group: SfxName[] = charge < 0.35 ? ["fart_s1", "fart_s2"] : charge < 0.85 ? ["fart_m1", "fart_m2"] : ["fart_l1", "fart_l2"];
  const choices = group.filter((n) => n !== lastFart);
  const pick = choices[Math.floor(Math.random() * choices.length)] ?? group[0];
  lastFart = pick;
  playSfx(pick);
}

export function stopFart() {
  for (const n of FARTS) stopSfx(n);
}
