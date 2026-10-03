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
  if (restoring) body = <LoadingBlock text="Loading..." />
  else if (checking) body = <LoadingBlock text="Checking queue status..." />
  else if (status === QUEUE_STATUS.NOT_JOINED)
    body = (
      <Card className="text-center">
        <h1 className="font-display text-2xl font-bold">You haven't joined the queue yet</h1>
        <p className="mt-2 text-slate-600">Join the queue from the drop page to get started.</p>
        <Button to="/drop" className="mt-6">Go to drop</Button>
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
      <Card className="text-center">
        <h1 className="font-display text-2xl font-bold">Tickets confirmed</h1>
        <p className="mt-2 text-slate-600">Your tickets: {user.ticketsOwned} / {drop.maxTicketsPerUser}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to="/allocation">View confirmed tickets</Button>
          {user.ticketsOwned < drop.maxTicketsPerUser && (
            <Button to="/drop" variant="secondary">Join Queue Again</Button>
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
      <p className="mt-6 text-center text-sm">
        <Link to="/drop" className="text-slate-500 underline hover:text-slate-800">← Drop details</Link>
      </p>
    </PageContainer>
  )
}
