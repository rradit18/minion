"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import CartPanel from "./CartPanel";
import { formatRupiah } from "@/utils/formatRupiah";

interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartItem extends Product {
  qty: number;
}

const sampleProducts: Product[] = [
  { id: 1, name: "Classic Cut", price: 35000 },
  { id: 2, name: "Fade & Taper", price: 50000 },
  { id: 3, name: "Beard Trim", price: 30000 },
  { id: 4, name: "Hair Wash", price: 25000 },
  { id: 5, name: "Color Treatment", price: 120000 },
  { id: 6, name: "Scalp Treatment", price: 85000 },
];

export default function CashierClient() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: number, qty: number) => {
    if (qty < 1) {
      setCart((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, qty } : item))
      );
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    // TODO: POST ke backend API
    alert(`Checkout berhasil! Total: ${formatRupiah(total)}`);
    setCart([]);
  };

  return (
    <div className="flex gap-6 h-full">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Kasir</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} product={product} onClick={addToCart} />
          ))}
        </div>
      </div>
      <CartPanel cart={cart} onUpdateQty={updateQty} onCheckout={handleCheckout} />
    </div>
  );
}
