import React from "react";
import Link from "next/link"; // 1. Import Link

const galleryImages = [
  "/gallery1.jfif", "/gallery2.jfif", "/gallery3.jfif",
  "/gallery4.jfif", "/gallery5.jfif", "/gallery6.jfif",
];

export default function GallerySection() {
  return (
    <div className="max-w-7xl mx-auto px-6 mb-12">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-bold text-sm tracking-wide text-black">GALLERY</h2>
        
        {/* 2. Bungkus button dengan Link */}
        <Link href="/gallery">
          <button className="text-xs font-medium text-black hover:text-[#F9C74F] transition-colors">
            Lihat Semua →
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {galleryImages.map((img, index) => (
          <div key={index} className="overflow-hidden rounded-3xl aspect-square">
            <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}