"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchBranches, fetchBarbersByBranch, fetchServices, fetchSlots, fetchPromoByCode} from "@/src/lib/mockData";
import { saveBooking, getBookingPrefill, clearBookingPrefill, getActivePromo, clearActivePromo} from "@/src/lib/localStorage";
import type { Branch, Barber, Service } from "@/src/lib/mockData";
import BarberOrbit from "@/components/booking/BarberOrbit";
import DatePicker from "@/components/booking/DatePicker";

// ─── Step indicator ───────────────────────────────────────────────────────────
const STEPS = ["Cabang", "Barber", "Layanan", "Jadwal", "Data Diri", "Konfirmasi"];

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

// ─── Countdown Modal ──────────────────────────────────────────────────────────
function CountdownModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const [count, setCount] = useState(5);
  useEffect(() => {
    if (count <= 0) { onConfirm(); return; }
    const t = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(t);
  }, [count, onConfirm]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="w-16 h-16 bg-[#F9C74F] rounded-full flex items-center justify-center text-3xl font-black text-black mx-auto mb-4">{count}</div>
        <h2 className="text-xl font-black text-[#1a1a1a] mb-2">Konfirmasi Booking</h2>
        <p className="text-gray-500 text-sm mb-6">Booking akan dikonfirmasi otomatis dalam {count} detik. Pastikan semua data sudah benar.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">Batal</button>
          <button onClick={onConfirm} className="flex-1 bg-[#F9C74F] text-black font-bold py-2.5 rounded-xl hover:bg-yellow-400 transition-colors text-sm">Konfirmasi Sekarang</button>
        </div>
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
  const [showModal, setShowModal]   = useState(false);
  const [form, setForm]             = useState({ name: "", phone: "", notes: "" });
  const [serviceQuery, setServiceQuery] = useState("");

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

  const handleSubmit = () => setShowModal(true);

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
    setShowModal(false);
    router.push("/booking/sukses");
  };

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

      {showModal && <CountdownModal onConfirm={confirmBooking} onCancel={() => setShowModal(false)} />}

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
                    <input type="tel" placeholder="8123456789" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required
                      className="flex-1 bg-gray-50 border-2 border-l-0 border-gray-200 rounded-r-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm" />
                  </div>
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
                <button disabled={!form.name || !form.phone} onClick={() => setStep(5)}
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
                <button onClick={handleSubmit} className="flex-1 bg-[#F9C74F] text-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors">Konfirmasi Booking</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
