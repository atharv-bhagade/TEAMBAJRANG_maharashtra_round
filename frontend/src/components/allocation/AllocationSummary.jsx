import TicketCounter from '../queue/TicketCounter'

export default function AllocationSummary({
  eventName,
  dropName,
  quantity,
  owned,
  max,
  remainingEntitlement,
  allocationId,
}) {
  return (
    <div className="space-y-5 text-left">
      <div className="rounded-2xl bg-emerald-50 p-5 text-center ring-1 ring-emerald-200">
        <p className="font-display text-5xl font-extrabold text-emerald-900 tabular-nums">{quantity}</p>
        <p className="mt-1 text-lg font-semibold text-emerald-800">
          {quantity === 1 ? 'ticket' : 'tickets'} confirmed
        </p>
      </div>
      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-slate-500">Event</dt>
          <dd className="font-semibold text-slate-900">{eventName}</dd>
          <dd className="text-sm text-slate-600">{dropName}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-500">Tickets owned</dt>
          <dd className="font-display text-xl font-bold text-slate-900">{owned} / {max}</dd>
        </div>
        {remainingEntitlement > 0 && (
          <div className="sm:col-span-2 rounded-xl bg-brand-50 p-3 text-center text-sm font-semibold text-brand-900">
            You can get {remainingEntitlement} more {remainingEntitlement === 1 ? 'ticket' : 'tickets'}.
          </div>
        )}
      </dl>
      <TicketCounter owned={owned} max={max} />
    </div>
  )
}
