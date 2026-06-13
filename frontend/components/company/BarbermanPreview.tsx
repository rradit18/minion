"use client";

import Link from "next/link";

const barbers = [
  { name: "Hendra", role: "Fade King", badge: "Fade Specialist", color: "bg-cyan-400",   image: "/hendra.png",  slug: "hendra"  },
  { name: "Juan",   role: "Fade King", badge: "Fade Specialist", color: "bg-purple-400", image: "/juan.png",    slug: "juan"    },
  { name: "Yoga",   role: "Fade King", badge: "Fade Specialist", color: "bg-yellow-400", image: "/yoga.png",    slug: "yoga"    },
  { name: "Bastian",role: "Fade King", badge: "Fade Specialist", color: "bg-orange-400", image: "/bastian.png", slug: "bastian" },
];

export default function BarberPreview() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="font-bold text-sm tracking-wide mb-5 text-black uppercase">
        Kenalan Sama Barberman Kece Kami
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {barbers.map((barber, index) => (
          <Link key={index} href={`/barberman/${barber.slug}`}>
            <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-50 hover:shadow-md transition-shadow cursor-pointer">
              <div className="relative flex-shrink-0">
                <div className={`absolute inset-0 rounded-full ${barber.color}`} />
                <img
                  src={barber.image}
                  alt={barber.name}
                  className="relative w-24 h-24 md:w-28 md:h-28 object-cover rounded-full"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-black">{barber.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{barber.role}</p>
                <span className="inline-block bg-[#0F766E] text-white text-[10px] px-3 py-1 rounded-full">
                  {barber.badge}
                </span>
                <div className="mt-2 flex items-center gap-1 text-xs font-medium text-black">
                  <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span>4.9 (2300+)</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}