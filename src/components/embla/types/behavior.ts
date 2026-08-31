import type { EmblaCarouselType } from "embla-carousel";

export interface CarouselBehaviorContext {
  emblaApi: EmblaCarouselType;
  refresh: () => void;
  scrollNext: () => void;
  scrollPrev: () => void;
  scrollTo: (index: number) => void;
}

export interface CarouselBehavior {
  name: string;
  init?(context: CarouselBehaviorContext): void;
  destroy?(): void;
  onSelect?(context: CarouselBehaviorContext): void;
  onScroll?(context: CarouselBehaviorContext): void;
}

