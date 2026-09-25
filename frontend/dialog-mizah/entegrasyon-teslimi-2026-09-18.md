# Diyalog Atölyesi — Entegrasyon Teslimi (2026-09-18)

Durum: Kullanıcı tarafından metin olarak onaylandı. Bu dosya yalnız teknik entegrasyon paketidir — oyun koduna dokunulmadı, gerçek bildirim gönderilmedi. Entegrasyonu Carsamba Atölye (matematik/teknik) yapacak.

Kaynak kararlar: shared/GAME_STUDIO.md → DIYALOG-005-R2 ve DIYALOG-006 (2026-09-18 kullanıcı seçimleri).

---

## Paket 1 — Arkadaş sıralaması bildirimi

**Nihai metin:** `@mert tam şarjla rekorunu geçti.`
(Şablon: `{arkadas} tam şarjla rekorunu geçti.`)

| Alan | Değer |
|---|---|
| Kullanım yeri | Push/in-app bildirim (oyun dışı da görünebilir bildirim kanalı) — sonuç ekranı veya oyun içi bir metin DEĞİL. |
| Tetikleyici olay | Bir arkadaş, oyuncunun mevcut kişisel rekorunu **geçtiği an** (rank-crossing anı). Zaten önde olan bir arkadaşın sonraki rekor artışlarında yeniden tetiklenmez — yalnızca "öne geçme" olayında bir kez. (Karar: GAME_STUDIO.md satır 42.) |
| Gerekli değişkenler | `{arkadas}` — arkadaşın kullanıcı adı. Skorun/rekorun sayısal değeri metinde YOK; tasarım kasıtlı olarak sayısız. |
| `{arkadas}` yerleştirme biçimi | Cümle başında, tek değişken: `{arkadas} tam şarjla rekorunu geçti.` Üretim sürecinde `@mert` placeholder olarak kullanıldı; gerçek entegrasyonda `@` işaretinin kullanıcı adının bir parçası mı yoksa yalnızca üretim placeholder'ı mı olduğu netleşmeli (aşağıda teknik soru 1). |
| Uzun kullanıcı adında taşma/kısaltma önerisi | Placeholder ile metin 32 karakter (`@mert` dahil). Gerçek kullanıcı adları değişken uzunlukta olabilir. Öneri: toplam metin belirli bir eşiği (örn. ~40 karakter) aşarsa yalnızca `{arkadas}` kısmı sonu `…` ile kısaltılsın, cümlenin geri kalanı (`tam şarjla rekorunu geçti.`) sabit ve bozulmadan kalsın. Kesin eşik ve kısaltma noktası atölyenin bildirim/OS kısıtlarına göre belirlenmeli (aşağıda teknik soru 2). |
| Tekrar sıklığı / spam riski | Mevcut kural: aynı arkadaş zaten öndeyken her rekor artışında tekrar bildirim gönderilmez. "Sık karşılıklı geçişler birleştirilir" kararı var ama kesin bekleme/debounce süresi henüz belirlenmedi (GAME_STUDIO.md satır 42) — bu metin o mekanizmayı değiştirmez, aynen kullanır. |
| Bildirim mi, oyun içi metin mi | **Bildirim.** |
| Diğer not | Bildirimler kullanıcı tarafından kapatılabilir olmalı (önceden kararlaştırıldı); bu paket bildirim ayarları ekranını kapsamıyor. |

---

## Paket 2 — Düşüş sonrası sonuç ekranı satırı

**Nihai metin:** `Havada emindin, yerde şaşkındın.`

| Alan | Değer |
|---|---|
| Kullanım yeri | Sonuç ekranı (game-over screen), oyun içi statik metin. Düğme metni veya push bildirimi DEĞİL. |
| Tetikleyici olay | Başarısız iniş/düşüşle biten HER tur. Skor eşiği, yeni rekor, arkadaş sırası veya ölüm animasyonu şartı yok — her düşüşte kullanılabilir. |
| Gerekli değişkenler | **Yok.** Metin tamamen statik; kullanıcı adı, skor veya başka bir sayısal/isimsel değişken içermiyor. |
| `{arkadas}`/kullanıcı adı yerleştirme | Uygulanamaz (N/A) — metin kişiye özel değil. |
| Uzun kullanıcı adında taşma | Uygulanamaz — sabit 32 karakter, taşma riski yok. |
| Tekrar sıklığı / spam riski | Şu an tek sabit satır; her düşüşte birebir aynı metin gösterilecek. Sık tekrar oynama (oyunun temel döngüsü) düşünüldüğünde aynı satırın art arda defalarca çıkması yorucu olabilir. Bu paket bunu çözmüyor — aşağıda teknik soru 5 olarak bırakıldı. |
| Bildirim mi, oyun içi metin mi | **Oyun içi metin** (sonuç ekranı). |

---

## Yedek aday (ana pakete dahil değil)

**Metin:** `Skorun rahat bir nefes aldı.` (D6-4)
Durum: Kullanıcı tarafından "yedek aday" olarak korundu, şu an entegre edilmiyor. Aynı kullanım yeri/tetikleyici (düşüş sonrası sonuç ekranı) geçerli olurdu; değişken gerektirmiyor. İleride D6-2 ile birlikte bir rotasyon/havuz sistemi kurulursa ikinci üye olarak eklenebilir — bkz. teknik soru 5.

---

## Atölyenin entegrasyon sırasında cevaplaması gereken teknik sorular

1. Bildirimde `{arkadas}` kullanıcı adı `@` işaretiyle mi gösterilecek (ör. `@mert`) yoksa düz isimle mi (ör. `Mert`)? Bu, uygulamanın genel bildirim tipografi standardına bağlı, diyalog metninin bir parçası değil.
2. Uzun kullanıcı adlarında toplam metin taşarsa: OS'un kendi native kırpmasına mı güvenilecek, yoksa uygulama tarafında sabit bir kısaltma mı uygulanacak? Kesin karakter eşiği ve kısaltma noktası ne olmalı?
3. "Sık karşılıklı geçişler birleştirilir" kuralının kesin bekleme/debounce süresi ne olacak? Bu, Paket 1'in ne sıklıkla tetiklenebileceğini doğrudan belirliyor.
4. Bildirim kapatma/susturma ayarı bu bildirim türü için ayrı bir anahtar mı olacak, yoksa genel bildirim ayarının bir parçası mı?
5. Paket 2 tek sabit satır olarak mı entegre edilecek, yoksa D6-4'ü (yedek) de içeren bir rotasyon/havuz mimarisi şimdiden mi kurulacak (ileride yeni onaylı satırlar eklendiğinde genişleyebilecek bir yapı)?
6. Paket 1'de skor/rekor sayısal değeri kasıtlı olarak yok — bu onaylanıyor mu, yoksa entegrasyon sırasında sayısal bir değer (ör. fark puanı) eklenmesi isteniyor mu? İsteniyorsa metnin kendisi yeniden yazılmalı, bu teslimin kapsamı dışında.
7. Lokalizasyon/i18n altyapısı bu iki metin için nasıl ele alınacak (şu an yalnızca Türkçe) — mimariyi etkileyebilir, kapsam dışı ama not düşüldü.

---

Kod değişmedi, gerçek bildirim gönderilmedi. Bu dosya yalnız teknik teslimdir; nihai entegrasyon kararı ve uygulaması Carsamba Atölye'ye aittir.
