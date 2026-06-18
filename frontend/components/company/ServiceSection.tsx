"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconScissors = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);
const IconDroplet = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M12 2.5S5 9.5 5 14a7 7 0 0 0 14 0c0-4.5-7-11.5-7-11.5z" />
  </svg>
);
const IconRazor = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M3 3l7 7" /><path d="M14 7l4 4-7 7a3 3 0 0 1-4-4z" /><path d="M14 7l3-3a2 2 0 0 1 3 3l-3 3" />
  </svg>
);
const IconPalette = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <circle cx="13.5" cy="6.5" r="1.2" fill="currentColor" /><circle cx="17.5" cy="10.5" r="1.2" fill="currentColor" /><circle cx="8.5" cy="7.5" r="1.2" fill="currentColor" /><circle cx="6.5" cy="12.5" r="1.2" fill="currentColor" />
    <path d="M12 2a10 10 0 1 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.2 0-1.1.9-2 2-2h2.4A4.6 4.6 0 0 0 22 11 10 10 0 0 0 12 2z" />
  </svg>
);
const IconSmile = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <circle cx="12" cy="12" r="9" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);
const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

interface Service {
  icon: React.ReactNode;
  name: string;
  desc: string;
  duration: string;
  accent: string;
  popular?: boolean;
}

const STATIC_SERVICES: Service[] = [
  { icon: <IconScissors />, name: "Potong Rambut",   desc: "Konsultasi gaya + potongan presisi sesuai bentuk wajah.",   duration: "30 mnt", accent: "#178E81" },
  { icon: <IconDroplet />,  name: "Cut + Wash",      desc: "Potong rambut plus keramas & pijat kepala relaksasi.",       duration: "45 mnt", accent: "#7B5EA7" },
  { icon: <IconRazor />,   name: "Cukur Jenggot",   desc: "Rapikan & bentuk jenggot dengan hot towel treatment.",       duration: "20 mnt", accent: "#E76F51" },
  { icon: <IconStar />,    name: "Complete Package", desc: "Cukur + keramas + jenggot + hot towel + styling lengkap.",  duration: "60 mnt", accent: "#F9C74F", popular: true },
  { icon: <IconPalette />, name: "Hair Coloring",    desc: "Pewarnaan rambut profesional, warna tahan lama & merata.",  duration: "90 mnt", accent: "#0EA5E9" },
  { icon: <IconSmile />,   name: "Kids Haircut",     desc: "Potongan ramah anak — sabar, nyaman, dan tetap rapi.",      duration: "25 mnt", accent: "#EC4899" },
];

const ACCENTS = ["#178E81", "#7B5EA7", "#E76F51", "#F9C74F", "#0EA5E9", "#EC4899"];

function iconForService(name: string): React.ReactNode {
  const n = name.toLowerCase();
  if (n.includes("jenggot") || n.includes("beard")) return <IconRazor />;
  if (n.includes("wash") || n.includes("keramas"))  return <IconDroplet />;
  if (n.includes("warna") || n.includes("color"))   return <IconPalette />;
  if (n.includes("kids") || n.includes("anak"))     return <IconSmile />;
  if (n.includes("complete") || n.includes("paket") || n.includes("package")) return <IconStar />;
  return <IconScissors />;
}

function ServiceCard({ s }: { s: Service }) {
  return (
    <div
      className={`relative w-[250px] sm:w-[280px] shrink-0 bg-white rounded-2xl border p-5 lg:p-3 flex flex-col ${s.popular ? "border-[#F9C74F] ring-1 ring-[#F9C74F]" : "border-gray-100"
        }`}
    >
      {s.popular && (
        <span className="absolute -top-2.5 right-4 bg-[#F9C74F] text-[#1a1a1a] text-[10px] font-bold px-3 py-0.5 rounded-full shadow-sm">
          Paling Laris
        </span>
      )}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `${s.accent}1A`, color: s.accent }}
        >
          {s.icon}
        </div>
        <span className="text-[11px] font-semibold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
          {s.duration}
        </span>
      </div>
      <h3 className="font-display font-bold text-lg text-[#1a1a1a] mb-1">{s.name}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
    </div>
  );
}

export default function ServiceSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const drag = useRef({ active: false, startX: 0, startScroll: 0 });
  // null = masih loading; [] = sudah load tapi kosong → empty state
  const [services, setServices] = useState<Service[] | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'}/services`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((json) => {
        const data: Record<string, unknown>[] = json?.data ?? [];
        setServices(
          data.map((s, i) => ({
            icon:     iconForService(String(s.name)),
            name:     String(s.name),
            desc:     String(s.description ?? ""),
            duration: `${s.duration_minutes ?? 30} mnt`,
            accent:   ACCENTS[i % ACCENTS.length],
          }))
        );
      })
      // Backend down → pakai daftar layanan cadangan
      .catch(() => setServices(STATIC_SERVICES));
  }, []);

  const list = services ?? [];
  const isEmpty = services !== null && services.length === 0;

  // Auto-geser ke kiri secara infinite (konten diduplikasi agar mulus)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const step = () => {
      const half = el.scrollWidth / 2;
      if (half > 0) {
        if (!drag.current.active) el.scrollLeft += 0.6;
        if (el.scrollLeft >= half) el.scrollLeft -= half;
        else if (el.scrollLeft < 0) el.scrollLeft += half;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft };
    el.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const el = trackRef.current;
    if (!el) return;
    el.scrollLeft = drag.current.startScroll - (e.clientX - drag.current.startX);
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    trackRef.current?.releasePointerCapture?.(e.pointerId);
  };

  return (
    <section id="layanan" className="scroll-mt-24 py-14 md:py-20 overflow-hidden">
      {/* Heading */}
      <div className="max-w-7xl mx-auto px-6 mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#178E81] text-xs font-bold tracking-[0.2em] uppercase">Layanan Kami</span>
            <svg viewBox="0 0 60 14" className="w-10 h-3" fill="none">
              <path d="M2 7 Q9 1 16 7 T30 7 T44 7 T58 7" stroke="#7B5EA7" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[#1a1a1a] leading-tight">
            Pilih layanan,<br className="sm:hidden" /> kami yang <span className="text-[#7B5EA7]">rapiin.</span>
          </h2>
        </div>
        <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
          Semua layanan ditangani maestro berpengalaman dengan alat steril dan standar premium.
          <span className="hidden sm:inline"> Geser untuk lihat semua.</span>
        </p>
      </div>

      {/* Marquee — auto geser ke kiri, bisa di-drag */}
      {isEmpty ? (
        <EmptyState
          emoji="✂️"
          title="Menu layanan lagi digunting-gunting"
          subtitle="Daftar layanan andalan kami segera tayang. Sabar ya, biar makin rapi!"
        />
      ) : (
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
          style={{ touchAction: "pan-y" }}
          className="no-scrollbar flex gap-5 overflow-x-auto px-6 py-3 cursor-grab active:cursor-grabbing select-none"
        >
          {[...list, ...list].map((s, i) => (
            <ServiceCard key={i} s={s} />
          ))}
        </div>
      )}

      {/* Footer link */}
      <div className="max-w-7xl mx-auto px-6 mt-8 text-center">
        <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold text-[#178E81] hover:underline">
          Lihat juga produk perawatan kami <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
