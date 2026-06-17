"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ReactCompareSliderImage } from 'react-compare-slider';
import TiltCard from '@/components/ui/TiltCard';

const ReactCompareSlider = dynamic(
  () => import('react-compare-slider').then((mod) => mod.ReactCompareSlider),
  { ssr: false }
);

const galleryImages = [
  "/gallery (1).jpg",  "/gallery (2).JPG",  "/gallery (3).JPG",
  "/gallery (4).png",  "/gallery (5).png",  "/gallery (6).png",
  "/gallery (7).png",  "/gallery (8).png",  "/gallery (9).png",
  "/gallery (10).png", "/gallery (11).png", "/gallery (12).png",
  "/gallery (13).png", "/gallery (14).png", "/gallery (15).png",
  "/gallery (16).png", "/gallery (17).png", "/gallery (18).png",
  "/gallery (19).png", "/gallery (20).png", "/gallery (21).png",
  "/gallery (22).png", "/gallery (23).png", "/gallery (24).png",
  "/gallery (25).png", "/gallery (26).png", "/gallery (27).png",
  "/gallery (28).png", "/gallery (29).png", "/gallery (30).png",
  "/gallery (31).png", "/gallery (32).png", "/gallery (33).png",
  "/gallery (34).png", "/gallery (35).png", "/gallery (36).png",
  "/gallery (37).png", "/gallery (38).png", "/gallery (39).png",
  "/gallery (40).png", "/gallery (41).png", "/gallery (42).png",
  "/gallery (43).png", "/gallery (44).png", "/gallery (45).png",
  "/gallery (46).png", "/gallery (47).png", "/gallery (48).png",
  "/gallery (49).png", "/gallery (50).png", "/gallery (51).png",
  "/gallery (52).png", "/gallery (53).png", "/gallery (54).png",
  "/gallery (55).png", "/gallery (56).png", "/gallery (57).png",
  "/gallery (58).png", "/gallery (59).png", "/gallery (60).png",
];

// 6 kolom di desktop = 1 baris, awal tampil 2 baris = 12 foto
const COLS = 6;
const ROWS_PER_LOAD = 2;
const INITIAL_ROWS = 2;

const GalleryCard = ({ imageUrl, priority }: { imageUrl: string; priority: boolean }) => (
  <TiltCard
    max={9}
    className="rounded-2xl overflow-hidden relative cursor-pointer shadow-sm hover:shadow-xl group"
    style={{ aspectRatio: '3/4' }}
  >
    <img
      src={imageUrl}
      alt="Gallery"
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
  </TiltCard>
);

const GalleryPage = () => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_ROWS * COLS);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + ROWS_PER_LOAD * COLS, galleryImages.length));
  };

  const handleLoadLess = () => {
    setVisibleCount(INITIAL_ROWS * COLS);
  };

  const visibleImages = galleryImages.slice(0, visibleCount);
  const hasMore = visibleCount < galleryImages.length;

  return (
    <div 
      className="font-sans text-[#1a1a1a] min-h-screen pb-10"
      style={{
        backgroundImage: `linear-gradient(rgba(252,251,247,0.93), rgba(252,251,247,0.93)), url('/pattern.png')`,
        backgroundSize: "cover",
        backgroundColor: "#FAF7EE",
      }}
    >
      {/* ── Header ── */}
      <motion.div
        className="max-w-7xl mx-auto px-6 pt-10 pb-8 flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-10"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div>
          <h1 className="text-[44px] font-black leading-[1.05] tracking-tight">
            PRESISI<br />
            <span className="text-[#D4AF37]">TANPA TANDING</span>
          </h1>
          <p className="italic text-[13px] font-bold tracking-[3px] text-[#7B5EA7] mt-1.5">
            GALLERY MASTERPIECE
          </p>
        </div>
        <p className="md:ml-auto text-[14px] text-[#555] leading-relaxed max-w-sm pt-1.5 md:text-right">
          Selamat datang di galeri kami. Mulai dari taper klasik hingga cornrow yang fenomenal. Galeri ini berisi masterpiece dari tangan maestro kami.
        </p>
      </motion.div>

      {/* ── Highlight Before/After Card ── */}
      <motion.div
        className="max-w-7xl mx-auto px-6 pb-7"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="bg-white rounded-2xl flex flex-col md:flex-row overflow-hidden min-h-[300px] relative shadow-sm border border-gray-100">
          
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
      </motion.div>

      {/* ── Gallery Grid ── */}
      <div className="max-w-7xl mx-auto px-6 space-y-2.5">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {visibleImages.map((item, i) => (
            <GalleryCard key={i} imageUrl={item} priority={i < INITIAL_ROWS * COLS} />
          ))}
        </div>
      </div>

      {/* ── Load More / Less ── */}
      <div className="relative text-center py-8">
        <div className="flex items-center justify-center gap-3">
          {hasMore && (
            <button
              onClick={handleLoadMore}
              className="bg-[#1a1a1a] text-white text-[13px] font-bold px-10 py-3.5 rounded-lg hover:bg-gray-800 transition tracking-wide"
            >
              Tampilkan Lebih Banyak
            </button>
          )}
          {visibleCount > INITIAL_ROWS * COLS && (
            <button
              onClick={handleLoadLess}
              className="bg-white border-2 border-[#1a1a1a] text-[#1a1a1a] text-[13px] font-bold px-10 py-3.5 rounded-lg hover:bg-gray-100 transition tracking-wide"
            >
              Tampilkan Lebih Sedikit
            </button>
          )}
          {!hasMore && visibleCount <= INITIAL_ROWS * COLS && (
            <p className="text-[13px] text-gray-400 font-semibold">Semua foto sudah ditampilkan</p>
          )}
        </div>
        <span className="absolute right-24 bottom-7 text-[#D4AF37] text-[50px] select-none">✦</span>
      </div>
    </div>
  );
};

export default GalleryPage;