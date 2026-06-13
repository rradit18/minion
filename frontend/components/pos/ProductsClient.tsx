"use client";

import { useState } from "react";
import { formatRupiah } from "@/utils/formatRupiah";

interface Product { id: number; name: string; category: string; price: number; stock: number; }

type FormData = { name: string; category: string; price: string; stock: string; };
const emptyForm: FormData = { name: "", category: "Layanan", price: "", stock: "" };

const initialProducts: Product[] = [
  { id: 1, name: "Classic Cut",      category: "Layanan",   price: 35000,  stock: 999 },
  { id: 2, name: "Fade & Taper",     category: "Layanan",   price: 50000,  stock: 999 },
  { id: 3, name: "Beard Trim",       category: "Layanan",   price: 30000,  stock: 999 },
  { id: 4, name: "Color Treatment",  category: "Perawatan", price: 120000, stock: 40  },
  { id: 5, name: "Scalp Treatment",  category: "Perawatan", price: 85000,  stock: 30  },
  { id: 6, name: "Obsidian Clay",    category: "Produk",    price: 42000,  stock: 85  },
  { id: 7, name: "Pomade Light",     category: "Produk",    price: 38000,  stock: 60  },
  { id: 8, name: "Beard Oil",        category: "Produk",    price: 55000,  stock: 12  },
];

const catBadge: Record<string, string> = {
  Layanan:   "bg-yellow-100 text-yellow-700",
  Perawatan: "bg-purple-100 text-purple-700",
  Produk:    "bg-blue-100 text-blue-700",
};

const categories = ["Layanan", "Perawatan", "Produk"];

const inputCls = "w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-yellow-400 transition-colors";

// ─── Modal Komponen ───────────────────────────────────────────────────────────
function ProductModal({
  mode, form, onClose, onSave, onChange,
}: {
  mode: "tambah" | "edit";
  form: FormData;
  onClose: () => void;
  onSave: () => void;
  onChange: (f: Partial<FormData>) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{mode === "tambah" ? "Tambah Produk" : "Edit Produk"}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Nama Produk / Layanan</label>
            <input type="text" placeholder="cth: Classic Cut" value={form.name}
              onChange={(e) => onChange({ name: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Kategori</label>
            <select value={form.category} onChange={(e) => onChange({ category: e.target.value })}
              className={inputCls}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Harga (Rp)</label>
              <input type="number" placeholder="35000" value={form.price}
                onChange={(e) => onChange({ price: e.target.value })} className={inputCls} min={0} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Stok (999 = tak terbatas)</label>
              <input type="number" placeholder="999" value={form.stock}
                onChange={(e) => onChange({ stock: e.target.value })} className={inputCls} min={0} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={onClose}
            className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button onClick={onSave} disabled={!form.name || !form.price}
            className="flex-1 bg-yellow-400 text-gray-900 font-bold py-2.5 rounded-xl text-sm hover:bg-yellow-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {mode === "tambah" ? "Tambah" : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProductsClient() {
  const [products, setProducts]   = useState<Product[]>(initialProducts);
  const [search, setSearch]       = useState("");
  const [modal, setModal]         = useState<"tambah" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<number | null>(null);
  const [form, setForm]           = useState<FormData>(emptyForm);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm("Hapus produk ini?")) setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const openTambah = () => {
    setForm(emptyForm);
    setEditTarget(null);
    setModal("tambah");
  };

  const openEdit = (p: Product) => {
    setForm({ name: p.name, category: p.category, price: String(p.price), stock: String(p.stock) });
    setEditTarget(p.id);
    setModal("edit");
  };

  const handleSave = () => {
    const price = parseInt(form.price) || 0;
    const stock = parseInt(form.stock) || 0;

    if (modal === "tambah") {
      const newProduct: Product = {
        id: Date.now(),
        name: form.name,
        category: form.category,
        price,
        stock,
      };
      setProducts((prev) => [...prev, newProduct]);
    } else if (modal === "edit" && editTarget !== null) {
      setProducts((prev) =>
        prev.map((p) => p.id === editTarget ? { ...p, name: form.name, category: form.category, price, stock } : p)
      );
    }
    setModal(null);
  };

  return (
    <div className="space-y-5">
      {/* Modal */}
      {modal && (
        <ProductModal
          mode={modal}
          form={form}
          onClose={() => setModal(null)}
          onSave={handleSave}
          onChange={(f) => setForm((prev) => ({ ...prev, ...f }))}
        />
      )}

      {/* Toolbar — tidak berubah */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Cari produk..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800 shadow-sm" />
        </div>
        <button onClick={openTambah}
          className="flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-yellow-500 transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Produk
        </button>
      </div>

      {/* Table — tidak berubah */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-50">
            <tr className="bg-gray-50 text-gray-400 text-xs uppercase">
              <th className="px-5 py-3.5 text-left">Produk</th>
              <th className="px-5 py-3.5 text-left">Kategori</th>
              <th className="px-5 py-3.5 text-right">Harga</th>
              <th className="px-5 py-3.5 text-right">Stok</th>
              <th className="px-5 py-3.5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-gray-400">Tidak ada produk ditemukan</td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-yellow-50/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <span className="font-semibold text-gray-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${catBadge[p.category] ?? "bg-gray-100 text-gray-500"}`}>
                      {p.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-bold text-gray-800">{formatRupiah(p.price)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`font-bold text-sm ${p.stock < 20 ? "text-red-500" : p.stock < 50 ? "text-yellow-600" : "text-green-600"}`}>
                      {p.stock === 999 ? "∞" : p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(p)}
                        className="px-3 py-1 text-xs font-bold text-gray-700 bg-gray-100 rounded-lg hover:bg-yellow-100 hover:text-yellow-700 transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(p.id)}
                        className="px-3 py-1 text-xs font-bold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
