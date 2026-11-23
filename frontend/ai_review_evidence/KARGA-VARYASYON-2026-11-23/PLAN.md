# PLAN — Kargaların hareketinde çeşitlilik (Byzantion, 2026-11-23)

## Kullanıcı isteği
Video 11:43: "kargaların hareketi hep aynı daha varyasyonlu olmalı". Önceki kural sürer (2026-11-23 sabah): "bir yerlerde dursun; ben civarında zıplarken havalansın, sonra başka bir yere konsun; uzaktakiler yalnızca bana doğru kafa çevirsin".

## Şu anki durum (kod)
- `frontend/src/game/karga.ts`: `kargaDurus(t, seed)` — tünemiş/bakış iki durumlu tek döngü; `KARGA_UCUS_MS = 1500`.
- `frontend/app/index.tsx`: `kargaKacirRef.current(landedId, ratio)` iniş anında landed±1 kulelerdeki tüm kargaları aynı anda kaldırır; hedef her zaman "en yakın ileri komşusuz kule"; uçuş `withTiming(1, 1500 + n·150, inOut quad)`, yay yüksekliği sabit `B·1,4`, tek poz (havalanma), konuşta sıçrama yok. `kargaPoolStyle(i, pose)` dünya katmanında uçuşu çizer; `kargaStyle(slot, pose)` kule kargalarını çizer (yalnız tünemiş/bakış).
- Videoda gözlem: her kaçış aynı yay, aynı süre, aynı anda kalkış, hep ileriye.

## Yaklaşım (yalnız görsel; fizik/kamera/çarpışma/kule/iniş değişmez)
### 1) Uzaktaki (tünemiş) kargalar — yalnız kafa hareketi, ama her karga farklı
`kargaDurus` iki durumlu kalır: 0 tünemiş, 1 bakış (Kıvılcım'ın "karga-bakis" görseli: gövde aynı, baş omzunun üstünden geriye dönük — tek gerçek baş dönüşü görseli). "Öbür yana bakma" gibi tüm görseli aynalayan yeni bir durum **eklenmez** (gövdeyi de çevirir, kurala aykırı). Çeşitlilik yalnız zamanlamadan: her karganın tohumundan dönem 3–9 sn, bakış penceresi %10–30, bakışın döngüdeki yeri farklı; bazı kargalarda bakış seyrek (%10). Gövde yönü mevcut kabul edilmiş davranışla aynı kalır: amca indiğinde amcaya dönük (yön yalnız iniş anında güncellenen kAmcaX'e göre; amca uçarken kargalar dönmez). **Bakış pozunda gövde aynalanmaz:** şimdiki kodda bakışta `face = -f` ile tüm görsel ters çevriliyor (gövde dönüyor); bu kaldırılır, bakış pozu tünemiş pozuyla aynı `face` ile çizilir (yalnız baş döner). Aynı kural havuzdaki konmuş/bekleyen kargalar için de (`kargaPoolStyle`) uygulanır. Yürüme/yem/zıplama YOK. 250 ms kaba saat (kTick) aynen.

### 2) Yakındaki kargaların tepkisi — kişilik
Her kaçış olayında karga başına **ayrı bir üreteçten** (`kargaRng`: mulberry32, tohumu uygulama açılışında `Date.now()`; yalnız karga kodu tüketir; `Math.random()` çağrılmaz, böylece oyunun paylaşılan rastgele akışı ve koşu tohumu etkilenmez):
- %60 hemen kaçar (0–200 ms dağınık gecikme).
- %25 geç kaçar: 300–800 ms önce bakış pozunda amcaya bakar, sonra kalkar. Havuz girdisi hemen açılır (`wait: 1`), ilerleme `withDelay(gecikme, withTiming(1, …))` ile bekler. **Poz kuralı `kargaPoolStyle`'da açıkça:** `p <= 0` → konum `x0,y0`, poz `wait ? bakış(1) : tünemiş(0)`, gövde yönü tünemiş pozuyla aynı (amcaya dönük; bakışta da aynalanmaz, baş dönüşü yalnız bakış görselinden); `0 < p < 1` → uçuş(2); `p >= 1` → konmuş (durus döngüsü). Böylece bekleyen karga bakış pozunda görünür, gecikme biter bitmez uçuş pozuna geçer. Hemen kaçanlar da 0–200 ms aynı yoldan bekler (bu sürede tünemiş görünür; zıplama/kaybolma olmaz).
- %15 cesur: amca **komşu** kuleye indiyse kalkmaz, yalnız başını çevirir (o karga `kGone`'a eklenmez). Amca **aynı** kuleye indiyse cesur da kaçar.

### 3) Uçuş çeşitliliği (havuz girdisine kayıtlı parametreler)
- Süre 1100–2000 ms; yay yüksekliği 0,6–2,4·B; yatay/dikey küçük dalgalanma genliği 0–0,25·B, 1–2 döngü.
- Kanat çırpma hissi: uçarken `scaleY` 0,86–1,0 arasında saniyede ~7 çırpış (p'den türetilir, ek eşleyici yok).
- Konuş: son %10'da küçük aşağı-yukarı oturma sıçraması (≤0,08·B).
- Easing karga başına `inOut quad` / `out cubic` arasından.

### 4) Hedef çeşitliliği
- %70 ileri: amcadan 2–5 kule ötedeki komşusuz kule (rastgele seçilir, yalnız listede gerçekten olan kuleler).
- %20 geri: amcanın 2–4 kule gerisinde, listede hâlâ olan komşusuz kule (yoksa ileri).
- %10 gider: ekran dışına yukarı-sağa ya da yukarı-sola uçar ve kapanır (mevcut `id = -999` yolu).
- **Yedek sırası (son kontrol bulgusu KARGA-02 sonrası):** seçilen aralıkta boş tünek yoksa ileri seçimde sırayla geri (2–4), uzak ileri (6–8), uzak geri (5–7); geri seçimde ileri (2–5), uzak geri, uzak ileri denenir. "Gider"e yalnız %10'luk seçimle ya da listedeki hiçbir kulede boş tünek kalmadığında düşülür (belgelenmiş kapasite kuralı).
- **Havuz slotu (KARGA-01 sonrası):** sırayla boş slot → işi bitmiş "gider" slotu → en geride konmuş (p ≥ 1) karga; uçmakta olan (p < 1) slot asla yeniden kullanılmaz. Uygun slot yoksa karga kalkmaz ve yerinde kalır (kule kargası `kGone`'a eklenmez; kaybolma yok).
- **Tünek çakışmasız:** hedef seçimi kule değil tünek düzeyinde yapılır. Dolu tünekler kümesi = (a) bu kaçışta seçilmiş hedefler, (b) havuzda konmuş/konmakta olan kargaların hedefleri (`x1,y1`), (c) hedef kulenin hâlâ yerinde duran kendi kargalarının tünekleri (`kargaYer(g, slot)`, `kGone`'da değilse). Her aday kule için tünek tuzları 1..8 denenir; dolu tüneğe 12 birimden yakın aday elenir. Benzersiz tünek bulunamazsa sıradaki kuleye, o da yoksa "gider" yoluna geçilir. Koşul tünek koordinatıyla kontrol edildiği için aynı tüneği iki tuzun seçmesi de engellenir.

### 5) Yeni gelenler
Her inişte, havuzda boş yer varsa (kargaRng ile) %15 olasılıkla ekran dışından (amcanın 900–1300 birim önünden, 700–1000 birim yukarıdan) bir karga gelip 3–6 kule ötede bir tüneğe konar (aynı uçuş kodu). Böylece giden kargaların yerine yenileri de görülür.

## Sınırlar / performans
- Havuz 6 → 8 slot (8×3 = 24 eşleyici; uçuşta yalnız ilgili slotun P'si her karede değişir). Kule kargaları eşleyici sayısı aynı (kule başına 4).
- Yeni SharedValue sayısı: kP6, kP7. JS tarafında rastgele parametreler (kargaRng ile) havuz girdisine yazılır; worklet yalnız okur (R062 kuralı: her eşleyici kendi SharedValue'larını doğrudan okur).
- `KARGA_TEST` (geçici bayrak) yalnız simülatör denemesi için; teslimde false.

## Kabul ölçütleri
1. Simülatörde aynı kaçış olayında kargalar farklı anlarda kalkar (en az bir "geç" ve bir "hemen" gözlenir, KARGA_TEST ile); geç kaçan, beklerken bakış pozunda görünür (uçuş pozunda değil).
1b. Hiçbir anda iki karga aynı tünekte üst üste durmaz (KARGA_TEST ile çok sayıda olayda ekran görüntüleri).
2. Ardışık uçuşların süre/yay yüksekliği farklıdır (ekran görüntüsü dizisi; en az 3 uçuşta yay tepesi y değeri ≥ %20 farklı).
3. En az bir geri ve bir ileri konuş; bir "gider" (ekrandan çıkar) gözlenir (KARGA_TEST ile çok sayıda olayda).
4. Uzaktaki kargalar yürümez/zıplamaz/yem yemez ve tüm görsel aynalanarak "öbür yana" dönmez; yalnız bakış pozuna geçer (baş dönüşü), farklı kargalar farklı zamanda ve sıklıkta. Gövde yönü yalnız amcanın inişinde (mevcut davranış) güncellenir.
4b. Bakış pozuna geçişte gövde yönü değişmez (önce/sonra karelerinde kuyruk aynı tarafta).
4c. Karga kodunda `Math.random` yok (grep).
5. Cesur karga komşu kuleye inişte yerinde kalır, aynı kuleye inişte kalkar.
6. `npx tsc --noEmit -p .` (app/src/modules satırlarında yeni hata yok), `node ai_review_evidence/test_worklet_order_regression.cjs` PASS.
7. Telefonda kullanıcı videosu (asıl ölçüt).

## Doğrulama
tsc + worklet testi; simülatör (iPhone 17) KARGA_TEST açıkken 12 sn sonra her 4 sn sahte iniş tetikleyicisi (karga oturumunun bıraktığı mekanizma) ve 0,25 sn aralıklı ekran görüntüsü dizileri; görüntülerden uçuş tepe noktalarının ölçümü.

## Yetki
Kullanıcı isteği ile kod değişikliği yetkili; commit/push yok. Claudex Loop pilotu 2. özellik.

## Uygulama notları (inceleme için)
- Bu işin tam farkı: `frontend/ai_review_evidence/KARGA-VARYASYON-2026-11-23/delta.patch` (yalnız `frontend/app/index.tsx` ve `frontend/src/game/karga.ts`). Çalışma ağacında bundan önceki commit edilmemiş başka işler var (oyun sonu kartı, kargaların ilk sürümü vb.); onlar bu planın kapsamı dışı — lütfen yalnız bu yamayı esas alın.
- Geçici simülatör tetikleyicisi `KARGA_TEST` bayrağına bağlı (12 sn sonra her 3 sn sahte iniş); teslimde `KARGA_TEST = false`.
- Simülatör (iPhone 17, KARGA_TEST): kargaların farklı anlarda ve farklı yönlere kalktığı görüldü (`simzoom.jpg`, `sim/`); uçuş tepe noktalarının sayısal ölçümü yapılmadı (ekran görüntüsü aralığı 0,2 sn uçuşları kaçırıyor). Asıl doğrulama kullanıcının telefon videosu.
