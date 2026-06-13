"use client";

import { useState } from "react";

export default function AnnouncementBar() {
  const [show, setShow] = useState(true);
  if (!show) return null;

  return (
    <div
      className="bg-[#178E81] text-white flex items-center justify-center relative"
      style={{ height: "40px" }}
    >
      <span className="text-[13px] font-semibold">Promo Hari Ini! </span>
      <button
        onClick={() => setShow(false)}
        className="absolute right-4 text-white/80 hover:text-white transition text-lg leading-none"
        aria-label="Tutup banner"
      >
        ✕
      </button>
    </div>
  );
}
