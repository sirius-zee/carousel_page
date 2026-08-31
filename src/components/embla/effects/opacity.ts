import type { CarouselEffect } from "../types";

export interface OpacityOptions {
  minOpacity?: number;
}

export function createOpacityEffect(options: OpacityOptions = {}): CarouselEffect {
  const minOpacity = options.minOpacity ?? 0.4;

  return {
    name: "opacity",
    update({ progress }) {
      const absProgress = Math.min(1, Math.abs(progress));
      const opacity = 1 - absProgress * (1 - minOpacity);

      return {
        opacity,
      };
    },
  };
}

export const opacityEffect = createOpacityEffect();
