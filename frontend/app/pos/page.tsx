import StatCard from "@/components/pos/StatCard";

const stats = [
  { label: "Total Penjualan Hari Ini", value: "Rp 2.450.000", color: "bg-blue-50 text-blue-700" },
  { label: "Transaksi", value: "34", color: "bg-green-50 text-green-700" },
  { label: "Produk Terjual", value: "128", color: "bg-purple-50 text-purple-700" },
  { label: "Pelanggan Baru", value: "12", color: "bg-orange-50 text-orange-700" },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} color={s.color} />
        ))}
      </div>
    </div>
  );
}
