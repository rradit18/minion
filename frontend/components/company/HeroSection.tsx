import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#0e0e0e] flex items-center justify-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none select-none overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="absolute text-3xl"
            style={{
              top: `${(i * 17) % 100}%`,
              left: `${(i * 23 + 5) % 100}%`,
              transform: `rotate(${i * 45}deg)`,
            }}
          >
            {["✂️", "💈", "🪒", "🧔", "👨"][i % 5]}
          </span>
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
          Elite Cuts for the{" "}
          <span className="text-yellow-400">Next Gen</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
          The ultimate style factory grooming experience. Where craftsmanship meets digital realism.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="bg-yellow-400 text-black font-bold px-8 py-3 rounded uppercase tracking-widest text-sm hover:bg-yellow-300 transition-colors"
          >
            Book Now
          </Link>
          <Link
            href="/services"
            className="border border-gray-600 text-white font-bold px-8 py-3 rounded uppercase tracking-widest text-sm hover:border-yellow-400 hover:text-yellow-400 transition-colors"
          >
            Get Services
          </Link>
        </div>
      </div>
    </section>
  );
}
