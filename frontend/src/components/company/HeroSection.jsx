import { Link } from 'react-router-dom'

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Solusi Bisnis Modern <br /> untuk Usaha Anda
        </h1>
        <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
          Kelola penjualan, stok, dan laporan keuangan dengan sistem POS terpadu yang mudah digunakan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/pos"
            className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Coba Sekarang
          </Link>
          <Link
            to="/services"
            className="border border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Lihat Layanan
          </Link>
        </div>
      </div>
    </section>
  )
}
