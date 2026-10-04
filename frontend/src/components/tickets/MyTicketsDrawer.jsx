import { Link } from 'react-router-dom'
import { useBookings } from '../../hooks/useBookings'
import { useAuth } from '../../hooks/useAuth'

export default function MyTicketsDrawer() {
  const { myBookings, drawerOpen, closeDrawer } = useBookings()
  const { user } = useAuth()

  if (!drawerOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="My Tickets"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#11111B] border-l border-white/10 shadow-2xl p-6 sm:p-7 flex flex-col justify-between overflow-y-auto fd-fade-up">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-600/30 text-lg border border-violet-500/30 text-violet-300">
                  🎟️
                </span>
                <div>
                  <h2 className="font-display text-lg font-bold text-white">My Tickets</h2>
                  <p className="text-xs text-slate-400">
                    Account: <strong className="text-violet-300">{user?.name}</strong> ({user?.email})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="rounded-full p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close tickets drawer"
              >
                ✕
              </button>
            </div>

            {/* List of Tickets */}
            <div className="mt-6 space-y-4">
              {myBookings.length === 0 ? (
                <div className="text-center py-12 rounded-2xl bg-[#161622] border border-white/5 p-6">
                  <span className="text-3xl">🎫</span>
                  <p className="mt-3 font-semibold text-white text-base">No booked tickets yet</p>
                  <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto">
                    You haven't reserved any tickets under this account. Explore live events and book your seats!
                  </p>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="mt-5 inline-block rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-950 hover:bg-violet-500 transition-colors"
                  >
                    Browse Live Shows
                  </button>
                </div>
              ) : (
                myBookings.map((b) => (
                  <div
                    key={b.id}
                    className="fd-ticket rounded-2xl p-5 shadow-xl text-left border border-white/10 relative overflow-hidden"
                  >
                    {/* Top banner tag */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="rounded-full bg-emerald-950/80 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        CONFIRMED PASS
                      </span>
                      <span className="font-mono text-xs font-bold text-violet-300 bg-white/5 px-2 py-0.5 rounded">
                        {b.bookingId}
                      </span>
                    </div>

                    <h3 className="font-display text-base font-bold text-white line-clamp-1">
                      {b.eventTitle}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">📍 {b.eventVenue}</p>
                    <p className="text-xs text-violet-300/90 mt-0.5">📅 {b.eventDate}</p>

                    {/* Ticket tear separator */}
                    <div className="my-4 border-b border-dashed border-white/15" />

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="text-slate-400 text-[11px]">ADMIT</p>
                        <p className="font-bold text-white text-base">
                          {b.quantity} Person{b.quantity > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 text-[11px]">TOTAL PAID</p>
                        <p className="font-bold text-emerald-400 text-base">
                          ${b.totalPrice} {b.currency}
                        </p>
                      </div>
                    </div>

                    {/* Barcode graphic */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <div className="flex gap-1 h-5 items-center opacity-70">
                        {[4, 2, 6, 3, 5, 2, 7, 3, 4, 2, 8, 3, 5, 2, 4].map((w, i) => (
                          <div
                            key={i}
                            style={{ width: `${w}px` }}
                            className="h-full bg-slate-300 rounded-[1px]"
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 tracking-wider">
                        SECURE TOKEN
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 pt-4 mt-6">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Active Bookings</span>
              <strong className="text-white font-mono">{myBookings.length}</strong>
            </div>
            <p className="mt-2 text-center text-[11px] text-slate-500">
              Present digital passes at venue entry gates.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
