import { useState } from 'react'
import { tradeService } from '../../services/trade.service.local'
import { utilService } from '../../services/util.service'

export function SideBarLeft({ addTrade }) {
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
            <div className='input-container-style-dash'>
               <h2>Strategy Data & Insight</h2>
               <p>str1 50% winrate</p>
               <p>str2 20% winrate</p>
            </div>
         </div>
      </section>
   )
}
