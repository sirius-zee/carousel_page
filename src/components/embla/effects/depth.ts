import type { CarouselEffect } from "../types";

export interface DepthOptions {
  /** Z depth in px pushed back per unit progress. Default 120. */
  depth?: number;
  /** Minimum scale at |progress| >= 1. Default 0.75. */
  minScale?: number;
  /** Minimum opacity at |progress| >= 1. Default 0.35. */
  minOpacity?: number;
  /** Perspective in px for 3D depth. Default 1000. */
  perspective?: number;
}

/**
 * Depth effect — slides scale down, recede in Z and fade with
 * distance from the center. Pure factory; no side effects.
 *
 * Similar to coverflow but depth-focused (no rotation).
 */
export function createDepthEffect(options: DepthOptions = {}): CarouselEffect {
  const depthPx = options.depth ?? 120;
  const minScale = options.minScale ?? 0.75;
  const minOpacity = options.minOpacity ?? 0.35;
  const perspective = options.perspective ?? 1000;

  return {
    name: "depth",
    update({ progress, slideCount }) {
      const absProgress = Math.min(1, Math.abs(progress));
      const scale = 1 - absProgress * (1 - minScale);
      const opacity = 1 - absProgress * (1 - minOpacity);
      const depth = -absProgress * depthPx;

      // Keep active slide on top; farther slides sink.
      // Use slideCount to keep zIndex in a stable range.
      const d = Math.min(absProgress, 1);
      const zIndex = slideCount - Math.min(slideCount - 1, Math.floor(d * slideCount));

      return {
        translate: {
          depth,
        },
        scale: {
          x: scale,
          y: scale,
        },
        opacity,
        zIndex,
        perspective,
      };
    },
  };
}

/** Factory alias required by task spec: `depthEffect(options?)` — instance default. */
export const depthEffect: CarouselEffect = createDepthEffect();

export default depthEffect;
