import Card from '../../components/ui/Card'
import QueueStatus from '../../components/queue/QueueStatus'
import TicketCounter from '../../components/queue/TicketCounter'

// Requested quantity is DISPLAY-ONLY here: it is fixed for this queue entry.
export default function WaitingRoom({ drop, user, status, requestedQuantity }) {
  return (
    <Card className="text-center shadow-2xl bg-[#15151F] border border-white/10">
      {/* Pulsing Pool Animation */}
      <div className="relative mx-auto grid h-24 w-24 place-items-center" aria-hidden="true">
        <span className="fd-pulse-glow absolute h-16 w-16 rounded-full bg-violet-600/30 blur-xl" />
        <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-purple-700 text-2xl text-white shadow-xl shadow-violet-950/60 ring-2 ring-violet-400/40">
          ◔
        </span>
      </div>

      <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        You're in the fair pool.
      </h1>
      <p className="mt-2 text-lg font-semibold text-violet-300">{drop.eventName}</p>
      <p className="mt-1 text-sm text-slate-400">We'll let you know when it's your turn.</p>

      <div className="mt-5 flex justify-center">
        <QueueStatus status={status} />
      </div>

      {/* Sweeping progress light */}
      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/5 mx-auto max-w-md" aria-hidden="true">
        <div className="fd-sweep h-full w-1/3 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
      </div>

      {/* Compact Status Timeline */}
      <div className="mt-8 rounded-2xl bg-[#1D1D2B]/90 border border-white/5 p-4 sm:p-5 text-left max-w-xl mx-auto">
        <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">Allocation Flow</p>
        <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px]">✓</span>
            <span>Entry Saved</span>
          </div>
          <div className="flex items-center gap-2 text-amber-300 font-medium">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-amber-950/80 border border-amber-500/40 text-[10px] animate-pulse">●</span>
            <span>In Pool</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-white/5 border border-white/10 text-[10px]">3</span>
            <span>Claim</span>
          </div>
        </div>
      </div>

      {/* Metadata cards */}
      <dl className="mt-6 grid gap-4 text-left sm:grid-cols-3 max-w-xl mx-auto">
        <div className="rounded-2xl bg-[#1D1D2B] border border-white/10 p-4">
          <dt className="text-xs uppercase tracking-wider text-slate-400">Tickets requested</dt>
          <dd className="mt-1 font-display text-3xl font-extrabold text-violet-300 tabular-nums">
            {requestedQuantity}
          </dd>
        </div>
        <div className="rounded-2xl bg-[#1D1D2B] border border-white/10 p-4">
          <TicketCounter owned={user.ticketsOwned} max={user.maxTickets} />
        </div>
        <div className="rounded-2xl bg-[#1D1D2B] border border-white/10 p-4">
          <dt className="text-xs uppercase tracking-wider text-slate-400">Tickets remaining</dt>
          <dd className="mt-1 font-display text-2xl font-bold text-white tabular-nums">
            {drop.remainingSeats}
          </dd>
        </div>
      </dl>

      <p className="mt-6 text-xs text-slate-400">
        Your place is saved if you refresh.
      </p>
    </Card>
  )
}
