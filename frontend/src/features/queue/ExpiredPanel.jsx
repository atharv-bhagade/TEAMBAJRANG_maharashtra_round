import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const REDIRECT_MS = 6000

// EXPIRED is terminal for this drop: no retry / new claim window is offered.
export default function ExpiredPanel({ requestedQuantity }) {
  const navigate = useNavigate()

  useEffect(() => {
    const id = setTimeout(() => navigate('/', { replace: true }), REDIRECT_MS)
    return () => clearTimeout(id)
  }, [navigate])

  const held = requestedQuantity === 1 ? '1 temporarily held ticket was' : `${requestedQuantity} temporarily held tickets were`

  return (
    <Card className="text-center" role="status" aria-live="polite">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-3xl text-slate-600" aria-hidden="true">⏱</div>
      <h1 className="mt-5 font-display text-3xl font-bold text-slate-900">Your claim window expired.</h1>
      <p className="mx-auto mt-3 max-w-md text-slate-600">
        The tickets are no longer held for you.
      </p>
      <Button to="/" variant="secondary" className="mt-6">Back to Home</Button>
    </Card>
  )
}
