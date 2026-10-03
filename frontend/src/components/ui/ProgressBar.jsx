export default function ProgressBar({ value, max, label, tone = 'brand', className = '' }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  const color = tone === 'green' ? 'from-emerald-500 to-teal-400' : 'from-violet-500 via-purple-500 to-fuchsia-500'
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={`h-2.5 w-full overflow-hidden rounded-full bg-white/10 ${className}`}
    >
      <div className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500 shadow-sm`} style={{ width: `${pct}%` }} />
    </div>
  )
}
