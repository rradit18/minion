import React from 'react';
import { MapPin, Award, Clock, Droplet } from 'lucide-react';
import SpotlightCard from '@/components/ui/SpotlightCard';

const uspItems = [
  {
    title: '4 Cabang tersebar',
    desc: 'Cabang tersedia di seluruh Tanjungpinang, semuanya siap melayani dengan performa maksimal.',
    icon: MapPin,
    color: 'text-amber-400',
    glow: 'rgba(245, 158, 11, 0.22)',
  },
  {
    title: 'Barberman Profesional',
    desc: 'Skill teruji, hasil rapi, dan siap bantu wujudin haircut sesuai ekspektasi.',
    icon: Award,
    color: 'text-teal-600',
    glow: 'rgba(20, 184, 166, 0.20)',
  },
  {
    title: 'Booking 30 Detik',
    desc: 'Booking satset, anti ribet, solusi untuk kalian yang ga mau antri lama.',
    icon: Clock,
    color: 'text-orange-500',
    glow: 'rgba(249, 115, 22, 0.20)',
  },
  {
    title: 'Produk Premium',
    desc: 'Good hair day starts here. Produk premium pilihan yang bikin rambut tetap on point',
    icon: Droplet,
    color: 'text-indigo-600',
    glow: 'rgba(99, 102, 241, 0.20)',
  },
];

const USPSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 -mt-2 pb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {uspItems.map((item, i) => (
          <SpotlightCard
            key={i}
            spotlightColor={item.glow}
            className="group rounded-2xl bg-white border border-gray-100 shadow-sm p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-200"
          >
            <div
              className={`${item.color} mb-3 inline-flex transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}
            >
              <item.icon className="w-8 h-8" strokeWidth={1.75} />
            </div>
            <h3 className="font-display font-bold text-gray-900 mb-1 text-[15px] leading-tight">
              {item.title}
            </h3>
            <p className="text-gray-500 text-[12px] leading-snug font-body">{item.desc}</p>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
};

export default USPSection;
