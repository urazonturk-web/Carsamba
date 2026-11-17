// PİJAMA ANI (PIJAMA-A, 2026-11-16, kullanıcı: "Evet, bağla").
// Gece başlarken (Ortaköy, 5. durak) amca çatıda beliren bir kapıdan girip gece
// külahı ve ev terliğiyle çıkar. Pozlar yeniden çizilmedi: külah ve terlikler her
// şarj pozunun üstüne ayrı katman. Görseller Kıvılcım'dan (kullanıcı onaylı 4 çağrı),
// yerleşim Claude Code ölçümü: ai_review_evidence/PIJAMA-2026-11-16/.
// Fizik, kule, kamera değişmez; yalnız çizim katmanı. false = tamamen kapalı.

export const PIJAMA_ON = true as boolean;
// TELEFON DENEMESİ: true iken kapı anı 75. kule (Ortaköy, gece) yerine ilk durakta
// (15. kule) oynar, kolayca görülsün diye. Kabulden sonra false yapılacak.
export const PIJAMA_TEST_EARLY = false as boolean;
// TELEFON DENEMESİ (2026-11-16, kullanıcı: "denemem için 73. kuleden başlat"):
// 0 dışı bir değer, her koşuyu bu kule kimliğinden başlatır (gökyüzü, durak ve
// zorluk o kuleye göre). Kabulden sonra 0 yapılacak.
export const TEST_START_TOWER = 0 as number; // deneme başlangıcı kapalı (kullanıcı kabul etti)

export const HAT_SOURCE = require("@/assets/characters/pijama/gece-kulahi.png");
export const SLIPPER_SOURCE = require("@/assets/characters/pijama/terlik.png");
export const DOOR_CLOSED_SOURCE = require("@/assets/environment/pijama/cati-kapisi-kapali.png");
export const DOOR_OPEN_SOURCE = require("@/assets/environment/pijama/cati-kapisi-acik.png");
export const DOOR_ASPECT = 589 / 700; // genişlik / yükseklik (kırpılmış görsel)
export const DOOR_HEIGHT_RATIO = 1.45; // kapı boyu = ayaktaki amcanın boyu × bu oran (görünen kısım ≈ 1,3×; kullanıcı: "kapı adamın boyutunda olmalı, ilk kapı boyutu daha iyiydi")

// Poz tuvali pikselinde (516 px genişlik, sol üst köşe 0,0). Başın yeri 9 pozda aynı.
// Kullanıcı: "külah havada duruyor gibi" -> büyütüldü; "önde kalmış" -> geriye çekildi.
export const HAT_BOX = { x: -50, y: -75, w: 530, h: 454 };

// Her poz için [arka ayak, ön ayak] terlik kutusu (poz tuvali pikseli). Boyut sabit,
// yalnız konum ayakkabıyı izler (kullanıcı: "ayakkabılardaki yerleşimle aynı olmalı").
export const SLIPPER_BOXES: readonly (readonly { x: number; y: number; w: number; h: number }[])[] = [
  [{x:217,y:1024,w:158,h:78},{x:91,y:1018,w:182,h:89}], // 000
  [{x:220,y:1001,w:158,h:78},{x:84,y:991,w:182,h:89}], // 012
  [{x:220,y:976,w:158,h:78},{x:83,y:966,w:182,h:89}], // 025
  [{x:220,y:951,w:158,h:78},{x:83,y:937,w:182,h:89}], // 037
  [{x:218,y:924,w:158,h:78},{x:81,y:914,w:182,h:89}], // 050
  [{x:226,y:898,w:158,h:78},{x:88,y:883,w:182,h:89}], // 062
  [{x:213,y:865,w:158,h:78},{x:75,y:859,w:182,h:89}], // 075
  [{x:210,y:836,w:158,h:78},{x:81,y:829,w:182,h:89}], // 087
  [{x:212,y:806,w:158,h:78},{x:78,y:795,w:182,h:89}], // 100
];

// Kapı anının zamanlaması (ms). 2026-11-16 kullanıcı (video 11-25-15): "kapı kuleyi
// ortalasa daha iyi olur, adam bir iki adımla içeri girer ve tekrar aynı yerine gelir".
export const DOOR_MS = {
  appear: 200, // kapı kule ortasında belirir (kapalı)
  open: 280, // kapı açılır
  walkIn: [320, 720] as const, // amca 2 adımla kapıya yürür
  charOut: [600, 820] as const, // kapıda soluklaşıp girer
  swap: 840, // içeride: pijama giyilir, lekeler temizlenir
  charIn: [920, 1140] as const, // pijamalı amca kapıda belirir
  walkOut: [1140, 1540] as const, // 2 adımla indiği yere döner
  doorOut: [1480, 1720] as const, // kapı kaybolur
  unlock: 1540, // dokunma kilidi kalkar (amca yerine dönünce)
};
// Kapının alt kısmı çatının arkasında kalır (video: sivri çatı tepesinde havada duruyordu).
export const DOOR_SINK = 0.1; // kapı boyunun bu kadarı çatı tepesinin altına iner (0.32 fazla geldi: kapı amcadan kısa göründü)
export const STEP_LIFT = 7; // adım başına zıplama (dünya birimi), yalnız görüntü
