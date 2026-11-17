from PIL import Image, ImageFilter
import numpy as np, json
S='/Users/bekirurazonturk/Documents/Codex/2026-09-09/referenced-chatgpt-conversation-this-is-an/shared/YAGMUR-preview/'
E='ai_review_evidence/YAGMUR-KIYAFET-2026-11-17/'
P=[('000','charge-000-r12.png'),('012','charge-012-r12.png'),('025','charge-025-r12.png'),('037','charge-037-r12.png'),('050','charge-050-r12-ifade.png'),('062','charge-062-r12-ifade.png'),('075','charge-075-r12-ifade.png'),('087','charge-087-r12-ifade.png'),('100','charge-100-r12-ifade.png')]
al=json.load(open(E+'hizalama.json'))
def dil(m,n): return np.array(Image.fromarray((m*255).astype('uint8')).filter(ImageFilter.MaxFilter(n)))>127
for k,o in P:
  O=Image.open('assets/characters/'+o).convert('RGBA'); W,H=O.size; oa=np.array(O).astype(int)
  R=Image.open(S+f'yagmur-mont-{k}.png').convert('RGBA'); a_=al[k]
  w=int(round(W*a_['scale'])); h=int(round(R.height*w/R.width)); Rr=R.resize((w,h),Image.LANCZOS)
  M=Image.new('RGBA',(W,H),(0,0,0,0)); M.paste(Rr,(a_['dx'],a_['dy']),Rr); m=np.array(M).astype(int)
  r,g,b,A=m[...,0],m[...,1],m[...,2],m[...,3]
  green=(A>200)&(g>=r-5)&(g>b+15)&(g>35)
  green[:430]=False
  # büyük bileşenler: gürültüyü at
  green=~dil(~dil(green,7),7); green[:430]=False
  mask=dil(green,13)&(A>100)
  mask[:430]=False
  # özgün eller ve yüz/çene her zaman önde
  orr,og,ob,oA=oa[...,0],oa[...,1],oa[...,2],oa[...,3]
  skin=(oA>200)&(orr>150)&(og>90)&(og<190)&(ob<140)&(orr-ob>60)&(orr-og>25)
  FX={'000':(282,788),'012':(269,796),'025':(258,802),'037':(254,805),'050':(258,804),'062':(270,800),'075':(289,788),'087':(311,768),'100':(331,741)}
  fx,fy=FX[k]; win=np.zeros_like(skin); win[max(0,fy-50):fy+80, max(0,fx-100):fx+100]=True; skin&=(ob<120)&(og>100)
  skin=dil(skin&win,7)
  front=skin.copy(); front[:]=front; 
  mask&=~skin
  out=oa.copy(); out[mask]=m[mask]
  F=Image.fromarray(out.astype('uint8'))
  F.save(E+f'mont-{k}-birlesik.png')
cap=Image.open(S+'yagmur-sapka.png').convert('RGBA'); cap=cap.resize((600,int(cap.height*600/cap.width)),Image.LANCZOS)
tiles=[]
for k,o in P:
  F=Image.open(E+f'mont-{k}-birlesik.png'); W,H=F.size
  bg=Image.new('RGBA',(W+120,1103+220),(200,220,240,255)); y=1103+200-H; bg.alpha_composite(F,(60,y)); bg.alpha_composite(cap,(20,y-110)); tiles.append(bg)
c=Image.new('RGBA',(sum(t.width for t in tiles),tiles[0].height)); x=0
for t in tiles: c.paste(t,(x,0)); x+=t.width
c.convert('RGB').resize((c.width//3,c.height//3)).save(E+'dokuz-poz.png')
ks=['012','050','087','100']; tl=[]
for kk in ks:
  F=Image.open(E+f'mont-{kk}-birlesik.png'); bg=Image.new('RGBA',F.size,(200,220,240,255)); bg.alpha_composite(F); tl.append(bg.crop((0,380,516,F.height)))
Hh=max(t.height for t in tl); c=Image.new('RGB',(516*4,Hh),(200,220,240))
for i,t in enumerate(tl): c.paste(t,(i*516,0))
c.resize((c.width*2//3,c.height*2//3)).save('/private/tmp/claude-501/-Users-bekirurazonturk-Documents-GitHub-Carsamba/11c9a8be-e8ed-447c-9349-ae8edbff33e2/scratchpad/dikis2.png')
