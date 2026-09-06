import type { CarouselEffect } from "../types";

export interface TinderOptions {
  /** Max rotation in degrees at progress ±1 (default 15). */
  rotate?: number;
  /** Primary-axis translate in px per unit progress (default 80). */
  translateFactor?: number;
  /** Scale for slides at |progress| >= 1 (default 0.92). */
  minScale?: number;
  /** Opacity for slides at |progress| >= 1 (default 0.45). */
  minOpacity?: number;
}

export function createTinderEffect(
  options: TinderOptions = {},
): CarouselEffect {
  const rotateDeg = options.rotate ?? 15;
  const translateFactor = options.translateFactor ?? 80;
  const minScale = options.minScale ?? 0.92;
  const minOpacity = options.minOpacity ?? 0.45;

  return {
    name: "tinder",
    update({ progress }) {
      const clampProgress = Math.max(-1, Math.min(1, progress));
      const absProgress = Math.min(1, Math.abs(progress));

      // Rotation around Z gives the card-tilt swipe feel; sign follows drag direction.
      const rotateZ = clampProgress * rotateDeg;

      // Primary translate amplifies drag feel — uses raw progress so swipe
      // continues beyond ±1 instead of stalling at the clamp edge.
      const primary = progress * translateFactor;

      // Non-active slides scale down smoothly.
      const scale = 1 - absProgress * (1 - minScale);

      // Opacity fades with distance; clamped so far slides stay at minOpacity.
      const opacity = 1 - absProgress * (1 - minOpacity);

      return {
        rotate: {
          z: rotateZ,
        },
        translate: {
          primary,
        },
        scale: {
          x: scale,
          y: scale,
        },
        opacity,
      };
    },
  };
}

export const tinderEffect = createTinderEffect();

export default tinderEffect;
