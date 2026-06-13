"use client";

const branches = [
  { name: "Pramuka", image: "/pramuka.jpg", address: "Jl. Bandara Perumahan Mekarsari Block A No. 11", tag: "Pusat", tagColor: "bg-[#F9C74F] text-[#1a1a1a]", open: "Every day", Hours: "10 to 21" },
  { name: "Kijang",  image: "/kijang.jpg",  address: "Jl. Bandara Perumahan Mekarsari Block A No. 11", tag: "Pusat", tagColor: "bg-[#178E81] text-white",    open: "Every day", Hours: "10 to 21" },
  { name: "Km. 9",   image: "/km9.jpg",     address: "Jl. Bandara Perumahan Mekarsari Block A No. 11", tag: "Pusat", tagColor: "bg-[#178E81] text-white",    open: "Every day", Hours: "10 to 21" },
  { name: "Ganet",   image: "/ganet.jpg",   address: "Jl. Bandara Perumahan Mekarsari Block A No. 11", tag: "Baru Dibuka", tagColor: "bg-[#7B5EA7] text-white", open: "Every day", Hours: "10 to 21" },
];

// ─── Doodle Components ────────────────────────────────────────────────────────
const D = {
  Scissors: () => (
    <svg viewBox="0 0 40 44" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <circle cx="10" cy="34" r="6"/><circle cx="30" cy="34" r="6"/>
      <line x1="14" y1="30" x2="20" y2="10"/><line x1="26" y1="30" x2="20" y2="10"/>
    </svg>
  ),
  Clipper: () => (
    <svg viewBox="0 0 40 60" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <rect x="10" y="2" width="20" height="36" rx="6"/>
      <rect x="8" y="36" width="24" height="12" rx="2"/>
      <line x1="8" y1="42" x2="32" y2="42"/>
      <rect x="16" y="8" width="8" height="14" rx="2" fill="#178E81" stroke="#178E81"/>
    </svg>
  ),
  Spray: () => (
    <svg viewBox="0 0 40 60" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <rect x="12" y="20" width="20" height="32" rx="4"/>
      <path d="M12 28 H6 V22 H12"/><path d="M6 22 L4 14"/>
      <path d="M4 14 H16 V20"/><path d="M2 10 Q6 8 10 10"/>
      <path d="M2 12 Q6 10 10 12"/><path d="M18 14 V20"/>
    </svg>
  ),
  Spiral: () => (
    <svg viewBox="0 0 40 40" fill="none" stroke="#178E81" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <path d="M20 20 C20 14 26 10 26 16 C26 22 14 26 14 18 C14 10 24 6 30 12 C36 18 32 30 22 32 C12 34 6 24 8 14"/>
    </svg>
  ),
  Face: () => (
    <svg viewBox="0 0 44 54" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <circle cx="22" cy="18" r="14"/>
      <circle cx="16" cy="16" r="2" fill="#1a1a1a"/><circle cx="28" cy="16" r="2" fill="#1a1a1a"/>
      <path d="M16 22 Q22 26 28 22"/><path d="M12 6 Q22 0 32 6"/>
      <path d="M8 38 L4 54"/><path d="M36 38 L40 54"/><path d="M8 38 Q22 50 36 38"/>
    </svg>
  ),
  FaceCurly: () => (
    <svg viewBox="0 0 44 54" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <circle cx="22" cy="20" r="14"/>
      <circle cx="16" cy="18" r="2" fill="#1a1a1a"/><circle cx="28" cy="18" r="2" fill="#1a1a1a"/>
      <path d="M16 25 Q22 29 28 25"/>
      <path d="M8 10 Q12 4 16 8 Q18 2 22 6 Q26 0 30 6 Q34 2 36 8"/>
      <path d="M8 34 L4 50"/><path d="M36 34 L40 50"/><path d="M8 34 Q22 46 36 34"/>
    </svg>
  ),
  FaceBeard: () => (
    <svg viewBox="0 0 44 54" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <circle cx="22" cy="18" r="14"/>
      <circle cx="16" cy="16" r="2" fill="#1a1a1a"/><circle cx="28" cy="16" r="2" fill="#1a1a1a"/>
      <path d="M14 24 Q18 20 22 24 Q26 20 30 24"/>
      <path d="M10 28 Q22 38 34 28"/>
      <path d="M12 6 Q22 0 32 6"/>
      <path d="M8 32 L4 50"/><path d="M36 32 L40 50"/><path d="M8 32 Q22 42 36 32"/>
    </svg>
  ),
  Comb: () => (
    <svg viewBox="0 0 60 28" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <rect x="2" y="2" width="56" height="12" rx="4"/>
      {[10,18,26,34,42,50].map(x => <line key={x} x1={x} y1="14" x2={x} y2="26"/>)}
    </svg>
  ),
  Music: () => (
    <svg viewBox="0 0 32 40" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <path d="M12 32 L12 8 L28 4 L28 18"/>
      <circle cx="8" cy="32" r="5"/><circle cx="24" cy="18" r="5"/>
    </svg>
  ),
  Razor: () => (
    <svg viewBox="0 0 50 20" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
      <rect x="2" y="6" width="36" height="8" rx="4"/>
      <path d="M38 10 L48 10"/><path d="M44 6 L48 10 L44 14"/>
      <line x1="10" y1="6" x2="10" y2="14" strokeWidth="1.5"/>
      <line x1="18" y1="6" x2="18" y2="14" strokeWidth="1.5"/>
      <line x1="26" y1="6" x2="26" y2="14" strokeWidth="1.5"/>
    </svg>
  ),
};

const Sparkle = ({ s = 18, c = "#F9C74F" }: { s?: number; c?: string }) => (
  <svg viewBox="0 0 24 24" style={{ width: s, height: s }} fill={c}>
    <path d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z"/>
  </svg>
);

const PatternOverlay = () => (
  <div className="absolute inset-0 z-0 pointer-events-none"
    style={{ backgroundImage: "url('/pattern.png')", backgroundRepeat: "repeat", backgroundSize: "auto", opacity: 0.6 }} />
);

// shorthand positioner
const Pos = ({ top, left, right, bottom, w, h, rot, op, children }: {
  top?: string; left?: string; right?: string; bottom?: string;
  w: string; h: string; rot?: string; op?: string; children: React.ReactNode;
}) => (
  <div className="absolute pointer-events-none hidden sm:block z-10"
    style={{ top, left, right, bottom, width: w, height: h, transform: rot ? `rotate(${rot})` : undefined, opacity: op ?? "0.5" }}>
    {children}
  </div>
);

export default function BranchesPage() {
  return (
    <div className="relative min-h-screen pb-10 bg-[#FCFBF7]">
      <main className="relative z-10">

        {/* ── Hero Section ── */}
        <section className="relative max-w-7xl mx-auto px-6 pt-8 pb-4 text-center overflow-hidden">
          <PatternOverlay />

          {/* Kiri atas */}
          <Pos top="8px"  left="8px"  w="28px" h="28px" rot="-5deg" op="0.55"><D.Spiral /></Pos>
          <Pos top="52px" left="12px" w="28px" h="38px" rot="15deg" op="0.50"><D.Spray /></Pos>
          <Pos top="130px" left="6px" w="38px" h="46px" rot="-8deg" op="0.40"><D.Face /></Pos>
          <Pos top="240px" left="8px" w="36px" h="44px" rot="6deg"  op="0.35"><D.FaceBeard /></Pos>
          <Pos bottom="20px" left="4px" w="36px" h="40px" rot="-20deg" op="0.45"><D.Scissors /></Pos>
          {/* Kiri tengah */}
          <Pos top="100px" left="80px" w="52px" h="24px" rot="-10deg" op="0.35"><D.Comb /></Pos>
          <Pos bottom="60px" left="70px" w="32px" h="40px" rot="12deg" op="0.30"><D.FaceCurly /></Pos>
          <Pos top="300px" left="50px" w="40px" h="20px" rot="-8deg" op="0.30"><D.Razor /></Pos>

          {/* Kanan atas */}
          <Pos top="6px"   right="70px" w="32px" h="36px" rot="-20deg" op="0.55"><D.Scissors /></Pos>
          <Pos top="8px"   right="8px"  w="26px" h="38px" rot="10deg"  op="0.55"><D.Clipper /></Pos>
          <Pos top="70px"  right="4px"  w="34px" h="42px" rot="-5deg"  op="0.45"><D.Face /></Pos>
          <Pos top="170px" right="6px"  w="34px" h="44px" rot="8deg"   op="0.40"><D.FaceBeard /></Pos>
          <Pos bottom="24px" right="4px" w="28px" h="38px" rot="15deg" op="0.45"><D.Spray /></Pos>
          {/* Kanan tengah */}
          <Pos top="120px" right="80px" w="36px" h="18px" rot="-12deg" op="0.35"><D.Razor /></Pos>
          <Pos bottom="70px" right="70px" w="34px" h="42px" rot="-8deg" op="0.30"><D.FaceCurly /></Pos>
          <Pos top="260px" right="50px" w="26px" h="34px" rot="18deg" op="0.30"><D.Music /></Pos>

          {/* Atas tengah */}
          <Pos top="4px"  left="33%" w="24px" h="32px" rot="18deg" op="0.40"><D.Music /></Pos>
          <Pos top="6px"  right="30%" w="26px" h="36px" rot="-15deg" op="0.40"><D.Clipper /></Pos>
          <Pos top="80px" left="45%" w="44px" h="20px" rot="8deg"  op="0.30"><D.Comb /></Pos>

          {/* Sparkle */}
          <div className="absolute pointer-events-none hidden sm:block z-10" style={{ top: 24, left: 56 }}><Sparkle s={14} c="#F9C74F" /></div>
          <div className="absolute pointer-events-none hidden sm:block z-10" style={{ top: 16, right: 140 }}><Sparkle s={20} c="#178E81" /></div>
          <div className="absolute pointer-events-none hidden md:block z-10" style={{ top: 160, left: 140 }}><Sparkle s={13} c="#7B5EA7" /></div>
          <div className="absolute pointer-events-none hidden md:block z-10" style={{ bottom: 50, right: 140 }}><Sparkle s={16} c="#F9C74F" /></div>
          <div className="absolute pointer-events-none hidden md:block z-10" style={{ bottom: 24, left: "48%" }}><Sparkle s={11} c="#178E81" /></div>
          <div className="absolute pointer-events-none hidden md:block z-10" style={{ top: 200, right: 200 }}><Sparkle s={14} c="#F9C74F" /></div>

          {/* Konten */}
          <div className="relative z-10">
            <p className="text-xs font-bold tracking-[0.2em] text-[#178E81] uppercase mb-3">Temukan Kami</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-[#1a1a1a]">Cabang Terdekat</h1>
            <p className="text-gray-500 text-sm max-w-lg mx-auto mb-8 leading-relaxed px-2">
              Minion barbershop tersebar di seluruh Tanjungpinang siap melayani dimanapun kalian berada.
            </p>
            <div className="flex justify-center gap-8 sm:gap-12 mb-8">
              {[{ label: "Cabang Aktif", val: "4" }, { label: "Happy Clients", val: "10K" }, { label: "Hour Opens", val: "11" }].map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl sm:text-3xl font-black text-[#1a1a1a]">{stat.val}</div>
                  <div className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400 tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto mb-2">
              <img src="/illustration.png" alt="Minion Barbershop" className="w-full h-auto object-contain drop-shadow-sm" />
            </div>
          </div>
        </section>

        {/* ── Branch Grid ── */}
        <section className="w-full">
          <div className="relative max-w-7xl mx-auto px-6 pt-8 mb-16 overflow-hidden">
            <PatternOverlay />
            <Pos top="8px"    left="4px"   w="28px" h="36px" rot="15deg"  op="0.40"><D.Spray /></Pos>
            <Pos top="0px"    right="28px" w="24px" h="24px"             op="0.35"><D.Spiral /></Pos>
            <Pos bottom="36px" left="20px" w="28px" h="32px" rot="-15deg" op="0.40"><D.Scissors /></Pos>
            <Pos bottom="28px" right="20px" w="24px" h="36px" rot="10deg" op="0.35"><D.Clipper /></Pos>
            <div className="absolute top-6 left-1/3 text-[#F9C74F] text-xl hidden md:block z-10 pointer-events-none select-none">✦</div>
            <div className="absolute bottom-16 right-1/3 text-[#178E81] text-sm hidden md:block z-10 pointer-events-none select-none">✦</div>
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {branches.map((branch, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-2xl">
                    <img src={branch.image} alt={branch.name} className="w-full h-full object-cover"/>
                    {branch.tag && (
                      <span className={`absolute top-4 right-4 text-[10px] px-3 py-1 rounded-full font-bold ${branch.tagColor}`}>
                        {branch.tag}
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg sm:text-xl font-bold mb-1 text-[#1a1a1a]">{branch.name}</h3>
                    <p className="text-xs text-gray-400 mb-3 flex items-start gap-1">
                      <svg className="w-3.5 h-3.5 text-[#178E81] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                      </svg>
                      <span>{branch.address}</span>
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 text-xs mb-4">
                      <div><span className="font-bold text-[#178E81] block">Open</span><span className="text-gray-500">{branch.open}</span></div>
                      <div><span className="font-bold text-[#178E81] block">Work Hour</span><span className="text-gray-500">{branch.Hours}</span></div>
                    </div>
                    <div className="flex gap-3 mt-auto">
                      <button className="flex-1 py-2.5 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-50 text-[#1a1a1a] transition">Buka Google Maps</button>
                      <button className="px-5 py-2.5 bg-[#178E81] text-white rounded-lg text-xs font-bold hover:bg-[#0f6b61] transition">Buka</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Peta Lokasi ── */}
        <section className="w-full bg-white relative overflow-hidden">
          <Pos top="12px"   left="12px"  w="26px" h="36px" rot="20deg"  op="0.20"><D.Spray /></Pos>
          <Pos top="16px"   right="20px" w="26px" h="28px" rot="-10deg" op="0.20"><D.Scissors /></Pos>
          <Pos bottom="16px" left="24px" w="22px" h="32px" rot="5deg"   op="0.18"><D.Clipper /></Pos>
          <div className="absolute top-4 left-1/2 pointer-events-none hidden md:block z-10"><Sparkle s={14} c="#F9C74F" /></div>
          <div className="absolute bottom-8 right-1/4 pointer-events-none hidden md:block z-10"><Sparkle s={12} c="#7B5EA7" /></div>
          <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
            <h2 className="text-xl sm:text-2xl font-black mb-2 text-[#1a1a1a]">Peta Lokasi</h2>
            <div className="w-full h-[280px] sm:h-[350px] md:h-[400px] rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127477.78852987903!2d104.0308!3d0.9167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d98f931741a641%3A0x44d7ce6b0db0db33!2sTanjungpinang%2C%20Riau%20Islands!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
              />
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
