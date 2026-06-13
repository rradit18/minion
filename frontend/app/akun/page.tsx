"use client";

import Link from "next/link";
import { getSession, getUpcomingBookings, getLoyaltyPunches } from "@/src/lib/localStorage";

const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const ScissorsIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
  </svg>
);

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
        {/* Barber pole icon decoration */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10">
          <svg className="w-20 h-20" fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
          </svg>
        </div>
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
          <p className="text-lg font-black text-[#178E81] flex items-center gap-1.5">
            {punches >= 10 ? (
              <>
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Reward Ready!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                Active Member
              </>
            )}
          </p>
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
                <div className="w-12 h-12 bg-[#F9C74F] rounded-xl flex items-center justify-center flex-shrink-0">
                  <ScissorsIcon />
                </div>
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
          <div className="flex justify-center mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="font-black text-[#1a1a1a] text-sm">Booking Sekarang</p>
        </Link>
        <Link href="/akun/loyalty" className="bg-white border border-gray-100 rounded-2xl p-5 text-center hover:bg-gray-50 transition-colors">
          <div className="flex justify-center mb-2">
            <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <p className="font-black text-[#1a1a1a] text-sm">Loyalty Card</p>
        </Link>
      </div>
    </div>
  );
}
