import React from 'react';
import Navbar from './Navbar';

const SprayBottle = () => (
  <svg viewBox="0 0 40 60" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
    <rect x="12" y="20" width="20" height="32" rx="4"/>
    <path d="M12 28 H6 V22 H12"/><path d="M6 22 L4 14"/>
    <path d="M4 14 H16 V20"/><path d="M2 10 Q6 8 10 10"/>
    <path d="M2 12 Q6 10 10 12"/><path d="M18 14 V20"/>
  </svg>
);
const Scissors = () => (
  <svg viewBox="0 0 40 44" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
    <circle cx="10" cy="34" r="6"/><circle cx="30" cy="34" r="6"/>
    <line x1="14" y1="30" x2="20" y2="10"/><line x1="26" y1="30" x2="20" y2="10"/>
  </svg>
);
const Comb = () => (
  <svg viewBox="0 0 60 28" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
    <rect x="2" y="2" width="56" height="12" rx="4"/>
    {[10,18,26,34,42,50].map(x => <line key={x} x1={x} y1="14" x2={x} y2="24"/>)}
  </svg>
);
const Clipper = () => (
  <svg viewBox="0 0 40 60" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
    <rect x="10" y="2" width="20" height="36" rx="6"/>
    <rect x="8" y="36" width="24" height="12" rx="2"/>
    <line x1="8" y1="42" x2="32" y2="42"/>
    <line x1="10" y1="46" x2="14" y2="46"/>
    <line x1="18" y1="46" x2="22" y2="46"/>
    <line x1="26" y1="46" x2="30" y2="46"/>
    <rect x="16" y="8" width="8" height="14" rx="2" fill="#178E81" stroke="#178E81"/>
  </svg>
);
const FaceDoodle = () => (
  <svg viewBox="0 0 44 54" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
    <circle cx="22" cy="18" r="14"/>
    <path d="M8 38 Q22 50 36 38"/>
    <circle cx="16" cy="16" r="2" fill="#1a1a1a"/>
    <circle cx="28" cy="16" r="2" fill="#1a1a1a"/>
    <path d="M16 22 Q22 26 28 22"/>
    <path d="M12 6 Q22 0 32 6"/>
    <path d="M8 38 L4 54"/><path d="M36 38 L40 54"/>
  </svg>
);

interface HeroSectionProps {
  onMenuClick: () => void;
}

const HeroSection = ({ onMenuClick }: HeroSectionProps) => {
  return (
    <div className="bg-[#FAFAF6] font-sans">
      {/* Announcement Bar */}
      <div className="bg-[#178E81] text-white text-center py-2 text-[13px] font-semibold">
        Promo Hari Ini!
      </div>

      {/* Satu container untuk Navbar + Hero — margin konsisten */}
      <div className="max-w-7xl mx-auto px-6">
        <Navbar onMenuClick={onMenuClick} />

        {/* Hero */}
        <section className="relative flex items-center justify-between pt-10 pb-16 min-h-[440px] overflow-hidden">

          {/* Sparkles */}
          <span className="absolute top-16 right-80 text-[#F9C74F] text-xl pointer-events-none select-none">✦</span>
          <span className="absolute top-8 right-8 text-[#F9C74F] text-sm pointer-events-none select-none">✦</span>
          <span className="absolute bottom-24 left-[400px] text-[#178E81] text-sm pointer-events-none select-none">✦</span>

          {/* Doodles */}
          <div className="absolute top-6 left-1/2 w-11 h-14 -translate-x-12 rotate-[15deg] pointer-events-none">
            <SprayBottle />
          </div>
          <div className="absolute top-56 left-[380px] w-9 h-10 -rotate-[20deg] pointer-events-none">
            <Scissors />
          </div>
          <div className="absolute top-10 right-10 w-14 h-7 -rotate-[10deg] pointer-events-none">
            <Comb />
          </div>
          <div className="absolute top-28 right-2 w-10 h-14 rotate-[10deg] pointer-events-none">
            <Clipper />
          </div>
          <div className="absolute bottom-4 right-0 w-11 h-14 opacity-70 pointer-events-none">
            <FaceDoodle />
          </div>

          {/* Left Content */}
          <div className="z-10 max-w-md space-y-3">
            <p className="text-[#178E81] text-[11px] font-extrabold tracking-[2px] uppercase">
              Premium Grooming
            </p>
            <h1 className="text-[44px] font-black leading-[1.1] text-[#1a1a1a]">
              Good Hair.<br />
              Good Vibes.<br />
              <span className="text-[#7B5EA7]">Everyday.</span>
            </h1>
            <p className="text-[13px] text-[#666] leading-relaxed max-w-[280px]">
              Potongan Terbaik dari barber profesional untuk style terbaikmu setiap hari
            </p>
            <div className="flex gap-3 pt-1">
              <button className="bg-[#F9C74F] text-[#1a1a1a] px-6 py-2.5 rounded-lg font-extrabold text-[14px] hover:bg-yellow-400 transition">
                Book Now
              </button>
              <button className="border-2 border-[#1a1a1a] text-[#1a1a1a] px-6 py-2.5 rounded-lg font-extrabold text-[14px] hover:bg-[#1a1a1a] hover:text-white transition">
                Lihat Layanan
              </button>
            </div>
            <div className="flex items-center gap-2.5 pt-1">
              <div className="flex gap-1">
                {['#C0392B','#178E81','#48CAE4','#ADB5BD'].map((c, i) => (
                  <div key={i} className="w-5 h-5 rounded-full border-2 border-white" style={{ background: c }} />
                ))}
              </div>
              <span className="text-[11px] text-[#555] font-bold">10.000+ Pelanggan Puas</span>
            </div>
          </div>

          {/* Right: Photo area */}
          <div className="relative flex-shrink-0 w-[360px] h-[420px] flex items-end justify-center z-10">
            <div className="absolute bottom-0 right-5 w-48 h-40 bg-[#F9C74F] rounded-[60%_40%_50%_50%/50%_60%_40%_50%] z-0" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#178E81] rounded-full z-0" />
            <div className="absolute top-14 left-0 z-10 bg-white border-[2.5px] border-[#1a1a1a] rounded-xl px-3 py-1.5 text-[13px] font-black leading-tight -rotate-[5deg] shadow-[3px_3px_0_#1a1a1a]">
              FRESH<br />CUT!
            </div>
            <div className="relative z-10 w-[280px] h-[390px] bg-gradient-to-b from-transparent to-[#e8e0d5] rounded-lg overflow-hidden flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-[#c9b99a] to-[#a08060] flex items-center justify-center text-white/60 text-sm font-bold">
                Foto Barber
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HeroSection;