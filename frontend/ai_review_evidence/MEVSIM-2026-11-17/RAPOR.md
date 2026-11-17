# Byzantion — Mevsim Kıyafeti ve Havanın Sahneye İzi (2026-11-17)

Kullanıcı: "mevsimine göre de hareket ettirelim; yazın atlet uzun paçalı don, kışın büyük bir mont… yağış, kar, rüzgâr durumuna göre arka plan ve kolonlar da mevsimin/havanın izlerini taşısın."
Danışılan: Codex (`codex-gorusu.md`) ve ikinci bir Claude editörü (özeti aşağıda). Brif: `brief.md`.

## 1. Mevsim nasıl belirlenir — iki editör aynı görüşte

- **Temel: takvim.** Gerçek sıcaklık yalnız düzeltir. Claude editörünün eşikleri: **26 °C ve üstü → atlet**, **7 °C ve altı → mont**, arası mevsim kıyafeti.
- **Kıyafet koşu başında bir kez seçilir**, koşu ortasında değişmez (gece kapısı hariç). Yoksa hava değiştikçe amca titreşir.
- İnternet yoksa yalnız takvim.

## 2. Kıyafetler

| Mevsim | Kıyafet | Komik ayrıntı |
|---|---|---|
| **Yaz** | Atlet + uzun paçalı beyaz don (senin fikrin) | Alında ter damlası (ifadeli pozlarda zaten var), koltuk altı ter lekesi, elde gazeteyle yelpazelenme |
| **Kış** | Kocaman şişme mont + sıkıca dolanmış atkı, bere | Kızarmış burun, ağızdan buhar, beklerken omuz titremesi |
| **İlkbahar** | Bugünkü kırmızı eşofman (maliyeti yok, zaten mevsim arası) — istenirse yakada küçük erguvan | — |
| **Sonbahar** | Eşofman; yağmurlu günde başa naylon poşet/gazete | Omza takılmış sarı yaprak |

**Gece kapısı (pijama) ile çakışma — kural:** pijama baş ve ayakta her zaman kazanır (gece külahı + terlik).
- Yaz: atlet ve don zaten ev kıyafeti → üstüne külah ve terlik.
- Kış: kapıda mont ve bere çıkar, eşofman + külah + terlik; atkı boyunda kalır.
- İlkbahar/sonbahar: bugünkü gibi.

## 3. Üretim yolu — asıl karar burada

İki editör aynı noktada birleşti:

- **Baş aksesuarları ucuz ve güvenli.** Amcanın başı 9 şarj pozunun hepsinde aynı yerde (gece külahı da böyle oturtuldu). Bere, atkı, poşet tek görselle bütün pozlara oturur: **öğe başına 1–2 görsel çağrısı**. Kızarık burun ve buhar görsel bile istemez, kodla yapılır.
- **Gövde kıyafeti (atlet, mont) pahalı ve riskli.** Gövde şarj sırasında 9 farklı şekle çöküyor; tek bir mont katmanı bunlara uymaz. Kıyafet başına **9 görsel** gerekir ve en büyük risk tutarlılık: atlet çizgisi, don paçası, mont hacmi pozdan poza kayarsa "titreyen kıyafet" olur.
- **Güvenli yöntem (Claude editörü):** Kıvılcım'dan yalnız gövde istenir; bir betik özgün başı ve ayakkabılı alt şeridi piksel piksel geri yapıştırır. Böylece yüz, ifadeler, ayak/pivot ve iniş algısı hiç değişmez. **Önce yalnız 2 pozla (000 ve 100) deneme**; tutarlıysa kalan 7 poz. Bir kıyafet seti ≈ 9 onaylı çağrı + 1–2 gün düzeltme.
- Mont gövdeden biraz taşabilir ama ayak hizasının ve tabanın dışına çıkmamalı.

## 4. Arka plan ve kolonlarda hava izi

**Kural:** Hiçbir hava izi çatının iniş çizgisinin üstüne çıkmaz; amca hangi çizgiye basıyorsa göz de onu görmeli.

**Kodla yapılabilenler (görsel üretimi yok):**
- **Kar örtüsü:** Kolon kapaklarının saydamlık maskesinden betikle beyaz bir "kar kapağı" türetilir; iniş çizgisinden aşağı dolar, ince koyu konturla gökyüzünden ayrılır. Üste yükselti eklemez.
- **Buz sarkıtları:** Saçak altında küçük üçgenler (iniş çizgisinin altında, zararsız).
- **Islak kiremit:** Aynı maskeyle hafif koyulaşma + kayan parlama şeridi; saçaktan damlayan damlalar.
- **Su birikintisi:** Çatıda yassı, soluk elips (yüksekliği yok).
- **Sonbahar:** Seyrek uçuşan sarı yaprak parçacıkları (iniş bölgesinde yoğunlaşmaz).
- **Yaz:** Güneş parıltısı + sıcak ton.
- **Rüzgâr:** Mevcut rüzgâr çizgileri yeterli.

**Dikkat:** Çamaşır ipini kuleler arasına germek yanlış bir basamak gibi okunur → yalnız arka plandaki mahalle çatılarına.

**Görsel isteyenler (pahalı, sonraya):** Karlı mahalle çatıları, erguvan/lale kümeleri gibi arka plan dekorları — mevsim başına bir büyük görsel. Önce renk tonu ve kodla çizilen lekelerle denenmeli. Küçük bir yaprak/çiçek görseli (1 çağrı) parçacıkları güzelleştirir ama şart değil.

## 5. Önerilen sıra (iki editörün ortak sırası)

1. **Mevsim kuralı + kodla hava izleri** (kar kapağı, buz sarkıtı, ıslak kiremit, damla, yaprak, yaz parıltısı). Görsel onayı gerekmez, sahne en çok bununla değişir. Her havada iniş okunurluğu ekran görüntüsüyle kontrol edilir.
2. **Kış baş katmanı:** bere + atkı (1–2 onaylı görsel çağrısı), kızarık burun ve buhar kodla. Risk düşük, mevsim farkı hemen görünür.
3. **Yaz gövdesi denemesi:** atlet + don, yalnız 000 ve 100 pozları, baş ve ayak geri yapıştırma yöntemiyle. Tutarsa 9 pozluk set ve ardından mont seti; tutmazsa kıyafet baş/aksesuar katmanlarıyla sınırlı kalır, gövde eşofman olarak sürer.

Değişmeyenler: zıplama fiziği, kamera, çatı silueti, çarpışma. Yeni görseller onayınız olmadan oyuna bağlanmaz; her görsel çağrısı ayrı onay ister.
