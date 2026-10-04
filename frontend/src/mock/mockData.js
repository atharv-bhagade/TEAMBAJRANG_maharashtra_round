// Centralized Platform Data: Multi-Event, Multi-User Ticketing Platform

export const EVENT_STATUS = {
  OPEN: 'OPEN',
  SOLD_OUT: 'SOLD_OUT',
  UPCOMING: 'UPCOMING',
  CLOSED: 'CLOSED',
}

export const BOOKING_STATUS = {
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
}

// Backward-compatibility exports for legacy queue/allocation views
export const QUEUE_STATUS = {
  NOT_JOINED: 'NOT_JOINED',
  WAITING: 'WAITING',
  ADMITTED: 'ADMITTED',
  COMPLETED: 'COMPLETED',
  EXPIRED: 'EXPIRED',
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
  id: 'user-sarah',
  name: 'Sarah Connor',
  email: 'sarah.connor@example.com',
  ticketsOwned: 0,
  maxTickets: 4,
}

export const mockQueue = {
  userId: 'user-sarah',
  dropId: 'drop-001',
  requestedQuantity: 1,
  status: QUEUE_STATUS.NOT_JOINED,
  joinedAt: null,
  admittedAt: null,
  claimExpiresAt: null,
  lockedQuantity: 0,
  resumeStatus: null,
  cooldownUntil: null,
}

export const mockAllocation = {
  status: ALLOCATION_STATUS.NONE,
  quantity: 0,
  allocationId: null,
}


export const EVENT_CATEGORIES = [
  'All',
  'Concert',
  'Pop',
  'EDM',
  'Symphony',
  'Festival',
]

// Initial seed events with rich metadata and high-res imagery
export const initialEvents = [
  {
    id: 'event-001',
    title: 'Coldplay — Music of the Spheres World Tour',
    artist: 'Coldplay',
    category: 'Concert',
    date: 'Sat, Nov 14, 2026 · 19:30 IST',
    venue: 'DY Patil Stadium, Navi Mumbai',
    city: 'Mumbai',
    bannerUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=1200',
    pricePerTicket: 125,
    currency: 'USD',
    totalSeats: 500,
    availableSeats: 342,
    ticketLimitPerUser: 4,
    description: 'Experience Coldplay live on their record-breaking Music of the Spheres World Tour featuring stadium-scale kinetic visuals, pyrotechnics, and iconic anthems.',
    featured: true,
    status: EVENT_STATUS.OPEN,
  },
  {
    id: 'event-002',
    title: 'Dua Lipa — Radical Optimism Tour',
    artist: 'Dua Lipa',
    category: 'Pop',
    date: 'Fri, Dec 04, 2026 · 20:00 IST',
    venue: 'MMRDA Grounds, BKC, Mumbai',
    city: 'Mumbai',
    bannerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200',
    pricePerTicket: 110,
    currency: 'USD',
    totalSeats: 450,
    availableSeats: 218,
    ticketLimitPerUser: 4,
    description: 'Global pop superstar Dua Lipa brings Radical Optimism to Mumbai with dazzling dance-pop choreography, high-energy live band, and stadium hits.',
    featured: true,
    status: EVENT_STATUS.OPEN,
  },
  {
    id: 'event-003',
    title: 'A.R. Rahman — Symphonic Waves Live',
    artist: 'A.R. Rahman',
    category: 'Symphony',
    date: 'Sun, Dec 20, 2026 · 18:30 IST',
    venue: 'Jio World Garden, BKC, Mumbai',
    city: 'Mumbai',
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200',
    pricePerTicket: 95,
    currency: 'USD',
    totalSeats: 350,
    availableSeats: 94,
    ticketLimitPerUser: 4,
    description: 'An acoustic and symphonic masterclass by Academy Award winner A.R. Rahman backed by an international 60-piece orchestra and guest vocalists.',
    featured: false,
    status: EVENT_STATUS.OPEN,
  },
  {
    id: 'event-004',
    title: 'Diljit Dosanjh — Dil-Luminati India Tour',
    artist: 'Diljit Dosanjh',
    category: 'Concert',
    date: 'Sat, Jan 09, 2027 · 19:00 IST',
    venue: 'Mahalaxmi Race Course, Mumbai',
    city: 'Mumbai',
    bannerUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200',
    pricePerTicket: 140,
    currency: 'USD',
    totalSeats: 600,
    availableSeats: 310,
    ticketLimitPerUser: 4,
    description: 'The historic Dil-Luminati tour brings electrifying Punjabi rhythms, unmatched crowd energy, and state-of-the-art stage pyrotechnics.',
    featured: true,
    status: EVENT_STATUS.OPEN,
  },
  {
    id: 'event-005',
    title: 'Sunburn Arena — Martin Garrix World Tour',
    artist: 'Martin Garrix',
    category: 'EDM',
    date: 'Sat, Jan 30, 2027 · 17:00 IST',
    venue: 'Bandra-Kurla Complex Open Arena',
    city: 'Mumbai',
    bannerUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&q=80&w=1200',
    pricePerTicket: 85,
    currency: 'USD',
    totalSeats: 800,
    availableSeats: 520,
    ticketLimitPerUser: 4,
    description: 'EDM titan Martin Garrix headlines Sunburn Arena with laser visual spectacles, unreleased festival tracks, and relentless bass.',
    featured: false,
    status: EVENT_STATUS.OPEN,
  },
  {
    id: 'event-006',
    title: 'The Weeknd — After Hours Experience',
    artist: 'The Weeknd',
    category: 'Pop',
    date: 'Sat, Feb 20, 2027 · 20:30 IST',
    venue: 'DY Patil Stadium, Navi Mumbai',
    city: 'Mumbai',
    bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200',
    pricePerTicket: 160,
    currency: 'USD',
    totalSeats: 500,
    availableSeats: 18,
    ticketLimitPerUser: 4,
    description: 'The visionary R&B/pop auteur presents a theatrical stadium night of cinematic soundscapes and chart-topping hits.',
    featured: false,
    status: EVENT_STATUS.OPEN,
  },
]

// Multi-user mock accounts for testing scoped data persistence
export const mockUsers = [
  {
    id: 'user-sarah',
    name: 'Sarah Connor',
    email: 'sarah.connor@example.com',
    password: 'demo123',
    role: 'user',
    avatar: 'S',
    ticketsOwned: 0,
    maxTickets: 4,
  },
  {
    id: 'user-alex',
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    password: 'demo123',
    role: 'user',
    avatar: 'A',
    ticketsOwned: 0,
    maxTickets: 4,
  },
  {
    id: 'admin-main',
    name: 'Event Director (Admin)',
    email: 'admin@fairdrop.demo',
    password: 'demo123',
    role: 'admin',
    avatar: '👑',
    ticketsOwned: 0,
    maxTickets: 0,
  },
]

// Seed initial bookings scoped to User Alex
export const initialBookings = [
  {
    id: 'BK-COLD-01',
    bookingId: 'BK-COLD-01',
    eventId: 'event-001',
    eventTitle: 'Coldplay — Music of the Spheres World Tour',
    eventDate: 'Sat, Nov 14, 2026 · 19:30 IST',
    eventVenue: 'DY Patil Stadium, Navi Mumbai',
    bannerUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=1200',
    userId: 'user-alex',
    userEmail: 'alex.morgan@example.com',
    userName: 'Alex Morgan',
    quantity: 2,
    unitPrice: 125,
    totalPrice: 250,
    currency: 'USD',
    bookedAt: '2026-10-01T14:20:00Z',
    status: BOOKING_STATUS.CONFIRMED,
  },
]

