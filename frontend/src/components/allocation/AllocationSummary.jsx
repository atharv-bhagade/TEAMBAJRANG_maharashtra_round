import TicketCounter from '../queue/TicketCounter'
import { formatDropDate } from '../drop/EventCard'

export default function AllocationSummary({
  eventName,
  dropName,
  quantity,
  owned,
  max,
  remainingEntitlement,
  allocationId,
  venue = 'DY Patil Stadium, Navi Mumbai',
  startsAt = '2026-11-14T19:30:00+05:30',
}) {
  return (
    <div className="space-y-6 text-left max-w-lg mx-auto">
      {/* Tasteful Digital Ticket Card */}
      <div className="overflow-hidden rounded-3xl bg-[#181827] border border-violet-500/30 shadow-2xl shadow-violet-950/30">
        
        {/* Ticket Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#261545] via-[#1D1236] to-[#140D24] p-6 text-white border-b border-dashed border-white/15">
          <div aria-hidden="true" className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-violet-600/20 blur-2xl" />
          
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-widest text-violet-300 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Official Entry Pass
            </span>
            <span className="rounded-full bg-emerald-950/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300 border border-emerald-500/30">
              CONFIRMED
            </span>
          </div>

          <h3 className="mt-4 font-display text-2xl font-extrabold text-white tracking-tight">
            {eventName}
          </h3>
          <p className="mt-0.5 text-xs text-violet-200/80">{dropName}</p>

          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-300">
            <span>📅 {formatDropDate(startsAt)}</span>
            <span>📍 {venue}</span>
          </div>
        </div>

        {/* Perforated Divider Visuals */}
        <div className="relative flex items-center justify-between px-2 -my-2.5">
          <div className="h-5 w-5 rounded-full bg-[#15151F] border border-violet-500/20 -ml-5" />
          <div className="flex-1 border-b border-dashed border-white/10 mx-2" />
          <div className="h-5 w-5 rounded-full bg-[#15151F] border border-violet-500/20 -mr-5" />
        </div>

        {/* Ticket Body / Quantity */}
        <div className="p-6 bg-[#161623] space-y-5">
          <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-[#181827] border border-emerald-500/30 p-5 text-center">
            <p className="font-display text-5xl font-extrabold text-emerald-400 tabular-nums">{quantity}</p>
            <p className="mt-1 text-base font-semibold text-emerald-300">
              {quantity === 1 ? 'ticket' : 'tickets'} confirmed
            </p>
          </div>

          {allocationId && (
            <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-slate-400 uppercase tracking-wider">Confirmation Ref</span>
              <span className="font-mono text-violet-300 font-semibold">{allocationId}</span>
            </div>
          )}

          <div className="pt-2 border-t border-white/5">
            <TicketCounter owned={owned} max={max} />
          </div>

          {remainingEntitlement > 0 && (
            <div className="rounded-xl bg-violet-950/60 border border-violet-500/30 p-3.5 text-center text-xs font-semibold text-violet-200">
              You can get {remainingEntitlement} more {remainingEntitlement === 1 ? 'ticket' : 'tickets'}.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
