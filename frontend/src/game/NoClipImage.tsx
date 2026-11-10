// REVIZYON-075 (one variable, render cost): React Native's Image clips its
// outer view by default, and under Fabric RCTViewComponentView then puts a
// CAShapeLayer MASK on the inner UIImageView even with no corner radius
// (RCTViewComponentView.mm "clipping"). A masked layer is drawn through a Core
// Animation offscreen pass every frame. On-device LayerDiag inventory (R074):
// 95 image layers, every one MASK(CAShapeLayer); Xcode "Color Offscreen-
// Rendered" painted the whole game yellow, and removing those clips at run
// time ("noclip") cleared it with no visible change.
// This wrapper is React Native's Image plus overflow "visible", so the outer
// view does not clip and no mask is added. All game images use "stretch"
// (or are fully covered), so nothing can draw outside its box.
import { type ComponentRef, forwardRef } from "react";
import { Image, type ImageProps } from "react-native";

export const NO_IMAGE_CLIP = true as boolean;
const VISIBLE = { overflow: "visible" as const };

export const NoClipImage = forwardRef<ComponentRef<typeof Image>, ImageProps>(function NoClipImage(props, ref) {
  return <Image ref={ref} {...props} style={NO_IMAGE_CLIP ? [props.style, VISIBLE] : props.style} />;
});
