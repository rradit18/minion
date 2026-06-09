"use client";

import { useState } from "react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  desc: string;
  color: "purple" | "pink" | "cream";
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
    featured: true,
  },
  { id: 1, name: "Products", category: "Clay & Pomade", price: 99000, desc: "Perfectly balanced serum for beard growth and rich color, finished with tobacco leaf and more.", color: "cream" },
  { id: 2, name: "Products", category: "Skincare", price: 99000, desc: "Perfectly balanced serum for beard growth and rich color, finished with tobacco leaf and more.", color: "purple" },
  { id: 3, name: "Products", category: "Skincare", price: 99000, desc: "Perfectly balanced serum for beard growth and rich color, finished with tobacco leaf and more.", color: "pink" },
  { id: 4, name: "Products", category: "Tools & Accessories", price: 99000, desc: "Perfectly balanced serum for beard growth and rich color, finished with tobacco leaf and more.", color: "cream" },
  { id: 5, name: "Products", category: "Fragrance", price: 99000, desc: "Perfectly balanced serum for beard growth and rich color, finished with tobacco leaf and more.", color: "purple" },
  { id: 6, name: "Products", category: "Vitamins", price: 99000, desc: "Perfectly balanced serum for beard growth and rich color, finished with tobacco leaf and more.", color: "pink" },
  { id: 7, name: "Products", category: "Clay & Pomade", price: 99000, desc: "Perfectly balanced serum for beard growth and rich color, finished with tobacco leaf and more.", color: "cream" },
  { id: 8, name: "Products", category: "Grooming Kits", price: 99000, desc: "Perfectly balanced serum for beard growth and rich color, finished with tobacco leaf and more.", color: "purple" },
  { id: 9, name: "Products", category: "Skincare", price: 99000, desc: "Perfectly balanced serum for beard growth and rich color, finished with tobacco leaf and more.", color: "pink" },
];

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

const cardBg: Record<Product["color"], string> = {
  purple: "bg-[#D8D4F0]",
  pink: "bg-[#F5C6C6]",
  cream: "bg-[#EDE8D8]",
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
      href="https://wa.me/62800000000"
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
      <div className="relative w-full aspect-square bg-white/50 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
        <Sparkle className="absolute top-2 right-2 w-5 h-5 text-indigo-500" />
        <span className="text-5xl select-none">🧴</span>
      </div>
      <p className="text-[11px] text-gray-500 mb-0.5">Products</p>
      <p className="text-yellow-700 font-bold text-sm mb-1">{formatRupiah(product.price)}</p>
      <p className="text-gray-600 text-[11px] leading-relaxed mb-3 flex-1">{product.desc}</p>
      <WaButton className="w-full" />
    </div>
  );
}

export default function ProductsPageClient() {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const featured = products.find((p) => p.featured);
  const showFeatured = activeCategory === "Semua" || activeCategory === featured?.category;
  const gridProducts = products.filter((p) => {
    if (p.featured) return false;
    if (activeCategory === "Semua") return true;
    return p.category === activeCategory;
  });

  return (
    <div className="bg-[#F5F2EC] min-h-screen">
      {/* Hero */}
      <section className="bg-[#2B3A2D] px-6 py-14 md:py-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
              Crafted For The{" "}
              <span className="text-yellow-400">Rebellious</span>
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
              Pioneered in small batches, our grooming tools bridge the gap between
              street‑style edge and high‑ritual luxury. No fillers, no excuses.
            </p>
          </div>
          <div className="w-52 h-40 bg-[#3B4A3D] rounded-2xl flex-shrink-0 flex items-center justify-center">
            <span className="text-6xl select-none">🧴</span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#2B3A2D] text-white border-[#2B3A2D]"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Produk Unggulan */}
        {featured && showFeatured && (
          <div className="mb-12">
            <h2 className="text-base font-bold text-gray-800 mb-4">Produk Unggulan</h2>
            <div className="bg-[#2B3A2D] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-shrink-0 flex flex-col items-center gap-4">
                <span className="bg-yellow-400 text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  Best Seller
                </span>
                <div className="w-36 h-32 bg-[#3B4A3D] rounded-xl flex items-center justify-center">
                  <span className="text-5xl select-none">🧴</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2">
                  {featured.name}
                </h3>
                <p className="text-yellow-400 text-3xl font-extrabold mb-4">
                  {formatRupiah(featured.price)}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-sm">
                  {featured.desc}
                </p>
                <WaButton className="bg-white text-gray-900 border-0 px-6 py-2.5" />
              </div>
            </div>
          </div>
        )}

        {/* Semua Produk */}
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-6">Semua Produk</h2>
          {gridProducts.length === 0 ? (
            <p className="text-gray-400 text-sm py-12 text-center">Tidak ada produk di kategori ini.</p>
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
