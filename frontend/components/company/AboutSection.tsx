const stats = [
  { icon: "📍", title: "4 Cabang Siap Layani", desc: "Strategically located across the city for your convenience." },
  { icon: "✅", title: "Barberman Bersertifikat", desc: "Highly trained and certified professionals dedicated to your experience." },
  { icon: "⚡", title: "Booking 30 Detik", desc: "The easiest digital booking experience via our app or web." },
];

export default function AboutSection() {
  return (
    <section className="bg-[#141414] py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((s) => (
          <div key={s.title} className="text-center px-4">
            <div className="text-4xl mb-4">{s.icon}</div>
            <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
