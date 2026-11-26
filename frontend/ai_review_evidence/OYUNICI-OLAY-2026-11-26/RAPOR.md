# OYUNICI-OLAY-2026-11-26 — Ortak rapor: durakta, oyundan çıkmadan yaşanan olaylar

Kaynak: kullanıcı ("bulmacadan vazgeçtim… martılar dayıya saldırsa biz de martılara tıklayarak uzaklaştırsak… başka ekrana geçmeyelim"). Editörler: editor-tasarim.md, editor-oyuncu.md, editor-teknik.md; Kıvılcım kivilcim-gorusu.md (yalnız yazılı görüş). Harem bulmacası kapatıldı (BAGAJ_ON=false); oyun kodunda başka değişiklik yok.

## Ortak kurallar (dördü aynı fikirde)
- Olay aynı sahnede olur: amca, kuleler, Boğaz görünür; oyun durmaz, ayrı ekran yok.
- Kısa (≈5 sn), her durakta en fazla 1 olay; ilk kez mutlaka, sonra seyrek/çeşitli.
- **Olay amcayı asla düşürmez.** Ceza komik ve görsel (simit ısırılır, amca sendeler ama düşmez). Kısmi başarı da sayılır.
- Hedefler büyük (en az ~44 pt), gelmeden önce kısa uyarı.
- Ödül varsayılan olarak görsel/mizahi. Puan ya da iniş toleransı ödülü **puan/iniş kuralına dokunur → ayrı onay**.

## Dokunma çakışması (en önemli teknik soru) — çözüm
Ekrana dokunmak hem zıplatıyor hem martı kovacak. Kodda (onPressIn → şarj, bırakınca fırlatma) şöyle çözülür:
- Dokunuşun yeri, şarjı başlatan kontrolden **önce** test edilir: dokunulan yerde martı varsa martı kovulur ve şarj hiç başlamaz → parmak kalkınca da zıplama olmaz. Boş yere dokunmak normal zıplatır.
- Martının çevresinde küçük bir "ölü bölge" (ıska dokunuşlar da yutulur) → "martıya basayım derken atladım" olmaz.
- Amcanın kendi üstü hedef sayılmaz. Ayrı ekran ya da ek kilit gerekmez; oyuncu olayın ortasında zıplarsa olay biter.
- Performans: martılar 3 önceden hazır görüntü, tek olay saati; olay yokken maliyet sıfır (takılmayı artırmaz).

## Kullanıcının örneği: Kız Kulesi martı baskını (ilk yapılacak)
- **Nerede:** 2. durak Üsküdar · Kız Kulesi (30. kule), durak kulesine ilk inişte. Anadolu Kavağı'nda 5 martılı zor sürüm.
- **Kurulum:** amcanın elinde simit belirir; "kıı-kıı" sesi.
- **Martılar:** 3 martı, Kız Kulesi tarafından ~0,8 sn arayla simide dalar; dalışın sonunda kanat açar (dokunma ipucu).
- **Kovma:** martıya dokun → takla atıp kaçar, havada tüy; hafif titreşim.
- **Kaçırılırsa:** martı simitten bir ısırık alır; amca sendeler (yalnız görsel); 3 ısırıkta simit biter, amca boş eline bakar. Düşme yok.
- **Hepsi kovulursa:** amca simidi ısırır, son lokmayı Boğaz'a fırlatır, bir martı havada kapar (vapurda martıya simit atma geleneği); cumbadaki teyze/çocuk alkışlar.
- **Süre:** ≤5 sn. **Görsel:** prototip kodla (büyütülmüş martı silüeti + kodla çizilmiş simit); kalıcı martı pozları (süzülme, dalış, kaçış) + amcanın simitli pozu Kıvılcım'la (2 çağrı, her biri ayrı onay).
- İsteğe bağlı ödül [KURAL]: "simit gücü" — sonraki 3 inişte tam isabet toleransı geniş. Onay yoksa ödül yalnız görsel kalır.

## Diğer olay fikirleri
| Durak | Olay | Oyuncu ne yapar | Görsel | Boy |
|---|---|---|---|---|
| Harem | İskele simitçisi simit fırlatır, uçuş yayında asılı kalır | Dokunma yok: uçarken değerse amca yakalar (Kurukafa gibi) | kodla | S |
| Kuzguncuk | Kedi amcanın terliğine sinsice yürür / teyzenin sepeti | Kediye dokun / sepete yetiş | mevcut kedi (+1) | S–M |
| Boğaziçi Köprüsü | Lodos kasketi uçurur, önünde süzülür | Havadayken kaskete dokun (havada dokunuş zaten boş, çakışma yok) | kasket 1 | M |
| Köprüler | Vapur düdük çalar | Vapura el salla (dokun) | vapur mevcut | S |
| Ortaköy (gece) | Çocuğun balonu kaçar | Balona dokun, balon geri süzülür | kodla | S |
| Arnavutköy | Balıkçının oltası eşofmana takılır | İpin üstünden kaydır | ip kodla, balık 1 | M |
| Bebek | Kargalar çatıda ceviz kırıp amcanın kafasına düşürür | Kargalara dokun | **mevcut 4 karga pozu** | S |
| Rumeli Hisarı | Burçtan gülle yuvarlanır | Zıplayarak kaç (ana kontrol, çakışma yok) | kodla | S |
| Kanlıca | Yoğurt kâsesine sinek sürüsü | Sineklere dokun | **mevcut sinek çizimi** | S |
| Anadolu Kavağı | 5 martılı final sürümü, midye tava kâğıdı | Martı baskını gibi | martı görselleri | S |

## Öneri
1. **İlk: Kız Kulesi martı baskını** — kullanıcının kendi örneği; "dokunuş yeri testi + ölü bölge" altyapısını kurar, diğer dokunmalı olayların hepsi bunu kullanır. Kodla çizilmiş martı ve simitle prototip; beğenilirse Kıvılcım martıları.
2. Sonra **Bebek kargaları** (mevcut karga çizimleriyle neredeyse hiç yeni görsel yok) ve **Harem simidi** (dokunmasız, martı olayını hikâyeyle hazırlar).
3. Kanlıca sinekleri, köprüde kasket/vapur düdüğü sonraki adımlar.

## Kaynaklar
Crossy Road (bekleyince gelen kartal/martı), QTE tasarımı (başarısızlık oyunu bitirmemeli), Jetpack Joyride (tek kontrolün bağlama göre anlam değiştirmesi), Fruit Ninja (dokunulmaması gereken nesne), İstanbul'da vapur martıları ve simit (SBS Food, Daily Sabah), Apple 44 pt dokunma hedefi — bağlantılar editör raporlarında.
