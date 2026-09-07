import type { CarouselEffect } from "./effect";
import type { CarouselBehavior } from "./behavior";
import type { EmblaOptionsType } from "embla-carousel";
import type { AutoScrollOptionsType } from "embla-carousel-auto-scroll";
import type { ClassNamesOptionsType } from "embla-carousel-class-names";

export type CarouselType = "SLIDE" | "STACK";

export type AutoScrollOptions = AutoScrollOptionsType;

export interface CarouselOptions {
  type?: CarouselType;
  axis?: "x" | "y";
  align?: EmblaOptionsType["align"];
  loop?: boolean;
  duration?: number;
  perView?: number;
  slidesToScroll?: number | "auto";
  dragFree?: boolean;
  containScroll?: EmblaOptionsType["containScroll"];
  direction?: "ltr" | "rtl";
  effects?: CarouselEffect[];
  behaviors?: CarouselBehavior[];
  autoplay?: boolean | { delay?: number; stopOnInteraction?: boolean; stopOnMouseEnter?: boolean };
  autoScroll?: boolean | AutoScrollOptions;
  classNames?: boolean | ClassNamesOptionsType;
  lazy?: boolean;
  infinite?: boolean;
}
