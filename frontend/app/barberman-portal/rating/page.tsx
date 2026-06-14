"use client";

import { useState } from "react";
import { fetchRatings } from "@/src/lib/mockData";

export default function RatingPage() {
  const data = fetchRatings();
  const months = [...new Set(data.reviews.map((r) => r.bulan))];
  const [selectedMonth, setSelectedMonth] = useState("Semua");

  const filtered = selectedMonth === "Semua"
    ? data.reviews
    : data.reviews.filter((r) => r.bulan === selectedMonth);

  const avg = filtered.reduce((s, r) => s + r.rating, 0) / (filtered.length || 1);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-[#1a1a1a]">Rating & Review</h2>

      {/* Summary */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 flex items-center gap-6">
        <div className="text-center">
          <p className="text-5xl font-black text-[#F9C74F]">{data.overall_rating}</p>
          <div className="flex justify-center gap-0.5 mt-1">
            {[1,2,3,4,5].map((n) => <span key={n} className={`text-sm ${n <= Math.round(data.overall_rating) ? "text-[#F9C74F]" : "text-gray-600"}`}>★</span>)}
          </div>
          <p className="text-gray-400 text-xs mt-1">{data.total_reviews.toLocaleString()} review</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5,4,3,2,1].map((n) => {
            const count = data.distribution[String(n) as keyof typeof data.distribution] ?? 0;
            const pct   = Math.round(count / data.total_reviews * 100);
            return (
              <div key={n} className="flex items-center gap-2 text-xs">
                <span className="text-gray-400 w-3">{n}</span>
                <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-[#F9C74F] rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-gray-400 w-8 text-right">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["Semua", ...months].map((m) => (
          <button key={m} onClick={() => setSelectedMonth(m)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${selectedMonth === m ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"}`}>
            {m}
          </button>
        ))}
      </div>

      {/* Reviews */}
      <div className="space-y-3">
        {filtered.slice(0, 10).map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((n) => <span key={n} className={`text-sm ${n <= r.rating ? "text-[#F9C74F]" : "text-gray-200"}`}>★</span>)}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">{r.date}</p>
                <p className="text-xs text-[#178E81] font-semibold">{r.service}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 italic">"{r.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}
