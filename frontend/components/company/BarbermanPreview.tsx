// components/company/BarberPreview.tsx
import React from "react";

const barbers = [
  { name: "Hendra", role: "Fade King", badge: "Fade Specialist", color: "bg-cyan-400", image: "/barber1.png" },
  { name: "Juan", role: "Fade King", badge: "Fade Specialist", color: "bg-purple-400", image: "/barber2.png" },
  { name: "Yoga", role: "Fade King", badge: "Fade Specialist", color: "bg-yellow-400", image: "/barber3.png" },
  { name: "Bastian", role: "Fade King", badge: "Fade Specialist", color: "bg-orange-400", image: "/barber4.png" },
];

export default function BarberPreview() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="font-bold text-sm tracking-wide mb-5 text-black">
        KENALAN SAMA BARBERMAN KECE KAMI
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {barbers.map((barber, index) => (
          <div key={index} className="bg-white rounded-3xl p-4 flex items-center gap-4 shadow-sm">
            <div className="relative">
              <div className={`absolute inset-0 rounded-full scale-110 ${barber.color}`} />
              <img src={barber.image} alt={barber.name} className="relative w-20 h-20 object-cover rounded-full" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-base">{barber.name}</h3>
              <p className="text-xs text-gray-500 mb-2">{barber.role}</p>
              <span className="inline-block bg-[#0F766E] text-white text-[10px] px-3 py-1 rounded-full">
                {barber.badge}
              </span>
              <div className="mt-2 flex items-center gap-1 text-xs font-medium text-black">
                <span>⭐</span> <span>4.9 (2300+)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}