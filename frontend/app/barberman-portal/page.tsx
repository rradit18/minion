import { fetchSchedule } from "@/src/lib/mockData";

export default function BarbermanDashboard() {
  const schedule = fetchSchedule();
  const summary  = schedule.today_summary;

  const stats = [
    {
      label: "Total Booking Hari Ini", value: summary.total_bookings, color: "bg-yellow-50",
      icon: <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
    },
    {
      label: "Sudah Selesai", value: summary.completed, color: "bg-green-50",
      icon: <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      label: "Menunggu", value: summary.upcoming, color: "bg-blue-50",
      icon: <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      label: "Est. Pendapatan", value: `Rp ${(summary.estimated_revenue/1000).toFixed(0)}k`, color: "bg-purple-50",
      icon: <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[#178E81] text-xs font-bold uppercase tracking-widest mb-1">Barberman Portal</p>
        <h1 className="text-2xl font-black text-[#1a1a1a] flex items-center gap-2">
          Selamat Datang, {schedule.barber_name.split(" ")[0]}!
          <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
          </svg>
        </h1>
        <p className="text-gray-500 text-sm mt-1">Shift hari ini: {schedule.shift} · {schedule.branch}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 border border-gray-100`}>
            <div className="mb-2">{s.icon}</div>
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
            <p className="text-[#F9C74F] text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Pelanggan Berikutnya
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#F9C74F] rounded-xl flex items-center justify-center text-black font-black text-lg flex-shrink-0">{next.customer_name[0]}</div>
              <div>
                <p className="font-black text-lg">{next.customer_name}</p>
                <p className="text-gray-400 text-sm">{next.service} · {next.time}</p>
                {next.notes && (
                  <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    {next.notes}
                  </p>
                )}
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
