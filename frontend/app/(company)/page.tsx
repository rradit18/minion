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
import FadeIn from "@/components/ui/FadeIn";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#FAF7EE]">
      <LoadScreen />
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <HeroSection onMenuClick={() => setIsMenuOpen(true)} />
      <FadeIn delay={0.05}><USPSection /></FadeIn>
      <FadeIn delay={0.05}><ServiceSection /></FadeIn>
      <FadeIn delay={0.05}><PromoBanner /></FadeIn>
      <FadeIn delay={0.05}><GalleryPreview /></FadeIn>
      <FadeIn delay={0.05}><BarbermanPreview /></FadeIn>
      <FadeIn delay={0.05}><LocationSection /></FadeIn>
    </main>
  );
}
