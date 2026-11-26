# Editör görüşü (pazar araştırması) — türün kanıtlanmış mekanikleri ve Byzantion'da eksik olanlar

Tarih: 2026-11-26. Kaynaklar en altta. "doğrulanmadı" yazan rakamları birincil kaynakta bulamadım.

## 1. Türün en çok oynananları (kısa döküm)

| Oyun | Popülerlik | Çekirdek döngü / iniş tatmini | Geri getiren |
|---|---|---|---|
| WeChat Jump Jump (跳一跳) | ~100 milyon günlük aktif oyuncu, iki haftada [SCMP]; Bahar Bayramı'nda 28 milyon eşzamanlı oyuncu; 1. gün tutma %65, 1. hafta %52 [Niko/GameDeveloper] | Basılı tut, bırak, zıpla (Byzantion'un birebir atası). **Ortaya iniş serisi: +2, +4, +6… her ardışık orta inişte artar, kaçınca sıfırlanır.** **Bekleme sürprizleri:** özel bloklarda ~2 sn durunca rögar kapağı +5, küp +10, bakkal kapısı açılır +15, gramofon müzik çalar +30 [ifanr, jiemian] | WeChat arkadaş sıralaması; Bahar Bayramı'nda tek telefonda aileyle sırayla oynama modu [ifanr MINA] |
| Stick Hero (Ketchapp) | İndirme sayısı doğrulanmadı (yüz milyonlarda olduğu tahmin) | Basılı tut, çubuk uzasın, bırak. Çubuk tam kırmızı orta noktaya düşerse "PERFECT" ve ekstra puan | Kiraz biriktirip karakter açma |
| Stack (Ketchapp) | Doğrulanmadı | Kesintisiz kusursuz yerleştirme serisi; bir üçüncü taraf rehberine göre 8 kusursuzda blok genişliği geri büyüyor (doğrulanmadı) | Rekor, renk temaları |
| Helix Jump (Voodoo) | 167 milyon+ (üçüncü taraf, tahmin) | Art arda 3+ kat düşünce "ateş topu": bir sonraki çarpışma ölümcül değil, katı kırar | Seviye numarası, toplar/temalar |
| Crossy Road | 250 milyon+ indirme [geliştirici basın sayfası] | Tek dokunuş adım; ölümler komik | **Toplanabilir maskotlar** (oynayarak kazanılan altınla ödül makinesi, görevler); 200 milyon kütük topluluk etkinliği [TouchArcade] |
| Flappy Bird | 50 milyon (2014, geliştirici beyanı) [iPhoneInCanada] | Acımasız zorluk, anında yeniden başlama | Arkadaşa rekor gösterme |
| Doodle Jump | 10 milyon ücretli satış, Aralık 2011 [Wikipedia] | Eğim + otomatik zıplama, yükseldikçe yeni düşman/platform | Temalı haritalar (Noel, Cadılar Bayramı) |
| Alto's Adventure/Odyssey | Doğrulanmadı | Akış + gösteriş hareketleri | **180 el yapımı hedef, seviye başına 3 hedef**; Zen modu (skorsuz, ölümsüz) [App Store] |
| Subway Surfers | 4 milyar+ indirme (2023) [SYBO] | Kaçış koşusu | 3-4 haftada bir şehir değişen "World Tour", günlük harf avı, sezon avı [Wikipedia] |
| Mr Jump | İlk hafta 5 milyon [PocketGamer] | Tek tuş, çok zor | Zorluk şikâyetine karşı bölümleri üçe bölen kolay sürüm Mr Jump S çıkarıldı [Gamezebo] |

**Türkiye:** Sensor Tower'ın Türkiye çeyrek listelerinde gündeme bağlı yerel oyunlar (ör. "Yerel Seçim Oyunu 2024", Nisan 2024'te haftada ~26 bin indirme) kısa ama sert yükseliş gösteriyor. Yerel tema ve zamanlama işe yarıyor; bu Byzantion'un "özel günler" kararını destekliyor.

**İlk dakika:** Jump Jump, Stick Hero ve Flappy'de neredeyse hiç metin yok; mekanik ilk denemede öğreniliyor. **Şikâyetler:** Stick Hero yorumlarında reklam sıklığı öne çıkıyor; Mr Jump'ta zorluk o kadar şikâyet aldı ki kolay sürüm yapıldı. App Store yorumlarını sistemli tarayamadım; bu kısım sınırlı. Byzantion'da reklam ve kazanmak-için-öde yok, bu kendi başına bir avantaj.

## 2. Türde kanıtlanmış ama Byzantion'da olmayan mekanikler

Kodda kontrol ettim: `perfectTolerance` ile orta iniş zaten algılanıyor. Ama etkin yapılandırmada `scorePerfectBonus: 0` (`src/game/config.ts`). Yani orta inişin puan karşılığı yok; şu an yalnız ses, titreşim ve iç ses tepkisi veriyor.

**A. Katlanan "tam orta" serisi (Jump Jump'tan)**
- *Neden işe yarar:* Türün en güçlü el hissi döngüsü bu. Hayatta kalmanın yanına ikinci bir hedef ekliyor ("ortayı tuttur") ve riski oyuncu kendi seçiyor. Jump Jump'ın 1. gün %65 tutmasının ana dayanağı bu döngü.
- *İstanbul uyarlaması:* Seri büyüdükçe sayının yanında "Tam isabet! ×2 → ×3", her basamakta bir çatı sesi (çay kaşığı tıkırtısı → vapur düdüğü). Seri kopunca amca "eh…" der.
- *Efor:* Yalnız kod (puan formülü + HUD yazısı). **0 görsel.**
- *Fizik/kamera/çarpışma:* Değişmez. Yalnız skor değişir, bu yüzden Game Center rekorları eskilerle kıyaslanamaz hale gelir. Yeni tablo açmak gerekebilir. "İniş seri ödülü" önceki raporlarda önerilmişti. Bu öneri onun **puanlı, katlanan** biçimi.

**B. Bekleme sürprizi kuleleri (Jump Jump'tan)**
- *Neden işe yarar:* Oyuncuyu bir an durmaya, keşfetmeye ve konuşmaya iter ("laternanın üstünde bekle!"). Sosyal yayılmayı besleyen sır bu.
- *Uyarlama:* Ara sıra çıkan özel çatılar: **laterna** (2 sn bekle, çalar, +30), **simitçi tablası** (martılar iner, +10), **kahveci cumbası** (fincan buharı, +15). Kediler kalsın, onlar defter içindir.
- *Efor:* Kod (iniş sonrası süre sayacı + ses) + **3 görsel** (her özel çatı üstü için 1). Animasyon, mevcut görselin üzerine basit kare değişimiyle yapılabilir.
- *Fizik:* Değişmez, kule ölçüleri aynı kalırsa. Yalnız kule görünüm çeşidi (`column-variant`) eklenir.

**C. Hedef listesi / "Muhtarın üç işi" (Alto, Subway Surfers)**
- *Neden işe yarar:* Rekor kırılamayan günlerde de oturumu anlamlı kılar. Alto'nun 180 hedefi tam bu iş için var.
- *Uyarlama:* Ekranda her an 3 iş: "Üst üste 3 tam orta", "Galata'yı geç", "Bir koşuda 2 kediyle tanış", "Laternayı çal". Üçü bitince rütbe atlanır: Çırak → Kalfa → Usta → Mahalle Ağası. Kullanıcı günlük haritayı "tekrara düşüyor" diye kapattı; bu yüzden işler **günlük değil, bitince yenilenen** sırada olsun.
- *Efor:* Yalnız kod. Rütbe rozeti için **0–1 görsel**.
- *Fizik:* Değişmez.

**D. Oynayarak kazanılan baş aksesuarları (Crossy Road maskotlarının hafif hali)**
- *Neden işe yarar:* Toplama, rekordan bağımsız bir "yarın yine gel" sebebi. Kıyafet *satışı* önceki raporlarda önerildi; bu öneri satış değil, ödül.
- *Uyarlama:* Rütbe ya da durak ödülü olarak kasket, fes, balıkçı şapkası, vapur kaptanı şapkası, Fenerbahçe/Galatasaray renginde atkı yerine tarafsız bir bere. Mevcut "özel gün başlığı" katmanı yeniden kullanılır.
- *Efor:* Kod az. **Aksesuar başına 1 görsel** (pozlar arasında başa oturuyorsa; oturmuyorsa poz başına ayrı görsel gerekir, önce bir tanesiyle denenmeli). İlk set için 4 görsel.
- *Fizik:* Değişmez.

**E. Rahat mod / duraktan başla (Alto Zen, Mr Jump S)**
- *Neden işe yarar:* Türün en büyük şikâyeti "çok zor, hep baştan". Mr Jump bu şikâyet üzerine kolay sürüm çıkardı. Byzantion'un 12 durağını görmek için oyuncunun Kadıköy'den başlaması gerekiyor. Bu, kartpostal albümünü çoğu oyuncuya kapalı tutar.
- *Uyarlama:* "Gezinti" modu: açılmış bir duraktan başla. Skor tabloya yazılmaz, kartpostal ve kedi sayılır (ya da yalnız ana modda sayılır, karar ürünün).
- *Efor:* Yalnız kod, 0 görsel.
- *Fizik:* Zıplama aynı kalır. Ancak **kule üretimi bir başlangıç ofsetiyle çağrılır**, yani `procedural-course` dokunuşu olur. Bunun için ayrı kullanıcı onayı gerekir.

**F. Sırayla oyna, tek telefon (Jump Jump bayram modu)**
- *Neden işe yarar:* Bayram ve aile ortamında telefonu elden ele geçirmek, Türk oyuncu için doğal bir durum. Jump Jump bunu tam Bahar Bayramı'na denk getirdi.
- *Uyarlama:* "Bayram sofrası" modu: 2–4 isim girilir, her koşudan sonra "Sıra Ayşe teyzede", sonunda bir kürsü kartı. Özel günler takvimiyle (Ramazan/Kurban Bayramı, yılbaşı) menüde öne çıkar.
- *Efor:* Yalnız kod. Var olan paylaşım kartpostalı yeniden kullanılır. **0 görsel.**
- *Fizik:* Değişmez.

**G. Dönemsel güzergâh teması (Subway World Tour, Doodle Jump temaları)**
- Byzantion'un gerçek mevsim ve özel gün sistemi bunun çoğunu karşılıyor. Eksik olan, "bu ay Boğaz yerine Haliç hattı" gibi **yeni güzergâh**. Durak başına kartpostal ve siluet gerektiği için pahalı (**hat başına ~12+ görsel**, tahmin). Şimdilik ertelenmeli.

**Bilerek önermediklerim:**
- Helix ateş topu ve Stack'in kule büyütmesi: çarpışmayı ya da kule genişliğini değiştirir. Kurukafa bunu zaten kısmen yapıyor.
- İlk kuleleri kolaylaştırmak: kule üretimine dokunur, onay gerekir.
- Reklamla "devam et": reklam yok kuralına aykırı. Ücretli devam ise kazanmak-için-öde olur.

## Öncelik önerisi
1. A (tam orta serisi): en yüksek etki, sıfır görsel.
2. C (üç iş + rütbe).
3. B (bekleme sürprizleri, 3 görsel).
4. F (bayram modu).
5. D (aksesuarlar, 4 görsel).
6. E (onay gerekir).

## Kaynaklar
- SCMP, Jump Jump 100 milyon günlük aktif oyuncu: https://www.scmp.com/tech/china-tech/article/2128364/tencent-gets-china-hopping-wechats-jump-jump-game-goes-viral
- Niko Partners, tutma oranları: https://nikopartners.com/tencent-targets-casual-mobile-gamers-with-wechat-mini-games/
- ifanr, bekleme bonusları ve sürprizler: https://www.ifanr.com/963666 · çok kişilik mod: https://www.ifanr.com/minapp/983006
- Jiemian, orta iniş +2/+4/+6: https://m.jiemian.com/article/1851687.html
- Sixth Tone, sponsorlu bloklar: https://www.sixthtone.com/news/1001920
- Crossy Road basın sayfası: https://crossyroad.com/press · TouchArcade, 200 milyon etkinliği: https://toucharcade.com/2018/08/24/crossy-road-hits-200-million-downloads-celebrates-by-challenging-players-to-unlock-a-limited-edition-chicken/ · Crossy Road Wiki: https://crossyroad.fandom.com/wiki/Crossy_Road
- SYBO, 4 milyar indirme: https://sybogames.com/press/4-billion-downloads · Wikipedia, Subway Surfers: https://en.wikipedia.org/wiki/Subway_Surfers
- Flappy Bird 50 milyon: https://www.iphoneincanada.ca/2014/02/06/flappy-bird-50-million/
- Wikipedia, Doodle Jump: https://en.wikipedia.org/wiki/Doodle_Jump
- Alto's Adventure, App Store: https://apps.apple.com/pl/app/id950812012
- PocketGamer, Mr Jump 5 milyon: https://www.pocketgamer.com/mr-jump/brutal-one-button-platformer-mr-jump-racks-up-5-million-downloads-in-a-week · Gamezebo, Mr Jump S: https://www.gamezebo.com/game/mr-jump
- Helix Jump indirme (üçüncü taraf): https://mwm.ai/apps/helix-jump/1345968745 · Stack serisi (üçüncü taraf): https://dinogame.gg/blog/mastering-stack/
- Stick Hero, App Store: https://apps.apple.com/app/918338898
- Sensor Tower Türkiye 2024 2. çeyrek: https://sensortower.com/blog/2024-q2-ios-top-5-hypercasual%20games-units-tr-643acc7de1714cfff1e77c54
