import { formatRupiah } from '../../utils/formatRupiah'

/**
 * ProductCard — tombol produk di halaman kasir
 * Props:
 *   product  : { id, name, price }
 *   onClick  : fn(product)
 */
export default function ProductCard({ product, onClick }) {
  return (
    <button
      onClick={() => onClick(product)}
      className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-blue-400 hover:shadow-md transition-all w-full"
    >
      <p className="font-semibold text-gray-800">{product.name}</p>
      <p className="text-blue-600 font-bold mt-1">{formatRupiah(product.price)}</p>
    </button>
  )
}
