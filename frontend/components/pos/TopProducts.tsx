const products = [
  { name: "Classic Cut",      sold: 48, pct: 90,  color: "bg-yellow-400" },
  { name: "Fade & Taper",     sold: 36, pct: 68,  color: "bg-yellow-300" },
  { name: "Beard Trim",       sold: 24, pct: 45,  color: "bg-orange-300" },
  { name: "Hair Wash",        sold: 18, pct: 34,  color: "bg-blue-300"   },
  { name: "Color Treatment",  sold: 10, pct: 19,  color: "bg-purple-300" },
];

export default function TopProducts() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-gray-900">Produk Terlaris</h2>
        <span className="text-xs text-gray-400">Hari ini</span>
      </div>
      <div className="space-y-4">
        {products.map((p, i) => (
          <div key={p.name}>
            <div className="flex justify-between items-center text-sm mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-gray-100 rounded-md text-[10px] font-bold text-gray-500 flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="font-medium text-gray-700">{p.name}</span>
              </div>
              <span className="text-xs font-bold text-gray-500">{p.sold}x</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${p.color} rounded-full transition-all duration-500`}
                style={{ width: `${p.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
