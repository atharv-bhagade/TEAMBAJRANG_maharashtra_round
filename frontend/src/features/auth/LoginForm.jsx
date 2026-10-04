import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from '../../components/ui/Button'
import ErrorMessage from '../../components/ui/ErrorMessage'
import { useAuth } from '../../hooks/useAuth'

const inputCls =
  'mt-1.5 block w-full rounded-xl border border-white/10 bg-[#12121A] px-4 py-3 text-base text-[#F5F5FA] placeholder:text-slate-500 transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 disabled:opacity-50'

export default function LoginForm() {
  const { login, signup, getPostLoginDestination, reAuthRequired } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const handleDemoFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setError('')
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setNotice('')
    setLoading(true)

    const cleanEmail = email.trim()

    if (!cleanEmail) {
      setError('Please enter a valid email address.')
      setLoading(false)
      return
    }

    if (!password) {
      setError('Please enter your password.')
      setLoading(false)
      return
    }

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          setError('Please enter your name.')
          setLoading(false)
          return
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match.')
          setLoading(false)
          return
        }

        // New accounts MUST always receive USER role
        await signup({
          name: name.trim(),
          email: cleanEmail,
          password,
          confirmPassword,
        })
        const dest = location.state?.from || getPostLoginDestination()
        navigate(dest, { replace: true })
      } else {
        // Login mode
        await login({ email: cleanEmail, password })
        const dest = location.state?.from || getPostLoginDestination()
        navigate(dest, { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      {/* Brand Header */}
      <div className="mb-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Fair Drop
        </h2>
        <p className="text-xs uppercase tracking-widest font-semibold text-violet-400 mt-0.5">
          Live Events & Tours
        </p>
      </div>

      {/* Re-Authentication Notice Banner */}
      {reAuthRequired && (
        <div className="mb-5 rounded-2xl bg-amber-950/50 p-4 border border-amber-500/40 text-amber-200 text-sm flex items-start gap-3 fd-fade-up">
          <span className="text-lg">🔒</span>
          <div>
            <p className="font-semibold text-amber-100">
              Your session needs to be verified again. Please log in to continue.
            </p>
            <p className="text-xs text-amber-300/80 mt-1">
              For security, re-enter your credentials to restore your session.
            </p>
          </div>
        </div>
      )}

      {notice && (
        <div className="mb-5 rounded-xl bg-emerald-950/40 p-4 border border-emerald-500/30 text-emerald-200 text-sm flex items-center gap-2">
          <span>✓</span>
          <span>{notice}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {mode === 'signup' && (
          <div>
            <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="fan@example.com"
            className={inputCls}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              placeholder="••••••••"
              className={inputCls}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 text-xs"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {mode === 'signup' && (
          <div>
            <label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              className={inputCls}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}

        <ErrorMessage>{error}</ErrorMessage>

        <Button
          type="submit"
          size="lg"
          className="w-full mt-2"
          loading={loading}
          loadingText={mode === 'signup' ? 'Creating Account…' : 'Logging in…'}
        >
          {mode === 'signup' ? 'Create Account' : 'Login'}
        </Button>

        {/* Toggle between Login and Signup */}
        <div className="text-center pt-3 border-t border-white/5">
          {mode === 'login' ? (
            <button
              type="button"
              onClick={() => {
                setMode('signup')
                setError('')
              }}
              className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors cursor-pointer"
            >
              Don't have an account? Create an account
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMode('login')
                setError('')
              }}
              className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors cursor-pointer"
            >
              Already have an account? Login
            </button>
          )}
        </div>
      </form>

      {/* Demo Accounts Quick-Fill Helper Bar */}
      <div className="mt-8 pt-5 border-t border-white/10">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Demo Accounts (One-Click Fill)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleDemoFill('sarah.connor@example.com', 'demo123')}
            className="text-left rounded-xl bg-white/5 p-2.5 border border-white/10 hover:border-violet-500/40 hover:bg-white/10 transition-all text-xs"
          >
            <p className="font-semibold text-white truncate">Sarah Connor</p>
            <p className="text-[10px] text-slate-400 truncate">sarah.connor@example.com</p>
            <span className="inline-block mt-1 text-[9px] font-bold uppercase bg-violet-950 text-violet-300 px-1.5 py-0.5 rounded border border-violet-500/20">
              Role: USER
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoFill('alex.morgan@example.com', 'demo123')}
            className="text-left rounded-xl bg-white/5 p-2.5 border border-white/10 hover:border-violet-500/40 hover:bg-white/10 transition-all text-xs"
          >
            <p className="font-semibold text-white truncate">Alex Morgan</p>
            <p className="text-[10px] text-slate-400 truncate">alex.morgan@example.com</p>
            <span className="inline-block mt-1 text-[9px] font-bold uppercase bg-violet-950 text-violet-300 px-1.5 py-0.5 rounded border border-violet-500/20">
              Role: USER
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoFill('admin@fairdrop.demo', 'demo123')}
            className="text-left rounded-xl bg-white/5 p-2.5 border border-white/10 hover:border-violet-500/40 hover:bg-white/10 transition-all text-xs"
          >
            <p className="font-semibold text-amber-200 truncate">Admin Portal</p>
            <p className="text-[10px] text-slate-400 truncate">admin@fairdrop.demo</p>
            <span className="inline-block mt-1 text-[9px] font-bold uppercase bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/20">
              Role: ADMIN
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
