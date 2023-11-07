import { storageService } from './async-storage.service'
import { userService } from './user.service'
import { utilService } from '../services/util.service'

export const stockDataService = {
   saveStockAlert,
   getStockData,
   getAlertsByUser,
   fetchUserAlerts,
   removeAlert,
}

const ALERT_KEY = 'alertDB'

function getStockData() {}

async function saveStockAlert(symbol) {
   var savedSymbol
   if (symbol._id) {
      savedSymbol = await storageService.put(ALERT_KEY, symbol)
   } else {
      symbol.owner = userService.getLoggedinUser()
      savedSymbol = await storageService.post(ALERT_KEY, symbol)
   }
   return savedSymbol
}

function getAlertsByUser(userId) {
   const alerts = utilService.loadFromStorage(ALERT_KEY)
   const filterAlert = alerts.filter((alert) => alert.owner._id === userId)
   return filterAlert
}

function fetchUserAlerts() {
   const currUser = userService.getLoggedinUser()
   const userId = currUser._id
   const userAlert = getAlertsByUser(userId)
   return userAlert
}

async function removeAlert(alertId) {
   await storageService.remove(ALERT_KEY, alertId)
   
}
