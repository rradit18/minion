"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/src/lib/auth";
import { getToken } from "@/src/lib/auth";

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

const STATUS_META: Record<string, { label: string; cls: string; dot: string }> = {
  pending_payment:      { label: "Menunggu Pembayaran", cls: "bg-gray-50 border-gray-200 text-gray-600",   dot: "bg-gray-400" },
  pending_confirmation: { label: "Menunggu Verifikasi Kasir", cls: "bg-amber-50 border-amber-200 text-amber-700", dot: "bg-amber-500" },
  confirmed:            { label: "Dikonfirmasi ✅", cls: "bg-teal-50 border-teal-200 text-teal-700", dot: "bg-teal-500" },
  in_progress:          { label: "Sedang Berlangsung", cls: "bg-blue-50 border-blue-200 text-blue-700", dot: "bg-blue-500" },
  completed:            { label: "Selesai", cls: "bg-green-50 border-green-200 text-green-700", dot: "bg-green-500" },
  expired:              { label: "Kedaluwarsa", cls: "bg-red-50 border-red-200 text-red-600", dot: "bg-red-500" },
  cancelled:            { label: "Dibatalkan", cls: "bg-red-50 border-red-200 text-red-600", dot: "bg-red-500" },
};

const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

function SuksesInner() {
  const params = useSearchParams();
  const no = params.get("no") ?? (typeof window !== "undefined" ? sessionStorage.getItem("last_booking_no") : null);
  const [booking, setBooking] = useState<BookingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const loggedIn = typeof window !== "undefined" && !!getToken();

  useEffect(() => {
    if (!no) { setLoading(false); return; }
    let alive = true;
    const load = () => apiFetch<BookingStatus>(`/bookings/${no}`).then((r) => {
      if (alive) { setBooking(r.data); setLoading(false); }
    });
    load();
    // Poll status tiap 15 detik supaya update saat kasir memverifikasi
    const t = setInterval(load, 15000);
    return () => { alive = false; clearInterval(t); };
  }, [no]);

  const meta = booking ? (STATUS_META[booking.status] ?? STATUS_META.pending_confirmation) : null;

  const addToCalendar = () => {
    if (!booking) return;
    const start = new Date(booking.scheduled_at);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const f = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Booking Minion Barbershop`)}&dates=${f(start)}/${f(end)}&details=${encodeURIComponent(`Barber: ${booking.barber.name}\nCabang: ${booking.branch.name}\nNo. Booking: ${booking.booking_number}`)}&location=${encodeURIComponent(booking.branch.name)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-dvh bg-[#F5EFE4] flex items-center justify-center px-6 py-14">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-[#178E81] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-black text-[#1a1a1a] mb-2">Bukti Terkirim!</h1>
        {meta && (
          <span className={`inline-flex items-center gap-1.5 border text-xs font-bold px-3 py-1 rounded-full mb-4 ${meta.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${meta.dot}`} />
            {meta.label}
          </span>
        )}
        <p className="text-gray-500 text-sm mb-8">Bukti pembayaranmu sedang diverifikasi kasir. Status di halaman ini diperbarui otomatis.</p>

        {loading ? (
          <p className="text-gray-400 text-sm mb-6">Memuat status booking…</p>
        ) : !booking ? (
          <p className="text-gray-400 text-sm mb-6">Booking tidak ditemukan.</p>
        ) : (
          <div className="bg-white rounded-2xl p-6 text-left shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No. Booking</p>
              <p className="font-mono font-black text-[#178E81]">{booking.booking_number}</p>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ["Cabang", booking.branch.name],
                ["Barber", booking.barber.name],
                ["Layanan", booking.services.map((s) => s.name).join(", ")],
                ["Jadwal", new Date(booking.scheduled_at).toLocaleString("id-ID", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })],
                ["Total Bayar", fmt(booking.total_price)],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between gap-3">
                  <span className="text-gray-400 flex-shrink-0">{label}</span>
                  <span className="font-semibold text-[#1a1a1a] text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {booking && (
            <button onClick={addToCalendar}
              className="w-full bg-[#178E81] text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-colors text-sm flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Tambah ke Google Calendar
            </button>
          )}
          {loggedIn ? (
            <Link href="/akun/riwayat" className="block w-full bg-[#F9C74F] text-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors text-sm">
              Lihat Riwayat Booking
            </Link>
          ) : (
            <Link href={`/booking/status${no ? `?no=${no}` : ""}`} className="block w-full bg-[#F9C74F] text-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors text-sm">
              Lacak Status Booking
            </Link>
          )}
          <Link href="/" className="block w-full border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuksesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5EFE4]" />}>
      <SuksesInner />
    </Suspense>
  );
}
