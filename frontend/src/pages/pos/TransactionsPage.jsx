import TransactionTable from '../../components/pos/TransactionTable'

const transactions = [
  { id: 'TRX-001', date: '2026-06-07 09:12', items: 3, total: 72000, status: 'Selesai' },
  { id: 'TRX-002', date: '2026-06-07 10:05', items: 1, total: 25000, status: 'Selesai' },
  { id: 'TRX-003', date: '2026-06-07 11:30', items: 5, total: 145000, status: 'Selesai' },
  { id: 'TRX-004', date: '2026-06-07 13:00', items: 2, total: 63000, status: 'Dibatalkan' },
]

export default function TransactionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Riwayat Transaksi</h1>
      <TransactionTable transactions={transactions} />
    </div>
  )
}
