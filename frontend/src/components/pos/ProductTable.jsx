import { formatRupiah } from '../../utils/formatRupiah'

/**
 * ProductTable — tabel daftar produk
 * Props:
 *   products  : { id, name, category, price, stock }[]
 *   onEdit    : fn(product)
 *   onDelete  : fn(id)
 */
export default function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">Nama Produk</th>
            <th className="px-4 py-3 text-left">Kategori</th>
            <th className="px-4 py-3 text-right">Harga</th>
            <th className="px-4 py-3 text-right">Stok</th>
            <th className="px-4 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                Tidak ada produk ditemukan
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">{p.category}</td>
                <td className="px-4 py-3 text-right text-gray-700">{formatRupiah(p.price)}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-semibold ${p.stock < 50 ? 'text-red-500' : 'text-green-600'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onEdit?.(p)}
                    className="text-blue-600 hover:underline text-xs mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete?.(p.id)}
                    className="text-red-500 hover:underline text-xs"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
