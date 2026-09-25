from PIL import Image, ImageDraw, ImageFilter
import numpy as np, json, math, random

BASE="/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend/assets/environment"
OUT="/tmp/g011roof"

OUTLINE = (13,7,5,255)
TERRA_LIGHT = (206,128,86,255)
TERRA_MID = (178,104,68,255)
TERRA_DARK = (140,78,50,255)
EAVE = (222,196,152,255)
EAVE_SHADE = (188,160,118,255)
WALL = (223,196,140,255)   # small plastered house-wall hint colour (matches bg houses)

VARIANTS = [
    dict(name="column-wide-v1", shaftWidthPx=525, seed=1, roofRatio=0.40, scallops=9, tilt=-3),
    dict(name="column-tall-v1", shaftWidthPx=376, seed=2, roofRatio=0.46, scallops=7, tilt=4),
    dict(name="column-medium-v1", shaftWidthPx=401, seed=3, roofRatio=0.43, scallops=8, tilt=0),
]

def rounded_blob(draw, box, rnd, jitter, n=16, fill=None, outline=None, width=1):
    x0,y0,x1,y1 = box
    cx, cy = (x0+x1)/2, (y0+y1)/2
    rx, ry = (x1-x0)/2, (y1-y0)/2
    pts=[]
    for i in range(n):
        a = 2*math.pi*i/n
        jr = 1 + rnd.uniform(-jitter, jitter)
        pts.append((cx+math.cos(a)*rx*jr, cy+math.sin(a)*ry*jr))
    draw.polygon(pts, fill=fill, outline=outline, width=width)
    return pts

def build(variant):
    name = variant["name"]
    shaftW = variant["shaftWidthPx"]
    rnd = random.Random(variant["seed"])

    cutout = Image.open(f"{BASE}/{name}.png").convert("RGBA")
    cw, ch = cutout.size
    chimCropH = int(ch*0.40)
    chimCrop = cutout.crop((0,0,cw,chimCropH))

    roofW = int(round(shaftW*2.3))
    roofH = int(round(roofW*variant["roofRatio"]))
    roofTopY = int(chimCropH*0.58)

    finalW = max(cw, roofW) + 20
    finalH = roofTopY + roofH + 12
    finalH = max(finalH, chimCropH)

    canvas = Image.new("RGBA", (finalW, finalH), (0,0,0,0))

    # ---- roof island (own layer, drawn with soft antialiasing via 3x supersample) ----
    SS = 3
    roof = Image.new("RGBA", (roofW*SS, roofH*SS), (0,0,0,0))
    d = ImageDraw.Draw(roof)
    pad = 6*SS
    box = (pad, int(roofH*SS*0.18), roofW*SS-pad, roofH*SS-pad*1.2)
    # base roof mass (irregular soft blob = adjoining rooftop chunk)
    rounded_blob(d, box, rnd, 0.06, n=20, fill=TERRA_MID, outline=OUTLINE, width=int(2.4*SS))
    # shaded lower band (ground-shadow under eave)
    bx0,by0,bx1,by1 = box
    d.ellipse((bx0+8*SS,by1-int((by1-by0)*0.30),bx1-8*SS,by1+6*SS), fill=TERRA_DARK)
    # tile scallop row near the top ridge
    n_sc = variant["scallops"]
    ridge_y = by0 + (by1-by0)*0.22
    scw = (bx1-bx0)/n_sc
    for i in range(n_sc):
        scx = bx0 + scw*(i+0.5)
        r = scw*0.62
        d.pieslice((scx-r, ridge_y-r*0.55, scx+r, ridge_y+r*1.15), 0, 180, fill=TERRA_LIGHT, outline=OUTLINE, width=int(1.6*SS))
    # front eave / fascia lip along the bottom front edge
    eave_y0 = by1 - (by1-by0)*0.10
    eave_pts = [(bx0+10*SS, eave_y0), (bx1-10*SS, eave_y0), (bx1-2*SS, eave_y0+10*SS), (bx0+2*SS, eave_y0+10*SS)]
    d.polygon(eave_pts, fill=EAVE, outline=OUTLINE, width=int(2*SS))
    d.line([(bx0+10*SS, eave_y0+2*SS), (bx1-10*SS, eave_y0+2*SS)], fill=EAVE_SHADE, width=int(1.4*SS))
    # small plastered wall sliver hint below eave, gives it a "house" read
    wy0 = eave_y0+9*SS
    d.rectangle((bx0+18*SS, wy0, bx1-18*SS, roofH*SS-2*SS), fill=WALL, outline=OUTLINE, width=int(2*SS))

    roof = roof.resize((roofW, roofH), Image.LANCZOS)
    roof = roof.rotate(variant["tilt"], resample=Image.BICUBIC, expand=False)

    roofX = (finalW-roofW)//2
    canvas.alpha_composite(roof, (roofX, roofTopY))

    chimX = (finalW-cw)//2
    canvas.alpha_composite(chimCrop, (chimX, 0))

    canvas.save(f"{OUT}/{name}-island.png")
    return dict(w=finalW, h=finalH, capTopPx=2, shaftWidthPx=shaftW, roofTopY=roofTopY, roofW=roofW, roofH=roofH, chimX=chimX)

results={}
for v in VARIANTS:
    results[v["name"]] = build(v)
    print(v["name"], results[v["name"]])
json.dump(results, open(f"{OUT}/roof-island-measured.json","w"), indent=1)
