import Card from '../ui/Card'
import Button from '../ui/Button'

// Re-authentication never resets queue state or ticket entitlement.
export default function ReAuthNotice({ ticketsOwned, maxTickets, onReAuth, loading }) {
  return (
    <Card className="border border-violet-500/30 bg-[#15151F] text-center shadow-2xl">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-violet-950/60 border border-violet-500/30 text-3xl text-violet-300" aria-hidden="true">
        🔒
      </div>
      <h1 className="mt-5 font-display text-3xl font-extrabold text-white">Please sign in again to continue.</h1>
      <p className="mx-auto mt-2 max-w-md text-slate-400 text-sm">For security, please sign in again.</p>
      <dl className="mx-auto mt-6 max-w-sm space-y-2 rounded-2xl bg-[#1D1D2B] border border-white/5 p-4 text-left text-xs sm:text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-400">Entry status</dt>
          <dd className="font-semibold text-emerald-400">✓ Preserved</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-400">Your tickets</dt>
          <dd className="font-semibold text-white">{ticketsOwned} / {maxTickets}</dd>
        </div>
      </dl>
      <Button className="mt-6" onClick={onReAuth} loading={loading} loadingText="Verifying…">
        Sign in again
      </Button>
    </Card>
  )
}
