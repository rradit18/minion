import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#FCFBF7] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-12">

        {/* Kolom 1: Logo */}
        <div className="md:col-span-1">
          <img src="/barber-pole-icon.png" alt="Minion Barbershop" className="h-20 mb-4" />
          <h2 className="font-bold text-xl">Minion</h2>
          <p className="text-sm">— BARBERSHOP</p>
        </div>

        {/* Kolom 2: Connect */}
        <div>
          <h3 className="text-black font-bold mb-4">CONNECT</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#">Instagram</a></li>
            <li><a href="#">TikTok</a></li>
            <li><a href="#">WhatsApp Business</a></li>
          </ul>
        </div>

        {/* Kolom 3: Legal */}
        <div>
          <h3 className="text-black font-bold mb-4">LEGAL</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Kolom 4: Kantor Utama */}
        <div>
          <h3 className="text-black font-bold mb-4">KANTOR UTAMA</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Available at Jl. Mangga, <br />
            Tanjungpinang, Kepulauan Riau <br />
            Open Daily 09 AM - 23 PM
          </p>
        </div>

        {/* Kolom 5: Stay Updated */}
        <div>
          <h3 className="text-black font-bold mb-4">STAY UPDATED</h3>
          <p className="text-sm text-gray-600 mb-4">Dapatkan promo & info terbaru langsung di email anda.</p>
          <div className="flex bg-white rounded-full p-1 border border-gray-200">
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-transparent px-4 py-2 text-sm outline-none"
            />
            <button className="bg-amber-400 p-2 rounded-full">
              <span className="text-white">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-200 text-center text-xs text-gray-500">
        © 2026 Minion Barbershop. Elite Craftsmanship. Digital Rebellion
      </div>
    </footer>
  );
};

export default Footer;