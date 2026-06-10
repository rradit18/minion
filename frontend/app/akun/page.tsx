"use client";

import Link from "next/link";
import { getSession, getUpcomingBookings, getLoyaltyPunches } from "@/src/lib/localStorage";

const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

export default function AkunPage() {
  const session  = getSession();
  const upcoming = getUpcomingBookings();
  const punches  = getLoyaltyPunches();

  if (!session) return null;

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 flex items-center justify-between overflow-hidden relative">
        <div>
          <p className="text-[#F9C74F] text-xs font-bold uppercase tracking-widest mb-1">Member</p>
          <h2 className="text-2xl font-black text-white">{session.name}</h2>
          <p className="text-gray-400 text-sm mt-1">{session.email}</p>
        </div>
        <div className="text-white/10 text-8xl select-none absolute right-6">💈</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Booking Upcoming</p>
          <p className="text-3xl font-black text-[#1a1a1a]">{upcoming.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Loyalty Punch</p>
          <p className="text-3xl font-black text-[#F9C74F]">{punches}/10</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 col-span-2 md:col-span-1">
          <p className="text-xs text-gray-400 mb-1">Status</p>
          <p className="text-lg font-black text-[#178E81]">{punches >= 10 ? "🏆 Reward Ready!" : "🌟 Active Member"}</p>
        </div>
      </div>

      {/* Upcoming booking */}
      {upcoming.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-[#1a1a1a]">Booking Upcoming</h3>
            <Link href="/akun/riwayat" className="text-xs text-[#F9C74F] font-semibold hover:underline">Lihat Semua →</Link>
          </div>
          <div className="space-y-3">
            {upcoming.slice(0, 3).map((b) => (
              <div key={b.id} className="flex items-center gap-4 bg-[#F5EFE4] rounded-xl p-3">
                <div className="w-12 h-12 bg-[#F9C74F] rounded-xl flex items-center justify-center text-xl flex-shrink-0">✂️</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1a1a1a] text-sm">{b.service_name}</p>
                  <p className="text-xs text-gray-500">{b.barber_name} · {b.branch_name}</p>
                  <p className="text-xs text-[#178E81] font-semibold mt-0.5">{new Date(b.date).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })} · {b.time}</p>
                </div>
                <p className="text-sm font-black text-[#1a1a1a] flex-shrink-0">{fmt(b.final_price)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/booking" className="bg-[#F9C74F] rounded-2xl p-5 text-center hover:bg-yellow-400 transition-colors">
          <p className="text-3xl mb-2">📅</p>
          <p className="font-black text-[#1a1a1a] text-sm">Booking Sekarang</p>
        </Link>
        <Link href="/akun/loyalty" className="bg-white border border-gray-100 rounded-2xl p-5 text-center hover:bg-gray-50 transition-colors">
          <p className="text-3xl mb-2">⭐</p>
          <p className="font-black text-[#1a1a1a] text-sm">Loyalty Card</p>
        </Link>
      </div>
    </div>
  );
}
