import { View } from "react-native";
import Animated, { useAnimatedStyle, useFrameCallback, useSharedValue, type SharedValue } from "react-native-reanimated";

// Three small silhouettes: no texture downloads, timers, or per-frame React updates.
export function AmbientBirds({ width, height }: { width: number; height: number }) {
  const elapsed = useSharedValue(0);
  useFrameCallback(frame => {
    elapsed.value += Math.min(frame.timeSincePreviousFrame ?? 0, 50) / 1000;
  });
  return <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
    style={{ position: "absolute", top: 0, left: 0, width, height, overflow: "hidden" }}>
    {[0, 1, 2].map(index => <Bird key={index} index={index} elapsed={elapsed} width={width} height={height} />)}
  </View>;
}

function Bird({ index, elapsed, width, height }: { index: number; elapsed: SharedValue<number>; width: number; height: number }) {
  const position = useAnimatedStyle(() => ({
    transform: [
      { translateX: ((elapsed.value * (14 + index * 4) + width * index * 0.39) % (width + 48)) - 24 },
      { translateY: height * (0.22 + index * 0.09) + Math.sin(elapsed.value * 0.8 + index * 2) * 12 },
    ],
  }));
  const wings = useAnimatedStyle(() => ({ transform: [{ scaleY: 0.35 + (1 + Math.sin(elapsed.value * 9 + index * 2)) * 0.4 }] }));
  return <Animated.View style={[{ position: "absolute", width: 16, height: 10, opacity: 0.45 }, position]}>
    <Animated.View style={[{ width: 16, height: 10 }, wings]}>
      <View style={{ position: "absolute", left: 0, top: 2, width: 8, height: 5, borderTopWidth: 2, borderColor: "#374447", borderTopLeftRadius: 6, transform: [{ rotate: "25deg" }] }} />
      <View style={{ position: "absolute", left: 7, top: 2, width: 8, height: 5, borderTopWidth: 2, borderColor: "#374447", borderTopRightRadius: 6, transform: [{ rotate: "-25deg" }] }} />
    </Animated.View>
  </Animated.View>;
}
