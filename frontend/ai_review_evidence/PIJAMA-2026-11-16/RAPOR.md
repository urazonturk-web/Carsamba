# Erken gün batımı ve pijama anı — rapor (2026-11-16)
Görüş alınan editörler: Claude Code (taslak, karakter görselleri incelemesi), Codex (salt okunur ikinci görüş, `codex_cevap.md`). Antigravity ve Gemini terminalden çağrılamadı.

## 1) Gün batımı daha erken — YAPILDI (telefona kuruluyor)
`src/game/stops.ts` `skyStepForStops`: Kadıköy–Harem sabah, Üsküdar öğle, Kuzguncuk ikindi, Beylerbeyi ve Boğaziçi Köprüsü gün batımı, **Ortaköy'den (75. kule) itibaren gece** (yıldızlar). Eskiden de gece 75. kulede başlıyordu. Codex de aynı zamanlamayı önerdi (köprü boyunca gün batımı geçişe anlam katıyor).
İsteğe bağlı: finalde (Rumeli Feneri) şafak.

## 2) Pijama anı — öneri (kod yazılmadı)
**Ne olur:** gecenin başladığı ilk iniş = Ortaköy durak kulesi (zaten geniş "nefes" kulesi). İnişten hemen sonra:
1. Çatıda küçük bir çatı kapısı belirir (0,2 sn)
2. Amca kapıya yürüyüp içeri girer, küçülerek kaybolur (0,4 sn); kapı sallanır
3. Pijamalı amca çıkar (0,4 sn), kapı kaybolur
Toplam ~1-1,2 sn. Yalnız bu animasyon sırasında dokunma yok sayılır (durak tabelası süresince değil). Zıplama fiziği, kule, kamera değişmez; yalnız çizim katmanı. O koşu boyunca pijama kalır, yeni koşuda eşofmana döner.

**Pijamanın görünüşü — üç yol:**
- **A (önerilen, iki editör aynı fikirde):** yalnız ponponlu gece külahı + terlik. Tek küçük görsel; her şarj pozunda baş ve ayak noktası alfa taramasıyla ölçülür, kareler arası kayma olmaz. Ucuz ve hızlı.
- **B:** 9 pozun (+5 ifade = 14 görsel) eşofmanı mavi-beyaz çizgili pijamaya çevrilmiş hâli (Kıvılcım ile üretim, ücretli). Daha etkileyici, ama 14 pozun birbirine uyması gerek; uymazsa şarj sırasında karakter titreşir. FAZ2-İFADE'deki gibi siluet karşılaştırmasıyla kontrol edilir.
- **C:** B + kapı için ek pozlar (esneme, yürüme). Şimdilik gereksiz.

**Gereken yeni görseller:** çatı kapısı (açılır/kapanır) + gece külahı/terlik (A) veya pijamalı pozlar (B). Senin kabulün olmadan oyuna bağlanmaz.

**Dikkat (Codex):** patlama sonrası leke ve sinekler amcanın üstüne çizildiği için pijamayı da kirli gösterir; kapıdan çıkınca temizlenmesini öneriyoruz ("temiz pijama"). Kapı anı küçük ekranda okunmazsa daha kısa, belirgin bir siluet geçişi yapılır.

## Önerilen sıra
1. Erken gün batımını telefonda dene (kuruldu).
2. A için görsel şartname: çatı kapısı + gece külahı + terlik (üretim/harcama kararı senin).
3. Görseller onaylanınca kapı anını kodla bağla, telefonda dene.
4. Beğenilirse B (tam pijama) ayrıca değerlendirilir.
