# Diyalog v2 + editörlerin video değerlendirmesi (2026-11-20)

Kullanıcı: "diyaloglar güzel olmamış onlar üzerine çalışılsın ayrıca diğer editörlere de videoyu göstererek değerlendirmelerini iste"
Danışılan: Codex (`codex-gorusu.md`) ve Claude editörü (`claude-editor-gorusu.md`); ikisine de video kareleri (`sheet*.jpg`, `kare/k_*.jpg`) ve tüm diyaloglar verildi (`editor-brif.md`).

## 1. Editörlerin video değerlendirmesi (ortak noktalar)
| Bulgu | Codex | Claude | Durum |
|---|---|---|---|
| Aynı laf iki karakterde / balonlar üst üste (74, 85 sn) | ✓ | ✓ | Düzeltildi (önceki tur + yeni set) |
| Komşu balonları ekran kenarında kesik (75, 86, 92 sn) | ✓ (alt kenar) | ✓ | **Düzeltildi:** balon ekranın içinde tutulur |
| Kedi okunmuyor, balon amcaya biniyor (62.6 sn) | ✓ (hızlı geçiyor) | ✓ | Önceki turda düzeltildi (kedi büyük, balon olukta) |
| Oyun sonu kartı ağır / sık tekrar | ✓ | ✓ (lakap 3 kez aynı) | **Lakap:** her durum için 2 seçenek, art arda aynısı yok. Kart boyutu: açık |
| Kurukafa yazısı sıkışık / tarza uymuyor (109 sn) | ✓ | ✓ | Açık |
| "Basılı tut… bırak, zıpla!" her turda | — | ✓ | **Düzeltildi:** ilk 3 koşudan sonra gizli |
| İyi: İstanbul sahnesi, kartpostal dili, menüdeki hava vitrini, +4/+6 | ✓ | ✓ | — |
| Kedi tanışma bildiriminin kısa kalması / kartla çakışması | ✓ | ✓ | Açık |

## 2. Diyaloglar neden zayıftı (iki editör aynı teşhiste)
Kalıp sözler ("Aferin", "Dikkat et", "Gel yat") her oyunda geçebilir; teyze, komşu amca ve çocuk aynı ağızla konuşuyor; laf durumu (hava, saat, semt) espriye çevirmiyor, yalnız etiketliyor; aynı söz iki karakterde; ters köşe yok.

## 3. Karakter sesleri (v2)
- **İç ses:** yaşlı bedenle övünç arasında; dizler, bıyık, gençlik.
- **Hanım:** pratik bir sevgi dili; her lafı bir ev işiyle iğneler.
- **Teyze:** her şeyi ev işine ve kendi oğluna bağlar, sitemle sever.
- **Komşu amca:** hakem gibi not verir, gençliğiyle kıyaslar, "be" der.
- **Çocuk:** harfiyen anlar, soru sorar, hayran kalır.

## 4. Yeni set (oyunda; ağırlıkla Claude editöründen, Codex'in en iyileri eklendi)
**İç ses** — kıl payı: "Topuk havada, gurur yerinde." / "Az daha Boğaz'a dalıyordum." / "Bu çatıyı kim yaptıysa…" · 3+ kule: "Bu bacaklar 1974 model!" / "Martılar bile bakakaldı." / "Dizlerim bunu ödetecek." · 3 tam orta: "Cetvelle çizdim sanki." / "Terzi gibi, tam ölçü." / "Üç kere üst üste, not alın!" · rekora 1: "Rekor bir kiremit ötede." / "Sakin ol bıyık, sakin." / "Bir tane daha, sonra çay." · bekleyince: "Kuşlar konacak üstüme." / "Vapur gitti, ben duruyorum." / "Bekledikçe diz kilitleniyor."

**Hanım ❤️** — rekor: "{N} kule, rekor! Kuaförde anlatacağım, şimdi gel yemeğe." / "Rekor mu? Fotoğraf çek, yoksa kimse inanmaz." / "Rekor tamam; ekmek işi hâlâ sende." · gece: "Saat {SS:DD}. Kapıyı kilitledim, anahtar paspasın altında." / "Çatıda tıkırtı var diye bekçiyi çağırıyorlardı. Sendin!" / "Mahalle uyudu. Senin terlik kapıda." · sabah: "Ekmek almaya çıktın, {N} kule zıpladın. Fırın taşındı mı?" / "Fırın açık, kahvaltı hazır. Dönüşte ekmek al." · akşam: "Yemek hazır. "Son bir zıplayış" diyeceksen hiç başlama." / "Dizi başladı, kumanda sende kaldı. Ya gel ya kumandayı at." · yağmur: "Islak eşofmanı balkona as, salona değil. Anlaştık mı?" / "Yağmurda kiremit tutmaz. Montu kap, aşağı in." · kar: "Karda zıplanmaz, kayılır. Salep ocakta, in aşağı." / "Kardan adam yapacaksın sandım, sen kule saymışsın." · sis: "Ben seni balkondan göremiyorum, kule seni nasıl görsün?" / "Galata görünmüyor. Yolunu bulunca eve gel." · lodos: "Lodos var, çamaşırları topladım. Seni de toplayayım mı?" / "Lodos seni karşıya uçurmadan gel. Dolma ocakta." · poyraz: "Atkını kapıya astım. Görmedin tabii." / "Poyrazda bıyığın donar. Gel, çorba sıcak." · patladıysa: "Komşu "gaz kaçağı var" diye aradı. Sendin değil mi?" / "Koku senden önce eve geldi!" · 0–2 kule: "Merdiveni inmeden döndün mü? Terliklerin daha sıcak." / "Daha kapının önündesin. Gelirken çöpü de at bari." · durak: "{Üsküdar'a} kadar gitmişsin! Dönüşte vapura bin, dizlerin var." / "Madem {Üsküdar'a} vardın, oradan simit al. Bizimki bayat." · genel: "Annen aradı. "Çatıda" dedim, "yine mi" dedi." / "Kapıcı seni çatıda görmüş. Aidatı bize yazacakmış." / "Çay ikinci kez demlendi. Eve gel." / "Ekmek nerede? {N} kuleyi gördüm."

**Teyze** — orta: "Benim oğlan böyle konamaz." / "Ay, tam ortası! Gel çaya!" / "Halıyı da böyle düz ser!" · kenar: "Kiremit benim, ödersin ha!" / "Düşme, halıyı yeni yıkadım!" / "Aman yavrum! Kenar, kenar!" · diğer: "Hanımın biliyor mu bunu?" / "Toz kalkıyor, öteye zıpla!" / "Çamaşıra dokunma ama!"
**Komşu amca** — orta: "Ben de gençken böyleydim be!" / "On numara, beş yıldız!" / "Vay bıyık, vay!" · kenar: "Ayak parmağınla mı tutundun?" / "Az daha bizim balkona!" / "Topuğu kiremitten çek be!" · diğer: "Tavla var, in de oynayalım!" / "Bizde merdiven vardı be!" / "Haberlere çıkacaksın be!"
**Çocuk** — orta: "Amca tam ortaya bastı!" / "Amca, bunu nasıl yaptın?" / "Çatıya nokta koydu!" · kenar: "Ben gözümü kapattım!" / "Ayakkabın kaçtı az kalsın!" / "O kiremit sallanıyor!" · diğer: "Amca bana da öğretir misin?" / "Sen dedemden hızlısın!" / "Vapurdan hızlı gittin!"
**Kedi** — "Mrr, bu çatı benim." / "Mrrr? Simit var mı?" / "Miyav… yerim burası."

**Özel günler (Hanım)** — yılbaşı: "Hindi fırında kızardı, sen çatıda kızarıyorsun. Misafirler kapıda!" / "{N} kule zıplayacağına bir çeyrek bilet alsaydın." / "Misafirler geldi. Çatıda geri sayım olmaz." · Cadılar Bayramı: "Şeker isteyen çocuklar seni çatıda görüp kaçtı." / "Kostüme gerek yok, o eşofmanla herkesi korkutuyorsun." · 29 Ekim: "Bayrağı balkona astım. İn de fener alayına yetişelim." / "Fişekler atılacak. Çatıda durma, aşağıdan izleyelim." · 14 Şubat: "Bugün ne gün biliyor musun? Ben biliyorum, çiçekçi de biliyor." / "Çiçek almadan gelme; çatı buketi sayılmaz." · Paskalya: "Komşu boyalı yumurta getirdi. En sağlamı bende, gel tokuşturalım." / "Yumurtalardan birine bıyık çizdim. Kimi andırıyor acaba?" · 23 Nisan: "Torunun gösterisi başladı, ön sıraya yer tuttum. Çatıda kalma!" / "Çocuk bayramı diye sen de çocuk mu oldun? {N} kule!" · Hıdrellez: "Gül dalına dilek astım. Seninkini de yazdım: 'Çatıdan insin.'" / "Ateşin üstünden atlayacağız. Madem bu kadar zıplıyorsun, gel!"

**Lakap** ("{Semt}'de …", her durumda 2 seçenek, art arda aynısı gelmez): kapıda kalan → paspasta kalan / terliği ısınmayan · patladıysa → fokurdayan / tüpü sızdıran · rekor → efsane bıyık / mahallenin manşeti · 4+ durak → durak atlayan / vapur kıskandıran · çok tam orta → cetvel ayaklı / terzi ölçülü · çok kule atlama → freni tutmayan / çayı beklemeyen · kenar inişleri → çatı kedisi / ip cambazı · ortaya inişler → kiremit sayan / üç kere ölçen · diğer → ıslık çalan / eşofmanı ütülü.

Kontrol: 45 balon satırının hepsi ≤ 28 karakter; Hanım satırları ≤ 75 karakter; yasaklı kelime (maşallah, helal, inşallah, nazar, Allah, vallahi, hayırlı, evlat…) yok; karakterler arası tekrar yok. Codex'in "evladım" içeren satırı kullanıcı kuralı gereği alınmadı.

## 5. Açık kalanlar (editörlerin önerisi, yapılmadı)
Oyun sonu kartını küçültmek / 0 puanda hafif kart; kurukafa yazısını oyun fontuyla ve tek satır yapmak; kedi tanışma bildirimini biraz uzatıp kartla çakışmasını önlemek; "İstanbul'da gece…" bildirimi ile gündüz görseli çelişkisi.
