# Editör / Oyun Tasarımı: "Osuruk izi" fikri (2026-11-11)

Kaynak: kontakt.jpg ve kareler, önceki editor-tasarim.md, config.ts, app/index.tsx (jacketPopped/puffAge), src/game/sfx.ts. Fizik ve kamera dokunulmaz kabul edildi.

## 1. Değer ve risk
**Ne katar:** Zıplamanın neden olduğunu anlatan bir itki metaforu getirir: "amca gazla kalkıyor". Şarj (karın şişmesi, ceketin açılması) ile bırakma (boşalma) arasında anlatı bağı kurar. Mevcut tam şarj anı zaten bu fikre hazır: ceket açılıyor, puf oluşuyor. İz, kısa bir videoda çoklu atlamayı görünür kılar ve paylaşılabilir bir kare üretir. Önceki raporun "çoklu atlamanın ödülü görünmez" sorununa da kısmen çözümdür.
**Neyi riske atar:** Bu fikir de bir espri ve dakikada 40'tan fazla tekrarlanacak. Kullanıcı espri satırlarını "hepsi birbirinden kötü" diye kaldırttı; sebep tekrarın şakayı öldürmesiydi. Ses her zıplamada aynı olursa üçüncü turda rahatsız eder. İkinci risk: iz yörüngeyi çizerse nişan yardımına dönüşür ve oyunun becerisi azalır. Üçüncü risk: yerde ya da toplu ortamda oynayan kullanıcı için utanç verici olabilir. Mağaza yaş derecesi açısından sorun değildir.

## 2. Mekaniğe bağlama
- **Büyüklük = şarj:** Bulut çapı, opaklığı ve ses süresi `charge` değerine bağlansın. Kısa dokunuşta yalnız "pıt" ve tek küçük bulut olsun.
- **İz yalnız geride kalsın:** Bulut ancak karakterin geçtiği noktaya bırakılsın, ileriyi hiç göstermesin. Ömrü kısa olsun (~0,6–0,9 sn, uçuşla birlikte solsun). Bu sayede yörüngeyi önceden göstermez.
- **Kalkışta güçlü, sonra seyrek:** İlk ~0,15 sn yoğun bulut çıksın, sonra sıklık azalsın. Böylece "itki kalkışta" fikri okunur ve ekran kirlenmez.
- **İnişte kesilsin:** Ses `onLanding` anında 40–60 ms içinde kısılsın, son bulut "tak" ile birlikte dağılsın. İnişin net olarak "kapanış" sesi tak olmalı.
- **Çoklu atlama:** 2+ kulede iz kesik değil sürekli olsun. `+N` ile aynı karede ses sonu bir "tıng" ile birleşsin; yeni bir katman eklenmesin.
- **Tam şarj:** Ceket açılma anına bağlı daha uzun ve tok bir "pırrrt" olsun. Ayrı bir efekt eklenmesin, mevcut puf anı kullanılsın.
- **Tekrar yorgunluğu:** 5–6 örnekten oluşan bir havuz kurulsun ve aynı örnek art arda çalmasın. Perde ±%8 rastgele olsun. Ses düzeyi diğer seslerin altında kalsın. Yaklaşık 1/40 olasılıkla bir "efsane" osuruk çalsın (uzun, ritimli). Bu yalnız 3+ kule atlamada mümkün olsun ki ödülle eşleşsin. Düşüş ıslığı ve rekor vapur düdüğü ile aynı anda çalmasın; öncelik onlarda kalsın.

## 3. Açma/kapama
Ayrı bir "Gaz Modu" önerilir; ana ayara gömülmesin. Varsayılan **kapalı** olsun. Ana ekranda ya da Game Over kartında küçük bir düğme yer alsın. İlk 10 turdan sonra (ya da ilk rekordan sonra) "Gaz Modu açıldı" diye bir kez tanıtılsın. Bu, keşif ödülü gibi çalışır ve şakayı zorlamaz. Sesten bağımsız olarak "yalnız görsel iz" seçeneği de olsun; sessize alınmış telefonlarda da çalışır. Şu an `SFX_ON` derleme sabiti, ayar ekranı yok. Bu nedenle kalıcı bir ayar (AsyncStorage) gerekecek.

## 4. Karar
**Şu koşulla yap:** Varsayılan kapalı, opsiyonel "Gaz Modu" olsun. Varyasyon havuzu ve şarja bağlı ölçek zorunlu. İz geriye dönük ve kısa ömürlü olsun. Fizik, kamera ve isabet kutuları değişmesin. Tek bir sabit ses ve kalıcı bir iz çizgisiyle **yapılmasın**.

**Telefonda başarı ölçütleri:**
1. 3 dakikalık kesintisiz oturumda (≈120 zıplama) art arda aynı ses duyulmuyor ve kullanıcı sesi kısmak istemiyor.
2. Uçuşun hiçbir karesinde bulut karakterin önünde değil; yeni oyuncu izi nişan için kullanamıyor.
3. İniş karesinde ses ve iz aynı karede kesiliyor; "tak" net duyuluyor.
4. Kısa, orta, tam şarj ve 3+ kule atlamalarında bulut ve ses büyüklüğü gözle ve kulakla ayırt edilebiliyor.
5. 60 fps korunuyor: bulut sayısı üst sınırlı (≤12 eş zamanlı), takılma raporu (R0xx kare bütçesi) değişmiyor.
6. Mod kapalıyken oyun bit bit aynı davranıyor.
