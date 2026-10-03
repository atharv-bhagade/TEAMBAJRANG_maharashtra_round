import { useCallback, useState } from 'react'
import { useMockState } from './useMockState'
import { claimTickets } from '../lib/api'

export function useAllocation() {
  const { allocation, user, drop } = useMockState()
  const [error, setError] = useState('')

  // No quantity argument: the API derives it from the queue entry's requestedQuantity.
  const claim = useCallback(async () => {
    setError('')
    try {
      await claimTickets(drop.id)
      return true
    } catch (e) {
      setError(e.message || 'We could not complete your claim. Please try again.')
      return false
    }
  }, [drop.id])

  return { allocation, user, error, claim }
}
