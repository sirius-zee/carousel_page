import type { CarouselEffect } from "../types";

export interface CustomOptions {
  /** Placeholder intensity 0..1 (unused today). Kept so Hero can drive a slider later without changing API. */
  intensity?: number;
}

export function createCustomEffect(_options: CustomOptions = {}): CarouselEffect {
  return {
    name: "custom",
    update() {
      // Placeholder: no transform. Users replace with their own SlideTransform (translate/rotate/scale/filter).
      return {};
    },
  };
}

export const customEffect = createCustomEffect();
export default customEffect;
