# "Tasarım sıkıcı" — editör raporu (2026-11-16)

Görüş alınanlar: Codex (`codex-gorusu-2.md`), bağımsız Claude sanat yönetmeni, Claude (bu oturum). Kod değiştirilmedi.

## Neden sıkıcı? (iki editörün ortak teşhisi)
- **Jenerik pencere.** Krem zemin, kalın kırmızı çerçeve ve yuvarlak hap düğmeler her ekranda aynı. Ayarlar penceresi gibi duruyor; zengin İstanbul çizimiyle bağ kurmuyor.
- **Hareket yok.** Skor sayarak artmıyor, rekorda kutlama yok, amca tepki vermiyor. Oyun sonu bir "an" değil, bir tablo.
- **Amca kopuk.** Menüde kartın altında duruyor; oyun ve yarış sonunda hiç görünmüyor.
- **Tipografi düz sistem yazısı.** Skordaki rakam duygusuz.
- **Tek süs (baklava sırası) yapıştırılmış gibi.** Sürüm etiketi ve kırmızı ses düğmesi gereksiz dikkat çekiyor.
- **Ekranlar arasında kişilik farkı yok.** Menü, oyun sonu ve yarış sonu aynı kalıpta.

## Önerilen yönler
| Yön | Fikir | Kod mu, görsel mi |
|---|---|---|
| **A. Kartpostal ve posta damgası** (iki editörün de tercihi; Codex "İstanbul'da bir durak" diye benzerini önerdi) | Her ekran bir kartpostal: hafif eğik kart, kesik çizgili posta kenarı, pul, el yazısı havası. Oyun sonu kartpostalın arka yüzü. | Kodla. Yazı tipi iPhone'un hazır yazıları (ör. Snell Roundhand, Baskerville); indirme gerekmez. |
| B. İskele tabelası ve vapur bileti | Lacivert emaye iskele tabelası, sallanan "BYZANTION" tabelası, kalkış panosu gibi skor. | Kodla. Risk: biraz ciddi/kurumsal. |
| C. Amca sahnede | Kart yok gibi; amca büyük, skora göre ifade değiştiriyor, konuşma balonu. | Mevcut ifadeli pozlarla kısmen olur; el sallama/sevinç pozu için yeni görsel ve onay gerekir. |

### A yönünün ekranları
- **Menü**
  - BYZANTION hafif eğik bir kartpostalın üstünde, köşede pul var.
  - Tek büyük "Oyna" düğmesi, bilet gibi kesik kenarlı.
  - Kod, Sıralama ve Kartpostal küçük yuvarlak simgeler.
  - Amca çatıda küçük bir selam ya da nefes hareketi yapıyor.
- **Oyun sonu**
  - Kartpostalın arka yüzü: solda el yazısıyla "Harem'e 15 kule kaldı".
  - Skor büyük yazıyla 0'dan sayarak artıyor (~0,6 sn).
  - Rekor kırılınca "YENİ REKOR · 16 KASIM" posta damgası düşüp sekiyor.
  - Köşede amcanın skora göre seçilen ifadeli kafası, çıkartma gibi duruyor (mevcut pozlar).
- **Yarış sonu**
  - Yan yana iki kart: "Sen" ve "Hayalet" (hayaletinki yarı saydam).
  - Kazananın kartında damga ya da martı.
  - "Arkadaşına gönder" = kartı postalamak.

## Sadelik nasıl korunur
- Her ekranda tek kahraman (menüde logo ve Oyna, oyun sonunda skor, yarış sonunda Sen–Hayalet).
- Bir dolu düğme, en fazla iki küçük ikincil düğme.
- Canlılık eleman sayısından gelmez. Kaynakları:
  - hafif eğim
  - kâğıt hissi
  - yazı tipi
  - 1 saniyelik giriş hareketi (bitince ekran durgun kalır)
- Kart ekranın %35–40'ını kaplasın; arka plan görünsün.
- Tek süs dili (posta) seçilsin; kilim, çini ve baklava karışmasın.
- Hemen yapılacaklar: sürüm etiketi kalkar (doğrulama paketten yapılıyor), ses düğmesi sade ve yarı saydam olur.

## En küçük ama en etkili ilk adım (iki editör aynı fikirde)
Yalnız oyun sonu kartını yeniden yapmak:
1. Kartpostal görünümü.
2. Sayarak artan skor.
3. Rekorda düşen damga.
4. Amcanın çıkartma kafası.
Beğenilirse aynı dil menüye ve yarış sonuna taşınır.

## Kullanıcı kararı
1. Yön: A (kartpostal), B (iskele tabelası) ya da C (amca sahnede).
2. Önce yalnız oyun sonu mu, yoksa üç ekran birden mi?
