// AMCAYA ÇAY ISMARLA kartı (2026-11-25). Menüden ya da oyun sonu satırından açılır; kendiliğinden açılmaz.
// Görseller (rozet sayfası, çaylı amca) kullanıcı kabulüne kadar bağlanmaz: şimdilik iOS simgeleri.
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";
import * as GameCenter from "../../modules/byzantion-gamecenter/src";
import { CAY_IDLER, CAY_URUNLER, cayKademe } from "./cay";

function Ico({ name, size = 22, color = "#6e4632" }: { name: string; size?: number; color?: string }) {
  return <SymbolView name={name as any} size={size} tintColor={color} type="monochrome" style={{ width: size, height: size }} />;
}

export function CayKart({ styles, owned, onOwned, onClose }: {
  styles: any; owned: string[]; onOwned: (ids: string[]) => void; onClose: () => void;
}) {
  const [fiyat, setFiyat] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [not, setNot] = useState<string>("");
  const [tesekkur, setTesekkur] = useState(false);

  useEffect(() => {
    let live = true;
    GameCenter.storeProducts(CAY_IDLER).then((ps) => {
      if (!live) return;
      const m: Record<string, string> = {};
      ps.forEach((p) => { m[p.id] = p.price; });
      setFiyat(m);
      if (ps.length === 0) setNot("Mağaza şu an açılamadı. Biraz sonra yine dene.");
    });
    return () => { live = false; };
  }, []);

  const al = async (id: string) => {
    if (busy) return;
    setBusy(id); setNot("");
    const r = await GameCenter.storePurchase(id);
    setBusy(null);
    if (r.status === "purchased") {
      onOwned(Array.from(new Set([...owned, id])));
      setTesekkur(true);
    } else if (r.status === "pending") setNot("Onay bekleniyor. Onaylanınca rozetin gelir.");
    else if (r.status === "error") setNot("Şu an olmadı. Biraz sonra yine dene.");
  };

  const geriYukle = async () => {
    if (busy) return;
    setBusy("restore"); setNot("");
    const ids = await GameCenter.storeRestore();
    setBusy(null);
    const benim = ids.filter((i) => CAY_IDLER.includes(i));
    onOwned(benim);
    setNot(benim.length ? "Çayların geri geldi." : "Bu hesapta ısmarlanmış çay bulunamadı.");
  };

  const kademe = cayKademe(owned);
  return (
    <View style={styles.albumOverlay} testID="cay-kart">
      <View style={styles.albumCard}>
        {tesekkur ? (
          <View style={{ alignItems: "center", paddingVertical: 18 }}>
            <Ico name="cup.and.saucer.fill" size={64} color="#b5482c" />
            <Text style={[styles.albumTitle, { marginTop: 12 }]}>Eline sağlık!</Text>
            <Text style={[styles.albumSub, { textAlign: "center" }]}>Amca çayını yudumluyor, keyfi yerinde.{"\n"}Rozetin menüde.</Text>
            <Pressable style={({ pressed }) => [styles.trPlayBtn, { marginTop: 16 }, pressed && styles.playBtnPressed]} onPress={onClose}>
              <Text style={styles.playBtnText}>Afiyet olsun</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={styles.albumTitle}>Amcaya çay ısmarla</Text>
            <Text style={[styles.albumSub, { textAlign: "center" }]}>
              Oyun ücretsiz ve reklamsız. Çay ısmarlarsan geliştiriciye destek olursun, menüde rozetin olur. Oyunu kolaylaştırmaz.
            </Text>
            {CAY_URUNLER.map((u) => {
              const var_ = owned.includes(u.id);
              return (
                <View key={u.id} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8, gap: 10 }}>
                  <View style={[styles.pcIconCircle, styles.pcIconCircleSm]}><Ico name={u.ikon} size={22} color="#b5482c" /></View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={[styles.albumName, { textAlign: "left", fontSize: 16, marginTop: 0 }]}>{u.ad}</Text>
                    <Text style={[styles.albumSub, { textAlign: "left", marginBottom: 0 }]}>{u.aciklama}</Text>
                  </View>
                  {var_ ? (
                    <Text style={[styles.albumName, { color: "#2f7d4f" }]}>Ismarlandı ✓</Text>
                  ) : (
                    <Pressable testID={`cay-al-${u.kademe}`} disabled={!fiyat[u.id] || !!busy}
                      style={({ pressed }) => [styles.modeBtn, { width: undefined, marginTop: 0, paddingVertical: 8, paddingHorizontal: 14, minWidth: 92, opacity: fiyat[u.id] ? 1 : 0.5 }, pressed && styles.playBtnPressed]}
                      onPress={() => al(u.id)}>
                      {busy === u.id ? <ActivityIndicator color="#c0472b" /> : <Text style={[styles.modeBtnText, { color: "#c0472b" }]}>{fiyat[u.id] ?? "…"}</Text>}
                    </Pressable>
                  )}
                </View>
              );
            })}
            {!!not && <Text style={[styles.albumSub, { textAlign: "center", marginTop: 6 }]}>{not}</Text>}
            <Pressable onPress={geriYukle} hitSlop={8} testID="cay-geri-yukle" style={{ alignSelf: "center", marginTop: 8 }}>
              {busy === "restore" ? <ActivityIndicator color="#6e4632" /> : <Text style={styles.goLink}>Satın alımları geri yükle</Text>}
            </Pressable>
            <Pressable style={({ pressed }) => [styles.trPlayBtn, { marginTop: 12 }, pressed && styles.playBtnPressed]} onPress={onClose}>
              <Text style={styles.playBtnText}>{kademe > 0 ? "Kapat" : "Belki sonra"}</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}
