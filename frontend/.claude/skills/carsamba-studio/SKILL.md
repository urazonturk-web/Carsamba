---
name: carsamba-studio
description: Carsamba oyununda çalışma düzenini standardize eder — hangi görevin hangi "atölye"ye ait olduğunu, karar/kanıt kayıtlarının nereye yazılacağını ve hangi sınırların değiştirilemeyeceğini belirler. GORSEL-*, DIYALOG-*, GAME_STUDIO.md, AI_REVIEW.md ile ilgili herhangi bir Carsamba görevine başlarken, ya da hangi atölyenin sorumlu olduğu belirsizse kullan.
---

# Carsamba Studio — çalışma düzeni

Bu beceri **genel bir agent paketi değildir**; yalnızca bu proje (Carsamba) için rol/kayıt/sınır tanımlarını tek yerde toplar. Yeni bir kod, asset veya davranış üretmez — mevcut çalışma biçimini standardize eder.

## Dört atölye

- **Atölye** — kod ve entegrasyon (fizik, oynanış, UI, asset'lerin koda bağlanması). Ana geliştirici rolü budur.
- **Görsel** — asset üretimi (sprite, arka plan, çevre elemanları). Asset'i üretmez, üretilmiş asset'i teslim alıp **entegre eder**.
- **Diyalog** — metin/yazı (oyun içi replikler, bildirimler, kopya metni). `src/game/copy.ts` gibi merkezi sabitlere yazılır.
- **Antigravity** — salt-okunur QA/tanı. Kod değiştirmez; yalnız okur, ölçer, teşhis eder (örn. koordinat/render zinciri incelemesi). Bulgusu bir sonraki adımı belirler, kendisi düzeltme yapmaz.

Bir görev hangi atölyeye aitse yalnız onun sınırları içinde kal; diğer atölyelerin açık görevlerine, dosyalarına veya kararlarına müdahale etme.

## İki kayıt dosyası, iki farklı amaç

- **`GAME_STUDIO.md`** — karar ve kapsam kaydı: hangi görsel/diyalog/tasarım kararı alındı, hangi aşamadayız, sıradaki teslim ne. `TESLIM_HAZIR:` satırları buraya yazılır (bkz. aşağıdaki kural).
- **`AI_REVIEW.md`** — teknik kanıt kaydı: ölçüm, kod değişikliği, test sonucu, açık risk. Fizik/matematik incelemeleri için ayrıca `physics-evidence` becerisindeki yöntemi kullan (gerçek kodu çalıştır, gözlem/ölçüm/varsayım/simülasyon ayrımını koru).

İkisini karıştırma: bir karar `AI_REVIEW.md`'ye, bir ölçüm/kanıt `GAME_STUDIO.md`'ye yazılmaz.

## TESLIM_HAZIR satırı

Bir iş **gerçekten bittiğinde** (ara ilerleme değil), `GAME_STUDIO.md`'nin SONUNA tek satır ekle:

```
TESLIM_HAZIR: <görev kimliği> — <teslimin kısa adı ve dosya/rapor konumu>; <bekleyen kullanıcı kararı varsa belirt>.
```

Bu satır koordinasyon tarafının otomatik bildirim alması içindir.

## Platform sırası

Doğrulama ve kabul her zaman **önce iPhone, sonra Android** sırasıyla ilerler. Android henüz doğrulanmamışsa bunu açıkça "doğrulanmadı" diye belirt; iPhone sonucunu Android için de geçerliymiş gibi sunma.

## Asset entegrasyonu kuralı

Kullanıcı kabulü olmadan hiçbir asset seti **aktif** (gerçek render ağacına bağlı) hale getirilmez. Kullanıcı bir set için "kabul edildi" demeden onu placeholder olarak bile oyuna bağlama; mimariyi/planı hazırlamak serbesttir, asset'i bağlamak değildir.

## Asset teslim raporu zorunlu alanları

Bir asset entegre edildiğinde `AI_REVIEW.md` girdisinde şu dört alan bulunmalı:
1. **Dosya** — hangi PNG/kaynak, nereden kopyalandı, nereye konuldu.
2. **Ölçü/pivot** — piksel ölçüleri, pivot/ankor noktası, hangi yöntemle (alpha taraması, JSON) belirlendiği.
3. **Katman** — z-sırası, hangi bileşenin neyin önünde/arkasında çizildiği, karışım/geçiş yöntemi.
4. **Risk** — bilinen sınırlama, cihazda doğrulanmamış nokta, olası yan etki.

## Değişmeyen çekirdek (yeni kanıt olmadan)

Şunlar bir görevin doğal kapsamı içinde bile **varsayılan olarak değişmez**; değiştirmek için ayrı, açık kullanıcı onayı ve yeni kanıt/ölçüm gerekir:
- fizik sabitleri ve formülleri (`src/game/config.ts`, `jump.ts`, `landing.ts`)
- collision / `footSoles`
- procedural course üretimi (`procedural-course.ts`, `reference-course.ts`)
- camera
- charge → jump → landing matematiği (charge okuma, launch power hesabı, iniş tespiti)

Bir görev bu dosyalardan birine dokunmayı gerektiriyor gibi görünüyorsa, önce durup kullanıcıya sor.

## GORSEL-009 zorunlu kısıtları

GORSEL-009 (veya onu genişleten bir görev) kapsamında:
- Paralaks katmanları **ayrı PNG dosyaları** olarak gelir/entegre edilir (tek düzleştirilmiş görsel değil).
- Kolon üstü **düz ve okunaklı** olmalı (karakterin iniş yaptığı yüzey net seçilebilir olmalı).
- Kediler (veya benzer dekoratif hareketli öğeler) **çarpışma/iniş yolundan uzak** konumlandırılmalı; footSoles/iniş tespiti alanına görsel olarak bile girmemeli.

## Commit/push/deploy

Yalnızca kullanıcının o an açıkça istediği durumda yapılır. Bir önceki onay bir sonraki değişiklik için geçerli sayılmaz.
