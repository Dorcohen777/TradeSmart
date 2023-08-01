import { useState } from 'react'
import { tradeService } from '../../services/trade.service.local'
import { Link } from 'react-router-dom'

export function HeaderDashboard({ loadTrades }) {
   const [emptyTrade, setEmptyTrade] = useState(tradeService.getEmptyTrade())
   async function onSearchTrade(ev) {
      const { value } = ev.target
      emptyTrade.symbol = value
      console.log('emptyTrade', emptyTrade)
      await loadTrades(emptyTrade)
   }
   return (
      <section>
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
      </section>
   )
}
