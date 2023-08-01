import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

// services / utils
import { tradeService } from '../services/trade.service.local'
import { addTrade, loadTrades, removeTrade } from '../store/trade.actions'
import { Link, Outlet } from 'react-router-dom'

//cmp
import { CalcContainer } from './dashboardSidebar/calculation-dashboard'
import { SideBarLeft } from './dashboardSidebar/calculation-left-dashboard'
import { TableData } from './dashboardSidebar/table-dashboard'
import { HeaderDashboard } from './dashboardSidebar/header-dashboard'

export function UserDashboard() {
   const storeTrades = useSelector(
      (storeState) => storeState.tradeModule.trades
   )
   const user = useSelector((storeState) => storeState.userModule.user)
   const [accountPl, setUserPl] = useState(0)
   const [accountWinRate, setAccountWinRate] = useState(0)
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
      calculateAccountPl(userTrades)
      calculateWinRate(userTrades)
   }, [userTrades])

   function calculateAccountPl(userTrades) {
      const plArr = userTrades.map((trade) => trade.pl) // getting array
      const userPl = plArr.reduce(
         (accumulator, currentValue) => accumulator + currentValue,
         0
      )
      setUserPl(userPl)
   }

   function calculateWinRate(userTrades) {
      const totalTrades = userTrades.length
      if (totalTrades === 0) {
         return 0
      }

      const winningTrades = userTrades.filter((trade) => trade.pl > 0)
      const winRate = (winningTrades.length / totalTrades) * 100
      setAccountWinRate(winRate.toFixed(2))
   }

   async function onRemoveTrade(tradeId) {
      console.log('tradeId', tradeId)
      await removeTrade(tradeId)
   }

   return (
      <>
         <section className='dashboard-main-container'>
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

                  <Outlet />
               </div>

               <h2 className='table-title'>Transactions Panel</h2>

               <HeaderDashboard loadTrades={loadTrades} />

               <TableData
                  onRemoveTrade={onRemoveTrade}
                  userTrades={userTrades}
               />
            </div>

            <div className='calculation-container'>
               <CalcContainer />
            </div>

            <div className='new-trade-main-container'>
               <SideBarLeft addTrade={addTrade} />
            </div>
         </section>
      </>
   )
}
