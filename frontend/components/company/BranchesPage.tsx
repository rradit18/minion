"use client";

const branches = [
  { name: "Jl. Pramuka", address: "Jl. Bandara Perumahan Mekarsari Block A No. 11", tag: "Pusat",      tagColor: "bg-[#F9C74F] text-[#1a1a1a]", open: "Every day", hours: "10 to 21" },
  { name: "Kijang Kota", address: "Jl. Bandara Perumahan Mekarsari Block A No. 11", tag: "Pusat",      tagColor: "bg-[#178E81] text-white",      open: "Every day", hours: "10 to 21" },
  { name: "Bt. 9",       address: "Jl. Bandara Perumahan Mekarsari Block A No. 11", tag: "",           tagColor: "",                             open: "Every day", hours: "10 to 21" },
  { name: "Jl. Ganet",   address: "Jl. Bandara Perumahan Mekarsari Block A No. 11", tag: "Baru Dibuka",tagColor: "bg-[#7B5EA7] text-white",       open: "Every day", hours: "10 to 21" },
];

const Scissors = () => (
  <svg viewBox="0 0 40 44" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
    <circle cx="10" cy="34" r="6"/><circle cx="30" cy="34" r="6"/>
    <line x1="14" y1="30" x2="20" y2="10"/><line x1="26" y1="30" x2="20" y2="10"/>
  </svg>
);
const Clipper = () => (
  <svg viewBox="0 0 40 60" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
    <rect x="10" y="2" width="20" height="36" rx="6"/>
    <rect x="8" y="36" width="24" height="12" rx="2"/>
    <line x1="8" y1="42" x2="32" y2="42"/>
    <rect x="16" y="8" width="8" height="14" rx="2" fill="#178E81" stroke="#178E81"/>
  </svg>
);
const SprayBottle = () => (
  <svg viewBox="0 0 40 60" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
    <rect x="12" y="20" width="20" height="32" rx="4"/>
    <path d="M12 28 H6 V22 H12"/><path d="M6 22 L4 14"/>
    <path d="M4 14 H16 V20"/><path d="M2 10 Q6 8 10 10"/>
    <path d="M2 12 Q6 10 10 12"/><path d="M18 14 V20"/>
  </svg>
);
const Spiral = () => (
  <svg viewBox="0 0 40 40" fill="none" stroke="#178E81" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
    <path d="M20 20 C20 14 26 10 26 16 C26 22 14 26 14 18 C14 10 24 6 30 12 C36 18 32 30 22 32 C12 34 6 24 8 14"/>
  </svg>
);
const FaceDoodle = () => (
  <svg viewBox="0 0 44 54" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
    <circle cx="22" cy="18" r="14"/>
    <circle cx="16" cy="16" r="2" fill="#1a1a1a"/>
    <circle cx="28" cy="16" r="2" fill="#1a1a1a"/>
    <path d="M16 22 Q22 26 28 22"/>
    <path d="M12 6 Q22 0 32 6"/>
    <path d="M8 38 L4 54"/><path d="M36 38 L40 54"/>
    <path d="M8 38 Q22 50 36 38"/>
  </svg>
);

export default function BranchesPage() {
  return (
    <div
      className="pb-10"
      style={{
        backgroundImage: `linear-gradient(rgba(252,251,247,0.93), rgba(252,251,247,0.93)), url('/images/barber-pattern.png')`,
        backgroundSize: "cover",
        backgroundColor: "#FCFBF7",
      }}
    >
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-4 text-center relative">
        {/* Doodles */}
        <div className="absolute top-4 left-4 w-7 h-7 opacity-60 hidden sm:block"><Spiral /></div>
        <div className="absolute top-2 right-20 w-8 h-9 -rotate-[20deg] opacity-70 hidden sm:block"><Scissors /></div>
        <div className="absolute top-6 right-6 w-7 h-10 rotate-[10deg] opacity-70 hidden sm:block"><Clipper /></div>
        <div className="absolute top-4 left-24 w-7 h-10 rotate-[-15deg] opacity-50 hidden md:block"><SprayBottle /></div>
        <div className="absolute bottom-0 right-4 w-8 h-10 opacity-50 hidden md:block"><FaceDoodle /></div>
        <span className="absolute top-10 left-1/4 text-[#F9C74F] text-lg hidden sm:block">✦</span>
        <span className="absolute top-6 right-1/3 text-[#7B5EA7] text-sm hidden sm:block">✦</span>

        <p className="text-xs font-bold tracking-[0.2em] text-[#178E81] uppercase mb-3">Temukan Kami</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-[#1a1a1a]">Cabang Terdekat</h1>
        <p className="text-gray-500 text-sm max-w-lg mx-auto mb-8 leading-relaxed px-2">
          Cabang kami tersebar di seluruh kota. Setiap cabang menghadirkan keahlian terbaik
          dengan pengalaman grooming kelas atas yang autentik.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 sm:gap-12 mb-8">
          {[
            { label: "Cabang Aktif", val: "4" },
            { label: "Happy Clients", val: "10K" },
            { label: "Hour Opens", val: "11" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-2xl sm:text-3xl font-black text-[#1a1a1a]">{stat.val}</div>
              <div className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400 tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Illustration */}
        <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto mb-2">
          <img src="/illustration.png" alt="Minion Barbershop" className="w-full h-auto object-contain drop-shadow-sm" />
        </div>
      </section>

      {/* Branch Grid */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {branches.map((branch, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="h-40 sm:h-44 bg-gray-900 relative flex items-center justify-center">
                <span className="text-white/30 text-sm font-bold">Pict</span>
                {branch.tag && (
                  <span className={`absolute top-4 right-4 text-[10px] px-3 py-1 rounded-full font-bold ${branch.tagColor}`}>
                    {branch.tag}
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg sm:text-xl font-bold mb-1 text-[#1a1a1a]">{branch.name}</h3>
                <p className="text-xs text-gray-400 mb-3 flex items-start gap-1">
                  <span className="text-[#178E81] mt-0.5">📍</span>
                  <span>{branch.address}</span>
                </p>
                <div className="grid grid-cols-2 gap-x-4 text-xs mb-4">
                  <div>
                    <span className="font-bold text-[#178E81] block">Open</span>
                    <span className="text-gray-500">{branch.open}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#178E81] block">Work Hour</span>
                    <span className="text-gray-500">{branch.hours}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 py-2.5 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-50 text-[#1a1a1a] transition">
                    Buka Google Maps
                  </button>
                  <button className="px-5 py-2.5 bg-[#178E81] text-white rounded-lg text-xs font-bold hover:bg-[#0f6b61] transition">
                    Buka
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Map */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <h2 className="text-xl sm:text-2xl font-black mb-2 text-[#1a1a1a]">Peta Lokasi</h2>
        <p className="text-sm text-gray-400 mb-5">Semua Cabang Tersebar Secara Strategis di Tanjungpinang</p>
        <div className="w-full h-[280px] sm:h-[350px] md:h-[400px] rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127477.78852987903!2d104.0308!3d0.9167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d98f931741a641%3A0x44d7ce6b0db0db33!2sTanjungpinang%2C%20Riau%20Islands!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
