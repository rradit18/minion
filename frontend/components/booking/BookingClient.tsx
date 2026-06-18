"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, firstError } from "@/src/lib/auth";
import { getSession } from "@/src/lib/localStorage";
import DatePicker from "@/components/booking/DatePicker";

// ─── Tipe dari API ──────────────────────────────────────────────────────────
interface BranchT {
  id: string; name: string; address: string; city: string;
  opening_time: string; closing_time: string; image_url: string | null;
}
interface BarberT {
  id: string; name: string; slug: string; photo_url: string | null;
  signature_color: string | null; has_shift_today: boolean;
}
interface ServiceT {
  id: string; name: string; description: string | null; duration_minutes: number; price: number;
}
interface SlotT { time: string; datetime: string }
interface BankAccount { bank_name: string; account_number: string; account_holder: string }
interface PayInfo {
  total_price: number; qris_image_url: string | null;
  bank_accounts: BankAccount[]; remaining_seconds: number; status: string;
}

const STEPS = ["Cabang", "Barber", "Layanan", "Jadwal", "Data Diri", "Konfirmasi", "Pembayaran"];

const COLOR_RING: Record<string, string> = {
  teal: "ring-teal-400", coral: "ring-orange-400", violet: "ring-purple-400", yellow: "ring-yellow-400",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
const hhmm = (t?: string | null) => (t ? String(t).slice(0, 5) : "");

// ─── Step indicator ─────────────────────────────────────────────────────────
function StepBar({ current }: { current: number }) {
  return (
    <div className="mb-8 flex justify-center">
      <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar max-w-full px-1">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-1 sm:gap-1.5">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold transition-all ${i < current ? "bg-[#178E81] text-white" : i === current ? "bg-[#F9C74F] text-black" : "bg-gray-200 text-gray-400"}`}>
                {i < current ? "✓" : i + 1}
              </div>
              <span className={`text-[9px] mt-1 hidden sm:block whitespace-nowrap ${i === current ? "text-[#1a1a1a] font-semibold" : "text-gray-400"}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`h-0.5 w-4 sm:w-6 shrink-0 sm:mb-4 ${i < current ? "bg-[#178E81]" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────
export default function BookingClient() {
  const router = useRouter();
  const session = typeof window !== "undefined" ? getSession() : null;

  const [step, setStep] = useState(0);

  // Data master
  const [branches, setBranches] = useState<BranchT[] | null>(null);
  const [barbers, setBarbers]   = useState<BarberT[]>([]);
  const [services, setServices] = useState<ServiceT[]>([]);

  // Pilihan
  const [branch, setBranch]   = useState<BranchT | null>(null);
  const [barber, setBarber]   = useState<BarberT | null>(null);
  const [service, setService] = useState<ServiceT | null>(null);
  const [date, setDate]       = useState("");
  const [time, setTime]       = useState("");
  const [preselectBarber, setPreselectBarber] = useState<string | null>(null);

  const [slots, setSlots] = useState<SlotT[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [serviceQuery, setServiceQuery] = useState("");

  const [form, setForm] = useState({ name: "", phone: "", notes: "" });
  const isPhoneValid = form.phone.length >= 10 && form.phone.length <= 20;

  // Hasil booking + pembayaran
  const [bookingNo, setBookingNo] = useState<string | null>(null);
  const [payInfo, setPayInfo]     = useState<PayInfo | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Upload bukti
  const [proofFile, setProofFile]   = useState<File | null>(null);
  const [uploading, setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState("");

  // ── Load branches + prefill ──────────────────────────────────────────────
  useEffect(() => {
    apiFetch<BranchT[]>("/branches").then((r) => setBranches(r.data ?? []));
    const key = new URLSearchParams(window.location.search).get("barber");
    if (key) setPreselectBarber(key.toLowerCase());
    const s = getSession();
    if (s) setForm((f) => ({ ...f, name: s.name, phone: (s.phone ?? "").replace(/\D/g, "") }));
  }, []);

  // ── Saat cabang dipilih: muat barber & layanan cabang ──────────────────────
  const loadBranchData = useCallback(async (b: BranchT) => {
    setBarbers([]); setServices([]);
    const [bz, sv] = await Promise.all([
      apiFetch<BarberT[]>(`/branches/${b.id}/barbers`),
      apiFetch<ServiceT[]>(`/branches/${b.id}/services`),
    ]);
    const barberList = bz.data ?? [];
    setBarbers(barberList);
    setServices(sv.data ?? []);
    // Pra-pilih barber dari ?barber=slug bila ada di cabang ini
    if (preselectBarber) {
      const match = barberList.find(
        (x) => x.slug === preselectBarber || x.name.split(" ")[0].toLowerCase() === preselectBarber,
      );
      if (match) setBarber(match);
    }
  }, [preselectBarber]);

  const selectBranch = (b: BranchT) => {
    setBranch(b); setBarber(null); setService(null); setDate(""); setTime("");
    loadBranchData(b);
  };

  // ── Muat slot saat barber + layanan + tanggal siap ────────────────────────
  useEffect(() => {
    if (step !== 3 || !barber || !service || !date) { setSlots([]); return; }
    setSlotsLoading(true); setTime("");
    const params = new URLSearchParams({ barber_id: barber.id, date });
    params.append("service_ids[]", service.id);
    apiFetch<SlotT[]>(`/availability?${params.toString()}`)
      .then((r) => {
        // Buang slot yang waktunya sudah lewat (mis. jam pagi di hari yang sama)
        const now = Date.now();
        const list = (r.ok ? (r.data ?? []) : []).filter((s) => new Date(s.datetime).getTime() > now + 5 * 60_000);
        setSlots(list);
      })
      .finally(() => setSlotsLoading(false));
  }, [step, barber, service, date]);

  // ── Countdown pembayaran (sumber waktu = server) ──────────────────────────
  useEffect(() => {
    if (step !== 6 || secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(t);
  }, [step, secondsLeft]);

  const minDate = new Date();
  const maxDate = new Date(); maxDate.setDate(maxDate.getDate() + 14);

  // ── Buat booking → pindah ke pembayaran ───────────────────────────────────
  const confirmBooking = async () => {
    if (!branch || !barber || !service) return;
    const slot = slots.find((s) => s.time === time);
    if (!slot) { setSubmitError("Slot tidak valid, pilih ulang jadwal."); setStep(3); return; }

    setSubmitting(true); setSubmitError("");
    const res = await apiFetch<{ booking_number: string }>("/bookings", {
      method: "POST",
      body: JSON.stringify({
        branch_id: branch.id,
        barber_id: barber.id,
        service_ids: [service.id],
        scheduled_at: slot.datetime,
        customer_name: form.name,
        customer_phone: form.phone,
        notes: form.notes || undefined,
      }),
    });
    setSubmitting(false);

    if (!res.ok || !res.data?.booking_number) {
      setSubmitError(firstError(res));
      return;
    }
    const no = res.data.booking_number;
    setBookingNo(no);
    // Ambil info pembayaran (QRIS, rekening, sisa waktu dari server)
    const pay = await apiFetch<PayInfo>(`/bookings/${no}/payment`);
    if (pay.ok && pay.data) {
      setPayInfo(pay.data);
      setSecondsLeft(pay.data.remaining_seconds);
    }
    setStep(6);
  };

  // ── Upload bukti pembayaran ───────────────────────────────────────────────
  const submitProof = async () => {
    if (!bookingNo || !proofFile) return;
    setUploading(true); setUploadError("");
    const fd = new FormData();
    fd.append("payment_method", "qris_external");
    fd.append("proof", proofFile);
    const res = await apiFetch<{ status: string }>(`/bookings/${bookingNo}/payment-proof`, {
      method: "POST",
      body: fd,
    });
    setUploading(false);
    if (!res.ok) { setUploadError(firstError(res)); return; }
    // Sukses → simpan no booking untuk halaman status
    sessionStorage.setItem("last_booking_no", bookingNo);
    router.push(`/booking/sukses?no=${encodeURIComponent(bookingNo)}`);
  };

  const payExpired = step === 6 && secondsLeft <= 0;
  const mmss = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;

  const filteredServices = (() => {
    const q = serviceQuery.trim().toLowerCase();
    return services.filter((s) => !q || s.name.toLowerCase().includes(q) || (s.description ?? "").toLowerCase().includes(q));
  })();

  return (
    <div className="relative min-h-screen py-10 px-4 sm:px-6">
      <div aria-hidden className="fixed inset-0 -z-10 bg-[#F5EFE4]" />
      <div aria-hidden className="fixed inset-0 -z-10 bg-[url('/ui/pattern.png')] bg-repeat opacity-[0.45]"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.15) 100%)",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.15) 100%)",
        }} />

      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#1a1a1a] transition-colors mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Beranda
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1a1a1a] text-center mb-2">Booking Sekarang</h1>
        <p className="text-gray-500 text-sm text-center mb-2 px-4">Selesaikan {STEPS.length} langkah untuk konfirmasi booking kamu</p>
        {!session && (
          <p className="text-gray-400 text-xs text-center mb-6 px-4">
            Booking sebagai tamu — atau <Link href="/login" className="text-[#178E81] font-bold hover:underline">login</Link> agar tersimpan di riwayat.
          </p>
        )}
        {session && <div className="mb-6" />}
        <StepBar current={step} />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 md:p-8">

          {/* Step 0: Cabang */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-black text-[#1a1a1a] mb-1">Pilih Cabang</h2>
              <p className="text-xs text-gray-400 mb-4">Tentukan lokasi yang paling dekat denganmu.</p>
              {branches === null ? (
                <p className="text-gray-400 text-sm py-8 text-center">Memuat cabang…</p>
              ) : branches.length === 0 ? (
                <p className="text-gray-400 text-sm py-8 text-center">📍 Belum ada cabang tersedia.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {branches.map((b) => (
                    <button key={b.id} onClick={() => selectBranch(b)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${branch?.id === b.id ? "border-[#F9C74F] bg-yellow-50" : "border-gray-200 hover:border-yellow-300"}`}>
                      <p className="font-bold text-[#1a1a1a]">{b.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{b.address}</p>
                      <p className="text-xs text-gray-400 mt-1">⏰ {hhmm(b.opening_time)} – {hhmm(b.closing_time)}</p>
                    </button>
                  ))}
                </div>
              )}
              <button disabled={!branch} onClick={() => setStep(1)}
                className="mt-6 w-full bg-[#F9C74F] text-black font-bold py-3 rounded-xl disabled:opacity-40 hover:bg-yellow-400 transition-colors">
                Lanjut →
              </button>
            </div>
          )}

          {/* Step 1: Barber */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-black text-[#1a1a1a] mb-1">Pilih Barber</h2>
              <p className="text-xs text-gray-400 mb-4">Pilih maestro yang akan menangani kamu.</p>
              {barbers.length === 0 ? (
                <p className="text-gray-400 text-sm py-8 text-center">💈 Belum ada barber di cabang ini.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {barbers.map((b) => {
                    const selected = barber?.id === b.id;
                    return (
                      <button key={b.id} onClick={() => setBarber(b)}
                        className={`p-3 rounded-xl border-2 flex flex-col items-center text-center transition-all ${selected ? "border-[#F9C74F] bg-yellow-50" : "border-gray-200 hover:border-yellow-300"}`}>
                        <span className={`relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 ring-2 ${COLOR_RING[b.signature_color ?? ""] ?? "ring-gray-200"} ${selected ? "ring-offset-2" : ""}`}>
                          <img src={b.photo_url ?? `/barbers/${b.slug}.png`} alt={b.name}
                            className="w-full h-full object-cover object-top"
                            onError={(e) => { (e.target as HTMLImageElement).style.visibility = "hidden"; }} />
                        </span>
                        <p className="font-bold text-[#1a1a1a] text-sm mt-2 leading-tight">{b.name}</p>
                        <span className={`text-[10px] mt-1 font-semibold ${b.has_shift_today ? "text-[#178E81]" : "text-gray-400"}`}>
                          {b.has_shift_today ? "● Bertugas hari ini" : "Cek jadwal"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="flex gap-3 mt-7">
                <button onClick={() => setStep(0)} className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">← Kembali</button>
                <button disabled={!barber} onClick={() => setStep(2)} className="flex-1 bg-[#F9C74F] text-black font-bold py-3 rounded-xl disabled:opacity-40 hover:bg-yellow-400 transition-colors">Lanjut →</button>
              </div>
            </div>
          )}

          {/* Step 2: Layanan */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-black text-[#1a1a1a] mb-4">Pilih Layanan</h2>
              <div className="relative mb-3">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M21 21l-4.3-4.3" />
                </svg>
                <input type="text" value={serviceQuery} onChange={(e) => setServiceQuery(e.target.value)} placeholder="Cari layanan..."
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors" />
              </div>
              <div className="max-h-[300px] overflow-y-auto pr-1 space-y-2 [scrollbar-width:thin]">
                {services.length === 0 ? (
                  <p className="text-gray-400 text-sm py-8 text-center">✂️ Belum ada layanan di cabang ini.</p>
                ) : filteredServices.length === 0 ? (
                  <p className="text-gray-400 text-sm py-8 text-center">Layanan tidak ditemukan.</p>
                ) : (
                  filteredServices.map((s) => (
                    <button key={s.id} onClick={() => setService(s)}
                      className={`w-full p-3 rounded-xl border-2 text-left transition-all ${service?.id === s.id ? "border-[#F9C74F] bg-yellow-50" : "border-gray-200 hover:border-yellow-300"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-bold text-[#1a1a1a] text-sm leading-tight">{s.name}</p>
                          {s.description && <p className="text-xs text-gray-500 leading-snug line-clamp-2 mt-0.5">{s.description}</p>}
                          <p className="text-[11px] text-gray-400 mt-1">{s.duration_minutes} menit</p>
                        </div>
                        <p className="text-[#1a1a1a] font-extrabold text-sm flex-shrink-0">{fmt(s.price)}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">← Kembali</button>
                <button disabled={!service} onClick={() => setStep(3)} className="flex-1 bg-[#F9C74F] text-black font-bold py-3 rounded-xl disabled:opacity-40 hover:bg-yellow-400 transition-colors">Lanjut →</button>
              </div>
            </div>
          )}

          {/* Step 3: Jadwal */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-black text-[#1a1a1a] mb-5">Pilih Jadwal</h2>
              <p className="text-sm font-bold text-gray-700 mb-2">Tanggal</p>
              <div className="mb-4">
                <DatePicker value={date} onChange={setDate} minDate={minDate} maxDate={maxDate} />
              </div>
              {date && (
                <>
                  <p className="text-sm font-bold text-gray-700 mb-2">Waktu</p>
                  {slotsLoading ? (
                    <p className="text-gray-400 text-sm py-4 text-center">Mengecek ketersediaan…</p>
                  ) : slots.length === 0 ? (
                    <p className="text-gray-400 text-sm py-4 text-center">😴 Tidak ada slot tersedia di tanggal ini. Coba tanggal lain.</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {slots.map((s) => (
                        <button key={s.datetime} onClick={() => setTime(s.time)}
                          className={`py-2 rounded-xl text-xs font-bold border-2 transition-all ${time === s.time ? "border-[#F9C74F] bg-yellow-50 text-[#1a1a1a]" : "border-gray-200 text-gray-600 hover:border-yellow-300"}`}>
                          {s.time}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">← Kembali</button>
                <button disabled={!date || !time} onClick={() => setStep(4)} className="flex-1 bg-[#F9C74F] text-black font-bold py-3 rounded-xl disabled:opacity-40 hover:bg-yellow-400 transition-colors">Lanjut →</button>
              </div>
            </div>
          )}

          {/* Step 4: Data Diri */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-black text-[#1a1a1a] mb-5">Data Diri</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5">Nama Lengkap</label>
                  <input type="text" placeholder="John Doe" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} required
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5">No. WhatsApp</label>
                  <input type="tel" inputMode="numeric" placeholder="08123456789" maxLength={20} value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 20) })} required
                    className={`w-full bg-gray-50 border-2 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none transition-colors text-sm ${form.phone && !isPhoneValid ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-[#F9C74F]"}`} />
                  {form.phone && !isPhoneValid && <p className="text-xs mt-1 font-medium text-red-500">Nomor HP harus 10 - 20 angka.</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5">Catatan (opsional)</label>
                  <textarea rows={3} placeholder="Referensi gaya, permintaan khusus, dll." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm resize-none" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(3)} className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">← Kembali</button>
                <button disabled={!form.name || !isPhoneValid} onClick={() => setStep(5)}
                  className="flex-1 bg-[#F9C74F] text-black font-bold py-3 rounded-xl disabled:opacity-40 hover:bg-yellow-400 transition-colors">Lanjut →</button>
              </div>
            </div>
          )}

          {/* Step 5: Ringkasan */}
          {step === 5 && (
            <div>
              <h2 className="text-xl font-black text-[#1a1a1a] mb-5">Ringkasan Booking</h2>
              <div className="bg-[#F5EFE4] rounded-xl p-5 space-y-3 text-sm">
                {[
                  ["Cabang", branch?.name],
                  ["Barber", barber?.name],
                  ["Layanan", service?.name],
                  ["Tanggal", date ? new Date(date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : ""],
                  ["Waktu", time],
                  ["Nama", form.name],
                  ["WhatsApp", form.phone],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between gap-3">
                    <span className="text-gray-500 flex-shrink-0">{label}</span>
                    <span className="font-semibold text-[#1a1a1a] text-right break-words">{val}</span>
                  </div>
                ))}
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between font-black text-[#1a1a1a] text-base"><span>Total</span><span className="text-[#F9C74F]">{fmt(service?.price ?? 0)}</span></div>
                </div>
              </div>
              {submitError && <p className="text-red-500 text-sm mt-3 font-medium">{submitError}</p>}
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(4)} disabled={submitting} className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40">← Kembali</button>
                <button onClick={confirmBooking} disabled={submitting}
                  className="flex-1 bg-[#178E81] text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting ? (
                    <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Memproses...</>
                  ) : "Buat Booking & Bayar →"}
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Pembayaran */}
          {step === 6 && (
            <div>
              <h2 className="text-xl font-black text-[#1a1a1a] mb-1">Pembayaran</h2>
              <p className="text-gray-500 text-sm mb-2">No. Booking: <span className="font-mono font-bold text-[#178E81]">{bookingNo}</span></p>
              <p className="text-gray-500 text-sm mb-5">Bayar lalu unggah bukti. Booking dikonfirmasi setelah diverifikasi kasir.</p>

              {!payExpired ? (
                <div className="bg-[#1a1a1a] rounded-xl p-4 mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">Selesaikan dalam</p>
                    <p className="text-[#F9C74F] text-2xl font-black font-mono tabular-nums">{mmss}</p>
                  </div>
                  <p className="text-gray-400 text-[11px] max-w-[170px] text-right leading-snug">Slot diamankan sementara selama menunggu pembayaran.</p>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 text-center">
                  <p className="text-red-600 font-bold text-sm">Waktu pembayaran habis</p>
                  <p className="text-red-500 text-xs mt-0.5">Slot telah dilepas. Silakan ulangi booking.</p>
                </div>
              )}

              <div className="bg-[#F5EFE4] rounded-xl p-5 mb-5 flex items-center justify-between">
                <span className="text-gray-500 text-sm font-semibold">Total Pembayaran</span>
                <span className="text-2xl font-black text-[#178E81]">{fmt(payInfo?.total_price ?? service?.price ?? 0)}</span>
              </div>

              {/* QRIS */}
              <p className="text-sm font-bold text-[#1a1a1a] mb-3">Metode Pembayaran — QRIS</p>
              <div className="border-2 border-[#F9C74F] bg-[#FFF9E8] rounded-xl p-5 mb-5 flex flex-col items-center">
                <span className="text-[11px] text-gray-400 mb-3">{branch?.name}</span>
                {payInfo?.qris_image_url ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-2">
                    <img src={payInfo.qris_image_url} alt={`QRIS ${branch?.name}`} className="w-44 h-44 object-contain" />
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 text-center max-w-[240px]">QRIS belum tersedia untuk cabang ini. Silakan transfer ke rekening di bawah.</p>
                )}
                {payInfo?.bank_accounts && payInfo.bank_accounts.length > 0 && (
                  <div className="w-full mt-4 space-y-2">
                    {payInfo.bank_accounts.map((acc, i) => (
                      <div key={i} className="bg-white rounded-lg border border-gray-200 px-3 py-2 text-xs">
                        <p className="font-bold text-[#1a1a1a]">{acc.bank_name}</p>
                        <p className="font-mono text-[#178E81]">{acc.account_number}</p>
                        <p className="text-gray-400">a.n. {acc.account_holder}</p>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-3 text-center max-w-[220px]">Scan dengan e-wallet / m-banking apa pun yang mendukung QRIS.</p>
              </div>

              {/* Upload bukti */}
              {!payExpired && (
                <div className="mb-1">
                  <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5">Upload Bukti Pembayaran</label>
                  <label className="flex items-center gap-3 border-2 border-dashed border-gray-300 rounded-xl px-4 py-4 cursor-pointer hover:border-[#F9C74F] transition-colors">
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) { setProofFile(f); setUploadError(""); } }} />
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.9A5 5 0 1115.9 6H17a5 5 0 010 10M9 12l3-3m0 0l3 3m-3-3v9" />
                    </svg>
                    <span className={`text-sm truncate ${proofFile ? "text-[#1a1a1a] font-semibold" : "text-gray-400"}`}>{proofFile?.name || "Pilih gambar bukti pembayaran (maks 4MB)"}</span>
                  </label>
                </div>
              )}

              {uploadError && (
                <div className="mt-4 mb-1 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  <p className="text-sm font-medium text-red-600">{uploadError}</p>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                {payExpired ? (
                  <Link href="/booking" className="flex-1 bg-[#F9C74F] text-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors text-center">Ulangi Booking</Link>
                ) : (
                  <button disabled={!proofFile || uploading} onClick={submitProof}
                    className="flex-1 bg-[#178E81] text-white font-bold py-3 rounded-xl disabled:opacity-40 hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
                    {uploading ? (
                      <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Mengirim...</>
                    ) : "Kirim Bukti Pembayaran"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
