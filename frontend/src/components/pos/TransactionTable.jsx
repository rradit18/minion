import { formatRupiah } from '../../utils/formatRupiah'

const statusStyle = {
  Selesai: 'bg-green-100 text-green-700',
  Dibatalkan: 'bg-red-100 text-red-600',
  Pending: 'bg-yellow-100 text-yellow-700',
}

/**
 * TransactionTable — tabel riwayat transaksi
 * Props:
 *   transactions : { id, date, items, total, status }[]
 */
export default function TransactionTable({ transactions }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">ID Transaksi</th>
            <th className="px-4 py-3 text-left">Waktu</th>
            <th className="px-4 py-3 text-right">Item</th>
            <th className="px-4 py-3 text-right">Total</th>
            <th className="px-4 py-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                Belum ada transaksi
              </td>
            </tr>
          ) : (
            transactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-gray-700">{t.id}</td>
                <td className="px-4 py-3 text-gray-500">{t.date}</td>
                <td className="px-4 py-3 text-right text-gray-700">{t.items}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-800">
                  {formatRupiah(t.total)}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      statusStyle[t.status] ?? 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
