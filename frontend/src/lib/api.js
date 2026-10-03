// MOCK API boundary. Phase 2 replaces these bodies with FastAPI calls;
// the signatures and return shapes should stay stable.
// NO real HTTP requests are made here. All rules enforced here are
// frontend-only simulations — the backend will be authoritative.
//
// Core rule: ONE quantity per queue entry — requestedQuantity — chosen before
// joining, fixed afterwards, locked on admission, claimed exactly, allocated.
import {
  getState,
  setState,
  releaseExpiredClaim,
  remainingEntitlementOf,
  isActiveEntry,
} from '../mock/mockState'
import {
  QUEUE_STATUS,
  ALLOCATION_STATUS,
  DROP_STATUS,
  CLAIM_WINDOW_SECONDS,
} from '../mock/mockData'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const plural = (n, word = 'ticket') => `${n} ${word}${n === 1 ? '' : 's'}`

function requireAuth() {
  const { session } = getState()
  if (!session.loggedIn || session.reAuthRequired) {
    throw new Error('Please sign in again to continue.')
  }
}

// Entitlement is CUMULATIVE per user + drop: ticketsOwned (successful allocations only) +
// requestedQuantity must never exceed maxTicketsPerUser.
function validateQuantity(quantity) {
  const state = getState()
  const { drop, user } = state
  const max = drop.maxTicketsPerUser
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error('Please choose at least 1 ticket.')
  }
  if (quantity > max) {
    throw new Error(`You can request at most ${plural(max)} per account.`)
  }
  const entitlement = remainingEntitlementOf(state)
  if (entitlement === 0) {
    throw new Error('You have reached the maximum ticket limit for this drop.')
  }
  if (user.ticketsOwned + quantity > max) {
    throw new Error(`You already own ${user.ticketsOwned} of ${max}. You can request up to ${plural(entitlement)} more.`)
  }
}

export async function getDrop() {
  await wait(500)
  return getState().drop
}

// Pre-join selection for the NEXT queue entry. Rejected while an active entry exists.
export function setRequestedQuantity(quantity) {
  const state = getState()
  if (isActiveEntry(state.queue)) {
    throw new Error('Your requested quantity is fixed while you are in the queue.')
  }
  const entitlement = remainingEntitlementOf(state)
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > Math.min(state.drop.maxTicketsPerUser, entitlement)) {
    throw new Error(`Please choose between 1 and ${Math.min(state.drop.maxTicketsPerUser, entitlement)} tickets.`)
  }
  setState({ selection: { requestedQuantity: quantity } })
}

// Creates a NEW queue entry. At most one ACTIVE entry per user + drop; a COMPLETED or
// EXPIRED entry does not block a new one while entitlement remains.
export async function joinQueue({ dropId, requestedQuantity }) {
  await wait(1000)
  requireAuth()
  const { queue, drop, user } = getState()
  if (dropId !== drop.id) throw new Error('This ticket drop could not be found.')
  if (isActiveEntry(queue)) {
    throw new Error("You're already in the queue.")
  }
  if (drop.status !== DROP_STATUS.OPEN) {
    throw new Error('This ticket drop is closed.')
  }
  validateQuantity(requestedQuantity)
  if (drop.remainingSeats < requestedQuantity) {
    throw new Error(`Only ${plural(drop.remainingSeats)} remaining, which is fewer than the ${plural(requestedQuantity)} requested.`)
  }
  setState((s) => ({
    queueHistory: s.queue.status === QUEUE_STATUS.NOT_JOINED ? s.queueHistory : [...s.queueHistory, s.queue],
    selection: { requestedQuantity: 1 },
    allocation: { status: ALLOCATION_STATUS.NONE, quantity: 0, allocationId: null },
    queue: {
      userId: user.id,
      dropId: drop.id,
      requestedQuantity,
      status: QUEUE_STATUS.WAITING,
      joinedAt: Date.now(),
      admittedAt: null,
      claimExpiresAt: null,
      lockedQuantity: 0,
      resumeStatus: null,
      cooldownUntil: null,
    },
  }))
  return getState().queue
}

export async function getQueueStatus() {
  await wait(400)
  releaseExpiredClaim()
  return getState().queue
}

// Admission locks exactly requestedQuantity seats and starts the claim window once.
export async function admitUser(dropId) {
  const { queue, drop } = getState()
  if (dropId !== drop.id) throw new Error('This ticket drop could not be found.')
  if (queue.status !== QUEUE_STATUS.WAITING) {
    throw new Error('Only a waiting participant can be admitted.')
  }
  const q = queue.requestedQuantity
  if (drop.remainingSeats < q) {
    throw new Error(`Not enough tickets remain to hold ${plural(q)}.`)
  }
  const now = Date.now()
  setState((s) => ({
    drop: { ...s.drop, remainingSeats: s.drop.remainingSeats - q, lockedSeats: s.drop.lockedSeats + q },
    queue: {
      ...s.queue,
      status: QUEUE_STATUS.ADMITTED,
      admittedAt: now,
      claimExpiresAt: now + CLAIM_WINDOW_SECONDS * 1000,
      lockedQuantity: q,
    },
  }))
  return getState().queue
}

// Expires the claim window if due; releases exactly the locked quantity, once.
export async function expireClaimWindow(dropId) {
  if (dropId !== getState().drop.id) return false
  return releaseExpiredClaim()
}

// Claim tickets: strictly derives quantity from queue entry.
// BLOCKED if authentication requires re-authentication.
export async function claimTickets(dropId) {
  requireAuth()
  const check = () => {
    const { queue, drop } = getState()
    if (dropId !== drop.id || !queue.requestedQuantity || queue.status === QUEUE_STATUS.NOT_JOINED) {
      throw new Error('Your place in the queue could not be found.')
    }
    if (queue.status === QUEUE_STATUS.COMPLETED) {
      throw new Error('These tickets have already been claimed.')
    }
    if (queue.status === QUEUE_STATUS.EXPIRED) {
      throw new Error('Your claim window has expired.')
    }
    if (queue.status !== QUEUE_STATUS.ADMITTED) {
      throw new Error('You can only claim tickets once your turn arrives.')
    }
    if (queue.claimExpiresAt <= Date.now()) {
      releaseExpiredClaim()
      throw new Error('Your claim window has expired.')
    }
    if (queue.lockedQuantity !== queue.requestedQuantity || drop.lockedSeats < queue.lockedQuantity) {
      throw new Error('Your ticket reservation is no longer valid.')
    }
    return queue.requestedQuantity
  }

  const quantity = check()
  setState((s) => ({ allocation: { ...s.allocation, status: ALLOCATION_STATUS.PROCESSING, quantity } }))
  await wait(1800)

  try {
    check() // re-validate: the window may have lapsed while processing or re-auth required
  } catch (e) {
    setState((s) => ({ allocation: { status: ALLOCATION_STATUS.NONE, quantity: 0, allocationId: null } }))
    throw e
  }

  if (getState().demo.forceClaimFailure) {
    setState((s) => ({
      allocation: { status: ALLOCATION_STATUS.FAILED, quantity: 0, allocationId: null },
      demo: { ...s.demo, forceClaimFailure: false },
    }))
    return getState().allocation
  }

  const counter = getState().demo.allocationCounter + 1
  setState((s) => ({
    user: { ...s.user, ticketsOwned: s.user.ticketsOwned + quantity },
    drop: { ...s.drop, lockedSeats: s.drop.lockedSeats - quantity, allocatedSeats: s.drop.allocatedSeats + quantity },
    queue: { ...s.queue, status: QUEUE_STATUS.COMPLETED, lockedQuantity: 0, resumeStatus: null },
    allocation: {
      status: ALLOCATION_STATUS.SUCCESS,
      quantity,
      allocationId: `FD-DEMO-${String(counter).padStart(3, '0')}`,
    },
    demo: { ...s.demo, allocationCounter: counter },
  }))
  return getState().allocation
}

export async function getAllocation() {
  await wait(300)
  return getState().allocation
}
