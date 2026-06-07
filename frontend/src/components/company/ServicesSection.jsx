const services = [
  {
    icon: '🛒',
    title: 'Sistem POS',
    desc: 'Kasir modern berbasis web, cepat dan mudah digunakan.',
  },
  {
    icon: '📦',
    title: 'Manajemen Stok',
    desc: 'Pantau inventaris secara real-time, hindari kehabisan stok.',
  },
  {
    icon: '📊',
    title: 'Laporan Keuangan',
    desc: 'Laporan penjualan harian, mingguan, dan bulanan secara otomatis.',
  },
  {
    icon: '👥',
    title: 'Manajemen Pelanggan',
    desc: 'Simpan data pelanggan dan riwayat transaksi mereka.',
  },
]

export default function ServicesSection() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Layanan Kami</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <div key={s.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">{s.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
