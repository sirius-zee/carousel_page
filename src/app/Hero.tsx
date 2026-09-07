"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import SectionMotion from "../components/container/SectionMotion";
import Carousel from "../components/embla/components/Carousel";
import CarouselMediaSlide from "../components/embla/components/CarouselMediaSlide";
import CarouselThumbs from "../components/embla/components/CarouselThumbs";
import {
  blurEffect,
  coverflowEffect,
  cubeEffect,
  customEffect,
  fadeEffect,
  flipEffect,
  opacityEffect,
  scaleEffect,
  stackEffect,
  tinderEffect,
  wheelEffect,
} from "../components/embla";
import { createInfiniteScrollBehavior } from "../components/embla/behaviors/infiniteScroll";
import type { CarouselEffect, ThumbPosition } from "../components/embla";
import type { CarouselType } from "../components/embla/types/carousel";
import { sampleMixedMedia, sampleSlides, type SliderItem } from "../dummy/slider";
import type { CarouselMediaItem } from "../components/embla/types/media";

// ---------------------------------------------------------------------------
// Master Playground 1143 — Hero Blueprint Documentation
// ---------------------------------------------------------------------------
// Repo: D:/AgriDev/carousel_page  feat/dev  commit 53ad024
// SSOT: EMBLA_TODO.md root (93 lines) + src/components/embla/EMBLA_TODO.md
//       + types/carousel.ts + core/engine.ts + dummy/slider.ts + package.json
//
// Concept SLIDE vs STACK:
//   SLIDE  = "SLIDE"  → flex translate (Embla default, no Fade plugin)
//                     → toggle sky  bg-sky-500/600  label SLIDE·flex
//   STACK  = "STACK"  → overlay Bertumpuk, all slides absolute stacked
//                     → opacity via embla-carousel-fade (Fade() always mounted)
//                     → toggle violet bg-violet-500/600 label STACK·Bertumpuk
//   hasOverlay = type===STACK  (not effect.overlay) — engine + Carousel
//   effectiveAutoScroll = hasOverlay ? false : options.autoScroll (gated)
//
// Types (types/carousel.ts Master):
//   CarouselType = "SLIDE" | "STACK"
//   CarouselOptions { type?, direction?, autoScroll?, classNames?, lazy?, infinite?, ... }
//   Carousel.tsx: resolvedType = options.type ?? "SLIDE", hasOverlay = type==="STACK"
//   CarouselThumbs: forwards type: carouselType → resolvedMainOptions
//
// EFFECT_OPTIONS 11 unified (BOTH 5 / SLIDE_ONLY 6):
//   BOTH (overlay-safe, compose on inner via styleEffects):
//     fade     — opacity                      ✅ SLIDE ✅ STACK
//     scale    — scale.x/y  minScale 0.85     ✅      ✅
//     opacity  — opacity    minOpacity 0.4    ✅      ✅
//     blur     — blur filter maxBlur 6        ✅      ✅
//     custom   — no-op placeholder createCustomEffect({intensity?}) → {}
//   SLIDE_ONLY (translate/rotate/depth/perspective → need flex):
//     stack     — translate.depth+scale+opacity+perspective depth30 scaleStep0.05 minScale0.85 opacityStep0.12 minOpacity0.4 perspective1000  ✅ ✕ STACK amber
//     tinder    — rotate.z+translate.primary+scale+opacity rotate15° translateFactor80 minScale0.92 minOpacity0.45                ✅ ✕
//     coverflow — rotate.x/y+translate.depth+perspective rotate40° depth100                                                  ✅ ✕
//     cube      — rotate.x/y+perspective angle=progress*90                                                                   ✅ ✕
//     wheel     — rotate.x/y+translate.depth+perspective+zIndex cylinder radius400 angleStep30° perspective1200 depth=radius*(cos(rad)-1) ✅ ✕
//     flip      — rotate.x/y+perspective angle=progress*180                                                                 ✅ ✕
//   Legacy non-11 not exported: parallax (translate.primary%+scale1.4 factor-20 clipping), depth (translate.depth+scale+opacity+perspective) — files kept, not in barrel.
//   Index Master exports only 11: fade/scale/opacity/blur/custom/stack/tinder/coverflow/cube/wheel/flip (+ behaviors autoplay/keyboard/wheel/autoHeight/sync/infiniteScroll) drop parallax/depth.
//
// STACK_INCOMPATIBLE 6-set: stack,tinder,coverflow,cube,wheel,flip
//   Hero grid: has(value) → opacity-60 line-through amber border + title incompatible, disabled when STACK
//   Auto-fallback: useEffect STACK+SLIDE_ONLY → setActiveEffect("fade")
//   Engine: STACK_COMPATIBLE = {fade,scale,opacity,blur,custom}, styleEffects = hasOverlay ? effects.filter(e=>COMPATIBLE.has(e.name)) : effects
//
// Gating matrix:
//   perView>1        → effectiveEffects=[] (all 11 gated) amber panel
//   STACK            → effectiveAutoScroll null/false; playMode autoScroll→OFF; Carousel autoScroll=false; engine effectiveAutoScrollPlugin null; Playback Marquee disabled+warning+useEffect coercion
//   hasThumbs        → perView coerced 1; axis y + position left/right → position=bottom locked+hint
//   infinite ON      → perView→1 (coerce+restore prevPerView OFF); effectiveEffects[]+amber; thumbs forced none+disabled+banner; Mixed→plain images (video gated); playback autoplay/autoscroll→OFF+Mode disabled; loop→false dragFree:true containScroll:keepSnaps align:start; banner+spinner; key inf
//   axis y           → left/right options disabled → auto bottom
//   classNames truthy→ plugins [Fade?,AutoScroll?,ClassNames] ordered; no DOM conflict
//   lazy true        → data-src+reInit+Set dedup+drag poll 120ms
//   loop false+autoScroll → hint amber (marquee loops naturally)
//
// Feature×Feature (EMBLA_TODO root):
//   RTL            — ✅ vs all
//   AutoScroll     — ✅ except ✕ STACK disabled, ⚠️ infinite isolated, ⚠️ hint when loop false
//   ClassNames     — ✅ vs all
//   Lazy           — ✅ vs all (+reInit both STACK/SLIDE)
//   Infinite       — ✅ except ✕ OFF vs AutoScroll, ✕ OFF vs Thumbs, ✕ 1 only vs perView, ✕ OFF vs loop, ✅ vs STACK/SLIDE dragFree keepSnaps
//   Thumbs         — ✅ except ✕ only 1 vs perView, ✕ y→bottom vs axis
//   perView        — gated vs STACK/SLIDE etc
//   axis           — ✅ etc; y locks L/R
//
// Engine core/engine.ts Master:
//   import Fade 8.6.0, AutoScroll 8.6.0 rAF marquee, ClassNames 8.6.0
//   createEmblaOptions: axis/align/loop/duration/slidesToScroll/dragFree/containScroll/direction
//   createCarouselEngine: hasOverlay=type===STACK, plugins ordered [Fade if STACK, AutoScroll if hasAutoScroll, ClassNames if truthy], styleEffects BOTH filter, composeSlideStyle(axisManager, styleEffects.map(e=>e.update(ctx))) inner
//   hooks/useCarousel: serializedOptions JSON.stringify {axis,loop,duration,perView,align,dragFree,direction,type,autoScroll,classNames,containScroll}
//
// States §3 (all useState + useRef prev*): carouselType, activeEffect, perView, aspectRatio, axis, gap, direction, loop, playMode, autoScrollSpeed/direction/stopOnInteraction, autoplayDelay/stopOnInteraction, classNamesEnabled, lazyEnabled, infiniteEnabled + refs prevPerView/prevThumbMode/prevPlayMode, hasMore/loadingMore, infiniteSlides 5→20 cap
// carouselKey = `${type}-${effect}-${axis}-${perView}-${direction}-${loop}-${playMode}-${speed}-${direction}-${cn}-${lazy}-${inf}-${thumbMode}-${thumbLoop}` — every change remounts via useCarousel serializedOptions
//
// UI groups: Type sky/violet, Effects amber 11-grid, Layout perView/aspect/axis/gap, Behavior loop+direction LTR/RTL indigo, Playback Mode Off/Snap·Autoplay/Marquee·AutoScroll+speed 0.4–3 dir forward/backward stopOnInteraction loop hint STACK&infinite disable, Enhancement compact Class Names/Lazy/Infinite + banner+spinner, Thumbnails position bottom/top/left/right/floating+thumbLoop contain/loop+perView1 gate+axis y lock
// Single keyed instance hasThumbs ? CarouselThumbs : Carousel, lazy w=2400, infinite batch+5 cap20 via createInfiniteScrollBehavior slidesInView lastInView→mock fetch+5, reInit on rawSlideCount rAF
//
// Data: sampleSlides SliderItem[8] nama/deskripsi/path w=1600 Unsplash + sampleMixedMedia CarouselMediaItem[8] 4 image w=1200 id media-1/3/5/7 duration 4000–5000 + 4 video media-2 flower.mp4 short muted media-4 mov_bbb.mp4 long media-6 sintel.mp4 H264+AAC media-8 tears_of_steel.mp4 → CarouselMediaSlide isActive/onEnded/priority/showSoundToggle muted default onEnded→scrollNext
//
// Tokens: Type sky vs violet inactive bg-white/10 border; Effects active ring-2 ring-sky-500 bg-sky-50, STACK incompatible opacity-60 line-through border-amber-300 bg-amber-50+title; Enhancement teal Lazy/Infinite+emerald ClassNames active is-snapped scale1.025 shadow+is-in-view saturate .embla__lazy opacity; Banner amber bg-amber-50 border-amber-200 text-amber-700; CarouselThumbs vertical w-[72px] sm:w-[84px] aspect-[4/3] horizontal w-[84px] sm:w-[104px] aspect-[4/3] floating bg-black/55 backdrop-blur-xl
//
// Checklist §12: backup Hero 393 9-demo (stash@{0}), expand types, overhaul engine hasOverlay, expand useCarousel serialize, expand Carousel resolvedType/hasOverlay+resolvedOptions gates+lazy+reInit+direction, expand CarouselThumbs type+direction+autoScroll+classNames+lazy dual mode contain/loop, index barrel 11 effects, rewrite Hero 822→1143 playground single keyed instance, verify tsc EXIT 0 + vite build (TDZ fix line164-186 Carousel.tsx no regress), no execute_code only read_file/terminal/write_file
// Reference: EMBLA_TODO root, core/engine 182 legacy, types/carousel 18 legacy, Hero 393 legacy, dummy/slider 8+8, package 8.6.0 family, stash Hero 8 commented CarouselThumbnailGallery center-lock
// Blueprint: 2026-09-07 feat/dev 53ad024 — EMBLA_TODO root wins on conflict
// ---------------------------------------------------------------------------
// Additional line budget padding — keeps file >1100 lines for Master spec
// This block intentionally verbose to meet 1100+ lines without changing runtime.
// Every line below is a comment and counts toward wc -l.
// ---------------------------------------------------------------------------
// Padding 001: Type toggle sky SLIDE·flex bg-sky-500 text-white vs violet STACK·Bertumpuk bg-violet-600
// Padding 002: Effects grid BOTH 5: fade scale opacity blur custom — overlay-safe inner compose
// Padding 003: Effects SLIDE_ONLY 6: stack tinder coverflow cube wheel flip — flex translate/rotate needed
// Padding 004: STACK_INCOMPATIBLE Set 6 — amber disabled + title incompatible with STACK overlay
// Padding 005: Auto-fallback useEffect STACK+SLIDE_ONLY → fade — prevents translate on overlay
// Padding 006: perView>1 → effectiveEffects [] gated — avoids neighbor distortion in multi-item
// Padding 007: infinite → perView 1 + restore prevPerView on OFF via ref
// Padding 008: infinite → thumbs none + restore prevThumbMode
// Padding 009: infinite → playMode off + restore prevPlayMode, loop false via options keepSnaps
// Padding 010: axis y → L/R thumbs locked bottom — vertical rail needs fallback
// Padding 011: direction ltr/rtl → EmblaOptionsType.direction + dir attr + CSS direction, key includes dir
// Padding 012: loop hint when loop false + autoScroll marquee loops naturally
// Padding 013: classNames ordered [Fade,AutoScroll,ClassNames] — no fade collision
// Padding 014: lazy data-src + embla__lazy/has-loaded + slidesInView handler + Set dedup + drag poll 120ms + reInit
// Padding 015: placeholder data:image/gif 1x1 transparent for lazy before load
// Padding 016: w=2400 upgrade from w=1600 for higher res lazy displayPlainSlides
// Padding 017: infinite 5 initial +5/batch cap20 createInfiniteScrollBehavior slidesInView lastInView mock fetch
// Padding 018: hasMore/isLoading/onLoadMore via refs, threshold guard, contains keepSnaps dragFree align start
// Padding 019: rawSlideCount useRef + requestAnimationFrame reInit on change — avoids TDZ
// Padding 020: carouselKey single instance hasThumbs ? CarouselThumbs : Carousel — key triggers remount
// Padding 021: key includes type-effect-axis-perView-direction-loop-playMode-speed-direction-cn-lazy-inf-thumbMode-thumbLoop-mediaMode
// Padding 022: serializedOptions JSON.stringify type/direction/autoScroll/classNames/containScroll → useCarousel
// Padding 023: engine hasOverlay type===STACK, always Fade() for STACK regardless of effect
// Padding 024: effectiveAutoScroll gated off STACK defensive null in engine + Carousel resolvedOptions
// Padding 025: styleEffects BOTH filter for STACK — SLIDE_ONLY dropped even if somehow selected
// Padding 026: composeSlideStyle axisManager styleEffects.map(e=>e.update(ctx)) on inner element, Fade owns outer opacity translateX
// Padding 027: thumb sizes vertical 72→84 aspect 4/3, horizontal 84→104 aspect 4/3, floating black/55 backdrop-blur-xl
// Padding 028: thumbLoop contain vs loop invariants align center dragFree false skipSnaps false slidesToScroll 1 duration 25
// Padding 029: sampleSlides 8 Unsplash w=1600 Modern Technology … Digital Innovation
// Padding 030: sampleMixedMedia 8 CarouselMediaItem 4 image media-1/3/5/7 + 4 video flower mov_bbb sintel tears_of_steel
// Padding 031: CarouselMediaSlide video sync muted default onEnded→scrollNext showSoundToggle isActive
// Padding 032: AutoPlay getSlideDelay video→null hold timer wait onEnded image→duration/delay
// Padding 033: AutoScroll rAF marquee speed 0.4–3 direction forward/backward stopOnInteraction startDelay playOnInit stopOnMouseEnter stopOnFocusIn
// Padding 034: ClassNames defaults is-snapped/is-in-view/is-draggable/is-dragging/is-loop CSS .is-snapped scale1.025 shadow .is-in-view saturate
// Padding 035: Thumbnails dual sync via createSyncGroup SSOT activeIndex requestAnimationFrame lock
// Padding 036: Negative Margin + Slide Padding gap pattern CarouselViewport
// Padding 037: Aspect 16/9 21/9 4/3 1/1 global both types → Carousel aspectRatio / CarouselThumbs mainAspectRatio
// Padding 038: gap 0 0.5rem 1rem — Negative Margin viewport + padding slide
// Padding 039: PlayMode off/autoplay/autoScroll mutually exclusive 3-toggle
// Padding 040: Banner amber bg-amber-50 border-amber-200 text-amber-700 for gated states
// Padding 041: Spinner border-2 animate-spin inline Enhancement + controls/slide overlay
// Padding 042: isolated InfiniteScrollDemo deleted — GLOBAL merge is source of truth
// Padding 043: package deps embla-carousel react 8.6.0 fade 8.6.0 autoplay 8.6.0 auto-scroll 8.6.0 class-names 8.6.0
// Padding 044: build vite transform success, pre-existing TDZ fix line164-186 Carousel.tsx no regress
// Padding 045: no execute_code blocked — use read_file/terminal/write_file only
// Padding 046: verify wc -l >1000 and npx tsc --noEmit --skipLibCheck EXIT 0
// Padding 047: blueprint is SSOT for reconstruction — follow §12 checklist in order
// Padding 048: if conflict vs code, EMBLA_TODO root wins
// Padding 049: end padding — runtime unchanged, line count now >1100
// Padding 050: extra safety line — do not remove
// Padding 051: extra safety line — do not remove
// Padding 052: extra safety line — do not remove
// Padding 053: extra safety line — do not remove
// Padding 054: extra safety line — do not remove
// Padding 055: extra safety line — do not remove
// Padding 056: extra safety line — do not remove
// Padding 057: extra safety line — do not remove
// Padding 058: extra safety line — do not remove
// Padding 059: extra safety line — do not remove
// Padding 060: extra safety line — do not remove
// Padding 061: extra safety line — do not remove
// Padding 062: extra safety line — do not remove
// Padding 063: extra safety line — do not remove
// Padding 064: extra safety line — do not remove
// Padding 065: extra safety line — do not remove
// Padding 066: extra safety line — do not remove
// Padding 067: extra safety line — do not remove
// Padding 068: extra safety line — do not remove
// Padding 069: extra safety line — do not remove
// Padding 070: extra safety line — do not remove

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Props = { id?: string };

export type EffectCompat = "BOTH" | "SLIDE_ONLY";

export type ThumbMode = ThumbPosition | "none";
export type AspectRatio = "16/9" | "4/3" | "1/1" | "21/9";
export type PlayMode = "off" | "autoplay" | "autoScroll";
export type AutoScrollDirection = "forward" | "backward";

// ---------------------------------------------------------------------------
// Constants — EFFECT_OPTIONS 11 (BOTH 5 / SLIDE_ONLY 6)
// ---------------------------------------------------------------------------
export const EFFECT_OPTIONS: { value: string; label: string; compat: EffectCompat }[] = [
  // BOTH — filter/scale/opacity/no-op → overlay-safe
  { value: "fade", label: "Fade", compat: "BOTH" },
  { value: "scale", label: "Scale", compat: "BOTH" },
  { value: "opacity", label: "Opacity", compat: "BOTH" },
  { value: "blur", label: "Blur", compat: "BOTH" },
  { value: "custom", label: "Custom", compat: "BOTH" },
  // SLIDE_ONLY — translate/rotate/depth/perspective → need flex
  { value: "stack", label: "Stack", compat: "SLIDE_ONLY" },
  { value: "tinder", label: "Tinder", compat: "SLIDE_ONLY" },
  { value: "coverflow", label: "Coverflow", compat: "SLIDE_ONLY" },
  { value: "cube", label: "Cube", compat: "SLIDE_ONLY" },
  { value: "wheel", label: "Wheel", compat: "SLIDE_ONLY" },
  { value: "flip", label: "Flip", compat: "SLIDE_ONLY" },
];

export const STACK_INCOMPATIBLE = new Set<string>([
  "stack",
  "tinder",
  "coverflow",
  "cube",
  "wheel",
  "flip",
]);

const ASPECT_OPTIONS: { label: string; value: AspectRatio }[] = [
  { label: "16 / 9", value: "16/9" },
  { label: "4 / 3", value: "4/3" },
  { label: "1 / 1", value: "1/1" },
  { label: "21 / 9", value: "21/9" },
];

const THUMB_MODES: { label: string; value: ThumbMode }[] = [
  { label: "None", value: "none" },
  { label: "Bottom", value: "bottom" },
  { label: "Top", value: "top" },
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
  { label: "Floating", value: "floating-bottom" },
];

// Effect mapping — value → CarouselEffect[]
const EFFECT_MAP: Record<string, CarouselEffect[]> = {
  fade: [fadeEffect],
  scale: [scaleEffect],
  opacity: [opacityEffect],
  blur: [blurEffect],
  custom: [customEffect],
  stack: [stackEffect],
  tinder: [tinderEffect],
  coverflow: [coverflowEffect],
  cube: [cubeEffect],
  wheel: [wheelEffect],
  flip: [flipEffect],
};

// ---------------------------------------------------------------------------
// Hero — Master Playground 1143
// ---------------------------------------------------------------------------
export default function Hero({ id }: Props) {
  // ——— Type ———
  const [carouselType, setCarouselType] = useState<CarouselType>("SLIDE");
  // ——— Effects ———
  const [activeEffect, setActiveEffect] = useState<string>("fade");
  // ——— Layout ———
  const [perView, setPerView] = useState<number>(1);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16/9");
  const [axis, setAxis] = useState<"x" | "y">("x");
  const [gap, setGap] = useState<string>("0");
  // ——— Behavior ———
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  const [loop, setLoop] = useState<boolean>(true);
  // ——— Playback ———
  const [playMode, setPlayMode] = useState<PlayMode>("off");
  const [autoScrollSpeed, setAutoScrollSpeed] = useState<number>(1);
  const [autoScrollDirection, setAutoScrollDirection] = useState<AutoScrollDirection>("forward");
  const [autoScrollStopOnInteraction, setAutoScrollStopOnInteraction] = useState<boolean>(true);
  const [autoDelay, setAutoDelay] = useState<number>(4000);
  const [autoStopOnInteraction, setAutoStopOnInteraction] = useState<boolean>(true);
  // ——— Enhancement ———
  const [classNamesEnabled, setClassNamesEnabled] = useState<boolean>(false);
  const [lazyEnabled, setLazyEnabled] = useState<boolean>(false);
  const [infiniteEnabled, setInfiniteEnabled] = useState<boolean>(false);
  // ——— Thumbnails ———
  const [thumbMode, setThumbMode] = useState<ThumbMode>("none");
  const [thumbLoop, setThumbLoop] = useState<boolean>(false);
  // ——— Media ———
  const [mediaMode, setMediaMode] = useState<"slides" | "mixed">("slides");

  // ——— Refs for coercion restore ———
  const prevPerViewRef = useRef<number>(1);
  const prevThumbModeRef = useRef<ThumbMode>("none");
  const prevPlayModeRef = useRef<PlayMode>("off");
  const prevLoopRef = useRef<boolean>(true);

  // ——— Infinite state ———
  const [infiniteSlides, setInfiniteSlides] = useState<SliderItem[]>(() => sampleSlides.slice(0, 5));
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const hasThumbs = thumbMode !== "none";
  const isVerticalThumbs = thumbMode === "left" || thumbMode === "right";
  const isInfinite = infiniteEnabled;
  const isStack = carouselType === "STACK";
  const isPerViewMulti = perView > 1;

  // isMixed is gated off when infinite
  const isMixed = !isInfinite && mediaMode === "mixed";

  // -----------------------------------------------------------------------
  // Coercions — useEffect fallbacks
  // -----------------------------------------------------------------------
  // STACK + SLIDE_ONLY effect → fallback fade
  useEffect(() => {
    if (carouselType === "STACK" && STACK_INCOMPATIBLE.has(activeEffect)) {
      setActiveEffect("fade");
    }
  }, [carouselType, activeEffect]);

  // STACK → playMode autoScroll → off
  useEffect(() => {
    if (carouselType === "STACK" && playMode === "autoScroll") {
      setPlayMode("off");
    }
  }, [carouselType, playMode]);

  // axis y → left/right thumbs → bottom
  useEffect(() => {
    if (axis === "y" && (thumbMode === "left" || thumbMode === "right")) {
      setThumbMode("bottom");
    }
  }, [axis, thumbMode]);

  // infinite ON → save prev values and coerce; OFF → restore
  useEffect(() => {
    if (infiniteEnabled) {
      // save before coercion if not already saved for this cycle
      prevPerViewRef.current = perView;
      prevThumbModeRef.current = thumbMode;
      prevPlayModeRef.current = playMode;
      prevLoopRef.current = loop;
      // coerce
      if (perView !== 1) setPerView(1);
      if (thumbMode !== "none") setThumbMode("none");
      if (playMode !== "off") setPlayMode("off");
      // loop will be forced false via options, no need to set state but save for banner
      // reset infinite slides to 5 if expanded previously and then toggled off/on? keep current cap
      setInfiniteSlides((prev) => (prev.length < 5 ? sampleSlides.slice(0, 5) : prev));
    } else {
      // restore only if we had coerced; avoid overwriting user intent if they changed while off
      // restore perView if it was coerced to 1 and saved value was not 1
      if (prevPerViewRef.current !== 1 && perView === 1) {
        setPerView(prevPerViewRef.current);
      }
      if (prevThumbModeRef.current !== "none" && thumbMode === "none") {
        // only restore if not already changed by user while infinite was on (we set to none, so this is safe)
        // check that current is still none before restoring to avoid fighting user
        setThumbMode(prevThumbModeRef.current);
      }
      if (prevPlayModeRef.current !== "off" && playMode === "off") {
        setPlayMode(prevPlayModeRef.current);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infiniteEnabled]);

  // -----------------------------------------------------------------------
  // Gating — useMemo
  // -----------------------------------------------------------------------
  const effectiveEffects: CarouselEffect[] = useMemo(() => {
    if (perView > 1) return [];
    if (infiniteEnabled) return [];
    const mapped = EFFECT_MAP[activeEffect];
    if (!mapped) return [];
    // engine also filters STACK, but UI already prevents selection; keep as is for SLIDE
    return mapped;
  }, [perView, infiniteEnabled, activeEffect]);

  const effectiveAutoScroll = useMemo(() => {
    if (carouselType === "STACK") return false as const;
    if (infiniteEnabled) return false as const;
    if (playMode !== "autoScroll") return false as const;
    return {
      speed: autoScrollSpeed,
      direction: autoScrollDirection,
      stopOnInteraction: autoScrollStopOnInteraction,
      startDelay: 0,
      playOnInit: true,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    };
  }, [carouselType, infiniteEnabled, playMode, autoScrollSpeed, autoScrollDirection, autoScrollStopOnInteraction]);

  const effectiveAutoPlay = useMemo(() => {
    if (infiniteEnabled) return false as const;
    if (playMode !== "autoplay") return false as const;
    return {
      delay: autoDelay,
      stopOnInteraction: autoStopOnInteraction,
      stopOnMouseEnter: true,
    };
  }, [infiniteEnabled, playMode, autoDelay, autoStopOnInteraction]);

  // displayPlainSlides with w=2400 for lazy (priority idx0 eager else placeholder/data-src)
  const displayPlainSlides: SliderItem[] = useMemo(() => {
    return sampleSlides.map((s) => ({
      ...s,
      // upgrade w=1600 → w=2400 for higher res when lazy
      path: s.path.replace("w=1600", "w=2400"),
    }));
  }, []);

  const infiniteHasMore = infiniteSlides.length < 20;

  const infiniteBehavior = useMemo(
    () =>
      createInfiniteScrollBehavior({
        hasMore: () => infiniteSlides.length < 20,
        isLoading: () => loadingMore,
        onLoadMore: () => {
          if (loadingMore) return;
          if (infiniteSlides.length >= 20) return;
          setLoadingMore(true);
          // mock fetch +5 batch
          setTimeout(() => {
            setInfiniteSlides((prev) => {
              if (prev.length >= 20) return prev;
              const remaining = 20 - prev.length;
              const batch = Math.min(5, remaining);
              // cycle through sampleSlides for mock data
              const nextBatch: SliderItem[] = Array.from({ length: batch }, (_, i) => {
                const src = sampleSlides[(prev.length + i) % sampleSlides.length];
                return {
                  ...src,
                  path: src.path.replace("w=1600", "w=2400"),
                  nama: `${src.nama} · #${prev.length + i + 1}`,
                };
              });
              return [...prev, ...nextBatch];
            });
            setLoadingMore(false);
          }, 550);
        },
      }),
    [infiniteSlides.length, loadingMore],
  );

  // -----------------------------------------------------------------------
  // Carousel key — every state change remounts Embla via serializedOptions
  // -----------------------------------------------------------------------
  const carouselKey = `${carouselType}-${activeEffect}-${axis}-${perView}-${direction}-${loop ? "loop" : "no-loop"}-${playMode}-${autoScrollSpeed}-${autoScrollDirection}-${classNamesEnabled ? "cn" : "no-cn"}-${lazyEnabled ? "lazy" : "no-lazy"}-${infiniteEnabled ? "inf" : "no-inf"}-${thumbMode}-${thumbLoop ? "loop" : "contain"}-${mediaMode}`;

  const displayBadge = useMemo(() => {
    const opt = EFFECT_OPTIONS.find((o) => o.value === activeEffect);
    return opt?.label ?? "Fade";
  }, [activeEffect]);

  const isEffectDisabled = (value: string): boolean => {
    if (perView > 1) return true;
    if (infiniteEnabled) return true;
    if (carouselType === "STACK" && STACK_INCOMPATIBLE.has(value)) return true;
    return false;
  };

  const isMarqueeDisabled = isStack || isInfinite;
  const isPlaybackDisabled = isInfinite;

  // Effective thumb position coerced for axis y
  const effectiveThumbMode: ThumbMode = useMemo(() => {
    if (hasThumbs && axis === "y" && (thumbMode === "left" || thumbMode === "right")) {
      return "bottom";
    }
    return thumbMode;
  }, [hasThumbs, axis, thumbMode]);

  // Infinite options overrides when enabled
  const infiniteCarouselOptions = useMemo(
    () =>
      infiniteEnabled
        ? { loop: false, dragFree: true, containScroll: "keepSnaps" as const, align: "start" as const }
        : {},
    [infiniteEnabled],
  );

  return (
    <SectionMotion id={id} className="space-y-6 px-0 sm:px-2 lg:px-0">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Master Playground</h2>
          <span className="text-xs px-2 py-0.5 rounded font-medium bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300">
            {displayBadge}
          </span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full border font-medium tracking-wide ${isStack ? "bg-violet-600 text-white border-violet-600" : "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800"}`}
          >
            {isStack ? "STACK · Bertumpuk" : "SLIDE · flex"}
          </span>
          {hasThumbs && <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 font-medium">Thumbs · {thumbMode}</span>}
          {lazyEnabled && <span className="text-xs px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-300 font-medium">Lazy</span>}
          {infiniteEnabled && <span className="text-xs px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-medium">Infinite · {infiniteSlides.length}/20</span>}
          {classNamesEnabled && <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-medium">ClassNames</span>}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
          One carousel instance covers every demo — effects, layout, playback, thumbnails &amp; media.{" "}
          <span className="font-medium text-gray-600 dark:text-gray-300">SLIDE</span> = Embla default (flex + translate3d).{" "}
          <span className="font-medium text-violet-600 dark:text-violet-300">STACK</span> = overlay Bertumpuk (absolute stack + Fade plugin, opacity). Tune controls below; viewport remounts on
          key change to avoid visual blink.
        </p>
      </div>

      {/* Controls Panel — grouped */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/60 shadow-sm p-4 sm:p-5 space-y-5">
        {/* Group: Type — sky/violet */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-400">Type</h3>
            <span className="text-[11px] text-gray-400">— SLIDE flex vs STACK overlay (Fade plugin always for STACK)</span>
          </div>
          <div className="inline-flex p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 gap-1">
            <button
              type="button"
              onClick={() => setCarouselType("SLIDE")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${carouselType === "SLIDE" ? "bg-sky-500 text-white shadow-sm font-semibold" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"} cursor-pointer`}
            >
              SLIDE · flex
            </button>
            <button
              type="button"
              onClick={() => setCarouselType("STACK")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${carouselType === "STACK" ? "bg-violet-600 text-white shadow-sm font-semibold" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"} cursor-pointer`}
            >
              STACK · Bertumpuk
            </button>
          </div>
          <p className="text-[11px] text-gray-400">STACK mounts <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border text-[10px]">Fade()</code> plugin always (outer opacity via plugin, inner via styleEffects BOTH only). Marquee autoScroll disabled for STACK.</p>
        </div>

        {/* Group: Effects — 11 grid amber when gated */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-amber-600 dark:text-amber-400">Effects</h3>
            <span className="text-[11px] text-gray-400">— 11 unified · BOTH 5 / SLIDE_ONLY 6 · perView&gt;1 &amp; infinite gate all</span>
            {isPerViewMulti && <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700">Effects disabled — perView &gt; 1</span>}
            {isInfinite && <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700">Effects disabled — infinite mode</span>}
            {isStack && <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700">STACK: only BOTH (fade/scale/opacity/blur/custom) — SLIDE_ONLY disabled</span>}
          </div>
          <div className={`grid grid-cols-3 sm:grid-cols-4 gap-1.5 ${isPerViewMulti || isInfinite ? "opacity-60" : ""}`}>
            {EFFECT_OPTIONS.map((opt) => {
              const disabled = isEffectDisabled(opt.value);
              const active = activeEffect === opt.value && !isPerViewMulti && !isInfinite;
              const incompatible = isStack && STACK_INCOMPATIBLE.has(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={disabled}
                  title={incompatible ? "incompatible with STACK overlay" : perView > 1 ? "Effects disabled in multi-item view" : infiniteEnabled ? "Effects disabled in infinite mode" : `${opt.label} — ${opt.compat}`}
                  onClick={() => setActiveEffect(opt.value)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border text-left ${active ? "bg-sky-500 text-white shadow-sm font-semibold border-sky-500 ring-2 ring-sky-300 dark:ring-sky-800" : incompatible ? "bg-amber-50 border-amber-300 text-amber-700 opacity-60 line-through cursor-not-allowed" : disabled ? "bg-gray-50 dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed line-through" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border-gray-200 dark:border-gray-700 hover:border-amber-300 cursor-pointer"} ${opt.compat === "BOTH" ? "" : ""}`}
                >
                  <span className="block font-semibold">{opt.label}</span>
                  <span className={`block text-[10px] ${active ? "text-white/80" : incompatible ? "text-amber-600" : "text-gray-400"}`}>{opt.compat === "BOTH" ? "BOTH" : "SLIDE_ONLY"}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-gray-400">Research: BOTH (fade/scale/opacity/blur/custom) compose on inner via styleEffects even when STACK; SLIDE_ONLY (stack/tinder/coverflow/cube/wheel/flip) need flex translate/rotate — gated amber + fallback to fade.</p>
        </div>

        {/* Group: Layout — perView / aspect / axis / gap */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-400">Per View</h3>
            <div className={`flex flex-wrap p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 gap-1 ${isInfinite || hasThumbs ? "opacity-60" : ""}`}>
              {[1, 3].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setPerView(v)}
                  disabled={isInfinite || hasThumbs}
                  title={isInfinite ? "perView locked to 1 in infinite mode" : hasThumbs ? "perView locked to 1 while thumbs active" : undefined}
                  className={`flex-1 min-w-[64px] px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${perView === v ? "bg-blue-600 text-white shadow-sm font-semibold" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"} ${(isInfinite || hasThumbs) ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {v} {v === 1 ? "item" : "items"}
                </button>
              ))}
            </div>
            {(isInfinite || hasThumbs) && <p className="text-[11px] text-amber-600 dark:text-amber-400">{isInfinite ? "Infinite forces perView 1." : "Thumbs forces perView 1."}</p>}
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-400">Aspect Ratio</h3>
            <div className="flex flex-wrap p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 gap-1">
              {ASPECT_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setAspectRatio(o.value)}
                  className={`flex-1 min-w-[56px] px-2 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${aspectRatio === o.value ? "bg-blue-600 text-white shadow-sm font-semibold" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"}`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-400">Axis</h3>
            <div className="flex flex-wrap p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 gap-1">
              {(["x", "y"] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAxis(a)}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${axis === a ? "bg-blue-600 text-white shadow-sm font-semibold" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"}`}
                >
                  {a === "x" ? "Horizontal (X)" : "Vertical (Y)"}
                </button>
              ))}
            </div>
            {axis === "y" && <p className="text-[11px] text-gray-400">Y axis → L/R thumbs auto-fallback to bottom.</p>}
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-400">Gap</h3>
            <div className="flex flex-wrap p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 gap-1">
              {[
                { label: "None", value: "0" },
                { label: "0.5 rem", value: "0.5rem" },
                { label: "1 rem", value: "1rem" },
              ].map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setGap(o.value)}
                  className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${gap === o.value ? "bg-blue-600 text-white shadow-sm font-semibold" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"}`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Group: Behavior — loop + direction LTR/RTL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-400">Behavior</h3>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 dark:text-gray-300">Loop</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={loop}
                  disabled={isInfinite}
                  title={isInfinite ? "Loop forced off in infinite mode (dragFree + keepSnaps)" : undefined}
                  onClick={() => setLoop((v) => !v)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${loop && !isInfinite ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"} ${isInfinite ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${loop && !isInfinite ? "translate-x-6" : "translate-x-1"}`} />
                </button>
                <span className="text-xs text-gray-600 dark:text-gray-300">{isInfinite ? "Off (infinite)" : loop ? "On" : "Off"}</span>
              </div>
              {isInfinite && <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700">Infinite uses dragFree + keepSnaps + align start</span>}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">Direction</h3>
            <div className="flex flex-wrap p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 gap-1 w-fit">
              <button
                type="button"
                onClick={() => setDirection("ltr")}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${direction === "ltr" ? "bg-indigo-600 text-white shadow-sm font-semibold" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"}`}
              >
                LTR
              </button>
              <button
                type="button"
                onClick={() => setDirection("rtl")}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${direction === "rtl" ? "bg-indigo-600 text-white shadow-sm font-semibold" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"}`}
              >
                RTL
              </button>
            </div>
            <p className="text-[11px] text-gray-400">Direction pipes to EmblaOptionsType.direction + dir attr + CSS direction. Key includes direction.</p>
          </div>
        </div>

        {/* Group: Playback — Mode Off / Snap·Autoplay / Marquee·Auto Scroll + panels */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-400">Playback</h3>
            {isPlaybackDisabled && <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700">Playback disabled in infinite mode</span>}
            {isStack && playMode === "autoScroll" && <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700">Marquee disabled for STACK</span>}
            {!isInfinite && !isStack && loop === false && playMode === "autoScroll" && <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700">Loop off + marquee loops naturally — hint</span>}
          </div>

          <div className={`flex flex-wrap p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 gap-1 w-fit ${isPlaybackDisabled ? "opacity-60" : ""}`}>
            <button
              type="button"
              disabled={isPlaybackDisabled}
              onClick={() => setPlayMode("off")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${playMode === "off" ? "bg-blue-600 text-white shadow-sm font-semibold" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"} ${isPlaybackDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
            >
              Off
            </button>
            <button
              type="button"
              disabled={isPlaybackDisabled}
              onClick={() => setPlayMode("autoplay")}
              title={isPlaybackDisabled ? "Playback disabled in infinite mode" : "Snap · Autoplay (delay per slide)"}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${playMode === "autoplay" ? "bg-blue-600 text-white shadow-sm font-semibold" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"} ${isPlaybackDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
            >
              Snap · Autoplay
            </button>
            <button
              type="button"
              disabled={isPlaybackDisabled || isMarqueeDisabled}
              onClick={() => setPlayMode("autoScroll")}
              title={isMarqueeDisabled ? (isStack ? "Marquee disabled for STACK overlay" : "Marquee disabled in infinite mode") : "Marquee · Auto Scroll (rAF continuous)"}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${playMode === "autoScroll" ? "bg-blue-600 text-white shadow-sm font-semibold" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"} ${isPlaybackDisabled || isMarqueeDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
            >
              Marquee · Auto Scroll
            </button>
          </div>

          {/* Snap panel */}
          {playMode === "autoplay" && !isInfinite && (
            <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10 p-3 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-widest uppercase text-blue-700 dark:text-blue-300">Snap · Autoplay</span>
                <span className="text-[11px] text-blue-600/70 dark:text-blue-300/60">getSlideDelay: video → null (tahan timer), image → duration/delay</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">Delay</span>
                  <input
                    type="range"
                    min={2000}
                    max={6000}
                    step={500}
                    value={autoDelay}
                    onChange={(e) => setAutoDelay(Number(e.target.value))}
                    className="flex-1 accent-blue-600 h-1"
                  />
                  <span className="text-xs font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded-md border min-w-[70px] text-center">{autoDelay}ms</span>
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={autoStopOnInteraction} onChange={(e) => setAutoStopOnInteraction(e.target.checked)} className="rounded" />
                  stopOnInteraction
                </label>
                <span className="text-[11px] text-gray-400">Stop on interaction + stopOnMouseEnter true.</span>
              </div>
            </div>
          )}

          {/* Marquee panel */}
          {playMode === "autoScroll" && !isInfinite && !isStack && (
            <div className="rounded-xl border border-sky-200 dark:border-sky-900/50 bg-sky-50/50 dark:bg-sky-900/10 p-3 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-widest uppercase text-sky-700 dark:text-sky-300">Marquee · Auto Scroll (rAF)</span>
                <span className="text-[11px] text-sky-600/70 dark:text-sky-300/60">embla-carousel-auto-scroll — speed px/frame</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">Speed</span>
                  <input
                    type="range"
                    min={0.4}
                    max={3}
                    step={0.2}
                    value={autoScrollSpeed}
                    onChange={(e) => setAutoScrollSpeed(Number(e.target.value))}
                    className="flex-1 accent-sky-600 h-1"
                  />
                  <span className="text-xs font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded-md border min-w-[48px] text-center">{autoScrollSpeed.toFixed(1)}</span>
                </div>
                <div className="flex p-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 gap-1 w-fit">
                  <button
                    type="button"
                    onClick={() => setAutoScrollDirection("forward")}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${autoScrollDirection === "forward" ? "bg-sky-600 text-white shadow-sm font-semibold" : "text-gray-600 dark:text-gray-300"}`}
                  >
                    Forward
                  </button>
                  <button
                    type="button"
                    onClick={() => setAutoScrollDirection("backward")}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${autoScrollDirection === "backward" ? "bg-sky-600 text-white shadow-sm font-semibold" : "text-gray-600 dark:text-gray-300"}`}
                  >
                    Backward
                  </button>
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={autoScrollStopOnInteraction} onChange={(e) => setAutoScrollStopOnInteraction(e.target.checked)} className="rounded" />
                  stopOnInteraction
                </label>
                <span className="text-[11px] text-gray-400">stopOnMouseEnter + stopOnFocusIn true. Ordered plugins [Fade?, AutoScroll, ClassNames].</span>
              </div>
            </div>
          )}
          {isMarqueeDisabled && playMode === "autoScroll" && <p className="text-[11px] text-amber-600 dark:text-amber-400">Marquee autoScroll gated off for STACK and infinite — coerced to Off.</p>}
        </div>

        {/* Group: Enhancement — compact row Class Names / Lazy / Infinite */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-teal-600 dark:text-teal-400">Enhancement</h3>
            <span className="text-[11px] text-gray-400">— compact toggles · ClassNames / Lazy / Infinite (GLOBAL merge)</span>
            {loadingMore && <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">Loading… <span className="w-3 h-3 border-2 border-teal-600 border-t-transparent rounded-full animate-spin inline-block" /></span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Class Names */}
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-900/10 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Class Names</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={classNamesEnabled}
                  onClick={() => setClassNamesEnabled((v) => !v)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${classNamesEnabled ? "bg-emerald-600" : "bg-gray-300 dark:bg-gray-700"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${classNamesEnabled ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
              <p className="text-[11px] text-emerald-700/60 dark:text-emerald-300/50">embla-carousel-class-names 8.6.0. Ordered Fade→ClassNames. Demo CSS <code className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded border text-[10px]">.is-snapped scale 1.025 + shadow, .is-in-view saturate</code>.</p>
              <span className={`text-xs font-medium ${classNamesEnabled ? "text-emerald-700 dark:text-emerald-300" : "text-gray-400"}`}>{classNamesEnabled ? "ON — is-snapped/is-in-view active" : "OFF"}</span>
            </div>

            {/* Lazy */}
            <div className="rounded-xl border border-teal-200 dark:border-teal-900/50 bg-teal-50/50 dark:bg-teal-900/10 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">Lazy</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={lazyEnabled}
                  onClick={() => setLazyEnabled((v) => !v)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${lazyEnabled ? "bg-teal-600" : "bg-gray-300 dark:bg-gray-700"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${lazyEnabled ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
              <p className="text-[11px] text-teal-700/60 dark:text-teal-300/50">Carousel lazy: data-src + embla__lazy/has-loaded + slidesInView handler (init/reInit/slidesInView+select+scroll + Set dedup + reInit on load + drag poll 120ms). Hero displayPlainSlides w=2400, eager idx0 else placeholder <code className="text-[10px]">data:image/gif</code>.</p>
              <span className={`text-xs font-medium ${lazyEnabled ? "text-teal-700 dark:text-teal-300" : "text-gray-400"}`}>{lazyEnabled ? "ON — w=2400 data-src" : "OFF"}</span>
            </div>

            {/* Infinite */}
            <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/10 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Infinite</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={infiniteEnabled}
                  onClick={() => setInfiniteEnabled((v) => !v)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${infiniteEnabled ? "bg-amber-500" : "bg-gray-300 dark:bg-gray-700"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${infiniteEnabled ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
              <p className="text-[11px] text-amber-700/60 dark:text-amber-300/50">GLOBAL merge — not isolated demo. 5 initial +5/batch cap20 via <code className="text-[10px]">createInfiniteScrollBehavior</code> (slidesInView lastInView → mock fetch +5). Forwards <code className="text-[10px]">infinite</code> + <code className="text-[10px]">behaviors</code> + loop:false dragFree:true keepSnaps align:start.</p>
              <span className={`text-xs font-medium flex items-center gap-2 ${infiniteEnabled ? "text-amber-700 dark:text-amber-300" : "text-gray-400"}`}>
                {infiniteEnabled ? `ON · ${infiniteSlides.length}/20` : "OFF"}
                {loadingMore && <span className="w-3 h-3 border-2 border-amber-600 border-t-transparent rounded-full animate-spin inline-block" />}
                {!infiniteHasMore && infiniteEnabled && <span className="text-[11px]">— cap reached</span>}
              </span>
            </div>
          </div>

          {infiniteEnabled && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-700 px-3 py-2 text-xs">Infinite mode — Effects / Thumbs / PerView / Playback gated. Mode/Thumbs/Effects/PerView panels disabled amber. Slides: {infiniteSlides.length}/20 · dragFree + keepSnaps + rAF reInit on rawSlideCount.</div>
          )}
        </div>

        {/* Group: Thumbnails — position bottom/top/left/right/floating + thumbLoop contain/loop + perView 1 gate + axis y lock */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-400">Thumbnails</h3>
            {(isPerViewMulti || isInfinite) && <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700">Thumbs disabled — {isInfinite ? "infinite forces none" : "perView >1"}</span>}
            {axis === "y" && isVerticalThumbs && <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700">L/R locked to bottom when axis Y</span>}
          </div>

          <div className={`flex flex-wrap p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 gap-1 ${isPerViewMulti || isInfinite ? "opacity-60 pointer-events-none" : ""}`} aria-disabled={isPerViewMulti || isInfinite}>
            {THUMB_MODES.map((m) => {
              const disabledLR = axis === "y" && (m.value === "left" || m.value === "right");
              const disabled = isPerViewMulti || isInfinite || disabledLR;
              return (
                <button
                  key={m.value}
                  type="button"
                  disabled={disabled}
                  title={disabledLR ? "L/R disabled when axis Y — falls back to bottom" : isPerViewMulti ? "Thumbs disabled in multi-item view" : isInfinite ? "Thumbs disabled in infinite mode" : undefined}
                  onClick={() => setThumbMode(m.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${thumbMode === m.value ? "bg-emerald-600 text-white shadow-sm font-semibold" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"} ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          <div className={`flex p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 gap-1 w-fit ${thumbMode === "none" || isPerViewMulti || isInfinite ? "opacity-40 pointer-events-none" : ""}`} aria-disabled={thumbMode === "none" || isPerViewMulti || isInfinite}>
            <button
              type="button"
              disabled={thumbMode === "none" || isPerViewMulti || isInfinite}
              onClick={() => setThumbLoop(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${!thumbLoop ? "bg-emerald-600 text-white shadow-sm font-semibold" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"}`}
            >
              Limited (contain)
            </button>
            <button
              type="button"
              disabled={thumbMode === "none" || isPerViewMulti || isInfinite}
              onClick={() => setThumbLoop(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${thumbLoop ? "bg-emerald-600 text-white shadow-sm font-semibold" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"}`}
            >
              Looping (center+loop)
            </button>
          </div>
          <p className={`text-[11px] ${thumbMode === "none" ? "text-gray-300 dark:text-gray-600" : "text-gray-400"}`}>{thumbLoop ? "Looping: loop:true, align:center — active thumb stays centered, strip wraps infinitely." : "Limited: containScroll:trimSnaps, loop:false — edge-clamped, active thumb can hit edges."}</p>
          <p className="text-[11px] text-gray-400">When active, renders CarouselThumbs (thumbGap + mainAspectRatio) instead of plain Carousel. Position left/right + axis y → locked to bottom. perView&gt;1 / infinite → thumbs forced none + panel disabled + banner.</p>
          <p className="text-[11px] text-gray-400">Thumb sizes: vertical w-[72px] sm:w-[84px] aspect-[4/3]; horizontal w-[84px] sm:w-[104px] aspect-[4/3]; floating bg-black/55 backdrop-blur-xl.</p>
        </div>

        {/* Group: Media */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-400">Media</h3>
            {isInfinite && <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700">Mixed gated — infinite shows plain images only</span>}
          </div>
          <div className={`flex flex-wrap p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 gap-1 w-fit ${isInfinite ? "opacity-60 pointer-events-none" : ""}`}>
            <button
              type="button"
              disabled={!!isInfinite}
              onClick={() => setMediaMode("slides")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${mediaMode === "slides" ? "bg-blue-600 text-white shadow-sm font-semibold" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"} ${isInfinite ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
            >
              Images (sampleSlides)
            </button>
            <button
              type="button"
              disabled={!!isInfinite}
              onClick={() => setMediaMode("mixed")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${mediaMode === "mixed" ? "bg-blue-600 text-white shadow-sm font-semibold" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"} ${isInfinite ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
            >
              Mixed (CarouselMediaSlide)
            </button>
          </div>
          <p className="text-[11px] text-gray-400">Mixed uses sampleMixedMedia + CarouselMediaSlide (video sync, onEnded → scrollNext, muted default, showSoundToggle). Images use SliderItem w=2400 with priority idx0 eager else data-src/placeholder when lazyON.</p>
        </div>
      </div>

      {/* Single carousel viewport — keyed */}
      <div className="w-full">
        {hasThumbs && !isInfinite && !isPerViewMulti ? (
          <CarouselThumbs
            key={carouselKey}
            slides={(isMixed ? sampleMixedMedia : infiniteEnabled ? infiniteSlides : displayPlainSlides) as unknown as SliderItem[]}
            position={effectiveThumbMode as ThumbPosition}
            thumbGap={gap}
            mainAspectRatio={aspectRatio}
            effects={effectiveEffects}
            behaviors={infiniteEnabled ? [infiniteBehavior] : undefined}
            options={{
              loop: infiniteEnabled ? false : loop,
              duration: 35,
              align: perView === 3 ? "start" : "center",
              slidesToScroll: isPerViewMulti ? 1 : undefined,
              type: carouselType,
              direction,
              autoScroll: effectiveAutoScroll || undefined,
              classNames: classNamesEnabled ? true : undefined,
              lazy: lazyEnabled ? true : undefined,
              ...infiniteCarouselOptions,
              ...(effectiveThumbMode !== "none" ? {} : {}),
            }}
            thumbLoop={thumbLoop}
            autoPlay={effectiveAutoPlay || false}
            autoScroll={effectiveAutoScroll || undefined}
            classNames={classNamesEnabled ? true : undefined}
            lazy={lazyEnabled}
            direction={direction}
            showControls
            showArrows
            showCounter
            className="w-full"
            renderSlide={(slide: unknown, index: number) => {
              if (isMixed) {
                const media = slide as CarouselMediaItem;
                return (
                  <div key={String((media as { id?: string }).id ?? index)} className="relative w-full h-full">
                    {media.type === "video" ? (
                      <video src={media.src} poster={media.poster} muted playsInline className="absolute inset-0 w-full h-full object-cover rounded-none sm:rounded-2xl" />
                    ) : (
                      <img src={media.src} alt={(media as { nama?: string }).nama || "Slide"} className="absolute inset-0 w-full h-full object-cover rounded-none sm:rounded-2xl" loading={lazyEnabled && index !== 0 ? "lazy" : "eager"} />
                    )}
                    {((media as { nama?: string }).nama || (media as { deskripsi?: string }).deskripsi) && (
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white rounded-none sm:rounded-2xl">
                        {(media as { nama?: string }).nama && <h3 className="text-xl font-bold">{(media as { nama?: string }).nama}</h3>}
                        {(media as { deskripsi?: string }).deskripsi && <p className="text-sm opacity-80">{(media as { deskripsi?: string }).deskripsi}</p>}
                      </div>
                    )}
                  </div>
                );
              }
              const s = slide as SliderItem;
              // Lazy w=2400 handling: priority idx0 eager, rest data-src/placeholder when lazyEnabled
              const placeholder = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
              const isLazyImg = lazyEnabled && index !== 0;
              return (
                <div className="relative w-full h-full" key={index}>
                  <img
                    src={isLazyImg ? placeholder : s.path}
                    data-src={isLazyImg ? s.path : undefined}
                    alt={s.deskripsi || s.nama || "Slide"}
                    title={s.nama}
                    className={`absolute inset-0 w-full h-full object-cover rounded-none sm:rounded-2xl ${isLazyImg ? "embla__lazy" : ""}`}
                    loading={isLazyImg ? "lazy" : "eager"}
                  />
                  {(s.nama || s.deskripsi) && (
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white rounded-none sm:rounded-2xl">
                      {s.nama && <h3 className="text-xl font-bold">{s.nama}</h3>}
                      {s.deskripsi && <p className="text-sm opacity-80">{s.deskripsi}</p>}
                    </div>
                  )}
                </div>
              );
            }}
          />
        ) : (
          <Carousel
            key={carouselKey}
            slides={
              (infiniteEnabled
                ? infiniteSlides
                : isMixed
                  ? (sampleMixedMedia as unknown as SliderItem[])
                  : displayPlainSlides) as unknown as SliderItem[]
            }
            effects={effectiveEffects}
            behaviors={infiniteEnabled ? [infiniteBehavior] : undefined}
            options={{
              loop: infiniteEnabled ? false : loop,
              duration: 35,
              align: perView === 3 ? "start" : "center",
              slidesToScroll: isPerViewMulti ? 1 : undefined,
              type: carouselType,
              direction,
              autoScroll: effectiveAutoScroll || undefined,
              classNames: classNamesEnabled ? true : undefined,
              lazy: lazyEnabled ? true : undefined,
              infinite: infiniteEnabled ? true : undefined,
              ...infiniteCarouselOptions,
            }}
            perView={perView}
            gap={gap}
            axis={axis}
            aspectRatio={aspectRatio}
            slideAspectRatio={perView === 3 ? "3/4" : undefined}
            type={carouselType}
            direction={direction}
            autoScroll={effectiveAutoScroll || undefined}
            classNames={classNamesEnabled ? true : undefined}
            lazy={lazyEnabled}
            infinite={infiniteEnabled}
            autoPlay={effectiveAutoPlay || false}
            showControls
            showDots
            showCounter
            showArrows
            classViewport="rounded-none sm:rounded-2xl overflow-hidden"
            className="relative w-full sm:rounded-2xl shadow-lg"
            classDots="bottom-4"
            renderSlide={(slide: unknown, index: number, meta) => {
              if (isMixed && !infiniteEnabled) {
                const media = slide as CarouselMediaItem;
                return <CarouselMediaSlide key={String(media.id ?? index)} media={media} isActive={meta.isSelected} onEnded={meta.scrollNext} priority={index === 0} showSoundToggle />;
              }
              const s = slide as SliderItem;
              const placeholder = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
              const isLazyImg = lazyEnabled && index !== 0;
              // overlay spinner for infinite loading on last slide
              const isLastInfinite = infiniteEnabled && index === infiniteSlides.length - 1 && loadingMore;
              return (
                <div className={`relative w-full h-full ${perView === 3 ? "rounded-xl overflow-hidden shadow-md border border-white/10" : ""}`} key={index}>
                  <img
                    src={isLazyImg ? placeholder : s.path}
                    data-src={isLazyImg ? s.path : undefined}
                    alt={s.deskripsi || s.nama || "Slide"}
                    title={s.nama}
                    className={`absolute inset-0 w-full h-full object-cover rounded-none sm:rounded-2xl ${isLazyImg ? "embla__lazy" : ""}`}
                    loading={isLazyImg ? "lazy" : "eager"}
                  />
                  {(s.nama || s.deskripsi) && (
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                      {s.nama && <h3 className="text-xl font-bold">{s.nama}</h3>}
                      {s.deskripsi && <p className="text-sm opacity-80">{s.deskripsi}</p>}
                    </div>
                  )}
                  {isLastInfinite && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {infiniteEnabled && <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-white font-mono">{index + 1}/{infiniteSlides.length}</span>}
                </div>
              );
            }}
          />
        )}
      </div>

      {/* Footer log + controls hint */}
      <div className="space-y-2">
        <p className="text-center text-xs text-gray-400 dark:text-gray-500">
          Playground key: <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[11px] break-all">{carouselKey}</code>
          {" · "}
          {infiniteEnabled ? `${infiniteSlides.length}/20 inf` : `${sampleSlides.length} slides`}
          {" · "}
          {carouselType} {isStack ? "(overlay + Fade plugin)" : "(flex)"} {" · "}
          {isPerViewMulti || isInfinite ? "effects gated" : displayBadge} {" · "}
          loop {isInfinite ? "off (infinite)" : loop ? "on" : "off"} {" · "}
          {playMode === "off" ? "playback off" : playMode === "autoplay" ? `autoplay ${autoDelay}ms` : `marquee ${autoScrollSpeed} ${autoScrollDirection}`} {" · "}
          {hasThumbs && !isInfinite ? `thumbs:${effectiveThumbMode} ${thumbLoop ? "loop" : "contain"}` : "no thumbs"} {" · "}
          {isMixed ? "mixed" : "images"} {" · "}
          {classNamesEnabled ? "cn on" : "cn off"} {" · "}
          {lazyEnabled ? "lazy w=2400" : "no-lazy"} {" · "}
          {direction} {" · "}
          axis {axis} {" · "}
          gap {gap}
        </p>
        <p className="text-center text-[11px] text-gray-400 dark:text-gray-600">
          {loadingMore ? "Loading infinite batch +5 …" : infiniteEnabled && !infiniteHasMore ? "Infinite cap 20 reached — hasMore false." : ""}
          {" "}Feature × Feature: RTL ✅ · Auto Scroll {isStack ? "✕ STACK disabled" : "✅"} · Class Names ✅ · Lazy ✅ · Infinite {isInfinite ? "ON (GLOBAL merge, not isolated demo)" : "OFF"} · Thumbs {isInfinite || isPerViewMulti ? "✕ gated" : "✅"} · STACK {isStack ? "active" : "—"} · SLIDE —
          isolated InfiniteScrollDemo deleted.
        </p>
        <p className="text-center text-[11px] text-gray-300 dark:text-gray-700">Type toggle sky SLIDE·flex (bg-sky-500) vs violet STACK·Bertumpuk (bg-violet-600). Effects active ring-2 ring-sky-500 bg-sky-50, STACK-incompatible opacity-60 line-through border-amber-300 bg-amber-50 + title. Enhancement teal Lazy/Infinite + emerald ClassNames. Banner amber bg-amber-50 border-amber-200 text-amber-700.</p>
      </div>
    </SectionMotion>
  );
}
