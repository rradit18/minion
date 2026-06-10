import { fetchSchedule } from "@/src/lib/mockData";

export default function JadwalPage() {
  const schedule = fetchSchedule();

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-black text-[#1a1a1a]">Jadwal 7 Hari ke Depan</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {schedule.weekly_schedule.map((day) => {
          const date = new Date(day.date);
          const isToday = day.date === new Date().toISOString().split("T")[0];
          return (
            <div key={day.date} className={`rounded-2xl border-2 p-4 transition-all ${isToday ? "border-[#F9C74F] bg-yellow-50" : "border-gray-100 bg-white"}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className={`font-black ${isToday ? "text-[#1a1a1a]" : "text-gray-700"}`}>
                    {day.day} {isToday && <span className="text-xs bg-[#F9C74F] text-black px-2 py-0.5 rounded-full ml-1">Hari Ini</span>}
                  </p>
                  <p className="text-xs text-gray-400">{date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-[#1a1a1a]">{day.total_bookings}</p>
                  <p className="text-[10px] text-gray-400">booking</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <svg className="w-4 h-4 text-[#178E81]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-600 font-medium">Shift: {day.shift}</span>
              </div>
              {/* Mini load bar */}
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#F9C74F] rounded-full" style={{ width: `${Math.min(day.total_bookings * 8, 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
