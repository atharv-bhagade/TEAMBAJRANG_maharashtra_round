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
  [DROP_STATUS.UPCOMING]: 'This drop has not opened yet. Check back when it starts.',
  [DROP_STATUS.SOLD_OUT]: 'All seats for this drop have been allocated.',
  [DROP_STATUS.CLOSED]: 'This drop is closed and no longer accepting queue entries.',
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
      <div className="grid items-start gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <EventCard drop={drop} />
        </div>
        <div className="space-y-5 lg:col-span-2">
          <EntitlementPanel owned={user.ticketsOwned} max={drop.maxTicketsPerUser} />

          {/* ACTIVE QUEUE ENTRY: WAITING, ADMITTED, COOLDOWN, RE_AUTH_REQUIRED */}
          {isActive && (
            <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200/80" aria-labelledby="entry-title">
              <div className="flex items-center justify-between gap-3">
                <h2 id="entry-title" className="font-display text-xl font-bold text-slate-900">Your place in line</h2>
                <StatusBadge status={status} />
              </div>
              <p className="mt-3 text-slate-600">
                Tickets requested: <span className="font-bold text-slate-900">{queue.requestedQuantity}</span>
              </p>
              <Button size="lg" className="mt-5 w-full" onClick={() => navigate('/queue')}>
                Go to Queue
              </Button>
            </section>
          )}

          {/* NO ACTIVE ENTRY BUT ENTITLEMENT EXHAUSTED */}
          {!isActive && remainingEntitlement === 0 && (
            <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200/80 text-center" aria-labelledby="exhausted-title">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-2xl text-emerald-600">✓</div>
              <h2 id="exhausted-title" className="mt-3 font-display text-xl font-bold text-slate-900">
                Maximum limit reached
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                You have reached the maximum ticket limit ({drop.maxTicketsPerUser} / {drop.maxTicketsPerUser}) for this drop.
              </p>
              {hasCompleted && (
                <Button to="/allocation" variant="secondary" className="mt-5 w-full">
                  View confirmed tickets
                </Button>
              )}
            </section>
          )}

          {/* PREVIOUS COMPLETED ENTRY WITH ENTITLEMENT REMAINING */}
          {!isActive && remainingEntitlement > 0 && hasCompleted && !joiningAgain && (
            <section className="space-y-4 rounded-3xl bg-white p-6 ring-1 ring-slate-200/80" aria-labelledby="prev-completed-title">
              <div className="flex items-center justify-between gap-3">
                <h2 id="prev-completed-title" className="font-display text-xl font-bold text-slate-900">
                  Tickets confirmed
                </h2>
                <StatusBadge status={status} />
              </div>
              <p className="text-sm text-slate-600">
                You confirmed {plural(queue.requestedQuantity)}. You can get {plural(remainingEntitlement)} more.
              </p>
              <Button size="lg" className="w-full" onClick={() => setJoiningAgain(true)}>
                Join Queue Again
              </Button>
              <Button to="/allocation" variant="secondary" className="w-full">
                View confirmed tickets
              </Button>
            </section>
          )}

          {/* PREVIOUS EXPIRED ENTRY WITH ENTITLEMENT REMAINING */}
          {!isActive && remainingEntitlement > 0 && hasExpired && !joiningAgain && (
            <section className="space-y-4 rounded-3xl bg-white p-6 ring-1 ring-slate-200/80" aria-labelledby="prev-expired-title">
              <div className="flex items-center justify-between gap-3">
                <h2 id="prev-expired-title" className="font-display text-xl font-bold text-slate-900">
                  Claim window expired
                </h2>
                <StatusBadge status={status} />
              </div>
              <p className="text-sm text-slate-600">
                The tickets are no longer held for you. You can get up to {plural(remainingEntitlement)}.
              </p>
              <Button size="lg" className="w-full" onClick={() => setJoiningAgain(true)}>
                Join Queue Again
              </Button>
            </section>
          )}

          {/* NEW QUEUE ENTRY / JOINING AGAIN: QUANTITY SELECTION */}
          {!isActive && remainingEntitlement > 0 && (!hasCompleted && !hasExpired || joiningAgain) && (
            <section className="space-y-5 rounded-3xl bg-white p-6 ring-1 ring-slate-200/80" aria-label="Join the queue">
              {joiningAgain && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                    Additional entry
                  </span>
                  <button
                    type="button"
                    onClick={() => setJoiningAgain(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 underline"
                  >
                    Cancel
                  </button>
                </div>
              )}
              <div className="flex justify-center rounded-2xl bg-slate-50 p-5">
                <QuantitySelector
                  value={selectedQuantity}
                  max={maxSelectable}
                  onChange={selectQuantity}
                  disabled={joining || !open}
                />
              </div>
              <ErrorMessage>{loadError || error}</ErrorMessage>
              {!open && <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700">{closedMessages[drop.status]}</p>}
              <Button
                size="lg"
                className="w-full"
                onClick={onJoin}
                disabled={!open || maxSelectable === 0}
                loading={joining}
                loadingText="Joining queue..."
              >
                {hasCompleted || hasExpired ? 'Join Queue Again' : 'Join Queue'}
              </Button>
            </section>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
