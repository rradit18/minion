"use client";
import React from 'react';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const menuItems = [
    { name: 'Home', link: '/' },
    { name: 'Services', link: '/services' },
    { name: 'Barberman', link: '/barberman' },
    { name: 'Gallery', link: '/gallery' },
    { name: 'Branches', link: '/branches' },
    { name: 'About Us', link: '/about' },
  ];

  return (
    <nav className="flex items-center justify-between py-5 bg-[#FAF7EE] sticky top-0 z-50 px-6 lg:px-12">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/brand/minion.png"
          alt="Minion Barbershop Logo"
          className="h-10 md:h-12 w-auto object-contain"
        />
      </div>

      {/* Desktop Menu - Hanya muncul di layar besar */}
      <div className="hidden lg:flex items-center gap-8 font-bold text-[#1a1a1a] text-sm">
        {menuItems.map((item) => (
          <a
            key={item.name}
            href={item.link}
            className={`hover:text-[#F9C74F] transition-colors ${item.name === 'Home' ? 'bg-[#F9C74F] px-4 py-2 rounded-full' : ''}`}
          >
            {item.name}
          </a>
        ))}
      </div>

      {/* Action Button & Hamburger */}
      <div className="flex items-center gap-4">
        <button className="bg-[#F9C74F] text-[#1a1a1a] px-6 py-2 rounded-xl font-extrabold text-[13px] hover:bg-yellow-400 transition flex items-center gap-2">
          Book Now →
        </button>
        <span
          className="text-2xl cursor-pointer text-[#1a1a1a] hover:text-gray-600 transition lg:hidden"
          onClick={onMenuClick}
        >
          ☰
        </span>
      </div>
    </nav>
  );
};

export default Navbar;