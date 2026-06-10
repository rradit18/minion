import CompanyNavbar from "@/components/company/CompanyNavbar";
import Footer from "@/components/company/Footer";
import AnnouncementBar from "@/components/company/AnnouncementBar";

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#FAFAF6] min-h-screen flex flex-col">
      {/* Announcement bar + Navbar dibungkus sticky sekali */}
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <CompanyNavbar />
      </div>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
