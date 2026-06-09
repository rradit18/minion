import Footer from "@/components/company/Footer";

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>{children}</main>
      <Footer />
    </>
  );
}
