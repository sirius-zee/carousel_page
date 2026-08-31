export type MediaType = "image" | "video";

export interface CarouselMediaItem {
  id?: string | number;
  type: MediaType;
  src: string;
  poster?: string;
  nama?: string;
  title?: string;
  deskripsi?: string;
  description?: string;
  duration?: number; // Durasi kustom jika gambar (ms). Default menggunakan opsi carousel
  muted?: boolean; // Default true untuk kompatibilitas autoplay browser
  loop?: boolean; // Jika true, video di-looping dan tidak memicu auto-advance
  objectFit?: "cover" | "contain" | "fill";
}

export interface CarouselMediaSlideProps {
  media: CarouselMediaItem;
  isActive?: boolean;
  onEnded?: () => void;
  className?: string;
  priority?: boolean;
  showSoundToggle?: boolean;
}
