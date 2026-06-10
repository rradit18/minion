import HeroSection from "@/components/company/HeroSection";
import USPSection from "@/components/company/USPSection";
import PromoBanner from "@/components/company/PromoBanner";
import ServicesSection from "@/components/company/ServicesSection";
import GalleryPreview from "@/components/company/GalleryPreview";
import BarbermanPreview from "@/components/company/BarbermanPreview";
import LocationSection from "@/components/company/LocationSection";

export default function HomePageClient() {
  return (
    <>
      <HeroSection />
      <USPSection />
      <PromoBanner />
      <ServicesSection />
      <GalleryPreview />
      <BarbermanPreview />
      <LocationSection />
    </>
  );
}
