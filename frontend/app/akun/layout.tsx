"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { getSession, clearSession } from "@/src/lib/localStorage";

const tabs = [
  { href: "/akun",           label: "Dashboard", icon: "🏠" },
  { href: "/akun/riwayat",   label: "Riwayat",   icon: "📋" },
  { href: "/akun/loyalty",   label: "Loyalty",   icon: "⭐" },
  { href: "/akun/promo",     label: "Promo",      icon: "🎁" },
  { href: "/akun/profil",    label: "Profil",     icon: "👤" },
];

export default function AkunLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const session  = getSession();

  useEffect(() => {
    if (!session) router.push("/login");
  }, [session, router]);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#F5EFE4]">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Halo,</p>
            <p className="font-black text-[#1a1a1a]">{session.name} 👋</p>
          </div>
          <button
            onClick={() => { clearSession(); router.push("/"); }}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
          >
            Keluar
          </button>
        </div>
      </div>

      {/* Tab nav */}
      <div className="bg-white border-b border-gray-100 overflow-x-auto">
        <div className="max-w-4xl mx-auto flex">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link key={tab.href} href={tab.href}
                className={`flex items-center gap-1.5 px-5 py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${isActive ? "border-[#F9C74F] text-[#1a1a1a]" : "border-transparent text-gray-400 hover:text-gray-700"}`}>
                <span>{tab.icon}</span>
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
