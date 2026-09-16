import { CONFIG } from "./config";

type LandingPlatform = { x: number; width: number; topY: number };

// Swept sole contact: use the horizontal position at the instant the feet cross
// the top, not at frame end. No invisible ledge or snap from below the surface.
export function findFootLanding(
  platforms: readonly LandingPlatform[], fromX: number, toX: number,
  fromBottom: number, toBottom: number, bodyWidth: number,
) {
  "worklet";
  const drop = toBottom - fromBottom;
  if (drop <= 0) return null;
  let first: { index: number; x: number; time: number } | null = null;
  for (let index = 0; index < platforms.length; index++) {
    const p = platforms[index];
    if (fromBottom > p.topY || toBottom < p.topY) continue;
    const time = (p.topY - fromBottom) / drop;
    const x = fromX + (toX - fromX) * time;
    for (let foot = 0; foot < CONFIG.footSoles.length; foot++) {
      const sole = CONFIG.footSoles[foot];
      const left = x + (sole[0] - 0.5) * bodyWidth;
      const right = x + (sole[1] - 0.5) * bodyWidth;
      if (right >= p.x && left <= p.x + p.width) {
        if (first === null || time < first.time) first = { index, x, time };
        break;
      }
    }
  }
  return first;
}
