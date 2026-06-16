"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { findUserByEmail, setSession, getUsers } from "@/src/lib/localStorage";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const demoAccounts = getUsers().filter((u) =>
    ["user@minion.com", "barber@minion.com"].includes(u.email)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const user = findUserByEmail(form.email);
      if (!user || user.password !== form.password) {
        setError("Email atau password salah.");
        setLoading(false);
        return;
      }
      setSession(user);
      router.push("/akun");
    }, 600);
  };

  const roleLabel: Record<string, string> = { user: "USER", barber: "BARBER" };
  const roleBadge: Record<string, string> = {
    user: "bg-green-400 text-black",
    barber: "bg-purple-400 text-black",
  };

  return (
    <div className="h-screen overflow-hidden flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 bg-[#1a1a1a] px-12 py-14 overflow-y-auto relative">
        {/* Pattern halus */}
        <div aria-hidden className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "url('/pattern.png')", backgroundRepeat: "repeat" }} />

        <div className="relative animate-auth-in-left">
          <img src="/minion.png" alt="Minion Barbershop" className="h-14 w-auto object-contain brightness-0 invert" />
        </div>
        <div className="relative">
          <p className="text-[#F9C74F] text-4xl font-black leading-tight mb-6 animate-auth-up" style={{ animationDelay: "0.1s" }}>Good Hair.<br />Good Vibes.<br />Everyday.</p>
          <div className="bg-white/5 rounded-2xl p-4 space-y-3 animate-auth-up" style={{ animationDelay: "0.2s" }}>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">Akun Demo — Klik untuk auto-fill</p>
            {demoAccounts.map((a, i) => (
              <button key={a.email} type="button" onClick={() => { setForm({ email: a.email, password: a.password }); setError(""); }}
                style={{ animationDelay: `${0.3 + i * 0.08}s` }}
                className="animate-auth-up w-full text-left bg-white/5 hover:bg-white/10 rounded-xl px-3 py-2.5 transition-all hover:translate-x-1">
                <p className="text-white text-xs font-bold">{a.name}</p>
                <p className="text-white/40 text-[10px] mt-0.5">{a.email} · {a.password}</p>
                <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 ${roleBadge[a.role] ?? "bg-gray-400 text-black"}`}>
                  {roleLabel[a.role] ?? a.role}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="opacity-10 absolute bottom-14 right-12 animate-auth-float">
          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
          </svg>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 bg-[#F5EFE4] overflow-y-auto relative">
        {/* Blob dekoratif */}
        <div aria-hidden className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-[#F9C74F]/20 blur-3xl animate-auth-blob pointer-events-none" />
        <div aria-hidden className="absolute bottom-0 -left-10 w-64 h-64 rounded-full bg-[#178E81]/15 blur-3xl animate-auth-blob pointer-events-none" style={{ animationDelay: "3s" }} />

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
          <p className="text-[#178E81] text-xs font-extrabold tracking-[3px] uppercase mb-2 animate-auth-up" style={{ animationDelay: "0.05s" }}>Selamat Datang Kembali</p>
          <h1 className="text-4xl font-black text-[#1a1a1a] mb-1 leading-tight animate-auth-up" style={{ fontFamily: "'Space Grotesk', sans-serif", animationDelay: "0.12s" }}>Sign In</h1>
          <p className="text-gray-500 text-sm mb-8 animate-auth-up" style={{ animationDelay: "0.18s" }}>
            Belum punya akun? <Link href="/register" className="text-[#F9C74F] font-bold hover:underline">Daftar di sini</Link>
          </p>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="animate-auth-up" style={{ animationDelay: "0.24s" }}>
              <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="email@kamu.com"
                className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm" />
            </div>
            <div className="animate-auth-up" style={{ animationDelay: "0.3s" }}>
              <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5" htmlFor="password">Password</label>
              <div className="relative">
                <input id="password" name="password" type={show ? "text" : "password"} required value={form.password} onChange={handleChange} placeholder="••••••••"
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show
                    ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
              <div className="text-right mt-1.5">
                <Link href="/lupa-password" className="text-xs text-gray-400 hover:text-[#F9C74F] transition-colors">Lupa password?</Link>
              </div>
            </div>

            {/* Masuk */}
            <button type="submit" disabled={loading}
              className="animate-auth-up w-full bg-[#F9C74F] text-[#1a1a1a] font-extrabold py-3.5 rounded-xl text-sm uppercase tracking-widest hover:bg-yellow-400 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              style={{ animationDelay: "0.36s" }}>
              {loading ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Memproses...</> : "Masuk"}
            </button>

            {/* Daftar */}
            <Link
              href="/register"
              style={{ animationDelay: "0.42s" }}
              className="animate-auth-up w-full bg-white border-2 border-[#1a1a1a] text-[#1a1a1a] font-extrabold py-3.5 rounded-xl text-sm uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-white transition-colors flex items-center justify-center"
            >
              Daftar
            </Link>
          </form>

          {/* Mobile demo hint */}
          <div className="lg:hidden mt-6 bg-white border border-gray-200 rounded-2xl p-4">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-3">Akun Demo</p>
            <div className="space-y-2">
              {demoAccounts.map((a) => (
                <button key={a.email} type="button" onClick={() => { setForm({ email: a.email, password: a.password }); setError(""); }}
                  className="w-full flex items-center justify-between bg-gray-50 hover:bg-yellow-50 rounded-xl px-3 py-2 transition-colors text-left">
                  <div>
                    <p className="text-xs font-bold text-gray-800">{a.name}</p>
                    <p className="text-[10px] text-gray-400">{a.email}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${roleBadge[a.role] ?? "bg-gray-400 text-black"}`}>{roleLabel[a.role]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
