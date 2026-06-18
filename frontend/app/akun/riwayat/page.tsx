"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { apiFetch, firstError } from "@/src/lib/auth";

interface ApiBooking {
  id: string;
  booking_number: string;
  status: string;
  scheduled_at: string;
  total_price: number | string;
  barber?: { name: string } | null;
  branch?: { name: string } | null;
  services?: { service_name: string }[];
}

const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const STATUS_META: Record<string, { label: string; cls: string }> = {
  pending_payment:      { label: "Menunggu Pembayaran", cls: "bg-gray-100 text-gray-600" },
  pending_confirmation: { label: "Menunggu Verifikasi", cls: "bg-amber-100 text-amber-700" },
  confirmed:            { label: "Dikonfirmasi", cls: "bg-teal-100 text-teal-700" },
  in_progress:          { label: "Berlangsung", cls: "bg-blue-100 text-blue-700" },
  completed:            { label: "Selesai", cls: "bg-green-100 text-green-700" },
  expired:              { label: "Kedaluwarsa", cls: "bg-red-100 text-red-600" },
  cancelled:            { label: "Dibatalkan", cls: "bg-red-100 text-red-600" },
};

const TABS: { label: string; query: string }[] = [
  { label: "Semua", query: "all" },
  { label: "Akan Datang", query: "upcoming" },
  { label: "Selesai", query: "completed" },
  { label: "Dibatalkan", query: "cancelled" },
];

export default function RiwayatPage() {
  const [tab, setTab] = useState(0);
  const [bookings, setBookings] = useState<ApiBooking[] | null>(null);
  const [ratingModal, setRatingModal] = useState<{ id: string } | null>(null);
  const [ratingVal, setRatingVal] = useState(5);
  const [ratingText, setRatingText] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (q: string) => {
    setBookings(null);
    const res = await apiFetch<ApiBooking[]>(`/customer/bookings?status=${q}`);
    setBookings(res.data ?? []);
  }, []);

  useEffect(() => { load(TABS[tab].query); }, [tab, load]);

  const handleCancel = async (id: string) => {
    if (!confirm("Batalkan booking ini?")) return;
    setBusy(true);
    const res = await apiFetch(`/customer/bookings/${id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) { alert(firstError(res)); return; }
    load(TABS[tab].query);
  };

  const submitRating = async () => {
    if (!ratingModal) return;
    setBusy(true);
    const res = await apiFetch(`/customer/bookings/${ratingModal.id}/rate`, {
      method: "POST",
      body: JSON.stringify({ stars: ratingVal, comment: ratingText || undefined, is_anonymous: false }),
    });
    setBusy(false);
    if (!res.ok) { alert(firstError(res)); return; }
    setRatingModal(null); setRatingText(""); setRatingVal(5);
    load(TABS[tab].query);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-[#1a1a1a]">Riwayat Booking</h2>
        <Link href="/booking" className="text-xs font-bold text-[#178E81] hover:underline">+ Booking Baru</Link>
      </div>

      <div className="flex gap-2 flex-wrap">
        {TABS.map((t, i) => (
          <button key={t.query} onClick={() => setTab(i)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${tab === i ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {bookings === null ? (
        <p className="text-gray-400 text-sm py-12 text-center">Memuat riwayat…</p>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <div className="flex justify-center mb-3">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-400 font-medium">Belum ada booking di kategori ini.</p>
          <Link href="/booking" className="inline-block mt-4 bg-[#F9C74F] text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-yellow-400 transition-colors">Book Sekarang</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const meta = STATUS_META[b.status] ?? { label: b.status, cls: "bg-gray-100 text-gray-600" };
            const services = (b.services ?? []).map((s) => s.service_name).join(", ");
            return (
              <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-gray-400 truncate">{b.booking_number}</p>
                    <p className="font-black text-[#1a1a1a] mt-1 text-sm sm:text-base">{services || "Layanan"}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{b.barber?.name ?? "-"} · {b.branch?.name ?? "-"}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${meta.cls}`}>{meta.label}</span>
                </div>
                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between text-xs sm:text-sm bg-[#F5EFE4] rounded-xl px-3 sm:px-4 py-2.5 gap-1">
                  <span className="text-gray-600">{new Date(b.scheduled_at).toLocaleString("id-ID", { weekday: "short", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</span>
                  <span className="font-black text-[#1a1a1a]">{fmt(Number(b.total_price))}</span>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {b.status === "pending_confirmation" && (
                    <button onClick={() => handleCancel(b.id)} disabled={busy}
                      className="px-3 py-1.5 text-xs font-bold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50">
                      Batalkan
                    </button>
                  )}
                  {b.status === "completed" && (
                    <button onClick={() => setRatingModal({ id: b.id })}
                      className="px-3 py-1.5 text-xs font-bold bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      Beri Rating
                    </button>
                  )}
                  <Link href="/booking" className="px-3 py-1.5 text-xs font-bold bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    Booking Ulang
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rating Modal */}
      {ratingModal && (
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
              <button onClick={submitRating} disabled={busy} className="flex-1 bg-[#F9C74F] text-black font-bold py-2.5 rounded-xl text-sm hover:bg-yellow-400 disabled:opacity-50">Kirim</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
