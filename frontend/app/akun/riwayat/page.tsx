"use client";

import Link from "next/link";
import { useState } from "react";
import { getBookings, updateBooking } from "@/src/lib/localStorage";
import type { BookingData } from "@/src/lib/localStorage";

const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
const statusStyle: Record<string, string> = {
  Upcoming:    "bg-blue-100 text-blue-700",
  Selesai:     "bg-green-100 text-green-700",
  Dibatalkan:  "bg-red-100 text-red-600",
};

type Tab = "Semua" | "Upcoming" | "Selesai" | "Dibatalkan";

export default function RiwayatPage() {
  const [tab, setTab]       = useState<Tab>("Semua");
  const [bookings, setBookings] = useState<BookingData[]>(getBookings());
  const [ratingModal, setRatingModal] = useState<{ id: string; open: boolean } | null>(null);
  const [ratingVal, setRatingVal] = useState(5);
  const [ratingText, setRatingText] = useState("");

  const filtered = tab === "Semua" ? bookings : bookings.filter((b) => b.status === tab);

  const handleCancel = (id: string) => {
    if (!confirm("Batalkan booking ini?")) return;
    updateBooking(id, { status: "Dibatalkan" });
    setBookings(getBookings());
  };

  const submitRating = () => {
    if (!ratingModal) return;
    updateBooking(ratingModal.id, { rating: ratingVal, rating_comment: ratingText });
    setBookings(getBookings());
    setRatingModal(null);
    setRatingText("");
    setRatingVal(5);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-black text-[#1a1a1a]">Riwayat Booking</h2>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["Semua", "Upcoming", "Selesai", "Dibatalkan"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${tab === t ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"}`}>
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <div className="flex justify-center mb-3">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-400 font-medium">Belum ada booking {tab !== "Semua" ? tab.toLowerCase() : ""}</p>
          <Link href="/booking" className="inline-block mt-4 bg-[#F9C74F] text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-yellow-400 transition-colors">Book Sekarang</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-gray-400 truncate">{b.id}</p>
                  <p className="font-black text-[#1a1a1a] mt-1 text-sm sm:text-base">{b.service_name}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{b.barber_name} · {b.branch_name}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${statusStyle[b.status]}`}>{b.status}</span>
              </div>
              <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between text-xs sm:text-sm bg-[#F5EFE4] rounded-xl px-3 sm:px-4 py-2.5 gap-1">
                <span className="text-gray-600">{new Date(b.date).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "long", year: "numeric" })} · {b.time}</span>
                <span className="font-black text-[#1a1a1a]">{fmt(b.final_price)}</span>
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                {b.status === "Upcoming" && (
                  <>
                    <Link href={`/booking?prefill=${b.id}`}
                      className="px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                      Reschedule
                    </Link>
                    <button onClick={() => handleCancel(b.id)}
                      className="px-3 py-1.5 text-xs font-bold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                      Batalkan
                    </button>
                  </>
                )}
                {b.status === "Selesai" && !b.rating && (
                  <button onClick={() => setRatingModal({ id: b.id, open: true })}
                    className="px-3 py-1.5 text-xs font-bold bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    Beri Rating
                  </button>
                )}
                {b.status === "Selesai" && b.rating && (
                  <span className="px-3 py-1.5 text-xs font-bold bg-green-50 text-green-600 rounded-lg flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    Sudah dirating ({b.rating}/5)
                  </span>
                )}
                <Link href="/booking"
                  className="px-3 py-1.5 text-xs font-bold bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                  Booking Ulang
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rating Modal */}
      {ratingModal?.open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-black text-[#1a1a1a] mb-4">Beri Rating</h3>
            <div className="flex gap-2 justify-center mb-4">
              {[1,2,3,4,5].map((n) => (
                <button key={n} onClick={() => setRatingVal(n)}
                  className={`transition-transform hover:scale-110 ${n <= ratingVal ? "text-yellow-400" : "text-gray-200"}`}>
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </button>
              ))}
            </div>
            <textarea rows={3} placeholder="Ceritakan pengalamanmu (opsional)..." value={ratingText}
              onChange={(e) => setRatingText(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] resize-none mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setRatingModal(null)} className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">Batal</button>
              <button onClick={submitRating} className="flex-1 bg-[#F9C74F] text-black font-bold py-2.5 rounded-xl text-sm hover:bg-yellow-400">Kirim</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
