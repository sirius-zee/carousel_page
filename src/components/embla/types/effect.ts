import type { SlideTransform } from "./transform";
import type { CarouselAxis } from "./axis";

export interface CarouselEffectContext {
  index: number;
  progress: number;
  isSelected: boolean;
  isVisible: boolean;
  slideCount: number;
  axis: CarouselAxis;
}

export interface CarouselEffect {
  name: string;
  update(context: CarouselEffectContext): SlideTransform;
}

