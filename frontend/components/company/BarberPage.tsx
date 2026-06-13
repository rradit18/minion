interface BarberProps {
  name: string;
  role: string;
  specialty: string;
  rating: string;
  reviewCount: string;
  imageColor: string;
  imageUrl?: string;
}

export default function BarberPage({
  name, role, specialty, rating, reviewCount, imageColor, imageUrl,
}: BarberProps) {
  return (
    <div
      className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm min-h-[200px] flex items-center hover:shadow-md transition-shadow cursor-pointer"
      style={{
        backgroundImage: "url('/pattern.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/40" />

      {/* Sparkle */}
      <svg className="absolute top-4 left-4 w-5 h-5 text-[#7B5EA7] z-10" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z"/>
      </svg>

      {/* Circle background */}
      <div
        className={`absolute left-0 bottom-0 w-[150px] h-[150px] rounded-full ${imageColor} z-10`}
        style={{ transform: "translate(10px, 20px)" }}
      />

      {/* Barber photo */}
      {imageUrl && (
        <img src={imageUrl} alt={name}
          className="absolute left-0 bottom-0 h-full w-[160px] object-cover object-top z-20" />
      )}

      {/* Content */}
      <div className="relative z-30 ml-[170px] py-6 pr-6 flex-1">
        <h3 className="text-xl font-black text-[#1a1a1a] leading-tight">{name}</h3>
        <p className="text-sm text-gray-500 font-semibold mb-2">{role}</p>

        <span className="inline-block text-xs font-bold px-3 py-1 rounded-md mb-4 border-2 border-[#7B5EA7] text-[#7B5EA7]">
          {specialty}
        </span>

        <div className="border-t border-gray-200 mb-3" />

        <div className="flex items-center justify-between">
          {/* Rating */}
          <span className="text-sm font-bold text-[#1a1a1a] flex items-center gap-1">
            <svg className="w-4 h-4 text-[#F9C74F]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {rating} ({reviewCount})
          </span>

          {/* Action icons */}
          <div className="flex gap-3 text-gray-400">
            <button className="hover:text-pink-600 transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" strokeWidth={2}/>
                <circle cx="12" cy="12" r="4" strokeWidth={2}/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
              </svg>
            </button>
            <button className="hover:text-green-600 transition-colors" aria-label="WhatsApp">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
