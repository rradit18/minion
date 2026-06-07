const services = [
  { name: "Classic Cut", price: "Rp 35.000", desc: "Potongan klasik bersih dan rapi." },
  { name: "Fade & Taper", price: "Rp 50.000", desc: "Teknik fade presisi tinggi." },
  { name: "Beard Trim", price: "Rp 30.000", desc: "Grooming jenggot & kumis." },
  { name: "Hair Wash", price: "Rp 25.000", desc: "Keramas + perawatan rambut." },
  { name: "Color Treatment", price: "Rp 120.000", desc: "Pewarnaan rambut profesional." },
  { name: "Scalp Treatment", price: "Rp 85.000", desc: "Perawatan kulit kepala intensif." },
];

export default function ServicesPage() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-extrabold text-white mb-2 uppercase tracking-tight">
        Layanan Kami
      </h1>
      <div className="w-12 h-0.5 bg-yellow-400 mb-10" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s) => (
          <div
            key={s.name}
            className="bg-[#161616] border border-white/10 rounded-xl p-6 hover:border-yellow-400/50 transition-colors"
          >
            <h2 className="text-white font-bold text-lg mb-1">{s.name}</h2>
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">{s.desc}</p>
            <p className="text-yellow-400 font-bold">{s.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
