# KARGALAR — 2026-11-22

Kullanıcı: "balkonların korkuluklarında, çamaşır iplerinde, çiçeklerin yanlarında hareket eden kargalar" → Kıvılcım 4 poz → "Kabul, bağla".

## Dosya
- Kaynak: ~/Documents/Codex/.../shared/KARGA-preview/karga-{tunemis,bakis,yem,havalanma}.png (600×600)
- Oyunda: assets/environment/mahalle/karga/ (300×300'e küçültüldü, sips -Z 300)

## Ölçü / pivot
- Ortak kare tuval; ayak tutunma noktası (0.5, 500/600) — alfa sınırlarıyla doğrulandı (alt kenar y≈500; havalanma 483).
- Tuval dünya boyu = FART_CHAR_H × 0.62.
- Tünekler: 12 cephe hücresinde elle ölçülmüş 4–6 nokta (src/game/karga.ts KARGA_TUNEK; korkuluk üstü, halı sırığı, ip ucu, pervaz, cumba çatısı). Kule başına 0/1/2 karga (%45/%40/%15), ilk 3 kule boş, komşulu (teyze/kedi) kulede yok, dar kulede kenardan taşan tünek atlanır.

## Katman
- PlatformHouseView içinde, kedilerden sonra (cephe + oluk üstünde). Sabit kutu + transform (R066). Kule başına 8 katman (2 karga × 4 poz).
- Duruş döngüsü 250 ms'lik kaba saatle (kTick); her karede eşleyici koşmaz.
- Amca kargalı kuleye inince: havalanma pozu, 900 ms'de yukarı-yana uçup kaybolur; o kulede bir daha görünmez (son 8 kule hatırlanır, yeni koşuda sıfırlanır).

## Risk / doğrulanmadı
- Havalanma simülatörde görülemedi (dokunma süresi isabetsiz); telefonda video bekleniyor.
- Telefonda performans (14 kule × 8 ek katman) ölçülmedi.
- Çamaşır ipi tünekleri çamaşırla kısmen örtüşebilir.
Kanıt: sim-karga-tunek.png (KARGA_TEST açıkken), karga-olcek-onizleme.jpg, dort-poz-yan-yana.png.

## Güncelleme — "kargalar çok sonradan beliriyor; kurukafa 12. kuleden sonra değil rastgele, süresi bitmeden yenisi çıkmasın"
- Karga: 1. kuleden başlar, 1–2. kulede en az bir karga; oran %30 boş / %50 bir / %20 iki (önce ilk 3 kule boş, %45 boş).
- Kurukafa: SKULL_MIN_ID 16 → 4 (durak kuleleri yine hariç, iki kurukafa arası en az 4 kule kuralı duruyor).
- Kurukafa: etki sürerken (effectLeft > 0) yeni kurukafa gösterilmez ve alınamaz; etki bitince ileride kalan ilk kurukafa görünür.
- Fizik, yörünge ve kule dizisi değişmedi (yerleşim ayrı karma; yalnız görünürlük kapısı).
- Doğrulanmadı: telefonda video.

## Güncelleme — kargalar üst katta (video 21:42 bulgusu)
- Tünek aralığı 30–900 → 30–450 hücre pikseli (KARGA_MAX_Y). Kargalar artık kulenin ekranda görünen üst katlarında.
- Kapsam (simülasyon, gerçek tablolarla): 48 cephe/başlangıç birleşiminin 46'sında en az bir üst kat tüneği, 30'unda iki ve üstü.
- Doğrulanmadı: telefonda havalanma anı (yeni video gerekiyor).

## Güncelleme 2026-11-23 — "kargalar hayalet gibi olmasın; yakınımda havalansın, başka yere konsun; uzaktakiler bana kafa çevirsin"
- Kargalar artık kendi kendine poz değiştirip kaybolmuyor: tünekte duruyor, arada başını çeviriyor. Hep amcaya dönük (bakışta omzunun üstünden).
- Amca bir kuleye inince o kule ve iki yanındaki kulelerin kargaları havalanır (1,5 sn yay), listede gerçekten var olan, amcadan en az 2 kule ötedeki komşusuz bir kulenin tüneğine konar (önce ileridekiler, kendi kargası olmayanlar). Konan karga orada kalır; amca yine yaklaşınca tekrar kalkar.
- Uçan/konmuş kargalar dünya katmanında 6 kişilik havuz (kule kırpmasına takılmaz). Yer yoksa ekran dışına uçar ve kapanır.
- Hata (simülatörde bulundu): ilk sürümde hedef yalnız henüz oluşmamış kulelerde aranıyordu → hepsi ekran dışına uçuyordu. Düzeltildi.
- Kanıt: sim-konup-kalkma.jpg (simülatör, deneme modunda; 2. kare uçuş, 4. kare başka yere konmuş).
- Doğrulanmadı: telefonda gerçek oyunda konup kalkma ve akıcılık.
