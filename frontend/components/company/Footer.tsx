"use client";

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#FCFBF7] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-12">

        {/* Kolom 1: Logo */}
        <div className="md:col-span-1">
          <img 
            src="/minion.png" 
            alt="Minion Barbershop" 
            className="h-20 w-auto mb-4 object-contain" 
          />
        </div>

        {/* Kolom 2: Connect */}
        <div>
          <h3 className="text-black font-bold mb-4">CONNECT</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li>
              <a 
                href="https://instagram.com/barbershopminion" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition">
                Instagram: @barbershopminion
              </a>
            </li>
            <li>
              <a 
                href="https://tiktok.com/@minionbarbershop"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition">
                TikTok: @minionbarbershop
              </a>
            </li>
            <li>
              <a 
                href="https://wa.me/6281260403854"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition">
                WhatsApp: 0812 - 6040 - 3854
              </a>
            </li>
          </ul>
        </div>

        {/* Kolom 3: Legal */}
        <div>
          <h3 className="text-black font-bold mb-4">LEGAL</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-[#D4AF37] transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#D4AF37] transition">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Kolom 4: Kantor Utama */}
        <div>
          <h3 className="text-black font-bold mb-4">KANTOR UTAMA</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Jl. Mangga, <br />
            Tanjungpinang, Kepulauan Riau <br />
            Open Daily 09:00 - 23:00
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
              className="w-full bg-transparent px-4 py-2 text-sm outline-none text-black"
            />
            <button className="bg-amber-400 p-2 rounded-full px-4">
              <span className="text-white font-bold">→</span>
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