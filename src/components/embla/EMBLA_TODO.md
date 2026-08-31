# EMBLA TODO

## Progress

- [x] Baca dan pahami `EMBLA_ARCHITECTURE.md`
- [x] Validasi struktur folder `src/components/embla`
- [x] Buat scaffold awal untuk core, components, hooks, dan utils
- [x] Implementasi `core/engine.ts` dengan integrasi Embla Carousel & continuous progress
- [x] Buat hook `useCarousel` untuk menginstansiasi engine, slideStyles, dan navigasi state
- [x] Buat komponen React modular (`Carousel`, `CarouselSlide`, `CarouselMediaSlide`, `CarouselViewport`, `CarouselControls`)
- [x] Implementasi Visual Effects Pipeline (`fadeEffect`, `parallaxEffect`, `scaleEffect`, `opacityEffect`, `blurEffect`, `coverflowEffect`)
- [x] Implementasi Behaviors Pipeline (`autoplayBehavior`, `keyboardBehavior`, `wheelBehavior`, `autoHeightBehavior`, `syncBehavior`)
- [x] Implementasi Media Slide (Gambar + Video Campuran) dengan auto-sync playback durasi, autoplay browser compliance (`muted`), sound toggle control, dan transisi `onEnded`
- [x] Integrasi dan demo penerapan di `src/app/sections/Hero.tsx` (termasuk 9 variasi demo)
- [x] Fix gap konsisten pada Multiple Item Slider (`perView` > 1) saat looping (menggunakan Negative Margin & Slide Padding pattern)
- [x] Fix clipping window pada `carousel-slide-item` untuk mendukung Parallax, Fade, Scale, & Coverflow Effect

---

## Completed Features & Architecture Status

- **Core Engine (`src/components/embla/core/`)**:
  - `core/engine.ts`: Core engine Embla, kalkulasi progress terpolarisasi per-slide, pengolahan listener & pipeline effect.
  - `core/axisManager.ts`: Abstraksi primary/cross/depth ke koordinat X/Y/Z sesuai axis (X atau Y).
  - `core/transformComposer.ts`: Komposisi transform3d, filter (blur, brightness, dll), opacity, zIndex, dan visibility.

- **Effects Pipeline (`src/components/embla/effects/`)**:
  - `fadeEffect`: Fade opacity & zIndex layering.
  - `parallaxEffect`: Parallax translation offset pada primary axis (bekerja presisi dengan slide window clipping).
  - `scaleEffect`: Scaling dinamis slide non-aktif.
  - `opacityEffect`: Transparansi bertahap berdasarkan jarak relatif.
  - `blurEffect`: Depth blur filter pada slide non-aktif.
  - `coverflowEffect`: Rotasi 3D & translate depth ala coverflow.

- **Behaviors Pipeline (`src/components/embla/behaviors/`)**:
  - `autoplayBehavior`: Autoplay interval cerdas (mendukung dynamic delay per-slide, pause saat memutar video, auto-resume, hover pause & drag resume).
  - `keyboardBehavior`: Navigasi tombol panah keyboard (Arrow Left/Right / Up/Down).
  - `wheelBehavior`: Navigasi slide menggunakan scroll mouse wheel atau gesture trackpad dengan throttling dan `preventScroll: true` agar halaman tidak goyang saat scrolling di atas carousel.
  - `autoHeightBehavior`: Penyesuaian tinggi viewport container secara otomatis mengikuti tinggi slide aktif.
  - `syncBehavior` & `createSyncGroup`: Sinkronisasi aman 2-arah antara 2 atau lebih carousel dengan pub/sub active index tracking.

- **Media & Components (`src/components/embla/components/` & `types/`)**:
  - `Carousel.tsx`: Main component fleksibel (mendukung `perView`, `gap`, `autoPlay`, `showControls`, `showDots`, `showCounter`, `effects`, `behaviors`, `axis`, `renderSlide` with meta context).
  - `CarouselMediaSlide.tsx`: Komponen khusus mixed media (Gambar + Video) dengan auto play/pause berbasis slide aktif, sound toggle, badge status video, dan callback `onEnded`.
  - `CarouselThumbnailGallery.tsx`: Komponen galeri produk dengan sinkronisasi thumbnail multi-posisi (`bottom`, `top`, `left`, `right`, `floating-bottom`).
  - `CarouselViewport.tsx`: Viewport container dengan touchAction, flex orientation, & negative margin gap handling.
  - `CarouselSlide.tsx`: Wrapper slide item.
  - `CarouselControls.tsx`: Komponen navigasi (tombol prev/next SVG, indicator dots, counter `1/N`).
  - `types/media.ts`: Contract type untuk `CarouselMediaItem` dan `CarouselMediaSlideProps`.

- **Application Showcase (`src/app/sections/Hero.tsx`)**:
  - Demo 1: Default Slider
  - Demo 2: Parallax Effect
  - Demo 3: Fade Effect
  - Demo 4: Vertikal Slider (Axis Y)
  - Demo 5: Multiple Item (3 items per view) dengan spacing gap presisi saat loop
  - Demo 6: Scale & Coverflow 3D Showcase
  - Demo 7: Mixed Media (Images + Videos) dengan sinkronisasi durasi playback video
  - Demo 8: Mouse Wheel Navigation Carousel (dengan page scroll lock saat kursor di atas slider)
  - Demo 9: Product Gallery dengan Multi-Position Thumbnail Sync (Bawah, Atas, Kiri, Kanan, Floating)

---

## Roadmap / Next Phase Plan (Tahap Selanjutnya)

Berdasarkan spesifikasi `EMBLA_ARCHITECTURE.md`, berikut adalah fitur dan penyempurnaan yang akan ditambahkan pada tahap selanjutnya:

### 1. Additional Built-in Visual Effects (`src/components/embla/effects/`)
- [ ] `stackEffect`: Efek tumpukan kartu (Card Stack) dengan offset zIndex & Y-translation.
- [ ] `tinderEffect`: Efek kartu swipe ala Tinder (rotation + drag translate).
- [ ] `cubeEffect`: Efek rotasi Kubus 3D (3D Cube transition).
- [ ] `wheelEffect`: Efek silinder/wheel 3D carousel.
- [ ] `flipEffect`: Efek pembalikan kartu (3D Card Flip).
- [ ] `depthEffect`: Layering kedalaman z-axis yang lebih tajam.

### 2. Additional Behaviors (`src/components/embla/behaviors/`)
- [ ] `virtualBehavior`: Virtualization rendering untuk dataset slide berjumlah sangat besar.

### 3. Utility Hooks & Helpers (`src/components/embla/hooks/`)
- [ ] `useAxis`: Hook pembantu untuk deteksi dan manipulasi orientasi axis.
- [ ] `useEffects`: Hook untuk mengelola dan memfilter komposisi effect secara komposabel.
- [ ] `useBehaviors`: Hook untuk registrasi behavior dinamis runtime.

### 4. Testing & Documentation
- [ ] Unit test untuk `transformComposer.ts`, `axisManager.ts`, dan `mergeTransforms.ts`.
- [ ] Dokumentasi contoh penggunaan custom effect & custom behavior untuk developer.
