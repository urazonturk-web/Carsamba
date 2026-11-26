# HAREKET-2026-11-26 — Amcanın uçuş ve iniş hareketleri: ortak rapor

Görüş verenler: animasyon editörü (editor-animasyon.md), oyuncu hissi editörü (editor-oyuncu.md), teknik editör (editor-teknik.md), Kıvılcım (kivilcim-gorusu.md, yalnız yazılı görüş, görsel üretilmedi). Brief: brief.md. Kod değiştirilmedi.

## Teşhis (dördü aynı fikirde)
- Uçuşta amca, duruş pozunda dik ve kaskatı kalıyor; "çıkartma gibi kayıyor". Şarjda çömelme var ama bırakınca hiçbir yaylanma, eğilme, toparlanma yok.
- İnişte 3 tepki pozu var, ama kıyafet varken (pijama, kış, yağmur, şemsiye, özel gün şapkası) hiç çizilmiyor. Kışın oyun "ölü" görünüyor.
- Asıl risk tepkilerin azlığı değil, bazı inişlerde balon, teyze, durak bandı, poz ve iki titreşimin aynı anda üst üste binmesi.
- İyi haber (teknik + animasyon): kıyafetler gövde pozunun içinde çiziliyor. Gövdeye verilen döndürme/esneme her kıyafete kendiliğinden uyar. Kodda kalkış ve inişte zaten hesaplanan ama hiçbir çizimin kullanmadığı bir "baş sallanması" yayı da var (headTilt).

## Ortak öneri — Paket A (yeni çizim yok, fizik/kamera/çarpışma aynı)
**Uçuş**
1. **Kalkış esnemesi:** bırakma anında gövde ~90-120 ms boyunca yukarı uzar (boy %8-16, en %7-10 incelir), sonra yaylanıp normale döner. Şarj fazlaysa biraz daha güçlü.
2. **Yörüngeye eğilme:** gövde uçuş yönüne en fazla ±12° yatar; yükselişte yörüngeyi izler, tepede düzleşir. Kısa hoplamada neredeyse hiç eğilmez, uzun atışta tam eğilir.
3. **Tepe anı:** kısa "asılı kalma" (hafif ezilme + dizleri hafif büken mevcut şarj pozu). "Bacaklarını topladı" hissi; yeni çizim gerekmez, şarj pozları zaten kıyafetli.
4. **İniş öncesi dikleşme:** temastan ~120-150 ms önce açı 0'a döner, dizler hafif bükülür. Amca her zaman dik iner; oyuncu iniş yerini ayaklardan okur.
5. Gaz izi gövdenin açısına göre kalça arkasından çıkar.
6. **Ters takla / sürekli dönme yok** (dördü de karşı: iniş yeri okunmaz, mide bulandırır, amcanın karakterine uymaz).

**İniş**
7. **İnişin sertliği hıza göre:** kısa hopta hafif, uzun düşüşte daha derin çökme (şu an hep aynı).
8. **Kıl payı kenar:** ön kenarda öne, arka kenarda geriye sönümlü sallanma (±7°, ~600 ms). Kıyafetliyken de çalışır.
9. **Kusursuz inişte seriye göre artan tepki:** 1. seferde yalnız ses, 2. seferde silkele, 3+ seride silkele + "göğüs kabartma".
10. **3+ kule ve rekor:** "oh be", koşu başına sınırlı (ilk 2 sefer / rekorda bir kez).
11. **Sıradan inişler (~%70) sessiz kalsın:** yalnız çökme + toz + ses. Aynı poz art arda gelmesin.
12. **Tek sözcü kuralı:** teyze, kedi, karga veya durak bandı konuşuyorsa amca poz yapmaz. Bir inişte en fazla bir titreşim, temas anında.
13. **Kıyafetliyken de tepki:** poz çizilemese de sallanma/silkeleme gövde dönüşümüyle verilir.
14. Dokunulunca tepki anında kesilsin, şarj gecikmesin.

## Paket B (yeni çizim; her Kıvılcım çağrısı ayrı onay)
- En çok fark: **2 yeni gövde pozu** — (1) havada uçuş pozu (kollar geride, bacaklar toplu, yanaklar rüzgârda), (2) iniş hazırlığı (kollar açık, dizler bükük, gözler aşağıda).
- Kıyafet sürümleriyle birlikte **8-10 PNG** (poz başına çıplak + pijama + kış + yağmur ± şemsiye) ve şapka kutu ölçümleri.
- Sonraki aday: "ah belim" (3+ kule sonrası) ve "bıyık sıvazlama" (kusursuz seri) — 2 poz × 5 = 10 PNG daha.
- Alternatif: mevcut 3 tepki pozunun kıyafetli sürümleri (~9 PNG).
- Bellek: büyük poz başına ~4,9 MB + 5 görüntü katmanı.

## Editörlerin ayrıştığı yerler ve kararım
- **Dönme noktası:** animasyon editörü gövde ortası, teknik + oyuncu editörü ayak noktası dedi. **Ayak noktası** öneriyorum: iniş yeri ve kıyafet kutuları hiç kaymaz; 12° sınırında baş kayması kabul edilebilir.
- **Takla:** animasyon editörü en uzun atışların %10'unda tek tur dedi; diğerleri hiç. **Hiç** öneriyorum (ilk pakette).

## Teknik notlar
- Tek bir sarmalayıcı görünüme döndürme/esneme (app/index.tsx:3893 civarı); tüm pozlar, haleler ve kıyafetler birlikte döner. Fiziğe, kameraya, iniş tespitine dokunulmaz.
- Düşüş karelerinde eğilme kapalı (pivotları baş hizasında).
- Yeni animasyon stilleri okudukları değerlerden sonra tanımlanmalı (worklet sırası, R062). Şemsiyeli yağmurda performans ölçülmeli.
- Hayalet yarıştaki rakip amcaya da aynı eğilme uygulanabilir.

## Tür kaynakları (oyuncu editörü)
Stick Hero (Instructables), Spring Ninja (PocketGamer), "Juice it or lose it", Game Developer "12 principles for game animation", Amazon GameMaker "Juicing your movements" — bağlantılar editor-oyuncu.md içinde.
