const tones = {
  slate: 'bg-white/5 text-slate-300 ring-white/10',
  brand: 'bg-violet-950/60 text-violet-300 ring-violet-500/30',
  green: 'bg-emerald-950/60 text-emerald-300 ring-emerald-500/30',
  amber: 'bg-amber-950/60 text-amber-300 ring-amber-500/30',
  red: 'bg-rose-950/60 text-rose-300 ring-rose-500/30',
}

export default function Badge({ tone = 'slate', icon, className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ring-1 ring-inset ${tones[tone]} ${className}`}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </span>
  )
}
