// Centralized MOCK data for Phase 1. Nothing here is authoritative —
// in Phase 2 the FastAPI backend becomes the source of truth.

export const QUEUE_STATUS = {
  NOT_JOINED: 'NOT_JOINED',
  WAITING: 'WAITING',
  ADMITTED: 'ADMITTED',
  COMPLETED: 'COMPLETED',
  EXPIRED: 'EXPIRED', // terminal: claim window lapsed, locked seats were released
  COOLDOWN: 'COOLDOWN',
  RE_AUTH_REQUIRED: 'RE_AUTH_REQUIRED',
  CLOSED: 'CLOSED',
}

export const ALLOCATION_STATUS = {
  NONE: 'NONE',
  PROCESSING: 'PROCESSING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
}

export const DROP_STATUS = {
  UPCOMING: 'UPCOMING',
  OPEN: 'OPEN',
  SOLD_OUT: 'SOLD_OUT',
  CLOSED: 'CLOSED',
}

export const CLAIM_WINDOW_SECONDS = 120
export const COOLDOWN_SECONDS = 12

// Inventory model: remainingSeats + lockedSeats + allocatedSeats === totalSeats
export const mockDrop = {
  id: 'drop-001',
  eventName: 'Coldplay — Live in Mumbai',
  dropName: 'Fair Drop — Mumbai Round',
  venue: 'DY Patil Stadium, Navi Mumbai',
  startsAt: '2026-11-14T19:30:00+05:30',
  totalSeats: 500,
  remainingSeats: 347,
  lockedSeats: 0,
  allocatedSeats: 153,
  maxTicketsPerUser: 4,
  status: DROP_STATUS.OPEN,
}

export const mockUser = {
  id: 'demo-user-001',
  name: 'Demo User',
  email: '',
  ticketsOwned: 0,
  maxTickets: mockDrop.maxTicketsPerUser,
}

// Maps to a future Firestore doc: queueEntries/{userId_dropId}.
// While status is NOT_JOINED, requestedQuantity is only the pre-join selection.
// Once the entry is created (WAITING and beyond) it is immutable.
export const mockQueue = {
  userId: mockUser.id,
  dropId: mockDrop.id,
  requestedQuantity: 1,
  status: QUEUE_STATUS.NOT_JOINED,
  joinedAt: null,
  admittedAt: null,
  claimExpiresAt: null, // epoch ms, set once on admission, never reset
  lockedQuantity: 0, // seats currently locked for this entry
  resumeStatus: null, // status to return to after COOLDOWN / RE_AUTH_REQUIRED
  cooldownUntil: null,
}

export const mockAllocation = {
  status: ALLOCATION_STATUS.NONE,
  quantity: 0,
  allocationId: null,
}
