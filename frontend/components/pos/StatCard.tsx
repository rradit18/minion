import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  change: string;
  positive: boolean;
  icon: ReactNode;
  accent?: string;
}

export default function StatCard({
  label, value, change, positive, icon, accent = "bg-yellow-400",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 ${accent} rounded-xl flex items-center justify-center shadow-sm`}>
          {icon}
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
          {positive ? "▲" : "▼"} {change}
        </span>
      </div>
      <p className="text-2xl font-extrabold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}
