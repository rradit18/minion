import React from "react";
import Link from "next/link"; // 1. Import Link

const galleryImages = [
  "/gallery1.jpg", "/gallery2.png", "/gallery3.jpg",
  "/gallery4.png", "/gallery5.jpg", "/gallery6.png",
];

export default function GallerySection() {
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

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {galleryImages.map((img, index) => (
          <div key={index} className="overflow-hidden rounded-2xl aspect-square group">
            <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}