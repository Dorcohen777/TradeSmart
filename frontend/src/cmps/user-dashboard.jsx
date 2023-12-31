import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

// services / utils
import { tradeService } from '../services/trade.service'
import { addTrade, loadTrades, removeTrade } from '../store/trade.actions'
import { Link, Outlet } from 'react-router-dom'
import { UserMsg } from './user-msg'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
//cmp
import { CalcContainer } from './dashboardSidebar/calculation-dashboard'
import { SideBarLeft } from './dashboardSidebar/calculation-left-dashboard'
import { TableData } from './dashboardSidebar/table-dashboard'
import { HeaderDashboard } from './dashboardSidebar/header-dashboard'
import { UserboardNavBar } from '../pages/user-dashboard-nav-menu'

export function UserDashboard() {
   const storeTrades = useSelector(
      (storeState) => storeState.tradeModule.trades
   )
   const user = useSelector((storeState) => storeState.userModule.user)
   const [accountPl, setUserPl] = useState(0)
   const [accountWinRate, setAccountWinRate] = useState(0)
   const [tradesAveragePercentage, setTradesAveragePercentage] = useState(0)
   const [strategyWinRate, setStrategyWinRate] = useState(null)
   const [userTrades, setUserTrades] = useState([])

   useEffect(() => {
      const fetchTrades = async () => {
         
         const trades = await tradeService.getTrades(user._id, storeTrades)
         setUserTrades(trades)
      }

      // Fetch trades only when storeTrades or user._id changes
      if (storeTrades.length > 0 && user._id) {
         fetchTrades()
      }
   }, [storeTrades, user._id])

   useEffect(() => {
      // calculate account p/l
      const accountPl = tradeService.calculateAccountPl(userTrades)
      setUserPl(accountPl)

      // calculate account win rate
      const accountWinRate = tradeService.calculateWinRate(userTrades)
      setAccountWinRate(accountWinRate)

      // calculate each strategy win rate
      const strategyWinRateResult = tradeService.calcStrategyWinRate(userTrades)
      setStrategyWinRate(strategyWinRateResult)

      // calculate all average trades percentage change
      const tradesPercentageChange = tradeService.accountTradesAveragePercentage(userTrades)
      setTradesAveragePercentage(tradesPercentageChange)
   }, [userTrades])

   async function onRemoveTrade(tradeId) {
      await removeTrade(tradeId)
      showSuccessMsg('Trade removed')
   }

   return (
      <>
         <section className='dashboard-main-container'>
            <div>
               <UserboardNavBar />
            </div>
            
            <div className='transaction-data-container'>
               <div className='dashboard-titles'>
                  <div className='dash-acc-data-container'>
                     <h3>Welcome {user.fullname}</h3>
                  </div>

                  <div className='dash-acc-data-container'>
                     <h3>Account P/L: ${accountPl}</h3>
                  </div>

                  <div className='dash-acc-data-container'>
                     <h3>Win Rate: {accountWinRate}%</h3>
                  </div>

                  <div className='dash-acc-data-container'>
                     <h3>Average trades percentage change: {tradesAveragePercentage.toFixed(2) + '%'}</h3>
                  </div>

                  <Outlet />
                  <UserMsg/>
               </div>

               <h2 className='table-title'>Transactions Panel</h2>

               <HeaderDashboard loadTrades={loadTrades} />

               <TableData
                  onRemoveTrade={onRemoveTrade}
                  userTrades={userTrades}
               />
            </div>

            <div className='calculation-container scroll-bar-style-2'>
               <CalcContainer />
            </div>

            <div className='new-trade-main-container scroll-bar-style-2'>
               <SideBarLeft
                  addTrade={addTrade}
                  strategyWinRate={strategyWinRate}
               />
            </div>
         </section>
      </>
   )
}
