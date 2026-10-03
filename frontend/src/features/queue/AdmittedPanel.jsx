import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import ErrorMessage from '../../components/ui/ErrorMessage'
import QueueStatus from '../../components/queue/QueueStatus'
import TicketCounter from '../../components/queue/TicketCounter'
import { useAllocation } from '../../hooks/useAllocation'
import { useCountdown, formatClock } from '../../hooks/useCountdown'

// NO quantity selector: the claim is always exactly queue.requestedQuantity.
export default function AdmittedPanel({ drop, user, status, requestedQuantity, claimExpiresAt }) {
  const navigate = useNavigate()
  const { claim, error } = useAllocation()
  const seconds = useCountdown(claimExpiresAt)
  const [claiming, setClaiming] = useState(false)

  const lapsed = Boolean(claimExpiresAt) && seconds === 0 // expiry is processed on the next tick
  const noun = requestedQuantity === 1 ? 'ticket' : 'tickets'

  async function onClaim() {
    setClaiming(true)
    const ok = await claim()
    setClaiming(false)
    if (ok) navigate('/allocation')
  }

  return (
    <Card className="text-center bg-[#15151F] border border-emerald-500/30 shadow-2xl">
      <div>
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-950/70 border border-emerald-500/40 text-3xl text-emerald-400 shadow-lg shadow-emerald-950/50" aria-hidden="true">
          ✓
        </div>
        <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          You're in!
        </h1>
        <p className="mt-2 text-lg font-semibold text-violet-300">{drop.eventName}</p>
        <p className="mt-1 text-sm text-slate-300">Claim them before the timer ends.</p>
        <div className="mt-4 flex justify-center">
          <QueueStatus status={status} />
        </div>
      </div>

      {/* Held ticket reservation banner */}
      <div className="mt-6 rounded-2xl bg-gradient-to-r from-violet-950/80 via-purple-950/80 to-indigo-950/80 border border-violet-500/30 p-5 text-center text-lg font-semibold text-violet-200 shadow-md">
        {requestedQuantity} {requestedQuantity === 1 ? 'ticket is' : 'tickets are'} being held for you.
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3 max-w-xl mx-auto">
        <div className="rounded-2xl bg-[#1D1D2B] border border-white/10 p-4 text-left">
          <p className="text-xs uppercase tracking-wider text-slate-400">Tickets remaining</p>
          <p className="mt-1 font-display text-2xl font-bold text-white tabular-nums">{drop.remainingSeats}</p>
        </div>
        <div className="rounded-2xl bg-[#1D1D2B] border border-white/10 p-4 text-left">
          <TicketCounter owned={user.ticketsOwned} max={user.maxTickets} />
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-amber-950/40 to-[#1D1D2B] border border-amber-500/30 p-4 text-left" role="timer" aria-label="Claim window">
          <p className="text-xs uppercase tracking-wider text-amber-300">Time remaining</p>
          <p className="mt-1 font-display text-2xl font-bold text-amber-200 tabular-nums">{formatClock(seconds)}</p>
        </div>
      </div>

      <div className="mt-8 space-y-4 max-w-xl mx-auto">
        <ErrorMessage>{error}</ErrorMessage>
        <Button
          size="lg"
          className="w-full shadow-xl shadow-violet-950/60"
          onClick={onClaim}
          disabled={lapsed}
          loading={claiming}
          loadingText="Claiming tickets..."
        >
          Claim {requestedQuantity} {noun === 'ticket' ? 'Ticket' : 'Tickets'}
        </Button>
      </div>
    </Card>
  )
}
