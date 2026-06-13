"use client";

import { useState } from "react";

// Pesan promo yang berjalan
const messages = [
  { icon: "✂️", text: "Promo Hari Ini! Potong rambut mulai Rp 35.000" },
  { icon: "⭐", text: "Booking online sekarang & dapat diskon spesial" },
  { icon: "🔥", text: "Gratis cuci rambut setiap hari Jumat" },
  { icon: "💈", text: "4 cabang siap melayani di Tanjungpinang" },
];

// Pemisah antar pesan
const Separator = () => (
  <svg viewBox="0 0 24 24" className="w-3 h-3 mx-5 shrink-0 text-[#F9C74F]" fill="currentColor" aria-hidden>
    <path d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z" />
  </svg>
);

const Track = () => (
  <div className="flex items-center shrink-0">
    {messages.map((m, i) => (
      <div key={i} className="flex items-center shrink-0">
        <span className="text-[13px] font-semibold tracking-wide whitespace-nowrap">
          <span className="mr-1.5">{m.icon}</span>
          {m.text}
        </span>
        <Separator />
      </div>
    ))}
  </div>
);

export default function AnnouncementBar() {
  const [show, setShow] = useState(true);
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => setShow(false), 350);
  };

  if (!show) return null;

  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        closing ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
      }`}
    >
      <div className="relative h-10 bg-gradient-to-r from-[#0F7268] via-[#1AA491] to-[#0F7268] text-white animate-ann-down">
        {/* Shimmer kilau */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-ann-shimmer absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>

        {/* Marquee */}
        <div className="marquee-group relative h-full flex items-center overflow-hidden px-10">
          {/* fade tepi kiri & kanan */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-12 z-10 bg-gradient-to-r from-[#0F7268] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-16 z-10 bg-gradient-to-l from-[#0F7268] to-transparent" />

          <div className="animate-marquee flex items-center min-w-max will-change-transform">
            <Track />
            <Track />
          </div>
        </div>

        {/* Tombol tutup */}
        <button
          onClick={handleClose}
          aria-label="Tutup banner"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white/90 hover:text-white transition-all duration-300 hover:rotate-90"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <path d="M6 6 L18 18 M18 6 L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
