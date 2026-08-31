

import type { ReactNode } from "react";
import type { CarouselAxis } from "../types";

interface CarouselViewportProps {
  emblaRef: (node: HTMLElement | null) => void;
  children: ReactNode;
  className?: string;
  axis?: CarouselAxis;
  gap?: string | number;
}

export default function CarouselViewport({
  emblaRef,
  children,
  className,
  axis = "x",
  gap = 0,
}: CarouselViewportProps) {
  const gapVal = typeof gap === "number" ? `${gap}px` : gap;
  const hasGap = Boolean(gap && gap !== 0 && gap !== "0" && gap !== "0px");

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: axis === "y" ? "column" : "row",
    width: "100%",
    height: "100%",
    touchAction: axis === "y" ? "pan-x pinch-zoom" : "pan-y pinch-zoom",
    ...(hasGap
      ? axis === "x"
        ? { marginLeft: `calc(-1 * ${gapVal})` }
        : { marginTop: `calc(-1 * ${gapVal})` }
      : {}),
  };

  return (
    <div
      ref={emblaRef}
      className={className}
      style={{
        overflow: "hidden",
        width: "100%",
        height: "100%",
      }}
    >
      <div style={containerStyle}>{children}</div>
    </div>
  );
}

