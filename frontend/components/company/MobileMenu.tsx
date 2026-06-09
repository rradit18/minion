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
    { name: 'Products', href: '/' },
    { name: 'Branches', href: '/' },
    { name: 'Booking', href: '/' ,},
    { name: 'Blog', href: '/' },
    { name: 'Contact Us', href: '/' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#FCFBF7] p-8 flex flex-col justify-center">
      {/* Header Menu */}
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <div className="w-10 h-10 bg-black rounded-full"></div> {/* Placeholder Logo */}
        <span className="font-bold text-lg">Minion</span>
      </div>

      {/* Tombol Close */}
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 text-2xl bg-amber-400 p-2 rounded-lg"
      >
        ✕
      </button>

      {/* Navigasi Links */}
      <nav className="space-y-6 text-center md:text-left text-black">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href} 
            onClick={onClose}
            className="block text-2xl font-bold hover:text-amber-500 transition-colors text-black">
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Sign In & Sign Up */}
      <div className="mt-12 space-y-4 max-w-md w-full mx-auto md:mx-0">
        <button className="w-full bg-black text-white py-3 rounded-full font-bold">Sign In</button>
        <button className="w-full bg-black text-white py-3 rounded-full font-bold">Sign Up</button>
      </div>
    </div>
  );
};

export default MobileMenu;