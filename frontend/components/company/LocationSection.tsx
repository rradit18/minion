const locations = [
  { name: "South Haven", address: "Jl. Raya Fatmawati No. 12, Jakarta Selatan", gmaps: "#" },
  { name: "South Haven", address: "Jl. Kemang Raya No. 45, Jakarta Selatan", gmaps: "#" },
  { name: "South Haven", address: "Jl. TB Simatupang No. 8, Jakarta Selatan", gmaps: "#" },
  { name: "South Haven", address: "Jl. Cilandak KKO No. 3, Jakarta Selatan", gmaps: "#" },
];

export default function LocationSection() {
  return (
    <section className="bg-[#0e0e0e] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-white text-2xl md:text-3xl font-bold text-center mb-2">
          Temukan Studio Kami di Wilayah Terdekatmu
        </h2>
        <div className="w-12 h-0.5 bg-yellow-400 mx-auto mb-12" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {locations.map((loc, i) => (
            <div key={i} className="bg-[#141414] border border-white/10 rounded-xl p-5 hover:border-yellow-400/30 transition-colors">
              <div className="w-8 h-8 bg-yellow-400/10 rounded-lg flex items-center justify-center mb-3">
                <span className="text-yellow-400 text-sm">📍</span>
              </div>
              <p className="text-white font-bold text-sm mb-1">{loc.name}</p>
              <p className="text-gray-500 text-xs leading-relaxed mb-3">{loc.address}</p>
              <a
                href={loc.gmaps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-yellow-400 text-xs font-medium hover:underline"
              >
                Google Maps
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
