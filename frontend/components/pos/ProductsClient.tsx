"use client";

import { useState } from "react";
import ProductTable from "./ProductTable";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

const initialProducts: Product[] = [
  { id: 1, name: "Classic Cut", category: "Layanan", price: 35000, stock: 100 },
  { id: 2, name: "Fade & Taper", category: "Layanan", price: 50000, stock: 80 },
  { id: 3, name: "Beard Trim", category: "Layanan", price: 30000, stock: 150 },
  { id: 4, name: "Color Treatment", category: "Perawatan", price: 120000, stock: 40 },
  { id: 5, name: "Scalp Treatment", category: "Perawatan", price: 85000, stock: 30 },
];

export default function ProductsClient() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm("Hapus produk ini?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Produk</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          + Tambah Produk
        </button>
      </div>
      <input
        type="text"
        placeholder="Cari produk..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
      />
      <ProductTable products={filtered} onDelete={handleDelete} />
    </div>
  );
}
