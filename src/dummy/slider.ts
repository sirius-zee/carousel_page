import type { CarouselMediaItem } from "../components/embla";

export type SliderItem = {
    nama: string;
    deskripsi: string;
    path: string;
    url: string | null;
};

export const sampleSlides: SliderItem[] = [
    {
        nama: "Modern Technology",
        deskripsi: "Teknologi modern untuk kebutuhan digital masa kini.",
        path: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&auto=format&fit=crop&q=85",
        url: "#",
    },
    {
        nama: "Creative Workspace",
        deskripsi: "Workspace modern dengan desain minimalis dan nyaman.",
        path: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600&auto=format&fit=crop&q=85",
        url: "#",
    },
    {
        nama: "Team Collaboration",
        deskripsi: "Kolaborasi tim untuk menghasilkan solusi terbaik.",
        path: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&auto=format&fit=crop&q=85",
        url: "#",
    },
    {
        nama: "Digital Development",
        deskripsi: "Membangun pengalaman digital yang cepat dan modern.",
        path: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&auto=format&fit=crop&q=85",
        url: "#",
    },
    {
        nama: "Creative Design",
        deskripsi: "Desain kreatif yang menggabungkan estetika dan fungsi.",
        path: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1600&auto=format&fit=crop&q=85",
        url: "#",
    },
    {
        nama: "Digital Business",
        deskripsi: "Solusi digital untuk mendukung perkembangan bisnis.",
        path: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1600&auto=format&fit=crop&q=85",
        url: "#",
    },
    {
        nama: "Future Technology",
        deskripsi: "Eksplorasi teknologi dan inovasi untuk masa depan.",
        path: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&auto=format&fit=crop&q=85",
        url: "#",
    },
    {
        nama: "Digital Innovation",
        deskripsi: "Inovasi digital untuk menciptakan pengalaman baru.",
        path: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=85",
        url: "#",
    },
];

export const sampleMixedMedia: CarouselMediaItem[] = [
    {
        id: "media-1",
        type: "image",
        src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
        nama: "High-Tech Hardware Banner",
        deskripsi: "Slide gambar otomatis berganti setelah 4 detik.",
        duration: 4000,
    },

    // Short video
    {
        id: "media-2",
        type: "video",
        src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        nama: "Flower Video",
        deskripsi: "Video pendek untuk menguji perpindahan image → video.",
        muted: true,
    },

    {
        id: "media-3",
        type: "image",
        src: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&auto=format&fit=crop&q=80",
        nama: "Next-Gen Electronics Promo",
        deskripsi: "Slide gambar dengan timer standar.",
        duration: 4000,
    },

    // Long video + AUDIO
    {
        id: "media-4",
        type: "video",
        src: "https://www.w3schools.com/html/mov_bbb.mp4",
        nama: "Big Buck Bunny",
        deskripsi:
            "Big Buck Bunny dengan audio untuk menguji video playback dan kontrol suara.",
        muted: true,
    },

    {
        id: "media-5",
        type: "image",
        src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&auto=format&fit=crop&q=80",
        nama: "Modern Workspace",
        deskripsi: "Image setelah video panjang.",
        duration: 5000,
    },

    // Sintel — MP4 H264 + AAC
    {
        id: "media-6",
        type: "video",
        src: "https://raw.githubusercontent.com/andreasbotsikas/DemoVideos/master/sintel.mp4",
        nama: "Sintel",
        deskripsi:
            "Video cinematic panjang dengan audio AAC untuk menguji playback.",
        muted: true,
    },

    {
        id: "media-7",
        type: "image",
        src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80",
        nama: "Creative Technology",
        deskripsi: "Slide gambar setelah video cinematic.",
        duration: 5000,
    },

    // Tears of Steel — MP4 H264 + AAC
    {
        id: "media-8",
        type: "video",
        src: "https://raw.githubusercontent.com/andreasbotsikas/DemoVideos/master/tears_of_steel.mp4",
        nama: "Tears of Steel",
        deskripsi: "Video panjang dengan audio untuk stress-test carousel.",
        muted: true,
    },
];
