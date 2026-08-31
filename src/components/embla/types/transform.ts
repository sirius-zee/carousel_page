export interface SlideTransform {
  translate?: {
    primary?: number | string;
    cross?: number | string;
    depth?: number;
  };


  rotate?: {
    x?: number;
    y?: number;
    z?: number;
  };

  scale?: {
    x?: number;
    y?: number;
    z?: number;
  };

  opacity?: number;

  blur?: number;

  brightness?: number;

  contrast?: number;

  saturate?: number;

  grayscale?: number;

  zIndex?: number;

  pointerEvents?: React.CSSProperties["pointerEvents"];

  visibility?: React.CSSProperties["visibility"];

  transformOrigin?: string;

  perspective?: number;
}
