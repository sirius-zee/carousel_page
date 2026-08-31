import type { CarouselEffect } from "../types";

export interface ScaleOptions {
  minScale?: number;
}

export function createScaleEffect(options: ScaleOptions = {}): CarouselEffect {
  const minScale = options.minScale ?? 0.85;

  return {
    name: "scale",
    update({ progress }) {
      const absProgress = Math.min(1, Math.abs(progress));
      const scale = 1 - absProgress * (1 - minScale);

      return {
        scale: {
          x: scale,
          y: scale,
        },
      };
    },
  };
}

export const scaleEffect = createScaleEffect();
