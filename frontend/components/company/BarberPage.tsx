  import React from 'react';

interface BarberProps {
  name: string;
  role: string;
  specialty: string;
  rating: string;
  imageColor: string; // Warna latar belakang lingkaran profil
}

const BarberPage = ({ name, role, specialty, rating, imageColor }: BarberProps) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
    {/* Profil Foto (Placeholder) */}
    <div className={`w-24 h-24 rounded-full ${imageColor} flex-shrink-0`} />
    
    <div className="flex-1">
      <h3 className="text-xl font-bold text-[#1a1a1a]">{name}</h3>
      <p className="text-sm text-gray-500 font-medium mb-1">{role}</p>
      <span className="inline-block bg-[#E0D4FF] text-[#6B46C1] text-xs font-bold px-3 py-1 rounded-md mb-3">
        {specialty}
      </span>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[#1a1a1a]">★ {rating}</span>
        <div className="flex gap-2 text-gray-400">
           {/* Icon placeholder */}
           <span>📷</span> <span>📞</span>
        </div>
      </div>
    </div>
  </div>
);

export default BarberPage;