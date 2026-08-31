import type { CarouselBehavior, CarouselBehaviorContext } from "../types";

export interface AutoHeightOptions {
  duration?: number;
  easing?: string;
}

export function createAutoHeightBehavior(
  options: AutoHeightOptions = {},
): CarouselBehavior {
  const duration = options.duration ?? 300;
  const easing = options.easing ?? "ease";

  let containerNode: HTMLElement | null = null;
  let contextRef: CarouselBehaviorContext | null = null;

  const updateHeight = () => {
    if (!contextRef || !containerNode) return;
    const emblaApi = contextRef.emblaApi;
    const selectedIndex = emblaApi.selectedScrollSnap();
    const slides = emblaApi.slideNodes();
    const activeSlide = slides[selectedIndex];

    if (activeSlide) {
      const activeHeight = activeSlide.getBoundingClientRect().height;
      if (activeHeight > 0) {
        containerNode.style.height = `${activeHeight}px`;
      }
    }
  };

  return {
    name: "autoHeight",
    init(ctx) {
      contextRef = ctx;
      containerNode = ctx.emblaApi.containerNode();
      if (containerNode) {
        containerNode.style.transition = `height ${duration}ms ${easing}`;
      }
      // Wait for next frame so child elements are rendered & measured
      requestAnimationFrame(() => {
        updateHeight();
      });
    },
    destroy() {
      if (containerNode) {
        containerNode.style.height = "";
        containerNode.style.transition = "";
      }
      containerNode = null;
      contextRef = null;
    },
    onSelect() {
      updateHeight();
    },
  };
}

export const autoHeightBehavior = createAutoHeightBehavior();
