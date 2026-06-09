"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/pos": "Dashboard",
  "/pos/cashier": "Kasir",
  "/pos/products": "Manajemen Produk",
  "/pos/transactions": "Riwayat Transaksi",
};

export default function PosHeader() {
  const pathname = usePathname();
  const title = titles[pathname] ?? "POS";

  const now = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        <p className="text-xs text-gray-400 capitalize">{now}</p>
      </div>
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-48">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input placeholder="Cari..." className="bg-transparent text-sm text-gray-600 outline-none w-full placeholder-gray-400" />
        </div>

        {/* Notif */}
        <button className="relative w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-yellow-50 hover:border-yellow-200 transition-colors">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-yellow-400 rounded-full border border-white" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center font-bold text-gray-900 text-sm shadow-sm">
            A
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-gray-800 leading-none">Admin</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Kasir</p>
          </div>
        </div>
      </div>
    </header>
  );
}
