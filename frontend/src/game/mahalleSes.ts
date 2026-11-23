// MAHALLE SESLE KONUŞUR (2026-11-23; editör önerisi YARATICI-SES-2026-11-21, Claudex planı MAHALLE-SES-2026-11-23).
// Yazı balonu yerine inişe bağlı, ekran dışından gelen kısa mahalle sesleri. Yalnız JS, olay anında.
// Rastgelelik ayrı üreteçten (oyunun paylaşılan rastgele akışına dokunmaz).
import { playSfx, type SfxName } from "./sfx";

// 2026-11-23 12:50 kullanıcı: "seslerin hiç biri olmamış, bazılarında timing hatası var, oyun takılıyormuş gibi" → kapalı.
export const MAHALLE_SES_ON = false as boolean;

export type MahalleOlay =
  | { tur: "inis"; perfect: number; ratio: number; towersCrossed: number }
  | { tur: "oyunSonu"; rekor: boolean }
  | { tur: "karga"; gecikmeMs: number };

type Karar = { ses: SfxName; gecikmeMs: number } | null;

function rngYap(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Saf karar motoru (test edilebilir): saat ve üreteç dışarıdan.
export function mahalleSesMotoru(rnd: () => number) {
  const sonCalma: Record<string, number> = {};
  let sonOdul: SfxName | null = null;
  let odulTekrar = 0;
  let sonHerhangi = -1e12; // aynı anda en fazla bir mahalle sesi
  const GENEL_ARALIK = 1500;

  const uygun = (grup: string, soguma: number, simdi: number) =>
    simdi - (sonCalma[grup] ?? -1e12) >= soguma && simdi - sonHerhangi >= GENEL_ARALIK;
  const kaydet = (grup: string, simdi: number, gecikme: number) => {
    sonCalma[grup] = simdi + gecikme;
    sonHerhangi = simdi + gecikme;
  };

  return function karar(o: MahalleOlay, simdi: number): Karar {
    if (o.tur === "inis") {
      // İniş başına tek aday, öncelik: büyük çoklu zıplama > kıl payı > kusursuz. Düşen aday alt sıraya geçmez.
      if (o.towersCrossed >= 3) {
        if (!uygun("hooyt", 10000, simdi) || rnd() >= 0.5) return null;
        kaydet("hooyt", simdi, 350);
        return { ses: "m_hooyt", gecikmeMs: 350 };
      }
      if (o.ratio <= 0.12 || o.ratio >= 0.88) {
        if (!uygun("iiih", 6000, simdi) || rnd() >= 0.7) return null;
        kaydet("iiih", simdi, 120);
        return { ses: "m_iiih", gecikmeMs: 120 };
      }
      if (o.perfect > 0) {
        if (!uygun("odul", 4000, simdi) || rnd() >= 0.45) return null;
        let ses: SfxName = rnd() < 0.5 ? "m_islik" : "m_alkis";
        if (ses === sonOdul && odulTekrar >= 2) ses = ses === "m_islik" ? "m_alkis" : "m_islik";
        odulTekrar = ses === sonOdul ? odulTekrar + 1 : 1;
        sonOdul = ses;
        kaydet("odul", simdi, 200);
        return { ses, gecikmeMs: 200 };
      }
      return null;
    }
    if (o.tur === "oyunSonu") {
      if (o.rekor) return null; // rekor anı bozulmasın
      if (simdi - sonHerhangi < GENEL_ARALIK) return null;
      kaydet("panjur", simdi, 450);
      return { ses: "m_panjur", gecikmeMs: 450 };
    }
    if (o.tur === "karga") {
      if (!uygun("karga", 3000, simdi) || rnd() >= 0.6) return null;
      const g = Math.max(0, o.gecikmeMs);
      kaydet("karga", simdi, g);
      return { ses: rnd() < 0.5 ? "m_karga1" : "m_karga2", gecikmeMs: g };
    }
    return null;
  };
}

const motor = mahalleSesMotoru(rngYap(Date.now()));

export function mahalleSes(o: MahalleOlay) {
  if (!MAHALLE_SES_ON) return;
  const k = motor(o, Date.now());
  if (!k) return;
  if (k.gecikmeMs > 0) setTimeout(() => playSfx(k.ses), k.gecikmeMs);
  else playSfx(k.ses);
}
