#!/bin/zsh
set -e

cd "${0:A:h}/.."

# Resolve the Mac's Wi-Fi address so Expo Go uses a reachable LAN URL.
lan_ip="$(ifconfig en0 | awk '/inet / { print $2; exit }')"
if [[ -z "$lan_ip" ]]; then
  echo "Wi-Fi (en0) adresi bulunamadı. Mac ve iPhone aynı Wi-Fi ağına bağlı olmalı." >&2
  exit 1
fi

# 8081 may still host an older headless Expo session. This interactive
# session uses 8082, and the user should scan the QR printed below.
if lsof -nP -iTCP:8082 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "8082 bağlantı noktası zaten kullanılıyor. Önce o Expo oturumunu kapat." >&2
  exit 1
fi

unset CI EXPO_UNSTABLE_HEADLESS EXPO_OFFLINE
export EXPO_NO_TYPESCRIPT_SETUP=1
export EXPO_NO_INSPECTOR_PROXY=1
export REACT_NATIVE_PACKAGER_HOSTNAME="$lan_ip"

echo "Carsamba Expo Go: exp://$lan_ip:8082"
echo "Bu Terminal açıkken r tuşu oyunu yeniler; Enter gerekmez."
exec npx expo start --lan --port 8082 --max-workers 1
