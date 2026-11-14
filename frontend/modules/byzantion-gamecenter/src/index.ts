import { Platform } from "react-native";
import { requireOptionalNativeModule } from "expo";

export type GameCenterPlayer = { authenticated: boolean; displayName: string; underage: boolean };

type Native = {
  isAuthenticated(): boolean;
  authenticate(): Promise<GameCenterPlayer>;
  submitScore(score: number, leaderboardId: string): Promise<boolean>;
  showLeaderboard(leaderboardId: string): Promise<boolean>;
};

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
