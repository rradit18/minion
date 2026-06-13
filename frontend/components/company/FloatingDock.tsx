"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Scissors,
  Image as ImageIcon,
  MapPin,
  Info,
  CalendarCheck,
  LogIn,
} from "lucide-react";

const items = [
  { label: "Home", href: "/", Icon: Home },
  { label: "Barberman", href: "/barberman", Icon: Scissors },
  { label: "Gallery", href: "/gallery", Icon: ImageIcon },
  { label: "Branches", href: "/branches", Icon: MapPin },
  { label: "About", href: "/about", Icon: Info },
  { label: "Booking", href: "/booking", Icon: CalendarCheck, accent: true },
  { label: "Login", href: "/login", Icon: LogIn },
];

/**
 * Floating Dock (ala Aceternity) — navigasi melayang di bawah, khusus mobile/tablet.
 * Item terangkat & menampilkan label saat di-tap/hover.
 */
export default function FloatingDock() {
  const pathname = usePathname();
  const router = useRouter();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="lg:hidden fixed bottom-4 left-1/2 z-50 -translate-x-1/2 animate-dock-up">
      <div className="flex items-end gap-1 rounded-full border border-white/10 bg-[#1a1a1a]/95 px-2.5 py-2 shadow-[0_14px_44px_-10px_rgba(0,0,0,0.55)] backdrop-blur-md">
        {items.map((item, i) => {
          const isActive = pathname === item.href;
          const showLabel = hovered === i || (hovered === null && isActive);
          const isLifted = hovered === i;

          const circle = isActive
            ? "bg-[#F9C74F] text-[#1a1a1a]"
            : item.accent
            ? "bg-white/10 text-[#F9C74F] ring-2 ring-[#F9C74F]/50"
            : "bg-white/5 text-white/85 hover:bg-white/10";

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              onPointerEnter={() => setHovered(i)}
              onPointerLeave={() => setHovered(null)}
              onPointerDown={() => setHovered(i)}
              aria-label={item.label}
              className="relative flex items-center justify-center"
            >
              {/* Label tooltip */}
              <span
                className={`pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1a1a1a] px-2 py-1 text-[11px] font-display font-bold text-white shadow-lg ring-1 ring-white/10 transition-all duration-200 ${
                  showLabel ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                }`}
              >
                <span className="mr-1 text-[#F9C74F]">•</span>
                {item.label}
                <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#1a1a1a]" />
              </span>

              {/* Tombol bulat */}
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ease-out ${circle} ${
                  isLifted ? "-translate-y-1.5 scale-110" : ""
                }`}
              >
                <item.Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
