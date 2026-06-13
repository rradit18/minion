"use client";

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Fix Hydration Error dengan dynamic import (ssr: false)
const ReactCompareSlider = dynamic(
  () => import('react-compare-slider').then((mod) => mod.ReactCompareSlider),
  { ssr: false }
);
const ReactCompareSliderImage = dynamic(
  () => import('react-compare-slider').then((mod) => mod.ReactCompareSliderImage),
  { ssr: false }
);

const galleryImages = [
  "/gallery1.jpg", "/gallery2.png", "/gallery3.jpg",
  "/gallery4.png", "/gallery5.jpg", "/gallery6.png",
];

const GalleryCard = ({ imageUrl }: { imageUrl: string }) => (
  <div className="rounded-2xl overflow-hidden relative" style={{ aspectRatio: '3/4' }}>
    <img src={imageUrl} alt="Gallery" className="w-full h-full object-cover" />
  </div>
);

const GalleryRow = () => (
  <div className="grid grid-cols-6 gap-2.5">
    {galleryImages.map((item, i) => <GalleryCard key={i} imageUrl={item} />)}
  </div>
);

const GalleryPage = () => {
  return (
    <div 
      className="font-sans text-[#1a1a1a] min-h-screen pb-10"
      style={{
        // Background disamakan dengan BranchesPage
        backgroundImage: `linear-gradient(rgba(252,251,247,0.93), rgba(252,251,247,0.93)), url('/images/barber-pattern.png')`,
        backgroundSize: "cover",
        backgroundColor: "#FCFBF7",
      }}
    >
      {/* ── Header ── */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-8 flex flex-col md:flex-row gap-10 items-start">
        <div>
          <h1 className="text-[44px] font-black leading-[1.05] tracking-tight">
            PRESISI<br />
            <span className="text-[#D4AF37]">TANPA TANDING</span>
          </h1>
          <p className="italic text-[13px] font-bold tracking-[3px] text-[#7B5EA7] mt-1.5">
            GALLERY MASTERPIECE
          </p>
        </div>
        <p className="ml-auto text-[14px] text-[#555] leading-relaxed max-w-sm pt-1.5 text-right">
          Selamat datang di galeri kami. Mulai dari taper klasik hingga cornrow yang fenomenal. Galeri ini berisi masterpiece dari tangan maestro kami.
        </p>
      </div>

      {/* ── Highlight Before/After Card ── */}
      <div className="max-w-7xl mx-auto px-6 pb-7">
        <div className="bg-white rounded-2xl flex flex-col md:flex-row overflow-hidden min-h-[300px] relative shadow-sm border border-gray-100">
          
          {/* Pattern Background tetap ada di dalam kotak */}
          <div className="absolute inset-0 z-0 opacity-[5] pointer-events-none"
            style={{
              backgroundImage: "url('/pattern.png')",
              backgroundRepeat: "repeat"
            }}
          />

          <div className="w-full md:w-72 flex-shrink-0 relative overflow-hidden bg-[#d0c8bc] z-10">
            <ReactCompareSlider
              itemOne={<ReactCompareSliderImage src="/sebelum.jpeg" alt="Sebelum" />}
              itemTwo={<ReactCompareSliderImage src="/sesudah.jpeg" alt="Sesudah" />}
              className="h-full min-h-[300px]"
            />
            <span className="absolute top-3.5 left-3.5 bg-[#178E81] text-white text-[10px] font-bold px-2.5 py-1 rounded-md z-20 tracking-wide pointer-events-none">
              sebelum
            </span>
            <span className="absolute top-3.5 right-3.5 bg-[#e8e0d8] text-[#1a1a1a] text-[10px] font-bold px-2.5 py-1 rounded-md border border-[#ccc] z-20 tracking-wide pointer-events-none">
              sesudah
            </span>
          </div>

          <div className="flex-1 p-8 relative z-10">
            <span className="absolute top-4 right-12 text-[#D4AF37] text-[90px] font-black opacity-20 select-none">✦</span>
            <h2 className="text-[28px] font-black leading-tight mb-1">
              Transformasi Khas<br />
              <span className="text-[#D4AF37]">Minion</span>
            </h2>
            <p className="text-[13px] text-[#555] leading-relaxed max-w-xs mt-3 mb-4">
              Buat lo yang gak mau tampil biasa aja. Potongan presisi, treatment premium, dan barber profesional yang siap ngasih look terbaik sesuai style lo.
            </p>
            <p className="text-[11px] font-extrabold tracking-[1.5px] text-[#D4AF37] mb-2">
              BENEFIT UTAMA:
            </p>
            <div className="flex gap-1.5 flex-wrap mb-5">
              {['Cukur', 'Pijat', 'Handuk Panas', 'Bebas Tunggu'].map(t => (
                <span key={t} className="bg-[#1A1A1A] text-white text-[11px] font-semibold px-4 py-1.5 rounded-md">
                  {t}
                </span>
              ))}
            </div>
            <Link href="/booking">
              <button className="bg-[#D4AF37] text-[#1a1a1a] font-bold text-[14px] px-7 py-3 rounded-lg hover:bg-yellow-400 transition">
                Book Sekarang
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-2.5">
        <GalleryRow />
        <GalleryRow />
        <GalleryRow />
      </div>

      <div className="relative text-center py-8">
        <button className="bg-[#1a1a1a] text-white text-[13px] font-bold px-10 py-3.5 rounded-lg hover:bg-gray-800 transition tracking-wide">
          Lihat Semua
        </button>
        <span className="absolute right-24 bottom-7 text-[#D4AF37] text-[50px] select-none">✦</span>
      </div>
    </div>
  );
};

export default GalleryPage;