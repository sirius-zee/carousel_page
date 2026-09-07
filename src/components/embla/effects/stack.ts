import type { CarouselEffect } from "../types";

export interface StackOptions {
  /** Depth offset per unit distance (px). Default 30. */
  depth?: number;
  /** Scale reduction per unit distance. Default 0.05. */
  scaleStep?: number;
  /** Minimum scale floor. Default 0.85. */
  minScale?: number;
  /** Opacity reduction per unit distance. Default 0.12. */
  opacityStep?: number;
  /** Minimum opacity floor. Default 0.4. */
  minOpacity?: number;
}

export function createStackEffect(options: StackOptions = {}): CarouselEffect {
  const depthStep = options.depth ?? 30;
  const scaleStep = options.scaleStep ?? 0.05;
  const minScale = options.minScale ?? 0.85;
  const opacityStep = options.opacityStep ?? 0.12;
  const minOpacity = options.minOpacity ?? 0.4;

  return {
    name: "stack",
    update({ progress, slideCount }) {
      const absProgress = Math.abs(progress);
      // clamp distance to slideCount to keep zIndex in range
      const d = Math.min(absProgress, slideCount);
      const scale = Math.max(minScale, 1 - d * scaleStep);
      const opacity = Math.max(minOpacity, 1 - d * opacityStep);

      // active slide on top; each step back pushes zIndex down by 1
      const zIndex = slideCount - Math.min(slideCount - 1, Math.floor(d));

      return {
        translate: {
          depth: -d * depthStep,
        },
        scale: {
          x: scale,
          y: scale,
          z: 1,
        },
        opacity,
        zIndex,
        perspective: 1000,
      };
    },
  };
}

export const stackEffect = createStackEffect();

export default stackEffect;
