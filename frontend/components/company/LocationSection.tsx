import React from 'react';

const locations = [
  { name: 'Jl. Pramuka', hours: '09 AM - 23 PM' },
  { name: 'Kijang Kota', hours: '09 AM - 23 PM' },
  { name: 'Bt. 9', hours: '09 AM - 23 PM' },
  { name: 'Jl. Ganet', hours: '09 AM - 23 PM' },
];

const LocationSection = () => {
  return (
    <section className="bg-[#FDF6E3] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-10 text-gray-800 tracking-wide uppercase">
          TEMUKAN STUDIO KAMI DI WILAYAH TERDEKATMU
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {locations.map((loc, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-sm text-center border border-gray-100 hover:shadow-md transition-shadow duration-300"
            >
              <h3 className="font-bold text-gray-900 mb-1">{loc.name}</h3>
              <p className="text-xs text-gray-500 font-medium">{loc.hours}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationSection;