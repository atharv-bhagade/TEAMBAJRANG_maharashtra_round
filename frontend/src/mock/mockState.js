// Centralized MOCK state store (user / drop / queue entry / allocation).
// Kept outside React so UI components never own "authoritative" data.
// Persisted to localStorage so a refresh behaves like session recovery:
// it restores the existing queue entry (same quantity, same claim deadline)
// instead of creating a new one.
import {
  mockDrop,
  mockUser,
  mockQueue,
  mockAllocation,
  QUEUE_STATUS,
} from './mockData'

const STORAGE_KEY = 'fairdrop.phase1.mock.v3'

const initialState = () => ({
  session: { loggedIn: false, reAuthRequired: false },
  user: { ...mockUser },
  drop: { ...mockDrop },
  queue: { ...mockQueue }, // the CURRENT (latest) queue entry
  queueHistory: [], // earlier entries (COMPLETED / EXPIRED / CLOSED)
  selection: { requestedQuantity: 1 }, // pre-join choice for the NEXT entry
  allocation: { ...mockAllocation },
  demo: { forceClaimFailure: false, allocationCounter: 0 },
})

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...initialState(), ...JSON.parse(raw) }
  } catch {
    // corrupt storage: fall back to a clean state
  }
  return initialState()
}

let state = load()
const listeners = new Set()

export const getState = () => state

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function setState(updater) {
  const patch = typeof updater === 'function' ? updater(state) : updater
  state = { ...state, ...patch }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage unavailable: state still works in-memory
  }
  listeners.forEach((l) => l())
}

export function resetMockState() {
  state = initialState()
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
  listeners.forEach((l) => l())
}

export const inventoryIsConsistent = (drop) =>
  drop.remainingSeats + drop.lockedSeats + drop.allocatedSeats === drop.totalSeats

// Cumulative entitlement: only successfully allocated tickets (user.ticketsOwned) count.
export const remainingEntitlementOf = (s) =>
  Math.max(0, s.drop.maxTicketsPerUser - s.user.ticketsOwned)

// An ACTIVE entry blocks creating another one (one active entry per user + drop).
// Note: re-authentication is an auth state, not a queue status.
export const isActiveEntry = (queue) =>
  queue.status === QUEUE_STATUS.WAITING ||
  queue.status === QUEUE_STATUS.ADMITTED ||
  queue.status === QUEUE_STATUS.COOLDOWN

// True while the entry holds locked seats under a running claim window
export function isHoldingLock(queue) {
  return (
    queue.lockedQuantity > 0 &&
    (queue.status === QUEUE_STATUS.ADMITTED ||
      (queue.status === QUEUE_STATUS.COOLDOWN && queue.resumeStatus === QUEUE_STATUS.ADMITTED))
  )
}

// Returns a drop patch that moves the entry's locked seats back to remaining.
export function releaseLockPatch(s) {
  const q = s.queue.lockedQuantity
  return {
    drop: { ...s.drop, lockedSeats: s.drop.lockedSeats - q, remainingSeats: s.drop.remainingSeats + q },
  }
}

// Expires the claim window if due. Releases exactly the locked quantity, exactly once.
export function releaseExpiredClaim(now = Date.now()) {
  const { queue } = state
  if (!isHoldingLock(queue) || !queue.claimExpiresAt || queue.claimExpiresAt > now) return false
  setState((s) => ({
    ...releaseLockPatch(s),
    queue: { ...s.queue, status: QUEUE_STATUS.EXPIRED, lockedQuantity: 0, resumeStatus: null, cooldownUntil: null },
  }))
  return true
}

// Reconcile on page load: a restored session whose window already lapsed expires now.
releaseExpiredClaim()

// Maps the current participant state to the correct destination after signing in.
// Inspects current state; never blindly routes to the previous URL.
export function getPostLoginDestination(now = Date.now()) {
  const { queue } = state
  if (queue.status === QUEUE_STATUS.WAITING) {
    return '/queue'
  }
  if (queue.status === QUEUE_STATUS.ADMITTED) {
    if (queue.claimExpiresAt && queue.claimExpiresAt > now) {
      return '/queue'
    } else {
      releaseExpiredClaim(now)
      return '/'
    }
  }
  if (queue.status === QUEUE_STATUS.COMPLETED) {
    return '/allocation'
  }
  return '/drop'
}

// True when the page loaded with an already-existing queue entry (refresh / reconnect).
export const restoredOnLoad =
  state.session.loggedIn && !state.session.reAuthRequired && state.queue.status !== QUEUE_STATUS.NOT_JOINED
