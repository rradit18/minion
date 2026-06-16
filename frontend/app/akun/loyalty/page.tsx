"use client";

import { getLoyaltyPunches, getLoyaltyRewardCode, getBookings } from "@/src/lib/localStorage";

export default function LoyaltyPage() {
  const punches    = getLoyaltyPunches();
  const rewardCode = getLoyaltyRewardCode();
  const bookings   = getBookings().filter((b) => b.status === "Selesai");
  const TOTAL      = 10;
  const progress   = Math.min(punches, TOTAL);

  const copyCode = () => {
    if (!rewardCode) return;
    navigator.clipboard.writeText(rewardCode);
    alert("Kode reward disalin!");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-[#1a1a1a]">Loyalty Card</h2>

      {/* Punch Card */}
      <div className="bg-[#1a1a1a] rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <div>
            <p className="text-[#F9C74F] text-xs font-bold uppercase tracking-widest">Minion Loyalty</p>
            <p className="text-white text-xl sm:text-2xl font-black mt-1">{progress}/{TOTAL} Punch</p>
          </div>
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#F9C74F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
          </svg>
        </div>

        {/* Punch grid */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-4">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div key={i} className={`aspect-square rounded-xl flex items-center justify-center transition-all ${i < progress ? "bg-[#F9C74F] shadow-lg scale-105" : "bg-white/10"}`}>
              {i < progress && (
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          ))}
        </div>

        <p className="text-white/60 text-xs text-center flex items-center justify-center gap-1.5">
          {progress >= TOTAL ? (
            <>
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Selamat! Kamu dapat 1x Classic Cut Gratis!
            </>
          ) : (
            `${TOTAL - progress} kunjungan lagi untuk reward gratis`
          )}
        </p>
      </div>

      {/* Reward code */}
      {rewardCode && (
        <div className="bg-[#F9C74F] rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-black/60 mb-2 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
            Reward Tersedia!
          </p>
          <p className="text-2xl font-black text-[#1a1a1a] mb-1">{rewardCode}</p>
          <p className="text-sm text-black/60 mb-4">Gunakan kode ini saat booking untuk 1x Classic Cut gratis</p>
          <button onClick={copyCode}
            className="bg-[#1a1a1a] text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-gray-800 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            Salin Kode
          </button>
        </div>
      )}

      {/* Riwayat kunjungan */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-black text-[#1a1a1a] mb-4">Riwayat Kunjungan</h3>
        {bookings.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">Belum ada kunjungan selesai</p>
        ) : (
          <div className="space-y-3">
            {bookings.sort((a, b) => b.date.localeCompare(a.date)).map((b, i) => (
              <div key={b.id} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#F9C74F] rounded-full flex items-center justify-center text-sm font-black flex-shrink-0">{i + 1}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1a1a1a]">{b.service_name}</p>
                  <p className="text-xs text-gray-400">{new Date(b.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <svg className="w-5 h-5 text-[#F9C74F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                </svg>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
