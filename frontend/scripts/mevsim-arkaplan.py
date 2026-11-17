# MEVSİM ARKA PLANLARI (2026-11-17, kullanıcı: "arka planlar eskisi gibi duruyor, sadece kolonlarda mevsimsel
# hareket yapıyoruz; tutarlılığa aykırı"). Onaylı arka plan görsellerinden renk işlemiyle türetilir
# (yeni çizim yok): kar (çatılar ve üst yüzler beyaz, ağaçlar karlı, gök/deniz gri), sonbahar (yeşiller
# sarı-turuncu), kış (yeşiller solgun, genel soğuk/soluk). Kullanım: python3 scripts/mevsim-arkaplan.py
import numpy as np
from PIL import Image, ImageFilter
SRC = ["assets/environment/bosphorus-rooftop-day-master-v1.png", "assets/environment/bosphorus-low-silhouette.jpg"]
NAMES = ["master", "alt"]

def hsv(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx = a.max(-1); mn = a.min(-1); d = mx - mn + 1e-6
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    s = np.where(mx > 0, (mx - mn) / (mx + 1e-6), 0)
    return h, s, mx

def lerp(a, b, t):
    return a + (b - a) * t[..., None]

for src, name in zip(SRC, NAMES):
    im = Image.open(src).convert("RGB")
    a = np.asarray(im).astype(np.float32) / 255.0
    h, s, v = hsv(a)
    H = a.shape[0]
    roof = ((h < 28) | (h > 345)) & (s > 0.4) & (v > 0.3)          # kiremit / sıcak çatı
    green = (h > 50) & (h < 175) & (s > 0.12) & (v > 0.06)            # ağaç / yeşillik
    blue = (h > 185) & (h < 250) & (s > 0.25)                          # gök + deniz
    # "üst yüz" yaklaşımı: bir pikselin üstü kendisinden belirgin açık değilse yüzey kar tutar
    lum = a.mean(-1)
    up = np.roll(lum, 3, axis=0)
    topface = (lum >= up - 0.02).astype(np.float32)
    topface = np.asarray(Image.fromarray((topface * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))) / 255.0

    # KAR
    k = a.copy()
    snow = np.array([0.96, 0.97, 1.0], np.float32)
    tr = roof * (0.55 + 0.35 * topface)
    k = lerp(k, np.broadcast_to(snow, k.shape), tr.astype(np.float32))
    tg = green * (0.45 + 0.25 * topface)
    k = lerp(k, np.broadcast_to(np.array([0.9, 0.93, 0.95], np.float32), k.shape), tg.astype(np.float32))
    gray = k.mean(-1, keepdims=True)
    k = k * 0.78 + gray * 0.22                                          # genel soğuk/gri hava
    k = lerp(k, np.broadcast_to(np.array([0.72, 0.78, 0.86], np.float32), k.shape), (blue * 0.25).astype(np.float32))
    Image.fromarray((np.clip(k, 0, 1) * 255).astype(np.uint8)).save(f"assets/environment/mevsim/{name}-kar.jpg", quality=88)

    # SONBAHAR: yeşiller sarı-turuncu-kızıl karışımına
    f = a.copy()
    rnd = np.asarray(Image.fromarray((np.random.default_rng(7).random(a.shape[:2]) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))) / 255.0
    autumn = np.stack([0.80 + 0.15 * rnd, 0.42 + 0.25 * rnd, 0.12 + 0.05 * rnd], -1).astype(np.float32)
    shade = (v / 0.75).clip(0.35, 1.15)[..., None]
    f = lerp(f, np.clip(autumn * shade, 0, 1), (green * 0.85).astype(np.float32))
    Image.fromarray((np.clip(f, 0, 1) * 255).astype(np.uint8)).save(f"assets/environment/mevsim/{name}-sonbahar.jpg", quality=88)

    # KIŞ (karsız): yeşiller solgun kahve-gri, genel soğuk ve soluk
    w = a.copy()
    bare = np.stack([0.42, 0.38, 0.34], -1).astype(np.float32) * shade
    w = lerp(w, np.clip(bare, 0, 1), (green * 0.6).astype(np.float32))
    g2 = w.mean(-1, keepdims=True)
    w = w * 0.8 + g2 * 0.2
    w = lerp(w, np.broadcast_to(np.array([0.78, 0.84, 0.92], np.float32), w.shape), np.full(a.shape[:2], 0.08, np.float32))
    Image.fromarray((np.clip(w, 0, 1) * 255).astype(np.uint8)).save(f"assets/environment/mevsim/{name}-kis.jpg", quality=88)
print("ok")
