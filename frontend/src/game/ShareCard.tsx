// PAYLAŞIM KARTPOSTALI (2026-11-18, kullanıcı: "Paylaşım kartpostalı"; ai_review_evidence/FIKIR-GELIR-2026-11-18/RAPOR.md).
// Oyun sonunda o koşunun kartpostalı: ulaşılan semtin kartpostal görseli, amca, skor, günün İstanbul havası ve saati.
// "Gönder" kartın ekrandaki dikdörtgenini görüntü olarak alır (yerel modül, yeni paket yok) ve iOS paylaşım sayfasını açar.
import { useRef, useState } from "react";
import { Platform, Pressable, Text, View, StyleSheet } from "react-native";
import { Image as CachedImage } from "expo-image";

import * as GameCenter from "../../modules/byzantion-gamecenter/src";

export const SHARE_CARD_ON = true as boolean;
export const SHARE_LINK = "https://testflight.apple.com/join/rTMbjKcS"; // App Store'a çıkınca mağaza bağlantısı

const HAND = Platform.OS === "ios" ? "Noteworthy-Bold" : undefined;
const TYPE = Platform.OS === "ios" ? "AmericanTypewriter-Bold" : undefined;
const SCRIPT = Platform.OS === "ios" ? "SnellRoundhand-Bold" : undefined;

export type ShareCardProps = {
  score: number;
  newRecord: boolean;
  place: string | null; // "Üsküdar'a kadar geldim" (stops.ts reachedLine); null = ilk durağa varamadı
  photo: any; // kartpostal görseli (semt ya da Galata)
  sticker: any; // amcanın ifadeli pozu
  stamp: string; // "18 Kasım, Yağmurlu, 12°"
  time: string; // "21:40"
  lakap?: string | null; // "Üsküdar'da aceleci" (amcaSesi.ts lakap) — damga olarak fotoğrafın köşesinde
  onClose: () => void;
};

export function shareMessage(score: number, place: string | null, lakap?: string | null) {
  const where = place ? `, ${place}` : "";
  const nick = lakap ? ` Lakabım: ${lakap}.` : "";
  return `Byzantion'da amcayla İstanbul çatılarında ${score} puan yaptım${where}!${nick} Sen de dene: ${SHARE_LINK}`;
}

export function ShareSheet({ score, newRecord, place, photo, sticker, stamp, time, lakap, onClose }: ShareCardProps) {
  const cardRef = useRef<any>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const send = () => {
    if (busy || !cardRef.current) return;
    setBusy(true);
    setNote(null);
    cardRef.current.measureInWindow(async (x: number, y: number, w: number, h: number) => {
      const r = await GameCenter.shareSnapshot(x, y, w, h, shareMessage(score, place, lakap));
      setBusy(false);
      if (r === "shared") onClose();
      else if (r === "error" || r === "unavailable") setNote("Paylaşım açılamadı, tekrar dene.");
    });
  };

  return (
    <View style={s.backdrop} testID="share-sheet">
      <View ref={cardRef} collapsable={false} style={s.card}>
        <View style={s.airmail}>
          {Array.from({ length: 16 }).map((_, k) => <View key={k} style={[s.stripe, { backgroundColor: k % 2 ? "#1f4e79" : "#c0472b" }]} />)}
        </View>
        <View style={s.photoFrame}>
          <CachedImage source={photo} contentFit="cover" style={s.photo} transition={0} />
          <View style={s.sticker}>
            <CachedImage source={sticker} contentFit="fill" style={{ position: "absolute", width: 92, height: (92 * 1103) / 516, left: -8, top: -6 }} transition={0} />
          </View>
          {newRecord && <View style={s.recBadge}><Text style={s.recText}>YENİ REKOR</Text></View>}
          {lakap ? (
            <View style={s.lakapStamp} testID="share-lakap">
              <Text style={s.lakapSmall}>LAKAP</Text>
              <Text style={s.lakapText} numberOfLines={1} adjustsFontSizeToFit>{lakap}</Text>
            </View>
          ) : null}
        </View>
        <Text style={s.greeting} numberOfLines={1} adjustsFontSizeToFit>İstanbul'dan selamlar</Text>
        <View style={s.scoreRow}>
          <Text style={s.score}>{score}</Text>
          <Text style={s.scoreUnit}>puan</Text>
        </View>
        <Text style={s.hand} numberOfLines={1} adjustsFontSizeToFit>
          {place ? `📍 ${place}` : "📍 Daha ilk durağın yolundayım"}
        </Text>
        <View style={s.postmark}>
          <Text style={s.postmarkText} numberOfLines={1} adjustsFontSizeToFit>{stamp} · {time}</Text>
        </View>
        <View style={s.footer}>
          <Text style={s.brand}>BYZANTION</Text>
          <Text style={s.tag}>Amcayla İstanbul çatılarında · Sen de dene!</Text>
        </View>
      </View>
      {note && <Text style={s.note}>{note}</Text>}
      <View style={s.btnRow}>
        <Pressable onPress={onClose} hitSlop={8} style={({ pressed }) => [s.ghostBtn, pressed && { opacity: 0.7 }]} testID="share-cancel">
          <Text style={s.ghostText}>Vazgeç</Text>
        </Pressable>
        <Pressable onPress={send} disabled={busy} style={({ pressed }) => [s.sendBtn, (pressed || busy) && { opacity: 0.75 }]} testID="share-send">
          <Text style={s.sendText}>{busy ? "Hazırlanıyor…" : "Gönder"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const CARD_W = 330;
const s = StyleSheet.create({
  backdrop: { position: "absolute", left: 0, top: 0, right: 0, bottom: 0, backgroundColor: "rgba(20,14,10,0.72)", alignItems: "center", justifyContent: "center", zIndex: 50 },
  card: { width: CARD_W, backgroundColor: "#fbf3e2", borderRadius: 8, overflow: "hidden", paddingBottom: 12 },
  airmail: { flexDirection: "row", height: 10, overflow: "hidden" },
  stripe: { width: 26, height: 10, transform: [{ skewX: "-35deg" }], marginRight: -4 },
  photoFrame: { marginHorizontal: 14, marginTop: 12, height: 190, borderWidth: 5, borderColor: "#fff", backgroundColor: "#fff", borderRadius: 2 },
  photo: { width: "100%", height: "100%" },
  sticker: { position: "absolute", left: -8, bottom: -22, width: 76, height: 76, borderRadius: 38, overflow: "hidden", borderWidth: 3, borderColor: "#fff", backgroundColor: "#f3d9b0", transform: [{ rotate: "-8deg" }] },
  recBadge: { position: "absolute", right: 8, top: 8, backgroundColor: "#c0472b", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, transform: [{ rotate: "4deg" }] },
  lakapStamp: { position: "absolute", right: 6, bottom: 8, maxWidth: 190, paddingHorizontal: 9, paddingVertical: 3, borderWidth: 2.5, borderColor: "rgba(168,40,30,0.88)", borderRadius: 6, backgroundColor: "rgba(255,248,236,0.82)", alignItems: "center", transform: [{ rotate: "-7deg" }] },
  lakapSmall: { color: "rgba(168,40,30,0.88)", fontWeight: "900", fontSize: 9, letterSpacing: 2 },
  lakapText: { fontFamily: HAND, color: "rgba(150,32,24,0.95)", fontSize: 18 },
  recText: { color: "#fff", fontWeight: "900", fontSize: 12, letterSpacing: 1 },
  greeting: { fontFamily: SCRIPT, fontSize: 24, color: "#1f4e79", marginTop: 22, marginLeft: 80, marginRight: 16 },
  scoreRow: { flexDirection: "row", alignItems: "baseline", justifyContent: "center", marginTop: 2 },
  score: { fontFamily: TYPE, fontSize: 64, color: "#2a1b12", lineHeight: 72 },
  scoreUnit: { fontFamily: TYPE, fontSize: 20, color: "#6e4632", marginLeft: 6 },
  hand: { fontFamily: HAND, fontSize: 19, color: "#1f4e79", textAlign: "center", marginHorizontal: 16 },
  postmark: { alignSelf: "center", marginTop: 10, paddingHorizontal: 12, paddingVertical: 4, borderWidth: 2, borderColor: "#b9573f", borderRadius: 14, transform: [{ rotate: "-3deg" }], maxWidth: CARD_W - 40 },
  postmarkText: { color: "#b9573f", fontWeight: "800", fontSize: 13, letterSpacing: 0.5 },
  footer: { marginTop: 14, alignItems: "center", borderTopWidth: 2, borderStyle: "dashed", borderColor: "#e0c7a3", marginHorizontal: 14, paddingTop: 8 },
  brand: { fontWeight: "900", fontSize: 20, letterSpacing: 4, color: "#c0472b" },
  tag: { fontSize: 12, fontWeight: "700", color: "#6e4632", marginTop: 1 },
  note: { color: "#fff", marginTop: 10, fontWeight: "700" },
  btnRow: { flexDirection: "row", gap: 14, marginTop: 18, alignItems: "center" },
  ghostBtn: { paddingHorizontal: 18, paddingVertical: 12 },
  ghostText: { color: "#fbf3e2", fontWeight: "800", fontSize: 17 },
  sendBtn: { backgroundColor: "#c0472b", paddingHorizontal: 34, paddingVertical: 13, borderRadius: 26 },
  sendText: { color: "#fff", fontWeight: "900", fontSize: 18 },
});
