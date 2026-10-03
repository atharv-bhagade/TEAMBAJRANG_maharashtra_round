import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function ClosedPanel({ soldOut = false, ticketsOwned, maxTickets }) {
  return (
    <Card className="text-center bg-[#15151F] border border-white/10 shadow-2xl">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/5 border border-white/10 text-3xl text-slate-400" aria-hidden="true">■</div>
      <h1 className="mt-5 font-display text-3xl font-extrabold text-white">
        {soldOut ? 'This drop is sold out' : 'This ticket drop is closed'}
      </h1>
      <p className="mx-auto mt-3 max-w-md text-slate-400 text-sm leading-relaxed">
        {soldOut
          ? 'All tickets have been sold. Thank you for taking part.'
          : 'This ticket drop is closed.'}
      </p>
      <p className="mt-4 text-xs uppercase tracking-wider text-slate-400">Tickets owned: {ticketsOwned} / {maxTickets}</p>
      <Button to="/" variant="secondary" className="mt-8">Back to Home</Button>
    </Card>
  )
}
