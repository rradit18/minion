'use client'; 
import { useState } from 'react';
import Navbar from '@/components/company/Navbar';
import MobileMenu from '@/components/company/MobileMenu';
import Footer from '@/components/company/Footer'; 

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Navbar onMenuClick={() => setIsMenuOpen(true)} />
      
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <main>
        {children}
      </main>

      <Footer />
    </>
  );
}