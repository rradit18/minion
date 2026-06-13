"use client";

import { useState } from "react";
import { formatRupiah } from "@/utils/formatRupiah";

interface Product { id: number; name: string; category: string; price: number; }
interface CartItem extends Product { qty: number; }

// ─── Category Icons ───────────────────────────────────────────────────────────
const CategoryIcon = ({ category }: { category: string }) => {
  if (category === "Layanan") return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
    </svg>
  );
  if (category === "Perawatan") return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const products: Product[] = [
  { id: 1, name: "Classic Cut",      category: "Layanan",   price: 35000  },
  { id: 2, name: "Fade & Taper",     category: "Layanan",   price: 50000  },
  { id: 3, name: "Beard Trim",       category: "Layanan",   price: 30000  },
  { id: 4, name: "Hair Wash",        category: "Layanan",   price: 25000  },
  { id: 5, name: "Color Treatment",  category: "Perawatan", price: 120000 },
  { id: 6, name: "Scalp Treatment",  category: "Perawatan", price: 85000  },
  { id: 7, name: "Obsidian Clay",    category: "Produk",    price: 42000  },
  { id: 8, name: "Pomade Light",     category: "Produk",    price: 38000  },
  { id: 9, name: "Beard Oil",        category: "Produk",    price: 55000  },
];

const categories = ["Semua", "Layanan", "Perawatan", "Produk"];

const catAccent: Record<string, string> = {
  Layanan:   "bg-yellow-100 text-yellow-700",
  Perawatan: "bg-purple-100 text-purple-700",
  Produk:    "bg-blue-100 text-blue-700",
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CashierClient() {
  const [cart, setCart]             = useState<CartItem[]>([]);
  const [activeCategory, setActive] = useState("Semua");
  const [search, setSearch]         = useState("");

  const filtered = products.filter((p) => {
    const matchCat    = activeCategory === "Semua" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.id === product.id);
      if (ex) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: number, qty: number) => {
    if (qty < 1) setCart((prev) => prev.filter((i) => i.id !== id));
    else setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i));
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax      = Math.round(subtotal * 0.11);
  const total    = subtotal + tax;

  const handleCheckout = () => {
    if (!cart.length) return;
    alert(`Transaksi berhasil!\nTotal: ${formatRupiah(total)}`);
    setCart([]);
  };

  return (
    <div className="flex gap-5 h-[calc(100vh-7rem)]">

      {/* ── Left: Products ── */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Cari produk atau layanan..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800 shadow-sm" />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActive(cat)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all border ${activeCategory === cat ? "bg-yellow-400 text-gray-900 border-yellow-400 shadow-sm" : "bg-white border-gray-200 text-gray-500 hover:border-yellow-300 hover:text-gray-700"}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filtered.map((product) => (
              <button key={product.id} onClick={() => addToCart(product)}
                className="bg-white border border-gray-100 rounded-2xl p-4 text-left hover:border-yellow-400 hover:shadow-md transition-all group shadow-sm">
                <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-yellow-100 transition-colors text-gray-700">
                  <CategoryIcon category={product.category} />
                </div>
                <p className="font-semibold text-gray-800 text-sm leading-snug mb-2">{product.name}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catAccent[product.category] ?? "bg-gray-100 text-gray-500"}`}>
                  {product.category}
                </span>
                <p className="text-yellow-600 font-extrabold text-sm mt-2">{formatRupiah(product.price)}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Cart ── */}
      <div className="w-72 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col flex-shrink-0">
        <div className="px-5 py-4 border-b border-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Keranjang</h2>
            {cart.length > 0 && (
              <span className="w-6 h-6 bg-yellow-400 rounded-full text-xs font-bold text-gray-900 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </div>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm font-medium">Keranjang kosong</p>
              <p className="text-gray-300 text-xs mt-1">Klik produk untuk menambahkan</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-2.5">
                <div className="w-9 h-9 bg-yellow-100 rounded-lg flex items-center justify-center text-gray-700 flex-shrink-0">
                  <CategoryIcon category={item.category} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-yellow-600 font-bold">{formatRupiah(item.price)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateQty(item.id, item.qty - 1)}
                    className="w-6 h-6 rounded-lg bg-white border border-gray-200 hover:border-red-300 hover:text-red-500 text-gray-600 font-bold text-sm transition-colors shadow-sm">−</button>
                  <span className="w-5 text-center text-sm font-bold text-gray-800">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)}
                    className="w-6 h-6 rounded-lg bg-white border border-gray-200 hover:border-green-300 hover:text-green-600 text-gray-600 font-bold text-sm transition-colors shadow-sm">+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="px-5 py-4 border-t border-gray-50 space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Subtotal</span>
            <span className="font-medium text-gray-600">{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>PPN 11%</span>
            <span className="font-medium text-gray-600">{formatRupiah(tax)}</span>
          </div>
          <div className="flex justify-between font-extrabold text-gray-900 pt-2 border-t border-gray-100 text-sm">
            <span>Total</span>
            <span className="text-yellow-600">{formatRupiah(total)}</span>
          </div>
          <button onClick={handleCheckout} disabled={cart.length === 0}
            className="w-full mt-1 bg-yellow-400 text-gray-900 py-3 rounded-xl font-extrabold text-sm hover:bg-yellow-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm">
            Proses Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
}
