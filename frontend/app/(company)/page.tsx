import HeroSection from "@/components/company/HeroSection";
import AboutSection from "@/components/company/AboutSection";
import ServicesSection from "@/components/company/ServicesSection";
import GallerySection from "@/components/company/GalleryPreview";
import BarbersSection from "@/components/company/BarbersSection";
import LocationSection from "@/components/company/LocationSection";
import ContactSection from "@/components/company/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <GallerySection />
      <BarbersSection />
      <LocationSection />
      <ContactSection />
    </>
  );
}
