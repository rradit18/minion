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
  { slug: "hendra",  name: "Hendra Schevenko", title: "Fade Specialist",      handle: "fadeking",   rating: "4.9", reviewCount: "2300+", image: "/hendra.png",  hue: 174 },
  { slug: "juan",    name: "Juan Samudra",     title: "Classic & Modern Cut", handle: "thesculptor", rating: "4.9", reviewCount: "1850+", image: "/juan.png",    hue: 266 },
  { slug: "yoga",    name: "Yoga Harahap",     title: "Line Up & Design",     handle: "sharpie",    rating: "4.8", reviewCount: "1420+", image: "/yoga.png",    hue: 45  },
  { slug: "bastian", name: "Bastian Narendra", title: "Color & Beard Art",    handle: "theartist",  rating: "4.9", reviewCount: "1980+", image: "/bastian.png", hue: 24  },
];

// Holographic behind-gradient yang mengikuti warna aksen tiap barber (tema terang)
const accentGradient = (h: number) =>
  `radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(${h},75%,82%,var(--card-opacity)) 4%,hsla(${h},60%,76%,calc(var(--card-opacity)*0.75)) 10%,hsla(${h},45%,72%,calc(var(--card-opacity)*0.5)) 50%,hsla(${h},25%,70%,0) 100%),` +
  `radial-gradient(35% 52% at 55% 20%,hsla(${h},92%,70%,0.55) 0%,hsla(${h},92%,70%,0) 100%),` +
  `radial-gradient(100% 100% at 50% 50%,hsla(${(h + 45) % 360},85%,72%,0.45) 1%,hsla(${h},85%,72%,0) 76%),` +
  `conic-gradient(from 124deg at 50% 50%,hsla(${h},85%,72%,0.9) 0%,hsla(${(h + 60) % 360},88%,75%,0.9) 40%,hsla(${(h + 60) % 360},88%,75%,0.9) 60%,hsla(${h},85%,72%,0.9) 100%)`;

export default function BarbermanGrid() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  // hint = panah kelap-kelip; berhenti setelah user scroll atau timeout
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
      setHint(false); // begitu user mulai scroll, berhenti kelap-kelip
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
    // geser ~80% lebar viewport agar pindah beberapa kartu
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="relative -mx-6 px-6">
      <div
        ref={scrollRef}
        className="no-scrollbar flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-6 px-1 py-10"
      >
        {barbers.map((barber) => {
          const go = () => router.push(`/barberman/${barber.slug}`);
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
                behindGradient={accentGradient(barber.hue)}
                onContactClick={go}
              />
            </div>
          );
        })}
      </div>

      {/* ── Panah kiri (muncul + kelap-kelip hanya saat bisa scroll ke kiri) ── */}
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

      {/* ── Panah kanan ── */}
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
