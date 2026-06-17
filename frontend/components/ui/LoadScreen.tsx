"use client";

import { useEffect, useState } from "react";

const fonts = [
  "var(--font-display)",
  "var(--font-glitch-bungee)",
  "var(--font-glitch-anton)",
  "var(--font-glitch-rubik)",
  "var(--font-glitch-pacifico)",
];

export default function LoadScreen() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [fontIdx, setFontIdx] = useState(0);

  useEffect(() => {
    setVisible(true);

    const fontInterval = setInterval(() => {
      setFontIdx(Math.floor(Math.random() * fonts.length));
    }, 140);

    const fadeTimer = setTimeout(() => setFading(true), 2000);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      clearInterval(fontInterval);
    }, 2500);

    return () => {
      clearInterval(fontInterval);
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#FAF7EE] flex flex-col items-center justify-center transition-transform duration-500 ease-in-out ${
        fading ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <span
        className="glitch text-[#1a1a1a] select-none"
        data-text="Minion"
        style={{
          fontFamily: fonts[fontIdx],
          fontSize: "clamp(2rem, 7vw, 4.5rem)",
          fontWeight: 900,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        Minion
      </span>
      <span
        className="text-[#1a1a1a]/30 text-[10px] font-bold tracking-[5px] uppercase mt-3"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Barbershop
      </span>
    </div>
  );
}
