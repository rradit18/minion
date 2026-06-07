interface StatCardProps {
  label: string;
  value: string;
  color?: string;
}

export default function StatCard({ label, value, color = "bg-blue-50 text-blue-700" }: StatCardProps) {
  return (
    <div className={`rounded-xl p-5 ${color}`}>
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
