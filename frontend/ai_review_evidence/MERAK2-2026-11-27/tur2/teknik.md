# MERAK2 · Tur 2 · Teknik editör: birleşik tasarım

Yedi dosyanın altısı (oyun 2, anlati 1-2, oyuncu 1-2, kivilcim 1, arda 2-3, ada 3) aynı yere çıkıyor: deniz ve onun
hareketli yüzeyleri. Motor bunu en ucuz biçimde zaten taşıyor (tur1/teknik.md A1-A8). Birleşik tasarım bu yüzden denizde.

## 1. Birleşik tasarım: "SİMİT MARTISI: Boğaz Seferi"
**An an (ilk koşudan itibaren):**
- **Tetik (anlati 1, oyuncu 7):** İlk koşuda 4. kulenin ardından, yayın tepesinde bir simit süzülüyor (bu ilk sefer
  garantili). Sonra koşu başına en fazla bir kez çıkıyor, rastgele ve kurukafa kuralıyla: biri sürerken öteki çıkmaz.
- **Işınlanmanın örtüsü (anlati 1):** Amca simidi kapıyor, bir martı dalıp amcayı simitle birlikte kaldırıyor. 1,2 sn,
  dokunuşla geçilebilir, amca "Bırak simidimi!" diyor. Perde yok: bu taşınma, dünya değişimini örten şey.
- **Parkur A, dev gemi (oyuncu 1, anlati 1):** Martı amcayı bir konteyner gemisinin kıçına bırakıyor. Konteyner yığınları
  ev boyunda, kıyı ters yöne kayıyor. Bu 4 iniş durağan; ölçek şoku burada yaşanıyor.
- **Parkur B, dalga izi (oyun 2, ada 3, arda 3, benim 1):** Pruvadan sonra 3-4 hedef var: yana kayan vapur güverteleri ve
  inip kalkan şamandıralar. İlk kez "ne kadar" yerine "ne zaman" sorusu soruluyor.
- **Dönüş:** Son vapur iskeleye yanaşıyor ve amca ayrıldığı kulenin bir sonrakine iniyor. Ana parkurdan kule atlanmıyor.
- **Düşmek (oyuncu):** Bölümde düşmek cezasız. "Şıp" sesi geliyor, amca ıslak saçla ana parkurda beliriyor, ölmüyor.
- **Ödül (oyuncu):** Bölümde her iniş ×2 sayılıyor. Dönüşte "Kadıköy → bir gemi → Arnavutköy" yazan bir an kartı
  çıkıyor (ShareCard). "Gördüğün yerler" albümü sonraki adım (anlati 6'daki değişen bırakma yerleri).
- **Ses ve söz (anlati 7):** Amcanın her ana tek satırı var: "Ben bu yaşta konteynere mi binecektim?"

**Neden farklı hissettirir:** Zemin, ölçek ve zamanlama değişiyor; parmak aynı kalıyor.
**Merak ve paylaşma:** Paylaşılan cümle "martı amcayı kaptı". Sonra "bir dahakine nereye bırakacak?" merakı geliyor.
**Kontrol aynı:** `jump.ts` ve `advanceFlight` hiç değişmiyor. Kalkışta platform hızı zıplamaya EKLENMİYOR.

## 2. Uygulanabilirlik: çekirdeğe dokunduğu yerler (dosya:satır)
| # | Nerede | Ne | Çekirdek? |
|---|---|---|---|
| 1 | `app/index.tsx:1835-1907` (initWorld) | `teleportTo(ilkYüzey)` worklet'ine ayrılır. Skor, `lastLandedId` (1889) ve hava sıfırlanmaz. Martı tween'inin sonunda çağrılır, dönüşte bir kez daha | evet (dünya kurulumu) |
| 2 | `app/index.tsx:3007` (uçuş) | Martıyla taşınma için yeni `PHASE.CARRIED`; dokunma kilidi `doorLock` desenini (3146) kullanır | evet (durum makinesi) |
| 3 | yeni `src/game/deniz.ts` | Gemi/dalga üreticisi. `procedural-course.ts:49`'a DOKUNMAZ (136. satırdaki "byte-identical" sözü korunur), erişim formülünü (124-131) kopyalamaz, `jumpVelocity`/`flightGravity`'yi çağırır | hayır |
| 4 | `app/index.tsx:3056-3059` | `movedPlatforms(list, seaT)` (kurukafa `scaledPlatforms` deseni). **`p` etkin listeden okunmalı**: 3059, 3069 ve 3123 şu an ölçeksiz listeden okuyor | evet (iniş) |
| 5 | `app/index.tsx:3203` (DÜŞÜŞ) | Aynı etkin liste; yoksa çırpınma yanlış yerde başlar | evet (küçük) |
| 6 | ayakta dururken | IDLE/CHARGING'de `px += dx(seaT)`; `baseY` şamandırayla birlikte güncellenir | evet |
| 7 | `app/index.tsx:3214` → `onGameOver` 2140 | Bölümdeyken ölüm yerine `teleportTo(dönüş)` | evet (oyun sonu kuralı) |
| 8 | `app/index.tsx:1927` onLanding | ×2 puan ve an kartı. Durak/köprü id'ye bağlı (`stops.ts:43,82`): bölüm id'leri iki durak arasına sığmalı (kurukafa `kurukafa.ts:46` gibi) | evet (puan) |
| 9 | `src/game/yaris.ts` EV_LAND | Hayalet yeniden oynatma ışınlanmayı bilmiyor. İlk sürümde yarış ve meydan okuma sırasında simit çıkmaz | hayır (kapı) |
| 10 | slotlar `app/index.tsx:742`, 5416+ | `kind` alanına göre çatı yerine konteyner/vapur çizilir. Konum `seaT`'den hesaplanır, liste her kare YAZILMAZ (REVIZYON-060) | hayır (çizim) |
| 11 | kamera | DEĞİŞMEZ. X yalnız ileri gidiyor (3283), Y sabit (1906). Gemi zemini mevcut `platformMinTopY/MaxTopY` (`config.ts:77-78`) bandında kalır | hayır |

**Erişilebilirlik kanıtı:** Hareketli hedefin genliği `amp ≤ (erişim payı)/2` olmalı (`config.ts:65` reachReserve). Böylece
en kötü fazda bile tam şarj yetişir. Bu, şamandıranın topY'sinin kare başına birkaç birimden fazla oynamamasıyla birlikte
çevrimdışı sim betiğiyle kanıtlanır (physics-evidence). Süpürmeli test (`landing.ts:17`) tek karenin topY'sine bakıyor.
**İş yükü:** Kod 4-5 gün. Kıvılcım 4 çağrı (konteyner seti, gemi gövdesi/pruva, vapur güvertesi, martı taşıma pozu),
her biri ayrı onaylı.

## 3. En küçük deneme (2 gün, görsel 0, `DENIZ_TEST` bayrağı)
1. Simit yerine mavi tonlu kurukafa görseli, 4. kuleden sonra her zaman çıkıyor. Taşınma: 1,2 sn'lik düz bir tween.
2. Bunun ardından `teleportTo`: 4 durağan dikdörtgen "konteyner" ve 3 yana kayan dikdörtgen "vapur". Sonra dönüş.
3. Düşünce ölüm yok, ana parkura dönülüyor. Bu sürümde ×2 puan ve kart yok.
4. Kanıt: sim betiği (erişim ve kenar) + simülatör kaydı. Telefonda arkadaşlara tek soru: "Simitten sonra ne oldu?"

## 4. Oy (kendi fikrim hariç)
- anlati — Simit Martısı → Dev Gemi — **3** — Işınlanmaya İstanbul'dan bir sebep veriyor ve perdesiz bir örtü sunuyor; teknik olarak liste değişimini tam saklıyor.
- oyun — Balıkçı kayıkları (inip kalkan yüzeyler) — **2** — "Ne zaman" katmanını kontrolü değiştirmeden ekleyen en net tarif; genlik ve en kötü faz kanıtı bile düşünülmüş.
- oyuncu — İlk 30 saniye kancası — **1** — Testçi verisine dayanıyor ve tek kez açıp bırakan oyuncuyu yakalayan tek öneri bu; maliyeti bir tetik kuralı kadar.

## 5. Veto/uyarı: uçuşun ortasında yörüngeyi değiştiren her şey
Lodos itmesi (oyun 6), martı hızını kalkışa eklemek ve Tek Zıplama'da şarj sınırını aşmak (oyuncu 5) "zıplama
mekaniğini bozmadan" çizgisini geçiyor. Aynı basış artık aynı yere düşürmüyor. Buna ek olarak meydan okuma eşitliği ve
`procedural-course.ts:124-131` erişim garantisi bozuluyor. Yüzey hareket edebilir, yörünge asla.
İkinci uyarı: kamerayı dikeyde oynatan fikirler (arda 1, kivilcim'in "kamera alçalsın"ı, sarnıçta tavan için
sabitleme) REVIZYON-044…059'da aylarca uğraşılıp sabitlenen Y kamerasını yeniden açıyor. İlk sürüme girmemeli.
