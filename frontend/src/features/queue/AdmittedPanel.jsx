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
    <Card>
      <div className="text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl text-emerald-700" aria-hidden="true">✓</div>
        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">You're in!</h1>
        <p className="mt-2 text-lg font-semibold text-brand-700">{drop.eventName}</p>
        <p className="mt-1 text-slate-600">Claim them before the timer ends.</p>
        <div className="mt-4 flex justify-center"><QueueStatus status={status} /></div>
      </div>

      <p className="mt-6 rounded-2xl bg-brand-50 p-4 text-center text-lg font-semibold text-brand-900 ring-1 ring-brand-100">
        {requestedQuantity} {requestedQuantity === 1 ? 'ticket is' : 'tickets are'} being held for you.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Tickets remaining</p>
          <p className="mt-0.5 font-display text-2xl font-bold tabular-nums">{drop.remainingSeats}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <TicketCounter owned={user.ticketsOwned} max={user.maxTickets} />
        </div>
        <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200" role="timer" aria-label="Claim window">
          <p className="text-sm text-slate-600">Time remaining</p>
          <p className="mt-0.5 font-display text-2xl font-bold tabular-nums">{formatClock(seconds)}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <ErrorMessage>{error}</ErrorMessage>
        <Button
          size="lg"
          className="w-full"
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
