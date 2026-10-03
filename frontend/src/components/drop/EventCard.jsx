import StatusBadge from '../ui/StatusBadge'
import SeatAvailability from './SeatAvailability'

export function formatDropDate(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  })
}

export default function EventCard({ drop, children }) {
  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(67,56,202,0.15)] ring-1 ring-slate-200/80">
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-700 to-fuchsia-600 p-6 text-white sm:p-8">
        <div aria-hidden="true" className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div aria-hidden="true" className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-fuchsia-300/20 blur-2xl" />
        <div className="relative flex items-start justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-100">Active drop</p>
          <StatusBadge status={drop.status} />
        </div>
        <h2 className="relative mt-5 font-display text-3xl font-bold leading-tight sm:text-4xl">{drop.eventName}</h2>
        <p className="relative mt-1 text-lg font-medium text-brand-100">{drop.dropName}</p>
        <p className="relative mt-4 text-sm text-white/85">
          {formatDropDate(drop.startsAt)} · {drop.venue}
        </p>
      </div>
      <div className="space-y-6 p-6 sm:p-8">
        <SeatAvailability remaining={drop.remainingSeats} total={drop.totalSeats} />
        <dl className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 text-sm">
          <div>
            <dt className="text-slate-500">Total tickets</dt>
            <dd className="mt-0.5 text-lg font-bold text-slate-900 tabular-nums">{drop.totalSeats}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Max tickets / account</dt>
            <dd className="mt-0.5 text-lg font-bold text-slate-900 tabular-nums">{drop.maxTicketsPerUser}</dd>
          </div>
        </dl>
        {children}
      </div>
    </article>
  )
}
