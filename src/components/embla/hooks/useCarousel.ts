

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { createCarouselEngine } from "../core/engine";
import type { CarouselOptions } from "../types";
import type { EmblaCarouselType } from "embla-carousel";

interface UseCarouselProps {
  options?: CarouselOptions;
  slideCount: number;
}

export function useCarousel({ options, slideCount }: UseCarouselProps) {
  const [slideStyles, setSlideStyles] = useState<CSSProperties[]>([]);
  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const engineRef = useRef<ReturnType<typeof createCarouselEngine> | null>(null);
  const [rootNode, setRootNode] = useState<HTMLElement | null>(null);

  const emblaRef = useCallback((node: HTMLElement | null) => {
    setRootNode(node);
  }, []);

  const updateScrollState = useCallback((api: EmblaCarouselType) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
    setSelectedIndex(api.selectedScrollSnap());
    setScrollSnaps(api.scrollSnapList());
  }, []);

  const scrollNext = useCallback(() => {
    engineRef.current?.scrollNext();
  }, []);

  const scrollPrev = useCallback(() => {
    engineRef.current?.scrollPrev();
  }, []);

  const scrollTo = useCallback((index: number, jump?: boolean) => {
    if (engineRef.current?.emblaApi) {
      engineRef.current.emblaApi.scrollTo(index, jump);
    }
  }, []);

  // Stabilize options serialization so we don't destroy/recreate Embla unnecessarily
  const serializedOptions = useMemo(() => {
    if (!options) return "";
    const { axis, loop, duration, perView, align, dragFree } = options;
    return JSON.stringify({ axis, loop, duration, perView, align, dragFree });
  }, [options]);

  useEffect(() => {
    if (!rootNode) return;

    const engine = createCarouselEngine(rootNode, options ?? {}, (styles, api) => {
      setSlideStyles(styles);
      if (api) {
        updateScrollState(api);
      }
    });

    engineRef.current = engine;
    setEmblaApi(engine.emblaApi);
    updateScrollState(engine.emblaApi);

    const onSelectOrScroll = () => {
      updateScrollState(engine.emblaApi);
    };

    engine.emblaApi.on("select", onSelectOrScroll);
    engine.emblaApi.on("scroll", onSelectOrScroll);
    engine.emblaApi.on("reInit", onSelectOrScroll);

    return () => {
      engine.emblaApi.off("select", onSelectOrScroll);
      engine.emblaApi.off("scroll", onSelectOrScroll);
      engine.emblaApi.off("reInit", onSelectOrScroll);
      engine.destroy();
      engineRef.current = null;
    };
  }, [rootNode, serializedOptions, updateScrollState]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.refresh();
      updateScrollState(engineRef.current.emblaApi);
    }
  }, [slideCount, updateScrollState]);

  return {
    emblaRef,
    slideStyles,
    emblaApi,
    selectedIndex,
    scrollSnaps,
    canScrollPrev,
    canScrollNext,
    scrollNext,
    scrollPrev,
    scrollTo,
  };
}
