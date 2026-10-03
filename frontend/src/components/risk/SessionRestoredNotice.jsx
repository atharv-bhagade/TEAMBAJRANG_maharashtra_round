import StatusBadge from '../ui/StatusBadge'

export default function SessionRestoredNotice({ dropName, status, ticketsOwned, maxTickets, onDismiss }) {
  return (
    <section
      role="status"
      className="mb-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 p-5 shadow-lg"
      aria-label="Session restored"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-base font-bold text-emerald-300">
            Welcome back. Your place in the pool is saved.
          </h2>
          <dl className="mt-3 grid gap-x-8 gap-y-2 text-xs sm:text-sm sm:grid-cols-3">
            <div>
              <dt className="text-emerald-400/70 text-[11px] uppercase tracking-wider">Drop</dt>
              <dd className="font-semibold text-white mt-0.5">{dropName}</dd>
            </div>
            <div>
              <dt className="text-emerald-400/70 text-[11px] uppercase tracking-wider">Status</dt>
              <dd className="mt-1"><StatusBadge status={status} /></dd>
            </div>
            <div>
              <dt className="text-emerald-400/70 text-[11px] uppercase tracking-wider">Your tickets</dt>
              <dd className="font-semibold text-white mt-0.5">{ticketsOwned} / {maxTickets}</dd>
            </div>
          </dl>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-lg p-1.5 text-emerald-400 hover:text-white hover:bg-emerald-900/60 transition-colors"
          aria-label="Dismiss message"
        >
          ✕
        </button>
      </div>
    </section>
  )
}
