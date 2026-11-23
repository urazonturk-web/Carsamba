import sys, torch, torchaudio as ta
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
out=sys.argv[1]
m=ChatterboxMultilingualTTS.from_pretrained(device="mps", t3_model="v3")
jobs=[("iiih",["Iıııh!","Iııııh!","Iıııh!"],[3,11,27]),("hooyt",["Hööyt!","Hööööyt!"],[5,19])]
for name,texts,seeds in jobs:
    for i,(t,sd) in enumerate(zip(texts,seeds)):
        torch.manual_seed(sd)
        w=m.generate(t, language_id="tr", exaggeration=0.8, cfg_weight=0.3)
        ta.save(f"{out}/{name}-{i}.wav", w.cpu(), m.sr)
        print(name,i,w.shape[-1]/m.sr, flush=True)
