import { fetchSchedule } from "@/src/lib/mockData";

export default function BarbermanDashboard() {
  const schedule = fetchSchedule();
  const summary  = schedule.today_summary;

  const stats = [
    { label: "Total Booking Hari Ini", value: summary.total_bookings, icon: "📋", color: "bg-yellow-50" },
    { label: "Sudah Selesai",          value: summary.completed,      icon: "✅", color: "bg-green-50"  },
    { label: "Menunggu",               value: summary.upcoming,       icon: "⏳", color: "bg-blue-50"   },
    { label: "Est. Pendapatan",        value: `Rp ${(summary.estimated_revenue/1000).toFixed(0)}k`, icon: "💰", color: "bg-purple-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[#178E81] text-xs font-bold uppercase tracking-widest mb-1">Barberman Portal</p>
        <h1 className="text-2xl font-black text-[#1a1a1a]">Selamat Datang, {schedule.barber_name.split(" ")[0]}! 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Shift hari ini: {schedule.shift} · {schedule.branch}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 border border-gray-100`}>
            <p className="text-2xl mb-2">{s.icon}</p>
            <p className="text-2xl font-black text-[#1a1a1a]">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Next customer */}
      {schedule.schedule.find((b) => b.status === "Upcoming") && (() => {
        const next = schedule.schedule.find((b) => b.status === "Upcoming")!;
        return (
          <div className="bg-[#1a1a1a] rounded-2xl p-5 text-white">
            <p className="text-[#F9C74F] text-xs font-bold uppercase tracking-widest mb-3">Pelanggan Berikutnya</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#F9C74F] rounded-xl flex items-center justify-center text-black font-black text-lg flex-shrink-0">{next.customer_name[0]}</div>
              <div>
                <p className="font-black text-lg">{next.customer_name}</p>
                <p className="text-gray-400 text-sm">{next.service} · {next.time}</p>
                {next.notes && <p className="text-gray-400 text-xs mt-1">📝 {next.notes}</p>}
              </div>
              <div className="ml-auto text-right">
                <p className="text-[#F9C74F] font-black">Rp {(next.price/1000).toFixed(0)}k</p>
                <p className="text-gray-400 text-xs">{next.duration_minutes} menit</p>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
