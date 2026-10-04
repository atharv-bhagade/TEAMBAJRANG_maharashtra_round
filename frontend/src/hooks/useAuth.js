import { useState, useEffect, useCallback } from 'react'
import {
  getState,
  subscribe,
  switchUser as storeSwitchUser,
  loginUser as storeLoginUser,
  signupUser as storeSignupUser,
  forceReauth as storeForceReauth,
  clearReauth as storeClearReauth,
  logoutUser as storeLogoutUser,
} from '../mock/mockState'
import { mockUsers } from '../mock/mockData'

export function useAuth() {
  const [state, setRawState] = useState(() => getState())

  useEffect(() => {
    return subscribe(() => {
      setRawState(getState())
    })
  }, [])

  const user = state.currentUser || mockUsers[0]
  const users = state.users || mockUsers
  const session = state.session || { loggedIn: true, reAuthRequired: false, redirectAfterLogin: null }
  const isAdmin = user?.role === 'admin'
  const isAuthenticated = Boolean(session.loggedIn && user && user.id)
  const reAuthRequired = Boolean(session.reAuthRequired)
  const redirectAfterLogin = session.redirectAfterLogin

  const switchActiveUser = useCallback((userId) => {
    storeSwitchUser(userId)
  }, [])

  const login = useCallback(async ({ email, password }) => {
    return storeLoginUser({ email, password })
  }, [])

  const signup = useCallback(async ({ name, email, password, confirmPassword }) => {
    return storeSignupUser({ name, email, password, confirmPassword })
  }, [])

  const forceReauth = useCallback((returnPath) => {
    storeForceReauth(returnPath)
  }, [])

  const clearReauth = useCallback(() => {
    storeClearReauth()
  }, [])

  const logout = useCallback(() => {
    storeLogoutUser()
  }, [])

  const getPostLoginDestination = useCallback(() => {
    if (redirectAfterLogin) return redirectAfterLogin
    if (user?.role === 'admin') return '/admin'
    return '/'
  }, [redirectAfterLogin, user])

  return {
    user,
    users,
    session,
    isAdmin,
    isAuthenticated,
    reAuthRequired,
    redirectAfterLogin,
    switchUser: switchActiveUser,
    login,
    signup,
    forceReauth,
    clearReauth,
    logout,
    getPostLoginDestination,
  }
}
