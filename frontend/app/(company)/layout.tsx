"use client";
import { useState } from 'react';
import CompanyNavbar from "@/components/company/CompanyNavbar";
import Footer from "@/components/company/Footer";
import AnnouncementBar from "@/components/company/AnnouncementBar";
import MobileMenu from "@/components/company/MobileMenu";

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-[#FAF7EE] min-h-screen flex flex-col">
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        {/* Navbar memicu buka menu */}
        <CompanyNavbar onMenuClick={() => setIsMenuOpen(true)} />
      </div>

      {/* MobileMenu menerima status buka dan fungsi tutup */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}