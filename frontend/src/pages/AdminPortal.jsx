import { useState, useMemo } from 'react'
import { Link, Navigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import DemoControlsPanel from '../components/admin/DemoControlsPanel'
import { useEvents } from '../hooks/useEvents'
import { useBookings } from '../hooks/useBookings'
import { useAuth } from '../hooks/useAuth'
import { EVENT_STATUS } from '../mock/mockData'
import { resetDemoState } from '../mock/mockState'

const presetImages = [
  { label: 'Stadium Tour', url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Festival Stage', url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Arena Concert', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Symphony Hall', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200' },
]

export default function AdminPortal() {
  const { events, createEvent, modifyEvent, removeEvent } = useEvents()
  const { allBookings } = useBookings()
  const { user, users, switchUser, isAdmin } = useAuth()

  // Requirement 3: If a USER manually navigates to /admin, redirect to home page
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  const [activeTab, setActiveTab] = useState('events') // 'events' | 'create' | 'bookings' | 'demo'
  const [successToast, setSuccessToast] = useState('')


  // Create form state
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [category, setCategory] = useState('Concert')
  const [date, setDate] = useState('')
  const [venue, setVenue] = useState('')
  const [city, setCity] = useState('Mumbai')
  const [bannerUrl, setBannerUrl] = useState(presetImages[0].url)
  const [totalSeats, setTotalSeats] = useState(500)
  const [pricePerTicket, setPricePerTicket] = useState(120)
  const [ticketLimitPerUser, setTicketLimitPerUser] = useState(4)
  const [description, setDescription] = useState('')
  const [formError, setFormError] = useState('')

  // Aggregated platform stats
  const stats = useMemo(() => {
    let totalRevenue = 0
    let totalTicketsSold = 0

    allBookings.forEach((b) => {
      totalRevenue += b.totalPrice || 0
      totalTicketsSold += b.quantity || 0
    })

    return {
      totalEvents: events.length,
      totalRevenue,
      totalTicketsSold,
      activeBookingsCount: allBookings.length,
    }
  }, [events, allBookings])

  const handleCreateSubmit = (e) => {
    e.preventDefault()
    setFormError('')

    if (!title.trim()) {
      setFormError('Event title is required.')
      return
    }
    if (!venue.trim()) {
      setFormError('Venue is required.')
      return
    }
    if (!date.trim()) {
      setFormError('Date is required.')
      return
    }
    if (!totalSeats || Number(totalSeats) <= 0) {
      setFormError('Total seat quota must be greater than zero.')
      return
    }

    const newEvt = createEvent({
      title: title.trim(),
      artist: artist.trim() || title.trim(),
      category,
      date: date.trim(),
      venue: venue.trim(),
      city: city.trim(),
      bannerUrl: bannerUrl.trim() || presetImages[0].url,
      totalSeats: Number(totalSeats),
      pricePerTicket: Number(pricePerTicket),
      ticketLimitPerUser: Number(ticketLimitPerUser),
      description: description.trim() || 'Premier live tour event.',
      featured: false,
    })

    setSuccessToast(`Event "${newEvt.title}" created successfully!`)
    setTitle('')
    setArtist('')
    setDate('')
    setVenue('')
    setDescription('')
    setActiveTab('events')
    setTimeout(() => setSuccessToast(''), 4000)
  }

  const handleToggleStatus = (eventId, currentStatus) => {
    const nextStatus = currentStatus === EVENT_STATUS.OPEN ? EVENT_STATUS.SOLD_OUT : EVENT_STATUS.OPEN
    modifyEvent(eventId, { status: nextStatus })
    setSuccessToast('Event status updated.')
    setTimeout(() => setSuccessToast(''), 3000)
  }

  const handleDelete = (eventId) => {
    if (confirm('Are you sure you want to delete this event?')) {
      removeEvent(eventId)
      setSuccessToast('Event deleted.')
      setTimeout(() => setSuccessToast(''), 3000)
    }
  }

  const handleResetData = () => {
    if (confirm('Reset demo state to original state (preserving created events)?')) {
      resetDemoState()
      setSuccessToast('Demo state reset. Configured events preserved.')
      setTimeout(() => setSuccessToast(''), 3000)
    }
  }

  return (
    <PageContainer>
      <div className="py-4 sm:py-8 space-y-8 fd-fade-up">
        {/* Header & Role Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-violet-950 px-3 py-1 text-xs font-semibold text-violet-300 border border-violet-500/30">
                🛡️ Admin Portal
              </span>
              <span className="text-xs text-slate-400">
                Authorized as: <strong className="text-white">{user?.name}</strong>
              </span>
            </div>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Event Management & Inventory
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Create events, monitor real-time seat deductions, and review user-scoped bookings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetData}
              className="rounded-xl bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
            >
              ↻ Reset Demo Data
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('create')}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-950/60 hover:from-violet-500 hover:to-indigo-500 transition-all cursor-pointer"
            >
              + Create Event
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="rounded-2xl bg-emerald-950/70 border border-emerald-500/40 p-4 text-emerald-200 text-xs sm:text-sm flex items-center justify-between shadow-xl fd-fade-up">
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>{successToast}</span>
            </div>
            <button type="button" onClick={() => setSuccessToast('')} className="underline text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* Global Statistics Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-[#141420] border border-white/10 p-5 shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Events</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-white tabular-nums">
              {stats.totalEvents}
            </p>
          </div>

          <div className="rounded-2xl bg-[#141420] border border-white/10 p-5 shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tickets Sold</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-violet-300 tabular-nums">
              {stats.totalTicketsSold}
            </p>
          </div>

          <div className="rounded-2xl bg-[#141420] border border-white/10 p-5 shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Bookings</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-emerald-400 tabular-nums">
              {stats.activeBookingsCount}
            </p>
          </div>

          <div className="rounded-2xl bg-[#141420] border border-white/10 p-5 shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Gross Sales</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-white tabular-nums">
              ${stats.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('events')}
            className={`pb-3 px-3 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'events'
                ? 'border-violet-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            🎪 All Events ({events.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`pb-3 px-3 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'create'
                ? 'border-violet-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            ➕ Create New Event
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 px-3 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'bookings'
                ? 'border-violet-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            📋 User Bookings Audit ({allBookings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('demo')}
            className={`pb-3 px-3 transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'demo'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>🛠️</span>
            <span>Demo Controls</span>
          </button>
        </div>

        {/* TAB 1: ALL EVENTS MANAGEMENT */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            <div className="grid gap-4">
              {events.map((evt) => {
                const sold = evt.totalSeats - evt.availableSeats
                const percentSold = Math.round((sold / evt.totalSeats) * 100)
                const isSoldOut = evt.status === EVENT_STATUS.SOLD_OUT || evt.availableSeats === 0

                return (
                  <div
                    key={evt.id}
                    className="rounded-2xl bg-[#141420] border border-white/10 p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={evt.bannerUrl}
                        alt={evt.title}
                        className="h-16 w-24 rounded-xl object-cover border border-white/10 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-white text-base">
                            {evt.title}
                          </h3>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                              isSoldOut
                                ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                            }`}
                          >
                            {evt.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          📍 {evt.venue} · 📅 {evt.date} · 💲${evt.pricePerTicket}
                        </p>

                        {/* Real-time Sales Meter */}
                        <div className="pt-2 max-w-sm">
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                            <span>
                              Sold: <strong className="text-white">{sold}</strong> ({percentSold}%)
                            </span>
                            <span>
                              Remaining: <strong className="text-emerald-400">{evt.availableSeats}</strong> / {evt.totalSeats}
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                              style={{ width: `${percentSold}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Operational Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(evt.id, evt.status)}
                        className={`rounded-xl px-3 py-2 text-xs font-semibold border transition-colors ${
                          isSoldOut
                            ? 'bg-emerald-950/60 text-emerald-200 border-emerald-500/40 hover:bg-emerald-900/60'
                            : 'bg-amber-950/60 text-amber-200 border-amber-500/40 hover:bg-amber-900/60'
                        }`}
                      >
                        {isSoldOut ? 'Mark Open' : 'Mark Sold Out'}
                      </button>

                      <Link
                        to={`/events/${evt.id}`}
                        className="rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 px-3 py-2 text-xs font-semibold"
                      >
                        View Page ↗
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(evt.id)}
                        className="rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 px-3 py-2 text-xs font-semibold"
                        title="Delete event"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CREATE NEW EVENT */}
        {activeTab === 'create' && (
          <div className="max-w-3xl mx-auto rounded-3xl bg-[#141420] border border-white/10 p-6 sm:p-8 shadow-2xl">
            <h2 className="font-display text-xl font-bold text-white mb-1">
              Add New Live Event
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Registered events are immediately available in the public event browsing catalog.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Coldplay — Music of the Spheres"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#1A1A2A] px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Artist / Headliner
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Coldplay"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#1A1A2A] px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#1A1A2A] px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none"
                  >
                    <option value="Concert">Concert</option>
                    <option value="Pop">Pop</option>
                    <option value="EDM">EDM</option>
                    <option value="Symphony">Symphony</option>
                    <option value="Festival">Festival</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#1A1A2A] px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Date & Time *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sat, Dec 12, 2026 · 19:30 IST"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#1A1A2A] px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Venue / Stadium *
                </label>
                <input
                  type="text"
                  placeholder="e.g. DY Patil Stadium, Navi Mumbai"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#1A1A2A] px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Total Seat Quota *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#1A1A2A] px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Price per Ticket ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={pricePerTicket}
                    onChange={(e) => setPricePerTicket(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#1A1A2A] px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Limit Per User
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={ticketLimitPerUser}
                    onChange={(e) => setTicketLimitPerUser(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#1A1A2A] px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Banner Presets */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#1A1A2A] px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none mb-2"
                />
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="text-slate-400 text-[11px] self-center">Quick Picks:</span>
                  {presetImages.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setBannerUrl(p.url)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] border transition-colors ${
                        bannerUrl === p.url
                          ? 'bg-violet-600 text-white border-violet-400 font-bold'
                          : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Event Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Details regarding admission, timing, and stage..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#1A1A2A] px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none"
                />
              </div>

              {formError && (
                <p className="rounded-xl bg-rose-950/40 border border-rose-500/30 p-2.5 text-xs text-rose-300">
                  {formError}
                </p>
              )}

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-xs font-semibold text-white shadow-lg shadow-violet-950/60 hover:from-violet-500 hover:to-indigo-500 transition-all cursor-pointer"
                >
                  Publish Event to Catalog
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('events')}
                  className="rounded-xl bg-white/10 px-5 py-3 text-xs font-semibold text-slate-300 hover:bg-white/15 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: USER BOOKINGS AUDIT TABLE */}
        {activeTab === 'bookings' && (
          <div className="rounded-3xl bg-[#141420] border border-white/10 shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  Active User Bookings
                </h2>
                <p className="text-xs text-slate-400">
                  Real-time audit log of all claimed ticket reservations scoped by user account.
                </p>
              </div>
              <span className="font-mono text-xs text-violet-300 font-bold bg-white/5 px-2.5 py-1 rounded-lg">
                Total: {allBookings.length} Bookings
              </span>
            </div>

            {allBookings.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-8">No user bookings recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="pb-3 pr-4">Booking ID</th>
                      <th className="pb-3 pr-4">Customer</th>
                      <th className="pb-3 pr-4">Event</th>
                      <th className="pb-3 pr-4">Tickets</th>
                      <th className="pb-3 pr-4">Total</th>
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-medium">
                    {allBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 pr-4 font-mono font-bold text-violet-300">
                          {b.bookingId}
                        </td>
                        <td className="py-3 pr-4">
                          <p className="text-white">{b.userName || 'Anonymous'}</p>
                          <p className="text-[11px] text-slate-400">{b.userEmail}</p>
                        </td>
                        <td className="py-3 pr-4 text-slate-200 max-w-xs truncate">
                          {b.eventTitle}
                        </td>
                        <td className="py-3 pr-4 font-bold text-white">
                          {b.quantity} Seat{b.quantity > 1 ? 's' : ''}
                        </td>
                        <td className="py-3 pr-4 font-mono text-emerald-400 font-bold">
                          ${b.totalPrice}
                        </td>
                        <td className="py-3 pr-4 text-slate-400 text-[11px]">
                          {new Date(b.bookedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          <span className="rounded-full bg-emerald-950/80 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DEMO CONTROLS SIMULATOR */}
        {activeTab === 'demo' && (
          <div className="space-y-6 fd-fade-up">
            <DemoControlsPanel />
          </div>
        )}
      </div>
    </PageContainer>
  )
}
