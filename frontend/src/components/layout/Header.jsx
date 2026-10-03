import { Link, NavLink } from 'react-router-dom'
import Button from '../ui/Button'
import { useAuth } from '../../hooks/useAuth'

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Fair Drop home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 font-display text-lg font-extrabold text-white shadow-md shadow-brand-600/30">
        F
      </span>
      <span className="font-display text-xl font-bold tracking-tight text-slate-900">Fair Drop</span>
    </Link>
  )
}

const navCls = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:text-slate-900'
  }`

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="flex items-center gap-1">
          <NavLink to="/" end className={navCls}>Home</NavLink>
          <NavLink to="/drop" className={navCls}>Drop</NavLink>
          {isAuthenticated && <NavLink to="/queue" className={navCls}>Queue</NavLink>}
        </nav>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-slate-600 sm:inline">{user.name}</span>
              <Button variant="secondary" size="sm" onClick={logout}>Log out</Button>
            </>
          ) : (
            <Button to="/login" size="sm">Login</Button>
          )}
        </div>
      </div>
    </header>
  )
}
