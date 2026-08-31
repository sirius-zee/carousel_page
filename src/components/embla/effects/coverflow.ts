import type { CarouselEffect } from "../types";

export interface CoverflowOptions {
  rotate?: number;
  depth?: number;
}

export function createCoverflowEffect(
  options: CoverflowOptions = {},
): CarouselEffect {
  const rotateDeg = options.rotate ?? 40;
  const depthPx = options.depth ?? 100;

  return {
    name: "coverflow",
    update({ progress, axis }) {
      const clampProgress = Math.max(-1, Math.min(1, progress));
      const isY = axis === "y";

      return {
        rotate: {
          x: isY ? -clampProgress * rotateDeg : 0,
          y: !isY ? clampProgress * rotateDeg : 0,
        },
        translate: {
          depth: -Math.abs(clampProgress) * depthPx,
        },
        perspective: 1000,
      };
    },
  };
}

export const coverflowEffect = createCoverflowEffect();
