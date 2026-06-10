"use client";

import { getLoyaltyPunches, getLoyaltyRewardCode, getBookings } from "@/src/lib/localStorage";

export default function LoyaltyPage() {
  const punches     = getLoyaltyPunches();
  const rewardCode  = getLoyaltyRewardCode();
  const bookings    = getBookings().filter((b) => b.status === "Selesai");
  const TOTAL_PUNCH = 10;
  const progress    = Math.min(punches, TOTAL_PUNCH);

  const copyCode = () => {
    if (!rewardCode) return;
    navigator.clipboard.writeText(rewardCode);
    alert("Kode reward disalin!");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-[#1a1a1a]">Loyalty Card</h2>

      {/* Punch Card */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[#F9C74F] text-xs font-bold uppercase tracking-widest">Minion Loyalty</p>
            <p className="text-white text-2xl font-black mt-1">{progress}/{TOTAL_PUNCH} Punch</p>
          </div>
          <div className="text-4xl">💈</div>
        </div>

        {/* Punch grid */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          {Array.from({ length: TOTAL_PUNCH }).map((_, i) => (
            <div key={i} className={`aspect-square rounded-xl flex items-center justify-center text-xl transition-all ${i < progress ? "bg-[#F9C74F] shadow-lg scale-105" : "bg-white/10"}`}>
              {i < progress ? "✂️" : ""}
            </div>
          ))}
        </div>

        <p className="text-white/60 text-xs text-center">
          {progress >= TOTAL_PUNCH
            ? "🎉 Selamat! Kamu dapat 1x Classic Cut Gratis!"
            : `${TOTAL_PUNCH - progress} kunjungan lagi untuk reward gratis`}
        </p>
      </div>

      {/* Reward code */}
      {rewardCode && (
        <div className="bg-[#F9C74F] rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-black/60 mb-2">🎁 Reward Tersedia!</p>
          <p className="text-2xl font-black text-[#1a1a1a] mb-1">{rewardCode}</p>
          <p className="text-sm text-black/60 mb-4">Gunakan kode ini saat booking untuk 1x Classic Cut gratis</p>
          <button onClick={copyCode}
            className="bg-[#1a1a1a] text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-gray-800 transition-colors">
            📋 Salin Kode
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
                <span className="text-[#F9C74F] text-lg">✂️</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
