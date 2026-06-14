"use client";

import { useState } from "react";

const WD = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const atMidnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

interface Props {
  value: string;
  onChange: (s: string) => void;
  minDate: Date;
  maxDate: Date;
}

export default function DatePicker({ value, onChange, minDate, maxDate }: Props) {
  const min = atMidnight(minDate);
  const max = atMidnight(maxDate);
  const initial = value ? new Date(value) : min;
  const [view, setView] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Senin = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const monthStart = new Date(year, month, 1);
  const canPrev = monthStart > new Date(min.getFullYear(), min.getMonth(), 1);
  const canNext = monthStart < new Date(max.getFullYear(), max.getMonth(), 1);

  const todayStr = ymd(atMidnight(new Date()));
  const isSel = (d: Date) => value === ymd(d);
  const isDisabled = (d: Date) => d < min || d > max;

  return (
    <div className="rounded-2xl border-2 border-gray-100 p-3 sm:p-4">
      {/* Header bulan */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setView(new Date(year, month - 1, 1))}
          disabled={!canPrev}
          aria-label="Bulan sebelumnya"
          className="grid place-items-center h-8 w-8 rounded-lg border border-gray-200 text-[#1a1a1a] hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="font-bold text-[#1a1a1a] text-sm sm:text-base">{MONTHS[month]} {year}</span>
        <button
          type="button"
          onClick={() => setView(new Date(year, month + 1, 1))}
          disabled={!canNext}
          aria-label="Bulan berikutnya"
          className="grid place-items-center h-8 w-8 rounded-lg border border-gray-200 text-[#1a1a1a] hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Nama hari */}
      <div className="grid grid-cols-7 mb-1">
        {WD.map((w) => (
          <div key={w} className="text-center text-[10px] font-bold text-gray-400 py-1">{w}</div>
        ))}
      </div>

      {/* Tanggal */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) =>
          d === null ? (
            <div key={i} />
          ) : (
            <button
              key={i}
              type="button"
              disabled={isDisabled(d)}
              onClick={() => onChange(ymd(d))}
              className={`relative aspect-square rounded-lg text-sm font-semibold flex items-center justify-center transition-colors ${
                isSel(d)
                  ? "bg-[#F9C74F] text-black shadow-sm"
                  : isDisabled(d)
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-[#1a1a1a] hover:bg-[#F5EFE4]"
              }`}
            >
              {d.getDate()}
              {ymd(d) === todayStr && !isSel(d) && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#178E81]" />
              )}
            </button>
          )
        )}
      </div>
    </div>
  );
}
