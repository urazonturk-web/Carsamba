import numpy as np, wave, sys
SR=44100; rng=np.random.default_rng(7)
out=sys.argv[1]
def lowpass(x,fc):
    # basit tek kutuplu, iki geçiş
    a=np.exp(-2*np.pi*fc/SR); y=np.zeros_like(x)
    for _ in range(2):
        acc=0.0
        for i in range(len(x)):
            acc=(1-a)*x[i]+a*acc; y[i]=acc
        x=y.copy()
    return y
def reverb(x,mix=0.25):
    y=x.copy()
    for d,g in [(0.031,0.5),(0.047,0.4),(0.071,0.3),(0.113,0.2),(0.167,0.12)]:
        n=int(d*SR); y[n:]+=g*mix*4*x[:-n] if n<len(x) else 0
    return y
def finish(x,name,target_db=-20):
    x=reverb(lowpass(x,3800))
    x=x/ (np.sqrt(np.mean(x[np.abs(x)>1e-4]**2))+1e-9) * 10**(target_db/20)
    pk=np.max(np.abs(x))
    if pk>0.89: x*=0.89/pk
    fade=int(0.02*SR); x[-fade:]*=np.linspace(1,0,fade)
    d=(np.clip(x,-1,1)*32767).astype(np.int16)
    with wave.open(f"{out}/{name}.wav","wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(d.tobytes())
def env(n,a,r):
    e=np.ones(n); A=int(a*SR); R=int(r*SR)
    e[:A]=np.linspace(0,1,A); e[-R:]=np.linspace(1,0,R); return e
# ıslık: iki nota, yükselen-alçalan, vibrato
def tone(f0,f1,dur,vib=6):
    n=int(dur*SR); t=np.arange(n)/SR
    f=np.linspace(f0,f1,n)+ f0*0.012*np.sin(2*np.pi*vib*t)
    ph=2*np.pi*np.cumsum(f)/SR
    return (np.sin(ph)+0.06*rng.standard_normal(n))*env(n,0.03,0.08)
isl=np.concatenate([tone(1500,2300,0.28),np.zeros(int(0.05*SR)),tone(2300,1300,0.42)])
finish(isl,"islik",-21)
# alkış: 5 el çırpışı
claps=np.zeros(int(1.1*SR)); t0=0.02
for k in range(5):
    n=int(0.05*SR); b=rng.standard_normal(n)*np.exp(-np.arange(n)/(0.008*SR))
    b=b-lowpass(b,900)  # yüksek geçiren benzeri
    i=int(t0*SR); claps[i:i+n]+=b*(0.8+0.4*rng.random()); t0+=0.17+0.05*rng.random()
finish(claps,"alkis",-21)
# panjur: alçak tok + tıkırtı
n=int(0.8*SR); t=np.arange(n)/SR
thump=np.sin(2*np.pi*95*t)*np.exp(-t/0.06)+0.6*np.sin(2*np.pi*160*t)*np.exp(-t/0.04)
noise=rng.standard_normal(n)*np.exp(-t/0.03)*0.5
rat=np.zeros(n)
for k in range(4):
    i=int((0.09+k*0.05+0.01*rng.random())*SR); m=int(0.012*SR)
    rat[i:i+m]+=rng.standard_normal(m)*np.exp(-np.arange(m)/(0.003*SR))*(0.5-0.1*k)
finish(thump+noise+rat,"panjur",-19)
# karga: sert gaak (gürültüyle modüle ton + biçimler)
def caw(dur,f0,seed):
    r=np.random.default_rng(seed); n=int(dur*SR); t=np.arange(n)/SR
    f=f0*(1+0.15*np.sin(np.pi*t/dur))
    ph=2*np.pi*np.cumsum(f)/SR
    src=np.sign(np.sin(ph))*0.6+0.4*r.standard_normal(n)
    am=1+0.5*np.sin(2*np.pi*38*t)
    form=lowpass(src*am,1800)-0.5*lowpass(src*am,500)
    return form*env(n,0.01,0.09)
c1=np.concatenate([caw(0.32,620,1),np.zeros(int(0.12*SR)),caw(0.28,580,2)])
finish(c1,"karga1",-20)
c2=caw(0.42,700,3)
finish(c2,"karga2",-20)
print("ok")
