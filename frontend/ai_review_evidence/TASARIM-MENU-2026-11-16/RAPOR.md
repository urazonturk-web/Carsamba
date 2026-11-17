# Menü, oyun sonu ve ses simgesi — tasarım raporu (2026-11-16)

Görüş alınanlar: Codex (`codex-gorusu.md`), bağımsız Claude tasarım editörü, Claude (bu oturum). Ekran görüntüleri: 1-menu, 2-oyun-sonu, 3-yaris-sonu, 4-ses-dugmesi. Kod değiştirilmedi.

## İki editörün ortak tespiti
- Kart dili (krem zemin, kiremit çerçeve, kilim baklavaları) tutarlı ve sıcak.
- En büyük eksik: **amca menüde hiç görünmüyor**, kartın arkasında kalıyor. Karakter oyunun kimliği.
- Oyun sonu kartı **hâlâ kalabalık**. Kartta 9 öğe var:
  - skor ve rekor
  - durak kutusu (iki satır)
  - "Bir daha"
  - 5 eşit ikon; "Meydan oku" ve "2 dk yarış" etiketleri iki satıra kırılıyor
  - harita kodu ve kopyala
  - sürüm etiketi
- Yarış sonu kartında **duygu yok**: başlık nötr, kazanan büyük yazmıyor.
- Ses düğmesinde emoji yerine **çizilmiş/sistem hoparlör simgesi** olmalı. Vapur düdüğü ya da çan temalı ama "ses" diye okunmuyor. Yalnız yazı da HUD'da yer kaplıyor.
- Emojiler (⚔️ 🔑 🏁 🏆 📮) el çizimi İstanbul'la çatışıyor. Tek renkli simgeler daha tutarlı olur.

## Ses simgesi seçenekleri
- **A) iOS hoparlör simgesi (SF Symbols)** — önerilen.
  - Simgeler: "speaker.wave.2.fill" / kapalıyken "speaker.slash.fill".
  - Görünüm: 38×38 yuvarlak düğme, koyu zemin, krem simge; kapalıyken kırmızı zemin.
  - Dokununca 1,5 sn "Ses kapalı" / "Ses açık" yazısı çıkar.
  - Paket (expo-symbols) projede zaten kurulu; yeni indirme yok.
- **B) Temalı simge (vapur düdüğü):** karakterli ama belirsiz; görsel üretimi gerekir.
- **C) Yalnız yazı:** net ama kalabalık. Şu anki hâli buna yakın.

## Hemen yapılabilir (kodla, yeni görsel yok)
**Menü**
- Başlığı kartın dışına, gökyüzüne al (krem yazı, koyu gölge).
- Kartı aşağı it ve küçült; Boğaz ve silüet görünsün.
- Amca, mevcut duruş pozuyla, ilk kulenin tepesinde görünür kalsın.
- Etiketleri düzelt: "Giriş" → "Sıralama", "0/12" → "Kartpostal 0/12".
- Rekoru küçük altın rozete al.

**Oyun sonu**
- Sürüm etiketini karttan kaldır. Sürüm doğrulaması zaten paketten yapılıyor; istersen menünün en altında küçük kalabilir.
- Harita kodu satırını kaldır; kod "Meydan oku" içinde ("📤 Kodu paylaş") zaten var.
- "Meydan oku"yu "Bir daha"nın altına tam genişlik ikinci düğme yap.
- Altta yalnız 2 ikon kalsın: 2 dk yarış, Sıralama. "Kod gir" ve "Kartpostal" menüde zaten var.
- Durak kutusunu tek satıra indir ("📍 Harem'e 12 kule").

**Yarış sonu**
- Başlık sonucu söylesin: "Kazandın!" (yeşil) / "Hayalet kazandı" (kırmızı). Rakip yoksa "Bu yarışta: 3. kule".
- Sen ve rakip yan yana iki sütun; kazananın kenarı altın.
- "3. kule" tek satıra sığsın.
- "Kapat" düğme değil, alttaki bağlantı olsun.
- Arkadaki skor göstergesini gizle (kartla çakışıyor).

**Genel:** ikon emojilerini tek renkli iOS simgeleriyle değiştir (bayrak, kupa, anahtar, zarf).

## Görsel üretimi gerekir (Kıvılcım, her çağrı onayla)
1. **BYZANTION logotipi** (hat/el yazısı esintili). Menüde, mağaza görsellerinde ve paylaşımda tekrar kullanılır. En değerlisi bu.
2. Gerekirse amcanın menüye özel pozu. Şimdilik mevcut duruş pozu yeterli.
3. İleride 5–6 el çizimi arayüz simgesi. Lüks; iOS simgeleri işin büyük kısmını karşılıyor.

## Önerilen sıra
1. Ses simgesi A.
2. "Hemen yapılabilir" paketi (menü, oyun sonu, yarış sonu, simgeler) tek sürümde.
3. Beğenilirse logotip için Kıvılcım (onaylı çağrı).
