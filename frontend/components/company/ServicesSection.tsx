import Link from "next/link";

const services = [
  { name: "Classic Cut", price: "Rp 35.000", desc: "Potongan klasik bersih dan rapi." },
  { name: "Fade & Taper", price: "Rp 50.000", desc: "Teknik fade presisi tinggi." },
  { name: "Beard Trim", price: "Rp 30.000", desc: "Grooming jenggot & kumis." },
  { name: "Hair Wash", price: "Rp 25.000", desc: "Keramas + perawatan rambut." },
];

export default function ServicesSection() {
  return (
    <section className="bg-[#0e0e0e] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight">
              Gaya Elit, Harga Irit
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Starting from Rp 35.000. Expert grooming doesn&apos;t have to break the bank.
            </p>
          </div>
          <Link
            href="/contact"
            className="self-start md:self-auto bg-yellow-400 text-black font-bold px-6 py-2 rounded text-sm uppercase tracking-wide hover:bg-yellow-300 transition-colors"
          >
            Book Now
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s) => (
            <div
              key={s.name}
              className="bg-[#161616] border border-white/10 rounded-xl p-5 hover:border-yellow-400/50 transition-colors group"
            >
              <div className="w-10 h-10 bg-yellow-400/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-400/20 transition-colors">
                <span className="text-yellow-400 text-lg">✂️</span>
              </div>
              <h3 className="text-white font-bold mb-1">{s.name}</h3>
              <p className="text-gray-500 text-xs mb-3 leading-relaxed">{s.desc}</p>
              <p className="text-yellow-400 font-bold text-sm">{s.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
