"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSession } from "@/src/lib/localStorage";
import { apiFetch } from "@/src/lib/auth";

const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

interface ApiBooking {
  id: string; booking_number: string; status: string; scheduled_at: string; total_price: number | string;
  barber?: { name: string } | null; branch?: { name: string } | null; services?: { service_name: string }[];
}

const ScissorsIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
  </svg>
);

export default function AkunPage() {
  const session = typeof window !== "undefined" ? getSession() : null;
  const [upcoming, setUpcoming] = useState<ApiBooking[]>([]);
  const [punches, setPunches] = useState(0);

  useEffect(() => {
    apiFetch<ApiBooking[]>("/customer/bookings?status=upcoming").then((r) => setUpcoming(r.data ?? []));
    apiFetch<{ punch_count: number }>("/customer/loyalty").then((r) => setPunches(r.data?.punch_count ?? 0));
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <div className="bg-[#1a1a1a] rounded-2xl p-5 sm:p-6 flex items-center justify-between overflow-hidden relative">
        <div className="min-w-0 pr-16">
          <p className="text-[#F9C74F] text-xs font-bold uppercase tracking-widest mb-1">Member</p>
          <h2 className="text-xl sm:text-2xl font-black text-white truncate">{session?.name ?? "Pelanggan"}</h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1 truncate">{session?.phone ?? session?.email ?? ""}</p>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10">
          <svg className="w-20 h-20" fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
          </svg>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Booking Aktif</p>
          <p className="text-2xl sm:text-3xl font-black text-[#1a1a1a]">{upcoming.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Loyalty Punch</p>
          <p className="text-2xl sm:text-3xl font-black text-[#F9C74F]">{punches}/10</p>
        </div>
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 col-span-2 sm:col-span-1">
          <p className="text-xs text-gray-400 mb-1">Status</p>
          <p className="text-base sm:text-lg font-black text-[#178E81] flex items-center gap-1.5">
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
            <h3 className="font-black text-[#1a1a1a]">Booking Aktif</h3>
            <Link href="/akun/riwayat" className="text-xs text-[#F9C74F] font-semibold hover:underline">Lihat Semua →</Link>
          </div>
          <div className="space-y-3">
            {upcoming.slice(0, 3).map((b) => (
              <div key={b.id} className="flex items-center gap-3 sm:gap-4 bg-[#F5EFE4] rounded-xl p-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F9C74F] rounded-xl flex items-center justify-center flex-shrink-0">
                  <ScissorsIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1a1a1a] text-sm truncate">{(b.services ?? []).map((s) => s.service_name).join(", ") || "Layanan"}</p>
                  <p className="text-xs text-gray-500 truncate">{b.barber?.name ?? "-"} · {b.branch?.name ?? "-"}</p>
                  <p className="text-xs text-[#178E81] font-semibold mt-0.5">{new Date(b.scheduled_at).toLocaleString("id-ID", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <p className="text-xs sm:text-sm font-black text-[#1a1a1a] flex-shrink-0">{fmt(Number(b.total_price))}</p>
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
