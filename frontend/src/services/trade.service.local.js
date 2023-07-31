import { storageService } from './async-storage.service.js'
import { userService } from './user.service.js'
import { utilService } from './util.service.js'
import axios from 'axios'

const STORAGE_KEY = 'tradesDB'
const STRATEGY_KEY = 'strategyDB'
export const tradeService = {
   query,
   getById,
   save,
   remove,
   getTrades,
   calculatePL,
   getEmptyTrade,
   calculateRiskAmount,
   calculatePercentageAndPrice,
   saveNewStrategy,
   filterStrategyByUser,
}
window.cs = tradeService

async function query(filterBy = { symbol: '' }) {
   var trades = await storageService.query(STORAGE_KEY)
   if (filterBy.symbol) {
      const regex = new RegExp(filterBy.symbol, 'i')
      trades = trades.filter((trade) => regex.test(trade.symbol))
   }
   // if (filterBy.price) {
   //     trades = trades.filter(trade => trade.price <= filterBy.price)
   // }
   return trades
}

function getEmptyTrade() {
   const filterBy = { symbol: '' }
   return filterBy
}

function getById(tradeId) {
   return storageService.get(STORAGE_KEY, tradeId)
}

async function remove(tradeId) {
   // throw new Error('Nope')
   await storageService.remove(STORAGE_KEY, tradeId)
}

async function save(trade) {
   var savedTrade
   if (trade._id) {
      savedTrade = await storageService.put(STORAGE_KEY, trade)
   } else {
      // Later, owner is set by the backend
      trade.owner = userService.getLoggedinUser()
      savedTrade = await storageService.post(STORAGE_KEY, trade)
   }
   return savedTrade
}

// getting all the trades by the specific user
async function getTrades(userId, storeTrades) {
   if (!userId) return 'userId require'
   const filterTradesByUser = storeTrades.filter(
      (trade) => trade.owner._id === userId
   )

   console.log('filterTradesByUser', filterTradesByUser)
   return filterTradesByUser
}
async function filterStrategyByUser(userId){
   const loadStrategy = utilService.loadFromStorage(STRATEGY_KEY)
   const filterStrategy = loadStrategy.filter((str) => str.owner._id === userId)
   return filterStrategy
}

async function saveNewStrategy(newStrategy){
newStrategy.owner = userService.getLoggedinUser()
const saveStrategy = await storageService.post(STRATEGY_KEY, newStrategy)
return saveStrategy
}

function calculatePL(symbol, sharesAmount, entryPrice, exitPrice) {
   if (!exitPrice) return null
   const totalCost = sharesAmount * entryPrice
   const totalRevenue = sharesAmount * exitPrice
   const profitLoss = totalRevenue - totalCost
   const fixedProfitLoss = Math.round(profitLoss * 100) / 100; 
   return fixedProfitLoss
}

function calculateRiskAmount(accountValue, riskPercentage) {
   console.log('accountValue', accountValue)
   console.log('riskPercentage', riskPercentage)
   var riskAmount = (accountValue * riskPercentage) / 100
   return riskAmount
}

function calculatePercentageAndPrice(riskAmount, sharesAmount, sharesPrice) {
   console.log('riskAmount', riskAmount)
   console.log('sharesAmount', sharesAmount)
   console.log('sharesPrice', sharesPrice)
   
   // Calculate the total cost of the investment
   const totalCost = sharesAmount * sharesPrice

   // Calculate the breakeven point
   const breakevenPoint = totalCost - riskAmount

   // Calculate the new stock price required for the breakeven point
   const newPricePerShare = breakevenPoint / sharesAmount

   // Calculate the percentage decrease
   const percentageDecrease =
      ((sharesPrice - newPricePerShare) / sharesPrice) * 100

   // Return the percentage decrease and the new stock price
   return {
      percentageDecrease: percentageDecrease.toFixed(2),
      newPricePerShare: newPricePerShare.toFixed(2),
   }
}