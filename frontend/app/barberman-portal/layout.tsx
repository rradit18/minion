"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { getSession, clearSession } from "@/src/lib/localStorage";

const tabs = [
  { href: "/barberman-portal",          label: "Dashboard",
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { href: "/barberman-portal/hari-ini", label: "Hari Ini",
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
  { href: "/barberman-portal/jadwal",   label: "Jadwal",
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> },
  { href: "/barberman-portal/rating",   label: "Rating",
    icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
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
            <div className="w-9 h-9 bg-[#F9C74F] rounded-xl flex items-center justify-center font-black text-black">
              {session.name[0]}
            </div>
            <div>
              <p className="font-black text-sm leading-none">{session.name}</p>
              <p className="text-gray-400 text-[10px] mt-0.5 uppercase tracking-widest">Barberman Portal</p>
            </div>
          </div>
          <button onClick={() => { clearSession(); router.push("/"); }}
            className="text-xs text-gray-400 hover:text-white transition-colors">
            Keluar
          </button>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 overflow-x-auto">
        <div className="max-w-4xl mx-auto flex">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link key={tab.href} href={tab.href}
                className={`flex items-center gap-1.5 px-5 py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${isActive ? "border-[#F9C74F] text-[#1a1a1a]" : "border-transparent text-gray-400 hover:text-gray-700"}`}>
                {tab.icon}
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
