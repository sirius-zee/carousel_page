# Embla Reusable Carousel

> Reusable carousel component built on top of Embla Carousel.
>
> Goal: Build a scalable, modular, reusable carousel component with support for
> multiple behaviors, multiple visual effects, horizontal/vertical axis, and
> future extensibility without rewriting the core.

---

# Goals

This project is designed to:

- Build a reusable carousel component.
- Separate carousel behavior from visual effects.
- Support both horizontal and vertical axis from the beginning.
- Allow multiple effects to run together.
- Keep every module independent.
- Make future features easy to add.
- Avoid rewriting the core when adding new effects.

This is **NOT** a simple wrapper around Embla.

---

# Architecture

```
Embla Engine
        │
        ▼
Carousel Core
        │
        ├── Behaviors
        │
        ├── Effects
        │
        ├── Transform Composer
        │
        ▼
React Components
```

---

# Folder Structure

```
embla/

├── behaviors/
├── components/
├── core/
├── effects/
├── hooks/
├── types/
├── utils/
└── index.ts
```

---

# Folder Responsibilities

## core/

Contains the internal carousel engine.

Responsible for:

- Embla integration
- Effect pipeline
- Behavior pipeline
- Axis manager
- Transform composer

Core NEVER contains UI.

---

## components/

Contains reusable React components.

Example:

- Carousel
- CarouselViewport
- CarouselTrack
- CarouselSlide
- CarouselMediaSlide (Mendukung Gambar + Video dengan sync durasi & auto-advance saat onEnded)
- CarouselThumbnailGallery (Product gallery dengan multi-position thumbnail: top, bottom, left, right, floating)
- Navigation
- Pagination

Components NEVER calculate transforms.

---

## effects/

Contains visual effects only.

Examples:

- Fade
- Scale
- Opacity
- Blur
- Stack
- Tinder
- Coverflow
- Cube
- Wheel
- Flip
- Custom

Effects NEVER know Embla.

Effects NEVER touch DOM.

Effects NEVER create CSS.

---

## behaviors/

Contains carousel behaviors.

Examples:

- Loop
- Drag
- Keyboard
- Wheel
- Autoplay
- Auto Height
- Sync

Behaviors NEVER modify slide styles.

---

## hooks/

Contains reusable hooks.

Examples:

- useCarousel
- useAxis
- useEffects
- useBehaviors

---

## utils/

Contains helper functions.

Examples:

- interpolation
- clamp
- lerp
- transform helpers

---

## types/

Contains all shared types.

No implementation.

Only contracts.

---

# Render Pipeline

```
Embla Engine

↓

Slide State

↓

Effects

↓

SlideTransform[]

↓

Transform Composer

↓

React.CSSProperties

↓

React Component
```

Every effect produces transform objects.

Only Transform Composer creates CSS.

---

# Media Pipeline (Images & Videos)

```
[Slide Aktif]
      │
      ├── Tipe: GAMBAR ───► Timer durasi standar (misal 4s) ───► Next Slide
      │
      └── Tipe: VIDEO  ───► 1. Tahan autoplay timer standar
                           2. video.currentTime = 0; video.play()
                           3. Tunggu event 'onEnded'
                           4. Trigger next slide ───► Lanjut ke slide berikutnya
```

- **Autoplay Policy**: Video default `muted: true` agar kompatibel dengan kebijakan autoplay browser, dengan tombol Sound Toggle (Unmute/Mute).
- **Efek Visual**: Pipeline transform 3D/Fade/Scale/Parallax tetap berlaku secara mulus pada tag `<video>`.

---

# Golden Rules

## Core

Core NEVER knows UI.

---

## UI

UI NEVER knows Embla.

---

## Effect

Effect NEVER knows Embla.

Effect NEVER modifies DOM.

Effect NEVER creates CSS.

---

## Behavior

Behavior NEVER modifies styles.

---

## Transform

Only Transform Composer creates CSS.

---

## Axis

Effects NEVER use:

- translateX
- translateY
- rotateX
- rotateY

Effects only use:

- primary
- cross
- depth

AxisManager converts them into X/Y.

---

# Effect Pipeline

```
Fade

↓

Scale

↓

Blur

↓

Coverflow

↓

Composer

↓

CSS
```

Effects are composable.

Effects never overwrite each other.

---

# Transform Merge Rules

| Property   | Merge Strategy |
| ---------- | -------------- |
| translate  | sum            |
| rotate     | sum            |
| scale      | multiply       |
| opacity    | replace        |
| blur       | sum            |
| brightness | multiply       |
| contrast   | multiply       |
| grayscale  | replace        |
| saturate   | multiply       |
| zIndex     | max            |

---

# Coding Rules

- Use TypeScript Strict.
- No `any`.
- Prefer pure functions.
- No classes.
- Prefer factory functions.
- Reusable first.
- SSR friendly.
- Tree-shake friendly.
- React 19 compatible.
- Next.js 15 compatible.

---

# Design Rules

Every feature should satisfy:

- Reusable
- Composable
- Independent
- Predictable
- Extendable

If a feature requires editing many existing files,
the architecture should be reconsidered.

---

# Future Built-in Effects

- Fade
- Scale
- Opacity
- Blur
- Parallax
- Stack
- Tinder
- Coverflow
- Cube
- Wheel
- Flip
- Depth

---

# Future Behaviors

- Loop
- Drag
- Autoplay
- Keyboard
- Mouse Wheel
- Auto Height
- Sync
- Virtual

---

# Development Principle

Never build everything at once.

Implement incrementally.

Each sprint must produce a working carousel.
