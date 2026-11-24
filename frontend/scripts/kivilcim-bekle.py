#!/usr/bin/env python3
"""Kıvılcım (ChatGPT/Codex uygulaması) bir işi bitirince haber verir.

Kullanıcının "bitti, kontrol et" demesini beklemeden, Codex'in kendi oturum
kaydını (~/.codex/sessions/.../rollout-*.jsonl) izler. Dosya çok büyük
(GB'larca), bu yüzden yalnız başlangıçtan sonra eklenen baytlar okunur.

Olaylar (her satır JSON, payload.type):
  task_started   -> Kıvılcım işe başladı
  task_complete  -> iş bitti; last_agent_message = Kıvılcım'ın son mesajı
  turn_aborted   -> iş durduruldu (reason: interrupted vb.)

Kullanım:
  python3 -I scripts/kivilcim-bekle.py [--anahtar KAR-CEPHE] [--zaman-asimi 10800]
  --baslangic-bayt N : bu bayttan itibaren oku (mesaj göndermeden ÖNCE dosya
                       boyutunu alıp verirsen, gönderdiğin turu kaçırmazsın)
Çıkış kodu: 0 bitti, 2 durduruldu, 3 zaman aşımı.
"""
import argparse, glob, json, os, sys, time

KIVILCIM_ID = "01a085ea-ce49-7713-a84c-8c817907a5ce"  # "Kıvılcım — Çarşamba Oyun Koordinatörü"


def rollout_dosyasi():
    adaylar = glob.glob(os.path.expanduser(f"~/.codex/sessions/**/rollout-*{KIVILCIM_ID}*.jsonl"), recursive=True)
    if not adaylar:
        sys.exit("Kıvılcım oturum dosyası bulunamadı")
    return max(adaylar, key=os.path.getmtime)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--anahtar", help="yalnız kullanıcı mesajında bu metin geçen turu izle")
    ap.add_argument("--baslangic-bayt", type=int)
    ap.add_argument("--zaman-asimi", type=int, default=3 * 3600)
    ap.add_argument("--aralik", type=float, default=15)
    a = ap.parse_args()

    yol = rollout_dosyasi()
    konum = a.baslangic_bayt if a.baslangic_bayt is not None else os.path.getsize(yol)
    izlenen_tur = None
    artik = b""
    bitis = time.time() + a.zaman_asimi

    def izlenen_tur_mu(tur):
        if a.anahtar:  # anahtarlı mesaj görülmeden hiçbir bitiş sayılmaz
            return izlenen_tur is not None and izlenen_tur in ("?", tur)
        return izlenen_tur in (None, tur)
    print(f"izleniyor: {yol} (bayt {konum})", flush=True)
    while time.time() < bitis:
        boy = os.path.getsize(yol)
        if boy > konum:
            with open(yol, "rb") as f:
                f.seek(konum)
                veri = artik + f.read(boy - konum)
            konum = boy
            satirlar = veri.split(b"\n")
            artik = satirlar.pop()  # yarım kalan son satır
            for s in satirlar:
                try:
                    d = json.loads(s)
                except Exception:
                    continue
                p = d.get("payload") if isinstance(d.get("payload"), dict) else {}
                tip = p.get("type")
                tur = p.get("turn_id")
                if tip == "task_started":
                    print(f"{d.get('timestamp')} BASLADI tur={tur}", flush=True)
                    if not a.anahtar:
                        izlenen_tur = tur
                elif tip == "user_message" or (tip == "message" and p.get("role") == "user"):
                    metin = json.dumps(p, ensure_ascii=False)
                    if a.anahtar and a.anahtar in metin:
                        izlenen_tur = (p.get("internal_chat_message_metadata_passthrough") or {}).get("turn_id") or izlenen_tur or "?"
                        print(f"{d.get('timestamp')} MESAJ ALINDI ({a.anahtar})", flush=True)
                elif tip == "task_complete" and izlenen_tur_mu(tur):
                    print(f"{d.get('timestamp')} BITTI tur={tur}")
                    print("SON MESAJ:\n" + (p.get("last_agent_message") or ""))
                    return 0
                elif tip == "turn_aborted" and izlenen_tur_mu(tur):
                    print(f"{d.get('timestamp')} DURDURULDU tur={tur} neden={p.get('reason')}")
                    return 2
        time.sleep(a.aralik)
    print("ZAMAN_ASIMI")
    return 3


if __name__ == "__main__":
    sys.exit(main())
