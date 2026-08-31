import type { CarouselEffect } from "../types";

export const fadeEffect: CarouselEffect = {
  name: "fade",
  update({ progress, isVisible }) {
    const absProgress = Math.abs(progress);
    const opacity = Math.max(0, 1 - absProgress);

    return {
      opacity,
      zIndex: isVisible ? 2 : 1,
      pointerEvents: isVisible && absProgress < 0.5 ? "auto" : "none",
      visibility: isVisible || opacity > 0.01 ? "visible" : "hidden",
    };
  },
};

