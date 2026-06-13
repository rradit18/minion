"use client";

import { useState } from "react";

export interface TooltipItem {
  id: number;
  name: string;
  designation: string;
  image: string;
}

/**
 * Animated Tooltip (ala Aceternity UI) — avatar terangkat & tooltip muncul saat hover.
 * Pure React + CSS, tanpa dependency.
 */
export default function AnimatedTooltip({ items }: { items: TooltipItem[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex -space-x-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="relative"
          onMouseEnter={() => setHovered(item.id)}
          onMouseLeave={() => setHovered(null)}
        >
          {hovered === item.id && (
            <div className="animate-tooltip-in absolute -top-[58px] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center whitespace-nowrap rounded-lg bg-[#1a1a1a] px-3 py-1.5 shadow-xl">
              <span className="font-display text-[12px] font-bold text-white">{item.name}</span>
              <span className="text-[10px] text-[#F9C74F]">{item.designation}</span>
              {/* panah bawah */}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-[#1a1a1a]" />
            </div>
          )}
          <img
            src={item.image}
            alt={item.name}
            className="relative h-9 w-9 rounded-full border-2 border-white object-cover transition duration-300 hover:z-30 hover:scale-110"
          />
        </div>
      ))}
    </div>
  );
}
