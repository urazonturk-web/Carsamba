import { Image as CachedImage } from "expo-image";
import { NoClipImage as Image } from "./NoClipImage";

// REVIZYON-072: same switch as LIVE_RN_IMAGE in app/index.tsx (kept in step by
// hand). expo-image's always-clipping ImageView makes Fabric mask each pose
// image -> one offscreen pass per pose layer per frame. React Native's Image
// draws the same source with resizeMode "stretch" (== contentFit "fill").
const LIVE_RN_IMAGE = true as boolean;
import Animated, { useAnimatedStyle, type SharedValue } from "react-native-reanimated";

import { CHARGE_POSES, poseOpacity } from "./character-pose";

type Props = {
  px: SharedValue<number>;
  py: SharedValue<number>;
  poseCharge: SharedValue<number>;
  scale: number; // world units per sprite pixel
  feetCenterOffset: number; // physical sole-span centre relative to px
  feetHalf: number; // py + feetHalf = physical feet line
  // GORSEL-017 (2026-09-23): visual-only landing squash driver. 0 = normal,
  // 1 = max compression, negative = a slight upward/backward overshoot
  // during recovery. Purely cosmetic -- see the withSequence trigger in
  // app/index.tsx's landing-contact block for why this cannot affect
  // physics (py/vx/vy and the resolved landing point are already committed
  // before this value is even set).
  landPulse?: SharedValue<number>;
  // FAZ2 (2026-11-11): thin warm-white halo so the character reads against
  // the sea and the busy facades. Four tinted silhouette copies offset by
  // HALO_PX inside the pose's own animated view: no extra mapper, no shadow
  // (shadows force an offscreen pass on iOS), invisible with the pose.
  halo?: boolean;
  // PATLAMA EŞİĞİ (2026-11-12): tam şarj penceresinde 0..1 ilerleme (-1 = yok).
  // Amca titrer ve hafifçe şişer; yalnız transform.
  strain?: SharedValue<number>;
  onLoad?: () => void;
  onLoadStart?: () => void;
  onError?: () => void;
};

const HALO_PX = 9; // sprite pixels
const HALO_COLOR = "rgba(255,248,230,0.8)";
const HALO_OFFSETS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function PoseLayer({ i, px, py, poseCharge, scale, feetCenterOffset, feetHalf, landPulse, halo, strain, ...cb }: Props & { i: number }) {
  const pose = CHARGE_POSES[i];
  const style = useAnimatedStyle(() => {
    // Squash toward the FOOT line (feetHalf), not the sprite's own center,
    // so the compression reads as "sinking into the landing surface"
    // instead of shifting the character's screen position. sq<1 = shorter/
    // wider (compression); sq>1 = a touch taller (the brief recovery
    // overshoot) -- see the comment on `landPulse` above.
    const pulse = landPulse ? landPulse.value : 0;
    const sq = 1 - pulse * 0.14;
    const bulge = 1 + pulse * 0.08;
    const height = pose.h * scale;
    const extraY = (height * (1 - sq)) / 2;
    const k = strain ? strain.value : -1;
    const jitter = k >= 0 ? Math.sin(k * 95) * (1.5 + 5 * k) : 0;
    const swell = k >= 0 ? 1 + 0.035 * k + 0.015 * Math.sin(k * 40) : 1;
    return {
      opacity: poseOpacity(i, poseCharge.value),
      transform: [
        { translateX: px.value + feetCenterOffset - pose.pivotX * scale + jitter },
        { translateY: py.value + feetHalf - pose.pivotY * scale + extraY },
        { scaleY: sq },
        { scaleX: bulge * swell },
      ],
    };
  });
  return (
    <Animated.View
      testID={`charge-pose-${i}`}
      pointerEvents="none"
      style={[{ position: "absolute", left: 0, top: 0, width: pose.w * scale, height: pose.h * scale }, style]}
    >
      {halo && LIVE_RN_IMAGE
        ? HALO_OFFSETS.map(([dx, dy], k) => (
            <Image
              key={`h${k}`}
              source={pose.source}
              resizeMode="stretch"
              fadeDuration={0}
              tintColor={HALO_COLOR}
              style={{ position: "absolute", left: dx * HALO_PX * scale, top: dy * HALO_PX * scale, width: "100%", height: "100%" }}
            />
          ))
        : null}
      {LIVE_RN_IMAGE ? (
        <Image
          source={pose.source}
          resizeMode="stretch"
          fadeDuration={0}
          style={{ width: "100%", height: "100%" }}
          onLoadStart={cb.onLoadStart}
          onLoad={cb.onLoad}
          onError={cb.onError}
        />
      ) : (
        <CachedImage
          cachePolicy="memory-disk"
          priority="high"
          transition={0}
          source={pose.source}
          style={{ width: "100%", height: "100%" }}
          contentFit="fill"
          onLoadStart={cb.onLoadStart}
          onLoad={cb.onLoad}
          onError={cb.onError}
        />
      )}
    </Animated.View>
  );
}

export function ChargePoses(props: Props) {
  return (
    <>
      {CHARGE_POSES.map((_, i) => (
        <PoseLayer key={i} i={i} {...props} />
      ))}
    </>
  );
}
