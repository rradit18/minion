"use client";
import React from 'react';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  return (
    <nav className="flex items-center justify-between py-5 bg-[#FAFAF6] sticky top-0 z-50">
      <div className="flex items-center">
        <img
          src="/minion.png"
          alt="Minion Barbershop Logo"
          className="h-12 w-auto object-contain"/>
      </div>

      <div className="flex items-center gap-3">
        <button className="bg-[#F9C74F] text-[#1a1a1a] px-5 py-2 rounded-lg font-extrabold text-[13px] hover:bg-yellow-400 transition">
          Book Now
        </button>
        <span
          className="text-2xl cursor-pointer text-[#1a1a1a] hover:text-gray-600 transition"
          onClick={onMenuClick}
        >
          ☰
        </span>
      </div>
    </nav>
  );
};

export default Navbar;