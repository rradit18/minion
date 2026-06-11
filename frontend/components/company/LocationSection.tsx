const locations = [
  { name: "Jl. Pramuka",  address: "Jl. Pramuka No.6, Tj. Ayun Sakti, Kec. Bukit Bestari, Kota Tanjung Pinang, Kepulauan Riau 29124", hours: "09:00 - 23:00", maps: "#" },
  { name: "Kijang Kota",  address: "Jl. Kijang Raya No.45, Bintan", hours: "09:00 - 23:00", maps: "#" },
  { name: "Bt. 9",        address: "Jl. Batu 9 No.7,Tanjungpinang", hours: "09:00 - 23:00", maps: "#" },
  { name: "Jl. Ganet",    address: "Jl. Ganet No.22,Tanjungpinang", hours: "09:00 - 23:00", maps: "#" },
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
    <section className="bg-[#FCFBF7] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-10 items-start">

          {/* Left — title + illustration */}
          <div className="flex-shrink-0 md:w-56">
            <div className="flex items-center gap-1 mb-1">
              <h2 className="text-sm font-black text-[#1a1a1a] uppercase leading-tight tracking-wide">
                TEMUKAN STUDIO KAMI<br />DI WILAYAH TERDEKATMU
              </h2>
              <Squiggle />
            </div>
            <div className="mt-6 -rotate-[15deg] origin-center">
              <BarberPole />
            </div>
          </div>

          {/* Right — location list */}
          <div className="flex-1">
            <div className="space-y-0 divide-y divide-gray-100">
              {locations.map((loc, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors px-2 rounded-lg group"
                >
                  {/* Pin icon */}
                  <div className="w-8 h-8 rounded-full bg-[#F9C74F] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#1a1a1a]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>

                  {/* Name */}
                  <div className="w-32 flex-shrink-0">
                    <p className="font-bold text-[#1a1a1a] text-sm">{loc.name}</p>
                  </div>

                  {/* Address */}
                  <div className="flex-1 hidden sm:block">
                    <p className="text-gray-400 text-xs">{loc.address}</p>
                  </div>

                  {/* Hours */}
                  <div className="w-28 flex-shrink-0 hidden md:block">
                    <p className="text-gray-500 text-xs font-medium">{loc.hours}</p>
                  </div>

                  {/* Google Maps */}
                  <a
                    href={loc.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-[#1a1a1a] hover:text-[#178E81] transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    Google Maps
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
