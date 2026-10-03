import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function ClosedPanel({ soldOut = false, ticketsOwned, maxTickets }) {
  return (
    <Card className="text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-3xl text-slate-600" aria-hidden="true">■</div>
      <h1 className="mt-5 font-display text-3xl font-bold text-slate-900">
        {soldOut ? 'This drop is sold out' : 'This drop is closed'}
      </h1>
      <p className="mx-auto mt-3 max-w-md text-slate-600">
        {soldOut
          ? 'All tickets have been sold. Thank you for taking part.'
          : 'This ticket drop is closed.'}
      </p>
      <p className="mt-4 text-sm text-slate-500">Tickets owned: {ticketsOwned} / {maxTickets}</p>
      <Button to="/" variant="secondary" className="mt-6">Back to Home</Button>
    </Card>
  )
}
