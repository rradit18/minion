import React from 'react';
// Mengimpor ikon dari lucide-react
import { Camera, Phone } from 'lucide-react';

interface BarberProps {
  name: string;
  role: string;
  specialty: string;
  rating: string;
  imageColor: string; // Contoh: 'bg-teal-500', 'bg-purple-500', dll
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
        
        {/* Ikon Lucide */}
        <div className="flex gap-3 text-gray-400">
          <a href="#" className="hover:text-pink-600 transition-colors">
            <Camera size={20} />
          </a>
          <a href="#" className="hover:text-green-600 transition-colors">
            <Phone size={20} />
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default BarberPage;