#!/usr/bin/env python3
"""Cephe kilimlerine farklı desen ve renk (2026-11-24, kullanıcı: "halı desenini değiştirelim").

Kıvılcım'ın 6 düz kilim motifi (shared/KILIM-DESEN-preview/kilim-desen-N.png) hepsi kırmızı zeminli geldi;
renk çeşidi kodla verilir (kırmızı tonlar başka zemine döndürülür). Desen, atlastaki kilim bölgesine kilimin
kendi kıvrım/gölge ışığı (çok bulanık parlaklık) ile çarpılarak oturtulur; saçak ve sırık korunur.
5 hava atlası (*-24.jpg) piksel hizalı -> aynı bölge, aynı desen hepsine.

Kullanım: python3 -I scripts/cephe-kilim.py <desen_klasoru>
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as nd

G = "assets/environment/district/house/g018/"
HALLER = ["", "-kar", "-yagmur", "-kis", "-sonbahar"]
CELL = 350
# (desen no 1..6 ya da 0 = özgün kilim kalsın, zemin tonu derece ya da None = kırmızı kalsın, doygunluk çarpanı)
PALET = [(0, None, 1.0), (1, 222, 0.9), (2, 42, 1.0), (3, 165, 0.85), (4, 30, 0.35), (5, 345, 1.0), (6, None, 1.0)]


def hsv(a):
    im = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)).convert("HSV")
    x = np.asarray(im).astype(float)
    return x[..., 0] * 360 / 255, x[..., 1] / 255, x[..., 2] / 255


def kilim_maskesi(cell):
    h, s, v = hsv(cell)
    red = ((h < 25) | (h > 335)) & (s > 0.55) & (v > 0.25) & (v < 0.95)
    dens = nd.gaussian_filter(red.astype(float), 6) > 0.35
    lab, n = nd.label(dens)
    out = []
    for i, sl in enumerate(nd.find_objects(lab)):
        m = lab == i + 1
        if m.sum() < 2500:
            continue
        m = nd.binary_fill_holes(nd.binary_closing(m, np.ones((9, 9))))
        m = nd.binary_erosion(m, np.ones((5, 5)))  # kenar/saçak dışarıda kalsın
        out.append(m)
    return out


def renklendir(pat, hue, sk):
    if hue is None:
        return pat
    im = Image.fromarray((pat * 255).astype(np.uint8)).convert("HSV")
    a = np.asarray(im).astype(float)
    h = a[..., 0] * 360 / 255
    red = ((h < 30) | (h > 330)) & (a[..., 1] > 60)
    a2 = a.copy()
    a2[..., 0] = np.where(red, hue / 360 * 255, a[..., 0])
    a2[..., 1] = np.where(red, np.clip(a[..., 1] * sk, 0, 255), a[..., 1])
    return np.asarray(Image.fromarray(a2.astype(np.uint8), "HSV").convert("RGB")).astype(float) / 255


def main():
    klasor = sys.argv[1]
    desen = [None] + [np.asarray(Image.open(f"{klasor}/kilim-desen-{i}.png").convert("RGB")).astype(float) / 255 for i in range(1, 7)]
    base = np.asarray(Image.open(G + "facade-atlas-g018-24.jpg").convert("RGB")).astype(float) / 255
    ncell = base.shape[1] // CELL
    isler = []  # (hucre, maske, desen, ton, doygunluk)
    sayac = 0
    for c in range(ncell):
        cell = base[:, c * CELL:(c + 1) * CELL]
        ms = kilim_maskesi(cell)
        if not ms:
            continue
        no, hue, sk = PALET[(c * 3 + 1) % len(PALET)] if c >= 12 else PALET[c % len(PALET)]
        for m in ms:
            isler.append((c, m, no, hue, sk))
        sayac += len(ms)
    print("kilim bolgesi", sayac, "hucre", sorted(set(i[0] for i in isler)))
    for hal in HALLER:
        path = G + f"facade-atlas-g018{hal}-24.jpg"
        atlas = np.asarray(Image.open(path).convert("RGB")).astype(float) / 255
        for c, m, no, hue, sk in isler:
            if no == 0 and hue is None:
                continue
            x0 = c * CELL
            cell = atlas[:, x0:x0 + CELL]
            ys, xs = np.nonzero(m)
            y0, y1, xa, xb = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
            if no == 0:
                src = base[:, x0:x0 + CELL][y0:y1, xa:xb]
                pat = renklendir(src, hue, sk)
                shade = np.ones(pat.shape[:2])
            else:
                pat = np.asarray(Image.fromarray((renklendir(desen[no], hue, sk) * 255).astype(np.uint8)).resize((xb - xa, y1 - y0), Image.LANCZOS)).astype(float) / 255
                lum = cell[y0:y1, xa:xb].mean(-1)
                bl = nd.gaussian_filter(lum, 7)
                shade = np.clip(bl / max(1e-3, np.median(bl[m[y0:y1, xa:xb]])), 0.45, 1.25)
            new = np.clip(pat * shade[..., None], 0, 1)
            a = nd.gaussian_filter(m[y0:y1, xa:xb].astype(float), 1.2)[..., None]
            # kar/yağmur atlasında kilimin üstündeki kar ve damlalar korunsun: çok açık pikseller değişmez
            lum_c = cell[y0:y1, xa:xb].mean(-1)
            a = a * np.clip((0.86 - lum_c) / 0.1, 0, 1)[..., None] if hal == "-kar" else a
            cell[y0:y1, xa:xb] = cell[y0:y1, xa:xb] * (1 - a) + new * a
            atlas[:, x0:x0 + CELL] = cell
        Image.fromarray((np.clip(atlas, 0, 1) * 255).astype(np.uint8)).save(path, quality=90, subsampling=0)
        print("yazildi", hal or "yaz")


if __name__ == "__main__":
    main()
