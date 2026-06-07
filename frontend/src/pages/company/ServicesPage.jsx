const services = [
  { title: 'Sistem POS', desc: 'Solusi kasir modern untuk bisnis Anda.' },
  { title: 'Manajemen Stok', desc: 'Kelola inventaris secara real-time.' },
  { title: 'Laporan Keuangan', desc: 'Analitik bisnis yang mudah dipahami.' },
]

export default function ServicesPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">Layanan Kami</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((s) => (
          <div key={s.title} className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{s.title}</h2>
            <p className="text-gray-500">{s.desc}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
