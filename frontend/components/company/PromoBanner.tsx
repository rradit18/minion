import React from 'react';
import Link from 'next/link';

const PromoBanner = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-6">
      <div className="relative">
        <div
          className="rounded-2xl flex items-center relative overflow-hidden"
          style={{ background: '#FFD53E', minHeight: '120px' }}
        >

          {/* ── Doodle — hidden di mobile, muncul di sm+ ── */}

          {/* Scissors — teal */}
          <div className="absolute top-3 left-1/2 -translate-x-20 w-6 h-7 pointer-events-none rotate-[-20deg] hidden sm:block">
            <svg viewBox="0 0 40 44" fill="none" stroke="#178E81" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="10" cy="34" r="6" fill="#178E81" fillOpacity="0.3"/>
              <circle cx="30" cy="34" r="6" fill="#178E81" fillOpacity="0.3"/>
              <line x1="14" y1="30" x2="20" y2="10"/>
              <line x1="26" y1="30" x2="20" y2="10"/>
            </svg>
          </div>

          {/* Comb — purple */}
          <div className="absolute bottom-3 left-1/3 w-10 h-5 pointer-events-none rotate-[10deg] hidden md:block">
            <svg viewBox="0 0 60 28" fill="none" stroke="#7B5EA7" strokeWidth="2" strokeLinecap="round">
              <rect x="2" y="2" width="56" height="12" rx="4" fill="#7B5EA7" fillOpacity="0.2"/>
              {[10,18,26,34,42,50].map(x => (
                <line key={x} x1={x} y1="14" x2={x} y2="24"/>
              ))}
            </svg>
          </div>

          {/* Clipper — orange */}
          <div className="absolute top-2 right-36 w-5 h-8 pointer-events-none rotate-[15deg] hidden lg:block">
            <svg viewBox="0 0 40 60" fill="none" stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round">
              <rect x="10" y="2" width="20" height="36" rx="6" fill="#FF6B35" fillOpacity="0.15"/>
              <rect x="8" y="36" width="24" height="12" rx="2" fill="#FF6B35" fillOpacity="0.2"/>
              <line x1="8" y1="42" x2="32" y2="42"/>
              <line x1="10" y1="46" x2="14" y2="46"/>
              <line x1="18" y1="46" x2="22" y2="46"/>
              <line x1="26" y1="46" x2="30" y2="46"/>
              <rect x="16" y="8" width="8" height="14" rx="2" fill="#178E81" stroke="#178E81"/>
            </svg>
          </div>

          {/* Spray bottle — pink */}
          <div className="absolute bottom-2 left-1/2 w-4 h-6 pointer-events-none -rotate-[10deg] hidden md:block">
            <svg viewBox="0 0 40 60" fill="none" stroke="#E91E8C" strokeWidth="2.5" strokeLinecap="round">
              <rect x="12" y="20" width="20" height="32" rx="4" fill="#E91E8C" fillOpacity="0.15"/>
              <path d="M12 28 H6 V22 H12"/>
              <path d="M6 22 L4 14"/>
              <path d="M4 14 H16 V20"/>
              <path d="M2 10 Q6 8 10 10" stroke="#E91E8C"/>
              <path d="M2 12 Q6 10 10 12" stroke="#E91E8C"/>
            </svg>
          </div>

          {/* Sparkles */}
          <svg viewBox="0 0 24 24" className="absolute top-3 left-36 w-4 h-4 pointer-events-none hidden sm:block" fill="#FF6B6B">
            <path d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z"/>
          </svg>
          <svg viewBox="0 0 24 24" className="absolute bottom-3 right-44 w-3 h-3 pointer-events-none hidden lg:block" fill="#178E81">
            <path d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z"/>
          </svg>
          <svg viewBox="0 0 24 24" className="absolute top-4 right-1/3 w-2.5 h-2.5 pointer-events-none hidden md:block" fill="#7B5EA7">
            <path d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z"/>
          </svg>

          {/* Dots */}
          <div className="absolute top-4 right-52 flex gap-1 pointer-events-none hidden lg:flex">
            {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#178E81] opacity-50" />)}
          </div>
          <div className="absolute bottom-4 left-44 flex gap-1 pointer-events-none hidden md:flex">
            {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#7B5EA7] opacity-50" />)}
          </div>

          {/* ── Konten utama ── */}

          {/* Mascot kiri — absolut di sudut kiri (bingkai) */}
          <img
            src="/doodle.png"
            alt="Mascot Doodle"
            className="absolute bottom-0 left-2 sm:left-4 h-[100px] sm:h-[120px] md:h-[140px] object-contain pointer-events-none hidden sm:block"
          />

          {/* Grup tengah: teks + divider + harga + tombol */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 mx-auto px-4 sm:px-36 md:px-44 py-3">
            {/* Teks */}
            <h2 className="font-display text-[18px] sm:text-[22px] md:text-[26px] font-bold leading-[1.05] tracking-tight uppercase text-[#1a1a1a] italic">
              HARGA KAWAN<br />HASIL IDAMAN.
            </h2>

            {/* Divider — hidden di mobile */}
            <div className="w-px h-12 bg-black/20 flex-shrink-0 hidden sm:block" />

            {/* Harga + Tombol */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 flex-shrink-0">
              <div className="text-center sm:text-left">
                <p className="text-[9px] sm:text-[10px] text-gray-600 mb-0.5">Mulai dari</p>
                <p className="font-display text-base sm:text-xl font-bold text-[#1a1a1a] leading-none">Rp. 35.000</p>
                <p className="text-[8px] sm:text-[9px] text-gray-600 mt-1 max-w-[100px] leading-snug hidden sm:block">
                  Gak perlu mahal buat tampil maksimal
                </p>
              </div>
              <Link href="/booking">
                <button className="bg-[#1a1a1a] text-white text-[11px] sm:text-[13px] font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg whitespace-nowrap hover:scale-105 transition-transform">
                  Book Sekarang →
                </button>
              </Link>
            </div>
          </div>

          {/* Love mascot kanan — hidden di mobile */}
          <img
            src="/love.png"
            alt="Love Icon"
            className="absolute bottom-0 right-0 sm:right-2 w-14 sm:w-16 md:w-20 h-14 sm:h-16 md:h-20 object-contain pointer-events-none hidden sm:block"
          />
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;