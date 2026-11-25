# Yayın ve canlı operasyon editörü — Satış ilk sürümde mi, güncellemede mi? (2026-11-25)

Okunanlar: `brief.md`, `SATIS-2026-11-25/brief.md` ve `RAPOR.md`, `FIKIR-GELIR-2026-11-18/RAPOR.md`. Kod değişmedi.

## 0. Kararı belirleyen Apple kuralı (doğrulandı)
Apple'ın App Store Connect yardım sayfası ("Submit an In-App Purchase", 2026-11-25'te okundu): **her türün ilk ürünü (tüketilen / tüketilmeyen / abonelik) yeni bir uygulama sürümüyle birlikte gönderilmek zorunda.** O türden ilk ürün onaylandıktan sonra aynı türden yeni ürünler **sürüm göndermeden** eklenebilir.
- "Çay ısmarla" **tüketilen** türdür (tekrar alınabilir). Kıyafet, gaz, çerçeve **tüketilmeyen** türdür.
- Yani iki türü de ilk sürümde birer ürünle açarsan sonraki ürünleri tek başına incelemeye yollayabilirsin. Yalnız ürün kaydı sürümsüz gider; yeni görseller uygulama paketinde değilse yine sürüm (ya da indirilen içerik) gerekir.

## 1. Seçeneklerin artısı ve eksisi

**A) İlk sürümde satış var**
- Artı: En çok indirmenin olduğu ilk 1–2 hafta boşa gitmez. Çıkışta en meraklı ve en destekçi kitle gelir (arkadaşlar, TestFlight çevresi, gurbetçi). "Kurucu" rozeti yalnız bu dönemde anlamlı.
- Artı: Satın alma kodu inceleme ekibinden bir kez geçer; sonraki ürünler küçük, tek tek gönderilen işler olur.
- Eksi: StoreKit, gardırop, "Satın alımları geri yükle", sandbox (Apple'ın deneme alışveriş ortamı) testleri, sözleşme/banka/vergi formları çıkışı **1–3 hafta geciktirebilir (tahmin)**. Sözleşme bitmeden ürün incelemeye bile gönderilemez.
- Eksi: Mağaza sayfasında "Uygulama içi satın alma" etiketi görünür. Yalnız kozmetik olduğunu baştan söylersen "para tuzağı" algısı düşük olur; reklamsız oyunda bu etiket Türk oyuncu için genelde sorun olmuyor (tahmin).
- Gizlilik etiketi: StoreKit kendi başına veri toplama beyanı gerektirmez; satın alma geçmişini kendi sunucuna göndermezsen etiket değişmez (**doğrulanmadı**, App Store Connect'te beyan sırasında bakılmalı).

**B) Önce tamamen ücretsiz, satış 4–8 hafta sonra**
- Artı: Çıkış hızlanır, inceleme sade geçer, ilk yorumlarda para konusu hiç geçmez. Önce neyin sevildiğini ölçüp ona göre çizim yapılır.
- Eksi: Coşku döneminin geliri sıfır. Bağımsız oyunlarda indirmelerin büyük kısmı ilk iki haftada gelir, sonra hızla düşer (tahmin, genel gözlem). 8. haftadaki "çay ısmarla" düğmesini görecek kişi çok daha az olur.
- Eksi: "Ücretsiz başladı, sonra paralı oldu" tepkisi ancak oyunda bir şey kilitlenirse gelir. Yalnız yeni kozmetik eklenirse tepki küçük olur. Eski içeriği kesinlikle kilitleme.
- Eksi: İlk satın alma güncellemesi yine yeni sürümle incelenir. Yani satışın incelemesinden kaçılmıyor, yalnız erteleniyor.

**Güncellemenin haber değeri (iki seçenekte de):** Satışı değil **içeriği** haber yap: "Kış güncellemesi: simitçi amca, yeni gaz sesleri, yılbaşı kartpostalı". App Store'daki **uygulama içi etkinlik** kartları ve öne çıkarma başvurusu formu güncellemeyi duyurmaya yarar. "Artık satın alma var" diye bir güncelleme oyuncuyu geri getirmez.

## 2. Net öneri: Ara yol (A'nın hafifi)
**Sürüm 1.0 (çıkış):**
1. **Amcaya çay ısmarla** — 3 kademe, tüketilen tür. Karşılığında çay bardağı rozeti ve oyun sonu kartında teşekkür satırı.
2. **Kurucu rozeti / gündüz pijaması** — tüketilmeyen tür, sıfır yeni çizim (mevcut külah+terlik). Amacı tüketilmeyen türün kapısını açmak ve erken destekçiyi ödüllendirmek. Kurucu rozeti çıkıştan sonraki 30 gün satılır, sonra kalkar (önceden açıkça yazılır, geri sayım baskısı yapılmaz).
- Gardırop ekranı yalnız iki sekmeli küçük bir liste. "Satın alımları geri yükle" zorunlu.
- **Kural:** StoreKit işi çıkışı 2 haftadan fazla geciktirecekse 1.0'ı satışsız çıkar, 1.1'i 2–3 hafta içinde getir. Çıkışı satış için bekletme.

**Sürüm 1.1 (çıkıştan 3–5 hafta sonra, Aralık sonu ise yılbaşıyla):** Gaz paketi + simitçi kıyafeti + yılbaşı kartpostalı, ücretsiz içerikle birlikte "kış güncellemesi" olarak.

**Sonra:** Yeni kıyafet ve çerçeveler ürün olarak tek tek gönderilir; görselleri birikince sürüme konur. Plaj amcası haziran güncellemesine.

Gerekçe: Tek kişilik geliştirici için en pahalı şey StoreKit'i iki kez incelemeye sokmak değil, coşkuyu boşa harcamak. Çay ısmarla en az kod ve görsel isteyen, en az "tuzak" kokan üründür. Kozmetik vitrini, insanların neyi sevdiği görüldükten sonra büyümeli.

## 3. Bir sonraki adıma geçme sinyalleri (eşikler tahmin)
- **1.1'e geçmek için:** 1. gün geri gelme %25 üstü, 7. gün %8 üstü; oyun sonu kartından paylaşım oranı %3 üstü. Bunlar zayıfsa yeni satış ürünü değil, oyun içi düzeltme yap.
- **Satışı genişletmek için:** Çay ısmarlama oranı indirmelerin %0,5'i üstünde ya da en az 20 alım. Gardırop ön izlemesi en çok hangi ürüne açılıyorsa sıradaki çizim o olsun.
- **Uyarı sinyali:** Yorumlarda "para", "satış", "pahalı" kelimeleri birkaç kez geçerse öneri satırını seyrekleştir. Puan 4,3 altına inerse satış eklemeyi dondur.
- **Reklam konusu:** 18 Kasım kararı geçerli, günde ~1.000 aktif oyuncudan önce açılmaz.
- Ölçüm notu: Takipsiz sürümde bu sayılar yalnız App Store Connect analizlerinden (izin veren kullanıcılar) ve Game Center'dan okunur. Örneklem küçük olacak; eğilime bak, tek güne değil.

## 4. Kesin olmayanlar
- İlk ürün kuralı ve sonraki ürünlerin sürümsüz gönderimi: **doğrulandı** (Apple yardım sayfası).
- Gizlilik etiketinin StoreKit ile değişmemesi: **doğrulanmadı**.
- Sözleşme/banka onayının süresi (genelde birkaç gün ile iki hafta arası): **tahmin**.
- Geri gelme, paylaşım ve dönüşüm eşikleri: **tahmin**, sektör gözlemi; Byzantion verisiyle güncellenmeli.
- Kurucu ürününü sonradan satıştan kaldırmanın inceleme açısından sorunsuz olması: **doğrulanmadı**, ama alanlar "Satın alımları geri yükle" ile ürünü korumalı.
