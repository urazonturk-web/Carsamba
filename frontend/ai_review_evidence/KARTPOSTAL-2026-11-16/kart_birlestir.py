# Kartpostal önizleme birleştirici (oyun içi birleşim kodla yapılacak; bu yalnız onay önizlemesi).
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageFilter
import numpy as np, sys
P="/Users/bekirurazonturk/Documents/Codex/2026-09-09/referenced-chatgpt-conversation-this-is-an/shared/KARTPOSTAL-preview/"
E="/Users/bekirurazonturk/Documents/GitHub/Carsamba/frontend/ai_review_evidence/KARTPOSTAL-2026-11-16/"
def crop(im):
    a=np.array(im)[:,:,3]>8; ys,xs=np.where(a); return im.crop((xs.min(),ys.min(),xs.max()+1,ys.max()+1))
def card(scene,pose,side,frac,name,sub,out,mirror=False,dx=0,dy=30):
    S=Image.open(P+scene).convert("RGBA"); W,H=S.size
    u=crop(Image.open(P+pose).convert("RGBA")); u=ImageOps.mirror(u) if mirror else u
    uh=int(H*frac); uw=int(u.width*uh/u.height); u=u.resize((uw,uh),Image.LANCZOS)
    x=(W-uw-70 if side=="right" else 70)+dx; yb=H-dy
    sh=Image.new("RGBA",S.size,(0,0,0,0)); ImageDraw.Draw(sh).ellipse((x+uw*0.18,yb-20,x+uw*0.82,yb+14),fill=(30,20,20,105)); S.alpha_composite(sh.filter(ImageFilter.GaussianBlur(10)))
    S.alpha_composite(u,(x,yb-uh))
    F=Image.new("RGBA",(W+90,H+90),(246,238,220,255)); F.alpha_composite(S,(45,45)); d=ImageDraw.Draw(F)
    f=ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia Bold.ttf",64); f2=ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia.ttf",34)
    tx=90 if side=="right" else W-560
    d.rounded_rectangle((tx-20,70,tx+520,200),18,fill=(246,238,220,230)); d.text((tx,78),name,fill=(80,40,30,255),font=f); d.text((tx,152),sub,fill=(110,70,50,255),font=f2)
    F=F.convert("RGB"); F.save(E+out,quality=90); F.resize((F.width//2,F.height//2)).save(E+out.replace(".jpg","-kucuk.jpg"),quality=88)
card("kart-01-harem.png","amca-01-harem.png","left",0.66,"Harem","Haydarpaşa · 16.11.2026","kart-01.jpg")
card("kart-02-uskudar-kizkulesi.png","amca-02-uskudar.png","right",0.70,"Üsküdar","Kız Kulesi · 16.11.2026","kart-02.jpg",dx=30)
card("kart-03-kuzguncuk.png","amca-03-kuzguncuk.png","left",0.56,"Kuzguncuk","16.11.2026","kart-03.jpg",dx=40,dy=60)
card("kart-04-beylerbeyi.png","amca-04-beylerbeyi.png","left",0.66,"Beylerbeyi","Boğaziçi Köprüsü · 16.11.2026","kart-04.jpg")
