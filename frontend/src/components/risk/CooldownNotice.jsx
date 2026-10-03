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
    <Card className="border border-amber-500/30 bg-[#15151F] text-center shadow-2xl" role="status" aria-live="polite">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-950/60 border border-amber-500/30 text-3xl text-amber-300" aria-hidden="true">
        ⏸
      </div>
      <h1 className="mt-5 font-display text-3xl font-extrabold text-white">Temporary Cooldown</h1>
      <p className="mx-auto mt-3 max-w-md text-slate-400 text-sm">
        We received too many requests in a short period. Please wait before trying again.
      </p>
      <p className="mt-6 font-display text-2xl font-bold text-amber-400 tabular-nums">
        Try again in {seconds} second{seconds === 1 ? '' : 's'}
      </p>
      <ul className="mx-auto mt-6 max-w-sm space-y-1 rounded-2xl bg-[#1D1D2B] border border-white/5 p-4 text-left text-xs sm:text-sm text-slate-300">
        <li>✓ Your place in the pool is saved.</li>
        {maxTickets != null && <li>✓ Tickets owned: {ticketsOwned} / {maxTickets}</li>}
      </ul>
      <Button variant="secondary" className="mt-6" disabled>
        Please wait…
      </Button>
    </Card>
  )
}
