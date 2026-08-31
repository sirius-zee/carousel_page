export type CarouselAxis = "x" | "y";

export interface AxisValues {
  primary: number;
  cross: number;
  depth: number;
}

export interface AxisRect {
  primary: number;
  cross: number;
}

export interface AxisManager {
  axis: CarouselAxis;

  isHorizontal: boolean;

  isVertical: boolean;

  getPrimary(rect: DOMRect): number;

  getCross(rect: DOMRect): number;

  translate(
    primary: number | string,
    cross?: number | string,
    depth?: number,
  ): string;


  rotate(angle: number): string;

  size(rect: DOMRect): AxisRect;
}
