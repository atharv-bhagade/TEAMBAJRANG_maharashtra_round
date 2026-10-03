import { useCallback, useEffect, useState } from 'react'
import { useMockState } from './useMockState'
import { getQueueStatus, joinQueue, setRequestedQuantity, expireClaimWindow } from '../lib/api'
import { setState, isActiveEntry } from '../mock/mockState'
import { QUEUE_STATUS } from '../mock/mockData'

export function useQueue({ checkOnMount = false, watchExpiry = false } = {}) {
  const { queue, drop, user, selection } = useMockState()
  const [checking, setChecking] = useState(checkOnMount)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!checkOnMount) return undefined
    let active = true
    getQueueStatus().finally(() => active && setChecking(false))
    return () => {
      active = false
    }
  }, [checkOnMount])

  // Expire the claim window when it is due (releases the locked seats once).
  useEffect(() => {
    if (!watchExpiry) return undefined
    const id = setInterval(() => expireClaimWindow(drop.id), 500)
    return () => clearInterval(id)
  }, [watchExpiry, drop.id])

  // Pre-join selection only; the mock API rejects this once an active entry exists.
  const selectQuantity = useCallback((quantity) => {
    setError('')
    try {
      setRequestedQuantity(quantity)
    } catch (e) {
      setError(e.message)
    }
  }, [])

  const selectedQuantity = selection?.requestedQuantity || 1
  const isActive = isActiveEntry(queue)

  // The quantity is read from the centralized selection state, not passed through the UI.
  const join = useCallback(async () => {
    setError('')
    setJoining(true)
    try {
      await joinQueue({ dropId: drop.id, requestedQuantity: selectedQuantity })
      return true
    } catch (e) {
      setError(e.message || 'We could not add you to the queue. Please try again.')
      return false
    } finally {
      setJoining(false)
    }
  }, [drop.id, selectedQuantity])

  // Return to the state held before a cooldown / re-auth interruption.
  // Queue entry, quantity, locked seats and claim deadline are untouched.
  const resume = useCallback(() => {
    setState((s) => ({
      queue: {
        ...s.queue,
        status: s.queue.resumeStatus || QUEUE_STATUS.WAITING,
        resumeStatus: null,
        cooldownUntil: null,
      },
    }))
  }, [])

  return {
    queue,
    status: queue.status,
    isActive,
    selectedQuantity,
    drop,
    user,
    checking,
    joining,
    error,
    join,
    selectQuantity,
    resume,
  }
}
