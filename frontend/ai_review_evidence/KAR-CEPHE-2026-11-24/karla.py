import sys, numpy as np
from PIL import Image
from scipy import ndimage as nd

src, out = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert("RGB")).astype(np.float32) / 255.0
H, W, _ = im.shape
CELL = 350

r, g, b = im[..., 0], im[..., 1], im[..., 2]
mx = im.max(-1); mn = im.min(-1)
sat = (mx - mn) / (mx + 1e-4)
# hue in degrees
d = mx - mn + 1e-6
hue = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
lum = 0.299 * r + 0.587 * g + 0.114 * b

# --- wall mask per cell: close to the cell's median plaster colour, low local gradient
wall = np.zeros((H, W), bool)
far = np.zeros((H, W), bool)
for c in range(W // CELL):
    sl = slice(c * CELL, (c + 1) * CELL)
    px = im[:, sl].reshape(-1, 3)
    med = np.median(px, 0)
    cc = im[:, sl] / (im[:, sl].sum(-1, keepdims=True) + 1e-4)
    cm = med / med.sum()
    cd = np.sqrt(((cc - cm) ** 2).sum(-1))
    ratio = im[:, sl].sum(-1) / med.sum()
    mh = np.median(hue[:, sl][~np.isnan(hue[:, sl])])
    hd = np.abs(((hue[:, sl] - mh) + 180) % 360 - 180)
    ms = np.median(sat[:, sl])
    far[:, sl] = (hd > 22) | (sat[:, sl] > ms + 0.28)
    wall[:, sl] = (((cd < 0.035) & (ratio > 0.45)) | ((hd < 14) & (sat[:, sl] > ms - 0.12) & (sat[:, sl] < ms + 0.35) & (ratio > 0.3))) & (ratio < 1.15)
gy = np.abs(nd.sobel(nd.gaussian_filter(lum,1), 0)); gx = np.abs(nd.sobel(nd.gaussian_filter(lum,1), 1))
wall &= (gx + gy) < 0.35
wall = nd.binary_opening(wall, np.ones((3, 3)))

glass = (hue > 185) & (hue < 235) & (sat > 0.25) & (lum > 0.35)
green = (hue > 50) & (hue < 170) & (sat > 0.22) & far
# shutters / bay windows: green areas that survive a big opening are paint, not leaves
paint = green & ~((hue > 50) & (hue < 125) & (sat > 0.45))
leaves = green & ~paint
leaves = nd.binary_opening(leaves, np.ones((2, 2)))
flowers = ((hue < 25) | (hue > 300)) & (sat > 0.35) & (lum > 0.35)
redish = ((hue < 25) | (hue > 330)) & (sat > 0.55) & (lum < 0.6)
bigred = nd.gaussian_filter(redish.astype(np.float32), 7) > 0.35
lab, n = nd.label(bigred)
sizes = nd.sum(bigred, lab, range(1, n + 1))
bigred = np.isin(lab, 1 + np.nonzero(sizes > 2500)[0])
bigred = nd.binary_dilation(bigred, np.ones((9, 9)))
flowers &= ~bigred
flowers &= far & ~nd.binary_dilation(wall, np.ones((3,3)))
flowers = nd.binary_opening(flowers, np.ones((2,2)))
plants = (leaves | flowers) & ~wall
plants_soft = nd.gaussian_filter(nd.binary_dilation(plants, np.ones((3, 3))).astype(np.float32), 1.0)

outim = im.copy()
# winter plants: dry, grey-brown
grey = lum[..., None] * np.array([1.0, 0.93, 0.85]) * 0.92
outim = outim * (1 - plants_soft[..., None] * 0.8) + grey * (plants_soft[..., None] * 0.8)

# --- snow: top surfaces = non-wall/non-glass pixels with open air (wall/glass) right above
glass2 = (hue > 180) & (hue < 245) & (sat > 0.12) & far & ~wall
win = nd.binary_closing(glass2, np.ones((21, 21)))
win = nd.binary_fill_holes(win)
win |= nd.binary_dilation(glass2, np.ones((9, 9)))
open_air = wall
solid = ~open_air
above_open = np.zeros_like(solid)
above_open[3:] = open_air[:-3] & open_air[1:-2]
top = solid & above_open & ~win
# keep only roughly horizontal runs (>= 7 px)
run = nd.binary_opening(top, np.ones((1, 11)))
# mound-shaped caps along each horizontal run
rng = np.random.default_rng(7)
snow = np.zeros((H, W), np.float32)
lab, n = nd.label(run, np.array([[0,0,0],[1,1,1],[0,0,0]]))
for sl_ in nd.find_objects(lab):
    y = sl_[0].start; x0, x1 = sl_[1].start, sl_[1].stop
    L = x1 - x0
    tmax = min(13, 4 + L * 0.18) * (0.8 + 0.4 * rng.random())
    xs_ = np.arange(L); u = (xs_ + 0.5) / L * 2 - 1
    prof = tmax * np.sqrt(np.clip(1 - u ** 6, 0, 1))
    prof += nd.gaussian_filter1d(rng.standard_normal(L), 3) * 1.2
    for i, t in enumerate(prof):
        t = int(round(max(2, t)))
        snow[max(0, y - t):y + 2, x0 + i] = 1.0
# plants: heavy snow on tops, frost inside
pl = nd.binary_closing(plants, np.ones((5, 5)))
ptop = pl & ~np.roll(pl, 3, 0) & ~win
cap = nd.binary_dilation(ptop, np.ones((7, 3)))
cap = cap & ~np.roll(cap & False, 0, 0)
blob = nd.gaussian_filter(rng.random((H, W)).astype(np.float32), 2) > 0.5
snow = np.maximum(snow, (cap & (blob | ptop)).astype(np.float32))
frost = nd.gaussian_filter(pl.astype(np.float32), 1.5) * 0.35
snow = nd.gaussian_filter(snow, 1.6)
snow = np.clip((snow - 0.35) * 3.0, 0, 1)
snow = np.maximum(snow, frost)
# soft shade under the snow lip
shade = np.clip(nd.shift(snow, (3, 0), order=0) - snow, 0, 1) * 0.25
white = np.array([0.97, 0.98, 1.0])
outim = outim * (1 - shade[..., None])
outim = outim * (1 - snow[..., None]) + white * snow[..., None]
# cold overall tint, slight
outim = outim * 0.93 + np.array([0.80, 0.85, 0.95]) * lum[..., None] * 0.07 / 0.6

Image.fromarray((np.clip(outim, 0, 1) * 255).astype(np.uint8)).save(out, quality=92)
if len(sys.argv) > 3:
    dbg = np.zeros((H, W, 3), np.uint8)
    dbg[wall] = (80, 80, 80); dbg[bigred] = (120,0,0); dbg[paint]=(0,90,0); dbg[glass] = (40, 80, 200); dbg[leaves] = (0, 200, 0); dbg[flowers] = (255, 0, 200); dbg[run] = (255, 255, 255)
    Image.fromarray(dbg).save(sys.argv[3])
