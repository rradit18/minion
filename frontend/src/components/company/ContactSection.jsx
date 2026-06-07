import { Link } from 'react-router-dom'

export default function ContactSection() {
  return (
    <section className="py-20 px-6 bg-blue-600 text-white text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Siap Memulai?</h2>
        <p className="text-blue-100 mb-8">
          Hubungi kami sekarang dan dapatkan demo gratis untuk bisnis Anda.
        </p>
        <Link
          to="/contact"
          className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors inline-block"
        >
          Hubungi Kami
        </Link>
      </div>
    </section>
  )
}
