"use client";

import Link from "next/link";
import { fetchPromos } from "@/src/lib/mockData";
import { setActivePromo, getLoyaltyRewardCode } from "@/src/lib/localStorage";
import { useRouter } from "next/navigation";

export default function PromoPage() {
  const router = useRouter();
  const promos = fetchPromos();
  const loyaltyCode = getLoyaltyRewardCode();

  const handleUse = (code: string) => {
    setActivePromo(code);
    router.push("/booking");
  };

  const isExpired = (date: string) => new Date(date) < new Date();

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-black text-[#1a1a1a]">Promo & Voucher</h2>

      {/* Loyalty reward */}
      {loyaltyCode && (
        <div className="bg-[#F9C74F] rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-black/60 mb-1">🏆 Reward Loyalty</p>
          <p className="text-xl font-black text-[#1a1a1a]">1x Classic Cut Gratis!</p>
          <p className="text-sm text-black/60 mt-1 mb-4">Tukarkan 10 punch loyalty kamu</p>
          <button onClick={() => handleUse(loyaltyCode)}
            className="bg-[#1a1a1a] text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-gray-800 transition-colors">
            Gunakan Sekarang →
          </button>
        </div>
      )}

      {/* Promo list */}
      <div className="space-y-4">
        {promos.map((promo) => {
          const expired = isExpired(promo.valid_until);
          return (
            <div key={promo.id} className={`bg-white rounded-2xl border-2 p-5 transition-all ${expired ? "border-gray-100 opacity-60" : "border-gray-100 hover:border-[#F9C74F]"}`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#1a1a1a] text-[#F9C74F] font-mono font-black text-xs px-2.5 py-1 rounded-lg">{promo.code}</span>
                    {expired && <span className="text-xs text-red-400 font-semibold">Kadaluarsa</span>}
                  </div>
                  <p className="font-black text-[#1a1a1a]">{promo.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{promo.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-black text-[#F9C74F]">
                    {promo.type === "percentage" ? `${promo.value}%` : `Rp ${(promo.value / 1000).toFixed(0)}k`}
                  </p>
                  <p className="text-xs text-gray-400">off</p>
                </div>
              </div>

              {/* Terms */}
              <ul className="space-y-1 mb-4">
                {promo.terms.map((t) => (
                  <li key={t} className="text-xs text-gray-400 flex items-start gap-1.5">
                    <span className="text-[#178E81] mt-0.5">✓</span>{t}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">Berlaku s/d {new Date(promo.valid_until).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                {!expired && (
                  <button onClick={() => handleUse(promo.code)}
                    className="bg-[#F9C74F] text-black font-bold px-4 py-2 rounded-xl text-xs hover:bg-yellow-400 transition-colors">
                    Gunakan →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
