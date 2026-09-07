import type { CarouselEffect } from "../types";

export interface CubeOptions {
  perspective?: number;
}

export function createCubeEffect(options: CubeOptions = {}): CarouselEffect {
  const perspective = options.perspective ?? 1000;

  return {
    name: "cube",
    update({ progress, axis }) {
      const isY = axis === "y";
      const angle = progress * 90;

      return {
        rotate: {
          x: isY ? -angle : 0,
          y: isY ? 0 : angle,
        },
        translate: {
          depth: 0,
        },
        perspective,
      };
    },
  };
}

export const cubeEffect = createCubeEffect();

export default cubeEffect;
