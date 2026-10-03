import TicketCounter from '../../components/queue/TicketCounter'

export default function EntitlementPanel({ owned, max }) {
  const available = Math.max(0, max - owned)
  return (
    <div className="grid gap-4 rounded-2xl bg-brand-50/60 p-5 ring-1 ring-brand-100 sm:grid-cols-2">
      <TicketCounter owned={owned} max={max} />
      <div>
        <p className="text-sm text-slate-500">Available to you</p>
        <p className="mt-0.5 font-display text-2xl font-bold text-slate-900 tabular-nums">
          {available > 0 ? `Up to ${available} more` : '0 more'}
        </p>
      </div>
    </div>
  )
}
