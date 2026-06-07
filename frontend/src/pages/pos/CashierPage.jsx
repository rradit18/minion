import { useState } from 'react'
import ProductCard from '../../components/pos/ProductCard'
import CartPanel from '../../components/pos/CartPanel'
import { formatRupiah } from '../../utils/formatRupiah'

const sampleProducts = [
  { id: 1, name: 'Kopi Americano', price: 25000 },
  { id: 2, name: 'Kopi Latte', price: 32000 },
  { id: 3, name: 'Teh Manis', price: 15000 },
  { id: 4, name: 'Jus Jeruk', price: 20000 },
  { id: 5, name: 'Sandwich', price: 35000 },
  { id: 6, name: 'Croissant', price: 28000 },
]

export default function CashierPage() {
  const [cart, setCart] = useState([])

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const updateQty = (id, qty) => {
    if (qty < 1) {
      setCart((prev) => prev.filter((item) => item.id !== id))
    } else {
      setCart((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)))
    }
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const handleCheckout = () => {
    if (cart.length === 0) return
    // TODO: POST ke backend API
    alert(`Checkout berhasil! Total: ${formatRupiah(total)}`)
    setCart([])
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Daftar produk */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Kasir</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} product={product} onClick={addToCart} />
          ))}
        </div>
      </div>

      {/* Keranjang */}
      <CartPanel cart={cart} onUpdateQty={updateQty} onCheckout={handleCheckout} />
    </div>
  )
}
