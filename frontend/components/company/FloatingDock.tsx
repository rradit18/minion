"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Scissors,
  Image as ImageIcon,
  MapPin,
  Info,
  CalendarCheck,
  LogIn,
  UserPlus,
  ShoppingBag,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";

interface DockItem {
  label: string;
  href: string;
  Icon: LucideIcon;
  accent?: boolean;
}

// Selalu tampil
const primary: DockItem[] = [
  { label: "Home", href: "/", Icon: Home },
  { label: "Booking", href: "/booking", Icon: CalendarCheck, accent: true },
];

// Muncul saat di-expand
const secondary: DockItem[] = [
  { label: "Barberman", href: "/barberman", Icon: Scissors },
  { label: "Gallery", href: "/gallery", Icon: ImageIcon },
  { label: "Products", href: "/products", Icon: ShoppingBag },
  { label: "Branches", href: "/branches", Icon: MapPin },
  { label: "About", href: "/about", Icon: Info },
  { label: "Login", href: "/login", Icon: LogIn },
  { label: "Sign Up", href: "/signup", Icon: UserPlus },
];

/**
 * Floating Dock (ala Aceternity) — khusus mobile/tablet.
 * Default: Home, Booking, Login + tombol "more".
 * Tekan tombol untuk mengembangkan menu lainnya ke atas.
 */
export default function FloatingDock() {
  const pathname = usePathname();
  const router = useRouter();
  const [hovered, setHovered] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const go = (href: string) => {
    router.push(href);
    setExpanded(false);
  };

  // Auto-close: tap di luar dock atau saat halaman di-scroll
  useEffect(() => {
    if (!expanded) return;
    const onOutside = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setExpanded(false);
    };
    const onScroll = () => setExpanded(false);
    document.addEventListener("pointerdown", onOutside);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", onOutside);
      window.removeEventListener("scroll", onScroll);
    };
  }, [expanded]);

  return (
    <>
      {/* Backdrop glassmorphism — blur konten di belakang saat expand */}
      <div
        onClick={() => setExpanded(false)}
        aria-hidden
        className={`lg:hidden fixed inset-0 z-40 bg-[#1a1a1a]/10 backdrop-blur-md transition-opacity duration-300 ${
          expanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div ref={rootRef} className="lg:hidden fixed bottom-4 left-1/2 z-50 -translate-x-1/2 flex flex-col items-center gap-3 animate-dock-up">

      {/* ── Menu tambahan (expand ke atas) ── */}
      <div
        className={`flex flex-col items-stretch gap-2 transition-all duration-300 ease-out ${
          expanded ? "opacity-100 translate-y-0 pointer-events-auto" : "translate-y-3 opacity-0 pointer-events-none"
        }`}
      >
        {secondary.map((item, i) => {
          const isActive = pathname === item.href;
          return (
            <button
              key={item.href}
              onClick={() => go(item.href)}
              style={{ transitionDelay: expanded ? `${(secondary.length - 1 - i) * 45}ms` : "0ms" }}
              className={`flex items-center gap-2.5 rounded-full border border-white/10 bg-[#1a1a1a]/95 py-1.5 pl-1.5 pr-4 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.55)] backdrop-blur-md transition-all duration-300 ${
                expanded ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              <span className={`grid h-9 w-9 place-items-center rounded-full ${isActive ? "bg-[#F9C74F] text-[#1a1a1a]" : "bg-white/5 text-white/85"}`}>
                <item.Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>
              <span className="font-display text-sm font-bold text-white whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Dock utama ── */}
      <div className="flex items-end gap-1 rounded-full border border-white/10 bg-[#1a1a1a]/95 px-2.5 py-2 shadow-[0_14px_44px_-10px_rgba(0,0,0,0.55)] backdrop-blur-md">
        {primary.map((item, i) => {
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
              onClick={() => go(item.href)}
              onPointerEnter={() => setHovered(i)}
              onPointerLeave={() => setHovered(null)}
              onPointerDown={() => setHovered(i)}
              aria-label={item.label}
              className="relative flex items-center justify-center"
            >
              <span
                className={`pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1a1a1a] px-2 py-1 text-[11px] font-display font-bold text-white shadow-lg ring-1 ring-white/10 transition-all duration-200 ${
                  showLabel ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                }`}
              >
                <span className="mr-1 text-[#F9C74F]">•</span>
                {item.label}
                <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#1a1a1a]" />
              </span>

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

        {/* Pemisah */}
        <span className="mx-0.5 h-6 w-px self-center bg-white/10" />

        {/* Tombol expand / collapse (hamburger ⇄ X) */}
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? "Tutup menu" : "Menu lainnya"}
          aria-expanded={expanded}
          className="flex items-center justify-center"
        >
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 ease-out ${
              expanded ? "bg-white text-[#1a1a1a]" : "bg-white/5 text-white/85 hover:bg-white/10"
            }`}
          >
            {expanded ? <X className="h-[18px] w-[18px]" strokeWidth={2.5} /> : <Menu className="h-[18px] w-[18px]" strokeWidth={2.5} />}
          </span>
        </button>
      </div>
      </div>
    </>
  );
}
