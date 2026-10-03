import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import ErrorMessage from '../../components/ui/ErrorMessage'
import { useAuth } from '../../hooks/useAuth'

const inputCls =
  'mt-1.5 block w-full rounded-xl border border-white/10 bg-[#12121A] px-4 py-3 text-base text-[#F5F5FA] placeholder:text-slate-500 transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 disabled:opacity-50'

export default function LoginForm() {
  const { login, getPostLoginDestination, reAuthRequired } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('signin') // 'signin' | 'signup' | 'reset'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

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

    if (mode === 'reset') {
      await new Promise((r) => setTimeout(r, 600))
      setLoading(false)
      setNotice('Password reset instructions sent. Please check your inbox.')
      return
    }

    if (!password) {
      setError('Please enter your password.')
      setLoading(false)
      return
    }

    try {
      await login({ email: cleanEmail, password, name })
      const destination = getPostLoginDestination()
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.message || 'We could not sign you in. Please verify your credentials.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      {/* Tab Switcher (hidden when re-auth is strictly required) */}
      {!reAuthRequired && (
        <div className="flex items-center gap-1 rounded-xl bg-[#12121A] p-1 border border-white/5 mb-6 text-sm">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(''); setNotice(''); }}
            className={`flex-1 rounded-lg py-2 font-medium transition-all ${
              mode === 'signin'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); setNotice(''); }}
            className={`flex-1 rounded-lg py-2 font-medium transition-all ${
              mode === 'signup'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>
      )}

      {reAuthRequired && (
        <div className="mb-5 rounded-xl bg-amber-950/40 p-4 border border-amber-500/30 text-amber-200 text-sm flex items-start gap-2.5">
          <span className="text-base">🔒</span>
          <div>
            <p className="font-semibold text-amber-100">For security, please sign in again.</p>
            <p className="text-xs text-amber-300/80 mt-0.5">Your place in the pool is saved.</p>
          </div>
        </div>
      )}

      {notice && (
        <div className="mb-5 rounded-xl bg-emerald-950/40 p-4 border border-emerald-500/30 text-emerald-200 text-sm flex items-center gap-2">
          <span>✓</span>
          <span>{notice}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {mode === 'signup' && (
          <div>
            <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Alex Smith"
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Email Address
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

        {mode !== 'reset' && (
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              {!reAuthRequired && (
                <button
                  type="button"
                  onClick={() => { setMode('reset'); setError(''); setNotice(''); }}
                  className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Forgot password?
                </button>
              )}
            </div>
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
        )}

        <ErrorMessage>{error}</ErrorMessage>

        <Button
          type="submit"
          size="lg"
          className="w-full mt-2"
          loading={loading}
          loadingText={
            mode === 'reset' ? 'Sending reset link…' : reAuthRequired ? 'Signing in again…' : 'Signing in…'
          }
        >
          {mode === 'reset'
            ? 'Send Reset Link'
            : mode === 'signup'
            ? 'Create Account'
            : reAuthRequired
            ? 'Sign In Again'
            : 'Sign In'}
        </Button>

        {mode === 'reset' && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(''); }}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Sign In
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
