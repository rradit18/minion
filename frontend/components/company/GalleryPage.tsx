"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ReactCompareSliderImage } from 'react-compare-slider';
import TiltCard from '@/components/ui/TiltCard';
import EmptyState from '@/components/ui/EmptyState';

const ReactCompareSlider = dynamic(
  () => import('react-compare-slider').then((mod) => mod.ReactCompareSlider),
  { ssr: false }
);

const STATIC_GALLERY: string[] = Array.from({ length: 60 }, (_, i) =>
  `/gallery/gallery (${i + 1}).${i === 0 ? 'jpg' : i < 3 ? 'JPG' : 'png'}`
);

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
  // null = masih loading; [] = sudah load tapi kosong → empty state
  const [galleryImages, setGalleryImages] = useState<string[] | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_ROWS * COLS);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'}/gallery`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((json) => {
        const data: { image_url: string }[] = json?.data ?? [];
        setGalleryImages(data.map((g) => g.image_url));
      })
      // Backend down → pakai cadangan biar galeri nggak ompong
      .catch(() => setGalleryImages(STATIC_GALLERY));
  }, []);

  const images = galleryImages ?? [];

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + ROWS_PER_LOAD * COLS, images.length));
  };

  const handleLoadLess = () => {
    setVisibleCount(INITIAL_ROWS * COLS);
  };

  const visibleImages = images.slice(0, visibleCount);
  const hasMore = visibleCount < images.length;
  const isEmpty = galleryImages !== null && galleryImages.length === 0;

  return (
    <div 
      className="font-sans text-[#1a1a1a] min-h-screen pb-10"
      style={{
        backgroundImage: `linear-gradient(rgba(252,251,247,0.93), rgba(252,251,247,0.93)), url('/ui/pattern.png')`,
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
              backgroundImage: "url('/ui/pattern.png')",
              backgroundRepeat: "repeat"
            }}
          />

          <div className="w-full md:w-72 flex-shrink-0 relative overflow-hidden bg-[#d0c8bc] z-10">
            <ReactCompareSlider
              itemOne={<ReactCompareSliderImage src="/gallery/sebelum.jpeg" alt="Sebelum" />}
              itemTwo={<ReactCompareSliderImage src="/gallery/sesudah.jpeg" alt="Sesudah" />}
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
            <span className="hidden md:block absolute top-4 right-12 text-[#D4AF37] text-[90px] font-black opacity-20 select-none pointer-events-none">✦</span>
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
      {isEmpty ? (
        <EmptyState
          emoji="📸"
          title="Galeri masih kosong melompong"
          subtitle="Fotografernya lagi nyari angle paling cakep. Karya-karya kece bakal muncul di sini!"
        />
      ) : (
        <div className="max-w-7xl mx-auto px-6 space-y-2.5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {visibleImages.map((item, i) => (
              <GalleryCard key={i} imageUrl={item} priority={i < INITIAL_ROWS * COLS} />
            ))}
          </div>
        </div>
      )}

      {/* ── Load More / Less ── */}
      {!isEmpty && (
        <div className="max-w-7xl mx-auto px-6 pt-6 pb-12">
          {/* Progress bar + counter */}
          <div className="flex items-center justify-between mb-3 text-[12px] font-semibold text-[#999] tracking-wide">
            <span>
              {visibleCount} <span className="text-[#D4AF37]">/</span> {images.length} foto
            </span>
            <span>{Math.round((visibleCount / Math.max(images.length, 1)) * 100)}%</span>
          </div>
          <div className="w-full h-[3px] bg-[#e5e0d6] rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C9A544] to-[#D4AF37] rounded-full transition-all duration-500"
              style={{ width: `${(visibleCount / Math.max(images.length, 1)) * 100}%` }}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            {hasMore && (
              <button
                onClick={handleLoadMore}
                className="group flex items-center justify-center gap-2.5 bg-[#1a1a1a] text-white text-[13px] font-bold px-8 py-4 rounded-xl hover:bg-[#111] active:scale-[0.98] transition-all duration-150 tracking-wide shadow-md hover:shadow-lg"
              >
                <span>Tampilkan Lebih Banyak</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5"
                  fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}

            {visibleCount > INITIAL_ROWS * COLS && (
              <button
                onClick={handleLoadLess}
                className="group flex items-center justify-center gap-2.5 bg-white border-2 border-[#1a1a1a]/20 text-[#1a1a1a] text-[13px] font-bold px-8 py-4 rounded-xl hover:border-[#1a1a1a] hover:bg-[#f5f0e8] active:scale-[0.98] transition-all duration-150 tracking-wide"
              >
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5"
                  fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
                <span>Kembali ke Awal</span>
              </button>
            )}

            {!hasMore && visibleCount <= INITIAL_ROWS * COLS && (
              <p className="text-[13px] text-[#aaa] font-semibold tracking-wide text-center">
                Semua foto sudah ditampilkan ✓
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;