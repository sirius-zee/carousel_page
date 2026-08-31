import type { CarouselEffect } from "../types";

export interface BlurOptions {
  maxBlur?: number;
}

export function createBlurEffect(options: BlurOptions = {}): CarouselEffect {
  const maxBlur = options.maxBlur ?? 6;

  return {
    name: "blur",
    update({ progress }) {
      const absProgress = Math.min(1, Math.abs(progress));
      const blur = absProgress * maxBlur;

      return {
        blur,
      };
    },
  };
}

export const blurEffect = createBlurEffect();
