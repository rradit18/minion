"use client";

import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: "Home",              href: "/"         },
  { name: "About Us",         href: "/about"     },
  { name: "Gallery",          href: "/gallery"   },
  { name: "Barberman",        href: "/barberman" },
  { name: "Products",         href: "/products"  },
  { name: "Branches",         href: "/branches"  },
  { name: "Blog",             href: "/blog"      },
  { name: "Contact & Booking",href: "/contact"   },
  { name: "Saran & Kritik",   href: "/feedback"     }
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Background: cream + barber illustration pattern overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#F5EFE4",
          backgroundImage: "url('/pattern.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 1,
        }}
      />
      {/* Cream overlay to soften the pattern */}
      <div className="absolute inset-0 bg-[#F5EFE4]/80" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen px-8 py-6">

        {/* Top row: Logo + Close */}
        <div className="flex items-start justify-between">
          {/* Logo */}
          <div>
            <img
              src="/minion.png"
              alt="Minion Barbershop Logo"
              className="h-24 w-auto object-contain"/>
          </div>

          {/* Close button — yellow rounded square */}
          <button
            onClick={onClose}
            aria-label="Tutup menu"
            className="w-12 h-12 rounded-xl bg-[#F9B620] flex items-center justify-center hover:bg-yellow-400 transition-colors mt-1 shadow-sm flex-shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18" />
              <path d="M6 6L18 18" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="mt-12 flex-1 pl-20">
          <ul className="space-y-6">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="text-[22px] font-bold text-[#111111] hover:text-[#F9B620] transition-colors leading-none"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sign In / Sign Up buttons */}
        <div className="pb-8 pt-10 space-y-3 flex flex-col items-center">
          <Link
            href="/login"
            onClick={onClose}
            className="block w-[25%] h-14 rounded-2xl bg-[#1a1a1a] text-white text-[17px] font-bold tracking-wide hover:bg-black transition-colors text-center leading-[3.5rem]"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            onClick={onClose}
            className="block w-[25%] h-14 rounded-2xl bg-[#1a1a1a] text-white text-[17px] font-bold tracking-wide hover:bg-black transition-colors text-center leading-[3.5rem]"
          >
            Sign Up
          </Link>
        </div>

      </div>
    </div>
  );
}
