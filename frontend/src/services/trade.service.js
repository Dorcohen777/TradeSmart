// import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'

const STORAGE_KEY = 'tradesDB'

export const tradeService = {
   query,
   getById,
   save,
   remove,
   getTrades,
   saveNewStrategy,
   filterStrategyByUser,
   calculatePL,
   calculatePercentageChange,
   calculateRiskAmount,
   calculatePercentageAndPrice,
   emptyTrade,
   newRiskManagement,
   newCalcExitPoint,
   calcStrategyWinRate,
   calculateAccountPl,
   calculateWinRate,
   createDemoUser,
   accountTradesAveragePercentage,
   getEmptyTrade,
}

window.cs = tradeService

async function query(filterBy = { symbol: '' }) {
   console.log('trying to load trades from http trade service')
   return httpService.get(STORAGE_KEY, filterBy)
   // TODO filter should be handle in the backend (node server)
}

function getById(tradeId) {
   return httpService.get(`trade/${tradeId}`)
   // TODO backend should return trade by his Id
}

async function remove(tradeId) {
   return httpService.delete(`trade/${tradeId}`)
   // TODO backend should remove trade from database
}

async function save(trade) {
   var savedTrade
   if (trade._id) {
      savedTrade = await httpService.put(`trade/${trade._id}`, trade) // if trade has Id so update
   } else {
      savedTrade = await httpService.post('trade', trade) // if trade does not has id create add new trade
   }
   return savedTrade
}

// send request to get all strategies
async function getStrategies() {
   return httpService.get('/allStrategies')
}



// ## Functions - section 2  ## //

// getting all the trades by the specific user
async function getTrades(userId, storeTrades) {
   if (!userId) return 'userId require'
   const filterTradesByUser = storeTrades.filter(
      (trade) => trade.owner._id === userId
   )

   return filterTradesByUser
}

// sending request for adding new strategy
async function saveNewStrategy(newStrategy) {
   newStrategy.owner = userService.getLoggedinUser()
   const saveStrategy = await httpService.post('/newStrategy', newStrategy)
   return saveStrategy
}

// filter strategy by login user
async function filterStrategyByUser(userId) {
   const allStrategies = await getStrategies()
   const filterStrategy = allStrategies.filter(
      (str) => str.owner._id === userId
   )
   return filterStrategy
}


function calculatePL(symbol, sharesAmount, entryPrice, exitPrice) {
   if (!exitPrice) return null
   const totalCost = sharesAmount * entryPrice
   const totalRevenue = sharesAmount * exitPrice
   const profitLoss = totalRevenue - totalCost
   const fixedProfitLoss = Math.round(profitLoss * 100) / 100
   return fixedProfitLoss
}

// calculate percentage change
function calculatePercentageChange(entryPrice, exitPrice) {
   if (!exitPrice) return null

   const percentageChange = ((exitPrice - entryPrice) / entryPrice) * 100
   const fixedPercentageChange = Math.round(percentageChange * 100) / 100

   return fixedPercentageChange
}

// calculate risk percentage from dollar value
function calculateRiskAmount(accountValue, riskPercentage) {
   console.log('accountValue', accountValue)
   console.log('riskPercentage', riskPercentage)
   var riskAmount = (accountValue * riskPercentage) / 100
   return riskAmount
}

// calculate stop loss and percentage change
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

function getEmptyTrade() {
   const filterBy = { symbol: '' }
   return filterBy
}


function emptyTrade() {
   const newTrade = {
      symbol: '',
      amount: 0,
      entryPrice: 0,
      exitPrice: 0,
      day: '',
      pl: 0,
      timestamp: null,
      strategyType: null,
   }
   return newTrade
}

function newRiskManagement() {
   const newRiskManagement = {
      size: 0,
      percentage: 0,
   }
   return newRiskManagement
}

function newCalcExitPoint() {
   const newCalc = {
      tradeRisk: 0,
      sharesAmount: 0,
      riskEntryPrice: 0,
   }
   return newCalc
}

// calculation functions for dashboard

function calculateAccountPl(userTrades) {
   const plArr = userTrades.map((trade) => trade.pl) // getting array
   const userPl = plArr.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
   )
   return userPl
}

function calculateWinRate(userTrades) {
   const totalTrades = userTrades.length
   if (totalTrades === 0) {
      return 0
   }

   const winningTrades = userTrades.filter((trade) => trade.pl > 0)
   const winRate = (winningTrades.length / totalTrades) * 100
   return winRate.toFixed(2)
}

// calculate strategy win rate
function calcStrategyWinRate(userTrades) {
   const countStrategy = userTrades.reduce((acc, trade) => {
      if (trade.pl > 0) {
         if (acc[trade.strategyType]) {
            acc[trade.strategyType].winCount += 1
         } else {
            acc[trade.strategyType] = {
               winCount: 1,
               totalTrades: 0,
            }
         }
      }

      if (acc[trade.strategyType]) {
         acc[trade.strategyType].totalTrades += 1
      } else {
         acc[trade.strategyType] = {
            winCount: 0,
            totalTrades: 1,
         }
      }

      return acc
   }, {})

   const winRateResults = []

   for (const strategyType in countStrategy) {
      const winCount = countStrategy[strategyType].winCount
      const totalTrades = countStrategy[strategyType].totalTrades
      const winRate = (winCount / totalTrades) * 100

      const resultObj = {
         strategyType: strategyType,
         winRate: parseFloat(winRate.toFixed(2)),
      }

      winRateResults.push(resultObj)
   }
   return winRateResults
}

function accountTradesAveragePercentage(userTrades) {
   const tradesAveragePerChange = userTrades.reduce((acc, val) => {
      console.log('acc', acc)
      console.log('val', val.percentage)

      return acc + val.percentage
   }, 0)

   const calcAverage = tradesAveragePerChange / userTrades.length
   return calcAverage
}

// home page functions
function createDemoUser() {
   const demoUser = {
      fullname: 'demo',
      imgUrl:
         'https://www.talpiot.ac.il/wp-content/themes/matat-child/assets/images/12.png',
      username: 'demoUser',
      password: '123',
      _id: utilService.makeId(),
   }

   return demoUser
}

// ---------------------------------------------------------------- //

// async function addCarMsg(carId, txt) {
//     const savedMsg = await httpService.post(`car/${carId}/msg`, {txt})
//     return savedMsg
// }

// function getEmptyCar() {
//     return {
//         vendor: 'Susita-' + (Date.now() % 1000),
//         price: utilService.getRandomIntInclusive(1000, 9000),
//     }
// }
