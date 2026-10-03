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
      return (
        <Card className="text-center bg-[#15151F] border border-white/10 shadow-2xl py-16">
          <LoadingBlock text="Confirming your tickets…" />
        </Card>
      )

    case ALLOCATION_STATUS.SUCCESS:
      return (
        <Card className="text-center bg-[#15151F] border border-white/10 shadow-2xl">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-950/70 border border-emerald-500/40 text-4xl text-emerald-400 shadow-xl shadow-emerald-950/60 ring-2 ring-emerald-400/30" aria-hidden="true">
            ✓
          </div>
          <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            You're all set!
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Your tickets are secured for {drop.eventName}.
          </p>

          <div className="mt-8">
            <AllocationSummary
              eventName={drop.eventName}
              dropName={drop.dropName}
              venue={drop.venue}
              startsAt={drop.startsAt}
              quantity={allocation.quantity}
              owned={user.ticketsOwned}
              max={user.maxTickets}
              remainingEntitlement={remainingEntitlement}
              allocationId={allocation.allocationId}
            />
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row max-w-lg mx-auto">
            {remainingEntitlement > 0 && (
              <Button to="/drop" size="lg" className="w-full sm:w-auto shadow-xl shadow-violet-950/50">
                Join Fair Drop Again
              </Button>
            )}
            <Button to="/" variant="secondary" size="lg" className="w-full sm:w-auto">
              Back to Home
            </Button>
          </div>
        </Card>
      )

    case ALLOCATION_STATUS.FAILED:
      return (
        <Card className="text-center bg-[#15151F] border border-rose-500/30 shadow-2xl">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-rose-950/70 border border-rose-500/40 text-4xl font-bold text-rose-400 shadow-xl" aria-hidden="true">
            !
          </div>
          <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-white">
            Tickets could not be confirmed
          </h1>
          <p className="mx-auto mt-3 max-w-md text-slate-400 text-sm leading-relaxed">
            We couldn't confirm your tickets. Your tickets remain held until the timer ends, so you can try again.
          </p>
          <p className="mt-4 text-xs uppercase tracking-wider text-slate-400">
            Tickets owned: {user.ticketsOwned} / {user.maxTickets}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row max-w-md mx-auto">
            <Button onClick={onTryAgain} size="lg">
              Back to Claim
            </Button>
            <Button to="/" variant="secondary" size="lg">
              Back to Home
            </Button>
          </div>
        </Card>
      )

    default:
      return (
        <Card className="text-center bg-[#15151F] border border-white/10 shadow-2xl py-12">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/5 border border-white/10 text-3xl text-slate-400 mb-4">
            🎟️
          </div>
          <h1 className="font-display text-2xl font-bold text-white">No tickets claimed yet</h1>
          <p className="mt-2 text-sm text-slate-400 max-w-sm mx-auto">
            You haven't claimed any tickets in this session. Explore active drops to enter the fair pool.
          </p>
          <Button to="/drop" className="mt-6">
            Explore Drops
          </Button>
        </Card>
      )
  }
}
