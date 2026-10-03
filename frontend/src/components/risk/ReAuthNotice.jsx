import Card from '../ui/Card'
import Button from '../ui/Button'

// Re-authentication never resets queue state or ticket entitlement.
export default function ReAuthNotice({ ticketsOwned, maxTickets, onReAuth, loading }) {
  return (
    <Card className="border-t-4 border-brand-500 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-3xl ring-1 ring-brand-100" aria-hidden="true">🔒</div>
      <h1 className="mt-5 font-display text-3xl font-bold text-slate-900">Additional Verification Required</h1>
      <p className="mx-auto mt-3 max-w-md text-slate-600">Please sign in again to continue.</p>
      <dl className="mx-auto mt-6 max-w-sm space-y-2 rounded-2xl bg-slate-50 p-4 text-left text-sm">
        <div className="flex justify-between"><dt className="text-slate-500">Queue entry</dt><dd className="font-semibold text-emerald-700">✓ Preserved</dd></div>
        <div className="flex justify-between"><dt className="text-slate-500">Tickets owned</dt><dd className="font-semibold text-slate-900">{ticketsOwned} / {maxTickets}</dd></div>
      </dl>
      <p className="mx-auto mt-4 max-w-md text-sm text-slate-500">
        Signing in again does not reset your queue entry or your ticket entitlement.
      </p>
      <Button className="mt-6" onClick={onReAuth} loading={loading} loadingText="Verifying…">
        Sign in again
      </Button>
    </Card>
  )
}
