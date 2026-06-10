"use client";

import Link from "next/link";
import { useState } from "react";
import { findUserByEmail, saveUser } from "@/src/lib/localStorage";

export default function LupaPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const user = findUserByEmail(email);
    if (!user) { setError("Email tidak terdaftar."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); }, 800);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPass.length < 6) { setError("Password minimal 6 karakter."); return; }
    if (newPass !== confirm) { setError("Password tidak cocok."); return; }
    setLoading(true);
    setTimeout(() => {
      const user = findUserByEmail(email);
      if (user) saveUser({ ...user, password: newPass });
      setLoading(false);
      setStep(1);
      setEmail(""); setNewPass(""); setConfirm("");
      alert("Password berhasil diubah! Silakan login.");
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5EFE4] px-6 py-14">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-center mb-10">
          <p className="text-[36px] font-bold text-[#1a1a1a] leading-none" style={{ fontFamily: "'Dancing Script', cursive" }}>Minion</p>
          <span className="text-[10px] font-bold tracking-[3px] border-t border-[#1a1a1a] mt-1 pt-1 text-[#1a1a1a]">— BARBERSHOP —</span>
        </Link>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s ? "bg-[#F9C74F] text-black" : "bg-gray-200 text-gray-400"}`}>{s}</div>
              {s < 2 && <div className={`w-12 h-0.5 ${step > s ? "bg-[#F9C74F]" : "bg-gray-200"}`} />}
            </div>
          ))}
          <span className="text-xs text-gray-400 ml-2">{step === 1 ? "Verifikasi Email" : "Buat Password Baru"}</span>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

        {step === 1 ? (
          <>
            <h1 className="text-3xl font-black text-[#1a1a1a] mb-2">Lupa Password?</h1>
            <p className="text-gray-500 text-sm mb-8">Masukkan email kamu dan kami akan membantu reset password.</p>
            <form onSubmit={handleStep1} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5" htmlFor="email">Email Terdaftar</label>
                <input id="email" type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="email@kamu.com"
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-[#F9C74F] text-[#1a1a1a] font-extrabold py-3.5 rounded-xl text-sm uppercase tracking-widest hover:bg-yellow-400 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Memverifikasi...</> : "Kirim Link Reset"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-black text-[#1a1a1a] mb-2">Buat Password Baru</h1>
            <p className="text-gray-500 text-sm mb-8">Masukkan password baru untuk akun <strong>{email}</strong></p>
            <form onSubmit={handleStep2} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5">Password Baru</label>
                <input type="password" required minLength={6} value={newPass} onChange={(e) => { setNewPass(e.target.value); setError(""); }} placeholder="Min. 6 karakter"
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5">Konfirmasi Password</label>
                <input type="password" required value={confirm} onChange={(e) => { setConfirm(e.target.value); setError(""); }} placeholder="Ulangi password baru"
                  className={`w-full bg-white border-2 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm ${confirm && confirm !== newPass ? "border-red-400" : "border-gray-200"}`} />
                {confirm && confirm !== newPass && <p className="text-red-500 text-xs mt-1">Password tidak cocok</p>}
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-[#F9C74F] text-[#1a1a1a] font-extrabold py-3.5 rounded-xl text-sm uppercase tracking-widest hover:bg-yellow-400 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Menyimpan...</> : "Simpan Password"}
              </button>
            </form>
          </>
        )}

        <p className="text-center text-sm text-gray-400 mt-6">
          <Link href="/login" className="text-[#1a1a1a] font-bold hover:text-[#F9C74F]">← Kembali ke Login</Link>
        </p>
      </div>
    </div>
  );
}
