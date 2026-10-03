export default function ProgressBar({ value, max, label, tone = 'brand', className = '' }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  const color = tone === 'green' ? 'from-emerald-400 to-emerald-600' : 'from-brand-500 to-violet-500'
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={`h-3 w-full overflow-hidden rounded-full bg-slate-200 ${className}`}
    >
      <div className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  )
}
