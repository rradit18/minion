// components/company/GallerySection.tsx
import React from "react";

const galleryImages = [
  "/gallery1.jfif", "/gallery2.jfif", "/gallery3.jfif",
  "/gallery4.jfif", "/gallery5.jfif", "/gallery6.jfif",
];

export default function GallerySection() {
  return (
    <div className="max-w-7xl mx-auto px-6 mb-12">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-bold text-sm tracking-wide text-black">GALLERY</h2>
        <button className="text-xs font-medium text-black">Lihat Semua →</button>
      </div>

      <div className="grid grid-cols-6 gap-4">
        {galleryImages.map((img, index) => (
          <div key={index} className="overflow-hidden rounded-3xl aspect-square">
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}