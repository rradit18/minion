"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Barber } from "@/src/lib/mockData";

interface Props {
  barbers: Barber[];
  value: Barber | null;
  onChange: (b: Barber) => void;
}

export default function BarberOrbit({ barbers, value, onChange }: Props) {
  const n = barbers.length;
  const [active, setActive] = useState(0);
  const [scale, setScale] = useState(1);
  const drag = useRef({ active: false, startX: 0, moved: false });

  // Default pilih barber pertama bila belum ada
  useEffect(() => {
    if (!value && barbers[0]) onChange(barbers[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sinkron dengan value dari luar
  useEffect(() => {
    if (value) {
      const idx = barbers.findIndex((b) => b.id === value.id);
      if (idx >= 0 && idx !== active) setActive(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Clamp bila daftar berubah
  useEffect(() => { if (active > n - 1) setActive(0); }, [n, active]);

  // Skala responsif
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setScale(w < 380 ? 0.62 : w < 640 ? 0.78 : w < 1024 ? 0.92 : 1);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  if (n === 0) {
    return <p className="text-gray-400 text-sm py-10 text-center">Belum ada barber di cabang ini.</p>;
  }

  const select = (i: number) => {
    const idx = Math.max(0, Math.min(n - 1, i));
    setActive(idx);
    onChange(barbers[idx]);
  };

  const onDown = (e: React.PointerEvent) => { drag.current = { active: true, startX: e.clientX, moved: false }; };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 44) {
      select(active + (dx < 0 ? 1 : -1));
      drag.current.startX = e.clientX;
      drag.current.moved = true;
    }
  };
  const onUp = () => { drag.current.active = false; };

  // ── Geometri orbit ──
  const STEP = (27 * Math.PI) / 180;
  const R = 230 * scale;
  const APEX_Y = 58 * scale;
  const maxVisible = scale < 0.85 ? 1 : 2; // mobile: 3 avatar, desktop: 5

  const pos = (offset: number) => ({
    x: R * Math.sin(offset * STEP),
    y: APEX_Y + R * (1 - Math.cos(offset * STEP)),
  });
  const sizeFor = (offset: number) => (offset === 0 ? 116 : Math.abs(offset) === 1 ? 80 : 56) * scale;

  const visible = barbers
    .map((b, i) => ({ b, i, offset: i - active }))
    .filter((o) => Math.abs(o.offset) <= maxVisible);

  const offsets = visible.map((o) => o.offset);
  const minO = Math.min(...offsets);
  const maxO = Math.max(...offsets);
  const pL = pos(minO);
  const pR = pos(maxO);
  const linePath = visible.length > 1 ? `M ${pL.x} ${pL.y} A ${R} ${R} 0 0 1 ${pR.x} ${pR.y}` : "";

  const stageH = APEX_Y + R * (1 - Math.cos(maxVisible * STEP)) + (56 * scale) / 2 + 20;
  const activeBarber = barbers[Math.min(active, n - 1)];

  return (
    <div className="select-none">
      {/* ── Stage orbit ── */}
      <div
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        style={{ height: stageH, touchAction: "pan-y" }}
        className="relative cursor-grab active:cursor-grabbing"
      >
        {/* Garis orbit */}
        <svg className="absolute left-1/2 top-0 overflow-visible" style={{ width: 1, height: 1 }} aria-hidden>
          {linePath && (
            <path d={linePath} fill="none" stroke="#dcd3c0" strokeWidth={2} strokeDasharray="2 7" strokeLinecap="round" />
          )}
        </svg>

        {/* Avatar (urut: center digambar terakhir agar di atas) */}
        {visible
          .slice()
          .sort((a, b) => Math.abs(b.offset) - Math.abs(a.offset))
          .map(({ b, i, offset }) => {
            const { x, y } = pos(offset);
            const sz = sizeFor(offset);
            const isC = offset === 0;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => { if (!drag.current.moved) select(i); }}
                style={{
                  left: "50%",
                  top: 0,
                  width: sz,
                  height: sz,
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                  zIndex: 20 - Math.abs(offset),
                }}
                className="absolute outline-none"
                aria-label={b.name}
              >
                <span
                  className={`absolute inset-0 rounded-full overflow-hidden flex items-center justify-center ${b.color} ring-4 transition-all ${
                    isC ? "ring-[#F9C74F] shadow-xl" : "ring-white/90 shadow-md opacity-90"
                  }`}
                >
                  <span className="text-white font-black" style={{ fontSize: sz * 0.4 }}>{b.name[0]}</span>
                  <img
                    src={b.image}
                    alt={b.name}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </span>
                {isC && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-10 grid place-items-center w-5 h-5 rounded-full bg-[#178E81] text-white shadow-md">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </span>
                )}
              </button>
            );
          })}
      </div>

      {/* ── Info barber aktif ── */}
      <div className="text-center mt-3">
        <h3 className="font-black text-xl text-[#1a1a1a] leading-tight">{activeBarber.name}</h3>
        <p className="text-[#178E81] font-bold text-sm">{activeBarber.nickname}</p>
        <p className="text-xs text-gray-500 mt-1">{activeBarber.specialty} · {activeBarber.experience_years} tahun</p>
        <p className="text-xs text-gray-400 mt-1">
          <span className="text-[#F9C74F]">★</span> {activeBarber.rating} ({activeBarber.total_reviews.toLocaleString()} review)
        </p>
        {activeBarber.skills?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 mt-3">
            {activeBarber.skills.map((s) => (
              <span key={s} className="bg-[#F5EFE4] text-[#1a1a1a] text-[11px] font-semibold px-3 py-1 rounded-full">{s}</span>
            ))}
          </div>
        )}
      </div>

      {/* ── Kontrol: panah + dots ── */}
      <div className="flex items-center justify-center gap-4 mt-5">
        <button
          type="button"
          onClick={() => select(active - 1)}
          disabled={active === 0}
          aria-label="Barber sebelumnya"
          className="grid place-items-center h-10 w-10 rounded-full border border-gray-200 bg-white text-[#1a1a1a] hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex items-center gap-1.5">
          {barbers.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => select(i)}
              aria-label={`Pilih barber ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === active ? "w-5 bg-[#F9C74F]" : "w-2 bg-gray-300 hover:bg-gray-400"}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => select(active + 1)}
          disabled={active === n - 1}
          aria-label="Barber berikutnya"
          className="grid place-items-center h-10 w-10 rounded-full border border-gray-200 bg-white text-[#1a1a1a] hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}
