

import type { CSSProperties, ReactNode } from "react";

interface CarouselSlideProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function CarouselSlide({
  children,
  className,
  style,
}: CarouselSlideProps) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
