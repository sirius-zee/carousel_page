import type { AxisManager, CarouselAxis } from "../types/axis";

export function createAxisManager(axis: CarouselAxis): AxisManager {
  const isHorizontal = axis === "x";
  const isVertical = axis === "y";

  return {
    axis,
    isHorizontal,
    isVertical,

    getPrimary(rect: DOMRect) {
      return isHorizontal ? rect.width : rect.height;
    },

    getCross(rect: DOMRect) {
      return isHorizontal ? rect.height : rect.width;
    },

    translate(primary: number | string, cross: number | string = 0, depth = 0) {
      const primaryVal = typeof primary === "number" ? `${primary}px` : primary;
      const crossVal = typeof cross === "number" ? `${cross}px` : cross;
      const x = isHorizontal ? primaryVal : crossVal;
      const y = isHorizontal ? crossVal : primaryVal;
      return `translate3d(${x}, ${y}, ${depth}px)`;
    },


    rotate(angle: number) {
      return `rotateZ(${angle}deg)`;
    },

    size(rect: DOMRect) {
      return {
        primary: isHorizontal ? rect.width : rect.height,
        cross: isHorizontal ? rect.height : rect.width,
      };
    },
  };
}
