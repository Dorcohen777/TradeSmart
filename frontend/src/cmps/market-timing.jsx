import { useEffect } from 'react'
import { marketTiming } from '../services/market-timing'
import { utilService } from '../services/util.service'

export function MarketTimeing() {
   useEffect(() => {
      const currDate = utilService.getCurrentDateForTiming()
      marketTiming.fetchVIXData(currDate)
   }, [])

   return (
      <section className='market-timing-container'>
         <h1>Market timing</h1>
         <h3>
            the market timing bird will give you alerts about the market
            condition
         </h3>
      </section>
   )
}
