import { formatRupiah } from '../../utils/formatRupiah'

/**
 * CartPanel — panel keranjang belanja di halaman kasir
 * Props:
 *   cart        : { id, name, price, qty }[]
 *   onUpdateQty : fn(id, qty)
 *   onCheckout  : fn()
 */
export default function CartPanel({ cart, onUpdateQty, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <div className="w-72 bg-white rounded-xl border border-gray-200 p-4 flex flex-col">
      <h2 className="text-lg font-bold text-gray-800 mb-3">Keranjang</h2>

      <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
        {cart.length === 0 ? (
          <p className="text-gray-400 text-sm text-center mt-8">Belum ada item</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="flex-1 text-gray-700 truncate">{item.name}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onUpdateQty(item.id, item.qty - 1)}
                  className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 font-bold leading-none"
                  aria-label={`Kurangi ${item.name}`}
                >
                  −
                </button>
                <span className="w-5 text-center">{item.qty}</span>
                <button
                  onClick={() => onUpdateQty(item.id, item.qty + 1)}
                  className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 font-bold leading-none"
                  aria-label={`Tambah ${item.name}`}
                >
                  +
                </button>
              </div>
              <span className="text-gray-600 w-20 text-right">
                {formatRupiah(item.price * item.qty)}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-gray-200 mt-4 pt-4">
        <div className="flex justify-between text-sm font-semibold text-gray-800 mb-3">
          <span>Total</span>
          <span className="text-blue-600">{formatRupiah(total)}</span>
        </div>
        <button
          onClick={onCheckout}
          disabled={cart.length === 0}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Checkout
        </button>
      </div>
    </div>
  )
}
