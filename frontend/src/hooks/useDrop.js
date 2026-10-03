import { useEffect, useState } from 'react'
import { useMockState } from './useMockState'
import { getDrop } from '../lib/api'

// Loads the drop through the API boundary (shows "Loading drop..." first).
export function useDrop() {
  const { drop, user } = useMockState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getDrop()
      .catch(() => active && setError('We could not load this drop. Please try again.'))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const remainingEntitlement = Math.max(0, user.maxTickets - user.ticketsOwned)
  return { drop, loading, error, remainingEntitlement }
}
