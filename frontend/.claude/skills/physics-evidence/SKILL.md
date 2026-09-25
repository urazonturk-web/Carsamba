---
name: physics-evidence
description: Carsamba oyun fiziği/kule üretimi/iniş incelemelerinde kanıt betiği yazma ve AI_REVIEW.md'ye teslim etme yöntemi. Zıplama, şarj, kule/kolon üretimi, iniş, çarpışma, skor veya bunlarla ilgili bir video/kayıt incelemesi istendiğinde kullan.
---

# Fizik kanıtı (Carsamba)

Bu beceri yalnızca **matematik/fizik incelemesi** kapsamındadır. Görsel atölye (GORSEL-*) ve diyalog atölyesi (DIYALOG-*) görevlerine, `GAME_STUDIO.md`'ye veya bu iki atölyenin `AI_REVIEW.md` dışındaki teslimlerine müdahale etme.

## Zorunlu kural: gerçek kodu çalıştır, formülü kopyalama

Her sayısal iddia, `src/game/config.ts` / `jump.ts` / `landing.ts` / `procedural-course.ts` / `reference-course.ts`'in **gerçek export edilen fonksiyonlarını** çağırarak üretilmeli. Fizik formülünü elle yeniden yazma — Codex bunu geçmişte defalarca (haklı olarak) reddetti.

**Yükleme yöntemi (mevcut kodla doğrulanmış, varsayılan)**: `ts.transpileModule` + `vm.runInNewContext`, sahte `./config`/`./jump` `require`'ları ile. Yeni bir betik yazmak yerine mevcut bir örneği kopyala ve uyarla:
- Kule/iniş/sıralı oynanış testleri → `ai_review_evidence/sim_course_variety_v2.cjs` veya `ai_review_evidence/sim_measured_jump.cjs`'i şablon al.
- Bu yöntem `config.ts`/`jump.ts`/`landing.ts`/`procedural-course.ts` için doğrulanmıştır (bu dosyalarda `react-native-reanimated` importu yok, yalnız `"worklet";` etiketi var — düz Node içinde çalıştırılabilirler). Yeni bir dosya bu setin dışına (örn. `app/index.tsx` içine taşınan bir fonksiyon, ya da React Native/Reanimated importu olan bir dosya) taşınırsa, önce `grep -n "^import" <dosya>` ile importları kontrol et; bu yöntem uygun değilse (gerçek React Native modülü gerekiyorsa) kullanıcıya bildirip ilerleme — şablonu körü körüne uygulama.

**Önemli sınır — worklet sıra hatası bu yöntemle YAKALANMAZ**: `ts.transpileModule` düz fonksiyon/const bildirimi üretir, gerçek `react-native-worklets` eklentisinin yaptığı const-IIFE sarmalamasını YAPMAZ. Yani bu yöntemle geçen bir test, worklet bildirim SIRASININ (bkz. `AI_REVIEW.md`'deki `classifyGap`/`classifyHeight` çökme geçmişi) güvenli olduğunu KANITLAMAZ. Bildirim sırası/closure güvenliği sorusu varsa `ai_review_evidence/test_worklet_order_regression.cjs`'deki ayrı, gerçek `babel-preset-expo` + açık iOS/Metro/Hermes `caller` yöntemini kullan (daha ağır, yalnız bu soruya cevap verir). İkisini birbirinin yerine geçmiş gibi sunma.

## Zorunlu ayrım: gözlem / ölçüm / varsayım / simülasyon sonucu

Rapor yazarken bu dördünü asla birbirine karıştırma, her birini etiketle:
- **Gözlem**: videoda/ekranda doğrudan görülen (zaman damgası ile).
- **Ölçüm**: piksel tarama veya gerçek koddan hesaplanan sayı — yöntemi ve hata payını belirt.
- **Varsayım**: doğrulanmamış çıkarım — açıkça "doğrulanmadı" de.
- **Simülasyon sonucu**: gerçek kodun çalıştırılmasından çıkan sayı — hangi girdilerle (charge, konum, sabitler) üretildiğini yaz.

## Zorunlu ayrım: ulaşılabilirlik araması ≠ sabit basış tekrarı

- **Ulaşılabilirlik/başarılı-pencere araması** (bir aralıktaki basışlardan en az biri hedefe ulaşıyor mu) ile **sabit girdi tekrarı** (aynı basış süresiyle art arda kaç kule aşılıyor) FARKLI testlerdir. İkisini tek bir "geçti/kaldı" sonucunda birleştirme; ayrı başlıklar altında, hangisi olduğunu adıyla belirterek raporla (bkz. `sim_course_variety_v2.cjs` bölüm 5 vs 6).

## Teslimden önce doğrula

`AI_REVIEW.md`'ye yazmadan önce:
1. Raporda adı geçen her kanıt dosyasının gerçekten diskte olduğunu kontrol et (`ls ai_review_evidence/...`).
2. O dosyayı BU round'da gerçekten çalıştır (`node ai_review_evidence/<dosya>.cjs`) ve rapora yazdığın sayıların çıktıyla birebir eştiğini doğrula — çalıştırmadığın bir betiğin sonucunu aktarma.
3. Masaüstü simülasyonu veya Babel/Metro dönüşüm testi sonucu **gerçek iPhone/cihaz doğrulaması olarak sunma**. HTTP 200 ile bir bundle'ın sunulmuş olması, Babel/closure testinin geçmesi ve masaüstü Node'da çalıştırma — üçü de yalnızca kendi kapsamlarını kanıtlar; hiçbiri gerçek cihazda Hermes/JSI üzerinde çalıştığını GÖSTERMEZ. Raporda "cihazda test edilmedi" / "video/masaüstü inceleme, cihaz onayı değil" ifadesini bırak; bunlardan birinin diğerinin yerine kanıt sayılabileceğini ima etme.
4. **"Bu görevde kod değiştirilmedi" iddiası, dosya yolu + içerik özeti (SHA-256) karşılaştırmasıyla kurulur.** `git status --porcelain` iki çıktının BİRBİRİYLE AYNI olması dosya İÇERİĞİNİN değişmediğini kanıtlamaz (ör. bir dosya değiştirilip görev sonunda tam olarak eski hâline geri getirilebilir, veya git tarafından hiç izlenmeyen bir dosya git status'ta hiç görünmez). Bunun yerine:
   - Göreve başlarken kapsamdaki oyun kodu ağacının (`app/`, `src/game/`) TÜM dosyalarının (yalnız git'in izlediği değil, İZLENMEYEN/yeni dosyalar dahil) yol + SHA-256 özetini kaydet, örn.: `find app src/game -type f | sort | xargs shasum -a 256 > /tmp/scope_start.txt`.
   - Görev biterken AYNI komutu tekrar çalıştır (`/tmp/scope_end.txt`) ve `diff /tmp/scope_start.txt /tmp/scope_end.txt` ile karşılaştır. Bu, içerik değişikliğini (özet farklı), yeni eklenen dosyayı (yalnız sonda var) ve silinen dosyayı (yalnız başta var) tek bir karşılaştırmada yakalar.
   - `git status`/`git diff` yalnızca YARDIMCI bilgi olarak kullanılabilir (örn. hangi dosyaların git tarafından izlendiğini görmek için) — tek başına "içerik değişmedi" kanıtı sayılmaz.
   - Göreve başlarken bu kaydı almadıysan, göreve sonradan geriye dönük olarak "bu turda kod değişmedi" gibi kesin bir iddia YAZMA; bunun yerine "görev başlangıcında dosya özeti alınmadı, bu nedenle bu turda değişip değişmediği bağımsız doğrulanamadı" gibi dürüst bir sınırlama yaz.
   - Karşılaştırmada fark bulunursa, HANGİ dosyanın (yol) değiştiğini/eklendiğini/silindiğini adıyla bildir. Bu farkın kimin tarafından yapıldığını YALNIZCA bu karşılaştırmadan çıkarma — aynı depo üzerinde eşzamanlı çalışabilecek başka bir oturum (Codex, başka bir Claude sohbeti) yapmış olabilir; emin değilsen öyle yaz, kendi turunun sonucu gibi sunma.

## Teslim biçimi (iki ayrı kural)

**A) Yeni bölüm — dosyanın SONUNA eklenir.** Yeni bir rapor yazarken dosyanın başına veya STATUS satırının hemen altına EKLEME; tarihli yeni bir `## <başlık> — <tarih>` bölümünü dosyanın EN SONUNA ekle (mevcut TASK/CHANGED/EVIDENCE/OPEN_ISSUES/NEXT/CLAUDE_UPDATE alt-başlık sırasını kendi bölümün içinde koru, `CODEX_REVIEW` alanına yazma). Var olan bölümlerin yerini DEĞİŞTİRME/taşıma — yalnız yeni bölüm ekle.
**B) `STATUS:` alanı — YERİNDE güncellenir, bu (A)'dan tamamen ayrı bir kuraldır.** Dosyanın en başındaki tek `STATUS:` satırı bir bölüm değildir; her raporun sonunda mevcut değeri (`READY_FOR_CODEX` / `READY_FOR_CLAUDE` / `WAITING_FOR_USER`) gerektiği gibi doğrudan o satırı düzenleyerek güncelle — yeni bir STATUS bölümü eklemeye çalışma.

Kullanıcı açıkça istemedikçe commit/push yapma, kule/fizik sabitlerini değiştirme.
