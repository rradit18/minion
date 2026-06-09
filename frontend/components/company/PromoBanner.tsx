import React from 'react';

const PromoBanner = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-0 pb-8">
      <div className="relative">
        <div
          className="rounded-2xl flex items-center pr-6 overflow-hidden"
          style={{ background: '#FFD53E', minHeight: '90px' }}
        >
          {/* Sparkle decorations */}
          <span className="absolute top-2 left-28 text-yellow-200 text-sm pointer-events-none">✦</span>
          <span className="absolute bottom-3 left-40 text-yellow-200 text-[10px] pointer-events-none">✦</span>
          <span className="absolute top-3 right-36 text-yellow-300 text-base pointer-events-none">✦</span>

          {/* Maskot Kiri */}
          <div className="relative w-24 h-[90px] flex-shrink-0 flex items-end justify-center">
            <span
              className="absolute top-1.5 left-1/2 -translate-x-1/2 text-white text-[8px] font-black px-1.5 py-0.5 rounded z-10 whitespace-nowrap"
              style={{ background: '#FF6B35', letterSpacing: '0.5px' }}
            >
              HEMAT!
            </span>
            <svg viewBox="0 0 80 80" className="w-[68px] h-[68px]" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="40" cy="52" rx="22" ry="24" fill="#2BBFBF"/>
              <circle cx="40" cy="32" r="20" fill="#2BBFBF"/>
              <ellipse cx="40" cy="15" rx="18" ry="5" fill="#E0E0E0"/>
              <rect x="22" y="10" width="36" height="8" rx="4" fill="#E0E0E0"/>
              <rect x="34" y="7" width="12" height="6" rx="3" fill="#E0E0E0"/>
              <rect x="20" y="14" width="8" height="4" rx="2" fill="#BDBDBD"/>
              <circle cx="33" cy="30" r="4" fill="white"/>
              <circle cx="47" cy="30" r="4" fill="white"/>
              <circle cx="34" cy="31" r="2" fill="#1a1a1a"/>
              <circle cx="48" cy="31" r="2" fill="#1a1a1a"/>
              <path d="M 33 38 Q 40 44 47 38" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <ellipse cx="18" cy="52" rx="6" ry="10" fill="#2BBFBF" transform="rotate(-20 18 52)"/>
              <ellipse cx="62" cy="52" rx="6" ry="10" fill="#2BBFBF" transform="rotate(20 62 52)"/>
            </svg>
          </div>

          {/* Teks Utama */}
          <div className="flex-1 py-3 pl-2 pr-3">
            <h2
              className="text-[22px] font-black leading-[1.1] tracking-tight uppercase text-[#1a1a1a]"
              style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}
            >
              GAYA ELIT<br />HARGA IRIT.
            </h2>
          </div>

          {/* Divider */}
          <div className="w-px h-14 bg-black/15 flex-shrink-0 mx-4" />

          {/* Harga + Tombol */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div>
              <p className="text-[10px] text-gray-600 mb-0.5">Mulai dari</p>
              <p
                className="text-xl font-black text-[#1a1a1a] leading-none"
                style={{ fontFamily: '"Arial Black", sans-serif' }}
              >
                Rp. 35.000
              </p>
              <p className="text-[9px] text-gray-600 mt-1 max-w-[110px] leading-snug">
                Dapetin potongan barber profesional yang affordable
              </p>
            </div>

            <button className="bg-[#1a1a1a] text-white text-[13px] font-bold px-4 py-2.5 rounded-lg whitespace-nowrap hover:scale-105 transition-transform">
              Book Now →
            </button>
          </div>

          {/* Heart Maskot Kanan */}
          <svg
            viewBox="0 0 60 60"
            className="absolute right-0 bottom-0 w-12 h-12 opacity-90"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M30 50 C10 35 5 20 15 12 C20 8 27 10 30 16 C33 10 40 8 45 12 C55 20 50 35 30 50Z" fill="#FF6B6B"/>
            <circle cx="22" cy="24" r="3" fill="white" opacity="0.4"/>
            <circle cx="28" cy="30" r="4" fill="white" opacity="0.6"/>
            <circle cx="24" cy="26" r="2" fill="#1a1a1a"/>
            <circle cx="36" cy="26" r="2" fill="#1a1a1a"/>
            <path d="M 26 33 Q 30 37 34 33" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <circle cx="20" cy="31" r="3" fill="#FF9999" opacity="0.5"/>
            <circle cx="40" cy="31" r="3" fill="#FF9999" opacity="0.5"/>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;