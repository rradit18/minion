import { formatRupiah } from "@/utils/formatRupiah";

interface Transaction { id: string; date: string; items: number; total: number; status: string; }

const statusStyle: Record<string, string> = {
  Selesai:    "bg-green-50 text-green-600",
  Dibatalkan: "bg-red-50 text-red-500",
  Pending:    "bg-yellow-50 text-yellow-600",
};

export default function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="border-b border-gray-50">
          <tr className="bg-gray-50 text-gray-400 text-xs uppercase">
            <th className="px-5 py-3.5 text-left">ID Transaksi</th>
            <th className="px-5 py-3.5 text-left">Waktu</th>
            <th className="px-5 py-3.5 text-right">Item</th>
            <th className="px-5 py-3.5 text-right">Total</th>
            <th className="px-5 py-3.5 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-5 py-12 text-center text-gray-400">Belum ada transaksi</td>
            </tr>
          ) : (
            transactions.map((t) => (
              <tr key={t.id} className="hover:bg-yellow-50/30 transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs font-bold text-gray-500">{t.id}</td>
                <td className="px-5 py-3.5 text-gray-500">{t.date}</td>
                <td className="px-5 py-3.5 text-right text-gray-700">{t.items}</td>
                <td className="px-5 py-3.5 text-right font-extrabold text-gray-900">{formatRupiah(t.total)}</td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyle[t.status] ?? "bg-gray-100 text-gray-500"}`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
