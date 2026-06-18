"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/src/lib/auth";

interface Promo {
  id: string;
  code: string;
  name: string;
  discount_type: string;
  discount_value: number | string;
  valid_until: string;
  min_order: number | string | null;
}

const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

export default function PromoPage() {
  const [promos, setPromos] = useState<Promo[] | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Promo[]>("/customer/promos").then((r) => setPromos(r.data ?? []));
  }, []);

  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const discountLabel = (p: Promo) =>
    p.discount_type === "percentage" ? `${Number(p.discount_value)}%` : `Rp ${(Number(p.discount_value) / 1000).toFixed(0)}k`;

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-black text-[#1a1a1a]">Promo & Voucher</h2>

      {promos === null ? (
        <p className="text-gray-400 text-sm py-12 text-center">Memuat promo…</p>
      ) : promos.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <p className="text-4xl mb-3">🎟️</p>
          <p className="text-gray-400 font-medium">Belum ada promo aktif saat ini.</p>
          <p className="text-gray-400 text-xs mt-1">Pantau terus — promo seru bakal muncul di sini!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {promos.map((promo) => (
            <div key={promo.id} className="bg-white rounded-2xl border-2 border-gray-100 hover:border-[#F9C74F] p-4 sm:p-5 transition-all">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <span className="bg-[#1a1a1a] text-[#F9C74F] font-mono font-black text-xs px-2.5 py-1 rounded-lg inline-block mb-2">{promo.code}</span>
                  <p className="font-black text-[#1a1a1a] text-sm sm:text-base">{promo.name}</p>
                  {promo.min_order != null && Number(promo.min_order) > 0 && (
                    <p className="text-xs text-gray-500 mt-1">Min. transaksi {fmt(Number(promo.min_order))}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl sm:text-2xl font-black text-[#F9C74F]">{discountLabel(promo)}</p>
                  <p className="text-xs text-gray-400">off</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">Berlaku s/d {new Date(promo.valid_until).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                <button onClick={() => copy(promo.code)}
                  className="bg-[#F9C74F] text-black font-bold px-4 py-2 rounded-xl text-xs hover:bg-yellow-400 transition-colors">
                  {copied === promo.code ? "✓ Disalin" : "Salin Kode"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 text-center px-6">
        Tunjukkan kode promo ke kasir saat pembayaran untuk mendapatkan potongan.
      </p>
    </div>
  );
}
