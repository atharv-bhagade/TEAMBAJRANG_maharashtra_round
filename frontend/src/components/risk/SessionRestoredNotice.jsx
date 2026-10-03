import StatusBadge from '../ui/StatusBadge'

export default function SessionRestoredNotice({ dropName, status, ticketsOwned, maxTickets, onDismiss }) {
  return (
    <section
      role="status"
      className="mb-6 rounded-2xl bg-emerald-50 p-5 ring-1 ring-emerald-200"
      aria-label="Session restored"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold text-emerald-900">
            Welcome back. Your place in the queue is saved.
          </h2>
          <dl className="mt-3 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
            <div><dt className="text-emerald-800/70">Drop</dt><dd className="font-semibold text-emerald-950">{dropName}</dd></div>
            <div><dt className="text-emerald-800/70">Status</dt><dd className="mt-0.5"><StatusBadge status={status} /></dd></div>
            <div><dt className="text-emerald-800/70">Your tickets</dt><dd className="font-semibold text-emerald-950">{ticketsOwned} / {maxTickets}</dd></div>
          </dl>
        </div>
        <button type="button" onClick={onDismiss} className="rounded-md px-2 text-emerald-900 hover:bg-emerald-100" aria-label="Dismiss message">✕</button>
      </div>
    </section>
  )
}
