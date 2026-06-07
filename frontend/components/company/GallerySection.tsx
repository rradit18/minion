import Link from "next/link";

const galleryItems = [
  { id: 1, className: "col-span-2 row-span-2", label: null },
  { id: 2, className: "col-span-1 row-span-1", label: null },
  { id: 3, className: "col-span-1 row-span-1", label: null },
  { id: 4, className: "col-span-1 row-span-1", label: "Temukan Modelmu!" },
  { id: 5, className: "col-span-2 row-span-1", label: null },
];

const bgColors = ["bg-[#1a1a1a]", "bg-[#222]", "bg-[#1c1c1c]", "bg-[#181818]", "bg-[#202020]"];

export default function GallerySection() {
  return (
    <section className="bg-[#0e0e0e] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-1">Gallery</p>
          <h2 className="text-white text-2xl font-bold">
            Inspirasi gaya terkini update dari Minion
          </h2>
          <p className="text-gray-500 text-xs mt-2">Lihat Semua →</p>
        </div>

        <div className="grid grid-cols-3 grid-rows-3 gap-3 h-[480px]">
          {galleryItems.map((item, i) => (
            <div
              key={item.id}
              className={`${item.className} ${bgColors[i]} rounded-xl overflow-hidden relative flex items-end p-4 border border-white/5`}
            >
              {/* Placeholder silhouette */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <svg viewBox="0 0 100 100" className="w-16 h-16 fill-gray-400">
                  <circle cx="50" cy="30" r="20" />
                  <ellipse cx="50" cy="80" rx="30" ry="25" />
                </svg>
              </div>
              {item.label && (
                <div className="relative z-10">
                  <p className="text-white font-bold text-sm mb-2">{item.label}</p>
                  <Link
                    href="/contact"
                    className="bg-yellow-400 text-black text-xs font-bold px-4 py-1.5 rounded uppercase hover:bg-yellow-300 transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
