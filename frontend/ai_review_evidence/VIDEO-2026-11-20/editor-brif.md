# Byzantion — Video değerlendirmesi + diyalogların yeniden yazımı (brif)

## Oyun
Byzantion: iPhone oyunu. Tek dokunuş "basılı tut – bırak – zıpla": bıyıklı, kırmızı eşofmanlı İstanbullu bir amca, İstanbul çatıları arasında zıplar. Resimli İstanbul arka planı (Boğaz, vapurlar, Galata), gerçek saat/hava, Türkçe arayüz. TestFlight aşamasında.

## Video
Kullanıcının telefonda 118 sn'lik oynanış kaydı. Ekteki kareler: saniyede bir kare (sheet00..05; her karede saniye yazılı) ve parlaklığı artırılmış 12 önemli kare (k_*.jpg). Not: kayıt baştan sona koyu; durum çubuğu da koyu olduğu için bu oyundan değil telefonun parlaklığından/kaydından kaynaklanıyor. Dinamik adadaki "1692 adım" başka bir uygulamanın.
Videoda: menü (hava denemesi sırayla), oyun, oyun sonu kartpostalı ve lakap, iç ses balonları ("Bu çatı biraz yamuk sanki.", "Kıl payı…", "Kalbim ağzıma geldi.", "Bunu Hanım görseydi…"), pencere komşusu teyzenin lafları ("Dikkat et, kenar!", "Annene söyleyeceğim!", "Yüreğim ağzıma geldi!"), kedi "Mrrr?" ve "🐈 Tarçın ile tanıştın! Kedi defteri: 1", kurukafa olayı.
Bu sürümden sonra yapılan düzeltmeler (videoda yok): Hanım bildirimi artık hızlı "Bir daha"da kaybolmuyor; iç ses en az 25 sn arayla; komşu konuşunca iç ses susuyor; kedi büyütüldü.

## Kullanıcının yorumu
"diyaloglar güzel olmamış onlar üzerine çalışılsın". Kullanıcı daha önce (2026-11-11) oyun sonu espri satırlarını da zayıf bulmuştu ("hepsi zayıf okunuyor").

## Kurallar
- Arapça/dinî ünlem YOK: maşallah, helal, inşallah, nazar, Allah, vallahi, hayırlı vb. (kullanıcı kuralı).
- Küfür, argo hakaret, siyaset, futbol takımı göndermesi yok.
- Düşünce/konuşma balonu kısa: en fazla ~28 karakter (telefonda tek satır). Hanım bildirimi en fazla ~75 karakter.
- Aynı söz başka bir karakterde tekrar etmesin (videoda iç ses "Kalbim ağzıma geldi" ile teyze "Yüreğim ağzıma geldi!" çakıştı).
- Hedef: genel "komik cümle" değil; bu amcaya, bu mahalleye, o ana (iniş, hava, saat, skor) ait, İstanbul sokağının konuşma dili. Oyuncuyu gülümsetecek, ekran görüntüsü alınacak kadar özgül.

## Mevcut diyaloglar (hepsi taslak)
**İç ses (amcanın başında düşünce balonu, seyrek):**
- Kenara kıl payı iniş: "Kıl payı…", "Ayakkabının yarısı dışarıda!", "Bu çatı biraz yamuk sanki.", "Kalbim ağzıma geldi."
- 3+ kule birden: "Uçtum mu ben?", "Gençliğim geri geldi!", "Bunu Hanım görseydi…"
- Üst üste 3 tam orta: "Tam ortası, bak sen bana!", "Usta işi.", "Göz değmesin."
- Rekora 1 kala: "Rekor şurada…", "Bir kule daha, bir kule daha…"
- Başta 9 sn zıplamazsan: "Ee, zıplamayacak mıyız?", "Çay soğuyor ama…", "Dizlerim tutulacak."

**Hanım arıyor (oyun sonu, telefon bildirimi gibi; "Hanım ❤️"):**
rekor: "{N} kule! Komşular seni konuşuyor. Gururlandım ama gel yemeğe." / "Rekor mu kırmışsın? Bak sen… Ekmeği yine unuttun ama." · gece 00–05: "Saat {SS:DD} oldu, çatıda ne arıyorsun? Gel yat artık." / "Komşular uyuyor, sen hâlâ zıplıyorsun. Gel yat." · sabah: "Ekmek almaya çıktın, {N} kule mi zıpladın?! Kahvaltı soğudu." · akşam: "Yemek hazır. "Son bir zıplayış" deyip geliyorsun ya, biliyorum." · yağmur: "Yağmurda çatıya mı çıkılır! Montunu ilikle bari." · kar: "Karda kayarsın, in aşağı! Salep yaptım." · sis: "Bu siste nereye zıplıyorsun? Önünü görmüyorsun ki." · lodos: "Lodos var, uçup gitme. Akşama dolma var." · poyraz: "Poyraz esiyor, atkını takmadan çıkma." · patladıysa: "Ne bu koku?! Eve girmeden üstünü değiştir." · 0–2 kule: "Daha kapıdan çıkmadan düştün mü? Dizine buz koy, geliyorum." · durağa vardıysa: "{Üsküdar'a} kadar gitmişsin! Dönerken simit al." · genel: "Ekmek nerde? {N} kule mi zıpladın?!" / "Çay demlendi, soğutma." / "Annen aradı, seni sordu. Ne diyeyim?" / "Kapıcı seni çatıda görmüş. Rezil olduk!"

**Pencere komşuları (amca o kuleye inince; inişe göre orta/kenar/diğer):**
- Teyze (halı silkeliyor): orta "Aferin oğlum!", "Bravo, tam ortası!", "Çok yaşa!" · kenar "Aaa! Düşeceksin!", "Dikkat et, kenar!", "Aman, düşme!" · diğer "Oğlum in oradan!", "Halıyı silkeliyorum, toz olma!", "Annene söyleyeceğim!"
- Komşu amca (atletli, bağırıyor): orta "Aferin be!", "Vay vay vay!", "Bunu kimden öğrendin?" · kenar "Düşeceksin be!", "Oğlum dikkat!", "Ayağın kayacak!" · diğer "Oğlum in oradan!", "Ne işin var orada?", "Kiremitleri kırma!"
- Çocuk (alkışlıyor): orta "Yaşasın! Bir daha!", "Amca süpersin!", "Uçuyor, uçuyor!" · kenar "Aaa!", "Az kalsın!", "Ooo, kıl payı!" · diğer "Amca, bir daha zıpla!", "Ben de zıplamak istiyorum!", "Bravo amca!"
- Kedi: "Miyav!", "Mırr…", "Mrrr?"

**Özel günlerde Hanım:** yılbaşı "Hindi fırında, sen hâlâ çatıdasın!" / "Piyango biletini aldın mı? {N} kule zıplayacağına bilet al." / "Yılbaşı gecesi çatıda mı geçecek? Gel, misafirler geldi." · Cadılar Bayramı "Kapıya şeker isteyen çocuklar geldi, sen yoksun!" / "O şapkayla komşuları korkuttun, gel artık." · 29 Ekim "Bayrağı balkona astım, sen de in de fener alayına gidelim." · 14 Şubat "Bugün ne gün biliyor musun? Çiçeksiz gelme." / "{N} kule zıplayacağına bir demet gül alsaydın." · Paskalya "Komşu boyalı yumurta getirdi, gel bak." / "Yumurta tokuşturacağız, gel." · 23 Nisan "Torunlar gösteriye çağırıyor, çatıda kalma!" / "Çocuklar gibi zıplıyorsun, {N} kule!" · Hıdrellez "Gül dalına dilek astım, sen de bir dilek tut." / "Ateşin üstünden atlayacağız, gel!"

**Lakap (oyun sonu "Lakabın: {Semt}'de {sıfat}"):** kapıda kalan, gazı kaçan (patladıysa), rekortmen, seyyah, nişancı, aceleci, cambaz, temkinli, keyifli.

## Görev (Türkçe, en fazla ~1200 kelime)
### A. Video değerlendirmesi
Karelere bakarak: oyunun bu hâlinde neler iyi, neler kötü (görsel, okunurluk, balonların yeri/sıklığı, oyun sonu kartı, komşular/kedi, akış). Somut saniye/kare adı ver. 5–8 madde, önem sırasıyla.
### B. Diyaloglar neden zayıf?
3–5 maddede teşhis (ör. genel/kalıp, karakter sesi yok, durumla bağı zayıf, tekrar…).
### C. Yeniden yaz
Her grup için yeni set (yukarıdaki kurallarla): iç ses (her durum için 3), Hanım (her durum için 2; değişkenleri koru: {N}, {SS:DD}, {Üsküdar'a}), teyze/komşu amca/çocuk (her biri için orta/kenar/diğer 3'er), kedi (3), özel günler Hanım (her gün 2), lakap sıfatları (her biri için daha iyi bir karşılık önerebilirsin). Her karakterin kendine özgü bir konuşma huyu olsun (teyze: ?, komşu amca: ?, çocuk: ?, Hanım: ?) — önce bunları birer cümleyle tanımla.
### D. En iyi 5 satır
Tüm setten en güçlü 5 satırı seç.
