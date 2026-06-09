'use client';

import { useState } from 'react';
import HeroSection from '@/components/company/HeroSection';
import USPSection from '@/components/company/USPSection';
import PromoBanner from '@/components/company/PromoBanner';
import GalleryPreview from '@/components/company/GalleryPreview';
import BarbermanPreview from '@/components/company/BarbermanPreview';
import LocationSection from '@/components/company/LocationSection';
import Footer from '@/components/company/Footer';
import MobileMenu from '@/components/company/MobileMenu';


export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#FCFBF7]">

      <MobileMenu 
      isOpen={isMenuOpen}
      onClose={() => setIsMenuOpen(false)}
      />

      <HeroSection onMenuClick={() => setIsMenuOpen(true)}/>
      <USPSection/>
      <PromoBanner/>
      <GalleryPreview/>
      <BarbermanPreview/>
      <LocationSection/>
      <Footer/>
    </main>
  );
}