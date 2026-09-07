import type { CarouselEffect } from "../types";

export interface FlipOptions {
  perspective?: number;
}

export function createFlipEffect(options: FlipOptions = {}): CarouselEffect {
  const perspective = options.perspective ?? 1000;

  return {
    name: "flip",
    update({ progress, axis }) {
      const isY = axis === "y";
      const angle = progress * 180;

      return {
        rotate: {
          x: isY ? -angle : 0,
          y: isY ? 0 : angle,
        },
        perspective,
      };
    },
  };
}

export const flipEffect: CarouselEffect = createFlipEffect();

export default flipEffect;
