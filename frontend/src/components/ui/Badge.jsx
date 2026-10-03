const tones = {
  slate: 'bg-slate-100 text-slate-700 ring-slate-200',
  brand: 'bg-brand-50 text-brand-700 ring-brand-100',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-800 ring-amber-200',
  red: 'bg-rose-50 text-rose-700 ring-rose-200',
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
