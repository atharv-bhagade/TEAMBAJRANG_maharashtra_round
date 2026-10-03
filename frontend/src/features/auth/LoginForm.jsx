import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import ErrorMessage from '../../components/ui/ErrorMessage'
import { useAuth } from '../../hooks/useAuth'

const field =
  'mt-1.5 block w-full rounded-xl border-0 bg-white px-4 py-3 text-base text-slate-900 ring-1 ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500'

export default function LoginForm() {
  const { login, getPostLoginDestination, reAuthRequired } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email: email.trim(), password })
      const destination = getPostLoginDestination()
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.message || 'We could not sign you in. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {reAuthRequired && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
          For security, please sign in again.
        </p>
      )}
      <div>
        <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className={field} value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" className={field} value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <ErrorMessage>{error}</ErrorMessage>
      <Button type="submit" size="lg" className="w-full" loading={loading} loadingText="Signing in…">
        {reAuthRequired ? 'Sign in again' : 'Continue'}
      </Button>
    </form>
  )
}
