"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [show, setShow] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert("Password tidak cocok!");
      return;
    }
    // TODO: POST /api/auth/register
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left Panel — branding ── */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 bg-[#1a1a1a] px-12 py-14">
        <div>
          <p
            className="text-[42px] font-bold text-white leading-none"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Minion
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-px bg-white/30" />
            <span className="text-[10px] font-bold tracking-[3px] text-white/60 uppercase">
              Barbershop
            </span>
          </div>
        </div>

        <div>
          <p className="text-[#F9C74F] text-4xl font-black leading-tight mb-4">
            Join The<br />Rebellion.
          </p>
          <ul className="space-y-3 text-white/60 text-sm">
            {[
              "Booking mudah & cepat",
              "Notifikasi jadwal kunjungan",
              "Akses promo eksklusif member",
              "Riwayat kunjungan tersimpan",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="w-4 h-4 bg-[#F9C74F] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-white/10 text-7xl select-none">💈</div>
      </div>

      {/* ── Right Panel — form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-14 bg-[#F5EFE4]">
        <div className="w-full max-w-md">

          <p className="text-[#178E81] text-xs font-extrabold tracking-[3px] uppercase mb-2">
            Buat Akun Baru
          </p>
          <h1
            className="text-4xl font-black text-[#1a1a1a] mb-1 leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Sign Up
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-[#F9C74F] font-bold hover:underline">
              Masuk di sini
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama */}
            <div>
              <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5" htmlFor="name">
                Nama Lengkap
              </label>
              <input
                id="name" name="name" type="text" required
                value={form.name} onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5" htmlFor="email">
                Email
              </label>
              <input
                id="email" name="email" type="email" required
                value={form.email} onChange={handleChange}
                placeholder="email@kamu.com"
                className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm"
              />
            </div>

            {/* No HP */}
            <div>
              <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5" htmlFor="phone">
                No. WhatsApp
              </label>
              <div className="flex">
                <span className="bg-white border-2 border-r-0 border-gray-200 rounded-l-xl px-4 flex items-center text-sm text-gray-500 font-medium">
                  +62
                </span>
                <input
                  id="phone" name="phone" type="tel" required
                  value={form.phone} onChange={handleChange}
                  placeholder="8123456789"
                  className="flex-1 bg-white border-2 border-l-0 border-gray-200 rounded-r-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password" name="password"
                  type={show ? "text" : "password"}
                  required minLength={8}
                  value={form.password} onChange={handleChange}
                  placeholder="Min. 8 karakter"
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm"
                />
                <button
                  type="button" onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {show ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5" htmlFor="confirm">
                Konfirmasi Password
              </label>
              <input
                id="confirm" name="confirm"
                type={show ? "text" : "password"}
                required
                value={form.confirm} onChange={handleChange}
                placeholder="Ulangi password"
                className={`w-full bg-white border-2 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm ${
                  form.confirm && form.confirm !== form.password
                    ? "border-red-400"
                    : "border-gray-200"
                }`}
              />
              {form.confirm && form.confirm !== form.password && (
                <p className="text-red-500 text-xs mt-1">Password tidak cocok</p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required className="mt-0.5 accent-[#F9C74F] w-4 h-4 flex-shrink-0" />
              <span className="text-xs text-gray-500 leading-relaxed">
                Saya setuju dengan{" "}
                <a href="#" className="text-[#1a1a1a] font-bold hover:text-[#F9C74F] transition-colors">
                  Syarat & Ketentuan
                </a>{" "}
                serta{" "}
                <a href="#" className="text-[#1a1a1a] font-bold hover:text-[#F9C74F] transition-colors">
                  Kebijakan Privasi
                </a>
              </span>
            </label>

            <button
              type="submit"
              className="w-full bg-[#F9C74F] text-[#1a1a1a] font-extrabold py-3.5 rounded-xl text-sm uppercase tracking-widest hover:bg-yellow-400 transition-colors"
            >
              Buat Akun
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
