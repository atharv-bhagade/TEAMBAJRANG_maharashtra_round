import { Link } from 'react-router-dom'
import { EVENT_STATUS } from '../../mock/mockData'

export default function EventCard({ event }) {
  const isSoldOut = event.status === EVENT_STATUS.SOLD_OUT || event.availableSeats === 0
  const isFewLeft = event.availableSeats > 0 && event.availableSeats < 50
  const percentLeft = Math.round((event.availableSeats / event.totalSeats) * 100)

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl bg-[#141420] border border-white/10 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-950/30">
      {/* Banner Artwork Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141420] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
          <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white border border-white/10">
            {event.category || 'Concert'}
          </span>
          {event.featured && (
            <span className="rounded-full bg-violet-600/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
              FEATURED
            </span>
          )}
        </div>

        <div className="absolute top-3.5 right-3.5">
          {isSoldOut ? (
            <span className="rounded-full bg-rose-950/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-rose-300 border border-rose-500/40">
              SOLD OUT
            </span>
          ) : isFewLeft ? (
            <span className="rounded-full bg-amber-950/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/40 animate-pulse">
              ⚡ FEW LEFT
            </span>
          ) : (
            <span className="rounded-full bg-emerald-950/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/40">
              AVAILABLE
            </span>
          )}
        </div>
      </div>

      {/* Event Details */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
            {event.artist}
          </p>
          <h3 className="mt-1 font-display text-lg sm:text-xl font-bold text-white line-clamp-1 group-hover:text-violet-200 transition-colors">
            {event.title}
          </h3>

          <div className="mt-3 space-y-1 text-xs text-slate-300">
            <p className="flex items-center gap-2">
              <span>📅</span>
              <span className="font-medium text-slate-200">{event.date}</span>
            </p>
            <p className="flex items-center gap-2 text-slate-400">
              <span>📍</span>
              <span className="truncate">{event.venue}</span>
            </p>
          </div>

          <p className="mt-3 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Seat Availability & Pricing Bar */}
        <div className="mt-5 border-t border-white/10 pt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400">Available Seats:</span>
            <span className="font-mono font-bold text-slate-200">
              <strong className={isFewLeft ? 'text-amber-400' : 'text-emerald-400'}>
                {event.availableSeats}
              </strong>{' '}
              / {event.totalSeats}
            </span>
          </div>

          {/* Seat Meter */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 mb-4">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFewLeft
                  ? 'bg-amber-400'
                  : 'bg-gradient-to-r from-violet-500 to-indigo-500'
              }`}
              style={{ width: `${percentLeft}%` }}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">From</span>
              <span className="font-display text-xl font-extrabold text-white">
                ${event.pricePerTicket}
              </span>
              <span className="text-[11px] text-slate-400 ml-1">/ ticket</span>
            </div>

            <Link
              to={`/events/${event.id}`}
              className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-xs font-semibold shadow-md transition-all ${
                isSoldOut
                  ? 'bg-white/10 text-slate-400 cursor-not-allowed pointer-events-none'
                  : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-violet-950/50 hover:from-violet-500 hover:to-indigo-500 hover:scale-102'
              }`}
            >
              {isSoldOut ? 'Sold Out' : 'Book Tickets →'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
