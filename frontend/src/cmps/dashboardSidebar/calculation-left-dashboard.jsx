import { useEffect, useState } from 'react'
import { tradeService } from '../../services/trade.service.local'
import { utilService } from '../../services/util.service'
import { useSelector } from 'react-redux'

export function SideBarLeft({ addTrade, strategyWinRate }) {
   const [newTrade, setNewTrade] = useState(tradeService.emptyTrade())
   const [newStrategy, setNewStrategy] = useState({ strategyName: '' })

   function handleInputChange(event) {
      const { name, value } = event.target
      setNewTrade((prevTrade) => ({
         ...prevTrade,
         [name]: value,
      }))
   }

   function handleChangeStrategy(ev) {
      const { name, value } = ev.target
      setNewStrategy((prevStr) => ({
         ...prevStr,
         [name]: value,
      }))
   }

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
   console.log('from left-calculation', strategyWinRate)
   return (
      <section>
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
                  value={newTrade.entryPrice === 0 ? '' : newTrade.entryPrice}
                  name='entryPrice'
                  onChange={handleInputChange}
               />

               <label>Exit price</label>
               <input
                  type='number'
                  value={newTrade.exitPrice === 0 ? '' : newTrade.exitPrice}
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
                  onClick={() => tradeService.saveNewStrategy(newStrategy)}
               >
                  Add
               </button>
            </div>
            <div className='strategy-container input-container-style-dash'>
               <h2 className='underline-style-white'>
                  Strategy Data & Insight
               </h2>
               <div className='strategy-data-container'>
                  <h4>Strategy WinRate</h4>
                  {strategyWinRate &&
                     strategyWinRate.map((str) => {
                        if (str.strategyType !== 'null') {
                           return (
                              <p key={str.strategyType} className='strategy-title'>
                                 {str.strategyType}
                                 <div
                                    style={{
                                       width: `${str.winRate}%`, 
                                       height: '10px', 
                                       backgroundColor: '#00B399',
                                       borderRadius: '0.2rem',
                                    }}
                                 ></div>
                                 {str.winRate}%
                              </p>
                           )
                        } else {
                           return null
                        }
                     })}
               </div>
            </div>
         </div>
      </section>
   )
}
