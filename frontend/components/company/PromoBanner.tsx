import React from 'react';
import Link from 'next/link';

const PromoBanner = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-10 mb-8">
      <div className="relative">
        {/* Tambahkan kembali overflow-hidden agar gambar tidak keluar kotak */}
        <div
          className="rounded-2xl flex items-center pr-6 relative overflow-hidden"
          style={{ background: '#FFD53E', minHeight: '140px' }}
        >
          
          {/* Gambar Doodle Kiri - Posisinya di dalam kotak */}
          <div className="relative w-32 h-full flex-shrink-0 flex items-end justify-center">
            {/* Menggunakan h-[120px] agar gambar duduk di dasar kotak */}
            <img 
              src="/doodle.png" 
              alt="Mascot Doodle" 
              className="h-[140px] object-contain"
            />
          </div>

          {/* Teks Utama */}
          <div className="flex-1 py-3 pl-2 pr-3">
            <h2 className="text-[22px] font-black leading-[1.1] tracking-tight uppercase text-[#1a1a1a] italic">
              HARGA KAWAN<br />HASIL IDAMAN.
            </h2>
          </div>

          {/* Divider */}
          <div className="w-px h-14 bg-black/15 flex-shrink-0 mx-4" />

          {/* Harga + Tombol */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div>
              <p className="text-[10px] text-gray-600 mb-0.5">Mulai dari</p>
              <p className="text-xl font-black text-[#1a1a1a] leading-none">Rp. 35.000</p>
              <p className="text-[9px] text-gray-600 mt-1 max-w-[110px] leading-snug">
                Gak perlu mahal buat tampil maksimal
              </p>
            </div>
            <Link href="/booking">
              <button className="bg-[#1a1a1a] text-white text-[13px] font-bold px-4 py-2.5 rounded-lg whitespace-nowrap hover:scale-105 transition-transform">
                Book Sekarang →
              </button>
            </Link>
          </div>

          {/* Gambar Love Kanan */}
          <img 
            src="/love.png" 
            alt="Love Icon" 
            className="absolute bottom-0 right-0 w-20 h-20 object-contain opacity-99 pointer-events-none"
          />
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;