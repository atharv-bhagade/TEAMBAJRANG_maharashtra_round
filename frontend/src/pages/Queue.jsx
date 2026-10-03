import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import LoadingBlock from '../components/ui/LoadingBlock'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import CooldownNotice from '../components/risk/CooldownNotice'
import ReAuthNotice from '../components/risk/ReAuthNotice'
import SessionRestoredNotice from '../components/risk/SessionRestoredNotice'
import WaitingRoom from '../features/queue/WaitingRoom'
import AdmittedPanel from '../features/queue/AdmittedPanel'
import ClosedPanel from '../features/queue/ClosedPanel'
import ExpiredPanel from '../features/queue/ExpiredPanel'
import { useQueue } from '../hooks/useQueue'
import { restoredOnLoad } from '../mock/mockState'
import { QUEUE_STATUS, DROP_STATUS } from '../mock/mockData'

// Module-level so the "restoring" experience happens once per page load,
// not on every in-app navigation.
let restoreHandled = false

export default function Queue() {
  const { queue, status, drop, user, checking, resume } = useQueue({ checkOnMount: true, watchExpiry: true })
  const [restoring, setRestoring] = useState(restoredOnLoad && !restoreHandled)
  const [showRestored, setShowRestored] = useState(false)
  const [reAuthing, setReAuthing] = useState(false)

  useEffect(() => {
    if (!restoring) return undefined
    const id = setTimeout(() => {
      restoreHandled = true
      setRestoring(false)
      setShowRestored(true)
    }, 1200)
    return () => clearTimeout(id)
  }, [restoring])

  function onReAuth() {
    setReAuthing(true)
    setTimeout(() => {
      setReAuthing(false)
      resume()
    }, 900)
  }

  let body
  if (restoring) body = <LoadingBlock text="Loading entry…" />
  else if (checking) body = <LoadingBlock text="Checking pool status…" />
  else if (status === QUEUE_STATUS.NOT_JOINED)
    body = (
      <Card className="text-center bg-[#15151F] border border-white/10 shadow-2xl py-12">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/5 border border-white/10 text-3xl text-slate-400 mb-4">
          🎟️
        </div>
        <h1 className="font-display text-2xl font-bold text-white">You haven't joined the pool yet</h1>
        <p className="mt-2 text-sm text-slate-400 max-w-sm mx-auto">
          Choose your requested ticket count from the drop page to enter the fair pool.
        </p>
        <Button to="/drop" className="mt-6">
          View Live Drop
        </Button>
      </Card>
    )
  else if (status === QUEUE_STATUS.WAITING)
    body = <WaitingRoom drop={drop} user={user} status={status} requestedQuantity={queue.requestedQuantity} />
  else if (status === QUEUE_STATUS.ADMITTED)
    body = (
      <AdmittedPanel
        drop={drop}
        user={user}
        status={status}
        requestedQuantity={queue.requestedQuantity}
        claimExpiresAt={queue.claimExpiresAt}
      />
    )
  else if (status === QUEUE_STATUS.EXPIRED) body = <ExpiredPanel requestedQuantity={queue.requestedQuantity} />
  else if (status === QUEUE_STATUS.COOLDOWN)
    body = <CooldownNotice until={queue.cooldownUntil} onExpire={resume} ticketsOwned={user.ticketsOwned} maxTickets={user.maxTickets} />
  else if (status === QUEUE_STATUS.RE_AUTH_REQUIRED)
    body = <ReAuthNotice ticketsOwned={user.ticketsOwned} maxTickets={user.maxTickets} onReAuth={onReAuth} loading={reAuthing} />
  else if (status === QUEUE_STATUS.COMPLETED)
    body = (
      <Card className="text-center bg-[#15151F] border border-white/10 shadow-2xl py-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-950/70 border border-emerald-500/40 text-3xl text-emerald-400 mb-4">
          ✓
        </div>
        <h1 className="font-display text-3xl font-extrabold text-white">Tickets Confirmed</h1>
        <p className="mt-2 text-sm text-slate-300">Your tickets: {user.ticketsOwned} / {drop.maxTicketsPerUser}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to="/allocation">View Confirmed Tickets</Button>
          {user.ticketsOwned < drop.maxTicketsPerUser && (
            <Button to="/drop" variant="secondary">Join Fair Drop Again</Button>
          )}
        </div>
      </Card>
    )
  else body = <ClosedPanel soldOut={drop.status === DROP_STATUS.SOLD_OUT} ticketsOwned={user.ticketsOwned} maxTickets={user.maxTickets} />

  return (
    <PageContainer narrow demo>
      {showRestored && status !== QUEUE_STATUS.EXPIRED && (
        <SessionRestoredNotice
          dropName={drop.dropName}
          status={status}
          ticketsOwned={user.ticketsOwned}
          maxTickets={user.maxTickets}
          onDismiss={() => setShowRestored(false)}
        />
      )}
      <div className="fd-fade-up" key={restoring || checking ? 'loading' : status}>{body}</div>
      <p className="mt-8 text-center text-xs">
        <Link to="/drop" className="text-slate-400 hover:text-white transition-colors underline">
          ← Back to Drop Details
        </Link>
      </p>
    </PageContainer>
  )
}
