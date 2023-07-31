import { tradeService } from '../services/trade.service.local.js'
import { userService } from '../services/user.service.js'
import { store } from './store.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import {
   ADD_TRADE,
   REMOVE_ALERT,
   REMOVE_TRADE,
   SET_NEW_ALERT,
   SET_TRADES,
   SET_USER_ALERTS,
   UNDO_REMOVE_TRADE,
   UPDATE_TRADE,
} from './trade.reducer.js'
import { stockDataService } from '../services/stock.data.service.js'

// Action Creators:
export function getActionRemoveTrade(tradeId) {
   return {
      type: REMOVE_TRADE,
      tradeId,
   }
}
export function getActionAddTrade(trade) {
   return {
      type: ADD_TRADE,
      trade,
   }
}
export function getActionUpdateTrade(trade) {
   return {
      type: UPDATE_TRADE,
      trade,
   }
}

loadTrades()

export async function loadTrades(filterBy) {
   try {
      const trades = await tradeService.query(filterBy)
      console.log('Trades from DB:', trades)
      store.dispatch({
         type: SET_TRADES,
         trades,
      })
   } catch (err) {
      console.log('Cannot load trades', err)
      throw err
   }
}

export async function removeTrade(tradeId) {
   try {
      await tradeService.remove(tradeId)
      store.dispatch(getActionRemoveTrade(tradeId))
   } catch (err) {
      console.log('Cannot remove trade', err)
      throw err
   }
}

export async function addTrade(trade) {
   try {
      const savedTrade = await tradeService.save(trade)
      console.log('Added Trade', savedTrade)
      store.dispatch(getActionAddTrade(savedTrade))
      return savedTrade
   } catch (err) {
      console.log('Cannot add trade', err)
      throw err
   }
}

export function updateTrade(trade) {
   return tradeService
      .save(trade)
      .then((savedTrade) => {
         console.log('Updated Trade:', savedTrade)
         store.dispatch(getActionUpdateTrade(savedTrade))
         return savedTrade
      })
      .catch((err) => {
         console.log('Cannot save trade', err)
         throw err
      })
}

// Demo for Optimistic Mutation
// (IOW - Assuming the server call will work, so updating the UI first)
export function onRemoveTradeOptimistic(tradeId) {
   store.dispatch({
      type: REMOVE_TRADE,
      tradeId,
   })
   showSuccessMsg('Trade removed')

   tradeService
      .remove(tradeId)
      .then(() => {
         console.log('Server Reported - Deleted Succesfully')
      })
      .catch((err) => {
         showErrorMsg('Cannot remove trade')
         console.log('Cannot load trades', err)
         store.dispatch({
            type: UNDO_REMOVE_TRADE,
         })
      })
}

// stock alerts
export function setStockAlerts(userAlerts) {
   console.log('userAlerts', userAlerts)
   store.dispatch({
      type: SET_USER_ALERTS,
      userAlerts,
   })
}

export async function addNewAlert(newAlert) {
   try {
      const savedAlert = await stockDataService.saveStockAlert(newAlert)
      console.log('Added new alert', savedAlert)
      store.dispatch({ type: SET_NEW_ALERT, savedAlert })
   } catch (err) {
      console.log('Cannot add alert', err)
      throw err
   }
}

export async function removeAlert(alertId) {
   try {
        console.log('from store', alertId)
      await stockDataService.removeAlert(alertId)
      store.dispatch({ type: REMOVE_ALERT, alertId })
   } catch (err) {
      console.log('Cannot remove alert', err)
      throw err
   }
}


