import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

// services / utils
import { tradeService } from '../services/trade.service.local'
import { utilService } from '../services/util.service'
import { addTrade, loadTrades, removeTrade } from '../store/trade.actions'
import { Link, Outlet } from 'react-router-dom'

export function UserDashboard() {
   const storeTrades = useSelector(
      (storeState) => storeState.tradeModule.trades
   )
   const user = useSelector((storeState) => storeState.userModule.user)
   const [accountPl, setUserPl] = useState(0)
   const [accountWinRate, setAccountWinRate] = useState(0)
   const [userTrades, setUserTrades] = useState([])
   const [emptyTrade, setEmptyTrade] = useState(tradeService.getEmptyTrade())
   const [newStrategy, setNewStrategy] = useState({ strategyName: '' })
   const [newTrade, setNewTrade] = useState({
      symbol: '',
      amount: 0,
      entryPrice: 0,
      exitPrice: 0,
      day: '',
      pl: 0,
      timestamp: null,
      strategyType: null,
   })
   const [riskManagement, setRiskManagement] = useState({
      size: 0,
      percentage: 0,
   })
   const [calcExitPoint, setCalcExitPoint] = useState({
      tradeRisk: 0,
      sharesAmount: 0,
      riskEntryPrice: 0,
   })
   const [riskManagementRes, setRiskManagementRes] = useState(null)
   const [tradeExitPrice, setTradeExitPrice] = useState(null)

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

   function onTransactionClick(newTrade) {
      newTrade.day = utilService.getDate()
      newTrade.pl = tradeService.calculatePL(
         newTrade.symbol,
         newTrade.amount,
         newTrade.entryPrice,
         newTrade.exitPrice
      )
      newTrade.timestamp = Date.now()
      addTrade(newTrade)
   }

   function handleInputChange(event) {
      const { name, value } = event.target
      setNewTrade((prevTrade) => ({
         ...prevTrade,
         [name]: value,
      }))
   }

   function handleExitTradeChange(ev) {
      const { name, value } = ev.target
      setCalcExitPoint((prevRiskCalc) => ({
         ...prevRiskCalc,
         [name]: value,
      }))
      console.log('calcExitPoint', calcExitPoint)
   }

   function onRiskManagementChange(ev) {
      const { name, value } = ev.target
      setRiskManagement((newRisk) => ({
         ...newRisk,
         [name]: value,
      }))
   }

   function calcRisk() {
      const res = tradeService.calculateRiskAmount(
         riskManagement.size,
         riskManagement.percentage
      )
      setRiskManagementRes(res)
   }

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

   function calcTradeRisk() {
      const res = tradeService.calculatePercentageAndPrice(
         calcExitPoint.tradeRisk,
         calcExitPoint.sharesAmount,
         calcExitPoint.riskEntryPrice
      )
      console.log('res', res)
      setTradeExitPrice(res)
   }

   function handleChangeStrategy(ev) {
      const { name, value } = ev.target
      setNewStrategy((prevStr) => ({
         ...prevStr,
         [name]: value,
      }))
   }

   async function onRemoveTrade(tradeId) {
      console.log('tradeId', tradeId)
      await removeTrade(tradeId)
   }

   async function onSearchTrade(ev) {
      const { value } = ev.target
      emptyTrade.symbol = value
      console.log('emptyTrade', emptyTrade)
      await loadTrades(emptyTrade)
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
               <div className='dashboard-actions-main-container'>
                  <div className='transaction-header'>
                     <input
                        type='search'
                        name='search-trade'
                        id=''
                        placeholder='search symbol'
                        className='dashboard-search'
                        onChange={(ev) => onSearchTrade(ev)}
                     />
                  </div>
                  <div className='stock-alert-btn-container'>
                     <Link to={'alert'}>
                        <button className='stock-alert-btn btn-style-3'>
                           Set stock alert{' '}
                        </button>
                     </Link>
                  </div>
               </div>

               <table className='transaction-table'>
                  <tbody>
                     <tr className='table-header-titles-container'>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Symbol</th>
                        <th>Shares</th>
                        <th>Entry price</th>
                        <th>Exit price</th>
                        <th>Side</th>
                        <th>Return $</th>
                        <th>Strategy type</th>
                        <th>Edit trade</th>
                        <th>Delete trade</th>
                     </tr>
                     {userTrades.length === 0 && (
                        <tr className='tr-no-trades-msg'>
                           <th>No Trades Found - add your first trade</th>
                        </tr>
                     )}

                     {userTrades
                        ? userTrades.map((trade, idx) => {
                             return (
                                <tr key={idx}>
                                   <td
                                      className={`td-status ${
                                         trade.pl > 0 ? 'win' : 'lose'
                                      }`}
                                   >
                                      {trade.pl > 0 ? 'WIN' : 'LOSE'}
                                   </td>
                                   <td>{trade.day}</td>
                                   <td className='td-symbol'>{trade.symbol}</td>
                                   <td>{trade.amount}</td>
                                   <td>{trade.entryPrice}</td>
                                   <td>{trade.exitPrice}</td>
                                   <td className='td-side'>long</td>
                                   <td
                                      className={`td-pl ${
                                         trade.pl > 0 ? 'positive' : 'negative'
                                      }`}
                                   >
                                      ${trade.pl}
                                   </td>
                                   <td>
                                    {trade.strategyType && trade.strategyType}
                                    {/* {trade.strategyType === 'noStrategy' && 'no strategy'} */}
                                   </td>
                                   <td>
                                      <Link to={`edit/${trade._id}`}>
                                         <button className='btn-style-3'>
                                            edit
                                         </button>
                                      </Link>
                                   </td>
                                   <td>
                                      <button
                                         className='btn-style-3'
                                         onClick={() =>
                                            onRemoveTrade(trade._id)
                                         }
                                      >
                                         X
                                      </button>
                                   </td>
                                </tr>
                             )
                          })
                        : ''}
                  </tbody>
               </table>
            </div>

            <div className='calculation-container'>
               <div className='trade-exit-calculator-container input-container-style-dash'>
                  <h2>Calculate trade exit</h2>
                  <div className='exit-calculator-inner-container'>
                     <label htmlFor=''>Maximum risk</label>
                     <input
                        type='number'
                        name='tradeRisk'
                        onChange={(ev) => handleExitTradeChange(ev)}
                     />
                     <label htmlFor=''>Shares amount</label>
                     <input
                        type='number'
                        name='sharesAmount'
                        onChange={(ev) => handleExitTradeChange(ev)}
                     />
                     <label htmlFor=''>Entry price</label>
                     <input
                        type='number'
                        name='riskEntryPrice'
                        onChange={(ev) => handleExitTradeChange(ev)}
                     />
                     <button
                        className='btn-style-3'
                        onClick={() => calcTradeRisk()}
                     >
                        Calculate
                     </button>
                     <h3>
                        exit price:{' '}
                        <span>
                           {tradeExitPrice &&
                              tradeExitPrice.newPricePerShare + '$'}
                        </span>
                     </h3>
                     <h3>
                        percentage change:{' '}
                        <span>
                           {tradeExitPrice &&
                              tradeExitPrice.percentageDecrease + '%'}
                        </span>
                     </h3>
                  </div>
               </div>

               <div className='dashboard-risk-main-container'>
                  <div className='dashboard-risk-inner-container input-container-style-dash'>
                     <h2 className=''>Risk management calculator</h2>
                     <div>
                        <input
                           type='number'
                           name='size'
                           placeholder='account size'
                           onChange={(ev) => onRiskManagementChange(ev)}
                        />
                     </div>
                     <div className='risk-percentage-container'>
                        <input
                           type='number'
                           name='percentage'
                           placeholder='risk-percentage'
                           onChange={(ev) => onRiskManagementChange(ev)}
                        />
                     </div>
                     <button
                        className='risk-calc-btn btn-style-3'
                        onClick={() => calcRisk()}
                     >
                        Calculate
                     </button>
                     <div>
                        <h3>
                           Maximum loss:{' '}
                           <span>
                              {riskManagementRes}
                              {riskManagementRes && '$'}
                           </span>
                        </h3>
                     </div>
                  </div>
               </div>
            </div>

            <div className='new-trade-main-container'>
               <div className='transaction-first-container'>
                  <div className='transaction-new-trade-container input-container-style-dash'>
                     <h2>Add new trade</h2>
                     <label>Stock symbol</label>
                     <input
                        type='text'
                        value={newTrade.symbol}
                        name='symbol'
                        onChange={handleInputChange}
                     />

                     <label>Shares amount</label>
                     <input
                        type='number'
                        value={newTrade.amount === 0 ? '' : newTrade.amount}
                        name='amount'
                        onChange={handleInputChange}
                     />

                     <label>Entry price</label>
                     <input
                        type='number'
                        value={
                           newTrade.entryPrice === 0 ? '' : newTrade.entryPrice
                        }
                        name='entryPrice'
                        onChange={handleInputChange}
                     />

                     <label>Exit price</label>
                     <input
                        type='number'
                        value={
                           newTrade.exitPrice === 0 ? '' : newTrade.exitPrice
                        }
                        name='exitPrice'
                        onChange={handleInputChange}
                     />
                     <button
                        className='btn-style-3'
                        onClick={() => onTransactionClick(newTrade)}
                     >
                        Add new trade
                     </button>
                  </div>
                  <div className='new-strategy-container input-container-style-dash'>
                     <h2>Add new strategy</h2>
                     <label htmlFor=''>strategy name</label>
                     <input
                        type='text'
                        name='strategyName'
                        onChange={(ev) => handleChangeStrategy(ev)}
                     />
                     <button
                        className='btn-style-3'
                        onClick={() =>
                           tradeService.saveNewStrategy(newStrategy)
                        }
                     >
                        Add
                     </button>
                  </div>
               </div>
            </div>
         </section>
      </>
   )
}
