"use client";

import Link from 'next/link';

interface HeroSectionProps {
  onMenuClick: () => void;
}

// ─── Doodle Components ────────────────────────────────────────────────────────

const SprayBottle = () => (
  <svg viewBox="0 0 40 60" fill="none" strokeWidth="2.5" strokeLinecap="round" className="w-full h-full">
    <rect x="12" y="20" width="20" height="32" rx="4" stroke="#F97316"/>
    <path d="M12 28 H6 V22 H12" stroke="#F97316"/>
    <path d="M6 22 L4 14" stroke="#F97316"/>
    <path d="M4 14 H16 V20" stroke="#F97316"/>
    <path d="M2 10 Q6 8 10 10" stroke="#F97316"/>
    <path d="M2 12 Q6 10 10 12" stroke="#F97316"/>
    <path d="M18 14 V20" stroke="#F97316"/>
  </svg>
);

const Scissors = () => (
  <svg viewBox="0 0 40 44" fill="none" strokeWidth="2.5" strokeLinecap="round" className="w-full h-full">
    <circle cx="10" cy="34" r="6" stroke="#1a1a1a"/>
    <circle cx="30" cy="34" r="6" stroke="#1a1a1a"/>
    <line x1="14" y1="30" x2="20" y2="10" stroke="#1a1a1a"/>
    <line x1="26" y1="30" x2="20" y2="10" stroke="#1a1a1a"/>
  </svg>
);

const Comb = () => (
  <svg viewBox="0 0 60 28" fill="none" strokeWidth="2.5" strokeLinecap="round" className="w-full h-full">
    <rect x="2" y="2" width="56" height="12" rx="4" stroke="#22C55E"/>
    {[10,18,26,34,42,50].map(x => <line key={x} x1={x} y1="14" x2={x} y2="24" stroke="#22C55E"/>)}
  </svg>
);

const Clipper = () => (
  <svg viewBox="0 0 40 60" fill="none" strokeWidth="2.5" strokeLinecap="round" className="w-full h-full">
    <rect x="10" y="2" width="20" height="36" rx="6" stroke="#0EA5E9"/>
    <rect x="8" y="36" width="24" height="12" rx="2" stroke="#0EA5E9"/>
    <line x1="8" y1="42" x2="32" y2="42" stroke="#0EA5E9"/>
    <line x1="10" y1="46" x2="14" y2="46" stroke="#0EA5E9"/>
    <line x1="18" y1="46" x2="22" y2="46" stroke="#0EA5E9"/>
    <line x1="26" y1="46" x2="30" y2="46" stroke="#0EA5E9"/>
    <rect x="16" y="8" width="8" height="14" rx="2" fill="#0EA5E9" stroke="#0EA5E9"/>
  </svg>
);

const FaceDoodlePurple = () => (
  <svg viewBox="0 0 44 54" fill="none" strokeWidth="2.5" strokeLinecap="round" className="w-full h-full">
    <circle cx="22" cy="20" r="16" stroke="#7B5EA7"/>
    <circle cx="16" cy="18" r="2" fill="#7B5EA7"/>
    <circle cx="28" cy="18" r="2" fill="#7B5EA7"/>
    <path d="M16 24 Q22 28 28 24" stroke="#7B5EA7"/>
    <path d="M14 8 Q22 3 30 8" stroke="#7B5EA7"/>
    <rect x="10" y="34" width="24" height="14" rx="4" stroke="#7B5EA7"/>
  </svg>
);

const FaceDoodleGreen = () => (
  <svg viewBox="0 0 44 54" fill="none" strokeWidth="2.5" strokeLinecap="round" className="w-full h-full">
    <circle cx="22" cy="20" r="16" stroke="#22C55E"/>
    <circle cx="16" cy="18" r="2" fill="#22C55E"/>
    <circle cx="28" cy="18" r="2" fill="#22C55E"/>
    <path d="M16 24 Q22 29 28 24" stroke="#22C55E"/>
    <path d="M8 10 Q12 4 16 8 Q18 2 22 6 Q26 0 30 6 Q34 2 36 8" stroke="#22C55E"/>
    <rect x="10" y="34" width="24" height="14" rx="4" stroke="#22C55E"/>
  </svg>
);

const FaceDoodleOrange = () => (
  <svg viewBox="0 0 44 54" fill="none" strokeWidth="2.5" strokeLinecap="round" className="w-full h-full">
    <circle cx="22" cy="20" r="16" stroke="#F97316"/>
    <circle cx="16" cy="18" r="2" fill="#F97316"/>
    <circle cx="28" cy="18" r="2" fill="#F97316"/>
    <path d="M16 25 Q22 30 28 25" stroke="#F97316"/>
    <path d="M10 8 Q16 4 22 6 Q28 4 34 8" stroke="#F97316"/>
    <rect x="10" y="34" width="24" height="14" rx="4" stroke="#F97316"/>
  </svg>
);

const Razor = () => (
  <svg viewBox="0 0 50 20" fill="none" strokeWidth="2.5" strokeLinecap="round" className="w-full h-full">
    <rect x="2" y="6" width="36" height="8" rx="4" stroke="#EF4444"/>
    <path d="M38 10 L48 10" stroke="#EF4444"/>
    <path d="M44 6 L48 10 L44 14" stroke="#EF4444"/>
    <line x1="10" y1="6" x2="10" y2="14" stroke="#EF4444" strokeWidth="1.5"/>
    <line x1="18" y1="6" x2="18" y2="14" stroke="#EF4444" strokeWidth="1.5"/>
    <line x1="26" y1="6" x2="26" y2="14" stroke="#EF4444" strokeWidth="1.5"/>
  </svg>
);

const PomadeJar = () => (
  <svg viewBox="0 0 44 36" fill="none" strokeWidth="2.5" strokeLinecap="round" className="w-full h-full">
    <ellipse cx="22" cy="10" rx="18" ry="8" stroke="#F59E0B"/>
    <rect x="4" y="10" width="36" height="18" rx="3" stroke="#F59E0B"/>
    <ellipse cx="22" cy="28" rx="18" ry="4" stroke="#F59E0B"/>
    <path d="M10 10 Q22 6 34 10" stroke="#F59E0B" strokeWidth="1.5"/>
  </svg>
);

const Brush = () => (
  <svg viewBox="0 0 16 60" fill="none" strokeWidth="2.5" strokeLinecap="round" className="w-full h-full">
    <rect x="4" y="2" width="8" height="36" rx="4" stroke="#8B5CF6"/>
    <ellipse cx="8" cy="50" rx="6" ry="10" stroke="#8B5CF6"/>
    <line x1="8" y1="38" x2="8" y2="40" stroke="#8B5CF6"/>
  </svg>
);

const HairDryer = () => (
  <svg viewBox="0 0 60 44" fill="none" strokeWidth="2.5" strokeLinecap="round" className="w-full h-full">
    <ellipse cx="28" cy="20" rx="22" ry="16" stroke="#EC4899"/>
    <path d="M50 20 L58 20" stroke="#EC4899"/>
    <path d="M22 34 L18 44" stroke="#EC4899"/>
    <circle cx="24" cy="20" r="6" stroke="#EC4899"/>
    <path d="M54 14 Q58 16 58 20 Q58 24 54 26" stroke="#EC4899" strokeWidth="2"/>
  </svg>
);

const Sparkle4 = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" fill={color} className="w-full h-full">
    <path d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z"/>
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const HeroSection = ({ onMenuClick: _ }: HeroSectionProps) => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Open+Sans:wght@400;600&display=swap');
      `}</style>

      <div className="bg-[#FAFAF6] font-sans">
        <div className="max-w-7xl mx-auto px-6">
          <section className="relative flex flex-col md:flex-row items-center justify-between pt-10 pb-16 min-h-[440px]">

            {/* ── Sparkles ── */}
            <span className="absolute top-16 right-80 text-[#F9C74F] text-2xl pointer-events-none select-none hidden md:block">✦</span>
            <span className="absolute top-8 right-8 text-[#7B5EA7] text-base pointer-events-none select-none hidden md:block">✦</span>
            <span className="absolute bottom-24 left-[400px] text-[#178E81] text-base pointer-events-none select-none hidden md:block">✦</span>
            <span className="absolute top-32 left-[35%] text-[#F97316] text-sm pointer-events-none select-none hidden md:block">✦</span>
            <div className="absolute top-6 right-44 w-5 h-5 pointer-events-none hidden md:block"><Sparkle4 color="#F9C74F"/></div>
            <div className="absolute bottom-32 right-20 w-4 h-4 pointer-events-none hidden md:block"><Sparkle4 color="#7B5EA7"/></div>
            <div className="absolute top-40 left-[33%] w-3 h-3 pointer-events-none hidden md:block"><Sparkle4 color="#EF4444"/></div>
            <div className="absolute bottom-16 left-[44%] w-4 h-4 pointer-events-none hidden md:block"><Sparkle4 color="#22C55E"/></div>

            {/* ── Doodles ── */}
            {/* Spray bottle oranye */}
            <div className="absolute top-8 left-[45%] w-12 h-16 rotate-[15deg] pointer-events-none hidden md:block">
              <SprayBottle />
            </div>
            {/* Gunting hitam */}
            <div className="absolute top-[55%] left-[40%] w-10 h-11 -rotate-[20deg] pointer-events-none hidden md:block">
              <Scissors />
            </div>
            {/* Sisir hijau */}
            <div className="absolute bottom-28 right-6 w-16 h-8 -rotate-[10deg] pointer-events-none hidden md:block">
              <Comb />
            </div>
            {/* Clipper biru */}
            <div className="absolute top-24 right-4 w-11 h-16 rotate-[8deg] pointer-events-none hidden md:block">
              <Clipper />
            </div>
            {/* Wajah barber ungu */}
            <div className="absolute top-4 right-20 w-14 h-16 pointer-events-none hidden md:block">
              <FaceDoodlePurple />
            </div>
            {/* Wajah barber hijau */}
            <div className="absolute bottom-2 right-0 w-14 h-16 pointer-events-none hidden md:block">
              <FaceDoodleGreen />
            </div>
            {/* Wajah barber oranye */}
            <div className="absolute bottom-4 left-[38%] w-12 h-14 -rotate-[5deg] pointer-events-none hidden lg:block">
              <FaceDoodleOrange />
            </div>
            {/* Razor merah */}
            <div className="absolute top-[30%] left-[42%] w-14 h-6 rotate-[10deg] pointer-events-none hidden md:block">
              <Razor />
            </div>
            {/* Pomade jar kuning */}
            <div className="absolute bottom-14 left-[48%] w-12 h-10 pointer-events-none hidden lg:block">
              <PomadeJar />
            </div>
            {/* Brush ungu */}
            <div className="absolute top-10 left-[50%] w-5 h-14 rotate-[20deg] pointer-events-none hidden lg:block">
              <Brush />
            </div>
            {/* Hair dryer pink */}
            <div className="absolute top-[70%] right-8 w-16 h-12 -rotate-[15deg] pointer-events-none hidden lg:block">
              <HairDryer />
            </div>

            {/* ── Left Content ── */}
            <div className="z-10 w-full md:max-w-md space-y-3 text-center md:text-left">
              <p className="text-[#178E81] text-[11px] font-extrabold tracking-[2px] uppercase">
                Premium Grooming
              </p>
              <h1
                className="leading-[1.1] text-[#1a1a1a] text-[28px] md:text-[48px]"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
              >
                Good Hair.<br />
                Good Vibes.<br />
                <span className="text-[#7B5EA7]">Everyday.</span>
              </h1>
              <p
                className="text-[13px] text-[#666] leading-relaxed max-w-[280px]"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Potongan Terbaik dari barber profesional untuk style terbaikmu setiap hari
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-1 justify-center md:justify-start">
                <Link
                  href="/booking"
                  className="bg-[#F9C74F] text-[#1a1a1a] px-6 py-2.5 rounded-lg font-extrabold text-[14px] hover:bg-yellow-400 transition text-center"
                >
                  Book Now
                </Link>
                <button className="border-2 border-[#1a1a1a] text-[#1a1a1a] px-6 py-2.5 rounded-lg font-extrabold text-[14px] hover:bg-[#1a1a1a] hover:text-white transition">
                  Lihat Layanan
                </button>
              </div>
              <div className="flex items-center gap-2.5 pt-1 justify-center md:justify-start">
                <div className="flex gap-1">
                  {['#C0392B','#178E81','#48CAE4','#ADB5BD'].map((c, i) => (
                    <div key={i} className="w-5 h-5 rounded-full border-2 border-white" style={{ background: c }} />
                  ))}
                </div>
                <span className="text-[11px] text-[#555] font-bold" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                  10.000+ Pelanggan Puas
                </span>
              </div>
            </div>

            {/* ── Right: Photo ── */}
            <div className="relative flex-shrink-0 w-full max-w-[360px] h-[350px] md:h-[420px] items-end justify-center z-10 mt-10 md:mt-0 hidden md:flex">
              <div className="absolute bottom-0 right-5 w-48 h-40 bg-[#F9C74F] rounded-[60%_40%_50%_50%/50%_60%_40%_50%] z-0" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#178E81] rounded-full z-0" />
              <div className="absolute top-14 left-0 z-10 bg-white border-[2.5px] border-[#1a1a1a] rounded-xl px-3 py-1.5 text-[13px] font-black leading-tight -rotate-[5deg] shadow-[3px_3px_0_#1a1a1a]">
                FRESH<br />CUT!
              </div>
              <div className="relative z-10 w-[280px] h-[390px] rounded-lg overflow-hidden flex items-center justify-center">
                <img src="/owner.png" alt="Barber Professional" className="w-full h-full object-cover" />
              </div>
            </div>

          </section>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
