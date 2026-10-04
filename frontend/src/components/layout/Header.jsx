import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useBookings } from '../../hooks/useBookings'

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 group" aria-label="Fair Drop Tickets home">
      <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 shadow-md shadow-violet-900/50 ring-1 ring-white/20 transition-transform duration-200 group-hover:scale-105">
        <svg
          className="w-5 h-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <path d="M13 5v2" />
          <path d="M13 17v2" />
          <path d="M13 11v2" />
        </svg>
      </span>
      <span className="flex flex-col">
        <span className="font-display text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-violet-200 bg-clip-text text-transparent">
          Fair Drop
        </span>
        <span className="text-[10px] tracking-widest uppercase font-semibold text-violet-400/80 -mt-1">
          Live Events & Tours
        </span>
      </span>
    </Link>
  )
}

const navCls = ({ isActive }) =>
  `rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-150 ${
    isActive
      ? 'bg-violet-950/70 text-violet-300 border border-violet-500/30 shadow-sm shadow-violet-950/40'
      : 'text-slate-300 hover:text-white hover:bg-white/5'
  }`

export default function Header() {
  const { user, users, switchUser, isAdmin, forceReauth } = useAuth()
  const { myBookings, openDrawer } = useBookings()
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const myTicketsCount = myBookings.reduce((sum, b) => sum + (b.quantity || 0), 0)

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0B12]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Logo />

        {/* Desktop Navigation */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-2">
          <NavLink to="/" end className={navCls}>
            Browse Events
          </NavLink>
          <a
            href="/#events"
            className="rounded-xl px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Live Shows
          </a>
          {isAdmin && (
            <NavLink to="/admin" className={navCls}>
              Admin Portal
            </NavLink>
          )}
        </nav>

        {/* Right Action Icons: My Tickets Drawer Button & User Switcher */}
        <div className="hidden md:flex items-center gap-3">
          {/* My Tickets Drawer Trigger */}
          <button
            type="button"
            onClick={openDrawer}
            className="relative flex items-center gap-2 rounded-xl bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 border border-white/10 transition-colors shadow-sm cursor-pointer"
            title="View booked tickets"
          >
            <span>🎟️</span>
            <span>My Tickets</span>
            {myTicketsCount > 0 && (
              <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-violet-600 px-1.5 text-[10px] font-bold text-white shadow-md animate-pulse">
                {myTicketsCount}
              </span>
            )}
          </button>

          {/* User Profile & Demo Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2.5 rounded-full bg-white/5 px-3 py-1.5 border border-white/10 hover:border-violet-500/40 transition-colors cursor-pointer"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-xs font-bold text-white">
                {user.avatar || user.name[0]}
              </span>
              <span className="text-xs font-medium text-slate-200">{user.name}</span>
              {isAdmin && (
                <span className="rounded-full bg-violet-950/90 px-2 py-0.5 text-[10px] font-bold text-violet-300 border border-violet-500/30">
                  ADMIN
                </span>
              )}
              <span className="text-slate-400 text-xs">▼</span>
            </button>

            {/* User Switcher Dropdown */}
            {userDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setUserDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#151522] border border-white/10 shadow-2xl p-2 z-20 fd-fade-up">
                  <div className="px-3 py-2 border-b border-white/5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Switch User Profile
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Test multi-user scoped bookings
                    </p>
                  </div>

                  <div className="mt-1 space-y-1">
                    {users.map((u) => {
                      const isSelected = u.id === user.id
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => {
                            switchUser(u.id)
                            setUserDropdownOpen(false)
                          }}
                          className={`w-full text-left flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-violet-600 text-white font-semibold'
                              : 'text-slate-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="grid h-5 w-5 place-items-center rounded-full bg-black/40 text-[10px]">
                              {u.avatar || u.name[0]}
                            </span>
                            <span className="truncate">{u.name}</span>
                          </div>
                          {u.role === 'admin' && (
                            <span className="text-[10px] font-bold text-amber-300 bg-black/30 px-1.5 py-0.5 rounded">
                              Admin
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* Auth Actions in Dropdown */}
                  <div className="pt-2 mt-2 border-t border-white/5 space-y-1">
                    <Link
                      to="/login"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                    >
                      <span>🔑</span>
                      <span>Sign In / Create Account</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false)
                        forceReauth(window.location.pathname)
                        window.location.assign('/login')
                      }}
                      className="w-full text-left flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs text-amber-300 hover:bg-amber-950/30 transition-colors cursor-pointer"
                    >
                      <span>🔒</span>
                      <span>Force Re-authentication</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={openDrawer}
            className="flex items-center gap-1 rounded-xl bg-white/5 px-2.5 py-1.5 text-xs text-white border border-white/10"
          >
            <span>🎟️</span>
            {myTicketsCount > 0 && <span>({myTicketsCount})</span>}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-slate-300 hover:text-white border border-white/10"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile drawer menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#12121D] px-4 py-4 space-y-2 fd-fade-up">
          <NavLink to="/" end onClick={() => setMobileOpen(false)} className={navCls}>
            <div className="py-1">Browse Events</div>
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" onClick={() => setMobileOpen(false)} className={navCls}>
              <div className="py-1">Admin Portal</div>
            </NavLink>
          )}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false)
              openDrawer()
            }}
            className="w-full text-left rounded-xl px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white flex items-center justify-between"
          >
            <span>My Bookings</span>
            <span className="rounded-full bg-violet-600 px-2 py-0.5 text-xs font-bold text-white">
              {myTicketsCount}
            </span>
          </button>

          <div className="pt-3 border-t border-white/10">
            <p className="text-xs text-slate-400 mb-2 font-semibold">Active User Profile:</p>
            <div className="grid grid-cols-3 gap-1">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => switchUser(u.id)}
                  className={`text-xs py-1.5 px-2 rounded-lg truncate text-center ${
                    u.id === user.id
                      ? 'bg-violet-600 text-white font-bold'
                      : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {u.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
