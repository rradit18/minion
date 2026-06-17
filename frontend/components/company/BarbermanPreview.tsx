"use client";

import Link from "next/link";
import BarberPage from "@/components/company/BarberPage";

const barbers = [
  {
    slug: "aldi",
    name: "Aldi",
    role: "Fade King",
    specialty: "Fade Specialist",
    rating: "4.9",
    reviewCount: "2300+",
    imageColor: "bg-teal-500",
    imageUrl: "/aldi.png",
    imageObjectPosition: "top",
  },
  {
    slug: "wanda",
    name: "Wanda",
    role: "The Sculptor",
    specialty: "Classic & Modern Cut",
    rating: "4.9",
    reviewCount: "1850+",
    imageColor: "bg-purple-400",
    imageUrl: "/wanda.png",
    imageObjectPosition: "top",
  },
  {
    slug: "roni",
    name: "Roni",
    role: "Sharpie",
    specialty: "Line Up & Design",
    rating: "4.8",
    reviewCount: "1420+",
    imageColor: "bg-yellow-400",
    imageUrl: "/roni.png",
    imageObjectPosition: "top",
  },
  {
    slug: "ali",
    name: "Ali",
    role: "The Artist",
    specialty: "Color & Beard Art",
    rating: "4.9",
    reviewCount: "1980+",
    imageColor: "bg-orange-400",
    imageUrl: "/ali.png",
    imageObjectPosition: "center",
  },
];

export default function BarberPreview() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6 relative">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="font-display font-bold text-base tracking-wide text-black uppercase">
          Kenalan Sama Barberman Kece Kami
        </h2>
        <svg viewBox="0 0 60 14" className="w-12 h-3.5" fill="none">
          <path d="M2 7 Q9 1 16 7 T30 7 T44 7 T58 7" stroke="#7B5EA7" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10 pt-4">
        {barbers.map((barber) => (
          <Link key={barber.slug} href={`/barberman/${barber.slug}`}>
            <BarberPage
              name={barber.name}
              role={barber.role}
              specialty={barber.specialty}
              rating={barber.rating}
              reviewCount={barber.reviewCount}
              imageColor={barber.imageColor}
              imageUrl={barber.imageUrl}
              imageObjectPosition={barber.imageObjectPosition}
            />
          </Link>
        ))}

        {/* ── Scissors ── */}
        <div className="absolute -bottom-5 left-0 w-10 h-10 pointer-events-none -rotate-[25deg]">
          <svg viewBox="0 0 40 44" fill="none" stroke="#178E81" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="10" cy="34" r="6" fill="#178E81" fillOpacity="0.25"/>
            <circle cx="30" cy="34" r="6" fill="#178E81" fillOpacity="0.25"/>
            <line x1="14" y1="30" x2="20" y2="10"/>
            <line x1="26" y1="30" x2="20" y2="10"/>
          </svg>
        </div>

        {/* ── Clipper ── */}
        <div
          className="absolute pointer-events-none"
          style={{ top: '-8px', left: 'calc(50% + 10px)', width: '28px', height: '40px', transform: 'rotate(10deg)' }}
        >
          <svg viewBox="0 0 40 60" fill="none" stroke="#7B5EA7" strokeWidth="2" strokeLinecap="round">
            <rect x="10" y="2" width="20" height="36" rx="6" fill="#7B5EA7" fillOpacity="0.15"/>
            <rect x="8" y="36" width="24" height="12" rx="2" fill="#7B5EA7" fillOpacity="0.2"/>
            <line x1="8" y1="42" x2="32" y2="42"/>
            <line x1="10" y1="46" x2="14" y2="46"/>
            <line x1="18" y1="46" x2="22" y2="46"/>
            <line x1="26" y1="46" x2="30" y2="46"/>
            <rect x="16" y="8" width="8" height="14" rx="2" fill="#178E81" stroke="#178E81"/>
          </svg>
        </div>

        {/* ── Comb ── */}
        <div
          className="absolute pointer-events-none"
          style={{ bottom: '-10px', left: 'calc(75% - 30px)', width: '56px', height: '28px', transform: 'rotate(-8deg)' }}
        >
          <svg viewBox="0 0 60 28" fill="none" stroke="#F9C74F" strokeWidth="2" strokeLinecap="round">
            <rect x="2" y="2" width="56" height="12" rx="4" fill="#F9C74F" fillOpacity="0.4"/>
            {[10,18,26,34,42,50].map(x => (
              <line key={x} x1={x} y1="14" x2={x} y2="24"/>
            ))}
          </svg>
        </div>

        {/* ── Sparkle ── */}
        <div className="absolute pointer-events-none" style={{ top: '-10px', right: '0px' }}>
          <svg viewBox="0 0 24 24" style={{ width: '28px', height: '28px' }} fill="#F9C74F">
            <path d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z"/>
          </svg>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/barberman"
          className="inline-flex items-center gap-2 border-2 border-[#1a1a1a] text-[#1a1a1a] px-6 py-2.5 rounded-xl font-display font-bold text-sm hover:bg-[#1a1a1a] hover:text-white transition"
        >
          Lihat Semua Barberman <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
