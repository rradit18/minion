"use client";

import { useState } from "react";

// ─── Data ───────────────────────────────────────────────────────────────────
interface Branch {
  name: string;
  address: string;
  tag?: string;
  tagColor?: string;
  lat: number;
  lng: number;
  todayClose: string;
  services: string[];
  hours: { label: string; time: string }[];
}

const branches: Branch[] = [
  {
    name: "Pramuka",
    address: "Jl. Pramuka, Perumahan Mekarsari Block A No. 11",
    tag: "Pusat",
    tagColor: "bg-[#F9C74F] text-[#1a1a1a]",
    lat: 0.9213,
    lng: 104.4567,
    todayClose: "21:00",
    services: ["Potong Rambut", "Cuci & Pijat Kepala", "Cukur Jenggot", "Hair Coloring", "Hot Towel Treatment"],
    hours: [
      { label: "Senin – Jumat", time: "10:00 – 21:00" },
      { label: "Sabtu – Minggu", time: "09:00 – 22:00" },
    ],
  },
  {
    name: "Kijang",
    address: "Jl. Kijang Lama, Tanjungpinang Timur",
    tag: "Cabang",
    tagColor: "bg-[#178E81] text-white",
    lat: 0.8430,
    lng: 104.5760,
    todayClose: "21:00",
    services: ["Potong Rambut", "Cuci & Pijat Kepala", "Cukur Jenggot", "Kids Haircut"],
    hours: [
      { label: "Senin – Jumat", time: "10:00 – 21:00" },
      { label: "Sabtu – Minggu", time: "10:00 – 21:00" },
    ],
  },
  {
    name: "Km. 9",
    address: "Jl. D.I. Panjaitan Km. 9, Tanjungpinang",
    tag: "Cabang",
    tagColor: "bg-[#178E81] text-white",
    lat: 0.9300,
    lng: 104.4800,
    todayClose: "21:00",
    services: ["Potong Rambut", "Cuci & Pijat Kepala", "Hair Tattoo", "Hot Towel Treatment"],
    hours: [
      { label: "Senin – Jumat", time: "10:00 – 21:00" },
      { label: "Sabtu – Minggu", time: "09:00 – 22:00" },
    ],
  },
  {
    name: "Ganet",
    address: "Jl. Raya Ganet, Tanjungpinang Timur",
    tag: "Baru Dibuka",
    tagColor: "bg-[#7B5EA7] text-white",
    lat: 0.9500,
    lng: 104.5200,
    todayClose: "20:00",
    services: ["Potong Rambut", "Cuci & Pijat Kepala", "Cukur Jenggot", "Hair Coloring"],
    hours: [
      { label: "Senin – Jumat", time: "10:00 – 20:00" },
      { label: "Sabtu – Minggu", time: "10:00 – 21:00" },
    ],
  },
];

type Tab = "layanan" | "jam";

// ─── Card ─────────────────────────────────────────────────────────────────────
function BranchCard({
  branch,
  active,
  expanded,
  onSelect,
  onToggle,
}: {
  branch: Branch;
  active: boolean;
  expanded: boolean;
  onSelect: () => void;
  onToggle: () => void;
}) {
  const [tab, setTab] = useState<Tab>("layanan");
  const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`;

  return (
    <article
      onClick={onSelect}
      className={`cursor-pointer rounded-2xl bg-white p-5 transition-all duration-300 ${
        active
          ? "ring-2 ring-[#F9C74F] shadow-xl"
          : "border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-black text-[#1a1a1a] leading-tight">
              Cabang «{branch.name}»
            </h3>
            {branch.tag && (
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${branch.tagColor}`}>
                {branch.tag}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 leading-snug">{branch.address}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-[9px] uppercase tracking-wide text-gray-400 font-bold">hari ini</div>
          <div className="text-sm font-bold text-[#1a1a1a] border-b-2 border-[#F9C74F] inline-block leading-tight">
            s/d {branch.todayClose}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <a
          href={routeUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 bg-[#F9C74F] text-[#1a1a1a] text-[11px] font-extrabold uppercase tracking-wide px-4 py-2 rounded-md hover:bg-yellow-400 transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.5 2 2-6.5L18 2l4 4L9 20z" />
          </svg>
          Bangun Rute
        </a>
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className="text-[11px] font-bold text-[#178E81] hover:underline px-2 py-2"
        >
          {expanded ? "Sembunyikan" : "Detail"}
        </button>
      </div>

      {/* Expanded: tabs */}
      {expanded && (
        <div className="mt-4 border-t border-gray-100 pt-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex gap-6 border-b border-gray-100 mb-3">
            {([["layanan", "Layanan"], ["jam", "Jam Buka"]] as [Tab, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`relative pb-2 text-sm font-bold transition-colors ${
                  tab === key ? "text-[#1a1a1a]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {label}
                {tab === key && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-[#F9C74F] rounded-full" />}
              </button>
            ))}
          </div>

          {tab === "layanan" ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {branch.services.map((s) => (
                <li key={s} className="flex items-center gap-2 text-[13px] text-[#1a1a1a]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#178E81] flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          ) : (
            <table className="w-full text-[13px]">
              <tbody>
                {branch.hours.map((h) => (
                  <tr key={h.label} className="border-b border-gray-50 last:border-0">
                    <td className="py-2 text-gray-500">{h.label}</td>
                    <td className="py-2 text-right font-semibold text-[#1a1a1a]">{h.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BranchesPage() {
  const [mapIdx, setMapIdx] = useState(0);
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const active = branches[mapIdx];
  const mapSrc = `https://maps.google.com/maps?q=${active.lat},${active.lng}&z=15&hl=id&output=embed`;

  const handleSelect = (i: number) => {
    setMapIdx(i);
    setOpenIdx(i);
  };
  const handleToggle = (i: number) => {
    setMapIdx(i);
    setOpenIdx((prev) => (prev === i ? null : i));
  };

  return (
    <div className="min-h-screen bg-[#FAF7EE]">
      {/* ── Header ── */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <p className="text-xs font-bold tracking-[0.2em] text-[#178E81] uppercase mb-2">Temukan Kami</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1a1a1a] mb-2">Cabang Terdekat</h1>
        <p className="text-gray-500 text-sm max-w-lg leading-relaxed">
          Pilih cabang untuk melihat layanan, jam buka, dan rute menuju lokasi.
        </p>
      </div>

      {/* ── Finder: Map + Cards ── */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(360px,420px)] gap-5">

          {/* Map */}
          <div className="relative h-[300px] sm:h-[400px] lg:h-[600px] rounded-2xl overflow-hidden border border-gray-100 shadow-sm order-1 lg:sticky lg:top-6 lg:self-start">
            <iframe
              key={mapIdx}
              title={`Peta cabang ${active.name}`}
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="w-full h-full"
            />
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur rounded-lg px-3 py-1.5 shadow-md pointer-events-none">
              <span className="text-[11px] font-bold text-[#1a1a1a]">📍 Cabang «{active.name}»</span>
            </div>
          </div>

          {/* Cards list */}
          <div className="order-2 flex flex-col gap-4 px-1 py-1 lg:max-h-[600px] lg:overflow-y-auto lg:pr-2 lg:[scrollbar-width:thin]">
            {branches.map((branch, i) => (
              <BranchCard
                key={branch.name}
                branch={branch}
                active={i === mapIdx}
                expanded={i === openIdx}
                onSelect={() => handleSelect(i)}
                onToggle={() => handleToggle(i)}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
