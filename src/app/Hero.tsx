import { useState } from "react";
import SectionMotion from "../components/container/SectionMotion";
import Carousel, { CarouselMediaSlide, CarouselThumbnailGallery, coverflowEffect, fadeEffect, parallaxEffect, scaleEffect, wheelBehavior, type ThumbnailPosition } from "../components/embla";
import { sampleMixedMedia, sampleSlides, type SliderItem } from "../dummy/slider";

type Props = {
    id?: string;
};

export default function Hero({ id }: Props) {

    // State pilihan posisi thumbnail untuk Contoh 9
    const [thumbPosition, setThumbPosition] = useState<ThumbnailPosition>("bottom");

    const slides = sampleSlides;
    const slidesMix = sampleMixedMedia;

    return (
        <SectionMotion id={id} className="space-y-12 px-0 sm:px-2 lg:px-0">
            {/* Contoh 1: Slider Default */}
            <div className="flex flex-col items-center gap-3">
                <div className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <span>Default Slider</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-normal">Standard</span>
                </div>
                <Carousel
                    slides={slides}
                    options={{
                        loop: true,
                        duration: 40,
                    }}
                    autoPlay
                    aspectRatio="16/9"
                    classViewport="rounded-none sm:rounded-2xl"
                    className="relative w-full sm:rounded-2xl shadow-lg"
                    renderSlide={(slide: SliderItem, index: number) => (
                        <div className="relative w-full h-full" key={index}>
                            <img
                                src={slide.path}
                                alt={slide.deskripsi || slide.nama || "Slide"}
                                title={slide.nama}
                                className="absolute inset-0 w-full h-full object-cover rounded-none sm:rounded-2xl"
                                loading="eager"
                            />
                            {(slide.nama || slide.deskripsi) && (
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white rounded-none sm:rounded-2xl">
                                    {slide.nama && <h3 className="text-xl font-bold">{slide.nama}</h3>}
                                    {slide.deskripsi && <p className="text-sm opacity-80">{slide.deskripsi}</p>}
                                </div>
                            )}
                        </div>
                    )}
                />
            </div>

            {/* Contoh 2: Slider Parallax */}
            <div className="flex flex-col items-center gap-3">
                <div className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <span>Parallax Effect</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 font-normal">Parallax</span>
                </div>
                <Carousel
                    slides={slides}
                    effects={[parallaxEffect]}
                    options={{
                        loop: true,
                        duration: 35,
                    }}
                    aspectRatio="16/9"
                    showControls={true}
                    showDots={true}
                    showCounter={true}
                    showArrows={true}
                    autoPlay
                    classViewport="rounded-none sm:rounded-2xl overflow-hidden"
                    className="relative w-full sm:rounded-2xl shadow-lg"
                    classDots="bottom-4"
                    renderSlide={(slide: SliderItem, index: number) => (
                        <div className="relative w-full h-full overflow-hidden" key={index}>
                            <img
                                src={slide.path}
                                alt={slide.deskripsi || slide.nama || "Slide"}
                                title={slide.nama}
                                className="absolute inset-0 w-full h-full object-cover rounded-none sm:rounded-2xl"
                                loading="eager"
                            />
                            {(slide.nama || slide.deskripsi) && (
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                                    {slide.nama && <h3 className="text-xl font-bold">{slide.nama}</h3>}
                                    {slide.deskripsi && <p className="text-sm opacity-80">{slide.deskripsi}</p>}
                                </div>
                            )}
                        </div>
                    )}
                />
            </div>

            {/* Contoh 3: Slider Fade Effect */}
            <div className="flex flex-col items-center gap-3">
                <div className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <span>Fade Effect</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 font-normal">Smooth Fade</span>
                </div>
                <Carousel
                    slides={slides}
                    effects={[fadeEffect]}
                    options={{
                        loop: true,
                        duration: 50,
                    }}
                    autoPlay
                    aspectRatio="16/9"
                    showControls={true}
                    showDots={true}
                    showCounter={true}
                    classViewport="rounded-none sm:rounded-2xl"
                    className="relative w-full shadow-lg"
                    renderSlide={(slide: SliderItem, index: number) => (
                        <div className="relative w-full h-full" key={index}>
                            <img
                                src={slide.path}
                                alt={slide.deskripsi || slide.nama || "Slide"}
                                title={slide.nama}
                                className="absolute inset-0 w-full h-full object-cover rounded-none sm:rounded-2xl"
                                loading="eager"
                            />
                            {(slide.nama || slide.deskripsi) && (
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white rounded-none sm:rounded-2xl">
                                    {slide.nama && <h3 className="text-xl font-bold">{slide.nama}</h3>}
                                    {slide.deskripsi && <p className="text-sm opacity-80">{slide.deskripsi}</p>}
                                </div>
                            )}
                        </div>
                    )}
                />
            </div>

            {/* Contoh 4: Vertikal Slider */}
            <div className="flex flex-col items-center gap-3">
                <div className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <span>Vertikal Slider</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300 font-normal">Axis Y</span>
                </div>
                <Carousel
                    slides={slides}
                    axis="y"
                    options={{
                        loop: true,
                        duration: 35,
                    }}
                    aspectRatio="16/9"
                    showControls={true}
                    showDots={true}
                    showCounter={true}
                    classViewport="rounded-none sm:rounded-2xl"
                    className="relative w-full shadow-lg"
                    renderSlide={(slide: SliderItem, index: number) => (
                        <div className="relative w-full h-full" key={index}>
                            <img
                                src={slide.path}
                                alt={slide.deskripsi || slide.nama || "Slide"}
                                title={slide.nama}
                                className="absolute inset-0 w-full h-full object-cover rounded-none sm:rounded-2xl"
                                loading="eager"
                            />
                            {(slide.nama || slide.deskripsi) && (
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white rounded-none sm:rounded-2xl">
                                    {slide.nama && <h3 className="text-xl font-bold">{slide.nama}</h3>}
                                    {slide.deskripsi && <p className="text-sm opacity-80">{slide.deskripsi}</p>}
                                </div>
                            )}
                        </div>
                    )}
                />
            </div>

            {/* Contoh 5: Multiple Item Slider */}
            <div className="flex flex-col items-center gap-3">
                <div className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <span>Multiple Item</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 font-normal">3 Items Per View</span>
                </div>
                <Carousel
                    slides={slides}
                    perView={3}
                    gap="1rem"
                    options={{
                        loop: true,
                        duration: 35,
                        align: "start",
                    }}
                    aspectRatio="21/9"
                    showControls={true}
                    showDots={true}
                    showCounter={true}
                    classViewport="rounded-none sm:rounded-2xl overflow-hidden"
                    className="relative w-full"
                    renderSlide={(slide: SliderItem, index: number) => (
                        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-md border border-white/10" key={index}>
                            <img
                                src={slide.path}
                                alt={slide.deskripsi || slide.nama || "Slide"}
                                title={slide.nama}
                                className="absolute inset-0 w-full h-full object-cover rounded-none sm:rounded-2xl"
                                loading="eager"
                            />
                            {(slide.nama || slide.deskripsi) && (
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-4 text-white">
                                    {slide.nama && <h4 className="text-base font-semibold line-clamp-1">{slide.nama}</h4>}
                                    {slide.deskripsi && <p className="text-xs opacity-80 line-clamp-1">{slide.deskripsi}</p>}
                                </div>
                            )}
                        </div>
                    )}
                />
            </div>

            {/* Contoh 6: Scale & Coverflow 3D Showcase */}
            <div className="flex flex-col items-center gap-3">
                <div className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <span>Scale & Coverflow 3D</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-normal">3D Transform</span>
                </div>
                <Carousel
                    slides={slides}
                    effects={[scaleEffect, coverflowEffect]}
                    options={{
                        loop: true,
                        duration: 35,
                    }}
                    aspectRatio="16/9"
                    showControls={true}
                    showDots={true}
                    showCounter={true}
                    classViewport="rounded-none sm:rounded-2xl"
                    renderSlide={(slide: SliderItem, index: number) => (
                        <div className="relative w-full h-full" key={index}>
                            <img
                                src={slide.path}
                                alt={slide.deskripsi || slide.nama || "Slide"}
                                title={slide.nama}
                                className="absolute inset-0 w-full h-full object-cover rounded-none sm:rounded-2xl"
                                loading="eager"
                            />
                            {(slide.nama || slide.deskripsi) && (
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white rounded-none sm:rounded-2xl">
                                    {slide.nama && <h3 className="text-xl font-bold">{slide.nama}</h3>}
                                    {slide.deskripsi && <p className="text-sm opacity-80">{slide.deskripsi}</p>}
                                </div>
                            )}
                        </div>
                    )}
                />
            </div>

            {/* Contoh 7: Mixed Media Slider (Gambar + Video) */}
            <div className="flex flex-col items-center gap-3">
                <div className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <span>Mixed Media (Images + Videos)</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-300 font-normal">Video Sync</span>
                </div>
                <Carousel
                    slides={slidesMix}
                    autoPlay={{
                        delay: 4000,
                    }}
                    options={{
                        loop: true,
                        duration: 35,
                    }}
                    aspectRatio="16/9"
                    showControls={true}
                    showDots={true}
                    showCounter={true}
                    showArrows={true}
                    classViewport="rounded-none sm:rounded-2xl overflow-hidden"
                    className="relative w-full sm:rounded-2xl shadow-xl"
                    renderSlide={(item, index, meta) => (
                        <CarouselMediaSlide
                            key={item.id || index}
                            media={item}
                            isActive={meta.isSelected}
                            onEnded={meta.scrollNext}
                            priority={index === 0}
                            showSoundToggle={true}
                        />
                    )}
                />
            </div>

            {/* Contoh 8: Mouse Wheel Navigation */}
            <div className="flex flex-col items-center gap-3">
                <div className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <span>Mouse Wheel Navigation</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300 font-normal">Trackpad / Mouse Wheel</span>
                </div>
                <Carousel
                    slides={slides}
                    behaviors={[wheelBehavior]}
                    options={{
                        loop: true,
                        duration: 35,
                    }}
                    aspectRatio="16/9"
                    showControls={true}
                    showDots={true}
                    showCounter={true}
                    showArrows={true}
                    classViewport="rounded-none sm:rounded-2xl"
                    className="relative w-full shadow-lg"
                    renderSlide={(slide: SliderItem, index: number) => (
                        <div className="relative w-full h-full" key={index}>
                            <img
                                src={slide.path}
                                alt={slide.deskripsi || slide.nama || "Slide"}
                                title={slide.nama}
                                className="absolute inset-0 w-full h-full object-cover rounded-none sm:rounded-2xl"
                                loading="eager"
                            />
                            {(slide.nama || slide.deskripsi) && (
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white rounded-none sm:rounded-2xl">
                                    {slide.nama && <h3 className="text-xl font-bold">{slide.nama}</h3>}
                                    {slide.deskripsi && <p className="text-sm opacity-80">{slide.deskripsi}</p>}
                                </div>
                            )}
                        </div>
                    )}
                />
            </div>

            {/* Contoh 9: Product Gallery with Thumbnail Sync */}
            <div className="flex flex-col items-center gap-3">
                <div className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <span>Product Gallery with Thumbnail Sync</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 font-normal">Dual Sync</span>
                </div>

                {/* Interactive Position Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl text-xs font-medium border border-gray-200 dark:border-gray-700">
                    {(
                        [
                            { label: "Bawah (Default)", value: "bottom" },
                            { label: "Atas", value: "top" },
                            { label: "Kiri", value: "left" },
                            { label: "Kanan", value: "right" },
                            { label: "Floating (Melayang)", value: "floating-bottom" },
                        ] as const
                    ).map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => setThumbPosition(tab.value)}
                            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${thumbPosition === tab.value
                                ? "bg-emerald-600 text-white shadow-sm font-semibold"
                                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <CarouselThumbnailGallery
                    slides={slides}
                    position={thumbPosition}
                    thumbGap="0.5rem"
                    mainAspectRatio="16/9"
                    showControls={true}
                    showArrows={true}
                    showCounter={true}
                    className="w-full"
                    renderSlide={(slide: SliderItem, index: number) => (
                        <div className="relative w-full h-full" key={index}>
                            <img
                                src={slide.path}
                                alt={slide.deskripsi || slide.nama || "Slide"}
                                title={slide.nama}
                                className="absolute inset-0 w-full h-full object-cover rounded-none sm:rounded-2xl"
                                loading="eager"
                            />
                            {(slide.nama || slide.deskripsi) && (
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white rounded-none sm:rounded-2xl">
                                    {slide.nama && <h3 className="text-xl font-bold">{slide.nama}</h3>}
                                    {slide.deskripsi && <p className="text-sm opacity-80">{slide.deskripsi}</p>}
                                </div>
                            )}
                        </div>
                    )}
                />
            </div>
        </SectionMotion>
    );
}
