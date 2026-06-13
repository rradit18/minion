"use client";

import Link from "next/link";

const barbers = [
  { name: "Hendra", role: "Fade King", badge: "Fade Specialist", color: "bg-cyan-400",   image: "/hendra.png",  slug: "hendra"  },
  { name: "Juan",   role: "Fade King", badge: "Fade Specialist", color: "bg-purple-400", image: "/juan.png",    slug: "juan"    },
  { name: "Yoga",   role: "Fade King", badge: "Fade Specialist", color: "bg-yellow-400", image: "/yoga.png",    slug: "yoga"    },
  { name: "Bastian",role: "Fade King", badge: "Fade Specialist", color: "bg-orange-400", image: "/bastian.png", slug: "bastian" },
];

export default function BarberPreview() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6 relative">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="font-display font-bold text-base tracking-wide text-black uppercase">
          Kenalan Sama Barberman Kece Kami
        </h2>
        <svg viewBox="0 0 60 14" className="w-12 h-3.5" fill="none">
          <path d="M2 7 Q9 1 16 7 T30 7 T44 7 T58 7" stroke="#7B5EA7" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {barbers.map((barber, index) => (
          <Link key={index} href={`/barberman/${barber.slug}`}>
            <div className="relative bg-white rounded-2xl p-4 flex items-start gap-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer overflow-visible min-h-[130px]">
              {/* Foto + lingkaran */}
              <div className="relative flex-shrink-0">
                <div className={`absolute top-2 left-2 w-16 h-16 rounded-full ${barber.color}`} />
                <img
                  src={barber.image}
                  alt={barber.name}
                  className="relative w-20 h-24 object-cover object-top"
                  style={{ zIndex: 1, marginTop: '-12px' }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 pt-1">
                <h3 className="font-display font-bold text-base text-black leading-tight">{barber.name}</h3>
                <p className="text-xs text-gray-400 mb-2 font-body">{barber.role}</p>
                <span className="inline-block bg-[#F9C74F] text-[#1a1a1a] text-[10px] font-bold px-3 py-1 rounded-full mb-2">
                  {barber.badge}
                </span>
                <div className="flex items-center gap-1 text-xs font-medium text-black">
                  <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span>4.9 (2300+)</span>
                </div>
              </div>
            </div>
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

        {/* ── Sparkle bintang ── */}
        <div
          className="absolute pointer-events-none"
          style={{ top: '-10px', right: '0px' }}
        >
          <svg viewBox="0 0 24 24" style={{ width: '28px', height: '28px' }} fill="#F9C74F">
            <path d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z"/>
          </svg>
        </div>

      </div>
    </div>
  );
}