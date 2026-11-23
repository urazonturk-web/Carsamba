import numpy as np, wave, sys
S=sys.argv[1]; SR=44100
def rd(p):
    with wave.open(p) as w: d=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float)/32768
    return d
def trim(x,th=0.02):
    i=np.where(np.abs(x)>th)[0]; return x[max(0,i[0]-400):i[-1]+2000] if len(i) else x
exec(open(S+"/synth.py").read().split("# ıslık")[0].replace("out=sys.argv[1]","out=S"))  # lowpass/reverb/finish/env yeniden kullan
def stretch(x,f):  # hız/perde değişimi (basit yeniden örnekleme)
    n=int(len(x)/f); return np.interp(np.arange(n)*f, np.arange(len(x)), x)
a=trim(rd(S+"/iiih-0.44.wav")); b=trim(rd(S+"/iiih-1.44.wav")); c=trim(rd(S+"/iiih-2.44.wav"))
L=int(1.15*SR)
mix=np.zeros(L)
for x,off,f,g in [(a,0.0,1.0,1.0),(stretch(b,1.08),0.06,1,0.8),(stretch(c,0.93),0.13,1,0.8)]:
    x=x[:L-int(off*SR)]; i=int(off*SR); mix[i:i+len(x)]+=x*g
finish(mix,"iiih",-20)
h=trim(rd(S+"/hooyt-1.44.wav"))[:int(1.15*SR)]
finish(h,"hooyt",-21)
print("ok")
