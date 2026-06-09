"use client";

import HeroSection from "@/components/company/HeroSection";
import USPSection from "@/components/company/USPSection";
import PromoBanner from "@/components/company/PromoBanner";
import ServicesSection from "@/components/company/ServicesSection";
import GalleryPreview from "@/components/company/GalleryPreview";
import BarbermanPreview from "@/components/company/BarbermanPreview";
import LocationSection from "@/components/company/LocationSection";
import { useState } from "react";
import MobileMenu from "@/components/company/MobileMenu";

export default function HomePageClient() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <HeroSection onMenuClick={() => setIsMenuOpen(true)} />
      <USPSection />
      <PromoBanner />
      <ServicesSection />
      <GalleryPreview />
      <BarbermanPreview />
      <LocationSection />
    </>
  );
}
