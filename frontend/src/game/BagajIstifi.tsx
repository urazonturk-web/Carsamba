// DURAK OYUNU — Harem: Bagaj İstifi (2026-11-26, kullanıcı: "Harem luggage puzzle"; rapor
// ai_review_evidence/DURAK-OYUN-2026-11-26/RAPOR.md). İlk durağa varınca ana oyun durur, mola
// kartı açılır: otobüsün bagaj gözüne eşyaları sığdır. Prototip: eşyalar kodla çizilmiş kutular +
// emoji (Kıvılcım görseli kullanıcı kabulünden sonra). Ödül yok; kaybetmenin cezası yok.
// Ana oyunun fiziğine, kamerasına, puanına dokunmaz: yalnız `running` bir süre 0 tutulur.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, PanResponder, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";

export const BAGAJ_ON = true as boolean;
/** GEÇİCİ deneme: ilk inişte açılır (simülatör). Teslimde false. */
export const BAGAJ_TEST = false as boolean;
export const BAGAJ_DURAK = 1; // Harem
export const BAGAJ_SURE = 45; // sn
const COLS = 6;
const ROWS = 4;

type Cell = [number, number]; // [col, row]
type Piece = { id: number; cells: Cell[]; emoji: string; ad: string; renk: string };

// Şablonlar (sütun, satır). Döndürmeler üretimde.
const SABLON: { cells: Cell[]; emoji: string; ad: string; renk: string; agirlik: number }[] = [
  { cells: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2]], emoji: "🧳", ad: "Koca valiz", renk: "#8d5a3b", agirlik: 3 },
  { cells: [[0, 0], [1, 0], [0, 1], [1, 1]], emoji: "🧺", ad: "Hasır sepet", renk: "#c49a4a", agirlik: 4 },
  { cells: [[0, 0], [1, 0], [2, 0], [3, 0]], emoji: "🧶", ad: "Rulo halı", renk: "#a8323a", agirlik: 3 },
  { cells: [[0, 0], [1, 0], [2, 0]], emoji: "🍉", ad: "Karpuz çuvalı", renk: "#4f8a3c", agirlik: 3 },
  { cells: [[0, 0], [1, 0], [0, 1]], emoji: "📺", ad: "Eski televizyon", renk: "#5a6470", agirlik: 3 },
  { cells: [[0, 0], [1, 0]], emoji: "🧳", ad: "Küçük valiz", renk: "#2f6f8f", agirlik: 1 },
  { cells: [[0, 0], [1, 0]], emoji: "📦", ad: "Koli", renk: "#b08a5a", agirlik: 1 },
  { cells: [[0, 0], [1, 0]], emoji: "🎒", ad: "Sırt çantası", renk: "#5f7f3a", agirlik: 1 },
  { cells: [[0, 0], [1, 0], [1, 1]], emoji: "🪑", ad: "Katlanır sandalye", renk: "#7a4f8c", agirlik: 2 },
  { cells: [[0, 0]], emoji: "🐔", ad: "Tavuk kafesi", renk: "#d9a441", agirlik: 1 },
];

function dondur(cells: Cell[]): Cell[] {
  const r = cells.map(([c, w]) => [-w, c] as Cell);
  return normal(r);
}
function normal(cells: Cell[]): Cell[] {
  const mc = Math.min(...cells.map((x) => x[0]));
  const mr = Math.min(...cells.map((x) => x[1]));
  return cells.map(([c, r]) => [c - mc, r - mr] as Cell).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}
function boyut(cells: Cell[]) {
  return { w: Math.max(...cells.map((x) => x[0])) + 1, h: Math.max(...cells.map((x) => x[1])) + 1 };
}

/** Izgarayı şablonlarla tamamen dolduran rastgele bir parça seti üretir (çözümü kesin var). */
function uret(): Piece[] {
  for (let deneme = 0; deneme < 200; deneme++) {
    const grid: number[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(-1));
    const out: Piece[] = [];
    let tavuk = 0;
    const say: Record<string, number> = {};
    const doldur = (): boolean => {
      let fc = -1, fr = -1;
      for (let r = 0; r < ROWS && fr < 0; r++) for (let c = 0; c < COLS; c++) if (grid[r][c] < 0) { fc = c; fr = r; break; }
      if (fr < 0) return true;
      const aday = SABLON.flatMap((s) => Array(s.agirlik).fill(s)).sort(() => Math.random() - 0.5);
      for (const s of aday) {
        if (s.cells.length === 1 && tavuk >= 1) continue;
        if ((say[s.ad] ?? 0) >= 2) continue;
        let cells = normal(s.cells);
        const rot = Math.floor(Math.random() * 4);
        for (let k = 0; k < 4; k++) {
          // Hücrelerden biri (ilk boş hücreye) oturacak şekilde: şablonun satır-öncelikli ilk hücresi = (fc,fr).
          const [ac, ar] = cells[0];
          const yer = cells.map(([c, r]) => [c - ac + fc, r - ar + fr] as Cell);
          if (yer.every(([c, r]) => c >= 0 && r >= 0 && c < COLS && r < ROWS && grid[r][c] < 0)) {
            const id = out.length;
            yer.forEach(([c, r]) => (grid[r][c] = id));
            out.push({ id, cells: normal(cells), emoji: s.emoji, ad: s.ad, renk: s.renk });
            if (s.cells.length === 1) tavuk++;
            say[s.ad] = (say[s.ad] ?? 0) + 1;
            if (doldur()) return true;
            out.pop();
            say[s.ad] -= 1;
            if (s.cells.length === 1) tavuk--;
            yer.forEach(([c, r]) => (grid[r][c] = -1));
          }
          cells = dondur(cells);
          void rot;
        }
      }
      return false;
    };
    if (doldur() && out.length >= 5 && out.length <= 9) {
      // Tepside karışık ve rastgele döndürülmüş gelsin.
      return out
        .map((p) => {
          let cells = p.cells;
          const k = Math.floor(Math.random() * 4);
          for (let i = 0; i < k; i++) cells = dondur(cells);
          return { ...p, cells };
        })
        .sort(() => Math.random() - 0.5)
        .map((p, i) => ({ ...p, id: i }));
    }
  }
  return [];
}

type Yer = { c: number; r: number } | null;

export default function BagajIstifi({ onBitti }: { onBitti: (kazandi: boolean | null) => void }) {
  const { width: W, height: H } = useWindowDimensions();
  const [asama, setAsama] = useState<"kart" | "oyun" | "son">("kart");
  const [kazandi, setKazandi] = useState(false);
  const [parcalar, setParcalar] = useState<Piece[]>(() => uret());
  const [yerler, setYerler] = useState<Yer[]>(() => []);
  const [kalan, setKalan] = useState(BAGAJ_SURE);
  const [surukle, setSurukle] = useState<number>(-1);
  const pan = useRef(new Animated.ValueXY()).current;
  const tutma = useRef({ x: 0, y: 0, sx: 0, sy: 0, tepsi: false });

  const cell = Math.floor(Math.min((W - 56) / COLS, 54));
  const gridW = cell * COLS;
  const gridX = Math.round((W - gridW) / 2);
  const gridY = Math.round(H * 0.2);
  const tc = Math.round(cell * 0.6); // tepsi hücresi
  const tepsiY = gridY + cell * ROWS + 34;

  useEffect(() => { setYerler(parcalar.map(() => null)); }, [parcalar]);

  // Süre
  useEffect(() => {
    if (asama !== "oyun") return;
    const t = setInterval(() => setKalan((k) => k - 1), 1000);
    return () => clearInterval(t);
  }, [asama]);
  useEffect(() => {
    if (asama === "oyun" && kalan <= 0) { setKazandi(false); setAsama("son"); }
  }, [kalan, asama]);

  const dolu = (haric: number) => {
    const g: number[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(-1));
    yerler.forEach((y, i) => { if (y && i !== haric) parcalar[i].cells.forEach(([c, r]) => (g[y.r + r][y.c + c] = i)); });
    return g;
  };
  const sigar = (i: number, cells: Cell[], y: { c: number; r: number }) => {
    const g = dolu(i);
    return cells.every(([c, r]) => { const cc = y.c + c, rr = y.r + r; return cc >= 0 && rr >= 0 && cc < COLS && rr < ROWS && g[rr][cc] < 0; });
  };

  // Tepsi yerleşimi (yerleşmemiş parçalar, akış düzeni).
  const tepsi = useMemo(() => {
    const pos: Record<number, { x: number; y: number }> = {};
    let x = 20, y = tepsiY, satirH = 0;
    parcalar.forEach((p, i) => {
      if (yerler[i]) return;
      const b = boyut(p.cells);
      if (x + b.w * tc > W - 20) { x = 20; y += satirH + 14; satirH = 0; }
      pos[i] = { x, y };
      x += b.w * tc + 16;
      satirH = Math.max(satirH, b.h * tc);
    });
    return pos;
  }, [parcalar, yerler, tc, W, tepsiY]);

  const bitti = yerler.length > 0 && yerler.every((y) => y);
  useEffect(() => { if (asama === "oyun" && bitti) { setKazandi(true); setAsama("son"); } }, [bitti, asama]);

  // Güncel durum ref'te: sürükleme sırasında yeniden çizim olsa da tutucular aynı kalır.
  const ref = useRef({ asama, yerler, parcalar, cell, tc, gridX, gridY, sigar });
  ref.current = { asama, yerler, parcalar, cell, tc, gridX, gridY, sigar };
  const tutucular = useRef<Record<number, ReturnType<typeof PanResponder.create>>>({});
  const responder = (i: number) => {
    if (tutucular.current[i]) return tutucular.current[i];
    tutucular.current[i] = PanResponder.create({
      onStartShouldSetPanResponder: () => ref.current.asama === "oyun",
      onMoveShouldSetPanResponder: () => ref.current.asama === "oyun",
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        const { yerler, cell, tc } = ref.current;
        const { pageX, pageY, locationX, locationY } = e.nativeEvent;
        const yer = yerler[i];
        const k = yer ? 1 : cell / tc;
        const tx = pageX - locationX * k, ty = pageY - locationY * k;
        tutma.current = { x: tx, y: ty, sx: pageX, sy: pageY, tepsi: !yer };
        pan.setValue({ x: tx, y: ty });
        setSurukle(i);
      },
      onPanResponderMove: (_e, g) => {
        pan.setValue({ x: tutma.current.x + g.dx, y: tutma.current.y + g.dy });
      },
      onPanResponderRelease: (_e, g) => {
        setSurukle(-1);
        const { yerler, parcalar, cell, gridX, gridY, sigar } = ref.current;
        const p = parcalar[i];
        if (Math.abs(g.dx) < 6 && Math.abs(g.dy) < 6) {
          // Dokunma = döndür. Yerleşikse dönmüş hâli sığmazsa tepsiye döner.
          const yeni = dondur(p.cells);
          const y = yerler[i];
          setParcalar((ps) => ps.map((q, j) => (j === i ? { ...q, cells: yeni } : q)));
          if (y && !sigar(i, yeni, y)) setYerler((ys) => ys.map((q, j) => (j === i ? null : q)));
          return;
        }
        const x = tutma.current.x + g.dx, yy = tutma.current.y + g.dy;
        const c = Math.round((x - gridX) / cell), r = Math.round((yy - gridY) / cell);
        const yer = { c, r };
        setYerler((ys) => ys.map((q, j) => (j === i ? (sigar(i, p.cells, yer) ? yer : null) : q)));
      },
    });
    return tutucular.current[i];
  };

  const ciz = (p: Piece, cs: number) =>
    p.cells.map(([c, r], k) => (
      <View key={k} style={{ position: "absolute", left: c * cs, top: r * cs, width: cs, height: cs, backgroundColor: p.renk, borderWidth: 1.5, borderColor: "rgba(0,0,0,0.35)", borderRadius: cs * 0.14, alignItems: "center", justifyContent: "center" }}>
        {k === 0 ? <Text style={{ fontSize: cs * 0.55 }}>{p.emoji}</Text> : null}
      </View>
    ));

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 9999, elevation: 9999 }]} testID="bagaj-istifi">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(28,20,14,0.93)" }]} />
      {asama === "kart" && (
        <View style={st.kartWrap}>
          <View style={st.kart}>
            <Text style={st.ust}>Harem · Mola</Text>
            <Text style={st.baslik}>Bagaj İstifi</Text>
            <Text style={st.metin}>Muavin bağırıyor: "Kalkıyoruz amca!" Eşyaları otobüsün bagaj gözüne sığdır.</Text>
            <Text style={st.ipucu}>Sürükle: yerleştir · Dokun: döndür · {BAGAJ_SURE} saniye</Text>
            <Pressable testID="bagaj-oyna" style={({ pressed }) => [st.btn, pressed && { opacity: 0.8 }]} onPress={() => { setKalan(BAGAJ_SURE); setAsama("oyun"); }}>
              <Text style={st.btnT}>Oyna</Text>
            </Pressable>
            <Pressable testID="bagaj-gec" onPress={() => onBitti(null)} hitSlop={10}>
              <Text style={st.gec}>Geç</Text>
            </Pressable>
          </View>
        </View>
      )}
      {asama !== "kart" && (
        <>
          <Text style={[st.hud, { top: gridY - 74 }]}>Bagaj gözü · {Math.max(0, kalan)} sn</Text>
          <Text style={[st.muavin, { top: gridY - 44 }]}>{kalan > 15 ? "Muavin: \"Sıkıştır amca, sıkıştır!\"" : "Muavin: \"Kalkıyoruz, kalkıyoruz!\""}</Text>
          {/* Bagaj gözü ızgarası */}
          <View style={{ position: "absolute", left: gridX - 6, top: gridY - 6, width: gridW + 12, height: cell * ROWS + 12, borderRadius: 10, backgroundColor: "#2b2f36", borderWidth: 3, borderColor: "#c9ced6" }} />
          {Array.from({ length: ROWS * COLS }).map((_, k) => (
            <View key={k} style={{ position: "absolute", left: gridX + (k % COLS) * cell, top: gridY + Math.floor(k / COLS) * cell, width: cell, height: cell, borderWidth: 0.5, borderColor: "rgba(255,255,255,0.12)" }} />
          ))}
          {parcalar.map((p, i) => {
            const y = yerler[i];
            const cs = y ? cell : tc;
            const pos = y ? { x: gridX + y.c * cell, y: gridY + y.r * cell } : tepsi[i];
            if (!pos) return null;
            const b = boyut(p.cells);
            return (
              <View key={p.id} {...responder(i).panHandlers} style={{ position: "absolute", left: pos.x, top: pos.y, width: b.w * cs, height: b.h * cs, opacity: i === surukle ? 0 : 1 }}>
                {ciz(p, cs)}
              </View>
            );
          })}
          {surukle >= 0 && (() => {
            const p = parcalar[surukle];
            const b = boyut(p.cells);
            return (
              <Animated.View pointerEvents="none" style={{ position: "absolute", left: 0, top: 0, width: b.w * cell, height: b.h * cell, opacity: 0.9, transform: pan.getTranslateTransform() }}>
                {ciz(p, cell)}
              </Animated.View>
            );
          })()}
        </>
      )}
      {asama === "son" && (
        <View style={st.kartWrap}>
          <View style={st.kart}>
            <Text style={st.baslik}>{kazandi ? "Bagaj tamam!" : "Otobüs kalktı!"}</Text>
            <Text style={st.metin}>{kazandi ? `Muavin: "Süpersin amca, geç arkaya!" (${BAGAJ_SURE - kalan} sn)` : "Bagaj sende kaldı amca. Neyse, yola devam."}</Text>
            <Pressable testID="bagaj-devam" style={({ pressed }) => [st.btn, pressed && { opacity: 0.8 }]} onPress={() => onBitti(kazandi)}>
              <Text style={st.btnT}>Yola devam</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  kartWrap: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, alignItems: "center", justifyContent: "center", padding: 24 },
  kart: { width: "100%", maxWidth: 360, backgroundColor: "#fbf3e4", borderRadius: 18, padding: 22, alignItems: "center", borderWidth: 2, borderColor: "#c0472b" },
  ust: { fontSize: 13, fontWeight: "800", color: "#1f4e79", letterSpacing: 1 },
  baslik: { fontSize: 28, fontWeight: "900", color: "#3a281c", marginTop: 4 },
  metin: { fontSize: 15, color: "#3a281c", textAlign: "center", marginTop: 10, lineHeight: 21 },
  ipucu: { fontSize: 12, color: "#8a6a55", textAlign: "center", marginTop: 8 },
  btn: { marginTop: 18, backgroundColor: "#c0472b", borderRadius: 14, paddingVertical: 13, paddingHorizontal: 44 },
  btnT: { color: "#fff", fontSize: 18, fontWeight: "900" },
  gec: { marginTop: 14, fontSize: 15, fontWeight: "700", color: "#8a6a55" },
  hud: { position: "absolute", left: 0, right: 0, textAlign: "center", color: "#fff8ec", fontSize: 20, fontWeight: "900" },
  muavin: { position: "absolute", left: 0, right: 0, textAlign: "center", color: "#ffd58a", fontSize: 14, fontWeight: "700" },
});
