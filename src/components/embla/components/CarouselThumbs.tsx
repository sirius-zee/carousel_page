import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import Carousel from "./Carousel";
import { createSyncGroup } from "../behaviors/sync";
import type { CarouselEffect, CarouselBehavior, CarouselOptions } from "../types";
import type { AutoplayOptions } from "../behaviors/autoplay";
import type { AutoScrollOptions } from "../types";

export type ThumbPosition = "bottom" | "top" | "left" | "right" | "floating-bottom";

export type ThumbScrollMode = "contain" | "loop";

export interface CarouselThumbsProps<T = unknown> {
  slides: T[];
  renderSlide: (
    slide: T,
    index: number,
    meta: { isSelected: boolean; scrollNext: () => void; scrollPrev: () => void },
  ) => ReactNode;
  renderThumb?: (
    slide: T,
    index: number,
    meta: { isSelected: boolean; onClick: () => void },
  ) => ReactNode;
  position?: ThumbPosition;
  thumbPerView?: number;
  thumbGap?: string | number;
  mainAspectRatio?: CSSProperties["aspectRatio"];
  thumbAspectRatio?: CSSProperties["aspectRatio"];
  thumbHeight?: CSSProperties["height"];
  options?: CarouselOptions;
  thumbOptions?: CarouselOptions;
  effects?: CarouselEffect[];
  behaviors?: CarouselBehavior[];
  autoPlay?: boolean | AutoplayOptions;
  /** Auto Scroll plugin: continuous marquee (rAF). Mutually exclusive with autoplay snap for UX; gated off fade. */
  autoScroll?: boolean | AutoScrollOptions;
  /** Class Names plugin for main carousel: true defaults, object custom. No fade collision. */
  classNames?: boolean | import("embla-carousel-class-names").ClassNamesOptionsType;
  /** Lazy Load forwarded to main carousel when true (data-src + slidesInView). */
  lazy?: boolean;
  showControls?: boolean;
  showDots?: boolean;
  showCounter?: boolean;
  showArrows?: boolean;
  className?: string;
  classMain?: string;
  classThumb?: string;
  /** Dual thumb scroll mode: false/"contain" = edge-clamped (trimSnaps), true/"loop" = centered looping. Default false. */
  thumbLoop?: boolean;
  thumbScrollMode?: ThumbScrollMode;
  direction?: "ltr" | "rtl";
}

/**
 * CarouselThumbs — Navigation Rail
 * - Single source of truth: activeIndex (useState)
 * - Two synchronised Embla instances (main + thumbs) via createSyncGroup
 *   with isSyncing + requestAnimationFrame lock to avoid blink/loop
 * - Thumb modes: contain (loop:false, containScroll:'trimSnaps', active can hit edges) vs loop (loop:true, centered)
 * - Invariants: align:center, dragFree:false, skipSnaps:false, slidesToScroll:1, duration:25
 * - Main Embla: loop:true
 * - Active thumb: centered in loop mode, edge-clamped in contain mode
 * - thumb click => syncGroup.syncTo + main scroll, main onSelect => setActiveIndex (through syncGroup)
 */
export default function CarouselThumbs<T = unknown>({
  slides,
  renderSlide,
  renderThumb,
  position = "bottom",
  thumbPerView,
  thumbGap = "0.5rem",
  mainAspectRatio = "16/9",
  thumbAspectRatio = "4/3",
  thumbHeight,
  options,
  thumbOptions,
  effects,
  behaviors,
  autoPlay,
  autoScroll,
  showControls = true,
  showDots = false,
  showCounter = true,
  showArrows = true,
  className = "",
  classMain = "",
  classThumb = "",
  thumbLoop = false,
  thumbScrollMode,
  classNames,
  lazy = false,
  direction = "ltr",
}: CarouselThumbsProps<T>) {
  const isThumbLoop = thumbScrollMode !== undefined ? thumbScrollMode === "loop" : thumbLoop;
  // (1) SSOT
  const [activeIndex, setActiveIndex] = useState(0);

  // (2) SyncGroup — stable instance, never recreated (no reset)
  const syncGroup = useMemo(() => createSyncGroup(), []);
  const mainSync = useMemo(() => syncGroup.createBehavior("main-thumbs"), [syncGroup]);
  const thumbSync = useMemo(() => syncGroup.createBehavior("thumbs-strip"), [syncGroup]);

  useEffect(() => {
    const unsub = syncGroup.subscribe(setActiveIndex);
    return () => unsub();
  }, [syncGroup]);

  const mainBehaviors = useMemo<CarouselBehavior[]>(() => [mainSync, ...(behaviors ?? [])], [mainSync, behaviors]);
  const thumbBehaviors = useMemo<CarouselBehavior[]>(() => [thumbSync], [thumbSync]);

  const isVertical = position === "left" || position === "right";
  const isFloating = position === "floating-bottom";

  const resolvedThumbPerView = useMemo(() => {
    if (typeof thumbPerView === "number") return thumbPerView;
    if (isVertical) return 5;
    if (isFloating) return 6;
    return 7;
  }, [thumbPerView, isVertical, isFloating]);

  // (3) thumb options: dual scroll modes — contain vs loop invariants
  const resolvedThumbOptions = useMemo<CarouselOptions>(
    () => ({
      duration: 25,
      ...thumbOptions,
      // invariants — always enforced; loop/containScroll vary by mode
      loop: isThumbLoop,
      align: "center",
      containScroll: isThumbLoop ? false : "trimSnaps",
      dragFree: false,
      slidesToScroll: 1,
      skipSnaps: false,
    }),
    [thumbOptions, isThumbLoop],
  );

  const resolvedMainOptions = useMemo<CarouselOptions>(
    () => ({ loop: true, duration: 35, ...options, direction: options?.direction ?? direction, ...(classNames !== undefined ? { classNames } : {}), ...(autoScroll !== undefined ? { autoScroll } : {}) }),
    [options, classNames, direction, autoScroll],
  );

  const mainEl = (
    <div className={`relative flex-1 w-full min-w-0 ${isVertical ? "self-stretch flex flex-col min-h-0" : ""} ${classMain}`}>
      <Carousel
        slides={slides}
        direction={direction}
        behaviors={mainBehaviors}
        effects={effects}
        autoPlay={autoPlay}
        lazy={lazy}
        options={resolvedMainOptions}
        // left/right: fill row height (flex), let inner content keep 16/9 via aspect wrapper
        {...(isVertical ? { height: "100%" } : { aspectRatio: mainAspectRatio })}
        showControls={showControls}
        showDots={showDots}
        showCounter={showCounter}
        showArrows={showArrows}
        className={`w-full ${isVertical ? "flex-1 min-h-0 h-full" : "shadow-lg rounded-none sm:rounded-2xl"}`}
        classViewport={`rounded-none sm:rounded-2xl overflow-hidden ${isVertical ? "h-full" : ""}`}
        renderSlide={(s, i, meta) => renderSlide(s, i, { ...meta, isSelected: activeIndex === i })}
      />
    </div>
  );

  // (7) consistent thumb sizing + active styling — fine-tuned to mockup
  // horizontal: compact 84px→104px @ 4/3 | vertical: 72px→84px @ 4/3 (consistent aspect, no h/w mismatch)
  const thumbItemSizeClass = isVertical
    ? "w-[72px] sm:w-[84px] aspect-[4/3] shrink-0"
    : "w-[84px] sm:w-[104px] aspect-[4/3] shrink-0";

  const thumbsCarousel = (
    <Carousel
      key={`thumbs-${position}-${isThumbLoop ? "loop" : "contain"}`}
      slides={slides}
      behaviors={thumbBehaviors}
      perView={resolvedThumbPerView}
      gap={thumbGap}
      axis={isVertical ? "y" : "x"}
      slideAspectRatio={thumbHeight ? undefined : thumbAspectRatio}
      height={thumbHeight ?? (isVertical ? "100%" : undefined)}
      options={resolvedThumbOptions}
      showControls={false}
      className={isVertical ? "w-full h-full" : "w-full"}
      classViewport={isVertical ? "overflow-hidden scroll-smooth h-full" : "overflow-hidden scroll-smooth"}
      renderSlide={(slide, index) => {
        const isSelected = activeIndex === index;
        // (5) thumb click => SSOT + main scroll (via syncGroup, rAF lock prevents loop)
        const onClick = () => syncGroup.syncTo("thumbs-strip", index);
        if (renderThumb) return renderThumb(slide, index, { isSelected, onClick });
        return (
          <button
            type="button"
            onClick={onClick}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={isSelected}
            className={`group relative flex-shrink-0 overflow-hidden rounded-lg sm:rounded-xl border-[1.5px] transition-all duration-300 ease-out cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${thumbItemSizeClass} ${
              isSelected
                ? "border-white opacity-100 shadow-md ring-1 ring-white/60 scale-[1.02]"
                : "border-white/40 dark:border-white/10 opacity-60 hover:opacity-100 hover:border-white/80 hover:scale-[1.015] scale-100"
            }`}
          >
            <span className="block w-full h-full">
              {typeof slide === "object" && slide !== null && "path" in slide ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={(slide as { path: string }).path}
                  alt={`Thumb ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
              ) : typeof slide === "object" && slide !== null && "src" in slide ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={(slide as { src: string }).src}
                  alt={`Thumb ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-xs font-bold">
                  {index + 1}
                </span>
              )}
            </span>
            <span
              className={`pointer-events-none absolute inset-0 rounded-[10px] transition-opacity duration-300 ${isSelected ? "bg-white/10 opacity-100" : "opacity-0"}`}
            />
          </button>
        );
      }}
    />
  );

  const thumbsWrap = (
    <div
      className={
        isVertical
          ? `flex-shrink-0 w-[72px] sm:w-[84px] self-stretch flex flex-col ${classThumb}`
          : isFloating
            ? `absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] sm:w-[72%] max-w-[560px] bg-black/55 backdrop-blur-xl px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-2xl border border-white/15 shadow-2xl ${classThumb}`
            : `w-full max-w-full ${classThumb}`
      }
    >
      <div className={isVertical ? "flex-1 min-h-0 h-full" : "w-full"}>{thumbsCarousel}</div>
    </div>
  );

  // Responsive layout: horizontal top/bottom stack, vertical left/right row with stretch
  const rowClass = isVertical ? "flex flex-row gap-3 items-stretch min-h-[280px] sm:min-h-[360px]" : "flex flex-col gap-3";

  return (
    <div className={`w-full relative ${className}`}>
      {position === "bottom" && (
        <div className={rowClass}>
          {mainEl}
          {thumbsWrap}
        </div>
      )}
      {position === "top" && (
        <div className={rowClass}>
          {thumbsWrap}
          {mainEl}
        </div>
      )}
      {position === "left" && (
        <div className={rowClass}>
          {thumbsWrap}
          {mainEl}
        </div>
      )}
      {position === "right" && (
        <div className={rowClass}>
          {mainEl}
          {thumbsWrap}
        </div>
      )}
      {isFloating && (
        <div className="relative w-full">
          {mainEl}
          {thumbsWrap}
        </div>
      )}
    </div>
  );
}

export { CarouselThumbs };
export type { ThumbPosition as CarouselThumbPosition, ThumbScrollMode as CarouselThumbScrollMode };
