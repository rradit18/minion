const transactions = [
  { id: "TRX-034", customer: "Hendra S.",  items: 2, total: 82000,  status: "Selesai",    time: "13:42" },
  { id: "TRX-033", customer: "Budi R.",    items: 1, total: 35000,  status: "Selesai",    time: "13:10" },
  { id: "TRX-032", customer: "Andi M.",    items: 3, total: 105000, status: "Selesai",    time: "12:55" },
  { id: "TRX-031", customer: "Rizky F.",   items: 1, total: 50000,  status: "Dibatalkan", time: "12:30" },
  { id: "TRX-030", customer: "Dimas A.",   items: 4, total: 145000, status: "Selesai",    time: "11:48" },
];

const statusStyle: Record<string, string> = {
  Selesai:    "bg-green-50 text-green-600",
  Dibatalkan: "bg-red-50 text-red-500",
  Pending:    "bg-yellow-50 text-yellow-600",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

export default function RecentTransactions() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <h2 className="font-bold text-gray-900">Transaksi Terbaru</h2>
        <a href="/pos/transactions" className="text-xs text-yellow-500 hover:text-yellow-600 font-semibold">
          Lihat Semua →
        </a>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-400 text-xs uppercase">
            <th className="px-5 py-3 text-left">ID</th>
            <th className="px-5 py-3 text-left">Pelanggan</th>
            <th className="px-5 py-3 text-right">Total</th>
            <th className="px-5 py-3 text-center">Status</th>
            <th className="px-5 py-3 text-right">Waktu</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {transactions.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-5 py-3.5 font-mono text-xs text-gray-400 font-semibold">{t.id}</td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-yellow-100 rounded-lg flex items-center justify-center text-xs font-bold text-yellow-700">
                    {t.customer[0]}
                  </div>
                  <span className="font-medium text-gray-800">{t.customer}</span>
                </div>
              </td>
              <td className="px-5 py-3.5 text-right font-bold text-gray-900">{fmt(t.total)}</td>
              <td className="px-5 py-3.5 text-center">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[t.status] ?? "bg-gray-100 text-gray-500"}`}>
                  {t.status}
                </span>
              </td>
              <td className="px-5 py-3.5 text-right text-xs text-gray-400">{t.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
