/**
 * Multi-Event, Multi-User Centralized State Management
 * 
 * Persists events, user sessions, and user-scoped bookings to localStorage.
 * Ensures strict separation between users:
 * - User A's claimed tickets are attached strictly to User A's ID
 * - Event seats are deducted globally in real-time
 * - User B only sees User B's bookings
 * - Admin portal has full visibility across all bookings and inventory
 * - Frontend authentication with persistent session across reloads
 * - Comprehensive Demo Controls and simulated lifecycle states
 */

import {
  initialEvents,
  mockUsers,
  initialBookings,
  EVENT_STATUS,
  BOOKING_STATUS,
  mockDrop,
  mockUser,
  mockQueue,
  mockAllocation,
  QUEUE_STATUS,
  ALLOCATION_STATUS,
  DROP_STATUS,
} from './mockData.js'

const STORAGE_KEY = 'fairdrop.events.platform.v7'

const getInitialState = () => ({
  events: [...initialEvents],
  users: [...mockUsers],
  currentUser: mockUsers[0], // Sarah Connor (User) by default
  bookings: [...initialBookings],
  ui: {
    ticketsDrawerOpen: false,
    selectedEventId: initialEvents[0].id,
  },
  // Backward-compatibility state properties for legacy queue/allocation hooks
  session: { loggedIn: true, reAuthRequired: false, redirectAfterLogin: null },
  user: { ...mockUser },
  drop: { ...mockDrop },
  queue: { ...mockQueue },
  queueHistory: [],
  selection: { requestedQuantity: 1 },
  allocation: { ...mockAllocation },
  demo: { forceClaimFailure: false, allocationCounter: 0 },
})

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        ...getInitialState(),
        ...parsed,
        events: Array.isArray(parsed.events) && parsed.events.length > 0
          ? parsed.events
          : initialEvents,
        users: Array.isArray(parsed.users) && parsed.users.length > 0
          ? parsed.users
          : mockUsers,
        currentUser: parsed.currentUser || mockUsers[0],
        bookings: Array.isArray(parsed.bookings) ? parsed.bookings : initialBookings,
        session: parsed.session || { loggedIn: true, reAuthRequired: false, redirectAfterLogin: null },
      }
    }
  } catch (err) {
    console.warn('Failed to parse stored platform state, using initial state:', err)
  }
  return getInitialState()
}

let state = loadState()
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
  } catch (err) {
    console.warn('localStorage persist warning:', err)
  }
  listeners.forEach((listener) => listener())
}

export function resetAllData() {
  state = getInitialState()
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
  listeners.forEach((listener) => listener())
}

// ==================== EVENT ACCESSORS ====================

export function getEvents() {
  return state.events
}

export function getEventById(id) {
  return state.events.find((e) => e.id === id) || state.events[0]
}

export function addEvent(eventData) {
  const newId = `event-${Date.now().toString(36)}`
  const newEvent = {
    id: newId,
    title: eventData.title,
    artist: eventData.artist || eventData.title,
    category: eventData.category || 'Concert',
    date: eventData.date,
    venue: eventData.venue,
    city: eventData.city || 'Mumbai',
    bannerUrl:
      eventData.bannerUrl ||
      'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1200',
    pricePerTicket: Number(eventData.pricePerTicket) || 100,
    currency: eventData.currency || 'USD',
    totalSeats: Number(eventData.totalSeats) || 500,
    availableSeats: Number(eventData.totalSeats) || 500,
    ticketLimitPerUser: Number(eventData.ticketLimitPerUser) || 4,
    description: eventData.description || 'Live concert event.',
    featured: Boolean(eventData.featured),
    status: EVENT_STATUS.OPEN,
  }

  setState((s) => ({
    events: [newEvent, ...s.events],
  }))
  return newEvent
}

export function updateEvent(id, patch) {
  setState((s) => ({
    events: s.events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
  }))
}

export function deleteEvent(id) {
  setState((s) => ({
    events: s.events.filter((e) => e.id !== id),
  }))
}

// ==================== USER & AUTH ACCESSORS ====================

export function getCurrentUser() {
  return state.currentUser
}

export function switchUser(userId) {
  const targetUser = state.users.find((u) => u.id === userId)
  if (targetUser) {
    const ticketsCount = getUserBookings(targetUser.id).reduce((sum, b) => sum + (b.quantity || 0), 0)
    const updated = { ...targetUser, ticketsOwned: ticketsCount }
    setState({
      currentUser: updated,
      user: { ...mockUser, id: updated.id, name: updated.name, email: updated.email, ticketsOwned: ticketsCount },
      session: { loggedIn: true, reAuthRequired: false, redirectAfterLogin: null },
    })
  }
}

export function loginUser({ email, password }) {
  const cleanEmail = email.trim().toLowerCase()
  const found = state.users.find((u) => u.email.toLowerCase() === cleanEmail)
  if (!found) {
    throw new Error('User not found. Please sign up or use a demo account.')
  }
  if (found.password && found.password !== password) {
    throw new Error('Invalid email or password.')
  }
  const ticketsCount = getUserBookings(found.id).reduce((sum, b) => sum + (b.quantity || 0), 0)
  const updatedUser = { ...found, ticketsOwned: ticketsCount }
  setState((s) => ({
    currentUser: updatedUser,
    user: { ...s.user, id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, ticketsOwned: ticketsCount },
    session: { loggedIn: true, reAuthRequired: false, redirectAfterLogin: s.session.redirectAfterLogin },
  }))
  return updatedUser
}

export function signupUser({ name, email, password, confirmPassword }) {
  if (!name?.trim()) throw new Error('Full Name is required.')
  if (!email?.trim()) throw new Error('Email Address is required.')
  if (!password) throw new Error('Password is required.')
  if (password !== confirmPassword) throw new Error('Passwords do not match.')

  const cleanEmail = email.trim().toLowerCase()
  const existing = state.users.find((u) => u.email.toLowerCase() === cleanEmail)
  if (existing) throw new Error('An account with this email already exists.')

  // New accounts MUST always receive the USER role. No option to register as ADMIN!
  const newUser = {
    id: `user-${Date.now().toString(36)}`,
    name: name.trim(),
    email: cleanEmail,
    password,
    role: 'user', // STRICTLY USER ROLE
    avatar: name.trim()[0].toUpperCase(),
    ticketsOwned: 0,
    maxTickets: 4,
  }

  setState((s) => ({
    users: [...s.users, newUser],
    currentUser: newUser,
    user: { ...s.user, id: newUser.id, name: newUser.name, email: newUser.email, ticketsOwned: 0 },
    session: { loggedIn: true, reAuthRequired: false, redirectAfterLogin: s.session.redirectAfterLogin },
  }))
  return newUser
}

export function forceReauth(returnPath) {
  const redirectTarget = returnPath || (typeof window !== 'undefined' ? window.location.pathname : '/')
  setState((s) => ({
    session: {
      ...s.session,
      loggedIn: false,
      reAuthRequired: true,
      redirectAfterLogin: redirectTarget,
    },
  }))
}

export function clearReauth() {
  setState((s) => ({
    session: {
      ...s.session,
      reAuthRequired: false,
    },
  }))
}

export function logoutUser() {
  setState((s) => ({
    session: {
      ...s.session,
      loggedIn: false,
      reAuthRequired: false,
      redirectAfterLogin: null,
    },
  }))
}

// ==================== BOOKINGS ACCESSORS ====================

/**
 * Strictly returns only bookings belonging to the given userId
 */
export function getUserBookings(userId) {
  const targetId = userId || state.currentUser?.id
  return state.bookings.filter((b) => b.userId === targetId)
}

/**
 * Returns all bookings across all users for Admin management
 */
export function getAllBookings() {
  return state.bookings
}

/**
 * Calculates how many tickets the user has already booked for a specific event
 */
export function getUserBookedQuantity(userId, eventId) {
  const targetId = userId || state.currentUser?.id
  return state.bookings
    .filter((b) => b.userId === targetId && b.eventId === eventId && b.status === BOOKING_STATUS.CONFIRMED)
    .reduce((sum, b) => sum + (b.quantity || 0), 0)
}

/**
 * Books tickets for an event.
 * Atomically deducts availableSeats from the event and adds a confirmed booking scoped to userId.
 */
export function bookTickets({ eventId, quantity, userId, userEmail, userName }) {
  const currentEvent = getEventById(eventId)
  if (!currentEvent) {
    throw new Error('Event not found.')
  }

  // Prevent Admins from participating in booking
  const buyerUser = state.users.find(u => u.id === (userId || state.currentUser?.id)) || state.currentUser
  if (buyerUser?.role === 'admin') {
    throw new Error('Admins cannot book tickets.')
  }

  if (currentEvent.status !== EVENT_STATUS.OPEN) {
    throw new Error('This event is currently closed or sold out.')
  }

  const requestedQty = Number(quantity) || 1
  if (requestedQty < 1) {
    throw new Error('Please select at least 1 ticket.')
  }

  if (currentEvent.availableSeats < requestedQty) {
    throw new Error(`Only ${currentEvent.availableSeats} seats remaining for this event.`)
  }

  const buyerId = userId || state.currentUser.id
  const buyerEmail = userEmail || state.currentUser.email
  const buyerName = userName || state.currentUser.name

  // Enforce cumulative ticket limit per user for this event (Rule: max 4)
  const alreadyBooked = getUserBookedQuantity(buyerId, eventId)
  const limit = currentEvent.ticketLimitPerUser || 4
  const remainingEntitlement = Math.max(0, limit - alreadyBooked)

  if (requestedQty > remainingEntitlement) {
    throw new Error(
      `You already own ${alreadyBooked} of ${limit} allowed tickets. You can book at most ${remainingEntitlement} more.`
    )
  }

  const bookingId = `BK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
  const now = new Date().toISOString()
  const totalPrice = requestedQty * currentEvent.pricePerTicket

  const newBooking = {
    id: bookingId,
    bookingId,
    eventId: currentEvent.id,
    eventTitle: currentEvent.title,
    eventDate: currentEvent.date,
    eventVenue: currentEvent.venue,
    bannerUrl: currentEvent.bannerUrl,
    userId: buyerId,
    userEmail: buyerEmail,
    userName: buyerName,
    quantity: requestedQty,
    unitPrice: currentEvent.pricePerTicket,
    totalPrice,
    currency: currentEvent.currency || 'USD',
    bookedAt: now,
    status: BOOKING_STATUS.CONFIRMED,
  }

  // Deduct available seats
  const newAvailable = Math.max(0, currentEvent.availableSeats - requestedQty)
  const newStatus = newAvailable === 0 ? EVENT_STATUS.SOLD_OUT : currentEvent.status

  setState((s) => ({
    events: s.events.map((e) =>
      e.id === currentEvent.id
        ? { ...e, availableSeats: newAvailable, status: newStatus }
        : e
    ),
    bookings: [newBooking, ...s.bookings],
    user: {
      ...s.user,
      ticketsOwned: (s.user.ticketsOwned || 0) + requestedQty,
    },
    currentUser: {
      ...s.currentUser,
      ticketsOwned: (s.currentUser.ticketsOwned || 0) + requestedQty,
    },
  }))

  return newBooking
}

// UI controls
export function toggleTicketsDrawer(open) {
  setState((s) => ({
    ui: {
      ...s.ui,
      ticketsDrawerOpen: typeof open === 'boolean' ? open : !s.ui.ticketsDrawerOpen,
    },
  }))
}

// ==================== DEMO CONTROLS & SIMULATIONS ====================

/**
 * A. RESET DEMO:
 * Resets user state, booking/claim state, queue state, allocation state,
 * inventory state, simulated expiry state, forced re-auth state.
 * CRITICAL RULE: Does NOT delete configured events!
 */
export function resetDemoState() {
  const configuredEvents = state.events // Preserved!
  const base = getInitialState()

  setState({
    ...base,
    events: configuredEvents, // Do NOT delete configured events
    users: [...mockUsers],
    currentUser: mockUsers[0],
    user: { ...mockUser },
    bookings: [...initialBookings],
    session: { loggedIn: true, reAuthRequired: false, redirectAfterLogin: null },
    queue: { ...mockQueue },
    allocation: { ...mockAllocation },
    drop: { ...mockDrop },
  })
}

/**
 * B. TICKET LIMIT SCENARIOS:
 * Maximum cumulative successful tickets per user = 4.
 * Exact scenarios:
 * 1. 0 booked -> req 4 (ALLOWED)
 * 2. 1 booked -> req 3 (ALLOWED)
 * 3. 2 booked -> req 2 (ALLOWED)
 * 4. 3 booked -> req 1 (ALLOWED)
 * 5. 4 booked -> req 1 (REJECTED)
 * 6. 2 booked -> req 3 (REJECTED)
 * 7. 2 booked -> req 4 (REJECTED)
 * 
 * For rejected requests:
 * - Do not change booked quantity.
 * - Do not change inventory.
 * - Do not create a queue entry.
 * - Do not create an allocation.
 * - Display existing error mechanism.
 */
export function testTicketLimitScenario(bookedQty, requestQty) {
  const maxLimit = 4
  const total = bookedQty + requestQty

  if (total > maxLimit) {
    // REJECTED scenario
    return {
      allowed: false,
      bookedQty,
      requestQty,
      total,
      message: `Request REJECTED: User already has ${bookedQty} tickets booked. Requesting ${requestQty} exceeds the cumulative maximum limit of ${maxLimit} (Total would be ${total}).`,
    }
  }

  // ALLOWED scenario
  setState((s) => ({
    user: { ...s.user, ticketsOwned: bookedQty },
    currentUser: { ...s.currentUser, ticketsOwned: bookedQty },
    selection: { requestedQuantity: requestQty },
  }))

  return {
    allowed: true,
    bookedQty,
    requestQty,
    total,
    message: `Request ALLOWED: User has ${bookedQty} tickets booked. Requesting ${requestQty} is within the cumulative maximum limit of ${maxLimit} (Total: ${total}).`,
  }
}

/**
 * C. SUCCESSFUL ALLOCATION SIMULATION:
 * Uses existing AllocationResult/booking confirmation UI.
 */
export function simulateSuccessfulAllocation(quantity = 2) {
  const targetEvent = state.events[0] || initialEvents[0]
  const targetUser = state.currentUser || mockUsers[0]
  const allocationId = `FD-ALLOC-${Date.now().toString(36).toUpperCase()}`

  const newBooking = {
    id: allocationId,
    bookingId: allocationId,
    eventId: targetEvent.id,
    eventTitle: targetEvent.title,
    eventDate: targetEvent.date,
    eventVenue: targetEvent.venue,
    bannerUrl: targetEvent.bannerUrl,
    userId: targetUser.id,
    userEmail: targetUser.email,
    userName: targetUser.name,
    quantity,
    unitPrice: targetEvent.pricePerTicket,
    totalPrice: quantity * targetEvent.pricePerTicket,
    currency: targetEvent.currency || 'USD',
    bookedAt: new Date().toISOString(),
    status: BOOKING_STATUS.CONFIRMED,
  }

  const updatedOwned = Math.min(4, (targetUser.ticketsOwned || 0) + quantity)

  setState((s) => ({
    drop: {
      ...s.drop,
      eventName: targetEvent.title,
      venue: targetEvent.venue,
      startsAt: targetEvent.date,
      allocatedSeats: s.drop.allocatedSeats + quantity,
      remainingSeats: Math.max(0, s.drop.remainingSeats - quantity),
    },
    user: {
      ...s.user,
      id: targetUser.id,
      name: targetUser.name,
      email: targetUser.email,
      ticketsOwned: updatedOwned,
    },
    currentUser: {
      ...s.currentUser,
      ticketsOwned: updatedOwned,
    },
    queue: {
      ...s.queue,
      status: QUEUE_STATUS.COMPLETED,
      requestedQuantity: quantity,
      lockedQuantity: 0,
    },
    allocation: {
      status: ALLOCATION_STATUS.SUCCESS,
      quantity,
      allocationId,
    },
    bookings: [newBooking, ...s.bookings.filter(b => b.id !== allocationId)],
  }))

  return { success: true, allocationId }
}

/**
 * D. CLAIM EXPIRY SIMULATION:
 * Lifecycle: QUEUED -> ADMITTED -> CLAIM WINDOW ACTIVE -> CLAIM WINDOW EXPIRES -> LOCKED TICKETS RELEASED -> CLAIM DISALLOWED.
 * Expiry is terminal.
 */
export function simulateClaimExpiryFlow() {
  const lockedQty = 2
  const targetEvent = state.events[0] || initialEvents[0]

  // Step 1: ADMITTED with active claim window and locked tickets
  setState((s) => ({
    drop: {
      ...s.drop,
      eventName: targetEvent.title,
      venue: targetEvent.venue,
      remainingSeats: Math.max(0, s.drop.remainingSeats - lockedQty),
      lockedSeats: s.drop.lockedSeats + lockedQty,
    },
    queue: {
      ...s.queue,
      status: QUEUE_STATUS.ADMITTED,
      requestedQuantity: lockedQty,
      lockedQuantity: lockedQty,
      claimExpiresAt: Date.now() + 1500, // 1.5s countdown
    },
  }))

  // Step 2: Expires after 1.5s, releases locked tickets exactly once, terminal EXPIRED state
  setTimeout(() => {
    setState((s) => {
      const holding = s.queue.lockedQuantity || lockedQty
      return {
        drop: {
          ...s.drop,
          lockedSeats: Math.max(0, s.drop.lockedSeats - holding),
          remainingSeats: s.drop.remainingSeats + holding,
        },
        queue: {
          ...s.queue,
          status: QUEUE_STATUS.EXPIRED,
          lockedQuantity: 0,
          claimExpiresAt: null,
        },
      }
    })
  }, 1500)

  return { success: true }
}

/**
 * E. LOW INVENTORY / SOLD OUT:
 * Low Inventory: small remaining inventory (e.g. 2 seats).
 * Sold Out: 0 seats remaining.
 */
export function simulateLowInventory(eventId) {
  const targetId = eventId || state.events[0]?.id
  setState((s) => ({
    events: s.events.map((e) =>
      e.id === targetId ? { ...e, availableSeats: 2, status: EVENT_STATUS.OPEN } : e
    ),
    drop: {
      ...s.drop,
      remainingSeats: 2,
      status: DROP_STATUS.OPEN,
    },
  }))
}

export function simulateSoldOut(eventId) {
  const targetId = eventId || state.events[0]?.id
  setState((s) => ({
    events: s.events.map((e) =>
      e.id === targetId ? { ...e, availableSeats: 0, status: EVENT_STATUS.SOLD_OUT } : e
    ),
    drop: {
      ...s.drop,
      remainingSeats: 0,
      status: DROP_STATUS.SOLD_OUT,
    },
  }))
}

/**
 * G. QUEUE / ADMISSION:
 * Simulate Queue: sets state to QUEUED (WAITING).
 * Simulate Admission: sets state to ADMITTED -> claim window active.
 */
export function simulateQueueState() {
  setState((s) => ({
    queue: {
      ...s.queue,
      status: QUEUE_STATUS.WAITING,
      requestedQuantity: 2,
      lockedQuantity: 0,
      claimExpiresAt: null,
    },
  }))
}

export function simulateAdmissionState() {
  const q = 2
  const now = Date.now()
  setState((s) => ({
    drop: {
      ...s.drop,
      remainingSeats: Math.max(0, s.drop.remainingSeats - q),
      lockedSeats: s.drop.lockedSeats + q,
    },
    queue: {
      ...s.queue,
      status: QUEUE_STATUS.ADMITTED,
      requestedQuantity: q,
      lockedQuantity: q,
      admittedAt: now,
      claimExpiresAt: now + 120000,
    },
  }))
}

// Backward-compatibility exports for legacy demo/allocation helpers
export const inventoryIsConsistent = (drop) =>
  drop ? drop.remainingSeats + drop.lockedSeats + drop.allocatedSeats === drop.totalSeats : true

export const remainingEntitlementOf = (s) =>
  s?.drop ? Math.max(0, s.drop.maxTicketsPerUser - (s.user?.ticketsOwned || 0)) : 4

export const isActiveEntry = (queue) =>
  queue && (
    queue.status === QUEUE_STATUS.WAITING ||
    queue.status === QUEUE_STATUS.ADMITTED ||
    queue.status === QUEUE_STATUS.COOLDOWN
  )

export function isHoldingLock(queue) {
  return (
    queue &&
    queue.lockedQuantity > 0 &&
    (queue.status === QUEUE_STATUS.ADMITTED ||
      (queue.status === QUEUE_STATUS.COOLDOWN && queue.resumeStatus === QUEUE_STATUS.ADMITTED))
  )
}

export function releaseLockPatch(s) {
  const q = s?.queue?.lockedQuantity || 0
  return {
    drop: { ...s.drop, lockedSeats: (s.drop?.lockedSeats || 0) - q, remainingSeats: (s.drop?.remainingSeats || 0) + q },
  }
}

export function releaseExpiredClaim() {
  return false
}

export function getPostLoginDestination() {
  return '/'
}

export const restoredOnLoad = false
export const resetMockState = resetDemoState
