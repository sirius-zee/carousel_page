# EMBLA TODO
> Sumber kebenaran untuk pengembangan carousel. Update di setiap sprint/task.
## Done
- [x] Core engine, axisManager, transformComposer
- [x] Components: Carousel, CarouselSlide, CarouselMediaSlide, CarouselViewport, CarouselControls, CarouselThumbs (Navigation Rail)
- [x] Hooks: useCarousel
- [x] Behaviors: autoplay, keyboard, wheel, autoHeight, sync
- [x] Effects: fade, scale, opacity, blur, custom (BOTH) + stack, tinder, coverflow, cube, wheel, flip (SLIDE-only) — 11 unified
- [x] Master Playground Hero — SLIDE (flex) vs STACK (overlay Bertumpuk, embla-carousel-fade plugin internally) — Type toggle sky/violet
- [x] Media pipeline images+videos, perView, slideAspectRatio, thumbLoop
- [x] RTL — Right To Left — direction?: 'ltr'|'rtl' on CarouselOptions piped to EmblaOptionsType direction, Carousel + CarouselViewport dir attr + CSS direction, engine createEmblaOptions, useCarousel reinit on direction, Hero Direction toggle (LTR/RTL), intact, tsc EXIT 0
- [x] Auto Scroll — continuous marquee via embla-carousel-auto-scroll@8.6.0 (speed px/frame rAF, direction forward/backward, startDelay/startOnInit/stopOnInteraction/stopOnMouseEnter; engine [Fade(), AutoScroll(), ClassNames()] ordered, hasAutoScroll flag, options.autoScroll boolean|AutoScrollOptions, Carousel.tsx prop autoScroll + options passthrough gated off STACK; useCarousel reinit on autoScroll; Hero Playback Mode Off/Snap·Autoplay/Marquee·Auto Scroll toggle + speed/direction/stopOnInteraction + loop hint; tsc EXIT 0)
- [x] Class Names — embla-carousel-class-names@8.6.0 optional plugin (engine: ClassNames() when options.classNames truthy, defaults is-snapped/is-in-view/is-draggable/is-dragging/is-loop; Carousel.tsx prop classNames?: boolean|ClassNamesOptionsType, CarouselThumbs passthrough; Hero Class Names ON/OFF toggle + demo CSS .is-snapped scale 1.025 + shadow + is-in-view saturate; ordered Fade→ClassNames no DOM conflict, tsc EXIT 0)
- [x] Lazy Load — data-src + has-loaded + slidesInView (init/reInit/slidesInView+select/scroll+drag poll -> img.src=data-src, has-loaded, reInit on load, slidesInView(true) fallback, strict Set dedup). Carousel prop lazy?: boolean with handler listening init/reInit/slidesInView+select+scroll, Set dedup after DOM verify, on load emit reInit + on error delete Set for retry; CarouselMediaSlide lazy?: boolean renders placeholder + data-src + embla__lazy/has-loaded + onLoad; Hero Lazy ON/OFF toggle + w=2400 displayPlainSlides (priority idx0 eager, rest data-src/placeholder) verified both Carousel and CarouselThumbs branches; tsc EXIT 0
- [x] Infinite Scroll — GLOBAL merged into main playground via Enhancement toggle (Class Names/Lazy/**Infinite** compact). Behavior createInfiniteScrollBehavior (slidesInView lastInView → mock fetch +5/batch cap20, hasMore/loadingMore refs, spinner) wired to main Carousel (not isolated demo); 5 initial +5/batch cap20, reInit on count change, dragFree:true loop:false containScroll:keepSnaps align:start. Isolated InfiniteScrollDemo removed; toggle is source of truth. tsc EXIT 0
- [x] Type SLIDE/STACK + Effect 11 unified — Type semantics: SLIDE=flex translate, STACK=overlay Bertumpuk (embla-carousel-fade plugin internally, UI Stack/Bertumpuk). Effects 11: Fade/Scale/Opacity/Blur/Custom=BOTH, Stack/Tinder/Coverflow/Cube/Wheel/Flip=SLIDE-only (STACK amber disabled + title, auto-fallback to Fade). Hero Type toggle SLIDE|STACK (sky vs violet), EFFECT_OPTIONS 11, perView>1 still gates all. engine hasOverlay now `type===STACK` (not effect.overlay), always mounts Fade plugin for STACK, styleEffects filters to BOTH set for inner composables. types CarouselOptions.type, exports custom, EMBLA_TODO matrix updated, npx tsc --noEmit --skipLibCheck EXIT 0

## In Progress
- (none)

## Todo — Effects (Future Built-in)
- [x] wheel — roda 3D horizontal/vertikal (cylinder radius/angleStep)
- [x] flip — flip kartu 180deg (rotateY/X by axis)
- [x] custom — placeholder BOTH (no-op, user replaces SlideTransform)
- [ ] (opsional) creative variants (parallax/depth legacy kept in src/components/embla/effects/ but not exported — not part of 11)

## Todo — Behaviors
- [ ] loop (fine-tune)
- [ ] drag
- [ ] virtual

## Todo — DX
- [x] Ekspos efek baru di Hero playground
- [x] Hero SLIDE vs STACK UX: Type toggle (sky SLIDE flex vs violet STACK Bertumpuk), 11 unified effects with STACK gating (amber line-through), perView>1 gate preserved
- [ ] Docs + demo per efek

## Log
- 2026-09-06: Type SLIDE/STACK + Effect 11 unified — audit 11 effects vs SLIDE vs STACK. Matrix: BOTH=Fade/Scale/Opacity/Blur/Custom (filter/scale/opacity/no-op composable on STACK inner), SLIDE-only=Stack/Tinder/Coverflow/Cube/Wheel/Flip (translate/rotate/depth need flex). Changes: `types/carousel.ts` add `CarouselType="SLIDE"|"STACK"` + `options.type`; `core/engine.ts` hasOverlay=`type===STACK`, always push Fade() for STACK, styleEffects=`STACK_COMPATIBLE.has(e.name)` (fade/blur/scale/opacity/custom); `components/Carousel.tsx` resolvedType + hasOverlay=`type===STACK`, autoScroll gated on STACK; `hooks/useCarousel.ts` serialize type; `components/embla/index.ts` export custom, drop parallax/depth; `effects/custom.ts` new placeholder; `app/Hero.tsx` rewrite: CarouselType SLIDE|STACK, EFFECT_OPTIONS 11 (compat BOTH/SLIDE_ONLY), STACK_INCOMPATIBLE 6-set, Type toggle sky/violet STACK·Bertumpuk, effects grid amber disabled + title for STACK, auto-fallback STACK+SLIDE-only→fade, effectiveEffects gated, header/badge/key updated, autoScroll gated on isStackActive, Carousel/CarouselThumbs options `type:carouselType`. Verified `npx tsc --noEmit --skipLibCheck` EXIT 0.

- 2026-09-06: Global Features Unified — single playground: globals perView/aspect/axis/gap/direction/loop apply both types; autoplay+autoScroll globals but STACK disables marquee (Hero disables button + warning + useEffect playMode→off, Carousel resolvedOptions `{autoScroll:false}` when STACK, engine defense `effectiveAutoScrollPlugin=null`); thumbnails only perView 1; Hero re-grouped: Type (SLIDE|STACK 2-toggle + type→effect coercion), Effect filtered, Layout, Behavior, Playback, Enhancement, Thumbnails. `npx tsc --noEmit --skipLibCheck` EXIT 0.

- 2026-09-06: Feature-Feature Integration — single playground (one keyed instance `hasThumbs ? CarouselThumbs : Carousel`, no duplicate carousels). Gates: `thumbs→perView 1` + `L/R thumbs→axis x`, `perView>1→effects []`, `STACK→autoScroll off` (Carousel resolvedOptions gated + engine effectiveAutoScrollPlugin=null defense), plugins `[Fade,AutoScroll,ClassNames]` ordered, `RTL→dir attr+Embla direction`, `classNames→toggles only`, `lazy→data-src+reInit+Set+drag poll`, `infinite→isolated`. `npx tsc --noEmit --skipLibCheck` EXIT 0.

- 2026-09-06: Effect-Type Compatibility — audit 12 effects for SlideTransform keys vs overlay requirement. Engine: `styleEffects = hasOverlay ? effects.filter(!overlay) : effects` — plugin owns outer opacity, composables add inner filter/scale via inner slideStyle. Hero: `EFFECT_OPTIONS` 18 (13 slide + 5 fade), `FADE_INCOMPATIBLE_SLIDE_VALUES` 9-set. Matrices + log in EMBLA_TODO.md. `npx tsc --noEmit --skipLibCheck` EXIT 0.

## Feature Compatibility Matrix (Hero single slideshow playground — Global Features)

> Global features apply to **both** SLIDE (flex translate) and STACK (overlay Bertumpuk) unless gated. One keyed instance `hasThumbs ? CarouselThumbs : Carousel` — no duplication. `carouselKey = ${type}-${effect}-${axis}-${perView}-${direction}-…`.

| Feature \ Feature | RTL (dir) | Auto Scroll (marquee) | Class Names | Lazy | Infinite | Thumbs | perView | axis | loop | STACK (overlay Bertumpuk) | SLIDE (flex) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| RTL | — | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Auto Scroll | ✅ | — | ✅ | ✅ | ⚠️ isolated | ✅ | ✅ | ✅ | ⚠️ loop hint | ✕ disabled on STACK (warning + gate) | ✅ |
| Class Names | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (global) | ✅ (global) |
| Lazy | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ | ✅+reInit (global) | ✅+reInit (global) |
| Infinite | ✅ | ✕ OFF | ✅ | ✅ | — | ✕ OFF | ✕ 1 only | ✅ | ✕ OFF (loop false) | ✅ (overlay off) | ✅ dragFree keepSnaps align start |
| Thumbs | ✅ | ✅ | ✅ | ✅ | — | — | ✕ only perView 1 (3 disables) | ✕ y locks L/R → bottom | ✅ | ✅ | ✅ |
| perView | ✅ | ✅ | ✅ | ✅ | — | ✕ 3 disables thumbs+effects | — | ✅ | ✅ | gated (3→effects off, thumbs off) | gated (3→effects off, thumbs off) |
| axis | ✅ | ✅ | ✅ | ✅ | ✅ | ✕ y locks L/R | ✅ | — | ✅ | ✅ | ✅ |
| loop | ✅ | ⚠️ hint | ✅ | ✅ | — | ✅ | ✅ | ✅ | — | ✅ | ✅ |
| STACK (overlay) | ✅ | ✕ | ✅ | ✅ | — | ✅ | ✕ (>1 gated) | ✅ | ✅ | — | — |
| SLIDE (flex) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | — |
Infinite = **global toggle** in Enhancement (compact: ClassNames/Lazy/Infinite). When ON: perView→1 (coerced + restore prev on OFF), effects=[] + panel amber disabled, thumbs forced none + panel disabled + banner, Mixed→plain images (video gated), playback (autoplay/autoscroll) → OFF + Mode panel disabled, loop→false, options dragFree:true containScroll:keepSnaps align:start (Carousel infinite prop + engine createEmblaOptions, useCarousel serialize containScroll). Slides array 5→+5/batch cap20 via infiniteBehavior (slidesInView lastInView) + Carousel reInit on count change + rAF reInit; spinner in Enhancement inline. Gates: `infinite→perView 1`, `infinite→thumbs OFF`, `infinite→effects OFF`, `infinite→autoplay/autoscroll OFF`, `infinite→loop OFF`, `infinite→Mixed OFF`, `thumbs→perView 1`, `axis y → L/R thumbs locked`, `STACK→autoScroll OFF`, `perView>1→effects OFF`, `lazy→reInit`, `classNames→ordered plugins`. Isolated demo removed.

## Effect Compatibility Matrix (src/components/embla/effects/*.ts — 11 unified)

> Type drives overlay: `type===STACK` mounts `embla-carousel-fade` (outer opacity via scrollProgress, container translate off, layout stays flex). Any `translate.*` / `rotate.*` / `depth` requires flex → **SLIDE-only** (STACK amber disabled). Only `filter`/`opacity`/`scale` (and no-op `custom`) are overlay-safe → **BOTH** (compose on inner via `styleEffects`).

| Effect (value) | Transform used | SLIDE (flex) | STACK (overlay Bertumpuk) | Compat |
|---|---|---|---|---|
| Fade (`fade`) | `opacity` | ✅ | ✅ (BOTH composable via inner) | BOTH |
| Scale (`scale`) | `scale.x/y` | ✅ | ✅ | BOTH |
| Opacity (`opacity`) | `opacity` | ✅ | ✅ | BOTH |
| Blur (`blur`) | `blur` (filter) | ✅ | ✅ | BOTH |
| Custom (`custom`) | — (no-op placeholder) | ✅ | ✅ | BOTH |
| Stack (`stack`) | `translate.depth` + `scale` + `opacity` + `perspective` | ✅ | ✕ amber disabled | SLIDE_ONLY |
| Tinder (`tinder`) | `rotate.z` + `translate.primary` + `scale` + `opacity` | ✅ | ✕ | SLIDE_ONLY |
| Coverflow (`coverflow`) | `rotate.x/y` + `translate.depth` + `perspective` | ✅ | ✕ | SLIDE_ONLY |
| Cube (`cube`) | `rotate.x/y` + `perspective` | ✅ | ✕ | SLIDE_ONLY |
| Wheel (`wheel`) | `rotate.x/y` + `translate.depth` + `perspective` | ✅ | ✕ | SLIDE_ONLY |
| Flip (`flip`) | `rotate.x/y` + `perspective` | ✅ | ✕ | SLIDE_ONLY |

Rules: `perView>1` gates **all** 11 effects (`effectiveEffects=[]`). `STACK` active gates 6 SLIDE-only effects (amber disabled + line-through `opacity-60` + title `incompatible with STACK overlay`; auto-fallback to `fade` if user was on gated effect). Engine `hasOverlay = type===STACK`; `Fade()` always mounted for STACK regardless of effect; `styleEffects = hasOverlay ? effects.filter(STACK_COMPATIBLE) : effects` keeps BOTH composables (inner element) while plugin owns outer opacity. `STACK_INCOMPATIBLE` = {stack, tinder, coverflow, cube, wheel, flip}. Type toggle: sky `SLIDE·flex` vs violet `STACK·Bertumpuk`. Hero shows single 11-grid (not grouped SLIDE/FADE panels). `carouselKey` includes `type`.

- 2026-09-06: Lazy Load — Carousel prop lazy?: boolean, CarouselMediaSlide lazy?: boolean (placeholder data:image/gif + data-src + embla__lazy/has-loaded, priority disables lazy), Carousel.tsx slidesInView handler: emblaApi.slidesInView() + on('slidesInView')/:reInit/:init, Set deduplicates idx, img.src=dataSrc -> on load add has-loaded/remove embla__lazy/remove data-src + api.reInit(), init/reInit/slidesInView listeners + rawSlideCount reset, Hero Lazy toggle (teal) + large w=2400 demo (displayPlainSlides, data-src/placeholder + lazy prop, fade/slide/RTL preserved, key includes lazy), CarouselThumbs lazy passthrough, index.css .embla__lazy opacity, tsc --noEmit --skipLibCheck EXIT 0
- 2026-09-06: Lazy Load FIX blank after first slide — root cause: (1) handler only listened init/reInit/slidesInView, missing select+scroll so drag/arrow never triggered load; (2) loadedSet Set.add(idx) before verifying DOM/query, so init sweep before slides rendered blocked subsequent attempts; (3) slidesInView() empty on fade init/loop edge with no fallback; (4) Hero CarouselThumbs mixed image branch always eager ignoring lazyEnabled; (5) no drag observer during pointer drag (Embla throttles scroll). Fix: Carousel.tsx handler now tries slidesInView() → slidesInView(true) → selectedScrollSnap fallback, verifies slideNodes/img[data-src] before dedup, dedup only after confirm, error handler deletes Set for retry, reInit after load, listeners init+reInit+slidesInView+select+scroll, rAF double-sweep, pointerdown/pointerup drag poll 120ms, Hero mixed+thumbs branch respects lazyEnabled+data-src/placeholder, tsc EXIT 0
- 2026-09-06: Auto Scroll — embla-carousel-auto-scroll@8.6.0 rAF marquee installed; types AutoScrollOptions {speed/direction/startDelay/playOnInit/stopOnInteraction/stopOnMouseEnter/stopOnFocusIn} + CarouselOptions autoScroll boolean|AutoScrollOptions; engine AutoScroll() wired as Embla plugin (hasAutoScroll flag, plugins ordered [Fade, AutoScroll, ClassNames], options.autoScroll gated off STACK for marquee semantic), Carousel prop autoScroll + CarouselThumbs forward, useCarousel serializes autoScroll for reinit; Hero Playback unified to Mode Off/Snap·Autoplay/Marquee·Auto Scroll (mutually exclusive, playMode state, speed 0.4-3 step 0.2 + direction forward/backward + stopOnInteraction; snap delay panel when autoplay, marquee panel when autoScroll; loop hint, STACK gate, key includes mode/speed/direction), tsc --noEmit --skipLibCheck EXIT 0
- 2026-09-06: Infinite Scroll — behavior `behaviors/infiniteScroll.ts` (hasMore/isLoading/onLoadMore, slidesInView lastIndex, onScroll+onSelect), engine reInit + useCarousel reInit, Hero toggle (teal, 5 initial +5/batch cap 20, mock 1s, spinner in controls + slide overlay + demo viewport InfiniteScrollDemo with dragFree:true keepSnaps, reInit after append), tsc EXIT 0
- 2026-09-06: Infinite GLOBAL merge — single playground source of truth. Hero: Enhancement section compact (ClassNames/Lazy/**Infinite** alongside Images/Mixed), state infiniteEnabled + refs prevPerView/thumbMode/playMode + hasMore/loading refs + infiniteBehavior (hasMore/isLoading/onLoadMore) wired to main Carousel behaviors; coercion useEffects force perView 1 / thumbMode none / playMode off when ON and restore on OFF, isMixed/hasThumbs gated, isStackActive/isSlideActive exclude infinite, effectiveEffects=[] when infinite, carouselKey includes inf/no-inf, mainSlides/mainMixedSlides (infiniteSlides 5+5 cap20 vs displayPlainSlides), Carousel props infinite + behaviors [infiniteBehavior] + options loop/dragFree/containScroll/align overrides, Enhancement banner + Mode/Thumbs/Effects/PerView panels disabled amber when ON, isolated InfiniteScrollDemo card removed. Carousel.tsx: prop infinite boolean, resolvedOptions gates effects, autoplay, autoScroll and injects dragFree/keepSnaps/align/start/loop false when infinite, adds reInit on rawSlideCount change, useCarousel serializes containScroll. Gating matrix updated. npx tsc --noEmit --skipLibCheck EXIT 0
- 2026-09-06: Class Names — embla-carousel-class-names@8.6.0 installed, engine ClassNames() wired as optional plugin (classNames?: boolean|ClassNamesOptionsType, true→defaults snapped 'is-snapped'/inView 'is-in-view'/draggable/dragging/loop; plugins [Fade(), ClassNames()] ordered, no STACK/autoScroll conflict — class toggles only), Carousel prop classNames + options.classNames passthrough, useCarousel serializes classNames for reinit, CarouselThumbs forwards classNames to main, Hero toggle ON/OFF (key includes cn flag) + demo CSS in index.css (.is-snapped scale 1.025+shadow, not-in-view desaturate), tsc --noEmit --skipLibCheck EXIT 0
- 2026-09-06: RTL — direction 'ltr'|'rtl' on CarouselOptions -> createEmblaOptions direction -> Embla Axis sign=-1 startEdge:right, Carousel.tsx/CarouselViewport.tsx dir attr + CSS direction (root + container), useCarousel serializedOptions includes direction, CarouselThumbs forwards direction to main, Hero Direction group (LTR/RTL toggle, indigo, key includes direction), intact, npx tsc --noEmit --skipLibCheck EXIT 0
- 2026-09-05: fade via official embla-carousel-fade@8.6.0 — engine imports Fade from 'embla-carousel-fade', EmblaCarousel(root, opts, [Fade()]) when hasOverlay (now STACK type), removed applyOverlayMode hack (plugin owns disableScroll/settled/scrollProgress/setOpacities), Carousel/Viewport restored to flex (no absolute inset:0/CSS transition) so plugin translateX(containerWidth+2)+opacity not fighting React; tsc EXIT 0
- 2026-09-06: Fix TDZ ReferenceError emblaApi before initialization at Carousel.tsx:173:22 — root cause: `useEffect` + `requestAnimationFrame(()=>emblaApi?.reInit())` with `prevCountRef` on line 166-173 was declared *before* `const {emblaApi}=useCarousel(...)` on line 175-186; JS Temporal Dead Zone throws on access before `const` init. Also dep `[rawSlideCount, emblaApi]` captured TDZ var at render. Fix: moved `useCarousel` destructuring block to lines 164-175 (immediately after `hasOverlay` memo), moved Infinite `useEffect` to 177-186 after emblaApi is initialized. No `const emblaApi=emblaApi` shadowing; `infiniteScroll` behavior uses `ctx.emblaApi` via `CarouselBehaviorContext` not closure capture — safe. Verified `npx tsc --noEmit --skipLibCheck` EXIT 0; `npm run build` (`tsc -b && vite build`) pre-existing unrelated errors (unused InfiniteScrollDemo in Hero.tsx, duplicate WheelOptions export) not caused by this fix — vite transform alone succeeds, dev http://localhost:5174 no runtime TDZ. Lines changed: Carousel.tsx only (reordered hooks, ~12 lines moved, net 0 added).
