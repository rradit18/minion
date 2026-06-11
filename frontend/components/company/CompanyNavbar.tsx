"use client";
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface NavbarProps {
  onMenuClick: () => void;
}

const CompanyNavbar = ({ onMenuClick }: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'Home', link: '/' },
    { name: 'Barberman', link: '/barberman' },
    { name: 'Gallery', link: '/gallery' },
    { name: 'Branches', link: '/branches' },
    { name: 'About Us', link: '/about' },
  ];

  return (
    <nav className="w-full bg-[#FAFAF6] sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between py-5 px-6">
        <div className="flex-shrink-0">
          <img src="/minion.png" alt="Logo" className="h-10 md:h-12 w-auto object-contain" />
        </div>

        <div className="hidden lg:flex items-center justify-center gap-6 font-bold text-[#1a1a1a] text-sm">
          {menuItems.map((item) => {
            const isActive = pathname === item.link;
            return (
              <a key={item.name} href={item.link} className={`relative px-4 py-2 transition-all ${isActive ? 'text-[#1a1a1a]' : 'hover:text-[#F9C74F]'}`}>
                {isActive && (
                  <div className="absolute inset-0 -z-10" style={{ backgroundColor: '#F9C74F', borderRadius: '50% 50% 50% 50% / 50% 50% 50% 50%', transform: 'scale(1.2)' }} />
                )}
                {item.name}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/booking')} className="bg-[#F9C74F] text-[#1a1a1a] px-6 py-2 rounded-lg font-bold text-sm hover:bg-yellow-400">Book Now →</button>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition" onClick={onMenuClick}>
            <span className="text-xl text-[#1a1a1a]">☰</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default CompanyNavbar;