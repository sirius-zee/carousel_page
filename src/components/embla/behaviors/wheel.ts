import type { CarouselBehavior, CarouselBehaviorContext } from "../types";

export interface WheelOptions {
  sensitivity?: number;
  preventScroll?: boolean;
  axis?: "x" | "y" | "auto";
  cooldownMs?: number;
}

export function createWheelBehavior(options: WheelOptions = {}): CarouselBehavior {
  const sensitivity = options.sensitivity ?? 25;
  const preventScroll = options.preventScroll ?? true; // Default true agar page tidak goyang
  const cooldownMs = options.cooldownMs ?? 250;

  let accumulatedDelta = 0;
  let isThrottled = false;
  let throttleTimer: ReturnType<typeof setTimeout> | null = null;
  let rootNode: HTMLElement | null = null;
  let contextRef: CarouselBehaviorContext | null = null;

  const onWheel = (e: WheelEvent) => {
    if (!contextRef) return;

    if (preventScroll) {
      // Cegah page scroll di background
      e.preventDefault();
      e.stopPropagation();
    }

    if (isThrottled) return;

    const delta =
      options.axis === "x"
        ? e.deltaX || e.deltaY
        : options.axis === "y"
          ? e.deltaY
          : Math.abs(e.deltaX) > Math.abs(e.deltaY)
            ? e.deltaX
            : e.deltaY;

    if (Math.abs(delta) < 2) return;

    accumulatedDelta += delta;

    if (Math.abs(accumulatedDelta) >= sensitivity) {
      if (accumulatedDelta > 0) {
        contextRef.scrollNext();
      } else {
        contextRef.scrollPrev();
      }

      accumulatedDelta = 0;
      isThrottled = true;

      if (throttleTimer) clearTimeout(throttleTimer);
      throttleTimer = setTimeout(() => {
        isThrottled = false;
        accumulatedDelta = 0;
      }, cooldownMs);
    }
  };

  return {
    name: "wheel",
    init(ctx) {
      contextRef = ctx;
      rootNode = ctx.emblaApi.rootNode();
      if (rootNode) {
        rootNode.addEventListener("wheel", onWheel, {
          passive: false,
        });
      }
    },
    destroy() {
      if (rootNode) {
        rootNode.removeEventListener("wheel", onWheel);
      }
      if (throttleTimer) {
        clearTimeout(throttleTimer);
        throttleTimer = null;
      }
      rootNode = null;
      contextRef = null;
    },
  };
}

export const wheelBehavior = createWheelBehavior();
