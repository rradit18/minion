import React from 'react';
import Link from 'next/link';

// --- Tipe data ---
const galleryColors = [
  "/gallery1.jpg", "/gallery2.png", "/gallery3.jpg",
  "/gallery4.png", "/gallery5.jpg", "/gallery6.png",
];

// --- Sub-components ---
const PersonFigure = ({ headColor, bodyColor }: { headColor: string; bodyColor: string }) => (
  <div className="absolute bottom-0 w-full flex flex-col items-center">
    <div className="rounded-full mb-[-4px] z-10" style={{ width: '42%', aspectRatio: '1', background: headColor }} />
    <div className="w-[76%] h-[36%] rounded-t-[36px]" style={{ background: bodyColor }} />
  </div>
);

// Fix 1 & 2: Tambah penutup `"` pada className, dan tutup <img> dengan />
const GalleryCard = ({ imageUrl }: { imageUrl: string }) => (
  <div className="rounded-2xl overflow-hidden relative" style={{ aspectRatio: '3/4' }}>
    <img
      src={imageUrl}
      alt=""
      className="w-full h-full object-cover" />
  </div>
);

// Fix 3: Ganti prop `item` menjadi `imageUrl` agar sesuai dengan GalleryCard
const GalleryRow = () => (
  <div className="grid grid-cols-6 gap-2.5">
    {galleryColors.map((item, i) => <GalleryCard key={i} imageUrl={item} />)}
  </div>
);

// --- Main Page ---
const GalleryPage = () => {
  return (
    <div className="bg-[#EAE6DF] font-sans text-[#1a1a1a] min-h-screen pb-10">

      {/* ── Header ── */}
      <div className="max-w-4xl mx-auto px-8 pt-10 pb-8 flex gap-10 items-start">
        <div>
          <h1 className="text-[44px] font-black leading-[1.05] tracking-tight">
            PRESISI<br />
            <span className="text-[#D4AF37]">TANPA TANDING</span>
          </h1>
          <p className="italic text-[13px] font-bold tracking-[3px] text-[#7B5EA7] mt-1.5">
            GALLERY MASTERPIECE
          </p>
        </div>
        <p className="flex-1 text-[14px] text-[#555] leading-relaxed max-w-sm pt-1.5 text-black">
          Selamat datang di galeri kami. Mulai dari taper klasik hingga cornrow yang fenomenal. Galeri ini berisi masterpiece dari tangan maestro kami.
        </p>
      </div>

      {/* ── Highlight Before/After Card ── */}
      <div className="max-w-4xl mx-auto px-8 pb-7">
        <div className="bg-white rounded-2xl flex overflow-hidden min-h-[300px] relative">
          <div className="absolute inset-0 z-0 opacity-[10] pointer-events-none"
          style={{
            backgroundImage: "url('/pattern.png')",
            backgroundRepeat: "repeat"
          }}
        />

          {/* Foto split */}
          <div className="w-72 flex-shrink-0 relative bg-[#d0c8bc] overflow-hidden">
            <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-br from-[#c4aa80] to-[#8a7060] flex items-end justify-center">
              <PersonFigure headColor="#8a6a4a" bodyColor="#c9a870" />
            </div>
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-br from-[#b8c4c0] to-[#7a9090] flex items-end justify-center">
              <PersonFigure headColor="#8a6a4a" bodyColor="#dde4e0" />
            </div>
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white z-10" />
            <span className="absolute top-3.5 left-3.5 bg-[#178E81] text-white text-[10px] font-bold px-2.5 py-1 rounded-md z-20 tracking-wide">
              sebelum
            </span>
            <span className="absolute top-3.5 right-3.5 bg-[#e8e0d8] text-[#1a1a1a] text-[10px] font-bold px-2.5 py-1 rounded-md border border-[#ccc] z-20 tracking-wide">
              sesudah
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 p-8 relative overflow-hidden">
            <span className="absolute top-4 right-12 text-[#D4AF37] text-[90px] font-black">✦</span>
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
                <span 
                  key={t} 
                  className="bg-[#1A1A1A] text-white text-[11px] font-semibold px-4 py-1.5 rounded-md">
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

      {/* ── Filter Bar ── */}
      <div className="max-w-4xl mx-auto px-8 mb-5">
        <div className="bg-[#1a1a1a] rounded-lg flex items-center px-2 gap-1">
          {['Side part', 'Low taper', 'Perm'].map(f => (
            <button key={f} className="text-white/70 hover:text-white text-[13px] font-semibold px-4 py-3 transition">
              {f}
            </button>
          ))}
          <button className="ml-auto bg-[#D4AF37] text-[#1a1a1a] text-[13px] font-bold px-6 py-2 rounded-md my-1.5 hover:bg-yellow-400 transition">
            Filter
          </button>
        </div>
      </div>

      {/* ── Gallery Grid ── */}
      <div className="max-w-4xl mx-auto px-8 space-y-2.5">
        <GalleryRow />
        <GalleryRow />
        <GalleryRow />
      </div>

      {/* ── Lihat Semua ── */}
      <div className="relative text-center py-8">
        <button className="bg-[#1a1a1a] text-white text-[13px] font-bold px-10 py-3.5 rounded-lg hover:bg-gray-800 transition tracking-wide">
          - Lihat Semua -
        </button>
        <span className="absolute right-24 bottom-7 text-[#D4AF37] text-[32px]">✦</span>
      </div>
    </div>
  );
};

export default GalleryPage;