import { Children, cloneElement, isValidElement, useEffect, useMemo, useRef } from "react";
import type { CSSProperties, ReactNode, ReactElement } from "react";
import type { CarouselOptions, CarouselEffect, CarouselBehavior, CarouselType, AutoScrollOptions } from "../types";
import type { ClassNamesOptionsType } from "embla-carousel-class-names";
import type { AutoplayOptions } from "../behaviors/autoplay";
import { useCarousel } from "../hooks/useCarousel";
import CarouselViewport from "./CarouselViewport";
import CarouselControls from "./CarouselControls";
import { createAutoplayBehavior } from "../behaviors/autoplay";

export interface CarouselSlideMeta {
  isSelected: boolean;
  scrollNext: () => void;
  scrollPrev: () => void;
  scrollTo: (index: number) => void;
}

export interface CarouselProps<T = unknown> {
  children?: ReactNode;
  slides?: T[];
  renderSlide?: (slide: T, index: number, meta: CarouselSlideMeta) => ReactNode;
  options?: CarouselOptions;
  effects?: CarouselEffect[];
  behaviors?: CarouselBehavior[];
  perView?: number;
  gap?: string | number;
  autoPlay?: boolean | AutoplayOptions;
  showControls?: boolean;
  showDots?: boolean;
  showCounter?: boolean;
  showArrows?: boolean;
  className?: string;
  classViewport?: string;
  viewportClassName?: string;
  slideClassName?: string;
  classSlides?: string;
  classControls?: string;
  classDots?: string;
  classCounter?: string;
  classArrows?: string;
  axis?: "x" | "y";
  aspectRatio?: CSSProperties["aspectRatio"];
  height?: CSSProperties["height"];
  slideAspectRatio?: CSSProperties["aspectRatio"];
  // — new type system —
  type?: CarouselType;
  direction?: "ltr" | "rtl";
  autoScroll?: boolean | AutoScrollOptions;
  classNames?: boolean | ClassNamesOptionsType;
  lazy?: boolean;
  infinite?: boolean;
  thumbLoop?: boolean;
}

export default function Carousel<T = unknown>({
  children,
  slides,
  renderSlide,
  options,
  effects,
  behaviors,
  perView = 1,
  gap = 0,
  autoPlay,
  showControls = false,
  showDots = false,
  showCounter = false,
  showArrows = false,
  className = "",
  classViewport,
  viewportClassName,
  slideClassName = "",
  classControls = "",
  classDots = "",
  classCounter = "",
  classArrows = "",
  axis = "x",
  aspectRatio,
  height,
  slideAspectRatio,
  type,
  direction = "ltr",
  autoScroll,
  classNames,
  lazy = false,
  infinite = false,
}: CarouselProps<T>) {
  const rawSlideCount = useMemo(() => {
    if (slides) return slides.length;
    return Children.count(children);
  }, [slides, children]);

  // resolvedType & hasOverlay (type===STACK)
  const resolvedType: CarouselType = useMemo(
    () => options?.type ?? type ?? "SLIDE",
    [options?.type, type],
  );
  const hasOverlay = useMemo(() => resolvedType === "STACK", [resolvedType]);

  // autoScroll gated off STACK — plugins [Fade,AutoScroll,ClassNames] ordered via engine
  const effectiveAutoScroll = useMemo(() => {
    if (hasOverlay) return false as const;
    return autoScroll ?? options?.autoScroll;
  }, [hasOverlay, autoScroll, options?.autoScroll]);

  const resolvedOptions = useMemo<CarouselOptions>(() => {
    const combinedEffects = [
      ...(options?.effects ?? []),
      ...(effects ?? []),
    ];
    const combinedBehaviors = [
      ...(options?.behaviors ?? []),
      ...(behaviors ?? []),
    ];

    if (autoPlay || options?.autoplay) {
      const autoPlayConfig: AutoplayOptions =
        typeof autoPlay === "object" ? { ...autoPlay } : {};

      if (slides && !autoPlayConfig.getSlideDelay) {
        autoPlayConfig.getSlideDelay = (idx: number) => {
          const slideItem = slides[idx] as Record<string, unknown> | undefined;
          if (slideItem && slideItem.type === "video") {
            return null;
          }
          if (slideItem && typeof slideItem.duration === "number") {
            return slideItem.duration;
          }
          if (typeof autoPlayConfig.delay === "number") {
            return autoPlayConfig.delay;
          }
          return 4000;
        };
      }

      combinedBehaviors.push(createAutoplayBehavior(autoPlayConfig));
    }

    const base: CarouselOptions = {
      axis,
      ...options,
      type: resolvedType,
      direction: options?.direction ?? direction,
      effects: combinedEffects,
      behaviors: combinedBehaviors,
      ...(classNames !== undefined ? { classNames } : options?.classNames !== undefined ? { classNames: options.classNames } : {}),
      ...(lazy ? { lazy: true } : options?.lazy !== undefined ? { lazy: options.lazy } : {}),
      ...(infinite ? { infinite: true } : options?.infinite !== undefined ? { infinite: options.infinite } : {}),
    };

    // autoScroll gated
    if (effectiveAutoScroll !== undefined) {
      (base as CarouselOptions & { autoScroll?: unknown }).autoScroll = effectiveAutoScroll as CarouselOptions["autoScroll"];
    } else if (hasOverlay) {
      (base as CarouselOptions & { autoScroll?: unknown }).autoScroll = false as unknown as CarouselOptions["autoScroll"];
    }

    // infinite overrides (keep simple)
    if (infinite || options?.infinite) {
      base.loop = false;
      base.dragFree = true;
      base.containScroll = "keepSnaps";
      base.align = base.align ?? "start";
    }

    return base;
  }, [options, effects, behaviors, autoPlay, axis, slides, resolvedType, direction, classNames, lazy, infinite, effectiveAutoScroll, hasOverlay]);

  const {
    emblaRef,
    slideStyles,
    emblaApi,
    canScrollPrev,
    canScrollNext,
    scrollNext,
    scrollPrev,
    scrollTo,
    selectedIndex,
    scrollSnaps,
  } = useCarousel({ options: resolvedOptions, slideCount: rawSlideCount });

  // reInit on rawSlideCount — must be after useCarousel to avoid TDZ
  const prevCountRef = useRef(rawSlideCount);
  useEffect(() => {
    if (prevCountRef.current !== rawSlideCount) {
      prevCountRef.current = rawSlideCount;
      requestAnimationFrame(() => emblaApi?.reInit());
    }
  }, [rawSlideCount, emblaApi]);

  const slideChildren = useMemo<ReactNode[]>(() => {
    if (slides && renderSlide) {
      return slides.map((slide, index) =>
        renderSlide(slide, index, {
          isSelected: selectedIndex === index,
          scrollNext,
          scrollPrev,
          scrollTo,
        }),
      );
    }
    return Children.toArray(children);
  }, [children, renderSlide, slides, selectedIndex, scrollNext, scrollPrev, scrollTo]);

  const slideCount = slideChildren.length;
  const resolvedViewportClassName = classViewport ?? viewportClassName;

  const flexBasis = useMemo(() => {
    if (perView <= 1) return "100%";
    return `calc(100% / ${perView})`;
  }, [perView]);

  const gapVal = useMemo(() => {
    if (typeof gap === "number") return `${gap}px`;
    return gap as string;
  }, [gap]);

  const hasGap = useMemo(() => {
    return Boolean(gap && gap !== 0 && gap !== "0" && gap !== "0px");
  }, [gap]);

  const slidesWithStyle = useMemo(
    () =>
      slideChildren.map((child, index) => {
        if (!isValidElement(child)) return child;

        const element = child as ReactElement<{
          className?: string;
          style?: CSSProperties;
        }>;

        const outerStyle: CSSProperties = {
          flex: `0 0 ${flexBasis}`,
          minWidth: 0,
          width: axis === "x" ? flexBasis : "100%",
          height: axis === "y" ? "100%" : flexBasis,
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
          ...(hasGap
            ? axis === "x"
              ? { paddingLeft: gapVal }
              : { paddingTop: gapVal }
            : {}),
        };

        const innerStyle: CSSProperties = {
          width: "100%",
          height: "100%",
          ...element.props.style,
          ...slideStyles[index],
        };

        return (
          <div
            key={index}
            className={`carousel-slide-item flex-shrink-0 relative overflow-hidden ${slideClassName}`}
            style={outerStyle}
          >
            {cloneElement(element, {
              style: innerStyle,
            })}
          </div>
        );
      }),
    [slideChildren, slideStyles, slideClassName, axis, flexBasis, gapVal, hasGap],
  );

  const wrapperStyle: CSSProperties = {
    width: "100%",
    position: "relative",
  };

  const effectiveAspect = slideAspectRatio ?? aspectRatio;
  if (height) {
    wrapperStyle.height = height;
  } else if (effectiveAspect) {
    wrapperStyle.aspectRatio = effectiveAspect;
  }

  return (
    <div
      className={`carousel-wrapper relative ${className}`}
      style={wrapperStyle}
      dir={resolvedOptions.direction ?? direction}
    >
      <CarouselViewport
        emblaRef={emblaRef}
        className={resolvedViewportClassName}
        axis={axis}
        gap={gap}
      >
        {slidesWithStyle}
      </CarouselViewport>

      {showControls && (
        <CarouselControls
          onPrev={scrollPrev}
          onNext={scrollNext}
          canScrollPrev={canScrollPrev}
          canScrollNext={canScrollNext}
          selectedIndex={selectedIndex}
          slideCount={slideCount}
          scrollSnaps={scrollSnaps}
          onDotClick={scrollTo}
          showDots={showDots}
          showCounter={showCounter}
          showArrows={showArrows}
          axis={axis}
          className={`absolute inset-x-0 bottom-3 px-4 z-10 ${classControls}`}
          classDots={classDots}
          classCounter={classCounter}
          classArrows={classArrows}
        />
      )}
    </div>
  );
}
