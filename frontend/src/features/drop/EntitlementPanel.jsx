import TicketCounter from '../../components/queue/TicketCounter'

export default function EntitlementPanel({ owned, max }) {
  const available = Math.max(0, max - owned)
  return (
    <div className="grid gap-4 rounded-2xl bg-[#1D1D2B] border border-white/10 p-5 shadow-lg sm:grid-cols-2">
      <TicketCounter owned={owned} max={max} />
      <div>
        <p className="text-xs uppercase tracking-wider text-slate-400">Available to you</p>
        <p className="mt-1 font-display text-2xl font-bold text-violet-300 tabular-nums">
          {available > 0 ? `Up to ${available} more` : '0 more'}
        </p>
      </div>
    </div>
  )
}
