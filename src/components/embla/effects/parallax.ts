import type { CarouselEffect } from "../types";

export interface ParallaxOptions {
  factor?: number;
  scale?: number;
}

export function createParallaxEffect(options: ParallaxOptions = {}): CarouselEffect {
  const factor = options.factor ?? -20;
  const scale = options.scale ?? 1.4;

  return {
    name: "parallax",
    update({ progress }) {
      return {
        translate: {
          primary: `${progress * factor}%`,
        },
        scale: {
          x: scale,
          y: scale,
          z: 1,
        },
      };
    },
  };
}

export const parallaxEffect = createParallaxEffect();

