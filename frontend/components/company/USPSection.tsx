import React from 'react';
import { MapPin, Award, Clock, Droplet } from 'lucide-react';

const uspItems = [
  { 
    title: '4 Cabang tersebar', 
    desc: 'Cabang tersedua di seluruh Tanjungpinang, semuanya siap melayani dengan performa maksimal.',
    icon: MapPin,
    color: 'text-amber-400' 
  },
  { 
    title: 'Barberman Profesional', 
    desc: 'Skill teruji, hasil rapi, dan siap bantu wujudin haircut sesuai ekspektasi.',
    icon: Award,
    color: 'text-teal-600' 
  },
  { 
    title: 'Booking 30 Detik', 
    desc: 'Booking satset, anti ribet, solusi untuk kalian yang ga mau antri lama.',
    icon: Clock,
    color: 'text-orange-500' 
  },
  { 
    title: 'Produk Premium', 
    desc: 'Good hair day starts here. Produk premium pilihan yang bikin rambut tetap on point',
    icon: Droplet,
    color: 'text-indigo-600' 
  },
];

const USPSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 -mt-2 pb-8">
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-5 md:divide-x divide-gray-100">
        {uspItems.map((item, i) => (
          <div key={i} className="flex gap-3 md:px-4 first:pl-0">
            <div className={`mt-0.5 ${item.color}`}>
              <item.icon className="w-8 h-8" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="font-display font-bold text-gray-900 mb-1 text-[15px] leading-tight">{item.title}</h3>
              <p className="text-gray-500 text-[12px] leading-snug font-body">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default USPSection;