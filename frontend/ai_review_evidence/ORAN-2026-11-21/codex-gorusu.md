## Oranı düzeltmek için seçenekler

Görseldeki temel sorun iki parçalı: cephedeki pencereler amcaya göre küçük; mevcut komşu görselindeki teyze ise pencereye göre de küçük. “Baştan pencere oranına dönmek” pencereyi, komşuyu ya da ikisini birlikte yeniden ölçeklemek anlamına gelebilir.

| Seçenek | Zorluk | Yeni görsel ve risk |
|---|---|---|
| **a) Pencereler aynı, teyze amca ölçeğinde** | Kod işi düşük: mevcut komşu parçasının boyutu ve konumu ayarlanır. | Teyzeyi yaklaşık **70–90 px baş** ölçeğinde yeniden çizmek gerekir. Pencereye sığmayıp dirsekleri pervaza taşabilir; bu, komik ve okunaklı bir çözüm olabilir. Mevcut cephe atlasını değiştirme riski yok. |
| **b) Cephedeki pencereleri büyütmek** | Kod ve içerik işi orta-yüksek: kule başına daha az, daha büyük pencere yerleşimi gerekir. | Atlas büyütülürse bulanıklaşır; temiz sonuç için yeni cephe çizimleri gerekir. Birden fazla cephe ve kat düzeni değişeceği için kapsamı geniş, görsel tutarlılık riski yüksek. |
| **c) Komşu kuleye özel büyük pencere, balkon ya da cumba** | Kod işi orta: yalnız komşunun çıktığı kulede özel görsel katman ve yerleşim gerekir. | Büyük pencere/balkon ve teyze için yeni görseller gerekir. Komşulu kuleyi diğerlerinden ayırır; çatının altında kalması ve iniş çizgisine taşmaması gerekir. Tek noktada güçlü çözüm, ancak sahneye özel tasarım ekler. |
| **d) Amcayı küçültmek (1,4 → yaklaşık 1,15) ve (a)** | Kod işi düşük-orta; görsel yeniden çizim gerekir. | Amca pencerelere göre daha iyi ölçeklenir; fakat oyuncunun alıştığı karakter görünümü küçülür. Çarpışma değişmese de ekrandaki algı ve oynanış hissi değişebilir. |
| **e) Teyzeyi pencerenin önüne, gövdesi içeride kalacak biçimde yerleştirmek** | Kod işi düşük-orta: görselin ankrajı, ölçeği ve katman sırası ayarlanır. | Amca ölçeğinde yeni teyze çizimi gerekir. Pencereyi büyütmeden daha büyük karakter algısı verir; taşan kollar ve pervaza yaslanan pozla küçük pencerede de okunur. |

## Önerim

İlk deneme olarak **(a) ile (e)’yi birleştirelim**: cephe atlası ve amca aynı kalsın; komşu teyze amcaya daha yakın ölçekte, pencereden öne doğru eğilmiş ve dirseklerini pervaza koymuş olsun. Böylece sevilen “binadan çıkan kadın” fikri korunur, oran sorunu tek bir komşu görselinde çözülür ve oynanış geometrisine dokunulmaz.

**Üretim isteği:** Önce tek bir teyze görseli; pencere/pervazıyla bütünleşik, mevcut çizgi dilinde. Onaydan sonra farklı pencerelerde kullanım gerekirse ayrı varyantlar planlanır.  
**Kod işi:** Görsel ölçeği ve konumunu ayarlamak; gerekirse pencere önünde görünmesi için katman sırasını düzenlemek. Kule genişliği, çatısı ve iniş çizgisi değişmez.

Daha sonra komşunun çıktığı kulelerde tekrar eden bir ihtiyaç görülürse **(c)** değerlendirilebilir. Tüm cephe atlasını yeniden çizmek, bu tek oran sorununu çözmek için gereğinden kapsamlı.

## Balon yerine tepki

Yazılı balon yerine teyze amcayı fark edip **gözleriyle onu izlesin, bir eliyle işaret etsin, diğeriyle halıyı tutsun**. İstenirse kısa bir “Hey!” ya da neşeli bir ıslık kullanılabilir; ses kapalıyken de jest tek başına anlaşılır.