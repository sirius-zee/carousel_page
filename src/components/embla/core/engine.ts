import type { CSSProperties } from "react";
import EmblaCarousel from "embla-carousel";
import type {
  EmblaCarouselType,
  EmblaOptionsType,
  EmblaEventType,
} from "embla-carousel";
import { createAxisManager } from "./axisManager";
import { composeSlideStyle } from "./transformComposer";
import type { AxisManager } from "../types/axis";
import type {
  CarouselEffect,
  CarouselOptions,
  CarouselEffectContext,
  CarouselBehavior,
  CarouselBehaviorContext,
} from "../types";

type EmblaEventHandler = (
  emblaApi: EmblaCarouselType,
  event: EmblaEventType,
) => void;

export interface CarouselEngine {
  emblaApi: EmblaCarouselType;
  axisManager: AxisManager;
  destroy(): void;
  refresh(): void;
  scrollNext(): void;
  scrollPrev(): void;
  scrollTo(index: number): void;
  selectedIndex(): number;
  slideCount(): number;
  getSlideStyles(): CSSProperties[];
}

function normalizeProgress(
  location: number,
  position: number,
  loop: boolean,
): number {
  let diff = location - position;

  if (loop) {
    diff = ((diff + 1.5) % 1) - 0.5;
  }

  return diff;
}

function createSlideState(
  emblaApi: EmblaCarouselType,
  index: number,
  loop: boolean,
  axis: "x" | "y",
): CarouselEffectContext {
  const slidePositions = emblaApi.scrollSnapList();
  const slideCount = slidePositions.length || 1;
  const location = emblaApi.scrollProgress();
  const position = slidePositions[index] ?? index / slideCount;
  const progress = normalizeProgress(location, position, loop);
  const scaledProgress = progress * slideCount;

  return {
    index,
    progress: scaledProgress,
    isSelected: index === emblaApi.selectedScrollSnap(),
    isVisible: emblaApi.slidesInView().includes(index),
    slideCount,
    axis,
  };
}

function createEmblaOptions(options: CarouselOptions): EmblaOptionsType {
  return {
    axis: options.axis ?? "x",
    align: options.align ?? "center",
    loop: options.loop,
    duration: options.duration,
    slidesToScroll: options.slidesToScroll,
    dragFree: options.dragFree,
    containScroll: options.containScroll,
  };
}

export function createCarouselEngine(
  root: HTMLElement,
  options: CarouselOptions = {},
  onUpdate?: (styles: CSSProperties[], emblaApi: EmblaCarouselType) => void,
): CarouselEngine {
  const axis = options.axis ?? "x";
  const axisManager = createAxisManager(axis);
  const emblaOptions = createEmblaOptions(options);
  const emblaApi = EmblaCarousel(root, emblaOptions);
  const effects: CarouselEffect[] = options.effects ?? [];
  const behaviors: CarouselBehavior[] = options.behaviors ?? [];
  const listeners: Array<{
    event: EmblaEventType;
    handler: EmblaEventHandler;
  }> = [];
  const loop = options.loop ?? false;

  const getSlideStyles = (): CSSProperties[] => {
    const slideNodes = emblaApi.slideNodes();
    const count = slideNodes.length || emblaApi.scrollSnapList().length;

    return Array.from({ length: count }, (_, index) => {
      const effectContext = createSlideState(emblaApi, index, loop, axis);
      const transforms = effects.map((effect) => effect.update(effectContext));
      return composeSlideStyle(axisManager, transforms);
    });
  };

  const emitUpdate = (): void => {
    onUpdate?.(getSlideStyles(), emblaApi);
  };

  const addListener = (event: EmblaEventType, handler: EmblaEventHandler) => {
    emblaApi.on(event, handler);
    listeners.push({ event, handler });
  };

  addListener("reInit", emitUpdate);
  addListener("select", emitUpdate);
  addListener("scroll", emitUpdate);

  const engineApi: CarouselEngine = {
    emblaApi,
    axisManager,
    destroy() {
      behaviors.forEach((b) => b.destroy?.());
      listeners.forEach(({ event, handler }) => emblaApi.off(event, handler));
      emblaApi.destroy();
    },
    refresh() {
      emitUpdate();
    },
    scrollNext() {
      emblaApi.scrollNext();
    },
    scrollPrev() {
      emblaApi.scrollPrev();
    },
    scrollTo(index: number) {
      emblaApi.scrollTo(index);
    },
    selectedIndex() {
      return emblaApi.selectedScrollSnap();
    },
    slideCount() {
      return emblaApi.slideNodes().length || emblaApi.scrollSnapList().length;
    },
    getSlideStyles,
  };

  const behaviorContext: CarouselBehaviorContext = {
    emblaApi,
    refresh: engineApi.refresh,
    scrollNext: engineApi.scrollNext,
    scrollPrev: engineApi.scrollPrev,
    scrollTo: engineApi.scrollTo,
  };

  behaviors.forEach((b) => b.init?.(behaviorContext));

  if (behaviors.some((b) => b.onSelect)) {
    addListener("select", () => {
      behaviors.forEach((b) => b.onSelect?.(behaviorContext));
    });
  }

  if (behaviors.some((b) => b.onScroll)) {
    addListener("scroll", () => {
      behaviors.forEach((b) => b.onScroll?.(behaviorContext));
    });
  }

  emitUpdate();

  return engineApi;
}

