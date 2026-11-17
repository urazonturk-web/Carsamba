from PIL import Image
import numpy as np, json
S='/Users/bekirurazonturk/Documents/Codex/2026-09-09/referenced-chatgpt-conversation-this-is-an/shared/YAGMUR-preview/'
E='ai_review_evidence/YAGMUR-KIYAFET-2026-11-17/'
P=[('000','charge-000-r12.png'),('012','charge-012-r12.png'),('025','charge-025-r12.png'),('037','charge-037-r12.png'),('050','charge-050-r12-ifade.png'),('062','charge-062-r12-ifade.png'),('075','charge-075-r12-ifade.png'),('087','charge-087-r12-ifade.png'),('100','charge-100-r12-ifade.png')]
res={}
for k,o in P:
  O=Image.open('assets/characters/'+o).convert('RGBA'); W,H=O.size; oa=np.array(O)[...,3].astype(float)
  R=Image.open(S+f'yagmur-mont-{k}.png').convert('RGBA')
  best=None
  for sc in np.arange(0.94,1.061,0.01):
    w=int(round(W*sc)); h=int(round(R.height*w/R.width)); b=np.array(R.resize((w,h),Image.BILINEAR))[...,3].astype(float)
    for dx in range(-24,25,2):
      for dy in range(-24,25,2):
        c=np.zeros_like(oa); ys0=max(0,dy); xs0=max(0,dx); ys1=min(H,dy+h); xs1=min(W,dx+w)
        c[ys0:ys1,xs0:xs1]=b[ys0-dy:ys1-dy, xs0-dx:xs1-dx]
        d=np.abs(oa[:470]-c[:470]).mean()+np.abs(oa[H-150:]-c[H-150:]).mean()
        if best is None or d<best[0]: best=(d,sc,dx,dy)
  d,sc,dx,dy=best; res[k]=dict(err=round(d,1),scale=round(sc,2),dx=dx,dy=dy,src=list(R.size))
  w=int(round(W*sc)); h=int(round(R.height*w/R.width)); Rr=R.resize((w,h),Image.LANCZOS)
  M=Image.new('RGBA',(W,H),(0,0,0,0)); M.paste(Rr,(dx,dy),Rr)
  a=np.array(M); keep=np.zeros((H,W),bool); keep[360:480,:230]=True; keep&=(oa<128)
  clr=np.zeros((H,W),bool); clr[:480]=True; clr&=~keep; a[clr]=0
  F=Image.fromarray(a); F.alpha_composite(O.crop((0,0,W,480)),(0,0)); F.paste(O.crop((0,H-150,W,H)),(0,H-150))
  F.save(E+f'mont-{k}-birlesik.png')
print(json.dumps(res,indent=0))
json.dump(res,open(E+'hizalama.json','w'),indent=1)
cap=Image.open(S+'yagmur-sapka.png').convert('RGBA'); cap=cap.resize((600,int(cap.height*600/cap.width)),Image.LANCZOS)
tiles=[]
for k,o in P:
  F=Image.open(E+f'mont-{k}-birlesik.png'); W,H=F.size
  bg=Image.new('RGBA',(W+120,1103+220),(200,220,240,255)); y=1103+200-H; bg.alpha_composite(F,(60,y)); bg.alpha_composite(cap,(20,y-110)); tiles.append(bg)
c=Image.new('RGBA',(sum(t.width for t in tiles),tiles[0].height))
x=0
for t in tiles: c.paste(t,(x,0)); x+=t.width
c.convert('RGB').resize((c.width//3,c.height//3)).save(E+'dokuz-poz.png')
