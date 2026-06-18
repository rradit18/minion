"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";

const STATIC_PREVIEW = [
  "/gallery/gallery (1).jpg", "/gallery/gallery (2).JPG", "/gallery/gallery (3).JPG",
  "/gallery/gallery (4).png", "/gallery/gallery (5).png", "/gallery/gallery (6).png",
];

export default function GallerySection() {
  // null = loading; [] = kosong → empty state
  const [images, setImages] = useState<string[] | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'}/gallery`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((json) => {
        const data: { image_url: string }[] = json?.data ?? [];
        setImages(data.slice(0, 6).map((g) => g.image_url));
      })
      .catch(() => setImages(STATIC_PREVIEW));
  }, []);

  const isEmpty = images !== null && images.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-display font-bold text-base tracking-wide text-black uppercase">Gallery</h2>
          <svg viewBox="0 0 60 14" className="w-12 h-3.5" fill="none">
            <path d="M2 7 Q9 1 16 7 T30 7 T44 7 T58 7" stroke="#178E81" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <Link href="/gallery">
          <button className="text-xs font-bold text-black hover:text-[#F9C74F] transition-colors font-body">
            Lihat Semua →
          </button>
        </Link>
      </div>

      {isEmpty ? (
        <EmptyState
          emoji="📸"
          title="Galeri lagi dikosongin sementara"
          subtitle="Foto-foto hasil potongan kece bakal segera nampang di sini!"
        />
      ) : (
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {(images ?? []).map((img, index) => (
            <div key={index} className="overflow-hidden rounded-2xl aspect-square group">
              <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
