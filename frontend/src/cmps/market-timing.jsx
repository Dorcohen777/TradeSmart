import { useEffect } from 'react'
import { marketTiming } from '../services/market-timing'
import { utilService } from '../services/util.service'
import { Footer } from '../pages/footer'

export function MarketTimeing() {
   useEffect(() => {
      const currDate = utilService.getCurrentDateForTiming()
      marketTiming.fetchVIXData(currDate)
   }, [])

   return (
      <section className='market-timing-main-container'>
         <div className='market-timing-container'>
            <h1>Market timing</h1>
            <h3>coming soon...</h3>
         </div>
         <Footer/>
      </section>
   )
}
