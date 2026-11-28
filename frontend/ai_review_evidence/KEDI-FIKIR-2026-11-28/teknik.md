# TEKNİK editör — kedi kurtarışı (mevcut koda göre)

1) KULLANICININ FİKRİ
En ucuz yol, index.tsx'teki "fall -> game over" bloğunda zaten var olan Marmara ŞIP kurtarışını kopyalamak: `kurtar` bulunamazsa `kediHak.value > 0` ise kedinin kulesi (rehberId, yoksa lastLandedId) seçilir, px/py/vx/vy/phase=IDLE/dusus=0/lastLandedId/standingPlatformId aynı satırlarla atanır, hak düşer, onGameOver çağrılmaz. Fizik, kamera, findFootLanding hiç değişmez; görsel ipucu için dususKesin()'in koyduğu `dusus.value === 1` anında kedi "uzanma" pozuna geçer (oyuncu kurtarılacağını orada anlar). Koşu başına 1 hak; onLanding içinde N inişte bir geri doldurulur. Önce oran düzeltmesi: TEKIR_S yaklaşık yarıya, havada pozu diğerleriyle aynı gövde ölçeğine, kediDurum'da amca aynı kuledeyse kedi kulenin arka ucuna (0,68 yerine ~0,15) kaydırılmalı.

2) ÜÇ YARATICI ÇEŞİTLEME
- ARKA KULE ÇAĞRISI — Kedi hep bir kule geride (rehberHedef yerine landedId - 1); kurtarış oraya geri koyar. — Geri dönüş "kediye döndüm" gibi hissettirir, kod en kısa.
- PATİ İPİ — Düşüş kesinleşince 0,4 sn kedi-amca arası ip/kuyruk çizgisi çizilir, sonra ışınlama. — Işınlama sihirli değil, çekilmiş gibi görünür.
- HAK DOLAN KEDİ — Hak, izleme sayacına (rehberAdimRef) bağlanır; 3 izlemede bir hak. — Mevcut sistem atılmaz, yeni anlam kazanır.

3) TUZAK
Kurtarışı düşüş sırasında hızı değiştirerek (fizikle "yakalama") yapmak: iniş/kamera mantığını bozar; yalnız düşüş eşiğinde ışınlama kullanılmalı.

4) TERCİHİN
ARKA KULE ÇAĞRISI: ŞIP kalıbını kullanır, yarım gün kod + yarım gün oran/poz düzeltmesi, toplam ~1 gün.
