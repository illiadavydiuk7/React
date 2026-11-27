import { createContext, use, useSyncExternalStore } from 'react'

/**
 * Контекст Redux store черги й хуки, які читають його стан та dispatch.
 *
 * QueueProvider передає через нього окремий Redux store для кожного свого
 * екземпляра. Поза провайдером хуки кидають зрозумілу помилку.
 */

export const QueueContext = createContext(null)

/** { queue, canUndo, canRedo } з найближчого QueueProvider. */
export function useQueue() {
  const store = use(QueueContext)
  const state = useSyncExternalStore(
    store?.subscribe ?? subscribeToNothing,
    store?.getState ?? getEmptyState,
    store?.getState ?? getEmptyState,
  )

  if (store === null) {
    throw new Error('useQueue must be used within a QueueProvider')
  }
  const { present, past, future } = state
  return {
    queue: present,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  }
}

/** dispatch ред'юсера черги з найближчого QueueProvider. */
export function useQueueDispatch() {
  const store = use(QueueContext)
  if (store === null) {
    throw new Error('useQueueDispatch must be used within a QueueProvider')
  }
  return store.dispatch
}

const emptyState = { past: [], present: null, future: [] }

function getEmptyState() {
  return emptyState
}

function subscribeToNothing() {
  return () => {}
}
