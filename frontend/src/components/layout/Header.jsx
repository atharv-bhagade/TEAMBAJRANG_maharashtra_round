import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Button from '../ui/Button'
import { useAuth } from '../../hooks/useAuth'

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 group" aria-label="Fair Drop home">
      <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 shadow-md shadow-violet-900/50 ring-1 ring-white/20 transition-transform duration-200 group-hover:scale-105">
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
          Equal Access
        </span>
      </span>
    </Link>
  )
}

const navCls = ({ isActive }) =>
  `rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-150 ${
    isActive
      ? 'bg-violet-950/70 text-violet-300 border border-violet-500/30 shadow-sm shadow-violet-950/40'
      : 'text-slate-400 hover:text-white hover:bg-white/5'
  }`

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const closeMobile = () => setMobileOpen(false)

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0B12]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Logo />

        {/* Desktop Navigation */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1.5">
          <NavLink to="/" end className={navCls}>
            Discover
          </NavLink>
          <a
            href="/#how"
            className="rounded-xl px-3.5 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            How It Works
          </a>
          <NavLink to="/drop" className={navCls}>
            Fair Pool
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/queue" className={navCls}>
                My Entries
              </NavLink>
              <NavLink to="/allocation" className={navCls}>
                My Tickets
              </NavLink>
            </>
          )}
        </nav>

        {/* User actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 rounded-full bg-white/5 px-3 py-1.5 border border-white/10">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-xs font-bold text-white uppercase">
                  {user?.name ? user.name[0] : 'U'}
                </span>
                <span className="text-sm font-medium text-slate-200">{user.name}</span>
                {user.ticketsOwned > 0 && (
                  <span className="rounded-full bg-emerald-950/80 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
                    {user.ticketsOwned} {user.ticketsOwned === 1 ? 'ticket' : 'tickets'}
                  </span>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={logout} aria-label="Log out">
                Log out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button to="/login" variant="primary" size="sm">
                Sign In
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {mobileOpen ? (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#12121D] px-4 py-4 space-y-2 fd-fade-up">
          <NavLink to="/" end onClick={closeMobile} className={navCls}>
            <div className="py-1">Discover</div>
          </NavLink>
          <a
            href="/#how"
            onClick={closeMobile}
            className="block rounded-xl px-3.5 py-2 text-sm font-medium text-slate-400 hover:text-white"
          >
            How It Works
          </a>
          <NavLink to="/drop" onClick={closeMobile} className={navCls}>
            <div className="py-1">Fair Pool</div>
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/queue" onClick={closeMobile} className={navCls}>
                <div className="py-1">My Entries</div>
              </NavLink>
              <NavLink to="/allocation" onClick={closeMobile} className={navCls}>
                <div className="py-1">My Tickets</div>
              </NavLink>
            </>
          )}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            {isAuthenticated ? (
              <>
                <span className="text-sm font-medium text-slate-300">{user.name}</span>
                <Button variant="secondary" size="sm" onClick={() => { logout(); closeMobile(); }}>
                  Log out
                </Button>
              </>
            ) : (
              <Button to="/login" size="sm" className="w-full" onClick={closeMobile}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
