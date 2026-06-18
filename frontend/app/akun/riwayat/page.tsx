"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { apiFetch, firstError } from "@/src/lib/auth";
import DatePicker from "@/components/booking/DatePicker";

interface ApiBooking {
  id: string;
  booking_number: string;
  status: string;
  scheduled_at: string;
  total_price: number | string;
  barber_id?: string;
  barber?: { id: string; name: string; slug: string } | null;
  branch?: { id: string; name: string; slug: string } | null;
  services?: { service_id: string; service_name: string }[];
  reschedule_count?: number;
}

interface SlotT { time: string; datetime: string }

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

const RESCHEDULE_STATUSES = new Set(["pending_confirmation", "confirmed"]);

export default function RiwayatPage() {
  const [tab, setTab] = useState(0);
  const [bookings, setBookings] = useState<ApiBooking[] | null>(null);
  const [busy, setBusy] = useState(false);

  // Rating modal
  const [ratingModal, setRatingModal] = useState<{ id: string } | null>(null);
  const [ratingVal, setRatingVal] = useState(5);
  const [ratingText, setRatingText] = useState("");

  // Reschedule modal
  const [rescheduleModal, setRescheduleModal] = useState<{ booking: ApiBooking } | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleSlots, setRescheduleSlots] = useState<SlotT[]>([]);
  const [rescheduleSlotsLoading, setRescheduleSlotsLoading] = useState(false);

  const load = useCallback(async (q: string) => {
    setBookings(null);
    const res = await apiFetch<ApiBooking[]>(`/customer/bookings?status=${q}`);
    setBookings(res.data ?? []);
  }, []);

  useEffect(() => { load(TABS[tab].query); }, [tab, load]);

  // Muat slot saat tanggal reschedule berubah
  useEffect(() => {
    if (!rescheduleModal || !rescheduleDate) { setRescheduleSlots([]); return; }
    const { booking } = rescheduleModal;
    const barberId = booking.barber_id ?? booking.barber?.id;
    if (!barberId) return;
    const serviceIds = (booking.services ?? []).map((s) => s.service_id).filter(Boolean);
    setRescheduleSlotsLoading(true);
    setRescheduleTime("");
    const params = new URLSearchParams({ barber_id: barberId, date: rescheduleDate });
    serviceIds.forEach((id) => params.append("service_ids[]", id));
    const now = Date.now();
    apiFetch<SlotT[]>(`/availability?${params.toString()}`)
      .then((r) => {
        const list = (r.ok ? (r.data ?? []) : []).filter(
          (s) => new Date(s.datetime).getTime() > now + 60_000
        );
        setRescheduleSlots(list);
      })
      .finally(() => setRescheduleSlotsLoading(false));
  }, [rescheduleDate, rescheduleModal]);

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

  const submitReschedule = async () => {
    if (!rescheduleModal || !rescheduleDate || !rescheduleTime) return;
    const slot = rescheduleSlots.find((s) => s.time === rescheduleTime);
    if (!slot) return;
    setBusy(true);
    const res = await apiFetch(`/customer/bookings/${rescheduleModal.booking.id}/reschedule`, {
      method: "PATCH",
      body: JSON.stringify({ scheduled_at: slot.datetime }),
    });
    setBusy(false);
    if (!res.ok) { alert(firstError(res)); return; }
    setRescheduleModal(null);
    setRescheduleDate(""); setRescheduleTime(""); setRescheduleSlots([]);
    load(TABS[tab].query);
  };

  const minDate = new Date();
  const maxDate = new Date(); maxDate.setDate(maxDate.getDate() + 14);

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
            const canReschedule = RESCHEDULE_STATUSES.has(b.status) && (b.reschedule_count ?? 0) < 1;
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
                  {canReschedule && (
                    <button
                      onClick={() => { setRescheduleModal({ booking: b }); setRescheduleDate(""); setRescheduleTime(""); setRescheduleSlots([]); }}
                      className="px-3 py-1.5 text-xs font-bold bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Reschedule
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

      {/* Reschedule Modal */}
      {rescheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 py-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-[#1a1a1a]">Reschedule Booking</h3>
              <button onClick={() => setRescheduleModal(null)} className="text-gray-400 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="bg-[#F5EFE4] rounded-xl px-4 py-3 mb-4 text-sm">
              <p className="font-bold text-[#1a1a1a]">{(rescheduleModal.booking.services ?? []).map(s => s.service_name).join(", ")}</p>
              <p className="text-gray-500 text-xs mt-0.5">
                {rescheduleModal.booking.barber?.name} · Jadwal saat ini: {new Date(rescheduleModal.booking.scheduled_at).toLocaleString("id-ID", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>

            <p className="text-sm font-bold text-gray-700 mb-2">Pilih Tanggal Baru</p>
            <div className="mb-4">
              <DatePicker value={rescheduleDate} onChange={setRescheduleDate} minDate={minDate} maxDate={maxDate} />
            </div>

            {rescheduleDate && (
              <>
                <p className="text-sm font-bold text-gray-700 mb-2">Pilih Waktu</p>
                {rescheduleSlotsLoading ? (
                  <p className="text-gray-400 text-sm py-4 text-center">Mengecek ketersediaan…</p>
                ) : rescheduleSlots.length === 0 ? (
                  <p className="text-gray-400 text-sm py-4 text-center">Tidak ada slot tersedia. Coba tanggal lain.</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
                    {rescheduleSlots.map((s) => (
                      <button key={s.datetime} onClick={() => setRescheduleTime(s.time)}
                        className={`py-2 rounded-xl text-xs font-bold border-2 transition-all ${rescheduleTime === s.time ? "border-[#F9C74F] bg-yellow-50 text-[#1a1a1a]" : "border-gray-200 text-gray-600 hover:border-yellow-300"}`}>
                        {s.time}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            <div className="flex gap-3 mt-2">
              <button onClick={() => setRescheduleModal(null)} className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">Batal</button>
              <button
                onClick={submitReschedule}
                disabled={busy || !rescheduleDate || !rescheduleTime}
                className="flex-1 bg-[#178E81] text-white font-bold py-2.5 rounded-xl text-sm hover:bg-teal-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {busy ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                ) : null}
                Konfirmasi
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-3 text-center">Reschedule hanya bisa dilakukan 1x dan min. 1 jam sebelum jadwal.</p>
          </div>
        </div>
      )}
    </div>
  );
}
