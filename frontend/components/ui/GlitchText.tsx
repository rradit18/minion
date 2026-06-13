"use client";

import { useEffect, useState } from "react";

// Daftar font yang dipakai bergantian secara acak (efek glitch)
const fonts = [
  "var(--font-display)",
  "var(--font-glitch-bungee)",
  "var(--font-glitch-anton)",
  "var(--font-glitch-rubik)",
  "var(--font-glitch-pacifico)",
];

/**
 * GlitchText — teks dengan efek glitch (RGB split + jitter) yang
 * berganti font family secara acak setiap 0.5 detik.
 */
export default function GlitchText({ text, className = "" }: { text: string; className?: string }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    // Hormati pengguna yang mematikan animasi
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const id = setInterval(() => {
      setIdx((prev) => {
        let n = prev;
        while (n === prev) n = Math.floor(Math.random() * fonts.length);
        return n;
      });
    }, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={`glitch ${className}`} data-text={text} style={{ fontFamily: fonts[idx] }}>
      {text}
    </span>
  );
}
