"use client";

import Link from "next/link";
import { useState } from "react";
import MobileMenu from "@/components/company/MobileMenu";

export default function CompanyNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="bg-[#FAFAF6] border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between py-4">

          {/* Logo */}
          <Link href="/" className="flex flex-col flex-shrink-0">
            <img
              src="/minion.png"
              alt="Minion Barbershop"
              className="h-12 w-auto object-contain"
              />
          </Link>
          
          {/* Right side */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/contact"
              className="bg-[#F9C74F] text-[#1a1a1a] px-4 py-2 rounded-lg font-extrabold text-[13px] hover:bg-yellow-400 transition whitespace-nowrap"
            >
              Book Now
            </Link>
            {/* Hamburger icon */}
            <button
              onClick={() => setMenuOpen(true)}
              className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Buka menu"
            >
              <span className="block w-6 h-0.5 bg-[#1a1a1a] rounded-full" />
              <span className="block w-6 h-0.5 bg-[#1a1a1a] rounded-full" />
              <span className="block w-4 h-0.5 bg-[#1a1a1a] rounded-full self-start ml-1" />
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
