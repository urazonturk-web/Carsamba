# Byzantion — Merak Raporu 2: "MARTI KAPTI!" (2026-11-27)

**Nasıl çalıştık:** Kullanıcı ilk öneriyi ("Kayıp Sefer": yalnız görünüş değiştiren sahne) beğenmedi. Yedi editör iki turda birlikte çalıştı:
- Codex: Kıvılcım, Arda, Ada.
- Claude: oyun tasarımı, anlatı ve dünya, teknik, oyuncu ve paylaşım.

Önceki yön (jeton, sepya, yalnız arka plan değişimi) yasaktı.
1. **1. tur:** Herkes birbirini görmeden en az 6 fikir yazdı; toplam ~50 fikir çıktı (`tur1/`).
2. **2. tur:** Herkes yedi dosyanın hepsini okudu, tek bir birleşik tasarım kurdu ve başkalarının fikirlerine 3-2-1 oy verdi (`tur2/`).

Kod değişmedi, görsel üretilmedi.

## 1. Sonuç: yedi editörden beşi aynı tasarımda birleşti
| Editör | 2. turdaki birleşik tasarımı |
|---|---|
| Anlatı | **Martı Kaptı!** Simit → martı → dev gemi, ileride sarnıç |
| Oyuncu | **Martı Kaptı.** Gemi; sonra sarnıç, köprü, kayıklar |
| Oyun tasarımı | **Martı Nereye Bıraktı?** Gemi + inip kalkan kayıklar |
| Teknik | **Simit Martısı: Boğaz Seferi.** Gemi + kayan vapur, şamandıralar |
| Ada | **Simit Martısının Deniz Seferi.** Gemi + yavaş şamandıralar + iskele |
| Kıvılcım | **Martının Açtığı Su Yolu.** Martı → gemi → bakım kapağından şehrin altındaki su yoluna |
| Arda | **Kapağın Altındaki İstanbul.** Paslı anahtar → yer altı su tüneli, alçak kemer |

Yedi editörün altısı **simit martısıyla** başlıyor. İkisi (Kıvılcım ve Arda) asıl yeri **yer altı** yapıyor; diğerleri yer altını ikinci varış noktası olarak bırakıyor.

## 2. Oylar (başkalarının 1. tur fikirlerine; kimse kendine oy vermedi)
| Fikir (sahibi) | Puan | Kimden |
|---|---|---|
| **Sarnıç**: tavanlı yer altı parkuru (oyun) | **10** | Beş editör, hepsi 2 puan |
| **Simit Martısı → Dev Gemi** (anlatı) | **9** | Üç editörün 1 numarası (3+3+3) |
| Dev Gemi + ilk 30 saniye kancası (oyuncu) | 6 | anlatı 3, teknik 1, oyun 1, Arda 1 |
| Deniz Seferi: hareketli vapur ve şamandıralar (teknik) | 6 | Ada 3, oyun 2, anlatı 1 |
| Şehrin altındaki su yolu (Ada) | 4 | Arda 3, Kıvılcım 1 |
| Tek Zıplama (oyuncu) | 3 | Kıvılcım 3 |
| Balıkçı kayıkları (oyun) | 2 | teknik 2 |
| Mahallenin içinden geçen sıçrayış (Arda) | 1 | Ada 1 |

Okuma: **Martı + gemi**, en çok birinci tercih alan fikir. **Yer altı** ise herkesin ikinci tercihi. İkisi birbirini tamamlıyor: martı amcayı taşıyan kanca, gemi ve yer altı da varılan yerler.

## 3. Ortak tasarım: "MARTI KAPTI!"

### Oyuncu ne yaşar?
1. **İlk koşu, ~4. kule (yaklaşık 20. saniye, garantili):** Havada süzülen bir simit belirir. Amca zıplarken simide değer ve bir martı simitle birlikte amcayı da kapar. Amca: "Bırak simidimi!" Bu, tek bakışta anlaşılan, İstanbul'a özgü bir an.
2. **Martı amcayı Boğaz'dan geçen dev bir konteyner gemisine bırakır.** Ölçek şoku yaşanır: çatılar yerine kocaman, rengârenk konteyner yığınları. Kıyı arkada ters yöne kayar, çünkü gemi gidiyor. Amca: "Ben bu yaşta gemiye mi binecektim?"
3. **Gerçekten başka bir parkur.** Önce geniş konteynerler, sonra gemiden kıyıya doğru yavaşça inip kalkan birkaç şamandıra ya da kayık. Oyuncu artık yalnız "ne kadar basayım" diye değil, "ne zaman bırakayım" diye de düşünür. Kontrol aynıdır, hissedilen şey değişir.
4. **6–8 iniş sonra** kıyı iskelesine ulaşılır ve çatı rotasına dönülür. Ekranda "Martının bıraktığı yerler 1/5" kartı çıkar; görülmemiş yerler soru işaretli silüetler olarak durur.
5. **Sonraki koşularda** simit seyrek çıkar (koşu başına en fazla 1) ve martı her seferinde başka yere bırakabilir:
   - **Sarnıç / su yolu:** yer altı, alçak kemer, kısa ve ölçülü zıplamalar.
   - **Köprü trafiği:** otobüs ve dolmuş tavanları.
   - **Balıkçı kayıkları.**
   - Albümdeki boş yerler "orası neresi?" merakını sürdürür.

### Neden bu sefer farklı?
Önceki öneride yalnız arka plan değişiyordu. Bu sefer:
- Amca **gerçekten başka yüzeylere** iniyor: konteyner, şamandıra, kemer.
- **Taşınmanın kendisi** bir olay: martı onu kapıp götürüyor.
- Bazı bölümler **yeni bir zamanlama** istiyor: hareketli hedef ya da alçak tavan.
- İlk koşunun 20. saniyesinde oluyor; oyunu tek kez açan oyuncu da görüyor.

### Değişmeyenler
- Basılı tut–bırak–yay–iniş ve zıplama fiziği (`jump.ts`).
- Kamera: dikey kamera yok. REVIZYON-044…059'da sabitlenen Y kamerası yeniden açılmıyor.
- Ana parkurun kule üretimi (`procedural-course.ts`). Gemi bölümü ayrı bir dosyada (`src/game/deniz.ts`) üretilir.
- **Teknik editörün kuralı:** "Yüzey hareket edebilir, yörünge asla." Lodos itmesi ya da uçuşta hız ekleme yok.

## 4. Çekirdeğe dokunan noktalar (her biri ayrı onay ister)
Teknik editörün tespiti (`tur2/teknik.md`, dosya:satır tablosu):
1. **Gerçek ışınlanma:** Dünya kurma bloğu (`app/index.tsx` ~1835–1907) `teleportTo` olarak ayrılır. Taşınma için yeni bir "martıda" durumu eklenir (dokunma kilidi, pijama kapısındaki gibi).
2. **İniş testi:** İniş anında yüzey bilgisi, hareketli yüzey için o anki konumdan okunmalı (`index.tsx` ~3059, 3069, 3123, düşüş kontrolü ~3203). Bugün bu bilgi ölçeksiz listeden okunuyor. Kurukafada da var olabilecek gizli bir hata bu.
3. **Bölümde düşme:** Ölüm kontrolü (~3214) bölümdeyken dönüşe yönlenir. Bu, "düşersen baştan" kuralına istisna demek.
4. **Puan:** Bölüm inişleri nasıl sayılacak? (×2 önerisi var.) Hayalet yarışı ve meydan okumayla uyum: ilk sürümde o modlarda simit çıkmaz.

## 5. Ekibin ayrıştığı ve senin karar vermen gereken noktalar
| Soru | Seçenekler | Kim ne diyor |
|---|---|---|
| **İlk denemede hareketli yüzey olsun mu?** | (a) yalnız sabit konteynerler · (b) sabit + 2 yavaş şamandıra | Oyun tasarımı **(b) şart** diyor, yoksa "aynı kule, başka görünüş" olur ve sen yine beğenmezsin. Ada da (b) diyor, ama az ve öngörülebilir hareketle. Oyuncu, anlatı, Arda ve Kıvılcım **(a)** diyor: ilk sürprizde "hedef benden kaçtı" hissi olmasın. |
| **Bölümde düşmek cezasız mı?** | Cezasız (düşünce kıyıya dönersin) · normal (baştan) | Oyuncu ve oyun tasarımı cezasız istiyor. Anlatı, kural değiştiği için senin onayını istiyor. |
| **İlk varış yeri** | Gemi · yer altı (sarnıç ya da su yolu) | Beşi gemi diyor. Arda yer altı diyor. Kıvılcım ikisini art arda istiyor. |
| **Puan** | Bölüm inişleri ×2 · normal | Teknik ve oyuncu ×2 diyor; diğerleri ilk denemeye almıyor. |

**Önerimiz (çoğunluk + uyarıların sentezi):**
- İlk deneme **gemi + 2 yavaş şamandıra**. Şamandıralar sabit genliklidir ve kanıt betiğiyle "en kötü anda bile ulaşılabilir" olduğu gösterilir.
- Bölümde düşmek **cezasız**: amca kıyıya döner, koşu sürer.
- Puan **normal**; ×2 sonra.
- **Yer altı ikinci sürümde.**

## 6. En küçük deneme ve maliyet
- **Gri kutu (~2 gün, görsel yok):**
  - Geliştirici bayrağıyla (`DENIZ_TEST`) bölüm doğrudan başlar: yer tutucu dikdörtgen konteynerler, 2 şamandıra ve kıyıya dönüş.
  - Kanıt betiği: şamandıralar her fazda ulaşılabilir; özellik açıkken ve kapalıyken ana parkurun kule dizisi, puanı ve durakları aynı.
  - Telefonda 20 denemede "haksız düştüm" sayılır.
- **Tam ilk sürüm (~4–5 gün kod):**
  - Simit, martı taşıması, ilk koşuda garantili tetik ve albüm kartı.
  - **Kıvılcım ~4 görsel:** martı + simit, gemi/konteyner, şamandıra, albüm kartı. Her biri ayrı onayla.
- **Başarı ölçütü:** TestFlight'ta arkadaşlara "simitten sonra ne oldu?" diye sorulur. Bir arkadaş bunu kendiliğinden anlatırsa amaç tutmuş demektir.

## 7. Editörlerin uyarıları
- **Ada ve Arda:** Hareketli hedef "zamanlamayı kaçırdım" yerine "hedef benden kaçtı" dedirtirse sürpriz adaletsizliğe döner. Hareket az ve öngörülebilir olmalı.
- **Kıvılcım:** Martı, ayrı parkur, hareketli yüzey, yeni kamera ve yeni fizik aynı anda yüklenmesin.
- **Teknik:** Uçuş sırasında yörüngeyi değiştiren hiçbir şey olmasın: lodos itmesi, martı hızı eklemek, şarj sınırını aşmak. Dikey kamera da açılmasın.
- **Anlatı:** Fantastik yerlere kaymak (görünmez mahalle, saat kadranı) beğenilmeyen yöne geri götürür. Varılan yer gerçek İstanbul olmalı; gerçeküstü olan yalnız martının taşıması.
- **Oyun tasarımı:** Sabit konteynerler tek başına yapılırsa bu yine "kaplama" olur.

## Dosyalar
`brief.md` · `tur1/` (oyun, anlati, teknik, oyuncu, kivilcim, arda, ada) · `tur2-gorev.md` · `tur2/` (aynı yedi editör)
