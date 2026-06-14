const locations = [
  { name: "Jl. Pramuka",  address: "Jl. Pramuka No.6, Tj. Ayun Sakti, Kec. Bukit Bestari, Kota Tanjung Pinang, Kepulauan Riau 29124", hours: "09:00 - 23:00", maps: "#", color: "#F59E0B" },
  { name: "Kijang Kota",  address: "Jl. Kijang Raya No.45, Bintan", hours: "09:00 - 23:00", maps: "#", color: "#14B8A6" },
  { name: "Bt. 9",        address: "Jl. Batu 9 No.7,Tanjungpinang", hours: "09:00 - 23:00", maps: "#", color: "#EF4444" },
  { name: "Jl. Ganet",    address: "Jl. Ganet No.22,Tanjungpinang", hours: "09:00 - 23:00", maps: "#", color: "#8B5CF6" },
];

// Barber pole SVG illustration
const BarberPole = () => (
  <svg viewBox="0 0 80 160" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-32">
    {/* Top ball */}
    <circle cx="40" cy="14" r="12" stroke="#1a1a1a" fill="white"/>
    {/* Top cap */}
    <rect x="22" y="24" width="36" height="10" rx="5" stroke="#1a1a1a" fill="white"/>
    {/* Bottom cap */}
    <rect x="22" y="126" width="36" height="10" rx="5" stroke="#1a1a1a" fill="white"/>
    {/* Bottom ball */}
    <ellipse cx="40" cy="148" rx="16" ry="8" stroke="#1a1a1a" fill="white"/>
    {/* Pole body */}
    <rect x="24" y="33" width="32" height="94" rx="4" stroke="#1a1a1a" fill="white"/>
    {/* Diagonal stripes */}
    <line x1="24" y1="50" x2="56" y2="33" stroke="#1a1a1a" strokeWidth="2"/>
    <line x1="24" y1="68" x2="56" y2="51" stroke="#1a1a1a" strokeWidth="2"/>
    <line x1="24" y1="86" x2="56" y2="69" stroke="#1a1a1a" strokeWidth="2"/>
    <line x1="24" y1="104" x2="56" y2="87" stroke="#1a1a1a" strokeWidth="2"/>
    <line x1="24" y1="122" x2="56" y2="105" stroke="#1a1a1a" strokeWidth="2"/>
    <line x1="30" y1="127" x2="56" y2="113" stroke="#1a1a1a" strokeWidth="2"/>
    {/* Sparkle lines kiri */}
    <line x1="12" y1="22" x2="6" y2="16" stroke="#1a1a1a" strokeWidth="2"/>
    <line x1="8" y1="28" x2="2" y2="26" stroke="#1a1a1a" strokeWidth="2"/>
    {/* Dot pattern kanan */}
    <circle cx="64" cy="30" r="2" fill="#1a1a1a"/>
    <circle cx="70" cy="38" r="1.5" fill="#1a1a1a"/>
    <circle cx="66" cy="46" r="1.5" fill="#1a1a1a"/>
  </svg>
);

// Squiggly line decoration
const Squiggle = () => (
  <svg viewBox="0 0 80 20" fill="none" className="w-16 h-4 ml-1" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 10 Q10 2 20 10 Q30 18 40 10 Q50 2 60 10 Q70 18 80 10" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round"/>
  </svg>
);

const LocationSection = () => {
  return (
    <section className="bg-[#FAF7EE] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">

          {/* Left — title + illustration */}
          <div className="flex-shrink-0 w-full md:w-56">
            <div className="flex items-center gap-1 mb-1">
              <h2 className="font-display text-base font-bold text-[#1a1a1a] uppercase leading-tight tracking-wide">
                TEMUKAN STUDIO KAMI<br />DI WILAYAH TERDEKATMU
              </h2>
              <Squiggle />
            </div>
            <div className="mt-4 -rotate-[15deg] origin-center hidden md:block">
              <BarberPole />
            </div>
          </div>

          {/* Right — location list dalam card ber-border */}
          <div className="w-full md:flex-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
              {locations.map((loc, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 sm:gap-4 py-3.5 px-4 sm:px-6 hover:bg-gray-50/70 transition-colors group"
                >
                  {/* Pin icon — warna berbeda tiap lokasi */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${loc.color}1A` }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke={loc.color} strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-7.16 7-12a7 7 0 10-14 0c0 4.84 7 12 7 12z"/>
                      <circle cx="12" cy="9" r="2.5" fill={loc.color} stroke="none"/>
                    </svg>
                  </div>

                  {/* Name + address + hours — stack di mobile, sejajar di layar lebar */}
                  <div className="min-w-0 flex-1 flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
                    <p className="font-display font-bold text-[#1a1a1a] text-sm truncate sm:w-28 sm:flex-shrink-0">
                      {loc.name}
                    </p>
                    <p className="text-gray-400 text-xs truncate min-w-0 sm:flex-1">
                      {loc.address}
                    </p>
                    <p className="text-gray-500 text-[11px] sm:text-xs font-medium whitespace-nowrap sm:w-24 sm:flex-shrink-0 sm:text-right md:text-left">
                      {loc.hours}
                    </p>
                  </div>

                  {/* Google Maps — ikon saja di mobile, teks penuh di layar lebar */}
                  <a
                    href={loc.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Buka ${loc.name} di Google Maps`}
                    className="flex items-center gap-1 text-xs font-bold text-[#1a1a1a] hover:text-[#178E81] transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    <span className="hidden sm:inline">Google Maps</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LocationSection;
