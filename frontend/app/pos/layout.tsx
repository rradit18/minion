import Sidebar from "@/components/pos/Sidebar";
import PosHeader from "@/components/pos/PosHeader";

export default function PosLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f8fa] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PosHeader />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
