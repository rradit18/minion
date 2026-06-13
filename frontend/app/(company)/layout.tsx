import { Bungee, Anton, Rubik_Glitch, Pacifico } from "next/font/google";
import CompanyNavbar from "@/components/company/CompanyNavbar";
import Footer from "@/components/company/Footer";
import AnnouncementBar from "@/components/company/AnnouncementBar";
import FloatingDock from "@/components/company/FloatingDock";

// Font tambahan KHUSUS untuk efek glitch (acak) pada kata "gantenggg."
const bungee = Bungee({ variable: "--font-glitch-bungee", subsets: ["latin"], weight: "400" });
const anton = Anton({ variable: "--font-glitch-anton", subsets: ["latin"], weight: "400" });
const rubikGlitch = Rubik_Glitch({ variable: "--font-glitch-rubik", subsets: ["latin"], weight: "400" });
const pacifico = Pacifico({ variable: "--font-glitch-pacifico", subsets: ["latin"], weight: "400" });

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${bungee.variable} ${anton.variable} ${rubikGlitch.variable} ${pacifico.variable} bg-[#FAF7EE] min-h-screen flex flex-col`}
    >
      {/* Top bar — navbar hanya tampil di desktop (lg+) */}
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <CompanyNavbar />
      </div>

      <main className="flex-1">
        {children}
      </main>

      <Footer />

      {/* Floating dock — navigasi khusus mobile/tablet (<lg) */}
      <FloatingDock />
    </div>
  );
}
