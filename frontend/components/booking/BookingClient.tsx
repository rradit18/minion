"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchBranches, fetchBarbers, fetchBarbersByBranch, fetchServices, fetchSlots, fetchPromoByCode} from "@/src/lib/mockData";
import { saveBooking, getBookingPrefill, clearBookingPrefill, getActivePromo, clearActivePromo} from "@/src/lib/localStorage";
import type { Branch, Barber, Service } from "@/src/lib/mockData";
import BarberOrbit from "@/components/booking/BarberOrbit";
import DatePicker from "@/components/booking/DatePicker";

const PAYMENT_WINDOW = 10 * 60; // detik — slot ditahan 10 menit

// ─── Step indicator ───────────────────────────────────────────────────────────
const STEPS = ["Cabang", "Barber", "Layanan", "Jadwal", "Data Diri", "Konfirmasi", "Pembayaran"];
// Saat mengikuti barber, langkah "Barber" dilewati (barber sudah dipilih dari halaman detail)
const BARBER_STEPS = STEPS.filter((s) => s !== "Barber");

function StepBar({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="mb-8 flex justify-center">
      <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar max-w-full px-1">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-1 sm:gap-1.5">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold transition-all ${i < current ? "bg-[#178E81] text-white" : i === current ? "bg-[#F9C74F] text-black" : "bg-gray-200 text-gray-400"}`}>
                {i < current ? "✓" : i + 1}
              </div>
              <span className={`text-[9px] mt-1 hidden sm:block whitespace-nowrap ${i === current ? "text-[#1a1a1a] font-semibold" : "text-gray-400"}`}>{label}</span>
            </div>
            {i < steps.length - 1 && <div className={`h-0.5 w-4 sm:w-6 shrink-0 sm:mb-4 ${i < current ? "bg-[#178E81]" : "bg-gray-200"}`} />}
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
  // Mode "ikuti barber": barber dipilih lebih dulu lewat CTA di halaman detail barberman
  const [byBarber, setByBarber]     = useState(false);
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
  const [payMethod, setPayMethod]   = useState<"qris">("qris");
  const [proofName, setProofName]   = useState("");
  const [secondsLeft, setSecondsLeft] = useState(PAYMENT_WINDOW);
  const [verifying, setVerifying]   = useState(false);
  const [verifyError, setVerifyError] = useState(false);

  // Pre-fill dari sessionStorage + query param ?barber= (mode ikuti barber)
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

    // Mode ikuti barber: ?barber=<slug|id>. Slug = nama depan huruf kecil (mis. "hendra")
    const key = new URLSearchParams(window.location.search).get("barber");
    if (key) {
      const k = key.toLowerCase();
      const b = fetchBarbers().find(
        (x) => x.id === k || x.name.split(" ")[0].toLowerCase() === k
      );
      if (b) { setBarber(b); setByBarber(true); }
    }
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

  // Mode ikuti barber: cabang dibatasi hanya yang punya barber tsb; langkah "Barber" dilewati
  const visibleBranches = byBarber && barber
    ? branches.filter((b) => barber.branch_ids.includes(b.id))
    : branches;
  const stepLabels = byBarber ? BARBER_STEPS : STEPS;
  // Petakan index numerik internal (step) ke posisi pada label yang tampil
  const displayStep = byBarber ? (step === 0 ? 0 : step - 1) : step;

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
    setStep(0); setPayMethod("qris"); setProofName(""); setSecondsLeft(PAYMENT_WINDOW); setVerifying(false); setVerifyError(false);
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
        className="fixed inset-0 -z-10 bg-[url('/ui/pattern.png')] bg-repeat opacity-[0.45]"
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
        <p className="text-gray-500 text-sm text-center mb-8 px-4">
          {byBarber && barber
            ? <>Booking bareng <span className="font-bold text-[#1a1a1a]">{barber.name}</span> — selesaikan {stepLabels.length} langkah</>
            : <>Selesaikan {stepLabels.length} langkah untuk konfirmasi booking kamu</>}
        </p>
        <StepBar steps={stepLabels} current={displayStep} />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 md:p-8">

          {/* Step 0: Pilih Cabang */}
          {step === 0 && (
            <div>
              {/* Banner barber yang diikuti (mode ikuti barber) */}
              {byBarber && barber && (
                <div className="flex items-center gap-3 bg-[#F5EFE4] rounded-xl p-3 mb-5">
                  <span className={`relative grid place-items-center w-11 h-11 rounded-full overflow-hidden flex-shrink-0 ${barber.color}`}>
                    <span className="text-white font-black text-lg">{barber.name[0]}</span>
                    <img src={`/${barber.name.split(" ")[0].toLowerCase()}.png`} alt={barber.name}
                      className="absolute w-11 h-11 rounded-full object-cover object-top"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#178E81]">Kamu mengikuti barber</p>
                    <p className="font-black text-[#1a1a1a] leading-tight truncate">{barber.name} <span className="text-gray-400 font-semibold">· {barber.nickname}</span></p>
                  </div>
                </div>
              )}
              <h2 className="text-xl font-black text-[#1a1a1a] mb-1">Pilih Cabang</h2>
              {byBarber && barber && (
                <p className="text-xs text-gray-400 mb-4">Hanya menampilkan cabang tempat {barber.name.split(" ")[0]} bertugas.</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {visibleBranches.map((b) => (
                  <button key={b.id} onClick={() => setBranch(b)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${branch?.id === b.id ? "border-[#F9C74F] bg-yellow-50" : "border-gray-200 hover:border-yellow-300"}`}>
                    <p className="font-bold text-[#1a1a1a]">{b.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{b.address}</p>
                    <p className="text-xs text-gray-400 mt-1">⏰ {b.hours}</p>
                    <p className="text-xs text-[#178E81] font-semibold mt-1">⭐ {b.rating} ({b.total_reviews} review)</p>
                  </button>
                ))}
              </div>
              <button disabled={!branch} onClick={() => setStep(byBarber ? 2 : 1)}
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
                  <button onClick={() => setStep(byBarber ? 0 : 1)} className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">← Kembali</button>
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

              {/* QRIS */}
              <p className="text-sm font-bold text-[#1a1a1a] mb-3">Metode Pembayaran</p>
              <div className="border-2 border-[#F9C74F] bg-[#FFF9E8] rounded-xl p-5 mb-5 flex flex-col items-center">
                <span className="text-xs font-bold tracking-widest uppercase text-[#178E81] mb-1">QRIS</span>
                <span className="text-[11px] text-gray-400 mb-3">{branch?.name}</span>
                <div className="bg-white border border-gray-200 rounded-lg p-2">
                  <img
                    src={["branch-2", "branch-4"].includes(branch?.id ?? "") ? "/qris/qris-ganet-kijang.png" : "/qris/qris-km9-pramuka.jpeg"}
                    alt={`QRIS ${branch?.name}`}
                    className="w-44 h-44 object-contain"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center max-w-[220px]">Scan dengan aplikasi e-wallet / m-banking apa pun yang mendukung QRIS.</p>
              </div>

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
                    <span className={`text-sm truncate ${proofName ? "text-[#1a1a1a] font-semibold" : "text-gray-400"}`}>{proofName || "Pilih gambar bukti pembayaran QRIS"}</span>
                  </label>
                </div>
              )}

              {/* Error verifikasi */}
              {verifyError && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-bold text-red-600">Bukti pembayaran tidak valid</p>
                    <p className="text-xs text-red-400 mt-0.5">Sistem tidak dapat memverifikasi pembayaran kamu. Pastikan bukti jelas dan nominal sesuai, lalu coba lagi.</p>
                  </div>
                </div>
              )}

              {/* Aksi */}
              <div className="flex gap-3 mt-4">
                {payExpired ? (
                  <button onClick={resetBooking} className="flex-1 bg-[#F9C74F] text-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors">Ulangi Booking</button>
                ) : (
                  <>
                    <button onClick={() => setStep(5)} disabled={verifying} className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40">← Kembali</button>
                    <button
                      disabled={!proofName || verifying}
                      onClick={() => {
                        setVerifyError(false);
                        setVerifying(true);
                        setTimeout(() => {
                          setVerifying(false);
                          setVerifyError(true);
                        }, 3000);
                      }}
                      className="flex-1 bg-[#178E81] text-white font-bold py-3 rounded-xl disabled:opacity-40 hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                    >
                      {verifying ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Memverifikasi...
                        </>
                      ) : verifyError ? "Coba Lagi" : "Kirim Bukti Pembayaran"}
                    </button>
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
