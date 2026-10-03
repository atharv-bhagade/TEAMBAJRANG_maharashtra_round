import { useEffect } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { useCountdown } from '../../hooks/useCountdown'

// Never labels the user as a bot; it only describes a temporary rate response.
export default function CooldownNotice({ until, onExpire, ticketsOwned, maxTickets }) {
  const seconds = useCountdown(until)

  useEffect(() => {
    if (until && seconds === 0) onExpire?.()
  }, [seconds, until, onExpire])

  return (
    <Card className="border-t-4 border-amber-400 text-center" role="status" aria-live="polite">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-50 text-3xl ring-1 ring-amber-200" aria-hidden="true">⏸</div>
      <h1 className="mt-5 font-display text-3xl font-bold text-slate-900">Temporary Cooldown</h1>
      <p className="mx-auto mt-3 max-w-md text-slate-600">
        We received too many requests in a short period. Please wait before trying again.
      </p>
      <p className="mt-6 font-display text-2xl font-bold text-amber-700 tabular-nums">
        Try again in {seconds} second{seconds === 1 ? '' : 's'}
      </p>
      <ul className="mx-auto mt-6 max-w-sm space-y-1 rounded-2xl bg-slate-50 p-4 text-left text-sm text-slate-700">
        <li>✓ Your queue entry remains saved.</li>
        {maxTickets != null && <li>✓ Tickets owned: {ticketsOwned} / {maxTickets}</li>}
      </ul>
      <Button variant="secondary" className="mt-6" disabled>
        Please wait…
      </Button>
    </Card>
  )
}
