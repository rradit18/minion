import { fetchSchedule } from "@/src/lib/mockData";

const statusStyle: Record<string, string> = {
  Selesai:  "bg-green-100 text-green-700",
  Upcoming: "bg-blue-100 text-blue-700",
};

const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

export default function HariIniPage() {
  const schedule = fetchSchedule();
  const today = new Date().toISOString().split("T")[0];
  const todayBookings = schedule.schedule
    .filter((b) => b.date === today || true) // mock: semua tampil
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-[#1a1a1a]">Booking Hari Ini</h2>
        <p className="text-gray-500 text-sm mt-1">{todayBookings.length} booking · Shift {schedule.shift}</p>
      </div>

      <div className="space-y-3">
        {todayBookings.map((b) => (
          <div key={b.id} className={`bg-white rounded-2xl border-l-4 p-4 flex items-center gap-4 ${b.status === "Selesai" ? "border-green-400 opacity-70" : "border-[#F9C74F]"}`}>
            <div className="text-center w-14 flex-shrink-0">
              <p className="text-lg font-black text-[#1a1a1a]">{b.time}</p>
              <p className="text-[10px] text-gray-400">{b.duration_minutes}m</p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-[#1a1a1a]">{b.customer_name}</p>
              <p className="text-sm text-gray-500">{b.service}</p>
              {b.notes && <p className="text-xs text-gray-400 mt-0.5">📝 {b.notes}</p>}
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-black text-[#1a1a1a] text-sm">{fmt(b.price)}</p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold ${statusStyle[b.status] ?? "bg-gray-100 text-gray-500"}`}>{b.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
