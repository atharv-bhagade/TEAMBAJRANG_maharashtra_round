export default function TicketCounter({ owned, max, className = '' }) {
  return (
    <div className={className}>
      <p className="text-xs uppercase tracking-wider text-slate-400">Your tickets</p>
      <div className="mt-1 flex items-center gap-3">
        <span className="font-display text-2xl font-bold text-[#F5F5FA] tabular-nums">
          {owned} / {max}
        </span>
        <span className="flex gap-1.5" role="img" aria-label={`${owned} of ${max} tickets owned`}>
          {Array.from({ length: max }, (_, i) => (
            <span
              key={i}
              className={`h-3 w-5 rounded-sm transition-colors ${
                i < owned
                  ? 'bg-violet-500 shadow-sm shadow-violet-500/50'
                  : 'border border-white/15 bg-white/5'
              }`}
            />
          ))}
        </span>
      </div>
    </div>
  )
}
