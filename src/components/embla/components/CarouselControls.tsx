

import type { CarouselAxis } from "../types";

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
  canScrollPrev?: boolean;
  canScrollNext?: boolean;
  selectedIndex?: number;
  slideCount?: number;
  scrollSnaps?: number[];
  onDotClick?: (index: number) => void;
  showDots?: boolean;
  showCounter?: boolean;
  showArrows?: boolean;
  axis?: CarouselAxis;
  className?: string;
  classArrows?: string;
  classDots?: string;
  classCounter?: string;
}

export default function CarouselControls({
  onPrev,
  onNext,
  canScrollPrev = true,
  canScrollNext = true,
  selectedIndex = 0,
  slideCount = 0,
  scrollSnaps = [],
  onDotClick,
  showDots = false,
  showCounter = false,
  showArrows = false,
  axis = "x",
  classArrows = "",
  classDots = "",
  classCounter = "",
}: CarouselControlsProps) {
  const isVertical = axis === "y";
  const snaps = scrollSnaps.length > 0 ? scrollSnaps : Array.from({ length: slideCount });

  return (
    <>
      {/* Arrows Navigation */}
      {showArrows && (
        <div
          className={`flex items-center gap-2 pointer-events-auto absolute bottom-3 left-3 ${classArrows}`}
        >
          <button
            type="button"
            onClick={onPrev}
            disabled={!canScrollPrev}
            aria-label="Previous Slide"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 backdrop-blur-md cursor-pointer"
          >
            <svg
              className={`w-5 h-5 ${isVertical ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canScrollNext}
            aria-label="Next Slide"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 backdrop-blur-md cursor-pointer"
          >
            <svg
              className={`w-5 h-5 ${isVertical ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Pagination Dots */}
      {showDots && snaps.length > 1 && (
        <div
          className={`flex items-center gap-1.5 pointer-events-auto absolute bottom-2 left-1/2 -translate-x-1/2 ${classDots}`}
        >
          {snaps.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onDotClick?.(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${idx === selectedIndex
                ? "w-8 bg-white"
                : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
            />
          ))}
        </div>
      )}

      {/* Numeric Counter */}
      {showCounter && slideCount > 0 && (
        <div
          className={`text-xs font-semibold px-3 py-1 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/10 pointer-events-auto absolute bottom-3 right-3 ${classCounter}`}
        >
          {selectedIndex + 1} / {slideCount}
        </div>
      )}
    </>
  );
}

