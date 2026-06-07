export default function AboutSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Tentang Kami</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Kami hadir untuk membantu pelaku usaha kecil dan menengah bertransformasi secara digital
            dengan solusi kasir dan manajemen bisnis yang simpel namun powerful.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Dengan pengalaman lebih dari 5 tahun, kami telah membantu ratusan bisnis tumbuh lebih efisien.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { num: '500+', label: 'Pengguna Aktif' },
            { num: '5 Tahun', label: 'Pengalaman' },
            { num: '99.9%', label: 'Uptime' },
            { num: '24/7', label: 'Support' },
          ].map((stat) => (
            <div key={stat.label} className="bg-blue-50 rounded-xl p-5 text-center">
              <p className="text-2xl font-bold text-blue-700">{stat.num}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
