# Byzantion — Satış ilk sürümde mi, sonraki güncellemede mi? (2026-11-25)

Kullanıcı: "oyunu ücretli içerikle mi yayına alalım yoksa güncellemelerle mi sonradan ücretli içerik mi sunalım … diğer editörlerle bir değerlendirme yapın".
Danışılan (birbirini görmeden): Kıvılcım (`kivilcim-gorusu.md`), yayın/canlı operasyon editörü (`editor-yayin.md`), oyuncu/topluluk editörü (`editor-oyuncu.md`). Brif: `brief.md`. Kod değişmedi.

## Kararlar

| | Kıvılcım | Yayın editörü | Oyuncu editörü |
|---|---|---|---|
| Öneri | **B**: ücretsiz çık, ilk satış 4–8 hafta sonra, veriye bağlı | **Ara yol**: 1.0'da çay + sıfır çizimli kurucu rozeti/gündüz pijaması; 1.1'de kış güncellemesi | **Ara yol**: 1.0'da yalnız çay (+ kurucu çay bardağı rozeti); gardırop güncellemeyle |
| İlk satış ürünü | Çay ısmarla (tek fiyat) + teşekkür rozeti | Çay (3 kademe) | Çay (3 kademe) |
| Sonra | Çerçeve ya da gaz (hangisi talep görürse); simitçi en son | Gaz + simitçi + yılbaşı kartpostalı (3–5 hafta) | Gardırop + gaz + simitçi (3–6 hafta), sonra çerçeve + pijama |
| Koşul | Çay çıkışı geciktirmeyecek kadar hazırsa değerlendirilebilir | StoreKit çıkışı 2 haftadan fazla geciktirecekse 1.0 satışsız | — |

Uzlaşma noktası: **çay, çıkışı geciktirmiyorsa ilk sürümde; geciktiriyorsa satışsız çık.** Kıvılcım da bu koşulda çayı değerlendirebileceğini yazıyor; ayrıldıkları tek nokta varsayılan tercih.

## Üçünün ortak söyledikleri
- **Mevcut hiçbir şey sonradan kilitlenmez** (duraklar, kediler, kartpostallar, standart paylaşım). "Önce ücretsizdi sonra paralı oldu" tepkisi yalnız var olan şey kilitlenince doğar.
- Mağaza açıklamasına ilk günden: *"Ücretsiz, reklamsız. Satılan her şey yalnız görünüş ya da geliştiriciye çay; oyunu kolaylaştırmaz."*
- Güncellemenin haberi satış değil içerik olur: "Kış güncellemesi: simitçi amca, yeni gaz sesleri, yılbaşı kartpostalı" (App Store uygulama içi etkinlik kartı kullanılabilir).
- Kurucu rozeti varsa geri sayım gösterilmez.
- Reklam: 18 Kasım kararı geçerli (günde ~1.000 aktif oyuncudan önce yok).

## Apple kuralı (yayın editörü Apple yardım sayfasından doğruladı)
Her satın alma türünün (tüketilen / tüketilmeyen) **ilk ürünü yeni bir uygulama sürümüyle** incelemeye gider; o tür onaylandıktan sonra aynı türden ürünler sürümsüz eklenebilir (görselleri uygulamada yoksa yine sürüm gerekir). Çay = tüketilen; kıyafet/gaz/çerçeve/rozet = tüketilmeyen. Yani satış hangi sürümde başlarsa o sürümün incelemesi uzar; ertelemek incelemeden kaçırmaz.
Doğrulanmadı: StoreKit'in gizlilik etiketini değiştirmemesi; bahşişe rozet vermenin 3.1.1'e uygunluğu; kurucu ürününü sonradan satıştan kaldırmanın sorunsuzluğu; sözleşme/banka onay süresi.

## Bir sonraki adım sinyalleri (tümü tahmin)
- Gardırop güncellemesine geçiş: 1. gün geri gelme **%25+**, 7. gün **%8–10+**, paylaşım kartı oyunların **%3+**'ünde, en az **20 çay alımı** (ya da indirenlerin %0,5'i). Kıvılcım ek olarak iki hafta üst üste günde ~100 aktif cihaz arıyor.
- Dur ve oyunu düzelt: 7. gün %5 altı, yorumlarda "para / tuzak / satış", puan 4,3 altı.
- Ölçüm: takipsiz sürümde yalnız App Store Connect analizleri (izin verenler) ve Game Center; küçük örneklemde eğilime bakılır.

## Benim birleştirmem
1. **Çıkış (1.0):** "Amcaya çay ısmarla" (3 kademe) + kalıcı çay bardağı rozeti; mağaza düğmesi ve gardırop yok. Kod işi küçük (StoreKit, teşekkür ekranı, geri yükleme; ~1–2 görsel). **Koşul:** App Store Connect'te ücretli uygulama sözleşmesi + banka + vergi tamamlanmış olmalı — çıkışı bunlar geciktirecekse 1.0 satışsız çıkar, çay 1.1'e kalır.
2. **Kış güncellemesi (1.1, çıkıştan 3–6 hafta sonra; sinyaller iyiyse):** gardırop + gaz paketi + simitçi + herkese ücretsiz yılbaşı kartpostalı; çay alanlara bir gaz rengi hediye.
3. **Sonra:** kart çerçeveleri, gündüz pijaması; haziranda plaj amcası.
