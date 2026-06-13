"use client";
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface NavbarProps {
  onMenuClick: () => void;
}

const CompanyNavbar = ({ onMenuClick }: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  // Navbar menyatu dengan header saat di atas, lalu "mengambang" saat di-scroll.
  // Pakai ambang masuk/keluar berbeda (hysteresis) supaya tidak flicker di sekitar threshold.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setScrolled((prev) => {
          const y = window.scrollY;
          if (!prev && y > 40) return true;
          if (prev && y < 10) return false;
          return prev;
        });
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const menuItems = [
    { name: 'Home', link: '/' },
    { name: 'Barberman', link: '/barberman' },
    { name: 'Gallery', link: '/gallery' },
    { name: 'Branches', link: '/branches' },
    { name: 'About Us', link: '/about' },
  ];

  return (
    <nav
      className={`w-full sticky top-0 z-50 transition-all duration-500 ease-out ${
        scrolled
          ? 'bg-[#FAF7EE]/80 backdrop-blur-md shadow-[0_4px_24px_-8px_rgba(0,0,0,0.15)] border-b border-black/5'
          : 'bg-[#FAF7EE] border-b border-transparent'
      }`}
    >
      <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex-shrink-0">
          {/* Tinggi logo konstan supaya tidak ada layout shift saat scroll */}
          <img
            src="/minion.png"
            alt="Logo"
            className="w-auto object-contain h-14 md:h-16"
          />
        </div>

        <div className="hidden lg:flex items-center justify-center gap-6 font-display font-bold text-[#1a1a1a] text-sm">
          {menuItems.map((item) => {
            const isActive = pathname === item.link;
            return (
              <a
                key={item.name}
                href={item.link}
                className={`group relative px-4 py-2 transition-colors ${isActive ? 'text-[#1a1a1a]' : 'hover:text-[#7B5EA7]'}`}
              >
                {isActive && (
                  <div
                    className="absolute inset-0 -z-10 transition-transform"
                    style={{ backgroundColor: '#F9C74F', borderRadius: '50%', transform: 'scale(1.2)' }}
                  />
                )}
                {item.name}
                {/* underline animasi saat hover (untuk item non-aktif) */}
                {!isActive && (
                  <span className="pointer-events-none absolute bottom-1 left-4 right-4 h-[2px] origin-left scale-x-0 bg-[#7B5EA7] transition-transform duration-300 group-hover:scale-x-100" />
                )}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/booking')}
            className="bg-[#F9C74F] text-[#1a1a1a] px-6 py-2 rounded-lg font-display font-bold text-sm transition-transform duration-300 hover:bg-yellow-400 hover:scale-105"
          >
            Book Now →
          </button>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition" onClick={onMenuClick}>
            <span className="text-xl text-[#1a1a1a]">☰</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default CompanyNavbar;