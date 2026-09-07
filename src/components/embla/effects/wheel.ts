import type { CarouselEffect } from "../types";

export interface WheelOptions {
  /** Cylinder radius in px. Distance from center to slide surface. Default 400. */
  radius?: number;
  /** Rotation in degrees per slide unit (progress = 1). Default 30. */
  angleStep?: number;
  /** Perspective in px for 3D. Default 1200. */
  perspective?: number;
  /** Opacity reduction per unit distance. Default 0.14. Set 0 to disable fading. */
  opacityStep?: number;
  /** Minimum opacity floor. Default 0.3. */
  minOpacity?: number;
}

/**
 * Wheel / cylinder effect — slides wrap around a 3D wheel on the primary axis.
 *
 * - Horizontal axis (x): rotates around Y, cylinder axis is vertical.
 * - Vertical axis (y): rotates around X, cylinder axis is horizontal.
 * - Depth is derived from cylinder radius: `radius * (cos(angle) - 1)` so
 *   the active slide sits at depth 0 and neighbours recede behind.
 * - Only `rotate` and `translate.depth` are emitted; Transform Composer
 *   converts them to CSS via AxisManager.
 * - Pure factory — no Embla / DOM knowledge.
 */
export function createWheelEffect(options: WheelOptions = {}): CarouselEffect {
  const radius = options.radius ?? 400;
  const angleStep = options.angleStep ?? 30;
  const perspective = options.perspective ?? 1200;
  const opacityStep = options.opacityStep ?? 0.14;
  const minOpacity = options.minOpacity ?? 0.3;

  return {
    name: "wheel",
    update({ progress, axis, slideCount }) {
      const isY = axis === "y";
      const angle = progress * angleStep;
      const rad = (angle * Math.PI) / 180;
      const depth = radius * (Math.cos(rad) - 1);

      // Opacity fades with angular distance; clamped to minOpacity.
      const absProgress = Math.abs(progress);
      const opacity =
        opacityStep === 0
          ? undefined
          : Math.max(minOpacity, 1 - Math.min(absProgress, slideCount) * opacityStep);

      // Active slide on top; farther slides sink. Use slideCount for stable range.
      const d = Math.min(absProgress, slideCount);
      const zIndex = slideCount - Math.min(slideCount - 1, Math.floor(d));

      // Back-facing slides (>90° away) should not capture pointer events.
      const absAngle = Math.abs(angle) % 360;
      const onBackside = absAngle > 90 && absAngle < 270;

      return {
        rotate: {
          x: isY ? -angle : 0,
          y: isY ? 0 : angle,
        },
        translate: {
          depth,
        },
        opacity,
        zIndex,
        perspective,
        ...(onBackside ? { pointerEvents: "none" as const } : {}),
      };
    },
  };
}

export const wheelEffect: CarouselEffect = createWheelEffect();
export const createWheelEffectAlias = createWheelEffect;

export default wheelEffect;
