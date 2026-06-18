interface EmptyStateProps {
  emoji?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

/**
 * Tampilan ramah saat data dari API kosong.
 * Dipakai di seluruh halaman company profile (barber, gallery, produk, layanan, cabang).
 */
export default function EmptyState({
  emoji = "🤷",
  title,
  subtitle,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}>
      <div className="text-5xl mb-4 animate-bounce">{emoji}</div>
      <h3 className="font-display font-bold text-lg text-[#1a1a1a] mb-1.5">{title}</h3>
      {subtitle && <p className="text-sm text-gray-400 max-w-xs leading-relaxed">{subtitle}</p>}
    </div>
  );
}
