# R070-B hazırlık — Expo Go dışı iPhone derlemesi (2026-11-08)

**Amaç:** Takılmanın (video dur+sıçra %7,3–7,9) Expo Go'dan mı, 60 Hz sınırından mı, yoksa oyunun kendi render yolundan mı geldiğini ayırmak. Oyun kodu, fizik, kamera, çatı değişmez.

## 1. Mevcut durum (bu Mac'te ölçüldü)

| Gereksinim | Durum |
|---|---|
| Xcode | ✅ 27.2 (27B52) `/Applications/Xcode.app`, ilk açılış tamam, iOS platformu kurulu |
| Instruments (`xctrace`) | ✅ 27.2 çalışıyor (`DEVELOPER_DIR` ile) |
| Etkin geliştirici dizini | ⚠️ hâlâ Command Line Tools. **sudo gerekmez**: komutlar `DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer` ile çalıştırılır |
| iPhone | ✅ "Uraz III" iPhone 16 Pro Max daha önce eşleştirilmiş; şu an bağlı değil |
| CocoaPods | ❌ kurulu değil (Expo SDK 58 iOS derlemesi kullanıyor). `brew install cocoapods` (1.17.0) |
| İmzalama kimliği | ❌ 0 (Xcode'da Apple ID oturumu yok) |
| Uygulama kimliği | ⚠️ `com.emergent.jumpcharge.lgnngw` — başka bir ekibe kayıtlı olabilir; kişisel ekiple çakışırsa imzalanamaz |
| `ios/` klasörü | yok (prebuild ile üretilecek) |
| Disk | 43 GB boş; derleme + Pods ≈ 5–8 GB |

## 2. Hesap seçeneği

- **Önerilen: ücretsiz Apple ID (Personal Team).** Para yok. Kendi iPhone'una kurulur; Instruments ölçümü yapılabilir. Sınırlar: imza 7 gün geçerli (sonra yeniden derle), aynı anda en fazla 3 uygulama, TestFlight/App Store yok.
- Ücretli Apple Developer Program (yıllık ücret) yalnız dağıtım (TestFlight/App Store) için gerekir; bu ölçüm için **gerekmez**.
- EAS Build (bulut) Expo hesabı + genelde ücretli Apple hesabı ister ve Instruments için yine yerel Xcode gerekir; bu aşamada gereksiz.

## 3. Senin yapacakların (hesap/parola/cihaz — ben yapamam)

1. iPhone'u kabloyla Mac'e bağla, kilidini aç, "Bu Bilgisayara Güven" de.
2. iPhone: **Ayarlar → Gizlilik ve Güvenlik → Geliştirici Modu → Aç** (telefon yeniden başlar, onayla).
3. Mac: **Xcode → Settings → Accounts → +** → Apple ID ile giriş yap (parolayı sen girersin). "Personal Team" görünmeli.
4. İlk kurulumdan sonra iPhone: **Ayarlar → Genel → VPN ve Aygıt Yönetimi** → kendi Apple ID'ne "Güven".

## 4. Onayınla benim yapacaklarım

1. `brew install cocoapods`.
2. `app.json` → `ios.bundleIdentifier` = `com.urazonturk.carsamba` (öneri; kişisel ekibe kayıtlanır). Oyun kodu değişmez. Yedek alınır.
3. `npx expo prebuild -p ios` → `ios/` üretilir (git'e eklenmez, yerel `exclude`).
4. `npx expo run:ios --device "Uraz III" --configuration Release` → telefonda ayrı **"frontend"** uygulaması (Expo Go'yu etkilemez). JS paketi uygulamanın içinde, Metro gerekmez.

## 5. Ölçüm planı (her adım tek değişken)

| Koşul | Değişen tek şey | Ölçüm |
|---|---|---|
| **B0** | Expo Go → yerel Release derleme (60 Hz, aynı JS) | ≥2 dk video (dur+sıçra %) + Instruments "Animation Hitches" izi (hitch sayısı/süresi, commit vs render) |
| **B1** | B0 + `Info.plist` `CADisableMinimumFrameDurationOnPhone = true` (120 Hz izni) | aynı video + iz |

- Karşılaştırma tabanı: Expo Go %7,3 (geliştirme) / %7,9 (üretim), SDK 58.
- B0 belirgin düşerse → sorun Expo Go ortamı; oyun yayını zaten kendi derlemesiyle olacağı için sorun büyük ölçüde kapanır.
- B0 aynı, B1 düşerse → 60 Hz / ProMotion faz sorunu; 120 Hz ayarı kalıcı aday.
- İkisi de aynıysa → Instruments izi, gecikmenin commit mi render mı olduğunu gösterir; sonraki tek değişkenli deney oradan seçilir.
- Kural: kör optimizasyon yok, olumsuz deney geri alınır, commit/push yalnız ayrı onayla.

## 6. Süre / maliyet / risk

- Maliyet: 0 (ücretsiz Apple ID). İlk derleme ~10–20 dk.
- Risk: ilk native derlemede bağımlılık/derleme hatası çıkabilir (RN 0.88 + Reanimated 4.7); çözüm ayrı kaydedilir. 7 günlük imza süresi dolunca uygulama açılmaz → yeniden derleme.
- Geri dönüş: `ios/` silinir, `app.json` yedekten döner; Expo Go akışı aynen çalışmaya devam eder.
