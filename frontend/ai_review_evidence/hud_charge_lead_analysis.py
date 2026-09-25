import re, statistics as st, itertools, json, math
rx = re.compile(r"(\d+)\s*ms.*?%\s*(\d+).*?%\s*(\d+).*?(-?\d+)\s*ms")
rows = []   # (video, frame, H, P, V, F)
for line in open("hud_charge_lead_ocr_raw.txt"):
    f, t = line.rstrip("\n").split("|", 1)
    m = rx.search(t)
    if not m: rows.append((f, None)); continue
    H, P, V, F = map(int, m.groups())
    rows.append((f, (H, P, V, F)))
# run-length dedupe per video: a jump = run of >=2 identical consecutive readings
jumps = []
for vid in ("hud_a", "hud_b"):
    seq = [(f, tup) for f, tup in rows if f.startswith(vid) and tup]
    for tup, grp in itertools.groupby(seq, key=lambda x: x[1]):
        g = list(grp)
        if len(g) >= 2: jumps.append((vid, g[0][0], *tup))
print("distinct readings (runs>=2 frames):", len(jumps))
# consistency filter: launch power must equal round(100*H/450) (clamped) within 1 point; visual must be in [0,100]; F plausible
ok, bad = [], []
for vid, f, H, P, V, F in jumps:
    expP = min(100, round(100 * H / 450))
    if abs(P - expP) <= 1 and 0 <= V <= 100 and 0 <= H <= 2000 and -1 <= F <= 300 and V >= P - 2: ok.append((vid, f, H, P, V, F))
    else: bad.append((vid, f, H, P, V, F))
print("consistent with c=H/450:", len(ok), "| rejected as OCR/inconsistent:", len(bad))
# de-saturate: exclude clamped (H>=430 -> visual saturates at 100)
data = [r for r in ok if r[2] < 430]
print("usable (unsaturated) jumps:", len(data))
delta_ms = [V * 4.5 - H for _, _, H, P, V, F in data]           # visual-elapsed minus true hold, in ms (rounding +-2.3ms)
lead_pts = [V - P for _, _, H, P, V, F in data]
H_ = [r[2] for r in data]; F_ = [r[5] for r in data]
def q(a, p): a = sorted(a); return a[min(len(a)-1, int(p*len(a)))]
print(f"lead (points):  mean {st.mean(lead_pts):.2f}  std {st.pstdev(lead_pts):.2f}  min {min(lead_pts)}  p25 {q(lead_pts,.25)}  median {st.median(lead_pts)}  p75 {q(lead_pts,.75)}  max {max(lead_pts)}")
print(f"delta (ms):     mean {st.mean(delta_ms):.1f}  std {st.pstdev(delta_ms):.1f}  min {min(delta_ms):.1f}  median {st.median(delta_ms):.1f}  max {max(delta_ms):.1f}")
def corr(x, y):
    mx, my = st.mean(x), st.mean(y); sx = math.sqrt(sum((a-mx)**2 for a in x)); sy = math.sqrt(sum((b-my)**2 for b in y))
    return sum((a-mx)*(b-my) for a, b in zip(x, y)) / (sx*sy)
def slope(x, y):
    mx, my = st.mean(x), st.mean(y); return sum((a-mx)*(b-my) for a, b in zip(x, y)) / sum((a-mx)**2 for a in x)
print(f"corr(delta_ms, holdMs) = {corr(H_, delta_ms):+.3f}  slope = {slope(H_, delta_ms):+.4f} ms/ms   (0 => constant time offset; >0 => proportional)")
print(f"corr(delta_ms, firstFrameMs) = {corr(F_, delta_ms):+.3f}  slope = {slope(F_, delta_ms):+.3f}")
print(f"corr(lead_pts, holdMs) = {corr(H_, lead_pts):+.3f}")
# per-video and per hold-band
for vid in ("hud_a", "hud_b"):
    d = [V*4.5-H for v, f, H, P, V, F in data if v == vid]
    if d: print(vid, "n", len(d), f"delta mean {st.mean(d):.1f} std {st.pstdev(d):.1f} ms")
for lo, hi in ((0,100),(100,200),(200,300),(300,430)):
    d = [V*4.5-H for v, f, H, P, V, F in data if lo <= H < hi]; l = [V-P for v, f, H, P, V, F in data if lo <= H < hi]
    if d: print(f"hold {lo:3}-{hi:3}ms n={len(d):3}  delta {st.mean(d):5.1f} ms (std {st.pstdev(d):4.1f})  lead {st.mean(l):4.1f} pts")
# candidate estimators for the pose value at the LAST displayed frame vs launch power P (points)
def rms(e): return math.sqrt(sum(x*x for x in e)/len(e))
n = len(data)
e_raw = [V - P for _, _, H, P, V, F in data]
e_F = [(V - F/4.5) - P for _, _, H, P, V, F in data]                      # subtract per-press first-frame offset
# leave-one-out constant offset
e_c = []
for i, r in enumerate(data):
    others = [d[4]-d[3] for j, d in enumerate(data) if j != i]; k = st.mean(others)
    e_c.append((r[4]-k) - r[3])
# leave-one-out proportional (scale) model V ~ a*P
e_s = []
for i, r in enumerate(data):
    others = [(d[3], d[4]) for j, d in enumerate(data) if j != i]
    a = sum(p*v for p, v in others) / sum(p*p for p, v in others)
    e_s.append(r[4]/a - r[3])
for name, e in (("raw charge.value", e_raw), ("minus per-press first-frame (F/450)", e_F), ("minus LOO constant offset", e_c), ("LOO proportional scale", e_s)):
    print(f"{name:38}  bias {st.mean(e):+5.2f} pts   RMS {rms(e):5.2f}   worst |err| {max(abs(x) for x in e):5.1f}")
json.dump([dict(video=v, frame=f, holdMs=H, power=P, visual=V, firstFrameMs=F) for v, f, H, P, V, F in data], open("hud_charge_lead_dataset.json", "w"))
print("rejected examples:", bad[:5])
