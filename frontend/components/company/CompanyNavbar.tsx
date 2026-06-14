"use client";
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface NavbarProps {
  onMenuClick?: () => void;
}

// Bentuk blob bergelombang untuk active link
const ActiveBlob = () => (
  <span className="animate-blob-pop pointer-events-none absolute -inset-x-2 -inset-y-1 -z-10">
    <svg viewBox="0 0 120 56" preserveAspectRatio="none" className="h-full w-full">
      <path
        d="M60 10 C70 2 80 0 88 2 C104 5 118 14 118 28 C118 42 104 51 88 54 C80 56 70 54 60 46 C50 54 40 56 32 54 C16 51 2 42 2 28 C2 14 16 5 32 2 C40 0 50 2 60 10 Z"
        fill="#F9C74F"
      />
    </svg>
  </span>
);

const menuItems = [
  { name: 'Home', link: '/' },
  { name: 'Barberman', link: '/barberman' },
  { name: 'Gallery', link: '/gallery' },
  { name: 'Products', link: '/products' },
  { name: 'Branches', link: '/branches' },
  { name: 'About Us', link: '/about' },
];

const CompanyNavbar = ({ onMenuClick: _onMenuClick }: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Navbar menyatu dengan header saat di atas, lalu "mengambang" saat di-scroll.
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

  // Tutup popover saat klik di luar / tekan Escape
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  return (
    <nav
      className={`hidden lg:block w-full sticky top-0 z-50 transition-all duration-500 ease-out ${
        scrolled
          ? 'bg-[#FAF7EE]/80 backdrop-blur-md shadow-[0_4px_24px_-8px_rgba(0,0,0,0.15)] border-b border-black/5'
          : 'bg-[#FAF7EE] border-b border-transparent'
      }`}
    >
      <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex-shrink-0">
          {/* Tinggi logo konstan supaya tidak ada layout shift saat scroll */}
          <img src="/minion.png" alt="Logo" className="w-auto object-contain h-14 md:h-16" />
        </div>

        <div className="hidden lg:flex items-center justify-center gap-6 font-display font-bold text-[#1a1a1a] text-sm">
          {menuItems.map((item) => {
            const isActive = pathname === item.link;
            return (
              <a
                key={item.name}
                href={item.link}
                className={`group relative px-5 py-2 transition-colors ${isActive ? 'text-[#1a1a1a]' : 'hover:text-[#7B5EA7]'}`}
              >
                {isActive && <ActiveBlob />}
                <span className="relative z-10">{item.name}</span>
                {!isActive && (
                  <span className="pointer-events-none absolute bottom-1 left-5 right-5 h-[2px] origin-left scale-x-0 bg-[#7B5EA7] transition-transform duration-300 group-hover:scale-x-100" />
                )}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/booking')}
            className="hidden sm:inline-flex bg-[#F9C74F] text-[#1a1a1a] px-6 py-2 rounded-lg font-display font-bold text-sm transition-transform duration-300 hover:bg-yellow-400 hover:scale-105"
          >
            Book Now →
          </button>

          {/* Hamburger + Popover */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
              aria-expanded={open}
              className={`p-2.5 rounded-lg border transition-colors ${
                open ? 'border-[#F9C74F] bg-[#F9C74F]/20' : 'border-gray-200 hover:bg-gray-100'
              }`}
            >
              {/* Ikon hamburger morph ke X */}
              <span className="relative block h-4 w-5">
                <span
                  className={`absolute left-0 block h-[2px] w-5 rounded-full bg-[#1a1a1a] transition-all duration-300 ${
                    open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 top-1/2 block h-[2px] w-5 -translate-y-1/2 rounded-full bg-[#1a1a1a] transition-all duration-200 ${
                    open ? 'scale-x-0 opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-[2px] w-5 rounded-full bg-[#1a1a1a] transition-all duration-300 ${
                    open ? 'bottom-1/2 translate-y-1/2 -rotate-45' : 'bottom-0'
                  }`}
                />
              </span>
            </button>

            {/* Popover kecil */}
            <div
              className={`absolute right-0 top-full mt-3 w-60 origin-top-right rounded-2xl border border-gray-100 bg-white p-2 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.25)] transition-all duration-200 ease-out ${
                open
                  ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                  : 'pointer-events-none -translate-y-1 scale-95 opacity-0'
              }`}
            >
              {/* anak panah kecil */}
              <span className="absolute -top-1.5 right-5 h-3 w-3 rotate-45 rounded-[2px] border-l border-t border-gray-100 bg-white" />

              <nav className="flex flex-col">
                {menuItems.map((item, i) => {
                  const isActive = pathname === item.link;
                  return (
                    <a
                      key={item.name}
                      href={item.link}
                      onClick={() => setOpen(false)}
                      style={{ transitionDelay: open ? `${i * 40 + 60}ms` : '0ms' }}
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-display font-semibold transition-all duration-300 hover:bg-[#FAF7EE] ${
                        open ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
                      } ${isActive ? 'text-[#7B5EA7]' : 'text-[#1a1a1a] hover:text-[#7B5EA7]'}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-[#F9C74F]' : 'bg-gray-300'}`} />
                      {item.name}
                    </a>
                  );
                })}

                <div className="my-2 h-px bg-gray-100" />

                <div className="flex flex-col gap-2 px-1 pb-1">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    style={{ transitionDelay: open ? `${menuItems.length * 40 + 80}ms` : '0ms' }}
                    className={`rounded-xl border-2 border-[#1a1a1a] py-2 text-center text-sm font-display font-bold text-[#1a1a1a] transition-all duration-300 hover:bg-[#1a1a1a] hover:text-white ${
                      open ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    style={{ transitionDelay: open ? `${menuItems.length * 40 + 120}ms` : '0ms' }}
                    className={`rounded-xl bg-[#F9C74F] py-2 text-center text-sm font-display font-bold text-[#1a1a1a] transition-all duration-300 hover:bg-yellow-400 ${
                      open ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
                    }`}
                  >
                    Sign Up
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CompanyNavbar;
