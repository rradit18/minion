"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { register, firstError } from "@/src/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.name === "phone" ? e.target.value.replace(/\D/g, "") : e.target.value;
    setForm({ ...form, [e.target.name]: value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Password tidak cocok!"); return; }
    if (form.password.length < 8) { setError("Password minimal 8 karakter!"); return; }
    setLoading(true);
    setError("");
    const res = await register({
      name: form.name,
      phone: form.phone,
      email: form.email.trim() || undefined,
      password: form.password,
      password_confirmation: form.confirm,
    });
    if (!res.ok) {
      setError(firstError(res));
      setLoading(false);
      return;
    }
    router.push("/akun");
  };

  return (
    <motion.div className="h-screen overflow-hidden flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}>
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 bg-[#1a1a1a] px-12 py-14 overflow-y-auto relative">
        <div aria-hidden className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "url('/ui/pattern.png')", backgroundRepeat: "repeat" }} />

        <div className="relative animate-auth-in-left">
          <img src="/brand/minion.png" alt="Minion Barbershop" className="h-14 w-auto object-contain brightness-0 invert" />
        </div>
        <div className="relative">
          <p className="text-[#F9C74F] text-4xl font-black leading-tight mb-6 animate-auth-up" style={{ animationDelay: "0.1s" }}>Join The<br />Rebellion.</p>
          <ul className="space-y-3 text-white/60 text-sm">
            {["Booking mudah & cepat", "Notifikasi jadwal kunjungan", "Akses promo eksklusif member", "Riwayat kunjungan tersimpan"].map((item, i) => (
              <li key={item} className="flex items-center gap-2 animate-auth-up" style={{ animationDelay: `${0.2 + i * 0.08}s` }}>
                <span className="w-4 h-4 bg-[#F9C74F] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="opacity-10 absolute bottom-14 right-12 animate-auth-float">
          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
          </svg>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 bg-[#F5EFE4] overflow-y-auto overflow-x-hidden relative">
        <div aria-hidden className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-[#F9C74F]/20 blur-3xl animate-auth-blob pointer-events-none" />
        <div aria-hidden className="absolute bottom-0 -left-10 w-64 h-64 rounded-full bg-[#7B5EA7]/15 blur-3xl animate-auth-blob pointer-events-none" style={{ animationDelay: "3s" }} />

        <div className="w-full max-w-md relative">
          <Link
            href="/"
            className="animate-auth-up inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#1a1a1a] transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Beranda
          </Link>
          <p className="text-[#178E81] text-xs font-extrabold tracking-[3px] uppercase mb-2 animate-auth-up" style={{ animationDelay: "0.05s" }}>Buat Akun Baru</p>
          <h1 className="text-4xl font-black text-[#1a1a1a] mb-1 leading-tight animate-auth-up" style={{ fontFamily: "'Space Grotesk', sans-serif", animationDelay: "0.12s" }}>Register</h1>
          <p className="text-gray-500 text-sm mb-8 animate-auth-up" style={{ animationDelay: "0.18s" }}>Sudah punya akun? <Link href="/login" className="text-[#F9C74F] font-bold hover:underline">Masuk di sini</Link></p>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4 animate-auth-up" style={{ animationDelay: "0.24s" }}>
            {/* Nama */}
            <div>
              <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5" htmlFor="name">Nama Lengkap</label>
              <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="John Doe"
                className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm" />
            </div>
            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5" htmlFor="phone">No. WhatsApp</label>
              <input id="phone" name="phone" type="tel" inputMode="numeric" required value={form.phone} onChange={handleChange} placeholder="08123456789"
                className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm" />
            </div>
            {/* Email (opsional) */}
            <div>
              <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5" htmlFor="email">Email <span className="text-gray-400 font-normal">(opsional)</span></label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@kamu.com"
                className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm" />
            </div>
            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5" htmlFor="password">Password</label>
              <div className="relative">
                <input id="password" name="password" type={show ? "text" : "password"} required minLength={8} value={form.password} onChange={handleChange} placeholder="Min. 8 karakter"
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                </button>
              </div>
            </div>
            {/* Confirm */}
            <div>
              <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5" htmlFor="confirm">Konfirmasi Password</label>
              <input id="confirm" name="confirm" type={show ? "text" : "password"} required value={form.confirm} onChange={handleChange} placeholder="Ulangi password"
                className={`w-full bg-white border-2 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm ${form.confirm && form.confirm !== form.password ? "border-red-400" : "border-gray-200"}`} />
              {form.confirm && form.confirm !== form.password && <p className="text-red-500 text-xs mt-1">Password tidak cocok</p>}
            </div>
            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required className="mt-0.5 accent-[#F9C74F] w-4 h-4 flex-shrink-0" />
              <span className="text-xs text-gray-500 leading-relaxed">Saya setuju dengan <a href="#" className="text-[#1a1a1a] font-bold hover:text-[#F9C74F]">Syarat & Ketentuan</a> serta <a href="#" className="text-[#1a1a1a] font-bold hover:text-[#F9C74F]">Kebijakan Privasi</a></span>
            </label>
            <button type="submit" disabled={loading}
              className="w-full bg-[#F9C74F] text-[#1a1a1a] font-extrabold py-3.5 rounded-xl text-sm uppercase tracking-widest hover:bg-yellow-400 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
              {loading ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Mendaftarkan...</> : "Buat Akun"}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
