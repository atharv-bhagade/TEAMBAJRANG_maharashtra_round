import { useCallback } from 'react'
import { useMockState } from './useMockState'
import { setState, getPostLoginDestination } from '../mock/mockState'

// Auth abstraction. Phase 1: mock login only.
// Phase 2: replace the internals with Firebase Authentication; the returned
// shape ({ user, isAuthenticated, reAuthRequired, login, logout, getPostLoginDestination }) stays stable.
export function useAuth() {
  const { session, user } = useMockState()

  const login = useCallback(async ({ email, password }) => {
    await new Promise((r) => setTimeout(r, 700))
    if (!email || !password) {
      throw new Error('Please enter your email and password.')
    }
    setState((s) => ({
      session: { loggedIn: true, reAuthRequired: false },
      user: { ...s.user, email, name: email.split('@')[0] || s.user.name },
    }))
  }, [])

  const logout = useCallback(() => {
    setState({ session: { loggedIn: false, reAuthRequired: false } })
  }, [])

  const isAuthenticated = Boolean(session.loggedIn && !session.reAuthRequired)
  const reAuthRequired = Boolean(session.reAuthRequired)

  return {
    user,
    isAuthenticated,
    reAuthRequired,
    login,
    logout,
    getPostLoginDestination,
  }
}
