import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import AllocationSummary from '../../components/allocation/AllocationSummary'
import LoadingBlock from '../../components/ui/LoadingBlock'
import { ALLOCATION_STATUS } from '../../mock/mockData'

export default function AllocationView({
  allocation,
  drop,
  user,
  remainingEntitlement,
  onTryAgain,
}) {
  switch (allocation.status) {
    case ALLOCATION_STATUS.PROCESSING:
      return <Card><LoadingBlock text="Claiming tickets..." /></Card>

    case ALLOCATION_STATUS.SUCCESS:
      return (
        <Card className="text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-4xl text-emerald-700 ring-8 ring-emerald-50" aria-hidden="true">✓</div>
          <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">You're all set!</h1>
          <div className="mt-6">
            <AllocationSummary
              eventName={drop.eventName}
              dropName={drop.dropName}
              quantity={allocation.quantity}
              owned={user.ticketsOwned}
              max={user.maxTickets}
              remainingEntitlement={remainingEntitlement}
              allocationId={allocation.allocationId}
            />
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {remainingEntitlement > 0 && (
              <Button to="/drop">Join Queue Again</Button>
            )}
            <Button to="/" variant="secondary">Back to Home</Button>
          </div>
        </Card>
      )

    case ALLOCATION_STATUS.FAILED:
      return (
        <Card className="text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-rose-100 text-4xl font-bold text-rose-700 ring-8 ring-rose-50" aria-hidden="true">!</div>
          <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-slate-900">Tickets could not be confirmed</h1>
          <p className="mx-auto mt-3 max-w-md text-slate-600">
            We couldn't confirm your tickets. Your tickets remain held until the timer ends, so you can try again.
          </p>
          <p className="mt-4 text-sm text-slate-500">Tickets owned: {user.ticketsOwned} / {user.maxTickets}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={onTryAgain}>Back to claim</Button>
            <Button to="/" variant="secondary">Back to Home</Button>
          </div>
        </Card>
      )

    default:
      return (
        <Card className="text-center">
          <h1 className="font-display text-2xl font-bold">No tickets claimed yet</h1>
          <p className="mt-2 text-slate-600">You haven't claimed any tickets in this session.</p>
          <Button to="/drop" className="mt-6">Go to drop</Button>
        </Card>
      )
  }
}
