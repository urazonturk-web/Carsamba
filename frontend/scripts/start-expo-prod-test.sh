#!/bin/zsh
# REVIZYON-070-A (2026-11-07): aynı oyun kodunu Expo Go'da geliştirme modu
# KAPALI (--no-dev --minify) açar. Oyun kodunu değiştirmez. Karşılaştırma
# tabanı: scripts/start-expo-interactive.sh (8082, geliştirme modu).
set -e

cd "${0:A:h}/.."

lan_ip="$(ifconfig en0 | awk '/inet / { print $2; exit }')"
if [[ -z "$lan_ip" ]]; then
  echo "Wi-Fi (en0) adresi bulunamadı. Mac ve iPhone aynı Wi-Fi ağına bağlı olmalı." >&2
  exit 1
fi

if lsof -nP -iTCP:8083 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "8083 bağlantı noktası zaten kullanılıyor. Önce o Expo oturumunu kapat." >&2
  exit 1
fi

unset CI EXPO_UNSTABLE_HEADLESS EXPO_OFFLINE
export EXPO_NO_TYPESCRIPT_SETUP=1
export EXPO_NO_INSPECTOR_PROXY=1
export REACT_NATIVE_PACKAGER_HOSTNAME="$lan_ip"

echo "Carsamba R070-A (URETIM MODU: --no-dev --minify): exp://$lan_ip:8083"
echo "Telefonda eski oturum önbellekte kalmasın: Expo Go'yu tamamen kapatıp bu QR'ı okut."
exec npx expo start --lan --port 8083 --max-workers 1 --no-dev --minify --clear
