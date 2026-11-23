# PLAN — Düşüş kesinleşince amcanın "eyvah" çırpınması (2026-11-23)

## İstek
Kullanıcı (video 13:56): "artık kulelerden aşağı düşeceği kesinleşince düşerken kollarını bacaklarını açsın eyvah hali olsun ... güzel bir düşüş yaratalım". Görseller (amca-dusus-1/2, 1100×1103, Kıvılcım) kullanıcı tarafından kabul edildi: "Kabul, bağla".

## Sınır
Yalnız görüntü. Fizik (advanceFlight, findFootLanding), kamera, iniş/çarpışma, oyun sonu eşiği, skor değişmez. Yeni kod fizik değerlerini yalnız OKUR.

## "Kesinleşti" kuralı (index.tsx kare döngüsü, AIRBORNE dalı, iniş denetiminden SONRA)
İniş ancak `findFootLanding` ile, ayak çizgisi bir platformun `topY`'sini yukarıdan aşağı geçerken olur; `vy > 0` iken ayak yalnız aşağı iner ve `scaledPlatforms` (kurukafa) yalnız x/width'i değiştirir, `topY`'yi değil. Dolayısıyla: `phase === AIRBORNE && vy > 0 && (ayak çizgisi py + PH/2) > max(list[i].topY)` olduğunda hiçbir platforma artık inilemez → düşüş kesin. Karşılaştırma, o karede inişin kullandığı **aynı `landList`** üzerinden yapılır (kurukafa etkisi açıkken `scaledPlatforms(list, effectK)`); `scaledPlatforms` x/width'i değiştirse de `topY`'yi kopyalar, ve kural x'ten bağımsız olduğu için genişleyen platform kesişimi değiştirmez: ayak bir `topY`'nin altındaysa ve `vy>0` iken o `topY`'yi yukarıdan geçmesi mümkün değildir. Bu koşul x'ten bağımsız, yanlış pozitifi yok (kanıt: aşağıdaki node testi). Bu karede iniş olduysa faz IDLE'dır, koşul tetiklenmez.
Tetiklenince bir kez: `dusus.value = 1`, `dususAt.value = frame.timestamp`. **Görünürlük ömrü:** kare döngüsü `running !== 1` iken erken döner (index.tsx ~2609) ve DEAD, amca görünür kameranın H+60 altına çıktığında atanır; yani çırpınma tetik ile oyun sonu eşiği arasında, amca ekrandayken oynar, DEAD'den sonra amca zaten ekran dışıdır ve `dusus` son değerinde kalır (yeniden başlatmada sıfırlanır). `restart` ve yeni zıplamada (`phase = AIRBORNE` atandığı yer) `dusus.value = 0`.
Çırpınma: kare döngüsünde `dusus.value > 0` iken `dusus.value = 1 + (floor((ts − dususAt)/110) % 2)` → 1/2 kareleri 110 ms'de bir değişir (yalnız değiştiğinde yazılır).

## Çizim (ChargePoses.tsx)
- `character-pose.ts`: `FALL_POSES` (2 görsel, w 1100, h 1103, pivotX 590, pivotY 1108). Pivot ölçümü: charge-000'ın baş (ilk 160 satır) ağırlık merkezi pivot'un 45 px solunda ve tepesi y=1; düşüş görsellerinde baş merkezi x≈544, tepe y≈6 → pivotX 544+45≈590, pivotY 1103+5=1108 (baş, düşüşe geçerken aynı yerde kalsın).
- `fallVisible(d, giysi)` worklet: `d > 0 && giysi <= 0.01`, giysi = max(yağmur, kış, pijama, şemsiye, özel şapka). **Kirli (aşırı şarj lekesi, `dirty`) ve kar birikintisi (`snow`) düşüşü ENGELLEMEZ**: aşırı şarjlı ıskalama en sık düşüş türü olduğu için çırpınma orada da görünür; bu iki durumda düşüş sırasında leke/kar katmanı geçici olarak görünmez (bilinçli kabul, düşüş ~0,3–1 sn). Giysi değiştiren durumlar (yağmurluk, kış atkı/bere, pijama, şemsiye, özel gün şapkası) açıkken düşüş pozu çizilmez, eski görünüm sürer (kırmızı eşofmanlı düşüş pozu bu kıyafetlerle çelişir; uyumlu kıyafetli düşüş görselleri ayrı iş, yeni görsel onayı ister).
- `FallLayer({k})`: ReactionLayer gibi; opaklık `dusus === k && fallVisible`, transform pivot ile (ölçek yok). Hale (halo) aynı.
- PoseLayer ve ReactionLayer: `fallVisible` iken opaklık 0 (aynı anda iki gövde yok).
- Yeni prop `dusus?: SharedValue<number>`; verilmezse davranış bugünküyle aynı.
- Bayrak `DUSUS_ON = true` (index.tsx), test bayrağı yok (düşüş simülatörde elle tetiklenir).

## Kabul ölçütleri
1. tsc yeni hata yok; `test_worklet_order_regression.cjs` PASS.
2. Node testi `test_dusus_kesin.cjs`: gerçek `config.ts`/`jump.ts`/`landing.ts` (advanceFlight, findFootLanding) ve gerçek prosedürel parkurla, 0.05–1.0 arası 200 şarj × 20 tohumda zıplama simüle edilir; "kesin" kuralı tetiklendikten sonra hiçbir karede iniş olmaz (yanlış pozitif 0) ve tetiklenen her uçuş oyun sonu eşiğine ulaşır. Kurukafa etkisi açık (k 0,6 ve 1,4 ile `scaledPlatforms`) koşular da dahildir. Tetik ile oyun sonu eşiği arasındaki süre dağılımı raporlanır; ölçüt: kaçırılan uçuşların en az %90'ında bu süre ≥ 220 ms (en az iki kare değişimi görünür). Sağlanmazsa çırpınma aralığı kısaltılır (en az 70 ms), fizik/eşik değiştirilmez.
3. Simülatörde kasıtlı kaçırma (normal ve aşırı şarjlı/kirli): düşüşte iki karenin değiştiği ekran görüntüleri; inişlerde poz görünmez. Giysi açıkken düşüşte eski görünüm (kapsam dışı, bilinçli).
4. Telefonda kullanıcı videosu.

## Yetki
Kullanıcı isteği + görsel kabulü; commit+push onaysız. Claudex Loop.
