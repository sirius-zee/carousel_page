

import { useEffect, useRef, useState } from "react";
import type { CarouselMediaSlideProps } from "../types/media";

export default function CarouselMediaSlide({
  media,
  isActive = false,
  onEnded,
  className = "",
  priority = false,
  showSoundToggle = true,
}: CarouselMediaSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(media.muted ?? true);
  const [isPlaying, setIsPlaying] = useState(false);

  const title = media.nama || media.title;
  const description = media.deskripsi || media.description;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || media.type !== "video") return;

    if (isActive) {
      // Reset & Play saat slide aktif
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay mungkin terblokir jika unmuted, fallback ke muted
            video.muted = true;
            setIsMuted(true);
            video.play().then(() => setIsPlaying(true)).catch(() => { });
          });
      }
    } else {
      // Pause saat slide tidak aktif
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive, media.type]);

  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (!media.loop && onEnded) {
      onEnded();
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <div className={`relative w-full h-full overflow-hidden select-none ${className}`}>
      {media.type === "video" ? (
        <div className="relative w-full h-full bg-black">
          <video
            ref={videoRef}
            src={media.src}
            poster={media.poster}
            muted={isMuted}
            playsInline
            loop={media.loop ?? false}
            onEnded={handleVideoEnded}
            className={`w-full h-full ${media.objectFit === "contain"
              ? "object-contain"
              : media.objectFit === "fill"
                ? "object-fill"
                : "object-cover"
              }`}
          />

          {/* Sound Toggle Button */}
          {showSoundToggle && (
            <button
              type="button"
              onClick={toggleSound}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-all shadow-md focus:outline-none"
              title={isMuted ? "Aktifkan Suara" : "Matikan Suara"}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="1" y1="1" x2="23" y2="23" />
                  <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                  <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0a7 7 0 0 1-.11 1.23" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
          )}

          {/* Video Status Indicator Badge */}
          <div className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-xs font-medium flex items-center gap-1.5 shadow-sm">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-red-500 animate-pulse" : "bg-gray-400"}`} />
            <span>Video</span>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full">
          <img
            src={media.src}
            alt={title || "Slide media"}
            title={title}
            className={`absolute inset-0 w-full h-full ${media.objectFit === "contain"
              ? "object-contain"
              : media.objectFit === "fill"
                ? "object-fill"
                : "object-cover"
              }`}
            loading={priority ? "eager" : "lazy"}
          />
        </div>
      )}

      {/* Overlay Title & Description */}
      {(title || description) && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white z-10">
          {title && <h3 className="text-xl font-bold line-clamp-1">{title}</h3>}
          {description && (
            <p className="text-sm opacity-80 line-clamp-2 mt-1">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
