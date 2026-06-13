import StatCard from "@/components/pos/StatCard";
import RecentTransactions from "@/components/pos/RecentTransactions";
import TopProducts from "@/components/pos/TopProducts";

const stats = [
  {
    label: "Penjualan Hari Ini", value: "Rp 2.450.000", change: "12%", positive: true, accent: "bg-yellow-400",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  {
    label: "Total Transaksi", value: "34", change: "5", positive: true, accent: "bg-blue-100",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  },
  {
    label: "Produk Terjual", value: "128", change: "8", positive: true, accent: "bg-purple-100",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  },
  {
    label: "Pelanggan Baru", value: "12", change: "2", positive: false, accent: "bg-orange-100",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-yellow-400 rounded-2xl p-6 flex items-center justify-between overflow-hidden relative">
        <div>
          <p className="text-gray-900 text-sm font-medium mb-1 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" /></svg>
            Selamat datang kembali
          </p>
          <h2 className="text-2xl font-extrabold text-gray-900">Good Hair. Good Vibes.</h2>
          <p className="text-gray-700 text-sm mt-1">Pantau performa bisnis kamu hari ini</p>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-3 opacity-30">
          <div className="w-24 h-24 rounded-full border-4 border-gray-900" />
          <div className="w-16 h-16 rounded-full border-4 border-gray-900 mt-8" />
        </div>
        <div className="relative z-10 w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-yellow-400 font-extrabold text-xl shadow-md">
          M
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
        <TopProducts />
      </div>
    </div>
  );
}
