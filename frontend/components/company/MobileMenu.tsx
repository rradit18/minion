"use client";

import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: "Home",              href: "/"                 },
  { name: "About Us",         href: "/tentang-kami"      },
  { name: "Gallery",          href: "/gallery"           },
  { name: "Barberman",        href: "/barberman"         },
  { name: "Products",         href: "/produk"            },
  { name: "Branches",         href: "/cabang"            },
  { name: "Blog",             href: "/blog"              },
  { name: "Contact & Booking",href: "/kontak"            },
  { name: "Saran & Kritik",   href: "/kritik-dan-saran"  },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Background pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#F5EFE4",
          backgroundImage: "url('/pattern.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#F5EFE4]/80" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen px-6 py-5">

        {/* Top row: Logo + Close */}
        <div className="flex items-start justify-between">
          <div>
            <img
              src="/minion.png"
              alt="Minion Barbershop Logo"
              className="h-20 w-auto object-contain"
            />
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup menu"
            className="w-12 h-12 rounded-xl bg-[#F9B620] flex items-center justify-center hover:bg-yellow-400 transition-colors mt-1 flex-shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18" />
              <path d="M6 6L18 18" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="mt-8 flex-1">
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="text-[20px] font-bold text-[#111111] hover:text-[#F9B620] transition-colors leading-none"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sign In / Sign Up */}
        <div className="pb-6 pt-6 flex gap-3">
          <Link
            href="/login"
            onClick={onClose}
            className="flex-1 flex items-center justify-center h-12 rounded-xl bg-[#1a1a1a] text-white text-[15px] font-bold hover:bg-black transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            onClick={onClose}
            className="flex-1 flex items-center justify-center h-12 rounded-xl bg-[#1a1a1a] text-white text-[15px] font-bold hover:bg-black transition-colors"
          >
            Sign Up
          </Link>
        </div>

      </div>
    </div>
  );
}