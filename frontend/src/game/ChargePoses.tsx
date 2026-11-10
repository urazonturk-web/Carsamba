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
  onLoad?: () => void;
  onLoadStart?: () => void;
  onError?: () => void;
};

function PoseLayer({ i, px, py, poseCharge, scale, feetCenterOffset, feetHalf, landPulse, ...cb }: Props & { i: number }) {
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
    return {
      opacity: poseOpacity(i, poseCharge.value),
      transform: [
        { translateX: px.value + feetCenterOffset - pose.pivotX * scale },
        { translateY: py.value + feetHalf - pose.pivotY * scale + extraY },
        { scaleY: sq },
        { scaleX: bulge },
      ],
    };
  });
  return (
    <Animated.View
      testID={`charge-pose-${i}`}
      pointerEvents="none"
      style={[{ position: "absolute", left: 0, top: 0, width: pose.w * scale, height: pose.h * scale }, style]}
    >
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
