"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getLastBooking } from "@/src/lib/localStorage";
import type { BookingData } from "@/src/lib/localStorage";

export default function BookingSuksesPage() {
  const [booking, setBooking] = useState<BookingData | null>(null);

  useEffect(() => { setBooking(getLastBooking()); }, []);

  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  const addToCalendar = () => {
    if (!booking) return;
    const start = new Date(`${booking.date}T${booking.time}:00`);
    const end   = new Date(start.getTime() + 60 * 60 * 1000);
    const fmt   = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Booking Minion Barbershop - ${booking.service_name}`)}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent(`Barber: ${booking.barber_name}\nCabang: ${booking.branch_name}\nNo. Booking: ${booking.id}`)}&location=${encodeURIComponent(booking.branch_name)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F5EFE4] flex items-center justify-center px-6 py-14">
      <div className="max-w-md w-full text-center">
        {/* Success icon */}
        <div className="w-20 h-20 bg-[#178E81] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-black text-[#1a1a1a] mb-2">Booking Berhasil! 🎉</h1>
        <p className="text-gray-500 text-sm mb-8">Booking kamu sudah dikonfirmasi. Sampai jumpa di Minion Barbershop!</p>

        {booking && (
          <div className="bg-white rounded-2xl p-6 text-left shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No. Booking</p>
              <p className="font-mono font-black text-[#178E81]">{booking.id}</p>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ["Cabang", booking.branch_name],
                ["Barber", booking.barber_name],
                ["Layanan", booking.service_name],
                ["Tanggal", new Date(booking.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })],
                ["Waktu", booking.time],
                ["Total Bayar", fmt(booking.final_price)],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-semibold text-[#1a1a1a]">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button onClick={addToCalendar}
            className="w-full bg-[#178E81] text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-colors text-sm flex items-center justify-center gap-2">
            📅 Tambah ke Google Calendar
          </button>
          <Link href="/akun/riwayat"
            className="block w-full bg-[#F9C74F] text-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors text-sm">
            Lihat Riwayat Booking
          </Link>
          <Link href="/"
            className="block w-full border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
