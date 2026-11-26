# HAREKET-2026-11-26 — Amcanın uçuş ve iniş hareketleri (editör değerlendirmesi)

## Kullanıcının isteği (kelimesi kelimesine)
"bir de adam zıpladıktan sonrası için bir efekt hazırlayalım. adamın zıplaması dümdüz direk gibi olmasın havada şekilli olarak uçsun inerken de vardığı yere göre bazı hareketler yapıyor onları da arttıralım diğer editörlerle değerlendirin"

## Oyun (kısa)
Byzantion: Expo / React Native (Reanimated worklet'leri, 60 Hz) iPhone oyunu. Karakter "amca": eşofmanlı, bıyıklı, İstanbullu bir amca. Ekrana basılı tutunca çömelir (şarj), bırakınca gaz (osuruk izi) bırakarak eğik atışla uçar, ileriki kulelerin çatısına iner. Yandan görünüş, sağa doğru ilerler. Ton: sıcak mahalle mizahı. Arapça ünlem kullanılmaz (maşallah, helal, nazar vb.).

## Şu an ne var (kod: app/index.tsx, src/game/ChargePoses.tsx, src/game/character-pose.ts)
- **Şarj:** 9 poz (charge-000…100-r12), şarj arttıkça çömelme + yüz ifadesi (gergin → ıkınma → patlamak üzere). Tam şarjı fazla bekletirse "patlama" (gaz birikir, fırlar).
- **Uçuş:** amca havada **sabit duruş pozunda (charge-000-r12.png), dik**, hiç dönmeden/eğilmeden dümdüz gider. Arkasında gaz bulutu izi. Bkz. kareler/ucus_*.jpg (kullanıcının 26 Kas videosu).
- **İniş:** her inişte görsel "esneme" (landPulse: ayaklar sabit, kısa scaleY sıkışma + geri yaylanma) ve çatıda toz. Ek olarak "beden dili" tepki pozları (her inişte en fazla biri, ~0.9-1.1 sn):
  - 3+ kule birden aşınca → **oh be** (amca-ohbe.png)
  - kenara kıl payı inince (oran ≤0.12 veya ≥0.88) → **denge** (amca-denge.png, kollar açık sallanma)
  - kusursuz (perfect) iniş → **silkele** (amca-silkele.png)
  - diğer inişlerde (çoğu) **tepki yok**.
  - Kıyafet/efekt katmanı varken (pijama gece, kış montu, yağmurluk/şemsiye, özel gün şapkası) tepki pozu **hiç çizilmez** (çünkü her pozun kıyafetli sürümü yok).
- **Düşüş:** düşüş kesinleşince 2 karelik çırpınma (amca-dusus-1/2.png; kış/yağmur/şemsiye sürümleri var).
- Ses: iniş, çoklu kule, mahalle sesleri var. Kurukafa (kuleleri büyütüp küçülten bonus), kargalar, cumbadaki teyzeler, kediler gibi çevre tepkileri var.

## Değişmez sınırlar (kullanıcı kuralı)
- Zıplama fiziği, kamera, çatı silüeti, çarpışma (footSoles), iniş tespiti DEĞİŞMEZ. Önerilen her şey **yalnız görsel** olmalı (yörünge aynı kalır; çizim döndürülebilir/eğilebilir/esnetilebilir ama çarpışma kutusu ve iniş noktası aynı).
- Puan kuralı ve kule üretimi değişikliği ayrı onay ister — bu işin kapsamı değil.
- Yeni görsel (yeni poz PNG'si) üretmek için her Kıvılcım (görsel üretici) çağrısı ayrı kullanıcı onayı ister; üretilen görsel kullanıcı kabul etmeden oyuna bağlanmaz. Yani önerileri **(A) mevcut görsellerle yapılabilecekler** (döndürme, eğme, esnetme, zamanlama, parçacık) ve **(B) yeni poz çizimi gerektirenler** diye ayırın; B için kaç PNG ve kaç kıyafet sürümü gerektiğini sayın (her yeni gövde pozu ×  kıyafet sürümleri maliyeti büyütür).
- Performans: iPhone'da 60 fps; Reanimated transform'ları ucuz, ek görsel katmanı (her poz ayrı Image + 4 hale kopyası) bellek/çizim maliyeti getirir.

## Sizden istenen
Kendi bakış açınızdan (rolünüz aşağıda) somut, uygulanabilir öneriler:
1. **Uçuş:** "dümdüz direk gibi" görünmemesi için havada ne yapsın? (yörüngeye göre eğilme, tepe noktasında poz, kol-bacak, gaz itişiyle dönme, ters takla, yüz ifadesi, uçuş süresine/şarja göre farklılık…). Uçuşun hangi evresinde ne olacağı (kalkış / yükseliş / tepe / iniş öncesi).
2. **İniş:** vardığı yere göre tepkileri nasıl artıralım? Hangi iniş durumları ayrı tepki hak ediyor (tam orta, kıl payı ön kenar / arka kenar, çok kule aşınca, tek kule kısa atış, art arda iyi iniş serisi, Kurukafa etkisi altında, rekor geçince, durak/kartpostal kulesine varınca, teyzeli/kedili/kargalı kuleye inince…). Her inişte bir şey olsun mu, yoksa çoğu sessiz mi kalsın (tekrar yorgunluğu)?
3. Türün en çok oynanan oyunları (Stick Hero, Spring Ninja, Jump Up/ketchapp tarzı tek dokunuşlu zıplama, Duet/Crossy Road karakter animasyonları, Alto, Jetpack Joyride vb.) uçuş/iniş animasyonunda ne yapıyor? Kaynak gösterin (web araması serbest).
4. Önceliklendirme: **ilk paket** (mevcut görsellerle, hızlı, risksiz) ve **ikinci paket** (yeni poz çizimi gerektirir) olarak; her öneri için etki / maliyet / risk.
5. Kaçınılması gerekenler (okunurluğu bozan, iniş noktasını yanlış gösteren, mide bulandıran dönme, oyuncunun zamanlamasını şaşırtan şeyler).

Raporunuzu Türkçe yazın, en fazla ~1 sayfa, madde madde. Dosya adı rolünüze göre (editor-*.md) bu klasöre.

## Görseller
kareler/ klasöründe: uçuştan 8 kare (ucus_*.jpg), duruş pozu (charge-000-r12.png), üç tepki pozu, iki düşüş karesi.


## Kıvılcım için not
Sen bu projede görsel tasarım ve karakter dili konusunda danışılan editörsün (bu çağrıda görsel üretmiyorsun, yalnız yazılı görüş). Rolün: karakterin kişiliğine (eşofmanlı, bıyıklı, mahalle amcası) uygun uçuş ve iniş hareket fikirleri; mizahi ama okunur. Hangi yeni pozlar çizilmeye değer, kaç tane, nasıl görünmeli (kısa betimleme). Kod değiştirme, dosya yazma; yanıtını yalnız metin olarak ver. Türkçe, ~1 sayfa.
