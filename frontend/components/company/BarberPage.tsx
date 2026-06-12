import React from 'react';
import { Camera, Phone } from 'lucide-react';

interface BarberProps {
  name: string;
  role: string;
  specialty: string;
  rating: string;
  reviewCount: string;
  imageColor: string;
  imageUrl?: string;
}

const BarberPage = ({ name, role, specialty, rating, reviewCount, imageColor, imageUrl }: BarberProps) => (
  <div
    className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm min-h-[200px] flex items-center"
    style={{
      backgroundImage: `url('/pattern.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    {/* Overlay */}
    <div className="absolute inset-0 bg-white/40" />

    {/* Sparkle */}
    <span className="absolute top-4 left-4 text-[#7B5EA7] text-2xl font-black select-none z-10">✦</span>

    {/* Lingkaran warna */}
    <div
      className={`absolute left-0 bottom-0 w-[150px] h-[150px] rounded-full ${imageColor} z-10`}
      style={{ transform: 'translate(10px, 20px)' }}
    />

    {/* Foto barber */}
    {imageUrl && (
      <img
        src={imageUrl}
        alt={name}
        className="absolute left-0 bottom-0 h-full w-[160px] object-cover object-top z-20"
      />
    )}

    {/* Konten teks */}
    <div className="relative z-30 ml-[170px] py-6 pr-6 flex-1">
      <h3 className="text-xl font-black text-[#1a1a1a] leading-tight">{name}</h3>
      <p className="text-sm text-gray-500 font-semibold mb-2">{role}</p>

      <span
        className="inline-block text-xs font-bold px-3 py-1 rounded-md mb-4"
        style={{ border: '2px solid', borderColor: '#7B5EA7', color: '#7B5EA7' }}
      >
        {specialty}
      </span>

      {/* Divider */}
      <div className="border-t border-gray-200 mb-3" />

      {/* Rating & Ikon */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[#1a1a1a] flex items-center gap-1">
          <span className="text-[#F9C74F]">★</span> {rating} ({reviewCount})
        </span>
        <div className="flex gap-3 text-gray-400">
          <button className="hover:text-pink-600 transition-colors">
            <Camera size={20} />
          </button>
          <button className="hover:text-green-600 transition-colors">
            <Phone size={20} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default BarberPage;