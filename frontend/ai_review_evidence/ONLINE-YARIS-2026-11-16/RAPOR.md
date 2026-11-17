# Online 3 dakikalık yarış — değerlendirme raporu (2026-11-16)

Kullanıcı fikri: Aynı haritada, birbirinin zıplamalarını görerek 3 dakika oynanır. Düşen baştan başlar. Sonunda puan ve en uzak mesafe hesaplanır.

Görüş alınanlar: Codex (`codex-gorusu.md`), bağımsız Claude planlama editörü, Claude (bu oturum). Kod değiştirilmedi.

## Ortak karar: fikir iyi, ama ilk sürüm "canlı" değil "hayalet yarış" olsun
- **Canlı oda** (GKMatch): iki kişinin aynı anda çevrimiçi olması gerekir. Birkaç arkadaşla bu nadiren tutar. Kopma ve gecikme sorunları da çıkar. İş büyüklüğü yaklaşık 1,5–2 hafta.
- **Hayalet yarış**:
  - Oyuncu 3 dakikasını oynar. Her zıplaması kaydedilir ve mevcut meydan okuma ile arkadaşına gider. Arkadaş aynı haritada oynarken rakibin yarı saydam amcası yanında zıplar.
  - "Birbirinin zıplamasını görme" duygusu korunur, ama aynı anda çevrimiçi olmak gerekmez.
  - Mevcut turn-based altyapısı (challengePlayer, finishChallenge) neredeyse hazır. Kayıt birkaç KB tutar.
- Sıra: önce hayalet yarış, tutarsa aynı kayıt biçimiyle canlı oda.

## Kazanan ölçütü
- **Önerilen ölçüt** (Codex ve planlama editörü aynı fikirde):
  1. Kazananı **tek koşuda ulaşılan en uzak kule** belirler.
  2. Eşitlikte en iyi tek koşu puanına bakılır.
  3. O da eşitse oraya daha erken ulaşan kazanır.
- **Toplam puan neden ölçüt olmamalı:** "Çok deneme yapan, hızlı ve riskli zıplayan" kazanır. Toplam puan sonuç ekranında yalnızca istatistik olarak gösterilir.

## Düşünce ne olacak
- Kullanıcının fikri: baştan başlamak. Uygun, çünkü bugünkü koşu yapısına uyuyor.
- Planlama editörünün alternatifi: **son geçilen duraktan devam etmek**, 2–3 sn ceza ile.
  - Gerekçe: Baştan başlamak hep aynı ilk 15 kuleyi tekrar oynatır. Köprü, gece ve pijama kısımları 3 dakikada nadiren görülür.
  - Kullanıcı kararı bekleniyor.

## Teknik bulgu (doğrulandı)
- **Sorun: aynı tohum, farklı iPhone genişliklerinde kuleleri aynı x konumuna koymuyor.**
  - Kaynak: `src/game/procedural-course.ts:124-131`. Boşluk `jumpVelocity(1, screenWidth)` ile sınırlanıyor.
  - Bu yüzden hayalet mutlak koordinatla değil, **kule kimliği + kule üstündeki oran** ile gönderilmeli.
- **Olay biçimi:** `{t, tür: zıpla/indi/düştü/yeniden, from, to, r}`.
  - Kaynak iniş bloğu: `app/index.tsx` ~1730-1793.
  - Alıcı fiziği yeniden hesaplamaz; basit bir yay animasyonu çizer.
- **Ekran dışındaki rakip:** üstte ince ilerleme şeridi ("sen ●──○ rakip, kule 47"). Mevcut köprü şeridi kalıp olarak kullanılabilir.

## Uzun anlar
Codex ve planlama editörü aynı fikirde:
- **Pijama kapısı:** dokunmayı ~1,5 sn kilitliyor. Yarışta kapalı olmalı, ya da yalnızca şapka anında değişmeli.
- **Durak afişi:** kısa olmalı ve dokunmayı engellememeli.
- **Kartpostal ve konfeti:** yarış sırasında kapalı olmalı. Kazanılan kartlar sonuç ekranında gösterilir.
- **Kurukafa:** tohumdan geldiği için iki oyuncuya da adil.

## Riskler
- **Saat:** yalnızca oyun önündeyken saymalı. Telefon araması gibi bir kesintide koşu geçersiz sayılmalı.
- **Hile:** gelen kayıt doğrulanamaz; arkadaş ortamında kabul edilebilir.
- **Kod yapısı:** `onGameOver` şu an ilk düşüşte oyunu bitiriyor. Yarış için hafif ve ayrı bir "yeniden doğ" yolu gerekir. Sonuç ekranı ve finishChallenge yalnızca süre bitince çalışmalı.

## İlk sürüm (MVP), tahmini 4–6 gün
1. "Yarış" modu: 180 sn sayaç, düşüşte yeniden başlama, süre bitince sonuç ekranı.
2. Zıplama kaydı.
3. Kaydın meydan okuma verisiyle gönderilmesi.
4. Alıcı tarafta hayalet amca, ilerleme şeridi ve en uzak kule karşılaştırması.
5. Pijama kapısı, kartpostal ve konfetinin yarışta kapatılması.

## Kullanıcı kararları
1. Hayalet yarış ile başlansın mı, yoksa doğrudan canlı oda mı yapılsın?
2. Kazanan: en uzak kule mi (önerilen), toplam puan mı?
3. Düşünce: baştan mı (kullanıcı fikri), son duraktan mı?
