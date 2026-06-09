import React from 'react';

const services = [
  {
    title: 'Haircut',
    desc: 'Potongan rambut presisi yang disesuaikan dengan bentuk wajahmu.',
    icon: '✂️',
  },
  {
    title: 'Hair Coloring',
    desc: 'Tampil berani dengan pilihan warna premium yang tahan lama.',
    icon: '🎨',
  },
  {
    title: 'Beard Treatment',
    desc: 'Perawatan jenggot agar rapi, lembut, dan tampak maskulin.',
    icon: '🧔',
  },
  {
    title: 'Hair Wash',
    desc: 'Relaksasi total dengan pijatan kepala dan produk kualitas salon.',
    icon: '🚿',
  },
];

const ServicesSection = () => {
  return (
    <section className="py-20 bg-[#FCFBF7] px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Layanan Kami
          </h2>
          <p className="text-[#555] max-w-2xl mx-auto">
            Kami menyediakan berbagai layanan grooming profesional untuk memastikan kamu tampil percaya diri setiap saat.
          </p>
        </div>

        {/* Grid Kartu Layanan */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="text-4xl mb-6">{service.icon}</div>
              <h3 className="text-xl font-bold text-black mb-3">{service.title}</h3>
              <p className="text-[#555] text-sm leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;