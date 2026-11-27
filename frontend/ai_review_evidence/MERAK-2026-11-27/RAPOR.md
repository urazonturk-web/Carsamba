# Byzantion — "Merak" Raporu: zıplamayı bozmadan başka bir yere/zamana geçmek (2026-11-27)

**Ekip:** Kıvılcım (yaratıcı yönetmen) + dört Claude editörü: oyun tasarımı, anlatı ve dünya, teknik, oyuncu ve paylaşım. Her biri brief'i (`brief.md`) bağımsız okudu, depoyu inceledi, en az 8 fikir yazdı. Toplam ~45 fikir; ayrıntılar editör dosyalarında. Kod değişmedi, görsel üretilmedi.

## 0. En önemli sonuç: beş editör aynı yere vardı
Kimse birbirinin cevabını görmeden, beşi de 1 numara olarak **aynı fikrin bir sürümünü** seçti:

> **Amca havada eski bir vapur jetonu yakalar → kısa bir perde → aynı zıplamayı başka bir İstanbul'da (başka bir yerde ya da başka bir zamanda) sürdürür → birkaç kule sonra vapur düdüğüyle Boğaz'a döner.**

| Editör | 1 numarası |
|---|---|
| Kıvılcım | "Başka İstanbul'a açılan kapı": imkânsız bir İstanbul (ör. ufukta iki Kız Kulesi) |
| Oyun tasarımı | "Vapur jetonu → Aktarma", ilk varış: Yerebatan Sarnıcı (kule = sütun) |
| Anlatı ve dünya | "Kayıp Sefer jetonu": sis kapısı, 8 kule sepya "eski sefer"; arkasından "R."nin kartpostalları |
| Oyuncu ve paylaşım | "Sepya kayması": 10 kule boyunca "Kadıköy · 1926", yere değil zamana ışınlanma |
| Teknik | "Yol C" (aynı kule dizisi, sahne kaplaması) en güvenli yol; ilk sürüm sıfır yeni görselle yapılabilir |

Bu uyum güçlü bir işaret: senin "ışınlanma" sezgin doğru. Asıl iş, onu **neden, nereye ve nasıl** sorularına bağlamak.

## 1. Önerilen tasarım: "Kayıp Sefer"

### Oyuncunun yaşadığı
1. **İlk koşuda kanca (yakalanamaz):** ~5. kulede gökyüzünde, ulaşılamayacak yükseklikte pirinç bir jeton bir an parlar, kaybolur. Amca başını kaldırır: "Bu da ne?" Bu kanca, oyunu tek kez açıp bırakan oyuncu için. TestFlight'ta 1 oturumda kalan bir arkadaş var.
2. **İlk yakalanabilir jeton (2. ya da 3. koşu, 8. kuleden sonra, alçak yay):** Amca jetonu yakalar → bir sonraki inişte vapur düdüğü, buhar/sis perdesi ~0,4 sn → perde açılınca:
   - **Eski Boğaz:** sepya renkli Boğaz, buharlı vapur, ekranın üstünde bir an "Burası neresi?", sonra "Kadıköy · 1926".
   - 8–10 kule boyunca aynı zıplama. Kuleler, fizik, kamera ve puan hiç değişmez; değişen yalnızca deri, ses ve renk.
   - Vapur düdüğüyle aynı perdeyle geri dönülür; amca kaldığı yerden devam eder.
3. **Hiç anlatılmaz.** Öğretici yok; yalnızca bir yer adı, bir damga ve kartpostal ekranında yeni bir "?" yuvası.
4. **Sonrası:** Koşuların ~%20'sinde bir jeton (koşu başına en fazla 1; kurukafa etkisi sürerken çıkmaz). Her jeton bir "parantez sahne"ye götürür. Sahneler zamanla eklenir.

### Dört kural (ortak karar)
1. **Işınlanma asla düşüşle bitmez.** Perde iniş anında kapanır, amca hep bir çatının ortasında ayakta "belirir". Perdeden sonraki ilk zıplama o koşunun kolay aralığına denk gelmeli. Bunun için kule üretimine dokunulmaz, jetonun yeri buna göre seçilir.
2. **Jeton ödüldür, kumar değil.** Kurukafa 50/50 "kumar", jeton "kapı". İkisi karışmaz.
3. **Puanı atlatmaz.** Kule sayısı aynen sürer; ödül yer, manzara ve damgadır. Rekor tablosu bozulmaz.
4. **Kısa sürer.** 8–10 kule. Uzun kalırsa yeni yer sıradanlaşır.

### Sahne havuzu (zamanla, her biri ayrı onay)
| Sahne | Ne değişir | Neden merak | Görsel |
|---|---|---|---|
| **Eski Boğaz (1926)** ★ ilk | Sepya süzgeç, buharlı vapur, eski siluet | "Zamanda mı geriye gittim?" | İlk deneme 0; sonra 1–2 |
| **Sarnıç** | Karanlık, kuleler sütun derisi, damla sesi, fener ışığı | "Yer altına mı indim?" | 2–4 |
| **Alt Akıntı** | Boğaz ters akar, gökyüzü mora kayar (gerçek bir olay: Boğaz'ın alt akıntısı ters yöndedir) | "Dünya ters mi döndü?" | 0 (aynalama + renk) |
| **İmkânsız İstanbul** | Ufukta iki Kız Kulesi, yanlış yerde köprü | "Bu şehir neresi?" | 1 |
| **Batık direkler (Yenikapı kazısı)** | Su altı tonu, çatılar batık gemi direği gibi | "Boğaz'ın altında şehir mi var?" | 2 |

Dini motif, siyasi ya da futbol göndermesi yok. Ayrıntılar `editor-anlati.md`.

## 2. Hikâye omurgası: "R."nin kartpostalları (anlatı editörü)
Her parantez sahnenin sonunda amcanın cebinde bir kartpostal belirir. Ön yüzde o sahnenin karesi, arkasında el yazısıyla tek satır ve **"R."** imzası var:
- Eski Boğaz: "Bordo yakışmış. Bende de vardı bir tane." — R.
- Sarnıç: "Burada da düştüm ben. Sütunları sayma, şaşırırsın." — R.
- Alt Akıntı: "Akıntıya karşı gitmeyi kimden öğrendin acaba?" — R.

**Açılım:** 8 kartta ya da Karadeniz'e varışta R.'nin amcanın genç hâli olduğu anlaşılır. Gençken aynı bordo eşofmanla Boğaz'ı zıplayarak geçmeye çalışmıştır; kayıp seferler onun bıraktığı izlerdir. Son kart: "Ben buraya kadar geldim. Gerisi senin."

- Mevcut kartpostal paylaşımına doğrudan bağlanır. Metin bütçesi ~12 satır.
- Amcanın adı ("Rıza" önerisi) senin kararın; istersen yalnızca "R." kalır.
- Oyun tasarımı editörünün "yırtık fotoğraf" fikri (7 parçalı fotoğraf) aynı açılımın görsel hâli. İkisinden biri seçilmeli.

## 3. Teknik: nasıl yapılır, neye dokunmaz (teknik editör)
Üç yol karşılaştırıldı (`editor-teknik.md`):

| Yol | Ne | Çekirdeğe dokunur mu | Karar |
|---|---|---|---|
| **A** Aynı dizide ileri atlama | Gerçekten 10 kule ileri | Puan, durak, kamera → **evet** | Ayrı onay ister |
| **B** Ayrı bonus dünya (başka tohum) | Bambaşka bir parkur | Kamera, düşüş kuralı, ~45 MB bellek → **evet** | Önerilmez |
| **C** Aynı dizi, sahne kaplaması | Perde + arka plan, ses ve renk değişir | **Hayır** | ✅ Önerilen |

- Yol C, var olan parçalarla kurulur: kurukafanın toplama hattı (ayrı karma, `kurukafa.ts:33`), pijama kapısının perdesi (`index.tsx` ~3144–3160) ve arka plan seçici (`BG_VARIANTS`, `index.tsx` ~472, ~1603).
- Büyüklük: ~80–130 satır (`src/game/kapi.ts` + birkaç bağlantı).
- Kanıt şartı: aynı tohumla özellik açık ve kapalı iken 300 kulelik dizi bayt bayt aynı çıkmalı (betikle).
- Risk: perde açılırken yeni arka planın geç yüklenmesi (önceden ısıtma ile kapanır); yeni kule derileri çizilirse görünen kenar fizikle çakışmamalı.

## 4. Diğer güçlü fikirler (jetonla birlikte ya da sonra)
| Fikir | Editör | Neden güçlü | Maliyet |
|---|---|---|---|
| **Haftanın sırrı**: her hafta günün haritasında tek bir altın jeton; bulan damga alır, kartında "Bu haftanın sırrını buldum" yazar | Oyun | Oyuncular birbirine "salı haritasında 37. kuleye bak" yazar; oyun dışında konuşulur | 1 gün, 1 görsel |
| **Dünkü amca**: en iyi koşun yarı saydam "dünkü sen" olarak önünden zıplar | Teknik | Yarış modunun hayalet altyapısı hazır; kendine karşı merak | ~1 gün, 0 görsel |
| **Tohum kodu kartpostalı**: paylaşım kartında "Bebek-7Q2" gibi kod; giren arkadaş aynı parkuru oynar | Teknik | Meydan okuma altyapısı hazır; paylaşmaya somut neden | ~1 gün, 0 görsel |
| **Yeşil eşofmanlı öteki amca**: arka planda nadiren başka bir amca zıplar, hiç açıklanmaz ★ | Oyuncu | Söylenti: "sen de gördün mü?" | 1 görsel |
| **Vapur penceresindeki ikinci amca**: uzaktaki vapurda amcanın silueti, sonraki geçişte yalnız bırakılmış eşyası | Kıvılcım | Küçük ipucuyla büyüyen gizem | 1 küçük görsel |
| **Gölge önce iniyor**: nadiren gölge, amcadan önce sonraki çatıya düşer | Kıvılcım | Tek karede "bu ne?" | 0 görsel; ama iniş işareti sanılmamalı |
| **Kayıp Eşya Bürosu**: parantez sahnelerden düşen eşyalar oturumlar arası birikir | Anlatı | Geri getiren uzun kanca | Orta |
| **Rüya dönüşü**: düşünce bir kez "rüyaymış" deyip devam ★ | Oyuncu | Çok güçlü an | **Puan kuralına dokunur → ayrı onay** |

## 5. Önerilen sıra
1. **Deneme (1 gün, 0 Kıvılcım çağrısı):** Yol C ile tek sahne "Eski Boğaz". Mevcut arka plan + sepya süzgeç + vapur düdüğü + perde. Jeton yerine geçici olarak sarıya boyanmış kurukafa görseli kullanılır. Telefonda 60 fps tutuyor mu, kule dizisi bayt bayt aynı mı, oyuncu "başka yerdeyim" hissediyor mu, bakılır.
2. Beğenilirse: Kıvılcım'dan 1 jeton görseli + 1 sepya arka plan (2 çağrı, ayrı onay); ilk koşudaki yakalanamaz parıltı; kartpostal "?" yuvası; ilk R. kartı.
3. Sonra: Sarnıç ve Alt Akıntı sahneleri; haftanın sırrı; tohum kodu.
4. Ayrı onay gerekenler: Yol A (gerçek ileri atlama), rüya dönüşü, amcanın adı.

## 6. Bilerek dışarıda bırakılanlar
- Ayrı bonus dünya (Yol B): kamera ve düşüş kuralını bozuyor, bellek riski var.
- Uçuşta ağır çekim: fizik zamanına dokunuyor.
- Dini mekânlar, ezan, siyasi ya da futbol göndermeleri.
- Başka oyunların tanınır mekanikleri ya da adları.

## Dosyalar
`brief.md` · `kivilcim-gorusu.md` · `editor-oyun.md` · `editor-anlati.md` · `editor-teknik.md` · `editor-oyuncu.md`
