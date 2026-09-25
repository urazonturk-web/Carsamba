import { Image as CachedImage } from "expo-image";
import Animated, { useAnimatedStyle, type SharedValue } from "react-native-reanimated";

import { CHARGE_POSES, poseOpacity } from "./character-pose";

type Props = {
  px: SharedValue<number>;
  py: SharedValue<number>;
  poseCharge: SharedValue<number>;
  scale: number; // world units per sprite pixel
  feetCenterOffset: number; // physical sole-span centre relative to px
  feetHalf: number; // py + feetHalf = physical feet line
  onLoad?: () => void;
  onLoadStart?: () => void;
  onError?: () => void;
};

function PoseLayer({ i, px, py, poseCharge, scale, feetCenterOffset, feetHalf, ...cb }: Props & { i: number }) {
  const pose = CHARGE_POSES[i];
  const style = useAnimatedStyle(() => ({
    opacity: poseOpacity(i, poseCharge.value),
    transform: [
      { translateX: px.value + feetCenterOffset - pose.pivotX * scale },
      { translateY: py.value + feetHalf - pose.pivotY * scale },
    ],
  }));
  return (
    <Animated.View
      testID={`charge-pose-${i}`}
      pointerEvents="none"
      style={[{ position: "absolute", left: 0, top: 0, width: pose.w * scale, height: pose.h * scale }, style]}
    >
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
