import { useState } from 'react'
import ProductTable from '../../components/pos/ProductTable'

const initialProducts = [
  { id: 1, name: 'Kopi Americano', category: 'Minuman', price: 25000, stock: 100 },
  { id: 2, name: 'Kopi Latte', category: 'Minuman', price: 32000, stock: 80 },
  { id: 3, name: 'Teh Manis', category: 'Minuman', price: 15000, stock: 150 },
  { id: 4, name: 'Sandwich', category: 'Makanan', price: 35000, stock: 40 },
  { id: 5, name: 'Croissant', category: 'Makanan', price: 28000, stock: 30 },
]

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (product) => {
    // TODO: buka modal edit produk
    console.log('Edit:', product)
  }

  const handleDelete = (id) => {
    if (confirm('Hapus produk ini?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
    }
  }

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
        className="w-full max-w-sm border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />

      <ProductTable products={filtered} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}
