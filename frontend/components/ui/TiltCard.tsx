"use client";

import { useRef, type ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** maksimum derajat kemiringan */
  max?: number;
  style?: React.CSSProperties;
}

/**
 * 3D Tilt Card (ala Aceternity "3D Card Effect") — kartu memiringkan ke arah kursor.
 * Pure React + CSS transform, tanpa dependency.
 */
export default function TiltCard({ children, className = "", max = 10, style }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg) scale(1.03)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "perspective(900px) rotateY(0) rotateX(0) scale(1)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={`transition-[transform,box-shadow,border-color] duration-200 ease-out will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d", ...style }}
    >
      {children}
    </div>
  );
}
