"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileCard from "@/components/ui/ProfileCard";

interface Barber {
  slug: string;
  name: string;
  title: string;
  handle: string;
  rating: string;
  reviewCount: string;
  image: string;
  hue: number;
}

const barbers: Barber[] = [
  { slug: "aldi",    name: "Aldi",             title: "Fade Specialist",       handle: "fadeking",     rating: "4.9", reviewCount: "2300+", image: "/barbers/aldi.png",    hue: 174 },
  { slug: "wanda",   name: "Wanda",            title: "Classic & Modern Cut",  handle: "thesculptor",  rating: "4.9", reviewCount: "1850+", image: "/barbers/wanda.png",   hue: 266 },
  { slug: "roni",    name: "Roni",             title: "Line Up & Design",      handle: "sharpie",      rating: "4.8", reviewCount: "1420+", image: "/barbers/roni.png",    hue: 45  },
  { slug: "ali",     name: "Ali",              title: "Color & Beard Art",     handle: "theartist",    rating: "4.9", reviewCount: "1980+", image: "/barbers/ali.png",     hue: 24  },
  { slug: "ferdi",   name: "Ferdi",            title: "Texture & Curly Cut",   handle: "curlmaster",   rating: "4.7", reviewCount: "1190+", image: "/barbers/ferdi.png",   hue: 200 },
  { slug: "gevan",   name: "Gevan",            title: "Pompadour Expert",      handle: "slickstyle",   rating: "4.8", reviewCount: "1650+", image: "/barbers/gevan.png",   hue: 320 },
  { slug: "ipan",    name: "Ipan",             title: "Mullet & Edgy Cut",     handle: "rebelcuts",    rating: "4.9", reviewCount: "2050+", image: "/barbers/ipan.png",    hue: 12  },
  { slug: "iyan",    name: "Iyan",             title: "Buzz Cut Specialist",   handle: "shortnclean",  rating: "4.6", reviewCount: "980+",  image: "/barbers/iyan.png",    hue: 88  },
  { slug: "panda",   name: "Panda",            title: "Crop & Quiff Master",   handle: "topknotpro",   rating: "4.8", reviewCount: "1340+", image: "/barbers/panda.png",   hue: 145 },
  { slug: "ian",     name: "Ian",              title: "Vintage Pomade Style",  handle: "oldschoolcut", rating: "4.7", reviewCount: "1100+", image: "/barbers/ian.png",     hue: 300 },
  { slug: "randy",   name: "Randy",            title: "Undercut Specialist",   handle: "underdog",     rating: "4.6", reviewCount: "870+",  image: "/barbers/randy.png",   hue: 230 },
  { slug: "pandu",   name: "Pandu",            title: "Kids & Family Cut",     handle: "littlebarber", rating: "4.8", reviewCount: "1480+", image: "/barbers/pandu.png",   hue: 8   },
  { slug: "emon",    name: "Fil Emon",         title: "Hair Tattoo Design",    handle: "inkedhair",    rating: "4.9", reviewCount: "1920+", image: "/barbers/emon.png",    hue: 280 },
];

// Holographic behind-gradient yang mengikuti warna aksen tiap barber (tema terang)
// offset1/offset2 menambah variasi karakter gradien antar barber tanpa mengubah struktur visual
const accentGradient = (h: number, offset1: number = 45, offset2: number = 60) =>
  `radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(${h},75%,82%,var(--card-opacity)) 4%,hsla(${h},60%,76%,calc(var(--card-opacity)*0.75)) 10%,hsla(${h},45%,72%,calc(var(--card-opacity)*0.5)) 50%,hsla(${h},25%,70%,0) 100%),` +
  `radial-gradient(35% 52% at 55% 20%,hsla(${h},92%,70%,0.55) 0%,hsla(${h},92%,70%,0) 100%),` +
  `radial-gradient(100% 100% at 50% 50%,hsla(${(h + offset1) % 360},85%,72%,0.45) 1%,hsla(${h},85%,72%,0) 76%),` +
  `conic-gradient(from 124deg at 50% 50%,hsla(${h},85%,72%,0.9) 0%,hsla(${(h + offset2) % 360},88%,75%,0.9) 40%,hsla(${(h + offset2) % 360},88%,75%,0.9) 60%,hsla(${h},85%,72%,0.9) 100%)`;

// Variasi offset per index — siklus 4 kombinasi biar tiap card punya "karakter" gradien sedikit beda
const gradientOffsets = [
  { o1: 45, o2: 60 },
  { o1: 60, o2: 45 },
  { o1: 30, o2: 75 },
  { o1: 75, o2: 30 },
];

export default function BarbermanGrid() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [hint, setHint] = useState(true);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanLeft(scrollLeft > 8);
    setCanRight(scrollLeft < scrollWidth - clientWidth - 8);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      updateArrows();
      setHint(false);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateArrows);
    const timer = window.setTimeout(() => setHint(false), 6000);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateArrows);
      window.clearTimeout(timer);
    };
  }, [updateArrows]);

  const scrollByCards = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="relative -mx-6 px-6">
      <div
        ref={scrollRef}
        className="no-scrollbar flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-6 px-1 py-10"
      >
        {barbers.map((barber, index) => {
          const go = () => router.push(`/barberman/${barber.slug}`);
          const { o1, o2 } = gradientOffsets[index % gradientOffsets.length];
          return (
            <div
              key={barber.slug}
              onClick={go}
              onKeyDown={(e) => { if (e.key === "Enter") go(); }}
              role="link"
              tabIndex={0}
              aria-label={`Lihat profil ${barber.name}`}
              className="snap-start shrink-0 w-[260px] sm:w-[280px] lg:w-[300px] cursor-pointer rounded-[28px] outline-none focus-visible:ring-2 focus-visible:ring-[#7B5EA7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7EF]"
            >
              <ProfileCard
                avatarUrl={barber.image}
                name={barber.name}
                title={barber.title}
                handle={barber.handle}
                status={`★ ${barber.rating} · ${barber.reviewCount} ulasan`}
                contactText="Lihat Profil"
                behindGradient={accentGradient(barber.hue, o1, o2)}
                onContactClick={go}
              />
            </div>
          );
        })}
      </div>

      {canLeft && (
        <button
          type="button"
          onClick={() => scrollByCards(-1)}
          aria-label="Geser ke kiri"
          className={`${hint ? "animate-arrow-blink" : ""} absolute left-2 top-1/2 -translate-y-1/2 z-20 grid h-11 w-11 place-items-center rounded-full border border-gray-200 bg-white/90 text-[#1a1a1a] shadow-lg backdrop-blur transition-colors hover:bg-white`}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {canRight && (
        <button
          type="button"
          onClick={() => scrollByCards(1)}
          aria-label="Geser ke kanan"
          className={`${hint ? "animate-arrow-blink" : ""} absolute right-2 top-1/2 -translate-y-1/2 z-20 grid h-11 w-11 place-items-center rounded-full border border-gray-200 bg-white/90 text-[#1a1a1a] shadow-lg backdrop-blur transition-colors hover:bg-white`}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}