import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import EventCard from '../components/drop/EventCard'
import Button from '../components/ui/Button'
import StatusBadge from '../components/ui/StatusBadge'
import ErrorMessage from '../components/ui/ErrorMessage'
import LoadingBlock from '../components/ui/LoadingBlock'
import QuantitySelector from '../components/queue/QuantitySelector'
import EntitlementPanel from '../features/drop/EntitlementPanel'
import { useAuth } from '../hooks/useAuth'
import { useDrop } from '../hooks/useDrop'
import { useQueue } from '../hooks/useQueue'
import { DROP_STATUS, QUEUE_STATUS } from '../mock/mockData'

const closedMessages = {
  [DROP_STATUS.UPCOMING]: 'This drop has not opened yet. Check back when the entry window starts.',
  [DROP_STATUS.SOLD_OUT]: 'All tickets for this drop have been allocated.',
  [DROP_STATUS.CLOSED]: 'This ticket drop is closed and no longer accepting entries.',
}

const plural = (n) => `${n} ticket${n === 1 ? '' : 's'}`

export default function DropDetails() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { drop, loading, error: loadError } = useDrop()
  const {
    queue,
    status,
    isActive,
    selectedQuantity,
    join,
    joining,
    error,
    selectQuantity,
  } = useQueue()

  const [joiningAgain, setJoiningAgain] = useState(false)

  if (loading) return <PageContainer><LoadingBlock text="Loading drop..." /></PageContainer>

  const open = drop.status === DROP_STATUS.OPEN
  const remainingEntitlement = Math.max(0, drop.maxTicketsPerUser - user.ticketsOwned)
  const maxSelectable = Math.min(drop.maxTicketsPerUser, remainingEntitlement)
  const hasCompleted = status === QUEUE_STATUS.COMPLETED
  const hasExpired = status === QUEUE_STATUS.EXPIRED

  async function onJoin() {
    if (await join()) navigate('/queue')
  }

  return (
    <PageContainer demo>
      <div className="grid items-start gap-8 lg:grid-cols-5 pt-2 sm:pt-4">
        {/* Left Column: Event Card */}
        <div className="lg:col-span-3">
          <EventCard drop={drop} />
        </div>

        {/* Right Column: Entry & Entitlement Panel */}
        <div className="space-y-6 lg:col-span-2">
          <EntitlementPanel owned={user.ticketsOwned} max={drop.maxTicketsPerUser} />

          {/* ACTIVE ENTRY: User is WAITING, ADMITTED, or COOLDOWN */}
          {isActive && (
            <section className="rounded-3xl bg-[#15151F] border border-white/10 p-6 sm:p-7 shadow-2xl" aria-labelledby="entry-title">
              <div className="flex items-center justify-between gap-3">
                <h2 id="entry-title" className="font-display text-xl font-bold text-white">Your place in line</h2>
                <StatusBadge status={status} />
              </div>
              <p className="mt-3 text-slate-300">
                Tickets requested: <span className="font-bold text-white">{queue.requestedQuantity}</span>
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Your entry is saved in the fair pool.
              </p>
              <Button size="lg" className="mt-6 w-full" onClick={() => navigate('/queue')}>
                Go to My Entry
              </Button>
            </section>
          )}

          {/* MAXIMUM LIMIT REACHED (4 / 4) */}
          {!isActive && remainingEntitlement === 0 && (
            <section className="rounded-3xl bg-[#15151F] border border-white/10 p-6 sm:p-7 shadow-2xl text-center" aria-labelledby="exhausted-title">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-950/80 border border-emerald-500/30 text-2xl text-emerald-400">✓</div>
              <h2 id="exhausted-title" className="mt-4 font-display text-xl font-bold text-white">
                Maximum Limit Reached
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                You have obtained the maximum ticket limit ({drop.maxTicketsPerUser} / {drop.maxTicketsPerUser}) for this drop.
              </p>
              {hasCompleted && (
                <Button to="/allocation" variant="secondary" className="mt-6 w-full">
                  View Confirmed Tickets
                </Button>
              )}
            </section>
          )}

          {/* PREVIOUS COMPLETED ENTRY WITH REMAINING ENTITLEMENT */}
          {!isActive && remainingEntitlement > 0 && hasCompleted && !joiningAgain && (
            <section className="space-y-4 rounded-3xl bg-[#15151F] border border-white/10 p-6 sm:p-7 shadow-2xl" aria-labelledby="prev-completed-title">
              <div className="flex items-center justify-between gap-3">
                <h2 id="prev-completed-title" className="font-display text-xl font-bold text-white">
                  Tickets Confirmed
                </h2>
                <StatusBadge status={status} />
              </div>
              <p className="text-sm text-slate-300">
                You confirmed {plural(queue.requestedQuantity)}. You can get {plural(remainingEntitlement)} more.
              </p>
              <Button size="lg" className="w-full mt-2" onClick={() => setJoiningAgain(true)}>
                Join Fair Drop Again
              </Button>
              <Button to="/allocation" variant="secondary" className="w-full">
                View Confirmed Tickets
              </Button>
            </section>
          )}

          {/* PREVIOUS EXPIRED ENTRY WITH REMAINING ENTITLEMENT */}
          {!isActive && remainingEntitlement > 0 && hasExpired && !joiningAgain && (
            <section className="space-y-4 rounded-3xl bg-[#15151F] border border-white/10 p-6 sm:p-7 shadow-2xl" aria-labelledby="prev-expired-title">
              <div className="flex items-center justify-between gap-3">
                <h2 id="prev-expired-title" className="font-display text-xl font-bold text-white">
                  Claim Window Expired
                </h2>
                <StatusBadge status={status} />
              </div>
              <p className="text-sm text-slate-300">
                The tickets are no longer held for you. You can request up to {plural(remainingEntitlement)}.
              </p>
              <Button size="lg" className="w-full mt-2" onClick={() => setJoiningAgain(true)}>
                Join Fair Drop Again
              </Button>
            </section>
          )}

          {/* ENTRY PANEL: QUANTITY SELECTION */}
          {!isActive && remainingEntitlement > 0 && (!hasCompleted && !hasExpired || joiningAgain) && (
            <section className="space-y-5 rounded-3xl bg-[#15151F] border border-white/10 p-6 sm:p-7 shadow-2xl" aria-label="Join the pool">
              {joiningAgain && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                    Additional Entry
                  </span>
                  <button
                    type="button"
                    onClick={() => setJoiningAgain(false)}
                    className="text-xs text-slate-400 hover:text-white underline"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <div className="rounded-2xl bg-[#1D1D2B] border border-white/5 p-5">
                <QuantitySelector
                  value={selectedQuantity}
                  max={maxSelectable}
                  onChange={selectQuantity}
                  disabled={joining || !open}
                />
              </div>

              <div className="rounded-xl bg-white/5 p-3.5 border border-white/5 text-xs text-slate-400 leading-relaxed">
                <p className="font-semibold text-slate-300">Entering earlier or refreshing won’t improve your chances.</p>
                <p className="mt-0.5">Your chance is not based on internet speed.</p>
              </div>

              <ErrorMessage>{loadError || error}</ErrorMessage>
              {!open && (
                <p className="rounded-xl bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 border border-white/10">
                  {closedMessages[drop.status]}
                </p>
              )}

              <Button
                size="lg"
                className="w-full shadow-xl shadow-violet-950/60"
                onClick={onJoin}
                disabled={!open || maxSelectable === 0}
                loading={joining}
                loadingText="Entering pool…"
              >
                {hasCompleted || hasExpired ? 'Join Fair Drop Again' : 'Join Fair Drop'}
              </Button>
            </section>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
