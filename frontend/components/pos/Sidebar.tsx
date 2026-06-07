"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarLinks = [
  { href: "/pos", label: "Dashboard", exact: true },
  { href: "/pos/cashier", label: "Kasir", exact: false },
  { href: "/pos/products", label: "Produk", exact: false },
  { href: "/pos/transactions", label: "Transaksi", exact: false },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <Link href="/pos" className="text-lg font-bold text-blue-600">
          Minion POS
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-gray-200">
        <Link
          href="/"
          className="block px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors"
        >
          ← Kembali ke Website
        </Link>
      </div>
    </aside>
  );
}
