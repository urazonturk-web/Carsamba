#!/usr/bin/env python3
"""Cephe çeşitliliği (2026-11-24, kullanıcı: "12 cepheye biraz daha varyasyon ekleyelim ... yerlerini değiştirelim"
-> "1+2+3"). Çizim yok; 5 hava atlası piksel hizalı olduğu için AYNI işlem hepsine uygulanır.

1) Kat karıştırma: her hücre, sakin duvar sıralarında (FACADE_STARTS) 4 kata bölünür. Aynı sıva rengindeki 3 hücrenin
   katları farklı sırayla dizilip yeni hücreler kurulur (her renk için 3 yeni -> +12 hücre). Birleşim yerleri sakin
   sıva olduğu için 10 px yumuşak geçiş yeterli. Tekrar boyu = 4 katın toplamı (<= 1340).
2) Panjur rengi: yeni hücrelerde yeşil boya (panjur, cumba) çivit mavisi / ceviz / bordoya çevrilir; maske yaz
   atlasından çıkar, 5 atlasa aynen uygulanır (kar beyazı ve kuru dal etkilenmez: yalnız doygun yeşil döner).
3) Karga tünekleri katlarıyla birlikte taşınır.
Çıktı: 24 hücrelik 5 atlas (8400×1340) + src/game/cepheCesit.ts (dönem, başlangıç, tünek tabloları).

Kullanım: python3 -I scripts/cephe-cesit.py
"""
import json, colorsys
import numpy as np
from PIL import Image
from scipy import ndimage as nd

G = "assets/environment/district/house/g018/"
HALLER = ["", "-kar", "-yagmur", "-kis", "-sonbahar"]
CELL, H = 350, 1340
PERIOD = [1340] + [1035] * 11
STARTS = [
    [0, 393, 725, 1018], [3, 284, 692, 1029], [0, 437, 658, 1031],
    [0, 379, 745, 1021], [228, 515, 649, 890], [0, 384, 769, 1021],
    [0, 377, 730, 1031], [10, 371, 543, 876], [8, 293, 605, 1028],
    [242, 426, 742, 1029], [0, 367, 525, 1029], [0, 392, 659, 1026],
]
TUNEK = [
    [[90, 188], [175, 700], [175, 960], [100, 1252]],
    [[175, 155], [175, 378], [175, 585], [175, 770], [175, 963], [175, 1190]],
    [[90, 198], [175, 340], [95, 688], [90, 1235]],
    [[175, 212], [175, 498], [175, 710], [175, 1250]],
    [[175, 147], [175, 362], [175, 570], [175, 780], [175, 972], [175, 1180]],
    [[150, 200], [175, 325], [175, 728], [262, 905]],
    [[100, 210], [175, 487], [175, 700], [100, 1250]],
    [[175, 168], [175, 447], [175, 695], [175, 950], [175, 1200]],
    [[85, 190], [175, 518], [175, 965], [85, 1218]],
    [[110, 215], [175, 488], [175, 710], [245, 985], [110, 1245]],
    [[170, 172], [170, 447], [170, 690], [170, 940], [170, 1205]],
    [[75, 155], [175, 310], [175, 748], [175, 998], [75, 1188]],
]
# Panjur renkleri (ton derece, doygunluk çarpanı, parlaklık çarpanı)
RENKLER = [(212, 1.05, 0.95), (24, 0.75, 0.85), (350, 0.95, 0.85)]


def kesimler(base, c):
    """Gerçek boş sıva bantlarının ortası (FACADE_STARTS bu atlasta pencere ortasından geçiyor; kullanılmaz)."""
    P = PERIOD[c]
    full = base[:P, c * CELL:(c + 1) * CELL]
    med = np.median(np.concatenate([full[:, 3:30], full[:, 320:347]], 1).reshape(-1, 3), 0)
    frac = (np.sqrt(((full[:, 40:310] - med) ** 2).sum(-1)) < 0.16).mean(1)
    pts = []
    for th in (0.85, 0.6):
        lab, n = nd.label(frac > th)
        pts = [int((s[0].start + s[0].stop) // 2) for s in nd.find_objects(lab) if s[0].stop - s[0].start >= 3]
        if len(pts) >= 3:
            break
    pts = sorted(set(p % P for p in pts))
    temiz = []
    for p in pts:
        if not temiz or p - temiz[-1] > 60:
            temiz.append(p)
    if len(temiz) > 1 and temiz[0] + P - temiz[-1] < 60:
        temiz.pop()
    return temiz


def katlar(base, c):
    k = kesimler(base, c)
    P = PERIOD[c]
    return [(c, k[i], k[i + 1] if i + 1 < len(k) else k[0] + P) for i in range(len(k))]


def kat_pikselleri(atlas, c, a, b):
    ys = [(y % PERIOD[c]) for y in range(a, b)]
    return atlas[ys, c * CELL:(c + 1) * CELL]


def yeni_hucre_plani(base):
    plan = []
    for g in range(4):
        cs = [3 * g, 3 * g + 1, 3 * g + 2]
        K = [katlar(base, c) for c in cs]
        for r in range(3):
            sec, tot, i = [], 0, 0
            src = [(r + 1) % 3, (r + 2) % 3, r]
            idx = [r % max(1, len(K[j])) for j in range(3)]
            while tot < 950 and i < 12:
                j = src[i % 3]
                kat = K[j][idx[j] % len(K[j])]
                idx[j] += 1
                i += 1
                h = kat[2] - kat[1]
                if tot + h > 1340 or h > 560:
                    continue
                sec.append(kat)
                tot += h
            plan.append(sec)
    return plan


def kur(atlas, plan):
    yeni = []
    for sec in plan:
        parcalar = [kat_pikselleri(atlas, c, a, b) for c, a, b in sec]
        col = np.concatenate(parcalar, 0)
        P = col.shape[0]
        # birleşim yerlerinde (sakin sıva) dikey yumuşatma, 12 px pencere
        bl = nd.gaussian_filter1d(np.concatenate([col[-12:], col, col[:12]], 0), 3, axis=0)[12:-12]
        y0 = 0
        for k in range(len(parcalar)):
            y0 += parcalar[k].shape[0]
            for d in range(-6, 6):
                yy = (y0 + d) % P
                col[yy] = bl[yy]
        full = np.concatenate([col] * (H // P + 1), 0)[:H]
        yeni.append((full, P))
    return yeni


def yesil_maske(col):
    im = Image.fromarray((np.clip(col, 0, 1) * 255).astype(np.uint8)).convert("HSV")
    a = np.asarray(im).astype(float)
    h, s, v = a[..., 0] * 360 / 255, a[..., 1] / 255, a[..., 2] / 255
    m = (h > 118) & (h < 185) & (s > 0.18) & (v > 0.12)
    lab, n = nd.label(nd.binary_closing(m, np.ones((3, 3))))
    if n:
        sz = nd.sum(m, lab, range(1, n + 1))
        m = np.isin(lab, 1 + np.nonzero(sz > 350)[0])
    return nd.gaussian_filter(m.astype(float), 0.8)


def boya(col, mask, renk):
    hue, sk, vk = renk
    im = Image.fromarray((np.clip(col, 0, 1) * 255).astype(np.uint8)).convert("HSV")
    a = np.asarray(im).astype(float)
    a2 = a.copy()
    a2[..., 0] = hue / 360 * 255
    a2[..., 1] = np.clip(a[..., 1] * sk, 0, 255)
    a2[..., 2] = np.clip(a[..., 2] * vk, 0, 255)
    rgb2 = np.asarray(Image.fromarray(a2.astype(np.uint8), "HSV").convert("RGB")).astype(float) / 255
    # yalnız doygun yeşil döner: kar/dal gibi soluk pikseller korunur
    sat = a[..., 1] / 255
    w = (mask * np.clip((sat - 0.12) / 0.15, 0, 1))[..., None]
    return col * (1 - w) + rgb2 * w


def main():
    base0 = np.asarray(Image.open(G + "facade-atlas-g018.jpg").convert("RGB")).astype(float) / 255
    plan = yeni_hucre_plani(base0)
    for c in range(12):
        print("kesim", c, kesimler(base0, c))
    base = np.asarray(Image.open(G + "facade-atlas-g018.jpg").convert("RGB")).astype(float) / 255
    yeni_base = kur(base, plan)
    maskeler = [yesil_maske(f) for f, _ in yeni_base]
    for hal in HALLER:
        atlas = np.asarray(Image.open(G + f"facade-atlas-g018{hal}.jpg").convert("RGB")).astype(float) / 255
        yeni = kur(atlas, plan)
        cols = [atlas]
        for i, (f, P) in enumerate(yeni):
            cols.append(boya(f, maskeler[i], RENKLER[i % 3]))
        out = np.concatenate(cols, 1)
        Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8)).save(G + f"facade-atlas-g018{hal}-24.jpg", quality=90, subsampling=0)
        print("yazildi", hal or "yaz", out.shape)
    # tablolar
    periods = PERIOD + [P for _, P in yeni_base]
    starts = [list(s) for s in STARTS]
    tunek = [list(t) for t in TUNEK]
    for sec, (_, P) in zip(plan, yeni_base):
        st, tl, off = [], [], 0
        for c, a, b in sec:
            st.append(off)
            pc = PERIOD[c]
            seen = set()
            for x, y in TUNEK[c]:
                yy = y % pc
                for base_y in (yy, yy + pc):
                    if a <= base_y < b and (x, base_y) not in seen:
                        seen.add((x, base_y))
                        ny = off + base_y - a
                        tl.append([x, ny])
                        if ny + P < H:
                            tl.append([x, ny + P])
            off += b - a
        while len(st) < 4:
            st.append(st[-1])
        starts.append(st[:4])
        tunek.append(sorted(tl, key=lambda t: t[1]))
    ts = "// OTOMATİK: scripts/cephe-cesit.py üretti (2026-11-24). Elle düzenleme.\n"
    ts += "// 24 hücre: 0-11 özgün, 12-23 kat karışımı + panjur rengi (mavi, ceviz, bordo sırayla).\n"
    ts += f"export const CEPHE_HUCRE = {len(periods)};\n"
    ts += f"export const CEPHE_DONEM_PX: number[] = {json.dumps(periods)};\n"
    ts += f"export const CEPHE_BASLANGIC_PX: number[][] = {json.dumps(starts)};\n"
    ts += f"export const CEPHE_TUNEK: number[][][] = {json.dumps(tunek)};\n"
    ts += f"export const CEPHE_PLAN = {json.dumps(plan)};\n"
    open("src/game/cepheCesit.ts", "w").write(ts)
    for i, (sec, (_, P)) in enumerate(zip(plan, yeni_base)):
        print(12 + i, "kat", sec, "donem", P)


if __name__ == "__main__":
    main()
