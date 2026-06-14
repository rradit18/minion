"use client";

import React, { useEffect, useRef, useState } from "react";

export interface TimelineEntry {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

const clamp = (v: number, min = 0, max = 1) => Math.min(Math.max(v, min), max);

/**
 * Timeline ala Aceternity — rail kiri sticky dengan titik tahun,
 * dan garis progres yang terisi (ungu → teal) mengikuti scroll.
 */
export default function Timeline({ data }: { data: TimelineEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [fillHeight, setFillHeight] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (ref.current) setHeight(ref.current.getBoundingClientRect().height);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (ref.current) ro.observe(ref.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [data]);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrolled = window.innerHeight * 0.5 - rect.top;
      const frac = clamp(scrolled / (rect.height || 1));
      setFillHeight(frac * (rect.height || 0));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [height]);

  return (
    <div className="w-full">
      <div ref={ref} className="relative max-w-5xl mx-auto pb-12">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-10 md:pt-24 md:gap-10">
            {/* Rail kiri (sticky) */}
            <div className="sticky top-28 md:top-32 z-40 flex flex-col md:flex-row items-center self-start max-w-[60px] md:max-w-sm md:w-full">
              <div className="absolute left-2 md:left-2 h-10 w-10 rounded-full bg-[#FAF7EE] flex items-center justify-center shadow-sm ring-1 ring-gray-200">
                <div className="h-4 w-4 rounded-full bg-[#178E81] ring-4 ring-[#178E81]/20" />
              </div>
              <div className="hidden md:block md:pl-20">
                <h3 className="text-4xl lg:text-5xl font-black text-[#1a1a1a] leading-none">{item.title}</h3>
                {item.subtitle && (
                  <p className="mt-2 text-sm font-bold uppercase tracking-wider text-[#7B5EA7]">{item.subtitle}</p>
                )}
              </div>
            </div>

            {/* Konten kanan */}
            <div className="relative w-full pl-16 pr-2 md:pl-4">
              <div className="md:hidden mb-4">
                <h3 className="text-3xl font-black text-[#1a1a1a] leading-none">{item.title}</h3>
                {item.subtitle && (
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#7B5EA7]">{item.subtitle}</p>
                )}
              </div>
              {item.content}
            </div>
          </div>
        ))}

        {/* Garis track + progress */}
        <div
          style={{ height: height + "px" }}
          className="absolute left-[27px] top-0 w-[2px] overflow-hidden bg-gradient-to-b from-transparent via-gray-200 to-transparent"
        >
          <div
            style={{ height: fillHeight + "px" }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-[#7B5EA7] via-[#178E81] to-[#F9C74F]"
          />
        </div>
      </div>
    </div>
  );
}
