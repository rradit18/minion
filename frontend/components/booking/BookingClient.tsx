"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchBranches, fetchBarbersByBranch, fetchServices, fetchSlots, fetchPromoByCode} from "@/src/lib/mockData";
import { saveBooking, getBookingPrefill, clearBookingPrefill, getActivePromo, clearActivePromo} from "@/src/lib/localStorage";
import type { Branch, Barber, Service } from "@/src/lib/mockData";
import BarberOrbit from "@/components/booking/BarberOrbit";
import DatePicker from "@/components/booking/DatePicker";

// ─── Data pembayaran (mock — UI dulu, API menyusul) ───────────────────────────
const BANK_ACCOUNTS = [
  { bank: "BCA",     number: "1234567890", holder: "PT Minion Barbershop" },
  { bank: "Mandiri", number: "9876543210", holder: "PT Minion Barbershop" },
];
const PAYMENT_WINDOW = 10 * 60; // detik — slot ditahan 10 menit

// ─── Step indicator ───────────────────────────────────────────────────────────
const STEPS = ["Cabang", "Barber", "Layanan", "Jadwal", "Data Diri", "Konfirmasi", "Pembayaran"];

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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BookingClient() {
  const router = useRouter();
  const branches = fetchBranches();
  const allSlots = fetchSlots();

  const [step, setStep]             = useState(0);
  const [branch, setBranch]         = useState<Branch | null>(null);
  const [barber, setBarber]         = useState<Barber | null>(null);
  const [service, setService]       = useState<Service | null>(null);
  const [date, setDate]             = useState("");
  const [time, setTime]             = useState("");
  const [promoCode, setPromoCode]   = useState("");
  const [promoMsg, setPromoMsg]     = useState("");
  const [discount, setDiscount]     = useState(0);
  const [form, setForm]             = useState({ name: "", phone: "", notes: "" });
  const isPhoneValid                = form.phone.length >= 11 && form.phone.length <= 20;
  const [serviceQuery, setServiceQuery] = useState("");
  // Pembayaran
  const [payMethod, setPayMethod]   = useState<"transfer" | "qris" | null>(null);
  const [proofName, setProofName]   = useState("");
  const [secondsLeft, setSecondsLeft] = useState(PAYMENT_WINDOW);
  const [copied, setCopied]         = useState("");

  // Pre-fill dari sessionStorage
  useEffect(() => {
    const prefill = getBookingPrefill();
    if (prefill?.service_id) {
      const svc = fetchServices().find((s) => s.id === prefill.service_id);
      if (svc) setService(svc);
    }
    const promoFromSession = getActivePromo();
    if (promoFromSession) setPromoCode(promoFromSession);
    clearBookingPrefill();
    clearActivePromo();
  }, []);

  // Countdown pembayaran: reset & mulai saat masuk langkah pembayaran
  useEffect(() => {
    if (step !== 6) return;
    setSecondsLeft(PAYMENT_WINDOW);
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { clearInterval(t); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [step]);

  const barbers  = branch ? fetchBarbersByBranch(branch.id) : [];
  const services = fetchServices();
  const price    = service && branch ? service.prices[branch.id] ?? 0 : 0;
  const final    = Math.max(0, price - discount);

  // Rentang tanggal yang bisa dipilih: besok s/d 14 hari ke depan
  const minDate = new Date(); minDate.setDate(minDate.getDate() + 1);
  const maxDate = new Date(); maxDate.setDate(maxDate.getDate() + 14);

  const bookedSlots = barber ? (allSlots.booked_mock[barber.id as keyof typeof allSlots.booked_mock] ?? []) : [];
  const availableSlots = allSlots.template.filter((s) => !bookedSlots.includes(s.time));

  const applyPromo = () => {
    const promo = fetchPromoByCode(promoCode);
    if (!promo) { setPromoMsg("Kode promo tidak valid."); setDiscount(0); return; }
    if (price < promo.min_transaction) { setPromoMsg(`Min. transaksi ${promo.min_transaction.toLocaleString()}`); return; }
    const disc = promo.type === "percentage" ? Math.min(Math.round(price * promo.value / 100), promo.max_discount) : promo.value;
    setDiscount(disc);
    setPromoMsg(`✓ Hemat Rp ${disc.toLocaleString()}`);
  };

  const confirmBooking = () => {
    const booking = {
      id: `BK-${Date.now()}`,
      branch_id: branch!.id, branch_name: branch!.name,
      barber_id: barber!.id, barber_name: barber!.name,
      service_id: service!.id, service_name: service!.name,
      date, time,
      customer_name: form.name, customer_phone: `+62${form.phone}`, customer_email: "",
      price, promo_code: discount > 0 ? promoCode : undefined,
      discount, final_price: final,
      status: "Upcoming" as const,
      created_at: new Date().toISOString(),
    };
    saveBooking(booking);
    router.push("/booking/sukses");
  };

  const resetBooking = () => {
    setStep(0); setPayMethod(null); setProofName(""); setSecondsLeft(PAYMENT_WINDOW);
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };

  const payExpired = secondsLeft <= 0;
  const mmss = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;

  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  return (
    <div className="relative min-h-screen py-10 px-4 sm:px-6">
      {/* ── Background pattern ── */}
      <div aria-hidden className="fixed inset-0 -z-10 bg-[#F5EFE4]" />
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-[url('/pattern.png')] bg-repeat opacity-[0.45]"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.15) 100%)",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.15) 100%)",
        }}
      />

      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#1a1a1a] transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Beranda
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1a1a1a] text-center mb-2">Booking Sekarang</h1>
        <p className="text-gray-500 text-sm text-center mb-8 px-4">Selesaikan {STEPS.length} langkah untuk konfirmasi booking kamu</p>
        <StepBar current={step} />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 md:p-8">

          {/* Step 0: Pilih Cabang */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-black text-[#1a1a1a] mb-5">Pilih Cabang</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {branches.map((b) => (
                  <button key={b.id} onClick={() => setBranch(b)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${branch?.id === b.id ? "border-[#F9C74F] bg-yellow-50" : "border-gray-200 hover:border-yellow-300"}`}>
                    <p className="font-bold text-[#1a1a1a]">{b.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{b.address}</p>
                    <p className="text-xs text-gray-400 mt-1">⏰ {b.hours}</p>
                    <p className="text-xs text-[#178E81] font-semibold mt-1">⭐ {b.rating} ({b.total_reviews} review)</p>
                  </button>
                ))}
              </div>
              <button disabled={!branch} onClick={() => setStep(1)}
                className="mt-6 w-full bg-[#F9C74F] text-black font-bold py-3 rounded-xl disabled:opacity-40 hover:bg-yellow-400 transition-colors">
                Lanjut →
              </button>
            </div>
          )}

          {/* Step 1: Pilih Barber — character select orbit */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-black text-[#1a1a1a] mb-1">Pilih Barber</h2>
              <p className="text-xs text-gray-400 mb-5">Geser atau ketuk avatar untuk memilih maestro-mu.</p>
              <BarberOrbit barbers={barbers} value={barber} onChange={setBarber} />
              <div className="flex gap-3 mt-7">
                <button onClick={() => setStep(0)} className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">← Kembali</button>
                <button disabled={!barber} onClick={() => setStep(2)} className="flex-1 bg-[#F9C74F] text-black font-bold py-3 rounded-xl disabled:opacity-40 hover:bg-yellow-400 transition-colors">Lanjut →</button>
              </div>
            </div>
          )}

          {/* Step 2: Pilih Layanan */}
          {step === 2 && (() => {
            const q = serviceQuery.trim().toLowerCase();
            const filteredServices = services.filter(
              (s) => !q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
            );
            return (
              <div>
                <h2 className="text-xl font-black text-[#1a1a1a] mb-4">Pilih Layanan</h2>

                {/* Search */}
                <div className="relative mb-3">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M21 21l-4.3-4.3" />
                  </svg>
                  <input
                    type="text"
                    value={serviceQuery}
                    onChange={(e) => setServiceQuery(e.target.value)}
                    placeholder="Cari layanan..."
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors"
                  />
                </div>

                {/* List (scrollable) */}
                <div className="max-h-[300px] overflow-y-auto pr-1 space-y-2 [scrollbar-width:thin]">
                  {filteredServices.length === 0 ? (
                    <p className="text-gray-400 text-sm py-8 text-center">Layanan tidak ditemukan.</p>
                  ) : (
                    filteredServices.map((s) => (
                      <button key={s.id} onClick={() => setService(s)}
                        className={`w-full p-3 rounded-xl border-2 text-left transition-all ${service?.id === s.id ? "border-[#F9C74F] bg-yellow-50" : "border-gray-200 hover:border-yellow-300"}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-bold text-[#1a1a1a] text-sm leading-tight">{s.name}</p>
                            <p className="text-xs text-gray-500 leading-snug line-clamp-2 mt-0.5">{s.description}</p>
                            <p className="text-[11px] text-gray-400 mt-1">{s.duration_minutes} menit</p>
                          </div>
                          <p className="text-[#1a1a1a] font-extrabold text-sm flex-shrink-0">{fmt(s.prices[branch!.id] ?? 0)}</p>
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
            );
          })()}

          {/* Step 3: Pilih Jadwal */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-black text-[#1a1a1a] mb-5">Pilih Jadwal</h2>
              {/* Tanggal */}
              <p className="text-sm font-bold text-gray-700 mb-2">Tanggal</p>
              <div className="mb-4">
                <DatePicker value={date} onChange={setDate} minDate={minDate} maxDate={maxDate} />
              </div>
              {/* Waktu */}
              {date && (
                <>
                  <p className="text-sm font-bold text-gray-700 mb-2">Waktu</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableSlots.map((s) => (
                      <button key={s.time} onClick={() => setTime(s.time)}
                        className={`py-2 rounded-xl text-xs font-bold border-2 transition-all ${time === s.time ? "border-[#F9C74F] bg-yellow-50 text-[#1a1a1a]" : "border-gray-200 text-gray-600 hover:border-yellow-300"}`}>
                        {s.label}
                      </button>
                    ))}
                  </div>
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
                {[
                  { label: "Nama Lengkap", name: "name", type: "text", placeholder: "John Doe" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5">{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} value={form[f.name as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} required
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5">No. WhatsApp</label>
                  <div className="flex">
                    <span className="bg-gray-50 border-2 border-r-0 border-gray-200 rounded-l-xl px-4 flex items-center text-sm text-gray-500 font-medium">+62</span>
                    <input type="tel" inputMode="numeric" placeholder="8123456789" maxLength={20} value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 20) })} required
                      className={`flex-1 bg-gray-50 border-2 border-l-0 rounded-r-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none transition-colors text-sm ${form.phone && !isPhoneValid ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-[#F9C74F]"}`} />
                  </div>
                  {form.phone && !isPhoneValid && (
                    <p className="text-xs mt-1 font-medium text-red-500">Nomor HP harus terdiri dari 11 - 20 angka.</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5">Catatan (opsional)</label>
                  <textarea rows={3} placeholder="Referensi gaya, permintaan khusus, dll." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm resize-none" />
                </div>
                {/* Promo */}
                <div>
                  <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5">Kode Promo</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Masukkan kode promo" value={promoCode}
                      onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoMsg(""); setDiscount(0); }}
                      className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm uppercase" />
                    <button type="button" onClick={applyPromo} className="bg-[#1a1a1a] text-white font-bold px-5 rounded-xl text-sm hover:bg-gray-800 transition-colors">Pakai</button>
                  </div>
                  {promoMsg && <p className={`text-xs mt-1 font-medium ${promoMsg.startsWith("✓") ? "text-green-600" : "text-red-500"}`}>{promoMsg}</p>}
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
                  ["Barber", `${barber?.name} (${barber?.nickname})`],
                  ["Layanan", service?.name],
                  ["Tanggal", new Date(date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })],
                  ["Waktu", time],
                  ["Nama", form.name],
                  ["WhatsApp", `+62${form.phone}`],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between gap-3">
                    <span className="text-gray-500 flex-shrink-0">{label}</span>
                    <span className="font-semibold text-[#1a1a1a] text-right break-words">{val}</span>
                  </div>
                ))}
                <div className="border-t border-gray-300 pt-3 space-y-1">
                  <div className="flex justify-between"><span className="text-gray-500">Harga</span><span>{fmt(price)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-green-600"><span>Diskon ({promoCode})</span><span>-{fmt(discount)}</span></div>}
                  <div className="flex justify-between font-black text-[#1a1a1a] text-base pt-1"><span>Total</span><span className="text-[#F9C74F]">{fmt(final)}</span></div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(4)} className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">← Kembali</button>
                <button onClick={() => setStep(6)} className="flex-1 bg-[#F9C74F] text-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors">Lanjut ke Pembayaran →</button>
              </div>
            </div>
          )}

          {/* Step 6: Pembayaran */}
          {step === 6 && (
            <div>
              <h2 className="text-xl font-black text-[#1a1a1a] mb-1">Pembayaran</h2>
              <p className="text-gray-500 text-sm mb-5">Bayar dulu untuk mengamankan slot kamu. Booking baru dikonfirmasi setelah pembayaran diverifikasi kasir.</p>

              {/* Countdown */}
              {!payExpired ? (
                <div className="bg-[#1a1a1a] rounded-xl p-4 mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">Selesaikan dalam</p>
                    <p className="text-[#F9C74F] text-2xl font-black font-mono tabular-nums">{mmss}</p>
                  </div>
                  <p className="text-gray-400 text-[11px] max-w-[170px] text-right leading-snug">Slot kamu diamankan sementara selama menunggu pembayaran.</p>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 text-center">
                  <p className="text-red-600 font-bold text-sm">Waktu pembayaran habis</p>
                  <p className="text-red-500 text-xs mt-0.5">Slot telah dilepas. Silakan ulangi booking.</p>
                </div>
              )}

              {/* Total */}
              <div className="bg-[#F5EFE4] rounded-xl p-5 mb-5 flex items-center justify-between">
                <span className="text-gray-500 text-sm font-semibold">Total Pembayaran</span>
                <span className="text-2xl font-black text-[#178E81]">{fmt(final)}</span>
              </div>

              {/* Pilih metode */}
              <p className="text-sm font-bold text-[#1a1a1a] mb-2">Metode Pembayaran</p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {([["transfer", "Transfer Bank"], ["qris", "QRIS"]] as const).map(([key, label]) => (
                  <button key={key} type="button" disabled={payExpired} onClick={() => setPayMethod(key)}
                    className={`rounded-xl border-2 py-3 px-4 text-sm font-bold transition-all disabled:opacity-40 ${payMethod === key ? "border-[#F9C74F] bg-[#FFF9E8] text-[#1a1a1a]" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Detail Transfer Bank */}
              {payMethod === "transfer" && (
                <div className="space-y-3 mb-5">
                  {BANK_ACCOUNTS.map((acc) => (
                    <div key={acc.bank} className="border-2 border-gray-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-[#1a1a1a]">{acc.bank}</span>
                        <button type="button" onClick={() => copy(acc.number, acc.bank)}
                          className="text-xs font-bold text-[#178E81] hover:underline">{copied === acc.bank ? "Tersalin ✓" : "Salin"}</button>
                      </div>
                      <p className="font-mono text-lg font-bold text-[#1a1a1a] tracking-wider">{acc.number}</p>
                      <p className="text-xs text-gray-400 mt-0.5">a.n. {acc.holder}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Detail QRIS */}
              {payMethod === "qris" && (
                <div className="border-2 border-gray-100 rounded-xl p-5 mb-5 flex flex-col items-center">
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    {/* QR placeholder (UI mock — diganti qris_image_url dari API nanti) */}
                    <svg width="168" height="168" viewBox="0 0 25 25" shapeRendering="crispEdges" role="img" aria-label="Kode QRIS (contoh)">
                      <rect width="25" height="25" fill="#fff" />
                      {/* finder patterns */}
                      {[[0, 0], [18, 0], [0, 18]].map(([fx, fy]) => (
                        <g key={`${fx}-${fy}`}>
                          <rect x={fx} y={fy} width="7" height="7" fill="#1a1a1a" />
                          <rect x={fx + 1} y={fy + 1} width="5" height="5" fill="#fff" />
                          <rect x={fx + 2} y={fy + 2} width="3" height="3" fill="#1a1a1a" />
                        </g>
                      ))}
                      {/* modul acak (dekoratif) */}
                      {[[9,1],[11,2],[13,1],[10,4],[12,5],[8,6],[14,3],[9,8],[11,9],[13,8],[2,9],[4,11],[6,10],[1,13],[3,15],[5,13],[8,11],[10,12],[12,13],[14,11],[16,13],[18,11],[20,12],[22,13],[9,14],[11,15],[13,16],[15,14],[17,16],[19,14],[21,15],[10,18],[12,19],[14,18],[16,20],[18,18],[20,19],[22,18],[11,21],[13,22],[15,21],[17,23],[19,21],[21,22]].map(([mx, my], i) => (
                        <rect key={i} x={mx} y={my} width="1" height="1" fill="#1a1a1a" />
                      ))}
                    </svg>
                  </div>
                  <p className="text-xs text-gray-400 mt-3 text-center max-w-[220px]">Scan dengan aplikasi e-wallet / m-banking apa pun yang mendukung QRIS.</p>
                </div>
              )}

              {/* Upload bukti */}
              {payMethod && !payExpired && (
                <div className="mb-1">
                  <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5">Upload Bukti Pembayaran</label>
                  <label className="flex items-center gap-3 border-2 border-dashed border-gray-300 rounded-xl px-4 py-4 cursor-pointer hover:border-[#F9C74F] transition-colors">
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) setProofName(f.name); }} />
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.9A5 5 0 1115.9 6H17a5 5 0 010 10M9 12l3-3m0 0l3 3m-3-3v9" />
                    </svg>
                    <span className={`text-sm truncate ${proofName ? "text-[#1a1a1a] font-semibold" : "text-gray-400"}`}>{proofName || "Pilih gambar bukti transfer / pembayaran"}</span>
                  </label>
                </div>
              )}

              {/* Aksi */}
              <div className="flex gap-3 mt-6">
                {payExpired ? (
                  <button onClick={resetBooking} className="flex-1 bg-[#F9C74F] text-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors">Ulangi Booking</button>
                ) : (
                  <>
                    <button onClick={() => setStep(5)} className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">← Kembali</button>
                    <button disabled={!payMethod || !proofName} onClick={confirmBooking}
                      className="flex-1 bg-[#178E81] text-white font-bold py-3 rounded-xl disabled:opacity-40 hover:bg-teal-700 transition-colors">Kirim Bukti Pembayaran</button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
