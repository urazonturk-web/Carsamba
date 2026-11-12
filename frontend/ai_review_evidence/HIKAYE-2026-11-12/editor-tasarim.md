# HIKAYE-2026-11-12 — Oyun tasarımı editörü görüşü (hikâye nasıl açılır)

Bakılan kod: `stops.ts` (duraklar 15/30/45/60, sonrası gece), `postcards.ts` (5 kartpostal, yalnız durakta açılır), `index.tsx` (rekor bayrağı, günün haritası, uzak düdük). Temel sorun: **bütün hikâye taşıyıcıları 15. kuleden sonra.** Oyuncuların çoğu oraya varmıyor, yani hikâye şu an çoğu kişiye hiç görünmüyor. Bu yüzden ilk parça **ilk turda, 5. kule civarında** gelmeli ve hikâye **mesafeyle değil, toplam oynamayla** da ilerlemeli.

## 1. Hikâye özü
**ANA: "Aynı sabah" (zaman döngüsü + kaçan vapur).** Amca yıllar önce bir sabah, 08:00 vapurunu kaçırdı. O vapurda biri ona veda edecekti, ama o yetişemedi. Amca o sabahı tekrar tekrar yaşıyor. Her düşüş döngüyü başa sarar. Gaz heyecandandır: amca her zıplayışta "bu sefer yetişeceğim" diye ıkınır.
**"Aaa!" anı:** Oyunun en başından beri var olan "düş, baştan başla" kuralı bir oyun kuralı değil, hikâyenin kendisiymiş. Rekor bayrağı da amcanın önceki sabahlardan kalan izi. Oyuncu bunu iskeleye varınca ya da kartpostalların arkasını tamamlayınca anlar.
*Alternatif: "Düdükçü".* Amca vapurun eski düdükçüsüdür. Vapur, onun düdüğü olmadan kalkamaz. Uzaktan gelen düdük sesi aslında ona cevap veriyor, yani gaz ile düdük aynı ses. Bu daha hafif bir öneri. Ana öneriyle birleştirilebilir.

## 2. Açılma planı (tetik = oyuncunun gerçekten gördüğü anlar)
| Katman | Ne zaman | Oyuncu ne görür | Merak sorusu |
|---|---|---|---|
| 0 | İlk tur, 0. kule | Köşede küçük bir cep saati: **07:40**. Her kule ~20 sn ilerletir (60. kule = 08:00). | "Neden saat var?" |
| 1 | İlk tur, **5. kule** | Kartpostalın ilk **yırtık parçası** uçarak gelir (Karaköy'ün köşesi). | "Neyin parçası?" |
| 2 | Düşünce (her tur) | Sonuç kartında saat donar: "07:43". Altında küçük ikon: ⛴ 08:00. Söz yok. | "08:00'de ne var?" |
| 3 | 2.–3. tur | Bir önceki turda düşülen kulede soluk bir **gaz bulutu izi** durur ("dünden kalan"). | "Bu ben miyim?" |
| 4 | 10. kule | 2. parça gelir. 15. kulede (Karaköy) kartpostal tamamlanır, **arkası** açılır: tek satır el yazısı, tarih ve imzasız bir harf. | "Kime yazılmış?" |
| 5 | 30/45. kule | Galata ve Sirkeci kartpostalları. Arkalarındaki tarihler **aynı gün, farklı yıllar**. | "Aynı gün mü?!" |
| 6 | 60. kule, iskele | Saat 08:00. 2–3 sn sahne: vapur, güvertede el sallayan bir siluet. Konfeti, çift düdük. | Döngü sezilir |
| 7 | Gece seferi | Gece kartpostalının arkasında döngüyü kapatan tek cümle var. Ondan sonra saat 07:40'a dönmez, sabah ilerlemeye başlar. | "Aaa!" |

**Durağa varamayanlar için güvence:** Parçalar **kalıcıdır** (cihazda saklanır). Ayrıca birikimli eşikler vardır: toplam 50 kule = Karaköy'ün 2. parçası, 150 kule = 3. parçası. Yani 15. kuleye hiç varamayan biri de ~10 turda ilk kartpostalı tamamlar ve arkasını okur. Sonuç kartındaki "Karaköy'e 4 kule kaldı" satırı yerinde kalır. Yanına bir satır daha gelir: "1 parça kaldı". İlk turda verilen ipucu: **saat + bir parça**, başka bir şey değil. Merakı açıklama değil, eksik parça ve donan saat canlı tutar.

**Tekrar oynama:** Hikâye bittikten sonra rekor bayrağının adı "en uzak sabah" olur. "Günün haritası" modu da "bugünün sabahı" olur. Döngü kurgusu sayesinde her gün yeni bir sabah oynamak hikâyeyle tutarlı.

## 3. Oyunda nasıl anlatılır
- **Mevcut parçalar taşır:** Duraklar (yer ve zaman), kartpostal albümü (asıl anlatı, arka yüzlerle), iskele (doruk), gece (çözüm), rekor bayrağı ve son düşüş izi (döngü kanıtı), uzak düdük (vapur hep orada, "çağırıyor"). Martılar dekor olarak kalır.
- **Patlama eşiği:** "Dayanamadı!" anında saat bir an titreyip hızlanır. Yani acele gaz, zaman kaybettirir. Bu yalnız görsel bir işaret, kural değil. Fizik, kamera ve siluet **değişmez**. Saat ve parçalar sadece arayüz katmanında.
- **Metin miktarı:** 5 kartpostal arkası × en fazla 8 kelime, artı iskeledeki 1 satır. Toplam ~45 kelime. Espri yok, sade ve sıcak bir dil.
- **Yeni üretim (onay ve kredi gerekir):**
  1. Kartpostal arka yüzü: 1 görsel (pul, damga, kâğıt dokusu). Yazılar kodla basılır.
  2. İskele sahnesi: 1 görsel (vapur güvertesinde siluet).
  3. İsteğe bağlı: 1 ses, eski vapur düdüğünün tek uzun notası (iskele ve gece için).
  - Kodla yapılanlar (kredi yok): yırtık parça kesimleri (maske), cep saati, gaz izi (mevcut bulut).

## 4. İsim adayları
1. **Son Vapur** (*Last Ferry*): Hikâyenin hedefi, İstanbul'u da hemen anlatıyor.
2. **07:40**: Gizemli, ilk turdan görünen saatle bağlantılı. İsim, oyun açılınca anlam kazanıyor.
3. **Aynı Sabah**: Döngüyü sezdirir ama ele vermez.
4. **Vapura Yetiş**: Net bir eylem, mağazada okunaklı.
5. **Düdük**: Kısa, sesli. Hem gaz hem vapur (alternatif öneriyle uyumlu).
6. **Amca Kaçırmaz** (*Uncle Won't Miss*): Mizahi, kahramanın inadını anlatıyor.

## 5. Yapılmaması gerekenler
- **Hikâyeyi yalnız mesafeye bağlamak.** 15. kule kapısı çoğu oyuncuda hikâyeyi sıfırlar. Her parça birikimli oynamayla da açılabilmeli.
- **Tur ortasında anlatı kesintisi ya da döngüyü metinle açıklamak.** Oyun içi hiçbir an 1 saniyeyi geçmemeli (iskele hariç). "Bir daha" refleksi korunmalı. Gerçek, iskeleden önce asla yazıyla söylenmemeli.
