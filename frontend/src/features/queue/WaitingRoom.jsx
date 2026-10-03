import Card from '../../components/ui/Card'
import QueueStatus from '../../components/queue/QueueStatus'
import TicketCounter from '../../components/queue/TicketCounter'

// Requested quantity is DISPLAY-ONLY here: it is fixed for this queue entry.
export default function WaitingRoom({ drop, user, status, requestedQuantity }) {
  return (
    <Card className="text-center">
      <div className="relative mx-auto grid h-20 w-20 place-items-center" aria-hidden="true">
        <span className="fd-pulse-ring absolute h-14 w-14 rounded-full bg-brand-500/40" />
        <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-violet-600 text-2xl text-white shadow-lg">◔</span>
      </div>
      <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        You're in the queue.
      </h1>
      <p className="mt-2 text-lg font-semibold text-brand-700">{drop.eventName}</p>
      <p className="mt-1 text-slate-600">We'll let you know when it's your turn.</p>
      <div className="mt-5 flex justify-center">
        <QueueStatus status={status} />
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
        <div className="fd-sweep h-full w-1/3 rounded-full bg-gradient-to-r from-brand-500 to-violet-500" />
      </div>
      <dl className="mt-8 grid gap-4 text-left sm:grid-cols-3">
        <div className="rounded-2xl bg-brand-50 p-4 ring-1 ring-brand-100">
          <dt className="text-sm text-slate-500">Tickets requested</dt>
          <dd className="mt-0.5 font-display text-3xl font-extrabold text-brand-700 tabular-nums">{requestedQuantity}</dd>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <TicketCounter owned={user.ticketsOwned} max={user.maxTickets} />
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <dt className="text-sm text-slate-500">Tickets remaining</dt>
          <dd className="mt-0.5 font-display text-2xl font-bold text-slate-900 tabular-nums">{drop.remainingSeats}</dd>
        </div>
      </dl>
      <p className="mt-6 text-sm text-slate-500">
        Your place is saved if you refresh.
      </p>
    </Card>
  )
}
