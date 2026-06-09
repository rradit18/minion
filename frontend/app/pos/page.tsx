import StatCard from "@/components/pos/StatCard";
import RecentTransactions from "@/components/pos/RecentTransactions";
import TopProducts from "@/components/pos/TopProducts";

const stats = [
  { label: "Penjualan Hari Ini", value: "Rp 2.450.000", change: "12%", positive: true,  icon: "💰", accent: "bg-yellow-400" },
  { label: "Total Transaksi",    value: "34",            change: "5",   positive: true,  icon: "🧾", accent: "bg-blue-100"   },
  { label: "Produk Terjual",     value: "128",           change: "8",   positive: true,  icon: "📦", accent: "bg-purple-100" },
  { label: "Pelanggan Baru",     value: "12",            change: "2",   positive: false, icon: "👤", accent: "bg-orange-100" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">

      {/* Welcome banner */}
      <div className="bg-yellow-400 rounded-2xl p-6 flex items-center justify-between overflow-hidden relative">
        <div>
          <p className="text-gray-900 text-sm font-medium mb-1">Selamat datang kembali 👋</p>
          <h2 className="text-2xl font-extrabold text-gray-900">Good Hair. Good Vibes.</h2>
          <p className="text-gray-700 text-sm mt-1">Pantau performa bisnis kamu hari ini</p>
        </div>
        {/* Decorative circles */}
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
