

import { useMemo, useState, useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import Carousel from "./Carousel";
import { createSyncGroup } from "../behaviors/sync";
import type { CarouselEffect, CarouselBehavior, CarouselOptions } from "../types";
import type { AutoplayOptions } from "../behaviors/autoplay";

export type ThumbnailPosition =
  | "bottom"
  | "top"
  | "left"
  | "right"
  | "floating-bottom";

export interface CarouselThumbnailGalleryProps<T = unknown> {
  slides: T[];
  renderSlide: (
    slide: T,
    index: number,
    meta: {
      isSelected: boolean;
      scrollNext: () => void;
      scrollPrev: () => void;
    },
  ) => ReactNode;
  renderThumb?: (
    slide: T,
    index: number,
    meta: { isSelected: boolean; onClick: () => void },
  ) => ReactNode;
  position?: ThumbnailPosition;
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
  showControls?: boolean;
  showDots?: boolean;
  showCounter?: boolean;
  showArrows?: boolean;
  className?: string;
  classMain?: string;
  classThumb?: string;
}

export default function CarouselThumbnailGallery<T = unknown>({
  slides,
  renderSlide,
  renderThumb,
  position = "bottom",
  thumbPerView,
  thumbGap = "0.5rem",
  mainAspectRatio = "16/9",
  thumbAspectRatio = "1/1", // Square 1:1 default for all positions
  thumbHeight,
  options,
  thumbOptions,
  effects,
  behaviors,
  autoPlay,
  showControls = true,
  showDots = false,
  showCounter = true,
  showArrows = true,
  className = "",
  classMain = "",
  classThumb = "",
}: CarouselThumbnailGalleryProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0);

  const syncGroup = useMemo(() => createSyncGroup(), []);
  const mainSyncBehavior = useMemo(
    () => syncGroup.createBehavior("main-gallery"),
    [syncGroup],
  );
  const thumbSyncBehavior = useMemo(
    () => syncGroup.createBehavior("thumb-gallery"),
    [syncGroup],
  );

  useEffect(() => {
    const unsubscribe = syncGroup.subscribe((idx) => {
      setActiveIndex(idx);
    });
    return () => {
      unsubscribe();
    };
  }, [syncGroup]);

  const combinedMainBehaviors = useMemo(() => {
    return [mainSyncBehavior, ...(behaviors ?? [])];
  }, [mainSyncBehavior, behaviors]);

  const combinedThumbBehaviors = useMemo(() => {
    return [thumbSyncBehavior];
  }, [thumbSyncBehavior]);

  const isVerticalThumb = position === "left" || position === "right";

  // Per-view defaults
  const resolvedThumbPerView = useMemo(() => {
    if (typeof thumbPerView === "number") return thumbPerView;
    if (isVerticalThumb) return 4;
    if (position === "floating-bottom") return 6;
    return 6;
  }, [thumbPerView, isVerticalThumb, position]);

  // Main Carousel Component
  const mainCarousel = (
    <div className={`relative flex-1 w-full min-w-0 ${classMain}`}>
      <Carousel
        slides={slides}
        behaviors={combinedMainBehaviors}
        effects={effects}
        autoPlay={autoPlay}
        options={{
          loop: true,
          duration: 35,
          ...options,
        }}
        aspectRatio={mainAspectRatio}
        showControls={showControls}
        showDots={showDots}
        showCounter={showCounter}
        showArrows={showArrows}
        className="w-full shadow-lg rounded-none sm:rounded-2xl"
        classViewport="rounded-none sm:rounded-2xl overflow-hidden"
        renderSlide={(slide, index, meta) =>
          renderSlide(slide, index, {
            ...meta,
            isSelected: activeIndex === index,
          })
        }
      />
    </div>
  );

  // Thumbnail Carousel Component
  const thumbCarousel = (
    <div
      className={`${isVerticalThumb
          ? "w-20 sm:w-24 flex-shrink-0"
          : position === "floating-bottom"
            ? "absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[94%] sm:w-[75%] max-w-md bg-black/60 backdrop-blur-lg p-2 rounded-2xl border border-white/15 shadow-2xl"
            : "w-full"
        } ${classThumb}`}
    >
      <Carousel
        slides={slides}
        behaviors={combinedThumbBehaviors}
        perView={resolvedThumbPerView}
        gap={thumbGap}
        axis={isVerticalThumb ? "y" : "x"}
        options={{
          loop: false,
          duration: 25,
          align: "center", // Thumbnail aktif selalu bergeser ke tengah
          containScroll: false, // Menjamin centering konsisten
          dragFree: false,
          ...thumbOptions,
        }}
        aspectRatio={isVerticalThumb ? undefined : (thumbHeight ? undefined : thumbAspectRatio)}
        height={thumbHeight || (isVerticalThumb ? "100%" : undefined)}
        showControls={false}
        className="w-full h-full"
        renderSlide={(slide, index) => {
          const isSelected = activeIndex === index;
          const onThumbClick = () => syncGroup.syncTo("thumb-gallery", index);

          if (renderThumb) {
            return renderThumb(slide, index, { isSelected, onClick: onThumbClick });
          }

          return (
            <button
              type="button"
              key={index}
              onClick={onThumbClick}
              className={`relative w-full aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${isSelected
                  ? "border-emerald-500 scale-95 shadow-lg opacity-100 ring-2 ring-emerald-400/60 z-10"
                  : "border-transparent opacity-60 hover:opacity-100"
                }`}
            >
              <div className="relative w-full h-full">
                {/* Fallback display */}
                {typeof slide === "object" && slide !== null && "path" in slide ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={(slide as { path: string }).path}
                    alt={`Thumb ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : typeof slide === "object" && slide !== null && "src" in slide ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={(slide as { src: string }).src}
                    alt={`Thumb ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-xs font-bold">
                    {index + 1}
                  </div>
                )}
              </div>
            </button>
          );
        }}
      />
    </div>
  );

  // Layout arrangement based on position
  return (
    <div className={`w-full relative ${className}`}>
      {position === "bottom" && (
        <div className="flex flex-col gap-2.5">
          {mainCarousel}
          {thumbCarousel}
        </div>
      )}

      {position === "top" && (
        <div className="flex flex-col gap-2.5">
          {thumbCarousel}
          {mainCarousel}
        </div>
      )}

      {position === "left" && (
        <div className="flex flex-row gap-3 items-stretch">
          {thumbCarousel}
          {mainCarousel}
        </div>
      )}

      {position === "right" && (
        <div className="flex flex-row gap-3 items-stretch">
          {mainCarousel}
          {thumbCarousel}
        </div>
      )}

      {position === "floating-bottom" && (
        <div className="relative w-full">
          {mainCarousel}
          {thumbCarousel}
        </div>
      )}
    </div>
  );
}
