# FARK-2026-11-12 — Oyun tasarımı editörü görüşü

Bakılan kod: `src/game/jump.ts` (şarj `min(1, tutma/maxChargeDuration)`, bırakınca yörünge kesin), `config.ts` (`scorePerfectBonus: 0`), `stops.ts` (duraklar 15/30/45/60). Kendi önceki raporlarım: YAPI-, YOL-2026-11-12.

## 1. Bugün bizi klondan ne ayırıyor, ne ayırmıyor
**Ayıranlar:**
- **Kimlik:** amca, gaz sesi ve bulutu, şarjdaki yüz ifadesi, İstanbul çatıları. Güçlü ama hepsi *kaplama*. Ekran görüntüsünde fark edilir, elde fark edilmez.
- **Gerçek bir mekanik fark var:** yandan görünümde birkaç kuleyi tek zıplamada aşmak ("+N"). Jump Jump'ta her zıplama bir sonraki bloğa gider. Bu iyi, ama oyuncu bunu kendisi seçmiyor, kule dizilimi dayatıyor.

**Ayırmayanlar (dürüst):**
- Çekirdek döngü birebir aynı: basılı tut, bırak, kader belli, düş, baştan başla. Bıraktıktan sonra oyuncunun yapacağı hiçbir şey yok.
- Beceri ödülü Jump Jump'tan bile zayıf. Orada merkez serisi asıl ustalık katmanı, bizde merkez 0 puan.
- Duraklar, kartpostal ve gece seferi ancak 15. kuleden sonra görünüyor. Oyuncuların çoğu oraya varmıyor, yani farkın büyük kısmı **görülmüyor**.

**Sonuç:** Fark ilk 30 saniyede ve elde hissedilmeli. Yeni bir meta katmanı (durak, albüm) bu sorunu çözmez.

## 2. İmza özellik
### ANA FİKİR: "Son Çare Gazı" — *"Uçarken bir kez dokun: amca gaz kaçırıp havada son bir itiş alır. Gaz ise merkeze inişle dolar."*
- **Oyuncu ne yapar:** Zıplamalar bugünkü gibi. Uçuşta bir kez dokunursa küçük bir ileri+yukarı itiş alır, gaz bulutu ve ses büyür. Haznede en fazla 2 "gaz" olur. Tura 1 gazla başlanır, her merkez inişi +1 gaz verir. Her uçuşta en fazla bir kez kullanılır.
- **Neden tekrar oynar:** Bırakma artık "kader" değil, son saniyede kurtarma şansı var. Bu kurtarmalar en komik ve en çok anlatılan anlar olur ("kıçından kurtuldu"). Merkez inişi puan vermeden anlam kazanır: gaz biriktirmek demek. Erken ölümleri azaltır, böylece duraklar görülür. Kademeli çoklu kule atlayışlarını *bilerek* denemeyi açar ("2 gazım var, 3 kuleyi deneyeyim").
- **Neden bizden başkası yapamaz:** Gaz zaten oyunun mizahı. Burada şaka mekaniğin kendisi oluyor. Jump Jump ve Stick Hero'da bırakış geri dönüşsüz, bizde amcanın "son çaresi" var. Oyun tek cümlede şöyle anlatılır: "osurarak kurtulan amca".
- **Boyut:** orta. **Görsel/kredi:** yok. Mevcut bulut büyütülür, sesin perdesi ve gücü değişir, hazne göstergesi kodla çizilmiş iki küçük bulut olur.
- **Fiziğe dokunur mu: EVET (açıkça).** Uçuşa tek bir hız darbesi eklenir. Şarj formülü, açı, yerçekimi ve kamera değişmez.
- **Risk:** Darbe güçlüyse hassasiyet önemsizleşir, oyun kolaylaşır. Bu yüzden darbe küçük olmalı (yaklaşık yarım kule boyu) ve hazne sınırlı kalmalı. Ayrıca uçuşta yapılan dokunuş bir sonraki şarjı başlatmamalı, dokunuş "tüketilmeli". Rekor tablosu kirlenir, bu yüzden yeni rekor anahtarı (`.v2`) açılır.

### YEDEK 1: "Patlama Eşiği" (fizik yok, yalnız giriş kuralı)
- %100 şarjda yüz "patlamak üzere" konumuna geçer. Bu noktadan sonra **~0,6 sn** daha tutarsan amca "kaçırır" ve tam güçle kendiliğinden fırlar (çoğunlukla ıska). Eşiğin son anında bırakırsan "Son anda!" yazısı ve +1 puan gelir.
- Mevcut yüz ifadeleri oyunun göstergesine dönüşür, cesaret ve aç gözlülük üzerine kısa bir gerilim oluşur. Küçük iş, görsel gerekmez. Risk: yalnız uzak kulelerde anlamlı olur, etkisi sınırlı kalabilir.

### YEDEK 2: "Vapur Kulesi" (fizik ve kamera riski)
- İskele duraklarında kıyıya yanaşıp ayrılan vapur çatısı, yani hareketli platform. İstanbul'a çok özgü, ama **görsel ister (onay ve kredi)**, iniş ve kamera mantığını değiştirir, oyuncuların çoğu iskeleye varmadığı için de geç görünür. Ana fikir tutarsa sonraya bırakılmalı.

## 3. En ucuz prototip (1–2 gün, telefonda)
1. `config.ts`'e `SON_CARE_GAZI` bayrağı eklenir (kapalıyken bugünkü oyun aynen çalışır). Uçuştayken gelen `onPressIn` olayında gaz varsa ve bu uçuşta kullanılmadıysa: `vx += ~90`, `vy -= ~350` (ölçekli), gaz −1, mevcut osuruk sesi daha yüksek ve bulut ×2 çalınır. Bu dokunuş şarj başlatmaz.
2. Hazne: tur başında 1. Mevcut merkez toleransıyla merkez inişinde +1, en fazla 2. Göstergesi skorun yanında 2 küçük daire olur.
3. Darbe değerleri `sim_sequential.cjs` ile bir kez ölçülür: "ıska kaç pikselden kurtarılabiliyor?" Hedef, yarım kule kadar kurtarma.
4. Test: sen ve 2–3 kişi, bayrak kapalı 10 tur, açık 10 tur. Ölçülecekler: 15. kuleye varan tur oranı, tur başına gaz kullanımı, kurtarma sayısı ve "kendiliğinden güldü mü / anlattı mı". Kural basit: açık sürümde 15'e varma oranı artmazsa ya da oyuncular gazı hiç kullanmazsa fikir değiştirilir.
5. Yedek 1 aynı dalda yarım günde, ayrı bayrakla denenebilir. İkisi aynı anda açılmamalı.

## 4. Yapılmaması gerekenler
1. **İmza özelliği meta katmanına koymak** (yeni durak, albüm, kozmetik, kostüm). Oyuncular 15. kuleyi görmüyor. Fark elde ve ilk 30 saniyede olmalı.
2. **Gazı sınırsız çift zıplamaya ya da çok tuşlu kontrole çevirmek** (yön seçme, uzun ve kısa havada dokunuş gibi). Tek dokunuş kimliği ve şarjın hassasiyeti ölür, oyun bir "platform oyunu"na dönüşür. Kural sabit kalmalı: uçuş başına 1 kullanım, en fazla 2 gaz.

## 5. Kullanıcıya sorulacak kararlar
1. **Fiziğe dokunan "havada gaz itişi" bayraklı olarak ana modda denensin mi?** (Hayır derse yedek 1, yani fiziksiz Patlama Eşiği denenir.)
2. **Gaz nereden gelsin: merkez inişiyle mi dolsun, yoksa her turda sabit 1 hak mı olsun?** (Merkez inişi beceri eksenini açar ama ilk turlarda gaz azdır. Sabit hak daha basittir ama ustalık katmanı oluşmaz.)
