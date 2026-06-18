"use client";

import React, { useState } from 'react';
import SpotlightCard from '@/components/ui/SpotlightCard';
import { apiFetch } from '@/src/lib/auth';
import { getSession } from '@/src/lib/localStorage';

const ScissorIcon = () => (
  <svg width="72" height="56" viewBox="0 0 72 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="40" r="12" stroke="#1a1a1a" strokeWidth="3" fill="none"/>
    <circle cx="16" cy="16" r="12" stroke="#1a1a1a" strokeWidth="3" fill="none"/>
    <line x1="25" y1="32" x2="68" y2="8" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
    <line x1="25" y1="24" x2="68" y2="48" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export default function FeedbackPage() {
  const session = typeof window !== 'undefined' ? getSession() : null;

  const [stars, setStars] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [kategori, setKategori] = useState('Kritik');
  const [pesan, setPesan] = useState('');
  const [name, setName] = useState(session?.name ?? '');
  const [phone, setPhone] = useState(session?.phone ?? '');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!pesan.trim()) { setError('Pesan tidak boleh kosong.'); return; }
    setLoading(true);
    setError('');

    const body: Record<string, unknown> = {
      stars,
      category: kategori,
      message: pesan.trim(),
    };
    if (!session && name.trim()) body.customer_name = name.trim();
    if (!session && phone.trim()) body.customer_phone = phone.trim();

    const res = await apiFetch('/feedback', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    setLoading(false);

    if (!res.ok) {
      setError(res.message || 'Terjadi kesalahan, coba lagi.');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setPesan('');
      setStars(5);
      setKategori('Kritik');
      if (!session) { setName(''); setPhone(''); }
    }, 3000);
  };

  return (
    <div className="relative w-full py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: "#F5EFE4",
          backgroundImage: "url('/ui/pattern.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-[#F5EFE4]/80" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-8 md:mb-10">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-[#1a1a1a] max-w-[600px]">
              Keberhasilan Kami Bergantung<br className="hidden sm:block" />
              Pada <span className="text-[#2E9E8F]">Kritik</span> dan{' '}
              <span className="text-[#7C5CBF]">Saran</span> Anda
            </h1>
            <div className="mt-0 md:mt-2 flex-shrink-0">
              <ScissorIcon />
            </div>
          </div>
        </div>

        <SpotlightCard
          spotlightColor="rgba(124, 92, 191, 0.15)"
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-10 border-2 border-[#7C5CBF] shadow-lg"
        >
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-[#1a1a1a] mb-2">Terima Kasih!</h3>
              <p className="text-gray-500 text-sm">Masukan kamu sangat berarti bagi kami.</p>
            </div>
          ) : (
            <div className="space-y-6">

              {/* Rating bintang */}
              <div className="space-y-2">
                <label className="block text-sm sm:text-base font-semibold text-[#1a1a1a]">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setStars(n)}
                      onMouseEnter={() => setHoveredStar(n)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="transition-transform hover:scale-110 active:scale-95"
                    >
                      <svg
                        className={`w-8 h-8 transition-colors ${n <= (hoveredStar || stars) ? 'text-[#F9C74F]' : 'text-gray-200'}`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-500 self-center font-medium">
                    {['', 'Sangat Buruk', 'Buruk', 'Cukup', 'Bagus', 'Sangat Bagus'][stars]}
                  </span>
                </div>
              </div>

              {/* Dropdown Kategori */}
              <div className="space-y-2">
                <label className="block text-sm sm:text-base font-semibold text-[#1a1a1a]">Kategori</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-sm sm:text-base border-[1.5px] border-[#1a1a1a] bg-transparent text-[#1a1a1a] outline-none focus:border-[#7C5CBF] transition-colors appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231a1a1a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
                >
                  <option value="Kritik">Kritik</option>
                  <option value="Saran">Saran</option>
                  <option value="Pujian">Pujian</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              {/* Pesan Textarea */}
              <div className="space-y-2">
                <label className="block text-sm sm:text-base font-semibold text-[#1a1a1a]">Tulis Pesan Anda</label>
                <textarea
                  rows={5}
                  value={pesan}
                  onChange={(e) => { setPesan(e.target.value); setError(''); }}
                  placeholder="Ceritakan pengalaman atau masukan kamu..."
                  maxLength={1000}
                  className="w-full px-4 py-3 rounded-lg text-sm sm:text-base resize-none border-[1.5px] border-[#1a1a1a] bg-transparent text-[#1a1a1a] outline-none focus:border-[#7C5CBF] transition-colors"
                />
                <p className="text-right text-xs text-gray-400">{pesan.length}/1000</p>
              </div>

              {/* Identitas (untuk non-login) */}
              {!session && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#1a1a1a]">Nama <span className="text-gray-400 font-normal">(opsional)</span></label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama kamu"
                      className="w-full px-4 py-3 rounded-lg text-sm border-[1.5px] border-[#1a1a1a] bg-transparent text-[#1a1a1a] outline-none focus:border-[#7C5CBF] transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#1a1a1a]">No. HP <span className="text-gray-400 font-normal">(opsional)</span></label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="08123456789"
                      className="w-full px-4 py-3 rounded-lg text-sm border-[1.5px] border-[#1a1a1a] bg-transparent text-[#1a1a1a] outline-none focus:border-[#7C5CBF] transition-colors"
                    />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-red-500 text-sm font-medium">{error}</p>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={loading || !pesan.trim()}
                  className="px-6 sm:px-8 py-3 rounded-lg font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] bg-[#F9C74F] text-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Mengirim...
                    </>
                  ) : 'Kirim →'}
                </button>
              </div>
            </div>
          )}
        </SpotlightCard>
      </div>
    </div>
  );
}
