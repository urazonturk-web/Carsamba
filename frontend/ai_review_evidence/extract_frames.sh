#!/bin/bash
# Reproducible frame extraction for the long-jump apex/rise reconciliation.
# Requires the bundled ffmpeg build used throughout this project's video forensics.
# Usage: ./extract_frames.sh
#
# Source recordings (paths as found on this machine; not part of the repo):
SRC_A="/Users/bekirurazonturk/Downloads/ScreenRecording_09-13-2026 11-12-55_1.MP4"   # Spring Ninja reference
SRC_B="/Users/bekirurazonturk/Downloads/ScreenRecording_09-15-2026 11-36-25_1.MP4"   # our game, fatal 379ms jump
FFMPEG="/Users/bekirurazonturk/Documents/Codex/2026-09-09/referenced-chatgpt-conversation-this-is-an/work/video/deps/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1"
OUT="$(dirname "$0")/frames"
mkdir -p "$OUT"

# HDR->SDR tonemap chain used throughout this project for these HEVC/bt2020 recordings.
TONEMAP="zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p"

# Each timestamp below is an INPUT SEEK (-ss before -i), which ffmpeg decodes
# accurately (not just to the nearest keyframe) with this ffmpeg build. The
# burned-in %{pts} text is the decoder's own presentation timestamp for the
# frame actually returned, so it is the ground truth for "what time is this
# frame really" rather than the requested -ss value.
extract () {
  local src="$1" ts="$2" out="$3"
  # -copyts preserves the original (pre-seek) presentation timestamps, so the
  # burned-in pts is the file's real timestamp, not reset to ~0 by the seek.
  "$FFMPEG" -y -ss "$ts" -copyts -i "$src" \
    -vf "$TONEMAP,drawgrid=w=25:h=25:t=1:c=red@0.35,drawtext=fontfile=/System/Library/Fonts/Supplemental/Arial.ttf:text='requested_ss=$ts  true_pts=%{pts}':fontsize=20:fontcolor=yellow:x=5:y=5:box=1:boxcolor=black@0.75" \
    -frames:v 1 -update 1 "$OUT/$out" 2>&1 | tail -1
}

# --- Jump A (Spring Ninja, kule6 -> kule8) ---
# Ascent: takeoff bracket + 12 frames through and past the visually apparent apex.
for ts in 38.653 38.670 38.687 38.703 38.720 38.737 38.753 38.770 38.787 38.803 38.820 38.837 38.853 38.870 38.887 38.903 38.920 39.070 39.100 39.150; do
  extract "$SRC_A" "$ts" "A_${ts}.png"
done
# First contact bracket (already established near 39.638-39.672 from prior rounds).
for ts in 39.622 39.638 39.655 39.672 39.688; do
  extract "$SRC_A" "$ts" "A_contact_${ts}.png"
done

# --- Jump B (our game, score4 tower, 379ms/84%) ---
for ts in 7.5167 7.5333 7.550 7.567 7.583 7.600 7.617 7.700 7.800 7.900 7.950 8.000 8.050 8.100 8.150 8.200; do
  extract "$SRC_B" "$ts" "B_${ts}.png"
done
# Miss / crossing bracket near the (unconfirmed-identity) target tower.
for ts in 8.600 8.700 8.800 8.900; do
  extract "$SRC_B" "$ts" "B_miss_${ts}.png"
done

echo "Done. Frames in: $OUT"
