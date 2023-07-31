export function HomeQuote() {
   return (
      <section className='quote-main-container main-layout'>
        <h3 className="quote-title before-underline-style"> Words of Wisdom from Market Legends</h3>
         <div className='quote-inner-container'>
            <div className='mark-text-container quote-container-style'>
               <h2>
                  <span>"</span> The more data you have, the better decisions
                  you can make. Data is the foundation of good trading.{' '}
                  <span>"</span>
               </h2>
               <p>Mark Minervini, stock trader and author</p>
            </div>
            <div className='jesse-text-container quote-container-style'>
               <h2>
                  <span>"</span> The market is a discounting mechanism that
                  reflects all available information. If you have the right
                  data, you can beat the market. <span>"</span>
               </h2>
               <p>Jesse Livermore, stock trader and author</p>
            </div>
         </div>
      </section>
   )
}
