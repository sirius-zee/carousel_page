import type { CarouselBehavior, CarouselBehaviorContext } from "../types";

export interface AutoplayOptions {
  delay?: number | ((index: number) => number | null);
  getSlideDelay?: (index: number) => number | null;
  stopOnInteraction?: boolean;
  stopOnMouseEnter?: boolean;
}

export function createAutoplayBehavior(
  options: AutoplayOptions = {},
): CarouselBehavior {
  const defaultDelay = 4000;
  const stopOnMouseEnter = options.stopOnMouseEnter ?? true;
  const stopOnInteraction = options.stopOnInteraction ?? false;
  void stopOnInteraction;

  let timer: ReturnType<typeof setTimeout> | null = null;
  let isPaused = false;
  let isDestroyed = false;
  let contextRef: CarouselBehaviorContext | null = null;
  let rootNode: HTMLElement | null = null;

  const resolveDelay = (index: number): number | null => {
    if (options.getSlideDelay) {
      return options.getSlideDelay(index);
    }
    if (typeof options.delay === "function") {
      return options.delay(index);
    }
    if (typeof options.delay === "number") {
      return options.delay;
    }
    return defaultDelay;
  };

  const stopTimer = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const startTimer = () => {
    stopTimer();
    if (isPaused || isDestroyed || !contextRef) return;

    const currentIndex = contextRef.emblaApi.selectedScrollSnap();
    const currentDelay = resolveDelay(currentIndex);

    // Jika null atau <= 0, berarti slide ini menunggu event manual (misal video ended)
    if (currentDelay === null || currentDelay <= 0) {
      return;
    }

    timer = setTimeout(() => {
      if (contextRef && !isPaused && !isDestroyed) {
        if (contextRef.emblaApi.canScrollNext()) {
          contextRef.scrollNext();
        } else {
          contextRef.scrollTo(0);
        }
      }
    }, currentDelay);
  };

  const onMouseEnter = () => {
    if (stopOnMouseEnter) {
      isPaused = true;
      stopTimer();
    }
  };

  const onMouseLeave = () => {
    if (stopOnMouseEnter) {
      isPaused = false;
      startTimer();
    }
  };

  return {
    name: "autoplay",
    init(ctx) {
      contextRef = ctx;
      isDestroyed = false;
      isPaused = false;
      rootNode = ctx.emblaApi.rootNode();

      if (rootNode && stopOnMouseEnter) {
        rootNode.addEventListener("mouseenter", onMouseEnter);
        rootNode.addEventListener("mouseleave", onMouseLeave);
      }

      startTimer();
    },
    destroy() {
      isDestroyed = true;
      stopTimer();
      if (rootNode && stopOnMouseEnter) {
        rootNode.removeEventListener("mouseenter", onMouseEnter);
        rootNode.removeEventListener("mouseleave", onMouseLeave);
      }
      rootNode = null;
      contextRef = null;
    },
    onSelect() {
      if (!isPaused && !isDestroyed) {
        // Reset timer untuk durasi slide aktif yang baru
        startTimer();
      }
    },
  };
}

export const autoplayBehavior = createAutoplayBehavior();
