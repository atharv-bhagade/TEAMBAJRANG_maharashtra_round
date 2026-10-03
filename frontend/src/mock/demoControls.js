// ===== DEMO-ONLY CONTROLS =====
// These helpers simulate server-side events (admission, cooldown, etc.) for the
// demo. They are isolated to the developer panel.
import { getState, setState, resetMockState, isHoldingLock, releaseLockPatch } from './mockState'
import { admitUser } from '../lib/api'
import {
  QUEUE_STATUS,
  ALLOCATION_STATUS,
  DROP_STATUS,
  COOLDOWN_SECONDS,
} from './mockData'

// Triggers admission through the API layer
export const simulateAdmission = () => admitUser(getState().drop.id)

const interruptible = (status) => status === QUEUE_STATUS.WAITING || status === QUEUE_STATUS.ADMITTED

export const simulateCooldown = () =>
  setState((s) =>
    interruptible(s.queue.status)
      ? {
          queue: {
            ...s.queue,
            resumeStatus: s.queue.status,
            status: QUEUE_STATUS.COOLDOWN,
            cooldownUntil: Date.now() + COOLDOWN_SECONDS * 1000,
          },
        }
      : {},
  )

// Re-authentication is an AUTHENTICATION state, NOT a queue state.
// Preserves the user's existing participant state completely.
export const simulateReAuth = () =>
  setState((s) => ({
    session: { ...s.session, reAuthRequired: true },
  }))

// Closing the drop releases any seats still locked for the participant.
export const simulateClosed = () =>
  setState((s) => {
    const holding = isHoldingLock(s.queue)
    const terminal = s.queue.status === QUEUE_STATUS.COMPLETED || s.queue.status === QUEUE_STATUS.EXPIRED
    const baseDrop = holding ? releaseLockPatch(s).drop : s.drop
    return {
      drop: { ...baseDrop, status: DROP_STATUS.CLOSED },
      queue: terminal ? s.queue : { ...s.queue, status: QUEUE_STATUS.CLOSED, lockedQuantity: 0, resumeStatus: null },
    }
  })

export const setDropStatus = (status) =>
  setState((s) => ({ drop: { ...s.drop, status } }))

export const setTicketsOwned = (n) =>
  setState((s) => ({ user: { ...s.user, ticketsOwned: n } }))

export const setForceClaimFailure = (value) =>
  setState((s) => ({ demo: { ...s.demo, forceClaimFailure: value } }))

// Shortens the running claim window so expiry can be tested quickly.
export const shortenClaimWindow = (seconds = 5) =>
  setState((s) =>
    isHoldingLock(s.queue) ? { queue: { ...s.queue, claimExpiresAt: Date.now() + seconds * 1000 } } : {},
  )

export const simulateAllocationState = (status) =>
  setState((s) => ({
    allocation:
      status === ALLOCATION_STATUS.SUCCESS
        ? { status, quantity: Math.max(1, s.allocation.quantity), allocationId: 'FD-DEMO-001' }
        : { status, quantity: 0, allocationId: null },
  }))

export const resetDemo = resetMockState
