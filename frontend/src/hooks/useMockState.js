import { useSyncExternalStore } from 'react'
import { getState, subscribe } from '../mock/mockState'

// Subscribe a component to the centralized mock store.
export function useMockState() {
  return useSyncExternalStore(subscribe, getState)
}
