import type { CarouselBehavior, CarouselBehaviorContext } from "../types";

export interface SyncBehaviorOptions {
  getTarget?: () => CarouselBehaviorContext | null;
  direction?: "two-way" | "one-way";
}

export interface SyncGroup {
  createBehavior: (role?: string) => CarouselBehavior;
  syncTo: (fromId: string, index: number) => void;
  getActiveIndex: () => number;
  subscribe: (listener: (index: number) => void) => () => void;
}

export function createSyncGroup(): SyncGroup {
  const members = new Map<string, CarouselBehaviorContext>();
  let activeIndex = 0;
  let isSyncing = false;
  const subscribers = new Set<(index: number) => void>();

  const notifySubscribers = (idx: number) => {
    subscribers.forEach((fn) => {
      try {
        fn(idx);
      } catch {
        // ignore
      }
    });
  };

  const syncTo = (fromId: string, index: number) => {
    if (isSyncing) return;
    isSyncing = true;
    activeIndex = index;
    notifySubscribers(index);

    members.forEach((ctx, id) => {
      if (id !== fromId && ctx.emblaApi) {
        ctx.emblaApi.scrollTo(index);
      }
    });

    // Lepas lock pada frame berikutnya
    requestAnimationFrame(() => {
      isSyncing = false;
    });
  };

  return {
    syncTo,
    getActiveIndex() {
      return activeIndex;
    },
    subscribe(listener) {
      subscribers.add(listener);
      return () => {
        subscribers.delete(listener);
      };
    },
    createBehavior(role = `carousel-${Math.random().toString(36).substring(2, 7)}`) {
      return {
        name: `sync-${role}`,
        init(ctx) {
          members.set(role, ctx);
          // Jika ada active index saat inisialisasi, scroll ke posisi tersebut
          if (activeIndex > 0 && ctx.emblaApi.selectedScrollSnap() !== activeIndex) {
            ctx.emblaApi.scrollTo(activeIndex, true);
          }
        },
        destroy() {
          members.delete(role);
        },
        onSelect(ctx) {
          if (isSyncing) return;
          const index = ctx.emblaApi.selectedScrollSnap();
          activeIndex = index;
          syncTo(role, index);
        },
      };
    },
  };
}

export function createSyncBehavior(options: SyncBehaviorOptions): CarouselBehavior {
  let isSyncing = false;

  return {
    name: "sync",
    onSelect(ctx) {
      if (isSyncing) return;
      const targetCtx = options.getTarget?.();
      if (!targetCtx || !targetCtx.emblaApi) return;

      const currentIndex = ctx.emblaApi.selectedScrollSnap();
      if (targetCtx.emblaApi.selectedScrollSnap() !== currentIndex) {
        isSyncing = true;
        targetCtx.scrollTo(currentIndex);
        requestAnimationFrame(() => {
          isSyncing = false;
        });
      }
    },
  };
}
