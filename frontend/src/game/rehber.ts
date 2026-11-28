// PEŞİMDEKİ KEDİ — gri kutu (2026-11-28, kullanıcı: "peşimdeki kedi ile devam edelim"; anket 7 editör, kedi 17 puan).
// Bir tekir kedi amcanın önünde, iki kule ileride bekler. Oraya bir zıplayışta (aradaki kuleyi atlayarak) inmek
// "kediyi izlemek"tir; kolay yol bir sonraki kule. REHBER_N kez izleyince kedi ışıklı bir pencereye götürür.
// Zıplama fiziği, kamera, kule üretimi ve puan kuralı DEĞİŞMEZ: kedi yalnız VAR OLAN kuleleri seçer ve yalnız
// gerçek fizikle (jump.ts + landing.ts) en az REHBER_PENCERE_MIN genişlikte bir basış aralığı onu oraya indiriyorsa
// iki ileri gider; yoksa bir sonraki kulede bekler (haksız zorluk yok). Kaçırmanın cezası yok.
import { CONFIG } from "./config";
import { advanceFlight, jumpVelocity } from "./jump";
import { findFootLanding } from "./landing";

export const REHBER_ON = true as boolean;
/** Kaç kez izleyince pencere finali. */
export const REHBER_N = 4;
/** Kedinin iki kule ileri gitmesi için hedefe indiren şarj aralığının en az genişliği (0..1; 1 = 0,45 sn tam basış). */
export const REHBER_PENCERE_MIN = 0.05;
/** Şarj taraması adım sayısı. */
const ADIM = 200;

type P = { id: number; x: number; topY: number; width: number };

function bul(list: readonly P[], id: number): P | null {
  for (let i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
  return null;
}

/**
 * fromId kulesinde, ayak merkezi startX'te duran amca için: hangi şarj oranları (0..1) gerçek uçuşla targetId'ye indirir?
 * Dönüş: indiren şarjların oranı (ADIM taramasında) — "basış penceresi" genişliği.
 */
export function inisPenceresi(list: readonly P[], fromId: number, startX: number, targetId: number, screenW: number, footW: number) {
  const a = bul(list, fromId);
  const b = bul(list, targetId);
  if (!a || !b) return 0;
  const aday: P[] = [];
  for (let id = fromId; id <= targetId; id++) {
    const q = bul(list, id);
    if (q) aday.push(q);
  }
  const PH = CONFIG.playerHeight;
  const dt = 1 / 120;
  let hit = 0;
  for (let k = 1; k <= ADIM; k++) {
    const v = jumpVelocity(k / ADIM, screenW);
    let x = startX, y = a.topY - PH / 2, vy = v.vy;
    for (let s = 0; s < 120 * 4; s++) {
      const prevX = x, prevBottom = y + PH / 2;
      const f = advanceFlight(x, y, v.vx, vy, dt, screenW);
      x = f.x; y = f.y; vy = f.vy;
      if (vy > 0) {
        const c = findFootLanding(aday, prevX, x, prevBottom, y + PH / 2, footW);
        if (c) { if (aday[c.index].id === targetId) hit++; break; }
      }
      if (y > 3000) break;
    }
  }
  return hit / ADIM;
}

/** Kedinin bekleyeceği kule: iki ileri adil ise oraya, değilse bir sonraki kuleye. */
export function rehberHedef(list: readonly P[], landedId: number, startX: number, screenW: number, footW: number) {
  if (bul(list, landedId + 2) && inisPenceresi(list, landedId, startX, landedId + 2, screenW, footW) >= REHBER_PENCERE_MIN) return landedId + 2;
  return bul(list, landedId + 1) ? landedId + 1 : -1;
}

/** YALNIZ KANIT VİDEOSU: otomatik pilot (telefona giden sürümde false). Hedef kuleye inen şarj aralığının ortasıyla zıplar. */
export const REHBER_OTO = false as boolean;
export function ortaSarj(list: readonly P[], fromId: number, startX: number, targetId: number, screenW: number, footW: number) {
  const a = bul(list, fromId);
  if (!a || !bul(list, targetId)) return -1;
  const aday: P[] = [];
  for (let id = fromId; id <= targetId; id++) { const q = bul(list, id); if (q) aday.push(q); }
  const PH = CONFIG.playerHeight, dt = 1 / 120;
  const isabet: number[] = [];
  for (let k = 1; k <= ADIM; k++) {
    const v = jumpVelocity(k / ADIM, screenW);
    let x = startX, y = a.topY - PH / 2, vy = v.vy;
    for (let s = 0; s < 480; s++) {
      const prevX = x, prevBottom = y + PH / 2;
      const f = advanceFlight(x, y, v.vx, vy, dt, screenW);
      x = f.x; y = f.y; vy = f.vy;
      if (vy > 0) { const c = findFootLanding(aday, prevX, x, prevBottom, y + PH / 2, footW); if (c) { if (aday[c.index].id === targetId) isabet.push(k / ADIM); break; } }
      if (y > 3000) break;
    }
  }
  return isabet.length ? isabet[Math.floor(isabet.length / 2)] : -1;
}
