import infoOne from '../assets/img/homePage-info/homeinfo1.jpg'

export function HomeInfo() {
   return (
      <section className='info-main-container main-layout'>
         <div className='info-inner-container'>
            <div className='info-text-container'>
               <h2>
                  Unlock the Power of Data: Accelerate Your Trading Success
               </h2>
               <p>
                  Discover the crucial data that can make or break your trading
                  journey. Gain a deeper understanding of your trades and embark
                  on a path towards profitability.
               </p>
               <p>
                  TradeSmart offers a seamless and intuitive interface to access
                  and analyze calculated data effortlessly, empowering you to
                  become a more skillful and successful trader.
               </p>
            </div>
            <div className='info-img-container'>
               <img src={infoOne} className='info-img-one' />
            </div>
         </div>
      </section>
   )
}
