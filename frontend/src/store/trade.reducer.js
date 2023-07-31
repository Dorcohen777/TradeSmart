export const SET_TRADES = 'SET_TRADES'
export const REMOVE_TRADE = 'REMOVE_TRADE'
export const ADD_TRADE = 'ADD_TRADE'
export const UPDATE_TRADE = 'UPDATE_TRADE'
export const ADD_TO_TRADET = 'ADD_TO_TRADET'
export const CLEAR_TRADET = 'CLEAR_TRADET'
export const UNDO_REMOVE_TRADE = 'UNDO_REMOVE_TRADE'
export const REMOVE_FROM_TRADET = 'REMOVE_FROM_TRADET'
export const SET_USER_ALERTS = 'SET_USER_ALERTS'
export const SET_NEW_ALERT = 'SET_NEW_ALERT'
export const REMOVE_ALERT = 'REMOVE_ALERT'

const initialState = {
   trades: [],
   lastRemovedTrade: null,
   userAlerts: [],
}

export function tradeReducer(state = initialState, action) {
   var newState = state
   var trades
   var alerts
   switch (action.type) {
      case SET_TRADES:
         newState = { ...state, trades: action.trades }
         break

      case REMOVE_TRADE:
         const lastRemovedTrade = state.trades.find(
            (trade) => trade._id === action.tradeId
         )
         trades = state.trades.filter((trade) => trade._id !== action.tradeId)
         newState = { ...state, trades, lastRemovedTrade }
         break

      case ADD_TRADE:
         newState = { ...state, trades: [...state.trades, action.trade] }
         break

      case UPDATE_TRADE:
         trades = state.trades.map((trade) =>
            trade._id === action.trade._id ? action.trade : trade
         )
         newState = { ...state, trades }
         break

      case UNDO_REMOVE_TRADE:
         if (state.lastRemovedTrade) {
            newState = {
               ...state,
               trades: [...state.trades, state.lastRemovedTrade],
               lastRemovedTrade: null,
            }
         }
         break
      case SET_USER_ALERTS:
         newState = {
            ...state,
            userAlerts: action.userAlerts,
         }
         break
      case SET_NEW_ALERT:
         newState = {
            ...state,
            userAlerts: [...state.userAlerts, action.savedAlert],
         }
         break
      case REMOVE_ALERT:
         const lastAlertRemove = state.userAlerts.find(
            (alert) => alert._id === action.alertId
         )
         alerts = state.userAlerts.filter(
            (alert) => alert._id !== action.alertId
         )
         newState = {
            ...state,
            userAlerts: alerts
         }
         break
      default:
   }
   return newState
}
