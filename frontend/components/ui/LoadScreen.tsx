"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fonts = [
  "var(--font-display)",
  "var(--font-glitch-bungee)",
  "var(--font-glitch-anton)",
  "var(--font-glitch-rubik)",
  "var(--font-glitch-pacifico)",
];

export default function LoadScreen() {
  const [visible, setVisible] = useState(true);
  const [fontIdx, setFontIdx] = useState(0);

  useEffect(() => {
    const fontInterval = setInterval(() => {
      setFontIdx(Math.floor(Math.random() * fonts.length));
    }, 140);

    const hideTimer = setTimeout(() => {
      setVisible(false);
      clearInterval(fontInterval);
    }, 2000);

    return () => {
      clearInterval(fontInterval);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loadscreen"
          className="fixed inset-0 z-[99999] bg-[#FAF7EE] flex flex-col items-center justify-center overflow-hidden"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Teks Minion */}
          <motion.span
            className="glitch text-[#1a1a1a] select-none relative z-10"
            data-text="Minion"
            style={{
              fontFamily: fonts[fontIdx],
              fontSize: "clamp(2rem, 7vw, 4.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          >
            Minion
          </motion.span>

          {/* Subtitle */}
          <motion.span
            className="text-[#1a1a1a]/30 text-[10px] font-bold tracking-[5px] uppercase mt-3 relative z-10"
            style={{ fontFamily: "var(--font-display)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
          >
            Barbershop
          </motion.span>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 h-[2px] bg-[#1a1a1a]/10 rounded-full overflow-hidden"
            style={{ width: 80 }}
          >
            <motion.div
              className="h-full bg-[#F9C74F] rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8, ease: "linear" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
