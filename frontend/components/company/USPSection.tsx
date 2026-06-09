import React from 'react';
import { MapPin, Award, Clock, Droplet } from 'lucide-react';

const uspItems = [
  { 
    title: '4 Cabang Siap Layani', 
    desc: 'Strategically located across the city for your convenience',
    icon: MapPin,
    color: 'text-amber-400' 
  },
  { 
    title: 'Barberman Bersertifikat', 
    desc: 'Highly trained professionals dedicated to your style evolution',
    icon: Award,
    color: 'text-teal-600' 
  },
  { 
    title: 'Booking 30 Detik', 
    desc: 'Frictionless digital booking experience via our app or web.',
    icon: Clock,
    color: 'text-orange-500' 
  },
  { 
    title: 'Produk Premium', 
    desc: 'We only use high quality products for the best results.',
    icon: Droplet, // Menggunakan Droplet untuk merepresentasikan botol
    color: 'text-indigo-600' 
  },
];

const USPSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-12">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 grid md:grid-cols-4 gap-6">
        {uspItems.map((item, i) => (
          <div key={i} className="flex gap-4">
            <div className={`mt-1 ${item.color}`}>
              <item.icon className="w-10 h-10" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-tight">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default USPSection;