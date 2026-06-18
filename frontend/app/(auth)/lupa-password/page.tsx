"use client";

import Link from "next/link";
import { useState } from "react";

const WA_ADMIN = "6281260403854";

export default function LupaPasswordPage() {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const waLink = `https://wa.me/${WA_ADMIN}?text=${encodeURIComponent(
    `Halo admin Minion Barbershop, saya lupa password akun saya. Nomor HP: ${phone || "(tidak diisi)"}. Mohon bantuannya untuk reset password. Terima kasih.`
  )}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5EFE4] px-6 py-14">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-center mb-10">
          <p className="text-[36px] font-bold text-[#1a1a1a] leading-none" style={{ fontFamily: "'Dancing Script', cursive" }}>Minion</p>
          <span className="text-[10px] font-bold tracking-[3px] border-t border-[#1a1a1a] mt-1 pt-1 text-[#1a1a1a]">— BARBERSHOP —</span>
        </Link>

        {!submitted ? (
          <>
            <h1 className="text-3xl font-black text-[#1a1a1a] mb-2">Lupa Password?</h1>
            <p className="text-gray-500 text-sm mb-8">
              Masukkan nomor WA kamu agar admin kami bisa membantu reset password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#1a1a1a] mb-1.5" htmlFor="phone">
                  No. WhatsApp Terdaftar
                </label>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="08123456789"
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#F9C74F] transition-colors text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#F9C74F] text-[#1a1a1a] font-extrabold py-3.5 rounded-xl text-sm uppercase tracking-widest hover:bg-yellow-400 transition-colors"
              >
                Lanjutkan
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-[#1a1a1a] mb-2">Nomor Diterima</h2>
            <p className="text-gray-500 text-sm mb-6">
              Karena keamanan akun, reset password dilakukan melalui admin kami. Klik tombol di bawah untuk menghubungi admin via WhatsApp.
            </p>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3.5 rounded-xl text-sm hover:bg-[#1eba59] transition-colors mb-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.117.553 4.103 1.52 5.832L0 24l6.335-1.508A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.371l-.36-.214-3.733.888.936-3.619-.235-.372A9.818 9.818 0 1112 21.818z" />
              </svg>
              Hubungi Admin via WhatsApp
            </a>

            <button
              onClick={() => { setSubmitted(false); setPhone(""); }}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              ← Coba nomor lain
            </button>
          </div>
        )}

        <p className="text-center text-sm text-gray-400 mt-8">
          <Link href="/login" className="text-[#1a1a1a] font-bold hover:text-[#F9C74F]">← Kembali ke Login</Link>
        </p>
      </div>
    </div>
  );
}
