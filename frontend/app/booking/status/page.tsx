"use client";

import Link from "next/link";
import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/src/lib/auth";

interface BookingStatus {
  booking_number: string;
  status: string;
  scheduled_at: string;
  customer_name: string;
  barber: { name: string };
  branch: { name: string };
  services: { name: string; price: number }[];
  total_price: number;
}

const STATUS_META: Record<string, { label: string; cls: string; dot: string; desc: string }> = {
  pending_payment:      { label: "Menunggu Pembayaran", cls: "bg-gray-50 border-gray-200 text-gray-600", dot: "bg-gray-400", desc: "Selesaikan pembayaran dan unggah bukti untuk mengamankan slot." },
  pending_confirmation: { label: "Menunggu Verifikasi Kasir", cls: "bg-amber-50 border-amber-200 text-amber-700", dot: "bg-amber-500", desc: "Bukti pembayaran sedang diperiksa kasir. Mohon tunggu sebentar." },
  confirmed:            { label: "Dikonfirmasi", cls: "bg-teal-50 border-teal-200 text-teal-700", dot: "bg-teal-500", desc: "Booking kamu sudah dikonfirmasi. Datang tepat waktu, ya!" },
  in_progress:          { label: "Sedang Berlangsung", cls: "bg-blue-50 border-blue-200 text-blue-700", dot: "bg-blue-500", desc: "Sesi kamu sedang berjalan. Nikmati layanannya!" },
  completed:            { label: "Selesai", cls: "bg-green-50 border-green-200 text-green-700", dot: "bg-green-500", desc: "Terima kasih sudah datang. Sampai jumpa lagi!" },
  expired:              { label: "Kedaluwarsa", cls: "bg-red-50 border-red-200 text-red-600", dot: "bg-red-500", desc: "Waktu pembayaran habis dan slot dilepas." },
  cancelled:            { label: "Dibatalkan", cls: "bg-red-50 border-red-200 text-red-600", dot: "bg-red-500", desc: "Booking ini telah dibatalkan." },
};

const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

function StatusInner() {
  const params = useSearchParams();
  const [input, setInput] = useState(params.get("no") ?? "");
  const [booking, setBooking] = useState<BookingStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const lookup = useCallback(async (no: string) => {
    const code = no.trim();
    if (!code) return;
    setLoading(true); setError(""); setSearched(true);
    const res = await apiFetch<BookingStatus>(`/bookings/${encodeURIComponent(code)}`);
    setLoading(false);
    if (!res.ok || !res.data) { setBooking(null); setError("Booking tidak ditemukan. Periksa kembali nomornya."); return; }
    setBooking(res.data);
  }, []);

  // Auto-lookup jika datang dengan ?no=
  useEffect(() => {
    const no = params.get("no");
    if (no) lookup(no);
  }, [params, lookup]);

  const meta = booking ? (STATUS_META[booking.status] ?? STATUS_META.pending_confirmation) : null;

  return (
    <div className="min-h-screen bg-[#F5EFE4] px-6 py-14">
      <div className="max-w-md mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#1a1a1a] transition-colors mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Beranda
        </Link>

        <h1 className="text-2xl sm:text-3xl font-black text-[#1a1a1a] mb-1">Lacak Booking</h1>
        <p className="text-gray-500 text-sm mb-6">Masukkan nomor booking untuk melihat status terbaru. Tanpa perlu login.</p>

        <form onSubmit={(e) => { e.preventDefault(); lookup(input); }} className="flex gap-2 mb-6">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="mis. BK-20260618-0001"
            className="flex-1 bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm font-mono" />
          <button type="submit" disabled={loading || !input.trim()}
            className="bg-[#1a1a1a] text-white font-bold px-5 rounded-xl text-sm hover:bg-gray-800 transition-colors disabled:opacity-40">
            {loading ? "…" : "Cek"}
          </button>
        </form>

        {error && <p className="text-red-500 text-sm font-medium mb-4">{error}</p>}

        {booking && meta && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No. Booking</p>
              <p className="font-mono font-black text-[#178E81]">{booking.booking_number}</p>
            </div>
            <div className={`border rounded-xl px-4 py-3 mb-4 ${meta.cls}`}>
              <p className="flex items-center gap-2 font-bold text-sm">
                <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                {meta.label}
              </p>
              <p className="text-xs mt-1 opacity-80">{meta.desc}</p>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ["Nama", booking.customer_name],
                ["Cabang", booking.branch.name],
                ["Barber", booking.barber.name],
                ["Layanan", booking.services.map((s) => s.name).join(", ")],
                ["Jadwal", new Date(booking.scheduled_at).toLocaleString("id-ID", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })],
                ["Total", fmt(booking.total_price)],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between gap-3">
                  <span className="text-gray-400 flex-shrink-0">{label}</span>
                  <span className="font-semibold text-[#1a1a1a] text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {searched && !booking && !error && !loading && (
          <p className="text-gray-400 text-sm text-center">Tidak ada hasil.</p>
        )}
      </div>
    </div>
  );
}

export default function BookingStatusPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5EFE4]" />}>
      <StatusInner />
    </Suspense>
  );
}
