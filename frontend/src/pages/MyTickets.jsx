import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import { useBookings } from '../hooks/useBookings'
import { useAuth } from '../hooks/useAuth'

export default function MyTickets() {
  const { myBookings } = useBookings()
  const { user, users, switchUser } = useAuth()

  const totalTickets = myBookings.reduce((sum, b) => sum + (b.quantity || 0), 0)
  const totalSpent = myBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)

  return (
    <PageContainer>
      <div className="py-6 sm:py-8 max-w-5xl mx-auto fd-fade-up">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-violet-400 font-semibold uppercase tracking-wider mb-1">
              <span>🎟️ Verified Passes</span>
              <span>·</span>
              <span>Scoped User Session</span>
            </div>
            <h1 className="font-display text-3xl font-extrabold text-white">
              My Bookings & Tickets
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Currently signed in as <strong className="text-violet-300">{user.name}</strong> ({user.email}).
            </p>
          </div>

          {/* Quick User Switcher for demo */}
          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/10">
            <span className="text-xs text-slate-400 font-medium px-2">Active User:</span>
            <div className="flex gap-1.5">
              {users.map((u) => {
                const active = u.id === user.id
                return (
                  <button
                    key={u.id}
                    onClick={() => switchUser(u.id)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                      active
                        ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-900/50'
                        : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {u.name.split(' ')[0]}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl bg-[#12121E] border border-white/10 p-5 shadow-lg">
            <span className="text-xs uppercase tracking-wider text-slate-400">Total Bookings</span>
            <p className="font-display text-2xl font-bold text-white mt-1">{myBookings.length}</p>
          </div>
          <div className="rounded-2xl bg-[#12121E] border border-white/10 p-5 shadow-lg">
            <span className="text-xs uppercase tracking-wider text-slate-400">Total Tickets Claimed</span>
            <p className="font-display text-2xl font-bold text-violet-400 mt-1">{totalTickets}</p>
          </div>
          <div className="rounded-2xl bg-[#12121E] border border-white/10 p-5 shadow-lg">
            <span className="text-xs uppercase tracking-wider text-slate-400">Total Investment</span>
            <p className="font-display text-2xl font-bold text-emerald-400 mt-1">${totalSpent} USD</p>
          </div>
        </div>

        {/* Tickets Grid */}
        {myBookings.length === 0 ? (
          <div className="text-center py-16 rounded-3xl bg-[#11111C] border border-white/5 p-8 max-w-lg mx-auto">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/5 mx-auto text-3xl">
              🎫
            </div>
            <h2 className="mt-4 font-display text-xl font-bold text-white">No Tickets Found For This Profile</h2>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              You haven't reserved any tickets under <strong className="text-violet-300">{user.name}</strong> yet.
              Switch user profiles to view other user bookings or browse live shows to make a new booking.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-xl bg-violet-600 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-violet-900/50 hover:bg-violet-500 transition-all cursor-pointer"
            >
              Browse Live Concerts & Tours
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myBookings.map((b) => (
              <div
                key={b.id}
                className="fd-ticket rounded-2xl p-6 shadow-xl border border-white/10 relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="rounded-full bg-emerald-950/80 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      CONFIRMED PASS
                    </span>
                    <span className="font-mono text-xs font-bold text-violet-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                      #{b.bookingId}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-white line-clamp-1">
                    {b.eventTitle}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">📍 {b.eventVenue}</p>
                  <p className="text-xs text-violet-300/90 mt-0.5">📅 {b.eventDate}</p>

                  <div className="my-5 border-b border-dashed border-white/15" />

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-slate-400 text-[11px]">ADMIT</p>
                      <p className="font-bold text-white text-base">
                        {b.quantity} Seat{b.quantity > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[11px]">PRICE / SEAT</p>
                      <p className="font-bold text-slate-200 text-base">
                        ${b.pricePerTicket}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-[11px]">TOTAL PAID</p>
                      <p className="font-bold text-emerald-400 text-base">
                        ${b.totalPrice} {b.currency}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex gap-1 h-6 items-center opacity-70">
                    {[4, 2, 6, 3, 5, 2, 7, 3, 4, 2, 8, 3, 5, 2, 4, 3, 5, 2].map((w, i) => (
                      <div
                        key={i}
                        style={{ width: `${w}px` }}
                        className="h-full bg-slate-300 rounded-[1px]"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 tracking-wider">
                    {new Date(b.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · SECURE
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
