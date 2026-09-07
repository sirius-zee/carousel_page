import type { CarouselBehavior, CarouselBehaviorContext } from "../types";

export interface InfiniteScrollOptions {
  /** Return true if more slides can be loaded (cap 20). */
  hasMore?: () => boolean;
  /** Return true while a mock fetch is in flight. */
  isLoading?: () => boolean;
  /** Called when scroll reaches last slide and should load more. */
  onLoadMore?: () => void | Promise<void>;
  /** Extra guard: minimum slidesInView overlap, not used yet. */
  threshold?: number;
}

/**
 * Infinite scroll behavior — load-more-on-scroll.
 * Detects scroll to last slide via emblaApi.slidesInView(), triggers mock fetch.
 * Compatible with containScroll:'keepSnaps' and dragFree:true — no Embla option mutation.
 * Usage: pass as behavior to engine/Carousel and provide hasMore/isLoading/onLoadMore via refs.
 */
export function createInfiniteScrollBehavior(
  options: InfiniteScrollOptions = {},
): CarouselBehavior {
  let ctx: CarouselBehaviorContext | null = null;

  const getHasMore = () => options.hasMore?.() ?? true;
  const getIsLoading = () => options.isLoading?.() ?? false;

  const checkAndLoad = () => {
    if (!ctx) return;
    if (getIsLoading()) return;
    if (!getHasMore()) return;

    const emblaApi = ctx.emblaApi;
    if (!emblaApi) return;

    const slidesInView = emblaApi.slidesInView();
    const lastIndex = emblaApi.slideNodes().length - 1;
    // Also fallback to scrollSnapList length when slideNodes not yet populated
    const snapLast = emblaApi.scrollSnapList().length - 1;
    const effectiveLast = lastIndex >= 0 ? lastIndex : snapLast;
    if (effectiveLast < 0) return;

    // Trigger when last slide is in view — works with dragFree + keepSnaps
    if (slidesInView.includes(effectiveLast)) {
      options.onLoadMore?.();
    }
  };

  return {
    name: "infiniteScroll",
    init(context) {
      ctx = context;
    },
    destroy() {
      ctx = null;
    },
    onScroll() {
      checkAndLoad();
    },
    onSelect() {
      // Also check on select — covers dragFree snap settle
      checkAndLoad();
    },
  };
}

export const infiniteScrollBehavior = createInfiniteScrollBehavior();
