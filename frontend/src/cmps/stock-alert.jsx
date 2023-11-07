import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { stockDataService } from '../services/stock.data.service'
import { userService } from '../services/user.service'
import { useDispatch, useSelector } from 'react-redux'
import { SET_USER_ALERTS } from '../store/trade.reducer'
import { addNewAlert, removeAlert, setStockAlerts } from '../store/trade.actions'

export function StockAlert() {
   const navigate = useNavigate()
   const [stocksAlertData, setStocksAlertData] = useState({
      symbol: '',
      alertPrice: null,
   })
   const userAlerts = useSelector((storeState) => storeState.tradeModule.userAlerts) 

   function onSetAlert(symbol) {
      // stockDataService.saveStockAlert(symbol)
      addNewAlert(symbol)
   }

   function handleAlertChange(ev) {
      const { value, name } = ev.target

      setStocksAlertData((prevAlert) => ({
         ...prevAlert,
         [name]: value,
      }))
   }

   useEffect(() => {
      
      // const userAlert = stockDataService.fetchUserAlerts()
      // setStockAlerts(userAlert)
   }, [])

   function onCloseAlert() {
      navigate('/user-dashboard')
   }

   function onRemoveAlert(alertId) {
      removeAlert(alertId)
   }

   if (!userAlerts) return <div>Loading...</div>
   return (
      <section className='stock-alert-main-container'>
         <div className='stock-alert-child-container'>
            <div className='stock-alert-items-container input-container-style-dash'>
               <h2 className='underline-style-white'>Set stock alert</h2>
               <label htmlFor=''>symbol</label>
               <input
                  type='text'
                  name='symbol'
                  onChange={(ev) => handleAlertChange(ev)}
               />

               <label htmlFor=''>price</label>
               <input
                  type='number'
                  name='alertPrice'
                  onChange={(ev) => handleAlertChange(ev)}
               />

               <button
                  className='btn-style-3'
                  onClick={() => onSetAlert(stocksAlertData)}
               >
                  set alert
               </button>
               <p>When stock will reach the price, user get notification</p>
               <button
                  className='stock-alert-exit-btn btn-style-3'
                  onClick={() => onCloseAlert()}
               >
                  {' '}
                  X
               </button>
            </div>
            <div className='stocks-alert-list-container'>
               <table>
                  <tbody>
                     <tr>
                        <th>symbol</th>
                        <th>alert price</th>
                     </tr>

                     {userAlerts.map((alert, idx) => {
                        return (
                           <tr key={idx}>
                              <td>{alert.symbol}</td>
                              <td>{alert.alertPrice}</td>
                              <td>
                                 <button onClick={() => onRemoveAlert(alert._id)}>x</button>
                              </td>
                           </tr>
                        )
                     })}
                  </tbody>
               </table>
            </div>
         </div>
      </section>
   )
}
