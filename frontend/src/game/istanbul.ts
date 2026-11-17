// GERÇEK İSTANBUL (2026-11-17, kullanıcı: "hava o gün İstanbul'da nasıl ise bizim oyunda da gerçek zamanlı
// olsun … ilk üçünü yapalım"; ai_review_evidence/YARATICI-FIKIR-2026-11-17/RAPOR.md).
// 1) Gerçek saat: gün doğumu/batımı İstanbul için internetsiz hesaplanır; gökyüzü en az o saatin tonunda olur.
// 2) Ay evresi: internetsiz; dolunayda Boğaz'da yakamoz.
// 3) Hava: yalnız GÖRÜNÜŞ (fizik, kamera, çatı aynı). Kullanıcı konumu istenmez, sabit İstanbul koordinatı.
//    Kaynak şimdilik Open-Meteo (anahtarsız; ücretsiz katmanı ticari olmayan kullanım içindir -> TestFlight
//    denemesi için). App Store'dan önce Apple WeatherKit'e geçilmeli (hesap işlemi, kullanıcı onayı gerekir).

export const ISTANBUL_ON = true as boolean;
/** Menüdeki hava satırına dokununca hava türleri sırayla denenir; uzun basınca gece + dolunay denemesi. */
export const WEATHER_TEST_TAP = true as boolean;

const LAT = 41.0082;
const LON = 28.9784;
const RAD = Math.PI / 180;
const DAY_MS = 86_400_000;
const TR_OFFSET_MS = 3 * 3_600_000; // Türkiye 2016'dan beri sabit UTC+3

/** Bugünün (İstanbul takvimiyle) gün doğumu ve batımı, epoch ms. */
export function sunTimes(now = Date.now()) {
  const local = new Date(now + TR_OFFSET_MS);
  const day0 = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate());
  const J = day0 / DAY_MS + 2440587.5 + 0.5; // öğlen civarı
  const n = Math.round(J - 2451545.0 + 0.0008);
  const Js = n - LON / 360;
  const M = (357.5291 + 0.98560028 * Js) % 360;
  const C = 1.9148 * Math.sin(M * RAD) + 0.02 * Math.sin(2 * M * RAD) + 0.0003 * Math.sin(3 * M * RAD);
  const L = (M + C + 180 + 102.9372) % 360;
  const Jt = 2451545 + Js + 0.0053 * Math.sin(M * RAD) - 0.0069 * Math.sin(2 * L * RAD);
  const sinD = Math.sin(L * RAD) * Math.sin(23.4397 * RAD);
  const cosD = Math.cos(Math.asin(sinD));
  const cosW = (Math.sin(-0.833 * RAD) - Math.sin(LAT * RAD) * sinD) / (Math.cos(LAT * RAD) * cosD);
  const w = Math.acos(Math.max(-1, Math.min(1, cosW))) / RAD;
  const toMs = (jd: number) => (jd - 2440587.5) * DAY_MS;
  return { rise: toMs(Jt - w / 360), set: toMs(Jt + w / 360) };
}

/** Gerçek saate göre gökyüzü adımı (oyundakiyle aynı ölçek: 0 sabah, 1 öğle, 2 ikindi, 3 gün batımı, 4 gece). */
export function realSkyStep(now = Date.now()) {
  const { rise, set } = sunTimes(now);
  const min = 60_000;
  if (now < rise - 25 * min || now > set + 40 * min) return 4;
  if (now >= set - 50 * min) return 3;
  if (now >= set - 4 * 60 * min) return 2;
  if (now >= rise + 4 * 60 * min) return 1;
  return 0;
}

const SYNODIC = 29.530588853;
const NEW_MOON_2000 = Date.UTC(2000, 0, 6, 18, 14);

/** Ay: yaş (gün), aydınlık oranı 0..1, büyüyor mu, Türkçe adı, dolunay mı. */
export function moonInfo(now = Date.now()) {
  const age = ((((now - NEW_MOON_2000) / DAY_MS) % SYNODIC) + SYNODIC) % SYNODIC;
  const illum = (1 - Math.cos((2 * Math.PI * age) / SYNODIC)) / 2;
  const waxing = age < SYNODIC / 2;
  const full = Math.abs(age - SYNODIC / 2) < 1.5;
  const name = age < 1.5 || age > SYNODIC - 1.5 ? "Yeni ay" : full ? "Dolunay"
    : Math.abs(age - SYNODIC / 4) < 1.5 ? "İlk dördün" : Math.abs(age - (3 * SYNODIC) / 4) < 1.5 ? "Son dördün"
    : illum < 0.5 ? "Hilal" : "Şişkin ay";
  return { age, illum, waxing, full, name };
}

export type WeatherKind = "acik" | "bulutlu" | "yagmur" | "kar" | "sis";
export type WindKind = "lodos" | "poyraz" | null;
export type IstWeather = { kind: WeatherKind; wind: WindKind; temp: number; at: number; test?: boolean };

export const WEATHER_CACHE_KEY = "byz.weather.v1";
export const WEATHER_TOAST_KEY = "byz.weatherToastDay.v1";
export const WEATHER_STALE_MS = 6 * 3_600_000;
export const WEATHER_REFRESH_MS = 30 * 60_000;

const KIND_NAME: Record<WeatherKind, string> = { acik: "Açık", bulutlu: "Kapalı", yagmur: "Yağmurlu", kar: "Karlı", sis: "Sisli" };

/** WMO hava kodu + rüzgâr -> oyun havası. Rüzgâr yönü: esmeye başladığı yön (derece). */
export function mapWeather(code: number, windKmh: number, windDir: number): { kind: WeatherKind; wind: WindKind } {
  let kind: WeatherKind = "acik";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) kind = "kar";
  else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95) kind = "yagmur";
  else if (code === 45 || code === 48) kind = "sis";
  else if (code === 3) kind = "bulutlu";
  let wind: WindKind = null;
  if (windKmh >= 20) {
    if (windDir >= 190 && windDir <= 255) wind = "lodos"; // güneybatı
    else if (windDir >= 15 && windDir <= 75) wind = "poyraz"; // kuzeydoğu
  }
  return { kind, wind };
}

export async function fetchWeather(): Promise<IstWeather | null> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}`
    + "&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m&timezone=Europe%2FIstanbul";
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const r = await fetch(url, { signal: ctrl.signal });
    clearTimeout(t);
    if (!r.ok) return null;
    const j = await r.json();
    const c = j?.current;
    if (!c || typeof c.weather_code !== "number") return null;
    const m = mapWeather(c.weather_code, +c.wind_speed_10m || 0, +c.wind_direction_10m || 0);
    return { ...m, temp: Math.round(+c.temperature_2m || 0), at: Date.now() };
  } catch {
    return null;
  }
}

export function parseWeather(raw: unknown): IstWeather | null {
  if (typeof raw !== "string") return null;
  try {
    const w = JSON.parse(raw);
    if (!w || !(w.kind in KIND_NAME)) return null;
    return { kind: w.kind, wind: w.wind === "lodos" || w.wind === "poyraz" ? w.wind : null, temp: +w.temp || 0, at: +w.at || 0 };
  } catch {
    return null;
  }
}

/** Menü kartpostalındaki damga: "17 Kasım · Lodos · 14°". */
export function weatherStamp(w: IstWeather, months: readonly string[], now = Date.now()) {
  const d = new Date(now + TR_OFFSET_MS);
  const parts = [`${d.getUTCDate()} ${months[d.getUTCMonth()]}`];
  if (w.wind) parts.push(w.wind === "lodos" ? "Lodos" : "Poyraz");
  if (w.kind !== "acik" || !w.wind) parts.push(KIND_NAME[w.kind]);
  parts.push(`${w.temp}°`);
  return parts.join(" · ");
}

/** Günün ilk koşusunda tek satır. */
export function weatherLine(w: IstWeather, night: boolean, fullMoon: boolean) {
  if (w.kind === "kar") return "İstanbul'a kar yağıyor! Okullar tatil mi acaba?";
  if (w.kind === "yagmur") return "Bugün İstanbul'da yağmur var, şemsiyeni unutma!";
  if (w.kind === "sis") return "Boğaz'da sis var, vapurlar düdük çalıyor.";
  if (w.wind === "lodos") return "Bugün İstanbul'da lodos var, çamaşırları topla!";
  if (w.wind === "poyraz") return "Poyraz esiyor, atkını tak amca!";
  if (night && fullMoon) return "Bu gece dolunay, Boğaz'da yakamoz var.";
  if (w.kind === "bulutlu") return "Bugün İstanbul kapalı, tam çay havası.";
  return night ? "İstanbul'da gece, yıldızlar çatıların üstünde." : "Bugün İstanbul'da hava açık, tam zıplamalık!";
}

/** Deneme sırası (menüde dokununca). */
export const WEATHER_TEST_CYCLE: Array<{ kind: WeatherKind; wind: WindKind }> = [
  { kind: "yagmur", wind: null }, { kind: "kar", wind: null }, { kind: "sis", wind: null },
  { kind: "acik", wind: "lodos" }, { kind: "bulutlu", wind: "poyraz" }, { kind: "bulutlu", wind: null }, { kind: "acik", wind: null },
];

/** Türkiye saatiyle bugünün anahtarı. */
export function trDayKey(now = Date.now()) {
  const d = new Date(now + TR_OFFSET_MS);
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
}
