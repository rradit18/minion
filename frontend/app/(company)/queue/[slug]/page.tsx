"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/src/lib/auth";

interface QueueItem {
  booking_number: string;
  customer_name: string;
  barber: string;
  scheduled_at: string;
  status: string;
}

const STATUS_META: Record<string, { label: string; cls: string; dot: string }> = {
  pending_confirmation: { label: "Menunggu", cls: "bg-amber-100 text-amber-700", dot: "bg-amber-400" },
  confirmed:            { label: "Dikonfirmasi", cls: "bg-teal-100 text-teal-700", dot: "bg-teal-500" },
  in_progress:          { label: "Sedang Potong", cls: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
};

export default function QueuePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [queue, setQueue] = useState<QueueItem[] | null>(null);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchQueue = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    const res = await apiFetch<QueueItem[]>(`/queue/${slug}`);
    if (!res.ok) {
      setError(res.message || "Cabang tidak ditemukan.");
      if (!silent) setRefreshing(false);
      return;
    }
    setQueue(res.data ?? []);
    setLastUpdated(new Date());
    setError("");
    if (!silent) setRefreshing(false);
  }, [slug]);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(() => fetchQueue(true), 30_000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  const inProgress = queue?.find((q) => q.status === "in_progress");
  const waiting = queue?.filter((q) => q.status !== "in_progress") ?? [];

  return (
    <div className="relative min-h-screen bg-[#F5EFE4]">
      <div aria-hidden className="fixed inset-0 -z-10 bg-[url('/ui/pattern.png')] bg-repeat opacity-30" />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#1a1a1a] transition-colors mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Beranda
        </Link>

        <div className="flex items-start justify-between gap-3 mb-6">
          <div>
            <p className="text-[#178E81] text-xs font-extrabold tracking-[3px] uppercase mb-1">Live Queue</p>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1a1a1a] leading-tight capitalize">
              Antrian {slug?.replace(/-/g, " ")}
            </h1>
            {lastUpdated && (
              <p className="text-gray-400 text-xs mt-1">
                Update terakhir: {lastUpdated.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </p>
            )}
          </div>
          <button
            onClick={() => fetchQueue()}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-400 transition-colors disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-600 font-bold">{error}</p>
            <Link href="/" className="inline-block mt-4 text-sm text-gray-500 hover:text-[#1a1a1a]">Kembali ke Beranda</Link>
          </div>
        ) : queue === null ? (
          <p className="text-gray-400 text-sm py-16 text-center">Memuat antrian…</p>
        ) : queue.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="text-5xl mb-4">✂️</div>
            <p className="text-gray-500 font-bold text-lg">Antrian Kosong</p>
            <p className="text-gray-400 text-sm mt-1">Belum ada booking untuk hari ini.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Sedang diproses */}
            {inProgress && (
              <div className="bg-[#1a1a1a] rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                  </span>
                  <span className="text-[11px] font-extrabold tracking-[2px] uppercase text-green-400">Sedang Diproses</span>
                </div>
                <p className="font-black text-xl text-white">{inProgress.customer_name}</p>
                <p className="text-white/60 text-sm mt-1">
                  {inProgress.barber} · {new Date(inProgress.scheduled_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                </p>
                <p className="font-mono text-[#F9C74F] text-xs mt-2">{inProgress.booking_number}</p>
              </div>
            )}

            {/* Antrian menunggu */}
            {waiting.length > 0 && (
              <div>
                <p className="text-xs font-extrabold tracking-[2px] uppercase text-gray-500 mb-3">
                  Menunggu ({waiting.length})
                </p>
                <div className="space-y-2">
                  {waiting.map((item, idx) => {
                    const meta = STATUS_META[item.status] ?? { label: item.status, cls: "bg-gray-100 text-gray-600", dot: "bg-gray-400" };
                    return (
                      <div key={item.booking_number} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-[#F5EFE4] text-[#1a1a1a] flex items-center justify-center text-sm font-black flex-shrink-0">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#1a1a1a] text-sm truncate">{item.customer_name}</p>
                          <p className="text-xs text-gray-500">
                            {item.barber} · {new Date(item.scheduled_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex-shrink-0 ${meta.cls}`}>
                          {meta.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <p className="text-center text-xs text-gray-400 pt-2">
              Halaman ini otomatis diperbarui setiap 30 detik.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
