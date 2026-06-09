import React from 'react';
import Link from 'next/link';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  if (!isOpen) return null;

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Barberman', href: '/barberman' },
    { name: 'Products', href: '/products' },
    { name: 'Branches', href: '/branches' },
    { name: 'Booking', href: '/booking' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto"
      style={{
        backgroundImage: `
          linear-gradient(rgba(245,240,232,0.92), rgba(245,240,232,0.92)),
          url('/images/barber-pattern.png')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex flex-col min-h-screen px-6 py-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1
              className="text-[56px] leading-none font-bold text-[#1a1a1a]"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Minion
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-6 h-[2px] bg-[#1a1a1a]" />
              <span className="text-[14px] font-bold tracking-[2px] text-[#1a1a1a]">
                BARBERSHOP
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-12 h-12 rounded-xl bg-[#F9B620] flex items-center justify-center hover:scale-105 transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18" />
              <path d="M6 6L18 18" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-12 flex-1">
          <ul className="space-y-7">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="text-[20px] font-bold text-[#111] hover:text-[#178E81] transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Buttons */}
        <div className="pb-6 space-y-4">
          <button className="w-full h-[42px] rounded-xl bg-black/90 text-white text-[18px] font-bold">
            Sign In
          </button>
          <button className="w-full h-[42px] rounded-xl bg-black/90 text-white text-[18px] font-bold">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;