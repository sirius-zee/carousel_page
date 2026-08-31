import type { CarouselEffect } from "./effect";
import type { CarouselBehavior } from "./behavior";
import type { EmblaOptionsType } from "embla-carousel";

export interface CarouselOptions {
  axis?: "x" | "y";
  align?: EmblaOptionsType["align"];
  loop?: boolean;
  duration?: number;
  perView?: number;
  slidesToScroll?: number | "auto";
  dragFree?: boolean;
  containScroll?: EmblaOptionsType["containScroll"];
  effects?: CarouselEffect[];
  behaviors?: CarouselBehavior[];
  autoplay?: boolean | { delay?: number; stopOnInteraction?: boolean; stopOnMouseEnter?: boolean };
}

