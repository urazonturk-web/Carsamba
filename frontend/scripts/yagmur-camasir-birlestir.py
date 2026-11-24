import sys, numpy as np
from PIL import Image
from scipy import ndimage as nd
D,S,G=sys.argv[1:4]
o=np.asarray(Image.open(G+'/facade-atlas-g018.jpg').convert('RGB')).astype(float)/255
k0=np.asarray(Image.open(G+'/facade-atlas-g018-kar.jpg').convert('RGB')).astype(float)/255
k1=np.asarray(Image.open(S+'/hazir/facade-atlas-g018-kar.jpg').convert('RGB')).astype(float)/255
out=o.copy()
for c in (2,5,8,11):
    x=slice(c*350,c*350+350)
    km=nd.gaussian_filter(np.abs(k1[:1035,x]-k0[:1035,x]).max(-1),2)>0.15
    km=nd.binary_closing(km,np.ones((9,9)))
    lab,n=nd.label(km); sz=nd.sum(km,lab,range(1,n+1)); big=lab==(1+int(np.argmax(sz)))
    sl=nd.find_objects(big.astype(int))[0]
    y0,y1=max(0,sl[0].start-25),min(1035,sl[0].stop+25); x0,x1=max(4,sl[1].start-20),min(346,sl[1].stop+20)
    gi=Image.open(D+'/camasir-yagmur-hucre-%02d.png'%c).convert('RGB')
    g=np.asarray(gi.resize((350,1035),Image.LANCZOS)).astype(float)/255
    d=np.abs(g-o[:1035,x]).max(-1)
    m=nd.gaussian_filter(d,2)>0.18
    box=np.zeros_like(m); box[y0:y1,x0:x1]=True; m&=box
    m=nd.binary_dilation(m,np.ones((7,7)))&box
    a=nd.gaussian_filter(m.astype(float),2.5)[...,None]
    band=o[:1035,x]*(1-a)+g*a
    col=o[:,x].copy(); col[:1035]=band; col[1035:]=band[:305]; out[:,x]=col
    print(c,'kutu y',y0,y1,'x',x0,x1,'alan %',round(m.mean()*100,1))
Image.fromarray((out*255).astype(np.uint8)).save(S+'/hazir/facade-atlas-g018-yagmur.jpg',quality=92,subsampling=0)
c=Image.new('RGB',(4*360,700),'white'); A=Image.open(G+'/facade-atlas-g018.jpg'); B=Image.open(S+'/hazir/facade-atlas-g018-yagmur.jpg')
for i,cc in enumerate([2,5,8,11]):
    c.paste(A.crop((cc*350,0,cc*350+350,1340)).resize((175,670)),(i*360,0)); c.paste(B.crop((cc*350,0,cc*350+350,1340)).resize((175,670)),(i*360+180,0))
c.save(S+'/yagmur_cam.png')
