import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// imports
import { tradeService } from '../services/trade.service.local'
import { updateTrade } from '../store/trade.actions'
import { userService } from '../services/user.service'

export function EditTrade() {
   const params = useParams()
   const [currTrade, setCurrTrade] = useState(null)
   const [editTrade, setEditTrade] = useState({})
   const [userStrategy, setUserStrategy] = useState([])
   const [selectedStrategy, setSelectedStrategy] = useState('')
   const navigate = useNavigate()

   useEffect(() => {
      const findTrade = async () => {
         const trade = await tradeService.getById(params.id)
         setCurrTrade(trade)
         setEditTrade(trade) // Set the initial state of editTrade
      }
      findTrade()

      const currUser = userService.getLoggedinUser()
      const userId = currUser._id
      const userStrategy = async () => {
         const str = await tradeService.filterStrategyByUser(userId)
         await setUserStrategy(str)
      }
      userStrategy()
   }, [])

   function onEditChange(event) {
      const { name, value } = event.target
      console.log('name', name)
      console.log('value', value)
      setEditTrade((prevTrade) => ({
         ...prevTrade,
         [name]: value,
      }))
   }

   function onSaveTrade(trade) {
      console.log('trade', trade)

      if (selectedStrategy) {
         trade.strategyType = selectedStrategy
      }

      const plUpdate = tradeService.calculatePL(
         trade.symbol,
         trade.amount,
         trade.entryPrice,
         trade.exitPrice
      )
      trade.pl = plUpdate
      updateTrade(trade)
   }

   function onCloseEdit() {
      navigate('/user-dashboard')
   }

   function onStrategyChange(event) {
      const selectedStrategyValue = event.target.value
      console.log('selectedStrategyValue', selectedStrategyValue)
      setSelectedStrategy(selectedStrategyValue)
   }

   if (!currTrade) return <div>Loading...</div>
   return (
      <section className='edit-container'>
         <div className='edit-content input-container-style-dash'>
            <h2 className='edit-trade-title'>Edit trade</h2>
            <h3>
               Symbol:{' '}
               <span className='edit-symbol-name'>{currTrade.symbol} </span>
            </h3>
            <div className='edit-inputs'>
               <label htmlFor=''>Amount</label>
               <input
                  type='number'
                  name='amount'
                  value={editTrade.amount}
                  onChange={onEditChange}
               />
               <label htmlFor=''>Entry price</label>
               <input
                  type='number'
                  name='entryPrice'
                  value={editTrade.entryPrice}
                  onChange={onEditChange}
               />
               <label htmlFor=''>Exit price</label>
               <input
                  type='number'
                  name='exitPrice'
                  value={editTrade.exitPrice}
                  onChange={onEditChange}
               />

               {userStrategy.length ? (
                  <>
                     <select
                        value={selectedStrategy}
                        onChange={onStrategyChange}
                     >
                        <option value={'No strategy'}>Select strategy</option>
                        {userStrategy.map((str, idx) => {
                           return (
                              <option key={idx} value={str.strategyName}>
                                 {str.strategyName}
                              </option>
                           )
                        })}
                     </select>
                  </>
               ) : (
                  <p>No strategies found, <br/> create new one</p>
               )}

               <button
                  className='btn-style-3 save-btn'
                  onClick={() => onSaveTrade(editTrade)}
               >
                  Save
               </button>
            </div>
            <button
               className='btn-exit btn-style-3'
               onClick={() => onCloseEdit()}
            >
               X
            </button>
         </div>
      </section>
   )
}
