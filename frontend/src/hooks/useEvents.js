import { useState, useEffect, useCallback } from 'react'
import {
  getState,
  subscribe,
  getEventById,
  addEvent as storeAddEvent,
  updateEvent as storeUpdateEvent,
  deleteEvent as storeDeleteEvent,
} from '../mock/mockState'

export function useEvents() {
  const [events, setEvents] = useState(() => getState().events)

  useEffect(() => {
    return subscribe(() => {
      setEvents(getState().events)
    })
  }, [])

  const getEvent = useCallback((id) => {
    return getEventById(id)
  }, [])

  const createEvent = useCallback((eventData) => {
    return storeAddEvent(eventData)
  }, [])

  const modifyEvent = useCallback((id, patch) => {
    storeUpdateEvent(id, patch)
  }, [])

  const removeEvent = useCallback((id) => {
    storeDeleteEvent(id)
  }, [])

  return {
    events,
    getEvent,
    createEvent,
    modifyEvent,
    removeEvent,
  }
}
