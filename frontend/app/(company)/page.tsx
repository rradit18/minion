"use client";

import { useState } from "react";
import HeroSection from "@/components/company/HeroSection";
import USPSection from "@/components/company/USPSection";
import ServiceSection from "@/components/company/ServiceSection";
import PromoBanner from "@/components/company/PromoBanner";
import GalleryPreview from "@/components/company/GalleryPreview";
import BarbermanPreview from "@/components/company/BarbermanPreview";
import LocationSection from "@/components/company/LocationSection";
import MobileMenu from "@/components/company/MobileMenu";
import LoadScreen from "@/components/ui/LoadScreen";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#FAF7EE]">
      <LoadScreen />
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <HeroSection onMenuClick={() => setIsMenuOpen(true)} />
      <USPSection />
      <ServiceSection />
      <PromoBanner />
      <GalleryPreview />
      <BarbermanPreview />
      <LocationSection />
    </main>
  );
}