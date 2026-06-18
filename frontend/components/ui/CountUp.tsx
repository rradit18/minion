"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * Count Up (ala reactbits.dev) — angka menghitung naik saat masuk viewport.
 * Pakai IntersectionObserver + requestAnimationFrame, tanpa dependency.
 */
export default function CountUp({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
  className = "",
}: CountUpProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const startCount = () => {
      if (started.current) return;
      started.current = true;
      const startTime = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        setValue(Math.floor(eased * end));
        if (p < 1) requestAnimationFrame(tick);
        else setValue(end);
      };
      requestAnimationFrame(tick);
    };

    // IntersectionObserver guard — Safari 12.1+; older Safari starts immediately
    if (!("IntersectionObserver" in window)) {
      startCount();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) startCount(); },
      { threshold: 0.5 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}
