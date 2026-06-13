"use client";

import React, { useState } from "react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  desc: string;
  color: "purple" | "pink" | "cream";
  image: string;
  featured?: boolean;
}

const categories = [
  "Semua",
  "Clay & Pomade",
  "Skincare",
  "Tools & Accessories",
  "Fragrance",
  "Vitamins",
  "Grooming Kits",
];

const products: Product[] = [
  {
    id: 0,
    name: "Obsidian Clay",
    category: "Clay & Pomade",
    price: 42000,
    desc: "Our signature high-hold matte finish clay, infused with volcanic ash and sandalwood for a textured, artisan look that lasts 24 hours.",
    color: "cream",
    image: "/obsidian-clay.jpg",
    featured: true,
  },
  { id: 1, name: "Sea Salt Spray", category: "Clay & Pomade", price: 99000, desc: "Texturize alami untuk rambur bervolume.", color: "cream", image: "/sea-salt.jpg" },
  { id: 2, name: "Face Wash", category: "Skincare", price: 99000, desc: "Pembersih wajah dengan ekstrak charcoal.", color: "purple", image: "/face-wash.jpg"  },
  { id: 3, name: "Moisturizer", category: "Skincare", price: 99000, desc: "Melembapkan kulit seharian tanpa rasa lengket.", color: "pink", image: "/moisturizer.jpg" },
  { id: 4, name: "Comb Set", category: "Tools & Accessories", price: 99000, desc: "Sisir premium anti-statis", color: "cream", image: "/comb-set.jpg" },
  { id: 5, name: "Eau De Parfum", category: "Fragrance", price: 99000, desc: "Wangi maskulin yang tahan lama.", color: "purple", image: "/parfum.jpg" },
  { id: 6, name: "Hair Vitamin", category: "Vitamins", price: 99000, desc: "Nutrisi untuk akar rambut kuat.", color: "pink", image: "/hairvit.jpg" },
  { id: 7, name: "Matte Paste", category: "Clay & Pomade", price: 99000, desc: "Hasil akhir natural matte.", color: "cream", image: "/matte-paste.jpg" },
  { id: 8, name: "Travel Kit", category: "Grooming Kits", price: 99000, desc: "Paket lengkap untuk traveling.", color: "purple", image: "/travel-kit.jpg" },
  { id: 9, name: "Face Scrub", category: "Skincare", price: 99000, desc: "Eksfoliasi lembut untuk kulit fresh.", color: "pink", image: "/face-scrub.jpg" },
];

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);

const cardBg: Record<Product["color"], string> = {
  purple: "bg-[#D8D4F0]",
  pink:   "bg-[#F5C6C6]",
  cream:  "bg-[#EDE8D8]",
};

const sparkleColor: Record<Product["color"], string> = {
  purple: "text-[#7B5EA7]",
  pink:   "text-[#C0392B]",
  cream:  "text-[#7B5EA7]",
};

function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z" />
    </svg>
  );
}

function WaButton({ className = "" }: { className?: string }) {
  return (
    <a
      href="https://wa.me/6281260403854"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-800 text-xs font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-500">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.117.553 4.103 1.52 5.832L0 24l6.335-1.508A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.371l-.36-.214-3.733.888.936-3.619-.235-.372A9.818 9.818 0 1112 21.818z" />
      </svg>
      Purchase Via Whatsapp
    </a>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className={`${cardBg[product.color]} rounded-2xl p-4 flex flex-col`}>
      <div className="relative w-full aspect-square bg-white/60 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
        <Sparkle className={`absolute top-2 right-2 w-6 h-6 ${sparkleColor[product.color]}`} />
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.jpg';
          }}
        />
      </div>
      <p className="text-[11px] text-gray-500 mb-0.5 font-medium">{product.name}</p>
      <p className="text-[#C0392B] font-bold text-sm mb-1">{formatRupiah(product.price)}</p>
      <p className="text-gray-600 text-[11px] leading-relaxed mb-3 flex-1">{product.desc}</p>
      <WaButton className="w-full" />
    </div>
  );
}

export default function ProductsPageClient() {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const featured = products.find((p) => p.featured);
  const showFeatured =
    activeCategory === "Semua" || activeCategory === featured?.category;

  const gridProducts = products.filter((p) => {
    if (p.featured) return false;
    if (activeCategory === "Semua") return true;
    return p.category === activeCategory;
  });

  return (
    <div className="bg-[#FAF7EF] min-h-screen">

      {/* ── HERO ── */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
      <section className="relative overflow-hidden rounded-2xl" style={{ backgroundColor: '#2B3320' }}>
        <div className="relative px-6 py-14 md:py-20">
          
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: "url('/pattern.png')",
              backgroundRepeat: 'repeat',
              backgroundSize: 'auto',
            }}
          />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">

            {/* Left: Text */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
                Gassskeun<br />
                <span className="text-[#F9C74F]">tampil<br />lebih fresh</span>
              </h1>
              <p className="text-gray-300 text-sm leading-relaxed max-w-[280px]">
                Engineered in small batches, our grooming essentials bridge the gap between street-style
                edge and high-status luxury. No fillers, no excuses.
              </p>
            </div>

            {/* Right: Product image */}
            <div className="flex-shrink-0 w-[260px] md:w-[320px] lg:w-[380px]">
              <div className="rounded-[24px] overflow-hidden shadow-2xl aspect-[4/3] bg-[#3B4A2D]">
                <img
                  src="/product.jfif"
                  alt="Grooming Products"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scissors doodle */}
        <div className="absolute bottom-4 right-16 w-8 h-9 opacity-30 hidden md:block -rotate-[20deg]">
          <svg viewBox="0 0 40 44" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <circle cx="10" cy="34" r="6"/><circle cx="30" cy="34" r="6"/>
            <line x1="14" y1="30" x2="20" y2="10"/><line x1="26" y1="30" x2="20" y2="10"/>
          </svg>
        </div>
      </section>
      </div>

      {/* ── CATEGORY FILTER ── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full border text-sm font-medium transition-colors cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">

        {/* ── PRODUK UNGGULAN ── */}
        {featured && showFeatured && (
          <div className="mb-12">
            <h2 className="text-base font-bold text-gray-800 mb-4">Produk Unggulan</h2>
            <div
              className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8"
              style={{ backgroundColor: '#2B3320' }}
            >
              {/* Left: badge + image */}
              <div className="flex-shrink-0 flex flex-col items-start gap-3">
                <span className="bg-[#F9C74F] text-black text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                  Best Seller
                </span>
                <div className="w-44 h-36 bg-[#3B4A2D] rounded-xl overflow-hidden flex items-center justify-center">
                  <img
                    src="/obsidian-clay.jpg"
                    alt={featured.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right: info */}
              <div className="flex-1">
                <h3 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2">
                  {featured.name}
                </h3>
                <p className="text-[#F9C74F] text-3xl font-extrabold mb-4">
                  {formatRupiah(featured.price)}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-sm">
                  {featured.desc}
                </p>
                <WaButton className="border-0 px-6 py-2.5 text-sm" />
              </div>
            </div>
          </div>
        )}

        {/* ── SEMUA PRODUK ── */}
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-6">Semua Produk</h2>
          {gridProducts.length === 0 ? (
            <p className="text-gray-400 text-sm py-12 text-center">
              Tidak ada produk di kategori ini.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gridProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}