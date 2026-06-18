"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/src/lib/auth";

interface Loyalty {
  punch_count: number;
  lifetime_punch_count: number;
  next_reward_at: number;
  last_punched_at: string | null;
}

export default function LoyaltyPage() {
  const [data, setData] = useState<Loyalty | null>(null);

  useEffect(() => {
    apiFetch<Loyalty>("/customer/loyalty").then((r) => setData(r.data));
  }, []);

  const TOTAL = data?.next_reward_at ?? 10;
  const punches = data?.punch_count ?? 0;
  const progress = Math.min(punches, TOTAL);

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
              Selamat! Reward gratis siap kamu klaim di kasir!
            </>
          ) : (
            `${TOTAL - progress} kunjungan lagi untuk reward gratis`
          )}
        </p>
      </div>

      {/* Info card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-400 mb-1">Total Kunjungan</p>
          <p className="text-2xl font-black text-[#1a1a1a]">{data?.lifetime_punch_count ?? 0}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Punch Terakhir</p>
          <p className="text-sm font-bold text-[#1a1a1a]">
            {data?.last_punched_at
              ? new Date(data.last_punched_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
              : "—"}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center px-6">
        Punch otomatis bertambah setiap kamu menyelesaikan kunjungan. Tukarkan reward langsung di kasir saat penuh.
      </p>
    </div>
  );
}
