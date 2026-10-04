import { useState, useEffect, useCallback } from 'react'
import {
  getState,
  subscribe,
  getUserBookings,
  getAllBookings,
  getUserBookedQuantity,
  bookTickets as storeBookTickets,
  toggleTicketsDrawer,
} from '../mock/mockState'

export function useBookings() {
  const [state, setRawState] = useState(() => getState())

  useEffect(() => {
    return subscribe(() => {
      setRawState(getState())
    })
  }, [])

  const currentUserId = state.currentUser?.id

  // Strictly user-scoped bookings for the current active user
  const myBookings = getUserBookings(currentUserId)

  // Global bookings for Admin Portal
  const allBookings = getAllBookings()

  const drawerOpen = state.ui.ticketsDrawerOpen

  const openDrawer = useCallback(() => {
    toggleTicketsDrawer(true)
  }, [])

  const closeDrawer = useCallback(() => {
    toggleTicketsDrawer(false)
  }, [])

  const getEventBookedCount = useCallback(
    (eventId) => {
      return getUserBookedQuantity(currentUserId, eventId)
    },
    [currentUserId]
  )

  const reserveTickets = useCallback(
    ({ eventId, quantity }) => {
      return storeBookTickets({
        eventId,
        quantity,
        userId: state.currentUser.id,
        userEmail: state.currentUser.email,
        userName: state.currentUser.name,
      })
    },
    [state.currentUser]
  )

  return {
    myBookings,
    allBookings,
    drawerOpen,
    openDrawer,
    closeDrawer,
    getEventBookedCount,
    reserveTickets,
  }
}
