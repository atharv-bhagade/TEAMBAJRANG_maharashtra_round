export default function TicketCounter({ owned, max, className = '' }) {
  return (
    <div className={className}>
      <p className="text-sm text-slate-500">Your tickets</p>
      <p className="mt-0.5 flex items-center gap-3">
        <span className="font-display text-2xl font-bold text-slate-900 tabular-nums">
          {owned} / {max}
        </span>
        <span className="flex gap-1" role="img" aria-label={`${owned} of ${max} tickets owned`}>
          {Array.from({ length: max }, (_, i) => (
            <span
              key={i}
              className={`h-3 w-5 rounded-sm ${i < owned ? 'bg-brand-600' : 'border border-slate-300 bg-white'}`}
            />
          ))}
        </span>
      </p>
    </div>
  )
}
