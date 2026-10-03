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

  return (
    <Card className="text-center bg-[#15151F] border border-white/10 shadow-2xl" role="status" aria-live="polite">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/5 border border-white/10 text-3xl text-slate-400" aria-hidden="true">
        ⏱
      </div>
      <h1 className="mt-5 font-display text-3xl font-extrabold text-white">Your claim window expired.</h1>
      <p className="mx-auto mt-3 max-w-md text-slate-400 text-sm">
        The tickets are no longer held for you.
      </p>
      <Button to="/" variant="secondary" className="mt-8">
        Back to Home
      </Button>
    </Card>
  )
}
