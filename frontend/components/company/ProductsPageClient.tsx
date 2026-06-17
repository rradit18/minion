"use client";

import React, { useEffect, useState } from "react";
import SpotlightCard from "@/components/ui/SpotlightCard";

const PER_PAGE = 9;

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  desc: string;
  image: string;
  bestSeller?: boolean;
}

const categories = [
  "Semua",
  "Clay & Pomade",
  "Curl Care",
  "Styling Powder",
];

const products: Product[] = [
  { id: 0, name: "Minion Curly Cream", category: "Curl Care", price: 75000, desc: "Cream pelembap untuk mendefinisikan curl & mengurangi frizz.", image: "/CurlyCream.png", bestSeller: true },
  { id: 1, name: "Minion Hair Powder", category: "Styling Powder", price: 65000, desc: "Texturize alami untuk rambut bervolume.", image: "/HairPowder.png" },
  { id: 2, name: "Minion Pomade Vanilla", category: "Clay & Pomade", price: 75000, desc: "Pomade wangi vanilla dengan hold kuat tanpa lengket.", image: "/PomadeVanilla.png" },
  { id: 3, name: "Minion Pomade Rose", category: "Clay & Pomade", price: 75000, desc: "Pomade aroma rose lembut, mudah dibilas, tahan lama.", image: "/PomadeRose.png" },
  { id: 4, name: "Minion Pomade Ocean Blue", category: "Clay & Pomade", price: 75000, desc: "Pomade segar aroma ocean blue dengan finishing matte.", image: "/PomadeOceanBlue.png" },
  { id: 5, name: "Minion Pomade Sunkist", category: "Clay & Pomade", price: 75000, desc: "Pomade aroma jeruk sunkist, wangi maskulin tahan lama.", image: "/PomadeSunkist.png" },
];

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

const WA_LINK = "https://wa.me/6281260403854";

// ─── Icons ────────────────────────────────────────────────────────────────────
function WaIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.117.553 4.103 1.52 5.832L0 24l6.335-1.508A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.371l-.36-.214-3.733.888.936-3.619-.235-.372A9.818 9.818 0 1112 21.818z" />
    </svg>
  );
}
function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className={className}>
      <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
    </svg>
  );
}
function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}
function HeartIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-4.35-9.5-8.5C.9 9.5 2.2 6 5.5 6c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3.3 0 4.6 3.5 3 6.5C19 16.65 12 21 12 21z" />
    </svg>
  );
}

function CartIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
    </svg>
  );
}
function PlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function MinusIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className={className}>
      <path d="M5 12h14" />
    </svg>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product, onAdd, inCart }: { product: Product; onAdd: (p: Product) => void; inCart: number }) {
  return (
    <SpotlightCard
      spotlightColor="rgba(23, 142, 129, 0.1)"
      className="bg-white rounded-2xl border border-gray-100 p-3 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-200 group"
    >
      <div className="relative">
        {product.bestSeller ? (
          <span className="absolute top-2 left-2 z-10 bg-[#1a1a1a] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
            Best Seller
          </span>
        ) : (
          <span className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur text-gray-500 text-[9px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
            {product.category}
          </span>
        )}
        <button
          aria-label="Tambah ke wishlist"
          className="absolute top-2 right-2 z-10 grid place-items-center w-7 h-7 rounded-full bg-white/90 backdrop-blur text-gray-400 hover:text-[#C0392B] shadow-sm transition-colors"
        >
          <HeartIcon className="w-3.5 h-3.5" />
        </button>
        <div className="aspect-square overflow-hidden rounded-xl bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.jpg"; }}
          />
        </div>
      </div>

      <div className="pt-3 px-1 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-[#1a1a1a] leading-tight truncate">{product.name}</h3>
        <p className="text-[11px] text-gray-400 truncate mb-2">{product.desc}</p>
        <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[#1a1a1a] font-extrabold text-sm">{formatRupiah(product.price)}</span>
          <button
            type="button"
            onClick={() => onAdd(product)}
            className="inline-flex items-center justify-center gap-1.5 bg-[#1a1a1a] text-white text-[11px] font-bold px-3.5 py-2 rounded-full hover:bg-black transition-colors whitespace-nowrap"
          >
            <CartIcon className="w-3.5 h-3.5 text-[#F9C74F]" />
            {inCart > 0 ? `Keranjang (${inCart})` : "Tambah"}
          </button>
        </div>
      </div>
    </SpotlightCard>
  );
}

export default function ProductsPageClient() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"default" | "low" | "high">("default");
  const [page, setPage] = useState(1);
  // Keranjang: { [productId]: qty }
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (p: Product) => {
    setCart((c) => ({ ...c, [p.id]: (c[p.id] ?? 0) + 1 }));
    setCartOpen(true);
  };
  const changeQty = (id: number, delta: number) =>
    setCart((c) => {
      const next = (c[id] ?? 0) + delta;
      if (next <= 0) {
        const { [id]: _, ...rest } = c;
        return rest;
      }
      return { ...c, [id]: next };
    });
  const removeFromCart = (id: number) =>
    setCart((c) => {
      const { [id]: _, ...rest } = c;
      return rest;
    });

  const cartItems = Object.entries(cart).map(([id, qty]) => ({
    product: products.find((p) => p.id === Number(id))!,
    qty,
  }));
  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.product.price * i.qty, 0);

  const checkoutWhatsApp = () => {
    if (cartItems.length === 0) return;
    const lines = cartItems.map(
      (i, idx) => `${idx + 1}. ${i.product.name} (x${i.qty}) - ${formatRupiah(i.product.price * i.qty)}`
    );
    const message =
      `Halo Minion Barbershop, saya ingin memesan produk berikut:\n\n` +
      `${lines.join("\n")}\n\n` +
      `Total: ${formatRupiah(cartTotal)}\n\n` +
      `Mohon info ketersediaan & cara pemesanannya. Terima kasih!`;
    window.open(`${WA_LINK}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const query = search.trim().toLowerCase();
  const isSearching = query !== "";

  useEffect(() => { setPage(1); }, [activeCategory, search, sort]);

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "Semua" || p.category === activeCategory;
    const matchSearch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.desc.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "low") return a.price - b.price;
    if (sort === "high") return b.price - a.price;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const gridProducts = sorted.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  // Hitung jumlah produk per kategori (untuk sidebar)
  const countFor = (cat: string) =>
    cat === "Semua" ? products.length : products.filter((p) => p.category === cat).length;

  return (
    <div className="bg-[#FAF7EF] min-h-screen">

      {/* ── HERO ── */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <section className="relative overflow-hidden rounded-3xl h-[240px] sm:h-[300px] md:h-[340px]">
          <img src="/minion3.jfif" alt="Minion Barbershop" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-black/10" />
          <div className="relative z-10 h-full flex flex-col justify-center px-7 md:px-12">
            <p className="text-[#F9C74F] text-xs md:text-sm font-bold tracking-[0.25em] uppercase mb-1">Give All You Need</p>
            <h1 className="text-white font-black leading-none tracking-tight text-6xl sm:text-7xl md:text-8xl">Shop</h1>
            <p className="text-white/80 text-sm mt-3 max-w-xs">Grooming essentials pilihan, langsung dari para maestro Minion.</p>
          </div>
        </section>
      </div>

      {/* ── BODY: Sidebar + Grid ── */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">

        {/* Sidebar kategori (desktop) */}
        <aside className="hidden lg:block">
          <h3 className="text-sm font-black uppercase tracking-wide text-[#1a1a1a] mb-4">Category</h3>
          <ul className="space-y-1">
            {categories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <li key={cat}>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className="flex items-center gap-2.5 w-full text-left py-1.5 group"
                  >
                    <span className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${active ? "bg-[#1a1a1a] border-[#1a1a1a]" : "border-gray-300 group-hover:border-gray-500"}`}>
                      {active && <CheckIcon className="w-3 h-3 text-white" />}
                    </span>
                    <span className={`flex-1 text-sm ${active ? "font-semibold text-[#1a1a1a]" : "text-gray-500 group-hover:text-[#1a1a1a]"}`}>{cat}</span>
                    <span className="text-xs text-gray-300">{countFor(cat)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main */}
        <div>
          {/* Toolbar: search + sort */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-5">
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari produk, kategori..."
                className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm text-[#1a1a1a] placeholder-gray-400 outline-none focus:border-[#178E81] focus:ring-2 focus:ring-[#178E81]/15 transition"
              />
              {search && (
                <button onClick={() => setSearch("")} aria-label="Hapus pencarian" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-gray-400 whitespace-nowrap">{sorted.length} produk</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="rounded-full border border-gray-200 bg-white py-2 px-3 text-xs font-semibold text-[#1a1a1a] outline-none focus:border-[#178E81] cursor-pointer"
              >
                <option value="default">Urutkan</option>
                <option value="low">Harga: Termurah</option>
                <option value="high">Harga: Termahal</option>
              </select>
            </div>
          </div>

          {/* Kategori (mobile: horizontal chips) */}
          <div className="lg:hidden -mx-6 px-6 mb-5">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeCategory === cat ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "bg-white text-gray-600 border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {gridProducts.length === 0 ? (
            <p className="text-gray-400 text-sm py-16 text-center">
              {isSearching ? `Tidak ada produk yang cocok dengan "${search.trim()}".` : "Tidak ada produk di kategori ini."}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {gridProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onAdd={addToCart} inCart={cart[product.id] ?? 0} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    aria-label="Halaman sebelumnya"
                    className="grid place-items-center h-9 w-9 rounded-lg border border-gray-200 bg-white text-[#1a1a1a] hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      aria-current={p === currentPage ? "page" : undefined}
                      className={`h-9 min-w-9 px-3 rounded-lg text-sm font-bold transition-colors ${
                        p === currentPage ? "bg-[#1a1a1a] text-white" : "border border-gray-200 bg-white text-[#1a1a1a] hover:border-gray-400"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Halaman berikutnya"
                    className="grid place-items-center h-9 w-9 rounded-lg border border-gray-200 bg-white text-[#1a1a1a] hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Floating cart button ── */}
      {cartCount > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          aria-label="Buka keranjang"
          className="fixed bottom-6 right-6 z-40 grid place-items-center h-14 w-14 rounded-full bg-[#1a1a1a] text-white shadow-xl hover:bg-black transition-colors"
        >
          <CartIcon className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 grid place-items-center min-w-6 h-6 px-1.5 rounded-full bg-[#F9C74F] text-black text-xs font-black">
            {cartCount}
          </span>
        </button>
      )}

      {/* ── Cart drawer ── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
          <aside className="relative w-full max-w-sm bg-white h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-black text-[#1a1a1a] flex items-center gap-2">
                <CartIcon className="w-5 h-5" /> Keranjang
                {cartCount > 0 && <span className="text-xs font-bold text-gray-400">({cartCount} item)</span>}
              </h3>
              <button onClick={() => setCartOpen(false)} aria-label="Tutup keranjang" className="text-gray-400 hover:text-gray-700">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex-1 grid place-items-center text-gray-400 text-sm px-6 text-center">
                Keranjang masih kosong.<br />Tambahkan produk untuk memesan via WhatsApp.
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                  {cartItems.map(({ product, qty }) => (
                    <div key={product.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.jpg"; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-[#1a1a1a] truncate">{product.name}</h4>
                        <p className="text-xs text-gray-400">{formatRupiah(product.price)}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button onClick={() => changeQty(product.id, -1)} aria-label="Kurangi" className="grid place-items-center w-6 h-6 rounded-md border border-gray-200 text-gray-600 hover:border-gray-400">
                            <MinusIcon className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold text-[#1a1a1a] w-5 text-center">{qty}</span>
                          <button onClick={() => changeQty(product.id, 1)} aria-label="Tambah" className="grid place-items-center w-6 h-6 rounded-md border border-gray-200 text-gray-600 hover:border-gray-400">
                            <PlusIcon className="w-3 h-3" />
                          </button>
                          <button onClick={() => removeFromCart(product.id)} className="ml-auto text-xs text-red-400 hover:text-red-600 font-medium">Hapus</button>
                        </div>
                      </div>
                      <span className="text-sm font-extrabold text-[#1a1a1a] whitespace-nowrap">{formatRupiah(product.price * qty)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 px-5 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-500">Total</span>
                    <span className="text-lg font-black text-[#1a1a1a]">{formatRupiah(cartTotal)}</span>
                  </div>
                  <button
                    onClick={checkoutWhatsApp}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 rounded-xl hover:bg-[#1eba59] transition-colors"
                  >
                    <WaIcon className="w-5 h-5" />
                    Pesan via WhatsApp
                  </button>
                  <button onClick={() => setCart({})} className="w-full text-xs text-gray-400 hover:text-gray-600 font-medium">Kosongkan keranjang</button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
