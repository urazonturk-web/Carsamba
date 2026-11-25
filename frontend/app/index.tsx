import { Image as CachedImage } from "expo-image";
import { Asset } from "expo-asset";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type GestureResponderEvent,
  Platform,
  Pressable,
  Alert,
  AppState,
  Linking,
  ScrollView,
  Share,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  runOnJS,
  runOnUI,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  type SharedValue,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  withRepeat,
  cancelAnimation,
  Easing,
  interpolateColor,
  FadeIn,
  FadeOut,
  FadeInDown,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AmbientBirds } from "../src/game/AmbientBirds";
import { NO_IMAGE_CLIP, NoClipImage as Image } from "../src/game/NoClipImage";
import { ChargePoses } from "../src/game/ChargePoses";
import { CHARGE_POSES, FAZ2_IFADE, dususKesin, DUSUS_KARE_MS } from "../src/game/character-pose";
import { PIJAMA_ON, HAT_SOURCE, SLIPPER_SOURCE, DOOR_CLOSED_SOURCE, DOOR_OPEN_SOURCE, DOOR_ASPECT, DOOR_HEIGHT_RATIO, DOOR_MS, DOOR_SINK, STEP_LIFT, PIJAMA_TEST_EARLY, TEST_START_TOWER } from "../src/game/pijama";
import { ANCHOR_SHIFT_PX, GLOBAL_VISUAL_SCALE, POSE_FEET_SPAN_PX } from "../src/game/character-pose";
import { AMBIENT_ON, AmbientEvents } from "../src/game/AmbientEvents";
import { POSTCARDS, POSTCARDS_KEY, POSTCARDS_ON, parseUnlocked } from "../src/game/postcards";
import { DAILY_KEY, DAILY_MAP, dailySeed, todayKey, todayLabel, type DailyRecord } from "../src/game/daily";
import { DURAK_SEFER, nextStopLine, reachedLine, stopName, stopTowerId, stopsPassed, NIGHT_STOP, FINAL_STOP, bridgeAt, bridgeFromFoot, bridgeArrivingAt, skyStepForStops } from "../src/game/stops";
const START_SKY = DURAK_SEFER ? skyStepForStops(stopsPassed(TEST_START_TOWER)) : 0;
import { SFX_ON, initSfx, playFart, playSfx, setSfxMuted, stopFart, stopSfx } from "../src/game/sfx";
import { GAME_OVER_LINE, QUIP_ON, multiJumpShout, pickQuip, quipContext } from "../src/game/copy";
import { mahalleSes } from "../src/game/mahalleSes";
import { KARGA_ON, KARGA_TUNEMIS, KARGA_BAKIS, KARGA_YEM, KARGA_HAVALANMA, KARGA_FOOT_Y, KARGA_BOX_K, KARGA_MAX_Y, kargaSayisi, kargaTunek, kargaTunekAny, kargaBekle, kargaHedefTuru, kargaRngYap, kargaUcus, KARGA_TEST, KARGA_HAVUZ, KARGA_UCUS_MS } from "../src/game/karga";
import { CEPHE_HUCRE, CEPHE_DONEM_PX, CEPHE_BASLANGIC_PX } from "../src/game/cepheCesit";
import { MAHALLE_ON, MAHALLE_SPEECH_ON, CUMBA_SOURCE, CUMBA_KEDI_SOURCE, CUMBA_ASPECT, CUMBA_TEYZE_SOURCE, CUMBA_TEYZE_BAKIS_SOURCE, CUMBA_TEYZE_ASPECT, cumbaBox, MAHALLE_BOX, TEYZE_ASPECT, KEDI_ASPECT, KEDI_UYUYAN_FOOT, KEDI_DIK_FOOT, AMCA_ASPECT, COCUK_ASPECT, KEDI_GERINEN_ASPECT, KEDI_GRI_ASPECT, TEYZE_SOURCE, KEDI_SOURCE, AMCA_SOURCE, COCUK_SOURCE, KEDI_GERINEN_SOURCE, KEDI_GRI_SOURCE, KEDI_ADLARI, sakin, teyzeBox, kediBox, kediAdi, kediGri, kediGriNo, pencereAspect, pencereLafi, kediLafi, KEDI_DEFTER_KEY, mahalleKaynak, kediGorunum, kediGorunumNo, kadinNo, KADIN_KAYNAK, KEDI_YENI, KEDI_YENI_ASPECT, SAKIN_TOHUM } from "../src/game/mahalle";
import { OZEL_GUN_ON, OZEL_GUN_TEST_TAP, OZEL_GUNLER, OZEL_GUN_TEST_ORDER, todaysEvent } from "../src/game/ozelGun";
import { HANIM_ON, ICSES_ON, LAKAP_ON, newRunStats, noteLanding, icSesAfterLanding, icSesIdle, hanimMessage, lakap } from "../src/game/amcaSesi";
import { jumpVelocity, advanceFlight } from "../src/game/jump";
import { findFootLanding } from "../src/game/landing";
import { MEYDAN_ON, makeCode, parseCode, shareText, type Challenge } from "../src/game/meydan";
import { SymbolView } from "expo-symbols";
import * as SplashScreen from "expo-splash-screen";
import { KIS_ON, WINTER_HAT_SOURCE, WINTER_SCARF_SOURCE } from "../src/game/kis";
import { YAGMUR_ON } from "../src/game/yagmur";
import { SHARE_CARD_ON, ShareSheet } from "../src/game/ShareCard";
const HAVA_GALERI = false as boolean; // GEÇİCİ: hava ekran görüntüleri için (gündüz); iş bitince false
const HAVA_GALERI_DONGU = false as boolean; // GEÇİCİ: oyunda hava 4 sn'de bir değişsin
import { SEMSIYE_ON, SEMSIYE_TEST, umbrellaMode } from "../src/game/semsiye";
import { OPEN_METEO_FALLBACK, fromApple, seasonFor, SEASON_NAME, type Season } from "../src/game/istanbul";
import { ISTANBUL_ON, WEATHER_TEST_TAP, WEATHER_CACHE_KEY, WEATHER_TOAST_KEY, WEATHER_STALE_MS, WEATHER_REFRESH_MS, WEATHER_TEST_CYCLE, realSkyStep, moonInfo, fetchWeather, parseWeather, weatherStamp, weatherLine, trDayKey, type IstWeather } from "../src/game/istanbul";
import { SkyWeather, PrecipLayer } from "../src/game/WeatherLayer";
import { YARIS_ON, RACE_MS, RESPAWN_MS, EV_LAUNCH, EV_LAND, EV_FALL, EV_RESPAWN, pushEvent, encodeRace, decodeRace, compareRace, clockText, type RaceData, type RaceLog, type RaceSummary } from "../src/game/yaris";
// AÇILIŞ (2026-11-17, kullanıcı videosu 10-52-11: "ilk 2 saniye kötü gözüküyor"): iPhone açılış ekranındaki
// görsel küçük bir kutuda çıkıyor, ardından eski, farklı ölçekli bulanık bir geçiş görseli geliyordu. Artık açılış
// ekranı ve yükleme örtüsü aynı düz gökyüzü rengi (ios SplashScreen.storyboard, SplashScreenBackground); sahne ve
// menü bu renkten yumuşakça belirir. (Açılış ekranında görsel simülatörde güvenilir çizilmedi.)
const OPENING_SKY = "#70c7f2"; // = SplashScreenBackground (kök görünüm de bu renkte)
// 2026-11-17 kullanıcı (video 11-14-07): "direk menü ekranı açılmalı". iPhone açılış ekranı, menü ve sahne
// tamamen hazır olana kadar ekranda kalır (otomatik kapanmaz); sonra kısa bir geçişle doğrudan menü görünür.
// Aradaki çıplak arka plan karesi ve ikinci mavi ekran böylece görünmez.
SplashScreen.preventAutoHideAsync().catch(() => {});
try { SplashScreen.setOptions({ fade: true, duration: 250 }); } catch {}
let openingHidden = false;
function hideOpening() {
  if (openingHidden) return;
  openingHidden = true;
  SplashScreen.hideAsync().catch(() => {});
}
setTimeout(hideOpening, 6000); // güvenlik: bir şey takılırsa açılış ekranında kalmasın
const MENU_ON = true; // açılış menüsü
import { KURUKAFA_ON, SKULL_SOURCE, SKULL_SIZE, SKULL_HIT_R, skullTouches, skullAfter, skullLift, skullPoint, scaledPlatforms, rollSkullEffect } from "../src/game/kurukafa";
import { referencePlatform, referenceTowerWidth } from "../src/game/reference-course";
import { generateProceduralPlatform, mulberry32Step, classifyPlatformVisualType, ROOFTOP_GROUND_Y, type PlatformVisualType } from "../src/game/procedural-course";
import { FIXED_PANEL_PLATFORMS, PANEL_SOURCES, PANEL_WORLD_WIDTH, PANEL_WORLD_HEIGHT, PANEL_FILL_STRIP_HEIGHT, PANEL_TOP_EDGE_SOURCES, PANEL_BOTTOM_EDGE_SOURCES, PANEL_SEAM_OVERLAP } from "../src/game/panel-course";
import { CONFIG, DEBUG_MODE, EXPERIMENTAL_COURSE, PHASE, REFERENCE_TRIAL } from "@/src/game/config";
import { makeStyles, useTheme } from "@/src/theme";
import { storage } from "@/src/utils/storage";
import * as GameCenter from "../modules/byzantion-gamecenter/src";

// Game Center: Apple hesabıyla otomatik giriş + serbest oyun rekoru için
// arkadaş sıralaması. Kimlik App Store Connect'teki skor tablosuyla aynı olmalı.
const GAME_CENTER_ON = true;
const LEADERBOARD_ID = "byzantion.rekor";

// Small shared texture travels with the JS bundle, avoiding a separate Metro image request.
const BRICK_SOURCE = require("@/assets/environment/brick-inline.json");

// GORSEL-014/OYUN_AKISI-001/002 (2026-09-22): real, artist-made rooftop-
// chimney pieces (magenta #FF00FF chroma-keyed to true alpha -- see
// outputs/gorsel-014-rooftop-platforms/rooftop-measured.json for the
// extraction method and per-asset numbers; edge_leak was 0 for all three,
// verified against a solid-colour test background, not just the source
// alpha channel). Each is a BOUNDED roof+chimney chunk (short/medium/long),
// not a long shaft -- no per-platform tiling/repeat, no procedural art, no
// separate "floating chimney" overlay disconnected from a roof base. Picked
// per platform from `p.cat` (0=wide,1=medium,2=narrow -- an EXISTING,
// already-generated field, not a new hash). Platform geometry
// now lives in procedural-course.ts, the SAME table `rootedTopY` uses to
// derive the platform's physical Y (see OYUN_AKISI-002 below) -- imported,
// not duplicated, so the visual cap and the physical landing surface can
// never drift apart.
// GORSEL-020 RooftopDistrict: ONE decorative, world-anchored, horizontally
// repeating (mirror-tiled, seamless) low-rooftop strip. Drawn in the world
// container (camera transform 1:1 with platforms, no parallax) AFTER the
// platform sprites, so each chimney's own roof/brick base is hidden inside
// the district and only the shaft + cap rise out of it. DISTRICT_TOP_Y is
// below every possible landing cap (rootedTopY max ~80.6) so no landing
// surface is ever covered. Never read by physics/collision/camera.
// REVIZYON-030: graded (cooler, slightly desaturated/darker) copies of the same
// district art so the warm chimney bodies separate from the roof behind them by
// colour/value. TOP = top rows feathered to alpha 0 (soft blend into the
// master's own painted roofs, no hard band); BODY = same grade, no feather,
// used vertically flipped below the TOP tile to extend the roof downward.
const DISTRICT_SOURCE = require("@/assets/environment/district/rooftop-district-v2.png");
const DISTRICT_BODY_SOURCE = require("@/assets/environment/district/rooftop-district-v2-body.png");
const DISTRICT_IMG_W = 826;
const DISTRICT_IMG_H = 252;
const DISTRICT_SCALE = 1.9; // world units per source px
const DISTRICT_TILE_W = DISTRICT_IMG_W * DISTRICT_SCALE;
const DISTRICT_TILE_H = DISTRICT_IMG_H * DISTRICT_SCALE;
// REVIZYON-028: the roofline is a WORLD-space row (Y=92) again, exactly like the
// platforms: both live under the same worldStyle camera transform, so the
// visible cap/roof and the physical topY can never drift apart vertically.
// (REVIZYON-027 pinned it to a screen row that followed camY -> it stayed still
// while the platform layer slid.) It draws BEHIND the platform sprites so caps
// lower than the roofline (random topY up to +320) stay visible.
const DISTRICT_TOP_Y = 92;
// REVIZYON-054: the fixed district is the BACK row of the same neighbourhood
// (same art, same material) -- slightly smaller and slower in X so it reads
// one row behind the playable houses instead of a second roofline at their
// depth. Y stays world-locked (the far master layer is anchored to it).
// REVIZYON-056 A/B switch: true = R055 look (repeating back rooftop row +
// its extension/haze layers); false = only the far Istanbul skyline, sea, sky
// and the playable houses.
const SHOW_BACK_DISTRICT = false as boolean;
const BACK_DISTRICT_SCALE = 0.78;
const BACK_DISTRICT_PARALLAX = 0.8; // fraction of camera X motion it follows
const BACK_TILE_W = DISTRICT_TILE_W * BACK_DISTRICT_SCALE;
const BACK_TILE_H = DISTRICT_TILE_H * BACK_DISTRICT_SCALE;
// Source rows 0..48 of the district fade to alpha 0; haze only the opaque part.
const BACK_HAZE_TOP = 48 * DISTRICT_SCALE * BACK_DISTRICT_SCALE;

// REVIZYON-054: every playable platform is a house built from the district
// art's OWN pixels at the district's OWN scale (1 source px = DISTRICT_SCALE
// world units, never stretched): roof tiles, the district's hip slope, its
// gutter, its plaster and real window/balcony/laundry slices
// (assets/environment/district/house/*, generated from rooftop-district-v2.png
// -- see AI_REVIEW.md REVIZYON-054). The landing ridge is the existing cap at
// exactly p.x/p.topY/p.width; hips fall away from it, the house widens to the
// neighbour gaps (always leaving an alley) and its facade runs off-screen.
// GORSEL-018 trial (user approved the style direction 2026-11-10; NOT final
// acceptance): Kıvılcım's first two samples -- a sharper, more saturated
// cream/ochre facade (350x1340 after a 60 px vertical crossfade so it tiles)
// and a glare-free roof strip cropped to exactly 6 tile periods (6 x 195 px)
// so it repeats without a seam. false = the original district assets.
const GORSEL018_TRIAL = true as boolean;
// GÖRÜNÜM REV (2026-11-12, kullanıcı: "Üçünü de yap"; Çizgi film yöneticisi
// değerlendirmesinin yeni maddeleri): ön planı arka plandan ayırmak için
// (1) arka plan biraz soluk, (2) iniş çatısı daha canlı + mahya vurgusu, merkez
// şeridi (puanı 0 olduğu için anlamsız beyaz çizgi) gizli, (3) ekran altında
// yumuşak geçiş. Hepsi kodla/var olan görselin işlenmesiyle; siluet aynı.
const GORUNUM_REV = true as boolean;
const HOUSE_ROOF_SOURCE = GORSEL018_TRIAL
  ? (GORUNUM_REV ? require("@/assets/environment/district/house/g018/roof-tiles-g018-canli.png") : require("@/assets/environment/district/house/g018/roof-tiles-g018.png"))
  : require("@/assets/environment/district/house/house-roof-tiles.png");
const HOUSE_GUTTER_SOURCE = require("@/assets/environment/district/house/house-gutter.png");
// GORSEL-018 (2026-11-10): 12 facade variants (4 plaster colours x 3 modules)
// in ONE horizontal atlas (350 px cells, 1340 px tall), so a recycled house slot
// switches variant with a layout offset only -- no React re-render, no new decode.
const FACADE_ATLAS = GORSEL018_TRIAL;
const HOUSE_FACADE_SOURCE = FACADE_ATLAS
  ? require("@/assets/environment/district/house/g018/facade-atlas-g018-24.jpg")
  : GORSEL018_TRIAL
    ? require("@/assets/environment/district/house/g018/facade-g018-cream.png")
    : require("@/assets/environment/district/house/house-facade-column.png");
// KAR CEPHE (2026-11-24, kullanıcı: "karlı bölümde kolonlarımız üzerinde hiç kar yok ... balkonlardaki çiçekler
// vb şeylerde karlı olsun", "kışın çiçekler açmaz solar yaprak döker"): kar yağan günde aynı atlasın kış hâli
// (yapraksız dallar, kuru saplar, kar). Pencere/panjur/kilim pikselleri ve 1035 tekrarı birebir aynı; ölçüler değişmez.
const KAR_CEPHE_ON = FACADE_ATLAS && (true as boolean);
const HOUSE_FACADE_KAR_SOURCE = require("@/assets/environment/district/house/g018/facade-atlas-g018-kar-24.jpg");
// MEVSIM-MAHALLE (2026-11-24): yağmurda çamaşır içeride (4 çamaşırlı hücrede ip boş; geri kalan piksel orijinal).
// Kar atlası da çamaşırsız sürümle güncellendi.
const HOUSE_FACADE_YAGMUR_SOURCE = require("@/assets/environment/district/house/g018/facade-atlas-g018-yagmur-24.jpg");
// MEVSIM-CEPHE (2026-11-24, kullanıcı: "Kabul" -> "1+2+3, önce mevsimi bağla"): kar yağmayan kış (yapraksız, kuru
// saplar, çamaşır yok) ve sonbahar (sarı-turuncu yaprak, solgun çiçek). Geometri birebir aynı.
const HOUSE_FACADE_KIS_SOURCE = require("@/assets/environment/district/house/g018/facade-atlas-g018-kis-24.jpg");
const HOUSE_FACADE_SONBAHAR_SOURCE = require("@/assets/environment/district/house/g018/facade-atlas-g018-sonbahar-24.jpg");
type CepheHal = "kar" | "yagmur" | "kis" | "sonbahar" | null;
function cepheKaynak(h: CepheHal) {
  if (!KAR_CEPHE_ON) return HOUSE_FACADE_SOURCE;
  return h === "kar" ? HOUSE_FACADE_KAR_SOURCE : h === "yagmur" ? HOUSE_FACADE_YAGMUR_SOURCE : h === "kis" ? HOUSE_FACADE_KIS_SOURCE : h === "sonbahar" ? HOUSE_FACADE_SONBAHAR_SOURCE : HOUSE_FACADE_SOURCE;
}
// CEPHE ÇEŞİDİ (2026-11-24, kullanıcı: "12 cepheye biraz daha varyasyon ekleyelim" -> "1+2+3"): 24 hücre;
// 12-23 kat karışımı + panjur rengi + kilim deseni (scripts/cephe-cesit.py, cephe-kilim.py). Tablolar cepheCesit.ts'de.
const FACADE_CELLS = FACADE_ATLAS ? CEPHE_HUCRE : 1;
// GORSEL-018 sartname 5: darker 3-unit outline + right-face shadow strip on the
// playable towers, and a warm glow on the target tower's cap while charging.
const KONTUR_PARILTI = true as boolean;
// 2026-11-11 user: glow only on the NEXT tower is meaningless for 2+ tower
// jumps; removed (a charge-predicted glow would be an aim assist). Kept off.
const HEDEF_PARILTI = false as boolean;
const HOUSE_EDGE_W = KONTUR_PARILTI ? 3 : 1.8;
const HOUSE_EDGE_COLOR = KONTUR_PARILTI ? "#2a1b12" : "#3a281c";
const HOUSE_SHADE_A = KONTUR_PARILTI ? 0.4 : 0.3;
const GLOW_W = 200;
const GLOW_H = 38;
// order: cream, light-pink, ochre, gray-blue x (window, balcony, kilim/laundry/cumba)
const FACADE_PERIOD_PX = CEPHE_DONEM_PX;
// calm wall rows per variant (cell px) -- the gutter never cuts through a window
const FACADE_STARTS_PX = CEPHE_BASLANGIC_PX;
const HOUSE_K = DISTRICT_SCALE;
const HOUSE_ROOF_W = 486 * HOUSE_K;
const HOUSE_ROOF_H = 47 * HOUSE_K;
const HOUSE_ROOF_TEX_PERIOD = GORSEL018_TRIAL ? (HOUSE_ROOF_W * 195) / 1170 : 86 * HOUSE_K;
const HOUSE_HIP_W = 40 * HOUSE_K;
const HOUSE_HIP_SLOPE = 47 / 40; // the district's own hip: 47 px drop over 40 px run
// The front roof face is ONE continuous tile image cut along both hip lines by
// two rotated clip boxes (fixed angle = the district's hip angle), so the
// tiles never restart at the landing edges.
const HOUSE_HIP_ANGLE = Math.atan(40 / 47);
const HOUSE_HIP_DEG = `${(HOUSE_HIP_ANGLE * 180) / Math.PI}deg`;
const HOUSE_HIP_NEG_DEG = `${(-HOUSE_HIP_ANGLE * 180) / Math.PI}deg`;
const HOUSE_SIN = Math.sin(HOUSE_HIP_ANGLE);
const HOUSE_COS = Math.cos(HOUSE_HIP_ANGLE);
const HOUSE_CLIP_L = 600; // distance of each clip box corner from its hip apex
const HOUSE_CLIP_S = 1200; // clip box side (covers any roof face)
const HOUSE_GUTTER_W = 584 * HOUSE_K;
const HOUSE_GUTTER_H = 16 * HOUSE_K;
const HOUSE_GUTTER_OVERLAP = 6;
// PENCERE BOYU (2026-11-22, kullanıcı: "diğer pencereler teyzenin cumbasıyla aynı ya da biraz küçük olsun"):
// yalnız görsel; cephe atlası bu katsayıyla büyütülür (kule, çatı, iniş çizgisi değişmez).
const PENCERE_BUYUK = 1.4 as number;
const HOUSE_COL_W = 140 * HOUSE_K * PENCERE_BUYUK;
const HOUSE_PERIOD = GORSEL018_TRIAL ? (HOUSE_COL_W * 1340) / 350 : 560 * HOUSE_K;
// Facade phase always starts at a floor boundary of the column asset.
const FACADE_PERIODS = FACADE_PERIOD_PX.map((v) => (v * HOUSE_COL_W) / 350);
const FACADE_STARTS = FACADE_STARTS_PX.map((row) => row.map((v) => (v * HOUSE_COL_W) / 350));
const HOUSE_FLOOR_STARTS = GORSEL018_TRIAL
  ? [0, 393, 725, 1018].map((v) => (v * HOUSE_COL_W) / 350) // calm wall rows of the g018 facade
  : [0, 163, 309, 407].map((v) => v * HOUSE_K);
const HOUSE_ALLEY = 30;
const HOUSE_R_MIN = 38;
// Deep enough to stay below the screen even while the dead-fall camera sinks.
const HOUSE_FACADE_H = 2200;
const HOUSE_DEFAULT_GAP = 220;

// Deterministic 0..1 from the platform's stable id; never reads the course RNG.
function houseHash(id: number, salt: number) {
  "worklet";
  const h = Math.imul((id * 31 + salt) ^ 0x27d4eb2d, 0x165667b1) >>> 0;
  return h / 4294967296;
}
// Hip run (world units) from the gaps to the neighbouring platforms.
function houseRun(p: any, left: any, right: any) {
  "worklet";
  const gl = left ? p.x - (left.x + left.width) : HOUSE_DEFAULT_GAP;
  const gr = right ? right.x - (p.x + p.width) : HOUSE_DEFAULT_GAP;
  return Math.max(HOUSE_R_MIN, Math.min(HOUSE_HIP_W, Math.min(gl, gr) / 2 - HOUSE_ALLEY / 2));
}

// POPUP-001: developer switch for the scene art only. "istanbul" renders the
// REVIZYON-054 tree unchanged; "popup" renders the Silgi Kacisi pop-up book
// page. Physics, course, camera and HUD are shared and untouched by this.
// REVIZYON-064 device diagnostics (both MUST stay false in normal play).
// PERF_PROBE: small on-screen counter of UI-thread frame intervals (from the
// game's own frame callback) and JS-thread rAF gaps, split by phase and by
// "a platform-list change happened this/previous frame".
// HOUSE_AB_FROZEN: one-variable A/B for the R062 hypothesis -- houses read a
// SharedValue that is set once per life (R061 behaviour: houses do NOT follow
// spawn/cleanup, visuals are wrong on purpose). Only for a timed comparison.
const PERF_PROBE = false as boolean;
// REVIZYON-067 one-variable device A/B: A = PERF_PROBE true (R066 overlay,
// 500 ms setTxt + JS rAF loop + UI-thread counters), B = PERF_PROBE false.
// B shows only this static tag (rendered once, never updated) so the phone's
// bundle can be identified. Empty string = no tag (final game).
// REVIZYON-068 diagnostic (R067-B otherwise unchanged): in the existing frame
// callback, airborne frame intervals are bucketed (<=12 / 12-20 / 20-25 / >25 ms)
// and the "held one frame, then a big jump" pattern is caught from the render
// camera's and the character's own per-frame screen steps. UI thread writes a
// few SharedValues only; JS reads them once, when Game Over appears.
const FRAME_DIAG = true as boolean;
// FAZ1 (2026-11-11, ANALIZ-2026-11-11): Turkish HUD/hint/result card, quip
// pool, big "+N" with a shout; build tag only as faint text on the result
// card; R068 counters keep running but their text is no longer shown.
const FAZ1_UI = true as boolean;
const SHOW_DIAG_TEXT = !FAZ1_UI;
// FAZ2 (2026-11-11): landing feel + character size trial. All visual-only:
// physics, collision, camera and the landing point are untouched.
const FAZ2_SQUASH = true as boolean; // re-enable GORSEL-017 landing squash (pivot = feet)
const FAZ2_DUST = true as boolean; // roof-dust puff on every new-tower landing
const FAZ2_HALO = true as boolean; // thin warm-white outline around the character
const CHAR_SIZE_TRIAL = 1.4 as number; // sprite drawn 1.4x around the same foot pivot (1 = accepted size)
// GAZ trial (2026-11-11, OSURUK-2026-11-11): fart sound on take-off sized by
// the charge + a short-lived cream puff trail behind the hips; both cut on
// landing ("pof"). Visual/audio only. 6 pooled puffs, transform+opacity only.
// 2026-11-11 KARAR (kullanıcı): "Her zıplamada kalsın" -- always on, no mode/unlock.
const FART_TRIAL = true as boolean;
const FART_N = 6;
const FART_SLOTS = [0, 1, 2, 3, 4, 5];
const FART_LIFE = 800; // ms
// v2 (user: "osuruk gibi olmamış"): classic cartoon gas cloud -- pale
// yellow-green lobes with an olive rim and shadow, big enough to read
// against the sea (box = ~45% of the character height). Fractions of FART_BOX.
const FART_LOBES = [
  { x: 0.1, y: 0.42, d: 0.56, c: "rgba(146,156,74,0.75)", b: 0 }, // olive under-shadow
  { x: 0.0, y: 0.26, d: 0.52, c: "rgba(214,222,150,0.97)", b: 1 },
  { x: 0.3, y: 0.04, d: 0.62, c: "rgba(224,230,166,0.97)", b: 1 },
  { x: 0.48, y: 0.32, d: 0.5, c: "rgba(206,214,138,0.97)", b: 1 },
  { x: 0.22, y: 0.3, d: 0.36, c: "rgba(236,240,190,0.9)", b: 0 }, // highlight
];
// KARLI ÇATI: iniş tozu beyaz kar pufu olur (biraz daha iri).
const DUST_SNOW_BASE = [
  { a: 195, r: 30, d: 17 }, { a: 228, r: 22, d: 14 }, { a: 255, r: 15, d: 12 },
  { a: 285, r: 15, d: 12 }, { a: 312, r: 22, d: 14 }, { a: 345, r: 30, d: 17 },
];
const DUST_SNOW = DUST_SNOW_BASE.map((q, i) => ({ ...q, c: i % 2 ? "rgba(236,243,252,0.95)" : "rgba(255,255,255,0.97)" }));
const DUST_PUFFS = [
  { a: 200, r: 26, d: 13, c: "rgba(236,220,194,0.95)" },
  { a: 230, r: 20, d: 11, c: "rgba(198,112,72,0.9)" },
  { a: 255, r: 14, d: 9, c: "rgba(236,220,194,0.9)" },
  { a: 285, r: 14, d: 9, c: "rgba(236,220,194,0.9)" },
  { a: 310, r: 20, d: 11, c: "rgba(198,112,72,0.9)" },
  { a: 340, r: 26, d: 13, c: "rgba(236,220,194,0.95)" },
];
const KILIM_DOTS = ["#c0472b", "#e2a33a", "#3e7a52", "#c0472b", "#e2a33a", "#3e7a52", "#c0472b", "#e2a33a", "#3e7a52"];
// REVIZYON-069 one-variable device A/B (measurement only, NOT a design): true
// turns off ONLY the two rotated overflow clips of each roof face (houseRoofClipL/R),
// so the roof face is cut by the outer band rectangle instead -- the hip corners
// look wrong on purpose. false = R068 (masks on). Everything else is unchanged.
const HOUSE_ROOF_MASK_DIAG = false as boolean;
const ROOF_MASK_OFF = HOUSE_ROOF_MASK_DIAG ? { overflow: "visible" as const } : null;
// REVIZYON-071-A one-variable device A/B (render cost): true removes ONLY the
// overflow clip of the two rounded-corner per-platform boxes -- the
// transparent tall `tower` box and the thin `playableChimneyCap` rim. Their
// corner radius stays; nothing they contain reaches outside the rounded
// shape, so the picture should not change. A rounded-corner clip with
// children forces a Core Animation offscreen pass per box per frame
// (Instruments B0: 17-86 offscreen passes/frame, render p90 11.3 ms).
// Roof clips (houseRoofClipL/R) are NOT touched. false = R068 layout.
const ROUNDED_CLIP_OFF = true as boolean;
const NO_CLIP = ROUNDED_CLIP_OFF ? { overflow: "visible" as const } : null;
// REVIZYON-072/075: the live-scene far background uses the game's NoClipImage
// (React Native Image + overflow "visible") instead of expo-image. expo-image's
// ImageView always clips, and under Fabric a clipping image wrapper gets a
// CAShapeLayer mask -> one full-screen offscreen pass per frame (Xcode "Color
// Offscreen-Rendered", R071-E/R074; see src/game/NoClipImage.tsx).
// Same source, resizeMode "stretch" == contentFit "fill". false = expo-image.
const LIVE_RN_IMAGE = true as boolean;
const AnimatedImage = Animated.createAnimatedComponent(Image);
// REVIZYON-077 (one variable, feel test -- KAMERA-HIS-001): in Spring Ninja the
// ground moves with the columns and the clouds at about half speed, so the
// whole world travels; here the far sea+skyline moved only ~8% of the house
// speed and stopped at the image edge (overscan clamp), so the houses looked
// like they slid in front of a still painting. true = the far image group is
// repeated as mirrored tiles (the art is not seamless; seams are a known test
// artifact) and scrolls without a clamp at BG_SCROLL_RATIO of the world speed.
// Y stays world-locked exactly as before. false = REVIZYON-030 clamped layer.
const BG_SCROLL_TEST = true as boolean;
const BG_SCROLL_RATIO = 0.45;
const BG_SCROLL_TILES = 4;
const BUILD_TAG = PERF_PROBE ? "" : HOUSE_ROOF_MASK_DIAG ? "R069-B: MASKE KAPALI (cati koseleri GECICI bozuk, olcum)" : GORUNUM_REV ? (TEST_START_TOWER > 0 ? `DENEME (${TEST_START_TOWER}. KULEDEN)` : PIJAMA_TEST_EARLY ? "PIJAMA DENEME (15. KULE)" : "KAR FILTRE") : DAILY_MAP ? "DURAK v2 + GUNUN HARITASI v1" : DURAK_SEFER ? "DURAK SEFERI v2 (15 KULE)" : FAZ2_IFADE ? "FAZ2 IFADE + HALE + GAZ" : FAZ2_HALO ? "FAZ2 HALE + GAZ" : FART_TRIAL ? "GAZ DENEME v3 GERCEK SES + FAZ2" : FAZ2_DUST || FAZ2_SQUASH || CHAR_SIZE_TRIAL !== 1 ? `FAZ2 ${SFX_ON ? "SES + " : ""}TOZ+ESNEME, KARAKTER x${CHAR_SIZE_TRIAL}` : FAZ1_UI ? "FAZ1 TR ARAYUZ + G018 KONTUR" : KONTUR_PARILTI ? (HEDEF_PARILTI ? "G018 KONTUR + PARILTI" : "G018 KONTUR") : FACADE_ATLAS ? "G018 12 CEPHE + R077" : GORSEL018_TRIAL ? "G018 DENEME + R077" : BG_SCROLL_TEST ? "R077: ARKA PLAN KAYAR" : NO_IMAGE_CLIP ? "R076: GORSEL KIRPMA YOK + SYNC PROPS" : ROUNDED_CLIP_OFF ? "R071-A: KOSE KIRPMA YOK" : FRAME_DIAG ? "R068-DIAG" : "R067-B: SAYAC KAPALI";
const DIAG_MAX_EXAMPLES = 6;
const HOUSE_AB_FROZEN = false as boolean;
// REVIZYON-066 experiment (one variable): expo-linear-gradient's iOS layer
// re-renders its whole bitmap on the CPU (UIGraphicsBeginImageContext at screen
// scale, needsDisplayOnBoundsChange) every time its bounds change. The two
// 2200-pt facade gradients sized 18%/28% of the house were re-drawn on every
// house appear/resize. true = the three facade gradients keep a fixed small
// box and get the house width as a scaleX transform (a horizontal stretch of a
// linear gradient looks the same), so their layers never change bounds.
// false = the R065 percentage-width layout.
const HOUSE_GRAD_FIXED = true as boolean;
const HOUSE_GRAD_W = 16;
const VISUAL_MODE = "istanbul" as "popup" | "istanbul";
const POPUP = VISUAL_MODE === "popup";
// Pop-up assets are drawn at 2 px per world unit (assets/popup/*, generated by
// code -- see AI_REVIEW.md POPUP-001), sky/back page at 1 px per world unit.
const PU_ROOF_MID_SOURCE = require("@/assets/popup/popup-roof-mid.png");
const PU_ROOF_HIP_L_SOURCE = require("@/assets/popup/popup-roof-hip-L.png");
const PU_ROOF_HIP_R_SOURCE = require("@/assets/popup/popup-roof-hip-R.png");
const PU_WALL_SOURCE = require("@/assets/popup/popup-wall.png");
const PU_SUN_SOURCE = require("@/assets/popup/popup-sun.png");
// POPUP-002: approved paper-sky backdrop, used as ONE screen-fixed matte (never
// tiled -> no repeated landmarks/clone seams); its embedded clouds/birds were
// removed so the moving clouds below (cut from the same art) and AmbientBirds
// are the only ones. Top 120 rows are a mirrored sky pad for camera lift.
const PU_BACKDROP_SOURCE = require("@/assets/popup/popup2-backdrop-full.jpg");
const PU_BACKDROP_W = 850;
const PU_BACKDROP_H = 1620;
const PU_BACKDROP_PAD = 120;
const PU_BACKDROP_YPAR = 0.10;
const PU_BACKDROP_YMAX = 56;
const PU_SKY_TOP = "#0075b7";
const PU_PAPER = "#f2d2a9";
const PU_CLOUD_A_SOURCE = require("@/assets/popup/popup2-cloud-a.png");
const PU_CLOUD_B_SOURCE = require("@/assets/popup/popup2-cloud-b.png");
const PU_CLOUD_C_SOURCE = require("@/assets/popup/popup2-cloud-c.png");
const PU_ERASER_SOURCE = require("@/assets/popup/popup-eraser.png");
const PU_ERASED_SOURCE = require("@/assets/popup/popup-erased-strip.png");
const PU_ROOF_H = 40;
const PU_HIP = 22;
const PU_ROOF_TILE_W = 240; // popup-roof-mid.png width / 2
const PU_ROOF_TILE_PERIOD = 20;
const PU_WALL_INSET = 7;
const PU_WALL_TEX_W = 140;
const PU_WALL_TEX_H = 300; // two floors; repeats vertically
const PU_SIDE = 14; // folded card side face
const PU_SHADOW_X = 18;
// The open book's page floor every house is glued to (below every possible
// cap: platformMaxTopY 320). Houses end in paper tabs on it.
const PAGE_FLOOR_Y = 640;
const PU_HOUSE_H = PAGE_FLOOR_Y + 330; // container height from the highest cap
const PU_ERASED_W = 84; // screen px; drawn BEHIND the world layer
// The master's sea->painted-roof row (1298) is world-locked just above the
// district roofline, so sea, its own roofs and the district move as ONE scene.
const BG_SEA_END_ROW = 1298;
const BG_SEA_END_WORLD_Y = DISTRICT_TOP_Y - 10;
const BG_SKY_TOP_COLOR = "#3EB8F2"; // measured top rows of the master (62,184,242)

// GORSEL-016 / OYUN_AKISI-003 (2026-09-23, user-authorized): new approved
// master scene, replacing the GORSEL-014/015 istanbul-parallax-portrait-v1
// source entirely for this task ("eski arka planı bu turda kullanma"). Same
// pipeline shape as before (FAR = whole image cover-fit, slow parallax; a
// world-anchored near/ground layer below) but the source is now
// bosphorus-rooftop-day-master-v1.png (941x1672, same dimensions as the old
// master by coincidence, not by design) -- day scene, Bosphorus + Hagia
// Sophia/Galata skyline up top, a real painted foreground rooftop band
// (terracotta roofs, chimneys, a cat, laundry line) at the bottom, measured
// via row-average RGB: sea (blue, B>R) transitions to warm rooftop tones
// (R>B) starting row ~1298, fully warm by row ~1320.
const MASTER_NEIGHBORHOOD_SOURCE = require("@/assets/environment/bosphorus-rooftop-day-master-v1.png");
// REVIZYON-056: hazed continuation of the master's bottom roof band (941x748).
const BG_LOW_SIL_SOURCE = require("@/assets/environment/bosphorus-low-silhouette.jpg");
// MEVSİM ARKA PLANI (2026-11-17, kullanıcı: "arka planlar eskisi gibi duruyor, sadece kolonlarda mevsimsel hareket
// yapıyoruz; tutarlılığa aykırı"). Onaylı arka plandan renk işlemiyle türetildi (scripts/mevsim-arkaplan.py, yeni çizim
// yok); asıl görselin üstüne aynı yerleşimle, yumuşak geçişle biner. Kar yağarken "kar", değilse mevsim.
const BG_VARIANTS = {
  kar: { m: require("@/assets/environment/mevsim/master-kar.jpg"), a: require("@/assets/environment/mevsim/alt-kar.jpg") },
  sonbahar: { m: require("@/assets/environment/mevsim/master-sonbahar.jpg"), a: require("@/assets/environment/mevsim/alt-sonbahar.jpg") },
  kis: { m: require("@/assets/environment/mevsim/master-kis.jpg"), a: require("@/assets/environment/mevsim/alt-kis.jpg") },
  // TUTARLILIK (2026-11-24): yağmurda çatıdaki kilim, üstündeki kedi ve çamaşırlar yok (Kıvılcım temiz arka plan).
  // MEVSIM-SILUET (2026-11-25, "Evet, 4 çizim" -> "Kabul, bağla"): kar/kış/sonbahar/yağmur master'ları Kıvılcım
  // çizimi (eskisi kodla renk kaydırma); siluet bandı kaynakla piksel hizalı (faz korelasyonu, ±1 px düzeltildi).
  yagmur: { m: require("@/assets/environment/mevsim/master-yagmur.jpg"), a: require("@/assets/environment/mevsim/alt-temiz.jpg") },
} as const;
const BG_LOW_SIL_H = 748;
// REVIZYON-023: start decoding every first-scene bitmap at module load (before
// the component mounts) into expo-image's memory cache, so the live scene and
// the start cover mount from cache instead of decoding on first render.
const PRELOAD_MODULES: number[] = [
  MASTER_NEIGHBORHOOD_SOURCE, DISTRICT_SOURCE, DISTRICT_BODY_SOURCE, HOUSE_ROOF_SOURCE, HOUSE_GUTTER_SOURCE, HOUSE_FACADE_SOURCE, BG_LOW_SIL_SOURCE,
  PU_ROOF_MID_SOURCE, PU_ROOF_HIP_L_SOURCE, PU_ROOF_HIP_R_SOURCE, PU_WALL_SOURCE, PU_BACKDROP_SOURCE, PU_SUN_SOURCE, PU_CLOUD_A_SOURCE, PU_CLOUD_B_SOURCE, PU_CLOUD_C_SOURCE, PU_ERASER_SOURCE, PU_ERASED_SOURCE,
  ...CHARGE_POSES.map((p) => p.source),
  ...(PIJAMA_ON ? [HAT_SOURCE, SLIPPER_SOURCE, DOOR_CLOSED_SOURCE, DOOR_OPEN_SOURCE] : []),
  ...(KIS_ON ? [WINTER_HAT_SOURCE, WINTER_SCARF_SOURCE] : []),
  ...(KURUKAFA_ON ? [SKULL_SOURCE] : []),
];
(async () => {
  try {
    const assets = await Asset.loadAsync(PRELOAD_MODULES);
    const uris = assets.map((a) => a.localUri ?? a.uri).filter(Boolean) as string[];
    await CachedImage.prefetch(uris, { cachePolicy: "memory-disk" });
  } catch {}
})();

const BG_IMG_W = 941;
const BG_IMG_H = 1672;
const BG_FAR_OVERSCAN = 1.19; // REVIZYON-030: was 1.4 (bg is now Y-world-locked; smaller scale keeps the skyline off the HUD)
const BG_FAR_PARALLAX_RATIO = 0.06;

// GORSEL-015 iPhone-reddi fix (2026-09-22), "GERÇEK ÇATI TABANI": every
// rooftop-chimney asset is rooted so its OWN rendered bottom edge sits at
// EXACTLY world Y = ROOFTOP_GROUND_Y (150), regardless of cat/width -- see
// rootedTopY's derivation in procedural-course.ts (topY = GROUND_Y -
// heightAboveGround, and the rendered image's bottom = topY +
// heightAboveGround = GROUND_Y, algebraically, for every asset). A ground
// band, placed as a CHILD of the world container (styles.world) so it rides
// the exact same camera transform as every platform, sized so its top edge
// sits comfortably above ROOFTOP_GROUND_Y (guaranteeing full overlap with
// every asset's base by construction, not by visual luck) and tall enough
// that even the highest camera pull-up (standing on a "long" tower) still
// keeps its top edge at or above 35% of screen height. This is a solid-color
// SAFETY layer (always covers the full camera range, unlike the single
// hero-art near image below, which is finite width) -- kept from GORSEL-015.
const ROOFTOP_BAND_TOP_Y = ROOFTOP_GROUND_Y - 800; // world Y, well above every asset's base
const ROOFTOP_BAND_BOTTOM_Y = ROOFTOP_GROUND_Y + 3000; // far below any visible frame
const ROOFTOP_BAND_MARGIN_X = 400; // world units of horizontal slack each side

// GORSEL-016, "Her baca kolonunu bu ana görselin ALT çatı bandına göm": the
// REAL painted rooftop crop of the new master, drawn on TOP of the solid
// safety band above, also world-anchored (child of styles.world, same
// transform as platforms) so it never drifts from camY. NEAR_IMG_CROP_TOP
// (1290) is the measured source row where the sea ends and the foreground
// roof band begins (a little before the R>B crossover at ~1298, so the soft
// blend edge is included rather than a hard seam). NEAR_IMG_ANCHOR_WORLD_Y
// is where that source row is placed in world space: ROOFTOP_GROUND_Y - 40,
// i.e. 40 world units (~25 screen px at cameraZoom 0.62) ABOVE the common
// ground line, so every chimney base (always exactly at world Y=150) sinks
// visibly INTO the rendered crop, comfortably past the "en az 2 görünür px"
// floor, without the seam sitting right at a chimney's own base line.
const NEAR_IMG_CROP_TOP = 1290;
const NEAR_IMG_WORLD_SCALE = 0.6; // world units per source px
const NEAR_IMG_ANCHOR_WORLD_Y = ROOFTOP_GROUND_Y - 40;
const NEAR_IMG_RENDERED_W = BG_IMG_W * NEAR_IMG_WORLD_SCALE;
const NEAR_IMG_RENDERED_H = (BG_IMG_H - NEAR_IMG_CROP_TOP) * NEAR_IMG_WORLD_SCALE;
const NEAR_IMG_START_X = -300; // world X of the first tile's left edge (a bit before the start tower)
const NEAR_IMG_TILE_COUNT = 8; // covers the "first screen + first 10 jumps" scope of this task

// GORSEL-012 (2026-09-22): the GORSEL-004A chimney-top.png overlay and the
// GORSEL-011/011B column/roof-island overlays are retired (see PlatformView
// below and AI_REVIEW.md for the reasoning) -- their asset files are left
// on disk, unbundled, per this project's "don't delete without approval"
// convention, but nothing in this file requires them any more.

// Preserve historical scores separately because the scoring rules changed.
const SFX_MUTED_KEY = "carsamba.sfxMuted.v1";
// PATLAMA EŞİĞİ (2026-11-12, FARK raporu B; kullanıcı: "Evet, başla"):
// tam şarja ulaşınca OVER_WINDOW_MS'lik "son an" penceresi açılır. Pencerenin
// son SWEET_FROM kısmında bırakmak "Tam kıvam" (+OVER_BONUS puan). Pencereyi
// kaçırırsan amca dayanamaz: en yüksek güçle kendiliğinden fırlar, gaz büyük.
// Fizik değişmez: fırlatma hızı yine jumpVelocity(1); değişen yalnız zamanlama.
const OVERCHARGE = true as boolean;
const OVER_WINDOW_MS = 500;
const SWEET_FROM = 0.6;
const OVER_BONUS = 2;
// PATLAMA (2026-11-12, kullanıcı: "çok basınca adam patlasın, boka bulansın" -> seçim b:
// tur devam eder, çizgi film tarzı): pencere dolunca kahverengi "şlap" patlaması,
// amca o tur boyunca lekeli ve başında sinekler döner. Yeniden başlayınca temizlenir.
const SPLAT_ON = true as boolean;
const SPLAT_BLOBS = Array.from({ length: 14 }, (_, i) => {
  const h = (n: number) => ((Math.sin(i * 37.7 + n * 11.3) * 9187.31) % 1 + 1) % 1;
  return { a: (i / 14) * Math.PI * 2 + h(1) * 0.4, r: 26 + h(2) * 46, d: 9 + Math.round(h(3) * 14), c: i % 3 === 0 ? "#5a3a1e" : i % 3 === 1 ? "#7a4e2a" : "#8d6236" };
});
const FARTHEST_TOWER_KEY = "carsamba.farthestTower.v1";
// DURAK SEFERİ: gökyüzü tonu durak başına bir adım (sabah, öğle, ikindi, gün batımı, gece).
const SKY_STEPS = [0, 1, 2, 3, 4];
// Gece yıldızları: sabit yerleşim (gökyüzü bandı, üst %32).
const NIGHT_STARS = Array.from({ length: 18 }, (_, i) => {
  const h = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return { x: 3 + h(1) * 92, y: 4 + h(2) * 28, r: 2 + Math.round(h(3) * 2), o: 0.55 + h(4) * 0.45 };
});
const CONFETTI_COLORS = ["#c0472b", "#e2a33a", "#3e7a52", "#1f4e79", "#fff8ec", "#b5482c"];
const CONFETTI = Array.from({ length: 22 }, (_, i) => {
  const h = (n: number) => ((Math.sin(i * 91.17 + n * 23.71) * 9631.13) % 1 + 1) % 1;
  return { x: h(1), drift: (h(2) - 0.5) * 0.25, delay: h(3) * 0.35, size: 10 + Math.round(h(4) * 7), rot: (h(5) - 0.5) * 720, c: CONFETTI_COLORS[i % CONFETTI_COLORS.length] };
});
// 2026-11-12 video 13-15-13: ilk tonlar telefonda neredeyse fark edilmedi (gök mavisi ~%5 ısındı) -> güçlendirildi.
const SKY_TINTS = ["rgba(255,205,130,0)", "rgba(255,206,120,0.20)", "rgba(255,150,70,0.30)", "rgba(240,90,70,0.36)", "rgba(16,26,74,0.50)"];
// KAR-FILTRE (2026-11-25): kapalı karlı havada güneşin turuncu ikindi/gün batımı ışığı yok -> aynı kararma, soğuk gri ton.
const SKY_TINTS_KAR = ["rgba(200,210,225,0)", "rgba(196,206,222,0.08)", "rgba(150,160,184,0.16)", "rgba(110,112,148,0.26)", "rgba(16,26,74,0.50)"];
const BEST_SCORE_KEY = REFERENCE_TRIAL ? "jumpcharge.bestScore.reference.v1" : "jumpcharge.bestScore";
// EXPERIMENTAL_COURSE (see src/game/config.ts) swaps the fixed, measured
// REFERENCE_COURSE for the procedural generator below, independent of
// REFERENCE_TRIAL's physics constants. Only this one flag decides which
// tower source is used -- everywhere else in this file keep using
// REFERENCE_TRIAL for physics/scoring exactly as before.
const USE_REFERENCE_COURSE = REFERENCE_TRIAL && !EXPERIMENTAL_COURSE;
// GORSEL-017 / OYUN_AKISI-004 (2026-09-23, user-authorized): this delivery
// replaces procedural generation with a FIXED, hand-measured sequence baked
// into 4 approved panel paintings (see src/game/panel-course.ts) -- "önce
// iPhone kabulü olmadan 100 atlayış sistemi kurma" explicitly asked NOT to
// build the infinite/procedural version yet. The old procedural/reference
// course code paths are left in place (not deleted) behind this flag so a
// future task can flip back or extend without re-deriving them.
//
// GORSEL-017 ROLLBACK-01 (2026-09-23, user-authorized emergency revert): a
// real iPhone video after HOTFIX-01 showed the panel integration itself
// still broken on-device (long gray loading area at start, vertical
// color-crush stripes, falling into decor with no readable target, instant
// 0-score game over) -- worse than the pre-GORSEL-017 baseline. Flipped
// back to false so the DEFAULT flow is the last known-good behavior (the
// procedural/reference course + old rooftop-chimney rendering, from before
// GORSEL-017). Nothing panel-related was deleted (assets, panel-course.ts,
// the render branches in this file, the edge-strip assets) -- only this one
// flag, so a future task can pick the panel work back up once the on-device
// visual/collision architecture is redesigned, without re-deriving any of
// it. Do NOT flip this back to true without new on-device evidence.
const USE_FIXED_PANEL_COURSE = false;
const PW = CONFIG.playerWidth;
const PH = CONFIG.playerHeight;
// Render size is independent of the existing collision dimensions.
const CHARACTER_WIDTH = PW * 2.16;

// GORSEL-006: temporary single-pose main character (approved side-profile
// sprite, 1024x1024 RGBA, facing right) replacing the old layered character
// render. VISUAL ONLY: the sprite is placed relative to the existing physics
// point (px, py) and never feeds back into physics. Sprite measurements
// (from the PNG's alpha > 128): both feet span x=244..492 (249px, center
// x=368) and the lowest opaque row is y=922 (its bottom edge = 923).
// Scale from the physics side, read-only: the sprite's feet are drawn exactly
// as wide as the sole span landing detection already uses (CONFIG.footSoles
// over CHARACTER_WIDTH*0.8), so the visible feet match what can land.
// Uniform scale only (no stretch): world units per sprite pixel.
const SOLE_BODY_WIDTH = CHARACTER_WIDTH * 0.8;
const SOLE_LEFT = CONFIG.footSoles[0][0];
const SOLE_RIGHT = CONFIG.footSoles[1][1];
const SOLE_CENTER_OFFSET = ((SOLE_LEFT + SOLE_RIGHT) / 2 - 0.5) * SOLE_BODY_WIDTH;
const SPRITE_SCALE = ((SOLE_RIGHT - SOLE_LEFT) * SOLE_BODY_WIDTH) / POSE_FEET_SPAN_PX;
// GAZ trial: puffs leave from the hips, a little behind the body.
const FART_CHAR_H = CHARGE_POSES[0].h * SPRITE_SCALE * GLOBAL_VISUAL_SCALE * CHAR_SIZE_TRIAL;
// KALKIŞTA SİLKELENME: 8 kar tanesi, dünya biriminde (amca boyuna göre), ~0,8 sn yerçekimiyle düşer.
const SHED_FLAKES = Array.from({ length: 8 }, (_, i) => {
  const h = (n: number) => ((Math.sin(i * 31.7 + n * 17.3) * 7919.3) % 1 + 1) % 1;
  const H = CHARGE_POSES[0].h * SPRITE_SCALE * GLOBAL_VISUAL_SCALE * CHAR_SIZE_TRIAL;
  return { ox: (h(1) - 0.5) * H * 0.3, vx: (h(2) - 0.65) * H * 0.9, vy: -(0.15 + h(3) * 0.45) * H, d: H * (0.022 + h(4) * 0.02) };
});
// İÇ SES (2026-11-20): amcanın başının üstünde düşünce balonu; ekran uzayında (yazı kamera yakınlaştırmasıyla küçülmesin).
const THINK_HEAD_H = CHARGE_POSES[0].h * SPRITE_SCALE * GLOBAL_VISUAL_SCALE * CHAR_SIZE_TRIAL;
function ThoughtBubble({ text, px, py, camX, camY }: { text: string; px: SharedValue<number>; py: SharedValue<number>; camX: SharedValue<number>; camY: SharedValue<number> }) {
  const st = useAnimatedStyle(() => {
    const s = CONFIG.cameraZoom;
    const x = (px.value + SOLE_CENTER_OFFSET - camX.value) * s;
    const y = (py.value + PH / 2 - THINK_HEAD_H * 0.98 - camY.value) * s;
    return { transform: [{ translateX: x - 24 }, { translateY: y - 70 }] };
  });
  return (
    <Animated.View pointerEvents="none" entering={FadeIn.duration(180)} exiting={FadeOut.duration(250)} style={[{ position: "absolute", left: 0, top: 0, zIndex: 30 }, st]}>
      <View style={{ maxWidth: 210, backgroundColor: "rgba(255,252,244,0.97)", borderRadius: 18, borderWidth: 2, borderColor: "#5b3a24", paddingHorizontal: 12, paddingVertical: 7 }}>
        <Text style={{ color: "#3b2516", fontSize: 15, fontWeight: "700", fontStyle: "italic" }}>{text}</Text>
      </View>
      <View style={{ position: "absolute", left: 18, bottom: -12, width: 10, height: 10, borderRadius: 5, backgroundColor: "rgba(255,252,244,0.97)", borderWidth: 2, borderColor: "#5b3a24" }} />
      <View style={{ position: "absolute", left: 10, bottom: -22, width: 6, height: 6, borderRadius: 3, backgroundColor: "rgba(255,252,244,0.97)", borderWidth: 1.5, borderColor: "#5b3a24" }} />
    </Animated.View>
  );
}

// MAHALLE (2026-11-20): teyzenin/kedinin konuşma balonu; dünya noktası (wx, wy) ekrana çevrilir.
function SpeechBubble({ text, wx, wy, camX, camY, screenW }: { text: string; wx: number; wy: number; camX: SharedValue<number>; camY: SharedValue<number>; screenW: number }) {
  // Balon ekranın içinde kalır (video: kamera kayınca "…a geldi!" gibi yarım görünüyordu).
  const maxX = Math.max(8, screenW - 8 - Math.min(200, 24 + text.length * 8.6));
  const st = useAnimatedStyle(() => {
    const s = CONFIG.cameraZoom;
    const x = Math.min(maxX, Math.max(8, (wx - camX.value) * s - 20));
    return { transform: [{ translateX: x }, { translateY: (wy - camY.value) * s - 50 }] };
  });
  return (
    <Animated.View pointerEvents="none" entering={FadeIn.duration(160)} exiting={FadeOut.duration(250)} style={[{ position: "absolute", left: 0, top: 0, zIndex: 31 }, st]}>
      <View style={{ maxWidth: 200, backgroundColor: "#fffdf6", borderRadius: 14, borderWidth: 2, borderColor: "#7a3b1f", paddingHorizontal: 10, paddingVertical: 5 }}>
        <Text style={{ color: "#5a2a14", fontSize: 15, fontWeight: "900" }}>{text}</Text>
      </View>
      <View style={{ position: "absolute", left: 14, bottom: -7, width: 0, height: 0, borderLeftWidth: 7, borderRightWidth: 7, borderTopWidth: 9, borderLeftColor: "transparent", borderRightColor: "transparent", borderTopColor: "#7a3b1f" }} />
    </Animated.View>
  );
}

// HANIM ARIYOR (2026-11-20): oyun sonunda üstten kayan telefon bildirimi.
function HanimBanner({ text, top, onClose }: { text: string; top: number; onClose: () => void }) {
  return (
    <Animated.View entering={FadeInDown.duration(380)} exiting={FadeOut.duration(260)} style={{ position: "absolute", left: 10, right: 10, top, zIndex: 120, alignItems: "center" }}>
      <Pressable onPress={onClose} testID="hanim-banner" style={{ width: "100%", maxWidth: 420, backgroundColor: "rgba(246,244,240,0.97)", borderRadius: 22, paddingHorizontal: 14, paddingVertical: 11, flexDirection: "row", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.22, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}>
        <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "#34c759", alignItems: "center", justifyContent: "center", marginRight: 11 }}>
          <Text style={{ fontSize: 22 }}>📞</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#111" }}>Hanım ❤️</Text>
            <Text style={{ fontSize: 13, color: "#8a8a8e" }}>şimdi</Text>
          </View>
          <Text style={{ fontSize: 15, color: "#1c1c1e", marginTop: 1 }}>{text}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function ShedFlake({ f, shed, shedX, shedY, shedAmt }: { f: (typeof SHED_FLAKES)[number]; shed: SharedValue<number>; shedX: SharedValue<number>; shedY: SharedValue<number>; shedAmt: SharedValue<number> }) {
  const H = CHARGE_POSES[0].h * SPRITE_SCALE * GLOBAL_VISUAL_SCALE * CHAR_SIZE_TRIAL;
  const st = useAnimatedStyle(() => {
    const t = shed.value;
    const T = t * 0.8;
    return {
      opacity: t > 0 && t < 1 ? (1 - t) * Math.min(1, shedAmt.value * 2.2) : 0,
      transform: [{ translateX: shedX.value + f.ox + f.vx * T }, { translateY: shedY.value + f.vy * T + 2.2 * H * T * T }],
    };
  });
  return <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, width: f.d, height: f.d, borderRadius: f.d / 2,
    backgroundColor: "#ffffff", borderWidth: 1, borderColor: "rgba(110,135,170,0.6)" }, st]} />;
}
// PİJAMA ANI: çatı kapısı ayaktaki amcadan ~%30 uzun (dünya birimi).
const DOOR_H = FART_CHAR_H * DOOR_HEIGHT_RATIO;
// KURUKAFA: amcanın gövdesinin yarı genişliği (çizilen pozun ~%60'ı, kollar dahil).
const SKULL_BADGE_W = 280; // dünya birimi (kamera 0,4 -> ~110 nokta)
const SKULL_BADGE_H = 100;
const BUBBLE_W = 560;
// Saçak buz sarkıtları (kar): yüzde konum, uzunluk/genişlik dünya birimi; sabit yerleşim.
const ICICLES = Array.from({ length: 11 }, (_, i) => {
  const h = (n: number) => ((Math.sin(i * 19.19 + n * 7.7) * 4373.1) % 1 + 1) % 1;
  return { x: 3 + (i / 11) * 92 + h(1) * 4, h: 12 + Math.round(h(2) * 22), w: 4 + Math.round(h(3) * 3) };
}); // dünya birimi (kamera ~0,4)
const BUBBLE_H = 260;
const CHAR_BODY_HALF_W = (CHARGE_POSES[0].w * SPRITE_SCALE * GLOBAL_VISUAL_SCALE * CHAR_SIZE_TRIAL * 0.6) / 2;
const DOOR_W = DOOR_H * DOOR_ASPECT;
const FART_FEET_DX = SOLE_CENTER_OFFSET + ANCHOR_SHIFT_PX * SPRITE_SCALE;
// 2026-11-11 user: gas came out too high (chest level in ScreenRecording
// 15-04-35); the newest puff now sits on the seat of the tracksuit.
const FART_HIP = FART_CHAR_H * 0.27;
const FART_BACK = FART_CHAR_H * 0.11;
const FART_BOX = FART_CHAR_H * 0.45;
const POOL = 14; // fixed pool of platform views (only ~5 are visible at once)
const POOL_IDX = Array.from({ length: POOL }, (_, i) => i);
// REVIZYON-060: a pool slot shows the platform whose id % POOL equals the
// slot, NOT the platform at that array index. Array-index slots re-targeted
// every slot (all their layout props) whenever cleanup sliced the list -- a
// mid-flight UI-thread layout burst measured as the iPhone freezes. With id
// slots a cleanup changes no slot and a spawn changes exactly one. The live
// list never exceeds 10 platforms (sim, zoom 0.40), so ids never collide.
function slotPlatform(list: any[], slot: number) {
  "worklet";
  for (let i = 0; i < list.length; i++) {
    if (list[i].id % POOL === slot) return list[i];
  }
  return undefined;
}
// TASARIM 2026-11-16: emoji yerine tek renkli iOS simgeleri (el çizimi sanatla çatışmasın).
function Ico({ name, size = 22, color = "#6e4632" }: { name: string; size?: number; color?: string }) {
  return <SymbolView name={name as any} size={size} tintColor={color} type="monochrome" style={{ width: size, height: size }} />;
}

// KARTPOSTAL OYUN SONU (2026-11-16): kullanıcı "tasarım sıkıcı"; editörlerin ortak önerisi:
// kartpostal + posta damgası, sayarak artan skor, amcanın ifadeli kafası çıkartma. Yeni görsel yok.
const PC_STICKER = {
  rec: require("@/assets/characters/charge-100-r12-ifade.png"),
  mid: require("@/assets/characters/charge-050-r12-ifade.png"),
  low: require("@/assets/characters/charge-000-r12.png"),
};
const PC_STAMP = require("@/assets/postcards/kartpostal-galata.jpg");
const PC_HAND = Platform.OS === "ios" ? "Noteworthy-Bold" : undefined;
const PC_TYPE = Platform.OS === "ios" ? "AmericanTypewriter-Bold" : undefined;
const PC_SCRIPT = Platform.OS === "ios" ? "SnellRoundhand-Bold" : undefined;
const TR_MONTHS_TITLE = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const TR_MONTHS = ["OCAK", "ŞUBAT", "MART", "NİSAN", "MAYIS", "HAZİRAN", "TEMMUZ", "AĞUSTOS", "EYLÜL", "EKİM", "KASIM", "ARALIK"];
const countUpMs = (n: number) => (n <= 0 ? 0 : Math.min(900, 300 + n * 12));
function CountUp({ to, style }: { to: number; style: any }) {
  const [v, setV] = useState(0);
  const pop = useSharedValue(1);
  useEffect(() => {
    const dur = countUpMs(to);
    if (dur === 0) { setV(0); return; }
    const start = Date.now();
    const id = setInterval(() => {
      const k = Math.min(1, (Date.now() - start) / dur);
      setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k >= 1) {
        clearInterval(id);
        pop.value = withSequence(withTiming(1.14, { duration: 110 }), withSpring(1, { damping: 9, stiffness: 220 }));
      }
    }, 16);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);
  const st = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));
  return <Animated.Text style={[style, st]}>{v}</Animated.Text>;
}
function Postmark({ delay, styles, label = "YENİ REKOR", small = false }: { delay: number; styles: any; label?: string; small?: boolean }) {
  const k = useSharedValue(0);
  useEffect(() => {
    k.value = withDelay(delay + 120, withSpring(1, { damping: 7, stiffness: 160, mass: 0.8 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const st = useAnimatedStyle(() => ({
    opacity: Math.min(1, k.value * 1.6) * 0.9,
    transform: [{ rotate: "-14deg" }, { scale: 2.3 - 1.3 * k.value }],
  }));
  const d = new Date();
  return (
    <Animated.View pointerEvents="none" style={[styles.pcPostmark, small && styles.pcPostmarkSm, st]}>
      <View style={[styles.pcPostmarkInner, small && styles.pcPostmarkInnerSm]}>
        {!small && <Text style={styles.pcPostmarkSmall} numberOfLines={1}>BYZANTION</Text>}
        <Text style={[styles.pcPostmarkBig, small && { fontSize: 11 }]} numberOfLines={1} adjustsFontSizeToFit>{label}</Text>
        {!small && <Text style={styles.pcPostmarkSmall} numberOfLines={1}>{d.getDate()} {TR_MONTHS[d.getMonth()]}</Text>}
      </View>
    </Animated.View>
  );
}

// HAYALET YARIŞ: yarışın canlı durumu (JS tarafı).
type RaceState = {
  seed: number; startedAt: number; pausedAt: number; pausedTotal: number; ended: boolean; waiting: boolean;
  far: number; best: number; runs: number; log: RaceLog;
  ghost: RaceData | null; oppName: string; matchID?: string;
};
function raceElapsed(rc: RaceState) {
  return (rc.pausedAt || Date.now()) - rc.startedAt - rc.pausedTotal;
}
// Bitmiş yarış sonucu, meydan okuyanın açısından: 1 kazandım, -1 kaybettim, 0 berabere.
function raceOutcome(c: { race?: string; replyRace?: string; score: number; reply?: number }) {
  const a = decodeRace(c.race);
  const b = decodeRace(c.replyRace);
  if (a && b) return compareRace(a, b);
  const r = c.reply ?? 0;
  return r > c.score ? -1 : r === c.score ? 0 : 1;
}
// Sayaç + ilerleme şeridi kendi içinde yeniden çizilir (ana bileşen her saniye render edilmez).
const RaceHud = memo(function RaceHud(props: {
  raceRef: { current: RaceState | null };
  ghostRef: { current: { idx: number; tower: number; far: number; falling: boolean } };
  towerRef: { current: number };
  tick: () => void;
  onTimeUp: () => void;
  bottom: number;
}) {
  const { raceRef, ghostRef, towerRef, tick, onTimeUp, bottom } = props;
  const [, force] = useState(0);
  useEffect(() => {
    let last = "";
    const id = setInterval(() => {
      const rc = raceRef.current;
      if (!rc || rc.ended) return;
      tick();
      const left = RACE_MS - raceElapsed(rc);
      if (left <= 0) { onTimeUp(); return; }
      const g = ghostRef.current;
      const key = `${clockText(left)}|${towerRef.current}|${rc.far}|${g.tower}|${g.far}`;
      if (key !== last) { last = key; force((n) => n + 1); }
    }, 100);
    return () => clearInterval(id);
  }, [raceRef, ghostRef, towerRef, tick, onTimeUp]);
  const rc = raceRef.current;
  if (!rc) return null;
  const left = RACE_MS - raceElapsed(rc);
  const g = ghostRef.current;
  const me = towerRef.current;
  const myFar = Math.max(rc.far, me);
  const span = Math.max(20, myFar, g.far, me, g.tower) * 1.1;
  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 16, right: 16, bottom, alignItems: "center", zIndex: 40 }} testID="race-hud">
      <View style={{ width: "100%", maxWidth: 420, borderRadius: 16, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: "rgba(42,27,18,0.78)" }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ color: left < 20000 ? "#ffb4a0" : "#fff", fontSize: 22, fontWeight: "900" }}>⏱ {clockText(left)}</Text>
          <Text style={{ color: "#ffd66b", fontSize: 13, fontWeight: "800" }}>Sen: kule {me} · en uzak {myFar}</Text>
        </View>
        {rc.ghost && (
          <Text style={{ color: "#d9c8ff", fontSize: 13, fontWeight: "800", textAlign: "right", marginTop: 2 }} numberOfLines={1}>
            👻 {rc.oppName || "Rakip"}: kule {g.tower} · en uzak {g.far}
          </Text>
        )}
        <View style={{ height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.18)", marginTop: 6 }}>
          {rc.ghost && <View style={{ position: "absolute", top: -3, width: 14, height: 14, borderRadius: 7, backgroundColor: "#b9a0ff", left: `${Math.min(97, (g.tower / span) * 100)}%` }} />}
          <View style={{ position: "absolute", top: -3, width: 14, height: 14, borderRadius: 7, backgroundColor: "#ff9a3c", borderWidth: 2, borderColor: "#fff", left: `${Math.min(97, (me / span) * 100)}%` }} />
        </View>
      </View>
    </View>
  );
});

function platformById(list: any[], id: number) {
  "worklet";
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) return list[i];
  }
  return undefined;
}

// tiny helper to avoid repeating absolute-fill spread
function absoluteFill() {
  return { position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0 };
}

// KARGA (2026-11-23): kulenin kendi koordinatında tünek; house view ile aynı hesap. slot>=0 kulenin kendi
// kargası, slot<0 herhangi bir tünek (tuz = -slot; uçup gelen karga için). wx/wy dünya koordinatı.
function kargaYer(g: any, slot: number) {
  "worklet";
  if (!KARGA_ON || !g || (MAHALLE_ON && sakin(g.p.id) !== 0)) return null;
  const id = g.p.id;
  const q = Math.floor(houseHash(id, 1) * 4) % 4;
  let v = Math.floor(houseHash(id, 4) * FACADE_CELLS) % FACADE_CELLS;
  if (v === Math.floor(houseHash(id - 1, 4) * FACADE_CELLS) % FACADE_CELLS) v = (v + 1 + Math.floor(houseHash(id, 5) * (FACADE_CELLS - 1))) % FACADE_CELLS;
  const d = slot >= 0
    ? kargaTunek(id, slot, v, FACADE_PERIOD_PX[v], FACADE_STARTS_PX[v][q], 30, KARGA_MAX_Y)
    : kargaTunekAny(id, -slot, v, FACADE_PERIOD_PX[v], FACADE_STARTS_PX[v][q], 30, KARGA_MAX_Y);
  if (!d) return null;
  const s = HOUSE_COL_W / 350;
  const B = FART_CHAR_H * KARGA_BOX_K;
  const x = (g.fw - HOUSE_COL_W) / 2 + d.x * s;
  const y = g.rise + HOUSE_GUTTER_H - HOUSE_GUTTER_OVERLAP + d.y * s;
  if (x - B * 0.27 < 0 || x + B * 0.27 > g.fw) return null; // dar kulede kenardan taşmasın
  return { x, y, wx: g.p.x - g.r + x, wy: g.p.topY + y, flip: d.flip, seed: d.seed };
}
function kargaGeom(list: any[], id: number) {
  const p = platformById(list, id);
  if (!p) return null;
  const r = houseRun(p, platformById(list, id - 1), platformById(list, id + 1));
  return { p, r, rise: r * HOUSE_HIP_SLOPE, fw: p.width + 2 * r };
}
const OYUN_SONU_TEST = false as boolean; // GEÇİCİ: toast/çip konum denemesi (teslimde false)
const DUSUS_ON = true as boolean; // düşüş kesinleşince "eyvah" çırpınması (2026-11-23, plan AMCA-DUSUS)
const BEDEN_ON = true as boolean; // amcanın inişten sonraki beden dili pozları (2026-11-23)
const BEDEN_TEST = false as boolean; // GEÇİCİ: her inişte sırayla 3 poz (simülatör denemesi); teslimde false
const KARGA_POOL_IDX = Array.from({ length: KARGA_HAVUZ }, (_, i) => i);
const KARGA_POOL_SRC = [KARGA_TUNEMIS, KARGA_BAKIS, KARGA_HAVALANMA, KARGA_YEM]; // poz: 0 tünemiş, 1 bakış, 2 uçuş, 3 yem

export default function Game() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useStyles();
  const { width: W, height: H } = useWindowDimensions();

  // --- JS-side reactive state (events only, never per-frame) ---------------
  const [score, setScore] = useState(0);
  const [lastJump, setLastJump] = useState<{ ms: number; percent: number; visualPercent: number; pressToFirstFrameMs: number } | null>(null);
  const reportJump = useCallback((ms: number, power: number, launchVX: number, launchVY: number, width: number, fromId: number, lastVisualCharge: number, pressToFirstFrameMs: number) => {
    setLastJump({ ms: Math.round(ms), percent: Math.round(power * 100), visualPercent: Math.round(lastVisualCharge * 100), pressToFirstFrameMs: Math.round(pressToFirstFrameMs) });
    // TEMPORARY diagnostic fields (visualCharge, pressToFirstFrameMs) added
    // per CLAUDE_CHARGE_TIMING_RESULT.md to compare what the player saw
    // against the launch-determining native-timestamp charge on a real
    // device. Safe to remove once the mismatch question is settled.
    console.info("[jump-measurement]", JSON.stringify({ heldMs: ms, charge: power, visualCharge: lastVisualCharge, pressToFirstFrameMs, vx: launchVX, vy: launchVY, screenWidth: width, fromPlatformId: fromId }));
  }, []);
  const [best, setBest] = useState(0);
  // FAZ2 kapanış (2026-11-12): ses aç/kapa, kalıcı.
  const [sfxMuted, setSfxMutedState] = useState(false);
  useEffect(() => {
    if (!DURAK_SEFER) return;
    storage.getItem<number>(FARTHEST_TOWER_KEY, 0).then((v) => {
      if (typeof v === "number" && v > 0) {
        freeFarthestRef.current = v;
        if (modeRef.current === "free") {
          farthestRef.current = v;
          recordFlagId.value = v;
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    storage.getItem<boolean>(SFX_MUTED_KEY, false).then((m) => {
      if (m === true) {
        setSfxMuted(true);
        setSfxMutedState(true);
      }
    });
  }, []);
  const toggleSfx = useCallback(() => {
    setSfxMutedState((prev) => {
      const next = !prev;
      setSfxMuted(next);
      storage.setItem(SFX_MUTED_KEY, next);
      return next;
    });
  }, []);
  const [gameOver, setGameOver] = useState(false);
  // AÇILIŞ MENÜSÜ (2026-11-16): kullanıcı "oyunun ilk açılışında bir menü olmalı, hemen oyun açılıyor".
  const [menuOpen, setMenuOpen] = useState(MENU_ON);
  // GERÇEK İSTANBUL (2026-11-17): hava, saat, ay, pil.
  const [istWeather, setIstWeather] = useState<IstWeather | null>(null);
  const [weatherTest, setWeatherTest] = useState(-1); // -1 = gerçek hava
  const [sceneTest, setSceneTest] = useState(0); // uzun basış: 0 kapalı, 1 gece+dolunay+pil az, 2 şarjda
  const [battery, setBattery] = useState<{ level: number; charging: boolean } | null>(null);
  const [clockTick, setClockTick] = useState(0);
  const realSkyRef = useRef(ISTANBUL_ON ? realSkyStep() : 0);
  const lowBatteryToldRef = useRef(false);
  const [gcPlayer, setGcPlayer] = useState<GameCenter.GameCenterPlayer | null>(null);
  const gcNameRef = useRef("");
  useEffect(() => { gcNameRef.current = gcPlayer?.displayName ?? ""; }, [gcPlayer]);
  const [coverMounted, setCoverMounted] = useState(true);
  const coverOpacity = useSharedValue(1);
  const coverStyle = useAnimatedStyle(() => ({ opacity: coverOpacity.value }));
  const [gameReady, setGameReady] = useState(false);
  const [loadedArt, setLoadedArt] = useState<Record<string, boolean>>({});
  const [artError, setArtError] = useState(false);
  // Temporary device measurement: JS-observed native image events, not separate network/decode timings.
  const [artOrigin] = useState(() => performance.now());
  const [artTimings, setArtTimings] = useState({ starts: {} as Record<string, number>, ends: {} as Record<string, number> });
  const artClock = useRef({ origin: artOrigin, starts: {} as Record<string, number>, ends: {} as Record<string, number> });
  // 2026-09-22 (iPhone test rejection, item 4): was defaulting to visible,
  // so this dev-only debug box (already __DEV__-gated at render below) sat
  // on top of the charge area on every single launch, blocking the first
  // tap until "Kapat" was pressed -- that, not the asset loading itself,
  // was the "slow/dirty startup" the tester saw. It no longer auto-opens;
  // the underlying measurement still runs (markArtStarted/Loaded always
  // fire), it is just not shown unless something sets this true.
  const [showArtTiming, setShowArtTiming] = useState(false);
  const markArtStarted = useCallback((name: string) => {
    const clock = artClock.current;
    if (clock.starts[name] === undefined) clock.starts[name] = performance.now() - clock.origin;
  }, []);
  const markArtLoaded = useCallback((name: string) => {
    const clock = artClock.current;
    if (clock.ends[name] === undefined) {
      clock.ends[name] = performance.now() - clock.origin;
      setArtTimings({ starts: { ...clock.starts }, ends: { ...clock.ends } });
      console.info("[art-load]", name, JSON.stringify({ startMs: clock.starts[name], readyMs: clock.ends[name] }));
    }
    setLoadedArt(previous => previous[name] ? previous : { ...previous, [name]: true });
  }, []);
  const poseLoads = useRef(0); // all 9 R12 pose bitmaps must be decoded before the first live frame
  const failArt = useCallback(() => setArtError(true), []);
  const artReady = loadedArt.background && loadedArt.character && loadedArt.bricks;
  // REVIZYON-022 (2026-09-24): first playable frame waits for the three
  // visible layers (background, RooftopDistrict, character idle) so nothing
  // pops in late; an asset error releases the gate instead of soft-locking.
  // REVIZYON-038A: R038 deliberately reduced the three category-specific
  // rooftop render trees to one shared rooftop image. Waiting for the removed
  // rooftop1/rooftop2 onLoad callbacks kept the cover mounted forever and
  // disabled the responder, so the game appeared not to start on iPhone.
  // REVIZYON-042: the shaft is synchronous View/gradient art and has no asset
  // gate. Background + district + character are the only visible bitmaps that
  // must decode before input is enabled.
  // REVIZYON-056: with the back row switched off nothing loads the district image.
  const districtReady = loadedArt.district || (!POPUP && !SHOW_BACK_DISTRICT);
  const assetsReady = gameReady && ((loadedArt.background && districtReady && loadedArt.character) || artError);

  useEffect(() => {
    if (assetsReady) {
      // Örtüyü anında kaldır, menü bir kare çizilince açılış ekranını kapat -> doğrudan menü.
      coverOpacity.value = 0;
      setCoverMounted(false);
      requestAnimationFrame(() => requestAnimationFrame(hideOpening));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetsReady]);

  const [perfectVisible, setPerfectVisible] = useState(false);
  const [landingLabel, setLandingLabel] = useState("PERFECT!");
  const [landingSub, setLandingSub] = useState("");
  const [quip, setQuip] = useState(GAME_OVER_LINE);
  const [goInfo, setGoInfo] = useState({ prevBest: 0, newRecord: false });
  // AMCANIN SESİ + LAKAP (2026-11-20)
  const runStatsRef = useRef(newRunStats());
  const [thought, setThought] = useState<{ k: number; text: string } | null>(null);
  const thoughtTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showThought = useCallback((text: string) => {
    setThought({ k: Date.now(), text });
    if (thoughtTimer.current) clearTimeout(thoughtTimer.current);
    thoughtTimer.current = setTimeout(() => setThought(null), 2400);
  }, []);
  const [speech, setSpeech] = useState<{ k: number; text: string; wx: number; wy: number } | null>(null);
  const speechTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showSpeech = useCallback((text: string, wx: number, wy: number) => {
    setSpeech({ k: Date.now(), text, wx, wy });
    if (speechTimer.current) clearTimeout(speechTimer.current);
    speechTimer.current = setTimeout(() => setSpeech(null), 2200);
  }, []);
  const catsRef = useRef<string[]>([]);
  const catWoken = useSharedValue(-1); // amcanın indiği kedili kule: turuncu kedi gerinir
  const neighborLook = useSharedValue(-1); // amcanın indiği cumbalı kule: teyze başını kaldırıp bakar
  // KARGALAR: kaba saat (250 ms; her karede değil, 14 kule × 8 katman eşleyici her karede koşmasın),
  // kaçan kuleler ve son kaçışın ilerlemesi.
  const kTick = useSharedValue(0);
  const kGone = useSharedValue<number[]>([]); // havalanmış kule kargaları: id*4+slot
  const kAmcaX = useSharedValue(-1e9); // amcanın son indiği yer (kafa çevirme yönü)
  const kPool = useSharedValue<any[]>([]); // uçan / yeni yerine konmuş kargalar (dünya koordinatı)
  const kP0 = useSharedValue(1), kP1 = useSharedValue(1), kP2 = useSharedValue(1), kP3 = useSharedValue(1), kP4 = useSharedValue(1), kP5 = useSharedValue(1), kP6 = useSharedValue(1), kP7 = useSharedValue(1);
  const kPs = [kP0, kP1, kP2, kP3, kP4, kP5, kP6, kP7];
  const kRng = useRef(kargaRngYap(Date.now())); // karga çeşitliliği için ayrı üreteç
  const kSonGelen = useRef(0); // son yeni gelen karganın JS saati (KARGA-DONGU: en az 8 sn arayla)
  useEffect(() => {
    if (!KARGA_ON) return;
    const t0 = Date.now();
    const h = setInterval(() => { kTick.value = Date.now() - t0; }, 250);
    return () => clearInterval(h);
  }, []);
  // KARGALAR: amca landedId kulesine inince (ratio = kule içindeki yer) yakın kargalar havalanır.
  const kargaKacirRef = useRef<(landedId: number, ratio: number) => void>(() => {});
  kargaKacirRef.current = (landedId: number, ratio: number) => {
      // KARGALAR (2026-11-23 çeşitlilik, Claudex planı KARGA-VARYASYON): amca bir kuleye inince o kulenin ve iki
      // yanındaki kulelerin kargaları kişiliklerine göre tepki verir: çoğu hemen kalkar, bazıları önce bakıp geç kalkar,
      // cesurlar (komşu kuledeyse) kalmaz-kalkmaz. Uçuş süresi/yay/dalgalanma/hedef (ileri, geri, gider) her seferinde farklı;
      // arada ekran dışından yeni kargalar gelir. Rastgelelik yalnız kRng'den (oyunun paylaşılan akışına dokunmaz).
      const R = kRng.current;
      const now = Date.now(); // uçuş bitişleri JS saatinde tutulur (UI'deki animasyon değerini JS'ten okumaya güvenilmez)
      const list = platforms.value;
      const lpk = platformById(list, landedId);
      if (lpk) kAmcaX.value = lpk.x + ratio * lpk.width;
      const gone = kGone.value.slice();
      const pool: any[] = KARGA_POOL_IDX.map((i) => kPool.value[i] ?? { on: 0, id: -999 });
      const flights: any[] = [];
      for (let id = landedId - 1; id <= landedId + 1; id++) {
        const g = kargaGeom(list, id);
        if (!g) continue;
        for (let slot = 0; slot < 2; slot++) {
          const key = id * 4 + slot;
          if (gone.includes(key)) continue;
          const d = kargaYer(g, slot);
          if (!d) continue;
          const r = R();
          if (id !== landedId && r < 0.15) continue; // cesur: komşu kuleye inişte yerinde kalır
          flights.push({ x0: d.wx, y0: d.wy, seed: d.seed, slot: -1, late: r >= 0.15 && r < 0.4, key, kac: 0 });
        }
      }
      for (let i = 0; i < KARGA_HAVUZ; i++) {
        const e = pool[i];
        if (!e.on || e.id === -999 || now < (e.until ?? 0) || Math.abs(e.id - landedId) > 1) continue;
        const r = R();
        if (e.id !== landedId && r < 0.15) continue;
        flights.push({ x0: e.x1, y0: e.y1, seed: e.seed, slot: i, late: r >= 0.15 && r < 0.4, kac: e.kac ?? 1 });
      }
      // Yeni gelen: havuzda boş yer varsa ekran dışından bir karga.
      // KARGA-DONGU: %10 ve en az 8 sn arayla (aynı aralığa sürekli yeni karga konup kovalamaca döngüsü olmasın).
      if (lpk && now - kSonGelen.current >= 8000 && R() < 0.1 && pool.some((e) => !e.on)) {
        kSonGelen.current = now;
        flights.push({ arrive: 1, kac: 0, x0: kAmcaX.value + 900 + R() * 400, y0: lpk.topY - 700 - R() * 300, seed: R(), slot: -1, late: false });
      }
      // Dolu tünekler: havuzda konmuş/konmakta olanlar (yeniden uçacaklar hariç).
      const reflying = flights.filter((f) => f.slot >= 0).map((f) => f.slot);
      const occupied: number[][] = [];
      pool.forEach((e, i) => { if (e.on && e.id !== -999 && !reflying.includes(i)) occupied.push([e.x1, e.y1]); });
      const isFree = (x: number, y: number) => occupied.every((o) => Math.abs(o[0] - x) >= 12 || Math.abs(o[1] - y) >= 12);
      const tryTower = (id: number) => {
        const g = kargaGeom(list, id);
        if (!g) return null;
        for (let slot = 0; slot < 2; slot++) { // hedef kulenin yerinde duran kendi kargaları
          const d0 = kargaYer(g, slot);
          if (d0 && !gone.includes(id * 4 + slot)) occupied.push([d0.wx, d0.wy]);
        }
        for (let salt = 1; salt <= 8; salt++) {
          const d = kargaYer(g, -salt);
          if (d && isFree(d.wx, d.wy)) return d;
        }
        return null;
      };
      const pickRange = (lo: number, hi: number) => {
        const ids = list.map((q: any) => q.id).filter((id: number) => id - landedId >= lo && id - landedId <= hi);
        for (let k = ids.length - 1; k > 0; k--) { const m = Math.floor(R() * (k + 1)); const t = ids[k]; ids[k] = ids[m]; ids[m] = t; }
        for (const id of ids) { const d = tryTower(id); if (d) return { d, T: id }; }
        return null;
      };
      const starts: { s: number; delay: number; dur: number; ease: number }[] = [];
      flights.forEach((f) => {
        // Slot: önce boş, sonra işi bitmiş (gitmiş) ya da en geride konmuş olan; UÇMAKTA olan slot asla kullanılmaz.
        // Slot yoksa karga yerinde kalır (kule kargası kGone'a eklenmez → kaybolmaz).
        let s = f.slot;
        if (s < 0) {
          const freeOf = (i: number) => !starts.some((q) => q.s === i) && !reflying.includes(i);
          s = pool.findIndex((e, i) => !e.on && freeOf(i));
          if (s < 0) s = pool.findIndex((e, i) => e.on && e.id === -999 && now >= (e.until ?? 0) && freeOf(i));
          if (s < 0) {
            let best = -1;
            for (let i = 0; i < KARGA_HAVUZ; i++) if (freeOf(i) && pool[i].on && now >= (pool[i].until ?? 0) && (best < 0 || pool[i].id < pool[best].id)) best = i;
            s = best;
          }
        }
        if (s < 0) return;
        // Hedef (KARGA-DONGU): türü kargaHedefTuru(kac) seçer — ilk kaçış çoğunlukla ileri, yeniden kaçan karga
        // gider / geri / uzak ileri (amca hemen yetişip yine kaçırmasın). Seçilen aralıkta yer yoksa sırayla öbür
        // aralıklar denenir; "gider"e yalnız seçimle ya da listede hiç boş tünek kalmadıysa düşülür.
        let pick: any = null;
        let leave = false;
        if (f.arrive) pick = pickRange(3, 6) ?? pickRange(2, 8);
        else {
          const tur = kargaHedefTuru(f.kac ?? 0, R());
          if (tur === "ileri") pick = pickRange(2, 5) ?? pickRange(6, 9) ?? pickRange(-4, -2) ?? pickRange(-7, -5);
          else if (tur === "uzak") pick = pickRange(6, 9) ?? pickRange(-4, -2) ?? pickRange(-7, -5) ?? pickRange(2, 5);
          else if (tur === "geri") pick = pickRange(-4, -2) ?? pickRange(-7, -5) ?? pickRange(6, 9) ?? pickRange(2, 5);
          else leave = true;
        }
        if (f.arrive && !pick) return;
        let dest: any, T: number;
        if (pick && !leave) { dest = pick.d; T = pick.T; occupied.push([dest.wx, dest.wy]); }
        else { dest = { wx: f.x0 + (R() < 0.5 ? -1 : 1) * (1200 + R() * 400), wy: f.y0 - 900 - R() * 300, seed: f.seed }; T = -999; } // gider
        if (f.key !== undefined) gone.push(f.key);
        const dur = 1100 + R() * 900;
        pool[s] = { on: 1, id: T, x0: f.x0, y0: f.y0, x1: dest.wx, y1: dest.wy, seed: dest.seed ?? f.seed,
          arc: 0.6 + R() * 1.8, wob: R() * 0.25, wobN: 1 + Math.floor(R() * 2), dur, wait: f.late ? 1 : 0, kac: f.arrive ? 0 : (f.kac ?? 0) + 1 };
        const delay = f.late ? 300 + R() * 500 : R() * 200;
        pool[s].until = now + delay + dur + 50; // bu ana kadar slot "uçuşta" sayılır, yeniden kullanılmaz
        starts.push({ s, delay, dur, ease: R() < 0.5 ? 0 : 1 });
      });
      kGone.value = gone.slice(-60);
      kPool.value = pool;
      if (SFX_ON && starts.length > 0) mahalleSes({ tur: "karga", gecikmeMs: Math.min(...starts.map((q) => q.delay)) });
      starts.forEach(({ s, delay, dur, ease }) => {
        kPs[s].value = 0;
        kPs[s].value = withDelay(delay, withTiming(1, { duration: dur, easing: ease ? Easing.out(Easing.cubic) : Easing.inOut(Easing.quad) }));
      });
  };
  useEffect(() => {
    if (!KARGA_ON || !KARGA_TEST) return;
    // GEÇİCİ simülatör denemesi: 12 sn sonra her 3 sn sırayla ilerleyen kuleye inilmiş gibi kargaları kaçırır.
    let n = 1;
    let h: any = null;
    const t = setTimeout(() => { h = setInterval(() => { kargaKacirRef.current(n, 0.5); n++; }, 3000); }, 12000);
    return () => { clearTimeout(t); if (h) clearInterval(h); };
  }, []);
  // Uçan / yeni yerine konmuş kargalar: poz 0 tünemiş, 1 bakış, 2 uçuş, 3 yem. Dünya koordinatında (kule kırpması yok).
  const kargaPoolStyle = (i: number, pose: number) => {
    const P = kPs[i];
    return useAnimatedStyle(() => {
      const pool = kPool.value;
      const p = P.value;
      const tick = kTick.value;
      const ax = kAmcaX.value;
      const e = pool[i];
      const KOFF = { opacity: 0, transform: [{ translateX: -99999 }, { translateY: 0 }, { scaleX: 1 }, { scaleY: 1 }] };
      if (!KARGA_ON || !e || !e.on || (e.id === -999 && p >= 1)) return KOFF;
      const B = FART_CHAR_H * KARGA_BOX_K;
      let x = e.x1, y = e.y1, face = 1, want = 2, sy = 1;
      if (p <= 0) {
        // Kalkış beklerken tünekte: geç kaçan bakış pozunda, gövde amcaya dönük (aynalanmaz).
        x = e.x0; y = e.y0;
        want = e.wait ? 1 : 0;
        face = ax < -1e8 ? 1 : ax < x ? -1 : 1;
      } else if (p < 1) {
        const u = kargaUcus(e, p, B);
        x = u.x; y = u.y; sy = u.sy;
        face = e.x1 >= e.x0 ? 1 : -1;
      } else {
        const b = kargaBekle(tick, e.seed);
        want = b === 2 ? 3 : b;
        face = ax < -1e8 ? 1 : ax < x ? -1 : 1; // bakışta da gövde aynı yönde (yalnız baş döner)
      }
      if (want !== pose) return KOFF;
      return { opacity: 1, transform: [{ translateX: x - MAHALLE_BOX / 2 }, { translateY: y - B * KARGA_FOOT_Y + B / 2 - MAHALLE_BOX / 2 }, { scaleX: (face * B) / MAHALLE_BOX }, { scaleY: (sy * B) / MAHALLE_BOX }] };
    });
  };
  const kargaPoolStyles = KARGA_POOL_IDX.flatMap((i) => [0, 1, 2, 3].map((pose) => kargaPoolStyle(i, pose)));
  const [cats, setCats] = useState<string[]>([]);
  const [catBook, setCatBook] = useState(false);
  useEffect(() => {
    if (!MAHALLE_ON) return;
    storage.getItem<string>(KEDI_DEFTER_KEY, "").then((raw) => { catsRef.current = raw ? raw.split(",").filter(Boolean) : []; setCats(catsRef.current); });
  }, []);
  const [hanim, setHanim] = useState<string | null>(null);
  const hanimTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lakapText, setLakapText] = useState<string | null>(null);
  const [runsDone, setRunsDone] = useState(0); // öğretici yazı ilk 3 koşudan sonra gizlenir (editörler, video 2026-11-20)
  // ÖZEL GÜN (2026-11-20): gerçek tarih ya da (test) menü başlığına dokunarak önizleme
  const [eventTest, setEventTest] = useState(-1);
  const [eventDay, setEventDay] = useState(() => todaysEvent());
  const curEvent = !OZEL_GUN_ON ? null : eventTest >= 0 ? OZEL_GUNLER[OZEL_GUN_TEST_ORDER[eventTest]] : eventDay;
  useEffect(() => { if (menuOpen) setEventDay(todaysEvent()); }, [menuOpen]);
  const eventRef = useRef(curEvent);
  eventRef.current = curEvent;
  const [shareOpen, setShareOpen] = useState(false); // PAYLAŞIM KARTPOSTALI (2026-11-18)
  const [debug, setDebug] = useState({
    charge: 0, vx: 0, vy: 0, dist: 0, width: 0, offset: 0, fps: 0, p50: 0, p95: 0, dropped: 0,
  });
  const scoreRef = useRef(0);
  // DURAK SEFERİ state
  const lastTowerRef = useRef(TEST_START_TOWER);
  const farthestRef = useRef(0);
  const [stopBanner, setStopBanner] = useState<{ key: number; title: string; sub: string; pier?: boolean } | null>(null);
  const [pierFx, setPierFx] = useState(0); // final kutlaması anahtarı (0 = yok)
  const [bigCard, setBigCard] = useState<number | null>(null); // albümde büyütülen kart
  // MEYDAN OKUMA
  const seedRef = useRef(0); // bu koşunun harita tohumu
  const challengeRef = useRef<Challenge | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [codeOpen, setCodeOpen] = useState(false);
  const [codeText, setCodeText] = useState("");
  const [codeError, setCodeError] = useState("");
  const [copied, setCopied] = useState(false);
  // MEYDAN OKUMA · ARKADAŞ (Game Center sıra tabanlı maç)
  const [incoming, setIncoming] = useState<GameCenter.FriendChallenge[]>([]);
  const [friendResults, setFriendResults] = useState<GameCenter.FriendChallenge[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  // OYUN SONU (2026-11-23, Claudex planı): toast konumu için ölçülen HUD ve oyun sonu kartı alt kenarları.
  const [hudBottom, setHudBottom] = useState<number | null>(null);
  const [goCardBottom, setGoCardBottom] = useState<number | null>(null);
  const [friendSheet, setFriendSheet] = useState(false);
  const [friends, setFriends] = useState<GameCenter.GameCenterFriend[]>([]);
  const [friendsMsg, setFriendsMsg] = useState<string | null>(null);
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  // HAYALET YARIŞ
  const raceRef = useRef<RaceState | null>(null);
  const ghostRef = useRef({ idx: 0, tower: 0, far: 0, falling: false });
  const [raceOn, setRaceOn] = useState(false);
  const [raceResult, setRaceResult] = useState<null | { me: RaceSummary; opp: RaceSummary | null; oppName: string; seed: number; race: string }>(null);
  const [sheetMode, setSheetMode] = useState<"score" | "race">("score");
  const respawnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restartRef = useRef<() => void>(() => {});
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = useCallback((t: string) => {
    setToast(t);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);
  useEffect(() => {
    if (!OYUN_SONU_TEST) return;
    if (gameOver) { const t = setTimeout(() => showToast("⚔️ Uzun deneme bildirimi: Arkadaşın Mehmet Ali Kadıköylüoğlu senin 48 puanını oynadı ve 52 yaptı, seni geçti! Bu metin bilerek çok uzun yazıldı; iki satırdan sonrası üç nokta ile kısalmalı ve kart ile çakışmamalı."), 900); return () => clearTimeout(t); }
    if (!menuOpen) { const t = setTimeout(() => showToast("🐈 Tekir ile tanıştın! Kedi defteri: 3"), 700); return () => clearTimeout(t); }
  }, [gameOver, menuOpen, showToast]);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [arrivalCard, setArrivalCard] = useState<number | null>(null); // varışta kayan küçük kart
  const arrivalTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [bridgeStrip, setBridgeStrip] = useState<{ name: string; from: string; to: string; progress: number } | null>(null);
  // KARTPOSTAL ALBÜMÜ
  const unlockedRef = useRef<number[]>([]);
  const [unlocked, setUnlocked] = useState<number[]>([]);
  const runNewCardsRef = useRef<number[]>([]);
  const [runNewCards, setRunNewCards] = useState<number[]>([]);
  const [albumOpen, setAlbumOpen] = useState(false);
  useEffect(() => {
    if (!POSTCARDS_ON) return;
    storage.getItem<string>(POSTCARDS_KEY, "").then((raw) => {
      const u = parseUnlocked(raw);
      unlockedRef.current = u;
      setUnlocked(u);
    });
  }, []);
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [runEnd, setRunEnd] = useState<{ lastTower: number; stops: number }>({ lastTower: 0, stops: 0 });
  const bestRef = useRef(0);
  // GÜNÜN HARİTASI: oyun modu. bestRef/best ve farthestRef/recordFlagId her
  // zaman AKTİF modun değerini tutar; serbest mod değerleri ayrıca saklanır.
  const [mode, setMode] = useState<"free" | "daily">("free");
  const modeRef = useRef<"free" | "daily">("free");
  const freeBestRef = useRef(0);
  const freeFarthestRef = useRef(0);
  const dailyRef = useRef<DailyRecord>({ date: "", best: 0, farthest: 0 });
  const perfectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Shared (UI-thread) game state ---------------------------------------
  const px = useSharedValue(0);
  const py = useSharedValue(0);
  const vx = useSharedValue(0);
  const vy = useSharedValue(0);
  const phase = useSharedValue<number>(PHASE.IDLE);
  const tepki = useSharedValue(0); // BEDEN DİLİ: 0 yok, 1 silkele, 2 denge, 3 oh be
  const dusus = useSharedValue(0); // DÜŞÜŞ: 0 yok, 1/2 çırpınma karesi
  const dususAt = useSharedValue(0);
  const tepkiP = useSharedValue(1); // tepki pozunun yerleşme ilerlemesi (0→1, 180 ms)
  const bedenTest = useRef(0);
  const charge = useSharedValue(0);
  // __DEV__-only visual pose freeze (0/25/50/75/100 % screenshot QA), never
  // touches `charge` itself. Declared here (not next to poseCharge below)
  // so onPressIn/cancelCharge can force it back to "off" (-1) at the start
  // of every real charge -- see the 2026-09-22 device-rejection fix note at
  // those call sites: the on-screen dev buttons sit inside the tappable
  // play area and have no visual "armed" indicator, so an accidental tap
  // during normal play could freeze the pose on a crouch frame indefinitely
  // with no way for a player to know why. This guarantees any such freeze
  // cannot survive past the very next legitimate press.
  const poseOverride = useSharedValue(-1);
  const touchStartedAt = useSharedValue(0);
  // Diagnostic only (not read by the charge formula below): records the
  // display-link timestamp of the first frame tick seen while CHARGING, so
  // onPressOut can report how long press-processing took to reach the frame
  // loop. See CLAUDE_CHARGE_TIMING_RESULT.md.
  const firstChargeFrameSeen = useSharedValue(0);
  const firstChargeFrameTs = useSharedValue(0);
  const releasedCharge = useSharedValue(0); // visual compression held during flight
  const visualCharge = useSharedValue(0);
  const jacketOpen = useSharedValue(0);
  const jacketPopped = useSharedValue(0);
  const puffAge = useSharedValue(1);
  const headTilt = useSharedValue(0);
  const headVelocity = useSharedValue(0);
  const camX = useSharedValue(0);
  // Render Y is fixed at the spawn composition for the entire life.
  const camYR = useSharedValue(0);
  // Spring Ninja's measured horizontal player anchor stays at 422/1320 px
  // through ordinary and long flights. X follows the player's world position.
  const camXR = useSharedValue(0);
  const baseY = useSharedValue(0);
  const landPulse = useSharedValue(0);
  const platforms = useSharedValue<any[]>([]);
  const housePlatformsFrozen = useSharedValue<any[]>([]);
  // REVIZYON-064 PERF_PROBE counters (UI thread writes, JS reads twice a second).
  const pFrames = useSharedValue(0);
  const pHitch = useSharedValue(0); // > 25 ms
  const pHitchBig = useSharedValue(0); // > 40 ms
  const pAirFrames = useSharedValue(0);
  const pAirHitch = useSharedValue(0);
  const pListAir = useSharedValue(0); // platform-list changes while airborne
  const pHitchNearList = useSharedValue(0); // hitch on the frame of / after a list change
  const pMaxMs = useSharedValue(0);
  const pListFrame = useSharedValue(-10);
  // REVIZYON-065 attribution (PERF_PROBE only): hitches by phase, and each
  // in-flight hitch tied to what happened on the frame before it -- a house
  // appearing (slot null -> geometry), disappearing, or moving/resizing; a
  // list change that wrote no house; or nothing. Event counts give the rate.
  const pHitchIdle = useSharedValue(0);
  const pHitchCharge = useSharedValue(0);
  const pHitchDead = useSharedValue(0);
  const pHouseFrame = useSharedValue(-10); // last frame a house wrote houseGeom
  const pHouseKind = useSharedValue(0); // bitmask of that frame: 1 appear, 2 gone, 4 move
  const pEvAppear = useSharedValue(0); // in-flight house writes by kind
  const pEvGone = useSharedValue(0);
  const pEvMove = useSharedValue(0);
  const pListNoHouse = useSharedValue(0); // in-flight list changes with no house write
  const pHitchAppear = useSharedValue(0);
  const pHitchGone = useSharedValue(0);
  const pHitchMove = useSharedValue(0);
  const pHitchListOnly = useSharedValue(0);
  const pHitchNoEvent = useSharedValue(0);
  const pListPending = useSharedValue(0); // 1 = previous frame changed the list while airborne
  const houseProbe = useMemo(
    () => (PERF_PROBE ? { pFrames, phase, pHouseFrame, pHouseKind, pEvAppear, pEvGone, pEvMove } : null),
    // SharedValues are stable for the screen's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  // R068 FRAME_DIAG (cumulative since the app opened; Play Again does not reset).
  const dB12 = useSharedValue(0);
  const dB20 = useSharedValue(0);
  const dB25 = useSharedValue(0);
  const dBOver = useSharedValue(0);
  const dHold = useSharedValue(0); // frames: tiny step after a normal one, then a big step
  const dShortLong = useSharedValue(0); // airborne interval pairs: <=12 ms followed by >=20 ms
  const dPrevCam = useSharedValue(0);
  const dPrevPy = useSharedValue(0);
  const dPrevChX = useSharedValue(0);
  const dPrevStep = useSharedValue(-1); // previous airborne |camera screen step| px, -1 = none
  const dPrevRaw = useSharedValue(0);
  const dEma = useSharedValue(0); // airborne mean |camera screen step| px per frame
  const dExamples = useSharedValue<any[]>([]);
  const [diagText, setDiagText] = useState("");
  const idCounter = useSharedValue(1);
  const lastLandedId = useSharedValue(0);
  // Visual-only, unrelated to score: which platform the character is
  // currently standing on, and the world-space point the column-smoke
  // effect anchors to. Distinct from lastLandedId, which only advances on a
  // NEW high-score platform and must not be repurposed for this (see
  // GORSEL-004 task notes).
  const standingPlatformId = useSharedValue(0);
  // GORSEL-004A: whether the platform above is a "chimney" (visualType),
  // read directly from platform data at landing time -- this, not a bare id
  // hash, is what ColumnSmoke now gates on. standingPlatformId above is kept
  // only for the TEMP DEBUG panel display.
  const standingPlatformIsChimney = useSharedValue(false);
  const lastOffset = useSharedValue(0);
  const fps = useSharedValue(60);
  const dbgAcc = useSharedValue(0);
  // OYUN_AKISI-002 (2026-09-22, item C): real device-friendly frame-time
  // p50/p95 + a dropped-frame counter, __DEV__/DEBUG_MODE-only, default
  // OFF (DEBUG_MODE is false in production, see config.ts). A small fixed
  // ring buffer of the RAW (unclamped) per-frame duration -- the `dt` used
  // for physics below is clamped for stability, this is the true value, so
  // a real hitch still shows up here even though it never destabilises
  // gameplay. "Dropped" = a frame that took >25ms (>1.5x a 60Hz budget).
  const FRAME_HISTORY_LEN = 120;
  const frameTimes = useSharedValue<number[]>(new Array(120).fill(16.7));
  const frameTimeIdx = useSharedValue(0);
  const droppedFrames = useSharedValue(0);
  const running = useSharedValue(0); // 1 while a round is active

  // Seeded procedural generation. A fresh random seed is drawn each run so
  // every restart produces a different map; supplying a fixed seed reproduces
  // the exact same tower sequence (foundation for future shared-seed modes).
  const rngState = useSharedValue(1);
  const runSeed = useSharedValue(1);

  // Perfect-landing particle burst
  const burst = useSharedValue(0);
  const skyStep = useSharedValue(START_SKY);
  const nightAmt = useDerivedValue(() => Math.max(0, Math.min(1, skyStep.value - 3)));

  // GERÇEK İSTANBUL: saat (dakikada bir), hava (önbellek + 30 dk'da bir), pil (dakikada bir).
  useEffect(() => {
    if (!ISTANBUL_ON) return;
    const tick = () => {
      const real = HAVA_GALERI ? 1 : sceneTest === 1 ? 4 : realSkyStep();
      realSkyRef.current = real;
      // Koşu sırasında yalnız kararabilir; menüde/başta doğrudan gerçek saate.
      if (real > skyStep.value) skyStep.value = withTiming(real, { duration: 1200 });
      else if (scoreRef.current === 0 && !raceRef.current) skyStep.value = withTiming(Math.max(START_SKY, real), { duration: 1200 });
      setClockTick((n) => n + 1);
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneTest]);
  useEffect(() => {
    if (!ISTANBUL_ON) return;
    let alive = true;
    const refresh = async () => {
      const cached = parseWeather(await storage.getItem<string>(WEATHER_CACHE_KEY, ""));
      if (alive && cached && Date.now() - cached.at < WEATHER_STALE_MS) setIstWeather((w) => w ?? cached);
      if (cached && Date.now() - cached.at < WEATHER_REFRESH_MS) return;
      // Önce Apple WeatherKit; yanıt yoksa (yetki/ağ) deneme süresince Open-Meteo yedeği.
      const fresh = fromApple(await GameCenter.istanbulWeather()) ?? (OPEN_METEO_FALLBACK ? await fetchWeather() : null);
      if (!alive) return;
      if (fresh) {
        setIstWeather(fresh);
        storage.setItem(WEATHER_CACHE_KEY, JSON.stringify(fresh));
      } else if (!cached || Date.now() - cached.at >= WEATHER_STALE_MS) {
        setIstWeather(null); // çevrimdışı ve bilgi eski: açık hava + gerçek saat
      }
    };
    const pollBattery = async () => { const b = await GameCenter.battery(); if (alive) setBattery(b); };
    refresh();
    pollBattery();
    const id = setInterval(() => { refresh(); pollBattery(); }, 60_000);
    const sub = AppState.addEventListener("change", (st) => { if (st === "active") { refresh(); pollBattery(); } });
    return () => { alive = false; clearInterval(id); sub.remove(); };
  }, []);
  // GEÇİCİ (HAVA_GALERI): editör değerlendirmesi için oyunda hava 4 sn'de bir sırayla değişir, gökyüzü gündüz.
  useEffect(() => {
    if (!HAVA_GALERI || !HAVA_GALERI_DONGU || menuOpen) return;
    const id = setInterval(() => setWeatherTest((i) => (i + 1 >= WEATHER_TEST_CYCLE.length ? 0 : i + 1)), 7000);
    return () => clearInterval(id);
  }, [menuOpen]);
  const shownWeather: IstWeather | null = weatherTest >= 0
    ? { ...WEATHER_TEST_CYCLE[weatherTest], temp: istWeather?.temp ?? 14, at: Date.now(), test: true }
    : istWeather;
  const weatherRef = useRef(shownWeather);
  weatherRef.current = shownWeather;
  const moon = useMemo(() => {
    const m = moonInfo();
    return sceneTest === 1 ? { ...m, illum: 1, full: true, waxing: true, name: "Dolunay" } : m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clockTick, sceneTest]);
  const shownBattery = sceneTest === 1 ? { level: 0.1, charging: false } : sceneTest === 2 ? { level: 0.6, charging: true } : battery;
  const batteryMood: "low" | "charging" | null = !ISTANBUL_ON || !shownBattery || shownBattery.level < 0 ? null
    : shownBattery.charging ? "charging" : shownBattery.level < 0.21 ? "low" : null;
  const isNightNow = (sceneTest === 1 ? 4 : realSkyRef.current) >= 4;
  // MEVSİM + kolonlara hava izi (2026-11-17): takvim temel, gerçek sıcaklık düzeltir; denemede test girdisi.
  const testEntry = weatherTest >= 0 ? WEATHER_TEST_CYCLE[weatherTest] : null;
  const season: Season = testEntry?.season ?? seasonFor(Date.now(), istWeather ? istWeather.temp : null);
  const roofWx: "kar" | "yagmur" | null = !ISTANBUL_ON ? null : shownWeather?.kind === "kar" ? "kar" : shownWeather?.kind === "yagmur" ? "yagmur" : null;
  // Kış yağmurunda yaz bitkisi olmasın: yağmur + kış -> kış cephesi (zaten çamaşırsız).
  const cepheHal: CepheHal = !ISTANBUL_ON ? null : roofWx === "kar" ? "kar" : roofWx === "yagmur" ? (season === "kis" ? "kis" : "yagmur") : season === "kis" ? "kis" : season === "sonbahar" ? "sonbahar" : null;
  const bgVariant: keyof typeof BG_VARIANTS | null = !ISTANBUL_ON ? null : roofWx === "kar" ? "kar" : season === "kis" ? "kis" : roofWx === "yagmur" ? "yagmur" : season === "sonbahar" ? "sonbahar" : null;
  // Gece (gerçek saat ya da gece durakları): skor koyu gökte okunsun diye açık renk.
  const nightHud = ISTANBUL_ON && (isNightNow || (DURAK_SEFER && stopsPassed(lastTowerRef.current) >= NIGHT_STOP));
  // Günün ilk koşusunda bir satır İstanbul havası; pil azsa (oturumda bir kez) amcanın şarj şakası öncelikli.
  const announceDay = useCallback(async () => {
    if (!ISTANBUL_ON) return;
    if (batteryMood === "low" && !lowBatteryToldRef.current) {
      lowBatteryToldRef.current = true;
      showToast("Amca: Senin şarjın da bitiyor, benim de…");
      return;
    }
    const today = trDayKey();
    const w = shownWeather ?? { kind: "acik" as const, wind: null, temp: 0, at: 0 };
    if (!shownWeather?.test && (await storage.getItem<string>(WEATHER_TOAST_KEY, "")) === today) return;
    if (!shownWeather?.test) storage.setItem(WEATHER_TOAST_KEY, today);
    showToast(weatherLine(w, isNightNow, moon.full));
  }, [batteryMood, shownWeather, isNightNow, moon.full, showToast]);
  const overT = useSharedValue(-1); // patlama eşiği ilerlemesi (-1 = pencere yok)
  const dirty = useSharedValue(0); // 1 = amca bu tur lekeli
  // PİJAMA ANI (2026-11-16): gece başlarken çatı kapısı + gece külahı/terlik.
  const pajama = useSharedValue(0); // 1 = gece kıyafeti
  const winterWear = useSharedValue(0); // 1 = kış bere + atkı (koşu başında belirlenir)
  // KARLI AMCA (2026-11-17): birikmiş kar, burun kızarması, buhar, kalkışta dökülen taneler.
  const snowAmt = useSharedValue(0);
  const noseRed = useSharedValue(0);
  const breath = useSharedValue(0);
  const snowingSV = useSharedValue(0);
  const coldSV = useSharedValue(0);
  const shed = useSharedValue(1);
  const shedX = useSharedValue(0);
  const shedY = useSharedValue(0);
  const shedAmt = useSharedValue(0);
  // ŞEMSİYE (2026-11-17): umbMode 0 yok / 1 yağmur / 2 hafif yağmur; umbArmed 1 = bu uçuşta açıldı; umbV0 = kalkış |vy|.
  const umbMode = useSharedValue(0);
  const umbVis = useSharedValue(0);
  const umbOpen = useSharedValue(0);
  const umbFlip = useSharedValue(0);
  const umbArmed = useSharedValue(0);
  const umbV0 = useSharedValue(1);
  const seasonRef = useRef<Season>(season);
  seasonRef.current = season;
  // Kıyafet koşu ortasında değişmez: yalnız koşu başlamadan (skor 0) ya da yeniden başlarken uygulanır.
  useEffect(() => {
    if (!KIS_ON) return;
    if (scoreRef.current === 0) winterWear.value = season === "kis" ? 1 : 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [season]);
  // YAĞMUR KIYAFETİ (2026-11-17): yağmurda kasket + mont; koşu başında belirlenir (kış kıyafeti gibi).
  const rainWear = useSharedValue(0);
  const rainingNow = YAGMUR_ON && ISTANBUL_ON && shownWeather?.kind === "yagmur";
  const rainingRef = useRef(rainingNow);
  rainingRef.current = rainingNow;
  const [rainMounted, setRainMounted] = useState(rainingNow);
  useEffect(() => {
    if (!YAGMUR_ON) return;
    if (rainingNow) setRainMounted(true);
    if (scoreRef.current === 0) rainWear.value = rainingNow ? 1 : 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rainingNow]);
  // İÇ SES: oyun başında 9 sn hiç zıplanmazsa amca söylenir (koşu başına bir kez).
  useEffect(() => {
    if (!ICSES_ON || menuOpen || gameOver || score !== 0 || raceOn) return;
    const t = setTimeout(() => {
      if (scoreRef.current !== 0) return;
      const line = icSesIdle();
      if (line) showThought(line);
    }, 9000);
    return () => clearTimeout(t);
  }, [menuOpen, gameOver, score, raceOn, showThought]);
  const doorLock = useSharedValue(0); // 1 = kapı anı sürüyor, dokunma yok sayılır
  const doorOp = useSharedValue(0);
  const doorOpen = useSharedValue(0);
  const doorX = useSharedValue(0);
  const doorBottom = useSharedValue(0);
  const charOp = useSharedValue(1);
  const walkX = useSharedValue(0); // kapıya yürüme (yalnız görüntü)
  // HAYALET YARIŞ: yarış sürüyor mu + rakip hayaletin durumu (yalnız çizim).
  const raceLive = useSharedValue(0);
  const gOn = useSharedValue(0);
  const gMode = useSharedValue(0); // 0 duruyor, 1 zıplıyor, 2 düşüyor
  const gFromId = useSharedValue(0);
  const gFromR = useSharedValue(0.5);
  const gToId = useSharedValue(0);
  const gToR = useSharedValue(0.5);
  const gProg = useSharedValue(0);
  // KURUKAFA (2026-11-16)
  const skullX = useSharedValue(0);
  const skullY = useSharedValue(0);
  const skullVis = useSharedValue(0);
  const skullOwner = useSharedValue(-1); // görünen kurukafanın taşındığı kule kimliği
  const skullTaken = useSharedValue(-1); // alınan kurukafanın kule kimliği
  const effectK = useSharedValue(1); // 1.2 / 0.8 / 1
  const effectLeft = useSharedValue(0); // kalan iniş
  const skullBob = useSharedValue(0); // süzülme (0..1 döngü)
  useEffect(() => {
    if (KURUKAFA_ON) skullBob.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.linear }), -1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const walkY = useSharedValue(0);
  const splat = useSharedValue(1); // 0..1 patlama animasyonu (1 = bitti)
  const splatX = useSharedValue(0);
  const splatY = useSharedValue(0);
  const flyT = useSharedValue(0);
  const recordFlagId = useSharedValue(0);
  const dust = useSharedValue(1);
  const fartPuffs = useSharedValue<any[]>([]);
  const fartNow = useSharedValue(0);
  const fartCut = useSharedValue(0);
  const fartOn = useSharedValue(0);
  const fartIdx = useSharedValue(0);
  const fartLastEmit = useSharedValue(-1e9);
  const fartLaunchAt = useSharedValue(-1);
  const fartSize = useSharedValue(1);
  const dustX = useSharedValue(0);
  const dustY = useSharedValue(0);
  const burstX = useSharedValue(0);
  const burstY = useSharedValue(0);

  // Game Center sign-in once at launch (no-op without the native module).
  useEffect(() => {
    if (!GAME_CENTER_ON || !GameCenter.gameCenterAvailable) return;
    let alive = true;
    GameCenter.authenticate().then((p) => {
      if (!alive) return;
      setGcPlayer(p);
      if (MEYDAN_ON && p.authenticated) {
        GameCenter.loadChallenges().then((r) => {
          if (!alive) return;
          setIncoming(r.incoming);
          setFriendResults(r.results);
        });
      }
    });
    const offIn = GameCenter.onChallenge("onChallenge", (c) => {
      setIncoming((list) => (list.some((x) => x.matchID === c.matchID) ? list : [...list, c]));
      showToast(c.race ? `🏁 ${c.from || "Bir arkadaşın"} sana 2 dakikalık meydan okudu: ${c.score}. kule` : `⚔️ ${c.from || "Bir arkadaşın"} sana meydan okudu: ${c.score} puan`);
    });
    const offRes = GameCenter.onChallenge("onChallengeResult", (c) => {
      setFriendResults((list) => (list.some((x) => x.matchID === c.matchID) ? list : [...list, c]));
      showToast(c.race ? `🏁 ${c.replier || "Arkadaşın"} meydan okumanı oynadı: ${c.reply ?? 0}. kule` : `⚔️ ${c.replier || "Arkadaşın"} meydan okumanı oynadı: ${c.reply ?? 0} puan`);
    });
    return () => {
      alive = false;
      offIn();
      offRes();
    };
  }, [showToast]);

  const openLeaderboard = useCallback(async () => {
    let p = gcPlayer;
    if (!p?.authenticated) {
      p = await GameCenter.authenticate();
      setGcPlayer(p);
    }
    if (p.authenticated) GameCenter.showLeaderboard(LEADERBOARD_ID);
  }, [gcPlayer]);

  // ------------------------------------------------------------------------
  // Load persisted best score once.
  // ------------------------------------------------------------------------
  useEffect(() => {
    let alive = true;
    (async () => {
      const saved = await storage.getItem<number>(BEST_SCORE_KEY, 0);
      if (alive && typeof saved === "number") {
        freeBestRef.current = saved;
        if (modeRef.current === "free") {
          bestRef.current = saved;
          setBest(saved);
        }
      }
      if (DAILY_MAP) {
        const raw = await storage.getItem<string>(DAILY_KEY, "");
        try {
          const d = raw ? (JSON.parse(raw) as DailyRecord) : null;
          if (alive && d && typeof d.date === "string") dailyRef.current = d;
        } catch {}
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // ------------------------------------------------------------------------
  // Seeded RNG (mulberry32) + tower generator. Both are worklet-safe and used
  // by UI-thread initialisation and spawning, consuming one continuous seeded
  // stream so a given seed always reproduces the same tower sequence.
  // ------------------------------------------------------------------------
  const rand = () => {
    "worklet";
    const r = mulberry32Step(rngState.value);
    rngState.value = r.nextState;
    return r.value;
  };

  // Procedural math itself lives in src/game/procedural-course.ts (a single
  // source of truth also imported by offline test scripts, avoiding a
  // hand-duplicated copy that could silently drift from the live game).
  const makeNextPlatform = (prev: any, id: number) => {
    "worklet";
    const measured = USE_REFERENCE_COURSE ? referencePlatform(id, W, CONFIG.cameraZoom) : null;
    if (measured) return measured;
    const generated = generateProceduralPlatform(prev, id, rand, W);
    const width = USE_REFERENCE_COURSE ? referenceTowerWidth(W, CONFIG.cameraZoom) : generated.width;
    const out: any = { ...generated, width, visualType: classifyPlatformVisualType(id) };
    // KURUKAFA: prev -> bu kule arasındaki boşlukta mı? Ayrı karma; RNG akışına dokunmaz.
    if (KURUKAFA_ON && DURAK_SEFER && skullAfter(runSeed.value, prev.id)) out.skull = skullPoint(prev, out, PH / 2, W, skullLift(runSeed.value, prev.id));
    return out;
  };

  // ------------------------------------------------------------------------
  // (Re)initialise the world. A fresh seed is drawn unless one is supplied
  // (deterministic-seed hook for future shared-map modes). Snaps the camera
  // into place so restart is instant with no slide.
  // ------------------------------------------------------------------------
  const initWorld = useCallback((seed?: number) => {
    const seedVal =
      (seed !== undefined
        ? seed
        : (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0) >>> 0;
    seedRef.current = seedVal;
    // Native SharedValue writes from JS are asynchronous. Build and publish
    // the entire round on the UI thread before rendering or advancing it.
    runOnUI((seedVal: number) => {
      "worklet";
      running.value = 0;
      const s = CONFIG.cameraZoom;
      const viewW = W / s;
      runSeed.value = seedVal;
      rngState.value = seedVal;

      const first = USE_FIXED_PANEL_COURSE
        ? FIXED_PANEL_PLATFORMS[0]
        : (USE_REFERENCE_COURSE ? referencePlatform(0, W, CONFIG.cameraZoom) : null)
          // OYUN_AKISI-002 (2026-09-22): the starting tower is also rooted to
          // the shared rooftop ground (rootedTopY), not a hardcoded topY: 0 --
          // "Başlangıç platformu ortak çatı zeminine bağlansın."
          // GORSEL-015 iPhone-reddi fix (2026-09-22): was cat:0 (long/wide) --
          // "uzun varyantı başlangıçta kullanma". Switched to cat:1 (medium)
          // so the very first tower's cap sits at a moderate height instead of
          // the long asset's much taller one.
          ?? { id: TEST_START_TOWER, x: 0, topY: 0, width: CONFIG.startTowerWidth, cat: 0, visualType: "normal" as PlatformVisualType };
      const list: any[] = [first];

      // Reference video: character's rest stance sits ~0.53-0.58 of the way
      // across the first tower's width (measured from two frame features,
      // 11-12-55 reference), not 0.42. Centering here (0.5) is a conservative
      // read of that range. See CLAUDE_TAKEOFF_RESULT.md.
      px.value = first.x + first.width * 0.5;
      py.value = first.topY - PH / 2;
      vx.value = 0;
      vy.value = 0;
      charge.value = 0;
      releasedCharge.value = 0;
      visualCharge.value = 0;
      jacketOpen.value = 0;
      jacketPopped.value = 0;
      puffAge.value = 1;
      headTilt.value = 0;
      headVelocity.value = 0;
      landPulse.value = 0;
      if (SEMSIYE_ON) { cancelAnimation(umbOpen); cancelAnimation(umbFlip); umbOpen.value = 0; umbFlip.value = 0; umbArmed.value = 0; }
      baseY.value = first.topY;
      kAmcaX.value = first.x + first.width * 0.55; // kargalar baştan amcaya dönük
      phase.value = PHASE.IDLE;

      if (USE_FIXED_PANEL_COURSE) {
        // GORSEL-017: the entire course for this delivery IS this fixed
        // list -- no procedural spawn-ahead, no infinite generation.
        for (let i = 1; i < FIXED_PANEL_PLATFORMS.length; i++) list.push(FIXED_PANEL_PLATFORMS[i]);
      } else {
        // Pre-generate the whole visible route + buffer so the next towers already
        // exist and are on-screen before the first jump.
        while (
          list[list.length - 1].x + list[list.length - 1].width <
          px.value + viewW + CONFIG.spawnAhead
        ) {
          list.push(makeNextPlatform(list[list.length - 1], TEST_START_TOWER + list.length));
        }
        // Guarantee the starting tower + at least the next TWO upcoming towers,
        // regardless of viewport size, so a run never starts under-populated.
        while (list.length < 3) {
          list.push(makeNextPlatform(list[list.length - 1], TEST_START_TOWER + list.length));
        }
      }
      idCounter.value = TEST_START_TOWER + list.length;
      lastLandedId.value = TEST_START_TOWER;
      standingPlatformId.value = first.id;
      standingPlatformIsChimney.value = first.visualType === "chimney";
      platforms.value = list;
      housePlatformsFrozen.value = list;

      // OYUN_AKISI-002: snap camera to the START fraction (no initial
      // slide) -- distinct from cameraDeadZoneRight, which only governs the
      // ONGOING follow in the frame loop below.
      // GORSEL-017: clamped to >=0 in fixed-panel mode -- panel-01's own art
      // starts at world X=0, so a negative camX would reveal empty sky-only
      // space left of it (measured live: without the clamp this left an
      // 81px blank strip on a 390px screen before the panel began).
      const camXStart = px.value - (CONFIG.cameraStartFraction * W) / s;
      camX.value = USE_FIXED_PANEL_COURSE ? Math.max(0, camXStart) : camXStart;
      // Restart/start is the only time the visible vertical plane can change.
      camYR.value = baseY.value - (CONFIG.cameraPlayerAnchorY * H) / s;
      camXR.value = camX.value;
      running.value = 1;
      runOnJS(setGameReady)(true);
    })(seedVal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [W, H]);

  // Initialise only once real screen dimensions are known, so the starting
  // tower + camera are computed correctly. gameReady gates the first playable
  // frame — no partially initialised state is ever rendered or interactive.
  useEffect(() => {
    if (W > 0 && H > 0 && !gameReady) {
      initWorld();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [W, H, gameReady]);

  // ------------------------------------------------------------------------
  // JS callbacks triggered from the worklet (rare, event-based).
  // ------------------------------------------------------------------------
  const onLanding = useCallback((perfect: number, towersCrossed: number, landedId: number, ratio = 0.5) => {
    const rcL = raceRef.current;
    if (YARIS_ON && rcL && !rcL.ended) pushEvent(rcL.log, raceElapsed(rcL), EV_LAND, landedId, ratio);
    if (DURAK_SEFER) {
      lastTowerRef.current = landedId;
      const before = stopsPassed(landedId - towersCrossed);
      const after = stopsPassed(landedId);
      // GÜZERGÂH 2026-11-16: köprü üstündeyken üstte "Anadolu ●━━○ Avrupa" şeridi.
      const onBridge = bridgeAt(landedId);
      setBridgeStrip(onBridge ? { name: onBridge.bridge.name, from: onBridge.bridge.from, to: onBridge.bridge.side, progress: onBridge.progress } : null);
      if (after > before) {
        // Büyük an = final (Rumeli Feneri): konfeti + çift düdük. Köprüden karşıya varış = kısa kutlama (çift düdük, konfetisiz).
        const finale = after === FINAL_STOP;
        const arrived = bridgeArrivingAt(after);
        const foot = bridgeFromFoot(after);
        const pier = finale || !!arrived;
        let newCard = false;
        if (POSTCARDS_ON && after <= POSTCARDS.length && !unlockedRef.current.includes(after)) {
          newCard = true;
          unlockedRef.current = [...unlockedRef.current, after];
          setUnlocked(unlockedRef.current);
          storage.setItem(POSTCARDS_KEY, JSON.stringify(unlockedRef.current));
          runNewCardsRef.current = [...runNewCardsRef.current, after];
        }
        const card = newCard ? " · 📮 yeni kartpostal" : "";
        if (newCard && !raceRef.current) {
          // KARTPOSTAL v2: oyun durmadan köşede küçük kart belirir (~1,6 sn), dokunma kilidi yok.
          setArrivalCard(after);
          if (arrivalTimer.current) clearTimeout(arrivalTimer.current);
          arrivalTimer.current = setTimeout(() => setArrivalCard(null), 1600);
        }
        const sub = arrived
          ? `${arrived.arrive} ${finale ? "⛴️" : "🌉"}${card}`
          : foot
            ? `Sıradaki: ${foot.name} 🌉${card}`
            : `${after > FINAL_STOP ? "🌙 " : ""}${stopTowerId(after)}. kule${card}`;
        setStopBanner({ key: landedId, title: stopName(after), sub, pier });
        if (stopTimer.current) clearTimeout(stopTimer.current);
        stopTimer.current = setTimeout(() => setStopBanner(null), finale ? 2600 : pier || foot ? 2000 : 1400);
        if (SFX_ON) playSfx("record");
        if (Platform.OS !== "web") {
          if (pier) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        }
        if (pier && SFX_ON) setTimeout(() => playSfx("record"), 650);
        // İSKELE ANI konfetisi artık yalnız finalde (kilim renkleri).
        if (finale && !raceRef.current) setPierFx(landedId); // yarışta konfeti yok
        skyStep.value = withTiming(Math.max(skyStepForStops(after), realSkyRef.current), { duration: 900 });
      }
    }
    const gained =
      towersCrossed * CONFIG.scorePerLanding +
      (towersCrossed > 1 ? towersCrossed * CONFIG.scoreMultiTowerBonus : 0) +
      (perfect ? CONFIG.scorePerfectBonus : 0);
    scoreRef.current += gained;
    setScore(scoreRef.current);
    if (ICSES_ON || LAKAP_ON) {
      const rs = runStatsRef.current;
      noteLanding(rs, ratio, towersCrossed, perfect > 0);
      // Komşu ya da kedi konuşacaksa iç ses susar (video: iki balon üst üste biniyordu).
      if (ICSES_ON && !raceRef.current && !(MAHALLE_ON && sakin(landedId) !== 0)) {
        const line = icSesAfterLanding(rs, ratio, towersCrossed, scoreRef.current, bestRef.current);
        if (line) setTimeout(() => showThought(line), 350);
      }
    }
    if (KARGA_ON) kargaKacirRef.current(landedId, ratio);
    if (MAHALLE_ON && !raceRef.current) {
      const kind = sakin(landedId);
      const list = platforms.value;
      const lp = kind ? platformById(list, landedId) : null;
      if (lp) {
        const r = houseRun(lp, platformById(list, landedId - 1), platformById(list, landedId + 1));
        const g = { p: lp, r, rise: r * HOUSE_HIP_SLOPE, fw: lp.width + 2 * r };
        if (kind === 1) {
          // CUMBA (2026-11-21): yazı yok; teyze başını kaldırıp amcaya bakar ("vay sen misin" pozu).
          if (cumbaBox(g, HOUSE_GUTTER_H, FART_CHAR_H).w > 0) neighborLook.value = landedId;
        } else if (kind !== 2) {
          const b = teyzeBox(g, HOUSE_GUTTER_H, pencereAspect(kind));
          if (MAHALLE_SPEECH_ON) setTimeout(() => showSpeech(pencereLafi(kind, ratio), lp.x - r + b.left + b.w * 0.62, lp.topY + b.top + b.h * 0.3), 250);
        } else {
          const b = kediBox(g, kediGri(landedId) ? KEDI_GRI_ASPECT : KEDI_ASPECT, FART_CHAR_H, HOUSE_GUTTER_H);
          if (b.w > 0) {
            if (!kediGri(landedId)) catWoken.value = landedId;
            // Balon oluğun altında, cephenin üstünde: amcanın ayaklarını ve kediyi örtmesin (video 63. sn).
            if (MAHALLE_SPEECH_ON) setTimeout(() => showSpeech(kediLafi(), lp.x - r + b.left + b.w * 0.2, lp.topY + g.rise + HOUSE_GUTTER_H + 150), 250);
            const name = kediAdi(landedId);
            if (!catsRef.current.includes(name)) {
              catsRef.current = [...catsRef.current, name];
              storage.setItem(KEDI_DEFTER_KEY, catsRef.current.join(","));
              setCats(catsRef.current);
              setTimeout(() => showToast(`🐈 ${name} ile tanıştın! Kedi defteri: ${catsRef.current.length}`), 900);
            }
          }
        }
      }
    }
    if (SFX_ON && towersCrossed > 1) playSfx("multi");
    if (SFX_ON) mahalleSes({ tur: "inis", perfect, ratio, towersCrossed });
    if (BEDEN_ON) {
      // İniş başına tek karar (öncelik: 3+ kule > kıl payı > kusursuz); çoğu inişte tepki yok.
      let k = towersCrossed >= 3 ? 3 : ratio <= 0.12 || ratio >= 0.88 ? 2 : perfect > 0 ? 1 : 0;
      if (BEDEN_TEST) { bedenTest.current = (bedenTest.current % 3) + 1; k = bedenTest.current; }
      if (k > 0) {
        cancelAnimation(tepki);
        tepki.value = k;
        cancelAnimation(tepkiP);
        tepkiP.value = 0;
        tepkiP.value = withTiming(1, { duration: 180, easing: Easing.out(Easing.quad) });
        tepki.value = withDelay(k === 3 ? 1100 : 900, withTiming(0, { duration: 0 }));
      }
    }
    if (perfect && Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    if (REFERENCE_TRIAL ? towersCrossed > 1 : perfect) {
      setLandingLabel(REFERENCE_TRIAL ? `+${gained}` : "PERFECT!");
      setLandingSub(FAZ1_UI && REFERENCE_TRIAL ? multiJumpShout(towersCrossed) : "");
      setPerfectVisible(true);
      if (perfectTimer.current) clearTimeout(perfectTimer.current);
      perfectTimer.current = setTimeout(() => setPerfectVisible(false), FAZ1_UI ? 1000 : 750);
    }
  }, []);

  const onSpecialLaunch = useCallback((mode: number) => {
    // mode 1 = tam kıvam (bonus), 2 = dayanamadı (zorla fırladı)
    if (mode === 1) {
      scoreRef.current += OVER_BONUS;
      setScore(scoreRef.current);
      setLandingLabel("Tam kıvam!");
      setLandingSub(`+${OVER_BONUS} 👌`);
      if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    } else {
      runStatsRef.current.exploded = true;
      setLandingLabel(SPLAT_ON ? "PATLADI!" : "Dayanamadı!");
      setLandingSub(SPLAT_ON ? "💩" : "💨");
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    }
    setPerfectVisible(true);
    if (perfectTimer.current) clearTimeout(perfectTimer.current);
    perfectTimer.current = setTimeout(() => setPerfectVisible(false), 900);
  }, []);

  // KURUKAFA: alınınca tabela + sayaç; her inişte sayaç.
  const [skullHud, setSkullHud] = useState<{ k: number; left: number } | null>(null);
  const onSkull = useCallback((k: number, left: number) => {
    setSkullHud({ k, left });
    setLandingLabel("💀 Kurukafa!");
    setLandingSub(`Kuleler %${Math.round(Math.abs(k - 1) * 100)} ${k > 1 ? "büyüdü 😀" : "küçüldü 😬"} · ${left} zıplama`);
    setPerfectVisible(true);
    if (perfectTimer.current) clearTimeout(perfectTimer.current);
    perfectTimer.current = setTimeout(() => setPerfectVisible(false), 1300);
    if (SFX_ON) playSfx("record");
    if (Platform.OS !== "web") Haptics.notificationAsync(k > 1 ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning).catch(() => {});
  }, []);
  const onSkullTick = useCallback((k: number, left: number) => {
    setSkullHud(left > 0 ? { k, left } : null);
  }, []);

  const onRaceLaunch = useCallback(() => {
    const rc = raceRef.current;
    if (rc && !rc.ended) pushEvent(rc.log, raceElapsed(rc), EV_LAUNCH, lastTowerRef.current);
  }, []);

  const onGameOver = useCallback(() => {
    // HAYALET YARIŞ: düşünce oyun bitmez; koşu kaydedilir, kısa bekleyişten sonra baştan başlanır.
    const rc = raceRef.current;
    if (YARIS_ON && rc) {
      if (rc.ended) return;
      pushEvent(rc.log, raceElapsed(rc), EV_FALL, lastTowerRef.current);
      rc.far = Math.max(rc.far, lastTowerRef.current);
      rc.best = Math.max(rc.best, scoreRef.current);
      rc.runs += 1;
      rc.waiting = true;
      setStopBanner(null);
      setBridgeStrip(null);
      setArrivalCard(null);
      if (KURUKAFA_ON) setSkullHud(null);
      if (SFX_ON && FART_TRIAL) stopFart();
      if (SFX_ON) playSfx("fall");
      if (SFX_ON) mahalleSes({ tur: "oyunSonu", rekor: false }); // yarışta düşüş: panjur (rekor anı yok)
      if (respawnTimer.current) clearTimeout(respawnTimer.current);
      respawnTimer.current = setTimeout(() => {
        const r = raceRef.current;
        if (!r || r.ended) return;
        r.waiting = false;
        pushEvent(r.log, raceElapsed(r), EV_RESPAWN, TEST_START_TOWER);
        restartRef.current();
      }, RESPAWN_MS);
      return;
    }
    if (POSTCARDS_ON) setRunNewCards(runNewCardsRef.current);
    // MEYDAN OKUMA · ARKADAŞ: ilk denemenin skoru maça yazılır ve maç biter (sonuç arkadaşa gider).
    const ch = challengeRef.current;
    if (MEYDAN_ON && ch?.matchID) {
      const id = ch.matchID;
      challengeRef.current = { ...ch, matchID: undefined };
      GameCenter.finishChallenge(id, scoreRef.current, gcNameRef.current);
    }
    if (DURAK_SEFER) {
      const lt = lastTowerRef.current;
      setRunEnd({ lastTower: lt, stops: stopsPassed(lt) });
      setStopBanner(null);
      setBridgeStrip(null);
      setArrivalCard(null);
      if (KURUKAFA_ON) setSkullHud(null);
      if (lt > farthestRef.current && TEST_START_TOWER === 0) { // deneme başlangıcı rekoru kirletmesin
        farthestRef.current = lt;
        recordFlagId.value = lt;
        if (modeRef.current === "daily") {
          dailyRef.current = { ...dailyRef.current, farthest: lt };
          storage.setItem(DAILY_KEY, JSON.stringify(dailyRef.current));
        } else {
          freeFarthestRef.current = lt;
          storage.setItem(FARTHEST_TOWER_KEY, lt);
        }
      }
    }
    if (SFX_ON && FART_TRIAL) stopFart();
    if (SFX_ON) playSfx(scoreRef.current > bestRef.current && scoreRef.current > 0 ? "record" : "fall");
    if (SFX_ON) mahalleSes({ tur: "oyunSonu", rekor: scoreRef.current > bestRef.current && scoreRef.current > 0 });
    if (FAZ1_UI) {
      const prevBest = bestRef.current;
      const sc = scoreRef.current;
      setGoInfo({ prevBest, newRecord: sc > prevBest && sc > 0 });
      setQuip((prev) => pickQuip(quipContext(sc, prevBest), prev));
      const rec = sc > prevBest && sc > 0;
      const stopsNow = DURAK_SEFER ? stopsPassed(lastTowerRef.current) : 0;
      setLakapText(LAKAP_ON ? lakap(runStatsRef.current, sc, stopsNow, rec) : null);
      setRunsDone((n) => n + 1);
      setThought(null);
      if (HANIM_ON && !raceRef.current && !challengeRef.current) {
        const tr = new Date(Date.now() + 3 * 3600 * 1000);
        const w = weatherRef.current;
        const msg = hanimMessage({ score: sc, newRecord: rec, stops: stopsNow, hour: tr.getUTCHours(), minute: tr.getUTCMinutes(),
          weather: w ? w.kind : null, wind: w ? w.wind : null, exploded: runStatsRef.current.exploded, eventLines: eventRef.current?.hanim });
        if (hanimTimer.current) clearTimeout(hanimTimer.current);
        if (msg) {
          hanimTimer.current = setTimeout(() => {
            setHanim(msg);
            if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
            hanimTimer.current = setTimeout(() => setHanim(null), 4200);
          }, 600);
        }
      }
    }
    setGameOver(true);
    // Free-mode runs only: the daily map is a different course every day.
    if (GAME_CENTER_ON && modeRef.current !== "daily") GameCenter.submitScore(scoreRef.current, LEADERBOARD_ID);
    if (FRAME_DIAG) {
      // One read of the UI-thread counters per Game Over (no per-frame JS work).
      const n = dB12.value + dB20.value + dB25.value + dBOver.value;
      const ex = dExamples.value.map((e: any) => `t${e.t} ${e.aPrev}/${e.a}ms kam ${e.camPrev}->${e.cam}px (ort ${e.ema}) krk X ${e.chX} Y ${e.chY}`).join("\n");
      const txt = `R068 ucus ${n} kare: <=12ms ${dB12.value} | 12-20 ${dB20.value} | 20-25 ${dB25.value} | >25 ${dBOver.value}\n` +
        `bekle+sicra ${dHold.value} | kisa->uzun cift ${dShortLong.value}${ex ? "\n" + ex : ""}`;
      setDiagText(txt);
      console.log("[R068-DIAG]", txt);
    }
    if (scoreRef.current > bestRef.current) {
      bestRef.current = scoreRef.current;
      setBest(scoreRef.current);
      if (modeRef.current === "daily") {
        dailyRef.current = { ...dailyRef.current, best: scoreRef.current };
        storage.setItem(DAILY_KEY, JSON.stringify(dailyRef.current));
      } else {
        freeBestRef.current = scoreRef.current;
        storage.setItem(BEST_SCORE_KEY, scoreRef.current);
      }
    }
  }, []);

  useEffect(() => {
    initSfx();
  }, []);

  const pushDebug = useCallback((d: typeof debug) => setDebug(d), []);

  const restart = useCallback(() => {
    if (SPLAT_ON) {
      cancelAnimation(flyT);
      flyT.value = 0;
      dirty.value = 0;
      splat.value = 1;
    }
    lastTowerRef.current = TEST_START_TOWER;
    runStatsRef.current = newRunStats();
    setThought(null);
    setSpeech(null);
    catWoken.value = -1;
    neighborLook.value = -1;
    SAKIN_TOHUM.value = (Math.random() * 2147483647) | 0; // her oyunda başka sakinler (CESIT-SAKIN 14:03 videosu)
    kGone.value = [];
    cancelAnimation(tepki);
    tepki.value = 0;
    cancelAnimation(tepkiP);
    tepkiP.value = 1;
    dusus.value = 0;
    // OSURUK DUMANI (2026-11-23 video 14:39): uçarken düşüp oyun bitince bulutlar hafızada kalıyor, kare döngüsü durduğu
    // için yaşları donuyor ve yeni oyunda havada asılı kalıyordu. Yeni oyunda tüm duman durumu sıfırlanır.
    if (FART_TRIAL) {
      fartOn.value = 0;
      fartPuffs.value = [];
      fartIdx.value = 0;
      fartLastEmit.value = -1e9;
      fartLaunchAt.value = -1;
      fartCut.value = 0;
      fartNow.value = 0;
      if (SFX_ON) stopFart();
    }
    kPool.value = [];
    // Hanım bildirimi yeni koşuya geçerken de süresini doldurur (video: hızlı "Bir daha" onu hiç göstermiyordu).
    runNewCardsRef.current = [];
    setRunNewCards([]);
    setAlbumOpen(false);
    skyStep.value = Math.max(START_SKY, realSkyRef.current);
    setStopBanner(null);
    setBridgeStrip(null);
    setArrivalCard(null);
    if (KURUKAFA_ON) {
      skullVis.value = 0; skullTaken.value = -1; skullOwner.value = -1; effectK.value = 1; effectLeft.value = 0;
      setSkullHud(null);
    }
    if (PIJAMA_ON) {
      cancelAnimation(doorOp); cancelAnimation(doorOpen); cancelAnimation(charOp); cancelAnimation(pajama); cancelAnimation(doorLock); cancelAnimation(walkX); cancelAnimation(walkY);
      if (KIS_ON) winterWear.value = seasonRef.current === "kis" ? 1 : 0;
      if (YAGMUR_ON) rainWear.value = rainingRef.current ? 1 : 0;
      pajama.value = 0; doorOp.value = 0; doorOpen.value = 0; charOp.value = 1; doorLock.value = 0; walkX.value = 0; walkY.value = 0;
    }
    scoreRef.current = 0;
    setScore(0);
    setLastJump(null);
    setGameOver(false);
    setMenuOpen(false);
    setPerfectVisible(false);
    if (YARIS_ON && raceRef.current && !raceRef.current.ended) {
      initWorld(raceRef.current.seed);
    } else if (MEYDAN_ON && challengeRef.current) {
      initWorld(challengeRef.current.seed);
    } else if (DAILY_MAP && modeRef.current === "daily") {
      // Gün değiştiyse günlük kayıt sıfırlanır; harita o günün tohumuyla kurulur.
      const key = todayKey();
      if (dailyRef.current.date !== key) {
        dailyRef.current = { date: key, best: 0, farthest: 0 };
        bestRef.current = 0;
        setBest(0);
        farthestRef.current = 0;
        recordFlagId.value = 0;
      }
      initWorld(dailySeed(key));
    } else {
      initWorld();
    }
  }, [initWorld]);

  restartRef.current = restart;

  // HAYALET YARIŞ: başlat / hayaleti ilerlet / bitir.
  const startRace = useCallback((opts: { seed?: number; ghost?: RaceData | null; oppName?: string; matchID?: string }) => {
    challengeRef.current = null;
    setChallenge(null);
    if (respawnTimer.current) clearTimeout(respawnTimer.current);
    const seed = opts.seed !== undefined ? opts.seed >>> 0 : ((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0);
    raceRef.current = {
      seed, startedAt: Date.now(), pausedAt: 0, pausedTotal: 0, ended: false, waiting: false,
      far: 0, best: 0, runs: 0, log: [], ghost: opts.ghost ?? null, oppName: opts.oppName ?? "", matchID: opts.matchID,
    };
    ghostRef.current = { idx: 0, tower: TEST_START_TOWER, far: 0, falling: false };
    cancelAnimation(gProg);
    gMode.value = 0;
    gFromId.value = TEST_START_TOWER;
    gFromR.value = 0.5;
    gProg.value = 0;
    gOn.value = opts.ghost ? 1 : 0;
    raceLive.value = 1;
    setRaceResult(null);
    setRaceOn(true);
    restart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restart]);

  const advanceGhost = useCallback(() => {
    const rc = raceRef.current;
    if (!rc || rc.ended || !rc.ghost) return;
    const log = rc.ghost.log;
    const g = ghostRef.current;
    const now = raceElapsed(rc);
    const fall = () => {
      g.falling = true;
      gMode.value = 2;
      gProg.value = 0;
      gProg.value = withTiming(1, { duration: 900, easing: Easing.in(Easing.quad) });
    };
    while (g.idx + 3 < log.length && log[g.idx] <= now) {
      const t = log[g.idx], k = log[g.idx + 1], tw = log[g.idx + 2], r = log[g.idx + 3] / 1000;
      const n = g.idx + 4 + 3 < log.length ? g.idx + 4 : -1;
      if (k === EV_LAUNCH) {
        const nk = n >= 0 ? log[n + 1] : -1;
        const nt = n >= 0 ? log[n] : t + 600;
        if (nk === EV_FALL) {
          fall();
        } else {
          if (nk === EV_LAND) { gToId.value = log[n + 2]; gToR.value = log[n + 3] / 1000; }
          else { gToId.value = gFromId.value; gToR.value = gFromR.value; } // aynı kulede küçük sıçrama
          gMode.value = 1;
          gProg.value = 0;
          gProg.value = withTiming(1, { duration: Math.max(120, Math.min(nk === EV_LAND ? 2500 : 450, nt - t)), easing: Easing.linear });
        }
      } else if (k === EV_LAND) {
        cancelAnimation(gProg);
        gFromId.value = tw;
        gFromR.value = r;
        gMode.value = 0;
        gProg.value = 0;
        g.falling = false;
        g.tower = tw;
        g.far = Math.max(g.far, tw);
      } else if (k === EV_FALL) {
        if (!g.falling) fall();
      } else if (k === EV_RESPAWN) {
        cancelAnimation(gProg);
        gFromId.value = TEST_START_TOWER;
        gFromR.value = 0.5;
        gMode.value = 0;
        gProg.value = 0;
        g.falling = false;
        g.tower = TEST_START_TOWER;
      }
      g.idx += 4;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const endRace = useCallback(() => {
    const rc = raceRef.current;
    if (!rc || rc.ended) return;
    rc.ended = true;
    if (respawnTimer.current) clearTimeout(respawnTimer.current);
    runOnUI(() => {
      "worklet";
      running.value = 0;
      raceLive.value = 0;
    })();
    if (!rc.waiting) {
      // süre bittiğinde süren koşu da sayılır
      rc.far = Math.max(rc.far, lastTowerRef.current);
      rc.best = Math.max(rc.best, scoreRef.current);
      rc.runs += 1;
    }
    cancelAnimation(gProg);
    gOn.value = 0;
    const me: RaceSummary = { far: rc.far, best: rc.best, runs: rc.runs };
    const opp: RaceSummary | null = rc.ghost ? { far: rc.ghost.far, best: rc.ghost.best, runs: rc.ghost.runs } : null;
    const race = encodeRace(me, rc.log);
    if (rc.matchID && opp) {
      GameCenter.finishChallengeRace(rc.matchID, me.far, gcNameRef.current, race, compareRace(me, opp));
    }
    setStopBanner(null);
    setBridgeStrip(null);
    setArrivalCard(null);
    if (KURUKAFA_ON) setSkullHud(null);
    if (SFX_ON && FART_TRIAL) stopFart();
    if (SFX_ON) playSfx("record");
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setRaceOn(false);
    setRaceResult({ me, opp, oppName: rc.oppName, seed: rc.seed, race });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeRace = useCallback(() => {
    raceRef.current = null;
    setRaceResult(null);
    restart();
  }, [restart]);

  // Kullanıcı: "2 dakikalık oyundan çıkmak istediğimde çıkış yapamıyorum" -> yarıştan çık (sonuç gönderilmez).
  const quitRace = useCallback(() => {
    const rc = raceRef.current;
    if (rc) rc.ended = true;
    if (respawnTimer.current) clearTimeout(respawnTimer.current);
    runOnUI(() => {
      "worklet";
      raceLive.value = 0;
    })();
    cancelAnimation(gProg);
    gOn.value = 0;
    setStopBanner(null);
    setBridgeStrip(null);
    setArrivalCard(null);
    if (KURUKAFA_ON) setSkullHud(null);
    if (SFX_ON && FART_TRIAL) stopFart();
    setRaceOn(false);
    closeRace();
    setMenuOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeRace]);

  const askQuitRace = useCallback(() => {
    const rc = raceRef.current;
    if (!rc || rc.ended) return;
    // Soru açıkken saat durur; "Devam et" ile kaldığı yerden sürer.
    if (!rc.pausedAt) rc.pausedAt = Date.now();
    const resume = () => {
      const r = raceRef.current;
      if (r && r.pausedAt) { r.pausedTotal += Date.now() - r.pausedAt; r.pausedAt = 0; }
    };
    Alert.alert(
      "Yarıştan çıkılsın mı?",
      rc.matchID ? "Yarış yarıda kalır, arkadaşına sonuç gitmez." : "Bu yarış sayılmaz.",
      [
        { text: "Devam et", style: "cancel", onPress: resume },
        { text: "Çık", style: "destructive", onPress: quitRace },
      ],
      { cancelable: true, onDismiss: resume },
    );
  }, [quitRace]);

  // Uygulama arka plandayken yarış saati durur.
  useEffect(() => {
    const sub = AppState.addEventListener("change", (st) => {
      const rc = raceRef.current;
      if (!rc || rc.ended) return;
      if (st !== "active") {
        if (!rc.pausedAt) rc.pausedAt = Date.now();
      } else if (rc.pausedAt) {
        rc.pausedTotal += Date.now() - rc.pausedAt;
        rc.pausedAt = 0;
      }
    });
    return () => sub.remove();
  }, []);

  // MEYDAN OKUMA: bu koşunun kodunu paylaş / kod gir / serbest oyuna dön.
  const shareChallenge = useCallback(() => {
    const code = makeCode(seedRef.current, scoreRef.current);
    Share.share({ message: shareText(code, scoreRef.current, gcPlayer?.displayName ?? "") }).catch(() => {});
  }, [gcPlayer]);
  const startChallenge = useCallback(() => {
    const parsed = parseCode(codeText);
    if (!parsed) { setCodeError("Kod okunamadı. Örnek: 1K9Z0QX-37"); return; }
    const c: Challenge = { seed: parsed.seed, target: parsed.target, from: "" };
    challengeRef.current = c;
    setChallenge(c);
    setCodeOpen(false);
    setCodeError("");
    setCodeText("");
    restart();
  }, [codeText, restart]);
  const playIncoming = useCallback((c: GameCenter.FriendChallenge) => {
    const ghost = YARIS_ON ? decodeRace(c.race) : null;
    if (ghost) {
      setIncoming((list) => list.filter((x) => x.matchID !== c.matchID));
      startRace({ seed: c.seed >>> 0, ghost, oppName: c.from, matchID: c.matchID });
      return;
    }
    const ch: Challenge = { seed: c.seed >>> 0, target: c.score, from: c.from, matchID: c.matchID };
    challengeRef.current = ch;
    setChallenge(ch);
    setIncoming((list) => list.filter((x) => x.matchID !== c.matchID));
    restart();
  }, [restart, startRace]);
  // Kullanıcı: "meydan okumada direk arkadaş listesi açılmalı" -> kendi arkadaş listemiz.
  const askChallenge = useCallback(async () => {
    setFriendSheet(true);
    setFriendsMsg("Arkadaşların yükleniyor…");
    setFriends([]);
    let p = gcPlayer;
    if (!p?.authenticated) { p = await GameCenter.authenticate(); setGcPlayer(p); }
    if (!p.authenticated) { setFriendsMsg("Arkadaşlarını görmek için Game Center'a gir."); return; }
    const r = await GameCenter.loadFriends(LEADERBOARD_ID);
    if (r.status !== "ok") { setFriendsMsg(r.status === "error" ? "Arkadaş listesi açılamadı. Ayarlar'dan Game Center arkadaş izni verilmiş mi?" : "Arkadaş listesi açılamadı."); return; }
    setFriends(r.friends);
    setFriendsMsg(r.friends.length ? null : "Game Center'da henüz arkadaşın yok. Kodu paylaşarak meydan okuyabilirsin.");
  }, [gcPlayer]);
  const sendToFriend = useCallback(async (f: GameCenter.GameCenterFriend) => {
    setSendingTo(f.id);
    const rr = sheetMode === "race" ? raceResult : null;
    const r = rr
      ? await GameCenter.challengePlayer(f.id, rr.seed, rr.me.far, gcNameRef.current, rr.race)
      : await GameCenter.challengePlayer(f.id, seedRef.current, scoreRef.current, gcNameRef.current);
    setSendingTo(null);
    if (r.status === "sent") { setFriendSheet(false); showToast(rr ? `🏁 ${f.alias || f.name} kişisine meydan okundu!` : `⚔️ ${f.alias || f.name} kişisine meydan okundu!`); }
    else showToast("Gönderilemedi: " + (r.message ?? ""));
  }, [showToast, sheetMode, raceResult]);

  // MEYDAN OKUMA = 2 DK YARIŞ (2026-11-18, kullanıcı: "2 dakkalık oyunu kaldırıp meydan okumanın içine yerleştirelim").
  // Meydan oku: 2 dakikalık sefer başlar; bitince "Arkadaşına gönder" ile arkadaş senin hayaletinle yarışır.
  const startMeydan = useCallback(() => {
    startRace({});
    showToast("⚔️ Meydan okuma: 2 dakikada en uzak kuleye git, sonra arkadaşına gönder!");
  }, [startRace, showToast]);

  const leaveChallenge = useCallback(() => {
    challengeRef.current = null;
    setChallenge(null);
    restart();
  }, [restart]);

  const switchMode = useCallback((next: "free" | "daily") => {
    modeRef.current = next;
    setMode(next);
    if (next === "daily") {
      const key = todayKey();
      if (dailyRef.current.date !== key) dailyRef.current = { date: key, best: 0, farthest: 0 };
      bestRef.current = dailyRef.current.best;
      setBest(dailyRef.current.best);
      farthestRef.current = dailyRef.current.farthest;
      recordFlagId.value = dailyRef.current.farthest;
    } else {
      bestRef.current = freeBestRef.current;
      setBest(freeBestRef.current);
      farthestRef.current = freeFarthestRef.current;
      recordFlagId.value = freeFarthestRef.current;
    }
    restart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restart]);

  // ------------------------------------------------------------------------
  // Raw responder events avoid Pressability's 130ms minimum press duration.
  // Use native event timestamps so JS/UI queue delays do not add jump power.
  // ------------------------------------------------------------------------
  const onPressIn = useCallback((event: GestureResponderEvent) => {
    const timestamp = event.nativeEvent.timestamp;
    runOnUI((startedAt: number) => {
      "worklet";
      // 2026-09-22 device-rejection fix (item C): unconditional, before the
      // early-return below -- guarantees ANY touch-down clears a stuck DEV
      // pose freeze (see the poseOverride declaration above), even one from
      // a no-op tap while not IDLE.
      poseOverride.value = -1;
      if (running.value !== 1 || phase.value !== PHASE.IDLE) return;
      if (doorLock.value === 1) return; // PİJAMA ANI: kapı animasyonu sürerken şarj başlamaz
      touchStartedAt.value = startedAt;
      charge.value = 0;
      firstChargeFrameSeen.value = 0;
      jacketOpen.value = withSpring(0, { damping: 19, stiffness: 220, mass: 0.7 });
      jacketPopped.value = 0;
      puffAge.value = 1;
      phase.value = PHASE.CHARGING;
      if (SFX_ON) runOnJS(playSfx)("charge");
    })(timestamp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // mode: 0 normal, 1 tam kıvam, 2 dayanamadı (zorla). Hem parmak kalkınca hem
  // pencere dolunca kare döngüsünden çağrılır.
  // KARLI AMCA: kar yağarken beklerken birikir, yağmıyorsa erir; soğukta burun kızarır, arada nefes buharı.
  const umbModeNow = ISTANBUL_ON ? umbrellaMode(shownWeather) : 0;
  useEffect(() => {
    umbMode.value = umbModeNow;
    umbVis.value = umbModeNow > 0 ? 1 : 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [umbModeNow]);
  // GEÇİCİ (SEMSIYE_TEST): beklerken kapalı -> açık -> yarı ters -> tam ters döngüsü, ekran görüntüsü için.
  useEffect(() => {
    if (!SEMSIYE_TEST) return;
    let k = 0;
    const id = setInterval(() => {
      k = (k + 1) % 4;
      runOnUI((step: number) => {
        "worklet";
        if (phase.value !== PHASE.IDLE) return;
        umbOpen.value = step === 0 ? 0 : 1;
        umbFlip.value = step === 3 ? 1 : step === 2 ? 0.45 : 0;
      })(k);
    }, 2500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const snowingNow = KIS_ON && ISTANBUL_ON && shownWeather?.kind === "kar";
  const coldNow = KIS_ON && (season === "kis" || snowingNow);
  // KEDİ ÜŞÜYOR (2026-11-24, kullanıcı: "kediler ile ilgili işler yapılmamış ... tutarsızlıklar olmasın"): kış
  // görselinde fark az kaldı -> kar/karsız kışta kısa titreme nöbetleri ve burnundan nefes buharı (yalnız görsel).
  const kediUsur = MAHALLE_ON && (roofWx === "kar" || (roofWx !== "yagmur" && cepheHal === "kis"));
  const kediTitre = useSharedValue(0);
  const kediNefes = useSharedValue(0);
  useEffect(() => {
    cancelAnimation(kediTitre); cancelAnimation(kediNefes);
    kediTitre.value = 0; kediNefes.value = 0;
    if (!kediUsur) return;
    const t = (v: number) => withTiming(v, { duration: 60 });
    kediTitre.value = withRepeat(withSequence(t(1), t(-1), t(1), t(-1), t(1), t(-1), t(0), withTiming(0, { duration: 1700 })), -1, false);
    kediNefes.value = withRepeat(withSequence(withTiming(1, { duration: 1100, easing: Easing.out(Easing.quad) }), withTiming(0, { duration: 0 }), withTiming(0, { duration: 1500 })), -1, false);
  }, [kediUsur]);
  useEffect(() => {
    if (!KIS_ON) return;
    snowingSV.value = snowingNow ? 1 : 0;
    coldSV.value = coldNow ? 1 : 0;
    let n = 0;
    const snowingF = snowingNow ? 1 : 0;
    const coldF = coldNow ? 1 : 0;
    // Okuma-yazma UI thread'inde (kalkış/iniş de orada değiştiriyor; JS tarafı okuması bayat kalabiliyor).
    const tickUI = (puff: number) => {
      "worklet";
      const air = phase.value === PHASE.AIRBORNE;
      const s1 = Math.max(0, Math.min(1, snowAmt.value + (snowingF ? (air ? 0 : 0.02) : -0.03)));
      snowAmt.value = s1;
      noseRed.value = Math.max(0, Math.min(1, noseRed.value + (coldF ? 0.02 : -0.04)));
      if (puff && coldF && !air && phase.value !== PHASE.CHARGING) {
        breath.value = 0;
        breath.value = withTiming(1, { duration: 900 });
      }
    };
    const id = setInterval(() => {
      n += 1;
      runOnUI(tickUI)(n % 6 === 0 ? 1 : 0);
    }, 500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snowingNow, coldNow]);

  const doLaunch = (endedAt: number, mode: number) => {
    "worklet";
    if (KIS_ON) {
      // Silkelenme: biriken karın çoğu kalkışta dökülür, taneler arkada savrulur; soğuksa "hıh!" buharı.
      if (snowAmt.value > 0.08) {
        shedAmt.value = snowAmt.value;
        shedX.value = px.value + SOLE_CENTER_OFFSET;
        shedY.value = py.value + PH / 2 - FART_CHAR_H * 0.92;
        shed.value = 0;
        shed.value = withTiming(1, { duration: 800 });
      }
      snowAmt.value = snowAmt.value * 0.35;
      if (coldSV.value > 0) { breath.value = 0; breath.value = withTiming(1, { duration: 700 }); }
    }
    {
      const heldSeconds = Math.max(0, endedAt - touchStartedAt.value) / 1000;
      const c = mode === 2 ? 1 : Math.min(1, heldSeconds / CONFIG.maxChargeDuration);
      const launch = jumpVelocity(c, W);
      // Diagnostic snapshot (see CLAUDE_CHARGE_TIMING_RESULT.md): charge.value
      // BEFORE it is reset below is what the player was actually looking at
      // this instant; pressToFirstFrameMs is how long press-processing took
      // to reach the frame loop's first CHARGING tick.
      const lastVisualCharge = charge.value;
      const pressToFirstFrameMs = firstChargeFrameSeen.value === 1 ? firstChargeFrameTs.value - touchStartedAt.value : -1;
      if (__DEV__) runOnJS(reportJump)(heldSeconds * 1000, c, launch.vx, launch.vy, W, lastLandedId.value, lastVisualCharge, pressToFirstFrameMs);
      vx.value = launch.vx;
      vy.value = launch.vy;
      if (SEMSIYE_ON) { cancelAnimation(umbOpen); umbOpen.value = 0; umbFlip.value = 0; umbArmed.value = 0; umbV0.value = Math.max(1, Math.abs(launch.vy)); }
      headVelocity.value = -65 - c * 55;
      releasedCharge.value = c;
      dusus.value = 0;
      phase.value = PHASE.AIRBORNE;
      charge.value = 0;
      if (SFX_ON) runOnJS(stopSfx)("charge");
      if (FART_TRIAL) {
        fartOn.value = 1;
        fartLaunchAt.value = -1;
        fartSize.value = mode === 2 ? 2.2 : 0.6 + 0.8 * c;
        if (SFX_ON) runOnJS(playFart)(c);
      }
      overT.value = -1;
      if (SPLAT_ON && mode === 2) {
        splatX.value = px.value + FART_FEET_DX;
        splatY.value = py.value + PH / 2 - FART_CHAR_H * 0.35;
        splat.value = 0;
        splat.value = withTiming(1, { duration: 750, easing: Easing.out(Easing.quad) });
        if (dirty.value === 0) {
          dirty.value = 1;
          flyT.value = 0;
          flyT.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.linear }), -1, false);
        }
      }
      if (mode > 0) runOnJS(onSpecialLaunch)(mode);
      if (raceLive.value === 1) runOnJS(onRaceLaunch)();
      // Defense in depth alongside onPressIn above: also clear right at
      // launch, so the pose is guaranteed to track real charge/idle for the
      // jump that is about to play out, regardless of anything set earlier.
      poseOverride.value = -1;
    }
  };

  const onPressOut = useCallback((event: GestureResponderEvent) => {
    const timestamp = event.nativeEvent.timestamp;
    runOnUI((endedAt: number) => {
      "worklet";
      if (running.value !== 1 || phase.value !== PHASE.CHARGING) return;
      let mode = 0;
      if (OVERCHARGE) {
        const k = (endedAt - touchStartedAt.value - CONFIG.maxChargeDuration * 1000) / OVER_WINDOW_MS;
        if (k >= SWEET_FROM && k < 1) mode = 1;
      }
      doLaunch(endedAt, mode);
    })(timestamp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [W, reportJump, onSpecialLaunch]);

  const cancelCharge = useCallback(() => {
    runOnUI(() => {
      "worklet";
      if (phase.value !== PHASE.CHARGING) return;
      phase.value = PHASE.IDLE;
      overT.value = -1;
      if (SFX_ON) runOnJS(stopSfx)("charge");
      charge.value = 0;
      releasedCharge.value = 0;
      visualCharge.value = 0;
      poseOverride.value = -1;
      jacketOpen.value = withSpring(0, { damping: 19, stiffness: 220, mass: 0.7 });
      jacketPopped.value = 0;
      puffAge.value = 1;
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------------------------------------
  // THE GAME LOOP — runs on the UI thread every frame (~60fps).
  // ------------------------------------------------------------------------
  useFrameCallback((frame) => {
    "worklet";
    if (running.value !== 1) return;

    let dt = (frame.timeSincePreviousFrame ?? 16.7) / 1000;
    if (dt > 1 / 30) dt = 1 / 30; // clamp big hitches so physics stays stable
    if (dt <= 0) return;

    if (PERF_PROBE) {
      const raw = frame.timeSincePreviousFrame ?? 16.7;
      // close the previous frame: did its airborne list change write any house?
      if (pListPending.value === 1) {
        if (pHouseFrame.value !== pFrames.value) pListNoHouse.value += 1;
        pListPending.value = 0;
      }
      pFrames.value += 1;
      const air = phase.value === PHASE.AIRBORNE;
      if (air) pAirFrames.value += 1;
      if (raw > 25) {
        pHitch.value += 1;
        if (air) pAirHitch.value += 1;
        else if (phase.value === PHASE.IDLE) pHitchIdle.value += 1;
        else if (phase.value === PHASE.CHARGING) pHitchCharge.value += 1;
        else pHitchDead.value += 1;
        if (pFrames.value - pListFrame.value <= 1) pHitchNearList.value += 1;
        if (air) {
          if (pFrames.value - pHouseFrame.value <= 1) {
            const k = pHouseKind.value;
            if (k & 1) pHitchAppear.value += 1;
            else if (k & 2) pHitchGone.value += 1;
            else pHitchMove.value += 1;
          } else if (pFrames.value - pListFrame.value <= 1) pHitchListOnly.value += 1;
          else pHitchNoEvent.value += 1;
        }
      }
      if (raw > 40) pHitchBig.value += 1;
      if (raw > pMaxMs.value) pMaxMs.value = raw;
    }

    if (DEBUG_MODE) {
      const rawMs = frame.timeSincePreviousFrame ?? 16.7;
      frameTimes.value[frameTimeIdx.value % FRAME_HISTORY_LEN] = rawMs;
      frameTimeIdx.value += 1;
      if (rawMs > 25) droppedFrames.value += 1;
    }

    // Visual damped spring, integrated in small steps; never feeds game physics.
    let angle = headTilt.value;
    let angularVelocity = headVelocity.value;
    for (let step = 0; step < 4; step++) {
      const h = dt / 4;
      angularVelocity += (-100 * angle - 8 * angularVelocity) * h;
      angle += angularVelocity * h;
    }
    headTilt.value = Math.max(-12, Math.min(12, angle));
    headVelocity.value = angularVelocity;

    fps.value = fps.value * 0.9 + (1 / dt) * 0.1;
    const list = platforms.value;

    // --- charge ---
    // Recomputed fresh from timestamps every frame instead of accumulating a
    // per-frame delta. This removes drift AND the charge-start boundary
    // question entirely: there is no "which side of press-down does this
    // interval belong to" ambiguity when there is no interval being
    // accumulated in the first place, only a direct elapsed-time readout.
    //
    // frame.timestamp (Reanimated, from CADisplayLink.targetTimestamp * 1000
    // -- see node_modules/react-native-reanimated/apple/reanimated/apple/
    // native/PlatformDepMethodsHolderImpl.mm) and touchStartedAt.value (from
    // event.nativeEvent.timestamp, i.e. UITouch.timestamp * 1000 -- see
    // node_modules/react-native/React/Base/RCTTouchHandler.m) are VERIFIED
    // to share the same clock on iOS: both are CACurrentMediaTime-based
    // seconds converted to ms with the same *1000. Subtracting them directly
    // is therefore safe. (Android uses a different native path and has not
    // been verified the same way.) See CLAUDE_CHARGE_TIMING_RESULT.md.
    if (phase.value === PHASE.CHARGING) {
      if (firstChargeFrameSeen.value === 0) {
        firstChargeFrameSeen.value = 1;
        firstChargeFrameTs.value = frame.timestamp; // diagnostic only, see onPressOut
      }
      const heldMs = frame.timestamp - touchStartedAt.value;
      charge.value = Math.min(1, Math.max(0, heldMs / 1000 / CONFIG.maxChargeDuration));
      if (OVERCHARGE) {
        const k = (heldMs - CONFIG.maxChargeDuration * 1000) / OVER_WINDOW_MS;
        if (k >= 1) doLaunch(frame.timestamp, 2);
        else overT.value = k >= 0 ? k : -1;
      }
    }

    if (puffAge.value < 1) puffAge.value = Math.min(1, puffAge.value + dt);
    if (phase.value === PHASE.CHARGING && charge.value >= 1 && jacketPopped.value === 0) {
      jacketPopped.value = 1;
      puffAge.value = 0;
      jacketOpen.value = withSpring(1, { damping: 15, stiffness: 240, mass: 0.7 });
    }

    // GAZ trial clock: ticks only while a puff can still be on screen.
    if (FART_TRIAL && frame.timestamp - fartLastEmit.value < FART_LIFE + 300) fartNow.value = frame.timestamp;

    // KURUKAFA: ileride alınmamış ilk kurukafayı göster.
    if (KURUKAFA_ON) {
      let found = 0;
      // Kullanıcı 2026-11-22: bir kurukafanın etkisi bitmeden yenisi görünmesin (alınamaz da).
      if (effectLeft.value <= 0) for (let i = 0; i < list.length; i++) {
        const q = list[i];
        if (q.skull && q.id > lastLandedId.value && q.id !== skullTaken.value) {
          skullX.value = q.skull.x;
          skullY.value = q.skull.y;
          skullOwner.value = q.id;
          found = 1;
          break;
        }
      }
      skullVis.value = found;
    }

    // --- airborne physics ---
    if (phase.value === PHASE.AIRBORNE) {
      const prevX = px.value;
      const prevBottom = py.value + PH / 2;
      const flight = advanceFlight(px.value, py.value, vx.value, vy.value, dt, W);
      px.value = flight.x;
      py.value = flight.y;
      vy.value = flight.vy;
      // ŞEMSİYE: düşüşe geçince "pat" diye açılır (hafif yağmurda düşüşün ikinci yarısında); hızlandıkça kumaş ters döner.
      if (SEMSIYE_ON && umbMode.value > 0 && vy.value > 0) {
        const fall = vy.value / umbV0.value; // 0 = tepe, ~1 = kalkış hızına ulaştı
        if (umbArmed.value === 0 && (umbMode.value === 1 || fall > 0.45)) {
          umbArmed.value = 1;
          umbOpen.value = withSequence(withTiming(1.12, { duration: 90 }), withTiming(1, { duration: 60 }));
        }
        if (umbArmed.value === 1) umbFlip.value = Math.max(0, Math.min(1, (fall - 0.45) / 0.9));
      }
      if (FART_TRIAL && fartOn.value === 1) {
        const now = frame.timestamp;
        if (fartLaunchAt.value < 0) fartLaunchAt.value = now;
        const gap = now - fartLaunchAt.value < 160 ? 55 : 105;
        if (now - fartLastEmit.value >= gap) {
          fartLastEmit.value = now;
          fartNow.value = now;
          const slot = fartIdx.value % FART_N;
          fartIdx.value = slot + 1;
          const arr = fartPuffs.value.slice();
          const first = now === fartLaunchAt.value;
          arr[slot] = { x: px.value + FART_FEET_DX - FART_BACK, y: py.value + PH / 2 - FART_HIP, b: now, s: fartSize.value * (first ? 1.5 : 1) };
          fartPuffs.value = arr;
        }
      }
      const newBottom = py.value + PH / 2;

      // KURUKAFA: uçarken değerse al (yalnız görüntü/etki; yörünge değişmez).
      if (KURUKAFA_ON && skullVis.value === 1) {
        // Amcanın çizilen gövdesi: ayak çizgisinden FART_CHAR_H yukarı, gövde genişliği kadar.
        const feetY = py.value + PH / 2;
        const bodyCx = px.value + SOLE_CENTER_OFFSET;
        if (skullTouches(skullX.value, skullY.value, SKULL_SIZE * SKULL_HIT_R, bodyCx - CHAR_BODY_HALF_W, feetY - FART_CHAR_H, bodyCx + CHAR_BODY_HALF_W, feetY)) {
          skullTaken.value = skullOwner.value;
          skullVis.value = 0;
          const fx = rollSkullEffect(runSeed.value, skullOwner.value);
          effectK.value = fx.k;
          effectLeft.value = fx.jumps;
          runOnJS(onSkull)(fx.k, fx.jumps);
        }
      }

      if (vy.value > 0) {
        const landList = KURUKAFA_ON && effectLeft.value > 0 ? scaledPlatforms(list, effectK.value) : list;
        const contact = findFootLanding(landList, prevX, px.value, prevBottom, newBottom, CHARACTER_WIDTH * 0.8);
        if (contact) {
          const p = list[contact.index];
          const cx = contact.x;
          px.value = cx;
          // fair landing
          py.value = p.topY - PH / 2;
          vx.value = 0;
          headVelocity.value = Math.min(150, 45 + Math.abs(vy.value) * 0.06);
          vy.value = 0;
          baseY.value = p.topY;
          // Visual-only, unconditional on every successful landing (unlike
          // the score-only lastLandedId gate a few lines below). Anchored to
          // the actual resolved landing x (cx), not the platform's center,
          // so the cloud tracks an off-center landing and wraps the
          // character where they actually stand.
          standingPlatformId.value = p.id;
          standingPlatformIsChimney.value = p.visualType === "chimney";
          jacketOpen.value = withSpring(0, { damping: 19, stiffness: 220, mass: 0.7 });
          releasedCharge.value = 0;
          phase.value = PHASE.IDLE;
          // GORSEL-017 (2026-09-23): visual-only landing squash. landPulse
          // drives a cosmetic scaleY/scaleX on the character sprite ONLY
          // (see ChargePoses.tsx) -- py.value/vx/vy, the resolved landing
          // point (cx/p.topY above) and the next jump's distance are all
          // already fully committed by this point in the frame, so this
          // cannot feed back into physics. 1 = max compression, negative =
          // the "hafif yukarı toparlanma" (slight upward overshoot) before
          // settling back to 0. Total duration 35+75+80=190ms, inside the
          // requested 150-200ms window.
          // FAZ2 sound: every landing contact says "tak" (also short hops on
          // the same tower, which score nothing and used to be silent).
          if (SFX_ON) runOnJS(playSfx)("land");
          if (FART_TRIAL && fartOn.value === 1) {
            fartOn.value = 0;
            fartCut.value = frame.timestamp;
            if (SFX_ON) runOnJS(stopFart)();
          }
          if (SEMSIYE_ON && umbArmed.value === 1) {
            umbArmed.value = 0;
            umbFlip.value = withTiming(0, { duration: 120 });
            umbOpen.value = withDelay(300, withTiming(0, { duration: 160 }));
          }
          landPulse.value = withSequence(
            withTiming(1, { duration: 35 }),
            withTiming(-0.2, { duration: 75 }),
            withTiming(0, { duration: 80 }),
          );
          const offset = cx - (p.x + p.width / 2);
          lastOffset.value = offset;
          const perfect = Math.abs(offset) <= CONFIG.perfectTolerance ? 1 : 0;
          // Score only the first time we reach a new (higher id) platform.
          if (p.id > lastLandedId.value) {
            const towersCrossed = p.id - lastLandedId.value;
            lastLandedId.value = p.id;
            if (KIS_ON && snowingSV.value > 0) snowAmt.value = Math.min(1, snowAmt.value + 0.06);
            if (FAZ2_DUST) {
              dustX.value = cx;
              dustY.value = p.topY;
              dust.value = 0;
              dust.value = withTiming(1, { duration: 420 });
            }
            if (perfect) {
              burstX.value = cx;
              burstY.value = p.topY;
              burst.value = 0;
              burst.value = withTiming(1, { duration: 620 });
            }
            // PİJAMA ANI: gecenin başladığı ilk iniş (Ortaköy). Yalnız çizim; fizik aynı.
            if (PIJAMA_ON && DURAK_SEFER && pajama.value === 0 && stopsPassed(p.id - towersCrossed) < (PIJAMA_TEST_EARLY ? 1 : NIGHT_STOP) && stopsPassed(p.id) >= (PIJAMA_TEST_EARLY ? 1 : NIGHT_STOP)) {
              // HAYALET YARIŞ: kullanıcı "pijama giymesi değiştirilmemeli, ikisi için de aynı süre geçecek" -> kapı anı yarışta da aynı.
              doorLock.value = 1;
              const doorCx = p.x + p.width / 2; // kapı kulenin ortasında
              const dx = doorCx - px.value;
              doorX.value = doorCx;
              doorBottom.value = p.topY + DOOR_H * DOOR_SINK;
              doorOpen.value = 0;
              const M = DOOR_MS;
              doorOp.value = withSequence(withTiming(1, { duration: M.appear }), withDelay(M.doorOut[0] - M.appear, withTiming(0, { duration: M.doorOut[1] - M.doorOut[0] })));
              doorOpen.value = withDelay(M.open, withTiming(1, { duration: 80 }));
              // 2 adımla kapıya, sonra 2 adımla indiği yere: x kayar, her adımda hafif sıçrama.
              walkX.value = 0;
              walkX.value = withSequence(
                withDelay(M.walkIn[0], withTiming(dx, { duration: M.walkIn[1] - M.walkIn[0], easing: Easing.inOut(Easing.quad) })),
                withDelay(M.walkOut[0] - M.walkIn[1], withTiming(0, { duration: M.walkOut[1] - M.walkOut[0], easing: Easing.inOut(Easing.quad) })),
              );
              const half = (M.walkIn[1] - M.walkIn[0]) / 4;
              const halfOut = (M.walkOut[1] - M.walkOut[0]) / 4;
              walkY.value = 0;
              walkY.value = withSequence(
                withDelay(M.walkIn[0], withTiming(-STEP_LIFT, { duration: half })), withTiming(0, { duration: half }),
                withTiming(-STEP_LIFT, { duration: half }), withTiming(0, { duration: half }),
                withDelay(M.walkOut[0] - M.walkIn[1], withTiming(-STEP_LIFT, { duration: halfOut })), withTiming(0, { duration: halfOut }),
                withTiming(-STEP_LIFT, { duration: halfOut }), withTiming(0, { duration: halfOut }),
              );
              charOp.value = withSequence(
                withDelay(M.charOut[0], withTiming(0, { duration: M.charOut[1] - M.charOut[0] })),
                withDelay(M.charIn[0] - M.charOut[1], withTiming(1, { duration: M.charIn[1] - M.charIn[0] })),
              );
              pajama.value = withDelay(M.swap, withTiming(1, { duration: 0 }));
              if (SPLAT_ON) dirty.value = withDelay(M.swap, withTiming(0, { duration: 0 })); // temiz pijama
              doorLock.value = withDelay(M.unlock, withTiming(0, { duration: 0 }));
            }
            if (KURUKAFA_ON && effectLeft.value > 0) {
              effectLeft.value -= 1;
              if (effectLeft.value === 0) effectK.value = 1;
              runOnJS(onSkullTick)(effectK.value, effectLeft.value);
            }
            runOnJS(onLanding)(perfect, towersCrossed, p.id, (cx - p.x) / p.width);
          }
        }
      }

      // DÜŞÜŞ (yalnız görüntü): ayak, inişin kullandığı listedeki tüm yüzeylerin altına indiyse düşüş kesin → çırpınma.
      if (DUSUS_ON && phase.value === PHASE.AIRBORNE) {
        if (dusus.value === 0) {
          const ll = KURUKAFA_ON && effectLeft.value > 0 ? scaledPlatforms(list, effectK.value) : list;
          if (dususKesin(vy.value, py.value + PH / 2, ll)) { dusus.value = 1; dususAt.value = frame.timestamp; }
        } else {
          const kare = 1 + (Math.floor((frame.timestamp - dususAt.value) / DUSUS_KARE_MS) % 2);
          if (kare !== dusus.value) dusus.value = kare;
        }
      }

      // --- fall -> game over ---
      // End a missed jump after the player has left the VISIBLE fixed-Y
      // camera, not after crossing the now-independent physics camera.
      if ((py.value - camYR.value) * CONFIG.cameraZoom > H + 60) {
        phase.value = PHASE.DEAD;
        running.value = 0;
        runOnJS(onGameOver)();
      }
    }

    // Charge remains immediate; only recovery after landing is softened.
    if (phase.value === PHASE.CHARGING) visualCharge.value = charge.value;
    else if (phase.value === PHASE.AIRBORNE || phase.value === PHASE.DEAD) visualCharge.value = releasedCharge.value;
    else visualCharge.value *= Math.exp(-18 * dt);

    // --- procedural spawn ahead + cleanup behind (reassign, never mutate) ---
    const s = CONFIG.cameraZoom;
    const viewW = W / s;
    let working = list;
    let changed = false;
    let last = working[working.length - 1];
    // GORSEL-017: fixed panel course has no procedural continuation -- the
    // list built in initWorld IS the whole course, so this spawn-ahead
    // block is skipped entirely (no infinite generation past panel-04).
    if (!USE_FIXED_PANEL_COURSE && last && last.x + last.width < camX.value + viewW + CONFIG.spawnAhead) {
      const add: any[] = [];
      let cur = last;
      while (cur.x + cur.width < camX.value + viewW + CONFIG.spawnAhead) {
        const n = makeNextPlatform(cur, idCounter.value);
        idCounter.value += 1;
        add.push(n);
        cur = n;
      }
      working = working.concat(add);
      changed = true;
    }
    let startIdx = 0;
    while (
      startIdx < working.length - 2 &&
      working[startIdx].x + working[startIdx].width < camX.value - CONFIG.removeBehind
    ) {
      startIdx += 1;
    }
    if (startIdx > 0) {
      working = working.slice(startIdx);
      changed = true;
    }
    if (changed) {
      platforms.value = working;
      if (PERF_PROBE) {
        pListFrame.value = pFrames.value;
        if (phase.value === PHASE.AIRBORNE) { pListAir.value += 1; pListPending.value = 1; }
      }
    }

    // --- camera: dead-zone follow (OYUN_AKISI-002, 2026-09-22) --------------
    // Player is free anywhere left of cameraDeadZoneRight -- camera target
    // simply STAYS at camX.value there (no reaction at all, a true
    // corridor). Only once the player's own screen fraction would exceed
    // that threshold does the target move forward, by exactly enough to
    // hold the player AT the threshold; camX then eases toward that target
    // every frame (never an instant jump, never platform-pool-dependent --
    // no per-frame scan of `platforms` here any more).
    const deadZoneX = px.value - (CONFIG.cameraDeadZoneRight * W) / s;
    const ctx = Math.max(camX.value, deadZoneX);
    camX.value += (ctx - camX.value) * CONFIG.cameraSmoothingX;

    // Spring Ninja keeps the player at 422/1320 = 32% of the screen through
    // sampled flights. Keep X tied to the player rather than predicting a
    // landing and later catching up to it.
    if (phase.value !== PHASE.DEAD) {
      const anchorX = px.value - (CONFIG.cameraStartFraction * W) / s;
      camXR.value = Math.max(camXR.value, anchorX);
    }
    if (FRAME_DIAG) {
      // Screen-space steps this frame: the scenery moves by the render camera,
      // the character by its own world motion minus the camera's (render Y is fixed).
      const raw = frame.timeSincePreviousFrame ?? 16.7;
      const camStep = Math.abs(camXR.value - dPrevCam.value) * s;
      const chXNow = px.value - camXR.value;
      const chXStep = Math.abs(chXNow - dPrevChX.value) * s;
      const chYStep = Math.abs(py.value - dPrevPy.value) * s;
      if (phase.value === PHASE.AIRBORNE) {
        if (raw <= 12) dB12.value += 1;
        else if (raw <= 20) dB20.value += 1;
        else if (raw <= 25) dB25.value += 1;
        else dBOver.value += 1;
        const prev = dPrevStep.value;
        if (prev >= 0 && dPrevRaw.value <= 12 && raw >= 20) dShortLong.value += 1;
        if (prev >= 0 && dEma.value > 1) {
          if (prev < 0.35 * dEma.value && camStep > 1.6 * dEma.value) {
            dHold.value += 1;
            if (dExamples.value.length < DIAG_MAX_EXAMPLES) {
              dExamples.value = dExamples.value.concat([{
                t: Math.round(frame.timestamp), aPrev: Math.round(dPrevRaw.value * 10) / 10, a: Math.round(raw * 10) / 10,
                camPrev: Math.round(prev * 10) / 10, cam: Math.round(camStep * 10) / 10, ema: Math.round(dEma.value * 10) / 10,
                chX: Math.round(chXStep * 10) / 10, chY: Math.round(chYStep * 10) / 10,
              }]);
            }
          }
        }
        dEma.value = dEma.value === 0 ? camStep : dEma.value * 0.9 + camStep * 0.1;
        dPrevStep.value = camStep;
      } else {
        dPrevStep.value = -1;
        dEma.value = 0;
      }
      dPrevCam.value = camXR.value;
      dPrevPy.value = py.value;
      dPrevChX.value = chXNow;
      dPrevRaw.value = raw;
    }
    // REVIZYON-059: the same video shows Spring Ninja's scenery staying on
    // one vertical plane, while our background moved by 5-26 native px in
    // 0.2 s during jumps. Render Y is set by initWorld at spawn/restart and
    // stays fixed for the whole life. Spawn/cleanup still use camX and are
    // independent of this vertical render transform.

    // --- debug telemetry (throttled to ~10hz) ---
    if (DEBUG_MODE) {
      dbgAcc.value += dt;
      if (dbgAcc.value >= 0.1) {
        dbgAcc.value = 0;
        let dist = 0;
        let pw = 0;
        for (let i = 0; i < list.length; i++) {
          if (list[i].x > px.value) {
            dist = list[i].x - px.value;
            pw = list[i].width;
            break;
          }
        }
        const sortedFrames = frameTimes.value.slice().sort((a, b) => a - b);
        const p50 = sortedFrames[Math.floor(sortedFrames.length * 0.5)];
        const p95 = sortedFrames[Math.floor(sortedFrames.length * 0.95)];
        runOnJS(pushDebug)({
          charge: Math.round(charge.value * 100),
          vx: Math.round(vx.value),
          vy: Math.round(vy.value),
          dist: Math.round(dist),
          width: Math.round(pw),
          offset: Math.round(lastOffset.value),
          fps: Math.round(fps.value),
          p50: Math.round(p50 * 10) / 10,
          p95: Math.round(p95 * 10) / 10,
          dropped: droppedFrames.value,
        });
      }
    }
  }, true);

  // ------------------------------------------------------------------------
  // GORSEL-006 sprite placement (visual only). The sprite's own feet-bottom
  // row is put on py + PH/2 -- the same physical feet line the old render and
  // landing detection use (py = topY - PH/2 at rest, so feet == topY) -- and
  // the feet's horizontal center on the physical sole-span center. Pure
  // translation, no scale/skew/rotate: proportions never change.
  // ------------------------------------------------------------------------
  // Pose driver: the RAW charge.value (decision 2026-09-21, no platform
  // compensation). poseOverride (declared above, near `charge`) >= 0 is a
  // __DEV__-only visual freeze; it never touches `charge`.
  const poseCharge = useDerivedValue(() => (poseOverride.value >= 0 ? poseOverride.value : charge.value));
  // Soluk amca: tek görsel (duruş pozu), kutusu açık boyutlu (sıfır boyutlu kapsayıcıda görünmüyordu).
  const GHOST_POSE = CHARGE_POSES[0];
  const GHOST_SCALE = SPRITE_SCALE * GLOBAL_VISUAL_SCALE * CHAR_SIZE_TRIAL;
  const GHOST_FEET_DX = SOLE_CENTER_OFFSET + ANCHOR_SHIFT_PX * SPRITE_SCALE;
  // Aynı kulede dururken hayalet senin amcanın tam arkasında kalıp görünmüyordu: biraz geride durur.
  const GHOST_SIDE = GHOST_POSE.w * GHOST_SCALE * 0.55;
  // HAYALET YARIŞ: rakibin amcası kendi haritamızda, kule kimliği + kule üstündeki oranla konumlanır.
  const ghostPos = useDerivedValue(() => {
    if (gOn.value === 0) return { x: -99999, y: -99999, vis: 0 };
    const list = platforms.value;
    const a = platformById(list, gFromId.value);
    if (!a) return { x: -99999, y: -99999, vis: 0 };
    const ax = a.x + a.width * gFromR.value;
    const ay = a.topY - PH / 2;
    const t = gProg.value;
    if (gMode.value === 1) {
      const b = platformById(list, gToId.value);
      if (!b) return { x: ax, y: ay, vis: 0 };
      const bx = b.x + b.width * gToR.value;
      const by = b.topY - PH / 2;
      const arc = 90 + Math.abs(bx - ax) * 0.3;
      return { x: ax + (bx - ax) * t, y: ay + (by - ay) * t - arc * 4 * t * (1 - t), vis: 1 };
    }
    if (gMode.value === 2) return { x: ax + 170 * t, y: ay - 140 * t + 1100 * t * t, vis: 1 - t };
    const same = a.id === standingPlatformId.value && phase.value !== PHASE.AIRBORNE;
    return { x: ax - (same ? GHOST_SIDE : 0), y: ay, vis: 1 };
  });
  const ghostBodyStyle = useAnimatedStyle(() => ({
    opacity: ghostPos.value.vis * 0.5,
    transform: [
      { translateX: ghostPos.value.x + GHOST_FEET_DX - GHOST_POSE.pivotX * GHOST_SCALE },
      { translateY: ghostPos.value.y + PH / 2 - GHOST_POSE.pivotY * GHOST_SCALE },
    ],
  }));
  const ghostLabelStyle = useAnimatedStyle(() => ({
    opacity: ghostPos.value.vis,
    transform: [
      { translateX: ghostPos.value.x + GHOST_FEET_DX - 110 },
      { translateY: ghostPos.value.y + PH / 2 - GHOST_POSE.h * GHOST_SCALE - 70 },
    ],
  }));

  // GORSEL-018 sartname 5: one glow for the whole course, parked on the next
  // tower's cap only while charging; opacity follows the charge (non-layout).
  const targetGlowStyle = useAnimatedStyle(() => {
    const t = HEDEF_PARILTI && phase.value === PHASE.CHARGING ? platformById(platforms.value, standingPlatformId.value + 1) : null;
    if (!t) return { opacity: 0, transform: [{ translateX: -99999 }, { translateY: -99999 }, { scaleX: 1 }] };
    return { opacity: 0.35 + 0.55 * Math.min(1, visualCharge.value),
      transform: [{ translateX: t.x }, { translateY: t.topY - GLOW_H + 2 }, { scaleX: t.width / GLOW_W }] };
  });
  // Gece seferi: iskeleden sonra gökte yıldızlar belirir (tek katman, yalnız opaklık).
  const starsStyle = useAnimatedStyle(() => ({ opacity: Math.max(0, Math.min(1, skyStep.value - 3)) }));
  const splatStyle = useAnimatedStyle(() => {
    const k = splat.value;
    return {
      opacity: k < 1 ? (k < 0.6 ? 1 : (1 - k) / 0.4) : 0,
      transform: [{ translateX: splatX.value }, { translateY: splatY.value }, { scale: 0.4 + k * 1.3 }],
    };
  });
  const doorStyle = useAnimatedStyle(() => ({
    opacity: doorOp.value,
    transform: [{ translateX: doorX.value - DOOR_W / 2 }, { translateY: doorBottom.value - DOOR_H }],
  }));
  const doorOpenStyle = useAnimatedStyle(() => ({ opacity: doorOpen.value }));
  const skullStyle = useAnimatedStyle(() => {
    const a = skullBob.value * Math.PI * 2;
    return {
      opacity: skullVis.value,
      transform: [
        { translateX: skullX.value - SKULL_SIZE / 2 },
        { translateY: skullY.value - SKULL_SIZE / 2 + Math.sin(a) * 5 },
        { rotate: `${Math.sin(a) * 8}deg` },
      ],
    };
  });
  const charOpStyle = useAnimatedStyle(() => ({ opacity: charOp.value }));
  // KURUKAFA: etki sürerken amcanın başının üstünde rozet (kullanıcı: "aktif olduğunda yazı/emoji/ibare olmalı").
  const skullBadgeStyle = useAnimatedStyle(() => ({
    opacity: KURUKAFA_ON && effectLeft.value > 0 ? 1 : 0,
    transform: [
      { translateX: px.value + SOLE_CENTER_OFFSET - SKULL_BADGE_W / 2 },
      { translateY: py.value + PH / 2 - FART_CHAR_H - SKULL_BADGE_H - 8 + Math.sin(skullBob.value * Math.PI * 2) * 3 },
    ],
  }));
  // PİL = AMCANIN ŞARJI: menüde amcanın başının üstünde konuşma balonu.
  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: px.value + SOLE_CENTER_OFFSET + 70 },
      { translateY: py.value + PH / 2 - FART_CHAR_H * 0.98 },
    ],
  }));
  const fliesStyle = useAnimatedStyle(() => ({
    opacity: dirty.value,
    transform: [{ translateX: px.value + FART_FEET_DX }, { translateY: py.value + PH / 2 - FART_CHAR_H * 0.98 }],
  }));
  const fly0 = useAnimatedStyle(() => { const a = flyT.value * Math.PI * 2; return { transform: [{ translateX: Math.cos(a) * 30 }, { translateY: Math.sin(a * 2) * 9 }] }; });
  const fly1 = useAnimatedStyle(() => { const a = flyT.value * Math.PI * 2 + 2.1; return { transform: [{ translateX: Math.cos(-a) * 24 }, { translateY: Math.sin(a * 3) * 11 - 6 }] }; });
  const fly2 = useAnimatedStyle(() => { const a = flyT.value * Math.PI * 4 + 4.2; return { transform: [{ translateX: Math.cos(a) * 18 }, { translateY: Math.sin(a) * 7 - 14 }] }; });
  const skyTintKar = roofWx === "kar";
  const skyTintStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(skyStep.value, SKY_STEPS, skyTintKar ? SKY_TINTS_KAR : SKY_TINTS),
  }));
  // Rekor bayrağı: şimdiye kadar varılan en uzak kulenin çatısında.
  const recordFlagStyle = useAnimatedStyle(() => {
    const f = DURAK_SEFER && recordFlagId.value > 0 ? platformById(platforms.value, recordFlagId.value) : null;
    if (!f) return { opacity: 0, transform: [{ translateX: -99999 }, { translateY: -99999 }] };
    return { opacity: 1, transform: [{ translateX: f.x + f.width - 5 }, { translateY: f.topY - 54 }] };
  });
  const dustStyle = useAnimatedStyle(() => {
    const d = dust.value;
    return {
      opacity: d < 1 ? 1 - d * d : 0,
      transform: [{ translateX: dustX.value }, { translateY: dustY.value }, { scale: 0.55 + d * 1.25 }],
    };
  });
  const burstStyle = useAnimatedStyle(() => {
    const b = burst.value;
    return {
      opacity: b > 0 && b < 1 ? 1 - b : 0,
      transform: [
        { translateX: burstX.value },
        { translateY: burstY.value },
        { scale: 0.6 + b * 1.6 },
      ],
    };
  });

  // GORSEL-016 (2026-09-23, user-authorized): column smoke fully disabled
  // this turn -- "Dumanı tamamen devre dışı bırak: render/emitter/debug
  // görünmesin." The clock hook (which drove the emitter), the always-on
  // TEMP DEBUG mount-probe/reaction, and the smoke-debug panel JSX below are
  // all removed so nothing renders, emits, or ticks. ColumnSmoke.tsx itself
  // is left in place (not deleted) so the effect can be re-enabled later
  // without re-deriving it from scratch.

  // OYUN_AKISI-002: FAR layer -- whole image, plain cover (+ overscan for
  // slide room), slow parallax. Same clamp-not-tile technique as before.
  const bgFarStyle = useAnimatedStyle(() => {
    const scale = Math.max(W / BG_IMG_W, H / BG_IMG_H) * BG_FAR_OVERSCAN;
    const renderedW = BG_IMG_W * scale;
    const renderedH = BG_IMG_H * scale;
    const maxShiftX = Math.max(0, (renderedW - W) / 2);
    const desired = -camXR.value * CONFIG.cameraZoom * BG_FAR_PARALLAX_RATIO;
    const shiftX = Math.min(maxShiftX, Math.max(-maxShiftX, desired));
    return {
      width: renderedW,
      height: renderedH,
      transform: [
        { translateX: (W - renderedW) / 2 + shiftX },
        // REVIZYON-030: world-locked in Y (1:1 with the world, same speed as the
        // district) so the sea/roof transition never slides between layers.
        { translateY: (BG_SEA_END_WORLD_Y - camYR.value) * CONFIG.cameraZoom - BG_SEA_END_ROW * scale },
      ],
    };
  });
  const bgTileScale = Math.max(W / BG_IMG_W, H / BG_IMG_H) * BG_FAR_OVERSCAN;
  const bgTileW = BG_IMG_W * bgTileScale;
  const bgTileH = BG_IMG_H * bgTileScale;
  const bgScrollStyle = useAnimatedStyle(() => {
    const period = 2 * bgTileW; // a tile and its mirror image repeat exactly
    let off = (camXR.value * CONFIG.cameraZoom * BG_SCROLL_RATIO) % period;
    if (off < 0) off += period;
    return {
      transform: [
        { translateX: (W - bgTileW) / 2 - off },
        { translateY: (BG_SEA_END_WORLD_Y - camYR.value) * CONFIG.cameraZoom - BG_SEA_END_ROW * bgTileScale },
      ],
    };
  });
  // GORSEL-015 iPhone-reddi fix (2026-09-22): replaces the old screen-space
  // "near" box (see ROOFTOP_BAND_* comment above for why that was the root
  // cause of floating chimney bases). This is a WORLD-space rect -- a child
  // of the world container, so it only needs left/width recomputed per
  // frame (to keep covering the viewport as camX moves); top/height are
  // fixed world constants and need no transform at all.
  const groundBandStyle = useAnimatedStyle(() => {
    const viewWWorld = W / CONFIG.cameraZoom;
    return {
      left: camXR.value - ROOFTOP_BAND_MARGIN_X,
      width: viewWWorld + ROOFTOP_BAND_MARGIN_X * 2,
    };
  });

  // GORSEL-016 near-image tiles: this crop represents the SAME ground plane
  // the chimneys are rooted in (not a distant layer), so it gets NO parallax
  // -- a fixed world position, exactly like the platforms themselves. A
  // handful of side-by-side tiles (not animated, not shared-value-driven)
  // is enough to cover the "first screen + first 10 jumps" scope this task
  // is limited to (see GORSEL-016 note in AI_REVIEW.md); a repeat seam in a
  // rooftop texture reads as tiling, not as a broken layer, and the solid
  // groundBandStyle gradient behind it still guarantees full coverage
  // wherever a tile doesn't reach.

  // World camera: maps world coords -> screen as (world - cam) * zoom, with a
  // top-left transform origin (see styles.world). This keeps the player in the
  // left band while the zoom reveals the upcoming route on the right.
  // REVIZYON-054: back row -- follows BACK_DISTRICT_PARALLAX of the camera's X.
  const districtStyle0 = useAnimatedStyle(() => {
    const offX = camXR.value * (1 - BACK_DISTRICT_PARALLAX);
    const base = Math.floor((camXR.value * BACK_DISTRICT_PARALLAX) / BACK_TILE_W);
    return { transform: [{ translateX: offX + base * BACK_TILE_W }, { translateY: DISTRICT_TOP_Y }] };
  });
  const districtStyle1 = useAnimatedStyle(() => {
    const offX = camXR.value * (1 - BACK_DISTRICT_PARALLAX);
    const base = Math.floor((camXR.value * BACK_DISTRICT_PARALLAX) / BACK_TILE_W) + 1;
    // 1.5 world-unit overlap: hides the sub-pixel hairline (edge columns of mirrored tiles are identical)
    return { transform: [{ translateX: offX + base * BACK_TILE_W - 1.5 }, { translateY: DISTRICT_TOP_Y }] };
  });
  // POPUP-002 scene layers (screen space, behind the world container).
  // Backdrop: fixed horizontally; a small clamped vertical drift with the
  // render camera (camera rises -> backdrop sinks a little), never tiled.
  const puLift = () => {
    "worklet";
    const ref = -(CONFIG.cameraPlayerAnchorY * H) / CONFIG.cameraZoom;
    return Math.max(0, Math.min(PU_BACKDROP_YMAX, (ref - camYR.value) * CONFIG.cameraZoom * PU_BACKDROP_YPAR));
  };
  const puBackdropStyle = useAnimatedStyle(() => ({ transform: [{ translateY: puLift() }] }));
  const puCloudStyle = (x0: number, y: number, par: number, cw: number) => {
    "worklet";
    const span = W + cw + 40;
    const x = (((x0 - camXR.value * CONFIG.cameraZoom * par) % span) + span) % span - cw - 20;
    return { transform: [{ translateX: x }, { translateY: y + puLift() }] };
  };
  const puCloud0 = useAnimatedStyle(() => puCloudStyle(40, 300, 0.05, 131));
  const puCloud1 = useAnimatedStyle(() => puCloudStyle(200, 222, 0.08, 74));
  const puCloud2 = useAnimatedStyle(() => puCloudStyle(300, 372, 0.035, 59));
  const puSunStyle = useAnimatedStyle(() => ({ transform: [{ translateY: puLift() }] }));
  const eraserWobble = useSharedValue(0);
  useEffect(() => {
    if (!POPUP) return;
    eraserWobble.value = withRepeat(withTiming(1, { duration: 1300, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [eraserWobble]);
  const puEraserStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -6 + 12 * eraserWobble.value }, { rotate: `${-8 + 14 * eraserWobble.value}deg` }],
  }));
  const puFloorStyle = useAnimatedStyle(() => ({
    left: camXR.value - ROOFTOP_BAND_MARGIN_X,
    width: W / CONFIG.cameraZoom + ROOFTOP_BAND_MARGIN_X * 2,
  }));
  const worldStyle = useAnimatedStyle(() => {
    const s = CONFIG.cameraZoom;
    return {
      transform: [
        { translateX: -camXR.value * s },
        { translateY: -camYR.value * s },
        { scale: s },
      ],
    };
  });

  return (
    <View style={styles.root} testID="game-root">
      <StatusBar style="dark" />
      <LinearGradient
        colors={POPUP ? [PU_SKY_TOP, PU_SKY_TOP] : [BG_SKY_TOP_COLOR, BG_SKY_TOP_COLOR]}
        style={styles.fill}
      />

      {/* OYUN_AKISI-002 (2026-09-22): FAR layer (whole image, slow parallax,
          sky + distant skyline) -- see bgFarStyle above. Retired for
          USE_FIXED_PANEL_COURSE: each of the 4 panel paintings already IS a
          full scene (sky/sea/skyline + foreground rooftops in one image), so
          there is no separate far/near split to draw -- see the panel
          rendering inside the world container below. */}
      {!USE_FIXED_PANEL_COURSE && !POPUP && BG_SCROLL_TEST && (
        <Animated.View style={[{ position: "absolute", left: 0, top: 0, width: bgTileW * BG_SCROLL_TILES, height: bgTileH }, bgScrollStyle]} pointerEvents="none">
          {Array.from({ length: BG_SCROLL_TILES }).map((_, k) => (
            <View key={`bg-tile-${k}`} pointerEvents="none"
              style={{ position: "absolute", left: k * bgTileW, top: 0, width: bgTileW, height: bgTileH, transform: k % 2 ? [{ scaleX: -1 }] : undefined }}>
              <Image source={MASTER_NEIGHBORHOOD_SOURCE} resizeMode="stretch" fadeDuration={0}
                onLoadStart={k === 0 ? () => markArtStarted("background") : undefined}
                onLoad={k === 0 ? () => markArtLoaded("background") : undefined}
                onError={k === 0 ? failArt : undefined}
                style={{ width: "100%", height: "100%" }}
              />
              {bgVariant && (
                <CachedImage source={BG_VARIANTS[bgVariant].m} cachePolicy="memory-disk" transition={700} contentFit="fill"
                  style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }} />
              )}
              {!SHOW_BACK_DISTRICT && (
                <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: "100%", marginTop: -1, aspectRatio: BG_IMG_W / BG_LOW_SIL_H }}>
                  <Image source={BG_LOW_SIL_SOURCE} style={{ width: "100%", height: "100%" }} resizeMode="stretch" fadeDuration={0} />
                  {bgVariant && (
                    <CachedImage source={BG_VARIANTS[bgVariant].a} cachePolicy="memory-disk" transition={700} contentFit="fill"
                      style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }} />
                  )}
                </View>
              )}
            </View>
          ))}
        </Animated.View>
      )}
      {!USE_FIXED_PANEL_COURSE && !POPUP && !BG_SCROLL_TEST && (
        <Animated.View style={[{ position: "absolute", left: 0, top: 0 }, bgFarStyle]} pointerEvents="none">
          {LIVE_RN_IMAGE ? (
            <Image source={MASTER_NEIGHBORHOOD_SOURCE} resizeMode="stretch" fadeDuration={0}
              onLoadStart={() => markArtStarted("background")}
              onLoad={() => markArtLoaded("background")}
              onError={failArt}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <CachedImage cachePolicy="memory-disk" priority="high" transition={0}
              source={MASTER_NEIGHBORHOOD_SOURCE}
              onLoadStart={() => markArtStarted("background")}
              onLoad={() => markArtLoaded("background")}
              onError={failArt}
              style={{ width: "100%", height: "100%" }}
              contentFit="fill"
            />
          )}
          {/* REVIZYON-056: back row off -> the far image's own painted roof band,
              mirrored + hazed (no windows read), continues below its bottom so
              a low camera never shows bare sky under the houses. */}
          {!SHOW_BACK_DISTRICT && (
            <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: "100%", marginTop: -1, aspectRatio: BG_IMG_W / BG_LOW_SIL_H }}>
              <Image source={BG_LOW_SIL_SOURCE} style={{ width: "100%", height: "100%" }} resizeMode="stretch" fadeDuration={0} />
            </View>
          )}
        </Animated.View>
      )}
      {/* KAR-FILTRE (2026-11-25, "kar filtresini biraz hafiflet"): karda beyaz örtü 0.26 -> 0.12 ve ufuktaki sıcak
          (turuncu) ton kapalı; karlı master zaten kapalı-gri çizim, üst üste binince sahne soluk-sarımsı oluyordu. */}
      {!POPUP && <View style={[styles.backgroundWash, GORUNUM_REV && { opacity: roofWx === "kar" ? 0.12 : 0.26 }]} pointerEvents="none" />}
      {/* REVIZYON-034: very light depth/colour: warm glow toward the horizon,
          deeper blue at the top. Screen-space, under the world + HUD. */}
      {!POPUP && <LinearGradient pointerEvents="none" colors={roofWx === "kar" ? ["rgba(60,110,190,0.08)", "rgba(255,190,120,0)", "rgba(255,170,100,0)"] : ["rgba(30,120,230,0.10)", "rgba(255,190,120,0)", "rgba(255,170,100,0.10)"]}
        locations={[0, 0.5, 1]} style={styles.fill} />}
      {DURAK_SEFER && !POPUP && <Animated.View pointerEvents="none" style={[styles.fill, skyTintStyle]} />}
      {DURAK_SEFER && !POPUP && (
        <Animated.View pointerEvents="none" style={[styles.fill, starsStyle]}>
          {NIGHT_STARS.map((st, i) => (
            <View key={i} style={{ position: "absolute", left: `${st.x}%`, top: `${st.y}%`, width: st.r, height: st.r, borderRadius: st.r / 2, backgroundColor: "#fff6d8", opacity: st.o }} />
          ))}
        </Animated.View>
      )}
      {ISTANBUL_ON && !POPUP && (
        <SkyWeather W={W} H={H} weather={shownWeather} night={nightAmt} moon={moon} active={assetsReady} season={season} />
      )}
      {AMBIENT_ON && !POPUP && (
        <AmbientEvents W={W} H={H} active={assetsReady && !gameOver} onHorn={() => { if (SFX_ON) playSfx("horn_far"); }} />
      )}
      {POPUP && (
        <>
          {/* POPUP-002: approved backdrop as one screen-fixed matte (height = screen,
              centred, wider than the screen), then sun and moving clouds. */}
          <Animated.View pointerEvents="none" style={[{ position: "absolute", top: -Math.round((PU_BACKDROP_PAD * H) / (PU_BACKDROP_H - PU_BACKDROP_PAD)),
            left: Math.round((W - (H * PU_BACKDROP_W) / (PU_BACKDROP_H - PU_BACKDROP_PAD)) / 2),
            width: Math.round((H * PU_BACKDROP_W) / (PU_BACKDROP_H - PU_BACKDROP_PAD)), height: Math.round((H * PU_BACKDROP_H) / (PU_BACKDROP_H - PU_BACKDROP_PAD)) }, puBackdropStyle]}>
            <Image source={PU_BACKDROP_SOURCE} style={{ width: "100%", height: "100%" }} resizeMode="stretch" fadeDuration={0}
              onLoadStart={() => markArtStarted("background")} onLoad={() => markArtLoaded("background")} onError={failArt} />
          </Animated.View>
          <Animated.View pointerEvents="none" style={[{ position: "absolute", right: 22, top: 86, width: 108, height: 108 }, puSunStyle]}>
            <Image source={PU_SUN_SOURCE} style={{ width: "100%", height: "100%" }} fadeDuration={0} />
          </Animated.View>
          {[[puCloud0, PU_CLOUD_A_SOURCE, 131, 57], [puCloud1, PU_CLOUD_B_SOURCE, 74, 33], [puCloud2, PU_CLOUD_C_SOURCE, 59, 29]].map(([st, src, cw, ch]: any, k) => (
            <Animated.View key={`pu-cloud-${k}`} pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, width: cw, height: ch }, st]}>
              <Image source={src} style={{ width: "100%", height: "100%" }} fadeDuration={0} />
            </Animated.View>
          ))}
        </>
      )}
      <AmbientBirds width={W} height={H} />
      {POPUP && (
        <>
          {/* POPUP-001: the eraser's story on the left -- drawn BEHIND the world
              layer, so it can never cover the character, a platform or a gap. */}
          <View pointerEvents="none" style={{ position: "absolute", left: 0, top: 0, width: PU_ERASED_W, height: H }}>
            <Image source={PU_ERASED_SOURCE} resizeMode="stretch" fadeDuration={0}
              onLoad={() => markArtLoaded("district")} onError={failArt} style={{ width: "100%", height: "100%" }} />
          </View>
          <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 8, top: Math.round(H * 0.17), width: 74, height: 87 }, puEraserStyle]}>
            <Image source={PU_ERASER_SOURCE} style={{ width: "100%", height: "100%" }} fadeDuration={0} />
          </Animated.View>
        </>
      )}

      {gameReady && (
        <>
          {/* Scaled world container — everything in world coords lives here */}
          <Animated.View style={[styles.world, worldStyle]}>
        {/* GORSEL-015/016 ground band + near-image tiles: DISABLED as of
            ACIL KURTARMA-02 (2026-09-23). Real iPhone evidence
            (ScreenRecording_09-23-2026 14-09-05) showed a huge flat brown
            dead zone covering most of the screen for the first ~20s, with
            the Istanbul/Bosphorus silhouette never appearing and roofs only
            visible in a thin strip near the bottom. Root cause (traced by
            reading the actual render tree, not guessed): the ground band's
            top edge (ROOFTOP_BAND_TOP_Y = ROOFTOP_GROUND_Y-800) sits at
            world Y=-650, which -- at the starting platform's baseY -- maps
            to only ~19% down the screen; everything below that is either
            solid brown (groundBandStyle) or the near-image tiles (which
            only cover a further 229 of the band's 3800 world-unit height,
            leaving most of the band exposed as flat color) painted OVER
            the single bgFarStyle skyline layer underneath (world-container
            children paint after/above the screen-space far layer). This
            band was tuned during GORSEL-015 against a different course/
            camera state and was never re-verified with a full screenshot
            pass after GORSEL-016 swapped in the new master image (that
            verification was interrupted by the GORSEL-017 request) -- so
            this bug predates GORSEL-017 and rolling back USE_FIXED_PANEL_
            COURSE alone could never have fixed it. Per this task's explicit
            "tek hafif arka plan katmanı" requirement, both layers are
            switched off entirely (not deleted -- kept for a future,
            properly-verified re-introduction) rather than re-tuned under
            time pressure; bgFarStyle below is now the ONLY background
            layer, and the rooftop-chimney sprites already carry their own
            base/roof texture in the asset art, so removing this band does
            not leave platforms looking undrawn. */}
        {false && (
          <>
            <Animated.View
              style={[
                { position: "absolute", top: ROOFTOP_BAND_TOP_Y, height: ROOFTOP_BAND_BOTTOM_Y - ROOFTOP_BAND_TOP_Y, overflow: "hidden" },
                groundBandStyle,
              ]}
              pointerEvents="none"
            >
              <LinearGradient
                colors={[colors.platform, colors.platformShade]}
                style={{ width: "100%", height: "100%" }}
              />
            </Animated.View>
            {Array.from({ length: NEAR_IMG_TILE_COUNT }).map((_, i) => (
              <View
                key={`near-tile-${i}`}
                style={{
                  position: "absolute",
                  left: NEAR_IMG_START_X + i * NEAR_IMG_RENDERED_W,
                  top: NEAR_IMG_ANCHOR_WORLD_Y,
                  width: NEAR_IMG_RENDERED_W,
                  height: NEAR_IMG_RENDERED_H,
                  overflow: "hidden",
                }}
                pointerEvents="none"
              >
                <CachedImage
                  cachePolicy="memory-disk"
                  priority="high"
                  transition={0}
                  source={MASTER_NEIGHBORHOOD_SOURCE}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: -NEAR_IMG_CROP_TOP * NEAR_IMG_WORLD_SCALE,
                    width: BG_IMG_W * NEAR_IMG_WORLD_SCALE,
                    height: BG_IMG_H * NEAR_IMG_WORLD_SCALE,
                  }}
                  contentFit="fill"
                />
              </View>
            ))}
          </>
        )}
        {/* GORSEL-017: the 4 approved panel paintings themselves, each one
            a full scene (sky/sea/skyline + its own painted rooftop/chimney
            foreground). Static in world space -- world X = panelIndex *
            PANEL_WORLD_WIDTH, laid out edge-to-edge, no parallax (this IS
            the world, same as the platforms standing in it, not a distant
            depth layer). Panel-course.ts's FIXED_PANEL_PLATFORMS were
            measured directly against these same images/scale, so every
            (invisible) collision box lines up with its own painted chimney
            cap by construction. */}
        {USE_FIXED_PANEL_COURSE && PANEL_SOURCES.map((src, i) => (
          <Fragment key={`panel-${i}`}>
            {/* GORSEL-017 HOTFIX-01: seamless edge-sampled fill above/below
                this panel, replacing the old flat-color strip (see the
                PANEL_FILL_STRIP_HEIGHT comment in panel-course.ts for why a
                fill exists at all). Each strip is the panel's own real last
                24 rows, stretched -- vertically FLIPPED so the row
                immediately adjacent to the true panel edge (the exact-match
                pixels) sits right at the seam, with the coarser, stretched
                rows extending outward where precision matters less. */}
            <View
              pointerEvents="none"
              style={{
                position: "absolute", left: 0, top: 0,
                width: PANEL_WORLD_WIDTH, height: PANEL_FILL_STRIP_HEIGHT,
                overflow: "hidden",
                transform: [{ translateX: i * PANEL_WORLD_WIDTH }, { translateY: -PANEL_FILL_STRIP_HEIGHT }],
              }}
            >
              <Image
                source={PANEL_TOP_EDGE_SOURCES[i]}
                style={{ width: "100%", height: "100%", transform: [{ scaleY: -1 }] }}
                resizeMode="stretch"
              />
            </View>
            <View
              pointerEvents="none"
              style={{
                position: "absolute", left: 0, top: 0,
                width: PANEL_WORLD_WIDTH, height: PANEL_FILL_STRIP_HEIGHT,
                overflow: "hidden",
                transform: [{ translateX: i * PANEL_WORLD_WIDTH }, { translateY: PANEL_WORLD_HEIGHT }],
              }}
            >
              <Image
                source={PANEL_BOTTOM_EDGE_SOURCES[i]}
                style={{ width: "100%", height: "100%", transform: [{ scaleY: -1 }] }}
                resizeMode="stretch"
              />
            </View>
            <View
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                // GORSEL-017 HOTFIX-01: rendered PANEL_SEAM_OVERLAP world
                // units WIDER than the panel's own step (PANEL_WORLD_WIDTH)
                // -- the user's real-device screenshot showed a thin
                // vertical line at every panel-to-panel boundary, which is
                // sub-pixel rounding (771.62 is not an integer device px at
                // any common scale) leaving the root background peeking
                // through for a hairline. Overlapping the NEXT panel's own
                // left edge by a couple world units (a fraction of a source
                // pixel once scaled back down) closes that gap; it only
                // ever covers the next panel's own leftmost sliver of sky,
                // never a chimney (none sit within a couple world units of
                // x=0 in any panel).
                width: PANEL_WORLD_WIDTH + PANEL_SEAM_OVERLAP,
                height: PANEL_WORLD_HEIGHT,
                // `transform`, not `left`, for the per-panel X offset: on
                // react-native-web, position:absolute children laid out with
                // `left`/`top` still expand an ancestor's scrollable content
                // box (unlike native RN), which was blowing the whole
                // 390x844 game root out to ~2258 world units wide and
                // squashing the actual viewport. `transform` is purely
                // visual and doesn't affect layout/scroll size, same reason
                // every other world-space element here (PlatformView, the
                // character) already positions itself this way.
                transform: [{ translateX: i * PANEL_WORLD_WIDTH }],
              }}
              pointerEvents="none"
            >
              <CachedImage
                cachePolicy="memory-disk"
                priority="high"
                transition={0}
                source={src}
                onLoadStart={i === 0 ? () => markArtStarted("background") : undefined}
                onLoad={i === 0 ? () => markArtLoaded("background") : undefined}
                onError={i === 0 ? failArt : undefined}
                style={{ width: "100%", height: "100%" }}
                contentFit="fill"
              />
            </View>
          </Fragment>
        ))}
        {/* GORSEL-020 RooftopDistrict, REVIZYON-054: the BACK row (see BACK_* consts). */}
        {!POPUP && SHOW_BACK_DISTRICT && [districtStyle0, districtStyle1].map((st, k) => (
          <Animated.View key={`district-${k}`} pointerEvents="none"
            style={[{ position: "absolute", left: 0, top: 0, width: BACK_TILE_W, height: BACK_TILE_H }, st]}>
            <Image source={DISTRICT_SOURCE} style={{ width: "100%", height: "100%" }} resizeMode="stretch"
              onLoad={k === 0 ? () => markArtLoaded("district") : undefined} onError={k === 0 ? failArt : undefined} />
          </Animated.View>
        ))}
        {/* REVIZYON-033: thinner, low-opacity two-layer haze (offset heights, soft
            peaks) - still softens the sea->roof seam without a flat brown band. */}
        {!POPUP && SHOW_BACK_DISTRICT && [districtStyle0, districtStyle1].map((st, k) => (
          <Animated.View key={`haze-${k}`} pointerEvents="none"
            style={[{ position: "absolute", left: 0, top: -26, width: BACK_TILE_W, height: 54 }, st]}>
            <LinearGradient colors={["rgba(165,210,235,0)", "rgba(165,210,235,0.13)", "rgba(165,210,235,0)"]}
              locations={[0, 0.4, 1]} style={{ width: "100%", height: "100%" }} />
          </Animated.View>
        ))}
        {!POPUP && SHOW_BACK_DISTRICT && [districtStyle0, districtStyle1].map((st, k) => (
          <Animated.View key={`haze2-${k}`} pointerEvents="none"
            style={[{ position: "absolute", left: 0, top: -8, width: BACK_TILE_W, height: 30 }, st]}>
            <LinearGradient colors={["rgba(190,220,235,0)", "rgba(190,220,235,0.08)", "rgba(190,220,235,0)"]}
              locations={[0, 0.55, 1]} style={{ width: "100%", height: "100%" }} />
          </Animated.View>
        ))}
        {/* REVIZYON-030: same roof continued downward (vertical mirror, seamless
            at the join) so a low camera never reaches the bare background.
            REVIZYON-054: a second, unflipped copy below it for the dead-fall camera. */}
        {!POPUP && SHOW_BACK_DISTRICT && [districtStyle0, districtStyle1].map((st, k) => (
          <Fragment key={`district-low-${k}`}>
            <Animated.View pointerEvents="none"
              style={[{ position: "absolute", left: 0, top: 0, width: BACK_TILE_W, height: BACK_TILE_H }, st,
                { marginTop: BACK_TILE_H - 1 }]}>
              <Image source={DISTRICT_BODY_SOURCE} style={{ width: "100%", height: "100%", transform: [{ scaleY: -1 }] }} resizeMode="stretch" />
            </Animated.View>
            <Animated.View pointerEvents="none"
              style={[{ position: "absolute", left: 0, top: 0, width: BACK_TILE_W, height: BACK_TILE_H }, st,
                { marginTop: 2 * (BACK_TILE_H - 1) }]}>
              <Image source={DISTRICT_BODY_SOURCE} style={{ width: "100%", height: "100%" }} resizeMode="stretch" />
            </Animated.View>
            {/* REVIZYON-054: aerial-perspective haze on the opaque part only -- one row behind the houses. */}
            <Animated.View pointerEvents="none"
              style={[{ position: "absolute", left: 0, top: BACK_HAZE_TOP, width: BACK_TILE_W, height: 3 * BACK_TILE_H - BACK_HAZE_TOP,
                backgroundColor: "rgba(180,208,226,0.30)" }, st]} />
          </Fragment>
        ))}

        {/* REVIZYON-054: playable houses in front of the back row. */}
        {POPUP && !USE_FIXED_PANEL_COURSE && (
          <Animated.View pointerEvents="none" style={[styles.puPageFloor, puFloorStyle]}>
            <View style={styles.puPageFold} />
          </Animated.View>
        )}
        {/* PİJAMA ANI: kapı evlerin arkasında, alt kısmı çatı tepesinin altında kalır. */}
        {PIJAMA_ON && (
          <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, width: DOOR_W, height: DOOR_H }, doorStyle]}>
            <Image source={DOOR_CLOSED_SOURCE} resizeMode="stretch" fadeDuration={0} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }} />
            <Animated.View style={[{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }, doorOpenStyle]}>
              <Image source={DOOR_OPEN_SOURCE} resizeMode="stretch" fadeDuration={0} style={{ width: "100%", height: "100%" }} />
            </Animated.View>
          </Animated.View>
        )}
        {!USE_FIXED_PANEL_COURSE && POOL_IDX.map((i) => (POPUP
          ? <PopupHouseView key={`pu-house-${i}`} index={i} platforms={platforms} styles={styles} />
          : <PlatformHouseView key={`house-${i}`} index={i} platforms={HOUSE_AB_FROZEN ? housePlatformsFrozen : platforms} styles={styles} probe={houseProbe} roofWx={roofWx} cepheHal={cepheHal} kediTitre={kediUsur ? kediTitre : undefined} kediNefes={kediUsur ? kediNefes : undefined} woken={MAHALLE_ON ? catWoken : undefined} look={MAHALLE_ON ? neighborLook : undefined} kTick={kTick} kGone={kGone} kAmcaX={kAmcaX} />
        ))}
        {KARGA_ON && kargaPoolStyles.map((st, j) => (
          <Animated.View key={`karga-ucan-${j}`} pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, width: MAHALLE_BOX, height: MAHALLE_BOX }, st]}>
            <Image source={KARGA_POOL_SRC[j % 4]} style={{ width: "100%", height: "100%" }} resizeMode="stretch" fadeDuration={0} />
          </Animated.View>
        ))}

        {/* Platforms (fixed pool, positioned by the worklet) */}
        {POOL_IDX.map((i) => (
          <PlatformView
            key={i}
            index={i}
            platforms={platforms}
            styles={styles}
            onArtLoad={markArtLoaded}
            onArtStart={markArtStarted}
            onArtError={failArt}
            effectK={KURUKAFA_ON ? effectK : undefined}
          />
        ))}
        {HEDEF_PARILTI && (
          <Animated.View style={[styles.targetGlow, targetGlowStyle]}>
            <LinearGradient pointerEvents="none" colors={["rgba(255,236,170,0)", "rgba(255,226,140,0.55)", "rgba(255,248,214,0.95)"]} locations={[0, 0.75, 1]} style={styles.houseGradFill} />
          </Animated.View>
        )}
        {DURAK_SEFER && (
          <Animated.View pointerEvents="none" style={[styles.burst, recordFlagStyle]}>
            <View style={styles.flagPole} />
            <View style={styles.flagCloth}><Text style={styles.flagText}>REKOR</Text></View>
          </Animated.View>
        )}
        {KIS_ON && SHED_FLAKES.map((f, i) => <ShedFlake key={`shed${i}`} f={f} shed={shed} shedX={shedX} shedY={shedY} shedAmt={shedAmt} />)}
        {FAZ2_DUST && (
          <Animated.View style={[styles.burst, dustStyle]}>
            {(roofWx === "kar" ? DUST_SNOW : DUST_PUFFS).map((q, i) => {
              const ang = (q.a * Math.PI) / 180;
              return <View key={i} style={{ position: "absolute", width: q.d, height: q.d, borderRadius: q.d / 2, backgroundColor: q.c,
                left: Math.cos(ang) * q.r - q.d / 2, top: Math.sin(ang) * q.r * 0.45 - q.d / 2 }} />;
            })}
          </Animated.View>
        )}
        {FART_TRIAL && FART_SLOTS.map((i) => <FartPuff key={`fart-${i}`} i={i} puffs={fartPuffs} now={fartNow} cut={fartCut} />)}
        {SPLAT_ON && (
          <Animated.View pointerEvents="none" style={[styles.burst, splatStyle]}>
            {SPLAT_BLOBS.map((b, i) => (
              <View key={i} style={{ position: "absolute", width: b.d, height: b.d * 0.8, borderRadius: b.d / 2, backgroundColor: b.c,
                left: Math.cos(b.a) * b.r - b.d / 2, top: Math.sin(b.a) * b.r * 0.8 - b.d / 2 }} />
            ))}
          </Animated.View>
        )}
        {/* Perfect-landing particle burst */}
        <Animated.View style={[styles.burst, burstStyle]}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const ang = (Math.PI * 2 * i) / 6;
            return (
              <View
                key={i}
                style={[
                  styles.burstDot,
                  { left: Math.cos(ang) * 20, top: Math.sin(ang) * 20 },
                ]}
              />
            );
          })}
        </Animated.View>

        {/* GORSEL-006: temporary single-pose character (same sprite for idle/
            charge/jump/fall/landing until the 5-pose set exists). Drawn after
            the platforms and the back smoke layer, before the front smoke
            layer -- same z-order slot the old layered character had. The old
            layered character (jacket halves, belly, puff, pants, head) is no
            longer part of the render tree. */}
        {SPLAT_ON && (
          <Animated.View pointerEvents="none" style={[styles.burst, fliesStyle]}>
            {[fly0, fly1, fly2].map((st, i) => (
              <Animated.View key={i} style={[{ position: "absolute", left: -3, top: -3, width: 9, height: 7, borderRadius: 4, backgroundColor: "#141414" }, st]} />
            ))}
          </Animated.View>
        )}
        {KURUKAFA_ON && (
          <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, width: SKULL_SIZE, height: SKULL_SIZE }, skullStyle]}>
            <Image source={SKULL_SOURCE} resizeMode="stretch" fadeDuration={0} style={{ width: "100%", height: "100%" }} />
          </Animated.View>
        )}
        {ISTANBUL_ON && batteryMood && menuOpen && (
          <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, width: BUBBLE_W, height: BUBBLE_H, justifyContent: "flex-start" }, bubbleStyle]} testID="amca-bubble">
            <View style={styles.amcaBubble}>
              <Ico name={batteryMood === "low" ? "battery.25" : "cup.and.saucer.fill"} size={56} color={batteryMood === "low" ? "#c0472b" : "#6e4632"} />
              <Text style={styles.amcaBubbleText}>{batteryMood === "low" ? "Senin şarjın da bitiyor, benim de…" : "Şarja takıldık, çay demleniyor."}</Text>
            </View>
          </Animated.View>
        )}
        {KURUKAFA_ON && (
          <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, width: SKULL_BADGE_W, height: SKULL_BADGE_H, alignItems: "center", justifyContent: "center" }, skullBadgeStyle]}>
            {skullHud && (
              <View style={[styles.skullBadge, skullHud.k > 1 ? styles.skullChipUp : styles.skullChipDown]}>
                <Text style={styles.skullBadgeText}>{skullHud.k > 1 ? "⬅️➡️" : "➡️⬅️"} {skullHud.left}</Text>
              </View>
            )}
          </Animated.View>
        )}
        {YARIS_ON && raceOn && raceRef.current?.ghost && (
          <>
            <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, width: GHOST_POSE.w * GHOST_SCALE, height: GHOST_POSE.h * GHOST_SCALE }, ghostBodyStyle]}>
              <CachedImage source={GHOST_POSE.source} cachePolicy="memory-disk" transition={0} contentFit="fill" style={{ width: "100%", height: "100%" }} />
            </Animated.View>
            <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, width: 220, alignItems: "center" }, ghostLabelStyle]}>
              <View style={{ paddingHorizontal: 14, paddingVertical: 4, borderRadius: 18, backgroundColor: "rgba(60,40,120,0.75)" }}>
                <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }} numberOfLines={1}>👻 {raceRef.current.oppName || "Rakip"}</Text>
              </View>
            </Animated.View>
          </>
        )}
        <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0 }, charOpStyle]}>
        <ChargePoses
          pajama={PIJAMA_ON ? pajama : undefined}
          snow={KIS_ON ? snowAmt : undefined}
          nose={KIS_ON ? noseRed : undefined}
          breath={KIS_ON ? breath : undefined}
          winter={KIS_ON ? winterWear : undefined}
          rain={YAGMUR_ON ? rainWear : undefined}
          rainLayers={YAGMUR_ON && rainMounted}
          eventHat={curEvent?.hat ?? null}
          umbrella={SEMSIYE_ON ? umbVis : undefined}
          umbOpen={SEMSIYE_ON ? umbOpen : undefined}
          umbFlip={SEMSIYE_ON ? umbFlip : undefined}
          offsetX={PIJAMA_ON ? walkX : undefined}
          offsetY={PIJAMA_ON ? walkY : undefined}
          px={px}
          py={py}
          poseCharge={poseCharge}
          scale={SPRITE_SCALE * GLOBAL_VISUAL_SCALE * CHAR_SIZE_TRIAL}
          feetCenterOffset={SOLE_CENTER_OFFSET + ANCHOR_SHIFT_PX * SPRITE_SCALE}
          feetHalf={PH / 2}
          // GORSEL-017 ROLLBACK-01 (2026-09-23): landing squash disabled --
          // "önce temel oyun güvenilir olsun". Not passing landPulse makes
          // ChargePoses treat pulse as 0 always (see its optional-prop
          // default), so this is a no-op rather than deleting the feature;
          // the withSequence trigger in the landing-contact block still
          // sets landPulse.value, it's just never read by anything now.
          landPulse={FAZ2_SQUASH ? landPulse : undefined}
          halo={FAZ2_HALO}
          strain={OVERCHARGE ? overT : undefined}
          dirty={SPLAT_ON ? dirty : undefined}
          tepki={BEDEN_ON ? tepki : undefined}
          tepkiP={BEDEN_ON ? tepkiP : undefined}
          dusus={DUSUS_ON ? dusus : undefined}
          phase={phase}
          onLoadStart={() => markArtStarted("character")}
          onLoad={() => { poseLoads.current += 1; if (poseLoads.current >= CHARGE_POSES.length) markArtLoaded("character"); }}
          onError={failArt}
        />
        </Animated.View>

      </Animated.View>

      {ICSES_ON && thought && !gameOver && !menuOpen && (
        <ThoughtBubble key={thought.k} text={thought.text} px={px} py={py} camX={camXR} camY={camYR} />
      )}
      {MAHALLE_ON && speech && !gameOver && !menuOpen && (
        <SpeechBubble key={speech.k} text={speech.text} wx={speech.wx} wy={speech.wy} camX={camXR} camY={camYR} screenW={W} />
      )}

      {/* REVIZYON-022: opaque asset-ready cover; blocks the first frame (and
          input, see charge-surface) until background/district/character loaded. */}
      {coverMounted && (
        <Animated.View testID="asset-ready-cover" pointerEvents={assetsReady ? "none" : "auto"} style={[{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, backgroundColor: OPENING_SKY, overflow: "hidden" }, coverStyle]}>
          <StartCover W={W} H={H} />
        </Animated.View>
      )}

      {/* Full-screen touch layer */}
      <View
        testID="charge-surface"
        style={styles.touch}
        onStartShouldSetResponder={() => !gameOver && assetsReady && !menuOpen}
        onResponderGrant={onPressIn}
        onResponderRelease={onPressOut}
        onResponderTerminate={cancelCharge}
      />

      {BUILD_TAG !== "" && !FAZ1_UI && (
        <View pointerEvents="none" style={{ position: "absolute", left: 6, top: insets.top + 4, paddingHorizontal: 4, backgroundColor: "rgba(0,0,0,0.45)", borderRadius: 4, zIndex: 50 }}>
          <Text style={{ color: "#fff", fontSize: 10 }}>{BUILD_TAG}</Text>
        </View>
      )}
      {PERF_PROBE && <PerfProbeOverlay top={insets.top + 4} sv={{ pFrames, pHitch, pHitchBig, pAirFrames, pAirHitch, pListAir, pHitchNearList, pMaxMs, pHitchIdle, pHitchCharge, pHitchDead, pEvAppear, pEvGone, pEvMove, pListNoHouse, pHitchAppear, pHitchGone, pHitchMove, pHitchListOnly, pHitchNoEvent }} />}
      {ISTANBUL_ON && !POPUP && <PrecipLayer W={W} H={H} weather={shownWeather} active={assetsReady} season={season} />}
      {GORUNUM_REV && !POPUP && (
        <LinearGradient pointerEvents="none" colors={["rgba(58,36,24,0)", "rgba(58,36,24,0.38)"]}
          style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "16%" }} />
      )}
      {SFX_ON && assetsReady && (
        <Pressable
          testID="sfx-toggle"
          accessibilityRole="button"
          accessibilityLabel={sfxMuted ? "Sesi aç" : "Sesi kapat"}
          onPress={() => { toggleSfx(); showToast(sfxMuted ? "Ses açık" : "Ses kapalı"); }}
          hitSlop={12}
          style={({ pressed }) => [styles.sfxBtn, sfxMuted && styles.sfxBtnMuted, { top: insets.top + 30 }, pressed && styles.playBtnPressed]}
        >
          {/* Kullanıcı: "belirsiz" + "o simgeyi değiştirelim" -> iOS hoparlör simgesi; dokununca kısa yazı. */}
          <Ico name={sfxMuted ? "speaker.slash.fill" : "speaker.wave.2.fill"} size={18} color="#fff8ec" />
        </Pressable>
      )}
      {YARIS_ON && raceOn && (
        <Pressable
          testID="race-quit"
          accessibilityRole="button"
          accessibilityLabel="Yarıştan çık"
          onPress={askQuitRace}
          hitSlop={12}
          style={({ pressed }) => [styles.sfxBtn, { right: undefined, left: 14, top: insets.top + 30 }, pressed && styles.playBtnPressed]}
        >
          <Ico name="xmark" size={18} color="#fff8ec" />
        </Pressable>
      )}
      {/* Score HUD */}
      {!gameOver && assetsReady && !menuOpen && !raceResult && <View style={[styles.hud, { top: insets.top + 24 }]} onLayout={(e) => { const l = e.nativeEvent.layout; setHudBottom(l.y + l.height); }}>
        <Text style={[styles.scoreText, (POPUP || nightHud) && styles.puScoreText]} testID="score-value">
          {score}
        </Text>
        <Text style={[styles.bestText, (POPUP || nightHud) && styles.puBestText]} testID="best-value">
          {FAZ1_UI ? (mode === "daily" ? "GÜNÜN REKORU" : "REKOR") : "BEST"} {best}
        </Text>
        {MEYDAN_ON && (challenge || OYUN_SONU_TEST) && <Text style={styles.challengeChip}>⚔️ Hedef {challenge?.target ?? 99}</Text>}
        {OYUN_SONU_TEST && <Text style={[styles.skullChip, styles.skullChipUp]}>💀 GENİŞ kuleler %20 · 5 zıplama</Text>}
        {OYUN_SONU_TEST && <Text style={styles.dailyChip}>📅 Günün haritası · 23 Kasım</Text>}
        {KURUKAFA_ON && skullHud && (
          <Text style={[styles.skullChip, skullHud.k > 1 ? styles.skullChipUp : styles.skullChipDown]} testID="skull-hud">
            💀 {skullHud.k > 1 ? "GENİŞ kuleler" : "DAR kuleler"} %{Math.round(Math.abs(skullHud.k - 1) * 100)} · {skullHud.left} zıplama
          </Text>
        )}
        {DAILY_MAP && mode === "daily" && score > 0 && <Text style={styles.dailyChip}>📅 Günün haritası · {todayLabel()}</Text>}
      </View>}

      {/* GORSEL-017 HOTFIX-01 (2026-09-23): was gated on __DEV__ alone, which
          is true in every dev-client/Expo-Go build (including on a real
          iPhone) -- so this telemetry line rendered on-device regardless of
          DEBUG_MODE. Now requires DEBUG_MODE too, matching every other
          debug surface in this file. */}
      {DEBUG_MODE && __DEV__ && lastJump && (
        <View pointerEvents="none" style={{ position: "absolute", top: insets.top + 116, alignSelf: "center", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.85)" }}>
          <Text style={{ color: "#26383b", fontSize: 12 }}>Son basış: {lastJump.ms} ms · Güç: %{lastJump.percent} · Görsel: %{lastJump.visualPercent} · İlk kare: {lastJump.pressToFirstFrameMs}ms</Text>
        </View>
      )}

      {/* GÜNÜN HARİTASI v2 (2026-11-12, kullanıcı: "serbest oyun / günün oyun
          sekmelerini kendin değiştiremiyorsun ... onun değişmesi gerekir"):
          tur başında (ilk zıplamadan önce) sol üstte mod seçici; dokununca
          harita hemen o moda geçer, oynamak ya da düşmek gerekmez. */}
      {DAILY_MAP && score === 0 && !gameOver && assetsReady && (
        <View pointerEvents="box-none" style={[styles.modeSegWrap, { top: insets.top + 112 }]}>
        <View style={styles.modeSeg} testID="mode-tabs">
          {(["free", "daily"] as const).map((m) => (
            <Pressable
              key={m}
              testID={`mode-tab-${m}`}
              hitSlop={6}
              onPress={() => { if (mode !== m) switchMode(m); }}
              style={[styles.modeSegBtn, mode === m && styles.modeSegBtnOn]}
            >
              <Text style={[styles.modeSegText, mode === m && styles.modeSegTextOn]}>{m === "free" ? "🎲 Serbest" : `📅 ${todayLabel()}`}</Text>
            </Pressable>
          ))}
        </View>
        </View>
      )}
      {/* Hint (only before first jump) */}
      {score === 0 && !gameOver && assetsReady && !raceOn && !menuOpen && !raceResult && runsDone < 3 && (
        <View style={styles.hint}>
          {FAZ1_UI ? (
            <View style={styles.hintPill}>
              <Text style={styles.hintPillText}>Basılı tut… bırak, zıpla!</Text>
            </View>
          ) : (
            <Text style={[styles.hintText, POPUP && styles.puHintText]}>Hold to charge · Release to jump</Text>
          )}
        </View>
      )}

      {DURAK_SEFER && stopBanner && !gameOver && (
        <Animated.View key={`stop-${stopBanner.key}`} entering={FadeIn.duration(180)} exiting={FadeOut.duration(260)} pointerEvents="none"
          style={[styles.stopBannerWrap, { top: insets.top + 108 }]}>
          <View style={[styles.stopSign, stopBanner.pier && styles.stopSignPier]}>
            <Text style={[styles.stopTitle, stopBanner.pier && styles.stopTitlePier]}>{stopBanner.title}</Text>
            {stopBanner.sub !== "" && <Text style={[styles.stopSignSub, stopBanner.pier && styles.stopSignSubPier]}>{stopBanner.sub}</Text>}
          </View>
        </Animated.View>
      )}
      {toast && (
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(300)} pointerEvents="none"
          style={[styles.toastWrap,
            gameOver ? (goCardBottom != null ? { top: goCardBottom + (goInfo.newRecord ? 22 : 8) } : { bottom: insets.bottom + 24 })
              : menuOpen ? { bottom: insets.bottom + 24 }
              : { top: hudBottom != null ? Math.max(insets.top + 64, hudBottom + 8) : insets.top + 150 }]}>
          <Text style={styles.toastText} numberOfLines={gameOver ? 2 : 3} ellipsizeMode="tail">{toast}</Text>
        </Animated.View>
      )}
      {POSTCARDS_ON && arrivalCard !== null && POSTCARDS[arrivalCard - 1] && !gameOver && (
        <Animated.View key={`arr-${arrivalCard}`} entering={FadeIn.duration(220)} exiting={FadeOut.duration(300)} pointerEvents="none"
          style={[styles.arrivalCard, { top: insets.top + 96 }]}>
          <View style={styles.arrivalImg}>
            <CachedImage source={POSTCARDS[arrivalCard - 1].source} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }} contentFit="fill" transition={0} cachePolicy="memory-disk" />
          </View>
          <Text style={styles.arrivalText}>📮 {POSTCARDS[arrivalCard - 1].name}</Text>
        </Animated.View>
      )}
      {DURAK_SEFER && bridgeStrip && !gameOver && (
        <View pointerEvents="none" style={[styles.bridgeWrap, { top: insets.top + 176 }]} testID="bridge-strip">
          <View style={styles.bridgePill}>
            <Text style={styles.bridgeName}>🌉 {bridgeStrip.name}</Text>
            <View style={styles.bridgeRow}>
              <Text style={styles.bridgeSide}>{bridgeStrip.from}</Text>
              <View style={styles.bridgeTrack}>
                <View style={[styles.bridgeFill, { width: `${Math.round(bridgeStrip.progress * 100)}%` }]} />
              </View>
              <Text style={styles.bridgeSide}>{bridgeStrip.to}</Text>
            </View>
          </View>
        </View>
      )}
      {DURAK_SEFER && pierFx > 0 && !gameOver && <PierConfetti key={`pier-${pierFx}`} W={W} H={H} onDone={() => setPierFx(0)} />}
      {/* PERFECT! popup */}
      {perfectVisible && (
        <View style={[styles.perfectWrap, DURAK_SEFER && stopBanner && { top: "34%" }]}>
          <PerfectPop key={`${score}-${landingLabel}`} styles={styles} label={landingLabel} sub={landingSub} big={FAZ1_UI} />
        </View>
      )}

      {/* Debug overlay */}
      {DEBUG_MODE && (
        <View
          style={[styles.debug, { top: insets.top + 60 }]}
         
          testID="debug-overlay"
        >
          <Text style={styles.debugText}>charge {debug.charge}%</Text>
          <Text style={styles.debugText}>vx {debug.vx}</Text>
          <Text style={styles.debugText}>vy {debug.vy}</Text>
          <Text style={styles.debugText}>next dist {debug.dist}</Text>
          <Text style={styles.debugText}>next width {debug.width}</Text>
          <Text style={styles.debugText}>land offset {debug.offset}</Text>
          <Text style={styles.debugText}>fps {debug.fps}</Text>
          <Text style={styles.debugText}>frame p50/p95 {debug.p50}/{debug.p95}ms</Text>
          <Text style={styles.debugText}>dropped {debug.dropped}</Text>
        </View>
      )}

      {/* Game Over — KARTPOSTAL (2026-11-16) */}
      {gameOver && FAZ1_UI && (
        <View style={[styles.overlay, styles.goOverlay, { paddingTop: insets.top + 70 }]} testID="game-over-overlay">
          <Animated.View entering={FadeInDown.duration(380)} style={[styles.pcWrap, styles.goWrap, { maxHeight: Math.min(H - (insets.top + 70) - insets.bottom - 86, 0.6 * H) }]}
            onLayout={(e) => { const l = e.nativeEvent.layout; setGoCardBottom(l.y + l.height); }}>
            <View style={[styles.pcTilt, styles.goShrink]}>
            <View style={[styles.pcCard, styles.goShrink]}>
              <View style={styles.pcAirmail}>
                {Array.from({ length: 18 }).map((_, k) => <View key={k} style={[styles.pcStripe, { backgroundColor: k % 2 ? "#1f4e79" : "#c0472b" }]} />)}
              </View>
              <ScrollView style={styles.goScroll} bounces={false} showsVerticalScrollIndicator={false}>
              <View style={[styles.pcInner, styles.goInner]}>
                <Text style={[styles.pcGreeting, styles.goGreeting]} numberOfLines={1} adjustsFontSizeToFit>İstanbul'dan selamlar</Text>
                <Text style={[styles.pcLabel, styles.goSmLabel]}>{DAILY_MAP && mode === "daily" ? `GÜNÜN HARİTASI · ${todayLabel()}` : "SKOR"}</Text>
                <CountUp to={score} style={[styles.pcScore, styles.goScore]} />
                <Text style={[styles.pcBest, styles.goSmBest]} testID="final-best">
                  {goInfo.newRecord
                    ? `Önceki rekor ${goInfo.prevBest}`
                    : `Rekor ${best}${best - score > 0 ? ` · ${best - score} puan kaldı` : best === score && score > 0 ? " · rekora eşitledin" : ""}`}
                </Text>
            {MEYDAN_ON && challenge ? (
              <View style={[styles.goInfoPill, score > challenge.target ? styles.challengeWin : styles.challengeLose]} testID="challenge-result">
                <Text style={styles.goInfoMain}>
                  {score > challenge.target ? `⚔️ Geçtin! ${score} > ${challenge.target} 🎉` : score === challenge.target ? `⚔️ Berabere: ${score}` : `⚔️ Hedef ${challenge.target} · ${challenge.target - score} puan eksik`}
                </Text>
              </View>
            ) : DURAK_SEFER ? (
              <View style={[styles.pcLine, styles.goSmLine]} testID="stop-summary">
                <Text style={[styles.pcHand, styles.goSmHand]} numberOfLines={1} adjustsFontSizeToFit>
                  📍 {runEnd.stops > 0 ? `${stopName(runEnd.stops)} · ` : ""}{nextStopLine(runEnd.lastTower)}
                </Text>
                {LAKAP_ON && lakapText && (
                  <Text style={[styles.lakapLine, styles.goSmLakap]} numberOfLines={1} adjustsFontSizeToFit testID="lakap-line">🏷️ Lakabın: {lakapText}</Text>
                )}
                {POSTCARDS_ON && runNewCards.length > 0 && (
                  <Text style={styles.goInfoNew}>📮 Yeni kartpostal: {runNewCards.map((k) => POSTCARDS[k - 1]?.name).join(", ")}</Text>
                )}
              </View>
            ) : null}
            {MEYDAN_ON && incoming.length > 0 && (
              <Pressable style={({ pressed }) => [styles.friendPill, pressed && styles.playBtnPressed]} onPress={() => playIncoming(incoming[0])} testID="incoming-challenge">
                <Text style={styles.friendPillText}>{incoming[0].race ? `🏁 ${incoming[0].from || "Bir arkadaşın"} sana 2 dakikalık meydan okudu: ${incoming[0].score}. kule` : `⚔️ ${incoming[0].from || "Bir arkadaşın"} sana meydan okudu: ${incoming[0].score} puan`}</Text>
                <Text style={styles.friendPillGo}>Oyna ›</Text>
              </Pressable>
            )}
            {MEYDAN_ON && friendResults.length > 0 && (
              <Pressable
                style={({ pressed }) => [styles.goInfoPill, raceOutcome(friendResults[0]) < 0 ? styles.challengeLose : styles.challengeWin, pressed && styles.playBtnPressed]}
                onPress={() => { GameCenter.removeChallenge(friendResults[0].matchID); setFriendResults((l) => l.slice(1)); }}
                testID="friend-result"
              >
                <Text style={styles.goInfoMain}>
                  {friendResults[0].race
                    ? `🏁 ${friendResults[0].replier || "Arkadaşın"} meydan okumanı oynadı: ${friendResults[0].reply ?? 0}. kule (sen ${friendResults[0].score}) — ${raceOutcome(friendResults[0]) < 0 ? "seni geçti!" : raceOutcome(friendResults[0]) === 0 ? "berabere" : "geçemedi 🎉"}`
                    : `⚔️ ${friendResults[0].replier || "Arkadaşın"} senin ${friendResults[0].score} puanını oynadı: ${friendResults[0].reply ?? 0} — ${(friendResults[0].reply ?? 0) > friendResults[0].score ? "seni geçti!" : (friendResults[0].reply ?? 0) === friendResults[0].score ? "berabere" : "geçemedi 🎉"}`}
                </Text>
                <Text style={styles.goInfoNew}>tamam ✓</Text>
              </Pressable>
            )}
            {QUIP_ON && <View style={styles.bubble}>
              <Text style={styles.bubbleText} testID="game-over-line">{quip}</Text>
              <View style={styles.bubbleTail} />
            </View>}
                <Pressable
                  testID="play-again-button"
                  style={({ pressed }) => [styles.trPlayBtn, styles.pcTicket, styles.goPlayBtn, pressed && styles.playBtnPressed]}
                  onPress={restart}
                >
                  <View pointerEvents="none" style={[styles.pcNotch, { left: -9 }]} /><View pointerEvents="none" style={[styles.pcNotch, { right: -9 }]} />
                  <Text style={styles.playBtnText}>{MEYDAN_ON && challenge ? "Aynı haritada tekrar" : "Bir daha"}</Text>
                </Pressable>
                {MEYDAN_ON && challenge && (
                  <Pressable onPress={leaveChallenge} hitSlop={8}>
                    <Text style={styles.goLink}>Serbest oyuna dön</Text>
                  </Pressable>
                )}
                <View style={[styles.pcIconRow, styles.goSmIconRow]}>
                  {SHARE_CARD_ON && Platform.OS === "ios" && (
                    <Pressable testID="share-card" style={({ pressed }) => [styles.pcIconBtn, pressed && styles.playBtnPressed]} onPress={() => setShareOpen(true)}>
                      <View style={[styles.pcIconCircle, styles.goSmIcon]}><Ico name="square.and.arrow.up" size={22} color="#2f7d4f" /></View>
                      <Text style={styles.pcIconLabel}>Paylaş</Text>
                    </Pressable>
                  )}
                  {MEYDAN_ON && (
                    <Pressable testID="challenge-share" style={({ pressed }) => [styles.pcIconBtn, pressed && styles.playBtnPressed]} onPress={YARIS_ON ? startMeydan : () => { setSheetMode("score"); askChallenge(); }}>
                      <View style={[styles.pcIconCircle, styles.goSmIcon]}><Ico name="flag.2.crossed.fill" size={22} color="#c0472b" /></View>
                      <Text style={styles.pcIconLabel}>Meydan oku</Text>
                    </Pressable>
                  )}
                  {GAME_CENTER_ON && GameCenter.gameCenterAvailable && (
                    <Pressable testID="leaderboard-button" style={({ pressed }) => [styles.pcIconBtn, pressed && styles.playBtnPressed]} onPress={openLeaderboard}>
                      <View style={[styles.pcIconCircle, styles.goSmIcon]}><Ico name="trophy.fill" size={22} color="#b8862b" /></View>
                      <Text style={styles.pcIconLabel}>Sıralama</Text>
                    </Pressable>
                  )}
                </View>
                {MENU_ON && (
                  <Pressable onPress={() => { restart(); setMenuOpen(true); }} hitSlop={8} testID="go-menu" style={[styles.linkRow, styles.goSmLink]}>
                    <Ico name="house.fill" size={14} color="#c0472b" />
                    <Text style={[styles.goLink, { marginTop: 0 }]}>Ana menü</Text>
                  </Pressable>
                )}
              </View>
              </ScrollView>
            </View>
            {/* Pul: mevcut Galata kartpostalı */}
            <View pointerEvents="none" style={[styles.pcStamp, styles.goStamp]}>
              <CachedImage source={PC_STAMP} contentFit="cover" style={{ width: "100%", height: "100%" }} />
            </View>
            {/* Amcanın ifadeli kafası, çıkartma */}
            <View pointerEvents="none" style={[styles.pcSticker, styles.goSticker]}>
              <CachedImage
                source={goInfo.newRecord ? PC_STICKER.rec : score === 0 || score < best * 0.3 ? PC_STICKER.low : PC_STICKER.mid}
                contentFit="fill"
                style={{ position: "absolute", width: 84, height: 84 * 1103 / 516, left: -7, top: -5 }}
              />
            </View>
            {goInfo.newRecord && <Postmark delay={countUpMs(score)} styles={styles} small />}
            </View>
          </Animated.View>
        </View>
      )}

      {/* PAYLAŞIM KARTPOSTALI (2026-11-18): oyun sonu kartının üstünde, ekranın tamamı */}
      {SHARE_CARD_ON && gameOver && shareOpen && (() => {
        const k = runEnd.stops;
        const trNow = new Date(Date.now() + 3 * 3600 * 1000);
        const hh = String(trNow.getUTCHours()).padStart(2, "0");
        const mm = String(trNow.getUTCMinutes()).padStart(2, "0");
        return (
          <ShareSheet
            score={score}
            newRecord={goInfo.newRecord}
            place={reachedLine(k)}
            photo={POSTCARDS_ON && k >= 1 && k <= POSTCARDS.length ? POSTCARDS[k - 1].source : PC_STAMP}
            sticker={goInfo.newRecord ? PC_STICKER.rec : score === 0 || score < best * 0.3 ? PC_STICKER.low : PC_STICKER.mid}
            stamp={shownWeather && !shownWeather.test ? weatherStamp(shownWeather, TR_MONTHS_TITLE) : `${trNow.getUTCDate()} ${TR_MONTHS_TITLE[trNow.getUTCMonth()]}, İstanbul`}
            time={`${hh}:${mm}`}
            lakap={LAKAP_ON ? lakapText : null}
            onClose={() => setShareOpen(false)}
          />
        );
      })()}
      {HANIM_ON && hanim && !shareOpen && !menuOpen && (
        <HanimBanner text={hanim} top={insets.top + 6} onClose={() => { if (hanimTimer.current) clearTimeout(hanimTimer.current); setHanim(null); }} />
      )}
      {MENU_ON && menuOpen && assetsReady && !gameOver && (
        <View style={[styles.menuOverlay, { paddingTop: insets.top + 46 }]} testID="start-menu">
          {/* TASARIM 2026-11-16: başlık gökyüzünde, kart küçük; amca ve kuleler aşağıda görünür kalır. */}
          <Text style={styles.menuTitle} onPress={OZEL_GUN_TEST_TAP ? () => { setEventTest((v) => (v + 1 >= OZEL_GUN_TEST_ORDER.length ? -1 : v + 1)); setEventDay(todaysEvent()); } : undefined} suppressHighlighting>BYZANTION</Text>
          {curEvent ? null : <Text style={styles.menuSub}>Amcayla İstanbul çatılarında</Text>}
          {BUILD_TAG !== "" && <Text style={styles.menuTag}>{BUILD_TAG}</Text>}
          {curEvent && (
            <Animated.View key={curEvent.id} entering={FadeIn.duration(320)} style={styles.eventPill} testID="event-pill">
              <Text style={styles.eventPillText} numberOfLines={1} adjustsFontSizeToFit>{curEvent.title}{eventTest >= 0 ? " (önizleme)" : ""}</Text>
            </Animated.View>
          )}
          {/* KARTPOSTAL MENÜ (2026-11-16): oyun sonuyla aynı dil — hava postası şeridi, pul, bilet "Oyna". */}
          <Animated.View style={styles.pcWrap}>
            <View style={styles.pcTiltR}>
              <View style={styles.pcCard}>
                <View style={styles.pcAirmail}>
                  {Array.from({ length: 18 }).map((_, k) => <View key={k} style={[styles.pcStripe, { backgroundColor: k % 2 ? "#1f4e79" : "#c0472b" }]} />)}
                </View>
                <View style={[styles.pcInner, { paddingTop: 10, paddingBottom: 8 }]}>
                  <Text style={[styles.pcHand, styles.pcMenuNote]} numberOfLines={1} adjustsFontSizeToFit>Sevgili amca, bugün hangi durağa?</Text>
                  <View style={styles.pcMenuRow}>
                  {best > 0 && <Text style={[styles.pcBest, { marginBottom: 0, fontSize: 17 }]}>Rekor {best}</Text>}
                  {ISTANBUL_ON && (
                    <Pressable
                      testID="menu-weather"
                      disabled={!WEATHER_TEST_TAP}
                      hitSlop={6}
                      onPress={() => setWeatherTest((i) => (i + 1 >= WEATHER_TEST_CYCLE.length ? -1 : i + 1))}
                      onLongPress={() => setSceneTest((k) => (k + 1) % 3)}
                      style={styles.pcWeatherRow}
                    >
                      <Ico name={shownWeather?.kind === "yagmur" ? "cloud.rain.fill" : shownWeather?.kind === "kar" ? "cloud.snow.fill" : shownWeather?.kind === "sis" ? "cloud.fog.fill"
                        : shownWeather?.wind ? "wind" : shownWeather?.kind === "bulutlu" ? "cloud.fill" : isNightNow ? (moon.full ? "moon.stars.fill" : "moon.fill") : "sun.max.fill"} size={16} color="#1f4e79" />
                      <Text style={styles.pcWeatherText} numberOfLines={1} adjustsFontSizeToFit>
                        {shownWeather ? weatherStamp(shownWeather, TR_MONTHS_TITLE) : "İstanbul"}{isNightNow && moon.full ? ", Dolunay" : ""}{testEntry?.season ? `, ${SEASON_NAME[testEntry.season]}` : ""}{shownWeather?.test || sceneTest ? " (deneme)" : ""}
                      </Text>
                    </Pressable>
                  )}
                  {ISTANBUL_ON && shownWeather?.src === "apple" && !shownWeather.test && (
                    <Pressable hitSlop={6} onPress={() => Linking.openURL(shownWeather.legalUrl || "https://weatherkit.apple.com/legal-attribution.html").catch(() => {})} testID="weather-attribution">
                      <Text style={styles.pcWeatherAttr}>{"\uF8FF"}Weather</Text>
                    </Pressable>
                  )}
                  </View>
                  {MEYDAN_ON && incoming.length > 0 && (
                    <Pressable style={({ pressed }) => [styles.friendPill, pressed && styles.playBtnPressed]} onPress={() => playIncoming(incoming[0])} testID="menu-incoming">
                      <Text style={styles.friendPillText}>{incoming[0].race ? `${incoming[0].from || "Bir arkadaşın"} sana 2 dakikalık meydan okudu: ${incoming[0].score}. kule` : `${incoming[0].from || "Bir arkadaşın"} sana meydan okudu: ${incoming[0].score} puan`}</Text>
                      <Text style={styles.friendPillGo}>Oyna ›</Text>
                    </Pressable>
                  )}
                  <Pressable testID="menu-play" style={({ pressed }) => [styles.trPlayBtn, styles.iconBtn, styles.pcTicket, { marginTop: 8 }, pressed && styles.playBtnPressed]} onPress={() => { setMenuOpen(false); announceDay(); }}>
                    <View pointerEvents="none" style={[styles.pcNotch, { left: -9 }]} /><View pointerEvents="none" style={[styles.pcNotch, { right: -9 }]} />
                    <Ico name="play.fill" size={20} color="#fff8ec" />
                    <Text style={styles.playBtnText}>Oyna</Text>
                  </Pressable>
                  {YARIS_ON && MEYDAN_ON && (
                    <Pressable testID="menu-race" style={({ pressed }) => [styles.modeBtn, styles.iconBtn, pressed && styles.playBtnPressed]} onPress={startMeydan}>
                      <Ico name="flag.2.crossed.fill" size={18} color="#c0472b" />
                      <Text style={[styles.modeBtnText, { color: "#c0472b" }]}>Meydan oku · 2 dakika</Text>
                    </Pressable>
                  )}
                  <View style={[styles.pcIconRow, { marginTop: 10 }]}>
                    {MEYDAN_ON && (
                      <Pressable testID="menu-code" style={({ pressed }) => [styles.pcIconBtn, pressed && styles.playBtnPressed]} onPress={() => { setCodeError(""); setCodeOpen(true); }}>
                        <View style={[styles.pcIconCircle, styles.pcIconCircleSm]}><Ico name="key.fill" size={22} color="#6e4632" /></View>
                        <Text style={styles.pcIconLabel}>Kod gir</Text>
                      </Pressable>
                    )}
                    {GAME_CENTER_ON && GameCenter.gameCenterAvailable && (
                      <Pressable testID="menu-leaderboard" style={({ pressed }) => [styles.pcIconBtn, pressed && styles.playBtnPressed]} onPress={openLeaderboard}>
                        <View style={[styles.pcIconCircle, styles.pcIconCircleSm]}><Ico name="trophy.fill" size={22} color="#b8862b" /></View>
                        <Text style={styles.pcIconLabel}>Sıralama</Text>
                      </Pressable>
                    )}
                    {POSTCARDS_ON && (
                      <Pressable testID="menu-album" style={({ pressed }) => [styles.pcIconBtn, pressed && styles.playBtnPressed]} onPress={() => setAlbumOpen(true)}>
                        <View style={[styles.pcIconCircle, styles.pcIconCircleSm]}><Ico name="envelope.fill" size={22} color="#c0472b" /></View>
                        <Text style={styles.pcIconLabel}>Kartpostal {unlocked.length}/{POSTCARDS.length}</Text>
                      </Pressable>
                    )}
                    {MAHALLE_ON && (
                      <Pressable testID="menu-cats" style={({ pressed }) => [styles.pcIconBtn, pressed && styles.playBtnPressed]} onPress={() => setCatBook(true)}>
                        <View style={[styles.pcIconCircle, styles.pcIconCircleSm]}><Ico name="pawprint.fill" size={22} color="#c77a2c" /></View>
                        <Text style={styles.pcIconLabel}>Kediler {cats.length}/{KEDI_ADLARI.length}</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
              <View pointerEvents="none" style={styles.pcStamp}>
                <CachedImage source={PC_STAMP} contentFit="cover" style={{ width: "100%", height: "100%" }} />
              </View>
            </View>
          </Animated.View>
        </View>
      )}
      {YARIS_ON && raceOn && (
        <RaceHud raceRef={raceRef} ghostRef={ghostRef} towerRef={lastTowerRef} tick={advanceGhost} onTimeUp={endRace} bottom={insets.bottom + 14} />
      )}
      {YARIS_ON && raceResult && (
        <View style={styles.overlay} testID="race-result">
          {/* KARTPOSTAL YARIŞ SONU (2026-11-16): iki küçük kartpostal, kazanana damga. */}
          <Animated.View entering={FadeInDown.duration(380)} style={styles.pcWrap}>
            <View style={styles.pcTilt}>
              <View style={styles.pcCard}>
                <View style={styles.pcAirmail}>
                  {Array.from({ length: 18 }).map((_, k) => <View key={k} style={[styles.pcStripe, { backgroundColor: k % 2 ? "#1f4e79" : "#c0472b" }]} />)}
                </View>
                <View style={styles.pcInner}>
                  {(() => {
                    const { me, opp, oppName } = raceResult;
                    const out = opp ? compareRace(me, opp) : 0;
                    const title = !opp ? "Yarış bitti" : out > 0 ? "Kazandın!" : out < 0 ? `${oppName || "Rakip"} kazandı` : "Berabere";
                    const color = !opp ? "#2a1b12" : out > 0 ? "#2f7d32" : out < 0 ? "#c0472b" : "#6e4632";
                    const mini = (who: string, r: RaceSummary, win: boolean, ghost: boolean, tilt: string) => (
                      <View style={[styles.pcMini, { transform: [{ rotate: tilt }] }, ghost && { opacity: 0.8 }]}>
                        <Text style={styles.pcMiniWho} numberOfLines={1}>{ghost ? "👻 " : ""}{who}</Text>
                        <Text style={styles.pcMiniBig} numberOfLines={1} adjustsFontSizeToFit>{r.far}. kule</Text>
                        <Text style={styles.pcMiniSmall}>en iyi {r.best} puan</Text>
                        <Text style={styles.pcMiniSmall}>{r.runs} deneme</Text>
                        {win && <Postmark delay={250} styles={styles} label="KAZANDI" small />}
                      </View>
                    );
                    return (
                      <>
                        <Text style={styles.pcGreetingC} numberOfLines={1} adjustsFontSizeToFit>2 dakikalık meydan okuma</Text>
                        <Text style={[styles.pcVerdict, { color }]} numberOfLines={1} adjustsFontSizeToFit>{title}</Text>
                        {!opp && <Text style={[styles.pcHand, { fontSize: 16 }]}>Arkadaşına gönder, hayaletinle yarışsın</Text>}
                        <View style={styles.pcMiniRow}>
                          {mini("Sen", me, !!opp && out > 0, false, "-3deg")}
                          {opp && mini(oppName || "Rakip", opp, out < 0, true, "3deg")}
                        </View>
                        <Text style={styles.raceNote}>Kazanan: tek koşuda en uzak kule · eşitlikte en iyi puan</Text>
                      </>
                    );
                  })()}
                  {MEYDAN_ON && (
                    <Pressable style={({ pressed }) => [styles.trPlayBtn, styles.iconBtn, styles.pcTicket, { marginTop: 12 }, pressed && styles.playBtnPressed]} onPress={() => { setSheetMode("race"); askChallenge(); }} testID="race-send">
                      <View pointerEvents="none" style={[styles.pcNotch, { left: -9 }]} /><View pointerEvents="none" style={[styles.pcNotch, { right: -9 }]} />
                      <Ico name="paperplane.fill" size={18} color="#fff8ec" />
                      <Text style={styles.playBtnText}>Arkadaşına gönder</Text>
                    </Pressable>
                  )}
                  <View style={styles.pcIconRow}>
                    <Pressable style={({ pressed }) => [styles.pcIconBtn, pressed && styles.playBtnPressed]} onPress={() => startRace({ seed: raceResult.seed, ghost: decodeRace(raceResult.race), oppName: "Önceki sen" })} testID="race-self-ghost">
                      <View style={styles.pcIconCircle}><Ico name="arrow.counterclockwise" size={22} color="#6e4632" /></View>
                      <Text style={styles.pcIconLabel}>Hayaletinle tekrar</Text>
                    </Pressable>
                    <Pressable style={({ pressed }) => [styles.pcIconBtn, pressed && styles.playBtnPressed]} onPress={() => startRace({})} testID="race-new">
                      <View style={styles.pcIconCircle}><Ico name="flag.checkered" size={22} color="#1f4e79" /></View>
                      <Text style={styles.pcIconLabel}>Yeni meydan okuma</Text>
                    </Pressable>
                  </View>
                  <Pressable onPress={() => { closeRace(); setMenuOpen(true); }} hitSlop={8} testID="race-close" style={styles.linkRow}>
                    <Ico name="house.fill" size={14} color="#c0472b" />
                    <Text style={[styles.goLink, { marginTop: 0 }]}>Ana menü</Text>
                  </Pressable>
                </View>
              </View>
              <View pointerEvents="none" style={styles.pcStamp}>
                <CachedImage source={PC_STAMP} contentFit="cover" style={{ width: "100%", height: "100%" }} />
              </View>
            </View>
          </Animated.View>
        </View>
      )}
      {MEYDAN_ON && friendSheet && (
        <View style={styles.albumOverlay} testID="friend-sheet">
          <View style={styles.albumCard}>
            <Text style={styles.albumTitle}>Kime meydan okuyalım?</Text>
            <Text style={styles.albumSub}>{sheetMode === "race" && raceResult ? `2 dakikalık meydan okumanı (${raceResult.me.far}. kule) ve hayaletini gönder` : `${score} puanını ve bu haritayı gönder`}</Text>
            <ScrollView style={{ maxHeight: 360, marginTop: 8 }}>
              {friendsMsg && <Text style={styles.friendMsg}>{friendsMsg}</Text>}
              {friends.map((f) => (
                <Pressable key={f.id} disabled={sendingTo !== null} style={({ pressed }) => [styles.friendRow, pressed && styles.playBtnPressed]} onPress={() => sendToFriend(f)}>
                  <View style={styles.friendAvatar}><Text style={styles.friendAvatarText}>{(f.alias || f.name || "?").slice(0, 1).toUpperCase()}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.friendName} numberOfLines={1}>{f.alias || f.name}</Text>
                    {f.score != null && <Text style={styles.friendScore}>🏆 En yüksek: {f.score} puan</Text>}
                  </View>
                  <Text style={styles.friendGo}>{sendingTo === f.id ? "…" : "Gönder ›"}</Text>
                </Pressable>
              ))}
            </ScrollView>
            {sheetMode === "score" && (
              <View style={styles.goCodeRow} testID="challenge-code-show">
                <Text style={styles.goCodeLabel}>Harita kodu</Text>
                <Text style={styles.goCodeValue} selectable>{makeCode(seedRef.current, score)}</Text>
                <Pressable
                  testID="copy-code"
                  hitSlop={10}
                  style={({ pressed }) => [styles.goCopyBtn, pressed && styles.playBtnPressed]}
                  onPress={() => {
                    const ok = GameCenter.copyText(makeCode(seedRef.current, score));
                    setCopied(ok);
                    if (copiedTimer.current) clearTimeout(copiedTimer.current);
                    copiedTimer.current = setTimeout(() => setCopied(false), 1500);
                  }}
                >
                  <Ico name={copied ? "checkmark" : "doc.on.doc"} size={16} />
                </Pressable>
              </View>
            )}
            <Pressable style={({ pressed }) => [styles.modeBtn, styles.iconBtn, pressed && styles.playBtnPressed]} onPress={() => { setFriendSheet(false); shareChallenge(); }}>
              <Ico name="square.and.arrow.up" size={17} color="#c0472b" />
              <Text style={styles.modeBtnText}>Kodu paylaş (WhatsApp, mesaj…)</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.modeBtn, pressed && styles.playBtnPressed]} onPress={() => setFriendSheet(false)}>
              <Text style={styles.modeBtnText}>Kapat</Text>
            </Pressable>
          </View>
        </View>
      )}
      {MEYDAN_ON && codeOpen && (
        <View style={styles.albumOverlay} testID="code-modal">
          <View style={styles.albumCard}>
            <Text style={styles.albumTitle}>🔑 Meydan okuma kodu</Text>
            <Text style={styles.albumSub}>Arkadaşının gönderdiği kodu yaz ya da mesajın tamamını yapıştır (örn. 1K9Z0QX-37)</Text>
            <TextInput
              value={codeText}
              onChangeText={(t) => { setCodeText(t); setCodeError(""); }}
              autoCapitalize="characters"
              autoCorrect={false}
              placeholder="KOD-PUAN"
              placeholderTextColor="#b8a17e"
              style={styles.codeInput}
              onSubmitEditing={startChallenge}
              returnKeyType="go"
              autoFocus
            />
            {codeError !== "" && <Text style={styles.codeError}>{codeError}</Text>}
            <Pressable style={({ pressed }) => [styles.trPlayBtn, pressed && styles.playBtnPressed]} onPress={startChallenge}>
              <Text style={styles.playBtnText}>Aynı haritada başla</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.modeBtn, pressed && styles.playBtnPressed]} onPress={() => setCodeOpen(false)}>
              <Text style={styles.modeBtnText}>Vazgeç</Text>
            </Pressable>
          </View>
        </View>
      )}
      {MAHALLE_ON && catBook && (
        <View style={styles.albumOverlay} testID="cat-book">
          <View style={styles.albumCard}>
            <Text style={styles.albumTitle}>🐈 Kedi defteri</Text>
            <Text style={styles.albumSub}>{cats.length}/{KEDI_ADLARI.length} · çatılardaki kedilerin yanına in, tanış</Text>
            <ScrollView contentContainerStyle={styles.albumGrid}>
              {KEDI_ADLARI.map((name, n) => {
                const met = cats.includes(name);
                const gor = kediGorunumNo(n);
                return (
                  <View key={name} style={styles.albumItem}>
                    {met ? (
                      <View style={[styles.albumImg, { backgroundColor: "#f6ead2", alignItems: "center", justifyContent: "center" }]}>
                        <Image source={gor === 0 ? KEDI_SOURCE : gor === 1 ? KEDI_GRI_SOURCE : KEDI_YENI[gor - 2].src} style={{ width: "86%", height: "70%" }} resizeMode="contain" fadeDuration={0} />
                      </View>
                    ) : (
                      <View style={[styles.albumImg, styles.albumLocked]}><Text style={styles.albumLockedText}>?</Text></View>
                    )}
                    <Text style={styles.albumName}>{met ? name : "???"}</Text>
                  </View>
                );
              })}
            </ScrollView>
            <Pressable style={({ pressed }) => [styles.trPlayBtn, pressed && styles.playBtnPressed]} onPress={() => setCatBook(false)}>
              <Text style={styles.playBtnText}>Kapat</Text>
            </Pressable>
          </View>
        </View>
      )}
      {POSTCARDS_ON && albumOpen && (
        <View style={styles.albumOverlay} testID="album">
          <View style={styles.albumCard}>
            <Text style={styles.albumTitle}>📮 Kartpostallar</Text>
            <Text style={styles.albumSub}>{unlocked.length}/{POSTCARDS.length} · her yeni durak bir kartpostal</Text>
            <ScrollView contentContainerStyle={styles.albumGrid}>
              {POSTCARDS.map((pc) => {
                const open = unlocked.includes(pc.stop);
                return (
                  <Pressable key={pc.stop} style={styles.albumItem} disabled={!open} onPress={() => setBigCard(pc.stop)}>
                    {open ? (
                      <View style={styles.albumImg}>
                        <CachedImage source={pc.source} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }} contentFit="fill" transition={0} cachePolicy="memory-disk" />
                      </View>
                    ) : (
                      <View style={[styles.albumImg, styles.albumLocked]}><Text style={styles.albumLockedText}>?</Text></View>
                    )}
                    <Text style={styles.albumName}>{open ? pc.name : `${stopTowerId(pc.stop)}. kule`}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <Pressable style={({ pressed }) => [styles.trPlayBtn, pressed && styles.playBtnPressed]} onPress={() => { setBigCard(null); setAlbumOpen(false); }}>
              <Text style={styles.playBtnText}>Kapat</Text>
            </Pressable>
          </View>
        </View>
      )}
      {POSTCARDS_ON && albumOpen && bigCard !== null && POSTCARDS[bigCard - 1] && (
        <Pressable style={styles.bigCardOverlay} onPress={() => setBigCard(null)} testID="big-card">
          <View style={styles.bigCardFrame}>
            <View style={styles.bigCardImg}>
              <CachedImage source={POSTCARDS[bigCard - 1].source} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }} contentFit="fill" transition={0} cachePolicy="memory-disk" />
              <View style={styles.bigCardStamp}>
                <Text style={styles.bigCardName}>{POSTCARDS[bigCard - 1].name}</Text>
                <Text style={styles.bigCardSub}>{POSTCARDS[bigCard - 1].sub}</Text>
              </View>
            </View>
            <Text style={styles.bigCardNote}>“{POSTCARDS[bigCard - 1].note}”</Text>
            <Text style={styles.bigCardSign}>— Amcadan selamlar</Text>
          </View>
        </Pressable>
      )}
      {gameOver && !FAZ1_UI && (
        <View style={styles.overlay} testID="game-over-overlay">
          <View style={styles.card}>
            <Text style={styles.gameOverTitle}>Game Over</Text>
            <Text style={styles.statLabel}>SCORE</Text>
            <Text style={styles.statValue} testID="final-score">
              {score}
            </Text>
            <Text style={styles.finalBest} testID="final-best">
              BEST {best}
            </Text>
            <Text style={styles.gameOverLine} testID="game-over-line">
              {GAME_OVER_LINE}
            </Text>
            {FRAME_DIAG && SHOW_DIAG_TEXT && diagText !== "" && (
              <Text testID="r068-diag" style={{ fontSize: 9, color: "#333", marginBottom: 8 }}>{diagText}</Text>
            )}
            <Pressable
              testID="play-again-button"
              style={({ pressed }) => [
                styles.playBtn,
                pressed && styles.playBtnPressed,
              ]}
              onPress={restart}
            >
              <Text style={styles.playBtnText}>Play Again</Text>
            </Pressable>
          </View>
        </View>
      )}
        </>
      )}
      {DEBUG_MODE && __DEV__ && showArtTiming && (
        <View style={styles.artTiming}>
          <Text style={styles.artLoadingText}>Görsel yükleme ölçümü</Text>
          <Text style={styles.artTimingText}>Başlangıç → hazır / yükleme olayı süresi</Text>
          {([["background", "Manzara"], ["bricks", "Tuğla"], ["character", "Karakter"]] as const).map(([id, label]) => {
            const clock = artTimings;
            const end = clock.ends[id];
            const start = clock.starts[id];
            return <Text key={id} style={styles.artTimingText}>{label}: {end === undefined ? "Yükleme bildirimi bekleniyor" : `${Math.round(end)} ms`} / {start === undefined || end === undefined ? "—" : `${Math.round(end - start)} ms`}</Text>;
          })}
          <Text style={styles.artTimingText}>{artReady ? `Tüm görseller hazır: ${Math.round(Math.max(...Object.values(artTimings.ends)))} ms` : "Ölçüm sürüyor; oyuna giriş engellenmiyor."}</Text>
          {artError && <Text style={styles.artTimingText}>Bir görsel yükleme hatası bildirildi.</Text>}
          <Text style={styles.artTimingText}>Süreler eşzamanlıdır, toplanmaz. Expo açılışı dahil değildir.</Text>
          <Pressable accessibilityRole="button" onPress={() => setShowArtTiming(false)}><Text style={styles.artLoadingText}>Kapat</Text></Pressable>
        </View>
      )}
      {/* GORSEL-016: the old always-on smoke mount-probe/debug panel (magenta
          dot + "[smoke-debug]" text, previously rendered unconditionally
          under __DEV__ regardless of DEBUG_MODE) is removed along with the
          smoke effect itself. The pose dev-freeze buttons are unrelated to
          smoke and stay, but now also require DEBUG_MODE -- GORSEL-017
          HOTFIX-01 (2026-09-23): the user's real-iPhone screenshot showed
          these charge-percent boxes rendering in the top-right corner on
          device, because __DEV__ alone is true in any dev-client/Expo-Go
          build, DEBUG_MODE or not. */}
      {DEBUG_MODE && __DEV__ && (
        <View style={styles.poseDevRow}>
          {[0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1, -1].map(v => (
            <Pressable key={v} onPress={() => { poseOverride.value = v; }} style={styles.poseDevBtn}>
              <Text style={styles.artTimingText}>{v < 0 ? "OFF" : String(v * 100)}</Text>
            </Pressable>
          ))}
        </View>
      )}

    </View>
  );
}

// ---------------------------------------------------------------------------
// A single pooled platform view. Reads its slot from the shared array every
// time the shared platform array changes.
// ---------------------------------------------------------------------------
// REVIZYON-023: static, blurred preview of the very first frame (Bosphorus
// skyline + sea + connected rooftop district), laid out exactly like the live
// start camera, shown while the live layers finish loading. Same sources as
// the live scene (already preloaded/cached), no character, no input.
function StartCover({ W, H }: { W: number; H: number }) {
  const s = CONFIG.cameraZoom;
  if (POPUP) {
    const bh = (H * PU_BACKDROP_H) / (PU_BACKDROP_H - PU_BACKDROP_PAD);
    const bw = (bh * PU_BACKDROP_W) / PU_BACKDROP_H;
    return (
      <>
        <View style={{ position: "absolute", left: 0, top: 0, width: W, height: H, backgroundColor: PU_SKY_TOP }} />
        <CachedImage source={PU_BACKDROP_SOURCE} cachePolicy="memory-disk" priority="high" transition={0} blurRadius={3}
          contentFit="fill" style={{ position: "absolute", left: (W - bw) / 2, top: -(bh - H), width: bw, height: bh }} />
      </>
    );
  }
  if (OPENING_SKY) return null; // AÇILIŞ 2026-11-17: düz gökyüzü rengi (örtünün kendi rengi)
  const camX0 = CONFIG.startTowerWidth / 2 - (CONFIG.cameraStartFraction * W) / s;
  const bgScale = Math.max(W / BG_IMG_W, H / BG_IMG_H) * BG_FAR_OVERSCAN;
  const bgW = BG_IMG_W * bgScale;
  const bgH = BG_IMG_H * bgScale;
  const maxShift = Math.max(0, (bgW - W) / 2);
  const shift = Math.min(maxShift, Math.max(-maxShift, -camX0 * s * BG_FAR_PARALLAX_RATIO));
  const offX = camX0 * (1 - BACK_DISTRICT_PARALLAX);
  const base = Math.floor((camX0 * BACK_DISTRICT_PARALLAX) / BACK_TILE_W);
  const top = (DISTRICT_TOP_Y + (CONFIG.cameraPlayerAnchorY * H) / s) * s;
  return (
    <>
      <CachedImage source={MASTER_NEIGHBORHOOD_SOURCE} cachePolicy="memory-disk" priority="high" transition={0} blurRadius={6}
        contentFit="fill" style={{ position: "absolute", left: (W - bgW) / 2 + shift, top: (BG_SEA_END_WORLD_Y + (CONFIG.cameraPlayerAnchorY * H) / s) * s - BG_SEA_END_ROW * bgScale, width: bgW, height: bgH }} />
      {SHOW_BACK_DISTRICT && [0, 1].map((k) => (
        <CachedImage key={k} source={DISTRICT_SOURCE} cachePolicy="memory-disk" priority="high" transition={0} blurRadius={4}
          contentFit="fill" style={{ position: "absolute", left: (offX + (base + k) * BACK_TILE_W - (k ? 1.5 : 0) - camX0) * s, top, width: BACK_TILE_W * s, height: BACK_TILE_H * s }} />
      ))}
    </>
  );
}

// REVIZYON-054: one house per pool slot (see HOUSE_* constants). Every View
// and Image is always mounted; only continuous geometry (position/width/
// crop offsets) follows the slot's current platform, so a recycled slot never
// swaps native surfaces (the R037/R038 iOS ghost-surface lesson). Pure render:
// reads p.x/p.topY/p.width/p.id and the neighbours' x/width, writes nothing.
// REVIZYON-061: the pool views are memo()'d. Every GameScreen re-render
// (setScore on each landing, setLastJump on each release in dev builds) used
// to re-render all 14 houses; their animated styles close over functions
// re-created per render (geom/colPos), so Reanimated stopped and restarted
// ~13 mappers per house on the UI thread at takeoff and landing. Props here
// are a SharedValue, the memoized StyleSheet and stable callbacks.
// İSKELE ANI konfetisi: yalnız iskele durağında ~1,9 sn takılı kalır, sonra kendini kaldırır.
// Tek paylaşılan ilerleme değeri; her parça yalnız transform/opaklık (gölge, maske yok).
function ConfettiPiece({ t, q, W, H }: any) {
  const st = useAnimatedStyle(() => {
    const k = Math.max(0, Math.min(1, (t.value - q.delay) / (1 - q.delay)));
    return {
      opacity: k <= 0 ? 0 : k > 0.85 ? (1 - k) / 0.15 : 1,
      transform: [
        { translateX: (q.x + q.drift * k) * W },
        { translateY: -30 + k * H * 0.75 },
        { rotate: `${q.rot * k}deg` },
      ],
    };
  });
  return <Animated.View style={[{ position: "absolute", left: 0, top: 0, width: q.size, height: q.size * 0.6, backgroundColor: q.c }, st]} />;
}
function PierConfetti({ W, H, onDone }: { W: number; H: number; onDone: () => void }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withTiming(1, { duration: 1900, easing: Easing.out(Easing.quad) });
    const id = setTimeout(onDone, 2000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, zIndex: 45 }}>
      {CONFETTI.map((q, i) => <ConfettiPiece key={i} t={t} q={q} W={W} H={H} />)}
    </View>
  );
}

const PlatformHouseView = memo(function PlatformHouseView({ index, platforms, styles, probe, roofWx, cepheHal, kediTitre, kediNefes, woken, look, kTick, kGone, kAmcaX }: any) {
  // REVIZYON-062: every updater passes its SharedValue's .value itself. Reanimated
  // only subscribes a mapper to SharedValues found directly in the updater's
  // closure (extractInputs does not look inside nested worklet functions), so
  // reading platforms inside geom(platforms.value) alone left these mappers with no inputs:
  // they ran once and froze. Before R061 every parent re-render restarted
  // them (hiding it); after memo() the houses stayed put while the caps moved.
  const geom = (list: any[]) => {
    "worklet";
    const p = slotPlatform(list, index);
    if (!p) return null;
    const r = houseRun(p, platformById(list, p.id - 1), platformById(list, p.id + 1));
    return { p, r, rise: r * HOUSE_HIP_SLOPE, fw: p.width + 2 * r };
  };
  // REVIZYON-064: per-slot change gate. The iPhone A/B (R064 A vs B) tied the
  // in-flight UI hitches to every platform-list change re-running all 14x13
  // house styles and pushing their layout props (houseStyle's transform array
  // never passes shallowEqual, so all 14 houses re-laid out per spawn/cleanup).
  // Only this one cheap reaction follows platforms; it publishes the slot's
  // geometry to houseGeom when id/x/topY/width/hip run actually changed, so a
  // list change re-styles just the spawned slot and its neighbours. The styles
  // read houseGeom.value directly (R062 rule: a SharedValue in the updater's own
  // closure), and the reaction is declared first so its mapper runs before them
  // in the same frame -- the cap (PlatformView, unchanged) and house stay aligned.
  const houseGeom = useSharedValue<any>(null);
  useAnimatedReaction(
    () => geom(platforms.value),
    (g, prev) => {
      const old = houseGeom.value;
      const same = g === null ? old === null
        : old !== null && g.p.id === old.p.id && g.p.x === old.p.x && g.p.topY === old.p.topY && g.p.width === old.p.width && g.r === old.r;
      if (!same && probe) {
        // R065 probe only (react closure, not a mapper input): tag this frame's house write.
        const kind = old === null ? 1 : g === null ? 2 : 4;
        if (probe.pHouseFrame.value !== probe.pFrames.value) { probe.pHouseFrame.value = probe.pFrames.value; probe.pHouseKind.value = 0; }
        probe.pHouseKind.value = probe.pHouseKind.value | kind;
        if (probe.phase.value === PHASE.AIRBORNE) {
          if (kind === 1) probe.pEvAppear.value += 1;
          else if (kind === 2) probe.pEvGone.value += 1;
          else probe.pEvMove.value += 1;
        }
      }
      // primitive copy: never alias a platform object the course code may reuse
      if (!same) houseGeom.value = g === null ? null : { p: { id: g.p.id, x: g.p.x, topY: g.p.topY, width: g.p.width }, r: g.r, rise: g.rise, fw: g.fw };
    }
  );
  const houseStyle = useAnimatedStyle(() => {
    const g = houseGeom.value;
    if (!g) return { opacity: 0, width: 0, transform: [{ translateX: -99999 }, { translateY: -99999 }] };
    return { opacity: 1, width: g.fw, transform: [{ translateX: g.p.x - g.r }, { translateY: g.p.topY }] };
  });
  const facadeStyle = useAnimatedStyle(() => {
    const g = houseGeom.value;
    return { top: g ? g.rise + HOUSE_GUTTER_H - HOUSE_GUTTER_OVERLAP : 0 };
  });
  const colPos = (k: number, g: any) => {
    "worklet";
    if (!g) return { left: 0, top: 0 };
    const q = Math.floor(houseHash(g.p.id, 1) * 4) % 4;
    if (!FACADE_ATLAS) return { left: (g.fw - HOUSE_COL_W) / 2, top: k * HOUSE_PERIOD - HOUSE_FLOOR_STARTS[q] };
    // seeded variant; never the same as the previous platform's raw pick
    let v = Math.floor(houseHash(g.p.id, 4) * FACADE_CELLS) % FACADE_CELLS;
    if (v === Math.floor(houseHash(g.p.id - 1, 4) * FACADE_CELLS) % FACADE_CELLS) v = (v + 1 + Math.floor(houseHash(g.p.id, 5) * (FACADE_CELLS - 1))) % FACADE_CELLS;
    return { left: (g.fw - HOUSE_COL_W) / 2 - v * HOUSE_COL_W, top: k * FACADE_PERIODS[v] - FACADE_STARTS[v][q] };
  };
  const col0 = useAnimatedStyle(() => colPos(0, houseGeom.value));
  const col1 = useAnimatedStyle(() => colPos(1, houseGeom.value));
  const col2 = useAnimatedStyle(() => colPos(2, houseGeom.value));
  const col3 = useAnimatedStyle(() => colPos(3, houseGeom.value));
  // Roof face: band (house width x rise) > clip L (rot +a, interior right of
  // the left hip line) > unrotate > clip R (rot -a, interior left of the right
  // hip line) > unrotate > tile image placed in house coordinates.
  const roofBandStyle = useAnimatedStyle(() => {
    const g = houseGeom.value;
    return g ? { width: g.fw, height: g.rise } : { width: 0, height: 0 };
  });
  const clipLStyle = useAnimatedStyle(() => {
    const g = houseGeom.value;
    return { left: g ? g.r + HOUSE_CLIP_L * HOUSE_SIN : 0, top: -HOUSE_CLIP_L * HOUSE_COS };
  });
  // Inside the un-rotated wrapper, coordinates are band coordinates minus O1.
  const clipRStyle = useAnimatedStyle(() => {
    const g = houseGeom.value;
    if (!g) return { left: 0, top: 0 };
    const o1x = g.r + HOUSE_CLIP_L * HOUSE_SIN;
    const o2x = g.r + g.p.width - HOUSE_CLIP_L * HOUSE_SIN;
    return { left: o2x - HOUSE_CLIP_S - o1x, top: 0 };
  });
  const roofImgStyle = useAnimatedStyle(() => {
    const g = houseGeom.value;
    if (!g) return { left: 0, top: 0 };
    const o2x = g.r + g.p.width - HOUSE_CLIP_L * HOUSE_SIN;
    // one period further left so the image always covers the whole band (hip run < period)
    return { left: g.r - houseHash(g.p.id, 2) * HOUSE_ROOF_TEX_PERIOD - HOUSE_ROOF_TEX_PERIOD - (o2x - HOUSE_CLIP_S), top: HOUSE_CLIP_L * HOUSE_COS };
  });
  const hipLineL = useAnimatedStyle(() => {
    const g = houseGeom.value;
    return g ? { left: g.r, height: Math.hypot(g.r, g.rise) } : { height: 0 };
  });
  const hipLineR = useAnimatedStyle(() => {
    const g = houseGeom.value;
    return g ? { left: g.r + g.p.width - 3, height: Math.hypot(g.r, g.rise) } : { height: 0 };
  });
  const gutterStyle = useAnimatedStyle(() => {
    const g = houseGeom.value;
    return g ? { top: g.rise - HOUSE_GUTTER_OVERLAP, width: g.fw + 6 } : { width: 0 };
  });
  const gutterImgStyle = useAnimatedStyle(() => {
    const g = houseGeom.value;
    return { left: g ? -houseHash(g.p.id, 3) * 100 * HOUSE_K : 0 };
  });
  // R066: house width reaches the fixed-box gradients only as scaleX (non-layout).
  const lightStyle = useAnimatedStyle(() => {
    const g = houseGeom.value;
    return { transform: [{ scaleX: g ? (0.18 * g.fw) / HOUSE_GRAD_W : 1 }] };
  });
  const shadeStyle = useAnimatedStyle(() => {
    const g = houseGeom.value;
    return { transform: [{ scaleX: g ? (0.28 * g.fw) / HOUSE_GRAD_W : 1 }] };
  });
  const eaveStyle = useAnimatedStyle(() => {
    const g = houseGeom.value;
    return { transform: [{ scaleX: g ? g.fw / HOUSE_GRAD_W : 1 }] };
  });
  // MAHALLE (2026-11-20): teyze cephede, kedi saçak köşesinde; yalnız seçilen kulelerde görünür.
  // Sabit kutu (MAHALLE_BOX) + transform: düzen (layout) özelliği değişmez (R066 kuralı gibi).
  // Pencereler (1 teyze, 3 komşu amca, 4 çocuk) ve kediler (turuncu uyuyan / gerinen, gri uyuyan).
  const OFF = { opacity: 0, transform: [{ translateX: -99999 }, { translateY: 0 }, { scale: 1 }] };
  const winStyle = (kind: number, aspect: number) => useAnimatedStyle(() => {
    const g = houseGeom.value;
    if (!g || sakin(g.p.id) !== kind) return OFF;
    const b = teyzeBox(g, HOUSE_GUTTER_H, aspect);
    return { opacity: 1, transform: [{ translateX: b.left + b.w / 2 - MAHALLE_BOX / 2 }, { translateY: b.top + b.h / 2 - (MAHALLE_BOX * aspect) / 2 }, { scale: b.w / MAHALLE_BOX }] };
  });
  // mode 0 = turuncu uyuyan, 1 = turuncu gerinen (amca bu kuleye indiyse), 2 = gri uyuyan
  // MEVSIM-MAHALLE: kış/yağmur turuncu kedisinde kuyruk sarkmıyor -> gövde alt çizgisi tuvalin altında (%99).
  const soguk = roofWx === "kar" || roofWx === "yagmur" || cepheHal === "kis";
  const uyuyanFoot = soguk ? KEDI_DIK_FOOT : KEDI_UYUYAN_FOOT;
  // CESIT-SAKIN: mode 12..15 = yeni görünümler (smokin, beyaz, üç renk, oturan tekir); yalnız turuncu (0) uyanıp gerinir.
  const catStyle = (mode: number, aspect: number, footK = KEDI_DIK_FOOT) => useAnimatedStyle(() => {
    const g = houseGeom.value;
    if (!g || sakin(g.p.id) !== 2) return OFF;
    const gor = kediGorunum(g.p.id, soguk);
    const awake = woken ? woken.value === g.p.id : false;
    const want = gor === 1 ? 2 : gor >= 2 ? 10 + gor : awake ? 1 : 0;
    if (want !== mode) return OFF;
    const b = kediBox(g, aspect, FART_CHAR_H, HOUSE_GUTTER_H, mode === 0 ? uyuyanFoot : footK);
    if (b.w <= 0) return OFF;
    const titre = kediTitre ? kediTitre.value * 0.9 : 0;
    return { opacity: 1, transform: [{ translateX: b.left + b.w / 2 - MAHALLE_BOX / 2 + titre }, { translateY: b.top + b.h / 2 - (MAHALLE_BOX * aspect) / 2 }, { scale: b.w / MAHALLE_BOX }] };
  });
  // CUMBA: cumba + teyze (normalde halı silker; amca bu kuleye inince bakar). Aynı kutu, teyze tuvali daha uzun.
  const cumbaLayer = (mode: number, aspect: number, kadin = 0) => useAnimatedStyle(() => {
    const g = houseGeom.value;
    if (!g || sakin(g.p.id) !== (mode === 3 ? 2 : 1)) return OFF;
    if (mode === 1 || mode === 2) {
      if (kadinNo(g.p.id, soguk) !== kadin) return OFF; // CESIT-SAKIN: bu kulenin kadını
      const looking = look ? look.value === g.p.id : false;
      if ((mode === 2) !== looking) return OFF;
    }
    const b = cumbaBox(g, HOUSE_GUTTER_H, FART_CHAR_H);
    if (b.w <= 0) return OFF; // kuleye sığmıyor: bu kulede teyze yok (ölçek her yerde aynı kalsın)
    const h = b.w * aspect;
    return { opacity: 1, transform: [{ translateX: b.left + b.w / 2 - MAHALLE_BOX / 2 }, { translateY: b.top + h / 2 - (MAHALLE_BOX * aspect) / 2 }, { scale: b.w / MAHALLE_BOX }] };
  });
  const cumbaStyle = cumbaLayer(0, CUMBA_ASPECT);
  const teyzeStyle = cumbaLayer(1, CUMBA_TEYZE_ASPECT);
  const teyzeBakisStyle = cumbaLayer(2, CUMBA_TEYZE_ASPECT);
  const kadin1 = cumbaLayer(1, CUMBA_TEYZE_ASPECT, 1), kadin1b = cumbaLayer(2, CUMBA_TEYZE_ASPECT, 1);
  const kadin2 = cumbaLayer(1, CUMBA_TEYZE_ASPECT, 2), kadin2b = cumbaLayer(2, CUMBA_TEYZE_ASPECT, 2);
  const kadin3 = cumbaLayer(1, CUMBA_TEYZE_ASPECT, 3), kadin3b = cumbaLayer(2, CUMBA_TEYZE_ASPECT, 3);
  const kadinStyles = [[kadin1, kadin1b], [kadin2, kadin2b], [kadin3, kadin3b]];
  const kediCumbaStyle = cumbaLayer(3, CUMBA_ASPECT); // kedili kulede aynı cumba (kedi pervazında)
  const amcaStyle = winStyle(3, AMCA_ASPECT);
  const cocukStyle = winStyle(4, COCUK_ASPECT);
  const nefesStyle = useAnimatedStyle(() => {
    const n = kediNefes ? kediNefes.value : 0;
    return { opacity: n > 0.02 ? (1 - n) * 0.75 : 0, transform: [{ translateX: -9 * n }, { translateY: -5 * n }, { scale: 0.5 + 0.9 * n }] };
  });
  const kediStyle = catStyle(0, KEDI_ASPECT);
  const kediGerStyle = catStyle(1, KEDI_GERINEN_ASPECT);
  const kediGriStyle = catStyle(2, KEDI_GRI_ASPECT);
  const kediY0 = catStyle(12, KEDI_YENI_ASPECT, KEDI_YENI[0].foot), kediY1 = catStyle(13, KEDI_YENI_ASPECT, KEDI_YENI[1].foot);
  const kediY2 = catStyle(14, KEDI_YENI_ASPECT, KEDI_YENI[2].foot), kediY3 = catStyle(15, KEDI_YENI_ASPECT, KEDI_YENI[3].foot);
  const kediYeniStyles = [kediY0, kediY1, kediY2, kediY3];
  // KARGALAR: kulenin kendi kargaları (slot 0/1); poz 0 tünemiş (amcaya dönük), 1 bakış (omzunun üstünden amcaya).
  // Havalanınca bu kuleden silinir; uçuş ve yeni yer Game içindeki dünya katmanında (kule kırpmasına takılmaz).
  const kargaStyle = (slot: number, pose: number) => useAnimatedStyle(() => {
    const g = houseGeom.value;
    const tick = kTick ? kTick.value : 0;
    const gone = kGone ? kGone.value : [];
    const ax = kAmcaX ? kAmcaX.value : -1e9;
    if (!g) return OFF;
    const d = kargaYer(g, slot);
    if (!d || gone.includes(g.p.id * 4 + slot)) return OFF;
    if (pose !== kargaBekle(tick, d.seed)) return OFF;
    const face = ax < -1e8 ? d.flip : ax < d.wx ? -1 : 1; // bakışta da gövde aynı yönde (yalnız baş döner)
    const B = FART_CHAR_H * KARGA_BOX_K;
    return { opacity: 1, transform: [{ translateX: d.x - MAHALLE_BOX / 2 }, { translateY: d.y - B * KARGA_FOOT_Y + B / 2 - MAHALLE_BOX / 2 }, { scaleX: (face * B) / MAHALLE_BOX }, { scaleY: B / MAHALLE_BOX }] };
  });
  const k0a = kargaStyle(0, 0), k0b = kargaStyle(0, 1), k0c = kargaStyle(0, 2);
  const k1a = kargaStyle(1, 0), k1b = kargaStyle(1, 1), k1c = kargaStyle(1, 2);
  const iciclesStyle = useAnimatedStyle(() => {
    const g = houseGeom.value;
    return g ? { top: g.rise + HOUSE_GUTTER_H - HOUSE_GUTTER_OVERLAP - 2, width: g.fw } : { width: 0 };
  });
  const facadeSrc = cepheKaynak(cepheHal);
  // Mahalle: kar/yağmur kendi hâlleri; kar yağmayan kışta da üşüyen kediler ve şallı teyze (kış hâli).
  const mk = mahalleKaynak(roofWx === "kar" || roofWx === "yagmur" ? roofWx : cepheHal === "kis" ? "kar" : null);
  return (
    <Animated.View pointerEvents="none" style={[styles.house, houseStyle]}>
      <Animated.View style={[styles.houseFacade, facadeStyle]}>
        <Animated.View style={[styles.houseCol, col0]}><Image source={facadeSrc} style={styles.houseFill} resizeMode="stretch" fadeDuration={0} /></Animated.View>
        <Animated.View style={[styles.houseCol, col1]}><Image source={facadeSrc} style={styles.houseFill} resizeMode="stretch" fadeDuration={0} /></Animated.View>
        <Animated.View style={[styles.houseCol, col2]}><Image source={facadeSrc} style={styles.houseFill} resizeMode="stretch" fadeDuration={0} /></Animated.View>
        {FACADE_ATLAS ? <Animated.View style={[styles.houseCol, col3]}><Image source={facadeSrc} style={styles.houseFill} resizeMode="stretch" fadeDuration={0} /></Animated.View> : null}
        {HOUSE_GRAD_FIXED ? (
          <>
            <Animated.View pointerEvents="none" style={[styles.houseLightFixed, lightStyle]}>
              <LinearGradient pointerEvents="none" colors={["rgba(255,240,214,0.10)", "rgba(255,240,214,0)"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.houseGradFill} />
            </Animated.View>
            <Animated.View pointerEvents="none" style={[styles.houseShadeFixed, shadeStyle]}>
              <LinearGradient pointerEvents="none" colors={["rgba(52,30,18,0)", `rgba(52,30,18,${HOUSE_SHADE_A})`]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.houseGradFill} />
            </Animated.View>
            <Animated.View pointerEvents="none" style={[styles.houseEaveFixed, eaveStyle]}>
              <LinearGradient pointerEvents="none" colors={["rgba(30,18,10,0.43)", "rgba(30,18,10,0)"]} style={styles.houseGradFill} />
            </Animated.View>
          </>
        ) : (
          <>
            <LinearGradient pointerEvents="none" colors={["rgba(255,240,214,0.10)", "rgba(255,240,214,0)"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.houseLight} />
            <LinearGradient pointerEvents="none" colors={["rgba(52,30,18,0)", `rgba(52,30,18,${HOUSE_SHADE_A})`]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.houseShade} />
            <LinearGradient pointerEvents="none" colors={["rgba(30,18,10,0.43)", "rgba(30,18,10,0)"]} style={styles.houseEaveShadow} />
          </>
        )}
        {KONTUR_PARILTI ? <View style={styles.houseShadeStrip} /> : null}
        {roofWx === "yagmur" && <View style={styles.houseWet} />}
        <View style={styles.houseEdgeL} />
        <View style={styles.houseEdgeR} />
      </Animated.View>
      {MAHALLE_ON && (
        <>
          <Animated.View style={[{ position: "absolute", left: 0, top: 0, width: MAHALLE_BOX, height: MAHALLE_BOX * CUMBA_ASPECT }, cumbaStyle]}>
            <Image source={CUMBA_SOURCE} style={styles.houseFill} resizeMode="stretch" fadeDuration={0} />
          </Animated.View>
          <Animated.View style={[{ position: "absolute", left: 0, top: 0, width: MAHALLE_BOX, height: MAHALLE_BOX * CUMBA_ASPECT }, kediCumbaStyle]}>
            <Image source={CUMBA_KEDI_SOURCE} style={styles.houseFill} resizeMode="stretch" fadeDuration={0} />
          </Animated.View>
          <Animated.View style={[{ position: "absolute", left: 0, top: 0, width: MAHALLE_BOX, height: MAHALLE_BOX * CUMBA_TEYZE_ASPECT }, teyzeStyle]}>
            <Image source={mk.teyze} style={styles.houseFill} resizeMode="stretch" fadeDuration={0} />
          </Animated.View>
          <Animated.View style={[{ position: "absolute", left: 0, top: 0, width: MAHALLE_BOX, height: MAHALLE_BOX * CUMBA_TEYZE_ASPECT }, teyzeBakisStyle]}>
            <Image source={mk.teyzeBakis} style={styles.houseFill} resizeMode="stretch" fadeDuration={0} />
          </Animated.View>
          {kadinStyles.map((st, i) => st.map((sty, poz) => (
            <Animated.View key={`kadin-${i}-${poz}`} style={[{ position: "absolute", left: 0, top: 0, width: MAHALLE_BOX, height: MAHALLE_BOX * CUMBA_TEYZE_ASPECT }, sty]}>
              <Image source={mk.kadin[i + 1][poz]} style={styles.houseFill} resizeMode="stretch" fadeDuration={0} />
            </Animated.View>
          )))}
          <Animated.View style={[{ position: "absolute", left: 0, top: 0, width: MAHALLE_BOX, height: MAHALLE_BOX * AMCA_ASPECT }, amcaStyle]}>
            <Image source={mk.amca} style={styles.houseFill} resizeMode="stretch" fadeDuration={0} />
          </Animated.View>
          <Animated.View style={[{ position: "absolute", left: 0, top: 0, width: MAHALLE_BOX, height: MAHALLE_BOX * COCUK_ASPECT }, cocukStyle]}>
            <Image source={mk.cocuk} style={styles.houseFill} resizeMode="stretch" fadeDuration={0} />
          </Animated.View>
        </>
      )}
      <Animated.View style={[styles.houseClip, { left: 0 }, roofBandStyle]}>
        <Animated.View style={[styles.houseRoofClipL, ROOF_MASK_OFF, clipLStyle]}>
          <View style={styles.houseRoofUnL}>
            <Animated.View style={[styles.houseRoofClipR, ROOF_MASK_OFF, clipRStyle]}>
              <View style={styles.houseRoofUnR}>
                <AnimatedImage source={HOUSE_ROOF_SOURCE} style={[styles.houseRoofImg, roofImgStyle]} resizeMode="stretch" fadeDuration={0} />
                {/* HAVA İZİ (2026-11-17): kar örtüsü / ıslak kiremit, çatı yüzünün kendi kırpmasıyla (iniş çizgisinin altında). */}
                {roofWx === "kar" && (
                  <Animated.View style={[styles.houseRoofImg, roofImgStyle]}>
                    <LinearGradient colors={["rgba(250,252,255,0.97)", "rgba(244,248,255,0.9)", "rgba(240,246,255,0.35)"]} locations={[0, 0.45, 1]} style={styles.houseGradFill} />
                  </Animated.View>
                )}
                {roofWx === "yagmur" && (
                  <Animated.View style={[styles.houseRoofImg, roofImgStyle, { backgroundColor: "rgba(28,36,58,0.22)" }]}>
                    <LinearGradient colors={["rgba(255,255,255,0)", "rgba(230,240,255,0.32)", "rgba(255,255,255,0)"]} locations={[0.25, 0.42, 0.6]} style={styles.houseGradFill} />
                  </Animated.View>
                )}
              </View>
            </Animated.View>
          </View>
        </Animated.View>
        <Animated.View style={[styles.houseHipLine, styles.houseHipLineL, hipLineL]} />
        <Animated.View style={[styles.houseHipLine, styles.houseHipLineR, hipLineR]} />
      </Animated.View>
      <Animated.View style={[styles.houseClip, { left: -3, height: HOUSE_GUTTER_H }, gutterStyle]}>
        <AnimatedImage source={HOUSE_GUTTER_SOURCE} style={[styles.houseGutterImg, gutterImgStyle]} resizeMode="stretch" fadeDuration={0} />
        {roofWx === "kar" && <View style={styles.houseSnowLip} />}
      </Animated.View>
      {roofWx === "kar" && (
        <Animated.View style={[styles.houseIcicles, iciclesStyle]}>
          {ICICLES.map((c, i) => <View key={i} style={[styles.houseIcicle, { left: `${c.x}%`, borderTopWidth: c.h, borderLeftWidth: c.w, borderRightWidth: c.w }]} />)}
        </Animated.View>
      )}
      {MAHALLE_ON && (
        <>
          <Animated.View style={[{ position: "absolute", left: 0, top: 0, width: MAHALLE_BOX, height: MAHALLE_BOX * KEDI_ASPECT }, kediStyle]}>
            <Image source={mk.kedi} style={styles.houseFill} resizeMode="stretch" fadeDuration={0} />
            {kediNefes ? <Animated.View pointerEvents="none" style={[{ position: "absolute", left: MAHALLE_BOX * 0.39 - 7, top: MAHALLE_BOX * KEDI_ASPECT * 0.74 - 4, width: 9, height: 6, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.95)" }, nefesStyle]} /> : null}
          </Animated.View>
          <Animated.View style={[{ position: "absolute", left: 0, top: 0, width: MAHALLE_BOX, height: MAHALLE_BOX * KEDI_GERINEN_ASPECT }, kediGerStyle]}>
            <Image source={mk.kediGerinen} style={styles.houseFill} resizeMode="stretch" fadeDuration={0} />
            {kediNefes ? <Animated.View pointerEvents="none" style={[{ position: "absolute", left: MAHALLE_BOX * 0.26 - 7, top: MAHALLE_BOX * KEDI_GERINEN_ASPECT * 0.7 - 4, width: 9, height: 6, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.95)" }, nefesStyle]} /> : null}
          </Animated.View>
          <Animated.View style={[{ position: "absolute", left: 0, top: 0, width: MAHALLE_BOX, height: MAHALLE_BOX * KEDI_GRI_ASPECT }, kediGriStyle]}>
            <Image source={mk.kediGri} style={styles.houseFill} resizeMode="stretch" fadeDuration={0} />
            {kediNefes ? <Animated.View pointerEvents="none" style={[{ position: "absolute", left: MAHALLE_BOX * 0.44 - 7, top: MAHALLE_BOX * KEDI_GRI_ASPECT * 0.7 - 4, width: 9, height: 6, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.95)" }, nefesStyle]} /> : null}
          </Animated.View>
          {kediYeniStyles.map((sty, i) => (
            <Animated.View key={`kedi-yeni-${i}`} style={[{ position: "absolute", left: 0, top: 0, width: MAHALLE_BOX, height: MAHALLE_BOX * KEDI_YENI_ASPECT }, sty]}>
              <Image source={mk.kediYeni[i]} style={styles.houseFill} resizeMode="stretch" fadeDuration={0} />
              {kediNefes ? <Animated.View pointerEvents="none" style={[{ position: "absolute", left: MAHALLE_BOX * KEDI_YENI[i].burun[0] - 7, top: MAHALLE_BOX * KEDI_YENI_ASPECT * KEDI_YENI[i].burun[1] - 4, width: 9, height: 6, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.95)" }, nefesStyle]} /> : null}
            </Animated.View>
          ))}
        </>
      )}
      {KARGA_ON && (
        <>
          {[[k0a, KARGA_TUNEMIS], [k0b, KARGA_BAKIS], [k0c, KARGA_YEM], [k1a, KARGA_TUNEMIS], [k1b, KARGA_BAKIS], [k1c, KARGA_YEM]].map(([st, src]: any, i) => (
            <Animated.View key={`karga-${i}`} style={[{ position: "absolute", left: 0, top: 0, width: MAHALLE_BOX, height: MAHALLE_BOX }, st]}>
              <Image source={src} style={styles.houseFill} resizeMode="stretch" fadeDuration={0} />
            </Animated.View>
          ))}
        </>
      )}
    </Animated.View>
  );
});

// POPUP-001: one cardboard pop-up house per pool slot (always mounted, only
// continuous geometry follows the slot's platform -- R037/R038 rule). The cap
// (PlatformView, exactly p.x/p.topY/p.width) stays the landing edge; the roof
// below it is the house's own: hip | tiles exactly p.width | hip. The card
// wall, its folded side face, white cut edges, the shadow it casts on the page
// and its glue tabs on the page floor all come from p.x/p.topY/p.width/p.id.
const PopupHouseView = memo(function PopupHouseView({ index, platforms, styles }: any) {
  const houseStyle = useAnimatedStyle(() => {
    const p = slotPlatform(platforms.value, index);
    if (!p) return { opacity: 0, width: 0, transform: [{ translateX: -99999 }, { translateY: -99999 }] };
    return { opacity: 1, width: p.width + 2 * PU_HIP, height: PAGE_FLOOR_Y - p.topY + 14, transform: [{ translateX: p.x - PU_HIP }, { translateY: p.topY }] };
  });
  const wallW = (p: any) => {
    "worklet";
    return p.width + 2 * PU_HIP - 2 * PU_WALL_INSET;
  };
  const shadowStyle = useAnimatedStyle(() => {
    const p = slotPlatform(platforms.value, index);
    return p ? { left: PU_WALL_INSET + PU_SHADOW_X, width: wallW(p) + PU_SIDE } : { width: 0 };
  });
  const wallStyle = useAnimatedStyle(() => {
    const p = slotPlatform(platforms.value, index);
    return p ? { width: wallW(p) } : { width: 0 };
  });
  const wallEdgeStyle = useAnimatedStyle(() => {
    const p = slotPlatform(platforms.value, index);
    return p ? { width: wallW(p) + 5 } : { width: 0 };
  });
  const wallTexStyle = useAnimatedStyle(() => {
    const p = slotPlatform(platforms.value, index);
    if (!p) return { left: 0, top: 0 };
    const phase = houseHash(p.id, 5) < 0.5 ? 0 : PU_WALL_TEX_H / 2;
    return { left: (wallW(p) - PU_WALL_TEX_W) / 2, top: -phase };
  });
  const sideStyle = useAnimatedStyle(() => {
    const p = slotPlatform(platforms.value, index);
    return p ? { left: PU_WALL_INSET + wallW(p) } : { left: 0 };
  });
  const roofMidStyle = useAnimatedStyle(() => {
    const p = slotPlatform(platforms.value, index);
    return p ? { width: p.width } : { width: 0 };
  });
  const roofMidImgStyle = useAnimatedStyle(() => {
    const p = slotPlatform(platforms.value, index);
    return { left: p ? -Math.floor(houseHash(p.id, 6) * 4) * PU_ROOF_TILE_PERIOD : 0 };
  });
  const hipRStyle = useAnimatedStyle(() => {
    const p = slotPlatform(platforms.value, index);
    return p ? { left: PU_HIP + p.width } : { left: 0 };
  });
  const tabRStyle = useAnimatedStyle(() => {
    const p = slotPlatform(platforms.value, index);
    return p ? { left: PU_WALL_INSET + wallW(p) - 18 } : { left: 0 };
  });
  return (
    <Animated.View pointerEvents="none" style={[styles.puHouse, houseStyle]}>
      <Animated.View style={[styles.puShadow, shadowStyle]} />
      <Animated.View style={[styles.puWallEdge, wallEdgeStyle]} />
      <Animated.View style={[styles.puWall, wallStyle]}>
        {[0, 1, 2, 3].map((k) => (
          <Animated.View key={k} style={[styles.puWallTex, { marginTop: k * PU_WALL_TEX_H }, wallTexStyle]}>
            <Image source={PU_WALL_SOURCE} style={styles.houseFill} resizeMode="stretch" fadeDuration={0} />
          </Animated.View>
        ))}
        <LinearGradient pointerEvents="none" colors={["rgba(40,22,12,0.30)", "rgba(40,22,12,0)"]} style={styles.puEaveShadow} />
        <View style={styles.puFold} />
      </Animated.View>
      <Animated.View style={[styles.puSide, sideStyle]}>
        <LinearGradient pointerEvents="none" colors={["#c9a473", "#a57d4f"]} style={styles.houseFill} />
      </Animated.View>
      <View style={[styles.puTab, { left: PU_WALL_INSET + 4 }]} />
      <Animated.View style={[styles.puTab, tabRStyle]} />
      <Image source={PU_ROOF_HIP_L_SOURCE} style={styles.puHip} resizeMode="stretch" fadeDuration={0} />
      <Animated.View style={[styles.puRoofMid, roofMidStyle]}>
        <AnimatedImage source={PU_ROOF_MID_SOURCE} style={[styles.puRoofMidImg, roofMidImgStyle]} resizeMode="stretch" fadeDuration={0} />
      </Animated.View>
      <Animated.View style={[styles.puHipRWrap, hipRStyle]}>
        <Image source={PU_ROOF_HIP_R_SOURCE} style={styles.houseFill} resizeMode="stretch" fadeDuration={0} />
      </Animated.View>
    </Animated.View>
  );
});

const PlatformView = memo(function PlatformView({ index, platforms, styles, onArtLoad, onArtStart, onArtError, effectK }: any) {
  // KURUKAFA: etki sürerken iniş yüzeyinin yeni genişliği tepede şeritle gösterilir
  // (büyüdüyse altın, küçüldüyse kırmızı). Yalnız çizim; çatı silüeti değişmez.
  const effectStyle = useAnimatedStyle(() => {
    const p = slotPlatform(platforms.value, index);
    const k = effectK ? effectK.value : 1;
    if (!p || k === 1) return { opacity: 0, transform: [{ translateX: -99999 }, { translateY: -99999 }] };
    return {
      opacity: 0.95,
      width: p.width * k,
      backgroundColor: k > 1 ? "#f2b632" : "#d8432f",
      transform: [{ translateX: p.x + (p.width * (1 - k)) / 2 }, { translateY: p.topY - 10 }],
    };
  });
  const style = useAnimatedStyle(() => {
    const p = slotPlatform(platforms.value, index);
    if (!p) {
      return {
        opacity: 0,
        transform: [{ translateX: -99999 }, { translateY: -99999 }],
      };
    }
    return {
      opacity: 1,
      width: p.width,
      transform: [{ translateX: p.x }, { translateY: p.topY }],
    };
  });
  const centerStyle = useAnimatedStyle(() => {
    const p = slotPlatform(platforms.value, index);
    return {
      opacity: p && !GORUNUM_REV ? 0.55 : 0,
      left: (p ? p.width : 0) / 2 - CONFIG.perfectTolerance,
    };
  });
  // GORSEL-012 (2026-09-22): every per-platform decorative sprite (the
  // GORSEL-004A chimney-top.png overlay AND the GORSEL-011/011B column /
  // roof-island overlays) is retired here -- see AI_REVIEW.md for the
  // reasoning. `visualType` ("chimney"/"normal") is untouched in the data
  // (procedural-course.ts is not part of THAT change) even though both
  // render identically now.
  // Historical rooftop-island sprites were retired in REVIZYON-041. The
  // collision surface remains p.x/p.width/p.topY; only its thin rim is drawn
  // here, while PlatformHouseView supplies the house under it.
  // REVIZYON-037: the free-standing baseShadow/baseTint rectangles (View +
  // LinearGradient, not derived from the sprite's own alpha) that used to sit
  // under/over that edge are gone -- the iPhone video showed them as loose
  // brown/ghost rectangles next to or independent of real chimneys, on top of
  // the R036 connector's own ghosts. Pure render: reads p.x/p.width/p.topY/p.cat.
  // REVIZYON-038: one native image layer per pool slot. R037 retained three
  // mutually-hidden animated trees (cat 0/1/2); when a recycled slot changed
  // category, iOS occasionally retained the old clipped surface as a brown
  // rectangular ghost. A single shared medium roof-island silhouette removes
  // category switching and cuts the native image surfaces from 42 to 14.
  // REVIZYON-031: landing-cap rim (light top edge over a dark under-edge) on
  // top of the sprite: legible on sky, sea and roof. Visual only; reads
  // p.x/p.width/p.topY, writes nothing.
  const capRimStyle = useAnimatedStyle(() => {
    const p = slotPlatform(platforms.value, index);
    if (!p) return { opacity: 0, transform: [{ translateX: -99999 }, { translateY: -99999 }] };
    return { opacity: 1, width: p.width, transform: [{ translateX: p.x }, { translateY: p.topY }] };
  });
  return (
    <>
      <Animated.View style={[styles.tower, NO_CLIP, style]}>
        {/* GORSEL-012: raster brick tile permanently hidden (see
            `towerBrick`'s own style, opacity 0) -- the flat colour accents
            below it (shade/cap/highlight) are NOT a repeating texture and
            stay visible on every platform, unconditionally, giving the
            simple capped-column look the background now sits behind. */}
        <View style={styles.towerBrick}>
          <Image
            source={BRICK_SOURCE}
            onLoadStart={index === 0 ? () => onArtStart("bricks") : undefined}
            onLoad={index === 0 ? () => onArtLoad("bricks") : undefined}
            onError={index === 0 ? onArtError : undefined}
            fadeDuration={0}
            style={styles.brickImage}
            resizeMode="repeat"
          />
        </View>
        <View style={styles.towerShade} />
        <View style={styles.capShadow} />
        <View style={styles.towerCap} />
        <View style={styles.capHighlight} />
        <Animated.View style={[styles.towerCenter, centerStyle]} />
      </Animated.View>
      {/* GORSEL-014/OYUN_AKISI-001: the real rooftop-chimney piece, drawn as
          a SIBLING of `tower` (not a child) -- `tower` has overflow:"hidden"
          for its own rounded corners, and this art is taller than the cap,
          so as a child it would have been clipped, same reasoning as every
          earlier per-platform overlay in this file.
          GORSEL-017 (2026-09-23): retired for USE_FIXED_PANEL_COURSE -- every
          chimney is now painted directly into the panel background art
          itself (panel-course.ts), so drawing a separate sprite on top would
          be exactly the "ayrı render edilen ... kolon" the task explicitly
          forbids. Platform collision boxes stay fully invisible in this
          mode (only styles.towerCenter's perfect-zone hint stripe shows). */}
      {!USE_FIXED_PANEL_COURSE && (
        <>
          {/* REVIZYON-041: the separate roof-island sprite is deliberately
              gone. The landing surface is now one masonry shaft emerging
              from behind the painted district, with only this thin cap rim. */}
          <Animated.View pointerEvents="none" style={[styles.playableChimneyCap, NO_CLIP, capRimStyle]}>
            <View style={styles.playableChimneyCapHighlight} />
          </Animated.View>
        </>
      )}
      {effectK && <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, height: 12, borderRadius: 6, borderWidth: 2, borderColor: "#fff8ec" }, effectStyle]} />}
    </>
  );
});

// PERFECT! pop with a quick scale-in.
// GAZ trial: one pooled puff (static lobes; only the wrapper animates).
const FartPuff = memo(function FartPuff({ i, puffs, now, cut }: any) {
  const st = useAnimatedStyle(() => {
    const P = puffs.value[i];
    if (!P) return { opacity: 0, transform: [{ translateX: -99999 }, { translateY: -99999 }, { scale: 1 }] };
    const age = (now.value - P.b) / FART_LIFE;
    if (age < 0 || age >= 1) return { opacity: 0, transform: [{ translateX: -99999 }, { translateY: -99999 }, { scale: 1 }] };
    let op = 0.95 * (1 - age * age);
    let sc = (0.55 + 0.75 * age) * P.s;
    if (cut.value > P.b) {
      const k = Math.min(1, (now.value - cut.value) / 140);
      op *= 1 - k;
      sc *= 1 + 0.6 * k;
    }
    return { opacity: op, transform: [{ translateX: P.x - FART_BOX / 2 }, { translateY: P.y - FART_BOX / 2 }, { scale: sc }] };
  });
  return (
    <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, width: FART_BOX, height: FART_BOX }, st]}>
      {FART_LOBES.map((l, k) => (
        <View key={k} style={{ position: "absolute", left: l.x * FART_BOX, top: l.y * FART_BOX, width: l.d * FART_BOX, height: l.d * FART_BOX, borderRadius: (l.d * FART_BOX) / 2, backgroundColor: l.c,
          borderWidth: l.b ? 2 : 0, borderColor: "rgba(112,120,52,0.7)" }} />
      ))}
    </Animated.View>
  );
});

function PerfectPop({ styles, label, sub, big }: any) {
  const s = useSharedValue(0);
  useEffect(() => {
    s.value = withTiming(1, { duration: 180 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const st = useAnimatedStyle(() => ({
    opacity: s.value,
    transform: [{ scale: 0.6 + s.value * 0.4 }],
  }));
  return (
    <Animated.View style={st} testID="perfect-label">
      <Text style={big ? styles.bigPopText : styles.perfectText}>{label}</Text>
      {sub ? <Text style={styles.bigPopSub}>{sub}</Text> : null}
    </Animated.View>
  );
}

// REVIZYON-064: diagnostics overlay (PERF_PROBE only). JS reads the UI-thread
// counters every 500 ms and also measures its own rAF gaps (JS-thread stalls).
function PerfProbeOverlay({ top, sv }: any) {
  const [txt, setTxt] = useState("");
  const js = useRef({ n: 0, h: 0, max: 0, last: 0 });
  useEffect(() => {
    let raf = 0;
    const loop = (t: number) => {
      const j = js.current;
      if (j.last) { const d = t - j.last; j.n += 1; if (d > 25) j.h += 1; if (d > j.max) j.max = d; }
      j.last = t;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const id = setInterval(() => {
      const j = js.current;
      setTxt(`UI ${sv.pFrames.value} kare | >25ms ${sv.pHitch.value} (>40 ${sv.pHitchBig.value}) max ${Math.round(sv.pMaxMs.value)}\n` +
        `ucus ${sv.pAirFrames.value} kare, >25ms ${sv.pAirHitch.value} | liste degisimi(ucus) ${sv.pListAir.value}, liste+1 kare icinde takilma ${sv.pHitchNearList.value}\n` +
        `JS ${j.n} kare | >25ms ${j.h} max ${Math.round(j.max)}${HOUSE_AB_FROZEN ? "  [AB: EVLER DONDURULMUS]" : (HOUSE_GRAD_FIXED ? "  [R066: GRADYAN SABIT KUTU]" : "  [R065: FAZ/EV OLAY SAYACI]")}\n` +
        `faz >25ms: bekle ${sv.pHitchIdle.value} / sarj ${sv.pHitchCharge.value} / ucus ${sv.pAirHitch.value} / olu ${sv.pHitchDead.value}\n` +
        `ucus takilma/olay: ev-gorun ${sv.pHitchAppear.value}/${sv.pEvAppear.value}  ev-kaybol ${sv.pHitchGone.value}/${sv.pEvGone.value}  ev-kay/boy ${sv.pHitchMove.value}/${sv.pEvMove.value}  liste-evsiz ${sv.pHitchListOnly.value}/${sv.pListNoHouse.value}  olaysiz ${sv.pHitchNoEvent.value}`);
    }, 500);
    return () => { cancelAnimationFrame(raf); clearInterval(id); };
    // SharedValues are stable for the screen's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 4, right: 4, top, padding: 4, backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 6, zIndex: 50 }}>
      <Text style={{ color: "#fff", fontSize: 10 }}>{txt}</Text>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: "#4f9ec4", overflow: "hidden" },
  artTiming: { position: "absolute", top: "25%", left: 16, right: 16, padding: 12, borderRadius: 12, backgroundColor: colors.gameSky },
  // TEMP DEBUG (GORSEL-004 iPhone diagnosis, 2026-09-18) -- delete alongside
  // the panel above once the root cause is found.
  // 2026-09-22 device-rejection fix (item C, defense in depth): moved from
  // bottom-left (inside natural one-handed thumb reach, where an accidental
  // tap while trying to charge a jump could silently freeze the pose -- see
  // the poseOverride reset in onPressIn/onPressOut/cancelCharge above for
  // the actual fix) to a small stack in the top-right corner, away from
  // where a real charge press lands.
  poseDevRow: { position: "absolute", right: 4, top: 46, flexDirection: "row", flexWrap: "wrap", width: 132, justifyContent: "flex-end", gap: 3 },
  poseDevBtn: { backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 5, paddingVertical: 4, borderRadius: 5 },
  artTimingText: { color: colors.hudText, fontSize: 14, marginBottom: 8 },
  artLoadingText: { color: colors.hudText, fontSize: 18, padding: 12 },
  fill: absoluteFill(),
  touch: absoluteFill(),
  world: {
    ...absoluteFill(),
    transformOrigin: "0% 0%",
    pointerEvents: "none",
  },

  backgroundWash: {
    ...absoluteFill(),
    backgroundColor: colors.gameSky,
    opacity: 0.14, // REVIZYON-034: 0.26 -> 0.14 (less desaturation of the master)
  },
  brickImage: { width: "100%", height: "100%" },
  // GORSEL-013 (2026-09-22, device rejection of the GORSEL-012 fix round):
  // the short cap sliver still read on-device as "a line, not a chimney" --
  // the user's own instruction for exactly this outcome is to make the
  // dynamic cap fully transparent rather than iterate on its look again.
  // Physics platforms move independently of the fixed painted scene and
  // cannot be pixel-registered to it, so no per-platform art is drawn here
  // any more: the player's landing surface is invisible, and the real
  // chimneys/rooftops the player appears to be jumping between are the
  // ones already painted into the background. towerCenter (perfect-landing
  // hint, a distinct functional affordance, not "a cap") is intentionally
  // NOT touched here -- it stays visible.
  capShadow: { position: "absolute", top: CONFIG.capHeight, left: 0, right: 0, height: 4, backgroundColor: colors.platformShade, opacity: 0 },
  capHighlight: { position: "absolute", top: 2, left: 3, right: 3, height: 2, backgroundColor: colors.platformCenter, opacity: 0 },
  // GORSEL-012 (2026-09-22): raster brick texture permanently hidden --
  // "tekrarlayan tuğla gövdeler" was explicitly rejected. Kept mounted
  // (still loaded, still tracked by markArtStarted/Loaded("bricks")) rather
  // than deleted, so this is a one-line, easily-reversible style change.
  towerBrick: {
    position: "absolute",
    left: 3,
    right: 3,
    top: CONFIG.capHeight,
    bottom: 0,
    opacity: 0,
  },

  // GORSEL-012 device-rejection fix (2026-09-22, item B): the container is
  // still CONFIG.columnHeight (1600) tall -- UNCHANGED, this is purely a
  // physics-irrelevant render box, collision/footSoles never read it -- but
  // its own flat fill is now transparent. Previously this WAS the "long
  // brown rectangle" the device video showed (colors.platform painted the
  // entire 1600px box solid): only towerCap/capShadow/capHighlight below
  // (already short, CONFIG.capHeight=12px + a few px) remain visible, so
  // what's on screen is a short clean cap at the real landing surface and
  // nothing else -- no long body, no thin column.
  tower: {
    position: "absolute",
    left: 0,
    top: 0,
    height: CONFIG.columnHeight,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: "transparent",
    overflow: "hidden",
    pointerEvents: "none",
  },
  // Tied to the now-invisible tall body -- would otherwise show as its own
  // thin full-height vertical sliver on the right edge. Hidden (opacity 0)
  // rather than deleted, so it is a one-line, easily-reversible change.
  towerShade: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: "14%",
    backgroundColor: colors.platformShade,
    opacity: 0,
  },
  towerCap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: CONFIG.capHeight,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: colors.platformTop,
    borderWidth: 1.5,
    borderColor: colors.platformShade,
    opacity: 0,
  },
  towerCenter: {
    position: "absolute",
    top: CONFIG.capHeight + 3,
    width: CONFIG.perfectTolerance * 2,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.platformCenter,
  },
  // GORSEL-014/OYUN_AKISI-001: sized/positioned per-platform by
  // rooftopStyle0/1/2 (width/height/transform); this is just the base.
  rooftopImage: { position: "absolute", left: 0, top: 0, pointerEvents: "none" },
  rooftopImageFill: { width: "100%", height: "100%" },
  house: { position: "absolute", left: 0, top: 0, height: HOUSE_FACADE_H, pointerEvents: "none" },
  puHouse: { position: "absolute", left: 0, top: 0, pointerEvents: "none" },
  puShadow: { position: "absolute", top: PU_ROOF_H + 10, bottom: 6, backgroundColor: "rgba(40,24,40,0.26)", borderRadius: 4 },
  puWallEdge: { position: "absolute", left: PU_WALL_INSET - 2.5, top: PU_ROOF_H - 3, bottom: 4, backgroundColor: "#fffaf0" },
  puWall: { position: "absolute", left: PU_WALL_INSET, top: PU_ROOF_H - 3, bottom: 6, overflow: "hidden", backgroundColor: "#f6e9cc",
    borderLeftWidth: 2, borderRightWidth: 2, borderBottomWidth: 2, borderColor: "#2a1c16" },
  puWallTex: { position: "absolute", width: PU_WALL_TEX_W, height: PU_WALL_TEX_H },
  puEaveShadow: { position: "absolute", left: 0, right: 0, top: 0, height: 12 },
  puFold: { position: "absolute", left: 0, right: 0, bottom: 10, height: 1.5, backgroundColor: "rgba(42,28,22,0.45)" },
  puSide: { position: "absolute", top: PU_ROOF_H, bottom: 9, width: PU_SIDE, overflow: "hidden", borderRightWidth: 2, borderBottomWidth: 2, borderColor: "#2a1c16",
    transform: [{ skewY: "-24deg" }], transformOrigin: "0% 0%" },
  puTab: { position: "absolute", bottom: 0, width: 14, height: 8, backgroundColor: "#ecdab4", borderWidth: 1.5, borderColor: "#2a1c16",
    borderBottomLeftRadius: 3, borderBottomRightRadius: 3 },
  puHip: { position: "absolute", left: 0, top: 0, width: PU_HIP, height: PU_ROOF_H },
  puHipRWrap: { position: "absolute", top: 0, width: PU_HIP, height: PU_ROOF_H },
  puRoofMid: { position: "absolute", left: PU_HIP, top: 0, height: PU_ROOF_H, overflow: "hidden" },
  puRoofMidImg: { position: "absolute", top: 0, width: PU_ROOF_TILE_W, height: PU_ROOF_H },
  puPageFloor: { position: "absolute", top: PAGE_FLOOR_Y, height: 2200, backgroundColor: PU_PAPER, borderTopWidth: 3, borderColor: "#2a1c16" },
  puPageFold: { position: "absolute", left: 0, right: 0, top: 26, height: 2, backgroundColor: "rgba(120,86,60,0.45)" },
  houseFacade: { position: "absolute", left: 0, right: 0, height: HOUSE_FACADE_H, overflow: "hidden" },
  houseCol: { position: "absolute", width: HOUSE_COL_W * FACADE_CELLS, height: HOUSE_PERIOD },
  houseFill: { width: "100%", height: "100%" },
  houseLight: { position: "absolute", left: 0, top: 0, bottom: 0, width: "18%" },
  houseShade: { position: "absolute", right: 0, top: 0, bottom: 0, width: "28%" },
  houseEaveShadow: { position: "absolute", left: 0, right: 0, top: 0, height: 14 },
  houseLightFixed: { position: "absolute", left: 0, top: 0, bottom: 0, width: HOUSE_GRAD_W, transformOrigin: "0% 0%" },
  houseShadeFixed: { position: "absolute", right: 0, top: 0, bottom: 0, width: HOUSE_GRAD_W, transformOrigin: "100% 0%" },
  houseEaveFixed: { position: "absolute", left: 0, top: 0, height: 14, width: HOUSE_GRAD_W, transformOrigin: "0% 0%" },
  houseGradFill: { position: "absolute", left: 0, top: 0, right: 0, bottom: 0 },
  houseEdgeL: { position: "absolute", left: 0, top: 0, bottom: 0, width: HOUSE_EDGE_W, backgroundColor: HOUSE_EDGE_COLOR },
  houseEdgeR: { position: "absolute", right: 0, top: 0, bottom: 0, width: HOUSE_EDGE_W, backgroundColor: HOUSE_EDGE_COLOR },
  houseShadeStrip: { position: "absolute", right: HOUSE_EDGE_W, top: 0, bottom: 0, width: 7, backgroundColor: "rgba(40,24,14,0.26)" },
  targetGlow: { position: "absolute", left: 0, top: 0, width: GLOW_W, height: GLOW_H, pointerEvents: "none", transformOrigin: "0% 100%" },
  houseClip: { position: "absolute", top: 0, overflow: "hidden" },
  houseRoofImg: { position: "absolute", top: 0, width: HOUSE_ROOF_W, height: HOUSE_ROOF_H },
  houseRoofClipL: { position: "absolute", width: HOUSE_CLIP_S, height: HOUSE_CLIP_S, overflow: "hidden", transformOrigin: "0% 0%", transform: [{ rotate: HOUSE_HIP_DEG }] },
  houseRoofUnL: { position: "absolute", left: 0, top: 0, width: 0, height: 0, transformOrigin: "0% 0%", transform: [{ rotate: HOUSE_HIP_NEG_DEG }] },
  houseRoofClipR: { position: "absolute", width: HOUSE_CLIP_S, height: HOUSE_CLIP_S, overflow: "hidden", transformOrigin: "100% 0%", transform: [{ rotate: HOUSE_HIP_NEG_DEG }] },
  houseRoofUnR: { position: "absolute", left: 0, top: 0, width: HOUSE_CLIP_S, height: HOUSE_CLIP_S, transformOrigin: "100% 0%", transform: [{ rotate: HOUSE_HIP_DEG }] },
  houseHipLine: { position: "absolute", top: 0, width: 3, backgroundColor: "#3a2218", borderColor: "rgba(226,150,108,0.65)" },
  houseHipLineL: { transformOrigin: "0% 0%", transform: [{ rotate: HOUSE_HIP_DEG }], borderRightWidth: 1 },
  houseHipLineR: { transformOrigin: "100% 0%", transform: [{ rotate: HOUSE_HIP_NEG_DEG }], borderLeftWidth: 1 },
  houseSnowLip: { position: "absolute", left: 0, right: 0, top: 0, height: 9, borderRadius: 5, backgroundColor: "rgba(250,252,255,0.96)" },
  houseIcicles: { position: "absolute", left: 0, height: 40 },
  houseIcicle: { position: "absolute", top: 0, width: 0, height: 0, borderLeftColor: "transparent", borderRightColor: "transparent", borderTopColor: "rgba(226,240,255,0.95)" },
  houseWet: { position: "absolute", left: 0, top: 0, right: 0, bottom: 0, backgroundColor: "rgba(22,32,58,0.13)" },
  houseGutterImg: { position: "absolute", top: 0, width: HOUSE_GUTTER_W, height: HOUSE_GUTTER_H },
  playableChimneyCap: { position: "absolute", left: 0, top: 0, height: 8, borderTopLeftRadius: 3, borderTopRightRadius: 3, backgroundColor: "#9f573d", borderWidth: 1.25, borderColor: "rgba(74,42,34,0.78)", overflow: "hidden" },
  playableChimneyCapHighlight: { position: "absolute", left: 2, right: 2, top: 1, height: 2, backgroundColor: "rgba(239,171,121,0.76)" },

  // GORSEL-006 sprite box: square, same aspect as the 1024x1024 canvas, sized
  // from the physical sole span (SPRITE_SCALE) -- never from device pixels.

  burst: { position: "absolute", left: 0, top: 0, width: 1, height: 1, pointerEvents: "none" },
  burstDot: {
    position: "absolute",
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.perfect,
  },

  sfxBtn: { position: "absolute", right: 14, width: 40, height: 40, borderRadius: 20, flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(42,27,18,0.78)", borderWidth: 1.5, borderColor: "rgba(255,250,241,0.6)", zIndex: 60 },
  sfxBtnMuted: { backgroundColor: "rgba(192,71,43,0.9)" },
  sfxBtnText: { fontSize: 14, fontWeight: "800", color: "#fff" },
  hud: { position: "absolute", left: 0, right: 0, alignItems: "center", pointerEvents: "none", zIndex: 35 }, // yağış (30) skorun arkasında kalsın
  scoreText: {
    fontSize: 56,
    fontWeight: "800",
    color: colors.hudText,
    letterSpacing: -1,
    textShadowColor: "rgba(255,255,255,0.55)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bestText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.hudText,
    letterSpacing: 1,
    marginTop: -4,
    textShadowColor: "rgba(255,255,255,0.55)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  hint: {
    position: "absolute",
    bottom: 70,
    left: 0,
    right: 0,
    alignItems: "center",
    pointerEvents: "none",
  },
  hintText: { fontSize: 14, fontWeight: "600", color: colors.muted },
  // POPUP-002: the paper sky is dark blue, so the Popup HUD is light text with a
  // firm dark shadow (same size/position); the hint sits on a small dark pill.
  puScoreText: { color: "#ffffff", textShadowColor: "rgba(16,24,40,0.85)", textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 3 },
  puBestText: { color: "#ffffff", textShadowColor: "rgba(16,24,40,0.9)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  puHintText: { color: "#ffffff", backgroundColor: "rgba(20,28,44,0.62)", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, overflow: "hidden" },

  perfectWrap: {
    position: "absolute",
    top: "26%",
    left: 0,
    right: 0,
    alignItems: "center",
    pointerEvents: "none",
  },
  perfectText: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.perfect,
    letterSpacing: 1,
  },

  debug: {
    position: "absolute",
    right: 14,
    backgroundColor: "rgba(32,70,83,0.82)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 132,
    pointerEvents: "none",
  },
  debugText: {
    color: "#EAF6F4",
    fontSize: 12,
    fontVariant: ["tabular-nums"],
    lineHeight: 18,
  },

  dailyChip: { marginTop: 2, fontSize: 12, fontWeight: "800", color: "#2a1b12", opacity: 0.8 },
  modeSegWrap: { position: "absolute", left: 0, right: 0, alignItems: "center", zIndex: 60 },
  modeSeg: { flexDirection: "row", backgroundColor: "rgba(255,250,241,0.78)", borderRadius: 999, borderWidth: 1.5, borderColor: "rgba(42,27,18,0.35)", padding: 3 },
  modeSegBtn: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  modeSegBtnOn: { backgroundColor: "#c0472b" },
  modeSegText: { fontSize: 13, fontWeight: "800", color: "#2a1b12" },
  modeSegTextOn: { color: "#fff8ec" },
  stopCardNew: { fontSize: 14, fontWeight: "800", color: "#c0472b", marginTop: 4 },
  albumOverlay: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "rgba(20,12,6,0.55)", alignItems: "center", justifyContent: "center", zIndex: 80 },
  albumCard: { width: "90%", maxWidth: 400, maxHeight: "82%", backgroundColor: "#fff8ec", borderRadius: 22, borderWidth: 3, borderColor: "#c0472b", padding: 16 },
  albumTitle: { fontSize: 22, fontWeight: "900", color: "#2a1b12", textAlign: "center" },
  albumSub: { fontSize: 13, fontWeight: "700", color: "#7a5a44", textAlign: "center", marginTop: 2, marginBottom: 10 },
  albumGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingBottom: 10 },
  albumItem: { width: "48%", marginBottom: 12, alignItems: "center" },
  albumImg: { width: "100%", aspectRatio: 10 / 7 }, // overflow:hidden telefonda resmi köşede minicik kırpıyordu (kullanıcı ekran görüntüsü 14:04)
  bigCardOverlay: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "rgba(10,6,3,0.7)", alignItems: "center", justifyContent: "center", zIndex: 90 },
  bigCardFrame: { width: "94%", maxWidth: 520, backgroundColor: "#f6eedc", borderRadius: 6, padding: 10, paddingBottom: 14, transform: [{ rotate: "-1.5deg" }] },
  bigCardImg: { width: "100%", aspectRatio: 10 / 7 },
  bigCardStamp: { position: "absolute", left: 10, top: 10, backgroundColor: "rgba(246,238,220,0.92)", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  bigCardName: { fontSize: 20, fontWeight: "900", color: "#50281e" },
  bigCardSub: { fontSize: 12, fontWeight: "600", color: "#6e4632" },
  bigCardNote: { marginTop: 10, fontSize: 16, fontStyle: "italic", color: "#3b2418", textAlign: "center" },
  bigCardSign: { marginTop: 4, fontSize: 13, color: "#6e4632", textAlign: "right" },
  arrivalCard: { position: "absolute", right: 14, width: 132, backgroundColor: "#f6eedc", borderRadius: 4, padding: 5, paddingBottom: 6, zIndex: 41, transform: [{ rotate: "-6deg" }], shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
  arrivalImg: { width: "100%", aspectRatio: 10 / 7 },
  arrivalText: { marginTop: 3, fontSize: 11, fontWeight: "800", color: "#50281e", textAlign: "center" },
  albumLocked: { backgroundColor: "#e8dcc6", borderWidth: 2, borderColor: "#cdbb9c", borderStyle: "dashed", alignItems: "center", justifyContent: "center" },
  albumLockedText: { fontSize: 30, fontWeight: "900", color: "#b8a17e" },
  albumName: { marginTop: 4, fontSize: 14, fontWeight: "800", color: "#2a1b12" },
  modeBtn: { width: "100%", marginTop: 10, borderRadius: 16, paddingVertical: 12, alignItems: "center", borderWidth: 2, borderColor: "#c0472b", backgroundColor: "#fff8ec" },
  modeBtnText: { color: "#c0472b", fontSize: 16, fontWeight: "800" },
  stopBannerWrap: { position: "absolute", left: 0, right: 0, alignItems: "center", zIndex: 40 },
  stopSign: { backgroundColor: "#1f4e79", borderRadius: 10, borderWidth: 3, borderColor: "#f4ead8", paddingHorizontal: 18, paddingVertical: 7 },
  stopTitle: { color: "#fff", fontSize: 24, fontWeight: "900", letterSpacing: 0.5, textAlign: "center" },
  stopSignPier: { backgroundColor: "#e2a33a", borderColor: "#2a1b12", paddingHorizontal: 22, paddingVertical: 9 },
  stopTitlePier: { color: "#2a1b12", fontSize: 28 },
  stopSignSubPier: { color: "#2a1b12" },
  challengeBox: { width: "100%", borderRadius: 14, padding: 10, marginBottom: 10, alignItems: "center" },
  challengeWin: { backgroundColor: "#e3f2d6" },
  challengeLose: { backgroundColor: "#f6e0d6" },
  challengeTitle: { fontSize: 13, fontWeight: "800", color: "#6e4632" },
  challengeMain: { fontSize: 18, fontWeight: "900", color: "#2a1b12", marginTop: 2 },
  friendRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 8, borderRadius: 12, marginBottom: 6, backgroundColor: "#fff", borderWidth: 1, borderColor: "#ead8c0" },
  friendAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#3c2878", alignItems: "center", justifyContent: "center", marginRight: 10 },
  friendAvatarText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  friendName: { flex: 1, fontSize: 16, fontWeight: "800", color: "#2a1b12" },
  pcWrap: { width: "86%", maxWidth: 370 },
  // OYUN SONU küçük kart (2026-11-23, Claudex planı; menü kartı pc* stillerini aynen kullanır)
  goOverlay: { justifyContent: "flex-start", backgroundColor: "rgba(20,48,58,0.22)" },
  goWrap: { width: "76%", maxWidth: 330 },
  goShrink: { flexShrink: 1 },
  goScroll: { flexGrow: 0 },
  goInner: { margin: 8, marginTop: 6, paddingTop: 6, paddingBottom: 4, paddingHorizontal: 12 },
  goGreeting: { fontSize: 16, marginLeft: 40, marginRight: 46, marginBottom: 0 },
  goScore: { fontSize: 48, lineHeight: 54 },
  goPlayBtn: { marginTop: 6, paddingVertical: 9 },
  goSmIconRow: { marginTop: 6 },
  goSmLabel: { marginTop: 0 },
  goSmBest: { marginBottom: 2 },
  goSmLine: { paddingVertical: 2, marginTop: 2 },
  goSmHand: { fontSize: 17 },
  goSmLakap: { fontSize: 16, marginTop: 0 },
  goSmLink: { marginTop: 4 },
  goSmIcon: { width: 44, height: 44, borderRadius: 22 },
  goStamp: { right: 14, top: 18, width: 46, height: 54 },
  goSticker: { left: -14, top: -20, width: 70, height: 70, borderRadius: 35 },
  pcTilt: { transform: [{ rotate: "-2deg" }] },
  pcTiltR: { transform: [{ rotate: "1.5deg" }] },
  pcTicket: { overflow: "visible" },
  pcNotch: { position: "absolute", top: "50%", marginTop: -9, width: 18, height: 18, borderRadius: 9, backgroundColor: "#fbf3e2" },
  pcMenuRow: { flexDirection: "row", alignItems: "center", alignSelf: "stretch", marginRight: 56, gap: 12, marginBottom: 2 },
  pcWeatherRow: { flexDirection: "row", alignItems: "center", flexShrink: 1, gap: 5 },
  pcWeatherAttr: { fontSize: 10, fontWeight: "600", color: "#7a5a44", textDecorationLine: "underline" },
  pcWeatherText: { flexShrink: 1, fontFamily: "Noteworthy-Bold", fontSize: 15, color: "#1f4e79" },
  amcaBubble: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 30, paddingVertical: 18, borderRadius: 40, backgroundColor: "#fff8ec", borderWidth: 5, borderColor: "#6e4632" },
  amcaBubbleText: { fontSize: 40, fontWeight: "800", color: "#4a2c1c", flexShrink: 1 },
  pcMenuNote: { fontSize: 18, alignSelf: "stretch", marginRight: 56, textAlign: "left", marginBottom: 2 },
  pcGreetingC: { fontFamily: PC_SCRIPT, fontSize: 20, color: "#1f4e79", alignSelf: "stretch", marginRight: 56, marginLeft: 6 },
  pcVerdict: { fontFamily: PC_TYPE, fontSize: 30, marginTop: 4, alignSelf: "stretch", marginRight: 58, textAlign: "left" },
  pcMiniRow: { flexDirection: "row", gap: 10, marginTop: 12, alignSelf: "stretch", justifyContent: "center" },
  pcMini: { flex: 1, maxWidth: 160, alignItems: "center", paddingVertical: 12, paddingHorizontal: 6, backgroundColor: "#fff", borderWidth: 1.5, borderStyle: "dashed", borderColor: "#c9a77c", borderRadius: 4, shadowColor: "#2a1b12", shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  pcMiniWho: { fontFamily: PC_HAND, fontSize: 17, color: "#1f4e79" },
  pcMiniBig: { fontFamily: PC_TYPE, fontSize: 24, color: "#2a1b12", marginTop: 2 },
  pcMiniSmall: { fontFamily: PC_TYPE, fontSize: 11, color: "#8a6a4a" },
  pcPostmarkSm: { width: 70, height: 70, borderRadius: 35, right: -14, top: undefined, bottom: -18 },
  pcPostmarkInnerSm: { width: 60, height: 60, borderRadius: 30, paddingHorizontal: 4 },
  pcCard: { backgroundColor: "#fbf3e2", borderRadius: 6, overflow: "hidden", shadowColor: "#2a1b12", shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 8 } },
  pcAirmail: { flexDirection: "row", height: 10, overflow: "hidden" },
  pcStripe: { width: 26, height: 10, transform: [{ skewX: "-35deg" }], marginRight: -4 },
  pcInner: { margin: 10, marginTop: 8, paddingTop: 14, paddingBottom: 12, paddingHorizontal: 16, borderWidth: 2, borderStyle: "dashed", borderColor: "#c9a77c", borderRadius: 4, alignItems: "center" },
  pcGreeting: { fontFamily: PC_SCRIPT, fontSize: 20, color: "#1f4e79", marginBottom: 2, alignSelf: "stretch", marginLeft: 48, marginRight: 52 },
  pcLabel: { fontFamily: PC_TYPE, fontSize: 12, letterSpacing: 3, color: "#9b7a5c", marginTop: 4 },
  pcScore: { fontFamily: PC_TYPE, fontSize: 76, color: "#2a1b12", lineHeight: 86 },
  pcBest: { fontFamily: PC_TYPE, fontSize: 14, color: "#7a5a44", marginBottom: 6 },
  pcLine: { alignSelf: "stretch", borderBottomWidth: 1.5, borderBottomColor: "#d9c3a3", borderStyle: "dotted", paddingVertical: 4, marginTop: 4 },
  pcHand: { fontFamily: PC_HAND, fontSize: 19, color: "#1f4e79", textAlign: "center" },
  pcIconRow: { flexDirection: "row", justifyContent: "center", gap: 10, marginTop: 14 },
  pcIconBtn: { alignItems: "center" },
  pcIconCircle: { width: 54, height: 54, borderRadius: 27, backgroundColor: "#fff", borderWidth: 2, borderColor: "#e6cdb0", alignItems: "center", justifyContent: "center" },
  pcIconCircleSm: { width: 46, height: 46, borderRadius: 23 },
  pcIconLabel: { marginTop: 4, fontSize: 11.5, fontWeight: "800", color: "#6e4632" },
  pcStamp: { position: "absolute", right: 18, top: 22, width: 54, height: 64, borderWidth: 4, borderColor: "#fff", borderRadius: 2, transform: [{ rotate: "6deg" }], shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, backgroundColor: "#fff" },
  pcSticker: { position: "absolute", left: -18, top: -26, width: 84, height: 84, borderRadius: 42, overflow: "hidden", borderWidth: 3, borderColor: "#fff", backgroundColor: "#f3d9b0", transform: [{ rotate: "-8deg" }] },
  pcPostmark: { position: "absolute", right: 2, top: 96, width: 106, height: 106, borderRadius: 53, borderWidth: 3, borderColor: "rgba(140,30,70,0.9)", alignItems: "center", justifyContent: "center" },
  pcPostmarkInner: { width: 90, height: 90, borderRadius: 45, paddingHorizontal: 8, borderWidth: 1.5, borderColor: "rgba(140,30,70,0.9)", alignItems: "center", justifyContent: "center" },
  pcPostmarkBig: { fontFamily: PC_TYPE, fontSize: 14, color: "rgba(140,30,70,0.95)", marginVertical: 2 },
  pcPostmarkSmall: { fontFamily: PC_TYPE, fontSize: 8, color: "rgba(140,30,70,0.95)", letterSpacing: 1 },
  menuOverlay: { ...absoluteFill(), alignItems: "center", backgroundColor: "rgba(20,48,58,0.12)" },
  menuTitle: { fontSize: 42, fontWeight: "900", color: "#fff8ec", letterSpacing: 3, textShadowColor: "rgba(42,27,18,0.65)", textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 8 },
  eventPill: { backgroundColor: "rgba(192,71,43,0.92)", paddingHorizontal: 14, paddingVertical: 4, borderRadius: 14, marginTop: 0, marginBottom: 6, maxWidth: "92%", transform: [{ rotate: "-2deg" }] },
  eventPillText: { color: "#fff8ec", fontWeight: "900", fontSize: 15 },
  menuTag: { fontSize: 9, color: "rgba(255,248,236,0.7)", marginTop: -8, marginBottom: 6 },
  menuSub: { fontSize: 16, fontWeight: "800", color: "#fff8ec", marginTop: 2, marginBottom: 10, textShadowColor: "rgba(42,27,18,0.6)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  menuCard: { paddingTop: 14, paddingBottom: 10 },
  iconBtn: { flexDirection: "row", justifyContent: "center", gap: 8 },
  linkRow: { flexDirection: "row", alignItems: "center", alignSelf: "center", gap: 6, marginTop: 10 },
  raceCols: { flexDirection: "row", gap: 8, marginTop: 10, width: "100%" },
  raceCol: { flex: 1, alignItems: "center", paddingVertical: 10, paddingHorizontal: 6, borderRadius: 14, backgroundColor: "#fff", borderWidth: 2, borderColor: "#ead8c0" },
  raceColWin: { borderColor: "#e2a33a", borderWidth: 3, backgroundColor: "#fff6df" },
  raceBig: { fontSize: 24, fontWeight: "900", color: "#2a1b12", marginTop: 2 },
  raceSmall: { fontSize: 12, fontWeight: "700", color: "#8a6a4a" },
  raceVerdict: { fontSize: 30, fontWeight: "900", textAlign: "center", marginTop: 2 },
  raceRow: { flexDirection: "row", alignItems: "center", marginTop: 8, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 12, backgroundColor: "#fff", borderWidth: 1, borderColor: "#ead8c0" },
  raceWho: { fontSize: 15, fontWeight: "900", color: "#2a1b12" },
  raceStat: { flex: 1, fontSize: 14, fontWeight: "800", color: "#6e4632", textAlign: "right" },
  raceNote: { fontSize: 11, color: "#8a6a4a", textAlign: "center", marginTop: 8 },
  friendScore: { fontSize: 12, fontWeight: "700", color: "#8a6a4a", marginTop: 1 },
  friendGo: { fontSize: 14, fontWeight: "900", color: "#c0472b" },
  friendMsg: { fontSize: 14, color: "#6e4632", textAlign: "center", marginVertical: 12 },
  friendPill: { width: "100%", marginTop: 10, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#3c2878" },
  friendPillText: { flex: 1, fontSize: 14, fontWeight: "800", color: "#fff" },
  friendPillGo: { marginLeft: 8, fontSize: 15, fontWeight: "900", color: "#ffd66b" },
  lakapLine: { marginTop: 2, fontFamily: PC_HAND, fontSize: 18, color: "#a8432a", textAlign: "center" },
  toastWrap: { position: "absolute", left: 16, right: 16, alignItems: "center", zIndex: 95 },
  toastText: { backgroundColor: "rgba(30,20,60,0.92)", color: "#fff", fontSize: 15, fontWeight: "800", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14, overflow: "hidden", textAlign: "center" },
  goInfoPill: { width: "100%", marginTop: 10, borderRadius: 12, paddingVertical: 7, paddingHorizontal: 10, alignItems: "center", backgroundColor: "rgba(192,71,43,0.08)" },
  goInfoMain: { fontSize: 14, fontWeight: "800", color: "#2a1b12", textAlign: "center" },
  goInfoNew: { marginTop: 3, fontSize: 13, fontWeight: "700", color: "#9a5a1e", textAlign: "center" },
  goLink: { marginTop: 8, fontSize: 14, fontWeight: "800", color: "#c0472b", textAlign: "center" },
  goIconRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 14 },
  goIcon: { flex: 1, marginHorizontal: 3, alignItems: "center", paddingVertical: 8, borderRadius: 14, backgroundColor: "#fff8ec", borderWidth: 2, borderColor: "#e6cdb0" },
  goIconEmoji: { fontSize: 24 },
  goIconLabel: { marginTop: 2, fontSize: 11, fontWeight: "800", color: "#6e4632" },
  goCodeRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 12 },
  goCodeLabel: { fontSize: 12, fontWeight: "700", color: "#9b7a5c", marginRight: 8 },
  goCodeValue: { fontSize: 17, fontWeight: "900", letterSpacing: 1.5, color: "#2a1b12" },
  goCopyBtn: { marginLeft: 8, width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: "#fff8ec", borderWidth: 2, borderColor: "#e6cdb0" },
  goCopyText: { fontSize: 16 },
  codeShow: { width: "100%", marginTop: 10, borderRadius: 12, borderWidth: 2, borderStyle: "dashed", borderColor: "#c0472b", paddingVertical: 6, alignItems: "center", backgroundColor: "#fffdf6" },
  codeShowLabel: { fontSize: 12, fontWeight: "700", color: "#6e4632" },
  codeShowValue: { fontSize: 24, fontWeight: "900", letterSpacing: 2, color: "#2a1b12" },
  challengeRow: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  challengeHalf: { width: "48%" },
  challengeChip: { marginTop: 6, alignSelf: "center", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, overflow: "hidden", fontSize: 15, fontWeight: "900", color: "#fff", backgroundColor: "rgba(60,40,120,0.85)" },
  codeInput: { marginTop: 12, marginBottom: 6, borderWidth: 2, borderColor: "#c0472b", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 24, fontWeight: "800", letterSpacing: 2, color: "#2a1b12", backgroundColor: "#fff", textAlign: "center" },
  codeError: { color: "#b23a2a", fontWeight: "700", textAlign: "center", marginBottom: 6 },
  skullChip: { marginTop: 6, alignSelf: "center", paddingHorizontal: 14, paddingVertical: 5, borderRadius: 14, overflow: "hidden", fontSize: 17, fontWeight: "900", color: "#fff" },
  skullBadge: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 30, borderWidth: 5, borderColor: "#fff8ec" },
  skullBadgeText: { fontSize: 46, fontWeight: "900", color: "#fff" },
  skullChipUp: { backgroundColor: "rgba(196,140,32,0.9)" },
  skullChipDown: { backgroundColor: "rgba(178,48,40,0.9)" },
  bridgeWrap: { position: "absolute", left: 0, right: 0, alignItems: "center", zIndex: 39 },
  bridgePill: { backgroundColor: "rgba(20,40,70,0.78)", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 6, alignItems: "center" },
  bridgeName: { color: "#f4ead8", fontSize: 13, fontWeight: "700", marginBottom: 4 },
  bridgeRow: { flexDirection: "row", alignItems: "center" },
  bridgeSide: { color: "#f4ead8", fontSize: 11, fontWeight: "600" },
  bridgeTrack: { width: 120, height: 6, borderRadius: 3, backgroundColor: "rgba(244,234,216,0.3)", marginHorizontal: 8, overflow: "hidden" },
  bridgeFill: { height: 6, borderRadius: 3, backgroundColor: "#e8a33d" },
  stopSignSub: { color: "#f4ead8", fontSize: 13, fontWeight: "800", textAlign: "center", marginTop: 1 },
  stopSubPill: { marginTop: 6, backgroundColor: "rgba(255,248,236,0.88)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 3 },
  stopSub: { color: "#2a1b12", fontSize: 16, fontWeight: "800" },
  stopCardBox: { alignSelf: "stretch", alignItems: "center", backgroundColor: "#f3e3c8", borderRadius: 14, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 16, marginTop: -6 },
  stopCardMain: { fontSize: 16, fontWeight: "800", color: "#2a1b12" },
  stopCardSub: { fontSize: 14, fontWeight: "700", color: "#7a5a44", marginTop: 2 },
  flagPole: { position: "absolute", left: 0, top: 0, width: 4, height: 54, backgroundColor: "#3a281c" },
  flagCloth: { position: "absolute", left: 4, top: 2, backgroundColor: "#c0472b", borderWidth: 1.5, borderColor: "#fff8ec", paddingHorizontal: 7, paddingVertical: 4, borderTopRightRadius: 6, borderBottomRightRadius: 6 },
  flagText: { color: "#fff8ec", fontSize: 14, fontWeight: "900", letterSpacing: 0.5 },
  overlay: {
    ...absoluteFill(),
    backgroundColor: "rgba(20,48,58,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "84%",
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: "center",
    ...Platform.select({
      web: { boxShadow: "0px 12px 24px rgba(0,0,0,0.15)" },
      default: {
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
        elevation: 8,
      },
    }),
  },
  gameOverTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.onSurface,
    marginBottom: 20,
  },
  finalBest: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.muted,
    marginTop: 4,
    marginBottom: 24,
  },
  gameOverLine: {
    fontSize: 13,
    fontStyle: "italic",
    color: colors.muted,
    marginTop: -16,
    marginBottom: 24,
    textAlign: "center",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.muted,
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 56,
    fontWeight: "800",
    color: colors.onSurface,
    marginTop: 2,
  },
  playBtn: {
    width: "100%",
    backgroundColor: colors.brandPrimary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  playBtnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  // FAZ1 Turkish result card + HUD bits (plain Views, no clipping masks)
  trCard: {
    width: "86%", maxWidth: 370, backgroundColor: "#fff8ec", borderRadius: 22, borderWidth: 3, borderColor: "#c0472b",
    paddingTop: 18, paddingBottom: 14, paddingHorizontal: 22, alignItems: "center",
    ...Platform.select({
      web: { boxShadow: "0px 12px 24px rgba(0,0,0,0.25)" },
      default: { shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
    }),
  },
  kilimRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  kilimDot: { width: 10, height: 10, transform: [{ rotate: "45deg" }] },
  trScore: { fontSize: 72, fontWeight: "900", color: "#2a1b12", marginTop: -2, letterSpacing: -2 },
  trBest: { fontSize: 15, fontWeight: "700", color: "#7a5a44", marginTop: 0, marginBottom: 18 },
  recordBadge: { backgroundColor: "#e2a33a", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 5, marginBottom: 18 },
  recordBadgeText: { color: "#2a1b12", fontSize: 15, fontWeight: "900", letterSpacing: 1 },
  bubble: { alignSelf: "stretch", backgroundColor: "#f3e3c8", borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16, marginBottom: 22 },
  bubbleText: { fontSize: 17, lineHeight: 23, fontWeight: "700", color: "#3a281c", textAlign: "center" },
  bubbleTail: { position: "absolute", bottom: -7, left: 34, width: 14, height: 14, backgroundColor: "#f3e3c8", transform: [{ rotate: "45deg" }] },
  trPlayBtn: { width: "100%", backgroundColor: "#c0472b", borderRadius: 16, paddingVertical: 16, alignItems: "center" },
  trBuildTag: { fontSize: 9, color: "rgba(58,40,28,0.35)", marginTop: 10 },
  hintPill: { backgroundColor: "rgba(32,20,12,0.72)", borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8 },
  hintPillText: { color: "#fff8ec", fontSize: 16, fontWeight: "800", letterSpacing: 0.3 },
  bigPopText: {
    fontSize: 60, fontWeight: "900", color: "#ffcf4a", textAlign: "center", letterSpacing: -1,
    textShadowColor: "rgba(60,30,10,0.9)", textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 2,
  },
  bigPopSub: { fontSize: 40, textAlign: "center", marginTop: -2 },
  playBtnText: {
    color: colors.onBrandPrimary,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
}));
