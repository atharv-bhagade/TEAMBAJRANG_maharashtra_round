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
    <article className="overflow-hidden rounded-3xl bg-[#15151F] border border-white/10 shadow-2xl shadow-black/70 transition-all duration-200 hover:border-violet-500/30">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1E1238] via-[#2A1452] to-[#120B24] p-6 text-white sm:p-8 border-b border-white/10">
        {/* Atmosphere spotlights */}
        <div aria-hidden="true" className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-violet-600/20 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-16 left-1/4 h-48 w-48 rounded-full bg-fuchsia-600/20 blur-3xl" />
        
        {/* Subtle grid texture overlay */}
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-950/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-violet-300 border border-violet-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            Live Fair Drop
          </span>
          <StatusBadge status={drop.status} />
        </div>

        <h2 className="relative mt-5 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl tracking-tight">
          {drop.eventName}
        </h2>
        <p className="relative mt-1 text-base font-medium text-violet-200/90">{drop.dropName}</p>

        <div className="relative mt-5 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-300">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDropDate(drop.startsAt)}
          </span>
          <span className="text-white/30 hidden sm:inline">·</span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {drop.venue}
          </span>
        </div>
      </div>

      <div className="space-y-6 p-6 sm:p-8 bg-[#15151F]">
        <SeatAvailability remaining={drop.remainingSeats} total={drop.totalSeats} />
        
        <dl className="grid grid-cols-2 gap-4 rounded-2xl bg-[#1D1D2B] border border-white/5 p-4 text-sm">
          <div>
            <dt className="text-slate-400 text-xs uppercase tracking-wider">Total tickets</dt>
            <dd className="mt-1 text-xl font-display font-bold text-[#F5F5FA] tabular-nums">{drop.totalSeats}</dd>
          </div>
          <div>
            <dt className="text-slate-400 text-xs uppercase tracking-wider">Max tickets / account</dt>
            <dd className="mt-1 text-xl font-display font-bold text-violet-300 tabular-nums">{drop.maxTicketsPerUser}</dd>
          </div>
        </dl>

        {children}
      </div>
    </article>
  )
}
