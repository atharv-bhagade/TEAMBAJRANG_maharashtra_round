import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import EventCard from '../components/events/EventCard'
import { useEvents } from '../hooks/useEvents'
import { EVENT_CATEGORIES } from '../mock/mockData'

export default function Home() {
  const { events } = useEvents()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter events dynamically
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        (e.category && e.category.toLowerCase() === selectedCategory.toLowerCase())

      const matchesSearch =
        searchQuery.trim() === '' ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.city && e.city.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesCategory && matchesSearch
    })
  }, [events, selectedCategory, searchQuery])

  const featuredEvent = useMemo(() => {
    return events.find((e) => e.featured) || events[0]
  }, [events])

  return (
    <PageContainer>
      {/* Hero Showcase Banner */}
      {featuredEvent && (
        <section className="relative overflow-hidden rounded-3xl bg-[#141420] border border-white/10 shadow-2xl mt-2 sm:mt-4 fd-fade-up">
          <div className="absolute inset-0 z-0">
            <img
              src={featuredEvent.bannerUrl}
              alt={featuredEvent.title}
              className="h-full w-full object-cover object-center opacity-40 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B12] via-[#0B0B12]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B12] via-transparent to-black/20" />
          </div>

          <div className="relative z-10 grid gap-6 p-6 sm:p-10 lg:grid-cols-12 lg:gap-10 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-950/80 px-3.5 py-1 text-xs font-semibold text-violet-300 border border-violet-500/30">
                <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
                <span>Featured Headline Tour</span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {featuredEvent.title}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                {featuredEvent.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pt-2">
                <span className="flex items-center gap-1.5 font-medium text-white">
                  <span>📅</span> {featuredEvent.date}
                </span>
                <span className="text-slate-500">·</span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span>📍</span> {featuredEvent.venue}
                </span>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-4">
                <Link
                  to={`/events/${featuredEvent.id}`}
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-950/60 hover:from-violet-500 hover:to-indigo-500 transition-all hover:scale-102"
                >
                  Book Tickets from ${featuredEvent.pricePerTicket} →
                </Link>
                <div className="text-xs text-slate-400">
                  <span className="font-bold text-emerald-400">{featuredEvent.availableSeats}</span> seats remaining
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Event Discovery Section */}
      <section id="events" className="mt-12 sm:mt-16 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              Live Experiences
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Upcoming Shows & Tours
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Select an event to view seat tiers, live availability, and reserve official tickets.
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full md:w-72">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search artist, tour, venue…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#141420] pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {EVENT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-950/50'
                    : 'bg-[#151522] text-slate-300 hover:bg-[#1E1E2F] hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Dynamic Multi-Event Grid */}
        <div className="mt-8">
          {filteredEvents.length === 0 ? (
            <div className="rounded-3xl bg-[#141420] border border-white/10 p-12 text-center">
              <span className="text-3xl">🎸</span>
              <h3 className="mt-3 font-display text-lg font-bold text-white">No matching events found</h3>
              <p className="mt-1 text-xs text-slate-400">
                Try searching with another keyword or select a different category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All')
                  setSearchQuery('')
                }}
                className="mt-4 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Platform Features / Commitment Section (Clean ticketing copy) */}
      <section className="mt-20 rounded-3xl bg-gradient-to-br from-[#151524] to-[#0E0E18] border border-white/10 p-8 sm:p-10 shadow-2xl">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
            Booking Assurance
          </span>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            The Premier Live Ticketing Standard
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Guaranteed primary tickets, secure digital admissions, and verified checkout.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl bg-[#13131F]/80 p-5 border border-white/5">
            <span className="text-xl">🎟️</span>
            <h3 className="mt-3 font-display text-base font-bold text-white">Direct Quotas</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              All inventory is sourced directly from event promoters with verified seat holds and fixed price caps.
            </p>
          </div>

          <div className="rounded-2xl bg-[#13131F]/80 p-5 border border-white/5">
            <span className="text-xl">🛡️</span>
            <h3 className="mt-3 font-display text-base font-bold text-white">Human Security Check</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Interactive human verification ensures authentic fans secure tickets during high-demand on-sales.
            </p>
          </div>

          <div className="rounded-2xl bg-[#13131F]/80 p-5 border border-white/5">
            <span className="text-xl">📱</span>
            <h3 className="mt-3 font-display text-base font-bold text-white">Instant Digital Pass</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Confirmed tickets appear instantly in your account with secure tokens ready for gate scanning.
            </p>
          </div>
        </div>
      </section>
    </PageContainer>
  )
}
