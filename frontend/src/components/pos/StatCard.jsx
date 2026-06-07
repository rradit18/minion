/**
 * StatCard — kartu statistik untuk dashboard POS
 * Props:
 *   label  : string  — judul kartu
 *   value  : string  — nilai yang ditampilkan
 *   color  : string  — Tailwind classes untuk warna latar & teks (opsional)
 */
export default function StatCard({ label, value, color = 'bg-blue-50 text-blue-700' }) {
  return (
    <div className={`rounded-xl p-5 ${color}`}>
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}
