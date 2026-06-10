"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { getSession, clearSession } from "@/src/lib/localStorage";

const tabs = [
  { href: "/barberman-portal",         label: "Dashboard", icon: "🏠" },
  { href: "/barberman-portal/hari-ini", label: "Hari Ini",  icon: "📅" },
  { href: "/barberman-portal/jadwal",   label: "Jadwal",    icon: "🗓" },
  { href: "/barberman-portal/rating",   label: "Rating",    icon: "⭐" },
];

export default function BarbermanLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const session  = getSession();

  useEffect(() => {
    if (!session || session.role !== "barber") router.push("/login");
  }, [session, router]);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#F5EFE4]">
      <div className="bg-[#1a1a1a] text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#F9C74F] rounded-xl flex items-center justify-center font-black text-black">{session.name[0]}</div>
            <div>
              <p className="font-black text-sm leading-none">{session.name}</p>
              <p className="text-gray-400 text-[10px] mt-0.5 uppercase tracking-widest">Barberman Portal</p>
            </div>
          </div>
          <button onClick={() => { clearSession(); router.push("/"); }}
            className="text-xs text-gray-400 hover:text-white transition-colors">Keluar</button>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 overflow-x-auto">
        <div className="max-w-4xl mx-auto flex">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link key={tab.href} href={tab.href}
                className={`flex items-center gap-1.5 px-5 py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${isActive ? "border-[#F9C74F] text-[#1a1a1a]" : "border-transparent text-gray-400 hover:text-gray-700"}`}>
                <span>{tab.icon}</span>{tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
