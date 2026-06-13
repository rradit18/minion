"use client";

import Link from 'next/link';

interface HeroSectionProps {
  onMenuClick: () => void;
}

// ─── Doodle Components ────────────────────────────────────────────────────────

const SprayBottle = () => (
  <svg viewBox="0 0 40 60" fill="none" strokeWidth="2.5" strokeLinecap="round" className="w-full h-full">
    <rect x="12" y="20" width="20" height="32" rx="4" stroke="#F97316" />
    <path d="M12 28 H6 V22 H12" stroke="#F97316" />
    <path d="M6 22 L4 14" stroke="#F97316" />
    <path d="M4 14 H16 V20" stroke="#F97316" />
    <path d="M2 10 Q6 8 10 10" stroke="#F97316" />
    <path d="M2 12 Q6 10 10 12" stroke="#F97316" />
    <path d="M18 14 V20" stroke="#F97316" />
  </svg>
);

const Scissors = () => (
  <svg viewBox="0 0 40 44" fill="none" strokeWidth="2.5" strokeLinecap="round" className="w-full h-full">
    <circle cx="10" cy="34" r="6" stroke="#1a1a1a" />
    <circle cx="30" cy="34" r="6" stroke="#1a1a1a" />
    <line x1="14" y1="30" x2="20" y2="10" stroke="#1a1a1a" />
    <line x1="26" y1="30" x2="20" y2="10" stroke="#1a1a1a" />
  </svg>
);

const Comb = () => (
  <svg viewBox="0 0 60 28" fill="none" strokeWidth="2.5" strokeLinecap="round" className="w-full h-full">
    <rect x="2" y="2" width="56" height="12" rx="4" stroke="#7B5EA7" />
    {[10, 18, 26, 34, 42, 50].map(x => <line key={x} x1={x} y1="14" x2={x} y2="24" stroke="#7B5EA7" />)}
  </svg>
);

const Clipper = () => (
  <svg viewBox="0 0 40 60" fill="none" strokeWidth="2.5" strokeLinecap="round" className="w-full h-full">
    <rect x="10" y="2" width="20" height="36" rx="6" stroke="#178E81" />
    <rect x="8" y="36" width="24" height="12" rx="2" stroke="#178E81" />
    <line x1="8" y1="42" x2="32" y2="42" stroke="#178E81" />
    <line x1="10" y1="46" x2="14" y2="46" stroke="#178E81" />
    <line x1="18" y1="46" x2="22" y2="46" stroke="#178E81" />
    <line x1="26" y1="46" x2="30" y2="46" stroke="#178E81" />
    <rect x="16" y="8" width="8" height="14" rx="2" fill="#178E81" stroke="#178E81" />
  </svg>
);

const FaceDoodlePurple = () => (
  <svg viewBox="0 0 44 54" fill="none" strokeWidth="2.5" strokeLinecap="round" className="w-full h-full">
    <circle cx="22" cy="20" r="16" stroke="#7B5EA7" />
    <circle cx="16" cy="18" r="2" fill="#7B5EA7" />
    <circle cx="28" cy="18" r="2" fill="#7B5EA7" />
    <path d="M16 24 Q22 28 28 24" stroke="#7B5EA7" />
    <path d="M14 8 Q22 3 30 8" stroke="#7B5EA7" />
    <rect x="10" y="34" width="24" height="14" rx="4" stroke="#7B5EA7" />
  </svg>
);

const FaceDoodleGreen = () => (
  <svg viewBox="0 0 44 54" fill="none" strokeWidth="2.5" strokeLinecap="round" className="w-full h-full">
    <circle cx="22" cy="20" r="16" stroke="#22C55E" />
    <circle cx="16" cy="18" r="2" fill="#22C55E" />
    <circle cx="28" cy="18" r="2" fill="#22C55E" />
    <path d="M16 24 Q22 29 28 24" stroke="#22C55E" />
    <path d="M8 10 Q12 4 16 8 Q18 2 22 6 Q26 0 30 6 Q34 2 36 8" stroke="#22C55E" />
    <rect x="10" y="34" width="24" height="14" rx="4" stroke="#22C55E" />
  </svg>
);

const Razor = () => (
  <svg viewBox="0 0 50 20" fill="none" strokeWidth="2.5" strokeLinecap="round" className="w-full h-full">
    <rect x="2" y="6" width="36" height="8" rx="4" stroke="#EF4444" />
    <path d="M38 10 L48 10" stroke="#EF4444" />
    <path d="M44 6 L48 10 L44 14" stroke="#EF4444" />
    <line x1="10" y1="6" x2="10" y2="14" stroke="#EF4444" strokeWidth="1.5" />
    <line x1="18" y1="6" x2="18" y2="14" stroke="#EF4444" strokeWidth="1.5" />
    <line x1="26" y1="6" x2="26" y2="14" stroke="#EF4444" strokeWidth="1.5" />
  </svg>
);

const PomadeJar = () => (
  <svg viewBox="0 0 44 36" fill="none" strokeWidth="2.5" strokeLinecap="round" className="w-full h-full">
    <ellipse cx="22" cy="10" rx="18" ry="8" stroke="#F59E0B" />
    <rect x="4" y="10" width="36" height="18" rx="3" stroke="#F59E0B" />
    <ellipse cx="22" cy="28" rx="18" ry="4" stroke="#F59E0B" />
    <path d="M10 10 Q22 6 34 10" stroke="#F59E0B" strokeWidth="1.5" />
  </svg>
);

const Brush = () => (
  <svg viewBox="0 0 16 60" fill="none" strokeWidth="2.5" strokeLinecap="round" className="w-full h-full">
    <rect x="4" y="2" width="8" height="36" rx="4" stroke="#0EA5E9" />
    <ellipse cx="8" cy="50" rx="6" ry="10" stroke="#0EA5E9" />
    <line x1="8" y1="38" x2="8" y2="40" stroke="#0EA5E9" />
  </svg>
);

const HairDryer = () => (
  <svg viewBox="0 0 60 44" fill="none" strokeWidth="2.5" strokeLinecap="round" className="w-full h-full">
    <ellipse cx="28" cy="20" rx="22" ry="16" stroke="#EC4899" />
    <path d="M50 20 L58 20" stroke="#EC4899" />
    <path d="M22 34 L18 44" stroke="#EC4899" />
    <circle cx="24" cy="20" r="6" stroke="#EC4899" />
    <path d="M54 14 Q58 16 58 20 Q58 24 54 26" stroke="#EC4899" strokeWidth="2" />
  </svg>
);

const Lightning = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 32" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M14 2 L4 18 H11 L9 30 L20 12 H13 Z" stroke={color} />
  </svg>
);

const Sparkle4 = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" fill={color} className="w-full h-full">
    <path d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z" />
  </svg>
);

// Badge "FRESH CUT!" — speech bubble gambar tangan
const FreshCutBadge = () => (
  <div className="absolute top-[30%] -right-2 lg:right-2 z-20 -rotate-[8deg] pointer-events-none">
    <div className="relative bg-white border-[2.5px] border-[#F97316] rounded-[50%] px-4 py-2">
      <span className="block text-[#F97316] font-display font-bold text-[15px] leading-[1] text-center">
        FRESH<br />CUT!
      </span>
      {/* ekor bubble */}
      <svg viewBox="0 0 20 20" className="absolute -left-2 bottom-2 w-4 h-4">
        <path d="M18 2 L2 14 L16 12 Z" fill="white" stroke="#F97316" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const customerAvatars = ['/gallery1.jpg', '/gallery2.png', '/gallery3.jpg', '/gallery4.png', '/gallery5.jpg'];

const HeroSection = ({ onMenuClick: _ }: HeroSectionProps) => {
  return (
    <div className="bg-[#FAF7EE]">
      <div className="max-w-7xl mx-auto px-6">
        <section className="relative grid grid-cols-1 md:grid-cols-2 items-end gap-4 pt-6 pb-10">

          {/* ── Left Content ── */}
          <div className="z-10 w-full space-y-4 text-center md:text-left">
            <p className="text-[#178E81] text-[12px] font-bold tracking-[2px] uppercase font-body">
              Premium Grooming
            </p>
            <h1 className="font-display font-bold leading-[1.05] text-[#1a1a1a] text-[40px] md:text-[58px] lg:text-[72px] tracking-tight">
              Pantang<br />
              pulang<br />
              sebelum<br />
              <span className="relative inline-block text-[#7B5EA7]">
                gantenggg.
                {/* underline doodle kuning */}
                <svg viewBox="0 0 240 18" className="absolute -bottom-2 left-0 w-full h-3" preserveAspectRatio="none">
                  <path d="M2 9 Q60 3 120 9 T238 8" stroke="#F9C74F" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="text-[14px] text-[#666] leading-relaxed max-w-[320px] mx-auto md:mx-0 font-body">
              Potongan terbaik bukan cuma soal gaya — tapi self upgrade tiap hari.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-1 justify-center md:justify-start">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 bg-[#F9C74F] text-[#1a1a1a] px-6 py-3 rounded-xl font-display font-bold text-[15px] hover:bg-yellow-400 transition"
              >
                Book Now <span aria-hidden>→</span>
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 border-2 border-[#1a1a1a] text-[#1a1a1a] px-6 py-3 rounded-xl font-display font-bold text-[15px] hover:bg-[#1a1a1a] hover:text-white transition"
              >
                Lihat Layanan <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="flex items-center gap-3 pt-2 justify-center md:justify-start">
              <div className="flex -space-x-2">
                {customerAvatars.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="w-8 h-8 rounded-full border-2 border-[#FAF7EE] object-cover"
                  />
                ))}
              </div>
              <span className="text-[12px] text-[#555] font-semibold font-body">
                10.000+ Pelanggan Puas
              </span>
            </div>
          </div>

          {/* ── Right: Photo + doodles terintegrasi ── */}
          <div className="relative w-full h-[460px] md:h-[520px] lg:h-[560px] hidden md:flex items-end justify-center">

            {/* Blob warna di belakang foto */}
            <div className="absolute bottom-6 left-1/2 -translate-x-[40%] w-[320px] h-[290px] lg:w-[360px] lg:h-[330px] bg-[#F9C74F] rounded-[60%_40%_55%_45%/55%_55%_45%_45%] z-0" />
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-[#178E81] rounded-full z-0" />
            <div className="absolute top-16 right-10 w-16 h-16 bg-[#7B5EA7]/15 rounded-full z-0" />

            {/* Foto owner — mengisi penuh tinggi container, bawah rata dengan teks kiri */}
            <div className="relative z-10 w-full max-w-[560px] lg:max-w-[920px] h-full flex items-end justify-center">
              <img src="/owner.png" alt="Barber Professional" className="w-full h-full object-contain object-bottom" />
            </div>

            {/* ── Doodles mengelilingi foto — lebih ramai & warna bervariasi ── */}
            {/* Spray bottle — oranye, kiri atas */}
            <div className="absolute top-10 left-0 w-16 h-24 rotate-[12deg] pointer-events-none z-20">
              <SprayBottle />
            </div>
            {/* Scissors — hitam, kiri tengah */}
            <div className="absolute top-[38%] left-2 w-14 h-14 -rotate-[15deg] pointer-events-none z-20">
              <Scissors />
            </div>
            {/* Razor — merah, kiri bawah */}
            <div className="absolute bottom-32 left-0 w-14 h-6 rotate-[8deg] pointer-events-none z-20">
              <Razor />
            </div>
            {/* Brush — biru, kiri bawah */}
            <div className="absolute bottom-10 left-6 w-6 h-16 -rotate-[18deg] pointer-events-none z-20">
              <Brush />
            </div>
            {/* Pomade jar — amber, kiri tengah-atas */}
            <div className="absolute top-24 left-[22%] w-14 h-12 -rotate-[8deg] pointer-events-none z-20">
              <PomadeJar />
            </div>

            {/* Face purple — ungu, kanan atas */}
            <div className="absolute top-4 right-2 w-18 h-22 pointer-events-none z-20">
              <FaceDoodlePurple />
            </div>
            {/* Clipper — teal, kanan tengah */}
            <div className="absolute top-[34%] right-0 w-14 h-20 rotate-[10deg] pointer-events-none z-20">
              <Clipper />
            </div>
            {/* Comb — ungu, kanan bawah */}
            <div className="absolute bottom-24 right-0 w-18 h-9 -rotate-[12deg] pointer-events-none z-20">
              <Comb />
            </div>
            {/* Hair dryer — pink, kanan tengah */}
            <div className="absolute top-[52%] right-6 w-16 h-12 -rotate-[10deg] pointer-events-none z-20">
              <HairDryer />
            </div>
            {/* Face green — hijau, kanan bawah pojok */}
            <div className="absolute bottom-2 right-4 w-16 h-18 pointer-events-none z-20">
              <FaceDoodleGreen />
            </div>

            {/* Sparkles & petir — warna bervariasi */}
            <div className="absolute top-2 left-[34%] w-6 h-6 pointer-events-none z-20"><Sparkle4 color="#F9C74F" /></div>
            <div className="absolute top-8 right-[36%] w-5 h-5 pointer-events-none z-20"><Sparkle4 color="#178E81" /></div>
            <div className="absolute top-[30%] left-[20%] w-4 h-4 pointer-events-none z-20"><Sparkle4 color="#7B5EA7" /></div>
            <div className="absolute top-[44%] left-[40%] w-3 h-3 pointer-events-none z-20"><Sparkle4 color="#EF4444" /></div>
            <div className="absolute bottom-16 left-[32%] w-4 h-4 pointer-events-none z-20"><Sparkle4 color="#22C55E" /></div>
            <div className="absolute top-[20%] right-[30%] w-5 h-7 pointer-events-none z-20"><Lightning color="#F97316" /></div>
            <span className="absolute bottom-28 left-[42%] text-[#7B5EA7] text-xl pointer-events-none z-20 select-none">✦</span>

            {/* FRESH CUT! badge */}
            <FreshCutBadge />
          </div>

        </section>
      </div>
    </div>
  );
};

export default HeroSection;
