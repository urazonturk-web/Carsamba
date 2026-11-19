import { Platform } from "react-native";
import { requireOptionalNativeModule } from "expo";

export type GameCenterPlayer = { authenticated: boolean; displayName: string; underage: boolean };

type Native = {
  isAuthenticated(): boolean;
  authenticate(): Promise<GameCenterPlayer>;
  submitScore(score: number, leaderboardId: string): Promise<boolean>;
  showLeaderboard(leaderboardId: string): Promise<boolean>;
  copyText?(text: string): boolean;
  challengeFriend?(seed: number, score: number, from: string): Promise<ChallengeSendResult>;
  loadChallenges?(): Promise<{ incoming: FriendChallenge[]; results: FriendChallenge[] }>;
  finishChallenge?(matchID: string, score: number, name: string): Promise<{ status: string; message?: string }>;
  removeChallenge?(matchID: string): Promise<boolean>;
  loadFriends?(leaderboardId: string): Promise<{ status: string; message?: string; friends: GameCenterFriend[] }>;
  challengePlayer?(playerID: string, seed: number, score: number, from: string, race: string): Promise<ChallengeSendResult>;
  finishChallengeRace?(matchID: string, score: number, name: string, race: string, outcome: number): Promise<{ status: string; message?: string }>;
  battery?(): Promise<{ level: number; state: number }>;
  istanbulWeather?(): Promise<AppleWeather>;
  shareSnapshot?(x: number, y: number, w: number, h: number, message: string): Promise<string>;
  addListener?(event: string, cb: (e: FriendChallenge) => void): { remove(): void };
};

export type GameCenterFriend = { id: string; name: string; alias: string; score?: number };
export type FriendChallenge = { matchID: string; seed: number; score: number; from: string; reply?: number; replier?: string; race?: string; replyRace?: string };
export type ChallengeSendResult = { status: "sent" | "cancelled" | "error" | "not_signed_in" | "replaced"; matchID?: string; message?: string };

// Optional: null on Android/web or in a binary built before this module existed,
// so the game never crashes just because Game Center is missing.
const native = Platform.OS === "ios" ? requireOptionalNativeModule<Native>("ByzantionGameCenter") : null;

const NOT_SIGNED_IN: GameCenterPlayer = { authenticated: false, displayName: "", underage: false };

export const gameCenterAvailable = native != null;

export async function authenticate(): Promise<GameCenterPlayer> {
  if (!native) return NOT_SIGNED_IN;
  try {
    return await native.authenticate();
  } catch {
    return NOT_SIGNED_IN;
  }
}

export async function submitScore(score: number, leaderboardId: string): Promise<boolean> {
  if (!native || score <= 0) return false;
  try {
    return await native.submitScore(Math.floor(score), leaderboardId);
  } catch {
    return false;
  }
}

export async function showLeaderboard(leaderboardId: string): Promise<boolean> {
  if (!native) return false;
  try {
    return await native.showLeaderboard(leaderboardId);
  } catch {
    return false;
  }
}

/** Metni panoya kopyalar (iOS). Eski bir derlemede işlev yoksa false döner. */
export function copyText(text: string): boolean {
  if (!native || typeof native.copyText !== "function") return false;
  try {
    return native.copyText(text);
  } catch {
    return false;
  }
}

/** MEYDAN OKUMA · ARKADAŞ: Game Center arkadaş seçme ekranı (sıra tabanlı maç). */
export async function challengeFriend(seed: number, score: number, from: string): Promise<ChallengeSendResult> {
  if (!native || typeof native.challengeFriend !== "function") return { status: "error", message: "unavailable" };
  try { return await native.challengeFriend(seed, Math.floor(score), from); } catch (e: any) { return { status: "error", message: String(e?.message ?? e) }; }
}
export async function loadChallenges(): Promise<{ incoming: FriendChallenge[]; results: FriendChallenge[] }> {
  if (!native || typeof native.loadChallenges !== "function") return { incoming: [], results: [] };
  try { return await native.loadChallenges(); } catch { return { incoming: [], results: [] }; }
}
export async function finishChallenge(matchID: string, score: number, name: string) {
  if (!native || typeof native.finishChallenge !== "function") return { status: "error" };
  try { return await native.finishChallenge(matchID, Math.floor(score), name); } catch (e: any) { return { status: "error", message: String(e?.message ?? e) }; }
}
export async function removeChallenge(matchID: string) {
  if (!native || typeof native.removeChallenge !== "function") return false;
  try { return await native.removeChallenge(matchID); } catch { return false; }
}
export function onChallenge(event: "onChallenge" | "onChallengeResult", cb: (c: FriendChallenge) => void): () => void {
  if (!native || typeof native.addListener !== "function") return () => {};
  const sub = native.addListener(event, cb);
  return () => sub.remove();
}

/** Game Center arkadaş listesi (ilk seferde iOS izin sorar). */
export async function loadFriends(leaderboardId: string): Promise<{ status: string; message?: string; friends: GameCenterFriend[] }> {
  if (!native || typeof native.loadFriends !== "function") return { status: "unavailable", friends: [] };
  try { return await native.loadFriends(leaderboardId); } catch (e: any) { return { status: "error", message: String(e?.message ?? e), friends: [] }; }
}
/** Seçilen arkadaşa doğrudan meydan okuma gönderir (Apple ekranı açılmaz). */
export async function challengePlayer(playerID: string, seed: number, score: number, from: string, race = ""): Promise<ChallengeSendResult> {
  if (!native || typeof native.challengePlayer !== "function") return { status: "error", message: "unavailable" };
  try { return await native.challengePlayer(playerID, seed, Math.floor(score), from, race); } catch (e: any) { return { status: "error", message: String(e?.message ?? e) }; }
}
/** HAYALET YARIŞ: yarışın sonucunu ve kaydını maça yazıp bitirir (outcome: 1 kazandım, -1 kaybettim, 0 berabere). */
export async function finishChallengeRace(matchID: string, score: number, name: string, race: string, outcome: number) {
  if (!native || typeof native.finishChallengeRace !== "function") return { status: "error" };
  try { return await native.finishChallengeRace(matchID, Math.floor(score), name, race, outcome); } catch (e: any) { return { status: "error", message: String(e?.message ?? e) }; }
}

/** Pil: level 0..1 (-1 bilinmiyor), charging = takılı/dolu. Modül yoksa null. */
export async function battery(): Promise<{ level: number; charging: boolean } | null> {
  if (!native?.battery) return null;
  try {
    const b = await native.battery();
    return { level: b.level, charging: b.state === 2 || b.state === 3 };
  } catch {
    return null;
  }
}

export type AppleWeather = { ok: boolean; condition?: string; temp?: number; windKmh?: number; windDir?: number; legalUrl?: string; message?: string };
/** Apple WeatherKit ile İstanbul'un şu anki havası. Modül yoksa/eski ikilide null. */
export async function istanbulWeather(): Promise<AppleWeather | null> {
  if (!native?.istanbulWeather) return null;
  try {
    return await native.istanbulWeather();
  } catch (e: any) {
    return { ok: false, message: String(e?.message ?? e) };
  }
}

/** PAYLAŞIM KARTPOSTALI: ekrandaki dikdörtgeni (pencere koordinatı, nokta) görüntü olarak paylaşır. */
export async function shareSnapshot(x: number, y: number, w: number, h: number, message: string): Promise<"shared" | "cancelled" | "error" | "unavailable"> {
  if (!native?.shareSnapshot) return "unavailable";
  try { return (await native.shareSnapshot(x, y, w, h, message)) as any; } catch { return "error"; }
}
