import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import HumanVerificationModal from '../components/verification/HumanVerificationModal'
import { useEvents } from '../hooks/useEvents'
import { useBookings } from '../hooks/useBookings'
import { useAuth } from '../hooks/useAuth'
import { EVENT_STATUS } from '../mock/mockData'

export default function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEvent } = useEvents()
  const { getEventBookedCount, reserveTickets, openDrawer } = useBookings()
  const { user, isAdmin } = useAuth()

  const event = useMemo(() => {
    return getEvent(id || 'event-001')
  }, [id, getEvent])

  const [quantity, setQuantity] = useState(1)
  const [isVerifying, setIsVerifying] = useState(false)
  const [latestBooking, setLatestBooking] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  if (!event) {
    return (
      <PageContainer>
        <div className="py-16 text-center">
          <h1 className="font-display text-2xl font-bold text-white">Event Not Found</h1>
          <p className="mt-2 text-sm text-slate-400">The requested event could not be located.</p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-semibold text-white"
          >
            ← Return to Event Catalog
          </Link>
        </div>
      </PageContainer>
    )
  }

  const alreadyBooked = getEventBookedCount(event.id)
  const maxLimit = event.ticketLimitPerUser || 4
  const remainingEntitlement = Math.max(0, maxLimit - alreadyBooked)
  const isSoldOut = event.status === EVENT_STATUS.SOLD_OUT || event.availableSeats === 0
  const maxSelectable = Math.min(event.availableSeats, remainingEntitlement)

  const subtotal = quantity * event.pricePerTicket
  const serviceFee = 4.50
  const orderTotal = subtotal + serviceFee

  // Trigger Human Verification flow
  const handleCheckoutClick = () => {
    setErrorMessage('')
    if (isAdmin) {
      setErrorMessage('Admins cannot book tickets.')
      return
    }
    if (remainingEntitlement <= 0) {
      setErrorMessage(`You have reached the limit of ${maxLimit} tickets for this event.`)
      return
    }
    if (quantity > event.availableSeats) {
      setErrorMessage(`Only ${event.availableSeats} seats remaining.`)
      return
    }
    setIsVerifying(true)
  }

  // Called once both Visual Captcha and Click/Hold tests succeed
  const handleVerificationSuccess = () => {
    setIsVerifying(false)
    if (isAdmin) {
      setErrorMessage('Admins cannot book tickets.')
      return
    }
    try {
      const booking = reserveTickets({
        eventId: event.id,
        quantity,
      })
      setLatestBooking(booking)
    } catch (err) {
      setErrorMessage(err.message || 'Failed to confirm booking.')
    }
  }

  return (
    <PageContainer>
      {/* Verification Modal */}
      <HumanVerificationModal
        isOpen={isVerifying}
        onClose={() => setIsVerifying(false)}
        onSuccess={handleVerificationSuccess}
        event={event}
        quantity={quantity}
      />

      <div className="py-4 sm:py-6 fd-fade-up">
        {/* Navigation Breadcrumb */}
        <div className="mb-5 flex items-center justify-between text-xs text-slate-400">
          <Link to="/" className="hover:text-white transition-colors flex items-center gap-1.5">
            ← Back to All Shows
          </Link>
          <span className="rounded-full bg-white/5 px-3 py-1 font-mono text-slate-300 border border-white/10">
            {event.category} · {event.city || 'Mumbai'}
          </span>
        </div>

        {/* Confirmation State if just booked */}
        {latestBooking ? (
          <div className="mx-auto max-w-2xl rounded-3xl bg-[#141422] border border-emerald-500/30 p-8 sm:p-10 shadow-2xl text-center fd-fade-up">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-950/80 border border-emerald-500/40 text-3xl text-emerald-400 mb-4">
              ✓
            </div>
            <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
              Booking Confirmed
            </span>
            <h1 className="mt-4 font-display text-2xl sm:text-3xl font-bold text-white">
              You're Going to {event.title}!
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Reserved strictly for <strong>{user?.name}</strong> ({user?.email}).
            </p>

            {/* Pass Preview Card */}
            <div className="fd-ticket my-8 rounded-2xl p-6 text-left border border-white/15 max-w-md mx-auto">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-violet-300 uppercase tracking-wider">
                  Admission Pass
                </span>
                <span className="font-mono text-white font-bold bg-white/10 px-2 py-0.5 rounded">
                  {latestBooking.bookingId}
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-white">{event.title}</h3>
              <p className="text-xs text-slate-300 mt-1">📍 {event.venue}</p>
              <p className="text-xs text-violet-300 mt-0.5">📅 {event.date}</p>

              <div className="my-4 border-b border-dashed border-white/15" />

              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="text-slate-400">TICKETS</p>
                  <p className="font-bold text-white text-base">{latestBooking.quantity} Seat{latestBooking.quantity > 1 ? 's' : ''}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400">TOTAL</p>
                  <p className="font-bold text-emerald-400 text-base">${latestBooking.totalPrice}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={openDrawer}
                className="w-full sm:w-auto rounded-xl bg-violet-600 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-violet-950 hover:bg-violet-500 transition-colors"
              >
                View in My Tickets 🎟️
              </button>
              <button
                type="button"
                onClick={() => setLatestBooking(null)}
                className="w-full sm:w-auto rounded-xl bg-white/10 px-6 py-3 text-xs font-semibold text-white hover:bg-white/15 transition-colors"
              >
                Book More Tickets
              </button>
            </div>
          </div>
        ) : (
          /* Event Details & Booking Form */
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Column: Event Media & Information */}
            <div className="lg:col-span-7 space-y-6">
              {/* Event Cover Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-slate-900 border border-white/10 shadow-2xl">
                <img
                  src={event.bannerUrl}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B12] via-transparent to-black/30" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="rounded-full bg-black/60 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-white border border-white/10">
                    {event.category}
                  </span>
                  <span className="rounded-full bg-violet-950/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-violet-300 border border-violet-500/40">
                    Official Tickets
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="rounded-3xl bg-[#141420] border border-white/10 p-6 sm:p-8 shadow-xl">
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                  {event.artist}
                </p>
                <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {event.title}
                </h1>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs text-slate-300 border-y border-white/10 py-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">📅</span>
                    <div>
                      <p className="font-semibold text-white">Date & Time</p>
                      <p className="text-slate-400">{event.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">📍</span>
                    <div>
                      <p className="font-semibold text-white">Venue Location</p>
                      <p className="text-slate-400">{event.venue}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    About This Event
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Checkout & Ticket Reservation Box */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl bg-[#141420] border border-white/10 p-6 sm:p-7 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Price per ticket
                    </span>
                    <p className="font-display text-2xl font-extrabold text-white">
                      ${event.pricePerTicket}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Live Availability
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      {event.availableSeats} / {event.totalSeats} seats
                    </span>
                  </div>
                </div>

                {/* Account Ticket Entitlement Meter */}
                <div className="mt-5 rounded-2xl bg-[#1B1B2A] p-4 border border-white/5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-300">Your Booking Quota:</span>
                    <span className="font-mono font-bold text-violet-300">
                      {alreadyBooked} / {maxLimit} booked
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full bg-violet-500 rounded-full transition-all"
                      style={{ width: `${(alreadyBooked / maxLimit) * 100}%` }}
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-slate-400">
                    {remainingEntitlement > 0
                      ? `You can book up to ${remainingEntitlement} more ticket${remainingEntitlement > 1 ? 's' : ''} on this account.`
                      : `You have reached the maximum entitlement limit (${maxLimit} tickets).`}
                  </p>
                </div>

                {/* Ticket Quantity Selector */}
                {remainingEntitlement > 0 && !isSoldOut && (
                  <div className="mt-5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                      Select Ticket Quantity
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((num) => {
                        const isAvailable = num <= maxSelectable
                        const isSelected = quantity === num
                        return (
                          <button
                            key={num}
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => setQuantity(num)}
                            className={`py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-violet-600 text-white shadow-lg shadow-violet-950/60 ring-2 ring-violet-400'
                                : isAvailable
                                ? 'bg-[#1C1C2C] text-slate-200 hover:bg-[#25253A] border border-white/5'
                                : 'bg-white/5 text-slate-600 cursor-not-allowed border border-transparent'
                            }`}
                          >
                            {num}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Pricing Summary */}
                <div className="mt-6 border-t border-white/10 pt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>
                      ${event.pricePerTicket} × {quantity} ticket{quantity > 1 ? 's' : ''}
                    </span>
                    <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Facility & Service Fee</span>
                    <span className="font-mono text-white">${serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold text-white pt-2 border-t border-white/5">
                    <span>Total Amount</span>
                    <span className="font-display text-lg text-emerald-400 font-mono">
                      ${orderTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {errorMessage && (
                  <p className="mt-4 rounded-xl bg-rose-950/40 p-3 text-xs text-rose-300 border border-rose-500/30">
                    {errorMessage}
                  </p>
                )}

                {isAdmin && (
                  <div className="mt-4 rounded-xl bg-amber-950/40 p-3 text-xs text-amber-200 border border-amber-500/30 flex items-center justify-between">
                    <span>Admins cannot book tickets.</span>
                    <Link to="/admin" className="underline font-semibold text-amber-300 hover:text-white">
                      Admin Portal →
                    </Link>
                  </div>
                )}

                {/* Proceed Button */}
                <button
                  type="button"
                  onClick={handleCheckoutClick}
                  disabled={isSoldOut || remainingEntitlement <= 0 || maxSelectable === 0}
                  className={`mt-6 w-full rounded-2xl py-3.5 text-sm font-semibold shadow-xl transition-all cursor-pointer ${
                    isSoldOut || remainingEntitlement <= 0 || maxSelectable === 0
                      ? 'bg-white/10 text-slate-500 cursor-not-allowed'
                      : isAdmin
                      ? 'bg-amber-900/50 text-amber-200 border border-amber-500/40 hover:bg-amber-900/70'
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-violet-950/60 hover:from-violet-500 hover:to-indigo-500 hover:scale-101'
                  }`}
                >
                  {isAdmin
                    ? 'Admins cannot book tickets'
                    : isSoldOut
                    ? 'Event Sold Out'
                    : remainingEntitlement <= 0
                    ? 'Ticket Limit Reached'
                    : 'Proceed to Checkout →'}
                </button>

                <p className="mt-3 text-center text-[11px] text-slate-500">
                  Protected by human verification before instant ticket issuance.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
