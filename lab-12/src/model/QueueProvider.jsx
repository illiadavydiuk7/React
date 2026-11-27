import { useState } from 'react'
import { configureStore } from '@reduxjs/toolkit'
import { loadOrders } from '../data/orders.js'
import { createInitialState, queueReducer } from './queueReducer.js'
import { QueueContext } from './queueContext.js'
import { createHistory, withUndo } from './withUndo.js'

/**
 * §4.9. Провайдер створює окреме Redux store для кожного свого екземпляра
 * та передає його дочірнім компонентам через QueueContext.
 *
 */
const undoableQueue = withUndo(queueReducer)

export default function QueueProvider({ children }) {
  const [store] = useState(() => {
    const initialState = createHistory(createInitialState(loadOrders()))
    const reducer = (state = initialState, action) =>
      action.type.startsWith('@@') ? state : undoableQueue(state, action)

    return configureStore({ reducer, preloadedState: initialState })
  })

  return <QueueContext value={store}>{children}</QueueContext>
}
