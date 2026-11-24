#!/usr/bin/env python3
"""Karlı cephe atlası: Kıvılcım'ın hücre başına kış çizimlerini orijinal atlasa oturtur.

Her hücre çizimi (shared/KAR-CEPHE-preview/hucre-XX-kis.png) hücrenin tekrar boyuna
(350×1035, hücre 0'da 350×1340) küçültülür, ±6 px içinde kenar eşleşmesiyle kaydırılır,
yalnız orijinalden belirgin farklı bölgeler (bitki, kar) yumuşak maskeyle aktarılır;
gerisi orijinal piksel kalır. Ardından 1035 tekrarı yeniden kurulur.

Kullanım: python3 -I scripts/kar-cephe-birlestir.py <hucre_klasoru> <cikti.jpg> [rapor.txt]
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as nd

KAYNAK = "assets/environment/district/house/g018/facade-atlas-g018.jpg"
CELL = 350
PERIOD = [1340] + [1035] * 11


def hizala_ve_aktar(o, g, dikis_koru=0):
    lo, lg = o.mean(-1), g.mean(-1)
    eo = np.hypot(nd.sobel(lo, 0), nd.sobel(lo, 1))
    eg = np.hypot(nd.sobel(lg, 0), nd.sobel(lg, 1))
    best = None
    for dy in range(-6, 7):
        for dx in range(-6, 7):
            c = (eo[12:-12, 12:-12] * np.roll(np.roll(eg, dy, 0), dx, 1)[12:-12, 12:-12]).sum()
            if best is None or c > best[0]:
                best = (c, dy, dx)
    _, dy, dx = best
    g = np.roll(np.roll(g, dy, 0), dx, 1)
    d = np.abs(g - o).max(-1)
    m = nd.gaussian_filter(d, 2) > 0.18
    m = nd.binary_opening(m, np.ones((3, 3)))
    lab, k = nd.label(m)
    if k:
        sz = nd.sum(m, lab, range(1, k + 1))
        m = np.isin(lab, 1 + np.nonzero(sz > 60)[0])
    m = nd.binary_dilation(m, np.ones((7, 7)))
    a = nd.gaussian_filter(m.astype(float), 2.5)[..., None]
    # sınır şeridinde (kenarlardan 4 px) orijinali koru: hücre/dikiş temiz kalsın
    a[:, :4] = a[:, -4:] = 0
    if dikis_koru:  # üst/alt kenar kendi kendine bağlanır: orijinale yumuşak dönüş
        r = np.clip(np.minimum(np.arange(len(a)), np.arange(len(a))[::-1]) / dikis_koru, 0, 1)
        a = a * r[:, None, None]
    return o * (1 - a) + g * a, (dy, dx), float(m.mean())


def main():
    klasor, cikti = sys.argv[1], sys.argv[2]
    src = np.asarray(Image.open(KAYNAK).convert("RGB")).astype(float) / 255
    out = src.copy()
    rapor = []
    for c in range(12):
        x0 = c * CELL
        per = PERIOD[c]
        try:
            gi = Image.open(f"{klasor}/hucre-{c:02d}-kis.png").convert("RGB")
        except FileNotFoundError:
            rapor.append(f"hucre {c:02d}: CIZIM YOK, orijinal kaldi")
            continue
        ga = np.asarray(gi)
        dolu = ga.min(-1) < 235  # beyaz kenar payını kırp
        xs, ys = np.nonzero(dolu.any(0))[0], np.nonzero(dolu.any(1))[0]
        gi = gi.crop((int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1))
        g = np.asarray(gi.resize((CELL, per), Image.LANCZOS)).astype(float) / 255
        o = src[:per, x0:x0 + CELL]
        yeni, kay, oran = hizala_ve_aktar(o, g, 30 if per == src.shape[0] else 0)
        col = src[:, x0:x0 + CELL].copy()
        col[:per] = yeni
        if per < col.shape[0]:
            col[per:] = yeni[: col.shape[0] - per]
        out[:, x0:x0 + CELL] = col
        dikis = np.abs(col[per - 1] - col[per % col.shape[0]]).mean() * 255 if per < col.shape[0] else np.abs(col[-1] - col[0]).mean() * 255
        rapor.append(f"hucre {c:02d}: cizim {gi.size[0]}x{gi.size[1]}, kayma dy,dx={kay}, aktarilan alan %{oran*100:.0f}, dikis farki {dikis:.1f}")
    Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8)).save(cikti, quality=92, subsampling=0)
    txt = "\n".join(rapor)
    print(txt)
    if len(sys.argv) > 3:
        open(sys.argv[3], "w").write(txt + "\n")


if __name__ == "__main__":
    main()
